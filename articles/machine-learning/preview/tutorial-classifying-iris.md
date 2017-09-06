---
title: Iris Tutorial for Machine Learning Server | Microsoft Docs
description: This full-length tutorial shows how to use Azure Machine Learning end-to-end.
services: machine-learning
author: hning86
ms.author: haining
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: hero-article
ms.date: 09/06/2017
---

# Tutorial: Classifying Iris

In this tutorial, we show you the basics of Azure ML preview features by creating a data preparation package, building a model and operationalizing it as a real-time web service. To make things simple, we use the timeless [Iris flower dataset](https://en.wikipedia.org/wiki/Iris_flower_data_set). The instructions and screenshots are created for Windows, but they are similar, if not identical, for macOS.

## Step 1. Launch Azure ML Workbench
Follow the [installation guide](Installation.md) to install Azure ML Workbench desktop application, which also includes command-line interface (CLI). Launch the Azure ML Workbench desktop app and log in if needed.

## Step 2. Create a new project
Click on _File_ --> _New Project_ (or click on the "+" sign in the project list pane). You can also create a new Workspace first from this drop down menu.

![new ws](media/tutorial-classifying-iris/new_ws.png)

Fill in the project name (this tutorial assumes you use `myIris`). Choose the directory the project is going to be created in (this tutorial assumes you choose `C:\Temp`). Enter an optional description. Choose a Workspace (this tutorial uses `IrisGarden`). And then select the `Classifying Iris` template from the project template list. 

![New Project](media/tutorial-classifying-iris/new_project.png)
>Optionally, you can fill in the Git repo field with an existing empty (with no master branch) Git repo on VSTS. Doing so allows you to enable roaming and sharing scenarios later. For more information, please reference the [Using Git repo](UsingGit.md) article and the [Roaming and Sharing](collab.md) article.

Click on _Create_ button to create the project. The project is now created and opened.

## Step 3. Create a Data Preparation package
Open the `iris.csv` file from the File View, observe that the file is a simple table with 5 columns and 150 rows. It has four numerical feature columns and a string target column. Also notice it doesn't have column headers.

![iris.csv](media/tutorial-classifying-iris/show_iris_csv.png)

>Note it is not recommended to include data files in your project folder, particularly when the file size is large. We include `iris.csv` in this template for demonstration purposes because it is tiny. For more information, please reference the [How to Deal with Large Data Files](PersistChanges.md) article.

Under Data Explorer view, click on "+" to add a new data source. This launches the _Add Data Source_ wizard. 

![data view](media/tutorial-classifying-iris/data_view.png)

Select the _File(s)/Directory_ option, and choose the `iris.csv` local file. Accept all the default settings for each screen and finally click on _Finish_. 

![select iris](media/tutorial-classifying-iris/select_iris_csv.png)

>Make sure you select the `iris.csv` file from within the current project directory for this exercise, otherwise latter steps may fail. 

This creates an `iris-1.dsource` file (because the sample project already comes with an `iris.dsource` file) and opens it in the _Data_ view. A series of column headers, from `Column1` to `Column5`, are automatically added to this dataset. Also notice the last row of the dataset is empty, probably because of an extra line break in the csv file.

![iris data view](media/tutorial-classifying-iris/iris_data_view.png)

Now click on the _Metrics_ button. Observe the histograms and a complete set of statistics that are calculated for you for each column. You can also switch over to the _Data_ view to see the data itself. 

![iris data view](media/tutorial-classifying-iris/iris_metrics_view.png)

Now click on the _Prepare_ button next to the _Metrics_ button, and this creates a new file named `iris-1.dprep`. Again, this is because the sample project already comes with an `iris.dprep` file. It opens in Data Prep editor. Now let's do some simple data wrangling.

Rename the column names by clicking on each column header and make the text editable. Enter `Sepal Length`, `Sepal Width`, `Petal Length`, `Petal Width`, and `Species` for the five columns respectively.

![rename columns](media/tutorial-classifying-iris/rename_column.png)

Select the `Species` column, and right-click on it and choose _Value Counts_. 

![value count](media/tutorial-classifying-iris/value_count.png)

This creates a histogram with four bars. Notice our target column has three distinct values, `Iris_virginica`, `Iris_versicolor`, `Iris-setosa`. And there is also one row with a `(null)` value. Let's get rid of this row by selecting the bar representing the null value, and click on the "-" filter button to remove it. 

![value count](media/tutorial-classifying-iris/filter_out.png)

Also notice as you are working on column renaming and filtering out the null value row, each action is recorded as a dataprep step in the _Steps_ pane. You can edit them (to adjust their settings), reorder them, or even remove them.

![steps](media/tutorial-classifying-iris/steps.png)

Now close the DataPrep editor. Don't worry, it is auto-saved. Right click on the `iris-1.dprep` file, and choose _Generate Data Access Code File_. 

![generate code](media/tutorial-classifying-iris/generate_code.png)

This creates an `iris-1.py` file with following two lines of code prepopulated (along with some comments):

```python
# This code snippet will load the referenced package and return a DataFrame.
# If the code is run in a PySpark environment, the code will return a
# Spark DataFrame. If not, the code will return a Pandas DataFrame.

from azureml.dataprep.package import run
df = run('iris.dprep', dataflow_idx=0)
```
This code snippet shows how you can invoke the data wrangling logic you have created as a Data Prep package. Depending on the context in which this code runs, `df` can be a Python Pandas DataFrame if executed in Python runtime, or a Spark DataFrame if executed in a Spark context. For more information on how to use DataPrep in Azure ML Workbench, reference the [Getting Started with Data Preparation](DataPrep_GettingStarted.md) guide.

## Step 4. Review Python Code in `iris_sklearn.py` File
Now, open the `iris_sklearn.py` file.

![open file](media/tutorial-classifying-iris/open_iris_sklearn.png)

>Note the code you see might not be the same as shown in the above screenshots as we update the sample project frequently.

Observe that this script does the following tasks:
1. Invoke the DataPrep package `iris.dprep` as the data source to generate a [Pandas](http://pandas.pydata.org/) dataframe

2. Add some random features to make the problem a little harder to solve. (After all, Iris is a very small dataset that can easily classified with near 100% accuracy.) 

3. Use [scikit-learn](http://scikit-learn.org/stable/index.html) machine learning library to build a simple logistic regression mode. 

4. Serialize the model using [pickle](https://docs.python.org/2/library/pickle.html) into a file in a special `outputs` folder, loads it and de-serializes it back into memory

5. Use the deserialized model to make prediction on a new record. 

6. Plot two graphs -- confusion matrix and multi-class ROC curve -- using [matplotlib](https://matplotlib.org/) library, and save them also in the `outputs` folder.

Also, pay special attention to the `run_logger` object in the Python code. It records regularization rate, and the model accuracy into logs that are automatically plotted in the run history.

Now, open the `conda_dependencies.yml` file under the `aml_config` directory, and observe that this file specifies the Python version and also the `scikit-learn` package and the `matplotlib` package. 

>Note: the `conda_dependencies.yml` file is only relevant if you are targeting Docker container (local or remote) for execution. It has no effect if you are targeting local compute context.

Also notice that the are three pairs of `.runconfig` and `.compute` files, named `local`, `docker-python`, and `docker-spark`. Open the `.runconfig` and `.compute` files for each pair and examine the content. These files control the execution environment and behaviors. For more information on configuring execution environment, please review [Configuring Execution Options](Execution.md) article. And for more information on the specific values in these configuration files, refer to the [Demystifying _aml_config_ Folder](aml_config.md) article.

## Step 5. Execute `iris_sklearn.py` Script in `local` Environment
Let's run the `iris_sklearn.py` script for the first time. This script requires `scikit-learn` and `matplotlib` packages. `scikit-learn` is already installed by Azure ML Workbench. So we need to install `matplotlib`. Open the command-line window by clicking on _Open Command Prompt_ from the _File_ menu. (We refer to this command-line interface window as Azure ML Workbench CLI window, or CLI window for short.)

In the CLI window, type in the following command to install `matplotlib` Python package. It should complete within a minute or so.
```batch
REM install matplotlib
C:\Temp\myIris> pip install matplotlib
```

Back in the Workbench desktop app, in the _Run Control Panel_, choose `local` as the execution environment, `iris_sklearn.py` as the script to run. Fill _Arguments_ field with a value of `0.01`. And click on the _Run_ button. Notice a job is immediately scheduled on the _Jobs_ side panel. The status of the Job goes from `Submitting`, to `Running`, and finally `Completed` in a few seconds.

![run sklearn](media/tutorial-classifying-iris/run_sklearn.png)

Clicking on the job status text triggers a pop-up window that displays the standard output (stdout) of the running script. (Clicking on the script name leads you to the run detail information of that particular run which we discuss later.) When the run is completed, the pop-up window shows the following results: Note your result might be different since we introduce some random features to the training set as you recall.

```text
Python version: 3.5.2 |Continuum Analytics, Inc.| (default, Jul  5 2016, 11:41:13) [MSC v.1900 64 bit (AMD64)]

Iris dataset shape: (150, 5)
Regularization rate is 0.01
LogisticRegression(C=100.0, class_weight=None, dual=False, fit_intercept=True,
          intercept_scaling=1, max_iter=100, multi_class='ovr', n_jobs=1,
          penalty='l2', random_state=None, solver='liblinear', tol=0.0001,
          verbose=0, warm_start=False)
Accuracy is 0.6792452830188679

==========================================
Serialize and deserialize using the outputs folder.

Export the model to model.pkl
Import the model from model.pkl
New sample: [[3.0, 3.6, 1.3, 0.25]]
Predicted class is ['Iris-setosa']
Plotting confusion matrix...
Confusion matrix in text:
[[50  0  0]
 [ 1 37 12]
 [ 0  4 46]]
Confusion matrix plotted.
Plotting ROC curve....
ROC curve plotted.
Confusion matrix and ROC curve plotted. See them in Run History details page.
```

You can fill in some different numerical values in the _Arguments_ field ranging from `0.001` to `10`, and execute it a few more times. This value is fed to the Logistic Regression algorithm in the code, which should give you different results.

## Step 6. Review Run History
In Azure ML Workbench, every script execution is captured as a run history record. You can view the run history of a particular script by entering the _run history_ view.

![run history list view]()

Observe the statistics captured across multiple runs in the graph view and the table view. Play with configurations and filter controls.

Now click on an individual run to see the run detail view. Notice all the statistics of the run is listed in the _Run Properties_ section. The files written into the `outputs` folder are listed in the _Output Files_ section, and can be downloaded or promoted (more on promotion later). The two plots, confusion matrix and multi-class ROC curve, are rendered in the _Output Images_ section. All the log files can also be found in the _Log Files_ section.

![run history details view]()

## Step 7. Execute Scripts in the Local Docker Environment
>Note, in order to accomplish this step, you must have Docker engine locally installed and started. See the installation guide for more details.

Azure ML allows you to easily configure additional execution environments and run your script there. In the `aml_config` folder, two additional environments are specified: `docker-python` and `docker-spark`. Take a quick look at the respective `.compute` and `.runconfig` files under the `aml_config` folder again if you'd like.

In the _Run Control Panel_, choose `docker-python` as the targeted environment, and `iris_sklearn.py` as the script to run. (You can leave the _Arguments_ field blank since the script specifies a default value.) Click on the _Run_ button.

A new job is started in the _Jobs_ pane. If you are running against Docker for the first time, it might take a few minutes to finish. Behind the scene, Azure ML Workbench downloads a base Docker image specified in the `docker-python.compute` file, starts a container based on that image, and installs Python packages specified in the `conda_dependencies.yml` file in the container. It then copies (or references, depending on run configuration) the local copy of the project folder, and then executes the `iris_sklearn.py` script. In the end, you should see the exact same result as you do when targeting `local`.

The Docker base image contains a Spark instance pre-installed and configured. Thus, you can also execute a PySpark script in it. This is a simple way to develop and test your Spark program without having to go through the hassle of installing and configuring Spark yourself. 

Open the `iris_pyspark.py` file, read through it. This script loads the `iris.csv` data file, and uses the Logistic Regression algorithm from the Spark ML library to classify the Iris dataset. Now change the run environment to `docker-spark`, and the script to `iris_pyspark.py`, and run again. This takes a little longer since a Spark session has to be created and started inside the Docker container. You can also see the stdout is different than the stdout of `iris_pyspark.py`.

Do a few more runs and play with different arguments. Open the `iris_pyspark.py` file to see the simple Logistic Regression model built using Spark ML library. And interact with _Job_ pane, run history list view, and run details view of your runs across different execution environments.

## Step 8. Execute Scripts in the Azure ML CLI Window
Launch the command-line window by clicking on _File_ --> _Open Command Prompt_, noice that you are automatically placed in the project folder `C:\Temp\myIris`.

>Important: You **must** use the command-line window opened from Workbench to accomplish the following steps:

First, make sure you log in to Azure. (The desktop app and CLI uses independent credential cache when authenticating with Azure resources.) You only need to do this once, until the cached token expires.

```batch
REM login using aka.ms/devicelogin site.
C:\Temp\myIris> az login

REM list all Azure subscriptions you have access to. 
C:\Temp\myIris> az account list -o table

REM set the current Azure subscription to the one you want to use.
C:\Temp\myIris> az set account -s <subscriptionId>

REM verify your current subscription is set correctly
C:\Temp\myIris> az account show
```
<!--
For more information on authentication in the command line window, please reference [CLI Execution Authentication](Execution.md#cli-execution-authentication). 
-->

Once authenticated and current Azure subscription context is set, type the following commands in the CLI window. 

```batch
REM You don't need to do this if you have installed matplotlib locally from the previous steps.
C:\Temp\myIris> pip install matplotlib

REM Kick off an execution of the iris_sklearn.py file against local compute context
C:\Temp\myIris> az ml experiment submit -c local .\iris_sklearn.py
```

This should give you the exact same result as previously when you kick off the job from the desktop app. You can try also the Docker execution environments:
```
REM Execute iris_sklearn.py in local Docker container Python environment.
C:\Temp\myIris> az ml experiment submit -c docker-python .\iris_sklearn.py 0.01

REM Execute iris_pyspark.py in local Docker container Spark environment.
C:\Temp\myIris> az ml experiment submit -c docker-spark .\iris_pyspark.py 0.1
```

You can even try kicking off many jobs using a simple Python script `run.py`. 

```python
# run.py
import os

reg = 10
while reg > 0.005:
    os.system('az ml experiment submit -c local ./iris_sklearn.py {}'.format(reg))
    reg = reg / 2
```

This script starts an `iris_sklearn.py` job with a _regularization rate_ of `10.0` (a ridiculously large number of course), and cut the rate to half in the following run, and so on, and so forth, until the rate is no smaller than `0.005`.
```
REM Submit iris_sklearn.py multiple times with different regularization rates
C:\Temp\myIris> python run.py
```
When `run.py` finishes, you might see a graph like this in your run history list view.

![run.py graph]()

## Step 8a (optional). Execute in a Docker Container on a Remote Machine
To execute your script in a Docker container on a remote Linux machine, you need to have SSH access (username and password) to that remote machine. And that remote machine must have Docker engine installed and running. The easiest way to obtain such a Linux machine is to create a [Ubuntu-based Data Science Virtual Machine (DSVM)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu) on Azure. (Note the CentOS-based DSVM is NOT supported.) 

Once the VM is created, you can attach the VM as an execution environment by generating a pair of `.runconfig` and `.compute` file using the below command. Let's name the new environment `myvm`.
```batch
REM create myvm compute target
C:\Temp\myIris\> az ml computetarget attach --name myvm --address <IP address> --username <username> --password <password>
```
>Note the IP Address area can also be publicly addressable FQDN (fully qualified domain name), such as `vm-name.southcentralus.cloudapp.azure.com`. It is a good practice to add FQDN to your DSVM and use it here instead of IP address, since you might turn off the VM to save cost. And next time when you start the VM, the IP address might change.

Edit the generated `myvm.runconfig` file under `aml_config` and change the Framework from default `PySpark` to `Python`:
```yaml
"Framework": "Python"
```
>Leaving the framework setting to PySpark should also work fine. But it is a little inefficient if you don't actually need a Spark session to run your Python script.

Now issue the same command as you did before in the CLI window, except this time we target _myvm_:
```batch
REM execute iris_sklearn.py in remote Docker container
C:\Temp\myIris> az ml experiment submit -c myvm .\iris_sklearn.py
```
When the command is executed, the exact same thing happens as if you are using `docker-python` environment, except that it happens on that remote Linux VM. You should observe the exact same output information in the CLI window.

Now let's try Spark in the container. Open File explorer (you can also do this from the CLI window if you are comfortable with basic commands to manipulate files). Make a copy of the `myvm.runconfig` file and name it `myvm-spark.runconfig`. And edit the new file to change the `Framework` setting from `Python` to `PySpark`:
```yaml
"Framework": "PySpark"
```
We leave the `myvm.compute` file alone, since we use the same Docker image on the same VM for Spark execution. In the new `myvy-spark.runconfig`, notice the `target` field points to the same `myvm.compute` file by its name `myvm`.

Type this command to run it in the Spark instance in the remote Docker container:
```batch
REM execute iris_pyspark.py in Spark instance on remote Docker container
C:\Temp\myIris> az ml experiment submit -c myvm-spark .\iris_pyspark.py
```
## Step 8b (optional). Execute in an HDI cluster
You can also try to run this script in an actual Spark cluster. If you have access to a _Spark for Azure HDInsight_ cluster, generate an HDI run configuration using the following command:
```batch
REM create a compute target that points to a HDI cluster
C:\Temp\myIris\> az ml computetarget attach --name myhdi --address <cluster name>-ssh.azurehdinsight.net --username <username> --password <password> --cluster
```
>Note the `username` is the cluster SSH username. The default value is `sshuser` if you don't change it during HDI provisioning. It is NOT ༖༗, which is the other user created during provisioning that allows you to access the admin web UI of the cluster. 

Now issue the following command and the script should run in the HDI cluster:
```batch
REM execute iris_pyspark on the HDI cluster
C:\Temp\myIris> az ml experiment submit -c myhdi .\iris_pyspark.py
```
>Note: When you execute against a remote HDI cluster, you can also view the YARN job execution details at https://<cluster_name>.azurehdinsight.net/yarnui using the `admin` user account.

## Step 9. Obtain the Pickled Model
In the `iris_sklearn.py` script, we serialize the logistic regression model using the popular object serialization package -- pickle, into a file named `model.pkl` on disk. Here is the code snippet.

```python
print("Export the model to model.pkl")
f = open('./outputs/model.pkl', 'wb')
pickle.dump(clf1, f)
f.close()
```

When you executed the `iris_sklearn.py` script, the model was written to the `outputs` folder with the name `model.pkl`. This folder lives in the execution environment you choose to run the script, not your local project folder. You can find it in the run history detail page and download this binary file by clicking on the download button next to the file name. Read more about the `outputs` folder in the [Persisting Changes](PersistingChanges.md) article.

![Download Pickle](media/tutorial-classifying-iris/download_model.png)

Now, download the model file `model.pkl` and save it to the root of your  project folder. You need it in the later steps.

## Step 10. Prepare for Operationalization Locally
Local mode deployments run in Docker containers on your local computer, whether that is your desktop or a Linux VM running on Azure. You can use local mode for development and testing. The Docker engine must be running locally to complete the operationalization steps as shown in the following steps.

Let's prepare the operationalization environment. In the CLI window type the following to set up the environment for local operationalization:

```batch
C:\Temp\myIris> az ml env setup -n <your new environment name> -l <Azure region, for example, eastus2>
```
>If you need to scale out your deployment (or if you don't have Docker engine installed locally, you can choose to deploy the web service on a cluster. In cluster mode, your service is run in the Azure Container Service (ACS). The operationalization environment provisions Docker and Kubernetes in the cluster to manage the web service deployment. Deploying to ACS allows you to scale your service as needed to meet your business needs. To deploy web service into a cluster, add the _--cluster_ flag to the setup command. For more information, enter the _--help_ flag.

Follow the on-screen instructions to provision an Azure Container Registry (ACR) instance and a storage account in which to store the Docker image we are about to create. After the setup is complete, set the environment variables required for operationalization using the following command: 

```batch
C:\Temp\myIris> az ml env set -n <your environment name> -g <resource group>
```

To verify that you have properly configured your operationalization environment for local web service deployment, enter the following command:

```batch
C:\Temp\myIris> az ml env local
```

## Step 10. Create a Real-time Web Service
Now you are ready to operationalize the pickled Iris model. 

To deploy the web service, you must have a model, a scoring script, and optionally a schema for the web service input data. The scoring script loads the _model.pkl_ file from the current folder and uses it to produce a new predicted Iris class. The input to the model is an array of four numbers representing the sepal length and width, and pedal length and width. 

In this example, you use a schema file to help parse the input data. To generate the scoring and schema files, simply execute the `iris_schema_gen.py` file that comes with the sample project in the command prompt using Python interpreter directly.  

```batch
C:\Temp\myIris> python iris_schema_gen.py
```

Running this file creates a `service_schema.json` file. This file contains the schema of the web service input.

Now you are ready to create the real-time web service:
```batch
c:\temp\myIris> az ml service create realtime -f score.py --model-file model.pkl -s service_schema.json -n irisapp -r python
```
To quickly explain the switches of the `az ml service create realtime` command:
* -n: app name, must be lower case.
* -f: scoring script file name
* --model-file: model file, in this case it is the pickled sklearn model
* -r: type of model, in this case it is the python model

>Important: The service name (it is also the new Docker image name) must be all lower-case, otherwise you see an error.

When you run the command, the model and the scoring file are uploaded into an Azure service that we manage. As part of deployment process, the operationalization component uses the pickled model `model.pkl` and the scoring script `score.py` to build a Docker image named `<ACR_name>.azureacr.io/irisapp`. It then registers the image with your Azure Container Registry (ACR) service, pulls down that image locally to your computer, and starts a Docker container based on that image. (If your environment is configured in cluster mode, the Docker container will instead be deployed into the Kubernetes cluster.)

As part of the deployment, an HTTP REST endpoint for the web service is created on your local machine. After a few minutes the command should finish with a success message and your web service is ready for action!

You can see the running Docker container using the `docker ps` command:
```batch
c:\Temp\myIris> docker ps
```
You can test the running `irisapp` web service by feeding it with a JSON encoded record containing an array of four random numbers.

The web service creation included sample data. When running in local mode, you can call the `az ml service view` command to retrieve a sample run command that you can use to test the service.

```batch
C:\Temp\myIris> az ml service show realtime -i <web service id>
```

To test the service, execute the returned service run command.

```batch
C:\Temp\myIris> az ml service run realtime -n irisapp -d "{\"input_df\": [{\"petal length\": 1.3, \"sepal width\": 3.6, \"petal width\": 0.25, \"sepal length\": 3.0}]}"
```
The output is ༖༗, which is the predicted class. (Your result might be different.)  

## Congratulations!
Great job! You have successfully run a training script in various compute environments, created a model, serialized the model, and operationalized the model through a Docker-based web service. 