---
title: How to create a basic group and add members using the Azure Active Directory portal | Microsoft Docs
description: Learn how to create a basic group in Azure Active Directory.
services: active-directory
author: eross-msft
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.component: fundamentals
ms.topic: quickstart
ms.date: 08/04/2017
ms.author: lizross
ms.reviewer: krbain
ms.custom: it-pro                         
---

# How to: Create a basic group and add members using the Azure Active Directory portal

You can create a basic group using the Azure Active Directory (Azure AD) portal. For the purposes of this article, a basic group is assigned to a single resource by the resource owner (administrator) and includes specific members (employees) that need to access that resource. For more complex scenarios, see ...

## To create a group
1. Sign in to the [Azure AD portal](https://portal.azure.com) using a Global administrator account for the directory.

2. Select **Azure Active Directory**, **Groups**, and then select **New group**.

    The **Group** blade opens for you to add your info.

3. Fill out the following boxes:

    - **Group type (required).** Choose a pre-defined group type. This includes:
        
        - **Security**. Gives access permissions to a group of users. For example, you can create a security group for a specific security policy. By doing it this way, you can assign permissions to all of the members at once, instead of having to add them to each member individually.
        
        - **Office 365**. This group type give its members permissions to a shared mailbox, calendar, files, SharePoint site, and more. Learn about Office 365 Groups.

    - **Group name (required).**

    - **Group description (optional).**

    - **Membership type (optional).** 
