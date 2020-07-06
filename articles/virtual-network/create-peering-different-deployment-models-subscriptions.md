---
title: Create an Azure virtual network peering - different deployment models -different subscriptions
titlesuffix: Azure Virtual Network
description: Learn how to create a virtual network peering between virtual networks created through different Azure deployment models that exist in different Azure subscriptions.
services: virtual-network
documentationcenter: ''
author: KumudD
ms.service: virtual-network
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/25/2020
ms.author: kumud
ms.reviewer: anavin

---
# Create a virtual network peering - different deployment models and subscriptions

In this tutorial, you learn to create a virtual network peering between virtual networks created through different deployment models. The virtual networks exist in different subscriptions. Peering two virtual networks enables resources in different virtual networks to communicate with each other with the same bandwidth and latency as though the resources were in the same virtual network. Learn more about [Virtual network peering](virtual-network-peering-overview.md).

The steps to create a virtual network peering are different, depending on whether the virtual networks are in the same, or different, subscriptions, and which [Azure deployment model](../azure-resource-manager/management/deployment-models.md?toc=%2fazure%2fvirtual-network%2ftoc.json) the virtual networks are created through. Learn how to create a virtual network peering in other scenarios by clicking the scenario from the following table:

|Azure deployment model  | Azure subscription  |
|--------- |---------|
|[Both Resource Manager](tutorial-connect-virtual-networks-portal.md) |Same|
|[Both Resource Manager](create-peering-different-subscriptions.md) |Different|
|[One Resource Manager, one classic](create-peering-different-deployment-models.md) |Same|

