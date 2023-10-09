---
title: On-premises SQL Server Integration Services (SSIS) workloads to SSIS in Azure Data Factory (ADF) or Synapse Pipelines migration rules
description: SSIS workloads migration assessment rules.
author: chugugrace
ms.author: chugu
ms.service: data-factory
ms.subservice: integration-services
ms.topic: conceptual
ms.date: 07/20/2023
---

# SSIS migration assessment rules

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

When planning a migration of on-premises SSIS to SSIS in Azure Data Factory (ADF) or Synapse Pipelines, assessment will help identify issues with the source SSIS packages that would prevent a successful migration.

[Data Migration Assistant (DMA) for Integration Services](/sql/dma/dma-assess-ssis) can perform assessment of your project, and below are full list of potential issues, known as DMA rules as well. 

### [1001]Connection with host name may fail      

**Impact**

Connection that contains host name may fail, typically because the Azure virtual network requires the correct configuration to support DNS name resolution.</Impact>

**Recommendation**

You can use below options for SSIS Integration runtime to access these resources:

- [Join Azure-SSIS IR to a virtual network that connects to on-premises sources](./join-azure-ssis-integration-runtime-virtual-network.md)
- Migrate your data to Azure and use Azure resource endpoint.
- Use Managed Identity authentication if moving to Azure resources.
- [Use self-hosted IR to connect on-premises sources](./self-hosted-integration-runtime-proxy-ssis.md).

### [1002]Connection with absolute or UNC path might not be accessible

Impact

Connection that contains absolute or UNC path may fail

Recommendation

You can use below options for SSIS Integration runtime to access these resources:

- [Change to %TEMP%](./ssis-azure-files-file-shares.md)
- [Migrate your files to Azure Files](./ssis-azure-files-file-shares.md)
- [Join Azure-SSIS IR to a virtual network that connects to on-premises sources](./join-azure-ssis-integration-runtime-virtual-network.md).
- [Use self-hosted IR to connect on-premises sources](./self-hosted-integration-runtime-proxy-ssis.md).

### [1003]Connection with Windows authentication may fail

Impact

If a connection string uses Windows authentication, it may fail. Windows authentication requires additional configuration steps in Azure.

Recommendation

There are [four methods to access data stores Windows authentication in Azure SSIS integration runtime](/sql/integration-services/lift-shift/ssis-azure-connect-with-windows-auth):

- Set up an activity-level execution context
- Set up a catalog-level execution context
- Persist credentials via cmdkey command
- Mount drives at package execution time (non-persistent)

### [1004]Connection with non built-in provider or driver may fail

Impact

Azure-SSIS IR only includes built-in providers or drivers by default. Without customization to install the provider or driver, the connection may fail.

Recommendation

[Customize Azure-SSIS integration runtime](./how-to-configure-azure-ssis-ir-custom-setup.md) to install non built-in provider or driver.

### [1005]Analysis Services Connection Manager cannot use an account with MFA enabled

Impact

If you use SSIS in Azure Data Factory (ADF) and want to connect to Azure Analysis Services (AAS) instance, you cannot use an account with Multi-Factor Authentication (MFA) enabled.

Recommendation

Use an account that doesn't require any interactivity/MFA or a service principal instead.

AdditionalInformation

[Configuration of the Analysis Services Connection Manager](/sql/integration-services/connection-manager/analysis-services-connection-manager)

### [1006]Windows environment variable in Connection Manager is discovered

Impact

Connection Manager using Windows environment variable is discovered.

Recommendation

You can use below methods to have Windows environment variables working in SSIS Integration runtime:

- [Customize SSIS integration runtime setup](./how-to-configure-azure-ssis-ir-custom-setup.md) with Windows environment variables.
- [Use Package or Project Parameter](/sql/integration-services/integration-services-ssis-package-and-project-parameters).

### [1007]SQL Server Native Client (SNAC) OLE DB driver is deprecated

Recommendation

[Use latest Microsoft OLE DB Driver](/sql/connect/oledb/oledb-driver-for-sql-server)

### [2001]Component only supported in enterprise edition

Impact

The component is only supported in Azure SSIS integration runtime enterprise edition.

Recommendation

[Configure Azure SSIS integration runtime to enterprise edition](./how-to-configure-azure-ssis-ir-enterprise-edition.md).

### [2002]ORC and Parquet file format aren't by default enabled

Impact

ORC and Parquet file format need JRE, which isn't by default installed in Azure SSIS integration runtime.</Impact>

Recommendation

Install compatible JRE by [customize setup for the Azure-SSIS integration runtime](./how-to-configure-azure-ssis-ir-custom-setup.md).

### [2003]Third party component isn't by default enabled

Impact

Azure SSIS Integration Runtime isn't by default enabled with third party components. Third party component may fail. 

Recommendation

- Contact the third party to get an SSIS Integration runtime compatible version.

- For in-house or open source component, [customize Azure-SSIS integration runtime](./how-to-configure-azure-ssis-ir-custom-setup.md) to install necessary SQL Server 2017 compatible components.

### [2004]Azure Blob source and destination is discovered

Recommendation

Recommend to use [Flexible File source](/sql/integration-services/data-flow/flexible-file-source) or [destination](/sql/integration-services/data-flow/flexible-file-destination), which has more advanced functions than Azure Blob.

### [2005]Non built-in log provider may not be installed by default

Impact

Azure SSIS integration time is provisioned with built-in log providers by default only, customize log provider may fail.

Recommendation

[Customize Azure-SSIS integration runtime](./how-to-configure-azure-ssis-ir-custom-setup.md) to install non built-in provider or driver.

### [3001]Absolute or UNC path is discovered in Execute Process Task

Impact

Azure-SSIS Integration Runtime might not be able to launch your executable(s) with absolute or UNC path.</Impact>

Recommendation

You can use below options for SSIS Integration runtime to launch your executable(s):

- [Migrate your executable(s) to Azure Files](./ssis-azure-files-file-shares.md).
- [Join Azure-SSIS IR to a virtual network](./join-azure-ssis-integration-runtime-virtual-network.md) that connects to on-premises sources.
- If necessary, [customize setup script to install your executable(s)](./how-to-configure-azure-ssis-ir-custom-setup.md) in advance when starting IR.

### [4001]Absolute or UNC configuration path is discovered in package configuration

Impact

Package with absolute or UNC configuration path may fail in Azure SSIS Integration Runtime.

Recommendation

You can use below options for SSIS Integration runtime to access these resources:

- [Migrate your files to Azure Files](./ssis-azure-files-file-shares.md)
- [Join Azure-SSIS IR to a virtual network that connects to on-premises sources](./join-azure-ssis-integration-runtime-virtual-network.md).
- [Use self-hosted IR to connect on-premises sources](./self-hosted-integration-runtime-proxy-ssis.md).

### [4002]Registry entry is discovered in package configuration

Impact

Registry entry in package configuration may fail in Azure SSIS Integration Runtime.

Recommendation

Use other package configuration types. XML configuration file is recommended.

Additional Information

[Package Configurations](/sql/integration-services/packages/legacy-package-deployment-ssis)

### [4003]Package encrypted with user key isn't supported

Impact

Package encrypted with user key isn't supported in Azure SSIS Integration Runtime.

Recommendation

You can use below options:

- Change the package protection level to "Encrypt All With Password" or "Encrypt Sensitive With Password".
- Keep or change the package protection level to "Encrypt Sensitive With User Key", override connection manager property during package execution

Additional Information

[Access Control for Sensitive Data in Packages](/sql/integration-services/security/access-control-for-sensitive-data-in-packages)