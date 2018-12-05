---
title: Build a model tutorial for Azure Machine Learning service (preview) | Microsoft Docs
description: This full-length tutorial shows how to use Azure Machine Learning service (preview) end to end. This is part two and discusses experimentation.
services: machine-learning
author: hning86
ms.author: haining
manager: mwinkle
ms.reviewer: jmartens
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: mvc
ms.topic: tutorial
ms.date: 3/15/2018

ROBOTS: NOINDEX
---


# Tutorial 2: Classify Iris - Build a model

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)]

Azure Machine Learning service (preview) are an integrated, data science and advanced analytics solution for professional data scientists to prepare data, develop experiments, and deploy models at cloud scale.

This tutorial is **part two of a three-part series**. In this part of the tutorial, you use Azure Machine Learning service to:

> [!div class="checklist"]
> * Open scripts and review code
> * Execute scripts in a local environment
> * Review run histories
> * Execute scripts in a local Azure CLI window
> * Execute scripts in a local Docker environment
> * Execute scripts in a remote Docker environment
> * Execute scripts in a cloud Azure HDInsight environment

This tutorial uses the timeless [Iris flower data set](https://en.wikipedia.org/wiki/Iris_flower_data_set). 

## Prerequisites

To complete this tutorial, you need:
- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 
- An experimentation account and Azure Machine Learning Workbench installed as described in this [quickstart](quickstart-installation.md)
- The project and prepared Iris data from [Tutorial part 1](tutorial-classifying-iris-part-1.md)
- A Docker engine installed and running locally. Docker's Community Edition is sufficient. Learn how to install Docker here: https://docs.docker.com/engine/installation/.

## Review iris_sklearn.py and the configuration files

1. Launch the Azure Machine Learning Workbench application.

1. Open the **myIris** project you created in [Part 1 of the tutorial series](tutorial-classifying-iris-part-1.md).

2. In the open project, select the **Files** button (the folder icon) on the far-left pane to open the file list in your project folder.

   ![Open the Azure Machine Learning Workbench project](media/tutorial-classifying-iris/2-project-open.png)

3. Select the **iris_sklearn.py** Python script file. 

   ![Choose a script](media/tutorial-classifying-iris/2-choose-iris_sklearn.png)

   The code opens in a new text editor tab inside the Workbench. This is the script you use throughout this part of the tutorial. 

   >[!NOTE]
   >The code you see might not be exactly the same as the preceding code, because this sample project is updated frequently.
   
   ![Open a file](media/tutorial-classifying-iris/open_iris_sklearn.png)

4. Inspect the Python script code to become familiar with the coding style. 

   The script **iris_sklearn.py** performs the following tasks:

   * Loads the default data preparation package called **iris.dprep** to create a [pandas DataFrame](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.html). 

   * Adds random features to make the problem more difficult to solve. Randomness is necessary because Iris is a small data set that is easily classified with nearly 100% accuracy.

   * Uses the [scikit-learn](http://scikit-learn.org/stable/index.html) machine learning library to build a logistic regression model.  This library comes with Azure Machine Learning Workbench by default.

   * Serializes the model using the [pickle](https://docs.python.org/3/library/pickle.html) library into a file in the `outputs` folder. 
   
   * Loads the serialized model, and then deserializes it back into memory.

   * Uses the deserialized model to make a prediction on a new record. 

   * Plots two graphs, a confusion matrix and a multi-class receiver operating characteristic (ROC) curve, using the [matplotlib](https://matplotlib.org/) library, and then saves them in the `outputs` folder. You can install this library in your environment if it isn't there already.

   * Plots the regulatization rate and model accuracy in the run history automatically. The `run_logger` object is used throughout to record the regularization rate and the model accuracy into the logs. 


## Run iris_sklearn.py in your local environment

1. Start the Azure Machine Learning command-line interface (CLI):
   1. Launch the Azure Machine Learning Workbench.

   1. From the Workbench menu, select **File** > **Open Command Prompt**. 
   
   The Azure Machine Learning command-line interface (CLI) window starts in the project folder  `C:\Temp\myIris\>` on Windows. This project is the same as the one you created in Part 1 of the tutorial.

   >[!IMPORTANT]
   >You must use this CLI window to accomplish the next steps.

1. In the CLI window, install the Python plotting library, **matplotlib**, if you do not already have the library.

   The **iris_sklearn.py** script has dependencies on two Python packages: **scikit-learn** and **matplotlib**.  The **scikit-learn** package is installed by Azure Machine Learning Workbench for your convenience. But, you need to install **matplotlib** if you don't have it installed yet.

   If you move on without installing **matplotlib**, the code in this tutorial can still run successfully. However, the code will not be able to produce the confusion matrix output and the multi-class ROC curve plots shown in the history visualizations.

   ```azurecli
   pip install matplotlib
   ```

   This install takes about a minute.

1. Return to the Workbench application. 

1. Find the tab called **iris_sklearn.py**. 

   ![Find tab with script](media/tutorial-classifying-iris/2-iris_sklearn-tab.png)

1. In the toolbar of that tab, select **local** as the execution environment, and `iris_sklearn.py` as the script to run. These may already be selected.

   ![Local and script choice](media/tutorial-classifying-iris/2-local-script.png)

1. Move to the right side of the toolbar and enter `0.01` in the **Arguments** field. 

   This value corresponds to the regularization rate of the logistic regression model.

   ![Local and script choice](media/tutorial-classifying-iris/2-local-script-arguments.png)

1. Select the **Run** button. A job is immediately scheduled. The job is listed in the **Jobs** pane on the right side of the workbench window. 

   ![Local and script choice](media/tutorial-classifying-iris/2-local-script-arguments-run.png)

   After a few moments, the status of the job transitions from **Submitting**, to **Running**, and finally to **Completed**.

1. Select **Completed** in the job status text in the **Jobs** pane. 

   ![Run sklearn](media/tutorial-classifying-iris/2-completed.png)

   A pop-up window opens and displays the standard output (stdout) text for the run. To close the stdout text, select the **Close** (**x**) button on the upper right of the pop-up window.

   ![Standard output](media/tutorial-classifying-iris/2-standard-output.png)

9. In the same job status in the **Jobs** pane, select the blue text **iris_sklearn.py [n]** (_n_ is the run number) just above the **Completed** status and the start time. The **Run Properties** window opens and shows the following information for that particular run:
   - **Run Properties** information
   - **Outputs**
   - **Metrics**
   - **Visualizations**, if any
   - **Logs** 

   When the run is finished, the pop-up window shows the following results:

   >[!NOTE]
   >Because the tutorial introduced some randomization into the training set earlier, your exact results might vary from the results shown here.

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
   Confusion matrix and ROC curve plotted. See them in Run History details pane.
   ```
    
10. Close the **Run Properties** tab, and then return to the **iris_sklearn.py** tab. 

11. Repeat for additional runs. 

    Enter a series of values in the **Arguments** field ranging from `0.001` to `10`. Select **Run** to execute the code a few more times. The argument value you change each time is fed to the logistic regression model in the code, resulting in different findings each time.

## Review the run history in detail
In Azure Machine Learning Workbench, every script execution is captured as a run history record. If you open the **Runs** view, you can view the run history of a particular script.

1. To open the list of **Runs**, select the **Runs** button (clock icon) on the left toolbar. Then select **iris_sklearn.py** to show the **Run Dashboard** of `iris_sklearn.py`.

   ![Run view](media/tutorial-classifying-iris/run_view.png)

1. The **Run Dashboard** tab opens. 

   Review the statistics captured across the multiple runs. Graphs render in the top of the tab. Each run has a consecutive number, and the run details are listed in the table at the bottom of the screen.

   ![Run dashboard](media/tutorial-classifying-iris/run_dashboard.png)

1. Filter the table, and then select any of the graphs to view the status, duration, accuracy, and regularization rate of each run. 

1. Select the checkboxes next to two or more runs in the **Runs** table. Select the **Compare** button to open a detailed comparison pane. Review the side-by-side comparison. 

1. To return to the **Run Dashboard**, select the **Run List** back button on the upper left of the **Comparison** pane.

   ![Return to Run list](media/tutorial-classifying-iris/2-compare-back.png)

1. Select an individual run to see the run detail view. Notice that the statistics for the selected run are listed in the **Run Properties** section. The files written into the output folder are listed in the **Outputs** section, and you can download the files from there.

   ![Run details](media/tutorial-classifying-iris/run_details.png)

   The two plots, the confusion matrix and the multi-class ROC curve, are rendered in the **Visualizations** section. All the log files can also be found in the **Logs** section.


## Run scripts in local Docker environments

Optionally, you can experiment with running scripts against a local Docker container. You can configure additional execution environments, such as Docker, and run your script in those environments. 

>[!NOTE]
>To experiment with dispatching scripts to run in a Docker container in a remote Azure VM or an Azure HDInsight Spark cluster, you can follow the [instructions to create an Ubuntu-based Azure Data Science Virtual Machine or HDInsight cluster](how-to-create-dsvm-hdi.md).

1. If you have not yet done so, install and start Docker locally on your Windows or MacOS machine. For more information, see the Docker installation instructions at https://docs.docker.com/install/. Community edition is sufficient.

1. On the left pane, select the **Folder** icon to open the **Files** list for your project. Expand the `aml_config` folder. 

2. There are several environments that are preconfigured: **docker-python**, **docker-spark**, and **local**. 

   Each environment has two files, such as `docker.compute` (for both **docker-python** and **docker-spark**) and `docker-python.runconfig`. Open each file to see that certain options are configurable in the text editor.  

   To clean up, select **Close** (**x**) on the tabs for any open text editors.

3. Run the **iris_sklearn.py** script by using the **docker-python** environment: 

   - On the left toolbar, select the **Clock** icon to open the **Runs** pane. Select **All Runs**. 

   - On the top of the **All Runs** tab, select **docker-python** as the targeted environment instead of the default **local**. 

   - Next, move to the right side and select **iris_sklearn.py** as the script to run. 

   - Leave the **Arguments** field blank because the script specifies a default value. 

   - Select the **Run** button.

4. Observe that a new job starts. It appears in the **Jobs** pane on the right side of the workbench window.

   When you run against Docker for the first time, the job takes a few extra minutes to finish. 

   Behind the scenes, Azure Machine Learning Workbench builds a new Docker file. 
   The new file references the base Docker image specified in the `docker.compute` file and the dependency Python packages specified in the `conda_dependencies.yml` file. 
   
   The Docker engine performs the following tasks:

    - Downloads the base image from Azure.
    - Installs the Python packages specified in the `conda_dependencies.yml` file.
    - Starts a Docker container.
    - Copies or references, depending on the run configuration, the local copy of the project folder.      
    - Executes the `iris_sklearn.py` script.

   In the end, you should see the exact same results as you do when you target **local**.

5. Now, let's try Spark. The Docker base image contains a preinstalled and configured Spark instance that you can use to execute a PySpark script. Using this base image is an easy way to develop and test your Spark program, without having to spend time installing and configuring Spark yourself. 

   Open the `iris_spark.py` file. This script loads the `iris.csv` data file, and uses the logistic regression algorithm from the Spark Machine Learning library to classify the Iris data set. Now change the run environment to **docker-spark** and the script to **iris_spark.py**, and then run it again. This process takes a little longer because a Spark session has to be created and started inside the Docker container. You can also see the stdout is different than the stdout of `iris_spark.py`.

6. Start a few more runs and play with different arguments. 

7. Open the `iris_spark.py` file to see the logistic regression model built using the Spark Machine Learning library. 

8. Interact with the **Jobs** pane, run a history list view, and run a details view of your runs across different execution environments.

## Run scripts in the CLI window

1. Start the Azure Machine Learning command-line interface (CLI):
   1. Launch the Azure Machine Learning Workbench.

   1. From the Workbench menu, select **File** > **Open Command Prompt**. 
   
   The CLI prompt starts in the project folder  `C:\Temp\myIris\>` on Windows. This is the project you created in Part 1 of the tutorial.

   >[!IMPORTANT]
   >You must use this CLI window to accomplish the next steps.

1. In the CLI window, log in to Azure. [Learn more about az login](https://docs.microsoft.com/cli/azure/authenticate-azure-cli?view=azure-cli-latest).

   You may already be logged in. In that case, you can skip this step.

   1. At the command prompt, enter:
      ```azurecli
      az login
      ```

      This command returns a code to use in your browser at https://aka.ms/devicelogin.

   1. Go to https://aka.ms/devicelogin in your browser.

   1. When prompted, enter the code, which you received in the CLI, into your browser.

   The Workbench app and CLI use independent credential caches when authenticating against Azure resources. After you log in, you won't need to authenticated again until the cached token expires. 

1. If your organization has multiple Azure subscriptions (enterprise environment), you must set the subscription to be used. Find your subscription, set it using the subscription ID, and then test it.

   1. List every Azure subscription to which you have access using this command:
   
      ```azurecli
      az account list -o table
      ```

      The **az account list** command returns the list of subscriptions available to your login. 
      If there is more than one, identify the subscription ID value for the subscription you want to use.

   1. Set the Azure subscription you want to use as the default account:
   
      ```azurecli
      az account set -s <your-subscription-id>
      ```
      where \<your-subscription-id\> is ID value for the subscription you want to use. Do not include the brackets.

   1. Confirm the new subscription setting by requesting the details for the current subscription. 

      ```azurecli
      az account show
      ```    

1. In the CLI window, install the Python plotting library, **matplotlib**, if you do not already have the library.

   ```azurecli
   pip install matplotlib
   ```

1. In the CLI window, submit the **iris_sklearn.py** script as an experiment.

   The execution of iris_sklearn.py is run against the local compute context.

   + On Windows:
     ```azurecli
     az ml experiment submit -c local .\iris_sklearn.py
     ```

   + On MacOS:
     ```azurecli
     az ml experiment submit -c local iris_sklearn.py
     ```
   
   Your output should be similar to:
    ```text
    RunId: myIris_1521077190506
    
    Executing user inputs .....
    ===========================
    
    Python version: 3.5.2 |Continuum Analytics, Inc.| (default, Jul  2 2016, 17:52:12) 
    [GCC 4.2.1 Compatible Apple LLVM 4.2 (clang-425.0.28)]
    
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
    
    Execution Details
    =================
    RunId: myIris_1521077190506
    ```

1. Review the output. You have the same output and results that you had when you used the Workbench to run the script. 

1. In the CLI window, run the Python script, **iris_sklearn.py**, again using a Docker execution environment (if you have Docker installed on your machine).

   + If your container is on Windows: 
     |Execution<br/>environment|Command on Windows|
     |---------------------|------------------|
     |Python|`az ml experiment submit -c docker-python .\iris_sklearn.py 0.01`|
     |Spark|`az ml experiment submit -c docker-spark .\iris_spark.py 0.1`|

   + If your container is on MacOS: 
     |Execution<br/>environment|Command on Windows|
     |---------------------|------------------|
     |Python|`az ml experiment submit -c docker-python iris_sklearn.py 0.01`|
     |Spark|`az ml experiment submit -c docker-spark iris_spark.py 0.1`|

1. Go back to the Workbench, and:
   1. Select the folder icon on the left pane to list the project files.
   
   1. Open the Python script named **run.py**. This script is useful to loop over various regularization rates. 

   ![Return to Run list](media/tutorial-classifying-iris/2-runpy.png)

1. Run the experiment multiple times with those rates. 

   This script starts an `iris_sklearn.py` job with a regularization rate of `10.0` (a ridiculously large number). The script then cuts the rate to half in the following run, and so on, until the rate is no smaller than `0.005`. 

   The script contains the following code:

   ![Return to Run list](media/tutorial-classifying-iris/2-runpy-code.png)

1. Run the **run.py** script from the command line as follows:

   ```cmd
   python run.py
   ```

   This command submits iris_sklearn.py multiple times with different regularization rates

   When `run.py` finishes, you can see graphs of different metrics in your run history list view in the workbench.

## Run scripts in a remote Docker container
To execute your script in a Docker container on a remote Linux machine, you need to have SSH access (username and password) to that remote machine. In addition, the machine must have a Docker engine installed and running. The easiest way to obtain such a Linux machine is to create an Ubuntu-based Data Science Virtual Machine (DSVM) on Azure. Learn [how to create an Ubuntu DSVM to use in Azure ML Workbench](how-to-create-dsvm-hdi.md#create-an-ubuntu-dsvm-in-azure-portal).

>[!NOTE] 
>The CentOS-based DSVM is *not* supported.

1. After the VM is created, you can attach the VM as an execution environment by generating a pair of `.runconfig` and `.compute` files. Use the following command to generate the files. 

 Let's name the new compute target `myvm`.
 
   ```azurecli
   az ml computetarget attach remotedocker --name myvm --address <your-IP> --username <your-username> --password <your-password>
   ```
   
   >[!NOTE]
   >The IP address can also be a publicly addressable fully-qualified domain name (FQDN) such as `vm-name.southcentralus.cloudapp.azure.com`. It is a good practice to add an FQDN to your DSVM and use it instead of an IP address. This practice is a good idea because you might turn off the VM at some point to save on cost. Additionally, the next time you start the VM, the IP address might have changed.

   >[!NOTE]
   >In addition to username and password authentication, you can specify a private key and the corresponding passphrase (if any) using the `--private-key-file` and (optionally) the `--private-key-passphrase` options. If you want to use the private key that you used when created DSVM, you should specify the `--use-azureml-ssh-key` option.

   Next, prepare the **myvm** compute target by running this command.
   
   ```azurecli
   az ml experiment prepare -c myvm
   ```
   
   The preceding command constructs the Docker image in the VM to get it ready to run the scripts.
   
   >[!NOTE]
   >You can also change the value of `PrepareEnvironment` in `myvm.runconfig` from the default value `false` to `true`. This change automatically prepares the Docker container as part of the first run.

2. Edit the generated `myvm.runconfig` file under `aml_config` and change the framework from the default value `PySpark` to `Python`:

   ```yaml
   Framework: Python
   ```
   >[!NOTE]
   >While PySpark should also work, using Python is more efficient if you don't actually need a Spark session to run your Python script.

3. Issue the same command as you did before in the CLI window, using target _myvm_ this time to execute iris_sklearn.py in a remote Docker container:
   ```azurecli
   az ml experiment submit -c myvm iris_sklearn.py
   ```
   The command executes as if you're in a `docker-python` environment, except that the execution happens on the remote Linux VM. The CLI window displays the same output information.

4. Let's try using Spark in the container. Open File Explorer. Make a copy of the `myvm.runconfig` file and name it `myvm-spark.runconfig`. Edit the new file to change the `Framework` setting from `Python` to `PySpark`:
   ```yaml
   Framework: PySpark
   ```
   Don't make any changes to the `myvm.compute` file. The same Docker image on the same VM gets used for the Spark execution. In the new `myvm-spark.runconfig`, the `Target` field points to the same `myvm.compute` file via its name `myvm`.

5. Type the following command to run the **iris_spark.py** script in the Spark instance running inside the remote Docker container:
   ```azureli
   az ml experiment submit -c myvm-spark .\iris_spark.py
   ```

## Run scripts in HDInsight clusters
You can also run this script in an HDInsight Spark cluster. Learn [how to create an HDInsight Spark Cluster to use in Azure ML Workbench](how-to-create-dsvm-hdi.md#create-an-apache-spark-for-azure-hdinsight-cluster-in-azure-portal).

>[!NOTE] 
>The HDInsight cluster must use Azure Blob as the primary storage. Using Azure Data Lake storage is not supported yet.

1. If you have access to a Spark for Azure HDInsight cluster, generate an HDInsight run configuration command as shown here. Provide the HDInsight cluster name and your HDInsight username and password as the parameters. 

   Use the following command to create a compute target that points to a HDInsight cluster:

   ```azurecli
   az ml computetarget attach cluster --name myhdi --address <cluster head node FQDN> --username <your-username> --password <your-password>
   ```

   To prepare the HDInsight cluster, run this command:

   ```
   az ml experiment prepare -c myhdi
   ```

   The cluster head node FQDN is typically `<your_cluster_name>-ssh.azurehdinsight.net`.

   >[!NOTE]
   >The `username` is the cluster SSH username defined during HDInsight setup. By default, the value is `sshuser`. The value is not `admin`, which is the other user created during setup to enable access to the cluster's admin website. 

2. Run the **iris_spark.py** script in the HDInsight cluster with this command:

   ```azurecli
   az ml experiment submit -c myhdi .\iris_spark.py
   ```

   >[!NOTE]
   >When you execute against a remote HDInsight cluster, you can also view the Yet Another Resource Negotiator (YARN) job execution details at `https://<your_cluster_name>.azurehdinsight.net/yarnui` by using the `admin` user account.

## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps
In this second part of the three-part tutorial series, you learned how to:
> [!div class="checklist"]
> * Open scripts and review the code in Workbench
> * Execute scripts in a local environment
> * Review the run history
> * Execute scripts in a local Docker environment

Now, you can try out the third part of this tutorial series in which you can deploy the logistic regression model you created as a real-time web service.

> [!div class="nextstepaction"]
> [Tutorial 3 - Deploy models](tutorial-classifying-iris-part-3.md)
