---
title: Azure Government Services | Microsoft Docs
description: Provides and overview of the available services in Azure Government
services: Azure-Government
cloud: gov
documentationcenter: ''
author: zakramer
manager: liki
editor: ''

ms.assetid: c3645bda-bf35-4232-a54d-7a0bfab2d594
ms.service: multiple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 10/18/2016
ms.author: ryansoc

---
# Security
## Principles for Securing Customer Data in Azure Government
Azure Government provides a range of features and services that you can use to build cloud solutions to meet your regulated/controlled data needs. A compliant customer solution is nothing more than the effective implementation of out-of-the-box Azure Government capabilities, coupled with a solid data security practice.

When you host a solution in Azure Government, Microsoft handles many of these requirements at the cloud infrastructure level.

The following diagram shows the Azure defense-in-depth model. For example, Microsoft provides basic cloud infrastructure DDOS, along with customer capabilities such as security appliances for customer-specific application DDOS needs.

![alt text](./media/azure-government-Defenseindepth.png)

This page outlines the foundational principles for securing your Services and applications, providing guidance and best practices on how to apply these principles; in other words, how customers should make smart use of Azure Government to meet the obligations and responsibilities that are required for a solution that handles ITAR information.

 The overarching principles for securing customer data are:

* Protecting data using encryption
* Managing secrets
* Isolation to restrict data access

### Protecting Customer Data Using Encryption
Mitigating risk and meeting regulatory obligations are driving the increasing focus and importance of data encryption. Use an effective encryption implementation to enhance current network and application security measures—and decrease the overall risk of your cloud environment.

#### Encryption at rest
The encryption of data at rest applies to the protection of customer content held in disk storage. There are several ways this might happen:

#### Storage Service Encryption
Azure Storage Service Encryption is enabled at the storage account level, resulting in block blobs and page blobs being automatically encrypted when written to Azure Storage. When you read the data from Azure Storage, it will be decrypted by the storage service before being returned. Use this to secure your data without having to modify or add code to any applications.

#### Client-Side Encryption
Client-Side Encryption is built into the Java and the .NET storage client libraries, which can utilize Azure Key Vault APIs, making this straightforward to implement. Use Azure Key Vault to obtain access to the secrets in Azure Key Vault for specific individuals using Azure Active Directory.

#### Encryption in transit
The basic encryption available for connectivity to Azure Government supports Transport Level Security (TLS) 1.2 protocol, and X.509 certificates. Federal Information Processing Standard (FIPS) 140-2 Level 1 cryptographic algorithms are also used for infrastructure network connections between Azure Government datacenters.  Windows Server 2012 R2, and Windows 8-plus VMs, and Azure File Shares can use SMB 3.0 for encryption between the VM and the file share. Use Client-Side Encryption to encrypt the data before it is transferred into storage in a client application, and to decrypt the data after it is transferred out of storage.

#### Best practices for Encryption
* IaaS VMs: Use Azure Disk Encryption. Turn on Storage Service Encryption to encrypt the VHD files that are used to back up those disks in Azure Storage, but this only encrypts newly written data. This means that, if you create a VM and then enable Storage Service Encryption on the storage account that holds the VHD file, only the changes will be encrypted, not the original VHD file.
* Client-Side Encryption: This is the most secure method for encrypting your data, because it encrypts it before transit, and encrypts the data at rest. However, it does require that you add code to your applications using storage, which you might not want to do. In those cases, you can use HTTPs for your data in transit, and Storage Service Encryption to encrypt the data at rest. Client-Side Encryption also involves more load on the client—you have to account for this in your scalability plans, especially if you are encrypting and transferring a lot of data.

### Protecting Customer Data by Managing Secrets
Secure key management is essential for protecting data in the cloud. Customers should strive to simplify key management and maintain control of keys used by cloud applications and services to encrypt data.

