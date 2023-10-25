---
title: Logs Ingestion API in Azure Monitor
description: Send data to a Log Analytics workspace using REST API or client libraries.
ms.topic: conceptual
ms.date: 09/14/2023

---

# Configure Logs Ingestion API in Azure Monitor
The [Logs Ingestion API](./logs-ingestion-api-overview.md) in Azure Monitor lets you send data to a Log Analytics workspace from a custom application. This article describes the steps you must take to configure the API to receive data.

## 1. Create an app registration
The application registration is used to authenticate the API call. It must be granted permission to the DCR. The API call includes the **Application (client) ID**  and **Directory (tenant) ID** of the application and the **Value** of an application secret.

See [Register an application with Azure AD and create a service principal](../../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal) and [Create a new application secret](../../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-application-secret).

## 2. Create a Data collection endpoint (DCE)

The DCE provides an endpoint for the application to send to. A single DCE can support multiple DCRs, so you can use an existing DCE if you already have one in the required region.

See [Create a data collection endpoint](../essentials/data-collection-endpoint-overview.md#create-a-data-collection-endpoint).

## 3. Create table in Log Analytics workspace
The table in the Log Analytics workspace must exist before you can send data to it. You can use one of the [supported Azure tables](#supported-tables) or create a custom table using any of the available methods. If you use the Azure portal to create the table, then the DCR is created for you, including a transformation if it's required. With any other method, you need to create the DCR separately.

See [Create a custom table](create-custom-table.md#create-a-custom-table). 

## 4. Create Data collection rule (DCR)

[Data collection rules](../essentials/data-collection-rule-overview.md) define data collected by Azure Monitor and specify how and where that data should be sent or stored. The DCR must understand the structure of the input data and the structure of the target table. If the two don't match, it can include a [transformation](../essentials/data-collection-transformations.md) to convert the source data to match the target table. You can also use the transformation to filter source data and perform any other calculations or conversions.

There are two methods to create a DCR for use with the Logs Ingestion API. You can manually create it if you understand the structure of the data and the target table. Or you can use the Azure portal to create the target table and the DCR based on sample data .


### Azure portal
This method can only be used with a new custom table. The table and DCR are created based on sample data that you provide. If you're sending data to a built-in table or existing custom table, then you must create the DCR manually.

Follow the guidance at [Create a custom table](create-custom-table.md?tabs=azure-portal-1%2Cazure-portal-2%2Cazure-portal-3#create-a-custom-table).


### Manually create DCR
To manually create the DCR, start with the [Sample DCR for Logs Ingestion API](../essentials/data-collection-rule-samples.md#logs-ingestion-api). Modify the following parameters in the template.

| Parameter | Description |
|:---|:---|
| `dataCollectionEndpointId` | Resource ID of your DCE. |
| `StreamDeclarations` | Change the column list to the columns in your incoming data. You don't need to change the name of the stream since this just needs to match the `streams` name in `dataFlows`. |
| `workspaceResourceId` | Resource ID of your Log Analytics workspace. You don't need to change the name since this just needs to match the `destinations` name in `dataFlows`.  |
| transformKql | KQL query to be applied to the incoming data. If the schema of the incoming data matches the schema of the table, then you can use `source` for the transformation. Otherwise, use a query that will transform the data to match the table schema. |
| `outputStream` | Name of the table to send the data. for a custom table, use *Custom-<table-name>*. For a built-in table, use *Microsoft-<table-name>*.


## 5. Grant access to the DCR
The application that you created in the first step needs access to the DCR that you created. From the **Monitor** menu in the Azure portal, select **Data Collection rules** and then the DCR that you created. Select **Access Control (IAM)** for the DCR and then select **Add role assignment** to add  the **Monitoring Metrics Publisher** role.


## Components

The Logs Ingestion API requires the following components to be created before you can send data. Each of these components must all be located in the same region.

| Component | Description |
|:---|:---|
| App registration | The application registration is used to authenticate the API call. It must be granted permission to the DCR. The API call includes the **Application (client) ID**  and **Directory (tenant) ID** of the application and the **Value** of an application secret.<br><br>See [Register an application with Azure AD and create a service principal](../../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal) and [Create a new application secret](../../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-application-secret). |
| Data collection endpoint (DCE) | The DCE provides an endpoint for the application to send to. A single DCE can support multiple DCRs, so you can use an existing DCE if you already have one in the required region.<br><br>See [Create a data collection endpoint](../essentials/data-collection-endpoint-overview.md#create-a-data-collection-endpoint).  |
| Log Analytics workspace table | The table in the Log Analytics workspace must exist before you can send data to it. You can use one of the [supported Azure tables](#supported-tables) or create a custom table using any of the available methods. If you use the Azure portal to create the table, then the DCR is created for you, including a transformation if it's required. With any other method, you need to create the DCR separately.<br><br>See [Create a custom table](create-custom-table.md#create-a-custom-table).  |
| Data collection rule (DCR) | [Data collection rules](../essentials/data-collection-rule-overview.md) define data collected by Azure Monitor and specify how and where that data should be sent or stored. The DCR must understand the structure of the input data and the structure of the target table. If the two don't match, it can include a [transformation](../essentials/data-collection-transformations.md) to convert the source data to match the target table. You can also use the transformation to filter source data and perform any other calculations or conversions.<br><br>There are two methods to create the DCR. You can manually create it if you understand the structure.  |



## Data collection rule for the Logs Ingestion API
There are two methods to create a DCR for use with the Logs Ingestion API. You can manually create it if you understand the structure of the data and the target table. Or you can use the Azure portal to create the target table and the DCR based on sample data .


### Azure portal
This method can only be used with a new custom table. The table and DCR are created based on sample data that you provide. If you're sending data to a built-in table or existing custom table, then you must create the DCR manually.

Follow the guidance at [Create a custom table](create-custom-table.md?tabs=azure-portal-1%2Cazure-portal-2%2Cazure-portal-3#create-a-custom-table).


### Manually create DCR
To manually create the DCR, start with the [Sample DCR for Logs Ingestion API](../essentials/data-collection-rule-samples.md#logs-ingestion-api). Modify the following parameters in the template.

| Parameter | Description |
|:---|:---|
| `dataCollectionEndpointId` | Resource ID of your DCE. |
| `StreamDeclarations` | Change the column list to the columns in your incoming data. You don't need to change the name of the stream since this just needs to match the `streams` name in `dataFlows`. |
| `workspaceResourceId` | Resource ID of your Log Analytics workspace. You don't need to change the name since this just needs to match the `destinations` name in `dataFlows`.  |
| transformKql | KQL query to be applied to the incoming data. If the schema of the incoming data matches the schema of the table, then you can use `source` for the transformation. Otherwise, use a query that will transform the data to match the table schema. |
| `outputStream` | Name of the table to send the data. for a custom table, use *Custom-<table-name>*. For a built-in table, use *Microsoft-<table-name>*.


## Next steps

- [Walk through a tutorial sending data to Azure Monitor Logs with Logs ingestion API on the Azure portal](tutorial-logs-ingestion-portal.md)
- [Walk through a tutorial sending custom logs using Resource Manager templates and REST API](tutorial-logs-ingestion-api.md)
- Get guidance on using the client libraries for the Logs ingestion API for [.NET](/dotnet/api/overview/azure/Monitor.Ingestion-readme), [Java](/java/api/overview/azure/monitor-ingestion-readme), [JavaScript](/javascript/api/overview/azure/monitor-ingestion-readme), or [Python](/python/api/overview/azure/monitor-ingestion-readme).
