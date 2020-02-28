---
title: Deployment stage of the Team Data Science Process lifecycle
description: The goals, tasks, and deliverables for the deployment stage of your data-science projects
services: machine-learning
author: marktab
manager: marktab
editor: marktab
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 01/10/2020
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---
# Deployment stage of the Team Data Science Process lifecycle

This article outlines the goals, tasks, and deliverables associated with the deployment of the Team Data Science Process (TDSP). This process provides a recommended lifecycle that you can use to structure your data-science projects. The lifecycle outlines the major stages that projects typically execute, often iteratively:

   1. **Business understanding**
   2. **Data acquisition and understanding**
   3. **Modeling**
   4. **Deployment**
   5. **Customer acceptance**

Here is a visual representation of the TDSP lifecycle: 

![TDSP lifecycle](./media/lifecycle/tdsp-lifecycle2.png) 


## Goal
Deploy models with a data pipeline to a production or production-like environment for final user acceptance. 

## How to do it
The main task addressed in this stage:

**Operationalize the model**: Deploy the model and pipeline to a production or production-like environment for application consumption.

### Operationalize a model
After you have a set of models that perform well, you can operationalize them for other applications to consume. Depending on the business requirements, predictions are made either in real time or on a batch basis. To deploy models, you expose them with an open API interface. The interface enables the model to be easily consumed from various applications, such as:

   * Online websites
   * Spreadsheets 
   * Dashboards
   * Line-of-business applications 
   * Back-end applications 

For examples of model operationalization with an Azure Machine Learning web service, see [Deploy an Azure Machine Learning web service](../studio/deploy-a-machine-learning-web-service.md). It is a best practice to build telemetry and monitoring into the production model and the data pipeline that you deploy. This practice helps with subsequent system status reporting and troubleshooting.  

## Artifacts

* A status dashboard that displays the system health and key metrics
* A final modeling report with deployment details
* A final solution architecture document


## Next steps

Here are links to each step in the lifecycle of the TDSP:

   1. [Business understanding](lifecycle-business-understanding.md)
   2. [Data Acquisition and understanding](lifecycle-data.md)
   3. [Modeling](lifecycle-modeling.md)
   4. [Deployment](lifecycle-deployment.md)
   5. [Customer acceptance](lifecycle-acceptance.md)

We provide full walkthroughs that demonstrate all the steps in the process for specific scenarios. The [Example walkthroughs](walkthroughs.md) article provides a list of the scenarios with links and thumbnail descriptions. The walkthroughs illustrate how to combine cloud, on-premises tools, and services into a workflow or pipeline to create an intelligent application. 

For examples of how to execute steps in TDSPs that use Azure Machine Learning Studio, see [Use the TDSP with Azure Machine Learning](https://docs.microsoft.com/azure/machine-learning/team-data-science-process/).
