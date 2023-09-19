---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 04/14/2023
ms.author: aahi
---

After you have created an Azure storage account and connected it to your Language resource, you will need to upload the documents from the sample dataset to the root directory of your container. These documents will later be used to train your model.


1. [Download the sample dataset](https://aka.ms/custom-ta4h-quickstart-samples) from GitHub. 

2. Open the .zip file, and extract the folder containing the documents. 

2. In the [Azure portal](https://portal.azure.com), navigate to the storage account you created, and select it.

3. In your storage account, select **Containers** from the left menu, located below **Data storage**. On the screen that appears, select **+ Container**. Give the container the name **example-data** and leave the default **Public access level**.

    :::image type="content" source="../../media/storage-screen.png" alt-text="A screenshot showing the main page for a storage account." lightbox="../../media/storage-screen.png":::

4. After your container has been created, select it. Then select **Upload** button to select the `.txt` and `.json` files you downloaded earlier. 

    :::image type="content" source="../../media/file-upload-screen.png" alt-text="A screenshot showing the button for uploading files to the storage account." lightbox="../../media/file-upload-screen.png":::


The provided sample dataset contains 12 clinical notes. Each clinical note includes several medical entities and the treatment location. We will use the prebuilt entities to extract the medical entities and train the custom model to extract the treatment location using the entity's learned and list components.
