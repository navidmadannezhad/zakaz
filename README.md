# zakaz

Alright, This package generates some imports and exports for you, making it easier to import your js/ts stuff in your project.


## Installation

Install zakaz with npm

```bash
  npm install @navidmnzh/zakaz-cli
```

# zakaz

Alright, This package generates some imports and exports for you, making it easier to import your js/ts stuff in your project.


## Usage/Examples

```bash
npx zakaz <...options>

-b <required>: Base path that zakaz starts the ZAKAZing process! It scans all the folders and subfolders to generate the needed index.ts file.

-d <optional>: restricted directories that you don't want zakaz to check. put them all in a string by name and seperate them by comma.

-l <optional>: wheather you want to see the process log or nah.

EXAMPLE:
npx zakaz -b ./src -d "generated_api, generated_models" -l
MEANS:
Scan all folders and subfolders in src, avoid scanning any folder named generated_api and generated_models
```


## Contributing

This package is in its initial phase, so surely there are many bugs, issues and improvements waiting for you contributions! Feel free to fork and PR.
