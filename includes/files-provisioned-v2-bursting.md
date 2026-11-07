---
title: "include file"
description: "include file"
services: storage
author: wmgries
ms.service: azure-file-storage
ms.topic: "include"
ms.date: 10/06/2026
ms.author: wgries
ms.custom: "include file"
---
Credit-based IOPS bursting provides added flexibility around IOPS usage. Use this flexibility as a buffer against unanticipated IO spikes. For established IO patterns, provision for IO peaks.

Burst IOPS credits accumulate whenever traffic for your file share is less than provisioned (baseline) IOPS. Whenever a file share's IOPS usage exceeds the provisioned IOPS and there are available burst IOPS credits, the file share can burst up to the maximum allowed burst IOPS limit. File shares can continue to burst as long as there are credits remaining, based on the number of burst credits accrued. Each IO beyond provisioned IOPS consumes one credit. After all credits are consumed, the share returns to the provisioned IOPS. IOPS against the file share don't have to do anything special to use bursting. Bursting operates on a best effort basis.  

Share credits have three states:

- **Accruing**, when the file share is using less than the provisioned IOPS.
- **Declining**, when the file share is using more than the provisioned IOPS and in the bursting mode.
- **Constant**, when the file share is using exactly the provisioned IOPS and there are either no credits accrued or used.

A new file share starts with the full number of credits in its burst bucket. Burst credits don't accrue if the share IOPS fall below the provisioned limit due to throttling by the server. The following formulas are used to determine the burst IOPS limit and the number of credits possible for a file share:

| Item | SSD formula | HDD formula |
|-|-|-|
| Burst IOPS limit | `MIN(MAX(3 * ProvisionedIOPS, 10000), 102400)` | `MIN(MAX(3 * ProvisionedIOPS, 5000), 50000)` |
| Burst IOPS credits | `(BurstLimit - ProvisionedIOPS) * 3600` | `(BurstLimit - ProvisionedIOPS) * 3600` |

The following table illustrates a few examples of these formulas for various provisioned IOPS amounts:

| Provisioned IOPS | SSD burst IOPS limit | SSD burst credits | HDD burst IOPS limit | HDD burst credits |
|-|-|-|-|-|
| 500 | -- | -- | Up to 5,000 | 16,200,000 |
| 1,000 | -- | -- | Up to 5,000 | 14,400,000 |
| 3,000 | Up to 10,000 | 25,200,000 | Up to 9,000 | 21,600,000 |
| 5,000 | Up to 15,000 | 36,000,000 | Up to 15,000 | 36,000,000 |
| 10,000 | Up to 30,000 | 72,000,000 | Up to 30,000 | 72,000,000 |
| 25,000 | Up to 75,000 | 180,000,000 | Up to 50,000 | 90,000,000 |
| 50,000 | Up to 102,400 | 188,640,000 | Up to 50,000 | 0 |
| 75,000 | Up to 102,400 | 98,640,000 | -- | -- |
| 102,400 | Up to 102,400 | 0 | -- | -- |
