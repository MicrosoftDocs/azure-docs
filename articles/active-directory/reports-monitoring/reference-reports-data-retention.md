---
title: Azure Active Directory data retention
description: Learn how long Azure Active Directory stores the various types of reporting data. 
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 02/03/2023
ms.author: sarahlipsey
ms.reviewer: dhanyahk

ms.collection: M365-identity-device-management
---
# Azure Active Directory data retention

In this article, you learn about the data retention policies for the different activity reports in Azure Active Directory (Azure AD). 

## When does Azure AD start collecting data?

| Azure AD Edition | Collection Start |
| :--              | :--   |
| Azure AD Premium P1 <br /> Azure AD Premium P2 | When you sign up for a subscription |
| Azure AD Free| The first time you open [Azure Active Directory](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) or use the [reporting APIs](./overview-reports.md)  |

If you already have activities data with your free license, then you can see it immediately on upgrade. If you don’t have any data, then it will take up to three days for the data to show up in the reports after you upgrade to a premium license. For security signals, the collection process starts when you opt-in to use the **Identity Protection Center**. 

## How long does Azure AD store the data?

**Activity reports**	

| Report                 | Azure AD Free | Azure AD Premium P1 | Azure AD Premium P2 |
| :--                    | :--           | :--                 | :--                 |
| Audit logs             | Seven days        | 30 days             | 30 days             |
| Sign-ins               | Seven days        | 30 days             | 30 days             |
| Azure AD MFA usage        | 30 days       | 30 days             | 30 days             |

You can retain the audit and sign-in activity data for longer than the default retention period outlined in the previous table by routing it to an Azure storage account using Azure Monitor. For more information, see [Archive Azure AD logs to an Azure storage account](quickstart-azure-monitor-route-logs-to-storage-account.md).

**Security signals**

| Report         | Azure AD Free | Azure AD Premium P1 | Azure AD Premium P2 |
| :--            | :--           | :--                 | :--                 |
| Risky users    | No limit      | No limit            | No limit            |
| Risky sign-ins | 7 days        | 30 days             | 90 days             |

> [!NOTE]
> Risky users are not deleted until the risk has been remediated.

## Can I see last month's data after getting an Azure AD premium license?

**No**, you can't. Azure stores up to seven days of activity data for a free version. When you switch from a free to a premium version, you can only see up to 7 days of data.

## Next steps

- [Stream logs to an event hub](tutorial-azure-monitor-stream-logs-to-event-hub.md)
- [Learn how to download Azure AD logs](howto-download-logs.md)
