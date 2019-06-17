---
title: Azure Government Security | Microsoft Docs
description: Provides and overview of the available services in Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: zakramer
manager: liki

ms.assetid: c3645bda-bf35-4232-a54d-7a0bfab2d594
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 11/14/2016
ms.author: ryansoc

---
# Azure Government security
Azure Government provides a range of features and services that you can use to build cloud solutions to meet your regulated/controlled data needs. A compliant customer solution is nothing more than the effective implementation of out-of-the-box Azure Government capabilities, coupled with a solid data security practice.

When you host a solution in Azure Government, Microsoft handles many of these requirements at the cloud infrastructure level.

The following diagram shows the Azure defense-in-depth model. For example, Microsoft provides basic cloud infrastructure DDOS, along with customer capabilities such as security appliances for customer-specific application DDOS needs.

![alt text](./media/azure-government-Defenseindepth.png)

This page outlines the foundational principles for securing your Services and applications, providing guidance and best practices on how to apply these principles; in other words, how customers should make smart use of Azure Government to meet the obligations and responsibilities that are required for a solution that handles ITAR information.

 The overarching principles for securing customer data are:

* Protecting data using encryption
* Managing secrets
* Isolation to restrict data access

## Protecting customer data using encryption
Mitigating risk and meeting regulatory obligations are driving the increasing focus and importance of data encryption. Use an effective encryption implementation to enhance current network and application security measures—and decrease the overall risk of your cloud environment.

### Encryption at rest
The encryption of data at rest applies to the protection of customer content held in disk storage. There are several ways this might happen:

### Storage Service Encryption
Azure Storage Service Encryption is enabled at the storage account level, resulting in block blobs and page blobs being automatically encrypted when written to Azure Storage. When you read the data from Azure Storage, it will be decrypted by the storage service before being returned. Use this to secure your data without having to modify or add code to any applications.

### Client-Side encryption
Client-Side Encryption is built into the Java and the .NET storage client libraries, which can utilize Azure Key Vault APIs, making this straightforward to implement. Use Azure Key Vault to obtain access to the secrets in Azure Key Vault for specific individuals using Azure Active Directory.

### Encryption in transit
The basic encryption available for connectivity to Azure Government supports Transport Level Security (TLS) 1.2 protocol, and X.509 certificates. Federal Information Processing Standard (FIPS) 140-2 Level 1 cryptographic algorithms are also used for infrastructure network connections between Azure Government datacenters. Windows Server 2016, Windows 10, Windows Server 2012 R2, and Windows 8.1, and Azure File shares can use SMB 3.0 for encryption between the VM and the file share. Use Client-Side Encryption to encrypt the data before it is transferred into storage in a client application, and to decrypt the data after it is transferred out of storage.

### Best practices for encryption
* IaaS VMs: Use Azure Disk Encryption. Turn on Storage Service Encryption to encrypt the VHD files that are used to back up those disks in Azure Storage, but this only encrypts newly written data. This means that, if you create a VM and then enable Storage Service Encryption on the storage account that holds the VHD file, only the changes will be encrypted, not the original VHD file.
* Client-Side Encryption: This is the most secure method for encrypting your data, because it encrypts it before transit, and encrypts the data at rest. However, it does require that you add code to your applications using storage, which you might not want to do. In those cases, you can use HTTPs for your data in transit, and Storage Service Encryption to encrypt the data at rest. Client-Side Encryption also involves more load on the client—you have to account for this in your scalability plans, especially if you are encrypting and transferring a lot of data.

## Protecting customer data by managing secrets
Secure key management is essential for protecting data in the cloud. Customers should strive to simplify key management and maintain control of keys used by cloud applications and services to encrypt data.

### Best practices for managing secrets
* Use Key Vault to minimize the risks of secrets being exposed through hard-coded configuration files, scripts, or in source code. Azure Key Vault encrypts keys (such as the encryption keys for Azure Disk Encryption) and secrets (such as passwords), by storing them in FIPS 140-2 Level 2 validated hardware security modules (HSMs). For added assurance, you can import or generate keys in these HSMs.
* Application code and templates should only contain URI references to the secrets (which means the actual secrets are not in code, configuration or source code repositories). This prevents key phishing attacks on internal or external repos, such as harvest-bots in GitHub.
* Utilize strong RBAC controls within Key Vault. If a trusted operator leaves the company or transfers to a new group within the company, they should be prevented from being able to access the secrets.

