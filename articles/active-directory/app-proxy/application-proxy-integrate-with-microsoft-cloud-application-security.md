---
title: Use Application Proxy to integrate on-premises apps with Defender for Cloud Apps - Azure Active Directory
description: Configure an on-premises application in Azure Active Directory to work with Microsoft Defender for Cloud Apps. Use the Defender for Cloud Apps Conditional Access App Control to monitor and control sessions in real-time based on Conditional Access policies. You can apply these policies to on-premises applications that use Application Proxy in Azure Active Directory (Azure AD).
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: how-to
ms.date: 04/28/2021
ms.author: kenwith
ms.reviewer: ashishj
---

# Configure real-time application access monitoring with Microsoft Defender for Cloud Apps and Azure Active Directory
Configure an on-premises application in Azure Active Directory (Azure AD) to use Microsoft Defender for Cloud Apps for real-time monitoring. Defender for Cloud Apps uses Conditional Access App Control to monitor and control sessions in real-time based on Conditional Access policies. You can apply these policies to on-premises applications that use Application Proxy in Azure Active Directory (Azure AD).

Here are some examples of the types of policies you can create with Defender for Cloud Apps:

- Block or protect the download of sensitive documents on unmanaged devices.
- Monitor when high-risk users sign on to applications, and then log their actions from within the session. With this information, you can analyze user behavior to determine how to apply session policies.
- Use client certificates or device compliance to block access to specific applications from unmanaged devices.
- Restrict user sessions from non-corporate networks. You can give restricted access to users accessing an application from outside your corporate network. For example, this restricted access can block the user from downloading sensitive documents.

For more information, see [Protect apps with Microsoft Defender for Cloud Apps Conditional Access App Control](/cloud-app-security/proxy-intro-aad).

## Requirements

License:

- EMS E5 license, or
- Azure Active Directory Premium P1 and Defender for Cloud Apps Standalone.

On-premises application:

- The on-premises application must use Kerberos Constrained Delegation (KCD)

Configure Application Proxy:

- Configure Azure AD to use Application Proxy, including preparing your environment and installing the Application Proxy connector. For a tutorial, see [Add an on-premises applications for remote access through Application Proxy in Azure AD](../app-proxy/application-proxy-add-on-premises-application.md). 

## Add on-premises application to Azure AD

Add an on-premises application to Azure AD. For a quickstart, see [Add an on-premises app to Azure AD](../app-proxy/application-proxy-add-on-premises-application.md#add-an-on-premises-app-to-azure-ad). When adding the application, be sure to set the following two settings in the **Add your on-premises application** blade:

- **Pre Authentication**: Enter **Azure Active Directory**.
- **Translate URLs in Application Body**: Choose **Yes**.

Those two settings are required for the application to work with Defender for Cloud Apps.

## Test the on-premises application

After adding your application to Azure AD, use the steps in [Test the application](../app-proxy/application-proxy-add-on-premises-application.md#test-the-application) to add a user for testing, and test the sign-on. 

## Deploy Conditional Access App Control

To configure your application with the Conditional Access Application Control, follow the instructions in [Deploy Conditional Access Application Control for Azure AD apps](/cloud-app-security/proxy-deployment-aad).


## Test Conditional Access App Control

To test the deployment of Azure AD applications with Conditional Access Application Control, follow the instructions in [Test the deployment for Azure AD apps](/cloud-app-security/proxy-deployment-aad).
