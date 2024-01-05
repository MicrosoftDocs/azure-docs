---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
ms.custom: ignite-fall-2021, event-tier1-build-2022
---


After you have created an Azure storage account and connected it to your Language resource, you will need to upload the documents from the sample dataset to the root directory of your container. These documents will later be used to train your model.

# [Multi label classification](#tab/multi-classification)

1. [Download the sample dataset for multi label classification projects](https://github.com/Azure-Samples/cognitive-services-sample-data-files/raw/master/language-service/Custom%20text%20classification/Custom%20multi%20classification%20-%20movies%20summary.zip).

2. Open the .zip file, and extract the folder containing the documents. 

The provided sample dataset contains about 200 documents,  each of which is a summary for a movie. Each document belongs to one or more of the following classes: 
* "Mystery"
* "Drama"
* "Thriller"
* "Comedy"
* "Action"

# [Single label classification](#tab/single-classification)

1. [Download the sample dataset for single label classification projects](https://github.com/Azure-Samples/cognitive-services-sample-data-files/raw/master/language-service/Custom%20text%20classification/Custom%20single%20classification%20-%20WebOfScience.zip). 

2. Open the .zip file, and extract the folder containing the documents. 

The provided sample dataset contains about 210 documents, each of which is an abstract of a scientific paper. Each document is labeled with only one class of the following classes: 
* "Computer_science"
* "Electrical_engineering"
* "Psychology"
* "Mechanical_engineering"
* "Civil_engineering"
* "Medical"
* "Biochemistry".

---

2. In the [Azure portal](https://portal.azure.com), navigate to the storage account you created, and select it. You can do this by clicking **Storage accounts** and typing your storage account name into **Filter for any field**.

    if your resource group does not show up, make sure the **Subscription equals** filter is set to **All**.

3. In your storage account, select **Containers** from the left menu, located below **Data storage**. On the screen that appears, select **+ Container**. Give the container the name **example-data** and leave the default **Public access level**.

    :::image type="content" source="../../media/storage-screen.png" alt-text="A screenshot showing the main page for a storage account." lightbox="../../media/storage-screen.png":::

4. After your container has been created, select it. Then select **Upload** button to select the `.txt` and `.json` files you downloaded earlier. 

    :::image type="content" source="../../media/file-upload-screen.png" alt-text="A screenshot showing the button for uploading files to the storage account." lightbox="../../media/file-upload-screen.png":::
