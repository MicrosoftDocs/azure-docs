---
title: Terms of use - Azure Active Directory | Microsoft Docs
description: Get started using Azure Active Directory terms of use to present information to employees or guests before getting access.

services: active-directory
ms.service: active-directory
ms.subservice: compliance
ms.topic: conceptual
ms.date: 05/29/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: jocastel

ms.collection: M365-identity-device-management
---
# Azure Active Directory terms of use

Azure AD terms of use provides a simple method that organizations can use to present information to end users. This presentation ensures users see relevant disclaimers for legal or compliance requirements. This article describes how to get started with terms of use.

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-intro-sentence.md)]

## Overview videos

The following video provides a quick overview of terms of use.

>[!VIDEO https://www.youtube.com/embed/tj-LK0abNao]

For additional videos, see:
- [How to deploy terms of use in Azure Active Directory](https://www.youtube.com/embed/N4vgqHO2tgY)
- [How to roll out terms of use in Azure Active Directory](https://www.youtube.com/embed/t_hA4y9luCY)

## What can I do with terms of use?

Azure AD terms of use has the following capabilities:

- Require employees or guests to accept your terms of use before getting access.
- Require employees or guests to accept your terms of use on every device before getting access.
- Require employees or guests to accept your terms of use on a recurring schedule.
- Require employees or guests to accept your terms of use prior to registering security information in Azure Multi-Factor Authentication (MFA).
- Require employees to accept your terms of use prior to registering security information in Azure AD self-service password reset (SSPR).
- Present general terms of use for all users in your organization.
- Present specific terms of use based on a user attributes (ex. doctors vs nurses or domestic vs international employees, by using [dynamic groups](../users-groups-roles/groups-dynamic-membership.md)).
- Present specific terms of use when accessing high business impact applications, like Salesforce.
- Present terms of use in different languages.
- List who has or hasn't accepted to your terms of use.
- Assist in meeting privacy regulations.
- Display a log of terms of use activity for compliance and audit.
- Create and manage terms of use using [Microsoft Graph APIs](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/agreement) (currently in preview).

## Prerequisites

To use and configure Azure AD terms of use, you must have:

- Azure AD Premium P1, P2, EMS E3, or EMS E5 subscription.
   - If you don't have one of theses subscriptions, you can [get Azure AD Premium](../fundamentals/active-directory-get-started-premium.md) or [enable Azure AD Premium trial](https://azure.microsoft.com/trial/get-started-active-directory/).
- One of the following administrator accounts for the directory you want to configure:
   - Global Administrator
   - Security Administrator
   - Conditional Access Administrator

## Terms of use document

Azure AD terms of use uses the PDF format to present content. The PDF file can be any content, such as existing contract documents, allowing you to collect end-user agreements during user sign-in. To support users on mobile devices, the recommended font size in the PDF is 24 point.

## Add terms of use

Once you have finalized your terms of use document, use the following procedure to add it.

1. Sign in to Azure as a Global Administrator, Security Administrator, or Conditional Access Administrator.
1. Navigate to **Terms of use** at [https://aka.ms/catou](https://aka.ms/catou).

   ![Conditional Access - Terms of use blade](./media/terms-of-use/tou-blade.png)

1. Click **New terms**.

   ![New term of use pane to specify your terms of use settings](./media/terms-of-use/new-tou.png)

1. In the **Name** box, enter a name for the terms of use that will be used in the Azure portal.
1. In the **Display name** box, enter a title that users see when they sign in.
1. For **Terms of use document**, browse to your finalized terms of use PDF and select it.
1. Select the language for your terms of use document. The language option allows you to upload multiple terms of use, each with a different language. The version of the terms of use that an end user will see will be based on their browser preferences.
1. To require end users to view the terms of use prior to accepting them, set **Require users to expand the terms of use** to **On**.
1. To require end users to accept your terms of use on every device they are accessing from, set **Require users to consent on every device** to **On**. For more information, see [Per-device terms of use](#per-device-terms-of-use).
1. If you want to expire terms of use consents on a schedule, set **Expire consents** to **On**. When set to On, two additional schedule settings are displayed.

   ![Expire consents settings to set start date, frequency, and duration](./media/terms-of-use/expire-consents.png)

1. Use the **Expire starting on** and **Frequency** settings to specify the schedule for terms of use expirations. The following table shows the result for a couple of example settings:

   | Expire starting on | Frequency | Result |
   | --- | --- | --- |
   | Today's date  | Monthly | Starting today, users must accept the terms of use and then reaccept every month. |
   | Date in the future  | Monthly | Starting today, users must accept the terms of use. When the future date occurs, consents will expire and then users must reaccept every month.  |

   For example, if you set the expire starting on date to **Jan 1** and frequency to **Monthly**, here is how expirations might occur for two users:

   | User | First accept date | First expire date | Second expire date | Third expire date |
   | --- | --- | --- | --- | --- |
   | Alice | Jan 1 | Feb 1 | Mar 1 | Apr 1 |
   | Bob | Jan 15 | Feb 1 | Mar 1 | Apr 1 |

1. Use the **Duration before re-acceptance requires (days)** setting to specify the number of days before the user must reaccept the terms of use. This allows users to follow their own schedule. For example, if you set the duration to **30** days, here is how expirations might occur for two users:

   | User | First accept date | First expire date | Second expire date | Third expire date |
   | --- | --- | --- | --- | --- |
   | Alice | Jan 1 | Jan 31 | Mar 2 | Apr 1 |
   | Bob | Jan 15 | Feb 14 | Mar 16 | Apr 15 |

   It is possible to use the **Expire consents** and **Duration before re-acceptance requires (days)** settings together, but typically you use one or the other.

1. Under **Conditional Access**, use the **Enforce with Conditional Access policy template** list to select the template to enforce the terms of use.

   ![Conditional Access drop-down list to select a policy template](./media/terms-of-use/conditional-access-templates.png)

   | Template | Description |
   | --- | --- |
   | **Access to cloud apps for all guests** | A Conditional Access policy will be created for all guests and all cloud apps. This policy impacts the Azure portal. Once this is created, you might be required to sign-out and sign-in. |
   | **Access to cloud apps for all users** | A Conditional Access policy will be created for all users and all cloud apps. This policy impacts the Azure portal. Once this is created, you will be required to sign-out and sign-in. |
   | **Custom policy** | Select the users, groups, and apps that this terms of use will be applied to. |
   | **Create Conditional Access policy later** | This terms of use will appear in the grant control list when creating a Conditional Access policy. |

   >[!IMPORTANT]
   >Conditional Access policy controls (including terms of use) do not support enforcement on service accounts. We recommend excluding all service accounts from the Conditional Access policy.

    Custom Conditional Access policies enable granular terms of use, down to a specific cloud application or group of users. For more information, see [Quickstart: Require terms of use to be accepted before accessing cloud apps](require-tou.md).

1. Click **Create**.

   If you selected a custom Conditional Access template, then a new screen appears that allows you to create the custom Conditional Access policy.

   ![New Conditional Access pane if you chose the custom Conditional Access policy template](./media/terms-of-use/custom-policy.png)

   You should now see your new terms of use.

   ![New terms of use listed in the terms of use blade](./media/terms-of-use/create-tou.png)

## View report of who has accepted and declined

The Terms of use blade shows a count of the users who have accepted and declined. These counts and who accepted/declined are stored for the life of the terms of use.

1. Sign in to Azure and navigate to **Terms of use** at [https://aka.ms/catou](https://aka.ms/catou).

   ![Terms of use blade listing the number of user show have accepted and declined](./media/terms-of-use/view-tou.png)

1. For a terms of use, click the numbers under **Accepted** or **Declined** to view the current state for users.

   ![Terms of use consents pane listing the users that have accepted](./media/terms-of-use/accepted-tou.png)

1. To view the history for an individual user, click the ellipsis (**...**) and then **View History**.

   ![View History context menu for a user](./media/terms-of-use/view-history-menu.png)

   In the view history pane, you see a history of all the accepts, declines, and expirations.

   ![View History pane lists the history accepts, declines, and expirations for a user](./media/terms-of-use/view-history-pane.png)

## View Azure AD audit logs

If you want to view additional activity, Azure AD terms of use includes audit logs. Each user consent triggers an event in the audit logs that is stored for **30 days**. You can view these logs in the portal or download as a .csv file.

To get started with Azure AD audit logs, use the following procedure:

1. Sign in to Azure and navigate to **Terms of use** at [https://aka.ms/catou](https://aka.ms/catou).
1. Select a terms of use.
1. Click **View audit logs**.

   ![Terms of use blade with the View audit logs option highlighted](./media/terms-of-use/audit-tou.png)

1. On the Azure AD audit logs screen, you can filter the information using the provided lists to target specific audit log information.

   You can also click **Download** to download the information in a .csv file for use locally.

   ![Azure AD audit logs screen listing date, target policy, initiated by, and activity](./media/terms-of-use/audit-logs-tou.png)

   If you click a log, a pane appears with additional activity details.

   ![Activity details for a log showing activity, activity status, initiated by, target policy](./media/terms-of-use/audit-log-activity-details.png)

## What terms of use looks like for users

Once a terms of use is created and enforced, users, who are in scope, will see the following screen during sign-in.

![Example terms of use that appears when a user signs in](./media/terms-of-use/user-tou.png)

Users can view the terms of use and, if necessary, use buttons to zoom in and out.

![View of terms of use with zoom buttons](./media/terms-of-use/zoom-buttons.png)

The following screen shows how terms of use looks on mobile devices.

![Example terms of use that appears when a user signs in on a mobile device](./media/terms-of-use/mobile-tou.png)

Users are only required to accept the terms of use once and they will not see the terms of use again on subsequent sign-ins.

### How users can review their terms of use

Users can review and see the terms of use that they have accepted by using the following procedure.

1. Sign in to [https://myapps.microsoft.com](https://myapps.microsoft.com).
1. In the upper right corner, click your name and select **Profile**.

   ![MyApps site with the user's pane open](./media/terms-of-use/tou14.png)

1. On your Profile page, click **Review terms of use**.

   ![Profile page for a user showing the Review terms of use link](./media/terms-of-use/tou13a.png)

1. From there, you can review the terms of use you have accepted.

## Edit terms of use details

You can edit some details of terms of use, but you can't modify an existing document. The following procedure describes how to edit the details.

1. Sign in to Azure and navigate to **Terms of use** at [https://aka.ms/catou](https://aka.ms/catou).
1. Select the terms of use you want to edit.
1. Click **Edit terms**.
1. In the Edit terms of use pane, change the name, display name, or require users to expand values.

   If there are other settings you would like to change, such as PDF document, require users to consent on every device, expire consents, duration before reacceptance, or Conditional Access policy, you must create a new terms of use.

   ![Edit terms of use pane showing name and expand options](./media/terms-of-use/edit-tou.png)

1. Click **Save** to save your changes.

   Once you save your changes, users will not have to reaccept these edits.

## Add a terms of use language

The following procedure describes how to add a terms of use language.

1. Sign in to Azure and navigate to **Terms of use** at [https://aka.ms/catou](https://aka.ms/catou).
1. Select the terms of use you want to edit.
1. In the details pane, click the **Languages** tab.

   ![Terms of use selected and showing the Languages tab in the details pane](./media/terms-of-use/languages-tou.png)

1. Click **Add language**.
1. In the Add terms of use language pane, upload your localized PDF and select the language.

   ![Add terms of use language pane with options to upload localized PDFs](./media/terms-of-use/language-add-tou.png)

1. Click **Add** to add the language.

## Per-device terms of use

The **Require users to consent on every device** setting enables you to require end users to accept your terms of use on every device they are accessing from. The end user will be required to join their device in Azure AD. When the device is joined, the device ID is used to enforce the terms of use on each device.

Here is a list of the supported platforms and software.

> [!div class="mx-tableFixed"]
> |  | iOS | Android | Windows 10 | Other |
> | --- | --- | --- | --- | --- |
> | **Native app** | Yes | Yes | Yes |  |
> | **Microsoft Edge** | Yes | Yes | Yes |  |
> | **Internet Explorer** | Yes | Yes | Yes |  |
> | **Chrome (with extension)** | Yes | Yes | Yes |  |

Per-device terms of use has the following constraints:

- A device can only be joined to one tenant.
- A user must have permissions to join their device.
- The Intune Enrollment app is not supported.
- Azure AD B2B users are not supported.

If the user's device is not joined, they will receive a message that they need to join their device. Their experience will be dependent on the platform and software.

### Join a Windows 10 device

If a user is using Windows 10 and Microsoft Edge, they will receive a message similar to the following to [join their device](../user-help/user-help-join-device-on-network.md#to-join-an-already-configured-windows-10-device).

![Windows 10 and Microsoft Edge - Message indicating your device must be registered](./media/terms-of-use/per-device-win10-edge.png)

If they are using Chrome, they will be prompted to install the [Windows 10 Accounts extension](https://chrome.google.com/webstore/detail/windows-10-accounts/ppnbnpeolgkicgegkbkbjmhlideopiji).

### Browsers

If a user is using browser that is not supported, they will be asked to use a different browser.

![Message indicating your device must be registered, but browser is not supported](./media/terms-of-use/per-device-browser-unsupported.png)

## Delete terms of use

You can delete old terms of use using the following procedure.

1. Sign in to Azure and navigate to **Terms of use** at [https://aka.ms/catou](https://aka.ms/catou).
1. Select the terms of use you want to remove.
1. Click **Delete terms**.
1. In the message that appears asking if you want to continue, click **Yes**.

   ![Message asking for confirmation to delete terms of use](./media/terms-of-use/delete-tou.png)

   You should no longer see your terms of use.

## Deleted users and active terms of use

By default, a deleted user is in a deleted state in Azure AD for 30 days, during which time they can be restored by an administrator if necessary. After 30 days, that user is permanently deleted. In addition, using the Azure Active Directory portal, a Global Administrator can explicitly [permanently delete a recently deleted user](../fundamentals/active-directory-users-restore.md) before that time period is reached. One a user has been permanently deleted, subsequent data about that user will be removed from the active terms of use. Audit information about deleted users remains in the audit log.

## Policy changes

Conditional Access policies take effect immediately. When this happens, the administrator will start to see “sad clouds” or "Azure AD token issues". The administrator must sign out and sign in again in order to satisfy the new policy.

> [!IMPORTANT]
> Users in scope will need to sign-out and sign-in in order to satisfy a new policy if:
>
> - a Conditional Access policy is enabled on a terms of use
> - or a second terms of use is created

## B2B guests (Preview)

Most organizations have a process in place for their employees to consent to their organization's terms of use and privacy statements. But how can you enforce the same consents for Azure AD business-to-business (B2B) guests when they're added via SharePoint or Teams? Using Conditional Access and terms of use, you can enforce a policy directly towards B2B guest users. During the invitation redemption flow, the user is presented with the terms of use. This support is currently in preview.

Terms of use will only be displayed when the user has a guest account in Azure AD. SharePoint Online currently has an [ad hoc external sharing recipient experience](/sharepoint/what-s-new-in-sharing-in-targeted-release) to share a document or a folder that does not require the user to have a guest account. In this case, a terms of use is not displayed.

![Users and groups pane - Include tab with All guest users option checked](./media/terms-of-use/b2b-guests.png)

## Support for cloud apps (Preview)

Terms of use can be used for different cloud apps, such as Azure Information Protection and Microsoft Intune. This support is currently in preview.

### Azure Information Protection

You can configure a Conditional Access policy for the Azure Information Protection app and require a terms of use when a user accesses a protected document. This will trigger a terms of use prior to a user accessing a protected document for the first time.

![Cloud apps pane with Microsoft Azure Information Protection app selected](./media/terms-of-use/cloud-app-info-protection.png)

### Microsoft Intune Enrollment

You can configure a Conditional Access policy for the Microsoft Intune Enrollment app and require a terms of use prior to the enrollment of a device in Intune. For more information, see the Read [Choosing the right Terms solution for your organization blog post](https://go.microsoft.com/fwlink/?linkid=2010506&clcid=0x409).

![Cloud apps pane with Microsoft Intune app selected](./media/terms-of-use/cloud-app-intune.png)

> [!NOTE]
> The Intune Enrollment app is not supported for [Per-device terms of use](#per-device-terms-of-use).

## Frequently asked questions

**Q: How do I see when/if a user has accepted a terms of use?**<br />
A: On the Terms of use blade, click the number under **Accepted**. You can also view or search the accept activity in the Azure AD audit logs. For more information, see View report of who has accepted and declined and [View Azure AD audit logs](#view-azure-ad-audit-logs).

**Q: How long is information stored?**<br />
A: The user counts in the terms of use report and who accepted/declined are stored for the life of the terms of use. The Azure AD audit logs are stored for 30 days.

**Q: Why do I see a different number of consents in the terms of use report vs. the Azure AD audit logs?**<br />
A: The terms of use report is stored for the lifetime of that terms of use, while the Azure AD audit logs are stored for 30 days. Also, the terms of use report only displays the users current consent state. For example, if a user declines and then accepts, the terms of use report will only show that user's accept. If you need to see the history, you can use the Azure AD audit logs.

**Q: If I edit the details for a terms of use, does it require users to accept again?**<br />
A: No, if an administrator edits the details for a terms of use (name, display name, require users to expand, or add a language), it does not require users to reaccept the new terms.

**Q: Can I update an existing terms of use document?**<br />
A: Currently, you can't update an existing terms of use document. To change a terms of use document, you will have to create a new terms of use instance.

**Q: If hyperlinks are in the terms of use PDF document, will end users be able to click them?**<br />
A: The PDF is rendered by default as a JPEG, so hyperlinks are not clickable. Users have the option to select **Having trouble viewing? Click here**, which renders the PDF natively where hyperlinks are supported.

**Q: Can a terms of use support multiple languages?**<br />
A: Yes. Currently there are 108 different languages an administrator can configure for a single terms of use. An administrator can upload multiple PDF documents and tag those documents with a corresponding language (up to 108). When end users sign in, we look at their browser language preference and display the matching document. If there is no match, we will display the default document, which is the first document that is uploaded.

**Q: When is the terms of use triggered?**<br />
A: The terms of use is triggered during the sign-in experience.

**Q: What applications can I target a terms of use to?**<br />
A: You can create a Conditional Access policy on the enterprise applications using modern authentication. For more information, see [enterprise applications](./../manage-apps/view-applications-portal.md).

**Q: Can I add multiple terms of use to a given user or app?**<br />
A: Yes, by creating multiple Conditional Access policies targeting those groups or applications. If a user falls in scope of multiple terms of use, they accept one terms of use at a time.

**Q: What happens if a user declines the terms of use?**<br />
A: The user is blocked from getting access to the application. The user would have to sign in again and accept the terms in order to get access.

**Q: Is it possible to unaccept a terms of use that was previously accepted?**<br />
A: You can [review previously accepted terms of use](#how-users-can-review-their-terms-of-use), but currently there isn't a way to unaccept.

**Q: What happens if I'm also using Intune terms and conditions?**<br />
A: If you have configured both Azure AD terms of use and [Intune terms and conditions](/intune/terms-and-conditions-create), the user will be required to accept both. For more information, see the [Choosing the right Terms solution for your organization blog post](https://go.microsoft.com/fwlink/?linkid=2010506&clcid=0x409).

**Q: What endpoints does the terms of use service use for authentication?**<br />
A: Terms of use utilizes the following endpoints for authentication: https://tokenprovider.termsofuse.identitygovernance.azure.com and https://account.activedirectory.windowsazure.com. If your organization has an allow list of URLs for enrollment, you will need to add these endpoints to your allow list, along with the Azure AD endpoints for sign in.

## Next steps

- [Quickstart: Require terms of use to be accepted before accessing cloud apps](require-tou.md)
- [Best practices for Conditional Access in Azure Active Directory](best-practices.md)
