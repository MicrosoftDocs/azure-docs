---
title: 'Tutorial: Connect to a storage account using an Azure Private Endpoint'
titleSuffix: Azure Private Link
description: Get started with this tutorial using Azure Private endpoint to connect to a storage account privately.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: tutorial
ms.date: 07/18/2023
ms.custom: template-tutorial, ignite-2022
---

# Tutorial: Connect to a storage account using an Azure Private Endpoint

Azure Private endpoint is the fundamental building block for Private Link in Azure. It enables Azure resources, like virtual machines (VMs), to privately and securely communicate with Private Link resources such as Azure Storage.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create a virtual network and bastion host.
> * Create a storage account and disable public access.
> * Create a private endpoint for the storage account.
> * Create a virtual machine.
> * Test connectivity to the storage account private endpoint.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

[!INCLUDE [virtual-network-create-with-bastion.md](../../includes/virtual-network-create-with-bastion.md)]

[!INCLUDE [create-test-virtual-machine.md](../../includes/create-test-virtual-machine.md)]

[!INCLUDE [create-storage-account.md](../../includes/create-storage-account.md)]

> [!NOTE]
> If you choose to use an existing storage account, it's recommended that you disable public access to the storage account. For more information, see [Change the default network access rule - Azure storage](/azure/storage/common/storage-network-security?tabs=azure-portal#change-the-default-network-access-rule).


## Create private endpoint

The private endpoint is created in virtual network created in the previous steps. 

1. In the search box at the top of the portal, enter **Private endpoint**. Select **Private endpoints**.

1. Select **+ Create** in **Private endpoints**.

1. In the **Basics** tab of **Create a private endpoint**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg** |
    | **Instance details** |   |
    | Name | Enter **private-endpoint**. |
    | Network Interface Name | Leave the default of **private-endpoint-nic**. |
    | Region | Select **East US 2**. |

1. Select **Next: Resource**.
    
1. In the **Resource** pane, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Connection method | Leave the default of **Connect to an Azure resource in my directory.** |
    | Subscription | Select your subscription. |
    | Resource type | Select **Microsoft.Web/storageAccounts**. |
    | Resource | Select **storage-1**. |
    | Target subresource | Select **blob**. |

1. Select **Next: Virtual Network**. 

1. In **Virtual Network**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Networking** |  |
    | Virtual network | Select **vnet-1 (test-rg)**. |
    | Subnet | Select **subnet-1**. |
    | Network policy for private endpoints | Select **edit** to apply Network policy for private endpoints. </br> In **Edit subnet network policy**, select the checkbox next to **Network security groups** and **Route Tables** in the **Network policies setting for all private endpoints in this subnet** pull-down. </br> Select **Save**. </br></br>For more information, see [Manage network policies for private endpoints](disable-private-endpoint-network-policy.md) |

    # [**Dynamic IP**](#tab/dynamic-ip)

    | Setting | Value |
    | ------- | ----- |
    | **Private IP configuration** | Select **Dynamically allocate IP address**. |

    :::image type="content" source="./media/create-private-endpoint-portal/dynamic-ip-address.png" alt-text="Screenshot of dynamic IP address selection." border="true":::

    # [**Static IP**](#tab/static-ip)

    | Setting | Value |
    | ------- | ----- |
    | **Private IP configuration** | Select **Statically allocate IP address**. |
    | Name | Enter **ipconfig-1**. |
    | Private IP | Enter **10.0.0.10**. |

    :::image type="content" source="./media/create-private-endpoint-portal/static-ip-address.png" alt-text="Screenshot of static IP address selection." border="true":::

    ---

1. Select **Next: DNS**.

1. Leave the defaults in **DNS**. Select **Next: Tags**, then **Next: Review + create**. 

1. Select **Create**.

[!INCLUDE [create-test-virtual-machine.md](../../includes/create-test-virtual-machine.md)]

### Storage access key

The storage access key is required for the later steps. You'll go to the storage account you created previously and copy the connection string with the access key for the storage account.

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage accounts** in the search results.

2. Select the storage account you created in the previous steps or your existing storage account.

3. In the **Security + networking** section of the storage account, select **Access keys**.

4. Select **Show**, then select copy on the **Connection string** for **key1**.

### Add a blob container

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage accounts** in the search results.

2. Select the storage account you created in the previous steps.

3. In the **Data storage** section, select **Containers**.

4. Select **+ Container** to create a new container.

5. Enter **container** in **Name** and select **Private (no anonymous access)** under **Public access level**.

6. Select **Create**.

## Test connectivity to private endpoint

In this section, you'll use the virtual machine you created in the previous steps to connect to the storage account across the private endpoint using **Microsoft Azure Storage Explorer**.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **vm-1**.

3. On the overview page for **vm-1**, select **Connect** then **Bastion**.

4. Enter the username and password that you entered during the virtual machine creation.

5. Select **Connect**.

6. Open Windows PowerShell on the server after you connect.

7. Enter `nslookup <storage-account-name>.blob.core.windows.net`. Replace **\<storage-account-name>** with the name of the storage account you created in the previous steps.  You'll receive a message similar to what is displayed below:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mystorageaccount.privatelink.blob.core.windows.net
    Address:  10.0.0.10
    Aliases:  mystorageaccount.blob.core.windows.net
    ```

    A private IP address of **10.0.0.10** is returned for the storage account name. This address is in **subnet-1** subnet of **vnet-1** virtual network you created previously.

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

19. The **container** you created previously is displayed. 

20. Close the connection to **vm-1**.

[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

In this tutorial, you learned how to create:

* Virtual network and bastion host.

* Virtual machine.

* Storage account and a container.

Learn how to connect to an Azure Cosmos DB account via Azure Private Endpoint:

> [!div class="nextstepaction"]
> [Connect to Azure Cosmos DB using Private Endpoint](tutorial-private-endpoint-cosmosdb-portal.md)
