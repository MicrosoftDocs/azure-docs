# How to use gRPC in Azure Spring Apps
This article shows you how to use gRPC in Azure Spring Apps.

## Prerequisites
This tutorial is based on [spring-petclinic-microservices](https://github.com/Azure-Samples/spring-petclinic-microservices), before you start this tutorial, you need to deploy the spring-petclinic-microservices first. Among them, we modify customers-service to be gRPC service, and show you how to call a gRPC service using grpc curl from  the developer’s environment. 

For customers-service, to facilitate testing, we assign a public endpoint temporarily. The public endpoint is used in the [grpcurl](https://github.com/fullstorydev/grpcurl) command as the hostname. 

Here we can get the list of all owners by adding ‘/owners’ to the URL path. Before we change it into a gRPC server, let us look at the current response, we can see all owners in the response as shown on the page. 

Now, let us change customers-service to use gRPC.

## Change the customers-service to be a gRPC service
- To change customers-service into gRPC, first modify its `pom.xml` file. 
We need to delete the dependency for `spring-boot-starter-web`, otherwise this application starts both a web server and a gRPC server, and Azure Spring Apps will rewrite the server port to 1025, which will prevent gRPC from being routed correctly with a static server address. Then we need to add the following dependencies and build plugins for gRPC. 
```
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
                        com.google.protobuf:protoc:3.3.0:exe:${os.detected.classifier}
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
- Next, add the related proto file to define message types and RPC methods and run `mvn package` to auto-generate gRPC service files
```
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
We can see that `CustomersServiceGrpc` is generated by the gRPC proto plugin after the execution of the mvn command. 

- After the files are generated, implement the gRPC service with the RPC methods defined in the proto file.
 Use annotation @GrpcService and extend the auto-generated gRPC service base class and implement all the methods. 
```
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
- Then configure the server port to 1025, so that the ingress rule can work correctly. Now, we can run the command ‘mvn package’ to build the gRPC server jar. 
```
grpc.server.port=1025
```
So far, we've finished the modification for customers-service, and it's now a gRPC service. 

- Use the newly built jar to deploy the app to Azure Spring Apps with CLI commands.
This execution may take a few minutes. 
```
 az spring app deploy --name ${CUSTOMERS_SERVICE} \
        --jar-path ${CUSTOMERS_SERVICE_JAR} \
        --jvm-options='-Xms2048m -Xmx2048m -Dspring.profiles.active=mysql' \
        --env MYSQL_SERVER_FULL_NAME=${MYSQL_SERVER_FULL_NAME} \
              MYSQL_DATABASE_NAME=${MYSQL_DATABASE_NAME} \
              MYSQL_SERVER_ADMIN_LOGIN_NAME=${MYSQL_SERVER_ADMIN_LOGIN_NAME} \
              MYSQL_SERVER_ADMIN_PASSWORD=${MYSQL_SERVER_ADMIN_PASSWORD}
```

Now, the app has been redeployed, let’s try to call a gRPC service from outside the Azure Spring Apps service instance. Take a look at the endpoint of customers-service with the path ‘/owners’ in the URL again, and it fails as expected. Because it's now a gRPC service, we can't visit it with the HTTP protocol. 

## Set the ingress configuration
For gRPC service, we can use grpc curl to test the gRPC server from the developer’s environment. First refer to the tutorial [ingress configurations](how-to-configure-ingress), go to the ingress settings tab on the portal, and set the backend protocol to gRPC.  

## Using grpcurl to call the customers-service from the local environment
You can use the following commands to check the gRPC server. Note that **443** is the only port supported for gRPC calls from outside Azure Spring Apps. If you're curious, the traffic is automatically routed to port 1025 on the backend as we configured before. 
```
	grpcurl <SERVICE-NAME>-customers-service.azuremicroservices.io:443 list
	grpcurl <SERVICE-NAME>-customers-service.azuremicroservices.io:443  org.springframework.samples.petclinic.customers.grpc.CustomersService.findAll
	grpcurl -d "{\"ownerId\":7}" <SERVICE-NAME>-customers-service.azuremicroservices.io:443  org.springframework.samples.petclinic.customers.grpc.CustomersService.findOwner

```

## FAQ
- How to test the gRPC server with the test endpoints?
  - You can use curl and http to call the test endpoint of the gRPC server.
```
echo -n '0000000000' | xxd -r -p - frame.bin
curl -v --insecure --raw -X POST -H "Content-Type: application/grpc" -H "TE: trailers" --data-binary @frame.bin <TEST-ENDPOINT>/org.springframework.samples.petclinic.customers.grpc.CustomersService/findAll
```

## Next steps
[More ingress configurations](how-to-configure-ingress)