---
title: Create and manage group policy in Azure AD Domain Services | Microsoft Docs
description: Learn how to edit the built-in group policy objects (GPOs) and create your own custom policies in an Azure Active Directory Domain Services managed domain.
author: iainfoulds
manager: daveba

ms.assetid: 938a5fbc-2dd1-4759-bcce-628a6e19ab9d
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 03/09/2020
ms.author: iainfou

---
# Administer Group Policy in an Azure Active Directory Domain Services managed domain

Settings for user and computer objects in Azure Active Directory Domain Services (Azure AD DS) are often managed using Group Policy Objects (GPOs). Azure AD DS includes built-in GPOs for the *AADDC Users* and *AADDC Computers* containers. You can customize these built-in GPOs to configure Group Policy as needed for your environment. Members of the *Azure AD DC administrators* group have Group Policy administration privileges in the Azure AD DS domain, and can also create custom GPOs and organizational units (OUs). More more information on what Group Policy is and how it works, see [Group Policy overview][group-policy-overview].

In a hybrid environment, group policies configured in an on-premises AD DS environment aren't synchronized to Azure AD DS. To define configuration settings for users or computers in Azure AD DS, edit one of the default GPOs or create a custom GPO.

This article shows you how to install the Group Policy Management tools, then edit the built-in GPOs and create custom GPOs.

[!INCLUDE [active-directory-ds-prerequisites.md](../../includes/active-directory-ds-prerequisites.md)]

## Before you begin

To complete this article, you need the following resources and privileges:

* An active Azure subscription.
    * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* An Azure Active Directory Domain Services managed domain enabled and configured in your Azure AD tenant.
    * If needed, complete the tutorial to [create and configure an Azure Active Directory Domain Services managed domain][create-azure-ad-ds-instance].
* A Windows Server management VM that is joined to the Azure AD DS managed domain.
    * If needed, complete the tutorial to [create a Windows Server VM and join it to a managed domain][create-join-windows-vm].
* A user account that's a member of the *Azure AD DC administrators* group in your Azure AD tenant.

