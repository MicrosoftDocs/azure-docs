---
title: Azure Batch Transcription API
description: Samples
services: cognitive-services
author: PanosPeriorellis

ms.service: cognitive-services
ms.technology: Speech to Text
ms.topic: article
ms.date: 04/26/2018
ms.author: panosper
---

# Batch transcription

Batch transcription is ideal for use cases with large amounts of audio. It enables the developer to point to audio files and get back transcriptions in asynchronous mode.

## Batch transcription API

The Batch transcription API makes the above scenario possible. It offers asynchronous speech to text transcription along with additional features.

> [!NOTE]
> The Batch transcription API is ideal for Call Centers which typically accumulate thousands of hours of audio. The Fire & Forget philosophy of the API makes it easy to transcribe large volume of audio recordings.

### Supported formats

The Batch transcription API aims to become the de-facto for all offline call center-related scenarios and offer support for all related formats. Currently supported formats:

Name| Channel  |
----|----------|
mp3 |   Mono   |   
mp3 |  Stereo  | 
wav |   Mono   |
wav |  Stereo  |

For stereo audio streams, Batch transcription will split the left and right channel during the transcription. The two JSON files with the result are each created from a single channel. The timestamps per utterance enable the developer to create an ordered final transcript. The following JSON sample shows the output of a channel.

```json
       {
        "recordingsUrl": "https://mystorage.blob.core.windows.net/cris-e2e-datasets/TranscriptionsDataset/small_sentence.wav?st=2018-04-19T15:56:00Z&se=2040-04-21T15:56:00Z&sp=rl&sv=2017-04-17&sr=b&sig=DtvXbMYquDWQ2OkhAenGuyZI%2BYgaa3cyvdQoHKIBGdQ%3D",
        "resultsUrls": {
            "channel_0": "https://mystorage.blob.core.windows.net/bestor-87a0286f-304c-4636-b6bd-b3a96166df28/TranscriptionData/24265e4c-e459-4384-b572-5e3e7795221f?sv=2017-04-17&sr=b&sig=IY2qd%2Fkgtz2PwRe2C88BphH4Hv%2F1VCb1UVJ33xsw%2BEY%3D&se=2018-04-23T14:48:24Z&sp=r"
        },
        "statusMessage": "None.",
        "id": "0bb95356-ff06-469d-acc7-81f9144a269a",
        "createdDateTime": "2018-04-20T14:11:57.167",
        "lastActionDateTime": "2018-04-20T14:12:54.643",
        "status": "Succeeded",
        "locale": "en-US"
    },
```

> [!NOTE]
> The Batch transcription API is using a REST service for requesting transcriptions, their status, and associated results. The API can be used from any language. The next section describes how it is used.

## Authorization token

As with all features of the Unified Speech Service, the user needs to create a subscription key from the [Azure portal](https://portal.azure.com). In addition, an API key needs to be acquired from the Speech Portal. The steps to generate an API key:

1. Log in to https://customspeech.ai.

2. Click on Subscriptions.

3. Click on the option `Generate API Key`.

    ![The Upload View](media/stt/Subscriptions.jpg)

4. Copy and paste that key in the client code in the sample below.

> [!NOTE]
> If you plan to use a custom model then you will need the ID of that model too. Note that this is not the Deployment or Endpoint ID that you find on the Endpoint Details view but the model ID which you can retrieve when you click on the Details of that model

## Sample code

Making use of the API is fairly straight forward. The sample code below needs to be customized with a subscription key and an API key, which in turn allows the developer to obtain a bearer token, as the following code snippet shows:

```cs
    public static async Task<CrisClient> CreateApiV1ClientAsync(string username, string key, string hostName, int port)
        {
            var client = new HttpClient();
            client.Timeout = TimeSpan.FromMinutes(25);
            client.BaseAddress = new UriBuilder(Uri.UriSchemeHttps, hostName, port).Uri;

            var tokenProviderPath = "/oauth/ctoken";
            var clientToken = await CreateClientTokenAsync(client, hostName, port, tokenProviderPath, username, key).ConfigureAwait(false);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", clientToken.AccessToken);

            return new CrisClient(client);
        }
```

Once the token is obtained the developer must specifiy the SAS Uri pointing to the audio file requiring transcription. The rest of the code simply iterates through the status and displays results.

```cs
   static async Task TranscribeAsync()
        { 
            // Creating a Batch transcription API Client
            var client = 
                await CrisClient.CreateApiV1ClientAsync(
                    "<your msa>", // MSA email
                    "<your api key>", // API key
                    "stt.speech.microsoft.com",
                    443).ConfigureAwait(false);
            
            var newLocation = 
                await client.PostTranscriptionAsync(
                    "<selected locale i.e. en-us>", // Locale 
                    "<your subscription key>", // Subscription Key
                    new Uri("<SAS URI to your file>")).ConfigureAwait(false);

            var transcription = await client.GetTranscriptionAsync(newLocation).ConfigureAwait(false);

            while (true)
            {
                transcription = await client.GetTranscriptionAsync(transcription.Id).ConfigureAwait(false);

                if (transcription.Status == "Failed" || transcription.Status == "Succeeded")
                {
                    Console.WriteLine("Transcription complete!");

                    if (transcription.Status == "Succeeded")
                    {
                        var resultsUri = transcription.ResultsUrls["channel_0"];

                        WebClient webClient = new WebClient();

                        var filename = Path.GetTempFileName();
                        webClient.DownloadFile(resultsUri, filename);

                        var results = File.ReadAllText(filename);
                        Console.WriteLine(results);
                    }

                    await client.DeleteTranscriptionAsync(transcription.Id).ConfigureAwait(false);

                    break;
                }
                else
                {
                    Console.WriteLine("Transcription status: " + transcription.Status);
                }

                await Task.Delay(TimeSpan.FromSeconds(5)).ConfigureAwait(false);
            }

            Console.ReadLine();
        }
```

> [!NOTE]
> The subscription key mentioned in the above code snippet is the key from the Speech(Preview) resource that you create on Azure portal. Keys obtained from the Custom Speech Service resource will not work.


Notice the asynchronous setup for posting audio and receiving transcription status. The client created is a .NET Http client. There is a `PostTranscriptions` method for sending the audio file details, and a `GetTranscriptions` method to receive the results. `PostTranscriptions` returns a handle, and  `GetTranscriptions` method is using this handle to create a handle to obtain the transcription status.

The current sample code does not specify any custom models. The service will use the baseline models for transcribing the file(s). If the user wishes to specify the models, one can pass on the same method the modelIDs for the acoustic and the language model. 

If one does not wish to use baseline, one must pass model Ids for both acoustic and language models.

> [!NOTE]
> For baseline transcription the user does not have to declare the Endpoints of the baseline models. If the user wants to use custom models he would have to provide their endpoints IDs as the [Sample](https://github.com/PanosPeriorellis/Speech_Service-BatchTranscriptionAPI). If user wants to use an acoustic baseline with a baseline language model then he would only have to declare the custom model's endpoint ID. Internally our system will figure out the partner baseline model (be it acoustic or language) and use that to fulfill the transcription request.

### Supported storage

Currently the only storage supported is Azure blob.

## Downloading the sample

The sample displayed here is on [GitHub](https://github.com/PanosPeriorellis/Speech_Service-BatchTranscriptionAPI).

> [!NOTE]
> Typically an audio transcription requires a time span equal to the duration of the audio file plus a 2-3 minute overhead.

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
