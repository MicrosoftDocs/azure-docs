---
title: Gather remote diagnostics
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to gather remote diagnostics for a site using the Azure portal. 
author: James-Green-Microsoft
ms.author: jamesgreen
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/09/2022
ms.custom: template-how-to
---

# Gather diagnostics using the Azure portal

> [!IMPORTANT]
> Diagnostics packages may contain *personally identifiable information (PII)*. During this procedure, when providing the diagnostics package's SAS URI to Azure support, you are explicitly giving Azure support permission to access the diagnostics package and any PII that it contains.

In this how-to guide, you'll learn how to gather a remote diagnostics package for an AP5GC site using the Azure portal. The diagnostics package can be provided, as a SAS URI, to AP5GC support to assist you with issues.

## Prerequisites

- You must already have a storage account blob that is configured for diagnostics storage.
- You must already have a user assigned managed identity with write access to the diagnostics storage account blob.

## Gather diagnostics for a site

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to site overview page for the site you want to gather diagnostics for.
1. Select **Generate diagnostics package**. This will open a **Generate diagnostics package** side panel.
1. Enter the **Storage account blob URL** that was configured for diagnostics storage.
1. Select **Proceed**.
1. AP5GC online service will generate a package and upload it to the provided storage account URL. Once it reports that it has succeeded, proceed.
1. Report the SAS URI to Azure support. Azure support will access the diagnostics using the provided SAS URI and provide support.

## Troubleshooting

- If diagnostics file collection fails, an activity log will appear in the portal allowing you to troubleshoot via ARM:
  - If an invalid storage account blob URL was passed, the request will be rejected and report **400 Bad Request**. Repeat the process with the correct storage account blob URL.
  - If the asynchronous part of the operation fails, the asynchronous operation resource is set to **Failed** and reports a failure reason.
- If this does not resolve the issue, share the correlation ID of the failed request with AP5GC support for investigation.

## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)