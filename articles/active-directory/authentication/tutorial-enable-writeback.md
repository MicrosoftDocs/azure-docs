---
title: Azure AD enable password writeback 
description: In this tutorial, you will enable password writeback as part of Azure AD Connect.

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: tutorial
ms.date: 05/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: sahenry

#Customer intent: How, as an Azure AD Administrator, do I enable password writeback
---
# Tutorial: Enabling password writeback

Password writeback provides a seamless and secure mechanism to send passwords back to an existing on-premises directory from Azure Active Directory (Azure AD). Password writeback is enabled as a component of Azure AD Connect.

> [!div class="checklist"]
> * Enable password writeback option in Azure AD Connect
> * Enable self-service password reset on-premises integration in the Azure portal

## Prerequisites

* Access to a working Azure AD tenant with at least a trial license assigned.
* An account with Global Administrator privileges in your Azure AD tenant.
* An existing server configured running a current version of [Azure AD Connect](../connect/active-directory-aadconnect-get-started-express.md).
* Previous self-service password reset (SSPR) tutorials have been completed.

## Enable password writeback in Azure AD Connect

1. To configure and enable password writeback, sign in to your Azure AD Connect server and start the **Azure AD Connect** configuration wizard.
2. On the **Welcome** page, select **Configure**.
3. On the **Additional tasks** page, select **Customize synchronization options**, and then select **Next**.
4. On the **Connect to Azure AD** page, enter a global administrator credential, and then select **Next**.
5. On the **Connect directories** and **Domain/OU** filtering pages, select **Next**.
6. On the **Optional features** page, select the box next to **Password writeback** and select **Next**.
7. On the **Ready to configure** page, select **Configure** and wait for the process to finish.
8. When you see the configuration finish, select **Exit**.

## Log in to Azure

Log in to the [Azure portal](https://portal.azure.com) using a Global Administrator account.

## Enable SSPR on-premises integration

In the Azure portal browse to **Azure Active Directory**, click on **Password Reset**, then choose **On-premises integration**.

Under **Write back passwords to your on-premises directory**, choose **Yes**.
Under **Allow users to unlock accounts without resetting their password**, choose **Yes**.

## Next steps

In this tutorial, you have enabled password writeback for self-service password reset. Leave the Azure portal window open and continue to the next tutorial to configure additional settings related to self-service password reset before you roll out the solution in a pilot.

> [!div class="nextstepaction"]
> [Enabling SSPR at the Windows logon screen](tutorial-sspr-windows.md)
