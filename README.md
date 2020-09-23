# LiH-Resources

_Leben im Holz Resources: Resources for the Wiki (like crafting recipes, etc.)_

## RecipeAPI

[Test Page](https://pr0lebenimholz.github.io/LiH-Resources/RecipeAPI/test.html)

Here are stored all recipes and items which are added via Loot++.

### Recipe synthax:

All recipes are stored in `/recipeAPI/recipes.json`.

```json
{
	"shaped": [
		{
			"category": "[category]",
			"title": "[title]",
			"description": "[description]",
			"recipe": "[mod*0]:[itemname*0]_____[count*0]_____[metadata*0]_____{[nbt*0]}_____[row 1 vars],[row 2 vars],[row 3 vars]_____[declaration*1]_____[mod*1]:[itemname*1]_____[metadata*1]_____{[nbt-tags*1]}_____[declaration*n]_____[mod*n]:[itemname*n]_____[metadata*n]_____{[nbt-tags*n]}"
		}
	],
	"shapeless": [
		{
			"category": "[category]",
			"title": "[title]",
			"description": "[description]",
			"recipe": "[mod*0]:[itemname*0]_____[count*0]_____[metadata*0]_____{[nbt*0]}_____[mod*1]:[itemname*1]_____[metadata*1]_____{[nbt*1]}_____[mod*n]:[itemname*n]_____[metadata*n]_____{[nbt*n]}"
		}
	],
	"smelting": [
		{
			"category": "[category]",
			"title": "[title]",
			"description": "[description]",
			"recipe": "[mod**0]:[itemname**0]_____[metadata**0]_____[mod**1]:[itemname**1]_____[metadata**1]_____{[nbt**1]}_____[count**1]_____[xp (optional)]"
		}
	]
}
```

- The recipe synthax i equal to the Loot++ recipe synthax.
  - shaped:
    - \[row ? vars\]: 3 letters, each one defines a variable.
    - \*0 ~ for output item
    - \*1 ~ for variable 1
    - \*n ~ for variable n
  - shapeless:
    - \*0 ~ for output item
    - \*1 ~ for input item 1
    - \*n ~ for input item n
  - smelting:
    - \*\*0 ~ for input item
    - \*\*1 ~ for output item
- The category is where the recipe can be classified (Can contain html but plain text would be better (because it is a title; `h2`)).
- The title is the headline above the recipe (Can contain html but plain text would be better (because it is a title; `h3`)).
- The description is the text below the recipe (Can contain html/ markdown).

### Items:

#### Textures (Resources):

All game textures are stored in [`/RecipeAPI/resources/game/`](/RecipeAPI/resources/game/).

All textures, required by this script are stored in [`/RecipeAPI/resources/recipe_api/`](/RecipeAPI/resources/recipe_api/).

Styleguide: `[mod]_[name]_[metadata].[png|gif]`.

#### Items (JSON list):

In [`/RecipeAPI/items.json`](/RecipeAPI/items.json) are stored all items with wiki link, texture source and name.

In `RECIPE_API` are stored all items, required by this script, in `GAME` are stored all 'real' items.

Example:
```json
{
  "RECIPE_API": {
    "MISSINGNO": {
      "img": "https://pr0LebenImHolz.github.io/LiH-Resources/RecipeAPI/resources/recipe_api/missingno.png",
      "href": "#missingno",
      "title": "MissingNo."
    },
    "FUEL": {
      "img": "https://pr0LebenImHolz.github.io/LiH-Resources/RecipeAPI/resources/recipe_api/fuel.png",
      "href": "https://minecraft.gamepedia.com/Smelting#Fuel",
      "title": "Fuel"
    }
  },
  "GAME": {
    "[mod]": {
      "[name]": {
        "[meta]": {
          "img": "[texture source]",
          "href": "[wiki entry]",
          "title" "[ingame name]"
        }
      }
    }
  }
}
```

### Important Notes:

- mod: The mod name. For vanilla items, use minecraft
- name: The item name.
- meta: The meta tag.

**IMPORTANT: Currently, the keys are case sensitive!**
