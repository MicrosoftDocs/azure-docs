---
title: Release notes for Microsoft Azure Data Manager for Agriculture Preview #Required; page title is displayed in search results. Include the brand.
description: This article provides release notes for Azure Data Manager for Agriculture Preview releases, improvements, bug fixes, and known issues. #Required; article description that is displayed in search results. 
author: gourdsay #Required; your GitHub user alias, with correct capitalization.
ms.author: angour #Required; microsoft alias of author; optional team alias.
ms.service: data-manager-for-agri #Required; service per approved list. slug assigned by ACOM.
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 04/14/2023 #Required; mm/dd/yyyy format.
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Release Notes for Azure Data Manager for Agriculture Preview 

Azure Data Manager for Agriculture Preview is updated on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality
- Plans for changes

 We'll provide information on latest releases, bug fixes, & deprecated functionality for Azure Data Manager for Agriculture Preview monthly.

> [!NOTE]
> Microsoft Azure Data Manager for Agriculture is currently in preview. For legal terms that apply to features that are in beta, in preview, or otherwise not yet released into general availability, see [**Supplemental Terms of Use for Microsoft Azure Previews**](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). See Azure Data Manager for Agriculture specific terms of use [**here**](supplemental-terms-azure-data-manager-for-agriculture.md). 
>
> Microsoft Azure Data Manager for Agriculture requires registration and is available to only approved customers and partners during the preview period. To request access to Microsoft Data Manager for Agriculture during the preview period, use this [**form**](https://aka.ms/agridatamanager).

## March 2023

### Key Announcement: Preview Release
Azure Data Manager for Agriculture is now available in preview. See our blog post [here](https://azure.microsoft.com/blog/announcing-microsoft-azure-data-manager-for-agriculture-accelerating-innovation-across-the-agriculture-value-chain/).

### Audit logs
In Azure Data Manager for Agriculture Preview, you can monitor how and when your resources are accessed, and by whom. You can also debug reasons for failure for data-plane requests. [Audit Logs](how-to-set-up-audit-logs.md) are now available for your use.  

### Private links
You can connect to Azure Data Manager for Agriculture service from your virtual network via a private endpoint, which is a set of private IP addresses in a subnet within the virtual network. You can then limit access to your Azure Data Manager for Agriculture Preview instance over these private IP addresses. [Private Links](how-to-set-up-private-links.md) are now available for your use.  

### BYOL for satellite imagery
To support scalable ingestion of geometry-clipped imagery, we've partnered with Sentinel Hub by Sinergise to provide a seamless bring your own license (BYOL) experience. Read more about our satellite connector [here](concepts-ingest-satellite-imagery.md). 

## Next steps
* See the Hierarchy Model and learn how to create and organize your agriculture data  [here](./concepts-hierarchy-model.md).
* Understand our APIs [here](/rest/api/data-manager-for-agri).