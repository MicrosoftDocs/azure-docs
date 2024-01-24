---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
---

After you have created an Azure storage account and connected it to your Language resource, you will need to upload the documents from the sample dataset to the root directory of your container. These documents will later be used to train your model.


1. [Download the sample dataset](https://go.microsoft.com/fwlink/?linkid=2175226) from GitHub. 

2. Open the .zip file, and extract the folder containing the documents. 

2. In the [Azure portal](https://portal.azure.com), navigate to the storage account you created, and select it.

3. In your storage account, select **Containers** from the left menu, located below **Data storage**. On the screen that appears, select **+ Container**. Give the container the name **example-data** and leave the default **Public access level**.

    :::image type="content" source="../../media/storage-screen.png" alt-text="A screenshot showing the main page for a storage account." lightbox="../../media/storage-screen.png":::

4. After your container has been created, select it. Then select **Upload** button to select the `.txt` and `.json` files you downloaded earlier. 

    :::image type="content" source="../../media/file-upload-screen.png" alt-text="A screenshot showing the button for uploading files to the storage account." lightbox="../../media/file-upload-screen.png":::


The provided sample dataset contains 20 loan agreements. Each agreement includes two parties: a lender and a borrower. You can use the provided sample file to extract relevant information for: both parties, an agreement date, a loan amount, and an interest rate.
