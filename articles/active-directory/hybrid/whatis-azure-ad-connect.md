---
title: 'What is Azure AD Connect and Connect Health. | Microsoft Docs'
description: Describes the tools used to synchronize and monitor your on-premises environment with Azure AD.
services: active-directory
author: billmath
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.topic: get-started-article
ms.date: 11/28/2018
ms.component: hybrid
ms.author: billmath
---

## What is Azure AD Connect?

Azure AD Connect is the Microsoft tool designed to meet and accomplish your hybrid identity goals.  It provides the following features:
 	
- [Password hash synchronization](whatis-phs.md) - A sign-in method that synchronizes a hash of a users on-premises AD password with Azure AD.
- [Pass-through authentication](how-to-connect-pta.md) - A sign-in method that allows users to use the same password on-premises and in the cloud, but doesn't require the additional infrastructure of a federated environment.
- [Federation integration](how-to-connect-fed-whatis.md) - Federation is an optional part of Azure AD Connect and can be used to configure a hybrid environment using an on-premises AD FS infrastructure. It also provides AD FS management capabilities such as certificate renewal and additional AD FS server deployments.
- [Synchronization](how-to-connect-sync-whatis.md) - Responsible for creating users, groups, and other objects.  As well as, making sure identity information for your on-premises users and groups is matching the cloud.  This synchronization also includes password hashes.
-  	[Health Monitoring](whatis-hybrid-identity-health.md) - Azure AD Connect Health can provide robust monitoring and provide a central location in the Azure portal to view this activity. 


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


## Next steps

- [Hardware and prerequisites](how-to-connect-install-prerequisites.md) 
- [Express settings](how-to-connect-install-express.md)
- [Customized settings](how-to-connect-install-custom.md)
- [Install Azure AD Connect Health agents](how-to-connect-health-agent-install.md) 