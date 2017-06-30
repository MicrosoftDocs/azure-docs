---
title: How to use storage Explorer to delete object | Microsoft Docs
description: Shows how to use storage Explorer to delete object which prevents deletion of the storage account
services: storage
documentationcenter: ''
author: genlin
manager: willchen
editor: na
tags: storage

ms.service: storage
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/28/2017
ms.author: genli

---
# How to use Storage Explorer to delete object

You might cannot delete a storage account because of a object which prevents deletion of the storage account. This article show how to delete the object by using Microsoft Azure Storage Explorer (Preview).

To delete the object, please follow these steps:

1.	Download and Install the latest version of [Azure Storage Explorer](http://storageexplorer.com/). This tool is a standalone app from Microsoft that allows you to easily work with Azure Storage data on Windows, macOS and Linux.
2.	Open Azure Storage Explorer, select View > Account Management > Add account, select your Azure environment, and then sign in.
3.	Select all subscriptions or the subscription that contains the storage account  you want to delete.
4.	Go to the storage account, select the Blob Containers > vhds and search for the object which prevents you delete the storage account.
5.	If the object is found, right-click the object and then select Delete.

