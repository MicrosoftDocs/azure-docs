---
title: Customized alert rules
description: You can add custom alert rules based on information detected by the sensor.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/23/2020
ms.topic: article
ms.service: azure
ms.topic: how-to
---

# Customized alert rules

You can add custom alert rules based on information detected by the sensor. For example, define a rule that instructs the sensor to trigger an alert based on a Source IP, Destination IP, Command (within a protocol), or other values. When the sensor detects the traffic defined in the rule, an Alert or event is generated.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image267.png" alt-text="create rule":::

To create a customized rule:

1.  Select :::image type="content" source="media/how-to-work-with-alerts-sensor/image268.png" alt-text="create a customized rule":::, Or *Click here.*

2. Choose Category/ Protocol.

3. Provide rule name.

4. Choose IP or MAC port and/or destination or leave empty to define “Any”.

5. Add a condition, A list of conditions and their properties is unique for each category.

6. It possible to select more than one condition.

7. Indicate if the rule trigger an Alarm or Event.

8. Select Severity.

9. Select if the rule will include a PCAP file.

10. Save. The rule is added to the Rules list and the user has an option to:


    - See basic rule parameters
  
    - See when the rule occurred last time
  
    - Enable/Disable rule
  
    - Modify/Delete rule
  
    - The user can Delete/Enable/Disable rule by multiple selection

      :::image type="content" source="media/how-to-work-with-alerts-sensor/image269.png" alt-text="customized alert":::

      If the customized alarm is triggered, the alert message indicates that a user-defined rule was created triggered the alert.

      :::image type="content" source="media/how-to-work-with-alerts-sensor/image270.png" alt-text="user defind rule":::
