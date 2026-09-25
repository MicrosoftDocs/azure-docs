---
title: Understand Microsoft Entra Kerberos hybrid and cloud-only identities in Azure NetApp Files 
description: Understand the concept of Entra Kerberos hybrid and cloud-only identities in Azure NetApp Files 
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 06/29/2026
ms.author: anfdocs
ms.custom: references_regions
---

# Understand Microsoft Entra Kerberos with Azure NetApp Files (preview)

Azure NetApp Files supports Microsoft Entra Kerberos authentication for SMB volumes. Windows clients can access SMB shares by using either hybrid identities (on-premises identities synchronized to Microsoft Entra ID) or cloud-only identities (identities that exist only in Microsoft Entra ID).

This article provides recommendations to help you develop a Microsoft Entra ID deployment strategy for Azure NetApp Files. 

> [!NOTE]
> Microsoft Entra ID support in Azure NetApp Files applies to SMB volumes only. NFS, dual-protocol, and NFSv4.1 Kerberos volumes continue to rely on Active Directory Domain Services (AD DS).

## Microsoft Entra Kerberos authentication requirements for Azure NetApp Files

Before you deploy Azure NetApp Files SMB volumes that use Microsoft Entra Kerberos authentication, identify the integration requirements to ensure that Azure NetApp Files is well connected to Microsoft Entra ID.

### Supported authentication scenarios

Azure NetApp Files supports identity-based authentication over SMB by using Microsoft Entra Kerberos authentication through the following identity types:

**Hybrid identities**  
Hybrid identities are user accounts that originate in on-premises Active Directory Domain Services (AD DS) and synchronize to Microsoft Entra ID. This synchronization creates a single, common identity that you can use to authenticate and authorize access to both on-premises and cloud resources.

**Cloud-only identities**    
Cloud-only identities are user accounts that are created and managed exclusively in Microsoft Entra ID, with no on-premises footprint. These users can access Azure NetApp Files SMB shares using their Microsoft Entra ID credentials.

:::image type="content" source="./media/entra-kerberos-authentication-for-hybrid-identities/authentication-scenarios.png" alt-text="Screenshot displaying the different supported authentication scenarios." lightbox="./media/entra-kerberos-authentication-for-hybrid-identities/authentication-scenarios.png":::

> [!NOTE]
> Microsoft Entra Kerberos handles the authentication. Therefore, you don't need to extend an on-premises AD DS into Azure, and you don't need line-of-sight network connectivity between Azure NetApp Files and on-premises domain controllers. This requirement is the primary architectural difference compared to AD DS–based SMB volumes.

### Network requirements

For predictable Microsoft Entra Kerberos authentication operations with Azure NetApp Files SMB volumes, you need reliable network connectivity to the Microsoft Graph endpoint. Azure NetApp Files uses the Microsoft Graph endpoint for certificate-based authentication with Microsoft Entra Kerberos authentication. Poor connectivity to this endpoint can cause authentication failures or volume creation failures. Because the Microsoft Graph and Microsoft Entra ID endpoints are public (internet) endpoints, you must provide outbound internet routing from the virtual network so that Azure NetApp Files can reach them.

Ensure that you meet the following requirements for network topology and configuration:

* Use a supported network topology for Azure NetApp Files.
* Deploy a NAT gateway on the virtual network to provide outbound routing of Azure NetApp Files traffic to the Microsoft Entra Kerberos and Microsoft Graph endpoints.
* Ensure that Azure NetApp Files has outbound connectivity to the Microsoft Graph endpoint for your cloud over HTTPS (TCP 443).
* Configure Network Security Groups (NSGs), User Defined Routes (UDRs), and any Network Virtual Appliances or firewalls so they don't block Azure NetApp Files connectivity to the Microsoft Graph endpoint.

> [!IMPORTANT]
> You need a NAT gateway to route Azure NetApp Files traffic to Microsoft Entra ID. Only the Standard SKU NAT gateway is supported.

### Create and associate the NAT gateway before you create SMB volumes that use Microsoft Entra Kerberos authentication

The required outbound connectivity is to the Microsoft Graph endpoint that corresponds to your Azure cloud environment:

|    Azure cloud environment   |    Microsoft Graph endpoint   |    Port    |  Protocol    |
|-|-|-|-|
| Azure public (global) | graph.microsoft.com  |    443 |   TCP (HTTPS) |

> [!NOTE]
> The endpoint that must be reachable depends on the Azure cloud environment. Ensure that your firewall and NSG rules allow HTTPS connectivity to the endpoint that corresponds to your cloud.

## When to use Microsoft Entra ID authentication with Azure NetApp Files

