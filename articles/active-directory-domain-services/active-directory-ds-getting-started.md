---
title: 'Azure Active Directory Domain Services: Getting Started | Microsoft Docs'
description: Getting started with Azure Active Directory Domain Services
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: stevenpo
editor: curtand

ms.assetid: ace1ed4a-bf7f-43c1-a64a-6b51a2202473
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/27/2017
ms.author: maheshu

---
# Enable Azure Active Directory Domain Services (Preview)
This article shows how to enable Azure Active Directory Domain Services (Azure AD DS) for your Azure Active Directory (Azure AD) directory using the Azure portal.

1. Go to the [Azure portal](https://portal.azure.com).
2. In the left pane, click on **New**.
3. In the **New** blade, type **Domain Services** into the search bar.

    ![Search for domain services](./media/getting-started/search-domain-services.png)

4. Click to select **Azure AD Domain Services** from the list of search suggestions. On the **Azure AD Domain Services** blade, click the **Create** button.

    ![Domain services blade](./media/getting-started/domain-services-blade.png)

5. The **Enable Azure AD Domain Services** wizard is launched.


## Task 1: Configure basic settings
In the **Basics** page of the wizard, you can specify the DNS domain name for the managed domain. You can also choose the resource group and Azure location to which the managed domain should be deployed.

![Configure basics](./media/getting-started/domain-services-blade-basics.png)

1. Choose the **DNS domain name** for your managed domain.

   * The default domain name of the directory (with a **.onmicrosoft.com** suffix) is selected by default.

   * The list contains all domains that have been configured for your Azure AD directory, including both verified and unverified domains that you configure on the **Domains** tab.

   * You can also type in a custom domain name. In this example, the custom domain name is *contoso100.com*.

     > [!WARNING]
     > The prefix of your specified domain name (for example, *contoso100* in the *contoso100.com* domain name) must contain 15 or fewer characters. You cannot create a managed domain with a prefix longer than 15 characters.
     >
     >

2. Ensure that the DNS domain name you have chosen for the managed domain does not already exist in the virtual network. Specifically, check whether:

   * You already have a domain with the same DNS domain name on the virtual network.

   * The virtual network where you plan to enable the managed domain has a VPN connection with your on-premises network. In this scenario, ensure you don't have a domain with the same DNS domain name on your on-premises network.

   * You have an existing cloud service with that name on the virtual network.

3. Select the Azure **Subscription** in which you would like to create the managed domain.

4. Select the **Resource group** to which the managed domain should belong. You can choose either the **Create new** or **Use existing** options to select the resource group.

5. Choose the Azure **Location** in which the managed domain should be created. On the **Network** page of the wizard, you see only virtual networks that belong to the location you have selected.

6. When you are done, click **OK** to move on to the **Network** page of the wizard.


## Next step
[Task 2: Configure network settings](active-directory-ds-getting-started-network.md)
