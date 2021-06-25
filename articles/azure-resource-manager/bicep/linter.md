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

Using this configuration file, you can enable or disable Linter, supply rule-specific values, and set the level of rules as well. What’s more – the Bicep VS Code extension even provides intellisense for this configuration file.

The minimal Linter configuration of bicepconfig.json:

```json
{
  "analyzers": {
    "core": {
      "verbose": false,
      "enabled": true,
      "rules": {}
    }
  }
}
```


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

* Error, if the situation is meet, for example, if you enable the no-unused-params, for example, and you left an unused param in your file, the build command will fail. It’s useful in a CI/CD scenario.
* Warning, in this situation, you will have a warning message, but the build process will continue, and your bicep file will be translated into its JSON counterpart
* Info, in this situation you will get a verbose message
* Off, the rule is disabled

## Next steps

For more information about using Visual Studio Code and the Bicep extension, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
