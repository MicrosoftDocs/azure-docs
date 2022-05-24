---
title: Configure an Azure Compute Gallery
titleSuffix: Microsoft Dev Box
description: 'Learn how to create a repository for managing and sharing Dev Box images.'
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/15/2022
ms.topic: how-to
---

# Configure an Azure Compute Gallery

 The Azure Compute Gallery [Store and share images in an Azure Compute Gallery](../virtual-machines/shared-image-galleries.md) is a repository in Azure for managing and sharing images. It is stored in your Azure subscription and helps you build structure and organization around your image resources. Different configurations of VM images can be maintained and updated in a Gallery. Project Fidalgo Dev Box can use your custom images in a Gallery to create dev boxes. There are several advantages of using a Gallery:
- You can maintain the images in a single location and use them across DevCenters, Projects, and Pools.
- Using the *Latest* image version of an image definition allows you to always provide the most recent bits to development teams for use in creating dev boxes.
- Using a specific image version allows you to standardize development teams on a supported image version until a newer version is validated.
- Project Fidalgo will perform replication of the images you want to use for Dev Boxes to the Azure Regions that you've specified in your Network Connections. Replication takes place at the time of Dev Box Definition creation. 

Learn how to [Create a gallery for storing and sharing resources](../virtual-machines/create-gallery?tabs=portal) and then come back here to attach and use the gallery in Project Fidalgo Dev Box.

## Pre-requisites
- A [DevCenter](/quickstart-create-dev-box-pool.md/#create-a-devcenter) created under Project Fidalgo.
- An Azure Compute Gallery with at least [one image definition and one image version](../virtual-machines/image-version?tabs=portal). 
    - The image definition needs to have [Trusted Launch enabled as the Security Type](../virtual-machines/trusted-launch). This can be done when creating the image definition in the Azure Compute Gallery through the Azure Portal. 

    - The image version needs to fulfill the [Windows 365 image requirements](/windows-365/enterprise/device-images#image-requirements).
        - Generation 2
        - Hyper-v v2
        - Windows OS
        - Generalized image

    ![Image Definition](/Documentation/media/Image_Definition.png)


## Provide permissions for Fidalgo to access the Gallery
When using an Azure Compute Gallery image to create a Dev Box Definition, Windows 365 service will perform image validation to ensure the image to be used meets the requirements to be provisioned for a dev box. In addition, Fidalgo Dev Box service will perform image replication to the regions in the attached Network Connections so the images are present in the region required for dev box creation.

For this purpose, you will need to provide permissions to your Gallery as follows:

### Windows 365 Service Principal
1. Open the Gallery resource you wish to attach to the DevCenter from the [Azure portal](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Compute%2Fgalleries).
1. Select the **Access Control (IAM)** menu item.
1. Select **+ Add role assignment**.
1. Under Roles, select the **Reader** role.
1. Under Members, **+ Select Members** and search for the Service Principal named **Windows 365**.
1. Review + Assign.

### DevCenter Managed Identity
1. Create a user assigned managed identity using [these instructions](../azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity). You can use this managed identity in multiple DevCenters and Azure Compute Galleries.
1. Open your DevCenter from the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters).
1. Select the **Identity** menu item.
1. Select the **User assigned** tab.
1. Select **+ Add**.
1. Select the User assigned managed identity that you created in step 1 and add it. 
1. Open the Gallery resource you wish to attach to the DevCenter from the [Azure portal](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Compute%2Fgalleries).
1. Select the **Access Control (IAM)** menu item.
1. Select **+ Add role assignment**.
1. Under Roles, select the **Owner** role.
1. Under Members, toggle the **Assign access to** radio button to **Managed Identity** and **+ Select Members** 
1. Search for and select the user assigned managed identity you created in step 1.
1. Review + Assign.

Now any DevCenter with this managed identity added will have the correct permissions to the images in the Azure Compute Gallery you have added the owner role assignment to.

## Attach a Gallery to a DevCenter
In order to use the images from a Gallery in Dev Box Definitions, you must first associate it with the DevCenter.

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters).

2. Select your DevCenter to open the resource view.
:::image type="content" source="media/how-to-configure-azure-compute-gallery/devcenter-grid.png" alt-text="List of DevCenters":::

3. From the left menu, select **Azure compute galleries** to list the galleries attached to this DevCenter.
:::image type="content" source="media/how-to-configure-azure-compute-gallery/gallery-grid-empty.png" alt-text="Gallery Grid Empty":::

4. Select **+ Add** to select a Gallery to attach.

5. From the context pane that opens, select your Gallery from the dropdown list. If you have access to more than one Gallery with the same name, the Subscription name is shown in parentheses.
:::image type="content" source="media/how-to-configure-azure-compute-gallery/gallery-add.png" alt-text="Select a Gallery to add.":::

6. If there is a name conflict in the DevCenter, then you will need to provide a unique name to use for this Gallery.

7. Select **Add**. 
:::image type="content" source="media/how-to-configure-azure-compute-gallery/gallery-grid.png" alt-text="Populated Gallery Grid.":::

After successful addition, the images in the Gallery will be available to select from when creating and updating Dev Box Definitions.

## Remove a Gallery from a DevCenter
You can detach Galleries from DevCenters so that their images cannot be used any longer to create Dev Box Definitions in the DevCenter. 

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters).

2. Select your DevCenter to open the resource view.

3. From the left menu, select **Azure compute galleries** to list the galleries attached to this DevCenter.

4. Select the check box for the Gallery you wish to remove.

5. Select the **Remove** button at the top of the grid.

6. Select **Continue** from the confirmation dialog.
[Gallery Remove](/Documentation/media/Gallery_Remove.png)

The Gallery will be detached from the DevCenter. The Gallery and any of its images will not be deleted, and can be added back if you wish. Please note, Galleries that are being actively used in Dev Box Definitions cannot be removed from the DevCenter. The associated Dev Box Definition needs to be deleted or updated to use an image from a different Gallery first.

## Next Steps
- [Create a Dev Box Pool](./quickstart-create-dev-box-pool.md)
