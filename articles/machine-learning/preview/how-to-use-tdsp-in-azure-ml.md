---
title: How to structure projects in Azure ML with Team Data Science Process templates  | Microsoft Docs
description: How to instantiate Team Data Science Process (TDSP) templates in Azure ML that structure projects for collaboration.
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
ms.date: 09/10/2017
ms.author: bradsev

---

# How to structure projects in Azure Machine Learning Workbench with Team Data Science Process templates

This document provides instructions on how to create a data science projects in Azure Machine Learning Workbench with Team Data Science Process (TDSP) templates that structure projects for collaboration and reproducibility. 


## What is Team Data Science Process?

The Team Data Science Process is an agile, iterative, data science process for executing and delivering advanced analytics solutions. It is designed to improve the collaboration and efficiency of data science teams in enterprise organizations. It supports these objectives with four key components:

1. A standard [data science lifecycle](../team-data-science-process/lifecycle.md) definition.
2. A standardized project structure [project documentation and reporting templates](https://github.com/Azure/Azure-TDSP-ProjectTemplate)
3. Infrastructure and resources for project execution, such as compute and storage infrastructure, and code repositories.
4. [Tools and utilities](https://github.com/Azure/Azure-TDSP-Utilities) for data science project tasks, such as collaborative version control and code review, data exploration and modeling, and work planning.

For a more complete discussion of the TDSP, see the [Team Data Science Process overview](../team-data-science-process/overview.md).

## Why should you use TDSP structure and templates?

Standardization of the structure, lifecycle, and documentation of data science projects is key to facilitating effective collaboration on data science teams. Creating Azure Machine Learning Workbench projects with the TDSP template provides a framework for coordinated teamwork.

We had previously released a [GitHub repository for the TDSP project structure and templates](https://github.com/Azure/Azure-TDSP-ProjectTemplate) to help achieve these objectives. But it was not possible, until now, to instantiate the TDSP structure and templates within a data science tool. It is now possible to create an Azure Machine Learning Workbench project that is instantiated with TDSP structure and documentation templates by using the following procedure. 


## Instantiate TDSP structure and templates from the Azure Machine Learning template gallery

To create a new project with the Team Data Science Process structure and documentation templates, complete the following procedures. 

### Start a new project

Open Azure Machine Learning Workbench. Under **Projects** on top left, click on **+** and select **New Project** to create a new project.

![Start creation of new project](./media/how-to-use-tdsp-in-azure-ml/instantiation-1.png) 


### Create a new TDSP-structured project


Specify the parameters and information in the relevant boxes:

- Project name
- Project directory
- Project description
- Git repository 
- Workspace

Then in the **Search** box, type in *TDSP*. When the **TDSP Template** shows up, click on it to select that template. Then click the **Create** button to create your new project with the TDSP structure.

![Fill in project information](./media/how-to-use-tdsp-in-azure-ml/instantiation-2.png) 


## Examine the TDSP project structure

After your new project is created, you can examine its structure. It contains all of the aspects of standardized documentation for business understanding, the stages of the TDSP lifecycle, data location, definition, and architecture in this documentation template. This structure is derived from the TDSP structure published [here](https://github.com/Azure/Azure-TDSP-ProjectTemplate), with some simplifications. For example, several of the document templates are merged into one markdown, namely, [ProjectReport](https://github.com/amlsamples/tdsp/blob/master/ProjectReport.md). 

![Fill in project information](./media/how-to-use-tdsp-in-azure-ml/instantiation-3.png) 


## Use the TDSP structure and templates

The template is not populated with any code in the **Code** folder or its sub-folders. You are expected to populate the these folders with the code files that are necessary for executing your project. The [ProjectReport](https://github.com/amlsamples/tdsp/blob/master/ProjectReport.md) file is a template that should be directly modified with information relevant to your project. It comes with a set of questions that help you fill out the information for each of the four stages of the [Team Data Science Process lifecycle](../team-data-science-process/lifecycle.md).

## Document your project

Refer to [TDSP documentation templates](https://github.com/Azure/Azure-TDSP-ProjectTemplate) for help documenting your project. In the current Azure Machine Learning Workbench TDSP documentation template, we recommend that you include all the information in the [ProjectReport](https://github.com/amlsamples/tdsp/blob/master/ProjectReport.md) file. This template should be filled out with information that is specific to your project. 

We also provide another [ProjectLearnings](https://github.com/amlsamples/tdsp/blob/master/Docs/ProjectLearnings.md) template to include any information not be included in the primary project document, but that is still useful to document. 


## Next steps

To facilitate your understanding on how the TDSP structure and templates can be used in Azure Machine Learning Workbench projects, we provide several worked-out project examples:

- For a tutorial showing how create a TDSP project in Azure Machine Learning Workbench, see [Team Data Science Process Tutorial: Classify UCI incomes in Azure Machine Learning Workbench](tutorial-classifying-uci-incomes.md) 
- For a quickstart sample that uses a TDSP-instantiated project in Azure Machine Learning Workbench, see [Bio-medical entity recognition using Natural Language Processing with Deep Learning](sample-tdsp-nlp.md)

