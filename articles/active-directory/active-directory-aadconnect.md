<properties 
	pageTitle="Integrating your on-premises identities with Azure Active Directory." 
	description="This is the Azure AD Connect that describes what it is and why you would use it." 
	services="active-directory" 
	documentationCenter="" 
	authors="billmath" 
	manager="swadhwa" 
	editor="curtand"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/22/2015" 
	ms.author="billmath"/>

# Integrating your on-premises identities with Azure Active Directory

<div class="dev-center-tutorial-selector sublanding">
<a href="../active-directory-aadconnect/" title="What is It" class="current">What is It</a>
<a href="../active-directory-aadconnect-how-it-works/" title="How it Works">How it Works</a>
<a href="../active-directory-aadconnect-get-started/" title="Getting Started">Getting Started</a>
<a href="../active-directory-aadconnect-whats-next/" title="What's Next">What's Next</a>
<a href="../active-directory-aadconnect-learn-more/" title="Learn More">Learn More</a>
</div>


Today, users want to be able to access applications both on-premises and in the cloud.  They want to be able to do this from any device, be it a laptop, smart phone, or tablet.  In order for this to occur, you and your organization need to be able to provide a way for users to access these apps, however moving entirely to the cloud is not always an option.  

<center>![What is Azure AD Connect](./media/active-directory-aadconnect/arch.png)</center>

With the introduction of Azure Active Directory Connect, providing access to these apps and moving to the cloud has never been easier.  Azure AD Connect provides the following benefits:

- Your users can sign on with a common identity both in the cloud and on-premises.  They don't need to remember multiple passwords or accounts and administrators don't have to worry about the additional overhead multiple accounts can bring.
- A single tool and guided experience for connecting your on-premises directories with Azure Active Directory. Once installed the wizard deploys and configures all components required to get your directory integration up and running including sync services, password sync or AD FS, and prerequisites such as the Azure AD PowerShell module.



<center>![What is Azure AD Connect](./media/active-directory-aadconnect/azuread.png)</center>




## Why use Azure AD Connect 

Integrating your on-premises directories with Azure AD makes your users more productive by providing a common identity for accessing both cloud and on-premises resources.  With this integration users and organizations can take advantage of the following:
	
* Organizations can provide users with a common hybrid identity across on-premises or cloud-based services leveraging Windows Server Active Directory and then connecting to Azure Active Directory. 
* Administrators can provide conditional access based on application resource, device and user identity, network location and multi-factor authentication.
* Users can leverage their common identity through accounts in Azure AD to Office 365, Intune, SaaS apps and third-party applications.  
* Developers can build applications that leverage the common identity model, integrating applications into Active Directory on-premises or Azure for cloud-based applications

Azure AD Connect makes this integration easy and simplifies the management of your on-premises and cloud identity infrastructure.



----------------------------------------------------------------------------------------------------------
## Download Azure AD Connect

To get started using Azure AD Connect you can download the latest version using the following:  [Download Azure AD Connect](http://go.microsoft.com/fwlink/?LinkId=615771) 

----------------------------------------------------------------------------------------------------------








 
