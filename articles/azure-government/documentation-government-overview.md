---
title: Azure Government documentation overview | Microsoft Docs
description: This provides a comparision of features and guidance on developing applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: ryansoc
manager: zakramer

ms.assetid: 56d84e26-947e-4f3b-8e33-18247f1c7944
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 01/10/2017
ms.author: ryansoc

---
# Azure Government Documentation Overview
## Introduction to Azure Government Documentation
This site describes the capabilities of [Microsoft Azure Government](https://azure.microsoft.com/features/gov/) services, and provides general guidance applicable to all customers. Before including regulated data in your Azure Government subscription, you should familiarize yourself with the Azure Government capabilities and consult your account team if you have any questions.

Refer to the [Microsoft Azure Trust Center Compliance Page](https://www.microsoft.com/en-us/TrustCenter/Compliance/default.aspx) for current information on the Azure Government services covered under specific accreditations and regulations. Additional Microsoft services might also be available, but are not within the scope of the Azure Government covered services and are not addressed by this document. Azure Government services might also permit you to use a variety of additional resources, applications, or services that are provided by third parties—or by Microsoft under separate terms of use and privacy policies—which are not included in the scope of this document. You are responsible for reviewing the terms of all such “add-on” offerings, such as Marketplace offerings, so that they meet your needs regarding compliance.

Azure Government is available to entities that handle data that is subject to certain government regulations and requirements (such as NIST 800.171 (DIB), ITAR, IRS 1075, DoD L4, and CJIS) where use of Azure Government is required to comply with regulations. Azure Government customers are subject to validation of eligibility.

Entities with questions about eligibility for Azure Government should consult their account team.

## Principles for Securing Customer Data in Azure Government
Azure Government provides a range of features and services that you can use to build cloud solutions to meet your regulated/controlled data needs. A compliant customer solution is nothing more than the effective implementation of out-of-the-box Azure Government capabilities, coupled with a solid data security practice.
When you host a solution in Azure Government, Microsoft handles many of these requirements at the cloud infrastructure level.

The following diagram shows the Azure defense-in-depth model. For example, Microsoft provides basic cloud infrastructure DDOS, along with customer capabilities such as security appliances for customer-specific application DDOS needs.

![alt text](./media/azure-government-Defenseindepth.png)

This page outlines the foundational principles for securing your Services and applications, with guidance and best practices on how to apply these principles. In other words, how customers should make smart use of Azure Government to meet the obligations and responsibilities that are required for a solution that handles ITAR information.

The overarching principles for securing customer data are:

* Protecting data using encryption
* Managing secrets
* Isolation to restrict data access

## Protecting Customer Data Using Encryption
Mitigating risk and meeting regulatory obligations are driving the increasing focus and importance of data encryption. Use an effective encryption implementation to enhance current network and application security measures—and lower the overall risk of your cloud environment.

### <a name="Overview"></a>Encryption at rest
The encryption of data at rest applies to the protection of customer content held in disk storage. There are several ways this might happen:

### <a name="Overview"></a>Storage Service Encryption
Azure Storage Service Encryption is enabled at the storage account level, resulting in block blobs and page blobs being automatically encrypted when written to Azure Storage. When you read the data from Azure Storage, it will be decrypted by the storage service before being returned. Use this to secure your data without having to modify or add code to any applications.

### <a name="Overview"></a>Azure Disk Encryption
Use Azure Disk Encryption to encrypt the OS disks and data disks used by an Azure Virtual Machine. Integration with Azure Key Vault gives you control and helps you manage disk encryption keys.

### <a name="Overview"></a>Client-Side Encryption
Client-Side Encryption is built into the Java and the .NET storage client libraries, which can utilize Azure Key Vault APIs, making this straightforward to implement. Use Azure Key Vault to gain access to the secrets in Azure Key Vault for specific individuals using Azure Active Directory.

### <a name="Overview"></a>Encryption in transit
The basic encryption available for connectivity to Azure Government supports Transport Level Security (TLS) 1.2 protocol, and X.509 certificates. Federal Information Processing Standard (FIPS) 140-2 Level 1 cryptographic algorithms are also used for infrastructure network connections between Azure Government datacenters.  Windows Server 2016, Windows 10, Windows Server 2012 R2, Windows 8.1, and Azure File shares can use SMB 3.0 for encryption between the VM and the file share. Use Client-Side Encryption to encrypt the data before it's transferred into storage in a client application, and to decrypt the data after it's transferred out of storage.

### <a name="Overview"></a>Best practices for Encryption
* IaaS VMs: Use Azure Disk Encryption. Turn on Storage Service Encryption to encrypt the VHD files that are used to back up those disks in Azure Storage, but this only encrypts newly written data. This means that, if you create a VM and then enable Storage Service Encryption on the storage account that holds the VHD file, only the changes will be encrypted, not the original VHD file.
* Client-Side Encryption: This is the most secure method for encrypting your data, because it encrypts it before transit, and encrypts the data at rest. However, it does require that you add code to your applications using storage, which you might not want to do. In those cases, you can use HTTPs for your data in transit, and Storage Service Encryption to encrypt the data at rest. Client-Side Encryption also involves more load on the client—you have to account for this in your scalability plans, especially if you're encrypting and transferring large amounts of data.

For more information on the encryption options in Azure, see the [Storage Security Guide](https://docs.microsoft.com/azure/storage/storage-security-guide).

## Protecting Customer Data by Managing Secrets
Secure key management is essential for protecting data in the cloud. Customers should strive to simplify key management and maintain control of keys used by cloud applications and services to encrypt data.

### <a name="Overview"></a>Best Practices for Managing Secrets
* Use Key Vault to minimize the risks of secrets being exposed through hard-coded configuration files, scripts, or in source code. Azure Key Vault encrypts keys (such as the encryption keys for Azure Disk Encryption) and secrets (such as passwords), by storing them in FIPS 140-2 Level 2 validated hardware security modules (HSMs). For added assurance, you can import or generate keys in these HSMs.
* Application code and templates should only contain URI references to the secrets (which means the actual secrets are not in code, configuration, or source code repositories). This prevents key phishing attacks on internal or external repos, such as harvest-bots in GitHub.
* Utilize strong RBAC controls within Key Vault. If a trusted operator leaves the company or transfers to a new group within the company, they should be prevented from being able to access the secrets.  

For more information, see [Azure Key Vault](/azure/key-vault/key-vault-get-started)

## Isolation to Restrict Data Access
Isolation is all about using boundaries, segmentation, and containers to limit data access to only authorized users, services, and applications. For example, the separation between tenants is an essential security mechanism for multitenant cloud platforms such as Microsoft Azure. Logical isolation helps prevent one tenant from interfering with the operations of any other tenant.

### <a name="Overview"></a>Environment Isolation
The Azure Government environment is a physical instance that is separate from the rest of Microsoft's network. This is achieved through a series of physical and logical controls that include the following:  Securing of physical barriers using biometric devices and cameras.  Use of specific credentials and multifactor authentication by Microsoft personnel requiring logical access to the production environment.  All service infrastructure for Azure Government is located within the United States.

#### <a name="Overview"></a>Per-Customer Isolation
Azure implements network access control and segregation through VLAN isolation, ACLs, load balancers, and IP filters

Customers can further isolate their resources across subscriptions, resource groups, virtual networks, and subnets.

For more information on isolation in Microsoft Azure, see the [Isolation section of the Azure Security Guide](/azure/security/azure-security-getting-started/).

For supplemental information and updates, subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>

