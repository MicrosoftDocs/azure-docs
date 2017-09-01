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
# Azure ML Workbench Concepts

Welcome to the Azure Machine Learning Workbench. This document defines high-level concepts that you need to understand before using Workbench and its services. 

**Azure Machine Learning Experimentation Service**

The Experimentation Service is a managed Azure service that takes machine learning experimentation to the next level. Experiments can be built locally or in the cloud. Rapidly prototype on a desktop, then scale to virtual machines or Spark clusters. Azure VMs with the latest GPU technology allow you to engage in deep learning quickly and effectively. We’ve also included deep integration with Git so you can plug easily into existing workflows for code tracking, configuration, and collaboration. 

**Azure Machine Learning Model Management Service**

The Model Management Service is a managed Azure service that allows data scientists and dev-ops teams to deploy predictive models reliably into a wide variety of environments. GIT repositories and Docker containers provide traceability and repeatability. Models can be deployed reliably in the cloud, on-premises, or edge. Once in production, you can manage model performance, then proactively retrain if performance degrades. You can deploy models on local machines, to Azure VMs, Spark HDInsight, or Kubernetes-orchestrated Azure Container Service clusters.  

**Model** 

In Azure Machine Learning, models refer to the product of a machine learning experiment. They are recipes that, when applied correctly to data, result in a predicted value. Models are composed of an algorithm and a set of coefficients that describe the shape of your data. The Experimentation Service stores models (and other assets) in a GIT repository. Models can be deployed to production and used to generate predictions. Models can be deployed on local machines or to Azure VMs. You can also scale your models to Spark HDInsight or Kubernetes-orchestrated Azure Container Service clusters. Via Docker, models can even be deployed to IoT Edge. Once in production, models can be monitored for performance and data drift, and retrained as required. A model that is registered in the hosting account is counted against your plan, including models updated through retraining or version iteration.

**Algorithm**

An algorithm is a procedure for solving a mathematical problem in a finite number of steps. 

**Subscription**

An Azure subscription grants you access to Azure services and the Azure Platform Management Portal. An Azure subscription has two parts: 
- An account, through which resource usage is reported and services are billed; and 
- The subscription itself, which governs access to and use of the Azure services. 
Azure Machine Learning requires that each user have a valid Azure subscription. Users must also have  sufficient permissions within that subscription to create resources. The reason for this is that AML directly employs several Azure services including Visual Studio Team Services, Azure Blob Storage, and Azure Key Vault. These services are used to track and manage machine learning code and models using Github and Visual Studio. 

Note: During Public Preview, your subscription must have access to Azure resources in ‘EAST US 2’ or ‘West Central US’. Azure Machine Learning is currently deployed only in these regions. 

## Experimentation Service Concepts

**Experiment**

The concept of ‘an experiment’ is one of the pillars of Azure Machine Learning. Machine Learning experiments are code or scripts that define the data, the data pipeline, the algorithm, and the execution of your solution. Experiments are managed via the Experimentation Service--a managed Azure service that allows you to run machine learning experiments locally or in the cloud. Using the Experimentation Service, you can leverage deep learning algorithms in your experiments quickly and effectively. Currently, Azure Machine Learning supports Python or PySpark experiments but we anticipate adding support for R shortly. 

**Team**

In Azure Machine Learning Workbench, a 'Team' is the top level resource. It contains your work spaces,projects, and project assets. A 'Team' is associated with an Azure Resource Group. Teams contain 'Members' who can gain access to the work groups, projects and assets associated with a Team. 

**Work Group**

A Work Group is the primary (and only) component of sharing in the Experimentation Service or Workbench. A Work Group allows for the grouping of projects and is a security boundary for access. Additionally, Work Groups are the container for Data Sources and Environments common across projects. 

**Project**

An Azure Machine Learning Project is a logical container that contains all the work being done for a given solution. Projects are mapped to a single file system folder. Project folders are backed up GIT   repositories and published to your Experimentation Service for sharing and collaboration.  

**Environment**

In Azure Machine Learning, an environment denotes a set of Azure resources that are available for experiment execution or model deployment. Environments must be provisioned to your Experimentation Service. This can be done via the CLI or through the Workbench UI. When you provision a new environment, the Experimentation Service creates a number of Azure resources in your subscription including:
- A storage account
- An Azure Container Registry entry 
- A Kubernetes ACS cluster
- An App Insights account for user logs 

