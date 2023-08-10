---
title: Configure provisioning using Microsoft Graph APIs
description: Learn how to save time by using the Microsoft Graph APIs to automate the configuration of automatic provisioning.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: conceptual
ms.workload: identity
ms.date: 10/06/2022
ms.author: kenwith
ms.reviewer: arvinh
---

# Configure provisioning using Microsoft Graph APIs

The Azure portal is a convenient way to configure provisioning for individual apps one at a time. But if you're creating several—or even hundreds—of instances of an application, it can be easier to automate app creation and configuration with the Microsoft Graph APIs. This article outlines how to automate provisioning configuration through APIs. This method is commonly used for applications like [Amazon Web Services](../saas-apps/amazon-web-service-tutorial.md#configure-azure-ad-sso).

**Overview of steps for using Microsoft Graph APIs to automate provisioning configuration**


|Step  |Details  |
|---------|---------|
|[Step 1. Create the gallery application](#step-1-create-the-gallery-application)     |Sign-in to the API client <br> Retrieve the gallery application template <br> Create the gallery application         |
|[Step 2. Create provisioning job based on template](#step-2-create-the-provisioning-job-based-on-the-template)     |Retrieve the template for the provisioning connector <br> Create the provisioning job         |
|[Step 3. Authorize access](#step-3-authorize-access)     |Test the connection to the application <br> Save the credentials         |
|[Step 4. Start provisioning job](#step-4-start-the-provisioning-job)     |Start the job         |
|[Step 5. Monitor provisioning](#step-5-monitor-provisioning)     |Check the status of the provisioning job <br> Retrieve the provisioning logs         |

## Step 1: Create the gallery application

### Sign in to Microsoft Graph Explorer (recommended), Postman, or any other API client you use

1. Start [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
1. Select the "Sign-In with Microsoft" button and sign in using Azure AD global administrator or App Admin credentials.
1. Upon successful sign-in, you'll see the user account details in the left-hand pane.

### Retrieve the gallery application template identifier
Applications in the Azure AD application gallery each have an [application template](/graph/api/applicationtemplate-list?tabs=http&view=graph-rest-beta&preserve-view=true) that describes the metadata for that application. Using this template, you can create an instance of the application and service principal in your tenant for management. Retrieve the identifier of the application template for **AWS Single-Account Access** and from the response, record the value of the **id** property to use later in this tutorial.

#### Request

```msgraph-interactive
GET https://graph.microsoft.com/beta/applicationTemplates?$filter=displayName eq 'AWS Single-Account Access'
```
#### Response

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
        "displayName": "AWS Single-Account Access",
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
         "description": "Federate to a single AWS account and use SAML claims to authorize access to AWS IAM roles. If you have many AWS accounts, consider using the AWS Single Sign-On gallery application instead."    

}
```

### Create the gallery application

Use the template ID retrieved for your application in the last step to [create an instance](/graph/api/applicationtemplate-instantiate?tabs=http&view=graph-rest-beta&preserve-view=true) of the application and service principal in your tenant.

#### Request


```msgraph-interactive
POST https://graph.microsoft.com/beta/applicationTemplates/{id}/instantiate
Content-type: application/json

{
  "displayName": "AWS Contoso"
}
```

#### Response

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

## Step 2: Create the provisioning job based on the template

### Retrieve the template for the provisioning connector

Applications in the gallery that are enabled for provisioning have templates to streamline configuration. Use the request below to [retrieve the template for the provisioning configuration](/graph/api/synchronization-synchronizationtemplate-list?tabs=http&view=graph-rest-beta&preserve-view=true). Note that you will need to provide the ID. The ID refers to the preceding resource, which in this case is the servicePrincipal resource. 

#### Request

```msgraph-interactive
GET https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/templates
```

#### Response
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

### Create the provisioning job
To enable provisioning, you'll first need to [create a job](/graph/api/synchronization-synchronizationjob-post?tabs=http&view=graph-rest-beta&preserve-view=true). Use the following request to create a provisioning job. Use the templateId from the previous step when specifying the template to be used for the job.

#### Request

```msgraph-interactive
POST https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs
Content-type: application/json

{ 
    "templateId": "aws"
}
```

#### Response
```http
HTTP/1.1 201 OK
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

## Step 3: Authorize access

### Test the connection to the application

Test the connection with the third-party application. The following example is for an application that requires a client secret and secret token. Each application has its own requirements. Applications often use a base address in place of a client secret. To determine what credentials your app requires, go to the provisioning configuration page for your application, and in developer mode, click **test connection**. The network traffic will show the parameters used for credentials. For a full list of credentials, see [synchronizationJob: validateCredentials](/graph/api/synchronization-synchronizationjob-validatecredentials?tabs=http&view=graph-rest-beta&preserve-view=true). Most applications, such as Azure Databricks, rely on a BaseAddress and SecretToken. The BaseAddress is referred to as a tenant URL in the Azure portal. 

#### Request
```msgraph-interactive
POST https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs/{id}/validateCredentials

{ 
    "credentials": [ 
        { 
            "key": "ClientSecret", "value": "xxxxxxxxxxxxxxxxxxxxx" 
        },
        {
            "key": "SecretToken", "value": "xxxxxxxxxxxxxxxxxxxxx"
        }
    ]
}
```
#### Response
```http
HTTP/1.1 204 No Content
```

### Save your credentials

Configuring provisioning requires establishing a trust between Azure AD and the application. Authorize access to the third-party application. The following example is for an application that requires a client secret and a secret token. Each application has its own requirements. Review the [API documentation](/graph/api/synchronization-synchronizationjob-validatecredentials?tabs=http&view=graph-rest-beta&preserve-view=true) to see the available options. 

#### Request
```msgraph-interactive
PUT https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/secrets 

{ 
    "value": [ 
        { 
            "key": "ClientSecret", "value": "xxxxxxxxxxxxxxxxxxxxx"
        },
        {
            "key": "SecretToken", "value": "xxxxxxxxxxxxxxxxxxxxx"
        }
    ]
}
```

#### Response
```http
HTTP/1.1 204 No Content
```

## Step 4: Start the provisioning job
Now that the provisioning job is configured, use the following command to [start the job](/graph/api/synchronization-synchronizationjob-start?tabs=http&view=graph-rest-beta&preserve-view=true). 


#### Request

```http
POST https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs/{jobId}/start
```


#### Response
```http
HTTP/1.1 204 No Content
```


## Step 5: Monitor provisioning

### Monitor the provisioning job status

Now that the provisioning job is running, use the following command to track the progress of the current provisioning cycle as well as statistics to date such as the number of users and groups that have been created in the target system. 

#### Request
```msgraph-interactive
GET https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs/{jobId}/
```

#### Response
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


### Monitor provisioning events using the provisioning logs
In addition to monitoring the status of the provisioning job, you can use the [provisioning logs](/graph/api/provisioningobjectsummary-list?tabs=http&view=graph-rest-beta&preserve-view=true) to query for all the events that are occurring. For example, query for a particular user and determine if they were successfully provisioned.

#### Request
```msgraph-interactive
GET https://graph.microsoft.com/beta/auditLogs/provisioning
```
#### Response
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
                "displayName": "AWS Contoso",
                "details": {
                    "ApplicationId": "f2764360-e0ec-5676-711e-cd6fc0d4dd61",
                    "ServicePrincipalId": "chc46a42-966b-47d7-9774-576b1c8bd0b8",
                    "ServicePrincipalDisplayName": "AWS Contoso"
                }
            },
            "initiatedBy": {
                "id": "",
                "displayName": "Azure AD Provisioning Service",
                "initiatorType": "system"
            }
            ]
       }
    ]
}
```
## See also

- [Review the synchronization Microsoft Graph documentation](/graph/api/resources/synchronization-overview?view=graph-rest-beta&preserve-view=true)
- [Integrating a custom SCIM app with Azure AD](./use-scim-to-provision-users-and-groups.md)
