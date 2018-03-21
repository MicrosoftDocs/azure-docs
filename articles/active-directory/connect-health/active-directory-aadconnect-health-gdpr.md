---
title: 'Azure AD Connect Health and General Data Protection Regulation | Microsoft Docs'
description: This document describes how to obtain GDPR compliancy with Azure AD Connect.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: ''
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/18/2018
ms.author: billmath
---

# GDPR compliance and Azure AD Connect Health 

[General Data Protection Regulation (GDPR)](http://ec.europa.eu/justice/data-protection/reform/index_en.htm) is a European Union (EU) data protection and privacy law. The GDPR imposes new rules on companies, government agencies, non-profits, and other organizations that offer goods and services to people in the EU, or that collect and analyze data tied to EU residents. 

Microsoft products and services are available today to help you meet the GDPR requirements. Read more about Microsoft Privacy policy at [Trust Center](https://www.microsoft.com/trustcenter).

Azure AD Connect Health monitors your on-premises identity infrastructure and synchronization service. It also provides you insights and surfaces alerts. Microsoft is committed to GDPR-compliance across cloud services when enforcement begins May 2018 and to provide GDPR-related assurances in its contractual commitments. 

>[!NOTE] 
> This article outlines GDPR compliance in Azure AD Connect Health. For information on GDPR compliance in Azure AD Connect, see [GDPR compliance and Azure AD Connect](../../active-directory/connect/active-directory-aadconnect-gdpr.md).

## GDPR classification
Azure AD Connect Health falls into the **data processor** category of GDPR classification. As a data processor pipeline, the service provides data processing services to key partners and end consumers. Azure AD Connect Health does not generate user data and has no independent control over what personal data is collected and how it is used. Data retrieval, aggregation, analysis, and reporting in Azure AD Connect Health are based on existing on-premises data. 

## Data retention policy
Azure AD Connect Health does not generate reports, perform analytics, or provide insights beyond 30 days. Therefore, Azure AD Connect Health does not store, process, or retain any data beyond 30 days. This design is compliant with the GDPR regulations, Microsoft privacy compliance regulations, and Azure AD data retention policies. 

Servers with active **Health service data is not up to date** **error** alerts for over 30 consecutive days suggest that no data has reached Connect Health during that time span. These servers will be disabled and not shown in Connect Health portal. To re-enable the servers, you must uninstall and [reinstall the health agent](active-directory-aadconnect-health-agent-install.md). 
Please note that this does not apply to **warnings** with the same alert type. Warnings indicate that partial data is missing from the server you are alerted for. 
 
## Disable data collection and monitoring in Azure AD Connect Health
Azure AD Connect Health enables you to stop data collection for each individual monitored server or for an instance of a monitored service. For example, you can stop data collection for individual ADFS (Active Directory Federation Services) servers that are monitored using Azure AD Connect Health. You can also stop data collection for the entire ADFS instance that is being monitored using Azure AD Connect Health. When you choose to do so, the corresponding servers are deleted from the Azure AD Connect Health portal, after stopping data collection. 

>[!IMPORTANT]
> You need either Azure AD Global Administrator privileges or the Contributor role in RBAC to delete monitored servers from Azure AD Connect Health.
>
> Removing a server or service instance from Azure AD Connect Health is not a reversible action. 

### What to expect?
If you stop data collection and monitoring for an individual monitored server or an instance of a monitored service, note the following:

- When you delete an instance of a monitored service, the instance is removed from the Azure AD Connect Health monitoring service list in the portal. 
- When you delete a monitored server or an instance of a monitored service, the Health Agent is NOT uninstalled or removed from your servers. The Health Agent is configured not to send data to Azure AD Connect Health. You need to manually uninstall the Health Agent on previously monitored servers.
- If you have not uninstalled the Health Agent before performing this step, you may see error events on the server(s) related to the Health Agent.
- All data belonging to the instance of the monitored service is deleted as per the Microsoft Azure Data Retention Policy.

### Disable data collection and monitoring for a monitored server
See [how to remove a server from Azure AD Connect Health](active-directory-aadconnect-health-operations.md#delete-a-server-from-the-azure-ad-connect-health-service).

### Disable data collection and monitoring for an instance of a monitored service
See [how to remove a service instance from Azure AD Connect Health](active-directory-aadconnect-health-operations.md#delete-a-service-instance-from-azure-ad-connect-health-service).


## Re-enable data collection and monitoring in Azure AD Connect Health
To re-enable monitoring in Azure AD Connect Health for a previously deleted monitored service, you must uninstall and [reinstall the health agent](active-directory-aadconnect-health-agent-install.md) on all the servers.


## Next steps
* [Review the Microsoft Privacy policy on Trust Center](https://www.microsoft.com/trustcenter)
* [Azure AD Connect and GDPR](../../active-directory/connect/active-directory-aadconnect-gdpr.md)
* [Azure AD Connect Health operations](active-directory-aadconnect-health-operations.md)
