---
title: Microsoft Entra data retention
description: Learn about the data retention policies for the Microsoft Entra audit, sign-in, and provisioning logs. 
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 09/08/2023
ms.author: sarahlipsey
ms.reviewer: dhanyahk
---

# Microsoft Entra data retention

In this article, you learn about the data retention policies for the different activity reports in Microsoft Entra ID. 

<a name='when-does-azure-ad-start-collecting-data'></a>

## When does Microsoft Entra ID start collecting data?

| Microsoft Entra Edition | Collection Start |
| :--              | :--   |
| Microsoft Entra ID P1 <br /> Microsoft Entra ID P2 <br /> Microsoft Entra Workload ID Premium | When you sign up for a subscription |
| Microsoft Entra ID Free| The first time you open [Microsoft Entra ID](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) or use the [reporting APIs](./overview-reports.md)  |

If you already have activities data with your free license, then you can see it immediately on upgrade. If you don’t have any data, then it will take up to three days for the data to show up in the reports after you upgrade to a premium license. For security signals, the collection process starts when you opt-in to use the **Identity Protection Center**. 

<a name='how-long-does-azure-ad-store-the-data'></a>

## How long does Microsoft Entra ID store the data?

**Activity reports**	

| Report                 | Microsoft Entra ID Free | Microsoft Entra ID P1 | Microsoft Entra ID P2 |
| :--                    | :--           | :--                 | :--                 |
| Audit logs             | Seven days        | 30 days             | 30 days             |
| Sign-ins               | Seven days        | 30 days             | 30 days             |
| Microsoft Entra multifactor authentication usage        | 30 days       | 30 days             | 30 days             |

You can retain the audit and sign-in activity data for longer than the default retention period outlined in the previous table by routing it to an Azure storage account using Azure Monitor. For more information, see [Archive Microsoft Entra logs to an Azure storage account](quickstart-azure-monitor-route-logs-to-storage-account.md).

**Security signals**

| Report         | Microsoft Entra ID Free | Microsoft Entra ID P1 | Microsoft Entra ID P2 |
| :--            | :--           | :--                 | :--                 |
| Risky users    | No limit      | No limit            | No limit            |
| Risky sign-ins | 7 days        | 30 days             | 90 days             |

> [!NOTE]
> Risky users and workload identities are not deleted until the risk has been remediated.
## Can I see last month's data after getting a premium license?

**No**, you can't. Azure stores up to seven days of activity data for a free version. When you switch from a free to a premium version, you can only see up to 7 days of data.

## Next steps

- [Stream logs to an event hub](tutorial-azure-monitor-stream-logs-to-event-hub.md)
- [Learn how to download Microsoft Entra logs](howto-download-logs.md)
