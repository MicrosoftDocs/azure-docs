---
title: 'Tutorial: Connect to a storage account using an Azure Private endpoint'
titleSuffix: Azure Private Link
description: Get started with Azure Private endpoint to connect to a storage account privately.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: tutorial
ms.date: 9/25/2020
---

# Tutorial: Connect to a storage account using an Azure Private Endpoint

Azure Private endpoint is the fundamental building block for Private Link in Azure. It enables Azure resources, like virtual machines (VMs), to communicate with Private Link resources privately.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and bastion host.
> * Create a virtual machine.
> * Create storage account with a private endpoint.
> * Test connectivity to storage account private endpoint.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual network and bastion host

In this section, you'll create a virtual network, subnet, and bastion host. 

The bastion host will be used to connect securely to the virtual machine for testing the private endpoint.

1. On the upper-left side of the screen, select **Create a resource > Networking > Virtual network** or search for **Virtual network** in the search box.

2. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **myResourceGroup** |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **East US** |

3. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

4. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

5. Under **Subnet name**, select the word **default**.

6. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **mySubnet** |
    | Subnet address range | Enter **10.1.0.0/24** |

7. Select **Save**.

8. Select the **Security** tab.

9. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/24** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |


8. Select the **Review + create** tab or select the **Review + create** button.

9. Select **Create**.

## Create a virtual machine

In this section, you'll create a virtual machine that will be used to test the private endpoint.


1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine** or search for **Virtual machine** in the search box.
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **myResourceGroup** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM** |
    | Region | Select **East US** |
    | Availability Options | Select **No infrastructure redundancy required** |
    | Image | Select **Windows Server 2019 Datacenter - Gen1** |
    | Azure Spot instance | Select **No** |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | **myVNet** |
    | Subnet | **mySubnet** |
    | Public IP | Select **None**. |
    | NIC network security group | **Basic**|
    | Public inbound ports | Select **None**. |
   
5. Select **Review + create**. 
  
6. Review the settings, and then select **Create**.

## Create storage account with a private endpoint

In this section, you'll create a storage account and configure the private endpoint.

1. In the left-hand menu, select **Create a resource** > **Storage** > **Storage account**, or search for **Storage account** in the search box.

2. In the **Basics** tab of **Create storage account** enter or select the following information:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **myResourceGroup** |
    | **Instance details** |  |
    | Storage account name | Enter **mystorageaccount**. If the name is unavailable, enter a unique name. |
    | Location | Select **East US** |
    | Performance | Leave the default **Standard** |
    | Account kind | Leave the default **Storage (general purpose v2)** |
    | Replication| Leave the default **Read-access geo-redundant storage (RA-GRS)** |
   
3. Select the **Networking** tab or select the **Next: Networking** button.

4. In the **Networking** tab, under **Connectivity method** select **Private endpoint**.

5. In **Private endpoint**, select **+ Add**.

6. In **Create private endpoint** enter or select the following information:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **myResourceGroup** |
    | Location | Select **East US** |
    | Name | Enter **myPrivateEndpoint** |
    | Storage subresource | Leave the default **blob** |
    | **Networking** |  |
    | Virtual network | Select **myVNet** |
    | Subnet | Select **mySubnet** |
    | **Private DNS integration** |
    | Integrate with private DNS zone | Leave the default **Yes** |
    | Private DNS Zone | Leave the default (New) privatelink.blob.core.windows.net |

7. Select **OK**.

8. Select **Review + create**.

9. Select **Create**.

10. Select **Resource groups** in the left-hand navigation pane.

11. Select **myResourceGroup**.

12. Select the storage account you created in the previous steps.

13. In the **Settings** section of the storage account, select **Access keys**.

14. Select copy on the **Connection string** for **key1**.

## Test connectivity to private endpoint

In this section, you'll use the virtual machine you created in the previous step to connect to the storage account across the private endpoint.

1. Select **Resource groups** in the left-hand navigation pane.

2. Select **myResourceGroup**.

3. Select **myVM**.

4. On the overview page for **myVM**, select **Connect** then **Bastion**.

5. Select the blue **Use Bastion** button.

6. Enter the username and password that you entered during the virtual machine creation.

7. Open Windows PowerShell on the server after you connect.

8. Enter `nslookup <storage-account-name>.blob.core.windows.net`. Replace **\<storage-account-name>** with the name of the storage account you created in the previous steps.  You'll receive a message similar to what is displayed below:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mystorageaccount8675.privatelink.blob.core.windows.net
    Address:  10.1.0.5
    Aliases:  mystorageaccount8675.blob.core.windows.net
    ```

    A private IP address of **10.1.0.5** is returned for the storage account name.  This address is in the subnet of the virtual network you created previously.

9. Install [Microsoft Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&tabs=windows) on the virtual machine.

10. Select **Finish** after the **Microsoft Azure Storage Explorer** is installed.  Leave the box checked to open the application.

11. In the **Connect to Azure Storage** screen, select **Use a connection string**.

12. Select **Next**.

13. Enter your storage account name from the previous steps in **Display name**.

14. In the box under **Connection String**, paste the connection string from the storage account you copied in the previous steps.

15. Select **Next**.

16. Verify the settings are correct in **Connection Summary**.  

17. Select **Connect**.

18. Close the connection to **myVM**.

## Clean up resources

If you're not going to continue to use this application, delete the virtual network, virtual machine, and storage account with the following steps:

1. From the left-hand menu, select **Resource groups**.

2. Select **myResourceGroup**.

3. Select **Delete resource group**.

4. Enter **myResourceGroup** in **TYPE THE RESOURCE GROUP NAME**.

5. Select **Delete**.

## Next steps

Learn how to create a Private Link service:
> [!div class="nextstepaction"]
> [Create a Private Link service](create-private-link-service-portal.md)
