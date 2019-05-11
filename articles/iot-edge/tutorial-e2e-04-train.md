---
title: Train and deploy a model - Machine Learning on Azure IoT Edge | Microsoft Docs 
description: This walk-through use Azure Notebooks first to train a machine learning model using Azure Machine Learning and then to package the model as a container image that can be deployed as an Azure IoT Edge Module.
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 02/20/2019
ms.topic: tutorial
ms.service: iot-edge
services: iot-edge
---

# Tutorial: Train and deploy an Azure Machine Learning model

In this section, we use Azure Notebooks first to train a machine learning model using Azure Machine Learning and then to package the model as a container image that can be deployed as an Azure IoT Edge Module. The Azure Notebooks takes advantage of an Azure Machine Learning service workspace, which is a foundational block used to experiment, train, and deploy machine learning models.

The activities in this section are broken up across two notebooks.

* **01-turbofan\_regression.ipynb:** This notebook walks through the steps to train and publish a model using Azure Machine Learning. Broadly, the steps involved are:
    
    1.  Download, prepare, and explore the training data
    2.  Use the service workspace to create and run an ML experiment
    3.  Evaluate the model results from the experiment
    4.  Publish the best model to the service workspace

* **02-turbofan\_deploy\_model.ipynb:** This notebook takes the model created in the previous notebook and uses it to create a container image ready to be deployed to an Azure IoT Edge device.
    
    1.  Create a scoring script for the model
    2.  Create and publish the image
    3.  Deploy the image as a web service on Azure Container Instance
    4.  Use the web service to validate the model and the image work as expected

The steps in this section might be typically performed by data scientists.

## Set up Azure Notebooks 

We use Azure Notebooks to host the two Jupyter Notebooks and supporting files. Here we create and configure an Azure Notebooks project. If you have not used Jupyter and/or Azure Notebooks, here are a couple of introductory documents:

* **Quickstart:** [Create and share a notebook](../notebooks/quickstart-create-share-jupyter-notebook.md)
* **Tutorial:** [Create and run a Jupyter notebook with Python](../notebooks/tutorial-create-run-jupyter-notebook.md)

As with the developer virtual machine before, using Azure notebooks ensures a consistent environment for the exercise.

> [!NOTE]
> Once set up, the Azure Notebooks service can be accessed from any machine. During setup, you should use the development virtual machine, which has all of the files that you will need.

### Create an Azure Notebooks account

Azure Notebook accounts are independent from Azure subscriptions. To use Azure Notebooks, you need to create an account.

1.  Navigate to [Azure notebooks](http://notebooks.azure.com).

2.  Click **Sign In** in the upper, right-hand corner of the page.

3.  Sign in with either your work or school account (Azure Active Directory) or your personal account (Microsoft Account).

4.  If you have not used Azure Notebooks before, you will be prompted to grant access for the Azure Notebooks app.

5.  Create a user ID for Azure Notebooks.

    ![Create a user ID](media/tutorial-e2e-04-train/04-train-a.png)

### Upload Jupyter notebooks files

In this step, we create a new Azure Notebooks project and upload files to it. Specifically, the files that we upload are:

* **01-turbofan\_regression.ipynb**: Jupyter notebook file that walks through the process of downloading the device harness generated data from the Azure storage account; exploring and preparing the data for training the classifier; training the model; testing the data using the test dataset found in the Test\_FD003.txt file; and, finally saving the classifier model in the Machine Learning service workspace.

* **02-turbofan\_deploy\_model.ipynb:** Jupyter notebook that guides you through the process of using the classifier model saved in the Machine Learning service workspace to produce a container image. Once the image is created, the notebook walks you through the process of deploying the image as a web service so that you can validate it is working as expected. This validated image will be deployed to our edge device in the [Create IoT Edge Modules](#section) section.

* **Test\_FD003.txt:** This file contains the data we will use as our test set when validating our trained classifier. We chose to use the test data as provided for the original contest as our test set for simplicity of the example.

* **RUL\_FD003.txt:** This file contains the RUL for the last cycle of each device in the Test\_FD003.txt file. See the **readme.txt** and the **Damage Propagation Modeling.pdf** files in the C:\\source\\IoTEdgeAndMlSample\\data\\Turbofan for a detailed explanation of the data.

* **Utils.py:** Contains a set of Python utility functions for working with data. The first notebook contains a detailed explanation of the functions.

* **README.md:** Readme describing the use of the notebooks.


Create a new project and upload the files to your notebook.

1.  Select **My Projects** from the top menu bar.

1.  Select **+ New Project**. Provide a name and an ID. There is no need for the project to be public or to have a readme.

1. Select **Upload** and choose **From Computer**.

1. Select **Choose files**.

1. Navigate to **C:\source\IoTEdgeAndMlSample\AzureNotebooks**. Select all files and click **Open**.

1. Select on **Upload**.

    ![Upload Azure Notebooks files to project](media/tutorial-e2e-04-train/04-train-b.png)

1. Select **Done**.

## Run Azure Notebooks

Now that that project is created, run the **01-turbofan\_regression.ipynb** notebook.

1. From the turbofan project page, select **01-turbofan\_regression.ipynb**.

    ![Select first notebook to run](media/tutorial-e2e-04-train/04-train-c.png)

2. If prompted, choose the Python 3.6 Kernel from the dialog and select **Set Kernel**.

3. If the notebook is listed as **Not Trusted**, click on the **Not Trusted** widget in the top right of the notebook. When the dialog comes up, select **Trust**.

4. Follow the instructions in the notebook.
    
    * `Ctrl + Enter` runs a cell.
    * `Shift + Enter` runs a cell and navigates to the next cell.
    * When a cell is running, it has an asterisk between the square brackets, like **[\*]**. When it is complete, the asterisk will be replaced with a number and relevant output may be appear below. Since cells often build on the work of the previous ones, only one cell can run at a time. 

5. When you have finished running the **01-turbofan\_regression.ipynb** notebook, return to the project page. 

6. Open **02-turbofan\_deploy\_model.ipynb** and repeat the steps in this section to run the second notebook.

## Next steps

In this section, we used two Jupyter Notebooks running in Azure Notebooks to use the data from the turbofan devices to train a remaining useful life (RUL) classifier, to save the classifier as a model, to create a container image, and to deploy and test the image as a web service.

Continue to the next section to create an IoT Edge device.

> [!div class="nextstepaction"] 
> [Configure an IoT Edge device](tutorial-e2e-05-configure.md)
