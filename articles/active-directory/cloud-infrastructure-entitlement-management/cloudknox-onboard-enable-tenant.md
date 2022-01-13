---
title:  Enable Microsoft CloudKnox Permissions Management on your Azure Active Directory (Azure AD) tenant
description: How to enable Microsoft CloudKnox Permissions Management on your Azure Active Directory (Azure AD) tenant.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/13/2022
ms.author: v-ydequadros
---

# Enable Microsoft CloudKnox Permissions Management on your Azure Active Directory (Azure AD) tenant

This topic describes how to enable Microsoft CloudKnox Permissions Management (CloudKnox) on your Azure Active Directory (Azure AD) tenant.


## Enable CloudKnox on your Azure AD tenant

> [!NOTE] 
> To complete this task you must have Global Administrator permissions.

1. Log in to your Azure AD tenant and select **Next**.
2. Select the **CloudKnox Permissions Management** tile.

    The **Welcome to CloudKnox Permissions Management** screen appears. 

    This screen provides information on how to enable CloudKnox on your tenant.

3. To provide access to CloudKnox first party application, create a service principle that points to CloudKnox first party application.
4. Copy the script on the **Welcome** screen, paste the script into your command-line interface (CLI), and run it.
5. When the script has run successfully, return to the **Welcome to CloudKnox** screen.
6. Select **Enable CloudKnox Permissions Management**.

    The tenant completes the onboarding process and launches CloudKnox.

## Onboard your authorization system on CloudKnox

After enabling CloudKnox on your Azure AD tenant this task, the next step is to onboard your authorization system on CloudKnox. 

Open one of the following topics and follow the instructions provided to onboard your authorization system.

- Onboard the Amazon Web Services (AWS) authorization system
- Onboard the Microsoft Azure (Azure) authorization system
- Onboard the Google Cloud Platform (GCP) authorization system

<!---Next Steps

<!---For an overview of the CloudKnox installation process, see [CloudKnox Installation overview cloud](cloudknox-installation.html).--->
