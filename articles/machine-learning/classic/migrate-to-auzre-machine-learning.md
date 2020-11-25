---
title: 'ML Studio (classic): Migrate to Azure Machine Learning'
description: describe how to migrate ML Studio classic projects to Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: how-to

author: zhanxia
ms.author: zhanixa
ms.date: 11/27/2020
---

# Migrate to Azure Machine Learning 

Azure Machine Learning Studio(classic) will start retirement from Feb 2021, following by three years retirement period to leave customer time for migration. During the retirement period, customer will have access to their existing Machine Learning Studio(classic) workspace. The experiments and web services can still run. But new user sign-up or create new workspace will not be allowed.

 The Azure Machine Learning  is the new version of machine learning product in Azure, which delivers a complete data science platform for all skill levels. The migration from ML Studio(classic) to Azure Machine Learning will be manual at this moment. There is plan to offer migration tool and we will further announce when it's ready. This document details the guidance on how to migrate from ML Studio(classic) to Azure Machine Learning.


## Prerequisite for migration

### Understand basics of Azure Machine Learning
To have a smooth migration from ML Studio(classic) to Azure Machine Learning, it's recommended to go through following contents to understand the basics of Azure Machine Learning. 

- [What is Azure Machine Learning](../overview-what-is-azure-ml.md)
- [What is Azure Machine Learning studio]((../overview-what-is-machine-learning-studio.md))


### Create Azure Machine Learning workspace

The workspace is the top-level resource for Azure Machine Learning, it provides a centralized place to work with all the artifacts you create in Azure Machine Learning.

Follow [this article](../how-to-manage-workspace.md) to create Azure Machine Learning workspace. 


## Compare Machine Learning Studio(classic) and Azure Machine Learning.

 
Released in 2015, Machine Learning Studio (classic) was Microsoft first drag-and-drop machine learning builder. It is a standalone service that only offers a visual experience with traditional machine learning algorithms. 

Azure Machine Learning is a separate and modernized service. It can be used for any kind of machine learning, from classical ml to deep learning, supervised, and unsupervised learning. Whether you prefer to write Python or R code with the SDK or work with no-code/low-code options in the studio, you can build, train, and track machine learning and deep-learning models in an Azure Machine Learning Workspace.

The service also interoperates with popular deep learning and reinforcement open-source tools such as PyTorch, TensorFlow, scikit-learn, and Ray RLlib.

### Feature comparison

The following table summarizes the key differences between ML Studio (classic) and Azure Machine Learning.

