---
title: Provisioning logs in the Azure Active Directory portal (preview) | Microsoft Docs
description: Introduction to provisioning activity reports in the Azure Active Directory portal 
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: ''

ms.assetid: 4b18127b-d1d0-4bdc-8f9c-6a4c991c5f75
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 11/04/2019
ms.author: markvi
ms.reviewer: arvinh

ms.collection: M365-identity-device-management
---
# Provisioning reports in the Azure Active Directory portal (preview)

The reporting architecture in Azure Active Directory (Azure AD) consists of the following components:

- **Activity** 
    - **Sign-ins** – Information about the usage of managed applications and user sign-in activities.
    - **Audit logs** - [Audit logs](concept-audit-logs.md) provide system activity information about users and group management, managed applications and directory activities.
    - **Provisioning logs** - Provide system activity about user, groups, and roles that are provisioned by the Azure AD provisioning service. 

- **Security** 
    - **Risky sign-ins** - A [risky sign-in](concept-risky-sign-ins.md) is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.
    - **Users flagged for risk** - A [risky user](concept-user-at-risk.md) is an indicator for a user account that might have been compromised.

This topic gives you an overview of the provisioning report.

## Prerequisites

### Who can access the data?
* Users in the Security Administrator, Security Reader, Report Reader, Application Administrator, and Cloud Application Administrator roles
* Global Administrators


### What Azure AD license do you need to access provisioning activities?

Your tenant must have an Azure AD Premium license associated with it to see the all up provisioning activity report. See [Getting started with Azure Active Directory Premium](../fundamentals/active-directory-get-started-premium.md) to upgrade your Azure Active Directory edition. 

## Provisioning logs

The provisioning logs provide answers to the following questions:

* What groups were successfully created in ServiceNow?
* How roles were imported from Amazon Web Services?
* What users were unsuccessfully created in DropBox?

