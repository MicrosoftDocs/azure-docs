---
title: 'Create an Azure private endpoint using Azure portal| Microsoft Docs'
description: Learn about Azure private endpoint
services: virtual-network
author: KumudD
# Customer intent: As someone with a basic network background, but is new to Azure, I want to create an Azure private endpoint
ms.service: virtual-network
ms.topic: quickstart
ms.date: 09/09/2019
ms.author: kumud

---
# Create a Private Endpoint using the Azure portal
A private endpoint is the fundamental building block for Private Link in Azure. It enables Azure resources, like Virtual Machines (VMs), to communicate privately with Private Link Resources. 

In this Quickstart, you will learn how to create a VM on an Azure Virtual Network, a Storage Account with an Private Endpoint using the Azure portal. Then, you can securely access the Storage Account from the VM.


## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Create a VM
In this section, you will create Virtual Network and the subnet to host the VM that is used to access your Private Link Resource (an Azure storage account in this example).

### Create the Virtual Network

In this section, you will create Virtual Network and the subnet to host the VM that is used to access your Private Link Resource.

1. On the upper-left side of the screen, select **Create a resource** > **Networking** > **Virtual network**.
1. In **Create virtual network**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter *MyVirtualNetwork*. |
    | Address space | Enter *10.1.0.0/16*. |
    | Subscription | Select your subscription.|
    | Resource group | Select **Create new**, enter *myResourceGroup*, then select **OK**. |
    | Location | Select **WestCentralUS**.|
    | Subnet - Name | Enter *mySubnet*. |
    | Subnet - Address range | Enter *10.1.0.0/24*. |
    |||
1. Leave the rest as default and select **Create**.


### Create Virtual Machine

1. On the upper-left side of the screen in the Azure portal, select **Create a resource** > **Compute** > **Virtual Machine**.

1. In **Create a virtual machine - Basics**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **PROJECT DETAILS** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. You created this in the previous section.  |
    | **INSTANCE DETAILS** |  |
    | Virtual machine name | Enter *myVm*. |
    | Region | Select **WestCentralUS**. |
    | Availability options | Leave the default **No infrastructure redundancy required**. |
    | Image | Select **Windows Server 2019 Datacenter**. |
    | Size | Leave the default **Standard DS1 v2**. |
    | **ADMINISTRATOR ACCOUNT** |  |
    | Username | Enter a username of your choosing. |
    | Password | Enter a password of your choosing. The password must be at least 12 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.md?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm).|
    | Confirm Password | Reenter password. |
    | **INBOUND PORT RULES** |  |
    | Public inbound ports | Leave the default **None**. |
    | **SAVE MONEY** |  |
    | Already have a Windows license? | Leave the default **No**. |
    |||

1. Select **Next: Disks**.

1. In **Create a Virtual Machine - Disks**, leave the defaults and select **Next: Networking**.

1. In **Create a Virtual Machine - Networking**, select this information:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Leave the default **MyVirtualNetwork**.  |
    | Address space | Leave the default **10.1.0.0/24**.|
    | Subnet | Leave the default **mySubnet (10.1.0.0/24)**.|
    | Public IP | Leave the default **(new) myVm-ip**. |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **HTTP** and **RDP**.|
    ||

1. Select **Review + create**. You're taken to the **Review + create** page where Azure validates your configuration.

1. When you see the **Validation passed** message, select **Create**.

## Create your Private Endpoint
In this section, you will create a Private Storage Account using a Private Endpoint to it. 

1. On the upper-left side of the screen in the Azure portal, select **Create a resource** > **Storage** > **Storage account**.

1. In **Create storage account - Basics**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **PROJECT DETAILS** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. You created this in the previous section.|
    | **INSTANCE DETAILS** |  |
    | Storage account name  | Enter *mystorageaccount*. If this name is taken, create a unique name. |
    | Region | Select **WestCentralUS**. |
    | Performance| Leave the default **Standard**. |
    | Account kind | Leave the default **Storage (general purpose v2)**. |
    | Replication | Select **Read-access geo-redundant storage (RA-GRS)**. |
    |||
  
