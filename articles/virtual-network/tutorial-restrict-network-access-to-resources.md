---
title: 'Tutorial: Restrict access to PaaS resources with service endpoints - Azure portal'
description: In this tutorial, you learn how to limit and restrict network access to Azure resources, such as an Azure Storage, with virtual network service endpoints using the Azure portal.
documentationcenter: virtual-network
author: asudbring
ms.author: allensu
manager: kumudD
tags: azure-resource-manager
services: virtual-network
ms.service: virtual-network
ms.topic: tutorial
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 06/29/2022
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

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure subscription

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual network

1. From the Azure portal menu, select **+ Create a resource**.

1. Search for *Virtual Network*, and then select **Create**.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/create-resources.png" alt-text="Screenshot of search for virtual network in create a resource page.":::    

1. On the **Basics** tab, enter the following information and then select **Next: IP Addresses >**. 

   | Setting | Value |
   |----|----|
   | Subscription | Select your subscription. |
   | Resource group | Select **Create new** and enter *myResourceGroup*.|
   | Name | Enter *myVirtualNetwork*. |
   | Region | Select **East US** |

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/create-virtual-network.png" alt-text="Screenshot of basics tab for create a virtual network.":::  

1. On the **IP Addresses** tab, select the following IP address settings and then select **Review + create**.
   
   | Setting | Value |
   | --- | --- |
   | IPv4 address space| Leave as default. |
   | Subnet name | Select **default** and change the subnet name to "Public". |
   | Subnet Address Range | Leave as default. |

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/create-virtual-network-ip-addresses.png" alt-text="Screenshot of IP addresses tab for create a virtual network.":::  

1. If the validation checks pass, select **Create**.

1. Wait for the deployment to finish, then select **Go to resource** or move on to the next section. 

## Enable a service endpoint

Service endpoints are enabled per service, per subnet. To create a subnet and enable a service endpoint for the subnet:

1. If you're not already on the virtual network resource page, you can search for the newly created virtual network in the box at the top of the portal. Enter *myVirtualNetwork*, and select it from the list.

1. Select **Subnets** under **Settings**, and then select **+ Subnet**, as shown:

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/add-subnet.png" alt-text="Screenshot of adding subnet to an existing virtual network.":::

1. On the **Add subnet** page, enter or select the following information, and then select **Save**:

    | Setting |Value |
    | --- | --- |
    | Name | Private |
    | Subnet address range | Leave as default|
    | Service endpoints | Select **Microsoft.Storage**|
    | Service endpoint policies | Leave default. *0 selected*. |

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/add-subnet-settings.png" alt-text="Screenshot of add a subnet page with service endpoints configured.":::  

