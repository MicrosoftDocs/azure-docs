<properties 
	pageTitle="What is Azure Key Vault? | Overview" 
	description="Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services. By using Azure Key Vault, customers can encrypt keys and secrets (such as authentication keys, storage account keys, data encryption keys, .PFX files, and passwords) by using keys that are protected by hardware security modules (HSMs)." 
	services="key-vault" 
	documentationCenter="" 
	authors="cabailey" 
	manager="mbaldwin"/>

<tags 
	ms.service="key-vault" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/04/2015" 
	ms.author="cabailey"/>



# What is Azure Key Vault? 

## Introduction

Azure Key Vault—currently in preview—helps safeguard cryptographic keys and secrets used by cloud applications and services. By using Key Vault, you can encrypt keys and secrets (such as authentication keys, storage account keys, data encryption keys, .PFX files, and passwords) by using keys that are protected by hardware security modules (HSMs). For added assurance, you can import or generate keys in HSMs (keys never leave the HSM boundary). HSMs are certified to FIPS 140-2 level 2.  

Key Vault streamlines the key management process and enables you to maintain control of keys that access and encrypt your data. Developers can create keys for development and testing in minutes, and then seamlessly migrate them to production keys. Security administrators can grant (and revoke) permission to keys, as needed. 

Use the following table to better understand how Key Vault can help to meet the needs of developers and security administrators.





| Role        | Problem statement           | Solved by Azure Key Vault  |
| ------------- |-------------|-----|
| Developer for an Azure application      | “I want to write an application for Azure that uses keys for signing and encryption, but I want these to be external from my application so that the solution is suitable for an application that is geographically distributed. <br/><br/>I also want these keys and secrets to be protected, without having to write the code myself, and I want them to be easy for me to use from my application.” | √ Keys are stored in a vault and invoked by URI when needed.<br/><br/> √ Keys are safeguarded by Azure, using industry-standard algorithms, key lengths, and hardware security modules (HSMs).<br/><br/> √ Keys are collocated in HSMs inside the Azure datacenters, which provides better reliability and reduced latency.|
| Developer for Software as a Service (SaaS)      |“I don’t want the responsibility or potential liability for my customers’ tenant keys and secrets. <br/><br/>I want the customers to own and manage their keys so that I can concentrate on doing what I do best, which is providing the core software features.” | √ Customers can import their own keys into Azure, and manage them. When a SaaS application needs to perform cryptographic operations by using their customers’ keys, Key Vault does this on behalf of the application. The application does not see the customers’ keys.|
| Chief security officer (CSO) | “I want to know that our applications comply with FIPS 140-2 Level 2 HSMs for secure key management. <br/><br/>I want to make sure that my organization is in control of the key life cycle and can monitor key usage. <br/><br/>And although we use multiple Azure services and resources, I want to manage the keys from a single location in Azure.”     |√ HSMs are FIPS 140-2 Level 2 certified.<br/><br/>√ Key Vault is designed so that Microsoft does not see or extract your keys.<br/><br/>√ Near real-time logging of key usage (not currently available).<br/><br/>√ The vault provides a single interface, regardless of how many vaults you have in Azure, which regions they support, and which applications use them. |


Anybody with an Azure subscription can create and use key vaults. Although Key Vault benefits developers and security administrators, it could be implemented and managed by an organization’s administrator who manages other Azure services for an organization. For example, this administrator would sign in with an Azure subscription, create a vault for the organization in which to store keys, and then be responsible for operational tasks, such as:

+ Create or import a key or secret 
+ Revoke or delete a key or secret
+ Authorize users or applications to manage or use keys and secrets
+ Configure key usage (for example, sign or encrypt)
+ Monitor key usage

This administrator would then provide developers with URIs to call from their applications, and provide their security administrator with key usage logging information. **Key usage logging information is not currently available.**

   ![Overview of Azure Key Vault][1]

Developers can also manage the keys directly, by using  APIs. For more information, see [Key Vault REST API](https://msdn.microsoft.com/library/azure/dn903609.aspx) and [Key Vault C# Client API Reference](https://msdn.microsoft.com/library/azure/dn903628.aspx).

## Next Steps

For a getting started tutorial for an administrator, see [Get Started with Azure Key Vault](key-vault-get-started.md).

For more information about using keys and secrets with Azure Key Vault, see [About Keys and Secrets](https://msdn.microsoft.com/library/azure/dn903623.aspx).


<!--Image references-->
[1]: ./media/key-vault-whatis/AzureKeyVault_overview.png


