//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.md file in the project root for full license information.
//

// <toplevel>
using System;
using System.Media;
using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Translation;
// </toplevel>

namespace MicrosoftSpeechSDKSamples
{
    public class TranslationSamples
    {
        // Translation from microphone.
        // <TranslationWithMicrophoneAsync>
        public static async Task TranslationWithMicrophoneAsync()
        {
            // Creates an instance of a speech factory with specified
            // subscription key and service region. Replace with your own subscription key
            // and service region (e.g., "westus").
            var factory = SpeechFactory.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

            // Sets source and target languages
            string fromLanguage = "en-US";
            List<string> toLanguages = new List<string>() { "de" };

            // Sets voice name of synthesis output.
            const string GermanVoice = "de-DE-Hedda";

            // Creates a translation recognizer using microphone as audio input, and requires voice output.
            using (var recognizer = factory.CreateTranslationRecognizer(fromLanguage, toLanguages, GermanVoice))
            {
                // Subscribes to events.
                recognizer.IntermediateResultReceived += (s, e) => {
                    Console.WriteLine($"\nPartial result: recognized in {fromLanguage}: {e.Result.RecognizedText}.");
                    if (e.Result.TranslationStatus == TranslationStatus.Success)
                    {
                        foreach (var element in e.Result.Translations)
                        {
                            Console.WriteLine($"    Translated into {element.Key}: {element.Value}");
                        }
                    }
                    else
                    {
                        Console.WriteLine($"    Translation failed. Status: {e.Result.TranslationStatus.ToString()}, FailureReason: {e.Result.FailureReason}");
                    }
                };

                recognizer.FinalResultReceived += (s, e) => {
                    if (e.Result.RecognitionStatus != RecognitionStatus.Recognized)
                    {
                        Console.WriteLine($"\nFinal result: Status: {e.Result.RecognitionStatus.ToString()}, FailureReason: {e.Result.RecognitionFailureReason}.");
                        return;
                    }
                    else
                    {
                        Console.WriteLine($"\nFinal result: Status: {e.Result.RecognitionStatus.ToString()}, recognized text in {fromLanguage}: {e.Result.RecognizedText}.");
                        if (e.Result.TranslationStatus == TranslationStatus.Success)
                        {
                            foreach (var element in e.Result.Translations)
                            {
                                Console.WriteLine($"    Translated into {element.Key}: {element.Value}");
                            }
                        }
                        else
                        {
                            Console.WriteLine($"    Translation failed. Status: {e.Result.TranslationStatus.ToString()}, FailureReason: {e.Result.FailureReason}");
                        }
                    }
                };

                recognizer.SynthesisResultReceived += (s, e) =>
                {
                    if (e.Result.Status == SynthesisStatus.Success)
                    {
                        Console.WriteLine($"Synthesis result received. Size of audio data: {e.Result.Audio.Length}");
                        using (var m = new MemoryStream(e.Result.Audio))
                        {
                            SoundPlayer simpleSound = new SoundPlayer(m);
                            simpleSound.PlaySync();
                        }
                    }
                    else if (e.Result.Status == SynthesisStatus.SynthesisEnd)
                    {
                        Console.WriteLine($"Synthesis result: end of synthesis result.");
                    }
                    else
                    {
                        Console.WriteLine($"Synthesis error. Status: {e.Result.Status.ToString()}, Failure reason: {e.Result.FailureReason}");
                    }
                };

                recognizer.RecognitionErrorRaised += (s, e) => {
                    Console.WriteLine($"\nAn error occurred. Status: {e.Status.ToString()}");
                };

                recognizer.OnSessionEvent += (s, e) => {
                    Console.WriteLine($"\nSession event. Event: {e.EventType.ToString()}.");
                };

                // Starts continuous recognition. Uses StopContinuousRecognitionAsync() to stop recognition.
                Console.WriteLine("Say something...");
                await recognizer.StartContinuousRecognitionAsync().ConfigureAwait(false);

                do
                {
                    Console.WriteLine("Press Enter to stop");
                } while (Console.ReadKey().Key != ConsoleKey.Enter);

                await recognizer.StopContinuousRecognitionAsync().ConfigureAwait(false);
            }
        }
        // </TranslationWithMicrophoneAsync>

