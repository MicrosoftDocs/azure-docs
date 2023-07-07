---
title: "Example: Use the PersonDirectory data structure - Face"
titleSuffix: Azure AI services
description: Learn how to use the PersonDirectory data structure to store face and person data at greater capacity and with other new features.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: how-to
ms.date: 07/20/2022
ms.author: pafarley
ms.devlang: csharp
ms.custom: [devx-track-csharp, cogserv-non-critical-vision]
---

# Use the PersonDirectory data structure (preview)

[!INCLUDE [Gate notice](../includes/identity-gate-notice.md)]

To perform face recognition operations such as Identify and Find Similar, Face API customers need to create an assorted list of **Person** objects. **PersonDirectory** is a data structure in Public Preview that contains unique IDs, optional name strings, and optional user metadata strings for each **Person** identity added to the directory. Follow this guide to learn how to do basic tasks with **PersonDirectory**.

## Advantages of PersonDirectory

Currently, the Face API offers the **LargePersonGroup** structure, which has similar functionality but is limited to 1 million identities. The **PersonDirectory** structure can scale up to 75 million identities.

Another major difference between **PersonDirectory** and previous data structures is that you'll no longer need to make any Train API calls after adding faces to a **Person** object&mdash;the update process happens automatically.

## Prerequisites
* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).
* Once you have your Azure subscription, [create a Face resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesFace) in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
  * You'll need the key and endpoint from the resource you create to connect your application to the Face API. You'll paste your key and endpoint into the code below.
  * You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.

## Add Persons to the PersonDirectory

**Persons** are the base enrollment units in the **PersonDirectory**. Once you add a **Person** to the directory, you can add up to 248 face images to that **Person**, per recognition model. Then you can identify faces against them using varying scopes.

### Create the Person
To create a **Person**, you need to call the **CreatePerson** API and provide a name or userData property value.

```csharp
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

var client = new HttpClient();

// Request headers
client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "{subscription key}");

var addPersonUri = "https:// {endpoint}/face/v1.0-preview/persons";

HttpResponseMessage response;

// Request body
var body = new Dictionary<string, object>();
body.Add("name", "Example Person");
body.Add("userData", "User defined data");
byte[] byteData = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(body));

using (var content = new ByteArrayContent(byteData))
{
    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
    response = await client.PostAsync(addPersonUri, content); 
}
```

The CreatePerson call will return a generated ID for the **Person** and an operation location. The **Person** data will be processed asynchronously, so you use the operation location to fetch the results. 

### Wait for asynchronous operation completion
You'll need to query the async operation status using the returned operation location string to check the progress. 

First, you should define a data model like the following to handle the status response.

```csharp
[Serializable]
public class AsyncStatus
{
    [DataMember(Name = "status")]
    public string Status { get; set; }

    [DataMember(Name = "createdTime")]
    public DateTime CreatedTime { get; set; }

    [DataMember(Name = "lastActionTime")]
    public DateTime? LastActionTime { get; set; }

    [DataMember(Name = "finishedTime", EmitDefaultValue = false)]
    public DateTime? FinishedTime { get; set; }

    [DataMember(Name = "resourceLocation", EmitDefaultValue = false)]
    public string ResourceLocation { get; set; }

    [DataMember(Name = "message", EmitDefaultValue = false)]
    public string Message { get; set; }
}
```

Using the HttpResponseMessage from above, you can then poll the URL and wait for results.

```csharp
string operationLocation = response.Headers.GetValues("Operation-Location").FirstOrDefault();

Stopwatch s = Stopwatch.StartNew();
string status = "notstarted";
do
{
    if (status == "succeeded")
    {
        await Task.Delay(500);
    }

    var operationResponseMessage = await client.GetAsync(operationLocation);

    var asyncOperationObj = JsonConvert.DeserializeObject<AsyncStatus>(await operationResponseMessage.Content.ReadAsStringAsync());
    status = asyncOperationObj.Status;

} while ((status == "running" || status == "notstarted") && s.Elapsed < TimeSpan.FromSeconds(30));
```


Once the status returns as "succeeded", the **Person** object is considered added to the directory.

> [!NOTE]
> The asynchronous operation from the Create **Person** call does not have to show "succeeded" status before faces can be added to it, but it does need to be completed before the **Person** can be added to a **DynamicPersonGroup** (see below Create and update a **DynamicPersonGroup**) or compared during an Identify call. Verify calls will work immediately after faces are successfully added to the **Person**.


### Add faces to Persons

Once you have the **Person** ID from the Create Person call, you can add up to 248 face images to a **Person** per recognition model. Specify the recognition model (and optionally the detection model) to use in the call, as data under each recognition model will be processed separately inside the **PersonDirectory**.

