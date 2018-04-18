
---
title: Azure Stack Public Key Infrastructure certificate requirements for Azure Stack integrated systems | Microsoft Docs
description: Describes the Azure Stack PKI certificate deployment requirements for Azure Stack integrated systems.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/20/2018
ms.author: jeffgilb
ms.reviewer: ppacent
---

# Azure Stack Public Key Infrastructure certificate requirements
Azure Stack has a public infrastructure network using externally accessible public IP addresses assigned to a small set of Azure Stack services and possibly tenant VMs. PKI certificates with the appropriate DNS names for these Azure Stack public infrastructure endpoints are required during Azure Stack deployment. This article provides information about:

- What certificates are required to deploy Azure Stack
- The process of obtaining certificates matching those specifications
- How to prepare, validate, and use those certificates during deployment

> [!NOTE]
> During deployment you must copy certificates to the deployment folder that matches the identity provider you are deploying against (Azure AD or AD FS). If you use a single certificate for all endpoints, you must copy that certificate file into each deployment folder as outlined in the tables below. The folder structure is pre-built in the deployment virtual machine and can be found at: C:\CloudDeployment\Setup\Certificates. 

## Certificate requirements
The following list describes the certificate requirements that are needed to deploy Azure Stack: 
- Certificates must be issued from either an internal Certificate Authority or a Public Certificate Authority. If a public certificate authority is used, it must be included in the base operating system image as part of the Microsoft Trusted Root Authority Program. You can find the full list here: https://gallery.technet.microsoft.com/Trusted-Root-Certificate-123665ca 
- The certificate can be a single wild card certificate covering all name spaces in the Subject Alternative Name (SAN) field. Alternatively, you can use individual certificates using wild cards for endpoints such as acs and Key Vault where they are required. 
- The certificate signature algorithm cannot be SHA1, as it must be stronger. 
- The certificate format must be PFX, as both the public and private keys are required for Azure Stack installation. 
- The certificate pfx files must have a value "Digital Signature" and "KeyEncipherment" in its “Key Usage" field.
- The certificate pfx files must have the values “Server Authentication (1.3.6.1.5.5.7.3.1)” and “Client Authentication (1.3.6.1.5.5.7.3.2)” in the "Enhanced Key Usage" field.
- The passwords to all certificate pfx files must be the same at the time of deployment
- Ensure that the Subject Names and Subject Alternative Names of all certificates match the specifications described in this article to avoid failed deployments.

> [!NOTE]
> The presence of Intermediary Certificate Authorities in a certificate's chain-of-trusts IS supported. 

## Mandatory certificates
The table in this section describes the Azure Stack public endpoint PKI certificates that are required for both Azure AD and AD FS Azure Stack deployments. Certificate requirements are grouped by area, as well as the namespaces used and the certificates that are required for each namespace. The table also describes the folder in which your solution provider copies the different certificates per public endpoint. 

Certificates with the appropriate DNS names for each Azure Stack public infrastructure endpoint are required. Each endpoint’s DNS name is expressed in the format: *&lt;prefix>.&lt;region>.&lt;fqdn>*. 

For your deployment, the [region] and [externalfqdn] values must match the region and external domain names that you chose for your Azure Stack system. As an example, if the region name was *Redmond* and the external domain name was *contoso.com*, the DNS names would have the format *&lt;prefix>.redmond.contoso.com*. The *&lt;prefix>* values are predesignated by Microsoft to describe the endpoint secured by the certificate. In addition, the *&lt;prefix>* values of the external infrastructure endpoints depend on the Azure Stack service that uses the specific endpoint. 

|Deployment folder|Required certificate subject and subject alternative names (SAN)|Scope (per region)|SubDomain namespace|
|-----|-----|-----|-----|
|Public Portal|portal.*&lt;region>.&lt;fqdn>*|Portals|*&lt;region>.&lt;fqdn>*|
|Admin Portal|adminportal.*&lt;region>.&lt;fqdn>*|Portals|*&lt;region>.&lt;fqdn>*|
|Azure Resource Manager Public|management.*&lt;region>.&lt;fqdn>*|Azure Resource Manager|*&lt;region>.&lt;fqdn>*|
|Azure Resource Manager Admin|adminmanagement.*&lt;region>.&lt;fqdn>*|Azure Resource Manager|*&lt;region>.&lt;fqdn>*|
|ACS<sup>1</sup>|One multi-subdomain wildcard certificate with Subject Alternative names for:<br>&#42;.blob.*&lt;region>.&lt;fqdn>*<br>&#42;.queue.*&lt;region>.&lt;fqdn>*<br>&#42;.table.*&lt;region>.&lt;fqdn>*|Storage|blob.*&lt;region>.&lt;fqdn>*<br>table.*&lt;region>.&lt;fqdn>*<br>queue.*&lt;region>.&lt;fqdn>*|
|KeyVault|&#42;.vault.*&lt;region>.&lt;fqdn>*<br>(Wildcard SSL Certificate)|Key Vault|vault.*&lt;region>.&lt;fqdn>*|
|KeyVaultInternal|&#42;.adminvault.*&lt;region>.&lt;fqdn>*<br>(Wildcard SSL Certificate)|Internal Keyvault|adminvault.*&lt;region>.&lt;fqdn>*|
|
<sup>1</sup> The ACS certificate requires three wildcard SANs on a single certificate. Multiple wildcard SANs on a single certificate might not be supported by all Public Certificate Authorities. 

