---
title: Add a web application firewall in Azure Security Center | Microsoft Docs
description: This document shows you how to implement the Azure Security Center recommendations **Add a web application firewall** and **Finalize application protection**.
services: security-center
documentationcenter: na
author: rkarlin
manager: barbkess
editor: ''

ms.assetid: 8f56139a-4466-48ac-90fb-86d002cf8242
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/13/2018
ms.author: rkarlin

---
# Add a web application firewall in Azure Security Center
Azure Security Center may recommend that you add a web application firewall (WAF) from a Microsoft partner to secure your web applications. This document walks you through an example of how to apply this recommendation.

A WAF recommendation is shown for any public facing IP (either Instance Level IP or Load Balanced IP) that has an associated network security group with open inbound web ports (80,443).

Security Center recommends that you provision a WAF to help defend against attacks targeting your web applications on virtual machines and on external App Service Environments (ASE) deployed under the [Isolated](https://azure.microsoft.com/pricing/details/app-service/windows/) service plan. The Isolated plan hosts your apps in a private, dedicated Azure environment and is ideal for apps that require secure connections with your on-premises network, or additional performance and scale. In addition to your app being in an isolated environment, your app needs to have an external IP address load balancer. To learn more about ASE, see the [App Service Environment Documentation](../app-service/environment/intro.md).

> [!NOTE]
> This document introduces the service by using an example deployment.  This document is not a step-by-step guide.
>
>

## Implement the recommendation
1. Under **Recommendations**, select **Secure web application using web application firewall**.
   ![Secure web Application][1]
2. Under **Secure your web applications using web application firewall**, select a web application. **Add a Web Application Firewall** opens.
   ![Add a web application firewall][2]
3. You can choose to use an existing web application firewall if available or you can create a new one. In this example, there are no existing WAFs available so we create a WAF.
4. To create a WAF, select a solution from the list of integrated partners. In this example, we select **Barracuda Web Application Firewall**.
5. **Barracuda Web Application Firewall** opens providing you information about the partner solution. Select **Create**.

   ![Firewall information blade][3]

6. **New Web Application Firewall** opens, where you can perform **VM Configuration** steps and provide **WAF Information**. Select **VM Configuration**.
7. Under **VM Configuration**, you enter information required to spin up the virtual machine that runs the WAF.

   ![VM configuration][4]
   
8. Return to **New Web Application Firewall** and select **WAF Information**. Under **WAF Information**, you configure the WAF itself. Step 7 allows you to configure the virtual machine on which the WAF runs and step 8 enables you to provision the WAF itself.

## Finalize application protection
1. Return to **Recommendations**. A new entry was generated after you created the WAF, called **Finalize application protection**. This entry lets you know that you need to complete the process of actually wiring up the WAF within the Azure Virtual Network so that it can protect the application.

   ![Finalize application protection][5]

2. Select **Finalize application protection**. A new blade opens. You can see that there is a web application that needs to have its traffic rerouted.
3. Select the web application. A blade opens that gives you steps for finalizing the web application firewall setup. Complete the steps, and then select **Restrict traffic**. Security Center then does the wiring-up for you.

   ![Restrict traffic][6]

> [!NOTE]
> You can protect multiple web applications in Security Center by adding these applications to your existing WAF deployments.
>
>

The logs from that WAF are now fully integrated. Security Center can start automatically gathering and analyzing the logs so that it can surface important security alerts to you.

## Next steps
This document showed you how to implement the Security Center recommendation "Add a web application." To learn more about configuring a web application firewall, see the following:

* [Configuring a Web Application Firewall (WAF) for App Service Environment](../app-service/environment/app-service-app-service-environment-web-application-firewall.md)

To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](tutorial-security-policy.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
* [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
* [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
* [Azure Security blog](https://blogs.msdn.com/b/azuresecurity/) -- Find blog posts about Azure security and compliance.

<!--Image references-->
[1]: ./media/security-center-add-web-application-firewall/secure-web-application.png
[2]:./media/security-center-add-web-application-firewall/add-a-waf.png
[3]: ./media/security-center-add-web-application-firewall/info-blade.png
[4]: ./media/security-center-add-web-application-firewall/select-vm-config.png
[5]: ./media/security-center-add-web-application-firewall/finalize-waf.png
[6]: ./media/security-center-add-web-application-firewall/restrict-traffic.png
