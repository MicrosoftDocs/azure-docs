---
title: 'Azure Active Directory Domain Services: Getting Started | Microsoft Docs'
description: Enable Azure Active Directory Domain Services using the Azure portal (Preview)
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
ms.date: 09/15/2017
ms.author: maheshu

---
# Enable Azure Active Directory Domain Services using the Azure portal (Preview)
This article shows how to enable Azure Active Directory Domain Services (Azure AD DS) using the Azure portal.

To launch the **Enable Azure AD Domain Services** wizard, complete the following steps:

1. Go to the [Azure portal](https://portal.azure.com).
2. In the left pane, click on **New**.
3. In the **New** page, type **Domain Services** into the search bar.

    ![Search for domain services](./media/getting-started/search-domain-services.png)

4. Click to select **Azure AD Domain Services** from the list of search suggestions. On the **Azure AD Domain Services** page, click the **Create** button.

    ![Domain services view](./media/getting-started/domain-services-blade.png)

5. The **Enable Azure AD Domain Services** wizard is launched.


## Task 1: configure basic settings
In the **Basics** page of the wizard, you can specify the DNS domain name for the managed domain. You can also choose the resource group and Azure location to which the managed domain should be deployed.

![Configure basics](./media/getting-started/domain-services-blade-basics.png)

1. Choose the **DNS domain name** for your managed domain.

   * The default domain name of the directory (with a **.onmicrosoft.com** suffix) is specified by default.

   * You can also type in a custom domain name. In this example, the custom domain name is *contoso100.com*.

     > [!WARNING]
     > The prefix of your specified domain name (for example, *contoso100* in the *contoso100.com* domain name) must contain 15 or fewer characters. You cannot create a managed domain with a prefix longer than 15 characters.
     >
     >

2. Ensure that the DNS domain name you have chosen for the managed domain does not already exist in the virtual network. Specifically, check whether:

   * You already have a domain with the same DNS domain name on the virtual network.

   * The virtual network where you plan to enable the managed domain has a VPN connection with your on-premises network. In this scenario, ensure you don't have a domain with the same DNS domain name on your on-premises network.

   * You have an existing cloud service with that name on the virtual network.

3. Choose the **type of virtual network**. By default, the **Resource Manager** virtual network type is selected. We recommend using this type of virtual network for all newly created managed domains.

    > [!TIP]
    > **Classic virtual network support is scheduled for deprecation.** Select the Resource Manager virtual network type for all new deployments. Classic virtual networks will soon no longer be supported for new deployments. Existing managed domains deployed in classic virtual networks will continue to be supported.
    >

4. Select the Azure **Subscription** in which you would like to create the managed domain.

5. Select the **Resource group** to which the managed domain should belong. You can choose either the **Create new** or **Use existing** options to select the resource group.

6. Choose the Azure **Location** in which the managed domain should be created. On the **Network** page of the wizard, you see only virtual networks that belong to the location you have selected.

7. When you are done, click **OK** to move on to the **Network** page of the wizard.


## Next step
[Task 2: configure network settings](active-directory-ds-getting-started-network.md)
