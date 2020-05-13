---
title: 'Quickstart: Create a Geo AI Data Science Virtual Machine'
titleSuffix: Azure Data Science Virtual Machine 
description: Configure and create a Geo AI Data Science Virtual Machine on Azure for geospatial analytics and machine learning.
ms.service: machine-learning
ms.subservice: data-science-vm

author: gvashishtha
ms.author: gopalv
ms.topic: quickstart
ms.date: 09/13/2019

# Customer intent: As a data scientist, I want to learn how to provision the Windows DSVM so that I can move my existing workflow to the cloud.
---

# Quickstart: Set up a Geo Artificial Intelligence Virtual Machine on Azure 

The Geo AI Data Science Virtual Machine (Geo-DSVM) is an extension of the popular [Azure Data Science Virtual Machine](https://aka.ms/dsvm) that's specially configured to combine AI and geospatial analytics. The geospatial analytics in the VM are powered by [ArcGIS Pro](https://www.arcgis.com/features/index.html). The Data Science Virtual Machine (DSVM) enables the rapid training of machine-learning and even deep-learning models. To develop these models, it uses data that's enriched with geographic information. The Geo-DSVM is supported on Windows 2016 DSVM only. ​

The AI tools that are included in the Geo-DSVM include the following:

- GPU editions of popular deep-learning frameworks like Microsoft Cognitive Toolkit, TensorFlow, Keras, Caffe2, and Chainer
- Tools to acquire and preprocess image and textual data
- Tools for development activities such as Microsoft Machine Learning Server Developer Edition, Anaconda Python, Jupyter notebooks for Python and R, IDEs for Python and R, and SQL databases
- ArcGIS Pro desktop software from ESRI, along with Python and R interfaces that can work with the geospatial data from your AI applications
 

## Create your Geo AI Data Science VM

To create an instance of the Geo AI Data Science VM, follow these steps:

1. Go to the virtual machine listing on the [Azure portal](https://ms.portal.azure.com/#create/microsoft-ads.geodsvmwindows).
1. Select **Create** at the bottom to generate a wizard:

   ![create-geo-ai-dsvm](./media/provision-geo-ai-dsvm/Create-Geo-AI.png)

1. The wizard requires input for each of the four steps. For detailed information about this input, see the following section.

### Wizard details ###

**Basics**:

- **Name**: The name of the data science server you're creating.
    
- **User name**: Admin account sign-in ID.
    
- **Password**: Admin account password.
    
- **Subscription**: If you have more than one subscription, select the one on which the machine is to be created and billed.
    
- **Resource group**: You can create a new one or use an **empty** existing Azure resource group in your subscription.
    
- **Location**: Select the data center that is most appropriate. Typically, it's the one that has most of your data or that's closest to your physical location for fastest network access. If you plan to run deep learning on a GPU, you must choose one of the locations in Azure that has NC-Series GPU VM instances. Currently those locations are: **East US, North Central US, South Central US, West US 2, North Europe, West Europe**. For the latest list, check the [Azure Products by Region](https://azure.microsoft.com/regions/services/) page and look for **NC-Series** under **Compute**. 
    
    
**Settings**: Select one of the NC-Series GPU virtual machine sizes if you plan to run deep learning on a GPU on your Geo DSVM. Otherwise, you can choose one of the CPU-based instances. Create a storage account for your VM. 
       
**Summary**: Verify that all the information you entered is correct.
    
**Buy**: To start the provisioning process, click **Buy**. A link is provided to the terms of the service. The VM doesn't have any additional charges beyond the compute charges for the server size you chose in the **Size** step. 
 
 >[!NOTE]
 > Provisioning should take about 20 to 30 minutes. The status of the provisioning is displayed on the Azure portal.

 
## How to access the Geo AI Data Science Virtual Machine

 After your VM is created, you're ready to start using the tools that are installed and preconfigured on it. There are Start menu tiles and desktop icons for many of the tools. You can access the VM by remote desktop by using the Admin account credentials that you configured in the **Basics** section.

 
## Using ArcGIS Pro installed in the VM

On the Geo-DSVM, ArcGIS Pro desktop is preinstalled and the environment is preconfigured to work with all the tools in the DSVM. When you start ArcGIS, you're prompted for credentials to your ArcGIS account. If you already have an ArcGIS account and have licenses for the software, you can use your existing credentials.  

![Arc-GIS-Logon](./media/provision-geo-ai-dsvm/ArcGISLogon.png)

Otherwise, you can sign up for a new ArcGIS account and license, or get a [free trial](https://www.arcgis.com/features/free-trial.html). 

![ArcGIS-Free-Trial](./media/provision-geo-ai-dsvm/ArcGIS-Free-Trial.png)

After you sign up for either a standard ArcGIS account or a free trial, you can authorize ArcGIS Pro for your account by following the instructions at [Getting started with ArcGIS Pro](https://www.esri.com/library/brochures/getting-started-with-arcgis-pro.pdf).

After you sign in to the ArcGIS Pro desktop through your ArcGIS account, you're ready to start using the data science tools that are installed and configured on the VM for your geospatial analytics and machine-learning projects.

## Next steps

Start using the Geo AI Data Science VM with guidance from the following resource:

* [Use the Geo AI Data Science VM](use-geo-ai-dsvm.md)
