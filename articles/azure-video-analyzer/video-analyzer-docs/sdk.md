---
title: SDKs and resources
description: Learn about the Azure Video Analyzer SDKs
author: bennage
ms.author: christb
ms.topic: reference
ms.date: 11/04/2021

---

# Azure Video Analyzer SDKs

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

Azure Video Analyzer includes two groups of SDKs. The management SDKs are used for managing the Azure resource and the client SDKs are used for interacting with edge modules.

## Management SDKs

The management SDKs allow you to interact with the resources exposed by Azure Resource Manager. You can create Video Analyzer account, generate provisioning tokens for edge modules, manage access policies for videos and more. The SDKs are built on top of an underlying [REST API](/rest/api/videoanalyzer/?branch=video).

The following platforms are supported:

- [.NET](https://aka.ms/ava/sdk/mgt/net)
- [Java](https://aka.ms/ava/sdk/mgt/java)
- [Python](https://aka.ms/ava/sdk/mgt/python)

## Client SDKs

The client SDKs allow you to interact with the [direct methods][docs-direct-methods] of a Video Analyzer edge module. These SDKs are designed to be used with the [Azure IoT Hub SDKs][docs-iot-hub-sdks]. They support constructing objects that represent the direct methods that can then be sent to the edge module using the IoT Hub SDKs.

The following platforms are supported:

- [.NET](https://aka.ms/ava/sdk/client/net)
- [Python](https://aka.ms/ava/sdk/client/python)
- [Java](https://aka.ms/ava/sdk/client/java)

## See Also

- You can also refer [Azure Video Analyzer APIs](/rest/api/videoanalyzer/)

<!-- links -->
[docs-direct-methods]: direct-methods.md
[docs-iot-hub-sdks]: ../../iot-hub/iot-hub-devguide-sdks.md

[REST API]: https://aka.ms/ava/api/rest
