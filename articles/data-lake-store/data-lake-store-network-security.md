---
title: Network security in Azure Data Lake Storage Gen1 | Microsoft Docs
description: Understand how virtual network integration works in Azure Data Lake Storage Gen1
services: data-lake-store
documentationcenter: ''
author: twooley
manager: mtillman
editor: cgronlun

ms.service: data-lake-store
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 10/09/2018
ms.author: elsung

---
# Virtual network integration for Azure Data Lake Storage Gen1

This article introduces virtual network integration for Azure Data Lake Storage Gen1. With virtual network integration, you can configure your accounts to accept traffic only from specific virtual networks and subnets. 

This feature helps to secure your Data Lake Storage account from external threats.

Virtual network integration for Data Lake Storage Gen1 makes use of the virtual network service endpoint security between your virtual network and Azure Active Directory (Azure AD) to generate additional security claims in the access token. These claims are then used to authenticate your virtual network to your Data Lake Storage Gen1 account and allow access.

> [!NOTE]
> There's no additional charge associated with using these capabilities. Your account is billed at the standard rate for Data Lake Storage Gen1. For more information, see [pricing](https://azure.microsoft.com/pricing/details/data-lake-store/?cdn=disable). For all other Azure services that you use, see [pricing](https://azure.microsoft.com/pricing/#product-picker).

## Scenarios for virtual network integration for Data Lake Storage Gen1

With Data Lake Storage Gen1 virtual network integration, you can restrict access to your Data Lake Storage Gen1 account from specific virtual networks and subnets. After your account is locked to the specified virtual network subnet, other virtual networks/VMs in Azure aren't allowed access. Functionally, Data Lake Storage Gen1 virtual network integration enables the same scenario as [virtual network service endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview). A few key differences are detailed in the following sections. 

![Scenario diagram for Data Lake Storage Gen1 virtual network integration](media/data-lake-store-network-security/scenario-diagram.png)

> [!NOTE]
> The existing IP firewall rules can be used in addition to virtual network rules to allow access from on-premises networks too. 

## Optimal routing with Data Lake Storage Gen1 virtual network integration

