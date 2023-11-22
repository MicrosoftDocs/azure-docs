---
title: 'Quickstart: Deploy an Azure Red Hat OpenShift cluster with an ARM template or Bicep'
description: In this Quickstart, learn how to create an Azure Red Hat OpenShift cluster using an Azure Resource Manager template or a Bicep file.
author: johnmarco
ms.service: azure-redhat-openshift
ms.topic: quickstart
ms.custom: mode-arm, devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template, devx-track-bicep
ms.author: johnmarc
ms.date: 02/15/2023
keywords: azure, openshift, aro, red hat, arm, bicep
zone_pivot_groups: azure-red-hat-openshift
#Customer intent: I need to use ARM templates or Bicep files to deploy my Azure Red Hat OpenShift cluster.
---

# Quickstart: Deploy an Azure Red Hat OpenShift cluster with an Azure Resource Manager template or Bicep file

This quickstart describes how to use either Azure Resource Manager template (ARM template) or Bicep to create an Azure Red Hat OpenShift cluster. You can deploy the Azure Red Hat OpenShift cluster with either PowerShell or the Azure command-line interface (Azure CLI).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

Bicep is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. In a Bicep file, you define the infrastructure you want to deploy to Azure, and then use that file throughout the development lifecycle to repeatedly deploy your infrastructure. Your resources are deployed in a consistent manner.

## Prerequisites

* Install [Azure CLI](/cli/azure/install-azure-cli)

::: zone pivot="aro-bicep"

* [Bicep](../azure-resource-manager/bicep/install.md)

::: zone-end

* An Azure account with an active subscription is required. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/).

* Ability to assign User Access Administrator and Contributor roles. If you lack this ability, contact your Microsoft Entra admin to manage roles.

