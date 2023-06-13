---
title: 'Quickstart: Create a mesh network topology with Azure Virtual Network Manager using Bicep'
description: Use this quickstart to learn how to create a mesh network topology with Virtual Network Manager by using Bicep.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: quickstart
ms.date: 04/12/2023
ms.custom: template-quickstart, mode-ui, engagement-fy23
---

# Quickstart: Create a mesh network topology with Azure Virtual Network Manager by using Bicep

Get started with Azure Virtual Network Manager by using Bicep to manage connectivity for all your virtual networks.

In this quickstart, you deploy three virtual networks and use Azure Virtual Network Manager to create a mesh network topology. Then you verify that the connectivity configuration was applied.

:::image type="content" source="media/create-virtual-network-manager-portal/virtual-network-manager-resources-diagram.png" alt-text="Diagram of resources deployed for a mesh virtual network topology with Azure virtual network manager.":::

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub-and-spoke connectivity configurations. Mesh connectivity configurations and security admin rules remain in public preview.
>
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Permissions to create a Policy Definition and Policy Assignment at the target subscription scope (this is required when using the deployment parameter `networkGroupMembershipType=Dynamic` to deploy the required Policy resources for Network Group membership. The default is `static`, which does not deploy a Policy.

### Download the Bicep Solution

1. Download a Zip archive of the MSPNP repo at [this link](https://github.com/mspnp/samples/archive/refs/heads/main.zip)
1. Extract the downloaded Zip file and in your terminal, navigate to the `solutions/avnm-mesh-connected-group/bicep` directory.

Alternatively, you can use `git` to clone the repo with `git clone https://github.com/mspnp/samples.git`

### [Powershell](#tab/powershell)

#### Sign in to your Azure account and select your subscription

To begin your configuration, sign in to your Azure account:

```azurepowershell
Connect-AzAccount
```

Then, connect to your subscription:

```azurepowershell
Set-AzContext -Subscription <subscription name or id>
```

#### Install the Azure PowerShell module

Install the latest *Az.Network* Azure PowerShell module by using this command:

```azurepowershell
 Install-Module -Name Az.Network -RequiredVersion 5.3.0
```

### [Azure CLI](#tab/cli)

#### Sign in to your Azure account and select your subscription

To begin your configuration, sign in to your Azure account:

```azurecli
az login
```

Then, connect to your subscription by subscription ID:

```azurecli
az account set -s <subscriptionId>
```

---

## Deploy the Bicep Template

When deploying or managing Azure Virtual Network Manager using infrastructure-as-code, special consideration should be given to the fact that Azure Virtual Network Manager configuration involves a two step process:

A configuration and configuration scope or target are defined, then
The configuration is deployed to the target resources (typically, Virtual Networks).
To complete these steps using the Portal, you create a configuration then choose to deploy it in a separate action. For infrastructure code, after defining a configuration in code, the Azure Virtual Network Manager API must be called to perform a 'commit' action (mirroring the 'deploy' step in the Portal).

Declarative infrastructure code on its own cannot call the API, requiring the use of a Deployment Script resource. The Deployment Script resource invokes a script in an Azure Container Instance to execute the Deploy-AzNetworkManagerCommit Azure PowerShell command.

Because the PowerShell script runs within the Deployment Script resource, troubleshooting a failed deployment may require reviewing the script logs found on the Deployment Script resource if the Deployment Script resource deployment reports a failure. It is also possible to view the deployment in the Portal, but note that the Portal interface may take several minutes to update after a code deployment is run.

## Deployment Parameters

* **resourceGroupName**: [required] This parameter specifies the name of the resource group where the virtual network manager and sample virtual networks will be deployed.
* **location**: [required] This parameter specifies the location of the resources to deploy. 
* **networkGroupMembershipType**: [optional] This parameter specifies the type of Network Group membership to deploy. The default is `static`, but dynamic group membership can be used by specifying `dynamic`. Note, dynamic group membership deploys an Azure Policy to manage membership, requiring [additional permissions](../governance/policy/overview.md#azure-rbac-permissions-in-azure-policy). 

### [Powershell](#tab/powershell1)

```powershell
    $templateParameterObject = @{
        'location' = '<resourceLocation>'
        'resourceGroupName' = '<newOrExistingResourceGroup>'
    }
    New-AzSubscriptionDeployment -TemplateFile ./main.bicep -Location <deploymentLocation> -TemplateParameterObject $templateParameterObject
```

### [Azure CLI](#tab/azurecli1)

```azurecli
    az deployment sub create -l <deploymentLocation> -f ./main.bicep -p location=<resourceLocation> resourceGroupName=<newOrExistingResourceGroup>
```

---

## Verify configuration deployment

Use the **Network Manager** section for each virtual network to verify that you deployed your configuration:

1. Go to the **vnet-spokeA** virtual network.
1. Under **Settings**, select **Network Manager**.
1. On the **Connectivity Configurations** tab, verify that **cc-{location}-mesh** appears in the list.

    :::image type="content" source="./media/create-virtual-network-manager-portal/vnet-configuration-association.png" alt-text="Screenshot of a connectivity configuration listed for a virtual network." lightbox="./media/create-virtual-network-manager-portal/vnet-configuration-association.png":::

1. Repeat the previous steps on **vnet-spokeD**--you should see the **vnet-spokeD** is excluded from the connectivity configuration.

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
