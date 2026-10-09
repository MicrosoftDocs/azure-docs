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

Burst IOPS credits accumulate whenever traffic for your classic file share is less than provisioned (baseline) IOPS. Whenever a classic file share's IOPS usage exceeds the provisioned IOPS and there are available burst IOPS credits, the classic file share can burst up to the maximum allowed burst IOPS limit. Classic file shares can continue to burst as long as there are credits remaining, based on the number of burst credits accrued. Each IO beyond provisioned IOPS consumes one credit. After all credits are consumed, the classic file share returns to the provisioned IOPS. IOPS against the classic file share don't have to do anything special to use bursting. Bursting operates on a best effort basis.  

Share credits have three states:

- **Accruing**, when the classic file share is using less than the provisioned IOPS.
- **Declining**, when the classic file share is using more than the provisioned IOPS and in the bursting mode.
- **Constant**, when the classic file share is using exactly the provisioned IOPS and there are either no credits accrued or used.

A new classic file share starts with the full number of credits in its burst bucket. Burst credits don't accrue if the share IOPS fall below the provisioned limit due to throttling by the server. The following formulas are used to determine the burst IOPS limit and the number of credits possible for a classic file share:

| Item | Formula |
|-|-|
| Burst limit | `MIN(MAX(3 * ProvisionedStorageGiB, 10000), 102400)` |
| Burst credits | `(BurstLimit - BaselineIOPS) * 3600` |

The following table illustrates a few examples of these formulas for the provisioned sizes:

| Capacity (GiB) | Baseline IOPS | Burst IOPS | Burst credits | Throughput (MiB/sec) |
|-|-|-|-|-|
| 100 | 3,100 | Up to 10,000 | 24,840,000 | 110 |
| 500 | 3,500 | Up to 10,000 | 23,400,000 | 150 |
| 1,024 | 4,024 | Up to 10,000 | 21,513,600 | 203 |
| 5,120 | 8,120 | Up to 15,360 | 26,064,000 | 613 |
| 10,240 | 13,240 | Up to 30,720 | 62,928,000 | 1,125 |
| 33,792 | 36,792 | Up to 102,400 | 227,548,800 | 3,480 |
| 51,200 | 54,200 | Up to 102,400 | 164,880,000 | 5,220 |
| 102,400 | 102,400 | Up to 102,400 | 0 | 10,340 |
