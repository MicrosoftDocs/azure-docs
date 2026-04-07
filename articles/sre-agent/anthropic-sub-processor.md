---
title: Anthropic as a subprocessor in Azure SRE Agent
description: Learn how Anthropic operates as a Microsoft subprocessor in Azure SRE Agent, including model selection, and data residency controls.
author: craigshoemaker
ms.author: cshoe
ms.topic: concept-article
ms.date: 04/07/2026
ms.service: azure
ms.custom: references_regions
---

# Anthropic as a subprocessor in Azure SRE Agent

Azure SRE Agent supports multiple AI model providers for investigations, incident response, and operational automation. Anthropic is one of the available providers and operates as a Microsoft subprocessor.

Anthropic operates under Microsoft's oversight with contractual safeguards and technical and organizational measures in place. The Microsoft [Product Terms](https://www.microsoft.com/licensing/terms) and [Microsoft Data Protection Addendum (DPA)](https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA) apply when you use Anthropic models through Azure SRE Agent.

For more information about subprocessor data access, see [Microsoft Data Access Management](https://www.microsoft.com/trust-center/privacy/data-access). For a list of all Microsoft subprocessors, see the [Service Trust Portal](https://aka.ms/subprocessor).

> [!IMPORTANT]
> Anthropic models in Azure SRE Agent aren't covered by Microsoft's [EU Data Boundary](/privacy/eudb/eu-data-boundary-learn) commitments. When you select Anthropic, your data (prompts, responses, and resource analysis) might be processed in the United States.

> [!NOTE]
> For customers in the EU, EFTA, and UK, Azure OpenAI is the default provider. Anthropic is available as an opt-in choice. Anthropic isn't available in government clouds (GCC, GCC High, DoD) or sovereign clouds.

## How model selection works

You choose which AI provider powers your agent. The two options are:

- **Azure OpenAI**: Covered by EU Data Boundary commitments. The default for customers in the EU, EFTA, and UK.

- **Anthropic**: The default for all other regions. Not covered by EU Data Boundary commitments.

When you select Anthropic, your data (prompts, responses, and resource analysis) might be processed in the United States.

## Default settings by region

| Region | Anthropic | Azure OpenAI | Notes |
|--------|-----------|--------------|-------|
| **Most commercial regions**<br><br>(US, APAC, etc.) | Default | Available | No data residency restrictions |
| **EU, EFTA, and UK** | Available (opt-in) | Default | Anthropic isn't covered by EU Data Boundary |
| **Government clouds**<br><br>(GCC, GCC High, DoD) | Not available | Default | Anthropic isn't available in government or sovereign clouds |

## Verify the active model provider

To check which AI model provider your agent is currently using:

1. Go to the [Azure SRE Agent portal](https://sre.azure.com).
1. Select your agent, and then go to **Settings**.
1. Under **AI Model Provider**, view the active provider.

## Enable Anthropic in EU Data Boundary regions

If your organization is in the EU, EFTA, or UK and you want to use Anthropic:

1. Go to the [Azure SRE Agent portal](https://sre.azure.com).
1. Select your agent, and then go to **Settings**.
1. Under **AI Model Provider**, select **Anthropic**.
1. Review the data residency notice and confirm.

> [!NOTE]
> By selecting Anthropic, you acknowledge that your data might be processed outside the EU Data Boundary, including in the United States.

## Data handling

When you use Anthropic models in Azure SRE Agent:

- Anthropic processes data under Microsoft's direction and contractual safeguards.
- The [Microsoft DPA](https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA) and [Product Terms](https://www.microsoft.com/licensing/terms) apply.
- Both Microsoft and Anthropic don't use your data to train AI models.
- Your data is isolated by tenant and Azure subscription.

For more on how Azure SRE Agent handles data, see [Data residency and privacy](data-privacy.md).

## Disable Anthropic with Azure Policy

You can use Azure Policy to prevent Anthropic from being configured as the AI model provider on your Azure SRE Agent resources.

When assigned with the default configuration, this policy blocks Anthropic. Agents that already use Anthropic are flagged as non-compliant but aren't changed automatically.

### Create the policy definition

1. Save the following policy rule to a file named `deny-anthropic-rules.json`:

    ```json
    {
      "if": {
        "allOf": [
          {
            "field": "type",
            "equals": "Microsoft.App/agents"
          },
          {
            "field": "Microsoft.App/agents/defaultModel.provider",
            "in": "[parameters('disallowedProviders')]"
          }
        ]
      },
      "then": {
        "effect": "[parameters('effect')]"
      }
    }
    ```

1. Save the following parameters to a file named `deny-anthropic-params.json`:

    ```json
    {
      "effect": {
        "type": "String",
        "metadata": {
          "displayName": "Effect",
          "description": "Audit logs non-compliant agents without blocking. Deny prevents agents from being configured with a disallowed provider. Disabled turns off the policy."
        },
        "allowedValues": ["Audit", "Deny", "Disabled"],
        "defaultValue": "Deny"
      },
      "disallowedProviders": {
        "type": "Array",
        "metadata": {
          "displayName": "Disallowed AI model providers",
          "description": "AI model provider values to deny on Azure SRE Agent resources."
        },
        "defaultValue": ["Anthropic"]
      }
    }
    ```

1. Create the policy definition:

    ```azurecli
    az policy definition create \
      --name "deny-anthropic-provider" \
      --display-name "Azure SRE Agent: Restrict AI model providers" \
      --description "Prevents Azure SRE Agent resources from using Anthropic as the AI model provider." \
      --mode All \
      --rules deny-anthropic-rules.json \
      --params deny-anthropic-params.json
    ```

### Assign the policy

Assign the policy to your subscription:

```azurecli
az policy assignment create \
  --name "deny-anthropic-provider" \
  --display-name "Deny Anthropic on SRE Agent resources" \
  --policy "deny-anthropic-provider" \
  --scope "/subscriptions/<YOUR_SUBSCRIPTION_ID>"
```

To apply the policy across multiple subscriptions, assign it at the management group scope:

```azurecli
az policy assignment create \
  --name "deny-anthropic-provider" \
  --display-name "Deny Anthropic on SRE Agent resources" \
  --policy "deny-anthropic-provider" \
  --scope "/providers/Microsoft.Management/managementGroups/<YOUR_MANAGEMENT_GROUP_ID>"
```

### Verify compliance

After assignment, any attempt to configure an agent with Anthropic as the provider is blocked. Check compliance status:

```azurecli
az policy state summarize --policy-assignment "deny-anthropic-provider"
```

Existing agents that already use Anthropic are flagged as non-compliant but aren't changed automatically. Update those agents to use Azure OpenAI through the Azure SRE Agent portal under **Settings** > **AI Model Provider**.

> [!NOTE]
> To monitor before enforcing, change the default value for `effect` from `"Deny"` to `"Audit"` in the parameters file. Audit mode logs non-compliant agents without blocking changes.

## Related content

- [Data residency and privacy in Azure SRE Agent](data-privacy.md)
- [Anthropic as a subprocessor for Microsoft Online Services](/copilot/microsoft-365/connect-to-ai-subprocessor)
- [Microsoft subprocessor list (Service Trust Portal)](https://aka.ms/subprocessor)
- [EU Data Boundary for the Microsoft Cloud](/privacy/eudb/eu-data-boundary-learn)