The currently supported recognition models are:
* `Recognition_02`
* `Recognition_03`
* `Recognition_04`

Additionally, if the image contains multiple faces, you'll need to specify the rectangle bounding box for the face that is the intended target. The following code adds faces to a **Person** object.

```csharp
var client = new HttpClient();

// Request headers
client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "{subscription key}");

// Optional query strings for more fine grained face control
var queryString = "userData={userDefinedData}&targetFace={left,top,width,height}&detectionModel={detectionModel}";
var uri = "https://{endpoint}/face/v1.0-preview/persons/{personId}/recognitionModels/{recognitionModel}/persistedFaces?" + queryString;

HttpResponseMessage response;

// Request body
var body = new Dictionary<string, object>();
body.Add("url", "{image url}");
byte[] byteData = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(body));

using (var content = new ByteArrayContent(byteData))
{
    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
    response = await client.PostAsync(uri, content);
}
```

After the Add Faces call, the face data will be processed asynchronously, and you'll need to wait for the success of the operation in the same manner as before.

When the operation for the face addition finishes, the data will be ready for in Identify calls.

## Create and update a **DynamicPersonGroup**

**DynamicPersonGroups** are collections of references to **Person** objects within a **PersonDirectory**; they're used to create subsets of the directory. A common use is when you want to get fewer false positives and increased accuracy in an Identify operation by limiting the scope to just the **Person** objects you expect to match. Practical use cases include directories for specific building access among a larger campus or organization. The organization directory may contain 5 million individuals, but you only need to search a specific 800 people for a particular building, so you would create a **DynamicPersonGroup** containing those specific individuals. 

If you've used a **PersonGroup** before, take note of two major differences: 
* Each **Person** inside a **DynamicPersonGroup** is a reference to the actual **Person** in the **PersonDirectory**, meaning that it's not necessary to recreate a **Person** in each group.
* As mentioned in previous sections, there's no need to make Train calls, as the face data is processed at the Directory level automatically.

### Create the group

To create a **DynamicPersonGroup**, you need to provide a group ID with alphanumeric or dash characters. This ID will function as the unique identifier for all usage purposes of the group.

There are two ways to initialize a group collection. You can create an empty group initially, and populate it later:

```csharp
var client = new HttpClient();

// Request headers
client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "{subscription key}");

var uri = "https://{endpoint}/face/v1.0-preview/dynamicpersongroups/{dynamicPersonGroupId}";

HttpResponseMessage response;

// Request body
var body = new Dictionary<string, object>();
body.Add("name", "Example DynamicPersonGroup");
body.Add("userData", "User defined data");
byte[] byteData = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(body));

using (var content = new ByteArrayContent(byteData))
{
    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
    response = await client.PutAsync(uri, content);
}
```

This process is immediate and there's no need to wait for any asynchronous operations to succeed.

Alternatively, you can create it with a set of **Person** IDs to contain those references from the beginning by providing the set in the _AddPersonIds_ argument:

```csharp
var client = new HttpClient();

// Request headers
client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "{subscription key}");

var uri = "https://{endpoint}/face/v1.0-preview/dynamicpersongroups/{dynamicPersonGroupId}";

HttpResponseMessage response;

// Request body
var body = new Dictionary<string, object>();
body.Add("name", "Example DynamicPersonGroup");
body.Add("userData", "User defined data");
body.Add("addPersonIds", new List<string>{"{guid1}", "{guid2}", …});
byte[] byteData = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(body));

using (var content = new ByteArrayContent(byteData))
{
    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
    response = await client.PutAsync(uri, content);

    // Async operation location to query the completion status from
    var operationLocation = response.Headers.Get("Operation-Location");
}
```

> [!NOTE]
> As soon as the call returns, the created **DynamicPersonGroup** will be ready to use in an Identify call, with any **Person** references provided in the process. The completion status of the returned operation ID, on the other hand, indicates the update status of the person-to-group relationship.

### Update the DynamicPersonGroup

After the initial creation, you can add and remove **Person** references from the **DynamicPersonGroup** with the Update Dynamic Person Group API. To add **Person** objects to the group, list the **Person** IDs in the _addPersonsIds_ argument. To remove **Person** objects, list them in the _removePersonIds_ argument. Both adding and removing can be performed in a single call:

