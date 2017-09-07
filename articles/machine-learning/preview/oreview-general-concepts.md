---
title: Conceptual overview of Azure Machine Learning preview features | Microsoft Docs
description: A conceptual overview of the preview features of Azure Machine Learning.
services: machine-learning
author: serinakaye
ms.author: serinak
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 09/06/2017 
---

# Azure Machine Learning - Conceptual Overview

## Introduction

Welcome to the new Azure Machine Learning. Our new release includes the Experimentation Service, the Model Management Service, and our Workbench application. We've also released an update to MMLSpark and a new plug-in for Visual Studio Code. Together, these applications and services have been designed to increase your rate of experimentation and allow you to build, deploy and manage machine learning models in a wide range of environments. 

Our new release has been designed as a code-first, extensible machine learning platform. Workbench, available as a download for Windows and Mac, is the companion application for the Experimentation and Model Management services. With it you can manage your machine learning experiments from start to finish, including:
- Data connection, import, preparation, and wrangling 
- Notebook and IDE integration
- Collaboration and sharing
- Model creation, lineage and version control
- Model scoring, statistics and comparison
- Registration, deployment, monitoring and retraining of production models
 
The Experimentation Service is a managed Azure service that allows you to build, test and compare machine learning models locally or in the cloud. The service supports all machine learning Python libraries, whether proprietary to your business or open-source. (The installation of Workbench includes a wide range of the most popular open source machine learning libraries, including Spark, CNTK, TensorFlow, and scikit-learn.)  The service is also integrated by default with Visual Studio and Github. This integration enables collaboration, data and model history, lineage, and back-ups. Lastly, the Experimentation Service is deeply integrated with Docker and uses industry standard Docker containers to enable model portability and reproducibility across environments. 

The Model Management Service is a managed Azure service that allows data scientists and dev-ops teams to deploy predictive models reliably into a wide variety of environments. The service uses the same GIT repository designated by the Experimentation Service. Using Git, models are versioned and model lineage is tracked. The Model Management Service uses Docker to manage and deploy models reliably to local machines, Azure, or IoT edge devices. Models are deployed via Linux-based Docker containers that include the model and all encompassing dependencies. Containers are registered with Azure Container Registry and in the case of cloud deployments, pushed to Azure Container Service. For cluster deployments, Kubernetes is used to manage and load balance across containers. 

![Azure Machine Learning Concepts](media/concepts/aml-concepts.png)

## Getting Around the UI

The new Azure Machine Learning Workbench allows you to easily interact with the Experimentation and Model Management services. It has been built with a few key concepts that in mind. These include:

- **Subscription** An Azure subscription grants you access to Azure services and the Azure Platform Management Portal. Because Azure Machine Learning is deeply integrated with Visual Studio Team Services, Azure Blob Storage, Azure Key Vault, and other Azure services, Workbench requires that each user have a valid Azure subscription. Users must also have sufficient permissions within that subscription to create resources. Note: During Public Preview, your subscription must have access to Azure resources in ‘EAST US 2’ or ‘West Central US’. Azure Machine Learning is currently deployed only in these regions.


- **Team** A 'Team' is the top-level resource in Workbench. It contains your work spaces, projects, and project assets. A 'Team' is associated with an Azure Resource Group. Teams contain 'Members', who can gain access to the work groups, projects, and assets associated with a Team. 


- **Work Group** A Work Group is the primary component for sharing in Workbench. Projects are grouped within a Work Group and then shared to team members. Work Groups function as a security boundary for your project and project assets.  


- **Project** In Azure Machine Learning, a project is the logical container for all the work being done in a solution. Projects are backed up in GIT repositories and published to the Experimentation Service for sharing and collaboration.  

- **Experiment** In Workbench, experiments are code or scripts that define the data, the data pipeline, the algorithm, and the execution of a solution. Currently, Azure Machine Learning supports Python or PySpark experiments only. 


- **Model** In Azure Machine Learning, models refer to the product of a machine learning experiment. They are recipes that when applied correctly to data, result in a predicted value. Models are composed of an algorithm and a set of coefficients. Models can be deployed to production and used to generate predictions. Once in production, models can be monitored for performance and data drift, and retrained as required. 


- **Environment** In Azure Machine Learning, an environment denotes a set of Azure resources that are available for experiment execution or model deployment. Environments must be provisioned to your Experimentation Service through the CLI or Workbench UI. When you provision a new environment, the Experimentation Service creates a number of Azure resources in your subscription including a storage account, an Azure Container Registry entry, a Kubernetes ACS cluster, and an App Insights account for user logs.  


- **Execution Target** An execution target is the run time environment that you have selected for your experiment. Execution options include local Python (3.5.2), Conda Python environments inside Docker containers (local or remote), or HDInsight Spark clusters on Azure.

 
- **Run** The Experimentation Service defines a run as the execution of a given file in an environment. Run status is available in the Workbench UI. 


- **Managed model** The Model Management service enables you to deploy models as web services, manage various versions of your models, and monitor their performance and metrics. ‘Managed’ models have been registered with an Azure Machine Learning Model Management account. 
 

- **Deployment** The Model Management service allows you to deploy models as packaged web service containers in Azure. Each web service is counted as a single deployment. 


- **Manifests** When the Model Management system deploys a model into production it includes a manifest that encompasses the model, dependencies, a scoring script, sample data, and a schema. The manifest is the recipe used to create a Docker container image. Using the Model Management Service, you can auto-generate, create versions, and manage your manifests. 


- **Images** You can use manifests to generate (and regenerate) Docker images. Containerized Docker images create flexibility to run images in the cloud, on local machines, or on IoT device. Images are self-contained, and include all dependencies required for generating predictions. 

