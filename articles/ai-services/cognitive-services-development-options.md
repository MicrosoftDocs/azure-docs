---
title: Azure AI services development options
description: Learn how to use Azure AI services with different development and deployment options such as client libraries, REST APIs, Logic Apps, Power Automate, Azure Functions, Azure App Service, Azure Databricks, and many more.
services: cognitive-services
manager: nitinme
author: PatrickFarley
ms.author: pafarley
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 10/28/2021
---

# Azure AI services development options

This document provides a high-level overview of development and deployment options to help you get started with Azure AI services.

Azure AI services are cloud-based AI services that allow developers to build intelligence into their applications and products without deep knowledge of machine learning. With Azure AI services, you have access to AI capabilities or models that are built, trained, and updated by Microsoft - ready to be used in your applications. In many cases, you also have the option to customize the models for your business needs. 

Azure AI services are organized into four categories: Decision, Language, Speech, and Vision. Typically you would access these services through REST APIs, client libraries, and custom tools (like command-line interfaces) provided by Microsoft. However, this is only one path to success. Through Azure, you also have access to several development options, such as:

* Automation and integration tools like Logic Apps and Power Automate.
* Deployment options such as Azure Functions and the App Service. 
* Azure AI services Docker containers for secure access.
* Tools like Apache Spark, Azure Databricks, Azure Synapse Analytics, and Azure Kubernetes Service for big data scenarios. 

Before we jump in, it's important to know that the Azure AI services are primarily used for two distinct tasks. Based on the task you want to perform, you have different development and deployment options to choose from. 

