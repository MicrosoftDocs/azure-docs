---
title: Join Azure-SSIS integration runtime to a VNET | Microsoft Docs
description: Learn how to join Azure-SSIS integration runtime to an Azure virtual network. 
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: monicar

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/27/2017
ms.author: spelluru

---

# Join an Azure-SSIS integration runtime to a virtual network
You must join Azure-SSIS integration runtime (IR) to an Azure virtual network (VNet) if one of the following conditions is true: 

- You are hosting the SSIS Catalog database on a SQL Server Managed Instance (private preview) that is part of a VNet.
- You want to connect to on-premises data stores from SSIS packages running on an Azure-SSIS integration runtime.

 Azure Data Factory version 2 (Preview) lets you join your Azure-SSIS integration runtime to a classic VNet. Currently, Azure Resource Manager VNet is not supported. However, you can work it around as shown in the following section. 

 > [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Data Factory version 1 documentation](v1/data-factory-introduction.md).

## Access on-premises data stores
If SSIS packages access only public cloud data stores, you don't need to join Azure-SSIS IR to a VNet. If SSIS packages access on-premises data stores, you must join Azure-SSIS IR to a VNet that is connected to the on-premises network. If the SSIS Catalog is hosted in Azure SQL Database that is not in the VNet, you need to open appropriate ports. If the SSIS Catalog is hosted in Azure SQL Managed Instance that is in a classic VNet, you can join Azure-SSIS IR to the same classic VNet (or) a different classic VNet that has a class-to-classic VNet connection with the one that has the Azure SQL Managed Instance. The following sections provide more details.

Here are a few important points to note: 

- If there is no existing VNet connected to your on-premises network, first create a [classic VNet](../virtual-network/virtual-networks-create-vnet-classic-pportal.md) for your Azure-SSIS integration runtime to join. Then, configure a site-to-site [VPN gateway connection](../vpn-gateway/vpn-gateway-howto-site-to-site-classic-portal.md)/[ExpressRoute](../expressroute/expressroute-howto-linkvnet-classic.md) connection from that VNet to your on-premises network.
- If there is an existing classic VNet connected to your on-premises network in the same location as your Azure-SSIS integration runtime, you can join your Azure-SSIS integration runtime to it.
- If there is an existing classic VNet connected to your on-premises network in a different location from your Azure-SSIS Integration Runtime, you can first create a [classic VNet](../virtual-network/virtual-networks-create-vnet-classic-pportal.md) for your Azure-SSIS Integration Runtime to join. Then, configure a [classic-to-classic VNet](../vpn-gateway/vpn-gateway-howto-vnet-vnet-portal-classic.md) connection.
- If there is an existing Azure Resource Manager VNet connected to your on-premises network, first create a [classic VNet](../virtual-network/virtual-networks-create-vnet-classic-pportal.md) for your Azure-SSIS integration runtime to join. Then, configure a [classic-to-Azure Resource Manager VNet](../vpn-gateway/vpn-gateway-connect-different-deployment-models-portal.md) connection.

## Domain Name Services server 
If you need to use your own Domain Name Services (DNS) server in a VNet joined by your Azure-SSIS integration runtime, follow guidance to [ensure that the nodes of your Azure-SSIS integration runtime in VNet can resolve Azure endpoints](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server).

## Network Security Group
If you need to implement Network Security Group (NSG) in a VNet joined by your Azure-SSIS Integration Runtime, allow inbound/outbound traffics through the following ports:

| Ports | Direction | Transport Protocol | Purpose | Inbound Source/Outbound Destination |
| ---- | --------- | ------------------ | ------- | ----------------------------------- |
| 10100<br/>20100<br/>30100  | Inbound | TCP | Azure services use these ports to communicate with the nodes of your Azure-SSIS integration runtime in VNet. | Internet | 
| 443 | Outbound | TCP | The nodes of your Azure-SSIS integration runtime in VNet use this port to access Azure services, for example, Azure Storage, Event Hub, etc. | INTERNET | 
| 1433<br/>11000-11999<br/>14000-14999  | Outbound | TCP | The nodes of your Azure-SSIS integration runtime in VNet use these ports to access SSISDB hosted by your Azure SQL Database server (not applicable to SSISDB hosted by Azure SQL Managed Instance). | Internet | 

