---
title: Azure AI services and the AI ecosystem
titleSuffix: Azure AI services
description: Learn about when to use Azure AI services.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: eur
---

# Azure AI services and the AI ecosystem

[Azure AI services](what-are-ai-services.md) provides capabilities to solve general problems such as analyzing text for emotional sentiment or analyzing images to recognize objects or faces. You don't need special machine learning or data science knowledge to use these services.

## Azure Machine Learning

Azure AI services and Azure Machine Learning both have the end-goal of applying artificial intelligence (AI) to enhance business operations, though how each provides this in the respective offerings is different. 

Generally, the audiences are different:

* Azure AI services are for developers without machine-learning experience.
* Azure Machine Learning is tailored for data scientists.


## Azure AI services for big data

With Azure AI services for big data you can embed continuously improving, intelligent models directly into Apache Spark&trade; and SQL computations. These tools liberate developers from low-level networking details, so that they can focus on creating smart, distributed applications. Azure AI services for big data support the following platforms and connectors: Azure Databricks, Azure Synapse, Azure Kubernetes Service, and Data Connectors.

* **Target user(s)**: Data scientists and data engineers
* **Benefits**: the Azure AI services for big data let users channel terabytes of data through Azure AI services using Apache Spark&trade;. It's easy to create large-scale intelligent applications with any datastore.
* **UI**: N/A - Code only
* **Subscription(s)**: Azure account + Azure AI services resources

To learn more about big data for Azure AI services, see [Azure AI services in Azure Synapse Analytics](../synapse-analytics/machine-learning/overview-cognitive-services.md). 

## Azure Functions and Azure Service Web Jobs

[Azure Functions](../azure-functions/index.yml) and [Azure App Service Web Jobs](../app-service/index.yml) both provide code-first integration services designed for developers and are built on [Azure App Services](../app-service/index.yml). These products provide serverless infrastructure for writing code. Within that code you can make calls to our services using our client libraries and REST APIs. 

* **Target user(s)**: Developers and data scientists
* **Benefits**: Serverless compute service that lets you run event-triggered code. 
* **UI**: Yes
* **Subscription(s)**: Azure account + Azure AI services resource + Azure Functions subscription

## Azure Logic Apps 

[Azure Logic Apps](../logic-apps/index.yml) share the same workflow designer and connectors as Power Automate but provide more advanced control, including integrations with Visual Studio and DevOps. Power Automate makes it easy to integrate with your Azure AI services resources through service-specific connectors that provide a proxy or wrapper around the APIs. These are the same connectors as those available in Power Automate. 

* **Target user(s)**: Developers, integrators, IT pros, DevOps
* **Benefits**: Designer-first (declarative) development model providing advanced options and integration in a low-code solution
* **UI**: Yes
* **Subscription(s)**: Azure account + Azure AI services resource + Logic Apps deployment

## Power Automate 

Power Automate is a service in the [Power Platform](/power-platform/) that helps you create automated workflows between apps and services without writing code. We offer several connectors to make it easy to interact with your Azure AI services resource in a Power Automate solution. Power Automate is built on top of Logic Apps. 

* **Target user(s)**: Business users (analysts) and SharePoint administrators
* **Benefits**: Automate repetitive manual tasks simply by recording mouse clicks, keystrokes and copy paste steps from your desktop!
* **UI tools**: Yes - UI only
* **Subscription(s)**: Azure account + Azure AI services resource + Power Automate Subscription + Office 365 Subscription

## AI Builder 

[AI Builder](/ai-builder/overview) is a Microsoft Power Platform capability you can use to improve business performance by automating processes and predicting outcomes. AI Builder brings the power of AI to your solutions through a point-and-click experience. Many Azure AI services such as the Language service, and Azure AI Vision have been directly integrated here and you don't need to create your own Azure AI services. 

* **Target user(s)**: Business users (analysts) and SharePoint administrators
* **Benefits**: A turnkey solution that brings the power of AI through a point-and-click experience. No coding or data science skills required.
* **UI tools**: Yes - UI only
* **Subscription(s)**: AI Builder


## Next steps

* Learn how you can build generative AI applications in the [Azure AI Studio](../ai-studio/what-is-ai-studio.md).
* Get answers to frequently asked questions in the [Azure AI FAQ article](../ai-studio/faq.yml)
* Create your Azure AI services resource in the [Azure portal](multi-service-resource.md?pivots=azportal) or with [Azure CLI](multi-service-resource.md?pivots=azcli).
* Keep up to date with [service updates](https://azure.microsoft.com/updates/?product=cognitive-services).
