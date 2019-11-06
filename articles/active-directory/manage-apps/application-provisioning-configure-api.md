---
title: Configure automatic provisioning user MS Graph APIs | Microsoft Docs
description: How to configure automatic provisioning user MS Graph APIs.
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 11/10/2019
ms.author: mimart
ms.reviewer: arvinh

ms.collection: M365-identity-device-management
---

Azure AD provides an interface for configuring provisioning. This can be easy to use for one or two applications, but in situations where you have to create 10, 20, 100+ instances of an application, it is often easier to automate application creation and configuration through APIs rather than the user interface. This document outlines how to automate configuring provisioning through APIs. This is most commonly used for applications such as [Amazon Web Services](https://docs.microsoft.com/azure/active-directory/saas-apps/amazon-web-service-tutorial#configure-azure-ad-single-sign-on) and [Azure Databricks]()



1.	Create gallery app
	1. Retrieve the gallery application template<br>
      GET https://graph.microsoft.com/beta/applicationTemplates
	2. Create gallery application <br>
  POST https://graph.microsoft.com/beta/applicationTemplates/{id}/instantiate
2.	Create provisioning job based on template
	1. Retrieve the template for the provisioning connector<br> 
  GET https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/templates
	2. Create the provisioning job<br>
  POST https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs
Content-type: application/json
{ 
    "templateId": "BoxOutDelta"
	GET https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs/{jobId}/
3.	Authorize access
    1. Test connection to the application<br>
    POST /servicePrincipals/{id}/synchronization/jobs/{id}/validateCredentials
    1. Save credentials<br>	
    PUT https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/secrets  

4.	Configure
    1.	What’s an example of setting scope?

5.	Start provisioning job
    1.	POST https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs/{jobId}/start
6.	Monitor provisioning
    1.	Check the status of the provisioning job <br>
    GET https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs/{jobId}/
    2.	Retrieve the provisioing logs <br>
    GET https://graph.microsoft.com/beta/auditLogs/provisioning


> [!NOTE]
> The response objects shown here may be shortened for readability. All the properties will be returned from an actual call.


## Step 1: Sign into Microsoft Graph Explorer (recommended), Postman, or any other API client you use

1. Launch [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)
1. Click on the "Sign-In with Microsoft" button and sign-in using Azure AD Global Admin or App Admin credentials.

    ![Graph Sign-in](./media/export-import-provisioning-mappings/wd_export_02.png)

1. Upon successful sign-in, you will see the user account details in the left-hand pane.



## Step 2: Get the application template id
Applications in the Azure AD application gallery have an application template describing the metadata for that application. Using this template you can create an instance of the application and service principal in your tenant for management. 

### Request

<!-- {
  "blockType": "request",
  "name": "get_applicationtemplates"
}-->

```msgraph-interactive
GET https://graph.microsoft.com/beta/applicationTemplates
```


### Response

<!-- {
  "blockType": "response",
  "truncated": true,
  "@odata.type": "microsoft.graph.applicationTemplate",
  "isCollection": true
} -->

```http
HTTP/1.1 200 OK
Content-type: application/json

{
  "value": [
    {
      "id" : "id-value",
      "displayName" : "displayName-value",
      "homePageUrl" : "homePageUrl-value",
      "supportedSingleSignOnModes" : ["supportedSingleSignOnModes-value"],
      "logoUrl" : "logoUrl-value",
      "categories" : ["categories-value"],
      "publisher" : "publisher-value",
      "description" : "description-value"
    }
  ]
}
```

## Step 3: Create a gallery application

Use the template ID retrieved for your application in the last step to create an instance of the application and service principal in your tenant. 

### Request

<!-- {
  "blockType": "request",
  "name": "applicationtemplate_instantiate"
}-->

```http
POST https://graph.microsoft.com/beta/applicationTemplates/{id}/instantiate
Content-type: application/json

{
  "displayName": "My custom name"
}
```

### Response


<!-- {
  "blockType": "response",
  "truncated": true,
  "@odata.type": "microsoft.graph.applicationServicePrincipal"
} -->

```http
HTTP/1.1 201 OK
Content-type: application/json

{
   "servicePrincipal": {
	  "accountEnabled": true,
	  "addIns": [
	    {
	      "id": "id-value",
	      "type": "type-value",
	      "properties": [
		{
		  "key": "key-value",
		  "value": "value-value"
		}
	      ]
	    }
	  ],
	  "appDisplayName": "appDisplayName-value",
	  "appId": "appId-value",
	  "appOwnerOrganizationId": "appOwnerOrganizationId-value",
	  "appRoleAssignmentRequired": true
   },
   "application": {
	  "api": {
	    "acceptedAccessTokenVersion": 1,
	    "publishedPermissionScopes": [
	      {
		"adminConsentDescription": "adminConsentDescription-value",
		"adminConsentDisplayName": "adminConsentDisplayName-value",
		"id": "id-value",
		"isEnabled": true,
		"type": "type-value",
		"userConsentDescription": "userConsentDescription-value",
		"userConsentDisplayName": "userConsentDisplayName-value",
		"value": "value-value"
	      }
	    ]
	  },
	  "allowPublicClient": true,
	  "applicationAliases": [
	    "applicationAliases-value"
	  ],
	  "createdDateTime": "datetime-value",
	  "installedClients": {
	    "redirectUrls": [
	      "redirectUrls-value"
	    ]
	  }
   }
}
```

## Step 4: Get templateId
Applications in the gallery that are enabled for provisoning have templates to streamline configuration. Use the request below to retrieve the template for the provisioning configuration. 

##### Request

<!-- {
  "blockType": "request",
  "name": "get_synchronizationtemplate"
}-->
```msgraph-interactive
GET https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/templates
```


##### Response
<!-- {
  "blockType": "response",
  "truncated": true,
  "@odata.type": "microsoft.graph.synchronizationTemplate",
  "isCollection": true
} -->
```http
HTTP/1.1 200 OK

{
    "value": [
        {
            "id": "Slack",
            "factoryTag": "CustomSCIM",
            "schema": {
                    "directories": [],
                    "synchronizationRules": []
                    }
        }
    ]
}
```

## Step 4: Create job
Enabling provisioning requires that a job be created. Use the request below to create a provisioning job. 

##### Request
<!-- {
  "blockType": "request",
  "name": "create_synchronizationjob_from_synchronization"
}-->
```http
POST https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs
Content-type: application/json

{ 
    "templateId": "BoxOutDelta"
}
```

##### Response
<!-- {
  "blockType": "response",
  "truncated": true,
  "@odata.type": "microsoft.graph.synchronizationJob"
} -->
```http
HTTP/1.1 200 OK
Content-type: application/json

{
    "id": "{jobId}",
    "templateId": "BoxOutDelta",
    "schedule": {
        "expiration": null,
        "interval": "P10675199DT2H48M5.4775807S",
        "state": "Disabled"
    },
    "status": {
        "countSuccessiveCompleteFailures": 0,
        "escrowsPruned": false,
        "synchronizedEntryCountByType": [],
        "code": "NotConfigured",
        "lastExecution": null,
        "lastSuccessfulExecution": null,
        "lastSuccessfulExecutionWithExports": null,
        "steadyStateFirstAchievedTime": "0001-01-01T00:00:00Z",
        "steadyStateLastAchievedTime": "0001-01-01T00:00:00Z",
        "quarantine": null,
        "troubleshootingUrl": null
    }
}
```
## Step 5: Save your credentials

Configuring provisioning requires establishing a trust between Azure AD and the application. Authorize access to the third party application. The example below is for an application that requires clientSecret and secretToken. Each applicaiton has its on requirements. Review the API documentation to see the available options. 

```json
PUT https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/secrets 
 
{ 
    value: [ 
        { key: "ClientSecret", value: "xxxxxxxxxxxxxxxxxxxxx" },
        { key: "SecretToken", value: "xxxxxxxxxxxxxxxxxxxxx" }
    ]
}
```

You should get “Success – Status Code 204” as a result.

## Step 3: Retrieve the Provisioning Job ID of the Provisioning App
Now that the provisioning job is created, you will need to retrieve the job ID to complete your configuration. Use the command below to retrieve your job ID. 

##### Request
<!-- {
  "blockType": "request",
  "name": "get_synchronizationjob"
}-->
```msgraph-interactive
GET https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs/{jobId}/
```

##### Response
<!-- {
  "blockType": "response",
  "truncated": true,
  "@odata.type": "microsoft.graph.synchronizationJob"
} -->
```http
HTTP/1.1 200 OK
Content-type: application/json
Content-length: 2577

{
    "id": "{jobId}",
    "templateId": "BoxOutDelta",
    "schedule": {
        "expiration": null,
        "interval": "P10675199DT2H48M5.4775807S",
        "state": "Disabled"
    },
    "status": {
        "countSuccessiveCompleteFailures": 0,
        "escrowsPruned": false,
        "synchronizedEntryCountByType": [],
        "code": "Paused",
        "lastExecution": null,
        "lastSuccessfulExecution": null,
        "progress": [],
        "lastSuccessfulExecutionWithExports": null,
        "steadyStateFirstAchievedTime": "0001-01-01T00:00:00Z",
        "steadyStateLastAchievedTime": "0001-01-01T00:00:00Z",
        "quarantine": null,
        "troubleshootingUrl": null
    },
    "synchronizationJobSettings": [
      {
          "name": "QuarantineTooManyDeletesThreshold",
          "value": "500"
      }
    ]
}
```

## Step 4: Validate credentials

In the Microsoft Graph Explorer, run the following GET query, replacing [servicePrincipalId] and [ProvisioningJobId] with the ServicePrincipalId and the ProvisioningJobId retrieved in the previous steps. This will allow you to test the connection with the third party application. 

```http
POST /servicePrincipals/{id}/synchronization/jobs/{id}/validateCredentials
```

https://docs.microsoft.com/graph/api/synchronization-synchronizationjob-validatecredentials?view=graph-rest-beta&tabs=http

Copy the JSON object from the response and save it to a file to create a backup of the schema.

## Step 6: Set scope

Amazon Web Service only supports role imports. Skip this step for AWS.  


**schema? example?**

https://main.iam.ad.ext.azure.com/api/UserProvisioning/35b92148-dbe0-4b8e-9836-60512ec4643d/Credentials

fieldValues.oauth2AccessTokenCreationTime
{galleryApplicationId: "97e0a159-74ec-4db1-918a-c03a9c3b6b81", templateId: "DropboxSCIMOutDelta",…}
fieldConfigurations: {,…}
baseaddress: {defaultHelpText: null, defaultLabel: null, defaultValue: "https://www.dropbox.com/scim/v2",…}
defaultHelpText: null
defaultLabel: null
defaultValue: "https://www.dropbox.com/scim/v2"
extendedProperties: null
hidden: true
name: "baseaddress"
optional: false
readOnly: false
secret: false
validationRegEx: null
fieldValues: {oauth2AccessToken: "*", oauth2AccessTokenCreationTime: "2019-10-14T18:30:41.0425992Z",…}
baseaddress: "https://www.dropbox.com/scim/v2"
oauth2AccessToken: "*"
oauth2AccessTokenCreationTime: "2019-10-14T18:30:41.0425992Z"
oauth2ClientId: "a3j5adzwuaf7gv9"
oauth2ClientSecret: "*"
oauth2RefreshToken: ""
galleryApplicationId: "97e0a159-74ec-4db1-918a-c03a9c3b6b81"
galleryApplicationKey: "dropbox"
notificationEmail: null
oAuth2AuthorizeUrl: "https://www.dropbox.com/1/oauth2/authorize?client_id=a3j5adzwuaf7gv9&response_type=code&redirect_uri=https%3a%2f%2fportal.azure.com%2fTokenAuthorize"
oAuthEnabled: true
sendNotificationEmails: false
syncAll: false
synchronizationLearnMoreIbizaFwLink: ""
templateId: "DropboxSCIMOutDelta"

## Step 7: Start the provisioning job
Now that the provisioning job is configured, use the following command to start the job. 

##### Request
<!-- {
  "blockType": "request",
  "name": "synchronizationjob_start"
}-->
```http
POST https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs/{jobId}/start
```

##### Response
<!-- {
  "blockType": "response",
  "truncated": true,
  "@odata.type": "microsoft.graph.None"
} -->
```http
HTTP/1.1 204 No Content
```


## Step 8: Monitor the provisioning job status

Now that the provisioning job is running, use the following command to track the progress of the current provisioning cycle as well as statistics to date such as the number of users and groups that have been created in the target system. 

##### Request
<!-- {
  "blockType": "request",
  "name": "get_synchronizationjob"
}-->
```msgraph-interactive
GET https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs/{jobId}/
```

##### Response
<!-- {
  "blockType": "response",
  "truncated": true,
  "@odata.type": "microsoft.graph.synchronizationJob"
} -->
```http
HTTP/1.1 200 OK
Content-type: application/json
Content-length: 2577

{
    "id": "{jobId}",
    "templateId": "BoxOutDelta",
    "schedule": {
        "expiration": null,
        "interval": "P10675199DT2H48M5.4775807S",
        "state": "Disabled"
    },
    "status": {
        "countSuccessiveCompleteFailures": 0,
        "escrowsPruned": false,
        "synchronizedEntryCountByType": [],
        "code": "Paused",
        "lastExecution": null,
        "lastSuccessfulExecution": null,
        "progress": [],
        "lastSuccessfulExecutionWithExports": null,
        "steadyStateFirstAchievedTime": "0001-01-01T00:00:00Z",
        "steadyStateLastAchievedTime": "0001-01-01T00:00:00Z",
        "quarantine": null,
        "troubleshootingUrl": null
    },
    "synchronizationJobSettings": [
      {
          "name": "QuarantineTooManyDeletesThreshold",
          "value": "500"
      }
    ]
}
```


## Step 9: Monitor provisioning events using the provisioning logs
In addition to monitoring the status of the provisioning job, you can use the provisioning logs to query for all the events that are occurring (e.g. query for a particular user and determine if they were successfully provisionined).

**Request**
```msgraph-interactive
GET https://graph.microsoft.com/beta/auditLogs/provisioning
```
**Response**
<!-- {
  "blockType": "response",
  "truncated": true,
  "@odata.type": "microsoft.graph.provisioningObjectSummary",
  "name": "list_provisioningobjectsummary_error"
} -->

```http
HTTP/1.1 200 OK
Content-type: application/json

{
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#auditLogs/provisioning",
    "value": [
        {
            "id": "gc532ff9-r265-ec76-861e-42e2970a8218",
            "activityDateTime": "2019-06-24T20:53:08Z",
            "tenantId": "7928d5b5-7442-4a97-ne2d-66f9j9972ecn",
            "jobId": "BoxOutDelta.7928d5b574424a97ne2d66f9j9972ecn",
            "cycleId": "44576n58-v14b-70fj-8404-3d22tt46ed93",
            "changeId": "eaad2f8b-e6e3-409b-83bd-e4e2e57177d5",
            "action": "Create",
            "durationInMilliseconds": 2785,
            "sourceSystem": {
                "id": "0404601d-a9c0-4ec7-bbcd-02660120d8c9",
                "displayName": "Azure Active Directory",
                "details": {}
            },
            "targetSystem": {
                "id": "cd22f60b-5f2d-1adg-adb4-76ef31db996b",
                "displayName": "Box",
                "details": {
                    "ApplicationId": "f2764360-e0ec-5676-711e-cd6fc0d4dd61",
                    "ServicePrincipalId": "chc46a42-966b-47d7-9774-576b1c8bd0b8",
                    "ServicePrincipalDisplayName": "Box"
                }
            },
            "initiatedBy": {
                "id": "",
                "displayName": "Azure AD Provisioning Service",
                "initiatorType": "system"
            },
            "sourceIdentity": {
                "id": "5e6c9rae-ab4d-5239-8ad0-174391d110eb",
                "displayName": "Self-service Pilot",
                "identityType": "Group",
                "details": {}
            },
            "targetIdentity": {
                "id": "",
                "displayName": "",
                "identityType": "Group",
                "details": {}
            },
            "statusInfo": {
                "@odata.type": "#microsoft.graph.statusDetails",
                "status": "failure",
                "errorCode": "BoxEntryConflict",
                "reason": "Message: Box returned an error response with the HTTP status code 409.  This response indicates that a user or a group already exisits with the same name. This can be avoided by identifying and removing the conflicting user from Box via the Box administrative user interface, or removing the current user from the scope of provisioning either by removing their assignment to the Box application in Azure Active Directory or adding a scoping filter to exclude the user.",
                "additionalDetails": null,
                "errorCategory": "NonServiceFailure",
                "recommendedAction": null
            },
            "provisioningSteps": [
                {
                    "name": "EntryImportAdd",
                    "provisioningStepType": "import",
                    "status": "success",
                    "description": "Received Group 'Self-service Pilot' change of type (Add) from Azure Active Directory",
                    "details": {}
                },
                {
                    "name": "EntrySynchronizationAdd",
                    "provisioningStepType": "matching",
                    "status": "success",
                    "description": "Group 'Self-service Pilot' will be created in Box (Group is active and assigned in Azure Active Directory, but no matching Group was found in Box)",
                    "details": {}
                },
                {
                    "name": "EntryExportAdd",
                    "provisioningStepType": "export",
                    "status": "failure",
                    "description": "Failed to create Group 'Self-service Pilot' in Box",
                    "details": {
                        "ReportableIdentifier": "Self-service Pilot"
                    }
                }
            ],
            "modifiedProperties": [
                {
                    "displayName": "objectId",
                    "oldValue": null,
                    "newValue": "5e0c9eae-ad3d-4139-5ad0-174391d110eb"
                },
                {
                    "displayName": "displayName",
                    "oldValue": null,
                    "newValue": "Self-service Pilot"
                },
                {
                    "displayName": "mailEnabled",
                    "oldValue": null,
                    "newValue": "False"
                },
                {
                    "displayName": "mailNickname",
                    "oldValue": null,
                    "newValue": "5ce25n9a-4c5f-45c9-8362-ef3da29c66c5"
                },
                {
                    "displayName": "securityEnabled",
                    "oldValue": null,
                    "newValue": "True"
                },
                {
                    "displayName": "Name",
                    "oldValue": null,
                    "newValue": "Self-service Pilot"
                }
            ]
       }
    ]
}

```
## Related articles

- [MS Graph documentation](https://docs.microsoft.com/graph/api/resources/synchronization-overview?view=graph-rest-beta)
- [Integrating a custom SCIM app with Azure AD](use-scim-to-provision-users-and-groups.md)
