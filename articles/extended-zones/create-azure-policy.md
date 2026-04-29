---
title: Deploy a Custom Azure Policy in an Azure Extended Zone
description: Learn how to deploy a custom Azure policy in an Azure extended zone.
author: svaldesgzz
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 02/12/2026
---

# Create a custom Azure policy in an Azure extended zone

In this article, you learn how to create and deploy a custom Azure policy in an Azure extended zone.

> [!NOTE]
> Azure Policy is supported in Azure Extended Zones with custom policies. Built-in Azure Policy definitions aren't supported in extended zones yet. To enforce governance in extended zones, you must create and deploy custom Azure Policy definitions that are tailored to the unique characteristics of these zones. Examples are **extendedLocation**, **extendedLocation.name**, and **extendedLocation.type**. You might find it helpful to use built-in policy definitions as a reference when you create your custom policies.

## Prerequisites

- An Azure account with an active subscription. If you don't have an account, you can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Access to an extended zone. For more information, see [Request access to an Azure extended zone](request-access.md).
- Basic understanding of Azure Policy. For more information, see [What is Azure Policy?](/azure/governance/policy/overview).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create a custom Azure Policy in an Azure extended zone

In this section, you create a custom Azure policy in an extended zone.

For this example, you create an Allowed Locations policy that restricts the locations where resources can be deployed.

1. In the search box at the top of the portal, enter **policy**. Select **Policy** from the search results.

1. On the **Policy** pane, go to **Authoring** > **Definitions**.

1. Select **+ Policy definition**.

1. On the **Create a policy definition** pane, fill in the required fields. For guidance on the required fields, use the following table:

    | Field | Guidance |
    | ------ | --------- |
    | Definition location | Use a management group for enterprise-wide governance (recommended) or a subscription for more granular control. |
    | Name | Use a clear, intent-based name (for example, `Deny-NonApproved-Locations`). |
    | Description | Explain what the policy enforces and why. |
    | Category | Use an existing category or create one (for example, Governance or Networking). |

1. Define the policy rule. In the **Policy rule** section, for this example, enter the following JSON code to create a policy that denies the creation of resources in locations other than an Azure extended zone.

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

   In this example, replace `losangeles` with the name of the extended zone location to which you have access. You can find the location name in the Azure portal when you deploy resources in the extended zone, or by using the Azure CLI or Azure PowerShell.

    > [!NOTE]
    > The **extendedlocation.name** property or similar extended zone-specific fields might be highlighted as errors in the JSON editor. You can disregard this notification because you can still successfully save, deploy, and enforce the policy with these fields included.

1. Select **Save** to create the policy definition.

## Policy management and monitoring

You can manage and monitor your Azure policies on the **Policy** dashboard in the Azure portal.

## Clean up resources

If you're finished working with resources from this tutorial, you can delete any of the policy assignments or definitions that you created.

1. On the service menu on the **Azure Policy** page, under **Authoring**, select **Definitions**. Or select **Assignments** if you're trying to delete an assignment.

1. Search for the new initiative or policy definition (or assignment) that you want to remove.

1. Right-click the row or select the ellipses at the end of the definition (or assignment). Select **Delete definition** (or **Delete assignment**).

## Related content

- [What is Azure Policy?](/azure/governance/policy/overview)
- [What is Azure Extended Zones?](overview.md)
- [Deploy a virtual machine in an extended zone](deploy-vm-portal.md)
- [Frequently asked questions](faq.md)
