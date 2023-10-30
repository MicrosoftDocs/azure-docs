---
title: Connect different data sources to Metrics Advisor
titleSuffix: Azure AI services
description: Add different data feeds to Metrics Advisor
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-metrics-advisor
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 05/26/2021
ms.author: mbullwin
---


# How-to: Connect different data sources

[!INCLUDE [Deprecation announcement](includes/deprecation.md)]

Use this article to find the settings and requirements for connecting different types of data sources to Azure AI Metrics Advisor. To learn about using your data with Metrics Advisor, see [Onboard your data](how-tos/onboard-your-data.md). 

## Supported authentication types

| Authentication types | Description |
| ---------------------|-------------|
|**Basic** | You need to provide basic parameters for accessing data sources. For example, you can use a connection string or a password. Data feed admins can view these credentials. |
| **Azure managed identity** | [Managed identities](../../active-directory/managed-identities-azure-resources/overview.md) for Azure resources is a feature of Microsoft Entra ID. It provides Azure services with an automatically managed identity in Microsoft Entra ID. You can use the identity to authenticate to any service that supports Microsoft Entra authentication.|
| **Azure SQL connection string**| Store your Azure SQL connection string as a credential entity in Metrics Advisor, and use it directly each time you import metrics data. Only admins of the credential entity can view these credentials, but authorized viewers can create data feeds without needing to know details for the credentials. |
| **Azure Data Lake Storage Gen2 shared key**| Store your data lake account key as a credential entity in Metrics Advisor, and use it directly each time you import metrics data. Only admins of the credential entity can view these credentials, but authorized viewers can create data feeds without needing to know details for the credentials.|
| **Service principal**| Store your [service principal](../../active-directory/develop/app-objects-and-service-principals.md) as a credential entity in Metrics Advisor, and use it directly each time you import metrics data. Only admins of the credential entity can view the credentials, but authorized viewers can create data feeds without needing to know details for the credentials.|
| **Service principal from key vault**|Store your [service principal in a key vault](/azure-stack/user/azure-stack-key-vault-store-credentials) as a credential entity in Metrics Advisor, and use it directly each time you import metrics data. Only admins of a credential entity can view the credentials, but viewers can create data feeds without needing to know details for the credentials. |


## Data sources and corresponding authentication types