> [!CAUTION]
> Before enabling a service endpoint for an existing subnet that has resources in it, see [Change subnet settings](virtual-network-manage-subnet.md#change-subnet-settings).

## Restrict network access for a subnet

By default, all virtual machine instances in a subnet can communicate with any resources. You can limit communication to and from all resources in a subnet by creating a network security group, and associating it to the subnet:

1. In the search box at the top of the Azure portal, search for **Network security groups**.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/search-network-security-groups.png" alt-text="Screenshot of searching for network security groups.":::  

1. On the *Network security groups* page, select **+ Create**.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/network-security-groups-page.png" alt-text="Screenshot of network security groups landing page."::: 

1. Enter or select the following information:

    |Setting|Value|
    |----|----|
    |Subscription| Select your subscription|
    |Resource group | Select *myResourceGroup* from the list|
    |Name| Enter **myNsgPrivate** |
    |Location| Select **East US** |

1. Select **Review + create**, and when the validation check is passed, select **Create**.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/create-nsg-page.png" alt-text="Screenshot of create a network security group page.":::

1. After the network security group is created, select **Go to resource** or search for *myNsgPrivate* at the top of the Azure portal.

1. Select **Outbound security rules** under *Settings* and then select **+ Add**.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/create-outbound-rule.png" alt-text="Screenshot of adding outbound security rule." lightbox="./media/tutorial-restrict-network-access-to-resources/create-outbound-rule-expanded.png":::

1. Create a rule that allows outbound communication to the Azure Storage service. Enter, or select, the following information, and then select **Add**:

    |Setting|Value|
    |----|----|
    |Source| Select **Service Tag** |
    |Source service tag | Select **VirtualNetwork** |
    |Source port ranges| * |
    |Destination | Select **Service Tag**|
    |Destination service tag | Select **Storage**|
    |Service | Leave default as *Custom*. |
    |Destination port ranges| Change to *445*. SMB protocol is used to connect to a file share created in a later step. |
    |Protocol|Any|
    |Action|Allow|
    |Priority|100|
    |Name|Rename to **Allow-Storage-All**|

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/create-outbound-storage-rule.png" alt-text="Screenshot of creating an outbound security to access storage.":::

1. Create another outbound security rule that denies communication to the internet. This rule overrides a default rule in all network security groups that allows outbound internet communication. Complete steps 6-9 from above using the following values and then select **Add**:

    |Setting|Value|
    |----|----|
    |Source| Select **Service Tag** |
    |Source service tag | Select **VirtualNetwork** |
    |Source port ranges| * |
    |Destination | Select **Service Tag**|
    |Destination service tag| Select **Internet**|
    |Service| Leave default as *Custom*. |
    |Destination port ranges| * |
    |Protocol|Any|
    |Action| Change default to **Deny**. |
    |Priority|110|
    |Name|Change to **Deny-Internet-All**|

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/create-outbound-internet-rule.png" alt-text="Screenshot of creating an outbound security to block internet access.":::

1. Create an *inbound security rule* that allows Remote Desktop Protocol (RDP) traffic to the subnet from anywhere. The rule overrides a default security rule that denies all inbound traffic from the internet. Remote desktop connections are allowed to the subnet so that connectivity can be tested in a later step. Select **Inbound security rules** under *Settings* and then select **+ Add**.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/create-inbound-rule.png" alt-text="Screenshot of adding inbound security rule." lightbox="./media/tutorial-restrict-network-access-to-resources/create-inbound-rule-expanded.png":::

1. Enter or select the follow values and then select **Add**.

    |Setting|Value|
    |----|----|
    |Source| Any |
    |Source port ranges| * |
    |Destination | Select **Service Tag**|
    |Destination service tag | Select **VirtualNetwork** |
    |Service| Leave default as *Custom*. |    
    |Destination port ranges| Change to *3389* |
    |Protocol|Any|
    |Action|Allow|
    |Priority|120|
    |Name|Change to *Allow-RDP-All*|

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/create-inbound-rdp-rule.png" alt-text="Screenshot of creating an allow inbound remote desktop rule.":::

   >[!WARNING] 
   > RDP port 3389 is exposed to the Internet. This is only recommended for testing. For *Production environments*, we recommend using a VPN or private connection.

1.  Select **Subnets** under *Settings* and then select **+ Associate**.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/associate-subnets-page.png" alt-text="Screenshot of network security groups subnet association page.":::

1.  Select **myVirtualNetwork** under *Virtual Network* and then select **Private** under *Subnets*. Select **OK** to associate the network security group to the select subnet.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/associate-private-subnet.png" alt-text="Screenshot of associating a network security group to a private subnet.":::

## Restrict network access to a resource

The steps required to restrict network access to resources created through Azure services, which are enabled for service endpoints will vary across services. See the documentation for individual services for specific steps for each service. The rest of this tutorial includes steps to restrict network access for an Azure Storage account, as an example.

### Create a storage account

1. Select **+ Create a resource** on the upper, left corner of the Azure portal.

1. Enter "Storage account" in the search bar, and select it from the drop-down menu. Then select **Create**.

1. Enter the following information:

    |Setting|Value|
    |----|----|
    |Subscription| Select your subscription|
    |Resource group| Select *myResourceGroup*|
    |Storage account name| Enter a name that is unique across all Azure locations. The name has to between 3-24 characters in length, using only numbers and lower-case letters.|
    |Region| Select **(US) East US** |
    |Performance|Standard|
    |Redundancy| Locally redundant storage (LRS)|

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/create-storage-account.png" alt-text="Screenshot of create a new storage account.":::

1. Select **Create + review**, and when validation checks have passed, select **Create**. 

    >[!NOTE] 
    > The deployment may take a couple of minutes to complete.

1. After the storage account is created, select **Go to resource**.

### Create a file share in the storage account

1. Select **File shares** under *Data storage*, and then select **+ File share**.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/file-share-page.png" alt-text="Screenshot of file share page in a storage account.":::

1. Enter or set the following values for the file share, and then select **Create**:

    |Setting|Value|
    |----|----|
    |Name| my-file-share|
    |Quota| Select **Set to maximum**. |
    |Tier| Leave as default, *Transaction optimized*. |

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/create-new-file-share.png" alt-text="Screenshot of create new file share settings page.":::

1. The new file share should appear on the file share page, if not select the **Refresh** button at the top of the page.

### Restrict network access to a subnet

By default, storage accounts accept network connections from clients in any network, including the internet. You can restrict network access from the internet, and all other subnets in all virtual networks (except the *Private* subnet in the *myVirtualNetwork* virtual network.) To restrict network access to a subnet:

1. Select **Networking** under *Settings* for your (uniquely named) storage account.

1. Select *Allow access from **Selected networks*** and then select **+ Add existing virtual network**.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/storage-network-settings.png" alt-text="Screenshot of storage account networking settings page.":::

1. Under **Add networks**, select the following values, and then select **Add**:

    |Setting|Value|
    |----|----|
    |Subscription| Select your subscription|
    |Virtual networks| **myVirtualNetwork**|
    |Subnets| **Private**|

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/add-virtual-network.png" alt-text="Screenshot of add virtual network to storage account page.":::

1. Select the **Save** button to save the virtual network configurations.

1. Select **Access keys** under *Security + networking* for the storage account and select **Show keys**. Note the value for key1 to use in a later step when mapping the file share in a VM.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/storage-access-key.png" alt-text="Screenshot of storage account key and connection strings." lightbox="./media/tutorial-restrict-network-access-to-resources/storage-access-key-expanded.png":::

## Create virtual machines

To test network access to a storage account, deploy a VM to each subnet.

### Create the first virtual machine

1. On the Azure portal, select **+ Create a resource**.

1. Select **Compute**, and then **Create** under *Virtual machine*.

1. On the *Basics* tab, enter or select the following information:

   |Setting|Value|
   |----|----|
   |Subscription| Select your subscription|
   |Resource group| Select **myResourceGroup**, which was created earlier.|
   |Virtual machine name| Enter *myVmPublic*|
   |Region | (US) East US
   |Availability options| Availability zone|
   |Availability zone | 1 |
   |Image | Select an OS image. For this VM *Windows Server 2019 Datacenter - Gen1* is selected. |
   |Size | Select the VM Instance size you want to use |
   |Username|Enter a user name of your choosing.|
   |Password| Enter a password of your choosing. The password must be at least 12 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.yml?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm-).|
   |Public inbound ports | Allow selected ports |
   |Select inbound ports | Leave default set to *RDP (3389)* |

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/create-public-vm-settings.png" alt-text="Screenshot of create public virtual machine settings." lightbox="./media/tutorial-restrict-network-access-to-resources/create-public-vm-settings-expanded.png":::
  
