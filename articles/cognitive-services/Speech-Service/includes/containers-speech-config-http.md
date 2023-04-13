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

Speech containers provide websocket-based query endpoint APIs that are accessed through the Speech SDK. By default, the Speech SDK uses the Speech service in the cloud. To use the container, you need to change the initialization method.

> [!IMPORTANT]
> When you use the Speech service with containers, be sure to use host authentication. If you configure the key and region, requests will go to the public Speech service. Results from the Speech service might not be what you expect. Requests from disconnected containers will fail.

::: zone pivot="programming-language-csharp"
Change from using this Azure-cloud initialization call:

```csharp
var config = SpeechConfig.FromSubscription(...);
```

To using this call with the container [host](/dotnet/api/microsoft.cognitiveservices.speech.speechconfig.fromhost):

```csharp
var config = SpeechConfig.FromHost(
    new Uri("http://localhost:5000"));
```
::: zone-end

::: zone pivot="programming-language-cpp"
Change from using this Azure-cloud initialization call:

```cpp
auto speechConfig = SpeechConfig::FromSubscription(...);
```

To using this call with the container [host](/cpp/cognitive-services/speech/speechconfig#fromhost):

```cpp
auto speechConfig = SpeechConfig::FromHost("http://localhost:5000");
```
::: zone-end

::: zone pivot="programming-language-go"
Change from using this Azure-cloud initialization call:

```go
speechConfig, err := speech.NewSpeechConfigFromSubscription(...)
```

To using this call with the container host:

```go
speechConfig, err := speech.NewSpeechConfigFromHost("http://localhost:5000")
```
::: zone-end

::: zone pivot="programming-language-java"
Change from using this Azure-cloud initialization call:

```java
SpeechConfig speechConfig = SpeechConfig.fromSubscription(...);
```

To using this call with the container [host](/java/api/com.microsoft.cognitiveservices.speech.speechconfig#com-microsoft-cognitiveservices-speech-speechconfig-fromhost(java-net-uri)):

```java
SpeechConfig speechConfig = SpeechConfig.fromHost("http://localhost:5000");
```
::: zone-end

::: zone pivot="programming-language-javascript"
Change from using this Azure-cloud initialization call:

```javascript
const speechConfig = sdk.SpeechConfig.fromSubscription(...);
```

To using this call with the container [host](/javascript/api/microsoft-cognitiveservices-speech-sdk/speechconfig#microsoft-cognitiveservices-speech-sdk-speechconfig-fromhost):

```javascript
const speechConfig = sdk.SpeechConfig.fromHost("http://localhost:5000");
```
::: zone-end

::: zone pivot="programming-language-objectivec"
Change from using this Azure-cloud initialization call:

```objectivec
SPXSpeechConfiguration *speechConfig = [[SPXSpeechConfiguration alloc] initWithSubscription:...];
```

To using this call with the container [host](/objectivec/cognitive-services/speech/spxspeechconfiguration#initwithhost):

```objectivec
SPXSpeechConfiguration *speechConfig = [[SPXSpeechConfiguration alloc] initWithHost:"http://localhost:5000"];
```
::: zone-end

::: zone pivot="programming-language-swift"
Change from using this Azure-cloud initialization call:

```swift
let speechConfig = SPXSpeechConfiguration(subscription: "", region: "");
```

To using this call with the container [host](/objectivec/cognitive-services/speech/spxspeechconfiguration#initwithhost):

```swift
let speechConfig = SPXSpeechConfiguration(host: "http://localhost:5000");
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
    host="http://localhost:5000")
```
::: zone-end

::: zone pivot="programming-language-rest"
Set the host to `"http://localhost:5000"`
::: zone-end

::: zone pivot="programming-language-cli"
For information about how to configure the Speech CLI, see [Get started with the Azure Speech CLI](../spx-basics.md?tabs=dockerinstall#download-and-install).
::: zone-end