> [!NOTE]
> You can use Group Policy Administrative Templates by copying the new templates to the management workstation. Copy the *.admx* files into `%SYSTEMROOT%\PolicyDefinitions` and copy the locale-specific *.adml* files to `%SYSTEMROOT%\PolicyDefinitions\[Language-CountryRegion]`, where `Language-CountryRegion` matches the language and region of the *.adml* files.
>
> For example, copy the English, United States version of the *.adml* files into the `\en-us` folder.
>
> Alternatively, you can centrally store your Group Policy Administrative Template on the domain controllers that are part of the managed domain. For more information, see [How to create and manage the Central Store for Group Policy Administrative Templates in Windows](https://support.microsoft.com/help/3087759/how-to-create-and-manage-the-central-store-for-group-policy-administra).

## Install Group Policy Management tools

To create and configure Group Policy Object (GPOs), you need to install the Group Policy Management tools. These tools can be installed as a feature in Windows Server. For more information on how to install the administrative tools on a Windows client, see install [Remote Server Administration Tools (RSAT)][install-rsat].

1. Sign in to your management VM. For steps on how to connect using the Azure portal, see [Connect to a Windows Server VM][connect-windows-server-vm].
1. **Server Manager** should open by default when you sign in to the VM. If not, on the **Start** menu, select **Server Manager**.
1. In the *Dashboard* pane of the **Server Manager** window, select **Add Roles and Features**.
1. On the **Before You Begin** page of the *Add Roles and Features Wizard*, select **Next**.
1. For the *Installation Type*, leave the **Role-based or feature-based installation** option checked and select **Next**.
1. On the **Server Selection** page, choose the current VM from the server pool, such as *myvm.aaddscontoso.com*, then select **Next**.
1. On the **Server Roles** page, click **Next**.
1. On the **Features** page, select the **Group Policy Management** feature.

    ![Install the 'Group Policy Management' from the Features page](./media/active-directory-domain-services-admin-guide/install-rsat-server-manager-add-roles-gp-management.png)

1. On the **Confirmation** page, select **Install**. It may take a minute or two to install the Group Policy Management tools.
1. When feature installation is complete, select **Close** to exit the **Add Roles and Features** wizard.

## Open the Group Policy Management Console and edit an object

Default group policy objects (GPOs) exist for users and computers in a managed domain. With the Group Policy Management feature installed from the previous section, let's view and edit an existing GPO. In the next section, you create a custom GPO.

> [!NOTE]
> To administer group policy in a managed domain, you must be signed in to a user account that's a member of the *AAD DC Administrators* group.

1. From the Start screen, select **Administrative Tools**. A list of available management tools is shown, including **Group Policy Management** installed in the previous section.
1. To open the Group Policy Management Console (GPMC), choose **Group Policy Management**.

    ![The Group Policy Management Console opens ready to edit group policy objects](./media/active-directory-domain-services-admin-guide/gp-management-console.png)

There are two built-in Group Policy Objects (GPOs) in a managed domain - one for the *AADDC Computers* container, and one for the *AADDC Users* container. You can customize these GPOs to configure group policy as needed within your managed domain.

1. In the **Group Policy Management** console, expand the **Forest: aaddscontoso.com** node. Next, expand the **Domains** nodes.

    Two built-in containers exist for *AADDC Computers* and *AADDC Users*. Each of these containers has a default GPO applied to them.

    ![Built-in GPOs applied to the default 'AADDC Computers' and 'AADDC Users' containers](./media/active-directory-domain-services-admin-guide/builtin-gpos.png)

1. These built-in GPOs can be customized to configure specific group policies on your managed domain. Right-select one of the GPOs, such as *AADDC Computers GPO*, then choose **Edit...**.

    ![Choose the option to 'Edit' one of the built-in GPOs](./media/active-directory-domain-services-admin-guide/edit-builtin-gpo.png)

1. The Group Policy Management Editor tool opens to let you customize the GPO, such as *Account Policies*:

    ![Customize GPO to configure settings as required](./media/active-directory-domain-services-admin-guide/gp-editor.png)

    When done, choose **File > Save** to save the policy. Computers refresh Group Policy by default every 90 minutes and apply the changes you made.

## Create a custom Group Policy Object

To group similar policy settings, you often create additional GPOs instead of applying all of the required settings in the single, default GPO. With Azure AD DS, you can create or import your own custom group policy objects and link them to a custom OU. If you need to first create a custom OU, see [create a custom OU in a managed domain](create-ou.md).

1. In the **Group Policy Management** console, select your custom organizational unit (OU), such as *MyCustomOU*. Right-select the OU and choose **Create a GPO in this domain, and Link it here...**:

    ![Create a custom GPO in the Group Policy Management console](./media/active-directory-domain-services-admin-guide/gp-create-gpo.png)

1. Specify a name for the new GPO, such as *My custom GPO*, then select **OK**. You can optionally base this custom GPO on an existing GPO and set of policy options.

    ![Specify a name for the new custom GPO](./media/active-directory-domain-services-admin-guide/gp-specify-gpo-name.png)

1. The custom GPO is created and linked to your custom OU. To now configure the policy settings, right-select the custom GPO and choose **Edit...**:

    ![Choose the option to 'Edit' your custom GPO](./media/active-directory-domain-services-admin-guide/gp-gpo-created.png)

1. The **Group Policy Management Editor** opens to let you customize the GPO:

    ![Customize GPO to configure settings as required](./media/active-directory-domain-services-admin-guide/gp-customize-gpo.png)

    When done, choose **File > Save** to save the policy. Computers refresh Group Policy by default every 90 minutes and apply the changes you made.

## Next steps

For more information on the available Group Policy settings that you can configure using the Group Policy Management Console, see [Work with Group Policy preference items][group-policy-console].

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: tutorial-create-instance.md
[create-join-windows-vm]: join-windows-vm.md
[tutorial-create-management-vm]: tutorial-create-management-vm.md
[connect-windows-server-vm]: join-windows-vm.md#connect-to-the-windows-server-vm

<!-- EXTERNAL LINKS -->
[group-policy-overview]: /previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh831791(v=ws.11)
[install-rsat]: /windows-server/remote/remote-server-administration-tools#BKMK_Thresh
[group-policy-console]: /previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn789194(v=ws.11)
