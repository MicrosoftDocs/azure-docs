---
title: Azure Cognitive Services development options
description: Learn how to use Azure Cognitive Services with different development and deployment options such as client libraries, REST APIs, Logic Apps, Power Automate, Azure Functions, Azure App Service, Azure Databricks, and many more.
services: cognitive-services
manager: nitinme
author: erhopf
ms.author: erhopf
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 10/22/2020
---

# Cognitive Services development options

This document provides a high-level overview of development and deployment options to help you get started with Azure Cognitive Services.

Azure Cognitive Services are cloud-based AI services that allow developers to build intelligence into their applications and products without deep knowledge of machine learning. With Cognitive Services, you have access to AI capabilities or models that are built, trained, and updated by Microsoft - ready to be used in your applications. In many cases, you also have the option to customize the models for your business needs. 

Cognitive Services are organized into four categories: Decision, Language, Speech, and Vision. Typically you would access these services through REST APIs, client libraries, and custom tools (like command-line interfaces) provided by Microsoft. However, this is only one path to success. Through Azure, you also have access to several development options, such as:

* Automation and integration tools like Logic Apps and Power Automate.
* Deployment options such as Azure Functions and the App Service. 
* Cognitive Services Docker containers for secure access.
* Tools like Apache Spark, Azure Databricks, Azure Synapse Analytics, and Azure Kubernetes Service for Big Data scenarios. 

Before we jump in, it's important to know that the Cognitive Services is primarily used for two distinct tasks. Based on the task you want to perform, you have different development and deployment options to choose from. 

