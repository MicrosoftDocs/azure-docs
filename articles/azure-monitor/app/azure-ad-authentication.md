---
title: Azure AD authentication for Application Insights (Preview)
description: Learn how to enable Azure Active Directory (Azure AD) authentication to ensure that only authenticated telemetry is ingested in your Application Insights resources.
ms.topic: conceptual
ms.date: 06/09/2021

---
# Azure AD authentication for Application Insights (Preview)
Application Insights now supports Azure Active Directory (Azure AD) authentication. By using Azure AD, you can now ensure that only authenticated telemetry is ingested in your Application Insights resources. 

Typically, using various authentication systems can be cumbersome and pose risk since it’s difficult to manage credentials at a large scale. You can now choose to opt-out of local authentication and ensure only telemetry that is exclusively authenticated using [Managed Identities](../../active-directory/managed-identities-azure-resources/overview.md) and [Azure Active Directory](../../active-directory/fundamentals/active-directory-whatis.md) is ingested in your Application Insights resource. This feature is a step to enhance the security and reliability of the telemetry used to make critical business decisions. 

> [!IMPORTANT]
> Azure AD authentication is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Below are SDKs/scenarios not supported in the Public Preview:
- [Java 2.x SDK](java-in-process-agent.md) – Azure AD authentication is only available for Java agent > 3.2.x. 
- [JavaScript SDKs](javascript.md). 
- [OpenCensus Python SDK](opencensus-python.md) won't support Python versions - 3.4 and 3.5.
- [Certificate/secret based Azure AD](../../active-directory/authentication/active-directory-certificate-based-authentication-get-started.md) isn't recommended for production. Use Managed Identities instead. 
- Auto Attach scenario for .NET/.NET core.

## Prerequisites to enable Azure AD authentication ingestion
- You already have an existing Managed Identity <user or system assigned>
    - To learn, visit the [Managed Identity documentation](../../active-directory/managed-identities-azure-resources/overview.md). 
- Familiarity with [assigning Azure roles](../../role-based-access-control/role-assignments-portal.md). 

## Configuring and enabling Azure AD based authentication 

1. Follow the steps below depending on the type of authentication you're using: 
    1. If using system-assigned managed identity or User assigned managed identity, follow the steps in the [configure managed identities for Azure resources on a VM using the Azure portal](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md).
    
    If you are configuring managed identities on other Azure services (App Service, virtual machine scale set etc.) see [Services that support managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/services-support-managed-identities.md) for more information.

    1. If using service principal, follow these steps in [Use the portal to create an Azure AD application and service principal that can access resources](../../active-directory/develop/howto-create-service-principal-portal.md).

    > [!NOTE]
    > Information the user should notice even if skimming We recommend using this type of authentication only during development and not in production.

1. Using the steps in [Assign Azure roles](../../role-based-access-control/role-assignments-portal.md) add the "Monitoring Metrics Publisher" role from the target Application Insights resource to the Azure resource from which the telemetry is sent. 
1. Follow the steps in the next section depending on the Application Insights SDKs/Agents language being used.

### [ASP.NET and .NET](#tab/net)

