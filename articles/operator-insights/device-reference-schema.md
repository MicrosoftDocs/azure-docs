---
title: Device schema for the Azure Operator Insights QoE MCC Data Product
description: Learn about the schema needed to implement the Device data type in the Quality of Experience – Affirmed MCC Data Product for Azure Operator Insights.
author: parjai
ms.author: parjai
ms.reviewer: rdunstan
ms.topic: reference
ms.service: operator-insights
ms.date: 01/31/2024
---

<!-- #CustomerIntent: As a Data Product user, I want to add the ability to add device reference data to further enrich the MCC Event Data Records-->

# Device reference schema for the Quality of Experience Affirmed MCC Data Product

You can enrich Event Data Record (EDR) data in the Quality of Experience Affirmed MCC Data Product with information about the devices involved in the session. You must provide this device data in the `device` data type. Prepare CSV files that conform to the following schema and upload the files into the input Azure Data Lake Storage. For more information about data types, including the `device` data type, see [Data types](concept-data-types.md).

## Schema for device reference information

| Source field name | Type | Description |
| --- | --- | --- |
| `TAC` | String | Type Allocation Code (TAC): a unique identifier assigned to mobile devices. Typically first eight digits of IMEI number. Can have leading zeros if TAC is six or seven digits. Matched against the IMEI in the session EDRs |
| `Make` | String | The manufacturer or brand of the mobile device. |
| `Model` | String | The specific model or version of the mobile device. |
| `DeviceType` | String | Categorizes the mobile device based on its primary function (for example, handheld or feature phone). |
| `PlatformType` | String | Identifies the underlying operating system or platform running on the mobile device. |
| `IsOwnedDevice` | String | Indicates if the device model was ranged by the operator. A value of `Y`/`1` signifies it is, while `N`/`0` indicates it isn't. |
| `Is3G` | String | Indicates whether the mobile device supports 3G. A value of `Y`/`E`/`1` signifies 3G capability, while `N`/`0` indicates its absence. |
| `IsLTE` | String | Indicates whether the mobile device supports Long-Term Evolution (LTE) technology. A value of `Y`/`E`/`1` signifies LTE capability, while `N`/`0` indicates its absence |
| `IsVoLTE` | String | Indicates whether the mobile device supports Voice over LTE. A value of `Y`/`E`/`1` signifies VoLTE capability, while `N`/`0` indicates its absence. |
| `Is5G` | String | Indicates whether the mobile device supports 5G. A value of `Y`/`E`/`1` signifies 5G capability, while `N`/`0` indicates its absence. |
