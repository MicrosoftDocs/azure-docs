---
author: baanders
description: include file for Azure Digital Twins - control plane SDKs
ms.service: digital-twins
ms.topic: include
ms.date: 10/5/2023
ms.author: baanders
---

The data plane APIs are the Azure Digital Twins APIs used to manage the elements within your Azure Digital Twins instance. They include operations like creating routes, uploading models, creating relationships, and managing twins, and can be broadly divided into the following categories:

* `DigitalTwinModels` - The DigitalTwinModels category contains APIs to manage the [models](../articles/digital-twins/concepts-models.md) in an Azure Digital Twins instance. Management activities include upload, validation, retrieval, and deletion of models authored in DTDL.
* `DigitalTwins` - The DigitalTwins category contains the APIs that let developers create, modify, and delete [digital twins](../articles/digital-twins/concepts-twins-graph.md) and their relationships in an Azure Digital Twins instance.
* `Query` - The Query category lets developers [find sets of digital twins in the twin graph](../articles/digital-twins/how-to-query-graph.md) across relationships.
* `Event Routes` - The Event Routes category contains APIs to [route data](../articles/digital-twins/concepts-route-events.md), through the system and to downstream services.
* `Import Jobs` - The Import Jobs API lets you manage a long running, asynchronous action to [import models, twins, and relationships in bulk](../articles/digital-twins/concepts-apis-sdks.md#bulk-import-with-the-import-jobs-api).
* `Delete Jobs` - The Delete Jobs API lets you manage a long running, asynchronous action to [delete all models, twins, and relationships in an instance](../articles/digital-twins/concepts-apis-sdks.md#bulk-delete-with-the-delete-jobs-api).

To call the APIs directly, reference the latest Swagger folder in the [data plane Swagger repo](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/data-plane/Microsoft.DigitalTwins). This folder also includes a folder of examples that show the usage. You can also view the [data plane API reference documentation](/rest/api/azure-digitaltwins/).

Here are the SDKs currently available for the Azure Digital Twins data plane APIs.

| SDK language | Package link | Reference documentation | Source code |
| --- | --- | --- | --- |
| .NET (C#) | [Azure.DigitalTwins.Core on NuGet](https://www.nuget.org/packages/Azure.DigitalTwins.Core) | [Reference for Azure IoT Digital Twins client library for .NET](/dotnet/api/overview/azure/digitaltwins.core-readme) | [Azure IoT Digital Twins client library for .NET on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/digitaltwins/Azure.DigitalTwins.Core) |
| Java | [com.azure:azure-digitaltwins-core on Maven](https://search.maven.org/artifact/com.azure/azure-digitaltwins-core/1.0.0/jar) | [Reference for Azure Digital Twins SDK for Java](/java/api/overview/azure/digital-twins) | [Azure IoT Digital Twins client library for Java on GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/digitaltwins/azure-digitaltwins-core) |
| JavaScript | [Azure Azure Digital Twins Core client library for JavaScript on npm](https://www.npmjs.com/package/@azure/digital-twins-core) | [Reference for @azure/digital-twins-core](/javascript/api/@azure/digital-twins-core) | [Azure Azure Digital Twins Core client library for JavaScript on GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/digitaltwins/digital-twins-core) |
| Python | [Azure Azure Digital Twins Core client library for Python on PyPI](https://pypi.org/project/azure-digitaltwins-core/) | [Reference for azure-digitaltwins-core](/python/api/azure-digitaltwins-core/azure.digitaltwins.core) | [Azure Azure Digital Twins Core client library for Python on GitHub](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/digitaltwins/azure-digitaltwins-core) |
