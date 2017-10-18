---
title: Deployment stage of Team Data Science Process Lifecycle - Azure | Microsoft Docs
description: The goals, tasks, and deliverables for the deployment stage of your data science projects.
services: machine-learning
documentationcenter: ''
author: bradsev
manager: cgronlun
editor: cgronlun

ms.assetid: 
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/02/2017
ms.author: bradsev;

---
# Deployment

This topic outlines the goals, tasks, and deliverables associated with the **deployment** of the Team Data Science Process. This process provides a recommended lifecycle that you can use to structure your data science projects. The lifecycle outlines the major stages that projects typically execute, often iteratively:

* **Business Understanding**
* **Data Acquisition and Understanding**
* **Modeling**
* **Deployment**
* **Customer Acceptance**

Here is a visual representation of the **Team Data Science Process lifecycle**. 

![TDSP-Lifecycle2](./media/lifecycle/tdsp-lifecycle2.png) 


## Goal
* Models with a data pipeline are deployed to a production or production-like environment for final user acceptance. 

## How to do it
The main task addressed in this stage:

* **Operationalize the model**: Deploy the model and pipeline to a production or production-like environment for application consumption.

### 4.1 Operationalize a model
Once you have a set of models that perform well, they can be operationalized for other applications to consume. Depending on the business requirements, predictions are made either in real-time or on a batch basis. Models are deployed by exposing them with an open API interface. The interface allows the model to be easily consumed from various applications such as online websites, spreadsheets, dashboards, or line of business and backend applications. For examples of model operationalization with an Azure Machine Learning web service, see [Deploy an Azure Machine Learning web service](../studio/publish-a-machine-learning-web-service.md). It is also a best practice to build telemetry and monitoring into the production model and the data pipeline that are deployed. This practice helps with subsequent system status reporting and troubleshooting.  

## Artifacts
* Status dashboard of system health and key metrics.
* Final modeling report with deployment details.
* Final solution architecture document.


## Next steps

Here are links to each step in the lifecycle of the Team Data Science Process:

* [1. Business Understanding](lifecycle-business-understanding.md)
* [2. Data Acquisition and Understanding](lifecycle-data.md)
* [3. Modeling](lifecycle-modeling.md)
* [4. Deployment](lifecycle-deployment.md)
* [5. Customer Acceptance](lifecycle-acceptance.md)

Full end-to-end walkthroughs that demonstrate all the steps in the process for **specific scenarios** are also provided. They are listed and linked with thumbnail descriptions in the [Example walkthroughs](walkthroughs.md) topic. They illustrate how to combine cloud, on-premises tools, and services into a workflow or pipeline to create an intelligent application. 

For examples executing steps in the Team Data Science Process that use Azure Machine Learning Studio, see the [With Azure ML](http://aka.ms/datascienceprocess) learning path.