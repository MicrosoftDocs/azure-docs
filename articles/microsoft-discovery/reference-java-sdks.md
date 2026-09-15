---
title: Java SDKs for Microsoft Discovery
description: Reference information for the Microsoft Discovery data-plane and control-plane Java SDK artifacts available from Maven Central.
author: anzaman
ms.author: alzam
ms.service: azure
ms.topic: reference
ms.date: 09/02/2026
---

# Java SDKs for Microsoft Discovery

Microsoft Discovery provides Java SDKs for data-plane and control-plane operations. Both artifacts are publicly available from Maven Central and can be integrated into Java applications.

| SDK | Artifact | Use |
|---|---|---|
| Data plane | [`com.azure:azure-ai-discovery`](https://central.sonatype.com/artifact/com.azure/azure-ai-discovery/1.0.0-beta.1) | Interact with Microsoft Discovery resources and perform runtime operations, such as working with workspaces, investigations, tasks, tools, bookshelves, and knowledge bases. |
| Control plane | [`com.azure.resourcemanager:azure-resourcemanager-discovery`](https://central.sonatype.com/artifact/com.azure.resourcemanager/azure-resourcemanager-discovery/1.0.0-beta.1) | Provision, configure, and manage Microsoft Discovery resources through Azure Resource Manager (ARM). |

## Prerequisites

Before you use the SDKs, you need:

- A Java project that uses Maven.
- An [Azure subscription](https://azure.microsoft.com/free/).
- A Microsoft Entra identity with permissions for the operations that you want to perform.
- For data-plane operations, an existing Microsoft Discovery workspace or bookshelf.
- For control-plane operations, the Azure subscription ID that contains or will contain your Microsoft Discovery resources.

## Install the SDKs

Install the data-plane SDK by adding this dependency to your `pom.xml` file:

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-ai-discovery</artifactId>
  <version>1.0.0-beta.1</version>
</dependency>
```

Install the control-plane SDK by adding this dependency to your `pom.xml` file:

```xml
<dependency>
  <groupId>com.azure.resourcemanager</groupId>
  <artifactId>azure-resourcemanager-discovery</artifactId>
  <version>1.0.0-beta.1</version>
</dependency>
```

To authenticate with Microsoft Entra ID, add the [Azure Identity client library](https://central.sonatype.com/artifact/com.azure/azure-identity) to your project.

## Related resources

- [Microsoft Discovery REST API reference](/rest/api/discovery/)
- [Azure SDK for Java documentation](/java/api/overview/azure/)
