const RECIPE_STYLES = {
	HEADLINE_CATEGORY: '<div class="recipe_headline"><a href="%i">#</a><h2 id="%I">%c</h2></div>',
	HEADLINE_RECIPE: '<div class="recipe_headline"><a href="%i">#</a><h3 id="%I">%c</h3></div>',
	CONTAINER_CATEGORY: '<div class="recipe_category_container">%c</div>',
	CONTAINER_RECIPE: '<div class="recipe_recipe_container">%c</div>',
	CONTAINER_RECIPE_DESCRIPTION: '<p class="recipe_description">%c</p>',
};
function parseRecipes(recipes) {
	
	var output = '';
	
	function _parseHeadline(style, content) {
		var i = content.toLowerCase().replaceAll(' ', '_');
		return RECIPE_STYLES[style].replaceAll('%c', content).replaceAll('%i', '#' + i).replaceAll('%I', i);
	}
	function _parseContainer(style, content) {
		return RECIPE_STYLES[style].replaceAll('%c', content);
	}
	function _parseRecipe(recipe) {
		function _parseTable(input) {
			var table = '';
			for (var i = 0; i < input.length; i++) {
				table += '<tr>';
				for (var j = 0; j < input[i].length; j++) {
					table += `<td><td><a href="${input[i][j].href}" title="${input[i][j].title}"><img src="${input[i][j].img}" alt="${input[i][j].title[0]}" /></a></td>`;
				}
				table += '</tr>';
			}
			return table;
		}
		switch (recipe.type) {
			case RecipeAPI.CONSTANTS.TYPE_SHAPED_CRAFTING:
				if (recipe.errored) return '<div class="recipe_shaped"><div class="recipe_type errored"></div><table class="recipe_input"><tr><td><a></a></td><td><a></a></td><td><a></a></td></tr><tr><td><a></a></td><td><a></a></td><td><a></a></td></tr><tr><td><a></a></td><td><a></a></td><td><a></a></td></tr></table><div class="recipe_arrow"></div><div class="recipe_output"><a></a></div></div>';
				//+debug
				var output = {
					href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
					title: "[title]",
					img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
				};
				var input = [
					[
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						},
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						},
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						}
					],
					[
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						},
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						},
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						}
					],
					[
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						},
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						},
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						}
					]
				];
				//-debug
				return `<div class="recipe_shaped"><div class="recipe_type"></div><table class="recipe_input">${_parseTable(input)}</table><div class="recipe_arrow"></div><div class="recipe_output"><a href="${output.href}" title="${output.title}"><img src="${output.img}" alt="${output.title[0]}" /></a></div></div>`;
			case RecipeAPI.CONSTANTS.TYPE_SHAPELESS_CRAFTING:
				if (recipe.errored) return '<div class="recipe_shapeless"><div class="recipe_type errored"></div><table class="input"><tr><td><a></a></td><td><a></a></td><td><a></a></td></tr><tr><td><a></a></td><td><a></a></td><td><a></a></td></tr><tr><td><a></a></td><td><a></a></td><td><a></a></td></tr></table><div class="recipe_arrow"></div><div class="recipe_output"><a></a></div></div>';
				//+debug
				var output = {
					href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
					title: "[title]",
					img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
				};
				var input = [
					[
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						},
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						},
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						}
					],
					[
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						},
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						},
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						}
					],
					[
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						},
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						},
						{
							href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
							title: "[title]",
							img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
						}
					]
				];
				//-debug
				return `<div class="recipe_shaped"><div class="recipe_type"></div><table class="recipe_input">${_parseTable(input)}</table><div class="recipe_arrow"></div><div class="recipe_output"><a href="${output.href}" title="${output.title}"><img src="${output.img}" alt="${output.title[0]}" /></a></div></div>`;
			case RecipeAPI.CONSTANTS.TYPE_SMELTING:
				if (recipe.errored) return '<div class="recipe_smelting"><div class="recipe_type"></div><div class="recipe_input"><a></a><div class="recipe_flame"></div><a></a></div><div class="recipe_arrow"></div><div class="recipe_output"><a></a></div></div>';
				//+debug
				var output = {
					href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
					title: "[title]",
					img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
				};
				var input = {
					href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
					title: "[title]",
					img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
				};
				var fuel = {
					href: "https://pr0LebenImHolz.github.io/item.html?[mod]&[name]&[id]",
					title: "[title]",
					img: "https://pr0LebenImHolz.github.io/resources/[mod]_[name]_[id]"
				};
				//-debug
				return `<div class="recipe_smelting"><div class="recipe_type"></div><div class="recipe_input"><a href="${input.href}" title="${input.title}"><img src="${input.img}" alt="${input.title[0]}" /></a><div class="recipe_flame"></div><a href="${fuel.href}" title="${fuel.title}"><img src="${fuel.img}" alt="${fuel.title[0]}" /></a></div><div class="recipe_arrow"></div><div class="recipe_output"><a href="${output.href}" title="${output.title}"><img src="${output.img}" alt="${output.title[0]}" /></a></div></div>`;
		}
		return recipe;
	}
	
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