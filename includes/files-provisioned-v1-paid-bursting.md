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
Paid bursting is an advanced feature of the provisioned v1 model designed to support customers who never want to be throttled. Paid bursting adds extra usage-based billing for any amount of IOPS or throughput above the provisioned storage. This feature is distinct from credit-based bursting, which is included for free as part of provisioned storage. While paid bursting can add powerful flexibility to how you provision your classic file share, it can also lead to unexpected billing if used incorrectly.

Like credit-based bursting, paid bursting isn't a replacement for provisioning the correct amount of IOPS and throughput. Rather, it provides further protection against throttling if you run into unexpected demand. If you have a consistent level of IOPS or throughput usage, it's cheaper to provision enough IOPS and throughput (through storage provisioning) to cover demand instead of relying on paid bursting.

Paid bursting is disabled by default, but you can enable it by following the instructions to [change the cost and performance characteristics of a provisioned v1 classic file share](../articles/storage/files/modify-file-share.md?tabs=azure-powershell#provisioned-v1-billing-model) ( PowerShell and CLI only). If you enable paid bursting, monitor IOPS and throughput usage by using the following metrics available through Azure Monitor:

- File Share Provisioned IOPS
- File Share Provisioned Bandwidth MiB/s (throughput)
- Transactions by Max IOPS
- Bandwidth by Max MiB/sec (throughput)
- Burst Credits for IOPS (credit-based bursting)
- Paid Bursting IOS (IOs)
- Paid Bursting Bandwidth
