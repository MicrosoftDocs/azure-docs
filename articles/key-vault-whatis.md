<properties title="What is Azure Key Vault?" pageTitle="What is Azure Key Vault? | Overview" description="The Azure Key Vault service is a pay-as-you-go security solution that stores and manages cryptographic keys in Azure. The service uses a single location, called a vault, which stores and helps to secure the keys. These keys can then be used by applications for small, high-value security data, such as access keys and passwords." metaKeywords="Azure Key Vault, Azure Key Vault Overview, access keys, passwords" services="Key-Vault" solutions="" documentationCenter="" authors="cabailey" manager="terrylan" videoId="" scriptId="" />

<tags ms.service="key-vault" ms.workload="identity" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/27/2014" ms.author="cabailey" />



# What is Azure Key Vault? 

The Azure Key Vault service—currently in Preview—is a pay-as-you-go security solution that stores and manages cryptographic keys in Azure. The service uses a single location, called a vault, which stores and helps to secure the keys. These keys can then be used by applications for small, high-value security data, such as access keys and passwords. 

Azure Key Vault will be of most benefit to developers of Azure applications that use cryptographic keys or passwords, and to security administrators, such as chief security officers (CSOs), because it offers a solution to the  problems and requirements shown in the following table:





| Role        | Problem statement           | Solved by Azure Key Vault  |
| ------------- |-------------|-----|
| Developer for an Azure application      | “I want to write an application for Azure that uses keys for signing and encryption, but I want these to be external from my application so that the solution is suitable for an application that’s geographically distributed. I also want these keys and passwords to be secured, without having to write the security protection myself, and I want them to be easy for me to use from my application.” | √ Keys are stored in a vault and invoked by URI when needed.<br/><br/> √ Keys are secured by Azure, using industry-standard algorithms, key lengths, and Hardware Security Modules (HSMs) for storage.|
| Developer for Software as a Service (SaaS)      |“I don’t want the responsibility or potential liability for my customers’ tenant keys and passwords. I want the customers to own and manage their keys so that I can concentrate on doing what I do best, which is providing the core software features. | √ Customers can import their own keys into Azure, and manage them. When a SaaS application needs to perform cryptographic operations by using their customers’ keys, Azure Key Vault does this on behalf of the application. The application does not see the customers’ keys.|
| Chief security officer (CSO) | “I want to know that our applications have an industry-standard level of security protection that is achieved by using FIPS 140-2 Level 2 HSMs. I want to make sure that my organization is in control of the key life cycle and can monitor key usage. And although we use multiple Azure services and resources, I want to manage the keys from a single location in Azure.”     |√ Use of FIPS 140-2 Level 2 HSMs in Microsoft Azure datacenters that can scale-out per region.<br/><br/>√ Software and Microsoft operators in datacenters cannot see or leak your keys.<br/><br/>√ Near real-time logging of key usage.<br/><br/>√ The vault provides a single interface, regardless of how many vaults you have in Azure, which regions they support, and which applications use them. |


Although Azure Key Vault benefits developers and security administrators, it’s most likely to be implemented and managed by an organization’s administrator who manages other Azure services for an organization. For example, this administrator would sign in with an Azure subscription, create a vault for the organization in which to store keys, and then be responsible for operational tasks, such as:

+ Create or import a key
+ Revoke or delete a key
+ Authorize users or applications to create or use a key
+ Configure key usage (for example, sign or encrypt)
+ Monitor key usage

This administrator would then provide developers with URIs to call from their applications, and provide their security administrator with key usage logging information.

   ![Overview of Azure Key Vault][1]

However, developers can also manage the keys directly, by using REST APIs. For more information, see [REST API link](https://www.google.com).

For how-to steps for an administrator, see [Get Started with Azure Key Vault](https://www.google.com).




<!--Image references-->
[1]: ./media/key-vault-whatis/AzureKeyVault_overview.png



<!--Link references-->
[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/
