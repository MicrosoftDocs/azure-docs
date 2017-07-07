---
title: Face API C# quick start | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Face API with C# in Cognitive Services.
services: cognitive-services
author: v-royhar
manager: yutkuo

ms.service: cognitive-services
ms.technology: face
ms.topic: article
ms.date: 06/21/2017
ms.author: anroth
---

# Face API C# Quick Starts
This article provides information and code samples to help you quickly get started using the Face API with C# to accomplish the following tasks: 
* [Detect Faces in Images](#Detect) 
* [Create a Person Group](#Create)

## Prerequisites
* Get the Microsoft Face API Windows SDK [here](https://www.nuget.org/packages/Microsoft.ProjectOxford.Face/)
* Learn more about obtaining free Subscription Keys [here](../../Computer-vision/Vision-API-How-to-Topics/HowToSubscribe.md)

## Detect Faces in images with Face API using C# <a name="Detect"> </a>
Use the [Face - Detect method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) 
to detect faces in an image and return face attributes including:
* Face ID: Unique ID used in several Face API scenarios. 
* Face Rectangle: The left, top, width, and height indicating the location of the face in the image.
* Landmarks: An array of 27-point face landmarks pointing to the important positions of face components.
* Facial attributes including age, gender, smile intensity, head pose, and facial hair. 

#### Face detect C# example request

The sample is written in C# using the Face API client library. 

1. Create a new Console solution in Visual Studio.
1. Replace Program.cs with the following code.
1. Replace the `subscriptionKey` value with your valid subscription key.
1. Change the `uriBase` value to use the location where you obtained your subscription keys.
1. Run the program.
1. Enter the path to an image on your hard drive.

```c#
using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;

namespace CSHttpClientSample
{
	static class Program
	{
		// **********************************************
		// *** Update or verify the following values. ***
		// **********************************************

		// Replace the subscriptionKey string value with your valid subscription key.
		const string subscriptionKey = "13hc77781f7e4b19b5fcdd72a8df7156";

		// Replace or verify the region.
		//
		// You must use the same region in your REST API call as you used to obtain your subscription keys.
		// For example, if you obtained your subscription keys from the westus region, replace 
		// "westcentralus" in the URI below with "westus".
		//
		// NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
		// a free trial subscription key, you should not need to change this region.
		const string uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";


		static void Main()
		{
			// Get the path and filename to process from the user.
			Console.WriteLine("Detect faces:");
			Console.Write("Enter the path to an image with faces that you wish to analzye: ");
			string imageFilePath = Console.ReadLine();

			// Execute the REST API call.
			MakeAnalysisRequest(imageFilePath);

			Console.WriteLine("\nPlease wait a moment for the results to appear. Then, press Enter to exit...\n");
			Console.ReadLine();
		}


		/// <summary>
		/// Gets the analysis of the specified image file by using the Computer Vision REST API.
		/// </summary>
		/// <param name="imageFilePath">The image file.</param>
		static async void MakeAnalysisRequest(string imageFilePath)
		{
			HttpClient client = new HttpClient();

			// Request headers.
			client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

			// Request parameters. A third optional parameter is "details".
			string requestParameters = "returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise";

			// Assemble the URI for the REST API Call.
			string uri = uriBase + "?" + requestParameters;

			HttpResponseMessage response;

			// Request body. Posts a locally stored JPEG image.
			byte[] byteData = GetImageAsByteArray(imageFilePath);

			using (ByteArrayContent content = new ByteArrayContent(byteData))
			{
				// This example uses content type "application/octet-stream".
				// The other content types you can use are "application/json" and "multipart/form-data".
				content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

				// Execute the REST API call.
				response = await client.PostAsync(uri, content);

				// Get the JSON response.
				string contentString = await response.Content.ReadAsStringAsync();

				// Display the JSON response.
				Console.WriteLine("\nResponse:\n");
				Console.WriteLine(JsonPrettyPrint(contentString));
			}
		}


		/// <summary>
		/// Returns the contents of the specified file as a byte array.
		/// </summary>
		/// <param name="imageFilePath">The image file to read.</param>
		/// <returns>The byte array of the image data.</returns>
		static byte[] GetImageAsByteArray(string imageFilePath)
		{
			FileStream fileStream = new FileStream(imageFilePath, FileMode.Open, FileAccess.Read);
			BinaryReader binaryReader = new BinaryReader(fileStream);
			return binaryReader.ReadBytes((int)fileStream.Length);
		}


		/// <summary>
		/// Formats the given JSON string by adding line breaks and indents.
		/// </summary>
		/// <param name="json">The raw JSON string to format.</param>
		/// <returns>The formatted JSON string.</returns>
		static string JsonPrettyPrint(string json)
		{
			if (string.IsNullOrEmpty(json))
				return string.Empty;

			json = json.Replace(Environment.NewLine, "").Replace("\t", "");

			StringBuilder sb = new StringBuilder();
			bool quote = false;
			bool ignore = false;
			int offset = 0;
			int indentLength = 3;

			foreach (char ch in json)
			{
				switch (ch)
				{
					case '"':
						if (!ignore) quote = !quote;
						break;
					case '\'':
						if (quote) ignore = !ignore;
						break;
				}

				if (quote)
					sb.Append(ch);
				else
				{
					switch (ch)
					{
						case '{':
						case '[':
							sb.Append(ch);
							sb.Append(Environment.NewLine);
							sb.Append(new string(' ', ++offset * indentLength));
							break;
						case '}':
						case ']':
							sb.Append(Environment.NewLine);
							sb.Append(new string(' ', --offset * indentLength));
							sb.Append(ch);
							break;
						case ',':
							sb.Append(ch);
							sb.Append(Environment.NewLine);
							sb.Append(new string(' ', offset * indentLength));
							break;
						case ':':
							sb.Append(ch);
							sb.Append(' ');
							break;
						default:
							if (ch != ' ') sb.Append(ch);
							break;
					}
				}
			}

			return sb.ToString().Trim();
		}
	}
}
```
#### Face detect response

A successful response is returned in JSON. Following is an example of a successful response: 

```json
Response:

[
   {
      "faceId": "f7eda569-4603-44b4-8add-cd73c6dec644",
      "faceRectangle": {
         "top": 131,
         "left": 177,
         "width": 162,
         "height": 162
      },
      "faceAttributes": {
         "smile": 0.0,
         "headPose": {
            "pitch": 0.0,
            "roll": 0.1,
            "yaw": -32.9
         },
         "gender": "female",
         "age": 22.9,
         "facialHair": {
            "moustache": 0.0,
            "beard": 0.0,
            "sideburns": 0.0
         },
         "glasses": "NoGlasses",
         "emotion": {
            "anger": 0.0,
            "contempt": 0.0,
            "disgust": 0.0,
            "fear": 0.0,
            "happiness": 0.0,
            "neutral": 0.986,
            "sadness": 0.009,
            "surprise": 0.005
         },
         "blur": {
            "blurLevel": "low",
            "value": 0.06
         },
         "exposure": {
            "exposureLevel": "goodExposure",
            "value": 0.67
         },
         "noise": {
            "noiseLevel": "low",
            "value": 0.0
         },
         "makeup": {
            "eyeMakeup": true,
            "lipMakeup": true
         },
         "accessories": [

         ],
         "occlusion": {
            "foreheadOccluded": false,
            "eyeOccluded": false,
            "mouthOccluded": false
         },
         "hair": {
            "bald": 0.0,
            "invisible": false,
            "hairColor": [
               {
                  "color": "brown",
                  "confidence": 1.0
               },
               {
                  "color": "black",
                  "confidence": 0.87
               },
               {
                  "color": "other",
                  "confidence": 0.51
               },
               {
                  "color": "blond",
                  "confidence": 0.08
               },
               {
                  "color": "red",
                  "confidence": 0.08
               },
               {
                  "color": "gray",
                  "confidence": 0.02
               }
            ]
         }
      }
   }
]
```
## Create a Person Group with Face API using C# <a name="Create"> </a>

Use the [Person Group - Create a Person Group method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244) to
create a person group with specified personGroupId, name, and user-provided userData.

#### Person Group - create a Person Group C# example request

Create a new Console solution in Visual Studio, then replace Program.cs with the following code. Change the `string uri` to use the region where you obtained your subscription keys, and replace the "Ocp-Apim-Subscription-Key" value with your valid subscription key.

```c#
using System;
using System.Net.Http.Headers;
using System.Net.Http;

namespace CSHttpClientSample
{
    static class Program
    {
        static void Main()
        {
            Console.WriteLine("Enter an ID for the group you wish to create:");
            Console.WriteLine("(Use numbers, lower case letters, '-' and '_'. The maximum length of the personGroupId is 64.)");

            string personGroupId = Console.ReadLine();
            MakeCreateGroupRequest(personGroupId);

            Console.WriteLine("\n\n\nWait for the result below, then hit ENTER to exit...\n\n\n");
            Console.ReadLine();
        }


        static async void MakeCreateGroupRequest(string personGroupId)
        {
            var client = new HttpClient();

            // Request headers - replace this example key with your valid key.
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "6726adbabb494773a28a7a5a21d5974a");

            // Request URI string.
            // NOTE: You must use the same region in your REST call as you used to obtain your subscription keys.
            //   For example, if you obtained your subscription keys from westus, replace "westcentralus" in the 
            //   URI below with "westus".
            string uri = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/" + personGroupId;

            // Here "name" is for display and doesn't have to be unique. Also, "userData" is optional.
            string json = "{\"name\":\"My Group\", \"userData\":\"Some data related to my group.\"}";
            HttpContent content = new StringContent(json);
            content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PutAsync(uri, content);

            // If the group was created successfully, you'll see "OK".
            // Otherwise, if a group with the same personGroupId has been created before, you'll see "Conflict".
            Console.WriteLine("Response status: " + response.StatusCode);
        }
    }
}
```
