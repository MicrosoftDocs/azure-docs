---
title: Azure Connector trigger for Azure Functions (Preview)
description: Learn how to use the Azure Connector trigger to run a function when an event occurs in a service that uses a managed connector.
ms.topic: reference
ms.date: 10/05/2026
ms.devlang: csharp
zone_pivot_groups: programming-languages-set-functions
ms.custom:
  - devx-track-csharp
  - devx-track-js
  - devx-track-python
  - devx-track-ts
  - ignite-2026
---

# Connector trigger for Azure Functions (Preview)

Use the Connector trigger to run a function when an event occurs in a service such as Office 365, SharePoint, Dataverse, SMTP, Salesforce, and many more. The trigger receives events from a managed connector in [Azure Connector Namespace](../connector-namespace/connector-namespace-overview.md). To explore the available managed connectors, see the [connectors reference](/connectors/connector-reference/).

For information about installing the extension, supported binding types, callback authentication, and app-wide configuration, see the [Connector extension overview](functions-bindings-connector.md).

> [!IMPORTANT]
> The Connector trigger is currently in public preview. Features, configuration names, and supported connectors can change before general availability (GA). Use of this feature is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

::: zone pivot="programming-language-go,programming-language-java,programming-language-powershell"

> [!NOTE]
> The Connector trigger isn't currently supported for this language.

::: zone-end

::: zone pivot="programming-language-csharp"

## Examples

The Office 365 Outlook and SharePoint Online examples use strongly typed payloads from the Azure Connectors SDK. For connector operations that don't yet have strongly typed payloads, bind to `string` to receive the raw JSON payload. These examples intentionally log only basic payload information to stay focused on how to define Connector-triggered functions. Replace the logging with your application's processing logic.

### Office 365 Outlook

The following example runs when a new email arrives in the configured Office 365 Outlook mailbox:

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Connector;
using Microsoft.Extensions.Logging;
using Azure.Connectors.Sdk.Office365.Models;

namespace Office365App;

public class O365Functions
{
    private readonly ILogger<O365Functions> _logger;

    public O365Functions(ILogger<O365Functions> logger)
    {
        _logger = logger;
    }

    [Function("OnNewEmail")]
    public void OnNewEmail(
        [ConnectorTrigger] Office365OnNewEmailTriggerPayload payload)
    {
        var messageCount = payload.Body?.Value?.Count ?? 0;
        _logger.LogInformation(
            "Received {MessageCount} new email message(s).",
            messageCount);
    }
}
```

The `Office365OnNewEmailTriggerPayload` type is defined in the `Azure.Connectors.Sdk.Office365.Models` namespace.

For the complete code sample, including infrastructure and trigger registration, see [Office 365 Outlook triggers for .NET](https://github.com/Azure-Samples/functions-connectors-net/tree/main/office365App).

### SharePoint Online

The following example runs when a file is created in the configured SharePoint Online document library:

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Connector;
using Microsoft.Extensions.Logging;
using Azure.Connectors.Sdk.SharePointOnline.Models;

namespace SharePointApp;

public class SharePointFunctions
{
    private readonly ILogger<SharePointFunctions> _logger;

    public SharePointFunctions(ILogger<SharePointFunctions> logger)
    {
        _logger = logger;
    }

    [Function("OnNewFile")]
    public void OnNewFile(
        [ConnectorTrigger] SharePointOnlineOnNewFileItemsTriggerPayload payload)
    {
        var fileCount = payload.Body?.Value?.Count ?? 0;
        _logger.LogInformation(
            "Received {FileCount} new SharePoint file(s).",
            fileCount);
    }
}
```

The `SharePointOnlineOnNewFileItemsTriggerPayload` type is defined in the `Azure.Connectors.Sdk.SharePointOnline.Models` namespace.

