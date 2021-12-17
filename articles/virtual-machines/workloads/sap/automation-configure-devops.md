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

## Setup the Azure DevOps project

1. [Create a Project in Azure DevOps ](https://docs.microsoft.com/en-us/azure/devops/organizations/projects/create-project?view=azure-devops&tabs=preview-page#create-a-project)

1. Import the automation repository https://github.com/Azure/sap-automation.git into the Azure Devops repository. [Importing a repository](https://docs.microsoft.com/en-us/azure/devops/repos/git/import-git-repository?view=azure-devops)

1. [Create the Azure Resource Manager service connection](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/service-endpoints?view=azure-devops&tabs=yaml#azure-resource-manager-service-connection). Configure the manual connection type and use the service principal from step 5. of the prerequesites

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
   * ARM_CLIENT_ID = <service principle app id>
   * ARM_CLIENT_SECRET = <service principle password>
   * ARM_SUBSCRIPTION_ID = <Azure subscription id>
   * ARM_TENANT_ID = <Azure tenant id>
   * AZURECONNECTIONNAME = <the connectione name specified in step 3.>
   * S-Username = <SAP Support user>
   * S-Password = <SAP Support user password>
   * Agent = WestEurope

# Create Azure DevOps Pipelines
  
Some pipelines will add files to the devops repository and require therefore pull permissions. 
  
  Go to Repositories -> Manage repositories -> All Repositories -> Tab: Security 
  Under Users mark "SAP-Deployment Build Service (organization)" 
  Allow "Contribute" permissions
  
  Delete the .gitignore file
  
  ## Pipeline 1 for the deployment infrastructure
  
  Create the first pipeline.
  Go to "Pipelines" -> New pipeline
  
    Where is your code? -> Azure Repos Git
    Select a repository -> `sap-automation`
    Configure your Pipeline -> Existing Azure Pipeline YAML File 
      -> Branch: `Main`
      -> Path: `deploy/pipelines/01-prepare-region.yaml`
      -> Continue
    -> Save (Under "More actions" on the right size of the "Run" button)
    -> Edit -> More Actions -> Triggers
      Override the YAML continuous integration trigger from here -> Disable continuous integration
      Tab: Variables -> `Variable groups`
        -> Link variable group `sap-deployment-general-variables`
        -> Link variable group `sap-deployment-specific-variables`
      Tab: YAML -> Name -> `01-prepare-region`
      Save & queue dropdown -> Save
      Save build pipeline -> Save
    
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
  

# Setup Azure DevOps Agent on the deployer VM
  
  ...
  
# Run Azure DevOps Pipelines

  Newly created pipelines might not be visible in the default view. Click on recent tab and go back to All tab to view the new pipelines.
  Click on the pipeline and choose "Run"

  Verify the result in Azure: Are the VMs deployed and running?
  Check the configuration files in the ADO Repo
  


# Next steps

  Adapt the configuration to production needs
  Use the name generator to use specific naming conventions
  
> [!div class="nextstepaction"]
> [Configure control plane](automation-configure-control-plane.md)


