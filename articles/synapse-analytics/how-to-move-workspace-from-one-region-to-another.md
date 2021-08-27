---
title: How-to guide to move Azure Synapse workspace from region to another
description: This article will teach you how to move the Synapse Workspace from one region to another region. 
author: phanir
ms.service: synapse-analytics
ms.subservice: 
ms.topic: how-to
ms.date: 08/16/2021
ms.author: phanir
ms.reviewer: jrasnick
---

# Step-by-Step guide to move an Azure Synapse workspace from one region to another

This document is a step-by-step guide to move an Azure Synapse workspace from one Azure region to another.

> [!NOTE]
> The steps in this document do not actually move the workspace. The steps show you how to create a new workspace in a new region using Synapse dedicated SQL pool backups and artifacts from the source region.


## Prerequisites

- Integrate source region Synapse workspace with Azure DevOps or GitHub, see [Source control in Synapse Studio](cicd/source-control.md)
- [Az PowerShell](/powershell/azure/new-azureps-module-az?view=azps-6.3.0) and [AZ CLI](/cli/azure/install-azure-cli) modules installed on the server where scripts are executed.
- All dependent services, for example Azure Machine Learning, Azure Storage, Private link hubs, need to be recreated in target region or moved to target region if the service supports region move. 
- To move Azure Storage to a different region, see [Move an Azure Storage account to another region](../storage/common/storage-account-move.md)
- dedicated SQL pool name and Spark pool name should be the same in the source region and the target region workspace.


## Scenarios for region move

- **New Compliance Requirements**: Organizations require data and services to be placed in the same region as part of new compliance requirements.
- **Availability of new Azure Region**: Scenarios where new Azure region is available and there are project or business requirements to move the workspace and other Azure  resources to the newly available Azure region.
- **Wrong region selected**: Wrong region was selected at the first place while creating the Azure resources.

## Steps to move Azure Synapse workspace to another region

Moving Azure Synapse workspace from region to another region is a multi-step process. Following are the high-level steps:

1. Create a new Synapse workspace in the target region along with Spark Pool with same configurations as used in source region workspace.
1. Restore dedicated SQL pool to target region using restore points or Geo-Backups.
1. Recreate all required logins on the new logical SQL Server.
1. Creating serverless SQL pool and Spark Pools databases and objects.
1. Adding an Azure DevOps Service Principal to the Synapse role-based access control (RBAC) 'Synapse Artifact Publisher' role if you're using an Azure DevOps release pipeline to deploy the artifacts.
1. Deploying code artifact (SQL Scripts, Notebooks), linked services, pipelines, datasets, Spark Job definitions triggers, credentials from Azure DevOps release pipelines to target region Synapse workspace.
1. Adding Microsoft Azure Active Directory users or groups to Synapse RBAC roles. Granting Storage Blob Contributor access to SA-MI(System Assigned Managed Identity) on Azure Storage and Azure Key Vault if you're authenticating using Managed Identity.
1. Granting  Storage Blob Reader or Storage Blob Contributor roles to required Azure AD users on default attached storage or on Storage Account that has data to be queried using serverless SQL pool.
1. Recreating Self-Hosted Integration runtime. 
1. Manually upload all required libraries and jars in target Synapse workspace.
1. Creating all managed private endpoints if workspace is deployed in a managed VNet.
1. Test the new workspace on target region and update any DNS entries, which are pointing to source region workspace.
1. If there's a private endpoint connection created on the source workspace, then create one on the target region workspace.
1. You can delete the workspace in source region after testing thoroughly and routing all the connections to the target region workspace.



## Step 1: Creating a Synapse workspace in a target region

In this section you'll be creating the Synapse workspace using AZ PowerShell, AZ CLI, and Azure portal. You'll be creating a resource group along with a Microsoft Azure Data Lake Storage Gen2 account that will be used as the default storage for the workspace as part of the PowerShell script and CLI script. You can invoke these PowerShell or CLI scripts from the DevOps release pipeline if you want to automate the process of deployment.

