---
title: 'Inbound synchronization for cloud provisioning using MS Graph API'
description: This topic describes how to enable inbound synchronization using just the Graph API
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 12/04/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---
# Inbound synchronization for cloud provisioning using MS Graph API

The following document describes how to replicate a synchronization profile from scratch using only MSGraph APIs.  
The structure of how to do this consists of the following steps.  They are:

- [Basic setup](#basic-setup)
- [Create Service Principals](#create-service-principals)
- [Create Sync Job](#create-sync-job)
- [Update targeted domain](#update-targeted-domain)
- [Start sync job](#start-sync-job)
- [Review status](#review-status)

Use these [Microsoft Azure Active Directory Module for Windows PowerShell](https://docs.microsoft.com/powershell/module/msonline/?view=azureadps-1.0) commands to enable synchronization for a production tenant, a pre-requisite for being able to call the Administration Web Service for that tenant.

## Basic setup

### Enable tenant flags

 ```PowerShell
 Connect-MsolService ('-AzureEnvironment <AzureEnvironmnet>')
 Set-MsolDirSyncEnabled -EnableDirSync $true
 ```
The first of those two commands, require Azure Active Directory credentials. These commandlets implicitly identify the tenant and enable it for synchronization.

## Create service principals
Next, we need to create the [AD2AAD application/ service principal](https://docs.microsoft.com/graph/apiapplicationtemplate-instantiate?view=graph-rest-beta&tabs=http)

You need to use this application ID 1a4721b3-e57f-4451-ae87-ef078703ec94. The displayName is the AD domain url, if used in the portal (for example, contoso.com), but it may be named something else.

 ```
 POST https://graph.microsoft.com/beta/applicationTemplates/1a4721b3-e57f-4451-ae87-ef078703ec94/instantiate
 Content-type: application/json
 {
    displayName: [your app name here]
 }
 ```


## Create sync job
The output of the above command will return the objectId of the service principal that was created. For this example, the objectId is 614ac0e9-a59b-481f-bd8f-79a73d167e1c.  Use Microsoft Graph to add a synchronizationJob to that service principal.  

Documentation for creating a sync job can be found [here](https://docs.microsoft.com/graph/api/synchronization-synchronizationjob-post?view=graph-rest-beta&tabs=http).

If you did not record the ID above, you can find the service principal by running the following MS Graph call. You'll need Directory.Read.All permissions to make that call:
 
 `GET https://graph.microsoft.com/beta/servicePrincipals `

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

You will need two calls if you want to create both.

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

Make sure the domain name you use is the same url you set for your on-prem domain controller

 ```
 PUT https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/secrets
 Content-type: application/json
 {
  "value": [
    {
      "key": "Domain",
       {"value":[{"key":"Domain","value":"{\"domain\":\"[YOUR_DOMAIN_NAME]\"}"}]}
    }
  ]
 }
 ```

The expected response is … 
HTTP 204/No content

Here, the highlighted "Domain" value is the name of the on-premises Active Directory domain from which entries are to be provisioned to Azure Active Directory.

## Start sync job
The job can be retrieved again via the following command:

 `GET https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/jobs/ ` 

Documentation for retrieving jobs can be found [here](https://docs.microsoft.com/graph/api/synchronization-synchronizationjob-list?view=graph-rest-beta&tabs=http). 
 
To start the job, issue this request, using the objectId of the service principal created in the first step, and the job identifier returned from the request that created the job.

Documentation for how to start a job can be found [here](https://docs.microsoft.com/graph/api/synchronization-synchronizationjob-start?view=graph-rest-beta&tabs=http). 

 ```
 POST  https://graph.microsoft.com/beta/servicePrincipals/8895955e-2e6c-4d79-8943-4d72ca36878f/synchronization/jobs/AD2AADProvisioning.fc96887f36da47508c935c28a0c0b6da/start
 ```

The expected response is … 
HTTP 204/No content.

Other commands for controlling the job are documented [here](https://docs.microsoft.com/graph/api/resources/synchronization-synchronizationjob?view=graph-rest-beta).
 
To restart a job, one would use …

 ```
 POST  https://graph.microsoft.com/beta/servicePrincipals/8895955e-2e6c-4d79-8943-4d72ca36878f/synchronization/jobs/AD2AADProvisioning.fc96887f36da47508c935c28a0c0b6da/restart
 {
   "criteria": {
       "resetScope": "Full"
   }
 }
 ```

## Review status
Retrieve your job statuses via …

 ```
 GET https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/jobs/ 
 ```

Look under the 'status' section of the return object for relevant details

## Next steps 

- [What is Azure AD Connect cloud provisioning?](what-is-cloud-provisioning.md)
- [Transformations](how-to-transformation.md)
- [Azure AD Synchronization API](https://docs.microsoft.com/graph/api/resources/synchronization-overview?view=graph-rest-beta)
