---
title: Add an artifact repository to your lab in Azure DevTest Labs | Microsoft Docs
description: Learn how to add an artifact repository to your lab in Azure DevTest labs.
services: devtest-lab
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/12/2019
ms.author: spelluru

---
# Add an artifact repository to your lab in DevTest Labs
DevTest Labs allows you to specify an artifact to be added to a VM at the time of creating the VM or after the VM is created. This artifact could be a tool or an application that you want to install on the VM. For more information, see [add an artifact to a VM](devtest-lab-add-vm-with-artifacts.md). Artifacts are defined in a JSON file loaded from a GitHub or VSTS Git repository. The [public artifact repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts), maintained by DevTest Labs, provides many common tools for both Windows and Linux. You can create your own artifact repository with specific tools that aren't available in the public artifact repository. For instructions how to add an artifact repository source using the Azure portal, see [Add a Git artifact repository to a lab](devtest-lab-add-artifact-repo.md).

This article provides information on how to automate the task of adding a custom artifact repository by using Azure Resource Management templates and Azure PowerShell. With these scripts, you can automate the creation of team DevTest Labs instances or automate the addition of a new artifact source to several DevTest Labs instances easily.

## Use Azure portal
While creating a VM, you can add existing artifacts. Each lab includes artifacts from the Public DevTest Labs Artifact Repository as 
well as artifacts that you've created and added to your own Artifact Repository.

* Azure DevTest Labs *artifacts* let you specify *actions* that are performed when the VM is provisioned, such as running Windows PowerShell scripts, running Bash commands, and installing software.
* Artifact *parameters* let you customize the artifact for your particular scenario

To discover how to create artifacts, see the article, [Learn how to author your own artifacts for use with DevTest Labs](devtest-lab-artifact-author.md).

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).
1. Select **All Services**, and then select **DevTest Labs** from the list.
1. From the list of labs, select the lab containing the VM with which you want to work.  
1. Select **My virtual machines**.
1. Select the desired VM.
1. Select **Manage artifacts**. 
1. Select **Apply artifacts**.
1. On the **Apply artifacts** pane, select the artifact you wish to add to the VM.
1. On the **Add artifact** pane, enter the required parameter values and any optional parameters that you need.  
1. Select **Add** to add the artifact and return to the **Apply artifacts** pane.
1. Continue adding artifacts as needed for your VM.
1. Once you've added your artifacts, you can [change the order in which the artifacts are run](#change-the-order-in-which-artifacts-are-run). You can also go back to [view or modify an artifact](#view-or-modify-an-artifact).
1. When you're done adding artifacts, select **Apply**

### Change the order in which artifacts are run
By default, the actions of the artifacts are executed in the order in which they are added to the VM. 
The following steps illustrate how to change the order in which the artifacts are run.

1. At the top of the **Apply artifacts** pane, select the link indicating the number of artifacts that have been added to the VM.
   
    ![Number of artifacts added to VM](./media/devtest-lab-add-vm-with-artifacts/devtestlab-add-artifacts-blade-selected-artifacts.png)
1. On the **Selected artifacts** pane, drag and drop the artifacts into the desired order. **Note:** If you have trouble dragging the artifact, make sure that you are dragging from the left side of the artifact. 
1. Select **OK** when done.  

### View or modify an artifact
The following steps illustrate how to view or modify the parameters of an artifact:

1. At the top of the **Apply artifacts** pane, select the link indicating the number of artifacts that have been added to the VM.
   
    ![Number of artifacts added to VM](./media/devtest-lab-add-vm-with-artifacts/devtestlab-add-artifacts-blade-selected-artifacts.png)
1. On the **Selected artifacts** pane, select the artifact that you want to view or edit.  
1. On the **Add artifact** pane, make any needed changes, and select **OK** to close the **Add artifact** pane.
1. Select **OK** to close the **Selected artifacts** pane.

## Use Azure Resource Manager template
Azure Resource Management (Azure Resource Manager) templates are JSON files that describe resources in Azure that you want to create. For more information about these templates, see [Authoring Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md).

### Template
Gather some basic information such as the artifact display name, repository type, URI to repository, and folder that contains artifacts. This information is gathered using parameters with a few default values to make the template easier to use.

