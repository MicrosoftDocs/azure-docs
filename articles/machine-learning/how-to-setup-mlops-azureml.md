---
title: Setup MLOps with AzureML and Azure DevOps
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

# Setup MLOps with AzureML and Azure DevOps

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

Azure Machine Learning allows you to integration with [Azure DevOps pipeline](/azure/devops/pipelines/) to automate the machine learning lifecycle. Some of the operations you can automate are:

* Deployment of AzureML infrastructure
* Data preparation (extract, transform, load operations)
* Training machine learning models with on-demand scale-out and scale-up
* Deployment of machine learning models as public or private web services
* Monitoring deployed machine learning models (such as for performance or data-drift analysis)

In this article, you learn about using Azure Machine Learning to setup an end-to-end MLOps pipeline which runs a linear regression to predict taxi fares in NYC. The pipeline is made up of components, each serving  different functions, which can be registered with the workspace, versioned, and reused with various inputs and outputs. We are going to be using the [Azure MLOps (v2) solution accelerator](https://github.com/Azure/mlops-v2) to quickly set up an MLOps project in AzureML.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
- An Azure Machine Learning workspace.
- The Azure Machine Learning [SDK v2 for Python](https://aka.ms/sdk-v2-install).
- The Azure Machine Learning [CLI v2](how-to-configure-cli.md).
- An [organization](/azure/devops/organizations/accounts/create-organization) in Azure DevOps.
- [Azure DevOps project](how-to-devops-machine-learning.md) that will host the source repositories and pipelines.
- The [Terraform extension for Azure DevOps](https://marketplace.visualstudio.com/items?itemName=ms-devlabs.custom-terraform-tasks) if you are using Azure DevOps + Terraform to spin up infrastructure
- Git bash, WSL or another shell script editor on your local machine.

> [!NOTE]
>
>**Git version 2.27 or newer is required. See [these instructions](https://github.com/cli/cli/blob/trunk/docs/install_linux.md#debian-ubuntu-linux-raspberry-pi-os-apt) to upgrade.**

## Setup Authentication with Azure and DevOps

Before we can setup an MLOps project with AzureML we need to make sure we have the correct authentication setup for Azure DevOps.

### Create Service Principal
   For the use of the demo, the creation of one or two service principles is required, depending on how many environments, you want to work on (Dev or Prod or Both). These principles can be created using one of the methods below:

# [Create from Azure Cloud Shell](#tab/azure-shell)

1. Launch the [Azure Cloud Shell](https://shell.azure.com). (If this the first time you have launched the cloud shell, you will be required to creata storage account for the cloud shell.)

2. If prompted, choose **Bash** as the environment used in the Cloud Shell. You can also change environments in the drop-down on the top navigation bar

![PS_CLI_1](./media/how-to-setup-mlops-azureml/PS_CLI1_1.png)

3. Copy the bash commands below to your computer and update the **projectName**, **subscriptionId**, and **environment** variables with the values for your project. If you are creating both a Dev and Prod environment you will need to run this script once for each environment, creating a service principal for each. This command will also grant the **Contributor** role to the service principal in the subscription provided. This is required for Azure DevOps to properly use resources in that subscription. 

``` bash
projectName="<your project name>"
roleName="Contributor"
subscriptionId="<subscription Id>"
environment="<Dev|Prod>" #First letter should be capitalized
servicePrincipalName="Azure-ARM-${environment}-${projectName}"
# Verify the ID of the active subscription
echo "Using subscription ID $subscriptionID"
echo "Creating SP for RBAC with name $servicePrincipalName, with role $roleName and in scopes /subscriptions/$subscriptionId"
az ad sp create-for-rbac --name $servicePrincipalName --role $roleName --scopes /subscriptions/$subscriptionId
echo "Please ensure that the information created here is properly save for future use."
```

4. Copy your edited commands into the Azure Shell and run them (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>v</kbd>).

![PS_CLI_1_4](./media/how-to-setup-mlops-azureml/PS_CLI1_4.png) 


5. After running these commands you will be presented with information related to the service principal. Save this information to a safe location, it will be uselater in the demo to configure Azure DevOps.

```
{
   "appId": "<application id>",
   "displayName": "Azure-ARM-dev-Sample_Project_Name",
   "password": "<password>",
   "tenant": "<tenant id>"
}
```

6. Repeat **Step 3.** if you are creating service principals for Dev and Prod environments.

7. Close the Cloud Shell once the service principals are created. 
      

# [Create from Azure Portal](#tab/azure-portal)

1. Navigate to [Azure App Registrations](https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade/quickStartType~/null/sourceTypeMicrosoft_AAD_IAM)

2. Select **New Registration**.

![PS2](./media/how-to-setup-mlops-azureml/SP-setup2.png)

3. Go through the process of creating a Service Principle (SP) selecting **Accounts in any organizational directory (Any Azure AD directory - Multitenant)** and name it  **Azure-ARM-Dev-ProjectName**. Once created, repeat and create a new SP named **Azure-ARM-Prod-ProjectName**. Please replace **ProjectName** with the name of your project so that the service principal can be uniquely identified. 

4. Go to **Certificates & Secrets** and add for each SP **New client secret**, then store the value and secret separately.

5. To assign the necessary permissions to these principals, select your respective [subscription](https://portal.azure.com/#view/Microsoft_Azure_BillingSubscriptionsBlade?) and go to IAM. Select **+Add** then select **Add Role Assignment**.

![PS3](./media/how-to-setup-mlops-azureml/SP-setup3.png)

6. Select Contributor and add members selecting + Select Members. Add the member **Azure-ARM-Dev-ProjectName** as create before.

![SP4](./media/how-to-setup-mlops-azureml/SP-setup4.png)

7. Repeat step here, if you deploy Dev and Prod into the same subscription, otherwise change to the prod subscription and repeat with **Azure-ARM-Prod-ProjectName**. The basic SP setup is successfully finished.

---

### Set up Azure DevOps

1. Navigate to [Azure DevOps](https://go.microsoft.com/fwlink/?LinkId=2014676&githubsi=true&clcid=0x409&WebUserId=2ecdcbf9a1ae497d934540f4edce2b7d). 
   
2. Create a new project.
   
![ADO Project](./media/how-to-setup-mlops-azureml/ado-create-project.png)
   
3. In the project under **Project Settings** (at the bottom left of the project page) select **Service Connections**.
   
![ADO1](./media/how-to-setup-mlops-azureml/ADO-setup1.png)
   
4. Select **New Service Connection**.

![ADO2](./media/how-to-setup-mlops-azureml/ADO-setup2.png)

5. Select **Azure Resource Manager**, select **Next**, select **Service principal (manual)**, select **Next**, select your subscription where your Service Principal is stored and name the service connection **Azure-ARM-Dev**. Fill in the details of the Dev service principal created in **Step 1.** Select **Grant access permission to all pipelines**, then select **Save**. Repeat this step to create another service connection **Azure-ARM-Prod** using the details of the Prod service principal created in **Step 1.**

> [!IMPORTANT]
> Using the `appId` from **Step 1.** as the Service Principal ID, the `password` from **Step 1.** as the Service Principal Key and the `tenant` from **Step 1.** as the Tenant ID.
![ADO3](./media/how-to-setup-mlops-azureml/ado-service-principal-manual.png)

The Azure DevOps setup is successfully finished.

### Set up source repository with Azure DevOps
   
1. Open the project you created in [Azure DevOps](https://dev.azure.com/)
   
2. Open the Repos section. Click on  the default repo name at the top of the screen and select **Import Repository**

![ADO import repo](./media/how-to-setup-mlops-azureml/ado-import-repo.png)

3. Enter https://github.com/Azure/mlops-templates into the Clone URL field. Click import at the bottom of the page

![ADO import MLops](./media/how-to-setup-mlops-azureml/ado-import-mlops-templates.png)

4. Open the Repos section again and import the following repositories: 
   - https://github.com/Azure/mlops-project-template
   - https://github.com/Azure/mlops-v2 

> [!TIP]
> Learn more about the MLOps v2 accelerator structure and understand why you need to clone all three repositories [here](https://github.com/sdonohoo/mlops-v2/blob/sdonohoo/docs/documentation/structure/README.md#repositories)

5. Open the Repos section. Click on the default repo name at the top of the screen and select **New Repository**

   ![Add demo project](./media/how-to-setup-mlops-azureml/ado-add-demoproject.png)

6.  Enter a name for the repository. This will be used to store the files for the project type you choose. Click **Create**

   ![Create demo project](./media/how-to-setup-mlops-azureml/ado-create-demoprojectrepo.png)

7. Open the **Project settings** at the bottom of the left hand navigation pane

![Open project settings](./media/how-to-setup-mlops-azureml/ado-open-projectSettings.png)

8.  Under the Repos section, click **Repositories**. Select the repository you created in **Step 6.** Select the **Security** tab

9. Under the User permissions section, select the **<projectname> Build Service** user. Change the permission **Contribute** permission to **Allow** and the **Create branch** permission to **Allow**.
   ![ADO permissions](./media/how-to-setup-mlops-azureml/ado-permissions-repo.png)

10. Open the **Pipelines section** in the left hand navigation pane and click on the 3 vertical dots next to the **Create Pipelines** button. Select **Manage Security**

   ![Pipeline security](./media/how-to-setup-mlops-azureml/ado-open-pipelinesSecurity.png)

11. Select the **<projectname> Build Service** account for your project under the Users section. Change the permission **Edit build pipeline** to **Allow**

   ![Add security](./media/how-to-setup-mlops-azureml/ado-add-pipelinesSecurity.png)

### Sparse Checkout of MLOps v2 repo


> [!TIP]
> Make sure you understand the [Architectural Patterns](https://github.com/Azure/mlops-v2#-pattern-architectures-key-concepts) of the solution accelerator before you checkout the MLOps v2 repo and deploy the infrastructure. In examples we will use the [classical ML project type](https://github.com/Azure/mlops-v2/blob/main/documentation/architecturepattern/AzureML_CML_Architecture.png).

1. Open the Pipelines section and create a new pipeline

   ![Sparse checkout](./media/how-to-setup-mlops-azureml/ado-pipeline-sparsecheckout.png)

2. 
   - Select Azure Repos Git
   - Select the mlops-v2 repository
   - Select existing Azure Pipelines YAML file
   - Ensure the selected branch is **main**
   - Select the `/.azuredevops/initialise-project.yml` file in the patch drop-down
   - Click Continue 

On the pipeline review page chose to **Save** the pipeline before running it. 

   ![Save pipeline](./media/how-to-setup-mlops-azureml/ado-save-sparepipeline.png)

3. Click **Run Pipeline**

   ![Run pipeline](./media/how-to-setup-mlops-azureml/ado-run-sparepipeline.png)

Make sure you select the **main** branch and then you will need to complete the required parameters to configure your project

![Parameters for pipeline](./media/how-to-setup-mlops-azureml/ado-parameters-sparepipeline.png)

   - **ADO project name** : This is the name of the Azure DevOps project you created
   - **Project repo name**: This is the name of the mlops-v2 accelerator project you imported from GitHub (Default is **mlops-v2** unless you changed it during import)
   - **MLOps Project Template name**: Name of the shared templates you imported previously (Default is **mlops-project-template**)
   - ML Project type: 
     - Choose **classical** for a regression or classification project.
     - Choose **cv** for a computer vision project
     - Choose **nlp** for natural language  projects
   - MLOps version
     - choose **python-sdk** to use the python SDK for training and deployment of your model
     - Choose **aml-cli-v2** to yse the cli tools for training and deployment of your model
   - Infrastructure Version: 
     - Choose **Bicep** to deploy using Azure ARM based templates
     - Choose **terrform** to use terraform based templates. 

4. The first run of the pipeline will require you to grant access to the repositories you created. Click **View** 

   ![ADO_Pipeline_permissions](./media/how-to-setup-mlops-azureml/ado-pipeline-permissions.png)

5.  Click **Permit** for all repositories waiting for review

   ![ADO_Pipeline_permissionsReview](./media/how-to-setup-mlops-azureml/ado-pipeline-permissionsPermit.png)

6. The pipeline will run the following actions:
   - Your project repository will be populated with the files needed to create the Azure Machine Learning project and resources. 
   ![ADO_view_repoSparseCheckout](./media/how-to-setup-mlops-azureml/ado-view-repoSparseCheckout.png)
   - Pipelines for the creation of infrastructure and the training and deployment of machine learning models. 
   ![ADO_view_allPipelines](./media/how-to-setup-mlops-azureml/ado-view-allPipelines.png)

> [!NOTE]
> This finishes the prerequisite section and the deployment of the solution accelerator can happen accordingly.


## Deploying Infrastructure via Azure DevOps
This step deploys the training pipeline to the Azure Machine Learning workspace created in the previous steps. 

### Run Azure Infrastructure pipeline
1. Go to Pipelines section 
   
   ![ADO Pipelines](./media/how-to-setup-mlops-azureml/ADO-pipelines.png)
   
2. Select **New Pipeline**.
   
   ![ADO Run1](./media/how-to-setup-mlops-azureml/ADO-run1.png)
   
3. Select **Azure Repos Git**.
   
   ![ADO Where's your code](./media/how-to-setup-mlops-azureml/ado-wheresyourcode.png)
   
4. Select your repository your create and populated in the sparse checkout in the previous step. 
   
   ![ADO Run2](./media/how-to-setup-mlops-azureml/ADO-run2.png)
   
5. Select **Existing Azure Pipeline YAML File**
   
   ![ADO Run3](./media/how-to-setup-mlops-azureml/ADO-run3.png)
   
   
6. Select `main` as a branch and choose based on your deployment method your preferred yml path. 
    - For a terraform scenario choose: `infrastructure/pipelines/tf-ado-deploy-infra.yml`, then select **Continue**. 
    - For a bicep scenario choose: `infrastructure/pipelines/bicep-ado-deploy-infra.yml`, then select **Continue**.
   
   ![Select Infrastructure Pipeline](./media/how-to-setup-mlops-azureml/ado-select-pipeline-yaml-file.png)
   
7. Run the pipeline. This will take a few minutes to finish. The pipeline should create the following artifacts:
   * Resource Group for your Workspace including Storage Account, Container Registry, Application Insights, Keyvault and the Azure Machine Learning Workspace itself.
   * In the workspace there's also a compute cluster created.
   
   ![ADO Run5](./media/how-to-setup-mlops-azureml/ADO-run5.png)
   
   Now the Outer Loop of the MLOps Architecture is deployed.
   
   ![ADO Run6](./media/how-to-setup-mlops-azureml/ADO-run-infra-pipeline.png)

> [!NOTE]
> The **Unable move and reuse existing repository to required location** warnings may be ignored.

## Deploying Model Training Pipeline and Moving to Test Environment

   1. Go to ADO pipelines
   
   ![ADO Pipelines](./media/how-to-setup-mlops-azureml/ADO-pipelines.png)

   2. Select **New Pipeline**.
   
   ![ADO Run1](./media/how-to-setup-mlops-azureml/ADO-run1.png)
   
   3. Select **Github**.
   
   ![ADO Where's your code](./media/how-to-setup-mlops-azureml/ado-wheresyourcode.png)
   
   4. Select your /MLOps-Test repository
   
   ![ADO Run2](./media/how-to-setup-mlops-azureml/ADO-run2.png)
   
   5. Select **Existing Azure Pipeline YAML File**
   
   ![ADO Run3](./media/how-to-setup-mlops-azureml/ADO-run3.png)
   
   6. Select `main` as a branch and choose `/mlops/devops-pipelines/deploy-model-training-pipeline.yml`, then select **Continue**.  

   ![ADO Run9](./media/how-to-setup-mlops-azureml/ADO-run9.png)


> [!NOTE]
> At this point, the infrastructure is configured and the Inner Loop of the MLOps Architecture is deployed. We are ready to move to our trained model to production.      

## Moving to Production Environment and Deploying Model 
         

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
   
   ![ADO Pipelines](./media/how-to-setup-mlops-azureml/ADO-pipelines.png)

   2. Select **New Pipeline**.
   
   ![ADO Run1](./media/how-to-setup-mlops-azureml/ADO-run1.png)
   
   3. Select **Github**.
   
   ![ADO Where's your code](./media/how-to-setup-mlops-azureml/ado-wheresyourcode.png)
   
   4. Select your /MLOps-Test repository! (**Empty** repository you created in the "Set up source repository with Azure DevOps" section)
   
   ![ADO Run2](./media/how-to-setup-mlops-azureml/ADO-run2.png)
   
   5. Select **Existing Azure Pipeline YAML File**
   
   ![ADO Run3](./media/how-to-setup-mlops-azureml/ADO-run3.png)
   
   6. Select `main` as a branch and choose:
        
        For Classical Machine Learning:
         - Managed Batch Endpoint `/mlops/devops-pipelines/deploy-batch-endpoint-pipeline.yml`
         - Managed Online Endpoint `/mlops/devops-pipelines/deploy-online-endpoint-pipeline.yml`
      
        For Computer Vision: 
         - Managed Online Endpoint `/mlops/devops-pipelines/deploy-batch-endpoint-pipeline.yml`
      
      Then select **Continue**.  
   
   ![ADO Run10](./media/how-to-setup-mlops-azureml/ADO-run10.png)
   
   7. Batch/Online endpoint names need to be unique, so please change [your endpointname] to another unique name and then select **Run**.

   ![ADO Run11](./media/how-to-setup-mlops-azureml/ADO-batch-pipeline.png)
   
> [!IMPORTANT]
> If the run fails due to an existing online endpoint name, recreate the pipeline as described above and change [your endpoint-name] to [your endpoint-name (random number)]
   
   8. When the run completes, you will see:
   
   ![ADO Run12](./media/how-to-setup-mlops-azureml/ADO-batch-pipeline-run.png)
   
  Now the Inner Loop is connected to the Outer of the MLOps Architecture and inference has been run.

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
