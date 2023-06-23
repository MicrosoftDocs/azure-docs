---
title: Questions (FAQs) about the Inbound Provisioning API 
description: Frequently asked questions (FAQs) about the Inbound Provisioning API.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: reference
ms.date: 06/22/2023
ms.author: jfields
ms.reviewer: chmutali
---

# Frequently asked questions (FAQs)

This article answers frequently asked questions (FAQs) about the Inbound Provisioning API.

## How is the proposed Provisioning API endpoint different from MS Graph Users API endpoint?

There are significant differences between the Provisioning API and the MS Graph Users API endpoint.

- **Payload format**: The MS Graph Users API endpoint expects data in OData format. The primary interface for the proposed Provisioning API endpoint is industry standard SCIM.
- **Operation end-result**:
    - When identity data is sent to the MS Graph Users API endpoint, it is immediately processed, and a Create/Update/Delete operation takes place on the Azure AD user profile.
    - When identity data is sent to the Provisioning API endpoint, it is first processed by the Azure AD provisioning service. The provisioning service applies scoping rules, attribute mapping and transformation configured by the IT admin and only then a Create/Update/Delete operation is initiated either on the Azure AD user profile or the AD user profile.

- **IT admin retains control**: With Provisioning APIs, the IT admin retains absolute control on the how the incoming identity data is processed. They can define scoping rules to exclude certain types of identity data (e.g., contractor data) and use transformation functions to derive new values before setting the attribute values on the user profile.


## Is this a true/standardized SCIM Endpoint?

The MS Graph Inbound Provisioning API uses SCIM as a data transfer mechanism, but it's not a standardized SCIM API endpoint. Here’s why.

Typically, a SCIM service endpoint processes HTTP requests (POST, PUT, GET) with SCIM payload and translates them to respective operations of (Create, Update, Lookup) on the identity store. The SCIM service endpoint places the onus of defining the operation semantics, whether to Create/Update/Delete an identity, on the SCIM API client. This mechanism works well for synchronous processing needs with intelligent SCIM API clients.

The new MS Graph Inbound Provisioning API is designed to handle a different enterprise identity integration scenario shaped by 3 unique requirements:

1. Ability to asynchronously process records in bulk (e.g., processing 50K+ records)
2. Ability to include any identity attribute in the payload (e.g., costCenter, paygrade, badgeId)
3. Support API clients unaware of operation semantics: non-SCIM API clients that just have access to raw “source data” (e.g., records in CSV file, SQL table or HR records) and don’t have the processing capability to read each record and determine the operation semantics of Create/Update/Delete on the identity store.

