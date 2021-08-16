---
title: Step-by-Step guide to move Azure Synapse workspace from region to another
description: This article will teach you how to move the Synapse Workspace from one region to another region. 
author: phanir
ms.service: synapse-analytics 
ms.topic: how-to
ms.date: 08/12/2021
ms.author: phanir
ms.reviewer: jrasnick

---

# Step-by-Step guide to move Azure Synapse workspace from one region to another

This document is a step-by-step guide to move Azure Synapse workspace from one Azure region to another region. 
> [!NOTE]
> Steps mentioned in this document is not actually moving the workspace but we are creating a new workspace in another region using the backups and artifacts from source region workspace.


## Prerequisites
- Integrate source region Synapse Workspace with Azure DevOps or GitHub.
- [Az PowerShell](/powershell/azure/install-az-ps?view=azps-6.3.0) and [AZ CLI](/cli/azure/install-azure-cli) modules installed on the computer from where scripts are executed.
- All dependent services like Azure Machine Learning, Azure Storage, Private link hubs need to be recreated in target region or moved to target region if the service supports region move. 
- To move Azure Storage to a different region,follow the steps mentioned in  article 
[Move an Azure Storage account to another region](../storage/common/storage-account-move.md)
- Dedicated SQL Pool name and Spark Pool name should be the same in both source region and target region workspace.


## Scenarios for Region Move
- **New Compliance Requirements**: Organizations require data and services to be placed in the same region as part of new compliance requirements.
- **Availability of new Azure Region**: Scenarios where new Azure region is available and there are project or business requirements to move the workspace and other Azure  resources to the newly available Azure region.
- **Wrong region selected**: Wrong region was selected at the first place while creating the Azure resources.

## Steps to move Azure Synapse workspace to another region

Moving Azure Synapse workspace from region to another region is a multi-step process. Following are the high-level steps:

1. Creating new workspace in target region along with Spark Pool with same configurations as used in source region workspace.
1. Restore Dedicated SQL Pool to target region using restore points or Geo-Backups.
1. Recreate all required logins on the new logical SQL Server.
1. Creating Serverless SQL Pool and Spark Pools databases and objects.
1. Adding Azure DevOps Service Principal to Synapse RBAC "Synapse Artifact Publisher" role if you are using Azure DevOps release pipeline to deploy the artifacts.
1. Deploying code artifact (SQL Scripts, Notebooks), linked services, pipelines, datasets, Spark Job definitions triggers, credentials from Azure DevOps release pipelines to target region Synapse workspace.
1. Adding AAD users or groups to Synapse RBAC roles. Granting Storage Blob Contributor access to SA-MI(System Assigned Managed Identity) on Azure Storage and Azure Key Vault if you are authenticating using Managed Identity.
1. Granting  Storage Blob Reader or Storage Blob Contributor roles to required AAD users on default attached storage or on Storage Account that has data to be queried using Serverless SQL Pool.
1. Recreating Self-Hosted Integration runtime. 
1. Manually upload all required libraries, jars in target Synapse workspace.
1. Creating all managed private endpoints if workspace is deployed in a managed VNet.
1. Test the new workspace on target region and update any DNS entries, which are pointing to source region workspace.
1. If there is a private endpoint connection created on the source workspace, then create one on the target region workspace.
1. You can delete the workspace in source region after testing thoroughly and routing all the connections to the target region workspace.



## Step 1: Creating Workspace in target region

In this section you will be creating the Synapse workspace using AZ PowerShell, AZ CLI,  and Azure portal. We are creating a Resource Group along with ADLS Gen-2 Storage Account that will be used as the default storage for Workspace as part of the PowerShell script and CLI script. You can invoke these PowerShell or CLI scripts from the DevOps release pipeline if you want to automate the process of deployment.

### Azure portal
You can follow along the steps mentioned in the link below to create a workspace from Azure portal.
[Quickstart: create a Synapse workspace - Azure Synapse Analytics](quickstart-create-workspace.md) 

### Azure PowerShell 
Below script will create the resource group and Synapse Workspace using New-AzResourceGroup and New-AzSynapseWorkspace cmdlets.

