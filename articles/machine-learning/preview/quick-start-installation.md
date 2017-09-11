---
title: Installation quickstart for Machine Learning Server | Microsoft Docs
description: This quickstart shows how to provision Azure Machine Learning resources, and how to install Azure Machine Learning Workbench
services: machine-learning
author: hning86
ms.author: haining, raymondl, chhavib
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: hero-article
ms.date: 09/07/2017
---

# Installing Azure Machine Learning preview features

In these articles, you will learn to use Azure Machine Learning preview features, starting with these two things:
- How to create and deploy Azure Machine Learning Experimentation and Model Management accounts
- How to install the Azure Machine Learning Workbench desktop application and CLI tools.


## Prerequisites
### Mandatory Requirements:
* An Azure account - you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you need one.
* Client machine for the Azure ML Workbench:
    * Windows 10 or Windows Server 2016
    * macOS Sierra (or newer)

### Optional Requirements
* Local Docker engine for running dev/test scenarios locally.
* Access to an Ubutu Linux VM for scale-up computation.
* Access to HDInsight for Spark cluster for scale-out computation.
* Docker must be installed on local machine for local web service deployment.

## Provisioning
Launch the Azure portal by browsing to [http://portal.azure.com](http://portal.azure.com). Log in to Azure. Click on **+ New** and search for `Machine Learning`. Look for `ML Experimentation (preview)` in the search results. Click on `ML Experimentation (preview)` to get started with creating your _Machine Learning Experimentation account_. As part of the Experimentation account creation, you are also asked to create an Azure storage account, or to supply an existing one, for storing Run outputs and other data.

As part of the Experimentation account creation experience, you have the option of also creating the _Machine Learning Model Management account_. You need this resource when you are ready to deploy and manage your models as real-time web services. We recommended that you create the Model Management account at the same time as the Experimentation account.

<!--
>NOTE: Some note about pricing associated for public preview should go in here.
-->

## Installation
You can install Azure Machine Learning Workbench on your Windows or macOS computer.

### Download the Latest Azure ML Workbench Installer

| Installer | Operation System  
| ------- | ------- 
| [AmlWorkbenchSetup.exe](https://vienna.blob.core.windows.net/windows/AmlWorkbenchSetup.exe) | Windows 
| [AmlWorkbench.dmg](https://vienna.blob.core.windows.net/osx/AmlWorkbench.dmg) | macOS

### Special Note for macOS Users
Run this [shell script](./scripts/quick-start-installation/install_openssl.sh) to brew-install the latest OpenSSL libraries. And configure links before proceeding with the installation. 

If you are using Python greater than 3.5, you need to execute this command to enable installing the right certificates.
```bash
$ /Applications/Python\ 3.6/Install\ Certificates.command
```

### Install Azure ML Workbench
Double-click the downloaded installer `AmlWorkbenchSetup.exe` (on Windows), or `AmlWorkbench.dmg` (on macOS). Follow the on-screen instructions to finish the installation. Azure ML Workbench is now installed in the following directory:
```
# On Windows
C:\Users\<username>\AppData\Local\AmlWorkbench

# On macOS
/Applications/AmlWorkbench.app
 ```

Click on the **Launch Azure ML Workbench** button when the installation process is complete. If you close the installer, you can still find the shortcut to the Machine Learning Workbench on your desktop named **Azure Machine Learning Workbench**. Double-click it to open the app. 

Log in to the Workbench using the same account you used earlier to provision your Azure resources. 

When login has succeeded, Workbench will attempt to find the ML Experimentation accounts you created earlier. It will search within the entire set of Azure subscriptions to which your credentials are attached. If at least one ML Experimentation Account is found, Azure ML Workbench will load it and list the Workspaces and Projects found under that account. After your installation process is complete, you can move on to installing optional components.

### Success
You have now successfully installed the Workbench desktop app and command-line interface. Follow the [Iris Quickstart](quick-start-iris.md) to get a quick tour of the Azure ML preview features experience.

### Install Optional Components
Azure ML Workbench can run experiments in various compute targets. To leverage these execution targets, install additional components, and create or obtain access to additional computation resources in Azure:
* Execute on your local **Windows or macOS computer**
    * There is no additional requirements.
* Execute in a **local Docker container**
    * You must have Docker engine installed and running. Follow [Docker installation instructions](https://docs.docker.com/engine/installation/) to install Docker on your operation system.
* Execute in a **Docker container on a remote Linux machine**
    * You must have SSH access (username and password) to that Linux VM, and you must have Docker engine installed and running on that machine.
    * We recommend you [create a Ubuntu-based DSVM (Data Science Virtual Machine) on Azure](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-dsvm-ubuntu-intro), which has Docker pre-installed so it is ready to go.
* Execute in an **HDInsight Spark cluster**
    * You must have SSH access (username and password) to the head node of that HDInsight Spark cluster. Here are the instructions on [provisioning a HDInsight Spark cluster](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-jupyter-spark-sql).
* Deploy a web service to run locally on your machine
    * This requires a local Docker installation. Follow [Docker installation instructions](https://docs.docker.com/engine/installation/) to install Docker on your operation system.
* Deploy a web service to run in an Azure Container Service Kubernetes cluster
    * You can set this up in advance, or use Model Management CLI setup command to create it for you.

#### Special Note on Docker for Windows 
Docker is needed if you want to execute scripts in a local Docker container, or deploy model via a containerized web service locally. We have some tips for installing and configuring Docker for Azure Machine Learning on Windows.  Make sure you follow these instructions:
- Only Windows 10 is supported for running Docker for Windows.
- Install [Docker for Windows](https://docs.docker.com/docker-for-windows/install/) and have it up and running.
- Make sure your Docker engine is running in [Linux Container mode](https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers).
- Optionally, for better execution performance, share C drive (or whichever drive the system _%temp%_ folder is) in the Docker for Windows configuration.
 
![Share C drive](media/quick-start-installation/share_c.png)

>Note on Windows, Docker container runs inside of a guest Linux VM on the Windows host via Hyper-V. You can see the Linux VM by opening up Hyper-V manager on your Windows OS.


## Next Steps
- Get a quick tour of Azure ML Workbench with [_Quickstart: Classifying Iris Flower Dataset_](quick-start-iris.md).
- Walk through an extensive tutorial [_Classifying Iris_](tutorial-classifying-iris-part-1.md).
- Learn about Azure ML Workbench data preparation capabilities through the [_Preparing Bike Share Dataset_](tutorial-bikeshare-dataprep.md) tutorial.
