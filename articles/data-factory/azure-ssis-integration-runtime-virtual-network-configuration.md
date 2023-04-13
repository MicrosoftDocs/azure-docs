---
title: Configure a virtual network for injection of Azure-SSIS integration runtime
description: Learn how to configure a virtual network for injection of Azure-SSIS integration runtime. 
ms.service: data-factory
ms.subservice: integration-services
ms.topic: conceptual
ms.date: 04/12/2023
author: chugugrace
ms.author: chugu 
---

# Configure a virtual network for injection of Azure-SSIS integration runtime

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

When using SQL Server Integration Services (SSIS) in Azure Data Factory (ADF) or Synapse Pipelines, there are two methods for you to join your Azure-SSIS integration runtime (IR) to a virtual network: standard and express. The express method starts your Azure-SSIS IR faster and has no inbound, as well as less outbound, traffic requirements, but it has some limitations compared to the standard method.

## <a name="compare"></a>Compare the standard and express virtual network injection methods

Here’s a table highlighting the differences between standard and express virtual network injection methods:

| Comparison | Standard virtual network injection | Express virtual network injection |
|------------|------------------------------------|-----------------------------------|
| **Azure-SSIS IR starting duration** | Around 30 minutes. | Around 5 minutes. | 
| **Azure subscription & resource group settings** | *Microsoft.Batch* must be registered as a resource provider in the virtual network subscription.<br/><br/>Creation of a public IP address, load balancer, and network security group (NSG) must be allowed in the virtual network resource group. | *Microsoft.Batch* must be registered as a resource provider in the virtual network subscription. | 
| **Virtual network subnet** | Subnet mustn’t be dedicated to other Azure services. | Subnet mustn’t be dedicated to other Azure services.<br/><br/>Subnet must be delegated to *Microsoft.Batch/batchAccounts*. | 
| **Virtual network permission** | User creating Azure-SSIS IR must have _Microsoft.Network/virtualNetworks/\*/join_ permission. | User creating Azure-SSIS IR must have *Microsoft.Network/virtualNetworks/subnets/join/action* permission. | 
| **Static public IP addresses** | (Optional) Bring your own static public IP addresses (BYOIP) for Azure-SSIS IR. | (Optional) Configure virtual network network address translation (NAT) to set up a static public IP address for Azure-SSIS IR. | 
| **Custom DNS server** | Recommended to forward unresolved DNS requests to Azure recursive resolvers. | Recommended to forward unresolved DNS requests to Azure recursive resolvers.<br/><br/>Requires a standard custom setup for Azure-SSIS IR. | 
| **Inbound traffic** | Port *29876, 29877* must be open for TCP  traffic with *BatchNodeManagement* service tag as source. | Not required. | 
| **Outbound traffic** | Port *443* must be open for TCP traffic with *AzureCloud* service tag as destination. | Port *443* must be open for TCP traffic with *DataFactoryManagement* service tag as destination. | 
| **Resource lock** | Not allowed in the resource group. | Not allowed in the virtual network. | 
| **Azure-SSIS IRs per virtual network** | Unlimited. | Only one. | 

:::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/standard-express-virtual-network-injection.png" alt-text="Screenshot of standard and express virtual network injection methods" lightbox="media/join-azure-ssis-integration-runtime-virtual-network/standard-express-virtual-network-injection.png":::

Your virtual network needs to be configured differently based on your injection method. If you use the express method, see the [Express virtual network injection method](azure-ssis-integration-runtime-express-virtual-network-injection.md) article, otherwise see the [Standard virtual network injection method](azure-ssis-integration-runtime-standard-virtual-network-injection.md) article.
  
## <a name="registerbatch"></a>Register Azure Batch as a resource provider

Using Azure portal, you can register Azure Batch, the underlying infrastructure for SSIS in ADF, as a resource provider in Azure subscription that has the virtual network for your Azure-SSIS IR to join. If you’ve already used Azure Batch or created Azure-SSIS IR via ADF UI in that subscription, it’s already registered. Otherwise, you can do so following these steps:

1. After selecting your virtual network in Azure portal, select the highlighted subscription on its **Overview** page.  

1. Select **Resource providers** on the left-hand-side menu.

1. Select and register *Microsoft.Batch*, if it’s not already registered.

:::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/batch-registered-confirmation.png" alt-text="Confirmation of &quot;Registered&quot; status":::

If you don't see *Microsoft.Batch* in the list, you can [create an empty Azure Batch account](../batch/batch-account-create-portal.md) in that subscription to delete later. 

## <a name="delegatesubnet"></a>Delegate a subnet to Azure Batch

If you use express virtual network injection, you must delegate the subnet, in which your Azure-SSIS IR will be injected, to Azure Batch, the underlying infrastructure for SSIS in ADF. Using Azure portal, you can do so following these steps:

1. After selecting your virtual network in Azure portal, select **Subnets** on the left-hand-side menu.

1. Select your subnet name to open its pane and make sure that it has available IP addresses for at least two times your Azure-SSIS IR node number.

1. Select *Microsoft.Batch/batchAccounts* in the **Delegate subnet to a service** dropdown menu.

1. Select the **Save** button.

:::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/delegate-subnet-to-batch.png" alt-text="Delegate subnet to Azure Batch":::

## <a name="grantperms"></a>Grant virtual network permissions

Using Azure portal, you can grant the user creating Azure-SSIS IR the necessary role-based access control (RBAC) permissions to join the virtual network/subnet. You can do so following these steps:

1. After selecting your virtual network in Azure portal, if you use standard virtual network injection, you can select **Access control (IAM)** on the left-hand-side menu. If you use express virtual network injection, you can select **Subnets** on the left-hand-side menu, select your subnet row, and then select **Manage users** on the top-side menu to open the **Access Control** page.

1. Select the **Add role assignment** button to open the **Add role assignment** page.

1. Select *Network Contributor* or your custom role in the **Role** list and select the **Next** button.

1. Select the **User, group, or service principal** option in the **Assign access to** section.

1. Select the **Select members** link to search and select the user creating Azure-SSIS IR.

1. Select the **Select**, **Next**, and **Review + assign** buttons.

:::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/grant-virtual-network-permissions.png" alt-text="Grant virtual network permissions":::

## Next steps

- [Express virtual network injection method](azure-ssis-integration-runtime-express-virtual-network-injection.md)
- [Standard virtual network injection method](azure-ssis-integration-runtime-standard-virtual-network-injection.md)
- [Join Azure-SSIS IR to a virtual network via ADF UI](join-azure-ssis-integration-runtime-virtual-network-ui.md)
- [Join Azure-SSIS IR to a virtual network via Azure PowerShell](join-azure-ssis-integration-runtime-virtual-network-powershell.md)

For more information about Azure-SSIS IR, see the following articles: 

- [Azure-SSIS IR](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides general conceptual information about IRs, including Azure-SSIS IR. 
- [Tutorial: Deploy SSIS packages to Azure](tutorial-deploy-ssis-packages-azure.md). This tutorial provides step-by-step instructions to create your Azure-SSIS IR. It uses Azure SQL Database server to host SSISDB. 
- [Create an Azure-SSIS IR](create-azure-ssis-integration-runtime.md). This article expands on the tutorial. It provides instructions on using Azure SQL Database server configured with a virtual network service endpoint/IP firewall rule/private endpoint or Azure SQL Managed Instance that joins a virtual network to host SSISDB. It shows you how to join your Azure-SSIS IR to a virtual network. 
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to retrieve and understand information about your Azure-SSIS IR.
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or delete your Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding more nodes.
