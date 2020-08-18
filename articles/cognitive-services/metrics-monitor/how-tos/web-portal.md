---
title: How to configure your Metrics Monitor instance using the web portal
titleSuffix: Azure Cognitive Services
description: How to configure your Metrics Monitor instance using the web portal
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: 
ms.topic: conceptual
ms.date: 08/17/2020
ms.author: aahi
---

## How to configure your Metrics Monitor instance using the web portal

Use this article to start configuring your Metrics Monitor instance using the web portal. 

### Tune metric-level detecting configuration

On the left side of the page lays metric-level detecting configuration, you can update parameters to impact detecting results for all time series globally. There are three detecting methods: *smart detection*, *change threshold*, and *hard threshold*:

- Smart detection is powered by machine learning that learns patterns from historical data, and uses them for future detection. **Sensitivity** is the most important parameter to tune the detection results. You can drag it to a smaller or larger value to affect the visualization on the right side of the page. Choose one that suits for your scenario and save it. 

- *Change threshold* is normally used when metric data generally stays around a certain range. The threshold is set according to **Change percentage**. 

- *Hard threshold* is a basic method for anomaly detection. You're able to set a upper bound and/or a lower bound to determine expected value range. Any points fall out of the boundary will be identified as an anomaly. 

There are additional parameters like *Direction*, and *valid anomaly* that can be used to further tune the configuration. You can combine different detection methods as well. 

![Configuration combination](../media/config_combination.png "Configuration combination")

### Tune detecting configuration for specific series or group of series

Sometimes series pattern or criteria on determining an anomaly may not be the same for all time series in one metric. Tuning for specific series or group of series is required. 

Click 'Advanced settings' in detecting configuration section, a pop-up window will be displayed. There're two sections named 'Configuration for series group' and 'Configuration for specific series'. Click '+' button to create a group-level/ series-level configuration. 

![Advanced configuration](../media/advanced_configuration.png "Advanced configuration")

Parameters to be set for group-level/ series-level configuration are similar with metric-level configuration. But you may need to specify at least one dimension value for group-level configuration to identify a group of series. And specify all dimension values for series-level configuration to identify a specific series.

## View diagnostic insights

With fine-tuned detecting configuration, anomalies that detected mostly reflect real business issues. Project "Gualala" performs analysis on multi-dimensional metrics, like anomaly clustering, incident correlation and root cause digging. Those are been exposed as **diagnostics insights** by a set of powerful features. 

To view the diagnostic insights, you can just click on the red dots on time series visualizations which stand for anomalies that detected. A pop-up window will be displayed with a link to incident analysis page. 

![Incident link](../media/incident_link.png "Incident link")

You will be pivoted to the incident analysis page which the anomaly belongs to with bunch of diagnostics insights. At the top, there're some statistics about the incident like 'Severity', 'Anomalies involved', and incident impacted 'Start time' and 'End time'. 

Below that shows ancestor anomaly of the incident and automated root cause advice. This automated root cause advice is analyzed upon diagnosing tree through all related anomalies on deviation, distribution and contribution to parent anomalies, which would most likely to be the root cause of the incident. 

![Incident diagnostic](../media/incident_diagnostic.png "Incident diagnostic")

Based on these, you can already get a straightforward view of what is happening and the impact of the incident as well as the most potential root cause. So that immediate action could be taken to resolve incident as soon as possible. 

But you can also pivot across more diagnostics insights leveraging additional features to drill down anomalies by dimension, view similar anomalies and do comparison across metrics. Please find more at [Diagnose workflow](../howto/diagnose/diagnose-workflows.md). 

## Subscribe anomalies for notification

If you'd like to get noticed in near real time whenever an anomaly is detected, you can subscribe the metric for anomalies. There're two major steps:

### Step 1: Create a hook

A hook is the entry point for all the information you care and the channel to escalate an anomaly. This is the prerequisite to get anomaly notification. Currently, we only support Web Hook for anomalies that detected.For details on how to create a hook, please refer to [create a hook](../howto/alerts/create-hooks.md). 

### Step 2: Set up alert settings

An alert setting defines the rule that how the alert notification should be sent, which should be sent and which not. You can set multiple alert settings for different monitoring scenarios. 

There're two major parts on settings, one is 'Alert for' which specifies the scope to be applied, the other is 'Filter anomaly options' which defines the rule on what anomalies to be noticed. 

For more detail, please refer to [add alert settings](../howto/alerts/add-alert-settings.md). 

