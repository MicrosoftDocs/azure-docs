---
title: Configure Azure DevOps Services for SAP on Azure Deployment Automation Framework
description: Configure your Azure DevOps Services for the SAP on Azure Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/19/2022
ms.topic: conceptual
ms.service: azure-center-sap-solutions
---

# Use SAP on Azure Deployment Automation Framework from Azure DevOps Services

Using Azure DevOps will streamline the deployment process by providing pipelines that can be executed to perform both the infrastructure deployment and the configuration and SAP installation activities.
You can use Azure Repos to store your configuration files and Azure Pipelines to deploy and configure the infrastructure and the SAP application.

## Sign up for Azure DevOps Services

To use Azure DevOps Services, you'll need an Azure DevOps organization. An organization is used to connect groups of related projects. Use your work or school account to automatically connect your organization to your Azure Active Directory (Azure AD). To create an account, open [Azure DevOps](https://azure.microsoft.com/services/devops/) and either _sign-in_ or create a new account.

## Configure Azure DevOps Services for the SAP on Azure Deployment Automation Framework

You can use the following script to do a basic installation of Azure Devops Services for the SAP on Azure Deployment Automation Framework.

Log in to Azure Cloud Shell
```bash
   export ADO_ORGANIZATION=https://dev.azure.com/<yourorganization>
   export ADO_PROJECT='SAP Deployment Automation'
   wget https://raw.githubusercontent.com/Azure/sap-automation/main/deploy/scripts/create_devops_artifacts.sh -O devops.sh
   chmod +x ./devops.sh
   ./devops.sh
   rm ./devops.sh

```

Validate that the project has been created by navigating to the Azure DevOps portal and selecting the project. Ensure that the Repo is populated and that the pipelines have been created.

You can finalize the Azure DevOps configuration by running the following scripts on your local workstation. Open a PowerShell Console and define the environment variables. Replace the bracketed values with the actual values.

> [!IMPORTANT]
> Run the following steps on your local workstation, also make sure that you have logged on to Azure using az login first. Please also ensure that you have the latest Azure CLI installed by running the 'az upgrade' command.


```powershell
   $Env:ADO_ORGANIZATION="https://dev.azure.com/<yourorganization>"

   $Env:ADO_PROJECT="SAP Deployment Automation"

   $Env:ControlPlaneSubscriptionID="<YourControlPlaneSubscriptionID>"
   $Env:ControlPlaneSubscriptionName="<YourControlPlaneSubscriptionName>"

   $Env:DevSubscriptionID="<YourDevSubscriptionID>"
   $Env:DevSubscriptionName="<YourDevSubscriptionName>"

```
> [!NOTE]
> The ControlPlaneSubscriptionID and DevSubscriptionID can use the same subscriptionID. 
> 
> You can use the environment variable $Env:SDAF_APP_NAME for an existing Application registration, $Env:SDAF_MGMT_SPN_NAME for an existing service principal for the control plane and $Env:SDAF_DEV_SPN_NAME for an existing service principal for the workload zone plane. For the names use the Display Name of the existing resources.



Once the variables are defined run the following script to create the service principals and the application registration.

```powershell

Invoke-WebRequest -Uri https://raw.githubusercontent.com/Azure/sap-automation/main/deploy/scripts/update_devops_credentials.ps1 -OutFile .\configureDevOps.ps1 ; .\configureDevOps.ps1

```
> [!NOTE]
> In PowerShell navigate to a folder where you have write permissions before running the Invoke-WebRequest command.

### Create a sample Control Plane configuration

You can run the 'Create Sample Deployer Configuration' pipeline to create a sample configuration for the Control Plane. When running choose the appropriate Azure region.

## Manual configuration of Azure DevOps Services for the SAP on Azure Deployment Automation Framework

### Create a new project

You can use Azure Repos to store both the code from the sap-automation GitHub repository and the environment configuration files.

