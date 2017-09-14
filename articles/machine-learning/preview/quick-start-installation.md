---
title: Installation Quickstart for Azure Machine Learning server | Microsoft Docs
description: This Quickstart shows how to provision Azure Machine Learning resources, and how to install Azure Machine Learning Workbench.
services: machine-learning
author: hning86
ms.author: haining, raymondl, chhavib
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: hero-article
ms.date: 09/14/2017
---
# Provision and install Azure Machine Learning preview features
Azure Machine Learning is an integrated, end-to-end data science and advanced analytics solution for professional data scientists to prepare data, develop experiments and deploy models at cloud scale.

This Quickstart shows you how to create experimentation and model management accounts in Azure Machine Learning. It shows you how to install the Azure Machine Learning Workbench desktop application and CLI tools.

## Prerequisites
* An Azure account - you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Use your own client machine for the installing Azure ML Workbench locally. Currently the Azure Machine Learning Workbench can be installed on the following operating systems only:
   * Windows 10 or Windows Server 2016 
   * macOS Sierra (or newer)

### Optional prerequisites
* Local Docker engine for running dev/test scenarios locally.
* Access to an Ubuntu Linux VM for scale-up computation.
* Access to HDInsight for Spark cluster for scale-out computation.
* Access to an Azure Container Service (ACS) Kubernetes cluster for scale-out model deployment.
* Docker must be installed on local machine for local web service deployment.

