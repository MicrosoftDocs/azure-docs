---
title: 'ML Studio (classic): Migrate to Azure Machine Learning - reference'
description: the reference that details the difference of ML Studio classic and AML, that customer would pay attention during the migration process
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: how-to

author: zhanxia
ms.author: zhanixa
ms.date: 1/7/2021
---


# Migration reference

This article contains supplementary reference information to help you migrate from ML Studio (classic) to Azure Machine Learning. For instructions on how to perform the migration, see [Migrate to Azure Machine Learning](./migrate-to-aml.md).



## Import Data

In Studio (classic), ingesting data from cloud storage is done through the Import Data module. In the designer you have two options: register an Azure Machine Learning dataset, or use the Import Data module.

|Designer data ingestion method|Description|
|---| --- | --- |
|Register an AML dataset|Ingest data from local and online data sources (Blob, ADLS Gen1, ADLS Gen2, File share, SQL DB). Registering a dataset enables advanced data features like data versioning and data monitoring.
|Import Data module|Ingest data from online data sources (Blob, ADLS Gen1, ADLS Gen2, File share, SQL DB). The dataset is only imported to the designer.

We recommend registering datasets in Azure Machine Learning to enable advanced data features. However, the Import Data module can be used when those features are not required.

>[!Note]
> Studio (classic) users should note that the following cloud sources are not natively supported in Azure Machine Learning:
> - Hive Query
> - Azure Table
> - Azure Cosmos DB
> - On-premises SQL Database)
>
> We recommend that users migrate their data to supported storage services using Azure Data Factory.  

