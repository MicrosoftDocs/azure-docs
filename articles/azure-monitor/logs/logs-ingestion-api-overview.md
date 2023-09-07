---
title: Logs Ingestion API in Azure Monitor
description: Send data to a Log Analytics workspace using REST API or client libraries.
ms.topic: conceptual
ms.date: 06/27/2022

---

# Logs Ingestion API in Azure Monitor
The Logs Ingestion API in Azure Monitor lets you send data to a Log Analytics workspace using either a [REST API call](#rest-api-call) or [client libraries](#client-libraries). By using this API, you can send data to [supported Azure tables](#supported-tables) or to [custom tables that you create](../logs/create-custom-table.md#create-a-custom-table). You can even [extend the schema of Azure tables with custom columns](../logs/create-custom-table.md#add-or-delete-a-custom-column) to accept additional data.


## Basic operation

Your application sends data to a [data collection endpoint (DCE)](../essentials/data-collection-endpoint-overview.md), which is a unique connection point for your subscription. The payload of your API call includes the source data formatted in JSON. The call:

- Specifies a [data collection rule (DCR)](../essentials/data-collection-rule-overview.md) that understands the format of the source data.
- Potentially filters and transforms the data for the target table.
- Directs the data to a specific table in a specific workspace.

You can modify the target table and workspace by modifying the DCR without any change to the API call or source data.

:::image type="content" source="media/data-ingestion-api-overview/data-ingestion-api-overview.png" lightbox="media/data-ingestion-api-overview/data-ingestion-api-overview.png" alt-text="Diagram that shows an overview of logs ingestion API.":::

> [!NOTE]
> To migrate solutions from the [Data Collector API](data-collector-api.md), see [Migrate from Data Collector API and custom fields-enabled tables to DCR-based custom logs](custom-logs-migrate.md).

## Components

The Log ingestion API requires the following components to be created before you can send data. Each of these components must all be located in the same region.

| Component | Description |
|:---|:---|
| Data collection endpoint (DCE) | The DCE provides an endpoint for the application to send to. A single DCE can support multiple DCRs.  |
| Data collection rule (DCR) | [Data collection rules](../essentials/data-collection-rule-overview.md) define data collected by Azure Monitor and specify how and where that data should be sent or stored. The API call must specify a DCR to use. The DCR must understand the structure of the input data and the structure of the target table. If the two don't match, it can include a [transformation](../essentials/data-collection-transformations.md) to convert the source data to match the target table. You can also use the transformation to filter source data and perform any other calculations or conversions.
| Log Analytics workspace | The Log Analytics workspace contains the tables that will receive the data. The target tables are specific in the DCR. See [Support tables](#supported-tables) for the tables that the ingestion API can send to. |

## Supported tables
The following tables can receive data from the ingestion API.

| Tables | Description |
|:---|:---|
| Custom tables | The Logs Ingestion API can send data to any custom table that you create in your Log Analytics workspace. The target table must exist before you can send data to it. Custom tables must have the `_CL` suffix. |
| Azure tables | The Logs Ingestion API can send data to the following Azure tables. Other tables may be added to this list as support for them is implemented.<br><br>- [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog)<br>- [SecurityEvents](/azure/azure-monitor/reference/tables/securityevent)<br>- [Syslog](/azure/azure-monitor/reference/tables/syslog)<br>- [WindowsEvents](/azure/azure-monitor/reference/tables/windowsevent)

> [!NOTE]
> Column names must start with a letter and can consist of up to 45 alphanumeric characters and underscores (`_`). The following are reserved column names: `Type`, `TenantId`, `resource`, `resourceid`, `resourcename`, `resourcetype`, `subscriptionid`, `tenanted`. Custom columns you add to an Azure table must have the suffix `_CF`.

## Authentication

Authentication for the Logs Ingestion API is performed at the DCE, which uses standard Azure Resource Manager authentication. A common strategy is to use an application ID and application key as described in [Tutorial: Add ingestion-time transformation to Azure Monitor Logs](tutorial-logs-ingestion-portal.md).

### Token audience

When developing a custom client to obtain an access token from Azure AD for the purpose of submitting telemetry to Log Ingestion API in Azure Monitor, refer to the table provided below to determine the appropriate audience string for your particular host environment.

| Azure cloud version | Token audience value |
| --- | --- |
| Azure public cloud | `https://monitor.azure.com` |
| Microsoft Azure operated by 21Vianet cloud | `https://monitor.azure.cn` |
| Azure US Government cloud | `https://monitor.azure.us` |

## Source data

The source data sent by your application is formatted in JSON and must match the structure expected by the DCR. It doesn't necessarily need to match the structure of the target table because the DCR can include a [transformation](../essentials//data-collection-transformations.md) to convert the data to match the table's structure.

## Client libraries
You can use the following client libraries to send data to the Logs ingestion API.

- [.NET](/dotnet/api/overview/azure/Monitor.Ingestion-readme)
- [Java](/java/api/overview/azure/monitor-ingestion-readme)
- [JavaScript](/javascript/api/overview/azure/monitor-ingestion-readme)
- [Python](/python/api/overview/azure/monitor-ingestion-readme)


## REST API call
To send data to Azure Monitor with a REST API call, make a POST call to the DCE over HTTP. Details of the call are described in the following sections.

### Endpoint URI
The endpoint URI uses the following format, where the `Data Collection Endpoint` and `DCR Immutable ID` identify the DCE and DCR. `Stream Name` refers to the [stream](../essentials/data-collection-rule-structure.md#custom-logs) in the DCR that should handle the custom data.

```
{Data Collection Endpoint URI}/dataCollectionRules/{DCR Immutable ID}/streams/{Stream Name}?api-version=2021-11-01-preview
```

> [!NOTE]
> You can retrieve the immutable ID from the JSON view of the DCR. For more information, see [Collect information from the DCR](tutorial-logs-ingestion-portal.md#collect-information-from-the-dcr).

### Headers

| Header | Required? | Value | Description |
|:---|:---|:---|:---|
| Authorization     | Yes | Bearer (bearer token obtained through the client credentials flow)  | |
| Content-Type      | Yes | `application/json` | |
| Content-Encoding  | No  | `gzip` | Use the gzip compression scheme for performance optimization. |
| x-ms-client-request-id | No | String-formatted GUID |  Request ID that can be used by Microsoft for any troubleshooting purposes.  |

### Body

The body of the call includes the custom data to be sent to Azure Monitor. The shape of the data must be a JSON object or array with a structure that matches the format expected by the stream in the DCR. Additionally, it is important to ensure that the request body is properly encoded in UTF-8 to prevent any issues with data transmission.



## Limits and restrictions

For limits related to the Logs Ingestion API, see [Azure Monitor service limits](../service-limits.md#logs-ingestion-api).

## Next steps

- [Walk through a tutorial configuring the i using the Azure portal](tutorial-logs-ingestion-portal.md)
- [Walk through a tutorial sending custom logs using Resource Manager templates and REST API](tutorial-logs-ingestion-api.md)
- Get guidance on using the client libraries for the Logs ingestion API for [.NET](/dotnet/api/overview/azure/Monitor.Ingestion-readme), [Java](/java/api/overview/azure/monitor-ingestion-readme), [JavaScript](/javascript/api/overview/azure/monitor-ingestion-readme), or [Python](/python/api/overview/azure/monitor-ingestion-readme).
