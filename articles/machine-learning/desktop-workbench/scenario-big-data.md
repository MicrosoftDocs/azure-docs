---
title: Server workload forecasting on terabytes of data - Azure | Microsoft Docs
description: How to train a machine learning model on big data by using Azure Machine Learning Workbench.
services: machine-learning
documentationcenter: ''
author: daden
manager: mithal
editor: daden

ms.assetid: 
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/15/2017
ms.author: daden

ROBOTS: NOINDEX
---


# Server workload forecasting on terabytes of data

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 

This article covers how data scientists can use Azure Machine Learning Workbench to develop solutions that require the use of big data. You can start from a sample of a large data set, iterate through data preparation, feature engineering, and machine learning, and then extend the process to the entire large data set. 

You'll learn about the following key capabilities of Machine Learning Workbench:
* Easy switching between compute targets. You can set up different compute targets and use them in experimentation. In this example, you use an Ubuntu DSVM and an Azure HDInsight cluster as the compute targets. You can also configure the compute targets, depending on the availability of resources. In particular, after scaling out the Spark cluster with more worker nodes, you can use the resources through Machine Learning Workbench to speed up experiment runs.
* Run history tracking. You can use Machine Learning Workbench to track the performance of machine learning models and other metrics of interest.
* Operationalization of the machine learning model. You can use the built-in tools within Machine Learning Workbench to deploy the trained machine learning model as a web service on Azure Container Service. You can also use the web service to get mini-batch predictions through REST API calls. 
* Support for terabytes data.