Use the following steps to ingest data from the cloud:
1. Create a datastore, which links the cloud storage service to your Azure Machine Learning workspace. 

    For more information on creating datastores, see [Connect to data with Azure Machine Learning studio](https://github.com/MicrosoftDocs/azure-docs-pr/blob/master/articles/machine-learning/how-to-connect-data-ui.md#create-datastores).
2. **(Option 1)** Register a dataset and use it in the designer. 

    [This article](https://github.com/MicrosoftDocs/azure-docs-pr/blob/master/articles/machine-learning/how-to-connect-data-ui.md#create-datasets) has the step-by-step guidance on how to create datasets in AML Studio. When migrating ML Studio (classic) data, select the **Tabular** dataset.
    
    After registering the dataset, you can find it in the designer left palette. Expand the **Datasets** section, then drag the dataset onto the canvas. 

    ![registered-dataset](./media/migrate-to-AML/registered-dataset.png)

1.  **(Option 2)** Use Import Data Module in the designer 

    After creating the datastore, you can use Import Data module to ingest data from it. Find the **Import Data module** in the left palette, and configure the settings in right panel.

     First, select datastore to import data from. Then select path or edit SQL query to identify the needed data from datastore. 
    ![import-data](./media/migrate-to-AML/import-data.png)
    
 


## Studio (classic) and designer module-mapping

Module for same functionality has the same name in AML designer and ML Studio(classic). See below table for the module mapping. 

>![Important]
> The machine learning modules in designer are implemented with Python, using open-source packages like sklearn. The Studio(classic) machine learning modules are implemented with C# and using a Microsoft internal machine learning package. The result of the same module might have slight difference deu to the difference of underlying technology.


|Category|ML Studio(classic) module|AML designer module|
|--------------|----------------|--------------------------------------|
|Data input and output|- Enter Data Manually </br> - Export Data </br> - Import Data </br> - Load Trained Model </br> - Unpack Zipped Datasets|- Enter Data Manually </br> - Export Data </br> - Import Data|
|Data Format Conversions|- Convert to CSV </br> - Convert to Dataset </br> - Convert to ARFF </br> - Convert to SVMLight </br> - Convert to TSV|- Convert to CSV </br> - Convert to Dataset|
|Data Transformation - Manipulation|- Add Columns</br> - Add Rows </br> - Apply SQL Transformation </br> - Cleaning Missing Data </br> - Convert to Indicator Values </br> - Edit Metadata </br> - Join Data </br> - Remove Duplicate Rows </br> - Select Columns in Dataset </br> - Select Columns Transform </br> - SMOTE </br> - Group Categorical Values|- Add Columns</br> - Add Rows </br> - Apply SQL Transformation </br> - Cleaning Missing Data </br> - Convert to Indicator Values </br> - Edit Metadata </br> - Join Data </br> - Remove Duplicate Rows </br> - Select Columns in Dataset </br> - Select Columns Transform </br> - SMOTE|
|Data Transformation – Scale and Reduce |- Clip Values </br> - Group Data into Bins </br> - Normalize Data </br>- Principal Component Analysis |- Clip Values </br> - Group Data into Bins </br> - Normalize Data|
|Data Transformation – Sample and Split|- Partition and Sample </br> - Split Data|- Partition and Sample </br> - Split Data|
|Data Transformation – Filter |- Apply Filter </br> - FIR Filter </br> - IIR Filter </br> - Median Filter </br> - Moving Average Filter </br> - Threshold Filter </br> - User Defined Filter||
|Data Transformation – Learning with Counts |- Build Counting Transform </br> - Export Count Table </br> - Import Count Table </br> - Merge Count Transform</br>  - Modify Count Table Parameters||
|Feature Selection |- Filter Based Feature Selection </br> - Fisher Linear Discriminant Analysis  </br> - Permutation Feature Importance |- Filter Based Feature Selection </br>  - Permutation Feature Importance|
| Model - Classification| - Multiclass Decision Forest </br> - Multiclass Decision Jungle  </br> - Multiclass Logistic Regression  </br>- Multiclass Neural Network  </br>- One-vs-All Multiclass </br>- Two-Class Averaged Perceptron </br>- Two-Class Bayes Point Machine </br>- Two-Class Boosted Decision Tree  </br> - Two-Class Decision Forest  </br> - Two-Class Decision Jungle  </br> - Two-Class Locally-Deep SVM </br> - Two-Class Logistic Regression  </br> - Two-Class Neural Network </br> - Two-Class Support Vector Machine  | - Multiclass Decision Forest </br>  - Multiclass Boost Decision Tree  </br> - Multiclass Logistic Regression </br> - Multiclass Neural Network </br> - One-vs-All Multiclass  </br> - Two-Class Averaged Perceptron  </br> - Two-Class Boosted Decision Tree  </br> - Two-Class Decision Forest </br>-  Two-Class Logistic Regression </br> - Two-Class Neural Network </br>-   Two-Class Support Vector Machine  |
| Model - Clustering| - K-means clustering| - K-means clustering|
| Model - Regression| - Bayesian Linear Regression  </br> - Boosted Decision Tree Regression  </br>- Decision Forest Regression  </br> - Fast Forest Quantile Regression  </br> - Linear Regression </br> - Neural Network Regression </br> - Ordinal Regression  Poisson Regression| - Boosted Decision Tree Regression  </br>- Decision Forest Regression  </br> - Fast Forest Quantile Regression </br> - Linear Regression  </br> - Neural Network Regression </br> - Poisson Regression|
| Model – Anomaly Detection| - One-Class SVM  </br> - PCA-Based Anomaly Detection | - PCA-Based Anomaly Detection|
| Machine Learning – Evaluate  | - Cross Validate Model  </br>- Evaluate Model  </br>- Evaluate Recommender | - Cross Validate Model  </br>- Evaluate Model </br> - Evaluate Recommender|
| Machine Learning – Train| - Sweep Clustering  </br> - Train Anomaly Detection Model </br>- Train Clustering Model  </br> - Train Matchbox Recommender  -</br> Train Model  </br>- Tune Model Hyperparameters| - Train Anomaly Detection Model  </br> - Train Clustering Model </br> -  Train Model  -</br> - Train PyTorch Model  </br>- Train SVD Recommender  </br>- Train Wide and Deep Recommender </br>- Tune Model Hyperparameters|
| Machine Learning – Score| - Apply Transformation  </br>- Assign Data to clusters  </br>- Score Matchbox Recommender </br> - Score Model|-  Apply Transformation  </br> - Assign Data to clusters </br> - Score Image Model  </br> - Score Model </br>- Score SVD Recommender </br> -Score Wide and Deep Recommender|
| OpenCV Library Modules| - Import Images </br>- Pre-trained Cascade Image Classification | |
| Python Language Modules| - Execute Python Script| - Execute Python Script  </br> - Create Python Model |
| R Language Modules  | - Execute R Script  </br> - Create R Model| - Execute R Script|
| Statistical Functions | - Apply Math Operation </br>-  Compute Elementary Statistics  </br>- Compute Linear Correlation  </br>- Evaluate Probability Function  </br>- Replace Discrete Values  </br>- Summarize Data  </br>- Test Hypothesis using t-Test| - Apply Math Operation  </br>- Summarize Data|
| Text Analytics| - Detect Languages  </br>- Extract Key Phrases from Text  </br>- Extract N-Gram Features from Text  </br>- Feature Hashing </br>- Latent Dirichlet Allocation  </br>- Named Entity Recognition </br>-  Preprocess Text  </br>- Score Vowpal Wabbit Version 7-10 Model  </br>- Score Vowpal Wabbit Version 8 Model </br>- Train Vowpal Wabbit Version 7-10 Model  </br>- Train Vowpal Wabbit Version 8 Model |-  Convert Word to Vector </br> - Extract N-Gram Features from Text </br>-  Feature Hashing  </br>- Latent Dirichlet Allocation </br>- Preprocess Text  </br>- Score Vowpal Wabbit Model </br> - Train Vowpal Wabbit Model|
| Time Series| - Time Series Anomaly Detection | |
| Web Service | - Input </br> -   Output | - Input </br>  - Output|
| Computer Vision| | - Apply Image Transformation </br> - Convert to Image Directory </br> - Init Image Transformation </br> - Split Image Directory  </br> - DenseNet Image Classification   </br>- ResNet Image Classification |

Find more about how to use designer modules in [module reference](../algorithm-module-reference/module-reference.md) 
 
## What if the wanted module is not in designer? 

Azure Machine Learning designer builds the most popular modules in ML Studio(classic). It also added some new modules leveraging the state of art machine learning technology (for example DenseNet for image classification). We expect designer supported module will cover most of the migration scenario. If your migration is blocked by missing modules in designer, contact us by [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).
    
## Execute R Script

Execute R Script module is a popular module in ML Studio(classic), which allows customer to do customized task using R script. Given that ML Studio(classic) is hosted on Windows platform and the Azure Machine Learning designer is running on Linux platform, it would be slightly different to install an R package in designer.
||ML Studio(classic)|Azure Machine Learning designer|
|---|---|---|
|Script Interface|maml.mapInputPort and maml.mapOutputPort|Function interface|
|Platform|Windows|Linux|
|Internet Accessible |No|Yes|
|Memory|14G|Depend on Compute SKU|

Below are the migration steps for R script.

**Change the R script interface**

Here is a quick sample of R script in Azure Machine Learning Studio (classic). 
```r
# Map 1-based optional input ports to variables 
dataset1 <- maml.mapInputPort(1) # class: data.frame 
dataset2 <- maml.mapInputPort(2) # class: data.frame 

# Contents of optional Zip port are in ./src/ 
# source("src/yourfile.R"); 
# load("src/yourData.rdata"); 

# Sample operation 
data.set = rbind(dataset1, dataset2); 

 
# You'll see this output in the R Device port. 
# It'll have your stdout, stderr and PNG graphics device(s). 

plot(data.set); 

# Select data.frame to be sent to the output Dataset port 
maml.mapOutputPort("data.set"); 
```

Here is the upgraded version in Azure Machine Learning designer. Basically, the main change is replacing the maml.mapInputPort and maml.mapOutputPort with a normal function interface with name “azureml_main”. 
```r
azureml_main <- function(dataframe1, dataframe2){ 
    # Use the parameters dataframe1 and dataframe2 directly 
    dataset1 <- dataframe1 
    dataset2 <- dataframe2 

    # Contents of optional Zip port are in ./src/ 
    # source("src/yourfile.R"); 
    # load("src/yourData.rdata"); 

    # Sample operation 
    data.set = rbind(dataset1, dataset2); 


    # You'll see this output in the R Device port. 
    # It'll have your stdout, stderr and PNG graphics device(s). 
    plot(data.set); 

  # Return datasets as a Named List 

  return(list(dataset1=data.set)) 
} 
```

Learn more in designer [Execute R Script reference](../algorithm-module-reference/execute-r-script.md/).

 **Install R packages from Internet**

ML Studio(classic) runs on a sandbox environment with no internet access. To install a new R package that not in pre-installed list, customer needs to upload the package in a zip bundle and load them in script.

In the Azure Machine Learning, it’s allowed to install the packages from CRAN directly. Customer can install the R package with the code below.
```r
  if(!require(zoo)) { 
      install.packages("zoo",repos = "http://cran.us.r-project.org") 
  } 
  library(zoo) 
```