For the complete code sample, including infrastructure and trigger registration, see [SharePoint Online triggers for .NET](https://github.com/Azure-Samples/functions-connectors-net/tree/main/sharepointApp).

### Connector without a strongly typed payload

Some connector events don't yet have a strongly typed .NET payload. The following example runs when a new message is added to a Microsoft Teams chat or channel and binds the payload to `string`:

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Connector;
using Microsoft.Extensions.Logging;

namespace TeamsApp;

public class TeamsFunctions
{
    private readonly ILogger<TeamsFunctions> _logger;

    public TeamsFunctions(ILogger<TeamsFunctions> logger)
    {
        _logger = logger;
    }

    [Function("OnNewTeamsMessage")]
    public void OnNewTeamsMessage([ConnectorTrigger] string payload)
    {
        _logger.LogInformation("Received a new Teams message: {Payload}", payload);
    }
}
```

To identify connector operations that don't yet have strongly typed payloads, see [Operations to Azure Functions signature mapping](https://github.com/Azure/azure-functions-connector-extension/blob/main/docs/operations-functions-match.md).

## Attributes

In a .NET isolated worker app, apply `[ConnectorTrigger]` to the function parameter that receives the event payload:

```csharp
[Function("OnConnectorEvent")]
public void Run([ConnectorTrigger] string payload)
{
    // Process the raw JSON payload.
}
```

The `ConnectorTrigger` attribute has no configurable properties. Configure the connector, operation, operation parameters, destination function, and callback authentication in the trigger configuration in Azure Connector Namespace.

::: zone-end

::: zone pivot="programming-language-typescript"

## Examples

The Node.js connector extension provides typed contexts for the Office 365 Outlook, SharePoint Online, and Microsoft Teams operations shown in this section. These examples intentionally log only basic payload information to stay focused on how to define Connector-triggered functions. Replace the logging with your application's processing logic.

### Office 365 Outlook

The following example runs when a new email arrives in the configured Office 365 Outlook mailbox:

```typescript
import { InvocationContext } from '@azure/functions';
import {
    connectors,
    EmailTriggerContext,
} from '@azure/functions-extensions-connectors';

connectors.office365.onNewEmail('OnNewEmail', {
    handler: async (
        context: EmailTriggerContext,
        invocationContext: InvocationContext,
    ) => {
        invocationContext.log(
            `Received ${context.emails.length} new email message(s).`,
        );
    },
});
```

The `EmailTriggerContext` type exposes the messages as a typed `emails` array.

For the complete code sample, including infrastructure and trigger registration, see [Office 365 Outlook triggers for TypeScript](https://github.com/Azure-Samples/functions-connectors-typescript/tree/main/office365App).

### SharePoint Online

The following example runs when a file is created in the configured SharePoint Online document library:

```typescript
import { InvocationContext } from '@azure/functions';
import {
    connectors,
    FileTriggerContext,
} from '@azure/functions-extensions-connectors';

connectors.sharepoint.onNewFile('OnSharepointNewFile', {
    handler: async (
        context: FileTriggerContext,
        invocationContext: InvocationContext,
    ) => {
        invocationContext.log(
            `Received ${context.files.length} new SharePoint file(s).`,
        );
    },
});
```

The `FileTriggerContext` type exposes the file metadata as a typed `files` array.

For the complete code sample, including infrastructure and trigger registration, see [SharePoint Online triggers for TypeScript](https://github.com/Azure-Samples/functions-connectors-typescript/tree/main/sharepointApp).

### Microsoft Teams

The following example runs when a new message is added to a Microsoft Teams channel:

```typescript
import { InvocationContext } from '@azure/functions';
import {
    ChannelMessageTriggerContext,
    connectors,
} from '@azure/functions-extensions-connectors';

connectors.teams.onNewChannelMessage('OnNewChannelMessage', {
    handler: async (
        context: ChannelMessageTriggerContext,
        invocationContext: InvocationContext,
    ) => {
        invocationContext.log(
            `Received ${context.messages.length} new Teams message(s).`,
        );
    },
});
```

The `ChannelMessageTriggerContext` type exposes the messages as a typed `messages` array.

For the complete code sample, including infrastructure and trigger registration, see [Microsoft Teams triggers for TypeScript](https://github.com/Azure-Samples/functions-connectors-typescript/tree/main/teamsApp).

## Registration

Use the generic `connectorTrigger` function for an operation that doesn't have a connector-specific registration:

```typescript
import { InvocationContext } from '@azure/functions';
import {
    connectorTrigger,
    ConnectorTriggerContext,
} from '@azure/functions-extensions-connectors';

connectorTrigger('OnConnectorEvent', {
    handler: async (
        context: ConnectorTriggerContext,
        invocationContext: InvocationContext,
    ) => {
        invocationContext.log(JSON.stringify(context.rawPayload));
    },
});
```

The generic registration defaults the item type to `unknown`. Validate the payload before accessing operation-specific properties. Configure the connector, operation, operation parameters, destination function, and callback authentication in the trigger configuration in Azure Connector Namespace.

::: zone-end

::: zone pivot="programming-language-javascript"

## Examples

The Node.js connector extension provides connector-specific contexts for the Office 365 Outlook, SharePoint Online, and Microsoft Teams operations shown in this section. These examples intentionally log only basic payload information to stay focused on how to define Connector-triggered functions. Replace the logging with your application's processing logic.

### Office 365 Outlook

The following example runs when a new email arrives in the configured Office 365 Outlook mailbox:

```javascript
const {
    connectors,
} = require('@azure/functions-extensions-connectors');

connectors.office365.onNewEmail('OnNewEmail', {
    handler: async (context, invocationContext) => {
        invocationContext.log(
            `Received ${context.emails.length} new email message(s).`,
        );
    },
});
```

The handler context exposes the messages through the `emails` array.

### SharePoint Online

The following example runs when a file is created in the configured SharePoint Online document library:

```javascript
const {
    connectors,
} = require('@azure/functions-extensions-connectors');

connectors.sharepoint.onNewFile('OnSharepointNewFile', {
    handler: async (context, invocationContext) => {
        invocationContext.log(
            `Received ${context.files.length} new SharePoint file(s).`,
        );
    },
});
```

The handler context exposes the file metadata through the `files` array.

### Microsoft Teams

The following example runs when a new message is added to a Microsoft Teams channel:

```javascript
const {
    connectors,
} = require('@azure/functions-extensions-connectors');

connectors.teams.onNewChannelMessage('OnNewChannelMessage', {
    handler: async (context, invocationContext) => {
        invocationContext.log(
            `Received ${context.messages.length} new Teams message(s).`,
        );
    },
});
```

The handler context exposes the messages through the `messages` array.

## Registration

Use the generic `connectorTrigger` function for an operation that doesn't have a connector-specific registration:

```javascript
const {
    connectorTrigger,
} = require('@azure/functions-extensions-connectors');

connectorTrigger('OnConnectorEvent', {
    handler: async (context, invocationContext) => {
        invocationContext.log(JSON.stringify(context.rawPayload));
    },
});
```

The generic registration normalizes the callback envelope but doesn't validate the operation-specific payload shape. Validate the payload before accessing operation-specific properties. Configure the connector, operation, operation parameters, destination function, and callback authentication in the trigger configuration in Azure Connector Namespace.

::: zone-end

::: zone pivot="programming-language-python"

## Examples

The Office 365 Outlook example uses a strongly typed payload registered by the Python connector extension. The SharePoint Online and Microsoft Teams examples bind to `str` and parse the raw JSON because those operations don't currently have registered typed Python converters. These examples intentionally log only basic payload information to stay focused on how to define Connector-triggered functions. Replace the logging with your application's processing logic.

### Office 365 Outlook

The following example runs when a new email arrives in the configured Office 365 Outlook mailbox:

```python
import logging
from typing import List

import azure.functions as func
import azurefunctions.extensions.connectors.office365 as office365

app = func.FunctionApp()


@app.function_name(name="OnNewEmail")
@app.connector_trigger(arg_name="emails")
def on_new_email(
    emails: List[office365.ClientReceiveMessage],
) -> None:
    logging.info(
        "Received %s new email message(s).",
        len(emails),
    )
```

The `ClientReceiveMessage` type is provided by `azurefunctions-extensions-connectors` and represents the Office 365 Outlook messages in the batch.

For the complete code sample, including infrastructure and trigger registration, see [Office 365 Outlook triggers for Python](https://github.com/Azure-Samples/functions-connectors-python/tree/main/office365App).

### SharePoint Online

The following example runs when a file is created in the configured SharePoint Online document library:

```python
import json
import logging

import azure.functions as func

app = func.FunctionApp()


@app.function_name(name="OnSharepointNewFile")
@app.connector_trigger(arg_name="payload")
def on_sharepoint_new_file(payload: str) -> None:
    data = json.loads(payload)
    files = data.get("body", {}).get("value", [])
    logging.info(
        "Received %s new SharePoint file(s).",
        len(files),
    )
```

For the complete code sample, including infrastructure and trigger registration, see [SharePoint Online triggers for Python](https://github.com/Azure-Samples/functions-connectors-python/tree/main/sharepointApp).

### Connector without a strongly typed payload

The following example runs when a new message is added to a Microsoft Teams channel and binds the payload to `str`:

```python
import json
import logging

import azure.functions as func

app = func.FunctionApp()


@app.function_name(name="OnNewChannelMessage")
@app.connector_trigger(arg_name="payload")
def on_new_channel_message(payload: str) -> None:
    data = json.loads(payload)
    messages = data.get("body", {}).get("value", [])
    logging.info(
        "Received %s new Teams message(s).",
        len(messages),
    )
```

To identify connector operations that don't yet have strongly typed Python payloads, see [Operations to Azure Functions signature mapping](https://github.com/Azure/azure-functions-connector-extension/blob/main/docs/operations-functions-match.md).

For the complete code sample, including infrastructure and trigger registration, see [Microsoft Teams triggers for Python](https://github.com/Azure-Samples/functions-connectors-python/tree/main/teamsApp).

## Decorators

Apply `connector_trigger` to the function that receives the event payload:

```python
import azure.functions as func

app = func.FunctionApp()


@app.function_name(name="OnConnectorEvent")
@app.connector_trigger(arg_name="payload")
def on_connector_event(payload: str) -> None:
    # Process the raw JSON payload.
    pass
```

The `arg_name` value identifies the function parameter that receives the payload. Configure the connector, operation, operation parameters, destination function, and callback authentication in the trigger configuration in Azure Connector Namespace.

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

## Configure the trigger

A trigger configuration in Azure Connector Namespace associates an external service event with the destination function callback.

### Trigger configuration values

| Configuration value | Description |
| --- | --- |
| Connection | The authorized managed connector connection, such as Office 365 Outlook or SharePoint Online. |
| Operation name | The connector trigger operation, such as `OnNewEmailV3` or `GetOnNewFileItems`. |
| Parameters | Values required by the operation, such as an Outlook folder or a SharePoint site and document library. |
| Callback URL | The Connector extension webhook endpoint for the destination function. See [Authenticate callbacks](functions-bindings-connector.md#authenticate-callbacks). |
| Function name | The registered function name in your app code. |
| Authentication | The authentication configuration used to call the function app. |

The `functionName` query-string value in the trigger configuration's callback URL must match the registered function name. Valid function names contain 1 to 128 letters, numbers, underscores, or hyphens.

The operation name is defined by the managed connector. You choose the function name in your code, and the trigger configuration maps the operation to that function. The examples in this article use these mappings:

::: zone-end

::: zone pivot="programming-language-csharp"

| Connector event | Operation name | Function name |
| --- | --- | --- |
| New Office 365 Outlook email | `OnNewEmailV3` | `OnNewEmail` |
| New SharePoint Online file | `GetOnNewFileItems` | `OnNewFile` |
| New Microsoft Teams chat or channel message | `WebhookNewMessageTrigger` | `OnNewTeamsMessage` |

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python"

| Connector event | Operation name | Function name |
| --- | --- | --- |
| New Office 365 Outlook email | `OnNewEmailV3` | `OnNewEmail` |
| New SharePoint Online file | `GetOnNewFileItems` | `OnSharepointNewFile` |
| New Microsoft Teams channel message | `WebhookNewMessageTrigger` | `OnNewChannelMessage` |

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

### Create a trigger configuration

Create a trigger configuration by using Azure CLI or the Connector Namespace portal.

Before you create the trigger configuration, create an authorized managed connector connection in your connector namespace and deploy the function app that contains the destination function.

#### [Azure CLI (Bash)](#tab/azure-cli-bash)

The following Bash example uses Azure CLI and `jq` to create an Office 365 Outlook new-email trigger. Replace the placeholder values for your resources and connection:

```bash
resourceGroup="<RESOURCE_GROUP>"
namespaceName="<CONNECTOR_NAMESPACE>"
functionAppName="<FUNCTION_APP>"
functionName="OnNewEmail"
triggerName="<TRIGGER_NAME>"
connectionName="<CONNECTION_NAME>"
connectorName="office365"
operationName="OnNewEmailV3"
subscriptionId=$(az account show --query id --output tsv)

connectorKey=$(az functionapp keys list \
    --resource-group "$resourceGroup" \
    --name "$functionAppName" \
    --query "systemKeys.connector_extension" \
    --output tsv)

callbackUrl="https://${functionAppName}.azurewebsites.net/runtime/webhooks/connector?functionName=${functionName}"

notificationFile=$(mktemp)
trap 'rm -f "$notificationFile"' EXIT

jq -n \
    --arg callbackUrl "$callbackUrl" \
    --arg connectorKey "$connectorKey" \
    '{
        callbackUrl: $callbackUrl,
        authentication: {
            type: "QueryString",
            name: "code",
            value: $connectorKey
        }
    }' > "$notificationFile"

