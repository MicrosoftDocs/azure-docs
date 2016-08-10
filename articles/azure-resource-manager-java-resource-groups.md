<properties
   pageTitle="Manage Azure Resource Groups using the Java SDK for Azure | Microsoft Azure"
   description="Describes how to use the Java SDK for Azure to manage resource groups on Azure."
   services="azure-resource-manager"
   documentationCenter="java"
   authors="allclark"
   manager="douge"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="java"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/29/2016"
   ms.author="allclark"/>

# Manage resources using the Java SDK

This sample demonstrates how to perform common tasks using the Microsoft Azure Resource management service.
   - Create a resource
   - Update a resource
   - Create another resource
   - List resources
   - Delete a resource.
 

## Running this Sample

To run this sample:

Set the environment variable `AZURE_AUTH_LOCATION` with the full path for an Auth file. See [how to create an Auth file](https://github.com/Azure/azure-sdk-for-java/blob/master/AUTH.md).

    git clone https://github.com/Azure-Samples/resources-java-manage-resource.git

    cd resources-java-manage-resource

    mvn clean compile exec:java

## More information

[http://azure.com/java](http://azure.com/java)

[AZURE.INCLUDE [azure-code-samples-closer](../includes/azure-code-samples-closer.md)]
