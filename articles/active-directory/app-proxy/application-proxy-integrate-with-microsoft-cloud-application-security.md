---
title: Use Application Proxy to integrate on-premises apps with Defender for Cloud Apps
description: Configure an on-premises application in Microsoft Entra ID to work with Microsoft Defender for Cloud Apps. Use the Defender for Cloud Apps Conditional Access App Control to monitor and control sessions in real-time based on Conditional Access policies. You can apply these policies to on-premises applications that use Application Proxy in Microsoft Entra ID.
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: how-to
ms.date: 09/14/2023
ms.author: kenwith
ms.reviewer: ashishj
---

# Configure real-time application access monitoring with Microsoft Defender for Cloud Apps and Microsoft Entra ID
Configure an on-premises application in Microsoft Entra ID to use Microsoft Defender for Cloud Apps for real-time monitoring. Defender for Cloud Apps uses Conditional Access App Control to monitor and control sessions in real-time based on Conditional Access policies. You can apply these policies to on-premises applications that use Application Proxy in Microsoft Entra ID.

Here are some examples of the types of policies you can create with Defender for Cloud Apps:

- Block or protect the download of sensitive documents on unmanaged devices.
- Monitor when high-risk users sign on to applications, and then log their actions from within the session. With this information, you can analyze user behavior to determine how to apply session policies.
- Use client certificates or device compliance to block access to specific applications from unmanaged devices.
- Restrict user sessions from non-corporate networks. You can give restricted access to users accessing an application from outside your corporate network. For example, this restricted access can block the user from downloading sensitive documents.

For more information, see [Protect apps with Microsoft Defender for Cloud Apps Conditional Access App Control](/defender-cloud-apps/proxy-intro-aad).

## Requirements

License:

- EMS E5 license, or
- Microsoft Entra ID P1 and Defender for Cloud Apps Standalone.

On-premises application:

- The on-premises application must use Kerberos Constrained Delegation (KCD)

Configure Application Proxy:

- Configure Microsoft Entra ID to use Application Proxy, including preparing your environment and installing the Application Proxy connector. For a tutorial, see [Add an on-premises applications for remote access through Application Proxy in Microsoft Entra ID](../app-proxy/application-proxy-add-on-premises-application.md). 

<a name='add-on-premises-application-to-azure-ad'></a>

## Add on-premises application to Microsoft Entra ID

Add an on-premises application to Microsoft Entra ID. For a quickstart, see [Add an on-premises app to Microsoft Entra ID](../app-proxy/application-proxy-add-on-premises-application.md#add-an-on-premises-app-to-azure-ad). When adding the application, be sure to set the following two settings in the **Add your on-premises application** blade:

- **Pre Authentication**: Enter **Microsoft Entra ID**.
- **Translate URLs in Application Body**: Choose **Yes**.

Those two settings are required for the application to work with Defender for Cloud Apps.

## Test the on-premises application

After adding your application to Microsoft Entra ID, use the steps in [Test the application](../app-proxy/application-proxy-add-on-premises-application.md#test-the-application) to add a user for testing, and test the sign-on. 

## Deploy Conditional Access App Control

To configure your application with the Conditional Access Application Control, follow the instructions in [Deploy Conditional Access Application Control for Microsoft Entra apps](/cloud-app-security/proxy-deployment-aad).


## Test Conditional Access App Control

To test the deployment of Microsoft Entra applications with Conditional Access Application Control, follow the instructions in [Test the deployment for Microsoft Entra apps](/defender-cloud-apps/proxy-deployment-aad).
