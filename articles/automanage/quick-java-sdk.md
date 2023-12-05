---
title: Azure Quickstart SDK for Java
description: Create configuration profile assignments using the Java SDK for Automanage.
author: andrsmith
ms.service: automanage
ms.workload: infrastructure
ms.custom: devx-track-extended-java
ms.topic: quickstart
ms.date: 08/24/2022
ms.author: andrsmith
---

# Quickstart: Enable Azure Automanage for virtual machines using Java

Azure Automanage allows users to seamlessly apply Azure best practices to their virtual machines. This quickstart guide will help you apply a Best Practices Configuration profile to an existing virtual machine using the [azure-sdk-for-java repo](https://github.com/Azure/azure-sdk-for-java).

## Prerequisites 

- [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/downloads/#java8) version 8+
- An active [Azure Subscription](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/)
- An existing [Virtual Machine](../virtual-machines/windows/quick-create-portal.md)

> [!NOTE]
> Free trial accounts do not have access to the virtual machines used in this tutorial. Please upgrade to a Pay-As-You-go subscription.

> [!IMPORTANT]
> You need to have the **Contributor** role on the resource group containing your VMs to enable Automanage. If you are enabling Automanage for the first time on a subscription, you need the following permissions: **Owner** role or **Contributor** along with **User Access Administrator** roles on your subscription.

## Add required dependencies 

Add the **Azure Identity** and **Azure Automanage** dependencies to the `pom.xml`. 

```xml
<!-- https://mvnrepository.com/artifact/com.azure/azure-identity -->
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
    <version>1.6.0-beta.1</version>
    <scope>test</scope>
</dependency>

<!-- https://mvnrepository.com/artifact/com.azure.resourcemanager/azure-resourcemanager-automanage -->
<dependency>
    <groupId>com.azure.resourcemanager</groupId>
    <artifactId>azure-resourcemanager-automanage</artifactId>
    <version>1.0.0-beta.1</version>
</dependency>
```

## Authenticate to Azure and create an Automanage client

Use the **Azure Identity** package to authenticate to Azure and then create an Automanage Client:

```java 
AzureProfile profile = new AzureProfile(AzureEnvironment.AZURE);
TokenCredential credential = new DefaultAzureCredentialBuilder()
    .authorityHost(profile.getEnvironment().getActiveDirectoryEndpoint())
    .build();

AutomanageManager client = AutomanageManager
    .authenticate(credential, profile);
```

## Enable best practices configuration profile to an existing virtual machine

```java 
String configProfile = "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesProduction";

client
    .configurationProfileAssignments()
    .define("default") // name must be default
    .withExistingVirtualMachine("resourceGroupName", "vmName")
    .withProperties(
        new ConfigurationProfileAssignmentProperties()
            .withConfigurationProfile(configProfile))
    .create();
```

## Next steps

> [!div class="nextstepaction"]
Learn how to conduct more operations with the Java Automanage Client by visiting the [azure-sdk-for-java repo](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/automanage/azure-resourcemanager-automanage).
