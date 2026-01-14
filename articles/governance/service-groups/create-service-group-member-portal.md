---
title: "Quickstart: Add Service Group members using Portal - Azure Governance"
description: In this quickstart, you use Azure portal to add a resource to a service group with a service group member relationship.
author: kenieva
ms.author: kenieva
ms.service: azure-policy
ms.topic: quickstart
ms.date: 11/3/2025
---


# Quickstart: Add resources or resource containers to service groups with Service Group Member Relationships in Portal 
 
To add resources, resource groups, or subscriptions to a Service Group (preview), you need to create a new Service Group Member Relationship. For more information on service groups, see [Getting started with Service Groups](overview.md).

> [!IMPORTANT]
> Azure Service Groups is currently in PREVIEW. 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)
  account before you begin.

- To be able to deploy a service group member relationship, you must have Microsoft.Relationship/ServiceGroupMember/write permissions on member resource and [Service Group Contributor](../../role-based-access-control/built-in-roles/management-and-governance.md) at the target service group. 

## Add members during service group creation 

1. When creating a new Service Group, there's an available `Members` tab to add resources. 

:::image type="content" source="./media/members-tab-create-flow.png" alt-text="Screenshot of the members tab within the create service group page." lightbox="./media/members-tab-create-flow.png":::

2. Select to add individual resources, resource groups, or subscriptions. 

3. Once selected, you can use filters to narrow the list as needed. 

4. Once all members are chosen, press **Select**

5. All members to be added are displayed in the list. 

:::image type="content" source="./media/members-list-create-flow.png" alt-text="Screenshot of the members list within the create service group page." Lightbox="./media/members-list-create-flow.png":::

6. Continue the service group creation flow or if all information is correct, select **Review + Create**


## Add members to existing service group 

1. Log into the [Azure portal](https://aka.ms/portalfx/service-groups-internal).

2. Select **All services** > **Management + governance**.

3. Select **Service Groups**.

4. Select the desired Service Group. 

5. In the left hand side service menu, select **members** under relationship management. 

:::image type="content" source="./media/members-service-menu.png" alt-text="Screenshot of the relationship management drop down within the left hand context pane on the service group page." Lightbox="./media/members-service-menu.png":::

6. To add members, select the **+Add** button on the top action bar. Select to add individual resources, resource groups, or subscriptions. On the **Add members** pane, select and filter to the desired resources. Once all members are chosen, select **Add**. 


## Remove members to existing service group

1. Log into the [Azure portal](https://aka.ms/portalfx/service-groups-internal).

2. Select **All services** > **Management + governance**.

3. Select **Service Groups**.

4. Select the desired Service Group. 

5. In the left hand side service menu, select **members** under relationship management. 

6. Select the members from the list of members by clicking the check box and press **Delete** from the top action bar. This removes the resource as a member, but won't delete the resource. 

:::image type="content" source="./media/delete-members.png" alt-text="Screenshot of the delete button within the  service group members page." Lightbox="./media/delete-members.png":::

## Next step

In this quickstart, you added members to service groups.

To learn more about service groups and how to manage your service group hierarchy, continue to:

> [!div class="nextstepaction"]
> [Manage your resources with service groups](manage-service-groups.md)