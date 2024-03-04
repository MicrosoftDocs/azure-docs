---
title: 'Tutorial: Restrict access to PaaS resources with service endpoints - Azure portal'
description: In this tutorial, you learn how to limit and restrict network access to Azure resources, such as an Azure Storage, with virtual network service endpoints using the Azure portal.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: tutorial
ms.date: 08/08/2023
ms.custom: template-tutorial
# Customer intent: I want only resources in a virtual network subnet to access an Azure PaaS resource, such as an Azure Storage account.
---

# Tutorial: Restrict network access to PaaS resources with virtual network service endpoints using the Azure portal

Virtual network service endpoints enable you to limit network access to some Azure service resources to a virtual network subnet. You can also remove internet access to the resources. Service endpoints provide direct connection from your virtual network to supported Azure services, allowing you to use your virtual network's private address space to access the Azure services. Traffic destined to Azure resources through service endpoints always stays on the Microsoft Azure backbone network.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network with one subnet
> * Add a subnet and enable a service endpoint
> * Create an Azure resource and allow network access to it from only a subnet
> * Deploy a virtual machine (VM) to each subnet
> * Confirm access to a resource from a subnet
> * Confirm access is denied to a resource from a subnet and the internet

This tutorial uses the Azure portal. You can also complete it using the [Azure CLI](tutorial-restrict-network-access-to-resources-cli.md) or [PowerShell](tutorial-restrict-network-access-to-resources-powershell.md).

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

[!INCLUDE [virtual-network-create-with-bastion.md](../../includes/virtual-network-create-with-bastion.md)]

## Enable a service endpoint

Service endpoints are enabled per service, per subnet. 

1. In the search box at the top of the portal page, search for **Virtual network**. Select **Virtual networks** in the search results.

1. In **Virtual networks**, select **vnet-1**.

1. In the **Settings** section of **vnet-1**, select **Subnets**.

1. Select **+ Subnet**.

1. On the **Add subnet** page, enter or select the following information:

    | Setting | Value |
    | --- | --- |
    | Name | **subnet-private** |
    | Subnet address range | Leave the default of **10.0.2.0/24**. |
    | **SERVICE ENDPOINTS** |  |
    | Services| Select **Microsoft.Storage**|

1. Select **Save**.