## Configure VNet
You first need to configure VNet using one of the following ways (script vs. Azure portal) before you can join an Azure-SSIS IR to the VNet. 

### Script to configure VNet 
Add the following script to automatically configure VNet permissions/settings for your Azure-SSIS integration runtime to join the VNet.

```powershell
# Register to Azure Batch resource provider
if(![string]::IsNullOrEmpty($VnetId) -and ![string]::IsNullOrEmpty($SubnetName))
{
    $BatchObjectId = (Get-AzureRmADServicePrincipal -ServicePrincipalName "MicrosoftAzureBatch").Id
    Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Batch
    while(!(Get-AzureRmResourceProvider -ProviderNamespace "Microsoft.Batch").RegistrationState.Contains("Registered"))
    {
    Start-Sleep -s 10
    }
    # Assign VM contributor role to Microsoft.Batch
    New-AzureRmRoleAssignment -ObjectId $BatchObjectId -RoleDefinitionName "Classic Virtual Machine Contributor" -Scope $VnetId
}
```

### Use portal to configure VNet
Running the script is the easiest way to configure VNet. If you do not have access to configure that VNet/the automatic configuration fails, the owner of that VNet/you can try to configure them manually in the following steps:

### Find the resource ID for your Azure VNet.
 
1. Log in to [Azure portal](https://portal.azure.com).
2. Click **More services**. Filter for and select **Virtual networks (classic)**.
3. Filter for and select your **virtual network** in the list. 
4. In the Virtual network (classic) page, select **Properties**. 

	![classic VNet resource ID](media/join-azure-ssis-integration-runtime-virtual-network/classic-vnet-resource-id.png)
5. Click the copy button for the **RESOURCE ID** to copy the resource ID for the classic network to the clipboard. Save the ID from the clipboard in OneNote or a file.
6. Click **Subnets** on the left menu, and ensure that the number of **available addresses** is greater than the nodes in your Azure-SSIS integration runtime.

	![Number of available addresses in VNet](media/join-azure-ssis-integration-runtime-virtual-network/number-of-available-addresses.png)
7. Join **MicrosoftAzureBatch** to **Classic Virtual Machine Contributor** role for the VNet. 
	1. Click Access control (IAM) on the left menu, and click **Add** in the toolbar.
	
		![Access control -> Add](media/join-azure-ssis-integration-runtime-virtual-network/access-control-add.png) 
	2. In **Add permissions** page, select **Classic Virtual Machine Contributor** for **Role**. Copy/paste **ddbf3205-c6bd-46ae-8127-60eb93363864** in the **Select** text box, and then select **Microsoft Azure Batch** from the list of search results. 
	
		![Add permissions - search](media/join-azure-ssis-integration-runtime-virtual-network/azure-batch-to-vm-contributor.png)
	3. Click Save to save the settings and to close the page.
	
		![Save access settings](media/join-azure-ssis-integration-runtime-virtual-network/save-access-settings.png)
	4. Confirm that you see **MicrosoftAzureBatch** in the list of contributors.
	
		![Confirm AzureBatch access](media/join-azure-ssis-integration-runtime-virtual-network/azure-batch-in-list.png)
5. Verify that Azure Batch provider is registered in the Azure subscription that has the VNet or register the Azure Batch provider. If you already have an Azure Batch account in your subscription, then your subscription is registered for Azure Batch.
	1. In Azure portal, click **Subscriptions** on the left menu. 
	2. Select your **subscription**. 
	3. Click **Resource providers** on the left, and confirm that `Microsoft.Batch` is a registered provider. 
	
		![confirmation-batch-registered](media/join-azure-ssis-integration-runtime-virtual-network/batch-registered-confirmation.png)

	If you don't see `Microsoft.Batch` is in the list, to register it, [create an empty Azure Batch account](../batch/batch-account-create-portal.md) in your subscription. You can delete it later. 

## Create an Azure-SSIS IR and join it to a VNet
You can create an Azure-SSIS IR and join it to VNet at the same time. For the complete script and instructions to create an Azure-SSIS IR and join it to a VNet at the same time, see [Create Azure-SSIS IR](create-azure-ssis-integration-runtime.md).

## Join an existing Azure-SSIS IR to a VNet
The script in the [Create Azure-SSIS integration runtime](create-azure-ssis-integration-runtime.md) article shows you how to create an Azure-SSIS IR and join it to a VNet in the same script. If you have an existing Azure-SSIS, perform the following steps to join it to the VNet. 

1. Stop the Azure-SSIS IR.
2. Configure the Azure-SSIS IR to join the VNet. 
3. Start the Azure-SSIS IR. 

## Define the variables

```powershell
$ResourceGroupName = "<Azure resource group name>"
$DataFactoryName = "<Data factory name>" 
$AzureSSISName = "<Specify Azure-SSIS IR name>"
# Get the following information from the properties page for your Classic Virtual Network in the Azure portal
# It should be in the format: 
# $VnetId = "/subscriptions/<Azure Subscription ID>/resourceGroups/<Azure Resource Group>/providers/Microsoft.ClassicNetwork/virtualNetworks/<Class Virtual Network Name>"
$VnetId = "<Name of your Azure classic virtual netowrk>"
$SubnetName = "<Name of the subnet in VNet>"
```

### Stop the Azure-SSIS IR
Stop the Azure-SSIS integration runtime before you can join it to a VNet. This command releases all of its nodes and stops billing.

```powershell
Stop-AzureRmDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
                                             -DataFactoryName $DataFactoryName `
                                             -Name $AzureSSISName `
                                             -Force 
```
### Configure VNet settings for the Azure-SSIS IR to join
Register to the Azure Batch resource provider:

```powershell
if(![string]::IsNullOrEmpty($VnetId) -and ![string]::IsNullOrEmpty($SubnetName))
{
    $BatchObjectId = (Get-AzureRmADServicePrincipal -ServicePrincipalName "MicrosoftAzureBatch").Id
    Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Batch
    while(!(Get-AzureRmResourceProvider -ProviderNamespace "Microsoft.Batch").RegistrationState.Contains("Registered"))
    {
        Start-Sleep -s 10
    }
    # Assign VM contributor role to Microsoft.Batch
    New-AzureRmRoleAssignment -ObjectId $BatchObjectId -RoleDefinitionName "Classic Virtual Machine Contributor" -Scope $VnetId
}
```

### Configure the Azure-SSIS IR
Run the Set-AzureRmDataFactoryV2IntegrationRuntime command to configure the Azure-SSIS integration runtime to join the VNet: 

```powershell
Set-AzureRmDataFactoryV2IntegrationRuntime  -ResourceGroupName $ResourceGroupName `
                                            -DataFactoryName $DataFactoryName `
                                            -Name $AzureSSISName `
                                            -Type Managed `
                                            -VnetId $VnetId `
                                            -Subnet $SubnetName
```

## Start the Azure-SSIS IR
Run the following command to start the Azure-SSIS integration runtime: 

```powershell
Start-AzureRmDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
                                             -DataFactoryName $DataFactoryName `
                                             -Name $AzureSSISName `
                                             -Force

```
This command takes from **20 to 30 minutes** to complete.

## Next steps
For more information about Azure-SSIS runtime, see the following topics: 

- [Azure-SSIS Integration Runtime](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides conceptual information about integration runtimes in general including the Azure-SSIS IR. 
- [Tutorial: deploy SSIS packages to Azure](tutorial-deploy-ssis-packages-azure.md). This article provides step-by-step instructions to create an Azure-SSIS IR and uses an Azure SQL database to host the SSIS catalog. 
- [How to: Create an Azure-SSIS integration runtime](create-azure-ssis-integration-runtime.md). This article expands on the tutorial and provides instructions on using Azure SQL Managed Instance (private preview) and joining the IR to a VNet. 
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to retrieve information about an Azure-SSIS IR and descriptions of statuses in the returned information. 
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or remove an Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding more nodes to the IR. 
