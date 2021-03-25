---
title: Make your first API call to access commercial marketplace analytics data
description: Examples to learn to use the API for accessing commercial marketplace analytics data. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: sayantanroy83
ms.author: sroy
ms.date: 3/08/2021
---

# Make your first API call to access commercial marketplace analytics data

For a list of the APIs for accessing commercial marketplace analytics data, see [APIs for accessing commercial marketplace analytics data](analytics-available-apis.md). Before you make your first API call, make sure that you met the [pre-requisites](analytics-prerequisites.md) to programmatically access commercial marketplace analytics data.

## Token generation

Before calling any of the methods, you must first obtain an Azure Active Directory (Azure AD) access token. You need to pass the Azure AD access token to the Authorization header of each method in the API. After obtaining an access token, you have 60 minutes to use it before it expires. After the token expires, you can refresh the token and continue to use it for further calls to the API.

Refer to a sample request below for generating a token. The three values that are required to generate the token are `clientId`, `clientSecret`, and `tenantId`. The `resource` parameter should be set to `https://graph.windows.net`.

***Request Example***:

```json
curl --location --request POST 'https://login.microsoftonline.com/{TenantId}/oauth2/token' \
--header 'return-client-request-id: true' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'resource=https://graph.windows.net' \
--data-urlencode 'client_id={client_id}' \
--data-urlencode 'client_secret={client_secret}' \
--data-urlencode 'grant_type=client_credentials'
```

***Response Example***:

```json
{
    "token_type": "Bearer",
    "expires_in": "3599",
    "ext_expires_in": "3599",
    "expires_on": "1612794445",
    "not_before": "1612790545",
    "resource": "https://graph.windows.net",
    "access_token": {Token}
}
```

