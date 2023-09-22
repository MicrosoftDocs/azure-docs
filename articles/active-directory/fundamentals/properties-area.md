---
title: Add your organization's privacy info
description: Add your organization's privacy info, privacy contact, and technical contact to your directory.
services: active-directory
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
ms.date: 09/12/2023
ms.author: barclayn
ms.reviewer: bpham
---
# Add your organization's privacy info to Microsoft Entra

This article explains how an administrator can add privacy-related info to an organization's directory, through the Microsoft Entra admin center.

We strongly recommend you add both your global privacy contact and your organization's privacy statement, so your internal employees and external guests can review your policies. Because privacy statements are uniquely created and tailored for each business, we strongly recommend you contact a lawyer for assistance.

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-dsr-and-stp-note.md)]

## Add your privacy info

Your privacy and technical information is located in the **Properties** area.

### To access the properties area and add your privacy information

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a [Global Administrator](../roles/permissions-reference.md#global-administrator).

1. Browse to **Identity** > **Properties**.

   :::image type="content" source="media/properties-area/properties-area.png" alt-text="Screenshot showing the properties area highlighting the privacy info area.":::
 
1. Add your privacy info for your users:

   - **Technical contact.** Type the email address for the person to contact for technical support within your organization.
    
   - **Global privacy contact.** Type the email address for the person to contact for inquiries about personal data privacy. This person is also who Microsoft contacts if there's a data breach related to Microsoft Entra services. If there's no person listed here, Microsoft contacts your Global Administrators. For Microsoft 365 related privacy incident notifications, see [Microsoft 365 Message center FAQs](/microsoft-365/admin/manage/message-center?preserve-view=true&view=o365-worldwide#frequently-asked-questions)

   - **Privacy statement URL.** Type the link to your organization's document that describes how your organization handles both internal and external guest's data privacy.

      > [!IMPORTANT]
      > If you don't include either your own privacy statement or your privacy contact, your external guests will see text in the **Review Permissions** box that says, **<_your org name_> has not provided links to their terms for you to review**. For example, a guest user will see this message when they receive an invitation to access an organization through B2B collaboration.

      :::image type="content" source="media/properties-area/no-privacy-statement-or-contact.png" alt-text="Screenshot showing the B2B Collaboration Review Permissions box with message.":::

1. Select **Save**.

## Next steps
- [Microsoft Entra B2B collaboration invitation redemption](../external-identities/redemption-experience.md)
- [Add or change profile information for a user in Microsoft Entra ID](./how-to-manage-user-profile-info.md)
