---
ms.service: azure-monitor
ms.topic: include
ms.date: 11/29/2023
ms.author: abbyweisberg
author: AbbyMSFT
---

<a name="custom-props"></a>(Optional)  In the **Custom properties** section, if this alert rule contains action groups, you can add your own properties to include in the alert notification payload. You can use these properties in the actions called by the action group, such as by a webhook, Azure function or logic app actions.

The custom properties are specified as key:value pairs, using either static text, a dynamic value extracted from the alert payload, or a combination of both.

The format for extracting a dynamic value from the alert payload is: `${<path to schema field>}`. For example: ${data.essentials.monitorCondition}.

Use the format of the [common alert schema](../alerts/alerts-common-schema.md) to specify the field in the payload, whether or not the action groups configured for the alert rule use the common schema.

> [!NOTE]
> - The [common schema](../alerts/alerts-common-schema.md) overwrites custom configurations. You can't use both custom properties and the common schema.
> - Custom properties are added to the payload of the alert, but they do not appear in the email template or in the alert details in the Azure portal.
> - Service Health alerts do not support custom properties.

:::image type="content" source="../alerts/media/alerts-create-new-alert-rule/alerts-rule-custom-props.png" alt-text="Screenshot that shows the custom properties section of creating a new alert rule.":::

In the following examples, values in the **custom properties** are used to utilize data from a payload that uses the common alert schema:

**Example 1**

This example creates an "Additional Details" tag with data regarding the "window start time" and "window end time".

- **Name:** "Additional Details"
- **Value:** "Evaluation windowStartTime: \${data.alertContext.condition.windowStartTime}. windowEndTime: \${data.alertContext.condition.windowEndTime}"
- **Result:** "AdditionalDetails:Evaluation windowStartTime: 2023-04-04T14:39:24.492Z. windowEndTime: 2023-04-04T14:44:24.492Z"


**Example 2**
This example adds the data regarding the reason of resolving or firing the alert. 

- **Name:** "Alert \${data.essentials.monitorCondition} reason"
- **Value:** "\${data.alertContext.condition.allOf[0].metricName} \${data.alertContext.condition.allOf[0].operator} \${data.alertContext.condition.allOf[0].threshold} \${data.essentials.monitorCondition}. The value is \${data.alertContext.condition.allOf[0].metricValue}"
- **Result:**  Example results could be something like:
    - "Alert Resolved reason: Percentage CPU GreaterThan5 Resolved. The value is 3.585"
    - “Alert Fired reason": "Percentage CPU GreaterThan5 Fired. The value is 10.585"
