---
title: "Manage Azure Service Group membership at scale" 
description: "Learn how to create, manage, and update membership for Azure Service Groups at scale"
author: kenieva
ms.author: kenieva
ms.service: azure-policy 
ms.topic: how-to
ms.date: 10/28/2025

---

# Manage Azure Service Group Membership at scale

Azure **Service Groups** provide a flexible way to organize and manage resources. Memberships within a Service Group are represented as extension resource of type 'Microsoft.Relationship/serviceGroupMember'. These extension resources follow the lifecycle of the associated member resource and reference the target Service Group through the `targetId` property. To explore this further or create a Service Group member, review the [available REST APIs](./manage-service-groups.md#create-a-service-group-member) and the [QuickStart guide for adding members in the portal](./create-service-group-member-portal.md).

Memberships can be managed individually or at scale. By automating membership management through code and deploying Service Groups with predefined memberships, organizations can streamline scenarios that depend on Service Groups. This guide provides a starting point to ease membership management across one or multiple Service Groups.

## Sample consolidated template for creating Service Group and Members 

Organizations that manage resource lifecycles using a CI/CD approach can couple service group and membership creation within the same deployment template. The following Bicep template deploys two storage accounts, creates a new service group, and adds the storage accounts as members of that group.

>[!Note]
> To run this template, the user must have [Service Group Administrator role](../../role-based-access-control/built-in-roles/management-and-governance.md) on the parent Service Group and have storage account creation permissions at the desired scope. 

```bicep 
param serviceGroupId string = 'SGID'
param parentServiceGroupId string = 'SGParent'
//Must be owner on parentServiceGroupId to run this bicep successfully in one run
param storageCount int = 2

resource storage 'Microsoft.Storage/storageAccounts@2022-09-01' =  [for i in range(0, storageCount): {
  name: '${serviceGroupId}num${i}'
  location: 'eastus2'
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
  properties: {
    allowSharedKeyAccess: false
  }
}]


resource sg1 'Microsoft.Management/serviceGroups@2024-02-01-preview' = {
  scope: tenant()
  name: serviceGroupId
  properties: {
    displayName: serviceGroupId
    parent: {
      resourceId: '/providers/Microsoft.Management/serviceGroups/${parentServiceGroupId}'
    }
  }
}

resource rel0 'Microsoft.Relationships/serviceGroupMember@2023-09-01-preview' = [for i in range(0, storageCount): {
  scope: storage[i]
  name: 'rel-${i}'
  properties: {
    targetId: sg1.id
  }
}]

```
 

## Using Azure Policy for automatic membership 

Service Group membership can be defined by a rule. Common examples are resources following a naming convention that contains `appCode` or resource having a tag with a specific `costCode` values. 

To automate the creation of service group membership, you can define an **Azure Policy definition** that can deploy the Service Group memberships relationships based on the rule. 

>[!Note]
> Azure Policy will not delete relationships for resources that do not meet the rule. 

```json 
{
  "properties": {
    "displayName": "Deploy Memberships for Tagged Resources",
    "policyType": "Custom",
    "mode": "Indexed",
    "description": "Deploy Microsoft.Relationships/serviceGroupMember for resources with specific tag.",
    "parameters": {
      "tagName": {
        "type": "String",
        "metadata": {
          "description": "Name of the tag to check."
        }
      },
      "tagValue": {
        "type": "String",
        "metadata": {
          "description": "Value of the tag to match."
        }
      }
    },
    "policyRule": {
      "if": {
        "allOf": [
          {
            "field": "[concat('tags[', parameters('tagName'), ']')]",
            "equals": "[parameters('tagValue')]"
          }
        ]
      },
      "then": {
        "effect": "deployIfNotExists",
        "details": {
          "type": "Microsoft.Relationships/serviceGroupMember",
          "roleDefinitionIds": [
            "/providers/Microsoft.Management/serviceGroups/{Insert SG ID}/providers/Microsoft.Authorization/roleDefinitions/32e6a4ec-6095-4e37-b54b-12aa350ba81f",
			"/subscriptions/{Insert Subscription}/providers/Microsoft.Authorization/roleDefinitions/05b1aaf9-00c9-477b-b0e8-2da660b78c51"
          ],
          "deployment": {
            "properties": {
              "mode": "incremental",
              "template": {
                "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
                "contentVersion": "1.0.0.0",
				"parameters": {
					"fullName": {
					  "type": "string"
					},
					"fullType": {
					  "type": "string"
					}
				  },
                "resources": [
                  {
                    "type": "Microsoft.Relationships/serviceGroupMember",
                    "apiVersion": "2023-09-01-preview",
                    "name": "[concat('sgm-', parameters('fullName'))]",
                    "scope": "[resourceId(subscription().subscriptionId, resourceGroup().name, parameters('fullType'), parameters('fullName'))]",
                    "properties": {
                      "targetId": "/providers/Microsoft.Management/serviceGroups/{SG-ID}",
                      "targetTenant": "{TenantID}"
                    }
                  }
                ]
              },
			  "parameters": {
				  "fullName": {
					"value": "[field('name')]"
				  },
				  "fullType": {
					"value": "[field('type')]"
				  }
				}
            }
          }
        }
      }
    }
  }
}
```


## Creating memberships based on a Resource Graph query 

Service Group memberships can be created in bulk using results from an Azure Resource Graph (ARG) query. For example, resources required for a job to be done may need to be grouped together, and these resources can be detected using ARG.

The example below groups storage accounts that need to enable soft delete. The script first runs an ARG query to select the storage accounts that should become members of the Service Group based on their tag values. Then it loops through each resource identified in the query and deploys a 'Microsoft.Relationships/serviceGroupMember' to represent the membership.

>[!Note]
> This is an example powershell command on how to use a Resource Group query to create Service Groups members for that point in time. 

```ps1
# Requires -Modules Az.ResourceGraph

<#
.SYNOPSIS
    This script deploys service group members to resources in Azure based on a query that checks for a specified tag.

.DESCRIPTION
    This script uses Az.ResourceGraph to query resources with a specific tag across a given subscription and tenant.
    It then deploys a service group member relationship for each of these resources using an ARM template.
    The user must have owner permissions on the Service Group to add members.

    This script can bring in resource from different subscriptions if they exist in the same tenant.
    However the user will be prompted to login to each subscription the resources exist in.
.PARAMETER TagName
    The name of the tag to filter resources.

.PARAMETER subscriptionId
    The ID of the subscription to login. This parameter is only used to authenticate with
    Connect-AzAccount.
    Resources from other subscriptions in the same tenant will also be found.

.PARAMETER tenantId
    The ID of the tenant to filter resources.

.PARAMETER ServiceGroupId
    The ID of the service group to which the members will be added.
    Description of what this parameter does.
    Repeat for each parameter.

.EXAMPLE
    PS> .\New-ServiceGroupMembershipFromTags.ps1 -TagName "Environment" -tenantId "MyTenant" -subscription "MySub" -ServiceGroupId "MyServiceGroup"
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$TagName,  # [INPUT HERE] Tag name to filter resources

    [Parameter(Mandatory = $true)]
    [string]$subscription,  # [INPUT HERE] Subscription ID or name to login

    [Parameter(Mandatory = $true)]
    [string]$tenantId,  # [INPUT HERE] Tenant ID to filter resources

    [Parameter(Mandatory = $true)]
    [string]$ServiceGroupId  # [INPUT HERE] Service Group ID
)

# Authenticate
Connect-AzAccount -TenantId $tenantId -Subscription $subscription

# Query ARG for resources with the specified tag
# This should find anything with the tag, under any subscription in the tenant
# This query can be updated to the desired scenario

$query = @"
Resources
| where isnotnull(tags['$TagName'])
"@

$resources = Search-AzGraph -UseTenantScope -Query $query

if ($resources.Count -eq 0) {
    Write-Host "No resources found with tag '$TagName'."
    exit
}

Write-Host "Found $($resources.Count) resources with tag '$TagName'."
Write-Host "Resources: $($resources | Format-Table | Out-String)"

$i = 0
$lastSubscriptionId = (Get-AzContext).Subscription.id
foreach ($resource in $resources) {
    $resourceId = $resource.id
    $resourceSubscriptionId = $resource.subscriptionId
    $resourceGroup = $resource.resourceGroup

    Write-Host "Deploying serviceGroupMember for resource: $($resource.name) of type $($resource.type) in subscription: $resourceSubscriptionId in resource group: $resourceGroup"

    # ARM template
    $template = @"
    {
      "`$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "resources": [
        {
          "type": "Microsoft.Relationships/serviceGroupMember",
          "scope": "$resourceId",
          "apiVersion": "2023-09-01-preview",
          "name": "$ServiceGroupId-relation-$i",
          "properties": {
            "targetId": "/providers/Microsoft.Management/serviceGroups/$ServiceGroupId"
          }
        }
      ]
    }
