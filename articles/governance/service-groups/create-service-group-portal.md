---
title: "Quickstart: Create a service group using the Azure portal - Azure Governance"
description: In this quickstart, you use the portal to create a service group to organize your resources.
author: rthorn17
ms.author: rithorn
ms.service: azure-policy
ms.topic: quickstart  
ms.date: 5/19/2025
ms.custom:
  - build-2025
---


# Quickstart: Create a service group (preview) in the portal
 
Azure Service Groups offer a flexible way to organize and manage resources across subscriptions and resource groups, parallel to any existing Azure resource hierarchy. They're ideal for scenarios requiring cross-boundary grouping, minimal permissions, and aggregations of data across resources. These features empower teams to create tailored resource collections that align with operational, organizational, or persona-based needs. This article helps give you an overview of what service groups are, the scenarios to use them for, and provide guidance on how to get started. For more information on service groups, see [Getting started with Service Groups](overview.md).

> [!IMPORTANT]
> Azure Service Groups is currently in PREVIEW. 
> For more information about participating in the preview, see [Azure Service Groups Preview](https://aka.ms/ServiceGroups/PreviewSignup).
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/)
  account before you begin.

## Create in Azure portal

1. Log into the [Azure portal](https://portal.azure.com).
2. Select **All services** > **Management + governance**.
3. Select **Service Groups**.
4. Select **+ Add Service Group**.
    
:::image type="content" source="./media/create-service-group.png" alt-text="Screenshot of new Service Group screen." Lightbox = "./media/create-service-group.png" :::
5. Fill in the service group ID field

   * The **Service Group ID** is the directory unique identifier that is used to submit commands
         on this service group. This identifier isn't editable after creation as it's used throughout
         the Azure system to identify this group. The
         [root service group](./overview.md#the-root-service-group) is
         automatically created with an ID that is the Microsoft Entra ID. For all other
         service groups, assign a unique ID.
   * The display name field is the name that is displayed within the Azure portal. A separate
         display name is an optional field when creating the service group and can be changed at any time.
6. Select the **Parent Service Group**. 
    
   * If you don't have a parent service group, or don't know what to pick, select the Root Service Group which has same ID as the tenant's ID. _"Microsoft.Management/serviceGroups[tenantId]"_

7. Select "Next" 
8. The review page shows

:::image type="content" source="./media/create-review-service-group.png" alt-text="Screenshot of the review page for creating a new service group" Lightbox="./media/create-review-service-group.png":::

9. If all information is correct, select **Create**

## Clean up resources

1. Select **All services** > **Management + governance**.

1. Select **Service Groups**.

1. Find the service group created that you want to delete, select it, then select the box. 

1. Select the **delete** button at the top of the page.  

## Next steps

In this quickstart, you created a service group. The service group can hold subscriptions, resource groups, or resources.

To learn more about service groups and how to manage your hierarchy, continue to:

> [!div class="nextstepaction"]
> [How to: Manage Service Groups](manage-service-groups.md)

## Related content
* [What are Azure Service Groups?](overview.md)
* [How to: Manage Service Groups](manage-service-groups.md)
* [Connect service group members with REST API](create-service-group-member-rest-api.md)
