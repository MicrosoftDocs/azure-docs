---
title: Quickstart article for Visual Studio Code Tools for Machine Learning | Microsoft Docs
description: This sarticle describe how to get started using Visual Studio Code Tools for Machine Learning, from creating an experiment, training a model, and operationalizing a web-service.
services: machine-learning
author: ahgyger
ms.author: ahgyger
manager: haining
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: get-started-article
ms.date: 09/12/2017
---

# Visual Studio Code Tools for Machine Learning
Visual Studio Code Tools for Machine Learning is a development extension to build, test, and deploy Deep Learning / AI solutions. It features a seamless integration with Azure Machine Learning, notably a run history view, detailing the performance of previous trainings and custom metrics. It offers a gallery view, allowing to browse and bootstrap new project with CNTK, TensorFlow, and other deep-learning framework. It also provides an explorer for compute targets.  
 
## Getting started 
To get started, you first need to download and install [Visual Studio Code](https://code.visualstudio.com/Download). Once you have Visual Studio Code open, do the following steps:
1. Click on the extension icon in the activity bar (it's the last one). 
2. Search for "Visual Studio Code Tools for Machine Learning". 
3. Click on the **Install** button. 
4. After installation, click on **Reload** button. 

Once Visual Studio Code is reladed, the extension will be activated. 

## Browsing available gallery sample
Visual Studio Code Tools for Machine Learning comes with a gallery explorer. To open the gallery, do as following:   
1. Open the command palette (View > **Command Palette** or **Ctrl+Shift+P**).
2. Enter "ML Gallery". 
3. You will get a recommandation for "Machine Learning: Open Azure Machine Learning Gallery", press enter. 

## Creating a new project from the gallery 
You can browse different samples and get more information about them. Let browse until finding the "MNIST CNTK" sample. To create a new project based on this sample do the following:
1. Click install on the project sample, notice the commands being prompted, walking you the steps of creating a new project. 
2. Choose a name for the project, enter "MNIST with CNTK".
3. Choose a folder path to create your project and press enter. 
4. Select an existing workspace and press enter.

The project will then be created.

## Submitting experiment with the new project
The new project being open, we will submit a job to our different compute target (local and VM with docker).
Visual Studio Code Tools for Machine Learning provides multiple ways to submit an experiment. 
1. Context Menu (right click) - **Machine Learning: Submit Job**.
2. From the command palette: "Machine Learning: Submit Job".
3. Alternatively, you can run the command directly using Azure CLI, Machine Learning Commands, using the embedded terminal.

Submit regression.py to both your local compute target and to your local Docker. 

## View list of jobs
Once the job are submitted, you can list the jobs from the run history.

## View job details
 




Open your web browser, and navigate to the [Microsoft Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create an Azure Machine Learning Server
1. Fill in the details:

   ![This image is a screenshot. Put alt-text here.](media/doc-template-quickstart/1-machine-learning-image.png)

This table is the kind of table to use following a screenshot to describe how to fill in the form seen in the screenshot. 

Setting|Suggested value|Description
---|---|---
Server name |*example-name*|Choose a unique name that identifies your Azure Machine Learning server.
Subscription|*Your subscription*|The Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the appropriate subscription in which the resource is billed for.
Resource Group|*myresourcegroup*| You may make a new resource group name, or use an existing one from your subscription.
Server admin login |*mylogin*| Make your own login account to use when connecting to the server. 

  > [!IMPORTANT]
  > The server admin login and password that you specify here are required to log in to the server and its databases later in this Quickstart. Remember or record this information for later use.

## Example command using a bash shell comment

A code block you could use.
```bash
tool --switch1 value2 --switch2 value2
```

The table describes the switched used in the preceding command: 

tool parameter |Suggested value|Description
---|---|---
--switch1 | *given value* | Specify the first parameter to use with the tool.
--switch1 | *given value* | Specify the first parameter to use with the tool.

Example tool output:
```bash
Something happened. 
```

> [!TIP]
> You can put a tip or important message here.


## Clean up resources
Clean up the resources you created in the quickstart either by deleting the [Azure resource group](../../azure-resource-manager/resource-group-overview.md), which includes all the resources in the resource group, or by deleting the one server resource if you want to keep the other resources intact.

> [!TIP]
> Other Quickstarts in this collection build upon this quick start. If you plan to continue on to work with subsequent quickstarts, do not clean up the resources created in this quickstart. If you do not plan to continue, use the following steps to delete resources created by this quickstart in the Azure portal.

To delete the entire resource group including the newly created server:
1.	Locate your resource group in the Azure portal. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of your resource group, such as our example **myresourcegroup**.
2.	On your resource group page, click **Delete**. Then type the name of your resource group, such as our example **myresourcegroup**, in the text box to confirm deletion, and then click **Delete**.

Or instead, to delete the newly created server:
1.	Locate your server in the Azure portal, if you do not have it open. From the left-hand menu in Azure portal, click **All resources**, and then search for the server you created.
2.	On the **Overview** page, click the **Delete** button on the top pane.
3.	Confirm the server name you want to delete.
 
## Next steps
> [!div class="nextstepaction"]
> [What article is next in sequence](./doc-template-quickstart.md)
