---
title: Deploy a Custom Azure Policy in an Azure Extended Zone
description: Learn how to deploy a custom Azure Policy in an Azure Extended Zone.
author: svaldesgzz
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 02/12/2026
---

# Create a custom Azure Policy in an Azure Extended Zone

In this article, you learn how to create and deploy a custom Azure Policy in an Extended Zone.
> [!NOTE]
> Built-in Azure Policy definitions aren't supported in Extended Zones yet, but Azure Policy does support Azure Extended Zones as part of allow/deny custom policies. Thus, to enforce governance in Extended Zones you must create and deploy custom Azure Policy definitions that are tailored to the unique characteristics of these zones, namely ***extendedLocation***, ***extendedLocation.name***, and ***extendedLocation.type***. You may find it helpful to use built-in policy definitions as a reference when creating your custom policies. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Access to an Extended Zone. For more information, see [Request access to an Azure Extended Zone](request-access.md).

- Basic understanding of Azure Policy. For more information, see [What is Azure Policy?](/azure/governance/policy/overview). 

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create a custom Azure Policy in an Azure Extended Zone

In this section, you create a custom Azure Policy in an Extended Zone. 

For this example, we created an Allowed Locations policy that restricts the locations where resources can be deployed.

1. In the search box at the top of the portal, enter ***policy***. Select **Policy** from the search results.

1. In **Policy**, navigate to **Authoring → Definitions**.

1. Select **+ Policy definition**.

1. In **Create a policy definition**, fill in the required fields. Use the following table for guidance. 

**Required fields:**

| Field | Guidance |
|------|---------|
| Definition location | Use a **management group** for enterprise-wide governance (recommended), or a **subscription** for more granular control. |
| Name | Use a clear, intent-based name (for example, `Deny-NonApproved-Locations`). |
| Description | Explain what the policy enforces and why. |
| Category | Use an existing category or create one (for example, *Governance* or *Networking*). |


5. Next, define the Policy Rule. In the **Policy rule** section, for this example, enter the following JSON code to create a policy that denies the creation of resources in locations other than an Azure Extended Zone:

```json
{
    "mode": "Indexed",
    "parameters": {
        "listOfAllowedLocations": {
            "type": "Array",
            "metadata": {
                "description": "The list of locations that can be specified when deploying resources.",
                "strongType": "location",
                "displayName": "Allowed locations"
            }
        }
    },
    "policyRule": {
        "if": {
            "allOf": [
                {
                    "field": "location",
                    "notIn": "[parameters('listOfAllowedLocations')]"
                },
                {
                    "field": "location",
                    "notEquals": "global"
                },
                {
                    "field": "extendedLocation.name",
                    "notEquals": "losangeles"
                },
                {
                    "field": "type",
                    "notEquals": "Microsoft.AzureActiveDirectory/b2cDirectories"
                }
            ]
        },
        "then": {
            "effect": "deny"
        }
    }
}
```
In this example, replace `losangeles` with the name of the Extended Zone location you have access to. You can find the location name in the Azure portal when deploying resources in the Extended Zone, or by using Azure CLI or PowerShell.
> [!NOTE]
> The **extendedlocation.name** or similar Extended Zone-specific fields may be highlighted  as errors in the json editor. You may disregard this, as you can still successfully save, deploy and enforce the policy with these fields included. 

6. Select **Save** to create the policy definition.


## Policy management and monitoring

You can manage and monitor your Azure Policies in the Policy home dashboard in the Azure portal.

## Clean up resources
If you're done working with resources from this tutorial, use the following steps to delete any of the policy assignments or definitions created above:

1. Select **Definitions** (or **Assignments** if you're trying to delete an assignment) under **Authoring** in the left side of the Azure Policy page.

1. Search for the new initiative or policy definition (or assignment) you want to remove.

1. Right-click the row or select the ellipses at the end of the definition (or assignment), and select **Delete definition** (or **Delete assignment**).

## Related content
- [What is Azure Policy?](/azure/governance/policy/overview)
- [What is Azure Extended Zones?](overview.md)
- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Frequently asked questions](faq.md)
