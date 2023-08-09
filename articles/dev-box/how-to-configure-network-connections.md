---
title: Configure network connections
titleSuffix: Microsoft Dev Box
description: Learn how to create, delete, attach, and remove Microsoft Dev Box network connections.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/25/2023
ms.topic: how-to
#Customer intent: As a platform engineer, I want to be able to manage network connections so that I can enable dev boxes to connect to my existing networks and deploy them in the desired region.
---

# Connect dev boxes to resources by configuring network connections 

Network connections allow dev boxes to connect to existing virtual networks. They also determine the region into which dev boxes are deployed.

When you're planning network connectivity for your dev boxes, you must:

- Ensure that you have sufficient permissions to create and configure network connections.
- Ensure that you have at least one virtual network and subnet available for your dev boxes.
- Identify the region or location that's closest to your dev box users. Deploying dev boxes into a region that's close to users gives them a better experience.
- Determine whether dev boxes should connect to your existing networks by using Azure Active Directory (Azure AD) join or hybrid Azure AD join.

## Permissions

To manage a network connection, you need the following permissions:

|Action|Permissions required|
|-----|-----|
|Create and configure a virtual network and subnet|Network Contributor permissions on an existing virtual network (Owner or Contributor), or permission to create a new virtual network and subnet.|
|Create or delete a network connection|Owner or Contributor permissions on an Azure subscription or on a specific resource group.|
|Add or remove a network connection |Write permission on the dev center.|

## Create a virtual network and subnet

To create a network connection, you need an existing virtual network and subnet. If you don't have a virtual network and subnet available, use the following steps to create them:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **virtual network**. In the list of results, select **Virtual Network**.

1. On the **Virtual Network** page, select **Create**.

1. On the **Create virtual network** pane, on the **Basics** tab, enter the following values:

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select an existing resource group. Or create a new one by selecting **Create new**, entering **rg-name**, and then selecting **OK**. |
    | **Name** | Enter **VNet-name**. |
    | **Region** | Select the region for the virtual network and dev boxes. |

    :::image type="content" source="./media/how-to-manage-network-connection/example-basics-tab.png" alt-text="Screenshot of the Basics tab on the pane for creating a virtual network in the Azure portal." border="true":::

   > [!Important]
   > The region that you select for the virtual network is the where the dev boxes will be deployed.

1. On the **IP Addresses** tab, accept the default settings.

1. On the **Security** tab, accept the default settings.

1. On the **Review + create** tab, review the settings.

1. Select **Create**.

## Allow access to Dev Box endpoints from your network

An organization can control network ingress and egress by using a firewall, network security groups, and even Microsoft Defender.

If your organization routes egress traffic through a firewall, you need to open certain ports to allow the Microsoft Dev Box service to function. For more information, see [Network requirements](/windows-365/enterprise/requirements-network).

## Plan a network connection

The following sections show you how to create and configure a network connection in Microsoft Dev Box .
  
### Types of Active Directory join

The Dev Box service requires a configured and working Active Directory join, which defines how dev boxes join your domain and access resources. There are two choices:

- **Azure AD join**: If your organization uses Azure AD, you can use an Azure AD join (sometimes called a native Azure AD join). Dev box users sign in to Azure AD-joined dev boxes by using their Azure AD account and access resources based on the permissions assigned to that account. Azure AD join enables access to cloud-based and on-premises apps and resources. 

  For more information, see [Plan your Azure Active Directory join deployment](../active-directory/devices/azureadjoin-plan.md).
- **Hybrid Azure AD join**: If your organization has an on-premises Active Directory implementation, you can still benefit from some of the functionality in Azure AD by using hybrid Azure AD-joined dev boxes. These dev boxes are joined to your on-premises Active Directory instance and registered with Azure AD.

  Hybrid Azure AD-joined dev boxes require network line of sight to your on-premises domain controllers periodically. Without this connection, devices become unusable.

  For more information, see [Plan your hybrid Azure Active Directory join deployment](../active-directory/devices/hybrid-join-plan.md).

### Create a network connection

Follow the steps on the relevant tab to create your network connection.

#### [**Azure AD join**](#tab/AzureADJoin/)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **network connections**. In the list of results, select **Network connections**.

1. On the **Network Connections** page, select **Create**.

   :::image type="content" source="./media/how-to-manage-network-connection/network-connections-empty.png" alt-text="Screenshot that shows the Create button on the page for network connections.":::

