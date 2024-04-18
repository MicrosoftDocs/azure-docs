---
title: Configure network connections
titleSuffix: Microsoft Dev Box
description: Learn how to manage network connections for a dev center in Microsoft Dev Box. Connect to a virtual network or enable connecting to on-premises resources.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 01/12/2024
ms.topic: how-to
#Customer intent: As a platform engineer, I want to be able to manage network connections so that I can enable dev boxes to connect to my existing networks and deploy them in the desired region.
---

# Connect dev boxes to resources by configuring network connections

In this article, you learn how to manage network connections for a dev center in Microsoft Dev Box. Network connections enable dev boxes to connect to existing virtual networks. In addition, you can configure the network settings to enable connecting to on-premises resources from your dev box. The location, or Azure region, of the network connection determines where associated dev boxes are hosted.

You can choose to deploy dev boxes to a Microsoft-hosted network associated with a [dev box pool](how-to-manage-dev-box-pools.md#create-a-dev-box-pool) or to a network that you manage. If you choose to deploy dev boxes to a network that you manage, you must first configure a network connection.

You need to add at least one network connection to a dev center in Microsoft Dev Box.

## Prerequisites

- Sufficient permissions to enable creating and configuring network connections.
- At least one virtual network and subnet available for your dev boxes.

When you're planning network connectivity for your dev boxes, consider the following points:

- Identify the region or location that's closest to your dev box users. Deploying dev boxes into a region that's close to users gives them a better experience.
- Determine whether dev boxes should connect to your existing networks by using Microsoft Entra join or Microsoft Entra hybrid join.

### Verify your permissions

To manage a network connection, confirm that you have the following permissions:

| Action | Role | Permissions required |
|---|---|---|
| _Create and configure a virtual network and subnet_ | **Network Contributor** (**Owner** or **Contributor**) | Permissions on an existing virtual network or permission to create a new virtual network and subnet |
| _Create or delete a network connection_ | **Owner** or **Contributor** | Permissions on an Azure subscription or on a specific resource group, which includes permission to create a resource group |
| _Add or remove a network connection_ | **Contributor** | Permission to perform **Write** actions on the dev center |

## Create a virtual network and subnet

To create a network connection, you need an existing virtual network and subnet. If you don't have a virtual network and subnet available, use the following steps to create them:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **virtual network**. In the list of results, select **Virtual Network**.

1. On the **Virtual Network** page, select **Create**.

1. On the **Create virtual network** pane, on the **Basics** tab, enter the following values:

    | Setting | Value |
    |---|---|
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select an existing resource group, or create a new one by selecting **Create new**, entering a name, and then selecting **OK**. |
    | **Name** | Enter a name for the virtual network. |
    | **Region** | Select the region for the virtual network and dev boxes. |

    :::image type="content" source="./media/how-to-manage-network-connection/example-basics-tab.png" alt-text="Screenshot of the Basics tab on the pane for creating a virtual network in the Azure portal." lightbox="./media/how-to-manage-network-connection/example-basics-tab.png":::

   > [!IMPORTANT]
   > The region you select for the virtual network is where Azure deploys the dev boxes.

1. On the **IP Addresses** tab, accept the default settings.

1. On the **Security** tab, accept the default settings.

1. On the **Review + create** tab, review the settings.

1. Select **Create**.

## Allow access to Microsoft Dev Box endpoints from your network

An organization can control network ingress and egress by using a firewall, network security groups, and even Microsoft Defender.

If your organization routes egress traffic through a firewall, you need to open certain ports to allow the Microsoft Dev Box service to function. For more information, see [Network requirements](/windows-365/enterprise/requirements-network).

## Plan a network connection

The following sections show you how to create and configure a network connection in Microsoft Dev Box.

### Review types of Active Directory join

Microsoft Dev Box requires a configured and working Active Directory join, which defines how dev boxes join your domain and access resources. There are two choices: Microsoft Entra join and Microsoft Entra hybrid join.

- **Microsoft Entra join**. If your organization uses Microsoft Entra ID, you can use a Microsoft Entra join (sometimes called a _native_ Microsoft Entra join). Dev box users sign in to Microsoft Entra joined dev boxes by using their Microsoft Entra account. They access resources based on the permissions assigned to that account. Microsoft Entra join enables access to cloud-based and on-premises apps and resources. For more information, see [Plan your Microsoft Entra join deployment](../active-directory/devices/device-join-plan.md).

- **Microsoft Entra hybrid join**. If your organization has an on-premises Active Directory implementation, you can still benefit from some of the functionality in Microsoft Entra ID by using Microsoft Entra hybrid joined dev boxes. These dev boxes are joined to your on-premises Active Directory instance and registered with Microsoft Entra ID. Microsoft Entra hybrid joined dev boxes require network line of sight to your on-premises domain controllers periodically. Without this connection, devices become unusable. For more information, see [Plan your Microsoft Entra hybrid join deployment](../active-directory/devices/hybrid-join-plan.md).

### Create a network connection
<a name='azure-ad-join'></a>

# [**Microsoft Entra join**](#tab/AzureADJoin/)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **network connections**. In the list of results, select **Network Connections**.

1. On the **Network Connections** page, select **Create**.

   :::image type="content" source="./media/how-to-manage-network-connection/network-connections-empty.png" alt-text="Screenshot that shows the Create button on the page for network connections." lightbox="./media/how-to-manage-network-connection/network-connections-empty.png":::

1. On the **Create a network connection** pane, on the **Basics** tab, enter the following values:

   | Setting | Value |
   |---|---|
   | **Domain join type** | Select **Microsoft Entra join**. |
   | **Subscription** | Select the subscription in which you want to create the network connection. |
   | **Resource group** | Select an existing resource group, or select **Create new** and then enter a name for the new resource group. |
   | **Name** | Enter a descriptive name for the network connection. |
   | **Virtual network** | Select the virtual network that you want the network connection to use. |
   | **Subnet** | Select the subnet that you want the network connection to use. |

   :::image type="content" source="./media/how-to-manage-network-connection/create-native-network-connection-full-blank.png" alt-text="Screenshot that shows the Basics tab on the pane for creating a network connection, with the option for Microsoft Entra join selected." lightbox="./media/how-to-manage-network-connection/create-native-network-connection-full-blank.png":::

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. When the deployment completes, select **Go to resource**. Confirm the connection appears on the **Network Connections** page.

<a name='hybrid-azure-ad-join'></a>

# [**Microsoft Entra hybrid join**](#tab/HybridAzureADJoin/)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **network connections**. In the list of results, select **Network Connections**.

1. On the **Network Connections** page, select **Create**.

   :::image type="content" source="./media/how-to-manage-network-connection/network-connections-empty.png" alt-text="Screenshot that shows the Create button on the page that lists network connections." lightbox="./media/how-to-manage-network-connection/network-connections-empty.png":::

1. On the **Create a network connection** pane, on the **Basics** tab, enter the following values:

   | Setting | Value |
   |---|---|
   | **Domain join type** | Select **Microsoft Entra hybrid join**. |
   | **Subscription** | Select the subscription in which you want to create the network connection. |
   | **ResourceGroup** | Select an existing resource group, or select **Create new** and then enter a name for the new resource group. |
   | **Name** | Enter a descriptive name for the network connection. |
   | **Virtual network** | Select the virtual network that you want the network connection to use. |
   | **Subnet** | Select the subnet that you want the network connection to use. |
   | **AD DNS domain name**| Enter the DNS name of the Active Directory domain that you want to use for connecting and provisioning Cloud PCs. For example: `corp.contoso.com`. |
   | **Organizational unit** | Enter the organizational unit (OU). An OU is a container within an Active Directory domain that can hold users, groups, and computers. |
   | **AD username UPN** | Enter the username, in user principal name (UPN) format, that you want to use for connecting Cloud PCs to your Active Directory domain. For example: `svcDomainJoin@corp.contoso.com`. This service account must have permission to join computers to the domain and the target OU (if one is set). |
   | **AD domain password** | Enter the password for the user. |

   :::image type="content" source="./media/how-to-manage-network-connection/create-hybrid-network-connection-full-blank.png" alt-text="Screenshot that shows the Basics tab on the pane for creating a network connection, with the option for Microsoft Entra hybrid join selected." lightbox="./media/how-to-manage-network-connection/create-hybrid-network-connection-full-blank.png":::

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. When the deployment completes, select **Go to resource**. Confirm the connection appears on the **Network connections** page.

---

> [!NOTE]
> Microsoft Dev Box automatically creates a resource group for each network connection, which holds the network interface cards (NICs) that use the virtual network assigned to the network connection. The resource group has a fixed name based on the name and region of the network connection. You can't change the name of the resource group, or specify an existing resource group.

[!INCLUDE [attach or remove a network connection](./includes/attach-remove-network-connections.md)]

## Related content

- [Manage a dev box definition](how-to-manage-dev-box-definitions.md)
- [Manage a dev box pool](how-to-manage-dev-box-pools.md)
- [Manage a dev box project](how-to-manage-dev-box-projects.md)
