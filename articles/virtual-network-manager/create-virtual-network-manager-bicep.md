---
title: 'Quickstart: Create a mesh network topology with Azure Virtual Network Manager using Bicep'
description: Use this quickstart to learn how to create a mesh network topology with Virtual Network Manager by using Bicep.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: quickstart
ms.date: 06/13/2023
ms.custom: template-quickstart, mode-ui, engagement-fy23, devx-track-azurepowershell, devx-track-bicep
---

# Quickstart: Create a mesh network topology with Azure Virtual Network Manager by using Bicep

Get started with Azure Virtual Network Manager by using Bicep to manage connectivity for all your virtual networks.

In this quickstart, you deploy three virtual networks and use Azure Virtual Network Manager to create a mesh network topology. Then you verify that the connectivity configuration was applied.

:::image type="content" source="media/create-virtual-network-manager-portal/virtual-network-manager-resources-diagram.png" alt-text="Diagram of resources deployed for a mesh virtual network topology with Azure virtual network manager.":::

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-preview.md)]ps://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Bicep Template Modules

The Bicep solution for this sample is broken down into modules to enable deployments at both a resource group and subscription scope. The template sections detailed below are the unique components for Virtual Network Manager. In addition to the sections detailed below, the solution deploys Virtual Networks, a User Assigned Identity, and a Role Assignment. 

### Virtual Network Manager, Network Groups, and Connectivity Configurations

#### Virtual Network Manager

```bicep
@description('This is the Azure Virtual Network Manager which will be used to implement the connected group for inter-vnet connectivity.')
resource networkManager 'Microsoft.Network/networkManagers@2022-09-01' = {
  name: 'vnm-learn-prod-${location}-001'
  location: location
  properties: {
    networkManagerScopeAccesses: [
      'Connectivity'
    ]
    networkManagerScopes: {
      subscriptions: [
        '/subscriptions/${subscription().subscriptionId}'
      ]
      managementGroups: []
    }
  }
}
```

#### Network Groups

The solution supports creating either static membership Network Groups or dynamic membership Network Groups. The static membership network group specifies its members by Virtual Network ID

**Static Membership Network Group**

```bicep
@description('This is the static network group for the all VNETs.')
resource networkGroupSpokesStatic 'Microsoft.Network/networkManagers/networkGroups@2022-09-01' = if (networkGroupMembershipType == 'static') {
  name: 'ng-learn-prod-${location}-static001'
  parent: networkManager
  properties: {
    description: 'Network Group - Static'
  }

  // add spoke vnets A, B, and C to the static network group
  resource staticMemberSpoke 'staticMembers@2022-09-01' = [for spokeMember in spokeNetworkGroupMembers: if (contains(groupedVNETs,last(split(spokeMember,'/')))) {
    name: 'sm-${(last(split(spokeMember, '/')))}'
    properties: {
      resourceId: spokeMember
    }
  }]

  resource staticMemberHub 'staticMembers@2022-09-01' = {
    name: 'sm-${(toLower(last(split(hubVnetId, '/'))))}'
    properties: {
      resourceId: hubVnetId
    }
  }
}
```

**Dynamic Membership Network Group**

```bicep
@description('This is the dynamic group for all VNETs.')
resource networkGroupSpokesDynamic 'Microsoft.Network/networkManagers/networkGroups@2022-09-01' = if (networkGroupMembershipType == 'dynamic') {
  name: 'ng-learn-prod-${location}-dynamic001'
  parent: networkManager
  properties: {
    description: 'Network Group - Dynamic'
  }
}
```

#### Connectivity Configuration

The Connectivity Configuration associates the Network Group with the specified network topology. 

