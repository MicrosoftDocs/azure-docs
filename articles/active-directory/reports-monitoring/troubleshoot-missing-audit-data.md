---

title: 'Troubleshoot: Missing data in the Azure Active Directory activity log  | Microsoft Docs'
description: Lists the various available reports for Azure Active Directory
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.assetid: 7cbe4337-bb77-4ee0-b254-3e368be06db7
ms.service: active-directory
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: report-monitor
ms.date: 01/15/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---

# Troubleshoot: Missing data in the Azure Active Directory activity log 


## Symptoms

I performed some actions in the Azure portal and expected to see the audit logs for those actions in the `Activity logs > Audit Logs` blade, but I can’t find them.

 ![Reporting](./media/troubleshoot-missing-audit-data/01.png)
 

## Cause

Actions don’t appear immediately in the activity logs. The table below enumerates our latency numbers for activity logs. 

| Report | &nbsp; | Latency (P95) | Latency (P99) |
| Directory audit | &nbsp; | 2 mins | 5 mins |
| Sign-in activity | &nbsp; | 2 mins | 5 mins | 

## Resolution

Wait for 15 minutes to two hours and see if the actions appear in the log. If you don’t see the logs even after two hours, please [file a support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) and we will look into it.


## Next steps

* [Azure Active Directory reporting latencies](reference-reports-latencies.md).
* [Azure Active Directory reporting FAQ](reports-faq.md).

