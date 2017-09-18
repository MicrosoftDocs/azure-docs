--- 
title: Computer Vision API C# quick starts | Microsoft Docs
description: Get information and code samples to help you quickly get started using C# and the Computer Vision API in Cognitive Services.
services: cognitive-services
author: v-royhar
manager: JuliaNik

ms.service: cognitive-services
ms.technology: computer-vision
ms.topic: article
ms.date: 06/12/2017
ms.author: v-royhar
---

# Computer Vision C# Quick Starts

This article provides information and code samples to help you quickly get started using the Computer Vision API with C# to accomplish the following tasks:
* [Analyze an image](#AnalyzeImage)
* [Use a Domain-Specific Model](#DomainSpecificModel)
* [Intelligently generate a thumbnail](#GetThumbnail)
* [Detect and extract printed text from an image](#OCR)
* [Detect and extract handwritten text from an image](#RecognizeText)

## Prerequisites

* Get the Microsoft Computer Vision API Windows SDK [here](https://github.com/Microsoft/Cognitive-vision-windows).
* To use the Computer Vision API, you need a subscription key. You can get free subscription keys [here](https://docs.microsoft.com/en-us/azure/cognitive-services/Computer-vision/Vision-API-How-to-Topics/HowToSubscribe).

## Analyze an Image With Computer Vision API using C# <a name="AnalyzeImage"> </a>

With the [Analyze Image method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fa), you can extract visual features based on image content. You can upload an image or specify an image URL and choose which features to return, including:
* A detailed list of tags related to the image content.
* A description of image content in a complete sentence.
* The coordinates, gender, and age of any faces contained in the image.
* The ImageType (clip art or a line drawing).
* The dominant color, the accent color, or whether an image is black & white.
* The category defined in this [taxonomy](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/category-taxonomy).
* Does the image contain adult or sexually suggestive content?

### Analyze an image C# example request

Create a new Console solution in Visual Studio, then replace Program.cs with the following code. Change the `uriBase` to use the location where you obtained your subscription keys, and replace the `subscriptionKey` value with your valid subscription key.

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
		const string uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze";


		static void Main()
		{
			// Get the path and filename to process from the user.
			Console.WriteLine("Analyze an image:");
			Console.Write("Enter the path to an image you wish to analzye: ");
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
			string requestParameters = "visualFeatures=Categories,Description,Color&language=en";

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

			foreach(char ch in json)
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

### Analyze an Image response

A successful response is returned in JSON. Following is an example of a successful response:

```json
{
   "categories": [
      {
         "name": "abstract_",
         "score": 0.00390625
      },
      {
         "name": "others_",
         "score": 0.0234375
      },
      {
         "name": "outdoor_",
         "score": 0.00390625
      }
   ],
   "description": {
      "tags": [
         "road",
         "building",
         "outdoor",
         "street",
         "night",
         "black",
         "city",
         "white",
         "light",
         "sitting",
         "riding",
         "man",
         "side",
         "empty",
         "rain",
         "corner",
         "traffic",
         "lit",
         "hydrant",
         "stop",
         "board",
         "parked",
         "bus",
         "tall"
      ],
      "captions": [
         {
            "text": "a close up of an empty city street at night",
            "confidence": 0.7965622853462756
         }
      ]
   },
   "requestId": "dddf1ac9-7e66-4c47-bdef-222f3fe5aa23",
   "metadata": {
      "width": 3733,
      "height": 1986,
      "format": "Jpeg"
   },
   "color": {
      "dominantColorForeground": "Black",
      "dominantColorBackground": "Black",
      "dominantColors": [
         "Black",
         "Grey"
      ],
      "accentColor": "666666",
      "isBWImg": true
   }
}
```

## Use a Domain-Specific Model <a name="DomainSpecificModel"> </a>

The Domain-Specific Model is a model trained to identify a specific set of objects in an image. The two domain-specific models that are currently available are celebrities and landmarks. The following example identifies a landmark in an image.

### Landmark C# example request

Create a new Console solution in Visual Studio, then replace Program.cs with the following code. Change the `uriBase` to use the location where you obtained your subscription keys, and replace the `subscriptionKey` value with your valid subscription key.

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
		//
		// Also, if you want to use the celebrities model, change "landmarks" to "celebrities" here and in 
		// requestParameters to use the Celebrities model.
		const string uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/models/landmarks/analyze";


		static void Main()
		{
			// Get the path and filename to process from the user.
			Console.WriteLine("Domain-Specific Model:");
			Console.Write("Enter the path to an image you wish to analzye for landmarks: ");
			string imageFilePath = Console.ReadLine();

			// Execute the REST API call.
			MakeAnalysisRequest(imageFilePath);

			Console.WriteLine("\nPlease wait a moment for the results to appear. Then, press Enter to exit ...\n");
			Console.ReadLine();
		}


		/// <summary>
		/// Gets a thumbnail image from the specified image file by using the Computer Vision REST API.
		/// </summary>
		/// <param name="imageFilePath">The image file to use to create the thumbnail image.</param>
		static async void MakeAnalysisRequest(string imageFilePath)
		{
			HttpClient client = new HttpClient();

			// Request headers.
			client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

			// Request parameters. Change "landmarks" to "celebrities" here and in uriBase to use the Celebrities model.
			string requestParameters = "model=landmarks";

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

### Landmark example response

A successful response is returned in JSON. Following is an example of a successful response:  

```json
{
   "requestId": "cfe3d4eb-4d9c-4dda-ae63-7d3a27ce6d27",
   "metadata": {
      "width": 1024,
      "height": 680,
      "format": "Jpeg"
   },
   "result": {
      "landmarks": [
         {
            "name": "Space Needle",
            "confidence": 0.9448209
         }
      ]
   }
}
```

## Get a thumbnail with Computer Vision API using C# <a name="GetThumbnail"> </a>

Use the [Get Thumbnail method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fb) to crop an image based on its region of interest (ROI) to the height and width you desire. You can even pick an aspect ratio that differs from the aspect ratio of the input image.

### Get a thumbnail C# example request

Create a new Console solution in Visual Studio, then replace Program.cs with the following code. Change the `uriBase` to use the location where you obtained your subscription keys, and replace the `subscriptionKey` value with your valid subscription key.

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
		const string uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/generateThumbnail";


		static void Main()
		{
			// Get the path and filename to process from the user.
			Console.WriteLine("Thumbnail:");
			Console.Write("Enter the path to an image you wish to use to create a thumbnail image: ");
			string imageFilePath = Console.ReadLine();

			// Execute the REST API call.
			MakeThumbNailRequest(imageFilePath);

			Console.WriteLine("\nPlease wait a moment for the results to appear. Then, press Enter to exit ...\n");
			Console.ReadLine();
		}


		/// <summary>
		/// Gets a thumbnail image from the specified image file by using the Computer Vision REST API.
		/// </summary>
		/// <param name="imageFilePath">The image file to use to create the thumbnail image.</param>
		static async void MakeThumbNailRequest(string imageFilePath)
		{
			HttpClient client = new HttpClient();

			// Request headers.
			client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

			// Request parameters.
			string requestParameters = "width=200&height=150&smartCropping=true";

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

				if (response.IsSuccessStatusCode)
				{
					// Display the response data.
					Console.WriteLine("\nResponse:\n");
					Console.WriteLine(response);

					// Get the image data.
					byte[] thumbnailImageData = await response.Content.ReadAsByteArrayAsync();
				}
				else
				{
					// Display the JSON error data.
					Console.WriteLine("\nError:\n");
					Console.WriteLine(JsonPrettyPrint(await response.Content.ReadAsStringAsync()));
				}
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
### Get a Thumbnail response

A successful response contains the thumbnail image binary. If the request fails, the response contains an error code and a message to help determine what went wrong.

```text
Response:

StatusCode: 200, ReasonPhrase: 'OK', Version: 1.1, Content: System.Net.Http.StreamContent, Headers:
{
  Pragma: no-cache
  apim-request-id: 131eb5b4-5807-466d-9656-4c1ef0a64c9b
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  x-content-type-options: nosniff
  Cache-Control: no-cache
  Date: Tue, 06 Jun 2017 20:54:07 GMT
  X-AspNet-Version: 4.0.30319
  X-Powered-By: ASP.NET
  Content-Length: 5800
  Content-Type: image/jpeg
  Expires: -1
}
```

## Optical Character Recognition (OCR) with Computer Vision API using C#<a name="OCR"> </a>

Use the [Optical Character Recognition (OCR) method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fc) to detect printed text in an image and extract recognized characters into a machine-usable character stream.

### OCR C# example request

Create a new Console solution in Visual Studio, then replace Program.cs with the following code. Change the `uriBase` to use the location where you obtained your subscription keys, and replace the `subscriptionKey` value with your valid subscription key.

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
		const string uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/ocr";


		static void Main()
		{
			// Get the path and filename to process from the user.
			Console.WriteLine("Optical Character Recognition:");
			Console.Write("Enter the path to an image with text you wish to read: ");
			string imageFilePath = Console.ReadLine();

			// Execute the REST API call.
			MakeOCRRequest(imageFilePath);

			Console.WriteLine("\nPlease wait a moment for the results to appear. Then, press Enter to exit...\n");
			Console.ReadLine();
		}


		/// <summary>
		/// Gets the text visible in the specified image file by using the Computer Vision REST API.
		/// </summary>
		/// <param name="imageFilePath">The image file.</param>
		static async void MakeOCRRequest(string imageFilePath)
		{
			HttpClient client = new HttpClient();

			// Request headers.
			client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

			// Request parameters.
			string requestParameters = "language=unk&detectOrientation=true";

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

### OCR Example Response

Upon success, the OCR results returned include text, bounding box for regions, lines, and words.

```json
{
   "language": "en",
   "textAngle": -1.5000000000000335,
   "orientation": "Up",
   "regions": [
      {
         "boundingBox": "154,49,351,575",
         "lines": [
            {
               "boundingBox": "165,49,340,117",
               "words": [
                  {
                     "boundingBox": "165,49,63,109",
                     "text": "A"
                  },
                  {
                     "boundingBox": "261,50,244,116",
                     "text": "GOAL"
                  }
               ]
            },
            {
               "boundingBox": "165,169,339,93",
               "words": [
                  {
                     "boundingBox": "165,169,339,93",
                     "text": "WITHOUT"
                  }
               ]
            },
            {
               "boundingBox": "159,264,342,117",
               "words": [
                  {
                     "boundingBox": "159,264,64,110",
                     "text": "A"
                  },
                  {
                     "boundingBox": "255,266,246,115",
                     "text": "PLAN"
                  }
               ]
            },
            {
               "boundingBox": "161,384,338,119",
               "words": [
                  {
                     "boundingBox": "161,384,86,113",
                     "text": "IS"
                  },
                  {
                     "boundingBox": "274,387,225,116",
                     "text": "JUST"
                  }
               ]
            },
            {
               "boundingBox": "154,506,341,118",
               "words": [
                  {
                     "boundingBox": "154,506,62,111",
                     "text": "A"
                  },
                  {
                     "boundingBox": "248,508,247,116",
                     "text": "WISH"
                  }
               ]
            }
         ]
      }
   ]
}
```

## Text recognition with Computer Vision API using C# <a name="RecognizeText"> </a>

Use the [RecognizeText method](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/587f2c6a154055056008f200) to detect handwritten or printed text in an image and extract recognized characters into a machine-usable character stream.

### Handwriting recognition C# example

Create a new Console solution in Visual Studio, then replace Program.cs with the following code. Change the `uriBase` to use the location where you obtained your subscription keys, and replace the `subscriptionKey` value with your valid subscription key.

```c#
using System;
using System.IO;
using System.Linq;
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
		const string uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/recognizeText";


		static void Main()
		{
			// Get the path and filename to process from the user.
			Console.WriteLine("Handwriting Recognition:");
			Console.Write("Enter the path to an image with handwritten text you wish to read: ");
			string imageFilePath = Console.ReadLine();

			// Execute the REST API call.
			ReadHandwrittenText(imageFilePath);

			Console.WriteLine("\nPlease wait a moment for the results to appear. Then, press Enter to exit...\n");
			Console.ReadLine();
		}


		/// <summary>
		/// Gets the handwritten text from the specified image file by using the Computer Vision REST API.
		/// </summary>
		/// <param name="imageFilePath">The image file with handwritten text.</param>
		static async void ReadHandwrittenText(string imageFilePath)
		{
			HttpClient client = new HttpClient();

			// Request headers.
			client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

			// Request parameter. Set "handwriting" to false for printed text.
			string requestParameters = "handwriting=true";

			// Assemble the URI for the REST API Call.
			string uri = uriBase + "?" + requestParameters;

			HttpResponseMessage response = null;

			// This operation requrires two REST API calls. One to submit the image for processing,
			// the other to retrieve the text found in the image. This value stores the REST API
			// location to call to retrieve the text.
			string operationLocation = null;

			// Request body. Posts a locally stored JPEG image.
			byte[] byteData = GetImageAsByteArray(imageFilePath);
			ByteArrayContent content = new ByteArrayContent(byteData);

			// This example uses content type "application/octet-stream".
			// You can also use "application/json" and specify an image URL.
			content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

			// The first REST call starts the async process to analyze the written text in the image.
			response = await client.PostAsync(uri, content);

			// The response contains the URI to retrieve the result of the process.
			if (response.IsSuccessStatusCode)
				operationLocation = response.Headers.GetValues("Operation-Location").FirstOrDefault();
			else
			{
				// Display the JSON error data.
				Console.WriteLine("\nError:\n");
				Console.WriteLine(JsonPrettyPrint(await response.Content.ReadAsStringAsync()));
				return;
			}

			// The second REST call retrieves the text written in the image.
			//
			// Note: The response may not be immediately available. Handwriting recognition is an
			// async operation that can take a variable amount of time depending on the length
			// of the handwritten text. You may need to wait or retry this operation.
			//
			// This example checks once per second for ten seconds.
			string contentString;
			int i = 0;
			do
			{
				System.Threading.Thread.Sleep(1000);
				response = await client.GetAsync(operationLocation);
				contentString = await response.Content.ReadAsStringAsync();
				++i;
			}
			while (i < 10 && contentString.IndexOf("\"status\":\"Succeeded\"") == -1);

			if (i == 10 && contentString.IndexOf("\"status\":\"Succeeded\"") == -1)
			{
				Console.WriteLine("\nTimeout error.\n");
				return;
			}

			// Display the JSON response.
			Console.WriteLine("\nResponse:\n");
			Console.WriteLine(JsonPrettyPrint(contentString));
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

### Handwriting recognition response

A successful response is returned in JSON. Following is an example of a successful response:

```json
{
   "status": "Succeeded",
   "recognitionResult": {
      "lines": [
         {
            "boundingBox": [
               99,
               195,
               1309,
               45,
               1340,
               292,
               130,
               442
            ],
            "text": "when you write them down",
            "words": [
               {
                  "boundingBox": [
                     152,
                     191,
                     383,
                     154,
                     341,
                     421,
                     110,
                     458
                  ],
                  "text": "when"
               },
               {
                  "boundingBox": [
                     436,
                     145,
                     607,
                     118,
                     565,
                     385,
                     394,
                     412
                  ],
                  "text": "you"
               },
               {
                  "boundingBox": [
                     644,
                     112,
                     873,
                     76,
                     831,
                     343,
                     602,
                     379
                  ],
                  "text": "write"
               },
               {
                  "boundingBox": [
                     895,
                     72,
                     1092,
                     41,
                     1050,
                     308,
                     853,
                     339
                  ],
                  "text": "them"
               },
               {
                  "boundingBox": [
                     1140,
                     33,
                     1400,
                     0,
                     1359,
                     258,
                     1098,
                     300
                  ],
                  "text": "down"
               }
            ]
         },
         {
            "boundingBox": [
               142,
               222,
               1252,
               62,
               1269,
               180,
               159,
               340
            ],
            "text": "You remember things better",
            "words": [
               {
                  "boundingBox": [
                     140,
                     223,
                     267,
                     205,
                     288,
                     324,
                     162,
                     342
                  ],
                  "text": "You"
               },
               {
                  "boundingBox": [
                     314,
                     198,
                     740,
                     137,
                     761,
                     256,
                     335,
                     317
                  ],
                  "text": "remember"
               },
               {
                  "boundingBox": [
                     761,
                     134,
                     1026,
                     95,
                     1047,
                     215,
                     782,
                     253
                  ],
                  "text": "things"
               },
               {
                  "boundingBox": [
                     1046,
                     92,
                     1285,
                     58,
                     1307,
                     177,
                     1068,
                     212
                  ],
                  "text": "better"
               }
            ]
         },
         {
            "boundingBox": [
               155,
               405,
               537,
               338,
               557,
               449,
               175,
               516
            ],
            "text": "by hand",
            "words": [
               {
                  "boundingBox": [
                     146,
                     408,
                     266,
                     387,
                     301,
                     495,
                     181,
                     516
                  ],
                  "text": "by"
               },
               {
                  "boundingBox": [
                     290,
                     383,
                     569,
                     334,
                     604,
                     443,
                     325,
                     491
                  ],
                  "text": "hand"
               }
            ]
         }
      ]
   }
}
```