---
title: Migrate from preview control plane APIs
titleSuffix: Azure Digital Twins
description: Migrate from preview API versions of the control plane to the stable GA version
author: baanders
ms.author: baanders
ms.date: 01/23/2023
ms.topic: conceptual
ms.service: digital-twins
services: digital-twins
---

# Migrate Azure Digital Twins preview Control-Plane APIs to the latest GA stable API version 

Starting on May 02, 2023, Azure Digital Twins Preview Control-Plane APIs ([2020-03-01-preview](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/preview/2020-03-01-preview) version and [2021-06-30-preview](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/preview/2021-06-30-preview) version) will be retired. Before that date, please migrate to the latest GA stable API version ([2022-10-31](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/stable/2022-10-31)), which provides more capabilities, including time-series database connections and managed identity. 

## Migration steps from 2020-03-01-preview control-plane API 

This is a summary list of items to be aware of when you are preparing for migration. Changes include altered item names or naming requirements, endpoint requirements, and changes to the instance and API responses. 

After the 2020-03-01-preview API version, the following changes are in stable versions:
1. EventHub endpoints:
    * Event Hubs endpoints have changed from "connectionString-PrimaryKey" and "connectionString-SecondaryKey" to "connectionStringPrimaryKey" and "connectionStringSecondaryKey" respectively, i.e., the dash "-" are now removed. 
1. PATCH API response changed from synchronous to asynchronous from the 2020-10-31 stable API version onward:
    * The PATCH API of Digital Twins Resources now returns "[202 Accepted](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/stable/2022-10-31/examples/DigitalTwinsPatch_example.json)" (instead of "[200 OK](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/preview/2020-03-01-preview/examples/DigitalTwinsPatch_example.json))" as the update will complete asynchronously. Users can track the status of the update with a PUT request. 
1. Endpoint names must be at least 2 characters long (instead of previously 1) and can have a max length of 49 characters (previously 64) 
1. Digital twins resource names must be at least 3 characters (previously 1) long and can have a maximum length of 63 characters (previously 64) 
1. ServiceBus, EventHub, EventGrid endpoints:
    * For ServiceBus, EventHub, and EventGrid endpoints, secondary secrets (connection strings, access keys, etc.) are no longer required, but optional.
1. Digital Twins Instance no longer returns a "SKU" as a property in the json body response. 
    * 2020-03-01-preview "DigitalTwinsResource" has an "SKU" property ([line 723](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/preview/2020-03-01-preview/digitaltwins.json)) that is no longer in the [2020-10-31](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/stable/2020-10-31/digitaltwins.json) stable API version's. Therefore, any reference to "SKU" of an Azure Digital Twins instance should be removed. 

It is recommended that users of the affected associated SDKs of the 2020-03-01-preview API to update to the latest version SDKs and follow additional migration guidance from the old to the new Azure SDK: 
* .NET: migrate from [2020-03-01-preview .NET SDK package](https://www.nuget.org/packages/Microsoft.Azure.Management.DigitalTwins/1.0.0-preview.1) to [2022-10-31 .NET SDK package](https://www.nuget.org/packages/Azure.ResourceManager.DigitalTwins/1.1.0), with this [guidance](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/migration-guide.md) on migrating to the new management SDK. 
* Java: migrate from [2020-03-01-preview Java SDK package](https://search.maven.org/artifact/com.microsoft.azure.digitaltwins.v2020_03_01_preview/azure-mgmt-digitaltwins/1.0.0-beta/jar) to [2022-10-31 Java SDK package](https://search.maven.org/artifact/com.azure.resourcemanager/azure-resourcemanager-digitaltwins/1.1.0/jar), with this [guidance](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/migration-guide.md#important-changes) on migrating to the new management SDK. 
* Go: migrate from [2020-03-01-preview Go SDK package](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/services/preview/digitaltwins/2020-05-31-preview/digitaltwins) to [2022 Go SDK package](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/digitaltwins/armdigitaltwins), with this [guidance](https://github.com/Azure/azure-sdk-for-go/blob/main/documentation/MIGRATION_GUIDE.md) on migrating to the new management SDK. 


## Migration steps from 2021-10-31-preview control-plane API 

The target replacement API version ([2022-10-31 stable API version](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/stable/2022-10-31)) is backward compatible with the [2021-06-30-preview API version](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/preview/2021-06-30-preview). In addition to the 2021-06-30-preview API version's capabilities, the 2022-10-31 stable API version additionally introduces user-assigned managed identities. 

There are no breaking changes for migrating to the target replacement API version ([2022-10-31 stable API version](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/stable/2022-10-31)). The one minor change is that now endpoints and TSDB connections have an explicit "Updating" state defined in the API contract. 

It is recommended that users of the affected associated SDKs of the 2021-10-31-preview API to update to the latest version SDKs: 
* .NET: migrate from [2021-06-30-preview .NET SDK package](https://www.nuget.org/packages/Microsoft.Azure.Management.DigitalTwins/1.2.0-beta.1) to [2022-10-31 .NET SDK package](https://www.nuget.org/packages/Azure.ResourceManager.DigitalTwins/1.1.0), with this [guidance](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/migration-guide.md) on migrating to the new management SDK. 
* Java: migrate from [2021-06-30-preview Java SDK package](https://search.maven.org/artifact/com.azure.resourcemanager/azure-resourcemanager-digitaltwins/1.0.0-beta.2/jar) to [2022-10-31 Java SDK package](https://search.maven.org/artifact/com.azure.resourcemanager/azure-resourcemanager-digitaltwins/1.1.0/jar), and set the service version in the SDK client to call the 2022-10-31 stable API.

## Next steps

View the [2022-10-31 stable API in GitHub](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/stable/2022-10-31)).