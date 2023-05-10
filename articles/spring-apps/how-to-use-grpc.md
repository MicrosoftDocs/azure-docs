---
title: How to use gRPC in Azure Spring Apps
description: Shows you how to use gRPC in Azure Spring Apps.
author: KarlErickson
ms.author: caihuarui
ms.service: spring-apps 
ms.topic: how-to
ms.date: 5/9/2023
ms.custom: devx-track-java
---

# How to use gRPC in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier (all tiers)

This article and video shows you how to use the Remote Procedure Call framework (gRPC) protocol in Azure Spring Apps. 

<br>

> [!VIDEO https://www.youtube.com/embed/yNvoQ4YIDCI]

For an example to modify and deploy, this article uses the [Azure-Samples/spring-petclinic-microservices](https://github.com/Azure-Samples/spring-petclinic-microservices) sample application.

From your local environment, you create a gRPC service by modifying the  `customers-service` microservice, deploy it to Azure Spring Apps, and use grpc curl commands to test the service by making calls to gRPC methods.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli). Use the following command to install the Azure Spring Apps extension.

  ```azurecli
  az extension add --name spring
  ```

- [Git](https://git-scm.com/downloads).
- [Microsoft Build of OpenJDK](/java/openjdk/download#openjdk-17) Version 17.
- [Maven](https://maven.apache.org/download.cgi).
- An Azure Spring Apps instance. For more information, see [Quickstart: Provision an Azure Spring Apps service instance](quickstart-provision-service-instance.md).

## Deploy the sample application

An application is required to proceed. Use the following steps to deploy the Spring Petclinic microservices project:

1. In your local environment, use the following command to clone the sample application repository.

   ```bash
   git clone https://github.com/azure-samples/spring-petclinic-microservices
   ```

1. Use the following commands to change the directory and build the project:

   ```bash
   cd spring-petclinic-microservices
   mvn clean package -DskipTest    
   ```

   The deployment can take a few minutes to complete. When the project is compiled, you should have individual JAR files for each service in their respective folders.

1. Use the steps in [Unit-1 - Deploy and monitor Spring Boot apps](https://github.com/Azure-Samples/spring-petclinic-microservices#unit-1---deploy-and-monitor-spring-boot-apps) to complete the deployment needed for this demonstration.

## Assign a public endpoint

To facilitate testing, assign a public endpoint. The public endpoint is used in the grpcurl commands as the hostname. For more information, see [fullstorydev/grpcurl](https://github.com/fullstorydev/grpcurl).

Use the following command to assign a public endpoint.

```azurecli
az spring app update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <app-name> \
    --assign-public-endpoint true
```

You can also use the Azure portal to assign a public endpoint. For more information, see [Expose applications on Azure Spring Apps to the internet from a public network](how-to-access-app-from-internet-virtual-network.md).

## Modify an existing service to be a gRPC service

Before the service is changed into a gRPC server, look at the Owners page of a deployed PetClinic instance application examine the current pet owners data. You can also list all owners by adding `/owners` to the URL path, which you can get from the Overview page for the `customers-service` page in the Azure portal.

Use the following steps to change customers-service into a gRPC server.

1. Locate *pom.xml* in the *spring-petclinic-customers-service* folder.

1. In the *pom.xml* file, delete the following element that defines the `spring-boot-starter-web` dependency:

   ```xml
   <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
   </dependency>
   ```

   If this dependency isn't removed, the application starts both a web server and a gRPC server. Azure Spring Apps would then rewrite the server port to 1025, which would prevent gRPC from being routed correctly with a static server address.

1. Add the following elements, which define the dependency and build plugins required for gRPC, to the *pom.xml* file:

   ```xml
   <dependencies>
   <!-- For both gRPC server and client -->
        <dependency>
            <groupId>net.devh</groupId>
            <artifactId>grpc-spring-boot-starter</artifactId>
            <version>2.5.1.RELEASE</version>
            <exclusions>
                <exclusion>
                    <groupId>io.grpc</groupId>
                    <artifactId>grpc-netty-shaded</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
   <!-- For the gRPC server (only) -->
       <dependency>
            <groupId>net.devh</groupId>
            <artifactId>grpc-server-spring-boot-starter</artifactId>
            <version>2.5.1.RELEASE</version>
            <exclusions>
                <exclusion>
                    <groupId>io.grpc</groupId>
                    <artifactId>grpc-netty-shaded</artifactId>
                </exclusion>
          </exclusions>
        </dependency>
        <dependency>
            <groupId>net.devh</groupId>
            <artifactId>grpc-client-spring-boot-autoconfigure</artifactId>
            <version>2.5.1.RELEASE</version>
            <type>pom</type>
        </dependency>
   </dependencies>
   <build>
       <extensions>
            <extension>
                <groupId>kr.motd.maven</groupId>
                <artifactId>os-maven-plugin</artifactId>
                <version>1.6.1</version>
           </extension>
       </extensions>
       <plugins>
           <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
           </plugin>
           <plugin>
                <groupId>org.xolstice.maven.plugins</groupId>
                <artifactId>protobuf-maven-plugin</artifactId>
                <version>0.6.1</version>
                <configuration>
                    <protocArtifact>
                        com.google.protobuf:protoc:3.3.0:exe:${os.detected.lassifier}
                    </protocArtifact>
                    <pluginId>grpc-java</pluginId>
                    <pluginArtifact>
                        io.grpc:protoc-gen-grpc-java:1.4.0:exe:${os.detected.classifier}
                    </pluginArtifact>
                </configuration>
               <executions>
                    <execution>
                        <goals>
                            <goal>compile</goal>
                            <goal>compile-custom</goal>
                       </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
   </build>
   ```

## Build the gRPC service

Use the following steps to create and run a proto file that defines the message types and RPC interface methods.

1. Create a new file with the *proto* extension in the source code folder that has the following content:

   ```JSON
   syntax = "proto3";
   option java_multiple_files = true;
   package org.springframework.samples.petclinic.customers.grpc;
   import "google/protobuf/empty.proto";

   message OwnerRequest {
       int32 ownerId = 1;
   }

   message PetRequest {
       int32 petId = 1;
   }

   message OwnerResponse {
       int32 id = 1;
       string firstName = 2;
       string lastName = 3;
       string address = 4;
       string city = 5;
       string telephone = 6;
       repeated PetResponse pets = 7;
   }

   message PetResponse {
       int32 id = 1;
       string name = 2;
       string birthDate = 3;
       PetType type = 4;
       OwnerResponse owner = 5;
    }

    message PetType {
       int32 id = 1;
       string name = 2;
    }

    message PetTypes {
       repeated PetType ele = 1;
    }

    message Owners {
       repeated OwnerResponse ele = 1;
    }

    service CustomersService {
       rpc createOwner(OwnerResponse) returns (OwnerResponse);
       rpc findOwner(OwnerRequest) returns (OwnerResponse);
       rpc findAll(google.protobuf.Empty) returns (Owners);
       rpc updateOwner(OwnerResponse) returns (google.protobuf.Empty);
       rpc getPetTypes(google.protobuf.Empty) returns (PetTypes);
       rpc createPet(PetResponse) returns (PetResponse);
       rpc updatePet(PetResponse) returns (google.protobuf.Empty);
       rpc findPet(PetRequest) returns (PetResponse);
   }
   ```

1. Use the following command to generate the gRPC service files:

   ```bash
    mvn package 
   ```

   You can implement the gRPC service with the RPC methods defined in the proto file. In the sample application, the generated files include *CustomersServiceGrpc.java*, as defined by the gRPC proto plugin.

## Implement the gRPC service

In your development environment, create a java class file for the project with the following content that implements the RPC methods defined in the proto file. Use the annotation `@GrpcService` to extend the autogenerated gRPC service base class to implement its methods.

The following example shows an implementation of some of the methods.

```java
@GrpcService
@Slf4j
public class CustomersServiceImpl extends CustomersServiceGrpc.CustomersServiceImplBase {
    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private PetRepository petRepository;

    @Override
    public void createOwner(OwnerResponse request, StreamObserver<OwnerResponse> responseObserver) {
        Owner owner = new Owner();
        BeanUtils.copyProperties(request, owner);
        ownerRepository.save(owner);

        responseObserver.onNext(request);
        responseObserver.onCompleted();
    }
}
```

## Configure the server port to 1025

Use the following command to configure the server to use port 1025 so that the ingress rule can work correctly.

```bash
grpc.server.port=1025
```

The setting `grpc.server.port=1025` is added to the *application.yaml* or *application.properties* in the *spring-petclinic-customers-service/src/main/resources* folder.

## Create the gRPC service

Use the following command to build the gRPC server Jar file.

```bash
mvn package
```

The modification of `customers-service` is completed, and it's now a gRPC service.

## Deploy the application to Azure Spring Apps

You can now configure the server and deploy the application.

Use the following command to deploy the newly built Jar file to your Azure Spring Apps instance:

```azurecli
az spring app deploy --name ${CUSTOMERS_SERVICE} \
    --jar-path ${CUSTOMERS_SERVICE_JAR} \
    --jvm-options='-Xms2048m -Xmx2048m -Dspring.profiles.active=mysql' \
    --env MYSQL_SERVER_FULL_NAME=${MYSQL_SERVER_FULL_NAME} \
        MYSQL_DATABASE_NAME=${MYSQL_DATABASE_NAME} \
        MYSQL_SERVER_ADMIN_LOGIN_NAME=${MYSQL_SERVER_ADMIN_LOGIN_NAME} \
        MYSQL_SERVER_ADMIN_PASSWORD=${MYSQL_SERVER_ADMIN_PASSWORD}
```

The deployment can take a few minutes to completed.

Now that the application is deployed in Azure Spring Apps, call a gRPC service from outside the Azure Spring Apps service instance. As you did earlier, test the `customers-service` endpoint to attempt list all pet owners by adding `/owners` to the URL path. This time the test fails as expected because a gRPC service can't be accessed using the HTTP protocol.

## Set the ingress configuration

Set the backend protocol to use gRPC so that you can use grpc curl commands to test the gRPC server. Update your application's ingress settings. For more information, see [Customize the ingress configuration in Azure Spring Apps](how-to-configure-ingress.md).

## Call the sample application from a local environment

You can use grpcurl to test the gRPC server. The only port supported for gRPC calls from outside Azure Spring Apps is port `443`. The traffic is automatically routed to port 1025 on the backend.

Use the following grpc curl commands to check the gRPC server by listing all the pet owners.

   ```bash
   grpcurl <SERVICE-NAME>-customers-service.azuremicroservices.io:443 list
   grpcurl <SERVICE-NAME>-customers-service.azuremicroservices.io:443  org.springframework.samples.petclinic.customers.grpc.CustomersService.findAll
       grpcurl -d "{\"ownerId\":7}" <SERVICE-NAME>-customers-service.azuremicroservices.io:443  org.springframework.samples.petclinic.customers.grpc.CustomersService.findOwner
   ```

## FAQ

- How do I test the endpoint?

   Use the following curl and HTTP commands to test the endpoint of the gRPC server:

   ```bash
   echo -n '0000000000' | xxd -r -p - frame.bin
   curl -v --insecure --raw -X POST -H "Content-Type: application/grpc" -H "TE: trailers" --data-binary @frame.bin <TEST-ENDPOINT>/org.springframework.samples.petclinic.customers.grpc.CustomersService/findAll
   ```

## Next steps

[Customize the ingress configuration in Azure Spring Apps](how-to-configure-ingress.md)
