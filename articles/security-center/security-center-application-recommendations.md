<properties
   pageTitle="Protecting your applications in Azure Security Center  | Microsoft Azure"
   description="This document addresses recommendations in Azure Security Center that help you protect your Azure applications and stay in compliance with security policies."
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="MBaldwin"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/04/2016"
   ms.author="terrylan"/>

# Protecting your applications in Azure Security Center

Azure Security Center analyzes the security state of your Azure resources. When Security Center identifies potential security vulnerabilities, it creates recommendations that guide you through the process of configuring the needed controls.  Recommendations apply to Azure resource types: virtual machines (VMs), networking, SQL, and applications.

This article addresses recommendations that apply to applications.  Application recommendations center around deployment of a web application firewall.  Use the table below as a reference to help you understand the available application recommendations and what each one will do if you apply it.

## Available application recommendations

|Recommendation|Description|
|-----|-----|
|[Add a web application firewall](security-center-add-web-application-firewall.md)|Recommends that you deploy a web application firewall (WAF) for web endpoints. You can protect multiple web applications in Security Center by adding these applications to your existing WAF deployments. WAF appliances (created using the Resource Manager deployment model) need to be deployed to a separate virtual network. WAF appliances (created using the classic deployment model) are restricted to using a network security group. This support will be extended to a fully customized deployment of a WAF appliance (classic) in the future.|
|[Finalize application protection](security-center-add-web-application-firewall.md#finalize-application-protection)|To complete the configuration of a WAF, traffic must be rerouted to the WAF appliance. Following this recommendation will complete the necessary setup changes.|

## See also

To learn more about recommendations that apply to other Azure resource types, see the following:

- [Protecting your virtual machines in Azure Security Center](security-center-virtual-machine-recommendations.md)
- [Protecting your network in Azure Security Center](security-center-network-recommendations.md)
- [Protecting your Azure SQL service in Azure Security Center](security-center-sql-service-recommendations.md)

To learn more about Security Center, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
- [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
