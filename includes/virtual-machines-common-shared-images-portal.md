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

1. Sign in to the Azure portal at https://portal.azure.com.
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

Image definitions create a logical grouping for images. They are used to manage information about the image versions that are created within them. Image definition names can be made up of uppercase or lowercase letters, digits, dots, dashes and periods. For more information about the values you can specify for an image definition, see [Image definitions](https://docs.microsoft.com/azure/virtual-machines/windows/shared-image-galleries#image-definitions).

Create the gallery image definition inside of your gallery. In this example, the gallery image is named *myImageDefinition*.

1. On the page for your new image gallery, select **Add a new image definition** from the top of the page. 
1. In the **Add new image definition to shared image gallery**, for **Region**, select *East US*.
1. For **Image definition name**, type *myImageDefinition*.
1. For **Operating system**, select the correct option based on your source VM.  
1. For **VM generation**, select the option based on your source VM. In most cases, this will be *Gen 1*. For more information, see [Support for generation 2 VMs](https://docs.microsoft.com/azure/virtual-machines/windows/generation-2).
1. For **Operating system state**, select the option based on your source VM. For more information, see [Generalized and specialized](../articles/virtual-machines/linux/shared-image-galleries.md#generalized-and-specialized-images).
1. For **Publisher**, type *myPublisher*. 
1. For **Offer**, type *myOffer*.
1. For **SKU**, type *mySKU*.
1. When finished, select **Review + create**.
1. After the image definition passes validation, select **Create**.
1. When the deployment is finished, select **Go to resource**.


## Create an image version

Create an image version from a managed image. In this example, the image version is *1.0.0* and it's replicated to both *West Central US* and *South Central US* datacenters. When choosing target regions for replication, remember that you also have to include the *source* region as a target for replication.

Allowed characters for image version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

The steps for creating an image version are slightly different, depending on whether the source is a generalized image or a snapshot of a specialized VM. 

### Option: Generalized

1. In the page for your image definition, select **Add version** from the top of the page.
1. In **Region**, select the region where your managed image is stored. Image versions need to be created in the same region as the managed image they are created from.
1. For **Name**, type *1.0.0*. The image version name should follow *major*.*minor*.*patch* format using integers. 
1. In **Source image**, select your source managed image from the drop-down.
1. In **Exclude from latest**, leave the default value of *No*.
1. For **End of life date**, select a date from the calendar that is a couple of months in the future.
1. In **Replication**, leave the **Default replica count** as 1. You need to replicate to the source region, so leave the first replica as the default and then pick a second replica region to be *East US*.
1. When you are done, select **Review + create**. Azure will validate the configuration.
1. When image version passes validation, select **Create**.
1. When the deployment is finished, select **Go to resource**.

It can take a while to replicate the image to all of the target regions.

### Option: Specialized

1. In the page for your image definition, select **Add version** from the top of the page.
1. In **Region**, select the region where your snapshot is stored. Image versions need to be created in the same region as the source they are created from.
1. For **Name**, type *1.0.0*. The image version name should follow *major*.*minor*.*patch* format using integers. 
1. In **OS disk snapshot**, select the snapshot from your source VM from the drop-down. If your source VM had a data disk that you would like to include, select the correct **LUN** number from the drop-down, and then select the snapshot of the data disk for **Data disk snapshot**. 
1. In **Exclude from latest**, leave the default value of *No*.
1. For **End of life date**, select a date from the calendar that is a couple of months in the future.
1. In **Replication**, leave the **Default replica count** as 1. You need to replicate to the source region, so leave the first replica as the default and then pick a second replica region to be *East US*.
1. When you are done, select **Review + create**. Azure will validate the configuration.
1. When image version passes validation, select **Create**.
1. When the deployment is finished, select **Go to resource**.

## Share the gallery

We recommend that you share access at the image gallery level. The following walks you through sharing the gallery that you just created.

1. Open the [Azure portal](https://portal.azure.com).
1. In the menu at the left, select **Resource groups**. 
1. In the list of resource groups, select **myGalleryRG**. The blade for your resource group will open.
1. In the menu on the left of the **myGalleryRG** page, select **Access control (IAM)**. 
1. Under **Add a role assignment**, select **Add**. The **Add a role assignment** pane will open. 
1. Under **Role**, select **Reader**.
1. Under **assign access to**, leave the default of **Azure AD user, group, or service principal**.
1. Under **Select**, type in the email address of the person that you would like to invite.
1. If the user is outside of your organization, you will see the message **This user will be sent an email that enables them to collaborate with Microsoft.** Select the user with the email address and then click **Save**.

If the user is outside of your organization, they will get an email invitation to join the organization. The user needs to accept the invitation, then they will be able to see the gallery and all of the image definitions and versions in their list of resources.

