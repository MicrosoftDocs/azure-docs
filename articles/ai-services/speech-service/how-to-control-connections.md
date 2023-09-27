---
title: Service connectivity how-to - Speech SDK
titleSuffix: Azure AI services
description: Learn how to monitor for connection status and manually connect or disconnect from the Speech service.
services: cognitive-services
author: trrwilson
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 04/12/2021
ms.author: travisw
zone_pivot_groups: programming-languages-set-thirteen
ms.devlang: cpp, csharp, java
ms.custom: devx-track-csharp, devx-track-extended-java
---

# How to monitor and control service connections with the Speech SDK

`SpeechRecognizer` and other objects in the Speech SDK automatically connect to the Speech service when it's appropriate. Sometimes, you may either want extra control over when connections begin and end or want more information about when the Speech SDK establishes or loses its connection. The supporting `Connection` class provides this capability.

## Retrieve a Connection object

A `Connection` can be obtained from most top-level Speech SDK objects via a static `From...` factory method, for example, `Connection::FromRecognizer(recognizer)` for `SpeechRecognizer`.

::: zone pivot="programming-language-csharp"

```csharp
var connection = Connection.FromRecognizer(recognizer);
```

::: zone-end

::: zone pivot="programming-language-cpp"

```cpp
auto connection = Connection::FromRecognizer(recognizer);
```

::: zone-end

::: zone pivot="programming-language-java"

```java
Connection connection = Connection.fromRecognizer(recognizer);
```

::: zone-end

## Monitor for connections and disconnections

A `Connection` raises `Connected` and `Disconnected` events when the corresponding status change happens in the Speech SDK's connection to the Speech service. You can listen to these events to know the latest connection state.

::: zone pivot="programming-language-csharp"

```csharp
connection.Connected += (sender, connectedEventArgs) =>
{
    Console.WriteLine($"Successfully connected, sessionId: {connectedEventArgs.SessionId}");
};
connection.Disconnected += (sender, disconnectedEventArgs) =>
{
    Console.WriteLine($"Disconnected, sessionId: {disconnectedEventArgs.SessionId}");
};
```

::: zone-end

::: zone pivot="programming-language-cpp"

```cpp
connection->Connected += [&](ConnectionEventArgs& args)
{
    std::cout << "Successfully connected, sessionId: " << args.SessionId << std::endl;
};
connection->Disconnected += [&](ConnectionEventArgs& args)
{
    std::cout << "Disconnected, sessionId: " << args.SessionId << std::endl;
};
```

::: zone-end

::: zone pivot="programming-language-java"

```java
connection.connected.addEventListener((s, connectionEventArgs) -> {
    System.out.println("Successfully connected, sessionId: " + connectionEventArgs.getSessionId());
});
connection.disconnected.addEventListener((s, connectionEventArgs) -> {
    System.out.println("Disconnected, sessionId: " + connectionEventArgs.getSessionId());
});
```

::: zone-end

## Connect and disconnect

`Connection` has explicit methods to start or end a connection to the Speech service. Reasons you may want to control the connection include:

- Preconnecting to the Speech service to allow the first interaction to start as quickly as possible
- Establishing connection at a specific time in your application's logic to gracefully and predictably handle initial connection failures
- Disconnecting to clear an idle connection when you don't expect immediate reconnection but also don't want to destroy the object

Some important notes on the behavior when manually modifying connection state:

- Trying to connect when already connected will do nothing. It will not generate an error. Monitor the `Connected` and `Disconnected` events if you want to know the current state of the connection.
- A failure to connect that originates from a problem that has no involvement with the Speech service--such as attempting to do so from an invalid state--will throw or return an error as appropriate to the programming language. Failures that require network resolution--such as authentication failures--will not throw or return an error but instead generate a `Canceled` event on the top-level object the `Connection` was created from.
- Manually disconnecting from the Speech service during an ongoing interaction results in a connection error and loss of data for that interaction. Connection errors are surfaced on the appropriate top-level object's `Canceled` event.

::: zone pivot="programming-language-csharp"

```csharp
try
{
    connection.Open(forContinuousRecognition: false);
}
catch (ApplicationException ex)
{
    Console.WriteLine($"Couldn't pre-connect. Details: {ex.Message}");
}
// ... Use the SpeechRecognizer
connection.Close();
```

::: zone-end

::: zone pivot="programming-language-cpp"

```cpp
try
{
    connection->Open(false);
}
catch (std::runtime_error&)
{
    std::cout << "Unable to pre-connect." << std::endl;
}
// ... Use the SpeechRecognizer
connection->Close();
```

::: zone-end

::: zone pivot="programming-language-java"

```java
try {
    connection.openConnection(false);
} catch {
   System.out.println("Unable to pre-connect.");
}
// ... Use the SpeechRecognizer
connection.closeConnection();
```

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Explore our samples on GitHub](https://aka.ms/csspeech/samples)
