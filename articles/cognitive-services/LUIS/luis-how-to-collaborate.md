---
title: Collaborate with other contributors on LUIS apps - Azure Cognitive Services  | Microsoft Docs
description: Learn how to Collaborate with other contributors on Language Understanding (LUIS) applications.
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 07/31/2018
ms.author: diberry
---

# How to manage authors and collaborators 

You can collaborate with others on your LUIS app together. 

<a name="owner-and-collaborators"></a>

## Add collaborator

An app has a single author, the owner, but can have many collaborators. To allow collaborators to edit your LUIS app, you must add the email they use to access the LUIS portal to the collaborators list. Once they are added, the app shows in their LUIS portal.

1. Select **Manage** from the top right menu, then select **Collaborators** in the left menu.

2. Select **Add Collaborator** from the toolbar.

    [![](./media/luis-how-to-collaborate/add-collaborator.png "Add collaborator")](./media/luis-how-to-collaborate/add-collaborator.png#lightbox)

3. Enter the email address the collaborator uses to sign in to the LUIS portal.

    ![Add collaborator's email address](./media/luis-how-to-collaborate/add-collaborator-pop-up.png)

## Transfer of ownership

While LUIS doesn't currently support transfer of ownership, you can export your app, and another LUIS user can import the app. There may be minor differences in LUIS scores between the two applications. 

## Azure Active Directory tenant user

LUIS uses standard Azure Active Directory (Azure AD) consent flow. 

The tenant admin should work directly with the user who needs access granted to use LUIS in the Azure AD. 

First, the user signs into LUIS, and sees the pop-up dialog needing admin approval. The user contacts the tenant admin before continuing. 

Second, the tenant admin signs into LUIS, and sees a consent flow pop-up dialog. This is the dialog the admin needs to give permission for the user. Once the admin accepts the permission, the user is able to continue with LUIS.

If the tenant admin will not sign in to LUIS, the admin can access [consent](https://account.activedirectory.windowsazure.com/r#/applications) for LUIS. 

![Azure active directory permission by app website](./media/luis-how-to-collaborate/tenant-permissions.png)

If the tenant admin only wants certain users to use LUIS, refer to this [identity blog](https://blogs.technet.microsoft.com/tfg/2017/10/15/english-tips-to-manage-azure-ad-users-consent-to-applications-using-azure-ad-graph-api/).

### User accounts with multiple emails for collaborators

If you add collaborators to a LUIS app, you are specifying the exact email address a collaborator needs to use LUIS as a collaborator. While Azure Active Directory (Azure AD) allows a single user to have more than one email account used interchangeably, LUIS requires the user to sign in with the email address specified in the collaborator's list.