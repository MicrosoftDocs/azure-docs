---
title: Override auto-generated KEDA scale rules for Azure Functions on Container Apps
description: Learn how to switch Functions on Container Apps from platform-managed scaling to your own KEDA scale rules by using allowScalingRuleOverride.
services: container-apps
author: deepganguly
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 05/14/2026
ms.author: deepganguly
---

# Override auto-generated KEDA scale rules for Azure Functions on Container Apps

Functions on Container Apps normally runs in platform-managed scaling mode. At startup, the Functions host inspects triggers (for example HTTP, Queue, or Timer), and Azure Container Apps creates the matching KEDA trigger configuration for the app revision.

Set `properties.template.scale.allowScalingRuleOverride` when you want to disable that automatic mapping and provide your own scale rules in `template.scale.rules`.

## Prerequisites

- A Container Apps resource deployed as a Functions app (`kind=functionapp`).
- Azure CLI, with permission to call `az rest` against the app resource.
- REST API version `2026-03-02-preview` or newer.

## Property definition

| Property | Type | Default | Applies to | API version |
|---|---|---|---|---|
| `properties.template.scale.allowScalingRuleOverride` | `boolean` (nullable) | `false` / `null` | Functions on Container Apps only (`kind=functionapp`) | `2026-03-02-preview` and later |

## Behavior

| Override value | Scale rules | Behavior |
|---|---|---|
| `false` or `null` | Auto-generated | Azure creates and manages KEDA rules from discovered Functions triggers. User-supplied rules are blocked in this mode. |
| `true` | Customer-defined | Azure doesn't generate trigger-based rules. The rules you provide are used for scale decisions. |
| `true` with no rules provided | None provided | Azure skips trigger-based rule generation. Only the platform's baseline HTTP scaler behavior remains active. |

## Enable override and provide custom scale rules

This example starts from platform-managed scaling (`allowScalingRuleOverride=false`) and switches to manual rule control. The PATCH includes one Azure Queue rule and one HTTP concurrency rule.

1. Create a PATCH body file named `patch-enable-override.json`.

    ```json
    {
      "properties": {
        "template": {
          "scale": {
            "allowScalingRuleOverride": true,
            "rules": [
              {
                "name": "my-queue-rule",
                "custom": {
                  "type": "azure-queue",
                  "metadata": {
                    "queueName": "my-test-queue",
                    "queueLength": "20",
                    "connectionFromEnv": "AzureWebJobsStorage"
                  }
                }
              },
              {
                "name": "my-http-rule",
                "http": {
                  "metadata": {
                    "concurrentRequests": "50"
                  }
                }
              }
            ]
          }
        }
      }
    }
    ```

1. Apply the update.

    ```azurecli
    az rest --method PATCH \
      --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.App/containerApps/{appName}?api-version=2026-03-02-preview" \
      --headers "Content-Type=application/json" \
      --body @patch-enable-override.json
    ```

Expected outcome:

- Trigger-derived rules aren't generated for the new revision.
- The custom rules (`my-queue-rule` and `my-http-rule`) are attached to the revision.
- Scale-out now follows queue depth (`queueLength=20`) and HTTP concurrency (`concurrentRequests=50`).

## Disable override and revert to platform-generated rules

This example returns a manually configured app (`allowScalingRuleOverride=true`) to platform-managed scaling.

> [!IMPORTANT]
> A request that sets `allowScalingRuleOverride=false` while `rules` is non-empty is rejected. To switch back, send `rules: []` in the same PATCH.

1. Create a PATCH body file named `patch-disable-override.json`.

    ```json
    {
      "properties": {
        "template": {
          "scale": {
            "allowScalingRuleOverride": false,
            "rules": []
          }
        }
      }
    }
    ```

1. Apply the update.

    ```azurecli
    az rest --method PATCH \
      --uri "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.App/containerApps/{appName}?api-version=2026-03-02-preview" \
      --headers "Content-Type=application/json" \
      --body @patch-disable-override.json
    ```

Expected outcome:

- Custom scale rules are cleared.
- Azure resumes creating scale rules from discovered Functions triggers.
- A new revision is produced with platform-managed scaling.

## Error scenarios

| Scenario | Error code | Error message |
|---|---|---|
| Set `allowScalingRuleOverride=true` on a non-Functions app (`kind` isn't `functionapp`) | `AllowScalingRuleOverrideNotApplicable` | The `AllowScalingRuleOverride` property is only applicable for Function Apps (`kind = 'functionapp'`). It can't be set for other container app kinds. |
| Set `allowScalingRuleOverride=false` while custom scale rules are still present | `FunctionAppCannotSetScaleRules` | Can't switch to platform-controlled mode if non-empty rules exist to protect accidentally deleting customer defined scale rules. Customers need to explicitly set `[]` (empty array) in scale rules if they want platform to auto-manage. |

## Related content

- [Use Azure Functions in Azure Container Apps](functions-usage.md)
- [Azure Functions KEDA scaling mappings on Container Apps](functions-keda-mappings.md)
- [Scale an app in Azure Container Apps](scale-app.md)