* [Development options for prediction and analysis](#development-options-for-prediction-and-analysis)
* [Tools to customize and configure models](#tools-to-customize-and-configure-models)

## Development options for prediction and analysis 

The tools that you will use to customize and configure models are different than those that you'll use to call the Cognitive Services. Out of the box, most Cognitive Services allow you to send data and receive insights without any customization. For example: 

* You can send an image to the Computer Vision service to detect words and phrases or count the number of people in the frame
* You can send an audio file to the Speech service and get transcriptions and translate the speech to text at the same time
* You can send a PDF to the Form Recognizer service and detect tables, cells, and text inside of those cells, and you get a JSON output with coordinates and details

Azure offers a wide range of tools that are designed for different types of users, many of which can be used with Cognitive Services. Designer-driven tools are the easiest to use, and are quick to set up and automate, but may have limitations when it comes to customization. Our REST APIs and client libraries provide users with more control and flexibility, but require more effort, time, and expertise to build a solution. If you use REST APIs and client libraries, there is an expectation that you're comfortable working with modern programming languages like C#, Java, Python, JavaScript, or another popular programming language. 

Let's take a look at the different ways that you can work with the Cognitive Services.

### Client libraries and REST APIs

Cognitive Services client libraries and REST APIs provide you direct access to your service. These tools provide programmatic access to the Cognitive Services, their baseline models, and in many cases allow you to programmatically customize your models and solutions. 

* **Target user(s)**: Developers and data scientists
* **Benefits**: Provides the greatest flexibility to call the services from any language and environment. 
* **UI**: N/A - Code only
* **Subscription(s)**: Azure account + Cognitive Services resources

If you want to learn more about available client libraries and REST APIs, use our [Cognitive Services overview](index.yml) to pick and service and get started with one of our quickstarts for vision, decision, language, and speech.

### Cognitive Services for Big Data

With Cognitive Services for Big Data you can embed continuously improving, intelligent models directly into Apache Spark&trade; and SQL computations. These tools liberate developers from low-level networking details, so that they can focus on creating smart, distributed applications. Cognitive Services for Big Data supports the following platforms and connectors: Azure Databricks, Azure Synapse, Azure Kubernetes Service, and Data Connectors.

* **Target user(s)**: Data scientists and data engineers
* **Benefits**: The Azure Cognitive Services for Big Data lets users channel terabytes of data through Cognitive Services using Apache Spark&trade;. It's easy to create large-scale intelligent applications with any datastore.
* **UI**: N/A - Code only
* **Subscription(s)**: Azure account + Cognitive Services resources

If you want to learn more about Big Data for Cognitive Services, a good place to start is with the [overview](./big-data/cognitive-services-for-big-data.md). If you're ready to start building, try our [Python](./big-data/samples-python.md) or [Scala](./big-data/samples-scala.md) samples.

### Azure Functions and Azure Service Web Jobs

[Azure Functions](https://docs.microsoft.com/azure/azure-functions/) and [Azure App Service Web Jobs](https://docs.microsoft.com/azure/app-service/) both provide code-first integration services designed for developers and are built on [Azure App Services](https://docs.microsoft.com/azure/app-service/). These products provide serverless infrastructure for writing code. Within that code you can make calls to our services using our client libraries and REST APIs. 

* **Target user(s)**: Developers and data scientists
* **Benefits**: Serverless compute service that lets you run event-triggered code. 
* **UI**: Yes
* **Subscription(s)**: Azure account + Cognitive Services resource + Azure Functions subscription

### Azure Logic Apps 

[Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/) share the same workflow designer and connectors as Power Automate but provides more advanced and control including integrations with Visual Studio and DevOps. Power Automate makes it easy to integrate with your cognitive services resources through service-specific connectors that provide a proxy or wrapper around the APIs. These are the same connectors as those available in Power Automate. 

* **Target user(s)**: Developers, integrators, IT pros, DevOps
* **Benefits**: Designer-first (declarative) development model providing advanced options and integration in a low-code solution
* **UI**: Yes
* **Subscription(s)**: Azure account + Cognitive Services resource + Logic Apps deployment

### Power Automate 

Power automate is a service in the [Power Platform](https://docs.microsoft.com/power-platform/) that helps you create automated workflows between apps and services without writing code. We offer several connectors to make it easy to interact with your Cognitive Services resource in a Power Automate solution. Power Automate is built on top of Logic Apps. 

* **Target user(s)**: Business users (analysts) and Sharepoint administrators
* **Benefits**: Automate repetitive manual tasks simply by recording mouse clicks, keystrokes and copy paste steps from your desktop!
* **UI tools**: Yes - UI only
* **Subscription(s)**: Azure account + Cognitive Services resource + Power Automate Subscription + Office 365 Subscription

### AI Builder 

[AI Builder](https://docs.microsoft.com/ai-builder/overview) is a Microsoft Power Platform capability you can use to improve business performance by automating processes and predicting outcomes. AI builder brings the power of AI to your solutions through a point-and-click experience. Many cognitive services such as Form Recognizer, Text Analytics, and Computer Vision have been directly integrated here and you don't need to create your own Cognitive Services. 

* **Target user(s)**: Business users (analysts) and Sharepoint administrators
* **Benefits**: A turnkey solution that brings the power of AI through a point-and-click experience. No coding or data science skills required.
* **UI tools**: Yes - UI only
* **Subscription(s)**: AI Builder

### Continuous integration and deployment

You can use Azure DevOps and GitHub actions to manage your deployments. In the [section below](#continuous-integration-and-delivery-with-devops-and-github-actions) that discusses, we have two examples of CI/CD integrations to train and deploy custom models for Speech and the Language Understanding (LUIS) service. 

* **Target user(s)**: Developers, data scientists, and data engineers
* **Benefits**: Allows you to continuously adjust, update, and deploy applications and models programmatically. There is significant benefit when regularly using your data to improve and update models for Speech, Vision, Language, and Decision. 
* **UI tools**: N/A - Code only 
* **Subscription(s)**: Azure account + Cognitive Services resource + GitHub account

## Tools to customize and configure models

As you progress on your journey building an application or workflow with the Cognitive Services, you may find that you need to customize the model to achieve the desired performance. Many of our services allow you to build on top of the pre-built models to meet your specific business needs. For all our customizable services, we provide both a UI-driven experience for walking through the process as well as APIs for code-driven training. For example:

* You want to train a Custom Speech model to correctly recognize medical terms with a word error rate (WER) below 3%
* You want to build an image classifier with Custom Vision that can tell the difference between coniferous and deciduous trees
* You want to build a custom neural voice with your personal voice data for an improved automated customer experience

The tools that you will use to train and configure models are different than those that you'll use to call the Cognitive Services. In many cases, Cognitive Services that support customization provide portals and UI tools designed to help you train, evaluate, and deploy models. Let's quickly take a look at a few options:<br><br>

| Pillar | Service | Customization UI | Quickstart |
|--------|---------|------------------|------------|
| Vision | Custom Vision | https://www.customvision.ai/ | [Quickstart](https://docs.microsoft.com/azure/cognitive-services/Custom-Vision-Service/quickstarts/image-classification?pivots=programming-language-csharp) | 
| Vision | Form Recognizer | Sample labeling tool | [Quickstart](https://docs.microsoft.com/azure/cognitive-services/form-recognizer/quickstarts/label-tool?tabs=v2-0) |
| Decision | Content Moderator | https://contentmoderator.cognitive.microsoft.com/dashboard | [Quickstart](https://docs.microsoft.com/azure/cognitive-services/content-moderator/review-tool-user-guide/human-in-the-loop) |
| Decision | Metrics Advisor | https://metricsadvisor.azurewebsites.net/  | [Quickstart](https://docs.microsoft.com/azure/cognitive-services/metrics-advisor/quickstarts/web-portal) |
| Decision | Personalizer | UI is available in the Azure portal under your Personalizer resource. | [Quickstart](https://docs.microsoft.com/azure/cognitive-services/personalizer/quickstart-personalizer-sdk) |
| Language | Language Understanding (LUIS) | https://www.luis.ai/ | |
| Language | QnA Maker | https://www.qnamaker.ai/ | [Quickstart](https://docs.microsoft.com/azure/cognitive-services/qnamaker/quickstarts/create-publish-knowledge-base) |
| Language | Translator/Custom Translator | https://portal.customtranslator.azure.ai/ | [Quickstart](https://docs.microsoft.com/azure/cognitive-services/translator/custom-translator/quickstart-build-deploy-custom-model) |
| Speech | Custom Commands | https://speech.microsoft.com/ | [Quickstart](https://docs.microsoft.com/azure/cognitive-services/speech-service/custom-commands) |
| Speech | Custom Speech | https://speech.microsoft.com/ | [Quickstart](https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-custom-speech) |
| Speech | Custom Voice | https://speech.microsoft.com/ | [Quickstart](https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-custom-voice) |  

### Continuous integration and delivery with DevOps and GitHub Actions

Language Understanding and the Speech service offer continuous integration and continuous deployment solutions that are powered by Azure DevOps and GitHub actions. These tools are used for automated training, testing, and release management of custom models. 

* [CI/CD for Custom Speech](https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-custom-speech-continuous-integration-continuous-deployment)
* [CI/CD for LUIS](https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-devops-automation)

## On-prem containers 

Many of the Cognitive Services can be deployed in containers for on-prem access and use. Using these containers gives you the flexibility to bring Cognitive Services closer to your data for compliance, security or other operational reasons. For a complete list of Cognitive Services containers, see [On-prem containers for Cognitive Services](./cognitive-services-container-support.md).

## Next steps
<!--
* Learn more about low code development options for Cognitive Services -->
* [Create a Cognitive Services resource and start building](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account?tabs=multiservice%2Clinux)