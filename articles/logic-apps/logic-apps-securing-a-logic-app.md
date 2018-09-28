---
title: Secure access to Azure Logic Apps | Microsoft Docs
description: Protect access to triggers, inputs and outputs, action parameters, and services in workflows for Azure Logic Apps
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

Here are ways that you can secure access to different components in your logic app:

* Secure access for triggering a logic app workflow with the HTTP request trigger.
* Secure access for managing, editing, or reading a logic app.
* Secure access to the contents inside inputs and outputs for a logic app run.
* Secure parameters or inputs for actions in a logic app workflow.
* Secure access to services that receive requests from a logic app workflow.

## Secure access to trigger

When you work with a logic app that fires on an HTTP Request 
([Request](../connectors/connectors-native-reqres.md) 
or [Webhook](../connectors/connectors-native-webhook.md)), 
you can restrict access so that only authorized clients can fire the logic app. 
All requests into a logic app are encrypted and secured via SSL.

### Shared Access Signature

Every request endpoint for a logic app includes a 
[Shared Access Signature (SAS)](../storage/common/storage-dotnet-shared-access-signature-part-1.md) 
as part of the URL. Each URL contains a `sp`, `sv`, and `sig` query parameter. 
Permissions are specified by `sp`, 
and correspond to HTTP methods allowed, 
`sv` is the version used to generate, 
and `sig` is used to authenticate access to trigger. 
The signature is generated using the SHA256 algorithm with 
a secret key on all the URL paths and properties. 
The secret key is never exposed and published, 
and is kept encrypted and stored as part of the logic app. 
Your logic app only authorizes triggers that contain a valid signature created with the secret key.

#### Regenerate access keys

You can regenerate a new secure key at anytime through the REST API or Azure portal. 
All current URLs that were generated previously using the old key are invalidated 
and no longer authorized to fire the logic app.

1. In the Azure portal, open the logic app you want to regenerate a key
1. Click the **Access Keys** menu item under **Settings**
1. Choose the key to regenerate and complete the process

URLs you retrieve after regeneration are signed with the new access key.

#### Creating callback URLs with an expiration date

