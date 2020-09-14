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
ms.date: 09/14/2020
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro
---

# Enterprise application permissions for custom roles in Azure Active Directory

This article contains the currently available Enterprise application permissions for custom role definitions in Azure Active Directory (Azure AD). In this article you'll find: permission lists for some common scenarios and the full list of enterprise app permissions.

## Required license plan

Using this feature requires an Azure AD Premium P1 license for your Azure AD organization. To find the right license for your requirements, see [Comparing generally available features of the Free, Basic, and Premium editions](https://azure.microsoft.com/pricing/details/active-directory/).

## Delegate only App Proxy connectors

To delegate create, read, update and delete (CRUD) actions for connector management.

Permissions required

- microsoft.directory/connectorGroups/allProperties/read
- microsoft.directory/connectorGroups/allProperties/update
- microsoft.directory/connectorGroups/create
- microsoft.directory/connectorGroups/delete
- microsoft.directory/connectors/allProperties/read
- microsoft.directory/connectors/create

## Manage only App Proxy Settings for an App 

To delegate Create, Read, Update and delete actions for app proxy properties on an app.  

Permissions required

- microsoft.directory/applications/applicationProxy/read
- microsoft.directory/applications/applicationProxy/update
- microsoft.directory/applications/applicationProxyAuthentication/update
- microsoft.directory/applications/applicationProxySslCertificate/update
- microsoft.directory/applications/applicationProxyUrlSettings/update
- microsoft.directory/applications/basic/update
- microsoft.directory/applications/authentication/update
- microsoft.directory/connectorGroups/allProperties/read

## Read only App Proxy Settings for an App

To delegate Read permissions for app proxy properties on an app.  

Permissions required

- microsoft.directory/applications/applicationProxy/read
- microsoft.directory/connectorGroups/allProperties/read

## Update only URL configuration App Proxy Settings for an App

Read properties for app proxy properties on an app.  

Permissions required

- microsoft.directory/applications/applicationProxy/read
- microsoft.directory/connectorGroups/allProperties/read
- microsoft.directory/applications/basic/update
- microsoft.directory/applications/authentication/update
- microsoft.directory/applications/applicationProxyAuthentication/update
- microsoft.directory/applications/applicationProxySslCertificate/update
- microsoft.directory/applications/applicationProxyUrlSettings/update

## Full list of permissions

microsoft.directory/applicationPolicies/standard/read
microsoft.directory/applicationPolicies/allProperties/read
microsoft.directory/applicationPolicies/policyAppliedTo/read
microsoft.directory/applicationPolicies/basic/update
microsoft.directory/applicationPolicies/owners/read
microsoft.directory/applicationPolicies/allProperties/update
microsoft.directory/applicationPolicies/owners/update
microsoft.directory/applicationPolicies/create
microsoft.directory/applicationPolicies/createAsOwner
microsoft.directory/applicationPolicies/delete
microsoft.directory/servicePrincipals/standard/read
microsoft.directory/servicePrincipals/allProperties/read
microsoft.directory/servicePrincipals/allProperties/update
microsoft.directory/servicePrincipals/appRoleAssignedTo/read
microsoft.directory/servicePrincipals/appRoleAssignedTo/update
microsoft.directory/servicePrincipals/appRoleAssignments/read
microsoft.directory/servicePrincipals/owners/read
microsoft.directory/servicePrincipals/policies/read
microsoft.directory/servicePrincipals/owners/update
microsoft.directory/applications/owners/update
microsoft.directory/applicationTemplates/instantiate
microsoft.directory/servicePrincipals/policies/update
microsoft.directory/servicePrincipals/tag/update
microsoft.directory/servicePrincipals/getPasswordSingleSignOnCredentials
microsoft.directory/servicePrincipals/managePasswordSingleSignOnCredentials
microsoft.directory/servicePrincipals/create
microsoft.directory/servicePrincipals/createAsOwner
microsoft.directory/servicePrincipals/disable
microsoft.directory/servicePrincipals/enable
microsoft.directory/servicePrincipals/audience/update
microsoft.directory/servicePrincipals/authentication/update
microsoft.directory/servicePrincipals/basic/update
microsoft.directory/servicePrincipals/credentials/update
microsoft.directory/servicePrincipals/permissions/update
microsoft.directory/servicePrincipals/delete
microsoft.directory/servicePrincipals/oAuth2PermissionGrants/read
microsoft.directory/servicePrincipals/synchronization/standard/read
microsoft.directory/auditLogs/allProperties/read
microsoft.directory/signInReports/allProperties/read
microsoft.directory/applications/applicationProxy/read
microsoft.directory/applications/applicationProxy/update
microsoft.directory/applications/applicationProxyAuthentication/update
microsoft.directory/applications/applicationProxyUrlSettings/update
microsoft.directory/applications/applicationProxySslCertificate/update
microsoft.directory/applications/synchronization/standard/read
microsoft.directory/connectorGroups/create
microsoft.directory/connectorGroups/delete
microsoft.directory/connectorGroups/allProperties/read
microsoft.directory/connectorGroups/allProperties/update
microsoft.directory/connectors/create
microsoft.directory/connectors/allProperties/read
microsoft.directory/servicePrincipals/synchronizationJobs/manage
microsoft.directory/servicePrincipals/synchronization/standard/read
microsoft.directory/servicePrincipals/synchronizationSchema/manage
microsoft.directory/provisioningLogs/allProperties/read

## Next steps

- [Create custom roles using the Azure portal, Azure AD PowerShell, and Graph API](roles-create-custom.md)
- [View the assignments for a custom role](roles-view-assignments.md)
