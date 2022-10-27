---
title: Azure Monitor glossary of important terms
description: A list of the most important terms needed to understand the Azure Monitor product and related monitoring landscape 
ms.topic: conceptual
ms.date: 10/03/2022
---

# Azure Monitor terms glossary

This article is a listing of important terms useful when understanding Azure Monitor. The terms are not organized purley alphabetically, but rather by how related they are to each other. To find a particular term, search this page in your browser. 

telemetry - 

**Azure Monitor**  - A group of services marketed by Microsoft that assists in monitoring Azure services and infrastructure. For more information, see 

**Azure Monitor Logs** - A queryable store that is part of the Azure Monitor data platform. Its main store for log data produced by Azure Monitor and other sources routed to it. Supports a subset of the Kusto query language. The capital "Logs" in the name implies that it's a feature of Azure Monitor vs. the general term "logs", which refers to any type of log data.

**Azure Monitor Metrics** - A time series database where Azure Monitor sto

OTEL (Open Telemetry)- Open Telemetry.  OpenTelemetry, also known as OTel for short, is a vendor-neutral open-source Observability framework for instrumenting, generating, collecting, and exporting telemetry data such as traces, metrics, logs. As an industry-standard it is natively supported by a number of vendors. See https://opentelemetry.io/docs/

Log Analytics - 

Metrics Explorer - 

Change Analysis - 

alerts 
 (list the features of alerts here. )

Insights - 

Workbooks - 

Dashboards - 

PowerBI - 

Grafana - 

Agent -

Application Insights

SLI

SLO

SLI - From [OTEL](https://opentelemetry.io/docs/concepts/observability-primer/) or Service Level Indicator, represents a measurement of a service’s behavior. A good SLI measures your service from the perspective of your users. An example SLI can be the speed at which a web page loads.

SLO from OTEL or Service Level Objective, is the means by which reliability is communicated to an organization/other teams. This is accomplished by attaching one or more SLIs to business value.

Log - From OTEL is a timestamped message emitted by services or other components.

A Distributed Trace - From OTEL, more commonly known as a Trace, records the paths taken by requests (made by an application or end-user) as they propagate through multi-service architectures, like microservice and serverless applications.

## Next steps