### Azure portal
You can follow along the steps mentioned in the link below to create a workspace from Azure portal.
[Quickstart: Create a Synapse workspace](quickstart-create-workspace.md)

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

$sqlPoolName ="<YourTargetSQLPoolName>" #Both Source and target workspace SQL pool name will be same
$sparkPoolName ="<YourTargetWorkspaceSparkPoolName>"
$sparkVersion="2.4"

New-AzResourceGroup -Name $resourceGroupName -Location $regionName
```

***Creating an Data Lake Storage Gen2 account***

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

If you want to create the workspace with a Managed Virtual Network, you'll need to add the extra parameter "ManagedVirtualNetwork" to the script. You can refer the link [Managed Virtual Network Config](/powershell/module/az.synapse/new-azsynapsemanagedvirtualnetworkconfig?view=azps-6.3.0&preserve-view=true) to learn more about the options available.


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

This Azure CLI script creates a resource group, a Data Lake Storage Gen2 account, a file system and then creates the Synapse workspace.

***Creating a resource group***

```azurecli
az group create --name $resourceGroupName --location $regionName
```

***Creating a Data Lake Storage Gen2 account***

```azurecli
# Checking if name is not used only then creates it.

$StorageAccountNameAvailable=(az storage account check-name --name $storageAccountName --subscription $subscriptionId | ConvertFrom-Json).nameAvailable

