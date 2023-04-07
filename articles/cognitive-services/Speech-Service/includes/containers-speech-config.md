---
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 04/06/2023
ms.author: eur
ms.custom: devx-track-csharp
---

Speech containers provide websocket-based query endpoint APIs that are accessed through the Speech SDK. By default, the Speech SDK uses online speech services. To use the container, you need to change the initialization method.

> [!IMPORTANT]
> When you use the Speech service with containers, be sure to use host authentication. If you configure the key and region, requests will go to the public Speech service. Results from the Speech service might not be what you expect. Requests from disconnected containers will fail.

::: zone pivot="programming-language-csharp"
Change from using this Azure-cloud initialization call:

```csharp
var config = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");
```

To using this call with the container [host](/dotnet/api/microsoft.cognitiveservices.speech.speechconfig.fromhost):

```csharp
var config = SpeechConfig.FromHost(
    new Uri("ws://localhost:5000"));
```
::: zone-end

::: zone pivot="programming-language-cpp"
```cpp
auto speechConfig = SpeechConfig::FromSubscription("YourSpeechKey", "YourSpeechRegion");
```
::: zone-end

::: zone pivot="programming-language-go"
```go
speechConfig, err := speech.NewSpeechConfigFromSubscription("YourSpeechKey", "YourSpeechRegion")
```
::: zone-end

::: zone pivot="programming-language-java"
```java
SpeechConfig speechConfig = SpeechConfig.fromSubscription("YourSpeechKey", "YourSpeechRegion");
```
::: zone-end

::: zone pivot="programming-language-javascript"
```javascript
const speechConfig = sdk.SpeechConfig.fromSubscription("YourSpeechKey", "YourSpeechRegion");
```
::: zone-end

::: zone pivot="programming-language-objectivec"
```objectivec
SPXSpeechConfiguration *speechConfig = [[SPXSpeechConfiguration alloc] initWithSubscription:"YourSubscriptionKey" region:"YourServiceRegion"];
```
::: zone-end

::: zone pivot="programming-language-swift"
```swift
let speechConfig = SPXSpeechConfiguration(subscription: "YourSubscriptionKey", region: "YourServiceRegion");
```
::: zone-end

::: zone pivot="programming-language-python"
Change from using this Azure-cloud initialization call:

```python
speech_config = speechsdk.SpeechConfig(
    subscription=speech_key, region=service_region)
```

To using this call with the container [endpoint](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig):

```python
speech_config = speechsdk.SpeechConfig(
    host="ws://localhost:5000")
```
::: zone-end

::: zone pivot="programming-language-rest"
::: zone-end

::: zone pivot="programming-language-cli"
For information about how to configure the Speech CLI, see [Get started with the Azure Speech CLI](spx-basics.md?tabs=dockerinstall#download-and-install).
::: zone-end

