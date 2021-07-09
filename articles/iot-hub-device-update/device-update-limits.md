---
title: Understand Device Update for IoT Hub limits | Microsoft Docs
description: Key limits for Device Update for IoT Hub.
author: vimeht
ms.author: vimeht
ms.date: 7/8/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Device Update for IoT Hub Limits

## Preview Limits

During preview, the Device Update for IoT Hub service is provided at no cost to customers. More restrictive limits are imposed during the service's preview offering. These limits
are expected to change once the service is Generally Available. 

 > [!NOTE]
 > When a given resource or operation doesn't have adjustable limits, the default and the maximum limits are the same.
 > When the limit can be adjusted, the table includes different values for Default limit and Maximum limit headers. The limit can be raised above the default limit 
 > but not above the maximum limit.
 > If you want to raise the limit or quota above the default limit, open an [online customer support request](https://azure.microsoft.com/en-us/support/options/).



| Resource |  Default Limit | Maximum Limit | Adjustable? |
| --- | --- | --- | --- |
| Accounts per subscription | 2 | 25 | Yes |
| Instances per account | 2 | 25 | Yes |
| Length of account name | Minimum: 3  Maximum: 24 | Minimum: 3  Maximum: 24 | No |
| Length of instance name | Minimum: 3  Maximum: 36 | Minimum: 3  Maximum: 36 | No |
| Number of devices per instance | 1,000 | 10,000 | Yes |
| Number of update providers per instance | 5 | 5 | No |
| Number of update names per provider per instance | 5 | 5 | No |
| Number of update versions per update provider and name per instance | 25 | 25 | No |
| Total number of updates per instance | 100 | 100 | No |
| Maximum single update file size | 800 MB | 800 MB | No |
| Maximum combined size of all files in a single import action | 800 MB | 800 MB | No |
| Number of device groups per instance | 75 | 75 | No |

