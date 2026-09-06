---
title: Use Azure Identity with WebPubSubServiceClient
description: Learn how to authenticate WebPubSubServiceClient with Microsoft Entra ID in .NET, Java, JavaScript, and Python.
author: terencefan
ms.author: lianwei
ms.date: 08/28/2026
ms.service: azure-web-pubsub
ms.custom:
  - devx-track-dotnet
  - devx-track-extended-java
  - devx-track-js
  - devx-track-python
ms.topic: how-to
---

# Use Azure Identity with `WebPubSubServiceClient`

This article shows how to create a `WebPubSubServiceClient` that uses Microsoft Entra ID to authorize requests to Azure Web PubSub.

## Prerequisites

- An Azure subscription.
- An existing Azure Web PubSub resource.
- A Microsoft Entra identity, such as an [application](howto-authorize-from-application.md) or a [managed identity](howto-authorize-from-managed-identity.md).

> [!IMPORTANT]
> Assign the Microsoft Entra identity an Azure role that includes the data-plane permissions required by the SDK operations your application calls. To generate a client access token and use it to connect, the identity requires both `Microsoft.SignalRService/WebPubSub/clientConnection/generateToken/action` and `Microsoft.SignalRService/WebPubSub/clientConnection/write`. The built-in **Web PubSub Service Owner** role includes both permissions but grants access to all data-plane APIs. No narrower built-in role includes both permissions. For least-privilege access, use a custom role that contains only the permissions your application needs.

Choose a language:

# [C#](#tab/csharp)

Install the Azure Identity and Azure Web PubSub packages:

```dotnetcli
dotnet add package Azure.Identity
dotnet add package Azure.Messaging.WebPubSub
```

Create a `DefaultAzureCredential`, and pass it to `WebPubSubServiceClient`:

```csharp
using Azure.Identity;
using Azure.Messaging.WebPubSub;

var credential = new DefaultAzureCredential();
var client = new WebPubSubServiceClient(
    new Uri("<endpoint>"),
    "<hub>",
    credential);
```

For other credential types, see the [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme).

### Use dependency injection

Install the dependency injection package:

```dotnetcli
dotnet add package Microsoft.Extensions.Azure
```

Register `WebPubSubServiceClient` with the service collection:

```csharp
using Azure.Identity;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.DependencyInjection;

void ConfigureServices(IServiceCollection services)
{
    services.AddAzureClients(builder =>
    {
        builder.AddWebPubSubServiceClient(
            new Uri("<endpoint>"),
            "<hub>",
            new DefaultAzureCredential());
    });
}
```

For more information, see the [Azure Web PubSub service client library for .NET](/dotnet/api/overview/azure/messaging.webpubsub-readme) and the [complete sample](https://github.com/Azure/azure-webpubsub/tree/main/samples/csharp/chatapp-microsoft-entra-id).

# [Java](#tab/java)

Add the Azure Identity and Azure Web PubSub dependencies to your `pom.xml`:

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-identity</artifactId>
  <version>1.4.1</version>
</dependency>
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-messaging-webpubsub</artifactId>
  <version>1.0.0</version>
</dependency>
```

Create a `DefaultAzureCredential`, and pass it to `WebPubSubServiceClientBuilder`:

```java
import com.azure.core.credential.TokenCredential;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.messaging.webpubsub.WebPubSubServiceClient;
import com.azure.messaging.webpubsub.WebPubSubServiceClientBuilder;

public class App {
    public static void main(String[] args) {
        TokenCredential credential = new DefaultAzureCredentialBuilder().build();
        WebPubSubServiceClient client = new WebPubSubServiceClientBuilder()
            .endpoint("<endpoint>")
            .credential(credential)
            .hub("<hub>")
            .buildClient();
    }
}
```

For other credential types, see the [Azure Identity client library for Java](/java/api/overview/azure/identity-readme). For more information about the service client, see the [Azure Web PubSub service client library for Java](/java/api/overview/azure/messaging-webpubsub-readme).

# [JavaScript](#tab/javascript)

Install the Azure Identity and Azure Web PubSub packages:

```bash
npm install @azure/identity @azure/web-pubsub
```

Create a `DefaultAzureCredential`, and pass it to `WebPubSubServiceClient`:

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const credential = new DefaultAzureCredential();
const serviceClient = new WebPubSubServiceClient(
  "<endpoint>",
  credential,
  "<hub>"
);
```

For other credential types, see the [Azure Identity client library for JavaScript](/javascript/api/overview/azure/identity-readme). For more information about the service client, see the [Azure Web PubSub service client library for JavaScript](/javascript/api/overview/azure/web-pubsub-readme).

# [Python](#tab/python)

Install the Azure Identity and Azure Web PubSub packages:

```bash
python -m pip install azure-identity azure-messaging-webpubsubservice
```

Create a `DefaultAzureCredential`, and pass it to `WebPubSubServiceClient`:

```python
from azure.identity import DefaultAzureCredential
from azure.messaging.webpubsubservice import WebPubSubServiceClient

credential = DefaultAzureCredential()
client = WebPubSubServiceClient(
    hub="<hub>",
    endpoint="<endpoint>",
    credential=credential,
)
```

For other credential types, see the [Azure Identity client library for Python](/python/api/overview/azure/identity-readme). For more information about the service client, see the [Azure Web PubSub service client library for Python](/python/api/overview/azure/messaging-webpubsubservice-readme).

---

## Related content

- [Authorize access with Microsoft Entra ID](concept-azure-ad-authorization.md)
- [Generate a client access URL](howto-generate-client-access-url.md)
