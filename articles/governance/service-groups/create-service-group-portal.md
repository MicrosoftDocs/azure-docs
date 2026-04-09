---
title: "Quickstart: Create a service group using the Azure portal - Azure Governance"
description: In this quickstart, you use the portal to create a service group to organize your resources.
author: rthorn17
ms.author: kenieva
ms.service: azure-policy
ms.topic: quickstart  
ms.date: 5/19/2025
ms.custom:
  - build-2025
---


# Quickstart: Create a service group (preview) in the portal
 
Azure Service Groups let you create flexible, custom groupings of your Azure resources across subscriptions and resource groups, without changing your existing resource hierarchy. For a full overview of capabilities and scenarios, see [What are Azure Service Groups?](overview.md).

> [!IMPORTANT]
> Azure Service Groups is currently in public preview. 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)
  account before you begin.
- You need **Service Group Contributor** or **Service Group Administrator** role on the parent service group where you want to create the new group. If creating under the root service group, see [Root Service Group access](./overview.md#the-root-service-group).

## Create in Azure portal

1. Log into the [Azure portal](https://portal.azure.com/).

2. In the top search bar, search for **Service Groups** and select **Service Groups** from the results.

3. Select **+ Create Service Group**.
    
   :::image type="content" source="./media/create-service-group.png" alt-text="Screenshot of new Service Group screen." Lightbox = "./media/create-service-group.png" :::

4. Fill in the **Service Group ID** field.

   * The **Service Group ID** is a unique identifier used to reference this service group in API calls, scripts, and policies. This ID **can't be changed** after creation, so choose a meaningful and descriptive name (for example, `platform-networking` or `project-contoso-prod`).
   * The ID must be globally unique across all Microsoft Entra tenants. Two tenants can't have a Service Group with the same ID.
   * The **Display name** field is optional and can be changed at any time. It controls how the service group appears in the Azure portal.

5. Select the **Parent Service Group**. 
    
   * If you don't have a parent service group, or don't know what to pick, select the Root Service Group which has the same ID as your tenant's ID: `Microsoft.Management/serviceGroups/[tenantId]`

6. Select **Next** to proceed.

7. The review page shows a summary of your choices.

   :::image type="content" source="./media/create-review-service-group.png" alt-text="Screenshot of the review page for creating a new service group" Lightbox="./media/create-review-service-group.png":::

8. If all information is correct, select **Create**.

> [!TIP]
> After creating your service group, the next step is to add members. See [Add members to a service group in the portal](create-service-group-member-portal.md) or [Add members using REST API](create-service-group-member-rest-api.md).

## Clean up resources

1. In the top search bar, search for **Service Groups** and select **Service Groups** from the results.

1. Find the service group you want to delete, select the checkbox next to it.

1. Select the **Delete** button at the top of the page.  

## Next steps

In this quickstart, you created a service group. The next step is to add resources, resource groups, or subscriptions as members.

> [!div class="nextstepaction"]
> [Add members to a service group in the portal](create-service-group-member-portal.md)

## Related content
* [What are Azure Service Groups?](overview.md)
* [How to: Manage Service Groups](manage-service-groups.md)
* [Add members using REST API](create-service-group-member-rest-api.md)
* [Manage membership at scale](manage-membership.md)
