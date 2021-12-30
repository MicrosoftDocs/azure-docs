---
title: Configure Azure DevOps Services for SAP Deployment Automation Framework
description: Configure your Azure DevOps Services for the SAP Deployment Automation Framework on Azure
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 12/16/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Using SAP Deployment Automation Framework from Azure DevOps Services

You can use Azure DevOps Services (Azure Repos and Azure Pipelines) as your configuration repository and as the environment for deployment and configuration activities using the SAP Deployment Automation Framework.

## Sign up for Azure DevOps Services

To use Azure DevOps Services you will need an Azure DevOps organization. An organization is used to connect groups of related projects. Use your work or school account to automatically connect your organization to your Azure Active Directory (Azure AD).To create an account open [Azure DevOps](https://azure.microsoft.com/services/devops/) and either _Sign In_ or create a new account.

## Set up the Azure DevOps project

You can use Azure Repos to store both system and environment configuration files (\*.tfvars), Terraform templates and Ansible playbooks.

Open (https://dev.azure.com) and create a new project by clicking on the _New Project_ button and enter the project details. The project will contain both the Azure Repos source control repository and Azure Pipelines for performing deployment activities

> [!NOTE]
> If you are unable to see _New Project_ ensure that you have permissions to create new projects in the organization.

### Importing the repository

Start by importing the SAP Deployment Automation Framework GitHub repository into Azure Repos. Navigate to the Repositories section and choose Import a repository. Import the 'https://github.com/Azure/sap-automation.git' repository into Azure DevOps. For more info, see [Importing a repository](/azure/devops/repos/git/import-git-repository?view=azure-devops&preserve-view=true)

## Set up the Azure Pipelines

To remove the Azure resources, you need an Azure Resource Manager service connection.

To create the service connection go to Project settings and navigate to the Service connections setting in the Pipelines section.

:::image type="content" source="./media/automation-devops/automation-create-service-connection.png" alt-text="Picture showing how to create a Service connection":::

Choose _Azure Resource Manager_ as the service connection type and _Service principal (manual)_ as the authentication method. Specify the target subscription (typically the control plane subscription) and provide the service principal details (verify that they are valid using the _Verify_ button). If you do not have a service principal see [Creating a Service Principal](automation-deploy-control-plane.md#prepare-the-deployment-credentials) for more information.

Finally provide a Service connection name, for instance 'Connection to DEV subscription' and ensure that the _Grant access permission to all pipelines_ checkbox is checked. Click _Verify and save_ to save the service connection.

### Variable definitions

Create a new variable group "sap-deployment-variables-general" using the Library page in the Pipelines section. Add the following variables:

| Variable                           | Value                                   |
| ---------------------------------- | --------------------------------------- |
| `ANSIBLE_HOST_KEY_CHECKING`        | false                                   |
| `ANSIBLE_CALLBACK_WHITELIST`       | profile_tasks                           |
| Deployment_Configuration_Path      | samples/WORKSPACES                      |
| Repository                         | https://github.com/Azure/sap-automation |
| Branch                             | private-preview                         |
| S-Username                         | `<SAP Support user account name>`       |
| S-Password                         | `<SAP Support user password>`           |
| `advice.detachedHead`              | false                                   |
| `skipComponentGovernanceDetection` | true                                    |
| `tf_version`                       | 1.0.11                                  |

Create another variable group "sap-deployment-variables-specific" and add the following variables:

| Variable              | Value                                          |
| --------------------- | ---------------------------------------------- |
| ARM_CLIENT_ID         | Service principal application id               |
| ARM_CLIENT_SECRET     | Service principal password                     |
| ARM_TENANT_ID         | Tenant ID for service principal                |
| ARM_SUBSCRIPTION_ID   | Target subscription ID                         |
| AZURE_CONNECTION_NAME | Previously created connection name             |
| Agent                 | Name of the agent pool containing the deployer, for instance 'DEV-WEEU-POOL' Note, this pool will be created in a later step |

## Create Azure Pipelines

Some of the pipelines will add files to the Azure Repos and therefore require pull permissions. Assign the permissions using Security tab of the source code repository in the Repositories section in Project settings. Assign "Contribute" permissions to the Build Service.

:::image type="content" source="./media/automation-devops/automation-repo-permissions.png" alt-text="Picture showing repository permissions":::


## Control plane deployment pipeline

Create the control plane pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipeline YAML File. Specify the pipeline with the following settings:

| Setting | Value                                     |
| ------- | ----------------------------------------- |
| Branch  | private-preview                           |
| Path    | `deploy/pipelines/01-prepare-region.yaml` |
| Name    | Control plane deployment                  |

Save the Pipeline, to see the Save option click the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'Control plane deployment' by choosing 'Rename/Move' from the three-dot menu on the right.

## SAP workload zone pipeline

Create the SAP workload zone pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipeline YAML File. Specify the pipeline with the following settings:

| Setting | Value                                        |
| ------- | -------------------------------------------- |
| Branch  | private-preview                              |
| Path    | `deploy/pipelines/02-sap-workload-zone.yaml` |
| Name    | SAP workload zone deployment                 |

Save the Pipeline, to see the Save option click the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'SAP workload zone deployment' by choosing 'Rename/Move' from the three-dot menu on the right.

## SAP system deployment pipeline

Create the SAP system deployment pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipeline YAML File. Specify the pipeline with the following settings:

| Setting | Value                                            |
| ------- | ------------------------------------------------ |
| Branch  | private-preview                                  |
| Path    | `deploy/pipelines/03-sap-system-deployment.yaml` |
| Name    | SAP system deployment (infrastructure)           |

Save the Pipeline, to see the Save option click the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'SAP system deployment (infrastructure)' by choosing 'Rename/Move' from the three-dot menu on the right.

## SAP software acquisition pipeline

Create the SAP software acquisition pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipeline YAML File. Specify the pipeline with the following settings:

| Setting | Value                                            |
| ------- | ------------------------------------------------ |
| Branch  | private-preview                                  |
| Path    | `deploy/pipelines/04-sap-software-download.yaml` |
| Name    | SAP software acquisition                         |

Save the Pipeline, to see the Save option click the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'SAP software acquisition' by choosing 'Rename/Move' from the three-dot menu on the right.

## SAP configuration and software installation pipeline

Create the SAP configuration and software installation pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipeline YAML File. Specify the pipeline with the following settings:

| Setting | Value                                              |
| ------- | -------------------------------------------------- |
| Branch  | private-preview                                    |
| Path    | `deploy/pipelines/05-DB-and-SAP-installation.yaml` |
| Name    | configuration and software installation            |

Save the Pipeline, to see the Save option click the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'SAP configuration and software installation' by choosing 'Rename/Move' from the three-dot menu on the right.

## Deployment removal pipeline

Create the deployment removal pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipeline YAML File. Specify the pipeline with the following settings:

| Setting | Value                                        |
| ------- | -------------------------------------------- |
| Branch  | private-preview                              |
| Path    | `deploy/pipelines/10-remover-terraform.yaml` |
| Name    | Deployment removal                           |

Save the Pipeline, to see the Save option click the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'Deployment removal' by choosing 'Rename/Move' from the three-dot menu on the right.

## Deployment removal pipeline using Azure Resource Manager

Create the deployment removal ARM pipeline by choosing _New Pipeline_ from the Pipelines section, select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipeline YAML File. Specify the pipeline with the following settings:

| Setting | Value                                           |
| ------- | ----------------------------------------------- |
| Branch  | private-preview                                 |
| Path    | `deploy/pipelines/11-remover-arm-fallback.yaml` |
| Name    | Deployment removal using ARM                    |

Save the Pipeline, to see the Save option click the chevron next to the Run button. Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'Deployment removal using ARM' by choosing 'Rename/Move' from the three-dot menu on the right.

> [!NOTE]
> Only use this pipeline as last resort, removing just the resource groups will leave remnants that may complicate re-deployments.

## Register the Deployer as an self-hosted agent for Azure DevOps

You can use the Deployer as a [self-hosted agent for Azure DevOps](/azure/devops/pipelines/agents/v2-linux) to perform the Ansible configuration activities. As a one-time step, you must register the Deployer as an agent.

### Prerequisites

1. Connect to your Azure DevOps instance Sign-in to [Azure DevOps](https://dev.azure.com). Navigate to the Project you want to connect to and note the URL to the Azure DevOps project.

1. Create an Agent Pool by navigating to the Organizational Settings and selecting _Agent Pools_ from the Pipelines section. Click the _Add Pool_ button and choose Self-hosted as the pool type. Name the pool to align with the control plane, for example `MGMT-WEEU-POOL`. Ensure _Grant access permission to all pipelines_ is selected and create the pool using the _Create_ button.

1. Sign in with the user account you plan to use in your Azure DevOps organization (https://dev.azure.com).

1. From your home page, open your user settings, and then select _Personal access tokens_.

:::image type="content" source="./media/automation-devops/automation-select-personal-access-tokens.jpg" alt-text="Diagram showing the creation of the Personal Access Token (PAT).":::

1. Create a personal access token. Ensure that _Read & manage_ is selected for _Agent Pools_ and _Read & write_ is selected for _Code_. Write down the created token value.

:::image type="content" source="./media/automation-devops/automation-new-pat.png" alt-text="Diagram showing the attributes of the Personal Access Token (PAT).":::

## Configuring the Agent

1. Connect to the Deployer using the steps described here [Using Visual Studio Code](automation-tools-configuration.md#configuring-visual-studio-code)

1. Open a Terminal window and run

```bash
cd ~/Azure_SAP_Automated_Deployment/

$DEPLOYMENT_REPO_PATH/deploy/scripts/setup_ado.sh
```

Accept the license. When prompted for server URL, enter the URL you captured in the previous step. For authentication, choose PAT and enter the token value from the previous step.
Enter the application pool name you created in the previous step when prompted. Accept the default agent name. Accept the default work folder name.

The agent will now be configured and stated,

## Run Azure Pipelines

Newly created pipelines might not be visible in the default view. Click on recent tab and go back to All tab to view the new pipelines.
Click on the pipeline and choose "Run"

## Next steps

> [!div class="nextstepaction"] > [Configure control plane](automation-configure-control-plane.md)

Test
