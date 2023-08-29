---
title: Frequently asked questions (FAQs) about API-driven inbound provisioning
description: Learn more about the capabilities and integration scenarios supported by API-driven inbound provisioning.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: reference
ms.date: 06/26/2023
ms.author: jfields
ms.reviewer: chmutali
---

# Frequently asked questions about API-driven inbound provisioning (Public preview)

This article answers frequently asked questions (FAQs) about API-driven inbound provisioning.

## How is the new inbound provisioning /bulkUpload API different from MS Graph Users API?

There are significant differences between the provisioning /bulkUpload API and the MS Graph Users API endpoint.

- **Payload format**: The MS Graph Users API endpoint expects data in OData format. The request payload format for the new inbound provisioning /bulkUpload API uses SCIM schema constructs. When invoking this API, set the 'Content-Type' header to `application/scim+json`.
- **Operation end-result**:
    - When identity data is sent to the MS Graph Users API endpoint, it's immediately processed, and a Create/Update/Delete operation takes place on the Azure AD user profile.
    - Request data sent to the provisioning /bulkUpload API is processed *asynchronously* by the Azure AD provisioning service. The provisioning job applies scoping rules, attribute mapping and transformation configured by the IT admin. This initiates a ```Create/Update/Delete``` operation on the Azure AD user profile or the on-premises AD user profile.
- **IT admin retains control**: With API-driven inbound provisioning, the IT admin has more control on how the incoming identity data is processed and mapped to Azure AD attributes. They can define scoping rules to exclude certain types of identity data (for example, contractor data) and use transformation functions to derive new values before setting the attribute values on the user profile.


## Is the inbound provisioning /bulkUpload API a standard SCIM endpoint?

The MS Graph inbound provisioning /bulkUpload API uses SCIM schema in the request payload, but it's *not* a standardized SCIM API endpoint. Here's why.

Typically, a SCIM service endpoint processes HTTP requests (POST, PUT, GET) with SCIM payload and translates them to respective operations of (Create, Update, Lookup) on the identity store. The SCIM service endpoint places the onus of specifying the operation semantics, whether to Create/Update/Delete an identity, on the SCIM API client. This mechanism works well for scenarios where the API client is aware what operation it would like to perform for users in the identity store.

The MS Graph inbound provisioning /bulkUpload is designed to handle a different enterprise identity integration scenario shaped by three unique requirements:

1. Ability to asynchronously process records in bulk (for example, processing 50K+ records)
2. Ability to include any identity attribute in the payload (for example, costCenter, pay grade, badgeId)
3. Support API clients unaware of operation semantics. These clients are non-SCIM API clients that only have access to raw *source data* (for example, records in CSV file, SQL table or HR records). These clients don't have the processing capability to read each record and determine the operation semantics of ```Create/Update/Delete``` on the identity store.

The primary goal of MS Graph inbound provisioning /bulkUpload API is to enable customers to send *any* identity data (for example, costCenter, pay grade, badgeId) from *any* identity data source (for example, CSV/SQL/HR) for eventual processing by Azure AD provisioning service. The Azure AD provisioning service consumes the bulk payload data received at this endpoint, applies attribute mapping rules configured by the IT admin and determines whether the data payload leads to (Create, Update, Enable, Disable) operation in the target identity store (Azure AD / on-premises AD).

## Does the provisioning /bulkUpload API support on-premises Active Directory domains as a target?

Yes, the provisioning API supports on-premises AD domains as a target. 

## How do we get the /bulkUpload API endpoint for our provisioning app?

The /bulkUpload API is available only for apps of the type: "API-driven inbound provisioning to Azure AD" and "API-driven inbound provisioning to on-premises Active Directory". You can retrieve the unique API endpoint for each provisioning app from the Provisioning blade home page.  In **Statistics to date** > **View technical information**,copy the **Provisioning API Endpoint** URL. 

  :::image type="content" source="media/inbound-provisioning-api-configure-app/provisioning-api-endpoint.png" alt-text="Screenshot of Provisioning API endpoint." lightbox="media/inbound-provisioning-api-configure-app/provisioning-api-endpoint.png":::

It has the format:
```http
https://graph.microsoft.com/beta/servicePrincipals/{servicePrincipalId}/synchronization/jobs/{jobId}/bulkUpload
```

## How do we perform a full sync using the provisioning /bulkUpload API?

To perform a full sync, use your API client to send the data of all users from your trusted source to the API endpoint as bulk request. Once you send all the data to the API endpoint, the next sync cycle processes all user records and allows you to track the progress using the provisioning logs API endpoint. 

## How do we perform delta sync using the provisioning /bulkUpload API?

To perform a delta sync, use your API client to only send information about users whose data has changed in the trusted source. Once you send all the data to the API endpoint, the next sync cycle processes all user records and allows you to track the progress using the provisioning logs API endpoint.