The SCIM 2.0 standard does not support all these requirements (e.g., async processing and requirement #3). However, since most customers are familiar with SCIM as provisioning protocol, wherever possible, we have used aspects of the SCIM standard in the implementation of the MS Graph Provisioning API. For example:

- To meet the bulk processing requirement, API clients can send payloads as a SCIM Bulk request.

- To include any identity attribute, API clients can send data using SCIM schema extensions.

In summary, the primary goal of MS Graph Inbound Provisioning API is to enable customers to send *any* identity data (e.g., costCenter, paygrade, badgeId) from *any* identity data source (e.g., CSV/SQL/HR) for eventual processing by Azure AD provisioning service. The Azure AD provisioning service consumes the SCIM payload data received at this endpoint, applies attribute mapping rules configured by the IT admin and determines whether the data payload leads to (Create, Update, Enable, Disable) operation in the target identity store (Azure AD / on-premises AD).

## Does the provisioning API support on-premises AD as a target?

Yes, the provisioning API also supports on-premises AD as a target.

## How can I get started quickly with the API?

Refer to [Quickstart with Graph Explorer]

## How can I get started using the API with Postman?

Refer to [Quickstart with Postman]

## How can I get started using the API with PowerShell?

Refer to [Quickstart with PowerShell]

## How do we get the API endpoint for our provisioning app?

You can retrieve the unique API endpoint for each provisioning app from the Provisioning blade home page. In **Statistics to date** > **View technical information** and copy the **Provisioning API Endpoint** URL. 
It has the format:
{
    "error": {
        "code": "InvalidAuthenticationToken",
        "message": "Access token is empty.",
        "innerError": {
            "date": "2023-06-22T18:46:13",
            "request-id": "85db0437-2e50-4506-81a7-4ffcc046f37f",
            "client-request-id": "85db0437-2e50-4506-81a7-4ffcc046f37f"
        }
    }
}

## How do we perform a full sync using the API endpoint?

To perform a full sync, se your API client to send the data of all users from your trusted source to the API endpoint as SCIM bulk request. Once you send all the data to the API endpoint, the next sync cycle processes all user records and allows you to track the progress using the provisioning API endpoint. If your trusted source is a CSV file, refer the [PowerShell script CSV2SCIM](https://microsoft.sharepoint-df.com/teams/InboundProvisioningPrivatePreview/Shared%20Documents/Forms/AllItems.aspx?csf=1&web=1&e=BacmpK&cid=fee393a0%2Dc1cb%2D4c43%2D8a92%2D4b8460bc2b36&RootFolder=%2Fteams%2FInboundProvisioningPrivatePreview%2FShared%20Documents%2FGeneral%2Fazure%2Dactivedirectory%2Dinbound%2Dprovisioning&FolderCTID=0x012000381E272E41442445A7C3B00586627DA1) to get started.

## How do we perform delta sync using the API endpoint?

To perform a delta sync, use your API client to only send information about users whose data has changed in the trusted source. Once you send all the data to the API endpoint, the next sync cycle processes all user records and allows you to track the progress using the provisioning API endpoint.

If your trusted source is a CSV file, ask your HR team to only send the CSV file with information about users who have gone through a change and then you can use the [PowerShell script CSV2SCIM](https://microsoft.sharepoint-df.com/teams/InboundProvisioningPrivatePreview/Shared%20Documents/Forms/AllItems.aspx?csf=1&web=1&e=BacmpK&cid=fee393a0%2Dc1cb%2D4c43%2D8a92%2D4b8460bc2b36&RootFolder=%2Fteams%2FInboundProvisioningPrivatePreview%2FShared%20Documents%2FGeneral%2Fazure%2Dactivedirectory%2Dinbound%2Dprovisioning&FolderCTID=0x012000381E272E41442445A7C3B00586627DA1) to send those changes to the API endpoint.

## How frequently does the provisioning job run??

The provisioning job runs every 40 minutes. This interval cannot be changed.

If you have sent a payload and you’d like to instantly process it, then you can use the following workaround:

Select **Stop provisionin** to pause the provisioning, then select **Start provisioning** to resume provisioning.

## How does restart provisioning work?

Use the **Restart provisioning** option only if required. Here's how it works:

**Scenario 1:** When you click the **Restart provisioning** button and the job is currently running, the job continues processing the existing data that is already staged. The**Restart provisioning** operation doesn't interrupt an existing cycle. In the subsequent cycle, the provisioning service clears any escrows and picks the new SCIM bulk request for processing.

**Scenario 2:** When you click the **Restart provisioning** button and the job is *not* running, then before running subsequent cycle, the provisioning engine purges the data uploaded prior to the restart, clears any escrows, and only processes new incoming data.

## How do we create users using this API endpoint?

Here is how the provisioning job related to the API endpoint processes incoming user payloads:

- The job retrieves the attribute mapping for the provisioning job and makes note of the matching attribute pair (by default ```externalId``` in SCIM is used to match with ```employeeId``` in Azure AD).
- You can change this default attribute matching pair.
- The job extracts the individual SCIM request from the bulk request payload.
- The job checks the value matching identifier in the SCIM request (by default: SCIM attribute externalId) and uses it to check if there is a user in Azure AD with matching employeeId value.
- If the job does not find a matching user, then the job applies the sync rules and creates a new user in the target directory.

Therefore, to make sure that the right users get created in Azure AD, make sure you define the right matching attribute pair in your mapping which uniquely identifies users in your source and Azure AD.

## How do we generate unique values for UPN?

The provisioning service does not provide the ability to check for duplicate userPrincipalName (UPN) and handle conflicts. If the default sync rule for UPN attribute generates an existing UPN value, then the user create operation will fail.

Here are some options that you can consider for generating unique UPNs:

1. Add the logic for unique UPN generation in your API client. 
2. Update the sync rule for the UPN attribute to use the [RandomString](functions-for-customizing-application-data.md) function and set the apply mapping parameter to “On object creation only”. Example:

```Join("", Replace([userName], , "(?<Suffix>@(.)*)", "Suffix", "", , ), RandomString(3, 3, 0, 0, 0, ), "@", DefaultDomain())```

## How do we send more HR attributes to the API endpoint?

By default, the API endpoint supports processing any attribute that is part of the SCIM Core User and Enterprise User schema.

If you’d like to send additional attributes, you can extend the provisioning app schema, map the new attributes to Azure AD attributes and update the SCIM bulk request to send those attributes. Refer to [Adding custom identity attributes](https://microsoft.sharepoint-df.com/:w:/t/InboundProvisioningPrivatePreview/EVfL3EllwI1FjTmYlMSPeQsB5cxddw7nb_sJHPfvawF5mg?e=nPDIsy) for details.

## How do we exclude certain users from the provisioning flow?

You may have a scenario where you want to send all users to the API endpoint, but only include certain users in the provisioning flow and exclude the rest.

You can achieve this using the **Scoping filter**. In the provisioning app configuration, you can define a source object scope and exclude certain users from processing either using an **inclusion rul** (e.g., only process users where department EQUALS **Sales**) or an “exclusion rule” (e.g., exclude users belonging to Sales, department NOT EQUALS **Sales**).
 
 See [Scoping users or groups to be provisioned with scoping filters](define-conditional-rules-for-provisioning-user-accounts.md).

## How do we update users using this API endpoint?

Here is how the provisioning job related to the API endpoint processes incoming user payloads:

- The provisioning job retrieves the attribute mapping for the provisioning job and makes note of the matching attribute pair (by default ```externalId``` in SCIM is used to match with ```employeeId``` in Azure AD).

    You can change this default attribute matching pair.

- The job extracts the individual SCIM request from the bulk request payload.

- The job checks the value matching identifier in the SCIM request (by default: SCIM attribute ```externalId```) and uses it to check if there is a user in Azure AD with matching ```employeeId``` value.

- If the job finds a matching user, then it applies the sync rules and compares the source and target profiles.

- If the job determines that some values have changed, then it updates the corresponding user record in the directory.

Therefore, to make sure that the right users get updated in Azure AD, make sure you define the right matching attribute pair in your mapping which uniquely identifies users in your source and Azure AD.

## Can we create more than one app that supports API-driven inbound provisioning?

Yes, you can. Here are some scenarios that may require more than one provisioning app:

**Scenario 1:** Let’s say you have three trusted data sources: one for employees, one for contractors and one for vendors. You can create three separate provisioning apps – one for each identity type with its own distinct attribute mapping. Each provisioning app has a unique API endpoint, and you can send the respective payloads to each endpoint.

You can retrieve the unique API endpoint for each job from the Provisioning blade home page. Navigate to **Statistics to date** > **View technical information**, then copy the **Provisioning API Endpoint** URL.

**Scenario 2:** Let’s say you have multiple sources of truth, each with its own attribute set. E.g., HR provides job info attributes (e.g. jobTitle, employeeType), and the Badging System provides badge information attributes (e.g. ```badgeId``` that is represented using an extension attribute). In this scenario, you can setup two provisioning apps:

- **Provisioning App #1** that receives attributes from your HR source and create the user.

- **Provisioning App #2** that receives attributes from the Badging system and only update the user attributes. The attribute mapping in this app is restricted to the Badge Information attributes and under Target Object Actions only update is enabled.

- Both apps use the same matching identifier pair (```externalId``` <-> ```employeeId```)

## How do we process terminations using this API endpoint?

To process terminations, identify an attribute in your source that will be used to set the ```accountEnabled``` flag in Azure AD.
You can then use this source attribute to set the value of SCIM user schema attribute ```active```.

By default, the value associated with the SCIM User Core schema attribute ```active``` determines the status of the user’s account in the target directory.

If the attribute is set to **true**, the default mapping rule enables the account. If the attribute is set to **false**, then the default mapping rule disables the account. 
If you’d like to disable accounts based on other custom fields, you can [extend the provisioning job schema using SCIM extensions](https://microsoft.sharepoint-df.com/:w:/t/InboundProvisioningPrivatePreview/EVfL3EllwI1FjTmYlMSPeQsB5cxddw7nb_sJHPfvawF5mg?e=ZjUU2X) and create attribute mapping rules using these extension attributes.

## Can we soft-delete a user in Azure AD using the provisioning API?

No. Currently the provisioning service only supports enabling or disabling an account in Azure AD/on-premises AD.

## How can we prevent accidental disabling/deletion of users?

You can enable accidental deletion prevention. See [Enable accidental deletions prevention in the Azure AD provisioning service](accidental-deletions.md)

## Do we need to send all users from the HR system in every request?

No, you don’t need to send all users from the HR system / “source of truth” in every request. Just send the users that you’d like create or update.

## Does the API endpoint support all HTTP actions (GET/POST/PUT/PATCH)?

No, the API endpoint only supports the POST HTTP action.

## If I want to update a user, do I need to send a PUT/PATCH request?

No, the API endpoint does not support PUT/PATCH request. In case of updates, simply send the data associated with the user in the POST bulk request payload.

The provisioning job that processes data received by the API endpoint automatically detects whether the user received in the POST request payload needs to be create/updated/enable/disabled based on the configured sync rules. As an API client, you don’t need to take any additional steps if you want a user profile to be updated.

## What is the authentication/authorization mechanism for the APIs?

The private preview supports the following authentication/authorization mechanisms based on the entity invoking the API and the client used for the API call.


## Once Permissions Management is deployed, how fast can I get permissions insights?

Once fully onboarded with data collection setup, customers can access permissions usage insights within hours. Our machine-learning engine refreshes the Permission Creep Index every hour so that customers can start their risk assessment right away.

<table>
<thead>
<tr>
<th>Entity</th>
<th>API invocation client</th>
<th>Authentication mechanism</th>
<th>Required Permissions</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>User</strong></td>
<td>Graph Explorer</td>
<td>Browser-based interactive login that auto-generates OAuth Access Token</td>
<td>Entity must have *App Admin* role
</tr>
<tr>
<td><strong>User</td>
<td>PowerShell MS Graph APIs</td>
<td>PowerShell Get-Credentials that supports interactive login to generate Access Token</td>
<td>Entity must have *App Admin* role</td>
</tr>
<tr>
<td><strong>Service Principal</td>
<td>Postman</td>
<td>OAuth client_credentials flow (using client secret)</td>
<td>Entity must have *App Admin* role</td>
</tr>
<tr>
<td><strong>Service Principal</td>
<td>PowerShell MS Graph APIs</td>
<td>OAuth client_credentials flow (using client secret)</td>
<td>Entity must have *App Admin* role</td>
</tr>
</tbody>
</thead>
</table>

In all scenarios, the authenticating entity, at a minimum, must have the [*Application Admin*](https://go.microsoft.com/fwlink/?linkid=2240195) role.

## How is writeback be supported?

The current API only supports inbound data. Here are some options that could be considered for implementing writeback of attributes like email / username / phone that are generated by Azure AD, which you want to flow back to the HR system:

- **Option 1 – SCIM connectivity to HR endpoint/proxy service that in turn updates the HR source**

  - If the system of record provides a SCIM endpoint for user updates (e.g. Oracle HCM provides an [API endpoint for SCIM updates](https://docs.oracle.com/en/cloud/saas/applications-common/23b/farca/op-hcmrestapi-scim-users-id-patch.html)), you can create a custom SCIM application in the enterprise app gallery and [configure provisioning as documented](use-scim-to-provision-users-and-groups.md#integrate-your-scim-endpoint-with-the-azure-ad-provisioning-service).
  - If the system of record does not provide a SCIM endpoint, explore the possibility of setting up a proxy SCIM service which will receive the update and propagate the change to the HR system.

- **Option 2 – Use Azure AD ECMA connector for the writeback scenario**

  - Depending on the customer requirement, explore if one of the ECMA connectors could be used (PowerShell / SQL / Web Services).

- **Option 3 – Use Lifecycle Workflows custom extension task in a Joiner workflow** 
  - In Lifecycle Workflows define a Joiner workflow and define a [custom extension task that invokes a Logic Apps process](https://go.microsoft.com/fwlink/?linkid=2239990) which updates the HR system or generates a CSV file that is consumed by the HR system.


## Next steps

- To learn more about application provisioning API concepts, see [Inbound User Provisioning API concepts](application-provisioning-api-concepts.md).