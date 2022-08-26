---
title: Tutorial - Azure IoT continuous patient monitoring | Microsoft Docs
description: This tutorial shows you how to deploy and use the continuous patient monitoring application template for IoT Central.
author: philmea
ms.author: philmea
ms.date: 12/23/2021
ms.topic: tutorial
ms.service: iot-central
services: iot-central
manager: eliotgra
---

# Tutorial: Deploy and walkthrough the continuous patient monitoring application template

In the healthcare IoT space, continuous patient monitoring is one of the key enablers of reducing the risk of readmissions, managing chronic diseases more effectively, and improving patient outcomes. Continuous patient monitoring can be split into two major categories:

1. **In-patient monitoring**: Using medical wearables and other devices in the hospital, care teams can monitor patient vital signs and medical conditions without having to send a nurse to check up on a patient multiple times a day. Care teams can understand the moment that a patient needs critical attention through notifications and prioritizes their time effectively.
1. **Remote patient monitoring**: By using medical wearables and patient reported outcomes (PROs) to monitor patients outside of the hospital, the risk of readmission can be lowered. Data from chronic disease patients and rehabilitation patients can be collected to ensure that patients are adhering to care plans and that alerts of patient deterioration can be surfaced to care teams before they become critical.

The application template enables you to:

- Seamlessly connect different kinds of medical wearables to an IoT Central instance.
- Monitor and manage the devices to ensure they remain healthy.
- Create custom rules around device data to trigger appropriate alerts.
- Export your patient health data to the Azure API for FHIR, a compliant data store.
- Export the aggregated insights into existing or new business applications.

:::image type="content" source="media/cpm-architecture.png" alt-text="Continuous patient monitoring architecture":::

### Bluetooth Low Energy (BLE) medical devices (1)

Many medical wearables used in healthcare IoT solutions are BLE devices. These devices can't communicate directly to the cloud and need to use a gateway to exchange data with your cloud solution. This architecture uses a mobile phone application as the gateway.

### Mobile phone gateway (2)

The mobile phone application's primary function is to collect BLE data from medical devices and communicate it to IoT Central. The app also guides patients through device setup and lets them view their personal health data. Other solutions could use a tablet gateway or a static gateway in a hospital room. An open-source sample mobile application is available for Android and iOS to use as a starting point for your application development. To learn more, see the [Continuous patient monitoring sample mobile app on GitHub](https://github.com/iot-for-all/iotc-cpm-sample).

### Export to Azure API for FHIR&reg; (3)

Azure IoT Central is HIPAA-compliant and HITRUST&reg; certified. You can also send patient health data to other services using the [Azure API for FHIR](../../healthcare-apis/fhir/overview.md). Azure API for FHIR is a standards-based API for clinical health data. The [Azure IoT connector for FHIR](../../healthcare-apis/fhir/iot-fhir-portal-quickstart.md) lets you use the Azure API for FHIR as a continuous data export destination from IoT Central.

### Machine learning (4)

Use machine learning models with your FHIR data to generate insights and support decision making by your care team. To learn more, see the [Azure machine learning documentation](../../machine-learning/index.yml).

### Provider dashboard (5)

Use the Azure API for FHIR data to build a patient insights dashboard or integrate it directly into an electronic medical record used by care teams. Care teams can use the dashboard to assist patients and identify early warning signs of deterioration. To learn more, see the [Build a Power BI provider dashboard](tutorial-health-data-triage.md) tutorial.

In this tutorial, you learn how to:

- Create an application template
- Walk through the application template

## Prerequisites

An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create application

