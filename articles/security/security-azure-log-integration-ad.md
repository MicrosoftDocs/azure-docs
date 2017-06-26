---
title: Azure Log Integration (AZLOG) with Active directory audit logs | Microsoft Docs
description: Learn how to install the Azure log integration service and integrate logs from Azure audit logs
services: security
documentationcenter: na
author: Barclayn
manager: MBaldwin
editor: TomShinder

ms.assetid:
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ums.workload: na
ms.date: 03/29/2017
ms.author: barclayn

---

#Integrate Azure Active Directory Audit logs

Azure Active directory audit events help you identify privileged actions that occurred in Azure Active Directory. You can see the types of events that you can track by reviewing [Azure Active Directory audit report events](/active-directory/active-directory-reporting-audit-events#list-of-audit-report-events.md)

>[!NOTE]
You must have successfully completed the steps in the [Get started](security-azure-log-integration-get-started.md) article before performing the steps in this article.

## Steps to integrate Azure Active directory audit logs

1. Open the command prompt and cd into **c:\Program Files\Microsoft Azure Log Integration**
2. Run the command:

 ``azlog createazureid``
 
 This command prompts you for your Azure login. The command then creates an Azure Active Directory Service Principal in the Azure AD Tenants that host the Azure subscriptions in which the logged in user is an Administrator, a Co-Administrator, or an Owner. The command will fail if the logged in user is only a Guest user in the Azure AD Tenant. Authentication to Azure is done through Azure Active Directory (AD). Creating a service principal for Azlog Integration creates the Azure AD identity that will be given access to read from Azure subscriptions.
 
3. Run the command providing your tenantID. You will need to be member of the tenant admin role to run the command.

``Azlog.exe authorizedirectoryreader tenantId``

Example

``AZLOG.exe authorizedirectoryreader ba2c0000-d24b-4f4e-92b1-48c4469999``

Check the following folders to confirm that the Azure Active Directory Audit log JSON files are created in:

* **C:\Users\azlog\AzureActiveDirectoryJson**
* **C:\Users\azlog\AzureActiveDirectoryJsonLD**

Point the standard SIEM file forwarder connector to the appropriate folder to pipe the data to the SIEM instance. You may need some field mappings based on the SIEM product you are using.

Community assistance is available through the [Azure Log Integration MSDN Forum](https://social.msdn.microsoft.com/Forums/office/home?forum=AzureLogIntegration). This forum provides the AzLog community the ability support each other with questions, answers, tips, and tricks on how to get the most out of Azure Log Integration. In addition, the Azure Log Integration team monitors this forum and will help whenever we can. 

You can also open a [support request](../azure-supportability/how-to-create-azure-support-request.md). To do this, select **Log Integration** as the service for which you are requesting support.

## Next steps
To learn more about Azure Log Integration, see the following documents:

* [Microsoft Azure Log Integration for Azure logs](https://www.microsoft.com/download/details.aspx?id=53324) – Download Center for details, system requirements, and install instructions on Azure log integration.
* [Introduction to Azure log integration](security-azure-log-integration-overview.md) – This document introduces you to Azure log integration, its key capabilities, and how it works.
* [Partner configuration steps](https://blogs.msdn.microsoft.com/azuresecurity/2016/08/23/azure-log-siem-configuration-steps/) – This blog post shows you how to configure Azure log integration to work with partner solutions Splunk, HP ArcSight, and IBM QRadar.
* [Azure log Integration frequently asked questions (FAQ)](security-azure-log-integration-faq.md) - This FAQ answers questions about Azure log integration.
* [Integrating Security Center alerts with Azure log Integration](../security-center/security-center-integrating-alerts-with-log-integration.md) – This document shows you how to sync Security Center alerts, along with virtual machine security events collected by Azure Diagnostics and Azure Audit Logs, with your log analytics or SIEM solution.
* [New features for Azure diagnostics and Azure Audit Logs](https://azure.microsoft.com/blog/new-features-for-azure-diagnostics-and-azure-audit-logs/) – This blog post introduces you to Azure Audit Logs and other features that help you gain insights into the operations of your Azure resources.
