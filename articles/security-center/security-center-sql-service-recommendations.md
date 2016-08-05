<properties
   pageTitle="Protecting Azure SQL service in Azure Security Center  | Microsoft Azure"
   description="This document addresses recommendations in Azure Security Center that help you protect Azure SQL service and stay in compliance with security policies."
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

# Protecting Azure SQL service in Azure Security Center

Azure Security Center analyzes the security state of your Azure resources. When Security Center identifies potential security vulnerabilities, it creates recommendations that guide you through the process of configuring the needed controls.  Recommendations apply to Azure resource types: virtual machines (VMs), networking, SQL, and applications.

This article addresses recommendations that apply to Azure SQL service.  Azure SQL service recommendations center around enabling auditing for Azure SQL servers and databases and enabling encryption for SQL databases.  Use the table below as a reference to help you understand the available SQL service recommendations and what each one will do if you apply it.

## Available SQL service recommendations

|Recommendation|Description|
|-----|-----|
|[Enable server SQL Auditing](security-center-enable-auditing-on-sql-servers.md)|Recommends that you turn on auditing for Azure SQL servers (Azure SQL service only; doesn't include SQL running on your virtual machines).|
|[Enable database SQL Auditing](security-center-enable-auditing-on-sql-databases.md)|Recommends that you turn on auditing for Azure SQL databases (Azure SQL service only; doesn't include SQL running on your virtual machines).|
|[Enable Transparent Data Encryption on SQL databases](security-center-enable-transparent-data-encryption.md)|Recommends that you enable encryption for SQL databases (Azure SQL service only).|

## See also

To learn more about recommendations that apply to other Azure resource types, see the following:

- [Protecting your virtual machines in Azure Security Center](security-center-virtual-machine-recommendations.md)
- [Protecting your applications in Azure Security Center](security-center-application-recommendations.md)
- [Protecting your network in Azure Security Center](security-center-network-recommendations.md)

To learn more about Security Center, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
- [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
