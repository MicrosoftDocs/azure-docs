---
title: Quickstart - Deploy your first deidentification service
description: Get up and running quickly with the deidentification service in Azure Health Data Services.
author: jovinson-ms
ms.service: healthcare-apis
ms.subservice: workspace
ms.topic: quickstart
ms.date: 7/16/2024
ms.author: jovinson
---

# Quickstart - Deploy the Deidentification service

In this quickstart, you deploy an instance of the Deidentification service in your Azure subscription.

## Prerequisites

- If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Register the `Microsoft.HealthDataAIServices` resource provider.

## Deploy the Deidentification service

To deploy an instance of the Deidentification service, start at the Azure portal home page.

1. Search for **deidentification** in the top search bar.
1. Select **Deidentification Services** in the search results.
1. Select the **Create** button.

## Complete the Basics tab

In the _Basics_ tab, you provide basic information for your Deidentification service.

1. Fill in the **Project Details** section:

   | Setting        | Action                                       |
   |----------------|----------------------------------------------|
   | Subscription   | Select your Azure subscription.              |
   | Resource group | Select **Create new** and enter **my-deid**. |

 1. Fill in the **Instance details** section:
 
   | Setting        | Action                                       |
   |----------------|----------------------------------------------|
   | Name           | Name your Deidentification service.          |
   | Location       | Select a supported Azure region. |

## Complete the Tags tab (optional)

Tags are name/value pairs. You can assign the same tag to multiple resources and resource groups to categorize resources and consolidate billing. In this quickstart, you don't need to add any tags.
For more information, see [Use tags to organize your Azure resources](/azure/azure-resource-manager/management/tag-resources).
[Logging](../logging.md)

## Complete the Managed Identity tab (ptional)

In the _Managed Identity_ tab, you can assign a managed identity to your Deidentification service. Learn more about [managed identities](managed-identities.md).

1. To create a system-assigned managed identity, select **On** under **Status**.
1. To add a user-assigned managed identity, select **Add** to use the selection pane to choose an existing identity to assign.

## Review and create

After you complete the configuration, you can deploy the Deidentification service.

1. Select **Next: Review + create** to review your choices.
1. Select **Create** to start the deployment of your Deidentification service. After the deployment is complete, select **Go to resource** to view your service.

## Clean up resources

If you no longer need them, delete the resource group and Deidentification service. To do so, select the resource group and select **Delete**.

## Related content

[Deidentification service overview](overview.md)