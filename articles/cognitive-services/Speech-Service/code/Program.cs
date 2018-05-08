using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
// <usingstatement>
using Microsoft.CognitiveServices.Speech;
// </usingstatement>

namespace CsharpHelloWorld
{
    class Program
    {
        // <code>
        static async Task RecoFromMicrophoneAsync()
        {
            var subscriptionKey = "<Please replace with your subscription key>";
            var region = "<Please replace with your service region>";

            var factory = SpeechFactory.FromSubscription(subscriptionKey, region);

            using (var recognizer = factory.CreateSpeechRecognizer())
            {
                Console.WriteLine("Say something...");
                var result = await recognizer.RecognizeAsync();

                if (result.RecognitionStatus != RecognitionStatus.Recognized)
                {
                    Console.WriteLine($"There was an error, status {result.RecognitionStatus.ToString()}, reason {result.RecognitionFailureReason}");
                }
                else
                {
                    Console.WriteLine($"We recognized: {result.RecognizedText}");
                }
                Console.WriteLine("Please press a key to continue.");
                Console.ReadLine();
            }
        }

        static void Main(string[] args)
        {
            RecoFromMicrophoneAsync().Wait();
        }
        // </code>
    }
}
