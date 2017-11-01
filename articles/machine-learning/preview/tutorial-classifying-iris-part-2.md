---
title: Build a Model for Azure Machine Learning services (preview) | Microsoft Docs
description: This full-length tutorial shows how to use Azure Machine Learning services (preview) end-to-end. This is part 2 on experimentation.
services: machine-learning
author: hning86
ms.author: haining
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc, tutorial
ms.topic: hero-article
ms.date: 09/25/2017
---

# Classifying Iris part 2: Build a model
Azure Machine Learning services (preview) is an integrated, end-to-end data science and advanced analytics solution for professional data scientists to prepare data, develop experiments and deploy models at cloud scale.

This tutorial is part two of a three part series. In this part of the tutorial, you use Azure Machine Learning services (preview) to learn how to:

> [!div class="checklist"]
> * Work in Azure Machine Learning Workbench
> * Open scripts and review code
> * Execute scripts in a local environment
> * Review run history
> * Execute scripts in a local Docker environment
> * Execute scripts in a local Azure CLI window
> * Execute scripts in a remote Docker environment
> * Execute scripts in a cloud HDInsight environment

This tutorial uses the timeless [Iris flower dataset](https://en.wikipedia.org/wiki/Iris_flower_data_set) to keep things simple. The screenshots are Windows-specific, but the macOS experience is almost identical.

## Prerequisites
You should complete the first part of this tutorial series. Follow the [Prepare data tutorial](tutorial-classifying-iris-part-1.md) to create Azure Machine Learning resources and install the Azure Machine Learning Workbench application prior to beginning the steps in this tutorial.

Optionally, you can experiment with running scripts against a local Docker container. To do so, you will need a Docker engine (Community Edition is sufficient) installed and started locally on your Windows or macOS machine. Read more about [Docker installation instruction](https://docs.docker.com/engine/installation/).

If you want to experiment with dispatching script to run in a Docker container in a remote Azure VM, or an HDInsight Spark cluster, you can follow [instructions to create an Ubuntu-based Azure Data Science Virtual Machine, or HDI Cluster](how-to-create-dsvm-hdi.md).

## Review iris_sklearn.py and configuration files
1. Launch the **Azure Machine Learning Workbench** application, and open the **myIris** project you created in the previous part of the tutorial series.

2. Once the project is open, click the **Files** button (folder icon) on the left toolbar in Azure Machine Learning Workbench to open the file list in your project folder.

3. Select the **iris_sklearn.py** file, and the Python code opens in a new text editor tab inside the Workbench.

   ![open file](media/tutorial-classifying-iris/open_iris_sklearn.png)

   >[!NOTE]
   >The code you see might not be exactly the same as the preceding code, as this sample project is updated frequently.

4. Review the Python script code to become familiar with the coding style. Notice that the script performs the following tasks:

   - Loads the data prep package **iris.dprep** to create a [pandas DataFrame](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.html). 

        >[!NOTE]
        >We are using the `iris.dprep` data prep package that comes with the sample project, which should be the same as the `iris-1.dprep` file you built in part 1 of this tutorial.

   - Adds random features to make the problem more difficult to solve. (Randomness is necessary because Iris is a small dataset that can be easily classified with near 100% accuracy.)

   - Uses [scikit-learn](http://scikit-learn.org/stable/index.html) machine learning library to build a simple Logistic Regression model. 

   - Serializes the model using [pickle](https://docs.python.org/2/library/pickle.html) library into a file in the `outputs` folder, then loads it and de-serializes it back into memory

   - Uses the deserialized model to make prediction on a new record. 

   - Plots two graphs -- confusion matrix, and multi-class ROC curve -- using [matplotlib](https://matplotlib.org/) library, and saves them in the `outputs` folder.

   - The `run_logger` object is used throughout to record the regularization rate, and model accuracy into logs, and the logs are automatically plotted in the run history.


## Execute iris_sklearn.py script in local environment

Let's prepare to run the **iris_sklearn.py** script for the first time. This script requires scikit-learn and matplotlib packages. **scikit-learn** is already installed by the Azure ML Workbench. However, we need to install **matplotlib**. 

1. In Azure Machine Learning Workbench, click the **File** menu and choose **Open Command Prompt** to launch the command-prompt. We refer to this command-line interface window as Azure Machine Learning Workbench CLI window, or CLI window for short.

2. In the CLI window, type in the following command to install **matplotlib** Python package. It should complete in less than a minute.

   ```azurecli
   pip install matplotlib
   ```

   >[!NOTE]
   >If you skip the above `pip install` command, the code in `iris_sklearn.py` does successfully run, but it does not produce the confusion matrix output and multi-class ROC curve plots as shown in the history visualizations.

3. Return to the Workbench app window. 

4. In the upper left of the **iris_sklearn.py** tab, beside the save icon, click the dropdown to choose the **Run Configuration**  selection.  Choose **local** as the execution environment, and `iris_sklearn.py` as the script to run.

5. Next, moving to the right of the same tab, fill the **Arguments** field with a value of `0.01`. 

   ![img](media/tutorial-classifying-iris/run_control.png)

6. Click on the **Run** button. A job is immediately scheduled. The job is listed in the **Jobs** panel on the right side of the Workbench window. 

7. After a few moments, the status of the job transitions from **Submitting**, to **Running**, and finally to **Completed** shortly thereafter.

   ![run sklearn](media/tutorial-classifying-iris/run_sklearn.png)

8. Click on the word **Completed** in job status text in the Jobs panel. A pop-up window opens and displays the standard output (stdout) text of the running script. To close the stdout text, click **X** button on the upper right of the popup.

9. In the same job status in the Jobs panel, click on the blue text **iris_sklearn.py [n]** (_n_ is the run number) just above the **Completed** status and the start time. The **Run Properties** page opens and shows the Run Properties information, **Outputs** files, any **Visualizations**,  and **Logs** from that particular run. 

   When the run is completed, the pop-up window shows the following results:

   >[!NOTE]
   >Since we introduce some randomization into the training set earlier, your exact results vary somewhat.

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

10. Close the **Run Properties** tab, and return to the **iris_sklearn.py** tab. 

11. Repeat additional runs. 

    Enter a series of different numerical values in the **Arguments** field ranging from `0.001` to `10`. Click **Run** to execute the code a few more times. The argument value you change each time is fed to the Logistic Regression algorithm in the code, resulting in different results each time.

## Review Run History in detail
In Azure Machine Learning Workbench, every script execution is captured as a run history record. You can view the run history of a particular script by opening the **Runs** view.

1. Click the **Runs** button (clock icon) on the left toolbar to open the listing of **Runs**. Then click on **iris_sklearn.py** to show the **Run Dashboard** of `iris_sklearn.py`.

   ![img](media/tutorial-classifying-iris/run_view.png)

2. The **Run Dashboard** tab opens. 
Review the statistics captured across multiple runs. Graphs are rendered in the top of the tab, and each numbered run with details is listed in the table at the bottom of the page.

   ![img](media/tutorial-classifying-iris/run_dashboard.png)

3. Filter the table, and click in the graphs interactively to view status, duration, accuracy, and  regularization rate of each run. 

4. Select two or three runs in the **Runs** table, and click the **Compare** button to open a detailed comparison page. Review the side-by-side comparison. Click the **Run list** back button on the upper left of the comparison page to return to the **Run Dashboard**.

5. Click on an individual run to see the run detail view. Notice the statistics for the selected run are listed in the _Run Properties_ section. The files written into the output folder are listed in the **Output** section, and can be downloaded.

   ![img](media/tutorial-classifying-iris/run_details.png)

   The two plots, confusion matrix and multi-class ROC curve, are rendered in the **Visualizations** section. All the log files can also be found in the **Logs** section.

## Execute scripts in the local Docker environment

Azure ML allows you to easily configure additional execution environments such as Docker and run your script those environments. 

>[!IMPORTANT]
>In order to accomplish this step, you must have Docker engine locally installed and started. See the installation guide for more details.

1. On the left toolbar, select the folder icon to open the **Files** listing for your project. Expand the `aml_config` folder. 

2. Notice there are several environments that are pre-configured such as **docker-python** and **docker-spark** and **local**. 

   Each environment has two files, such as  `docker-python.compute` and `docker-python.runconfig`. Open each kind of file to notice that certain options are configurable in the text editor.  

   Close (X) the tabs for any open text editors to clean up.

3. Run the **iris_sklearn.py** script using the **docker-python** environment. 

   - In the left toolbar, click the clock icon to open the **Runs** panel. Click **All Runs**. 
   - On the top of the **All Runs** tab,  choose **docker-python** as the targeted environment instead of the default **local**. 
   - Next, moving to the right, choose **iris_sklearn.py** as the script to run. 
   - Leave the **Arguments** field blank since the script specifies a default value. 
   - Click on the **Run** button.

4. Observe that a new job starts as shown in the **Jobs** panel on the right of the workbench window.

   When you are running against Docker for the first time, it takes a few extra minutes to complete. 

   Behind the scenes, Azure Machine Learning Workbench builds a new docker file referencing the base Docker image specified in the `docker.compute` file, and dependency Python packages specified in the `conda_dependencies.yml` file. The Docker engine then downloads the base image from Azure, installs Python packages specified in the `conda_dependencies.yml` file, then starts a Docker container. It then copies (or references, depending on run configuration) the local copy of the project folder, and then executes the `iris_sklearn.py` script. In the end, you should see the exact same result as you do when targeting **local**.

5. Now let's try Spark. The Docker base image contains a pre-installed and configured Spark instance. Because of this, you can execute a PySpark script in it. This is a simple way to develop and test your Spark program without having to spend the time installing and configuring Spark yourself. 

   Open the `iris_spark.py` file. This script loads the `iris.csv` data file, and uses the Logistic Regression algorithm from the Spark ML library to classify the Iris dataset. Now change the run environment to **docker-spark**, and the script to **iris_spark.py**, and run again. This takes a little longer since a Spark session has to be created and started inside the Docker container. You can also see the stdout is different than the stdout of `iris_spark.py`.

6. Do a few more runs and play with different arguments. 

7. Open the `iris_spark.py` file to see the simple Logistic Regression model built using Spark ML library. 

8. Interact with the **Jobs** panel, run history list view, and run details view of your runs across different execution environments.

## Execute Scripts in the Azure ML CLI Window

1. Using Azure Machine Learning Workbench, launch the command-line window by clicking on **File** menu, then **Open Command Prompt**. Your command-prompt starts in the project folder with the prompt `C:\Temp\myIris\>`.

   >[!Important]
   >You must use the command-line window (launched from the Workbench) to accomplish the following steps:

2. Use the command-prompt (CLI) to log in to Azure. 

   The workbench app and CLI use independent credential caches when authenticating against Azure resources. You only need to do this once, until the cached token expires. The **az account list** command returns the list of subscriptions available to your login. If there is more than one, use the ID value from the desired subscription, and set that as the default account to use with the **az set account -s** command, providing the subscription ID value. Then confirm the setting using the account show command.

   ```azurecli
   REM login using aka.ms/devicelogin site.
   az login
   
   REM list all Azure subscriptions you have access to. 
   az account list -o table
   
   REM set the current Azure subscription to the one you want to use.
   az set account -s <subscriptionId>
   
   REM verify your current subscription is set correctly
   az account show
   ```

3. Once you are authenticated and the current Azure subscription context is set, type the following commands in the CLI window to install matplotlib, and submit the python script as an experiment to run.

   ```azurecli
   REM You don't need to do this if you have installed matplotlib locally from the previous steps.
   pip install matplotlib
   
   REM Kick off an execution of the iris_sklearn.py file against local compute context
   az ml experiment submit -c local .\iris_sklearn.py
   ```

4. Review the output. Notice the same output and result as what you have run previously in this tutorial using the Workbench to run the script. 

5. Run the same script using the Docker execution environment if you have Docker installed on your machine.

   ```azurecli
   REM Execute iris_sklearn.py in local Docker container Python environment.
   az ml experiment submit -c docker-python .\iris_sklearn.py 0.01
   
   REM Execute iris_spark.py in local Docker container Spark environment.
   az ml experiment submit -c docker-spark .\iris_spark.py 0.1
   ```
6. In the Azure Machine Learning Workbench, click the Folder icon on the left toolbar to list the project files, and open the Python script named **run.py**. 

   This script is useful to loop over various regularization rates and run the experiment multiple times with those rates. This script starts an `iris_sklearn.py` job with a regularization rate of `10.0` (a ridiculously large number), and cut the rate to half in the following run, and so on, and so forth, until the rate is no smaller than `0.005`. 

   ```python
   # run.py
   import os
   
   reg = 10
   while reg > 0.005:
       os.system('az ml experiment submit -c local ./iris_sklearn.py {}'.format(reg))
       reg = reg / 2
   ```

   To launch the **run.py** script from the command line, run the following commands:

   ```cmd
   REM Submit iris_sklearn.py multiple times with different regularization rates
   python run.py
   ```

   When `run.py` finishes, you see a graph in your run history list view in the Azure Machine Learning Workbench.

## Execute in a Docker container on a remote machine
To execute your script in a Docker container on a remote Linux machine, you need to have SSH access (username and password) to that remote machine. And that remote machine must have Docker engine installed and running. The easiest way to obtain such a Linux machine is to create a [Ubuntu-based Data Science Virtual Machine (DSVM)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu) on Azure. (Note the CentOS-based DSVM is NOT supported.) 

1. Once the VM is created, you can attach the VM as an execution environment by generating a pair of `.runconfig` and `.compute` file using the below command. Let's name the new environment `myvm`.
 
   ```azurecli
   REM create myvm compute target
   az ml computetarget attach --name myvm --address <IP address> --username <username> --password <password> --type remotedocker
   ```
   
   >[!NOTE]
   >The IP Address area can also be publicly addressable FQDN (fully qualified domain name), such as `vm-name.southcentralus.cloudapp.azure.com`. It is a good practice to add FQDN to your DSVM and use it here instead of IP address, since you might turn off the VM at some point to save on cost. Additionally, the next time you start the VM, the IP address might have changed.

   Next, run the following command the construct the Docker image in the VM to get it ready for running the scripts.
   
   ```azurecli
   REM prepare the myvm compute target
   az ml experiment prepare -c myvm
   ```
   >[!NOTE]
   >You can also change the value of `PrepareEnvironment` in `myvm.runconfig` from default `false` to `true`. This will automatically prepare the Docker container at the first run.

2. Edit the generated `myvm.runconfig` file under `aml_config` and change the Framework from default `PySpark` to `Python`:

   ```yaml
   "Framework": "Python"
   ```
   >[!NOTE]
   >Leaving the framework setting to PySpark should also work fine. But it is slightly inefficient if you don't actually need a Spark session to run your Python script.

3. Issue the same command as you did before in the CLI window, except this time we target _myvm_:
   ```azurecli
   REM execute iris_sklearn.py in remote Docker container
   az ml experiment submit -c myvm .\iris_sklearn.py
   ```
   The command is executed just as if you are using a `docker-python` environment, except that the execution happens on the remote Linux VM. The CLI window displays the same output information.

4. Let's try Spark in the container. Open File explorer (you can also do this from the CLI window if you are comfortable with basic file manipulation commands). Make a copy of the `myvm.runconfig` file and name it `myvm-spark.runconfig`. Edit the new file to change the `Framework` setting from `Python` to `PySpark`:
   ```yaml
   "Framework": "PySpark"
   ```
   Don't make any changes to the `myvm.compute` file. The same Docker image on the same VM gets used for Spark execution. In the new `myvy-spark.runconfig`, the `target` field points to the same `myvm.compute` file via its name `myvm`.

5. Type the command below to run it in the Spark instance in the remote Docker container:
   ```azureli
   REM execute iris_spark.py in Spark instance on remote Docker container
   az ml experiment submit -c myvm-spark .\iris_spark.py
   ```

## Execute script in an HDInsight cluster
You can also run this script in an actual Spark cluster. 

1. If you have access to a Spark for Azure HDInsight cluster, generate an HDI run configuration command as shown. Provide the HDInsight cluster name, your HDInsight user name, and password as the parameters. Use the following command:

   ```azurecli
   REM create a compute target that points to a HDI cluster
   az ml computetarget attach --name myhdi --address <cluster head node FQDN> --username <username> --password <password> --type cluster

   REM prepare the HDI cluster
   az ml experiment prepare -c myhdi
   ```

   The cluster head node fully qualified domain name (FQDN) is typically `<cluster_name>-ssh.azurehdinsight.net`.

   >[!NOTE]
   >The `username` is the cluster SSH username. The default value is `sshuser` if you don't change it during HDI provisioning. It is not `admin`, which is the other user created during provisioning to enable access the cluster's admin web site. 

2. Run the following command and the script runs in the HDInsight cluster:

   ```azurecli
   REM execute iris_spark on the HDI cluster
   az ml experiment submit -c myhdi .\iris_spark.py
   ```

   >[!NOTE]
   >When you execute against a remote HDI cluster, you can also view the YARN job execution details at `https://<cluster_name>.azurehdinsight.net/yarnui` using the `admin` user account.


## Next Steps
In this second part of the three part tutorial series, you have learned how to use Azure Machine Learning services to:
> [!div class="checklist"]
> * Work in Azure Machine Learning Workbench
> * Open scripts and review code
> * Execute scripts in a local environment
> * Review run history
> * Execute scripts in a local Docker environment
> * Execute scripts in a local Azure CLI window
> * Execute scripts in a remote Docker environment
> * Execute scripts in a cloud HDInsight environment

You are ready to move on to the third part in the series. Now that we have created the Logistic Regression model, let's deploy it as a real-time web service.

> [!div class="nextstepaction"]
> [Deploy a model](tutorial-classifying-iris-part-3.md)
