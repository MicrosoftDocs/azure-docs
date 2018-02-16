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
ms.date: 02/15/2018
ms.author: billmath
---

# GDPR compliance and Azure AD Connect Health 

In May 2018, a European privacy law, the [General Data Protection Regulation (GDPR)](http://ec.europa.eu/justice/data-protection/reform/index_en.htm), is due to take effect. The GDPR imposes new rules on companies, government agencies, non-profits, and other organizations that offer goods and services to people in the European Union (EU), or that collect and analyze data tied to EU residents. The GDPR applies no matter where you are located. 

Microsoft products and services are available today to help you meet the GDPR requirements. Read more about Microsoft Privacy policy at [Trust Center](https://www.microsoft.com/trustcenter).

Azure AD Connect Health provides monitoring, insights, and alert functionality for your on-premises identity infrastructure and synchronization service. Microsoft is committed to GDPR-compliance across cloud services when enforcement begins May 2018 and to provide GDPR-related assurances in its contractual commitments. 

>[!NOTE] 
>This article deals with Azure AD Connect Health and GDPR compliance.  For information on Azure AD Connect and GDPR compliance, see [GDPR compliance and Azure AD Connect](../../active-directory/connect/active-directory-aadconnect-gdpr.md).

## Update in Azure AD Connect Health 
Azure AD Connect Health falls into the **data processor** category of GDPR classification. As a data processor pipeline, we provide data processing services to key partners and end consumers. Azure AD Connect Health does not generate user data and has no independent control over what personal data is collected and how it is used. Data retrieval, aggregation, analysis, and reporting in Azure AD Connect Health are based on existing on-premises data. 

## Data retention policy alignment
Currently, Azure AD Connect Health does not generate reports, provide analytics or insights beyond 30 days. Azure AD Connect Health has updated data its storage and processing procedures to not retain any data beyond 30 days, in compliance with the GDPR regulations, Microsoft privacy compliance regulations, and Azure AD data retention policies. 
 
## Disable Connect Health data collection and monitoring
Azure AD Connect Health provides capabilities to stop data collection at the server-level and the service-instance-level. Azure AD Connect Health portal deletes the target servers after stopping data collection. 

>[!IMPORTANT]
>Target server deletion can only be performed by someone with at least the Global Admin or Contributor role in RBAC.
>
>The delete services action cannot be reverted.

### Deletion actions
The following information is important with regard to deletion actions.

- Deleting removes the targeted service instances from the Azure AD Connect Health monitoring service list and stops Azure AD Connect Health from collecting data. 
- Deletion actions do NOT uninstall or remove the Health Agent from your servers. If you have not uninstalled the Health Agent before performing this step, you may see error events on the server(s) related to the Health Agent.
- All data from this service instance is deleted as per the Microsoft Azure Data Retention Policy.
- After performing this action, if you wish to start monitoring the service, uninstall and [reinstall the health agent](active-directory-aadconnect-health-agent-install.md) on all the servers that will be monitored.

### To delete in server-level
Use the following steps [here](active-directory-aadconnect-health-operations.md#to-delete-a-server-from-the-azure-ad-connect-health-service) to remove a server from Azure AD Connect Health data collection.

### To delete in service-instance-level
Use the following steps [here] (active-directory-aadconnect-health-operations.md#delete-a-service-instance-from-azure-ad-connect-health-service)to remove a service instance from Azure AD Connect Health data collection.


## Next Steps

* [Azure AD Connect and GDPR](../../active-directory/connect/active-directory-aadconnect-gdpr.md)
* [Azure AD Connect Health operations](active-directory-aadconnect-health-operations.md)
