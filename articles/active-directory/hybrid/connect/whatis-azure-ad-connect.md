---
title: 'What is Microsoft Entra Connect and Connect Health.'
description: Learn about the tools used to synchronize and monitor your on-premises environment with Microsoft Entra ID.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 01/19/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# What is Microsoft Entra Connect?

Microsoft Entra Connect is an on-premises Microsoft application that's designed to meet and accomplish your hybrid identity goals. If you're evaluating how to best meet your goals, you should also consider the cloud-managed solution [Microsoft Entra Cloud Sync](../cloud-sync/what-is-cloud-sync.md).


> [!div class="nextstepaction"]
> [Install Microsoft Entra Connect](https://www.microsoft.com/download/details.aspx?id=47594)
> 


 >[!IMPORTANT]
 >Microsoft Entra Connect V1 has been retired as of August 31, 2022 and is no longer supported. Microsoft Entra Connect V1 installations may **stop working unexpectedly**. If you are still using a Microsoft Entra Connect V1 you need to upgrade to Microsoft Entra Connect V2 immediately.

<a name='consider-moving-to-azure-ad-connect-cloud-sync'></a>

## Consider moving to Microsoft Entra Cloud Sync
Microsoft Entra Cloud Sync is the future of synchronization for Microsoft.  It will replace Microsoft Entra Connect.  

> [!VIDEO https://www.youtube.com/embed/9T6lKEloq0Q]

Before moving the Microsoft Entra Connect V2.0, you should consider moving to cloud sync.  You can see if cloud sync is right for you, by accessing the [Check sync tool](https://aka.ms/M365Wizard) from the portal or via the link provided.

For more information see [What is cloud sync?](../cloud-sync/what-is-cloud-sync.md)

<a name='azure-ad-connect-features'></a>

## Microsoft Entra Connect features
     
- [Password hash synchronization](whatis-phs.md) - A sign-in method that synchronizes a hash of a users on-premises AD password with Microsoft Entra ID.
- [Pass-through authentication](how-to-connect-pta.md) - A sign-in method that allows users to use the same password on-premises and in the cloud, but doesn't require the additional infrastructure of a federated environment.
- [Federation integration](how-to-connect-fed-whatis.md) - Federation is an optional part of Microsoft Entra Connect and can be used to configure a hybrid environment using an on-premises AD FS infrastructure. It also provides AD FS management capabilities such as certificate renewal and additional AD FS server deployments.
- [Synchronization](how-to-connect-sync-whatis.md) - Responsible for creating users, groups, and other objects.  As well as, making sure identity information for your on-premises users and groups is matching the cloud.  This synchronization also includes password hashes.
- [Health Monitoring](whatis-azure-ad-connect.md#what-is-azure-ad-connect-health) - Microsoft Entra Connect Health can provide robust monitoring and provide a central location in the [Microsoft Entra admin center](https://entra.microsoft.com) to view this activity. 


![What is Microsoft Entra Connect](../media/whatis-hybrid-identity/arch.png)

> [!IMPORTANT]
> Microsoft Entra Connect Health for Sync requires Microsoft Entra Connect Sync V2. If you are still using AADConnect V1 you must upgrade to the latest version. 
> AADConnect V1 is retired on August 31, 2022. Microsoft Entra Connect Health for Sync will no longer work with AADConnect V1 in December 2022.



<a name='what-is-azure-ad-connect-health'></a>

## What is Microsoft Entra Connect Health?

Microsoft Entra Connect Health provides robust monitoring of your on-premises identity infrastructure. It enables you to maintain a reliable connection to Microsoft 365 and Microsoft Online Services.  This reliability is achieved by providing monitoring capabilities for your key identity components. Also, it makes the key data points about these components easily accessible.



The information is presented in the [Microsoft Entra Connect Health portal](https://aka.ms/aadconnecthealth). Use the Microsoft Entra Connect Health portal to view alerts, performance monitoring, usage analytics, and other information. Microsoft Entra Connect Health enables the single lens of health for your key identity components in one place.

![What is Microsoft Entra Connect Health](./media/whatis-hybrid-identity-health/aadconnecthealth2.png)

<a name='why-use-azure-ad-connect'></a>

## Why use Microsoft Entra Connect?
Integrating your on-premises directories with Microsoft Entra ID makes your users more productive by providing a common identity for accessing both cloud and on-premises resources. Users and organizations can take advantage of:

* Users can use a single identity to access on-premises applications and cloud services such as Microsoft 365.
* Single tool to provide an easy deployment experience for synchronization and sign-in.
* Provides the newest capabilities for your scenarios. Microsoft Entra Connect replaces older versions of identity integration tools such as DirSync and Azure AD Sync. For more information, see [Hybrid Identity directory integration tools comparison](../index.yml).

<a name='why-use-azure-ad-connect-health'></a>

## Why use Microsoft Entra Connect Health?
When authenticating with Microsoft Entra ID, your users are more productive because there's a common identity to access both cloud and on-premises resources. Ensuring the environment is reliable, so that users can access these resources, becomes a challenge.  Microsoft Entra Connect Health helps monitor and gain insights into your on-premises identity infrastructure thus ensuring the reliability of this environment. It is as simple as installing an agent on each of your on-premises identity servers.

Microsoft Entra Connect Health for AD FS supports AD FS on Windows Server 2012 R2, Windows Server 2016, Windows Server 2019 and Windows Server 2022. It also supports monitoring the web application proxy servers that provide authentication support for extranet access. With an easy and quick installation of the Health Agent, Microsoft Entra Connect Health for AD FS provides you a set of key capabilities.

Key benefits and best practices:

|Key Benefits|Best Practices|
|-----|-----|
|Enhanced security|[Extranet lockout trends](how-to-connect-health-adfs.md#usage-analytics-for-ad-fs)</br>[Failed sign-ins report](how-to-connect-health-adfs-risky-ip.md)</br>[In privacy compliant](reference-connect-health-user-privacy.md)|
|Get alerted on [all critical ADFS system issues](how-to-connect-health-alert-catalog.md#alerts-for-active-directory-federation-services)|Server configuration and availability</br>[Performance and connectivity](how-to-connect-health-adfs.md#performance-monitoring-for-ad-fs)</br>Regular maintenance|
|Easy to deploy and manage|[Quick agent installation](how-to-connect-health-agent-install.md#install-the-agent-for-ad-fs)</br>Agent auto upgrade to the latest</br>Data available in portal within minutes|
Rich [usage metrics](how-to-connect-health-adfs.md#usage-analytics-for-ad-fs)|Top applications usage</br>Network locations and TCP connection</br>Token requests per server|
|Great user experience|Dashboard fashion from [Microsoft Entra admin center](https://entra.microsoft.com)</br>[Alerts through emails](how-to-connect-health-adfs.md#alerts-for-ad-fs)|


<a name='license-requirements-for-using-azure-ad-connect'></a>

## License requirements for using Microsoft Entra Connect

[!INCLUDE [active-directory-free-license.md](../../../../includes/active-directory-free-license.md)]

<a name='license-requirements-for-using-azure-ad-connect-health'></a>

## License requirements for using Microsoft Entra Connect Health
[!INCLUDE [active-directory-free-license.md](../../../../includes/active-directory-p1-license.md)]

## Next steps

- [Hardware and prerequisites](how-to-connect-install-prerequisites.md) 
- [Express settings](how-to-connect-install-express.md)
- [Customized settings](how-to-connect-install-custom.md)
- [Install Microsoft Entra Connect Health agents](how-to-connect-health-agent-install.md)