Azure NetApp Files supports Microsoft Entra ID, Active Directory Domain Services (AD DS), and Microsoft Entra Domain Services for SMB access. Before you create an SMB volume, decide which identity solution best fits your requirements.

**Microsoft Entra Kerberos considerations**

Consider Microsoft Entra Kerberos authentication for Azure NetApp Files SMB volumes in the following scenarios:

* You manage your users as cloud-only identities in Microsoft Entra ID, or as hybrid identities synchronized from on-premises AD DS into Microsoft Entra ID.
* You want to avoid extending on-premises AD DS into Azure, or your security policies don't allow it.
* You don't require NFS, dual-protocol, or NFSv4.1 Kerberos volumes (which require AD DS).
* You want a simplified deployment that doesn't depend on line-of-sight connectivity to on-premises domain controllers.

The main benefits of using Microsoft Entra Kerberos authentication are:

* No requirement to deploy or maintain domain controllers, or to establish connectivity between on-premises and Azure for authentication.
* Simplified deployment and management for cloud-centric environments.
* Support for both hybrid and cloud-only identities over SMB.

**AD DS considerations**

Continue to use AD DS (rather than Microsoft Entra Kerberos authentication) when:

* You require NFS, dual-protocol, or NFSv4.1 Kerberos volumes.
* Your access model depends on on-premises domain controllers being directly contacted for authentication.

## How Azure NetApp Files uses Microsoft Entra Kerberos authentication

To use Microsoft Entra Kerberos authentication with Azure NetApp Files SMB volumes, register a single primary application in your Microsoft Entra tenant, grant it the required permissions, and provide its configuration to Azure NetApp Files. Azure NetApp Files stores this configuration as a reusable Entra ID configuration object that you can associate with one or more SMB volumes.

Configure the primary application with a certificate, and store the corresponding private key in an Azure Key Vault (AKV) that you provision. Azure NetApp Files retrieves the private key from your Azure Key Vault to sign a client assertion (a signed JSON Web Token), and exchanges that assertion for an access token from Microsoft Entra ID. Use the token to authenticate against the Microsoft Graph endpoint.

A Microsoft Entra ID connection for Azure NetApp Files consists of the following components:

* **Application ID** - To use REST or Microsoft Graph API, you need OAuth 2.0 tokens. Configure the application ID as part of the prerequisite with the required permission and certificate.
* **Domain Name** - Domain of Active Directory that's synced with Entra ID for hybrid identities or any custom domain. 
* **Azure Key Vault URI** - Azure Key Vault URI to fetch the certificate and private key to get tokens. The public certificate of this PFX certificate must match the one you upload during registration. 
* **Certificate name** - Enter the certificate name from Azure Key Vault that's associated with your app registration.
* **SMB server prefix** - The naming prefix for a new application created on the Entra ID. This is the FQDN through which you mount the SMB volume. 

> [!IMPORTANT]
> To configure a Microsoft Entra ID connection for Azure NetApp Files, you need the primary application (with its granted permissions), the domain name, the certificate, and the Azure Key Vault URI holding the private key. Incomplete configuration prevents the creation and management of SMB volumes that use Microsoft Entra ID.

### Microsoft Entra ID connection lifecycle

A Microsoft Entra ID connection object has a lifecycle state that reflects how it's being used:

* **Created** - the connection is created and available for use.
* **In use** - the connection is associated with one or more SMB volumes.
* **Deleted** - the connection is removed.
* **Error** - the connection is in an error state and requires attention.

> [!NOTE]
> A connection that's in use is associated with active SMB volumes. Plan connection changes carefully, and ensure that you account for any dependent volumes before modifying or deleting a connection.

## Regional cloud considerations

Microsoft Entra ID and Microsoft Graph endpoints differ by Azure cloud environment. When planning network connectivity, ensure that the endpoints reachable through your NAT gateway match your cloud:

* Azure public (global) cloud

Use the endpoints that correspond to your environment when configuring your NAT gateway, firewall, and NSG rules.

## Cross-region replication considerations

Azure NetApp Files cross-region replication enables you to replicate volumes from one region to another to support business continuance and disaster recovery (BC/DR) requirements.

For SMB volumes that use Microsoft Entra ID, replication requires:

* A NetApp account in both the source and destination regions.
* A Microsoft Entra ID configuration available in the destination region, including reachability to the Azure Key Vault holding the primary application’s private key.
* A NAT gateway and proper network configuration in the destination region so that Azure NetApp Files has outbound HTTPS connectivity to the Microsoft Graph endpoint that corresponds to the destination region’s cloud environment.

  ## Next steps

* [Configure Microsoft Entra Kerberos authentication with Azure NetApp Files](configure-entra-kerberos-authentication-for-hybrid-cloud-identities.md)
