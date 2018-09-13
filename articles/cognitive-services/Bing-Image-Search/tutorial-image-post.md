---
title: Bing Image Upload for Insights | Microsoft Docs
description: Console application that uses the Bing Image Search API to upload an image and get image insights.
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.component: bing-image-search
ms.topic: article
ms.date: 12/07/2017
ms.author: v-gedod
---
# Tutorial: upload an image to Bing image upload for insights

The Bing Image Search API provides a `POST` option to upload an image and search for information pertinent to the image. This C# console application uploads an image using the Image Search endpoint to get details about the image.
The results, briefly, are JSON objects such as the following:

![[JSON results]](media/cognitive-services-bing-images-api/jsonResult.jpg)

This tutorial explains how to:

> [!div class="checklist"]
> * Use the Image Search `/details` endpoint in a `POST` request
> * Specify headers for the request
> * Use URL parameters to specify results
> * Upload the image data and send the `POST` request
> * Print the JSON results to the console

## App components

The tutorial application includes three parts:

> [!div class="checklist"]
> * Endpoint configuration to specify the Bing Image Search endpoint and required headers
> * Image file upload for `POST` request to the endpoint
> * Parsing the JSON results that are the details returned from the `POST` request

## Scenario overview
There are [three Image Search endpoints](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/image-search-endpoint). The `/details` endpoint can use a `POST` request with image data in the body of the request.
```
https://api.cognitive.microsoft.com/bing/v7.0/images/details
```
The `modules` URL parameter following `/details?` specifies what kind of details the results contain:
* `modules=All`
* `modules=RecognizedEntities` (people or places visible in the image)

Specify `modules=All` in the `POST` request to get JSON text that includes the following list:
* `bestRepresentativeQuery` - a Bing query that returns images similar to the uploaded image
* `detectedObjects` such as a bounding box or hot spots in the image
* `image` metadata
* `imageInsightsToken` - token for a subsequent `GET` request that gets `RecognizedEntities` (people or places visible in the image) 
* `imageTags`
* `pagesIncluding` - Web pages that include the image
* `relatedSearches`
* `visuallySimilarImages`

Specify `modules=RecognizedEntities` in the `POST` request to get only the `imageInsightsToken`, which is used in a subsequent `GET` request. It identifies people or places visible in the image.

## WebClient and headers for the POST request
Create a `WebClient` object, and set the headers. All requests to the Bing Search API require an `Ocp-Apim-Subscription-Key`. A `POST` request to upload an image must also specify `ContentType: multipart/form-data`.

```
            WebClient client = new WebClient();
            client.Headers["Ocp-Apim-Subscription-Key"] = accessKey;
            client.Headers["ContentType"] = "multipart/form-data"; 
```

## Upload the image and get results

The `WebClient` class includes the `UpLoadFile` method that formats data for the `POST` request. It formats the `RequestStream` and calls `HttpWebRequest`, avoiding a lot of complexity.
Call `WebClient.UpLoadFile` with the `/details` endpoint and the image file to upload. The response is binary data that is easily converted to JSON. 

Use the JSON text to initialize an instance of the `SearchResult` structure (see the [application source code](tutorial-image-post-source.md) for context).
```        
		 const string uriBase = "https://api.cognitive.microsoft.com/bing/v7.0/images/details";

        // The image to upload. Replace with your file and path.
        const string imageFile = "ansel-adams-tetons-snake-river.jpg";
            
        byte[] resp = client.UploadFile(uriBase + "?modules=All", imageFile);
        var json = System.Text.Encoding.Default.GetString(resp);

        // Create result object for return
        var searchResult = new SearchResult()
        {
            jsonResult = json,
            relevantHeaders = new Dictionary<String, String>()
        };
```

## Print the results
The rest of the code parses the JSON result and prints it to the console.

```
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
            char last = ' ';
            int offset = 0;
            int indentLength = 2;

            foreach (char ch in json)
            {
                switch (ch)
                {
                    case '"':
                        if (!ignore) quote = !quote;
                        break;
                    case '\\':
                        if (quote && last != '\\') ignore = true;
                        break;
                }

                if (quote)
                {
                    sb.Append(ch);
                    if (last == '\\' && ignore) ignore = false;
                }
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
                            if (quote || ch != ' ') sb.Append(ch);
                            break;
                    }
                }
                last = ch;
            }

            return sb.ToString().Trim();
        }
```
## GET Request using the ImageInsightsToken
To use the `ImageInsightsToken` returned with results of a `POST`, create a `GET` request like the following:
```
https://api.cognitive.microsoft.com/bing/v7.0/images/details?InsightsToken="bcid_A2C4BB81AA2C9EF8E049C5933C546449*ccid_osS7gaos*mid_BF7CC4FC4A882A3C3D56E644685BFF7B8BACEAF2
```
If there are identifiable people or places in the image, this request will return information about them.
The [Quickstarts](https://docs.microsoft.com/azure/cognitive-services/bing-image-search) contain numerous code examples.

## Next steps

> [!div class="nextstepaction"]
> [Bing Image Search API reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference)

