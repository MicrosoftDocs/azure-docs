---
title: APIs for accessing commercial marketplace analytics data
description: Use these APIs to programmatically access analytics data in Partner Center. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: smannepalle
ms.author: smannepalle
ms.reviewer: sroy
ms.date: 3/08/2021
---

# APIs for accessing commercial marketplace analytics data

Following are the list of APIs for accessing commercial marketplace analytics data and their associated functionalities.

- [Dataset pull APIs](#dataset-pull-apis)
- [Query management APIs](#query-management-apis)
- [Report management APIs](#report-management-apis)
- [Report execution pull APIs](#report-execution-pull-apis)

## Dataset pull APIs

***Table 1: Dataset pull APIs***

| **API** | **Functionality** |
| --- | --- |
| [Get all datasets](analytics-api-get-all-datasets.md) | Gets all the available datasets. Datasets list the tables, columns, metrics, and time ranges. |
|||

## Query management APIs

***Table 2: Query management APIs***

| **API** | **Functionality** |
| --- | --- |
| [Create Report Query](analytics-programmatic-access.md#create-report-query-api) | Creates custom queries that define the dataset from which columns and metrics need to be exported. |
| [GET Report Queries](analytics-api-get-report-queries.md) | Gets all the queries available for use in reports. Gets all the system and user-defined queries by default. |
| [DELETE Report Queries](analytics-api-delete-report-queries.md) | Deletes user-defined queries. |
|||

## Report management APIs

***Table 3: Report management APIs***

| **API** | **Functionality** |
| --- | --- |
| [Create Report](analytics-programmatic-access.md#create-report-api) | Schedules a query to be executed at regular intervals. |
| [TRY Report Queries](analytics-api-try-report-queries.md) | Executes a Report query statement. Returns only 10 records that a partner can use to verify if the data is as expected. |
| [Get Report](analytics-api-get-report.md) | Get all the reports that have been scheduled. |
| [Update Report](analytics-api-update-report.md) | Modify a report parameter. |
| [Delete Report](analytics-api-delete-report.md) | Deletes all the report and report execution records. |
| [Pause Report Executions](analytics-api-pause-report-executions.md) | Pauses the scheduled execution of reports. |
| [Resume Report Executions](analytics-api-resume-report-executions.md) | Resumes the scheduled execution of a paused report. |
|||

## Report execution pull APIs

***Table 4: Report execution pull APIs***

| **API** | **Functionality** |
| --- | --- |
| [Get Report Executions](analytics-programmatic-access.md#get-report-executions-api) | Get all the executions that have happened for a given report. |
|||

## Next steps

- You can try out the APIs through the [Swagger API URL](https://api.partnercenter.microsoft.com/insights/v1/cmp/swagger/index.html).
