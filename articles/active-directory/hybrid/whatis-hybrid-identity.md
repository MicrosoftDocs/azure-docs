---
title: 'Connect Active Directory with Azure Active Directory. | Microsoft Docs'
description: Azure AD Connect will integrate your on-premises directories with Azure Active Directory. This allows you to provide a common identity for Office 365, Azure, and SaaS applications integrated with Azure AD.
keywords: introduction to Azure AD Connect, Azure AD Connect overview, what is Azure AD Connect, install active directory
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: ''
ms.assetid: 59bd209e-30d7-4a89-ae7a-e415969825ea
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/18/2018
ms.component: hybrid
ms.author: billmath
---

# Hybrid identity and Microsoft's identity solutions
Today, businesses and corporations are a becoming more and more a mixture of on-premises and cloud applications.  Having applications and users who require access to those applications, on-premises and in the cloud, has become a challenging scenario.

Microsoft’s identity solutions span on-premises and cloud-based capabilities, creating a single user identity for authentication and authorization to all resources, regardless of location. We call this hybrid identity.

## What is Azure AD Connect?

Azure AD Connect is the Microsoft tool designed to meet and accomplish your hybrid identity goals.  This allows you to provide a common identity for your users for Office 365, Azure, and SaaS applications integrated with Azure AD.  It provides the following features:
 	
- [Synchronization](how-to-connect-sync-whatis.md) - This component is responsible for creating users, groups, and other objects. It is also responsible for making sure identity information for your on-premises users and groups is matching the cloud.  It is responsible for synchronizing password hashes with Azure AD.
-  	[AD FS and federation integration](how-to-connect-fed-whatis.md) - Federation is an optional part of Azure AD Connect and can be used to configure a hybrid environment using an on-premises AD FS infrastructure. It also provides AD FS management capabilities such as certificate renew and additional AD FS server deployments.
-  	[Pass-through Authentication](how-to-connect-pta.md) - Another optional component that allows users to use the same password on-premises and in the cloud, but doesn't require the additional infrastructure of a federated environment
-  	[Health Monitoring](whatis-hybrid-identity-health.md) - Azure AD Connect Health can provide robust monitoring and provide a central location in the Azure portal to view this activity. 


![What is Azure AD Connect](./media/whatis-hybrid-identity/arch.png)



## What is Azure AD Connect Health?

Azure Active Directory (Azure AD) Connect Health helps you monitor and gain insights into your on-premises identity infrastructure and the synchronization services. It enables you to maintain a reliable connection to Office 365 and Microsoft Online Services by providing monitoring capabilities for your key identity components such as Active Directory Federation Services (AD FS) servers, Azure AD Connect servers (also known as Sync Engine), Active Directory domain controllers, etc. It also makes the key data points about these components easily accessible so that you can get usage and other important insights to make informed decisions.

