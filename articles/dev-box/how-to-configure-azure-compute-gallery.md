---
title: Configure an Azure Compute Gallery
titleSuffix: Microsoft Dev Box
description: 'Learn how to create a repository for managing and sharing Dev Box images.'
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 07/08/2022
ms.topic: how-to
---

# Configure an Azure Compute Gallery

 An Azure Compute Gallery is a repository in Azure for managing and sharing images. It's stored in your Azure subscription and helps you build structure and organization around your image resources. You can create virtual machine images with different configurations and store them in an Azure Compute Gallery to provide easy access for maintenance and updates. You can make the custom images in your gallery available to dev box users through projects for them to create their own dev boxes. 

Advantages of using a gallery include:
- You maintain the images in a single location and use them across DevCenters, projects, and pools.
- Development teams can use the *Latest* image version of an image definition to ensure they always receive the most recent bits when creating dev boxes.
- Development teams can use a specific image version to standardize on a supported image version until a newer version is validated.
- Microsoft Dev Box replicates images for dev boxes to the Azure regions configured in network connections. Replication takes place when the dev box definition is created. 

You can learn more about Azure Compute Galleries and how to create them here:
- [Store and share images in an Azure Compute Gallery](../virtual-machines/shared-image-galleries.md) 
- [Create a gallery for storing and sharing resources](../virtual-machines/create-gallery.md#create-a-gallery-for-storing-and-sharing-resources) 

## Pre-requisites
- A [DevCenter](/quickstart-create-dev-box-pool.md/#create-a-devcenter) 
- An Azure Compute Gallery with at least [one image definition and one image version](../virtual-machines/image-version.md). 
    - The image definition must have [Trusted Launch enabled as the Security Type](../virtual-machines/trusted-launch.md). You configure the security type when creating the image definition. 
    - The image version must meet the [Windows 365 image requirements](/windows-365/enterprise/device-images#image-requirements).
        - Generation 2
        - Hyper-V v2
        - Windows OS
        - Generalized image

    :::image type="content" source="media/how-to-configure-azure-compute-gallery/image-definition.png" alt-text="Screenshot showing the Windows 365 image requirement settings.":::

> [!IMPORTANT]
> If you have existing images that do not meet the Windows 365 image requirements, those images will not be listed for image creation.

## Provide permissions for services to access the gallery
When using an Azure Compute Gallery image to create a dev box definition, the Windows 365 service validates the image to ensure that it  meets the requirements to be provisioned for a dev box. In addition, the Dev Box service replicates the image to the regions specified in the attached network connections so the images are present in the region required for dev box creation.

To allow the services to perform these actions, you must provide permissions to your gallery as follows:

### Windows 365 Service Principal
1. From the [Azure portal](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Compute%2Fgalleries), open the gallery you want to attach to the DevCenter.
1. Select the **Access Control (IAM)** menu item.
1. Select **+ Add** > **Add role assignment**.
1. On the Role tab, select **Reader**, and then select **Next**.
1. On the Members tab, select **+ Select Members**.
1. In Select members, search for and select **Cloud PC**, and then select **Select**. 
1. On the Members tab, select **Next**.
1. On the Review + assign tab, select **Review + assign**.

### DevCenter Managed Identity
1. Use these steps to [Create a user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity).  
1. From the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters), open your DevCenter.
1. Select **Identity** from the left menu.
1. On the **User assigned** tab, select **+ Add**.
1. In Add user assigned managed identity, select the user-assigned managed identity that you created in step 1 and then select **Add**.

   :::image type="content" source="media/how-to-configure-azure-compute-gallery/assign-managed-id.png" alt-text="Screenshot showing the Add user assigned managed identity pane, with the managed ID highlighted."::: 
1. Open the gallery you want to attach to the DevCenter from the [Azure portal](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Compute%2Fgalleries). You can use the search bar to search for Azure Compute Galleries to find your gallery easily.
1. Select **Access Control (IAM)** from the left menu.
1. Select **+ Add** > **Add role assignment**.
1. On the Role tab, select the **Owner** role, and then select **Next**.
1. On the Members tab, under **Assign access to**, select **Managed Identity**, and then select **+ Select Members**.
1. In Select managed identities, search for and select the user assigned managed identity you created in step 1 and then select **Select**.
1. On the Members tab, select **Next**.
1. On the Review + assign tab, select **Review + assign**.

You can use the same managed identity in multiple DevCenters and Azure Compute Galleries. Any DevCenter with the managed identity added will have the necessary permissions to the images in the Azure Compute Gallery you've added the owner role assignment to.

## Attach a gallery to a DevCenter
In order to use the images from a gallery in dev box definitions, you must first associate it with the DevCenter.

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters).

2. Open the DevCenter you want to attach the gallery to.
 
:::image type="content" source="media/how-to-configure-azure-compute-gallery/devcenter-grid.png" alt-text="Screenshot showing the list of existing DevCenters.":::

3. From the left menu, select **Azure compute galleries** to list the galleries attached to this DevCenter.
 
:::image type="content" source="media/how-to-configure-azure-compute-gallery/gallery-grid-empty.png" alt-text="Screenshot showing the Azure compute galleries page. There are no existing Azure compute galleries.":::

4. Select **+ Add** to select a gallery to attach.

5. In Add Azure compute gallery, select your gallery. If you have access to more than one gallery with the same name, the subscription name is shown in parentheses.
 
:::image type="content" source="media/how-to-configure-azure-compute-gallery/gallery-add.png" alt-text="Screenshot showing the Select a Gallery to add option.":::

6. If there is a name conflict in the DevCenter, then you must provide a unique name to use for this gallery.

7. Select **Add**.
  
:::image type="content" source="media/how-to-configure-azure-compute-gallery/gallery-grid.png" alt-text="Screenshot showing the Azure compute galleries page with example galleries listed.":::

After successful addition, the images in the gallery will be available to select from when creating and updating dev box definitions.

## Remove a gallery from a DevCenter
You can detach galleries from DevCenters so that their images can no longer be used to create dev box definitions in the DevCenter. Galleries that are being actively used in dev box definitions cannot be removed from the DevCenter. The associated dev box definition must be deleted or updated to use an image from a different gallery before you can remove the gallery.

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters).

2. Select the DevCenter you want to remove the gallery from.

3. From the left menu, select **Azure compute galleries** to list the galleries attached to this DevCenter.

4. Select the gallery you want to remove, and then select **Remove**.

   :::image type="content" source="media/how-to-configure-azure-compute-gallery/remove-gallery-from-devcenter.png" alt-text="Screenshot showing the Azure compute galleries page with a gallery selected and the Remove button highlighted.":::

6. Select **Continue** from the confirmation dialog.

The gallery will be detached from the DevCenter. The gallery and its images won't be deleted, and you can reattach it if necessary. 

## Next steps
- [Create a dev box pool](./quickstart-configure-dev-box-service.md)
