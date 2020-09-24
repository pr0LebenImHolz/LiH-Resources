const RECIPE_STYLES = {
	HEADLINE_CATEGORY: '<div class="recipe_headline"><a href="%i">#</a><h2 id="%I">%c</h2></div>',
	HEADLINE_RECIPE: '<div class="recipe_headline"><a href="%i">#</a><h3 id="%I">%c</h3></div>',
	CONTAINER_CATEGORY: '<div class="recipe_category_container">%c</div>',
	CONTAINER_RECIPE: '<div class="recipe_recipe_container">%c</div>',
	CONTAINER_RECIPE_DESCRIPTION: '<p class="recipe_description">%c</p>',
};
const ERRORED_RECIPES = {
	SHAPED: '<div class="recipe_shaped"><div class="recipe_type errored"></div><table class="recipe_input"><tr><td><a></a></td><td><a></a></td><td><a></a></td></tr><tr><td><a></a></td><td><a></a></td><td><a></a></td></tr><tr><td><a></a></td><td><a></a></td><td><a></a></td></tr></table><div class="recipe_arrow"></div><div class="recipe_output"><a></a></div></div>',
	SHAPELESS: '<div class="recipe_shapeless"><div class="recipe_type errored"></div><table class="input"><tr><td><a></a></td><td><a></a></td><td><a></a></td></tr><tr><td><a></a></td><td><a></a></td><td><a></a></td></tr><tr><td><a></a></td><td><a></a></td><td><a></a></td></tr></table><div class="recipe_arrow"></div><div class="recipe_output"><a></a></div></div>',
	SMELTING: '<div class="recipe_smelting"><div class="recipe_type"></div><div class="recipe_input"><a></a><div class="recipe_flame"></div><a></a></div><div class="recipe_arrow"></div><div class="recipe_output"><a></a></div></div>'
};
function parseRecipes(recipes, itemUrl) {
	function _getItems(url) {
		try {
			var response = $.ajax({
				async: false,
				url: url,
				dataType: "json"
			});
			
			if (response.status != 200) throw response.status;
			
			var dataType = response.responseJSON.__proto__.constructor;
			
			if (dataType !== Object) throw `Invalid datatype: '${dataType}'.`;
		}
		catch (e) {
			switch (e) {
				case 404:
					e ='Internal error: Item file not found (Server responded with 404)';
					break;
				default:
					e = `Unknown error while getting items: '${e}'`;
					break;
			}
			throw e;
		}
		
		return response.responseJSON;
	}
	function _parseHeadline(style, content) {
		var i = content.toLowerCase().replaceAll(' ', '_');
		return RECIPE_STYLES[style].replaceAll('%c', content).replaceAll('%i', '#' + i).replaceAll('%I', i);
	}
	function _parseContainer(style, content) {
		return RECIPE_STYLES[style].replaceAll('%c', content);
	}
	function _parseRecipe(recipe) {
		
		function _getItem(arr) {
			var item = ITEMS.GAME;
			for (var i = 0; i < arr.length; i++) {
				try {
					if (arr[i] === "-1" ) arr[i] = "0";
					item = item[arr[i]];
				}
				catch (e) {
					console.warn(`Replaced item '${arr.join(":")}' with missingno texture`);
					return ITEMS.RECIPE_API.MISSINGNO;
				}
			}
			return item;
		}
		function _parseShapedTable(input) {
			var table = '';
			for (var i = 0; i < input.length; i++) {
				table += '<tr>';
				for (var j = 0; j < input[i].length; j++) {
					if (input[i][j]) {
						var item = _getItem([input[i][j].mod, input[i][j].name, input[i][j].meta]);
						table += `<td><a href="${item.href}" title="${item.title}"><img src="${item.img}" alt="${item.title[0]}" /></a></td>`;
					} else {
						table += '<td><a><img /></a></td>';
					}
				}
				table += '</tr>';
			}
			return table;
		}
		function _parseShapelessTable(input) {
			var table = '<tr>';
			var i = 0;
			for (var i = 0; i < 9; i++) {
				if (i < input.length) {
					var item = _getItem([input[i].mod, input[i].name, input[i].meta]);
					table += `<td><a href="${item.href}" title="${item.title}"><img src="${item.img}" alt="${item.title[0]}" /></a></td>`;
				}
				else {
					table += '<td><a><img /></a></td>';
				}
				if ((i + 1) % 3 === 0) table += '</tr><tr>';
			}
			return table;
		}
		switch (recipe.type) {
			case RecipeAPI.CONSTANTS.TYPE_SHAPED_CRAFTING:
				if (recipe.errored) return ERRORED_RECIPES.SHAPED;
				try {
					var output = _getItem([recipe.recipe.output.mod, recipe.recipe.output.name, recipe.recipe.output.meta]);
					// output is json object with name, image and wiki link ({href,title,img})
					var input = recipe.recipe.crafting;
					return `<div class="recipe_shaped"><div class="recipe_type"></div><table class="recipe_input">${_parseShapedTable(input)}</table><div class="recipe_arrow"></div><div class="recipe_output"><a href="${output.href}" title="${output.title}"><img src="${output.img}" alt="${output.title[0]}" /></a></div></div>`;
				}
				catch (e) {
					console.error(`Failed to parse shaped recipe ${recipe.title}:`, e);
					if (recipe.errored) return ERRORED_RECIPES.SHAPED;
				}
			case RecipeAPI.CONSTANTS.TYPE_SHAPELESS_CRAFTING:
				if (recipe.errored) return ERRORED_RECIPES.SHAPELESS;
				try {
					var output = _getItem([recipe.recipe.output.mod, recipe.recipe.output.name, recipe.recipe.output.meta]);
					// output is json object with name, image and wiki link ({href,title,img})
					var input = recipe.recipe.crafting;
					return `<div class="recipe_shapeless"><div class="recipe_type"></div><table class="recipe_input">${_parseShapelessTable(input)}</table><div class="recipe_arrow"></div><div class="recipe_output"><a href="${output.href}" title="${output.title}"><img src="${output.img}" alt="${output.title[0]}" /></a></div></div>`;
				}
				catch (e) {
					console.error(`Failed to parse shapeless recipe ${recipe.title}:`, e);
					if (recipe.errored) return ERRORED_RECIPES.SHAPELESS;
				}
			case RecipeAPI.CONSTANTS.TYPE_SMELTING:
				if (recipe.errored) return ERRORED_RECIPES.SMELTING;
				try {
					var output = _getItem([recipe.recipe.output.mod, recipe.recipe.output.name, recipe.recipe.output.meta]);
					var input = _getItem([recipe.recipe.input.mod, recipe.recipe.input.name, recipe.recipe.input.meta]);
					// output and input are json objects with name, image and wiki link ({href,title,img})
					var fuel = ITEMS.RECIPE_API.FUEL;
					return `<div class="recipe_smelting"><div class="recipe_type"></div><div class="recipe_input"><a href="${input.href}" title="${input.title}"><img src="${input.img}" alt="${input.title[0]}" /></a><div class="recipe_flame"></div><a href="${fuel.href}" title="${fuel.title}"><img src="${fuel.img}" alt="${fuel.title[0]}" /></a></div><div class="recipe_arrow"></div><div class="recipe_output"><a href="${output.href}" title="${output.title}"><img src="${output.img}" alt="${output.title[0]}" /></a></div></div>`;
				}
				catch (e) {
					console.error(`Failed to parse smelting recipe ${recipe.title}:`, e);
					if (recipe.errored) return ERRORED_RECIPES.SMELTING;
				}
		}
		return recipe;
	}
	
	const ITEMS = _getItems(itemUrl);
	
	var output = '';
	
	// Iterate through categories
	var recipesKeys = Object.keys(recipes);
	for (var i = 0; i < recipesKeys.length; i++) {
		
		// Write category headline
		output += _parseHeadline('HEADLINE_CATEGORY', recipesKeys[i]);
		
		// Iterate through recipes in current category
		var category = '';
		for (var j = 0; j < recipes[recipesKeys[i]].length; j++) {
			// Write recipe headline
			category += _parseHeadline('HEADLINE_RECIPE', recipes[recipesKeys[i]][j].title);
			category += _parseContainer('CONTAINER_RECIPE', _parseRecipe(recipes[recipesKeys[i]][j]) + _parseContainer('CONTAINER_RECIPE_DESCRIPTION', recipes[recipesKeys[i]][j].description));
		}
		
		// Write category container
		output += _parseContainer('CONTAINER_CATEGORY', category);
	}
	
	return output;
}