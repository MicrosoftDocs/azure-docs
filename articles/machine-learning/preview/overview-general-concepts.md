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

# Azure Machine Learning - Concepts

Welcome to Azure Machine Learning. Our new release includes the Experimentation Service, Model Management, and our Workbench application. This document defines are a few key concepts that will help you understand our new services and application. 

- **Subscription** An Azure subscription grants you access to Azure services and the Azure Platform Management Portal. Because Azure Machine Learning is deeply integrated with Visual Studio Team Services, Azure Blob Storage, Azure Key Vault, and other Azure services, Workbench requires that each user have a valid Azure subscription. Users must also have sufficient permissions within that subscription to create resources. Note: During Public Preview, your subscription must have access to Azure resources in ‘EAST US 2’ or ‘West Central US’. Azure Machine Learning is currently deployed only in these regions.


- **Team** A 'Team' is the top-level resource in Workbench. It contains your work spaces, projects, and project assets. A 'Team' is associated with an Azure Resource Group. Teams contain 'Members', who can gain access to the work groups, projects, and assets associated with a Team. 


- **Work Group** A Work Group is the primary component for sharing in Workbench. Projects are grouped within a Work Group and then shared to team members. Work Groups function as a security boundary for your project and project assets.  


- **Project** In Azure Machine Learning, a project is the logical container for all the work being done in a solution. Projects are backed up in GIT repositories and published to the Experimentation Service for sharing and collaboration.  

- **Experiment** In Workbench, experiments are code or scripts that define the data, the data pipeline, the algorithm, and the execution of a solution. Currently, Azure Machine Learning supports Python or PySpark experiments only. 


- **Model** In Azure Machine Learning, models refer to the product of a machine learning experiment. They are recipes that when applied correctly to data, result in a predicted value. Models are composed of an algorithm and a set of coefficients. Models can be deployed to production and used to generate predictions. Once in production, models can be monitored for performance and data drift, and retrained as required. 


- **Environment** In Azure Machine Learning, an environment denotes a set of Azure resources that are available for experiment execution or model deployment. Environments must be provisioned to your Experimentation Service through the CLI or Workbench UI. When you provision a new environment, the Experimentation Service creates a number of Azure resources in your subscription including a storage account, an Azure Container Registry entry, a Kubernetes ACS cluster, and an App Insights account for user logs.  


- **Execution Target** An execution target is the run time environment that you have selected for your experiment. Execution options include local Python (3.5.2), Conda Python environments inside Docker containers (local or remote), or HDInsight Spark clusters on Azure.

 
- **Run** The Experimentation Service defines a run as the execution of a given file in an environment. Run status is available in the Workbench UI. 


- **Managed model** Model Management enables you to deploy models as web services, manage various versions of your models, and monitor their performance and metrics. ‘Managed’ models have been registered with an Azure Machine Learning Model Management account. 
 

- **Deployment** Model Management allows you to deploy models as packaged web service containers in Azure. Each web service is counted as a single deployment. 


- **Manifests** When the Model Management system deploys a model into production it includes a manifest that encompasses the model, dependencies, a scoring script, sample data, and a schema. The manifest is the recipe used to create a Docker container image. Using Model Management, you can auto-generate, create versions, and manage your manifests. 


- **Images** You can use manifests to generate (and regenerate) Docker images. Containerized Docker images create flexibility to run images in the cloud, on local machines, or on IoT device. Images are self-contained, and include all dependencies required for generating predictions. 