1. On the **Networking** tab, enter or select the following information:

    |Setting|Value|
    |----|----|
    | Virtual Network | Select **myVirtualNetwork**. |
    | Subnet | Select **Public**. |
    | NIC network security group | Select **Advanced**. The portal automatically creates a network security group for you that allows port 3389. You'll need this port open to connect to the virtual machine in a later step. |

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/virtual-machine-networking.png" alt-text="Screenshot of create public virtual machine network settings." lightbox="./media/tutorial-restrict-network-access-to-resources/virtual-machine-networking-expanded.png":::

1. Select **Review and create**, then **Create** and wait for the deployment to finish.

1. Select **Go to resource**, or open the **Home > Virtual machines** page, and select the VM you just created *myVmPublic*, which should be started.

### Create the second virtual machine

1. Repeat steps 1-5 to create a second virtual machine. In step 3, name the virtual machine *myVmPrivate*. In step 4, select the **Private** subnet and set *NIC network security group* to **None**.

   :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/virtual-machine-2-networking.png" alt-text="Screenshot of create private virtual machine network settings." lightbox="./media/tutorial-restrict-network-access-to-resources/virtual-machine-2-networking-expanded.png":::

1. Select **Review and create**, then **Create** and wait for the deployment to finish. 

    > [!WARNING]
    > Do not continue to the next step until the deployment is completed.

1. Select **Go to resource**, or open the **Home > Virtual machines** page, and select the VM you just created *myVmPrivate*, which should be started.

## Confirm access to storage account

1. Once the *myVmPrivate* VM has been created, go to the overview page of the virtual machine. Connect to the VM by selecting the **Connect** button and then select **RDP** from the drop-down.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/connect-private-vm.png" alt-text="Screenshot of connect button for private virtual machine.":::

