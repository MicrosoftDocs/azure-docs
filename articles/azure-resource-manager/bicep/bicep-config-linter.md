---
title: Linter settings for Bicep config
description: Describes how to customize configuration values for the Bicep linter
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 10/05/2023
---

# Add linter settings in the Bicep config file

In a **bicepconfig.json** file, you can customize validation settings for the [Bicep linter](linter.md). The linter uses these settings when evaluating your Bicep files for best practices.

This article describes the settings that are available for working with the Bicep linter.

## Customize linter

The linter settings are available under the `analyzers` element. You can enable or disable the linter, supply rule-specific values, and set the level of rules.

The following example shows the rules that are available for configuration.

```json
{
  "analyzers": {
    "core": {
      "enabled": true,
      "rules": {
        "adminusername-should-not-be-literal": {
          "level": "warning"
        },
        "artifacts-parameters": {
          "level": "warning"
        },
        "decompiler-cleanup": {
          "level": "warning"
        },
        "max-outputs": {
          "level": "warning"
        },
        "max-params": {
          "level": "warning"
        },
        "max-resources": {
          "level": "warning"
        },
        "max-variables": {
          "level": "warning"
        },
        "nested-deployment-template-scoping": {
          "level": "error"
        }
        "no-conflicting-metadata" : {
          "level": "warning"
        },
        "no-deployments-resources" : {
          "level": "warning"
        }
        "no-hardcoded-env-urls": {
          "level": "warning"
        },
        "no-hardcoded-location": {
          "level": "warning"
        },
        "no-loc-expr-outside-params": {
          "level": "warning"
        },
        "no-unnecessary-dependson": {
          "level": "warning"
        },
        "no-unused-existing-resources": {
          "level": "warning"
        },
        "no-unused-params": {
          "level": "warning"
        },
        "no-unused-vars": {
          "level": "warning"
        },
        "outputs-should-not-contain-secrets": {
          "level": "warning"
        },
        "prefer-interpolation": {
          "level": "warning"
        },
        "prefer-unquoted-property-names": {
          "level": "warning"
        },
        "protect-commandtoexecute-secrets": {
          "level": "warning"
        },
        "secure-parameter-default": {
          "level": "warning"
        },
        "secure-params-in-nested-deploy": {
          "level": "warning"
        },
        "secure-secrets-in-params": {
          "level": "warning"
        },
        "simplify-interpolation": {
          "level": "warning"
        },
        "simplify-json-null": {
          "level": "warning"
        },
        "use-parent-property": {
          "level": "warning"
        },
        "use-recent-api-versions": {
          "level": "warning",
          "maxAllowedAgeInDays": 730
        },
        "use-resource-id-functions": {
          "level": "warning"
        },
        "use-resource-symbol-reference": {
          "level": "warning"
        },
        "use-stable-resource-identifiers": {
          "level": "warning"
        },
        "use-stable-vm-image": {
          "level": "warning"
        }
      }
    }
  }
}
```

The properties are:

- **enabled**: specify **true** for enabling linter, **false** for disabling linter.
- **verbose**: specify **true** to show the bicepconfig.json file used by Visual Studio Code.
- **rules**: specify rule-specific values. Each rule has a level that determines how the linter responds when a violation is found.

The available values for **level** are:

| **level**  | **Build-time behavior** | **Editor behavior** |
|--|--|--|
| `Error` | Violations appear as Errors in command-line build output, and causes the build to fail. | Offending code is underlined with a red squiggle and appears in Problems tab. |
| `Warning` | Violations appear as Warnings in command-line build output, but they don't cause the build to fail. | Offending code is underlined with a yellow squiggle and appears in Problems tab. |
| `Info` | Violations don't appear in the command-line build output. | Offending code is underlined with a blue squiggle and appears in Problems tab. |
| `Off` | Suppressed completely. | Suppressed completely. |

## Environment URLs

For the rule about hardcoded environment URLs, you can customize which URLs are checked. By default, the following settings are applied:

```json
{
  "analyzers": {
    "core": {
      "enabled": true,
      "rules": {
        "no-hardcoded-env-urls": {
          "level": "warning",
          "disallowedhosts": [
            "management.core.windows.net",
            "gallery.azure.com",
            "management.core.windows.net",
            "management.azure.com",
            "database.windows.net",
            "core.windows.net",
            "login.microsoftonline.com",
            "graph.windows.net",
            "trafficmanager.net",
            "vault.azure.net",
            "datalake.azure.net",
            "azuredatalakestore.net",
            "azuredatalakeanalytics.net",
            "vault.azure.net",
            "api.loganalytics.io",
            "api.loganalytics.iov1",
            "asazure.windows.net",
            "region.asazure.windows.net",
            "api.loganalytics.iov1",
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
}
```

## Next steps

- [Configure your Bicep environment](bicep-config.md)
- [Add module settings in Bicep config](bicep-config-modules.md)
- Learn about the [Bicep linter](linter.md)
