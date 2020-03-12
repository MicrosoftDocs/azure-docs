---
title: Azure Service Fabric Mesh Maven reference 
description: Contains the reference for how to use the Maven plugin for Service Fabric Mesh 
author: suhuruli
ms.author: suhuruli
ms.date: 11/26/2018
ms.topic: reference
---
# Maven Plugin for Service Fabric Mesh

## Prerequisites

- Java SDK
- Maven
- Azure CLI with mesh extension
- Service Fabric CLI

## Goals

### `azure-sfmesh:init`
- Creates a `servicefabric` folder that contains an `appresources` folder which has the `application.yaml` file. 

### `azure-sfmesh:addservice`
- Creates a folder inside `servicefabric` folder with the service name and creates the service's YAML file. 

### `azure-sfmesh:addnetwork`
- Generates a `network` YAML with the provided network name in the `appresources` folder 

### `azure-sfmesh:addgateway`
- Generates a `gateway` YAML with the provided gateway name in the `appresources` folder 

#### `azure-sfmesh:addvolume`
- Generates a `volume` YAML with the provided volume name in the
`appresources` folder.

### `azure-sfmesh:addsecret`
- Generates a `secret` YAML with the provided secret name in the `appresources` folder 

### `azure-sfmesh:addsecretvalue`
- Generates a `secretvalue` YAML with the provided secret and secret value name in the `appresources` folder 

### `azure-sfmesh:deploy`
- Merges the yamls from the `servicefabric` folder and creates an Azure Resource Manager template JSON in the current folder.
- Deploys all the resources to the Azure Service Fabric Mesh environment 

### `azure-sfmesh:deploytocluster`
- Creates a folder (`meshDeploy`) which contains the deployment JSONs generated from yamls which are applicable for Service Fabric clusters
- Deploys all the resources to the Service Fabric cluster
 

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
          <artifactId>azure-sfmesh-maven-plugin</artifactId>
          <version>0.1.0</version>
      </plugin>
    </plugins>
  </build>
</project>
```

## Common Configuration

The Maven plugin currently doesn't support common configurations of Maven Plugins for Azure.

## How-To

### Initialize Maven project for Azure Service Fabric Mesh
Run the following command to create the application resource YAML file.

```cmd
mvn azure-sfmesh:init -DapplicationName=helloworldserver
```

- Creates a folder called `servicefabric->appresources` in your root folder that contains an application YAML named `app_helloworldserver`

### Add resource to your application

#### Add a new network to your application
Run the command below to create a network resource yaml. 

```cmd
mvn azure-sfmesh:addnetwork -DnetworkName=helloworldservicenetwork -DnetworkAddressPrefix=10.0.0.0/22
```

- Creates a network YAML in folder `servicefabric->appresources` named `network_helloworldservicenetwork`

#### Add a new service to your application
Run the command below to create a service yaml. 

```cmd
mvn azure-sfmesh:addservice -DapplicationName=helloworldserver -DserviceName=helloworldservice -DimageName=helloworldserver:latest -DlistenerPort=8080 -DnetworkRef=helloworldservicenetwork
```

- Creates a service YAML in folder `servicefabric->helloworldservice` named `service_helloworldservice` that references `helloworldservicenetwork` & the `helloworldserver` app
- The service would listen on port 8080
- The service would be using ***helloworldserver:latest*** as it's container image.

#### Add a new gateway resource to your application
Run the command below to create a gateway resource yaml. 

```cmd
mvn azure-sfmesh:addgateway -DapplicationName=helloworldserver -DdestinationNetwork=helloworldservicenetwork -DgatewayName=helloworldgateway -DlistenerName=helloworldserviceListener -DserviceName=helloworldservice -DsourceNetwork=open -DtcpPort=80
```

- Creates a new gateway YAML in folder `servicefabric->appresources` named `gateway_helloworldgateway`
- References `helloworldservicelistener` as the service listener that is listening to calls from this gateway. Also references the `helloworldservice` as the service, `helloworldservicenetwork` as the network and `helloworldserver` as the application. 
- Listens for requests on port 80

#### Add a new volume to your application
Run the command below to create a volume resource yaml. 

```cmd
mvn azure-sfmesh:addvolume -DvolumeAccountKey=key -DvolumeAccountName=name -DvolumeName=vol1 -DvolumeShareName=share
```

- Creates a volume YAML in folder `servicefabric->appresources` named `volume_vol1`
- Sets properties for required parameters, `volumeAccountKey`, and `volumeShareName` as above
- For more information on how to reference this created volume, visit the following, [Deploy App using Azure Files Volume](service-fabric-mesh-howto-deploy-app-azurefiles-volume.md)

#### Add a new secret resource to your application
Run the command below to create a secret resource yaml. 

```cmd
mvn azure-sfmesh:addsecret -DsecretName=secret1
```

- Creates a secret YAML in folder `servicefabric->appresources` named `secret_secret1`
- For more information on how to reference this created secret, visit the following, [Manage Secrets](service-fabric-mesh-howto-manage-secrets.md)

#### Add a new secretvalue resource to your application
Run the command below to create a secretvalue resource yaml. 

```cmd
mvn azure-sfmesh:addsecretvalue -DsecretValue=someVal -DsecretValueName=secret1/v1
```

- Create a secretvalue YAML in folder `servicefabric->appresources` named `secretvalue_secret1_v1`

### Run the application locally

With the help of goal `azure-sfmesh:deploytocluster`, you can run the application locally using the command below:

```cmd
mvn azure-sfmesh:deploytocluster
```

By default this goal deploys resources to local cluster. If you are deploying to local cluster, it assumes you have a local Service Fabric cluster up and running. Local Service Fabric cluster for resources is currently supported only on [Windows](service-fabric-mesh-howto-setup-developer-environment-sdk.md).

- Creates JSONs from yamls which are applicable for Service Fabric clusters
- Deploys then to the Cluster endpoint

### Deploy application to Azure Service Fabric Mesh

With the help of goal `azure-sfmesh:deploy`, you can deploy to Service Fabric Mesh Environment by running the command below:

```cmd
mvn azure-sfmesh:deploy -DresourceGroup=todoapprg -Dlocation=eastus
```

- Creates a resource group called `todoapprg` if it doesn't exist.
- Creates an Azure Resource Manager template JSON by merging the YAMLs. 
- Deploys the JSON to the Azure Service Fabric Mesh environment.
