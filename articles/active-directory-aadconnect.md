<properties urlDisplayName="Azure Active Directory Connect" pageTitle="Azure Active Directory Connect" metaKeywords="" description="The Azure Active Directory Connect wizard is the single tool and guided experience for connecting your on-premises Windows Server Active Directory with Azure Active Directory" metaCanonical="" services="azure active directory connect" documentationCenter="" title="Azure Active Directory Connect" authors="cherylmc" solutions="" manager="terrylan" editor="" />

<tags ms.service="azure active directory connect" ms.workload="azure active directory" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/14/2015" ms.author="gabag" />

<h1 id="vnettut1">Azure Active Directory Connect</h1>

The Azure Active Directory Connect wizard is the single tool and guided experience for connecting your on-premises directories with Azure Active Directory.  The wizard deploys and configures all components required to get your directory integration up and running including sync services, password sync or Active Directory  Federation Services (AD FS), and prerequisites such as the Azure AD PowerShell module.

[AZURE.IMPORTANT] Azure Active Directory Connect encompasses functionality that was previously released as DirSync and AAD Sync.  These tools will no longer be released individually.  Future improvements will be included in updates to Azure Active Directory Connect, so that you always know where to get the most current functionality.  

##  Azure Active Directory Connect Public Preview 

The current Azure Active Directory Connect Public Preview provides a guided experience for integrating one or many Windows Server Active Directory forests with Azure AD. 

[Download Azure AD Connect Public Preview](http://connect.microsoft.com/site1164/program8612 "Azure Active Directory Connect") 

With the current preview release of Azure Active Directory Connect you can do the following: 

- Choose Express Settings for a quick and easy configuration for a single forest in 4 clicks
- Choose Custom settings to configure multiple forests or to select AD FS for the single sign-on (SSO) experience
- Configure additional synchronization options such as Exchange Hybrid mode, password writeback, and alternate ID attribute

##  Benefits of extending on-premises directories to the cloud 

Extending your on-premises Windows Server Active Directory to Azure AD gives you a common hybrid identity model for accessing both on-premises and cloud resources.  

- As an organization, you can provide your users with a common identity across on-premises and cloud-based resources
- Your users can leverage their common identity through accounts in Azure AD to Office 365, Intune, SaaS apps and third-party applications.  
- Developers can build applications that leverage the common identity model, integrating applications into on-premises Active Directory or Azure AD.

**Azure Active Directory Connect is now your one stop shop for sync, sign-on, and all other aspects of your on-premises to Azure AD integration.**

[Learn more about Azure Active Directory Connect vs DirSync, AAD Sync, and FIM](http://msdn.microsoft.com/en-us/library/azure/dn757582.aspx "Directory Integration Tools").

