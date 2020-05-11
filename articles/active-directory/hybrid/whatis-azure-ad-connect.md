---
title: 'What is Azure AD Connect and Connect Health. | Microsoft Docs'
description: Describes the tools used to synchronize and monitor your on-premises environment with Azure AD.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 01/08/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# What is Azure AD Connect?

Azure AD Connect is the Microsoft tool designed to meet and accomplish your hybrid identity goals.  It provides the following features:
     
- [Password hash synchronization](whatis-phs.md) - A sign-in method that synchronizes a hash of a users on-premises AD password with Azure AD.
- [Pass-through authentication](how-to-connect-pta.md) - A sign-in method that allows users to use the same password on-premises and in the cloud, but doesn't require the additional infrastructure of a federated environment.
- [Federation integration](how-to-connect-fed-whatis.md) - Federation is an optional part of Azure AD Connect and can be used to configure a hybrid environment using an on-premises AD FS infrastructure. It also provides AD FS management capabilities such as certificate renewal and additional AD FS server deployments.
- [Synchronization](how-to-connect-sync-whatis.md) - Responsible for creating users, groups, and other objects.  As well as, making sure identity information for your on-premises users and groups is matching the cloud.  This synchronization also includes password hashes.
- [Health Monitoring](whatis-hybrid-identity-health.md) - Azure AD Connect Health can provide robust monitoring and provide a central location in the Azure portal to view this activity. 


![What is Azure AD Connect](./media/whatis-hybrid-identity/arch.png)



## What is Azure AD Connect Health?

Azure Active Directory (Azure AD) Connect Health provides robust monitoring of your on-premises identity infrastructure. It enables you to maintain a reliable connection to Office 365 and Microsoft Online Services.  This reliability is achieved by providing monitoring capabilities for your key identity components. Also, it makes the key data points about these components easily accessible.

The information is presented in the [Azure AD Connect Health portal](https://aka.ms/aadconnecthealth). Use the Azure AD Connect Health portal to view alerts, performance monitoring, usage analytics, and other information. Azure AD Connect Health enables the single lens of health for your key identity components in one place.

![What is Azure AD Connect Health](./media/whatis-hybrid-identity-health/aadconnecthealth2.png)

## Why use Azure AD Connect?
Integrating your on-premises directories with Azure AD makes your users more productive by providing a common identity for accessing both cloud and on-premises resources. Users and organizations can take advantage of:

* Users can use a single identity to access on-premises applications and cloud services such as Office 365.
* Single tool to provide an easy deployment experience for synchronization and sign-in.
* Provides the newest capabilities for your scenarios. Azure AD Connect replaces older versions of identity integration tools such as DirSync and Azure AD Sync. For more information, see [Hybrid Identity directory integration tools comparison](plan-hybrid-identity-design-considerations-tools-comparison.md).

## Why use Azure AD Connect Health?
When with Azure AD, your users are more productive because there's a common identity to access both cloud and on-premises resources. Ensuring the environment is reliable, so that users can access these resources, becomes a challenge.  Azure AD Connect Health helps monitor and gain insights into your on-premises identity infrastructure thus ensuring the reliability of this environment. It is as simple as installing an agent on each of your on-premises identity servers.

Azure AD Connect Health for AD FS supports AD FS 2.0 on Windows Server 2008 R2, Windows Server 2012, Windows Server 2012 R2 and Windows Server 2016. It also supports monitoring the AD FS proxy or web application proxy servers that provide authentication support for extranet access. With an easy and quick installation of the Health Agent, Azure AD Connect Health for AD FS provides you a set of key capabilities.

Key benefits and best practices:

|Key Benefits|Best Practices|
|-----|-----|
|Enhanced security|[Extranet lockout trends](how-to-connect-health-adfs.md#usage-analytics-for-ad-fs)</br>[Failed sign-ins report](how-to-connect-health-adfs-risky-ip.md)</br>[In privacy compliant](reference-connect-health-user-privacy.md)|
|Get alerted on [all critical ADFS system issues](how-to-connect-health-alert-catalog.md#alerts-for-active-directory-federation-services)|Server configuration and availability</br>[Performance and connectivity](how-to-connect-health-adfs.md#performance-monitoring-for-ad-fs)</br>Regular maintenance|
|Easy to deploy and manage|[Quick agent installation](how-to-connect-health-agent-install.md#installing-the-azure-ad-connect-health-agent-for-ad-fs)</br>Agent auto upgrade to the latest</br>Data available in portal within minutes|
Rich [usage metrics](how-to-connect-health-adfs.md#usage-analytics-for-ad-fs)|Top applications usage</br>Network locations and TCP connection</br>Token requests per server|
|Great user experience|Dashboard fashion from Azure portal</br>[Alerts through emails](how-to-connect-health-adfs.md#alerts-for-ad-fs)|


## License requirements for using Azure AD Connect

[!INCLUDE [active-directory-free-license.md](../../../includes/active-directory-free-license.md)]

## License requirements for using Azure AD Connect Health
[!INCLUDE [active-directory-free-license.md](../../../includes/active-directory-p1-license.md)]

## Next steps

- [Hardware and prerequisites](how-to-connect-install-prerequisites.md) 
- [Express settings](how-to-connect-install-express.md)
- [Customized settings](how-to-connect-install-custom.md)
- [Install Azure AD Connect Health agents](how-to-connect-health-agent-install.md) 
