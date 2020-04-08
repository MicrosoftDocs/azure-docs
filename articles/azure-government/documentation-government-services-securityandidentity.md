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
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 03/11/2020
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

- **Advanced threat detection**  
Azure Security Center standard tier in Azure Government does not support threat detection for App Service. 

    Threat detection for storage accounts is available in US government clouds, but no other sovereign or Azure government cloud regions.  

### Server protection

- **OS Security Configuration**  
Vulnerability specific metadata, such as the potential impact and countermeasures for OS security configuration vulnerabilities, is not available.

### Azure Security Center FAQs

For Azure Security Center FAQs, see [Azure Security Center frequently asked
questions public documentation](https://docs.microsoft.com/azure/security-center/security-center-faq).

Additional FAQs for Azure Security Center in Azure Government are listed below.

**What will customers be charged for Azure Security Center in Azure Government?**

The standard tier of Azure Security Center is free for the first 30 days. Should you choose to continue to use public preview or generally available standard features beyond 30 days, we automatically start to charge for the service.

**What features are available for Azure Security Center government customers?**

A detailed list of feature variations in the Azure Security Center government offering can found in the variations section of this article. All other Azure Security Center capabilities can be referenced in the Azure Security Center public documentation.

**What is the compliance commitment for Azure Security Center in Azure
Government?**

Azure Security Center in Azure Government has achieved FedRAMP High authorization.

**Is Azure Security Center available for DoD customers?**

Azure Security Center is deployed on Azure Government regions but not DoD regions. Azure resources created in DoD regions can still utilize Security Center capabilities. However, using it will result in Security Center collected data being moved out from DoD regions and stored in Azure Government regions. By default, all Security Center features which collect and store data are disabled
for resources hosted in DoD regions. The type of data collected and stored varies depending on the selected feature. Customers who want to enable Azure Security Center features for DoD resources are recommended to consider data residency before doing so.

## Azure Sentinel

Azure Sentinel is generally available in Azure Government.

For details on the service and how to use it, see the [Azure Sentinel public documentation](https://docs.microsoft.com/azure/sentinel/).

### Variations

- **Office 365 data connector**  
The Office 365 data connector can be used only for [Office 365 GCC High](https://docs.microsoft.com/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc-high-and-dod).

- **AWS CloudTrail data connector**  
The AWS CloudTrail data connector can be used only for [AWS in the Public Sector](https://aws.amazon.com/government-education/).

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

## Azure Active Directory Premium P1 and P2

Azure Active Directory Premium is available in Azure Government. For details on this service and how to use it, see the [Azure Active Directory Documentation](../active-directory/index.yml).  

For a list of features in Azure Active Directory Premium P1, see [Azure Active Directory Features](https://www.microsoft.com/cloud-platform/azure-active-directory-features) for a list of all capabilities available. This same feature list applies to the US Government cloud instance.
All features covered in the above list are available in the US Government cloud instance, with the following known limitations:

### Variations

The following Azure Active Directory Premium P1 features are currently not available in Azure Government:

- Azure Active Directory Domain Services
- Cloud App Security
- B2B Collaboration is available in Azure US Government tenants created after June, 2019. Over time, more tenants will get access to this functionality. See [How can I tell if B2B collaboration is available in my Azure US Government tenant?](../active-directory/b2b/current-limitations.md#how-can-i-tell-if-b2b-collaboration-is-available-in-my-azure-us-government-tenant)

The following features have known limitations in Azure Government:

- Limitations with B2B Collaboration in supported Azure US Government tenants:
  - B2B collaboration is currently only supported between tenants that are both within Azure US Government cloud and that both support B2B collaboration. If you invite a user in a tenant that isn't part of the Azure US Government cloud or that doesn't yet support B2B collaboration, the invitation will fail or the user will be unable to redeem the invitation.
  - B2B collaboration via Power BI is not supported. When you invite a guest user from within Power BI, the B2B flow is not used and the guest user won't appear in the tenant's user list. If a guest user is invited through other means, they'll appear in the Power BI user list, but any sharing request to the user will fail and display a 403 Forbidden error. 
  - Office 365 Groups are not supported for B2B users and can't be enabled.
  - Some SQL tools such as SSMS require you to set the appropriate cloud parameter. In the tool's Azure Service setup options, set the cloud parameter to Azure US Government.

- Limitations with Multi-factor Authentication:
  - Hardware OATH tokens are not available in Azure Government.
  - Trusted IPs are not supported in Azure Government. Instead, use Conditional Access policies with named locations to establish when Multi-Factor Authentication should and should not be required based off the user's current IP address.

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