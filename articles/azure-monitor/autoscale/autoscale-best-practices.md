---
title: Best practices for autoscale
description: Autoscale patterns in the Web Apps feature of Azure App Service, Azure Virtual Machine Scale Sets, and Azure Cloud Services.
author: EdB-MSFT
ms.author: edbaynash
ms.topic: conceptual
ms.date: 09/13/2022
ms.subservice: autoscale
ms.reviewer: akkumari
---
# Best practices for autoscale
Azure Monitor autoscale applies only to [Azure Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/), [Azure Cloud Services](https://azure.microsoft.com/services/cloud-services/), the [Web Apps feature of Azure App Service](https://azure.microsoft.com/services/app-service/web/), and [Azure API Management](../../api-management/api-management-key-concepts.md).

## Autoscale concepts
* A resource can have only *one* autoscale setting.
* An autoscale setting can have one or more profiles, and each profile can have one or more autoscale rules.
* An autoscale setting scales instances horizontally, which is *out* by increasing the instances and *in* by decreasing the number of instances.
* An autoscale setting has a maximum, minimum, and default value of instances.
* An autoscale job always reads the associated metric to scale by, checking if it has crossed the configured threshold for scale-out or scale-in. You can view a list of metrics that autoscale can scale by at [Azure Monitor autoscaling common metrics](autoscale-common-metrics.md).
* All thresholds are calculated at an instance level. An example is "scale out by one instance when average CPU > 80% when instance count is 2." It means scale-out when the average CPU across all instances is greater than 80%.
* All autoscale failures are logged to the activity log. You can then configure an [activity log alert](../alerts/activity-log-alerts.md) so that you can be notified via email, SMS, or webhooks whenever there's an autoscale failure.
* Similarly, all successful scale actions are posted to the activity log. You can then configure an activity log alert so that you can be notified via email, SMS, or webhooks whenever there's a successful autoscale action. You can also configure email or webhook notifications to get notified for successful scale actions via the notifications tab on the autoscale setting.

## Autoscale best practices
Use the following best practices as you use autoscale.

### Ensure the maximum and minimum values are different and have an adequate margin between them
If you have a setting that has minimum=2, maximum=2, and the current instance count is 2, no scale action can occur. Keep an adequate margin between the maximum and minimum instance counts, which are inclusive. Autoscale always scales between these limits.

### Manual scaling is reset by autoscale minimum and maximum
If you manually update the instance count to a value above or below the maximum, the autoscale engine automatically scales back to the minimum (if below) or the maximum (if above). For example, you set the range between 3 and 6. If you have one running instance, the autoscale engine scales to three instances on its next run. Likewise, if you manually set the scale to eight instances, on the next run autoscale will scale it back to six instances on its next run. Manual scaling is temporary unless you also reset the autoscale rules.

### Always use a scale-out and scale-in rule combination that performs an increase and decrease
If you use only one part of the combination, autoscale only takes action in a single direction (scale out or in) until it reaches the maximum, or minimum instance counts, as defined in the profile. This situation isn't optimal. Ideally, you want your resource to scale out at times of high usage to ensure availability. Similarly, at times of low usage, you want your resource to scale in so that you can realize cost savings.

When you use a scale-in and scale-out rule, ideally use the same metric to control both. Otherwise, it's possible that the scale-in and scale-out conditions could be met at the same time and result in some level of flapping. For example, we don't recommend the following rule combination because there's no scale-in rule for memory usage:

* If CPU > 90%, scale out by 1
* If Memory > 90%, scale out by 1
* If CPU < 45%, scale in by 1

In this example, you can have a situation in which the memory usage is over 90% but the CPU usage is under 45%. This scenario can lead to flapping for as long as both conditions are met.

### Choose the appropriate statistic for your diagnostics metric
For diagnostics metrics, you can choose among **Average**, **Minimum**, **Maximum**, and **Total** as a metric to scale by. The most common statistic is **Average**.

### Considerations for scaling threshold values for special metrics
For special metrics such as an Azure Storage or Azure Service Bus queue length metric, the threshold is the average number of messages available per current number of instances. Carefully choose the threshold value for this metric.

Let's illustrate it with an example to ensure you understand the behavior better:

* Increase instances by 1 count when Storage queue message count >= 50
* Decrease instances by 1 count when Storage queue message count <= 10

Consider the following sequence:

1. There are two Storage queue instances.
1. Messages keep coming and when you review the Storage queue, the total count reads 50. You might assume that autoscale should start a scale-out action. However, notice that it's still 50/2 = 25 messages per instance. So, scale-out doesn't occur. For the first scale-out action to happen, the total message count in the Storage queue should be 100.
1. Next, assume that the total message count reaches 100.
1. A third Storage queue instance is added because of a scale-out action. The next scale-out action won't happen until the total message count in the queue reaches 150 because 150/3 = 50.
1. Now the number of messages in the queue gets smaller. With three instances, the first scale-in action happens when the total messages in all queues add up to 30 because 30/3 = 10 messages per instance, which is the scale-in threshold.

### Considerations for scaling when multiple rules are configured in a profile

There are cases where you might have to set multiple rules in a profile. The following autoscale rules are used by the autoscale engine when multiple rules are set:

- On *scale-out*, autoscale runs if any rule is met.
- On *scale-in*, autoscale requires all rules to be met.

To illustrate, assume that you have four autoscale rules:

* If CPU < 30%, scale in by 1
* If Memory < 50%, scale in by 1
* If CPU > 75%, scale out by 1
* If Memory > 75%, scale out by 1

Then the following action occurs:

* If CPU is 76% and Memory is 50%, we scale out.
* If CPU is 50% and Memory is 76%, we scale out.

On the other hand, if CPU is 25% and Memory is 51%, autoscale *doesn't* scale in. To scale in, CPU must be 29% and Memory 49%.

### Always select a safe default instance count

The default instance count is important because autoscale scales your service to that count when metrics aren't available. As a result, select a default instance count that's safe for your workloads.

### Configure autoscale notifications

Autoscale posts to the activity log if any of the following conditions occur:

* Autoscale issues a scale operation.
* Autoscale service successfully completes a scale action.
* Autoscale service fails to take a scale action.
* Metrics aren't available for autoscale service to make a scale decision.
* Metrics are available (recovery) again to make a scale decision.
* Autoscale detects flapping and aborts the scale attempt. You see a log type of `Flapping` in this situation. If you see this log type, consider whether your thresholds are too narrow.
* Autoscale detects flapping but is still able to successfully scale. You see a log type of `FlappingOccurred` in this situation. If you see this log type, the autoscale engine has attempted to scale (for example, from four instances to two) but has determined that this change would cause flapping. Instead, the autoscale engine has scaled to a different number of instances (for example, using three instances instead of two), which no longer causes flapping, so it has scaled to this number of instances.

You can also use an activity log alert to monitor the health of the autoscale engine. One example shows how to [create an activity log alert to monitor all autoscale engine operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/monitor-autoscale-alert). Another example shows how to [create an activity log alert to monitor all failed autoscale scale-in/scale-out operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/monitor-autoscale-failed-alert).

In addition to using activity log alerts, you can also configure email or webhook notifications to get notified for scale actions via the notifications tab on the autoscale setting.

## Send data securely by using TLS 1.2

To ensure the security of data in transit to Azure Monitor, we strongly encourage you to configure the agent to use at least Transport Layer Security (TLS) 1.2. Older versions of TLS/Secure Sockets Layer (SSL) have been found to be vulnerable. Although they still currently work to allow backwards compatibility, we *don't* recommend them. The industry is quickly moving to abandon support for these older protocols.

The [PCI Security Standards Council](https://www.pcisecuritystandards.org/) has set a deadline of [June 30, 2018](https://www.pcisecuritystandards.org/pdfs/PCI_SSC_Migrating_from_SSL_and_Early_TLS_Resource_Guide.pdf), to disable older versions of TLS/SSL and upgrade to more secure protocols. After Azure drops legacy support, if your agents can't communicate over at least TLS 1.2, you won't be able to send data to Azure Monitor Logs.

We recommend that you *don't* explicitly set your agent to only use TLS 1.2 unless necessary. Allowing the agent to automatically detect, negotiate, and take advantage of future security standards is preferable. Otherwise, you might miss the added security of the newer standards and possibly experience problems if TLS 1.2 is ever deprecated in favor of those newer standards.

## Next steps
- [Autoscale flapping](./autoscale-flapping.md)
- [Create an activity log alert to monitor all autoscale engine operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/monitor-autoscale-alert)
- [Create an activity log alert to monitor all failed autoscale scale-in/scale-out operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/monitor-autoscale-failed-alert)