If you are sharing the URL with other parties, 
you can generate URLs with specific keys and expiration dates as needed. 
You can then seamlessly roll keys, or ensure access to fire an app 
is restricted to a certain timespan. You can specify an expiration date for a URL through the 
[logic apps REST API](https://docs.microsoft.com/rest/api/logic/workflowtriggers):

``` http
POST 
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Logic/workflows/{workflowName}/triggers/{triggerName}/listCallbackUrl?api-version=2016-06-01
```

In the body, include the property `NotAfter` as a JSON date string, which returns a callback URL that is only valid until the `NotAfter` date and time.

#### Creating URLs with primary or secondary secret key

When you generate or list callback URLs for request-based triggers, you can also specify which key to use to sign the URL.  You can generate a URL signed by a specific key through the [logic apps REST API](https://docs.microsoft.com/rest/api/logic/workflowtriggers) as follows:

``` http
POST 
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Logic/workflows/{workflowName}/triggers/{triggerName}/listCallbackUrl?api-version=2016-06-01
```

In the body, include the property `KeyType` as either `Primary` or `Secondary`.  This returns a URL signed by the secure key specified.

### Restrict incoming IP addresses

In addition to the Shared Access Signature, you may wish to restrict calling a logic app only from specific clients.  For example, if you manage your endpoint through Azure API Management, you can restrict the logic app to only accept the request when the request comes from the API Management instance IP address.

This setting can be configured within the logic app settings:

1. In the Azure portal, open the logic app you want to add IP address restrictions
1. Click the **Workflow Settings** menu item under **Settings**
1. Specify the list of IP address ranges to be accepted by the trigger

A valid IP range takes the format `192.168.1.1/32`. 
If you want the logic app to only fire as a nested logic app, 
select the **Only other logic apps** option. 
This option writes an empty array to the resource, 
meaning only calls from the service itself (parent logic apps) fire successfully.

> [!NOTE]
> You can still run a logic app with a request trigger 
> through the REST API / Management `/triggers/{triggerName}/run` regardless of IP. 
> This scenario requires authentication against the Azure REST API, 
> and all events would appear in the Azure Audit Log. 
> Set access control policies accordingly.

#### Setting IP ranges on the resource definition

If you are using a [deployment template](logic-apps-create-deploy-template.md) to automate your deployments, the IP range settings can be configured on the resource template.  

``` json
{
    "properties": {
        "definition": {
        },
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
    "type": "Microsoft.Logic/workflows"
}

```

### Adding Azure Active Directory, OAuth, or other security

To add more authorization protocols on top of a logic app, 
[Azure API Management](https://azure.microsoft.com/services/api-management/) 
offers rich monitoring, security, policy, and documentation for any endpoint 
with the capability to expose a logic app as an API. 
Azure API Management can expose a public or private endpoint for the logic app, 
which could use Azure Active Directory, certificate, OAuth, or other security standards. 
When a request is received, Azure API Management forwards the request to the logic app 
(performing any needed transformations or restrictions in-flight). 
You can use the incoming IP range settings on the logic app to only allow the logic app 
to be triggered from API Management.

## Secure access to manage or edit logic apps

You can restrict access to management operations on a logic app so that only specific users or groups are able to perform operations on the resource. 
Logic apps use the Azure [Role-Based Access Control (RBAC)](../role-based-access-control/role-assignments-portal.md) feature, and can be customized with the same tools.  There are a few built-in roles you can assign members of your subscription to as well:

* **Logic App Contributor** - Provides access to view, edit, and update a logic app.  Cannot remove the resource or perform admin operations.
* **Logic App Operator** - Can view the logic app and run history, and enable/disable.  Cannot edit or update the definition.

You can also use [Azure Resource Lock](../azure-resource-manager/resource-group-lock-resources.md) 
to prevent changing or deleting logic apps. 
This capability is valuable to prevent production resources from changes or deletions.

## Secure access to contents of the run history

You can restrict access to contents of inputs or outputs from previous runs to specific IP address ranges.  

All data within a workflow run is encrypted in transit and at rest. 
When a call to run history is made, the service authenticates the request 
and provides links to the request and response inputs and outputs. 
This link can be protected so only requests to view content 
from a designated IP address range return the contents. 
You can use this capability for additional access control. 
You could even specify an IP address like `0.0.0.0` so no one could access inputs/outputs. 
Only someone with admin permissions could remove this restriction, 
providing the possibility for 'just-in-time' access to workflow contents.

This setting can be configured within the resource settings of the Azure portal:

1. In the Azure portal, open the logic app you want to add IP address restrictions
2. Click the **Access control configuration** menu item under **Settings**
3. Specify the list of IP address ranges for access to content

#### Setting IP ranges on the resource definition

If you are using a [deployment template](logic-apps-create-deploy-template.md) to automate your deployments, 
the IP range settings can be configured on the resource template.  

``` json
{
    "properties": {
        "definition": {
        },
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
    "type": "Microsoft.Logic/workflows"
}
```

## Secure parameters and inputs within a workflow

You might want to parameterize some aspects of a workflow definition for deployment across environments. 
Also, some parameters might be secure parameters you don't want to appear when editing a workflow, 
such as a client ID and client secret for 
[Azure Active Directory authentication](../connectors/connectors-native-http.md#authentication) of an HTTP action.

### Using parameters and secure parameters

To access the value of a resource parameter at runtime, 
the [workflow definition language](http://aka.ms/logicappsdocs) provides a `@parameters()` operation. 
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

### Using authentication on outbound requests

When working with an HTTP, HTTP + Swagger (Open API), or Webhook action, 
you can add authentication to the request being sent. 
You could include basic authentication, certificate authentication, or Azure Active Directory authentication. 
Details on how to configure this authentication can be found 
[in this article](../connectors/connectors-native-http.md#authentication).

### Restricting access to logic app IP addresses

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
[Create a deployment template](logic-apps-create-deploy-template.md)  
[Exception handling](logic-apps-exception-handling.md)  
[Monitor your logic apps](logic-apps-monitor-your-logic-apps.md)  
[Diagnosing logic app failures and issues](logic-apps-diagnosing-failures.md)  
