---
title: Learning modes
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 10/28/2020
ms.topic: article
ms.service: azure
---

# Learning modes

The learning mode instructs your sensor to learn your networks usual activity. For example, devices discovered in your network, protocols detected in the network, file transfers between specific devices, and more. This activity becomes your network baseline.

***About the Learning mode***

The **Learning** mode is automatically enabled after installation and will remain enabled until turned off. The approximate learning mode period is between two to six weeks, depending on the network size and complexity. After this period, when the learning mode is disabled, any new activity detected will trigger alerts. Alerts are triggered when the policy engine discovers deviations from your learned baseline.

***About the Smart IT Learning Mode***

After the learning period is complete and the learning mode is disabled, the sensor may detect an unusually high level of baseline changes that are the result of normal IT activity, for example DNS and HTTP requests. The activity is referred to as nondeterministic IT behavior. The behavior may also trigger unnecessary policy violation alerts and system notifications. To reduce the amount of these alerts and notifications, you can enable the **Smart IT Learning** function.

When **Smart IT Learning** is enabled, the sensor tracks network traffic that generates non-deterministic IT behavior based on specific alert scenarios.

The sensor monitors this traffic for seven days. If it detects the same nondeterministic IT traffic within the seven days, it continues to monitor the traffic for another seven days. When the traffic is not detected for a full seven days, **Smart IT Learning** is disabled for that scenario. New traffic detected for that scenario will only then generate alerts and notifications.

Working with **Smart IT Learning** helps you reduce the number of unnecessary alerts and notifications caused by noisy IT scenarios.

If your sensor is controlled by the on-premises management console, you cannot disable the learning modes. In cases like this, the learning mode can only be disabled from the management console.

The learning capabilities (**Learning** and **Smart IT Learning**) are enabled by default.

**To enable or disable learning:**

- Select **System Settings** and toggle the **Learning** and **Smart IT Learning** options.

  :::image type="content" source="media/toggle-options-for-learning-and-smart-it-learning.png" alt-text="System settings toggle screen":::