az connector-namespace trigger create \
    --resource-group "$resourceGroup" \
    --namespace "$namespaceName" \
    --name "$triggerName" \
    --connection-details "{connectionName:${connectionName},connectorName:${connectorName}}" \
    --operation-name "$operationName" \
    --parameters "[{name:folderPath,value:'Inbox'}]" \
    --notification-details "@$notificationFile" \
    --description "${connectorName} ${operationName} -> ${functionName}" \
    --metadata "{destinationType:functionApp,functionAppName:${functionAppName},functionAppResourceGroup:${resourceGroup},functionAppSubscriptionId:${subscriptionId},functionName:${functionName},recurrenceFrequency:Minute,recurrenceInterval:'5'}"

rm -f "$notificationFile"
trap - EXIT
```

The `--parameters` value is specific to the connector operation. In this example, `folderPath` selects the Outlook folder to monitor. The callback URL doesn't contain the system key. The `notificationDetails.authentication` object adds the key as a query-string secret when Connector Namespace invokes the function.

#### [Azure CLI (PowerShell)](#tab/azure-cli-powershell)

The following PowerShell example uses Azure CLI to create an Office 365 Outlook new-email trigger. Replace the placeholder values for your resources and connection:

```powershell
$resourceGroup = "<RESOURCE_GROUP>"
$namespaceName = "<CONNECTOR_NAMESPACE>"
$functionAppName = "<FUNCTION_APP>"
$functionName = "OnNewEmail"
$triggerName = "<TRIGGER_NAME>"
$connectionName = "<CONNECTION_NAME>"
$connectorName = "office365"
$operationName = "OnNewEmailV3"
$subscriptionId = az account show --query id --output tsv