```bicep
@description('This connectivity configuration defines the connectivity between VNETs using Direct Connection. The hub will be part of the mesh, but gateway routes from the hub will not propagate to spokes.')
resource connectivityConfigurationMesh 'Microsoft.Network/networkManagers/connectivityConfigurations@2022-09-01' = {
  name: 'cc-learn-prod-${location}-mesh001'
  parent: networkManager
  properties: {
    description: 'Mesh connectivity configuration'
    appliesToGroups: [
      {
        networkGroupId: (networkGroupMembershipType == 'static') ? networkGroupSpokesStatic.id : networkGroupSpokesDynamic.id
        isGlobal: 'False'
        useHubGateway: 'False'
        groupConnectivity: 'DirectlyConnected'
      }
    ]
    connectivityTopology: 'Mesh'
    deleteExistingPeering: 'True'
    hubs: []
    isGlobal: 'False'
  }
}
```

#### Deployment Script

In order to deploy the configuration to the target network group, a Deployment Script is used to call the `Deploy-AzNetworkManagerCommit`​ PowerShell command. The Deployment Script needs an identity with sufficient permissions to execute the PowerShell script against the Virtual Network Manager, so the Bicep template creates a User Managed Identity and grants it the 'Contributor' role on the target resource group. For more information on Deployment Scripts and associated identities, see [Use deployment scripts in ARM templates](../azure-resource-manager/templates/deployment-script-template.md).

```bicep
@description('Create a Deployment Script resource to perform the commit/deployment of the Network Manager connectivity configuration.')
resource deploymentScript 'Microsoft.Resources/deploymentScripts@2020-10-01' = {
  name: deploymentScriptName
  location: location
  kind: 'AzurePowerShell'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${userAssignedIdentityId}': {}
    }
  }
  properties: {
    azPowerShellVersion: '8.3'
    retentionInterval: 'PT1H'
    timeout: 'PT1H'
    arguments: '-networkManagerName "${networkManagerName}" -targetLocations ${location} -configIds ${configurationId} -subscriptionId ${subscription().subscriptionId} -configType ${configType} -resourceGroupName ${resourceGroup().name}'
    scriptContent: '''
    param (
      # AVNM subscription id
      [parameter(mandatory=$true)][string]$subscriptionId,

      # AVNM resource name
      [parameter(mandatory=$true)][string]$networkManagerName,

      # string with comma-separated list of config ids to deploy. ids must be of the same config type
      [parameter(mandatory=$true)][string[]]$configIds,

      # string with comma-separated list of deployment target regions
      [parameter(mandatory=$true)][string[]]$targetLocations,

      # configuration type to deploy. must be either connecticity or securityadmin
      [parameter(mandatory=$true)][ValidateSet('Connectivity','SecurityAdmin')][string]$configType,

      # AVNM resource group name
      [parameter(mandatory=$true)][string]$resourceGroupName
    )
  
    $null = Login-AzAccount -Identity -Subscription $subscriptionId
  
    [System.Collections.Generic.List[string]]$configIdList = @()  
    $configIdList.addRange($configIds) 
    [System.Collections.Generic.List[string]]$targetLocationList = @() # target locations for deployment
    $targetLocationList.addRange($targetLocations)     
    
    $deployment = @{
        Name = $networkManagerName
        ResourceGroupName = $resourceGroupName
        ConfigurationId = $configIdList
        TargetLocation = $targetLocationList
        CommitType = $configType
    }
  
    try {
      Deploy-AzNetworkManagerCommit @deployment -ErrorAction Stop
    }
    catch {
      Write-Error "Deployment failed with error: $_"
      throw "Deployment failed with error: $_"
    }
    '''
    }
}
```

#### Dynamic Network Group Membership Policy

When the deployment is configured to use `dynamic` network group membership, the solution also deploys an Azure Policy Definition and Assignment. The Policy Definition is shown below.

