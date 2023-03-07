---
title: Configure the Microsoft Dev Box Preview service
titleSuffix: Microsoft Dev Box Preview
description: This quickstart shows you how to configure the Microsoft Dev Box Preview service to provide dev boxes for your users. You'll create a dev center, add a network connection, and then create a dev box definition and a project.
services: dev-box
ms.service: dev-box
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 01/24/2023
ms.custom: references_regions
Customer intent: As an enterprise admin, I want to understand how to create and configure dev box components so that I can provide dev box projects for my users.
---

# Quickstart: Configure the Microsoft Dev Box Preview service

This quickstart describes how to configure your instance of the Microsoft Dev Box Preview service so that development teams can create their own dev boxes in your deployment.

In the quickstart, you go through the process of setting up your Microsoft Dev Box environment by using the Azure portal. You create a dev center to organize your Dev Box resources, you configure network components so that dev boxes can connect to your organization's resources, and you create a dev box definition that is the basis of your dev boxes. Then, you create a project and a dev box pool to form a framework you can use to give access to users to manage or use dev boxes.

When you finish this quickstart, you'll have a dev box configuration in which users you give access to can create dev boxes and connect to dev boxes in the dev box pool.

## Prerequisites

To complete this quickstart, make sure that you have:

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Owner or Contributor role on an Azure subscription or for the resource group you'll use to hold your dev box resources.
- Network Contributor permissions on an existing virtual network (owner or contributor) or permissions to create a new virtual network and subnet.
- User licenses. To use Dev Box, each user must be licensed for Windows 11 Enterprise or Windows 10 Enterprise, Microsoft Intune, and Azure Active Directory P1. These licenses are available independently and also are included in the following subscriptions:
  - Microsoft 365 F3
  - Microsoft 365 E3, Microsoft 365 E5
  - Microsoft 365 A3, Microsoft 365 A5
  - Microsoft 365 Business Premium
  - Microsoft 365 Education Student Use Benefit
- [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/), which allows you to use your Windows licenses on Azure with Dev Box.

## Create a dev center

To begin the configuration, create a dev center you can use to manage your Dev Box resources. The following steps show you how to create and configure a dev center.  

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev centers**. In the search results, select **Dev centers**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/discover-dev-centers.png" alt-text="Screenshot that shows the Azure portal with the search box and the Dev centers result highlighted.":::

1. On the **Dev centers** page, select **Create**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-dev-center.png" alt-text="Screenshot that shows the Azure portal Dev centers with Create highlighted.":::

