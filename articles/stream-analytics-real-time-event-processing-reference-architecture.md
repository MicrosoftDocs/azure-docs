<properties 
	pageTitle="Real-Time Event Processing with Stream Analytics | Azure" 
	description="Learn how a set of Azure services can interoperate for enabling real-time event processing and analytics." 
	services="stream-analytics,event-hubs,storage,sql-database" 
	documentationCenter="" 
	authors="charlesfeddersen" 
	manager="paulettm" 
	editor=""/>

<tags 
	ms.service="stream-analytics" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="1/16/2015" 
	ms.author="charlesf"/>

# Reference Architecture: Real-Time Event Processing with Microsoft Azure Stream Analytics

The reference architecture for real-time event processing with Azure Stream Analytics is intended to provide a generic blueprint for deploying a real-time PaaS stream processing solution with Microsoft Azure.

## Summary

Traditionally, analytics solutions have been based on capabilities such as ETL and Data Warehousing, where data is stored prior to analysis. Changing requirements, including more rapidly arriving data are pushing this existing model to the limit. The ability to analyze data within moving streams prior to storage is one solution, and whilst it is not a new capability, the approach has not been widely adopted across all industry verticals. 

Microsoft Azure provides an extensive catalog of analytics technologies, capable of supporting an array of different solution scenarios and requirements. Selecting which Azure services to deploy for an end-to-end solution can be a challenge given the breadth of offering. This paper is designed to describe the capabilities and interoperation of the various Azure services that support an event streaming solution. It also explains some of the scenarios in which customers can benefit from this type of approach.

## Contents

- Executive Summary
- Introduction to real-time analytics
- Value proposition of real-time analytics
- Common Scenarios for Real-Time Analytics
- Architecture and Components
	- Data Sources
	- Data-Integration
	- Real-time Analytics
	- Data Storage
	- Presentation / Consumption
- Conclusion

**Author:** Charles Feddersen, Architect, Data Insights Center of Excellence, Microsoft Corporation

**Published:** January 2015

**Revision:** 1.0

**Download:** [Real-Time Event Processing with Microsoft Azure Stream Analytics](http://download.microsoft.com/download/6/2/3/623924DE-B083-4561-9624-C1AB62B5F82B/real-time-event-processing-with-microsoft-azure-stream-analytics.pdf)
