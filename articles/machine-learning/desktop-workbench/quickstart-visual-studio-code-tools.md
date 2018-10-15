---
title: Quickstart article for Visual Studio Code Tools for Machine Learning on Azure | Microsoft Docs
description: This article describe how to get started using Visual Studio Code Tools for Machine Learning, from creating an experiment, training a model, and operationalizing a web-service.
services: machine-learning
author: chris-lauren
ms.author: clauren
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: mvc
ms.topic: quickstart
ms.date: 11/15/2017

ROBOTS: NOINDEX
---


# Visual Studio Code Tools for AI

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 

Visual Studio Code Tools for AI is a development extension to build, test, and deploy Deep Learning / AI solutions. It features a seamless integration with Azure Machine Learning, notably a run history view, detailing the performance of previous trainings and custom metrics. It offers a samples explorer view, allowing to browse and bootstrap new project with  [Microsoft Cognitive Toolkit (previously known as CNTK)](http://www.microsoft.com/cognitive-toolkit), [Google TensorFlow](https://www.tensorflow.org), and other deep-learning framework. Finally, it provides an explorer for compute targets, which enables you to submit jobs to train models on remote environments like Azure Virtual Machines or Linux servers with GPU. 
 
## Getting started 
To get started, you first need to download and install [Visual Studio Code](https://code.visualstudio.com/Download). Once you have Visual Studio Code open, do the following steps:
1. Click on the extension icon in the activity bar. 
2. Search for "Visual Studio Code Tools for AI". 
3. Click on the **Install** button. 
4. After installation, click on **Reload** button. 

Once Visual Studio Code is reloaded, the extension is active. [Learn more about installing extensions](https://code.visualstudio.com/docs/editor/extension-gallery).

## Exploring project samples
Visual Studio Code Tools for AI comes with a samples explorer. The samples explorer makes it easy to discover sample and try them with only a few clicks. 
To open the explorer, do as follow:   
1. Open the command palette (View > **Command Palette** or **Ctrl+Shift+P**).
2. Enter "AI Sample". 
3. You get a recommendation for "AI: Open Azure ML Sample Explorer", select it and press enter. 

Alternatively, you can click on the samples explorer icon.

## Creating a new project from the sample explorer 
You can browse different samples and get more information about them. Let's browse until finding the "Classifying Iris" sample. 
To create a new project based on this sample do the following:
1. Click install button on the project sample, notice the commands being prompted, walking you through the steps of creating a new project. 
2. Pick a name for the project, for example "Iris".
3. Choose a folder path to create your project and press enter. 
4. Select an existing workspace and press enter.

The project will then be created.

> [!TIP]
> You will need to be logged-in to access your Azure resource. From the embedded terminal enter "az login" and follow the instruction. 

## Submitting experiment with the new project
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

## View list of jobs
Once the jobs are submitted, you can list the jobs from the run history.
1. Open the command palette (View > **Command Palette** or **Ctrl+Shift+P**).
2. Enter "AI List."
3. You get a recommendation for "AI: List Jobs", select and press enter.

The Job List View opens and displays all the runs and some related information.

## View job details
With the Job List View still open, click on the first run in the list.
To deep dive into the results of a job, click on the top **job ID** to see detailed information. 

## Next steps
> [!div class="nextstepaction"]
> [How to configure Azure Machine Learning to work with an IDE](./how-to-configure-your-IDE.md)