"@
    $i++
    Write-Host "Using template: $template"

    # Save template to temporary file
    # Using temp files to keep it Powershell 5 compatible
    # Using -TemplateBody with `ConvertTo-Json -AsHashtable` requires powershell 6
    $tempFile = [System.IO.Path]::GetTempFileName() + ".json"

    # Deploy template
    try {
        $template | Out-File -FilePath $tempFile -Encoding utf8

        # Change subscription if needed.
        if ($lastSubscriptionId -ne $resourceSubscriptionId) {
            Write-Host "Switching to subscription: $resourceSubscriptionId"
            Connect-AzAccount -SubscriptionId $resourceSubscriptionId -WarningAction Ignore
            $lastSubscriptionId = $resourceSubscriptionId
            Get-AzContext
        }

        New-AzResourceGroupDeployment `
            -ResourceGroupName $resourceGroup `
            -TemplateFile $tempFile `
            -Mode Incremental

        Write-Host "Successfully deployed serviceGroupMember for $($resource.name)."
    }
    catch {
      Write-Warning "Failed to deploy for $($resource.name): $_"
    }
    finally {
        # Clean up temp file
        if (Test-Path $tempFile) {
            Remove-Item $tempFile
        }
    }
}
```

The parameter `$query` can be updated to the desired query. Here is an example response: 

```txt
PS C:\> .\src\New-ServiceGroupMembershipFromTags.ps1 -TagName "TagName" -tenantId "XXXXXXXXXXXXXX" -ServiceGroupId "XXXXXXXX" -Subscription "XXXXXXXXXXXX"
Please select the account you want to login with.

Retrieving subscriptions for the selection...

Found 4 resources with tag 'TagName'.
Resources:
id                                                                                                                                              name                 type
--                                                                                                                                              ----                 ----
/subscriptions/{subID}/resourceGroups/{RGName}/providers/Microsoft.Storage/storageAccounts/storageAcccountnum1 storageAccountnum1 microsoft....
/subscriptions/{subID}/resourceGroups/{RGName}/providers/Microsoft.Storage/storageAccounts/storageAcccountnum2 storageAccountnum2 microsoft....
/subscriptions/{subID}/resourceGroups/{RGName}/providers/Microsoft.Storage/storageAccounts/storageAcccountnum3 storageAcccountnum3 microsoft....
/subscriptions/{subID}/resourceGroups/{RGName}/providers/Microsoft.Storage/storageAccounts/storageAccountnum4 storageAccountnum4 microsoft....



Deploying serviceGroupMember for resource: storageAcccountnum1 of type microsoft.storage/storageaccounts in subscription: XXXXXXXXXXXXXXXXX in resource group: XXXXXXXXXXXXX
Using template:     {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "resources": [
        {
          "type": "Microsoft.Relationships/serviceGroupMember",
          "scope": "/subscriptions/{subID}/resourceGroups/{RGName}/providers/Microsoft.Storage/storageAccounts/storageAcccountnum1",
          "apiVersion": "2023-09-01-preview",
          "name": "sgm-0",
          "properties": {
            "targetId": "/providers/Microsoft.Management/serviceGroups/XXXXXXXXXXXXX"
          }
        }
      ]
    }
Subscription name        Tenant
-----------------        ------
{subscription name}      {Tenant Name}

ResourceGroupName       : RG Name
OnErrorDeployment       :
DeploymentName          : tmp9832.tmp
CorrelationId           : 123456
ProvisioningState       : Succeeded
Timestamp               : 10/30/2025 8:44:18 PM
Mode                    : Incremental
TemplateLink            :
TemplateLinkString      :
DeploymentDebugLogLevel :
Parameters              :
Tags                    :
ParametersString        :
Outputs                 :
OutputsString           :

Successfully deployed serviceGroupMember for storageAcccountnum1.
Deploying serviceGroupMember for resource: storageAcccountnum2 of type microsoft.storage/storageaccounts in subscription: XXXXXXXXXX in resource group: RGName
Using template:     {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "resources": [
        {
          "type": "Microsoft.Relationships/serviceGroupMember",
          "scope": "/subscriptions/{subID}/resourceGroups/{RGName}/providers/Microsoft.Storage/storageAccounts/storageAcccountnum2",
          "apiVersion": "2023-09-01-preview",
          "name": "sgm-1",
          "properties": {
            "targetId": "/providers/Microsoft.Management/serviceGroups/XXXXXXXXXX"
          }
        }
      ]
    }

ResourceGroupName       : RGName
OnErrorDeployment       :
DeploymentName          : tmpF70C.tmp
CorrelationId           : 1234567
ProvisioningState       : Succeeded
Timestamp               : 10/30/2025 8:44:41 PM
Mode                    : Incremental
TemplateLink            :
TemplateLinkString      :
DeploymentDebugLogLevel :
Parameters              :
Tags                    :
ParametersString        :
Outputs                 :
OutputsString           :

Successfully deployed serviceGroupMember for storageAcccountnum2.
Deploying serviceGroupMember for resource: storageAcccountnum3 of type microsoft.storage/storageaccounts in subscription: XXXXXXXXXXXX in resource group: RGName
Using template:     {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "resources": [
        {
          "type": "Microsoft.Relationships/serviceGroupMember",
          "scope": "/subscriptions/XXXXXXXXXXXXXX/resourceGroups/{RGName}/providers/Microsoft.Storage/storageAccounts/storageAcccountnum3",
          "apiVersion": "2023-09-01-preview",
          "name": "sgm-2",
          "properties": {
            "targetId": "/providers/Microsoft.Management/serviceGroups/XXXXXXXXXXX"
          }
        }
      ]
    }
Switching to subscription: XXXXXXXXXXXXX
Please select the account you want to login with.

Retrieving subscriptions for the selection...
Subscription Name Microsoft

Name               : Subscription Name (SubID) - Tenant ID - User ID
Subscription       : XXXXXXXXXXXXXXXX
Account            : user@microsoft.com
Environment        : AzureCloud
Tenant             : XXXXXXXXXXXXXXXX
TokenCache         :
VersionProfile     :
ExtendedProperties : {}


ResourceGroupName       : RGName
OnErrorDeployment       :
DeploymentName          : tmp55E7.tmp
CorrelationId           : 12345678
ProvisioningState       : Succeeded
Timestamp               : 10/30/2025 8:51:43 PM
Mode                    : Incremental
TemplateLink            :
TemplateLinkString      :
DeploymentDebugLogLevel :
Parameters              :
Tags                    :
ParametersString        :
Outputs                 :
OutputsString           :

Successfully deployed serviceGroupMember for storageAcccountnum3.
Deploying serviceGroupMember for resource: storageAcccountnum4 of type microsoft.storage/storageaccounts in subscription: XXXXXXXXXXX in resource group: RGName
Using template:     {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "resources": [
        {
          "type": "Microsoft.Relationships/serviceGroupMember",
          "scope": "/subscriptions/XXXXXXXXXXXXXX/resourceGroups/{RGName}/providers/Microsoft.Storage/storageAccounts/storageAcccountnum4",
          "apiVersion": "2023-09-01-preview",
          "name": "sgm-3",
          "properties": {
            "targetId": "/providers/Microsoft.Management/serviceGroups/XXXXXXXXXXXXX"
          }
        }
      ]
    }

ResourceGroupName       : RGName
OnErrorDeployment       :
DeploymentName          : tmpBB4C.tmp
CorrelationId           : 123456789
ProvisioningState       : Succeeded
Timestamp               : 10/30/2025 8:52:03 PM
Mode                    : Incremental
TemplateLink            :
TemplateLinkString      :
DeploymentDebugLogLevel :
Parameters              :
Tags                    :
ParametersString        :
Outputs                 :
OutputsString           :

Successfully deployed serviceGroupMember for storageAcccountnum4.
```

## Related content
* [What are Azure Service Groups?](overview.md)
* [Review available rest APIs for Service Group Members](manage-service-groups.md#create-a-service-group-member)
* [Quickstart: Create a service group (preview) with REST API](create-service-group-rest-api.md)
* [Quickstart: Connect resources or resource containers to service groups with Service Group Member Relationships](create-service-group-member-rest-api.md)