> [!CAUTION]
> Before enabling a service endpoint for an existing subnet that has resources in it, see [Change subnet settings](virtual-network-manage-subnet.md#change-subnet-settings).

## Restrict network access for a subnet

By default, all virtual machine instances in a subnet can communicate with any resources. You can limit communication to and from all resources in a subnet by creating a network security group, and associating it to the subnet.

1. In the search box at the top of the portal page, search for **Network security group**. Select **Network security groups** in the search results.

1. In **Network security groups**, select **+ Create**.

1. In the **Basics** tab of **Create network security group**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Name | Enter **nsg-storage**. |
    | Region | Select **East US 2**. |

1. Select **Review + create**, then select **Create**.

### Create outbound NSG rules

1. In the search box at the top of the portal page, search for **Network security group**. Select **Network security groups** in the search results.

1. Select **nsg-storage**.

1. Select **Outbound security rules** in **Settings**.

1. Select **+ Add**.

1. Create a rule that allows outbound communication to the Azure Storage service. Enter or select the following information in **Add outbound security rule**:

    | Setting | Value |
    | ------- | ----- |
    | Source | Select **Service Tag**. |
    | Source service tag | Select **VirtualNetwork**. |
    | Source port ranges | Leave the default of **\***. |
    | Destination | Select **Service Tag**. |
    | Destination service tag | Select **Storage**. |
    | Service | Leave default of **Custom**. |
    | Destination port ranges | Enter **445**. </br> SMB protocol is used to connect to a file share created in a later step. |
    | Protocol | Select **Any**. |
    | Action | Select **Allow**. |
    | Priority | Leave the default of **100**. |
    | Name | Enter **allow-storage-all**. |

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/create-outbound-storage-rule.png" alt-text="Screenshot of creating an outbound security to access storage.":::

1. Select **+ Add**.

1. Create another outbound security rule that denies communication to the internet. This rule overrides a default rule in all network security groups that allows outbound internet communication. Complete the previous steps with the following values in **Add outbound security rule**:

    | Setting | Value |
    | ------- | ----- |
    | Source | Select **Service Tag**. |
    | Source service tag | Select **VirtualNetwork**. |
    | Source port ranges | Leave the default of **\***. |
    | Destination | Select **Service Tag**. |
    | Destination service tag | Select **Internet**. |
    | Service | Leave default of **Custom**. |
    | Destination port ranges | Enter **\***. |
    | Protocol | Select **Any**. |
    | Action | Select **Deny**. |
    | Priority | Leave the default **110**. |
    | Name | Enter **deny-internet-all**. |

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/create-outbound-internet-rule.png" alt-text="Screenshot of creating an outbound security to block internet access.":::

1. Select **Add**.

### Associate the network security group to a subnet

1. In the search box at the top of the portal page, search for **Network security group**. Select **Network security groups** in the search results.

1. Select **nsg-storage**.

1. Select **Subnets** in **Settings**.

1. Select **+ Associate**.

1. In **Associate subnet**, select **vnet-1** in **Virtual network**. Select **subnet-private** in **Subnet**. 

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/associate-nsg-private-subnet.png" alt-text="Screenshot of private subnet associated with network security group.":::

1. Select **OK**.

## Restrict network access to a resource

The steps required to restrict network access to resources created through Azure services, which are enabled for service endpoints vary across services. See the documentation for individual services for specific steps for each service. The rest of this tutorial includes steps to restrict network access for an Azure Storage account, as an example.

[!INCLUDE [create-storage-account.md](../../includes/create-storage-account.md)]

### Create a file share in the storage account

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage accounts** in the search results.

1. In **Storage accounts**, select the storage account you created in the previous step.

1. In **Data storage**, select **File shares**.

1. Select **+ File share**.

1. Enter or select the following information in **New file share**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **file-share**. |
    | Tier | Leave the default of **Transaction optimized**. |

1. Select **Next: Backup**.

1. Deselect **Enable backup**.

1. Select **Review + create**, then select **Create**.

### Restrict network access to a subnet

By default, storage accounts accept network connections from clients in any network, including the internet. You can restrict network access from the internet, and all other subnets in all virtual networks (except the **subnet-private** subnet in the **vnet-1** virtual network.) 

To restrict network access to a subnet:

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage accounts** in the search results.

1. Select your storage account.

1. In **Security + networking**, select **Networking**.

1. In the **Firewalls and virtual networks** tab, select **Enabled from selected virtual networks and IP addresses** in **Public network access**.

1. In **Virtual networks**, select **+ Add existing virtual network**.

1. In **Add networks**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription. |
    | Virtual networks | Select **vnet-1**. |
    | Subnets | Select **subnet-private**. |

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/restrict-network-access.png" alt-text="Screenshot of restriction of storage account to the subnet and virtual network created previously.":::

1. Select **Add**.

1. Select **Save** to save the virtual network configurations.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/restrict-network-access-save.png" alt-text="Screenshot of storage account screen and confirmation of subnet restriction.":::

## Create virtual machines

To test network access to a storage account, deploy a virtual machine to each subnet.

[!INCLUDE [create-test-virtual-machine.md](../../includes/create-test-virtual-machine.md)]

### Create the second virtual machine

1. Repeat the steps in the previous section to create a second virtual machine. Replace the following values in **Create a virtual machine**:

    | Setting | Value |
    | ------- | ----- |
    | Virtual machine name | Enter **vm-private**. |
    | Subnet | Select **subnet-private**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **None**. |

    > [!WARNING]
    > Do not continue to the next step until the deployment is completed.

## Confirm access to storage account

The virtual machine you created earlier that is assigned to the **subnet-private** subnet is used to confirm access to the storage account. The virtual machine you created in the previous section that is assigned to the **subnet-1** subnet is used to confirm that access to the storage account is blocked.

### Get storage account access key

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage accounts** in the search results.

1. In **Storage accounts**, select your storage account.

1. In **Security + networking**, select **Access keys**.

1. Copy the value of **key1**. You may need to select the **Show** button to display the key.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/storage-account-access-key.png" alt-text="Screenshot of storage account access key.":::

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-private**.

1. Select **Bastion** in **Operations**.

1. Enter the username and password you specified when creating the virtual machine. Select **Connect**.

1. Open Windows PowerShell. Use the following script to map the Azure file share to drive Z. 

    * Replace `<storage-account-key>` with the key you copied in the previous step. 

    * Replace `<storage-account-name>` with the name of your storage account. In this example, it's **storage8675**.

   ```powershell
    $key = @{
        String = "<storage-account-key>"
    }
    $acctKey = ConvertTo-SecureString @key -AsPlainText -Force
    
    $cred = @{
        ArgumentList = "Azure\<storage-account-name>", $acctKey
    }
    $credential = New-Object System.Management.Automation.PSCredential @cred

    $map = @{
        Name = "Z"
        PSProvider = "FileSystem"
        Root = "\\<storage-account-name>.file.core.windows.net\file-share"
        Credential = $credential
    }
    New-PSDrive @map
   ```

   PowerShell returns output similar to the following example output:

   ```output
   Name        Used (GB)     Free (GB) Provider      Root
   ----        ---------     --------- --------      ----
   Z                                      FileSystem    \\storage8675.file.core.windows.net\f...
   ```

   The Azure file share successfully mapped to the Z drive.

1. Close the Bastion connection to **vm-private**.

## Confirm access is denied to storage account

### From vm-1

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. Select **Bastion** in **Operations**.

1. Enter the username and password you specified when creating the virtual machine. Select **Connect**.

1. Repeat the previous command to attempt to map the drive to the file share in the storage account. You may need to copy the storage account access key again for this procedure:

    ```powershell
    $key = @{
        String = "<storage-account-key>"
    }
    $acctKey = ConvertTo-SecureString @key -AsPlainText -Force
    
    $cred = @{
        ArgumentList = "Azure\<storage-account-name>", $acctKey
    }
    $credential = New-Object System.Management.Automation.PSCredential @cred

    $map = @{
        Name = "Z"
        PSProvider = "FileSystem"
        Root = "\\<storage-account-name>.file.core.windows.net\file-share"
        Credential = $credential
    }
    New-PSDrive @map
   ```
    
1. You should receive the following error message:

    ```output
    New-PSDrive : Access is denied
    At line:1 char:5
    +     New-PSDrive @map
    +     ~~~~~~~~~~~~~~~~
        + CategoryInfo          : InvalidOperation: (Z:PSDriveInfo) [New-PSDrive], Win32Exception
        + FullyQualifiedErrorId : CouldNotMapNetworkDrive,Microsoft.PowerShell.Commands.NewPSDriveCommand
    ```

4. Close the Bastion connection to **vm-1**.

### From a local machine:

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage accounts** in the search results.

1. In **Storage accounts**, select your storage account.

1. In **Data storage**, select **File shares**.

1. Select **file-share**.

1. Select **Browse** in the left-hand menu.

1. You should receive the following error message:

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/access-denied-error.png" alt-text="Screenshot of access denied error message.":::

>[!NOTE] 
> The access is denied because your computer isn't in the **subnet-private** subnet of the **vnet-1** virtual network.

[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

In this tutorial:

* You enabled a service endpoint for a virtual network subnet.

* You learned that you can enable service endpoints for resources deployed from multiple Azure services.

* You created an Azure Storage account and restricted the network access to the storage account to only resources within a virtual network subnet. 

To learn more about service endpoints, see [Service endpoints overview](virtual-network-service-endpoints-overview.md) and [Manage subnets](virtual-network-manage-subnet.md).

If you have multiple virtual networks in your account, you may want to establish connectivity between them so that resources can communicate with each other. To learn how to connect virtual networks, advance to the next tutorial.

> [!div class="nextstepaction"]
> [Connect virtual networks](./tutorial-connect-virtual-networks-portal.md)