```csharp
var client = new HttpClient();

// Request headers
client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "{subscription key}");

var uri = "https://{endpoint}/face/v1.0-preview/dynamicpersongroups/{dynamicPersonGroupId}";

HttpResponseMessage response;

// Request body
var body = new Dictionary<string, object>();
body.Add("name", "Example Dynamic Person Group updated");
body.Add("userData", "User defined data updated");
body.Add("addPersonIds", new List<string>{"{guid1}", "{guid2}", …});
body.Add("removePersonIds", new List<string>{"{guid1}", "{guid2}", …});
byte[] byteData = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(body));

using (var content = new ByteArrayContent(byteData))
{
    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
    response = await client.PatchAsync(uri, content);

    // Async operation location to query the completion status from
    var operationLocation = response.Headers.Get("Operation-Location");
}
```

Once the call returns, the updates to the collection will be reflected when the group is queried. As with the creation API, the returned operation indicates the update status of person-to-group relationship for any **Person** that's involved in the update. You don't need to wait for the completion of the operation before making further Update calls to the group.

## Identify faces in a PersonDirectory

The most common way to use face data in a **PersonDirectory** is to compare the enrolled **Person** objects against a given face and identify the most likely candidate it belongs to. Multiple faces can be provided in the request, and each will receive its own set of comparison results in the response.

In **PersonDirectory**, there are three types of scopes each face can be identified against:

### Scenario 1: Identify against a DynamicPersonGroup
 
Specifying the _dynamicPersonGroupId_ property in the request compares the face against every **Person** referenced in the group. Only a single **DynamicPersonGroup** can be identified against in a call. 

```csharp
var client = new HttpClient();

// Request headers
client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "{subscription key}");

// Optional query strings for more fine grained face control
var uri = "https://{endpoint}/face/v1.0-preview/identify";

HttpResponseMessage response;

// Request body
var body = new Dictionary<string, object>();
body.Add("faceIds", new List<string>{"{guid1}", "{guid2}", …});
body.Add("dynamicPersonGroupId", "{dynamicPersonGroupIdToIdentifyIn}");
byte[] byteData = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(body));

using (var content = new ByteArrayContent(byteData))
{
    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
    response = await client.PostAsync(uri, content);
}
```

### Scenario 2: Identify against a specific list of persons

You can also specify a list of **Person** IDs in the _personIds_ property to compare the face against each of them.

```csharp
var client = new HttpClient();

// Request headers
client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "{subscription key}");
            
var uri = "https://{endpoint}/face/v1.0-preview/identify";

HttpResponseMessage response;

// Request body
var body = new Dictionary<string, object>();
body.Add("faceIds", new List<string>{"{guid1}", "{guid2}", …});
body.Add("personIds", new List<string>{"{guid1}", "{guid2}", …});
byte[] byteData = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(body));

using (var content = new ByteArrayContent(byteData))
{
    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
    response = await client.PostAsync(uri, content);
}
```

### Scenario 3: Identify against the entire **PersonDirectory**

Providing a single asterisk in the _personIds_ property in the request compares the face against every single **Person** enrolled in the **PersonDirectory**. 
 

```csharp
var client = new HttpClient();

// Request headers
client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "{subscription key}");
            
var uri = "https://{endpoint}/face/v1.0-preview/identify";

HttpResponseMessage response;

// Request body
var body = new Dictionary<string, object>();
body.Add("faceIds", new List<string>{"{guid1}", "{guid2}", …});
body.Add("personIds", new List<string>{"*"});
byte[] byteData = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(body));

using (var content = new ByteArrayContent(byteData))
{
    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
    response = await client.PostAsync(uri, content);
}
```
For all three scenarios, the identification only compares the incoming face against faces whose AddPersonFace call has returned with a "succeeded" response.

## Verify faces against persons in the **PersonDirectory**

With a face ID returned from a detection call, you can verify if the face belongs to a specific **Person** enrolled inside the **PersonDirectory**. Specify the **Person** using the _personId_ property.

```csharp
var client = new HttpClient();

// Request headers
client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "{subscription key}");

var uri = "https://{endpoint}/face/v1.0-preview/verify";

HttpResponseMessage response;

// Request body
var body = new Dictionary<string, object>();
body.Add("faceId", "{guid1}");
body.Add("personId", "{guid1}");
var jsSerializer = new JavaScriptSerializer();
byte[] byteData = Encoding.UTF8.GetBytes(jsSerializer.Serialize(body));

using (var content = new ByteArrayContent(byteData))
{
    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
    response = await client.PostAsync(uri, content);
}
```

The response will contain a Boolean value indicating whether the service considers the new face to belong to the same **Person**, and a confidence score for the prediction.

## Next steps

In this guide, you learned how to use the **PersonDirectory** structure to store face and person data for your Face app. Next, learn the best practices for adding your users' face data.

* [Best practices for adding users](../enrollment-overview.md)
