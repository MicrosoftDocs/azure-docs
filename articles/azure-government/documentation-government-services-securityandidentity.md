---
title: Azure Government Security + Identity | Microsoft Docs
description: This provides a comparison of features and guidance on developing applications for Azure Government
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
ms.date: 03/24/2019
ms.author: gsacavdm

---
# Azure Government Security + Identity

This article outlines the security and identity services variations and considerations for the Azure Government environment.

## Azure Security Center

Azure Security Center is generally available in Azure Government. Preview features available in the Azure Security Center commercial environment may not be supported in Azure Government.  

For details on this service and how to use it, see the [Azure Security Center public documentation](../security-center/index.yml).  

### 1st and 3rd party integrations

- **3rd party vulnerability assessments**  
The Qualys Vulnerability Assessment agent is not available.
  > [!NOTE]
  > Security Center internal assessments *are* provided to discover security misconfigurations, based on Common Configuration Enumeration such as password policy, windows FW rules, local machine audit and security policy, and additional OS hardening settings.

- **Windows Defender Advanced Threat Protection alerts**  
Windows Defender ATP installation on Windows VMs via Security Center and the associated alerts are not available.

### Alerts and notifications

- **Email notifications for high severity alerts and JIT access**  
Alerts and just-in-time access will function normally. However, email notifications are not available.

- **Azure activity logs**  
User activity in Security Center is not logged in Azure activity logs in Microsoft Azure Government. This means that there’s no trace or audit for user performed actions.

### Threat detection

- **Specific detections**  
Detections based on VM log periodic batches, Azure core router network logs, threat intelligence reports, and detections for app services are not available.

  > [!NOTE]
  > Near real-time alerts generated based on security events and raw data collected from the VMs *are* captured and displayed.

- **Security incidents**  
The aggregation of alerts for a resource, known as a security incident, is not available.

- **Threat intelligence enrichment**  
Geo-enrichment and the threat intelligence option are not available.

- **UEBA for Azure resources**  
Integration with Microsoft Cloud App Security for user and entity behavior analytics on Azure resources is not available.

### Server protection

- **OS Security Configuration**  
Vulnerability specific metadata, such as the potential impact and countermeasures for OS security configuration vulnerabilities, is not available.

### Azure Security Center FAQs

For Azure Security Center FAQs, see [Azure Security Center frequently asked
questions public documentation](https://docs.microsoft.com/azure/security-center/security-center-faq).

Additional FAQs for Azure Security Center in Azure Government are listed below.

**What will customers be charged for Azure Security Center in Azure Government?**

The Standard tier of Azure Security Center is free for the first 30 days. Should you choose to continue to use public preview or generally available Standard features beyond 30 days, we automatically start to charge for the service.

**What features are available for Azure Security Center government customers?**

A detailed list of feature variations in the Azure Security Center government offering can found in the variations section of this article. All other Azure Security Center capabilities can be referenced in the Azure Security Center public documentation.

**What is the compliance commitment for Azure Security Center in Azure
Government?**

Azure Security Center in Azure Government has achieved FedRAMP High authorization.

**Is Azure Security Center available for DoD customers?**

Azure Security Center is deployed on Azure Government regions but not DoD regions. Azure resources created in DoD regions can still utilize Security Center capabilities. However, using it will result in Security Center collected data being moved out from DoD regions and stored in Azure Government regions. By default, all Security Center features which collect and store data are disabled
for resources hosted in DoD regions. The type of data collected and stored varies depending on the selected feature. Customers who want to enable Azure Security Center features for DoD resources are recommended to consider data residency before doing so.

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

For details on this service and how to use it, see the [Azure Active Directory Documentation](../active-directory/index.yml).

### Variations

The URLs for accessing Azure Active Directory in Azure Government are different:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| Active Directory Endpoint and Authority | https://login.microsoftonline.com | https://login.microsoftonline.us |
| Active Directory Graph API| https://graph.windows.net/ | https://graph.windows.net/ |

## Azure Active Directory Premium P1 and P2

Azure Active Directory Premium is available in Azure Government. For details on this service and how to use it, see the [Azure Active Directory Documentation](../active-directory/index.yml).  

For a list of features in Azure Active Directory Premium P1, see [Azure Active Directory Features](https://www.microsoft.com/cloud-platform/azure-active-directory-features) for a list of all capabilities available. This same feature list applies to the US Government cloud instance.
All features covered in the above list are available in the US Government cloud instance, with the following known limitations:

### Variations

The following Azure Active Directory Premium P1 features are currently not available in Azure Government:

- B2B Collaboration ([vote for this feature](https://feedback.azure.com/forums/558487-azure-government/suggestions/20588554-azure-ad-b2b-in-azure-government))
- Group-Based Licensing
- Azure Active Directory Domain Services
- Cloud App Security

The following features have known limitations in Azure Government:

- Limitations with the Azure Active Directory App Gallery:
  - Pre-integrated SAML and password SSO applications from the Azure AD Application Gallery are not yet available. Instead, use a custom application to support federated single sign-on with SAML or password SSO.
  - Rich provisioning connectors for featured apps are not yet available. Instead, use SCIM for automated provisioning.

- Limitations with Multi-factor Authentication:
  - Hardware OATH tokens are not available in Azure Government.
  - Trusted IPs are not supported in Azure Government. Instead, use Conditional Access policies with named locations to establish when Multi-Factor Authentication should and should not be required based off the user’s current IP address.

- Limitations with Azure AD Join:
  - Enterprise State Roaming for Windows 10 devices is not available  

## Azure Multi-Factor Authentication

For details on this service and how to use it, see the [Azure Multi-Factor Authentication Documentation](../active-directory/authentication/multi-factor-authentication.md).

## Azure Information Protection

Azure Information Protection Premium, part of the [Enterprise Mobility + Security](https://docs.microsoft.com/enterprise-mobility-security) suite, is generally available in Azure Government.

For details on this service and how to use it, see the [Azure Information Protection Premium Government Service Description](https://docs.microsoft.com/enterprise-mobility-security/solutions/ems-aip-premium-govt-service-description).

## Enterprise Mobility + Security (EMS)

For information about EMS suite capabilities in Azure Government, see the [Enterprise Mobility + Security for US Government Service Description](https://docs.microsoft.com/enterprise-mobility-security/solutions/ems-govt-service-description).

## Next steps

For supplemental information and updates, subscribe to the [Microsoft Azure Government Blog.](https://devblogs.microsoft.com/azuregov)
