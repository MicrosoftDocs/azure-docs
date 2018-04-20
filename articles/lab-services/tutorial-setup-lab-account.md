---
title: Set up a lab account with Azure Lab Services | Microsoft Docs
description: In this tutorial, you set up a lab account with Azure Lab Services (formerly DevTest Labs). 
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
ms.date: 04/19/2018
ms.author: spelluru

---
# Tutorial: Set up a lab account with Azure Lab Services (formerly Azure DevTest Labs)
In this tutorial, you create a lab account with Azure Lab Services. An administrator sets up a lab account. A professor can then set up a classroom lab by using the [Azure Lab Services portal](https://labs.azure.com).  

In this tutorial, you do the following actions:

> [!div class="checklist"]
> * Create a lab account

## Prerequisites
If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Create a lab account
The following steps illustrate how to use the Azure portal to create a lab in Azure DevTest Labs. 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. From the main menu on the left side, select **Create a resource** (at the top of the list), point to **Developer tools**, and click **Lab Services (preview)**.

	![Create a lab account window](./media/tutorial-setup-lab-account/new-lab-account-page.png)
1. In the **Create a lab account** window, select **Create**.
2. In the **Lab account** window, do the following actions: 
    1. For **Lab account name**, enter a name. 
    2. Select the **Azure subscription** in which you want to create the lab account.
    3. For **Resource group**, select **Create new**, and enter a name for the resource group.
    4. For **Location**, select a location/region in which you want the lab account to be created. 
    5. Select **Create**. 

        ![Create a lab account window](./media/tutorial-setup-lab-account/lab-account-settings.png)
5. If you don't see the page for the lab account, select the notifications button, and then click **Go to resource** button in the notifications. 

    ![Create a lab account window](./media/tutorial-setup-lab-account/notification-go-to-resource.png)    
6. You see the following **lab account** page:

    ![Lab account page](./media/tutorial-setup-lab-account/lab-account-page.png)

## Next steps
In this tutorial, you created a lab account. To learn about how to create a classroom lab as a profession, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Set up a classroom lab](tutorial-setup-classroom-lab.md)

