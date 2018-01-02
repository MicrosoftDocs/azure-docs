---
title: Use Service Fabric Client REST API specification to generate and use Java Client | Microsoft Docs
description: Use Service Fabric Client REST API specification to generate and use Java Client
services: service-fabric
documentationcenter: java
author: rapatchi
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: java
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/27/2017
ms.author: rapatchi

---
# Use Service Fabric Client REST API specification to generate and use Java Client

In this article we describe how to generate and use Java clients using the Service Fabric Client REST API specification.

## Generating the Java Client code using AutoRest

Follow these steps to install and generate Java Client code using AutoRest tool.

1. Install nodejs and NPM on your machine
  ```bash
  sudo apt-get install npm
  sudo apt install nodejs
  ```
2. Install AutoRest using NPM.
  ```bash
  npm install -g autorest
  ```
3. Fork and clone [azure-rest-api-specs](https://github.com/Azure/azure-rest-api-specs)  repository in your local machine and go to the cloned location on the termial of your machine.

4. Run the following commands on the terminal to generate the client code.
  ```bash
  cd specification\servicefabric\data-plane\Microsoft.ServiceFabric\stable\6.0
  autorest --input-file= servicefabric.json --java --output-folder=[output-folder-name] --namespace=[namespace-of-generated-client]
  ```
> [!NOTE]
> If your cluster version is 5.6.* then go to 5.6 folder instead of 6.0.
>
After this step you would find two folders ``models``, ``implemenation`` and two files ``ServiceFabricClientAPIs.java`` and ``package-info.java`` generated in the ``[output-folder-name]`` folder.

## Including and using the generated client in your code

1. Add the generated code appropriately into your project.
2. Add following dependency into your project.
```
	GroupId:  com.microsoft.rest
	Artifactid: client-runtime
	Version: 1.2.1
```
For example, if you are using maven build system include the following in your ``pom.xml`` file:
```xml
	<dependency>
	  <groupId>com.microsoft.rest</groupId>
	  <artifactId>client-runtime</artifactId>
	  <version>1.2.1</version>
	</dependency>
```

3. Create a RestClient using the following code:
```java
	RestClient simpleClient = new RestClient.Builder()
		.withBaseUrl("http://<cluster-ip or name:port>")
		.withResponseBuilderFactory(new ServiceResponseBuilder.Factory())
		.withSerializerAdapter(new JacksonAdapter())
		.build();
	ServiceFabricClientAPIs client = new ServiceFabricClientAPIsImpl(simpleClient);
```
4. Use the client object and make the appropriate calls as required.

## Understanding the generated code
For every API you will find 4 variations of implementation. If there are optional parameters then you would find 4 more variations including those optional parameters. For example consider the API ``removeReplica``.
 1. public void removeReplica(String nodeName, UUID partitionId, String replicaId, Boolean forceRemove, Long timeout):
	* This is the synchronous variant of the API call
 2. public ServiceFuture<Void> removeReplicaAsync(String nodeName, UUID partitionId, String replicaId, Boolean forceRemove, Long timeout, final ServiceCallback<Void> serviceCallback):
	* This variant of API call can be used if you want to use future based asynchronous programming and use callbacks
 3. public Observable<Void> removeReplicaAsync(String nodeName, UUID partitionId, String replicaId)
	* This variant of API call can be used if you want to use reactive asynchronous programming
 4. public Observable<ServiceResponse<Void>> removeReplicaWithServiceResponseAsync(String nodeName, UUID partitionId, String replicaId)
	* This variant of API call can be used if you want to use reactive asynchronous programming and deal with RAW rest response
