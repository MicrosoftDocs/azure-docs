---
title: Use the Azure Batch Transcription API
titlesuffix: Azure Cognitive Services
description: Samples for transcribing large volumes of audio content.
services: cognitive-services
author: PanosPeriorellis
manager: cgronlun

ms.service: cognitive-services
ms.component: speech-service
ms.topic: conceptual
ms.date: 04/26/2018
ms.author: panosper
---

# Why use Batch transcription?

Batch transcription is ideal if you have large amounts of audio in storage. By using the dedicated REST API, you can point to audio files by a shared access signature (SAS) URI and asynchronously receive transcriptions.

## The Batch Transcription API

The Batch Transcription API offers asynchronous speech-to-text transcription, along with additional features. It is a REST API that exposes methods for:

1. Creating batch processing requests
1. Query Status 
1. Downloading transcriptions

> [!NOTE]
> The Batch Transcription API is ideal for call centers, which typically accumulate thousands of hours of audio. The API is guided by a "fire and forget" philosophy, which makes it easy to transcribe large volumes of audio recordings.

### Supported formats

The Batch Transcription API supports the following formats:

| Format | Codec | Bitrate | Sample Rate |
|--------|-------|---------|-------------|
| WAV | PCM | 16-bit | 8 or 16 kHz, mono, stereo |
| MP3 | PCM | 16-bit | 8 or 16 kHz, mono, stereo |
| OGG | OPUS | 16-bit | 8 or 16 kHz, mono, stereo |

> [!NOTE]
> The Batch Transcription API requires an S0 key (paying tier). It does not work with a free (f0) key.

For stereo audio streams, the Batch transcription API splits the left and right channel during the transcription. The two JSON files with the result are each created from a single channel. The timestamps per utterance enable the developer to create an ordered final transcript. The following JSON sample shows the output of a channel, includuing properties for setting up the profanity filter and the punctuation model.

```json
{
  "recordingsUrl": "https://contoso.com/mystoragelocation",
  "models": [],
  "locale": "en-US",
  "name": "Transcription using locale en-US",
  "description": "An optional description of the transcription.",
  "properties": {
    "ProfanityFilterMode": "Masked",
    "PunctuationMode": "DictatedAndAutomatic"
  },
```

> [!NOTE]
> The Batch Transcription API uses a REST service for requesting transcriptions, their status, and associated results. You can use the API from any language. The next section describes how the API is used.

### Query parameters

These parameters may be included in the query string of the REST request.

| Parameter | Description | Required / Optional |
|-----------|-------------|---------------------|
| `ProfanityFilterMode` | Specifies how to handle profanity in recognition results. Accepted values are `none` which disables profanity filtering, `masked` which replaces profanity with asterisks, `removed` which removes all profanity from the result, or `tags` which adds "profanity" tags. The default setting is `masked`. | Optional |
| `PunctuationMode` | Specifies how to handle punctuation in recognition results. Accepted values are `none` which disables punctuation, `dictated` which implies explicit punctuation, `automatic` which lets the decoder deal with punctuation, or `dictatedandautomatic` which implies dictated punctuation marks or automatic. | Optional |


## Authorization token

