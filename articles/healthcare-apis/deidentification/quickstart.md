---
title: Quickstart - Deploy the de-identification service (preview) in Azure Health Data Services
description: Get up and running quickly with the de-identification service (preview) in Azure Health Data Services.
author: jovinson-ms
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: quickstart
ms.date: 7/16/2024
ms.author: jovinson
---

# Quickstart: Deploy the De-identification service (preview)

In this quickstart, you deploy an instance of the De-identification service (preview) in your Azure subscription.

## Prerequisites

- If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Register the `Microsoft.HealthDataAIServices` resource provider.

## Deploy the De-identification service (preview)

To deploy an instance of the De-identification service (preview), start at the Azure portal home page.

1. Search for **de-identification** in the top search bar.
1. Select **De-identification Services** in the search results.
1. Select the **Create** button.

## Complete the Basics tab

In the **Basics** tab, you provide basic information for your De-identification service (preview).

1. Fill in the **Project Details** section:

   | Setting        | Action                                       |
   |----------------|----------------------------------------------|
   | Subscription   | Select your Azure subscription.              |
   | Resource group | Select **Create new** and enter **my-deid**. |

1. Fill in the **Instance details** section:

   | Setting        | Action                                       |
   |----------------|----------------------------------------------|
   | Name           | Name your de-identification service.          |
   | Location       | Select a supported Azure region. |

## Complete the Tags tab (optional)

Tags are name-value pairs. You can assign the same tag to multiple resources and resource groups to categorize resources and consolidate billing. In this quickstart, you don't need to add any tags.
For more information, see [Use tags to organize your Azure resources](/azure/azure-resource-manager/management/tag-resources) and [Logging](../logging.md).

## Complete the Managed Identity tab (optional)

In the **Managed Identity** tab, you can assign a managed identity to your De-identification service (preview). For more information, see [managed identities](managed-identities.md).

1. To create a system-assigned managed identity, select **On** under **Status**.
1. To add a user-assigned managed identity, select **Add** to use the selection pane to assign an existing identity.

## Review and create

After you complete the configuration, you can deploy the De-identification service (preview).

1. Select **Next: Review + create** to review your choices.
1. Select **Create** to start the deployment of your de-identification service. After the deployment is complete, select **Go to resource** to view your service.

## Clean up resources

If you no longer need them, delete the resource group and De-identification service (preview). To do so, select the resource group and select **Delete**.

## Related content

[De-identification service overview](overview.md)