Support for Azure AD in the Application Insights .NET SDK is included starting with [version 2.18-Beta2](https://www.nuget.org/packages/Microsoft.ApplicationInsights/2.18.0-beta2).

Application Insights .NET SDK supports the credential classes provided by [Azure Identity](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity#credential-classes).

- DefaultAzureCredential is recommended for local development.
- ClientSecretCredential is recommended for service principals. 

Here is an example of manually creating and configuring a TelemetryConfiguration using .NET:

```csharp
var config = new TelemetryConfiguration
{
	ConnectionString = "InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/"
}
var credential = new DefaultAzureCredential();
config. SetAzureTokenCredential (credential);

```

Here is an example of configuring the TelemetryConfiguration using ASP.NET Core:
```csharp
services.Configure<TelemetryConfiguration>(config =>
{
       var credential = new DefaultAzureCredential();
       config.SetAzureTokenCredential(credential);
});
services.AddApplicationInsightsTelemetry(new ApplicationInsightsServiceOptions
{
	ConnectionString = "InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/"
});
```

### [Java](#tab/java)

The following are types of authentication that are supported by Java agent. We recommend users to use managed identities, since the ultimate goal is to eliminate secrets and also to eliminate the need for developers to manage credentials. Each supported authentication type also have an example json configuration that needs to be added to ApplicationInsights.json configuration file.

#### System Assigned Managed Identity

Below is an example on how to configure Java agent to use system assigned managed identity for authentication with Azure AD.

```JSON
"preview" : {
    "authentication" : {
      "enabled": true,
      "type": "SAMI"
    }
}
```

#### User Assigned Managed Identity

Below is an example on how to configure Java agent to use user assigned managed identity for authentication with Azure AD.
```JSON
"preview" : {
    "authentication" : {
      "enabled": true,
      "type": "UAMI",
      "clientId":"<USER ASSIGNED MANAGED IDENTITY CLIENT ID>"
    }
}
```

#### Client Secret

Below is an example on how to configure Java agent to use service principal for authentication with Azure AD. We recommend users to use this type of authentication only during development. The ultimate goal of adding authentication feature is to eliminate secrets.

```JSON
"preview" : {
    "authentication" : {
      "enabled": true,
      "type": "CLIENTSECRET",
      "clientId":"<YOUR CLIENT ID>",
      "clientSecret":"<YOUR CLIENT SECRET>",
      "tenantId":"<YOUR TENANT ID>"
    }
}
```

### [Python](#tab/python)

> [!NOTE]
> Azure AD authentication is only available for Python v2.7, v3.6 and v3.7.


Construct the appropriate [credentials](/python/api/overview/azure/identity-readme?view=azure-python#credentials) and pass it into the constructor of the Azure Monitor exporter. Make sure your connection string is setup with the instrumentation key and ingestion endpoint of your resource.
Below are the following types of authentication that are supported by the Opencensus Azure Monitor exporters. Managed identities are recommended to be used in production environments.


#### System Assigned Managed Identity

```python
from azure.identity import ManagedIdentityCredential

from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.trace.samplers import ProbabilitySampler
from opencensus.trace.tracer import Tracer

credential = ManagedIdentityCredential()
tracer = Tracer(
    exporter=AzureExporter(credential=credential, connection_string="InstrumentationKey=<your-instrumentation-key>;IngestionEndpoint=<your-ingestion-endpoint>"),
    sampler=ProbabilitySampler(1.0)
)
...

```

#### User Assigned Managed Identity

```python
from azure.identity import ManagedIdentityCredential

from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.trace.samplers import ProbabilitySampler
from opencensus.trace.tracer import Tracer

credential = ManagedIdentityCredential(client_id="<client-id>")
tracer = Tracer(
    exporter=AzureExporter(credential=credential, connection_string="InstrumentationKey=<your-instrumentation-key>;IngestionEndpoint=<your-ingestion-endpoint>"),
    sampler=ProbabilitySampler(1.0)
)
...

```

#### Client secret

```python
from azure.identity import ClientSecretCredential

from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.trace.samplers import ProbabilitySampler
from opencensus.trace.tracer import Tracer

tenant_id = "<tenant-id>"
client_id = "<client-id"
client_secret = "<client-secret>"

credential = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)
tracer = Tracer(
    exporter=AzureExporter(credential=credential, connection_string="<your-connection-string>"),
    sampler=ProbabilitySampler(1.0)
)
...
```
## [Node.js](#tab/nodejs)


Azure Credentials from [Azure Identity client library](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/identity/identity) can be provided in Application Insights Node.JS SDK Client configuration.
 
```javascript
let appInsights = require("applicationinsights");
import { DefaultAzureCredential } from "@azure/identity"; 
 
const credential = new DefaultAzureCredential();
appInsights.setup("InstrumentationKey=00000000-0000-0000-0000-000000000000").start();
let client = appInsights.defaultClient;
client.aadTokenCredential = credential;
client.trackEvent({name: "Custom Event"});
```
---

## Disable local authentication

After the Azure AD authentication is enabled, you can choose to disable local authentication. This will allow you to ingest telemetry authenticated exclusively by Azure AD. 

You can disable local authentication by using the Azure portal, programmatically or Azure Policy.

### Azure portal

1.	From your Application Insights resource, select **Properties** under the *Configure* heading in the left-hand menu bar.

    :::image type="content" source="./media/azure-ad-authentication/properties.png" alt-text="Screenshot of Properties under the *Configure* selected.":::

2. Select **(click to change)** if the local authentication is enabled. 

    :::image type="content" source="./media/azure-ad-authentication/enabled.png" alt-text="Screenshot of enabled (click to change) local authentication button.":::

1. Select **Disabled** and apply changes. 

    :::image type="content" source="./media/azure-ad-authentication/disable.png" alt-text="Screenshot of local authentication with the enabled/disabled button highlighted.":::

1. Once your resource has disabled local authentication, you will see the corresponding info in the **Overview** pane.

    :::image type="content" source="./media/azure-ad-authentication/overview.png" alt-text="Screenshot of overview tab with the disabled(click to change) highlighted.":::

### Programmatic enablement 

Property "DisableLocalAuth": "[parameters('disableLocalAuth')]" is used to disable any local authentication on your Application Insights resource. This property is the key to disabling any local authentication that you might have setup.

Below is an example Azure Resource Manager template that you can use to create a workspace-based Application Insights resource with local auth disabled.

```JSON 
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "name": {
            "type": "string"
        },
        "type": {
            "type": "string"
        },
        "regionId": {
            "type": "string"
        },
        "tagsArray": {
            "type": "object"
        },
        "requestSource": {
            "type": "string"
        },
        "workspaceResourceId": {
            "type": "string"
        },
        "disableLocalAuth": {
            "type": "bool"
        }
     
    },
    "resources": [
        {
        "name": "[parameters('name')]",
        "type": "microsoft.insights/components",
        "location": "[parameters('regionId')]",
        "tags": "[parameters('tagsArray')]",
        "apiVersion": "2020-02-02-preview",
        "dependsOn": [],
        "properties": {
            "Application_Type": "[parameters('type')]",
            "Flow_Type": "Redfield",
            "Request_Source": "[parameters('requestSource')]",
            "WorkspaceResourceId": "[parameters('workspaceResourceId')]",
            "DisableLocalAuth": "[parameters('disableLocalAuth')]"
            }
    }
 ]
}

```
### Azure Policy

Azure policy for ‘DisableLocalAuth’ will deny from users to create a new Application Insights resource without this property setting to ‘true’. The policy name is ‘Application Insights components should block non-AAD auth ingestion’.
To apply this policy to your subscription, [create a new policy assignment and assign the policy](../..//governance/policy/assign-policy-portal.md).

Below is the policy template definition:
```JSON
{
    "properties": {
        "displayName": "Application Insights components should block non-AAD auth ingestion",
        "policyType": "BuiltIn",
        "mode": "Indexed",
        "description": "Improve Application Insights security by disabling log ingestion that are not AAD-based.",
        "metadata": {
            "version": "1.0.0",
            "category": "Monitoring"
        },
        "parameters": {
            "effect": {
                "type": "String",
                "metadata": {
                    "displayName": "Effect",
                    "description": "The effect determines what happens when the policy rule is evaluated to match"
                },
                "allowedValues": [
                    "audit",
                    "deny",
                    "disabled"
                ],
                "defaultValue": "audit"
            }
        },
        "policyRule": {
            "if": {
                "allOf": [
                    {
                        "field": "type",
                        "equals": "Microsoft.Insights/components"
                    },
                    {
                        "field": "Microsoft.Insights/components/DisableLocalAuth",
                        "notEquals": "true"                        
                    }
                ]
            },
            "then": {
                "effect": "[parameters('effect')]"
            }
        }
    }
}

```
## Troubleshooting

This section provides distinct troubleshooting scenarios and steps that users can take to resolve any issue before they raise a support ticket. 

### [ASP.NET and .NET](#tab/net)

#### Http Traffic

You can inspect network traffic using a tool like Fiddler.
If Azure AD is enabled in the SDK, outbound traffic will include the HTTP Header “Authorization”.


#### Event Source

The Application Insights .NET SDK emits error logs using event source. To learn more about collecting event source logs visit, [Troubleshooting no data- collect logs with PerfView](asp-net-troubleshoot-no-data.md#PerfView).

If the SDK fails to get a token, the exception message is logged as:
“Failed to get AAD Token. Error message: ”

### [Java](#tab/java)

NA

### [Python](#tab/python)

#### Error starts with “credential error” (with no status code)

Something is incorrect about the credential you are using and the client is not able to obtain a token for authorization. It is usually due to lacking the required data for the state. An example would be passing in a system ManagedIdentityCredential but the resource is not configured to use system managed identity.

#### Error starts with “authentication error” (with no status code)

Client failed to authenticate with the given credential. Usually occurs when the credential used does not have correct role assignments.

#### I’m getting a status code 400 in my error logs

You are probably missing a credential or your credential is set to `None`, but your Application Insights resource is configured with `DisableLocalAuth: true`. Make sure you are passing in a valid credential and that it has permission to access your Application Insights resource.

#### I’m getting a status code 403 in my error logs

Usually occurs when the provided credentials do not grant access to ingest telemetry for the Application Insights resource. Make sure your AI resource has the correct role assignments.

### [Node.js](#tab/nodejs)

Internal logs could be turned on using following setup, once this is enabled, error logs will be shown in the console, including any error related to Azure AD integration like failure to generate the token when wrong credentials are supplied or errors when ingestion endpoint fails to authenticate using the provided credentials.

```javascript
let appInsights = require("applicationinsights");
appInsights.setup("InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/").setInternalLogging(true, true);
```
---
## Next Steps
