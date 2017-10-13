---
title: Customer acceptance stage of Team Data Science Process Lifecycle - Azure | Microsoft Docs
description: The goals, tasks, and deliverables for the customer acceptance stage of your data science projects.
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
# Customer acceptance

This topic outlines the goals, tasks, and deliverables associated with the **customer acceptance stage** of the Team Data Science Process. This process provides a recommended lifecycle that you can use to structure your data science projects. The lifecycle outlines the major stages that projects typically execute, often iteratively:

* **Business Understanding**
* **Data Acquisition and Understanding**
* **Modeling**
* **Deployment**
* **Customer Acceptance**

Here is a visual representation of the **Team Data Science Process lifecycle**. 

![TDSP-Lifecycle2](./media/lifecycle/tdsp-lifecycle2.png) 


## Goal
* **Finalize the project deliverables**: confirm that the pipeline, the model, and their deployment in a production environment are satisfying customer objectives.

## How to do it
There are two main tasks addressed in this stage:

* **System validation**: confirm the deployed model and pipeline are meeting customer needs.
* **Project hand-off**: to the entity that is to run the system in production.

The customer should validate that the system meets their business needs and the answers the questions with acceptable accuracy to deploy the system to production for use by their client application. All the documentation is finalized and reviewed. A hand-off of the project to the entity responsible for operations is completed. This entity could be, for example, an IT or customer data science team or an agent of the customer that is responsible for running the system in production. 

## Artifacts
The main artifact produced in this final stage is the **Exit Report of Project for Customer**. This is the technical report containing all details of the project that useful to learn about and operate the system. An [Exit Report](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/Project/Exit%20Report.md) template is provided by TDSP that can be used as is or customized for specific client needs. 


## Next steps

Here are links to each step in the lifecycle of the Team Data Science Process:

* [1. Business Understanding](lifecycle-business-understanding.md)
* [2. Data Acquisition and Understanding](lifecycle-data.md)
* [3. Modeling](lifecycle-modeling.md)
* [4. Deployment](lifecycle-deployment.md)
* [5. Customer Acceptance](lifecycle-acceptance.md)

Full end-to-end walkthroughs that demonstrate all the steps in the process for **specific scenarios** are also provided. They are listed and linked with thumbnail descriptions in the [Example walkthroughs](walkthroughs.md) topic. They illustrate how to combine cloud, on-premises tools, and services into a workflow or pipeline to create an intelligent application. 

For examples executing steps in the Team Data Science Process that use Azure Machine Learning Studio, see the [With Azure ML](http://aka.ms/datascienceprocess) learning path.