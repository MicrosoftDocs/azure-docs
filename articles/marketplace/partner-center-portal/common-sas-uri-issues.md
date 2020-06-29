---
title: Common SAS URI issues and fixes - Azure Marketplace
description: Common issues encountered and suggested resolutions when working with shared access signatures.
author: anbene
ms.author: mingshen
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/09/2020
---

# Common SAS URI issues and fixes

Following are common issues encountered when working with shared access signatures (which are used to identify and share the uploaded VHDs for your solution), along with suggested resolutions.

| **Issue** | **Failure Message** | **Fix** |
| --------- | ------------------- | ------- |
| *Failure in copying images* |  |  |
| "?" is not found in SAS URI | `Failure: Copying Images. Not able to download blob using provided SAS Uri.` | Update the SAS URI using recommended tools. |
| "st" and "se" parameters not in SAS URI | `Failure: Copying Images. Not able to download blob using provided SAS Uri.` | Update the SAS URI with proper **Start Date** and **End Date** values. |
| "sp=rl" not in SAS URI | `Failure: Copying Images. Not able to download blob using provided SAS Uri.` | Update the SAS URI with permissions set as `Read` and `List`. |
| SAS URI has white spaces in VHD name | `Failure: Copying Images. Not able to download blob using provided SAS Uri.` | Update the SAS URI to remove white spaces. |
| SAS URI Authorization error | `Failure: Copying Images. Not able to download blob due to authorization error.` | Review and correct the SAS URI format. Regenerate if necessary. |
| SAS URI "st" and "se" parameters do not have full date-time specification | `Failure: Copying Images. Not able to download blob due to incorrect SAS Uri.` | SAS URI **Start Date** and **End Date** parameters (`st` and `se` substrings) must have full date-time format, such as `11-02-2017T00:00:00Z`. Shortened versions are invalid (some commands in Azure CLI may generate shortened values by default). |
|  |  |  |

For details, see [Using shared access signatures (SAS)](https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/).
