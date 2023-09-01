---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 04/15/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/csharp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment
The Speech SDK is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) and implements .NET Standard 2.0. You install the Speech SDK later in this guide, but first check the [SDK installation guide](../../../quickstarts/setup-platform.md?pivots=programming-language-csharp) for any more requirements.

### Set environment variables

This example requires environment variables named `OPEN_AI_KEY`, `OPEN_AI_ENDPOINT`, `SPEECH_KEY`, and `SPEECH_REGION`.

[!INCLUDE [Environment variables](../../common/environment-variables-openai.md)]

## Recognize speech from a microphone

Follow these steps to create a new console application.

1. Open a command prompt where you want the new project, and create a console application with the .NET CLI. The `Program.cs` file should be created in the project directory.
    ```dotnetcli
    dotnet new console
    ```
1. Install the Speech SDK in your new project with the .NET CLI.
    ```dotnetcli
    dotnet add package Microsoft.CognitiveServices.Speech
    ```
1. Install the Azure OpenAI SDK (prerelease) in your new project with the .NET CLI.
    ```dotnetcli
    dotnet add package Azure.AI.OpenAI --prerelease 
    ```
1. Replace the contents of `Program.cs` with the following code. 

    ```csharp
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using Microsoft.CognitiveServices.Speech;
    using Microsoft.CognitiveServices.Speech.Audio;
    using Azure;
    using Azure.AI.OpenAI;
    using static System.Environment;
    
    class Program 
    {
        // This example requires environment variables named "OPEN_AI_KEY" and "OPEN_AI_ENDPOINT"
        // Your endpoint should look like the following https://YOUR_OPEN_AI_RESOURCE_NAME.openai.azure.com/
        static string openAIKey = Environment.GetEnvironmentVariable("OPEN_AI_KEY");
        static string openAIEndpoint = Environment.GetEnvironmentVariable("OPEN_AI_ENDPOINT");
    
        // Enter the deployment name you chose when you deployed the model.
        static string engine = "text-davinci-003";
    
        // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
        static string speechKey = Environment.GetEnvironmentVariable("SPEECH_KEY");
        static string speechRegion = Environment.GetEnvironmentVariable("SPEECH_REGION");
    
        // Prompts Azure OpenAI with a request and synthesizes the response.
        async static Task AskOpenAI(string prompt)
        {
            // Ask Azure OpenAI
            OpenAIClient client = new(new Uri(openAIEndpoint), new AzureKeyCredential(openAIKey));
            var completionsOptions = new CompletionsOptions()
            {
                Prompts = { prompt },
                MaxTokens = 100,
            };
            Response<Completions> completionsResponse = client.GetCompletions(engine, completionsOptions);
            string text = completionsResponse.Value.Choices[0].Text.Trim();
            Console.WriteLine($"Azure OpenAI response: {text}");
     
            var speechConfig = SpeechConfig.FromSubscription(speechKey, speechRegion);
            // The language of the voice that speaks.
            speechConfig.SpeechSynthesisVoiceName = "en-US-JennyMultilingualNeural"; 
            var audioOutputConfig = AudioConfig.FromDefaultSpeakerOutput();
    
            using (var speechSynthesizer = new SpeechSynthesizer(speechConfig, audioOutputConfig))
            {
                var speechSynthesisResult = await speechSynthesizer.SpeakTextAsync(text).ConfigureAwait(true);
    
                if (speechSynthesisResult.Reason == ResultReason.SynthesizingAudioCompleted)
                {
                    Console.WriteLine($"Speech synthesized to speaker for text: [{text}]");
                }
                else if (speechSynthesisResult.Reason == ResultReason.Canceled)
                {
                    var cancellationDetails = SpeechSynthesisCancellationDetails.FromResult(speechSynthesisResult);
                    Console.WriteLine($"Speech synthesis canceled: {cancellationDetails.Reason}");
    
                    if (cancellationDetails.Reason == CancellationReason.Error)
                    {
                        Console.WriteLine($"Error details: {cancellationDetails.ErrorDetails}");
                    }
                }
            }
        }
    
        // Continuously listens for speech input to recognize and send as text to Azure OpenAI
        async static Task ChatWithOpenAI()
        {
            // Should be the locale for the speaker's language.
            var speechConfig = SpeechConfig.FromSubscription(speechKey, speechRegion);        
            speechConfig.SpeechRecognitionLanguage = "en-US";
            
            using var audioConfig = AudioConfig.FromDefaultMicrophoneInput();
            using var speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);
            var conversationEnded = false;
    
            while(!conversationEnded)
            {
                Console.WriteLine("Azure OpenAI is listening. Say 'Stop' or press Ctrl-Z to end the conversation.");
                
                // Get audio from the microphone and then send it to the TTS service.
                var speechRecognitionResult = await speechRecognizer.RecognizeOnceAsync();           
                
                switch (speechRecognitionResult.Reason)
                {
                    case ResultReason.RecognizedSpeech:
                        if (speechRecognitionResult.Text == "Stop.")
                        {
                            Console.WriteLine("Conversation ended.");
                            conversationEnded = true;
                        }
                        else
                        {
                            Console.WriteLine($"Recognized speech: {speechRecognitionResult.Text}");
                            await AskOpenAI(speechRecognitionResult.Text).ConfigureAwait(true);
                        }
                        break;
                    case ResultReason.NoMatch:
                        Console.WriteLine($"No speech could be recognized: ");
                        break;
                    case ResultReason.Canceled:
                        var cancellationDetails = CancellationDetails.FromResult(speechRecognitionResult);
                        Console.WriteLine($"Speech Recognition canceled: {cancellationDetails.Reason}");
                        if (cancellationDetails.Reason == CancellationReason.Error)
                        {
                            Console.WriteLine($"Error details={cancellationDetails.ErrorDetails}");
                        }
                        break;
                }
            }
        }
    
        async static Task Main(string[] args)
        {
            try
            {
                await ChatWithOpenAI().ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
    ```

