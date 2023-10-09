---
title: Access Key Vault behind a firewall - Azure Key Vault | Microsoft Docs
description: Learn about the ports, hosts, or IP addresses to open to enable a key vault client application behind a firewall to access a key vault.
services: key-vault
author: mbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: how-to
ms.date: 04/15/2021
ms.author: mbaldwin

---
# Access Azure Key Vault behind a firewall

## What ports, hosts, or IP addresses should I open to enable my key vault client application behind a firewall to access key vault?

To access a key vault, your key vault client application has to access multiple endpoints for various functionalities:

* Authentication via Azure Active Directory (Azure AD).
* Management of Azure Key Vault. This includes creating, reading, updating, deleting, and setting access policies through Azure Resource Manager.
* Accessing and managing objects (keys and secrets) stored in Key Vault itself, going through the Key Vault-specific endpoint (for example, `https://yourvaultname.vault.azure.net`).  

Depending on your configuration and environment, there are some variations.

## Ports

All traffic to a key vault for all three functions (authentication, management, and data plane access) goes over HTTPS: port 443. However, there will occasionally be HTTP (port 80) traffic for CRL. Clients that support OCSP shouldn't reach CRL, but may occasionally reach CRL endpoints listed [here](../../security/fundamentals/azure-ca-details.md#certificate-downloads-and-revocation-lists).  

## Authentication

Key vault client applications will need to access Azure Active Directory endpoints for authentication. The endpoint used depends on the Azure AD tenant configuration, the type of principal (user principal or service principal), and the type of account--for example, a Microsoft account or a work or school account.  

| Principal type | Endpoint:port |
| --- | --- |
| User using Microsoft account<br> (for example, user@hotmail.com) |**Global:**<br> login.microsoftonline.com:443<br><br> **Microsoft Azure operated by 21Vianet:**<br> login.chinacloudapi.cn:443<br><br>**Azure US Government:**<br> login.microsoftonline.us:443<br><br>**Azure Germany:**<br> login.microsoftonline.de:443<br><br> and <br>login.live.com:443 |
| User or service principal using a work or school account with Azure AD (for example, user@contoso.com) |**Global:**<br> login.microsoftonline.com:443<br><br> **Microsoft Azure operated by 21Vianet:**<br> login.chinacloudapi.cn:443<br><br>**Azure US Government:**<br> login.microsoftonline.us:443<br><br>**Azure Germany:**<br> login.microsoftonline.de:443 |
| User or service principal using a work or school account, plus Active Directory Federation Services (AD FS) or other federated endpoint (for example, user@contoso.com) |All endpoints for a work or school account, plus AD FS or other federated endpoints |

There are other possible complex scenarios. Refer to [Azure Active Directory Authentication Flow](../../active-directory/develop/authentication-vs-authorization.md), [Integrating Applications with Azure Active Directory](../../active-directory/develop/how-to-integrate.md), and [Active Directory Authentication Protocols](/previous-versions/azure/dn151124(v=azure.100)) for additional information.  

## Key Vault management

For Key Vault management (CRUD and setting access policy), the key vault client application needs to access an Azure Resource Manager endpoint.  

| Type of operation | Endpoint:port |
| --- | --- |
| Key Vault control plane operations<br> via Azure Resource Manager |**Global:**<br> management.azure.com:443<br><br> **Microsoft Azure operated by 21Vianet:**<br> management.chinacloudapi.cn:443<br><br> **Azure US Government:**<br> management.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> management.microsoftazure.de:443 |
| Microsoft Graph API |**Global:**<br> graph.microsoft.com:443<br><br> **Microsoft Azure operated by 21Vianet:**<br> graph.chinacloudapi.cn:443<br><br> **Azure US Government:**<br> graph.microsoft.com:443<br><br> **Azure Germany:**<br> graph.cloudapi.de:443 |

## Key Vault operations

For all key vault object (keys and secrets) management and cryptographic operations, the key vault client needs to access the key vault endpoint. The endpoint DNS suffix varies depending on the location of your key vault. The key vault endpoint is of the format *vault-name*.*region-specific-dns-suffix*, as described in the following table.  

| Type of operation | Endpoint:port |
| --- | --- |
| Operations including cryptographic operations on keys; creating, reading, updating, and deleting keys and secrets; setting or getting tags and other attributes on key vault objects (keys or secrets) |**Global:**<br> &lt;vault-name&gt;.vault.azure.net:443<br><br> **Microsoft Azure operated by 21Vianet:**<br> &lt;vault-name&gt;.vault.azure.cn:443<br><br> **Azure US Government:**<br> &lt;vault-name&gt;.vault.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> &lt;vault-name&gt;.vault.microsoftazure.de:443 |

## IP address ranges

The Key Vault service uses other Azure resources like PaaS infrastructure. So it's not possible to provide a specific range of IP addresses that Key Vault service endpoints will have at any particular time. If your firewall supports only IP address ranges, refer to  Microsoft Azure Datacenter IP Ranges documents available at:
* [Public](https://www.microsoft.com/en-us/download/details.aspx?id=56519)
* [US Gov](https://www.microsoft.com/en-us/download/details.aspx?id=57063)
* [Germany](https://www.microsoft.com/en-us/download/details.aspx?id=57064)
* [China](https://www.microsoft.com/en-us/download/details.aspx?id=57062)

Authentication and Identity (Azure Active Directory) is a global service and may fail over to other regions or move traffic without notice. In this scenario, all of the IP ranges listed in [Authentication and Identity IP Addresses](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2#bkmk_identity_ip) should be added to the firewall.

## Next steps

If you have questions about Key Vault, visit the [Microsoft Q&A question page for Azure Key Vault](/answers/topics/azure-key-vault.html).
