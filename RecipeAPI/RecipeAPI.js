const RecipeAPI = {
	
	_recipes: null,
	_debug: false,
	_initiated: false,
	
	CONSTANTS: {
		TYPE_ERRORED: 1,
		TYPE_SHAPED_CRAFTING: 2,
		TYPE_SHAPELESS_CRAFTING: 4,
		TYPE_SMELTING: 8,
		ERROR_PARSING_INVALID_LENGTH: 1
	},
	
	_debug(message, data = null) {
		if (!RecipeAPI._debug) return;
		message = 'RecipeAPI::' + message;
		if (data) {
			console.debug(message, data);
		}
		else {
			console.debug(message);
		}
	},
	
	_parseShapedRecipeToJson(recipe) {
		// Synthax: [mod*0]:[itemname*0]_____[count*0]_____[metadata*0]_____{[nbt*0]}_____[row 1 vars],[row 2 vars],[row 3 vars]_____[declaration*1]_____[mod*1]:[itemname*1]_____[metadata*1]_____{[nbt-tags*1]}_____[declaration*n]_____[mod*n]:[itemname*n]_____[metadata*n]_____{[nbt-tags*n]}
		
		recipe = recipe.split('_____');
		
		// 41 is the maximum amount of array items: The output item takes together with the crafting field 5 array items, the input items takes 4 each. 4 * 9 + 5 = 41
		// 9 is the minumum amount of array items: The output item takes together with the crafting field 5 array items, the input items takes 4 each. At least 1 input item is required. 5 + 4 * 1 = 9
		// Modulo 4 is to check if the string is complete (The input items are taking 4 array items each. So the array length (without the output item array items) modulo 4 should be 0).
		if ((recipe.length - 5) % 4 !== 0 && recipe.length <= 41 && recipe.length >= 9) throw {e: RecipeAPI.CONSTANTS.ERROR_PARSING_INVALID_LENGTH, msg: `Error parsing recipe: Invalid recipe length: '${recipe.length}'.`};
		
		recipe[0] = recipe[0].split(':');
		
		// Get all declarations
		var declarations = {};
		for (var i = 5; i < recipe.length; i += 4) {
			recipe[i + 1] = recipe[i + 1].split(':');
			declarations[recipe[i]] = {
				mod: recipe[i + 1][0],
				name: recipe[i + 1][1],
				meta: Number(recipe[i + 2]),
				nbt: recipe[i + 3]
			};
		}
		
		// Parse crafting field
		recipe[4] = recipe[4].split(',');
		for (var i = 0; i < 3; i++) {
			recipe[4][i] = recipe[4][i].split('');
			for (var j = 0; j < 3; j++) {
				recipe[4][i][j] = declarations[recipe[4][i][j]];
			}
		}
		
		// Final result
		recipe = {
			output: {
				mod: recipe[0][0],
				name: recipe[0][1],
				count: Number(recipe[1]),
				meta: Number(recipe[2]),
				nbt: recipe[3],
			},
			crafting: recipe[4]
		}
		
		return recipe;
	},
	_parseShapelessRecipeToJson(recipe) {
		// Synthax: [mod*0]:[itemname*0]_____[count*0]_____[metadata*0]_____{[nbt*0]}_____[mod*1]:[itemname*1]_____[metadata*1]_____{[nbt*1]}_____[mod*n]:[itemname*n]_____[metadata*n]_____{[nbt*n]}
		
		recipe = recipe.split('_____');
		
		// 40 is the maximum amount of array items: The output item takes 4 array items, the input items takes 4 each. 4 * 9 + 4 = 40
		// 8 is the minumum amount of array items: The output item takes 4 array items, the input items takes 4 each. At least 1 input item is required. 4 + 4 * 1 = 8
		// Modulo 4 is to check if the string is complete (The input items are taking 4 array items each. So the array length (without the output item array items) modulo 4 should be 0).
		if (recipe.length % 4 !== 0 && recipe.length <= 40 && recipe.length >= 8) throw {e: RecipeAPI.CONSTANTS.ERROR_PARSING_INVALID_LENGTH, msg: `Error parsing recipe: Invalid recipe length: '${recipe.length}'.`};
		
		recipe[0] = recipe[0].split(':');
		
		// Get all declarations
		var items = [];
		for (var i = 4, j = 0; i < recipe.length; i += 4, j++) {
			recipe[i] = recipe[i].split(':');
			items[j] = {
				mod: recipe[i][0],
				name: recipe[i][1],
				meta: Number(recipe[i + 1]),
				nbt: recipe[i + 2]
			};
		}
		
		// Final result
		recipe = {
			output: {
				mod: recipe[0][0],
				name: recipe[0][1],
				count: Number(recipe[1]),
				meta: Number(recipe[2]),
				nbt: recipe[3],
			},
			crafting: items
		}
		
		return recipe;
	},
	_parseSmeltingRecipeToJson(recipe) {
		// Synthax: [mod**0]:[itemname**0]_____[metadata**0]_____[mod**1]:[itemname**1]_____[metadata**1]_____{[nbt**1]}_____[count**1]_____[xp (optional)]
		
		recipe = recipe.split('_____');
		
		// The length must be 6 (without xp) or 7 (with xp).
		if (recipe.length !== 6 && recipe.length !== 7) throw {e: RecipeAPI.CONSTANTS.ERROR_PARSING_INVALID_LENGTH, msg: `Error parsing recipe: Invalid recipe length: '${recipe.length}'.`};
		
		recipe[0] = recipe[0].split(':');
		recipe[2] = recipe[2].split(':');
		
		recipe = {
			input: {
				mod: recipe[0][0],
				name: recipe[0][1],
				meta: Number(recipe[1])
			},
			output: {
				mod: recipe[2][0],
				name: recipe[2][1],
				meta: Number(recipe[3]),
				nbt: recipe[4],
				count: Number(recipe[5]),
			}
		}
		
		if (recipe.length === 7) recipe.xp = Number(recipe[6]);
		
		return recipe;
	},
	
	_sortByCategory(recipes) {
		
		var sortedRecipes = {};
		
		for (var i = 0; i < recipes.length; i++) {
			if (!sortedRecipes[recipes[i].category]) sortedRecipes[recipes[i].category] = [];
			sortedRecipes[recipes[i].category].push(recipes[i]);
		}
		
		return sortedRecipes;
	},
	
	/**
	 * Initiates the RecipeAPI.
	 * 
	 * @param recipes {String} Url to the recipes json file.
	 * @param debug {boolean} (Optional) Show debug messages.
	 */
	init(recipes, debug = false) {
		if (!jQuery) throw 'jQuery is required to run this script!';
		RecipeAPI._recipes = recipes;
		RecipeAPI._enableDebugInfo = debug;
		RecipeAPI._initiated = true;
	},
	
	/**
	 * Gets all recipes.
	 * 
	 * <p>Performs an jQuery JSON request and returns the content of recipes.json as a JSON Array.</p> 
	 * 
	 * @return {JSON Object} The recipes.
	 * 
	 * @throws {String} 'Missing precondition: RecipeAPI is not initiated.'
	 * @throws {Number} The received HTTP response code.
	 * @throws {String} 'Invalid datatype: \'[datatype]\'.'
	 */
	getRecipes() {
		if (RecipeAPI._initiated !== true) throw 'Missing precondition: RecipeAPI is not initiated.';
		
		var response = $.ajax({
			async: false,
			url: RecipeAPI._recipes,
			dataType: "json",
			error: (data) => {
				throw data.status;
			}
		});
		
		var dataType = response.responseJSON.__proto__.constructor;
		
		if (dataType !== Object) throw `Invalid datatype: '${dataType}'.`;
		
		return response.responseJSON;
	},
	
	/**
	 * Parses all recipes to HTML code.
	 * 
	 * @param {JSON Object} The recipes from RecipeAPI::getRecipes.
	 * 
	 * @return {JSON Object} The recipes.
	 *   {
	 *     {String category}: [
	 *       {
	 *         "category": {String},
	 *         "title": {String},
	 *         "description": {String},
	 *         "recipe": {HTML Element},
	 *         "type": {Integer @see RecipeAPI.CONSTANTS.TYPE_*},
	 *         "errored": [{boolean: true}|undefined]
	 *       }
	 *     ]
	 *   }
	 * 
	 * @throws {String} 'Missing precondition: RecipeAPI is not initiated.'
	 */
	parseRecipes(recipes) {
		if (RecipeAPI._initiated !== true) throw 'Missing precondition: RecipeAPI is not initiated.';
		if (recipes.__proto__.constructor !== Object) throw `Invalid parameter: 'recipes'`;
		
		var allRecipes = [];
		
		if (recipes.shaped.__proto__.constructor !== Array) throw new `Invalid section: 'shaped'`;
		if (recipes.shaped.length > 0) {
			for(var i = 0; i < recipes.shaped.length; i++) {
				try {
					recipes.shaped[i].recipe = RecipeAPI._parseShapedRecipeToJson(recipes.shaped[i].recipe);
					recipes.shaped[i].type = RecipeAPI.CONSTANTS.TYPE_SHAPED_CRAFTING;
				}
				catch (e) {
					switch (e.type) {
						case RecipeAPI.CONSTANTS.ERROR_PARSING_INVALID_LENGTH:
							console.error(`Error while parsing shaped#${i}: '${recipes.shaped[i].title}': recipe has unknown length.`);
							recipes.shaped[i].recipe = {
								type: RecipeAPI.CONSTANTS.TYPE_SHAPED_CRAFTING,
								errored: true
							};
							break;
						default:
							console.error(`Error while parsing shaped#${i}: '${recipes.shaped[i].title}':`, e);
							recipes.shaped[i].recipe = {
								type: RecipeAPI.CONSTANTS.TYPE_SHAPED_CRAFTING,
								errored: true
							};
							break;
					}
				}
				allRecipes.push(recipes.shaped[i]);
			}
		}
		if (recipes.shapeless.__proto__.constructor !== Array) throw new `Invalid section: 'shapeless'`;
		if (recipes.shapeless.length > 0) {
			for(var i = 0; i < recipes.shapeless.length; i++) {
				try {
					recipes.shapeless[i].recipe = RecipeAPI._parseShapelessRecipeToJson(recipes.shapeless[i].recipe);
					recipes.shapeless[i].type = RecipeAPI.CONSTANTS.TYPE_SHAPELESS_CRAFTING;
				}
				catch (e) {
					switch (e.type) {
						case RecipeAPI.CONSTANTS.ERROR_PARSING_INVALID_LENGTH:
							console.error(`Error while parsing shapeless#${i}: '${recipes.shapeless[i].title}': recipe has unknown length.`);
							recipes.shapeless[i].recipe = {
								type: RecipeAPI.CONSTANTS.TYPE_SHAPELESS_CRAFTING,
								errored: true
							};
							break;
						default:
							console.error(`Error while parsing shapeless#${i}: '${recipes.shapeless[i].title}':`, e);
							recipes.shapeless[i].recipe = {
								type: RecipeAPI.CONSTANTS.TYPE_SHAPELESS_CRAFTING,
								errored: true
							};
							break;
					}
				}
				allRecipes.push(recipes.shapeless[i]);
			}
		}
		if (recipes.smelting.__proto__.constructor !== Array) throw new `Invalid section: 'smelting'`;
		if (recipes.smelting.length > 0) {
			for(var i = 0; i < recipes.smelting.length; i++) {
				try {
					recipes.smelting[i].recipe = RecipeAPI._parseSmeltingRecipeToJson(recipes.smelting[i].recipe);
					recipes.smelting[i].type = RecipeAPI.CONSTANTS.TYPE_SMELTING;
				}
				catch (e) {
					switch (e.type) {
						case RecipeAPI.CONSTANTS.ERROR_PARSING_INVALID_LENGTH:
							console.error(`Error while parsing smelting#${i}: '${recipes.smelting[i].title}': recipe has unknown length.`);
							recipes.shapeless[i].recipe = {
								type: RecipeAPI.CONSTANTS.TYPE_SMELTING,
								errored: true
							};
							break;
						default:
							console.error(`Error while parsing smelting#${i}: '${recipes.smelting[i].title}':`, e);
							recipes.shapeless[i].recipe = {
								type: RecipeAPI.CONSTANTS.TYPE_SMELTING,
								errored: true
							};
							break;
					}
				}
				allRecipes.push(recipes.smelting[i]);
			}
		}
		
		allRecipes = RecipeAPI._sortByCategory(allRecipes);
		
		return allRecipes;
	}
};