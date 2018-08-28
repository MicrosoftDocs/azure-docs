---
title: Azure Batch transcription API
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

Batch transcription is ideal if you have large amounts of audio. You can point to audio files and get back transcriptions in asynchronous mode.

## Batch transcription API

The Batch transcription API offers asynchronous speech to text transcription, along with additional features.

> [!NOTE]
> The Batch transcription API is ideal for call centers, which typically accumulate thousands of hours of audio. The API is guided by a "fire and forget" philosophy, which makes it easy to transcribe large volume of audio recordings.

### Supported formats

The Batch transcription API supports the following formats:

Name| Channel  |
----|----------|
mp3 |   Mono   |   
mp3 |  Stereo  | 
wav |   Mono   |
wav |  Stereo  |

For stereo audio streams, Batch transcription splits the left and right channel during the transcription. The two JSON files with the result are each created from a single channel. The timestamps per utterance enable the developer to create an ordered final transcript. The following JSON sample shows the output of a channel.

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
> The Batch transcription API is using a REST service for requesting transcriptions, their status, and associated results. You can use the API from any language. The next section describes how it is used.

## Authorization token

As with all features of the Unified Speech Service, you create a subscription key from the [Azure portal](https://portal.azure.com). In addition, you acquire an API key from the Speech portal: 

1. Sign in to [Custom Speech](https://customspeech.ai).

2. Select **Subscriptions**.

3. Select **Generate API Key**.

    ![Screenshot of Custom Speech Subscriptions page](media/stt/Subscriptions.jpg)

4. Copy and paste that key in the client code in the following sample.

> [!NOTE]
> If you plan to use a custom model, you will need the ID of that model too. Note that this is not the deployment or endpoint ID that you find on the Endpoint Details view. It is the model ID that you can retrieve when you select the details of that model.

## Sample code

Customize the following sample code with a subscription key and an API key. This allows you to obtain a bearer token.

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

After you obtain the token, you must specify the SAS URI pointing to the audio file requiring transcription. The rest of the code iterates through the status and displays results.

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
> In the preceding code, the subscription key is from the Speech(Preview) resource that you create on the Azure portal. Keys obtained from the Custom Speech Service resource do not work.

Notice the asynchronous setup for posting audio and receiving transcription status. The client created is a .NET Http client. There is a `PostTranscriptions` method for sending the audio file details, and a `GetTranscriptions` method to receive the results. `PostTranscriptions` returns a handle, and  `GetTranscriptions` uses this handle to create a handle to obtain the transcription status.

The current sample code does not specify any custom models. The service uses the baseline models for transcribing the file or files. To specify the models, you can pass on the same method the model IDs for the acoustic and the language model. 

If you don't want to use the baseline, you must pass model Ids for both acoustic and language models.

> [!NOTE]
> For baseline transcription, you don't have to declare the endpoints of the baseline models. If you want to use custom models, you provide their endpoints IDs as the [Sample](https://github.com/PanosPeriorellis/Speech_Service-BatchTranscriptionAPI). If you want to use an acoustic baseline with a baseline language model, you only have to declare the custom model's endpoint ID. Microsoft detects the partner baseline model (be it acoustic or language), and uses that to fulfill the transcription request.

### Supported storage

Currently the only storage supported is Azure Blob storage.

## Downloading the sample

The sample shown here is on [GitHub](https://github.com/PanosPeriorellis/Speech_Service-BatchTranscriptionAPI).

> [!NOTE]
> Typically, an audio transcription requires a time span equal to the duration of the audio file, plus a 2-3 minute overhead.

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
