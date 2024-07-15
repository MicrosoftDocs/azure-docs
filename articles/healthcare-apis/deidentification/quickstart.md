---
title: Quickstart: deploy your first de-identification service
description: Get up and running quickly with the de-identification service in Azure Health Data Services.
author: kimiamavon, jovinson-ms
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: quickstart
ms.date: 06/11/2024
ms.author: kimiamavon, jovinson
#customer intent: As a cloud administrator, I want a quick method to deploy an Azure resource for production environments or to evaluate the service's functionality.
---

# Quickstart: Deploy your first de-identification service

In this quickstart, you deploy a de-identification service in your Azure subscription.

## Prerequisites
- If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Register the `Microsoft.HealthDataAIServices` resource provider.

## Deploy a de-identification service
To deploy a de-identification service, start at the Azure portal home page.

1. Search for **de-identification** in the top search bar.
1. Select **De-identification Services** in the search results.
1. Select the **Create** button.

## Complete the Basics tab
In the _Basics_ tab, you'll provide basic information for your de-identification service.
1. Fill in the _Project Details_ section:
    |Setting  |Action   |
    |---------|---------|
    |Subscription   |Select your Azure subscription. |
    |Resource group |Select **Create new** and enter **my-deid**. |
1. Fill in the _Instance details_ section:
    |Setting  |Action   |
    |---------|---------|
    |Name   |Name your de-identification service. |
    |Location |Select a supported Azure region. |

## (Optional) Complete the Tags tab
Tags are name/value pairs. You can assign the same tag to multiple resources and resource groups to categorize resources and consolidate billing. In this document, you won't be adding any tags.
For more information, see [Use tags to organize your Azure resources](/azure/azure-resource-manager/management/tag-resources).
[Logging](../logging.md)
## (Optional) Complete the Managed Identity tab
In the _Managed Identity_ tab, you can assign a managed identity to your de-identification service. Learn more about 
[managed identities](managed-identities.md).

1. To create a system-assigned managed identity, select **On** under _Status_.
1. To add a user-assigned managed identity, select **Add** to use the selection blade to choose an existing identity to assign.

## Review and create
Now that you've completed configuration, you can deploy the de-identification service.

1. Select **Next: Review + create** to review your choices.
1. Select **Create** to start the deployment of your de-identification service. Once the deployment is complete, select **Go to resource** to view your service.

## Clean up resources
If you no longer need them, delete the resource group and de-identification service. To do so, select the resource group and select **Delete**.

## Related content

[De-identification service overview](overview.md)