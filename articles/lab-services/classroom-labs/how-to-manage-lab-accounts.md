---
title: Manage lab accounts in Azure Lab Services | Microsoft Docs
description: Learn how to create a lab account, view all lab accounts, or delete a lab account in an Azure subscription.  
services: lab-services
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/07/2018
ms.author: spelluru

---
# Manage lab accounts in Azure Lab Services 
In Azure Lab Services, a lab account is a container for managed lab types such as classroom labs. An administrator sets up a lab account with Azure Lab Services and provides access to lab owners who can create labs in the account. This article describes how to create a lab account, view all lab accounts, or delete a lab account.

## Create a lab account
The following steps illustrate how to use the Azure portal to create a lab account with Azure Lab Services. 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All Services** on the left menu. Select **Lab Accounts** in the **DEVOPS** section. If you select star (`*`) next to **Lab Accounts**, it's added to the **FAVORITES** section on the left menu. From the next time onwards, you select **Lab Accounts** under **FAVORITES**.

    ![All Services -> Lab Accounts](../media/tutorial-setup-lab-account/select-lab-accounts-service.png)
3. On the **Lab Accounts** page, select **Add** on the toolbar. 

    ![Select Add on the Lab Accounts page](../media/tutorial-setup-lab-account/add-lab-account-button.png)
4. On the **Lab Account** page, do the following actions: 
    1. For **Lab account name**, enter a name. 
    2. Select the **Azure subscription** in which you want to create the lab account.
    3. For **Resource group**, select **Create new**, and enter a name for the resource group.
    4. For **Location**, select a location/region in which you want the lab account to be created. 
    5. For **Peer virtual network**, select a peer virtual network (VNet) for the lab network. Labs created in this account are connected to the selected VNet and have access to the resources in the selected VNet. 
    7. For the **Allow lab creator to pick lab location** field, specify whether you want lab creators to be able to select a location for the lab. By default, the option is disabled. When it's disabled, lab creators can't specify a location for the lab they are creating. The labs are created in the closest geographical location to lab account. When it's enabled, a lab creator can select a location at the time of creating a lab.      
    8. Select **Create**. 

        ![Create a lab account window](../media/tutorial-setup-lab-account/lab-account-settings.png)
5. Select the **bell icon** on the toolbar (**Notifications**), confirm that the deployment succeeded, and then select **Go to resource**. 

    Alternatively, select **Refresh** on the **Lab Accounts** page, and select the lab account you created. 

    ![Create a lab account window](../media/tutorial-setup-lab-account/go-to-lab-account.png)    
6. You see the following **lab account** page:

    ![Lab account page](../media/tutorial-setup-lab-account/lab-account-page.png)

## Add a user to the Lab Creator role
To set up a classroom lab in a lab account, the user must be a member of the **Lab Creator** role in the lab account. The account you used to create the lab account is automatically added to this role. If you are planning to use the same user account to create a classroom lab, you can skip this step. To use another user account to create a classroom lab, do the following steps: 

To provide educators the permission to create labs for their classes, add them to the **Lab Creator** role:

1. On the **Lab Account** page, select **Access control (IAM)**, and click **+ Add role assignment** on the toolbar. 

    ![Access Control -> Add Role Assignment button](../media/tutorial-setup-lab-account/add-role-assignment-button.png)
1. On the **Add role assignment** page, select **Lab Creator** for **Role**, select the user you want to add to the Lab Creators role, and select **Save**. 

    ![Add lab creator](../media/tutorial-setup-lab-account/add-lab-creator.png)


## Specify Marketplace images available to lab creators
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

## Configure the lab account
1. On the **Lab Account** page, select **Labs configuration** on the left menu.

    ![Labs Configuration page](../media/how-to-manage-lab-accounts/labs-configuration-page.png) 
1. For **Peer virtual network**, select **Enabled** or **Disabled**. The default value is **Disabled**. To enable the peer virtual network, do the following steps: 
    1. Select **Enabled**.
    2. Select the **VNet** from the drop-down list. 
    3. Select **Save** on the toolbar. 
    
        Labs created in this account are connected to the selected virtual network. They can access to the resources in the selected virtual network. 
3. For the **Allow lab creator to pick lab location**, select **Enabled** if you want the lab creator to be able to select a location for the lab. If it's disabled, the labs are automatically created in the same location in which the lab account exists. 

## View lab accounts
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All resources** from the menu. 
3. Select **Lab Accounts** for the **type**. 
    You can also filter by subscription, resource group, locations, and tags. 

    ![All resources -> Lab Accounts](../media/how-to-manage-lab-accounts/all-resources-lab-accounts.png)

## View and manage labs in the lab account

1. On the **Lab Account** page, select **Labs** on the left menu.

    ![Labs in the account](../media/how-to-manage-lab-accounts/labs-in-account.png)
1. You see a **list of labs** in the account with the following information: 
    1. Name of the lab.
    2. The date on which the lab was created. 
    3. Email address of the user who created the lab. 
    4. Maximum number of users allowed into the lab. 
    5. Status of the lab. 



## Delete a lab in the lab account
Follow instructions in the previous section to see a list of the labs in the lab account.

1. Select **... (ellipsis)**, and select **Delete**. 

    ![Delete a lab - button](../media/how-to-manage-lab-accounts/delete-lab-button.png)
2. Select **Yes** on the warning message. 

    ![Confirm lab deletion](../media/how-to-manage-lab-accounts/confirm-lab-delete.png)

## Delete a lab account
Follow instructions from the previous section that displays lab accounts in a list. Use the following instructions to delete a lab account: 

1. Select the **lab account** that you want to delete. 
2. Select **Delete** from the toolbar. 

    ![Lab Accounts -> Delete button](../media/how-to-manage-lab-accounts/delete-button.png)
1. Type **Yes** for confirmation.
1. Select **Delete**. 

    ![Delete lab account - confirmation](../media/how-to-manage-lab-accounts/delete-lab-account-confirmation.png)



## Next steps
See the following articles:

- [As a lab owner, create and manage labs](how-to-manage-classroom-labs.md)
- [As a lab owner, set up and publish templates](how-to-create-manage-template.md)
- [As a lab owner, configure and control usage of a lab](how-to-configure-student-usage.md)
- [As a lab user, access classroom labs](how-to-use-classroom-lab.md)