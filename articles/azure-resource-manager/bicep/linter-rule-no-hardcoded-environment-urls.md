---
title: Linter rule - no hardcoded environment URL
description: Linter rule - no hardcoded environment URL
ms.topic: conceptual
ms.date: 09/14/2021
---

# Linter rule - no hardcoded environment URL

The linter makes it easier to enforce coding standards by providing guidance during development. The current set of linter rules is minimal and taken from [arm-ttk test cases](../templates/template-test-cases.md):

- [no-hardcoded-env-urls](./linter-rule-no-hardcoded-environment-urls.md)
- [no-unused-params](./linter-rule-no-unused-parameters.md)
- [no-unused-vars](./linter-rule-no-unused-variables.md)
- [prefer-interpolation](./linter-rule-prefer-interpolation.md)
- [secure-parameter-default](./linter-rule-secure-parameter-default.md)
- [simplify-interpolation](./linter-rule-simplify-interpolation.md)

For more information, see [Use Bicep linter](./linter.md).

## Code

`no-hardcoded-env-urls`

## Description

Do not hard-code environment URLs in your template. Instead, use the [environment function](../templates/template-functions-deployment.md#environment) to dynamically get these URLs during deployment. For a list of the URL hosts that are blocked, see the default list of `DisallowedHosts` in [bicepconfig.json](https://github.com/Azure/bicep/blob/main/src/Bicep.Core/Configuration/bicepconfig.json).

## Examples

The following example fails this test because the URL is hardcoded.

```bicep
var AzureURL = 'https://management.azure.com'
```

The test also fails when used with concat or uri.

```bicep
var AzureSchemaURL1 = concat('https://','gallery.azure.com')
var AzureSchemaURL2 = uri('gallery.azure.com','test')
```

The following example passes this test.

```bicep
var AzureSchemaURL = environment().gallery
```

## Configuration

The set of URL hosts to disallow may be customized using the disallowedHosts property in the bicepconfig.json file as follows:

```json
{
  "analyzers": {
    "core": {
      "enabled": true,
      "rules": {
        "no-hardcoded-env-urls": {
          "level": "warning",
          "disallowedHosts": [
            "gallery.azure.com",
            "management.core.windows.net",
            "management.azure.com",
            "database.windows.net",
            "core.windows.net",
            "login.microsoftonline.com",
            "graph.windows.net",
            "trafficmanager.net",
            "datalake.azure.net",
            "azuredatalakestore.net",
            "azuredatalakeanalytics.net",
            "vault.azure.net",
            "api.loganalytics.io",
            "asazure.windows.net",
            "region.asazure.windows.net",
            "batch.core.windows.net"
          ]
        }
      }
    }
  }
}
```

## Next steps

For more information about using Visual Studio Code and the Bicep extension, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
