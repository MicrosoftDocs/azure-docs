---
title: "Use limited access tokens - Face"
titleSuffix: Azure AI services
description: Learn how ISVs can manage the Face API usage of their clients by issuing access tokens that grant access to Face features which are normally gated.
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.subservice: azure-ai-face
ms.topic: how-to
ms.date: 05/11/2023
ms.author: pafarley
---

# Use limited access tokens for Face

Independent software vendors (ISVs) can manage the Face API usage of their clients by issuing access tokens that grant access to Face features which are normally gated. This allows client companies to use the Face API without having to go through the formal approval process.

This guide shows you how to generate the access tokens, if you're an approved ISV, and how to use the tokens if you're a client. 

The LimitedAccessToken feature is a part of the existing [Azure AI services token service](https://westus.dev.cognitive.microsoft.com/docs/services/57346a70b4769d2694911369/operations/issueScopedToken).  We have added a new operation for the purpose of bypassing the Limited Access gate for approved scenarios. Only ISVs that pass the gating requirements will be given access to this feature.

## Example use case

A company sells software that uses the Azure AI Face service to operate door access security systems. Their clients, individual manufacturers of door devices, subscribe to the software and run it on their devices. These client companies want to make Face API calls from their devices to perform Limited Access operations like face identification. By relying on access tokens from the ISV, they can bypass the formal approval process for face identification. The ISV, which has already been approved, can grant the client just-in-time access tokens.

## Expectation of responsibility

The issuing ISV  is responsible for ensuring that the tokens are used only for the approved purpose.

If the ISV learns that a client is using the LimitedAccessToken for non-approved purposes, the ISV should stop generating tokens for that customer. Microsoft can track the issuance and usage of LimitedAccessTokens, and we reserve the right to revoke an ISV's access to the **issueLimitedAccessToken** API if abuse is not addressed.

## Prerequisites

* [cURL](https://curl.haxx.se/) installed (or another tool that can make HTTP requests).
* The ISV needs to have either an [Azure AI Face](https://ms.portal.azure.com/#view/Microsoft_Azure_ProjectOxford/CognitiveServicesHub/~/Face) resource or an [Azure AI services multi-service](https://ms.portal.azure.com/#view/Microsoft_Azure_ProjectOxford/CognitiveServicesHub/~/AllInOne) resource.
* The client needs to have an [Azure AI Face](https://ms.portal.azure.com/#view/Microsoft_Azure_ProjectOxford/CognitiveServicesHub/~/Face) resource.

## Step 1: ISV obtains client's Face resource ID

The ISV should set up a communication channel between their own secure cloud service (which will generate the access token) and their application running on the client's device. The client's Face resource ID must be known prior to generating the LimitedAccessToken.

The Face resource ID has the following format:

`/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.CognitiveServices/accounts/<face-resource-name>`

For example:

`/subscriptions/dc4d27d9-ea49-4921-938f-7782a774e151/resourceGroups/client-rg/providers/Microsoft.CognitiveServices/accounts/client-face-api`

## Step 2: ISV generates a token

The ISV's cloud service, running in a secure environment, calls the **issueLimitedAccessToken** API using their end customer's known Face resource ID.

To call the **issueLimitedAccessToken** API, copy the following cURL command to a text editor.

```bash
curl -X POST 'https://<isv-endpoint>/sts/v1.0/issueLimitedAccessToken?expiredTime=3600' \  
-H 'Ocp-Apim-Subscription-Key: <client-face-key>' \  
-H 'Content-Type: application/json' \  
-d '{  
    "resourceId": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.CognitiveServices/accounts/<face-resource-name>",  
    "featureFlags": ["Face.Identification", "Face.Verification"]  
}' 
```

Then, make the following changes:
1. Replace `<isv-endpoint>` with the endpoint of the ISV's resource. For example, **westus.api.cognitive.microsoft.com**.
1. Optionally set the `expiredTime` parameter to set the expiration time of the token in seconds. It must be between 60 and 86400. The default value is 3600 (one hour).
1. Replace `<client-face-key>` with the key of the client's Face resource.
1. Replace `<subscription-id>` with the subscription ID of the client's Azure subscription.
1. Replace `<resource-group-name>` with the name of the client's resource group.
1. Replace `<face-resource-name>` with the name of the client's Face resource.
1. Set `"featureFlags"` to the set of access roles you want to grant. The available flags are `"Face.Identification"`, `"Face.Verification"`, and `"LimitedAccess.HighRisk"`. An ISV can only grant permissions that it has been granted itself by Microsoft. For example, if the ISV has been granted access to face identification, it can create a LimitedAccessToken for **Face.Identification** for the client. All token creations and uses are logged for usage and security purposes.

Then, paste the command into a terminal window and run it.

The API should return a `200` response with the token in the form of a JSON web token (`application/jwt`). If you want to inspect the LimitedAccessToken, you can do so using [JWT](https://jwt.io/).

## Step 3: Client application uses the token

The ISV's application can then pass the LimitedAccessToken as an HTTP request header for future Face API requests on behalf of the client. This works independently of other authentication mechanisms, so no personal information of the client's is ever leaked to the ISV. 

> [!CAUTION]
> The client doesn't need to be aware of the token value, as it can be passed in the background. If the client were to use a web monitoring tool to intercept the traffic, they'd be able to view the LimitedAccessToken header. However, because the token expires after a short period of time, they are limited in what they can do with it. This risk is known and considered acceptable.
>
> It's for each ISV to decide how exactly it passes the token from its cloud service to the client application.

#### [REST API](#tab/rest)

An example Face API request using the access token looks like this:

```bash
curl -X POST 'https://<client-endpoint>/face/v1.0/identify' \  
-H 'Ocp-Apim-Subscription-Key: <client-face-key>' \  
-H 'LimitedAccessToken: Bearer <token>' \  
-H 'Content-Type: application/json' \  
-d '{  
  "largePersonGroupId": "sample_group",  
  "faceIds": [  
    "c5c24a82-6845-4031-9d5d-978df9175426",  
    "65d083d4-9447-47d1-af30-b626144bf0fb"  
  ],  
  "maxNumOfCandidatesReturned": 1,  
  "confidenceThreshold": 0.5  
}'
```

> [!NOTE]
> The endpoint URL and Face key belong to the client's Face resource, not the ISV's resource. The `<token>` is passed as an HTTP request header.

#### [C#](#tab/csharp)

The following code snippets show you how to use an access token with the [Face SDK for C#](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.Face).

The following class uses an access token to create a **ServiceClientCredentials** object that can be used to authenticate a Face API client object. It automatically adds the access token as a header in every request that the Face client will make.

```csharp
public class LimitedAccessTokenWithApiKeyClientCredential : ServiceClientCredentials 
{
    /// <summary> 
    /// Creates a new instance of the LimitedAccessTokenWithApiKeyClientCredential class 
    /// </summary> 
    /// <param name="apiKey">API Key for the Face API or CognitiveService endpoint</param> 
    /// <param name="limitedAccessToken">LimitedAccessToken to bypass the limited access program, requires ISV sponsership.</param> 

    public LimitedAccessTokenWithApiKeyClientCredential(string apiKey, string limitedAccessToken) 
    { 
        this.ApiKey = apiKey; 
        this.LimitedAccessToken = limitedAccessToken; 
    }

    private readonly string ApiKey; 
    private readonly string LimitedAccesToken; 

    /// <summary> 
    /// Add the Basic Authentication Header to each outgoing request 
    /// </summary> 
    /// <param name="request">The outgoing request</param>
    /// <param name="cancellationToken">A token to cancel the operation</param> 
    public override Task ProcessHttpRequestAsync(HttpRequestMessage request, CancellationToken cancellationToken) 
    { 
        if (request == null) 
            throw new ArgumentNullException("request"); 
        request.Headers.Add("Ocp-Apim-Subscription-Key", ApiKey); 
        request.Headers.Add("LimitedAccessToken", $"Bearer {LimitedAccesToken}");

        return Task.FromResult<object>(null); 
    } 
} 
```

In the client-side application, the helper class can be used like in this example:

```csharp
static void Main(string[] args) 
{ 
    // create Face client object
    var faceClient = new FaceClient(new LimitedAccessTokenWithApiKeyClientCredential(apiKey: "<client-face-key>", limitedAccessToken: "<token>")); 

    faceClient.Endpoint = "https://willtest-eastus2.cognitiveservices.azure.com"; 

    // use Face client in an API call
    using (var stream = File.OpenRead("photo.jpg")) 
    {
        var result = faceClient.Face.DetectWithStreamAsync(stream, detectionModel: "Detection_03", recognitionModel: "Recognition_04", returnFaceId: true).Result; 

        Console.WriteLine(JsonConvert.SerializeObject(result)); 
    }
}
```
---

## Next steps
* [LimitedAccessToken API reference](https://westus.dev.cognitive.microsoft.com/docs/services/57346a70b4769d2694911369/operations/issueLimitedAccessToken)
