---
title: "Troubleshoot package execution in the SSIS integration runtime | Microsoft Docs"
description: "This article provides troubleshooting guidance for SSIS package execution in the SSIS integration runtime"
services: data-factory
documentationcenter: ""
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 04/15/2019
author: wenjiefu
ms.author: wenjiefu
ms.reviewer: sawinark
manager: craigg
---

# Troubleshoot package execution in the SSIS integration runtime

This article includes the most common errors that you might find when you're executing SQL Server Integration Services (SSIS) packages in the SSIS integration runtime. It describes the potential causes and actions to solve the errors.

## Where to find logs for troubleshooting

Use the Azure Data Factory portal to check the output of the SSIS package execution activity. The output includes the execution result, error messages, and operation ID. For details, see [Monitor the pipeline](how-to-invoke-ssis-package-ssis-activity.md#monitor-the-pipeline)

Use the SSIS catalog (SSISDB) to check the detail logs for the execution. For details, see [Monitor Running Packages and Other Operations](https://docs.microsoft.com/sql/integration-services/performance/monitor-running-packages-and-other-operations?view=sql-server-2017).

## Common errors, causes, and solutions

### Error message: "Connection Timeout Expired" or "The service has encountered an error processing your request. Please try again."

Here are potential causes and recommended actions:
* The data source or destination is overloaded. Check the load on your data source or destination and see whether it has enough capacity. For example, if you used Azure SQL Database, consider scaling up if the database is likely to time out.
* The network between the SSIS integration runtime and the data source or destination is unstable, especially when the connection is cross-region or between on-premise and Azure. Apply the retry pattern in the SSIS package by following these steps:
  * Make sure your SSIS packages can rerun on failure without side effects (for example, data loss or data duplication).
  * Configure **Retry** and **Retry interval** of **Execute SSIS Package** activity on the **General** tab.
    ![Set properties on the the General tab](media/how-to-invoke-ssis-package-ssis-activity/ssis-activity-general.png)
  * For an ADO.NET and OLE DB source or destination component, set **ConnectRetryCount** and **ConnectRetryInterval** in Connection Manager in the SSIS package or SSIS activity.

### Error message: "ADO NET Source has failed to acquire the connection '...'" with "A network-related or instance-specific error occurred while establishing a connection to SQL Server. The server was not found or was not accessible."

This issue usually means the data source or destination is inaccessible from the SSIS integration runtime. The reasons can vary. Try these actions:
* Make sure you're passing the data source or destination name/IP correctly.
* Make sure the firewall is set properly.
* Make sure your virtual network is configured properly if your data source or destination is on-premises:
  * You can verify whether the issue is from virtual network configuration by provisioning an Azure VM in the same virtual network. Then check whether the data source or destination can be accessed from the Azure VM.
  * You can find more details about using a virtual network with an SSIS integration runtime in [Join an Azure-SSIS integration runtime to a virtual network](join-azure-ssis-integration-runtime-virtual-network.md).

### Error message: "ADO NET Source has failed to acquire the connection '...'" with "Could not create a managed connection manager."

The potential cause is that the ADO.NET provider used in the package isn't installed in the SSIS integration runtime. You can install the provider by using the custom setup. You can find more details about custom setup in [Customize setup for the Azure-SSIS integration runtime](how-to-configure-azure-ssis-ir-custom-setup.md).

### Error message: "The connection '...' is not found"

A known issue in older versions of SQL Server Management Studio (SSMS) can cause this error. If the package contains a custom component (For example, SSIS Azure Feature Pack or partner components) that isn't installed on the machine where SSMS is used to do the deployment, SSMS will remove the component and cause the error. Upgrade [SSMS](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms) to the latest version that has the issue fixed.

### Error message: "There is not enough space on the disk"

This error means the local disk is used up in the SSIS integration runtime node. Check whether your package or custom setup is consuming a lot of disk space:
* If the disk is consumed by your package, it will be freed up after the package execution finishes.
* If the disk is consumed by your custom setup, you'll need to stop the SSIS integration runtime, modify your script, and start the integration runtime again. The whole Azure blob container that you specified for custom setup will be copied to the SSIS integration runtime node, so check whether there's any unnecessary content under that container.

### Error message: "Cannot open file '...'"

This error occurs when package execution can't find a file in the local disk in the SSIS integration runtime. Try these actions:
* Don't use the absolute path in the package that's being executed in the SSIS integration runtime. Use the current execution working directory (.) or the temp folder (%TEMP%) instead.
* If you need to persist some files on SSIS integration runtime nodes, prepare the files as described in [Customize setup](how-to-configure-azure-ssis-ir-custom-setup.md). All the files in the working directory will be cleaned up after the execution is finished.
* Use Azure Files instead of storing the file in SSIS integration runtime node. For details, see [Use azure file shares](https://docs.microsoft.com/sql/integration-services/lift-shift/ssis-azure-files-file-shares?view=sql-server-2017#use-azure-file-shares).

### Error message: "The database 'SSISDB' has reached its size quota"

A potential cause is that the SSISDB created in the Azure SQL database or a managed instance when you're creating an SSIS integration runtime has reached its quota. Try these actions:
* Consider increasing the DTU of your Database to resolve this issue. Details can be found at [https://docs.microsoft.com/azure/sql-database/sql-database-resource-limits-logical-server](https://docs.microsoft.com/azure/sql-database/sql-database-resource-limits-logical-server)
* Check whether your Package would generate many logs. If so, elastic job can be configured to clean up these logs. Refer to [Clean up SSISDB logs with Azure Elastic Database Jobs](how-to-clean-up-ssisdb-logs-with-elastic-jobs.md) for detail.

### Error message: "The request limit for the database is ... and has been reached."

If many packages are executing in parallel in SSIS Integration Runtime, this error may occur because the request limitation of SSISDB is hit. Consider increasing the DTC of your SSISDB to resolve this issue. Details can be found at [https://docs.microsoft.com/azure/sql-database/sql-database-resource-limits-logical-server](https://docs.microsoft.com/azure/sql-database/sql-database-resource-limits-logical-server)

### Error message: "SSIS Operation failed with unexpected operation status: ..."

The error is mostly caused by a transient error, so try to rerun the package execution. It's suggested to apply retry pattern in SSIS Package by following steps:
    * Make sure your SSIS Packages can rerun on failure without side effect(For example, data loss, data dup...)
    * Configure the **Retry** and **Retry interval** of Execute SSIS Package Activity in the General Tab
 ![Set properties on the General tab](media/how-to-invoke-ssis-package-ssis-activity/ssis-activity-general.png)
    * For ADO.NET and OLEDB Source/Destination component, ConnectRetryCount and ConnectRetryInterval can be set in the Connection Manager in SSIS package or SSIS Activity

### Error message: "There is no active worker."

This error usually means the SSIS Integration Runtime is in an unhealthy status. Check Azure portal for the status and detail errors: [https://docs.microsoft.com/azure/data-factory/monitor-integration-runtime#azure-ssis-integration-runtime](https://docs.microsoft.com/azure/data-factory/monitor-integration-runtime#azure-ssis-integration-runtime)

### Error message: "Your integration runtime cannot be upgraded and will eventually stop working, since we cannot access the Azure Blob container you provided for custom setup."

This error occurs when SSIS Integration Runtime can't access the storage configured for Custom Setup. Check whether the SAS Uri you provided is valid and hasn't expired.

### Error message: "Microsoft OLE DB Provider for Analysis Services. 'Hresult: 0x80004005 Description:' COM error: COM error: mscorlib; Exception has been thrown by the target of an invocation"

One potential cause is that username/password with MFA enabled is configured for Azure Analysis Services authentication, which is not supported in SSIS integration runtime yet. Try to use Service Principal for Azure Analysis Service authentication:
1. Prepare service principal for AAS [https://docs.microsoft.com/azure/analysis-services/analysis-services-service-principal](https://docs.microsoft.com/azure/analysis-services/analysis-services-service-principal)
2. In connection manager, configure “Use a specific user name and password”: set "AppID" as user name and "clientSecret" as password

### Error message: "ADONET Source has failed to acquire the connection {GUID} with the following error message: Login failed for user 'NT AUTHORITY\ANONYMOUS LOGON'" when using managed identity

Make sure you don't configure the authentication method of connection manager as "Active Directory Password Authentication" when the parameter "ConnectUsingManagedIdentity" is True. You can configure it as "SQL Authentication" instead which would be ignored if "ConnectUsingManagedIdentity" is set

### Package takes unexpected long time to execute

Here are potential causes and recommended actions:
* Too many package executions have been scheduled on the SSIS Integration Runtime. In this case, all these executions will be waiting in a queue for their turn to execute.
  * Max Parallel Execution Count per IR = Node Count * Max Parallel Execution per Node
  * Refer to [Create Azure-SSIS Integration Runtime in Azure Data Factory](create-azure-ssis-integration-runtime.md) for how to set the Node Count and Max Parallel Execution per Node.
* SSIS Integration Runtime is stopped or in an unhealthy status. Check [Azure-SSIS integration runtime](monitor-integration-runtime.md#azure-ssis-integration-runtime) for how to check the SSIS Integration Runtime status and errors.
* It's suggested to set the timeout if you're sure the package execution should be finished in a certain time:
 ![Set properties on the General tab](media/how-to-invoke-ssis-package-ssis-activity/ssis-activity-general.png)

### Poor performance in package execution

Here are recommended actions:

* Check if the SSIS Integration Runtime is in the same region as the Data Source and Destination.

* Set the Logging Level of package execution to "Performance" to collect more detail duration information for each component in the execution. Details can be found at: [https://docs.microsoft.com/sql/integration-services/performance/integration-services-ssis-logging](https://docs.microsoft.com/sql/integration-services/performance/integration-services-ssis-logging)

* Check IR node performance in IR monitor page in Azure portal.
  * How to monitor SSIS Integration Runtime: [Azure-SSIS integration runtime](monitor-integration-runtime.md#azure-ssis-integration-runtime)
  * The history CPU/Memory usage of SSIS Integration Runtime is available at the Metrics of the Data Factory in Azure portal
![Monitor metrics of SSIS Integration Runtime](media/ssis-integration-runtime-ssis-activity-faq/monitor-metrics-ssis-integration-runtime.png)
