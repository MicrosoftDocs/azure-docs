---
title: Troubleshoot the SAP Deployment Automation Framework
description: Describe how to troubleshoot the SAP Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 12/05/2023
ms.topic: conceptual
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom:
---

# Troubleshooting the SAP Deployment Automation Framework


Within the SAP Deployment Automation Framework (SDAF), we recognize that there are many moving parts.  This article is intended to help you troubleshoot issues that you can encounter.

## Control plane deployment

The control plane deployment consists of the following steps:

1. Deploy the deployer infrastructure.
2. Add the Service Principal details to the Deployer key vault.
3. Deploy the SAP Library infrastructure
4. Migrate the Terraform state for the Deployer to the SAP Library.
5. Migrate the Terraform state for the SAP Library to the SAP Library.

To track the progress of the deployment, the state is persisted in a file in the `.sap_deployment_automation` folder in the WORKSPACES directory.  

> [!div class="mx-tdCol2BreakAll "]
> | Step  | What is being deployed                                                    | State file location      |
> | ----- | ------------------------------------------------------------------------- | ------------------------ |
> | 0     | Deployment infrastructure (virtual machine, key vault, Firewall, Bastion) | local                    |
> | 1     | Service Principal details persisted in the deployer's key vault           | local                    |
> | 2     | SAP Library infrastructure (storage accounts, Private DNS)                | local                    |
> | 3     | Deployer terraform state migrated to remote storage                       | SAP Library              |
> | 4     | SAP Library terraform state migrated to remote storage                    | SAP Library              |


## Deployment

This section describes how to troubleshoot issues that you can encounter when performing deployments using the SAP Deployment Automation Framework.

### Unable to access keyvault: XXXXX error

If you see an error similar to the following error when running the deployment:

```text
Unable to access keyvault: XXXXYYYYDEP00userBEB                             
Please ensure the key vault exists.
```

This error indicates that the specified key vault doesn't exist or that the deployment environment is unable to access it. 

Depending on the deployment stage, you can resolve this issue in the following ways:

You can either add the IP of the environment from which you're executing the deployment (recommended) or you can allow public access to the key vault. For more information about controlling access to the key vault, see [Allow public access to a key vault](/azure/key-vault/general/network-security#allow-public-access-to-a-key-vault).

The following variables are used to configure the key vault access:

```tfvars
Agent_IP                      = "10.0.0.5"
public_network_access_enabled = true
```

### Failed to get existing workspaces error

If you see an error similar to the following error when running the deployment:

```text
Error: : Error retrieving keys for Storage Account "mgmtweeutfstate###": azure.BearerAuthorizer#WithAuthorization: Failed to refresh the Token for request to
https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MGMT-WEEU-SAP_LIBRARY/providers/Microsoft.Storage/storageAccounts/mgmtweeutfstate###/listKeys?api-version=2021-01-01
: StatusCode=400 -- Original Error: adal: Refresh request failed. Status Code = '400'. Response body: {"error":"invalid_request","error_description":"Identity not found"} Endpoint
http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&client_id=yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy&resource=https%3A%2F%2Fmanagement.azure.com%2F
```

This error indicates that the credentials used to do the deployment doesn't have access to the storage account. To resolve this issue, assign the 'Storage Account Contributor' role to the deployment credential on the terraform state storage account, the resource group or the subscription (if feasible). 

You can verify if the deployment is being performed using a service principal or a managed identity by checking the output of the deployment. If the deployment is using a service principal, the output contains the following section:

```text
	[set_executing_user_environment_variables]: Identifying the executing user and client
		[set_azure_cloud_environment]: Identifying the executing cloud environment
		[set_azure_cloud_environment]: Azure cloud environment: public
		[set_executing_user_environment_variables]: User type: servicePrincipal
		[set_executing_user_environment_variables]: client id: yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
	[set_executing_user_environment_variables]: Identified login type as 'service principal'
	[set_executing_user_environment_variables]: Initializing state with SPN named: <SPN Name>
	[set_executing_user_environment_variables]: exporting environment variables
	[set_executing_user_environment_variables]: ARM environment variables:
		ARM_CLIENT_ID: yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
		ARM_SUBSCRIPTION_ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
		ARM_USE_MSI: false
```

Look for the following line in the output: "ARM_USE_MSI: false"

If the deployment is using a managed identity, the output contains the following section:

```text

	[set_executing_user_environment_variables]: Identifying the executing user and client
		[set_azure_cloud_environment]: Identifying the executing cloud environment
		[set_azure_cloud_environment]: Azure cloud environment: public
		[set_executing_user_environment_variables]: User type: servicePrincipal
		[set_executing_user_environment_variables]: client id: systemAssignedIdentity
	[set_executing_user_environment_variables]: logged in using 'servicePrincipal'
	[set_executing_user_environment_variables]: unset ARM_CLIENT_SECRET
	[set_executing_user_environment_variables]: ARM environment variables:
		ARM_CLIENT_ID: zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz
		ARM_SUBSCRIPTION_ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
		ARM_USE_MSI: true
```