You can access the provisioning logs by selecting **Provisioning Logs** in the **Monitoring** section of the **Azure Active Directory** blade in the [Azure portal](https://portal.azure.com). It can take up to two hours for some provisioning records to show up in the portal.

![Provisioning logs](./media/concept-provisioning-logs/access-provisioning-logs.png "Provisioning logs")


A provisioning log has a default list view that shows:

- The identity
- The action
- The source system
- The target system
- The status
- The date


![Default columns](./media/concept-provisioning-logs/default-columns.png "Default columns")

You can customize the list view by clicking **Columns** in the toolbar.

![Column chooser](./media/concept-provisioning-logs/column-chooser.png "Column chooser")

This enables you to display additional fields or remove fields that are already displayed.

![Available columns](./media/concept-provisioning-logs/available-columns.png "Available columns")

Select an item in the list view to get more detailed information.

![Detailed information](./media/concept-provisioning-logs/steps.png "Filter")


## Filter provisioning activities

You can filter your provisioning data. Some filter values are dynamically populated based on your tenant. If, for example, you don't have any create events in your tenant, there won't be a filter option for create.
In the default view, you can select the following filters:

- Identity
- Date
- Status
- Action


![Filter](./media/concept-provisioning-logs/default-filter.png "Filter")

The **Identity** filter enables you to specify the name or the identity that you care about. This identity could be a user, group, role, or other object. You can search by the name or ID of the object. The ID varies by scenario. For example, when provisioning an object from Azure AD to SalesForce, the Source ID is the object ID of the user in Azure AD while the TargetID is the ID of the user in Salesforce. When provisioning from Workday to Active Directory, the Source ID is the Workday worker employee ID. Note that the Name of the user may not always be present in the Identity column. There will always be one ID. 


The **Date** filter enables to you to define a timeframe for the returned data.  
Possible values are:

- 1 month
- 7 days
- 30 days
- 24 hours
- Custom time interval

When you select a custom time frame, you can configure a start date and an end date.


The **Status** filter enables you to select:

- All
- Success
- Failure
- Skipped



The **Action** filter enables you to filter the:

- Create 
- Update
- Delete
- Disable
- Other

In addition, to the filters of the default view, you can also set the following filters:

- Job ID
- Cycle ID
- Change ID
- Source ID
- Target ID
- Application


![Pick a field](./media/concept-provisioning-logs/add-filter.png "Pick a field")


- **Job ID** - A unique Job ID is associated with each application that you have enabled provisioning for.   

- **Cycle ID** - Uniquely identifies the provisioning cycle. You can share this ID to support to look up the cycle in which this event occurred.

- **Change ID** - Unique identifier for the provisioning event. You can share this ID to support to look up the provisioning event.   


- **Source System** - Enables you to specify where the identity is getting provisioned from. For example, when provisioning an object from Azure AD to ServiceNow, the Source system is Azure AD. 

- **Target System** - Enables you to specify where the identity is getting provisioned to. For example, when provisioning an object from Azure AD to ServiceNow, the Target System is ServiceNow. 

- **Application** - Enables you to show only records of applications with a display name that contains a specific string.

 

## Provisioning details 

When you select an item in the provisioning list view, you get more details about this item.
The details are grouped based on the following categories:

- Steps

- Troubleshoot and recommendations

- Modified properties

- Summary


![Filter](./media/concept-provisioning-logs/provisioning-tabs.png "Tabs")



### Steps

The **Steps** tab outlines the steps taken to provision an object. Provisioning an object can consist of four steps: 

- Import object
- Determine if the object is in scope
- Match object between source and target
- Provision object (take action - this could be a create, update, delete, or disable)



![Filter](./media/concept-provisioning-logs/steps.png "Filter")


### Troubleshoot and recommendations


The **troubleshoot and recommendations** tab provides the error code and reason. The error information is only available in the case of a failure. 


### Modified properties

The **modified properties** shows the old value and new value. In cases where there is no old value the old value column is blank. 


### Summary

The **summary** tab provides an overview of what happened and identifiers for the object in the source and target system. 

## What you should know

- The Azure portal stores reported provisioning data for 30 days if you have a premium edition and 7 days if you have a free edition..

- You can use the Change ID attribute as unique identifier. This is, for example, helpful when interacting with product support.

- There is currently no option to download provisioning data.

- There is currently no support for log analytics.

- When you access the provisioning logs from the context of an app, it doesn’t automatically filter events to the specific app the way audit logs do.

## Error Codes

Use the table below to better understand how to resolve errors you may find in the provisioning logs. For any error codes that are missing, provide feedback using the link at the bottom of this page. 

|Error Code|Description|
|---|---|
|Conflict, EntryConflict|Correct the conflicting attribute values in either Azure AD or the application, or review your matching attribute configuration if the conflicting user account was supposed to be matched and taken over. Review the following [documentation](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes) for more information on configuring matching attributes.|
|TooManyRequests|The target app rejected this attempt to update the user because it is overloaded and receiving too many requests. There is nothing to do. This attempt will automatically be retired. Microsoft has also been notified of this issue.|
|InternalServerError |The target app returned an unexpected error. There may be a service issue with the target application that is preventing this from working. This attempt will automatically be retired in 40 minutes.|
|InsufficientRights, MethodNotAllowed, NotPermitted, Unauthorized| Azure AD was able to authenticate with the target application, but was not authorized to perform the update. Please review any instructions provided by the target application as well as the respective application [tutorial](https://docs.microsoft.com/azure/active-directory/saas-apps/tutorial-list).|
|UnprocessableEntity|The target application returned an unexpected response. The configuration of the target application may not be correct, or there may be a service issue with the target application that is preventing this from working.|
|WebExceptionProtocolError |An HTTP protocol error occurred while connecting to the target application. There is nothing to do. This attempt will automatically be retired in 40 minutes.|
|InvalidAnchor|A user that was previously created or matched by the provisioning service no longer exists. Check to ensure the user exists. To force a re-match of all users, use the MS Graph API to [restart job](https://docs.microsoft.com/graph/api/synchronization-synchronizationjob-restart?view=graph-rest-beta&tabs=http). Note that restarting provisioning will trigger an initial cycle, which can take time to complete. It also deletes the cache the provisioning service uses to operate, meaning that all users and groups in the tenant will have to be evaluated again and certain provisioning events could be dropped.|
|NotImplemented | The target app returned an unexpected response. The configuration of the app may not be correct, or there may be a service issue with the target app that is preventing this from working. Please review any instructions provided by the target application as well as the respective application [tutorial](https://docs.microsoft.com/azure/active-directory/saas-apps/tutorial-list). |
|MandatoryFieldsMissing, MissingValues |The user could not be created because required values are missing. Correct the missing attribute values in the source record, or review your matching attribute configuration to ensure the required fields are not omitted. [Learn more](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes) about configuring matching attributes.|
|SchemaAttributeNotFound |Could not perform the operation because an attribute was specified that does not exist in the target application. See the [documentation](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes) on attribute customization and ensure your configuration is correct.|
|InternalError |An internal service error occurred within the Azure AD provisioning service. There is nothing to do. This attempt will automatically be retried in 40 minutes.|
|InvalidDomain |The operation could not be performed due to an attribute value containing an invalid domain name. Update the domain name on the user or add it to the permitted list in the target application. |
|Timeout |The operation could not be completed because the target application took too long to respond. There is nothing to do. This attempt will automatically be retried in 40 minutes.|
|LicenseLimitExceeded|The user could not be created in the target application because there are no available licenses for this user. Either procure additional licenses for the target application, or review your user assignments and attribute mapping configuration to ensure that the correct users are assigned with the correct attributes.|
|DuplicateTargetEntries  |The operation could not be completed because more than one user in the target application was found with the configured matching attributes. Either remove the duplicate user from the target application, or reconfigure your attribute mappings as described [here](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes).|
|DuplicateSourceEntries | The operation could not be completed because more than one user was found with the configured matching attributes. Either remove the duplicate user, or reconfigure your attribute mappings as described [here](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes).|

## Next steps

* [Check the status of user provisioning](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-when-will-provisioning-finish-specific-user)
* [Problem configuring user provisioning to an Azure AD Gallery application](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-config-problem)


