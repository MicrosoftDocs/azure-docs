---
author: vimeht
ms.author: vimeht
ms.date: 01/21/2024
ms.topic: include
ms.service: azure-iot-hub
ms.subservice: device-update
---

Limits can be adjusted only for the Standard SKU. Limit adjustment requests are evaluated on a case-by-case basis, and approvals aren't guaranteed.

Limit adjustment requests aren't accepted for the Free SKU. Also, Free SKU instances can't be upgraded to Standard SKU instances.

The following table shows the limits for the Device Update for IoT Hub resource in Azure Resource Manager.

| Resource |  Standard SKU limit | Free SKU limit | Adjustable for Standard SKU? |
| --- | --- | --- | --- | 
| Accounts per subscription | 50 | 1 | No |
| Instances per account | 50 | 1 | No |
| Length of account name | 3-24 characters | 3-24 characters | No |
| Length of instance name | 3-36 characters | 3-36 characters | No |

The following table shows the limits associated with various Device Update operations.

| Operation | Standard SKU limit | Free SKU limit | Adjustable for Standard SKU? |
| --- | --- | --- | --- |
| Number of devices per instance | 1 million | 10 | Yes |
| Number of device groups per instance | 100 | 10 | Yes |
| Number of device classes per instance | 80 | 10 | Yes |
| Number of active deployments per instance | 50, including one reserved for cancellations | 5, including one reserved for cancellations | Yes |
| Number of total deployments per instance, including all active, inactive, and canceled deployments that aren't deleted | 100 | 20 | No |
| Number of update providers per instance | 25 | 2 | No |
| Number of update names per provider per instance | 25 | 2 | No |
| Number of update versions per update provider and name per instance | 100 | 5 | No |
| Total number of updates per instance | 100 | 10 | No |
| Maximum single update file size | 2 GB | 2 GB | Yes |
| Maximum combined size of all files in a single import action | 2 GB | 2 GB | Yes |
| Maximum number of files in a single update | 10 | 10 | No |
| Total data storage included per instance | 100 GB | 5 GB | No |

> [!NOTE]
> Canceled or inactive deployments count toward your total deployment limit. Make sure to clean up these deployments periodically so you aren't prevented from creating new deployments.