***Creating Resource Group***

```powershell
$storageAccountName= "<YourDefaultStorageAccountName>"
$resourceGroupName="<YourResourceGroupName>"
$regionName="<YourTargetRegionName>"
$containerName="<YourFileSystemName>" # This is the file system name
$workspaceName="<YourTargetRegionWorkspaceName>"

$sourcRegionWSName="<Your source region workspace name>"
$sourceRegionRGName="<YourSourceRegionResourceGroupName>"
$sqlUserName="<SQLUserName>"
$sqlPassword="<SQLStrongPassword>"

$sqlPoolName ="<YourTargetSQLPoolName>" #Both Source and target workspace SQL Pool name will be same
$sparkPoolName ="<YourTargetWorkspaceSparkPoolName>"
$sparkVersion="2.4"

New-AzResourceGroup -Name $resourceGroupName -Location $regionName
```

***Creating ADLS Gen-2 Account***

```powershell
#If the storage account is already created then you can skip this step.
New-AzStorageAccount -ResourceGroupName $resourceGroupName `
  -Name $storageAccountName `
  -Location  $regionName `
  -SkuName Standard_LRS `
  -Kind StorageV2 `
  -EnableHierarchicalNamespace $true 
```


***Creating Synapse Workspace***

```powershell
$password = ConvertTo-SecureString $sqlPassword -AsPlainText -Force
$creds = New-Object System.Management.Automation.PSCredential ($sqlUserName, $password)

New-AzSynapseWorkspace -ResourceGroupName $resourceGroupName `
                        -Name $workspaceName -Location $regionName `
                        -DefaultDataLakeStorageAccountName $storageAccountName `
                        -DefaultDataLakeStorageFilesystem $containerName `
                        -SqlAdministratorLoginCredential $creds 
```

If you want to create the workspace with a Managed workspace Virtual Network, then you need to add extra parameter "ManagedVirtualNetwork" to the script. You can refer the link [Managed Virtual Network Config](/powershell/module/az.synapse/new-azsynapsemanagedvirtualnetworkconfig?view=azps-6.3.0) to know more about the options available.


```powershell
#Creating a managed virtual network configuration
$config = New-AzSynapseManagedVirtualNetworkConfig -PreventDataExfiltration -AllowedAadTenantIdsForLinking ContosoTenantId 

#Creating Synapse Workspace
New-AzSynapseWorkspace -ResourceGroupName $resourceGroupName `
                        -Name $workspaceName -Location $regionName `
                        -DefaultDataLakeStorageAccountName $storageAccountName `
                        -DefaultDataLakeStorageFilesystem $containerName `
                        -SqlAdministratorLoginCredential $creds `
			                  -ManagedVirtualNetwork $config
```


### Azure CLI

Below script creates a resource group, ADLS Gen-2 storage account, File System and then create the Synapse Workspace using Azure CLI.

***Creating Resource Group***

```azurecli
az group create --name $resourceGroupName --location $regionName
```

***Creating ADLS Gen-2 Storage Account***

```azurecli
# Checking if name is not used only then creates it.

$StorageAccountNameAvailable=(az storage account check-name --name $storageAccountName --subscription $subscriptionId | ConvertFrom-Json).nameAvailable

if($StorageAccountNameAvailable)
{
Write-Host "Storage account Name is available to be used...creating storage account"

#Creating ADLS Gen-2 Account
$storgeAccountProvisionStatus=az storage account create `
  --name $storageAccountName `
  --resource-group $resourceGroupName `
  --location $regionName `
  --sku Standard_GRS `
  --kind StorageV2 `
  --enable-hierarchical-namespace $true

($storgeAccountProvisionStatus| ConvertFrom-Json).provisioningState
}
else
{
    Write-Host "Storage account Name is NOT available to be used...use another name --    exiting the script..."
    EXIT
}

#Creating Container in ADLS Gen-2 account

$key=(az storage account keys list -g $resourceGroupName -n $storageAccountName|ConvertFrom-Json)[0].value

$fileShareStatus=(az storage share create --account-name $storageAccountName --name $containerName --account-key $key)

if(($fileShareStatus|ConvertFrom-Json).created -eq "True")
{
      Write-Host f"Successfully created the fileshare - '$containerName'"
}
```