A key benefit of virtual network service endpoints is [optimal routing](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview#key-benefits) from your virtual network. You can perform the same route optimization to Data Lake Storage Gen1 accounts. Use the following [user-defined routes](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview#user-defined) from your virtual network to your Data Lake Storage Gen1 account.

**Data Lake Storage public IP address** – Use the public IP address for your target Data Lake Storage Gen1 accounts. To identify the IP addresses for your Data Lake Storage Gen1 account, [resolve the DNS names](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-connectivity-from-vnets#enabling-connectivity-to-azure-data-lake-storage-gen1-from-vms-with-restricted-connectivity) of your accounts. Create a separate entry for each address.

    ```azurecli
    # Create a route table for your resource group.
    az network route-table create --resource-group $RgName --name $RouteTableName
    
    # Create route table rules for Data Lake Storage public IP addresses.
    # There's one rule per Data Lake Storage public IP address. 
    az network route-table route create --name toADLSregion1 --resource-group $RgName --route-table-name $RouteTableName --address-prefix <ADLS Public IP Address> --next-hop-type Internet
    
    # Update the virtual network, and apply the newly created route table to it.
    az network vnet subnet update --vnet-name $VnetName --name $SubnetName --resource-group $RgName --route-table $RouteTableName
    ```

## Data exfiltration from the customer virtual network

In addition to securing the Data Lake Storage accounts for access from the virtual network, you also might be interested in making sure there's no exfiltration to an unauthorized account.

Use a firewall solution in your virtual network to filter the outbound traffic based on the destination account URL. Allow access to only approved Data Lake Storage Gen1 accounts.

Some available options are:
- [Azure Firewall](https://docs.microsoft.com/azure/firewall/overview): [Deploy and configure an Azure firewall](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal) for your virtual network. Secure the outbound Data Lake Storage traffic, and lock it down to the known and approved account URL.
- [Network virtual appliance](https://azure.microsoft.com/solutions/network-appliances/) firewall: Your administrator might allow the use of only certain commercial firewall vendors. Use a network virtual appliance firewall solution that's available in the Azure Marketplace to perform the same function.

> [!NOTE]
> Using firewalls in the data path introduces an additional hop in the data path. It might affect the network performance for end-to-end data exchange. Throughput availability and connection latency might be affected. 

## Limitations

- HDInsight clusters that were created before Data Lake Storage Gen1 virtual network integration support was available must be re-created to support this new feature.
 
- When you create a new HDInsight cluster and select a Data Lake Storage Gen1 account with virtual network integration enabled, the process fails. First, disable the virtual network rule. Or on the **Firewall and virtual networks** blade of the Data Lake Storage account, select **Allow access from all networks and services**. Then create the HDInsight cluster before finally re-enabling the virtual network rule or de-selecting **Allow access from all networks and services**. For more information, see the [Exceptions](#exceptions) section.

- Data Lake Storage Gen1 virtual network integration doesn't work with [managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).
  
- File and folder data in your virtual network-enabled Data Lake Storage Gen1 account isn't accessible from the portal. This restriction includes access from a VM that’s within the virtual network and activities such as using Data Explorer. Account management activities continue to work. File and folder data in your virtual network-enabled Data Lake Storage account is accessible via all non-portal resources. These resources include SDK access, PowerShell scripts, and other Azure services when they don't originate from the portal. 

## Configuration

### Step 1: Configure your virtual network to use an Azure AD service endpoint

1.	Go to the Azure portal, and sign in to your account.
 
2.	[Create a new virtual network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)in your subscription. Or you can go to an existing virtual network. The virtual network must be in the same region as the Data Lake Storage Gen 1 account.
 
3.	On the **Virtual network** blade, select **Service endpoints**.
 
4.	Select **Add** to add a new service endpoint.

    ![Add a virtual network service endpoint](media/data-lake-store-network-security/config-vnet-1.png)

5.	Select **Microsoft.AzureActiveDirectory** as the service for the endpoint.

     ![Select the Microsoft.AzureActiveDirectory service endpoint](media/data-lake-store-network-security/config-vnet-2.png)

6.	Select the subnets for which you intend to allow connectivity. Select **Add**.

    ![Select the subnet](media/data-lake-store-network-security/config-vnet-3.png)

7.	It can take up to 15 minutes for the service endpoint to be added. After it's added, it shows up in the list. Verify that it shows up and that all details are as configured.
 
    ![Successful addition of the service endpoint](media/data-lake-store-network-security/config-vnet-4.png)

### Step 2: Set up the allowed virtual network or subnet for your Data Lake Storage Gen1 account

1.	After you configure your virtual network, [create a new Azure Data Lake Storage Gen1 account](data-lake-store-get-started-portal.md#create-a-data-lake-storage-gen1-account) in your subscription. Or you can go to an existing Data Lake Storage Gen1 account. The Data Lake Storage Gen1 account must be in the same region as the virtual network.
 
2.	Select **Firewall and virtual networks**.

    > [!NOTE]
    > If you don't see **Firewall and virtual networks** in the settings, log off the portal. Close the browser, and clear the browser cache. Restart the machine and retry.

       ![Add a virtual network rule to your Data Lake Storage account](media/data-lake-store-network-security/config-adls-1.png)

3.	Select **Selected networks**.
 
4.	Select **Add existing virtual network**.

    ![Add existing virtual network](media/data-lake-store-network-security/config-adls-2.png)

5.	Select the virtual networks and subnets to allow for connectivity. Select **Add**.

    ![Choose the virtual network and subnets](media/data-lake-store-network-security/config-adls-3.png)

6.	Make sure that the virtual networks and subnets show up correctly in the list. Select **Save**.

    ![Save the new rule](media/data-lake-store-network-security/config-adls-4.png)

    > [!NOTE]
    > It might take up to 5 minutes for the settings to take into effect after you save.

7.	[Optional] On the **Firewall and virtual networks** page, in the **Firewall** section, you can allow connectivity from specific IP addresses. 

## Exceptions
You can enable connectivity from Azure services and VMs outside of your selected virtual networks. On the **Firewall and virtual networks** blade, in the **Exceptions** area, select from two options:
 
- **Allow all Azure services to access this Data Lake Storage Gen1 account**. This option allows Azure services such as Azure Data Factory, Azure Event Hubs, and all Azure VMs to communicate with your Data Lake Storage account.

- **Allow Azure Data Lake Analytics to access this Data Lake Storage Gen1 account**. This option allows Data Lake Analytics connectivity to this Data Lake Storage account. 

  ![Firewall and virtual network exceptions](media/data-lake-store-network-security/firewall-exceptions.png)

We recommend that you keep these exceptions turned off. Turn them on only if you need connectivity from these other services from outside your virtual network.
