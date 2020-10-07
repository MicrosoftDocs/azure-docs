---
title: Specify marketplace images for a lab in Azure Lab Services
description: This article shows you how to specify the Marketplace images that lab creator can use to create labs in a lab account in Azure Lab Services. 
ms.topic: article
ms.date: 06/26/2020
---

# Specify Marketplace images available to lab creators
As a lab account owner, you can specify the Marketplace images that lab creators can use to create labs in the lab account. 

## Select images available for labs
Select **Marketplace images** on the menu to the left. By default, you see the full list of images (both enabled and disabled). You can filter the list to see only enabled/disabled images by selecting the **Enabled only**/**Disabled only** option from the drop-down list at the top. 
    
![Marketplace images page](./media/tutorial-setup-lab-account/marketplace-images-page.png)

The Marketplace images that are displayed in the list are only the ones that satisfy the following conditions:
    
- Creates a single VM.
- Uses Azure Resource Manager to provision VMs
- Doesn't require purchasing an extra licensing plan

## Disable images for a lab 
To disable a single image for a lab, select **... (ellipsis)** in the last column, and select **Disable image**. 

![Disable one image](./media/tutorial-setup-lab-account/disable-one-image.png) 

Alternatively, you select the checkbox before the image name, and select **Disable selected images** on the toolbar. 

To disable multiple images at the same time, select checkboxes before the image names, and select **Disable selected images** on the toolbar. 

![Disable multiple images](./media/tutorial-setup-lab-account/disable-multiple-images.png) 


## Enable images for a lab
To enable a disabled image, select **... (ellipsis)** in the last column, and select **Enable image**. Alternatively, you select the checkbox before the image name, and select **Enable selected images** on the toolbar. 

To disable multiple images at the same time, select checkboxes before the image names, and select **Enable selected images** on the toolbar. 

## Enable images at the time of lab creation
You can enable more images at the time lab creation: 

1. Sign in to the [Azure Lab Services website](https://labs.azure.com) using **lab account owner** credentials
2. Select the default virtual machine image or the down arrow. 
3. Select **Enable more image options**. 

    ![Enable more image options](./media/specify-marketplace-images/enable-more-images-menu.png)
4. Follow instructions from the previous section to enable the images you select. 
5. You may need to close the **New lab** window and reopen it to see the images you selected in the previous step. 



## Next steps
See the following articles:

- [As a lab owner, create and manage labs](how-to-manage-classroom-labs.md)
- [As a lab owner, set up and publish templates](how-to-create-manage-template.md)
- [As a lab owner, configure and control usage of a lab](how-to-configure-student-usage.md)
- [As a lab user, access classroom labs](how-to-use-classroom-lab.md)
