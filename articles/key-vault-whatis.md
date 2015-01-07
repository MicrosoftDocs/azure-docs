<properties title="What is Azure Key Vault?" pageTitle="What is Azure Key Vault? | Overview" description="Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services. By using Azure Key Vault, customers can encrypt keys and secrets (such as authentication keys, storage account keys, data encryption keys, .PFX files, and passwords) by using keys that are protected by hardware security modules (HSMs)." metaKeywords="Azure Key Vault, Azure Key Vault Overview, access keys, passwords" services="Key-Vault" solutions="" documentationCenter="" authors="cabailey" manager="mbaldwin" videoId="" scriptId="" />

<tags ms.service="key-vault" ms.workload="identity" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/08/2015" ms.author="cabailey" />



# What is Azure Key Vault? 

Azure Key Vault—currently in Preview—helps safeguard cryptographic keys and secrets used by cloud applications and services. By using Azure Key Vault, you can encrypt keys and secrets (such as authentication keys, storage account keys, data encryption keys, .PFX files, and passwords) by using keys that are protected by hardware security modules (HSMs). For added assurance, you can import or generate keys in HSMs (keys never leave the HSM boundary). HSMs are certified to FIPS 140-2 level 2 and Common Criteria EAL4+ standards. 

Azure Key Vault streamlines the key management process and enables you to maintain control of keys that access and encrypt your data. Developers can create keys for development and testing in minutes, and then seamlessly migrate them to production keys. Security administrators can grant (and revoke) permission to keys, as needed. 

Use the following table to better understand how Azure Key Vault can help to meet the needs of developers and security administrators.





| Role        | Problem statement           | Solved by Azure Key Vault  |
| ------------- |-------------|-----|
| Developer for an Azure application      | “I want to write an application for Azure that uses keys for signing and encryption, but I want these to be external from my application so that the solution is suitable for an application that is geographically distributed. <br/><br/>I also want these keys and secrets to be protected, without having to write the code myself, and I want them to be easy for me to use from my application.” | √ Keys are stored in a vault and invoked by URI when needed.<br/><br/> √ Keys are safeguarded by Azure, using industry-standard algorithms, key lengths, and hardware security modules (HSMs).<br/><br/> √ Keys are collocated in HSMs inside the Azure datacenters, which provides better reliability and reduced latency.|
| Developer for Software as a Service (SaaS)      |“I don’t want the responsibility or potential liability for my customers’ tenant keys and secrets. <br/><br/>I want the customers to own and manage their keys so that I can concentrate on doing what I do best, which is providing the core software features. | √ Customers can import their own keys into Azure, and manage them. When a SaaS application needs to perform cryptographic operations by using their customers’ keys, Azure Key Vault does this on behalf of the application. The application does not see the customers’ keys.|
| Chief security officer (CSO) | “I want to know that our applications comply with FIPS 140-2 Level 2 HSMs and Common Criteria EAL4+ standards for secure key management. <br/><br/>I want to make sure that my organization is in control of the key life cycle and can monitor key usage. <br/><br/>And although we use multiple Azure services and resources, I want to manage the keys from a single location in Azure.”     |√ HSMs are FIPS 140-2 Level 2 and CC EAL4+ certified.<br/><br/>√ Software and Microsoft operators in datacenters cannot see or leak your keys.<br/><br/>√ Near real-time logging of key usage.<br/><br/>√ The vault provides a single interface, regardless of how many vaults you have in Azure, which regions they support, and which applications use them. |


Anybody with an Azure subscription can create and use key vaults. Although Azure Key Vault benefits developers and security administrators, it could be implemented and managed by an organization’s administrator who manages other Azure services for an organization. For example, this administrator would sign in with an Azure subscription, create a vault for the organization in which to store keys, and then be responsible for operational tasks, such as:

+ Create or import a key or secret 
+ Revoke or delete a key or secret
+ Authorize users or applications to manage or use keys and secrets
+ Configure key usage (for example, sign or encrypt)
+ Monitor key usage

This administrator would then provide developers with URIs to call from their applications, and provide their security administrator with key usage logging information. **Key usage logging information is not currently available 
for Preview.**

   ![Overview of Azure Key Vault][1]

Developers can also manage the keys directly, by using  APIs. For more information, see [Azure Key Vault REST API Reference](http://go.microsoft.com/fwlink/?LinkId=518560) and [Azure Key Vault C# API Reference](http://go.microsoft.com/fwlink/?LinkId=518560).


# Next Steps

For a getting started tutorial for an administrator, see [Get Started with Azure Key Vault](http://go.microsoft.com/fwlink/?LinkId=521402).

For more information about using keys and secrets with Azure Key Vault, see [About Keys and Secrets](http://go.microsoft.com/fwlink/?LinkId=523972).


<!--Image references-->
[1]: ./media/key-vault-whatis/AzureKeyVault_overview.png



<!--Link references-->
[Azure Key Vault Cmdlets]: http://go.microsoft.com/fwlink/?LinkId=521403
