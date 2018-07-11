---
title: Azure Active Directory Reporting FAQ | Microsoft Docs
description: Azure Active Directory reporting FAQ.
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman

ms.assetid: 534da0b1-7858-4167-9986-7a62fbd10439
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.component: compliance-reports
ms.date: 05/10/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---
# Azure Active Directory reporting FAQ

This article includes answers to frequently asked questions about Azure Active Directory (Azure AD) reporting. For more information, see [Azure Active Directory reporting](active-directory-reporting-azure-portal.md). 

**Q: I am using the https://graph.windows.net/&lt;tenant-name&gt;/reports/ endpoint APIs to pull Azure AD audit and integrated application usage reports into our reporting systems programmatically. What should I switch to?**

**A:** Look up the [API reference documentation](https://developer.microsoft.com/graph/) to see how you can use the new APIs to access [activity reports](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-api-getting-started-azure-portal). This endpoint has two reports (Audit and Sign-ins) which provide all the data you got in the old API endpoint. This new endpoint also has a sign-ins report with the Azure AD Premium license that you can use to get app usage, device usage, and user sign-in information.


--- 

**Q: I am using the https://graph.windows.net/&lt;tenant-name&gt;/reports/ endpoint APIs to pull Azure AD security reports (specific types of detections, such as leaked credentials or sign-ins from anonymous IP addresses) into our reporting systems programmatically. What should I switch to?**

**A:** You can use the [Identity Protection risk events API](active-directory-identityprotection-graph-getting-started.md) to access security detections through Microsoft Graph. This new format gives greater flexibility in how you can query data, with advanced filtering, field selection, and more, and standardizes risk events into one type for easier integration into SIEMs and other data collection tools. Because the data is in a different format, you can't substitute a new query for your old queries. However, [the new API uses Microsoft Graph](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/identityriskevent), which is the Microsoft standard for such APIs as O365 or Azure AD. So the work required can either extend your current MS Graph investments or help you begin your transition to this new standard platform.

--- 

**Q: What is the data retention for activity logs (Audit and Sign-ins) in the Azure portal?** 

**A:** See [for how long is the collected data stored?](active-directory-reporting-retention.md#q-for-how-long-is-the-collected-data-stored) for an answer to this question.

--- 

**Q: How long does it take until I can see the Activity data after I have completed my task?**

**A:** Audit activity logs have a latency ranging from 15 minutes to an hour. Sign-in activity logs can take from 15 minutes to up to 2 hours for some records.

---

**Q: Do I need to be a global admin to see the activity sign-ins to the Azure portal or to get data through the API?**

**A:** No. You must be a **Security Reader**, a **Security Admin**, or a **Global Admin** to get reporting data in the Azure portal or through the API.

---

**Q: Can I get Office 365 activity log information through the Azure portal?**

**A:** Even though Office 365 activity and Azure AD activity logs share a lot of the directory resources, if you want a full view of the Office 365 activity logs, you should go to the Office 365 Admin Center to get Office 365 Activity log information.

---


**Q: Which APIs do I use to get information about Office 365 Activity logs?**

**A:** Use the Office 365 Management APIs to access the [Office 365 Activity logs through an API](https://msdn.microsoft.com/office-365/office-365-managment-apis-overview).

---

**Q: How many records I can download from Azure portal?**

**A:** You can download up to 5000 records from the Azure portal. The records are sorted by *most recent* and by default, you get the most recent 5000 records.

---

**Q: How many records can I query through the activities API?**

**A:** You can query up to 1 million records (if you don’t use the top operator, which sorts the record by most recent). If you do use the “top” operator, you can query up to 500K records. You can find sample queries on how to use the API [here](active-directory-reporting-api-getting-started.md).

---

**Q: How do I get a premium license?**

**A:** See [Getting started with Azure Active Directory Premium](fundamentals/active-directory-get-started-premium.md) for an answer to this question.

---

**Q: How soon should I see activities data after getting a premium license?**

**A:** If you already have activities data as a free license, then you can see the same data. If you don’t have any data, then it will take one or two days.

---

**Q: Do I see last month's data after getting an Azure AD premium license?**

**A:** If you have recently switched to a Premium version (including a trial version), you can see data up to 7 days initially. When data accumulates, you will see up to 30 days.

---

**Q: There is a risk event in Identity Protection but I’m not seeing corresponding sign-in in the all sign-ins. Is this expected?**

**A:** Yes, Identity Protection evaluates risk for all authentication flows whether interactive or non-interactive. However, all sign-ins only report shows only the interactive sign-ins.

---

**Q: How can I download the “Users flagged for risk” report in Azure portal?**

**A:** The option to download *Users flagged for risk* report will be added soon.

---

**Q: How do I know why a sign-in or a user was flagged risky in the Azure portal?**

**A:** Premium edition customers can learn more about the underlying risk events by clicking on the user in “Users flagged for risk” or by clicking on the “Risky sign-ins”. Free and Basic edition customers get to see the at-risk users and sign-ins without the underlying risk event information.

---

**Q: How are IP addresses calculated in the sign-ins and risky sign-ins report?**

**A:** IP addresses are issued in such a way that there is no definitive connection between an IP address and where the computer with that address is physically located. This is complicated by factors such as mobile providers and VPNs issuing IP addresses from central pools often very far from where the client device is actually used. Given the above, converting IP address to a physical location is a best effort based on traces, registry data, reverse look ups and other information. 

---

**Q: What does the risk event "Sign-in with additional risk detected" signify?**

**A:** To give you an insight into all the risky sign-ins in your environment, "Sign-in with additional risk detected" functions as placeholder for sign-ins for detections that are exclusive to Azure AD Identity Protection subscribers.

---

## Frequently asked questions about Azure Active Directory logs in Azure Monitor

This section contains the frequently asked questions and known issues with Azure Active Directory logs in Azure monitor diagnostics.

**Q: Where should I start?** 

**A:** Start with the [Overview](active-directory-reporting-azure-monitor-diagnostics-overview.md) to get an idea about what you need to deploy this feature. Once you're familiar with the pre-requisites, check out the tutorials to help you configure and route your logs to Event Hubs.

---

**Q: Which logs are included?**

**A:** Both sign-ins and audit logs are available for routing through this feature, although B2C related audit events are currently not included. Read the [Audit log schema](active-directory-reporting-azure-monitor-diagnostics-audit-log-schema.md) and [Sign-in log schema](active-directory-reporting-azure-monitor-diagnostics-sign-in-log-schema.md) to find out which types of logs and which feature-based logs are currently supported. 

---

**Q: How soon after an action will the corresponding logs show up in Event Hubs?**

**A:** The logs should show up in Event Hubs anywhere between two and five minutes of performing the action. For more information about event hubs, see [What is event hubs?](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-what-is-event-hubs)

---

**Q: How soon after an action will the corresponding logs show up in storage accounts?**

**A:** For Azure storage accounts, the latency is anywhere between 5 and 15 minutes of performing the action.

---

**Q: How much will it cost to store my data?**

**A:** The storage cost depends on the size of your logs as well as the retention period you choose. For an approximate estimate of the costs for tenants depending on the volume of logs generated, check out the [Overview](active-directory-reporting-azure-monitor-diagnostics-overview.md).

---

**Q: How much will it cost to stream my data to Event Hubs?**

**A:** The streaming cost depends on the number of messages you receive per minute. Read the [Overview](active-directory-reporting-azure-monitor-diagnostics-overview.md) to learn more about how the cost is calculated as well as find an approximate estimate based on the number of messages. 

---

**Q: What SIEM tools are currently supported?** 

**A:** Currently, Azure monitor diagnostics is supported by Splunk, QRadar and Sumologic. However, Splunk is the only SIEM tools that is supported for Azure Active Directory logs. For more information on how the connectors work, see [Stream Azure monitoring data to an event hub for consumption by an external tool](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitor-stream-monitoring-data-event-hubs).

---

**Q: Can I access the data from Event Hub without using an external SIEM tool?** 

**A:** Yes, you can use the [Event Hub API](https://docs.microsoft.com/azure/event-hubs/event-hubs-dotnet-standard-getstarted-receive-eph) to access the logs from your custom application. 

---
