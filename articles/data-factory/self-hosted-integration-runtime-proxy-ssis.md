---
title: Configure a self-hosted integration runtime as a proxy for SSIS
description: Learn how to configure a self-hosted integration runtime as a proxy for an Azure-SSIS Integration Runtime. 
services: data-factory
documentationcenter: ''
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
author: swinarko
ms.author: sawinark
ms.reviewer: douglasl
manager: mflasko
ms.custom: seo-lt-2019
ms.date: 09/09/2020
---

# Configure a self-hosted IR as a proxy for an Azure-SSIS IR in Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article describes how to run SQL Server Integration Services (SSIS) packages on an Azure-SSIS Integration Runtime (Azure-SSIS IR) in Azure Data Factory with a self-hosted integration runtime (self-hosted IR) configured as a proxy. 

With this feature, you can access data on-premises without having to [join your Azure-SSIS IR to a virtual network](./join-azure-ssis-integration-runtime-virtual-network.md). The feature is useful when your corporate network has a configuration too complex or a policy too restrictive for you to inject your Azure-SSIS IR into it.

This feature breaks down your SSIS data flow task into two staging tasks whenever applicable: 
* **On-premises staging task**: This task runs your data flow component that connects to an on-premises data store on your self-hosted IR. It moves data from the on-premises data store into a staging area in your Azure Blob storage or vice versa.
* **Cloud staging task**: This task runs your data flow component that doesn't connect to an on-premises data store on your Azure-SSIS IR. It moves data from the staging area in your Azure Blob storage to a cloud data store or vice versa.

If your data flow task moves data from on premises to cloud, then the first and second staging tasks will be on-premises and cloud staging tasks, respectively. If your data flow task moves data from cloud to on premises, then the first and second staging tasks will be cloud and on-premises staging tasks, respectively. If your data flow task moves data from on premises to on premises, then the first and second staging tasks will be both on-premises staging tasks. If your data flow task moves data from cloud to cloud, then this feature isn't applicable.

Other benefits and capabilities of this feature allow you to, for example, set up your self-hosted IR in regions that are not yet supported by an Azure-SSIS IR, and allow the public static IP address of your self-hosted IR on the firewall of your data sources.

## Prepare the self-hosted IR

To use this feature, you first create a data factory and set up an Azure-SSIS IR in it. If you have not already done so, follow the instructions in [Set up an Azure-SSIS IR](./tutorial-deploy-ssis-packages-azure.md).

You then set up your self-hosted IR in the same data factory where your Azure-SSIS IR is set up. To do so, see [Create a self-hosted IR](./create-self-hosted-integration-runtime.md).

