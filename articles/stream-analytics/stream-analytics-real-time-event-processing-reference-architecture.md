---
title: Real-time event processing with Azure Stream Analytics
description: This article describes the reference architecture to achieve real-time event processing and analytics by using Azure Stream Analytics.

ms.service: stream-analytics
ms.topic: conceptual
ms.date: 01/24/2017
---
# Reference architecture: Real-time event processing with Microsoft Azure Stream Analytics

The reference architecture for real-time event processing with Azure Stream Analytics provides a generic blueprint for deploying a real-time platform as a service (PaaS) stream-processing solution by using Microsoft Azure.

## Summary

Traditionally, analytics solutions are based on capabilities such as ETL (extract, transform, load) and data warehousing, where data is stored before analysis. Changing requirements, including more rapidly arriving data, are pushing this existing model to the limit.

The ability to analyze data within moving streams before storage is one solution. Although this approach isn't new, it hasn't been widely adopted across industry verticals.

Microsoft Azure provides an extensive catalog of analytics technologies that can support an array of solution scenarios and requirements. Selecting which Azure services to deploy for an end-to-end solution can be a challenge, considering the breadth of offerings.

This reference describes the capabilities and interoperation of the Azure services that support an event-streaming solution. It also explains some of the scenarios in which customers can benefit from this type of approach.

## Contents

* Executive summary
* Introduction to real-time analytics
* Value proposition of real-time data in Azure
* Common scenarios for real-time analytics
* Architecture and components
  * Data sources
  * Data integration layer
  * Real-time analytics layer
  * Data storage layer
  * Presentation/consumption layer
* Conclusion

**Author:** Charles Feddersen, Solution Architect, Data Insights Center of Excellence, Microsoft Corporation

**Published:** January 2015

**Revision:** 1.0

**Download:** [Real-Time Event Processing with Microsoft Azure Stream Analytics](https://download.microsoft.com/download/6/2/3/623924DE-B083-4561-9624-C1AB62B5F82B/real-time-event-processing-with-microsoft-azure-stream-analytics.pdf)

## Get help

For further assistance, try the [Microsoft Q&A page for Azure Stream Analytics](/answers/tags/179/azure-stream-analytics).

## Next steps

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Analyze fraudulent call data with Stream Analytics and visualize results in a Power BI dashboard](stream-analytics-real-time-fraud-detection.md)
* [Scale an Azure Stream Analytics job to increase throughput](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language reference](/stream-analytics-query/stream-analytics-query-language-reference)
* [Azure Stream Analytics Management REST API](/rest/api/streamanalytics/)
