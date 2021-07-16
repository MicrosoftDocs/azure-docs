---
title: Continuous patient monitoring architecture in Azure IoT Central | Microsoft Docs
description: Tutorial - Learn about a continuous patient monitoring solution architecture.
author: philmea
ms.author: philmea
ms.date: 12/11/2020
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: eliotgra
---

# Continuous patient monitoring architecture

This article describes the architecture of a solution built from the **continuous patient monitoring** application template:

Continuous patient monitoring solutions can be built by using the app template provided, and using the architecture that is outlined below as guidance.

:::image type="content" source="media/cpm-architecture.png" alt-text="Continuous patient monitoring architecture":::

## Details

This section outlines each part of the architecture diagram in more detail:

### Bluetooth Low Energy (BLE) medical devices

Many medical wearables used in healthcare IoT solutions are BLE devices. These devices can't communicate directly to the cloud and need to use a gateway to exchange data with your cloud solution. This architecture uses a mobile phone application as the gateway.

### Mobile phone gateway

The mobile phone application's primary function is to collect BLE data from medical devices and communicate it to IoT Central. The app also guides patients through device setup and lets them view their personal health data. Other solutions could use a tablet gateway or a static gateway in a hospital room. An open-source sample mobile application is available for Android and iOS to use as a starting point for your application development. To learn more, see the [IoT Central Continuous Patient Monitoring mobile app](/samples/iot-for-all/iotc-cpm-sample/iotc-cpm-sample/).

### Export to Azure API for FHIR&reg;

Azure IoT Central is HIPAA-compliant and HITRUST&reg; certified. You can also send patient health data to other services using the [Azure API for FHIR](../../healthcare-apis/fhir/overview.md). Azure API for FHIR is a standards-based API for clinical health data. The [Azure IoT connector for FHIR](../../healthcare-apis/azure-api-for-fhir/iot-fhir-portal-quickstart.md) lets you use the Azure API for FHIR as a continuous data export destination from IoT Central.

### Machine learning

Use machine learning models with your FHIR data to generate insights and support decision making by your care team. To learn more, see the [Azure machine learning documentation](../../machine-learning/index.yml).

### Provider dashboard

Use the Azure API for FHIR data to build a patient insights dashboard or integrate it directly into an electronic medical record used by care teams. Care teams can use the dashboard to assist patients and identify early warning signs of deterioration. To learn more, see the [Build a Power BI provider dashboard](tutorial-health-data-triage.md) tutorial.

## Next steps

The suggested next step is to [Learn how to deploy a continuous patient monitoring application template](tutorial-continuous-patient-monitoring.md).