For more information [Azure Key Vault public documentation](../key-vault/index.yml).

## Understanding isolation
Isolation in Azure US Government is achieved through the implementation of trust boundaries, segmentation, and containers to limit data access to only authorized users, services, and applications.  Azure US Government supports environment, and per-customer isolation controls and capabilities. 

### Environment isolation
The Azure Government multitenant cloud platform environment (FedRAMP HIGH / DoD L4) is a physical instance that is an Internet standards-based autonomous system separately administered from the rest of Microsoft's networks. This Autonomous System (AS) as defined by IETF RFC 4271 is a set of switches and routers under a single technical administration, using an interior gateway protocol and common metrics to route packets within the AS, and using an exterior gateway protocol to route packets to other ASs though a single and clearly defined routing policy.  In addition, the specific DoD named region pairs (DoD L5) within Azure Government are geographically separated physical instances of compute, storage, SQL, and supporting services that store and/or process customer content (in accordance with DoD SRG 5.2.2.3 requirements).  

The isolation of the Microsoft Azure Government environment is achieved through a series of physical and logical controls, and associated capabilities that include: physically isolated hardware, physical barriers to the hardware using biometric devices and cameras; Conditional Access (RBAC, workflow), specific credentials and multifactor authentication for logical access; infrastructure for Azure Government is located within the United States.
 
Within the Microsoft Azure Government network, internal network system components are isolated from other system components through implementation of separate subnets and access control policies on management interfaces.  Azure Government does not directly peer with the public internet or with the Microsoft corporate network.  Microsoft Azure Government directly peers to the commercial Microsoft Azure network which has routing and transport capabilities to the Internet and the Microsoft Corporate network.  Azure Government limits its exposed surface area by leveraging additional protections and communications capabilities of our commercial Azure network.  In addition, Microsoft Azure Government Express Route (ER) leverages peering with our customer’s networks over non-Internet private circuits to route ER customer “DMZ” networks using specific Border Gateway Protocol (BGP)/AS peering as a trust boundary for application routing and associated policy enforcement. 

### Per-Customer isolation
Separation between customers/tenants is an essential security mechanism for the entire Azure Government multitenant cloud platform. Microsoft Azure Government provides base per-customer or tenant isolation controls including Isolation of Hypervisor, Root OS, and Guest VMs, Isolation of Fabric Controllers, Packet Filtering, and VLAN Isolation.  

Customer/tenants can manage their isolation posture to meet individual requirements through network access control and segregation through virtual machines, virtual networks, VLAN isolation, ACLs, load balancers and IP filters.  Additionally, customers/tenants can further manage isolation levels for their resources across subscriptions, resource groups, virtual networks, and subnets.  The customer/tenant logical isolation controls help prevent one tenant from interfering with the operations of any other customer/tenant.

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
| National Agency Check with Law and Credit (NACLC) (every five years) |Adds fingerprint background check against FBI databases. For additional information, go to the<a href="https://nbib.opm.gov/"> Office Personnel Management Site</a>. |
| <a href="https://www.microsoft.com/en-us/TrustCenter/Compliance/CJIS"> Criminal Justice Information Services (CJIS) </a> |CJIS is a state, local and FBI government screening which processes fingerprint records and validates criminal histories on operational staff who could be provided access to critical criminal justice information (CJI) data.  Each state does their own background check and subsequent approval of all employees with potential access to CJI. |

For Azure operations personnel, the following access principles apply:

* Duties are clearly defined, with separate responsibilities for requesting, approving and deploying changes.
* Access is through defined interfaces that have specific functionality.
* Access is just-in-time (JIT), and is granted on a per-incident basis or for a specific maintenance event, and for a limited duration.
* Access is rule-based, with defined roles that are only assigned the permissions required for troubleshooting.

Screening standards include the validation of US citizenship of all Microsoft support and operational staff before access is granted to Azure Government-hosted systems. Support personnel who need to transfer data use the secure capabilities within Azure Government. Secure data transfer requires a separate set of authentication credentials to gain access. 

## Next steps
For supplemental information and updates please subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>

