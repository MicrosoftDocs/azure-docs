---
title: Use PowerShell cmdlets to scan on-premises data sources (preview)
description: Learn how to use PowerShell cmdlets to register and scan on-premises data sources.
author: aaronyan87
ms.author: royan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 10/12/2020

# Customer intent As a data steward, I want to perform scans so that I can classify my data.
---
# Use PowerShell cmdlets to scan on-premises data sources (preview)

In this tutorial you use PowerShell to scan on-premises SQL server data sources.

## Introduction

With Azure Purview you can use the catalog UI or PowerShell cmdlets to scan and classify, at regular intervals, on-premises data. This article shows how to connect to a catalog session to manage data sources, scans, triggers, and classification rules.

To run scans on on-premise data sources, do the following:

1. Create the self-hosted integration runtime (SHIR).
1. List the authentication keys.
1. Install Azure Data Factory Integrated Runtime.
1. Configure the firewall.
1. Create a data source.
1. Create a scan of the data source.
1. Run the scan.

The steps are described in the following sections of this article.

You can associate a trigger with a scan. For more information see [Tutorial: Use the portal to scan Azure data sources](portal-scan-azure-data-sources.md#set-a-scan-trigger-and-work-with-scans)

Depending on the data source type, there are  different sets of supported authentication mechanisms for the scan. See the authentication section of [Catalog client overview](catalog-client-overview.md) to get a list of authentication types supported by managed scanning using PowerShell.

> [!Note]
> The user running the PowerShell cmdlets should be the catalog or
data source admin in the Purview data plane.

## Create the self-hosted integration runtime (SHIR)

To create a self-hosted integration runtime (SHIR), run the following command after authenticating to your Purview account.

```PowerShell
New-AzDataCatalogScanIntegrationRuntime -IntegrationRuntimeName <SHIR_name>
```

To delete a SHIR associated with your Purview account, run the following command.

```PowerShell
Remove-AzDataCatalogScanIntegrationRuntime -IntegrationRuntimeName <SHIR_name>
```

## List the authentication keys

To list the authentication keys of the SHIR, run the following command

```PowerShell
Get-AzDataCatalogScanIntegrationRuntimeAuthKeys -IntegrationRuntimeName <SHIR_name>
 
AuthKey1: IR\@f8a5\... XKA=
AuthKey2: IR\@f8a5\... jD4=
```

Retain these keys. You will need to provide them to the Azure Data Factory Integrated Runtime, as described in the next section.

## Install Azure Data Factory Integrated Runtime

Download and install [Azure Data Factory Integration Runtime](https://www.microsoft.com/download/details.aspx?id=39717) on the self-hosted machines. Paste the authentication keys—obtained in step 2.— into Azure Data Factory Integration Runtime. Integration Runtime should be running before you create or run any data scan.

:::image type="content" source="media/scan-on-premises-data-sources-PowerShell/SHIR1.png" alt-text="Illustrate how to set SHIR authentication key." border="true":::

## Configure the firewall

Configure the firewall of the on-premises server to allow the self-hosted machines to access the SQL Server database.

## Create a data source

Create the data source:

```PowerShell
Set-AzDataCatalogDataSource -AccountType SqlServerDatabase
-ServerEndpoint <sql_server_endpoint> -Name <datasource_name>
```

## Create a scan of the data source

Create a scan with the SHIR created in step 2.1.

```PowerShell
Set-AzDataCatalogScan -AuthorizationType ConnectionString -UserName<db_username> -Password <db_password> `
                      -DatabaseName <dbName> -ServerEndpoint <sql_server_endpoint> `
                      -DataSourceName <datasource_name> -Name <scan_name> -SelfHostedIRName <SHIR_name>
```

## Run the scan

```PowerShell
Start-AzDataCatalogScan -DataSourceName <datasource_name> -Name <scan_name>
```

## Next steps

To learn how to create sets of scan rules that can easily be added to any scan, see:  

- [Create a scan rule set](create-a-scan-rule-set.md)
 
For information on scanning Azure Synapse Analytics, see:

- [Register and scan Azure Synapse Analytics](register-scan-azure-synapse-analytics.md)