## How does restart provisioning work?

Use the **Restart provisioning** option only if required. Here's how it works:

**Scenario 1:** When you click the **Restart provisioning** button and the job is currently running, the job continues processing the existing data that is already staged. The**Restart provisioning** operation doesn't interrupt an existing cycle. In the subsequent cycle, the provisioning service clears any escrows and picks the new bulk request for processing.

**Scenario 2:** When you click the **Restart provisioning** button and the job is *not* running, then before running subsequent cycle, the provisioning engine purges the data uploaded prior to the restart, clears any escrows, and only processes new incoming data.

## How do we create users using the provisioning /bulkUpload API endpoint?

Here's how the provisioning job associated with the /bulkUpload API endpoint processes incoming user payloads:

1. The job retrieves the attribute mapping for the provisioning job and makes note of the matching attribute pair (by default ```externalId``` API attribute is used to match with ```employeeId``` in Azure AD).
1. You can change this default attribute matching pair.
1. The job extracts each operation present in the bulk request payload.
1. The job checks the value matching identifier in the request (by default the attribute `externalId`) and uses it to check if there's a user in Azure AD with matching `employeeId` value.
1. If the job doesn't find a matching user, then the job applies the sync rules and creates a new user in the target directory.

To make sure that the right users get created in Azure AD, define the right matching attribute pair in your mapping which uniquely identifies users in your source and Azure AD.

## How do we generate unique values for UPN?

The provisioning service doesn't provide the ability to check for duplicate ```userPrincipalName``` (UPN) and handle conflicts. If the default sync rule for UPN attribute generates an existing UPN value, then the user create operation fails.

Here are some options that you can consider for generating unique UPNs:

1. Add the logic for unique UPN generation in your API client. 
2. Update the sync rule for the UPN attribute to use the [RandomString](functions-for-customizing-application-data.md) function and set the apply mapping parameter to ```On object creation only```. Example:

```Join("", Replace([userName], , "(?<Suffix>@(.)*)", "Suffix", "", , ), RandomString(3, 3, 0, 0, 0, ), "@", DefaultDomain())```

3. If you are provisioning to on-premises Active Directory, you can use the [SelectUniqueValue](functions-for-customizing-application-data.md) function and set the apply mapping parameter to ```On object creation only```.

## How do we send more HR attributes to the provisioning /bulkUpload API endpoint?

By default, the API endpoint supports processing any attribute that is part of the SCIM Core User and Enterprise User schema. If you'd like to send more attributes, you can extend the provisioning app schema, map the new attributes to Azure AD attributes and update the bulk request to send those attributes. 
Refer to the tutorial [Extend API-driven provisioning to sync custom attributes](inbound-provisioning-api-custom-attributes.md).

## How do we exclude certain users from the provisioning flow?

You may have a scenario where you want to send all users to the API endpoint, but only include certain users in the provisioning flow and exclude the rest.

You can achieve this using the **Scoping filter**. In the provisioning app configuration, you can define a source object scope and exclude certain users from processing either using an "inclusion rule" (for example, only process users where department EQUALS **Sales**) or an "exclusion rule" (for example, exclude users belonging to Sales, department NOT EQUALS **Sales**).
 
 See [Scoping users or groups to be provisioned with scoping filters](define-conditional-rules-for-provisioning-user-accounts.md).

## How do we update users using the provisioning /bulkUpload API endpoint?

Here's how the provisioning job associated with the /bulkUpload API endpoint processes incoming user payloads:

1. The provisioning job retrieves the attribute mapping for the provisioning job and makes note of the matching attribute pair (by default ```externalId``` API attribute is used to match with ```employeeId``` in Azure AD).  You can change this default attribute matching pair.
1. The job extracts the operations from the bulk request payload.
1. The job checks the value matching identifier in the SCIM request (by default: API attribute ```externalId```) and uses it to check if there's a user in Azure AD with matching ```employeeId``` value.
1. If the job finds a matching user, then it applies the sync rules and compares the source and target profiles.
1. If the job determines that some values have changed, then it updates the corresponding user record in the directory.

To make sure that the right users get updated in Azure AD, make sure you define the right matching attribute pair in your mapping which uniquely identifies users in your source and Azure AD.

## Can we create more than one app that supports API-driven inbound provisioning?

Yes, you can. Here are some scenarios that may require more than one provisioning app:

**Scenario 1:** Let's say you have three trusted data sources: one for employees, one for contractors and one for vendors. You can create three separate provisioning apps – one for each identity type with its own distinct attribute mapping. Each provisioning app has a unique API endpoint, and you can send the respective payloads to each endpoint.

