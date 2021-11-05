---
title: SAP Delpoyment automation - frequently asked questions
description: How to handle common errors with SAP deployment automation framework on Azure.
author: jhajduk
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/5/2021
ms.topic: faq
ms.service: virtual-machines-sap
---

# Frequently Asked Question
Q: When running a deployment command, I am getting the error "Incorrect parameter file" 

A: Ensure that you are passing the correct path to the parameter file for the appropriate phase (Control Plane, Landscape, System) 

Q: Can I create multiple SIDs with an input file (such as CSV)? 

A: Not at this time 

Q: How do I customize my naming convention? 

A:  The naming convention chosen for the SAP infrastructure has been carefully chosen to comply with Azure naming standards. Having said that, we understand that organizations employ their own naming conventions and require that their SAP components assimilate into their naming standards. Please follow the instructions [here](automation-naming-module.md)

Q: During the apply phase, while deploying the Deployer/Library, I am getting the following type of error in the Terraform deployment: "Error: checking for existing Secret….User, group, or application…does not have secrets get permission on key vault… 

A:  Ensure that the SPN created for the deployment has permissions over the subscription. Ensure that the SPN AppID and SPN Secret in the user Key Vault are correct 

Q: During the apply phase, I am getting an error in the Terraform deployment: "authorization.RoleAssignment.Client#Create: The client…with object ID…does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/write' over scope…or scope is invalid" 

A: Ensure that you are passing in the correct Application ID and Application Secret for the deployment. You can double check the values that were passed by looking at the secrets in the deployment credentials vault 

Q: When deploying the Deployer, I am getting the error: "A resource with ID…already exists - to be managed via Terraform this resource needs to be imported into the State" 

A: Resources were added outside of the Terraform deployment. Please [update the state file](bash/automation-advanced_state_management.md)

Q: Multiline commands are failing due to whitespace error 

A: Ensure that that your deployment commands are well formed. Use an editor to format the deployment commands properly prior to running them 

Q: I am getting the following error when deploying the deployer: "error executing "/tmp/terraform_273760270.sh": Process exited with status 127" 

A: This is an issue with the line endings in the sap-hana -> deploy -> terraform -> terraform-units -> modules -> sap_deployer -> templates -> configure_deployer.sh.tmpl - Ensure that this file is saved with "LF" line endings rather than "CRLF" line endings. If you open the file in a Windows environment, the line endings may change from the original LF to CRLF 

Q: During deployment, I am getting the following error: "Error: building account: getting authenticated object ID: Error parsing json result from the Azure CLI: Error waiting for the Azure CLI: exit status 1: ERROR: Error occurred in request., ConnectionError: HTTPSConnectionPool(host='graph.windows.net', port=443): Max retries exceeded with url: /d1ffef09-2e44-4182-ad9c-d55a72c588a8/me?api-version=1.6 (Caused by NewConnectionError('<urllib3.connection.HTTPSConnection object at 0x040F73E8>: Failed to establish a new connection: [Errno 11002] getaddrinfo failed'))"

A: Use the az logout command and login again using the az login command. 

Q: When deploying the Library, I am getting the following error: "Error: KeyVault Secret "<secret name>"…does not exist" 

A: Ensure that the user Key Vault contains the following secrets:  

<ENVIRONMENT>-subscription-id 

MGMT-tenant-id 

MGMT-client-id 

MGMT-client-secret 

Q: While deploying the Landscape phase, I am getting the error: Either an Access Key / SAS Token or the Resource Group for the Storage Account must be specified - or Azure AD Authentication must be enabled 

A: Ensure that you are passing in the correct parameter for the storageaccountname parameter. This parameter should specify the account containing the Terraform state files.

Q: While running New-SAPAutomationRegion, I am getting the error: “The repository path: <repo path> is incorrect!” 

A: Go to the location of the sap_deployment_automation.ini file in in one of the following locations based on your execution environment: My Documents (Windows), ~/sap_deployment_automation (Linux). Enter the fully qualified path to the repository in the sap_deployment_automation.ini file under the Common -> Repo variable. 

Q: While running the Landscape phase, I am getting the error: "Error loading state error" 

A: Go to the location of the sap_deployment_automation.ini file in in one of the following locations based on your execution environment: My Documents (Windows), ~/sap_deployment_automation (Linux). Look at your SAP_Automated_Deployment.ini file and ensure that the values to each key do not have relative paths prior to the state file names - any values indicating state files should only contain the name of the state files from the state file storage account in the Library resource group.

Q: I am getting this error while deploying the workload zone: Error loading state: blobs.Client#Get: Invalid input: `blobName` cannot be an empty string. 

A: If the workload zone was not successfully deployed, you may delete the .terraform folder within the WORKSPACES\Landscape\<Environment Folder> and retry to deploy the workload zone. 

Q: While deploying the Workload Zone, I am getting the following error: Could not set the secrets. 

A: This error is in reference to the Key Vault being created in the Workload Zone. Ensure that you are passing in the deployment credentials Key Vault name for the vault parameter 

Q: While deploying the Landscape, I am getting the following error: 'netAppAccounts' has been restricted in this region. 

A: The netAppAccounts resource provider has not been registered with the subscription. Follow these steps to register the provider: https://docs.microsoft.com/en-us/azure/azure-netapp-files/azure-netapp-files-register. Azure NetApp Accounts can only be created in a subscription that is connected to a payment method 

Q: I am getting a fatal error while deploying the SAP HANA Software from test_menu.sh on the following task: Retrieve SSH Key Secret Details

A: Ensure that the name of the secrets in the user credentials Key Vault align with the environment naming prefix, e.g. DEV-XXXX-SAP01 vs DEV-XXXX-SAP 
