---
title: Provisioning logs in Azure Active Directory
description: Overview of the provisioning logs in Azure Active Directory.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: report-monitor
ms.date: 03/24/2023
ms.author: sarahlipsey
ms.reviewer: arvinh
ms.collection: M365-identity-device-management
---
# Provisioning logs in Azure Active Directory

Azure Active Directory (Azure AD) integrates with several third party services to provision users into your tenant. If you need to troubleshoot an issue with a provisioned user, you can use the information captured in the Azure AD provisioning logs to help find a solution.

Two other activity logs are also available to help monitor the health of your tenant:

- **[Sign-ins](concept-sign-ins.md)** – Information about sign-ins and how your resources are used by your users.
- **[Audit](concept-audit-logs.md)** – Information about changes applied to your tenant such as users and group management or updates applied to your tenant’s resources.

This article gives you an overview of the provisioning logs. 

## What can I do with it?

You can use the provisioning logs to find answers to questions like:

-  What groups were successfully created in ServiceNow?

-  What users were successfully removed from Adobe?

-  What users from Workday were successfully created in Active Directory? 


## How do you access the provisioning logs?

To view the provisioning logs, your tenant must have an Azure AD Premium license associated with it. To upgrade your Azure AD edition, see [Getting started with Azure Active Directory Premium](../fundamentals/active-directory-get-started-premium.md). 

Application owners can view logs for their own applications. The following roles are required to view provisioning logs:

- Reports Reader
- Security Reader
- Security Operator
- Security Administrator
- Application Administrator
- Cloud Application Administrator
- Global Administrator
- Users in a custom role with the [provisioningLogs permission](../roles/custom-enterprise-app-permissions.md#full-list-of-permissions)

To access the provisioning log data, you have the following options:

- Select **Provisioning logs** from the **Monitoring** section of Azure AD.

- Stream the provisioning logs into [Azure Monitor](../app-provisioning/application-provisioning-log-analytics.md). This method allows for extended data retention and building custom dashboards, alerts, and queries.

- Query the [Microsoft Graph API](/graph/api/resources/provisioningobjectsummary) for the provisioning logs.

- Download the provisioning logs as a CSV or JSON file.

## View the provisioning logs

To more effectively view the provisioning log, spend a few moments customizing the view for your needs. You can specify what columns to include and filter the data to narrow things down.

### Customize the layout

The provisioning log has a default view, but you can customize columns.

1. Select **Columns** from the menu at the top of the log.
1. Select the columns you want to view and select the **Save** button at the bottom of the window.

![Screenshot that shows the button for customizing columns.](./media/concept-provisioning-logs/column-chooser.png "Column chooser")

This area enables you to display more fields or remove fields that are already displayed.

## Filter the results

When you filter your provisioning data, some filter values are dynamically populated based on your tenant. For example, if you don't have any "create" events in your tenant, there won't be a **Create** filter option.

The **Identity** filter enables you to specify the name or the identity that you care about. This identity might be a user, group, role, or other object. 

You can search by the name or ID of the object. The ID varies by scenario.
- If you're provisioning an object *from Azure AD to Salesforce*, the **source ID** is the object ID of the user in Azure AD. The **target ID** is the ID of the user at Salesforce.
- If you're provisioning *from Workday to Azure AD*, the **source ID** is the Workday worker employee ID. The **target ID** is the ID of the user in Azure AD.
- If you're provisioning users for [cross-tenant synchronization](../multi-tenant-organizations/cross-tenant-synchronization-configure.md), the **source ID** is ID of the user in the source tenant. The **target ID** is ID of the user in the target tenant.

> [!NOTE]
> The name of the user might not always be present in the **Identity** column. There will always be one ID. 

The **Date** filter enables to you to define a timeframe for the returned data. Possible values are:

- One month
- Seven days
- 30 days
- 24 hours
- Custom time interval (configure a start date and an end date)

The **Status** filter enables you to select:

- All
- Success
- Failure
- Skipped

The **Action** filter enables you to filter these actions:

- Create
- Update
- Delete
- Disable
- Other

In addition to the filters of the default view, you can set the following filters.

- **Job ID**: A unique job ID is associated with each application that you've enabled provisioning for.   

- **Cycle ID**: The cycle ID uniquely identifies the provisioning cycle. You can share this ID with product support to look up the cycle in which this event occurred.

- **Change ID**: The change ID is a unique identifier for the provisioning event. You can share this ID with product support to look up the provisioning event.   

- **Source System**: You can specify where the identity is getting provisioned from. For example, when you're provisioning an object from Azure AD to ServiceNow, the source system is Azure AD. 

- **Target System**: You can specify where the identity is getting provisioned to. For example, when you're provisioning an object from Azure AD to ServiceNow, the target system is ServiceNow. 

- **Application**: You can show only records of applications with a display name or object ID that contains a specific string. For [cross-tenant synchronization](../multi-tenant-organizations/cross-tenant-synchronization-configure.md), use the object ID of the configuration and not the application ID.

## Analyze the provisioning logs

When you select an item in the provisioning list view, you get more details about this item, such as the steps taken to provision the user and tips for troubleshooting issues. The details are grouped into four tabs.

- **Steps**: Outlines the steps taken to provision an object. Provisioning an object can consist of four steps:
  
  1. Import the object.
  1. Determine if the object is in scope.
  1. Match the object between source and target.
  1. Provision the object (create, update, delete, or disable).

  ![Screenshot shows the provisioning steps on the Steps tab.](./media/concept-provisioning-logs/steps.png "Filter")

- **Troubleshooting & Recommendations**: Provides the error code and reason. The error information is available only if a failure happens.

- **Modified Properties**: Shows the old value and the new value. If there's no old value, that column is blank.

- **Summary**: Provides an overview of what happened and identifiers for the object in the source and target systems.

## Download logs as CSV or JSON

You can download the provisioning logs for later use by going to the logs in the Azure portal and selecting **Download**. The file will be filtered based on the filter criteria you've selected. Make the filters as specific as possible to reduce the size and time of the download. 

The CSV download includes three files:

* **ProvisioningLogs**: Downloads all the logs, except the provisioning steps and modified properties.
* **ProvisioningLogs_ProvisioningSteps**: Contains the provisioning steps and the change ID. You can use the change ID to join the event with the other two files.
* **ProvisioningLogs_ModifiedProperties**: Contains the attributes that were changed and the change ID. You can use the change ID to join the event with the other two files.

#### Open the JSON file
To open the JSON file, use a text editor such as [Microsoft Visual Studio Code](https://aka.ms/vscode). Visual Studio Code makes the file easier to read by providing syntax highlighting. You can also open the JSON file by using browsers in an uneditable format, such as [Microsoft Edge](https://aka.ms/msedge). 

#### Prettify the JSON file
The JSON file is downloaded in minified format to reduce the size of the download. This format can make the payload hard to read. Check out two options to prettify the file:

- Use [Visual Studio Code to format the JSON](https://code.visualstudio.com/docs/languages/json#_formatting).

- Use PowerShell to format the JSON. This script will output the JSON in a format that includes tabs and spaces: 

  ` $JSONContent = Get-Content -Path "<PATH TO THE PROVISIONING LOGS FILE>" | ConvertFrom-JSON`

  `$JSONContent | ConvertTo-Json > <PATH TO OUTPUT THE JSON FILE>`

#### Parse the JSON file

Here are some sample commands to work with the JSON file by using PowerShell. You can use any programming language that you're comfortable with.  

First, [read the JSON file](/powershell/module/microsoft.powershell.utility/convertfrom-json) by running this command:

` $JSONContent = Get-Content -Path "<PATH TO THE PROVISIONING LOGS FILE>" | ConvertFrom-JSON`

Now you can parse the data according to your scenario. Here are a couple of examples: 

- Output all job IDs in the JSON file:

  `foreach ($provitem in $JSONContent) { $provitem.jobId }`

- Output all change IDs for events where the action was "create":

  `foreach ($provitem in $JSONContent) { `
  `   if ($provItem.action -eq 'Create') {`
  `       $provitem.changeId `
  `   }`
  `}`

## What you should know

Here are some tips and considerations for provisioning reports:

- The Azure portal stores reported provisioning data for 30 days if you have a premium edition and 7 days if you have a free edition. You can publish the provisioning logs to [Log Analytics](../app-provisioning/application-provisioning-log-analytics.md) for retention beyond 30 days. 

- You can use the change ID attribute as unique identifier, which can be helpful when you're interacting with product support, for example.

- You might see skipped events for users who aren't in scope. This behavior is expected, especially when the sync scope is set to all users and groups. The service will evaluate all the objects in the tenant, even the ones that are out of scope. 

- The provisioning logs don't show role imports (applies to AWS, Salesforce, and Zendesk). You can find the logs for role imports in the audit logs. 

## Error codes

Use the following table to better understand how to resolve errors that you find in the provisioning logs. For any error codes that are missing, provide feedback by using the link at the bottom of this page. 

|Error code|Description|
|---|---|
|Conflict,<br>EntryConflict|Correct the conflicting attribute values in either Azure AD or the application. Or, review your matching attribute configuration if the conflicting user account was supposed to be matched and taken over. Review the [documentation](../app-provisioning/customize-application-attributes.md) for more information on configuring matching attributes.|
|TooManyRequests|The target app rejected this attempt to update the user because it's overloaded and receiving too many requests. There's nothing to do. This attempt will automatically be retired. Microsoft has also been notified of this issue.|
|InternalServerError |The target app returned an unexpected error. A service issue with the target application might be preventing it from working. This attempt will automatically be retried in 40 minutes.|
|InsufficientRights,<br>MethodNotAllowed,<br>NotPermitted,<br>Unauthorized| Azure AD authenticated with the target application but wasn't authorized to perform the update. Review any instructions that the target application has provided, along with the respective application [tutorial](../saas-apps/tutorial-list.md).|
|UnprocessableEntity|The target application returned an unexpected response. The configuration of the target application might not be correct, or a service issue with the target application might be preventing it from working.|
|WebExceptionProtocolError |An HTTP protocol error occurred in connecting to the target application. There's nothing to do. This attempt will automatically be retried in 40 minutes.|
|InvalidAnchor|A user that was previously created or matched by the provisioning service no longer exists. Ensure that the user exists. To force a new matching of all users, use the Microsoft Graph API to [restart the job](/graph/api/synchronization-synchronizationjob-restart?tabs=http&view=graph-rest-beta&preserve-view=true). <br><br>Restarting provisioning will trigger an initial cycle, which can take time to complete. Restarting provisioning also deletes the cache that the provisioning service uses to operate. That means all users and groups in the tenant will have to be evaluated again, and certain provisioning events might be dropped.|
|NotImplemented | The target app returned an unexpected response. The configuration of the app might not be correct, or a service issue with the target app might be preventing it from working. Review any instructions that the target application has provided, along with the respective application [tutorial](../saas-apps/tutorial-list.md). |
|MandatoryFieldsMissing,<br>MissingValues |The user couldn't be created because required values are missing. Correct the missing attribute values in the source record, or review your matching attribute configuration to ensure that the required fields aren't omitted. [Learn more](../app-provisioning/customize-application-attributes.md) about configuring matching attributes.|
|SchemaAttributeNotFound |The operation couldn't be performed because an attribute was specified that doesn't exist in the target application. See the [documentation](../app-provisioning/customize-application-attributes.md) on attribute customization and ensure that your configuration is correct.|
|InternalError |An internal service error occurred within the Azure AD provisioning service. There's nothing to do. This attempt will automatically be retried in 40 minutes.|
|InvalidDomain |The operation couldn't be performed because an attribute value contains an invalid domain name. Update the domain name on the user or add it to the permitted list in the target application. |
|Timeout |The operation couldn't be completed because the target application took too long to respond. There's nothing to do. This attempt will automatically be retried in 40 minutes.|
|LicenseLimitExceeded|The user couldn't be created in the target application because there are no available licenses for this user. Procure more licenses for the target application. Or, review your user assignments and attribute mapping configuration to ensure that the correct users are assigned with the correct attributes.|
|DuplicateTargetEntries  |The operation couldn't be completed because more than one user in the target application was found with the configured matching attributes. Remove the duplicate user from the target application, or [reconfigure your attribute mappings](../app-provisioning/customize-application-attributes.md).|
|DuplicateSourceEntries | The operation couldn't be completed because more than one user was found with the configured matching attributes. Remove the duplicate user, or [reconfigure your attribute mappings](../app-provisioning/customize-application-attributes.md).|
|ImportSkipped | When each user is evaluated, the system tries to import the user from the source system. This error commonly occurs when the user who's being imported is missing the matching property defined in your attribute mappings. Without a value present on the user object for the matching attribute, the system can't evaluate scoping, matching, or export changes. The presence of this error doesn't indicate that the user is in scope, because you haven't yet evaluated scoping for the user.|
|EntrySynchronizationSkipped | The provisioning service has successfully queried the source system and identified the user. No further action was taken on the user and they were skipped. The user might have been out of scope, or the user might have already existed in the target system with no further changes required.|
|SystemForCrossDomainIdentity<br>ManagementMultipleEntriesInResponse| A GET request to retrieve a user or group received multiple users or groups in the response. The system expects to receive only one user or group in the response. For example, if you do a [GET Group request](../app-provisioning/use-scim-to-provision-users-and-groups.md#get-group) to retrieve a group, provide a filter to exclude members, and your System for Cross-Domain Identity Management (SCIM) endpoint returns the members, you'll get this error.|
|SystemForCrossDomainIdentity<br>ManagementServiceIncompatible|The Azure AD provisioning service is unable to parse the response from the third party application. Work with the application developer to ensure that the SCIM server is compatible with the [Azure AD SCIM client](../app-provisioning/use-scim-to-provision-users-and-groups.md#understand-the-azure-ad-scim-implementation).|
|SchemaPropertyCanOnlyAcceptValue|The property in the target system can only accept one value, but the property in the source system has multiple. Ensure that you either map a single-valued attribute to the property that is throwing an error, update the value in the source to be single-valued, or remove the attribute from the mappings.|

## Error codes for cross-tenant synchronization

Use the following table to better understand how to resolve errors that you find in the provisioning logs for [cross-tenant synchronization](../multi-tenant-organizations/cross-tenant-synchronization-configure.md). For any error codes that are missing, provide feedback by using the link at the bottom of this page.

> [!div class="mx-tableFixed"]
> | Error code | Cause | Solution |
> | --- | --- | --- |
> | AzureActiveDirectoryCannotUpdateObjectsOriginatedInExternalService | The synchronization engine could not update one or more user properties in the target tenant.<br/><br/>The operation failed in Microsoft Graph API because of Source of Authority (SOA) enforcement. Currently, the following properties show up in the list:<br/>`Mail`<br/>`showInAddressList` | In some cases (for example when `showInAddressList` property is part of the user update), the synchronization engine might automatically retry the (user) update without the offending property. Otherwise, you will need to update the property directly in the target tenant. |
> | AzureDirectoryB2BManagementPolicyCheckFailure | The cross-tenant synchronization policy allowing automatic redemption failed.<br/><br/>The synchronization engine checks to ensure that the administrator of the target tenant has created an inbound cross-tenant synchronization policy allowing automatic redemption. The synchronization engine also checks if the administrator of the source tenant has enabled an outbound policy for automatic redemption. | Ensure that the automatic redemption setting has been enabled for both the source and target tenants. For more information, see [Automatic redemption setting](../multi-tenant-organizations/cross-tenant-synchronization-overview.md#automatic-redemption-setting). |
> | AzureActiveDirectoryQuotaLimitExceeded | The number of objects in the tenant exceeds the directory limit.<br/><br/>Azure AD has limits for the number of objects that can be created in a tenant. | Check whether the quota can be increased. For information about the directory limits and steps to increase the quota, see [Azure AD service limits and restrictions](../enterprise-users/directory-service-limits-restrictions.md). |
> |InvitationCreationFailure| The Azure AD provisioning service attempted to invite the user in the target tenant. That invitation failed.| Navigate to the user settings page in Azure AD > external users > collaboration restrictions and ensure that collaboration with that tenant is enabled.|
> |AzureActiveDirectoryInsufficientRights|When a B2B user in the target tenant has a role other than User, Helpdesk Admin, or User Account Admin, they cannot be deleted.| Please remove the role(s) on the user in the target tenant in order to successfully delete the user in the target tenant.|

## Next steps

* [Check the status of user provisioning](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md)
* [Problem configuring user provisioning to an Azure AD Gallery application](../app-provisioning/application-provisioning-config-problem.md)
* [Graph API for provisioning logs](/graph/api/resources/provisioningobjectsummary)
