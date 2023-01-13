---
title: Setup MLOps with Azure DevOps
titleSuffix: Azure Machine Learning
description: Learn how to setup a sample MLOps environment in AzureML
services: machine-learning
author: abeomor
ms.author: osomorog
ms.service: machine-learning
ms.subservice: mlops
ms.date: 11/29/2022
ms.topic: conceptual
ms.custom: cli-v2, sdk-v2
---

# Setup MLOps with Azure DevOps

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

Azure Machine Learning allows you to integration with [Azure DevOps pipeline](/azure/devops/pipelines/) to automate the machine learning lifecycle. Some of the operations you can automate are:

* Deployment of AzureML infrastructure
* Data preparation (extract, transform, load operations)
* Training machine learning models with on-demand scale-out and scale-up
* Deployment of machine learning models as public or private web services
* Monitoring deployed machine learning models (such as for performance analysis)

In this article, you learn about using Azure Machine Learning to setup an end-to-end MLOps pipeline which runs a linear regression to predict taxi fares in NYC. The pipeline is made up of components, each serving  different functions, which can be registered with the workspace, versioned, and reused with various inputs and outputs. you are going to be using the [Azure MLOps (v2) solution accelerator](https://github.com/Azure/mlops-v2) to quickly set up an MLOps project in AzureML.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
- An Azure Machine Learning workspace.
- The Azure Machine Learning [SDK v2 for Python](https://aka.ms/sdk-v2-install).
- The Azure Machine Learning [CLI v2](how-to-configure-cli.md).
- An [organization](/azure/devops/organizations/accounts/create-organization) in Azure DevOps.
- [Azure DevOps project](how-to-devops-machine-learning.md) that will host the source repositories and pipelines.
- The [Terraform extension for Azure DevOps](https://marketplace.visualstudio.com/items?itemName=ms-devlabs.custom-terraform-tasks) if you are using Azure DevOps + Terraform to spin up infrastructure
- [Git bash](https://git-scm.com/download/win), [WSL](/windows/wsl/install) or another terminal on your local machine.

> [!NOTE]
>
>Git version 2.27 or newer is required. For more information on installing the Git command, see https://git-scm.com/downloads and select your operating system

> [!IMPORTANT]
>The CLI commands in this article were tested using Bash. If you use a different shell, you may encounter errors. Essential information required for user success

## Setup authentication with Azure and DevOps

Before you can setup an MLOps project with AzureML you need to make sure you have the correct authentication setup for Azure DevOps.

### Create service principal
   For the use of the demo, the creation of one or two service principles is required, depending on how many environments, you want to work on (Dev or Prod or Both). These principles can be created using one of the methods below:

# [Create from Azure Cloud Shell](#tab/azure-shell)

1. Launch the [Azure Cloud Shell](https://shell.azure.com). (If this the first time you have launched the cloud shell, you will be required to creata storage account for the cloud shell.)

2. If prompted, choose **Bash** as the environment used in the Cloud Shell. You can also change environments in the drop-down on the top navigation bar

    ![Screenshot of the cloud shell environment dropdown](./media/how-to-setup-mlops-azureml/PS_CLI1_1.png)

3. Copy the bash commands below to your computer and update the **projectName**, **subscriptionId**, and **environment** variables with the values for your project. If you are creating both a Dev and Prod environment you will need to run this script once for each environment, creating a service principal for each. This command will also grant the **Contributor** role to the service principal in the subscription provided. This is required for Azure DevOps to properly use resources in that subscription. 

    ``` bash
    projectName="<your project name>"
    roleName="Contributor"
    subscriptionId="<subscription Id>"
    environment="<Dev|Prod>" #First letter should be capitalized
    servicePrincipalName="Azure-ARM-${environment}-${projectName}"
    # Verify the ID of the active subscription
    echo "Using subscription ID $subscriptionID"
    echo "Creating SP for RBAC with name $servicePrincipalName, with role $roleName and in scopes     /subscriptions/$subscriptionId"
    az ad sp create-for-rbac --name $servicePrincipalName --role $roleName --scopes /subscriptions/$subscriptionId
    echo "Please ensure that the information created here is properly save for future use."
    ```

4. Copy your edited commands into the Azure Shell and run them (**Ctrl** + **Shift** + **v**).

    ![Screenshot of cloud shell with pasted text](./media/how-to-setup-mlops-azureml/PS_CLI1_4.png) 


5. After running these commands you will be presented with information related to the service principal. Save this information to a safe location, it will be uselater in the demo to configure Azure DevOps.

    ```json
    {
       "appId": "<application id>",
       "displayName": "Azure-ARM-dev-Sample_Project_Name",
       "password": "<password>",
       "tenant": "<tenant id>"
    }
    ```

6. Repeat **Step 3.** if you are creating service principals for Dev and Prod environments.

7. Close the Cloud Shell once the service principals are created. 
      

# [Create from Azure portal](#tab/azure-portal)

1. Navigate to [Azure App Registrations](https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade/quickStartType~/null/sourceTypeMicrosoft_AAD_IAM)

2. Select **New Registration**.

    ![Screenshot of service principal setup](./media/how-to-setup-mlops-azureml/SP-setup2.png)

3. Go through the process of creating a Service Principle (SP) selecting **Accounts in any organizational directory (Any Azure AD directory - Multitenant)** and name it  **Azure-ARM-Dev-ProjectName**. Once created, repeat and create a new SP named **Azure-ARM-Prod-ProjectName**. Please replace **ProjectName** with the name of your project so that the service principal can be uniquely identified. 

4. Go to **Certificates & Secrets** and add for each SP **New client secret**, then store the value and secret separately.

5. To assign the necessary permissions to these principals, select your respective [subscription](https://portal.azure.com/#view/Microsoft_Azure_BillingSubscriptionsBlade?) and go to IAM. Select **+Add** then select **Add Role Assignment**.

    ![Screenshot of the add role assignment page](./media/how-to-setup-mlops-azureml/SP-setup3.png)

6. Select Contributor and add members selecting + Select Members. Add the member **Azure-ARM-Dev-ProjectName** as create before.

    ![Screenshot of the add role assignment selection](./media/how-to-setup-mlops-azureml/SP-setup4.png)

7. Repeat step here, if you deploy Dev and Prod into the same subscription, otherwise change to the prod subscription and repeat with **Azure-ARM-Prod-ProjectName**. The basic SP setup is successfully finished.

---

### Set up Azure DevOps

1. Navigate to [Azure DevOps](https://go.microsoft.com/fwlink/?LinkId=2014676&githubsi=true&clcid=0x409&WebUserId=2ecdcbf9a1ae497d934540f4edce2b7d). 
   
2. Select **create a new project** (Name the project `mlopsv2` for this tutorial).
   
     ![Screenshot of ADO Project](./media/how-to-setup-mlops-azureml/ado-create-project.png)
   
3. In the project under **Project Settings** (at the bottom left of the project page) select **Service Connections**.
   
     ![Screenshot of ADO Project settings page](./media/how-to-setup-mlops-azureml/ADO-setup1.png)
   
4. Select **New Service Connection**.

     ![Screenshot of ADO New Service connection button](./media/how-to-setup-mlops-azureml/ADO-setup2.png)

5. Select **Azure Resource Manager**, select **Next**, select **Service principal (manual)**, select **Next** and select the Scope Level **Subscription**.

     - **Subscription Name** - Use the name of the subscription where your service principal is stored.
     - **Subscription Id** - Use the `subscriptionId` you used in **Step 1.** input as the Subscription ID
     - **Service Principal Id** - Use the `appId` from **Step 1.** output as the Service Principal ID
     - **Service principal key** - Use the `password` from **Step 1.** output as the Service Principal Key
     - **Tenant ID** - Use the `tenant` from **Step 1.** output as the Tenant ID


6. Name the service connection **Azure-ARM-Dev**.  
 
7. Select **Grant access permission to all pipelines**, then select **Verify and Save**. Repeat this step to create another service connection **Azure-ARM-Prod** using the details of the Prod service principal created in **Step 1.**

The Azure DevOps setup is successfully finished.

### Set up source repository with Azure DevOps
   
1. Open the project you created in [Azure DevOps](https://dev.azure.com/)
   
2. Open the Repos section. Click on  the default repo name at the top of the screen and select **Import Repository**

    ![Screenshot of ADO import repo](./media/how-to-setup-mlops-azureml/ado-import-repo.png)

3. Enter https://github.com/Azure/mlops-templates into the Clone URL field. Click import at the bottom of the page

    ![Screenshot of ADO import MLOps](./media/how-to-setup-mlops-azureml/ado-import-mlops-templates.png)

4. Open the Repos section again and import the following repositories: 
   - https://github.com/Azure/mlops-project-template
   - https://github.com/Azure/mlops-v2 

5. Make sure you have all these three repositories created:
   - mlops-templates
   - mlops-project-template
   - mlops-v2

> [!TIP]
> Learn more about the MLOps v2 accelerator structure and understand why you need to clone [all three repositories](https://github.com/Azure/mlops-v2/tree/main/documentation/structure#repositories)

5. Open the Repos section. Click on the default repo name at the top of the screen and select **New Repository**. 

   ![Screenshot of Add demo project](./media/how-to-setup-mlops-azureml/ado-add-demoproject.png)

6. Enter a desired name for the repository (use `mlopsv2demo` for this tutorial). This will be used to store the files for the project type you choose. Click **Create**

   ![Screenshot of Create demo project](./media/how-to-setup-mlops-azureml/ado-create-demoprojectrepo.png)

7. Open the **Project settings** at the bottom of the left hand navigation pane

   ![Screenshot of Open project settings](./media/how-to-setup-mlops-azureml/ado-open-projectSettings.png)

8.  Under the Repos section, click **Repositories**. Select the repository you created in **Step 6.** Select the **Security** tab

9. Under the User permissions section, select the **mlopsv2 Build Service** user. Change the permission **Contribute** permission to **Allow** and the **Create branch** permission to **Allow**.
   ![Screenshot of ADO permissions](./media/how-to-setup-mlops-azureml/ado-permissions-repo.png)

10. Open the **Pipelines** section in the left hand navigation pane and click on the 3 vertical dots next to the **Create Pipelines** button. Select **Manage Security**

   ![Screenshot of Pipeline security](./media/how-to-setup-mlops-azureml/ado-open-pipelinesSecurity.png)

11. Select the **mlopsv2 Build Service** account for your project under the Users section. Change the permission **Edit build pipeline** to **Allow**

   ![Screenshot of Add security](./media/how-to-setup-mlops-azureml/ado-add-pipelinesSecurity.png)

### Sparse checkout of MLOps v2 repo

> [!TIP]
> Make sure you understand the [Architectural Patterns](https://github.com/Azure/mlops-v2#-pattern-architectures-key-concepts) of the solution accelerator before you checkout the MLOps v2 repo and deploy the infrastructure. In examples you will use the [classical ML project type](https://github.com/Azure/mlops-v2/blob/main/documentation/architecturepattern/AzureML_CML_Architecture.png).

1. Open the Pipelines section and create a new pipeline

   ![Screenshot of Sparse checkout](./media/how-to-setup-mlops-azureml/ado-pipeline-sparsecheckout.png)

2. Perform the following actions:
   1. Select Azure Repos Git
   1. Select the mlops-v2 repository
   1. Select existing Azure Pipelines YAML file
   1. Ensure the selected branch is **main**
   1. Select the `/.azuredevops/initialise-project.yml` file in the patch drop-down
   1. Click Continue 

   On the pipeline review page chose to **Save** the pipeline before running it. 

   ![Screenshot of Save pipeline](./media/how-to-setup-mlops-azureml/ado-save-sparepipeline.png)

3. Click **Run Pipeline**

   ![Screenshot of Run pipeline](./media/how-to-setup-mlops-azureml/ado-run-sparepipeline.png)

   Make sure you select the **main** branch and then you will need to complete the required parameters to configure your project

   ![Screenshot of Parameters for pipeline](./media/how-to-setup-mlops-azureml/ado-parameters-sparepipeline.png)

   - **ADO project name** : This is the name of the Azure DevOps project you created
   - **Project repo name**: This is the name of the mlops-v2 accelerator project you imported from GitHub (Use **mlopsv2demo** for this tutorial)
   - **MLOps Project Template's ADO project name**: This is usually the same as the **ADO project name** unless you imported the template into a different project
   - **MLOps Project Template name**: Name of the shared templates you imported previously (Default is **mlops-project-template**)
   - ML Project type: 
     - Choose **classical** for a regression or classification project.
     - Choose **cv** for a computer vision project
     - Choose **nlp** for natural language  projects
   - MLOps version
     - choose **python-sdk** to use the python SDK for training and deployment of your model
     - Choose **aml-cli-v2** to use the cli tools for training and deployment of your model
   - Infrastructure Version: 
     - Choose **Bicep** to deploy using Azure ARM based templates
     - Choose **terrform** to use terraform based templates. 

4. The first run of the pipeline will require you to grant access to the repositories you created. Click **View** 

   ![Screenshot of ADO Pipeline permissions](./media/how-to-setup-mlops-azureml/ado-pipeline-permissions.png)

5.  Click **Permit** for all repositories waiting for review

   ![Screenshot of ADO Pipeline permissionsReview](./media/how-to-setup-mlops-azureml/ado-pipeline-permissionsPermit.png)

6. The pipeline will run the following actions:
   - Your project repository will be populated with the files needed to create the Azure Machine Learning project and resources. 
   ![Screenshot of ADO view repo Sparse Checkout](./media/how-to-setup-mlops-azureml/ado-view-repoSparseCheckout.png)
   - Pipelines for the creation of infrastructure and the training and deployment of machine learning models. 
   ![Screenshot of ADO view all Pipelines](./media/how-to-setup-mlops-azureml/ado-view-allPipelines.png)
   
7. Under **Pipelines**, select Environments and ensure both "Prod" and "Dev" environments are created. Create the "Dev" environment manually, if necessary.

> [!NOTE]
> This finishes the prerequisite section and the deployment of the solution accelerator can happen accordingly.


## Deploying infrastructure via Azure DevOps
This step deploys the training pipeline to the Azure Machine Learning workspace created in the previous steps. 

### Run Azure infrastructure pipeline
1. Go to the repo you cloned in from the previous section `mlopsv2demo`, select the **config-infra-dev.yml** file.
   
   ![Screenshot of Repo in ADO](./media/how-to-setup-mlops-azureml/ADO-repo.png)
   
   This config file uses the namespace and postfix values the names of the artifacts to ensure uniqueness. Update the following section in the config to your liking.
   
   ```
    namespace: [5 max random new letters]
    postfix: [4 max random new digits]
    location: eastus
   ```
   > [!NOTE]
   > If your are running a Deep Learning workload such as CV or NLP, you have to ensure your GPU compute is available in your deployment zone.

1. Click Commit and push code to get these values into the pipeline. 

1. Please repeat this step for **config-infra-prod.yml** file.

1. Go to Pipelines section 
   
   ![Screenshot of ADO Pipelines](./media/how-to-setup-mlops-azureml/ADO-pipelines.png)
   
1. Select **New Pipeline**.
   
   ![Screenshot of ADO New Pipeline button](./media/how-to-setup-mlops-azureml/ADO-run1.png)
   
1. Select **Azure Repos Git**.
   
   ![Screenshot of ADO Where's your code](./media/how-to-setup-mlops-azureml/ado-wheresyourcode.png)
   
1. Select your repository your create and populated in the sparse checkout in the previous step. 
   
   ![Screenshot of ADO Pipeline page on select step](./media/how-to-setup-mlops-azureml/ADO-run2.png)
   
1. Select **Existing Azure Pipeline YAML File**
   
   ![Screenshot of ADO Pipeline page on configure step](./media/how-to-setup-mlops-azureml/ADO-run3.png)
   
   
1. Select `main` as a branch and choose based on your deployment method your preferred yml path. 
    - For a terraform scenario choose: `infrastructure/pipelines/tf-ado-deploy-infra.yml`, then select **Continue**. 
    - For a bicep scenario choose: `infrastructure/pipelines/bicep-ado-deploy-infra.yml`, then select **Continue**.
   
   ![Screenshot of Select Infrastructure Pipeline](./media/how-to-setup-mlops-azureml/ado-select-pipeline-yaml-file.png)
   
1. Run the pipeline. This will take a few minutes to finish. The pipeline should create the following artifacts:
   * Resource Group for your Workspace including Storage Account, Container Registry, Application Insights, Keyvault and the Azure Machine Learning Workspace itself.
   * In the workspace there's also a compute cluster created.
   
   ![Screenshot of ADO script for deployment](./media/how-to-setup-mlops-azureml/ADO-run5.png)
   
   Now the Operationalizing Loop of the MLOps Architecture is deployed.
   
   ![Screenshot of ADO deployment page](./media/how-to-setup-mlops-azureml/ADO-run-infra-pipeline.png)

> [!NOTE]
> The **Unable move and reuse existing repository to required location** warnings may be ignored.

## Deploying model training pipeline and moving to test environment

   1. Go to ADO pipelines
   
   ![Screenshot of ADO Pipelines](./media/how-to-setup-mlops-azureml/ADO-pipelines.png)

   2. Select **New Pipeline**.
   
   ![Screenshot of ADO New Pipeline button](./media/how-to-setup-mlops-azureml/ADO-run1.png)
   
   3. Select **Azure Repos Git**.
   
   ![Screenshot of ADO Where's your code](./media/how-to-setup-mlops-azureml/ado-wheresyourcode.png)
   
   4. Select the repository that you cloned in from the previous section `mlopsv2demo`
   
   ![Screenshot of ADO Pipeline page on select step](./media/how-to-setup-mlops-azureml/ADO-run2.png)
   
   5. Select **Existing Azure Pipeline YAML File**
   
   ![Screenshot of ADO Pipeline page on configure step](./media/how-to-setup-mlops-azureml/ADO-run3.png)
   
   6. Select `main` as a branch and choose `/mlops/devops-pipelines/deploy-model-training-pipeline.yml`, then select **Continue**.  

   ![Screenshot of ADO existing YAML script](./media/how-to-setup-mlops-azureml/ADO-run9.png)

   7. Before running the pipeline, the repository location for the mlops-templates will need to be updated. Modify the **resources** section of the pipeline the snippet below. 

   ``` yaml
       resources:
         repositories:
           - repository: mlops-templates  # Template Repo
             type: git          
             name: mlops-templates 
             ref: main
   ```

   8. Save and Run the pipeline
   
> [!NOTE]
> At this point, the infrastructure is configured and the Inner Loop of the MLOps Architecture is deployed. you are ready to move to our trained model to production.      

## Moving to production environment and deploying model 
         

   **Prepare Data**
   - This component takes multiple taxi datasets (yellow and green) and merges/filters the data, and prepare the train/val and evaluation datasets.
   - Input: Local data under ./data/ (multiple .csv files)
   - Output: Single prepared dataset (.csv) and train/val/test datasets.

   **Train Model**
   - This component trains a Linear Regressor with the training set.
   - Input: Training dataset
   - Output: Trained model (pickle format)
   
   **Evaluate Model**
   - This component uses the trained model to predict taxi fares on the test set.
   - Input: ML model and Test dataset
   - Output: Performance of model and a deploy flag whether to deploy or not.
   - This component compares the performance of the model with all previous deployed models on the new test dataset and decides whether to promote or not model into production. Promoting model into production happens by registering the model in AML workspace.

   **Register Model**
   - This component scores the model based on how accurate the predictions are in the test set.
   - Input: Trained model and the deploy flag.
   - Output: Registered model in Azure Machine Learning.

### Deploy ML model endpoint
   1. Go to ADO pipelines
   
   ![Screenshot of ADO Pipelines](./media/how-to-setup-mlops-azureml/ADO-pipelines.png)

   2. Select **New Pipeline**.
   
   ![Screenshot of ADO New Pipeline button](./media/how-to-setup-mlops-azureml/ADO-run1.png)
   
   3. Select **Azure Repos Git**.
   
   ![Screenshot of ADO Where's your code](./media/how-to-setup-mlops-azureml/ado-wheresyourcode.png)
   
   4. Select the repository that you cloned in from the previous section `mlopsv2demo`
   
   ![Screenshot of ADO Pipeline page on select step](./media/how-to-setup-mlops-azureml/ADO-run2.png)
   
   5. Select **Existing Azure Pipeline YAML File**
   
   ![Screenshot of ADO Pipeline page on configure step](./media/how-to-setup-mlops-azureml/ADO-run3.png)
   
   6. Select `main` as a branch and choose:
        
        For Classical Machine Learning:
         - Managed Batch Endpoint `/mlops/devops-pipelines/deploy-batch-endpoint-pipeline.yml`
         - Managed Online Endpoint `/mlops/devops-pipelines/deploy-online-endpoint-pipeline.yml`
      
        For Computer Vision: 
         - Managed Online Endpoint `/mlops/devops-pipelines/deploy-batch-endpoint-pipeline.yml`
      
      Then select **Continue**.  
   
   ![Screenshot of ADO Pipeline existing YAML step](./media/how-to-setup-mlops-azureml/ADO-run10.png)
   
   7. Before running the pipeline, the repository location for the mlops-templates will need to be updated. Modify the **resources** section of the pipeline the snippet below. 

   ``` yaml
       resources:
         repositories:
           - repository: mlops-templates  # Template Repo
             type: git          
             name: mlops-templates 
             ref: main
   ```
   
   9. Batch/Online endpoint names need to be unique, so please change **[your endpoint-name]** to another unique name and then select **Run**.

   ![Screenshot of ADO batch deploy script](./media/how-to-setup-mlops-azureml/ADO-batch-pipeline.png)
   
   > [!IMPORTANT]
   > If the run fails due to an existing online endpoint name, recreate the pipeline as described above and change **[your endpoint-name]** to **[your endpoint-name (random number)]**
   
   10. When the run completes, you will see:
   
   ![Screenshot of ADO Pipeline batch run result page](./media/how-to-setup-mlops-azureml/ADO-batch-pipeline-run.png)
   
   Now the Prototyping Loop is connected to the Operationalizing Loop of the MLOps Architecture and inference has been run.

## Clean up resources

1. If you're not going to continue to use your pipeline, delete your Azure DevOps project. 
1. In Azure portal, delete your resource group and Azure Machine Learning instance.

## Next steps

* [Install and set up Python SDK v2](https://aka.ms/sdk-v2-install)
* [Install and set up Python CLI v2](how-to-configure-cli.md)
* [Azure MLOps (v2) solution accelerator](https://github.com/Azure/mlops-v2) on GitHub
* Learn more about [Azure Pipelines with Azure Machine Learning](how-to-devops-machine-learning.md)
* Learn more about [GitHub Actions with Azure Machine Learning](how-to-github-actions-machine-learning.md)
* Deploy MLOps on Azure in Less Than an Hour - [Community MLOps V2 Accelerator video](https://www.youtube.com/watch?v=5yPDkWCMmtk)
