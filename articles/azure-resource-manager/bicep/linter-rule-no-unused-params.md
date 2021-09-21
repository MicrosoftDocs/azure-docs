---
title: Linter rule - no hardcoded environment URL
description: Linter rule - no hardcoded environment URL
ms.topic: conceptual
ms.date: 09/14/2021
---

# Linter rule - no hardcoded environment URL

The Bicep linter can be used to analyze Bicep files. It enables you to find syntax errors and best practice violations before you build or deploy your Bicep file. You can customize the set of authoring best practices to use for checking the file. The linter makes it easier to enforce coding standards by providing guidance during development.

## Code

`no-unused-params`

## Description

To reduce confusion in your template, delete any parameters that are defined but not used. This test finds any parameters that aren't used anywhere in the template. Eliminating unused parameters also makes it easier to deploy your template because you don't have to provide unnecessary values.

## Next steps

For more information about using Visual Studio Code and the Bicep extension, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
