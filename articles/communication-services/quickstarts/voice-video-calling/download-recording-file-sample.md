---
title: Azure Communication Services Download Call Recording File Sample
titleSuffix: An Azure Communication Services quickstart
description: Sample app for handling recording notifications and downloading media files.
author: joseys
manager: anvalent
services: azure-communication-services

ms.author: joseys
ms.date: 04/14/2021
ms.topic: overview
ms.service: azure-communication-services
---
## Prerequisits
As a prerequisite you need to create a valid ACS resource.

## Create a web hook and subscribing to recording events
Before subscribing to the recording event, we need to create a Web hook through which we will get the notification when the recording event is triggered and download the recording files.

You can write your own custom web hook to receive event notifications, the key is to send back the Validation code as response for successful handshake while subscribing the web hook to the event service.
```
public async Task<ActionResult> PostAsync([FromBody] object request)
  {
   //Deserializing the request 
    var eventGridEvent = JsonConvert.DeserializeObject<EventGridEvent[]>(request.ToString())
        .FirstOrDefault();
    var data = eventGridEvent.Data as JObject;

    // Validate whether EventType is of "Microsoft.EventGrid.SubscriptionValidationEvent"
    if (string.Equals(eventGridEvent.EventType, EventTypes.EventGridSubscriptionValidationEvent, StringComparison.OrdinalIgnoreCase))
   {
        var eventData = data.ToObject<SubscriptionValidationEventData>();
        var responseData = new SubscriptionValidationResponseData
        {
            ValidationResponse = eventData.ValidationCode
        };
        if (responseData.ValidationResponse != null)
        {
            return Ok(responseData);
        }
    }

    // Implement your logic here.
    ...
    ...
  }
```
**Note:**
- You will need to add a dependency Microsoft.Azure.EventGrid NuGet package  just for using the models.
- The Web hook endpoint needs to be a POST method as this allows event service to send the validation code.
- (Documentation link for endpoint validation and handshake)[https://docs.microsoft.com/en-us/azure/event-grid/receive-events#endpoint-validation]

Now once you have a Web hook, we need to subscribe it to the recording event.
1. Click on Events under the newly created ACS resource and then click on event subscription as shown below.
![Screenshot showing event grid UI](./media/call-recording/image1-event-grid.png)

2. Now configure the event subscription and select the appropriate Event Type as Call Recording File Status Update, and Endpoint type as Web hook. We are using web hook as an example to get notification once the recording event is invoked.
![Create Event Subscription](./media/call-recording/image2-create-subscription.png)

3. Now subscribe to the recording event by adding the URL for the web hook as the Subscriber Endpoint.
![Subscribe to Event](./media/call-recording/image3-subscribe-to-event.png)

## Notification Schema
Once the recoding is available to download the recording service will send an notification on the Recording event with the following schema:
> The document ids for the recording can be fetched from the documentId fields in the recordingChunks for each chunk.

```
{
    "id": string, // Unique guid for event
    "topic": string, // Acs resource id
    "subject": string, // /recording/call/{call-id}
    "data": {
        "recordingStorageInfo": {
            "recordingChunks": [
                {
                    "documentId": string, // Document id for retrieving from AMS storage
                    "index": int, // Index providing ordering for this chunk in the entire recording
                    "endReason": string, // Reason for chunk ending: "SessionEnded", "ChunkMaximumSizeExceeded”, etc.
                }
            ]
        },
        "recordingStartTime": string, // ISO 8601 date time for the start of the recording
        "recordingDurationMs": int, // Duration of recording in milliseconds
        "sessionEndReason": string // Reason for call ending: "CallEnded", "InitiatorLeft”, etc.
    },
    "eventType": string, // "Microsoft.Communication.RecordingFileStatusUpdated"
    "dataVersion": string, // "1.0"
    "metadataVersion": string, // "1"
    "eventTime": string // ISO 8601 date time for when the event was created
}
```
## Download recording files
Now once we get the document id for the file to download, we shall call below ACS apis for downloading the recording file and metadata using HMAC authentication.
The maximum recording file size is currently 1.5GB. After that point, recorder will split the recording into multiple files.
Client should be able to download a recording file with a single request. If there is an issue, the client can retry with a range header to avoid redownloading the whole thing.

Download call recording file: Method: GET URL: https://contoso.communication.azure.com/recording/download/{documentId}?api-version=2021-04-15-preview1

Download call recording meta-data: Method: GET URL: https://contoso.communication.azure.com/recording/download/{documentId}/metadata?api-version=2021-04-15-preview1

### Authentication
In order to call ACS apis for downloading recording file and meta data, we need HMAC authentication to authenticate the request.
One can simply create a Http client and add the necessary headers using the HmacAuthentication utility provided below:
```
  var client = new HttpClient();

  // Set Http Method
  var method = HttpMethod.Get;
  StringContent content = null;

  // Build request
  var request = new HttpRequestMessage
  {
      Method = method, // Http GET mmethod
      RequestUri = new Uri(<Download_Recording_Url>), // Download recording Urls
      Content = content // content if required for POST methods
  };

  // Question: Why we need to pass String.Empty to CreateContentHash() method?
  // Answer: In HMAC authentication hash of the content is one of the parameter to generate the HMAC token.
  // In our case our recoridng download apis are GET method and does not have any content/body to be passed in the request. 
  // However in this case we still need the SHA256 hash for the empty content and hence we pass empty string. 
  // In a generic case where apis with POST method which are guarded by HMAC authentication we need to pass the content so 
  // that we get back the corresponding Hash code to pass the authentication.

  string serializedPayload = string.Empty;

  // Hash the content of the request.
  var contentHashed = HmacAuthenticationUtils.CreateContentHash(serializedPayload);

  // Add HAMC headers.
  HmacAuthenticationUtils.AddHmacHeaders(request, contentHashed, accessKey, method);

  // Make a request to the ACS apis mentioned above
  var response = await client.SendAsync(request).ConfigureAwait(false);
```
#### HmacAuthenticationUtils 
**Create content hash**
```
public static string CreateContentHash(string content)
{
    var alg = SHA256.Create();

    using (var memoryStream = new MemoryStream())
    using (var contentHashStream = new CryptoStream(memoryStream, alg, CryptoStreamMode.Write))
    {
        using (var swEncrypt = new StreamWriter(contentHashStream))
        {
            if (content != null)
            {
                swEncrypt.Write(content);
            }
        }
    }

    return Convert.ToBase64String(alg.Hash);
}
```
**Add HMAC headers**
```
public static void AddHmacHeaders(HttpRequestMessage requestMessage, string contentHash, string accessKey)
{
    var utcNowString = DateTimeOffset.UtcNow.ToString("r", CultureInfo.InvariantCulture);
    var uri = requestMessage.RequestUri;
    var host = uri.Authority;
    var pathAndQuery = uri.PathAndQuery;

    var stringToSign = $"{requestMessage.Method}\n{pathAndQuery}\n{utcNowString};{host};{contentHash}";
    var hmac = new HMACSHA256(Convert.FromBase64String(accessKey));
    var hash = hmac.ComputeHash(Encoding.ASCII.GetBytes(stringToSign));
    var signature = Convert.ToBase64String(hash);
    var authorization = $"HMAC-SHA256 SignedHeaders=date;host;x-ms-content-sha256&Signature={signature}";

    requestMessage.Headers.Add("x-ms-content-sha256", contentHash);
    requestMessage.Headers.Add("Date", utcNowString);
    requestMessage.Headers.Add("Authorization", authorization);
}
```
