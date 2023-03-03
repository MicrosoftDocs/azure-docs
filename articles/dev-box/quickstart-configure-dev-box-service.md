---
title: "Quickstart: Configure Microsoft Dev Box Preview"
titleSuffix: Microsoft Dev Box Preview
description: "This quickstart shows you how to configure the Microsoft Dev Box Preview service to provide dev boxes for users."
services: dev-box
ms.service: dev-box
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 01/24/2023
ms.custom: references_regions
#Customer intent: As an enterprise admin, I want to understand how to create and configure dev box components so that I can provide dev box projects my users.
---

# Quickstart: Configure Microsoft Dev Box Preview

This quickstart describes how to configure the Microsoft Dev Box service by using the Azure portal to enable development teams to self-serve dev boxes.

This quickstart will take you through the process of setting up your Dev Box environment. You'll create a dev center to organize your dev box resources, configure network components to enable dev boxes to connect to your organizational resources, and create a dev box definition that will form the basis of your dev boxes. You'll then create a project and a dev box pool, which work together to help you give access to users who will manage or use the dev boxes.

After you complete this quickstart, you'll have a Dev Box configuration ready for users to create and connect to dev boxes.

## Prerequisites

To complete this quickstart, make sure that you have:

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Owner or contributor permissions on an Azure subscription or a specific resource group.
- Network Contributor permissions on an existing virtual network (owner or contributor), or permission to create a new virtual network and subnet.
- User licenses. To use Dev Box Preview, each user must be licensed for Windows 11 Enterprise or Windows 10 Enterprise, Microsoft Intune, and Azure Active Directory P1. These licenses are available independently and also included in the following subscriptions:

  - Microsoft 365 F3
  - Microsoft 365 E3, Microsoft 365 E5
  - Microsoft 365 A3, Microsoft 365 A5
  - Microsoft 365 Business Premium
  - Microsoft 365 Education Student Use Benefit
- [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) allows you to use your Windows licenses on Azure with Dev Box.

## Create a dev center

Use the following steps create a dev center so that you can manage your dev box resources:  

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type **dev centers** and then select **Dev centers** in the search results.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/discover-dev-centers.png" alt-text="Screenshot that shows the Azure portal with the search box and the result for dev centers.":::

1. On the **Dev centers** page, select **+Create**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-dev-center.png" alt-text="Screenshot that shows the Azure portal with the Create button on the page for dev centers.":::

