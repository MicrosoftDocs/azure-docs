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
ms.date: 01/22/2018
ms.author: spelluru

---

# Join an Azure-SSIS integration runtime to a virtual network
Join your Azure-SSIS integration runtime (IR) to an Azure virtual network (VNet) in the following scenarios: 

- You are hosting the SSIS Catalog database on a SQL Server Managed Instance (private preview) that is part of a VNet.
- You want to connect to on-premises data stores from SSIS packages running on an Azure-SSIS integration runtime.

 Azure Data Factory version 2 (Preview) lets you join your Azure-SSIS integration runtime to a classic or an Azure Resource Manager VNet. 

 > [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Data Factory version 1 documentation](v1/data-factory-introduction.md).

## Access on-premises data stores
If SSIS packages access only public cloud data stores, you don't need to join Azure-SSIS IR to a VNet. If SSIS packages access on-premises data stores, you must join Azure-SSIS IR to a VNet that is connected to the on-premises network. 

If the SSIS Catalog is hosted in Azure SQL Database that is not in the VNet, you need to open appropriate ports. 

If the SSIS Catalog is hosted in Azure SQL Managed Instance (MI) that is in a VNet, you can join Azure-SSIS IR to the same VNet (or) a different VNet that has a VNet-to-VNet connection with the one that has the Azure SQL Managed Instance. The VNet can be a Classic VNet or an Azure Resource Management VNet. If you are planning to join the Azure-SSIS IR in the **same VNet** that has the SQL MI,  ensure that the Azure-SSIS IR is in a **different subnet** from the one that has the SQL MI.   

The following sections provide more details.

Here are a few important points to note: 

