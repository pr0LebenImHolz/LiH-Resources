# LiH-Resources

_Leben im Holz Resources: Resources for the Wiki (like crafting recipes, etc._)

## recipeAPI

Here are stored all recipes and items which are added via Loot++.

### Recipe synthax:

All recipes are stored in `/recipeAPI/recipes.json`.

```json
{
	"shaped": [
		"[mod*0]:[itemname*0]_____[count*0]_____[metadata*0]_____{[nbt*0]}_____[row 1 vars],[row 2 vars],[row 3 vars]_____[declaration*1]_____[mod*1]:[itemname*1]_____[metadata*1]_____{[nbt-tags*1]}_____[declaration*n]_____[mod*n]:[itemname*n]_____[metadata*n]_____{[nbt-tags*n]}"
	],
	"shapeless": [
		"[mod*0]:[itemname*0]_____[count*0]_____[metadata*0]_____{[nbt*0]}_____[mod*1]:[itemname*1]_____[dv*1]_____{[nbt*1]}_____[mod*n]:[itemname*n]_____[dv*n]_____{[nbt*n]}"
	],
	"smelting": [
		"[mod**0]:[itemname**0]_____[metadata**0]_____[mod**1]:[itemname**1]_____[metadata**1]_____{[nbt**1]}_____[count**1]_____[xp (optional)]"
	]
}
```

- shapeless:
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

### Items:

All custom items are stored in `/recipeAPI/items/`.

Styleguide: `[type]_[name].[png|gif]`.