1. On the **Create a dev center** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the dev center.|
   |**ResourceGroup**|Select an existing resource group, or select **Create new** and then enter a name for the new resource group.|
   |**Name**|Enter a name for your dev center.|
   |**Location**|Select the location or region where you want the dev center to be created.|

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-dev-center-basics.png" alt-text="Screenshot that shows the Basics tab on the page for creating a dev center.":::

   The currently supported Azure locations with capacity are listed here: [Microsoft Dev Box Preview](https://aka.ms/devbox_acom).

1. (Optional) On the **Tags** tab, enter a name/value pair that you want to assign.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-dev-center-tags.png" alt-text="Screenshot that shows the Tags tab on the page for creating a dev center.":::

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. Check on the progress of the dev center creation from any page in the Azure portal by opening the **Notifications** pane.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/notifications-pane.png" alt-text="Screenshot that shows the Notifications pane in the Azure portal.":::

1. When the deployment is complete, select **Go to resource**. Confirm that the dev center page appears.

## Create a network connection

Network connections determine the region in which dev boxes are deployed and allow dev boxes to be connected to your existing virtual networks. The following steps show you how to create and configure a network connection in Microsoft Dev Box Preview.  

To create a network connection, you must have:

- An existing virtual network and subnet. If you don't have a virtual network and subnet available, follow the instructions here: [Create a virtual network and subnet](#create-a-virtual-network-and-subnet) to create them.
- A configured and working Hybrid AD join or Azure AD join.

  - **Azure AD join:** To learn how to join devices directly to Azure Active Directory (Azure AD), see [Plan your Azure Active Directory join deployment](../active-directory/devices/azureadjoin-plan.md).
  - **Hybrid AD join:** To learn how to join your AD DS domain-joined computers to Azure AD from an on-premises Active Directory Domain Services (AD DS) environment, see [Plan your hybrid Azure Active Directory join deployment](../active-directory/devices/hybrid-azuread-join-plan.md).
- If your organization routes egress traffic through a firewall, you need to open certain ports to allow the Dev Box service to function. For more information, see [Network requirements](/windows-365/enterprise/requirements-network).

### Create a virtual network and subnet

You must have a virtual network and subnet available for your network connection; create them using these steps:

1. In the search box, type *Virtual Network* and then select **Virtual Network** in the search results.

1. On the **Virtual Network** page, select **Create**.

1. In **Create virtual network**, enter or select this information in the **Basics** tab:

    :::image type="content" source="./media/quickstart-configure-dev-box-service/vnet-basics-tab.png" alt-text="Screenshot of creating a virtual network in Azure portal.":::

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select an existing resource group or select **Create new**, and enter a name for the resource group. |
    | **Instance details** |   |
    | Name | Enter a name for your virtual network. |
    | Region | Enter the location/region you want the virtual network to be created in. |

1. On  the **IP Addresses** tab, note the default IP address assignment and subnet. You can accept the defaults unless they conflict with your existing configuration.

1. Select the **Review + create** tab. Review the virtual network and subnet configuration.

1. Select **Create**.

### Create the connection

Now that you have an available virtual network and subnet, you need a network connection to associate the virtual network and subnet with the dev center. Follow these steps to create a network connection:

1. In the search box, type **network connections** and then select **Network connections** in the search results.

1. On the **Network Connections** page, select **+Create**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-network-connection.png" alt-text="Screenshot that shows the Network Connections page with Create highlighted.":::

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

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-nc-native-join.png" alt-text="Screenshot that shows the create network connection basics tab with Azure Active Directory join highlighted.":::

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
   |**AD username UPN**| The username, in user principal name (UPN) format, that you want to use for connecting the Cloud PCs to your Active Directory domain. For example, `svcDomainJoin@corp.contoso.com`. This service account must have permission to join computers to the domain and, if set, the target OU. |
   |**AD domain password**| The password for the user. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-nc-hybrid-join.png" alt-text="Screenshot that shows the create network connection basics tab with Hybrid Azure Active Directory join highlighted.":::

   ---

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. When the deployment is complete, select **Go to resource**. The **Network Connection overview** page appears, which confirms that you created the connection.

## Attach network connection to dev center

To provide networking configuration information for dev boxes, you need to associate a network connection with a dev center. Use the following steps to attach the network connection to your dev center:

1. In the search box, type *Dev centers* and then select **Dev centers** in the search results.

1. Select the dev center you created and select **Networking**.

1. Select  **+ Add**.

1. In the **Add network connection** pane, select the network connection you created earlier, and then select **Add**.

After creation, several health checks are run on the network. You can view the status of the checks on the resource overview page. Network connections that pass all the health checks can be added to a dev center and used in the creation of dev box pools. The dev boxes within the dev box pools will be created and domain joined in the location of the virtual network assigned to the network connection.

:::image type="content" source="./media/quickstart-configure-dev-box-service/network-connection-grid-populated.png" alt-text="Screenshot that shows the status of a network connection.":::

To resolve any errors, refer to the [Troubleshoot Azure network connections](/windows-365/enterprise/troubleshoot-azure-network-connection).

## Create a dev box definition

The following steps show you how to create and configure a dev box definition. Dev box definitions define the image and SKU (compute + storage) that will be used in creation of the dev boxes.

1. Open the dev center in which you want to create the dev box definition.

1. Select **Dev box definitions**.

1. On the **Dev box definitions** page, select **+Create**.

1. On the **Create dev box definition** page, enter the following values:

   Enter the following values:

   |Name|Value|Note|
   |----|----|----|
   |**Name**|Enter a descriptive name for your dev box definition.|
   |**Image**|Select the base operating system for the dev box. You can select an image from the Azure Marketplace or from an Azure Compute Gallery. </br> If you're creating a dev box definition for testing purposes, consider using the **Visual Studio 2022 Enterprise on Windows 11 Enterprise + Microsoft 365 Apps 22H2** image. |To use custom images while creating a dev box definition, you can attach an Azure Compute Gallery that has the custom images. Learn [How to configure an Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md).|
   |**Image version**|Select a specific, numbered version to ensure all the dev boxes in the pool always use the same version of the image. Select  **Latest** to ensure new dev boxes use the latest image available.|Selecting the Latest image version enables the dev box pool to use the most recent image version for your chosen image from the gallery. This way, the dev boxes created will stay up to date with the latest tools and code on your image. Existing dev boxes won't be modified when an image version is updated.|
   |**Compute**|Select the compute combination for your dev box definition.||
   |**Storage**|Select the amount of storage for your dev box definition.||

   :::image type="content" source="./media/quickstart-configure-dev-box-service/recommended-test-image.png" alt-text="Screenshot that shows the page for creating a dev box definition.":::

1. Select **Create**.

## Create a project

Dev box projects enable you to manage team level settings, including providing access to development teams so developers can create dev boxes.

The following steps show you how to create and configure a project in a dev box.

1. In the search box, type **projects** and then select **Projects** in the search results.

1. On the **Projects** page,  select **+Create**.

1. On the **Create a project** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the project.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**Dev center**|Select the dev center to which you want to associate this project. All the dev center level settings will be applied to the project.|
   |**Name**|Enter a name for your project. |
   |**Description**|Enter a brief description of the project. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-project-create.png" alt-text="Screenshot of the Basics tab on the page for create a dev box project.":::

1. [Optional] On the **Tags** tab, enter a name and value pair that you want to assign.

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. Confirm that the project is created successfully by checking the notifications. Select **Go to resource**.

1. Verify that you see the **Project** page.

## Create a dev box pool

A dev box pool is a collection of dev boxes that have similar settings. Dev box pools specify the dev box definitions and network connections dev boxes will use. You must have at least one pool associated with your project before users can create a dev box.

The following steps show you how to create a dev box pool associated with a project.

1. In the search box, type **projects** and then select **Projects** in the search results.

1. Open the project in which you want to create the dev box pool.
  
   :::image type="content" source="./media/quickstart-configure-dev-box-service/select-project.png" alt-text="Screenshot of the list of existing projects.":::

1. Select **Dev box pools**, and then select **+ Create**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-pool.png" alt-text="Screenshot of an empty list of dev box pools within a project.":::

1. On the **Create a dev box pool** page, enter the following values:

   |Name|Value|
   |----|----|
   |**Name**|Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes, and must be unique within a project.|
   |**Dev box definition**|Select an existing dev box definition. The definition determines the base image and size for the dev boxes created within this pool.|
   |**Network connection**|Select an existing network connection. The network connection determines the region of the dev boxes created within this pool.|
   |**Dev Box Creator Privileges**|Select Local Administrator or Standard User.|
   |**Enable Auto-stop**|Yes is the default. Select No to disable an Auto-stop schedule. You can configure an Auto-stop schedule after the pool has been created.|
   |**Stop time**| Select a time to shutdown all the dev boxes in the pool. All dev boxes in this pool will be shut down at this time, every day.|
   |**Time zone**| Select the time zone that the stop time is in.|
   |**Licensing**| Select this check box to confirm that your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-pool-details.png" alt-text="Screenshot of the dialog for creating a dev box pool.":::

1. Select **Create**.

1. Verify that the new dev box pool appears in the list. You might need to refresh the screen.

The dev box pool will be deployed and health checks will be run to ensure the image and network pass the validation criteria to be used for dev boxes. The following screenshot shows four dev box pools, each with a different status.

:::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-pool-grid-populated.png" alt-text="Screenshot that shows a list of existing pools.":::

## Provide access to a dev box project

Before users can create dev boxes based on the dev box pools in a project, you must provide access for them through a role assignment. The Dev Box User role enables dev box users to create, manage and delete their own dev boxes. You must have sufficient permissions to a project before you can add users to it.

1. In the search box, type **projects** and then select **Projects** in the search results.

1. Select the project you want to provide your team members access to.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/select-project.png" alt-text="Screenshot of the list of existing projects.":::

1. Select **Access Control (IAM)** from the left menu.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/project-permissions.png" alt-text="Screenshot that shows the Project Access control page with the Access Control link highlighted.":::

1. Select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

   |Setting  |Value  |
   |---------|---------|
   |Role     |    DevCenter Dev Box User    |
   |Assign access to     |    User     |
   |Members     |    Your account     |

   The user will now be able to view the project and all the pools within it. They can create dev boxes from any of the pools and manage those dev boxes from the [developer portal](https://aka.ms/devbox-portal).

[!INCLUDE [supported accounts note](./includes/note-supported-accounts.md)]

## Project admins

The Microsoft Dev Box Preview service makes it possible for you to delegate administration of projects to a member of the project team. Project administrators can assist with the day-to-day management of projects for their team, like creating and managing dev box pools. To provide users permissions to manage projects, add them to the DevCenter Project Admin role.

You can assign the DevCenter Project Admin role by using the [Provide access to a dev box project](#provide-access-to-a-dev-box-project) steps, but selecting the Project Admin role instead of the Dev Box User role. For more information, go to [Provide access to projects for project admins](how-to-project-admin.md).

[!INCLUDE [permissions note](./includes/note-permission-to-create-dev-box.md)]

## Next steps

In this quickstart, you created a dev box project and the resources necessary to support it. You created a dev center, added a network connection, created a dev box definition, and a project. You then created a dev box pool within an existing project and assigned a user permission to create dev boxes based on the new pool.

To learn about how to create and connect to a dev box, advance to the next quickstart:

> [!div class="nextstepaction"]
> [Create a dev box](./quickstart-create-dev-box.md)