If you deploy Azure Stack using the Azure AD deployment mode, you only need to request the certificates listed in previous table. However, if you deploy Azure Stack using the AD FS deployment mode, you must also request the certificates described in the following table:

|Deployment folder|Required certificate subject and subject alternative names (SAN)|Scope (per region)|SubDomain namespace|
|-----|-----|-----|-----|
|ADFS|adfs.*&lt;region>.&lt;fqdn>*<br>(SSL Certificate)|ADFS|*&lt;region>.&lt;fqdn>*|
|Graph|graph.*&lt;region>.&lt;fqdn>*<br>(SSL Certificate)|Graph|*&lt;region>.&lt;fqdn>*|
|

> [!IMPORTANT]
> All the certificates listed in this section must have the same password. 

## Optional PaaS certificates
If you are planning to deploy the additional Azure Stack PaaS services (SQL, MySQL, and App Service) after Azure Stack has been deployed and configured, you will need to request additional certificates to cover the endpoints of the PaaS services. 

> [!IMPORTANT]
> The certificates that you use for App Service, SQL, and MySQL resource providers need to have the same root authority as those used for the global Azure Stack endpoints. 

The following table describes the endpoints and certificates required for the SQL and MySQL adapters and for App Service. You don’t need to copy these certificates to the Azure Stack deployment folder. Instead, you provide these certificates when you install the additional resource providers. 

|Scope (per region)|Certificate|Required certificate subject and Subject Alternative Names (SANs)|SubDomain namespace|
|-----|-----|-----|-----|
|SQL, MySQL|SQL and MySQL|&#42;.dbadapter.*&lt;region>.&lt;fqdn>*<br>(Wildcard SSL Certificate)|dbadapter.*&lt;region>.&lt;fqdn>*|
|App Service|Web Traffic Default SSL Cert|&#42;.appservice.*&lt;region>.&lt;fqdn>*<br>&#42;.scm.appservice.*&lt;region>.&lt;fqdn>*<br>(Multi Domain Wildcard SSL Certificate<sup>1</sup>)|appservice.*&lt;region>.&lt;fqdn>*<br>scm.appservice.*&lt;region>.&lt;fqdn>*|
|App Service|API|api.appservice.*&lt;region>.&lt;fqdn>*<br>(SSL Certificate<sup>2</sup>)|appservice.*&lt;region>.&lt;fqdn>*<br>scm.appservice.*&lt;region>.&lt;fqdn>*|
|App Service|FTP|ftp.appservice.*&lt;region>.&lt;fqdn>*<br>(SSL Certificate<sup>2</sup>)|appservice.*&lt;region>.&lt;fqdn>*<br>scm.appservice.*&lt;region>.&lt;fqdn>*|
|App Service|SSO|sso.appservice.*&lt;region>.&lt;fqdn>*<br>(SSL Certificate<sup>2</sup>)|appservice.*&lt;region>.&lt;fqdn>*<br>scm.appservice.*&lt;region>.&lt;fqdn>*|

<sup>1</sup> Requires one certificate with multiple wildcard subject alternative names. Multiple wildcard SANs on a single certificate might not be supported by all Public Certificate Authorities 

<sup>2</sup> A &#42;.appservice.*&lt;region>.&lt;fqdn>* wild card certificate cannot be used in place of these three certificates (api.appservice.*&lt;region>.&lt;fqdn>*, ftp.appservice.*&lt;region>.&lt;fqdn>*, and sso.appservice.*&lt;region>.&lt;fqdn>*. Appservice explicitly requires the use of separate certificates for these endpoints. 

## Learn more
Learn how to [generate PKI certificates for Azure Stack deployment](azure-stack-get-pki-certs.md). 

## Next steps
[Identity integration](azure-stack-integrate-identity.md)