| Data sources | Authentication types |
|-------------| ---------------------|
|[Application Insights](#appinsights) | Basic |
|[Azure Blob Storage (JSON)](#blob) | Basic<br>Managed identity |
|[Azure Cosmos DB (SQL)](#cosmosdb) | Basic |
|[Azure Data Explorer (Kusto)](#kusto) | Basic<br>Managed identity<br>Service principal<br>Service principal from key vault |
|[Azure Data Lake Storage Gen2](#adl) | Basic<br>Data Lake Storage Gen2 shared key<br>Service principal<br>Service principal from key vault |
|[Azure Event Hubs](#eventhubs) | Basic |
|[Azure Monitor Logs](#log) | Basic<br>Service principal<br>Service principal from key vault |
|[Azure SQL Database / SQL Server](#sql) | Basic<br>Managed identity<br>Service principal<br>Service principal from key vault<br>Azure SQL connection string |
|[Azure Table Storage](#table) | Basic | 
|[InfluxDB (InfluxQL)](#influxdb) | Basic |
|[MongoDB](#mongodb) | Basic |
|[MySQL](#mysql) | Basic |
|[PostgreSQL](#pgsql) | Basic|

The following sections specify the parameters required for all authentication types within different data source scenarios. 

## <span id="appinsights">Application Insights</span>

* **Application ID**: This is used to identify this application when you're using the Application Insights API. To get the application ID, follow these steps:

   1. From your Application Insights resource, select **API Access**.
   
      ![Screenshot that shows how to get the application ID from your Application Insights resource.](media/portal-app-insights-app-id.png)

   2. Copy the application ID generated into the **Application ID** field in Metrics Advisor. 

* **API key**: API keys are used by applications outside the browser to access this resource. To get the API key, follow these steps:

   1. From the Application Insights resource, select **API Access**.

   2. Select **Create API key**.

   3. Enter a short description, select the **Read telemetry** option, and select **Generate key**.

      ![Screenshot that shows how to get the API key in the Azure portal.](media/portal-app-insights-app-id-api-key.png)

       > [!IMPORTANT]
       > Copy and save this API key. It will never be shown to you again. If you lose this key, you have to create a new one.

   4. Copy the API key to the **API key** field in Metrics Advisor.

* **Query**: Application Insights logs are built on Azure Data Explorer, and Azure Monitor log queries use a version of the same Kusto query language. The [Kusto query language documentation](/azure/data-explorer/kusto/query) should be your primary resource for writing a query against Application Insights. 

    Sample query:

    ``` Kusto
    [TableName] | where [TimestampColumn] >= datetime(@IntervalStart) and [TimestampColumn] < datetime(@IntervalEnd);
    ```
    You can also refer to the [Tutorial: Write a valid query](tutorials/write-a-valid-query.md) for more specific examples.
  
## <span id="blob">Azure Blob Storage (JSON)</span>

* **Connection string**: There are two authentication types for Azure Blob Storage (JSON):

    * **Basic**: See [Configure Azure Storage connection strings](../../storage/common/storage-configure-connection-string.md#configure-a-connection-string-for-an-azure-storage-account) for information on retrieving this string. Also, you can visit the Azure portal for your Azure Blob Storage resource, and find the connection string directly in **Settings** > **Access keys**.
    
    * **Managed identity**: Managed identities for Azure resources can authorize access to blob and queue data. The feature uses Microsoft Entra credentials from applications running in Azure virtual machines (VMs), function apps, virtual machine scale sets, and other services. 
    
        You can create a managed identity in the Azure portal for your Azure Blob Storage resource. In **Access Control (IAM)**, select **Role assignments**, and then select **Add**. A suggested role type is: **Storage Blob Data Reader**. For more details, refer to [Use managed identity to access Azure Storage](../../active-directory/managed-identities-azure-resources/tutorial-vm-windows-access-storage.md#grant-access-1).
    
        ![Screenshot that shows a managed identity blob.](media/managed-identity-blob.png)
    

* **Container**: Metrics Advisor expects time series data to be stored as blob files (one blob per timestamp), under a single container. This is the container name field.

* **Blob template**: Metrics Advisor uses a path to find the JSON file in Blob Storage. This is an example of a blob file template, which is used to find the JSON file in Blob Storage: `%Y/%m/FileName_%Y-%m-%d-%h-%M.json`. `%Y/%m` is the path, and if you have `%d` in your path, you can add it after `%m`. If your JSON file is named by date, you can also use `%Y-%m-%d-%h-%M.json`.

   The following parameters are supported:
   
   * `%Y` is the year, formatted as `yyyy`.
   * `%m` is the month, formatted as `MM`.
   * `%d` is the day, formatted as `dd`.
   * `%h` is the hour, formatted as `HH`.
   * `%M` is the minute, formatted as `mm`.
  
   For example, in the following dataset, the blob template should be `%Y/%m/%d/00/JsonFormatV2.json`.
  
   ![Screenshot that shows the blob template.](media/blob-template.png)
  

* **JSON format version**: Defines the data schema in the JSON files. Metrics Advisor supports the following versions. You can choose one to fill in the field:
  
   * **v1** 

      Only the metrics *Name* and *Value* are accepted. For example:
    
      ```json
      {"count":11, "revenue":1.23}
      ```

   * **v2**

      The metrics *Dimensions* and *timestamp* are also accepted. For example:
      
      ```json
      [
        {"date": "2018-01-01T00:00:00Z", "market":"en-us", "count":11, "revenue":1.23},
        {"date": "2018-01-01T00:00:00Z", "market":"zh-cn", "count":22, "revenue":4.56}
      ]
      ```

   Only one timestamp is allowed per JSON file. 

## <span id="cosmosdb">Azure Cosmos DB (SQL)</span>

* **Connection string**: The connection string to access your Azure Cosmos DB instance. This can be found in the Azure Cosmos DB resource in the Azure portal, in **Keys**. For more information, see [Secure access to data in Azure Cosmos DB](../../cosmos-db/secure-access-to-data.md).
* **Database**: The database to query against. In the Azure portal, under **Containers**, go to **Browse** to find the database.
* **Collection ID**: The collection ID to query against. In the Azure portal, under **Containers**, go to **Browse** to find the collection ID.
* **SQL query**: A SQL query to get and formulate data into multi-dimensional time series data. You can use the `@IntervalStart` and `@IntervalEnd` variables in your query. They should be formatted as follows: `yyyy-MM-ddTHH:mm:ssZ`.

    Sample query:
    
    ```SQL
    SELECT [TimestampColumn], [DimensionColumn], [MetricColumn] FROM [TableName] WHERE [TimestampColumn] >= @IntervalStart and [TimestampColumn] < @IntervalEnd    
    ```

    For more information, refer to the [tutorial on writing a valid query](tutorials/write-a-valid-query.md).

## <span id="kusto">Azure Data Explorer (Kusto)</span>

* **Connection string**: There are four authentication types for Azure Data Explorer (Kusto): basic, service principal, service principal from key vault, and managed identity. The data source in the connection string should be in the URI format (starts with "https"). You can find the URI in the Azure portal.
    
    * **Basic**: Metrics Advisor supports accessing Azure Data Explorer (Kusto) by using Microsoft Entra application authentication. You need to create and register a Microsoft Entra application, and then authorize it to access an Azure Data Explorer database. For more information, see [Create a Microsoft Entra app registration in Azure Data Explorer](/azure/data-explorer/provision-azure-ad-app). Here's an example of connection string:
        
        ```
        Data Source=<URI Server>;Initial Catalog=<Database>;AAD Federated Security=True;Application Client ID=<Application Client ID>;Application Key=<Application Key>;Authority ID=<Tenant ID>
        ```

    * **Service principal**: A service principal is a concrete instance created from the application object. The service principal inherits certain properties from that application object. The service principal object defines what the app can actually do in the specific tenant, who can access the app, and what resources the app can access. To use a service principal in Metrics Advisor:
    
        1. Create the Microsoft Entra application registration. For more information, see [Create a Microsoft Entra app registration in Azure Data Explorer](/azure/data-explorer/provision-azure-ad-app).

        1. Manage Azure Data Explorer database permissions. For more information, see [Manage Azure Data Explorer database permissions](/azure/data-explorer/manage-database-permissions). 

        1. Create a credential entity in Metrics Advisor. See how to [create a credential entity](how-tos/credential-entity.md) in Metrics Advisor, so that you can choose that entity when you're adding a data feed for the service principal authentication type. 
        
        Here's an example of connection string:
        
        ```
        Data Source=<URI Server>;Initial Catalog=<Database>
        ```

    * **Service principal from key vault**: Azure Key Vault helps to safeguard cryptographic keys and secret values that cloud apps and services use. By using Key Vault, you can encrypt keys and secret values. You should create a service principal first, and then store the service principal inside Key Vault. For more information, see [Create a credential entity for service principal from Key Vault](how-tos/credential-entity.md#sp-from-kv) to follow detailed procedure to set service principal from key vault. Here's an example of connection string: 
        ```
        Data Source=<URI Server>;Initial Catalog=<Database>
        ```

    * **Managed identity**: Managed identity for Azure resources can authorize access to blob and queue data. Managed identity uses Microsoft Entra credentials from applications running in Azure virtual machines, function apps, virtual machine scale sets, and other services. By using managed identity for Azure resources and Microsoft Entra authentication, you can avoid storing credentials with your applications that run in the cloud. Learn how to [authorize with a managed identity](../../storage/blobs/authorize-managed-identity.md#enable-managed-identities-on-a-vm). 
    
        You can create a managed identity in the Azure portal for your Azure Data Explorer (Kusto). Select **Permissions** > **Add**. The suggested role type is: **admin / viewer**.
        
        ![Screenshot that shows managed identity for Kusto.](media/managed-identity-kusto.png)

        Here's an example of connection string: 
        ```
        Data Source=<URI Server>;Initial Catalog=<Database>
        ```

     
* **Query**: To get and formulate data into multi-dimensional time series data, see [Kusto Query Language](/azure/data-explorer/kusto/query). You can use the `@IntervalStart` and `@IntervalEnd` variables in your query. They should be formatted as follows: `yyyy-MM-ddTHH:mm:ssZ`.

  Sample query:
    
  ```kusto
  [TableName] | where [TimestampColumn] >= datetime(@IntervalStart) and [TimestampColumn] < datetime(@IntervalEnd);    
  ```

  For more information, refer to the [tutorial on writing a valid query](tutorials/write-a-valid-query.md).

## <span id="adl">Azure Data Lake Storage Gen2</span>

* **Account Name**: The authentication types for Azure Data Lake Storage Gen2 are basic, Azure Data Lake Storage Gen2 shared key, service principal, and service principal from Key Vault.
    
    * **Basic**: The **Account Name** of your Azure Data Lake Storage Gen2. You can find this in your Azure storage account (Azure Data Lake Storage Gen2) resource, in **Access keys**. 

    * **Azure Data Lake Storage Gen2 shared key**: First, you specify the account key to access your Azure Data Lake Storage Gen2 (this is the same as the account key in the basic authentication type. You can find this in your Azure storage account (Azure Data Lake Storage Gen2) resource, in **Access keys**. Then, you [create a credential entity](how-tos/credential-entity.md) for Azure Data Lake Storage Gen2 shared key type, and fill in the account key. 

        The account name is the same as the basic authentication type.
    
    * **Service principal**: A *service principal* is a concrete instance created from the application object, and it inherits certain properties from that application object. A service principal is created in each tenant where the application is used, and it references the globally unique app object. The service principal object defines what the app can actually do in the specific tenant, who can access the app, and what resources the app can access.

        The account name is the same as the basic authentication type.
    
        **Step 1:** Create and register a Microsoft Entra application, and then authorize it to access the database. For more information, see [Create a Microsoft Entra app registration](/azure/data-explorer/provision-azure-ad-app).

        **Step 2:** Assign roles.
        
        1. In the Azure portal, go to the **Storage accounts** service.
        
        2. Select the Azure Data Lake Storage Gen2 account to use with this application registration.

        3. Select **Access Control (IAM)**.

        4. Select **+ Add**, and select **Add role assignment** from the menu.

        5. Set the **Select** field to the Microsoft Entra application name, and set the role to **Storage Blob Data Contributor**. Then select **Save**.
        
        ![Screenshot that shows the steps to assign roles.](media/datafeeds/adls-gen-2-app-reg-assign-roles.png)

        **Step 3:** [Create a credential entity](how-tos/credential-entity.md) in Metrics Advisor, so that you can choose that entity when you're adding a data feed for the service principal authentication type. 
        
    * **Service principal from Key Vault**: Key Vault helps to safeguard cryptographic keys and secret values that cloud apps and services use. By using Key Vault, you can encrypt keys and secret values. Create a service principal first, and then store the service principal inside a key vault. For more details, see [Create a credential entity for service principal from Key Vault](how-tos/credential-entity.md#sp-from-kv). The account name is the same as the basic authentication type.

* **Account Key** (only necessary for the basic authentication type): Specify the account key to access your Azure Data Lake Storage Gen2. You can find this in your Azure storage account (Azure Data Lake Storage Gen2) resource, in **Access keys**.

* **File System Name (Container)**: For Metrics Advisor, you store your time series data as blob files (one blob per timestamp), under a single container. This is the container name field. You can find this in your Azure storage account (Azure Data Lake Storage Gen2) instance. In **Data Lake Storage**, select **Containers**, and then you see the container name.

* **Directory Template**: This is the directory template of the blob file. The following parameters are supported:

   * `%Y` is the year, formatted as `yyyy`.
   * `%m` is the month, formatted as `MM`.
   * `%d` is the day, formatted as `dd`.
   * `%h` is the hour, formatted as `HH`.
   * `%M` is the minute, formatted as `mm`.

   Query sample for a daily metric: `%Y/%m/%d`.

   Query sample for an hourly metric: `%Y/%m/%d/%h`.

* **File Template**:
   Metrics Advisor uses a path to find the JSON file in Blob Storage. The following is an example of a blob file template, which is used to find the JSON file in Blob Storage: `%Y/%m/FileName_%Y-%m-%d-%h-%M.json`. `%Y/%m` is the path, and if you have `%d` in your path, you can add it after `%m`. 
   
   The following parameters are supported:
   
   * `%Y` is the year, formatted as `yyyy`.
   * `%m` is the month, formatted as `MM`.
   * `%d` is the day, formatted as `dd`.
   * `%h` is the hour, formatted as `HH`.
   * `%M` is the minute, formatted as `mm`.

   Metrics Advisor supports the data schema in the JSON files, as in the following example:

   ```json
   [
     {"date": "2018-01-01T00:00:00Z", "market":"en-us", "count":11, "revenue":1.23},
     {"date": "2018-01-01T00:00:00Z", "market":"zh-cn", "count":22, "revenue":4.56}
   ]
   ```

## <span id="eventhubs">Azure Event Hubs</span>

* **Limitations**: Be aware of the following limitations with integration.

   * Metrics Advisor integration with Event Hubs doesn't currently support more than three active data feeds in one Metrics Advisor instance in public preview.
   * Metrics Advisor will always start consuming messages from the latest offset, including when reactivating a paused data feed.
   
      * Messages during the data feed pause period will be lost.
      * The data feed ingestion start time is set to the current Coordinated Universal Time timestamp automatically, when the data feed is created. This time is only for reference purposes.

   * Only one data feed can be used per consumer group. To reuse a consumer group from another deleted data feed, you need to wait at least ten minutes after deletion.
   * The connection string and consumer group can't be modified after the data feed is created.
   * For Event Hubs messages, only JSON is supported, and the JSON values can't be a nested JSON object. The top-level element can be a JSON object or a JSON array.
    
    Valid messages are as follows:

    Single JSON object:

    ```json
    {
    "metric_1": 234, 
    "metric_2": 344, 
    "dimension_1": "name_1", 
    "dimension_2": "name_2"
    }
    ```

    JSON array:

    ```json
    [
        {
            "timestamp": "2020-12-12T12:00:00", "temperature": 12.4,
            "location": "outdoor"
        },
        {
            "timestamp": "2020-12-12T12:00:00", "temperature": 24.8,
            "location": "indoor"
        }
    ]
    ```


* **Connection String**: Go to the instance of Event Hubs. Then add a new policy or choose an existing shared access policy. Copy the connection string in the pop-up panel.
    ![Screenshot of Event Hubs.](media/datafeeds/entities-eventhubs.jpg)
    
    ![Screenshot of shared access policies.](media/datafeeds/shared-access-policies.jpg)

    Here's an example of a connection string: 
    ```
    Endpoint=<Server>;SharedAccessKeyName=<SharedAccessKeyName>;SharedAccessKey=<SharedAccess Key>;EntityPath=<EntityPath>
    ```

* **Consumer Group**: A [consumer group](../../event-hubs/event-hubs-features.md#consumer-groups) is a view (state, position, or offset) of an entire event hub.
You find this on the **Consumer Groups** menu of an instance of Azure Event Hubs. A consumer group can only serve one data feed. Create a new consumer group for each data feed.
* **Timestamp** (optional): Metrics Advisor uses the Event Hubs timestamp as the event timestamp, if the user data source doesn't contain a timestamp field. The timestamp field is optional. If no timestamp column is chosen, the service uses the enqueued time as the timestamp.

    The timestamp field must match one of these two formats:
    
    * `YYYY-MM-DDTHH:MM:SSZ`
    * The number of seconds or milliseconds from the epoch of `1970-01-01T00:00:00Z`.
    
    The timestamp will left-align to granularity. For example, if the timestamp is `2019-01-01T00:03:00Z`, granularity is 5 minutes, and then Metrics Advisor aligns the timestamp to `2019-01-01T00:00:00Z`. If the event timestamp is `2019-01-01T00:10:00Z`, Metrics Advisor uses the timestamp directly, without any alignment. 


## <span id="log">Azure Monitor Logs</span>

Azure Monitor Logs has the following authentication types: basic, service principal, and service principal from Key Vault.
* **Basic**: You need to fill in **Tenant ID**, **Client ID**, **Client Secret**, and **Workspace ID**.
   To get **Tenant ID**, **Client ID**, and **Client Secret**, see [Register app or web API](../../active-directory/develop/quickstart-register-app.md). You can find **Workspace ID** in the Azure portal.
   
    ![Screenshot that shows where to find the Workspace ID in the Azure portal.](media/workspace-id.png)
    
* **Service principal**: A service principal is a concrete instance created from the application object, and it inherits certain properties from that application object. A service principal is created in each tenant where the application is used, and it references the globally unique app object. The service principal object defines what the app can actually do in the specific tenant, who can access the app, and what resources the app can access.
    
    **Step 1:** Create and register a Microsoft Entra application, and then authorize it to access a database. For more information, see [Create a Microsoft Entra app registration](/azure/data-explorer/provision-azure-ad-app).

    **Step 2:** Assign roles.
    1. In the Azure portal, go to the **Storage accounts** service.
    2. Select **Access Control (IAM)**.
    3. Select **+ Add**, and then select **Add role assignment** from the menu.
    4. Set the **Select** field to the Microsoft Entra application name, and set the role to **Storage Blob Data Contributor**. Then select **Save**.
    
        ![Screenshot that shows how to assign roles.](media/datafeeds/adls-gen-2-app-reg-assign-roles.png)

    
    **Step 3:** [Create a credential entity](how-tos/credential-entity.md) in Metrics Advisor, so that you can choose that entity when you're adding a data feed for the service principal authentication type. 
        
* **Service principal from Key Vault**: Key Vault helps to safeguard cryptographic keys and secret values that cloud apps and services use. By using Key Vault, you can encrypt keys and secret values. Create a service principal first, and then store the service principal inside a key vault. For more details, see [Create a credential entity for service principal from Key Vault](how-tos/credential-entity.md#sp-from-kv). 

* **Query**: Specify the query. For more information, see [Log queries in Azure Monitor](../../azure-monitor/logs/log-query-overview.md).

    Sample query:

    ``` Kusto
    [TableName]
    | where [TimestampColumn] >= datetime(@IntervalStart) and [TimestampColumn] < datetime(@IntervalEnd)
    | summarize [count_per_dimension]=count() by [Dimension]
    ```

    For more information, refer to the [tutorial on writing a valid query](tutorials/write-a-valid-query.md).

## <span id="sql">Azure SQL Database | SQL Server</span>

* **Connection String**: The authentication types for Azure SQL Database and SQL Server are basic, managed identity, Azure SQL connection string, service principal, and service principal from key vault.
    
    * **Basic**: Metrics Advisor accepts an [ADO.NET style connection string](/dotnet/framework/data/adonet/connection-string-syntax) for a SQL Server data source.
    Here's an example of connection string: 
    
        ```
        Data Source=<Server>;Initial Catalog=<db-name>;User ID=<user-name>;Password=<password>
        ```
    
    * <span id='jump'>**Managed identity**</span>: Managed identity for Azure resources can authorize access to blob and queue data. It does so by using Microsoft Entra credentials from applications running in Azure virtual machines, function apps, virtual machine scale sets, and other services. By using managed identity for Azure resources and Microsoft Entra authentication, you can avoid storing credentials with your applications that run in the cloud. To [enable your managed entity](../../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-sql.md), follow these steps:
    1. Enabling a system-assigned managed identity is a one-click experience. In the Azure portal, for your Metrics Advisor workspace, go to **Settings** > **Identity** > **System assigned**. Then set the status as **on**. 
    
        ![Screenshot that shows how to set the status as on.](media/datafeeds/set-identity-status.png)

    1. Enable Microsoft Entra authentication. In the Azure portal, for your data source, go to **Settings** > **Active Directory admin**. Select **Set admin**, and select an **Microsoft Entra user account** to be made an administrator of the server. Then, choose **Select**.
    
        ![Screenshot that shows how to set the admin.](media/datafeeds/set-admin.png)

    1. Enable managed identity in Metrics Advisor. You can edit a query in the database management tool or in the Azure portal.
    
        **Management tool**: In your database management tool, select **Active Directory - Universal with MFA support** in the authentication field. In the **User name** field, enter the name of the Microsoft Entra account that you set as the server administrator in step 2. For example, this might be `test@contoso.com`.
    
        ![Screenshot that shows how to set connection details.](media/datafeeds/connection-details.png)
        
        **Azure portal**: In your SQL database, select **Query editor**, and sign in the admin account.
        ![Screenshot that shows how to edit your query in the Azure portal.](media/datafeeds/query-editor.png)

        Then in the query window, run the following (note that this is the same for the management tool method):
    
        ```
        CREATE USER [MI Name] FROM EXTERNAL PROVIDER
        ALTER ROLE db_datareader ADD MEMBER [MI Name]
        ```
    
        > [!NOTE]
        > The `MI Name` is the managed identity name in Metrics Advisor (for service principal, it should be replaced with the service principal name). For more information, see [Authorize with a managed identity](../../storage/blobs/authorize-managed-identity.md#enable-managed-identities-on-a-vm). 
            
        Here's an example of a connection string: 
       
        ```
        Data Source=<Server>;Initial Catalog=<Database>
        ```
        
    * **Azure SQL connection string**: 
      

        Here's an example of a connection string: 
        
        ```
        Data Source=<Server>;Initial Catalog=<Database>;User ID=<user-name>;Password=<password>
        ```
  

    * **Service principal**: A service principal is a concrete instance created from the application object, and it inherits certain properties from that application object. A service principal is created in each tenant where the application is used, and it references the globally unique app object. The service principal object defines what the app can actually do in the specific tenant, who can access the app, and what resources the app can access.
    
        **Step 1:** Create and register a Microsoft Entra application, and then authorize it to access a database. For more information, see [Create a Microsoft Entra app registration](/azure/data-explorer/provision-azure-ad-app).

        **Step 2:** Follow the steps documented previously, in [managed identity in SQL Server](#jump). 

        **Step 3:** [Create a credential entity](how-tos/credential-entity.md) in Metrics Advisor, so that you can choose that entity when you're adding a data feed for the service principal authentication type. 

        Here's an example of a connection string: 
        
        ```
        Data Source=<Server>;Initial Catalog=<Database>
        ```
  
    * **Service principal from Key Vault**: Key Vault helps to safeguard cryptographic keys and secret values that cloud apps and services use. By using Key Vault, you can encrypt keys and secret values. Create a service principal first, and then store the service principal inside a key vault. For more details, see [Create a credential entity for service principal from Key Vault](how-tos/credential-entity.md#sp-from-kv). You can also find your connection string in your Azure SQL Server resource, in **Settings** > **Connection strings**.
        
        Here's an example of connection string: 
        
        ```
        Data Source=<Server>;Initial Catalog=<Database>
        ```

* **Query**: Use a SQL query to get and formulate data into multi-dimensional time series data. You can use `@IntervalStart` and `@IntervalEnd` in your query to help with getting an expected metrics value in an interval. They should be formatted as follows: `yyyy-MM-ddTHH:mm:ssZ`.


    Sample query:
    
    ```SQL
    SELECT [TimestampColumn], [DimensionColumn], [MetricColumn] FROM [TableName] WHERE [TimestampColumn] >= @IntervalStart and [TimestampColumn] < @IntervalEnd    
    ```
    
## <span id="table">Azure Table Storage</span>

* **Connection String**: Create a shared access signature (SAS) URL, and fill it in here. The most straightforward way to generate a SAS URL is by using the Azure portal. First, under **Settings**, go to the storage account you want to access. Then select **Shared access signature**. Select the **Table** and **Object** checkboxes, and then select **Generate SAS and connection string**. In the Metrics Advisor workspace, copy and paste the **Table service SAS URL** into the text box.

    ![Screenshot that shows how to generate the shared access signature in Azure Table Storage.](media/azure-table-generate-sas.png)

* **Table Name**: Specify a table to query against. You can find this in your Azure storage account instance. In the **Table Service** section, select **Tables**.

* **Query**: You can use `@IntervalStart` and `@IntervalEnd` in your query to help with getting an expected metrics value in an interval. They should be formatted as follows: `yyyy-MM-ddTHH:mm:ssZ`.

    Sample query:
    
    ``` mssql
    PartitionKey ge '@IntervalStart' and PartitionKey lt '@IntervalEnd'
    ```

    For more information, see the [tutorial on writing a valid query](tutorials/write-a-valid-query.md).


## <span id="influxdb">InfluxDB (InfluxQL)</span>

* **Connection String**: The connection string to access InfluxDB.
* **Database**: The database to query against.
* **Query**: A query to get and formulate data into multi-dimensional time series data for ingestion.

    Sample query:

    ``` SQL
    SELECT [TimestampColumn], [DimensionColumn], [MetricColumn] FROM [TableName] WHERE [TimestampColumn] >= @IntervalStart and [TimestampColumn] < @IntervalEnd
    ```
    
For more information, refer to the [tutorial on writing a valid query](tutorials/write-a-valid-query.md).

* **User name**: This is optional for authentication. 
* **Password**: This is optional for authentication. 

## <span id="mongodb">MongoDB</span>

* **Connection String**: The connection string to access MongoDB.
* **Database**: The database to query against.
* **Query**: A command to get and formulate data into multi-dimensional time series data for ingestion. Verify the command on [db.runCommand()](https://docs.mongodb.com/manual/reference/method/db.runCommand/index.html).

    Sample query:

    ``` MongoDB
    {"find": "[TableName]","filter": { [Timestamp]: { $gte: ISODate(@IntervalStart) , $lt: ISODate(@IntervalEnd) }},"singleBatch": true}
    ```
    

## <span id="mysql">MySQL</span>

* **Connection String**: The connection string to access MySQL DB.
* **Query**: A query to get and formulate data into multi-dimensional time series data for ingestion.

    Sample query:

    ``` SQL
    SELECT [TimestampColumn], [DimensionColumn], [MetricColumn] FROM [TableName] WHERE [TimestampColumn] >= @IntervalStart and [TimestampColumn]< @IntervalEnd
    ```

    For more information, refer to the [tutorial on writing a valid query](tutorials/write-a-valid-query.md).

## <span id="pgsql">PostgreSQL</span>

* **Connection String**: The connection string to access PostgreSQL DB.
* **Query**: A query to get and formulate data into multi-dimensional time series data for ingestion.

    Sample query:

    ``` SQL
    SELECT [TimestampColumn], [DimensionColumn], [MetricColumn] FROM [TableName] WHERE [TimestampColumn] >= @IntervalStart and [TimestampColumn] < @IntervalEnd
    ```
    For more information, refer to the [tutorial on writing a valid query](tutorials/write-a-valid-query.md).
    
## Next steps

* While you're waiting for your metric data to be ingested into the system, read about [how to manage data feed configurations](how-tos/manage-data-feeds.md).
* When your metric data is ingested, you can [configure metrics and fine tune detection configuration](how-tos/configure-metrics.md).
