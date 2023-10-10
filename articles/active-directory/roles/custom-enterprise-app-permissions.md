---
title: App permissions for custom roles in Microsoft Entra ID
description: Preview enterprise app permissions for custom Microsoft Entra roles in the Microsoft Entra admin center, PowerShell, or Graph API.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: overview
ms.date: 01/31/2023
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro, has-azure-ad-ps-ref
---

# Enterprise application permissions for custom roles in Microsoft Entra ID

This article contains the currently available enterprise application permissions for custom role definitions in Microsoft Entra ID. In this article, you'll find permission lists for some common scenarios and the full list of enterprise app permissions.

## License requirements

[!INCLUDE [License requirement for using custom roles in Azure AD](../../../includes/active-directory-p1-license.md)]

## Enterprise application permissions

For more information about how to use these permissions, see [Assign custom roles to manage enterprise apps](custom-enterprise-apps.md)

#### Assigning users or groups to an application

To delegate the assignment of user and groups that can access SAML based single sign-on applications. Permissions required

- microsoft.directory/servicePrincipals/appRoleAssignedTo/update

#### Creating gallery applications

To delegate the creation of Microsoft Entra Gallery applications such as ServiceNow, F5, Salesforce, among others. Permissions required:

- microsoft.directory/applicationTemplates/instantiate

#### Configuring basic SAML URLs

To delegate the update and read of basic SAML Configurations for SAML based single sign-on applications. Permissions required:

- microsoft.directory/servicePrincipals/authentication/update
- microsoft.directory/applications.myOrganization/authentication/update

#### Rolling over or creating signing certs

To delegate the management of signing certificates for SAML based single sign-on applications. Permissions required.

microsoft.directory/servicePrincipals/credentials/update

#### Update expiring sign-in cert notification email address

To delegate the update of expiring sign-in certificates notification email addresses for SAML based single sign-on applications. Permissions required:

- microsoft.directory/applications.myOrganization/authentication/update
- microsoft.directory/applications.myOrganization/permissions/update
- microsoft.directory/servicePrincipals/authentication/update
- microsoft.directory/servicePrincipals/basic/update

#### Manage SAML token signature and Sign-in algorithm

To delegate the update of the SAML token signature and sign-in algorithm for SAML based single sign-on applications. Permissions required:

- microsoft.directory/applicationPolicies/basic/update
- microsoft.directory/applications/authentication/update
- microsoft.directory/servicePrincipals/policies/update

#### Manage user attributes and claims

To delegate the create, delete, and update of user attributes and claims for SAML based single sign-on applications. Permissions required:

- microsoft.directory/applicationPolicies/basic/update
- microsoft.directory/applications/authentication/update
- microsoft.directory/servicePrincipals/policies/update

## App provisioning permissions

Performing any write operation such as managing the job, schema, or credentials through the UI will also require the read permissions to view the provisioning page.

Setting the scope to all users and groups or assigned users and groups currently requires both the synchronizationJob and synchronizationCredentials permissions.

#### Turn on or restart provisioning jobs

To delegate ability to turn on, off and restart provisioning jobs. Permissions required:

- microsoft.directory/servicePrincipals/synchronizationJobs/manage  

#### Configure the provisioning schema  

To delegate updates to attribute mapping. Permissions required:

- microsoft.directory/servicePrincipals/synchronizationSchema/manage  

#### Read provisioning settings associated with the application object

To delegate ability to read provisioning settings associated with the object. Permissions required:

- microsoft.directory/applications/synchronization/standard/read

#### Read provisioning settings associated with your service principal

To delegate ability to read provisioning settings associated with your service principal. Permissions required:

- microsoft.directory/servicePrincipals/synchronization/standard/read

#### Authorize application access for provisioning  

To delegate ability to authorize application access for provisioning. Example input Oauth bearer token. Permissions required:

- microsoft.directory/servicePrincipals/synchronizationCredentials/manage

## Application Proxy permissions

Performing any write operations to the Application Proxy properties of the application also requires the permissions to update the application's basic properties and authentication.

To read and perform any write operations to the Application Proxy properties of the application also requires the read permissions to view connector groups as this is part of the list of properties shown on the page.

#### Delegate Application Proxy  connector management

To delegate create, read, update, and delete actions for connector management. Permissions required:

- microsoft.directory/connectorGroups/allProperties/read
- microsoft.directory/connectorGroups/allProperties/update
- microsoft.directory/connectorGroups/create
- microsoft.directory/connectorGroups/delete
- microsoft.directory/connectors/allProperties/read
- microsoft.directory/connectors/create


#### Delegate Application Proxy settings management

To delegate create, read, update, and delete actions for Application Proxy properties on an app. Permissions required:

- microsoft.directory/applications/applicationProxy/read 
- microsoft.directory/applications/applicationProxy/update 
- microsoft.directory/applications/applicationProxyAuthentication/update 
- microsoft.directory/applications/applicationProxySslCertificate/update 
- microsoft.directory/applications/applicationProxyUrlSettings/update 
- microsoft.directory/applications/basic/update
- microsoft.directory/applications/authentication/update
- microsoft.directory/connectorGroups/allProperties/read

#### Read Application Proxy Settings for an app

To delegate read permissions for Application Proxy properties on an app. Permissions required:
 
- microsoft.directory/applications/applicationProxy/read 
- microsoft.directory/connectorGroups/allProperties/read 

#### Update URL configuration Application Proxy settings for an app 

To delegate create, read, update, and delete (CRUD) permissions for updating the Application Proxy external URL, internal URL, and SSL certificate properties. Permissions required: 