```bicep
@description('This is a Policy definition for dynamic group membership')
resource policyDefinition 'Microsoft.Authorization/policyDefinitions@2021-06-01' = {
  name: uniqueString(networkGroupId)
  properties: {
    description: 'AVNM quickstart dynamic group membership Policy'
    displayName: 'AVNM quickstart dynamic group membership Policy'
    mode: 'Microsoft.Network.Data'
    policyRule: {
      if: {
        allof: [
          {
            field: 'type'
            equals: 'Microsoft.Network/virtualNetworks'
          }
          {
            // virtual networks must have a tag where the key is '_avnm_quickstart_deployment'
            field: 'tags[_avnm_quickstart_deployment]'
            exists: true
          }
          {
            // virtual network ids must include this sample's resource group ID - limiting the chance that dynamic membership impacts other vnets in your subscriptions
            field: 'id'
            like: '${subscription().id}/resourcegroups/${resourceGroupName}/*'
          }
        ]
      }
      then: {
        // 'addToNetworkGroup' is a special effect used by AVNM network groups
        effect: 'addToNetworkGroup'
        details: {
          networkGroupId: networkGroupId
        }
      }
    }
  }
}
```

## Deploy the Bicep Solution

### Deployment Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Permissions to create a Policy Definition and Policy Assignment at the target subscription scope (this is required when using the deployment parameter `networkGroupMembershipType=Dynamic` to deploy the required Policy resources for Network Group membership. The default is `static`, which does not deploy a Policy.

#### Download the Bicep Solution