As with all features of the Speech service, you create a subscription key from the [Azure portal](https://portal.azure.com) by following our [Get started guide](get-started.md). If you plan to get transcriptions from our baseline models, creating a key is all you need to do. 

If you plan to customize and use a custom model, add the subscription key to the custom speech portal by doing the following:

1. Sign in to [Custom Speech](https://customspeech.ai).

2. At the top right, select **Subscriptions**.

3. Select **Connect existing subscription**.

4. In the pop-up window, add the subscription key and an alias.

    ![The Add Subscription window](media/stt/Subscriptions.jpg)

5. Copy and paste that key in the client code in the following sample.

> [!NOTE]
> If you plan to use a custom model, you will need the ID of that model too. This ID is not the endpoint ID that you find on the Endpoint Details view. It is the model ID that you can retrieve when you select the details of that model.

## Sample code

Customize the following sample code with a subscription key and an API key. This action allows you to get a bearer token.

```cs
     public static CrisClient CreateApiV2Client(string key, string hostName, int port)

        {
            var client = new HttpClient();
            client.Timeout = TimeSpan.FromMinutes(25);
            client.BaseAddress = new UriBuilder(Uri.UriSchemeHttps, hostName, port).Uri;
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", key);
         
            return new CrisClient(client);
        }
```

After you get the token, specify the SAS URI that points to the audio file that requires transcription. The rest of the code iterates through the status and displays the results. At first, you set up the key, region, models to use, and the SA, as shown in the following code snippet. Next, you instantiate the client and the POST request. 

```cs
            private const string SubscriptionKey = "<your Speech subscription key>";
            private const string HostName = "westus.cris.ai";
            private const int Port = 443;
    
            // SAS URI 
            private const string RecordingsBlobUri = "SAS URI pointing to the file in Azure Blob Storage";

            // adapted model Ids
            private static Guid AdaptedAcousticId = new Guid("guid of the acoustic adaptation model");
            private static Guid AdaptedLanguageId = new Guid("guid of the language model");

            // Creating a Batch Transcription API Client
            var client = CrisClient.CreateApiV2Client(SubscriptionKey, HostName, Port);
            
            var transcriptionLocation = await client.PostTranscriptionAsync(Name, Description, Locale, new Uri(RecordingsBlobUri), new[] { AdaptedAcousticId, AdaptedLanguageId }).ConfigureAwait(false);
```

Now that you've made the request, you can query and download the transcription results, as shown in the following code snippet:

```cs
  
            // get all transcriptions for the user
            transcriptions = await client.GetTranscriptionAsync().ConfigureAwait(false);

            // for each transcription in the list we check the status
            foreach (var transcription in transcriptions)
            {
                switch(transcription.Status)
                {
                    case "Failed":
                    case "Succeeded":

                            // we check to see if it was one of the transcriptions we created from this client.
                        if (!createdTranscriptions.Contains(transcription.Id))
                        {
                            // not created from here, continue
                            continue;
                        }
                            
                        completed++;
                            
                        // if the transcription was successful, check the results
                        if (transcription.Status == "Succeeded")
                        {
                            var resultsUri = transcription.ResultsUrls["channel_0"];
                            WebClient webClient = new WebClient();
                            var filename = Path.GetTempFileName();
                            webClient.DownloadFile(resultsUri, filename);
                            var results = File.ReadAllText(filename);
                            Console.WriteLine("Transcription succeeded. Results: ");
                            Console.WriteLine(results);
                        }
                    
                    break;
                    case "Running":
                    running++;
                     break;
                    case "NotStarted":
                    notStarted++;
                    break;
                    
                    }
                }
            }
        }
```

For full details about the preceding calls, see our [swagger document](https://westus.cris.ai/swagger/ui/index). For the full sample shown here, go to [GitHub](https://github.com/PanosPeriorellis/Speech_Service-BatchTranscriptionAPI).

> [!NOTE]
> In the preceding code, the subscription key is from the Speech resource that you create in the Azure portal. Keys that you get from the Custom Speech Service resource do not work.

Take note of the asynchronous setup for posting audio and receiving transcription status. The client that you create is a .NET HTTP client. There's a `PostTranscriptions` method for sending the audio file details and a `GetTranscriptions` method for receiving the results. `PostTranscriptions` returns a handle, and `GetTranscriptions` uses it to create a handle to get the transcription status.

The current sample code doesn't specify a custom model. The service uses the baseline models for transcribing the file or files. To specify the models, you can pass on the same method as the model IDs for the acoustic and the language model. 

If you don't want to use the baseline, pass model IDs for both acoustic and language models.

> [!NOTE]
> For baseline transcriptions, you don't have to declare the endpoints of the baseline models. If you want to use custom models, you provide their endpoints IDs as the [Sample](https://github.com/PanosPeriorellis/Speech_Service-BatchTranscriptionAPI). If you want to use an acoustic baseline with a baseline language model, you have to declare only the custom model's endpoint ID. Microsoft detects the partner baseline model&mdash;whether acoustic or language&mdash;and uses it to fulfill the transcription request.

### Supported storage

Currently, the only storage supported is Azure Blob storage.

## Download the sample

You can find the sample in this article on [GitHub](https://github.com/PanosPeriorellis/Speech_Service-BatchTranscriptionAPI).

> [!NOTE]
> An audio transcription ordinarily requires a time span equal to the duration of the audio file, plus a two- to three-minute overhead.

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
