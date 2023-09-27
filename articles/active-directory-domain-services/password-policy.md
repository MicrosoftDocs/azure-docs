---
title: Create and use password policies in Microsoft Entra Domain Services | Microsoft Docs
description: Learn how and why to use fine-grained password policies to secure and control account passwords in a Domain Services managed domain.
services: active-directory-ds
author: justinha
manager: amycolannino

ms.assetid: 1a14637e-b3d0-4fd9-ba7a-576b8df62ff2
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 09/21/2023
ms.author: justinha

---
# Password and account lockout policies on Microsoft Entra Domain Services managed domains

To manage user security in Microsoft Entra Domain Services, you can define fine-grained password policies that control account lockout settings or minimum password length and complexity. A default fine grained password policy is created and applied to all users in a Domain Services managed domain. To provide granular control and meet specific business or compliance needs, additional policies can be created and applied to specific users or groups.

This article shows you how to create and configure a fine-grained password policy in Domain Services using the Active Directory Administrative Center.

> [!NOTE]
> Password policies are only available for managed domains created using the Resource Manager deployment model. 

## Before you begin

To complete this article, you need the following resources and privileges:

* An active Azure subscription.
  * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A Microsoft Entra tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
  * If needed, [create a Microsoft Entra tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* A Microsoft Entra Domain Services managed domain enabled and configured in your Microsoft Entra tenant.
  * If needed, complete the tutorial to [create and configure a Microsoft Entra Domain Services managed domain][create-azure-ad-ds-instance].
  * The managed domain must have been created using the Resource Manager deployment model. 
* A Windows Server management VM that is joined to the managed domain.
  * If needed, complete the tutorial to [create a management VM][tutorial-create-management-vm].
* A user account that's a member of the *Microsoft Entra DC administrators* group in your Microsoft Entra tenant.

## Default password policy settings

Fine-grained password policies (FGPPs) let you apply specific restrictions for password and account lockout policies to different users in a domain. For example, to secure privileged accounts you can apply stricter account lockout settings than regular non-privileged accounts. You can create multiple FGPPs within a managed domain and specify the order of priority to apply them to users.

For more information about password policies and using the Active Directory Administration Center, see the following articles:

* [Learn about fine-grained password policies](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc770394(v=ws.10))
* [Configure fine-grained password policies using AD Administration Center](/windows-server/identity/ad-ds/get-started/adac/introduction-to-active-directory-administrative-center-enhancements--level-100-#fine_grained_pswd_policy_mgmt)

Policies are distributed through group association in a managed domain, and any changes you make are applied at the next user sign-in. Changing the policy doesn't unlock a user account that's already locked out.

Password policies behave a little differently depending on how the user account they're applied to was created. There are two ways a user account can be created in Domain Services:

* The user account can be synchronized in from Microsoft Entra ID. This includes cloud-only user accounts created directly in Azure, and hybrid user accounts synchronized from an on-premises AD DS environment using Microsoft Entra Connect.
    * The majority of user accounts in Domain Services are created through the synchronization process from Microsoft Entra ID.
* The user account can be manually created in a managed domain, and doesn't exist in Microsoft Entra ID.

All users, regardless of how they're created, have the following account lockout policies applied by the default password policy in Domain Services:

* **Account lockout duration:** 30
* **Number of failed logon attempts allowed:** 5
* **Reset failed logon attempts count after:** 2 minutes
* **Maximum password age (lifetime):** 90 days

With these default settings, user accounts are locked out for 30 minutes if five invalid passwords are used within 2 minutes. Accounts are automatically unlocked after 30 minutes.

Account lockouts only occur within the managed domain. User accounts are only locked out in Domain Services, and only due to failed sign-in attempts against the managed domain. User accounts that were synchronized in from Microsoft Entra ID or on-premises aren't locked out in their source directories, only in Domain Services.

If you have a Microsoft Entra password policy that specifies a maximum password age greater than 90 days, that password age is applied to the default policy in Domain Services. You can configure a custom password policy to define a different maximum password age in Domain Services. Take care if you have a shorter maximum password age configured in a Domain Services password policy than in Microsoft Entra ID or an on-premises AD DS environment. In that scenario, a user's password may expire in Domain Services before they're prompted to change in Microsoft Entra ID or an on-premises AD DS environment.

For user accounts created manually in a managed domain, the following additional password settings are also applied from the default policy. These settings don't apply to user accounts synchronized in from Microsoft Entra ID, as a user can't update their password directly in Domain Services.

* **Minimum password length (characters):** 7
* **Passwords must meet complexity requirements**

You can't modify the account lockout or password settings in the default password policy. Instead, members of the *AAD DC Administrators* group can create custom password policies and configure it to override (take precedence over) the default built-in policy, as shown in the next section.

## Create a custom password policy

As you build and run applications in Azure, you may want to configure a custom password policy. For example, you could create a policy to set different account lockout policy settings.

Custom password policies are applied to groups in a managed domain. This configuration effectively overrides the default policy.

To create a custom password policy, you use the Active Directory Administrative Tools from a domain-joined VM. The Active Directory Administrative Center lets you view, edit, and create resources in a managed domain, including OUs.

> [!NOTE]
> To create a custom password policy in a managed domain, you must be signed in to a user account that's a member of the *AAD DC Administrators* group.

1. From the Start screen, select **Administrative Tools**. A list of available management tools is shown that were installed in the tutorial to [create a management VM][tutorial-create-management-vm].
1. To create and manage OUs, select **Active Directory Administrative Center** from the list of administrative tools.
1. In the left pane, choose your managed domain, such as *aaddscontoso.com*.
1. Open the **System** container, then the **Password Settings Container**.

    A built-in password policy for the managed domain is shown. You can't modify this built-in policy. Instead, create a custom password policy to override the default policy.

    ![Create a password policy in the Active Directory Administrative Center](./media/password-policy/create-password-policy-adac.png)

1. In the **Tasks** panel on the right, select **New > Password Settings**.
1. In the **Create Password Settings** dialog, enter a name for the policy, such as *MyCustomFGPP*.
1. When multiple password policies exist, the policy with the highest precedence, or priority, is applied to a user. The lower the number, the higher the priority. The default password policy has a priority of *200*.

    Set the precedence for your custom password policy to override the default, such as *1*.

1. Edit other password policy settings as desired. Account lockout settings apply to all users, but only take effect within the managed domain and not in Microsoft Entra itself.

    ![Create a custom fine-grained password policy](./media/password-policy/custom-fgpp.png)

1. Uncheck **Protect from accidental deletion**. If this option is selected, you can't save the FGPP.
1. In the **Directly Applies To** section, select the **Add** button. In the **Select Users or Groups** dialog, select the **Locations** button.

    ![Select the users and groups to apply the password policy to](./media/password-policy/fgpp-applies-to.png)

1. In the **Locations** dialog, expand the domain name, such as *aaddscontoso.com*, then select an OU, such as **AADDC Users**. If you have a custom OU that contains a group of users you wish to apply, select that OU.

    ![Select the OU that the group belongs to](./media/password-policy/fgpp-container.png)

1. Type the name of the user or group you wish to apply the policy to. Select **Check Names** to validate the account.

    ![Search for and select the group to apply FGPP](./media/password-policy/fgpp-apply-group.png)

1. Click **OK** to save your custom password policy.

## Next steps

For more information about password policies and using the Active Directory Administration Center, see the following articles:

* [Learn about fine-grained password policies](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc770394(v=ws.10))
* [Configure fine-grained password policies using AD Administration Center](/windows-server/identity/ad-ds/get-started/adac/introduction-to-active-directory-administrative-center-enhancements--level-100-#fine_grained_pswd_policy_mgmt)

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: /azure/active-directory/fundamentals/sign-up-organization
[associate-azure-ad-tenant]: /azure/active-directory/fundamentals/how-subscriptions-associated-directory
[create-azure-ad-ds-instance]: tutorial-create-instance.md
[tutorial-create-management-vm]: tutorial-create-management-vm.md
