---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Storage accounts in Azure Media Services | Microsoft Docs
description: This article discusses how Media Services uses storage accounts. 
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 03/19/2018
ms.author: apimpm
---

# Storage accounts

When creating a Media Services account, you need to supply the ID of an Azure Storage account resource. The specified storage account is attached to your Media Services account. You can have two storage accounts associated with your Media Services account: **Primary** and **Secondary**, Media Services supports **General-purpose v2** (GPv2) or **General-purpose v1** (GPv1) accounts. However, **Blob only** accounts are not allowed as **Primary**. If you want to learn more about storage accounts, see [Azure Storage account options](../../storage/common/storage-account-options.md). 

## Next steps

> [!div class="nextstepaction"]
> [Create an account](create-account-cli-quickstart.md)
