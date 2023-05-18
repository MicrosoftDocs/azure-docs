---
author: baanders
description: include file for Azure Digital Twins - control plane SDKs
ms.service: digital-twins
ms.topic: include
ms.date: 04/14/2023
ms.author: baanders
---

The control plane APIs are [ARM](../articles/azure-resource-manager/management/overview.md) APIs used to manage your Azure Digital Twins instance as a whole, so they cover operations like creating or deleting your entire instance. You'll also use these APIs to create and delete endpoints.

To call the APIs directly, reference the latest Swagger folder in the [control plane Swagger repo](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/stable). This folder also includes a folder of examples that show the usage.

Here are the SDKs currently available for the Azure Digital Twins control plane APIs.

| SDK language | Package link | Reference documentation | Source code |
| --- | --- | --- | --- |
| .NET (C#) | [Azure.ResourceManager.DigitalTwins on NuGet](https://www.nuget.org/packages/Azure.ResourceManager.DigitalTwins) | [Reference for Azure DigitalTwins SDK for .NET](/dotnet/api/overview/azure/digitaltwins) | [Microsoft Azure Digital Twins management client library for .NET on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/digitaltwins/Azure.ResourceManager.DigitalTwins) |
| Java | [azure-resourcemanager-digitaltwins on Maven](https://repo1.maven.org/maven2/com/azure/resourcemanager/azure-resourcemanager-digitaltwins/) | [Reference for Resource Management - Digital Twins](/java/api/overview/azure/digital-twins) | [Azure Resource Manager AzureDigitalTwins client library for Java on GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/digitaltwins) |
| JavaScript | [AzureDigitalTwinsManagement client library for JavaScript on npm](https://www.npmjs.com/package/@azure/arm-digitaltwins) | | [AzureDigitalTwinsManagement client library for JavaScript on GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/digitaltwins/arm-digitaltwins) |
| Python | [azure-mgmt-digitaltwins on PyPI](https://pypi.org/project/azure-mgmt-digitaltwins/) | | [Microsoft Azure SDK for Python on GitHub](https://github.com/Azure/azure-sdk-for-python/tree/release/v3/sdk/digitaltwins/azure-mgmt-digitaltwins) |
| Go | [azure-sdk-for-go/services/digitaltwins/mgmt](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/services/digitaltwins/mgmt) | | [Azure SDK for Go on GitHub](https://github.com/Azure/azure-sdk-for-go)
