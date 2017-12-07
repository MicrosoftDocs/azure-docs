---
title: How to activate or deactivate a role | Microsoft Docs
description: Learn how to activate roles for privileged identities with the Azure Privileged Identity Management application.
services: active-directory
documentationcenter: ''
author: billmath
manager: femila
editor: ''

ms.assetid: 1ce9e2e7-452b-4f66-9588-0d9cd2539e45
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/14/2017
ms.author: billmath
ms.custom: pim
---
# How to activate or deactivate roles in Azure AD Privileged Identity Management
Azure Active Directory (AD) Privileged Identity Management simplifies how enterprises manage privileged access to resources in Azure AD and other Microsoft online services like Office 365 or Microsoft Intune.  

If you have been made eligible for an administrative role, that means you can activate that role when you need to perform privileged actions. For example, if you occasionally manage Office 365 features, your organization's privileged role administrators may not make you a permanent Global Administrator, since that role impacts other services, too. Instead, they make you eligible for Azure AD roles such as Exchange Online Administrator. You can request to activate that role when you need its privileges, and then you'll have admin control for a predetermined time period.

This article is for admins who need to activate their role in Azure AD Privileged Identity Management (PIM). It walks you through the steps to activate a role when you need the permissions, and deactivate the role when you're done. In addition, privileged role administrators can require approval to activate a role (Preview). Learn more about [PIM Approval Workflows](./privileged-identity-management/azure-ad-pim-approval-workflow.md) here.

## Add the Privileged Identity Management application
Use the Azure AD Privileged Identity Management application in the [Azure portal](https://portal.azure.com/) to request a role activation, even if you're going to operate in another portal or PowerShell. If you don't have the Azure AD Privileged Identity Management application on your Azure portal, follow these steps to get started.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select your username in the upper right-hand corner of the Azure portal, and select the directory where you will you be operating.
3. Select **More services** and use the Filter textbox to search for **Azure AD Privileged Identity Management**.
4. Check **Pin to dashboard** and then click **Create**. The Privileged Identity Management application opens.

## Activate a role
When you need to take on a role, you can request activation by selecting the **My Roles** navigation option in the Azure AD Privileged Identity Management application's left navigation column.

1. Sign in to the [Azure portal](https://portal.azure.com/) and select the Azure AD Privileged Identity Management tile.
2. Select **My Roles**. A list of your assigned eligible roles appear in the grouping at the top of the page.
3. Select a role to activate.
4. Select **Activate**. The **Request role activation** blade appears.
5. Some roles require Multi-Factor Authentication (MFA) before you can activate the role. You only have to authenticate once per session.
   
    ![Verify with MFA before role activation - screenshot][2]
6. Enter the reason for the activation request in the text field.  Some roles require you to supply a trouble ticket number.
7. Select **OK**.  If the role does not require approval, it is now activated, and the role appears in the list of active roles (directly below the list of eligible role assignments). If the [role requires approval](./privileged-identity-management/azure-ad-pim-approval-workflow.md) to activate, a toast notification will briefly appear in the upper right-hand corner of your browser informing you the request is pending approval.

    ![Request pending notification - screenshot][3]

## Deactivate a role
Once a role has been activated, it automatically deactivates when its time limit (eligible duration) is reached.

If you complete your admin tasks early, you can also deactivate a role manually in the Azure AD Privileged Identity Management application.  Select **My Roles**, choose the role you're done using from the **Active role assignments** grouping, and select **Deactivate**.  

## Cancel a pending request
In the event you do not require activation of a role that requires approval, you may cancel a pending request at any time. Simply select the **My Roles** navigation option in the Azure AD Privileged Identity Management application's left navigation column.

1. Sign in to the [Azure portal](https://portal.azure.com/) and select the Azure AD Privileged Identity Management tile.
2. Select **My Roles**. A list of your assigned eligible roles appear in the grouping at the top of the page.
3. Select a role.
4. Select the **Activation is pending approval** banner on the role activation details blade.
5. Select **Cancel** at the top of the **Pending approval** blade.

   ![Cancel pending request screenshot][4]

## Next steps
If you're interested in learning more about Azure AD Privileged Identity Management, the following links have more information.

[!INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]

<!--Image references-->

[1]: ./media/active-directory-privileged-identity-management-configure/PIM_EnablePim.png
[2]: ./media/active-directory-privileged-identity-management-how-to-activate-role/PIM_activation_MFA.png
[3]: ./media/active-directory-privileged-identity-management-how-to-activate-role/PIM_Request_Pending_Toast2.png
[4]: ./media/active-directory-privileged-identity-management-how-to-activate-role/PIM_Request_Pending_Banner_Cancel.png
