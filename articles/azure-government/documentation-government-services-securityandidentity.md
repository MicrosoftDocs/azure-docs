---
title: Azure Government Security + Identity | Microsoft Docs
description: This provides a comparision of features and guidance on developing applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: gsacavdm
manager: pathuff

ms.assetid: e2fe7983-5870-43e9-ae01-2d45d3102c8a
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 07/20/2018
ms.author: gsacavdm

---
# Azure Government Security + Identity
This article outlines the security and identity services variations and considerations for the Azure Government environment.

## Azure Security Center

Azure Security Center is available for public preview in Azure Government.  

For details on this service and how to use it, see the [Azure Security Center public documentation](../security-center/index.yml).  

### <a name="bkmk_ASCVariations"></a> Variations

The following variations and limitations are present in the Azure Security Center offering in Azure Government:  

- **Windows Defender Advanced Threat Protection (WDATP) alerts**
    - WDATP installation on Windows VMs via Security Center and the associated alerts are not available in Azure Government.  
- **Security incidents**
    - The aggregation of alerts for a resource, known as a security incident, is not available in Azure Government.
-  **Custom alerts**
    - The ability to create custom alerts from raw data is not available in Azure Government.
-  **Vulnerability assessments**
    - The Qualys Vulnerability Assessment agent is not available in Azure Government. 
-  **Email notifications for high severity alerts and JIT access**
    - Alerts and just-in-time access will function normally. However, email notifications are not available in Azure Government.
- **Adaptive application controls**
    - Application whitelisting is not available in Azure Government. Other cloud defense capabilities such as just-time-access (JIT) are available. Standard Azure RBAC roles will function normally.
-  **Specific detections**
    - Detections based on VM logs, Azure core router network logs, threat intelligence reports, and detections for app services are not available in Azure Government.  
- **Azure activity logs**
    -  Auditing insights from Azure activity logs are not available in Azure Government.
- **Baseline content server details**
    - Recommendations and details, such as the potential impact and countermeasures for baseline configuration vulnerabilities, are not available in Azure Government.
- **Security playbooks**
    - Playbooks for automated orchestration and response are not available in Azure Government.  
-  **Investigation**
    - The investigation feature linking security alerts, users, computers, and incidents is not available in Azure Government.
- **Threat intelligence enrichment**
    - Geo-enrichment and the threat intelligence option are not available in Azure Government.
- **Management Groups**
    - Azure management groups are not available in Azure Government and cannot be utilized by Azure Security Center in Azure Government. 

### Azure Security Center FAQs
 
For Azure Security Center FAQs, see [Azure Security Center frequently asked questions public documentation](../security-center/security-center-faq.md). Additional FAQs for Azure Security Center in Azure Government are listed below. 


**What will customers be charged for Azure Security Center in Azure Government?** </br>The Standard tier of Azure Security Center is free for the first 60 days. Should you choose to continue to use public preview or generally available Standard features beyond 60 days, we automatically start to charge for the service.

**What features are available for Azure Security Center government customers?**</br>A detailed list of feature variations in the Azure Security Center government offering can found in the [variations section](#bkmk_ASCVariations) of this article. All other Azure Security Center capabilities can be referenced in the [Azure Security Center public documentation](../security-center/index.yml).  

**What is the compliance commitment for Azure Security Center in Azure Government?**</br>Azure Security Center engineering has committed to the FedRAMP-High compliance standard with planned audit participation no later than February 2019. We will provide additional updates on this process and certification as this progresses. 

**Is Azure Security Center available for DoD customers?**</br>Azure Security Center is deployed on Azure Government regions but not DoD regions. Azure resources created in DoD regions can still utilize Security Center capabilities. However, using it will result in Security Center collected data being moved out from DoD regions and stored in Azure Government regions. By default, all Security Center features which collect and store data are disabled for resources hosted in DoD regions. The type of data collected and stored varies depending on the selected feature. Customers who want to enable Azure Security Center features for DoD resources are recommended to consider data residency before doing so. 

## Key Vault
Key Vault is generally available in Azure Government.

For details on this service and how to use it, see the [Azure Key Vault public documentation](../key-vault/index.yml).

### Variations

The URLs for accessing Key Vault in Azure Government are different:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| Key Vault | \*.vault.azure.net | \*.vault.usgovcloudapi.net |
| Service Principal ID| cfa8b339-82a2-471a-a3c9-0fc0be7a4093 | 7e7c393b-45d0-48b1-a35e-2905ddf8183c | 
| Service Principal Name | Azure Key Vault | Azure Key Vault |

### Data considerations
The following information identifies the Azure Government boundary for Azure Key Vault:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
| All data encrypted with an Azure Key Vault key may contain Regulated/controlled data. |Azure Key Vault metadata is not permitted to contain export-controlled data. This metadata includes all configuration data entered when creating and maintaining your Key Vault.  Do not enter Regulated/controlled data into the following fields: **Resource group names, Key Vault names, Subscription name** |

## Azure Active Directory
Azure Active Directory is generally available in Azure Government.

For details on this service and how to use it, see the [Azure Active Directory Documentation](../active-directory/index.md).

### Variations

The URLs for accessing Azure Active Directory in Azure Government are different:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| Active Directory Endpoint and Authority | https://login.microsoftonline.com | https://login.microsoftonline.us | 
| Active Directory Graph API| https://graph.windows.net/ | https://graph.windows.net/ |

## Azure Active Directory Premium P1 and P2 

Azure Active Directory Premium is available in Azure Government. For details on this service and how to use it, see the [Azure Active Directory Documentation](../active-directory/index.md).  

For a list of features in Azure Active Directory Premium P1, see [Azure Active Directory Features](https://www.microsoft.com/cloud-platform/azure-active-directory-features) for a list of all capabilities available. This same feature list applies to the US Government cloud instance. 
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
    - Pre-integrated SAML and password SSO applications from the Azure AD Application Gallery are not yet available. Instead, use a custom application to support federated single sign-on with SAML or password SSO. 
    - Rich provisioning connectors for featured apps are not yet available. Instead, use SCIM for automated provisioning. 

 - Limitations with Multi-factor Authentication: 
   - Oath tokens, SMS, and Voice verification can be used as factors, though SMS and Voice traverse outside the Azure Government Cloud.
   - Trusted IPs are not supported in Azure Government. Instead, use Conditional Access policies with named locations to establish when Multi-Factor Authentication should and should not be required based off the user’s current IP address. 

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