> [!NOTE]
> For code samples and other materials related to this example, see [GitHub](https://github.com/Azure/MachineLearningSamples-BigData).
> 

## Use case overview

Forecasting the workload on servers is a common business need for technology companies that manage their own infrastructure. To reduce infrastructure cost, services running on under-used servers should be grouped together to run on a smaller number of machines. Services running on overused servers should be given more machines to run. 

In this scenario, you focus on workload prediction for each machine (or server). In particular, you use the session data on each server to predict the workload class of the server in future. You classify the load of each server into low, medium, and high classes by using the Random Forest Classifier in [Apache Spark ML](https://spark.apache.org/docs/2.1.1/ml-guide.html). The machine learning techniques and workflow in this example can be easily extended to other similar problems. 


## Prerequisites

The prerequisites to run this example are as follows:

* An [Azure account](https://azure.microsoft.com/free/) (free trials are available).
* An installed copy of [Azure Machine Learning Workbench](../service/overview-what-is-azure-ml.md). To install the program and create a workspace, see the [quickstart installation guide](quickstart-installation.md). If you have multiple subscriptions, you can [set the desired subscription to be the current active subscription](https://docs.microsoft.com/cli/azure/account?view=azure-cli-latest#az_account_set).
* Windows 10 (the instructions in this example are generally the same for macOS systems).
* A Data Science Virtual Machine (DSVM) for Linux (Ubuntu), preferably in East US region where the data locates. You can provision an Ubuntu DSVM by following [these instructions](https://docs.microsoft.com/azure/machine-learning/data-science-virtual-machine/dsvm-ubuntu-intro). You can also see [this quickstart](https://ms.portal.azure.com/#create/microsoft-ads.linux-data-science-vm-ubuntulinuxdsvmubuntu). We recommend using a virtual machine with at least 8 cores and 32 GB of memory. 

Follow the [instruction](../desktop-workbench/known-issues-and-troubleshooting-guide.md#remove-vm-execution-error-no-tty-present) to enable password-less sudoer access on the VM for AML Workbench.  You can choose to use [SSH key-based authentication for creating and using the VM in AML Workbench](experimentation-service-configuration.md#using-ssh-key-based-authentication-for-creating-and-using-compute-targets). In this example, we use password to access the VM.  Save the following table with the DSVM info for later steps:

 Field name| Value |  
 |------------|------|
DSVM IP address | xxx|
 User name  | xxx|
 Password   | xxx|


 You can choose to use any VM with [Docker Engine](https://docs.docker.com/engine/) installed.

* An HDInsight Spark Cluster, with Hortonworks Data Platform version 3.6 and Spark version 2.1.x, preferably in East US region where the data locates. Visit [Create an Apache Spark cluster in Azure HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-provision-linux-clusters) for details about how to create HDInsight clusters. We recommend using a three-worker cluster, with each worker having 16 cores and 112 GB of memory. Or you can just choose VM type `D12 V2` for head node, and `D14 V2` for the worker node. The deployment of the cluster takes about 20 minutes. You need the cluster name, SSH user name, and password to try out this example. Save the following table with the Azure HDInsight cluster info for later steps:

 Field name| Value |  
 |------------|------|
 Cluster name| xxx|
 User name  | xxx (sshuser by default)|
 Password   | xxx|


* An Azure Storage account. You can follow [these instructions](https://docs.microsoft.com/azure/storage/common/storage-create-storage-account) to create one. Also, create two private blob containers with the names `fullmodel` and `onemonthmodel` in this storage account. The storage account is used to save intermediate compute results and machine learning models. You need the storage account name and access key to try out this example. Save the following table with the Azure storage account info for later steps:

 Field name| Value |  
 |------------|------|
 Storage account name| xxx|
 Access key  | xxx|


The Ubuntu DSVM and the Azure HDInsight cluster created in the prerequisite list are compute targets. Compute targets are the compute resource in the context of Machine Learning Workbench, which might be different from the computer where Workbench runs.   

## Create a new Workbench project

Create a new project by using this example as a template:
1.	Open Machine Learning Workbench.
2.	On the **Projects** page, select the **+** sign, and select **New Project**.
3.	In the **Create New Project** pane, fill in the information for your new project.
4.	In the **Search Project Templates** search box, type **Workload Forecasting on Terabytes Data**, and select the template.
5.	Select **Create**.

You can create a Workbench project with a pre-created git repository by following [this instruction](./tutorial-classifying-iris-part-1.md).  
Run `git status` to inspect the status of the files for version tracking.

## Data description

The data used in this example is synthesized server workload data. It is hosted in an Azure Blob storage account that's publically accessible in East US region. The specific storage account info can be found in the `dataFile` field of [`Config/storageconfig.json`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Config/fulldata_storageconfig.json) in the format of "wasb://<BlobStorageContainerName>@<StorageAccountName>.blob.core.windows.net/<path>". You can use the data directly from the Blob storage. If the storage is used by many users simultaneously, you can use [azcopy](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-linux) to download the data into your own storage for better experimentation experience. 

The total data size is approximately 1 TB. Each file is about 1-3 GB, and is in CSV file format, without header. Each row of data represents the load of a transaction on a particular server. The detailed information of the data schema is as follows:

Column number | Field name| Type | Description |  
|------------|------|-------------|---------------|
1  | `SessionStart` | Datetime |	Session start time
2  |`SessionEnd`	| Datetime | Session end time
3 |`ConcurrentConnectionCounts` | Integer |	Number of concurrent connections
4 | `MbytesTransferred`	| Double | Normalized data transferred in megabytes
5 | `ServiceGrade` | Integer |	Service grade for the session
6 | `HTTP1` | Integer|	Session uses HTTP1 or HTTP2
7 |`ServerType` | Integer	|Server type
8 |`SubService_1_Load` | Double |	Subservice 1 load
9 | `SubService_2_Load` | Double | 	Subservice 2 load
10 | `SubService_3_Load` | Double | 	Subservice 3 load
11 |`SubService_4_Load`	| Double |  Subservice 4 load
12 | `SubService_5_Load`| Double |  	Subservice 5 load
13 |`SecureBytes_Load`	| Double | Secure bytes load
14 |`TotalLoad`	| Double | Total load on server
15 |`ClientIP` | String|	Client IP address
16 |`ServerIP` | String|	Server IP address



Note that the expected data types are listed in the preceding table. Due to missing values and dirty-data problems, there is no guarantee that the data types actually are as expected. Data processing should take this into consideration. 


## Scenario structure

The files in this example are organized as follows.

| File name | Type | Description |
|-----------|------|-------------|
| `Code` | Folder | The  folder contains all the code in the example. |
| `Config` | Folder | The  folder contains the configuration files. |
| `Image` | Folder | The folder used to save images for the README file. |
| `Model` | Folder | The folder used to save model files downloaded from Blob storage. |
| `Code/etl.py` | Python file | The Python file used for data preparation and feature engineering. |
| `Code/train.py` | Python file | The Python file used to train a three-class multi-classfication model.  |
| `Code/webservice.py` | Python file | The Python file used for operationalization.  |
| `Code/scoring_webservice.py` | Python file |  The Python file used for data transformation and calling the web service. |
| `Code/O16Npreprocessing.py` | Python file | The Python file used to preprocess the data for scoring_webservice.py.  |
| `Code/util.py` | Python file | The Python file that contains code for reading and writing Azure blobs.  
| `Config/storageconfig.json` | JSON file | The configuration file for the Azure blob container that stores the intermediate results and model for processing and training on one-month data. |
| `Config/fulldata_storageconfig.json` | Json file | The configuration file for the Azure blob container that stores the intermediate results and model for processing and training on a full data set.|
| `Config/webservice.json` | JSON file | The configuration file for scoring_webservice.py.|
| `Config/conda_dependencies.yml` | YAML file | The Conda dependency file. |
| `Config/conda_dependencies_webservice.yml` | YAML file | The Conda dependency file for the web service.|
| `Config/dsvm_spark_dependencies.yml` | YAML file | The Spark dependency file for Ubuntu DSVM. |
| `Config/hdi_spark_dependencies.yml` | YAML file | The Spark dependency file for the HDInsight Spark cluster. |
| `README.md` | Markdown file | The README markdown file. |
| `Code/download_model.py` | Python file | The Python file used to download the  model files from the Azure blob to a local disk. |
| `Docs/DownloadModelsFromBlob.md` | Markdown file | The markdown file that contains instructions for how to run `Code/download_model.py`. |



### Data flow

The code in [`Code/etl.py`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Code/etl.py)  loads data from the publicly accessible container (`dataFile` field of [`Config/storageconfig.json`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Config/fulldata_storageconfig.json)). It includes data preparation and feature engineering, and saves the intermediate compute results and models to your own private container. The code in [`Code/train.py`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Code/train.py) loads the intermediate compute results from the private container, trains the multi-class classification model, and writes the trained machine learning model to the private container. 

You should use one container for experimentation on the one-month data set, and another one for experimentation on the full data set. Because the data and models are saved as Parquet file, each file is actually a folder in the container, containing multiple blobs. The resulting container looks as follows:

| Blob prefix name | Type | Description |
|-----------|------|-------------|
| featureScaleModel | Parquet | Standard scaler model for numeric features. |
| stringIndexModel | Parquet | String indexer model for non-numeric features.|
| oneHotEncoderModel|Parquet | One-hot encoder model for categorical features. |
| mlModel | Parquet | Trained machine learning model. |
| info| Python pickle file | Information about the transformed data, including training start, training end, duration, the timestamp for train-test splitting, and columns for indexing and one-hot encoding.

All the files and blobs in the preceding table are used for operationalization.


### Model development

#### Architecture diagram


The following diagram shows the end-to-end workflow of using Machine Learning Workbench to develop the model:
![architecture](media/scenario-big-data/architecture.PNG)

In the following sections, we show the model development by using the remote compute target functionality in Machine Learning Workbench. We first load a small amount of sample data, and run the script [`Code/etl.py`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Code/etl.py) on an Ubuntu DSVM for fast iteration. We can further limit the work we do in  [`Code/etl.py`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Code/etl.py) by passing an extra argument for faster iteration. In the end, we use an HDInsight cluster to train with full data.     

The  [`Code/etl.py`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Code/etl.py) file loads and prepares the data, and performs feature engineering. It accepts two arguments:
* A configuration file for the Blob storage container, for storing the intermediate compute results and models.
* A debug config argument for faster iteration.

The first argument, `configFilename`, is a local configuration file where you store the Blob storage information, and specify where to load the data. By default, it is  [`Config/storageconfig.json`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Config/storageconfig.json), and it is going to be used in the one-month data run. We also include [`Config/fulldata_storageconfig.json`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Config/fulldatastorageconfig.json), which you need to use on the full data set run. The content in the configuration is as follows: 

| Field | Type | Description |
|-----------|------|-------------|
| storageAccount | String | Azure Storage account name |
| storageContainer | String | Container in Azure Storage account to store intermediate results |
| storageKey | String |Azure Storage account access key |
| dataFile|String | Data source files  |
| duration| String | Duration of data in the data source files|

Modify both `Config/storageconfig.json` and `Config/fulldata_storageconfig.json` to configure the storage account, storage key, and the blob container to store the intermediate results. By default, the blob container for the one-month data run is `onemonthmodel`, and the blob container for full data set run is `fullmodel`. Make sure you create these two containers in your storage account. The `dataFile` field in [`Config/fulldata_storageconfig.json`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Config/fulldatastorageconfig.json) configures what data is loaded in [`Code/etl.py`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Code/etl.py). The `duration` field configures the range the data includes. If the duration is set to ONE_MONTH, the data loaded should be just one .csv file among the seven files of the data for June-2016. If the duration is FULL, the full data set (1 TB) is loaded. You don't need to change `dataFile` and `duration` in these two configuration files.

The second argument is DEBUG. Setting it to FILTER_IP enables a faster iteration. Use of this parameter is helpful when you want to debug your script.

> [!NOTE]
> In all of the following commands, replace any argument variable with its actual value.
> 


#### Model development on the Docker of Ubuntu DSVM

#####  1. Set up the compute target

Start the command line from Machine Learning Workbench by selecting **File** > **Open Command Prompt**. Then run: 

```az ml computetarget attach remotedocker --name dockerdsvm --address $DSVMIPaddress  --username $user --password $password ```

The following two files are created in the aml_config folder of your project:

-  dockerdsvm.compute: This file contains the connection and configuration information for a remote execution target.
-  dockerdsvm.runconfig: This file is a set of run options used within the Workbench application.

Browse to dockerdsvm.runconfig, and change the configuration of these fields to the following:

    PrepareEnvironment: true 
    CondaDependenciesFile: Config/conda_dependencies.yml 
    SparkDependenciesFile: Config/dsvm_spark_dependencies.yml

Prepare the project environment by running:

```az ml experiment prepare -c dockerdsvm```


With `PrepareEnvironment` set to true, Machine Learning Workbench creates the runtime environment whenever you submit a job. `Config/conda_dependencies.yml` and `Config/dsvm_spark_dependencies.yml` contain the customization of the runtime environment. You can always modify the Conda dependencies, Spark configuration, and Spark dependencies by editing these two YMAL files. For this example, we added `azure-storage` and `azure-ml-api-sdk` as extra Python packages in  `Config/conda_dependencies.yml`. We also added `spark.default.parallelism`, `spark.executor.instances`, and `spark.executor.cores` in `Config/dsvm_spark_dependencies.yml`. 

#####  2. Data preparation and feature engineering on DSVM Docker

Run the script `etl.py` on DSVM Docker. Use a debug parameter that filters the loaded data with specific server IP addresses:

```az ml experiment submit -t dockerdsvm -c dockerdsvm ./Code/etl.py ./Config/storageconfig.json FILTER_IP```

Browse to the side panel, and select **Run** to see the run history of `etl.py`. Notice that the run time is about two minutes. If you plan to change your code to include new features, providing FILTER_IP as the second argument provides a faster iteration. You might need to run this step multiple times when dealing with your own machine learning problems, to explore the data set or create new features. 

With the customized restriction on what data to load, and further filtering of what data to process, you can speed up the iteration process in your model development. As you experiment, you should periodically save the changes in your code to the Git repository. Note that we used the following code in `etl.py` to enable the access to the private container:

```python
def attach_storage_container(spark, account, key):
    config = spark._sc._jsc.hadoopConfiguration()
    setting = "fs.azure.account.key." + account + ".blob.core.windows.net"
    if not config.get(setting):
        config.set(setting, key)

# attach the blob storage to the spark cluster or VM so that the storage can be accessed by the cluster or VM        
attach_storage_container(spark, storageAccount, storageKey)
```


Next, run the script `etl.py` on DSVM Docker without the debug parameter FILTER_IP:

```az ml experiment submit -t dockerdsvm -c dockerdsvm ./Code/etl.py ./Config/storageconfig.json FALSE```

Browse to the side panel, and select **Run** to see the run history of `etl.py`. Notice that the run time is about four minutes. The processed result of this step is saved into the container, and is loaded for training in train.py. In addition, the string indexers, encoder pipelines, and standard scalers are saved to the private container. These are used in operationalization. 


##### 3. Model training on DSVM Docker

Run the script `train.py` on DSVM Docker:

```az ml experiment submit -t dockerdsvm -c dockerdsvm ./Code/train.py ./Config/storageconfig.json```

This step loads the intermediate compute results from the run of `etl.py`, and  trains a machine learning model. This step takes about two minutes.

When you have successfully finished the experimentation on the small data, you can continue to run the experimentation on the full data set. You can start by using the same code, and then experiment with argument and compute target changes.  

####  Model development on the HDInsight cluster

##### 1. Create the compute target in Machine Learning Workbench for the HDInsight cluster

```az ml computetarget attach cluster --name myhdi --address $clustername-ssh.azurehdinsight.net --username $username --password $password```

The following two files are created in the aml_config folder:
    
-  myhdi.compute: This file contains connection and configuration information for a remote execution target.
-  myhdi.runconfig: This file is set of run options used within the Workbench application.


Browse to myhdi.runconfig, and change the configuration of these fields to the following:

    PrepareEnvironment: true 
    CondaDependenciesFile: Config/conda_dependencies.yml 
    SparkDependenciesFile: Config/hdi_spark_dependencies.yml

Prepare the project environment by running:

```az ml experiment prepare -c myhdi```

This step can take up to seven minutes.

##### 2. Data preparation and feature engineering on HDInsight cluster

Run the script `etl.py`, with full data on the HDInsight cluster:

```az ml experiment submit -a -t myhdi -c myhdi ./Code/etl.py Config/fulldata_storageconfig.json FALSE```

Because this job lasts for a relatively long time (approximately two hours), you can use `-a` to disable output streaming. When the job is done, in **Run History**, you can view the driver and controller logs. If you have a larger cluster, you can always reconfigure the configurations in `Config/hdi_spark_dependencies.yml` to use more instances or cores. For example, if you have a four-worker-node cluster, you can increase the value of `spark.executor.instances` from 5 to 7. You can see the output of this step in the **fullmodel** container in your storage account. 


##### 3. Model training on HDInsight cluster

Run the script  `train.py` on HDInsight cluster:

```az ml experiment submit -a -t myhdi -c myhdi ./Code/train.py Config/fulldata_storageconfig.json```

Because this job lasts for a relatively long time（approximately 30 minutes), you can use `-a` to disable output streaming.

#### Run history exploration

Run history is a feature that enables tracking of your experimentation in Machine Learning Workbench. By default, it tracks the duration of the experimentation. In our specific example, when we move to the full data set for `Code/etl.py` in the experimentation, we notice that duration significantly increases. You can also log specific metrics for tracking purposes. To enable metric tracking, add the following lines of code to the head of your Python file:
```python
# import logger
from azureml.logging import get_azureml_logger

# initialize logger
run_logger = get_azureml_logger()
```
Here is an example to track a specific metric:

```python
run_logger.log("Test Accuracy", testAccuracy)
```

On the right sidebar of the Workbench, browse to **Runs** to see the run history for each Python file. You can also go to your GitHub repository. A new branch, with the name starting with "AMLHistory," is created to track the change you made to your script in each run. 


### Operationalize the model

In this section, you operationalize the model you created in the previous steps as a web service. You also learn how to use the web service to predict workload. Use Machine Language operationalization command-line interfaces (CLIs) to package the code and dependencies as Docker images, and to publish the model as a containerized web service.

You can use the command-line prompt in Machine Learning Workbench to run the CLIs.  You can also run the CLIs on Ubuntu Linux by following the [installation guide](./deployment-setup-configuration.md#using-the-cli). 

> [!NOTE]
> In all the following commands, replace any argument variable with its actual value. It takes about 40 minutes to finish this section.
> 

Choose a unique string as the environment for operationalization. Here, we use the string "[unique]" to represent the string you choose.

1. Create the environment for operationalization, and create the resource group.

        az ml env setup -c -n [unique] --location eastus2 --cluster -z 5 --yes

   Note that you can use Container Service as the environment by using  `--cluster` in the `az ml env setup` command. You can operationalize the machine learning model on [Azure Container Service](https://docs.microsoft.com/azure/container-service/kubernetes/container-service-intro-kubernetes). It uses [Kubernetes](https://kubernetes.io/) for automating deployment, scaling, and management of containerized applications. This command takes about 20 minutes to run. Use the following to check if the deployment has finished successfully: 

        az ml env show -g [unique]rg -n [unique]

   Set the deployment environment as the one you just created by running the following:

        az ml env set -g [unique]rg -n [unique]

2. Create and use a model management account. To create a model management account, run the following:

        az ml account modelmanagement create --location  eastus2 -n [unique]acc -g [unique]rg --sku-instances 4 --sku-name S3 

   Use the model management for operationalization by running the following:

        az ml account modelmanagement set  -n [unique]acc -g [unique]rg  

   A model management account is used to manage the models and web services. From the Azure portal, you can see a new model management account has been created. You can see the models, manifests, Docker images, and services that are created by using this model management account.

3. Download and register the models.

   Download the models in the **fullmodel** container to your local machine in the directory of code. Do not download the parquet data file with the name "vmlSource.parquet." It's not a model file; it's an intermediate compute result. You can also reuse the model files included in the Git repository. For more information, see [GitHub](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Docs/DownloadModelsFromBlob.md). 

   Go to the `Model` folder in the CLI, and register the models as follows:

        az ml model register -m  mlModel -n vmlModel -t fullmodel
        az ml model register -m  featureScaleModel -n featureScaleModel -t fullmodel
        az ml model register -m  oneHotEncoderModel -n  oneHotEncoderModel -t fullmodel
        az ml model register -m  stringIndexModel -n stringIndexModel -t fullmodel
        az ml model register -m  info -n info -t fullmodel

   The output of each command gives a model ID, which is needed in the next step. Save them in a text file for future use.

4. Create a manifest for the web service.

   A manifest includes the code for the web service, all the machine learning models, and runtime environment dependencies. Go to the `Code` folder in the CLI, and run the following command:

        az ml manifest create -n $webserviceName -f webservice.py -r spark-py -c ../Config/conda_dependencies_webservice.yml -i $modelID1 -i $modelID2 -i $modelID3 -i $modelID4 -i $modelID5

   The output gives a manifest ID for the next step. 

   Stay in the `Code` directory, and you can test webservice.py by running the following: 

        az ml experiment submit -t dockerdsvm -c dockerdsvm webservice.py

5. Create a Docker image. 

        az ml image create -n [unique]image --manifest-id $manifestID

   The output gives an image ID for the next step, This docker image is used in Container Service. 

6. Deploy the web service to the Container Service cluster.

        az ml service create realtime -n [unique] --image-id $imageID --cpu 0.5 --memory 2G

   The output gives a service ID. You need to use it to get the authorization key and service URL.

7. Call the web service in Python code to score in mini-batches.

   Use the following command to get the authorization key:

         az ml service keys realtime -i $ServiceID 

   Use the following command to get the service scoring URL:

        az ml service usage realtime -i $ServiceID

   Modify the content in `./Config/webservice.json` with the right service scoring URL and authorization key. Keep the "Bearer" in the original file, and replace the "xxx" part. 
   
   Go to the root directory of your project, and test the web service for mini-batch scoring by using the following:

        az ml experiment submit -t dockerdsvm -c dockerdsvm ./Code/scoring_webservice.py ./Config/webservice.json

8. Scale the web service. 

   For more information, see [How to scale operationalization on your Azure Container Service cluster](how-to-scale-clusters.md).
 

## Next steps

This example highlights how to use Machine Learning Workbench to train a machine learning model on big data, and operationalize the trained model. In particular, you learned how to configure and use different compute targets, and run the history of tracking metrics and use different runs.

You can extend the code to explore cross-validation and hyper-parameter tuning. To learn more about cross-validation and hyper-parameter tuning, see [this GitHub resource](https://github.com/Azure/MachineLearningSamples-DistributedHyperParameterTuning).  

To learn more about time-series forecasting, see [this GitHub resource](https://github.com/Azure/MachineLearningSamples-EnergyDemandTimeSeriesForecasting).