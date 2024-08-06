---
title: Set up a workspace in Azure API Management
description: Learn how to create a workspace and a workspace gateway in Azure API Management. Workspaces allow decentralized API development teams to own and productize their own APIs.
author: dlepow
ms.topic: how-to
ms.service: azure-api-management
ms.author: danlep
ms.date: 07/10/2024
ms.custom:
---

# Create and manage a workspace in Azure API Management

[!INCLUDE [api-management-availability-premium](../../includes/api-management-availability-premium.md)]

Set up a [workspace](workspaces-overview.md) to enable an API team to manage and productize their own APIs, while providing the API platform team with the tools to observe, govern, and maintain the API Management platform. After you create a workspace and assign permissions, workspace collaborators can create and manage their own APIs, products, subscriptions, and related resources.

[!INCLUDE [api-management-workspace-intro-note](../../includes/api-management-workspace-intro-note.md)]

Follow the steps in this article to:

* Create an API Management workspace and a workspace gateway using the Azure portal
* Optionally, isolate the workspace gateway in an Azure virtual network
* Assign permissions to the workspace

> [!NOTE]
> Currently, creating a workspace gateway is a long-running operation that can take up to 3 hours or more to complete. 

## Prerequisites

* An API Management instance. If you need to, [create one](get-started-create-service-instance.md) in a supported tier.
* **Owner** or **Contributor** role on the resource group where the API Management instance is deployed, or equivalent permissions to create resources in the resource group.
* (Optional) An existing or new Azure virtual network and subnet to isolate the workspace gateway's inbound and outbound traffic. For configuration options and requirements, see [Network resource requirements for workspace gateways](virtual-network-workspaces-resources.md).
    
## Create a workspace - portal

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.

1. In the left menu, under **APIs**, select **Workspaces** > **+ Add**.

1. On the **Basics** tab, enter a descriptive **Display name**, resource **Name**, and optional **Description** for the workspace. Select **Next**.

1. On the **Gateway** tab, configure settings for the workspace gateway:

    * In **Gateway details**, enter a gateway name and select the number of scale **Units**. The gateway costs are based on the number of units you select. For more information, see [API Management pricing](https://aka.ms/apimpricing).

    * In **Network**, select a **Network configuration** for your workspace gateway. 

        > [!IMPORTANT]
        > Plan your workspace's network configuration carefully. You can't change the network configuration after you create the workspace.

    * If you select a network configuration that includes private inbound or private outbound network access, select a **Virtual network** and **Subnet** to isolate the workspace gateway, or create a new one. For network requirements, see [Network resource requirements for workspace gateways](virtual-network-workspaces-resources.md).

1. Select **Next**. After validation completes, select **Create**.

It can take from several minutes to up to several hours to create the workspace, workspace gateway, and related resources. To track the deployment progress in the Azure portal, go to the gateway's resource group. In the left menu, under **Settings**, select **Deployments**.

After the deployment completes, the new workspace appears in the list on the **Workspaces** page. Select the workspace to manage its settings and resources.

> [!NOTE]
> * To view the gateway runtime hostname and other gateway details, select the workspace in the portal. Under **Deployment + infrastructure**, select **Gateways**, and select the name of the workspace's gateway.
> * While the workspace gateway is being created, runtime calls to the workspace's APIs won't succeed.

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

1. In the menu for your API Management instance, under **APIs**, select **Workspaces** > the name of the workspace that you created.
1. In the **Workspace** window, select **Access control (IAM)**> **+ Add**.
    
1. Assign one of the following workspace-scoped roles to the workspace members so that they can manage workspace APIs and other resources. 

    * **API Management Workspace Reader**
    * **API Management Workspace Contributor**
    * **API Management Workspace API Developer**
    * **API Management Workspace API Product Manager**

### Assign a gateway-scoped role

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.

1. In the left menu, under **APIs**, select **Workspaces**  > the name of your workspace.

1. In the left menu of the workspace, select **Gateways**, and select the workspace gateway. 

1. In the left menu, select **Access control (IAM)** > **+ Add**.

1. Assign one of the following roles to each member of the workspace. At minimum, we recommend assigning the **Reader** role to view the gateway's settings. **Owners** and **Contributors** can manage the gateway's settings including scaling the gateway.
    
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
| Backends | [Use backends in Azure API Management](backends.md) |
|Policy fragments     |  [Reuse policy configurations in your API Management policy definitions](policy-fragments.md)       |
| Schemas | [Validate content](validate-content-policy.md) |
| Groups | [Create and use groups to manage developer accounts](api-management-howto-create-groups.md)  |
| Notifications | [How to configure notifications and notification templates](api-management-howto-configure-notifications.md) | 


## Related content

* Learn more about [workspaces in Azure API Management](workspaces-overview.md).
* [Use a virtual network to secure inbound or outbound traffic for Azure API Management](virtual-network-concepts.md)