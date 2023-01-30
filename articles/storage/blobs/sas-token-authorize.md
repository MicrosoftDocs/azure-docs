---
title: Authorize access to blob data with a SAS token in .NET
titleSuffix: Azure Storage
description: Learn how to use a shared access signature (SAS) token to authorize access to containers or blobs in Azure Storage.
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 01/30/2023
ms.author: tamram
ms.reviewer: nachakra
ms.subservice: blobs
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Authorize access to blob data with a SAS token in .NET

A shared access signature (SAS) token provides delegated access to resources in Azure Storage. When a user or client possesses a SAS token, they can use that token to create a client object that is authorized for access to the resource specified on the SAS.

For example, if a developer possesses a SAS that grants access to the blobs in a container, the developer may be able to upload, download, list, and configure blobs. If the developer does not possess a SAS that also enables them to create containers, then they won't be able to create containers. The permissions granted by the SAS are limited in time.

A common architecture is to have a service that generates a SAS for a user or client when needed. The service has permissions to generate a SAS, while the user or client does not.

This article describes how to consume different types of shared access signatures with the Blob Storage SDK for .NET.

## Authorize with an AzureSasCredential object

akjsldfa;

## Authorize with a SAS URI

kajsl;dfja;l

## Authorize with a SAS in a connection string

lakjsdlasfka

## See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md)
- [Create a service SAS for a container or blob](sas-service-create.md)
