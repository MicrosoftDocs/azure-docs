---
title: Delegate  roles in Azure Active Directory | Microsoft Docs
description: Roles to delegate for identity tasks in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.workload: identity
ms.component: users-groups-roles
ms.topic: article
ms.date: 10/17/2018
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro
#As an Azure AD administrator, I want to know which roles are available for a given task
---

# Administrator roles by identity task in Azure Active Directory

In this article, you can find the least privileged roles you can assign for your organization's top administrator tasks in Azure Active Directory (Azure AD).

## Activity - Audit logs

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Read audit logs | Reports reader | Security Reader, Security administrator

## Activity - Sign-ins

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Read sign-in logs | Reports reader | Security Reader, Security administrator

## Application proxy

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Configure application proxy app | Application administrator | 
Configure connector group properties | Application administrator | 
Create connector group | Application administrator | 
Delete connector group | Application administrator | 
Disable appliction proxy | Application administrator | 
Download connector service | Application administrator | 

## Application registration

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Create application registration | Application developer | Cloud application administrator, application administrator
Read all configuration | Directory readers | Default user role (see documentation)
Update application registration properties | Application registration owner | Cloud application administrator, Application administrator

## Azure AD roles

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Assign users to roles | Privileged role administrator | 
Configure role settings | Privileged role administrator | 
View audit activity | Security reader | 
View role memberships | Security reader | 

## Company branding

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Configure company branding | Global Administrator | 
Read all configuration | Directory readers | Default user role (see documentation)

## Company properties

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Configure company properties | Global Administrator | 

## Conditional access

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Configure MFA trusted Ips | Conditional access administrator | 
Create custom controls | Conditional access administrator | Security administrator
Create named locations | Conditional access administrator | Security administrator
Create policies | Conditional access administrator | Security administrator
Create terms of use | Conditional access administrator | Security administrator
Create VPN connectivity certificate | Conditional access administrator | Security administrator
Delete classic policy | Conditional access administrator | Security administrator
Delete terms of use | Conditional access administrator | Security administrator
Delete VPN connectivity certificate | Conditional access administrator | Security administrator
Disable classic policy | Conditional access administrator | Security administrator
Manage custom controls | Conditional access administrator | Security administrator
Manage named locations | Conditional access administrator | Security administrator
Manage terms of use | Conditional access administrator | Security administrator
Read all configuration | Security reader | Security administrator
Read named locations | Security reader | Conditional access administrator, security administrator

## Device management

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Disable device | Cloud device administrator | 
Enable device | Cloud device administrator | 
Read all configuration | Directory readers | Default user role (see documentation)

## Domains

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Manage domains | Global Administrator | 
Read all configuration | Directory readers | Default user role (see documentation)

## Enterprise applications

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Consent to requested permissions | Cloud application administrator | Application administrator
Create enterprise application | Cloud application administrator | Application administrator
Manage Application Proxy | Application administrator | 
Manage user settings | Global Administrator | 
Read all configuration | Directory readers | Default user role (see documentation)
Update enterprise application assignments | Enterprise application owner | Cloud application administrator, application administrator
Update enterprise application owners | Enterprise application owner | Cloud application administrator, application administrator
Update enterprise application properties | Enterprise application owner | Cloud application administrator, application administrator
Update enterprise application provisioning | Enterprise application owner | Cloud application administrator, application administrator
Update enterprise application self-service | Enterprise application owner | Cloud application administrator, application administrator
Update single sign-on properties | Enterprise application owner | Cloud application administrator, application administrator

## Group management

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Assign license | User account administrator | 
Create group | User account administrator | 
Manage group expiration | User account administrator | 
Manage group settings | User account administrator | 
Read all configuration (except hidden membership) | Directory readers | Default user role (see documentation)
Read hidden membership | Group member | Group owner, password administrator, exchange administrator, sharepoint administrator, teams administrator, user account administrator
Revoke license | License administrator | User account administrator
Update group membership | Group owner | User account administrator
Update group owners | Group owner | User account administrator
Update group properties | Group owner | User account administrator

## Identity security score

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Read all configuration | Security reader | Security administrator
Read security score | Security reader | Security administrator
Update event status | Security administrator | 

## Licenses

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Assign license | License administrator | User account administrator
Read all configuration | Directory readers | Default user role (see documentation)
Revoke license | License administrator | User account administrator
Try or buy subscription | Billing administrator | 

## Multifactor Authentication

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Delete all existing app passwords generated by the selected users | Global Administrator | 
Disable MFA | Global Administrator | 
Enable MFA | Global Administrator | 
Manage MFA service settings | Global Administrator | 
ntact methods again | Global Administrator | 
Restore multi-factor authentication on all remembered devices  | Global Administrator | 

## Organizational relationships

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Manage identity providers | Global Administrator | 
Manage settings | Global Administrator | 
Manage terms of use | Global Administrator | 
Read all configuration | Global Administrator | 

## Roles and administrators

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Manage role assignments | Privileged role administrator | 
Read all configuration | Directory readers | Default user role (see documentation)

## Security authentication methods

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Configure authentication methods | Global Administrator | 

## Support

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Submit support ticket | Service Support Administrator | See documentation

## User management

Task | Least privileged role | Additional roles
---- | --------------------- | ----------------
Add user to directory role | Privileged role administrator | 
Add user to group | User account administrator | 
Assign license | License administrator | User account administrator
Create guest user | Guest inviter | User account administrator
Create user | User account administrator | 
Delete users | User account administrator | 
Invalidate refresh tokens of limited admins (see documentation) | User account administrator | 
Invalidate refresh tokens of non-admins (see documentation) | Password administrator | User account administrator
Invalidate refresh tokens of privileged admins (see documentation) | Global Administrator | 
Read all configuration | Directory readers | Default user role (see documentation)
Reset password for limited admins (see documentation) | User account administrator | 
Reset password of non-admins (see documentation) | Password administrator | User account administrator
Reset password of privileged admins | Global Administrator | 
Revoke license | License administrator | User account administrator
Update all properties except User Principal Name | User account administrator | 
Update User Principal Name for limited admins (see documentation) | User account administrator | 
Update User Principal Name property on privileged admins (see documentation) | Global Administrator | 
Update user settings | Global Administrator | 

## Next steps

* [How to assign or remove azure AD administrator roles](directory-manage-roles-portal.md)
* [Azure AD administrator roles reference](directory-assign-admin-roles.md)