---
title: Configure Azure DevOps Services for SAP Deployment Automation Framework
description: Configure your Azure DevOps Services for the SAP Deployment Automation Framework on Azure.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 12/16/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Use SAP Deployment Automation Framework from Azure DevOps Services

You can use Azure Repos to store your configuration files and Azure Pipelines to deploy and configure the infrastructure and the SAP application. 

## Sign up for Azure DevOps Services

To use Azure DevOps Services, you'll need an Azure DevOps organization. An organization is used to connect groups of related projects. Use your work or school account to automatically connect your organization to your Azure Active Directory (Azure AD). To create an account, open [Azure DevOps](https://azure.microsoft.com/services/devops/) and either _sign-in_ or create a new account. Record the URL of the project.

## Create a new project

You can use Azure Repos to store both the code from the sap-automation GitHub repository and the environment configuration files.

Open (https://dev.azure.com) and create a new project by clicking on the _New Project_ button and enter the project details. The project will contain both the Azure Repos source control repository and Azure Pipelines for performing deployment activities.

> [!NOTE]
> If you are unable to see _New Project_ ensure that you have permissions to create new projects in the organization.

### Import the repository

Start by importing the SAP Deployment Automation Framework GitHub repository into Azure Repos. Navigate to the Repositories section and choose Import a repository. Import the 'https://github.com/Azure/sap-automation.git' repository into Azure DevOps. For more info, see [Import a repository](/azure/devops/repos/git/import-git-repository?view=azure-devops&preserve-view=true)

Some of the pipelines will add files to the Azure Repos and therefore require pull permissions. Assign "Contribute" permissions to the 'Build Service' using the Security tab of the source code repository in the Repositories section in Project settings. 

:::image type="content" source="./media/automation-devops/automation-repo-permissions.png" alt-text="Picture showing repository permissions":::

### Create configuration root folder

Go to the new repository and create a top level folder called 'WORKSPACES', this folder will be the root folder for all the SAP deployment configuration files. In the dialog, enter 'WORKSPACES' as folder name and 'readme.md' as file name. 

Optionally enter some content in the file and save it by clicking the _commit_ button.

> [!NOTE]
> In order to create the folder using Git you must also create a file. 

## Set up the Azure Pipelines

To remove the Azure resources, you need an Azure Resource Manager service connection.

To create the service connection, go to Project settings and navigate to the Service connections setting in the Pipelines section.

:::image type="content" source="./media/automation-devops/automation-create-service-connection.png" alt-text="Picture showing how to create a Service connection":::

Choose _Azure Resource Manager_ as the service connection type and _Service principal (manual)_ as the authentication method. Enter the target subscription, typically the control plane subscription, and provide the service principal details (verify that they're valid using the _Verify_ button). For more information on how to create a service principal, see [Creating a Service Principal](automation-deploy-control-plane.md#prepare-the-deployment-credentials).

Enter a Service connection name, for instance 'Connection to DEV subscription' and ensure that the _Grant access permission to all pipelines_ checkbox is checked. Select _Verify and save_ to save the service connection.

## Create Azure Pipelines

Azure Pipelines are implemented as YAML files and they're stored in the 'deploy/pipelines' folder in the GitHub repo. 
## Control plane deployment pipeline

Create the control plane deployment pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipeline YAML File. Specify the pipeline with the following settings:

| Setting | Value                                           |
| ------- | ----------------------------------------------- |
| Branch  | main                                            |
| Path    | `deploy/pipelines/01-deploy-control-plane.yaml` |
| Name    | Control plane deployment                        |

Save the Pipeline, to see the Save option select the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'Control plane deployment' by choosing 'Rename/Move' from the three-dot menu on the right.

## SAP workload zone deployment pipeline

Create the SAP workload zone pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipeline YAML File. Specify the pipeline with the following settings:

| Setting | Value                                        |
| ------- | -------------------------------------------- |
| Branch  | main                                         |
| Path    | `deploy/pipelines/02-sap-workload-zone.yaml` |
| Name    | SAP workload zone deployment                 |

Save the Pipeline, to see the Save option select the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'SAP workload zone deployment' by choosing 'Rename/Move' from the three-dot menu on the right.

## SAP system deployment pipeline

Create the SAP system deployment pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipeline YAML File. Specify the pipeline with the following settings:

| Setting | Value                                            |
| ------- | ------------------------------------------------ |
| Branch  | main                                             |
| Path    | `deploy/pipelines/03-sap-system-deployment.yaml` |
| Name    | SAP system deployment (infrastructure)           |

Save the Pipeline, to see the Save option select the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'SAP system deployment (infrastructure)' by choosing 'Rename/Move' from the three-dot menu on the right.

## SAP software acquisition pipeline

Create the SAP software acquisition pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipeline YAML File. Specify the pipeline with the following settings:

| Setting | Value                                            |
| ------- | ------------------------------------------------ |
| Branch  | main                                             |
| Path    | `deploy/pipelines/04-sap-software-download.yaml` |
| Name    | SAP software acquisition                         |

Save the Pipeline, to see the Save option select the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'SAP software acquisition' by choosing 'Rename/Move' from the three-dot menu on the right.

## SAP configuration and software installation pipeline

Create the SAP configuration and software installation pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipeline YAML File. Specify the pipeline with the following settings:

| Setting | Value                                              |
| ------- | -------------------------------------------------- |
| Branch  | main                                               |
| Path    | `deploy/pipelines/05-DB-and-SAP-installation.yaml` |
| Name    | Configuration and SAP installation                 |

Save the Pipeline, to see the Save option select the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'SAP configuration and software installation' by choosing 'Rename/Move' from the three-dot menu on the right.

## Deployment removal pipeline

Create the deployment removal pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipeline YAML File. Specify the pipeline with the following settings:

| Setting | Value                                        |
| ------- | -------------------------------------------- |
| Branch  | main                                         |
| Path    | `deploy/pipelines/10-remover-terraform.yaml` |
| Name    | Deployment removal                           |

Save the Pipeline, to see the Save option select the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'Deployment removal' by choosing 'Rename/Move' from the three-dot menu on the right.

## Deployment removal pipeline using Azure Resource Manager

Create the deployment removal ARM pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipeline YAML File. Specify the pipeline with the following settings:

| Setting | Value                                           |
| ------- | ----------------------------------------------- |
| Branch  | main                                            |
| Path    | `deploy/pipelines/11-remover-arm-fallback.yaml` |
| Name    | Deployment removal using ARM                    |

Save the Pipeline, to see the Save option select the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'Deployment removal using ARM' by choosing 'Rename/Move' from the three-dot menu on the right.

> [!NOTE]
> Only use this pipeline as last resort, removing just the resource groups will leave remnants that may complicate re-deployments.

## Repository updater pipeline

Create the Repository updater pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipeline YAML File. Specify the pipeline with the following settings:

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

## Variable definitions

The deployment pipelines are configured to use a set of predefined parameter values. I Azure DevOps the variables are defined using variable groups.

### Common variables

There's a set of common variables that are used by all the deployment pipelines. These variables are stored in a variable group called 'SDAF-General'.

Create a new variable group 'SDAF-General' using the Library page in the Pipelines section. Add the following variables:

| Variable                           | Value                                   | Notes                                                            |
| ---------------------------------- | --------------------------------------- | ---------------------------------------------------------------- |
| `ANSIBLE_HOST_KEY_CHECKING`        | false                                   |                                                                  |
| Deployment_Configuration_Path      | WORKSPACES                              | For testing the sample configuration use 'samples/WORKSPACES' instead of WORKSPACES.                    |
| Branch                             | main                                    |                                                                  |
| S-Username                         | `<SAP Support user account name>`       |                                                                  |
| S-Password                         | `<SAP Support user password>`           |  Change variable type to secret by clicking the lock icon        |
| `advice.detachedHead`              | false                                   |                                                                  |
| `skipComponentGovernanceDetection` | true                                    |                                                                  |
| `tf_version`                       | 1.1.4                                   | The Terraform version to use, see [Terraform download](https://www.terraform.io/downloads)                                            |

Save the variables and assign permissions for all pipelines using _Pipeline permissions_.

### Environment specific variables

As each environment may have different deployment credentials you'll need to create a variable group per environment, for example 'SDAF-MGMT','SDAF-DEV', 'SDAF-QA'. 

Create a new variable group 'SDAF-MGMT' for the control plane environment using the Library page in the Pipelines section. Add the following variables:

| Variable              | Value                                          | Notes                                                    |
| --------------------- | ---------------------------------------------- | -------------------------------------------------------- |
| Agent                 | Either 'Azure Pipelines' or the name of the agent pool containing the deployer, for instance 'MGMT-WEEU-POOL' Note, this pool will be created in a later step. |
| ARM_CLIENT_ID         | Service principal application id               |                                                          |
| ARM_CLIENT_SECRET     | Service principal password                     | Change variable type to secret by clicking the lock icon |
| ARM_SUBSCRIPTION_ID   | Target subscription ID                         |                                                          |
| ARM_TENANT_ID         | Tenant ID for service principal                |                                                          |
| AZURE_CONNECTION_NAME | Previously created connection name             |                                                          |
| sap_fqdn              | SAP Fully Qualified Domain Name, for example sap.contoso.net | Only needed if Private DNS isn't used.                                           |


Clone the group for each environment 'SDAF-DEV', 'SDAF-QA', ... and update the values to reflect the environment.

| Variable              | Value                                          | Notes                                                    |
| --------------------- | ---------------------------------------------- | -------------------------------------------------------- |
| Agent                 | Either 'Azure Pipelines' or the name of the agent pool containing the deployer, for instance 'MGMT-WEEU-POOL' Note, this pool will be created in a later step. |
| ARM_CLIENT_ID         | Service principal application id               |                                                          |
| ARM_CLIENT_SECRET     | Service principal password                     | Change variable type to secret by clicking the lock icon |
| ARM_SUBSCRIPTION_ID   | Target subscription ID                         |                                                          |
| ARM_TENANT_ID         | Tenant ID for service principal                |                                                          |
| AZURE_CONNECTION_NAME | Previously created connection name             |                                                          |
| sap_fqdn              | SAP Fully Qualified Domain Name, for example sap.contoso.net | Only needed if Private DNS isn't used.                                           |


Save the variables and assign permissions for all pipelines using _Pipeline permissions_.

## Register the Deployer as a self-hosted agent for Azure DevOps

You must use the Deployer as a [self-hosted agent for Azure DevOps](/azure/devops/pipelines/agents/v2-linux) to perform the Ansible configuration activities. As a one-time step, you must register the Deployer as a self-hosted agent.

### Prerequisites

1. Connect to your Azure DevOps instance Sign-in to [Azure DevOps](https://dev.azure.com). Navigate to the Project you want to connect to and note the URL to the Azure DevOps project.

1. Create an Agent Pool by navigating to the Organizational Settings and selecting _Agent Pools_ from the Pipelines section. Click the _Add Pool_ button and choose Self-hosted as the pool type. Name the pool to align with the workload zone environment, for example `DEV-WEEU-POOL`. Ensure _Grant access permission to all pipelines_ is selected and create the pool using the _Create_ button.

1. Sign in with the user account you plan to use in your Azure DevOps organization (https://dev.azure.com).

1. From your home page, open your user settings, and then select _Personal access tokens_.

   :::image type="content" source="./media/automation-devops/automation-select-personal-access-tokens.jpg" alt-text="Diagram showing the creation of the Personal Access Token (PAT).":::

1. Create a personal access token. Ensure that _Read & manage_ is selected for _Agent Pools_ and _Read & write_ is selected for _Code_. Write down the created token value.

   :::image type="content" source="./media/automation-devops/automation-new-pat.png" alt-text="Diagram showing the attributes of the Personal Access Token (PAT).":::

## Configure the Azure DevOps Services self-hosted agent

1. Connect to the Deployer using the steps described here [Using Visual Studio Code](automation-tools-configuration.md#configuring-visual-studio-code)

1. Open a Terminal window and run:

```bash
cd ~/Azure_SAP_Automated_Deployment/

$DEPLOYMENT_REPO_PATH/deploy/scripts/setup_ado.sh
```

Accept the license and when prompted for server URL, enter the URL you captured when you created the Azure DevOps Project. For authentication, choose PAT and enter the token value from the previous step.

When prompted enter the application pool name, you created in the previous step. Accept the default agent name and the default work folder name.
The agent will now be configured and started.

## Run Azure Pipelines

Newly created pipelines might not be visible in the default view. Select on recent tab and go back to All tab to view the new pipelines.

Select the _Control plane deployment_ pipeline and choose "Run" to deploy the control plane.

## Next step

> [!div class="nextstepaction"]
> [DevOps Hands on Lab](automation-devops-tutorial.md)
