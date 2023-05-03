---
title: OnAttributeCollectionSubmit event
description: Learn about how you can create a custom authentication extension in the authentication flow for your customer-facing application using the OnAttributeCollectionSubmit event.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date: 04/30/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to know what information I can collect from customers during sign-up, and how I can customize and extend how I collect information.
---

# Post-attribute collection custom extension: OnAttributeCollectionSubmit

Self-service sign-up user flows can now take advantage of custom extensions in order to provide validation and augmentation capabilities.

Custom extensions allow you to perform validation on attributes collected from the user during sign-up, along with showing the user a blocked or validation error page if needed. There are two events enabled: OnAttributeCollectionStart and OnAttributeCollectionSubmit.  

## OnAttributeCollectionSubmit

OnAttributeCollectionSubmit is fired after the user provides attribute information during signing up and can be used to validate the information provided by the user (such as an invitation code or partner number), modify the collected attributes (such as address validation), and either allow the user to continue in the journey or show a validation or block page. 

### Request 

`POST https://exampleAzureFunction.azureWebsites.net/api/functionName`

```json
{ 
  "type": "microsoft.graph.authenticationEvent.attributeCollectionSubmit", 
  "source": "/tenants/{tenantId}/applications/{resourceAppId}", 
  "data": { 
    "@odata.type": "microsoft.graph.onAttributeCollectionSubmitCalloutData", 
    "tenantId": "30000000-0000-0000-0000-000000000003", 
    "authenticationEventListenerId": "10000000-0000-0000-0000-000000000001", 
    "customAuthenticationExtensionId": "10000000-0000-0000-0000-000000000002", 
    "authenticationContext": { 
      //... 
    }, 
    "userSignUpInfo": { 
      "attributes": { 
        "givenName": { 
          "@odata.type": "graph.stringDirectoryAttributeValue", 
          "value": "Larissa Price", 
          "attributeType": "builtIn" 
        }, 
        "companyName": { 
          "@odata.type": "graph.stringDirectoryAttributeValue", 
          "value": "Contoso University", 
          "attributeType": "builtIn" 
        }, 
        "extension_<appid>_universityGroups": { 
          "@odata.Type": "graph.stringCollectionDirectoryAttributeValue", 
          "value": ["Alumni", "Faculty"], 
          "attributeType": "directorySchemaExtension" 
        }, 
        "extension_<appid>_graduationYear": { 
          "@odata.type": "graph.int64DirectoryAttributeValue", 
          "value": 2010, 
          "attributeType": "directorySchemaExtension" 
        }, 
        "extension_<appid>_onMailingList": { 
          "@odata.type": "graph.booleanDirectoryAttributeValue", 
          "value": false, 
          "attributeType": "directorySchemaExtension" 
        } 
      } 
    } 
  } 
} 
``` 

### Response 

`HTTP/1.1 200 OK`

```json
{ 
  "data": { 
    "@odata.type": "microsoft.graph.onAttributeCollectionSubmitResponseData", 
    "actions": [ 
      { 
        "@odata.type": "microsoft.graph.attributeCollectionSubmit.continueWithDefaultBehavior" 
      } 
    ] 
  } 
} 
```

### Response Actions 

The API response must include a responseAction element as described below. The available actions are: 

#### ContinueWithDefaultBehavior 

```json
{ 
  "data": { 
    "@odata.type": "microsoft.graph.onAttributeCollectionSubmitResponseData", 
    "actions": [ 
      { 
        "@odata.type": "microsoft.graph.attributeCollectionSubmit.continueWithDefaultBehavior" 
      } 
    ] 
  } 
} 
``` 

#### modifyAttributeValues 

This action specifies that the API returns a response to modify and override attributes with default values after the attributes are collected. 

```json
{ 
  "data": { 
    "@odata.type": "microsoft.graph.onAttributeCollectionSubmitResponseData", 
    "actions": [ 
      { 
        "@odata.type": "microsoft.graph.attributeCollectionSubmit.modifyAttributeValues", 
        "attributes": { 
          "key1": ["value1", "false", "false"], 
          "key2": true 
        } 
      } 
    ] 
  } 
} 
``` 
 
#### showBlockPage 

This action specifies that the API is returning a blocking response for the below cases: User approval is pending. The user was denied and shouldn't be allowed to request approval again. 

```json
{ 
  "data": { 
    "@odata.type": "microsoft.graph.onAttributeCollectionSubmitResponseData", 
    "actions": [ 
      { 
        "@odata.type": "microsoft.graph.attributeCollectionSubmit.showBlockPage", 
        "message": "Your access request is already processing. You'll be notified when your request has been approved." 
      } 
    ] 
  } 
} 
```
 

#### showValidationError 

This action specifies that the API is returning a validation Error and an appropriate message and status code. 

```json
{
  "data": {
    "@odata.type": "microsoft.graph.onAttributeCollectionSubmitResponseData",
    "actions": [
      {
        "@odata.type": "microsoft.graph.ShowValidationError",
        "message": "Please fix the following errors to proceed",
        "attributeErrors": [
          {
            "name": "city",
            "value": "Length of city should be of at least 5 characters"
          },
          {
            "name": "streetAddress",
            "value": "Length of streetAddress should be of at least 5 characters"
          },
          {
            "name": "postalCode",
            "value": "PostalCode should be of at least 5 characters"
          }
        ]
      }
    ]
  }
} 
```
 
The response action must be only 1 otherwise an error will be thrown. Multiple attribute errors can be included in the response action. 

## Next steps

See also [OnAttributeCollectionStart](how-to-onattributecollectionstart.md)
