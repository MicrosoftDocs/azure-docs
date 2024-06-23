---
title: Migrate from preview control plane APIs
titleSuffix: Azure Digital Twins
description: Migrate from preview API versions of the control plane to the stable GA version
author: baanders
ms.author: baanders
ms.date: 05/02/2023
ms.topic: conceptual
ms.service: digital-twins
services: digital-twins
---

# Migrate from Azure Digital Twins preview control plane APIs to the stable GA version 

As of May 2, 2023, the following Azure Digital Twins preview control plane APIs have been retired and are no longer maintained:
* [2020-03-01-preview](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/preview/2020-03-01-preview)
* [2021-06-30-preview](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/preview/2021-06-30-preview) 

This article explains how to migrate from these versions to the latest stable GA version of the APIs, [2022-10-31](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/stable/2022-10-31). The GA version provides more capabilities, including time-series database connections and managed identity. 

## Migrate from 2020-03-01-preview control plane API 

This section contains a list of changes to be aware of when you're preparing to migrate from the [2020-03-01-preview](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/preview/2020-03-01-preview) API version to the [2022-10-31](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/stable/2022-10-31) (GA) API version. The changes include altered item names or naming requirements, endpoint requirements, and changes to the instance and API responses. 

The changes from the 2020-03-01-preview API version to the 2022-10-31 (GA) API version are as follows:
* For Event Hubs endpoints, the values *connectionString-PrimaryKey* and *connectionString-SecondaryKey* have changed to *connectionStringPrimaryKey* and *connectionStringSecondaryKey*, respectively (the dashes are removed).
* The Patch API response has changed from synchronous to asynchronous.
    * Because patch updates now complete asynchronously, the Patch API of Azure Digital Twins resources now returns [202 Accepted](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/stable/2022-10-31/examples/DigitalTwinsPatch_example.json) instead of [200 OK](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/preview/2020-03-01-preview/examples/DigitalTwinsPatch_example.json)). Users can track the status of the update with a PUT request. 
* Endpoint names must be at least two characters long (previously one character in the preview API), and can have a max length of 49 characters (previously 64) 
* Digital twins resource names must be at least three characters long (previously one), and can have a maximum length of 63 characters (previously 64) 
* For Service Bus, Event Hubs, and Event Grid endpoints, secondary secrets (like connection strings and access keys) are no longer required. Now they're optional.
* Azure Digital Twins instances no longer return `SKU` as a property in the JSON body response. 
    * In the 2020-03-01-preview API, `DigitalTwinsResource` has a [SKU property](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/preview/2020-03-01-preview/digitaltwins.json#L723) that is no longer in the 2020-10-31 (GA) API version. Therefore, any reference to `SKU` of an Azure Digital Twins instance should be removed.

If you're using an associated SDK of the 2020-03-01-preview API, it's recommended to update to the latest version of the management SDK. Use the following links to know what additional changes are required to migrate to the new management SDK.
* .NET: Migrate from the [Microsoft.Azure.Management.DigitalTwins 1.0.0-preview.1](https://www.nuget.org/packages/Microsoft.Azure.Management.DigitalTwins/1.0.0-preview.1) package to the [Azure.ResourceManager.DigitalTwins 1.1.0](https://www.nuget.org/packages/Azure.ResourceManager.DigitalTwins/1.1.0) package, by following the [.NET SDK migration guidance](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/resourcemanager/Azure.ResourceManager/docs/MigrationGuide.md).
* Java: Migrate from the [azure-mgmt-digitaltwins:1.0.0-beta](https://search.maven.org/artifact/com.microsoft.azure.digitaltwins.v2020_03_01_preview/azure-mgmt-digitaltwins/1.0.0-beta/jar) package to the [azure-resourcemanager-digitaltwins:1.1.0](https://search.maven.org/artifact/com.azure.resourcemanager/azure-resourcemanager-digitaltwins/1.1.0/jar) package, by following the [Java SDK migration guidance](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/migration-guide.md).
* Go: Migrate from the [digitaltwins 2020-03-01-preview](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go@v68.0.0+incompatible/services/preview/digitaltwins/mgmt/2020-03-01-preview/digitaltwins) package to the [armsdigitaltwins v1.0.0](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/digitaltwins/armdigitaltwins) package, by following the [Go SDK migration guidance](https://github.com/Azure/azure-sdk-for-go/blob/main/documentation/MIGRATION_GUIDE.md).


## Migrate from 2021-06-30-preview control plane API 

The target replacement API version ([2022-10-31 (GA) API version](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/stable/2022-10-31)) is backwards-compatible with the [2021-06-30-preview API version](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/preview/2021-06-30-preview). In addition to the 2021-06-30-preview API version's capabilities, the 2022-10-31 (GA) API version additionally introduces user-assigned managed identities. 

There are no breaking changes for migrating to the target replacement API version ([2022-10-31 (GA) API version](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/stable/2022-10-31)). There's one minor change: Endpoints and TSDB connections now have an explicit *Updating* state defined in the API contract. 

If you're using an associated SDK of the 2021-06-30-preview API, it's recommended to update to the latest version of the management SDK. Use the following links to know what additional changes are required to migrate to the new management SDK.
* .NET: Migrate from the [Microsoft.Azure.Management.DigitalTwins 1.2.0-beta.1](https://www.nuget.org/packages/Microsoft.Azure.Management.DigitalTwins/1.2.0-beta.1) package to the [Azure.ResourceManager.DigitalTwins 1.1.0](https://www.nuget.org/packages/Azure.ResourceManager.DigitalTwins/1.1.0) package, by following the [.NET SDK migration guidance](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/resourcemanager/Azure.ResourceManager/docs/MigrationGuide.md). 
* Java: Migrate from the [azure-resourcemanager-digitaltwins:1.0.0-beta.2](https://search.maven.org/artifact/com.azure.resourcemanager/azure-resourcemanager-digitaltwins/1.0.0-beta.2/jar) package to the [Azure.ResourceManager.DigitalTwins 1.1.0](https://search.maven.org/artifact/com.azure.resourcemanager/azure-resourcemanager-digitaltwins/1.1.0/jar) package, or set the service version in the SDK client to call the 2022-10-31 (GA) API.

## Next steps

View the latest stable GA API, [2022-10-31](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/stable/2022-10-31), in GitHub.