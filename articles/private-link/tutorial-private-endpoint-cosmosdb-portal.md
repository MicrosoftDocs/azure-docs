---
title: 'Tutorial: Connect to an Azure Cosmos DB account using an Azure Private endpoint'
titleSuffix: Azure Private Link
description: Get started with this tutorial using Azure Private endpoint to connect to an Azure Cosmos DB account privately.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: tutorial
ms.date: 06/22/2022
ms.custom: template-tutorial, ignite-2022
---

# Tutorial: Connect to an Azure Cosmos DB account using an Azure Private Endpoint

Azure Private endpoint is the fundamental building block for Private Link in Azure. It enables Azure resources, like virtual machines (VMs), to privately and securely communicate with Private Link resources such as Azure Cosmos DB.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and bastion host.
> * Create a virtual machine.
> * Create an Azure Cosmos DB account with a private endpoint.
> * Test connectivity to the private endpoint.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* An Azure subscription

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

[!INCLUDE [virtual-network-create-with-bastion.md](../../includes/virtual-network-create-with-bastion.md)]

[!INCLUDE [create-test-virtual-machine.md](../../includes/create-test-virtual-machine.md)]

## Create an Azure Cosmos DB account with a private endpoint

In this section, you'll create an Azure Cosmos DB account and configure the private endpoint.

1. In the left-hand menu, select **Create a resource** > **Databases** > **Azure Cosmos DB**, or search for **Azure Cosmos DB** in the search box.

2. In **Select API option** page, Select **Create** under **Azure Cosmos DB for NoSQL**.

2. In the **Basics** tab of **Create Azure Cosmos DB account** enter or select the following information:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **test-rg**. |
    | **Instance details** |  |
    | Account name | Enter **cosmosdb**. If the name is unavailable, enter a unique name. |
    | Location | Select **(US) East US**. |
    | Capacity mode | Leave the default **Provisioned throughput**. |
    | Apply Free Tier Discount | Leave the default **Do Not Apply**. |
   
3. Select the **Networking** tab, or select **Next: Global Distribution**, then **Next: Networking**.

4. In the **Networking** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network connectivity** | |
    | Connectivity method | Select **Private endpoint**. |
    | **Configure Firewall** | |
    | Allow access from the Azure portal | Leave the default **Allow**. |
    | Allow access from my IP | Leave the default **Deny**. |

5. In **Private endpoint**, select **+ Add**.

6. In **Create private endpoint** enter or select the following information:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **test-rg**. |
    | Location | Select **East US**. |
    | Name | Enter **private-endpoint**. |
    | Azure Cosmos DB sub-resource | Leave the default **Azure Cosmos DB for NoSQL - Recommended**. |
    | **Networking** |  |
    | Virtual network | Select **test-1**. |
    | Subnet | Select **subnet-1**. |
    | **Private DNS integration** |  |
    | Integrate with private DNS zone | Leave the default **Yes**. |
    | Private DNS Zone | Leave the default **(New) privatelink.documents.azure.com**. |

7. Select **OK**.

8. Select **Review + create**.

9. Select **Create**.

### Add a database and a container

1. Select **Go to resource**, or in the left-hand menu of the Azure portal, select **All Resources** > **cosmosdb**.

2. In the left-hand menu, select **Data Explorer**.

3. In the **Data Explorer** window, select **New Container**.

4. In **New Container**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Database id | Leave the default of **Create new**. </br> Enter **mydatabaseid** in the box. |
    | Database throughput (400 - unlimited RU/s) | Select **Manual**. </br> Enter **400** in the box. |
    | Container id | Enter **mycontainerid**. |
    | Partition key | Enter **/mykey**. |

5. Select **OK**.

6. In the **Settings** section of the Azure Cosmos DB account, select **Keys**.

7. Select copy on the **PRIMARY CONNECTION STRING**. A valid connection string is in the format: `AccountEndpoint=https://<cosmosdb-account-name>.documents.azure.com:443/;AccountKey=<accountKey>;`

## Test connectivity to private endpoint

In this section, you'll use the virtual machine you created in the previous steps to connect to the Azure Cosmos DB account across the private endpoint using **Azure Cosmos DB Explorer**.

1. Select **Resource groups** in the left-hand navigation pane.

1. Select **test-rg**.

1. Select **vm-1**.

1. On the overview page for **vm-1**, select **Connect** then **Bastion**.

1. Enter the username and password that you entered during the virtual machine creation.

1. Select **Connect** button.

1. Open Windows PowerShell on the server after you connect.

1. Enter `nslookup <cosmosdb-account-name>.documents.azure.com` and validate the name resolution. Replace **\<cosmosdb-account-name>** with the name of the Azure Cosmos DB account you created in the previous steps. You'll receive a message similar to what is displayed below:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    cosmosdb.privatelink.documents.azure.com
    Address:  10.1.0.5
    Aliases:  cosmosdb.documents.azure.com
    ```
    A private IP address of **10.1.0.5** is returned for the Azure Cosmos DB account name.  This address is in **subnet-1** subnet of **test-1** virtual network you created previously.

1. Go to [Azure Cosmos DB](https://cosmos.azure.com/). Select **Connect to your account with connection string**, then paste the connection string that you copied in the previous steps and select **Connect**.

1. Under the **Azure Cosmos DB for NoSQL** menu on the left, you see **mydatabaseid** and **mycontainerid** that you previously created in **cosmosdb**.

1. Close the connection to **vm-1**.

[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

In this tutorial, you learned how to create:

* Virtual network and bastion host.
* Virtual Machine.
* Azure Cosmos DB account.

Learn how to connect to a web app using an Azure Private Endpoint:
> [!div class="nextstepaction"]
> [Connect to a web app using Private Endpoint](tutorial-private-endpoint-webapp-portal.md)
