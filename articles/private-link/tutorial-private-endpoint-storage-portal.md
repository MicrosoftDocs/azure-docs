---
title: 'Tutorial: Connect to a storage account using an Azure Private Endpoint'
titleSuffix: Azure Private Link
description: Get started with this tutorial using Azure Private endpoint to connect to a storage account privately.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: tutorial
ms.date: 06/22/2022
ms.custom: template-tutorial, ignite-2022
---

# Tutorial: Connect to a storage account using an Azure Private Endpoint

Azure Private endpoint is the fundamental building block for Private Link in Azure. It enables Azure resources, like virtual machines (VMs), to privately and securely communicate with Private Link resources such as Azure Storage.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and bastion host.
> * Create a virtual machine.
> * Create a storage account with a private endpoint.
> * Test connectivity to the storage account private endpoint.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* An Azure subscription

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual network and bastion host

In this section, you'll create a virtual network, subnet, and bastion host. 

The bastion host will be used to connect securely to the virtual machine for testing the private endpoint.

1. On the upper-left side of the screen, select **Create a resource > Networking > Virtual network** or search for **Virtual network** in the search box.

2. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | Setting          | Value                        |
    |------------------|------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription.                     |
    | Resource Group   | Select **Create new**. </br> Enter **myResourceGroup** in **Name**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**.                                 |
    | Region           | Select **East US**. |

3. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

4. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16**. |

5. Under **Subnet name**, select the word **default**.

6. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **mySubnet**. |
    | Subnet address range | Enter **10.1.0.0/24**. |

7. Select **Save**.

8. Select the **Security** tab.

9. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost**. |
    | AzureBastionSubnet address space | Enter **10.1.1.0/24**. |
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
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM**. |
    | Region | Select **(US) East US**. |
    | Availability Options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2019 Datacenter - Gen2**. |
    | Azure Spot instance | Select **No**. |
    | Size | Choose VM size or take default setting. |
    | **Administrator account** |  |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface**. |  |
    | Virtual network | **myVNet**. |
    | Subnet | **mySubnet**. |
    | Public IP | Select **None**. |
    | NIC network security group | **Basic**. |
    | Public inbound ports | Select **None**. |
   
5. Select **Review + create**. 
  
6. Review the settings, and then select **Create**.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Create storage account with a private endpoint

In this section, you'll create a storage account and configure the private endpoint.

1. In the left-hand menu, select **Create a resource** > **Storage** > **Storage account**, or search for **Storage account** in the search box.

2. In the **Basics** tab of **Create storage account** enter or select the following information:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Storage account name | Enter **mystorageaccount**. If the name is unavailable, enter a unique name. |
    | Location | Select **(US) East US**. |
    | Performance | Leave the default **Standard**. |
    | Redundancy | Select **Locally-redundant storage (LRS)**. |
   
3. Select the **Networking** tab or select the **Next: Networking** button.

4. In the **Networking** tab, under **Network connectivity** select **Disable public access and use private access**.

5. In **Private endpoint**, select **+ Add private endpoint**.

6. In **Create private endpoint** enter or select the following information:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **myResourceGroup**. |
    | Location | Select **East US**. |
    | Name | Enter **myPrivateEndpoint**. |
    | Storage sub-resource | Leave the default **blob**. |
    | **Networking** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **mySubnet**. |
    | **Private DNS integration**. |
    | Integrate with private DNS zone | Leave the default **Yes**. |
    | Private DNS Zone | Leave the default **(New) privatelink.blob.core.windows.net**. |

7. Select **OK**.

8. Select **Review + create**.

9. Select **Create**.

10. Select **Resource groups** in the left-hand navigation pane.

11. Select **myResourceGroup**.

12. Select the storage account you created in the previous steps.

13. In the **Security + networking** section of the storage account, select **Access keys**.

14. Select **Show keys**, then select copy on the **Connection string** for **key1**.

### Add a container

1. Select **Go to resource**, or in the left-hand menu of the Azure portal, select **All Resources** > **mystorageaccount**.

2. Under the **Data storage** section, select **Containers**.

3. Select **+ Container** to create a new container.

4. Enter **mycontainer** in **Name** and select **Private (no anonymous access)** under **Public access level**.

5. Select **Create**.

## Test connectivity to private endpoint

In this section, you'll use the virtual machine you created in the previous steps to connect to the storage account across the private endpoint using **Microsoft Azure Storage Explorer**.

1. Select **Resource groups** in the left-hand navigation pane.

2. Select **myResourceGroup**.

3. Select **myVM**.

4. On the overview page for **myVM**, select **Connect** then **Bastion**.

5. Enter the username and password that you entered during the virtual machine creation.

6. Select **Connect** button.

7. Open Windows PowerShell on the server after you connect.

8. Enter `nslookup <storage-account-name>.blob.core.windows.net`. Replace **\<storage-account-name>** with the name of the storage account you created in the previous steps.  You'll receive a message similar to what is displayed below:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mystorageaccount.privatelink.blob.core.windows.net
    Address:  10.1.0.5
    Aliases:  mystorageaccount.blob.core.windows.net
    ```

    A private IP address of **10.1.0.5** is returned for the storage account name. This address is in **mySubnet** subnet of **myVNet** virtual network you created previously.

9. Install [Microsoft Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=windows&toc=%2fazure%2fstorage%2fblobs%2ftoc.json) on the virtual machine.

10. Select **Finish** after the **Microsoft Azure Storage Explorer** is installed.  Leave the box checked to open the application.

11. In the **Select Resource** screen, select **Storage account or service** to add a connection in **Microsoft Azure Storage Explorer** to your storage account that you created in the previous steps.

12. In the **Select Connection Method** screen, select **Connection string**, and then **Next**.

13. In the box under **Connection String**, paste the connection string from the storage account you copied in the previous steps. The storage account name will automatically populate in the box under **Display name**.

14. Select **Next**.

15. Verify the settings are correct in **Summary**.  

16. Select **Connect**, then select **mystorageaccount** from the **Storage Accounts** left-hand menu.

17. Under **Blob Containers**, you see **mycontainer** that you created in the previous steps.

18. Close the connection to **myVM**.

## Clean up resources

If you're not going to continue to use this application, delete the virtual network, virtual machine, and storage account with the following steps:

1. From the left-hand menu, select **Resource groups**.

2. Select **myResourceGroup**.

3. Select **Delete resource group**.

4. Enter **myResourceGroup** in **TYPE THE RESOURCE GROUP NAME**.

5. Select **Delete**.

## Next steps

In this tutorial, you learned how to create:
* Virtual network and bastion host.
* Virtual machine.
* Storage account and a container.

Learn how to connect to an Azure Cosmos DB account via Azure Private Endpoint:

> [!div class="nextstepaction"]
> [Connect to Azure Cosmos DB using Private Endpoint](tutorial-private-endpoint-cosmosdb-portal.md)
