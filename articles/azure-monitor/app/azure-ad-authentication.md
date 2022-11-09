---
title: Azure AD authentication for Application Insights
description: Learn how to enable Azure Active Directory (Azure AD) authentication to ensure that only authenticated telemetry is ingested in your Application Insights resources.
ms.topic: conceptual
ms.date: 08/02/2021
ms.devlang: csharp, java, javascript, python
ms.reviewer: rijolly
---

# Azure AD authentication for Application Insights

Application Insights now supports [Azure Active Directory (Azure AD) authentication](../../active-directory/authentication/overview-authentication.md#what-is-azure-active-directory-authentication). By using Azure AD, you can ensure that only authenticated telemetry is ingested in your Application Insights resources. 

Using various authentication systems can be cumbersome and risky because it's difficult to manage credentials at scale. You can now choose to [opt-out of local authentication](#disable-local-authentication) to ensure only telemetry exclusively authenticated using [Managed Identities](../../active-directory/managed-identities-azure-resources/overview.md) and [Azure Active Directory](../../active-directory/fundamentals/active-directory-whatis.md) is ingested in your resource. This feature is a step to enhance the security and reliability of the telemetry used to make both critical operational ([alerting](../alerts/alerts-overview.md#what-are-azure-monitor-alerts), [autoscale](../autoscale/autoscale-overview.md#overview-of-autoscale-in-microsoft-azure), etc.) and business decisions.

## Prerequisites

The following are prerequisites to enable Azure AD authenticated ingestion.

- Familiarity with:
    - [Managed identity](../../active-directory/managed-identities-azure-resources/overview.md). 
    - [Service principal](../../active-directory/develop/howto-create-service-principal-portal.md).
    - [Assigning Azure roles](../../role-based-access-control/role-assignments-portal.md). 
- You have an "Owner" role to the resource group to grant access using [Azure built-in roles](../../role-based-access-control/built-in-roles.md).
- Understand the [unsupported scenarios](#unsupported-scenarios).

## Unsupported scenarios

The following SDK's and features are unsupported for use with Azure AD authenticated ingestion.

- [Application Insights Java 2.x SDK](java-2x-agent.md)<br>
 Azure AD authentication is only available for Application Insights Java Agent >=3.2.0.
- [ApplicationInsights JavaScript Web SDK](javascript.md).
- [Application Insights OpenCensus Python SDK](opencensus-python.md) with Python version 3.4 and 3.5.

- [Certificate/secret based Azure AD](../../active-directory/authentication/active-directory-certificate-based-authentication-get-started.md) isn't recommended for production. Use Managed Identities instead.
- On-by-default Codeless monitoring (for languages) for App Service, VM/Virtual machine scale sets, Azure Functions etc.
- [Availability tests](availability-overview.md).
- [Profiler](profiler-overview.md).

## Configuring and enabling Azure AD based authentication 

1. Create an identity, if you already don't have one, using either managed identity or service principal:

    1. Using managed identity (Recommended):

        [Setup a managed identity for your Azure Service](../../active-directory/managed-identities-azure-resources/services-support-managed-identities.md) (VM, App Service etc.).

    1. Using service principal (Not Recommended):

        For more information on how to create an Azure AD application and service principal that can access resources, see [Create a service principal](../../active-directory/develop/howto-create-service-principal-portal.md).

1. Assign role to the Azure Service. 

    Follow the steps in [Assign Azure roles](../../role-based-access-control/role-assignments-portal.md) to add the "Monitoring Metrics Publisher" role from the target Application Insights resource to the Azure resource from which the telemetry is sent. 

    > [!NOTE]
    > Although role "Monitoring Metrics Publisher" says metrics, it will publish all telemetry to the App Insights resource.

1. Follow the configuration guidance per language below.

### [.NET](#tab/net)

> [!NOTE]
> Support for Azure AD in the Application Insights .NET SDK is included starting with [version 2.18-Beta3](https://www.nuget.org/packages/Microsoft.ApplicationInsights/2.18.0-beta3).

Application Insights .NET SDK supports the credential classes provided by [Azure Identity](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity#credential-classes).

- `DefaultAzureCredential` is recommended for local development.
- `ManagedIdentityCredential` is recommended for system-assigned and user-assigned managed identities.
    - For system-assigned, use the default constructor without parameters.
    - For user-assigned, provide the clientId to the constructor.
- `ClientSecretCredential` is recommended for service principals. 
    - Provide the tenantId, clientId, and clientSecret to the constructor.

Below is an example of manually creating and configuring a `TelemetryConfiguration` using .NET:

```csharp
TelemetryConfiguration.Active.ConnectionString = "InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/";
var credential = new DefaultAzureCredential();
TelemetryConfiguration.Active.SetAzureTokenCredential(credential);
```

Below is an example of configuring the `TelemetryConfiguration` using .NET Core:
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

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

### [Node.js](#tab/nodejs)
 
> [!NOTE]
> Support for Azure AD in the Application Insights Node.JS is included starting with [version 2.1.0-beta.1](https://www.npmjs.com/package/applicationinsights/v/2.1.0-beta.1).

Application Insights Node.JS supports the credential classes provided by [Azure Identity](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/identity/identity#credential-classes).

#### DefaultAzureCredential

```javascript
let appInsights = require("applicationinsights");
import { DefaultAzureCredential } from "@azure/identity"; 
 
const credential = new DefaultAzureCredential();
appInsights.setup("InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/").start();
appInsights.defaultClient.config.aadTokenCredential = credential;

```

#### ClientSecretCredential

```javascript
let appInsights = require("applicationinsights");
import { ClientSecretCredential } from "@azure/identity"; 
 
const credential = new ClientSecretCredential(
    "<YOUR_TENANT_ID>",
    "<YOUR_CLIENT_ID>",
    "<YOUR_CLIENT_SECRET>"
  );
appInsights.setup("InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/").start();
appInsights.defaultClient.config.aadTokenCredential = credential;

```

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

### [Java](#tab/java)

> [!NOTE]
> Support for Azure AD in the Application Insights Java agent is included starting with [Java 3.2.0-BETA](https://github.com/microsoft/ApplicationInsights-Java/releases/tag/3.2.0-BETA). 

1. [Configure your application with the Java agent.](java-in-process-agent.md#get-started)

    > [!IMPORTANT]
    > Use the full connection string which includes "IngestionEndpoint" while configuring your app with Java agent. For example `InstrumentationKey=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX;IngestionEndpoint=https://XXXX.applicationinsights.azure.com/`.

    > [!NOTE]
    >  For more information about migrating from 2.X SDK to 3.X Java agent, see [Upgrading from Application Insights Java 2.x SDK](java-standalone-upgrade-from-2x.md).

1. Add the json configuration to ApplicationInsights.json configuration file depending on the authentication being used by you. We recommend users to use managed identities.

#### System-assigned Managed Identity

Below is an example of how to configure Java agent to use system-assigned managed identity for authentication with Azure AD.

```JSON
{ 
  "connectionString": "App Insights Connection String with IngestionEndpoint", 
  "preview": { 
    "authentication": { 
      "enabled": true, 
      "type": "SAMI" 
    } 
  } 
} 
```

#### User-assigned managed identity

Below is an example of how to configure Java agent to use user-assigned managed identity for authentication with Azure AD.

```JSON
{ 
  "connectionString": "App Insights Connection String with IngestionEndpoint", 
  "preview": { 
    "authentication": { 
      "enabled": true, 
      "type": "UAMI", 
      "clientId":"<USER-ASSIGNED MANAGED IDENTITY CLIENT ID>" 
    } 
  }     
} 
```
:::image type="content" source="media/azure-ad-authentication/user-assigned-managed-identity.png" alt-text="Screenshot of User-assigned managed identity." lightbox="media/azure-ad-authentication/user-assigned-managed-identity.png":::

#### Client secret

Below is an example of how to configure Java agent to use service principal for authentication with Azure AD. We recommend users to use this type of authentication only during development. The ultimate goal of adding authentication feature is to eliminate secrets.

```JSON
{ 
  "connectionString": "App Insights Connection String with IngestionEndpoint",
   "preview": { 
        "authentication": { 
          "enabled": true, 
          "type": "CLIENTSECRET", 
          "clientId":"<YOUR CLIENT ID>", 
          "clientSecret":"<YOUR CLIENT SECRET>", 
          "tenantId":"<YOUR TENANT ID>" 
    } 
  } 
} 
```
:::image type="content" source="media/azure-ad-authentication/client-secret-tenant-id.png" alt-text="Screenshot of Client secret with tenantID and ClientID." lightbox="media/azure-ad-authentication/client-secret-tenant-id.png":::

:::image type="content" source="media/azure-ad-authentication/client-secret-cs.png" alt-text="Screenshot of Client secret with client secret." lightbox="media/azure-ad-authentication/client-secret-cs.png":::

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

### [Python](#tab/python)

> [!NOTE]
> Azure AD authentication is only available for Python v2.7, v3.6 and v3.7. Support for Azure AD in the Application Insights Opencensus Python SDK
is included starting with beta version [opencensus-ext-azure 1.1b0](https://pypi.org/project/opencensus-ext-azure/1.1b0/).

Construct the appropriate [credentials](/python/api/overview/azure/identity-readme#credentials) and pass it into the constructor of the Azure Monitor exporter. Make sure your connection string is set up with the instrumentation key and ingestion endpoint of your resource.

Below are the following types of authentication that are supported by the `Opencensus` Azure Monitor exporters. Managed identities are recommended in production environments.

#### System-assigned managed identity

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

#### User-assigned managed identity

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
    exporter=AzureExporter(credential=credential, connection_string="InstrumentationKey=<your-instrumentation-key>;IngestionEndpoint=<your-ingestion-endpoint>"),
    sampler=ProbabilitySampler(1.0)
)
...
```

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]
---

## Disable local authentication

After the Azure AD authentication is enabled, you can choose to disable local authentication. This configuration will allow you to ingest telemetry authenticated exclusively by Azure AD and impacts data access (for example, through API Keys). 

You can disable local authentication by using the Azure portal, Azure Policy, or programmatically.

### Azure portal

1. From your Application Insights resource, select **Properties** under the *Configure* heading in the left-hand menu. Then select **Enabled (click to change)** if the local authentication is enabled. 

   :::image type="content" source="./media/azure-ad-authentication/enabled.png" alt-text="Screenshot of Properties under the *Configure* selected and enabled (select to change) local authentication button.":::

1. Select **Disabled** and apply changes.

   :::image type="content" source="./media/azure-ad-authentication/disable.png" alt-text="Screenshot of local authentication with the enabled/disabled button highlighted.":::

1. Once your resource has disabled local authentication, you'll see the corresponding info in the **Overview** pane.

   :::image type="content" source="./media/azure-ad-authentication/overview.png" alt-text="Screenshot of overview tab with the disabled (select to change) highlighted.":::

### Azure Policy 

Azure Policy for 'DisableLocalAuth' will deny from users to create a new Application Insights resource without this property setting to 'true'. The policy name is 'Application Insights components should block non-AAD auth ingestion'.

To apply this policy definition to your subscription, [create a new policy assignment and assign the policy](../../governance/policy/assign-policy-portal.md).

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

### Programmatic enablement 

Property `DisableLocalAuth` is used to disable any local authentication on your Application Insights resource. When set to `true`, this property enforces that Azure AD authentication must be used for all access.

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

## Troubleshooting

This section provides distinct troubleshooting scenarios and steps that users can take to resolve any issue before they raise a support ticket. 

### Ingestion HTTP errors

The ingestion service will return specific errors, regardless of the SDK language. Network traffic can be collected using a tool such as Fiddler. You should filter traffic to the IngestionEndpoint set in the Connection String.

#### HTTP/1.1 400 Authentication not supported 

This error indicates that the resource has been configured for Azure AD only. The SDK hasn't been correctly configured and is sending to the incorrect API.

> [!NOTE]
>  "v2/track" does not support Azure AD. When the SDK is correctly configured, telemetry will be sent to "v2.1/track".

Next steps should be to review the SDK configuration.

#### HTTP/1.1 401 Authorization required

This error indicates that the SDK has been correctly configured, but was unable to acquire a valid token. This error may indicate an issue with Azure Active Directory.

Next steps should be to identify exceptions in the SDK logs or network errors from Azure Identity.

#### HTTP/1.1 403 Unauthorized 

This error indicates that the SDK has been configured with credentials that haven't been given permission to the Application Insights resource or subscription.

Next steps should be to review the Application Insights resource's access control. The SDK must be configured with a credential that has been granted the "Monitoring Metrics Publisher" role.

### Language specific troubleshooting

### [.NET](#tab/net)

#### Event Source

The Application Insights .NET SDK emits error logs using event source. To learn more about collecting event source logs visit, [Troubleshooting no data- collect logs with PerfView](asp-net-troubleshoot-no-data.md#PerfView).

If the SDK fails to get a token, the exception message is logged as:
`Failed to get AAD Token. Error message: `

### [Node.js](#tab/nodejs)

Internal logs could be turned on using the following setup. Once enabled, error logs will be shown in the console including any error related to Azure AD integration. For example, failure to generate the token when wrong credentials are supplied or errors when ingestion endpoint fails to authenticate using the provided credentials.

```javascript
let appInsights = require("applicationinsights");
appInsights.setup("InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/").setInternalLogging(true, true);
```

### [Java](#tab/java)

#### HTTP traffic

You can inspect network traffic using a tool like Fiddler. To enable the traffic to tunnel through fiddler either add the following proxy settings in configuration file:

```JSON
"proxy": {
"host": "localhost",
"port": 8888
}
```

Or add following jvm args while running your application:`-Djava.net.useSystemProxies=true -Dhttps.proxyHost=localhost -Dhttps.proxyPort=8888`

If Azure AD is enabled in the agent, outbound traffic will include the HTTP Header "Authorization".


#### 401 Unauthorized 

If the following WARN message is seen in the log file `WARN c.m.a.TelemetryChannel - Failed to send telemetry with status code: 401, please check your credentials`, it indicates the agent wasn't successful in sending telemetry. You've probably not enabled Azure AD authentication on the agent, but your Application Insights resource is configured with `DisableLocalAuth: true`. Make sure you're passing in a valid credential and that it has permission to access your Application Insights resource.


If using fiddler, you might see the following response header: `HTTP/1.1 401 Unauthorized - please provide the valid authorization token`.


#### CredentialUnavailableException

If the following exception is seen in the log file  `com.azure.identity.CredentialUnavailableException: ManagedIdentityCredential authentication unavailable. Connection to IMDS endpoint cannot be established`, it indicates the agent wasn't successful in acquiring the access token. The probable reason might be you've provided invalid `clientId` in your User Assigned Managed Identity configuration


#### Failed to send telemetry

If the following WARN message is seen in the log file, `WARN c.m.a.TelemetryChannel - Failed to send telemetry with status code: 403, please check your credentials`, it indicates the agent wasn't successful in sending telemetry. This warning might be because of the provided credentials don't grant the access to ingest the telemetry into the component

If using fiddler, you might see the following response header: `HTTP/1.1 403 Forbidden - provided credentials do not grant the access to ingest the telemetry into the component`.

Root cause might be one of the following reasons:
- You've created the resource with System-assigned managed identity enabled or you might have associated the User-assigned identity with the resource but forgot to add the `Monitoring Metrics Publisher` role to the resource (if using SAMI) or User-assigned identity (if using UAMI).
- You've provided the right credentials to get the access tokens, but the credentials don't belong to the right Application Insights resource. Make sure you see your resource (vm, app service etc.) or user-assigned identity with `Monitoring Metrics Publisher` roles in your Application Insights resource.

#### Invalid TenantId

If the following exception is seen in the log file `com.microsoft.aad.msal4j.MsalServiceException: Specified tenant identifier <TENANT-ID> is neither a valid DNS name, nor a valid external domain.`, it indicates the agent wasn't successful in acquiring the access token. The probable reason might be you've provided invalid/wrong `tenantId` in your client secret configuration.

#### Invalid client secret

If the following exception is seen in the log file `com.microsoft.aad.msal4j.MsalServiceException: Invalid client secret is provided`, it indicates the agent wasn't successful in acquiring the access token. The probable reason might be you've provided invalid `clientSecret` in your client secret configuration.


#### Invalid ClientId

If the following exception is seen in the log file `com.microsoft.aad.msal4j.MsalServiceException: Application with identifier <CLIENT_ID> was not found in the directory`, it indicates the agent wasn't successful in acquiring the access token. The probable reason might be you've provided invalid/wrong "clientId" in your client secret configuration

 This scenario can occur if the application hasn't been installed by the administrator of the tenant or consented to by any user in the tenant. You may have sent your authentication request to the wrong tenant.

### [Python](#tab/python)

#### Error starts with "credential error" (with no status code)

Something is incorrect about the credential you're using and the client isn't able to obtain a token for authorization. It's due to lacking the required data for the state. An example would be passing in a system ManagedIdentityCredential but the resource isn't configured to use system-managed identity.

#### Error starts with "authentication error" (with no status code)

Client failed to authenticate with the given credential. Usually occurs when the credential used doesn't have correct role assignments.

#### I'm getting a status code 400 in my error logs

You're probably missing a credential or your credential is set to `None`, but your Application Insights resource is configured with `DisableLocalAuth: true`. Make sure you're passing in a valid credential and that it has permission to access your Application Insights resource.

#### I'm getting a status code 403 in my error logs

Usually occurs when the provided credentials don't grant access to ingest telemetry for the Application Insights resource. Make sure your AI resource has the correct role assignments.

---
## Next steps
* [Monitor your telemetry in the portal](overview-dashboard.md).
* [Diagnose with Live Metrics Stream](live-stream.md).
