---
title: OnAttributeCollectionStart event
description: Learn about how you can create a custom authentication extension in the authentication flow for your customer-facing application using the OnAttributeCollectionStart event.
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

# Before attribute collection custom extension: OnAttributeCollectionStart

Self-service sign-up user flows can now take advantage of custom extensions in order to provide validation and augmentation capabilities. Custom extensions allow you to perform validation on attributes collected from the user during sign-up, along with showing the user a blocked or validation error page if needed. There are two events enabled: OnAttributeCollectionStart and OnAttributeCollectionSubmit.  

## OnAttributeCollectionStart

**OnAttributeCollectionStart** is fired at the beginning of the attribute collection process and can be used to prevent the user from signing up (for example, based on the domain they're authenticating from) or modify the initial attributes to be collected (for example, collect attributes based on the user’s identity provider).

### Request 

`POST https://exampleAzureFunction.azureWebsites.net/api/functionName`

```json
{ 
  "type": "microsoft.graph.authenticationEvent.attributeCollectionStart", 
  "source": "/tenants/{tenantId}/applications/{resourceAppId}", 
  "data": { 
    "@odata.type": "microsoft.graph.onAttributeCollectionStartCalloutData", 
    "tenantId": "30000000-0000-0000-0000-000000000003", 
    "authenticationEventListenerId": "10000000-0000-0000-0000-000000000001", 
    "customAuthenticationExtensionId": "10000000-0000-0000-0000-000000000002", 
    "authenticationContext": { 
      /*Note: The User has not been created at the point of this extension firing, which means that User 	object and Roles will not be present in the request.*/ 
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
    "@odata.type": "microsoft.graph.onAttributeCollectionStartResponseData", 
    "actions": [ 
      { 
        "@odata.type": "microsoft.graph.attributeCollectionStart.continueWithDefaultBehavior" 
      } 
    ] 
  } 
} 
``` 

### Response Actions 

The API response must include a responseAction element. The available actions are: 

#### ContinueWithDefaultBehavior 

This action specifies that the API is returning a continuation response. 

```json
{ 
  "data": { 
    "@odata.type": "microsoft.graph.onAttributeCollectionStartResponseData", 
    "actions": [ 
      { 
        "@odata.type": "microsoft.graph.attributeCollectionStart.continueWithDefaultBehavior" 
      } 
    ] 
  } 
} 
```

#### SetPrefillValues 

This action specifies that the API returns a response to populate attributes with default values.  

```json
{ 
  "data": { 
    "@odata.type": "microsoft.graph.onAttributeCollectionStartResponseData", 
    "actions": [ 
      { 
        "@odata.type": "microsoft.graph.attributeCollectionStart.setPrefillValues", 
        "inputs": { 
          "key1": ["value1", "false", "false"], 
          "key2": true 
        } 
      } 
    ] 
  } 
} 

```

#### showBlockPage 

This action specifies that the API is returning a blocking response for the below cases: User approval is pending. 

```json
{ 
  "data": { 
    "@odata.type": "microsoft.graph.onAttributeCollectionStartResponseData", 
    "actions": [ 
      { 
        "@odata.type": "microsoft.graph.attributeCollectionStart.showBlockPage", 
        "message": "Your access request is already processing. You'll be notified when your request has been approved." 
      } 
    ] 
  } 
} 
``` 
 
The response action must be only 1, otherwise an error is thrown.

## Next steps 

See also [OnAttributeCollectionSubmit](how-to-onattributecollectionsubmit.md)
