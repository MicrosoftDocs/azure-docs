---
title: Configure separation of duties for an access package in Azure AD entitlement management - Azure Active Directory
description: Learn how to configure separation of duties enforcement for requests for an access package in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: ajburnle
manager: daveba
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 07/2/2021
ms.author: ajburnle
ms.reviewer: 
ms.collection: M365-identity-device-management

#Customer intent: As a global administrator or access package manager, I want to configure that a user cannot request an access package if they already have incompatible access.

---
# Configure separation of duties checks for an access package in Azure AD entitlement management (Preview)

In Azure AD entitlement management, you can configure multiple policies, with different settings for each user community that will need access through an access package.  For example, employees might only need manager approval to get access to certain apps, but guests coming in from other organizations may require both a sponsor and a resource manager to approve, and those guest’s access must be reviewed quarterly. You can specify a particular group of users or connected organization for who can request access, however you may wish to further restrict access, in order to avoid a user from obtaining excessive access.

With the separation of duties settings on an access package, you can configure that a user cannot request an access package, if they already have an assignment to another access package, or are a member of a group.

![myaccess experience for attempting to request incompatible access](./media/entitlement-management-access-package-incompatible/request-prevented.png)


## Scenarios for separation of duties checks

For example, you have an access package, *Marketing Campaign*, that people across your organization and other organizations can request access to, to work with your organization's marketing department on that marketing campaign. Since employees in the marketing department should already have access to that marketing campaign material, you wouldn't want employees in the marketing department to request access to that access package.  Or, you may already have a dynamic group, *Marketing department employees*, with all of the marketing employees in it. You could indicate that the access package is incompatible with the membership of that dynamic group. Then, if a marketing department employee is looking for an access package to request, they couldn't request access to the *Marketing campaign* access package.

Similarly, you may have an application with two roles - **Western Sales** and **Eastern Sales** - and want to ensure that a user can only have one sales territory at a time.  If you have two access packages, one access package **Western Territory** giving the **Western Sales** role and the other access package **Eastern Territory** giving the **Eastern Sales** role, then you can configure
 - the **Western Territory** access package has the **Eastern Territory** package as incompatible, and
 - the **Eastern Territory** access package has the **Western Territory** package as incompatible.

If you’ve been using Microsoft Identity Manager or other on-premises identity management systems for automating access for on-premises apps, then you can integrate these identity management systems with Azure AD entitlement management as well.  If you will be controlling access to Azure AD-integrated apps through entitlement management, and want to prevent users from having incompatible access, you can configure your on-premises identity management system to send a group of users into Azure AD through Azure AD Connect, and then indicate that group is incompatible with your access package.  That ensures a user will be unable to request an access package, if that access package would give access that's incompatible with access the user has in on-premises apps.

## Prerequisites

To use Azure AD entitlement management and assign users to access packages, you must have one of the following licenses:

- Azure AD Premium P2
- Enterprise Mobility + Security (EMS) E5 license

## Configure another access package or group membership as incompatible for requesting access to an access package

**Prerequisite role**: Global administrator, Identity Governance administrator, User administrator, Catalog owner or Access package manager

Follow these steps to change the list of incompatible groups or other access packages for an existing access package:

1.	Sign in to the [Azure portal](https://portal.azure.com).

1.  Click **Azure Active Directory**, and then click **Identity Governance**.

1.	In the left menu, click **Access packages** and then open the access package which users will request.

1.	In the left menu, click **Separation of duties (preview)**.

1.  If you wish to prevent users who have another access package assignment already from requesting this access package, click on **Add access package** and select the access package that the user would already be assigned.


    ![configuration of incompatible access packages](./media/entitlement-management-access-package-incompatible/select-incompatible-ap.png)


1.  If you wish to prevent users who have an existing group membership from requesting this access package, then click on **Add group** and select the group that the user would already be in.

## View other access packages that are configured as incompatible with this one

**Prerequisite role**: Global administrator, Identity Governance administrator, User administrator, Catalog owner or Access package manager

Follow these steps to view the list of other access packages that have indicated that they are incompatible with an existing access package:

1.	Sign in to the [Azure portal](https://portal.azure.com).

1.  Click **Azure Active Directory**, and then click **Identity Governance**.

1.	In the left menu, click **Access packages** and then open the access package.

1.	In the left menu, click **Separation of duties (preview)**.

1. Click on **Incompatible With**.

## Monitor and report on access assignments

Azure AD can be configured to [send audit events to Azure Monitor](entitlement-management-logs-and-reporting.md), where you can use the Azure Monitor workbooks for reporting on how users were assigned access.

1. The workbook named *Access Package Activity* displays each event related to a particular access package.

    ![View access package events](./media/entitlement-management-logs-and-reporting/view-events-access-package.png)

1. If you would like to see if there have been changes to application role assignments for an application that were not due to access package assignments, such as by a global administrator directly assigning a user to an application roles, then you can select the workbook named *Application role assignment activity*.

    ![View app role assignments](./media/entitlement-management-access-package-incompatible/workbook-ara.png)


## Next steps

- [View, add, and remove assignments for an access package](entitlement-management-access-package-assignments.md)
- [View reports and logs](entitlement-management-reports.md)
