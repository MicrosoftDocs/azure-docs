---
title: Penetration testing | Microsoft Docs
description: The article provides an overview of the penetration testing process and how to perform a pen test against your app running in Azure infrastructure.
services: security
author: msmbaldwin
ms.assetid: 695d918c-a9ac-4eba-8692-af4526734ccc
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 05/15/2026
ms.author: mbaldwin
---

# Penetration testing

Penetration testing your applications is an important part of running them on Azure. You don't need Microsoft's pre-approval to do it, but you do need to follow the published rules. This article summarizes those rules and points you at the authoritative sources.

As of June 15, 2017, Microsoft no longer requires pre-approval to conduct a penetration test against Azure resources. This process is only related to Microsoft Azure, and not applicable to any other Microsoft Cloud Service.

> [!IMPORTANT]
> Notification is no longer required, but customers and authorized third parties must comply with the [Microsoft Cloud Unified Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement). The rules of engagement (ROE) are the authoritative source; this article is a summary.

## Who can test

You can perform penetration testing on Azure resources you own. Third parties (such as managed security service providers, consulting firms, and red teams) can also test, provided they have explicit written authorization from the resource owner. Document that authorization in your service agreement before any testing begins. Microsoft doesn't grant authorization on the customer's behalf.

If you're using Azure as the **source** of the testing activity (for example, running pen-test or red-team tooling from Azure VMs or Functions against systems hosted elsewhere), the ROE still applies to you, and your use of Azure remains subject to your subscription terms. The ROE specifically prohibits using Microsoft services to perform phishing or other social engineering attacks against others.

## Permitted testing

You can perform penetration testing on Azure-hosted applications and services without prior approval. Examples include:

* Your endpoints hosted on Azure Virtual Machines
* Azure App Service applications (Web Apps, API Apps, Mobile Apps)
* Azure Functions and API endpoints
* Azure Websites
* Any other Azure services where you own or have explicit authorization to test the deployed resources

Standard tests you can perform include:

* Tests on your endpoints to uncover the [Open Web Application Security Project (OWASP) top 10 vulnerabilities](https://owasp.org/www-project-top-ten/)
* Dynamic Application Security Testing (DAST) of your web applications and APIs
* [Fuzz testing](https://www.microsoft.com/research/blog/a-brief-introduction-to-fuzzing-and-why-its-an-important-tool-for-developers/) of your endpoints
* [Port scanning](https://en.wikipedia.org/wiki/Port_scanner) of your endpoints

This list is illustrative, not exhaustive. The [Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement) is the authoritative source for what's permitted.

The ROE also explicitly encourages activities such as creating test accounts or trial tenants for cross-account or cross-tenant testing scenarios, generating traffic to test surge capacity within your own applications, testing your tenant's security monitoring and detection systems, evaluating Conditional Access or Intune mobile application management (MAM) policies, attempting to break out of shared service containers like Azure Websites or Azure Functions (with responsible disclosure and immediate cessation upon success), and attempting to break out of AI system boundaries.

## Red team activities

Red-team engagements against your own Azure resources (or a customer's, with explicit written authorization) are governed by the same ROE. Within authorized scope, the ROE doesn't enumerate which adversary techniques are permitted, so the controlling text is the prohibited-activities list. Pay particular attention to these constraints, which directly affect red-team tradecraft:

* You can't use, access, or retrieve credentials or other secrets that aren't your own — including credentials leaked publicly. Within your own environment, attacking accounts you own is fine; reusing third-party credentials is not.
* If you discover a vulnerability in Microsoft's online services during a test, you must stop and report it through the Microsoft Security Response Center (MSRC). Post-exploit actions against Microsoft assets — including enumerating internal networks, dumping secrets, executing additional code, lateral movement, or pivoting beyond initial proof of concept — are prohibited.
* DDoS testing is prohibited under all circumstances. Use the DDoS simulation partners listed below instead.
* Network-intensive fuzzing or automated testing that generates excessive traffic isn't permitted.

For AI-specific red teaming against Azure AI workloads (including Azure OpenAI and Microsoft Foundry deployments), see [Planning red teaming for large language models (LLMs) and their applications](/azure/ai-foundry/openai/concepts/red-teaming) and the [Microsoft AI red team training series](/security/ai-red-team/training).

## Prohibited testing

The following activities aren't permitted regardless of authorization. This list is illustrative; the [ROE](https://www.microsoft.com/msrc/pentest-rules-of-engagement) is the authoritative source.

* [Denial of Service (DoS)](https://en.wikipedia.org/wiki/Denial-of-service_attack) testing of any kind, including tests that determine, demonstrate, or simulate DoS. DDoS attacks are strictly prohibited under all circumstances.
* Accessing, scanning, or testing Azure tenants, systems, logs, data, or storage accounts you don't own or have explicit permission to test.
* Using, accessing, or retrieving credentials or other secrets that aren't your own.
* Network-intensive fuzzing or automated testing that generates excessive traffic.
* Phishing or social engineering attacks targeting Microsoft employees, or using Microsoft services (including Azure) to perform phishing or social engineering against others.
* Post-compromise or post-exploit actions against Microsoft online services beyond initial proof of concept — for example, enumerating internal networks, dumping secrets, executing additional code, lateral movement, or pivoting.

## DDoS simulation testing

If you need to test your DDoS resilience, you can use Microsoft-approved simulation partners. These partners provide controlled DDoS simulation services that don't violate the penetration testing rules:

- [BreakingPoint Cloud](https://www.ixiacom.com/products/breakingpoint-cloud): A self-service traffic generator where your customers can generate traffic against DDoS Protection-enabled public endpoints for simulations.
- [MazeBolt](https://mazebolt.com): The RADAR™ platform continuously identifies and enables the elimination of DDoS vulnerabilities — proactively and with zero disruption to business operations.
- [Red Button](https://www.red-button.net/): Work with a dedicated team of experts to simulate real-world DDoS attack scenarios in a controlled environment.
- [RedWolf](https://www.redwolfsecurity.com/services/#cloud-ddos): A self-service or guided DDoS testing provider with real-time control.

To learn more about these simulation partners, see [testing with simulation partners](../../ddos-protection/test-through-simulations.md).

## If your testing is flagged

Azure runs automated abuse detection on outbound and inbound traffic. Legitimate testing is occasionally flagged, and the ROE notes that Microsoft may, at its discretion, interrupt activity in progress regardless of whether it's a valid test. If you receive an abuse notification for activity that complies with the ROE, respond to the notification with your customer authorization and a description of the in-scope activity. Keeping authorization documents readily accessible significantly shortens this process.

## Next steps

* Review the [Microsoft Cloud Unified Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=2).
* Report security vulnerabilities discovered during testing to the [Microsoft Security Response Center](https://msrc.microsoft.com/report/vulnerability).
