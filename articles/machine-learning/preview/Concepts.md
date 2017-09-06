---
title: Machine Learning 2017 Preview FAQ | Microsoft Docs
description: This article contains commonly asked questions and answers
services: machine-learning
author: serinakaye
ms.author: serinak
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 08/30/2017 
---

# Azure Machine Learning Workbench: Concepts

## Introduction

Welcome to the Azure Machine Learning Workbench. Workbench is a code-first, extensible machine learning application available for Windows and Mac. Workbench is the companion application for our new Experimentation and Model Management Services, currently in Preview. You can use it to manage your machine learning experiments from start to finish, including:
- Data connection, import, preparation, and wrangling 
- Notebook and IDE integration
- Collaboration and sharing
- Model creation, lineage and version control
- Model scoring, statistics and comparison
- Registration, deployment, monitoring and retraining of production models
 
The Experimentation Service is a managed Azure service that allows you to build, test and compare machine learning models locally or in the cloud. Workbench and the Experimentation Service are an open data science platform: Spark, CNTK, TensorFlow, scikit-learn and a few other libraries are installed by default, but you can use any open source or proprietary Python library in your solution. Both Workbench and the Experimentation Service use Docker for scale and reproducibility. You can prototype on a desktop, and then scale to virtual machines or Spark clusters using containers. And both are  integrated by default with Visual Studio and Git Hub. The integration enables collaboration as well as data and model history, lineage, and back-ups. Workbench is not an IDE, but we've made it easy to integrate with popular data science IDEs including Jupyter Notebooks and Visual Studio Code.   

The Model Management Service is a managed Azure service that allows data scientists and dev-ops teams to deploy predictive models reliably into a wide variety of environments. The service uses the same GIT repository designated by the Experimentation Service for model versioning and lineage. The Model Management Service also uses Docker to manage and deploy models reliably to local machines, Azure, or IoT edge devices. When you deploy a new model, the service creates a Linux-based Docker container that includes the model and all encompassing dependencies. The container is then registered with Azure Container Registry. In the case of cloud deployments, the Docker image is pushed to Azure Container Service. For cluster deployments, Kubernetes is used to manage and load balance across containers. 

## Getting Around the Workbench UI

Workbench has been built with a few key concepts in mind. You'll need to understand these to navigate through the UI. These include:


- **Team** A 'Team' is the top-level resource in Workbench. It contains your work spaces, projects, and project assets. A 'Team' is associated with an Azure Resource Group. Teams contain 'Members', who can gain access to the work groups, projects, and assets associated with a Team. 


- **Work Group** A Work Group is the primary (and only) component for sharing in Workbench. You can group projects within a Work Group and can think of the Work Group as a security boundary for your project and project assets.  


- **Project** In Azure Machine Learning, a project is the logical container for all the work being done in a solution. Projects are backed up in GIT repositories and published to the Experimentation Service for sharing and collaboration.  


- **Subscription** An Azure subscription grants you access to Azure services and the Azure Platform Management Portal. Because Azure Machine Learning is deeply integrated with Visual Studio Team Services, Azure Blob Storage, Azure Key Vault, and other Azure services, Workbench requires that each user have a valid Azure subscription. Users must also have sufficient permissions within that subscription to create resources. Note: During Public Preview, your subscription must have access to Azure resources in ‘EAST US 2’ or ‘West Central US’. Azure Machine Learning is currently deployed only in these regions.
 

- **Model** In Azure Machine Learning, models refer to the product of a machine learning experiment. They are recipes that when applied correctly to data, result in a predicted value. Models are composed of an algorithm and a set of coefficients that describe the shape of a data set. Models can be deployed to production and used to generate predictions. Once in production, models can be monitored for performance and data drift, and retrained as required. 


- **Experiment** In Workbench, experiments are code or scripts that define the data, the data pipeline, the algorithm, and the execution of a solution. Currently, Azure Machine Learning supports Python or PySpark experiments only. 
 

- **Environment** In Azure Machine Learning, an environment denotes a set of Azure resources that are available for experiment execution or model deployment. Environments must be provisioned to your Experimentation Service through the CLI or Workbench UI. When you provision a new environment, the Experimentation Service creates a number of Azure resources in your subscription including: a storage account, an Azure Container Registry entry, a Kubernetes ACS cluster, and an App Insights account for user logs.  


- **Execution Target** An execution target is the run time environment that you have selected for your experiment. Execution options include local Python (3.5.2), Conda Python environments inside Docker containers (local or remote), or HDInsight Spark clusters on Azure.

 
- **Run** The Experimentation Service defines a run as the execution of a given file in an environment. Run status is available in the Workbench UI. 


## Model Management Concepts

- **Managed model** A model is the output of a training process and is the application of a machine learning algorithm to training data. The Model Management service enables you to deploy models as web services, manage various versions of your models, and monitor their performance and metrics. ‘Managed’ models have been registered with an Azure Machine Learning Model Management account. As an example, consider a scenario where you are trying to forecast sales. During the experimentation phase, you generate many models by using different data sets or algorithms. You have generated four models with varying accuracies but choose to register only the model with the highest accuracy. The model that is registered becomes your first managed model.
 

- **Deployment** The Model Management service allows you to deploy models as packaged web service containers in Azure. These web services can be invoked using REST APIs. Each web service is counted as a single deployment, and the total number of active deployments are counted towards your plan. Using the sales forecasting example, when you deploy your best performing model, your plan is incremented by one deployment. If you then retrain and deploy another version, you have two deployments. If you determine that the newer model is better, and delete the original, your deployment count is decremented by one.  


- **Manifests** Models require additional artifacts before they can be deployed in production. The Model Management system provides capabilities to create a manifest that encompasses the model, dependencies, an inference, or scoring script, sample data, schema etc. The manifest is the  recipe used to create a Docker container image. Using the Model Management Service, you can auto-generate, create versions, and manage your manifests. 


- **Images** You can use manifests from the previous step to generate (and regenerate) Docker container images in their respective environments. Containerized Docker images create flexibility to run  images at scale on [Kubrenetes based Azure Container Service](https://docs.microsoft.com/en-us/azure/container-service/kubernetes/container-service-kubernetes-walkthrough). Alternatively, you can pull images into a local environment to run on-premises, on a local machine, or on IoT device. Images are self-contained, and include all dependencies required for generating predictions. 


- **Retraining** The Model Management Service provides APIs to retrain models, and to update existing deployments with new versions. Following the data science workflow, you can recreate a model in your experimentation environment and register it with the Model Management Service. From there, you can update your  existing deployment environment with the new model using a single UPDATE command from the CLI. The UPDATE method does not change a deployment's API URL or key. Dependent applications work without any code changes, and begin receiving new predictions with the new model as soon as it is deployed.