Look for the following line in the output: "ARM_USE_MSI: true"

You can assign the 'Storage Account Contributor' role to the deployment credential on the terraform state storage account, the resource group or the subscription (if feasible). Use the ARM_CLIENT_ID from the deployment output.

```cloudshell-interactive
export appId="<ARM_CLIENT_ID>"

az role assignment create --assignee ${appId} \
   --role "Storage Account Contributor" \
   --scope /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MGMT-WEEU-SAP_LIBRARY/providers/Microsoft.Storage/storageAccounts/mgmtweeutfstate###
```

You may also need to assign the reader role to the deployment credential on the subscription containing the resource group with the Terraform state file. You can do that with the following command:

```cloudshell-interactive
export appId="<ARM_CLIENT_ID>"

az role assignment create --assignee ${appId} \
   --role "Reader" \
   --scope /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Private DNS Zone Name 'xxx' wasn't found

If you see an error similar to the following error when running the deployment:

```text
Private DNS Zone Name: "privatelink.file.core.windows.net" was not found

or

Private DNS Zone Name: "privatelink.blob.core.windows.net" was not found

or

Private DNS Zone Name: "privatelink.vaultcore.azure.net" was not found

```

This error indicates that the Private DNS zone listed in the error isn't available. You can resolve this issue by either creating the Private DNS or providing the configuration for an existing private DNS Zone. For more information on how to create the Private DNS Zone, see [Create a private DNS zone](/azure/dns/private-dns-getstarted-cli#create-a-private-dns-zone).

You can specify the details for an existing private DNS zone by using the following variables:

```terraform
# Resource group name for resource group that contains the private DNS zone
management_dns_resourcegroup_name="<resource group name for the Private DNS Zone>"

# Subscription ID name for resource group that contains the private DNS zone
management_dns_subscription_id="<subscription id for resource group name for the Private DNS Zone>"

use_custom_dns_a_registration=false

```

Rerun the deployment after you made these changes.

### OverconstrainedAllocationRequest error
If you see an error similar to the following error when running the deployment:

```text
Virtual Machine Name: "devsap01app01": Code="OverconstrainedAllocationRequest" Message="Allocation failed. VM(s) with the following constraints cannot be allocated, because the condition is too restrictive. Please remove some constraints and try again. Constraints applied are:
- Networking Constraints (such as Accelerated Networking or IPv6)
- VM Size
```

This error indicates that the selected VM size isn't available using the provided constraints.  To resolve this issue, select a different VM size or a different availability zone.

### The client 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' with object id error
If you see an error similar to the following message when running the deployment:

```text

The client 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' with object id 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' does not have
authorization or an ABAC condition not fulfilled to perform action 'Microsoft.Authorization/roleAssignments/write' over scope '/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/DEV-WEEU-SAP01-X00/providers/Microsoft.Storage/storageAccounts/....
```

The error indicates that the deployment credential doesn't have 'User Access Administrator' role on the resource group. To resolve this issue, assign the 'User Access Administrator' role to the deployment credential on the resource group or the subscription (if feasible).

## Configuration

This section describes how to troubleshoot issues that you can encounter when performing configuration using the SAP Deployment Automation Framework.

### Task 'ansible.builtin.XXX' has extra params'

If you see an error similar to the following message when running the deployment:

```text
ERROR! this task 'ansible.builtin.command' has extra params, which is only allowed in the following modules: set_fact, shell, include_tasks, win_shell, import_tasks, import_role, include, win_command, command, include_role, meta, add_host, script, group_by, raw, include_vars
```

This error indicates that the version of Ansible installed on the agent doesn't support this task. To resolve this issue, upgrade to the latest version of Ansible on the agent virtual machine.

## Software download

This section describes how to troubleshoot issues that you can encounter when downloading the SAP software using the SAP Deployment Automation Framework.

### "HTTP Error 404: Not Found"

This error indicates that the software version is no longer available for download. Open a GitHub issue [New Issue](https://github.com/Azure/SAP-automation-samples/issues/new/choose)to request an update to the Bill of Materials file, or update the Bill of Materials file yourself and submit a pull request.

## Azure DevOps

This section describes how to troubleshoot issues that you can encounter when using Azure DevOps with the SAP Deployment Automation Framework.

### Issues with the Azure Pipelines

If you see an error similar to the following message when running the Azure Pipelines:

```text
##[error]Variable group SDAF-MGMT could not be found.
##[error]Bash exited with code '2'.
```

This error indicates that the configured personal access token doesn't have permissions to access the variable group. Ensure that the personal access token has the **Read & manage** permission for the variable group and that it's still valid. The personal access token is configured in the Azure DevOps pipeline variable groups either as 'PAT' in the control plane variable group or as 'WZ_PAT' in the workload zone variable group.


## Next step

> [!div class="nextstepaction"]
> [Configure custom naming](naming-module.md)
