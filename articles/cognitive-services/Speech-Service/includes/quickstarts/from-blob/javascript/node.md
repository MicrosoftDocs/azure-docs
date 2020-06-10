---
author: IEvangelist
ms.service: cognitive-services
ms.topic: include
ms.date: 03/12/2020
ms.author: dapine
---

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md?tabs=vs&pivots=programmming-language-javascript)
> * [Create an Azure Speech resource](../../../../get-started.md)
> * [Upload a source file to an Azure blob](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal)

## Create a new JS file

The first step is to make sure that you have your project open in your favorite editor.

Call your file index.js.

## Start with some boilerplate code

Let's add some code that works as a skeleton for our project.

```JavaScript
const https = require("https");

// Replace with your subscription key
SubscriptionKey = "YourSubscriptionKey";

// Update with your service region
Region = "YourServiceRegion";
Port = 443;

// Recordings and locale
Locale = "en-US";
RecordingsBlobUri = "YourFileUrl";

// Name and description
Name = "Simple transcription";
Description = "Simple transcription description";

SpeechToTextBasePath = "/api/speechtotext/v2.0/";
```

[!INCLUDE [placeholder-replacements](../placeholder-replacement.md)]

## JSON Wrappers

As the REST API's take requests in JSON format and also return results in JSON.
In order to make the requests and responses easier to understand, we'll declare a few classes to use for serializing / deserializing the JSON.


```JavaScript
class ModelIdentity {
    id;
}

class Transcription {
    Name;
    Description;
    Locale;
    RecordingsUrl;
    ResultsUrls;
    Id;
    CreatedDateTime;
    LastActionDateTime;
    Status;
    StatusMessage;
}

class TranscriptionDefinition {
    Name;
    Description;
    RecordingsUrl;
    Locale;
    Models;
    Properties;
}
```

## Create an initial transcription request.
Next, we'll generate the transcription request.

```JavaScript
const ts = {
    Name: Name,
    Description: Description,
    Locale: Locale,
    RecordingsUrl: RecordingsBlobUri,
    Properties: {
        "PunctuationMode": "DictatedAndAutomatic",
        "ProfanityFilterMode": "Masked",
        "AddWordLevelTimestamps": "True"
    },
    Models: []
}

const postPayload = JSON.stringify(ts);

const startOptions = {
    hostname: Region + ".cris.ai",
    port: Port,
    path: SpeechToTextBasePath + "Transcriptions/",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        'Content-Length': postPayload.length,
        "Ocp-Apim-Subscription-Key": SubscriptionKey
    }
}
```

## Send the transcription request.
Now we post the request to the Speech service and check the initial response code. This response code will simply indicate if the service has received the request. The service will return a Url in the response headers that's the location where it will store the transcription status.

Then we'll call a method `CheckTranscriptionStatus` to check on the status and eventually print the results. We'll implement `CheckTranscriptionStatus` next.

```JavaScript
const request = https.request(startOptions, (response) => {
    if (response.statusCode != 202) {
        console.error("Error, status code " + response.statusCode);
    } else {

        const transcriptionLocation = response.headers.location;

        console.info("Created transcription at location " + transcriptionLocation);
        console.info("Checking status.");

        CheckTranscriptionStatus(transcriptionLocation);
    }
});

request.on("error", error => {
    console.error(error);
});

request.write(postPayload);
request.end();
```

## Check the requests status
Since the service processes the transcription asynchronously, we need to poll for its status every so often. We'll check every 5 seconds.

We can check the status by retrieving the content at the Url we got when the posted the request. When we get the content back, we deserialize it into one of our helper class to make it easier to interact with.

Here's the polling code with status display for everything except a successful completion, we'll do that next. 

`CheckTranscriptionStatus` takes the status URL from the transcription request and polls it every 5 seconds until it indicates success or and error. It then calls `PrintResults` to print the results of the transcription. We'll implement `PrintResults` next.
```csharp
function CheckTranscriptionStatus(statusUrl) {
    transcription = null;
    const fetchOptions = {
        headers: {
            "Ocp-Apim-Subscription-Key": SubscriptionKey
        }
    }

    const fetchRequest = https.get(new URL(statusUrl), fetchOptions, (response) => {
        if (response.statusCode !== 200) {
            console.info("Error retrieving status: " + response.statusCode);
        } else {
            let responseText = '';
            response.setEncoding('utf8');
            response.on("data", (chunk) => {
                responseText += chunk;
            });

            response.on("end", () => {
                const statusObject = JSON.parse(responseText);

                var done = false;
                switch (statusObject.status) {
                    case "Failed":
                        console.info("Transcription failed. Status: " + transcription.StatusMessage);
                        done = true;
                        break;
                    case "Succeeded":
                        done = true;
                        PrintResults(statusObject.resultsUrls["channel_0"]);
                        break;
                    case "Running":
                        console.info("Transcription is still running.");
                        break;
                    case "NotStarted":
                        console.info("Transcription has not started.");
                        break;
                }

                if (!done) {
                    setTimeout(() => {
                        CheckTranscriptionStatus(statusUrl);
                    }, (5000));
                }
            });
        }
    });

    fetchRequest.on("error", error => {
        console.error(error);
    });
}
```

