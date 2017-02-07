---
title: Transition to Azure AD App Proxy from Microsoft Forefront | Microsoft Docs
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
ms.date: 01/27/2017
ms.author: kgremban

---
#Transition to Azure AD App Proxy from Microsoft Forefront

This article describes how to move from Microsoft Forefront's Threat Management Gateway (TMG) and United Access Gateway (UAG) solutions to these Azuare AD Application proxies: Web Application Proxy (WAP) and Azure AD Application Proxy (AADAP). 

> [!NOTE]
> Application Proxy is a feature that is available only if you upgraded to the Premium or Basic edition of Azure Active Directory. For more information, see [Azure Active Directory editions](active-directory-editions.md).
> 
 
Many customers are asking us how to move from Forefront UAG and TMG to the new Application Proxies. For information, see this [whitepaper](http://download.microsoft.com/download/3/E/3/3E335D93-6DB8-4834-90A8-B86105419F05/Microsoft%20TMG%20and%20UAG%20EOL%20and%20transitioning%20to%20WAP%20and%20AADAP.docx) that describes the transition in detail. 
 
## TMG/UAG conversion to Azure AD Application Proxy table
 
|**TMG/UAG Functionality**|**Web Application Proxy (WAP) / Azure AD Application Proxy (AADAP)**|
|:-----|:-----|
|Selective HTTP Publishing for Browser Apps|Available in WAP in Windows Server 2012 R2 (Available in AADAP today)|
|ADFS Integration|Available in WAP in Windows Server 2012 R2 (Available in AADAP today)|
|Rich Protocols Publishing (e.g., Citrix, Lync, RDG)|Available in WAP in Windows Server 2012 R2 (Available in AADAP today)|
|Preauthentication for ActiveSync (HTTP Basic) and RDG|Will be available in WAP in Windows Server vNext (Will be coming to AADAP)|
|Portal|Use Intune / System Center for WAP (Use AAD Access Panel or Office 365 App Launcher available for AADAP)|
|Endpoint Health Detection|Use Intune / System Center|
|SSL Tunneling|Use Windows SSL / VPN capability|
|Layer 2/3 Firewall|Use Windows Server capabilities|
|Web Application Firewall|No current solution from Microsoft|
|Secure Web Gateway (Forward Proxy)|No current solution from Microsoft|


## Next steps

[Blog: Web Application Proxy](https://blogs.technet.microsoft.com/applicationproxyblog/tag/web-application-proxy)<br>
[Blog: Application Proxy](https://blogs.technet.microsoft.com/applicationproxyblog/tag/aad-ap)
