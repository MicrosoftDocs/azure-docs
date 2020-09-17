---
title: App permissions for custom roles in Azure Active Directory | Microsoft Docs
description: Preview enterprise app permissions for custom Azure AD roles in the Azure portal, PowerShell, or Graph API.
services: active-directory
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: overview
ms.date: 09/21/2020
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro
---

# Enterprise application permissions for custom roles in Azure Active Directory

This article contains the currently available Enterprise application permissions for custom role definitions in Azure Active Directory (Azure AD). In this article you'll find: permission lists for some common scenarios and the full list of enterprise app permissions.

## Required license plan

Using this feature requires an Azure AD Premium P1 license for your Azure AD organization. To find the right license for your requirements, see [Comparing generally available features of the Free, Basic, and Premium editions](https://azure.microsoft.com/pricing/details/active-directory/).

## Delegate only App Proxy connectors

To delegate create, read, update and delete (CRUD) operations for connector management. Permissions required:

- microsoft.directory/connectorGroups/allProperties/read
- microsoft.directory/connectorGroups/allProperties/update
- microsoft.directory/connectorGroups/create
- microsoft.directory/connectorGroups/delete
- microsoft.directory/connectors/allProperties/read
- microsoft.directory/connectors/create

## Manage only App Proxy settings for an app

To delegate create, read, update and delete (CRUD) operations for app proxy properties on an app. Permissions required:

- microsoft.directory/applications/applicationProxy/read
- microsoft.directory/applications/applicationProxy/update
- microsoft.directory/applications/applicationProxyAuthentication/update
- microsoft.directory/applications/applicationProxySslCertificate/update
- microsoft.directory/applications/applicationProxyUrlSettings/update
- microsoft.directory/applications/basic/update
- microsoft.directory/applications/authentication/update
- microsoft.directory/connectorGroups/allProperties/read

## Read only App Proxy Settings for an App

To delegate Read permissions for app proxy properties on an app. Permissions required:

- microsoft.directory/applications/applicationProxy/read
- microsoft.directory/connectorGroups/allProperties/read

## Update only URL configuration App Proxy Settings for an App

Read properties for app proxy properties on an app. Permissions required:

- microsoft.directory/applications/applicationProxy/read
- microsoft.directory/connectorGroups/allProperties/read
- microsoft.directory/applications/basic/update
- microsoft.directory/applications/authentication/update
- microsoft.directory/applications/applicationProxyAuthentication/update
- microsoft.directory/applications/applicationProxySslCertificate/update
- microsoft.directory/applications/applicationProxyUrlSettings/update

## Full list of permissions

Permission | Description
---------- | -----------
microsoft.directory/applicationPolicies/allProperties/read | Read all properties (including privileged properties) on application policies.
microsoft.directory/applicationPolicies/allProperties/update | Update all properties (including privileged properties) on application policies.
microsoft.directory/applicationPolicies/basic/update | Update standard properties of application policies.
microsoft.directory/applicationPolicies/create | Create application policies.
microsoft.directory/applicationPolicies/createAsOwner | Create application policies. Creator is added as the first owner.
microsoft.directory/applicationPolicies/delete | Delete application policies.
microsoft.directory/applicationPolicies/owners/read | Read owners on application policies.
microsoft.directory/applicationPolicies/owners/update | Update the owner property of application policies.
microsoft.directory/applicationPolicies/policyAppliedTo/read | Read application policies applied to objects list.
microsoft.directory/applicationPolicies/standard/read | Read standard properties of application policies.
microsoft.directory/servicePrincipals/allProperties/allTasks | Create and delete servicePrincipals, and read and update all properties in Azure Active Directory.
microsoft.directory/servicePrincipals/allProperties/read | Read all properties (including privileged properties) on servicePrincipals.
microsoft.directory/servicePrincipals/allProperties/update | Update all properties (including privileged properties) on servicePrincipals.
microsoft.directory/servicePrincipals/appRoleAssignedTo/read | Read service principal role assignments.
microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments.
microsoft.directory/servicePrincipals/appRoleAssignments/read | Read role assignments assigned to service principals.
microsoft.directory/servicePrincipals/audience/update | Update audience properties on service principals.
microsoft.directory/servicePrincipals/authentication/read |  
microsoft.directory/servicePrincipals/authentication/update | Update authentication properties on service principals.
microsoft.directory/servicePrincipals/basic/update | Update basic properties on service principals.
microsoft.directory/servicePrincipals/create | Create service principals.
microsoft.directory/servicePrincipals/createAsOwner | Create service principals. Creator is added as the first owner.
microsoft.directory/servicePrincipals/credentials/update | Update credentials properties on service principals.
microsoft.directory/servicePrincipals/delete | Delete service principals.
microsoft.directory/servicePrincipals/disable |  
microsoft.directory/servicePrincipals/enable | Enable service principals.
microsoft.directory/servicePrincipals/getPasswordSingleSignOnCredentials | Read password single sign-on credentials on service principals.
microsoft.directory/servicePrincipals/managePasswordSingleSignOnCredentials | Manage password single sign-on credentials on service principals.
microsoft.directory/servicePrincipals/oAuth2PermissionGrants/read | Read delegated permission grants on service principals.
microsoft.directory/servicePrincipals/owners/read | Read owners on service principals.
microsoft.directory/servicePrincipals/owners/update | Update owners on service principals.
microsoft.directory/servicePrincipals/permissions/update |  
microsoft.directory/servicePrincipals/policies/read | Read policies on service principals.
microsoft.directory/servicePrincipals/policies/update | Update policies on service principals.
microsoft.directory/servicePrincipals/standard/read | Read standard properties of service principals.
microsoft.directory/servicePrincipals/synchronization/standard/read | Read provisioning settings associated with your service principal.
microsoft.directory/servicePrincipals/tag/update |  
microsoft.directory/applicationTemplates/instantiate | 
microsoft.directory/auditLogs/allProperties/read | Read audit logs.
microsoft.directory/signInReports/allProperties/read | Read sign-in reports.
microsoft.directory/applications/applicationProxy/read | Read all application proxy properties of all types of applications.
microsoft.directory/applications/applicationProxy/update | Update all application proxy properties of all types of applications.
microsoft.directory/applications/applicationProxyAuthentication/update | Update application proxy authentication properties of all types of applications.
microsoft.directory/applications/applicationProxyUrlSettings/update | Update application proxy internal and external URLs of all types of applications.
microsoft.directory/applications/applicationProxySslCertificate/update | Update application proxy custom domains of all types of applications.
microsoft.directory/applications/synchronization/standard/read | Read provisioning settings associated with the application object.
microsoft.directory/connectorGroups/create | Create application proxy connector groups.
microsoft.directory/connectorGroups/delete | Delete application proxy connector groups.
microsoft.directory/connectorGroups/allProperties/read | Read all properties of application proxy connector groups.
microsoft.directory/connectorGroups/allProperties/update | Update all properties of application proxy connector groups.
microsoft.directory/connectors/create | Create application proxy connectors.
microsoft.directory/connectors/allProperties/read | Read all properties of application proxy connectors.
microsoft.directory/servicePrincipals/synchronizationJobs/manage | Manage all aspects of job synchronization for service principal resources
microsoft.directory/servicePrincipals/synchronization/standard/read | Read provisioning settings associated with service principals
microsoft.directory/servicePrincipals/synchronizationSchema/manage | Manage all aspects of schema synchronization for service principal resources
microsoft.directory/provisioningLogs/allProperties/read | Read all properties of provisioning logs

## Next steps

- [Create custom roles using the Azure portal, Azure AD PowerShell, and Graph API](roles-create-custom.md)
- [View the assignments for a custom role](roles-view-assignments.md)
