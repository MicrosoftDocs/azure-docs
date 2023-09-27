---
title: Create an organizational unit (OU) in Microsoft Entra Domain Services | Microsoft Docs'
description: Learn how to create and manage a custom Organizational Unit (OU) in a Microsoft Entra Domain Services managed domain.
services: active-directory-ds
author: justinha
manager: amycolannino

ms.assetid: 52602ad8-2b93-4082-8487-427bdcfa8126
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 09/15/2023
ms.author: justinha

---
# Create an Organizational Unit (OU) in a Microsoft Entra Domain Services managed domain

Organizational units (OUs) in an Active Directory Domain Services (AD DS) managed domain let you logically group objects such as user accounts, service accounts, or computer accounts. You can then assign administrators to specific OUs, and apply group policy to enforce targeted configuration settings.

Domain Services managed domains include the following two built-in OUs:

* *AADDC Computers* - contains computer objects for all computers that are joined to the managed domain.
* *AADDC Users* - includes users and groups synchronized in from the Microsoft Entra tenant.

As you create and run workloads that use Domain Services, you may need to create service accounts for applications to authenticate themselves. To organize these service accounts, you often create a custom OU in the managed domain and then create service accounts within that OU.

In a hybrid environment, OUs created in an on-premises AD DS environment aren't synchronized to the managed domain. Managed domains use a flat OU structure. All user accounts and groups are stored in the *AADDC Users* container, despite being synchronized from different on-premises domains or forests, even if you've configured a hierarchical OU structure there.

This article shows you how to create an OU in your managed domain.

## Before you begin

To complete this article, you need the following resources and privileges:

* An active Azure subscription.
    * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A Microsoft Entra tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create a Microsoft Entra tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* A Microsoft Entra Domain Services managed domain enabled and configured in your Microsoft Entra tenant.
    * If needed, complete the tutorial to [create and configure a Microsoft Entra Domain Services managed domain][create-azure-ad-ds-instance].
* A Windows Server management VM that is joined to the Domain Services managed domain.
    * If needed, complete the tutorial to [create a management VM][tutorial-create-management-vm].
* A user account that's a member of the *Microsoft Entra DC administrators* group in your Microsoft Entra tenant.

## Custom OU considerations and limitations

When you create custom OUs in a managed domain, you gain additional management flexibility for user management and applying group policy. Compared to an on-premises AD DS environment, there are some limitations and considerations when creating and managing a custom OU structure in a managed domain:

* To create custom OUs, users must be a member of the *AAD DC Administrators* group.
* A user that creates a custom OU is granted administrative privileges (full control) over that OU and is the resource owner.
    * By default, the *AAD DC Administrators* group also has full control of the custom OU.
* A default OU for *AADDC Users* is created that contains all the synchronized user accounts from your Microsoft Entra tenant.
    * You can't move users or groups from the *AADDC Users* OU to custom OUs that you create. Only user accounts or resources created in the managed domain can be moved into custom OUs.
* User accounts, groups, service accounts, and computer objects that you create under custom OUs aren't available in your Microsoft Entra tenant.
    * These objects don't show up using the Microsoft Graph API or in the Microsoft Entra UI; they're only available in your managed domain.

## Create a custom OU

To create a custom OU, you use the Active Directory Administrative Tools from a domain-joined VM. The Active Directory Administrative Center lets you view, edit, and create resources in a managed domain, including OUs.

> [!NOTE]
> To create a custom OU in a managed domain, you must be signed in to a user account that's a member of the *AAD DC Administrators* group.

1. Sign in to your management VM. For steps on how to connect using the Microsoft Entra admin center, see [Connect to a Windows Server VM][connect-windows-server-vm].
1. From the Start screen, select **Administrative Tools**. A list of available management tools is shown that were installed in the tutorial to [create a management VM][tutorial-create-management-vm].
1. To create and manage OUs, select **Active Directory Administrative Center** from the list of administrative tools.
1. In the left pane, choose your managed domain, such as *aaddscontoso.com*. A list of existing OUs and resources is shown:

    ![Select your managed domain in the Active Directory Administrative Center](./media/create-ou/create-ou-adac-overview.png)

1. The **Tasks** pane is shown on the right side of the Active Directory Administrative Center. Under the domain, such as *aaddscontoso.com*, select **New > Organizational Unit**.

    ![Select the option to create a new OU in the Active Directory Administrative Center](./media/create-ou/create-ou-adac-new-ou.png)

1. In the **Create Organizational Unit** dialog, specify a **Name** for the new OU, such as *MyCustomOu*. Provide a short description for the OU, such as *Custom OU for service accounts*. If desired, you can also set the **Managed By** field for the OU. To create the custom OU, select **OK**.

    ![Create a custom OU from the Active Directory Administrative Center](./media/create-ou/create-ou-dialog.png)

1. Back in the Active Directory Administrative Center, the custom OU is now listed and is available for use:

    ![Custom OU available for use in the Active Directory Administrative Center](./media/create-ou/create-ou-done.png)

## Next steps

For more information on using the administrative tools or creating and using service accounts, see the following articles:

* [Active Directory Administrative Center: Getting Started](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd560651(v=ws.10))
* [Service Accounts Step-by-Step Guide](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd548356(v=ws.10))

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: /azure/active-directory/fundamentals/sign-up-organization
[associate-azure-ad-tenant]: /azure/active-directory/fundamentals/how-subscriptions-associated-directory
[create-azure-ad-ds-instance]: tutorial-create-instance.md
[tutorial-create-management-vm]: tutorial-create-management-vm.md
[connect-windows-server-vm]: join-windows-vm.md#connect-to-the-windows-server-vm