## Display the transcription results
Once the service has successfully completed the transcription the results will be stored in another Url that we can get from the status response. Here we make a request to download those results in to a temporary file before reading and deserializing them.
Once the results are loaded we can print them to the console. 

```JavaScript
function PrintResults(resultUrl)
{
    const fetchOptions = {
        headers: {
            "Ocp-Apim-Subscription-Key": SubscriptionKey
        }
    }

    const fetchRequest = https.get(new URL(resultUrl), fetchOptions, (response) => {
        if (response.statusCode !== 200) {
            console.info("Error retrieving status: " + response.statusCode);
        } else {
            let responseText = '';
            response.setEncoding('utf8');
            response.on("data", (chunk) => {
                responseText += chunk;
            });

            response.on("end", () => {
                console.info("Transcription Results:");
                console.info(responseText);
            });
        }
    });
}
```

## Check your code
At this point, your code should look like this:

```JavaScript
const https = require("https");

// Replace with your subscription key
SubscriptionKey = "YourSubscriptionKey";

// Update with your service region
Region = "YourServiceRegion";
Port = 443;

// Recordings and locale
Locale = "en-US";
RecordingsBlobUri = "YourFileUrl";

// Name and description
Name = "Simple transcription";
Description = "Simple transcription description";

SpeechToTextBasePath = "/api/speechtotext/v2.0/";

class ModelIdentity {
    id;
}

class Transcription {
    Name;
    Description;
    Locale;
    RecordingsUrl;
    ResultsUrls;
    Id;
    CreatedDateTime;
    LastActionDateTime;
    Status;
    StatusMessage;
}

class TranscriptionDefinition {
    Name;
    Description;
    RecordingsUrl;
    Locale;
    Models;
    Properties;
}

const ts = {
    Name: Name,
    Description: Description,
    Locale: Locale,
    RecordingsUrl: RecordingsBlobUri,
    Properties: {
        "PunctuationMode": "DictatedAndAutomatic",
        "ProfanityFilterMode": "Masked",
        "AddWordLevelTimestamps": "True"
    },
    Models: []
}

const postPayload = JSON.stringify(ts);

const startOptions = {
    hostname: Region + ".cris.ai",
    port: Port,
    path: SpeechToTextBasePath + "Transcriptions/",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        'Content-Length': postPayload.length,
        "Ocp-Apim-Subscription-Key": SubscriptionKey
    }
}

function PrintResults(resultUrl)
{
    const fetchOptions = {
        headers: {
            "Ocp-Apim-Subscription-Key": SubscriptionKey
        }
    }

    const fetchRequest = https.get(new URL(resultUrl), fetchOptions, (response) => {
        if (response.statusCode !== 200) {
            console.info("Error retrieving status: " + response.statusCode);
        } else {
            let responseText = '';
            response.setEncoding('utf8');
            response.on("data", (chunk) => {
                responseText += chunk;
            });

            response.on("end", () => {
                console.info("Transcription Results:");
                console.info(responseText);
            });
        }
    });
}

function CheckTranscriptionStatus(statusUrl) {
    transcription = null;
    const fetchOptions = {
        headers: {
            "Ocp-Apim-Subscription-Key": SubscriptionKey
        }
    }

    const fetchRequest = https.get(new URL(statusUrl), fetchOptions, (response) => {
        if (response.statusCode !== 200) {
            console.info("Error retrieving status: " + response.statusCode);
        } else {
            let responseText = '';
            response.setEncoding('utf8');
            response.on("data", (chunk) => {
                responseText += chunk;
            });

            response.on("end", () => {
                const statusObject = JSON.parse(responseText);

                var done = false;
                switch (statusObject.status) {
                    case "Failed":
                        console.info("Transcription failed. Status: " + transcription.StatusMessage);
                        done = true;
                        break;
                    case "Succeeded":
                        done = true;
                        PrintResults(statusObject.resultsUrls["channel_0"]);
                        break;
                    case "Running":
                        console.info("Transcription is still running.");
                        break;
                    case "NotStarted":
                        console.info("Transcription has not started.");
                        break;
                }

                if (!done) {
                    setTimeout(() => {
                        CheckTranscriptionStatus(statusUrl);
                    }, (5000));
                }
            });
        }
    });

    fetchRequest.on("error", error => {
        console.error(error);
    });
}

const request = https.request(startOptions, (response) => {
    if (response.statusCode != 202) {
        console.error("Error, status code " + response.statusCode);
    } else {

        const transcriptionLocation = response.headers.location;

        console.info("Created transcription at location " + transcriptionLocation);
        console.info("Checking status.");

        CheckTranscriptionStatus(transcriptionLocation);
    }
});

request.on("error", error => {
    console.error(error);
});

request.write(postPayload);
request.end();
```

## Run your app

Now you're ready to build your app and test our speech recognition using the Speech service.

**Start your app** - Run node index.js.

## Next steps

[!INCLUDE [footer](./footer.md)]
