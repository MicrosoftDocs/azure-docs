---
title: "Azure Machine Learning service tutorials in Jupyter notebooks"
description: Find and use example Jupyter notebooks to explore the Azure Machine Learning service in Python. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: sample

author: sdgilley
ms.author: sgilley
ms.reviewer: sgilley
ms.date: 12/4/2018
#Customer intent: As a professional data scientist, I can build an image classification model with Azure Machine Learning using Python in a Jupyter notebook.
---

# Use Jupyter notebooks to explore Azure Machine Learning service


For your convenience, we have developed a series of Jupyter Python notebooks you can use to explore the Azure Machine Learning service. 

Learn how to use the service with the documentation on this site and use these notebooks to customize them to your situation. 

## Prerequisite

Complete the [Azure Machine Learning Python quickstart](quickstart-get-started.md) to create a workspace and launch Azure Notebooks.

## Try Azure Notebooks: Free Jupyter notebooks in the cloud

It's easy to get started with Azure Notebooks! The [Azure Machine Learning SDK for Python](https://aka.ms/aml-sdk) is already installed and configured for you on Azure Notebooks. The installation and future updates are automatically managed via Azure services.
  
+ To run the **core tutorial notebooks**:
  1. Go to [Azure Notebooks](https://notebooks.azure.com/).
    
  1. Find the **tutorials** folder in the  **Getting Started** library you created during the prerequisite quickstart.
    
  1. Open the notebook you want to run.
    
+ To run **other notebooks**:

  1. [Import the sample notebooks](https://aka.ms/aml-clone-azure-notebooks) into Azure Notebooks.

  1. Add a workspace configuration file to the library using either of these methods:
     + Copy the **config.json** file from the **Getting Started** Library into the new cloned library.

     + Create a new workspace using code in the [00.configuration.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/00.configuration.ipynb).
    
  1. Open the notebook you want to run.     


## Use a Data Science Virtual Machine (DSVM)

The [Azure Machine Learning SDK for Python](https://aka.ms/aml-sdk) and notebook server are already installed and configured for you on a DSVM. Use these steps run the notebooks.

1. [Create a DSVM](how-to-configure-environment.md#dsvm).

1. Clone [the GitHub repository](https://aka.ms/aml-notebooks).

1. Add a workspace configuration file to the library using either of these methods:
    * Copy the **aml_config\config.json** file you created using the prerequisite quickstart into the cloned directory.

    * Create a new workspace using code in the [00.configuration.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/00.configuration.ipynb).

1. Start the notebook server from your cloned directory.

## Use your own Jupyter notebook server

Use these steps to create a local Jupyter Notebook server on your computer.

1. Ensure you've completed the prerequisite quickstart in which you installed the Azure Machine Learning SDKs.

1. Clone [the GitHub repository](https://aka.ms/aml-notebooks).

1. Add a workspace configuration file to the library using either of these methods:
    * Copy the **aml_config\config.json** file you created using the prerequisite quickstart into the cloned directory.
    
    * Create a new workspace using code in the [00.configuration.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/00.configuration.ipynb).

1. Start the notebook server from your cloned directory.

1. Go to the folder containing the notebook.

1. Open the notebook.

<a name="auto"></a>

## Automated ML setup 

** These steps apply only to the notebooks in the `automated oml` folder.**

While you can use any of the above options, you can also install the environment and create a workspace at the same time with the following instructions. 

1. Install Mini-code from [here](https://conda.io/miniconda.html). Choose 3.7 or higher. Follow prompts to install. 
   >[!NOTE]
   >You can use an existing conda as long as it is version 4.4.10 or later. Use `conda -V` to display the version. You can update a conda version with the command: `conda update conda`. There's no need to install mini-conda specifically.

1. Download the sample notebooks from [Github](https://github.com/Azure/MachineLearningNotebooks/tree/master/automl) as a zip and extract the contents to a local directory. The Automated machine learning notebooks are in the `automl` folder.

1. Set up a new Conda environment. 
   1. Open a Conda prompt on your local machine. 
   
   1. Navigate to the files you extracted to your local machine. 
   
   1. Open the `automl` folder. 
   
   1. Execute `AutoMLSetup` in  the conda prompt. It can take about 10 minutes to execute.

      The automl/automl_setup script:
      + Creates a new conda environment
      + Installs the necessary packages
      + Configures the widget 
      + Starts a jupyter notebook
      
      The script takes the conda environment name as an optional parameter. The default conda environment name is `azure_automl`. The exact command depends on the operating system. 
      
      Once the script has completed, you will see a Jupyter notebook home page in your browser.

1. Navigate to the path where you saved the notebooks. 

1. Open the AutoML folder, then open the 00.configuration.ipynb notebook. 

1. Execute the cells in the notebook to register Machine Learning Services Resource Provider and create a workspace.

You are now ready to open and run the notebooks saved on your local machine.


## Next steps

Explore the [GitHub notebooks repository for Azure Machine Learning service](https://aka.ms/aml-notebooks)

Try these tutorials:
+ [Train and deploy an image classification model with MNIST](tutorial-train-models-with-aml.md)

+ [Prepare data and use automated machine learning to train a regression model with the NYC taxi data set](tutorial-data-prep.md)
