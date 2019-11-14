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

# Configure provisioning using Microsoft Graph APIs

Azure AD provides an interface for configuring provisioning. This can be easy to use for one or two applications, but in situations where you have to create 10, 20, 100+ instances of an application, it is often easier to automate application creation and configuration through APIs rather than the user interface. This document outlines how to automate configuring provisioning through APIs. This is most commonly used for applications such as [Amazon Web Services](https://docs.microsoft.com/azure/active-directory/saas-apps/amazon-web-service-tutorial#configure-azure-ad-single-sign-on) and [Azure Databricks]()

1.	Create gallery app
	* Retrieve the gallery application template
	* Create gallery application 
2.	Create provisioning job based on template
	* Retrieve the template for the provisioning connector
	* Create the provisioning job
3.	Authorize access
	* Test connection to the application
	* Save credentials
4.	Configure provisioning 
	* Set scope
	* Add custom attribute mappings
5. 	Start provisioning job
  	* Start job
6.	Monitor provisioning
	* Check the status of the provisioning job 
	* Retrieve the provisioning logs 
    

> [!NOTE]
> The response objects shown here may be shortened for readability. All the properties will be returned from an actual call.


## Step 1: Sign into Microsoft Graph Explorer (recommended), Postman, or any other API client you use

1. Launch [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)
1. Click on the "Sign-In with Microsoft" button and sign-in using Azure AD Global Admin or App Admin credentials.

    ![Graph Sign-in](./media/export-import-provisioning-mappings/wd_export_02.png)

1. Upon successful sign-in, you will see the user account details in the left-hand pane.



## Step 2: Get the gallery application template identifier
Applications in the Azure AD application gallery have an [application template](https://docs.microsoft.com/graph/api/applicationtemplate-list?view=graph-rest-beta&tabs=http) describing the metadata for that application. Using this template you can create an instance of the application and service principal in your tenant for management. 

##### Request

<!-- {
  "blockType": "request",
  "name": "get_applicationtemplates"
}-->

```msgraph-interactive
GET https://graph.microsoft.com/beta/applicationTemplates
```


##### Response

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
  	"id": "8b1025e4-1dd2-430b-a150-2ef79cd700f5",
        "displayName": "Amazon Web Services (AWS)",
        "homePageUrl": "http://aws.amazon.com/",
        "supportedSingleSignOnModes": [
             "password",
             "saml",
             "external"
         ],
         "supportedProvisioningTypes": [
             "sync"
         ],
         "logoUrl": "https://az495088.vo.msecnd.net/app-logo/aws_215.png",
         "categories": [
             "developerServices"
         ],
         "publisher": "Amazon",
         "description": null    
  
}
```

## Step 3: Create a gallery application

Use the template ID retrieved for your application in the last step to [create an instance](https://docs.microsoft.com/graph/api/applicationtemplate-instantiate?view=graph-rest-beta&tabs=http) of the application and service principal in your tenant. 

### Request

<!-- {
  "blockType": "request",
  "name": "applicationtemplate_instantiate"
}-->

```msgraph-interactive
POST https://graph.microsoft.com/beta/applicationTemplates/{id}/instantiate
Content-type: application/json

{
  "displayName": "AWS Contoso"
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
    "application": {
        "objectId": "cbc071a6-0fa5-4859-8g55-e983ef63df63",
        "appId": "92653dd4-aa3a-3323-80cf-e8cfefcc8d5d",
        "applicationTemplateId": "8b1025e4-1dd2-430b-a150-2ef79cd700f5",
        "displayName": "AWS Contoso",
        "homepage": "https://signin.aws.amazon.com/saml?metadata=aws|ISV9.1|primary|z",
        "replyUrls": [
            "https://signin.aws.amazon.com/saml"
        ],
        "logoutUrl": null,
        "samlMetadataUrl": null,
    },
    "servicePrincipal": {
        "objectId": "f47a6776-bca7-4f2e-bc6c-eec59d058e3e",
        "appDisplayName": "AWS Contoso",
        "applicationTemplateId": "8b1025e4-1dd2-430b-a150-2ef79cd700f5",
        "appRoleAssignmentRequired": true,
        "displayName": "My custom name",
        "homepage": "https://signin.aws.amazon.com/saml?metadata=aws|ISV9.1|primary|z",
        "replyUrls": [
            "https://signin.aws.amazon.com/saml"
        ],
        "servicePrincipalNames": [
            "93653dd4-aa3a-4323-80cf-e8cfefcc8d7d"
        ],
        "tags": [
            "WindowsAzureActiveDirectoryIntegratedApp"
        ],
    }
}
```

## Step 4: Get provisioning templateId
Applications in the gallery that are enabled for provisioning have templates to streamline configuration. Use the request below to [retrieve the template for the provisioning configuration](https://docs.microsoft.com/graph/api/synchronization-synchronizationtemplate-list?view=graph-rest-beta&tabs=http). 

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
            "id": "aws",
            "factoryTag": "aws",
            "schema": {
                    "directories": [],
                    "synchronizationRules": []
                    }
        }
    ]
}
```

## Step 5: Create job
Enabling provisioning requires that a [job be created](https://docs.microsoft.com/graph/api/synchronization-synchronizationjob-post?view=graph-rest-beta&tabs=http). Use the request below to create a provisioning job. Use the templateId from the previous step to specify the template to be used for the job. 

##### Request
<!-- {
  "blockType": "request",
  "name": "create_synchronizationjob_from_synchronization"
}-->
```msgraph-interactive
POST https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs
Content-type: application/json

{ 
    "templateId": "aws"
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
    "templateId": "aws",
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

## Step 6: Validate credentials

Test the connection with the third-party application. The example below is for an application that requires clientSecret and secretToken. Each application has its on requirements. Review the [API documentation](https://docs.microsoft.com/graph/api/synchronization-synchronizationjob-validatecredentials?view=graph-rest-beta&tabs=http) to see the available options. 

##### Request
```http
POST https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs/{id}/validateCredentials
{ 
    credentials: [ 
        { key: "ClientSecret", value: "xxxxxxxxxxxxxxxxxxxxx" },
        { key: "SecretToken", value: "xxxxxxxxxxxxxxxxxxxxx" }
    ]
}
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

## Step 7: Save your credentials

Configuring provisioning requires establishing a trust between Azure AD and the application. Authorize access to the third-party application. The example below is for an application that requires clientSecret and secretToken. Each application has its on requirements. Review the [API documentation](https://docs.microsoft.com/graph/api/synchronization-synchronizationjob-validatecredentials?view=graph-rest-beta&tabs=http) to see the available options. 

##### Request
```json
PUT https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/secrets 
 
{ 
    value: [ 
        { key: "ClientSecret", value: "xxxxxxxxxxxxxxxxxxxxx" },
        { key: "SecretToken", value: "xxxxxxxxxxxxxxxxxxxxx" }
    ]
}
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

## Step 8: Set scope	

Set the scope for who will be provisioned to the application. Skip this step for Amazon Web Service as only role imports are supported. As a best practice, start by scoping to users assigned to the application and change that to all users and groups if needed.   

##### Request
```json	
https://graph.microsoft.com/beta/servicePrincipals/35b92148-dbe0-4b8e-9836-60512ec4643d/Credentials	
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
```

##### Response



## Step 9: Add a custom attribute to your attribute mappings (optional)
The application template provides the default attributes required to set up provisioning to the application. If you need to add an additional attribute mapping to your configuration, use the steps below. This is not a required or recommended step. 

#### Get the synchronization schema
The following example shows how to get the synchronization schema.

##### Request
```msgraph-interactive
GET https://graph.microsoft.com/beta/servicePrincipals/{servicePrincipalId}/synchronization/jobs/{jobId}/schema
Authorization: Bearer {Token}
```

##### Response
<!-- {
  "blockType": "response",
  "truncated": true,
  "@odata.type": "microsoft.graph.synchronizationSchema"
} -->
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "directories": [
	    {
		      "id": "66e4a8cc-1b7b-435e-95f8-f06cea133828",
		      "name": "Azure Active Directory",
		      "objects": [
			    {
		            "attributes": [
			            {
			              "anchor": true,
			              "caseExact": false,
			              "defaultValue": null,
			              "metadata": [],
			              "multivalued": false,
			              "mutability": "ReadWrite",
			              "name": "objectId",
			              "required": false,
			              "referencedObjects": [],
			              "type": "String"
			            },
			            {
			              "anchor": false,
			              "caseExact": false,
			              "defaultValue": null,
			              "metadata": [],
			              "multivalued": false,
			              "mutability": "ReadWrite",
			              "name": "streetAddress",
			              "required": false,
			              "referencedObjects": [],
			              "type": "String"
			            }
					],
					"name": "User"
				}
			 ]
		},
		{
		      "id": "8ffa6169-f354-4751-9b77-9c00765be92d",
		      "name": "salesforce.com",
		      "objects": []
		}
  ],
 "synchronizationRules": [
	    {
	      "editable": true,
	      "id": "4c5ecfa1-a072-4460-b1c3-4adde3479854",
	      "name": "USER_OUTBOUND_USER",
	      "objectMappings": [
		        {
			        "attributeMappings": [
				            {
				              "defaultValue": "True",
				              "exportMissingReferences": false,
				              "flowBehavior": "FlowWhenChanged",
				              "flowType": "Always",
				              "matchingPriority": 0,
				              "source": {
				                "expression": "Not([IsSoftDeleted])",
				                "name": "Not",
				                "parameters": [
				                  {
				                    "key": "source",
				                    "value": {
				                      "expression": "[IsSoftDeleted]",
				                      "name": "IsSoftDeleted",
				                      "parameters": [],
				                      "type": "Attribute"
				                    }
				                  }
				                ],
				                "type": "Function"
				              },
				              "targetAttributeName": "IsActive"
				            }
			         ],
			        "enabled": true,
			        "flowTypes": "Add, Update, Delete",
			        "name": "Synchronize Azure Active Directory Users to salesforce.com",
			        "scope": null,
			        "sourceObjectName": "User",
			        "targetObjectName": "User"
			}]
		}]
}
```

#### Add a definition for the officeCode attribute and a mapping between attributes

Use a plain text editor of your choice (for example, [Notepad++](https://notepad-plus-plus.org/) or [JSON Editor Online](https://www.jsoneditoronline.org/)) to:

1. Add an [attribute definition](synchronization-attributedefinition.md) for the `officeCode` attribute. 

	- Under directories, find the directory with the name salesforce.com, and in the object's array, find the one named **User**.
	- Add the new attribute to the list, specifying the name and type, as shown in the following example.

2. Add an [attribute mapping](synchronization-attributemapping.md) between `officeCode` and `extensionAttribute10`.

	- Under [synchronizationRules](synchronization-synchronizationrule.md), find the rule that specifies Azure AD as the source directory, and Salesforce.com as the target directory (`"sourceDirectoryName": "Azure Active Directory",   "targetDirectoryName": "salesforce.com"`).
	- In the [objectMappings](synchronization-objectmapping.md) of the rule, find the mapping between users (`"sourceObjectName": "User",   "targetObjectName": "User"`).
	- In the [attributeMappings](synchronization-attributemapping.md) array of the **objectMapping**, add a new entry, as shown in the following example.

```json
{  
    "directories": [
    {
        "id": "8ffa6169-f354-4751-9b77-9c00765be92d",
            "name": "salesforce.com",
            "objects": [
            {
                "attributes": [
                        {
                            "name": "officeCode",
                            "type": "String"
                        }
                ],
                "name":"User"
            }]
    }
    ],
    "synchronizationRules": [
        {
        "editable": true,
        "id": "4c5ecfa1-a072-4460-b1c3-4adde3479854",
        "name": "USER_OUTBOUND_USER",
        "objectMappings": [
            {
            "attributeMappings": [
            	{
                    "source": {
							"name": "extensionAttribute10",
							"type": "Attribute"
                    	},
                    "targetAttributeName": "officeCode"
                }
            ],
            "name": "Synchronize Azure Active Directory Users to salesforce.com",
            "scope": null,
            "sourceObjectName": "User",
            "targetObjectName": "User"
            }
        ],
    "priority": 1,
        "sourceDirectoryName": "Azure Active Directory",
        "targetDirectoryName": "salesforce.com"
    }
	]
}
```

#### Save the modified synchronization schema

When you save the updated synchronization schema, make sure that you include the entire schema, including the unmodified parts. This request will replace the existing schema with the one that you provide.

##### Request
```http
PUT https://graph.microsoft.com/beta/servicePrincipals/{servicePrincipalId}/synchronization/jobs/{jobId}/schema
{
    "directories": [..],
    "synchronizationRules": [..]
}
```

##### Response
```http
HTTP/1.1 201 No Content
```


## Step 10: Start the provisioning job
Now that the provisioning job is configured, use the following command to [start the job](https://docs.microsoft.com/graph/api/synchronization-synchronizationjob-start?view=graph-rest-beta&tabs=http). 


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


## Step 11: Monitor the provisioning job status

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
    "templateId": "aws",
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


## Step 12: Monitor provisioning events using the provisioning logs
In addition to monitoring the status of the provisioning job, you can use the [provisioning logs](https://docs.microsoft.com/graph/api/provisioningobjectsummary-list?view=graph-rest-beta&tabs=http) to query for all the events that are occurring (e.g. query for a particular user and determine if they were successfully provisioned).

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

- [Review the synchronization Microsoft Graph documentation](https://docs.microsoft.com/graph/api/resources/synchronization-overview?view=graph-rest-beta)
- [Integrating a custom SCIM app with Azure AD](use-scim-to-provision-users-and-groups.md)
