---
title: Team Data Science Process Lifecycle - Azure | Microsoft Docs
description: Steps needed to execute your data science projects.
services: machine-learning
documentationcenter: ''
author: bradsev
manager: cgronlun
editor: cgronlun

ms.assetid: b1f677bb-eef5-4acb-9b3b-8a5819fb0e78
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/02/2017
ms.author: bradsev;

---
# Team Data Science Process lifecycle

The Team Data Science Process (TDSP) provides a recommended lifecycle that you can use to structure your data science projects. The lifecycle outlines the steps, from start to finish, that projects usually follow when they are executed. If you are using another data science lifecycle, such as [CRISP-DM](https://wikipedia.org/wiki/Cross_Industry_Standard_Process_for_Data_Mining), [KDD](https://wikipedia.org/wiki/Data_mining#Process) or your organization's own custom process, you can still use the task-based TDSP with these development lifecycles. 

This lifecycle has been designed for data science projects that are intended to ship as part of intelligent applications. These applications deploy machine learning or artificial intelligence models for predictive analytics. Exploratory data science projects and ad hoc analytics projects can also benefit from using this process. But in such cases some steps described may not be needed.    

The TDSP lifecycle is composed of five major stages that are executed iteratively. These include:

* [1.Business Understanding](lifecycle-business-understanding.md)
* [2.Data Acquisition and Understanding](lifecycle-data.md)
* [3.Modeling](lifecycle-modeling.md)
* [4.Deployment](lifecycle-deployment.md)
* [5.Customer Acceptance](lifecycle-acceptance.md)

Here is a visual representation of the **Team Data Science Process lifecycle**. 

![TDSP-Lifecycle](./media/lifecycle/tdsp-lifecycle2.png) 


The Team Data Science Process lifecycle is modeled as a sequence of iterated steps that provide guidance on the tasks needed to use predictive models. These models can be deployed in a production environment to be leveraged to build intelligent applications. The goal of this process lifecycle is to continue to move a data science project forward towards a clear engagement end point. While it is true that data science is an exercise in research and discovery, being able to clearly communicate these tasks to your team and your customers using a well defined set of artifacts that employees standardized templates can help avoid misunderstanding and increase the chance of a successful completion of a complex data science project.

For each stage, we provide the following information:

* **Goals**: the specific objectives.
* **How to do it**: the specific tasks outlined and guidance provided on completing them.
* **Artifacts**: the deliverables and the support for producing them.

## Next steps
Full end-to-end walkthroughs that demonstrate all the steps in the process for **specific scenarios** are also provided. They are listed and linked with thumbnail descriptions in the [Example walkthroughs](walkthroughs.md) topic. They illustrate how to combine cloud, on-premises tools, and services into a workflow or pipeline to create an intelligent application. 

For examples executing steps in the Team Data Science Process that use Azure Machine Learning Studio, see the [With Azure ML](http://aka.ms/datascienceprocess) learning path.

