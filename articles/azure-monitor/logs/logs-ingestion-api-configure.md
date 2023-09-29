---
title: Logs Ingestion API in Azure Monitor
description: Send data to a Log Analytics workspace using REST API or client libraries.
ms.topic: conceptual
ms.date: 09/14/2023

---

# Configure Logs Ingestion API in Azure Monitor
The [Logs Ingestion API](./logs-ingestion-api-overview.md) in Azure Monitor lets you send data to a Log Analytics workspace from a custom application. This article describes the steps you must take to configure the API to receive data.

## Components

The Logs Ingestion API requires the following components to be created before you can send data. Each of these components must all be located in the same region.

| Component | Description |
|:---|:---|
| App registration | The application registration is used to authenticate the API call. It must be granted permission to the DCR. The API call includes the **Application (client) ID**  and **Directory (tenant) ID** of the application and the **Value** of an application secret.<br><br>See [Register an application with Azure AD and create a service principal](../../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal) and [Create a new application secret](../../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-application-secret). |
| Data collection endpoint (DCE) | The DCE provides an endpoint for the application to send to. A single DCE can support multiple DCRs, so you can use an existing DCE if you already have one in the required region.<br><br>See [Create a data collection endpoint](../essentials/data-collection-endpoint-overview.md#create-a-data-collection-endpoint).  |
| Log Analytics workspace table | The table in the Log Analytics workspace must exist before you can send data to it. You can use one of the [supported Azure tables](#supported-tables) or create a custom table using any of the available methods. If you use the Azure portal to create the table, then the DCR is created for you, including a transformation if it's required. With any other method, you need to create the DCR separately.<br><br>See [Create a custom table](create-custom-table.md#create-a-custom-table).  |
| Data collection rule (DCR) | [Data collection rules](../essentials/data-collection-rule-overview.md) define data collected by Azure Monitor and specify how and where that data should be sent or stored. The DCR must understand the structure of the input data and the structure of the target table. If the two don't match, it can include a [transformation](../essentials/data-collection-transformations.md) to convert the source data to match the target table. You can also use the transformation to filter source data and perform any other calculations or conversions.<br><br>There are two methods to create the DCR. You can manually create it if you understand the structure.  |
| Log Analytics workspace | The Log Analytics workspace contains the tables that will receive the data. The target tables are specific in the DCR. See [Support tables](#supported-tables) for the tables that the ingestion API can send to. |





## Authentication

Authentication for the Logs Ingestion API is performed at the DCE, which uses standard Azure Resource Manager authentication. A common strategy is to use an application ID and application key as described above.

When developing a custom client to obtain an access token from Azure AD for the purpose of submitting telemetry to Log Ingestion API in Azure Monitor, refer to the table provided below to determine the appropriate audience string for your particular host environment.

| Azure cloud version | Token audience value |
| --- | --- |
| Azure public cloud | `https://monitor.azure.com` |
| Microsoft Azure operated by 21Vianet cloud | `https://monitor.azure.cn` |
| Azure US Government cloud | `https://monitor.azure.us` |


## Client libraries
In addition to making a REST API call, you can use the following client libraries to send data to the Logs ingestion API. The libraries require the same components described in [Configuration](#configuration). For examples using each of these libraries, see [Sample code to send data to Azure Monitor using Logs ingestion API](../logs/tutorial-logs-ingestion-code.md).

- [.NET](/dotnet/api/overview/azure/Monitor.Ingestion-readme)
- [Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/monitor/azingest)
- [Java](/java/api/overview/azure/monitor-ingestion-readme)
- [JavaScript](/javascript/api/overview/azure/monitor-ingestion-readme)
- [Python](/python/api/overview/azure/monitor-ingestion-readme)

## REST API call
To send data to Azure Monitor with a REST API call, make a POST call to the DCE over HTTP. Details of the call are described in the following sections. For a sample, see [Sample code to send data to Azure Monitor](../logs/tutorial-logs-ingestion-code.md?tabs=powershell)

**Endpoint URI**
The endpoint URI uses the following format, where the `Data Collection Endpoint` and `DCR Immutable ID` identify the DCE and DCR. `Stream Name` refers to the [stream](../essentials/data-collection-rule-structure.md#custom-logs) in the DCR that should handle the custom data.

```
{Data Collection Endpoint URI}/dataCollectionRules/{DCR Immutable ID}/streams/{Stream Name}?api-version=2021-11-01-preview
```

> [!NOTE]
> You can retrieve the immutable ID from the JSON view of the DCR. For more information, see [Collect information from the DCR](tutorial-logs-ingestion-portal.md#collect-information-from-the-dcr).

Headers

| Header | Required? | Value | Description |
|:---|:---|:---|:---|
| Authorization     | Yes | Bearer (bearer token obtained through the client credentials flow)  | |
| Content-Type      | Yes | `application/json` | |
| Content-Encoding  | No  | `gzip` | Use the gzip compression scheme for performance optimization. |
| x-ms-client-request-id | No | String-formatted GUID |  Request ID that can be used by Microsoft for any troubleshooting purposes.  |

**Body**

The body of the call includes the custom data to be sent to Azure Monitor. The shape of the data must be a JSON object or array with a structure that matches the format expected by the stream in the DCR. Additionally, it is important to ensure that the request body is properly encoded in UTF-8 to prevent any issues with data transmission.



## Limits and restrictions

For limits related to the Logs Ingestion API, see [Azure Monitor service limits](../service-limits.md#logs-ingestion-api).

## Next steps

- [Walk through a tutorial sending data to Azure Monitor Logs with Logs ingestion API on the Azure portal](tutorial-logs-ingestion-portal.md)
- [Walk through a tutorial sending custom logs using Resource Manager templates and REST API](tutorial-logs-ingestion-api.md)
- Get guidance on using the client libraries for the Logs ingestion API for [.NET](/dotnet/api/overview/azure/Monitor.Ingestion-readme), [Java](/java/api/overview/azure/monitor-ingestion-readme), [JavaScript](/javascript/api/overview/azure/monitor-ingestion-readme), or [Python](/python/api/overview/azure/monitor-ingestion-readme).
