---
title: Logs Ingestion API in Azure Monitor
description: Send data to a Log Analytics workspace using REST API or client libraries.
ms.topic: conceptual
ms.date: 09/14/2023

---

# Configure Logs Ingestion API in Azure Monitor
The [Logs Ingestion API](./logs-ingestion-api-overview.md) in Azure Monitor lets you send data to a Log Analytics workspace from a custom application. Before you send data using the API, you must configure several components in Azure. This article describes the steps you must take to configure the API to receive data.

## 1. Create an app registration and secret
The application registration is used to authenticate the API call. It must be granted permission to the DCR. The API call includes the **Application (client) ID**  and **Directory (tenant) ID** of the application and the **Value** of an application secret.

See [Register an application with Azure AD and create a service principal](../../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal) and [Create a new application secret](../../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-application-secret).

## 2. Create a Data collection endpoint (DCE)

The DCE provides an endpoint for the application to send to. A single DCE can support multiple DCRs, so you can use an existing DCE if you already have one in the same region as your Log Analytics workspace.

See [Create a data collection endpoint](../essentials/data-collection-endpoint-overview.md#create-a-data-collection-endpoint).

## 3. Create table in Log Analytics workspace
The table in the Log Analytics workspace must exist before you can send data to it. You can use one of the [supported Azure tables](#supported-tables) or create a custom table using any of the available methods. If you use the Azure portal to create the table, then the DCR is created for you, including a transformation if it's required. With any other method, you need to create the DCR manully as described in the next section.

See [Create a custom table](create-custom-table.md#create-a-custom-table). 

## 4. Create Data collection rule (DCR)
Azure Monitor uses the [Data collection rule (DCR)](../essentials/data-collection-rule-overview.md) to understand the structure of the incoming data and what to do with it. If the structure of the table and the incoming data don't match, the DCR can include a [transformation](../essentials/data-collection-transformations.md) to convert the source data to match the target table. You can also use the transformation to filter source data and perform any other calculations or conversions.

There are two methods to create a DCR for use with the Logs Ingestion API as described in the following sections.


### Azure portal
This method can only be used with a new custom table. The table and DCR are created based on sample data that you provide. If you're sending data to a built-in table or existing custom table, then you must create the DCR manually.

See [Create a custom table](create-custom-table.md?tabs=azure-portal-1%2Cazure-portal-2%2Cazure-portal-3#create-a-custom-table).


### Manually create DCR
To manually create the DCR, start with the [Sample DCR for Logs Ingestion API](../essentials/data-collection-rule-samples.md#logs-ingestion-api). Modify the following parameters in the template. Then use any of the methods described in [Create and edit data collection rules (DCRs) in Azure Monitor](../essentials/data-collection-rule-create-edit.md) to create the DCR.

| Parameter | Description |
|:---|:---|
| `region` | Region to create your DCR. This must match the region of the DCE and the Log Analytics workspace. |
| `dataCollectionEndpointId` | Resource ID of your DCE. |
| `StreamDeclarations` | Change the column list to the columns in your incoming data. You don't need to change the name of the stream since this just needs to match the `streams` name in `dataFlows`. |
| `workspaceResourceId` | Resource ID of your Log Analytics workspace. You don't need to change the name since this just needs to match the `destinations` name in `dataFlows`.  |
| transformKql | KQL query to be applied to the incoming data. If the schema of the incoming data matches the schema of the table, then you can use `source` for the transformation. Otherwise, use a query that will transform the data to match the table schema. |
| `outputStream` | Name of the table to send the data. For a custom table, add the prefix *Custom-<table-name>*. For a built-in table, add the prefix *Microsoft-<table-name>*.


## 5. Grant access to the DCR
The application that you created in the first step needs access to the DCR that you created. From the **Monitor** menu in the Azure portal, select **Data Collection rules** and then the DCR that you created. Select **Access Control (IAM)** for the DCR and then select **Add role assignment** to add  the **Monitoring Metrics Publisher** role.




## Next steps

- [Walk through a tutorial sending data to Azure Monitor Logs with Logs ingestion API on the Azure portal](tutorial-logs-ingestion-portal.md)
- [Walk through a tutorial sending custom logs using Resource Manager templates and REST API](tutorial-logs-ingestion-api.md)
- Get guidance on using the client libraries for the Logs ingestion API for [.NET](/dotnet/api/overview/azure/Monitor.Ingestion-readme), [Java](/java/api/overview/azure/monitor-ingestion-readme), [JavaScript](/javascript/api/overview/azure/monitor-ingestion-readme), or [Python](/python/api/overview/azure/monitor-ingestion-readme).
