---
#services: cognitive-services
manager: nitinme
author: aahill
ms.author: aahi
ms.service: azure-ai-openai
ms.topic: include
ms.date: 02/09/2024
---

## Deploy your model

Once you're satisfied with the experience in Azure OpenAI studio, you can deploy a web app directly from the 
Studio by selecting the **Deploy to** button. 

:::image type="content" source="../media/use-your-data/deploy-model.png" alt-text="A screenshot showing the model deployment button in Azure OpenAI Studio." lightbox="../media/use-your-data/deploy-model.png":::

This gives you the option to either deploy to a standalone web application, or a copilot in Copilot Studio (preview) if you're [using your own data](../concepts/use-your-data.md#deploy-to-a-copilot-preview-teams-app-preview-or-web-app) on the model. 

As an example, if you choose to deploy a web app:

The first time you deploy a web app, you should select **Create a new web app**. Choose a unique name for the app, which will 
become part of the app URL. For example, `https://<appname>.azurewebsites.net`. 

Select your subscription, resource group, location, and pricing plan for the published app. To 
update an existing app, select **Publish to an existing web app** and choose the name of your previous 
app from the dropdown menu.

After selecting deploy, you can track the progress of your ongoing deployment in the notifications menu by selecting the bell icon in the upper right of the page. Once complete, you can access your deployed application at `https://<appname>.azurewebsites.net` or by clicking the purple **Launch web app** button that will appear to the right of the **Deploy to** button.

If you choose to deploy a web app, see the [important considerations and customization options](../how-to/use-web-app.md#important-considerations) for using it. For additional instructions on how to add authentication to the deployed application, refer to this section on [configuring access to the web app](https://learn.microsoft.com/en-us/azure/ai-studio/tutorials/deploy-chat-web-app#configure-web-app-authentication). 

Full documentation and sample source code on the deployed web application can be found at [this GitHub repository](https://github.com/microsoft/sample-app-aoai-chatGPT). Provided source is given on an "as is" basis and should serve as a sample only. Customers are responsible for all customization and implementation of their web apps.
> [!div class="nextstepaction"]
> [I ran into an issue with deploying the model.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=STUDIO&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Create-sample-app)
