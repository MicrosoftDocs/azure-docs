---
title: "Example: Identify faces in images - Face API"
titleSuffix: Azure Cognitive Services
description: Use the Face API to identify faces in images.
services: cognitive-services
author: SteveMSFT
manager: cgronlun

ms.service: cognitive-services
ms.component: face-api
ms.topic: sample
ms.date: 03/01/2018
ms.author: sbowles
---

# Example: How to identify faces in images

This guide demonstrates how to identify unknown faces using PersonGroups, which are created from known people in advance. The samples are written in C# using the Face API client library.

## Concepts

If you are not familiar with the following concepts in this guide, please search for the definitions in our [glossary](../Glossary.md) at any time:

- Face - Detect
- Face - Identify
- PersonGroup

## Preparation

In this sample, we demonstrate the following:

- How to create a PersonGroup - This PersonGroup contains a list of known people.
- How to assign faces to each person - These faces are used as a baseline to identify people. It is recommended to use clear front faces, just like your photo ID. A good set of photos should contain faces of the same person in different poses, clothes' colors or hair styles.

To carry out the demonstration of this sample, you need to prepare a bunch of pictures:

- A few photos with the person's face. [Click here to download sample photos](https://github.com/Microsoft/Cognitive-Face-Windows/tree/master/Data) for Anna, Bill, and Clare.
- A series of test photos, which may or may not contain the faces of Anna, Bill or Clare used to test identification. You can also select some sample images from the preceding link.

## Step 1: Authorize the API call

Every call to the Face API requires a subscription key. This key can be either passed through a query string parameter, or specified in the request header. To pass the subscription key through query string, please refer to the request URL for the [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) as an example:
```
https://westus.api.cognitive.microsoft.com/face/v1.0/detect[?returnFaceId][&returnFaceLandmarks][&returnFaceAttributes]
&subscription-key=<Subscription key>
```

As an alternative, the subscription key can also be specified in the HTTP request header: **ocp-apim-subscription-key: &lt;Subscription Key&gt;**
When using a client library, the subscription key is passed in through the constructor of the FaceServiceClient class. For example:
 
```CSharp 
faceServiceClient = new FaceServiceClient("<Subscription Key>");
```
 
