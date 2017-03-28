---
title: Lead Management Instructions for Azure Table on Azure Marketplace  | Microsoft Docs
description: This article guides publishers step by step as to how to set up their lead management with Azure Table storage.
services: cloud-partner-portal
documentationcenter: ''
author: Bigbrd
manager: hamidm

ms.service: cloud-partner-portal
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/24/2017
ms.author: brdi
ms.robots: NOINDEX, NOFOLLOW

---

# Lead Management Instructions for Azure Table

This document provides you with instructions on how to setup your Azure Table so that Microsoft can provide you with sales leads. 

1. If you don’t have an Azure account, then please first [go create one](https://azure.microsoft.com/pricing/free-trial/).

2. Once your Azure account is ready, go log into the [Azure portal](https://portal.azure.com) and create a storage account. See screenshot below for instructions and go here to [learn more about storage pricing](https://azure.microsoft.com/pricing/details/storage/). <br/>

![Azure storage create flow image](./media/cloud-partner-portal-lead-management-instructions-azure-table/azurestoragecreate.png)

3. Next, copy the connection string for the key and paste it into the <b>Storage Account Connection String</b> field on the Cloud Partner Portal. <br/> 

![Azure storage key image](./media/cloud-partner-portal-lead-management-instructions-azure-table/azurestoragekeys.png)

  Sample final connection string: <br/>
`{"connectionString":"DefaultEndpointsProtocol=https;AccountName=leadaccount;AccountKey=ObS0EW7tDmXrC8oNeG6IRHpx2IUioBQTQynQcR/MUMqrNqQ/RC6zctP8HfucNJO+ond7dJHTROO9ziiPNspjEg=="}`

You can use [Azure storage explorer](http://azurestorageexplorer.codeplex.com/) (third party app) or any other tool to see the data in your storage table or export the data.