---
title: How to use gRPC in Azure Spring Apps
description: Shows you how to use gRPC in Azure Spring Apps.
author: KarlErickson
ms.author: caihuarui
ms.service: spring-apps 
ms.topic: how-to
ms.date: 4/14/2023
ms.custom: devx-track-java
---

# How to use gRPC in Azure Spring Apps

This article shows you how to use gRPC in Azure Spring Apps by demonstrating its usage in a deployment of the [spring-petclinic-microservices](https://github.com/Azure-Samples/spring-petclinic-microservices) sample application.

This example modifies the customer's service to be a gRPC service, and shows you how to call a gRPC service using grpc curl from  the developer’s environment.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli). Install the Azure Spring Apps extension with the following command: `az extension add --name spring`

## Deploy Spring Petclinic Microservices

This article uses the Spring Petclinic sample to walk through the required steps. Use the following steps to deploy the sample application:

1. Follow the steps in [Deploy Spring Boot apps using Azure Spring Apps and MySQL](https://github.com/Azure-Samples/spring-petclinic-microservices#readme) until you reach the [Deploy Spring Boot applications and set environment variables](https://github.com/Azure-Samples/spring-petclinic-microservices#deploy-spring-boot-applications-and-set-environment-variables) section.

1. Use the following command to create an application to run in Azure Spring Apps:

   ```azurecli
   az spring app create \
      --resource-group <your-resource-group-name> \
      --service <your-Azure-Spring-Apps-instance-name> \
      --name <your-app-name> \
      --is-public true
   ```

## Assign a public endpoint

For customers-service, to facilitate testing, we assign a public endpoint temporarily. The public endpoint is used in the [grpcurl](https://github.com/fullstorydev/grpcurl) command as the hostname.

Use the following command to assign a public endpoint to your app. Be sure to replace the placeholders with your actual values.

```azurecli
az spring app update \
    --resource-group <resource-group-name> \
    --name <app-name> \
    --service <service-instance-name> \
    --assign-public-endpoint true
```

## Change the customers service to be a gRPC service

Before changing the customers service into a gRPC server, examine the current response to list all owners by adding `/owners` to the URL path.  

To change customers-service into gRPC, make the following modifications to the application's `pom.xml` file for customers service.

1. To prevent gRPC from being routed incorrectly using a static server address, delete the dependency for `spring-boot-starter-web` as shown in the following code block:

   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-web</artifactId>
   </dependency>
   ```

   If not removed, the application starts both a web server and a gRPC server and Azure Spring Apps rewrites the server port to 1025.

1. The following code shows the dependency and the build plugins required for gRPC.

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

## Create and run the proto file

Use the following steps to create and run the proto file to define message types and RPC methods.

1. Create a new file with the `.proto` extension that has the following content.

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

1. Use the following command to autogenerate the gRPC files, which creates the `CustomersServiceGrpc` service.

   ```azurecli
   mvn package
   ```

## Implement the gRPC service

Use the following class to implement the RPC methods defined in the proto file. Use the annotation `@GrpcService` to extend the autogenerated gRPC service base class and implement all the methods.

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

    ......
}
```

## Deploy to Azure Spring Apps

You can now configure the server and deploy the application.

1. Use the following command to configure the server to use port 1025 so that the ingress rule can work correctly.

   ```azurecli
   grpc.server.port=1025
   ```

   The customers-service is now a gRPC service.

1. Use the following command to deploy the newly built jar to Azure Spring Apps. The execution may take a few minutes to complete.

   ```azurelcli
    az spring app deploy --name ${CUSTOMERS_SERVICE} \
        --jar-path ${CUSTOMERS_SERVICE_JAR} \
        --jvm-options='-Xms2048m -Xmx2048m -Dspring.profiles.active=mysql' \
        --env MYSQL_SERVER_FULL_NAME=${MYSQL_SERVER_FULL_NAME} \
            MYSQL_DATABASE_NAME=${MYSQL_DATABASE_NAME} \
            MYSQL_SERVER_ADMIN_LOGIN_NAME=${MYSQL_SERVER_ADMIN_LOGIN_NAME} \
            MYSQL_SERVER_ADMIN_PASSWORD=${MYSQL_SERVER_ADMIN_PASSWORD}
   ```

Now that the app is redeployed, call a gRPC service from outside the Azure Spring Apps service instance. Test the endpoint to attempt list all owners by adding `/owners` to the URL path, which fails as expected because a gRPC service can't be visited with the HTTP protocol.

## Test the gRPC server with grpcurl commands

Use the following steps to test the gRPC server from your local environment.

1. Setting the backend protocol to use gRPC. For more information, see [Customize the ingress configuration in Azure Spring Apps](how-to-configure-ingress.md).  

1. You can use the following commands to check the gRPC server. The only port supported for gRPC calls from outside Azure Spring Apps is port `443`. If you're curious, the traffic is automatically routed to port 1025 on the backend as previously configured.

   ```bash
   grpcurl <SERVICE-NAME>-customers-service.azuremicroservices.io:443 list
   grpcurl <SERVICE-NAME>-customers-service.azuremicroservices.io:443  org.springframework.samples.petclinic.customers.grpc.CustomersService.findAll
       grpcurl -d "{\"ownerId\":7}" <SERVICE-NAME>-customers-service.azuremicroservices.io:443  org.springframework.samples.petclinic.customers.grpc.CustomersService.findOwner
   ```

1. Use the following curl and http commands to test the endpoint of the gRPC server:

   ```bash
   echo -n '0000000000' | xxd -r -p - frame.bin
   curl -v --insecure --raw -X POST -H "Content-Type: application/grpc" -H "TE: trailers" --data-binary @frame.bin <TEST-ENDPOINT>/org.springframework.samples.petclinic.customers.grpc.CustomersService/findAll
   ```

## Next steps

[Customize the ingress configuration in Azure Spring Apps](how-to-configure-ingress.md)