Environments behave differently depending on their context and Work Group:  
- Local Work Group: All the connection information is stored on the desktop  
- Cloud Work Group: the environment uses KeyVault for safe storage of connection information   


## Workbench Concepts

**Azure Machine Learning Workbench?**

Workbench is a code-first, extensible machine learning application built for professional data scientists. Available for Windows and Mac, Workbench provides overview, management, and control for machine learning solutions. Workbench includes access to cutting edge AI frameworks from both Microsoft and the open source community. We've included the most popular data science toolkits, including TensorFlow, Microsoft Cognitive Toolkit, Spark ML, scikit-learn, and more. We’ve also enabled integration with popular data science IDEs such as Jupyter notebooks, PyCharm, and Visual Studio Code. Workbench has built-in data preparation capabilities to rapidly sample, understand, and prepare data, whether structured or unstructured. Our new data preparation tool, called PROSE, is built on cutting-edge technology from Microsoft Research.  

**Data connection**

A data connection is an Azure Machine Learning object that stores access information needed to connect to a particular data source.
  
**Data Source**

A data source describes both the origin of your data and information on how that data should be retrieved. A data source includes relevant metadata description as well as the query/command needed to retrieve a data set.
 
**Data Set**

A dataset is data that has materialized in memory, a file, or a table. It is a direct handle to the data or the rectangular data itself. 

**Data Flow**

 A DataFlow is a collection of data preparation steps in Azure Machine Learning. The Workbench reads data from a DataSource and uses .dprep files as containers for multiple DataFlows. 

**Compute Context**

Local, Cloud, Clustered

**Execution Target** 

An execution target is the run time environment that you have selected for your experiment. The Experimentation Service allows you to execute a Python/PySpark script either locally or in the cloud. Execution options are: 
- Python (3.5.2) on your local computer 
- Conida Python environment inside of a Docker container on local computer
- Conda Python environment inside of a Docker container on a remote Linux machine, e.g. an Ubuntu-based DSVM on Azure
- A Spark cluster such as Spark for HDInsight Spark on Azure
 
**Run**

The Experimentation Service defines a run as the execution of a given file in an environment. Run status is available in the Workbench UI. 


## Model Management Concepts

**Managed model**

A model is the output of a training process and is the application of a machine learning algorithm to training data. The Model Management service enables you to deploy models as web services, manage various versions of your models, and monitor their performance and metrics. ‘Managed’ models have been registered with an Azure Machine Learning Model Management account. As an example, consider a scenario where you are trying to forecast sales. During the experimentation phase, you generate many models by using different data sets or algorithms. You have generated four models with varying accuracies but choose to register only the model with the highest accuracy. The model that is registered becomes your first managed model.
 
**Deployment?**

The Model Management service allows you to deploy models as packaged web service containers in Azure. These web services can be invoked using REST APIs. Each web service is counted as a single deployment, and the total number of active deployments are counted towards your plan. Using the sales forecasting example, when you deploy your best performing model, your plan is incremented by one deployment. If you then retrain and deploy another version, you have two deployments. If you determine that the newer model is better, and delete the original, your deployment count is decremented by one.  

**Manifests**

Models require additional artifacts before they can be deployed in production. The Model Management system provides capabilities to create a manifest that encompasses the model, dependencies, an inference, or scoring script, sample data, schema etc. The manifest is the  recipe used to create a Docker container image. Using the Model Management Service, you can auto-generate, create versions, and manage your manifests. 

**Images**

You can use manifests from the previous step to generate (and regenerate) Docker container images in their respective environments. Containerized Docker images create flexibility to run  images at scale on [Kubrenetes based Azure Container Service](https://docs.microsoft.com/en-us/azure/container-service/kubernetes/container-service-kubernetes-walkthrough). Alternatively, you can pull images into a local environment to run on-premises, on a local machine, or on IoT device. Images are self-contained, and include all dependencies required for generating predictions. 

**Retraining**

The Model Management Service provides APIs to retrain models, and to update existing deployments with new versions. Following the data science workflow, you can recreate a model in your experimentation environment and register it with the Model Management Service. From there, you can update your  existing deployment environment with the new model using a single UPDATE command from the CLI. The UPDATE method does not change a deployment's API URL or key. Dependent applications will work without any code changes, and will begin receiving new predictions with the new model as soon as it is deployed.

