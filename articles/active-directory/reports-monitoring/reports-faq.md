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
ms.component: report-monitor
ms.date: 05/10/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---
# Azure Active Directory reporting FAQ

This article includes answers to frequently asked questions about Azure Active Directory (Azure AD) reporting. For more information, see [Azure Active Directory reporting](overview-reports.md). 

## Getting started 

**Q: I am using the https://graph.windows.net/&lt;tenant-name&gt;/reports/ endpoint APIs to pull Azure AD audit and integrated application usage reports into our reporting systems programmatically. What should I switch to?**

**A:** Look up the [API reference documentation](https://developer.microsoft.com/graph/) to see how you can use the new APIs to access [activity reports](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-api-getting-started-azure-portal). This endpoint has two reports (Audit and Sign-ins) which provide all the data you got in the old API endpoint. This new endpoint also has a sign-ins report with the Azure AD Premium license that you can use to get app usage, device usage, and user sign-in information.

--- 

**Q: I am using the https://graph.windows.net/&lt;tenant-name&gt;/reports/ endpoint APIs to pull Azure AD security reports (specific types of detections, such as leaked credentials or sign-ins from anonymous IP addresses) into our reporting systems programmatically. What should I switch to?**

**A:** You can use the [Identity Protection risk events API](../identity-protection/graph-get-started.md) to access security detections through Microsoft Graph. This new format gives greater flexibility in how you can query data, with advanced filtering, field selection, and more, and standardizes risk events into one type for easier integration into SIEMs and other data collection tools. Because the data is in a different format, you can't substitute a new query for your old queries. However, [the new API uses Microsoft Graph](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/identityriskevent), which is the Microsoft standard for such APIs as O365 or Azure AD. So the work required can either extend your current MS Graph investments or help you begin your transition to this new standard platform.

--- 

**Q: How do I get a premium license?**

**A:** See [Getting started with Azure Active Directory Premium](../fundamentals/active-directory-get-started-premium.md) for an answer to this question.

---

**Q: How soon should I see activities data after getting a premium license?**

**A:** If you already have activities data as a free license, then you can see the same data. If you don’t have any data, then it will take one or two days.

---

**Q: Do I see last month's data after getting an Azure AD premium license?**

**A:** If you have recently switched to a Premium version (including a trial version), you can see data up to 7 days initially. When data accumulates, you will see up to 30 days.

---

**Q: Do I need to be a global admin to see the activity sign-ins to the Azure portal or to get data through the API?**

**A:** No. You must be a **Security Reader**, a **Security Admin**, or a **Global Admin** to get reporting data in the Azure portal or through the API.

---


## Activity logs


**Q: What is the data retention for activity logs (Audit and Sign-ins) in the Azure portal?** 

**A:** See [for how long is the collected data stored?](reference-reports-data-retention.md#q-for-how-long-is-the-collected-data-stored) for an answer to this question.

--- 

**Q: How long does it take until I can see the Activity data after I have completed my task?**

**A:** Audit activity logs have a latency ranging from 15 minutes to an hour. Sign-in activity logs can take from 15 minutes to up to 2 hours for some records.

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

## Risky sign-ins

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

**Q: What does the risk event "Sign-in with additional risk detected" signify?**

**A:** To give you an insight into all the risky sign-ins in your environment, "Sign-in with additional risk detected" functions as placeholder for sign-ins for detections that are exclusive to Azure AD Identity Protection subscribers.

---

## Conditional access

**Q: What's new with this feature?**

**A:** Customers can now troubleshoot conditional access policies through all sign-ins report. Customers can review the conditional access status and dive into the details of the policies that applied to the sign-in and the result for each policy.

**Q: How do I get started?**

**A:** To get started:
    * Navigate to the sign-ins report in the [Azure portal](https://portal.azure.com). 
    * Click on the sign-in that you want to troubleshoot.
    * Navigate to the **Conditional access** tab.
    Here, you can view all the policies that impacted the sign-in and the result for each policy. 
    
**Q: What are all possible values for the conditional access status?**

**A:** Conditional access status can have the following values:
    * **Not Applied**: This means that there was no CA policy with the user and app in scope. 
    * **Success**: This means that there was a CA policy with the user and app in scope and CA policies were successfully satisfied. 
    * **Failure**: This means that there was a CA policy with the user and app in scope and CA policies were not satisfied. 
    
**Q: What are all possible values for the conditional access policy result?**

**A:** A conditional access policy can have the following results:
    * **Success**: The policy was successfully satisfied.
    * **Failure**: The policy was not satisfied.
    * **Not applied**: This might be because the policy conditions did not meet.
    * **Not enabled**: This is due to the policy in disabled state. 
    
**Q: The policy name in the all sign-in report does not match the policy name in CA. Why?**

**A:** The policy name in the all sign-in report is based on the CA policy name at the time of the sign-in. This can be inconsistent with the policy name in CA if you updated the policy name later, that is, after the sign-in.

**Q: My sign-in was blocked due to a conditional access policy, but the sign-in activity report shows that the sign-in succeeded. Why?**

**A:** Currently the sign-in report may not show accurate results for Exchange ActiveSync scenarios when conditional access is applied. There can be cases when the sign-in result in the report shows a successful sign-in, but the sign-in actually failed due to a conditional access policy. 
