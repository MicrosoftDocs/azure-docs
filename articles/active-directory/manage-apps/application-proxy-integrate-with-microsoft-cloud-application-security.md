---
title: Integrate on-premises apps with Cloud App Security - Azure AD
description: Configure an on-premises application in Azure Active Directory to work with Microsoft Cloud App Security (MCAS). Use the MCAS Conditional Access App Control to monitor and control sessions in real-time based on Conditional Access policies. You can apply these policies to on-premises applications that use Application Proxy in Azure Active Directory (Azure AD).
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 12/19/2018
ms.author: kenwith
ms.reviewer: japere
ms.collection: M365-identity-device-management
---

# Configure real-time application access monitoring with Microsoft Cloud App Security and Azure Active Directory
Configure an on-premises application in Azure Active Directory (Azure AD) to use Microsoft Cloud App Security (MCAS) for real-time monitoring. MCAS uses Conditional Access App Control to monitor and control sessions in real-time based on Conditional Access policies. You can apply these policies to on-premises applications that use Application Proxy in Azure Active Directory (Azure AD).

Here are some examples of the types of policies you can create with MCAS:

- Block or protect the download of sensitive documents on unmanaged devices.
- Monitor when high-risk users sign on to applications, and then log their actions from within the session. With this information, you can analyze user behavior to determine how to apply session policies.
- Use client certificates or device compliance to block access to specific applications from unmanaged devices.
- Restrict user sessions from non-corporate networks. You can give restricted access to users accessing an application from outside your corporate network. For example, this restricted access can block the user from downloading sensitive documents.

For more information, see [Protect apps with Microsoft Cloud App Security Conditional Access App Control](/cloud-app-security/proxy-intro-aad).

## Requirements

License:

- EMS E5 license, or 
- Azure Active Directory Premium P1 and MCAS Standalone.

On-premises application:

- The on-premises application must use Kerberos Constrained Delegation (KCD)

Configure Application Proxy:

- Configure Azure AD to use Application Proxy, including preparing your environment and installing the Application Proxy connector. For a tutorial, see [Add an on-premises applications for remote access through Application Proxy in Azure AD](application-proxy-add-on-premises-application.md). 

## Add on-premises application to Azure AD

Add an on-premises application to Azure AD. For a quickstart, see [Add an on-premises app to Azure AD](application-proxy-add-on-premises-application.md#add-an-on-premises-app-to-azure-ad). When adding the application, be sure to set the following two settings in the **Add your on-premises application** blade:

- **Pre Authentication**: Enter **Azure Active Directory**.
- **Translate URLs in Application Body**: Choose **Yes**.

Those two settings are required for the application to work with MCAS.

## Test the on-premises application

After adding your application to Azure AD, use the steps in [Test the application](application-proxy-add-on-premises-application.md#test-the-application) to add a user for testing, and test the sign-on. 

## Deploy Conditional Access App Control

To configure your application with the Conditional Access Application Control, follow the instructions in [Deploy Conditional Access Application Control for Azure AD apps](/cloud-app-security/proxy-deployment-aad).


## Test Conditional Access App Control

To test the deployment of Azure AD applications with Conditional Access Application Control, follow the instructions in [Test the deployment for Azure AD apps](/cloud-app-security/proxy-deployment-aad).