## Provision Azure Machine Learning accounts
Use the Azure portal to provision Azure Machine Learning accounts. 
1. Go to the Azure portal. [http://portal.azure.com](http://portal.azure.com). 

2. Enter your credentials to sign in to the portal. 

3. Select the **New** button (+) in the upper-left corner of the portal.

4. Type in `Machine Learning` into the search bar. Select the search result named **ML Experimentation (preview)**. 

5. Click **Create** to open the form to configuring a new Machine Learning Experimentation account. 

6. Fill out the Machine Learning Experimentation form with the following information:

   Setting|Suggested value|Description
   ---|---|---
   Experimentation account name | _Unique name_ |Choose a unique name that identifies your account. You could use your own name, or a departmental or project name that best identifies the experiment.
   Subscription |_Your subscription_|The Azure subscription that you want to use for your experiment. If you have multiple subscriptions, choose the appropriate subscription in which the resource is billed for.
   Resource Group |_Your resource group_| You may make a new resource group name, or use an existing one from your subscription.
   Location |_The region closest to your users_| Choose the location that's closest to your users and the data resources.
   Number of seats | 2 | Type the number of seats. This selection impacts the [pricing](https://azure.microsoft.com/pricing/details/machine-learning/). The first two seats are free. 
   Storage Account |_Unique name_| Choose **Create new** and provide a name  to create a new Azure storage account, or choose **Use existing** and select your existing storage account from the drop-down. The storage account is required and is used to hold project artifacts and run history data. 
   Workspace for Experimentation account |_Unique name_| If you have an existing workspace, the value will be prepopulated. If you do not have an existing workspace, type a name for the new workspace.
   Assign owner for the workspace |Your account| Select your own account as the workspace owner.
   Create Model Management Account |*check*| As part of the Experimentation account creation experience, you have the option of also creating the Machine Learning Model Management account. This resource is used once you are ready to deploy and manage your models as real-time web services. We recommend creating the Model Management account at the same time as the Experimentation account.
   Account Name | mymodelmanagement | Choose a unique name that identifies your Model Management account. 
   Model Management pricing tier |  | Click **No pricing tier selected** to specify the pricing tier for your new Model Management account. Click **Ok** to save the pricing tier selection. 
   Pin to dashboard | Check | Check the **Pin to dashboard** option to allow easy tracking of your Machine Learning Experimentation account on the front dashboard page of your Azure portal.

7. Click **Create** to begin the creation process.
 
8. On the upper right of the Azure portal toolbar, click **Notifications** (bell icon) to monitor the deployment process. 

Depending on which operating system you use on your local computer, follow one of the next two sections to install Azure ML Workbench on your computer. 

## Install Azure ML Workbench on Windows operating system
Install the Azure Machine Learning Workbench on your computer running Windows 10, Windows Server 2016, or newer.
1. Download the latest Azure ML Workbench installer
[AmlWorkbenchSetup.exe](https://vienna.blob.core.windows.net/windows/AmlWorkbenchSetup.exe)

2. Double-click the downloaded installer `AmlWorkbenchSetup.exe`. 

3. Finish the installation by following the on-screen instructions.

4. Azure ML Workbench is installed in the following directory on your account user profile: `C:\Users\<username>\AppData\Local\AmlWorkbench`

## Install Azure ML Workbench on macOS operating system.
Install the Azure Machine Learning Workbench on your computer running macOS Sierra or newer.
1. Download the latest Azure ML Workbench installer
[AmlWorkbench.dmg](https://vienna.blob.core.windows.net/osx/AmlWorkbench.dmg)

2. If you are using Python greater than 3.5, you need to execute this command to enable the correct certificates. 

   ```bash
   $ /Applications/Python\ 3.6/Install\ Certificates.command
   ```

3. Double-click the downloaded installer `AmlWorkbench.dmg`.

4. Finish the installation by following the on-screen instructions.

5. Azure ML Workbench is installed in the following directory: `/Applications/AmlWorkbench.app`

## Run Azure ML Workbench to log in the first time
1. Click on the **Launch Azure ML Workbench** button when the installation process is complete. If you close the installer, you can still find the shortcut to the Machine Learning Workbench on your desktop named **Azure Machine Learning Workbench**. Double-click it to open the app.

2. Log in to the Workbench using the same account you used earlier to provision your Azure resources. 

3. When the login process has succeeded, ML Workbench attempts to find the ML Experimentation accounts you created earlier. It searches within the entire set of Azure subscriptions to which your credentials are attached. When at least one ML Experimentation Account is found, Azure ML Workbench loads that account. It lists the Workspaces and Projects found in that account. 

Once the installation process is complete and you log in successfully, move on to installing optional components.

### Install optional components
Azure ML Workbench can run experiments in various compute targets. To use these execution targets, install additional components, and create or obtain access to additional computation resources in Azure:
* Execute on your local **Windows or macOS computer**
   * There is no additional requirements.
* Execute in a **local Docker container**
   * You must have Docker engine installed and running. Follow [Docker installation instructions](https://docs.docker.com/engine/installation/) to install Docker on your operation system.
* Execute in a **Docker container on a remote Linux machine**
   * You must have SSH access (username and password) to the Linux VM, and you must have Docker engine installed and running on that machine.
   * We recommend you [create a Ubuntu-based DSVM (Data Science Virtual Machine) on Azure](../data-science-virtual-machine/dsvm-ubuntu-intro.md), which has Docker pre-installed so it is ready to go.
* Execute in an **HDInsight Spark cluster**
   * You must have SSH access (username and password) to the head node of that HDInsight Spark cluster. Here are the instructions on [provisioning a HDInsight Spark cluster](../../hdinsight/hdinsight-apache-spark-jupyter-spark-sql.md).
* Deploy a web service to run locally on your machine
   * This requires a local Docker installation. Follow [Docker installation instructions](https://docs.docker.com/engine/installation/) to install Docker on your operation system.
* Deploy a web service to run in an Azure Container Service Kubernetes cluster
   * You can set up the cluster in advance, or use Model Management CLI setup command to create it for you.

#### Special note on Docker for Windows 
You need Docker to execute scripts in a local Docker container, or to deploy model via a containerized web service locally. We have some tips for installing and configuring Docker for Azure Machine Learning on Windows.  Make sure you follow these instructions:
- Only Windows 10 is supported for running Docker for Windows.
- Install [Docker for Windows](https://docs.docker.com/docker-for-windows/install/) and have it up and running.
- Make sure your Docker engine is running in [Linux Container mode](https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers).
- Optionally, for better execution performance, share C drive (or whichever drive the system _%temp%_ folder is) in the Docker for Windows configuration.

> [!NOTE]
> When using Docker on Windows, the Docker container runs inside of a guest Linux VM on the Windows host via Hyper-V. You can see the Linux VM by opening up Hyper-V manager on your Windows OS.

## Next steps
You have now successfully installed the Workbench desktop app and command-line interface. Follow the classifying iris Quickstart to get a tour of the Azure ML preview feature experience.

> [!div class="nextstepaction"]
> [Quickstart: classifying iris flower dataset](quick-start-iris.md)