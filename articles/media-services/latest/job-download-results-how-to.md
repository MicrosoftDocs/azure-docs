---
title: Download the results of a job - Azure Media Services 
description: This article demonstrates how to download the results of a job.
author: IngridAtMicrosoft
manager: femila
ms.service: media-services 
ms.topic: how-to
ms.date: 03/09/2022
ms.author: inhenkel
---

# Download the results of a job

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

In Azure Media Services, when processing your videos (for example, encoding or analyzing) you need to create an output [asset](assets-concept.md) to store the result of your [job](transform-jobs-concept.md). You can then download these results to a local folder using Media Service and Storage APIs. 

This article demonstrates how to download the results using Java and .NET SDKs.

## Methods

## [.NET](#tab/net/)

```csharp
/// <summary>
/// Use Media Service and Storage APIs to download the output files to a local folder
/// </summary>
/// <param name="client">The Media Services client.</param>
/// <param name="resourceGroupName">The name of the resource group within the Azure subscription.</param>
/// <param name="accountName">The Media Services account name.</param>
/// <param name="assetName">The asset name.</param>
/// <param name="resultsFolder">The output folder name for downloaded files.</param>
/// <returns>A task.</returns>
private async static Task DownloadResults(IAzureMediaServicesClient client, string resourceGroupName, string accountName, string assetName, string resultsFolder)
{
    AssetContainerSas assetContainerSas = client.Assets.ListContainerSas(
                    resourceGroupName, 
                    accountName, 
                    assetName,
                    permissions: AssetContainerPermission.Read, 
                    expiryTime: DateTime.UtcNow.AddHours(1).ToUniversalTime()
                    );

    Uri containerSasUrl = new Uri(assetContainerSas.AssetContainerSasUrls.FirstOrDefault());
    CloudBlobContainer container = new CloudBlobContainer(containerSasUrl);

    string directory = Path.Combine(resultsFolder, assetName);
    Directory.CreateDirectory(directory);

    Console.WriteLine("Downloading results to {0}.", directory);
    
    var blobs = container.ListBlobsSegmentedAsync(null,true, BlobListingDetails.None,200,null,null,null).Result;
    
    foreach (var blobItem in blobs.Results)
    {
        if (blobItem is CloudBlockBlob)
        {
            CloudBlockBlob blob = blobItem as CloudBlockBlob;
            string filename = Path.Combine(directory, blob.Name);

            await blob.DownloadToFileAsync(filename, FileMode.Create);
        }
    }

    Console.WriteLine("Download complete.");
}
```

## Code sample

See the full code sample: [EncodingWithMESPredefinedPreset](https://github.com/Azure-Samples/media-services-v3-dotnet/blob/main/VideoEncoding/Encoding_PredefinedPreset/Program.cs)

---
