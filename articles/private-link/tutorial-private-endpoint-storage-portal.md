---
title: 'Tutorial: Connect to a storage account using an Azure Private Endpoint'
titleSuffix: Azure Private Link
description: Get started with this tutorial using Azure Private endpoint to connect to a storage account privately.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: tutorial
ms.date: 11/23/2022
ms.custom: template-tutorial, ignite-2022
---

# Tutorial: Connect to a storage account using an Azure Private Endpoint

Azure Private endpoint is the fundamental building block for Private Link in Azure. It enables Azure resources, like virtual machines (VMs), to privately and securely communicate with Private Link resources such as Azure Storage.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create a virtual network and bastion host.
> * Create a virtual machine.
> * Create a storage account with a private endpoint.
> * Test connectivity to the storage account private endpoint.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual network and bastion host

Create a virtual network, subnet, and bastion host. The virtual network and subnet will contain the private endpoint that connects to the Azure Storage Account.

The bastion host will be used to connect securely to the virtual machine for testing the private endpoint.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual network** in the search results.

2. Select **+ Create**.

3. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | Setting          | Value                        |
    |------------------|------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription.                     |
    | Resource Group   | Select **Create new**. </br> Enter **TutorPEstorage-rg** in **Name**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**.                                 |
    | Region           | Select **East US**. |

4. Select the **IP Addresses** tab or select **Next: IP Addresses**.

5. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16**. |

6. Under **Subnet name**, select the word **default**. If a subnet isn't listed, select **+ Add subnet**.

7. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **mySubnet**. |
    | Subnet address range | Enter **10.1.0.0/24**. |

8. Select **Save**.

9. Select the **Security** tab.

10. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost**. |
    | AzureBastionSubnet address space | Enter **10.1.1.0/26**. |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |


11. Select the **Review + create** tab or select the **Review + create** button.

12. Select **Create**.

It will take a few minutes for the virtual network and Azure Bastion host to deploy. Proceed to the next steps when the virtual network is created.

## Create a virtual machine

In this section, you'll create a virtual machine that will be used to test the private endpoint.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.
   
2. Select **+ Create** > **Azure virtual machine**.

3. In **Create a virtual machine**, enter or select the following in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **TutorPEstorage-rg**. |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM**. |
    | Region | Select **(US) East US**. |
    | Availability Options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter: Azure Edition - Gen2**. |
    | Size | Choose a size or leave the default setting. |
    | **Administrator account** |  |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |   |
    | Public inbound ports | Select **None**. |

4. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
5. In the Networking tab, enter or select the following information:

    | Setting | Value |
    |-|-|
    | **Network interface**. |  |
    | Virtual network | **myVNet**. |
    | Subnet | **mySubnet**. |
    | Public IP | Select **None**. |
    | NIC network security group | **Basic**. |
    | Public inbound ports | Select **None**. |
   
6. Select **Review + create**. 
  
7. Review the settings, and then select **Create**.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Create storage account with a private endpoint

Create a storage account and configure the private endpoint. The private endpoint uses a network interface assigned an IP address in the virtual network you created previously.

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage accounts** in the search results.
   
2. Select **+ Create**.

3. In the **Basics** tab of **Create a storage account** enter or select the following information:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **TutorPEstorage-rg**. |
    | **Instance details** |  |
    | Storage account name | Enter **mystorageaccount**. If the name is unavailable, enter a unique name. |
    | Location | Select **(US) East US**. |
    | Performance | Leave the default **Standard**. |
    | Redundancy | Select **Locally-redundant storage (LRS)**. |
   
4. Select the **Networking** tab or select **Next: Advanced** then **Next: Networking**.

5. In the **Networking** tab, under **Network connectivity** select **Disable public access and use private access**.

6. In **Private endpoint**, select **+ Add private endpoint**.

