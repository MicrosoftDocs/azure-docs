---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 04/14/2023
ms.author: aahi
---

1. Sign into the [Language Studio](https://aka.ms/languageStudio). A window will appear to let you select your subscription and Language resource. Select the Language resource you created in the above step. 

2. Select the feature you want to use in Language Studio.

3. Select **Create new project** from the top menu in your projects page. Creating a project lets you label data, train, evaluate, improve, and deploy your models. 

    :::image type="content" source="../../../media/custom/create-project.png" alt-text="A screenshot of the project creation page." lightbox="../../../media/custom/create-project.png":::

4. Enter the project information, including a name, description, and the language of the files in your project. If you're using the [example dataset](https://aka.ms/custom-ta4h-quickstart-samples), select **English**. You can't change the name of your project later. Select **Next**

    > [!TIP]
    > Your dataset doesn't have to be entirely in the same language. You can have multiple documents, each with different supported languages. If your dataset contains documents of different languages or if you expect text from different languages during runtime, select **enable multi-lingual dataset** option when you enter the basic information for your project. This option can be enabled later from the **Project settings** page.

5.  After you select **Create new project**, a window will appear to let you connect your storage account. If you've already connected a storage account, you will see the storage accounted connected. If not, choose your storage account from the dropdown that appears and select **Connect storage account**; this will set the required roles for your storage account. This step will possibly return an error if you are not assigned as **owner** on the storage account.

    >[!NOTE]
    > * You only need to do this step once for each new resource you use. 
    > * This process is irreversible, if you connect a storage account to your Language resource you cannot disconnect it later.
    > * You can only connect your Language resource to one storage account.
    
6. Select the container where you have uploaded your dataset.

7. If you have already labeled data make sure it follows the supported format and select **Yes, my files are already labeled and I have formatted JSON labels file** and select the labels file from the drop-down menu. Select **Next**. If you are using the dataset from the QuickStart, there is no need to review the formatting of the JSON labels file. 

8. Review the data you entered and select **Create Project**.
