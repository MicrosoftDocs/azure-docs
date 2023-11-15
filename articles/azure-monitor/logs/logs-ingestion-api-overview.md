---
title: Logs Ingestion API in Azure Monitor
description: Send data to a Log Analytics workspace using REST API or client libraries.
ms.topic: conceptual
ms.date: 09/14/2023

---

# Logs Ingestion API in Azure Monitor
The Logs Ingestion API in Azure Monitor lets you send data to a Log Analytics workspace using either a [REST API call](#rest-api-call) or [client libraries](#client-libraries). The API allows you to send data to [supported Azure tables](#supported-tables) or to [custom tables that you create](../logs/create-custom-table.md#create-a-custom-table). You can also [extend the schema of Azure tables with custom columns](../logs/create-custom-table.md#add-or-delete-a-custom-column) to accept additional data.

## Basic operation
Data can be sent to the Logs Ingestion API from any application that can make a REST API call. This may be a custom application that you create, or it may be an application or agent that understands how to send data to the API.
The application sends data to a [data collection endpoint (DCE)](../essentials/data-collection-endpoint-overview.md), which is a unique connection point for your Azure subscription. It specifies a [data collection rule (DCR)](../essentials/data-collection-rule-overview.md) that includes the target table and workspace and the credentials of an app registration with access to the specified DCR. 

The data sent by your application to the API must be formatted in JSON and match the structure expected by the DCR. It doesn't necessarily need to match the structure of the target table because the DCR can include a [transformation](../essentials//data-collection-transformations.md) to convert the data to match the table's structure. You can modify the target table and workspace by modifying the DCR without any change to the API call or source data.

:::image type="content" source="media/data-ingestion-api-overview/data-ingestion-api-overview.png" lightbox="media/data-ingestion-api-overview/data-ingestion-api-overview.png" alt-text="Diagram that shows an overview of logs ingestion API." border="false":::

> [!NOTE]
> See [Configure Logs Ingestion API in Azure Monitor](./logs-ingestion-api-configure.md) for details on configuring these components.

## Supported tables

Data sent to the ingestion API can be sent to the following tables:

| Tables | Description |
|:---|:---|
| Custom tables | Any custom table that you create in your Log Analytics workspace. The target table must exist before you can send data to it. Custom tables must have the `_CL` suffix. |
| Azure tables | The following Azure tables are currently supported. Other tables may be added to this list as support for them is implemented.<br><br>- [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog)<br>- [SecurityEvents](/azure/azure-monitor/reference/tables/securityevent)<br>- [Syslog](/azure/azure-monitor/reference/tables/syslog)<br>- [WindowsEvents](/azure/azure-monitor/reference/tables/windowsevent)

> [!NOTE]
> Column names must start with a letter and can consist of up to 45 alphanumeric characters and underscores (`_`).  `_ResourceId`, `id`, `_ResourceId`, `_SubscriptionId`, `TenantId`, `Type`, `UniqueId`, and `Title` are reserved column names. Custom columns you add to an Azure table must have the suffix `_CF`.

## Required components
Before you can use the Logs Ingestion API, you must configure the following components in Azure. See [Configure Logs Ingestion API in Azure Monitor](logs-ingestion-api-configure.md) for details on configuring these components.

| Component | Function |
|:---|:---|
| App registration and secret | Used to authenticate the API call. The app registration must be granted permission to the DCR. |
| Data collection endpoint (DCE) | Provides an endpoint for the application to send to. |
| Table in Log Analytics workspace | The table in the Log Analytics workspace must exist before you can send data to it. |
| Data collection rule (DCR) | Azure Monitor uses the DCR to understand the structure of the incoming data and what to do with it. |


## Authentication

Authentication for the Logs Ingestion API is performed at the DCE, which uses standard Azure Resource Manager authentication. A common strategy is to use an application ID and application key as described above. The application must have access to the DCR specified by the API call.

When developing a custom client to obtain an access token from Microsoft Entra ID for the purpose of submitting telemetry to Log Ingestion API in Azure Monitor, refer to the table provided below to determine the appropriate audience string for your particular host environment.

| Azure cloud version | Token audience value |
| --- | --- |
| Azure public cloud | `https://monitor.azure.com` |
| Microsoft Azure operated by 21Vianet cloud | `https://monitor.azure.cn` |
| Azure US Government cloud | `https://monitor.azure.us` |


## Client libraries
In addition to making a REST API call, you can use the following client libraries to send data to the Logs ingestion API. The libraries require the same components described in [Configure Logs Ingestion API in Azure Monitor](logs-ingestion-api-configure.md). For examples using each of these libraries, see [Sample code to send data to Azure Monitor using Logs ingestion API](../logs/tutorial-logs-ingestion-code.md).

- [.NET](/dotnet/api/overview/azure/Monitor.Ingestion-readme)
- [Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/monitor/azingest)
- [Java](/java/api/overview/azure/monitor-ingestion-readme)
- [JavaScript](/javascript/api/overview/azure/monitor-ingestion-readme)
- [Python](/python/api/overview/azure/monitor-ingestion-readme)

## REST API call
To send data to Azure Monitor with a REST API call, make a POST call to the DCE over HTTP. Details of this call are described in this section. 

> [!NOTE]
> For configuration that must be performed before you can make the API call, see [Configure Logs Ingestion API in Azure Monitor](logs-ingestion-api-configure.md)
> For sample calls, see [Sample code to send data to Azure Monitor](../logs/tutorial-logs-ingestion-code.md?tabs=powershell).

**Endpoint URI**

The endpoint URI uses the following format, where the `Data Collection Endpoint` and `DCR Immutable ID` identify the DCE and DCR. `Stream Name` refers to the [stream](../essentials/data-collection-rule-structure.md#streamdeclarations) in the DCR that should handle the custom data.

```
{Data Collection Endpoint URI}/dataCollectionRules/{DCR Immutable ID}/streams/{Stream Name}?api-version=2021-11-01-preview
```

For example:

```
https://my-dce-5kyl.eastus-1.ingest.monitor.azure.com/dataCollectionRules/dcr-000a00a000a00000a000000aa000a0aa/streams/Custom-MyTable?api-version=2021-11-01-preview
```

**Headers**
The following table describes that headers for your API call.

| Header | Required? | Value | Description |
|:---|:---|:---|:---|
| Authorization     | Yes | Bearer token obtained through the client credentials flow  | See [Sample code](tutorial-logs-ingestion-code.md?tabs=powershell#sample-code) for sample code to generate the bearer token. |
| Content-Type      | Yes | `application/json` |  |
| Content-Encoding  | No  | `gzip` | Use the gzip compression scheme for performance optimization. |
| x-ms-client-request-id | No | String-formatted GUID |  Request ID that can be used by Microsoft for any troubleshooting purposes.  |

**Body**

The body of the call includes the custom data to be sent to Azure Monitor. The shape of the data must be a JSON object or array with a structure that matches the format expected by the stream in the DCR. Ensure that the request body is properly encoded in UTF-8 to prevent any issues with data transmission.

For example:

```json
{
    "TimeGenerated": "2023-11-14 15:10:02",
    "Column01": "Value01",
    "Column02": "Value02"
}
```

## Limits and restrictions

For limits related to the Logs Ingestion API, see [Azure Monitor service limits](../service-limits.md#logs-ingestion-api).

## Next steps

- [Walk through a tutorial sending data to Azure Monitor Logs with Logs ingestion API on the Azure portal](tutorial-logs-ingestion-portal.md)
- [Walk through a tutorial sending custom logs using Resource Manager templates and REST API](tutorial-logs-ingestion-api.md)
- Get guidance on using the client libraries for the Logs ingestion API for [.NET](/dotnet/api/overview/azure/Monitor.Ingestion-readme), [Java](/java/api/overview/azure/monitor-ingestion-readme), [JavaScript](/javascript/api/overview/azure/monitor-ingestion-readme), or [Python](/python/api/overview/azure/monitor-ingestion-readme).
