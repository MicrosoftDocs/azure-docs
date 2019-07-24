---
title: Deploy secure applications on Microsoft Azure
description: This article discusses best practices to consider during the release and response phases of your web application project.
author: TerryLanfear
manager: barbkess
ms.author: terrylan
ms.date: 06/12/2019
ms.topic: article
ms.service: security
services: azure

ms.assetid: 521180dc-2cc9-43f1-ae87-2701de7ca6b8
ms.devlang: na
ms.tgt_pltfrm: na
ms.workload: na
---

# Deploy secure applications on Azure
In this article we present security activities and controls to consider when you deploy applications for the cloud. Security questions and concepts to consider during the release and response phases of the Microsoft [Security Development Lifecycle
(SDL)](https://msdn.microsoft.com/library/windows/desktop/84aed186-1d75-4366-8e61-8d258746bopq.aspx) are covered. The goal is to help you define activities and Azure services that you can use to deploy a more secure application.

The following SDL phases are covered in this article:

- Release
- Response

## Release
The focus of the release phase is readying a project for public release.
This includes planning ways to effectively perform post-release
servicing tasks and address security vulnerabilities that might occur
later.

### Check your application’s performance before you launch

Check your application's performance before you launch it or deploy
updates to production. Run cloud-based [load
tests](https://www.visualstudio.com/docs/test/performance-testing/getting-started/getting-started-with-performance-testing)
by using Visual Studio to find performance problems in your application,
improve deployment quality, make sure that your application is always up
or available, and that your application can handle traffic for your
launch.

### Install a web application firewall

Web applications are increasingly targets of malicious attacks that
exploit common known vulnerabilities. Common among these exploits are
SQL injection attacks and cross-site scripting attacks. Preventing these
attacks in application code can be challenging. It might require
rigorous maintenance, patching, and monitoring at many layers of the
application topology. A centralized WAF helps make security management
simpler. A WAF solution can also react to a security threat by patching
a known vulnerability at a central location versus securing each
individual web application.

The [Azure Application Gateway
WAF](https://docs.microsoft.com/azure/application-gateway/waf-overview)
provides centralized protection of your web applications from common
exploits and vulnerabilities. The WAF is based on rules from the [OWASP
core rule
sets](https://www.owasp.org/index.php/Category:OWASP_ModSecurity_Core_Rule_Set_Project)
3.0 or 2.2.9.

### Create an incident response plan

Preparing an incident response plan is crucial to help you address new
threats that might emerge over time. Preparing an incident response plan
includes identifying appropriate security emergency contacts and
establishing security servicing plans for code that's inherited from
other groups in the organization and for licensed third-party code.

### Conduct a final security review

Deliberately reviewing all security activities that were performed helps
ensure readiness for your software release or application. The final
security review (FSR) usually includes examining threat models, tools
outputs, and performance against the quality gates and bug bars that
were defined in the requirements phase.

### Certify release and archive

Certifying software before a release helps ensure that security and
privacy requirements are met. Archiving all pertinent data is essential
for performing post-release servicing tasks. Archiving also helps lower
the long-term costs associated with sustained software engineering.

## Response
The response post-release phase centers on the development team being
able and available to respond appropriately to any reports of emerging
software threats and vulnerabilities.

### Execute the incident response plan

Being able to implement the incident response plan instituted in the
release phase is essential to helping protect customers from software
security or privacy vulnerabilities that emerge.

### Monitor application performance

Ongoing monitoring of your application after it's deployed potentially
helps you detect performance issues as well as security vulnerabilities.
Azure services that assist with application monitoring are:

  - Azure Application Insights
  - Azure Security Center

#### Application Insights

[Application
Insights](https://docs.microsoft.com/azure/application-insights/app-insights-overview)
is an extensible Application Performance Management (APM) service for
web developers on multiple platforms. Use it to monitor your live web
application. Application Insights automatically detects performance
anomalies. It includes powerful analytics tools to help you diagnose
issues and understand what users actually do with your app. It's
designed to help you continuously improve performance and usability.

#### Azure Security Center

[Azure Security
Center](https://docs.microsoft.com/azure/security-center/security-center-intro)
helps you prevent, detect, and respond to threats with increased
visibility into (and control over) the security of your Azure resources,
including web applications. Azure Security Center helps detect threats
that might otherwise go unnoticed. It works with various security
solutions.

Security Center’s Free tier offers limited security for your Azure
resources only. The [Security Center Standard
tier](https://docs.microsoft.com/azure/security-center/security-center-onboarding)
extends these capabilities to on-premises resources and other clouds.
Security Center Standard helps you:

  - Find and fix security vulnerabilities.
  - Apply access and application controls to block malicious activity.
  - Detect threats by using analytics and intelligence.
  - Respond quickly when under attack.

## Next steps
In the following articles, we recommend security controls and activities that can help you design and develop secure applications.

- [Design secure applications](secure-design.md)
- [Develop secure applications](secure-develop.md)
