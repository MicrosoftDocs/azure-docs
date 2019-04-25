---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 04/25/2019
 ms.author: cynthn
 ms.custom: include file
---

## Sign in to Azure 

Sign in to the Azure portal at https://portal.azure.com.

## Create an image gallery

An image gallery is the primary resource used for enabling image sharing. Allowed characters for Gallery name are uppercase or lowercase letters, digits, dots, and periods. The gallery name cannot contain dashes.  Gallery names must be unique within your subscription. 

The following example creates a gallery named *myGallery* in the *myGalleryRG* resource group.

1. Select **Create a resource** in the upper left-hand corner of the Azure portal.
1. Use the type **Shared image gallery** in the search box and select **Shared image gallery** in the results.
1. In the **Shared image gallery** page, click **Create**.
1. Select the correct subscription.
1. In **Resource group**, select **Create new** and type *myGalleryRG* for the name.
1. In **Name**, type *myGallery* for the name of the gallery.
1. Leave the default for **Region**.
1. You can type a short description of the gallery, like *My image gallery for testing.* and then click **Review + create**.
1. When the deployment is finished, select **Go to resource**.
   
## Create an image definition 

Image definitions create a logical grouping for images. They are used to manage information about the image versions that are created within them. Image definition names can be made up of uppercase or lowercase letters, digits, dots, dashes and periods. For more information about the values you can specify for an image definition, see [Image definitions](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/shared-image-galleries#image-definitions).

Create the gallery image definition inside of your gallery. In this example, the gallery image is named *myImageDefinition*.

1. On the page for your new image gallery, select **Add a new image definition** from the top of the page. 
1. For **Image definition name**, type *myImageDefinition*.
1. For **Operating system**, select the correct option based on your source image.
1. For **Publisher**, type *myPublisher*. 
1. For **Offer**, type *myOffer*.
1. For **SKU**, type *mySKU*.
1. Make sure **Yes** us selected for **Enable** and then select **Review + create**.
1. When image definition passes validation, select **Create** at the bottom of the page.
1. When the deployment is finished, select **Go to resource**.



## Create an image version

Create an image version from a managed image. In this example, the image version is *1.0.0* and it's replicated to both *West Central US* and *South Central US* datacenters. When choosing target regions for replication, remember that you also have to include the *source* region as a target for replication.

Allowed characters for image version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

1. In the page for your image definition, select **Add version** from the top of the page.
1. In **Region**, leave the default value.
1. For **Name**, type *1.0.0*. The image version name should follow *major*.*minor*.*patch* format using integers. 
1. In **Source image**, select your source managed image from the drop-down.
1. In **Exclude from latest**, leave the default value of *No*.
1. For **End of life date**, select a date from the calendar that is a couple of months in the future.
1. In **Replication**, leave the **Default replica count** as 1. You need to replicate to the source region, so leave the first replica as the default and then pick a second replica region to be *East US*.
1. When you are done, select **Review + create**. Azure will validate the configuration.
1. When image version passes validation, select **Create** at the bottom of the page.
1. When the deployment is finished, select **Go to resource**.

It can take a while to replicate the image to all of the target regions.
