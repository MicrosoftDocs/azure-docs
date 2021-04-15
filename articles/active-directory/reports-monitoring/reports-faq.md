---
title: Azure Active Directory Reports FAQ | Microsoft Docs
description: Frequently asked questions around Azure Active Directory reports.
services: active-directory
documentationcenter: ''
author: cawrites
manager: MarkusVi

ms.assetid: 534da0b1-7858-4167-9986-7a62fbd10439
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: report-monitor
ms.date: 05/12/2020
ms.author: markvi
ms.reviewer: dhanyahk

ms.collection: M365-identity-device-management
---

# Frequently asked questions around Azure Active Directory reports

This article includes answers to frequently asked questions about Azure Active Directory (Azure AD) reporting. For more information, see [Azure Active Directory reporting](overview-reports.md). 

## Getting started 

**Q: I currently use the `https://graph.windows.net/<tenant-name>/reports/` endpoint APIs to pull Azure AD audit and integrated application usage reports into our reporting systems programmatically. What should I switch to?**

**A:** Look up the [API reference](https://developer.microsoft.com/graph/) to see how you can [use the APIs to access activity reports](concept-reporting-api.md). This endpoint has two reports (**Audit** and **Sign-ins**) which provide all the data you got in the old API endpoint. This new endpoint also has a sign-ins report with the Azure AD Premium license that you can use to get app usage, device usage, and user sign-in information.

---

**Q: I currently use the `https://graph.windows.net/<tenant-name>/reports/` endpoint APIs to pull Azure AD security reports (specific types of detections, such as leaked credentials or sign-ins from anonymous IP addresses) into our reporting systems programmatically. What should I switch to?**

**A:** You can use the [Identity Protection risk detections API](../identity-protection/howto-identity-protection-graph-api.md) to access security detections through Microsoft Graph. This new format gives greater flexibility in how you can query data, with advanced filtering, field selection, and more, and standardizes risk detections into one type for easier integration into SIEMs and other data collection tools. Because the data is in a different format, you can't substitute a new query for your old queries. However, [the new API uses Microsoft Graph](/graph/api/resources/identityriskevent?view=graph-rest-beta&preserve-view=true), which is the Microsoft standard for such APIs as Microsoft 365 or Azure AD. So the work required can either extend your current Microsoft Graph investments or help you begin your transition to this new standard platform.

---

**Q: How do I get a premium license?**

**A:** See [Getting started with Azure Active Directory Premium](../fundamentals/active-directory-get-started-premium.md) to upgrade your Azure Active Directory edition.

---

**Q: How soon should I see activities data after getting a premium license?**

**A:** If you already have activities data as a free license, then you can see it immediately. If you don’t have any data, then it will take up to 3 days for the data to show up in the reports.

---

**Q: Can I see last month's data after getting an Azure AD premium license?**

**A:** If you have recently switched to a Premium version (including a trial version), you can see data up to 7 days initially. When data accumulates, you can see data for the past 30 days.

---

**Q: Do I need to be a global administrator to see the activity sign-ins to the Azure portal or to get data through the API?**

**A:** No, you can also access the reporting data through the portal or through the API if you are a **Security Reader** or **Security Administrator** for the tenant. Of course, **Global Administrators** will also have access to this data.

---


## Activity logs


**Q: What is the data retention for activity logs (Audit and Sign-ins) in the Azure portal?** 

**A:** For more information, see [data retention policies for Azure AD reports](reference-reports-data-retention.md).

---

**Q: How long does it take until I can see the activity data after I have completed my task?**

**A:** Audit logs have a latency ranging from 15 minutes to an hour. Sign-in activity logs can take from 15 minutes to up to 2 hours for some records.

---

**Q: Can I get Microsoft 365 activity log information through the Azure portal?**

**A:** Even though Microsoft 365 activity and Azure AD activity logs share a lot of the directory resources, if you want a full view of the Microsoft 365 activity logs, you should go to the [Microsoft 365 admin center](https://admin.microsoft.com) to get Office 365 Activity log information.

---

**Q: Which APIs do I use to get information about Microsoft 365 Activity logs?**

**A:** Use the [Microsoft 365 Management APIs](/office/office-365-management-api/office-365-management-apis-overview) to access the Microsoft 365 Activity logs through an API.

---

**Q: How many records I can download from Azure portal?**

**A:** You can download up to 5000 records from the Azure portal. The records are sorted by *most recent* and by default, you get the most recent 5000 records.

---

## Risky sign-ins

**Q: There is a risk detection in Identity Protection but I’m not seeing corresponding sign-in in the sign-ins report. Is this expected?**

**A:** Yes, Identity Protection evaluates risk for all authentication flows whether interactive or non-interactive. However, all sign-ins only report shows only the interactive sign-ins.

---

**Q: How do I know why a sign-in or a user was flagged risky in the Azure portal?**

**A:** If you have an **Azure AD Premium** subscription, you can learn more about the underlying risk detections by selecting the user in **Users flagged for risk** or by selecting a record in the **Risky sign-ins** report. If you have a **Free** or **Basic** subscription, then you can view the users at risk and risky sign-ins reports, but you cannot see the underlying risk detection information.

---

**Q: How are IP addresses calculated in the sign-ins and risky sign-ins report?**

**A:** IP addresses are issued in such a way that there is no definitive connection between an IP address and where the computer with that address is physically located. Mapping IP addresses is further complicated by factors such as mobile providers and VPNs issuing IP addresses from central pools often very far from where the client device is actually used. Currently in Azure AD reports, converting IP address to a physical location is a best effort based on traces, registry data, reverse look ups and other information. 

---

**Q: What does the risk detection "Sign-in with additional risk detected" signify?**

**A:** To give you insight into all the risky sign-ins in your environment, "Sign-in with additional risk detected" functions as placeholder for sign-ins for detections that are exclusive to Azure AD Identity Protection subscribers.

---

## Conditional Access

**Q: What's new with this feature?**

**A:** Customers can now troubleshoot Conditional Access policies through all sign-ins report. Customers can review the Conditional Access status and dive into the details of the policies that applied to the sign-in and the result for each policy.

**Q: How do I get started?**

**A:** To get started:

* Navigate to the sign-ins report in the [Azure portal](https://portal.azure.com).
* Click on the sign-in that you want to troubleshoot.
* Navigate to the **Conditional Access** tab.
Here, you can view all the policies that impacted the sign-in and the result for each policy. 
    
**Q: What are all possible values for the Conditional Access status?**

**A:** Conditional Access status can have the following values:

* **Not Applied**: This means that there was no Conditional Access policy with the user and app in scope. 
* **Success**: This means that there was a Conditional Access policy with the user and app in scope and Conditional Access policies were successfully satisfied. 
* **Failure**: The sign-in satisfied the user and application condition of at least one Conditional Access policy and grant controls are either not satisfied or set to block access.
    
**Q: What are all possible values for the Conditional Access policy result?**

**A:** A Conditional Access policy can have the following results:

* **Success**: The policy was successfully satisfied.
* **Failure**: The policy was not satisfied.
* **Not applied**: This might be because the policy conditions did not meet.
* **Not enabled**: This is due to the policy in disabled state. 
    
**Q: The policy name in the all sign-in report does not match the policy name in CA. Why?**

**A:** The policy name in the all sign-in report is based on the Conditional Access policy name at the time of the sign-in. This can be inconsistent with the policy name in CA if you updated the policy name later, that is, after the sign-in.

**Q: My sign-in was blocked due to a Conditional Access policy, but the sign-in activity report shows that the sign-in succeeded. Why?**

**A:** Currently the sign-in report may not show accurate results for Exchange ActiveSync scenarios when Conditional Access is applied. There can be cases when the sign-in result in the report shows a successful sign-in, but the sign-in actually failed due to a Conditional Access policy.
