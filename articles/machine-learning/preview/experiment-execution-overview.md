---
title: Overview of Azure Machine Learning Experiment Execution Service
description: This document provides a high-level overview for Azure Machine Learning Experiment Execution Service
services: machine-learning
author: 
ms.author: gokhanu
manager: haining
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 09/06/2017
---

# Overview of Azure Machine Learning Experiment Execution Service
Azure ML experiment execution service enables data scientists to execute their experiments using Azure ML's execution and run management capabilities. It provides a framework for agile experimentation with fast iterations starting with local runs and an easy path for scaling up and out to other environments such as a remote Data Science VM with GPUs or an HDInsight Cluster running Spark.

Experiment Execution Service is built for providing reproducible and consistent runs of your experiments by helping you manage your compute targets, execution environments, and run configurations and lets you move between different environments easily with its run management and execution capabilities. 

Users can choose to execute a Python or PySpark script in an Azure ML Workbench project either locally or at scale in the cloud. 

Users can run their scripts on: 

* Python (3.5.2) environment on your local computer installed by Azure ML Workbench.
* Conda Python environment inside of a Docker container on local computer
* Conda Python environment inside of a Docker container on a remote Linux machine such as an [Ubuntu-based DSVM on Azure](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu)
* [HDInsight for Spark](https://azure.microsoft.com/services/hdinsight/apache-spark/) on Azure

>Azure ML Execution Service currently supports Python 3.5.2 and Spark 2.1.10+ as Python and Spark runtime versions, respectively. 


## Key Concepts in Azure ML Experiment Execution
It is important to understand the following concepts in Azure ML experiment execution. In the subsequent sections, we will discuss in detail how to manage these concepts. 
### Compute Target
Compute target is the resource that is provisioned or assigned to execute user's program such as user's desktop, a remove VM, or a cluster. Compute target is addressable and accessible by the user (or the admin) for further configuration and deployment. Azure ML provides you the capability to create compute targets and manage them using the Workbench application, CLI, and the .compute files. 

#### Supported compute targets are:
* Local machine
    * Python (3.5.2) environment on your local computer installed by Azure ML Workbench.
    * Conda Python environment inside of a Docker container on local computer
* Remote Linux (Ubuntu) VM
    * Conda Python environment inside of a Docker container on a remote Linux machine
* Remote HDInsight Cluster
    * Conda environment running on HDInsight

### Execution Environment
Execution environment defines the run time configuration and the dependencies needed to run the program. In Azure ML, user has the ability to manage local execution environment using their favorite tools and package managers and Conda is used to manage Docker-based local and remote executions as well as HDInsigh-based executions. Execution environment configurations are managed through Conda_dependencies.yml
Spark_dependencies.yml files in aml_config folder in Azure ML projects.

#### Supported runtime environments are:
* Python 3.5.2
* Spark 2.1.10+

### Run Configuration
In addition to compute target and execution environment, Azure ML provides a framework to define and change run configuration. Different execution of your experiment may require different configuration and parameters as part of iterative experimentation such as parameters to be swept, data sources, run tracking and Azure ML execution service provides a framework for managing run configuration.

_Figure below shows the high-level flow for initial experiment run:_
![](media/experiment-execution-overview/experiment-execution-flow.png)

# Azure ML Experiment Execution Scenarios
In the previous section, we touched upon some of the key concepts in Azure ML experiment execution service and  supported configurations. In this section, we will dive into execution scenarios and learn about how Azure ML runs experiments, specifically running an experiment locally, on a remote VM, and on an HDInsightCluster.

## Running experiments locally
Azure ML allows users to run their experiments locally against Azure ML installed Python 3.5.2 runtime or on a local Docker container.

### Running a script locally on Azure ML Workbench-installed runtime
Azure ML enables users to run their scripts directly against the Azure ML Workbench-installed runtime. This default runtime is installed at Azure Ml Workbench set-up time and includes Azure ML libraries and dependencies. Run results and artifacts for local executions are still saved in Azure ML Run History service in the cloud.

This configuration, unlike Docker-based executions, is _not_ managed by Conda and the user needs to manage dependencies using their preferred tools and package managers. 

_Overview of local execution for a Python script:_
![](media/experiment-execution-overview/local-native-run.png)

### Running a script on local Docker
Users can also run their projects on a Docker container on their local machine through Azure ML Execution Service. Azure ML Workbench provides a base Docker image that comes with Azure ML libraries and as well as Spark runtime to make local Spark executions easy. 
 
Execution environment on local Docker is prepared using the Azure ML base Docker image configured by using user's conda specification in conda_dependencies.yml file.
>If running a PySpark script on Spark,spark_dependencies.yml is also used in addition to conda_dependencies.yml.

Ability to run projects locally on Docker enables our users to do experiment runs that are reproducible and consistent. It also provides and easy on ramp to runs on remote targets and operationalization using Azure ML Model Management service. 

_Overview of local Docker execution for a Python script:_
![](media/experiment-execution-overview/local-docker-run.png)

### Running a script on a remote VM
In a lot of cases, the resources available on user's local machine may not be enough to train the desired model. In this situation, Azure ML Execution Service allows an easy way to run your projects on a more powerful VMs and VMs with special capabilities such as GPUs. 

Execution environment on remote VM is prepared using the Azure ML base Docker image configured by using user's conda specification in conda_dependencies.yml file similar to Docker-based local execution.

>If running a PySpark script on Spark, spark_dependencies.yml is also used in addition to conda_dependencies.yml.

>User needs SSH access to the remote VM in order to execute experiments in this mode. 

_Overview of remote vm execution for a Python script:_
![](media/experiment-execution-overview/remote-vm-run.png)


###Running a script on HDInsight Cluster
HDInsight is a popular platform for big data analytics supporting Apache Spark. Azure ML Workbench enables experimentation on big data using HDInsight Spark clusters. 

Azure ML Workbench prepares and manages execution environment on HDInsight cluster using Conda and HDInsight script actions which are managed by _conda_dependencies.yml_ and _spark_dependencies.yml_ configuration files respectively. 

>User needs SSH access to the HDInsight cluster in order to execute experiments in this mode. 

>Supported configuration is HDInsight Spark clusters running Linux-Ubuntu with Python/PySpark 3.5.2 and Spark 2.1.10+.

_Overview of HDInsight-based execution for a PySpark script
![](media/experiment-execution-overview/hdinsight-run.png)