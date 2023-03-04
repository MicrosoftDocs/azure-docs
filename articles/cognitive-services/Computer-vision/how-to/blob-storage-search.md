# How to configure your blob storage for image retrieval and video search in Vision Studio


## Getting started

To get started with the image retrieval and video search experiences in Vision Studio, you will need to [create a new Storage account](https://ms.portal.azure.com/#create/Microsoft.StorageAccount).

![Blob storage creation](../media/blob-storage/)

You can create your storage account in any region, but creating it in the same region as your Azure Computer Vision Resource is more efficient and reduces cost. Complete the required
parameters to configure your storage account and select `Review`, then `Create`. 

Once your storage account has been deployed, select `Go to resource` to open the storage account overview. 

![Go to resource](../media/blob-storage/)

In your storage account overview, find the **Settings** section in the left hand navigation and select `Resource sharing (CORS)`, shown below.

![Find resource sharing](../media/blob-storage/)