$connectorKey = az functionapp keys list `
    --resource-group $resourceGroup `
    --name $functionAppName `
    --query "systemKeys.connector_extension" `
    --output tsv

$callbackUrl = "https://$functionAppName.azurewebsites.net/runtime/webhooks/connector?functionName=$functionName"

$notificationDetails = @{
    callbackUrl = $callbackUrl
    authentication = @{
        type  = "QueryString"
        name  = "code"
        value = $connectorKey
    }
} | ConvertTo-Json -Depth 3 -Compress

$notificationFile = Join-Path $env:TEMP "notification-details.json"
$notificationDetails | Set-Content -Path $notificationFile -NoNewline

az connector-namespace trigger create `
    --resource-group $resourceGroup `
    --namespace $namespaceName `
    --name $triggerName `
    --connection-details "{connectionName:$connectionName,connectorName:$connectorName}" `
    --operation-name $operationName `
    --parameters "[{name:folderPath,value:'Inbox'}]" `
    --notification-details "@$notificationFile" `
    --description "$connectorName $operationName -> $functionName" `
    --metadata "{destinationType:functionApp,functionAppName:$functionAppName,functionAppResourceGroup:$resourceGroup,functionAppSubscriptionId:$subscriptionId,functionName:$functionName,recurrenceFrequency:Minute,recurrenceInterval:'5'}"

Remove-Item $notificationFile -ErrorAction SilentlyContinue
```

