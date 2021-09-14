---
title: Linter rule - no hardcoded environment URL
description: Linter rule - no hardcoded environment URL
ms.topic: conceptual
ms.date: 09/14/2021
---

# Linter rule - no hardcoded environment URL

The Bicep linter can be used to analyze Bicep files. It enables you to find syntax errors and best practice violations before you build or deploy your Bicep file. You can customize the set of authoring best practices to use for checking the file. The linter makes it easier to enforce coding standards by providing guidance during development.

## Code

`secure-parameter-default`

## Description

Don't provide a hard-coded default value for a secure parameter in your template, unless it is empty or an expression containing a call to newGuid().

You use the @secure() decorator on parameters that contain sensitive values, like passwords. When a parameter uses a secure decorator, the value of the parameter isn't logged or stored in the deployment history. This action prevents a malicious user from discovering the sensitive value.

However, when you provide a default value, that value is discoverable by anyone who can access the template or the deployment history.

## Examples

The following example fails this test:

@secure()
param adminPassword string = 'HardcodedPassword'
The following examples pass this test:

@secure()
param adminPassword string
@secure()
param adminPassword string = ''
@secure()
param adminPassword string = newGuid()

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
