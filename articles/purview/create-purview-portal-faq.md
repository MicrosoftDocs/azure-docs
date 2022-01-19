---
title: Create an Azure Policy exception for Azure Purview
description: This article describes how to create an Azure Policy exception for Azure Purview while leaving existing Policies in place to maintain security.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.topic: how-to
ms.date: 08/26/2021
---

# Create an Azure Policy exception for Azure Purview

Many subscriptions have [Azure Policies](../governance/policy/overview.md) in place that restrict the creation of some resources. This is to maintain subscription security and cleanliness. However, Azure Purview accounts deploy two other Azure resources when they are created: an Azure Storage account, and an Event Hub namespace. When you [create Azure Purview Account](create-catalog-portal.md), these resources will be deployed. They will be managed by Azure, so you don't need to maintain them, but you will need to deploy them.

To maintain your policies in your subscription, but still allow the creation of these managed resources, you can create a policy exception.

## Create a policy exception for Azure Purview

1. Navigate to the [Azure portal](https://portal.azure.com) and search for **Policy**

    :::image type="content" source="media/create-purview-portal-faq/search-for-policy.png" alt-text="Screenshot showing the Azure portal search bar, searching for Policy keyword.":::

1. Follow [Create a custom policy definition](../governance/policy/tutorials/create-custom-policy-definition.md) or modify existing policy to add two exceptions with `not` operator and `resourceBypass` tag:

    ```json
    {
    "mode": "All",
      "policyRule": {
        "if": {
          "anyOf": [
          {
            "allOf": [
            {
              "field": "type",
              "equals": "Microsoft.Storage/storageAccounts"
            },
            {
              "not": {
                "field": "tags['<resourceBypass>']",
                "exists": true
              }
            }]
          },
          {
            "allOf": [
            {
              "field": "type",
              "equals": "Microsoft.EventHub/namespaces"
            },
            {
              "not": {
                "field": "tags['<resourceBypass>']",
                "exists": true
              }
            }]
          }]
        },
        "then": {
          "effect": "deny"
        }
      },
      "parameters": {}
    }
    ```
  
    > [!Note]
    > The tag could be anything beside `resourceBypass` and it's up to you to define value when creating Azure Purview in latter steps as long as the policy can detect the tag.

    :::image type="content" source="media/create-catalog-portal/policy-definition.png" alt-text="Screenshot showing how to create policy definition.":::

1. [Create a policy assignment](../governance/policy/assign-policy-portal.md) using the custom policy created.

    :::image type="content" source="media/create-catalog-portal/policy-assignment.png" alt-text="Screenshot showing how to create policy assignment" lightbox="./media/create-catalog-portal/policy-assignment.png":::

> [!Note] 
> If you have **Azure Policy** and need to add exception as in **Prerequisites**, you need to add the correct tag. For example, you can add `resourceBypass` tag:
> :::image type="content" source="media/create-catalog-portal/add-purview-tag.png" alt-text="Add tag to Azure Purview account.":::

## Next steps

To set up Azure Purview by using Private Link, see [Use private endpoints for your Azure Purview account](./catalog-private-link.md).
