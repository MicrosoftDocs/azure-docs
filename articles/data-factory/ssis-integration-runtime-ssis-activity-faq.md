---
title: Troubleshoot package execution in the SSIS integration runtime
description: "This article provides troubleshooting guidance for SSIS package execution in the SSIS integration runtime"
ms.service: data-factory
ms.subservice: integration-services
ms.topic: faq
ms.author: chugu
author: chugugrace
ms.reviewer: chugugrace
ms.custom: seo-lt-2019
ms.date: 08/10/2023
---

# Troubleshoot package execution in the SSIS integration runtime

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]
  
This article includes the most common errors that you might find when you're executing SQL Server Integration Services (SSIS) packages in the SSIS integration runtime. It describes the potential causes and actions to solve the errors.
  
## General

### Where to find logs for troubleshooting

Use the Azure Data Factory portal to check the output of the SSIS package execution activity. The output includes the execution result, error messages, and operation ID. For details, see [Monitor the pipeline](how-to-invoke-ssis-package-ssis-activity.md#monitor-the-pipeline).

Use the SSIS catalog (SSISDB) to check the detail logs for the execution. For details, see [Monitor Running Packages and Other Operations](/sql/integration-services/performance/monitor-running-packages-and-other-operations).

## Common errors, causes, and solutions
      
### Error message: "Connection Timeout Expired" or "The service has encountered an error processing your request. Try again. "

Here are potential causes and recommended actions:
* The data source or destination is overloaded. Check the load on your data source or destination and see whether it has enough capacity. For example, if you used Azure SQL Database, consider scaling up if the database is likely to time out.
* The network between the SSIS integration runtime and the data source or destination is unstable, especially when the connection is cross-region or between on-premises and Azure. Apply the retry pattern in the SSIS package by following these steps:
  * Make sure your SSIS packages can rerun on failure without side effects (for example, data loss or data duplication).
  * Configure **Retry** and **Retry interval** of **Execute SSIS Package** activity on the **General** tab.
    :::image type="content" source="media/how-to-invoke-ssis-package-ssis-activity/ssis-activity-general.png" alt-text="Set properties on the General tab":::
  * For an ADO.NET and OLE DB source or destination component, set **ConnectRetryCount** and **ConnectRetryInterval** in Connection Manager in the SSIS package or SSIS activity.
          

### Error message: "ADO NET Source has failed to acquire the connection '...'` with "A network-related or instance-specific error occurred while establishing a connection to SQL Server. The server wasn't found or wasn't accessible. "

This issue usually means the data source or destination is inaccessible from the SSIS integration runtime. The reasons can vary. Try these actions:
* Make sure you're passing the data source or destination name/IP correctly.
* Make sure the firewall is set properly.
* Make sure your virtual network is configured properly if your data source or destination is on-premises:
  * You can verify whether the issue is from virtual network configuration by provisioning an Azure VM in the same virtual network. Then check whether the data source or destination can be accessed from the Azure VM.
  * You can find more details about using a virtual network with an SSIS integration runtime in [Join an Azure-SSIS integration runtime to a virtual network](join-azure-ssis-integration-runtime-virtual-network.md).


### Error message: "ADO NET Source has failed to acquire the connection '...'" with "Couldn't create a managed connection manager. "

The potential cause is that the ADO.NET provider used in the package isn't installed in the SSIS integration runtime. You can install the provider by using a custom setup. You can find more details about custom setup in [Customize setup for the Azure-SSIS integration runtime](how-to-configure-azure-ssis-ir-custom-setup.md).
          
### Error message: "The connection '...' isn't found "

A known issue in older versions of SQL Server Management Studio (SSMS) can cause this error. If the package contains a custom component (for example, SSIS Azure Feature Pack or partner components) that isn't installed on the machine where SSMS is used to do the deployment, SSMS will remove the component and cause the error. Upgrade [SSMS](/sql/ssms/download-sql-server-management-studio-ssms) to the latest version that has the issue fixed.

### Error message: `SSIS Executor exit code: -1073741819. "

* Potential cause & recommended action:
  * This error may be because of the limitation for Excel source and destination when multiple Excel sources or destinations are executing in parallel in multi-thread. You can work around this limitation by change your Excel components to execute in sequence, or separate them into different packages and trigger through "Execute Package Task" with ExecuteOutOfProcess property set as True.

### Error message: "There isn't enough space on the disk "

This error means the local disk is used up in the SSIS integration runtime node. Check whether your package or custom setup is consuming a lot of disk spaces:
* If the disk is consumed by your package, it will be freed up after the package execution finishes.
* If the disk is consumed by your custom setup, you'll need to stop the SSIS integration runtime, modify your script, and start the integration runtime again. The whole Azure blob container that you specified for custom setup will be copied to the SSIS integration runtime node, so check whether there's any unnecessary content under that container.

### Error message: "Failed to retrieve resource from master. Microsoft.SqlServer.IntegrationServices.Scale.ScaleoutContract.Common.MasterResponseFailedException: Code:300004. Description:Load file "***" failed. "

* Potential cause & recommended action:
  * If the SSIS Activity is executing package from file system (package file or project file), this error will occur if the project, package or configuration file is not accessible with the package access credential you provided in the SSIS Activity
    * If you are using Azure File:
      * The file path should start with \\\\\<storage account name\>.file.core.windows.net\\\<file share path\>
      * The domain should be "Azure"
      * The username should be \<storage account name\>
      * The password should be \<storage access key\>
    * If you are using on-premises file, please check if VNet, package access credential and permission are configured properly so that your Azure-SSIS integration runtime can access your on-premises file share


###  Error message: "The file name '...' specified in the connection was not valid "

* Potential cause & recommended action:
  * An invalid file name is specified
  * Make sure you are using FQDN (Fully Qualified Domain Name) instead of short time in your connection manager

### Error message: "Cannot open file '...' "

This error occurs when package execution can't find a file in the local disk in the SSIS integration runtime. Try these actions:
* Don't use the absolute path in the package that's being executed in the SSIS integration runtime. Use the current execution working directory (.) or the temp folder (%TEMP%) instead.
* If you need to persist some files on SSIS integration runtime nodes, prepare the files as described in [Customize setup](how-to-configure-azure-ssis-ir-custom-setup.md). All the files in the working directory will be cleaned up after the execution is finished.
* Use Azure Files instead of storing the file in the SSIS integration runtime node. For details, see [Use Azure file shares](/sql/integration-services/lift-shift/ssis-azure-files-file-shares#use-azure-file-shares).


### Error message: "The database 'SSISDB' has reached its size quota "

A potential cause is that the SSISDB database created in Azure SQL Database or in SQL Managed Instance has reached its quota. Try these actions:
* Consider increasing the DTU of your database. You can find details in [SQL Database limits for a logical server](/azure/azure-sql/database/resource-limits-logical-server).
* Check whether your package would generate many logs. If so, you can configure an elastic job to clean up these logs. For details, see [Clean up SSISDB logs with Azure Elastic Database jobs](how-to-clean-up-ssisdb-logs-with-elastic-jobs.md).

### Error message: "The request limit for the database is ... and has been reached. "

If many packages are running in parallel in the SSIS integration runtime, this error might occur because SSISDB has hit its request limit. Consider increasing the DTU of SSISDB to resolve this issue. You can find details in [SQL Database limits for a logical server](/azure/azure-sql/database/resource-limits-logical-server).

### Error message: "SSIS Operation failed with unexpected operation status: ... "

The error is mostly caused by a transient problem, so try to rerun the package execution. Apply the retry pattern in the SSIS package by following these steps:

* Make sure your SSIS packages can rerun on failure without side effects (for example, data loss or data duplication).
* Configure **Retry** and **Retry interval** of **Execute SSIS Package** activity on the **General** tab.
  :::image type="content" source="media/how-to-invoke-ssis-package-ssis-activity/ssis-activity-general.png" alt-text="Set properties on the General tab":::
* For an ADO.NET and OLE DB source or destination component, set **ConnectRetryCount** and **ConnectRetryInterval** in Connection Manager in the SSIS package or SSIS activity.
          
### Error message: "There is no active worker. "

This error usually means the SSIS integration runtime has an unhealthy status. Check the Azure portal for the status and detailed errors. For more information, see [Azure-SSIS integration runtime](./monitor-integration-runtime.md#azure-ssis-integration-runtime).

### Error message: "Your integration runtime cannot be upgraded and will eventually stop working, since we cannot access the Azure Blob container you provided for custom setup. "

This error occurs when the SSIS integration runtime can't access the storage configured for custom setup. Check whether the shared access signature (SAS) URI that you provided is valid and hasn't expired.

### Error message: "Microsoft OLE DB Provider for Analysis Services. 'Hresult: 0x80004005 Description:' COM error: COM error: mscorlib; Exception has been thrown by the target of an invocation "

One potential cause is that the username or password with Azure AD Multi-Factor Authentication enabled is configured for Azure Analysis Services authentication. This authentication isn't supported in the SSIS integration runtime. Try to use a service principal for Azure Analysis Services authentication:

1. Prepare a service principal as described in [Automation with service principals](../analysis-services/analysis-services-service-principal.md).
2. In the Connection Manager, configure **Use a specific user name and password:** set **app:*&lt;AppID&gt;*@*&lt;TenantID&gt;*** as the username and clientSecret as the password. Here is an example of a correctly formatted user name:
  
    `app:12345678-9012-3456-789a-bcdef012345678@9abcdef0-1234-5678-9abc-def0123456789abc`
1. In Connection Manager, configure **Use a specific user name and password**: set **AppID** as the username and **clientSecret** as the password.
    

### Error message: "ADONET Source has failed to acquire the connection {GUID} with the following error message: Login failed for user 'NT AUTHORITY\ANONYMOUS LOGON'" when using a managed identity "

Make sure you don't configure the authentication method of Connection Manager as **Active Directory Password Authentication** when the parameter *ConnectUsingManagedIdentity* is **True**. You can configure it as **SQL Authentication** instead, which is ignored if *ConnectUsingManagedIdentity* is set.

### Error message: "0xC020801F at ..., OData Source [...]: Cannot acquire a managed connection from the run-time connection manager "

One potential cause is that the Transport Layer Security (TLS) is not enable in SSIS integration runtime which is required by your OData source. You can enable TLS in SSIS integration runtime by using Customize setup. More detail can be found at [Can't connect Project Online Odata from SSIS](/office365/troubleshoot/cant-connect-project-online-odata-from-ssis) and [Customize setup for the Azure-SSIS integration runtime](how-to-configure-azure-ssis-ir-custom-setup.md).


### Error message: "Request staging task with operation guid ... fail since error: Failed to dispatch staging operation with error message: Microsoft.SqlServer.IntegrationServices.AisAgentCore.AisAgentException: Failed to load data proxy. "

Make sure your Azure-SSIS integration runtime is configured with Self-Hosted integration runtime. More detail can be found at [Configure Self-Hosted IR as a proxy for Azure-SSIS IR in ADF](self-hosted-integration-runtime-proxy-ssis.md).
          
### Error message: "Staging task status: Failed. Staging task error: ErrorCode: 2010, ErrorMessage: The Self-hosted Integration Runtime ... is offline "

Make sure your Self-Hosted integration runtime is installed and started. More detail can be found at [Create and configure a self-hosted integration runtime](create-self-hosted-integration-runtime.md)

### Error message: "Staging task error: ErrorCode: 2906, ErrorMessage: Package execution failed. Output: {"OperationErrorMessages": "Error: The requested OLE DB provider ... is not registered. If the 64-bit driver is not installed, run the package in 32-bit mode... "

Make sure the corresponding provider used by your OLE DB connectors in your package are installed on Self-Hosted integration runtime machine properly. More detail can be found at [Configure Self-Hosted IR as a proxy for Azure-SSIS IR in ADF](self-hosted-integration-runtime-proxy-ssis.md#prepare-the-self-hosted-ir)

### Error message: "Staging task error: ErrorCode: 2906, ErrorMessage: Package execution failed. Output: {"OperationErrorMessages": "Error: System.IO.FileLoadException: Could not load file or assembly 'Microsoft.WindowsAzure.Storage, Version=..., Culture=neutral, PublicKeyToken=31bf3856ad364e35' or one of its dependencies. The located assembly's manifest definition does not match the assembly reference.'... "

One potential cause is your Self-Hosted integration runtime is not installed or upgraded properly. Suggest to download and reinstall the latest Self-hosted integration runtime. More detail can be found at [Create and configure a self-hosted integration runtime](create-self-hosted-integration-runtime.md#installation-best-practices)
          

### Error message: "Staging task failed. TaskStatus: Failed, ErrorCode: 2906, ErrorMessage: Package execution failed. For more details, select the output of your activity run on the same row., Output: {"OperationErrorMessages": "4/14/2021 7:10:35 AM +00:00 : = Failed to start Named pipe proxy... "

Check if security policies are correctly assigned to the account running self-hosted IR service. If Windows authentication is used on Execute SSIS Package activity or the execution credential is set in SSIS catalog (SSISDB), the same security policies must be assigned to the Windows account used. More detail can be found at [Configure Self-Hosted IR as a proxy for Azure-SSIS IR in ADF](self-hosted-integration-runtime-proxy-ssis.md#enable-windows-authentication-for-on-premises-tasks)


### Error message: "A connection is required when requesting metadata. If you are working offline, uncheck Work Offline on the SSIS menu to enable the connection "

* Potential cause & recommended action:
  * If there is also a warning message "The component does not support using connection manager with ConnectByProxy value setting true“ in the execution log, this means a connection manager is used on a component which hasn't supported "ConnectByProxy" yet. The supported components can be found at [Configure Self-Hosted IR as a proxy for Azure-SSIS IR in ADF](self-hosted-integration-runtime-proxy-ssis.md#enable-ssis-packages-to-use-a-proxy)
  * Execution log can be found in [SSMS report](/sql/integration-services/performance/monitor-running-packages-and-other-operations#reports) or in the log folder you specified in SSIS package execution activity.
  * vNet can also be used to access on-premises data as an alternative. More detail can be found at [Join an Azure-SSIS integration runtime to a virtual network](join-azure-ssis-integration-runtime-virtual-network.md)
          

### Error message: "Staging task status: Failed. Staging task error: ErrorCode: 2906, ErrorMessage: Package execution failed. Output: {"OperationErrorMessages": "SSIS Executor exit code: -1.\n", "LogLocation": "...\\SSISTelemetry\\ExecutionLog\\...", "effectiveIntegrationRuntime": "...", "executionDuration": ..., "durationInQueue": { "integrationRuntimeQueue": ... }} "

Make sure Visual C++ runtime is installed on Self-Hosted integration runtime machine. More detail can be found at [Configure Self-Hosted IR as a proxy for Azure-SSIS IR in ADF](self-hosted-integration-runtime-proxy-ssis.md#prepare-the-self-hosted-ir)
          

### Error message: "Timeout when reading from staging"

This error occurs when SSIS-IR with SHIR as a data proxy can't read data from staging blob successfully. Usually, it is due to that SHIR has failed to transfer on-premises data to the staging blob. Then SSIS-IR's attempt to read staging data fails with timeout error. You need to check SHIR logs in C:\ProgramData\SSISTelemetry folder for runtime logs and C:\ProgramData\SSISTelemetry\ExecutionLog folder for execution logs to further investigate why data hasn't been uploaded to staging blob successfully by SHIR.

### Multiple Package executions are triggered unexpectedly

* Potential cause & recommended action:
  * ADF stored procedure activity or Lookup activity are used to trigger SSIS package execution. The t-sql command may hit transient issue and trigger the rerun which would cause multiple package executions.
  * Use ExecuteSSISPackage activity instead which ensures package execution won’t rerun unless user set retry count in activity. Detail can be found at [Run an SSIS package with the Execute SSIS Package activity](how-to-invoke-ssis-package-ssis-activity.md).
  * Refine your t-sql command to be able to rerun by checking if an execution has already been triggered
          

### Package execution takes too long

Here are potential causes and recommended actions:

* Too many package executions have been scheduled on the SSIS integration runtime. All these executions will be waiting in a queue for their turn.
  * Determine the maximum by using this formula:

    Max Parallel Execution Count per IR = Node Count * Max Parallel Execution per Node
  * To learn how to set the node count and maximum parallel execution per node, see [Create an Azure-SSIS integration runtime in Azure Data Factory](create-azure-ssis-integration-runtime.md).
* The SSIS integration runtime is stopped or has an unhealthy status. To learn how to check the SSIS integration runtime status and errors, see [Azure-SSIS integration runtime](monitor-integration-runtime.md#azure-ssis-integration-runtime).

We also recommend that you set a timeout on the **General** tab:

  :::image type="content" source="media/how-to-invoke-ssis-package-ssis-activity/ssis-activity-general.png" alt-text="Set properties on the General tab":::.
          

### Poor performance in package execution

Try these actions:

* Make sure the SSIS integration runtime is in the same region as the data source and destination.

* Set the logging level of package execution to **Performance** to collect duration information for each component in the execution. For details, see [Integration Services (SSIS) logging](/sql/integration-services/performance/integration-services-ssis-logging).

* Check IR node performance in the Azure portal:
  * For information about how to monitor the SSIS integration runtime, see [Azure-SSIS integration runtime](monitor-integration-runtime.md#azure-ssis-integration-runtime).
  * You can find CPU/memory history for the SSIS integration runtime by viewing the metrics of the data factory in the Azure portal.
    :::image type="content" source="media/ssis-integration-runtime-ssis-activity-faq/monitor-metrics-ssis-integration-runtime.png" alt-text="Monitor metrics of the SSIS integration runtime":::
