<properties
   pageTitle="Protecting your network in Azure Security Center  | Microsoft Azure"
   description="This document addresses recommendations in Azure Security Center that help you protect your Azure network and stay in compliance with security policies."
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

# Protecting your network in Azure Security Center

Azure Security Center analyzes the security state of your Azure resources. When Security Center identifies potential security vulnerabilities, it creates recommendations that guide you through the process of configuring the needed controls.  Recommendations apply to Azure resource types: virtual machines (VMs), networking, SQL, and applications.

This article addresses recommendations that apply to your network.  Network recommendations center around next generation firewalls, Network Security Groups, configuring inbound traffic rules, and more.  Use the table below as a reference to help you understand the available network recommendations and what each one will do if you apply it.

## Available network recommendations

|Recommendation|Description|
|-----|-----|
|[Add a Next Generation Firewall](security-center-add-next-generation-firewall.md)|Recommends that you add a Next Generation Firewall (NGFW) from a Microsoft partner in order to increase your security protections.|
|[Route traffic through NGFW only](security-center-add-next-generation-firewall.md#route-traffic-through-ngfw-only)|Recommends that you configure network security group (NSG) rules that force inbound traffic to your VM through your NGFW.|
|[Enable Network Security Groups on subnets or virtual machines](security-center-enable-network-security-groups.md)|Recommends that you enable NSGs on subnets or VMs.|
|[Restrict access through Internet facing endpoint](security-center-restrict-access-through-internet-facing-endpoints.md)|Recommends that you configure inbound traffic rules for NSGs.|

## See also

To learn more about recommendations that apply to other Azure resource types, see the following:

- [Protecting your virtual machines in Azure Security Center](security-center-virtual-machine-recommendations.md)
- [Protecting your applications in Azure Security Center](security-center-application-recommendations.md)
- [Protecting your Azure SQL service in Azure Security Center](security-center-sql-service-recommendations.md)

To learn more about Security Center, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
- [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