3. Select **Next: Networking**.
4. In **Create a Storage Account - Networking**, connectivity method, select **Private Eendpoint**.
5. In **Create a Storage Account - Networking**, select **Add Private Endpoint**. 
6. In **Create Private Endpoint**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **PROJECT DETAILS** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. You created this in the previous section.|
    |Location|Select **WestCentralUS**.|
    |Name|Enter *myPrivateEndpoint*.  |
    |Storage sub-resource|Leave the default **Blob**. |
    | **NETWORKING** |  |
    | Virtual network  | Select *MyVirtualNetwork* from resource group *myResourceGroup*. |
    | Subnet | Select *mySubnet*. |
    | **PRIVATE DNS INTEGRATION**|  |
    | Integrate with private DNS zone  | Leave the default **Yes**. |
    | Private DNS zone  | Leave the default ** (New) privatelink.blob.core.windows.net**. |
    |||
7. Select **OK**. 
8. Select **Review + create**. You're taken to the **Review + create** page where Azure validates your configuration. 
9. When you see the **Validation passed** message, select **Create**. 
10. Browse to the Storage Account resource that you juts created.
11. Select **Access Keys** from the left content menu.
12. Select **Copy** on the connection string for key1.
 
## Connect to a VM from the internet

Connect to the VM *myVm* from the internet as follows:

1. In the portal's search bar, enter *myVm*.

1. Select the **Connect** button. After selecting the **Connect** button, **Connect to Virtual Machine** opens.

1. Select **Download RDP File**. Azure creates a Remote Desktop Protocol (*.rdp*) file and downloads it to your computer.

1. Open the downloaded.rdp* file.

    1. If prompted, select **Connect**.

    1. Enter the username and password you specified when creating the VM.

        > [!NOTE]
        > You may need to select **More choices** > **Use a different account**, to specify the credentials you entered when you created the VM.

1. Select **OK**.

1. You may receive a certificate warning during the sign-in process. If you receive a certificate warning, select **Yes** or **Continue**.

1. Once the VM desktop appears, minimize it to go back to your local desktop.  

## Access Storage Account privately from the VM

In this section, you will connect privately to the Storage Account using the Private Endpoint.

> [!IMPORTANT]
> DNS configuration for Storage needs a manual modification on the hosts file to include the FQDN of the specific account
> Please modify the following file using administrator permissions on Windows: c:\Windows\System32\Drivers\etc\hosts or Linux /etc/hosts
> Include the DNS information for the account from previous step in the following format
> [Private IP Address] myaccount.blob.core.windows.net

1. In the Remote Desktop of *myVM*, open PowerShell.
2. Enter `nslookup mystorageaccount.blob.core.windows.net`
    You'll receive a message similar to this:
    ```azurepowershell
    Server:  UnKnown
    Address:  168.63.129.16
    Non-authoritative answer:
    Name:    mystorageaccount123123.privatelink.blob.core.windows.net
    Address:  10.0.0.5
    Aliases:  mystorageaccount.blob.core.windows.net
3. Install [Microsoft Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&tabs=windows).
4. Select **Storage accounts** with the right-click.
5. Select **Connect to an azure storage**.
6. Select **Use a connection string**.
7. Select **Next**.
8. Enter the connection string by pasting the information previously copied.
9. Select **Next**.
10. Select **Connect**.
11. Browse the Blob containers from mystorageaccount 
12. (Optionally) Create folders and/or upload files to *mystorageaccount*. 
13. Close the remote desktop connection to *myVM*. 

Additional options to access the Storage Account: (*What is the purpose of this section? Can this section be removed?*)
- Microsoft Azure Storage Explorer is a standalone free app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux. You can install the application to browse privately the storage account content. 
 
- The AzCopy utility is another option for high-performance scriptable data transfer for Azure Storage. Use AzCopy to transfer data to and from Blob, File, and Table storage. 


## Clean up resources 
When you're done using the Private Endpoint, Storage Account and the VM, delete the resource group and all of the resources it contains: 
1. Enter *myResourceGroup* in the **Search** box at the top of the portal and select *myResourceGroup* from the search results. 
2. Select **Delete resource group**. 
3. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME** and select **Delete**. 

## Next steps
In this Quickstart, you created a VM on a Virtual Network and Storage Account and a Private Endpoint. You connected to one VM from the internet and securely communicated to the Storage Account using Private Link. To learn more about Private Endpoint, see [What is Azure private endpoint?](private-endpoint-overview.md).
