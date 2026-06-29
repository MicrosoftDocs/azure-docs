---
author: maud-lv
ms.service: azure-managed-grafana
ms.topic: include
ms.date: 06/24/2026
ms.author: malev
---

> [!NOTE]
The Essential tier is deprecated. Existing Essential instances continue to run during the transition period, but you can't create new Essential instances. The Essential tier is scheduled to retire on March 31, 2027.

| Limit                                | Description                                                                                                                                                          | Essential (deprecated; existing instances only) | Standard X1            | Standard X2            |
|--------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------|------------------------|------------------------|
| Alert rules                          | Maximum number of alert rules that you can create.                                                                                                                   | Not supported          | 500 per instance       | 1000 per instance      |
| Memory for Grafana instance          | Amount of memory for Grafana in your dedicated instance.                                                                                                             | Basic                  | Standard               | Expanded               | 
| Dashboards                           | Maximum number of dashboards that you can create.                                                                                                                    | 20 per instance        | Unlimited              | Unlimited              |
| Data sources                         | Maximum number of data sources that you can create.                                                                                                                   | 5 per instance         | Unlimited              | Unlimited              |
| API keys                             | Maximum number of API keys that you can create.                                                                                                                      | 2 per instance         | 100 per instance       | 100 per instance       |
| Data query timeout                   | Maximum wait duration for the reception of data query response headers, before Grafana times out.                                                                    | 200 seconds            | 200 seconds            | 200 seconds            |
| Data source query size               | Maximum number of bytes that are read or accepted from responses of outgoing HTTP requests.                                                                             | 80 MB                  | 80 MB                  | 80 MB                  |
| Render image or PDF report wait time | Maximum duration for an image or report PDF rendering request to complete before Grafana times out.                                                                  | Not supported          | 220 seconds            | 220 seconds            |
| Instance count                       | Maximum number of instances in a single subscription per Azure region.                                                                                               | 1                      | 50                     | 50                     |
| Requests per IP                      | Maximum number of requests per IP per second.                                                                                                                        | 90 requests per second | 90 requests per second | 90 requests per second |
| Requests per HTTP host               | Maximum number of requests per HTTP host per second. The HTTP host stands for the Host header in incoming HTTP requests, which can describe each unique host client. | 45 requests per second | 45 requests per second | 45 requests per second |
