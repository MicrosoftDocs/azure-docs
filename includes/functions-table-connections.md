---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 01/24/2022
ms.author: mahender
---

[the Tables API extension]: ../articles/azure-functions/functions-bindings-storage-table.md#table-api-extension

## Connections

The `connection` property is a reference to environment configuration that specifies how the app should connect to your table service. It may specify:

- The name of an application setting containing a [connection string](#connection-string)
- The name of a shared prefix for multiple application settings, together defining an [identity-based connection](#identity-based-connections)

If the configured value is both an exact match for a single setting and a prefix match for other settings, the exact match is used.

### Connection string

To obtain a connection string for tables in Azure Table storage, follow the steps shown at [Manage storage account access keys](../articles/storage/common/storage-account-keys-manage.md). To obtain a connection string for tables in Azure Cosmos DB for Table, follow the steps shown at the [Azure Cosmos DB for Table FAQ](../articles/cosmos-db/table/table-api-faq.yml#what-is-the-connection-string-that-i-need-to-use-to-connect-to-the-api-for-table-).

This connection string should be stored in an application setting with a name matching the value specified by the `connection` property of the binding configuration.

If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name here. For example, if you set `connection` to "MyStorage", the Functions runtime looks for an app setting that is named "AzureWebJobsMyStorage". If you leave `connection` empty, the Functions runtime uses the default Storage connection string in the app setting that is named `AzureWebJobsStorage`.

### Identity-based connections

If you're using [the Tables API extension], instead of using a connection string with a secret, you can have the app use an [Microsoft Entra identity](../articles/active-directory/fundamentals/active-directory-whatis.md). This only applies when accessing tables in Azure Storage. To use an identity, you define settings under a common prefix that maps to the `connection` property in the trigger and binding configuration.

If you're setting `connection` to "AzureWebJobsStorage", see [Connecting to host storage with an identity](../articles/azure-functions/functions-reference.md#connecting-to-host-storage-with-an-identity). For all other connections, the extension requires the following properties: 

| Property                  | Environment variable template                       | Description                                | Example value |
|---------------------------|-----------------------------------------------------|--------------------------------------------|---------|
| Table Service URI | `<CONNECTION_NAME_PREFIX>__tableServiceUri`<sup>1</sup>  | The data plane URI of the Azure Storage table service to which you're connecting, using the HTTPS scheme. | https://<storage_account_name>.table.core.windows.net |

<sup>1</sup> `<CONNECTION_NAME_PREFIX>__serviceUri` can be used as an alias. If both forms are provided, the `tableServiceUri` form is used. The `serviceUri` form can't be used when the overall connection configuration is to be used across blobs, queues, and/or tables.

Other properties may be set to customize the connection. See [Common properties for identity-based connections](../articles/azure-functions/functions-reference.md#common-properties-for-identity-based-connections).

The `serviceUri` form can't be used when the overall connection configuration is to be used across blobs, queues, and/or tables in Azure Storage. The URI can only designate the table service. As an alternative, you can provide a URI specifically for each service under the same prefix, allowing a single connection to be used.

[!INCLUDE [functions-identity-based-connections-configuration](./functions-identity-based-connections-configuration.md)]

[!INCLUDE [functions-table-permissions](./functions-table-permissions.md)]
