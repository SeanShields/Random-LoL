# Random LoL

Discord bot that randomizes League of Legends champion selection.

[Add to Discord](https://discord.com/api/oauth2/authorize?client_id=925425399108894791&permissions=2048&scope=bot)

### Available Commands:
`!random` picks a random champion

`!banned` prints the banned list

### Options:
`--names` comma-delimited list of names to choose random champions for (handles duplicates)

`--banned` excludes champions within the banned list from being selected

### Examples:

`!random` picks a random champion

`!random --names Sean,Billy,Pat` picks random champions for Sean, Billy, and Pat

`!random --names Sean,Billy,Pat --banned` picks random champions for Sean, Billy, and Pat and excludes banned champions
