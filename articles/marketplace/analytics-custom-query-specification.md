---
title: Custom query specification
description: Learn how to use custom queries to programmatically extract data from analytics tables for your offers in the Microsoft commercial marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: sayantanroy83
ms.author: sroy
ms.date: 3/08/2021
---

# Custom query specification

Partners can use this query specification to easily formulate custom queries for extracting data from analytics tables. The queries can be used to select only the desired columns and metrics that match a certain criterion. At the heart of the language specification is the dataset definition on which a custom query can be written.

## Datasets

In the same way that some queries are run against a database that has tables and columns, a custom query works on Datasets that have columns and metrics. The full list of available datasets for formulating a query can be obtained by using the datasets API.

Here’s an example of a dataset shown as a JSON.

```json
{
     "datasetName": "ISVUsage",
     "selectableColumns": [
       "MarketplaceSubscriptionId",
       "OfferName",
            "CustomerId",
     "MonthStartDate",
     "SKU"
    ],
    "availableMetrics": [
     "NormalizedUsage", 
     "RawUsage"
        "EstimatedExtendedChargeCC"
    ],
    "availableDateRanges": [
     "LAST_MONTH",
     "LAST_3_MONTHS",
     "LAST_6_MONTHS",
     "LIFETIME"
    ]
}
```

### Parts of a dataset

- A dataset name is like a database table name. For example, ISVUsage. A dataset has a list of columns that can be selected, such as MarketplaceSubscriptionId.
- A dataset also has metrics, which are like aggregation functions in a database. For example, NormalizedUsage.
- There are fixed time spans over which data can be exported.

### Formulating a query on a dataset

These are some sample queries that show how to extract various types of data.

| Query | Description |
| ------------ | ------------- |
| **SELECT** MarketplaceSubscriptionId,CustomerId **FROM** ISVUsage **TIMESPAN LAST_MONTH** | This query will get every unique `MarketplaceSubscriptionId` and its corresponding `CustomerId` in the last 1 month. |
| **SELECT** MarketplaceSubscriptionId, EstimatedExtendedChargeCC **FROM** ISVUsage **ORDER BY** EstimatedExtendedChargeCC **LIMIT** 10 | This query will get the top 10 subscriptions in decreasing order of the number of licenses sold under each subscription. |
| **SELECT** CustomerId, NormalizedUsage, RawUsage **FROM** ISVUsage **ORDER BY** NormalizedUsage **WHERE** NormalizedUsage > 100000 **ORDER BY** NormalizedUsage **TIMESPAN** LAST_6_MONTHS | This query will get the NormalizedUsage and RawUsage of all the Customers who have NormalizedUsage greater than 100,000. |
| **SELECT** MarketplaceSubscriptionId, MonthStartDate, NormalizedUsage **FROM** ISVUsage **WHERE** CustomerId IN (‘2a31c234-1f4e-4c60-909e-76d234f93161’, ‘80780748-3f9a-11eb-b378-0242ac130002’) | This query will get the `MarketplaceSubscriptionId` and the revenue generated for every month by the two `CustomerId` values: `2a31c234-1f4e-4c60-909e-76d234f93161` and `80780748-3f9a-11eb-b378-0242ac130002`. |
|||

## Query specification

This section describes the query definition and structure.

### Grammar reference

This table describes the symbols used in queries.

| Symbol | Meaning |
| ------------ | ------------- |
| ? | Optional |
| * | Zero or more |
| + | One or more |
| &#124; | Or/One of the list |
| | |

### Query definition

The query statement has the following clauses: SelectClause, FromClause, WhereClause?, OrderClause?, LimitClause?, and TimeSpan?.

- **SelectClause**: **SELECT** ColumOrMetricName (, ColumOrMetricName)*
    - **ColumOrMetricName**: Columns and Metrics defined within the Dataset
- **FromClause**: **FROM** DatasetName
    - **DatasetName**: Dataset name defined within the Dataset
