---
title: Metrics Advisor client libraries REST API
titleSuffix: Azure AI services
description: Use this quickstart to connect your applications to the Metrics Advisor API from Azure AI services.
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-metrics-advisor
ms.topic: quickstart
ms.date: 11/07/2022
ms.author: mbullwin
zone_pivot_groups: programming-languages-metrics-monitor
ms.custom: mode-api, devx-track-extended-java, devx-track-js, devx-track-python
---

# Quickstart: Use the client libraries or REST APIs to customize your solution

Get started with the Metrics Advisor REST API or client libraries. Follow these steps to install the package and try out the example code for basic tasks.

Use Metrics Advisor to perform:

* Add a data feed from a data source
* Check ingestion status
* Configure detection and alerts 
* Query the anomaly detection results
* Diagnose anomalies


::: zone pivot="programming-language-csharp"

[!INCLUDE [REST API quickstart](../includes/quickstarts/csharp.md)]

::: zone-end

::: zone pivot="programming-language-java"

[!INCLUDE [REST API quickstart](../includes/quickstarts/java.md)]

::: zone-end

::: zone pivot="programming-language-javascript"

[!INCLUDE [REST API quickstart](../includes/quickstarts/javascript.md)]

::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [REST API quickstart](../includes/quickstarts/python.md)]

::: zone-end

::: zone pivot="programming-language-rest-api"

[!INCLUDE [REST API quickstart](../includes/quickstarts/rest-api.md)]

::: zone-end

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../ai-services/multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../ai-services/multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

- [Use the web portal](web-portal.md)
- [Onboard your data feeds](../how-tos/onboard-your-data.md)
    - [Manage data feeds](../how-tos/manage-data-feeds.md)
    - [Configurations for different data sources](../data-feeds-from-different-sources.md)
- [Configure metrics and fine tune detection configuration](../how-tos/configure-metrics.md)
- [Adjust anomaly detection using feedback](../how-tos/anomaly-feedback.md)