The subscription key can be obtained from the Marketplace page of your Azure portal. See [Subscriptions](https://azure.microsoft.com/try/cognitive-services/).

## Step 2: Create the PersonGroup

In this step, we created a PersonGroup named "MyFriends" that contains three people: Anna, Bill, and Clare. Each person has several faces registered. The faces need to be detected from the images. After all of these steps, you have a PersonGroup like the following image:

![HowToIdentify1](../Images/group.image.1.jpg)

### 2.1 Define people for the PersonGroup
A person is a basic unit of identify. A person can have one or more known faces registered. However, a PersonGroup is a collection of people, and each person is defined within a particular PersonGroup. The identification is done against a PersonGroup. So, the task is to create a PersonGroup, and then create people in it, such as Anna, Bill, and Clare.

First, you need to create a new PersonGroup. This is executed by using the [PersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244) API. The corresponding client library API is the CreatePersonGroupAsync method for the FaceServiceClient class. The group ID specified to create the group is unique for each subscription –you can also get, update, or delete PersonGroups using other PersonGroup APIs. Once a group is defined, people can then be defined within it by using the [PersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c) API. The client library method is CreatePersonAsync. You can add face to each person after they're created.

```CSharp 
// Create an empty PersonGroup
string personGroupId = "myfriends";
await faceServiceClient.CreatePersonGroupAsync(personGroupId, "My Friends");
 
// Define Anna
CreatePersonResult friend1 = await faceServiceClient.CreatePersonAsync(
    // Id of the PersonGroup that the person belonged to
    personGroupId,    
    // Name of the person
    "Anna"            
);
 
// Define Bill and Clare in the same way
```
### <a name="step2-2"></a> 2.2 Detect faces and register them to correct person
Detection is done by sending a "POST" web request to the [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) API with the image file in the HTTP request body. When using the client library, face detection is executed through the DetectAsync method for the FaceServiceClient class.

For each face detected you can call [PersonGroup Person – Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b) to add it to the correct person.

The following code demonstrates the process of how to detect a face from an image and add it to a person:
```CSharp 
// Directory contains image files of Anna
const string friend1ImageDir = @"D:\Pictures\MyFriends\Anna\";
 
foreach (string imagePath in Directory.GetFiles(friend1ImageDir, "*.jpg"))
{
    using (Stream s = File.OpenRead(imagePath))
    {
        // Detect faces in the image and add to Anna
        await faceServiceClient.AddPersonFaceAsync(
            personGroupId, friend1.PersonId, s);
    }
}
// Do the same for Bill and Clare
``` 
Notice that if the image contains more than one face, only the largest face is added. You can add other faces to the person by passing a string in the format of "targetFace = left, top, width, height" to [PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b) API's targetFace query parameter, or using the targetFace optional parameter for the AddPersonFaceAsync method to add other faces. Each face added to the person will be given a unique persisted face ID, which can be used in [PersonGroup Person – Delete Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523e) and [Face – Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239).

## Step 3: Train the PersonGroup

The PersonGroup must be trained before an identification can be performed using it. Moreover, it has to be retrained after adding or removing any person, or if any person has their registered face edited. The training is done by the [PersonGroup – Train](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249) API. When using the client library, it is simply a call to the TrainPersonGroupAsync method:
 
```CSharp 
await faceServiceClient.TrainPersonGroupAsync(personGroupId);
```
 
The training is an asynchronous process. It may not be finished even after the TrainPersonGroupAsync method returned. You may need to query the training status by [PersonGroup - Get Training Status](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395247) API or GetPersonGroupTrainingStatusAsync method of the client library. The following code demonstrates a simple logic of waiting PersonGroup training to finish:
 
```CSharp 
TrainingStatus trainingStatus = null;
while(true)
{
    trainingStatus = await faceServiceClient.GetPersonGroupTrainingStatusAsync(personGroupId);
 
    if (trainingStatus.Status != Status.Running)
    {
        break;
    }
 
    await Task.Delay(1000);
} 
``` 

## Step 4: Identify a face against a defined PersonGroup

When performing identifications, the Face API can compute the similarity of a test face among all the faces within a group, and returns the most comparable person(s) for that testing face. This is done through the [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239) API or the IdentifyAsync method of the client library.

The testing face needs to be detected using the previous steps, and then the face ID is passed to the identify API as a second argument. Multiple face IDs can be identified at once, and the result will contain all the identify results. By default, the identify returns only one person that matches the test face best. If you prefer, you can specify the optional parameter maxNumOfCandidatesReturned to let the identify return more candidates.

The following code demonstrates the process of identify:

```CSharp 
string testImageFile = @"D:\Pictures\test_img1.jpg";

using (Stream s = File.OpenRead(testImageFile))
{
    var faces = await faceServiceClient.DetectAsync(s);
    var faceIds = faces.Select(face => face.FaceId).ToArray();
 
    var results = await faceServiceClient.IdentifyAsync(personGroupId, faceIds);
    foreach (var identifyResult in results)
    {
        Console.WriteLine("Result of face: {0}", identifyResult.FaceId);
        if (identifyResult.Candidates.Length == 0)
        {
            Console.WriteLine("No one identified");
        }
        else
        {
            // Get top 1 among all candidates returned
            var candidateId = identifyResult.Candidates[0].PersonId;
            var person = await faceServiceClient.GetPersonAsync(personGroupId, candidateId);
            Console.WriteLine("Identified as {0}", person.Name);
        }
    }
}
``` 

When you have finished the steps, you can try to identify different faces and see if the faces of Anna, Bill or Clare can be correctly identified, according to the image(s) uploaded for face detection. See the following examples:

![HowToIdentify2](../Images/identificationResult.1.jpg )

## Step 5: Request for large-scale

As is known, a PersonGroup can hold up to 10,000 persons due to the limitation of previous design.
For more information about up to million-scale scenarios, see [How to use the large-scale feature](how-to-use-large-scale.md).

## Summary

In this guide, you have learned the process of creating a PersonGroup and identifying a person. The following are a quick reminder of the features previously explained and demonstrated:

- Detecting faces using the [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d) API
- Creating PersonGroups using the [PersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244) API
- Creating persons using the [PersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c) API
- Train a PersonGroup using the [PersonGroup – Train](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249) API
- Identifying unknown faces against the PersonGroup using the [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239) API

## Related Topics

- [How to Detect Faces in Image](HowtoDetectFacesinImage.md)
- [How to Add Faces](how-to-add-faces.md)
- [How to use the large-scale feature](how-to-use-large-scale.md)
