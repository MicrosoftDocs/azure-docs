---
title: SAP Deployment automation - frequently asked questions
description: How to handle common errors with the SAP deployment automation framework on Azure.
author: jhajduk
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: faq
ms.service: virtual-machines-sap
---

# Frequently Asked Questions

## Terraform deployment phase

Q: I get the error "Incorrect parameter file" when running a deployment

A: Ensure that you pass the correct path to the parameter file for the appropriate phase (Control Plane, Landscape, System) 

Q: Can I create multiple SIDs with an input file (such as CSV)? 

A: Not at this time 

Q: How do I customize my naming convention? 

A:  The naming convention chosen for the SAP infrastructure has been carefully chosen to match Azure naming standards. For customers who want to use their own naming conventions follow the instructions [here](automation-naming-module.md)

Q: I get the error `Error: checking for existing Secret….User, group, or application…does not have secrets get permission on key vault` 

A:  Ensure that the credentials used for deployment have sufficient permissions to read the secrets from the deployment key vault. Also ensure that the `SPN AppID` and `SPN Secret` in the user Key Vault are correct 

Q: I get the error: `authorization.RoleAssignment.Client#Create: The client… with object ID… does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/write' over scope…or scope is invalid`

A: Ensure that you pass the correct Application ID and Application Secret for the deployment. Validate the credential details by looking at the secrets in the deployment credentials key vault. 

> [!NOTE]
> The deployment credentials need to have the permissions to manage role assignments on the subscription

Q: I get the error: "A resource with ID…already exists - to be managed via Terraform this resource needs to be imported into the State" 

A: Azure resources were added outside of the Terraform deployment. Update the state file [automation-advanced_state_management.md](bash/automation-advanced_state_management.md)

Q: Multiline commands are failing due to whitespace error 

A: Ensure that your deployment commands are well formed. Use an editor to format the deployment commands properly before running them 

Q: I get the following error when deploying the deployer: `error executing "/tmp/terraform_273760270.sh": Process exited with status 127`

A: This is an issue with the line endings in the sap-hana -> deploy -> terraform -> terraform-units -> modules -> sap_deployer -> templates -> configure_deployer.sh.tmpl - Ensure that this file is saved with "LF" line endings rather than "CRLF" line endings. If you open the file in a Windows environment, the line endings may change from the original LF to CRLF 

Q: I get the following error: `Error: building account: getting authenticated object ID: Error parsing json result from the Azure CLI: Error waiting for the Azure CLI: exit status 1: ERROR: Error occurred in request., ConnectionError: HTTPSConnectionPool(host='graph.windows.net', port=443): Max retries exceeded with url: /d1ffef09-2e44-4182-ad9c-d55a72c588a8/me?api-version=1.6 (Caused by NewConnectionError('<urllib3.connection.HTTPSConnection object at 0x040F73E8>: Failed to establish a new connection: [Errno 11002] getaddrinfo failed'))`

A: Use the az logout command and login again using the az login command to resolve the issue. 

Q: I get the following error: `Error: KeyVault Secret "<secret name>` …does not exist" 

A: Ensure that the user Key Vault contains the following secrets:  

\<ENVIRONMENT\>-subscription-id 
\<ENVIRONMENT\>-tenant-id 
\<ENVIRONMENT\>-client-id 
\<ENVIRONMENT\>-client-secret`

Substitute \<ENVIRONMENT>\ with your environment name.

Q: I get the error: `Either an Access Key / SAS Token or the Resource Group for the Storage Account must be specified - or Azure AD Authentication must be enabled` when deploying the workload zone

A: Ensure that you are passing in the correct value for the `storageaccountname` parameter. This parameter should specify the account containing the Terraform state files.

Q: While running New-SAPAutomationRegion, I am getting the error: “The repository path: \<repo path\> is incorrect!” 

A: Go to the location of the `sap_deployment_automation.ini` file in in one of the following locations based on your execution environment: My Documents (Windows), ~/sap_deployment_automation (Linux). Enter the fully qualified path to the repository in the sap_deployment_automation.ini file under the Common -> Repo variable. 

Q: While running the Landscape phase, I am getting the error: "Error loading state error" 

A: Go to the location of the `sap_deployment_automation.ini` file in one of the following locations based on your execution environment: My Documents (Windows), ~/sap_deployment_automation (Linux). Look at your SAP_Automated_Deployment.ini file and ensure that the values to each key do not have relative paths prior to the state file names - any values indicating state files should only contain the name of the state files from the state file storage account in the Library resource group.

Q: I get the error: `Error loading state: blobs.Client#Get: Invalid input: `blobName` cannot be an empty string`  while deploying the workload zone. 

A: If the workload zone was not successfully deployed, you may delete the `.terraform` folder within the WORKSPACES\Landscape\<Environment Folder> and retry to deploy the workload zone. 

Q: I get the following error: "Could not set the secrets." when deploying the Workload Zone.

A: This error is in reference to the Key Vault being created in the Workload Zone. Ensure that you are passing in the deployment credentials Key Vault name for the vault parameter 

Q: While deploying the Landscape, I get the following error: 'netAppAccounts' has been restricted in this region. 

A: The subscription is not registered for the netAppAccounts resource provider. Follow these steps to [register the provider](/azure/azure-netapp-files/azure-netapp-files-register). 

> [!NOTE]
> Azure NetApp Accounts can only be created in a subscription that is connected to a payment method 

## Ansible

Q: I am getting a fatal error while deploying the SAP HANA Software from test_menu.sh on the following task: Retrieve SSH Key Secret Details

A: Ensure that the name of the secrets in the user credentials Key Vault align with the environment naming prefix, for instance `DEV-XXXX-SAP01` vs `DEV-XXXX-SAP` 
