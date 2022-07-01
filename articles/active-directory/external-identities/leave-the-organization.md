---

title: Leave an organization as a guest user - Azure Active Directory
description: Shows how an Azure AD B2B guest user can leave an organization by using the Access Panel.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 06/30/2022

ms.author: mimart
author: msmimart
manager: celestedg

ms.collection: M365-identity-device-management
adobe-target: true
---

# Leave an organization as an external user

An Azure Active Directory (Azure AD) B2B collaboration or B2B direct connect user can decide to leave an organization at any time if they no longer need to use apps from that organization or maintain any association.

B2B collaboration and B2B direct connect users can usually leave an organization on their own without having to contact an administrator. This option won't be available if it's not allowed by the organization, or if the user's account has been disabled. The user will need to contact the tenant admin, who can delete the account.

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-dsr-and-stp-note.md)]

## Leave an organization

In your My Account portal, on the Organizations page, you can view and manage the organizations you have access to:

- **Home organization**: Your home organization is listed first. This is the organization that owns your work or school account. Because your account is managed by your administrator, you're not allowed to leave your home organization. (If you don't have an assigned home organization, you'll just see a single heading that says Organizations with the list of your associated organizations.)
  
- **Other organizations you collaborate with**: You'll also see the other organizations that you've signed in to previously using your work or school account. You can leave any of these organizations at any time.

To leave an organization, follow these steps.

1. Go to your **My Account** page by doing one of the following:

   - If you're using a work or school account, go to https://myaccount.microsoft.com and sign in.
   - If you're using a personal account, go to https://myapps.microsoft.com and sign in, and then select your account icon in the upper right and select **View account**. Or, use a My Account URL that includes your tenant information to go directly to your My Account page (examples are shown in the following note).  
   > [!NOTE]
   > If you use the email one-time passcode feature when signing in, you'll need to use a My Account URL that includes your tenant name or tenant ID, for example: `https://myaccount.microsoft.com?tenantId=wingtiptoys.onmicrosoft.com` or `https://myaccount.microsoft.com?tenantId=ab123456-cd12-ef12-gh12-ijk123456789`.

1. Select **Organizations** from the left navigation pane or select the **Manage organizations** link from the **Organizations** block.

1. Under **Other organizations you collaborate with**, find the organization that you want to leave, and select **Leave**.

   ![Screenshot showing Leave organization option in the user interface.](media/leave-the-organization/leave-org.png)
1. When asked to confirm, select **Leave**.

## Account removal

When a B2B collaboration user leaves an organization, the user's account is "soft deleted" in the directory. By default, the user object moves to the **Deleted users** area in Azure AD, but permanent deletion doesn't start for 30 days. This soft deletion enables the administrator to restore the user account, including groups and permissions, if the user makes a request to restore the account before it's permanently deleted. 

If desired, a tenant administrator can permanently delete the account at any time during the soft-delete period with the following steps. This action is irrevocable.

1. In the [Azure portal](https://portal.azure.com), select **Azure Active Directory**.
2. Under **Manage**, select **Users**.
3. Select **Deleted users**.
4. Select the check box next to a deleted user, and then select **Delete permanently**.

Once permanent deletion begins, whether it's initiated by the admin or the end of the soft deletion period, it can take up to an additional 30 days for data removal ([learn more](/compliance/regulatory/gdpr-dsr-azure#step-5-delete)).

> [!NOTE]
> For B2B direct connect users, data removal begins as soon as the user selects **Leave** in the confirmation message and can take up to 30 days to complete ([learn more](/compliance/regulatory/gdpr-dsr-azure#delete-a-users-data-when-there-is-no-account-in-the-azure-tenant)).

## Next steps

Learn more about [Azure AD B2B collaboration](what-is-b2b.md) and [Azure AD B2B direct connect](b2b-direct-connect-overview.md)
