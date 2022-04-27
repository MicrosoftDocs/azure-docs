---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 11/02/2021
ms.author: aahi
ms.custom: ignite-fall-2021
---

Once your resource and storage container are configured, create a new custom text classification project. A project is a work area for building your custom AI models based on your data. Your project can only be accessed by you and others who have contributor access to the Azure resource being used.

1. Log in to [Language Studio](https://aka.ms/languageStudio). A window will appear to let you select your subscription and Language resource. Select the resource you created in the above step.

2. Under the **Classify text** section of Language Studio, select **Custom text classification** from the available services, and select it.

3. Select **Create new project** from the top menu in your projects page. Creating a project will let you tag data, train, evaluate, improve, and deploy your models. 

    :::image type="content" source="../media/create-project.png" alt-text="A screenshot of the project creation page." lightbox="../media/create-project.png":::

4. If you have created your resource using the steps above, you will need to add information about your project, like a name, and select your storage container.

    1. Select your project type. For this quickstart, we will create a multi label classification project. Then click **Next**.

    2. Enter the project information, including a name, description, and the language of the files in your project. You will not be able to change the name of your project later.

        >[!TIP]
        > Your dataset doesn't have to be entirely in the same language. You can have multiple files, each with different supported languages. If your dataset contains files of different languages or if you expect different languages during runtime, select **enable multi-lingual dataset** when you enter the basic information for your project.

    3. Select the container where you have uploaded your data. For this quickstart, we will use the existing tags file available in the container. Then click **Next**.
 
    4. Review the data you entered and select **Create Project**.
