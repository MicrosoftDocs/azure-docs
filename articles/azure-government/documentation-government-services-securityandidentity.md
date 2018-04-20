---
title: Azure Government Security + Identity | Microsoft Docs
description: This provides a comparision of features and guidance on developing applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: zakramer
manager: liki

ms.assetid: e2fe7983-5870-43e9-ae01-2d45d3102c8a
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 08/19/2017
ms.author: zsk0646

---
# Azure Government Security + Identity
## Key Vault
Key Vault is generally available in Azure Government.

For details on this service and how to use it, see the [Azure Key Vault public documentation](../key-vault/index.md).

### Data Considerations
The following information identifies the Azure Government boundary for Azure Key Vault:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
| All data encrypted with an Azure Key Vault key may contain Regulated/controlled data. |Azure Key Vault metadata is not permitted to contain export-controlled data. This metadata includes all configuration data entered when creating and maintaining your Key Vault.  Do not enter Regulated/controlled data into the following fields: **Resource group names, Key Vault names, Subscription name** |

## Azure Active Directory

For details on this service and how to use it, see the [Azure Active Directory Documentation](../active-directory/index.md).

## Azure Active Directory Premium P1 and P2 

Azure Active Directory Premium is available in Azure Government. For details on this service and how to use it, see the [Azure Active Directory Documentation](../active-directory/index.md).  

For a list of features in Azure Active Directory Premium P1, please see [Azure Active Directory Features](https://www.microsoft.com/cloud-platform/azure-active-directory-features) for a list of all capabilities available. This same feature list applies to the US Government cloud instance. 
All features covered in the above list are available in the US Government cloud instance, with the following known limitations: 

### Variations 

The following Azure Active Directory Premium P1 features are currently not available in Azure Government: 

 - B2B Collaboration ([vote for this feature](https://feedback.azure.com/forums/558487-azure-government/suggestions/20588554-azure-ad-b2b-in-azure-government)) 
 - Group-Based Licensing 
 - Azure Active Directory Domain Services 
 - Intune enabled Conditional Access scenarios 
 - Cloud App Security 

The following features have known limitations in Azure Government: 

 - Limitations with the Azure Active Directory App Gallery: 
    - Pre-integrated SAML and password SSO applications from the Azure AD Application Gallery are not yet available. Instead, please use a custom application to support federated single sign-on with SAML or password SSO. 
    - Rich provisioning connectors for featured apps are not yet available. Instead, please use SCIM for automated provisioning. 

 - Limitations with Multi-factor Authentication: 
   - Oath tokens, SMS, and Voice verification can be used as factors, though SMS and Voice traverse outside the Azure Government Cloud.
   - Trusted IPs are not supported in Azure Government. Instead, please use Conditional Access policies with named locations to establish when Multi-Factor Authentication should and should not be required based off the user’s current IP address. 

 - Limitations with Azure AD Join: 
   - Joining cloud and hybrid devices to Azure AD is not yet available 
   - Features related to Azure AD joined devices not yet available are Desktop SSO, Windows Hello and Self-service BitLocker recovery
   - MDM auto-enrollment for Windows 10 devices in Azure AD is not yet available 
   - Enterprise State Roaming for Windows 10 devices is not available  
   
## Azure Multi-Factor Authentication
For details on this service and how to use it, see the [Azure Multi-Factor Authentication Documentation](../active-directory/authentication/multi-factor-authentication.md). 

## Next Steps
For supplemental information and updates, subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>

