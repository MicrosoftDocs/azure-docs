<properties 
                pageTitle="What is Azure Active Directory?" 
                description="Use Azure Active Directory to extend your existing on-premises identities into the cloud or develop Azure AD integrated applications." 
                services="active-directory" 
                documentationCenter="" 
                authors="markusvi" 
                manager="terrylan" 
                editor=""/>

<tags 
                ms.service="active-directory" 
                ms.workload="identity" 
                ms.tgt_pltfrm="na" 
                ms.devlang="na" 
                ms.topic="hero-article" 
                ms.date="06/24/2015" 
                ms.author="curtand"/>


# What is Azure Active Directory?





Azure Active Directory (Azure AD) is Microsoft’s cloud based Identity as a Service (IDaaS) solution that provides you with a comprehensive set of Identity (Who) and Access management capabilities (What). It represents a new approach to Identity management that helps you to become more productive, safer and user friendly.

While offering a new approach, Azure AD enables you to preserve your investments in your existing identity eco system and your deployed infrastructure. For example, you can connect it to your on-premises Active Directory with only [four clicks](http://blogs.technet.com/b/ad/archive/2014/08/04/connecting-ad-and-azure-ad-only-4-clicks-with-azure-ad-connect.aspx). On the cloud side, it supports you with the integration to [thousands of SaaS apps](http://blogs.technet.com/b/ad/archive/2014/09/03/50-saas-apps-now-support-federation-with-azure-ad.aspx). 

With Azure AD, you can pick and choose the services you need for your business through a variety of scalable subscription offerings. This ensures that you pay for only what you use.  


The following list summarizes the driving factors for Azure AD’s design:

- **Ease of use** - Azure AD provides an easy way for your business to manage identity and access to your organizational applications and services in the cloud and on-premises. <br>
It is pre-integrated with thousands of applications supporting an easy deployment. In addition to this, you can also easily integrate your own cloud and on-premises applications with support for single-sign on and identity access.
The support includes your users, customers and partners.

- **Empowering users** - Your users can use one work or personal account for single sign-on to any cloud and on-premises web application, using their favorite IOS, Android, Mac OS and Windows devices. Due to the various self-service capabilities, they can perform administrative tasks without the need to contact helpdesk.   
- **Enhancing security**: Your organization can protect sensitive data and applications both on-premises and in the cloud ensuring secure local and remote access. You can monitor how your system is used and detect potential threads.
- **Hybrid Identity** - – The ability to integrate your on-premises directories enables information workers to securely and consistently access your corporate resources by using just a single organizational account.<br> 
You can use Azure AD to enhance your on-premises infrastructure through self-service, built in connectivity to applications, and security tools. 
With Azure AD you can even provision accounts from your cloud applications to AD on premises.

- **Reporting & Analytics** - Azure AD also offers comprehensive reports and analytics enhance security, monitor usage, and to provide you with a detailed overview of how your environment is performing. 
- **High Availability** - With Azure AD’s enterprise scale and SLA, your business will continue running at all times.




<center>![Azure AD Connect Stack](./media/active-directory-whatis/Azure_Active_Directory.png)
</center>


## Where does Azure AD come from?

Azure AD started as Microsoft’s central Identity and Access Management system. The organizational directory service was designed to address our customer’s need for having a single and common identity and access management system for all of Microsoft’s online and organizational services. It was first released to general availability with the launch of Microsoft Office 365. Azure AD is the organizational directory powering all of Microsoft's organizational services, including Office 365, Azure, Intune, and Dynamics.

In addition, we have expanded Azure AD’s capabilities to extend beyond Microsoft online services. Azure AD is your single, comprehensive identity and access management system, available as a stand alone IDaaS or you can use it to extend your existing on-premises infrastructure. With Azure AD, you can easily enable self-service and single sign-on for thousands of SaaS apps, enhance your security and address enterprise mobility requirements. 

What makes Azure AD’s organizational service unique is the fact that each customer’s instance (also known as “tenant”) is isolated from other customers' data, while at the same time, it scales across multiple datacenters (triple redundancy) to ensure resiliency and performance, as well as enable high availability. 



## What does this mean to me?

All Microsoft Online Service’s tenants are rooted in an instance of Azure AD. Effectively, if you already have an Office 365 or Intune tenant, it is an Azure AD instance containing a record of the applicable Office 365 or Intune subscriptions.
Similarly, Azure subscriptions, while created and managed for an individual user, are provisioned and linked with that user through an Azure AD instance they are a member of. Using this model, Azure subscriptions and resources can be easily managed by other users in the “tenant” (directory).

In all cases, Azure AD provides authentication and authorization capabilities for these services ensuring consistent IAM, monitoring and reporting.

As a result of this, all aspects of identity and access management for Microsoft's services are performed in (or against) Azure AD. Customers can access relevant aspects of Azure AD management through, for example, services like Office 365. In this example, all identity management tasks done in the office administration portal are executed directly on the Azure AD instance and apply to all other services using the same Azure AD instance. Comprehensive identity and access management experiences are delivered centrally through the Azure AD portal, PowerShell, and programmatic interfaces.





## What can Azure Active Directory do for me?
Azure AD provides a wealth of capabilities across its various offerings (Azure AD free, basic, premium and Enterprise Mobility Suite). <br>
You can use the capabilities to implement, for example, the following collection of popular E2E scenarios:

- Agile adoption of cloud services by providing an easy sign-on experience in form of single-sign on, backed up by access management and provisioning to the cloud services 
-              Comprehensive and consistent access management, reporting and monitoring across cloud and on-premises applications
-              Improving my application’s’ security by implementing  multifactor authentication and conditional access
-              Empowering my users to be more productive and happy by providing an easy and controlled access to apps and services and self-services capabilities
-              Protecting my business from advanced threads with security reporting and monitoring
-              Enhancing security and monitoring for  my organization's shared social media accounts
-              Secure mobile (remote) access to on-premises applications


To learn more about Azure AD’s capabilities that support these E2E scenarios, see:

- [Enabling your directory for hybrid management with Azure AD Connect](active-directory-aadconnect.md)
- [Additional security for an ever connected world](multi-factor-authentication.md)
- [Automate User Provisioning and Deprovisioning to SaaS Applications with Azure Active Directory](active-directory-saas-app-provisioning.md)
- [Deploying Password Management and training users to use it](active-directory-passwords-best-practices.md)
- [Single-sign-on and access management to thousands of SaaS applications on any cloud](https://msdn.microsoft.com/library/azure/dn308590.aspx) 
- [Secure remote access to on-premises application](https://msdn.microsoft.com/library/azure/dn768219.aspx)
- [Self-service access management](https://msdn.microsoft.com/library/azure/dn641267.aspx) 
- [Cloud app discovery](https://msdn.microsoft.com/library/azure/mt143581.aspx)
- [Access control based on device health, user location, and identity](https://msdn.microsoft.com/library/azure/dn906873.aspx)
- [Utilize the cloud to enhance and monitor on-premises identity systems](https://msdn.microsoft.com/library/azure/dn906722.aspx)
- [Rich standard based platform for developers](https://msdn.microsoft.com/library/azure/ff800682.aspx)


## What can I do next?

Here are some suggestions for you:

- [Try it out](http://azure.microsoft.com/pricing/free-trial/) - you can sign up and deploy your first cloud solution in under 5 minutes using this link
- Tell us what you think or how we can help you by asking a question or starting a discussion on the [Microsoft Azure Active Directory  forum](https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=WindowsAzureAD).
- [Check out the Active Directory Team Blog](http://blogs.technet.com/b/ad/)