1. On the **Create a dev center** pane, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which to create the dev center.|
   |**Resource group**|Select an existing resource group, or select **Create new** and enter a name for the resource group.|
   |**Name**|Enter a name for your dev center.|
   |**Location**|Select the location or region to create the dev center in.|

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-dev-center-basics.png" alt-text="Screenshot that shows the Create a dev center Basics tab.":::

   Currently supported Azure locations with capacity are listed in [Frequently asked questions about Microsoft Dev Box](https://aka.ms/devbox_acom).

1. \[Optional\] On the **Tags** tab, enter a name and value pair that you want to assign.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-dev-center-tags.png" alt-text="Screenshot that shows the Create a dev center Tags tab.":::

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

   To check the progress of the dev center deployment, select your notifications on any page in the Azure portal.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/notifications-pane.png" alt-text="Screenshot that shows the Azure portal notifications pane.":::

1. When the deployment is complete, select **Go to resource** to go to the dev center overview.

## Create a network connection

A network connection determines the region where a dev box is deployed, and it allows a dev box to be connected to your existing virtual networks. The following steps show you how to create and configure a network connection in Microsoft Dev Box.  

To create a network connection, you must have:

- An existing virtual network and subnet. If you don't have a virtual network and subnet available, complete the instructions in [Create a virtual network and subnet](#create-a-virtual-network-and-subnet) to create them.
- A configured and working Hybrid Azure Active Directory (Azure AD) join or Azure AD join deployment.
  - **Azure AD join:** To learn how to join devices directly to Azure AD, see [Plan your Azure Active Directory join deployment](../active-directory/devices/azureadjoin-plan.md).
  - **Hybrid Azure AD join:** To learn how to join your Active Directory Domain Services (AD DS) domain-joined computers to Azure AD from an on-premises AD DS environment, see [Plan your hybrid Azure Active Directory join deployment](../active-directory/devices/hybrid-azuread-join-plan.md).
- If your organization routes egress traffic through a firewall, you must open certain ports to allow the Dev Box service to function. For more information, see [Network requirements](/windows-365/enterprise/requirements-network).

### Create a virtual network and subnet

You must have a virtual network and a subnet available for your network connection. You can create them by completing these steps:

1. In the portal search box, enter **virtual network**. In the search results, select **Virtual Network**.

1. On the **Virtual Network** page, select **Create**.

1. On the **Create virtual network** pane, enter or select this information on the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select an existing resource group, or select **Create new** and enter a name for the resource group. |
    | **Name** | Enter a name for your virtual network. |
    | **Region** | Enter the location or region you want the virtual network to be created in. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/vnet-basics-tab.png" alt-text="Screenshot that shows creating a virtual network in Azure portal.":::

1. On  the **IP Addresses** tab, note the default IP address assignment and subnet. You can accept the defaults unless they conflict with your existing configuration.

1. Select the **Review + create** tab. Review the virtual network and subnet configuration.

1. Select **Create**.

### Create a network connection

Now that you have a virtual network and subnet, you need a network connection to associate the virtual network and subnet with the dev center.

To create a network connection, complete the steps on the relevant tab:

#### [Azure AD join](#tab/AzureADJoin/)

1. In the portal search box, enter **network connections**. In the search results, select **Network connections**.

1. On the **Network Connections** page, select **Create**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-network-connection.png" alt-text="Screenshot that shows the Network Connections page with Create highlighted.":::

1. On the **Create a network connection** pane, on the **Basics** tab, select or enter the following values:

   Name|Value|
   |----|----|
   |**Domain join type**|Select **Azure active directory join**.|
   |**Subscription**|Select the subscription in which to create the network connection.|
   |**Resource group**|Select an existing resource group, or select **Create new** and enter a name for the resource group.|
   |**Name**|Enter a descriptive name for your network connection.|
   |**Virtual network**|Select the virtual network you want the network connection to use.|
   |**Subnet**|Select the subnet you want the network connection to use.|

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-nc-native-join.png" alt-text="Screenshot that shows the Create a network connection Basics tab with Azure Active Directory join highlighted.":::

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. When the deployment is complete, select **Go to resource**. The network connection appears on the **Network Connections** page.

#### [Hybrid Azure AD join](#tab/HybridAzureADJoin/)

1. In the portal search box, enter **network connections**. In the search results, select **Network connections**.

1. On the **Network Connections** page, select **Create**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-network-connection.png" alt-text="Screenshot that shows the Network Connections page with Create highlighted.":::

1. On the **Create a network connection** pane, on the **Basics** tab, select or enter the following values:

   |Name|Value|
   |----|----|
   |**Domain join type**|Select **Hybrid Azure active directory join**.|
   |**Subscription**|Select the subscription in which to create the network connection.|
   |**Resource group**|Select an existing resource group, or select **Create new** and enter a name for the resource group.|
   |**Name**|Enter a descriptive name for your network connection.|
   |**Virtual network**|Select the virtual network you want the network connection to use.|
   |**Subnet**|Select the subnet you want the network connection to use.|
   |**AD DNS domain name**| Enter the DNS name of the Active Directory domain to use for connecting and provisioning cloud PCs. For example, `corp.contoso.com`. |
   |**Organizational unit**| \[Optional\] Enter an OU. An organizational unit (OU) is a container within an Active Directory domain that can hold users, groups, and computers. |
   |**AD username UPN**| Enter the username, in user principal name (UPN) format, that you want to use to connect the cloud PCs to your Active Directory domain. For example, `svcDomainJoin@corp.contoso.com`. This service account must have permissions to join computers to the domain and the target OU, if set. |
   |**AD domain password**| Enter the password for the user. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-nc-hybrid-join.png" alt-text="Screenshot that shows the Create a network connection Basics tab with Hybrid Azure Active Directory join highlighted.":::

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. When the deployment is complete, select **Go to resource**. The network connection appears on the **Network Connections** page.

---

## Attach a network connection to a dev center

To provide networking configuration information for dev boxes, associate a network connection with a dev center.

1. In the portal search box, enter **dev centers**. In the search results, select **Dev centers**.

1. Select the dev center you created, and then select **Networking**.

1. Select  **Add**.

1. On the **Add network connection** pane, select the network connection you created earlier, and then select **Add**.

After the network connection is attached to the dev center, several health checks are run on the network connection. You can view the status of the checks on the resource overview page. You can add network connections that pass all health checks to a dev center and use them to create dev box pools. Dev boxes that are in dev box pools are created and domain joined in the location of the virtual network that's assigned to the network connection.

:::image type="content" source="./media/quickstart-configure-dev-box-service/network-connection-grid-populated.png" alt-text="Screenshot that shows the status of a network connection.":::

To resolve any errors, see [Troubleshoot Azure network connections](/windows-365/enterprise/troubleshoot-azure-network-connection).

## Create a dev box definition

The following steps show you how to create and configure a dev box definition. A dev box definition defines the image and SKU (compute + storage) that you use when you create a dev box.

1. Open the dev center in which you want to create the dev box definition.

1. Select **Dev box definitions**.

1. On the **Dev box definitions** page, select **Create**.

1. On the **Create dev box definition** pane, select or enter the following values:

   |Name|Value|Note|
   |----|----|----|
   |**Name**|Enter a descriptive name for your dev box definition.|
   |**Image**|Select the base operating system for the dev box. You can select an image from Azure Marketplace or from an instance of the Azure Compute Gallery service. </br> If you're creating a dev box definition for testing purposes, consider using the **Visual Studio 2022 Enterprise on Windows 11 Enterprise + Microsoft 365 Apps 22H2** image. |To use custom images when you create a dev box definition, you can attach an instance of Compute Gallery that has the custom images. Learn [how to configure Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md).|
   |**Image version**|Select a specific, numbered version to ensure that all the dev boxes in the pool always use the same version of the image. Select  **Latest** to ensure that new dev boxes use the latest image available.|When you select **Latest** for **Image version**, the dev box pool can use the most recent version of the image you choose in the gallery. This way, the dev boxes stay up to date with the latest tools and code for your image. Existing dev boxes aren't modified when an image version is updated.|
   |**Compute**|Select the compute combination for your dev box definition.||
   |**Storage**|Select the amount of storage for your dev box definition.||

   :::image type="content" source="./media/quickstart-configure-dev-box-service/recommended-test-image.png" alt-text="Screenshot that shows the Create dev box definition page.":::

1. Select **Create**.

## Create a project

You can use dev box projects to manage team-level settings, including providing access to development teams so that developers can create dev boxes.

The following steps show you how to create and configure a project in Microsoft Dev Box.

1. In the portal search box, enter **projects**. In the search results, select **Projects**.

1. On the **Projects** page,  select **Create**.

1. On the **Create a project** pane, on the **Basics** tab, select or enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which to create the project.|
   |**Resource group**|Select an existing resource group, or select **Create new** and enter a name for the resource group.|
   |**Dev center**|Select the dev center to associate with this project. All the dev center-level settings are applied to the project.|
   |**Name**|Enter a name for your project. |
   |**Description**|Enter a brief description of the project. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-project-create.png" alt-text="Screenshot that shows the Create a dev box project Basics tab.":::

1. \[Optional\] On the **Tags** tab, enter a name and value pair that you want to assign.

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. Confirm that the project is created successfully by checking the notifications. Select **Go to resource**.

1. Verify that you see the project on the **Projects** page.

## Create a dev box pool

A dev box pool is a collection of dev boxes that have similar settings. Dev box pools specify the dev box definitions and the network connections dev boxes will use. You must have at least one pool associated with your project before a user can create a dev box.

The following steps show you how to create a dev box pool that's associated with a project.

1. In the portal search box, enter **projects**. In the search results, select **Projects**.

1. Open the project in which you want to create the dev box pool.
  
   :::image type="content" source="./media/quickstart-configure-dev-box-service/select-project.png" alt-text="Screenshot that shows the list of existing projects.":::

1. On the left menu under **Manage**, select **Dev box pools**, and then select **Create**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-pool.png" alt-text="Screenshot that shows the list of dev box pools in a project. The list is empty.":::

1. On the **Create a dev box pool** pane, select or enter the following values:

   |Name|Value|
   |----|----|
   |**Name**|Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes. The pool name must be unique within a project.|
   |**Dev box definition**|Select an existing dev box definition. The definition determines the base image and size for the dev boxes that are created in this pool.|
   |**Network connection**|Select an existing network connection. The network connection determines the region of the dev boxes that are created in this pool.|
   |**Dev box Creator Privileges**|Select Local Administrator or Standard User.|
   |**Enable Auto-stop**|**Yes** is the default. Select **No** to disable an Auto-stop schedule. You can configure an Auto-stop schedule after the pool is created.|
   |**Stop time**| Select a time to shut down all the dev boxes in the pool. All dev boxes in this pool will be shut down at this time every day.|
   |**Time zone**| Select the time zone that the stop time is in.|
   |**Licensing**| Select this check box to confirm that your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-pool-details.png" alt-text="Screenshot that shows the Create a dev box pool pane.":::

1. Select **Create**.

1. Verify that the new dev box pool appears in the list. You might need to refresh the page to see the dev box pool.

   The dev box pool is deployed and health checks are run to ensure that the image and network pass the validation criteria to be used for dev boxes. The following screenshot shows four dev box pools, each with a different status.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-pool-grid-populated.png" alt-text="Screenshot that shows a list of existing pools with four different status messages.":::

## Provide access to a dev box project

Before a user can create a dev box that's based in the dev box pools in a project, you must give the user access through a role assignment. The Dev Box User role gives a dev box user the permissions to create, manage, and delete their own dev boxes. You must have sufficient permissions to a project before you can assign the role to a user.

1. In the portal search box, enter **projects**. In the search results, select **Projects**.

1. Select the project you want to give team members access to.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/select-project.png" alt-text="Screenshot that shows a list of existing projects.":::

1. On the left menu, select **Access control (IAM)**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/project-permissions.png" alt-text="Screenshot showing the Project Access control page with the Access Control link highlighted.":::

1. On the command bar, select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

    | Setting | Value |
    | --- | --- |
    | **Role** | Select **DevCenter Dev Box User**. |
    | **Assign access to** | Select **User, group, or service principal**. |
    | **Members** | Select the users or groups you want to have access to the project. |

    :::image type="content" source="media/how-to-dev-box-user/add-role-assignment-user.png" alt-text="Screenshot that shows the Add role assignment pane.":::

   The user will now be able to view the project and all the pools in it. They can create dev boxes from any of the pools and manage those dev boxes from the [developer portal](https://aka.ms/devbox-portal).

[!INCLUDE [supported accounts note](./includes/note-supported-accounts.md)]

## Assign project admin role

Through the Microsoft Dev Box service, you can delegate project administration to a member of the project team. Project admins can assist with the day-to-day management of projects for their team, including creating and managing dev box pools. To give a user permissions to manage projects, assign the DevCenter Project Admin role to the user.

You can assign the DevCenter Project Admin role by completing the steps in [Provide access to a dev box project](#provide-access-to-a-dev-box-project), but select the Project Admin role instead of the Dev Box User role. For more information, see [Provide access to projects for project admins](how-to-project-admin.md).

[!INCLUDE [permissions note](./includes/note-permission-to-create-dev-box.md)]

## Next steps

In this quickstart, you created a dev box project and the resources necessary to support it. You created a dev center, added a network connection, created a dev box definition, and created a project. Then, you created a dev box pool within an existing project and assigned user permissions to create dev boxes that are based in the new pool.

To learn how to create and connect to a dev box, go to the next quickstart:

> [!div class="nextstepaction"]
> [Create a dev box](./quickstart-create-dev-box.md)
