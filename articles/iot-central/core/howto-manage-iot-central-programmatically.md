---
title: Manage IoT Central programmatically | Microsoft Docs
description: This article describes how to create and manage your IoT Central programmatically. You can view, modify, and remove the application using multiple language SDKs such as JavaScript, Python, C#, Ruby, and Go.
services: iot-central
ms.service: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 05/19/2020
ms.topic: how-to
---

# Manage IoT Central programmatically

[!INCLUDE [iot-central-selector-manage](../../../includes/iot-central-selector-manage.md)]

Instead of creating and managing IoT Central applications on the [Azure IoT Central application manager](https://aka.ms/iotcentral) website, you can manage your applications programmatically using the Azure SDKs. Supported languages include JavaScript, Python, C#, Ruby, and Go.

## Install the SDK

The following table lists the SDK repositories and package installation commands:

| SDK repository | Package install |
| -------------- | ------------ |
| [Azure IotCentralClient SDK for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/iotcentral/arm-iotcentral) | `npm install @azure/arm-iotcentral` |
| [Microsoft Azure SDK for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/iothub/azure-mgmt-iotcentral/azure/mgmt/iotcentral) | `pip install azure-mgmt-iotcentral` |
| [Azure SDK for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/iotcentral/Microsoft.Azure.Management.IotCentral) | `dotnet add package Microsoft.Azure.Management.IotCentral` |
| [Microsoft Azure SDK for Ruby - Resource Management (preview)](https://github.com/Azure/azure-sdk-for-ruby/tree/master/management/azure_mgmt_iot_central/lib/2018-09-01/generated/azure_mgmt_iot_central) | `gem install azure_mgmt_iot_central` |
| [Azure SDK for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/iotcentral) | [Maven package](https://search.maven.org/search?q=a:azure-mgmt-iotcentral) |
| [Azure SDK for Go](https://github.com/Azure/azure-sdk-for-go/tree/master/services/iotcentral/mgmt/2018-09-01/iotcentral) | [Package releases](https://github.com/Azure/azure-sdk-for-go/releases) |

## Samples

The [Azure IoT Central ARM SDK samples](https://docs.microsoft.com/samples/azure-samples/azure-iot-central-arm-sdk-samples/azure-iot-central-arm-sdk-samples/) repository has code samples for multiple programming languages that show you how to create, update, list, and delete Azure IoT Central applications.

## Next steps

Now that you've learned how to manage Azure IoT Central applications programmatically, a suggested next step is to learn more about the [Azure Resource Manager](../../azure-resource-manager/management/overview.md) service.
