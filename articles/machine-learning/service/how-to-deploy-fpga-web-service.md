---
title: How to deploy a model as a web service on an FPGA with Azure Machine Learning 
description: Learn how to deploy a web service with a model running on an FPGA with Azure Machine Learning. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.reviewer: jmartens
ms.author: tedway
author: tedway
ms.date: 05/07/2018
---

# Deploy a model as a web service on an FPGA with Azure Machine Learning

This article describes how to set up your workstation environment and deploy a model as a web service on an FPGA (field programmable gate array).  Running the model on FPGAs provide ultra-low latency inferencing even with single batch size.

Azure Machine Learning Hardware Accelerated Models is powered by Project Brainwave running on Intel FPGAs.  Directly configuring the FPGA with the DNN (deep neural network) enable huge speed-ups in processing.

## Set up your machine

Follow these steps to set up your workstation for FPGA deployment.

1. Download and install [Git](https://git-scm.com/downloads) 2.16 or later

1. Open a Git prompt and clone this repo:

   `git clone https://github.com/Azure/aml-brainwave`

1. Install conda (Python 3.6) from https://conda.io/miniconda.html

1. Open an **Anaconda Prompt** (not an Azure Machine Learning Workbench prompt) and run the rest of the commands in the prompt.  
   Create the environment:

   `conda env create -f aml-brainwave/environment.yml`

1. Activate the environment:

   `conda activate azureml_fpga`

1. Launch the Jupyter notebook browser (if using Chrome, then copy and paste the URL with the notebook token into your browser).

   `jupyter notebook` 

1. In a browser, open the quickstart notebook from the [GitHub repo](https://aka.ms/aml-real-time-ai) in the notebooks/resnet50 folder.

## Create an Azure Machine Learning Model Management account

1. Go to the Model Management Account creation page on the [Azure Portal](https://aka.ms/aml-create-mma).
2. In the portal, create a Model Management Account  in the **East US** region.

   If you have an existing Model Management Account in the Azure **East US** region, you may skip this step.

   ![Create Model Management Account](media/how-to-deploy-fpga-web-service/azure-portal-create-mma.PNG)

1. Give your Model Management Account a name, choose a subscription, and choose a resource group.

   >[!IMPORTANT]
   >For Location, you MUST choose **East US** as the region.  No other regions are currently available.

1. Choose a pricing tier (S1 is sufficient, but S2 and S3 also work).  The DevTest tier is not supported.  
1. Click **Select** to confirm the pricing tier.
1. Click **Create** on the ML Model Management on the left.

## Get Model Management Account Information

When you need information about your Model Management Account (MMA), click the Model Management Account on the Azure Portal.

You need these items:
+ Model Management Account name (this is found on the upper left corner)
+ Resource group name
+ Subscription ID
+ Location (use "eastus2") in your code

![Model Management Account info](media/how-to-deploy-fpga-web-service/azure-portal-mma-info.PNG)

## Consume your model

Once your model is deployed, follow the instructions in the [sample notebooks](https://aka.ms/aml-real-time-ai) to consume the model.

Important: To optimize latency and throughput, your client should ideally be in the same Azure region as the endpoint.  Currently the APIs are created in the East US Azure region.
