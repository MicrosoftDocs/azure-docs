# Real World Scenario: Aerial Image Classification

This example demonstrates how to use Azure Machine Learning (AML) Workbench to coordinate distributed training of image classification models. Two approaches to distributed training are presented, each using a different method and compute target. In the first approach, MMLSpark is used on an Azure HDInsight Spark cluster to featurize images using a pretrained CNTK model, then train a classifier on the featurized images. This approach's major advantages are that it does not require expensive GPU compute, is relatively fast, and can avoid overfitting when few training samples are available. In the second approach, transfer learning is applied to retrain an existing CNTK image classification DNN using an Azure Batch AI Training GPU cluster. Deep retraining of DNNs often achieves improved model performance when the number of training samples is large enough to avoid overfitting. This example concludes by showing how either model type can be used to score large image sets stored in the cloud.

## Outline
- [Use case description](#usecasedescription)
- [Set up compute environments](#excenv)
  - [Deploy Azure resources](#resources)
     - [Log in to the Azure Command Line Interface and create the resource group](#clilogin)
     - [Create the storage account](#storage)
     - [Create the HDInsight Spark cluster](#hdinsight)
  - [Create a Batch AI Training cluster](#bait)
     - [Install Batch AI Training Software Development Kit and Command Line Interface](#installbait)
     - [Create Batch AI Training resources](#baitresources)
     - [Record Batch AI Training credentials](#recordbait)
  - [Prepare the AML Workbench execution environment](#amlwb)
     - [Register the HDInsight cluster as an AML Workbench compute context](#register)
     - [Install local dependencies](#dependencies)
- [Data acquisition and understanding](#dataunderstanding)
- [Modeling](#modeling)
  - [Training models with MMLSpark](#mmlsparktrain)
  - [Training models with Batch AI Training](#baittrain)
  - [Comparing model performance using the Workbench Run History feature](#comparing)
- [Deployment](#deployment)
- [Visualization](#visualization)
- [Cleanup](#cleanup)

<a name="usecasedescription"></a>
## Use case description

In this scenario, we train deep neural networks (DNNs) to classify the type of land shown in aerial images of 224-meter x 224-meter plots. Land use classification models can be used to track urbanization, deforestation, loss of wetlands, and other major environmental trends using periodically collected aerial imagery. We have prepared training and validation image sets based on imagery from the U.S. National Agriculture Imagery Program and land use labels published by the U.S. National Land Cover Database. After training and validating the classifier model, we will apply it to aerial images spanning Middlesex County, MA -- home of Microsoft's New England Research & Development (NERD) Center -- to demonstrate how these models can be used to study trends in urban development.

To produce an image classifier using transfer learning, data scientists often construct multiple models with a range of methods and select the most performant model. Azure Machine Learning Workbench can help data scientists coordinate training across compute environments, track and compare the performance of multiple models, and apply a chosen model to large datasets on the cloud.

<a name="excenv"></a>
## Set up compute environments

The following instructions prepare the three compute environments used in this tutorial:
- a Batch AI Training GPU cluster
- an HDInsight Spark cluster
- your local Windows or Mac OS X environment

Prerequisites:
- An [Azure account](https://azure.microsoft.com/en-us/free/)
- [Azure Machine Learning Workbench]()
    - Follow the [installation and setup guide]() to create a workspace
- [AzCopy](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azcopy), a utility for coordinating file transfer between Azure storage accounts
- An SSH client; we recommend [PuTTY](http://www.putty.org/)

<a name="resources"></a>
### Deploy Azure resources

<a name="clilogin"></a>
#### Log in to the Azure Command Line Interface and create the resource group

Load the Aerial Image Classification project in Azure Machine Learning Workbench as follows:

1. Open Azure Machine Learning Workbench.
1. Create a new project by clicking File -> New Project.
1. Select a project name, local directory for storing project files, and workspace.
1. In the list of project templates, select "Aerial Image Classification."
1. Click "Create."

    Your screen should update as the new project is loaded in Workbench.

1. From your AML Workbench project, open a Command Line Interface (CLI) by clicking File -> Open Command Prompt.
1. From the command line interface, log in to your Azure account by running the following command:

    ````
    az login
    ```

    You are asked to visit a URL and type in a provided temporary code; the website requests your Azure account credentials.
1. When login is complete, return to the CLI and run the following command to determine which Azure subscriptions are available to your Azure account:

    ```
    az account list
    ```

    This command lists all subscriptions associated with your Azure account. Find the ID of the subscription you would like to use. Write the subscription ID where indicated in the following command, then set the active subscription by executing the command:

    ```
    az account set --subscription [subscription ID]
    ```

1. The Azure resources created by this tutorial are stored in an Azure resource group. Choose a unique resource group name and write it where indicated in the following ༖༗ command: Then execute both commands to create the Azure resource group:

    ```
    set AZURE_RESOURCE_GROUP=[resource group name]
    az group create --location eastus --name %AZURE_RESOURCE_GROUP%
    ```

<a name="storage"></a>
#### Create the storage account

We now create the storage account that hosts project files for access by the HDInsight Spark and Batch AI Training clusters.

1. Choose a unique storage account name and write it where indicated in the following `set` command, then create an Azure storage account by executing both commands:

    ```
    set STORAGE_ACCOUNT_NAME=[storage account name]
    az storage account create --name %STORAGE_ACCOUNT_NAME% --resource-group %AZURE_RESOURCE_GROUP% --sku Standard_LRS
    ```

1. Issue the following command to list the storage account keys:

    ```
    az storage account keys list --resource-group %AZURE_RESOURCE_GROUP% --account-name %STORAGE_ACCOUNT_NAME%
    ```

    Record the value of `key1` where indicated in the following command, then run the command to store the value.
    ```
    set STORAGE_ACCOUNT_KEY=[storage account key]
    ```
1. Create a file share named `baitshare` in your storage account with the following command:

    ```
    az storage share create --account-name %STORAGE_ACCOUNT_NAME% --account-key %STORAGE_ACCOUNT_KEY% --name baitshare
    ```
1. In your favorite text editor, load the `settings.cfg` file from the AML Workbench project's "Code" subdirectory, and insert the storage account name and key as indicated. Save and close the `settings.cfg` file.
1. If you have not already done so, download and install the [AzCopy](http://aka.ms/downloadazcopy) utility.
1. Issue the following commands to copy all of the sample data, pretrained models, and model training scripts to the appropriate locations in your storage account:

    ```
    AzCopy /Source:https://mawahsparktutorial.blob.core.windows.net/test /SourceSAS:"?sv=2017-04-17&ss=bf&srt=sco&sp=rwl&se=2037-08-25T22:02:55Z&st=2017-08-25T14:02:55Z&spr=https,http&sig=yyO6fyanu9ilAeW7TpkgbAqeTnrPR%2BpP1eh9TcpIXWw%3D" /Dest:https://%STORAGE_ACCOUNT_NAME%.blob.core.windows.net/test /DestKey:%STORAGE_ACCOUNT_KEY% /S
    AzCopy /Source:https://mawahsparktutorial.blob.core.windows.net/train /SourceSAS:"?sv=2017-04-17&ss=bf&srt=sco&sp=rwl&se=2037-08-25T22:02:55Z&st=2017-08-25T14:02:55Z&spr=https,http&sig=yyO6fyanu9ilAeW7TpkgbAqeTnrPR%2BpP1eh9TcpIXWw%3D" /Dest:https://%STORAGE_ACCOUNT_NAME%.blob.core.windows.net/train /DestKey:%STORAGE_ACCOUNT_KEY% /S
    AzCopy /Source:https://mawahsparktutorial.blob.core.windows.net/middlesexma2016 /SourceSAS:"?sv=2017-04-17&ss=bf&srt=sco&sp=rwl&se=2037-08-25T22:02:55Z&st=2017-08-25T14:02:55Z&spr=https,http&sig=yyO6fyanu9ilAeW7TpkgbAqeTnrPR%2BpP1eh9TcpIXWw%3D" /Dest:https://%STORAGE_ACCOUNT_NAME%.blob.core.windows.net/middlesexma2016 /DestKey:%STORAGE_ACCOUNT_KEY% /S
    AzCopy /Source:https://mawahsparktutorial.blob.core.windows.net/pretrainedmodels /SourceSAS:"?sv=2017-04-17&ss=bf&srt=sco&sp=rwl&se=2037-08-25T22:02:55Z&st=2017-08-25T14:02:55Z&spr=https,http&sig=yyO6fyanu9ilAeW7TpkgbAqeTnrPR%2BpP1eh9TcpIXWw%3D" /Dest:https://%STORAGE_ACCOUNT_NAME%.blob.core.windows.net/pretrainedmodels /DestKey:%STORAGE_ACCOUNT_KEY% /S
    AzCopy /Source:https://mawahsparktutorial.blob.core.windows.net/pretrainedmodels /SourceSAS:"?sv=2017-04-17&ss=bf&srt=sco&sp=rwl&se=2037-08-25T22:02:55Z&st=2017-08-25T14:02:55Z&spr=https,http&sig=yyO6fyanu9ilAeW7TpkgbAqeTnrPR%2BpP1eh9TcpIXWw%3D" /Dest:https://%STORAGE_ACCOUNT_NAME%.file.core.windows.net/baitshare/pretrainedmodels /DestKey:%STORAGE_ACCOUNT_KEY% /S
    AzCopy /Source:https://mawahsparktutorial.blob.core.windows.net/scripts /SourceSAS:"?sv=2017-04-17&ss=bf&srt=sco&sp=rwl&se=2037-08-25T22:02:55Z&st=2017-08-25T14:02:55Z&spr=https,http&sig=yyO6fyanu9ilAeW7TpkgbAqeTnrPR%2BpP1eh9TcpIXWw%3D" /Dest:https://%STORAGE_ACCOUNT_NAME%.file.core.windows.net/baitshare/scripts /DestKey:%STORAGE_ACCOUNT_KEY% /S
    ```

    Expect file transfer to take up to 20 minutes. While you wait, you can proceed to the following section. You may need to open another Command Line Interface through Workbench and redefine the temporary variables there.

<a name="hdinsight"></a>
#### Create the HDInsight Spark cluster

Our recommended method to create an HDInsight cluster uses the HDInsight Spark cluster Resource Manager template included in the "Code\01_Data_Acquisition_and_Understanding\01_HDInsight_Spark_Provisioning" subfolder of this tutorial.

1. Choose a unique name and password for the HDInsight cluster and write them where indicated in the following command. Then create the cluster by issuing the following command:

    ```
    set HDINSIGHT_CLUSTER_NAME=[HDInsight cluster name]
    set HDINSIGHT_CLUSTER_PASSWORD=[HDInsight cluster password]
    az group deployment create --resource-group %AZURE_RESOURCE_GROUP% --name hdispark --template-file "Code\01_Data_Acquisition_and_Understanding\01_HDInsight_Spark_Provisioning\template.json" --parameters storageAccountName=%STORAGE_ACCOUNT_NAME%.blob.core.windows.net storageAccountKey=%STORAGE_ACCOUNT_KEY% clusterName=%HDINSIGHT_CLUSTER_NAME% clusterLoginPassword=%HDINSIGHT_CLUSTER_PASSWORD%
    ```

Your cluster's deployment may take up to 30 minutes (including provisioning and script action execution). In the meantime, you may continue to the Batch AI Training cluster setup.

<a name="bait"></a>
### Create a Batch AI Training cluster

<a name="installbait"></a>
#### Install Batch AI Training Software Development Kit and Command Line Interface

Follow the instructions on the Batch AI Training website to create a Batch AI Training account and install its Python SDK and CLI.
[Instructions may change in public preview. I've contacted the BAIT team about staying in the loop when their plans are finalized.]

<a name="baitresources"></a>
#### Create Batch AI Training resources

Now that you have installed the Batch AI Training Azure Command Line Interface, you are ready to create the components of your training cluster. Open a command prompt and navigate to the folder where you installed the Batch AI Training Azure Command Line Interface. Run the following command:

```
az --version 
```

Confirm that `batchai` is listed among the installed modules. If not, you may be using the incorrect Command Line Interface (for example, one opened through Workbench).

Write your Batch AI Training credentials in the following commands as indicated, then store the values by executing the commands:
```
set AZURE_BATCH_AI_TRAINING_ACCESS_KEY=[Batch AI Training access key (also called an authentication thumbprint)]
set AZURE_BATCH_AI_TRAINING_SUBSCRIPTION_ID=[Batch AI Training subscription id]
set AZURE_BATCH_AI_TRAINING_URL=[Batch AI Training URL]
set PATH_TO_PROJECT=[The filepath of your Workbench project's root directory]
```

#### Prepare the Network File Server

Your Batch AI Training cluster hosts your training data on a Network File Server.

1. Issue the following command to create a Network File Server:

    ```
    az batchai file_server create --file_server_name landuseclassifier --json_file %PATH_TO_PROJECT%\Code\01_Data_Acquisition_and_Understanding\02_Batch_AI_Training_Provisioning\fileserver.json --resource_group landuseclassifier
    ```

1. Check the provisioning status of your Network File Server using the following command:

    ```
    az batchai file_server list
    ```

    When the "provisioningState" of the Network File Server named "landuseclassifier" is "succeeded", it is ready for use. Expect provisioning to take about five minutes.
1. Find the IP address of your NFS in the output of the previous command (the "fileServerPublicIp" property under "mountSettings"). Write the IP address where indicated in the following command, then store the value by executing the command:

    ```
    set AZURE_BATCH_AI_TRAINING_NFS_IP=[your NFS IP address]
    ```

1. Using your favorite SSH tool (the following sample command uses [PuTTY](http://www.putty.org/)), execute the `prep_nfs.sh` script on the NFS to transfer the training and validation image sets there.

    ```
    putty -ssh demoUser@%AZURE_BATCH_AI_TRAINING_NFS_IP% -pw Dem0Pa$$w0rd -m %PATH_TO_PROJECT%\Code\01_Data_Acquisition_and_Understanding\02_Batch_AI_Training_Provisioning\prep_nfs.sh
    ```

    While these commands run, you may find that the data download and extraction progress updates scroll across the shell window in an illegible manner.

You can confirm that the data transfer has proceeded as planned by logging in to the file server with your favorite SSH tool and checking the /mnt/data directory contents. You should find two folders, training_images and validation_images, each containing with subfolders named according to land use categories.  The training and validation sets should contain ~44k and ~11k images, respectively.

#### Create a Batch AI Training cluster

1. In your favorite text editor, open the `cluster.json` file under the "Code\01_Data_Acquisition_and_Understanding\02_Batch_AI_Training_Provisioning" subfolder of your Workbench project. Fill in the following information:
    - Under `azureFileShareReferences`:
       - `accountName`: your storage account's name
       - `azureFileURL`: insert your storage account's name where indicated
       - `accountKey`: your storage account's key
    - Under `fileServerReferences`:
       - `id`: insert your Batch AI Training ID where indicated
    Save and close the file.
1. Create the cluster by issuing the following command:

    ```
    az batchai cluster create --cluster_name landuseclassifier --resource_group landuseclassifier --json_file %PATH_TO_PROJECT%\Code\01_Data_Acquisition_and_Understanding\02_Batch_AI_Training_Provisioning\cluster.json 
    ```

1. Use the following command to check your cluster's provisioning status:
Check your cluster's provisioning status using the following command:

    ```
    az batchai cluster list
    ```

    When the allocation state for the cluster named "landuseclassifier" changes from resizing to steady, it's possible to submit jobs. However, jobs do not start running until all VMs in the cluster have left the "preparing" state. If the "errors" property of the cluster is not null, an error occurred during cluster creation and it should not be used.

<a name="recordbait"></a>
#### Record Batch AI Training credentials

Open the `settings.cfg` file from the "Code" subdirectory of this project in the text editor of your choice. Update the following variables with your own credentials:
- `bait_subscription_id` (a 36-characer string containing some dashes)
- `bait_url` (for example, https://eastus.batchaitraining-test.azure.com)
- `bait_api_version` (for example, 2017-05-01)
- `bait_authentication_thumbprint` (a 56-character string ending in "=="; sometimes called the access key)
- `bait_region` (for example, eastus)

Once you have assigned these values, save and close `settings.cfg`.

<a name="amlwb"></a>
### Prepare the AML Workbench execution environment

<a name="register"></a>
#### Register the HDInsight cluster as an AML Workbench compute target

Once HDInsight cluster creation is complete, register the cluster as a compute target for your project as follows:

1.  Issue the following command from the Azure Machine Learning Command Line Interface:

    ```
    az ml computetarget attach --name myhdi --address %HDINSIGHT_CLUSTER_NAME%-ssh.azurehdinsight.net --username sshuser --password %HDINSIGHT_CLUSTER_PASSWORD% -t cluster
    ```

    This command adds two files, `myhdi.runconfig` and `myhdi.compute`, to your project's `aml_config` folder.

1. Run the following command to prepare your environment for use:
   ```
   az ml experiment prepare -c myhdi
   ```

<a name="dependencies"></a>
#### Install local dependencies

Open a CLI from AML Workbench and install dependencies needed for local execution by issuing the following command:

```
pip install matplotlib azure-storage==0.36.0 pillow scikit-learn
```

<a name="dataunderstanding"></a>
## Data acquisition and understanding

During setup, the aerial image sets used in this tutorial were transferred to the storage account and Network File Server that you created. The training, validation, and operationalization images are all 224 pixel x 224 pixel PNG files at a resolution of one pixel per square meter. The training and validation images have been organized into subfolders based on their land use label. (The land use labels of the operationalization images are unknown and in many cases ambiguous; some of these images contain multiple land types.) For more information on how these image sets were constructed, see the [Embarrassingly Parallel Image Classification git repository](https://github.com/Azure/Embarrassingly-Parallel-Image-Classification).

To view example images:
1. Log in to the [Azure portal](https://portal.azure.com).
1. Search for the name of your storage account in the search bar along the top of your screen. Click on your storage account in the search results.
2. Click on the "Blobs" link in the storage account's main pane.
3. Click on the container named "train." You should see a list of directories named according to land use.
4. Click on any of these directories to load the list of images it contains.
5. Click on any image and download it to view the image.

The training and validation datasets contain ~44,000 images (4 GB) and ~11k images (1 GB), respectively. The operationalization dataset contains ~67,000 images (6 GB).

<a name="modeling"></a>
## Modeling

<a name="mmlsparktrain"></a>
### Training models with MMLSpark
The `run_mmlspark.py` script in the "Code\02_Modeling" subfolder of the Workbench project is used to train an [MMLSpark](https://github.com/Azure/mmlspark) model for image classification. The script first featurizes the training set images using an image classifier DNN pretrained on the ImageNet dataset (either AlexNet or an 18-layer ResNet). The script then uses the featurized images to train an MMLSpark model (either a random forest or a logistic regression model) to classify the images. The test image set is then featurized and scored with the trained model. The accuracy of the model's predictions on the test set is calculated and logged to AML Workbench's run history feature. Finally, the trained MMLSpark model and its predictions on the test set are saved to blob storage.

Select a name for your trained model, a pretrained model type, and an MMLSpark model type. Write your selections where indicated in the following command, then begin retraining by executing the command from an Azure ML Command Line Interface:

```
az ml experiment submit -c myhdi Code\02_Modeling\run_mmlspark.py --config_filename Code/settings.cfg --output_model_name [unique model name, alphanumeric characters only] --pretrained_model_type {alexnet,resnet18} --mmlspark_model_type {randomforest,logisticregression}
```

An additional `--sample_frac` parameter can be used to train and test the model with a subset of available data. Using a small sample fraction decreases runtime at the expense of accuracy. For more information on this and other parameters, run `python run_mmlspark.py -h`.

Users are encouraged to run this script several times with different input parameters. The performance of the resulting models can then be compared in AML Workbench's Run History feature.

<a name="baittrain"></a>
### Training models with Batch AI Training

The `run_batch_ai.py` script in the "Code\02_Modeling" subfolder of the Workbench project is used to issue a Batch AI Training job. This job retrains an image classifier DNN chosen by the user (AlexNet or ResNet 18 pretrained on ImageNet). The depth of retraining can also be specified: retraining just the final layer of the network may reduce overfitting when few training samples are available, while fine-tuning the whole network (or, for AlexNet, the fully connected layers) can lead to greater model performance when the training set is sufficiently large.

When the training job completes, this script saves the model (along with a file describing the mapping between the model's integer output and the string labels) and the predictions to blob storage. The BAIT job's log file is parsed to extract the timecourse of error rate improvement over the training epochs. The  error rate improvement timecourse is logged to AML Workbench's run history feature for later viewing.

Select a name for your trained model, a pretrained model type, and a retraining depth. Write your selections where indicated in the following command, then begin retraining by executing the command from an Azure ML Command Line Interface:

```
az ml experiment submit -c local Code\02_Modeling\run_batch_ai.py --config_filename Code/settings.cfg --output_model_name [unique model name, alphanumeric characters only] --pretrained_model_type {alexnet,resnet18} --retraining_type {last_only,fully_connected,all}
```

Expect the Vienna run to take about half an hour to complete. We recommend that you run a few similar commands (varying the output model name, the pretrained model type, and the retraining depth) so that you can compare the performance of models trained with different methods.

<a name="comparing"></a>
### Comparing model performance using the Workbench Run History feature

After you have executed two or more training runs of either type, return to the Workbench program and navigate to the Run History feature by clicking the clock icon along the left-hand menu bar. Select either `run_batch_ai.py` or `run_mmlspark.py` from the list of scripts at left. A pane loads comparing the test set accuracy for all runs. To see more detail, scroll down and click on an individual run's name. Click on a specific Batch AI Training run to see a graph of the decrease in model error rate over time.

<a name="deployment"></a>
## Deployment

To apply one of the trained models to aerial images tiling Middlesex County, MA using remote execution on HDInsight, insert your desired model's name into the following command and execute it:

```
az ml experiment submit -c myhdi Code\03_Deployment\batch_score_spark.py --config_filename Code/settings.cfg --output_model_name [trained model name chosen earlier]
```

This script writes the predictions to your storage account. They can be visualized as described in the next section.

<a name="visualization"></a>
## Visualization

The "Model prediction analysis" Jupyter notebook in the "Code\04_Result_Analysis" subfolder of the Workbench project visualizes a model's predictions. Load and run the notebook as follows:
1. Open the project in Workbench and click on the folder ("Files") icon along the left-hand menu to load the directory listing.
2. Navigate to the "Code\04_Result_Analysis" subfolder and click on the notebook named "Model prediction analysis." A preview rendering of the notebook should be displayed.
3. Click "Start Notebook Server" to load the notebook.
4. In the first cell, enter the name of the model whose results you would like to analyze where indicated.
5. Click on "Cell -> Run All" to execute all cells in the notebook.
6. Read along with the notebook to learn more about its analyses and visualizations.


<a name="cleanup"></a>
## Cleanup

When you have completed the tutorial, we recommend that you delete all of the resources you have created.

1. Remove the storage account, HDInsight cluster, and Azure resource group you created by executing the following command from the Azure Command Line Interface:

    ```
    az group delete --name %AZURE_RESOURCE_GROUP%
    ```

1. Remove the Batch AI Training file server and cluster you created by issuing the following commands in the Batch AI Training Command Line Interface:

    ```
    az batchai cluster delete --cluster_name landuseclassifier --resource_group landuseclassifier
    az batchai file_server delete --file_server_name landuseclassifier --resource_group landuseclassifier
    ```