```json
{

	"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"parameters": {
		"labName": {
			"type": "string"
		},
		"artifactRepositoryDisplayName": {
			"type": "string",
			"defaultValue": "Team Repository"
		},
		"artifactRepoUri": {
			"type": "string"
		},
		"artifactRepoBranch": {
			"type": "string",
			"defaultValue": "master"
		},
		"artifactRepoFolder": {
			"type": "string",
			"defaultValue": "Artifacts/"
		},
		"artifactRepoType": {
			"type": "string",
			"allowedValues": ["VsoGit", "GitHub"]
		},
		"artifactRepoSecurityToken": {
			"type": "securestring"
		}
	},
	"variables": {
		"artifactRepositoryName": "[concat('Repo-', uniqueString(subscription().subscriptionId))]"
	},
	"resources": [{
			"apiVersion": "2016-05-15",
			"type": "Microsoft.DevTestLab/labs",
			"name": "[parameters('labName')]",
			"location": "[resourceGroup().location]",
			"resources": [
				{
					"apiVersion": "2016-05-15",
					"name": "[variables('artifactRepositoryName')]",
					"type": "artifactSources",
					"dependsOn": [
						"[resourceId('Microsoft.DevTestLab/labs', parameters('labName'))]"
					],
					"properties": {
						"uri": "[parameters('artifactRepoUri')]",
						"folderPath": "[parameters('artifactRepoFolder')]",
						"branchRef": "[parameters('artifactRepoBranch')]",
						"displayName": "[parameters('artifactRepositoryDisplayName')]",
						"securityToken": "[parameters('artifactRepoSecurityToken')]",
						"sourceType": "[parameters('artifactRepoType')]",
						"status": "Enabled"
					}
				}
			]
		}
	],
	"outputs": {
		"labId": {
			"type": "string",
			"value": "[resourceId('Microsoft.DevTestLab/labs', parameters('labName'))]"
		}
	}
}
```

The template creates a DevTest Labs instance, if it does not exist already. Then, an artifact repository is created, if it doesn’t exist already. This template creates an internal name for the lab automatically using the uniqueString function, but you can modify the script to explicitly set the artifact repository source name, which is the identifier. The template returns the resourceId for the lab that has been modified or created.

### Required parameters
Most of the parameters do have smart defaults, but there are a few values that must be specified. You must specify the lab name, artifact repository URI, and the artifact repository security token. For instructions to get the security token, see [Add a Git artifact repository to a lab](devtest-lab-add-artifact-repo.md). For **GitHub**, go to personal **Settings**, choose **Personal access token** under the **Developer settings** menu on the left and click the **Generate new token** button. For **VSO Git**, select **Security** in the dropdown under your user name, and click the **Add** button on the **Personal access tokens** page.

```json
{
	"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
	"contentVersion": "1.0.0.0",
	"parameters": {
		"labName": {
			"value": "MyLab1"
		},
		"artifactRepoUri": {
			"value": "https://MyProject1.visualstudio.com/DefaultCollection/_git/TeamArtifacts"
		},
		"artifactRepoType": {
			"value": "VsoGit"
		},
		"artifactRepoSecurityToken": {
			"value": "1111111111111111111111111111111111111"
		}
	}
}
```

### Deploy the template
There are a few ways to deploy the template to Azure and have the resource created, if it doesn’t exist, or updated, if it does exist. For details, see the following articles:

- [Deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/resource-group-template-deploy.md)
- [Deploy resources with Resource Manager templates and Azure CLI](../azure-resource-manager/resource-group-template-deploy-cli.md)
- [Deploy resources with Resource Manager templates and Azure portal](../azure-resource-manager/resource-group-template-deploy-portal)
- [Deploy resources with Resource Manager templates and Resource Manager REST API](../azure-resource-manager/resource-group-template-deploy-rest.md)

Let’s go ahead and see how to deploy the template in PowerShell. Cmdlets used to deploy the template are context-specific, so current tenant and current subscription are used. Use [Set-AzureRMContext](/powershell/module/azurerm.profile/set-azurermcontext?view=azurermps-6.13.0) before deploying the template, if needed, to change context.

First, create a resource group using [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup?view=azurermps-6.13.0). If the resource group you want to use already exists, skip this step.

```powershell
New-AzureRmResourceGroup -Name MyLabResourceGroup1 -Location westus
```

Next, create a deployment to the resource group using [New-AzureRmResourceGroupDeployment](/powershell/module/azurerm.resources/new-azurermresourcegroupdeployment?view=azurermps-6.13.0). This cmdlet applies the resource changes to Azure. Several resource deployments can be made to any given resource group. If you are deploying several times to the same resource group, make sure the name of each deployment is unique.

```powershell
New-AzureRmResourceGroupDeployment `
    -Name MyLabResourceGroup-Deployment1 `
    -ResourceGroupName MyLabResourceGroup1 `
    -TemplateFile azuredeploy.json `
    -TemplateParameterFile azuredeploy.parameters.json
```

