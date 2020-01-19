---
title: Protect NDES with Azure AD Application Proxy
description: Guidance on deploying an Azure Active Directory Application Proxy to protect your NDES server.
services: active-directory
author: CelesteDG
manager: CelesteDG
ms.assetid: 
ms.service: active-directory
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/17/2020
ms.author: baselden
ms.reviewer: mimart
---


# Azure Active Directory Application Proxy

Azure Active Directory (AD) Application Proxy lets you publish applications, such as SharePoint sites, Outlook Web Access, and other web applications, inside your private network and provides secure access to users outside your network via Azure.

If you're new to the Azure AD Application Proxy and want to learn more, see [How to provide secure remote access to internal applications](https://docs.microsoft.com/azure/active-directory-domain-services/deploy-azure-app-proxy?context=azure/active-directory/manage-apps/context/manage-apps-context).

Azure AD Application Proxy is built on Azure and gives you a massive amount of network bandwidth and server infrastructure to have better protection against DDOS attacks and superb availability. Furthermore, there is no need to open external firewall ports to your on premise network and no DMZ server is required. All traffic is originated inbound. For a complete list of outbound ports, see [Tutorial: Add an on-premises application for remote access through Application Proxy in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-add-on-premises-application#prepare-your-on-premises-environment).

> Note
>Azure AD Application Proxy is a feature that is available only if you are using the Premium or Basic editions of Azure Active Directory. For more information, see Azure Active Directory Editions. 
> If you have Enterprise Mobility Suite (EMS) licenses you are eligible of using this solution.
> The Azure AD Application Proxy connector only installs on a Windows Server 2012 R2 Operating system, this is also a requirement of the NDES server anyway.

## Architecture

The architecture of this solution might look as follows:

![Intune Certificate Management Network diagram](./media/active-directory-app-proxy-protect-ndes/azure-active-directory-log-in.png)

## Installation steps

[!INCLUDE [active-directory-install-connector-service.md](../../includes/active-directory-install-connector-service.md)]

1. On your NDES server, start the installation by running the *AADApplicationProxyConnectorInstaller.msi* file that you downloaded. Follow the wizard like shown in the print screens below.

   > You can install the connector on any server within your corporate network with access to NDES. You don't have to install it on the NDES server itself.

   ![Active Directory connector service license agreement](./media/active-directory-app-proxy-protect-ndes/connector-service-license-agreement.png)

1. When prompted, authenticate to your Azure AD tenant by providing Azure AD Administrative authentication credentials.

1. After successful installation, go back to the Azure portal.

1. Select **Enterprise applications**.

   ![ensure that you're engaging the right stakeholders](./media/active-directory-app-proxy-protect-ndes/azure-active-directory-enterprise-applications.png)

1. Select **+New Application**, and then select **On-premises application**. 

1. On the **Add your own on-premises application**, configure the following fields:

   * **Name**: Enter a name for the application.
   * **Internal Url**: Enter the internal URL/FQDN of your NDES server on which you installed the connector.
   * **Pre Authentication**: Select **Passthrough**. It’s not possible to use any form of pre-authentication, the protocol used for Certificate Requests (SCEP) does not provide such option.
]   * Copy the provided **External URL** to your clipboard.

1. Select **+Add** to save your application.

1. Test whether you can access your NDES server via the Azure AD Application proxy by pasting the link from step 10 into a browser. You should see a default IIS welcome page.

1. As a final test, add the *mscep.dll* path to the existing URL you pasted in the previous step:

   https://scep-test93635307549127448334.msappproxy.net/certsrv/mscep/mscep.dll

1. You should see a **HTTP Error 403 – Forbidden** response.

1. Change the NDES URL provided (via Microsoft Intune) to devices, this could either be in System Center Configuration Center or in Intune Cloud.

   a. For System Center Configuration Center go to the Certificate Registration Point (CRP) and adjust the URL, this is what devices reach out to and present their challenge.
   b. For Intune Cloud Only a.k.a. Intune Standalone, either Edit or Create a new SCEP policy and add the new URLclip_image030