A virtual network peering cannot be created between two virtual networks deployed through the classic deployment model. This tutorial uses virtual networks that exist in the same region. This tutorial peers virtual networks in the same region. You can also peer virtual networks in different [supported regions](virtual-network-manage-peering.md#cross-region). It's recommended that you familiarize yourself with the [peering requirements and constraints](virtual-network-manage-peering.md#requirements-and-constraints) before peering virtual networks.

When creating a virtual network peering between virtual networks that exist in different subscriptions, the subscriptions can associated to the same Azure Active Directory tenant. If you don't already have an Azure Active Directory tenant, you can quickly [create one](../active-directory/develop/quickstart-create-new-tenant.md?toc=%2fazure%2fvirtual-network%2ftoc.json#create-a-new-azure-ad-tenant).

You can use the [Azure portal](#portal), the Azure [command-line interface](#cli) (CLI), or Azure [PowerShell](#powershell) to create a virtual network peering. Click any of the previous tool links to go directly to the steps for creating a virtual network peering using your tool of choice.

## <a name="portal"></a>Create peering - Azure portal

This tutorial uses different accounts for each subscription. If you're using an account that has permissions to both subscriptions, you can use the same account for all steps, skip the steps for logging out of the portal, and skip the steps for assigning another user permissions to the virtual networks.

1. Log in to the [Azure portal](https://portal.azure.com) as UserA. The account you log in with must have the necessary permissions to create a virtual network peering. For a list of permissions, see [Virtual network peering permissions](virtual-network-manage-peering.md#permissions).
2. Click **+ New**, click **Networking**, then click **Virtual network**.
3. In the **Create virtual network** blade, enter, or select values for the following settings, then click **Create**:
    - **Name**: *myVnetA*
    - **Address space**: *10.0.0.0/16*
    - **Subnet name**: *default*
    - **Subnet address range**: *10.0.0.0/24*
    - **Subscription**: Select subscription A.
    - **Resource group**: Select **Create new** and enter *myResourceGroupA*
    - **Location**: *East US*
4. In the **Search resources** box at the top of the portal, type *myVnetA*. Click **myVnetA** when it appears in the search results. A blade appears for the **myVnetA** virtual network.
5. In the **myVnetA** blade that appears, click **Access control (IAM)** from the vertical list of options on the left side of the blade.
6. In the **myVnetA - Access control (IAM)** blade that appears, click **+ Add role assignment**.
7. In the **Add role assignment** blade that appears, select **Network contributor** in the **Role** box.
8. In the **Select** box, select UserB, or type UserB's email address to search for it. The list of users shown is from the same Azure Active Directory tenant as the virtual network you're setting up the peering for. Click UserB when it appears in the list.
9. Click **Save**.
10. Log out of the portal as UserA, then log in as UserB.
11. Click **+ New**, type *Virtual network* in the **Search the Marketplace** box, then click **Virtual network** in the search results.
12. In the **Virtual Network** blade that appears, select **Classic** in the **Select a deployment model** box, then click **Create**.
13. In the Create virtual network (classic) box that appears, enter the following values:

    - **Name**: *myVnetB*
    - **Address space**: *10.1.0.0/16*
    - **Subnet name**: *default*
    - **Subnet address range**: *10.1.0.0/24*
    - **Subscription**: Select subscription B.
    - **Resource group**: Select **Create new** and enter *myResourceGroupB*
    - **Location**: *East US*

14. In the **Search resources** box at the top of the portal, type *myVnetB*. Click **myVnetB** when it appears in the search results. A blade appears for the **myVnetB** virtual network.
15. In the **myVnetB** blade that appears, click **Properties** from the vertical list of options on the left side of the blade. Copy the **RESOURCE ID**, which is used in a later step. The resource ID is similar to the following example: `/subscriptions/<Subscription ID>/resourceGroups/myResourceGroupB/providers/Microsoft.ClassicNetwork/virtualNetworks/myVnetB`
16. Complete steps 5-9 for myVnetB, entering **UserA** in step 8.
17. Log out of the portal as UserB and log in as UserA.
18. In the **Search resources** box at the top of the portal, type *myVnetA*. Click **myVnetA** when it appears in the search results. A blade appears for the **myVnet** virtual network.
19. Click **myVnetA**.
20. In the **myVnetA** blade that appears, click **Peerings** from the vertical list of options on the left side of the blade.
21. In the **myVnetA - Peerings** blade that appeared, click **+ Add**
22. In the **Add peering** blade that appears, enter, or select the following options, then click **OK**:
     - **Name**: *myVnetAToMyVnetB*
     - **Virtual network deployment model**:  Select **Classic**.
     - **I know my resource ID**: Check this box.
     - **Resource ID**: Enter the resource ID of myVnetB from step 15.
     - **Allow virtual network access:** Ensure that **Enabled** is selected.
    No other settings are used in this tutorial. To learn about all peering settings, read [Manage virtual network peerings](virtual-network-manage-peering.md#create-a-peering).
23. After clicking **OK** in the previous step, the **Add peering** blade closes and you see the **myVnetA - Peerings** blade again. After a few seconds, the peering you created appears in the blade. **Connected** is listed in the **PEERING STATUS** column for the **myVnetAToMyVnetB** peering you created. The peering is now established. There is no need to peer the virtual network (classic) to the virtual network (Resource Manager).

    Any Azure resources you create in either virtual network are now able to communicate with each other through their IP addresses. If you're using default Azure name resolution for the virtual networks, the resources in the virtual networks are not able to resolve names across the virtual networks. If you want to resolve names across virtual networks in a peering, you must create your own DNS server. Learn how to set up [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).

24. **Optional**: Though creating virtual machines is not covered in this tutorial, you can create a virtual machine in each virtual network and connect from one virtual machine to the other, to validate connectivity.
25. **Optional**: To delete the resources that you create in this tutorial, complete the steps in the [Delete resources](#delete-portal) section of this article.

## <a name="cli"></a>Create peering - Azure CLI

This tutorial uses different accounts for each subscription. If you're using an account that has permissions to both subscriptions, you can use the same account for all steps, skip the steps for logging out of Azure, and remove the lines of script that create user role assignments. Replace UserA@azure.com and UserB@azure.com in all of the following scripts with the usernames you're using for UserA and UserB. Complete the following steps using the Azure classic CLI and the Azure CLI. You can complete the steps from the Azure Cloud Shell, by just selecting the **Try it** button in any of the following steps, or by installing the [classic CLI](/cli/azure/install-classic-cli) and [CLI](/cli/azure/install-azure-cli) and running the commands on your local computer.

1. If using the Cloud Shell, skip to step 2, because the Cloud Shell automatically signs you in to Azure. Open a command session and sign in to Azure using the `azure login` command.
2. Run the classic CLI in Service Management mode by entering the `azure config mode asm` command.
3. Enter the following classic CLI command to create the virtual network (classic):

    ```console
    azure network vnet create --vnet myVnetB --address-space 10.1.0.0 --cidr 16 --location "East US"
    ```

4. The remaining steps must be completed using a bash shell with the Azure CLI (not the classic CLI).
5. Copy the following script to a text editor on your PC. Replace `<SubscriptionB-Id>` with your subscription ID. If you don't know your subscription Id, enter the `az account show` command. The value for **id** in the output is your subscription Id. Copy the modified script, paste it in to your CLI session, and then press `Enter`.

    ```azurecli-interactive
    az role assignment create \
      --assignee UserA@azure.com \
      --role "Classic Network Contributor" \
      --scope /subscriptions/<SubscriptionB-Id>/resourceGroups/Default-Networking/providers/Microsoft.ClassicNetwork/virtualNetworks/myVnetB
    ```

    When you created the virtual network (classic) in step 4, Azure created the virtual network in the *Default-Networking* resource group.
6. Log UserB out of Azure and log in as UserA in the CLI.
7. Create a resource group and a virtual network (Resource Manager). Copy the following script, paste it in to your CLI session, and then press `Enter`.

    ```azurecli-interactive
    #!/bin/bash

    # Variables for common values used throughout the script.
    rgName="myResourceGroupA"
    location="eastus"

    # Create a resource group.
    az group create \
      --name $rgName \
      --location $location

    # Create virtual network A (Resource Manager).
    az network vnet create \
      --name myVnetA \
      --resource-group $rgName \
      --location $location \
      --address-prefix 10.0.0.0/16

    # Get the id for myVnetA.
    vNetAId=$(az network vnet show \
      --resource-group $rgName \
      --name myVnetA \
      --query id --out tsv)

    # Assign UserB permissions to myVnetA.
    az role assignment create \
      --assignee UserB@azure.com \
      --role "Network Contributor" \
      --scope $vNetAId
    ```

8. Create a virtual network peering between the two virtual networks created through the different deployment models. Copy the following script to a text editor on your PC. Replace `<SubscriptionB-id>` with your subscription Id. If you don't know your subscription Id, enter the `az account show` command. The value for **id** in the output is your subscription Id. Azure created the virtual network (classic) you created in step 4 in a resource group named *Default-Networking*. Paste the modified script in your CLI session, and then press `Enter`.

    ```azurecli-interactive
    # Peer VNet1 to VNet2.
    az network vnet peering create \
      --name myVnetAToMyVnetB \
      --resource-group $rgName \
      --vnet-name myVnetA \
      --remote-vnet-id  /subscriptions/<SubscriptionB-id>/resourceGroups/Default-Networking/providers/Microsoft.ClassicNetwork/virtualNetworks/myVnetB \
      --allow-vnet-access
    ```

9. After the script executes, review the peering for the virtual network (Resource Manager). Copy the following script, and then paste it in your CLI session:

    ```azurecli-interactive
    az network vnet peering list \
      --resource-group $rgName \
      --vnet-name myVnetA \
      --output table
    ```

    The output shows **Connected** in the **PeeringState** column.

    Any Azure resources you create in either virtual network are now able to communicate with each other through their IP addresses. If you're using default Azure name resolution for the virtual networks, the resources in the virtual networks are not able to resolve names across the virtual networks. If you want to resolve names across virtual networks in a peering, you must create your own DNS server. Learn how to set up [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).

10. **Optional**: Though creating virtual machines is not covered in this tutorial, you can create a virtual machine in each virtual network and connect from one virtual machine to the other, to validate connectivity.
11. **Optional**: To delete the resources that you create in this tutorial, complete the steps in [Delete resources](#delete-cli) in this article.

## <a name="powershell"></a>Create peering - PowerShell

This tutorial uses different accounts for each subscription. If you're using an account that has permissions to both subscriptions, you can use the same account for all steps, skip the steps for logging out of Azure, and remove the lines of script that create user role assignments. Replace UserA@azure.com and UserB@azure.com in all of the following scripts with the usernames you're using for UserA and UserB. 

1. Install the latest version of the PowerShell [Azure](https://www.powershellgallery.com/packages/Azure) and [Az](https://www.powershellgallery.com/packages/Az) modules. If you're new to Azure PowerShell, see [Azure PowerShell overview](/powershell/azure/overview?toc=%2fazure%2fvirtual-network%2ftoc.json).
2. Start a PowerShell session.
3. In PowerShell, log in to UserB's subscription as UserB by entering the `Add-AzureAccount` command. The account you log in with must have the necessary permissions to create a virtual network peering. For a list of permissions, see [Virtual network peering permissions](virtual-network-manage-peering.md#permissions).
4. To create a virtual network (classic) with PowerShell, you must create a new, or modify an existing, network configuration file. Learn how to [export, update, and import network configuration files](virtual-networks-using-network-configuration-file.md). The file should include the following **VirtualNetworkSite** element for the virtual network used in this tutorial:

    ```xml
    <VirtualNetworkSite name="myVnetB" Location="East US">
      <AddressSpace>
        <AddressPrefix>10.1.0.0/16</AddressPrefix>
      </AddressSpace>
      <Subnets>
        <Subnet name="default">
          <AddressPrefix>10.1.0.0/24</AddressPrefix>
        </Subnet>
      </Subnets>
    </VirtualNetworkSite>
    ```

    > [!WARNING]
    > Importing a changed network configuration file can cause changes to existing virtual networks (classic) in your subscription. Ensure you only add the previous virtual network and that you don't change or remove any existing virtual networks from your subscription. 

5. Log in to UserB's subscription as UserB to use Resource Manager commands by entering the `Connect-AzAccount` command.
6. Assign UserA permissions to virtual network B. Copy the following script to a text editor on your PC and replace `<SubscriptionB-id>` with the ID of subscription B. If you don't know the subscription Id, enter the `Get-AzSubscription` command to view it. The value for **Id** in the returned output is your subscription ID. Azure created the virtual network (classic) you created in step 4 in a resource group named *Default-Networking*. To execute the script, copy the modified script, paste it in to PowerShell, and then press `Enter`.

    ```powershell
    New-AzRoleAssignment `
      -SignInName UserA@azure.com `
      -RoleDefinitionName "Classic Network Contributor" `
      -Scope /subscriptions/<SubscriptionB-id>/resourceGroups/Default-Networking/providers/Microsoft.ClassicNetwork/virtualNetworks/myVnetB
    ```

7. Log out of Azure as UserB and log in to UserA's subscription as UserA by entering the `Connect-AzAccount` command. The account you log in with must have the necessary permissions to create a virtual network peering. For a list of permissions, see [Virtual network peering permissions](virtual-network-manage-peering.md#permissions).
8. Create the virtual network (Resource Manager) by copying the following script, pasting it in to PowerShell, and then pressing `Enter`:

    ```powershell
    # Variables for common values
      $rgName='MyResourceGroupA'
      $location='eastus'

    # Create a resource group.
    New-AzResourceGroup `
      -Name $rgName `
      -Location $location

    # Create virtual network A.
    $vnetA = New-AzVirtualNetwork `
      -ResourceGroupName $rgName `
      -Name 'myVnetA' `
      -AddressPrefix '10.0.0.0/16' `
      -Location $location
    ```

9. Assign UserB permissions to myVnetA. Copy the following script to a text editor on your PC and replace `<SubscriptionA-Id>` with the ID of subscription A. If you don't know the subscription Id, enter the `Get-AzSubscription` command to view it. The value for **Id** in the returned output is your subscription ID. Paste the modified version of the script in PowerShell, and then press `Enter` to execute it.

    ```powershell
    New-AzRoleAssignment `
      -SignInName UserB@azure.com `
      -RoleDefinitionName "Network Contributor" `
      -Scope /subscriptions/<SubscriptionA-Id>/resourceGroups/myResourceGroupA/providers/Microsoft.Network/VirtualNetworks/myVnetA
    ```

10. Copy the following script to a text editor on your PC, and replace `<SubscriptionB-id>` with the ID of subscription B. To peer myVnetA to myVNetB, copy the modified script, paste it in to PowerShell, and then press `Enter`.

    ```powershell
    Add-AzVirtualNetworkPeering `
      -Name 'myVnetAToMyVnetB' `
      -VirtualNetwork $vnetA `
      -RemoteVirtualNetworkId /subscriptions/<SubscriptionB-id>/resourceGroups/Default-Networking/providers/Microsoft.ClassicNetwork/virtualNetworks/myVnetB
    ```

11. View the peering state of myVnetA by copying the following script, pasting it into PowerShell, and pressing `Enter`.

    ```powershell
    Get-AzVirtualNetworkPeering `
      -ResourceGroupName $rgName `
      -VirtualNetworkName myVnetA `
      | Format-Table VirtualNetworkName, PeeringState
    ```

    The state is **Connected**. It changes to **Connected** once you set up the peering to myVnetA from myVnetB.

    Any Azure resources you create in either virtual network are now able to communicate with each other through their IP addresses. If you're using default Azure name resolution for the virtual networks, the resources in the virtual networks are not able to resolve names across the virtual networks. If you want to resolve names across virtual networks in a peering, you must create your own DNS server. Learn how to set up [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).

12. **Optional**: Though creating virtual machines is not covered in this tutorial, you can create a virtual machine in each virtual network and connect from one virtual machine to the other, to validate connectivity.
13. **Optional**: To delete the resources that you create in this tutorial, complete the steps in [Delete resources](#delete-powershell) in this article.

## <a name="delete"></a>Delete resources
When you've finished this tutorial, you might want to delete the resources you created in the tutorial, so you don't incur usage charges. Deleting a resource group also deletes all resources that are in the resource group.

### <a name="delete-portal"></a>Azure portal

1. In the portal search box, enter **myResourceGroupA**. In the search results, click **myResourceGroupA**.
2. On the **myResourceGroupA** blade, click the **Delete** icon.
3. To confirm the deletion, in the **TYPE THE RESOURCE GROUP NAME** box, enter **myResourceGroupA**, and then click **Delete**.
4. In the **Search resources** box at the top of the portal, type *myVnetB*. Click **myVnetB** when it appears in the search results. A blade appears for the **myVnetB** virtual network.
5. In the **myVnetB** blade, click **Delete**.
6. To confirm the deletion, click **Yes** in the **Delete virtual network** box.

### <a name="delete-cli"></a>Azure CLI

1. Log in to Azure using the CLI to delete the virtual network (Resource Manager) with the following command:

   ```azurecli-interactive
   az group delete --name myResourceGroupA --yes
   ```

2. Sign in to Azure using the classic CLI to delete the virtual network (classic) with the following commands:

   ```console
   azure config mode asm

   azure network vnet delete --vnet myVnetB --quiet
   ```

### <a name="delete-powershell"></a>PowerShell

1. At the PowerShell command prompt, enter the following command to delete the virtual network (Resource Manager):

   ```powershell
   Remove-AzResourceGroup -Name myResourceGroupA -Force
   ```

2. To delete the virtual network (classic) with PowerShell, you must modify an existing network configuration file. Learn how to [export, update, and import network configuration files](virtual-networks-using-network-configuration-file.md). Remove the following VirtualNetworkSite element for the virtual network used in this tutorial:

   ```xml
   <VirtualNetworkSite name="myVnetB" Location="East US">
     <AddressSpace>
       <AddressPrefix>10.1.0.0/16</AddressPrefix>
     </AddressSpace>
     <Subnets>
       <Subnet name="default">
         <AddressPrefix>10.1.0.0/24</AddressPrefix>
       </Subnet>
     </Subnets>
   </VirtualNetworkSite>
   ```

   > [!WARNING]
   > Importing a changed network configuration file can cause changes to existing virtual networks (classic) in your subscription. Ensure you only remove the previous virtual network and that you don't change or remove any other existing virtual networks from your subscription. 

## Next steps

- Thoroughly familiarize yourself with important [virtual network peering constraints and behaviors](virtual-network-manage-peering.md#requirements-and-constraints) before creating a virtual network peering for production use.
- Learn about all [virtual network peering settings](virtual-network-manage-peering.md#create-a-peering).
- Learn how to [create a hub and spoke network topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke#virtual-network-peering) with virtual network peering.
