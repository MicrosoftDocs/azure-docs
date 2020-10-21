---
title: Cognitive Services development options
titleSuffix: Azure Cognitive Services
description: 
services: cognitive-services
manager: nitinme
author: erhopf
ms.author: erhopf
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 10/21/2020
---

# Cognitive Services development options

The Azure Cognitive Services are cloud-based AI services that allow developers to build intelligence into their applications and products without deep knowledge of Machine Learning. With the Cognitive Services, you have access to  out-of-the-box, ready to use AI capabilities or models that are built, trained, and updated by Microsoft. In many cases, you also have the option to customize the models for your business needs. The Cognitive Services are organized into 4 categories: Decision, Language, Speech, and Vision. A common path to access these services is through REST APIs, client libraries, and custom tools (like command line interfaces) provided by Microsoft. However, this is only one path to success. As part of Azure, you have access to automation and integration tools  like Logic Apps and Power Automate, deployment options such as Azure Functions and the App Service, opportunities to containerize Cognitive Services for secure access in private clouds, and finally leveraging tools like Apache Spark, Azure Databricks, Azure Synapse Analytics and Azure Kubernetes Service for Big Data scenarios . In this document, we provide a high-level overview of development and deployment options to help you get started with Cognitive Services.  

## Using the Cognitive Services 

Before we jump in, it's important to know that the Cognitive Services are primarily used for two distinct tasks: 

* Prediction or analyzing content 
* Customization and configuration of models

The tools that you will use to customize and configure models are different than those that you'll use to call the Cognitive Services. Out of the box, most Cognitive Services allow you to send data and receive insights without any customization. For example: 

* You can send an image to the Computer Vision service to detect words and phrases or count the number of people in the frame
* You can send an audio file to the Speech service and get transcriptions and translate the speech to text at the same time
* You can send a PDF to the Form Recognizer service and detect tables, cells, and text inside of those cells, and you get a JSON output with coordinates and details

Azure offers a wide range of tools that are designed for different types of users, many of which can be used with Cognitive Services. Designer-driven tools are the easiest to use, and are quick to set up and automate, but may have limitations when it comes to customization. Whereas, our REST APIs and client libraries provide users with more control and flexibility, but require more effort, time, and expertise to build a solution. If you choose to use REST APIs and client libraries, there is a presumption that you're comfortable working with modern programming languages like C#, Java, Python, and JavaScript.

| | Client libraries and REST | Big Data | Continuous integration w/ DevOps | Functions and Web Jobs | Logic Apps | Power Automate | AI Builder |
|-|---------------------------|----------|----------------------------------|------------------------|------------|----------------|------------|
| **Target User** | Developers and data scientists | Data scientists, Data Engineers, Integrators | Developers, data scientists, and data engineers | Developers and data scientists | Integrators, developers, and IT pros | Business users, SharePoint administrators | Business users, SharePoint administrators. |
| Benefits | Provides the greatest flexibility to call the services from any language and environment  | The Azure Cognitive Services for Big Data lets users channel terabytes of data through Cognitive Services using Apache Spark&trade;. It's easy to create large-scale intelligent applications with any datastore. | Allows you to continuously adjust, update, and deploy applications and models programmatically.<br><br>There is significant benefit when regularly using your data to improve and update models for Speech, Vision, Language, and Decision.  | Serverless compute service that lets you run event-triggered code. <br><br>**Note:** WebJobs require and App Service | Designer-first (declarative) development model providing advanced options and integration in a low-code solution | Automate repetitive manual tasks simply by recording mouse clicks, keystrokes and copy paste steps from your desktop! | A turnkey solution that brings the power of AI through a point-and-click experience.<br><br>No coding or data science skills required. | 
| UI tools | N/A | N/A | N/A | UI + code | UI + code | UI | UI | 
| Subscription(s) | Azure Cognitive Services Resource | Azure Cognitive Services Resource  | Azure Cognitive Services Resource + Github account | | Azure Cognitive Services Resource + Azure Functions Subscription | Azure Cognitive Services Resource + Logic Apps Deployment | Azure Cognitive Services Resource + Power Automate Subscription + Office 365 Subscription | AI Builder Subscription |
| Scenarios | You need to integrate one of the Cognitive Services into an existing code base.<br><br>You're comfortable building and deploying applications and want full flexibility for how Cognitive Services are integrated into your applications and products. | You need to build an image classification model that uses deep neural networks at scale on Apache Spark.<br><br>See an example of how this was done with the Snow Leopard Trust. have a large quantity of data in a blob or a database that needs to be processed with the cognitive services. | You need to build an application that classifies different types of flowers. You have an initial dataset, but photographers in the fields will continue to add new content to your database.<br><br>You can use CI/CD to update your model with new images and improve its classification performance. | You need to transcribe audio files and then translate them at a regular cadence. The trigger or event is when new audio is added to a storage account. | | | | 