The `--parameters` value is specific to the connector operation. In this example, `folderPath` selects the Outlook folder to monitor. The callback URL doesn't contain the system key. The `notificationDetails.authentication` object adds the key as a query-string secret when Connector Namespace invokes the function.

#### [Portal](#tab/portal)

1. If you don't already have a connector namespace, [create a connector namespace](../connector-namespace/create-connector-namespace.md).

1. Go to the [Connector Namespace portal](https://connectors.azure.com/), and then select your namespace.

1. In the namespace menu, select **Triggers**, and then select **Create**.

1. Find the managed connector you want to use, and then select the event that should trigger the function.

1. On the trigger configuration page, create a connection or select an existing connection. Creating a connection requires a one-time authentication with the external service.

1. Provide the inputs required by the event. For example, the Office 365 Outlook new-email event requires the folder to monitor for new messages.

1. For **Destination type**, select **Azure Functions**. Select the function app that contains your Connector trigger code, and then select the specific destination function.

1. Review the configuration, and then select **Create**.

---

::: zone-end

::: zone pivot="programming-language-csharp"

## Usage

The trigger binds the JSON request body to any of the [.NET binding types supported by the extension](functions-bindings-connector.md#binding-types).

Connector operations can return one event or a batch of events. Use the operation-specific payload model because its shape represents the response contract for that connector operation.

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

## Usage

The generic registration receives a `ConnectorTriggerContext<T>`. Its `payload` property contains the normalized callback envelope, `items` contains the event items, and `rawPayload` preserves the original request body. Connector-specific registrations provide named typed arrays, such as `emails`, `files`, or `messages`.

For an operation without a connector-specific registration, the item type defaults to `unknown`. Validate the payload before you access operation-specific properties.

::: zone-end

::: zone pivot="programming-language-python"

## Usage

The trigger can bind the request body to `str`, `dict`, or `bytes`. When `azurefunctions-extensions-connectors` registers a converter for the function's SDK annotation, the worker instead deserializes the request body into the supported operation-specific type.

Connector operations can return one event or a batch of events. Use the type or collection annotation identified for the operation in the [operation signature mapping](https://github.com/Azure/azure-functions-connector-extension/blob/main/docs/operations-functions-match.md).

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

The extension accepts HTTP `POST` and `PUT` requests with the `application/json` content type. A nonempty request body must contain valid JSON. The extension rejects request bodies larger than 10 MB.

## Metadata

The Connector trigger currently doesn't expose callback headers or other request metadata as binding data. The extension defines an [empty binding data contract](https://github.com/Azure/azure-functions-connector-extension/blob/main/src/Microsoft.Azure.Functions.Extensions.Connector/ConnectorTriggerBinding.cs), so the function receives only the JSON request body in a binding type supported by the selected language.

## Next steps

- [Connector extension overview](functions-bindings-connector.md)
- [Use managed connectors in Azure Functions](functions-connectors-overview.md)
- [Azure Functions Connectors Samples](https://github.com/Azure-Samples/functions-connectors)
- [What is Azure Connector Namespace?](../connector-namespace/connector-namespace-overview.md)
- [Connectors reference](/connectors/connector-reference/)

::: zone-end
