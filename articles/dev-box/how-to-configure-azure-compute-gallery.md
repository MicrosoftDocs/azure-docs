---
title: Configure Azure Compute Gallery
titleSuffix: Microsoft Dev Box
description: Learn how to create an Azure Compute Gallery repository for managing and sharing Dev Box images.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/25/2023
ms.topic: how-to
---

# Configure Azure Compute Gallery for Microsoft Dev Box

Azure Compute Gallery is a service for managing and sharing images. A gallery is a repository that's stored in your Azure subscription and helps you build structure and organization around your image resources. You can use a gallery to provide custom images for your dev box users.

Advantages of using a gallery include:

- You maintain the images in a single location and use them across dev centers, projects, and pools.
- Development teams can use the latest version of an image definition to ensure that they always receive the most recent image when creating dev boxes.
- Development teams can standardize on a supported image version until a newer version is validated.

To learn more about Azure Compute Gallery and how to create galleries, see:

- [Store and share images in Azure Compute Gallery](../virtual-machines/shared-image-galleries.md)
- [Create a gallery for storing and sharing resources](../virtual-machines/create-gallery.md#create-a-gallery-for-storing-and-sharing-resources)

## Prerequisites

- A dev center. If you don't have one available, follow the steps in [Create a dev center](quickstart-configure-dev-box-service.md#1-create-a-dev-center).
- A compute gallery. Images stored in a compute gallery can be used in a dev box definition, provided they meet the requirements listed in the [Compute gallery image requirements](#compute-gallery-image-requirements) section.
 
> [!NOTE]
> Microsoft Dev Box doesn't support community galleries.

## Compute gallery image requirements 

A gallery used to configure dev box definitions must have at least [one image definition and one image version](../virtual-machines/image-version.md).

When creating a virtual machine image, select an image from the marketplace that is Dev Box compatible, like the following examples:
- [Visual Studio 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftvisualstudio.visualstudio2019plustools?tab=Overview)
- [Visual Studio 2022](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftvisualstudio.visualstudioplustools?tab=Overview) 

The image version must meet the following requirements:
- Generation 2.
- Hyper-V v2.
- Windows OS.
    - Windows 10 Enterprise version 20H2 or later.
    - Windows 11 Enterprise 21H2 or later.
- Generalized VM image.
    - You must create the image using these three sysprep options: `/generalize /oobe /mode:vm`. </br>
      For more information, see: [Sysprep Command-Line Options](/windows-hardware/manufacture/desktop/sysprep-command-line-options?view=windows-11#modevm&preserve-view=true).
    - To speed up the Dev Box creation time:
      - Disable the reserved storage state feature in the image by using the following command: `DISM.exe /Online /Set-ReservedStorageState /State:Disabled`. </br>
        For more information, see: [DISM Storage reserve command-line options](/windows-hardware/manufacture/desktop/dism-storage-reserve?view=windows-11#set-reservedstoragestate&preserve-view=true).
      -	Run `defrag` and `chkdsk` during image creation, wait for them to finish. And disable `chkdisk` and `defrag` scheduled task.
- Single-session virtual machine (VM) images. (Multiple-session VM images aren't supported.)
- No recovery partition.
    - For information about how to remove a recovery partition, see the [Windows Server command: delete partition](/windows-server/administration/windows-commands/delete-partition).
- Default 64-GB OS disk size. The OS disk size is automatically adjusted to the size specified in the SKU description of the Windows 365 license.
- The image definition must have [trusted launch enabled as the security type](../virtual-machines/trusted-launch.md). You configure the security type when you create the image definition.

    :::image type="content" source="media/how-to-configure-azure-compute-gallery/image-definition.png" alt-text="Screenshot that shows Windows 365 image requirement settings.":::

> [!NOTE]
> - Dev Box image requirements exceed [Windows 365 image requirements](/windows-365/enterprise/device-images) and include settings to optimize dev box creation time and performance. 
> - Images that do not meet Windows 365 requirements will not be listed for creation.

## Provide permissions for services to access a gallery

When you use an Azure Compute Gallery image to create a dev box definition, the Windows 365 service validates the image to ensure that it meets the requirements to be provisioned for a dev box. The Dev Box service replicates the image to the regions specified in the attached network connections, so the images are present in the region that's required for dev box creation.

To allow the services to perform these actions, you must provide permissions to your gallery as follows.

### Add a user-assigned identity to the dev center

1. [Follow the steps to create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity). 
1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **dev box**. In the list of results, select **Dev centers**.
1. Open your dev center. On the left menu, select **Identity**.
1. On the **User assigned** tab, select **+ Add**.
1. In **Add user assigned managed identity**, select the user-assigned managed identity that you created in step 1, and then select **Add**.

   :::image type="content" source="media/how-to-configure-azure-compute-gallery/assign-managed-id.png" alt-text="Screenshot that shows the pane for adding a user-assigned managed identity.":::

### Assign roles

The Dev Box service behaves differently depending how you attach your gallery:

- When you use the Azure portal to attach the gallery to your dev center, the Dev Box service creates the necessary role assignments automatically after you attach the gallery.
- When you use the Azure CLI to attach the gallery to your dev center, you must manually create the Windows 365 service principal and the dev center's managed identity role assignments before you attach the gallery.

Use the following steps to manually assign each role.

#### Windows 365 service principal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **Azure Compute Gallery**. In the list of results, select the gallery that you want to attach to the dev center.

1. On the left menu, select **Access Control (IAM)**.

1. Select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

   | Setting | Value |
   | --- | --- |
   | **Role** | Select **Reader**. |
   | **Assign access to** | Select **User, group, or service principal**. |
   | **Members** | Search for and select **Windows 365**. |

#### Managed identity for the dev center

1. In the [Azure portal](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Compute%2Fgalleries), open the gallery that you want to attach to the dev center. You can also search for **Azure Compute Gallery** to find your gallery.

1. On the left menu, select **Access Control (IAM)**.

1. Select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

   | Setting | Value |
   | --- | --- |
   | **Role** | Select **Contributor**. |
   | **Assign access to** | Select **Managed Identity**. |
   | **Members** | Search for and select the user-assigned managed identity that you created when you [added a user-assigned identity to the dev center](#add-a-user-assigned-identity-to-the-dev-center). |

You can use the same managed identity in multiple dev centers and compute galleries. Any dev center with the managed identity added has the necessary permissions to the images in the gallery that you've added the Owner role assignment to.

## Attach a gallery to a dev center

To use the images from a gallery in dev box definitions, you must first associate the gallery with the dev center by attaching it:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box, enter **dev box**. In the list of results, select **Dev centers**.

3. Select the dev center that you want to attach the gallery to.

   :::image type="content" source="media/how-to-configure-azure-compute-gallery/devcenter-grid.png" alt-text="Screenshot that shows a list of existing dev centers.":::

4. On the left menu, select **Azure compute galleries** to list the galleries that are attached to this dev center.

   :::image type="content" source="media/how-to-configure-azure-compute-gallery/gallery-grid-empty.png" alt-text="Screenshot that shows the page for compute galleries, with no galleries listed.":::

5. Select **+ Add** to select a gallery to attach.

6. In **Add Azure compute gallery**, select your gallery. If you have access to more than one gallery that has the same name, the subscription name appears in parentheses.

   :::image type="content" source="media/how-to-configure-azure-compute-gallery/gallery-add.png" alt-text="Screenshot that shows the area for selecting a gallery.":::

7. If there's a name conflict in the dev center, you must provide a unique name to use for this gallery.

8. Select **Add**.
  
9. Confirm that your gallery now appears on the **Azure compute galleries** page.

   :::image type="content" source="media/how-to-configure-azure-compute-gallery/gallery-grid.png" alt-text="Screenshot that shows the page for compute galleries page with example galleries listed.":::

After you successfully add a gallery, the images in it will be available to select from when you're creating and updating dev box definitions.

## Remove a gallery from a dev center

You can detach galleries from dev centers so that their images can no longer be used to create dev box definitions.

> [!NOTE]
> You can't remove galleries that are being actively used in dev box definitions. Before you can remove such a gallery, you must delete the associated dev box definition or update the definition to use an image from a different gallery.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box, enter **dev box**. In the list of results, select **Dev centers**.

3. Select the dev center that you want to remove the gallery from.

4. On the left menu, select **Azure compute galleries** to list the galleries that are attached to this dev center.

5. Select the gallery that you want to remove, and then select **Remove**.

   :::image type="content" source="media/how-to-configure-azure-compute-gallery/remove-gallery-from-devcenter.png" alt-text="Screenshot that shows the page for compute galleries, a selected gallery, and the Remove button.":::

6. In the confirmation dialog, select **Continue**.

The gallery is detached from the dev center. The gallery and its images aren't deleted, and you can reattach it if necessary.

## Next steps

- Learn more about [key concepts in Microsoft Dev Box](./concept-dev-box-concepts.md).
