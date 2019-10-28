---
title:  Azure Service Fabric Java Client APIs | Microsoft Docs
description: Generate and use Service Fabric Java client APIs using Service Fabric client REST API specification
services: service-fabric
documentationcenter: java
author: rapatchi
manager: chackdan
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: java
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/27/2017
ms.author: rapatchi

---
# Azure Service Fabric Java Client APIs

Service Fabric client APIs allows deploying and managing microservices based applications and containers in a Service Fabric cluster on Azure, on-premises, on local development machine or in other cloud. This article describes how to generate and use Service Fabric Java client APIs on top of the Service Fabric client REST APIs

## Generate the client code using AutoRest

[AutoRest](https://github.com/Azure/autorest) is a tool that generates client libraries for accessing RESTful web services. Input to AutoRest is a specification that describes the REST API using the OpenAPI Specification format. [Service Fabric client REST APIs](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/servicefabric/data-plane) follow this specification .

Follow the steps mentioned below to generate Service Fabric Java client code using the AutoRest tool.

1. Install nodejs and NPM on your machine

	If you are using Linux then:
	```bash
	sudo apt-get install npm
	sudo apt install nodejs
	```
	If you are using Mac OS X then:
	```bash
	brew install node
	```

2. Install AutoRest using NPM.
	```bash
	npm install -g autorest
	```

3. Fork and clone [azure-rest-api-specs](https://github.com/Azure/azure-rest-api-specs)  repository in your local machine and go to the cloned location from the terminal of your machine.


4. Go to the location mentioned below in your cloned repo.
	```bash
	cd specification\servicefabric\data-plane\Microsoft.ServiceFabric\stable\6.0
	```

	> [!NOTE]
	> If your cluster version is not 6.0.* then go to the appropriate directory in the stable folder.
	>	

5. Run the following autorest command to generate the java client code.
	
	```bash
	autorest --input-file= servicefabric.json --java --output-folder=[output-folder-name] --namespace=[namespace-of-generated-client]
	```
   Below is an example demonstrating the usage of autorest.
   
	```bash
	autorest --input-file=servicefabric.json --java --output-folder=java-rest-api-code --namespace=servicefabricrest
	```
   
   The following command takes ``servicefabric.json`` specification file as input and generates java client code in ``java-rest-api-	 code`` folder and encloses the code in  ``servicefabricrest`` namespace. After this step you would find two folders ``models``, ``implementation`` and two files ``ServiceFabricClientAPIs.java`` and ``package-info.java`` generated in the ``java-rest-api-code`` folder.


## Include and use the generated client in your project

1. Add the generated code appropriately into your project. We recommend that you create a library using the generated code and include this library in your project.
2. If you are creating a library then include the following dependency in your library's project. If you are following a different approach then include the dependency appropriately.

	```
		GroupId:  com.microsoft.rest
		Artifactid: client-runtime
		Version: 1.2.1
	```
	For example, if you are using Maven build system include the following in your ``pom.xml`` file:

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
4. Use the client object and make the appropriate calls as required. Here are some examples which demonstrate the usage of client object. We assume that the application package is built and uploaded into image store before using the below API's.
	* Provision an application
	
		```java
			ApplicationTypeImageStorePath imageStorePath = new ApplicationTypeImageStorePath();
			imageStorePath.withApplicationTypeBuildPath("<application-path-in-image-store>");
			client.provisionApplicationType(imageStorePath);
		```
	* Create an application

		```java
			ApplicationDescription applicationDescription = new ApplicationDescription();
			applicationDescription.withName("<application-uri>");
			applicationDescription.withTypeName("<application-type>");
			applicationDescription.withTypeVersion("<application-version>");
			client.createApplication(applicationDescription);
		```

## Understanding the generated code
For every API you will find four overloads of implementation. If there are optional parameters then you would find four more variations including those optional parameters. For example consider the API ``removeReplica``.
 1. **public void removeReplica(String nodeName, UUID partitionId, String replicaId, Boolean forceRemove, Long timeout)**
	* This is the synchronous variant of the removeReplica API call
 2. **public ServiceFuture\<Void> removeReplicaAsync(String nodeName, UUID partitionId, String replicaId, Boolean forceRemove, Long timeout, final ServiceCallback\<Void> serviceCallback)**
	* This variant of API call can be used if you want to use future based asynchronous programming and use callbacks
 3. **public Observable\<Void> removeReplicaAsync(String nodeName, UUID partitionId, String replicaId)**
	* This variant of API call can be used if you want to use reactive asynchronous programming
 4. **public Observable\<ServiceResponse\<Void>> removeReplicaWithServiceResponseAsync(String nodeName, UUID partitionId, String replicaId)**
	* This variant of API call can be used if you want to use reactive asynchronous programming and deal with RAW rest response

## Next steps
* Learn about [Service Fabric REST APIs](https://docs.microsoft.com/rest/api/servicefabric/)

