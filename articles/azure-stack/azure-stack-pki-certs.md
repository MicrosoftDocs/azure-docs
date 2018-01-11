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
ms.date: 01/15/2018
ms.author: jeffgilb

---
# Azure Stack Public Key Infrastructure certificate requirements
Azure Stack has a public infrastructure network using externally accessible public IP addresses assigned to a small set of Azure Stack services and possibly tenant VMs. PKI certificates with the appropriate DNS names for these Azure Stack public infrastructure endpoints are required during Azure Stack deployment. This article provides information about:

- What certificates are required to deploy Azure Stack
- The process of obtaining certificates matching those specifications
- How to prepare, validate, and use those certificates during deployment

## Certificate requirements
The following list describes the certificate requirements that are needed to deploy Azure Stack: 
- Certificates must be issued from either an internal Certificate Authority or a Public Certificate Authority who is included in the base operating system image as part of the Microsoft Trusted Root Authority Program. You can find the full list here: https://gallery.technet.microsoft.com/Trusted-Root-Certificate-123665ca 
- The certificate can be a single wild card certificate covering all name spaces in the Subject Alternative Name (SAN) field. Alternatively, you can use individual certificates using wild cards for endpoints such as storage and Key Vault where they are required. 
- The certificate signature algorithm cannot be SHA1, as it must be stronger. 
- The certificate format must be PFX, as both the public and private keys are required for Azure Stack installation. 
- The certificate pfx files must have a value "Digital Signature" and "KeyEncipherment" in its “Key Usage" field.
- The passwords to all certificate pfx files must be the same at the time of deployment
- Ensure that the Subject Names and Subject Alternative Names of all certificates match the specifications described in this article to avoid failed deployments.

> [!NOTE]
> The presence of Intermediary Certificate Authorities in a certificate's chain-of-trusts IS supported. 

## Mandatory certificates
The table in this section describes the Azure Stack public endpoint PKI certificates that are required for both Azure AD and AD FS Azure Stack deployments. Certificate requirements are grouped by area, as well as the namespaces used and the certificates that are required for each namespace. The table also describes the folder in which your solution provider will copy the different certificates per public endpoint. 

You must provide certificates with the appropriate DNS names for the different Azure Stack public infrastructure endpoints. Each endpoint’s DNS name is expressed in the format: *PREFIX.REGION.EXTERNALFQDN*. 

For your deployment, the *REGION* and *EXTERNALFQDN* values must match the region and external domain names that you chose for your Azure Stack system. As an example, if my region name was *Redmond* and my external domain name was *Contoso.com*, my DNS names would have the format *PREFIX.redmond.contoso.com*. *PREFIX* values are predesignated by Microsoft to describe the endpoint secured by the certificate. 
The *PREFIX* values of the external infrastructure endpoints depend on the Azure Stack service that uses the specific endpoint. 

|Deployment folder|Required certificate subject and subject alternative names (SAN)|Scope (per region)|SubDomain namespace|
|-----|-----|-----|-----|
|Public Portal|portal.*REGION.EXTERNALFQDN*|Portals|*REGION.EXTERNALFQDN*|
|Admin Portal|adminportal.*REGION.EXTERNALFQDN*|Portals|*REGION.EXTERNALFQDN*|
|ARM Public|management.*REGION.EXTERNALFQDN*|ARM|*REGION.EXTERNALFQDN*|
|ARM Admin|adminmanagement.*REGION.EXTERNALFQDN*|ARM|*REGION.EXTERNALFQDN*|
|ACS<sup>1</sup>|One multi-subdomain wildcard certificate with Subject Alternative names for: * .blob.*REGION.EXTERNALFQDN*, * .queue.*REGION.EXTERNALFQDN*, and * .table.*REGION.EXTERNALFQDN*|Storage|blob.*REGION.EXTERNALFQDN*, table.*REGION.EXTERNALFQDN*, and queue.*REGION.EXTERNALFQDN*|
|KeyVault|* .vault.*REGION.EXTERNALFQDN* (Wildcard SSL Certificate)|Key Vault|vault.*REGION.EXTERNALFQDN*|
|KeyVaultInternal|* .adminvault.*REGION.EXTERNALFQDN* (Wildcard SSL Certificate)|Internal Keyvault|adminvault.*REGION.EXTERNALFQDN*|
|

