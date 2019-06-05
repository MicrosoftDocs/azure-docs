---
title: Azure Log Integration with Azure Active Directory audit logs | Microsoft Docs
description: Learn how to install the Azure Log Integration service and integrate logs from Azure audit logs
services: security
documentationcenter: na
author: Barclayn
manager: barbkess
editor: TomShinder

ms.assetid:
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ums.workload: na
ms.date: 05/28/2019
ms.author: barclayn
ms.custom: azlog

---
# Integrate Azure Active Directory audit logs

Azure Active Directory (Azure AD) audit events help you identify privileged actions that occurred in Azure Active Directory. You can see the types of events that you can track by reviewing [Azure Active Directory audit report events](../active-directory/reports-monitoring/concept-audit-logs.md).


>[!IMPORTANT]
> The Azure Log integration feature will be deprecated by 06/15/2019. AzLog downloads were disabled on Jun 27, 2018. For guidance on what to do moving forward review the post [Use Azure monitor to integrate with SIEM tools](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/) 

## Steps to integrate Azure Active Directory audit logs

> [!NOTE]
> Before you attempt the steps in this article, you must review the [Get started](security-azure-log-integration-get-started.md) article and complete the relevant steps there.

1. Open the command prompt and run this command:

   ``cd c:\Program Files\Microsoft Azure Log Integration``

2. Run this command: 
 
   ``azlog createazureid``

   This command prompts you for your Azure login. The command then creates an Azure Active Directory service principal in the Azure AD tenants that host the Azure subscriptions in which the logged-in user is an administrator, a co-administrator, or an owner. The command will fail if the logged-in user is only a guest user in the Azure AD tenant. Authentication to Azure is done through Azure AD. Creating a service principal for Azure Log Integration creates the Azure AD identity that is given access to read from Azure subscriptions.

3. Run the following command to provide your tenant ID. You need to be member of the tenant admin role to run the command.

   ``Azlog.exe authorizedirectoryreader tenantId``

   Example:

   ``AZLOG.exe authorizedirectoryreader ba2c0000-d24b-4f4e-92b1-48c4469999``

4. Check the following folders to confirm that the Azure Active Directory audit log JSON files are created in them:

   * **C:\Users\azlog\AzureActiveDirectoryJson**
   * **C:\Users\azlog\AzureActiveDirectoryJsonLD**

The following video demonstrates the steps covered in this article:

> [!VIDEO https://channel9.msdn.com/Blogs/Azure-Security-Videos/Azure-Log-Integration-Videos-Azure-AD-Integration/player]


> [!NOTE]
> For specific instructions on bringing the information in the JSON files into your security information and event management (SIEM) system, contact your SIEM vendor.

Community assistance is available through the [Azure Log Integration MSDN Forum](https://social.msdn.microsoft.com/Forums/office/home?forum=AzureLogIntegration). This forum enables people in the Azure Log Integration community to support each other with questions, answers, tips, and tricks. In addition, the Azure Log Integration team monitors this forum and helps whenever it can.

You can also open a [support request](../azure-supportability/how-to-create-azure-support-request.md). Select **Log Integration** as the service for which you are requesting support.

## Next steps
To learn more about Azure Log Integration, see:

* [Microsoft Azure Log Integration for Azure logs](https://www.microsoft.com/download/details.aspx?id=53324): This Download Center page gives details, system requirements, and installation instructions for Azure Log Integration.
* [Introduction to Azure Log Integration](security-azure-log-integration-overview.md): This article introduces you to Azure Log Integration, its key capabilities, and how it works.
* [Azure Log Integration FAQ](security-azure-log-integration-faq.md): This article answers questions about Azure Log Integration.
* [New features for Azure Diagnostics and Azure audit logs](https://azure.microsoft.com/blog/new-features-for-azure-diagnostics-and-azure-audit-logs/): This blog post introduces you to Azure audit logs and other features that help you gain insights into the operations of your Azure resources.
