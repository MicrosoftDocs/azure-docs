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

- **Subscription:** An Azure subscription grants you access to resources in Azure. Because Azure Machine Learning is deeply integrated with compute, storage, and many other Azure resources and services, Workbench requires that each user have access to a valid Azure subscription. Users must also have sufficient permissions within that subscription to create resources.


- **Experimentation Account:** Experimentation account is an Azure resource required by Azure ML, and a billing vehicle. It contains your workspaces, which in turn contain projects. You can add multiple users to an experimentation account. You must have access to an experimentation account in order to use Azure ML Workbench to run experiments. 


- **Model Management Account** A model management account is also an Azure resource required by Azure ML for manage models. You can use it to register models and manifests, build containerized web services and deploy them locally or in the cloud. It is also the other billing vehicle of Azure ML


- **Workspace:** A Workspace is the primary component for sharing and collaboration in Azure ML. Projects are grouped within a workspace. A workspace can then be shared with multiple users.  


- **Project:** In Azure Machine Learning, a project is the logical container for all the work being done to solve a problem. It maps to a single file folder on your local disk, and you can add any files or sub folders to it. A project can be associated with a Git repository for source control and collaboration.  

- **Experiment:** In Azure ML, an experiment is one or more source code file(s) that can be executed from a single entry point. It may contain tasks such as data ingestion, feature engineering, model training, or model evaluation. Currently, Azure ML supports Python or PySpark experiments only. 


- **Model:** In Azure Machine Learning, models refer to the product of a machine learning experiment. They are recipes that when applied correctly to data, generate predicted values. Models are composed of an algorithm and a set of coefficients. Models can be deployed to production and used to generate predictions. Once in production, models can be monitored for performance and data drift, and retrained as required. 

- **Compute Target:** A compute target is the compute resource that you configure for executing your experiment. It can be your local computer (Windows or macOS), Docker container running on your local computer or in a Linux VM on Azure, or an HDInsight Spark cluster. 


- **Environment:** In Azure Machine Learning, an environment denotes a set of Azure resources that are available for experiment execution or model deployment. Environments must be provisioned to your Experimentation Service through the CLI or Workbench UI. When you provision a new environment, the Experimentation Service creates a number of Azure resources in your subscription including a storage account, an Azure Container Registry entry, a Kubernetes ACS cluster, and an App Insights account for user logs.  


- **Execution Target:** An execution target is the run time environment that you have selected for your experiment. Execution options include local Python (3.5.2), Conda Python environments inside Docker containers (local or remote), or HDInsight Spark clusters on Azure.

 
- **Run:** The Experimentation Service defines a run as the execution of a given file in an environment. Run status is available in the Workbench UI. 


- **Managed model:** Model Management enables you to deploy models as web services, manage various versions of your models, and monitor their performance and metrics. ‘Managed’ models have been registered with an Azure Machine Learning Model Management account. 
 

- **Deployment:** Model Management allows you to deploy models as packaged web service containers in Azure. Each web service is counted as a single deployment. 


- **Manifests:** When the Model Management system deploys a model into production it includes a manifest that encompasses the model, dependencies, a scoring script, sample data, and a schema. The manifest is the recipe used to create a Docker container image. Using Model Management, you can auto-generate, create versions, and manage your manifests. 


- **Images:** You can use manifests to generate (and regenerate) Docker images. Containerized Docker images create flexibility to run images in the cloud, on local machines, or on IoT device. Images are self-contained, and include all dependencies required for generating predictions. 

