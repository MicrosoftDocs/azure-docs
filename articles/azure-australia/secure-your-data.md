---
title: Data security in Azure Australia
description: Configuring Azure within the Australian regions to meet the specific requirements of Australian Government policy, regulations, and legislation.
author: emilyre
ms.service: azure-australia
ms.topic: conceptual
ms.date: 07/22/2019
ms.author: v-emread
---

# Data security in Azure Australia

The overarching principles for securing customer data are:

* Protecting data using encryption
* Managing secrets
* Restricting data access

## Encrypting your data

The encryption of data can be applied at the disk level (at-rest), in databases (at-rest and in-transit), in applications (in-transit), and while on the network (in-transit). There are several ways of achieving encryption in Azure:

|Service/Feature|Description|
|---|---|
|Storage Service Encryption|Azure Storage Service Encryption is enabled at the storage account level, resulting in block blobs and page blobs being automatically encrypted when written to Azure Storage. When you read the data from Azure Storage, it will be decrypted by the storage service before being returned. Use SSE to secure your data without having to modify or add code to any applications.|
|Azure Disk Encryption|Use Azure Disk Encryption to encrypt the OS disks and data disks used by an Azure Virtual Machine. Integration with Azure Key Vault gives you control and helps you manage disk encryption keys.|
|Client-Side Application Level Encryption|Client-Side Encryption is built into the Java and the .NET storage client libraries, which can utilize Azure Key Vault APIs, making it straightforward to implement. Use Azure Key Vault to gain access to the secrets in Azure Key Vault for specific individuals using Azure Active Directory.|
|Encryption in transit|The basic encryption available for connectivity to Azure Australia supports Transport Level Security (TLS) 1.2 protocol, and X.509 certificates. Federal Information Processing Standard (FIPS) 140-2 Level 1 cryptographic algorithms are also used for infrastructure network connections between Azure Australia data centers.  Windows Server 2016, Windows 10, Windows Server 2012 R2, Windows 8.1, and Azure File shares can use SMB 3.0 for encryption between the VM and the file share. Use Client-Side Encryption to encrypt the data before it's transferred into storage in a client application, and to decrypt the data after it's transferred out of storage.|
|IaaS VMs|Use Azure Disk Encryption. Turn on Storage Service Encryption to encrypt the VHD files that are used to back up those disks in Azure Storage, but this only encrypts newly written data. This means that, if you create a VM and then enable Storage Service Encryption on the storage account that holds the VHD file, only the changes will be encrypted, not the original VHD file.|
|Client-Side Encryption|This is the most secure method for encrypting your data, because it encrypts it before transit, and encrypts the data at rest. However, it does require that you add code to your applications using storage, which you might not want to do. In those cases, you can use HTTPS for your data in transit, and Storage Service Encryption to encrypt the data at rest. Client-Side Encryption also involves more load on the client—you have to account for this in your scalability plans, especially if you're encrypting and transferring large amounts of data.|
|

For more information on the encryption options in Azure, see the [Storage Security Guide](https://docs.microsoft.com/azure/storage/storage-security-guide).

## Protecting data by managing secrets

Secure key management is essential for protecting data in the cloud. Customers should strive to simplify key management and maintain control of keys used by cloud applications and services to encrypt data.

### Managing secrets

* Use Key Vault to minimize the risks of secrets being exposed through hard-coded configuration files, scripts, or in source code. Azure Key Vault encrypts keys (such as the encryption keys for Azure Disk Encryption) and secrets (such as passwords), by storing them in FIPS 140-2 Level 2 validated hardware security modules (HSMs). For added assurance, you can import or generate keys in these HSMs.
* Application code and templates should only contain URI references to the secrets (which means the actual secrets are not in code, configuration, or source code repositories). This prevents key phishing attacks on internal or external repos, such as harvest-bots in GitHub.
* Utilize strong RBAC controls within Key Vault. If a trusted operator leaves the company or transfers to a new group within the company, they should be prevented from being able to access the secrets.  

For more information, see [Azure Key Vault](azure-key-vault.md)

## Isolation to restrict data access

Isolation is all about using boundaries, segmentation, and containers to limit data access to only authorized users, services, and applications. For example, the separation between tenants is an essential security mechanism for multi-tenant cloud platforms such as Microsoft Azure. Logical isolation helps prevent one tenant from interfering with the operations of any other tenant.

#### Per-customer isolation

Azure implements network access control and segregation through layer 2 VLAN isolation, access control lists, load balancers, and IP filters.

Customers can further isolate their resources across subscriptions, resource groups, virtual networks, and subnets.

For more information on isolation in Microsoft Azure, see the [Isolation in the Azure Public Cloud](../security/fundamentals/isolation-choices.md).

## Next steps

Review the article on [Azure VPN Gateway](vpn-gateway.md)