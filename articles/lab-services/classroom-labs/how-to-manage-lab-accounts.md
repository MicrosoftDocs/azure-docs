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
ms.date: 05/07/2019
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
    5. Select an existing **shared image gallery** or create one. You can save the template VM in the shared image gallery for it to be reused by others. For detailed information on shared image galleries, see [Use a shared image gallery in Azure Lab Services](how-to-use-shared-image-gallery.md).
    6. For **Peer virtual network**, select a peer virtual network (VNet) for the lab network. Labs created in this account are connected to the selected VNet and have access to the resources in the selected VNet. 
    7. Specify an **address range** for VMs in the lab. The address range should be in the classless inter-domain routing (CIDR) notation (example: 10.20.0.0/23). Virtual machines in the lab will be created in this address range. For more information, see [Specify an address range for VMs in the lab](how-to-configure-lab-accounts.md#specify-an-address-range-for-vms-in-the-lab).    
    8. For the **Allow lab creator to pick lab location** field, specify whether you want lab creators to be able to select a location for the lab. By default, the option is disabled. When it's disabled, lab creators can't specify a location for the lab they are creating. The labs are created in the closest geographical location to lab account. When it's enabled, a lab creator can select a location at the time of creating a lab.      
    9. Select **Create**. 

        ![Create a lab account window](../media/tutorial-setup-lab-account/lab-account-settings.png)
5. Select the **bell icon** on the toolbar (**Notifications**), confirm that the deployment succeeded, and then select **Go to resource**. 

    Alternatively, select **Refresh** on the **Lab Accounts** page, and select the lab account you created. 

    ![Create a lab account window](../media/tutorial-setup-lab-account/go-to-lab-account.png)    
6. You see the following **lab account** page:

    ![Lab account page](../media/tutorial-setup-lab-account/lab-account-page.png)

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
See the following article: [How to configure lab accounts](how-to-configure-lab-accounts.md).