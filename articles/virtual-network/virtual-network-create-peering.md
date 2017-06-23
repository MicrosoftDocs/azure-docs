---
title: Create an Azure virtual network peering | Microsoft Docs
description: Learn how to create a virtual network peering between two virtual networks.
services: virtual-network
documentationcenter: ''
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 026bca75-2946-4c03-b4f6-9f3c5809c69a
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/06/2017
ms.author: jdial;narayan;annahar

---
# Create a virtual network peering

In this tutorial, you learn to create a virtual network peering between two virtual networks. Peering two virtual networks enables resources in different virtual networks to communicate with each other with the same bandwidth and latency as though the resources were in the same virtual network. A virtual network peering can only be created between two virtual networks that exist in the same Azure region. To learn more about virtual network peering, see the [Virtual network peering](virtual-network-peering-overview.md) overview article. 

If you need to connect virtual networks that exist in different Azure regions, you can use an Azure [VPN Gateway](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) to connect the virtual networks. 

You can use the [Azure portal](#portal), Azure [PowerShell](#powershell), Azure [command-line interface](#cli) (CLI), or [Azure Resource Manager template](#template) to create a virtual network peering. Click any of the previous tool links to go directly to the steps for creating a virtual network peering using your tool of choice.

## <a name="portal"></a>Create peering - Azure portal

Complete the following steps to create a virtual network peering between two virtual networks deployed through Resource Manager that exist in the same subscription. You can also [peer two virtual networks in different subscriptions](#different-subscriptions) or [peer one virtual network (Resource Manager) with a virtual network (classic)](#different-models). 

1. Sign in to the [Azure portal](https://portal.azure.com). The account you sign in with must have the necessary permissions to create a virtual network peering. See the [Permissions](#permissions) section of this article for details.
2. Click **+ New**, click **Networking**, then click **Virtual network**.
3. In the **Virtual network** blade, in the **Select a deployment model** box, leave **Resource Manager** selected, and then click **Create**.
4. In the **Create virtual network** blade, enter, or select values for the following settings, then click **Create**:
    - **Name**: *myVnet1*
    - **Address space**: *10.0.0.0/16*
    - **Subnet name**: *default*
    - **Subnet address range**: *10.0.0.0/24*
    - **Subscription**: Select your subscription
    - **Resource group**: Select **Create new** and enter *myResourceGroup*
    - **Location**: *East US*
5. Complete steps 2-4 again specifying the following values in step 4:
    - **Name**: *myVnet2*
    - **Address space**: *10.1.0.0/16*
    - **Subnet name**: *default*
    - **Subnet address range**: *10.1.0.0/24*
    - **Subscription**: Select your subscription
    - **Resource group**: Select **Use existing** and select *myResourceGroup*
    - **Location**: *East US*
6. In the **Search resources** box at the top of the portal, type *myResourceGroup*. Click **myResourceGroup** when it appears in the search results. A blade appears for the **myresourcegroup** resource group. The resource group contains the two virtual networks created in previous steps.
7. Click **myVNet1**.
8. In the **myVnet1** blade that appears, click **Peerings** from the vertical list of options on the left side of the blade.
9. In the **myVnet1 - Peerings** blade that appeared, click **+ Add**
10. In the **Add peering** blade that appears, enter, or select the following options, then click **OK**:
     - **Name**: *myVnet1ToMyVnet2*
     - **Virtual network deployment model**:  Select **Resource Manager**. 
     - **Subscription**: Select your subscription
     - **Virtual network**:  Click **Choose a virtual network**, then click **myVnet2**.
     - **Allow virtual network access:** Ensure that **Enabled** is selected.
    No other settings are used in this tutorial. To learn about all peering settings, read [Manage virtual network peerings](virtual-network-manage-peering.md#create-peering).
11. After clicking **OK** in the previous step, the **Add peering** blade closes and you see the **myVnet1 - Peerings** blade again. After a few seconds, the peering you created appears in the blade. **Initiated** is listed in the **PEERING STATUS** column for the **myVnet1ToMyVnet2** peering you created. You've peered Vnet1 to Vnet2, but now you must peer Vnet2 to Vnet1. The peering must be created in both directions to enable resources in the virtual networks to communicate with each other.
12. Complete steps 6-11 again for myVnet2.  Name the peering *myVnet2ToMyVnet1*.
13. A few seconds after clicking **OK** to create the peering for MyVnet2, the **myVnet2ToMyVnet1** peering you just created is listed with **Connected** in the **PEERING STATUS** column.
14. Complete steps 6-8 again for MyVnet1. The **PEERING STATUS** for the **myVnet1ToVNet2** peering is now also **Connected**. The peering is successfully established after you see **Connected** in the **PEERING STATUS** column for both virtual networks in the peering.
15. **Optional**: Though creating virtual machines is not covered in this tutorial, you can create a virtual machine in each virtual network and connect from one virtual machine to the other, to validate connectivity.
16. **Optional**: To delete the resources that you create in this tutorial, complete the steps in the [Delete resources](#delete-portal) section of this article.

Any Azure resources you create in either virtual network are now able to communicate with each other through their IP addresses. If you're using default Azure name resolution for the virtual networks, the resources in the virtual networks are not able to resolve names across the virtual networks. If you want to resolve names across virtual networks in a peering, you must create your own DNS server. Learn how to set up [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server).

## <a name="cli"></a>Create peering - Azure CLI

The following script:

- Requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json).
- Works in a Bash shell. For options on running Azure CLI scripts on Windows client, see [Running the Azure CLI in Windows](../virtual-machines/windows/cli-options.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

1. Create a resource group and two virtual networks.
    ```azurecli-interactive
    #!/bin/bash

    # Variables for common values used throughout the script.
    rgName="myResourceGroup"
    location="eastus"

    # Create a resource group.
    az group create \
      --name $rgName \
      --location $location

    # Create virtual network 1.
    az network vnet create \
      --name myVnet1 \
      --resource-group $rgName \
      --location $location \
      --address-prefix 10.0.0.0/16

    # Create virtual network 2.
    az network vnet create \
      --name myVnet2 \
      --resource-group $rgName \
      --location $location \
      --address-prefix 10.1.0.0/16
    #
    ```
2. Create a virtual network peering between the two virtual networks.
    ```azurecli-interactive
    # Get the id for VNet1.
    vnet1Id=$(az network vnet show \
      --resource-group $rgName \
      --name myVnet1 \
      --query id --out tsv)

    # Get the id for VNet2.
    vnet2Id=$(az network vnet show \
      --resource-group $rgName \
      --name myVnet2 \
      --query id \
      --out tsv)

    # Peer VNet1 to VNet2.
    az network vnet peering create \
      --name myVnet1ToMyVnet2 \
      --resource-group $rgName \
      --vnet-name myVnet1 \
      --remote-vnet-id $vnet2Id \
      --allow-vnet-access

    # Peer VNet2 to VNet1.
    az network vnet peering create \
      --name myVnet2ToMyVnet1 \
      --resource-group $rgName \
      --vnet-name myVnet2 \
      --remote-vnet-id $vnet1Id \
      --allow-vnet-access
    #
    ```
3. After the script executes, review the peerings for each virtual network. Copy the following command, and then paste it in your command window:

    ```azurecli-interactive
    az network vnet peering list \
      --resource-group myResourceGroup \
      --vnet-name myVnet1 \
      --output table
    #
    ```
Run the previous command again, replacing *myVnet1* with *myVnet2*. The output of both commands shows **Connected** in the **PeeringState** column.
4. **Optional**: Though creating virtual machines is not covered in this tutorial, you can create a virtual machine in each virtual network and connect from one virtual machine to the other, to validate connectivity.
5. **Optional**: To delete the resources that you create in this tutorial, complete the steps in [Delete resources](#delete-cli) in this article.

Any Azure resources you create in either virtual network are now able to communicate with each other through their IP addresses. If you're using default Azure name resolution for the virtual networks, the resources in the virtual networks are not able to resolve names across the virtual networks. If you want to resolve names across virtual networks in a peering, you must create your own DNS server. Learn how to set up [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server).
 
## <a name="powershell"></a>Create peering - PowerShell

1. Install the latest version of the PowerShell [AzureRm](https://www.powershellgallery.com/packages/AzureRM/) module. If you're new to Azure PowerShell, see [Azure PowerShell overview](/powershell/azure/overview?toc=%2fazure%2fvirtual-network%2ftoc.json).
2. To start a PowerShell session, go to **Start**, enter **powershell**, and then click **PowerShell**.
3. In the PowerShell window, sign in to Azure by entering the `login-azurermaccount` command. The account you sign in with must have the necessary permissions to create a virtual network peering. See the [Permissions](#permissions) section of this article for details.
4. In your browser, copy the following script, then right-click in your PowerShell window to execute the script that creates a resource group and two virtual networks:
    ```powershell
    # Variables for common values used throughout the script.
    $rgName='myResourceGroup'
    $location='eastus'

    # Create a resource group.
    New-AzureRmResourceGroup `
      -Name $rgName `
      -Location $location

    # Create virtual network 1.
    $vnet1 = New-AzureRmVirtualNetwork `
      -ResourceGroupName $rgName `
      -Name 'myVnet1' `
      -AddressPrefix '10.0.0.0/16' `
      -Location $location

    # Create virtual network 2.
    $vnet2 = New-AzureRmVirtualNetwork `
      -ResourceGroupName $rgName `
      -Name 'myVnet2' `
      -AddressPrefix '10.1.0.0/16' `
      -Location $location
    #
    ```
5. In your browser, copy the following script, then right-click in your PowerShell window to execute the script that creates a virtual network peering between the two virtual networks:
    ```powershell
    # Peer VNet1 to VNet2.
    Add-AzureRmVirtualNetworkPeering `
      -Name 'myVnet1ToMyVnet2' `
      -VirtualNetwork $vnet1 `
      -RemoteVirtualNetworkId $vnet2.Id

    # Peer VNet2 to VNet1.
    Add-AzureRmVirtualNetworkPeering `
      -Name 'myVnet2ToMyVnet1' `
      -VirtualNetwork $vnet2 `
      -RemoteVirtualNetworkId $vnet1.Id
    #
    ```
6. To review the subnets for the virtual network, copy the following command, and then paste it in the PowerShell window:

    ```powershell
    Get-AzureRmVirtualNetworkPeering `
      -ResourceGroupName myResourceGroup `
      -VirtualNetworkName myVnet1 `
      | Format-Table VirtualNetworkName, PeeringState
    #
    ```

Run the previous command again, replacing *myVnet1* with *myVnet2*. The output of both commands show **Connected** in the **PeeringState** column.
7. **Optional**: Though creating virtual machines is not covered in this tutorial, you can create a virtual machine in each virtual network and connect from one virtual machine to the other, to validate connectivity.
8. **Optional**: To delete the resources that you create in this tutorial, complete the steps in [Delete resources](#delete-powershell) in this article.

Any Azure resources you create in either virtual network are now able to communicate with each other through their IP addresses. If you're using default Azure name resolution for the virtual networks, the resources in the virtual networks are not able to resolve names across the virtual networks. If you want to resolve names across virtual networks in a peering, you must create your own DNS server. Learn how to set up [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server).

## <a name="template"></a>Create peering - Resource Manager template

1. Reference [Create a virtual network peering](https://azure.microsoft.com/resources/templates/201-vnet-to-vnet-peering) Resource Manager template. Instructions are provided with the template for deploying the template using the Azure portal, PowerShell, or the Azure CLI. Sign in to whichever tool you choose to deploy the template with using an account that has the necessary permissions to create a virtual network peering. See the [Permissions](#permissions) section of this article for details.
2. **Optional**: Though creating virtual machines is not covered in this tutorial, you can create a virtual machine in each virtual network and connect from one virtual machine to the other, to validate connectivity.
3. **Optional**: To delete the resources that you create in this tutorial, complete the steps in the [Delete resources](#delete) section of this article, using either the Azure portal, PowerShell, or the Azure CLI.

## <a name="different-models"></a>Peer virtual networks created through different deployment models

The steps in the previous sections explained how to create a virtual network peering between two virtual networks created through the Resource Manager deployment model. You can also create a peering between a virtual network (Resource Manager) and a virtual network (classic). You cannot create a virtual network peering between two virtual networks created through the classic deployment model. To learn more about Azure deployment models, read the [Understand Azure deployment models](../azure-resource-manager/resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article.

To create the virtual network peering, complete steps 1-11 in the [Portal](#portal) section of this article, but choose the **Classic** deployment model when creating myVnet2 in step 3.

When creating a virtual network peering between a virtual network (Resource Manager) and a virtual network (classic), you only configure the peering to the virtual network (classic) from the virtual network (Resource Manager). After creating the peering for the virtual network (Resource Manager), its peering status is **Updating**. The status automatically changes to **Connected** after a few seconds, because you don't need to create a peering for the virtual network (classic). 

> [!NOTE]
> Though not covered in this tutorial, you could adjust the scripts in the [Azure CLI](#cli) and [PowerShell](#powershell) sections of this article to reflect the differences covered in this section.

## <a name="different-subscriptions"></a>Peer virtual networks in different subscriptions

The steps in the previous sections explained how to create a virtual network peering between two virtual networks in the same subscription. You can also create a peering between virtual networks in different subscriptions, provided both subscriptions are associated to the same Azure Active Directory tenant. If you don't already have an AD tenant, you can quickly [create one](../active-directory/develop/active-directory-howto-tenant.md?toc=%2fazure%2fvirtual-network%2ftoc.json#start-from-scratch). If the subscriptions are associated to different Active Directory tenants, you cannot create a virtual network peering between virtual networks in different subscriptions. The steps to create the peering are slightly different, depending upon the deployment model the virtual networks were created through, as follows:

### <a name="different-subscriptions-same-deployment-model"></a>Both virtual networks created through Resource Manager

1. Complete steps 1-7 in the [Portal](#portal) section of this article, but choose a different subscription (associated to the same Azure Active Directory tenant) for myVnet2 in step 5 than you choose for myVnet1 in step 4.
2. In the **myVnet1** blade that appears, click **Access control (IAM)** from the vertical list of options on the left side of the blade.
3. In the **myVnet1 - Access control (IAM)** blade that appears, click **+ Add**.
4. In the **Add permissions** blade that appears, select **Network contributor** in the **Role** box.
5. In the **Select** box, select a username, or type an email address to search for one. The list of users shown is from the same Azure Active Directory tenant as the virtual network you're setting up the peering for.
6. Click **Save**.
7. In the **myVnet1 - Access control (IAM)** blade, click **Properties** from the vertical list of options on the left side of the blade. Copy the **RESOURCE ID**, which looks like the following example: /subscriptions/[Id]/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVnet1
8. Complete steps 1-7 of this section for myVnet2.
9. To ensure the authorization enabled successfully, sign out of Azure, then sign back in. If you used different accounts for the two virtual networks, sign out of both accounts and log back in to both.
10. In the **Search resources** box at the top of the portal, type *myResourceGroup*. Click **myResourceGroup** when it appears in the search results. A blade appears for the **myresourcegroup** resource group. The resource group contains the two virtual networks created in previous steps.
11. Click **myVNet1**.
12. In the **myVnet1** blade that appears, click **Peerings** from the vertical list of options on the left side of the blade.
13. In the **myVnet1 - Peerings** blade that appeared, click **+ Add**
14. In the **Add peering** blade that appears, enter, or select the following options, then click **OK**:
     - **Name**: *myVnet1ToMyVnet2*
     - **Virtual network deployment model**:  Select **Classic**. 
     - **I know my resource ID**: Check this box.
     - **Resource ID**: Enter the resource Id for myVnet2. This box only appears when the **I know my resource ID** checkbox is checked.
     - **Allow virtual network access:** Ensure that **Enabled** is selected.
    No other settings are used in this tutorial. To learn about all peering settings, read [Manage virtual network peerings](virtual-network-manage-peering.md#create-peering).
15. After clicking **OK** in the previous step, the **Add peering** blade closes and you see the **myVnet1 - Peerings** blade again. After a few seconds, the peering you created appears in the blade. **Initiated** is listed in the **PEERING STATUS** column for the **myVnet1ToMyVnet2** peering you created. You've peered Vnet1 to Vnet2, but now you must peer Vnet2 to Vnet1. The peering must be created in both directions to enable resources in the virtual networks to communicate with each other.
16. Complete steps 10-14 of this section again for myVnet2.  Name the peering *myVnet2ToMyVnet1* and enter the resource ID for myVnet1 for the **Resource ID**.
17. A few seconds after clicking **OK** to create the peering for MyVnet2, the **myVnet2ToMyVnet1** peering you just created is listed with **Connected** in the **PEERING STATUS** column.
18. Complete steps 10-11 of this section again for MyVnet1. The **PEERING STATUS** for the **myVnet1ToVNet2** peering is now also **Connected**. The peering is successfully established after you see **Connected** in the **PEERING STATUS** column for both virtual networks in the peering.
19. **Optional**: Though creating virtual machines is not covered in this tutorial, you can create a virtual machine in each virtual network and connect from one virtual machine to the other, to validate connectivity.
20. **Optional**: To delete the resources that you create in this tutorial, complete the steps in the [Delete resources](#delete-portal) section of this article.

### <a name="different-subscriptions-different-deployment-models"></a>One virtual network (Resource Manager), one virtual network (classic)
 
[!INCLUDE [virtual-network-create-udr-scenario-include.md](../../includes/virtual-network-preview.md)]

1. Register for the preview. You cannot peer virtual networks created through different deployment models that exist in different subscriptions until you're registered for the preview. You cannot register for the preview in the portal, or by using the Azure CLI. You can only register for the preview using PowerShell. To register for the preview, complete the following tasks:
    - Install the latest version of the PowerShell [AzureRm](https://www.powershellgallery.com/packages/AzureRM/) module. If you're new to Azure PowerShell, see [Azure PowerShell overview](/powershell/azure/overview?toc=%2fazure%2fvirtual-network%2ftoc.json).
    - To start a PowerShell session from a Windows PC, go to **Start**, enter **powershell**, and then click **PowerShell**.
    - In the PowerShell window, sign in to Azure by entering the `login-azurermaccount` command. The account you sign in with must have the necessary permissions to create a virtual network peering. See the [Permissions](#permissions) section of this article for details.
    - Register the preview capability for both Azure subscriptions and entering the following commands from PowerShell: 
    
    ```powershell
    Register-AzureRmProviderFeature `
      -FeatureName AllowClassicCrossSubscriptionPeering `
      -ProviderNamespace Microsoft.Network
    Register-AzureRmResourceProvider `
      -ProviderNamespace Microsoft.Network
    #
    ```
    Register for the preview while signed in to each subscription. Do not proceed with following steps until the **RegistrationState** output you receive after entering the following command is **Registered** in both subscriptions.

    ```powershell
    Get-AzureRmProviderFeature `
      -FeatureName AllowClassicCrossSubscriptionPeering `
      -ProviderNamespace Microsoft.Network
    #
    ```

2. Complete steps 1-7 in the [Portal](#portal) section of this article with the following changes:
    - Choose a different subscription (associated to the same Azure Active Directory tenant) for myVnet2 in step 5 than you choose for myVnet1 in step 4.
    - Choose **Classic** in step 3 when creating myVnet2.
3. In the **Search resources** box at the top of the portal, type *myResourceGroup*. Click **myResourceGroup** when it appears in the search results. A blade appears for the **myresourcegroup** resource group. The resource group contains the two virtual networks created in previous steps.
4. Click **myVNet1**.
5. Complete steps 2-9 in the [Both virtual networks created through Resource Manager](#different-subscriptions-same-deployment-model) section of this article.
6. In the **Search resources** box at the top of the portal, type *myResourceGroup*. Click **myResourceGroup** when it appears in the search results. A blade appears for the **myresourcegroup** resource group. The resource group contains the two virtual networks created in previous steps.
7. Click **myVNet1**.
8. In the **myVnet1** blade that appears, click **Peerings** from the vertical list of options on the left side of the blade.
9. In the **myVnet1 - Peerings** blade that appeared, click **+ Add**
10. In the **Add peering** blade that appears, enter, or select the following options, then click **OK**:
     - **Name**: *myVnet1ToMyVnet2*
     - **Virtual network deployment model**:  Select **Classic**. 
     - **I know my resource ID**: Check this box.
     - **Resource ID**: Enter the resource Id for myVnet2. This box only appears when the **I know my resource ID** checkbox is checked.
     - **Allow virtual network access:** Ensure that **Enabled** is selected.
    No other settings are used in this tutorial. To learn about all peering settings, read [Manage virtual network peerings](virtual-network-manage-peering.md#create-peering).

    When creating a virtual network peering between a virtual network (Resource Manager) and a virtual network (classic), you only configure the peering to the virtual network (classic) from the virtual network (Resource Manager). After creating the peering for the virtual network (Resource Manager), its peering status is **Updating**. The status automatically changes to **Connected** after a few seconds, because you don't need to create a peering for the virtual network (classic). 
11. **Optional**: Though creating virtual machines is not covered in this tutorial, you can create a virtual machine in each virtual network and connect from one virtual machine to the other, to validate connectivity.
12. **Optional**: To delete the resources that you create in this tutorial, complete the steps in the [Delete resources](#delete-portal) section of this article.

> [!NOTE]
> Though not covered in this tutorial, you could adjust the scripts in the [Azure CLI](#cli) and [PowerShell](#powershell) sections of this article to reflect the differences covered in this section.

## <a name="permissions"></a>Permissions

The accounts you use to create a virtual network peering must have the necessary role or permissions. For example, if you were peering two virtual networks named VNet1 and VNet2, your account must be assigned the following minimum role or permissions for each virtual network:
    
|Virtual network|Deployment model|Role|Permissions|
|---|---|---|---|
|VNet1|Resource Manager|[Network Contributor](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor)|Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write|
| |Classic|[Classic Network Contributor](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#classic-network-contributor)|N/A|
|VNet2|Resource Manager|[Network Contributor](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor)|Microsoft.Network/virtualNetworks/peer|
||Classic|[Classic Network Contributor](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#classic-network-contributor)|Microsoft.ClassicNetwork/virtualNetworks/peer|

Learn more about [built-in roles](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) and assigning specific permissions to [custom roles](../active-directory/role-based-access-control-custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) (Resource Manager only).

## <a name="delete"></a>Delete resources
When you've finished this tutorial, you might want to delete the resources you created in the tutorial, so you don't incur usage charges. Deleting a resource group also deletes all resources that are in the resource group.

### <a name="delete-portal"></a>Azure portal

1. In the portal search box, enter **myResourceGroup**. In the search results, click **myResourceGroup**.
2. On the **myResourceGroup** blade, click the **Delete** icon.
3. To confirm the deletion, in the **TYPE THE RESOURCE GROUP NAME** box, enter **myResourceGroup**, and then click **Delete**.

### <a name="delete-cli"></a>Azure CLI

From a Linux, macOS, or Windows command shell, enter the command that follows. Alternatively, click the Try It button at the top right of the following code block to launch the Cloud Shell. Then, use the Copy button to copy and paste the sample code into the Cloud Shell.

```azurecli-interactive
az group delete --name myResourceGroup --yes
```

### <a name="delete-powershell"></a>PowerShell

At the PowerShell command prompt, enter the following command:

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Next steps

- Thoroughly familiarize yourself with important [virtual network peering constraints and behaviors](virtual-network-manage-peering.md#about-peering) before creating a virtual network peering for production use.
- Learn about all [virtual network peering settings](virtual-network-manage-peering.md#create-peering).
- Learn how to [create a hub and spoke network topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?toc=%2fazure%2fvirtual-network%2ftoc.json#vnet-peering) with virtual network peering.