1. On the **Create a network connection** pane, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Domain join type**|Select **Azure active directory join**.|
   |**Subscription**|Select the subscription in which you want to create the network connection.|
   |**ResourceGroup**|Select an existing resource group, or select **Create new** and then enter a name for the new resource group.|
   |**Name**|Enter a descriptive name for the network connection.|
   |**Virtual network**|Select the virtual network that you want the network connection to use.|
   |**Subnet**|Select the subnet that you want the network connection to use.|

   :::image type="content" source="./media/how-to-manage-network-connection/create-native-network-connection-full-blank.png" alt-text="Screenshot that shows the Basics tab on the pane for creating a network connection, with the option for Azure Active Directory join selected.":::

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. When the deployment is complete, select **Go to resource**. Confirm that the connection appears on the **Network connections** page.

#### [**Hybrid Azure AD join**](#tab/HybridAzureADJoin/)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **network connections**. In the list of results, select **Network connections**.

1. On the **Network Connections** page, select **Create**.

   :::image type="content" source="./media/how-to-manage-network-connection/network-connections-empty.png" alt-text="Screenshot that shows the Create button on the page that lists network connections.":::

1. On the **Create a network connection** pane, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Domain join type**|Select **Hybrid Azure active directory join**.|
   |**Subscription**|Select the subscription in which you want to create the network connection.|
   |**ResourceGroup**|Select an existing resource group, or select **Create new** and then enter a name for the new resource group.|
   |**Name**|Enter a descriptive name for the network connection.|
   |**Virtual network**|Select the virtual network that you want the network connection to use.|
   |**Subnet**|Select the subnet that you want the network connection to use.|
   |**AD DNS domain name**| Enter the DNS name of the Active Directory domain that you want to use for connecting and provisioning Cloud PCs. For example: `corp.contoso.com`. |
   |**Organizational unit**| Enter the organizational unit (OU). An OU is a container within an Active Directory domain that can hold users, groups, and computers. |
   |**AD username UPN**| Enter the username, in user principal name (UPN) format, that you want to use for connecting Cloud PCs to your Active Directory domain. For example: `svcDomainJoin@corp.contoso.com`. This service account must have permission to join computers to the domain and the target OU (if one is set). |
   |**AD domain password**| Enter the password for the user. |

   :::image type="content" source="./media/how-to-manage-network-connection/create-hybrid-network-connection-full-blank.png" alt-text="Screenshot that shows the Basics tab on the pane for creating a network connection, with the option for hybrid Azure Active Directory join selected.":::

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. When the deployment is complete, select **Go to resource**. Confirm that the connection appears on the **Network connections** page.

---

## Attach a network connection to a dev center

You need to attach a network connection to a dev center before you can use it in projects to create dev box pools.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev centers**. In the list of results, select **Dev centers**.

1. Select the dev center that you created, and then select **Networking**.

1. Select **+ Add**.

1. On the **Add network connection** pane, select the network connection that you created earlier, and then select **Add**.

   :::image type="content" source="./media/how-to-manage-network-connection/add-network-connection.png" alt-text="Screenshot that shows the pane for adding a network connection.":::

After you attach a network connection, the Azure portal runs several health checks on the network. You can view the status of the checks on the resource overview page.

:::image type="content" source="./media/how-to-manage-network-connection/network-connection-grid-populated.png" alt-text="Screenshot that shows the status of a network connection.":::

You can add network connections that pass all health checks to a dev center and use them to create dev box pools. Dev boxes within dev box pools are created and domain joined in the location of the virtual network that's assigned to the network connection.

To resolve any errors, see [Troubleshoot Azure network connections](/windows-365/enterprise/troubleshoot-azure-network-connection).

## Remove a network connection from a dev center

You can remove a network connection from a dev center if you no longer want to use it to connect to network resources. Network connections can't be removed if one or more dev box pools are using them.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev centers**. In the list of results, select **Dev centers**.

1. Select the dev center that you created, and then select **Networking**.

1. Select the network connection that you want to remove, and then select **Remove**.

   :::image type="content" source="./media/how-to-manage-network-connection/remove-network-connection.png" alt-text="Screenshot that shows the Remove button on the network connection page.":::

1. Read the warning message, and then select **OK**.

The network connection is no longer available for use in the dev center.

## Next steps

- [Manage a dev box definition](how-to-manage-dev-box-definitions.md)
- [Manage a dev box pool](how-to-manage-dev-box-pools.md)
- [Manage a dev box project](how-to-manage-dev-box-projects.md)
