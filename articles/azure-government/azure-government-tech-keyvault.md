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


#  Key Vault

The following information identifies the Azure Government boundary for Azure Key Vault:

Regulated/controlled data permitted:
•	All data encrypted with an Azure Key Vault key may contain Regulated/controlled data.

Regulated/controlled data not permitted:
Azure Key Vault metadata is not permitted to contain export controlled data. This metadata includes all configuration data entered when creating and maintaining your Key Vault.
Do not enter Regulated/controlled data into the following fields: 
•	Resource group names
•	Key Vault names
•	Subscription name