<sup>1</sup> The ACS certificate requires three wildcard SANs on a single certificate. This may not be supported by all Public Certificate Authorities. 

If you deploy Azure Stack using the Azure AD deployment mode, you only need to request the certificates listed in previous table. However, if you deploy Azure Stack using the AD FS deployment mode, you must also request the certificates described in the following table:

|Deployment folder|Required certificate subject and subject alternative names (SAN)|Scope (per region)|SubDomain namespace|
|-----|-----|-----|-----|
|ADFS|adfs.*REGION.EXTERNALFQDN* (SSL Certificate)|ADFS|*REGION.EXTERNALFQDN*|
|Graph|graph.*REGION.EXTERNALFQDN* (SSL Certificate)|Graph|*REGION.EXTERNALFQDN*|
|

> [!IMPORTANT]
> All the certificates listed in this section must have the same password. 

## Optional PaaS certificates
If you are planning to deploy the additional Azure Stack PaaS services (SQL, MySQL and App Service) after Azure Stack has been deployed and configured, you will need to request additional certificates to cover the endpoints of the PaaS services. 

> [!IMPORTANT]
> The certificates that you use for App Service and SQL/MySQL resource providers need to have the same root authority as those used for the public Azure Stack endpoints. 

The following table describes the endpoints and certificates required for the SQL/MySQL Adapters and for App Service. You don’t need to copy these certificates to the Azure Stack deployment folder. Instead, you will be asked to provide these certificates when you install the additional resource providers. 

|Scope (per region)|Certificate|Required certificate subject and subject alternative names (SAN)|SubDomain namespace|
|-----|-----|-----|-----|
|SQL, MySQL|SQL and MySQL|* .dbadapter.*REGION.EXTERNALFQDN* (Wildcard SSL Certificate)|dbadapter.*REGION.EXTERNALFQDN*|
|App Service|Web Traffic Default SSL Cert|* .appservice.*REGION.EXTERNALFQDN*, * .scm.appservice.*REGION.EXTERNALFQDN* (Multi Domain Wildcard SSL Certificate<sup>1</sup>)|appservice.*REGION.EXTERNALFQDN* and scm.appservice.*REGION.EXTERNALFQDN*|
|App Service|API|api.appservice.*REGION.EXTERNALFQDN* (SSL Certificate<sup>2</sup>)|appservice.*REGION.EXTERNALFQDN* and scm.appservice.*REGION.EXTERNALFQDN*|
|App Service|FTP|ftp.appservice.*REGION.EXTERNALFQDN* (SSL Certificate<sup>2</sup>)|appservice.*REGION.EXTERNALFQDN* and scm.appservice.*REGION.EXTERNALFQDN*|
|App Service|SSO|sso.appservice.*REGION.EXTERNALFQDN* (SSL Certificate<sup>2</sup>)|appservice.*REGION.EXTERNALFQDN* and scm.appservice.*REGION.EXTERNALFQDN*|

<sup>1</sup> Requires one certificate with multiple wildcard subject alternative names. This may not be supported by all Public Certificate Authorities 

<sup>2</sup> An * .appservice.*REGION.EXTERNALFQDN* wild card certificate cannot be used in place of these three certificates (api.appservice.*REGION.EXTERNALFQDN*, ftp.appservice.*REGION.EXTERNALFQDN*, and sso.appservice.*REGION.EXTERNALFQDN*. Appservice explicitly requires the use of separate certificates for these endpoints. 


## Next steps
[Generate PKI certificates for Azure Stack deployment](azure-stack-get-pki-certs.md) 


