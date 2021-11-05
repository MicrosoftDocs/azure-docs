---

title: Conditional access gap analyzer workbook in  Azure AD | Microsoft Docs
description: Learn how to use the conditional access gap analyzer workbook.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: karenho
editor: ''

ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 11/05/2021
ms.author: markvi
ms.reviewer: sarbar 

ms.collection: M365-identity-device-management
---

# Sensitive operations report workbook



This article provides you with an overview of this workbook.


## Description

![Workbook category](./media/workbook-sesitive-operations-report/workbook-category.png)


This workbook is intended to help identify suspicious application and service principal activity that may indicate compromises in your environment.


This workbook identifies recent sensitive operations that have been performed in your tenant and which may service principal compromise. 
 

 

## Sections

This workbook is split into four sections:

![Workbook sections](./media/workbook-sesitive-operations-report/workbook-sections.png)


- **Modified application and service principal credentials/authentication methods** - This report flags actors who have recently changed many service principal credentials, as well as how many of each type of service principal credentials have been changed.

- **New permissions granted to service principals** - This workbook also highlights recently granted OAuth 2.0 permissions to service principals. 

- **Directory role and group membership updates for service principals**



- **Modified federation settings** - This report highlights when a user or application modifies federation settings on a domain. For example, it reports when a new Active Directory Federated Service (ADFS) TrustedRealm object, such as a signing certificate, is added to the domain. Modification to domain federation settings should be rare. 




### Modified application and service principal credentials/authentication methods

One of the most common ways for attackers to gain persistence in the environment is by adding new credentials to existing applications and service principals. This allows the attacker to authenticate as the target application or service principal, granting them access to all resources to which it has permissions.

This section includes the following data to help you detect:

- All new credentials added to apps and service principals, including the credential type

- Top actors and the amount of credentials modifications they performed

- A timeline for all credential changes



### New permissions granted to service principals

In cases where the attacker cannot find a service principal or an application with a high privilege set of permissions through which to gain access, they will often attempt to add the permissions to another service principal or app.

This section includes a breakdown of the AppOnly permissions grants to existing service principals. Admins should investigate any instances of excessive high permissions being granted, including, but not limited to, Exchange Online, Microsoft Graph and Azure AD Graph.


## Directory role and group membership updates for service principals 

Following the logic of the attacker adding new permissions to existing service principals and applications, another approach is adding them to existing directory roles or groups.

This section includes an overview of all changes made to service principal memberships and should be reviewed for any additions to high privilege roles and groups.



### Modified federation settings

Another common approach to gaining a long-term foothold in the environment is modifying the tenant’s federated domain trusts and effectively adding an additional, attacker controlled, SAML IDP as a trusted authentication source.

This section includes the following data:

- Changes performed to existing domain federation trusts

- Addition of new domains and trusts


  


## Filters

This workbook doesn't have filters.


## Best practice


**Use:**
 
- **Modified application and service principal credentials** to look out for credentials being added to service principals which are not frequently used in your organization. Use the filters present in this section to further investigate any of the suspicious actors or service principals that were modified.


- **New permissions granted to service principals** to look out for broad or excessive permissions being added to service principals by actors that may be compromised.  

- **Modified federation settings** section to confirm that the added or modified target domain/URL is a legitimate admin behavior. Any actions which modify or add domain federation trusts are rare and should be treated as high fidelity to be investigated as soon as possible.





## Next steps

- [How to use Azure AD workbooks](howto-use-azure-monitor-workbooks.md)
