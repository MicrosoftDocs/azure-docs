---
title: Quickstart article for Visual Studio Tools for Machine Learning on Azure | Microsoft Docs
description: This article describe how to get started using Visual Studio Tools for Machine Learning, from creating an experiment, training a model, and operationalizing a web-service.
services: machine-learning
author: ahgyger
ms.author: ahgyger
manager: haining
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: get-started-article
ms.date: 11/15/2017
---

# Tools for AI 
Azure Machine Learning services offers extensions for Visual Studio and Visual Studio Code. Namely, Visual Studio Code Tools for AI and Visual Studio Tools for AI. 

## Visual Studio Code Tools for AI
Visual Studio Code Tools for AI is a development extension to build, test, and deploy Deep Learning / AI solutions. It features a seamless integration with Azure Machine Learning, notably a run history view, detailing the performance of previous trainings and custom metrics. It offers a samples explorer view, allowing to browse and bootstrap new project with  [Microsoft Cognitive Toolkit (previously known as CNTK)](http://www.microsoft.com/en-us/cognitive-toolkit), [Google TensorFlow](https://www.tensorflow.org), and other deep-learning framework. Finally, it provides an explorer for compute targets, which enables you to submit jobs to train models on remote environments like Azure Virtual Machines or Linux servers with GPU. 
 
### Getting started 
To get started, you first need to download and install [Visual Studio Code](https://code.visualstudio.com/Download). Once you have Visual Studio Code open, do the following steps:
1. Click on the extension icon in the activity bar. 
2. Search for "Visual Studio Code Tools for AI". 
3. Click on the **Install** button. 
4. After installation, click on **Reload** button. 

Once Visual Studio Code is reloaded, the extension is active. [Learn more about installing extensions](https://code.visualstudio.com/docs/editor/extension-gallery).

### Exploring project samples
Visual Studio Code Tools for AI comes with a samples explorer. The samples explorer makes it easy to discover sample and try them with only a few clicks. 
To open the explorer, do as follow:   
1. Open the command palette (View > **Command Palette** or **Ctrl+Shift+P**).
2. Enter "AI Sample". 
3. You get a recommendation for "AI: Open Azure ML Sample Explorer", select it and press enter. 

Alternatively, you can click on the samples explorer icon.

### Creating a new project from the sample explorer 
You can browse different samples and get more information about them. Let's browse until finding the "Classifying Iris" sample. 
To create a new project based on this sample do the following:
1. Click install button on the project sample, notice the commands being prompted, walking you through the steps of creating a new project. 
2. Pick a name for the project, for example "Iris".
3. Choose a folder path to create your project and press enter. 
4. Select an existing workspace and press enter.

The project will then be created.

> [!TIP]
> You will need to be logged-in to access your Azure resource. From the embedded terminal enter "az login" and follow the instruction. 

### Submitting experiment with the new project
The new project being open in Visual Studio Code, we submit a job to our different compute target (local and VM with docker).
Visual Studio Code Tools for AI provides multiple ways to submit an experiment. 
1. Context Menu (right click) - **AI: Submit Job**.
2. From the command palette: "AI: Submit Job".
3. Alternatively, you can run the command directly using Azure CLI, Machine Learning Commands, using the embedded terminal.

Open iris_sklearn.py, right click and select **AI: Submit Job**.
1. Select your platform: "Azure Machine Learning".
2. Select your run-configuration: "Docker-Python."

> [!NOTE]
> If it is the first time your submit a job, you receive a message "No Machine Learning configuration found, creating...". A JSON file is opened, save it (**Ctrl+S**).

Once the job is submitted, the embedded-terminal displays the progress of the runs. 

### View list of jobs
Once the jobs are submitted, you can list the jobs from the run history.
1. Open the command palette (View > **Command Palette** or **Ctrl+Shift+P**).
2. Enter "AI List."
3. You get a recommendation for "AI: List Jobs", select and press enter.

The Job List View opens and displays all the runs and some related information.

### View job details
With the Job List View still open, click on the first run in the list.
To deep dive into the results of a job, click on the top **job ID** to see detailed information. 

## Visual Studio Tools for AI
Visual Studio Tools for AI is a development extension to build, test, and deploy Deep Learning / AI solutions. It features a seamless integration with Azure Machine Learning, notably a run history view, detailing the performance of previous trainings and custom metrics. It offers a samples explorer view, allowing to browse and bootstrap new project with  [Microsoft Cognitive Toolkit (previously known as CNTK)](http://www.microsoft.com/en-us/cognitive-toolkit), [Google TensorFlow](https://www.tensorflow.org), and other deep-learning framework. Finally, it provides an explorer for compute targets, which enables you to submit jobs to train models on remote environments like Azure Virtual Machines or Linux servers with GPU. It also provide a facilitated access to [Azure Batch AI (Preview)](https://docs.microsoft.com/en-us/azure/batch-ai/).
 
### Getting started 
To get started, you first need to download and install [Visual Studio](https://www.visualstudio.com/downloads/). Once you have Visual Studio open, do the following steps:
1. Click on the menu bar in Visual Studio and select "Extensions and Updates...".
2. Click on "Online" tab and select "Search Visual Studio Marketplace".
3. Search for "Visual Studio for AI". 
3. Click on the **Download** button. 
4. After installation, restart Visual Studio. 

Once Visual Studio is reloaded, the extension is active. [Learn more about finding extensions](hhttps://docs.microsoft.com/en-us/visualstudio/ide/finding-and-using-visual-studio-extensions).

> [!NOTE]
> Visual Studio Tools for AI needs Visual Studio 2015 or 2017, professional or enterprise edition. It does not support Apple OSX version. 


### Exploring project samples
Visual Studio Tools for AI comes with a samples explorer. The samples explorer makes it easy to discover sample and try them with only a few clicks. 
To open the explorer, do as follow:   
1. In the menu bar, click on **AI Tools**.
2. Click on "Azure Machine Learning Gallery".
3. This will open a tab with all the Azure ML Samples. 

### Creating a new project from the sample explorer 
You can browse different samples and get more information about them. Let's browse until finding the "Classifying Iris" sample. 
To create a new project based on this sample do the following:
1. Click on **install** button on the project sample, this will open a new dialogue. 
2. Select a resource group, an account, and a workspace.
3. You can leave project type as General.
4. Enter a project path and a name to create your project and press enter. 
5. An explorer will open prompting to save a solution, click save. 

The project will then be created and a new instance of Visual Studio will be open with the solution. 

> [!TIP]
> You will need to be logged-in to access your Azure resource. From the embedded terminal enter "az login" and follow the instruction. 

### Submitting experiment with the new project
The new project being open in Visual Studio, we submit a job to our different compute target (local and VM with docker).
To submit the job, do as follow: 
1. From the solution explorer, right click on the file you want to submit, and select **Set as Startup File**.
2. Select the project name, right click and select **Submit Job...**
3. A new dialogue will open, letting you choose the cluster (or compute target) to execute your script.
4. Click on **Submit**

Once the job is submitted, the embedded-terminal displays the progress of the runs and will close upon completion.

### View list of jobs
Once the jobs are submitted, you can list the jobs from the run history.
1. In **Server Explorer**, click on **AI Tools**.
2. Then select **Azure Machine Learning**
3. Click on the **Jobs** menu.

The Job explorer list all the submitted experiment for this project. 

### View job details
With the Job explorer view still open, click on the first run in the list.
This will load the Job Summary panel, and the Logs and Outputs panel.

## Next steps
> [!div class="nextstepaction"]
> [How to configure Azure Machine Learning to work with an IDE](./how-to-configure-your-IDE.md)
