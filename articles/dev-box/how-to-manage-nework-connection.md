---
title: How to manage network connections
titleSuffix: Microsoft Dev Box
description: 
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/15/2022
ms.topic: how-to
---

# Manage network connections

Network connections determine the region into which dev boxes are deployed and allow them to be connected to your existing virtual networks. 

Plan network connectivity for dev boxes


## Permissions 

To manage a network connection, you need both:
- Owner or Contributor permissions on an Azure Subscription or a specific resource group.
- Network Contributor permissions on an existing virtual network (owner or contributor) or permission to create a new virtual network and subnet.

## Create a vnet and subnet
To perform the steps in this section, you must have an existing virtual network (vnet) and subnet. If you don't have a vnet and subnet available, follow the instructions here: [Quickstart: Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md) to create them. 
## Configure firewall
If your organization routes egress traffic through a firewall, you need to open certain ports to allow the Dev Box service to function. For more information, see [Network requirements](/windows-365/enterprise/requirements-network).

## Create a network connection
The following steps show you how to create and configure a network connection in Microsoft Dev Box.  
### Types of Azure Active Directory Join
The DevBox service requires a configured and working Hybrid AD join or Azure AD join. 
•	[Plan your hybrid Azure Active Directory join deployment - Microsoft Entra | Microsoft Docs]https://docs.microsoft.com/en-us/azure/active-directory/devices/hybrid-azuread-join-plan
•	[Plan your Azure Active Directory join deployment - Microsoft Entra | Microsoft Docs]https://docs.microsoft.com/en-us/azure/active-directory/devices/azureadjoin-plan


1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *Network connections* and then select **Network connections** from the list.

1. On the **Network Connections** page, select **+Create**.
     :::image type="content" source="./media/quickstart-configure-dev-box-service/network-connections-empty.png" alt-text="Screenshot showing the Network Connections page with Create highlighted.":::

1. Follow the steps on the appropriate tab to create your network connection.
   #### [Azure AD join](#tab/AzureADJoin/)

   On the **Create a network connection** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Domain join type**|Select **Azure active directory join**.|
   |**Subscription**|Select the subscription in which you want to create the network connection.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**Name**|Enter a descriptive name for your network connection.|
   |**Virtual network**|Select the virtual network you want the network connection to use.|
   |**Subnet**|Select the subnet you want the network connection to use.|

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-native-network-connection-full-blank.png" alt-text="Screenshot showing the create network connection basics tab with Azure Active Directory join highlighted.":::

   #### [Hybrid Azure AD join](#tab/HybridAzureADJoin/)

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

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-hybrid-network-connection-full-blank.png" alt-text="Screenshot showing the create network connection basics tab with Hybrid Azure Active Directory join highlighted.":::

   ---

5. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. When the deployment is complete, select **Go to resource**. You'll see the Network Connection overview page.

## Attach network connection to dev center
You need to attach a network connection to a dev center before it can be used in projects to create dev box pools.

1. In the [Azure portal](https://portal.azure.com), in the search box, type *Dev centers* and then select **Dev centers** from the list.

1. Select the dev center you created and select **Networking**. 
 
1. Select  **+ Add**.
 
1. In the **Add network connection** pane, select the network connection you created earlier, and then select **Add**. 

After creation, several health checks are run on the network. You can view the status of the checks on the resource overview page. Network connections that pass all the health checks can be added to a dev center and used in the creation of dev box pools. The dev boxes within the dev box pools will be created and domain joined in the location of the vnet assigned to the network connection.

:::image type="content" source="./media/quickstart-configure-dev-box-service/network-connection-grid-populated.png" alt-text="Screenshot showing the status of a network connection.":::

To resolve any errors, refer to the [Troubleshoot Azure network connections](/windows-365/enterprise/troubleshoot-azure-network-connection).


## Detach a network connection from a dev center