        // Translation using file input.
        // <TranslationWithFileAsync>
        public static async Task TranslationWithFileAsync()
        {
            // Creates an instance of a speech factory with specified
            // subscription key and service region. Replace with your own subscription key
            // and service region (e.g., "westus").
            var factory = SpeechFactory.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

            // Sets source and target languages
            string fromLanguage = "en-US";
            List<string> toLanguages = new List<string>() { "de", "fr" };

            var translationEndTaskCompletionSource = new TaskCompletionSource<int>();

            // Creates a translation recognizer using file as audio input.
            // Replace with your own audio file name.
            using (var recognizer = factory.CreateTranslationRecognizerWithFileInput(@"YourAudioFile.wav", fromLanguage, toLanguages))
            {
                // Subscribes to events.
                recognizer.IntermediateResultReceived += (s, e) => {
                    Console.WriteLine($"\nPartial result: recognized in {fromLanguage}: {e.Result.RecognizedText}.");
                    if (e.Result.TranslationStatus == TranslationStatus.Success)
                    {
                        foreach (var element in e.Result.Translations)
                        {
                            Console.WriteLine($"    Translated into {element.Key}: {element.Value}");
                        }
                    }
                    else
                    {
                        Console.WriteLine($"    Translation failed. Status: {e.Result.TranslationStatus.ToString()}, FailureReason: {e.Result.FailureReason}");
                    }
                };

                recognizer.FinalResultReceived += (s, e) => {
                    if (e.Result.RecognitionStatus != RecognitionStatus.Recognized)
                    {
                        Console.WriteLine($"\nFinal result: Status: {e.Result.RecognitionStatus.ToString()}, FailureReason: {e.Result.RecognitionFailureReason}.");
                        return;
                    }
                    else
                    {
                        Console.WriteLine($"\nFinal result: Status: {e.Result.RecognitionStatus.ToString()}, recognized text in {fromLanguage}: {e.Result.RecognizedText}.");
                        if (e.Result.TranslationStatus == TranslationStatus.Success)
                        {
                            foreach (var element in e.Result.Translations)
                            {
                                Console.WriteLine($"    Translated into {element.Key}: {element.Value}");
                            }
                        }
                        else
                        {
                            Console.WriteLine($"    Translation failed. Status: {e.Result.TranslationStatus.ToString()}, FailureReason: {e.Result.FailureReason}");
                        }
                    }
                };

                recognizer.RecognitionErrorRaised += (s, e) => {
                    Console.WriteLine($"\nAn error occurred. Status: {e.Status.ToString()}");
                };

                recognizer.OnSpeechDetectedEvent += (s, e) => {
                    Console.WriteLine($"\nSpeech detected event. Event: {e.EventType.ToString()}.");
                    // Stops translation when speech end is detected.
                    if (e.EventType == RecognitionEventType.SpeechEndDetectedEvent)
                    {
                        Console.WriteLine($"\nStop translation.");
                        translationEndTaskCompletionSource.TrySetResult(0);
                    }
                };

                // Starts continuous recognition. Uses StopContinuousRecognitionAsync() to stop recognition.
                Console.WriteLine("Start translation...");
                await recognizer.StartContinuousRecognitionAsync().ConfigureAwait(false);

                // Waits for completion.
                await translationEndTaskCompletionSource.Task.ConfigureAwait(false);

                // Stops translation.
                await recognizer.StopContinuousRecognitionAsync().ConfigureAwait(false);
            }
        } 
        // </TranslationWithFileAsync>
    }
}
