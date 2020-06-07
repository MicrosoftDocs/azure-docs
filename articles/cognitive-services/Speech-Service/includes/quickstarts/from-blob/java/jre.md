---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 01/13/2020
ms.author: trbye
---

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md?tabs=jre&pivots=programmming-language-java)
> * [Create an Azure Speech resource](../../../../get-started.md)
> * [Upload a source file to an Azure blob](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal)


## Open your project in Eclipse

The first step is to make sure that you have your project open in Eclipse.

1. Launch Eclipse
2. Load your project and open `Main.java`.

## Add a reference to Gson
We'll be using an external JSON serializer / deserializer in this quickstart. For Java we've chosen [Gson](https://github.com/google/gson).

Open your pom.xml and add the following reference.

[!code-xml[](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/from-blob/pom.xml?range=19-25)]

## Start with some boilerplate code

Let's add some code that works as a skeleton for our project.

[!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/from-blob/src/quickstart/Main.java?range=1-13,95-105,206-207)]

[!INCLUDE [placeholder-replacements](../placeholder-replacement.md)]

## JSON Wrappers

As the REST API's take requests in JSON format and also return results in JSON we could interact with them using only strings, but that's not recommended.
In order to make the requests and responses easier to manage, we'll declare a few classes to use for serializing / deserializing the JSON.

Go ahead and put their declarations before `Main`.
[!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/from-blob/src/quickstart/Main.java?range=15-93)]

## Create and configure an Http Client
The first thing we'll need is an Http Client that has a correct base URL and authentication set.
Insert this code in `Main`
[!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/from-blob/src/quickstart/Main.java?range=106-113)]

## Generate a transcription request
Next, we'll generate the transcription request. Add this code to `Main`
[!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/from-blob/src/quickstart/Main.java?range=115-116)]

## Send the request and check its status
Now we post the request to the Speech service and check the initial response code. This response code will simply indicate if the service has received the request. The service will return a Url in the response headers that's the location where it will store the transcription status.
[!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/from-blob/src/quickstart/Main.java?range=118-129)]

## Wait for the transcription to complete
Since the service processes the transcription asynchronously, we need to poll for its status every so often. We'll check every 5 seconds.

We can check the status by retrieving the content at the Url we got when the posted the request. When we get the content back, we deserialize it into one of our helper class to make it easier to interact with.

Here's the polling code with status display for everything except a successful completion, we'll do that next.
[!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/from-blob/src/quickstart/Main.java?range=131-159,192-204)]

## Display the transcription results
Once the service has successfully completed the transcription the results will be stored in another Url that we can get from the status response.

We'll download the contents of that URL, deserialize the JSON, and loop through the results printing out the display text as we go.
[!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/from-blob/src/quickstart/Main.java?range=6-160-190)]

## Check your code
At this point, your code should look like this: 
(We've added some comments to this version)
[!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/from-blob/src/quickstart/Main.java]

## Build and run your app

Now you're ready to build your app and test our speech recognition using the Speech service.

## Next steps

[!INCLUDE [footer](./footer.md)]
