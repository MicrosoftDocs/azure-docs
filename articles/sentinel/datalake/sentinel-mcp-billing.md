---
title: Microsoft Sentinel MCP server pricing, limits, and availability
titleSuffix: Microsoft Security  
description: Learn about the pricing, limits, and availability of using the different MCP collection of tools in Microsoft Sentinel 
author: poliveria
ms.topic: concept-article
ms.date: 12/09/2025
ms.author: pauloliveria
ms.service: microsoft-sentinel
ms.custom: references_regions

#customer intent: As a security analyst, I want to understand Microsoft Sentinel MCP server pricing, limits, and availability 
---

# Understand Microsoft Sentinel MCP server pricing, limits, and availability


This article provides information on pricing, limits, and availability when setting up and using Microsoft Sentinel's Model Context Protocol (MCP) collection of security tools.

## Pricing and billing

### Microsoft Sentinel data lake tools

Microsoft Sentinel pricing is based on the tier that you ingest data into. The **data lake tier** is a cost-effective option for ingesting secondary security data and querying security data over the long term. In this tier, Microsoft Sentinel's unified MCP server interface is offered **at no extra cost**. You pay for invoking tools that search and retrieve data by using Kusto Query Language (KQL) queries from Microsoft Sentinel data lake. With Microsoft Sentinel data lake's billing model, you pay as you go for queries that retrieve data. [Read more about Microsoft Sentinel data lake’s pricing here](../billing.md#data-lake-tier).

### Microsoft Sentinel entity analyzer tool
You pay for the KQL queries the [entity analyzer](sentinel-mcp-data-exploration-tool.md#entity-analyzer-preview)
performs over the Microsoft Sentinel data lake. AI compute used by the analyzer to reason over this data doesn't incur any cost.

### Triage tool

You can use the [triage tool collection](sentinel-mcp-triage-tool.md) at no extra cost, if you're onboarded to the required products and services.

## Quotas and limits

### Microsoft Sentinel data lake tools

All [service parameters and limits for Microsoft Sentinel data lake](sentinel-lake-service-limits.md#service-parameters-and-limits-for-tables-data-management-and-ingestion) also apply when you use Microsoft Sentinel's MCP collection of tools. 

The following limits are specific to Microsoft Sentinel data lake MCP tools:

| Feature | Limits | 
|----------|----------|
| MCP streaming | 120 seconds | 
| Query window for tools | 800 characters |

### Microsoft Sentinel entity analyzer tool
Each tenant can use the entity analyzer MCP tool up to the following limits:
- 100 total runs an hour
- 250 total runs a day 

### Triage tool
Regular API throttling applies to the tools in the triage tool collection. In addition, tools that call the advanced hunting API are bound by the existing advanced hunting quotas and service limits. [Learn more about advanced hunting quotas and usage parameters](/defender-xdr/advanced-hunting-limits#understand-advanced-hunting-quotas-and-usage-parameters)

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