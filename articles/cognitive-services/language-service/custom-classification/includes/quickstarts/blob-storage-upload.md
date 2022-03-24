---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 01/24/2022
ms.author: aahi
ms.custom: ignite-fall-2021
---

After you have created an Azure storage account and linked it to your Language resource, you will need to upload the example files to the root directory of your container for this quickstart. These files will later be used to train your model.

1. [Download the sample movie summary data](https://go.microsoft.com/fwlink/?linkid=2175083) for this quickstart from GitHub. Open the .zip file, and extract the folder containing text files within it. 

2. In the [Azure portal](https://portal.azure.com), navigate to the storage account you created, and select it.

3. In your storage account, select **Containers** from the left menu, located below **Data storage**. On the screen that appears, select **+ Container**. Give the container the name *example-data* and leave the default **Public access level**.

    :::image type="content" source="../../../custom-named-entity-recognition/media/storage-screen.png" alt-text="A screenshot showing the main page for a storage account." lightbox="../../../custom-named-entity-recognition/media/storage-screen.png":::


4. After your container has been created, click on it. Then select the **Upload** button to select the .txt and .json files you downloaded earlier. 

    :::image type="content" source="../../../custom-named-entity-recognition/media/file-upload-screen.png" alt-text="A screenshot showing the button for uploading files to the storage account." lightbox="../../../custom-named-entity-recognition/media/file-upload-screen.png":::

    > [!TIP]
    > When you select files to upload, a file explorer will open to your computer. To select all the files in the folder, press *ctrl + a*.   

The provided sample dataset contains around 200 movie summaries that belong to one or more of the following classes: "Mystery", "Drama", "Thriller", "Comedy", "Action".