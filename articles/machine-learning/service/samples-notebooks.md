---
title: Example Jupyter notebooks
titleSuffix: Azure Machine Learning service
description: Find and use example Jupyter notebooks to explore the Azure Machine Learning service in Python. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: sample

author: sdgilley
ms.author: sgilley
ms.reviewer: sgilley
ms.date: 12/04/2018
ms.custom: seodec18
#Customer intent: As a professional data scientist, I can build an image classification model with Azure Machine Learning using Python in a Jupyter notebook.
---

# Use Jupyter notebooks to explore Azure Machine Learning service

For your convenience, we have developed a series of Jupyter Python notebooks you can use to explore the Azure Machine Learning service. 

Learn how to use the service with the documentation on this site and use these notebooks to customize them to your situation. 

Use one of the paths below to run a notebook server with these sample notebooks.  Once the server is running, find tutorial notebooks in **tutorials** folder, or explore different features in **how-to-use-azureml** folder.


## Try Azure Notebooks: Free Jupyter notebooks in the cloud

It's easy to get started with Azure Notebooks! The [Azure Machine Learning SDK for Python](https://aka.ms/aml-sdk) is already installed and configured for you on [Azure Notebooks](https://notebooks.azure.com/). The installation and future updates are automatically managed via Azure services.
  
[!INCLUDE [aml-azure-notebooks](../../../includes/aml-azure-notebooks.md)]


## Use a Data Science Virtual Machine (DSVM)

The [Azure Machine Learning SDK for Python](https://aka.ms/aml-sdk) and notebook server are already installed and configured for you on a DSVM. 

After you [create a DSVM](how-to-configure-environment.md#dsvm), use these steps on the DSVM to run the notebooks.

[!INCLUDE [aml-dsvm-server](../../../includes/aml-dsvm-server.md)]


## Use your own Jupyter notebook server

Use these steps to create a local Jupyter Notebook server on your computer.

[!INCLUDE [aml-your-server](../../../includes/aml-your-server.md)]

The quickstart instructions will install the packages you need to run the quickstart and tutorial notebooks.  Other sample notebooks may require installation of additional components.  For more information about these components, see [Install the Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/install).

<a name="automated-ml-setup"></a>

## Automated machine learning setup 

_These steps apply only to the notebooks in the **how-to-use-azureml/automated-machine-learning** folder._

While you can use any of the above options, you can also install the environment and create a workspace at the same time with the following instructions. 

1. Install [Mini-conda](https://conda.io/miniconda.html). Choose 3.7 or higher. Follow prompts to install. 
   >[!NOTE]
   >You can use an existing conda as long as it is version 4.4.10 or later. Use `conda -V` to display the version. You can update a conda version with the command: `conda update conda`. There's no need to install mini-conda specifically.

1. Download the sample notebooks from [GitHub](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/automated-machine-learning
) as a zip and extract the contents to a local directory. The Automated machine learning notebooks are in the `how-to-use-azureml/automated-machine-learning` folder.

1. Set up a new Conda environment. 
   1. Open a Conda prompt on your local machine.
   
   1. Navigate to the files you extracted to your local machine.
   
   1. Open the **automated-machine-learning** folder.
   
   1. Execute `automl_setup.cmd` in  the conda prompt for Windows, or the `.sh` file for your operating system. It can take about 10 minutes to execute.

      The setup script:
      + Creates a new conda environment
      + Installs the necessary packages
      + Configures the widget
      + Starts a jupyter notebook
      
   >[!NOTE]
   > The script takes the conda environment name as an optional parameter. The default conda environment name is `azure_automl`. The exact command depends on the operating system. This is useful if you are creating a new environment or upgrading to a new version. For example you can use 'automl_setup.cmd azure_automl_sandbox' to create an evironment name azure_automl_sandbox. 
      
1. Once the script has completed, you will see a Jupyter notebook home page in your browser.

1. Navigate to the path where you saved the notebooks. 

1. Open the automated-machine-learning folder, then open the **configuration.ipynb** notebook. 

1. Execute the cells in the notebook to register Machine Learning Services Resource Provider and create a workspace.

You are now ready to open and run the notebooks saved on your local machine.


## Next steps

Explore the [GitHub notebooks repository for Azure Machine Learning service](https://aka.ms/aml-notebooks)

Try these tutorials:
+ [Train and deploy an image classification model with MNIST](tutorial-train-models-with-aml.md)

+ [Prepare data and use automated machine learning to train a regression model with the NYC taxi data set](tutorial-data-prep.md)
