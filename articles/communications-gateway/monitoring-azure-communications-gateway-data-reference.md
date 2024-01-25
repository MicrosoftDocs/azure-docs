---
title: Monitoring Azure Communications Gateway data reference 
description: Important reference material needed when you monitor Azure Communications Gateway 
author: rcdun
ms.author: rdunstan
ms.topic: reference
ms.service: communications-gateway
ms.custom: subject-monitoring
ms.date: 01/25/2024
---


# Monitoring Azure Communications Gateway data reference

Learn about the data and resources collected by Azure Monitor from your Azure Communications Gateway workspace. See [Monitoring Azure Communications Gateway](monitor-azure-communications-gateway.md) for details on collecting and analyzing monitoring data for Azure Communications Gateway.

## Metrics

This section lists all the automatically collected metrics collected for Azure Communications Gateway. The resource provider for these metrics is `Microsoft.VoiceServices/communicationsGateways`.

### Error metrics

| Metric | Unit | Description |
|:-------|:----|:------------|
|Active Call Failures | Percentage| Percentage of active calls that fail. This metric includes, for example, calls where the media is dropped and calls that are torn down unexpectedly.|


### Traffic metrics

| Metric | Unit | Description |
|:-------|:----|:------------|
| Active Calls | Count | Count of the total number of active calls. |
| Active Emergency Calls | Count | Count of the total number of active emergency calls.|

### Connectivity metrics

| Metric | Unit | Description |
|:-------|:----|:------------|
| SIP 2xx Responses Received | Count | Count of the total number of 2xx OPTIONS and INVITEs received.
| SIP 2xx Responses Sent | Count | Count of the total number of 2xx OPTIONS and INVITEs sent.|
| SIP 3xx Responses Received | Count | Count of the total number of 3xx OPTIONS and INVITEs received.
| SIP 3xx Responses Sent | Count | Count of the total number of 3xx OPTIONS and INVITEs sent.|
| SIP 4xx Responses Received | Count | Count of the total number of 4xx OPTIONS and INVITEs received.
| SIP 4xx Responses Sent | Count | Count of the total number of 4xx OPTIONS and INVITEs sent.|
| SIP 5xx Responses Received | Count | Count of the total number of 5xx OPTIONS and INVITEs received.
| SIP 5xx Responses Sent | Count | Count of the total number of 5xx OPTIONS and INVITEs sent.|
| SIP 6xx Responses Received | Count | Count of the total number of 6xx OPTIONS and INVITEs received.
| SIP 6xx Responses Sent | Count | Count of the total number of 6xx OPTIONS and INVITEs sent.|

## Metric Dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

Azure Communications Gateway has the following dimensions associated with its metrics.

| Dimension Name | Description |
| ------------------- | ----------------- |
| **Region** | The Service Locations defined in your Azure Communications Gateway resource. |
| **OPTIONS or INVITE** | The type of SIP message being sent and received:<br>- SIP OPTIONS messages sent and received by your Azure Communications Gateway resource to monitor its connectivity to its peers<br>- SIP INVITE messages sent and received by your Azure Communications Gateway resource. |


## Next steps

- See [Monitoring Azure Communications Gateway](monitor-azure-communications-gateway.md) for a description of monitoring Azure Communications Gateway.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.