* [Development options for prediction and analysis](#development-options-for-prediction-and-analysis)
* [Tools to customize and configure models](#tools-to-customize-and-configure-models)

## Development options for prediction and analysis 

The tools that you will use to customize and configure models are different from those that you'll use to call the Azure AI services. Out of the box, most Azure AI services allow you to send data and receive insights without any customization. For example: 

* You can send an image to the Azure AI Vision service to detect words and phrases or count the number of people in the frame
* You can send an audio file to the Speech service and get transcriptions and translate the speech to text at the same time

Azure offers a wide range of tools that are designed for different types of users, many of which can be used with Azure AI services. Designer-driven tools are the easiest to use, and are quick to set up and automate, but may have limitations when it comes to customization. Our REST APIs and client libraries provide users with more control and flexibility, but require more effort, time, and expertise to build a solution. If you use REST APIs and client libraries, there is an expectation that you're comfortable working with modern programming languages like C#, Java, Python, JavaScript, or another popular programming language. 

Let's take a look at the different ways that you can work with the Azure AI services.

### Client libraries and REST APIs

Azure AI services client libraries and REST APIs provide you direct access to your service. These tools provide programmatic access to the Azure AI services, their baseline models, and in many cases allow you to programmatically customize your models and solutions. 

* **Target user(s)**: Developers and data scientists
* **Benefits**: Provides the greatest flexibility to call the services from any language and environment. 
* **UI**: N/A - Code only
* **Subscription(s)**: Azure account + Azure AI services resources

If you want to learn more about available client libraries and REST APIs, use our [Azure AI services overview](index.yml) to pick a service and get started with one of our quickstarts for vision, decision, language, and speech.

### Azure AI services for big data

With Azure AI services for big data you can embed continuously improving, intelligent models directly into Apache Spark&trade; and SQL computations. These tools liberate developers from low-level networking details, so that they can focus on creating smart, distributed applications. Azure AI services for big data support the following platforms and connectors: Azure Databricks, Azure Synapse, Azure Kubernetes Service, and Data Connectors.

* **Target user(s)**: Data scientists and data engineers
* **Benefits**: the Azure AI services for big data let users channel terabytes of data through Azure AI services using Apache Spark&trade;. It's easy to create large-scale intelligent applications with any datastore.
* **UI**: N/A - Code only
* **Subscription(s)**: Azure account + Azure AI services resources

To learn more about big data for Azure AI services, see [Azure AI services in Azure Synapse Analytics](../synapse-analytics/machine-learning/overview-cognitive-services.md). 

### Azure Functions and Azure Service Web Jobs

[Azure Functions](../azure-functions/index.yml) and [Azure App Service Web Jobs](../app-service/index.yml) both provide code-first integration services designed for developers and are built on [Azure App Services](../app-service/index.yml). These products provide serverless infrastructure for writing code. Within that code you can make calls to our services using our client libraries and REST APIs. 

* **Target user(s)**: Developers and data scientists
* **Benefits**: Serverless compute service that lets you run event-triggered code. 
* **UI**: Yes
* **Subscription(s)**: Azure account + Azure AI services resource + Azure Functions subscription

### Azure Logic Apps 

[Azure Logic Apps](../logic-apps/index.yml) share the same workflow designer and connectors as Power Automate but provide more advanced control, including integrations with Visual Studio and DevOps. Power Automate makes it easy to integrate with your Azure AI services resources through service-specific connectors that provide a proxy or wrapper around the APIs. These are the same connectors as those available in Power Automate. 

* **Target user(s)**: Developers, integrators, IT pros, DevOps
* **Benefits**: Designer-first (declarative) development model providing advanced options and integration in a low-code solution
* **UI**: Yes
* **Subscription(s)**: Azure account + Azure AI services resource + Logic Apps deployment

### Power Automate 

Power Automate is a service in the [Power Platform](/power-platform/) that helps you create automated workflows between apps and services without writing code. We offer several connectors to make it easy to interact with your Azure AI services resource in a Power Automate solution. Power Automate is built on top of Logic Apps. 

* **Target user(s)**: Business users (analysts) and SharePoint administrators
* **Benefits**: Automate repetitive manual tasks simply by recording mouse clicks, keystrokes and copy paste steps from your desktop!
* **UI tools**: Yes - UI only
* **Subscription(s)**: Azure account + Azure AI services resource + Power Automate Subscription + Office 365 Subscription

### AI Builder 

[AI Builder](/ai-builder/overview) is a Microsoft Power Platform capability you can use to improve business performance by automating processes and predicting outcomes. AI Builder brings the power of AI to your solutions through a point-and-click experience. Many Azure AI services such as the Language service, and Azure AI Vision have been directly integrated here and you don't need to create your own Azure AI services. 

* **Target user(s)**: Business users (analysts) and SharePoint administrators
* **Benefits**: A turnkey solution that brings the power of AI through a point-and-click experience. No coding or data science skills required.
* **UI tools**: Yes - UI only
* **Subscription(s)**: AI Builder

### Continuous integration and deployment

You can use Azure DevOps and GitHub Actions to manage your deployments. In the [section below](#continuous-integration-and-delivery-with-devops-and-github-actions), we have two examples of CI/CD integrations to train and deploy custom models for Speech and the Language Understanding (LUIS) service. 

* **Target user(s)**: Developers, data scientists, and data engineers
* **Benefits**: Allows you to continuously adjust, update, and deploy applications and models programmatically. There is significant benefit when regularly using your data to improve and update models for Speech, Vision, Language, and Decision. 
* **UI tools**: N/A - Code only 
* **Subscription(s)**: Azure account + Azure AI services resource + GitHub account

## Tools to customize and configure models

As you progress on your journey building an application or workflow with the Azure AI services, you may find that you need to customize the model to achieve the desired performance. Many of our services allow you to build on top of the pre-built models to meet your specific business needs. For all our customizable services, we provide both a UI-driven experience for walking through the process as well as APIs for code-driven training. For example:

* You want to train a Custom Speech model to correctly recognize medical terms with a word error rate (WER) below 3 percent
* You want to build an image classifier with Custom Vision that can tell the difference between coniferous and deciduous trees
* You want to build a custom neural voice with your personal voice data for an improved automated customer experience

The tools that you will use to train and configure models are different from those that you'll use to call the Azure AI services. In many cases, Azure AI services that support customization provide portals and UI tools designed to help you train, evaluate, and deploy models. Let's quickly take a look at a few options:<br><br>

| Pillar | Service | Customization UI | Quickstart |
|--------|---------|------------------|------------|
| Vision | Custom Vision | https://www.customvision.ai/ | [Quickstart](./custom-vision-service/quickstarts/image-classification.md?pivots=programming-language-csharp) | 
| Decision | Personalizer | UI is available in the Azure portal under your Personalizer resource. | [Quickstart](./personalizer/quickstart-personalizer-sdk.md) |
| Language | Language Understanding (LUIS) | https://www.luis.ai/ | |
| Language | QnA Maker | https://www.qnamaker.ai/ | [Quickstart](./qnamaker/quickstarts/create-publish-knowledge-base.md) |
| Language | Translator/Custom Translator | https://portal.customtranslator.azure.ai/ | [Quickstart](./translator/custom-translator/quickstart.md) |
| Speech | Custom Commands | https://speech.microsoft.com/ | [Quickstart](./speech-service/custom-commands.md) |
| Speech | Custom Speech | https://speech.microsoft.com/ | [Quickstart](./speech-service/custom-speech-overview.md) |
| Speech | Custom Voice | https://speech.microsoft.com/ | [Quickstart](./speech-service/how-to-custom-voice.md) |  

### Continuous integration and delivery with DevOps and GitHub Actions

Language Understanding and the Speech service offer continuous integration and continuous deployment solutions that are powered by Azure DevOps and GitHub Actions. These tools are used for automated training, testing, and release management of custom models. 

* [CI/CD for Custom Speech](./speech-service/how-to-custom-speech-continuous-integration-continuous-deployment.md)
* [CI/CD for LUIS](./luis/luis-concept-devops-automation.md)

## On-premises containers 

Many of the Azure AI services can be deployed in containers for on-premises access and use. Using these containers gives you the flexibility to bring Azure AI services closer to your data for compliance, security, or other operational reasons. For a complete list of Azure AI containers, see [On-premises containers for Azure AI services](./cognitive-services-container-support.md).

## Next steps

* [Create a multi-service resource and start building](./multi-service-resource.md?pivots=azportal)
