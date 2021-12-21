---
title: Configure Azure Devops for SAP Deployment Automation Framework
description: Configure your Azure Devops for the SAP Deployment Automation Framework on Azure
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 12/16/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Using SAP Deployment Automation Framework from Azure DevOps

This document describes how to configure Azure DevOps to the SAP Deployment Automation Framework.

## Setup of Azure DevOps instance

You can use Azure DevOps as your execution environment for deployment and configuration activities.

## Pipeline creation

You can create Azure DevOps pipelines to perform the deployment or removal of the control plane, workload zone, SAP system and perform the SAP installation.


## Sign up for Azure DevOps

To use Azure DevOps you will need an Azure DevOps account, to create an account open [Azure DevOps](https://azure.microsoft.com/services/devops/) and either *Sign In* or create a new account.

## Setup the Azure DevOps project

1. Open (https:/dev.azure.com) and create a new project by clicking on the *New Project* button, for more info see [Create a Project in Azure DevOps](azure/devops/organizations/projects/create-project?view=azure-devops&tabs=preview-page#create-a-project). Enter the project details and click create.

:::image type="content" source="./media/automation-devops/automation-create-project.png" alt-text="Diagram showing the Create Project dialog.":::
 

1. Navigate to the Repositories section in the left navigation and choose Import a repository.

:::image type="content" source="./media/automation-devops/automation-import-repo.png" alt-text="Diagram showing the Repository dialog.":::

1. Import the 'https://github.com/Azure/sap-automation.git' repository into Azure Devops. For more info see [Importing a repository](/azure/devops/repos/git/import-git-repository?view=azure-devops) 

1. [Create the Azure Resource Manager service connection](/azure/devops/pipelines/library/service-endpoints?view=azure-devops&tabs=yaml#azure-resource-manager-service-connection). Configure the manual connection type and use the service principal from step 5. of the prerequisites

1. Create a general variable groups "sap-deployment-general-variables" including:
   * ANSIBLE_HOST_KEY_CHECKING = false
   * ANSIBLE_CALLBACK_WHITELIST = profile_tasks
   * Deployment_Configuration_Path = samples/WORKSPACES
   * Repository = https://github.com/Azure/sap-automation
   * Branch = private-preview
   optional variables:
   * advice.detachedHead = false
   * skipComponentGovernanceDetection = true

5. Create a specific variable groups "sap-deployment-specific-variables" including:
   * ARM_CLIENT_ID = `<service principal app id>`
   * ARM_CLIENT_SECRET = `<service principal password>`
   * ARM_SUBSCRIPTION_ID = `<Azure subscription id>`
   * ARM_TENANT_ID = `<Azure tenant id>`
   * AZURE_CONNECTION_NAME = <the connection name specified in step 3.>
   * S-Username = `<SAP Support user>`
   * S-Password = `<SAP Support user password>`
   * Agent = WestEurope

## Create Azure DevOps Pipelines
  
Some pipelines will add files to the devops repository and require therefore pull permissions. 
  
  Go to Repositories -> Manage repositories -> All Repositories -> Tab: Security 
  Under Users mark "SAP-Deployment Build Service (organization)" 
  Allow "Contribute" permissions
  
  Delete the .gitignore file
  
  ## Control plane deployment
  
  Create the control plane pipeline by choosing *New Pipeline* from the Pipelines section and select 'Azure Repos Git' as the source for your code. Configure your Pipeline to use an existing Azure Pipeline YAML File.

| Setting  | Value                                     |
| -------- | ----------------------------------------- |
| Branch   | private-preview                           |
| Path     | `deploy/pipelines/01-prepare-region.yaml` |

Save the Pipeline, to see the Save option click the chevron next to the Run button.

Navigate to the Pipelines section and select the pipeline. Rename the pipeline to 'Control plane deployment' by choosing 'Rename/Move' from the three dot menu on the right.
  ## Pipeline 2 for the sap workload zone (landscape)
  
    Same process for pipeline 02-sap-workload-zone.yaml
  
  ## Pipeline 3 for the sap systems
  
    Same process for pipeline 03-sap-system-deployment.yaml
  
  ## Pipeline 4 for downloading the sap binaries
  
    Same process for pipeline 04-sap-binary-download.yaml
  
  ## Pipeline 5 for installing the database and SAP applications
  
    Same process for pipeline 05-db-and-sap-installation.yaml
  
  ## Pipeline 10 for destroying deployments via terraform
  
    Same process for pipeline 10-remover-terraform.yaml
  
  ## Pipeline 11 for removing deployments via Azure ressource manager
  
    Same process for pipeline 11-remover-arm-fallback.yaml
  
## Run Azure DevOps Pipelines

  Newly created pipelines might not be visible in the default view. Click on recent tab and go back to All tab to view the new pipelines.
  Click on the pipeline and choose "Run"

  Verify the result in Azure: Are the VMs deployed and running?
  Check the configuration files in the ADO Repo
  
## Register the Deployer as a Azure DevOps agent

You will use the Deployer as a [self-hosted agent for Azure DevOps](/azure/devops/pipelines/agents/v2-linux) to perform the Ansible configuration activities. This requires that the Deployer needs to be added into an [Agent Pool](/azure/devops/pipelines/agents/pools-queues). As a one-time step, you must register the agent. Someone with permission to administer the agent queue must complete these steps.  

### Prerequisites


1. Connect to your Azure DevOps instance Sign in to [Azure DevOps](https://dev.azure.com). Navigate to the Project you want to connect to and write down the URL to the Azure DevOps project.

1. Create an Agent Pool by navigating to the Organizational Settings and selecting *Agent Pools* from the Pipelines section. Click the *Add Pool* button and choose Self-hosted as the pool type. Name the pool to align with the control plane, for example `MGMT-WEEU-POOL`. Ensure *Grant access permission to all pipelines* is selected and create the pool using the *Create* button.

1. Sign in with the user account you plan to use in your Azure DevOps organization (https://dev.azure.com). 

1. From your home page, open your user settings, and then select *Personal access tokens*.

:::image type="content" source="./media/automation-deployment-framework/select-personal-access-tokens.png" alt-text="Diagram showing the creation of the Personal Access Token (PAT).":::


1. Create a personal access token. Ensure that *Read & manage* is selected for *Agent Pools* and *Read & write* is selected for *Code*. Write down the created token value.

:::image type="content" source="./media/automation-deployment-framework/automation-new-pat.png" alt-text="Diagram showing the creation of the Personal Access Token (PAT).":::
## Configuring the Agent

1. Connect to the Deployer using the steps described here [Using Visual Studio Code](automation-tools-configuration.md#configuring-visual-studio-code) 

1. Open a Terminal window and run

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/

    sudo $DEPLOYMENT_REPO_PATH/deploy/scripts/setup_ado.sh

    ```

Accept the license. When prompted for server URL, enter the URL you captured in the previous step. For authentication choose PAT and enter the token value from the previous step. 
Enter the application pool name you created in the previous step when prompted. Accept the default agent name. Accept the default work folder name.

The agent will now be configured and stated,

# Next steps

  Adapt the configuration to production needs
  Use the name generator to use specific naming conventions
  
> [!div class="nextstepaction"]
> [Configure control plane](automation-configure-control-plane.md)


test
