---
title: Server Workload Forecasting on Terabytes Data - Azure | Microsoft Docs
description: How to train a machine learning model on big data using Azure ML Workbench.
services: machine-learning
documentationcenter: ''
author: daden
manager: mithal
editor: daden

ms.assetid: 
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/15/2017
ms.author: daden
---

# Server workload forecasting on terabytes data

This example illustrates how data scientists can use Azure ML Workbench to develop solutions that require use of big data. We show how a user by using Azure ML Workbench can follow a happy path of starting from a sample of a large dataset, iterating through data preparation, feature engineering and machine learning, and then eventually extending the process to the entire large dataset. 

Along the way, we show the following key capabilities of Azure ML Workbench:
* Easy switching between compute targets: we show how the user can set up different compute targets and use them in experimentation. In this example, we use an Ubuntu DSVM and a HDInsight cluster as the compute targets. We also show the user how to configure the compute targets depending on the availability of resources. In particular, after scaling out the Spark cluster (that is, including more worker nodes in the Spark cluster), how the user can use the resources through Azure ML Workbench to speed up experiment runs.
* Run history tracking:  We show the user how Azure ML Workbench can be used to track the performance of ML models and other metrics of interests.
* Operationalization of the machine learning model:  we show the use of the build-in tools within Azure ML Workbench to deploy the trained ML model as web service on Azure Container Service (ACS). We also show how to use the web service to get mini-batch predictions through REST API calls. 
* Support for terabytes data.



## Link to the Gallery GitHub repository

The public GitHub repository for this example contains all materials, including code samples: 
 
