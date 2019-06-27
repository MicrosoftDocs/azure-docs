---

title: Add B2B guests without an invitation link or email - Azure Active Directory | Microsoft Docs
description: You can let a guest user add other guest users to your Azure AD without redeeming an invitation in Azure Active Directory B2B collaboration.
services: active-directory
documentationcenter: ''

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 06/12/2019

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: elisol

ms.collection: M365-identity-device-management
---

# Add B2B collaboration guest users without an invitation link or email

You can now invite guest users by sending out a direct link to a shared app. With this method, guest users no longer need to use the invitation email, except in some special cases. A guest user clicks the app link, reviews and accepts the privacy terms, and then seamlessly accesses the app. For more information, see [B2B collaboration invitation redemption](redemption-experience.md).   

Before this new method was available, you could invite guest users without requiring the invitation email by adding an inviter (from your organization or from a partner organization) to the **Guest inviter** directory role, and then having the inviter add guest users to the directory, groups, or applications through the UI or through PowerShell. (If using PowerShell, you can suppress the invitation email altogether). For example:

1. A user in the host organization (for example, WoodGrove) invites one user from the partner organization (for example, Sam@litware.com) as Guest.
2. The administrator in the host organization [sets up policies](delegate-invitations.md) that allow Sam to identify and add other users from the partner organization (Litware). (Sam must be added to the **Guest inviter** role.)
3. Now, Sam can add other users from Litware to the WoodGrove directory, groups, or applications without needing invitations to be redeemed. If Sam has the appropriate enumeration privileges in Litware, it happens automatically.
 
This  original method still works. However, there's a small difference in behavior. If you use PowerShell, you'll notice that an invited guest account now has a **PendingAcceptance** status instead of immediately showing **Accepted**. Although the status is pending, the guest user can still sign in and access the app without clicking an email invitation link. The pending status means that the user has not yet gone through the [consent experience](redemption-experience.md#consent-experience-for-the-guest), where they accept the privacy terms of the inviting organization. The guest user sees this consent screen when they sign in for the first time. 

If you invite a user to the directory, the guest user must access the resource tenant-specific Azure portal URL directly (such as https://portal.azure.com/*resourcetenant*.onmicrosoft.com) to view and agree to the privacy terms.

## Next steps

- [What is Azure AD B2B collaboration?](what-is-b2b.md)
- [B2B collaboration invitation redemption](redemption-experience.md)
- [Delegate invitations for Azure Active Directory B2B collaboration](delegate-invitations.md)
- [How do information workers add B2B collaboration users?](add-users-information-worker.md)