- If there is no existing VNet connected to your on-premises network, first create an [Azure Resource Manager VNet](../virtual-network/quick-create-portal.md#create-a-virtual-network) or a [classic VNet](../virtual-network/virtual-networks-create-vnet-classic-pportal.md) for your Azure-SSIS integration runtime to join. Then, configure a site-to-site [VPN gateway connection](../vpn-gateway/vpn-gateway-howto-site-to-site-classic-portal.md)/[ExpressRoute](../expressroute/expressroute-howto-linkvnet-classic.md) connection from that VNet to your on-premises network.
- If there is an existing Azure Resource Manager or classic VNet connected to your on-premises network in the same location as your Azure-SSIS IR, you can join the IR to that VNet.
- If there is an existing classic VNet connected to your on-premises network in a different location from your Azure-SSIS IR, you can first create a [classic VNet](../virtual-network/virtual-networks-create-vnet-classic-pportal.md) for your Azure-SSIS IR to join. Then, configure a [classic-to-classic VNet](../vpn-gateway/vpn-gateway-howto-vnet-vnet-portal-classic.md) connection. Or you can create an [Azure Resource Manager VNet](../virtual-network/quick-create-portal.md#create-a-virtual-network) for your Azure-SSIS integration runtime to join. Then configure a [classic-to-Azure Resource Manager VNet](../vpn-gateway/vpn-gateway-connect-different-deployment-models-portal.md) connection.
- If there is an existing Azure Resource Manager VNet connected to your on-premises network in a different location from your Azure-SSIS IR, you can first create an [Azure Resource Manager VNet](../virtual-network/quick-create-portal.md##create-a-virtual-network) for your Azure-SSIS IR to join. Then, configure an Azure Resource Manger-to-Azure Resource Manager VNet connection. Or, you can create a [classic VNet](../virtual-network/virtual-networks-create-vnet-classic-pportal.md) for your Azure-SSIS IR to join. Then, configure a [classic-to-Azure Resource Manager VNet](../vpn-gateway/vpn-gateway-connect-different-deployment-models-portal.md) connection.

## Domain Name Services server 
If you need to use your own Domain Name Services (DNS) server in a VNet joined by your Azure-SSIS integration runtime, follow guidance to [ensure that the nodes of your Azure-SSIS integration runtime in VNet can resolve Azure endpoints](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server).

## Network Security Group
If you need to implement Network Security Group (NSG) in a VNet joined by your Azure-SSIS Integration Runtime, allow inbound/outbound traffics through the following ports:

| Ports | Direction | Transport Protocol | Purpose | Inbound Source/Outbound Destination |
| ---- | --------- | ------------------ | ------- | ----------------------------------- |
| 10100, 20100, 30100 (if you join IR into classic VNet)<br/><br/>29876, 29877 (if you join IR into Azure Resource Manager VNet) | Inbound | TCP | Azure services use these ports to communicate with the nodes of your Azure-SSIS integration runtime in VNet. | Internet | 
| 443 | Outbound | TCP | The nodes of your Azure-SSIS integration runtime in VNet use this port to access Azure services, for example, Azure Storage, Event Hub, etc. | INTERNET | 
| 1433<br/>11000-11999<br/>14000-14999  | Outbound | TCP | The nodes of your Azure-SSIS integration runtime in VNet use these ports to access SSISDB hosted by your Azure SQL Database server (not applicable to SSISDB hosted by Azure SQL Managed Instance). | Internet | 

## Azure portal (Data Factory UI)
This section shows you how to join an existing Azure SSIS runtime to a VNet (Classic or Azure Resource Manager) by using the Azure portal and Data Factory UI. First, you need to configure the VNet appropriately before joining your Azure SSIS IR to the VNet. Go through one of the next two sections based on the type of your VNet (Classic or Azure Resource Manager). Then, continue with the third section to join your Azure SSIS IR to the VNet. 

### Use portal to configure a Classic VNet
You first need to configure VNet before you can join an Azure-SSIS IR to the VNet.

1. Launch **Microsoft Edge** or **Google Chrome** web browser. Currently, Data Factory UI is supported only in Microsoft Edge and Google Chrome web browsers.
2. Log in to [Azure portal](https://portal.azure.com).
3. Click **More services**. Filter for and select **Virtual networks (classic)**.
4. Filter for and select your **virtual network** in the list. 
5. In the Virtual network (classic) page, select **Properties**. 

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

### Use portal to configure an Azure Resource Manager VNet
You first need to configure VNet before you can join an Azure-SSIS IR to the VNet.

1. Launch **Microsoft Edge** or **Google Chrome** web browser. Currently, Data Factory UI is supported only in Microsoft Edge and Google Chrome web browsers.
2. Log in to [Azure portal](https://portal.azure.com).
3. Click **More services**. Filter for and select **Virtual networks**.
4. Filter for and select your **virtual network** in the list. 
5. In the Virtual network page, select **Properties**. 
6. Click the copy button for the **RESOURCE ID** to copy the resource ID for the virtual network to the clipboard. Save the ID from the clipboard in OneNote or a file.
7. Click **Subnets** on the left menu, and ensure that the number of **available addresses** is greater than the nodes in your Azure-SSIS integration runtime.
8. Verify that Azure Batch provider is registered in the Azure subscription that has the VNet or register the Azure Batch provider. If you already have an Azure Batch account in your subscription, then your subscription is registered for Azure Batch.
	1. In Azure portal, click **Subscriptions** on the left menu. 
	2. Select your **subscription**. 
	3. Click **Resource providers** on the left, and confirm that `Microsoft.Batch` is a registered provider. 
	
		![confirmation-batch-registered](media/join-azure-ssis-integration-runtime-virtual-network/batch-registered-confirmation.png)

	If you don't see `Microsoft.Batch` is in the list, to register it, [create an empty Azure Batch account](../batch/batch-account-create-portal.md) in your subscription. You can delete it later.

### Join the Azure SSIS IR to a VNet


1. Launch **Microsoft Edge** or **Google Chrome** web browser. Currently, Data Factory UI is supported only in Microsoft Edge and Google Chrome web browsers.
2. In the [Azure portal](https://portal.azure.com), select **Data factories** on the left menu. If you do not see **Data factories** on the menu, select **More services**,  select **Data factories** in the **INTELLIGENCE + ANALYTICS** section. 
    
	![Data factories list](media/join-azure-ssis-integration-runtime-virtual-network/data-factories-list.png)
2. Select your data factory with Azure SSIS integration runtime in the list. You see the home page for your data factory. Select **Author & Deploy** tile. You see the Data Factory user interface (UI) in a separate tab. 

	![Data factory home page](media/join-azure-ssis-integration-runtime-virtual-network/data-factory-home-page.png)
3. In the Data Factory UI, switch to the **Edit** tab, select **Connections**, and switch to the **Integration Runtimes** tab. 

	![Integration runtimes tab](media/join-azure-ssis-integration-runtime-virtual-network/integration-runtimes-tab.png)
4. If your Azure SSIS IR is running, in the integration runtime list, select **Stop** button in the **Actions** column for your Azure SSIS IR. You cannot edit an IR until you stop it. 

	![Stop IR](media/join-azure-ssis-integration-runtime-virtual-network/stop-ir-button.png)
1. In the integration runtime list, select **Edit** button in the **Actions** column for your Azure SSIS IR.

	![Edit integration runtime](media/join-azure-ssis-integration-runtime-virtual-network/integration-runtime-edit.png)
5. On the **General settings** page of the **Integration Runtime Setup** window, select **Next**. 

	![IR setup - general settings](media/join-azure-ssis-integration-runtime-virtual-network/ir-setup-general-settings.png)
6. On the **SQL Settings** page, enter administrator **password**, and select **Next**.

	![IR setup - SQL settings](media/join-azure-ssis-integration-runtime-virtual-network/ir-setup-sql-settings.png)
7. On the **Advanced Settings** page, do the following actions: 

    1. Select the checkbox for the **Select a VNet for your Azure-SSIS Integration Runtime to join and allow Azure services to configure VNet permissions/settings**. 
    2. For **Type**, specify whether the VNet is a classic VNet or an Azure Resource Manager VNet. 
    3. For **VNet Name**, select your VNet.
    4. For **Subnet Name**, select your subnet in the VNet. 
    5. Select **Update**. 

	    ![IR setup - Advanced settings](media/join-azure-ssis-integration-runtime-virtual-network/ir-setup-advanced-settings.png)
8. Now, you can start the IR by using the **Start** button in the **Actions** column for your Azure SSIS IR. It takes approximately 20 minutes to start an Azure SSIS IR. 


## Azure PowerShell

### Configure VNet
You first need to configure VNet before you can join an Azure-SSIS IR to the VNet. Add the following script to automatically configure VNet permissions/settings for your Azure-SSIS integration runtime to join the VNet.

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
    if($VnetId -match "/providers/Microsoft.ClassicNetwork/")
    {
        # Assign VM contributor role to Microsoft.Batch
        New-AzureRmRoleAssignment -ObjectId $BatchObjectId -RoleDefinitionName "Classic Virtual Machine Contributor" -Scope $VnetId
    }
}
```

### Create an Azure-SSIS IR and join it to a VNet
You can create an Azure-SSIS IR and join it to VNet at the same time. For the complete script and instructions to create an Azure-SSIS IR and join it to a VNet at the same time, see [Create Azure-SSIS IR](create-azure-ssis-integration-runtime.md#azure-powershell).

### Join an existing Azure-SSIS IR to a VNet
The script in the [Create Azure-SSIS integration runtime](create-azure-ssis-integration-runtime.md) article shows you how to create an Azure-SSIS IR and join it to a VNet in the same script. If you have an existing Azure-SSIS, perform the following steps to join it to the VNet. 

1. Stop the Azure-SSIS IR.
2. Configure the Azure-SSIS IR to join the VNet. 
3. Start the Azure-SSIS IR. 

### Define the variables

```powershell
$ResourceGroupName = "<Azure resource group name>"
$DataFactoryName = "<Data factory name>" 
$AzureSSISName = "<Specify Azure-SSIS IR name>"
## These two parameters apply if you are using a VNet and an Azure SQL Managed Instance (private preview) 
# Specify information about your classic or Azure Resource Manager virtual network (VNet).
$VnetId = "<Name of your Azure virtual netowrk>"
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
    if($VnetId -match "/providers/Microsoft.ClassicNetwork/")
    {
        # Assign VM contributor role to Microsoft.Batch
        New-AzureRmRoleAssignment -ObjectId $BatchObjectId -RoleDefinitionName "Classic Virtual Machine Contributor" -Scope $VnetId
    }
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

### Start the Azure-SSIS IR
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
- [Tutorial: deploy SSIS packages to Azure](tutorial-create-azure-ssis-runtime-portal.md). This article provides step-by-step instructions to create an Azure-SSIS IR and uses an Azure SQL database to host the SSIS catalog. 
- [How to: Create an Azure-SSIS integration runtime](create-azure-ssis-integration-runtime.md). This article expands on the tutorial and provides instructions on using Azure SQL Managed Instance (private preview) and joining the IR to a VNet. 
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to retrieve information about an Azure-SSIS IR and descriptions of statuses in the returned information. 
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or remove an Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding more nodes to the IR. 
