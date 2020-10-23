---
title: The Team Data Science Process lifecycle
description: The Team Data Science Process (TDSP) provides a recommended lifecycle that you can use to structure your data-science projects. 
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
# The Team Data Science Process lifecycle

The Team Data Science Process (TDSP) provides a recommended lifecycle that you can use to structure your data-science projects. The lifecycle outlines the complete steps that successful projects follow. If you use another data-science lifecycle, such as the Cross Industry Standard Process for Data Mining [(CRISP-DM)](https://wikipedia.org/wiki/Cross_Industry_Standard_Process_for_Data_Mining), Knowledge Discovery in Databases [(KDD)](https://wikipedia.org/wiki/Data_mining#Process), or your organization's own custom process, you can still use the task-based TDSP. 

This lifecycle is designed for data-science projects that are intended to ship as part of intelligent applications. These applications deploy machine learning or artificial intelligence models for predictive analytics. Exploratory data-science projects and improvised analytics projects can also benefit from the use of this process. But for those projects, some of the steps described here might not be needed. 

## Five lifecycle stages

The TDSP lifecycle is composed of five major stages that are executed iteratively. These stages include:

   1. [Business understanding](lifecycle-business-understanding.md)
   2. [Data acquisition and understanding](lifecycle-data.md)
   3. [Modeling](lifecycle-modeling.md)
   4. [Deployment](lifecycle-deployment.md)
   5. [Customer acceptance](lifecycle-acceptance.md)

Here is a visual representation of the TDSP lifecycle: 

![TDSP lifecycle](./media/lifecycle/tdsp-lifecycle2.png) 


The TDSP lifecycle is modeled as a sequence of iterated steps that provide guidance on the tasks needed to use predictive models. You deploy the predictive models in the production environment that you plan to use to build the intelligent applications. The goal of this process lifecycle is to continue to move a data-science project toward a clear engagement end point. Data science is an exercise in research and discovery. The ability to communicate tasks to your team and your customers by using a well-defined set of artifacts that employ standardized templates helps to avoid misunderstandings. Using these templates also increases the chance of the successful completion of a complex data-science project.

For each stage, we provide the following information:

   * **Goals**: The specific objectives.
   * **How to do it**: An outline of the specific tasks and guidance on how to complete them.
   * **Artifacts**: The deliverables and the support to produce them.

## Next steps

We provide full end-to-end walkthroughs that demonstrate all the steps in the process for specific scenarios. The [Example walkthroughs](walkthroughs.md) article provides a list of the scenarios with links and thumbnail descriptions. The walkthroughs illustrate how to combine cloud, on-premises tools, and services into a workflow or pipeline to create an intelligent application. 

For examples of how to execute steps in TDSPs that use Azure Machine Learning Studio, see [Use the TDSP with Azure Machine Learning](https://docs.microsoft.com/azure/machine-learning/team-data-science-process/).