- microsoft.directory/applications/applicationProxy/read 
- microsoft.directory/connectorGroups/allProperties/read 
- microsoft.directory/applications/basic/update 
- microsoft.directory/applications/authentication/update
- microsoft.directory/applications/applicationProxyAuthentication/update 
- microsoft.directory/applications/applicationProxySslCertificate/update 
- microsoft.directory/applications/applicationProxyUrlSettings/update

## Full list of permissions

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | ---------- | ----------- |
> | microsoft.directory/applicationPolicies/allProperties/read | Read all properties (including privileged properties) on application policies |
> | microsoft.directory/applicationPolicies/allProperties/update | Update all properties (including privileged properties) on application policies |
> | microsoft.directory/applicationPolicies/basic/update | Update standard properties of application policies |
> | microsoft.directory/applicationPolicies/create | Create application policies |
> | microsoft.directory/applicationPolicies/createAsOwner | Create application policies, and creator is added as the first owner |
> | microsoft.directory/applicationPolicies/delete | Delete application policies |
> | microsoft.directory/applicationPolicies/owners/read | Read owners on application policies |
> | microsoft.directory/applicationPolicies/owners/update | Update the owner property of application policies |
> | microsoft.directory/applicationPolicies/policyAppliedTo/read | Read application policies applied to objects list |
> | microsoft.directory/applicationPolicies/standard/read | Read standard properties of application policies |
> | microsoft.directory/servicePrincipals/allProperties/allTasks | Create and delete service principals, and read and update all properties |
> | microsoft.directory/servicePrincipals/allProperties/read | Read all properties (including privileged properties) on servicePrincipals |
> | microsoft.directory/servicePrincipals/allProperties/update | Update all properties (including privileged properties) on servicePrincipals |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/read | Read service principal role assignments |
> | microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update service principal role assignments |
> | microsoft.directory/servicePrincipals/appRoleAssignments/read | Read role assignments assigned to service principals |
> | microsoft.directory/servicePrincipals/audience/update | Update audience properties on service principals |
> | microsoft.directory/servicePrincipals/authentication/update | Update authentication properties on service principals |
> | microsoft.directory/servicePrincipals/basic/update | Update basic properties on service principals |
> | microsoft.directory/servicePrincipals/create | Create service principals |
> | microsoft.directory/servicePrincipals/createAsOwner | Create service principals, with creator as the first owner |
> | microsoft.directory/servicePrincipals/credentials/update | Update credentials of service principals |
> | microsoft.directory/servicePrincipals/delete | Delete service principals |
> | microsoft.directory/servicePrincipals/disable | Disable service principals |
> | microsoft.directory/servicePrincipals/enable | Enable service principals |
> | microsoft.directory/servicePrincipals/getPasswordSingleSignOnCredentials | Read password single sign-on credentials on service principals |
> | microsoft.directory/servicePrincipals/managePasswordSingleSignOnCredentials | Manage password single sign-on credentials on service principals |
> | microsoft.directory/servicePrincipals/oAuth2PermissionGrants/read | Read delegated permission grants on service principals |
> | microsoft.directory/servicePrincipals/owners/read | Read owners of service principals |
> | microsoft.directory/servicePrincipals/owners/update | Update owners of service principals |
> | microsoft.directory/servicePrincipals/permissions/update | Update permissions of service principals |
> | microsoft.directory/servicePrincipals/policies/read | Read policies of service principals |
> | microsoft.directory/servicePrincipals/policies/update | Update policies of service principals |
> | microsoft.directory/servicePrincipals/standard/read | Read basic properties of service principals |
> | microsoft.directory/servicePrincipals/synchronization/standard/read | Read provisioning settings associated with your service principal |
> | microsoft.directory/servicePrincipals/tag/update | Update the tag property for service principals |
> | microsoft.directory/applicationTemplates/instantiate | Instantiate gallery applications from application templates |
> | microsoft.directory/auditLogs/allProperties/read | Read all properties on audit logs, including privileged properties |
> | microsoft.directory/signInReports/allProperties/read | Read all properties on sign-in reports, including privileged properties |
> | microsoft.directory/applications/applicationProxy/read | Read all application proxy properties |
> | microsoft.directory/applications/applicationProxy/update | Update all application proxy properties |
> | microsoft.directory/applications/applicationProxyAuthentication/update | Update authentication on all types of applications |
> | microsoft.directory/applications/applicationProxyUrlSettings/update | Update URL settings for application proxy |
> | microsoft.directory/applications/applicationProxySslCertificate/update | Update SSL certificate settings for application proxy |
> | microsoft.directory/applications/synchronization/standard/read | Read provisioning settings associated with the application object |
> | microsoft.directory/connectorGroups/create | Create application proxy connector groups |
> | microsoft.directory/connectorGroups/delete | Delete application proxy connector groups |
> | microsoft.directory/connectorGroups/allProperties/read | Read all properties of application proxy connector groups |
> | microsoft.directory/connectorGroups/allProperties/update | Update all properties of application proxy connector groups |
> | microsoft.directory/connectors/create | Create application proxy connectors |
> | microsoft.directory/connectors/allProperties/read | Read all properties of application proxy connectors |
> | microsoft.directory/servicePrincipals/synchronizationJobs/manage | Start, restart, and pause application provisioning synchronization jobs |
> | microsoft.directory/servicePrincipals/synchronization/standard/read | Read provisioning settings associated with your service principal |
> | microsoft.directory/servicePrincipals/synchronizationSchema/manage | Create and manage application provisioning synchronization jobs and schema |
> | microsoft.directory/provisioningLogs/allProperties/read | Read all properties of provisioning logs |

## Next steps

- [Create and assign a custom role in Microsoft Entra ID](custom-create.md)
- [List role assignments](view-assignments.md)
