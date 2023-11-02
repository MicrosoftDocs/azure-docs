---
author: vimeht
ms.author: vimeht
ms.date: 9/14/2023
ms.topic: include
ms.service: iot-hub-device-update
---

> [!NOTE]
> When a given resource or operation doesn't have adjustable limits, the default and the maximum limits are the same. When the limit can be adjusted, the following table includes both the default limit and maximum limit. The limit can be raised above the default limit but not above the maximum limit. Limits can only be adjusted for the Standard SKU. Limit adjustment requests are not accepted for Free SKU. Limit adjustment requests are evaluated on a case-by-case basis and approvals are not guaranteed. Additionally, Free SKU instances cannot be upgraded to Standard SKU instances.
>
> If you want to raise the limit or quota above the default limit, open an [online customer support request](https://azure.microsoft.com/support/options/).

This table provides the limits for the Device Update for IoT Hub resource in Azure Resource Manager:

| Resource |  Standard SKU Limit | Free SKU Limit | Adjustable for Standard SKU? |
| --- | --- | --- | --- | 
| Accounts per subscription | 50 | 1 | No |
| Instances per account | 50 | 1 | No |
| Length of account name | 3-24 characters | 3-24 characters | No |
| Length of instance name | 3-36 characters | 3-36 characters | No |

This table provides the various limits associated with the operations within Device Update for IoT Hub:

| Operation | Standard SKU Limit | Free SKU Limit | Adjustable for Standard SKU? |
| --- | --- | --- | --- |
| Number of devices per instance | 1 Million | 10 | Yes |
| Number of device groups per instance | 100 | 10 | Yes |
| Number of device classes per instance | 80 | 10 | Yes |
| Number of active deployments per instance | 50 (includes 1 reserved deployment for Cancels) | 5 (includes 1 reserved deployment for Cancels) | Yes |
| Number of total deployments per instance | 100 | 20 | No |
| Number of update providers per instance | 25 | 2 | No |
| Number of update names per provider per instance | 25 | 2 | No |
| Number of update versions per update provider and name per instance | 100 | 5 | No |
| Total number of updates per instance | 100 | 10 | No |
| Maximum single update file size | 2 GB | 2 GB | Yes |
| Maximum combined size of all files in a single import action | 2 GB | 2 GB | Yes |
| Maximum number of files in a single update | 10 | 10 | No |
| Total data storage included per instance | 100 GB | 5 GB | No |

