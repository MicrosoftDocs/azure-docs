---
title: Iris Tutorial for Machine Learning Server | Microsoft Docs
description: This full-length tutorial shows how to use Azure Machine Learning end-to-end. This is part 2 on experimentation.
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

# Classifying Iris Part 2: Build Model
In this tutorial, let's walk through the basics of Azure Machine Learning by creating a data preparation package, building a model and deploying it as a real-time web service. We use the timeless [Iris flower dataset](https://en.wikipedia.org/wiki/Iris_flower_data_set) to keep things simple. The screenshots are Windows-specific, but the macOS experience is almost identical.

This is part 2 of a 3 part tutorial, covering model building.

## Step 1. Review _iris_sklearn.py_ and Configuration Files
Open the `iris_sklearn.py` file.

![open file](media/tutorial-classifying-iris/open_iris_sklearn.png)

>[!NOTE]
>The code you see might not be exactly the same as the code shown above, as this sample project is updated frequently.

This script performs the following tasks:
1. Invokes the data prep package `iris.dprep` to create a [pandas DataFrame](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.html).

2. Adds random features to make the problem more difficult to solve. (This is because Iris is a very small dataset that can be easily classified with near 100% accuracy.)

3. Uses [scikit-learn](http://scikit-learn.org/stable/index.html) machine learning library to build a simple Logistic Regression model. 

4. Serializes the model using [pickle](https://docs.python.org/2/library/pickle.html) library into a file in the `outputs` folder, then loads it and de-serializes it back into memory

5. Uses the deserialized model to make prediction on a new record. 

6. Plots two graphs -- confusion matrix, and multi-class ROC curve -- using [matplotlib](https://matplotlib.org/) library, and saves them in the `outputs` folder.

>[!NOTE]
>The `run_logger` object in the Python code bears examination. It records regularization rate, and model accuracy into logs that are automatically plotted in the run history.

## Step 2. Execute `iris_sklearn.py` Script in `local` Environment
Let's run the `iris_sklearn.py` script for the first time. This script requires `scikit-learn` and `matplotlib` packages. `scikit-learn` is already installed by the Azure ML Workbench. However, we need to install `matplotlib`. Open the command-line window by clicking on **Open Command Prompt** from the **File** menu. (We refer to this command-line interface window as Azure ML Workbench CLI window, or CLI window for short.)

In the CLI window, type in the following command to install `matplotlib` Python package. It should complete in less than a minute.

```batch
C:\Temp\myIris> pip install matplotlib
```
>[!NOTE]
>If you skip the above `pip install` command, `iris_sklearn.py` can still successfully run, except it does not produce the confusion matrix and multi-class ROC curve plots.

Return to the Workbench app. In the **Run Control Panel**, choose **local** as the execution environment, and `iris_sklearn.py` as the script to run. Fill the **Arguments** field with a value of `0.01`. Click on the **Run** button. A job is immediately scheduled and listed in the **Jobs** panel on the right side of the Workbench window. The status of the job transitions from **Submitting**, to **Running**, and finally to **Completed** in a few seconds.

![run sklearn](media/tutorial-classifying-iris/run_sklearn.png)

Clicking on the job status text triggers a pop-up window that displays the standard output (stdout) of the running script. (Clicking on the script name leads you to the run detail information of that particular run which we discuss later.) When the run is completed, the pop-up window shows the following results: 

>[!NOTE]
>Since we introduce some randomization into the training set earlier, your exact results will vary somewhat.

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

Enter a series of different numerical values in the **Arguments** field ranging from `0.001` to `10`, and execute the code a few more times. The value you change each time is fed to the Logistic Regression algorithm in the code, which should give you different results.

## Step 3. Review Run History
In Azure ML Workbench, every script execution is captured as a run history record. You can view the run history of a particular script by opening the **Runs** view.

![run history list view]()

The statistics captured across multiple runs are rendered in the graphs above and the list below. Play with the configurations and filter controls to see all your options.

Click on an individual run to see the run detail view. All the statistics for the selected run are listed in the _Run Properties_ section. The files written into the `outputs` folder are listed in the **Output Files** section, and can be downloaded or promoted (more on promotion later). The two plots, confusion matrix and multi-class ROC curve, are rendered in the **Output Images** section. All the log files can also be found in the **Log Files** section.

![run history details view]()

## Step 4. Execute Scripts in the Local Docker Environment
>[!IMPORTANT]
>In order to accomplish this step, you must have Docker engine locally installed and started. See the installation guide for more details.

Azure ML allows you to easily configure additional execution environments and run your script there. In the `aml_config` folder, two additional environments are specified: `docker-python` and `docker-spark`. Take a moment to review the respective `.compute` and `.runconfig` files under the `aml_config` folder again.

In the **Run Control Panel**, choose **docker-python** as the targeted environment, and **iris_sklearn.py** as the script to run. (You can leave the **Arguments** field blank since the script specifies a default value.) Click on the **Run** button.

Observer that a new job is started in the **Jobs** panel. If you are running against Docker for the first time, it might take a few minutes to finish. Behind the scene, Azure ML Workbench builds a new docker file referencing the base Docker image specified in the `docker-python.compute` file, and depedency Python packages specified in the `conda_dependencies.yml` file. The Docker engine then downloads the base image from Azure, installs Python packages specified in the `conda_dependencies.yml` file, then starts a Docker container. It then copies (or references, depending on run configuration) the local copy of the project folder, and then executes the `iris_sklearn.py` script. In the end, you should see the exact same result as you do when targeting **local**.

The Docker base image contains a pre-installed and configured Spark instance. Because of this, you can execute a PySpark script in it. This is a simple way to develop and test your Spark program without having to spend the time installing and configuring Spark yourself. 

Open the `iris_pyspark.py` file. This script loads the `iris.csv` data file, and uses the Logistic Regression algorithm from the Spark ML library to classify the Iris dataset. Now change the run environment to **docker-spark**, and the script to **iris_pyspark.py**, and run again. This takes a little longer since a Spark session has to be created and started inside the Docker container. You can also see the stdout is different than the stdout of `iris_pyspark.py`.

Do a few more runs and play with different arguments. Open the `iris_pyspark.py` file to see the simple Logistic Regression model built using Spark ML library. Interact with the **Jobs** panel, run history list view, and run details view of your runs across different execution environments.

## Step 5. Execute Scripts in the Azure ML CLI Window
Launch the command-line window by clicking on **File** --> **Open Command Prompt**. You are automatically placed in the project folder `C:\Temp\myIris`.

>[!Important]
>You must use the command line window (launched from the Workbench) to accomplish the following steps:

First, make sure you log in to Azure. (The workbench app and CLI use independent credential caches when authenticating against Azure resources.) You only need to do this once, until the cached token expires.

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

Once you are authenticated and the current Azure subscription context is set, type the following commands in the CLI window: 

```batch
REM You don't need to do this if you have installed matplotlib locally from the previous steps.
C:\Temp\myIris> pip install matplotlib

REM Kick off an execution of the iris_sklearn.py file against local compute context
C:\Temp\myIris> az ml experiment submit -c local .\iris_sklearn.py
```

This should give you the exact same result as the one you got previously when you kick off the job from the Workbench. You can also try the Docker execution environments:
```
REM Execute iris_sklearn.py in local Docker container Python environment.
C:\Temp\myIris> az ml experiment submit -c docker-python .\iris_sklearn.py 0.01

REM Execute iris_pyspark.py in local Docker container Spark environment.
C:\Temp\myIris> az ml experiment submit -c docker-spark .\iris_pyspark.py 0.1
```

Try kicking off several jobs using a simple Python script `run.py`. 

```python
# run.py
import os

reg = 10
while reg > 0.005:
    os.system('az ml experiment submit -c local ./iris_sklearn.py {}'.format(reg))
    reg = reg / 2
```

This script starts an `iris_sklearn.py` job with a regularization rate of `10.0` (a ridiculously large number of course), and cut the rate to half in the following run, and so on, and so forth, until the rate is no smaller than `0.005`.
```
REM Submit iris_sklearn.py multiple times with different regularization rates
C:\Temp\myIris> python run.py
```
When `run.py` finishes, you might see a graph like this in your run history list view.

![run.py graph]()

## Step 5a (optional). Execute in a Docker Container on a Remote Machine
To execute your script in a Docker container on a remote Linux machine, you need to have SSH access (username and password) to that remote machine. And that remote machine must have Docker engine installed and running. The easiest way to obtain such a Linux machine is to create a [Ubuntu-based Data Science Virtual Machine (DSVM)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu) on Azure. (Note the CentOS-based DSVM is NOT supported.) 

Once the VM is created, you can attach the VM as an execution environment by generating a pair of `.runconfig` and `.compute` file using the below command. Let's name the new environment `myvm`.
```batch
REM create myvm compute target
C:\Temp\myIris> az ml computetarget attach --name myvm --address <IP address> --username <username> --password <password>
```
>[!NOTE]
>The IP Address area can also be publicly addressable FQDN (fully qualified domain name), such as `vm-name.southcentralus.cloudapp.azure.com`. It is a good practice to add FQDN to your DSVM and use it here instead of IP address, since you might turn off the VM at some point to save on cost. Additionally, the next time you start the VM, the IP address might have changed.

Next, run the following command the construct the Docker image in the VM to get it ready for running the scripts.
```
REM prepare the myvm compute target
C:\Temp\myIris> az ml experiment prepare -c myvm
```
>[!NOTE]
>You can also change the value of `PrepareEnvironment` in `myvm.runconfig` from default `false` to `true`. This will automatically prepare the Docker container at the first run.

Edit the generated `myvm.runconfig` file under `aml_config` and change the Framework from default `PySpark` to `Python`:
```yaml
"Framework": "Python"
```
>Leaving the framework setting to PySpark should also work fine. But it is slightly inefficient if you don't actually need a Spark session to run your Python script.

Issue the same command as you did before in the CLI window, except this time we target _myvm_:
```batch
REM execute iris_sklearn.py in remote Docker container
C:\Temp\myIris> az ml experiment submit -c myvm .\iris_sklearn.py
```
The command is executed just as if you are using a `docker-python` environment, except that the execution happens on the remote Linux VM. The CLI window displays the same output information.

Let's try Spark in the container. Open File explorer (you can also do this from the CLI window if you are comfortable with basic file manipulation commands). Make a copy of the `myvm.runconfig` file and name it `myvm-spark.runconfig`. Edit the new file to change the `Framework` setting from `Python` to `PySpark`:
```yaml
"Framework": "PySpark"
```
Don't make any changes to the `myvm.compute` file. The same Docker image on the same VM gets used for Spark execution. In the new `myvy-spark.runconfig`, the `target` field points to the same `myvm.compute` file via its name `myvm`.

Type the command below to run it in the Spark instance in the remote Docker container:
```batch
REM execute iris_pyspark.py in Spark instance on remote Docker container
C:\Temp\myIris> az ml experiment submit -c myvm-spark .\iris_pyspark.py
```
## Step 5b (optional). Execute in an HDI cluster
You can also run this script in an actual Spark cluster. If you have access to a Spark for Azure HDInsight cluster, generate an HDI run configuration using the following command:
```batch
REM create a compute target that points to a HDI cluster
C:\Temp\myIris> az ml computetarget attach --name myhdi --address <cluster name>-ssh.azurehdinsight.net --username <username> --password <password> --cluster

REM prepare the HDI cluster
C:\Temp\myIris> az ml experiment prepare -c myhdi
```
>Note: the `username` is the cluster SSH username. The default value is `sshuser` if you don't change it during HDI provisioning. It is not `admin`. That is the other user created during provisioning to enable access the cluster's admin web site. 

Issue the following command and the script runs in the HDI cluster:
```batch
REM execute iris_pyspark on the HDI cluster
C:\Temp\myIris> az ml experiment submit -c myhdi .\iris_pyspark.py
```
>Note: When you execute against a remote HDI cluster, you can also view the YARN job execution details at `https://<cluster_name>.azurehdinsight.net/yarnui` using the `admin` user account.

Now that we have created the Logistic Regression model, let's deploy it as a real-time web service.

## Next Steps
- [Part 1: Project setup and data preparation](tutorial-classifying-iris-part-1.md)
- Part 2: Model building
- [Part 3: Model deployment](tutorial-classifying-iris-part-3.md)