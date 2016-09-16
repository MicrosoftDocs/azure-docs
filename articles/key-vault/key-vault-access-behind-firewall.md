<properties
	pageTitle="Accessing Key Vault behind firewall | Microsoft Azure"
	description="Learn how to access Key Vault from an application behind a firewall"
	services="key-vault"
	documentationCenter=""
	authors="amitbapat"
	manager="mbaldwin"
	tags="azure-resource-manager"/>

<tags
	ms.service="key-vault"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="09/13/2016"
	ms.author="ambapat"/>

# Accessing Key Vault behind firewall
### Q: My key vault client application needs to be behind a firewall, what ports/hosts/IP addresses should I open to enable access to key vault?

To access a key vault your key vault client application needs to be able to access multiple end-points for various functionalities.

- Authentication (via Azure Active Directory)
- Management of Key Vault (which includes create/read/update/delete and also setting access policies) through Azure Resource Manager
- Accessing and managing objects (keys and secrets) stored in key vault itself, goes through the key vault specific end point (e.g. [https://yourvaultname.vault.azure.net](https://yourvaultname.vault.azure.net)).  

Depending on your configuration and environment, there are some variations.   

## Ports

All traffic to key vault for all the 3 functions (authentication, management and data plane access) goes over HTTPS: Port 443. However for CRL, there will be occasionally HTTP (port 80) traffic. Clients that support OCSP shouldn't reach CRL, but may occasionally reach [http://cdp1.public-trust.com/CRL/Omniroot2025.crl](http://cdp1.public-trust.com/CRL/Omniroot2025.crl).  

## Authentication

Key Vault client application will need to access Azure Active Directory endpoints for authentication. The endpoint used depends on the AAD tenant configuration and the type of principal -- user principal, service principal and the type of account, e.g. Microsoft Account or Org ID.  

| Principal Type | Endpoint:port |
|----------------|---------------|
| User using Microsoft Account<br> (e.g. user@hotmail.com) | **Global:**<br> login.microsoftonline.com:443<br><br> **Azure China:**<br> login.chinacloudapi.cn:443<br><br>**Azure US Government:**<br> login-us.microsoftonline.com:443<br><br>**Azure Germany:**<br> login.microsoftonline.de:443<br><br> and <br>login.live.com:443   |
| User/Service principal using Org ID with AAD (e.g. user@contoso.com) | **Global:**<br> login.microsoftonline.com:443<br><br> **Azure China:**<br> login.chinacloudapi.cn:443<br><br>**Azure US Government:**<br> login-us.microsoftonline.com:443<br><br>**Azure Germany:**<br> login.microsoftonline.de:443 |
| User/Service principal using Org ID+ADFS or other federated endpoint (e.g. user@contoso.com) | All the above endpoints for Org ID plus ADFS or other federated endpoints |

There are other possible complex scenarios. Please refer to [Azure Active Directory Authentication Flow](/documentation/articles/active-directory-authentication-scenarios/), [Integrating Applications with Azure Active Directory](/documentation/articles/active-directory-integrating-applications/) and [Active Directory Authentication Protocols](https://msdn.microsoft.com/library/azure/dn151124.aspx) for additional information.  

## Key Vault Management

For Key Vault Management (CRUD and setting access policy), the key vault client application needs to access Azure Resource Manager endpoint.  

| Type of operation | Endpoint:port |
|----------------|---------------|
| Key Vault Control Plane operations<br> via Azure Resource Manager | **Global:**<br> management.azure.com:443<br><br> **Azure China:**<br> management.chinacloudapi.cn:443<br><br> **Azure US Government:**<br> management.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> management.microsoftazure.de:443 |
| Azure Active Directory Graph API | **Global:**<br> graph.windows.net:443<br><br> **Azure China:**<br> graph.chinacloudapi.cn:443<br><br> **Azure US Government:**<br> graph.windows.net:443<br><br> **Azure Germany:**<br> graph.cloudapi.de:443 |

## Key Vault Operations

For all key vault object (keys and secrets) management and cryptographic operations, key vault client needs to access the key vault end point. Depending on the location of your Key Vault, the endpoint DNS suffix is different. The Key Vault end point is of the format: <vault-name>.<region-specific-dns-suffix> as described in the table below.  

| Type of operation | Endpoint:port |
|----------------|---------------|
| Key Vault operations like cryptographic operations on keys, Created/read/update/delete keys and secrets, set/get tags and other attributes on key vault objects (keys/secrets)     | **Global:**<br> &lt;vault-name&gt;.vault.azure.net:443<br><br> **Azure China:**<br> &lt;vault-name&gt;.vault.azure.cn:443<br><br> **Azure US Government:**<br> &lt;vault-name&gt;.vault.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> &lt;vault-name&gt;.vault.microsoftazure.de:443 |

## IP Address Ranges
Key Vault service in turn uses other Azure resources like PaaS infrastructure, hence it's not possible to provide a specific range of IP addresses that key vault service endpoints will have at any given time. However if your firewall only supports IP address ranges then please refer to the [Microsoft Azure Datacenter IP Ranges](https://www.microsoft.com/download/details.aspx?id=41653) document.   For authentication and identity (Azure Active Directory), your application must be able to connect to the endpoints described in [Authentication and identity Addresses](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2).
