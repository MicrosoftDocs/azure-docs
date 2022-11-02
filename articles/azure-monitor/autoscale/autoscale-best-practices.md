---
title: Best practices for autoscale
description: Autoscale patterns in Azure for Web Apps, virtual machine scale sets, and Cloud Services
ms.topic: conceptual
ms.date: 09/13/2022
ms.subservice: autoscale
ms.reviewer: riroloff
---
# Best practices for Autoscale
Azure Monitor autoscale applies only to [Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/), [Cloud Services](https://azure.microsoft.com/services/cloud-services/), [App Service - Web Apps](https://azure.microsoft.com/services/app-service/web/), and [API Management services](../../api-management/api-management-key-concepts.md).

## Autoscale concepts
* A resource can have only *one* autoscale setting
* An autoscale setting can have one or more profiles and each profile can have one or more autoscale rules.
* An autoscale setting scales instances horizontally, which is *out* by increasing the instances and *in* by decreasing the number of instances.
  An autoscale setting has a maximum, minimum, and default value of instances.
* An autoscale job always reads the associated metric to scale by, checking if it has crossed the configured threshold for scale-out or scale-in. You can view a list of metrics that autoscale can scale by at [Azure Monitor autoscaling common metrics](autoscale-common-metrics.md).
* All thresholds are calculated at an instance level. For example, "scale out by one instance when average CPU > 80% when instance count is 2", means scale-out when the average CPU across all instances is greater than 80%.
* All autoscale failures are logged to the Activity Log. You can then configure an [activity log alert](../alerts/activity-log-alerts.md) so that you can be notified via email, SMS, or webhooks whenever there's an autoscale failure.
* Similarly, all successful scale actions are posted to the Activity Log. You can then configure an activity log alert so that you can be notified via email, SMS, or webhooks whenever there's a successful autoscale action. You can also configure email or webhook notifications to get notified for successful scale actions via the notifications tab on the autoscale setting.

## Autoscale best practices
Use the following best practices as you use autoscale.

### Ensure the maximum and minimum values are different and have an adequate margin between them
If you have a setting that has minimum=2, maximum=2 and the current instance count is 2, no scale action can occur. Keep an adequate margin between the maximum and minimum instance counts, which are inclusive. Autoscale always scales between these limits.

### Manual scaling is reset by autoscale min and max
If you manually update the instance count to a value above or below the maximum, the autoscale engine automatically scales back to the minimum (if below) or the maximum (if above). For example, you set the range between 3 and 6. If you have one running instance, the autoscale engine scales to three instances on its next run. Likewise, if you manually set the scale to eight instances, on the next run autoscale will scale it back to six instances on its next run.  Manual scaling is temporary unless you reset the autoscale rules as well.

### Always use a scale-out and scale-in rule combination that performs an increase and decrease
If you use only one part of the combination, autoscale will only take action in a single direction (scale out, or in) until it reaches the maximum, or minimum instance counts, as defined in the profile. This isn't optimal, ideally you want your resource to scale up at times of high usage to ensure availability. Similarly, at times of low usage you want your resource to scale down, so you can realize cost savings.

When you use a scale-in and scale-out rule, ideally use the same metric to control both. Otherwise, it’s possible that the scale-in and scale-out conditions could be met at the same time resulting in some level of flapping. For example, the following rule combination isn't* recommended because there's no scale-in rule for memory usage:

* If CPU > 90%, scale-out by 1
* If Memory > 90%, scale-out by 1
* If CPU < 45%, scale-in by 1

In this example, you can have a situation in which the memory usage is over 90% but the CPU usage is under 45%. This can lead to flapping for as long as both conditions are met.

### Choose the appropriate statistic for your diagnostics metric
For diagnostics metrics, you can choose among *Average*, *Minimum*, *Maximum* and *Total* as a metric to scale by. The most common statistic is *Average*.

### Considerations for scaling threshold values for special metrics
For special metrics such as Storage or Service Bus Queue length metric, the threshold is the average number of messages available per current number of instances. Carefully choose the threshold value for this metric.

Let's illustrate it with an example to ensure you understand the behavior better.

* Increase instances by 1 count when Storage Queue message count >= 50
* Decrease instances by 1 count when Storage Queue message count <= 10

Consider the following sequence:

1. There are two storage queue instances.
2. Messages keep coming and when you review the storage queue, the total count reads 50. You might assume that autoscale should start a scale-out action. However, note that it's still 50/2 = 25 messages per instance. So, scale-out doesn't occur. For the first scale-out to happen, the total message count in the storage queue should be 100.
3. Next, assume that the total message count reaches 100.
4. A third storage queue instance is added due to a scale-out action.  The next scale-out action won't happen until the total message count in the queue reaches 150 because 150/3 = 50.
5. Now the number of messages in the queue gets smaller. With three instances, the first scale-in action happens when the total messages in all queues add up to 30 because 30/3 = 10 messages per instance, which is the scale-in threshold.

### Considerations for scaling when multiple rules are configured in a profile

There are cases where you may have to set multiple rules in a profile. The following autoscale rules are used by the autoscale engine when multiple rules are set.

On *scale-out*, autoscale runs if any rule is met.
On *scale-in*, autoscale require all rules to be met.

To illustrate, assume that you have the following four autoscale rules:

* If CPU < 30%, scale-in by 1
* If Memory < 50%, scale-in by 1
* If CPU > 75%, scale-out by 1
* If Memory > 75%, scale-out by 1

Then the follow occurs:

* If CPU is 76% and Memory is 50%, we scale out.
* If CPU is 50% and Memory is 76%, we scale out.

On the other hand, if CPU is 25% and memory is 51% autoscale does **not** scale-in. In order to scale-in, CPU must be 29% and Memory 49%.

### Always select a safe default instance count

The default instance count is important because autoscale scales your service to that count when metrics aren't available. Therefore, select a default instance count that's safe for your workloads.

### Configure autoscale notifications

Autoscale will post to the Activity Log if any of the following conditions occur:

* Autoscale issues a scale operation.
* Autoscale service successfully completes a scale action.
* Autoscale service fails to take a scale action.
* Metrics aren't available for autoscale service to make a scale decision.
* Metrics are available (recovery) again to make a scale decision.
* Autoscale detects flapping and aborts the scale attempt. You'll see a log type of `Flapping` in this situation. If you see this, consider whether your thresholds are too narrow.
* Autoscale detects flapping but is still able to successfully scale. You'll see a log type of `FlappingOccurred` in this situation. If you see this, the autoscale engine has attempted to scale (for example, from 4 instances to 2), but has determined that this would cause flapping. Instead, the autoscale engine has scaled to a different number of instances (for example, using 3 instances instead of 2), which no longer causes flapping, so it has scaled to this number of instances.

You can also use an Activity Log alert to monitor the health of the autoscale engine. Here are examples to [create an Activity Log Alert to monitor all autoscale engine operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/monitor-autoscale-alert) or to [create an Activity Log Alert to monitor all failed autoscale scale in/scale out operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/monitor-autoscale-failed-alert).

In addition to using activity log alerts, you can also configure email or webhook notifications to get notified for scale actions via the notifications tab on the autoscale setting.

## Send data securely using TLS 1.2

To ensure the security of data in transit to Azure Monitor, we strongly encourage you to configure the agent to use at least Transport Layer Security (TLS) 1.2. Older versions of TLS/Secure Sockets Layer (SSL) have been found to be vulnerable and while they still currently work to allow backwards compatibility, they are **not recommended**, and the industry is quickly moving to abandon support for these older protocols.

The [PCI Security Standards Council](https://www.pcisecuritystandards.org/) has set a deadline of [June 30th, 2018](https://www.pcisecuritystandards.org/pdfs/PCI_SSC_Migrating_from_SSL_and_Early_TLS_Resource_Guide.pdf) to disable older versions of TLS/SSL and upgrade to more secure protocols. Once Azure drops legacy support, if your agents can't communicate over at least TLS 1.2 you wouldn't be able to send data to Azure Monitor Logs.

We recommend you do NOT explicit set your agent to only use TLS 1.2 unless absolutely necessary. Allowing the agent to automatically detect, negotiate, and take advantage of future security standards is preferable. Otherwise you may miss the added security of the newer standards and possibly experience problems if TLS 1.2 is ever deprecated in favor of those newer standards.


## Next Steps
- [Autoscale flapping](./autoscale-flapping.md)
- [Create an Activity Log Alert to monitor all autoscale engine operations on your subscription.](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/monitor-autoscale-alert)
- [Create an Activity Log Alert to monitor all failed autoscale scale in/scale out operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/monitor-autoscale-failed-alert)