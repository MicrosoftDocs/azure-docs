---
title: Pen Testing | Microsoft Docs
description: The article provides an overview of the penetration testing (pentest) process and how perform pentest against your apps running in Azure infrastructure.
services: security
documentationcenter: na
author: TerryLanfear
manager: mbaldwin
editor: TomSh

ms.assetid: 695d918c-a9ac-4eba-8692-af4526734ccc
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/13/2018
ms.author: barclayn

---
# Pen Testing
One of the benefits of using Azure for application testing and deployment is that you can quickly get environments created.  You don’t have to worry about requisitioning, acquiring, and “racking and stacking” your own on-premises hardware.

This is great – but you still need to make sure you perform your normal security due diligence. One of the things you need to do is penetration test the applications you deploy in Azure.

You might already know that Microsoft performs [penetration testing of our Azure environment](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e). This helps drive Azure improvements.

We don’t pen test your application for you, but we do understand that you will want and need to perform pen testing on your own applications. That’s a good thing, because when you enhance the security of your applications, you help make the entire Azure ecosystem more secure.

What to do?

As of June 15, 2017, Microsoft no longer requires pre-approval to conduct a penetration tests against Azure resources. Customers who wish to formally document upcoming penetration testing engagements against Microsoft Azure are encouraged to fill out the [Azure Service Penetration Testing Notification form](https://portal.msrc.microsoft.com/en-us/engage/pentest). This process is only related to Microsoft Azure, and not applicable to any other Microsoft Cloud Service.

>[!IMPORTANT]
>While notifying Microsoft of pen testing activities is no longer required customers must still comply with the [Microsoft Cloud Unified Penetration Testing Rules of Engagement](https://technet.microsoft.com/mt784683).

Standard tests you can perform include:

* Tests on your endpoints to uncover the [Open Web Application Security Project (OWASP) top 10 vulnerabilities](https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project)
* [Fuzz testing](https://blogs.microsoft.com/cybertrust/2007/09/20/fuzz-testing-at-microsoft-and-the-triage-process/) of your endpoints
* [Port scanning](https://en.wikipedia.org/wiki/Port_scanner) of your endpoints

One type of test that you can’t perform is any kind of [Denial of Service (DoS)](https://en.wikipedia.org/wiki/Denial-of-service_attack) attack. This includes initiating a DoS attack itself, or performing related tests that might determine, demonstrate or simulate any type of DoS attack.

## Next steps

- Are you ready to get started with pen testing your applications hosted in Microsoft Azure? If so, then head on over to the [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=2) and fill out the testing notification form.