***Creating Synapse Workspace***

```azurecli
az synapse workspace create `
  --name $workspaceName `
  --resource-group $resourceGroupName `
  --storage-account $storageAccountName `
  --file-system $containerName `
  --sql-admin-login-user $sqlUserName `
  --sql-admin-login-password $sqlPassword `
  --location $regionName
```
To enable managed virtual network, include the parameter --enable-managed-virtual-network in the above script.You can refer the link [workspace managed virtual network](/cli/azure/synapse/workspace?view=azure-cli-latest) to know more options.

```azurecli
az synapse workspace create `
  --name $workspaceName `
  --resource-group $resourceGroupName `
  --storage-account $storageAccountName `
  --file-system $FileShareName `
  --sql-admin-login-user $sqlUserName `
  --sql-admin-login-password $sqlPassword `
  --location $regionName `
  --enable-managed-virtual-network true `
  --allowed-tenant-ids "Contoso"
```

## Step 2: Creating Synapse Workspace Firewall Rule 
Once the workspace is created, add the firewall rules for workspace. Restrict the IPs to a certain range. You can add a firewall from Azure portal or using PowerShell/CLI.

### Azure portal
You can select the Firewall options and add the range of IP address as shown in the following screenshot. 
:::image type="icon" source="media/how-to-move-workspace/firewall.png" border="false":::

### Azure PowerShell 
You can run the following PowerShell commands to add Firewall rules by specifying the start and end IP addresses. Update the IP address range as per your requirements.


```powershell
$WorkspaceWeb = (Get-AzSynapseWorkspace -Name $workspaceName -ResourceGroupName $resourceGroup).ConnectivityEndpoints.Web
$WorkspaceDev = (Get-AzSynapseWorkspace -Name $workspaceName -ResourceGroupName $resourceGroup).ConnectivityEndpoints.Dev

# Adding Firewall Rules
$FirewallParams = @{
  WorkspaceName = $workspaceName
  Name = 'Allow Client IP'
  ResourceGroupName = $resourceGroup
  StartIpAddress = "0.0.0.0"
  EndIpAddress = "255.255.255.255"
}
New-AzSynapseFirewallRule @FirewallParams
```

Execute the script below to update the managed identity SQL control settings of the workspace.

```powershell 
Set-AzSynapseManagedIdentitySqlControlSetting -WorkspaceName $workspaceName -Enabled $true 
```

***Azure CLI***


```azurecli
az synapse workspace firewall-rule create --name allowAll --workspace-name $workspaceName  `
--resource-group $resourceGroupName --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255
```
 
We need to execute the script below to update the managed identity SQL control settings of the workspace.

```azurecli
az synapse workspace managed-identity grant-sql-access `
--workspace-name $workspaceName --resource-group $resourceGroupName
```


## Step 3: Creating Spark Pool  

Creating the Spark Pool with the same configuration that is used in source region Workspace.

***Azure Portal***

To create a Spark pool from Azure portal, you can refer to the link
[Quickstart: Create a new serverless Apache Spark pool using the Azure portal](quickstart-create-apache-spark-pool-portal.md)

You can also create the Spark pool using Synapse Studio by following the steps mentioned in the link [Quickstart: Create a serverless Apache Spark pool using Synapse Studio](quickstart-create-apache-spark-pool-studio.md)

***Azure PowerShell***

Following script is creating Spark Pool with two workers and one driver node. Change the values based on  source region workspace Spark Pool.


```powershell
#Creating spark pool with 3 node (2 worker + 1 driver) and small cluster size with 4 cores and 32 Gb RAM 
New-AzSynapseSparkPool `
    -WorkspaceName  $workspaceName `
    -Name $sparkPoolName `
    -NodeCount 3 `
    -SparkVersion $sparkVersion `
    -NodeSize Small
