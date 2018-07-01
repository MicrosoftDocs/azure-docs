---
title: What's new in Azure Security Center?| Microsoft Docs
description: Learn about the latest updates to Azure Security Center.
services: security-center
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: a74b921f-4880-4c19-a653-41ecaef893d1
ms.service: security-center
ms.devlang: na
ms.topic: overview
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/01/2018
ms.author: rkarlin

---
# What's new in Azure Security Center?

## Azure Security Center release July 1,2018

-	**New overview dashboard**<br>The Azure Security Center overview dashboard was redesigned to provide cross-subscription, organizational-level reports for metrics that define your security posture, and actionable insights for improvement.<br>The redesigned dashboard also introduces two new concepts in Security Center:

    - Subscription coverage: See the status of all your subscriptions and identify the subscriptions for which you lack adequate security control. 
   
    - Policy compliance: Monitor your organization’s adherence to the security policies assigned to your resources.<br>

    For more information, see [What is Azure Security Center](security-center-intro.md).

-	**New recommendations for Identity and App services** (public preview) (Security Center standard version only)<br>Security Center expanded its coverage of identity and app services activities, as follows:

    -	**Identity recommendations**<br>By integrating with Azure AD, Security Center now provides identity recommendations to secure your Azure management app while you apply security best practices. You can monitor your identity security status from the Security Center overview dashboard and drill down to the list of all Identity issues that were detected. For more information, see [Monitor identity and access in Azure Security Center](security-center-identity-access.md). 

    -	**App services recommendations**<br>Security Center now provides PaaS services recommendations for web applications and function apps. These recommendations provide security best practices that help you maintain a secure workload. You can monitor your web-application and function-app status from the Security Center overview dashboard or drill down to the list of app-service recommendations. For more information, see [Protecting your machines and applications in Azure Security Center](security-center-virtual-machine-recommendations.md).

-	**Threat detection coverage for App Service applications** (public preview) (Security Center standard version only)<br>You can now receive Security Center alerts when threats are detected on App Service applications. For more information, see the blog article [Azure Security Center can identify attacks targeting Azure App Service applications](https://azure.microsoft.com/en-us/blog/azure-security-center-can-identify-attacks-targeting-azure-app-service-applications/). 

-	**Integration with Qualys support for Linux VMs**<br>Security Center’s vulnerability assessment is part of Security Center’s virtual machine recommendations. Security Center integrates with Qualys for vulnerability assessment recommendations. Integration is now also supported with Qualys for Linux VMs. For more information, see [Vulnerability assessment in Azure Security Center](security-center-vulnerability-assessment-recommendations.md).

-	**Additional Linux VM support**<br>Security Center support for Linux VMs now encompasses the full list of VMs supported by the Operations Management Suite. For more information and to see the full list of supported Linux VMs, see [Supported Linux operating systems](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-linux-operating-systems). 



## Next steps

- To get started with Security Center, you need a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Security Center’s Free pricing tier is enabled with your Azure subscription. To take advantage of advanced security management and threat detection capabilities, you must upgrade to the Standard pricing tier. The Standard tier is free for the first 60 days. See the [Security Center pricing page](https://azure.microsoft.com/pricing/details/security-center/) for more information.
- If you’re ready to enable Security Center Standard now, the [Quickstart: Onboard your Azure subscription to Security Center Standard](security-center-get-started.md) walks you through the steps.


