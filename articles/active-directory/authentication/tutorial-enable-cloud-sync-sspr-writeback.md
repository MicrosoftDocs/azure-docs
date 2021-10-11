---
title: Enable Azure Active Directory Connect cloud sync password writeback
description: In this tutorial, you learn how to enable Azure AD self-service password reset writeback using Azure AD Connect cloud sync to synchronize changes back to an on-premises Active Directory Domain Services environment.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: tutorial
ms.date: 10/11/2021

ms.author: justinha
author: justinha
ms.reviewer: rhicock

ms.collection: M365-identity-device-management
ms.custom: contperf-fy20q4

# Customer intent: As an Azure AD Administrator, I want to learn how to enable and use password writeback so that when end-users reset their password through a web browser their updated password is synchronized back to my on-premises AD environment.
---
# Tutorial: Enable Azure Active Directory Connect cloud sync self-service password reset writeback to an on-premises environment (Preview)

Azure AD Connect cloud sync achieves hybrid identity goals by using the lightweight Azure AD cloud provisioning agent to help users send password changes in the cloud back to an on-premises Active Directory Domain Services (AD DS) environment in real time. The deployment is 

The Public Preview for Azure AD Connect cloud sync Password writeback provides the capability to writeback on-premises user password changes in the cloud to the on-premises directory in real time using the lightweight Azure AD cloud provisioning agent. 