```
 
***Azure CLI***

```azurecli
az synapse spark pool create --name $sparkPoolName --workspace-name $workspaceName --resource-group $resourceGroupName `
--spark-version $sparkVersion --node-count 3 --node-size small
```

## Step 4: Restoring Dedicated SQL Database 

### Restoring from Geo-redundant backups
Follow the steps mentioned in below article to restore the Dedicated SQL Pools from geo-backup using Azure portal and PowerShell.
[Geo-restore a dedicated SQL pool in Azure Synapse Analytics](sql-data-warehouse/sql-data-warehouse-restore-from-geo-backup.md)


### Restoring using restore points of source region workspace Dedicated SQL Pool

Restore the Dedicated SQL Pool to target region workspace using the restore points of source region workspace Dedicated SQL Pool. You can use Azure portal, Synapse Studio, or PowerShell to restore from restore points. If source region is not accessible due to any region, then you cannot restore using this option.

***Synapse Studio*** 

From Synapse studio, you can restore the SQL Pool from any workspace in the subscription using the *Restore Points*. While creating the SQL Pool, under Additional settings, select Restore point and select the workspace as shown in the following screenshot. If you have created a user-defined restore point, then, you can use that to restore the SQL Pool else you can select the latest automatic restore point.

:::image type="content" source="media/how-to-move-workspace/restore-sql-pool.png" alt-text="restore-sql-pool":::


***Azure PowerShell***

You can run the following PowerShell script to restore the workspace. This script is getting the latest restore point from the source workspace dedicated SQL Pool and using the latest restore point to restore the SQL Pool on the target workspace. You should update the Performance level from DW100c to the required value. 

> [!IMPORTANT]
> SQL Pool name should be same on both the workspaces.


```powershell
#Getting the restore points
$restorePoint=Get-AzSynapseSqlPoolRestorePoint -WorkspaceName $sourceRegionWSName -Name $sqlPoolName|Sort-Object  -Property RestorePointCreationDate -Descending `
                                                                                         | SELECT RestorePointCreationDate -ExpandProperty  RestorePointCreationDate -First 1
