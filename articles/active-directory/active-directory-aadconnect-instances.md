<properties
	pageTitle="Azure AD Connect: Sync service instances | Microsoft Azure"
	description="This page documents special considerations for Azure AD instances."
	services="active-directory"
	documentationCenter=""
	authors="andkjell"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/10/2016"
	ms.author="andkjell"/>

# Azure AD Connect: Special considerations for instances
Azure AD Connect is most commonly used with the world-wide instance of Azure AD and Office 365. But there are also other instances and these have different requirements for URLs and other special considerations.

## Microsoft Cloud in Germany
The [Microsoft Cloud in Germany](http://www.microsoft.de/cloud-deutschland) is a sovereign cloud operated by T-systems.

This cloud is currently in preview. Many of the scenarios you normally can do by yourself, such as verify domains, must be done by the operator. Please contact your local Microsoft representative for more information on how to participate in the preview.

URLs to open in proxy server |
--- |
\*.microsoftonline.de |
\*.windows.net |
+Certificate Revocation Lists |

The windows.net URL is shared with world-wide. This endpoint is only used to detect that your Azure AD directory is located in Germany and no customer data is transferred to the world-wide instance.

Features currently not present in the Microsoft Cloud in Germany:

- Azure AD Connect Health is not available.
- Automatic updates is not available.
- Password writeback is not available.

## Microsoft Azure Government cloud
The [Microsoft Azure Government cloud](https://azure.microsoft.com/features/gov/) is a cloud for US government.

This cloud has been supported by earlier releases of DirSync. From build 1.1.180 of Azure AD Connect the next generation of the cloud is supported. This generation is using US-only based endpoints and have a different list of URLs to open in your proxy server.

URLs to open in proxy server |
--- |
login-us.microsoftonline.com |
adminwebservice.gov.us.microsoftonline.com |
provisioningapi.gov.us.microsoftonline.com |
+Certificate Revocation Lists |

Azure AD Connect will not be able to automatically detect that your Azure AD directory is located in the Government cloud. Instead you need to take the following actions when you install Azure AD Connect.

1. Start the Azure AD Connect installation.
2. As soon as you see the first page where you are supposed to accept the EULA, close the wizard (do not accept the EULA and do not advance to the next step in the installation wizard).
3. Start regedit and change the registry key `HKLM\SOFTWARE\Microsoft\Azure AD Connect\AzureInstance` to the value `2`.
4. Start the Azure AD Connect installation wizard again. During installation, make sure to use the **custom configuration** installation path (and not Express installation). Then continue the installation as usual.

Features currently not present in the Microsoft Azure Government cloud:

- Azure AD Connect Health is not available.
- Automatic updates is not available.
- Password writeback is not available.

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
