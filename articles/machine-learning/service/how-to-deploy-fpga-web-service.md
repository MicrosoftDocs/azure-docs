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

In this document, you learn how to set up your workstation environment and deploy a model as a web service. The web service uses Project Brainwave to run the model on field programmable gate arrays (FPGA).

Using FPGAs provides ultra-low latency inferencing, even with a single batch.

## Create an Azure Machine Learning Model Management account

1. Go to the Model Management Account creation page on the [Azure Portal](https://aka.ms/aml-create-mma).

2. In the portal, create a Model Management Account in the **East US** region.

   ![Image of the Create Model Management Account screen](media/how-to-deploy-fpga-web-service/azure-portal-create-mma.PNG)

3. Give your Model Management Account a name, choose a subscription, and choose a resource group.

   >[!IMPORTANT]
   >For Location, you MUST choose **East US** as the region.  No other regions are currently available.

4. Choose a pricing tier (S1 is sufficient, but S2 and S3 also work).  The DevTest tier is not supported.  

5. Click **Select** to confirm the pricing tier.

6. Click **Create** on the ML Model Management on the left.

## Get Model Management Account Information

To get information about your Model Management Account (MMA), click the __Model Management Account__ on the Azure portal.

Copy the values of the following items:

+ Model Management Account name (in on the upper left corner)
+ Resource group name
+ Subscription ID
+ Location (use "eastus2")

![Model Management Account info](media/how-to-deploy-fpga-web-service/azure-portal-mma-info.PNG)

## Set up your machine

To set up your workstation for FPGA deployment, use these steps:

1. Download and install the latest version of [Git](https://git-scm.com/downloads).

2. Install [Anaconda (Python 3.6)](https://conda.io/miniconda.html).

3. To download the Anaconda environment, use the following command from a Git prompt:

    ```
    git clone https://github.com/Azure/azure-ml-fast-ai
    ```

4. To create the environment, open an **Anaconda Prompt** (not an Azure Machine Learning Workbench prompt) and run the following command:

    > [!IMPORTANT]
    > The `aml-brainwave/environment.yml` path points to a file in the git repository you cloned in the previous step. Change the path as needed to point to the file on your workstation.

    ```
    conda env create -f azure-ml-fast-ai/environment.yml
    ```

5. To activate the environment, use the following command:

    ```
    conda activate amlrealtimeai
    ```

6. To start the Jupyter Notebook server, use the following command:

    ```
    jupyter notebook
    ```

    The output of this command is similar to the following text:

    ```text
    Copy/paste this URL into your browser when you connect for the first time, to login with a token:
        http://localhost:8888/?token=bb2ce89cc8ae931f5df50f96e3a6badfc826ff4100e78075
    ```

    If your browser does not automatically open to the Jupyter notebook, use the HTTP URL returned by the previous command to open the page.

    ![Image of the Jupyter Notebook web page](./media/how-to-deploy-fpga-web-service/jupyter-notebook.png)

## Deploy your model

From the Jupyter Notebook, open the `00_QuickStart.ipynb` notebook from the `/azure-ml-fast-ai/notebooks/resnet50` directory. Follow the instructions in the notebook to:

* Define the service
* Deploy the model
* Consume the deployed model
* Delete deployed services

> [!IMPORTANT]
> To optimize latency and throughput, your workstation should be in the same Azure region as the endpoint.  Currently the APIs are created in the East US Azure region.