Open (https://dev.azure.com) and create a new project by clicking on the _New Project_ button and enter the project details. The project will contain both the Azure Repos source control repository and Azure Pipelines for performing deployment activities.

> [!NOTE]
> If you are unable to see _New Project_ ensure that you have permissions to create new projects in the organization.

Record the URL of the project.
### Import the repository

Start by importing the SAP on Azure Deployment Automation Framework GitHub repository into Azure Repos.

Navigate to the Repositories section and choose Import a repository, import the 'https://github.com/Azure/sap-automation.git' repository into Azure DevOps. For more info, see [Import a repository](/azure/devops/repos/git/import-git-repository?view=azure-devops&preserve-view=true)

If you're unable to import a repository, you can create the 'sap-automation' repository, and manually import the content from the SAP on Azure Deployment Automation Framework GitHub repository to it.

### Create the repository for manual import

> [!NOTE]
> Only do this step if you are unable to import the repository directly.

Create the 'sap-automation' repository by navigating to the 'Repositories' section in 'Project Settings' and clicking the _Create_ button.

Choose the repository type 'Git' and provide a name for the repository, for example 'sap-automation'.
### Cloning the repository

In order to provide a more comprehensive editing capability of the content, you can clone the repository to a local folder and edit the contents locally.
Clone the repository to a local folder by clicking the  _Clone_ button in the Files view in the Repos section of the portal. For more info, see [Cloning a repository](/azure/devops/repos/git/clone?view=azure-devops#clone-an-azure-repos-git-repo&preserve-view=true)

:::image type="content" source="./media/devops/automation-repo-clone.png" alt-text="Picture showing how to clone the repository":::

### Manually importing the repository content using a local clone

You can also download the content from the SAP on Azure Deployment Automation Framework repository manually and add it to your local clone of the Azure DevOps repository.

Navigate to 'https://github.com/Azure/SAP-automation' repository and download the repository content as a ZIP file by clicking the _Code_ button and choosing _Download ZIP_.

Copy the content from the zip file to the root folder of your local clone.

Open the local folder in Visual Studio code, you should see that there are changes that need to be synchronized by the indicator by the source control icon as is shown in the picture below.

:::image type="content" source="./media/devops/automation-vscode-changes.png" alt-text="Picture showing that source code has changed":::

Select the source control icon and provide a message about the change, for example: "Import from GitHub" and press Cntr-Enter to commit the changes. Next select the _Sync Changes_ button to synchronize the changes back to the repository.

### Create configuration root folder

> [!IMPORTANT]
   > In order to ensure that your configuration files are not overwritten by changes in the SAP on Azure Deployment Automation Framework, store them in a separate folder hierarchy.


Create a top level folder called 'WORKSPACES', this folder will be the root folder for all the SAP deployment configuration files. Create the following folders in the 'WORKSPACES' folder: 'DEPLOYER', 'LIBRARY', 'LANDSCAPE' and 'SYSTEM'. These will contain the configuration files for the different components of the SAP on Azure Deployment Automation Framework.

Optionally you may copy the sample configuration files from the 'samples/WORKSPACES' folders to the WORKSPACES folder you created, this will allow you to experiment with sample deployments.

Push the changes back to the repository by selecting the source control icon and providing a message about the change, for example: "Import of sample configurations" and press Cntr-Enter to commit the changes. Next select the _Sync Changes_ button to synchronize the changes back to the repository.

## Set up the web app

The automation framework optionally provisions a web app as a part of the control plane to assist with the SAP workload zone and system configuration files. If you would like to use the web app, you must first create an app registration for authentication purposes. Open the Azure Cloud Shell and execute the following commands:

# [Linux](#tab/linux)
Replace MGMT with your environment as necessary.
```bash
echo '[{"resourceAppId":"00000003-0000-0000-c000-000000000000","resourceAccess":[{"id":"e1fe6dd8-ba31-4d61-89e7-88639da4683d","type":"Scope"}]}]' >> manifest.json

TF_VAR_app_registration_app_id=$(az ad app create --display-name MGMT-webapp-registration --enable-id-token-issuance true --sign-in-audience AzureADMyOrg --required-resource-access @manifest.json --query "appId" | tr -d '"')

echo $TF_VAR_app_registration_app_id

az ad app credential reset --id $TF_VAR_app_registration_app_id --append --query "password"

rm manifest.json
```
# [Windows](#tab/windows)
Replace MGMT with your environment as necessary.
```powershell
Add-Content -Path manifest.json -Value '[{"resourceAppId":"00000003-0000-0000-c000-000000000000","resourceAccess":[{"id":"e1fe6dd8-ba31-4d61-89e7-88639da4683d","type":"Scope"}]}]'

$TF_VAR_app_registration_app_id=(az ad app create --display-name MGMT-webapp-registration --enable-id-token-issuance true --sign-in-audience AzureADMyOrg --required-resource-access .\manifest.json --query "appId").Replace('"',"")

echo $TF_VAR_app_registration_app_id

az ad app credential reset --id $TF_VAR_app_registration_app_id --append --query "password"

del manifest.json
```
---

Save the app registration ID and password values for later use.


## Create Azure Pipelines

Azure Pipelines are implemented as YAML files and they're stored in the 'deploy/pipelines' folder in the repository.
## Control plane deployment pipeline

Create the control plane deployment pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipelines YAML File. Specify the pipeline with the following settings:

| Setting | Value                                           |
| ------- | ----------------------------------------------- |
| Branch  | main                                            |
| Path    | `deploy/pipelines/01-deploy-control-plane.yaml` |
| Name    | Control plane deployment                        |

Save the Pipeline, to see the Save option select the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'Control plane deployment' by choosing 'Rename/Move' from the three-dot menu on the right.

## SAP workload zone deployment pipeline

Create the SAP workload zone pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipelines YAML File. Specify the pipeline with the following settings:

| Setting | Value                                        |
| ------- | -------------------------------------------- |
| Branch  | main                                         |
| Path    | `deploy/pipelines/02-sap-workload-zone.yaml` |
| Name    | SAP workload zone deployment                 |

Save the Pipeline, to see the Save option select the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'SAP workload zone deployment' by choosing 'Rename/Move' from the three-dot menu on the right.

## SAP system deployment pipeline

Create the SAP system deployment pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipelines YAML File. Specify the pipeline with the following settings:

| Setting | Value                                            |
| ------- | ------------------------------------------------ |
| Branch  | main                                             |
| Path    | `deploy/pipelines/03-sap-system-deployment.yaml` |
| Name    | SAP system deployment (infrastructure)           |

Save the Pipeline, to see the Save option select the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'SAP system deployment (infrastructure)' by choosing 'Rename/Move' from the three-dot menu on the right.

## SAP software acquisition pipeline

Create the SAP software acquisition pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipelines YAML File. Specify the pipeline with the following settings:

| Setting | Value                                            |
| ------- | ------------------------------------------------ |
| Branch  | main                                             |
| Path    | `deploy/pipelines/04-sap-software-download.yaml` |
| Name    | SAP software acquisition                         |

Save the Pipeline, to see the Save option select the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'SAP software acquisition' by choosing 'Rename/Move' from the three-dot menu on the right.

## SAP configuration and software installation pipeline

Create the SAP configuration and software installation pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipelines YAML File. Specify the pipeline with the following settings:

| Setting | Value                                              |
| ------- | -------------------------------------------------- |
| Branch  | main                                               |
| Path    | `deploy/pipelines/05-DB-and-SAP-installation.yaml` |
| Name    | Configuration and SAP installation                 |

Save the Pipeline, to see the Save option select the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'SAP configuration and software installation' by choosing 'Rename/Move' from the three-dot menu on the right.

## Deployment removal pipeline

Create the deployment removal pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipelines YAML File. Specify the pipeline with the following settings:

| Setting | Value                                        |
| ------- | -------------------------------------------- |
| Branch  | main                                         |
| Path    | `deploy/pipelines/10-remover-terraform.yaml` |
| Name    | Deployment removal                           |

Save the Pipeline, to see the Save option select the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'Deployment removal' by choosing 'Rename/Move' from the three-dot menu on the right.

## Control plane removal pipeline

Create the control plane deployment removal pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipelines YAML File. Specify the pipeline with the following settings:

| Setting | Value                                           |
| ------- | ----------------------------------------------- |
| Branch  | main                                            |
| Path    | `deploy/pipelines/12-remove-control-plane.yaml` |
| Name    | Control plane removal                           |

Save the Pipeline, to see the Save option select the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'Control plane removal' by choosing 'Rename/Move' from the three-dot menu on the right.

## Deployment removal pipeline using Azure Resource Manager

Create the deployment removal ARM pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipelines YAML File. Specify the pipeline with the following settings:

| Setting | Value                                           |
| ------- | ----------------------------------------------- |
| Branch  | main                                            |
| Path    | `deploy/pipelines/11-remover-arm-fallback.yaml` |
| Name    | Deployment removal using ARM                    |

Save the Pipeline, to see the Save option select the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'Deployment removal using ARM processor' by choosing 'Rename/Move' from the three-dot menu on the right.

> [!NOTE]
> Only use this pipeline as last resort, removing just the resource groups will leave remnants that may complicate re-deployments.

## Repository updater pipeline

Create the Repository updater pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipelines YAML File. Specify the pipeline with the following settings:

| Setting | Value                                           |
| ------- | ----------------------------------------------- |
| Branch  | main                                            |
| Path    | `deploy/pipelines/20-update-ado-repository.yaml`|
| Name    | Repository updater                              |

Save the Pipeline, to see the Save option select the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'Repository updater' by choosing 'Rename/Move' from the three-dot menu on the right.

This pipeline should be used when there's an update in the sap-automation repository that you want to use.

## Import Ansible task from Visual Studio Marketplace

The pipelines use a custom task to run Ansible. The custom task can be installed from [Ansible](https://marketplace.visualstudio.com/items?itemName=ms-vscs-rm.vss-services-ansible). Install it to your Azure DevOps organization before running the _Configuration and SAP installation_ or _SAP software acquisition_  pipelines.

## Import Cleanup task from Visual Studio Marketplace

The pipelines use a custom task to perform cleanup activities post deployment. The custom task can be installed from [Post Build Cleanup](https://marketplace.visualstudio.com/items?itemName=mspremier.PostBuildCleanup). Install it to your Azure DevOps organization before running the pipelines.


## Preparations for self-hosted agent


1. Create an Agent Pool by navigating to the Organizational Settings and selecting _Agent Pools_ from the Pipelines section. Click the _Add Pool_ button and choose Self-hosted as the pool type. Name the pool to align with the workload zone environment, for example `DEV-WEEU-POOL`. Ensure _Grant access permission to all pipelines_ is selected and create the pool using the _Create_ button.

1. Sign in with the user account you plan to use in your Azure DevOps organization (https://dev.azure.com).

1. From your home page, open your user settings, and then select _Personal access tokens_.

   :::image type="content" source="./media/devops/automation-select-personal-access-tokens.jpg" alt-text="Diagram showing the creation of the Personal Access Token (PAT).":::

1. Create a personal access token. Ensure that _Read & manage_ is selected for _Agent Pools_, _Read & write_ is selected for _Code_, _Read & execute_ is selected for _Build_, and _Read, create, & manage_ is selected for _Variable Groups_. Write down the created token value.

   :::image type="content" source="./media/devops/automation-new-pat.png" alt-text="Diagram showing the attributes of the Personal Access Token (PAT).":::

## Variable definitions

The deployment pipelines are configured to use a set of predefined parameter values defined using variable groups.


### Common variables

There's a set of common variables that are used by all the deployment pipelines. These variables are stored in a variable group called 'SDAF-General'.

Create a new variable group 'SDAF-General' using the Library page in the Pipelines section. Add the following variables:

| Variable                           | Value                                   | Notes                                                                                       |
| ---------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------- |
| Deployment_Configuration_Path      | WORKSPACES                              | For testing the sample configuration use 'samples/WORKSPACES' instead of WORKSPACES.        |
| Branch                             | main                                    |                                                                                             |
| S-Username                         | `<SAP Support user account name>`       |                                                                                             |
| S-Password                         | `<SAP Support user password>`           | Change variable type to secret by clicking the lock icon.                                   |
| `tf_version`                       | 1.2.8                                   | The Terraform version to use, see [Terraform download](https://www.terraform.io/downloads)  |

Save the variables.

Or alternatively you can use the Azure DevOps CLI to set up the groups.

```bash
s-user="<SAP Support user account name>"
s-password="<SAP Support user password>"

az devops login

az pipelines variable-group create --name SDAF-General --variables ANSIBLE_HOST_KEY_CHECKING=false Deployment_Configuration_Path=WORKSPACES Branch=main S-Username=$s-user S-Password=$s-password tf_varsion=1.2.8 --output yaml

```

> [!NOTE]
> Remember to assign permissions for all pipelines using _Pipeline permissions_.

### Environment specific variables

As each environment may have different deployment credentials you'll need to create a variable group per environment, for example 'SDAF-MGMT','SDAF-DEV', 'SDAF-QA'.

Create a new variable group 'SDAF-MGMT' for the control plane environment using the Library page in the Pipelines section. Add the following variables:

| Variable                        | Value                                                              | Notes                                                    |
| ------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------- |
| Agent                           | 'Azure Pipelines' or the name of the agent pool                    | Note, this pool will be created in a later step.         |
| ARM_CLIENT_ID                   | 'Service principal application ID'.                                |                                                          |
| ARM_CLIENT_SECRET               | 'Service principal password'.                                      | Change variable type to secret by clicking the lock icon |
| ARM_SUBSCRIPTION_ID             | 'Target subscription ID'.                                          |                                                          |
| ARM_TENANT_ID                   | 'Tenant ID' for the service principal.                             |                                                          |
| AZURE_CONNECTION_NAME           | Previously created connection name.                                |                                                          |
| sap_fqdn                        | SAP Fully Qualified Domain Name, for example 'sap.contoso.net'.    | Only needed if Private DNS isn't used.                   |
| FENCING_SPN_ID                  | 'Service principal application ID' for the fencing agent.          | Required for highly available deployments using a service principal for fencing agent.               |
| FENCING_SPN_PWD                 | 'Service principal password' for the fencing agent.                | Required for highly available deployments using a service principal for fencing agent.               |
| FENCING_SPN_TENANT              | 'Service principal tenant ID' for the fencing agent.               | Required for highly available deployments using a service principal for fencing agent.               |
| PAT                             | `<Personal Access Token>`                                          | Use the Personal Token defined in the previous step      |
| POOL                            | `<Agent Pool name>`                                                | The Agent pool to use for this environment               |
|                                 |                                                                    |                                                          |
| APP_REGISTRATION_APP_ID         | 'App registration application ID'                                  | Required if deploying the web app                        |
| WEB_APP_CLIENT_SECRET           | 'App registration password'                                        | Required if deploying the web app                        |
|                                 |                                                                    |                                                          |
| SDAF_GENERAL_GROUP_ID           | The group ID for the SDAF-General group                            | The ID can be retrieved from the URL parameter 'variableGroupId' when accessing the variable group using a browser. For example: 'variableGroupId=8 |
| WORKLOADZONE_PIPELINE_ID        | The ID for the 'SAP workload zone deployment' pipeline             | The ID can be retrieved from the URL parameter 'definitionId' from the pipeline page in Azure DevOps. For example: 'definitionId=31. |
| SYSTEM_PIPELINE_ID              | The ID for the 'SAP system deployment (infrastructure)' pipeline   | The ID can be retrieved from the URL parameter 'definitionId' from the pipeline page in Azure DevOps. For example: 'definitionId=32. |

Save the variables.

> [!NOTE]
> Remember to assign permissions for all pipelines using _Pipeline permissions_.
>
> When using the web app, ensure that the Build Service has at least Contribute permissions.
>
> You can use the clone functionality to create the next environment variable group. APP_REGISTRATION_APP_ID, WEB_APP_CLIENT_SECRET, SDAF_GENERAL_GROUP_ID, WORKLOADZONE_PIPELINE_ID and SYSTEM_PIPELINE_ID are only needed for the SDAF-MGMT group.



## Create a service connection

To remove the Azure resources, you need an Azure Resource Manager service connection. For more information, see [Manage service connections](/azure/devops/pipelines/library/service-endpoints?view=azure-devops&preserve-view=true)

To create the service connection, go to Project settings and navigate to the Service connections setting in the Pipelines section.

:::image type="content" source="./media/devops/automation-create-service-connection.png" alt-text="Picture showing how to create a Service connection":::

Choose _Azure Resource Manager_ as the service connection type and _Service principal (manual)_ as the authentication method. Enter the target subscription, typically the control plane subscription, and provide the service principal details. Validate the credentials using the _Verify_ button. For more information on how to create a service principal, see [Creating a Service Principal](deploy-control-plane.md#prepare-the-deployment-credentials).

Enter a Service connection name, for instance 'Connection to MGMT subscription' and ensure that the _Grant access permission to all pipelines_ checkbox is checked. Select _Verify and save_ to save the service connection.

## Permissions

> [!NOTE]
> Most of the pipelines will add files to the Azure Repos and therefore require pull permissions. Assign "Contribute" permissions to the 'Build Service' using the Security tab of the source code repository in the Repositories section in Project settings.

:::image type="content" source="./media/devops/automation-repo-permissions.png" alt-text="Picture showing repository permissions":::

## Deploy the Control Plane

Newly created pipelines might not be visible in the default view. Select on recent tab and go back to All tab to view the new pipelines.

Select the _Control plane deployment_ pipeline, provide the configuration names for the deployer and the SAP library and choose "Run" to deploy the control plane. Make sure to check ""Deploy the configuration web application" if you would like to set up the configuration web app.


### Configure the Azure DevOps Services self-hosted agent manually

> [!NOTE]
>This is only needed if the Azure DevOps Services agent is not automatically configured. Please check that the agent pool is empty before proceeding.


Connect to the deployer by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to the resource group containing the deployer virtual machine.

1. Connect to the virtual machine using Azure Bastion.

1. The default username is *azureadm*

1. Choose *SSH Private Key from Azure Key Vault*

1. Select the subscription containing the control plane.

1. Select the deployer key vault.

1. From the list of secrets choose the secret ending with *-sshkey*.

1. Connect to the virtual machine.

Run the following script to configure the deployer.

```bash
mkdir -p ~/Azure_SAP_Automated_Deployment

cd ~/Azure_SAP_Automated_Deployment

git clone https://github.com/Azure/sap-automation.git

cd sap-automation/deploy/scripts

./configure_deployer.sh
```

Reboot the deployer and reconnect and run the following script to set up the Azure DevOps agent.

```bash
cd ~/Azure_SAP_Automated_Deployment/

$DEPLOYMENT_REPO_PATH/deploy/scripts/setup_ado.sh
```

Accept the license and when prompted for server URL, enter the URL you captured when you created the Azure DevOps Project. For authentication, choose PAT and enter the token value from the previous step.

When prompted enter the application pool name, you created in the previous step. Accept the default agent name and the default work folder name.
The agent will now be configured and started.


## Deploy the Control Plane Web Application

Checking the "deploy the web app infrastructure" parameter when running the Control plane deployment pipeline will provision the infrastructure necessary for hosting the web app. The "Deploy web app" pipeline will publish the application's software to that infrastructure.

Wait for the deployment to finish. Once the deployment is complete, navigate to the Extensions tab and follow the instructions to finalize the configuration and update the 'reply-url' values for the app registration.

As a result of running the control plane pipeline, part of the web app URL needed will be stored in a variable named "WEBAPP_URL_BASE" in your environment-specific variable group. You can at any time update the URLs of the registered application web app using the following command.

# [Linux](#tab/linux)

```bash
webapp_url_base=<WEBAPP_URL_BASE>
az ad app update --id $TF_VAR_app_registration_app_id --web-home-page-url https://${webapp_url_base}.azurewebsites.net --web-redirect-uris https://${webapp_url_base}.azurewebsites.net/ https://${webapp_url_base}.azurewebsites.net/.auth/login/aad/callback
```
# [Windows](#tab/windows)

```powershell
$webapp_url_base="<WEBAPP_URL_BASE>"
az ad app update --id $TF_VAR_app_registration_app_id --web-home-page-url https://${webapp_url_base}.azurewebsites.net --web-redirect-uris https://${webapp_url_base}.azurewebsites.net/ https://${webapp_url_base}.azurewebsites.net/.auth/login/aad/callback
```
---
You will also need to grant reader permissions to the app service system-assigned managed identity. Navigate to the app service resource. On the left hand side, click "Identity". In the "system assigned" tab, click on "Azure role assignments" > "Add role assignment". Select "subscription" as the scope, and "reader" as the role. Then click save. Without this step, the web app dropdown functionality won't work.

You should now be able to visit the web app, and use it to deploy SAP workload zones and SAP system infrastructure.

## Next step

> [!div class="nextstepaction"]
> [DevOps hands on lab](devops-tutorial.md)
