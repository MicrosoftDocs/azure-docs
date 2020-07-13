



### Tune metric-level detecting configuration

On the left side of the page lays metric-level detecting configuration, you can update parameters to impact detecting results for all time series globally. There're three detecting methods been supported: smart detection, change threshold, hard threshold to support on different scenarios. 

- Smart detection method is powered by machine learning which learns series pattern from historical data and use the pattern for future detection. **Sensitivity** is the most important parameter to tune the detection results. By dragging it to a smaller or larger value, you will get different results instantly from the visualization on the right. Choose one that suits for your scenario and save it. 

- Change threshold method is normally used in scenario that metric data normally stays around a certain range and doesn't expect to have obvious change over time. The threshold is set according to **Change percentage**. The change is updated instantly as well. 

- Hard threshold method is the basic method been used in traditional anomaly detection. You're able to set a upper bound and/or a lower bound to determine expected value range. Any points fall out of the boundary will be identified as an anomaly. 

There're additional parameters like 'Direction', 'Valid anomaly'... which could be leveraged to tune and identify a true anomaly combined with business scenario. 

Project "Gualala" support combinations of different detecting configurations. For example to combine 'Smart detection' and 'Hard threshold' to filter out tiny anomalies without real business impact. You can even specify the operator to be used for either 'And' or 'OR'. 

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