After New-AzureRmResourceGroupDeployment run successfully, the command outputs important information like the provisioning state (should be succeeded) and any outputs for the template.
 
## Use Azure PowerShell 
Another way to add an Artifact Repository source is to use Azure PowerShell cmdlets. The script we are going to write requires Azure PowerShell. See [How to install and configure Azure PowerShell](/powershell/azure/overview?view=azps-1.2.0) for detailed instructions.

The goal of the script is to gather all the information necessary to create a new artifact repository for a specified lab and then create that repository. Let’s take it one step at a time.

1.	Gather the information needed to identify the lab.
2.	Gather the information needed to create the artifact repository.
3.	Get the resource for the lab. We will need further information from the lab to complete our task.
4.	Prepare properties to be used in New-AzureRMResource. Each set of properties passed to New-AzureRMResource is specific to the type of resource being created.
5.	Use New-AzureRMResource to create new instance of DevTest Labs.


### Gather artifact repository Information
Gathering the information for the artifact requires us to simply ask the user for this information. See the parameter block below.

```powershell
<#

.SYNOPSIS
This script creates a new custom repository and adds it to an existing DevTest Lab.

.PARAMETER LabName
The name of the lab.

.PARAMETER LabResourceGroupName
The name of the resource group that contains the lab. 

.PARAMETER ArtifactRepositoryName
Name for the new artifact repository.
Script creates a random name for the respository if it is not specified.

.PARAMETER ArtifactRepositoryDisplayName
Display name for the artifact repository.
This is the name that shows up in the Azure portal (https://portal.azure.com) when viewing all the artifact repositories for a lab.

.PARAMETER RepositoryUri
Uri to the repository.

.PARAMETER RepositoryBranch
Branch in which artifact files can be found. Defaults to 'master'.

.PARAMETER FolderPath
Folder under which artifacts can be found. Defaults to 'Artifacts/'

.PARAMETER PersonalAccessToken
Security token for access to GitHub or VSOGit repository.
See https://azure.microsoft.com/en-us/documentation/articles/devtest-lab-add-artifact-repo/ for instructions to get personal access token

.PARAMETER SourceType
Whether artifact is VSOGit or GitHub repository.

.EXAMPLE
Set-AzureRMContext -SubscriptionId 11111111-1111-1111-1111-111111111111
.\New-DevTestLabArtifactRepository.ps1 -LabName "mydevtestlab" -LabResourceGroupName "mydtlrg" -ArtifactRepositoryName "MyTeam Repository" -RepositoryUri "https://github.com/<myteam>/<nameofrepo>.git" -PersonalAccessToken "1111...." -SourceType "GitHub"

.NOTES
Script uses the current AzureRm context. To set the context, use the Set-AzureRMContext cmdlet

#>

 
[CmdletBinding()]
Param(

    [Parameter(Mandatory=$true)]
    $LabName,

    [Parameter(Mandatory=$true)]
    $LabResourceGroupName,
    $ArtifactRepositoryName,
    $ArtifactRepositoryDisplayName  = 'Team Artifact Repository',

    [Parameter(Mandatory=$true)]
    $RepositoryUri,
    $RepositoryBranch = 'master',
    $FolderPath = '/Artifacts',
    
    [Parameter(Mandatory=$true)]
    $PersonalAccessToken ,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet('VsoGit', 'GitHub')]
    $SourceType
)
```

As you can see, you need to know the DevTest Labs name, resource group for the lab, repository display name, repository URI, branch, and personal access token. These properties are the same as seen in the Azure portal when creating a new artifact repository. Instructions for obtaining the values for repository URI and personal access token can be found in [Add a Git artifact repository to a lab](devtest-lab-add-artifact-repo.md).

The type of repository that is used must also be specified. VsoGit or GitHub are the only accepted values.

The repository itself need an internal name for identification, which is different that the display name that is seen in the Azure portal. You won’t see the internal name using the Azure portal, but you see it when using Azure REST APIs or AzureRM PowerShell Cmdlets. The script provides a name, if one is not specified by the user of our script.