7. In **Create private endpoint** enter or select the following information:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **TutorPEstorage-rg**. |
    | Location | Select **East US**. |
    | Name | Enter **myPrivateEndpoint**. |
    | Storage subresource | Leave the default **blob**. |
    | **Networking** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **myVNet/mySubnet(10.1.0.0/24)**. |
    | **Private DNS integration**. |
    | Integrate with private DNS zone | Leave the default **Yes**. |
    | Private DNS Zone | Leave the default **(New) privatelink.blob.core.windows.net**. |

8. Select **OK**.

9. Select **Review**.

10. Select **Create**.

### Storage access key

The storage access key is required for the later steps. You'll go to the storage account you created previously and copy the connection string with the access key for the storage account.

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage accounts** in the search results.

2. Select the storage account you created in the previous steps.

3. In the **Security + networking** section of the storage account, select **Access keys**.

4. Select **Show**, then select copy on the **Connection string** for **key1**.

### Add a blob container

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage accounts** in the search results.

2. Select the storage account you created in the previous steps.

3. In the **Data storage** section, select **Containers**.

4. Select **+ Container** to create a new container.

5. Enter **mycontainer** in **Name** and select **Private (no anonymous access)** under **Public access level**.

6. Select **Create**.

## Test connectivity to private endpoint

In this section, you'll use the virtual machine you created in the previous steps to connect to the storage account across the private endpoint using **Microsoft Azure Storage Explorer**.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM**.

3. On the overview page for **myVM**, select **Connect** then **Bastion**.

4. Enter the username and password that you entered during the virtual machine creation.

5. Select **Connect**.

6. Open Windows PowerShell on the server after you connect.

7. Enter `nslookup <storage-account-name>.blob.core.windows.net`. Replace **\<storage-account-name>** with the name of the storage account you created in the previous steps.  You'll receive a message similar to what is displayed below:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mystorageaccount.privatelink.blob.core.windows.net
    Address:  10.1.0.5
    Aliases:  mystorageaccount.blob.core.windows.net
    ```

    A private IP address of **10.1.0.5** is returned for the storage account name. This address is in **mySubnet** subnet of **myVNet** virtual network you created previously.

8. Install [Microsoft Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=windows&toc=%2fazure%2fstorage%2fblobs%2ftoc.json) on the virtual machine.

9. Select **Finish** after the **Microsoft Azure Storage Explorer** is installed.  Leave the box checked to open the application.

10. Select the **Power plug** symbol to open the **Select Resource** dialog box.

11. In **Select Resource** , select **Storage account or service** to add a connection in **Microsoft Azure Storage Explorer** to your storage account that you created in the previous steps.

12. In the **Select Connection Method** screen, select **Connection string**, and then **Next**.

13. In the box under **Connection String**, paste the connection string from the storage account you copied in the previous steps. The storage account name will automatically populate in the box under **Display name**.

14. Select **Next**.

15. Verify the settings are correct in **Summary**.  

16. Select **Connect**

17. Select your storage account from the **Storage Accounts** in the explorer menu.

18. Expand the storage account and then **Blob Containers**.

19. The **mycontainer** you created previously is displayed. 

20. Close the connection to **myVM**.

## Clean up resources

If you're not going to continue to use this application, delete the virtual network, virtual machine, and storage account with the following steps:

1. From the left-hand menu, select **Resource groups**.

2. Select **TutorPEstorage-rg**.

3. Select **Delete resource group**.

4. Enter **TutorPEstorage-rg** in **TYPE THE RESOURCE GROUP NAME**.

5. Select **Delete**.

## Next steps

In this tutorial, you learned how to create:

* Virtual network and bastion host.

* Virtual machine.

* Storage account and a container.

Learn how to connect to an Azure Cosmos DB account via Azure Private Endpoint:

> [!div class="nextstepaction"]
> [Connect to Azure Cosmos DB using Private Endpoint](tutorial-private-endpoint-cosmosdb-portal.md)
