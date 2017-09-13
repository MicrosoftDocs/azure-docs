# Vienna on Terabytes Data

[//]: # "![Data_Diagram](https://www.usb-antivirus.com/wp-content/uploads/2014/11/tutorial-windwos-10-2-320x202.png)"

* Documentation site for GitHub repository (TODO).

[//]: # (**The above info will be included in the Readme on GitHub**)

## Prerequisites
[//]: # (Please note this section will be included in the Readme file on GitHub repo.) 
The prerequisites to run this example are as follows:

1. Make sure that you have properly installed Azure ML Workbench by following the [installation guide](https://github.com/Azure/ViennaDocs/blob/master/Documentation/Installation.md).
[//]: # (2. For operationalization, it is best if you have Docker engine installed and running locally. If not, you can use the cluster option.  Notice that running an (ACS) Azure Container Service can be expensive.)
1. This tutorial assumes that you are running Azure ML Workbench on Windows 10 with Docker engine locally installed. If you are using macOS, the instruction is largely the same.
1. a Data Science Virtual Machine for Linux (Ubuntu)] (https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu) with at least 32-GB memory. 
1. an HDInisght Spark Cluster with HDP version 3.6 and Spark version 2.1.1. Visit [Create an Apache Spark cluster in Azure HDInsight] (https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-jupyter-spark-sql) for details of how to create HDInsight clusters. We suggest using a three-worker cluster with each worker having 16 cores and 112-GB memory.
1. an Azure Storage account. Also create two Blob containers with name "`fullmodel`" and "`onemonthmodel`" in this storage account. The storage account is used to save intermediate compute results and machine learning models. 

The Data Science Virtual Machine (DSVM)  and the HDInsight cluster created in the pre-requisite list  are the compute targets. Compute targets are the compute resource in the context of AML Workbench, which might be different the computer where Azure ML Workbench runs. 

## Introduction
[//]: # (Please note this section will be included in the Readme file on GitHub repo.) 

[//]: # (A brief description on what your tutorial is about, what users expect to get out of your tutorial, what Vienna capabilities your tutorial will highlight.)

This tutorial illustrates how data scientists can use Azure ML Workbench to develop solutions that requires use of big data.  We show by using Azure ML Workbench a happy path of starting from a fraction of a large dataset, iterating the data preparation, feature engineering and machine learning on the fraction, and extending to the full dataset. 

Along the way, we show the following key capabilities of Azure ML Workbench:
<ul>
    <li>Easy switch between Compute Targets:</li>We show how to set up different compute targets and use them in your experimentation. In this tutorial, we use Linux DSVM and an HDInsight cluster as the compute targets. We also show how to config the compute targets  depending on the availability of resources. In particular, after scaling out your cluster (that is, including more worker nodes in your cluster), how you can use the resources through Azure ML Workbench to speed up your experiment.
    <li>Run History Tracking: </li> We show you how Azure ML Workbench can be used as a way to track the performance of your model and other metrics of interests
    <li>Operationalization of Machine Learning Model: </li> we  show how to use of the build-in tools of Azure ML Workbench to deploy the machine learning model as web service on Azure Container Service, and  how to use the web service to get mini-batch predictions through REST API Calls. 
    <li> Azure ML Workbench's capability to support Terabytes data.
</ul>

## Use Case Overview

[//]: # (Note this section is included in the Readme file on GitHub repo.) 

Forecasting the workload on servers or a group of servers is a common business need for technology companies that manage their own infrastructure. To reduce infrastructure cost, services running on under-utilized servers should be grouped together to run on a smaller number of machines, and services running on heavy-loaded servers should be given more machines to run. In this tutorial, we focused on workload prediction of each machine (or server). Particularly, we classify the load of each server into low, medium, and high classes by using Random Forest Classification in spark.ml. The machine learning techniques and workflow in this tutorial can be easily extended to other similar problems.   

## Data Description

The data used in the tutorial is synthesized server workload data hosted in blob storage account. You can use the data directly from the blob storage. In case that the storage is used by many users at the same time,  you can also use azcopy to download the data to your own storage. 

The total data size is around 1 TB. Each file is around 1-3 GB in csv file format without header. Each row of the data represents the load of a transaction on a particular server.  The detail info of the data is 

Column number | Field Name| Type | Description |  
|------------|------|-------------|---------------|
1  | `SessionStart` | Datetime |	Session start time
2  |`SessionEnd`	| Datetime Session end time
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




Note while the expected data types are listed in the preceding table, due to missing values and dirty-data problem, there is no guarantee that the data types is as expected and processing of the data should take this into consideration. 


## Scenario  Structure

The files in this example are organized as follows.

| File Name | Type | Description |
|-----------|------|-------------|
| `Code` | Folder | The  folder contains all the code in the example |
| `Config` | Folder | The  folder contains the customized configuration |
| `Image` | Folder | The folder  used to save images for the README file |
| `Models` | Folder | The folder used to save model files downloaded from Azure Blob storage |
| `Code/etl.py` | Python file | the Python file used for data preparation and feature engineering |
| `Code/train.py` | Python file | The Python file used to train a three-class multi-classfication model  |
| `Code/webservice.py` | Python file | The Python file used for operationalization  |
| `Code/scoring_webservice.py` | Python file |  The Python file used for data preparation and calling the webservice |
| `Code/O16Npreprocessing.py` | Python file | The Python file used to preprocess the data for scoring_webservice.py |
| `Config/storageconfig.json` | Json file | The configuration file for blob container that stores the intermediate results and model for processing and training on one-month data |
| `Config/fulldata_storageconfig.json` | Json file |  The configuration file for blob container that stores the intermediate results and model for processing and training on full dataset|
| `Config/webservice.json` | Json file | The configuration file for scoring_webservice.py|
| `Config/conda_dependencies.yml` | YAML file | The Conda dependency file |
| `Config/dsvm_spark_dependencies.yml` | YAML file | the spark dependency file for Linux DSVM |
| `Config/hdi_spark_dependencies.yml` | YAML file | the spark dependency file for HDInsight Spark cluster |
| `readme.md` | Markdown file | The README markdown file |


You can create an AML Workbench project with a pre-created git repository. In the project directory, clone the tutorial Git repository to download the files. Run git status to inspect the status of the files as for version tracking. Go to "Code" folder and run "git status" to see all the files.

### Data Ingestion & Flow

The code in `Code/etl.py`  loads data from a publicly accessible container [TODO]. It includes data preparation and feature engineering, and saves the intermediate data results and models to your own private container. The code in `Code\train.py` loads the intermediate data result from the private container, trains the multi-class classification model, and write the trained machine learning model to the private container. You can use one container for experimentation on one-month dataset and another for  experimentation on the full dataset. Since the data and model are saved as Parquet file, each is actually folder in the container, containing multiple blobs. The resulting container look as follows:

| Blob Prefix Name | Type | Description |
|-----------|------|-------------|
| vfeatureScaleModel | Parquet | Standard scaler model for numeric features |
| vstringIndexModel | Parquet | String indexer model for non-numeric features|
| voneHotEncoderModel|Parquet | One-hot encoder model for categorical features |
| vmlModel | Parquet | trained machine learning model |
| info.csv| CSV | information about the transformed data, including training start, training end, columns for indexing and one-hot encoding.

These files are used in operationalization.


### Experimentation

In the following, We show how to use remote compute target functionality in AML workbench. We first load small amount of data and run the etl.py in a linux DSVM for fast iteration. We can further limit the work we do in etl.py by passing an extra argument for faster iteration. In the end, we use a HDInsight cluster to train with full data.     

The `Code/etl.py` file contains loading data, data preparation, and feature engineering.  we have included two arguments: (1) a configuration file for Azure Blob storage container for storing the intermediate compute results and models, (2) debug config for faster iteration.

The first argument is a local configuration file where you store the Azure Blob storage info and specify where to load data. By default, it is `Code/storageconfig.json` and it's going to be used in the one-month-data run. And we also include `Code\fulldata_storageconfig.json` in the Code folder, which you  need to use in the full-dataset run. Modify the json files to configure the storage account, storage key, and the blob container to store the intermediate results. By default, the blob container for one-month-data run is "`onemonthmodel`" and the blob container for full-dataset run is "`fullmodel`." Make sure you create these two containers in your storage account. Last but not the least, the `"dataFile"` in storageconfig.json configures what data is loaded in etl.py and `"duration"` configures the range the data includes. If the duration is set to 'ONE_MONTH',  the data loaded should be just one csv file among the seven files of the data for June  2016. If the duration is 'FULL',  the full dataset, which is 1 TB, is loaded. You don't need to change `"dataFile"` and `"duration"` in the two configuration files.

Setting the debug  to 'FILTER_IP' enables a faster iteration. Use of this parameter is helpful when you want to debug your script.

#### Run the Experiment on the Docker of Linux DSVM

#####  Setting up the compute target for Docker on Linux DSVM

Start the commandline from Azure ML Workbench, and run 

```az ml computetarget attach --name dockerdsvm --address $DSVM_IP  --username $user --password $password --type remotedocker```

Once the commandline is successfully finished, you will see two following two files created in aml_config folder:
dockerdsvm.compute: contains connection and configuration information for a remote execution target
dockerdsvm.runconfig: set of run options used when executing within the Azure ML Workbench application

Navigate to dockerdsvm.runconfig and change the configuration as follows:  
```PrepareEnvironment: true```, 

```CondaDependenciesFile: Config/conda_dependencies2.yml```, 
 
   
```SparkDependenciesFile: Config/dsvm_spark_dependencies.yml```. 

By setting "PrepareEnvironment" to true, you allow Azure ML Workbench to create the runtime environment whenever you submit a job. `Config/conda_dependencies.yml` and `Config/dsvm_spark_dependencies.yml` contains the customization of the runtime environment. You can always modify the Conda dependencies, also Spark configuration and Spark dependencies by editing the two YMAL files.

[//]: #  (az ml experiment prepare -t dockerdsvm -d aml_config/conda_dependencies2.yml -c dockerdsvm)






#####  Run `Code/etl.py` on DSVM Docker with debug parameter FILTER_IP

```az ml experiment submit -t dockerdsvm -c dockerdsvm ./Code/etl.py ONE_MONTH FILTER_IP ./Config/storageconfig.json```

In the run history, you notice the run time is around two minutes. With this argument, you see a faster iteration if you plan to change your code to include new features. You might need to run this step multiple times in practice when dealing with your own machine learning problems to explore the dataset or create new features. With the customized restriction on what data to load and the customized filtering of what data to process, you can run your experimentation fast. Along the way of experimentation, you should save the change of your code to the git repo any time you feel necessary.  



##### Run etl.py on DSVM Docker without debug parameter FILTER_IP

```az ml experiment submit -t dockerdsvm -c dockerdsvm ./Code/etl.py ONE_MONTH FALSE ./Code/storageconfig.json```

In the run history, you will notice the run time is around 6 minutes. The processed result of this step is saved into the container and will be loaded for training in train.py. In addition, the StringIndexder, Encoder pipeline, and the feature scalers are also saved and will be used in operationalization (O16N). 




##### Run train.py on DSVM Docker

```az ml experiment submit -t dockerdsvm -c dockerdsvm ./Code/train.py ./Config/storageconfig.json```



Once you have successfully finished the experimentation on the small data, you can continue to run the experimentation on the full dataset. You can continue by using the same code with argument changes and compute target changes.  

####  Run the Experiment on the Docker of HDInsight Cluster

##### Create compute target in Azure ML workbench for the HDInsight cluster

```az ml computetarget attach --name myhdi --address $clustername-ssh.azurehdinsight.net --username sshuser --password $Ppassword --type cluster```

Once the commandline is successfully finished, you will see two following two files created in aml_config folder:
myhid.compute: contains connection and configuration information for a remote execution target
myhdi.runconfig: set of run options used when executing within the Azure ML Workbench application

Navigate to myhdi.runconfig and change the configuration as follows:  
```PrepareEnvironment: true```


##### Run `etl.py` with fulldata on HDInsight cluster

```az ml experiment submit -a -t myhdi -c myhdi -d Config/conda_dependencies.yml -s  Config/hdi_spark_dependencies.yml ./Code/etl.py FULL FALSE Config/fulldata_storageconfig.json```

Since this job lasts a relatively long time （around two hours） we use "-a" to disable output streaming. We also suggest you try this step lightly. Once the job is done, in the "Run History", you can look into the driver log and also the controller log. If you have a larger cluster, you can always reconfig the configuraions in Config/hdi_spark_dependencies.yml to use more instances or more cores. You can also see the output of this step in the "fullmodel" container in your storage account. 



##### Run `train.py` on HDInsight cluster

```az ml experiment submit -a -t myhdi -c myhdi -d Config/conda_dependencies.yml -s  Config/hdi_spark_dependencies.yml ./Code/train.py Config/fulldata_storageconfig.json```

Since this job lasts a relatively long time （around half hour）, we use "-a" to disable output streaming.

#### Run History Exploration

Run history is a feature that enables tracking of your experimentation in Azure ML Workbench. By default, it tracks the duration of the experimentation. In our specific example, when we move to the full dataset for the etl.py in the experimentation, we notice that duration of significantly increases. You can also log specific metrics for tracking purpose.  Look into the code and search for "run_logger" to see how to enable metric tracking.  Navigate to "Runs" on the sidebar of Azure ML Workbench to see the run history of each python file. 


### Operationalization

In this section, we operationalize the model we create in the previous steps as a web service and demo how we can use the web service to fulfill prediction needs. Choose a unique string as the environment for operationalization.

1. Create the environment for operationalization and create the  resource group:

```az ml env setup -c -n [unique] --location eastus2 --cluster -z 5 -l eastus2 --yes ```

```az ml env set -g [unique]rg -n $unique ```
Please note here we choose to use Azure Container Service as the environment

2. Create the model management account and use the model management account:

```az ml account modelmanagement create --location  eastus2 -n [unique]acc -g [unique]rg --sku-instances 4 --sku-name S3 ```


```az ml account modelmanagement set  -n [unique]acc -g [unique]rg ```

3. Download and register the models

Download the models  in the "fullmodel" container to your local machine in the directory of code. Do not download the parquet data file with name "vmlSource.parquet". Register the models as follows:

```az ml model register -m vmlModel -n vmlModel -t fullmodel ```

```az ml model register -m  vfeatureScaleModel -n fullmodelvfeatureScaleModel -t fullmodel```

```az ml model register -m  voneHotEncoderModel -n  voneHotEncoderModel -t fullmodel```

```az ml model register -m  vstringIndexModel -n vstringIndexModel -t fullmodel```

```az ml model register -m  info.pickle -n info.pickle -t fullmodel```

The output of each command gives a model ID and is needed in the next step.

4. Create manifest for the web service
```az ml manifest create -n $webserviceName -f webservice.py -r spark-py -c conda_dependencies.yml -i $modelID1 -i $modelID2 -i $modelID3 -i $modelID4```

The output gives a manifest ID for the next step. 

You can test webservice.py by running 
```az ml experiment submit -t dockerdsvm -c dockerdsvm ./Code/webservice.py ./Code/fulldata_storageconfig.json ```

5. Create a Docker image 

```az ml image create -n [unique]image --manifest-id $manifestID```

The output gives an image ID for the next step as this docker image is used in ACS. 

6. Deploy the web service to the ACS cluster

```az ml service create realtime -n [unique] --image-id $imageID --cpu 0.5 --memory 2G ```
The output gives a service ID.

7. Call the webservice in python code to score in mini-batches.

You can test the web service by using

```az ml experiment submit -t dockerdsvm -c dockerdsvm ./Code/scoring_webservice.py ./Code/fulldata_storageconfig.json```

## Conclusion & Next Steps

This example highlights how to use Azure ML Workbench to train a machine learning model on big data and operationalize the trained model. In particular, we showed:

* Use and configure different compute targets.

* Run history for tracking metrics and different runs.

* Operationalization.

Users can extend the code to explore  cross-validation and hyper-parameter tuning. 
[TODO: Reference Angus's or Jaya's Tutorial.]


## Contact

Feel free to contact Daisy Deng (daden@microsoft.com) with any question or comment.

## Disclaimer

_TODO_














