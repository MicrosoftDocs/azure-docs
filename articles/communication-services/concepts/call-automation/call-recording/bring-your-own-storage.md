---
title: Azure Communication Services BYOS overview
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services BYOS.
author: dbasantes
manager: seaen
services: azure-communication-services

ms.author: dbasantes
ms.date: 03/16/2023
ms.topic: conceptual
ms.service: azure-communication-services
---

# Bring your own storage (BYOS) overview

[!INCLUDE [Private Preview Disclaimer](../includes/private-preview-include-section.md)]

Bring Your Own Storage (BYOS) for Call Recording allows you to specify an Azure blob storage account for storing Call Recording files. Now with BYOS, you can manage your Call Recording files in a flexible and customizable way, eliminating the need to store your files in a built-in Azure Communication Services temporary storage and manually download and upload them to a permanent one.

BYOS enables businesses to store their data in a way that meets their compliance requirements and business needs. For example, end-users could customize their own rules and access to the data, enabling them to store or delete content whenever they need it. BYOS provides a simple and straightforward solution that eliminates the need for developers to invest time and resources in downloading and exporting files.

## Azure Managed Identities

BYOS uses [Azure Managed Identities](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview) to access user-owned resources securely. Azure Managed Identities provides an identity for the application to use when it needs to access Azure resources, eliminating the need for developers to manage credentials. This feature ensures that the data is accessed only by authorized personnel.


## Known Issues

- When using BYOS for Call Recording in [Private Preview](../includes/private-preview-include-section.md), your files will be stored in a built-in storage for 48 hours after the exporting process to your blob storage.
- Randomly you will see duplicated recording files being exported to your blob storage when using BYOS. Please make sure you delete the duplicated file to avoid extra storage costs in your storage account.


## Next steps
For more information, see the following articles:
- Learn more about BYOS, check out the [BYOS Quickstart](../../quickstarts/voice-video-calling/get-started-call-recording.md).
- Learn more about Call recording, check out the [Call Recording Quickstart](../quickstarts/voice-video-calling/get-started-call-recording.md).
- Learn more about [Call Automation](https://learn.microsoft.com/azure/communication-services/quickstarts/voice-video-calling/callflows-for-customer-interactions?pivots=programming-language-csharp).

