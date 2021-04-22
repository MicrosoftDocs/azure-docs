---
title: Set up the Azure Service Fabric Mesh CLI 
description: Service Fabric Mesh Command Line Interface (CLI) is required to deploy and manage resources locally and in Azure Service Fabric Mesh. Here's how to set it up.
author: georgewallace
ms.author: gwallace
ms.date: 11/28/2018
ms.topic: conceptual
#Customer intent: As a developer, I need to prepare install the prerequisites to enable deployment to service fabric mesh.
---

# Set up Service Fabric Mesh CLI

> [!IMPORTANT]
> The preview of Azure Service Fabric Mesh has been retired. New deployments will no longer be permitted through the Service Fabric Mesh API. Support for existing deployments will continue through April 28, 2021.
> 
> For details, see [Azure Service Fabric Mesh Preview Retirement](https://azure.microsoft.com/updates/azure-service-fabric-mesh-preview-retirement/).

Service Fabric Mesh Command Line Interface (CLI) is required to deploy and manage resources locally and in Azure Service Fabric Mesh. Here's how to set it up.

There are three types of CLI that can be used and they are summarized in the table below.

| CLI Module | Target Environment |  Description | 
|---|---|---|
| az mesh | Azure Service Fabric Mesh | The primary CLI which allows you to deploy your applications and manage resources against the Azure Service Fabric Mesh environment. 
| sfctl | Local clusters | Service Fabric CLI that allows deployment and testing of Service Fabric resources against local clusters.  
| Maven CLI | Local clusters & Azure Service Fabric Mesh | A wrapper around `az mesh` and `sfctl` that allows Java developers to use a familiar command line experience for local and Azure development experience.  

For the preview, Azure Service Fabric Mesh CLI is written as an extension to Azure CLI. You can install it in the Azure Cloud Shell or a local installation of Azure CLI. 

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.67 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Install the Azure Service Fabric Mesh CLI

If you haven't done so already, install the Azure Service Fabric Mesh CLI extension module using the following command: 
 
```azurecli-interactive
az extension add --name mesh
```

If it's already installed, update your existing Azure Service Fabric Mesh CLI module using the following command:

```azurecli-interactive
az extension update --name mesh
```

## Install the Service Fabric CLI (sfctl) 

Follow instructions on [Set up Service Fabric CLI](../service-fabric/service-fabric-cli.md). The **sfctl** module can be used for deployment of applications based on the resource model against Service Fabric clusters on your local machine. 

## Install the Maven CLI 

In order to use the Maven CLI, the following needs to be installed on your machine: 

* [Java](https://www.azul.com/downloads/zulu/)
* [Maven](https://maven.apache.org/download.cgi)
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* Azure Mesh CLI (az mesh) - To target Azure Service Fabric Mesh 
* SFCTL (sfctl) - To target local clusters 

The Maven CLI for Service Fabric is still in preview. 

To use the Maven plugin in your Maven Java app, add the following snippet to your pom.xml file:

```XML
<project>
  ...
  <build>
    ...
    <plugins>
      ...
      <plugin>
        <groupId>com.microsoft.azure</groupId>
          <artifactId>azure-sfmesh-maven-plugin</artifactId>
          <version>0.1.0</version>
          <configuration>
            ...
          </configuration>
      </plugin>
    </plugins>
  </build>
</project>
```

Read the [Maven CLI reference](service-fabric-mesh-reference-maven.md) section to learn about detailed usage.

## Next steps

You can also set up your [Windows development environment](service-fabric-mesh-howto-setup-developer-environment-sdk.md).

Find answers to [common questions and issues](service-fabric-mesh-faq.md).

[azure-cli-install]: /cli/azure/install-azure-cli
