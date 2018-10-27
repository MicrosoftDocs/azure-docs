---
title: Set up a lab account with Azure Lab Services | Microsoft Docs
description: In this tutorial, you set up a lab account with Azure Lab Services.
services: devtest-lab, lab-services, virtual-machines
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.custom: mvc
ms.date: 07/17/2018
ms.author: spelluru

---
# Tutorial: Set up a lab account with Azure Lab Services
In Azure Lab Services, a lab account serves as the central account in which your organization's labs are managed. In your lab account, give permission to others to create labs, and set policies that apply to all labs under the lab account. In this tutorial, learn how to create a lab account as a lab administrator. 

In this tutorial, you do the following actions:

> [!div class="checklist"]
> * Create a lab account
> * Add a user to the Lab Creator role
> * Specify Marketplace images available for lab owners

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Create a lab account
The following steps illustrate how to use the Azure portal to create a lab account with Azure Lab Services. 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. From the main menu on the left side, select **Create a resource**.
3. Search for **Lab Services** in the Azure Marketplace, and select **Lab Services** in the drop-down list. 
4. Select **Lab Services (Preview)** in the filtered list of services. 
1. In the **Create a lab account** window, select **Create**.
2. In the **Lab account** window, do the following actions: 
    1. For **Lab account name**, enter a name. 
    2. Select the **Azure subscription** in which you want to create the lab account.
    3. For **Resource group**, select **Create new**, and enter a name for the resource group.
    4. For **Location**, select a location/region in which you want the lab account to be created. 
    5. Select **Create**. 

        ![Create a lab account window](../media/tutorial-setup-lab-account/lab-account-settings.png)
5. If you don't see the page for the lab account, select the **notifications** button, and then click **Go to resource** button in the notifications. 

    ![Create a lab account window](../media/tutorial-setup-lab-account/notification-go-to-resource.png)    
6. You see the following **lab account** page:

    ![Lab account page](../media/tutorial-setup-lab-account/lab-account-page.png)

## Add a user to the Lab Creator role
To set up a classroom lab in a lab account, the user must be a member of the **Lab Creator** role in the lab account. The account you used to create the lab account is automatically added to this role. If you are planning to use the same user account to create a classroom lab, you can skip this step. To use another user account to create a classroom lab, do the following steps: 

To provide educators the permission to create labs for their classes, add them to the **Lab Creator** role:

1. On the **Lab Account** page, select **Access control (IAM)**, and click **+ Add** on the toolbar. 

    ![Lab account page](../media/tutorial-setup-lab-account/access-control.png)
2. On the **Add permissions** page, select **Lab Creator** for **Role**, select the user you want to add to the Lab Creators role, and select **Save**. 

    ![Add user to the Lab Creator role](../media/tutorial-setup-lab-account/add-user-to-lab-creator-role.png)

## Specify Marketplace images available to lab owners
As a lab account owner, you can specify the Marketplace images that lab creators can use to create labs in the lab account. 

1. Select **Marketplace images** on the menu to the left. By default, you see the full list of images (both enabled and disabled). You can filter the list to see only enabled/disabled images by selecting the **Enabled only**/**Disabled only** option from the drop-down list at the top. 
    
    ![Marketplace images page](../media/tutorial-setup-lab-account/marketplace-images-page.png)

    The Marketplace images that are displayed in the list are only the ones that satisfy the following conditions:
        
    - Creates a single VM.
    - Uses Azure Resource Manager to provision VMs
    - Doesn't require purchasing an extra licensing plan
2. To **disable** a Marketplace image that has been enabled, do one of the following actions: 
    1. Select **... (ellipsis)** in the last column, and select **Disable image**. 

        ![Disable one image](../media/tutorial-setup-lab-account/disable-one-image.png) 
    2. Select one or more images from the list by selecting the checkboxes before the image names in the list, and select **Disable selected images**. 

        ![Disable multiple images](../media/tutorial-setup-lab-account/disable-multiple-images.png) 
1. Similarly, to **enable** a Marketplace image, do one of the following actions: 
    1. Select **... (ellipsis)** in the last column, and select **Enable image**. 
    2. Select one or more images from the list by selecting the checkboxes before the image names in the list, and select **Enable selected images**. 

## Next steps
In this tutorial, you created a lab account. To learn about how to create a classroom lab as a profession, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Set up a classroom lab](tutorial-setup-classroom-lab.md)

