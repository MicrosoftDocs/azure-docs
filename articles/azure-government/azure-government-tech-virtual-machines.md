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


#  Virtual Machines

The following information identifies the Azure Government boundary for Azure Virtual Machines:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Data entered, stored and processed within a VM can contain export controlled data. Binaries running within Windows Azure Virtual Machines. Static authenticators, such as passwords and smartcard PINs for access to Azure platform components. Private keys of certificates used to manage Azure platform components. SQL connection strings.  Other security information/secrets, such as certificates, encryption keys, master keys, and storage keys stored in Azure services.  | Metadata is not permitted to contain export controlled data. This metadata includes all configuration data entered when creating and maintaining your Azure Virtual Machine.  Do not enter Regulated/controlled data into the following fields:  Tenant role names, Resource groups, Deployment names, Resource names,  Resource tags  

For additional information, please see the <a href=https://azure.microsoft.com/en-us/documentation/services/virtual-machines/windows/> Azure Virtual Machines public documentation </a>.

For supplemental information and updates please subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