| Feature | ML Studio (classic) | Azure Machine Learning |
|---| --- | --- |
| Drag and drop interface | Classic experience | Updated experience - [Azure Machine Learning designer](../concept-designer.md)| 
| Code SDKs | Unsupported | Fully integrated with [Azure Machine Learning Python](/python/api/overview/azure/ml/) and [R](../tutorial-1st-r-experiment.md) SDKs |
| Experiment | Scalable (10-GB training data limit) | Scale with compute target |
| Training compute targets | Proprietary compute target, CPU support only | Wide range of customizable [training compute targets](../concept-compute-target.md#train). Includes GPU and CPU support | 
| Deployment compute targets | Proprietary web service format, not customizable | Wide range of customizable [deployment compute targets](../concept-compute-target.md#deploy). Includes GPU and CPU support |
| ML Pipeline | Not supported | Build flexible, modular [pipelines](../concept-ml-pipelines.md) to automate workflows |
| MLOps | Basic model management and deployment; CPU only deployments | Entity versioning (model, data, workflows), workflow automation, integration with CICD tooling, CPU, and GPU deployments [and more](../concept-model-management-and-deployment.md) |
| Model format | Proprietary format, Studio (classic) only | Multiple supported formats depending on training job type |
| Automated model training and hyperparameter tuning |  Not supported | [Supported](../concept-automated-ml.md). Code-first and no-code options. | 
| Data drift detection | Not supported | [Supported](../how-to-monitor-datasets.md) |
| Data labeling projects | Not supported | [Supported](../how-to-create-labeling-projects.md) |
|RBAC|Contributor and owner role supported|[Flexible role definition and RBAC control](../how-to-assign-roles.md)|

### Concept mapping

Many ML Studio(classic) concepts also exist in Azure Machine Learning, below table summarized the concept mapping of the two products.

|ML Studio(classic) concept|Corresponding concept in Azure Machine Learning|
|---| --- |
|Workspace|Workspace|
|Projects|NA|
|Experiment (the drag-n-drop graph)|Pipeline draft. <br/>           Experiment in AML refers to a grouping of many runs|
|Run|Pipeline run|
|Web service - batch|Pipeline endpoint|
|Web service - real-time|Real-time endpoint|
|Web service plan|NA|
|Datasets|Datasets|
|Trained models|Models|
|Settings - user management|RBAC|
|Settings - data gateway|It's recommended to move data from on-premises to cloud storage using [Azure data factory integration runtime](../../data-factory/create-self-hosted-integration-runtime.md).|
|AI gallery|NA|

Learn more about the Azure Machine Learning concepts in [this article](../concept-azure-machine-learning-architecture.md). 



## Suggested migration path

Compared to ML Studio(classic), Azure Machine Learning offers much richer capabilities for multiple skill levels of customers.
There are Python/R SDK and CLI offerings for customers who are more comfortable to write Python/R code. There is also Azure Machine Learning designer - the similar drag-n-drop interface as ML Studio(classic) to train and deploy in a low code fashion.

Below table summarize the suggested migration path based on customer profile and ML Studio(classic) usage pattern.

For low code/no code path, this article will have step-by-step guidance on how to rebuild experiment/web service using Azure Machine Learning designer.

For code first path, it's a different approach and require customer to learn how to use Azure Machine Learning SDK. This article will link to corresponding tutorial/example.   

|ML Studio(classic) use pattern|Azure Machine Learning designer(low code/no code)|Azure Machine Learning SDK (Code first)|
|---| --- | --- |
|Experiment| - [Migrate experiment to Azure Machine Learning designer](#migrate-studio(classic)-experiment-to-azure-machine-learning-designer) </br> - Experiment migration tool (ETA TBD)| Rebuild your training experiment using notebooks and AML SDK. Start with [Notebooks tutorial](../tutorial-1st-experiment-sdk-setup-local.md).|
|Inference: Real-time web service| - [Migrate real-time web service using AML designer](#migrate-request/respond-web-service-using-aml-designer) </br> - Real-time web service migration tool (ETA TBD)| Deploy model with AML SDK. Start with [deployment tutorial](../tutorial-deploy-models-with-aml.md)|
|Inference: batch web service|-[Migrate batch web service to pipeline endpoint using AML designer](#migrate-batch-web-service-to-pipeline-endpoint-using-aml-designer) </br> - batch web service migration tool(ETA TBD)|Rebuild machine learning pipeline using SDK for batch inference. Start with [batch inference tutorial](../tutorial-pipeline-batch-scoring-classification.md)|
|Training and deploy with automation (using PowerShell)| NA|Rebuild using MLOps. </br>[What is MLOps](../concept-model-management-and-deployment.md) </br>[MLOps example repro](https://github.com/microsoft/MLOps)|


## Migrate Studio(classic) experiment to Azure Machine Learning designer

This section will describe how to migrate ML Studio(classic) experiment to Azure Machine Learning designer step by step. For most of the AML assets, it’s possible to manage both through UI and SDK/CLI. This section will focus on how-to with UI in Azure Machine Learning Studio.

If you have never used Azure Machine Learning designer before, it's recommended to go through [designer tutorial](../tutorial-designer-automobile-price-train-score.md) to get familiar with it first.  

#### 1. Ingest Data

There are two ways to ingest data in ML Studio(classic), upload data file as dataset or use the Import Data module. For static files, it's suggested to download the datasets from ML Studio(classic) then upload to AML Studio as dataset. For Import Data module, there are two possible options:

|Option|Description|When to use|
|---| --- | --- |
|AML dataset|Ingest data from local and online data sources (Blob, ADLS Gen1, ADLs Gen2, File share, SQL DB). It will register the data as a dataset asset to the workspace. And advanced data features like data versioning and data monitoring are enabled.|Recommended to use generally|
|Import Data Module in designer|Ingest data from online data sources (Blob, ADLS Gen1, ADLS Gen2, File share, SQL DB).  It will not create a dataset asset to the workspace. |When customer does not want to register a dataset to workspace.|

[!Note]
There are four cloud data sources (Hive Query, Azure Table, Azure Cosmos DB, On-premises SQL Database) that supported in ML Studio(classic) but not supported in AML. It's recommended to move your data to supported storages using Azure Data Factory.  

To ingest data in designer, there are two steps:
1. Create datastore

    [This article](https://github.com/MicrosoftDocs/azure-docs-pr/blob/master/articles/machine-learning/how-to-connect-data-ui.md#create-datastores) has step-by-step guidance on how to create datastore.
2. (Option 1) Create dataset and drop it in designer. 

    [This article](https://github.com/MicrosoftDocs/azure-docs-pr/blob/master/articles/machine-learning/how-to-connect-data-ui.md#create-datasets) has the step-by-step guidance on how to create datasets in AML Studio. Remember to choose **Tabular** for dataset type since ML Studio(classic) supported data are essentially tabular format.   
    
    After create the dataset, you can find the dataset in designer left palette, under **Datasets** category. Then drop the dataset in canvas to use it. 

    ![registered-dataset](./media/migrate-to-AML/registered-dataset.png)

1.  (Option 2) Use Import Data Module in designer 

    After create datastore, you can use Import Data module in designer to ingest data from created datastore. This module will not create a dataset asset to your workspace. Follow the settings in right panel to set up this module. First, select datastore to import data from. Then select path or edit SQL query to identify the needed data from datastore. 
    ![import-data](./media/migrate-to-AML/import-data.png)
    
 
### 2. Create compute target

In ML Studio(classic), the experiment run on a shared compute resource pool that fully managed by ML Studio(classic).  There is a hard 10G data size limitation. 

However, Azure Machine Learning enables much more scalable training by bringing variety type and size of Azure VMs as compute target. Customer can choose compute target based on their needs. Check [compute target](../concept-compute-target.md) to learn more.  
 
Azure Machine Learning designer supports following compute target types.

|Compute target type|Brief description|When to use|
|------|------|------|
|Compute Instance|A fully managed single node cloud-base machine learning workstation. Learn more [here](../concept-compute-instance.md)|test/small date size|
|Azure Machine Learning Compute|Single or multi-node cluster, fully managed by Azure Machine Learning. Autosacle when you submit a run. Learn more [here](../concept-compute-target.md)|big data size?|

#### Create compute target

[This article](../how-to-create-attach-compute-studio.md) describes how to create compute target in Azure Machine Learning Studio with step-by-step guidance.

### 3. Build the pipeline draft

Then you need to build the pipeline draft with build-in modules in AML designer. It's basically drag-n-drop the needed modules into canvas and connect them following the business logic, same as in ML Studio(classic).

>![Note]
>Some ML Studio(classic) experiment splits the data to smaller chunks to avoid the data size limitation. Then doing the processing separately and repeatedly for those small chunks. It's not necessary to do that in AML designer. The data size capability scale with compute target. 

Module for same functionality has the same name in AML designer and ML Studio(classic).  See below table for the module mapping. The machine learning modules in designer are implemented with Python, using open-source packages like sklearn. The Studio(classic) machine learning modules are implemented with C# and using a Microsoft internal machine learning package called TLC. The result of the same module might have slight difference.

>![Note]
>The experiment migration will likely be an iterative process. You can drag-n-drop a few modules, submit a run to check result, then add more modules. See section 4 in below on how to submit a run. 

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

Find more about how to use AML designer modules in [module reference](../algorithm-module-reference/module-reference.md) 
 
#### What if the wanted module is not in designer? 

Azure Machine Learning designer builds the most popular modules in ML Studio(classic). It also added some new modules leveraging the state of art technology (for example DenseNet for image classification). We expect designer supported module will cover most of the migration scenario. If your migration is blocked by missing module in designer, please contact us by file a support ticket.
    
#### Notes for Execute R Script

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

 
### 4. Submit a pipeline run and check result

Now that your pipeline is all setup, you can submit a pipeline run to train your machine learning model. You can submit a valid pipeline run at any point, which can be used to review changes to your pipeline during development.

1. At the top of the canvas, select **Submit**.

1. In the **Set-up pipeline run** dialog box, select **Create new**.

    > [!NOTE]
    > Experiments group similar pipeline runs together. If you run a pipeline multiple times, you can select the same experiment for successive runs.

1. Enter a descriptive name for **New experiment Name**.

1. Select **Submit**.

You can view run status and details at the top right of the canvas.

If is the first run, it may take up to 20 minutes for your pipeline to finish running. The default compute settings have a minimum node size of 0, which means that the designer must allocate resources after being idle. Repeated pipeline runs will take less time since the compute resources are already allocated. Additionally, the designer uses cached results for each module to further improve efficiency.

After the run finish, you can check the output of each module. Here are a few helpful options if you right-click a module.
![right-click](./media/migrate-to-AML/right-click.png)
- **Visualize: Preview data to help you understand the data.
- **View Output**: Link you to the storage account that stores module's output, in which you can further explore/download the output. 
- **View Log** : View log to help understand what happens under the hood. The **70_driver_log** would be the most helpful log in most cases since in contains the information related to customer script. You can drag the right panel to expand the log area or expand into full screen as shown in below gif.
 
![view-log](./media/migrate-to-AML/resize-right-panel.gif)




## Migrate batch web service to pipeline endpoint using AML designer

In ML Studio(classic), you can deploy the predictive experiment as web service. After deployment, there will be two REST endpoints -  batch execution endpoint for batch inference and request/respond endpoint for real-time inference. 

In Azure Machine Learning, batch web service maps to pipeline endpoint, which allows customer to call a REST endpoint to make prediction for many data at once. This section will explain how to publish pipeline endpoint with Azure Machine Learning designer.

In previous section, you already migrated the ML Studio(classic) experiment as pipeline draft for training purpose. Now we will start with a pipeline draft to publish it as a pipeline endpoint. In generate it takes following steps:
- Create batch inference pipeline
- Publish the batch inference pipeline
- Invoke the pipeline endpoint with UI or REST call


[This article](../how-to-run-batch-predictions-designer.md) describes how to above steps with step-by-step guidance. 

>[!Note]
>In ML Studio(classic), the batch web service is authenticated by web service key. In Azure Machine Learning, the pipeline endpoint use token based authentication since it's more secure. Follow [this article](../how-to-setup-authentication.md) to set up token based authentication. 


>[!Note]
>You can also publish the pipeline draft directly in designer without creating batch inference pipeline. The publish steps is as the same as above, but skip the first step to create batch inference pipeline. The difference is that batch inference pipeline will replace the training related modules with trained model from training pipeline however publish pipeline draft directly will publish all the origin modules.  



## Migrate REQUEST/RESPOND web service using AML designer

In ML Studio(classic), the REQUEST/RESPOND endpoint is used for real-time inference. In Azure Machine Learning, it's done by real-time endpoint. 

[This article](../how-to-deploy-and-where.md) explains how model deployment works in Azure Machine Learning. Designer further simplifies the process by doing register model, prepare inference configuration and prepare entry script automatically when customer clicks **Deploy** button. Designer supports deploy to ACI and AKS and below table summarize when to use for each. 

| Compute target | Used for | Description |
| ----- |  ----- | ----- |
|[Azure Kubernetes Service (AKS)](../how-to-deploy-azure-kubernetes-service.md) |Real-time inference|Use for high-scale production deployments. Provides fast response time and autoscaling of the deployed service. Cluster autoscaling isn't supported through the Azure Machine Learning SDK. To change the nodes in the AKS cluster, use the UI for your AKS cluster in the Azure portal.|
|[Azure Container Instances](../articles/machine-learning/how-to-deploy-azure-container-instance.md)|Testing or development|Use for low-scale CPU-based workloads that require less than 48 GB of RAM.|

In short, deploy real-time endpoint in designer have following steps:
- Create real-time inference pipeline from training pipeline. Tweak the web service input/output based on your needs. 
- Run the real-time inference pipeline to make sure it works as expected
- Deploy. Choose compute target and set deployment settings.
- Test the resulting endpoint.

[This tutorial](../tutorial-designer-automobile-price-deploy.md) has step-by-step description on how to deploy real-time endpoint in designer.  