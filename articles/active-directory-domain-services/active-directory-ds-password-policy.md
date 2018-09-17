---
title: 'Azure Active Directory Domain Services: Password policy | Microsoft Docs'
description: Understand password policies on managed domains
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: mtillman
editor: curtand

ms.assetid: 1a14637e-b3d0-4fd9-ba7a-576b8df62ff2
ms.service: active-directory
ms.component: domains
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/17/2018
ms.author: maheshu

---
# Password and account lockout policies on managed domains
This article explains the default password policies on a managed domain. It also covers how you can configure these policies.

## Fine grained password policies (FGPP)
You can use fine-grained password policies to specify multiple password policies within a single domain. You can use fine-grained password policies to apply different restrictions for password and account lockout policies to different sets of users in a domain.

For example, you can apply stricter settings to privileged accounts and less strict settings to the accounts of other users. In other cases, you might want to apply a special password policy for accounts whose passwords are synchronized with other data sources.

You can configure the following password settings using FGPP:
* Enforce minimum password length
* Enforce password history
* Passwords must meet complexity requirements
* Enforce minimum password age
* Enforce maximum password age
* Enforce account lockout policy
    * Account lockout duration
    * Number of failed logon attempts allowed
    * Reset failed logon attempts count after


## Default fine grained password policy settings on a managed domain
The following screenshot illustrates the default fine grained password policy configured on an Azure AD Domain Services managed domain.

![Default fine grained password policy](./media/how-to/default-fgpp.png)

> [!NOTE]
> You cannot modify or delete the default built-in fine grained password policy. Members of the 'AAD DC Administrators' group can create custom FGPP and configure it to override (take precedence over) the default built-in FGPP.
>
>

## Password policy settings
On a managed domain, the following password policies are configured by default:
* Minimum password length: 7 characters
* Maximum password age (lifetime): 90 days
* Passwords must meet complexity requirements.

### Account lockout settings
On a managed domain, the following account lockout policies are configured by default:
* Account lockout duration: 30
* Number of failed logon attempts allowed: 5
* Reset failed logon attempts count after: 30 minutes

Effectively, user accounts are locked out for 30 minutes if five invalid passwords are used within 2 minutes. Accounts are automatically unlocked after 30 minutes.


## Create a custom fine grained password policy on a managed domain
You can create a custom fine grained password policy and configure it to apply to the default OU in your managed domain. This effectively overrides the default FGPP configured for the managed domain.

> [!TIP]
> Only members of the **'AAD DC Administrators'** group have the permissions to create custom fine grained password policies.
>
>

Additionally, you can also create custom fine grained password policies and apply them to any custom OUs you create on the managed domain.

You can configure a custom FGPP for the following reasons:
* To set a different account lockout policy.
* To configure a default password lifetime setting for the managed domain.

To create a custom FGPP on your managed domain:
* Log-in to the Windows VM you use to administer your managed domain. If you don't have one, follow the instructions to [administer a managed domain](active-directory-ds-admin-guide-administer-domain.md)
* Launch the **Active Directory Administrative Center** on the VM.
* Click the domain name (for example, 'contoso100.com').
* Double click **System** to open the System container.
* Double click **Password Settings Container**.
* You see the default built-in FGPP for the managed domain. It is named **AADDSSTFPSO**. You cannot modify this built-in FGPP. You can however, create a new custom FGPP override the default FGPP.
* On the **Tasks** panel in the right, click **New** and click **Password Settings**.
* In the **Create Password Settings** dialog, specify the custom password settings to apply as part of the custom FGPP. Remember to set the precedence appropriately to override the default FGPP.

  ![Create custom FGPP](./media/how-to/custom-fgpp.png)

  > [!TIP]
  > **Remember to uncheck the Protect from accidental deletion option.** If this option is selected, the FGPP cannot be saved.
  >
  >

* In the **Directly Applies To** section, click **Add**. In the **Select Users or Groups** dialog, click the **Locations** button.

  ![Select users and groups](./media/how-to/fgpp-applies-to.png)

* In the **Locations** dialog, expand the domain name and click **AADDC Users**. You can now select a group from the built-in users OU, to which to apply the FGPP.

  ![Select the OU that group belongs to](./media/how-to/fgpp-container.png)

* Type the name of the group and click the **Check Names** button to validate the group exists.

  ![Select the group to apply FGPP](./media/how-to/fgpp-apply-group.png)

* The name of the group is displayed in the **Directly Applies To** section. Click the **OK** button to save these changes.

  ![FGPP applied](./media/how-to/fgpp-applied.png)

> [!TIP]
> **To apply custom password policies for user accounts in a custom OU:**
> Fine grained password policies can be applied only to groups. To configure a custom password policy only for users from a custom OU, create a group that includes users in that OU.
>
>

## Next steps
* [Learn about Active Directory fine grained password policies](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc770394)
* [Configure fine grained password policies using AD Administration Center](https://docs.microsoft.com/windows-server/identity/ad-ds/get-started/adac/introduction-to-active-directory-administrative-center-enhancements--level-100-#fine_grained_pswd_policy_mgmt)