### Client libraries and REST APIs

Cognitive Services client libraries and REST APIs provide you direct access to your service. These tools provide programmatic access to the Cognitive Services, their baseline models, and in many cases allow you to programmatically customize your models and solutions. 

### Cognitive Services for Big Data

With Cognitive Services for Big Data you can embed continuously improving, intelligent models directly into Apache Spark&trade; and SQL computations. These tools liberate developers from low-level networking details, so that they can focus on creating smart, distributed applications. Cognitive Services for Big Data supports the following platforms and connectors: Azure Databricks, Azure Synapse, Azure Kubernetes Service, and Data Connectors.

### Azure Functions and Azure Service Web Jobs

[Azure Functions](https://azure.microsoft.com/services/functions/) and [Azure App Service Web Jobs](https://docs.microsoft.com/azure/app-service/webjobs-create) both provide code-first integration services designed for developers and are built on [Azure App Services](https://docs.microsoft.com/azure/app-service/webjobs-create). These products provide serverless infrastructure for writing code. Within that code you can make calls to our services using our client libraries and REST APIs. 

### Logic Apps 

Logic apps shares the same workflow designer and connectors as Power Automate but provides more advanced and control including integrations with Visual Studio and DevOps. Power Automate makes it easy to integrate with your cognitive services resources through service-specific connectors that provide a proxy or wrapper around the APIs. These are the same connectors as those available in Power Automate. 

### Power Automate 

Power automate is a service in [the Power Platform](https://docs.microsoft.com/learn/powerplatform/) that helps you create automated workflows between apps and services without writing code. We offer several connectors to make it easy to interact with your Cognitive Services resource in a Power Automate solution. Power Automate is built on top of Logic Apps. 

### AI Builder 

[AI Builder](https://docs.microsoft.com/ai-builder/overview) is a Microsoft Power Platform capability you can use to improve business performance by automating processes and predicting outcomes. AI builder brings the power of AI to your solutions through a point-and-click experience. Many cognitive services such as Form Recognizer, Text Analytics and Computer Vision have been directly integrated here and you don't need to create your own Cognitive Services. 

### Continuous integration and deployment

You can use Azure DevOps and GitHub actions to manage your deployments. In the [section below](#) that discusses, we have two examples of CI/CD integrations to train and deploy custom models for Speech and the Language Understanding (LUIS) service. 

## Customization with Cognitive Services

As you progress on your journey building an application or workflow with the Cognitive Services, you may find that you need to customize the model to achieve the desired performance. Many of our services allow you to build on top of the pre-built models to meet your specific business needs. For all our customizable services we provide both a UI-driven experience for walking through the process as well as APIs for code-driven training. For example:

* You want to train a Custom Speech model to correctly recognizer medical terms with a word error rate (WER) below 3%
* You want to build an image classifier with Custom Vision that can tell the difference between coniferous and deciduous trees
* You want build a custom neural voice with your personal voice data for an improved automated customer experience

The tools that you will use to train and configure models are different than those that you'll use to call the Cognitive Services. In many cases, Cognitive Services that support customization provide portals and UI tools designed to help you train, evaluate, and deploy models. Let's quickly take a look at a few options:

<table>
<thead>
<tr class="header">
<th><strong>Pillar</strong></th>
<th><strong>Customizable Service</strong></th>
<th><strong>Customization in no-code Product</strong></th>
<th><strong>Customization via UI</strong></th>
<th><strong>Tutorial for customization via UI</strong></th>
<th><strong>Tutorial for customization via code</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Vision</td>
<td>Custom vision</td>
<td><a href="https://docs.microsoft.com/ai-builder/object-detection-overview">AI Builder</a></td>
<td><a href="https://www.customvision.ai/">https://www.customvision.ai/</a></td>
<td></td>
<td><a href="https://docs.microsoft.com/azure/cognitive-services/Custom-Vision-Service/quickstarts/image-classification?pivots=programming-language-csharp">Quickstart</a></td>
</tr>
<tr class="even">
<td></td>
<td>Form Recognizer</td>
<td><a href="https://docs.microsoft.com/ai-builder/form-processing-model-overview">AI Builder</a></td>
<td>Tool must be set up yourself. <a href="https://docs.microsoft.com/azure/cognitive-services/form-recognizer/quickstarts/label-tool?tabs=v2-0">Quickstart</a></td>
<td></td>
<td></td>
</tr>
<tr class="odd">
<td>Speech</td>
<td>Custom Speech</td>
<td>N/A</td>
<td><a href="https://speech.microsoft.com/">https://speech.microsoft.com/</a></td>
<td></td>
<td></td>
</tr>
<tr class="even">
<td></td>
<td>Custom Voice</td>
<td>N/A</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="odd">
<td></td>
<td>Custom keyword</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="even">
<td></td>
<td>Custom Commands</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="odd">
<td>Language</td>
<td>Language Understanding (LUIS)</td>
<td><a href="https://powervirtualagents.microsoft.com/">Power Virtual Agents</a></td>
<td><a href="https://www.luis.ai/">https://www.luis.ai/</a></td>
<td></td>
<td><a href="https://docs.microsoft.com/azure/cognitive-services/luis/azure-sdk-quickstart?pivots=programming-language-csharp">Quickstart</a></td>
</tr>
<tr class="even">
<td></td>
<td>QnA Maker</td>
<td></td>
<td><a href="https://www.qnamaker.ai/">https://www.qnamaker.ai/</a></td>
<td></td>
<td><a href="https://docs.microsoft.com/azure/cognitive-services/qnamaker/quickstarts/quickstart-sdk?tabs=visual-studio&amp;pivots=programming-language-csharp">Quickstart</a></td>
</tr>
<tr class="odd">
<td></td>
<td>Custom Translator</td>
<td>N/A</td>
<td><a href="https://portal.customtranslator.azure.ai/">https://portal.customtranslator.azure.ai/</a></td>
<td></td>
<td></td>
</tr>
<tr class="even">
<td>Decision</td>
<td>Personalizer</td>
<td>N/A</td>
<td><em>Built into Ibiza portal</em></td>
<td></td>
<td></td>
</tr>
<tr class="odd">
<td></td>
<td>Metrics Advisor</td>
<td>N/A</td>
<td><a href="https://metricsadvisor.azurewebsites.net/">https://metricsadvisor.azurewebsites.net/</a></td>
<td></td>
<td></td>
</tr>
<tr class="even">
<td></td>
<td>Content Moderator</td>
<td>N/A</td>
<td><a href="https://contentmoderator.cognitive.microsoft.com/dashboard">https://contentmoderator.cognitive.microsoft.com/dashboard</a></td>
<td></td>
<td><a href="https://docs.microsoft.com/azure/cognitive-services/content-moderator/client-libraries?pivots=programming-language-csharp">Quickstart</a></td>
</tr>
</tbody>
</table>

### Continuous integration and delivery with DevOps and GitHub Actions

Language Understanding and the Speech service offer continuous integration and continuous deployment solutions that are powered by Azure DevOps and GitHub actions. These tools are used for automated training, testing, and release management of custom models. 

* [CI/CD for Custom Speech](https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-custom-speech-continuous-integration-continuous-deployment)
* [CI/CD for LUIS](https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-devops-automation)

## Next steps

* Learn more about low code development options for Cognitive Services
* [Learn more about Big Data for Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/big-data/cognitive-services-for-big-data)
