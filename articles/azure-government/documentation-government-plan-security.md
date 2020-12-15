---
title: Azure Government Security
description: Customer guidance and best practices for securing their workloads.
author: stevevi
ms.service: azure-government
ms.topic: article
ms.date: 11/19/2020
ms.author: stevevi
---

# Azure Government security

Azure Government provides a range of features and services that you can use to build cloud solutions to meet your regulated/controlled data needs. A compliant customer solution can be a combination of the effective implementation of out-of-the-box Azure Government capabilities coupled with a solid data security practice.

When you host a solution in Azure Government, Microsoft handles many of these requirements at the cloud infrastructure level.

The following diagram shows the Azure defense-in-depth model. For example, Microsoft provides basic cloud infrastructure Distributed Denial of Service (DDoS) protection, along with customer capabilities such as [Azure DDoS Protection](../ddos-protection/ddos-protection-overview.md) or security appliances for customer-specific application DDoS needs.

:::image type="content" source="./media/azure-government-Defenseindepth.png" alt-text="Azure defense-in-depth model" border="false":::

This article outlines the foundational principles for securing your services and applications, providing guidance and best practices on how to apply these principles, for example, how customers should make smart use of Azure Government to meet the obligations and responsibilities that are required for a solution that handles information subject to the [International Traffic in Arms Regulations](./documentation-government-overview-itar.md#itar) (ITAR).  For additional security recommendations and implementation details to help customers improve the security posture with respect to Azure resources, see the [Azure Security Benchmark](../security/benchmarks/index.yml).

The overarching principles for securing customer data are:

- Protecting data using encryption
- Managing secrets
- Isolation to restrict data access

## Data encryption

Mitigating risk and meeting regulatory obligations are driving the increasing focus and importance of data encryption. Use an effective encryption implementation to enhance current network and application security measures and decrease the overall risk of your cloud environment. Azure has extensive support to safeguard customer data using [data encryption](../security/fundamentals/encryption-overview.md), including various encryption models:

- Server-side encryption that uses service-managed keys, customer-managed keys (CMK) in Azure, or CMK in customer-controlled hardware.
- Client-side encryption that enables customers to manage and store keys on-premises or in another secure location. Client-side encryption is built into the Java and .NET storage client libraries, which can utilize Azure Key Vault APIs, making the implementation straightforward. Use Azure Key Vault to obtain access to the secrets in Azure Key Vault for specific individuals using Azure Active Directory.

Data encryption provides isolation assurances that are tied directly to encryption key access.  Since Azure uses strong ciphers for data encryption, only entities with access to encryption keys can have access to data.  Deleting or revoking encryption keys renders the corresponding data inaccessible. 

### Encryption at rest

Azure provides extensive options for [encrypting data at rest](../security/fundamentals/encryption-atrest.md) to help customers safeguard their data and meet their compliance needs using both Microsoft-managed encryption keys, as well as customer-managed encryption keys.  This process relies on multiple encryption keys, as well as services such as Azure Key Vault and Azure Active Directory to ensure secure key access and centralized key management.  For more information about Azure Storage Service Encryption and Azure Disk Encryption, see [Data encryption at rest](./azure-secure-isolation-guidance.md#data-encryption-at-rest).

### Encryption in transit

Azure provides many options for [encrypting data in transit](../security/fundamentals/encryption-overview.md#encryption-of-data-in-transit).  Data encryption in transit isolates customer network traffic from other traffic and helps protect data from interception.  For more information, see [Data encryption in transit](./azure-secure-isolation-guidance.md#data-encryption-in-transit).

The basic encryption available for connectivity to Azure Government supports Transport Layer Security (TLS) 1.2 protocol and X.509 certificates. Federal Information Processing Standard (FIPS) 140-2 validated cryptographic algorithms are also used for infrastructure network connections between Azure Government datacenters. Windows, Windows Server, and Azure File shares can use SMB 3.0 for encryption between the VM and the file share. Use client-side encryption to encrypt the data before it is transferred into storage in a client application, and to decrypt the data after it is transferred out of storage.

### Best practices for encryption

- IaaS VMs: Use Azure Disk Encryption. Turn on Storage Service Encryption to encrypt the VHD files that are used to back up those disks in Azure Storage. This approach only encrypts newly written data, which means that, if you create a VM and then enable Storage Service Encryption on the storage account that holds the VHD file, only the changes will be encrypted, not the original VHD file.
- Client-side encryption: This is the most secure method for encrypting your data, because it encrypts it before transit, and encrypts the data at rest. However, it does require that you add code to your applications using storage, which you might not want to do. In those cases, you can use HTTPs for your data in transit, and Storage Service Encryption to encrypt the data at rest. Client-side encryption also involves more load on the client that you have to account for in your scalability plans, especially if you are encrypting and transferring a lot of data.

## Managing secrets

Proper protection and management of encryption keys is essential for data security. Customers should strive to simplify key management and maintain control of keys used by cloud applications and services to encrypt data. [Azure Key Vault](../key-vault/general/overview.md) is a multi-tenant key management service that Microsoft recommends for managing and controlling access to encryption keys when seamless integration with Azure services is required. Azure Key Vault enables customers to store their encryption keys in Hardware Security Modules (HSMs) that are FIPS 140-2 validated.  For more information, see [Data encryption key management with Azure Key Vault](./azure-secure-isolation-guidance.md#azure-key-vault)

### Best practices for managing secrets

- Use Key Vault to minimize the risks of secrets being exposed through hard-coded configuration files, scripts, or in source code. For added assurance, you can import or generate keys in Azure Key Vault HSMs.
- Application code and templates should only contain URI references to the secrets, which means the actual secrets are not in code, configuration, or source code repositories. This approach prevents key phishing attacks on internal or external repositories, such as harvest-bots in GitHub.
- Utilize strong Azure role-based access control (RBAC) within Key Vault. If a trusted operator leaves the company or transfers to a new group within the company, they should be prevented from being able to access the secrets.

## Understanding isolation

Isolation in Azure Government is achieved through the implementation of trust boundaries, segmentation, and containers to limit data access to only authorized users, services, and applications.  Azure Government supports environment and tenant isolation controls and capabilities. 

### Environment isolation

The Azure Government multi-tenant cloud platform environment is an Internet standards-based Autonomous System (AS) that is physically isolated and separately administered from the rest of Azure public cloud. The AS as defined by [IETF RFC 4271](https://datatracker.ietf.org/doc/rfc4271/) is comprised of a set of switches and routers under a single technical administration, using an interior gateway protocol and common metrics to route packets within the AS, and using an exterior gateway protocol to route packets to other ASs though a single and clearly defined routing policy.  In addition, Azure Government for DoD regions within Azure Government are geographically separated physical instances of compute, storage, SQL, and supporting services that store and/or process customer content in accordance with DoD Cloud Computing Security Requirements Guide (SRG) [Section 5.2.2.3](https://dl.dod.cyber.mil/wp-content/uploads/cloud/SRG/index.html#5.2LegalConsiderations) requirements.  

The isolation of the Azure Government environment is achieved through a series of physical and logical controls, and associated capabilities that include:

- Physically isolated hardware
- Physical barriers to the hardware using biometric devices and cameras
- Conditional access (Azure RBAC, workflow)
- Specific credentials and multi-factor authentication for logical access
- Infrastructure for Azure Government is located within the United States
 
Within the Azure Government network, internal network system components are isolated from other system components through implementation of separate subnets and access control policies on management interfaces.  Azure Government does not directly peer with the public internet or with the Microsoft corporate network.  Azure Government directly peers to the commercial Microsoft Azure network which has routing and transport capabilities to the Internet and the Microsoft Corporate network.  Azure Government limits its exposed surface area by leveraging additional protections and communications capabilities of our commercial Azure network.  In addition, Azure Government ExpressRoute (ER) leverages peering with our customer’s networks over non-Internet private circuits to route ER customer “DMZ” networks using specific Border Gateway Protocol (BGP)/AS peering as a trust boundary for application routing and associated policy enforcement.

Azure Government maintains a FedRAMP High P-ATO issued by the FedRAMP Joint Authorization Board (JAB), as well as DoD SRG IL4 and IL5 provisional authorizations.

### Tenant isolation

Separation between customers/tenants is an essential security mechanism for the entire Azure Government multi-tenant cloud platform. Azure Government provides baseline per-customer or tenant isolation controls including isolation of Hypervisor, Root OS, and Guest VMs, isolation of Fabric Controllers, packet filtering, and VLAN isolation.  For more information, see [compute isolation](./azure-secure-isolation-guidance.md#compute-isolation).

Customer/tenants can manage their isolation posture to meet individual requirements through network access control and segregation through virtual machines, virtual networks, VLAN isolation, ACLs, load balancers and IP filters.  Additionally, customers/tenants can further manage isolation levels for their resources across subscriptions, resource groups, virtual networks, and subnets.  The customer/tenant logical isolation controls help prevent one tenant from interfering with the operations of any other customer/tenant.

## Screening

All Azure and Azure Government employees in the United States are subject to Microsoft background checks, as outlined in the table below.  Personnel with the ability to access customer data for troubleshooting purposes in Azure Government are additionally subject to the verification of U.S. citizenship, as well as additional screening requirements where appropriate.

We are now screening all our operators at National Agency Check with Law and Credit (NACLC) as defined in DoD SRG [Section 5.6.2.2](https://dl.dod.cyber.mil/wp-content/uploads/cloud/SRG/index.html#5.6PhysicalFacilitiesandPersonnelRequirements):

> [!NOTE]
> The minimum background investigation required for CSP personnel having access to Level 4 and 5 information based on a “noncritical-sensitive” (e.g., DoD’s ADP-2) is a National Agency Check with Law and Credit (NACLC) (for “noncritical-sensitive” contractors), or a Moderate Risk Background Investigation (MBI) for a “moderate risk” position designation.
> 

|Applicable screening and background check|Environment|Frequency|Description|
|------|------|------|------|
|Background check </br> Cloud screen|Azure </br>Azure Gov|Upon employment|- Education history (highest degree) </br>- Employment history (7-yr history)|
|||Every 2 years|- Social Security Number search </br>- Criminal history check (7-yr history) </br>- Office of Foreign Assets Control (OFAC) list </br>- Bureau of Industry and Security (BIS) list </br>- Office of Defense Trade Controls (DDTC) debarred list|
|U.S. citizenship|Azure Gov|Upon employment|- Verification of U.S. citizenship|
|Criminal Justice Information Services (CJIS)|Azure Gov|Upon signed CJIS agreement with State|- Adds fingerprint background check against FBI database </br>- Criminal records check and credit check|
|National Agency Check with Law and Credit (NACLC)|Azure Gov|Upon signed contract with sponsoring agency|- Detailed background and criminal history investigation (Form SF 86 required)|

For Azure operations personnel, the following access principles apply:

- Duties are clearly defined, with separate responsibilities for requesting, approving and deploying changes.
- Access is through defined interfaces that have specific functionality.
- Access is just-in-time (JIT), and is granted on a per-incident basis or for a specific maintenance event, and for a limited duration.
- Access is rule-based, with defined roles that are only assigned the permissions required for troubleshooting.

Screening standards include the validation of US citizenship of all Microsoft support and operational staff before access is granted to Azure Government-hosted systems. Support personnel who need to transfer data use the secure capabilities within Azure Government. Secure data transfer requires a separate set of authentication credentials to gain access. 

## Next steps
For supplemental information and updates please subscribe to the
<a href="https://devblogs.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>