---

title: Sensitive operations report workbook in  Microsoft Entra ID
description: Learn how to use the sensitive operations report workbook.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 11/01/2022
ms.author: sarahlipsey
ms.reviewer: sarbar 

ms.collection: M365-identity-device-management
---

# Sensitive operations report workbook

As an IT administrator, you need to be able to identify compromises in your environment to ensure that you can keep it in a healthy state. 

The sensitive operations report workbook is intended to help identify suspicious application and service principal activity that may indicate compromises in your environment.


This article provides you with an overview of this workbook.


## Description

![Workbook category](./media/workbook-sensitive-operations-report/workbook-category.png)

This workbook identifies recent sensitive operations that have been performed in your tenant and which may service principal compromise.

If your organization is new to Azure monitor workbooks, you need to integrate your Microsoft Entra sign-in and audit logs with Azure Monitor before accessing the workbook. This integration allows you to store, and query, and visualize your logs using workbooks for up to two years. Only sign-in and audit events created after Azure Monitor integration will be stored, so the workbook won't contain insights prior to that date. Learn more about the prerequisites to Azure Monitor workbooks for Microsoft Entra ID. If you've previously integrated your Microsoft Entra sign-in and audit logs with Azure Monitor, you can use the workbook to assess past information. 
 
 

## Sections

This workbook is split into four sections:

![Workbook sections](./media/workbook-sensitive-operations-report/workbook-sections.png)


- **Modified application and service principal credentials/authentication methods** - This report flags actors who have recently changed many service principal credentials, and how many of each type of service principal credentials have been changed.

- **New permissions granted to service principals** - This workbook also highlights recently granted OAuth 2.0 permissions to service principals. 

- **Directory role and group membership updates for service principals**



- **Modified federation settings** - This report highlights when a user or application modifies federation settings on a domain. For example, it reports when a new Active Directory Federated Service (ADFS) TrustedRealm object, such as a signing certificate, is added to the domain. Modification to domain federation settings should be rare. 




### Modified application and service principal credentials/authentication methods

One of the most common ways for attackers to gain persistence in the environment is by adding new credentials to existing applications and service principals. The credentials allow the attacker to authenticate as the target application or service principal, granting them access to all resources to which it has permissions.

This section includes the following data to help you detect:

- All new credentials added to apps and service principals, including the credential type

- Top actors and the number of credentials modifications they performed

- A timeline for all credential changes



### New permissions granted to service principals

In cases where the attacker can't find a service principal or an application with a high privilege set of permissions through which to gain access, they'll often attempt to add the permissions to another service principal or app.

This section includes a breakdown of the AppOnly permissions grants to existing service principals. Admins should investigate any instances of excessive high permissions being granted, including, but not limited to, Exchange Online, Microsoft Graph and Azure AD Graph.


### Directory role and group membership updates for service principals 

Following the logic of the attacker adding new permissions to existing service principals and applications, another approach is adding them to existing directory roles or groups.

This section includes an overview of all changes made to service principal memberships and should be reviewed for any additions to high privilege roles and groups.



### Modified federation settings

Another common approach to gain a long-term foothold in the environment is to:

- Modify the tenant’s federated domain trusts.
- Add another SAML IDP that is controlled by the attacker as a trusted authentication source. 

This section includes the following data:

- Changes performed to existing domain federation trusts

- Addition of new domains and trusts


  


## Filters

This paragraph lists the supported filters for each section.


### Modified Application and Service Principal Credentials/Authentication Methods

- Time range
- Operation name
- Credential
- Actor
- Exclude actor


### New permissions granted to service principals

- Time range
- Client app
- Resource

### Directory role and group membership updates to service principals

- Time range
- Operation
- Initiating user or app

### Modified federation settings

- Time range
- Operation
- Initiating user or app




## Best practices


**Use:**
 
- **Modified application and service principal credentials** to look out for credentials being added to service principals that aren't frequently used in your organization. Use the filters present in this section to further investigate any of the suspicious actors or service principals that were modified.


- **New permissions granted to service principals** to look out for broad or excessive permissions being added to service principals by actors that may be compromised.  

- **Modified federation settings** section to confirm that the added or modified target domain/URL is a legitimate admin behavior. Actions that modify or add domain federation trusts are rare and should be treated as high fidelity to be investigated as soon as possible.





## Next steps

- [How to use Microsoft Entra workbooks](howto-use-azure-monitor-workbooks.md)