if($StorageAccountNameAvailable)
{
Write-Host "Storage account Name is available to be used...creating storage account"

#Creating an Data Lake Storage Gen2 account
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

#Creating a container in a Data Lake Storage Gen2 account

$key=(az storage account keys list -g $resourceGroupName -n $storageAccountName|ConvertFrom-Json)[0].value

$fileShareStatus=(az storage share create --account-name $storageAccountName --name $containerName --account-key $key)

if(($fileShareStatus|ConvertFrom-Json).created -eq "True")
{
      Write-Host f"Successfully created the fileshare - '$containerName'"
}
```


***Creating a Synapse workspace***

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
To enable managed virtual network, include the parameter `--enable-managed-virtual-network` in the above script.You can refer the link [workspace managed virtual network](/cli/azure/synapse/workspace?view=azure-cli-latest&preserve-view=true) to know more options.

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

## Step 2: Creating a Synapse Workspace firewall rule 
Once the workspace is created, add the firewall rules for workspace. Restrict the IPs to a certain range. You can add a firewall from Azure portal or using PowerShell/CLI.

### Azure portal
You can select the Firewall options and add the range of IP address as shown in the following screenshot. 
:::image type="icon" source="media/how-to-move-workspace-from-one-region-to-another/firewall.png" border="false":::


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


## Step 3: Creating an Apache Spark pool  

Creating the Spark pool with the same configuration that is used in source region workspace.

***Azure Portal***

To create a Spark pool from the Azure portal, you can refer to the link 
[Quickstart: Create a new serverless Apache Spark pool using the Azure portal](quickstart-create-apache-spark-pool-portal.md)


You can also create the Spark pool from the Synapse Studio by following the steps mentioned in the link [Quickstart: Create a serverless Apache Spark pool using Synapse Studio](quickstart-create-apache-spark-pool-studio.md)

***Azure PowerShell***

The following script creates a Spark pool with two workers and one driver node. Update the values to match your source region workspace Spark pool.


```powershell
#Creating a Spark pool with 3 node (2 worker + 1 driver) and small cluster size with 4 cores and 32 Gb RAM 
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

## Step 4: Restoring a dedicated SQL pool 

### Restoring from Geo-redundant backups

To restore the dedicated SQL pools from geo-backup using Azure portal and PowerShell see [Geo-restore a dedicated SQL pool in Azure Synapse Analytics](sql-data-warehouse/sql-data-warehouse-restore-from-geo-backup.md)


### Restore using restore points from source region workspace dedicated SQL pool

Restore the dedicated SQL pool to the target region workspace using the restore point of the source region workspace dedicated SQL pool. You can use Azure portal, Synapse Studio, or PowerShell to restore from restore points. If the source region isn't accessible, then you can't restore using this option.

***Synapse Studio*** 

From Synapse studio, you can restore the dedicated SQL pool from any workspace in the subscription using the *Restore Points*. While creating the dedicated SQL pool, under **Additional settings**, select **Restore point** and select the workspace as shown in the following screenshot. If you've created a user-defined restore point, you can use that to restore the SQL pool, otherwise you can select the latest automatic restore point.

:::image type="content" source="media/how-to-move-workspace-from-one-region-to-another/restore-sql-pool.png" alt-text="Restoring SQL pool":::


***Azure PowerShell***

You can run the following PowerShell script to restore the workspace. This script uses the latest restore point from the source workspace dedicated SQL pool to restore the SQL pool on the target workspace. Before running the script, update the performance level from DW100c to the required value. 

> [!IMPORTANT]
> The dedicated SQL pool name should be same on both the workspaces.


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


#Tracks the status of the restore 

Get-Job | Where-Object Command -In ("Restore-AzSynapseSqlPool") | `
Select-Object Id,Command,JobStateInfo,PSBeginTime,PSEndTime,PSJobTypeName,Error |Format-Table
```
Once the dedicated SQL pool is restored, you need to create all the SQL logins in Azure Synapse Analytics. You can follow the steps mentioned in the link [create-login](/sql/t-sql/statements/create-login-transact-sql?view=azure-sqldw-latest&preserve-view=true)  to create all the logins.

## Step 5: Creating serverless SQL pool, Spark pool and objects

You can't back up and restore serverless SQL pool databases and Spark pools. As a possible workaround you could:
1.	Create notebook(s) and SQL script(s), which have the code to recreate all the required Spark pool, serverless SQL pool databases, tables, role, and users with all the role assignments. Check in these artifacts to Azure DevOps or GitHub.
2.	If Storage Account name is changed, then make sure the code artifacts are pointing to the correct storage account name.
3.	Create pipeline(s), which invokes these code artifacts in a specific sequence. When these pipelines are executed on the target region workspace, the Spark SQL databases, serverless SQL pool databases, external data sources, views, roles, and users and permissions will be created on the target region workspace.
4.	When you integrate the source region workspace with Azure DevOps, these code artifacts will be part of the repo. Later you can deploy these code artifacts to target region workspace using DevOps Release pipeline as mentioned in Step 6.  
5.	On the target region workspace, trigger these pipelines manually.


## Step 6: Deploying Artifacts, Pipelines using CI/CD 

 You can follow the steps mentioned in link [Continuous integration and delivery for Azure Synapse workspace](cicd/continuous-integration-deployment.md) to learn how to integrate Synapse workspace with the Azure DevOps or GitHub and how to deploy the artifacts to target region workspace. 

After the workspace is integrated with Azure DevOps, you'll find a branch with a name workspace_publish. This branch contains the workspace template that includes definitions for the artifacts like Notebooks, SQL Scripts, Datasets, Linked Services, Pipelines, Triggers, Spark job definition, and so on.

This screenshot from the Azure DevOps Repro, shows the workspace template files for the artifacts and other components.

:::image type="content" source="media/how-to-move-workspace-from-one-region-to-another/devops-repo-workspace-publish.png" alt-text="workspace-publish":::

You can use the workspace template to deploy the artifacts, pipelines, and so on, to a workspace using Azure DevOps release pipeline as shown in the following screenshot.

:::image type="content" source="media/how-to-move-workspace-from-one-region-to-another/release-pipeline.png" alt-text="synapse-release-pipeline":::


If the workspace isn't integrated with GitHub or Azure DevOps, then you'll have to manually recreate or write custom PowerShell or Azure CLI scripts to deploy all the artifacts, pipelines, linked services, credentials, triggers, and Spark definitions on the target region workspace.



> [!NOTE]
> This process requires you to keep updating the pipelines and code artifacts to include any changes made to Spark and serverless SQL pool, objects, and roles in the source region workspaces.

## Step 7: Create a Shared Integration Runtime (SHIR)
You can follow along the steps mentioned in the link [Create and configure a self-hosted integration runtime](../data-factory/create-self-hosted-integration-runtime.md) to create a SHIR.

## Step 8: Assigning an Azure role to Managed Identity

 Assign `Storage Blob Contributor` access to the Managed Identity of the new workspace on the default attached Data Lake Storage Gen2 account. Also assign access on other storage accounts where SA-MI is used for authentication. Assign `Storage Blob Contributor` or `Storage Blob Reader` access to Azure AD users and group to all the required storage accounts.

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
We need to add all the users who would need access to the target workspace with separate roles and permissions. Below PowerShell and CLI script is adding Azure AD user to the Synapse Administrator role in the target region workspace. 
You can get all the Synapse RBAC role names from the below link.

 [Synapse RBAC Roles](security/synapse-workspace-synapse-rbac-roles.md).

### Synapse Studio
Follow the steps in [How to manage Synapse RBAC role assignments in Synapse Studio](security/how-to-manage-synapse-rbac-role-assignments.md) to add or delete Synapse RBAC assignments from Synapse Studio.


### Azure PowerShell

Below PowerShell script is adding Synapse Administrator role assignment to an Azure AD user or group. You can use -RoleDefinitionId instead of -RoleDefinitionName to the below command to add the users to the workspace.

```powershell
# Add Synapse RBAC assignment. Use the objectId of the Azure AD user or group you want to assign.
New-AzSynapseRoleAssignment `
   -WorkspaceName $workspaceName  `
   -RoleDefinitionName "Synapse Administrator" `
   -ObjectId 1c02d2a6-ed3d-46ec-b578-6f36da5819c6

# Check if user is added to the access control by running this command
Get-AzSynapseRoleAssignment -WorkspaceName $workspaceName  
```

You can get the ObjectId's and RoleId's in the source region workspace by running Get-AzSynapseRoleAssignment command. Assign the same Synapse RBAC roles to the Azure AD users or groups in the target region workspace.

Instead of using -ObjectId as parameter, you can also use -SignInName where you provide email address or the user principal name of the user. You can refer the link [Synapse RBAC - PowerShell Cmdlet](/powershell/module/az.synapse/new-azsynapseroleassignment?view=azps-6.3.0&preserve-view=true) to know more about the available options. 

### Azure CLI

```azurecli
#Get the Object Id of the user and assign the required Synapse RBAC permissions to the Azure AD user. You can provide the email address of the user (username@contoso.com) for the --assignee parameter.
az synapse role assignment create `
--workspace-name $workspaceName `
--role "Synapse Administrator" --assignee adasdasdd42-0000-000-xxx-xxxxxxx

az synapse role assignment create `
--workspace-name $workspaceName `
--role "Synapse Contributor" --assignee "user1@contoso.com"

```

To learn more about available options, see [Synapse RBAC - CLI](/cli/azure/synapse/role/assignment?view=azure-cli-latest&preserve-view=true). 

## Step 10: Upload workspace packages

Upload all required workspace packages to the new workspace. To automate the process of uploading the workspace packages, see the [Microsoft Azure Synapse Analytics Artifacts client library](https://www.nuget.org/packages/Azure.Analytics.Synapse.Artifacts/1.0.0-preview.10)

## Step 11: Permissions 
	
To set up the access control for the target region Synapse workspace, follow the steps in [How to set up access control for your Azure Synapse workspace](security/how-to-set-up-access-control.md). 


## Step 12: Create managed private endpoints

To Recreate the managed private endpoints from the source region workspace in your target region workspace see [Create a Managed private endpoint to your data source](security/how-to-create-managed-private-endpoints.md). 


## Next steps

Learn more about [Azure Synapse Analytics Managed Virtual Network](security/synapse-workspace-managed-vnet.md).

Learn more about [Synapse Managed private endpoints](security/synapse-workspace-managed-private-endpoints.md)

Learn more about [Connect to workspace resources from a restricted network](security/how-to-connect-to-workspace-from-restricted-network.md)
