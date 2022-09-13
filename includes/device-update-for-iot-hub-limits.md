---
author: vimeht
ms.author: vimeht
ms.date: 7/8/2021
ms.topic: include
ms.service: iot-hub-device-update
---

> [!NOTE]
> When a given resource or operation doesn't have adjustable limits, the default and the maximum limits are the same. When the limit can be adjusted, the following table includes both the default limit and maximum limit. The limit can be raised above the default limit but not above the maximum limit.
>
> If you want to raise the limit or quota above the default limit, open an [online customer support request](https://azure.microsoft.com/support/options/).

This table provides the limits for the Device Update for IoT Hub resource in Azure Resource Manager:

| Resource |  Limit | Adjustable? |
| --- | --- | --- |
| Accounts per subscription | Default: 2<br>Maximum: 25 | Yes |
| Instances per account | Default: 2<br>Maximum: 25 | Yes |
| Length of account name | 3-24 characters | No |
| Length of instance name | 3-36 characters | No |

This table provides the various limits associated with the operations within Device Update for IoT Hub:

| Operation | Limit | Adjustable? |
| --- | --- | --- |
| Number of devices per instance | 10,000 | No |
| Number of update providers per instance | 25 | No |
| Number of update names per provider per instance | 25 | No |
| Number of update versions per update provider and name per instance | 100 | No |
| Total number of updates per instance | 100 | No |
| Maximum single update file size | 2 GB | No |
| Maximum combined size of all files in a single import action | 2 GB | No |
| Number of device groups per instance | 75 | No |