```
 
 

```powershell
<#
Transform Synapse SQL pool resource ID to SQL database ID because currently the command only accepts the SQL database ID. 
For example: /subscriptions/<SubscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Sql/servers/<WorkspaceName>/databases/<DatabaseName>
#>
$pool = Get-AzSynapseSqlPool -ResourceGroupName $sourceRegionRGName -WorkspaceName $sourcRegionWSName -Name $sqlPoolName
$databaseId = $pool.Id `
    -replace "Microsoft.Synapse", "Microsoft.Sql" `
    -replace "workspaces", "servers" `
	-replace "sqlPools", "databases" 
 

$restoredPool = Restore-AzSynapseSqlPool -FromRestorePoint `
                                         -RestorePoint $restorePoint `
                                         -TargetSqlPoolName $sqlPoolName `
                                         -ResourceGroupName $resourceGroupName `
                                         -WorkspaceName $workspaceName `
                                         -ResourceId $databaseId `
                                         -PerformanceLevel DW100c -AsJob


#Tracks the status of he restore 

Get-Job | Where-Object Command -In ("Restore-AzSynapseSqlPool") | `
Select-Object Id,Command,JobStateInfo,PSBeginTime,PSEndTime,PSJobTypeName,Error |Format-Table
```
Once the dedicated SQL Pool is restored, you need to create all the SQL logins in Azure Synapse Analytics. You can follow the steps mentioned in the link [create-login](/sql/t-sql/statements/create-login-transact-sql?view=azure-sqldw-latest&preserve-view=true)  to create all the logins.

## Step 5: Creating Serverless SQL Pool and Spark SQL Databases and Objects

As of today, you cannot back up and restore Serverless SQL Pool databases and Spark SQL databases. Possible workaround will be:
1.	Create notebook(s) and SQL script(s), which has the code to create all the required Spark SQL, Serverless SQL Pool databases, tables, role, and users with all the role assignments. Check-in these artifacts to Azure DevOps or GitHub.
2.	If Storage Account name is changed, then make sure the code artifacts are pointing to the correct storage account name.
3.	Create pipeline(s), which invokes these code artifacts in a specific sequence. When these pipelines are executed on the target region workspace, the Spark SQL databases, Serverless SQL Pool databases, external data sources, views, roles, and users and permissions will be created on the target region workspace.
4.	When you integrate the source region workspace with Azure DevOps, these code artifacts will be part of the repo. Later you can deploy these code artifacts to target region workspace using DevOps Release pipeline as mentioned in Step 6.  
5.	On the target region workspace, trigger these pipelines manually.


## Step 6: Deploying Artifacts, Pipelines using CI/CD 

 You can follow the steps mentioned in link [Continuous integration and delivery for Azure Synapse workspace](cicd/continuous-integration-deployment.md) to learn how to integrate Synapse workspace with the Azure DevOps or GitHub and how to deploy the artifacts to target region workspace. 

After the workspace is integrated with the Azure DevOps, you will find a branch with a name workspace_publish. This branch contains the workspace template that includes definitions for the artifacts like Notebooks, SQL Scripts, Datasets, Linked Services, Pipelines, Triggers, Spark job definition etc.

Following is the screenshot from the Azure DevOps Repro, which has the workspace template files for all the artifacts and other components.

:::image type="content" source="media/how-to-move-workspace/devops-repo-workspace-publish.png" alt-text="workspace-publish":::

You can use this workspace template to deploy the Artifacts, Pipelines etc., to a workspace using Azure DevOps release pipeline as shown in the following screenshot.
:::image type="content" source="media/how-to-move-workspace/release-pipeline.png" alt-text="synapse-release-pipeline":::

If the workspace is not integrated with GitHub or Azure DevOps, then you will have to manually recreate or write custom PowerShell or Azure CLI scripts to deploy all the artifacts, pipelines, linked services, credentials, triggers, and spark definition on the target region workspace.



> [!NOTE]
> This process requires you to keep updating the pipelines and code artifacts to include any changes made to Spark and Serverless Databases, objects, roles in the source region workspaces.

## Step 7: Creating Shared Integration Runtime (SHIR)
You can follow along the steps mentioned in the link [Create and configure a self-hosted integration runtime](../data-factory/create-self-hosted-integration-runtime.md)  to create a SHIR.

## Step 8: Assigning Azure Role to Managed Identity

 Assign Storage Blob Contributor access to the Managed Identity of the new Workspace on the default attached ADLS Gen-2 account. You should assign access on other storage accounts as well where SA-MI is used for authentication. Any permissions given to individual AAD users and groups should be reassigned to the storage account in the target region.

### Azure portal
You can follow the steps mentioned in the link [Grant permissions to workspace managed identity](security/how-to-grant-workspace-managed-identity-permissions.md) to assign Storage Blob Data Contributor role to managed identity of the workspace.

### Azure PowerShell
Assigning Storage Blob Data Contributor role to managed identity of the workspace.

```powershell

$workSpaceIdentityObjectID= (Get-AzSynapseWorkspace -ResourceGroupName $resourceGroupName -Name $workspaceName).Identity.PrincipalId 
$scope = "/subscriptions/$($subscriptionId)/resourceGroups/$($resourceGroupName)/providers/Microsoft.Storage/storageAccounts/$($storageAccountName)"

# Adding storage blob contributor to WS Managed Identity on Storage Account. This errors out with message New-AzRoleAssignment : Exception of type 'Microsoft.Rest.Azure.CloudException' was thrown.
# But it creates the required permissions on the storage account.
$roleAssignedforManagedIdentity=New-AzRoleAssignment -ObjectId $workSpaceIdentityObjectID `
    -RoleDefinitionName "Storage Blob Data Contributor" `
    -Scope $scope -ErrorAction SilentlyContinue
```


### Azure CLI

```azurecli
# Getting Role name
$roleName =az role definition list --query "[?contains(roleName, 'Storage Blob Data Contributor')].{roleName:roleName}" --output tsv

