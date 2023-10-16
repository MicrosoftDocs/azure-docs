---
title: 'What is identity provisioning with Microsoft Entra ID?'
description: Describes overview of identity provisioning.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 01/17/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# What is identity provisioning?

Today, businesses, and corporations are becoming more and more a mixture of on-premises and cloud applications.  Users require access to  applications both on-premises and in the cloud. There is need to have a single identity across these various applications (on-premises as well as cloud).

Provisioning is the process of creating an object based on certain conditions, keeping the object up to date and deleting the object when conditions are no longer met. For example, when a new user joins your organization, that user is entered in to the HR system.  At that point, provisioning can create a corresponding user account in the cloud, in Active Directory, and different applications that the user needs access to.  This allows the user to start work and have access to the applications and systems they need on day one. 

![Diagram that shows cloud provisioning with Microsoft Entra ID.](media/what-is-provisioning/cloud-1.png)

With regard to Microsoft Entra ID, provisioning can be broken down in to the following key scenarios.  

- **[HR-driven provisioning](#hr-driven-provisioning)**  
- **[App provisioning](#app-provisioning)**  
- **[Directory provisioning](#directory-provisioning)** 

## HR-driven provisioning

![Diagram that shows HR-driven provisioning with Cloud HR, On-premises HR, and Microsoft Entra ID.](media/what-is-provisioning/cloud-2.png)

Provisioning from HR to the cloud involves the creation of objects (users, roles, groups, etc.) based on the information that is in your HR system.  

The most common scenario would be, when a new employee joins your company, they are entered into the HR system.  Once that occurs, they are provisioned to the cloud.  In this case, Microsoft Entra ID.  Provisioning from HR can cover the following scenarios. 

- **Hiring new employees** - When a new employee is added to cloud HR, a user account is automatically created in Active Directory, Microsoft Entra ID, and optionally Microsoft 365 and other SaaS applications supported by Microsoft Entra ID, with write-back of the email address to Cloud HR.
- **Employee attribute and profile updates** - When an employee record is updated in cloud HR (such as their name, title, or manager), their user account will be automatically updated in Active Directory, Microsoft Entra ID, and optionally Microsoft 365 and other SaaS applications supported by Microsoft Entra ID.
- **Employee terminations** - When an employee is terminated in cloud HR, their user account is automatically disabled in Active Directory, Microsoft Entra ID, and optionally Office 365 and other SaaS applications supported by Microsoft Entra ID.
- **Employee rehires** - When an employee is rehired in cloud HR, their old account can be automatically reactivated or re-provisioned (depending on your preference) to Active Directory, Microsoft Entra ID, and optionally Microsoft 365 and other SaaS applications supported by Microsoft Entra ID.


## App provisioning

![Diagram that shows App provisioning with On-premises apps, Non-Microsoft cloud apps, and Microsoft Entra ID.](media/what-is-provisioning/cloud-3.png)

In Microsoft Entra ID, the term **[app provisioning](../app-provisioning/user-provisioning.md)** refers to automatically creating user identities and roles in the cloud applications that users need access to. In addition to creating user identities, automatic provisioning includes the maintenance and removal of user identities as status or roles change. Common scenarios include provisioning a Microsoft Entra user into applications like [Dropbox](../saas-apps/dropboxforbusiness-provisioning-tutorial.md), [Salesforce](../saas-apps/salesforce-provisioning-tutorial.md), [ServiceNow](../saas-apps/servicenow-provisioning-tutorial.md), and more.

## Directory provisioning

![cloud provisioning](media/what-is-provisioning/cloud-4.png)

On-premises provisioning involves provisioning from on-premises sources (like Active Directory) to Microsoft Entra ID.  

The most common scenario would be, when a user in Active Directory (AD) is provisioned into Microsoft Entra ID.

This has been accomplished by Microsoft Entra Connect Sync, Microsoft Entra Connect cloud provisioning and Microsoft Identity Manager. 
 
## Next steps 

- [What is Microsoft Entra Cloud Sync?](cloud-sync/what-is-cloud-sync.md)
- [Install cloud provisioning](cloud-sync/how-to-install.md)
