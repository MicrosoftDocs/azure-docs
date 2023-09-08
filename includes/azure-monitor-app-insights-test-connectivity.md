---
title: "Include file to reference troubleshooting article to test connectivity between your application host and the ingestion service"
description: "include file"
services: azure-monitor
tags: application-insights
ms.topic: "include"
ms.date: 10/04/2022
ms.custom: "include file"
---

### Test connectivity between your application host and the ingestion service

Application Insights SDKs and agents send telemetry to get ingested as REST calls to our ingestion endpoints. You can test connectivity from your web server or application host machine to the ingestion service endpoints by using raw REST clients from PowerShell or curl commands. See [Troubleshoot missing application telemetry in Azure Monitor Application Insights](/troubleshoot/azure/azure-monitor/app-insights/investigate-missing-telemetry).