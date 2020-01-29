---
author: IEvangelist
ms.service: cognitive-services
ms.topic: include
ms.date: 01/13/2020
ms.author: dapine
---

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Setup your development environment](../../../../quickstarts/setup-platform.md?tabs=linux&pivots=programmming-language-cpp)
> * [Create an empty sample project](../../../../quickstarts/create-project.md?pivots=programmming-language-cpp)
> * [Create an Azure Speech resource](../../../../get-started.md)
> * [Upload a source file to an Azure blob](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal)

## Open your project in Visual Studio

The first step is to make sure that you have your project open in Visual Studio.

1. Launch Visual Studio 2019.
2. Load your project and open `helloworld.cpp`.

## Add a references

To speed up our code development we'll be using a couple of external components:
* [CPP Rest SDK](https://github.com/microsoft/cpprestsdk)
    A client library for making REST calls to a REST service.
* [nlohmann/json](https://github.com/nlohmann/json)
    Handy JSON Parsing / Serialization / Deserialization library.

Both can be installed using [vcpkg](https://github.com/Microsoft/vcpkg/).

```
vcpkg install cpprestsdk cpprestsdk:x64-windows
vcpkg install nlohmann-json
```

## Start with some boilerplate code

Let's add some code that works as a skeleton for our project.

[!code-cpp[](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/from-blob/helloworld.cpp?range=7-32,187-190,300-309)]

[!INCLUDE [placeholder-replacements](../placeholder-replacement.md)]

## JSON Wrappers

As the REST API's take requests in JSON format and also return results in JSON we could interact with them using only strings, but that's not recommended.
In order to make the requests and responses easier to manage, we'll declare a few classes to use for serializing / deserializing the JSON and some methods to assist nlohmann/json.

Go ahead and put their declarations before `recognizeSpeech`
.
[!code-cpp[](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/from-blob/helloworld.cpp?range=33-185)]

## Create and configure an Http Client
The first thing we'll need is an Http Client that has a correct base URL and authentication set.
Insert this code in `recognizeSpeech`

[!code-cpp[](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/from-blob/helloworld.cpp?range=191-197)]

## Generate a transcription request
Next, we'll generate the transcription request. Add this code to `recognizeSpeech`

[!code-cpp[](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/from-blob/helloworld.cpp?range=199-203)]

## Send the request and check its status
Now we post the request to the Speech service and check the initial response code. This response code will simply indicate if the service has received the request. The service will return a Url in the response headers that's the location where it will store the transcription status.

[!code-cpp[](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/from-blob/helloworld.cpp?range=204-216)]

## Wait for the transcription to complete
Since the service processes the transcription asynchronously, we need to poll for its status every so often. We'll check every 5 seconds.

We can check the status by retrieving the content at the Url we got when the posted the request. When we get the content back, we deserialize it into one of our helper class to make it easier to interact with.

Here's the polling code with status display for everything except a successful completion, we'll do that next.

[!code-cpp[](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/from-blob/helloworld.cpp?range=222-245,285-299)]

## Display the transcription results
Once the service has successfully completed the transcription the results will be stored in another Url that we can get from the status response.

We'll download the contents of that URL, deserialize the JSON, and loop through the results printing out the display text as we go.

[!code-cpp[](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/from-blob/helloworld.cpp?range=246-284)]

## Check your code
At this point, your code should look like this: 
(We've added some comments to this version)

[!code-cpp[](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/from-blob/helloworld.cpp?range=7-308)]

## Build and run your app

Now you're ready to build your app and test our speech recognition using the Speech service.

## Next steps

[!INCLUDE [footer](./footer.md)]
