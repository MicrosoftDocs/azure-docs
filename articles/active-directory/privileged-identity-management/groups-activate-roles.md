---
title: Activate your group membership or ownership in Privileged Identity Management (Preview)
description: Learn how to activate your group membership or ownership in Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: amsliu
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 3/29/2023
ms.author: amsliu
ms.reviewer: ilyal
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Activate your group membership or ownership in Privileged Identity Management (preview)

In Azure Active Directory (Azure AD), part of Microsoft Entra, you can use Privileged Identity Management (PIM) to have just-in-time membership in the group or just-in-time ownership of the group.

This article is for eligible members or owners who want to activate their group membership or ownership in PIM.

>[!IMPORTANT]
>When a group membership or ownership is activated, Azure AD PIM temporarily adds an active assignment. Azure AD PIM creates an active assignment (adds user as member or owner of the group) within seconds. When deactivation (manual or through activation time expiration) happens, Azure AD PIM removes user’s group membership or ownership within seconds as well.
>
>Application may provide access to users based on their group membership. In some situations, application access may not immediately reflect the fact that user was added to the group or removed from it. If application previously cached the fact that user is not member of the group – when user tries to access application again, access may not be provided. Similarly, if application previously cached the fact that user is member of the group – when group membership is deactivated, user may still get access. Specific situation depends on the application’s architecture. For some applications, signing out and signing back in may help to get access added or removed.

## Activate a role

When you need to take on a group membership or ownership, you can request activation by using the **My roles** navigation option in PIM.

1. [Sign in to the Azure portal](https://portal.azure.com).

1. Select **Azure AD Privileged Identity Management -> My roles -> Groups (Preview)**.
    >[!NOTE]
    > You may also use this [short link](https://aka.ms/pim) to open the **My roles** page directly.

1. Using **Eligible assignments** blade, review the list of groups that you have eligible membership or ownership for.

    :::image type="content" source="media/pim-for-groups/pim-group-6.png" alt-text="Screenshot of the list of groups that you have eligible membership or ownership for." lightbox="media/pim-for-groups/pim-group-6.png":::

1. Select **Activate** for the eligible assignment you want to activate.

1. Depending on the group’s setting, you may be asked to provide multi-factor authentication or another form of credential.

1. If necessary, specify a custom activation start time. The membership or ownership is to be activated only after the selected time.

1. Depending on the group’s setting, justification for activation may be required. If required, provide it in the **Reason** box.

    :::image type="content" source="media/pim-for-groups/pim-group-7.png" alt-text="Screenshot of where to provide a justification in the Reason box." lightbox="media/pim-for-groups/pim-group-7.png":::

1.	Select **Activate**.

If the [role requires approval](pim-resource-roles-approval-workflow.md) to activate, an Azure notification appears in the upper right corner of your browser informing you the request is pending approval.

## View the status of your requests

You can view the status of your pending requests to activate. It is specifically important when your requests undergo approval of another person.

1. [Sign in to the Azure portal](https://portal.azure.com).

1. Select **Azure AD Privileged Identity Management -> My requests -> Groups (Preview)**. 

1. Review list of requests.

    :::image type="content" source="media/pim-for-groups/pim-group-8.png" alt-text="Screenshot of where to review the list of requests." lightbox="media/pim-for-groups/pim-group-8.png":::


## Cancel a pending request

1. [Sign in to the Azure portal](https://portal.azure.com).

1. Select **Azure AD Privileged Identity Management -> My requests -> Groups (Preview)**. 

    :::image type="content" source="media/pim-for-groups/pim-group-8.png" alt-text="Screenshot of where to select the request you want to cancel." lightbox="media/pim-for-groups/pim-group-8.png":::

1. For the request that you want to cancel, select **Cancel**.

When you select **Cancel**, the request will be canceled. To activate the role again, you will have to submit a new request for activation.

## Next steps

- [Approve activation requests for group members and owners (preview)](groups-approval-workflow.md)

