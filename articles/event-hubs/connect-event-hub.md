---
title: Connect to an Azure event hub - .NET
description: This article shows different ways of connecting to an event hub in Azure Event Hubs. 
ms.topic: how-to
ms.date: 09/16/2022 
---

# Connect to an event hub (.NET)
This article shows how to connect t an event hub in different ways by using the .NET SDK. The examples use [EventHubProducerClient](/dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient), which is used to send messages to an event hub. You can use similar variations of constructors for [EventHubConsumerClient](/dotnet/api/azure.messaging.eventhubs.consumer.eventhubconsumerclient) to consume events from an event hub. 

## Connect using a connection string
This section shows how to connect to an event hub using a connection string to a namespace or an event hub. 

If you have connection string to the namespace and you know the event hub name, you could use the [EventHubProducerClient](/dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient) constructor that has the connection string and the event hub name parameter. 

```csharp
// Use the constructor that takes the connection string to the namespace and event hub name
producerClient = new EventHubProducerClient(NAMESPACE-CONNECTIONSTRING, EVENTHUBNAME);
```

Alternatively, you can append `;EntityPath=<EVENTHUBNAME>` the namespace's connection string and use the constructor that takes only the connection string. Here's an exmaple: `NAMESPACECONNECTIONSTRING;EntityPath=<EVENTHUBNAME>`. You can also use this constructor if you have a connection string to the event hub (not the namespace).

```csharp
// Use the constructor that takes the connection string to the namespace and event hub name
producerClient = new EventHubProducerClient(connectionString);
```

## Connect using a policy name and its key value
The following example shows you how to connect to an event hub using a SAS policy name and its key value. 

```csharp
//use the constructor that takes AzureNamedKeyCredential parameter
producerClient = new EventHubProducerClient("<NAMESPACENAME>.servicebus.windows.net", "EVENTHUBNAME", new AzureNamedKeyCredential("SASPOLICYNAME", "KEYVALUE"));
```

## Connect using a SAS token
The following example shows you how to connect to an event hub using a SAS token that's generated using a SAS policy. 

```csharp
var token = createToken("NAMESPACENAME.servicebus.windows.net", "SASPOLICYNAME", "KEYVALUE");
producerClient = new EventHubProducerClient("NAMESPACENAME.servicebus.windows.net", "EVENTHUBNAME", new AzureSasCredential(token));
```

Here's the sample code for generating a token using a SAS policy and key value:

```csharp
private static string createToken(string resourceUri, string keyName, string key)
{
    TimeSpan sinceEpoch = DateTime.UtcNow - new DateTime(1970, 1, 1);
    var week = 60 * 60 * 24 * 7;
    var expiry = Convert.ToString((int)sinceEpoch.TotalSeconds + week);
    string stringToSign = HttpUtility.UrlEncode(resourceUri) + "\n" + expiry;
    HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key));
    var signature = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(stringToSign)));
    var sasToken = String.Format(CultureInfo.InvariantCulture, "SharedAccessSignature sr={0}&sig={1}&se={2}&skn={3}", HttpUtility.UrlEncode(resourceUri), HttpUtility.UrlEncode(signature), expiry, keyName);
    return sasToken;
}
```

## Connect using Azure AD application

1. Create an Azure AD application.
1. Grant application

```csharp
var clientSecretCredential = new ClientSecretCredential("TENANTID", "CLIENTID", "CLIENTSECRET");
producerClient = new EventHubProducerClient("NAMESPACENAME.servicebus.windows.net", "EVENTHUBNAME", clientSecretCredential);
```

## Next steps

You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](./event-hubs-about.md)
* [Create an event hub](event-hubs-create.md)