```powershell
#Set artifact repository name, if not set by user
if ($ArtifactRepositoryName -eq $null){
    $ArtifactRepositoryName = "PrivateRepo" + (Get-Random -Maximum 999)
}

### Get the resource for the Lab
Since the artifact repository is a child resource of the lab, we are going to need more information about the lab itself when creating the artifact repository. This includes the resource name (i.e. lab name) and resource group name for the lab and the location of the lab. The easiest way to do this is use [Get-AzureRMResource](/powershell/module/azurerm.resources/get-azurermresource?view=azurermps-6.13.0) cmdlet as we have done in the following script.

```powershell
#Get Lab Resource
$LabResource = Get-AzureRmResource -ResourceType 'Microsoft.DevTestLab/labs' -ResourceName $LabName -ResourceGroupName $LabResourceGroupName
```
It's easier to get the lab information if you know the resource group name and lab name with in the subscription. If you don't have these details, use [Find-AzureRMResource](/powershell/module/azurerm.resources/find-azurermresource?view=azurermps-5.7.0).

```powershell
Find-AzureRmResource -ResourceType 'Microsoft.DevTestLab/labs' -ResourceNameContains $LabName
```


### Prepare properties for resource creation
You need to provide a set of properties for the repository to be successfully created. This is just a hash table of values we previously gathered. Each set of properties is unique for the type of resource being created.

```powershell
#Prepare properties object for call to New-AzureRMResource
$propertiesObject = @{
    uri = $RepositoryUri;
    folderPath = $FolderPath;
    branchRef = $RepositoryBranch;
    displayName = $ArtifactRepositoryDisplayName;
    securityToken = $PersonalAccessToken;
    sourceType = $SourceType;
    status = 'Enabled'
}
```

### Create repository using New-AzureRMResource
There is no specific command for adding artifact repositories. The generic [New-AzureRMResource](/powershell/module/azurerm.resources/new-azurermresource?view=azurermps-5.7.0) cmdlet does the job. This cmdlet needs either the **ResourceId** or the **ResourceName** and **ResourceType** pair to know which type of resource to create. This sample script uses the resource name and resource type pair.

The script adds a new resource to the current subscription. Use [Get-AzureRMContext](/powershell/module/azurerm.profile/get-azurermcontext?view=azurermps-6.13.0) to see this information. Use [Set-AzureRMContext](/powershell/module/azurerm.profile/set-azurermcontext?view=azurermps-6.13.0) to set the current tenant and subscription.

The best way to discover the resource name and resource type information is to use the [Test Drive Azure REST APIs](https://azure.github.io/projects/apis/) website. Check out the [DevTest Labs – 2016-05-15](http://aka.ms/dtlrestapis) provider to see the available REST APIs for the DevTest Labs provider. The script users the following resource ID. 

```powershell
"/subscriptions/$SubscriptionId/resourceGroups/$($LabResource.ResourceGroupName)/providers/Microsoft.DevTestLab/labs/$LabName/artifactSources/$ArtifactRepositoryName"
```
 
The resource type is everything listed after ‘providers’ in the URI, except for items listed in the curly brackets. The resource name is everything seen in the curly brackets. If more than one item is expected for the resource name, separate each item with a slash as we have done. 

```powershell
$resourcetype = 'Microsoft.DevTestLab/labs/artifactSources'
$resourceName = $LabName + '/' + $ArtifactRepositoryName
```

Call [New-AzureRMResource](/powershell/module/azurerm.resources/new-azurermresource?view=azurermps-6.13.0) to create the new artifact repository. Notice that you are creating the artifact repository source in the same location and under the same resource group as the lab.

```powershell
$result = New-AzureRmResource -Location $LabResource.Location `
                        -ResourceGroupName $LabResource.ResourceGroupName `
                        -properties $propertiesObject -ResourceType $resourcetype `
                        -ResourceName $resourceName -ApiVersion 2016-05-15 -Force
```

### Full script
Here is the full script, including some verbose messages and comments:

**New-DevTestLabArtifactRepository.ps1**:

```powershell

<#

.SYNOPSIS
This script creates a new custom repository and adds it to an existing DevTest Lab.

.PARAMETER LabName
The name of the lab.

.PARAMETER LabResourceGroupName
The name of the resource group that contains the lab. 

.PARAMETER ArtifactRepositoryName
Name for the new artifact repository.
Script creates a random name for the respository if it is not specified.

.PARAMETER ArtifactRepositoryDisplayName
Display name for the artifact repository.
This is the name that shows up in the Azure portal (https://portal.azure.com) when viewing all the artifact repositories for a lab.

.PARAMETER RepositoryUri
Uri to the repository.

.PARAMETER RepositoryBranch
Branch in which artifact files can be found. Defaults to 'master'.

.PARAMETER FolderPath
Folder under which artifacts can be found. Defaults to 'Artifacts/'

.PARAMETER PersonalAccessToken
Security token for access to GitHub or VSOGit repository.
See https://azure.microsoft.com/en-us/documentation/articles/devtest-lab-add-artifact-repo/ for instructions to get personal access token

.PARAMETER SourceType
Whether artifact is VSOGit or GitHub repository.

.EXAMPLE
Set-AzureRMContext -SubscriptionId 11111111-1111-1111-1111-111111111111
.\New-DevTestLabArtifactRepository.ps1 -LabName "mydevtestlab" -LabResourceGroupName "mydtlrg" -ArtifactRepositoryName "MyTeam Repository" -RepositoryUri "https://github.com/<myteam>/<nameofrepo>.git" -PersonalAccessToken "1111...." -SourceType "GitHub"

.NOTES
Script uses the current AzureRm context. To set the context, use the Set-AzureRMContext cmdlet

#>

 
[CmdletBinding()]
Param(

    [Parameter(Mandatory=$true)]
    $LabName,

    [Parameter(Mandatory=$true)]
    $LabResourceGroupName,
    $ArtifactRepositoryName,
    $ArtifactRepositoryDisplayName  = 'Team Artifact Repository',

    [Parameter(Mandatory=$true)]
    $RepositoryUri,
    $RepositoryBranch = 'master',
    $FolderPath = '/Artifacts',
    
    [Parameter(Mandatory=$true)]
    $PersonalAccessToken ,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet('VsoGit', 'GitHub')]
    $SourceType
)


#Set artifact repository internal name,
# if not set by user.

if ($ArtifactRepositoryName -eq $null){
    $ArtifactRepositoryName = "PrivateRepo" + (Get-Random -Maximum 999)
}

# Sign in to Azure
Connect-AzureRmAccount


#Get Lab Resource
$LabResource = Get-AzureRmResource -ResourceType 'Microsoft.DevTestLab/labs' -ResourceName $LabName -ResourceGroupName $LabResourceGroupName

Write-Verbose "Lab Name: $($LabResource.Name)"
Write-Verbose "Lab Resource Group Name: $($LabResource.ResourceGroupName)"
Write-Verbose "Lab Resource Location: $($LabResource.Location)"

Write-Verbose "Artifact Repository Internal Name: $ArtifactRepositoryName"

#Prepare properties object for call to New-AzureRMResource
$propertiesObject = @{
    uri = $RepositoryUri;
    folderPath = $FolderPath;
    branchRef = $RepositoryBranch;
    displayName = $ArtifactRepositoryDisplayName;
    securityToken = $PersonalAccessToken;
    sourceType = $SourceType;
    status = 'Enabled'
}

Write-Verbose @"Properties to be passed to New-AzureRMResource:$($propertiesObject | Out-String)"@

#Resource will be added to current subscription.
$resourcetype = 'Microsoft.DevTestLab/labs/artifactSources'
$resourceName = $LabName + '/' + $ArtifactRepositoryName
Write-Verbose "AzureRM ResourceType: $resourcetype"
Write-Verbose "AzureRM ResourceName: $resourceName"
 
Write-Verbose "Creating artifact repository '$ArtifactRepositoryDisplayName'..."
$result = New-AzureRmResource -Location $LabResource.Location -ResourceGroupName $LabResource.ResourceGroupName -properties $propertiesObject -ResourceType $resourcetype -ResourceName $resourceName -ApiVersion 2016-05-15 -Force


#Alternate implementation:
# Use resourceId rather than resourcetype and resourcename parameters.
# Using resourceId allows you to specify the $SubscriptionId rather than using the
# subscription id of Get-AzureRmContext.
#$resourceId = "/subscriptions/$SubscriptionId/resourceGroups/$($LabResource.ResourceGroupName)/providers/Microsoft.DevTestLab/labs/$LabName/artifactSources/$ArtifactRepositoryName"
#$result = New-AzureRmResource -properties $propertiesObject -ResourceId $resourceId -ApiVersion 2016-05-15 -Force


# Check the result
if ($result.Properties.ProvisioningState -eq "Succeeded") {
    Write-Verbose ("Successfully added artifact repository source '$ArtifactRepositoryDisplayName'")
}
else {
    Write-Error ("Error adding artifact repository source '$ArtifactRepositoryDisplayName'")
}

#Return the newly created resource so it may be used in subsequent scripts
return $result
```

Go ahead and give it a try! Using the script requires just a few mandatory parameters. Example below shows what needs to be done using a newly opened Azure PowerShell window.

```powershell
Set-AzureRMContext -SubscriptionId 11111111-1111-1111-1111-111111111111
.\New-DevTestLabArtifactRepository.ps1 -LabName "mydevtestlab" -LabResourceGroupName "mydtlrg" -ArtifactRepositoryName "MyTeam Repository" -RepositoryUri "https://github.com/<myteam>/<nameofrepo>.git" -PersonalAccessToken "1111...." -SourceType "GitHub"
```

## Next steps
* Learn how to [add a Git artifact repository to a lab](devtest-lab-add-artifact-repo.md).

