<properties
	pageTitle="Title | Microsoft Azure"
	description="This provides a comparision of features and guidance on developing applications for Azure Government"
	services=""
	documentationCenter=""
	authors="ryansoc"
	manager=""
	editor=""/>

<tags
	ms.service="multiple"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="azure-government"
	ms.date="10/29/2015"
	ms.author="ryansoc"/>


#  Virtual Networks

The following information identifies the Azure Government boundary for Azure Virtual Networks:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| All data entered, stored, and processed in Azure Virtual Networks can contain Regulated/controlled data. You can transmit Regulated/controlled data in clear text across the network within your Azure Virtual Private Network.  You can transmit Azure Government-regulated data in clear text across your Azure VPN tunnels, or Azure Virtual Gateways, assuming the destination endpoints are Azure Government compliant. | Azure Virtual Networks metadata is not permitted to contain export controlled data. This metadata includes all configuration data entered when creating and maintaining your VPN or VPN gateways.  Do not enter Regulated/controlled data into the following fields: Network security group names, Deployment names  

Virtual Network is generally available in Azure Government.

For additional information, please see the <a href=https://azure.microsoft.com/en-us/documentation/services/virtual-network/> Azure Virtual Networks public documentation </a>.

For supplemental information and updates please subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
