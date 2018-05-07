//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.md file in the project root for full license information.
//

// <toplevel>
using System;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;
// </toplevel>

namespace MicrosoftSpeechSDKSamples
{
    public class SpeechRecognitionSamples
    {
        // Speech recognition from microphone.
        public static async Task RecognitionWithMicrophoneAsync()
        {
            // <recognitionWithMicrophone>
            // Creates an instance of a speech factory with specified
            // subscription key and service region. Replace with your own subscription key
            // and service region (e.g., "westus").
            var factory = SpeechFactory.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

            // Creates a speech recognizer using microphone as audio input.
            using (var recognizer = factory.CreateSpeechRecognizer())
            {
                // Starts recognizing.
                Console.WriteLine("Say something...");

                // Starts recognition. It returns when the first utterance has been recognized.
                var result = await recognizer.RecognizeAsync().ConfigureAwait(false);

                // Checks result.
                if (result.RecognitionStatus != RecognitionStatus.Recognized)
                {
                    Console.WriteLine($"There was an error, status {result.RecognitionStatus}, reason {result.RecognitionFailureReason}");
                }
                else
                {
                    Console.WriteLine($"We recognized: {result.RecognizedText}");
                }
            }
            // </recognitionWithMicrophone>
        }

        // Speech recognition from file.
        public static async Task RecognitionWithFileAsync()
        {
            // <recognitionFromFile>
            // Creates an instance of a speech factory with specified
            // subscription key and service region. Replace with your own subscription key
            // and service region (e.g., "westus").
            var factory = SpeechFactory.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

            // Creates a speech recognizer using file as audio input.
            // Replace with your own audio file name.
            using (var recognizer = factory.CreateSpeechRecognizerWithFileInput(@"YourAudioFile.wav"))
            {
                // Starts recognition. It returns when the first utterance is recognized.
                var result = await recognizer.RecognizeAsync().ConfigureAwait(false);

                // Checks result.
                if (result.RecognitionStatus != RecognitionStatus.Recognized)
                {
                    Console.WriteLine($"There was an error, status {result.RecognitionStatus}, reason {result.RecognitionFailureReason}");
                }
                else
                {
                    Console.WriteLine($"We recognized: {result.RecognizedText}");
                }
            }
            // </recognitionFromFile>
        }

        // <recognitionCustomized>
        // Speech recognition using a customized model.
        public static async Task RecognitionUsingCustomizedModelAsync()
        {
            // Creates an instance of a speech factory with specified
            // subscription key and service region. Replace with your own subscription key
            // and service region (e.g., "westus").
            var factory = SpeechFactory.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

            // Creates a speech recognizer using microphone as audio input.
            using (var recognizer = factory.CreateSpeechRecognizer())
            {
                // Replace with the CRIS deployment id of your customized model.
                recognizer.DeploymentId = "YourDeploymentId";

                Console.WriteLine("Say something...");

                // Starts recognition. It returns when the first utterance has been recognized.
                var result = await recognizer.RecognizeAsync().ConfigureAwait(false);

                // Checks results.
                if (result.RecognitionStatus != RecognitionStatus.Recognized)
                {
                    Console.WriteLine($"There was an error, status {result.RecognitionStatus}, reason {result.RecognitionFailureReason}");
                }
                else
                {
                    Console.WriteLine($"We recognized: {result.RecognizedText}");
                }
            }
        }
        // </recognitionCustomized>

        // <recognitionContinuous>
        // Speech recognition with events
        public static async Task ContinuousRecognitionAsync()
        {
            // Creates an instance of a speech factory with specified
            // subscription key and service region. Replace with your own subscription key
            // and service region (e.g., "westus").
            var factory = SpeechFactory.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

            // Creates a speech recognizer using microphone as audio input.
            using (var recognizer = factory.CreateSpeechRecognizer())
            {
                // Subscribes to events.
                recognizer.IntermediateResultReceived += (s, e) =>
                        { Console.WriteLine($"\n    Partial result: {e.Result.RecognizedText}."); };
                recognizer.FinalResultReceived += (s, e) =>
                        { Console.WriteLine($"\n    Final result: Status: {e.Result.RecognitionStatus}, Text: {e.Result.RecognizedText}."); };
                recognizer.RecognitionErrorRaised += (s, e) =>
                        { Console.WriteLine($"\n    An error occurred. Status: {e.Status.ToString()}"); };
                recognizer.OnSessionEvent += (s, e) =>
                        { Console.WriteLine($"\n    Session event. Event: {e.EventType.ToString()}."); };

                // Starts continuos recognition. Uses StopContinuousRecognitionAsync() to stop recognition.
                Console.WriteLine("Say something...");
                await recognizer.StartContinuousRecognitionAsync().ConfigureAwait(false);

                Console.WriteLine("Press any key to stop");
                Console.ReadKey();

                await recognizer.StopContinuousRecognitionAsync().ConfigureAwait(false);
            }
        }
        // </recognitionContinuous>
    }
}
