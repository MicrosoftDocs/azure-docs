---
title: Apache Spark version support
description: Supported versions of Spark, Scala, Python
author: ekote
ms.author: eskot
ms.reviewer: maghan, whhender, whhender
ms.date: 03/08/2024
ms.service: azure-synapse-analytics
ms.subservice: spark
ms.topic: reference
ms.custom: devx-track-python
---
# Azure Synapse runtimes

Apache Spark pools in Azure Synapse use runtimes to tie together essential component versions such as Azure Synapse optimizations, packages, and connectors with a specific Apache Spark version. Each runtime is upgraded periodically to include new improvements, features, and patches. When you create a serverless Apache Spark pool, select the corresponding Apache Spark version. Based on this, the pool comes preinstalled with the associated runtime components and packages.

The runtimes have the following advantages:
- Faster session startup times
- Tested compatibility with specific Apache Spark versions
- Access to popular, compatible connectors and open-source packages

## Supported Azure Synapse runtime releases

> [!TIP]
> We strongly recommend proactively upgrading workloads to a more recent GA version of the runtime which is [Azure Synapse Runtime for Apache Spark 3.4 (GA)](./apache-spark-34-runtime.md)). Refer to the [Apache Spark migration guide](https://spark.apache.org/docs/latest/sql-migration-guide.html).

The following table lists the runtime name, Apache Spark version, and release date for supported Azure Synapse Runtime releases.

| Runtime name | Release date | Release stage                | End of Support announcement date | End of Support effective date |
| --- | --- |------------------------------| --- | --- |
| [Azure Synapse Runtime for Apache Spark 3.4](./apache-spark-34-runtime.md) | Nov 21, 2023 | GA (as of Apr 8, 2024)       | Q2 2025| Q1 2026|
| [Azure Synapse Runtime for Apache Spark 3.3](./apache-spark-33-runtime.md) | Nov 17, 2022 |**end of support announced**|July 12th, 2024| 3/31/2025 |
| [Azure Synapse Runtime for Apache Spark 3.2](./apache-spark-32-runtime.md) | July 8, 2022 | __deprecated and soon disabled__ | July 8, 2023 | __July 8, 2024__ |
| [Azure Synapse Runtime for Apache Spark 3.1](./apache-spark-3-runtime.md) | May 26, 2021 | __deprecated and soon disabled__         | January 26, 2023 | __January 26, 2024__ |
| [Azure Synapse Runtime for Apache Spark 2.4](./apache-spark-24-runtime.md) | December 15, 2020 | __deprecated and soon disabled__           | July 29, 2022 | __September 29, 2023__ |

## Runtime release stages

For the complete runtime for Apache Spark lifecycle and support policies, refer to [Synapse runtime for Apache Spark lifecycle and supportability](./runtime-for-apache-spark-lifecycle-and-supportability.md).

## Runtime patching

Azure Synapse runtimes for Apache Spark patches are rolled out monthly containing bug, feature, and security fixes to the Apache Spark core engine, language environments, connectors, and libraries.
> [!NOTE]  
> - Maintenance updates will be automatically applied to new sessions for a given serverless Apache Spark pool.  
> - You should test and validate that your applications run properly when using new runtime versions.

> [!IMPORTANT]  
> __Log4j 1.2.x security patches__
>  
> Open-source Log4j library version 1.2.x has several known CVEs (Common Vulnerabilities and Exposures), as described [here](https://logging.apache.org/log4j/1.2/index.html).
>  
> On all Synapse Spark Pool runtimes, we have patched the Log4j 1.2.17 JARs to mitigate the following CVEs: CVE-2019-1751, CVE-2020-9488, CVE-2021-4104, CVE-2022-23302, CVE-2022-2330, CVE-2022-23307
>  
> The applied patch works by removing the following files which are required to invoke the vulnerabilities:
> * ```org/apache/log4j/net/SocketServer.class```
> * ```org/apache/log4j/net/SMTPAppender.class```
> * ```org/apache/log4j/net/JMSAppender.class```
> * ```org/apache/log4j/net/JMSSink.class```
> * ```org/apache/log4j/jdbc/JDBCAppender.class```
> * ```org/apache/log4j/chainsaw/*```
>  
> While the above classes were not used in the default Log4j configurations in Synapse, it is possible that some user application could still depend on it. If your application needs to use these classes, use Library Management to add a secure version of Log4j to the Spark Pool. __Do not use Log4j version 1.2.17__, as it would be reintroducing the vulnerabilities.

The patch policy differs based on the [runtime lifecycle stage](./runtime-for-apache-spark-lifecycle-and-supportability.md):

- Generally Available (GA) runtime: Receive no upgrades on major versions (that is, 3.x -> 4.x). And will upgrade a minor version (that is, 3.x -> 3.y) as long as there are no deprecation or regression impacts.

- Preview runtime: No major version upgrades unless strictly necessary. Minor versions (3.x -> 3.y) will be upgraded to add latest features to a runtime.

- Long Term Support (LTS) runtime is patched with security fixes only.

- End of Support announced runtime won't have bug and feature fixes. Security fixes are backported based on risk assessment.


## Migration between Apache Spark versions - support

This guide provides a structured approach for users looking to upgrade their Azure Synapse Runtime for Apache Spark workloads from versions 2.4, 3.1, 3.2, or 3.3 to [the latest GA version, such as 3.4](./apache-spark-34-runtime.md). Upgrading to the most recent version enables users to benefit from performance enhancements, new features, and improved security measures. It is important to note that transitioning to a higher version may require adjustments to your existing Spark code due to incompatibilities or deprecated features.

### Step 1: Evaluate and plan
- **Assess Compatibility:** Start with reviewing Apache Spark migration guides to identify any potential incompatibilities, deprecated features, and new APIs between your current Spark version (2.4, 3.1, 3.2, or 3.3) and the target version (e.g., 3.4).
- **Analyze Codebase:** Carefully examine your Spark code to identify the use of deprecated or modified APIs. Pay particular attention to SQL queries and User Defined Functions (UDFs), which may be affected by the upgrade.

### Step 2: Create a new Spark pool for testing
- **Create a New Pool:** In Azure Synapse, go to the Spark pools section and set up a new Spark pool. Select the target Spark version (e.g., 3.4) and configure it according to your performance requirements.
- **Configure Spark Pool Configuration:** Ensure that all libraries and dependencies in your new Spark pool are updated or replaced to be compatible with Spark 3.4.

### Step 3: Migrate and test your code
- **Migrate Code:** Update your code to be compliant with the new or revised APIs in Apache Spark 3.4. This involves addressing deprecated functions and adopting new features as detailed in the official Apache Spark documentation.
- **Test in Development Environment:** Test your updated code within a development environment in Azure Synapse, not locally. This step is essential for identifying and fixing any issues before moving to production.
- **Deploy and Monitor:** After thorough testing and validation in the development environment, deploy your application to the new Spark 3.4 pool. It is critical to monitor the application for any unexpected behaviors.  Utilize the monitoring tools available in Azure Synapse to keep track of your Spark applications' performance.

**Question:** What steps should be taken in migrating from 2.4 to 3.X?

**Answer:** Refer to the [Apache Spark migration guide](https://spark.apache.org/docs/latest/sql-migration-guide.html).

**Question:** I got an error when I tried to upgrade Spark pool runtime using PowerShell cmdlet when they have attached libraries.

**Answer:**  Don't use PowerShell cmdlet if you have custom libraries installed in your Synapse workspace. Instead follow these steps:
1. Recreate Spark Pool 3.3 from the ground up.
1. Downgrade the current Spark Pool 3.3 to 3.1, remove any packages attached, and then upgrade again to 3.3.

**Question:** Why can't I upgrade to 3.4 without recreating a new Spark pool?

**Answer:** This is not allowed from UX, customer can use Azure PowerShell to update Spark version. Please use "ForceApplySetting", so that any existing clusters (with old version) are decommissioned. 

**Sample query:**

```azurepowershell
$_target_work_space = @("workspace1", "workspace2")

Get-AzSynapseWorkspace |
    ForEach-Object {
        if ($_target_work_space -contains $_.Name) {
            $_workspace_name = $_.Name
            Write-Host "Updating workspace: $($_workspace_name)"
            Get-AzSynapseSparkPool -WorkspaceName $_workspace_name |
            ForEach-Object {
                Write-Host "Updating Spark pool: $($_.Name)"
                Write-Host "Current Spark version: $($_.SparkVersion)"
        
                Update-AzSynapseSparkPool -WorkspaceName $_workspace_name -Name $_.Name -SparkVersion 3.4 -ForceApplySetting
              }
        }
    }
```

## Related content

- [Manage libraries for Apache Spark in Azure Synapse Analytics](apache-spark-azure-portal-add-libraries.md)
- [Synapse runtime for Apache Spark lifecycle and supportability](runtime-for-apache-spark-lifecycle-and-supportability.md)
