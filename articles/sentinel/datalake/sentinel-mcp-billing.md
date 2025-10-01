---
title: Microsoft Sentinel MCP server pricing, limits, and availability
titleSuffix: Microsoft Security  
description: Learn about the pricing, limits, and availability of using the different MCP collection of tools in Microsoft Sentinel 
author: poliveria
ms.topic: concept-article
ms.date: 09/30/2025
ms.author: pauloliveria
ms.service: microsoft-sentinel
ms.custom: references_regions

#customer intent: As a security analyst, I want to understand Microsoft Sentinel MCP server pricing, limits, and availability 
---

# Understand Microsoft Sentinel MCP server pricing, limits, and availability (preview)

> [!IMPORTANT]
> Microsoft Sentinel MCP server is currently in preview.
> This information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, expressed or implied, with respect to the information provided here.

This article provides you with information on pricing, limits, and availability when setting up and using Microsoft Sentinel's Model Context Protocol (MCP) collection of security tools.

## Pricing and billing

Pricing in Microsoft Sentinel is based on the tier that the data is ingested into. The **data lake tier** is a cost-effective option for ingesting secondary security data and querying security data over long term. In this tier, Microsoft Sentinel's unified MCP server interface is offered **at no additional cost**. You're charged for invoking tools that search and retrieve data using Kusto Query Language (KQL) queries from Microsoft Sentinel data lake—using Microsoft Sentinel data lake's billing model, you pay as you go for queries that retrieve data. [Read more about Microsoft Sentinel data lake’s pricing here](../billing.md#data-lake-tier).

## Quotas and limits

All [service parameters and limits for Microsoft Sentinel data lake](sentinel-lake-service-limits.md#service-parameters-and-limits-for-tables-data-management-and-ingestion) also apply when using Microsoft Sentinel's MCP collection of tools. 

The following limits are specific to this service:

| Feature | Limits | 
|----------|----------|
| MCP streaming | 120 seconds | 
| Query window for tools | 800 characters |

## Language and region availability
Microsoft Sentinel’s collection of MCP tools supports English prompts only. For optimal performance, customers located in the following countries and regions can use Microsoft Sentinel's collection of MCP tools:

- Australia
- Canada
- Europe 
- India
- Japan
- Norway
- Southeast Asia
- Switzerland
- United Kingdom 
- United States

## Related content
- [Plan costs and understand Microsoft Sentinel pricing and billing](../billing.md)