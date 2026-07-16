---
title: Scalability targets for premium block blob storage accounts
titleSuffix: Azure Storage
description: Learn about premium-performance block blob storage accounts. Block blob storage accounts are optimized for applications that use smaller, kilobyte-range objects.
author: normesta

ms.service: azure-blob-storage
ms.topic: concept-article
ms.date: 12/18/2019
ms.author: normesta
# Customer intent: "As a cloud architect, I want to evaluate premium block blob storage for my applications, so that I can ensure they meet high transaction rates and low-latency requirements while scaling effectively."
---

# Scalability targets for premium block blob storage accounts

A premium-performance block blob storage account is optimized for applications that use smaller, kilobyte-range objects. It's ideal for applications that require high transaction rates or consistent low-latency storage. Premium performance block blob storage is designed to scale with your applications. If your scenario requires that you deploy applications that require hundreds of thousands of requests per second or petabytes of storage capacity, contact Microsoft by submitting a support request in the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

Premium Block Blob Storage only supports block blobs. Append blobs and page blobs aren't supported in this storage tier.
Premium block blob is available only in specific Azure regions — check regional availability before planning deployment.

The service-level agreement (SLA) for Azure Storage accounts is available at [SLA for Storage Accounts](https://azure.microsoft.com/support/legal/sla/storage/v1_5/).
