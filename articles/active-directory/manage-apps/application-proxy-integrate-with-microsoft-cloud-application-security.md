---
title: Integrate on-premises apps with Cloud App Security - Azure Active Directory | Microsoft Docs
description: Configure an on-premises application in Azure Active Directory to work with Microsoft Cloud App Security (MCAS). Use the MCAS Conditional Access App Control to monitor and control sessions in real-time based on conditional access policies. You can apply these policies to on-premises applications that use Application Proxy in Azure Active Directory (Azure AD).
author: barbkess
manager: mtillman
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 12/19/2018
ms.author: barbkess
ms.reviewer: japere
---

# Configure real-time application access monitoring with Microsoft Cloud App Security and Azure Active Directory
Configure an on-premises application in Azure Active Directory to work with Microsoft Cloud App Security (MCAS). Use the MCAS Conditional Access App Control to monitor and control sessions in real-time based on conditional access policies. You can apply these policies to on-premises applications that use Application Proxy in Azure Active Directory (Azure AD).

For example, MCAS you can create policies to:

•	Block or protect the download of sensitive documents on unmanaged devices.
•	Monitor when high-risk users sign-on to applications, and then log their actions from within the session. With this information, you can analyze user behavior to determine how to apply session policies.
•	Use client certificates or device compliance to block access to specific applications from unmanaged devices.
•	Restrict user sessions from non-corporate networks. You can give restricted access to users accessing an application from outside your corporate network. For example, this restricted access can block the user from downloading sensitive documents.

For more information, see [Protect apps with Microsoft Cloud App Security Conditional Access App Control](/cloud-app-security/proxy-intro-aad.md).

## Requirements

License:

- EMS E5 license, or 
- Azure Active Directory Premium P1 and MCAS Standalone.

Application:

- The on-premises application must use Kerberos Constrained Delegation (KCD)

Application Proxy:

- Azure AD needs to be configured to use Application Proxy, which includes preparing your environment and installing the Application Proxy connector. For a tutorial on configuring Application Proxy, see [Add an on-premises applications for remote access through Application Proxy in Azure AD](application-proxy-add-on-premises-application.md). 

## Add on-premises application to Azure AD

Use [Add an on-premises app to Azure AD](application-proxy-add-on-premises-application.md#add-an-on-premises-app-to-azure-ad) to add the on-premises application to Azure AD. When you fill in the application information, choose the following two settings which are required for the application to work with MCAS:

- Pre-authentication method: Azure Active Directory
- Full body link translation: This must be set to Yes to work with MCAS.

You'll find the settings in the **Add your on-premises application** blade:

![Application information](media/application-proxy-integrate-with-microsoft-cloud-application-security/application-information-settings.png)

## Test the on-premises application in Azure AD

After adding your application to Azure AD, use the steps in [Test the application](application-proxy-add-on-premises-application.md#test-the-application) to add a user for testing, and test the sign-on. 

## Deploy Conditional Access App Control for Azure AD applications

To configure your application with the Conditional Access Application Control, follow the instructions in [Deploy Conditional Access Application Control for Azure AD apps](/cloud-app-security/proxy-deployment-aad).


## Test Azure AD applications with Conditional Access App Control

To test the deployment of Azure AD applications with Conditional Access Application Control, follow the instructions in [Test the deployment for Azure AD apps](/cloud-app-security/proxy-deployment-aad#test-the-deployment).