* A Red Hat account. If you don't have one, you'll have to [register for an account](https://www.redhat.com/wapps/ugc/register.html).

* A pull secret for your Azure Red Hat OpenShift cluster. [Download the pull secret file from the Red Hat OpenShift Cluster Manager web site](https://cloud.redhat.com/openshift/install/azure/aro-provisioned).

* If you want to run the Azure PowerShell code locally, [Azure PowerShell](/powershell/azure/install-azure-powershell).

* If you want to run the Azure CLI code locally:
    * A Bash shell (such as Git Bash, which is included in [Git for Windows](https://gitforwindows.org)).
    * [Azure CLI](/cli/azure/install-azure-cli).


## Create an ARM template or Bicep file


Choose either an Azure Resource Manager template (ARM template) or an Azure Bicep file. Then, you can deploy the template using either the Azure command line (azure-cli) or PowerShell.

::: zone pivot="aro-arm"

### Create an ARM template

The following example shows how your ARM template should look when configured for your Azure RedHat OpenShift cluster.

The template defines three Azure resources:

* [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
* [**Microsoft.Network/virtualNetworks/providers/roleAssignments**](/azure/templates/microsoft.authorization/roleassignments)
* [**Microsoft.RedHatOpenShift/OpenShiftClusters**](/azure/templates/microsoft.redhatopenshift/openshiftclusters)

More Azure Red Hat OpenShift template samples can be found on the [Red Hat OpenShift web site](https://docs.openshift.com/container-platform/4.9/installing/installing_azure/installing-azure-user-infra.html).

Save the following example as *azuredeploy.bicep*:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "location" : {
        "type": "string",
        "defaultValue": "eastus",
        "metadata": {
          "description": "Location"
        }
      },
      "domain": {
          "type": "string",
          "defaultValue": "",
          "metadata": {
              "description": "Domain Prefix"
          }
      },
      "pullSecret": {
          "type": "string",
          "metadata": {
              "description": "Pull secret from cloud.redhat.com. The json should be input as a string"
          }
      },
      "clusterVnetName": {
          "type": "string",
          "defaultValue": "aro-vnet",
          "metadata": {
              "description": "Name of ARO vNet"
          }
      },
      "clusterVnetCidr": {
          "type": "string",
          "defaultValue": "10.100.0.0/15",
          "metadata": {
              "description": "ARO vNet Address Space"
          }
      },
      "workerSubnetCidr": {
          "type": "string",
          "defaultValue": "10.100.70.0/23",
          "metadata": {
              "description": "Worker node subnet address space"
          }
      },
      "masterSubnetCidr": {
          "type": "string",
          "defaultValue": "10.100.76.0/24",
          "metadata": {
              "description": "Master node subnet address space"
          }
      },
      "masterVmSize" : {
          "type": "string",
          "defaultValue": "Standard_D8s_v3",
          "metadata": {
              "description": "Master Node VM Type"
          }
      },
      "workerVmSize": {
          "type": "string",
          "defaultValue": "Standard_D4s_v3",
          "metadata": {
              "description": "Worker Node VM Type"
          }
      },
      "workerVmDiskSize": {
          "type" : "int",
          "defaultValue": 128,
          "minValue": 128,
          "metadata": {
              "description": "Worker Node Disk Size in GB"
          }
      },
      "workerCount": {
          "type": "int",
          "defaultValue": 3,
          "minValue": 3,
          "metadata": {
              "description": "Number of Worker Nodes"
          }
      },
      "podCidr": {
          "type": "string",
          "defaultValue": "10.128.0.0/14",
          "metadata": {
              "description": "Cidr for Pods"
          }
      },
      "serviceCidr": {
          "type": "string",
          "defaultValue": "172.30.0.0/16",
          "metadata": {
              "decription": "Cidr of service"
          }
      },
      "clusterName" : {
        "type": "string",
        "metadata": {
          "description": "Unique name for the cluster"
        }
      },
      "tags": {
          "type": "object",
          "defaultValue" : {
              "env": "Dev",
              "dept": "Ops"
          },
          "metadata": {
              "description": "Tags for resources"
          }
      },
      "apiServerVisibility": {
          "type": "string",
          "allowedValues": [
              "Private",
              "Public"
          ],
          "defaultValue": "Public",
          "metadata": {
              "description": "Api Server Visibility"
          }
      },
      "ingressVisibility": {
          "type": "string",
          "allowedValues": [
              "Private",
              "Public"
          ],
          "defaultValue": "Public",
          "metadata": {
              "description": "Ingress Visibility"
          }
      },
      "aadClientId" : {
        "type": "string",
        "metadata": {
          "description": "The Application ID of an Azure Active Directory client application"
        }
      },
      "aadObjectId": {
          "type": "string",
          "metadata": {
              "description": "The Object ID of an Azure Active Directory client application"
          }
      },
      "aadClientSecret" : {
        "type":"securestring",
        "metadata": {
          "description": "The secret of an Azure Active Directory client application"
        }
      },
      "rpObjectId": {
          "type": "String",
          "metadata": {
              "description": "The ObjectID of the Resource Provider Service Principal"
          }
      }
    },
    "variables": {
        "contribRole": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', 'b24988ac-6180-42a0-ab88-20f7382dd24c')]"
    },
    "resources": [
        {
            "type": "Microsoft.Network/virtualNetworks",
            "apiVersion": "2020-05-01",
            "name": "[parameters('clusterVnetName')]",
            "location": "[parameters('location')]",
            "tags": "[parameters('tags')]",
            "properties": {
                "addressSpace": {
                "addressPrefixes": [
                    "[parameters('clusterVnetCidr')]"
                    ]
                },
                "subnets": [
                {
                    "name": "master",
                    "properties": {
                        "addressPrefix": "[parameters('masterSubnetCidr')]",
                        "serviceEndpoints": [
                            {
                                "service": "Microsoft.ContainerRegistry"
                            }
                        ],
                        "privateLinkServiceNetworkPolicies": "Disabled"
                    }
                },
                {
                    "name": "worker",
                    "properties": {
                        "addressPrefix": "[parameters('workerSubnetCidr')]",
                        "serviceEndpoints": [
                            {
                                "service": "Microsoft.ContainerRegistry"
                            }
                        ]
                    }
                }]
            }
        },
        {
            "type": "Microsoft.Network/virtualNetworks/providers/roleAssignments",
            "apiVersion": "2018-09-01-preview",
            "name": "[concat(parameters('clusterVnetName'), '/Microsoft.Authorization/', guid(resourceGroup().id, deployment().name, parameters('aadObjectId')))]",
            "dependsOn": [
                "[resourceId('Microsoft.Network/virtualNetworks', parameters('clusterVnetName'))]"
            ],
            "properties": {
                "roleDefinitionId": "[variables('contribRole')]",
                "principalId":"[parameters('aadObjectId')]"
            }
        },
        {
            "type": "Microsoft.Network/virtualNetworks/providers/roleAssignments",
            "apiVersion": "2018-09-01-preview",
            "name": "[concat(parameters('clusterVnetName'), '/Microsoft.Authorization/', guid(resourceGroup().id, deployment().name, parameters('rpObjectId')))]",
            "dependsOn": [
                "[resourceId('Microsoft.Network/virtualNetworks', parameters('clusterVnetName'))]"
            ],
            "properties": {
                "roleDefinitionId": "[variables('contribRole')]",
                "principalId":"[parameters('rpObjectId')]"
            }
        },
        {
            "type": "Microsoft.RedHatOpenShift/OpenShiftClusters",
            "apiVersion": "2020-04-30",
            "name": "[parameters('clusterName')]",
            "location": "[parameters('location')]",
            "tags": "[parameters('tags')]",
            "dependsOn": [
                "[resourceId('Microsoft.Network/virtualNetworks', parameters('clusterVnetName'))]"
            ],
            "properties": {
                "clusterProfile": {
                    "domain": "[parameters('domain')]",
                    "resourceGroupId": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/aro-', parameters('domain'))]",
                    "pullSecret": "[parameters('pullSecret')]"
                },
                "networkProfile": {
                    "podCidr": "[parameters('podCidr')]",
                    "serviceCidr": "[parameters('serviceCidr')]"
                },
                "servicePrincipalProfile": {
                    "clientId": "[parameters('aadClientId')]",
                    "clientSecret": "[parameters('aadClientSecret')]"
                },
                "masterProfile": {
                    "vmSize": "[parameters('masterVmSize')]",
                    "subnetId": "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('clusterVnetName'), 'master')]"
                },
                "workerProfiles": [
                    {
                        "name": "worker",
                        "vmSize": "[parameters('workerVmSize')]",
                        "diskSizeGB": "[parameters('workerVmDiskSize')]",
                        "subnetId": "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('clusterVnetName'), 'worker')]",
                        "count": "[parameters('workerCount')]"
                    }
                ],
                "apiserverProfile": {
                    "visibility": "[parameters('apiServerVisibility')]"
                },
                "ingressProfiles": [
                    {
                        "name": "default",
                        "visibility": "[parameters('ingressVisibility')]"
                    }
                ]
            }
        }
    ],
    "outputs": {
         "clusterCredentials": {
             "type": "object",
             "value": "[listCredentials(resourceId('Microsoft.RedHatOpenShift/OpenShiftClusters', parameters('clusterName')), '2020-04-30')]"
         },
         "oauthCallbackURL": {
             "type": "string",
             "value": "[concat('https://oauth-openshift.apps.', parameters('domain'), '.', parameters('location'), '.aroapp.io/oauth2callback/AAD')]"
         }
    }
}
```

::: zone-end

::: zone pivot="aro-bicep"

### Create a Bicep file

The following example shows how your Azure Bicep file should look when configured for your Azure Red Hat OpenShift cluster.

The Bicep file defines three Azure resources:

* [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks)
* [Microsoft.Network/virtualNetworks/providers/roleAssignments](/azure/templates/microsoft.authorization/roleassignments)
* [Microsoft.RedHatOpenShift/OpenShiftClusters](/azure/templates/microsoft.redhatopenshift/openshiftclusters)

More Azure Red Hat OpenShift templates can be found on the [Red Hat OpenShift web site](https://docs.openshift.com/container-platform/4.9/installing/installing_azure/installing-azure-user-infra.html).

Create the following Bicep file containing the definition for the Azure Red Hat OpenShift cluster. The following example shows how your Bicep file should look when configured.

Save the following file as *azuredeploy.bicep*:

```bicep
@description('Location')
param location string = 'eastus'

@description('Domain Prefix')
param domain string = ''

@description('Pull secret from cloud.redhat.com. The json should be input as a string')
param pullSecret string

@description('Name of ARO vNet')
param clusterVnetName string = 'aro-vnet'

@description('ARO vNet Address Space')
param clusterVnetCidr string = '10.100.0.0/15'

@description('Worker node subnet address space')
param workerSubnetCidr string = '10.100.70.0/23'

@description('Master node subnet address space')
param masterSubnetCidr string = '10.100.76.0/24'

@description('Master Node VM Type')
param masterVmSize string = 'Standard_D8s_v3'

@description('Worker Node VM Type')
param workerVmSize string = 'Standard_D4s_v3'

@description('Worker Node Disk Size in GB')
@minValue(128)
param workerVmDiskSize int = 128

@description('Number of Worker Nodes')
@minValue(3)
param workerCount int = 3

@description('Cidr for Pods')
param podCidr string = '10.128.0.0/14'

@metadata({
  description: 'Cidr of service'
})
param serviceCidr string = '172.30.0.0/16'

@description('Unique name for the cluster')
param clusterName string

@description('Tags for resources')
param tags object = {
  env: 'Dev'
  dept: 'Ops'
}

@description('Api Server Visibility')
@allowed([
  'Private'
  'Public'
])
param apiServerVisibility string = 'Public'

@description('Ingress Visibility')
@allowed([
  'Private'
  'Public'
])
param ingressVisibility string = 'Public'

@description('The Application ID of an Azure Active Directory client application')
param aadClientId string

@description('The Object ID of an Azure Active Directory client application')
param aadObjectId string

@description('The secret of an Azure Active Directory client application')
@secure()
param aadClientSecret string

@description('The ObjectID of the Resource Provider Service Principal')
param rpObjectId string

var contributorRoleDefinitionId = resourceId('Microsoft.Authorization/roleDefinitions', 'b24988ac-6180-42a0-ab88-20f7382dd24c')
var resourceGroupId = '/subscriptions/${subscription().subscriptionId}/resourceGroups/aro-${domain}-${location}'
var masterSubnetId=resourceId('Microsoft.Network/virtualNetworks/subnets', clusterVnetName, 'master')
var workerSubnetId=resourceId('Microsoft.Network/virtualNetworks/subnets', clusterVnetName, 'worker')

resource clusterVnetName_resource 'Microsoft.Network/virtualNetworks@2020-05-01' = {
  name: clusterVnetName
  location: location
  tags: tags
  properties: {
    addressSpace: {
      addressPrefixes: [
        clusterVnetCidr
      ]
    }
    subnets: [
      {
        name: 'master'
        properties: {
          addressPrefix: masterSubnetCidr
          serviceEndpoints: [
            {
              service: 'Microsoft.ContainerRegistry'
            }
          ]
          privateLinkServiceNetworkPolicies: 'Disabled'
        }
      }
      {
        name: 'worker'
        properties: {
          addressPrefix: workerSubnetCidr
          serviceEndpoints: [
            {
              service: 'Microsoft.ContainerRegistry'
            }
          ]
        }
      }
    ]
  }
}

resource clusterVnetName_Microsoft_Authorization_id_name_aadObjectId 'Microsoft.Authorization/roleAssignments@2020-10-01-preview' = {
  name: guid(aadObjectId, clusterVnetName_resource.id, contributorRoleDefinitionId)
  scope: clusterVnetName_resource
  properties: {
    roleDefinitionId: contributorRoleDefinitionId
    principalId: aadObjectId
    principalType: 'ServicePrincipal'
  }
}

resource clusterVnetName_Microsoft_Authorization_id_name_rpObjectId 'Microsoft.Authorization/roleAssignments@2020-10-01-preview' = {
  name: guid(rpObjectId, clusterVnetName_resource.id, contributorRoleDefinitionId)
  scope: clusterVnetName_resource
  properties: {
    roleDefinitionId: contributorRoleDefinitionId
    principalId: rpObjectId
    principalType: 'ServicePrincipal'
  }
}

resource clusterName_resource 'Microsoft.RedHatOpenShift/OpenShiftClusters@2023-09-04' = {
  name: clusterName
  location: location
  tags: tags
  properties: {
    clusterProfile: {
      domain: domain
      resourceGroupId: resourceGroupId
      pullSecret: pullSecret
    }
    networkProfile: {
      podCidr: podCidr
      serviceCidr: serviceCidr
    }
    servicePrincipalProfile: {
      clientId: aadClientId
      clientSecret: aadClientSecret
    }
    masterProfile: {
      vmSize: masterVmSize
      subnetId: masterSubnetId
    }
    workerProfiles: [
      {
        name: 'worker'
        vmSize: workerVmSize
        diskSizeGB: workerVmDiskSize
        subnetId: workerSubnetId
        count: workerCount
      }
    ]
    apiserverProfile: {
      visibility: apiServerVisibility
    }
    ingressProfiles: [
      {
        name: 'default'
        visibility: ingressVisibility
      }
    ]
  }
  dependsOn: [
    clusterVnetName_resource
  ]
}
```

::: zone-end

::: zone pivot="aro-arm"

## Deploy the azuredeploy.json template

This section provides information on deploying the azuredeploy.json template.

### azuredeploy.json parameters

The azuredeploy.json template is used to deploy an Azure Red Hat OpenShift cluster. The following  parameters are required.

> [!NOTE]
> For the `domain` parameter, specify the domain prefix that will be used as part of the auto-generated DNS name for OpenShift console and API servers. This prefix is also used as part of the name of the resource group that is created to host the cluster VMs.

| Property | Description | Valid Options | Default Value |
|----------|-------------|---------------|---------------|
| `domain` |The domain prefix for the cluster. | | none |
| `pullSecret` | The pull secret that you obtained from the Red Hat OpenShift Cluster Manager web site.
| `clusterName` | The name of the cluster. | |
| `aadClientId` | The application ID (a GUID) of a Microsoft Entra client application. | |
| `aadObjectId` | The object ID (a GUID) of the service principal for the Microsoft Entra client application. | |
| `aadClientSecret` | The client secret of the service principal for the Microsoft Entra client application, as a secure string. | |
| `rpObjectId` | The object ID (a GUID) of the resource provider service principal. | |

The template parameters below have default values. They can be specified, but they aren't explicitly required.

| Property | Description | Valid Options | Default Value |
|----------|-------------|---------------|---------------|
| `location` | The location of the new ARO cluster. This location can be the same as or different from the resource group region. | | eastus
| `clusterVnetName` | The name of the virtual network for the ARO cluster. | | aro-vnet
| `clusterVnetCidr` | The address space of the ARO virtual network, in [Classless Inter-Domain Routing](https://wikipedia.org/wiki/Classless_Inter-Domain_Routing) (CIDR) notation. | | 10.100.0.0/15
| `workerSubnetCidr` | The address space of the worker node subnet, in CIDR notation. | | 10.100.70.0/23
| `masterSubnetCidr` | The address space of the control plane node subnet, in CIDR notation. | | 10.100.76.0/24
| `masterVmSize` | The [virtual machine type/size](../virtual-machines/sizes.md) of the control plane node. | | Standard_D8s_v3
| `workerVmSize` | The virtual machine type/size of the worker node. | | Standard_D4s_v3
| `workerVmDiskSize` | The disk size of the worker node, in gigabytes. | |  128
| `workerCount` | The number of worker nodes. | | 3
| `podCidr` | The address space of the pods, in CIDR notation. | | 10.128.0.0/14
| `serviceCidr` | The address space of the service, in CIDR notation. | | 172.30.0.0/16
| `tags` | A hash table of resource tags. | | `@{env = 'Dev'; dept = 'Ops'}`
| `apiServerVisibility` | The visibility of the API server (`Public` or `Private`). | | Public
| `ingressVisibility` | The ingress (entrance) visibility (`Public` or `Private`). | | Public

The following sections provide instructions using PowerShell or Azure CLI.

## PowerShell steps 

Perform the following steps if you're using PowerShell.

### Before you begin - PowerShell

Before running the commands in this quickstart, you might need to run `Connect-AzAccount`. Check to determine whether you have connectivity to Azure before proceeding. To check whether you have connectivity, run `Get-AzContext` to verify whether you have access to an active Azure subscription.

> [!NOTE] 
> This template uses the pull secret text that was obtained from the Red Hat OpenShift Cluster Manager website. Before proceeding, ensure you have the pull secret saved locally as `pull-secret.txt`.

```powershell
$rhosPullSecret= Get-Content .\pull-secret.txt -Raw # the pull secret text that was obtained from the Red Hat OpenShift Cluster Manager website
```

### Define the following parameters as environment variables - PowerShell

```powershell
$resourceGroup="aro-rg"	     # the new resource group for the cluster
$location="eastus"    		 # the location of the new ARO cluster
$domain="mydomain"           # the domain prefix for the cluster  
$aroClusterName="cluster"    # the name of the cluster
```

### Register the required resource providers - PowerShell

Register the following resource providers in your subscription: `Microsoft.RedHatOpenShift`, `Microsoft.Compute`, `Microsoft.Storage` and `Microsoft.Authorization`.

```powershell
Register-AzResourceProvider -ProviderNamespace Microsoft.RedHatOpenShift
Register-AzResourceProvider -ProviderNamespace Microsoft.Compute
Register-AzResourceProvider -ProviderNamespace Microsoft.Storage
Register-AzResourceProvider -ProviderNamespace Microsoft.Authorization
```

### Create the new resource group - PowerShell

```powershell
New-AzResourceGroup -Name $resourceGroup -Location $location
```

### Create a new service principal and assign roles  - PowerShell

```powershell
$suffix=Get-Random # random suffix for the Service Principal
$spDisplayName="sp-$resourceGroup-$suffix"
$azureADAppSp = New-AzADServicePrincipal -DisplayName $spDisplayName -Role Contributor

New-AzRoleAssignment -ObjectId $azureADAppSp.Id -RoleDefinitionName 'User Access Administrator' -ResourceGroupName $resourceGroup -ObjectType 'ServicePrincipal'
New-AzRoleAssignment -ObJectId $azureADAppSp.Id -RoleDefinitionName 'Contributor' -ResourceGroupName $resourceGroup -ObjectType 'ServicePrincipal'
```

### Get the Service Principal password  - PowerShell

```powershell
$aadClientSecretDigest = ConvertTo-SecureString -String $azureADAppSp.PasswordCredentials.SecretText -AsPlainText -Force
```

### Get the service principal for the OpenShift resource provider - PowerShell

```powershell
$rpOpenShift =  Get-AzADServicePrincipal -DisplayName 'Azure Red Hat OpenShift RP' | Select-Object -ExpandProperty Id -Property Id -First 1
```

### Check the parameters before deploying the cluster - PowerShell

```powershell
# setup the parameters for the deployment
$templateParams = @{  
    domain = $domain
    clusterName = $aroClusterName
    location = $location
    aadClientId = $azureADAppSp.AppId
    aadObjectId = $azureADAppSp.Id
    aadClientSecret = $aadClientSecretDigest 
    rpObjectId = $rpOpenShift.Id
    pullSecret = $rhosPullSecret
}

Write-Verbose (ConvertTo-Json $templateParams) -Verbose
```

### Deploy the Azure Red Hat OpenShift cluster using the ARM template - PowerShell

```powershell
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroup @templateParams `
    -TemplateFile azuredeploy.json
```

::: zone-end

### Connect to your cluster

To connect to your new cluster, review the steps in [Connect to an Azure Red Hat OpenShift 4 cluster](tutorial-connect-cluster.md).

### Clean up resources - PowerShell

Once you're done, run the following command to delete your resource group and all the resources you created in this tutorial.

```powershell
Remove-AzResourceGroup -Name $resourceGroup -Force
```
## Azure CLI steps 

Perform the following steps if you're using Azure CLI.

### Before you begin - Azure CLI

You might need to run `az login` before running the commands in this quickstart. Check whether you have connectivity to Azure before proceeding. To check whether you have connectivity, run `az account list` and verify that you have access to an active Azure subscription.

> [!NOTE]
> This template will use the pull secret text that was obtained from the Red Hat OpenShift Cluster Manager website. Before proceeding
> make sure you have that secret saved locally as `pull-secret.txt`.

```azurecli-interactive
PULL_SECRET=$(cat pull-secret.txt)    # the pull secret text 
```

### Define the following parameters as environment variables - Azure CLI

```azurecli-interactive
RESOURCEGROUP=aro-rg            # the new resource group for the cluster
LOCATION=eastus                 # the location of the new cluster
DOMAIN=mydomain                 # the domain prefix for the cluster
ARO_CLUSTER_NAME=aro-cluster    # the name of the cluster
```

### Register the required resource providers - Azure CLI

Register the following resource providers in your subscription: `Microsoft.RedHatOpenShift`, `Microsoft.Compute`, `Microsoft.Storage` and `Microsoft.Authorization`.

```azurecli-interactive
az provider register --namespace 'Microsoft.RedHatOpenShift' --wait
az provider register --namespace 'Microsoft.Compute' --wait
az provider register --namespace 'Microsoft.Storage' --wait
az provider register --namespace 'Microsoft.Authorization' --wait
```

### Create the new resource group - Azure CLI

```azurecli-interactive
az group create --name $RESOURCEGROUP --location $LOCATION
```

<a name='create-a-service-principal-for-the-new-azure-ad-application'></a>

### Create a service principal for the new Microsoft Entra application 
- Azure CLI

```azurecli-interactive
az ad sp create-for-rbac --name "sp-$RG_NAME-${RANDOM}" > app-service-principal.json
SP_CLIENT_ID=$(jq -r '.appId' app-service-principal.json)
SP_CLIENT_SECRET=$(jq -r '.password' app-service-principal.json)
SP_OBJECT_ID=$(az ad sp show --id $SP_CLIENT_ID | jq -r '.id')
```

### Assign the Contributor role to the new service principal - Azure CLI 

```azurecli-interactive
az role assignment create \
    --role 'User Access Administrator' \
    --assignee-object-id $SP_OBJECT_ID \
    --resource-group $RESOURCEGROUP \
    --assignee-principal-type 'ServicePrincipal'

az role assignment create \
    --role 'Contributor' \
    --assignee-object-id $SP_OBJECT_ID \
    --resource-group $RESOURCEGROUP \
    --assignee-principal-type 'ServicePrincipal'
```

### Get the service principal object ID for the OpenShift resource provider - Azure CLI

```azurecli-interactive
ARO_RP_SP_OBJECT_ID=$(az ad sp list --display-name "Azure Red Hat OpenShift RP" --query [0].id -o tsv)
```

### Deploy the cluster - Azure CLI

```azurecli-interactive
az deployment group create \
    --name aroDeployment \
    --resource-group $RESOURCEGROUP \
    --template-file azuredeploy.bicep \
    --parameters location=$LOCATION \
    --parameters domain=$DOMAIN \
    --parameters pullSecret=$PULL_SECRET \
    --parameters clusterName=$CLUSTER \
    --parameters aadClientId=$SP_CLIENT_ID \
    --parameters aadObjectId=$SP_OBJECT_ID \
    --parameters aadClientSecret=$SP_CLIENT_SECRET \
    --parameters rpObjectId=$ARO_RP_SP_OBJECT_ID
```

### Connect to your cluster - Azure CLI

To connect to your new cluster, review the steps in [Connect to an Azure Red Hat OpenShift 4 cluster](tutorial-connect-cluster.md).

### Clean up resources - Azure CLI

Once you're done, run the following command to delete your resource group and all the resources you created in this tutorial.

```azurecli-interactive
az aro delete --resource-group $RESOURCEGROUP --name $CLUSTER
```

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Red Hat Openshift (ARO) repo](https://github.com/Azure/OpenShift).

## Next steps

In this article, you learned how to create an Azure Red Hat OpenShift cluster running OpenShift 4 using both ARM templates and Bicep.

Advance to the next article to learn how to configure the cluster for authentication using Microsoft Entra ID.

* [Rotate service principal credentials for your Azure Red Hat OpenShift (ARO) Cluster](howto-service-principal-credential-rotation.md)

* [Configure authentication with Microsoft Entra ID using the command line](configure-azure-ad-cli.md)

* [Configure authentication with Microsoft Entra ID using the Azure portal and OpenShift web console](configure-azure-ad-cli.md)i
