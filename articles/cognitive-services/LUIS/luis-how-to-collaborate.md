---
title: Collaborate with other contributors on LUIS apps in Azure | Microsoft Docs
description: Learn how to Collaborate with other contributors on Language Understanding (LUIS) applications.
services: cognitive-services
author: v-geberr
manager: kaiqb 

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 02/27/2018
ms.author: v-geberr;
---

# Collaborate with others on Language Understanding (LUIS) apps  

You can collaborate with others and work on your LUIS app together. 

## Owner and collaborators
An app has a single owner but can have many collaborators. 

## Collaborator permissions
A collaborator has all the permissions of the owner, including deleting the app. 

> [!CAUTION]
> A collaborator should [export](#export-app) the app, as a backup, before deleting it. 

## Add collaborator

To allow collaborators to edit your LUIS app, on the **Settings** page of your LUIS app, enter the email of the collaborator and click **Add collaborator**.

![Add collaborator](./media/luis-how-to-collaborate/add-collaborator.png)

* Collaborators can sign in and edit your LUIS app at the same time you are working on the app. <!--If a collaborator edits the LUIS app, you see a notification at the top of the browser.-->

> [!NOTE]
> Collaborators cannot add other collaborators.

### Transfer of ownership
While LUIS doesn't currently support transfer of ownership, you can export your app, and another LUIS user can import the app. There may be minor differences in LUIS scores between the two applications. 
