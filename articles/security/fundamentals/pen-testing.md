---
title: Penetration testing | Microsoft Docs
description: The article provides an overview of the penetration testing process and how to perform a pen test against your app running in Azure infrastructure.
services: security
documentationcenter: na
author: TerryLanfear
manager: rkarlin

ms.assetid: 695d918c-a9ac-4eba-8692-af4526734ccc
ms.service: security
ms.subservice: security-fundamentals
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/03/2021
ms.author: terrylan
---

# Penetration testing

One of the benefits of using Azure for application testing and deployment is that you can quickly get environments created. You don’t have to worry about requisitioning, acquiring, and “racking and stacking” your own on-premises hardware.

Quickly creating environments is great – but you still need to make sure you perform your normal security due diligence. One of the things you likely want to do is penetration test the applications you deploy in Azure.

We don’t perform penetration testing of your application for you, but we do understand that you want and need to perform testing on your own applications. That’s a good thing, because when you enhance the security of your applications you help make the entire Azure ecosystem more secure.

As of June 15, 2017, Microsoft no longer requires pre-approval to conduct a penetration test against Azure resources. This process is only related to Microsoft Azure, and not applicable to any other Microsoft Cloud Service.

>[!IMPORTANT]
>While notifying Microsoft of pen testing activities is no longer required customers must still comply with the [Microsoft Cloud Unified Penetration Testing Rules of Engagement](https://technet.microsoft.com/mt784683).

Standard tests you can perform include:

* Tests on your endpoints to uncover the [Open Web Application Security Project (OWASP) top 10 vulnerabilities](https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project)
* [Fuzz testing](https://cloudblogs.microsoft.com/microsoftsecure/2007/09/20/fuzz-testing-at-microsoft-and-the-triage-process/) of your endpoints
* [Port scanning](https://en.wikipedia.org/wiki/Port_scanner) of your endpoints

One type of pen test that you can’t perform is any kind of [Denial of Service (DoS)](https://en.wikipedia.org/wiki/Denial-of-service_attack) attack. This test includes initiating a DoS attack itself, or performing related tests that might determine, demonstrate, or simulate any type of DoS attack.

>[!Note]
>Microsoft has partnered with BreakingPoint Cloud to build an interface where you can generate traffic against DDoS Protection-enabled public IP addresses for simulations. To learn more about the BreakingPoint Cloud simulation, see [testing through simulations](../../ddos-protection/test-through-simulations.md).

## Next steps

* Learn more about the [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=2).
