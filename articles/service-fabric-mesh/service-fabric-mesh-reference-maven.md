---
title: Azure Service Fabric Mesh Maven Reference | Microsoft Docs
description: Contains the reference for how to use the Maven plugin for Service Fabric Mesh 
services: service-fabric-mesh
keywords: maven, java, cli 
author: suhuruli
ms.author: suhuruli
ms.date: 11/26/2018
ms.topic: reference
ms.service: service-fabric-mesh
manager: subramar
---

# Maven Plugin for Service Fabric Mesh
[![Maven Central](https://img.shields.io/maven-central/v/com.microsoft.azure/azure-functions-maven-plugin.svg)]()

## Table of Content
  - [Prerequisites](#prerequisites)
  - [Goals](#goals)
      - [sf-mesh:init](#sf-meshinit)
      - [sf-mesh:add-service](#sf-meshaddservice)
      - [sf-mesh:add-network](#sf-meshaddnetwork)
      - [sf-mesh:add-gateway](#sf-meshaddgateway)
      - [sf-mesh:add-secret](#sf-meshaddsecret)
      - [sf-mesh:add-secretvalue](#sf-meshaddsecretvalue)
      - [sf-mesh:add-volume](#sf-meshaddvolume)
      - [sf-mesh:deploy](#sf-meshdeploy)
      - [sf-mesh:deploytocluster](#sf-mesh:deploytocluster) 
  - [Usage](#usage)
  - [Common Configuration](#common-configuration)
  - [Configurations](#configurations)
  - [How-To](#how-to)
    - [Initialize Maven project for Mesh](#init-sf-mesh)
    - [Add a new resource to the project](#add-new-resource-to-current-project)
    - [Run the application locally](#run-application-locally)
    - [Deploy to Azure Mesh](#deploy-to-azure-mesh)

## Goals

### `sf-mesh:init`
- Generates a `servicefabric` folder that contains an `appresources` folder that has the `application.yaml` file. 

### `sf-mesh:addservice`
- Creates a folder under  that stores a services YAML file. 

### `sf-mesh:addnetwork`
- Will create a `network` YAML with the provided network name under the `appresources` folder 

### `sf-mesh:addgateway`
- Will create a `gateway` YAML with the provided gateway name under the `appresources` folder 

### `sf-mesh:addsecret`
- Will create a `secret` YAML with the provided secret name under the `appresources` folder 

### `sf-mesh:addsecretvalue`
- Will create a `secretvalue` YAML with the provided secretvalue name under the `appresources` folder 

### `sf-mesh:deploy`
- Will create a folder (`cloud`) which contains the deployment JSONs for the application 
- Deploys application to the local cluster or to the Azure Service Fabric Mesh environment 

### `sf-mesh:deploy`
- Will create a folder (`local`) which contains the deployment JSONs for the application applicable for Service Fabric clusters
- Deploys application to the local cluster
 

## Usage

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
          <artifactId>azure-sf-maven-plugin</artifactId>
          <version>1.0.0-beta</version>
          <configuration>
            ...
          </configuration>
      </plugin>
    </plugins>
  </build>
</project>
```

## Common Configuration

The Maven plugin currently doesn't support common configurations of Maven Plugins for Azure. Support for this feature is coming in the next release. 

## How-To

### Initialize Maven project with Mesh resource
Run below command to create an application resource 

```cmd
mvn sf-mesh:init -DapplicationName=helloworldserver
```

- Creates a folder called `servicefabric->appresources` in your root folder that contains an application YAML named `app_helloworldserver`

### Add a new network to your application 
Run the command below to create a network. 

```cmd
mvn sf-mesh:addnetwork -DapplicationName=helloworldserver -DserviceName=helloworldservice -DnetworkName=helloworldservicenetwork -DnetworkAddressPrefix=10.0.0.4/22
```

- Creates a network YAML in folder `servicefabric->appresources` named `network_helloworldservicenetwork`
- Specifies which service will be a part of this network: `helloworldservice`

### Add a new service to your application 
Run the command below to create a service. 

```cmd
mvn sf-mesh:addservice -DapplicationName=helloworldserver -DserviceName=helloworldservice -DimageName=helloworldserver:latest -DlistenerPort=8080 -DnetworkRef=helloworldservicenetwork
```

- Creates a service YAML in folder `servicefabric->helloworldservice` named `service_helloworldservice` that references `helloworldservicenetwork` & the `helloworldserver` app
- Listens on port 8080
- Pulls container image from local registry called ***helloworldserver:latest***. Can use any image repository. 

### Add a new gateway resource to your application 

```cmd
mvn sf-mesh:addgateway -DapplicationName=helloworldserver -DdestinationNetwork=helloworldservicenetwork -DgatewayName=helloworldgateway -DlistenerName=helloworldserviceListener -DserviceName=helloworldservice -DsourceNetwork=open -DtcpPort=80
```

- Creates a new gateway YAML in folder `servicefabric->appresources` named `gateway_helloworldgateway`
- References `helloworldservicelistener` as the service listener that is listening to calls from this gateway. Also references the `helloworldservice` as the service, `helloworldservicenetwork` as the network and `helloworldserver` as the application. 
- Uses `open` networking mode 
- Listens for requests on port 80

### Add a new volume to your application 
Run the command below to create a volume. 

```cmd
mvn sf-mesh:addvolume -DvolumeAccountKey=key -DvolumeAccountName=name -DvolumeName=vol1 -DvolumeShareName=share
```

- Creates a volume YAML in folder `servicefabric->appresources` named `volume_vol1`
- Sets properties for required parameters, `volumeAccountKey`, and `volumeShareName` as above
- For more information on how to reference this created volume, visit the following, [Deploy App using Azure Files Volume](service-fabric-mesh-howto-deploy-app-azurefiles-volume.md)

### Add a new secret resource to your application  
Run the command below to create a secret. 

```cmd
mvn sf-mesh:addsecret -DsecretName=secret1
```

- Creates a secret YAML in folder `servicefabric->appresources` named `secret_secret1`
- For more information on how to reference this created secret, visit the following, [Manage Secrets](service-fabric-mesh-howto-manage-secrets.md

### Add a new secretvalue resource to your application  
Run the command below to create a secretvalue. 

```cmd
mvn sf-mesh:addsecretvalue -DsecretValue=someVal -DsecretValueName=secret1/v1
```

### Run the application locally 

With the help of goal `sf-mesh:deploy`, you can run the application locally using the command below:

```cmd
mvn sf-mesh:deploytocluster
```

The deployment to local clusters step assumes you have a local Service Fabric cluster up and running. Local Service Fabric cluster for resources is currently supported only on [Windows](service-fabric-mesh-howto-setup-developer-environment-sdk.md).

### Deploy applications to Azure Mesh 

Directly deploy to target Mesh by running

```cmd
mvn sf-mesh:deploy -DdeploymentType=cloud -DresourceGroup=todoapprg -Dlocation=eastus
```

- Creates a resource group called `todoapprg` if it doesn't exist. Next, it will deploy the merged YAML files (in the `cloud` folder) to the Azure Service Fabric Mesh environment. 