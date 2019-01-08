---
title: Secure access to Azure Logic Apps | Microsoft Docs
description: Add security for logic app elements, such as triggers, inputs and outputs, parameters, and services for Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: kevinlam1
ms.author: klam
ms.reviewer: estfan, LADocs
ms.assetid: 9fab1050-cfbc-4a8b-b1b3-5531bee92856
ms.topic: article
ms.date: 11/22/2016
---

# Secure access in Azure Logic Apps

Here are the elements in your logic app where you can secure access:

* Secure access to the Request or Webhook trigger when used to run your logic app workflow.
* Secure access for managing, editing, or reading a logic app.
* Secure access to the content passed as inputs and outputs in a logic app run.
* Secure parameters or inputs for actions in a logic app workflow.
* Secure access to services that receive requests from a logic app workflow.

## Secure access to request triggers

When your logic app uses an HTTP request-based trigger, 
such as the [Request](../connectors/connectors-native-reqres.md) 
or [Webhook](../connectors/connectors-native-webhook.md) trigger, 
you can restrict access so only authorized clients can start 
your logic app. All requests received by a logic app are 
encrypted and secured with Secure Sockets Layer (SSL) protocol. 
Here are different ways you can secure access to this trigger type:

* [Shared Access Signature](#sas)
* [Restrict incoming IP addresses](#restrict-incoming-IP)
* [Add Azure Active Directory, OAuth, or other security](#add-authentication)

### Shared Access Signature

Every request endpoint on a logic app includes a 
[Shared Access Signature (SAS)](../storage/common/storage-dotnet-shared-access-signature-part-1.md) 
in the endpoint's URL. Each URL contains an `sp`, `sv`, and `sig` query parameter:

* `sp` specifies permissions, which map to the HTTP methods permitted for use.
* `sv` specifies the version used for generating the signature.
* `sig` is used for authenticating access to the trigger.

The signature is generated using the SHA256 algorithm with 
a secret key on all the URL paths and properties. 
The secret key is never exposed or published, 
and is kept encrypted and stored with the logic app. 
Your logic app authorizes only those triggers that 
contain a valid signature created with the secret key.

#### Regenerate access keys

You can regenerate a new secure key at anytime by using the Azure REST API or Azure portal. 
All existing URLs that were previously generated with the old key are invalidated 
and are no longer authorized to fire the logic app. The URLs you retrieve after 
regeneration are signed with the new access key.

1. In the Azure portal, open the logic app where you want to regenerate a key.

1. Under **Settings**, select **Access Keys**.

1. Select the key you want to regenerate and complete the process.

#### Create callback URLs with expiration dates

If you share the endpoint's URL with other parties, you can generate 
callback URLs with specific keys and expiration dates as necessary. 
You can then seamlessly roll keys, or restrict access for triggering 
a logic app to a specific timespan. You can specify an expiration date 
for a URL by using the [Logic Apps REST API](https://docs.microsoft.com/rest/api/logic/workflowtriggers), 
for example:

``` http
POST 
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Logic/workflows/{workflowName}/triggers/{triggerName}/listCallbackUrl?api-version=2016-06-01
```

In the body, include the `NotAfter`property using a JSON date string. 
This property returns a callback URL that's valid only until the `NotAfter` date and time.

#### Create URLs with primary or secondary secret key

When you generate or list callback URLs for request-based triggers, 
you can also specify the key to use for signing the URL. 
You can generate a URL that's signed by a specific key 
by using the [Logic Apps REST API](https://docs.microsoft.com/rest/api/logic/workflowtriggers), 
for example:

``` http
POST 
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Logic/workflows/{workflowName}/triggers/{triggerName}/listCallbackUrl?api-version=2016-06-01
```

In the body, include the `KeyType` property as either `Primary` or `Secondary`. 
This property returns a URL that's signed by the specified secure key.

### Restrict incoming IP addresses

Along with Shared Access Signature, you might want to 
limit specific clients that can call your logic app.  
For example, if you manage your request endpoint 
with Azure API Management, you can restrict your 
logic app to accept requests only from the API 
Management instance's IP address. To set up 
this restriction, go to your logic app's settings: 

1. In the Azure portal, open your logic app in the Logic App Designer. 

1. On your logic app's menu, under **Settings**, select **Workflow settings**.

1. Under **Access control configuration** > 
**Allowed inbound IP addresses**, select **Specific IP ranges**.

1. Under **IP ranges for triggers**, specify the IP 
address ranges that the trigger accepts. 
A valid IP range uses these formats: *x.x.x.x/x* or *x.x.x.x-x.x.x.x* 

If you want your logic app to fire only as a nested logic app, 
from the **Allowed inbound IP addresses** list, 
select **Only other Logic Apps**. 
This option writes an empty array to your logic app resource, 
so only calls from the Logic Apps service (parent logic apps) 
can trigger the nested logic app.

> [!NOTE]
> Regardless of IP address, you can still run 
> a logic app that has a request-based trigger 
> by using `/triggers/{triggerName}/run` through 
> the Azure REST API or through API Management. However, 
> this scenario still requires authentication against 
> the Azure REST API, and all events appear in the Azure 
> Audit Log. Make sure you set access control policies accordingly.

#### Set IP ranges in logic app definition

If you're automating deployments by using a 
[deployment template](logic-apps-create-deploy-template.md), 
you can set the IP ranges in the resource template, for example:

``` json
{
   "properties": {
      "definition": {},
      "parameters": {},
      "accessControl": {
         "triggers": {
            "allowedCallerIpAddresses": [
               {
               "addressRange": "192.168.12.0/23"
               },
               {
                  "addressRange": "2001:0db8::/64"
               }
            ]
         }
      }
   },
   "type": "Microsoft.Logic/workflows",
}
```

### Add Azure Active Directory, OAuth, or other security

To add more authorization protocols to your logic app, 
consider using [Azure API Management](https://azure.microsoft.com/services/api-management/). 
This service offers rich monitoring, security, policy, and documentation for 
any endpoint and gives you the capability to expose your logic app as an API. 
API Management can expose a public or private endpoint for your logic app, 
which can then use Azure Active Directory, OAuth, certificate, or other 
security standards. When API Management receives a request, the service 
sends the request to your logic app, also making any necessary transformations 
or restrictions along the way. To let only API Management trigger 
your logic app, you can use your logic app's incoming IP range settings. 

## Secure access for editing or managing logic apps

To let only specific users or groups run operations on your logic app, 
you can restrict access on management operations. Logic Apps supports 
[Azure Role-Based Access Control (RBAC)](../role-based-access-control/role-assignments-portal.md), 
which you can customize or assign built-in roles to members in 
your subscription, for example:

* **Logic App Contributor**: Users can view, edit, and update your logic app. 
This role can't delete the logic app or run administrator operations.
* **Logic App Operator**: Users can view your logic app and the run history, 
and enable or disable your logic app. This role can't edit or update your logic app.

To prevent others from changing or deleting your logic app, you can use 
[Azure Resource Lock](../azure-resource-manager/resource-group-lock-resources.md). 
This capability helps you prevent others from changing or deleting production resources.

## Secure access to logic app run history

To protect content passed as inputs or outputs from previous logic app runs, 
you can restrict access to specific IP address ranges. This capability offers 
you more access control. All data in a logic app's run is encrypted during 
transit and at rest. When you request a logic app's run history, Logic Apps 
authenticates that request and provides links to the inputs and outputs from 
the requests and responses in your logic app's workflow. You can protect these 
links so only requests from a specific IP address return that content. 
For example, you might even specify an IP address such as 
`0.0.0.0-0.0.0.0` so no one can access the inputs and outputs. 
Only a person with administrator permissions can remove this restriction, 
providing the possibility for "just-in-time" access to your logic app's contents.

To set up this restriction, go to your logic app's settings in the Azure portal:

1. In the Azure portal, open your logic app in the Logic App Designer. 

1. On your logic app's menu, under **Settings**, select **Workflow settings**.

1. Under **Access control configuration** > 
**Allowed inbound IP addresses**, select **Specific IP ranges**.

1. Under **IP ranges for contents**, specify the IP 
address ranges that can access content from inputs and outputs. 
A valid IP range uses these formats: *x.x.x.x/x* or *x.x.x.x-x.x.x.x* 

#### Set IP ranges in logic app definition

If you're automating deployments by using a 
[deployment template](logic-apps-create-deploy-template.md), 
you can set the IP ranges in the resource template, for example:

``` json
{
   "properties": {
      "definition": {},
      "parameters": {},
      "accessControl": {
         "contents": {
            "allowedCallerIpAddresses": [
               {
               "addressRange": "192.168.12.0/23"
               },
               {
                  "addressRange": "2001:0db8::/64"
               }
            ]
         }
      }
   },
   "type": "Microsoft.Logic/workflows",
}
```

## Secure parameters and inputs in a workflow

You might want to parameterize some aspects of a workflow definition for deployment across environments. 
Also, some parameters might be secure parameters you don't want to appear when editing a workflow, 
such as a client ID and client secret for 
[Azure Active Directory authentication](../connectors/connectors-native-http.md#authentication) of an HTTP action.

### Using parameters and secure parameters

To access the value of a resource parameter at runtime, 
the [workflow definition language](https://aka.ms/logicappsdocs) provides a `@parameters()` operation. 
Also, you can [specify parameters in the resource deployment template](../azure-resource-manager/resource-group-authoring-templates.md#parameters). 
But if you specify the parameter type as `securestring`, the parameter won't be returned with the rest of the resource definition, 
and won't be accessible by viewing the resource after deployment.

> [!NOTE]
> If your parameter is used in the headers or body of a request, 
> the parameter might be visible by accessing the run history and outgoing HTTP request. 
> Make sure to set your content access policies accordingly.
> Authorization headers are never visible through inputs or outputs. 
> So if the secret is being used there, the secret is not retrievable.

#### Resource deployment template with secrets

The following example shows a deployment that references a secure parameter of `secret` at runtime. 
In a separate parameters file, you could specify the environment value for the `secret`, 
or use [Azure Resource Manager KeyVault](../azure-resource-manager/resource-manager-keyvault-parameter.md) 
to retrieve secrets at deploy time.

``` json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {
      "secretDeploymentParam": {
         "type": "securestring"
      }
   },
   "variables": {},
   "resources": [ {
      "name": "secret-deploy",
      "type": "Microsoft.Logic/workflows",
      "location": "westus",
      "tags": {
         "displayName": "LogicApp"
      },
      "apiVersion": "2016-06-01",
      "properties": {
         "definition": {
            "$schema": "https://schema.management.azure.com/schemas/2016-06-01/Microsoft.Logic.json",
            "actions": {
               "Call_External_API": {
                  "type": "Http",
                  "inputs": {
                     "headers": {
                        "Authorization": "@parameters('secret')"
                     },
                     "body": "This is the request"
                  },
                  "runAfter": {}
               }
            },
            "parameters": {
               "secret": {
                  "type": "SecureString"
               }
            },
            "triggers": {
               "manual": {
                  "type": "Request",
                  "kind": "Http",
                  "inputs": {
                     "schema": {}
                  }
               }
            },
            "contentVersion": "1.0.0.0",
            "outputs": {}
         },
         "parameters": {
            "secret": {
               "value": "[parameters('secretDeploymentParam')]"
            }
         }
      }
   } ],
   "outputs": {}
}
```

## Secure access to services receiving requests from a workflow

There are many ways to help secure any endpoint the logic app needs to access.

### Add authentication on outbound requests

When working with an HTTP, HTTP + Swagger (Open API), or Webhook action, 
you can add authentication to the request being sent. 
You could include basic authentication, certificate authentication, or Azure Active Directory authentication. 
Details on how to configure this authentication can be found 
[in this article](../connectors/connectors-native-http.md#authentication).

### Restrict access to logic app IP addresses

All calls from logic apps come from a specific set of IP addresses per region. 
You can add additional filtering to only accept requests from those designated IP addresses. 
For a list of those IP addresses, see [logic app limits and configuration](logic-apps-limits-and-config.md#configuration).

### On-premises connectivity

Logic apps provide integration with several services to provide secure and reliable on-premises communication.

#### On-premises data gateway

Many managed connectors for logic apps provide secure connectivity to on-premises systems, 
including File System, SQL, SharePoint, DB2, and more. 
The gateway relays data from on-premises sources 
on encrypted channels through the Azure Service Bus. 
All traffic originates as secure outbound traffic from the gateway agent. 
Learn more about [how the data gateway works](logic-apps-gateway-install.md#gateway-cloud-service).

#### Azure API Management

[Azure API Management](https://azure.microsoft.com/services/api-management/) 
has on-premises connectivity options, including site-to-site VPN and ExpressRoute integration for secured proxy and communication to on-premises systems. 
In the Logic App Designer, you can quickly select an API exposed from Azure API Management within a workflow, providing quick access to on-premises systems.

## Next steps

* [Create a deployment template](logic-apps-create-deploy-template.md)  
* [Exception handling](logic-apps-exception-handling.md)  
* [Monitor your logic apps](logic-apps-monitor-your-logic-apps.md)  
* [Diagnose logic app failures and issues](logic-apps-diagnosing-failures.md)  