- **WhereClause**: **WHERE** FilterCondition (**AND** FilterCondition)*
    - **FilterCondition**: ColumOrMetricName Operator Value
        - **Operator**:  = | > | < | >= | <= | != | LIKE | NOT LIKE | IN | NOT IN
        - **Value**: Number | StringLiteral | MultiNumberList | MultiStringList 
            - **Number**: -? [0-9]+ (. [0-9] [0-9]*)?
            - **StringLiteral**:  ' [a-zA-Z0-9_]*'
            - **MultiNumberList**: (Number  (,Number)*)
            - **MultiStringList**: (StringLiteral (,StringLiteral)*)
- **OrderClause**: **ORDER BY** OrderCondition (,OrderCondition)*
    - **OrderCondition**: ColumOrMetricName (**ASC** | **DESC**)*
    - **LimitClause**: **LIMIT** [0-9]+
    - **TimeSpan**: **TIMESPAN** ( TODAY | YESTERDAY | LAST_7_DAYS | LAST_14_DAYS | LAST_30_DAYS | LAST_90_DAYS | LAST_180_DAYS | LAST_365_DAYS | LAST_MONTH | LAST_3_MONTHS | LAST_6_MONTHS | LAST_1_YEAR | LIFETIME)

### Query structure

A Report query is made up of multiple parts:

- SELECT
- FROM
- WHERE
- ORDER BY
- LIMIT
- TIMESPAN

Each part is described below.

#### SELECT

This part of the query specifies the columns that will get exported. The columns that can be selected are the fields listed in `selectableColumns` and `availableMetrics` sections of a dataset. The final exported rows will always contain distinct values in the selected columns. For example, there will be no duplicate rows in the exported file. Metrics will be calculated for every distinct combination of the selected columns.

**Example**:
- **SELECT** `OfferName`, `NormalizedUsage`

#### FROM

This part of the query indicates the dataset from which data needs to be exported. The dataset name given here needs to be a valid dataset name returned by the datasets API.

**Example**:
- FROM `ISVUsage`
- FROM `ISVOrder`

#### WHERE

This part of the query is used to specify filter conditions on the dataset. Only rows matching all the conditions listed in this clause will be present in the final exported file. The filter condition can be on any of the columns listed in `selectableColumns` and `availableMetrics`. The values specified in the filter condition can be a list of numbers or a list of strings only when the operator is `IN` or `NOT IN`. The values can always be given as a literal string and they will be converted to the native types of columns. Multiple filter conditions need to be separated with an `AND` operation.

**Example**:

- MarketplaceSubscriptionId = ‘868368da-957d-4959-8992-3c12dc7e6260’
- CustomerName **LIKE** ‘%Contosso%’
- CustomerId **NOT IN** (1000, 1001, 1002)
- OrderQuantity=100
- OrderQuantity=‘100’
    - MarketplaceSubscriptionId=’7b487ac0-ce12-b732-dcd6-91a1e4e74a50’ AND CustomerId=’ 0f8b7fa0-eb83-a183-1225-ca153ef807aa’

#### ORDER BY

This part of the query specifies the ordering criteria for the exported rows. The columns on which ordering can be defined need to be from the `selectableColumns` and `availableMetrics` of the dataset. If there is no ordering direction specified, it will be defaulted to `DESC` on the column. Ordering can be defined on multiple columns by separating the criteria with a comma.

**Example**:

- **ORDER BY** NormalizedUsage **ASC**, EstimatedExtendedCharge(CC) **DESC**
- **ORDER BY** CustomerName **ASC**, NormalizedUsage

#### LIMIT

This part of the query specifies the number of rows that will be exported. The number you specify needs to be a positive nonzero integer.

#### TIMESPAN

This part of the query specifies the time duration for which the data needs to be exported. The possible values should be from the `availableDateRanges` field in the dataset definition.

### Case sensitivity in query specification

The specification is completely case insensitive. Predefined keywords, column names and values can be specified using upper or lower case.

## See also

- [List of system queries](analytics-system-queries.md)
