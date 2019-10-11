
# How to monitor Azure Machine Learning workspace metrics

Learn how to monitor and create alerts for metrics reported by your Azure Machine Learning workspace. Azure Monitor enables you to monitor the metrics for your Azure services, create dashboards, and alerts. For Azure Machine Learning service, the following metrics are available:

| Category | Metric | Description |
| ----- | ----- | ----- |
| Model | Model deploy failed | The number of model deployments that failed. |
| &nbsp; | Model deploy started | The number of model deployments started. |
| &nbsp; | Model deploy succeeded | The number of model deployments that succeeded. |
| &nbsp; | Model register failed | The number of model registrations that failed. |
| &nbsp; | Model register succeeded | The number of model registrations that succeeded. |
| Quota | Active cores | The number of active compute cores. |
| &nbsp; | Active nodes | The number of active nodes. |
| &nbsp; | Idle cores | The number of idle compute cores. |
| &nbsp; | Idle nodes | The number of idle compute nodes. |
| &nbsp; | Leaving cores | |
| &nbsp; | Leaving nodes | |
| &nbsp; | Preempted cores | |
| &nbsp; | Preempted nodes | |
| &nbsp; | Quota utilization percentage | |
| &nbsp; | Total cores | The total cores. |
| &nbsp; | Total nodes | The total nodes. |
| &nbsp; | Unusable cores | |
| &nbsp; | Unusable nodes | |
| Run | Completed runs | The number of completed runs. |
| &nbsp; | Failed runs | The number of failed runs. |
| &nbsp; | Started runs | The number of started runs. |

> [!NOTE]
> The value of each metric is dependent on the aggregate and the time period. For example, if the aggregate is __avg__, then the average for the selected time period is displayed.

## Analyze data

To explorer the metrics for your workspace you can use the __Metrics Explorer__. This allows you to plot charts, visually correlate trends, and investigate spikes and dips in metrics' values. You can access the Metrics Explorer using one of the following methods from the [Azure portal](https://portal.azure.com):

+ Select your workspace and then select __Metrics__ from the __Monitoring__ section of the sidebar. This scopes the metrics to the selected workspace.

    ![Image of the metrics section of the workspace]()

+ Select __Monitor__ and then __Metrics__ from the left side of the Azure portal. From here, you can use the filter to select the Azure Machine Learning workspace to monitor.

    ![Image of the monitoring metrics]()

Once in Metrics Explorer, use the filter to select the metric you are interested in, and select a time range to begin your investigation.

For more information on using the Metrics Explorer, see [Getting started with Metrics Explorer](/azure/azure-monitor/platform/metrics-charts).

