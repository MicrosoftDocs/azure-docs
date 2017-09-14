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

# How to structure projects in Azure Machine Learning Workbench with Team Data Science Process (TDSP) templates

This document provides instructions on how to create a data science projects in Azure Machine Learning Workbench with Team Data Science Process (TDSP) templates that structure projects for collaboration and reproducibility. 


## What is Team Data Science Process?

The Team Data Science Process is an agile, iterative, data science process for executing and delivering advanced analytics solutions. It is designed to improve the collaboration and efficiency of data science teams in enterprise organizations. It supports these objectives with four key components:

1. A standard [data science lifecycle](https://github.com/Azure/Microsoft-TDSP/blob/master/Docs/lifecycle-detail.md) definition.
2. A standardized project structure [project documentation and reporting templates](https://github.com/Azure/Azure-TDSP-ProjectTemplate)
3. Infrastructure and resources for project execution, such as compute and storage infrastructure, and code repositories.
4. [Tools and utilities](https://github.com/Azure/Azure-TDSP-Utilities) for data science project tasks, such as collaborative version control and code review, data exploration and modeling, and work planning.

For a more complete discussion of the TDSP, see the [Team Data Science Process overview](https://github.com/Azure/Microsoft-TDSP/blob/master/Docs/README.md).

## Why should you use TDSP structure and templates?

Standardization of the structure, lifecycle, and documentation of data science projects is key to facilitating effective collaboration on data science teams. Creating Azure Machine Learning Workbench projects with the TDSP template provides a framework for coordinated teamwork.

We had previously released a [GitHub repository for the TDSP project structure and templates](https://github.com/Azure/Azure-TDSP-ProjectTemplate) to help achieve these objectives. But it was not possible, until now, to instantiate the TDSP structure and templates within a data science tool. It is now possible to create an Azure Machine Learning Workbench project that is instantiated with TDSP structure and documentation templates by using the following procedure: 

## Things to remember *before* creating a new project
These are the things you should keep in mind *before* creating a new project:
* Project and its contents are required to be less 25 Mb in size. This includes all docs (primarily markdowns), code, and sample_data. The project is intended to have small files to facilitate execution and version control in Azure ML Workbench. 
* The Sample\_Data folder is only for small data files (less than 5 Mb) with which you can test your code or do early development.
* Storing files such as Office Word, PowerPoint etc. can increase the size of Docs folder substantially. Find a [SharePoint](https://products.office.com/en-us/sharepoint/collaboration), or other collaborative resource to store such files.
* For handling large files and outputs in Azure ML Workbench, read [this](http://aka.ms/aml-largefiles).

## Instantiating TDSP structure and templates from the Azure ML Workbench gallery template

To create a new project with the Team Data Science Process structure and documentation templates, complete the following procedures: 

### Click on "New Project"

Open Azure Machine Learning Workbench. Under **Projects** on top left, click on **+** and select **New Project** to create a new project.

<img src="./media/how-to-use-tdsp-in-azure-ml/instantiation-1.png" width="800" height="600">


### Creating a new TDSP-structured project

Specify the parameters and information in the relevant boxes:

- Project name
- Project directory
- Project description
- Git repository 
- Workspace

Then in the **Search** box, type in *TDSP*. When the **TDSP Template** shows up, click on it to select that template. Then click the **Create** button to create your new project with the TDSP structure.

<img src="./media/how-to-use-tdsp-in-azure-ml/instantiation-2.png" width="800" height="600">


## Examine the TDSP project structure

After your new project is created, you can examine its structure. It contains all of the aspects of standardized documentation for business understanding, the stages of the TDSP lifecycle, data location, definition, and architecture in this documentation template. This structure is derived from the TDSP structure published [here](https://github.com/Azure/Azure-TDSP-ProjectTemplate), with some modifications. For example, several of the document templates are merged into one markdown, namely, [ProjectReport](https://github.com/amlsamples/tdsp/blob/master/ProjectReport.md). 

### Project folder structure
The TDSP project template contains following top-level folders:
1. **Code**: Contains code
2. **docs**: Contains neccessary documentation about the project (e.g. Markdown files)
3. **Sample_Data**: Contains **SAMPLE (small)** data that can be used for early development or testing. Typically, not more than several (5) Mbs. Not for full or large data-sets.
4. **Images**: Contain images for Markdown documents. It is NOT a folder for storing image files for training.

<img src="./media/how-to-use-tdsp-in-azure-ml/instantiation-3.png" width="800" height="600">


## Using the TDSP structure and templates

The template is not populated with any code in the **Code** folder, or docs in the **Docs** folder. You are expected to populate these folders with the code and document files that are necessary for executing and delivering your project. The [ProjectReport](https://github.com/amlsamples/tdsp/blob/master/ProjectReport.md) file is a template that should be directly modified with information relevant to your project. It comes with a set of questions that help you fill out the information for each of the four stages of the [Team Data Science Process lifecycle](https://github.com/Azure/Microsoft-TDSP/blob/master/Docs/lifecycle-detail.md).

For an example of how a project structure can look like during execution or after completion is given below.

<img src="./media/how-to-use-tdsp-in-azure-ml/instantiation-4.png" width="800" height="500">



## Documenting your project

Refer to [TDSP documentation templates](https://github.com/Azure/Azure-TDSP-ProjectTemplate) for help documenting your project. In the current Azure Machine Learning Workbench TDSP documentation template, we recommend that you include all the information in the [ProjectReport](https://github.com/amlsamples/tdsp/blob/master/ProjectReport.md) file. This template should be filled out with information that is specific to your project. 

We also provide another [ProjectLearnings](https://github.com/amlsamples/tdsp/blob/master/Docs/ProjectLearnings.md) template to include any information not be included in the primary project document, but that is still useful to document. 


## Next steps

To facilitate your understanding on how the TDSP structure and templates can be used in Azure Machine Learning Workbench projects, we provide several worked-out project examples in the documentation for Azure ML Workbench.

- For a tutorial showing how create a TDSP project in Azure Machine Learning Workbench, see [Team Data Science Process Tutorial: Classify incomes from US Census data in Azure Machine Learning Workbench](tutorial-classifying-uci-incomes.md) 
- For a sample that uses a TDSP-instantiated project in Azure Machine Learning Workbench, see [Bio-medical entity recognition using Natural Language Processing with Deep Learning](sample-tdsp-nlp.md)