You can retrieve the unique API endpoint for each job from the Provisioning blade home page. Navigate to **Statistics to date** > **View technical information**, then copy the **Provisioning API Endpoint** URL.

**Scenario 2:** Let's say you have multiple sources of truth, each with its own attribute set. For example, HR provides job info attributes (for example jobTitle, employeeType), and the Badging System provides badge information attributes (for example ```badgeId``` that is represented using an extension attribute). In this scenario, you can configure two provisioning apps:

- **Provisioning App #1** that receives attributes from your HR source and create the user.

- **Provisioning App #2** that receives attributes from the Badging system and only update the user attributes. The attribute mapping in this app is restricted to the Badge Information attributes and under Target Object Actions only update is enabled.

- Both apps use the same matching identifier pair (```externalId``` <-> ```employeeId```)

## How do we process terminations using the /bulkUpload API endpoint?

To process terminations, identify an attribute in your source that will be used to set the ```accountEnabled``` flag in Azure AD. If you are provisioning to on-premises Active Directory, then map that source attribute to the `accountDisabled` attribute. 

By default, the value associated with the SCIM Core User schema attribute ```active``` determines the status of the user's account in the target directory.

If the attribute is set to **true**, the default mapping rule enables the account. If the attribute is set to **false**, then the default mapping rule disables the account. 

## Can we soft-delete a user in Azure AD using /bulkUpload provisioning API?

Yes, you can soft-delete a user by using the **DELETE** method in the bulk request operation. Refer to the [bulkUpload](/graph/api/synchronization-synchronizationjob-post-bulkupload) API spec doc for an example request. 

## How can we prevent accidental disabling/deletion of users?

To prevent and recover from accidental deletions, we recommend [configuring accidental deletion threshold](accidental-deletions.md) in the provisioning app and [enabling the on-premises Active Directory recycle bin](../hybrid/connect/how-to-connect-sync-recycle-bin.md). In your provisioning app's **Attribute Mapping** blade, under **Target object actions** disable the **Delete** operation.  

**Recovering deleted accounts**
* If the target directory for the operation is Azure AD, then the matched user is soft-deleted. The user can be seen on the Microsoft Azure portal **Deleted users** page for the next 30 days and can be restored during that time.
* If the target directory for the operation is on-premises Active Directory, then the matched user is hard-deleted. If the **Active Directory Recycle Bin** is enabled, you can restore the deleted on-premises AD user object.

## Do we need to send all users from the HR system in every request?

No, you don't need to send all users from the HR system / "source of truth" in every request. Just send the users that you'd like create or update.

## Does the API support all HTTP actions (GET/POST/PUT/PATCH)?

No, the /bulkUpload provisioning API endpoint only supports the POST HTTP action.

## If I want to update a user, do I need to send a PUT/PATCH request?

No, the API endpoint doesn't support PUT/PATCH request. To update a user, send the data associated with the user in the POST bulk request payload.

The provisioning job that processes data received by the API endpoint automatically detects whether the user received in the POST request payload needs to be create/updated/enable/disabled based on the configured sync rules. As an API client, you don't need to take any more steps if you want a user profile to be updated.

## How is writeback supported?

The current API only supports inbound data. Here are some options to consider for implementing writeback of attributes like email / username / phone generated by Azure AD, that you can flow back to the HR system:

- **Option 1 – SCIM connectivity to HR endpoint/proxy service that in turn updates the HR source**

  - If the system of record provides a SCIM endpoint for user updates (for example Oracle HCM provides an [API endpoint for SCIM updates](https://docs.oracle.com/en/cloud/saas/applications-common/23b/farca/op-hcmrestapi-scim-users-id-patch.html)), you can create a custom SCIM application in the enterprise app gallery and [configure provisioning as documented](use-scim-to-provision-users-and-groups.md#integrate-your-scim-endpoint-with-the-azure-ad-provisioning-service).
  - If the system of record doesn't provide a SCIM endpoint, explore the possibility of setting up a proxy SCIM service, which receives the update and propagate the change to the HR system.

- **Option 2 – Use Azure AD ECMA connector for the writeback scenario**

  - Depending on the customer requirement, explore if one of the ECMA connectors could be used (PowerShell / SQL / Web Services).

- **Option 3 – Use Lifecycle Workflows custom extension task in a Joiner workflow** 
  - In Lifecycle Workflows, define a Joiner workflow and define a [custom extension task that invokes a Logic Apps process](https://go.microsoft.com/fwlink/?linkid=2239990), which updates the HR system or generates a CSV file consumed by the HR system.

## Next steps

- [Configure API-driven inbound provisioning app](inbound-provisioning-api-configure-app.md)
- To learn more about API-driven inbound provisioning, see [inbound user provisioning API concepts](inbound-provisioning-api-concepts.md).
