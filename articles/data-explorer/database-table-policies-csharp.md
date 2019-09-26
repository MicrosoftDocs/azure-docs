---
title: 'Create policies using the Azure Data Explorer .NET Standard SDK (Preview)'
description: In this article, you learn how to create policies using .NET Standard SDK.
author: lugoldbe
ms.author: lugoldbe
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 09/24/2019
---

# Create database/table policies for Azure Data Explorer by using .NET Standard SDK (Preview)

> [!div class="op_single_selector"]
> * [C#](database-table-policies-csharp.md)
> * [Python](database-table-policies-python.md)
>

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. In this article, you create database/table policies for Azure Data Explorer using C#.

## Prerequisites

* If you don't have Visual Studio 2019 installed, you can download and use the **free** [Visual Studio 2019 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

* [A test cluster and database](create-cluster-database-csharp.md)

* [A test table](net-standard-ingest-data.md)

## Install C# Nuget

```
1. Install the [Microsoft.Azure.Kusto.Data.NETStandard nuget package](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Data.NETStandard/).
```
## Authentication
For running the examples in this article, we need an Azure AD Application and service principal that can access resources. Check [create an Azure AD application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal) to create a free Azure AD Application. To add database-level permissions, check [Manage Azure Data Explorer database permissions](https://docs.microsoft.com/bs-latn-ba/azure/data-explorer/manage-database-permissions). This article ues `tenantId`, `clientId`, and `clientSecret` for authentication in the examples, check [this](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal) to learn about how to get them.

## Construct the connection string
Now construct the connection string, which will be used in the later sections. This example uses an AAD Application key for authentication to access the cluster. You can also use AAD application certificate and AAD user, check this [Kusto connection strings](https://docs.microsoft.com/en-us/azure/kusto/api/connection-strings/kusto) for more examples. Set the your values for `kustoUri`, `databaseName`, `tenantId`, `clientId`, and `clientSecret` before running this code.

```csharp
var kustoUri = "https://<ClusterName>.<Region>.kusto.windows.net:443/";
var databaseName = "<DatabaseName>";
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
var clientSecret = "xxxxxxxxxxxxxx";

var kustoConnectionStringBuilder =
    new KustoConnectionStringBuilder(kustoUri)
    {
        FederatedSecurity = true,
        InitialCatalog = databaseName,
        ApplicationClientId = clientId,
        ApplicationKey = clientSecret,
        Authority = tenantId
    };
```

## Alter database's retention policy
Sets a retention policy with a 10 day soft-delete period and disabled data recoverability.

```csharp
using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder))
{
    var command =
        CslCommandGenerator.GenerateDatabaseAlterRetentionPolicyCommand(databaseName:databaseName, new DataRetentionPolicy(TimeSpan.FromDays(10), DataRecoverability.Disabled));

    kustoClient.ExecuteControlCommand(command);
}
```

## Alter a databse's cache policy
Sets a cache policy for the database that the last 5 days of data and indexes will be on the cluster SSD.

```csharp
using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder))
{
    var databaseName = "<DatabaseName>";
    var command = CslCommandGenerator.GenerateDatabaseAlterCachingPolicyCommand(databaseName: databaseName,
        dataHotSpan: TimeSpan.FromDays(10), indexHotSpan: TimeSpan.FromDays(10));
    kustoClient.ExecuteControlCommand(command);
}
```

## Alter a table's cache policy
Sets a cache policy for the table that the last 5 days of data and indexes will be on the cluster SSD.

```csharp
var tableName = "<TableName>"
using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder))
{
    var command1 = CslCommandGenerator.GenerateAlterTableCachingPolicyCommand(tableName: tableName,
                    dataHotSpan: TimeSpan.FromDays(5), indexHotSpan: TimeSpan.FromDays(5));

    kustoClient.ExecuteControlCommand(command);
}
```

## Add a new principal for database
Add a new application client id as admin principal for the database

```csharp
var newApplicationClientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
var newTenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder))
{
    var command =
        CslCommandGenerator.GenerateAddDatabaseAuthorizedPrincipalsCommand(
            CslCommandGenerator.AuthorizationRole.Admin, DatabaseName,
            new List<string>() {$"aadapp={newApplicationClientId};{newTenantId}"});

    kustoClient.ExecuteControlCommand(command);
}
```