1. Select the **Download RDP File** to download the remote desktop file to your computer.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/download-rdp-file.png" alt-text="Screenshot of download RDP file for private virtual machine.":::
  
1. Open the downloaded rdp file. When prompted, select **Connect**. 

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/rdp-connect.png" alt-text="Screenshot of connection screen for private virtual machine.":::

1. Enter the user name and password you specified when creating the VM. You may need to select **More choices**, then **Use a different account** to specify the credentials you entered when you created the VM. For the email field, enter the "Administrator account: username" credentials you specified earlier. Select **OK** to sign into the VM.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/credential-screen.png" alt-text="Screenshot of credential screen for private virtual machine.":::

    > [!NOTE] 
    > You may receive a certificate warning during the sign-in process. If you receive the warning, select **Yes** or **Continue**, to proceed with the connection.

1. Once signed in, open Windows PowerShell. Using the script below, map the Azure file share to drive Z using PowerShell. Replace `<storage-account-key>` and both `<storage-account-name>` variable with values you supplied and made note of earlier in the [Create a storage account](#create-a-storage-account) steps.

   ```powershell
   $acctKey = ConvertTo-SecureString -String "<storage-account-key>" -AsPlainText -Force
   $credential = New-Object System.Management.Automation.PSCredential -ArgumentList "Azure\<storage-account-name>", $acctKey
   New-PSDrive -Name Z -PSProvider FileSystem -Root "\\<storage-account-name>.file.core.windows.net\my-file-share" -Credential $credential
   ```

   PowerShell returns output similar to the following example output:

   ```powershell
   Name        Used (GB)     Free (GB) Provider      Root
   ----        ---------     --------- --------      ----
   Z                                      FileSystem    \\mystorage007.file.core.windows.net\my-f...
   ```

   The Azure file share successfully mapped to the Z drive.

1.   Close the remote desktop session to the *myVmPrivate* VM.

## Confirm access is denied to storage account

### From myVmPublic:

1. Enter *myVmPublic* In the **Search resources, services, and docs** box at the top of the portal. When **myVmPublic** appears in the search results, select it.

1. Repeat steps 1-5 above in [Confirm access to storage account](#confirm-access-to-storage-account) for the *myVmPublic* VM.

   After a short wait, you receive a `New-PSDrive : Access is denied` error. Access is denied because the *myVmPublic* VM is deployed in the *Public* subnet. The *Public* subnet doesn't have a service endpoint enabled for Azure Storage. The storage account only allows network access from the *Private* subnet, not the *Public* subnet.

    ```powershell
    New-PSDrive : Access is denied
    At line:1 char:1
    + New-PSDrive -Name Z -PSProvider FileSystem -Root "\\mystorage007.file ...
    + ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        + CategoryInfo          : InvalidOperation: (Z:PSDriveInfo) [New-PSDrive],     Win32Exception
        + Fu llyQualifiedErrorId : CouldNotMapNetworkDrive,Microsoft.PowerShell.Commands.NewPSDriveCommand

    ```

4. Close the remote desktop session to the *myVmPublic* VM.

### From a local machine:

1. In the Azure portal, go to the uniquely named storage account you created earlier. For example, *mystorage007*.

1. Select **File shares** under *Data storage*, and then select the *my-file-share* you created earlier.

1. You should receive the following error message:

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/access-denied-error.png" alt-text="Screenshot of access denied error message.":::

>[!NOTE] 
> The access is denied because your computer is not in the *Private* subnet of the *MyVirtualNetwork* virtual network.

## Clean up resources

When no longer needed, delete the resource group and all resources it contains:

1. Enter *myResourceGroup* in the **Search** box at the top of the portal. When you see **myResourceGroup** in the search results, select it.

1. Select **Delete resource group**.

1. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**.

## Next steps

In this tutorial, you enabled a service endpoint for a virtual network subnet. You learned that you can enable service endpoints for resources deployed from multiple Azure services. You created an Azure Storage account and restricted the network access to the storage account to only resources within a virtual network subnet. To learn more about service endpoints, see [Service endpoints overview](virtual-network-service-endpoints-overview.md) and [Manage subnets](virtual-network-manage-subnet.md).

If you have multiple virtual networks in your account, you may want to establish connectivity between them so that resources can communicate with each other. To learn how to connect virtual networks, advance to the next tutorial.

> [!div class="nextstepaction"]
> [Connect virtual networks](./tutorial-connect-virtual-networks-portal.md)
