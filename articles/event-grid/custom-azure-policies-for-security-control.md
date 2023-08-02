---
title: Configure custom Azure Policies on Event Grid resources to enhance you security posture
description: This article helps you define custom Azure policies to enforce security controls.
ms.topic: how-to
author: jfggdl
ms.author: jafernan
ms.date: 06/24/2021
---

# Use custom Azure policies to enforce security controls

This article provides you with sample custom Azure policies to control the destinations that can be configured in Event Grid's event subscriptions. [Azure Policy](../governance/policy/overview.md) helps you enforce organizational standards and regulatory compliance for different concerns such as security, cost, resource consistency, management, etc. Prominent among those concerns are security compliance standards that help maintain a security posture for your organization. To help you with your security controls, the policies presented in this article help you prevent data exfiltration or the delivery of events to unauthorized endpoints or Azure services.

> [!NOTE]
> Azure Event Grid provides built-in policies for compliance domains and security controls related to several compliance standards. You can find those built-in policies in Event Grid's [Microsoft Cloud Security Benchmark](security-controls-policy.md#microsoft-cloud-security-benchmark).

To prevent data exfiltration, organizations may want to limit the destinations to which Event Grid can deliver events. This can be done by assigning policies that allow the creation or update of [event subscriptions](concepts.md#event-subscriptions) that have as a destination one of the sanctioned destinations in the policy. The policy effect used to prevent a resource request to succeed is [deny](../governance/policy/concepts/effects.md#deny).

The following sections show sample policy definitions that enforce a list of allowed destinations. You want to search for [property aliases](../governance/policy/concepts/definition-structure.md#aliases) that contain ```destination``` and use it as the ```field``` to compare to a list of allowed destinations when defining a policy.

You can find the property aliases defined for Event Grid (use namespace ```Microsoft.EventGrid```) by running CLI or PowerShell commands described [in this article section](../governance/policy/concepts/definition-structure.md#aliases).

For more information about defining policies, consult the article [Azure Policy definition structure](../governance/policy/concepts/definition-structure.md).

 
## Define an Azure Policy with a list of allowed destinations for a webhook destination

The following policy definition restricts webhook endpoint destinations configured in an event subscription for a system topic.

```json
{
  "mode": "All",
  "policyRule": {
    "if": {
      "not": {
        "field": "Microsoft.EventGrid/systemTopics/eventSubscriptions/destination.WebHook.endpointUrl",
        "in": "[parameters('allowedDestinationEndpointURLs')]"
      }
    },
    "then": {
      "effect": "deny"
    }
  },
  "parameters": {
    "allowedDestinationEndpointURLs": {
      "type": "Array",
      "metadata": {
        "description": "Allowed event destination endpoint URLs.",
        "displayName": "The list of allowed webhook endpoint destinations to which send events"
      },
        "allowedValues": [
          "https://www.your-valid-destination-goes-here-1.com",
          "https://www.your-valid-destination-goes-here-2.com",
          "https://www.your-valid-destination-goes-here-3.com"
        ]
    }
  }
}
```

## Define an Azure Policy with a list of allowed Azure service resource destinations

The following policy definition restricts a specific Event Hubs destination configured in an event subscription for a custom topic. You can use a similar approach for other type of [supported Azure service destinations](event-handlers.md).

```json
{
  "mode": "All",
  "policyRule": {
    "if": {
      "not": {
        "field": "Microsoft.EventGrid/eventSubscriptions/destination.EventHub.resourceId",
        "in": "[parameters('allowedResourceDestinations')]"
      }
    },
    "then": {
      "effect": "deny"
    }
  },
  "parameters": {
    "allowedResourceDestinations": {
      "type": "Array",
      "metadata": {
        "description": "The list of allowed event delivery destinations.",
        "displayName": "Allowed event delivery destinations"
      },
        "allowedValues": [
          "/subscriptions/<your-event-subscription>/resourceGroups/<your-resource-group>/providers/Microsoft.EventHub/namespaces/<event-hubs-namespace-name>/eventhubs/<your-event-hub-name>"
        ]
    }
  }
}
```

## Next steps
- To learn more about Azure Policy, refer to the following articles: 
    - [What is Azure Policy?](../governance/policy/overview.md)
    - [Azure Policy definition structure](../governance/policy/concepts/definition-structure.md).
    - [Understand Azure Policy effects](../governance/policy/concepts/effects.md).
    - [Understand scope in Azure Policy](../governance/policy/concepts/scope.md).
    - [Use Azure Policy extension for Visual Studio Code](../governance/policy/how-to/extension-for-vscode.md).
    - [Programmatically created policies](../governance/policy/how-to/programmatically-create.md).
- To learn more about Azure Event Grid, consult the articles under the Concepts section such as the [Event Grid terminology](concepts.md).