1. Download a Zip archive of the MSPNP repo at [this link](https://github.com/mspnp/samples/archive/refs/heads/main.zip)
1. Extract the downloaded Zip file and in your terminal, navigate to the `solutions/avnm-mesh-connected-group/bicep` directory.

Alternatively, you can use `git` to clone the repo with `git clone https://github.com/mspnp/samples.git`

#### Connect to Azure

#### [PowerShell](#tab/powershell)

##### Sign in to your Azure account and select your subscription

To begin your configuration, sign in to your Azure account:

```azurepowershell
Connect-AzAccount
```

Then, connect to your subscription:

```azurepowershell
Set-AzContext -Subscription <subscription name or id>
```

##### Install the Azure PowerShell module

Install the latest *Az.Network* Azure PowerShell module by using this command:

```azurepowershell
 Install-Module -Name Az.Network -RequiredVersion 5.3.0
```

#### [Azure CLI](#tab/cli)

##### Sign in to your Azure account and select your subscription

To begin your configuration, sign in to your Azure account:

```azurecli
az login
```

Then, connect to your subscription by subscription ID:

```azurecli
az account set -s <subscriptionId>
```

---

### Deployment Parameters

* **resourceGroupName**: [required] This parameter specifies the name of the resource group where the virtual network manager and sample virtual networks will be deployed.
* **location**: [required] This parameter specifies the location of the resources to deploy. 
* **networkGroupMembershipType**: [optional] This parameter specifies the type of Network Group membership to deploy. The default is `static`, but dynamic group membership can be used by specifying `dynamic`. 

> [!NOTE]
> Choosing dynamic group membership deploys an Azure Policy to manage membership, requiring [more permissions](../governance/policy/overview.md#azure-rbac-permissions-in-azure-policy). 

#### [PowerShell](#tab/powershell1)

```powershell
    $templateParameterObject = @{
        'location' = '<resourceLocation>'
        'resourceGroupName' = '<newOrExistingResourceGroup>'
    }
    New-AzSubscriptionDeployment -TemplateFile ./main.bicep -Location <deploymentLocation> -TemplateParameterObject $templateParameterObject
```

#### [Azure CLI](#tab/azurecli1)

```azurecli
    az deployment sub create -l <deploymentLocation> -f ./main.bicep -p location=<resourceLocation> resourceGroupName=<newOrExistingResourceGroup>
```

---

## Verify configuration deployment

Use the **Network Manager** section for each virtual network to verify that you deployed your configuration:

1. Go to the **vnet-learn-prod-{location}-spoke001** virtual network.
1. Under **Settings**, select **Network Manager**.
1. On the **Connectivity Configurations** tab, verify that **cc-learn-prod-{location}-mesh001** appears in the list.

    :::image type="content" source="./media/create-virtual-network-manager-portal/vnet-configuration-association.png" alt-text="Screenshot of a connectivity configuration listed for a virtual network." lightbox="./media/create-virtual-network-manager-portal/vnet-configuration-association.png":::

1. Repeat the previous steps on **vnet-learn-prod-{location}-spoke004**--you should see the **vnet-learn-prod-{location}-spoke004** is excluded from the connectivity configuration.

## Clean up resources

If you no longer need Azure Virtual Network Manager, you can remove it after you remove all configurations, deployments, and network groups:

1. To remove all configurations from a region, start in Virtual Network Manager and select **Deploy configurations**. Select the following settings, and then select **Next**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/none-configuration.png" alt-text="Screenshot of the tab for configuring a goal state for network resources, with the option for removing existing connectivity configurations selected.":::

    | Setting | Value |
    | ------- | ----- |
    | **Configurations** | Select **Include connectivity configurations in your goal state**. |
    | **Connectivity configurations** | Select **None - Remove existing connectivity configurations**. |
    | **Target regions** | Select **East US** as the deployed region. |

1. Select **Deploy** to complete the deployment removal.

1. To delete a configuration, go to the left pane of Virtual Network Manager. Under **Settings**, select **Configurations**. Select the checkbox next to the configuration that you want to remove, and then select **Delete** at the top of the resource pane.

1. On the **Delete a configuration** pane, select the following options, and then select **Delete**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/configuration-delete-options.png" alt-text="Screenshot of the pane for deleting a configuration.":::

    | Setting | Value |
    | ------- | ----- |
    | **Delete option** | Select **Force delete the resource and all dependent resources**. |
    | **Confirm deletion** | Enter the name of the configuration. In this example, it's **cc-learn-prod-eastus-001**. |

1. To delete a network group, go to the left pane of Virtual Network Manager. Under **Settings**, select **Network groups**. Select the checkbox next to the network group that you want to remove, and then select **Delete** at the top of the resource pane.

1. On the **Delete a network group** pane, select the following options, and then select **Delete**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-group-delete-options.png" alt-text="Screenshot of Network group to be deleted option selection." lightbox="./media/create-virtual-network-manager-portal/network-group-delete-options.png":::

    | Setting | Value |
    | ------- | ----- |
    | **Delete option** | Select **Force delete the resource and all dependent resources**. |
    | **Confirm deletion** | Enter the name of the network group. In this example, it's **ng-learn-prod-eastus-001**. |

1. Select **Yes** to confirm the network group deletion.

1. After you remove all network groups, go to the left pane of Virtual Network Manager. Select **Overview**, and then select **Delete**.

1. On the **Delete a network manager** pane, select the following options, and then select **Delete**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-manager-delete.png" alt-text="Screenshot of the pane for deleting a network manager.":::

    | Setting | Value |
    | ------- | ----- |
    | **Delete option** | Select **Force delete the resource and all dependent resources**. |
    | **Confirm deletion** | Enter the name of the Virtual Network Manager instance. In this example, it's **vnm-learn-eastus-001**. |

1. Select **Yes** to confirm the deletion.

1. To delete the resource group and virtual networks, locate resource group you created during the deployment and select **Delete resource group**. Confirm that you want to delete by entering the name in the text box, and then select **Delete**.

1. If you used **Dynamic Network Group Membership**, delete the deployed Azure Policy Definition and Assignment by navigating to the Subscription in the Portal and selecting the **Policies**. In Policies, find the **Assignment** named `AVNM quickstart dynamic group membership Policy` and delete it, then do the same for the **Definition** named `AVNM quickstart dynamic group membership Policy`.

## Next steps

Now that you've created an Azure Virtual Network Manager instance, learn how to block network traffic by using a security admin configuration:

> [!div class="nextstepaction"]
> [Block network traffic with Azure Virtual Network Manager](how-to-block-network-traffic-portal.md)
