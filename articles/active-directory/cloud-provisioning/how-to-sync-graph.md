---
title: Enable Azure AD Connect cloud provisioning with Microsft Graph APIs | Microsoft Docs
description: This document describes how to setup synchronization using only the Microsoft Graph API
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
ms.service: active-directory
ms.subservice: hybrid
ms.workload: identity
ms.date: 09/24/2020
ms.topic: how-to
ms.author: billmath
ms.collection: M365-identity-device-management 
---

The following document describes how to replicate a synchronization profile from scratch using only MSGraph APIs.  
The structure of how to do this consists of 4 basic steps.  They are:

- [Basic setup]
- [Create the Active directory to Azure AD service principals]
- [Create the synchronization jobs and synchronization profiles]
- [Start the jobs]

## Pre-requisites
Before you begin, the Microsoft Azure Active Directory Module for Windows PowerShell is required and used to accomplish this.  

You can find documenation and how to download the Microsoft Azure AD Module for Windows PowerShell [here](https://docs.microsoft.com/en-us/powershell/azure/active-directory/install-msonlinev1?view=azureadps-1.0#install-the-azure-ad-module).

## Enable Tenant Flags:
The following commands will enable synchronization for a production tenant.  This is a pre-requisite for being able to call the Administration Web Service for that tenant.

To enable synchronization do the following:

```PowerShell
Connect-MsolService (add flag '-AzureEnvironment AzurePPE' if using PPE)
Set-MsolDirSyncEnabled -EnableDirSync $true
```

Be aware that when using `Connect-MsolService` you will be required to enter your Azure AD credentials.


## Create Service Principal
Next, we need to create the AD2AAD application/ service principal
https://docs.microsoft.com/en-us/graph/api/applicationtemplate-instantiate?view=graph-rest-beta&tabs=http 

You must use this specific application id 1a4721b3-e57f-4451-ae87-ef078703ec94
Displayname is the AD domain url if used in the portal (e.g. contoso.com ) but it can be named anything

POST https://graph.microsoft.com/beta/applicationTemplates/1a4721b3-e57f-4451-ae87-ef078703ec94/instantiate (or use 77bba2fe-c22b-44d3-ac50-3b6912035327 for PPE)
Content-type: application/json
{
    displayName: [your app name here]
}
Note that the value specified for the application id corresponds to the value in this source code file:
https://msazure.visualstudio.com/One/_git/AD-IAM-Services-SyncFabric?path=%2Fsrc%2Fdev%2FController%2FRunProfile%2FHybridSync%2FActiveDirectory%2FHybridActiveDirectoryDomainControllerIdentifier.cs&version=GBmaster 

Create Sync Job
The output of the above command will return the objectId of the service principal that was created. Given that value, which, in the case of this example is 614ac0e9-a59b-481f-bd8f-79a73d167e1c, use Microsoft Graph to add a synchronizationJob to that service principal:

Docs to create sync job:
https://docs.microsoft.com/en-us/graph/api/synchronization-synchronizationjob-post?view=graph-rest-beta&tabs=http 

If you did not record the id above, you can find the service principal by running the following MS Graph call. You'll need Directory.Read.All permissions to make that call:
GET https://graph.microsoft.com/beta/servicePrincipals 

Then look for your app name in the output.

Run the following 2 commands to create 2 jobs: 1 for user/group provisioning, and 1 for password hash syncing. It's the same request twice but with different template ids.

CALL THE FOLLOWING 2 requests:

POST https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/jobs
Content-type: application/json
{
"templateId":"AD2AADProvisioning"
}

&&

POST https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/jobs
Content-type: application/json
{
"templateId":"AD2AADPasswordHash"
}

(You will need 2 calls if you want to create both)

EXAMPLE RETURN VALUE (for provisioning):
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
Update targeted domain
In this tenant the object identifier and application identifier of the service principal are as follows:

ObjectId: 8895955e-2e6c-4d79-8943-4d72ca36878f
AppId: 00000014-0000-0000-c000-000000000000
DisplayName: testApp

We're going to need to update the domain this configuration is targeting, so update the secrets for this (couldn't find public docs for this)

Make sure the domain name you use is the same url you set for your on-prem domain controller

PUT https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/secrets
Content-type: application/json
{
  "value": [
    {
      "key": "Domain",
      "value": [YOUR_DOMAIN_NAME] (e.g. contoso.com)
    }
  ]
}

The expected response is … 
HTTP 204/No content
(Here, the highlighted "Domain" value is the name of the on-premises Active Directory domain from which entries are to be provisioned to Azure Active Directory.)

Start sync job
The job can be retrieved again via …

GET https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/jobs/ 

Docs for retrieving jobs: https://docs.microsoft.com/en-us/graph/api/synchronization-synchronizationjob-list?view=graph-rest-beta&tabs=http 
 
To start the job, issue this request, using the objectId of the service principal created in the first step, and the job identifier returned from the request that created the job.

Docs to start job: https://docs.microsoft.com/en-us/graph/api/synchronization-synchronizationjob-start?view=graph-rest-beta&tabs=http 

POST  https://graph.microsoft.com/beta/servicePrincipals/8895955e-2e6c-4d79-8943-4d72ca36878f/synchronization/jobs/AD2AADProvisioning.fc96887f36da47508c935c28a0c0b6da/start
 
The expected response is … 
HTTP 204/No content
Other commands for controlling the job are documented here: https://docs.microsoft.com/en-us/graph/api/resources/synchronization-synchronizationjob?view=graph-rest-beta 
 
To restart a job, one would use …

POST  https://graph.microsoft.com/beta/servicePrincipals/8895955e-2e6c-4d79-8943-4d72ca36878f/synchronization/jobs/AD2AADProvisioning.fc96887f36da47508c935c28a0c0b6da/restart
{
   "criteria": {
       "resetScope": "Full"
   }
}
Review status
Retrieve your job statuses via …

GET https://graph.microsoft.com/beta/servicePrincipals/[SERVICE_PRINCIPAL_ID]/synchronization/jobs/ 

Look under the 'status' section of the return object for relevant details