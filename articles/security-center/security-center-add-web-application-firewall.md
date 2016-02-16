<properties
   pageTitle="Add a web application firewall  | Microsoft Azure"
   description="This document shows you how to implement the Azure Security Center recommendation **Add a web application firewall**."
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="StevenPo"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="02/16/2016"
   ms.author="terrylan"/>

# Add a web application firewall

Azure Security Center may recommend that you add a web application firewall from a Microsoft partner in order to secure your web applications. This document walks you through an example of how to do this.

> [AZURE.NOTE] The information in this document applies to the preview release of Azure Security Center. This document introduces the service by using an example deployment.  This is not a step-by-step guide.

## Implement the recommendation

1. In the **Recommendations** blade, select recommendation **Secure web application using web application firewall**. This opens the **Unprotected Web Applications** blade.
![][1]

2. Select a web application, the **Add a Web Application Firewall** blade opens.
3. Select **Barracuda Web Application Firewall**. A blade opens that provides you information about the **Barracuda Web Application Firewall**.

4. Click **Create** in the information blade. The **New Web Application Firewall** blade opens, where you can perform **VM Configuration** steps and provide **WAF Information**.
5. Select **VM Configuration**. In the **VM Configuration** blade you enter information required to spin up the virtual machine that will run the WAF.
![][2]
6. Return to the **New Web Application Firewall** blade and select **WAF Information**. In the **WAF Information** blade you configure the WAF itself. Step 5 allows you to configure the virtual machine on which the WAF will run and step 6 enables you to provision the WAF itself.

7. Return to the **Recommendations** blade. A new entry was generated after you created the WAF, called **Finalize web application firewall setup**. This entry lets you know that you need to complete the process of actually wiring up the WAF within the Azure Virtual Network so that it can protect the application.
![][3]

8. Select **Finalize web application firewall setup**. A new blade opens. You can see that there is a web application that needs to have its traffic rerouted.
9. Select the web application. A blade opens that gives you steps for finalizing the web application firewall setup. Complete the steps, and then click **Restrict traffic**. Security Center will then do the wiring-up for you.
![][4]

The logs from that WAF are now fully integrated. Security Center can start automatically gathering and analyzing the logs so that it can surface important security alerts to you.

## Next steps

This document showed you how to implement the Security Center recommendation "Add a web application." To learn more about configuring a web application firewall, see the following:

- [Configuring a Web Application Firewall (WAF) for App Service Environment](../app-service-web/app-service-app-service-environment-web-application-firewall.md)

To learn more about Security Center, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
- [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
- [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) -- Find blog posts about Azure security and compliance.

<!--Image references-->
[1]: ./media/security-center-recommendations/secure-web-application.png
[2]: ./media/security-center-recommendations/vm-configuration.png
[3]: ./media/security-center-recommendations/finalize-waf.png
[4]: ./media/security-center-recommendations/restrict-traffic.png