Finally, you download and install the latest version of the self-hosted IR, as well as the additional drivers and runtime, on your on-premises machine or Azure virtual machine (VM), as follows:
- Download and install the latest version of the [self-hosted IR](https://www.microsoft.com/download/details.aspx?id=39717).
- If you use Object Linking and Embedding Database (OLEDB)/Open Database Connectivity (ODBC) connectors in your packages, download and install the relevant drivers on the same machine where your self-hosted IR is installed, if you haven't done so already.  

  If you use the earlier version of the OLEDB driver for SQL Server (SQL Server Native Client [SQLNCLI]), [download the 64-bit version](https://www.microsoft.com/download/details.aspx?id=50402).  

  If you use the latest version of OLEDB driver for SQL Server (MSOLEDBSQL), [download the 64-bit version](https://www.microsoft.com/download/details.aspx?id=56730).  
  
  If you use OLEDB/ODBC drivers for other database systems, such as PostgreSQL, MySQL, Oracle, and so on, you can download the 64-bit versions from their websites.
- If you haven't done so already, [download and install the 64-bit version of Visual C++ (VC) runtime](https://www.microsoft.com/download/details.aspx?id=40784) on the same machine where your self-hosted IR is installed.

## Prepare the Azure Blob storage-linked service for staging

If you haven't already done so, create an Azure Blob storage-linked service in the same data factory where your Azure-SSIS IR is set up. To do so, see [Create an Azure data factory-linked service](./quickstart-create-data-factory-portal.md#create-a-linked-service). Be sure to do the following:
- For **Data Store**, select **Azure Blob Storage**.  
- For **Connect via integration runtime**, select **AutoResolveIntegrationRuntime** (not your Azure-SSIS IR nor your self-hosted IR), because we use the default Azure IR to fetch access credentials for your Azure Blob Storage.
- For **Authentication method**, select **Account key**, **SAS URI**, or **Service Principal**.  

    >[!TIP]
    >If you select the **Service Principal** method, grant your service principal at least a *Storage Blob Data Contributor* role. For more information, refer to [Azure Blob storage connector](connector-azure-blob-storage.md#linked-service-properties).

![Prepare the Azure Blob storage-linked service for staging](media/self-hosted-integration-runtime-proxy-ssis/shir-azure-blob-storage-linked-service.png)

## Configure an Azure-SSIS IR with your self-hosted IR as a proxy

Having prepared your self-hosted IR and Azure Blob storage-linked service for staging, you can now configure your new or existing Azure-SSIS IR with the self-hosted IR as a proxy in your data factory portal or app. Before you do so, though, if your existing Azure-SSIS IR is already running, stop it and then restart it.

1. In the **Integration runtime setup** pane, skip past the **General Settings** and **SQL Settings** sections by selecting **Next**. 

1. In the **Advanced settings** section, do the following:

   1. Select the **Set up Self-Hosted Integration Runtime as a proxy for your Azure-SSIS Integration Runtime** check box. 

   1. In the **Self-Hosted Integration Runtime** drop-down list, select your existing self-hosted IR as a proxy for the Azure-SSIS IR.

   1. In the **Staging storage linked service** drop-down list, select your existing Azure Blob storage-linked service or create a new one for staging.

   1. In the **Staging path** box, specify a blob container in your selected Azure Blob storage account or leave it empty to use a default one for staging.

   1. Select **Continue**.

   ![Advanced settings with a self-hosted IR](./media/tutorial-create-azure-ssis-runtime-portal/advanced-settings-shir.png)

You can also configure your new or existing Azure-SSIS IR with the self-hosted IR as a proxy by using PowerShell.

```powershell
$ResourceGroupName = "[your Azure resource group name]"
$DataFactoryName = "[your data factory name]"
$AzureSSISName = "[your Azure-SSIS IR name]"
# Self-hosted integration runtime info - This can be configured as a proxy for on-premises data access 
$DataProxyIntegrationRuntimeName = "" # OPTIONAL to configure a proxy for on-premises data access 
$DataProxyStagingLinkedServiceName = "" # OPTIONAL to configure a proxy for on-premises data access 
$DataProxyStagingPath = "" # OPTIONAL to configure a proxy for on-premises data access 

# Add self-hosted integration runtime parameters if you configure a proxy for on-premises data accesss
if(![string]::IsNullOrEmpty($DataProxyIntegrationRuntimeName) -and ![string]::IsNullOrEmpty($DataProxyStagingLinkedServiceName))
{
    Set-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
        -DataFactoryName $DataFactoryName `
        -Name $AzureSSISName `
        -DataProxyIntegrationRuntimeName $DataProxyIntegrationRuntimeName `
        -DataProxyStagingLinkedServiceName $DataProxyStagingLinkedServiceName

    if(![string]::IsNullOrEmpty($DataProxyStagingPath))
    {
        Set-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
            -DataFactoryName $DataFactoryName `
            -Name $AzureSSISName `
            -DataProxyStagingPath $DataProxyStagingPath
    }
}
Start-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
    -DataFactoryName $DataFactoryName `
    -Name $AzureSSISName `
    -Force
```

## Enable SSIS packages to connect by proxy

By using the latest SSDT as either the SSIS Projects extension for Visual Studio or a standalone installer, you can find a new `ConnectByProxy` property that has been added in the connection managers for supported data flow components.
* [Download the SSIS Projects extension for Visual Studio](https://marketplace.visualstudio.com/items?itemName=SSIS.SqlServerIntegrationServicesProjects)
* [Download the standalone installer](/sql/ssdt/download-sql-server-data-tools-ssdt?view=sql-server-2017#ssdt-for-vs-2017-standalone-installer)   

When you design new packages containing data flow tasks with components that access data on premises, you can enable this property by setting it to *True* in the **Properties** pane of the relevant connection managers.

![Enable ConnectByProxy property](media/self-hosted-integration-runtime-proxy-ssis/shir-connection-manager-properties.png)

You can also enable this property when you run existing packages, without having to manually change them one by one.  There are two options:
- **Option A**: Open, rebuild, and redeploy the project containing those packages with the latest SSDT to run on your Azure-SSIS IR. You can then enable the property by setting it to *True* for the relevant connection managers. When you're running packages from SSMS, these connection managers appear on the **Connection Managers** tab of the **Execute Package** pop-up window.

  ![Enable ConnectByProxy property2](media/self-hosted-integration-runtime-proxy-ssis/shir-connection-managers-tab-ssms.png)

  You can also enable the property by setting it to *True* for the relevant connection managers that appear on the **Connection Managers** tab of [Execute SSIS Package activity](./how-to-invoke-ssis-package-ssis-activity.md) when you're running packages in Data Factory pipelines.
  
  ![Enable ConnectByProxy property3](media/self-hosted-integration-runtime-proxy-ssis/shir-connection-managers-tab-ssis-activity.png)

- **Option B:** Redeploy the project containing those packages to run on your SSIS IR. You can then enable the property by providing its property path, `\Package.Connections[YourConnectionManagerName].Properties[ConnectByProxy]`, and setting it to *True* as a property override on the **Advanced** tab of the **Execute Package** pop-up window when you're running packages from SSMS.

  ![Enable ConnectByProxy property4](media/self-hosted-integration-runtime-proxy-ssis/shir-advanced-tab-ssms.png)

  You can also enable the property by providing its property path, `\Package.Connections[YourConnectionManagerName].Properties[ConnectByProxy]`, and setting it to *True* as a property override on the **Property Overrides** tab of [Execute SSIS Package activity](./how-to-invoke-ssis-package-ssis-activity.md) when you're running packages in Data Factory pipelines.
  
  ![Enable ConnectByProxy property5](media/self-hosted-integration-runtime-proxy-ssis/shir-property-overrides-tab-ssis-activity.png)

## Debug the on-premises and cloud staging tasks

On your self-hosted IR, you can find the runtime logs in the *C:\ProgramData\SSISTelemetry* folder and the execution logs of on-premises staging tasks in the *C:\ProgramData\SSISTelemetry\ExecutionLog* folder.  You can find the execution logs of cloud staging tasks in your SSISDB or specified logging paths, depending on whether you store your packages in SSISDB or not. You can also find the unique IDs of on-premises staging tasks in the execution logs of cloud staging tasks. 

![Unique ID of the first staging task](media/self-hosted-integration-runtime-proxy-ssis/shir-first-staging-task-guid.png)

## Use Windows authentication in on-premises staging tasks

If on-premises staging tasks on your self-hosted IR require Windows authentication, [configure your SSIS packages to use the same Windows authentication](/sql/integration-services/lift-shift/ssis-azure-connect-with-windows-auth?view=sql-server-ver15). 

Your on-premises staging tasks will be invoked with the self-hosted IR service account (*NT SERVICE\DIAHostService*, by default), and your data stores will be accessed with the Windows authentication account. Both accounts require certain security policies to be assigned to them. On the self-hosted IR machine, go to **Local Security Policy** > **Local Policies** > **User Rights Assignment**, and then do the following:

1. Assign the *Adjust memory quotas for a process* and *Replace a process level token* policies to the self-hosted IR service account. This should occur automatically when you install your self-hosted IR with the default service account. If it doesn't, assign those policies manually. If you use a different service account, assign the same policies to it.

1. Assign the *Log on as a service* policy to the Windows Authentication account.

## Billing for the on-premises and cloud staging tasks

The on-premises staging tasks that run on your self-hosted IR are billed separately, just as any data movement activities that run on a self-hosted IR are billed. This is specified in the [Azure Data Factory data pipeline pricing](https://azure.microsoft.com/pricing/details/data-factory/data-pipeline/) article.

The cloud staging tasks that run on your Azure-SSIS IR are not be billed separately, but your running Azure-SSIS IR is billed as specified in the [Azure-SSIS IR pricing](https://azure.microsoft.com/pricing/details/data-factory/ssis/) article.

## Enabling TLS 1.2

If you need to use strong cryptography/more secure network protocol (TLS 1.2) and disable older SSL/TLS versions on your self-hosted IR, you can download and run the *main.cmd* script that can be found in the *CustomSetupScript/UserScenarios/TLS 1.2* folder of our public preview container.  Using [Azure Storage Explorer](https://storageexplorer.com/), you can connect to our public preview container by entering the following SAS URI:

`https://ssisazurefileshare.blob.core.windows.net/publicpreview?sp=rl&st=2020-03-25T04:00:00Z&se=2025-03-25T04:00:00Z&sv=2019-02-02&sr=c&sig=WAD3DATezJjhBCO3ezrQ7TUZ8syEUxZZtGIhhP6Pt4I%3D`

## Current limitations

- Only data flow tasks with OLEDB/ODBC/Flat File sources or OLEDB destination are currently supported.
- Only Azure Blob storage-linked services that are configured with *Account key*, *Shared Access Signature (SAS) URI*, or *Service Principal* authentication are currently supported.
- *ParameterMapping* in OLEDB Source is currently unsupported. As a workaround, please use *SQL Command From Variable* as the *AccessMode* and use *Expression* to insert your variables/parameters in a SQL command. As an illustration, see the *ParameterMappingSample.dtsx* package that can be found in the *SelfHostedIRProxy/Limitations* folder of our public preview container. Using Azure Storage Explorer, you can connect to our public preview container by entering the above SAS URI.

## Next steps

After you've configured your self-hosted IR as a proxy for your Azure-SSIS IR, you can deploy and run your packages to access data on-premises as Execute SSIS Package activities in Data Factory pipelines. To learn how, see [Run SSIS packages as Execute SSIS Package activities in Data Factory pipelines](./how-to-invoke-ssis-package-ssis-activity.md).