---
title: Reporting FAQ | Microsoft Docs
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
ms.date: 02/15/2017
ms.author: markvi

---
# Azure Active Directory reporting FAQ


**Q: What’s the data retention for Activity logs (Audit and Sign-ins) in the portal?** 

**A:** We provide 7 days of data for our free customers and by switching to an Azure AD Premium 1 or Premium 2 licenses, you can access data for up to 30 day . For more detailed information on retention, click [here](active-directory-reporting-retention.md)

--- 

**Q: How long does it take for me to see the Activity data after I have completed my task?**

**A:** See [Azure Active Directory report latencies](active-directory-reporting-latencies.md) for more details.

---

**Q: Do I nee to be a Global Admin to see the Activity logs in Azure Portal or get data through the API?**

**A:** No. You can either be a **Security Reader**, a **Security Admin** or a **Global Admin** to see reporting data in Azure Portal or access it through the API.

---

**Q: Can I get Office 365 Activity log information through the Azure Portal?**

**A:** Even though Office 365 Activity and Azure AD Activity logs share a lot of the Directory resources, if you want a full view of the Office 365 Activity logs, you should go to the Office 365 Admin center to get Office 365 Activity log information.

---


**Q: Which APIs do I use to get information about Office 365 Activity logs?**

**A:** Use Office 365 Management APIs to access the [Office 365 Activity logs through an API](https://msdn.microsoft.com/office-365/office-365-managment-apis-overview).

---

**Q: How many records I can download from Azure portal?**

**A:** You can download up to 120K records in the Azure portal. The records are sorted by most recent and by default, you will get the most recent 120K records. 

---

**Q: How many records can I query from Activities API?**

**A:** You can get up to 1 million records through programmatic access of the reporting APIs. You can find sample queries [here](active-directory-reporting-api-getting-started.md) on how to access all records using a single script.

---

**Q: How do I get premium license?**

**A:** See [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md) for more details.

---

**Q: How soon should I see activities data after getting premium license?**

**A:** If you already have activities data as a free license then you can see same data but if you don’t have any data then it will take one or two days.

---

**Q: Do I see last one month data after getting premium license?**

**A:** : If you have recently switched to a Premium version (including a trial version), you can see data up to 7 days initially. When data accumulates, you will see up to 30 days

 
---

