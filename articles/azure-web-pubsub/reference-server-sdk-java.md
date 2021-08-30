---
title: Reference - Java server SDK for Azure Web PubSub service
description: The reference describes the Java server SDK for Azure Web PubSub service
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 08/26/2021
---

# Java server SDK for Azure Web PubSub service

Use the library to:

- Send messages to hubs and groups.
- Send messages to particular users and connections.
- Organize users and connections into groups.
- Close connections
- Grant/revoke/check permissions for an existing connection

[Source code][source_code] | [API Reference Documentation][api] | [Product Documentation][product_documentation] | [Samples][samples_readme]

## Getting started

### Prerequisites

- A [Java Development Kit (JDK)][jdk_link], version 8 or later.
- [Azure Subscription][azure_subscription]

### Include the Package

[//]: # ({x-version-update-start;com.azure:azure-messaging-webpubsub;current})

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-messaging-webpubsub</artifactId>
    <version>1.0.0-beta.2</version>
</dependency>
```

[//]: # ({x-version-update-end})

### Create a Web PubSub client using connection string

```java
WebPubSubServiceClient webPubSubServiceClient = new WebPubSubClientBuilder()
    .connectionString("{connection-string}")
    .hub("chat")
    .buildClient();
```

### Create a Web PubSub client using access key

```java
WebPubSubServiceClient webPubSubServiceClient = new WebPubSubClientBuilder()
    .credential(new AzureKeyCredential("{access-key}"))
    .endpoint("<Insert endpoint from Azure Portal>")
    .hub("chat")
    .buildClient();
```

### Create a Web PubSub Group client
```java
WebPubSubServiceClient webPubSubServiceClient = new WebPubSubClientBuilder()
    .credential(new AzureKeyCredential("{access-key}"))
    .hub("chat")
    .buildClient();
WebPubSubGroup javaGroup = webPubSubServiceClient.getGroup("java");
```

## Key concepts

[!INCLUDE [Terms](includes/terms.md)]


## Examples

### Broadcast message to entire hub

```java
webPubSubServiceClient.sendToAll("Hello world!");
```

### Broadcast message to a group

```java
WebPubSubGroup javaGroup = webPubSubServiceClient.getGroup("Java");
javaGroup.sendToAll("Hello Java!");
```

### Send message to a connection

```java
webPubSubServiceClient.sendToConnection("myconnectionid", "Hello connection!");
```

### Send message to a user
```java
webPubSubServiceClient.sendToUser("Andy", "Hello Andy!");
```

## Troubleshooting

### Enable client logging
You can set the `AZURE_LOG_LEVEL` environment variable to view logging statements made in the client library. For
example, setting `AZURE_LOG_LEVEL=2` would show all informational, warning, and error log messages. The log levels can
be found here: [log levels][log_levels].

### Default HTTP Client
All client libraries by default use the Netty HTTP client. Adding the above dependency will automatically configure
the client library to use the Netty HTTP client. Configuring or changing the HTTP client is detailed in the
[HTTP clients wiki](/azure/developer/java/sdk/http-client-pipeline).

### Default SSL library
All client libraries, by default, use the Tomcat-native Boring SSL library to enable native-level performance for SSL
operations. The Boring SSL library is an uber jar containing native libraries for Linux / macOS / Windows, and provides
better performance compared to the default SSL implementation within the JDK. For more information, including how to
reduce the dependency size, see the [performance tuning][performance_tuning] section of the wiki.

[azure_subscription]: https://azure.microsoft.com/free
[jdk_link]: /java/azure/jdk
[source_code]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/webpubsub/azure-messaging-webpubsub/src
[product_documentation]: https://aka.ms/awps/doc
[samples_readme]: https://github.com/Azure/azure-webpubsub/tree/main/samples/java
[log_levels]: https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/core/azure-core/src/main/java/com/azure/core/util/logging/ClientLogger.java
[performance_tuning]: https://github.com/Azure/azure-sdk-for-java/wiki/Performance-Tuning
[api]: /java/api/com.azure.messaging.webpubsub

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
