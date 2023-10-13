---
title: 'How to programmatically configure cloud sync using MS Graph API'
description: This topic describes how to enable inbound synchronization using just the Graph API
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.custom: has-azure-ad-ps-ref
ms.topic: conceptual
ms.date: 01/11/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# How to programmatically configure cloud sync using MS Graph API

The following document describes how to replicate a synchronization profile from scratch using only MSGraph APIs.  
The structure of how to do this consists of the following steps.  They are:

- [How to programmatically configure cloud sync using MS Graph API](#how-to-programmatically-configure-cloud-sync-using-ms-graph-api)
  - [Basic setup](#basic-setup)
    - [Enable tenant flags](#enable-tenant-flags)
  - [Create service principals](#create-service-principals)
  - [Create sync job](#create-sync-job)
  - [Update targeted domain](#update-targeted-domain)
  - [Enable Sync password hashes on configuration blade](#enable-sync-password-hashes-on-configuration-blade)
  - [Exchange hybrid writeback](#exchange-hybrid-writeback-public-preview)
  - [Accidental deletes](#accidental-deletes)
    - [Enabling and setting the threshold](#enabling-and-setting-the-threshold)
    - [Allowing deletes](#allowing-deletes)
  - [Start sync job](#start-sync-job)
  - [Review status](#review-status)
  - [Next steps](#next-steps)

Use these [Azure AD PowerShell module](/powershell/module/msonline/) commands to enable synchronization for a production tenant, a prerequisite for being able to call the Administration Web Service for that tenant.

## Basic setup

### Enable tenant flags

```powershell
Connect-MsolService ('-AzureEnvironment <AzureEnvironmnet>')
 Set-MsolDirSyncEnabled -EnableDirSync $true
```

The first of those two commands, require Microsoft Entra credentials. These cmdlets implicitly identify the tenant and enable it for synchronization.

## Create service principals

Next, we need to create the [AD2AAD application/ service principal](/graph/api/applicationtemplate-instantiate)

You need to use this application ID 1a4721b3-e57f-4451-ae87-ef078703ec94. The displayName is the AD domain URL, if used in the portal (for example, contoso.com), but it may be named something else.

```
POST https://graph.microsoft.com/beta/applicationTemplates/1a4721b3-e57f-4451-ae87-ef078703ec94/instantiate
Content-type: application/json
{
    displayName: [your app name here]
}
```

## Create sync job

The output of the above command returns the objectId of the service principal that was created. For this example, the objectId is 614ac0e9-a59b-481f-bd8f-79a73d167e1c.  Use Microsoft Graph to add a synchronizationJob to that service principal.

Documentation for creating a sync job can be found [here](/graph/api/synchronization-synchronizationjob-post?tabs=http&view=graph-rest-beta&preserve-view=true).

If you didn't record the ID above, you can find the service principal by running the following MS Graph call. You'll need Directory.Read.All permissions to make that call:

`GET https://graph.microsoft.com/beta/servicePrincipals`

Then look for your app name in the output.

Run the following two commands to create two jobs: one for user/group provisioning, and one for password hash syncing. It's the same request twice but with different template IDs.

Call the following two requests:

```
POST https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/jobs
Content-type: application/json
{
"templateId":"AD2AADProvisioning"
} 
```

```
POST https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/jobs
Content-type: application/json
{
"templateId":"AD2AADPasswordHash"
}
```

You need two calls if you want to create both.

Example return value (for provisioning):

```
HTTP 201/Created
{
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#servicePrincipals('614ac0e9-a59b-481f-bd8f-79a73d167e1c')/synchronization/jobs/$entity",
    "id": "AD2AADProvisioning.fc96887f36da47508c935c28a0c0b6da",
    "templateId": "ADDCInPassthrough",
    "schedule": {
        "expiration": null,
        "interval": "PT40M",
        "state": "Disabled"
    },
    "status": {
        "countSuccessiveCompleteFailures": 0,
        "escrowsPruned": false,
        "code": "Paused",
        "lastExecution": null,
        "lastSuccessfulExecution": null,
        "lastSuccessfulExecutionWithExports": null,
        "quarantine": null,
        "steadyStateFirstAchievedTime": "0001-01-01T00:00:00Z",
        "steadyStateLastAchievedTime": "0001-01-01T00:00:00Z",
        "troubleshootingUrl": null,
        "progress": [],
        "synchronizedEntryCountByType": []
    }
}
```

## Update targeted domain

For this tenant, the object identifier and application identifier of the service principal are as follows:

ObjectId: 8895955e-2e6c-4d79-8943-4d72ca36878f
AppId: 00000014-0000-0000-c000-000000000000
DisplayName: testApp

We're going to need to update the domain this configuration is targeting, so update the secrets for this domain.

Make sure the domain name you use is the same URL you set for your on-premises domain controller.

```
PUT – https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/secrets
```

Add the following key/value pair in the below value array based on what you're trying to do:

- Enable both PHS and sync tenant flags
  { key: "AppKey", value: "{"appKeyScenario":"AD2AADPasswordHash"}" }

- Enable only sync tenant flag (don't turn on PHS)
  { key: "AppKey", value: "{"appKeyScenario":"AD2AADProvisioning"}" }

```
Request body –
{
   "value": [
              {
                "key": "Domain",
                "value": "{\"domain\":\"ad2aadTest.com\"}"
              }
            ]
}
```

The expected response is … 
HTTP 204/No content

Here, the highlighted "Domain" value is the name of the on-premises Active Directory domain from which entries are to be provisioned to Microsoft Entra ID.

## Enable Sync password hashes on configuration blade

 This section covers enabling syncing password hashes for a particular configuration. This is different than the AppKey secret that enables the tenant-level feature flag - this is only for a single domain/config. You need to set the application key to the PHS one for this to work end to end.

1. Grab the schema (warning, it's pretty large):

   ```
   GET –https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/jobs/ [AD2AADProvisioningJobId]/schema
   ```

2. Take this CredentialData attribute mapping:

   ```
   {
   "defaultValue": null,
   "exportMissingReferences": false,
   "flowBehavior": "FlowWhenChanged",
   "flowType": "Always",
   "matchingPriority": 0,
   "targetAttributeName": "CredentialData",
   "source": {
   "expression": "[PasswordHash]",
   "name": "PasswordHash",
   "type": "Attribute",
   "parameters": []
   }
   ```

3. Find the following object mappings with the following names in the schema
   - Provision Active Directory Users
   - Provision Active Directory inetOrgPersons

   Object mappings are within the schema.synchronizationRules[0].objectMappings (For now you can assume there's only one Synchronization Rule)

4. Take the CredentialData Mapping from Step (2) and insert it into the object mappings in Step (3)

   Your object mapping looks something like this:

   ```
   {
   "enabled": true,
   "flowTypes": "Add,Update,Delete",
   "name": "Provision Active Directory users",
   "sourceObjectName": "user",
   "targetObjectName": "User",
   "attributeMappings": [
   ...
   } 
   ```

   Copy/paste the mapping from the **Create AD2AADProvisioning and AD2AADPasswordHash jobs** step above into the attributeMappings array.

   Order of elements in this array doesn't matter (the backend sorts for you). Be careful about adding this attribute mapping if the name exists already in the array (e.g. if there's already an item in attributeMappings that has the targetAttributeName CredentialData) - you may get conflict errors, or the pre-existing and new mappings may be combined together (usually not desired outcome). Backend doesn't dedupe for you.

   Remember to do this for both Users and inetOrgpersons.

5. Save the schema you've created:

   ```
   PUT –
   https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/jobs/ [AD2AADProvisioningJobId]/schema
   ```

Add the Schema in the request body.

## Exchange hybrid writeback (Public Preview)

This section covers how to enable/disable and use [Exchange hybrid writeback](exchange-hybrid.md) programmatically.

Enabling Exchange hybrid writeback programmatically requires two steps.
	
  1.  Schema verification
	2.  Create the Exchange hybrid writeback job

### Schema verification
Prior to enabling and using Exchange hybrid writeback, cloud sync needs to determine whether or not the on-premises Active Directory has been extended to include the Exchange schema.  

You can use the [directoryDefinition:discover](/graph/api/directorydefinition-discover?view=graph-rest-beta&tabs=http&preserve-view=true) to initiate schema discovery. 

```
POST https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/jobs/[AD2AADProvisioningJobId]/schema/directories/[ADDirectoryID]/discover
```
The expected response is … 
HTTP 200/OK

The response should look similar to the following:

```
HTTP/1.1 200 OK
Content-type: application/json
{
  "objects": [
    {
      "name": "user",
      "attributes": [
        {
          "name": "mailNickName",
          "type": "String"
        },
        ...
      ]
    },
    ...
  ]
}
```

Now check to see if the **mailNickName** attribute is present.  If it is, then your schema is verified and contains the Exchange attributes. If not, review the [prerequisites](exchange-hybrid.md#prerequisites) for Exchange hybrid writeback.



### Create the Exchange hybrid writeback job
Once you have verified the schema you can create the job.

```
POST https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/jobs
Content-type: application/json
{
"templateId":"AAD2ADExchangeHybridWriteback"
}
```



## Accidental deletes

This section covers how to programmatically enable/disable and use [accidental deletes](how-to-accidental-deletes.md) programmatically.

### Enabling and setting the threshold

There are two per job settings that you can use, they are:

- DeleteThresholdEnabled  - Enables accidental delete prevention for the job when set to 'true'. Set to 'true' by default.
- DeleteThresholdValue    - Defines the maximum number of deletes that is allowed in each execution of the job when accidental deletes prevention is enabled. The value is set to 500 by default.  So, if the value is set to 500, the maximum number of deletes allowed is 499 in each execution.

The delete threshold settings are a part of the `SyncNotificationSettings` and can be modified via graph.

We're going to need to update the SyncNotificationSettings this configuration is targeting, so update the secrets.

```
PUT – https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/secrets
```

Add the following Key/value pair in the below value array based on what you're trying to do:

```
Request body -
{
  "value":[
    {
      "key":"SyncNotificationSettings",
      "value": "{\"Enabled\":true,\"Recipients\":\"foobar@xyz.com\",\"DeleteThresholdEnabled\":true,\"DeleteThresholdValue\":50}"
     }
  ]
}
```

The "Enabled" setting in the example is for enabling/disabling notification emails when the job is quarantined.

Currently, we don't support PATCH requests for secrets, so you need to add all the values in the body of the PUT request(like in the example) in order to preserve the other values.

The existing values for all the secrets can be retrieved by using:

```
GET https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/secrets 
```

### Allowing deletes

To allow these deletes to flow through after the job goes into quarantine, you need to issue a restart with just "ForceDeletes" as the scope.

```
Request:
POST https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs/{jobId}/restart
```

```
Request Body:
{
  "criteria": {"resetScope": "ForceDeletes"}
}
```

## Start sync job

The jobs can be retrieved again via the following command:

 `GET https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/jobs/`

Documentation for retrieving jobs can be found [here](/graph/api/synchronization-synchronizationjob-list?tabs=http&view=graph-rest-beta&preserve-view=true).

To start the jobs, issue this request, using the objectId of the service principal created in the first step, and the job identifiers returned from the request that created the job.

Documentation for how to start a job can be found [here](/graph/api/synchronization-synchronizationjob-start?tabs=http&view=graph-rest-beta&preserve-view=true).

```
POST  https://graph.microsoft.com/beta/servicePrincipals/8895955e-2e6c-4d79-8943-4d72ca36878f/synchronization/jobs/AD2AADProvisioning.fc96887f36da47508c935c28a0c0b6da/start
```

The expected response is … 
HTTP 204/No content.

Other commands for controlling the job are documented [here](/graph/api/resources/synchronization-synchronizationjob?view=graph-rest-beta&preserve-view=true).

To restart a job, use:

```
POST  https://graph.microsoft.com/beta/servicePrincipals/8895955e-2e6c-4d79-8943-4d72ca36878f/synchronization/jobs/AD2AADProvisioning.fc96887f36da47508c935c28a0c0b6da/restart
{
  "criteria": {
    "resetScope": "Full"
  }
}
```

## Review status

Retrieve your job statuses via:

```
GET https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/jobs/ 
```

Look under the 'status' section of the return object for relevant details

## Next steps

- [What is Microsoft Entra Cloud Sync?](what-is-cloud-sync.md)
- [Transformations](how-to-transformation.md)
- [Microsoft Entra Synchronization API](/graph/api/resources/synchronization-overview?view=graph-rest-beta&preserve-view=true)
