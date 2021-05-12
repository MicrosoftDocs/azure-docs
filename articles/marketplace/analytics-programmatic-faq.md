---
title: Programmatic access of analytics data common questions
description: Commonly asked questions about programmatically accessing analytics data in Partner Center for your commercial marketplace offers. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: sayantanroy83
ms.author: sroy
ms.date: 3/08/2021
---

# Programmatic access of analytics data common questions

This article addresses commonly asked questions about how to programmatically access analytics data in Partner Center for your commercial marketplace offers.

## API responses

What are the different scenarios under which I can receive an API response other than 200 (Success)?

This table describes the API responses and what to do if you receive them.

| Error description | Error code | Troubleshoot |
| ------------ | ------------- | ------------- |
| Unauthorized | 401 | This is an authentication exception. Check the correctness of the Azure Active Directory (Azure AD) token. The Azure AD token is valid for 60 minutes, after which time you would need to regenerate the Azure AD token. |
| Invalid table name | 400 | The name of the dataset is wrong. Recheck the dataset name by calling the “Get All Datasets” API. |
| Incorrect column name | 400| The name of the column in the query is incorrect. Recheck the column name by calling the “Get All Datasets” API or refer to the column names in the following tables:<br><ul><li>[Orders details table](orders-dashboard.md#orders-details-table)</li><li>[Usage details table](usage-dashboard.md#usage-details-table)</li><li>[Customer details table](customer-dashboard.md#customer-details-table)</li><li>[Marketplace insights details table](insights-dashboard.md#marketplace-insights-details-table)</li></UL> |
| Null or missing value | 400 | You may be missing mandatory parameters as part of the request payload of the API. |
| Invalid report parameters | 400 | Make sure the report parameters are correct. For example, you may be giving a value of less than 4 for `RecurrenceInterval` parameter. |
| Recurrence Interval must be between 4 and 90 | 400 | Make sure the value of the `RecurrenceInterval` request parameter is between 4 and 90. |
| Invalid QueryId | 400 | Recheck the generated `QueryId`. |
| Invalid report parameters for creation - Start time of report should at least be 4 hours from current UTC time - | 400 | Start Time parameter as part of request payload shouldn’t be in the past. The start time of the report should be at least 4 hours from the current UTC time. |
| Requested value ‘string’ not found | 400 | Check whether you have updated the request parameters `callbackurl` or `format`. |
| No item found with given filters. | 404 | Check the `reportID` parameter used in the Get Report Executions API. |
| There are no executions that have occurred for the given filter conditions. Please recheck the reportId or executionId and retry the API after the report's scheduled execution time | 404 | Make sure that the `reportId` is correct. Retry the API after the report’s scheduled execution time as specified in the request payload. |
| Internal error encountered while creating report. Correlation ID <> | 500 | Make sure that the format of date for the fields "StartTime", "QueryStartTime" and "QueryEndTime" are correct. |
| Service unavailable | 500 | If you continuously receive a service unavailable (5xx error), please create a [support ticket](support.md). |
||||

## No records

I receive API response 200 when I download the report from the secure location. Why am I getting no records?

Check whether the string in the query has one of the allowable values for the column header. For example, this query will return zero results:

`"SELECT UsageDate, NormalizedUsage, EstimatedExtendedChargePC FROM ISVUsage WHERE SKUBillingType = 'Paided' ORDER BY UsageDate DESC TIMESPAN LAST_MONTH"`

In this example, the allowable values for SKUBillingType are Paid or Free. Refer to the following tables for all possible values for the various columns:

- [Orders details table](orders-dashboard.md#orders-details-table)
- [Usage details table](usage-dashboard.md#usage-details-table)
- [Customer details table](customer-dashboard.md#customer-details-table)
- [Marketplace insights details table](insights-dashboard.md#marketplace-insights-details-table)

## Next steps

- [APIs for accessing commercial marketplace analytics data](analytics-available-apis.md)
