---
title: Monitor your on-premises identity infrastructure in the cloud.
description: This is the Azure AD Connect Health page that describes what it is and why you would use it.
services: active-directory
documentationcenter: ''
author: karavar
manager: samueld
editor: curtand

ms.assetid: 82798ea6-5cd3-4f30-93ae-d56536f8d8e3
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/10/2017
ms.author: vakarand

---
# Monitor your on-premises identity infrastructure and synchronization services in the cloud
Azure Active Directory (Azure AD) Connect Health helps you monitor and gain insights into your on-premises identity infrastructure and the synchronization services. It enables you to maintain a reliable connection to Office 365 and Microsoft Online Services by providing monitoring capabilities for your key identity components such as Active Directory Federation Services (AD FS) servers, Azure AD Connect servers (also known as Sync Engine), Active Directory domain controllers, etc. It also makes the key data points about these components easily accessible so that you can get usage and other important insights to make informed decisions.

The information is presented in the [Azure AD Connect Health portal](https://aka.ms/aadconnecthealth). In the Azure AD Connect Health portal, you can view alerts, performance monitoring, usage analytics, and other information. Azure AD Connect Health enables the single lens of health for your key identity components in one place.

![What is Azure AD Connect Health](./media/active-directory-aadconnect-health/aadconnecthealth2.png)

As the features in Azure AD Connect Health increase, the portal provides a single dashboard through the lens of identity. You get an even more robust, healthy, and integrated environment for your users to increase their ability to get things done.

## Why use Azure AD Connect Health?
When you integrate your on-premises directories with Azure AD, your users are more productive because there's a common identity to access both cloud and on-premises resources. However, this integration creates the challenge of ensuring that this environment is healthy so that users can reliably access resources both on premises and in the cloud from any device. Azure AD Connect Health helps you monitor and gain insights into your on-premises identity infrastructure that is used to access Office 365 or other Azure AD applications. It is as simple as installing an agent on each of your on-premises identity servers.

## [Azure AD Connect Health for AD FS](active-directory-aadconnect-health-adfs.md)
Azure AD Connect Health for AD FS supports AD FS 2.0 on Windows Server 2008 R2, Windows Server 2012, and Windows Server 2012 R2. It also supports monitoring the AD FS proxy or web application proxy servers that provide authentication support for extranet access. With an easy and low-cost installation of the Health Agent, Azure AD Connect Health for AD FS provides the following set of key capabilities:

* Monitoring with alerts to know when AD FS and AD FS proxy servers are not healthy
* Email notifications for critical alerts
* Trends in performance data, which are useful for capacity planning of AD FS
* Usage analytics for AD FS sign-ins with pivots (apps, users, network location etc.), which are useful to understand how AD FS is getting utilized
* Reports for AD FS such as top 50 users who have bad username/password attempts and their last IP address

The following video provides an overview of Azure AD Connect Health for AD FS.

> [!VIDEO https://channel9.msdn.com/Series/Azure-Active-Directory-Videos-Demos/Azure-AD-Connect-Health--Monitor-you-identity-bridge/player]
>
>

## [Azure AD Connect Health for sync](active-directory-aadconnect-health-sync.md)
Azure AD Connect Health for sync monitors and provides information about the syncs that occur between your on-premises Active Directory and Azure AD. Azure AD Connect Health for sync provides the following set of key capabilities:

* Monitoring with alerts to know when an Azure AD Connect server, also known as the Sync Engine, is not healthy
* Email notifications for critical alerts
* Sync operational insights, which include latency charts for sync operations and trends in different operations such as adds, updates, deletes
* Quick glance information about sync properties and last successful export to Azure AD
* Reports about object-level sync errors \(does not require Azure AD Premium\)

The following video provides an overview of Azure AD Connect Health for sync.

> [!VIDEO https://channel9.msdn.com/Series/Azure-Active-Directory-Videos-Demos/Azure-Active-Directory-Connect-Health-Monitoring-the-sync-engine/player]
>
>

## [Azure AD Connect Health for AD DS](active-directory-aadconnect-health-adds.md)
Azure AD Connect Health for Active Directory Domain Services (AD DS) provides monitoring for domain controllers that are installed on Windows Server 2008 R2, Windows Server 2012, Windows Server 2012 R2, and Windows Server 2016. The Health Agent installation enables you to monitor your on-premises AD DS environment from the cloud. Azure AD Connect Health for AD DS provides the following set of key capabilities:

* Monitoring alerts to detect when domain controllers are unhealthy and email notifications for critical alerts
* The Domain Controllers dashboard, which provides a quick view of the health and operational status of your domain controllers
* The Replication Status dashboard that has the latest replication information and links to troubleshooting guides when errors are detected
* Quick anywhere access to performance data graphs of popular performance counters, which are necessary for troubleshooting and monitoring purposes

The following video provides an overview of Azure AD Connect Health for AD DS.

> [!VIDEO https://channel9.msdn.com/Series/Azure-Active-Directory-Videos-Demos/Azure-AD-Connect-Health-monitors-on-premises-AD-Domain-Services/player]
>
>

## Get started with Azure AD Connect Health
To get started with Azure AD Connect Health, use the following steps:

1. [Get Azure AD Premium](../active-directory-get-started-premium.md) or [start a trial](https://azure.microsoft.com/trial/get-started-active-directory/).
2. [Download and install Azure AD Connect Health Agents](#download-and-install-azure-ad-connect-health-agent) on your identity servers.
3. View the Azure AD Connect Health dashboard at [https://aka.ms/aadconnecthealth](https://aka.ms/aadconnecthealth).

> [!NOTE]
> Remember that before you see data in your Azure AD Connect Health dashboard, you need to install the Azure AD Connect Health Agents on your targeted servers.
>
>

## Download and install Azure AD Connect Health Agent
* Make sure that you [satisfy the requirements](active-directory-aadconnect-health-agent-install.md#requirements) for Azure AD Connect Health.
* Get started using Azure AD Connect Health for AD FS
    * [Download Azure AD Connect Health Agent for AD FS.](http://go.microsoft.com/fwlink/?LinkID=518973)
    * [See the installation instructions](active-directory-aadconnect-health-agent-install.md#installing-the-azure-ad-connect-health-agent-for-ad-fs).
* Get started using Azure AD Connect Health for sync
    * [Download and install the latest version of Azure AD Connect](http://go.microsoft.com/fwlink/?linkid=615771). The Health Agent for sync will be installed as part of the Azure AD Connect installation (version 1.0.9125.0 or higher).
* Get started using Azure AD Connect Health for AD DS
    * [Download Azure AD Connect Health Agent for AD DS](http://go.microsoft.com/fwlink/?LinkID=820540).
    * [See the installation instructions](active-directory-aadconnect-health-agent-install.md#installing-the-azure-ad-connect-health-agent-for-ad-ds).

## Azure AD Connect Health portal
The Azure AD Connect Health portal shows views of alerts, performance monitoring, and usage analytics. The  https://aka.ms/aadconnecthealth URL takes you to the main blade of Azure AD Connect Health. You can think of a blade as a window. On The main blade, you see **Quick Start**, services within Azure AD Connect Health, and additional configuration options. See the following screenshot and brief explanations that follow the screenshot. After you deploy the agents, the health service automatically identifies the services that Azure AD Connect Health is monitoring.

> [!NOTE]
> For licensing information, see the [Azure AD Connect FAQ](active-directory-aadconnect-health-faq.md) or the [Azure AD Pricing page](https://aka.ms/aadpricing).
    
![Azure AD Connect Health Portal](./media/active-directory-aadconnect-health/portal4.png)

* **Quick Start**: When you select this option, the **Quick Start** blade opens. You can download the Azure AD Connect Health Agent by selecting **Get Tools**. You can also access documentation and provide feedback.
* **Active Directory Federation Services**: This option shows all the AD FS services that Azure AD Connect Health is currently monitoring. When you select an instance, the blade that opens shows information about that service instance. This information includes an overview, properties, alerts, monitoring, and usage analytics. Read more about the capabilities at [Using Azure AD Connect Health with AD FS](active-directory-aadconnect-health-adfs.md).
* **Azure Active Directory Connect (sync)**: This option shows your Azure AD Connect servers that Azure AD Connect Health is currently monitoring. When you select the entry, the blade that opens shows information about your Azure AD Connect servers. Read more about the capabilities at [Using Azure AD Connect Health for sync](active-directory-aadconnect-health-sync.md).
* **Active Directory Domain Services**: This option shows all the AD DS forests that Azure AD Connect Health is currently monitoring. When you select a forest, the blade that opens shows information about that forest. This information includes an overview of essential information, the Domain Controllers dashboard, the Replication Status dashboard, alerts, and monitoring. Read more about the capabilities at [Using Azure AD Connect Health with AD DS](active-directory-aadconnect-health-adds.md).
* **Configure**: This section includes options to turn the following on or off:

  - Auto-update to automatically update the Azure AD Connect Health agent to the latest version: You will be automatically updated to the latest versions of the Azure AD Connect Health Agent when they become available. This is enabled by default.
  - Allow Microsoft access to your Azure AD directory’s health data for troubleshooting purposes only: If this is enabled, Microsoft can see the same data that you see. This information can help with troubleshooting and assistance with issues. This is disabled by default.

## Related links
* [Azure AD Connect Health Agent installation](active-directory-aadconnect-health-agent-install.md)
* [Azure AD Connect Health operations](active-directory-aadconnect-health-operations.md)
* [Using Azure AD Connect Health with AD FS](active-directory-aadconnect-health-adfs.md)
* [Using Azure AD Connect Health for sync](active-directory-aadconnect-health-sync.md)
* [Using Azure AD Connect Health with AD DS](active-directory-aadconnect-health-adds.md)
* [Azure AD Connect Health FAQ](active-directory-aadconnect-health-faq.md)
* [Azure AD Connect Health version history](active-directory-aadconnect-health-version-history.md)
