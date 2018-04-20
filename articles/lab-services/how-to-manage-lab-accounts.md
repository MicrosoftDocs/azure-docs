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
ms.date: 04/20/2018
ms.author: spelluru

---
# Manage lab accounts in Azure Lab Services (formerly Azure DevTest Labs)
This article describes how to create a lab account, view all lab account, or delete a lab account. 

## Create a lab account
1. Sign in to the [Azure portal](https://portal.azure.com).
2. From the main menu on the left side, select **Create a resource** (at the top of the list), point to **Developer tools**, and click **Lab Services (preview)**.

	![Create a lab account window](./media/how-to-manage-lab-accounts/new-lab-account-page.png)
1. In the **Create a lab account** window, select **Create**.
2. In the **Lab account** window, do the following actions: 
    1. For **Lab account name**, enter a name. 
    2. Select the **Azure subscription** in which you want to create the lab account.
    3. For **Resource group**, select **Create new**, and enter a name for the resource group.
    4. For **Location**, select a location/region in which you want the lab account to be created. 
    5. Select **Create**. 

        ![Create a lab account window](./media/how-to-manage-lab-accounts/lab-account-settings.png)
5. If you don't see the page for the lab account, select the notifications button, and then click **Go to resource** button in the notifications. 

    ![Create a lab account window](./media/how-to-manage-lab-accounts/notification-go-to-resource.png)    
6. You see the following **lab account** page:

    ![Lab account page](./media/how-to-manage-lab-accounts/lab-account-page.png)

## Add lab creators to the lab account

1. Select **Access control (IAM)** from the menu.
2. Add users to the **lab creator** role so that they can create classroom labs in this lab account. 


## View lab accounts
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All resources** from the menu. 
3. Select **DevTest Labs** for the **type**. 

    ![List of lab accounts](./media/how-to-manage-lab-accounts/list-of-lab-accounts.png)
    You can also filter by subscription, resource group, locations, and tags. 

## Delete a lab account
Follow instructions from the previous section that displays lab accounts in a list. Use the following instructions to delete a lab account: 

1. Select the **lab account** that you want to delete. 
2. Select **Delete** from the toolbar. 
3. Type **Yes** for confirmation.
4. Select **Delete**. 
    ![Delete lab account](./media/how-to-manage-lab-accounts/delete-lab-account.png)

## Next steps
Get started with setting up a lab using Azure Lab Services:

- [Set up a classroom lab](tutorial-setup-classroom-lab.md)
- [Set up a custom lab](tutorial-create-custom-lab.md)
