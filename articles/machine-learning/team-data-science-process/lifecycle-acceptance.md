---
title: Customer acceptance stage of the Team Data Science Process lifecycle
description: The goals, tasks, and deliverables for the customer acceptance stage of your data-science projects
services: machine-learning
author: marktab
manager: cgronlun
editor: cgronlun
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 11/04/2017
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---
# Customer acceptance stage of the Team Data Science Process lifecycle

This article outlines the goals, tasks, and deliverables associated with the customer acceptance stage of the Team Data Science Process (TDSP). This process provides a recommended lifecycle that you can use to structure your data-science projects. The lifecycle outlines the major stages that projects typically execute, often iteratively:

   1. **Business understanding**
   2. **Data acquisition and understanding**
   3. **Modeling**
   4. **Deployment**
   5. **Customer acceptance**

Here is a visual representation of the TDSP lifecycle: 

![TDSP lifecycle](./media/lifecycle/tdsp-lifecycle2.png) 


## Goal
**Finalize the project deliverables**: Confirm that the pipeline, the model, and their deployment in a production environment satisfy the customer's objectives.

## How to do it
There are two main tasks addressed in this stage:

   * **System validation**: Confirm that the deployed model and pipeline meet the customer's needs.
   * **Project hand-off**: Hand the project off to the entity that's going to run the system in production.

The customer should validate that the system meets their business needs and that it answers the questions with acceptable accuracy to deploy the system to production for use by their client's application. All the documentation is finalized and reviewed. The project is handed-off to the entity responsible for operations. This entity might be, for example, an IT or customer data-science team or an agent of the customer that's responsible for running the system in production. 

## Artifacts
The main artifact produced in this final stage is the **Exit report of the project for the customer**. This technical report contains all the details of the project that are useful for learning about how to operate the system. TDSP provides an [Exit report](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/Project/Exit%20Report.md) template. You can use the template as is, or you can customize it for specific client needs. 


## Next steps

Here are links to each step in the lifecycle of the TDSP:

   1. [Business understanding](lifecycle-business-understanding.md)
   2. [Data acquisition and understanding](lifecycle-data.md)
   3. [Modeling](lifecycle-modeling.md)
   4. [Deployment](lifecycle-deployment.md)
   5. [Customer acceptance](lifecycle-acceptance.md)

We provide full end-to-end walkthroughs that demonstrate all the steps in the process for specific scenarios. The [Example walkthroughs](walkthroughs.md) article provides a list of the scenarios with links and thumbnail descriptions. The walkthroughs illustrate how to combine cloud, on-premises tools, and services into a workflow or pipeline to create an intelligent application. 

For examples of how to execute steps in TDSPs that use Azure Machine Learning Studio, see [Use the TDSP with Azure Machine Learning](https://docs.microsoft.com/azure/machine-learning/team-data-science-process/).
