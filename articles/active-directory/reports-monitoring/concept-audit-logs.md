---

title: Audit activity reports in the Azure Active Directory portal | Microsoft Docs
description: Introduction to the audit activity reports in the Azure Active Directory portal
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.assetid: a1f93126-77d1-4345-ab7d-561066041161
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: report-monitor
ms.date: 11/13/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---
# Audit activity reports in the Azure Active Directory portal 

With Azure Active Directory (Azure AD) reports, you can get the information you need to determine how your environment is doing.

The reporting architecture consists of the following components:

- **Activity** 
    - **Sign-ins** – The [sign-ins report](concept-sign-ins.md) provides information about the usage of managed applications and user sign-in activities.
    - **Audit logs** - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies.
- **Security** 
    - **Risky sign-ins** - A [risky sign-in](concept-risky-sign-ins.md) is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account. 
    - **Users flagged for risk** - A [risky user](concept-user-at-risk.md) is an indicator for a user account that might have been compromised.

This article gives you an overview of the audit report.
 
## Who can access the data?

* Users in the **Security Admininistrator**, **Security Reader** or **Global Administrator** roles
* In addition, all users (non-administrators) can see their own audit activities

## Audit logs

The Azure AD audit logs provide records of system activities for compliance. To access the audit report, select **Audit logs** in the **Activity** section of **Azure Active Directory**. 

![Audit logs](./media/concept-audit-logs/61.png "Audit logs")

An audit log has a default list view that shows:

- the date and time of the occurrence
- the initiator / actor (*who*) of an activity 
- the activity (*what*) 
- the target

![Audit logs](./media/concept-audit-logs/18.png "Audit logs")

You can customize the list view by clicking **Columns** in the toolbar.

![Audit logs](./media/concept-audit-logs/19.png "Audit logs")

This enables you to display additional fields or remove fields that are already displayed.

![Audit logs](./media/concept-audit-logs/21.png "Audit logs")

Select an item in the list view to get more detailed information.

![Audit logs](./media/concept-audit-logs/22.png "Audit logs")


## Filtering audit logs

You can filter the audit data on the following fields:

- Date range
- Initiated by (Actor)
- Category
- Activity resource type
- Activity

![Audit logs](./media/concept-audit-logs/23.png "Audit logs")

The **date range** filter enables to you to define a timeframe for the returned data.  
Possible values are:

- 1 month
- 7 days
- 24 hours
- Custom

When you select a custom timeframe, you can configure a start time and an end time.

The **initiated by** filter enables you to define an actor's name or a universal principal name (UPN).

The **category** filter enables you to select one of the following filter:

- All
- Core category
- Core directory
- Self-service password management
- Self-service group management
- Account provisioning- Automated password rollover
- Invited users
- MIM service
- Identity Protection
- B2C

The **activity resource type** filter enables you to select one of the following filters:

- All 
- Group
- Directory
- User
- Application
- Policy
- Device
- Other

When you select **Group** as **activity resource type**, you get an additional filter category that enables you to also provide a **Source**:

- Azure AD
- O365


The **activity** filter is based on the category and activity resource type selection you make. You can select a specific activity you want to see or choose all. 

You can get the list of all Audit Activities using the Graph API https://graph.windows.net/$tenantdomain/activities/auditActivityTypes?api-version=beta, where $tenantdomain = your domain name or refer to the article [audit report events](reference-audit-activities.md).

## Audit logs shortcuts

In addition to **Azure Active Directory**, the Azure portal provides you with two additional entry points to audit data:

- Users and groups
- Enterprise applications

### Users and groups audit logs

With user and group-based audit reports, you can get answers to questions such as:

- What types of updates have been applied the users?

- How many users were changed?

- How many passwords were changed?

- What has an administrator done in a directory?

- What are the groups that have been added?

- Are there groups with membership changes?

- Have the owners of group been changed?

- What licenses have been assigned to a group or a user?

If you just want to review auditing data that is related to users and groups, you can find a filtered view under **Audit logs** in the **Activity** section of the **Users and Groups**. This entry point has **Users and groups** as preselected **Activity Resource Type**.

![Audit logs](./media/concept-audit-logs/93.png "Audit logs")

### Enterprise applications audit logs

With application-based audit reports, you can get answers to questions such as:

* What applications have been added or updated?
* What applications have been removed?
* Has a service principal for an application changed?
* Have the names of applications been changed?
* Who gave consent to an application?

If you want to review audit data related to your applications, you can find a filtered view under **Audit logs** in the **Activity** section of the **Enterprise applications** blade. This entry point has **Enterprise applications** preselected as the **Activity Resource Type**.

![Audit logs](./media/concept-audit-logs/134.png "Audit logs")

You can filter this view down to **groups** or **users**.

![Audit logs](./media/concept-audit-logs/25.png "Audit logs")


## Next steps

- [Azure AD audit activity reference](reference-audit-activities.md)
- [Azure AD reports retention reference](reference-reports-data-retention.md)
- [Azure AD log latencies reference](reference-reports-latencies.md)