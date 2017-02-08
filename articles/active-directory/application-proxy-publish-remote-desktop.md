---
title: Publish Remote Desktop with Azure Active Directory Application Proxy | Microsoft Docs
description: Covers the basics about Azure AD Application Proxy connectors.
services: active-directory
documentationcenter: ''
author: kgremban
manager: femila

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/12/2017
ms.author: kgremban

---

# Publish Remote Desktop with Azure Active Directory Application Proxy

This article discusses how to make Remote Desktop deployments accessible for remote users. Such Remote Desktop deployments can reside on-premises or at private networks, such as IaaS deployments. 

> [!NOTE]
> Application Proxy is a feature that is available only if you upgraded to the Premium or Basic edition of Azure Active Directory. For more information, see [Azure Active Directory editions](active-directory-editions.md).
> 
 

Remote Desktop protocol traffic can be published through Application Proxy as a pass-through proxy application. This solution solves the connectivity problem and provides basic security protection such as network buffering, hardened Internet front-end and DDoS protection. 

##Remote Desktop deployment

Within the Remote Desktop deployment, the Remote Desktop Gateway is published so that it is able to convert the RPC over HTTPS traffic to RDP over UDP traffic.

You can configure your clients to use Remote Desktop clients, such as MSTSC.exe, to access the Azure AD Application Proxy. This enables you to create a new HTTPS connection to the Remote Desktop Gateway using its connectors. By doing this, Remote Desktop Gateway will not be directly exposed to the Internet, and all HTTPS requests first will be terminated in the cloud. 

The diagram below shows the topology.

 ![AzureAD Services Local](./media/application-proxy-publish-remote-desktop/remote-desktop-topology.png)

## Configure the Remote Desktop Gateway URL

As long as your users configure the Remote Desktop Gateway URL, when they trigger RDP traffic as they typically do, they will be able to access files and other methods.

Publishing can be accomplished by either using the domain name provided by App Proxy (msappproxy.net) or by using a custom domain name configured on Azure AD;  for example rdg.contoso.com. 

If your client devices and RDP file are already configured with a Remote Desktop Gateway URL, you may choose to use the same domain name and therefore avoid the change. In this case, the certificate that covers this domain should be provided to App Proxy and its CRL should be accessible over the Internet.

If no Remote Desktop Gateway URL is configured, users or admins can specify it in the Remote Desktop clients (MSTSC), using the Remote Desktop Connection box, as shown below.

 ![AzureAD Services Local](./media/application-proxy-publish-remote-desktop/remote-desktop-connection-advanced.png)

The Connection Settings box appears when you click **Settings** in the **Advanced** tab.

 ![AzureAD Services Local](./media/application-proxy-publish-remote-desktop/remote-desktop-connection-settings.png)

## Remote Desktop Web Access

If your organization uses the Remote Desktop Web Access (RDWA) portal, you can also publish using Azure AD App Proxy. You can publish to this portal with pre-authentication and single sign-on (SSO).

TThe diagram below shows the topology for this scenario.

 ![AzureAD Services Local](./media/application-proxy-publish-remote-desktop/remote-desktop-web-access-portal1.png)

In the case above, your users will be authenticated on Azure AD before accessing RDWA. If they have already been authenticated on Azur AD (for example, they are using Office 365) then they do not have to authenticate again for RDWA.

When your users start the RDP session, they need to authenticate again over the RDP channel. This happens because SSO from RDWA to Remote Desktop Gateway is based on storing the end-user credentials on the client using ActiveX. This process is triggered from RDWA form-based authentication. When RDWA authentication is using Kerbros, no form-based authentication is presented and therefore the RDWA to RDP SSO won't work.

If RDWA needs SSO to the RDP traffic, or RDWA form-based authentication has been heavily customized, it is possible to publish RDWA without preauthentication.

The diagram below shows the topology for this scenario.

 ![AzureAD Services Local](./media/application-proxy-publish-remote-desktop/remote-desktop-web-access-portal2.png)

In the case above, your users will need to authenticate to RDWA using form-based authentication, but they will not need to authenticate over RDP. 

It is important to note in both cases that there is no pre-authentication required on the RDP traffic. Therefore, users may access it without going through RDWA first.

##Next steps

[Enable remote access to SharePoint with Azure AD App Proxy](application-proxy-enable-remote-access-sharepoint.md)<br>
[Enable Application Proxy in the Azure portal](https://github.com/Microsoft/azure-docs-pr/blob/master/articles/active-directory/active-directory-application-proxy-enable.md)
