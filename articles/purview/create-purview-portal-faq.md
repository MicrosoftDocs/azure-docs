---
title: Create Azure Purview account in Portal frequently asked questions (FAQ)
description: This article answers frequently asked questions about creating Purview accounts via portal
author: nayenama
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 05/11/2021
# Customer intent: As an Azure Purview admin, I want to set Purview accounts using Azure portal
---

# FAQ about creating Purview accounts via portal

This article answers common questions that customers and field teams often ask about creating Purview account using Azure portal [Create Purview Account](create-catalog-portal.md). I

## Common questions

Check out the answers to the following common questions.

### Azure policy blocking from creating storage and event hub namespace 

* If you have **Azure Policy** blocking all applications from creating **Storage account** and **EventHub namespace**, you need to make policy exception using tag, which can be entered during the process of creating a Purview account. The main reason is that for each Purview Account created, it needs to create a managed Resource Group and within this resource group, a Storage account and an
EventHub namespace.

    > [!important]
    > You don't have to follow this step if you don't have Azure Policy or an existing Azure Policy is not blocking the creation of **Storage account** and **EventHub namespace**.

    1. Navigate to the Azure portal and search for **Policy**
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
        > The tag could be anything beside `resourceBypass` and it's up to you to define value when creating Purview in latter steps as long as the policy can detect the tag.

        :::image type="content" source="media/create-catalog-portal/policy-definition.png" alt-text="Screenshot showing how to create policy definition.":::

    1. [Create a policy assignment](../governance/policy/assign-policy-portal.md) using the custom policy created.

       :::image type="content" source="media/create-catalog-portal/policy-assignment.png" alt-text="Screenshot showing how to create policy assignment" lightbox="./media/create-catalog-portal/policy-assignment.png":::

> [!Note] 
> If you have **Azure Policy** and need to add exception as in **Prerequisites**, you need to add the correct tag. For example, you can add `resourceBypass` tag:
> :::image type="content" source="media/create-catalog-portal/add-purview-tag.png" alt-text="Add tag to Purview account.":::

## Next steps

To set up Azure Purview by using Private Link, see [Use private endpoints for your Azure Purview account](./catalog-private-link.md).