1. Navigate to the [Azure IoT Central Build](https://aka.ms/iotcentral) site. Then sign in with a Microsoft personal, work, or school account. Select **Build** from the left-hand navigation bar and then select the **Healthcare** tab.

1. Select **Create app** under **Continuous patient monitoring**.

To learn more, see [Create an IoT Central application](../core/howto-create-iot-central-application.md).

## Walk through the application

The following sections walk you through the key features of the application:

### Dashboards

After deploying the application template, you'll first land on the **Lamna in-patient monitoring dashboard**. Lamna Healthcare is a fictitious hospital system that contains two hospitals: Woodgrove Hospital and Burkville Hospital. On the Woodgrove Hospital operator dashboard, you can:

* See device telemetry and properties such as the **battery level** of your device or its **connectivity** status.

* View the **floor plan** and location of the Smart Vitals Patch device.

* **Reprovision** the Smart Vitals Patch for a new patient.

* See an example of a **provider dashboard** that a hospital care team might see to track their patients.

* Change the **patient status** of your device to indicate if the device is being used for an in-patient or remote scenario.

You can also select **Go to remote patient dashboard** to see the Burkville Hospital operator dashboard. This dashboard contains a similar set of actions, telemetry, and information. You can also see multiple devices in use and choose to **update the firmware** on each.

:::image type="content" source="media/lamna-remote.png" alt-text="Remote operator dashboard":::

### Device templates

If you select **Device templates**, you see the two device types in the template:

- **Smart Vitals Patch**: This device represents a patch that measures various vital signs. It's used for monitoring patients in and outside the hospital. If you select the template, you see that the patch sends both device data such as battery level and device temperature, and patient health data such as respiratory rate and blood pressure.

- **Smart Knee Brace**: This device represents a knee brace that patients use when recovering from a knee replacement surgery. If you select this template, you see capabilities such as device data, range of motion, and acceleration.

:::image type="content" source="media/smart-vitals-device-template.png" alt-text="Smart patch template":::

### Device groups

Use device groups to logically group a set of devices and then run bulk queries or operations on them.

If you select the device groups tab, you see a default device group for each device template in the application. There are also created two additional sample device groups called **Provision devices** and **Devices with outdated firmware**. You can use these sample device groups as inputs to run some of the [Jobs](#jobs) in the application.

### Rules

If you select **Rules**, you see the three rules in the template:

- **Brace temperature high**: This rule triggers when the device temperature of the smart knee brace is greater than 95&deg;F over a 5-minute window. Use this rule to alert the patient and care team, and cool the device down remotely.

- **Fall detected**: This rule is triggers if a patient fall is detected. Use this rule to configure an action to deploy an operational team to assist the patient who has fallen.

- **Patch battery low**: This rule is triggers when the battery level on the device goes below 10%. Use this rule to trigger a notification to the patient to charge their device.

:::image type="content" source="media/brace-temp-rule.png" alt-text="Rules":::

### Jobs

Jobs let you run bulk operations on a set of devices, using [device groups](#device-groups) as the input. The application template has two sample jobs that an operator can run:

* **Update knee brace firmware**: This job finds devices in the device group **Devices with outdated firmware** and runs a command to update those devices to the latest firmware version. This sample job assumes that the devices can handle an **update** command and then fetch the firmware files from the cloud.  

* **Re-provision devices**: You have a set of devices that have recently been returned to the hospital. This job finds devices in the device group **Provision devices** and runs a command to re-provision them for the next set of patients.

### Devices

Select the **Devices** tab and then select an instance of the **Smart Knee Brace**. There are three views to explore information about the particular device that you've selected. These views are created and published when you build the device template for your device. therefore, these views are consistent across all the devices that you connect or simulate.

The **Dashboard** view gives an overview of operator-oriented telemetry and properties from the device.

The **Properties** tab lets you edit cloud properties and read/write device properties.

The **Commands** tab lets you run commands on the device.

:::image type="content" source="media/knee-brace-dashboard.png" alt-text="Knee brace dashboard":::


## Clean up resources

If you're not going to continue to use this application, delete the application by visiting **Application > Management** and click **Delete**.

:::image type="content" source="media/admin-delete.png" alt-text="Tidy resources":::

## Next steps

Advance to the next article to learn how to create a provider dashboard that connects to your IoT Central application.

> [!div class="nextstepaction"]
> [Build a provider dashboard](tutorial-health-data-triage.md)