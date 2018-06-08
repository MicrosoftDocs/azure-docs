---

title: Add B2B collaboration users to Azure Active Directory without an invitation | Microsoft Docs
description: You can let a guest user add other guest users to your Azure AD without redeeming an invitation in Azure Active Directory B2B collaboration.
services: active-directory
documentationcenter: ''

services: active-directory
ms.service: active-directory
ms.component: B2B
ms.topic: article
ms.date: 05/11/2018

ms.author: twooley
author: twooley
manager: mtillman
ms.reviewer: sasubram

---

# Add B2B collaboration guest users without an invitation

> [!NOTE]
> Now, guest users no longer need the invitation email, except in some special cases. For more information, see [B2B collaboration invitation redemption](active-directory-b2b-redemption-experience.md).  

You can allow a user, such as a partner representative, to add users from the partner to your organization without needing invitations to be redeemed. All you must do is grant that user enumeration privileges in the directory you're using for the partner org. 

Grant these privileges when:

1. A user in the host organization (for example, WoodGrove) invites one user from the partner organization (for example, Sam@litware.com) as Guest.
2. The admin in the host organization [sets up policies](active-directory-b2b-delegate-invitations.md) that allow Sam to identify and add other users from the partner organization (Litware).
3. Now Sam can add other users from Litware to the WoodGrove directory, groups, or applications without needing invitations to be redeemed. If Sam has the appropriate enumeration privileges in Litware, it happens automatically.

### Next steps

- [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
- [How do information workers add B2B collaboration users?](active-directory-b2b-iw-add-users.md)
- [B2B collaboration invitation redemption](active-directory-b2b-redemption-experience.md)
- [Delegate invitations for Azure Active Directory B2B collaboration](active-directory-b2b-delegate-invitations.md)

