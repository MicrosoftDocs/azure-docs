---
title: Azure AD authentication method selection tutorial 
description: In this tutorial, you will choose authentication methods to use for Azure MFA and Azure AD self-service password reset

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: tutorial
ms.date: 04/27/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: richagi, sahenry

#Customer intent: How, as an Azure AD Administrator, do I enable authentication methods
---
# Tutorial: Choosing authentication methods for your organization

In this tutorial, you will configure authentication methods, that will be used for Azure Multi-Factor Authentication (MFA) and Azure Active Directory (Azure AD) self-service password reset (SSPR). These authentication methods are used to confirm a user is who they say they are, when accessing sensitive applications, or attempting to reset their password. In this tutorial, you configure specific authentication methods to use as you progress through the set of tutorials.

> [!div class="checklist"]
> * Enable authentication methods for SSPR
> * Enable verification options for MFA

## Prerequisites

You need a working Azure AD tenant with at least a trial license enabled.
An account with Global Administrator privileges.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) using a Global Administrator account.

## Enable authentication methods for SSPR

In the Azure portal browse to **Azure Active Directory**, click on **Password Reset**, then choose **Authentication methods**.

For the purpose of this tutorial, check the boxes next to **Mobile phone** and **Office phone**.

These options allow users to either receive a phone call or allow mobile users a text message to authenticate when resetting their password.

## Enable verification options for MFA

In the Azure portal browse to **Azure Active Directory**, click on **Users**, then **Multi-Factor Authentication**.

In the new tab that opens, click on the **service settings** tab.

Under **verification options**, check the boxes next to **Call to phone** and **Text message to phone**.

These options allow users to either receive a phone call or allow mobile users a text message to authenticate when prompted by Azure Multi-Factor Authentication.

Click **Save**.

Close the **multi-factor authentication** window.

## Next steps

In this tutorial, you have enabled specific authentication methods for use in MFA and SSPR. Leave the Azure portal window open and continue to the next tutorial to configure additional settings related to MFA and SSPR before you roll out the solution in a pilot.

[Enabling SSPR at the Windows logon screen](tutorial-sspr-windows.md)

For more information about all of the configurable authentication methods, see the article [What are authentication methods?](concept-authentication-methods.md)
