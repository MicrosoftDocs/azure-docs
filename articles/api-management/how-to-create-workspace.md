---
title: Set up a workspace in Azure API Management
description: Learn how to create a workspace in Azure API Management. Workspaces allow decentralized API development teams to own and productize their own APIs.
author: dlepow
ms.topic: how-to
ms.service: api-management
ms.author: danlep
ms.date: 06/24/2024
ms.custom:
---

# Create and manage a workspace in Azure API Management

[!INCLUDE [api-management-availability-premium](../../includes/api-management-availability-premium.md)]

Set up a [workspace](workspaces-overview.md) to enable a decentralized API development team to manage and productize their own APIs, while a central API platform team maintains the API Management infrastructure. After you create a workspace and assign permissions, workspace collaborators can create and manage their own APIs, products, subscriptions, and related resources.

[!INCLUDE [api-management-workspace-intro-note](../../includes/api-management-workspace-intro-note.md)]

Follow the steps in this article to:

* Create an API Management workspace and a dedicated workspace gateway using the Azure portal
* Optionally, isolate the workspace gateway in an Azure virtual network
* Assign users to the workspace

## Prerequisites

* An API Management instance. If you need to, [create one](get-started-create-service-instance.md) in a supported tier.
* **Owner** or **Contributor** role on the resource group where the API Management instance is deployed, or equivalent permissions to create resources in the resource group.
* (Optional) An Azure virtual network and subnet to isolate the workspace gateway. You can configure the subnet for external mode (public inbound access, private outbound access) or internal mode (private inbound access, private outbound access). For detailed requirements, see [Network resource requirements for workspace gateways](virtual-network-injection-workspaces-resources.md).

 > [!IMPORTANT]
 > Plan your workspace's network configuration carefully. You can't change the network configuration or the associated virtual network and subnet after you create the workspace.

## Create a workspace - portal

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.

1. In the left menu, under **APIs**, select **Workspaces** > **+ Add**.

1. On the **Basics** tab, enter a descriptive **Display name**, resource **Name**, and optional **Description** for the workspace. Select **Save**.

1. On the **Gateway** tab, configure settings for the dedicated workspace gateway:

    * In **Gateway details**, enter a gateway name and select the number of scale **Units**.

    * In **Network**, select a **Network configuration** for your workspace gateway. 

    * If you select a network configuration that includes private inbound or private outbound network access, select or create a **Virtual network** and **Subnet** to isolate the workspace gateway. For network requirements, see [Network resource requirements for workspace gateways](virtual-network-injection-workspaces-resources.md).

1. Select **Review + create**. After validation completes, select **Create**.

It can take some time to create the workspace, workspace gateway, and related resources. After the deployment completes, the new workspace appears in the list on the **Workspaces** page. Select the workspace to manage its settings and resources.

> [!NOTE]
> You can view the gateway runtime hostname and other gateway details by selecting the workspace in the portal. Under **Deployment + infrastructure**, select **Gateways**, and select the name of the workspace's gateway.


## Assign users to workspace - portal

After creating a workspace, assign permissions to users to manage the workspace's resources. Each workspace user must be assigned both a service-scoped workspace RBAC role and a workspace-scoped RBAC role, or granted equivalent permissions using custom roles. 

To manage the workspace gateway, we recommend also assigning workspace users an Azure-provided RBAC role scoped to the workspace gateway. 

> [!NOTE]
> For easier management, set up Microsoft Entra groups to assign workspace permissions to multiple users.
> 

* For a list of built-in workspace roles, see [How to use role-based access control in API Management](api-management-role-based-access-control.md).
* For steps to assign a role, see [Assign Azure roles using the portal](../role-based-access-control/role-assignments-portal.yml?tabs=current).


### Assign a service-scoped role

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.

1. In the left menu, select **Access control (IAM)** > **+ Add**.

1. Assign one of the following service-scoped roles to each member of the workspace:

    * **API Management Service Workspace API Developer**
    * **API Management Service Workspace API Product Manager**

### Assign a workspace-scoped role

1. In the menu for your API Management instance, under **APIs**, select **Workspaces**  > the name of the workspace that you created.
1. In the **Workspace** window, select **Access control (IAM)**> **+ Add**.
    
1. Assign one of the following workspace-scoped roles to the workspace members to manage workspace APIs and other resources. 

    * **API Management Workspace Reader**
    * **API Management Workspace Contributor**
    * **API Management Workspace API Developer**
    * **API Management Workspace API Product Manager**

### Assign a gateway-scoped role

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your workspace gateway. For example, search for "Gateway" in the Azure portal search bar.

1. In the left menu, select **Access control (IAM)** > **+ Add**.

1. Assign one of the following roles to each member of the workspace. At minimum, we recommend assigning the **Reader** role to view the gateway's settings.
    
    * **Owner**
    * **Contributor**
    * **Reader**

## Get started with your workspace

Depending on their role in the workspace, users might have permissions to create APIs, products, subscriptions, and other resources, or they might have read-only access to some or all of them.

To get started managing, protecting, and publishing APIs in a workspace, see the following guidance.


|Resource  |Guide  |
|---------|---------|
|APIs     |   [Tutorial: Import and publish your first API](import-and-publish.md)      |
|Products     |   [Tutorial: Create and publish a product](api-management-howto-add-products.md)      |
|Subscriptions     | [Subscriptions in Azure API Management](api-management-subscriptions.md)<br/><br/>[Create subscriptions in API Management](api-management-howto-create-subscriptions.md)        |
|Policies     |  [Tutorial: Transform and protect your API](transform-api.md)<br/><br/>[Policies in Azure API Management](api-management-howto-policies.md)<br/><br/>[Set or edit API Management policies](set-edit-policies.md)       |
|Named values     | [Manage secrets using named values](api-management-howto-properties.md)        |
|Policy fragments     |  [Reuse policy configurations in your API Management policy definitions](policy-fragments.md)       |
| Schemas | [Validate content](validate-content-policy.md) |
| Groups | [Create and use groups to manage developer accounts](api-management-howto-create-groups.md)  |
| Notifications | [How to configure notifications and notification templates](api-management-howto-configure-notifications.md) | 



## Related content

* Learn more about [workspaces in Azure API Management](workspaces-overview.md).
* [Use a virtual network to secure inbound or outbound traffic for Azure API Management](virtual-network-concepts.md)