For more information about how to obtain an Azure AD token for your application, see [Access analytics data using Store services](/windows/uwp/monetize/access-analytics-data-using-windows-store-services#step-2-obtain-an-azure-ad-access-token).

## Programmatic API call

After you obtain the Azure AD Token as described in the previous section, follow these steps to create your first programmatic access report.

Data can be downloaded from the following datasets (datasetName):

- ISVCustomer
- ISVMarketplaceInsights
- ISVUsage
- ISVOrder

In the following sections, we will see examples of how to programmatically access `OrderId` from the ISVOrder dataset.

### Step 1: Make a REST call using the Get Datasets API

The API response provides the dataset name from where you can download the report. For the specific dataset, the API response also provides the list of selectable columns that can be used for your custom report template. You can also refer to the following tables to get the names of the columns:

- [Orders details table](orders-dashboard.md#orders-details-table)
- [Usage details table](usage-dashboard.md#usage-details-table)
- [Customer details table](customer-dashboard.md#customer-details-table)
- [Marketplace insights details table](insights-dashboard.md#marketplace-insights-details-table)

***Request example***:

```json
curl 
--location 
--request GET 'https://api.partnercenter.microsoft.com/insights/v1/cmp/ScheduledDataset ' \ 
--header 'Authorization: Bearer <AzureADToken>'
```

***Response example***:

```json
{
    "value": [
        {
            "datasetName": "ISVOrder",
            "selectableColumns": [
                "MarketplaceSubscriptionId",
                "MonthStartDate",
                "OfferType",
                "AzureLicenseType",
                "Sku",
                "CustomerCountry",
                "IsPreviewSKU",
                "OrderId",
                "OrderQuantity",
                "CloudInstanceName",
                "IsNewCustomer",
                "OrderStatus",
                "OrderCancelDate",
                "CustomerCompanyName",
                "CustomerName",
                "OrderPurchaseDate",
                "OfferName",
                "TrialEndDate",
                "CustomerId",
                "BillingAccountId"
            ],
            "availableMetrics": [],
            "availableDateRanges": [
                "LAST_MONTH",
                "LAST_3_MONTHS",
                "LAST_6_MONTHS",
                "LIFETIME"
            ]
        },
    ],
    "totalCount": 1,
    "message": "Dataset fetched successfully",
    "statusCode": 200
}
```

### Step 2: Create the custom query

In this step, we'll use the Order ID from the Orders Report to create a custom query for the report we want. The default `timespan` if not specified in the query is six months.

***Request example***:

```json
curl 
--location 
--request POST ' https://api.partnercenter.microsoft.com/insights/v1/cmp/ScheduledQueries' \ 
--header ' Authorization: Bearer <AzureAD_Token>' \ 
--header 'Content-Type: application/json' \ 
--data-raw 
            '{ 
                "Query": "SELECT OrderId from ISVOrder", 
                "Name": "ISVOrderQuery1", 
                "Description": "Get a list of all Order IDs" 
             }'
```

***Response example***:

```json
{
    "value": [
        {
            "queryId": "78be43f2-e35f-491a-8cd5-78fe14194f9c",
            "name": "ISVOrderQuery1",
            "description": "Get a list of all Order IDs”,
            "query": "SELECT OrderId from ISVOrder",
            "type": "userDefined",
            "user": "142344300",
            "createdTime": "2021-01-06T05:38:34",
            "modifiedTime": null
        }
    ],
    "totalCount": 1,
    "message": "Query created successfully",
    "statusCode": 200
}
```

On successful execution of the query, a `queryId` is generated that needs to be used to generate the report.

### Step 3: Execute test query API

In this step, we'll use the test query API to get the top 100 rows for the query that was created.

***Request example***:

```json
curl 
--location 
--request GET 'https://api.partnercenter.microsoft.com/insights/v1/cmp/ScheduledQueries/testQueryResult?exportQuery=SELECT%20OrderId%20from%20ISVOrder' \ 
--header ' Authorization: Bearer <AzureADToken>'
```

***Response example***:

```json
{
    "value": [
        {
            "OrderId": "086365c6-9c38-4fba-904a-6228f6cb2ba8"
        },
        {
            "OrderId": "086365c6-9c38-4fba-904a-6228f6cb2bb8"
        },
        {
            "OrderId": "086365c6-9c38-4fba-904a-6228f6cb2bc8"
        },
        {
            "OrderId": "086365c6-9c38-4fba-904a-6228f6cb2bd8"
        },
        {
            "OrderId": "086365c6-9c38-4fba-904a-6228f6cb2be8"
        },
               .
               .
               .

        {
            "OrderId": "086365c6-9c38-4fba-904a-6228f6cb2bf0"
        },
        {
            "OrderId": "086365c6-9c38-4fba-904a-6228f6cb2bf1"
        },
        {
            "OrderId": "086365c6-9c38-4fba-904a-6228f6cb2bf2"
        },
        {
            "OrderId": "086365c6-9c38-4fba-904a-6228f6cb2bf3"
        },
        {
            "OrderId": "086365c6-9c38-4fba-904a-6228f6cb2bf4"
        }
    ],
    "totalCount": 100,
    "message": null,
    "statusCode": 200
}
```

### Step 4: Create the report

In this step, we'll use the previously generated `QueryId` to create the report.

***Request example***:

```json
curl 
--location 
--request POST 'https://api.partnercenter.microsoft.com/insights/v1/cmp/ScheduledReport' \ 
--header ' Authorization: Bearer <AzureADToken>' \ 
--header 'Content-Type: application/json' \ 
--data-raw 
                 '{
                   “ReportName": "ISVReport1",
                   "Description": "Report for getting list of Order Ids",
                   "QueryId": "78be43f2-e35f-491a-8cd5-78fe14194f9c",
                   "StartTime": "2021-01-06T19:00:00Z”,
                   "RecurrenceInterval": 48,
                   "RecurrenceCount": 20,
                    "Format": "csv"
                  }'
```

<br>

_**Table 1: Description of parameters used in this request example**_

| Parameter | Description |
| ------------ | ------------- |
| `Description` | Provide a brief description of the report that’s being generated. |
| `QueryId` | This is the `queryId` that was generated when the query was created in Step 2: Create custom query. |
| `StartTime` | Time the first execution of the report started. |
| `RecurrenceInterval` | Recurrence interval provided during report creation. |
| `RecurrenceCount` | Recurrence count provided during report creation. |
| `Format` | CSV and TSV file formats are supported. |
|||

***Response example***:

```json
{
    "value": [
        {
            "reportId": "72fa95ab-35f5-4d44-a1ee-503abbc88003",
            "reportName": "ISVReport1",
            "description": "Report for getting list of Order Ids",
            "queryId": "78be43f2-e35f-491a-8cd5-78fe14194f9c",
            "query": "SELECT OrderId from ISVOrder",
            "user": "142344300",
            "createdTime": "2021-01-06T05:46:00Z",
            "modifiedTime": null,
            "startTime": "2021-01-06T19:00:00Z",
            "reportStatus": "Active",
            "recurrenceInterval": 48,
            "recurrenceCount": 20,
            "callbackUrl": null,
            "format": "csv"
        }
    ],
    "totalCount": 1,
    "message": "Report created successfully",
    "statusCode": 200
}
```

On successful execution, a `reportId` is generated that needs to be used to schedule a download of the report.

### Step 5: Execute Report Executions API

To get the secure location (URL) of the report, we’ll now execute the Report Executions API.

***Request example***:

```json
Curl
--location
--request GET 'https://api.partnercenter.microsoft.com/insights/v1/cmp/ScheduledReport/execution/72fa95ab-35f5-4d44-a1ee-503abbc88003' \
--header ' Authorization: Bearer <AzureADToken>' \
```

***Response example***:

```json
{
    "value": [
        {
            "executionId": "1f18b53b-df30-4d98-85ee-e6c7e687aeed",
            "reportId": "72fa95ab-35f5-4d44-a1ee-503abbc88003",
            "recurrenceInterval": 48,
            "recurrenceCount": 20,
            "callbackUrl": null,
            "format": "csv",
            "executionStatus": "Pending",
            "reportAccessSecureLink": null,
            "reportExpiryTime": null,
            "reportGeneratedTime": null
        }
    ],
    "totalCount": 1,
    "message": null,
    "statusCode": 200
}
```

## Next steps

- You can try out the APIs through the [Swagger API URL](https://partneranalytics-api.azure-api.net/analytics/cmp/swagger/index.html)
- [Programmatic access paradigm](analytics-programmatic-access.md)