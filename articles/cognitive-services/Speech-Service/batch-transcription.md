---
title: Azure Batch Transcription API | Azure Microsoft Docs
description: Samples
services: cognitive-services
author: PanosPeriorellis
manager: onano

ms.service: cognitive-services
ms.technology: Speech to Text
ms.topic: article
ms.date: 04/26/2018
ms.author: panosper
---

# Batch transcription
Batch transcription is ideal for use cases with large amounts of audio where the developer wishes to point to audio files and get back transcriptions in asynchronous mode.

## Batch transcription API
The Batch transcription API makes the above scenario possible. It offers asynchronous speech to text transcription along with some interesting out of the box features.

> [!NOTE]
> The Batch transcription API is idea for Call Centers which typically accummulate thousands of hours of audio in a daily basis

### Supported formats
The Batch transcription API aims to become the de-facto for all offline call center related scenarios and offer support for all related formats. Currently supported formats:

Name| Channel  |
----|----------|
mp3 |   Mono   |   
mp3 |  Stereo  | 
wav |   Mono   |
wav |  Stereo  |

In addition, the Batch transcription API is capable of doing channel splitting (L/R) should the audio be recorded in Stereo. Stereo files result in two JSON files, each corresponding to the transcript of either channel with clearly indicated timestamps per channel per utterance. This feature enables the developer to create an ordered final transcript clearly demonstrating which party said what and at what time internal. The following JSON sample represents the output of a channel.

    ```
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
> The OfflBatch transcriptionine API is calling is using a REST service for requesting transcriptions their status and accociated results. It is based on .NET and does not have any external dependencies. The next section describes how it is used

## Authorization token
Authentication for the Batch transcription API is carried out as follows. As with all features of the Unified Speech Service the users need to obtain a subscription key from the [Azure Portal](https://portal.azure.com). In addition, one is required to generate an API key from the Speech Portal. Api key generation is carried out as follows.

1. Log in to https://customspeech.ai
2. Click on Subscriptions.
3. click on the option Generate API Key
4. Copy paste that key in the client code as shown on line 5 of the earlier code sample

    ![The Upload View](media/stt/Subscriptions.jpg)


## Sample code
Making use of the API is fairly straight forward. The Sample code below can be customized with a subscription key and an API key.

```cs
   static async Task TranscribeAsync()
        { 
            // Creating an Batch transcription API Client
            var client = await CrisClient.CreateApiV1ClientAsync(
                "<your msa>", // MSA email
                "<your api key>", // API key
                "stt.speech.microsoft.com",
                443).ConfigureAwait(false);
            
            var newLocation = 
                await client.PostTranscriptionAsync(
                    "<selected locale i.e. en-us>", // Locale 
                    "<your subscrpition key>", // Subscription Key
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
Notice the Async set up for posting audio and receiving transcription status. The Client created is a NET Http client. There is PostTranscriptions method for sending the audio file details and a GetTranscriptions method. PostTranscriptions returns a handle GetTranscriptions method is using to create a handle via which one can obtain status.

Also notice that the current sample code does not specify any custom models. The service will use the baseline models for transcribing the file(s). If the user wishes to specify the models, one can pass on the same method the modelIDs for the acoustic and the language model. 

If one does not wish to use baseline, one must pass model Ids for both acoustic and language models.

### Supported storage

Currently the only storage supported is Azure blob.

## Downloading the sample

The sample from this article can be downloaded [here](https://aka.ms/csspeech/winsample).

> [!NOTE]
> Typically an audio transcription requires a time span equal to the duration of the audio file plus a 2-3 minute overhead.

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)