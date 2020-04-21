---
# Mandatory fields.
title: Digital Twins Definition Language (DTDL)
titleSuffix: Azure Digital Twins
description: Understand more details about the Digital Twins Definition Language (DTDL).
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/21/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Digital Twins Definition Language (DTDL)

Digital Twins Definition Language (DTDL) is the JSON-like language used to write [models](concepts-models.md) in Azure Digital Twins. DTDL is based on JSON-LD and is programming-language independent.

DTDL is also used as part of [Azure IoT Plug and Play (PnP)](../iot-pnp/overview-iot-plug-and-play.md). Developers of PnP devices use a subset of the same description language used for Azure Digital Twins. The DTDL version used for PnP is, semantically, a subset of DTDL for Azure Digital Twins: every *capability model* as defined by PnP is also a valid model for use in Azure Digital Twins. 

You can also learn more about DTDL from its [reference documentation](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL).

## 



## Next steps

See how a DTDL model is managed with the DigitalTwinsModels APIs:
* [Manage a twin model](how-to-manage-model.md)