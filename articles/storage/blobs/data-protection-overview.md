---
title: Data protection overview
titleSuffix: Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.date: 01/21/2021
ms.topic: conceptual
ms.author: tamram
ms.reviewer: prishet
ms.subservice: common
---

# Data protection overview

You can configure data protection for your Azure Storage account now to prepare for scenarios where data could be compromised in the future. This guide will help you to decide which features are best for your scenario.

## Understanding data protection in Azure Storage

| If you want to... | Then Microsoft recommends using these features... |
|-|-|
| Protect your blob data from accidental or malicious deletes, without needing to reach out to Microsoft. | Container soft delete (preview)<br>Blob soft delete<br>Blob versioning<br>Point-in-time restore |
| Protect your blob data from accidental or malicious updates, without needing to reach out to Microsoft. | Blob versioning<br>Blob snapshots<br>Point-in-time restore |
| Restore all or some of your blob data to a previous point in time  | Point-in-time restore |
| Track changes to your blob data | Change feed |
| Prevent all updates and deletes for a specified period of time | Immutable blobs for Write-Once, Read-Many (WORM) workloads |

## Protecting against accidental deletion

Container/blob Soft Delete, File/Folder Soft Delete (not yet available?), PITR, Versioning

soft delete only restores 

## Protecting against accidental overwrites

PITR, Versioning, Snapshots 

## Disaster recovery

