---
title: How to use application insights in Azure Spring Cloud 
description: How to monitor using Application Insights Java agent.
author:  MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: how-to
ms.date: 12/04/2020
ms.custom: devx-track-java
---

# Application Insights Java In Process Agent (Preview)

This document explains how to monitor apps and microservices using the Application Insights Java agent.

With this feature you can:

* Search tracing data with different filters.
* View dependency map of microservices.
* Check request performance.
* Monitoring real-time live metrics.
* Check request failures.
* Check application metrics.

## Prerequisite

Enable the Application Insights Java agent using the following procedures.

## Enable Java in process agent

Enable Java in process agent preview feature using the following procedure.

1. Go to service overview page of your service instance.
2. Click `Application Insights` entry under monitoring blade.
3. Click `Enable Application Insights` button to enable `Application Insights` integration.
4. Select an existing Application Insights or create a new Application Insights.
5. Chick `Enable Java in-process agent (Preview)` to enable preview Java in-process agent feature. Here you can also customize sampling rate from 0 to 100.
6.  Click `Save` to save the change.

## Portal

1. Go to the service | Overview page and select Application Insights in the Monitoring section. 
2. Click `Enable Application Insights` to enable Application Insights on Azure Spring Cloud.
3. Click `Enable Java in-process agent(Preview)` to enable Java IPA preview feature. When ava IPA preview feature is enabled, you can configure one optional (default 10.0%) sampling rate.

  ![IPA 0](/spring-cloud-application-insights/insights-process-agent-0.PNG)

4. Click `Application Insights` to jump to the Overview page of Application Insights.

  ![IPA 1](/spring-cloud-application-insights/insights-process-agent-1.PNG)

## Using the Application Insights feature

When the Application Insights feature is enabled, you can:

* Click `Application Map` to see the status of calls between applications.

  ![IPA 2](/spring-cloud-application-insights/insights-process-agent-2.PNG)

* Click the link between customers-service and petclinic to see more details like query from SQL.

  ![IPA 3](/spring-cloud-application-insights/insights-process-agent-3.PNG)

* Click `Performance` to see the performance data of all applications' operations, as well as dependencies and roles.

  ![IPA 4](/spring-cloud-application-insights/insights-process-agent-4.PNG)

* Click `Live Metrics` to see the real time metrics for different dimensions.

  ![IPA 5](/spring-cloud-application-insights/insights-process-agent-5.PNG)

* Click `Failures` to see if something unexpected from your applications.

  ![IPA 6](/spring-cloud-application-insights/insights-process-agent-6.PNG)

* Finally, you can click `Metrics` from Application Insights portal and select `customer | azure.applicationInsights` namespace.

  ![IPA 7](/spring-cloud-application-insights/insights-process-agent-7.PNG)

## ARM Template
To use the Azure Resource Manager template, copy following content to `azuredeploy.json`.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.AppPlatform/Spring",
            "name": "customize this",
            "apiVersion": "2020-07-01",
            "location": "[resourceGroup().location]",
            "resources": [
                {
                    "type": "monitoringSettings",
                    "apiVersion": "2020-11-01-preview",
                    "name": "default",
                    "properties": {
                        "appInsightsInstrumentationKey": "00000000-0000-0000-0000-000000000000",
                        "appInsightsSamplingRate": 88.0
                    },
                    "dependsOn": [
                        "[resourceId('Microsoft.AppPlatform/Spring', 'customize this')]"
                    ]
                }
            ],
            "properties": {}
        }
    ]
}
```

Then apply ARM template with the CLI command:

```
az deployment group create --name "customize this" -g "customize this" --template-file ./azuredeploy.json
```

## See also