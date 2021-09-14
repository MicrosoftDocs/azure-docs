---
title: Linter rule - no hardcoded environment URL
description: Linter rule - no hardcoded environment URL
ms.topic: conceptual
ms.date: 09/14/2021
---

# Linter rule - no hardcoded environment URL

The Bicep linter can be used to analyze Bicep files. It enables you to find syntax errors and best practice violations before you build or deploy your Bicep file. You can customize the set of authoring best practices to use for checking the file. The linter makes it easier to enforce coding standards by providing guidance during development.

## Code

`no-hardcoded-env-urls`

## Description

Do not hardcode environment URLs in your template. Instead, use the [environment function](../templates/template-functions-deployment.md#environment) to dynamically get these URLs during deployment. For a list of the URL hosts that are blocked, see the default list of `DisallowedHosts` in [bicepconfig.json](https://github.com/Azure/bicep/blob/main/src/Bicep.Core/Configuration/bicepconfig.json).


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


## Next steps

For more information about using Visual Studio Code and the Bicep extension, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
