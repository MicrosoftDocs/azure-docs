---
title: Monitoring metrics for Azure Application Gateway Web Application Firewall metrics
description: This article describes the Azure Application Gateway WAF monitoring metrics.
services: appgateway
author: olotolor
manager: gunjan.jain 
ms.service: waf
ms.topic: how-to
ms.date: 03/11/2022
ms.author: olotolor
---

## Metrics supported by Application Gateway V1 SKU

### Application Gateway metrics

For Application Gateway, the following metrics are available:

|**Metrics**|**Description**|
| :------------------| :-------------------------------------|
|**CPU Utilization**| Displays the utilization of the CPUs allocated to the Application Gateway.  Under normal conditions, CPU usage should not regularly exceed 90%, as this may cause latency in the websites hosted behind the Application Gateway and disrupt the client experience. You can indirectly control or improve CPU utilization by modifying the configuration of the Application Gateway by increasing the instance count or by moving to a larger SKU size, or doing both|
|**Current connections**|Count of current connections established with Application Gateway|
|**Failed Requests**|Number of requests that failed due to connection issues. This count includes requests that failed due to exceeding the "Request time-out" HTTP setting and requests that failed due to connection issues between Application gateway and backend. This count does not include failures due to no healthy backend being available. 4xx and 5xx responses from the backend are also not considered as part of this metric|
|**Response Status**|HTTP response status returned by Application Gateway. The response status code distribution can be further categorized to show responses in 2xx, 3xx, 4xx, and 5xx categories|
|**Throughput**|Number of bytes per second the Application Gateway has served|
|**Total Requests**|Count of successful requests that Application Gateway has served. The request count can be further filtered to show count per each/specific backend pool-http setting combination|

- **Web Application Firewall Blocked Requests Count**
- **Web Application Firewall Blocked Requests Distribution**
- **Web Application Firewall Total Rule Distribution**  

&nbsp
&nbsp
## Application Gateway WAF V2 Metrics  

 _New Metrics are only applicable to Core Rule Set >=CRS 3.2_  
 
 
|**Metrics**|**Description**|
| :------------------| :-------------------------------------|
|WAF Total Requests|Count of successful requests that WAF engine has served. The request count can be further filtered to show count per Action, Country/Region, Method, and Mode. |
|WAF Managed Rule Matches|Count of total requests that a managed rule has matched. The request count can be further filtered to show count per Action, Country/Region, Mode, Rule Group, and Rule Id|
|WAF Custom Rule Matches|Count of total requests that match a specific custom rule. The request count can be further filtered to show count per Action, Country/Region, Mode, Rule Group, and Rule Name|
|WAF Bot Protection Matches|Count of total requests that have been blocked or logged from malicious IP addresses. The IP addresses are sourced from the Microsoft Threat Intelligence feed. The request count can be further filtered to show count per Action, Country/Region, Bot Type, and Mode.|

<images>

 ## Access Application Gateway WAF Metrics in Azure portal

1. From the Azure portal menu, select **All Resources** >> **\<your-Application-Gateway-profile>**.

2. Under **Monitoring**, select **Metrics**:

3. In **Metrics**, select the metric to add:  
 
:::image type="content" source="../media/waf-appgateway-metrics/appgw-waf-metrics-1.png" alt-text="Screenshot of waf metrics page." lightbox="../media/waf-appgateway-metrics/appgw-waf-metrics-1-expanded.png":::
 
 
   