[https://github.com/Azure/MachineLearningSamples-BigData](https://github.com/Azure/MachineLearningSamples-BigData)



## Use case overview


Forecasting the workload on servers is a common business need for technology companies that manage their own infrastructure. To reduce infrastructure cost, services running on under-utilized servers should be grouped together to run on a smaller number of machines, and services running on heavy-loaded servers should be given more machines to run. In this scenario, we focus on workload prediction for each machine (or server). In particular, we use the session data on each server to predict the workload class of the server in future. We classify the load of each server into low, medium, and high classes by using Random Forest Classifier in [Apache Spark ML](https://spark.apache.org/docs/2.1.1/ml-guide.html). The machine learning techniques and workflow in this example can be easily extended to other similar problems. 


## Prerequisites

The prerequisites to run this example are as follows:

* An [Azure account](https://azure.microsoft.com/free/) (free trials are available).
* An installed copy of [Azure Machine Learning Workbench](./overview-what-is-azure-ml.md) following the [quick start installation guide](./quickstart-installation.md) to install the program and create a workspace.
* This scenario assumes that you are running Azure Machine Learning (ML) Workbench on Windows 10. If you are using macOS, the instruction is largely the same.
* A Data Science Virtual Machine (DSVM) for Linux (Ubuntu). You can provision an Ubuntu DSVM following the [instructions](https://docs.microsoft.com/azure/machine-learning/machine-learning-data-science-provision-vm). Click [here](https://ms.portal.azure.com/#create/microsoft-ads.linux-data-science-vm-ubuntulinuxdsvmubuntu) for quick start. We recommend using a virtual machine with at least 8 cores and 32 GB of memory.  You need the DSVM IP address, user name, and password to try out this example. Save the following table with the DSVM info for later steps:

 Field Name| Value |  
 |------------|------|
DSVM IP address | xxx|
 User name  | xxx|
 Password   | xxx|

 You can choose to use any virtual machine (VM) with [Docker Engine](https://docs.docker.com/engine/) installed.

* A HDInsight Spark Cluster with HDP version 3.6 and Spark version 2.1.x. Visit [Create an Apache Spark cluster in Azure HDInsight] (https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-jupyter-spark-sql) for details of how to create HDInsight clusters. We recommend using a three-worker cluster with each worker having 16 cores and 112 GB of memory. Or you can just choose VM type "`D12 V2`" for head node and "`D14 V2`" for the worker node. The deployment of the cluster takes around 20 minutes. You need the cluster name, SSH user name, and password to try out this example. Save the following table with the Azure HDInsight cluster info for later steps:

 Field Name| Value |  
 |------------|------|
 Cluster name| xxx|
 User name  | xxx (by default, it is sshuser)|
 Password   | xxx|


* An Azure Storage account. You can follow the [instructions](https://docs.microsoft.com/azure/storage/common/storage-create-storage-account) to create an Azure storage account. Also, create two private Blob containers with name "`fullmodel`" and "`onemonthmodel`" in this storage account. The storage account is used to save intermediate compute results and machine learning models. You need the storage account name and access key to try out this example. Save the following table with the Azure storage account  info for later steps:

 Field Name| Value |  
 |------------|------|
 Storage account name| xxx|
 Access key  | xxx|


The Ubuntu DSVM and the Azure HDInsight cluster created in the pre-requisite list are compute targets. Compute targets are the compute resource in the context of Azure ML Workbench, which might be different from the computer where Azure ML Workbench runs.   

## Create a new Workbench project

Create a new project using this example as a template:
1.	Open Azure Machine Learning Workbench
2.	On the **Projects** page, click the **+** sign and select **New Project**
3.	In the **Create New Project** pane, fill in the information for your new project
4.	In the **Search Project Templates** search box, type "Workload Forecasting on Terabytes Data" and select the template
5.	Click **Create**

You can create an Azure ML Workbench project with a pre-created git repository by following this [instruction](./tutorial-classifying-iris-part-1.md).  
Run git status to inspect the status of the files for version tracking.

## Data description

The data used in the scenario is synthesized server workload data and is hosted in an Azure blob storage account that's publically accessible. The specific storage account info can be found in the `dataFile` field of [`Config/storageconfig.json`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Config/fulldata_storageconfig.json). You can use the data directly from the Azure blob storage. In the event that the storage is used by many users simultaneously, you can opt to use [azcopy](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-linux) to download the data into your own storage. 

The total data size is around 1 TB. Each file is around 1-3 GB and is in CSV file format without header. Each row of data represents the load of a transaction on a particular server.  The detailed information of the data schema is as follows:

Column Number | Field Name| Type | Description |  
|------------|------|-------------|---------------|
1  | `SessionStart` | Datetime |	Session start time
2  |`SessionEnd`	| Datetime | Session end time
3 |`ConcurrentConnectionCounts` | Integer |	Number of Concurrent Connections
4 | `MbytesTransferred`	| Double | Normalized data transferred in Megabytes
5 | `ServiceGrade` | Integer |	Service grade for the session
6 | `HTTP1` | Integer|	whether the session uses HTTP1 or HTTP2
7 |`ServerType` | Integer	|Server type
8 |`SubService_1_Load` | Double |	Subservice 1 load
9 | `SubService_1_Load` | Double | 	Subservice 2 load
10 | `SubService_1_Load` | Double | 	Subservice 3 load
11 |`SubService_1_Load`	| Double |  Subservice 4 load
12 | `SubService_1_Load`| Double |  	Subservice 5 load
13 |`SecureBytes_Load`	| Double | Secure bytes load
14 |`TotalLoad`	| Double | Total load on server
15 |`ClientIP` | String|	Client IP address
16 |`ServerIP` | String|	Server IP address



Note while the expected data types are listed in the preceding table, due to missing values and dirty-data problems, there is no guarantee that the data types is as expected and processing of the data should take this into consideration. 


## Scenario structure

The files in this example are organized as follows.

| File Name | Type | Description |
|-----------|------|-------------|
| `Code` | Folder | The  folder contains all the code in the example |
| `Config` | Folder | The  folder contains the configuration files |
| `Image` | Folder | The folder  used to save images for the README file |
| `Model` | Folder | The folder used to save model files downloaded from Azure Blob storage |
| `Code/etl.py` | Python file | the Python file used for data preparation and feature engineering |
| `Code/train.py` | Python file | The Python file used to train a three-class multi-classfication model  |
| `Code/webservice.py` | Python file | The Python file used for operationalization  |
| `Code/scoring_webservice.py` | Python file |  The Python file used for data transformation and calling the web service |
| `Code/O16Npreprocessing.py` | Python file | The Python file used to preprocess the data for scoring_webservice.py.  |
| `Code/util.py` | Python file | The Python file, which contains code for reading and writing Azure blobs.  
| `Config/storageconfig.json` | JSON file | The configuration file for the Azure blob container that stores the intermediate results and model for processing and training on one-month data |
| `Config/fulldata_storageconfig.json` | Json file |  The configuration file for the Azure blob container that stores the intermediate results and model for processing and training on full dataset|
| `Config/webservice.json` | JSON file | The configuration file for scoring_webservice.py|
| `Config/conda_dependencies.yml` | YAML file | The Conda dependency file |
| `Config/conda_dependencies_webservice.yml` | YAML file | The Conda dependency file for web service|
| `Config/dsvm_spark_dependencies.yml` | YAML file | the Spark dependency file for Ubuntu DSVM |
| `Config/hdi_spark_dependencies.yml` | YAML file | the Spark dependency file for HDInsight Spark cluster |
| `README.md` | Markdown file | The README markdown file |
| `Code/download_model.py` | Python file | The Python file used to download the  model files from Azure Blob to local disk |
| `Docs/DownloadModelsFromBlob.md` | Markdown file | The markdown file, which contains the instruction of how to run `Code/download_model.py` |



### Data flow

The code in [`Code/etl.py`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Code/etl.py)  loads data from the publicly accessible container (`dataFile` field of [`Config/storageconfig.json`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Config/fulldata_storageconfig.json)). It includes data preparation and feature engineering, and saves the intermediate compute results and models to your own private container. The code in [`Code/train.py`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Code/train.py) loads the intermediate compute results from the private container, trains the multi-class classification model, and finally writes the trained machine learning model to the private container. It is recommended that the user uses one container for experimentation on the one-month dataset and then another one for experimentation on the full dataset. Since the data and models are saved as Parquet file, each file is actually a folder in the container, containing multiple blobs. The resulting container looks as follows:

| Blob Prefix Name | Type | Description |
|-----------|------|-------------|
| featureScaleModel | Parquet | Standard scaler model for numeric features |
| stringIndexModel | Parquet | String indexer model for non-numeric features|
| oneHotEncoderModel|Parquet | One-hot encoder model for categorical features |
| mlModel | Parquet | trained machine learning model |
| info| Python pickle file | information about the transformed data, including training start, training end, duration, the timestamp for train-test splitting and columns for indexing and one-hot encoding.

All the files/blobs in the preceding table are used for operationalization.


### Model development

#### Architecture diagram


The following diagram shows the end-to-end workflow of using Azure ML Workbench to develop the model:
![architecture](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Images/architecture.PNG)



In the following, we show the model development by using the remote compute target functionality in Azure ML workbench. We first load a small sample data and run the script [`Code/etl.py`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Code/etl.py) on an Ubuntu DSVM for fast iteration. We can further limit the work we do in  [`Code/etl.py`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Code/etl.py) by passing an extra argument for faster iteration. In the end, we use a HDInsight cluster to train with full data.     

The  [`Code/etl.py`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Code/etl.py) file performs loading the data, data preparation, and feature engineering. It accepts two arguments: (1) a configuration file for Azure Blob storage container for storing the intermediate compute results and models, (2) debug config for faster iteration.

The first argument, `configFilename`, is a local configuration file where you store the Azure Blob storage information and specify where to load the data. By default, it is  [`Config/storageconfig.json`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Config/storageconfig.json) and it is going to be used in the one-month-data run. We also include [`Config/fulldata_storageconfig.json`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Config/fulldatastorageconfig.json), which you need to use on the full-dataset run. The content in the configuration is as follows: 

| Field | Type | Description |
|-----------|------|-------------|
| storageAccount | String | Azure Storage account name |
| storageContainer | String | Container in Azure Storage account to store intermediate results |
| storageKey | String |Azure Storage account access key |
| dataFile|String | Data source files  |
| duration| String | duration of data in the data source files|

Modify both `Config/storageconfig.json` and `Config/fulldata_storageconfig.json` to configure the storage account, storage key, and the blob container to store the intermediate results. By default, the blob container for one-month-data run is "`onemonthmodel`" and the blob container for full-dataset run is "`fullmodel`." Make sure you create these two containers in your storage account. The `"dataFile"` field in [`Config/fulldata_storageconfig.json`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Config/fulldatastorageconfig.json) configures what data is loaded in [`Code/etl.py`](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Code/etl.py) and `"duration"` configures the range the data includes. If the duration is set to 'ONE_MONTH', the data loaded should be just one csv file among the seven files of the data for June-2016. If the duration is 'FULL', the full dataset, which is 1 TB, is loaded. You don't need to change `"dataFile"` and `"duration"` in these two configuration files.

The second argument is DEBUG. Setting it to 'FILTER_IP' enables a faster iteration. Use of this parameter is helpful when you want to debug your script.

> [!NOTE]
> Replace any argument variable in all the following commands with its actual value.
> 


#### Model development on the Docker of Ubuntu DSVM

#####  1. Setting up the compute target for Docker on Ubuntu DSVM

Start the commandline from Azure ML Workbench by clicking "File" menu in the top left corner of Azure ML Workbench  and choosing "Open Command Prompt",  then run 

```az ml computetarget attach --name dockerdsvm --address $DSVMIPaddress  --username $user --password $password --type remotedocker```

Once the commandline is successfully finished executing, you will see the following two files created in aml_config folder of your project:

    dockerdsvm.compute: contains the connection and configuration information for a remote execution target
    dockerdsvm.runconfig: set of run options used when executing within the Azure ML Workbench application

Navigate to dockerdsvm.runconfig and change the configuration of the following fields as shown below:

    PrepareEnvironment: true 
    CondaDependenciesFile: Config/conda_dependencies.yml 
    SparkDependenciesFile: Config/dsvm_spark_dependencies.yml

Prepare the project environment by running:

```az ml experiment prepare -c dockerdsvm```


By setting "PrepareEnvironment" to true, you allow Azure ML Workbench to create the runtime environment whenever you submit a job. `Config/conda_dependencies.yml` and `Config/dsvm_spark_dependencies.yml` contains the customization of the runtime environment. You can always modify the Conda dependencies, Spark configuration, and Spark dependencies by editing these two YMAL files. For this example, we added `azure-storage` and `azure-ml-api-sdk` as extra python packages in  `Config/conda_dependencies.yml`, and we added "`spark.default.parallelism`", "`spark.executor.instances`", and "`spark.executor.cores` etc. in `Config/dsvm_spark_dependencies.yml`. 

#####  2. Data preparation and feature engineering on DSVM Docker

Run the script `etl.py` on DSVM Docker with debug parameter that filters the loaded data with specific server IP addresses:

```az ml experiment submit -t dockerdsvm -c dockerdsvm ./Code/etl.py ./Config/storageconfig.json FILTER_IP```

Navigate to the side panel, click "Run" to see the run history of  `etl.py`. Notice that the run time is around two minutes. If you plan to change your code to include new features , providing FILTER_IP as the second arguments provides a faster iteration. You might need to run this step multiple times when dealing with your own machine learning problems to explore the dataset or create new features. With the customized restriction on what data to load and further filtering of what data to process, you can  thus speed up the iteration process in your model development. As you experiment, you should periodically save the changes in your code to the git repository.  Note that we used the following code in `etl.py` to enable the access to the private container:

```python
def attach_storage_container(spark, account, key):
    config = spark._sc._jsc.hadoopConfiguration()
    setting = "fs.azure.account.key." + account + ".blob.core.windows.net"
    if not config.get(setting):
        config.set(setting, key)

# attach the blob storage to the spark cluster or VM so that the storage can be accessed by the cluster or VM        
attach_storage_container(spark, storageAccount, storageKey)
```


Next,  run the script `etl.py` on DSVM Docker without debug parameter FILTER_IP

```az ml experiment submit -t dockerdsvm -c dockerdsvm ./Code/etl.py ./Config/storageconfig.json FALSE```

Navigate to the side panel, click "Run" to see the run history of  `etl.py`. Notice that the run time is around four minutes. The processed result of this step is saved into the container and is  loaded for training in train.py. In addition, the string indexers, encoder pipelines, and the standard scalers are also saved to the private container and  is used in operationalization (O16N). 


##### 3. Model training on DSVM Docker

Run the script `train.py` on DSVM Docker:

```az ml experiment submit -t dockerdsvm -c dockerdsvm ./Code/train.py ./Config/storageconfig.json```

This step loads the intermediate compute results from the run of `etl.py` and  trains a machine learning model. This step takes around two minutes.

Once you have successfully finished the experimentation on the small data, you can then continue to run the experimentation on the full dataset. You can start off by using the same code and then experiment with argument and compute target changes.  

####  Model development on the HDInsight cluster

##### 1. Create compute target in Azure ML workbench for the HDInsight cluster

```az ml computetarget attach --name myhdi --address $clustername-ssh.azurehdinsight.net --username $username --password $password --type cluster```

Once the commandline is successfully finished, you see the following two files created in aml_config folder:
    
    myhdo.compute: contains connection and configuration information for a remote execution target
    myhdi.runconfig: set of run options used when executing within the Azure ML Workbench application


Navigate to myhdi.runconfig and change the configuration of the following fields as shown below:

    PrepareEnvironment: true 
    CondaDependenciesFile: Config/conda_dependencies.yml 
    SparkDependenciesFile: Config/hdi_spark_dependencies.yml

Prepare the project environment by running:

```az ml experiment prepare -c myhdi```

This step can take up to seven minutes.

##### 2. Data preparation and feature engineering on HDInsight cluster

Run the script `etl.py` with fulldata on HDInsight cluster

```az ml experiment submit -a -t myhdi -c myhdi ./Code/etl.py Config/fulldata_storageconfig.json FALSE```

Since this job lasts for a relatively long time (around two hours), we can use "-a" to disable output streaming. Once the job is done, in the "Run History", you can look into the driver log and also the controller log. If you have a larger cluster, you can always reconfigure the configurations in `Config/hdi_spark_dependencies.yml` to use more instances or more cores. For example, if you have a four-worker-hode cluster, you can increase the value of "`spark.executor.instances`" from 5 to 7. You can see the output of this step in the "fullmodel" container in your storage account. 


##### 3. Model training on HDInsight cluster

Run the script  `train.py` on HDInsight cluster:

```az ml experiment submit -a -t myhdi -c myhdi ./Code/train.py Config/fulldata_storageconfig.json```

Since this job lasts for a relatively long time（around half hour), we use "-a" to disable output streaming.

#### Run history exploration

Run history is a feature that enables tracking of your experimentation in Azure ML Workbench. By default, it tracks the duration of the experimentation. In our specific example, when we move to the full dataset for "`Code/etl.py`" in the experimentation, we notice that duration significantly increases. You can also log specific metrics for tracking purposes. To enable metric tracking, add in the following lines of code to the head of your python file:
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

Navigate to "Runs" on the right sidebar of Azure ML Workbench to see the run history for each python file. 
In addition, go to your github repository, a new branch with name staring with "AMLHistory" is created to track the change you made to your script in each run. 


### Operationalization

In this section, we operationalize the model we created in the previous steps as web service and demo how we can use the web service to predict workload. We use Azure ML Operationalization Command-Line Interfaces (CLIs) to package the code and dependencies as Docker images and publish the model as containerized web service. Refer to  [Operationalization Overview](https://github.com/Azure/Machine-Learning-Operationalization/blob/master/documentation/operationalization-overview.md) for more details. You can use the commandline prompt in Azure ML Workbench to run the Azure ML Operationalization CLIs.  You can also run the  Azure ML Operationalization CLIs on Ubuntu Linux by following the [installation guide](https://github.com/Azure/Machine-Learning-Operationalization/blob/master/documentation/install-on-ubuntu-linux.md). 

> [!NOTE]
> Replace any argument variable in all the following commands with its actual value. It takes around 40 minutes to finish this section.
> 


Choose a unique string as the environment for operationalization and we use the string "[unique]" to represent the string you choose.

1. Create the environment for operationalization and create the  resource group.

```az ml env setup -c -n [unique] --location eastus2 --cluster -z 5 --yes ```

Note we choose to use Azure Container Service as the environment by using  `--cluster` in `az ml env setup` command. We choose to operationalize the machine learning model on [Azure Container Service](https://docs.microsoft.com/azure/container-service/kubernetes/container-service-intro-kubernetes)  as it uses [Kubernetes](https://kubernetes.io/) for automating deployment, scaling, and management of containerized applications.
This command takes around 20 minutes to run. Use 

```az ml env show -g [unique]rg -n [unique]```

to check if the deployment is finished successfully.

Set the deployment environment as the one you just created by running

```az ml env set -g [unique]rg -n [unique] ```

2. Create a model management account and use the model management account.

Create a  model management account by running

```az ml account modelmanagement create --location  eastus2 -n [unique]acc -g [unique]rg --sku-instances 4 --sku-name S3 ```

Use the model management for operationalization by running

```az ml account modelmanagement set  -n [unique]acc -g [unique]rg ```

Model management account is used to manage the models and web services. From Azure portal, you can see a new model management account is created and you can use it to  see the models, manifests, Docker images, and services that are created by using this model management account.

3. Download and register the models.

Download the models  in the "fullmodel" container to your local machine in the directory of code. Do not download the parquet data file with name "vmlSource.parquet" as it is not a model file but an intermediate compute result. You can also reuse the model files we have included in the git repository. Visit [DownloadModelsFromBlob.md](https://github.com/Azure/MachineLearningSamples-BigData/blob/master/Docs/DownloadModelsFromBlob.md) for details of downloading the parquet files. 

Go to the `Model` folder in the CLI and register the models as follows:

```az ml model register -m  mlModel -n vmlModel -t fullmodel ```

```az ml model register -m  featureScaleModel -n featureScaleModel -t fullmodel```

```az ml model register -m  oneHotEncoderModel -n  oneHotEncoderModel -t fullmodel```

```az ml model register -m  stringIndexModel -n stringIndexModel -t fullmodel```

```az ml model register -m  info -n info -t fullmodel```

The output of each command gives a model ID which is needed in the next step. Save them in a text file for future use.

4. Create manifest for the web service.

Manifest is the recipe which is used to create of the Docker image for web service containers. It includes the code for the web service, all the machine learning models and run-time environemnt dependencies.  Go to the `Code` folder in the CLI and  run the command line:

```az ml manifest create -n $webserviceName -f webservice.py -r spark-py -c ../Config/conda_dependencies_webservice.yml -i $modelID1 -i $modelID2 -i $modelID3 -i $modelID4 -i $modelID5```

The output gives a manifest ID for the next step. 

Stay in the `Code` directory, and you can test webservice.py by running 

```az ml experiment submit -t dockerdsvm -c dockerdsvm webservice.py```

5. Create a Docker image. 

```az ml image create -n [unique]image --manifest-id $manifestID```

The output gives an image ID for the next step as this docker image is used in ACS. 

6. Deploy the web service to the ACS cluster

```az ml service create realtime -n [unique] --image-id $imageID --cpu 0.5 --memory 2G ```

The output gives a service ID, and you need to use it to get the authorization key and service URL.

7. Call the webservice in Python code to score in mini-batches.

Use the following command  to get the authorization key

``` az ml service keys realtime -i $ServiceID ``` 

and use the following command  to get the service scoring URL

` az ml service usage realtime -i $ServiceID`

Modify the content in `./Config/webservice.json` with the right service scoring URL and authorization key (keep the "Bearer " in the original file and replace the "xxx" part). 
Go to the root directory of your project, and test the web service for mini-batch scoring by using

```az ml experiment submit -t dockerdsvm -c dockerdsvm ./Code/scoring_webservice.py ./Config/webservice.json```

8. Scale the web service. 

Refer to [How to scale operationalization on your ACS cluster](https://github.com/Azure/Machine-Learning-Operationalization/blob/master/documentation/how-to-scale.md) to scale the web service.
 

## Conclusion

This example highlights how to use Azure ML Workbench to train a machine learning model on big data and operationalize the trained model. In particular, we showed how to:

* Configure and use different compute targets.

* Run history of tracking metrics and different runs.

* Operationalization.

Users can extend the code to explore cross-validation  and hyper-parameter tuning. To learn more about cross-validation and hyper-parameter tuning, visit https://github.com/Azure/MachineLearningSamples-DistributedHyperParameterTuning.  
To learn more about time-series forecasting, visit https://github.com/Azure/MachineLearningSamples-EnergyDemandTimeSeriesForecasting.
