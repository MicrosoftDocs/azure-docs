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

In this how-to guide, you'll learn how to gather a remote diagnostics package for an Azure Private 5G Core (AP5GC) site using the Azure portal. The diagnostics package can be provided, as a SAS URI, to AP5GC support to assist you with issues.

## Prerequisites

- You must already have a storage account blob that is configured for diagnostics storage.
- You must already have a user assigned managed identity with write access to the diagnostics storage account blob.

## Gather diagnostics for a site

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to the **Packet Core Control Pane** overview page of the site you want to gather diagnostics for.
1. Select **Diagnostics Collection** under the **Support + Troubleshooting** section on the left side. This will open a **Diagnostics Collection** view.
1. Enter the **Storage account blob URL** that was configured for diagnostics storage. For example:
    `https://storageaccount.blob.core.windows.net/diags/diagsPackage_1.zip`
1. Select **Diagnostics collection**.
1. AP5GC online service will generate a package and upload it to the provided storage account URL. Once AP5GC reports that the upload has succeeded, report the SAS URL to Azure support.
    1. Generate a SAS URL by selecting **Generate SAS** on the blob details blade.
    1. Copy the contents of the **Blob SAS URL** field and share the URL with your support representative.
1. Azure support will access the diagnostics using the provided SAS URL and provide support based on the information.

## Troubleshooting

- If diagnostics file collection fails, an activity log will appear in the portal allowing you to troubleshoot via ARM:
  - If an invalid storage account blob URL was passed, the request will be rejected and report **400 Bad Request**. Repeat the process with the correct storage account blob URL.
  - If the asynchronous part of the operation fails, the asynchronous operation resource is set to **Failed** and reports a failure reason.
- Additionally, check that the same user-assigned identity was added to both the site and storage account.
- If this does not resolve the issue, share the correlation ID of the failed request with AP5GC support for investigation.

## Next steps

To continue to monitor your 5G core:

- [Enable log analytics](enable-log-analytics-for-private-5g-core.md)
- [Monitor log analytics](monitor-private-5g-core-with-log-analytics.md)