---
author: vimeht
ms.author: vimeht
ms.date: 7/8/2021
ms.topic: include
ms.service: iot-hub-device-update
---

 > [!NOTE]
 > When a given resource or operation doesn't have adjustable limits, the default and the maximum limits are the same.
 > When the limit can be adjusted, the table includes different values for Default limit and Maximum limit headers. The limit can be raised above the default limit 
 > but not above the maximum limit.
 > If you want to raise the limit or quota above the default limit, open an [online customer support request](https://azure.microsoft.com/support/options/).


This table provides the limits for the Device Update for IoT Hub resource in Azure Resource Manager:

| Resource |  Default Limit | Maximum Limit | Adjustable? |
| --- | --- | --- | --- |
| Accounts per subscription | 2 | 25 | Yes |
| Instances per account | 2 | 25 | Yes |
| Length of account name | Minimum: 3 <br/> Maximum: 24 | Minimum: 3 <br/> Maximum: 24 | No |
| Length of instance name | Minimum: 3 <br/> Maximum: 36 | Minimum: 3 <br/> Maximum: 36 | No |



This table provides the various limits associated with the operations within Device Update for IoT Hub:

| Operation |  Default Limit | Maximum Limit | Adjustable? |
| --- | --- | --- | --- |
| Number of devices per instance | 10,000 | 10,000 | No |
| Number of update providers per instance | 25 | 25 | No |
| Number of update names per provider per instance | 25 | 25 | No |
| Number of update versions per update provider and name per instance | 100 | 100 | No |
| Total number of updates per instance | 100 | 100 | No |
| Maximum single update file size | 800 MB | 800 MB | No |
| Maximum combined size of all files in a single import action | 800 MB | 800 MB | No |
| Number of device groups per instance | 75 | 75 | No |
