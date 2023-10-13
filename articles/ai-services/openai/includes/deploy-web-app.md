---
services: cognitive-services
manager: nitinme
author: aahill
ms.author: aahi
ms.service: azure-ai-openai
ms.topic: include
ms.date: 06/15/2023
---

## Deploy your model

Once you're satisfied with the experience in Azure OpenAI studio, you can deploy a web app directly from the 
Studio by selecting the **Deploy to** button. 

:::image type="content" source="../media/use-your-data/deploy-model.png" alt-text="A screenshot showing the model deployment button in Azure OpenAI Studio." lightbox="../media/use-your-data/deploy-model.png":::

This gives you the option to either deploy the model as a standalone web application, or Power Virtual Agents if you're [using your own data](../concepts/use-your-data.md#deploying-the-model) on the model.   

As an example, if you choose to deploy a web app:

The first time you deploy a web app, you should select **Create a new web app**. Choose a name for the app, which will 
become part of the app URL. For example, `https://<appname>.azurewebsites.net`. 

Select your subscription, resource group, location, and pricing plan for the published app. To 
update an existing app, select **Publish to an existing web app** and choose the name of your previous 
app from the dropdown menu.

If you choose to deploy a web app, see the [important considerations](../concepts/use-your-data.md#important-considerations) for using it.
> [!div class="nextstepaction"]
> [I ran into an issue with deploying the model.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=STUDIO&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Create-sample-app)
