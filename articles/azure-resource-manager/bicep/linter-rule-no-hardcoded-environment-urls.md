---
title: Linter rule - no hardcoded environment URL
description: Linter rule - no hardcoded environment URL
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 06/23/2023
---

# Linter rule - no hardcoded environment URL

This rule finds any hard-coded URLs that vary by the cloud environment.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`no-hardcoded-env-urls`

## Solution

Instead of hard-coding URLs in your Bicep file, use the [environment function](bicep-functions-deployment.md#environment) to dynamically get these URLs during deployment. The environment function returns different URLs based on the cloud environment you're deploying to.

The following example fails this test because the URL is hardcoded.

```bicep
var managementURL = 'https://management.azure.com'
```

The test also fails when used with concat or uri.

```bicep
var galleryURL1 = concat('https://','gallery.azure.com')
var galleryURL2 = uri('gallery.azure.com','test')
```

You can fix it by replacing the hard-coded URL with the `environment()` function.

```bicep
var galleryURL = environment().gallery
```

In some cases, you can fix it by getting a property from a resource you've deployed. For example, instead of constructing the endpoint for your storage account, retrieve it with `.properties.primaryEndpoints`.

```bicep
param storageAccountName string
param location string = resourceGroup().location

resource sa 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}

output endpoint string = sa.properties.primaryEndpoints.web
```

## Configuration

By default, this rule uses the following settings for determining which URLs are disallowed.

```json
"analyzers": {
  "core": {
    "verbose": false,
    "enabled": true,
    "rules": {
      "no-hardcoded-env-urls": {
        "level": "warning",
        "disallowedhosts": [
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
        ],
        "excludedhosts": [
          "schema.management.azure.com"
        ]
      }
    }
  }
}
```

You can customize it by adding a bicepconfig.json file and applying new settings.

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
