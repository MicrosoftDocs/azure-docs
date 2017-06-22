---
title: Azure Active Directory Reporting FAQ | Microsoft Docs
description: Azure Active Directory reporting FAQ.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila

ms.assetid: 534da0b1-7858-4167-9986-7a62fbd10439
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/16/2017
ms.author: markvi

---
# Azure Active Directory reporting FAQ

This article includes answers to frequently asked questions (FAQs) about Azure Active Directory reporting.  
For more details, see [Azure Active Directory reporting](active-directory-reporting-azure-portal.md). 

**Q: What is the data retention for activity logs (Audit and Sign-ins) in the Azure portal?** 

**A:** We provide 7 days of data for our free customers and by switching to an Azure AD Premium 1 or Premium 2 license, you can access data for up to 30 days. For more details on retention, see [Azure Active Directory report retention policies](active-directory-reporting-retention.md)

--- 

**Q: How long does it take until I can see the Activity data after I have completed my task?**

**A:** Audit activity logs have a latency ranging from 15 mins to an hour. Sign-in activity logs have a latency ranging from 15 mins for most records and up to 2 hours for a few records.

---

**Q: Do I need to be a global admin to see the activity logs in the Azure Portal or to get data through the API?**

**A:** No. You can either be a **Security Reader**, a **Security Admin** or a **Global Admin** to see reporting data in Azure Portal or by accessing it through the API.

---

**Q: Can I get Office 365 activity log information through the Azure portal?**

**A:** Even though Office 365 activity and Azure AD activity logs share a lot of the directory resources, if you want a full view of the Office 365 activity logs, you should go to the Office 365 Admin Center to get Office 365 Activity log information.

---


**Q: Which APIs do I use to get information about Office 365 Activity logs?**

**A:** Use the Office 365 Management APIs to access the [Office 365 Activity logs through an API](https://msdn.microsoft.com/office-365/office-365-managment-apis-overview).

---

**Q: How many records I can download from Azure portal?**

**A:** You can download up to 120K records from the Azure portal. The records are sorted by *most recent* and by default, you get the most recent 120K records. 

---

**Q: How many records can I query through the activities API?**

**A:** You can query up to 1 million records (if you don’t use the top operator, which sorts the record by most recent). If you do use the “top” operator, you can query up to 500K records. You can find sample queries on how to use the API here [here](active-directory-reporting-api-getting-started.md).

---

**Q: How do I get a premium license?**

**A:** See [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md) for an answer to this question.

---

**Q: How soon should I see activities data after getting a premium license?**

**A:** If you already have activities data as a free license, then you can see the same data. If you don’t have any data, then it will take one or two days.

---

**Q: Do I see last month's data after getting an Azure AD premium license?**

**A:**: If you have recently switched to a Premium version (including a trial version), you can see data up to 7 days initially. When data accumulates, you will see up to 30 days.

 
---

