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
> * [Setup your development environment](../../../../quickstarts/setup-platform.md?tabs=vs&pivots=programmming-language-csharp)
> * [Create an empty sample project](../../../../quickstarts/create-project.md?pivots=programmming-language-csharp)
> * [Create an Azure Speech resource](../../../../get-started.md)
> * [Upload a source file to an Azure blob](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal)

## Open your project in Visual Studio

The first step is to make sure that you have your project open in Visual Studio.

1. Launch Visual Studio 2019.
2. Load your project and open `Program.cs`.

## Add a reference to Newtonsoft.Json

1. In the Solution Explorer, right-click the **helloworld** project, and then select **Manage NuGet Packages** to show the NuGet Package Manager.

1. In the upper-right corner, find the **Package Source** drop-down box, and make sure that **`nuget.org`** is selected.

1. In the upper-left corner, select **Browse**.

1. In the search box, type *newtonsoft.json* and select **Enter**.

1. From the search results, select the [**Newtonsoft.Json**](https://www.nuget.org/packages/Newtonsoft.Json) package, and then select **Install** to install the latest stable version.

1. Accept all agreements and licenses to start the installation.

   After the package is installed, a confirmation appears in the **Package Manager Console** window.

## Start with some boilerplate code

Let's add some code that works as a skeleton for our project.

[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/from-blob/program.cs?range=6-43,138,277)]

[!INCLUDE [placeholder-replacements](../placeholder-replacement.md)]

## JSON Wrappers

As the REST API's take requests in JSON format and also return results in JSON we could interact with them using only strings, but that's not recommended.
In order to make the requests and responses easier to manage, we'll declare a few classes to use for serializing / deserializing the JSON.

Go ahead and put their declarations after `TranscribeAsync`.
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/from-blob/program.cs?range=140-276)]

## Create and configure an Http Client
The first thing we'll need is an Http Client that has a correct base URL and authentication set.
Insert this code in `TranscribeAsync`
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/from-blob/program.cs?range=46-50)]

## Generate a transcription request
Next, we'll generate the transcription request. Add this code to `TranscribeAsync`
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/from-blob/program.cs?range=52-57)]

## Send the request and check its status
Now we post the request to the Speech service and check the initial response code. This response code will simply indicate if the service has received the request. The service will return a Url in the response headers that's the location where it will store the transcription status.
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/from-blob/program.cs?range=59-70)]

## Wait for the transcription to complete
Since the service processes the transcription asynchronously, we need to poll for its status every so often. We'll check every 5 seconds.

We can check the status by retrieving the content at the Url we got when the posted the request. When we get the content back, we deserialize it into one of our helper class to make it easier to interact with.

Here's the polling code with status display for everything except a successful completion, we'll do that next.
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/from-blob/program.cs?range=72-106,121-137)]

## Display the transcription results
Once the service has successfully completed the transcription the results will be stored in another Url that we can get from the status response.

Here we make a request to download those results in to a temporary file before reading and deserializing them.
Once the results are loaded we can print them to the console.
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/from-blob/program.cs?range=107-120)]

## Check your code
At this point, your code should look like this:
(We've added some comments to this version)
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/from-blob/program.cs?range=6-277)]

## Build and run your app

Now you're ready to build your app and test our speech recognition using the Speech service.

1. **Compile the code** - From the menu bar of Visual Studio, choose **Build** > **Build Solution**.
2. **Start your app** - From the menu bar, choose **Debug** > **Start Debugging** or press **F5**.
3. **Start recognition** - It'll prompt you to speak a phrase in English. Your speech is sent to the Speech service, transcribed as text, and rendered in the console.

## Next steps

[!INCLUDE [footer](./footer.md)]
