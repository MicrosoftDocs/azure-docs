---
title: How to manage network connections
titleSuffix: Microsoft Dev Box Preview
description: This article describes how to create, delete, attach and remove Microsoft Dev Box Preview network connections.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 10/12/2022
ms.topic: how-to
---

<!-- Intent: As a dev infrastructure manager, I want to be able to manage network connections so that I can enable dev boxes to connect to my existing networks and deploy them in the desired region. -->
# Manage network connections
Network connections allow dev boxes to connect to existing virtual networks, and determine the region into which dev boxes are deployed. 

When planning network connectivity for your dev boxes, you must:
- Ensure you have sufficient permissions to create and configure network connections.
- Ensure you have at least one virtual network (VNet) and subnet available for your dev boxes.
- Identify the region or location closest to your dev boxes users. Deploying dev boxes into a region close to the users provides them with a better experience.
- Determine whether dev boxes should connect to your existing networks using an Azure Active Directory (Azure AD) join, or a Hybrid Azure AD join.
## Permissions 
To manage a network connection, you need the following permissions:

|Action|Permission required|
|-----|-----|
|Create and configure VNet and subnet|Network Contributor permissions on an existing virtual network (owner or contributor) or permission to create a new virtual network and subnet.|
|Create or delete network connection|Owner or Contributor permissions on an Azure Subscription or a specific resource group.|
|Add or remove network connection |Write permission on the dev center.|

## Create a virtual network and subnet
To create a network connection, you need an existing VNet and subnet. If you don't have a VNet and subnet available, use the following steps to create them:

1. Sign in to the [Azure portal](https://portal.azure.com).
 
1. In the search box, enter *Virtual Network*, and then select **Virtual Network** from the search results.

1. On the Virtual Network page, select **Create**.

1. On the Create virtual network page, enter or select this information on the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription. |
    | Resource group | Select an existing resource group, or to create a new one: </br> Select **Create new**.  </br> Enter *rg-name*. </br> Select **OK**. |
    | Name | Enter *VNet-name*. |
    | Region | Select the region for the VNet and dev boxes. |

    :::image type="content" source="./media/how-to-manage-network-connection/example-basics-tab.png" alt-text="Screenshot of creating a virtual network in Azure portal." border="true":::

   > [!Important]
   > The region you select for the VNet is the where the dev boxes will be deployed.

1. On the **IP Addresses** tab, accept the default settings.

1. On the **Security** tab, accept the default settings.

1. On the **Review + create** tab review the settings.

1. Select **Create**.

 
## Allow access to Dev Box endpoints from your network
Network ingress and egress can be controlled using a firewall, network security groups, and even Microsoft Defender. 

If your organization routes egress traffic through a firewall, you need to open certain ports to allow the Dev Box service to function. For more information, see [Network requirements](/windows-365/enterprise/requirements-network).

## Plan a network connection
The following steps show you how to create and configure a network connection in Microsoft Dev Box Preview.  
### Types of Azure Active Directory Join
The Dev Box service requires a configured and working Azure AD join or Hybrid AD join, which defines how dev boxes join your domain and access resources. 

If your organization uses Azure AD, you can use an Azure AD join, sometimes called a native Azure AD join. Dev box users sign into Azure AD joined dev boxes using their Azure AD account and access resources based on the permissions assigned to that account. Azure AD join enables access to cloud-based and on-premises apps and resources.

If your organization has an on-premises Active Directory implementation, you can still benefit from some of the functionality provided by Azure AD by using hybrid Azure AD joined dev boxes. These dev boxes are joined to your on-premises Active Directory and registered with Azure Active Directory. Hybrid Azure AD joined dev boxes require network line of sight to your on-premises domain controllers periodically. Without this connection, devices become unusable. 

You can learn more about each type of join and how to plan for them here:  
-	[Plan your hybrid Azure Active Directory join deployment](../active-directory/devices/hybrid-azuread-join-plan.md)
-	[Plan your Azure Active Directory join deployment](../active-directory/devices/azureadjoin-plan.md)

### Create a network connection
1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *Network connections* and then select **Network connections** from the list.

1. On the **Network Connections** page, select **+Create**.
     :::image type="content" source="./media/how-to-manage-network-connection/network-connections-empty.png" alt-text="Screenshot showing the Network Connections page with Create highlighted.":::

1. Follow the steps on the appropriate tab to create your network connection.
   #### [**Azure AD join**](#tab/AzureADJoin/)

   On the **Create a network connection** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Domain join type**|Select **Azure active directory join**.|
   |**Subscription**|Select the subscription in which you want to create the network connection.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**Name**|Enter a descriptive name for your network connection.|
   |**Virtual network**|Select the virtual network you want the network connection to use.|
   |**Subnet**|Select the subnet you want the network connection to use.|

   :::image type="content" source="./media/how-to-manage-network-connection/create-native-network-connection-full-blank.png" alt-text="Screenshot showing the create network connection basics tab with Azure Active Directory join highlighted.":::

   #### [**Hybrid Azure AD join**](#tab/HybridAzureADJoin/)

   On the **Create a network connection** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Domain join type**|Select **Hybrid Azure active directory join**.|
   |**Subscription**|Select the subscription in which you want to create the network connection.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**Name**|Enter a descriptive name for your network connection.|
   |**Virtual network**|Select the virtual network you want the network connection to use.|
   |**Subnet**|Select the subnet you want the network connection to use.|
   |**AD DNS domain name**| The DNS name of the Active Directory domain that you want to use for connecting and provisioning Cloud PCs. For example, corp.contoso.com. |
   |**Organizational unit**| An organizational unit (OU) is a container within an Active Directory domain, which can hold users, groups, and computers. |
   |**AD username UPN**| The username, in user principal name (UPN) format, that you want to use for connecting the Cloud PCs to your Active Directory domain. For example, svcDomainJoin@corp.contoso.com. This service account must have permission to join computers to the domain and, if set, the target OU. |
   |**AD domain password**| The password for the user specified above. |

   :::image type="content" source="./media/how-to-manage-network-connection/create-hybrid-network-connection-full-blank.png" alt-text="Screenshot showing the create network connection basics tab with Hybrid Azure Active Directory join highlighted.":::

 ---

Use the following steps to finish creating your network connection, for both Azure AD join and Hybrid Azure AD join:
   1. Select **Review + Create**.

   1. On the **Review** tab, select **Create**.

   1. When the deployment is complete, select **Go to resource**. You'll see the Network Connection overview page.
 

## Attach network connection to dev center
You need to attach a network connection to a dev center before it can be used in projects to create dev box pools.

1. In the [Azure portal](https://portal.azure.com), in the search box, type *Dev centers* and then select **Dev centers** from the list.

1. Select the dev center you created and select **Networking**. 
 
1. Select  **+ Add**.
 
1. In the **Add network connection** pane, select the network connection you created earlier, and then select **Add**. 
 
   :::image type="content" source="./media/how-to-manage-network-connection/add-network-connection.png" alt-text="Screenshot showing the Add network connection pane.":::   

After creation, several health checks are run on the network. You can view the status of the checks on the resource overview page. Network connections that pass all the health checks can be added to a dev center and used in the creation of dev box pools. The dev boxes within the dev box pools will be created and domain joined in the location of the VNet assigned to the network connection.

:::image type="content" source="./media/how-to-manage-network-connection/network-connection-grid-populated.png" alt-text="Screenshot showing the status of a network connection.":::

To resolve any errors, refer to the [Troubleshoot Azure network connections](/windows-365/enterprise/troubleshoot-azure-network-connection).


## Remove a network connection from a dev center
You can remove a network connection from a dev center if you no longer want it to be used to connect to network resources. Network connections can't be removed if they are in use by one or more dev box pools. 

1. In the [Azure portal](https://portal.azure.com), in the search box, type *Dev centers* and then select **Dev centers** from the list.

1. Select the dev center you created and select **Networking**. 
 
1. Select  the network connection you want to remove and then select **Remove**.

   :::image type="content" source="./media/how-to-manage-network-connection/remove-network-connection.png" alt-text="Screenshot showing the network connection page with Remove highlighted.":::   

1. Read the warning message, and then select **Ok**.

The network connection will no longer be available for use in the dev center.

## Next steps

<!-- [Manage a dev center](./how-to-manage-dev-center.md) -->
- [Quickstart: Configure a Microsoft Dev Box Preview Project](./quickstart-configure-dev-box-project.md)