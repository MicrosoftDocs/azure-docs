---
title: Device Reference Schema
description: Device Reference Schema needed to implement the Device datatype in *Quality of Experience – Affirmed MCC Data Product*
author: parjai
ms.author: parjai
ms.reviewer: rdunstan
ms.topic: reference
ms.service: operator-insights
ms.date: 01/31/2024
---

<!-- #CustomerIntent: As a Data Product user, I want to add the ability to add device reference data to further enrich the MCC Event Data Records-->

# Device Reference Schema

If you want to implement the *device* datatype, you need to upload the device reference data in CSV format into the input ADLS. The device reference schema should conform to the schema outlined below. Please see [Data types - Azure Operator Insights](concept-data-types.md) for details on various data types supported by a Data Product.

## Schema

| Source field name | Type | Description |
| --- | --- | --- |
| TAC | String | Type Allocation Code (TAC) is a unique identifier assigned to mobile devices. Typically first 8 digits of IMEI number. |
| Make | String | The manufacturer or brand of the mobile device. |
| Model | String | The specific model or version of the mobile device |
| DeviceType | String | Categorises the mobile device based on its primary function e.g. handheld, feature phone |
| PlatformType | String | Identifies the underlying operating system or platform running on the mobile device. |
| IsOwnedDevice | Boolean | Indicates whether the mobile device is owned by the operator |
| Is3G | Boolean | Indicates whether the mobile device supports 3G. A value of 1 signifies 3G capability, while 0 indicates its absence. |
| IsLTE | Boolean | Indicates whether the mobile device supports Long-Term Evolution (LTE) technology. A value of 1 signifies LTE capability, while 0 indicates its absence. |
| IsVoLTE | Boolean | Indicates whether the mobile device supports Voice over LTE. A value of ‘Y’ signifies VoLTE capability, while ‘N’ indicates its absence. |
| Is5G | Boolean | Indicates whether the mobile device supports 5G. A value of 1 signifies 5G capability, while 0 indicates its absence. |