The information is presented in the [Azure AD Connect Health portal](https://aka.ms/aadconnecthealth). In the Azure AD Connect Health portal, you can view alerts, performance monitoring, usage analytics, and other information. Azure AD Connect Health enables the single lens of health for your key identity components in one place.

![What is Azure AD Connect Health](./media/whatis-hybrid-identity-health/aadconnecthealth2.png)


As the features in Azure AD Connect Health increase, the portal provides a single dashboard through the lens of identity. You get an even more robust, healthy, and integrated environment for your users to increase their ability to get things done.


## Why use Azure AD Connect?
Integrating your on-premises directories with Azure AD makes your users more productive by providing a common identity for accessing both cloud and on-premises resources. Users and organizations can take advantage of the following:

* Users can use a single identity to access on-premises applications and cloud services such as Office 365.
* Single tool to provide an easy deployment experience for synchronization and sign-in.
* Provides the newest capabilities for your scenarios. Azure AD Connect replaces older versions of identity integration tools such as DirSync and Azure AD Sync. For more information, see [Hybrid Identity directory integration tools comparison](plan-hybrid-identity-design-considerations-tools-comparison.md).

## Why use Azure AD Connect Health?
When you integrate your on-premises directories with Azure AD, your users are more productive because there's a common identity to access both cloud and on-premises resources. However, this integration creates the challenge of ensuring that this environment is healthy so that users can reliably access resources both on premises and in the cloud from any device. Azure AD Connect Health helps you monitor and gain insights into your on-premises identity infrastructure that is used to access Office 365 or other Azure AD applications. It is as simple as installing an agent on each of your on-premises identity servers.

### [Azure AD Connect Health for AD FS](how-to-connect-health-adfs.md)
Azure AD Connect Health for AD FS supports AD FS 2.0 on Windows Server 2008 R2, Windows Server 2012, Windows Server 2012 R2 and Windows Server 2016. It also supports monitoring the AD FS proxy or web application proxy servers that provide authentication support for extranet access. With an easy and quick installation of the Health Agent, Azure AD Connect Health for AD FS provides you a set of key capabilities.

#### Key benefits and best practices

- *Enhanced security*
  -	[Extranet lockout trends](how-to-connect-health-adfs.md#usage-analytics-for-ad-fs)
  -	[Failed sign-ins report](how-to-connect-health-adfs.md#risky-ip-report-public-preview) 
  -	In [privacy compliant](reference-connect-health-user-privacy.md)    
- *Get alerted on all [critical ADFS system issues](how-to-connect-health-alert-catalog.md#alerts-for-active-directory-federation-services)*
 	- Server configuration and availability 
 	- [Performance and connectivity](how-to-connect-health-adfs.md#performance-monitoring-for-ad-fs) 
  - Regular maintenance    
- *Easy to deploy and manage*
  -	Quick [agent installation](how-to-connect-health-agent-install.md#installing-the-azure-ad-connect-health-agent-for-ad-fs) 
  -	Agent auto upgrade to the latest 
  -	Data available in portal within minutes    
- *Rich [usage metrics](how-to-connect-health-adfs.md#usage-analytics-for-ad-fs)* 
  -	Top applications usage
  -	Network locations and TCP connection
  -	Token requests per server    
- *Great user experience* 
  -	Dashboard fashion from Azure portal
  -	[Alerts through emails](how-to-connect-health-adfs.md#alerts-for-ad-fs)    

#### Feature highlight

*	Monitoring with alerts to know when AD FS and AD FS proxy servers are not healthy
*	Email notifications for critical alerts
*	Trends in performance data, which are useful for capacity planning of AD FS
*	Usage analytics for AD FS sign-ins with pivots (apps, users, network location etc.)
*	Reports for AD FS such as top 50 users who have bad username/password attempts and their last IP address
*	Risky IP report for failed AD FS sign-ins

Read more here about [Using Azure AD Connect Health with AD FS](how-to-connect-health-adfs.md)

### [Azure AD Connect Health for sync](how-to-connect-health-sync.md)
Azure AD Connect Health for sync monitors and provides information about the syncs that occur between your on-premises Active Directory and Azure AD. Azure AD Connect Health for sync provides the following set of key capabilities:

* Monitoring with alerts to know when an Azure AD Connect server, also known as the Sync Engine, is not healthy
* Email notifications for critical alerts
* Sync operational insights, which include latency charts for sync operations and trends in different operations such as adds, updates, deletes
* Quick glance information about sync properties and last successful export to Azure AD
* Reports about object-level sync errors \(does not require Azure AD Premium\)

Read more here about [Using Azure AD Connect Health for sync](how-to-connect-health-sync.md)

### [Azure AD Connect Health for AD DS](how-to-connect-health-adds.md)
Azure AD Connect Health for Active Directory Domain Services (AD DS) provides monitoring for domain controllers that are installed on Windows Server 2008 R2, Windows Server 2012, Windows Server 2012 R2, and Windows Server 2016. The Health Agent installation enables you to monitor your on-premises AD DS environment from the cloud. Azure AD Connect Health for AD DS provides the following set of key capabilities:

* Monitoring alerts to detect when domain controllers are unhealthy and email notifications for critical alerts
* The Domain Controllers dashboard, which provides a quick view of the health and operational status of your domain controllers
* The Replication Status dashboard that has the latest replication information and links to troubleshooting guides when errors are detected
* Quick anywhere access to performance data graphs of popular performance counters, which are necessary for troubleshooting and monitoring purposes

Read more here about [Using Azure AD Connect Health with AD DS](how-to-connect-health-adds.md)

## Next Steps


- [Hardware and prerequisites](how-to-connect-install-prerequisites.md) 
- [Express settings](how-to-connect-install-express.md)
- [Customized settings](how-to-connect-install-custom.md)
- [Password hash synchronization](how-to-connect-password-hash-synchronization.md)|
- [Pass-through authentication](how-to-connect-pta.md)
- [Azure AD Connect and federation](how-to-connect-fed-whatis.md)
- [Install Azure AD Connect Health agents](how-to-connect-health-agent-install.md) 
- [Azure AD Connect sync](how-to-connect-sync-whatis.md)
- [Version history](reference-connect-version-history.md)
- [Directory integration tools comparison](plan-hybrid-identity-design-considerations-tools-comparison.md)
- [Azure AD Connect FAQ](reference-connect-faq.md)