1. To increase or decrease the number of tokens returned by Azure OpenAI, change the `MaxTokens` property in the `CompletionsOptions` class instance. For more information tokens and cost implications, see [Azure OpenAI tokens](/azure/ai-services/openai/overview#tokens) and [Azure OpenAI pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/).

Run your new console application to start speech recognition from a microphone:

```console
dotnet run
```

> [!IMPORTANT]
> Make sure that you set the `OPEN_AI_KEY`, `OPEN_AI_ENDPOINT`, `SPEECH__KEY` and `SPEECH__REGION` environment variables as described [previously](#set-environment-variables). If you don't set these variables, the sample will fail with an error message.

Speak into your microphone when prompted. The console output includes the prompt for you to begin speaking, then your request as text, and then the response from Azure OpenAI as text. The response from Azure OpenAI should be converted from text to speech and then output to the default speaker.

```console
PS C:\dev\openai\csharp> dotnet run
Azure OpenAI is listening. Say 'Stop' or press Ctrl-Z to end the conversation.
Recognized speech:Make a comma separated list of all continents.
Azure OpenAI response:Africa, Antarctica, Asia, Australia, Europe, North America, South America
Speech synthesized to speaker for text [Africa, Antarctica, Asia, Australia, Europe, North America, South America]
Azure OpenAI is listening. Say 'Stop' or press Ctrl-Z to end the conversation.
Recognized speech: Make a comma separated list of 1 Astronomical observatory for each continent. A list should include each continent name in parentheses.
Azure OpenAI response:Mauna Kea Observatories (North America), La Silla Observatory (South America), Tenerife Observatory (Europe), Siding Spring Observatory (Australia), Beijing Xinglong Observatory (Asia), Naukluft Plateau Observatory (Africa), Rutherford Appleton Laboratory (Antarctica)
Speech synthesized to speaker for text [Mauna Kea Observatories (North America), La Silla Observatory (South America), Tenerife Observatory (Europe), Siding Spring Observatory (Australia), Beijing Xinglong Observatory (Asia), Naukluft Plateau Observatory (Africa), Rutherford Appleton Laboratory (Antarctica)]
Azure OpenAI is listening. Say 'Stop' or press Ctrl-Z to end the conversation.
Conversation ended.
PS C:\dev\openai\csharp>
```

## Remarks
Now that you've completed the quickstart, here are some more considerations:

- To change the speech recognition language, replace `en-US` with another [supported language](~/articles/ai-services/speech-service/language-support.md). For example, `es-ES` for Spanish (Spain). The default language is `en-US` if you don't specify a language. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/ai-services/speech-service/language-identification.md). 
- To change the voice that you hear, replace `en-US-JennyMultilingualNeural` with another [supported voice](~/articles/ai-services/speech-service/language-support.md#prebuilt-neural-voices). If the voice doesn't speak the language of the text returned from Azure OpenAI, the Speech service doesn't output synthesized audio.
- To use a different [model](/azure/ai-services/openai/concepts/models#model-summary-table-and-region-availability), replace `text-davinci-003` with the ID of another [deployment](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model). Keep in mind that the deployment ID isn't necessarily the same as the model name. You named your deployment when you created it in [Azure OpenAI Studio](https://oai.azure.com/).
- Azure OpenAI also performs content moderation on the prompt inputs and generated outputs. The prompts or responses may be filtered if harmful content is detected. For more information, see the [content filtering](/azure/ai-services/openai/concepts/content-filter) article.

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]

