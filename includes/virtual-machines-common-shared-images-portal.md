---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 11/06/2019
 ms.author: cynthn
 ms.custom: include file
---


## Create an image gallery

An image gallery is the primary resource used for enabling image sharing. Allowed characters for Gallery name are uppercase or lowercase letters, digits, dots, and periods. The gallery name cannot contain dashes.  Gallery names must be unique within your subscription. 

The following example creates a gallery named *myGallery* in the *myGalleryRG* resource group.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Use the type **Shared image gallery** in the search box and select **Shared image gallery** in the results.
1. In the **Shared image gallery** page, click **Add**.
1. On the **Create shared image gallery** page, select the correct subscription.
1. In **Resource group**, select **Create new** and type *myGalleryRG* for the name.
1. In **Name**, type *myGallery* for the name of the gallery.
1. Leave the default for **Region**.
1. You can type a short description of the gallery, like *My image gallery for testing.* and then click **Review + create**.
1. After validation passes, select **Create**.
1. When the deployment is finished, select **Go to resource**.


## Create an image definition 

Image definitions create a logical grouping for images. They are used to manage information about the image versions that are created within them. 

Image definition names can be made up of uppercase or lowercase letters, digits, dots, dashes and periods. For more information about the values you can specify for an image definition, see [Image definitions](../articles/virtual-machines/shared-image-galleries.md#image-definitions).

Create the gallery image definition inside of your gallery. 

1. On the page for your new image gallery, select **Add a new image definition** from the top of the page. 
1. In the **Add new image definition to shared image gallery**, for **Region**, select *East US*.
1. For **Image definition name**, type a name like *myImageDefinition*.
1. For **Operating system**, select the correct option based on your source VM.  
1. For **VM generation**, select the option based on your source VM. In most cases, this will be *Gen 1*. For more information, see [Support for generation 2 VMs](../articles/virtual-machines/generation-2.md).
1. For **Operating system state**, select the option based on your source VM. For more information, see [Generalized and specialized](../articles/virtual-machines/shared-image-galleries.md#generalized-and-specialized-images).
1. For **Publisher**, type *myPublisher*. 
1. For **Offer**, type *myOffer*.
1. For **SKU**, type *mySKU*.
1. When finished, select **Review + create**.
1. After the image definition passes validation, select **Create**.
1. When the deployment is finished, select **Go to resource**.


## Create an image version

 When choosing target regions for replication, remember that you also have to include the *source* region as a target for replication.

The steps for creating an image version are slightly different, depending on whether the source is a generalized image or a snapshot of a specialized VM. 


1. In the page for your image definition, select **Add version** from the top of the page.
1. In **Region**, select the region where you want the image created.
1. For **Version number**, type a number like *1.0.0*. The image version name should follow *major*.*minor*.*patch* format using integers. 
1. In **Source image**, select your source managed image from the drop-down. See the table below for specific details for each source type.

    | Source | Other fields |
    |---|---|
    | Disks or snapshots | - For **OS disk** select the disk or snapshot from the drop-down. <br> - To add a data disk, type the LUN number and then select the data disk from the drop-down. |
    | Image version | - Select the **Source gallery** from the drop-down. <br> - Select the correct image definition from the drop-down. <br>- Select the existing image version that you want to use from the drop-down. |
    | Managed image | Select the **Source image** from the drop-down. <br>The managed image must be in the same region that you chose in **Instance details**.
    | VHD in a storage account | Select **Browse** to choose the storage account for the VHD. |

1. In **Exclude from latest**, leave the default value of *No*.
1. For **End of life date**, select a date from the calendar that is a couple of months in the future.
1. In the **Replication** tab, select the storage type from the drop-down.
1. Set the **Default replica count**, you can override this for each region you add. 
1. You need to replicate to the source region, so the first replica in the list will be in the region where you created the image. You can add more replicas by select the region from the drop-down and adjusting the replica count as necessary.
1. When you are done, select **Review + create**. Azure will validate the configuration.
1. When image version passes validation, select **Create**.
1. When the deployment is finished, select **Go to resource**.

It can take a while to replicate the image to all of the target regions.

You can also capture an existing VM as an image, from the portal. For more information, see [Create an image of a VM in the portal](../articles/virtual-machines/capture-image-portal.md).

## Share the gallery

We recommend that you share access at the image gallery level. The following walks you through sharing the gallery that you just created.

1. On the page for your new image gallery, in the menu on the left, select **Access control (IAM)**. 
1. Under **Add a role assignment**, select **Add**. The **Add a role assignment** pane will open. 
1. Under **Role**, select **Reader**.
1. Under **assign access to**, leave the default of **Microsoft Entra user, group, or service principal**.
1. Under **Select**, type in the email address of the person that you would like to invite.
1. If the user is outside of your organization, you will see the message **This user will be sent an email that enables them to collaborate with Microsoft.** Select the user with the email address and then click **Save**.

If the user is outside of your organization, they will get an email invitation to join the organization. The user needs to accept the invitation, then they will be able to see the gallery and all of the image definitions and versions in their list of resources.