#Getting resource id for storage account
$scope= (az storage account show --name $storageAccountName|ConvertFrom-Json).id

#Getting principal ID for WS Managed Identity
$workSpaceIdentityObjectID=(az synapse workspace show --name $workspaceName --resource-group $resourceGroupName|ConvertFrom-Json).Identity.PrincipalId 
                    
# Adding Storage Blob Data Contributor Azure role to SA-MI
az role assignment create --assignee $workSpaceIdentityObjectID `
--role $roleName `
--scope $scope
```

## Step 9: Assigning Synapse RBAC Roles
We need to add all the users who would need access to the target workspace with separate roles and permissions. Below PowerShell and CLI script is adding AAD user to the Synapse Administrator role in the target region workspace. 
You get all the Synapse RBAC role names from the link [Synapse RBAC Roles](security/synapse-workspace-synapse-rbac-roles.md).

### Synapse Studio
Use the steps mentioned in the link [How to manage Synapse RBAC role assignments in Synapse Studio](security/how-to-manage-synapse-rbac-role-assignments.md) to add or delete Synapse RBAC assignments from Synapse Studio.


### Azure PowerShell

Below PowerShell script is adding Synapse Administrator role assignment to a AAD user or group. You can use -RoleDefinitionId instead of -RoleDefinitionName to the below command to add the users to the workspace.

```powershell
# Adding Synapse RBAC assignment. use the objectId of the AAD user or group you want to assign.
New-AzSynapseRoleAssignment `
   -WorkspaceName $workspaceName  `
   -RoleDefinitionName "Synapse Administrator" `
   -ObjectId 1c02d2a6-ed3d-46ec-b578-6f36da5819c6

# Check if user is added to the access control by running this command
Get-AzSynapseRoleAssignment -WorkspaceName $workspaceName  
```

You can get the ObjectId's and RoleId's in the source region workspace by running Get-AzSynapseRoleAssignment command. Assign the same Synapse RBAC roles to the AAD users or groups in the target region workspace.

Instead of using -ObjectId as parameter, you can also use -SignInName where you provide email address or the user principal name of the user. You can refer the link [Synapse RBAC](/powershell/module/az.synapse/new-azsynapseroleassignment?view=azps-6.3.0) to know more about the available options. 

### Azure CLI

```azurecli
#Get the Object Id of the user and assign the required Synapse RBAC permissions to the AAD user. You can provide the email address of the user (username@contoso.com) for the --assignee parameter.
az synapse role assignment create `
--workspace-name $workspaceName `
--role "Synapse Administrator" --assignee adasdasdd42-0000-000-xxx-xxxxxxx

az synapse role assignment create `
--workspace-name $workspaceName `
--role "Synapse Contributor" --assignee "user1@contoso.com"

```

You can refer the link [Synapse RBAC](/cli/azure/synapse/role/assignment?view=azure-cli-latest)  to know more about the available options. 

## Step 10: Uploading workspace packages
Upload all required workspace packages to the new workspace. To automate the process of uploading the workspace packages, you can use the below SDK. 

[https://www.nuget.org/packages/Azure.Analytics.Synapse.Artifacts/1.0.0-preview.10](https://www.nuget.org/packages/Azure.Analytics.Synapse.Artifacts/1.0.0-preview.10)

## Step 11: Permissions 	
To set up the access control for the target region Synapse workspace, you can follow the steps mentioned in the link [How to set up access control for your Synapse workspace](security/how-to-set-up-access-control.md). 


## Step 12: Creating managed private endpoints.
Create the managed private endpoints that are created on the source region workspace. Later these connections should be approved.
You can follow the steps mentioned in the link [Create a Managed private endpoint to your data source](security/how-to-create-managed-private-endpoints.md) to create the managed private endpoint.


## Next steps

Learn more about [Managed workspace virtual network](./synapse-workspace-managed-vnet.md).

Learn more about [Managed private endpoints](./synapse-workspace-managed-private-endpoints.md).

Learn more about [Connect to workspace resources from a restricted network](security/how-to-connect-to-workspace-from-restricted-network.md)
