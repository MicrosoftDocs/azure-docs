---
title: Secure access to Azure Logic Apps
description: Add security for Azure Logic Apps, including triggers, inputs and outputs, parameters, and other services
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: kevinlam1
ms.author: klam
ms.reviewer: estfan, LADocs
ms.topic: article
ms.date: 02/05/2019
---

# Secure access in Azure Logic Apps

Here are the elements in your logic app where you can secure access:

* [Request or Webhook triggers](#secure-triggers)
* [Operations such as managing, editing, or viewing](#secure-operations) your logic app
* [Inputs and outputs](#secure-run-history) from your logic app's run history
* [Action parameters and inputs](#secure-action-parameters)
* [Services that get requests](#secure-requests) from your logic app

<a name="secure-triggers"></a>

## Secure access to request triggers

When your logic app uses an HTTP request-based trigger, 
such as the [Request](../connectors/connectors-native-reqres.md) 
or [Webhook](../connectors/connectors-native-webhook.md) trigger, 
you can restrict access so only authorized clients can start 
your logic app. All requests received by a logic app are 
encrypted and secured with Secure Sockets Layer (SSL) protocol. 
Here are different ways you can secure access to this trigger type:

* [Generate shared access signatures](#sas)
* [Restrict incoming IP addresses](#restrict-incoming-ip-addresses)
* [Add Azure Active Directory, OAuth, or other security](#add-authentication)

<a name="sas"></a>

### Generate shared access signatures

Every request endpoint on a logic app includes a 
[Shared Access Signature (SAS)](../storage/common/storage-dotnet-shared-access-signature-part-1.md) 
in the endpoint's URL. Each URL contains an `sp`, `sv`, and `sig` query parameter:

* `sp` specifies permissions, which map to the HTTP methods permitted for use.
* `sv` specifies the version used for generating the signature.
* `sig` is used for authenticating access to the trigger.

The signature is generated using the SHA256 algorithm with 
a secret access key on all the URL paths and properties. 
The secret key is never exposed or published, 
and is kept encrypted and stored with the logic app. 
Your logic app authorizes only those triggers that 
contain a valid signature created with the secret key. 

Here's more information about securing access with 
Shared Access Signature:

* [Regenerate access keys](#access-keys)
* [Create expiring callback URLs](#expiring-urls)
* [Create URLs with primary or secondary key](#primary-secondary-key)

<a name="access-keys"></a>

#### Regenerate access keys

To regenerate a new secure access key anytime, use the Azure REST API or Azure portal. 
All previously generated URLs that use the old key are invalidated and are no longer 
authorized to trigger the logic app. The URLs you retrieve after regeneration are 
signed with the new access key.

1. In the Azure portal, open the logic app that has the key you want to regenerate.

1. On the logic app's menu, under **Settings**, select **Access Keys**.

1. Select the key you want to regenerate and complete the process.

<a name="expiring-urls"></a>

#### Create callback URLs with expiration dates

If you share a request-based trigger endpoint's URL with other parties, you can 
generate callback URLs with specific keys and expiration dates as necessary. 
You can then seamlessly roll keys, or restrict access for triggering 
your logic app to a specific timespan. You can specify an expiration date 
for a URL by using the [Logic Apps REST API](https://docs.microsoft.com/rest/api/logic/workflowtriggers), 
for example:

``` http
POST 
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Logic/workflows/{workflowName}/triggers/{triggerName}/listCallbackUrl?api-version=2016-06-01
```

In the body, include the `NotAfter`property using a JSON date string. 
This property returns a callback URL that's valid only until the `NotAfter` date and time.

<a name="primary-secondary-key"></a>

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

<a name="restrict-incoming-ip"></a>

### Restrict incoming IP addresses

Along with Shared Access Signature, you might want to 
limit specific clients that can call your logic app.  
For example, if you manage your request endpoint 
with Azure API Management, you can restrict your 
logic app to accept requests only from the API 
Management instance's IP address. 

#### Set IP ranges - Azure portal

To set up this restriction in the Azure portal, 
go to your logic app's settings: 

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

#### Set IP ranges - logic app deployment template

If you're automating logic app deployments by using an 
[Azure Resource Manager deployment template](../logic-apps/logic-apps-create-deploy-template.md), 
you can set the IP ranges in that template, for example:

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

<a name="add-authentication"></a>

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

<a name="secure-operations"></a>

## Secure access to logic app operations

To let only specific users or groups run operations on your logic app, 
you can restrict access on tasks such as managing, editing, and viewing. 
Logic Apps supports [Azure Role-Based Access Control (RBAC)](../role-based-access-control/role-assignments-portal.md), 
which you can customize or assign built-in roles to members in 
your subscription, for example:

* [Logic App Contributor](../role-based-access-control/built-in-roles.md#logic-app-contributor): Lets you manage logic apps, but you can't change access to them.

* [Logic App Operator](../role-based-access-control/built-in-roles.md#logic-app-operator): Lets you read, enable, and disable logic apps, but you can't edit or update them.

To prevent others from changing or deleting your logic app, you can use 
[Azure Resource Lock](../azure-resource-manager/resource-group-lock-resources.md). 
This capability helps you prevent others from changing or deleting production resources.

<a name="secure-run-history"></a>

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

### Set IP ranges - Azure portal

To set up this restriction in the Azure portal, 
go to your logic app's settings:

1. In the Azure portal, open your logic app in the Logic App Designer. 

1. On your logic app's menu, under **Settings**, select **Workflow settings**.

1. Under **Access control configuration** > 
   **Allowed inbound IP addresses**, select **Specific IP ranges**.

1. Under **IP ranges for contents**, specify the IP 
   address ranges that can access content from inputs and outputs. 
   A valid IP range uses these formats: *x.x.x.x/x* or *x.x.x.x-x.x.x.x* 

### Set IP ranges - logic app deployment template

If you're automating logic app deployments by using a 
[Azure Resource Manager deployment template](../logic-apps/logic-apps-create-deploy-template.md), 
you can set the IP ranges in that template, for example:

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

<a name="secure-action-parameters"></a>

## Secure action parameters and inputs

When deploying across various environments, you might want 
to parameterize specific elements in your logic app's workflow 
definition. That way, you can provide inputs based on the 
environments you use and protect sensitive information. 
For example, if you're authenticating HTTP actions with 
[Azure Active Directory](../logic-apps/logic-apps-workflow-actions-triggers.md#connector-authentication), 
define and secure the parameters that accept the client 
ID and client secret used for authentication. For these 
parameters, your logic app definition has its own `parameters` section.
To access parameter values during runtime, you can use the 
`@parameters('parameterName')` expression, which is provided 
by the [Workflow Definition Language](https://aka.ms/logicappsdocs). 

To protect parameters and values you don't want shown when 
editing your logic app or viewing run history, you can define 
parameters with the `securestring` type and use encoding as necessary. 
Parameters that have this type aren't returned with the resource definition, 
and aren't accessible when viewing the resource after deployment.

> [!NOTE]
> If you use a parameter in a request's headers or body, 
> that parameter might be visible when accessing your 
> logic app's run history and outgoing HTTP request. 
> Make sure you also set your content access policies accordingly.
> Authorization headers are never visible through inputs or outputs. 
> So if a secret is used there, that secret isn't retrievable.

For more information about securing parameters in logic app definitions, see 
[Secure parameters in logic app definitions](#secure-parameters-workflow) 
later on this page.

If you're automating deployments with 
[Azure Resource Manager deployment templates](../azure-resource-manager/resource-group-authoring-templates.md#parameters), 
you can also use secured parameters in those templates. 
For example, you can use parameters for getting KeyVault 
secrets when creating your logic app. Your deployment 
template definition has its own `parameters` section, 
separate from your logic app's `parameters` section. 
For more information about securing parameters in deployment templates, see 
[Secure parameters in deployment templates](#secure-parameters-deployment-template) 
later on this page.

<a name="secure-parameters-workflow"></a>

### Secure parameters in logic app definitions

To protect sensitive information in your logic app 
workflow definition, use secured parameters so this 
information isn't visible after you save your logic app. 
For example, suppose you're using `Basic` authentication 
in an HTTP action definition. This example includes a 
`parameters` section that defines the parameters for the 
action definition plus an `authentication` section that 
accepts `username` and `password` parameter values. 
To provide values for these parameters, you can use 
a separate parameters file, for example:

```json
"definition": {
   "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
   "actions": {
      "HTTP": {
         "type": "Http",
         "inputs": {
            "method": "GET",
            "uri": "https://www.microsoft.com",
            "authentication": {
               "type": "Basic",
               "username": "@parameters('usernameParam')",
               "password": "@parameters('passwordParam')"
            }
         },
         "runAfter": {}
      }
   },
   "parameters": {
      "passwordParam": {
         "type": "securestring"
      },
      "userNameParam": {
         "type": "securestring"
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
}
```

If you use secrets, you can get those secrets at deployment time by using 
[Azure Resource Manager KeyVault](../azure-resource-manager/resource-manager-keyvault-parameter.md).

<a name="secure-parameters-deployment-template"></a>

### Secure parameters in Azure Resource Manager deployment templates

This example shows a Resource Manager deployment template that 
uses more than one runtime parameter with the `securestring` type:

* `armTemplatePasswordParam`, which is input for the 
   logic app definition's `logicAppWfParam` parameter

* `logicAppWfParam`, which is input for the HTTP action 
  using basic authentication

This example includes an inner `parameters` section, 
which belongs to your logic app's workflow definition, 
and an outer `parameters` section, which belongs to 
your deployment template. To specify the environment 
values for parameters, you can use a separate parameters file. 

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {
      "logicAppName": {
         "type": "string",
         "minLength": 1,
         "maxLength": 80,
         "metadata": {
            "description": "Name of the Logic App."
         }
      },
      "armTemplatePasswordParam": {
         "type": "securestring"
      },
      "logicAppLocation": {
         "type": "string",
         "defaultValue": "[resourceGroup().location]",
         "allowedValues": [
            "[resourceGroup().location]",
            "eastasia",
            "southeastasia",
            "centralus",
            "eastus",
            "eastus2",
            "westus",
            "northcentralus",
            "southcentralus",
            "northeurope",
            "westeurope",
            "japanwest",
            "japaneast",
            "brazilsouth",
            "australiaeast",
            "australiasoutheast",
            "southindia",
            "centralindia",
            "westindia",
            "canadacentral",
            "canadaeast",
            "uksouth",
            "ukwest",
            "westcentralus",
            "westus2"
         ],
         "metadata": {
            "description": "Location of the Logic App."
         }
      }
   },
   "variables": {},
   "resources": [
      {
         "name": "[parameters('logicAppName')]",
         "type": "Microsoft.Logic/workflows",
         "location": "[parameters('logicAppLocation')]",
         "tags": {
            "displayName": "LogicApp"
         },
         "apiVersion": "2016-06-01",
         "properties": {
            "definition": {
               "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-0601/workflowdefinition.json#",
               "actions": {
                  "HTTP": {
                     "type": "Http",
                     "inputs": {
                        "method": "GET",
                        "uri": "https://www.microsoft.com",
                        "authentication": {
                           "type": "Basic",
                           "username": "@parameters('usernameParam')",
                           "password": "@parameters('logicAppWfParam')"
                        }
                     },
                  "runAfter": {}
                  }
               },
               "parameters": {
                  "logicAppWfParam": {
                     "type": "securestring"
                  },
                  "userNameParam": {
                     "type": "securestring"
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
               "logicAppWfParam": {
                  "value": "[parameters('armTemplatePasswordParam')]"
               }
            }
         }
      }
   ],
   "outputs": {}
}
```

If you use secrets, you can get those secrets at deployment time by using 
[Azure Resource Manager KeyVault](../azure-resource-manager/resource-manager-keyvault-parameter.md).

<a name="secure-requests"></a>

## Secure access to services receiving requests

Here are some ways you can secure any endpoint where your logic app needs access and sends requests.

### Add authentication on outbound requests

When working with an HTTP, HTTP + Swagger (Open API), or Webhook action, 
you can add authentication to the request sent by your logic app. 
For example, you can use basic authentication, certificate authentication, 
or Azure Active Directory authentication. For more information, 
see [Authenticate triggers or actions](../logic-apps/logic-apps-workflow-actions-triggers.md#connector-authentication).

### Restrict access to logic app IP addresses

All calls from logic apps come from specific designated 
IP addresses based on region. You can add filtering 
that accepts requests only from those IP addresses. 
For those IP addresses, see 
[Limits and configuration for Azure Logic Apps](logic-apps-limits-and-config.md#configuration).

### Secure on-premises connectivity

Azure Logic Apps provides integration with these services 
for secure and reliable on-premises communication.

#### On-premises data gateway

Many managed connectors for Azure Logic Apps provide 
secure connections to on-premises systems, 
such as File System, SQL, SharePoint, DB2, and others. 
The gateway sends data from on-premises sources 
on encrypted channels through the Azure Service Bus. 
All traffic originates as secure outbound traffic 
from the gateway agent. Learn [how the on-premises data gateway works](logic-apps-gateway-install.md#gateway-cloud-service).

#### Azure API Management

[Azure API Management](https://azure.microsoft.com/services/api-management/) 
provides on-premises connection options, such as 
site-to-site virtual private network and ExpressRoute 
integration for secured proxy and communication to on-premises systems. 
In the Logic App Designer, you can select an API exposed by 
API Management from your logic app's workflow, providing quick 
access to on-premises systems.

## Next steps

* [Create a deployment template](logic-apps-create-deploy-template.md)  
* [Exception handling](logic-apps-exception-handling.md)  
* [Monitor your logic apps](logic-apps-monitor-your-logic-apps.md)  
* [Diagnose logic app failures and issues](logic-apps-diagnosing-failures.md)  
