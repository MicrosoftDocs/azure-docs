---
title: Use Bicep Linter
description: Learn how to use Bicep Linter.
ms.topic: conceptual
ms.date: 06/24/2021
---

# Use Bicep Linter

Linter is a tool used that can analyse your source code to highlight coding and stylistic errors before going into production. The linter integrated with Bicep is based on some of the rules present in ARM-TTK.

These tools can help you perform static code analysis, check compliance against a style guide, find syntax errors, and flag potential optimizations in the code.

Linter requirements:

* Bicep CLI: 0.4.63
* Bicep extension: 0.4.63



***How to enable Linter?


## Linter usage

Microsoft added support for linting of Bicep files in VS Code and at the command line.

- VS Code
- Bicep build


## Customize Linter

Using bicepconfig.json, you can enable or disable Linter, supply rule-specific values, and set the level of rules as well. The following json is a sample bicepconfig.json:

```json
{
  "analyzers": {
    "core": {
      "verbose": false,
      "enabled": true,
      "rules": {
        "no-hardcoded-env-urls": {
          "level": "warning"
        },
        "no-unused-params": {
          "level": "error"
        },
        "no-unused-vars": {
          "level": "error"
        },
        "prefer-interpolation": {
          "level": "warning"
        },
        "secure-parameter-default": {
          "level": "error"
        },
        "simplify-interpolation": {
          "level": "warning"
        }
      }
    }
  }
}
```

bicepconfig.json can be placed alongside your templates in the same directory. The closest configuration file found up the folder tree is used.

The Bicep extension of VS Code provides intellisense for editing this configuration file:


bicep-linter-configure-intellisense.png

## Linter rules

The current set of linter rules are minimal and taken from [arm-ttk test cases](../templates/test-cases.md). Both VS Code extension and Bicep CLI check for all available rules by default and all rules are set at warning level. Based on the level of a rule, you see errors or warnings or informational messages within the editor.

* no-hardcoded-env-urls
* no-unused-params
* no-unused-vars
* prefer-interpolation
* secure-parameter-default
* simplify-interpolation

Each rule has at least one property, level. This property commands the behavior of Bicep if the case if found in the Bicep file.
You can use several values for level:

| **level**  | **Build-time behavior** | **Editor behavior** |
|--|--|--|
| `Error` | Violations appear as Errors in command-line build output, and cause builds to fail. | Offending code is underlined with a red squiggle and appears in Problems tab. |
| `Warning` | Violations appear as Warnings in command-line build output, but do not cause builds to fail. | Offending code is underlined with a yellow squiggle and appears in Problems tab. |
| `Info` | Violations do not appear in command-line build output. | Offending code is underlined with a blue squiggle and appears in Problems tab. |
| `Off` | Suppressed completely. | Suppressed completely. |

## Next steps

For more information about using Visual Studio Code and the Bicep extension, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
