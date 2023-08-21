---
title: Azure Data Lake Storage Gen 1 output from Azure Stream Analytics
description: This article describes Azure Data Lake Storage Gen 1 as an output option for Azure Stream Analytics.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 08/25/2020
---

# Azure Data Lake Storage Gen 1 output from Azure Stream Analytics

Stream Analytics supports [Azure Data Lake Storage Gen 1](../data-lake-store/data-lake-store-overview.md) outputs. Azure Data Lake Storage is an enterprise-wide, hyperscale repository for big data analytic workloads. You can use Data Lake Storage to store data of any size, type, and ingestion speed for operational and exploratory analytics. Stream Analytics needs to be authorized to access Data Lake Storage.

Azure Data Lake Storage output from Stream Analytics is not available in Microsoft Azure operated by 21Vianet and Azure Germany (T-Systems International).

## Output configuration

The following table lists property names and their descriptions to configure your Data Lake Storage Gen 1 output.

| Property name | Description |
| --- | --- |
| Output alias | A friendly name used in queries to direct the query output to Data Lake Store. |
| Subscription | The subscription that contains your Azure Data Lake Storage account. |
| Account name | The name of the Data Lake Store account where you're sending your output. You're presented with a drop-down list of Data Lake Store accounts that are available in your subscription. |
| Path prefix pattern | The file path that's used to write your files within the specified Data Lake Store account. You can specify one or more instances of the {date} and {time} variables:<br /><ul><li>Example 1: folder1/logs/{date}/{time}</li><li>Example 2: folder1/logs/{date}</li></ul><br />The time stamp of the created folder structure follows UTC and not local time.<br /><br />If the file path pattern doesn't contain a trailing slash (/), the last pattern in the file path is treated as a file name prefix. <br /><br />New files are created in these circumstances:<ul><li>Change in output schema</li><li>External or internal restart of a job</li></ul> |
| Date format | Optional. If the date token is used in the prefix path, you can select the date format in which your files are organized. Example: YYYY/MM/DD |
|Time format | Optional. If the time token is used in the prefix path, specify the time format in which your files are organized. Currently the only supported value is HH. |
| Event serialization format | The serialization format for output data. JSON, CSV, and Avro are supported.|
| Encoding | If you're using CSV or JSON format, an encoding must be specified. UTF-8 is the only supported encoding format at this time.|
| Delimiter | Applicable only for CSV serialization. Stream Analytics supports a number of common delimiters for serializing CSV data. Supported values are comma, semicolon, space, tab, and vertical bar.|
| Format | Applicable only for JSON serialization. **Line separated** specifies that the output is formatted by having each JSON object separated by a new line. If you select **Line separated**, the JSON is read one object at a time. The whole content by itself would not be a valid JSON.  **Array** specifies that the output is formatted as an array of JSON objects. This array is closed only when the job stops or Stream Analytics has moved on to the next time window. In general, it's preferable to use line-separated JSON, because it doesn't require any special handling while the output file is still being written to.|
| Authentication mode | You can authorize access to your Data Lake Storage account using [Managed Identity](stream-analytics-managed-identities-adls.md) (preview) or User token. Once you grant access, you can revoke access by changing the user account password, deleting the Data Lake Storage output for this job, or deleting the Stream Analytics job. |

## Partitioning

For the partition key, use {date} and {time} tokens in the path prefix pattern. Choose a date format, such as YYYY/MM/DD, DD/MM/YYYY, or MM-DD-YYYY. Use HH for the time format. The number of output writers follows the input partitioning for [fully parallelizable queries](stream-analytics-scale-jobs.md).

## Output batch size

For the maximum message size, see [Data Lake Storage limits](../azure-resource-manager/management/azure-subscription-service-limits.md#data-lake-storage-limits). To optimize batch size, use up to 4 MB per write operation.

## Next steps

* [Authenticate Stream Analytics to Azure Data Lake Storage Gen1 using managed identities (preview)](stream-analytics-managed-identities-adls.md)
* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)