#### Best Practices for Managing Secrets
* Use Key Vault to minimize the risks of secrets being exposed through hard-coded configuration files, scripts, or in source code. Azure Key Vault encrypts keys (such as the encryption keys for Azure Disk Encryption) and secrets (such as passwords), by storing them in FIPS 140-2 Level 2 validated hardware security modules (HSMs). For added assurance, you can import or generate keys in these HSMs.
* Application code and templates should only contain URI references to the secrets (which means the actual secrets are not in code, configuration or source code repositories). This prevents key phishing attacks on internal or external repos, such as harvest-bots in GitHub.
* Utilize strong RBAC controls within Key Vault. If a trusted operator leaves the company or transfers to a new group within the company, they should be prevented from being able to access the secrets.

For more information <a href="https://azure.microsoft.com/documentation/services/key-vault">Azure Key Vault public documentation. </a>

### Isolation to Restrict Data Access
Isolation is all about using boundaries, segmentation, and containers to limit data access to only authorized users, services, and applications. For example, the separation between tenants is an essential security mechanism for multitenant cloud platforms such as Microsoft Azure. Logical isolation helps prevent one tenant from interfering with the operations of any other tenant.

#### Environment Isolation
The Azure Government environment is a physical instance that is separate from the rest of Microsoft's network. This is achieved through a series of physical and logical controls that include the following:

* Securing of physical barriers using biometric devices and cameras.
* Use of specific credentials and multifactor authentication by Microsoft personnel requiring logical access to the production environment.
* All service infrastructure for Azure Government is located within the United States.

#### Per-Customer Isolation
Azure implements network access control and segregation through VLAN isolation, ACLs, load balancers and IP filters

Customers can further isolate their resources across subscriptions, resource groups, virtual networks, and subnets.

## Screening
The recently announced FedRAMP High and Department of Defense (DoD) Impact Level 4 accreditation. This has raised the security and compliance bar across the Azure Government environment.

We are now screening all our operators at National Agency Check with Law and Credit (NACLC) as defined in section 5.6.2.2 of the DoD Cloud Computing Security Requirements Guide (SRG):

> [!NOTE]
> The minimum background investigation required for CSP personnel having access to Level 4 and 5 information based on a “noncritical-sensitive” (e.g., DoD’s ADP-2) is a National Agency Check with Law and Credit (NACLC) (for “noncritical-sensitive” contractors), or a Moderate Risk Background Investigation (MBI) for a “moderate risk” position designation.
> 
> 

The following table summarizes our current screening for Azure Government operators:

| Azure Gov screenings and background checks | Description |
| --- | --- |
| US citizenship |Verification of US citizenship. |
| Microsoft cloud background check (every two years) |Social Security number search, criminal history check, Office of Foreign Assets Control list (OFAC), Bureau of Industry and Security list (BIS), Office of Defense Trade Controls Debarred Persons list. |
| National Agency Check with Law and Credit (NACLC) (every five years) |Adds fingerprint background check against FBI databases. For additional information, go to the<a href="https://www.opm.gov/investigations/background-investigations/federal-investigations-notices/1997/fin97-02/"> Office Personnel Management Site</a>. |
| <a href="https://www.microsoft.com/en-us/TrustCenter/Compliance/CJIS"> Criminal Justice Information Services (CJIS) </a> |CJIS is a state, local and FBI government screening which processes fingerprint records and validates criminal histories on operational staff who could be provided access to critical criminal justice information (CJI) data.  Each state does their own background check and subsequent approval of all employees with potential access to CJI. |

For Azure operations personnel, the following access principles apply:

* Duties are clearly defined, with separate responsibilities for requesting, approving and deploying changes.
* Access is through defined interfaces that have specific functionality.
* Access is just-in-time (JIT), and is granted only on a per-incident basis or for a specific maintenance event, and always for a limited duration.
* Access is rule-based, with defined roles that are only assigned the permissions required for troubleshooting.

Screening standards include the validation of US citizenship of all Microsoft support and operational staff before access is granted to Azure Government-hosted systems. Support personnel who need to transfer data use the secure capabilities within Azure Government. Secure data transfer requires a separate set of authentication credentials to gain access. For example, to access system metadata, operations personnel use specific web-based internal management tools, read-only APIs, and JIT elevation.

## Next steps
For supplemental information and updates please subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>

