# Basic Tutorial: Iris Classification

In this tutorial, we show you the basics of Azure ML preview features by creating a dataprep package, building a model and operationalizing it as a real time web service. To make things simple, we will use the timeless [Iris flower dataset](https://en.wikipedia.org/wiki/Iris_flower_data_set). 

## Step 1. Install Azure ML Workbench
Follow the [installation guide](Installation.md) to install Azure ML Workbench desktop application which also includes command-line interface (CLI). 

## Step 2. Create a new project. 
Launch the Azure ML Workbench desktop app. Click on _File_ --> _New Project_ (or click on the "+" sign in the project list pane). Fill in the project name, the directory the project is going to be created in, an optional description, choose the default "My Projects" workgroup, and then select the "Classifying Iris" sample project as the project template. 

![New Project](media/quick-start-iris/new_project.png)
>Optionally, you can fill in the Git repo text field with an existing empty (with no master branch) Git repo on VSTS. This will allow you to enable roaming and sharing scenarios later. For more information, please reference the [Using Git repo](UsingGit.md) article and the [Roaming and Sharing](collab.md) article.

Click on _Create_ button to create the project. The project is now created and opened.

## Step 3. Create a DataPrep package.
Open the _iris.csv_ file from the File Explorer View, observe that this is a simple table with 5 columns and 150 rows. It has 4 numerical feature columns and a string target column. Also notice it doesn't have column headers.

Under Data Explorer view, click on "+" to add a new data source. This launches the _Add Data Source_ wizard. Select the _File(s)/Directory_ option, and choose the _iris.csv_ local file. Accept all the default settings for each screen and finally click on _Finish_. This will create a _iris-1.dsource_ file (because the sample project already comes with an _iris_dsource_ file) and open it in the _Metrics_ view. Observe the histograms and a complete set of statistics that are calculated for you for each column. You can also switch over to the _Data_ view. 

>Make sure you select the _iris.csv_ file from within the current project directory for this excercise, otherwise later steps will fail. 

Now click on the _Prepare_ button, and this creates a new file named _iris-1.dprep_ (again, because the sample project already comes with an _iris.dprep_ file) and opens it in dataprep editor. Now let's do some simple data wrangling. 

Rename the column names by clicking on each column header and make the text editable. Enter "Sepal Length", "Sepal Width", "Petal Lendth", "Petal Width", and "Species" for the 5 columns respectively.

Select the "Species" column, and right click on it and choose "Value Counts". This creates a histogram with 4 bars. Notice our target column has 3 distinct values, "Iris_virginica", "Iris_versicolor", "Iris-setosa". And there is also one row with a null value in this column. Let's get rid of this row by selecting the bar representing the null value, and click on the "-" filter button to remove it. 

Also notice as you are working on column renaming and filtering out the null value row, each action is recorded as a dataprep step in the _Steps_ pane. You can edit them (to adjust their settings), reorder them, or even remove them.

Now close the DataPrep editor. Don't worry, it is auto-saved. Right click on the _iris-1.dataprep_ file, and choose _Generate Data Access Code File_. This will create an _iris.py_ file with following 2 lines of code prepopulated (along with some comments):

```python
from azureml.dataprep.package import run
df = run('iris.dprep', dataflow_idx=0)
```
This is how we can invoke the above data wrangling logic you have created as a DataPrep package. Depending on the context in which this code runs, _df_ can be a Pandas DataFrame if executed in Python runtime, or a Spark DataFrame if executed in a Spark context. For more information on how to use DataPrep in Azure ML Workbench, please reference the [Getting Started with Data Preparation](DataPrep_GettingStarted.md) guide.

## Step 4. View Python Code in _iris_sklearn.py_ File
Now, open the _iris_sklearn.py_ file, observe that this script invokes the DataPrep package _iris.dprep_ as the data source, and then uses the popular [scikit-learn](http://scikit-learn.org/stable/index.html) Python library for machine learning to build a simple logistic regression mode. It then serializes the model (using pickle) into a file in a special _outouts_ folder, loads it back up and de-serializes the model into memory, and then uses the deserialized model to make prediction on a new record. It also plots two graphs using the popular [matplotlib](https://matplotlib.org/) library and save them also in the _outputs_ folder.

Note we also used some numpy tricks to add some random features to the dataset in order to make the problem a little harder to solve. After all, Iris is a toy sample dataset that you can easily achieve 100% accuracy. 

Also, pay special attention to the _run_logger_ object in the Python code. It records regularization rate, and the model accuracy into logs which will we will revisit in a later step.

Now, open the _conda_dependencies.yml_ file under the _aml_config_ directory, and observe that this file specifies the Python version and also the _scikit-learn_ package and the _matplotlib_ package. If you need other packages for your script execution beyond what's included in the base conda runtime, you can also list them here and conda will automatically download them and add to your execution environment. For more information on execution environment, please review [Configuring Execution Options](Execution.md) and [Demystifying _aml_config_ Folder](aml_config.md).

>Note: the _conda_dependencies.yml_ file is only relevant if you are targeting Docker container (local or remote) for execution. It has no effect if you are targeting local compute context.

## Step 5. Run the Python Script on the Local Computer from Command Line
Launch the command line window by clicking on _File_ --> _Open Command-Line Interface_, noice that you are automatically placed in the project folder. In this example the project is located in _C:\Temp\myIris_.

>Important: You **must** use the command line window opened from Workbench, and you also **must** log into Azure from the command line window, in order to issue the following commands. You might already have a cached/valid az-cli token if you've logged in before. Otherwise please use the following command to log in:
```batch
REM log in using aka.ms/devicelogin site.
C:\Temp\myIris> az login

REM list all Azure subscriptions you have access to. 
C:\Temp\myIris> az account list -o table

REM set the current Azure subscription to the one you want o use.
C:\Temp\myIris> az set account -s <subscriptionId>

REM verif your current subscription is set correctly
C:\Temp\myIris> az account show
```

For more information on authentication in the command line window, please reference [CLI Execution Authentication](Execution.md#cli-execution-authentication). 

Once you are authenticated, type the following commands in the terminal window. 
```batch
REM install matplotlib first since it is required for the Iris sample project, but it is not installed by Azure ML Workbench by default.
C:\Temp\myIris> pip install matplotlib

REM Kick off an execution of the iris_sklearn.py file against local compute context
C:\Temp\myIris> az ml experiment submit -c local .\iris_sklearn.py
```
This command executes the *iris_sklearn.py* file locally. After the execution finishes, you should see the output in the CLI window. The accuracy is printed out along with the prediction on the new record, as well as the confusion matrix.

```text
Python version: 3.5.2 |Continuum Analytics, Inc.| (default, Jul  5 2016, 11:41:13) [MSC v.1900 64 bit (AMD64)]

Iris dataset shape: (150, 5)
Regularization rate is 10.0
LogisticRegression(C=0.1, class_weight=None, dual=False, fit_intercept=True,
          intercept_scaling=1, max_iter=100, multi_class='ovr', n_jobs=1,
          penalty='l2', random_state=None, solver='liblinear', tol=0.0001,
          verbose=0, warm_start=False)
Accuracy is 0.6415094339622641

==========================================
Serialize and deserialize using the outputs folder.

Export the model to model.pkl
Import the model from model.pkl
New sample: [[3.0, 3.6, 1.3, 0.25]]
Predicted class is ['Iris-setosa']
Plotting confusion matrix...
Confusion matrix in text:
[[50  0  0]
 [ 0 31 19]
 [ 0  4 46]]
Confusion matrix plotted.
Plotting ROC curve....
ROC curve plotted.
Confusion matrix and ROC curve plotted. See them in Run History details page.
```

## Step 6. Edit the _iris_sklearn.py_ File and Run Again
Now, let's try the following command line with an argument _0.1_:

```batch
REM run iris_sklearn.py again on local context with a regularization rate set to 0.1
C:\Temp\myIris> az ml experiment submit -c local .\iris_sklearn.py 0.1
```
This time you should see a different (probably lower) accuracy number being printed out. This command line changes the regularization rate from the default value of 0.01 to 0.1, which is then fed to the logistic regression algorithm. This generally has an adverse effect on the accuracy of the model but we find out soon enough.

To understand how an argument is passed into the script as the regularization rate setting, you can open the *iris_sklearn.py* file in the Vienna desktop app and read through the source code.

Another thing to note is that the model is serialized into a pickle file in a special folder named _outputs_. Anything produced in the _outputs_ folder is preserved as part of the historical record of the execution. You can read more about this magical _outputs_ folder in the [Persisting Data](PersistingChanges.md) article.

## Step 6a (optional). Run in a Docker Container on the Local Computer 
If you have a Docker engine running locally, in the command line window, repeat the same command. Except this time, let's change the run configuration from _local_ to _docker-python_:

```batch
REM execute against a local Docker container with Python context
C:\Temp\myIris> az ml experiment submit -c docker-python .\iris_sklearn.py
```
This command pulls down a base Docker image, lays a conda environment on that base image based on the _conda_dependencies.yml_ file in your_aml_config_ directory, and then starts a Docker container. It then executes your script. You should see some Docker image construction messages in the CLI window. And in the end, you should see the exact same output as step 5. You can find the _docker-python.runconfig_ file and _docker-python.compute_ file under _aml_config_ folder and examine the content to understand how they control the execution behavior. For more details on these run configuration files, please review [Demystefying _aml_config_](aml_config.md) article.

## Step 6b (optional). Run in a Docker Container on a Remote Machine.
To execute your script in a Docker container on a remote Linux machine, you need to have SSH access (using username and password) to that remote machine, and that remote machine must have the Docker engine installed. The easiest way to obtain such a Linux machine is to create a [Ubuntu-based Data Science Virtual Machine (DSVM)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu) on Azure. (Note the CentOS-based DSVM is NOT supported.) 

Generate the _myvm.compute_ and _myvm.runconfig_ files by running the following command:
```batch
REM create myvm compute target
C:\Temp\myIris\> az ml computetarget attach --name myvm --address <IP address> --username <username> --password <password>
```
Edit the generated _myvm.runconfig_ file under _aml_config_ and change the Framework from default PySpark to Python:
```yaml
"Framework": "Python"
```

Now issue the same command as you did before in the CLI window, except this time we will target _myvm_:
```batch
REM execute iris_sklearn.py in remote Docker container
C:\Temp\myIris> az ml experiment submit -c myvm .\iris_sklearn.py
```
When the command is executed, the exact same thing happens as Step 6a except it happens on that remote machine. You should observe the exact same output information in the CLI window.

## Step 6c (optional). Run a PySpark Script.
The Docker base image we use to execute step 6a and 6b contains a Spark instance. Thus, you can also execute a PySpark script in it. Open the _iris_pyspark.py_ file, read through it. This script loads the _iris.csv_ data file, and uses the Logistic Regression algorithm from the Spark ML library to classify the Iris dataset.

To run the PySpark script on the Spark instance in the local Docker container, switch to the command line, and type the following command:
```batch
REM execute iris_pyspark.py in Spark instance on local Docker container
C:\Temp\myIris> az ml experiment submit -c docker-spark .\iris_pyspark.py
```
You can also run the PySpark script in the remote Docker container. Make a copy of the _myvm.runconfig_ file and name it _myvm-spark.runconfig_. And edit the _myvm-spark.runconfig_ file to change the Framework from Python to PySpark:
```yaml
"Framework": "PySpark"
```

Next, type this command to run it in the Spark instance in the remote Docker container:
```batch
REM execute iris_pyspark.py in Spark instance on remote Docker container
C:\Temp\myIris> az ml experiment submit -c myvm-spark .\iris_pyspark.py
```

You can also try to run this script in an actual Spark cluster. If you have access to a _Spark for Azure HDInsight_ cluster, generate an HDI run configuration using the following command:
```batch
REM create a compute target that points to a HDI cluster
C:\Temp\myIris\> az ml computetarget attach --name myhdi --address <cluster name>-ssh.azurehdinsight.net --username <username> --password <password> --cluster
```
>Note the _username_ is the cluster SSH username. The default value is _sshuser_ if you don't change it during HDI provisioning. It is NOT _admin_ which is the other user created during provisioning that allows you to access the admin web UI of the cluster. 

Now issue the following command and the script should run in the HDI cluster:
```batch
REM execute iris_pyspark on the HDI cluster
C:\Temp\myIris> az ml experiment submit -c myhdi .\iris_pyspark.py
```
>Note: When you execute against a remote HDI cluster, you can also view the YARN job execution details at https://<cluster_name>.azurehdinsight.net/yarnui.

## Step 7. Explore Run History
After you run the _iris_sklearn.py_ script a few times in the CLI window, go back to the Vienna desktop app.

You can also kick off the run against _local_ or _docker_ environments right from the code window in the desktop app. After you click on the Run button, you will see a new job added to the jobs panel with updating status. 

![ux execution](../Images/ux_execution.png)

You can kick-off a few more runs using different regularization rates by passing in different arguments. Now click on the Run History icon. 

![Run History](../Images/run_history.png)

You should see _iris_sklearn.py_ listed as an item in the run history list. Click on it to see the run history dashboard for this particular script, which includes some graphs depicting metrics recorded in each run, along with the list of runs showing basic information including as created date, status, and duration. 

You can click on an individual run, and explore the details recorded for that run. If the run is still underway, you will see execution messages streaming into the log file window that are opened in the run details page. 

![Run History](../Images/streaming_log.png)

If the run has successfully finished, and you have created output files in the special "outputs" folder, they are listed at the bottom of the run detail page as well.

![Run History](../Images/output_files.png)

And if there are images (.png and .jpg are the format we support right now) produced by your script run, they are rendered in the images section.

You can also select up to 3 runs in the run list, and click on the _Compare_ button to compare the selected runs.

![Run comparison](../Images/compare_runs.png)

Pay particular attention to the Logged Metrics section in the run comparison screen. Notice the changes in the regularization rate and accuracy value in the second run comparing to the first run. This tells you setting regularization too coarse is probably not going to help improving the model accuracy. Also recall that the regularization rate and accuracy value are recorded by the _run_logger_ object in the Python code.

## Step 7a. (optional) Script mulitiple runs of the _iris_sklearn.py_ file using Python
Open the _run.py_ file and examine the content. You will see it executes the _iris_sklearn.py_ file multiple times, each time using a regularization rate that is 1/2 of the value before. 

```python
import os

reg = 10
while reg > 0.005:
    os.system('az ml experiment submit -c local ./iris_sklearn.py {}'.format(reg))
    reg = reg / 2
```

Now go back to the command line window, and type:
```
REM kick off many runs sequentially
C:\Temp\myIris> python run.py
```
This kicks off multiple runs and it should finish in a few minutes. Afterwards, go to the run history view in the Vienna desktop app, and you will find a graph like this:

![Iris runs](../Images/iris_runs.png)

## Step 8. Obtain the Pickled Model
In the _iris_sklearn.py_ script, we serialize the logistic regression model using the popular object serialization package -- pickle, into a file named _model.pkl_ on disk. Here is the code snippet.

```python
print("Export the model to model.pkl")
f = open('./outputs/model.pkl', 'wb')
pickle.dump(clf1, f)
f.close()
```

When you executed the *iris_sklearn.py* script using the *az ml experiment submit* command, the model was written to the *outputs* folder with the name *model.pkl*. This folder lives in the compute target, not your local project folder. You can find it in the run history detail page and download this binary file by clicking on the download button next to the file name. Read more about the  _outputs_ folder in the [Persisting Changes](PersistingChanges.md) article.

![Download Pickle](../Images/download_model.png)

Now, download the model file _model.pkl_ and save it to the root of your  project folder. You will need it in the later steps.

## Step 9. Prepare for Operationalization Locally
Local mode deployments run in docker containers on your local computer, whether that is your personal machine or a VM running on Azure. You can use local mode for development and testing.

>Note: The Docker engine must be running locally to complete the operationalization steps as shown in the following steps.

Let's prepare the operationalization environment. In the CLI window type the following to set up the environment for local operationalization:

```
C:\Temp\myIris> az ml env setup -n <your new environment name>
```
>If you need to scale out your deployment (or if you don't have Docker engine installed locally, you can choose to deploy the web service on a cluster. In cluster mode, your service is run in the Azure Container Service (ACS). The operationalization environment provisions Docker and Kubernetes in the cluster to manage the web service deployment. Deploying to ACS allows you to scale your service as needed to meet your business needs. To deploy web service into a cluster, add the _--cluster_ flag to the set up command. For more information, enter the _--help_ flag.

Follow the on-screen instructions to provision an Azure Container Registry (ACR) instance and a storage account in which to store the Docker image we are about to create. When finished, a file named _.amlenvrc.cmd_ is created in your home directory (usually _C:\Users\<username>_\) which contains then names and credentials of the ACR and storage account. 

To set the environment variables required for operationalization, simply execute the _.amlenvrc.cmd_ file from the command line. 

```batch
C:\Temp\myIris> c:\Users\<username>\.amlenvrc.cmd
```

Alternatively, you can also open that file in Notepad, copy the content and paste into the CLI command window to set the environment variables.

To verify that you have properly configured your operationalization environment for local web service deployment, enter the following command:

```batch
C:\Temp\myIris> az ml env local
```

## Step 10. Create a Realtime Web Service
Now you are ready to operationalize the pickled Iris model. 

To deploy the web service, you must have a model, a scoring script, and optionally a schema for the web service input data. The scoring script loads the _model.pkl_ file from the current folder and uses it to produce a new predicted Iris class. The input to the model is an array of four numbers representing the sepal length and width, and pedal length and width. 

In this example, you will use a schema file to help parse the input data. To generate the scoring and schema files, simply execute the _iris_schema_gen.py_ file that comes with the sample project in the Vienna CLI command prompt using Python interpreter directly.  

```batch
C:\Temp\myIris> python iris_schema_gen.py
```

Two files are placed in a subfolder named *output_&lt;time_stamp&gt;*.

- main.py (this file is the scoring script)
- service_schema.json (this file contains the schema of the web service input)

Now you are ready to create the real time web service:
```batch
c:\temp\myIris> az ml service create realtime -f output_<time_stamp>\main.py --model-file model.pkl -s output_<time_stamp>\service_schema.json -n irisapp -r scikit-py
```
To quickly explain the switches of the _az ml service create realtime_ command:
* -n: app name, must be lower case.
* -f: scoring script file name
* --model-file: model file, in this case it is the pickled sklearn model
* -r: type of model, in this case it is the scikit-learn model

>Important: The service name (it is also the new Docker image name) must be all lower-case, otherwise you will see an error.

When you run the command, the model and the scoring file are uploaded into an Azure service that we manage. As part of deployment process, the operationalization component uses the pickled model *model.pkl* and *main.py* to build a Docker image named *<ACR_name>.azureacr.io/irisapp*. It registers the image with your Azure Container Registry (ACR) service, pulls down that image locally to your computer, and starts a Docker container based on that image. (If your environment is configured in cluster mode, the Docker container will instead be deployed into the Kubernetes cluster.)

As part of the deployment, an HTTP REST endpoint for the web service is created on your local machine. After a few minutes the command should finish with a success message and your web service is ready for action!

You can see the running Docker container using the _Docker ps_ command:
```batch
c:\Temp\myIris> docker ps
```
You can test the running _iris_ web service by feeding it with a JSON encoded record containing an array of four random numbers.

The web service creation included sample data. When running in local mode, you can call the *az ml service view* command to retrieve a sample run command that you can use to test the service.

```
az ml service view realtime -n irisapp
```

To test the service, execute the returned service run command.

```
c:\Temp\myIris> az ml service run realtime -n irisapp -d "{\"input_df\": [{\"petal length\": 1.3, \"sepal width\": 3.6, \"petal width\": 0.25, \"sepal length\": 3.0}]}"
"2"
```
The output is *"2"* of which *2* is the predicted class. (Your result might be different.) And if you want to see the raw HTTP REST endpoint, you can issue the following command:
```
c:\Temp\myIris> az ml service view realtime -v
``` 
This displays the HTTP endpoint, the port number, and a sample curl command you can use to post to this REST endpoint. 

## Congratulations!
Great job! You have successfully run a training script in various compute environments, created a model, serialized the model, and operationalized the model through a Docker-based web service. 

Hope you enjoy this tutorial and please send us feedback through these [various feedback channels](Feedback.md).
