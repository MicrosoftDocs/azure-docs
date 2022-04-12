---
title: How to Use Tanzu Service Registry with Azure Spring Cloud Enterprise Tier
titleSuffix: Azure Spring Cloud Enterprise Tier
description: How to use Tanzu Service Registry with Azure Spring Cloud Enterprise Tier.
author: karlerickson
ms.author: yoterada
ms.service: spring-cloud
ms.topic: how-to
ms.date: 03/02/2022
ms.custom: devx-track-java
---

# Use Tanzu Service Registry

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article describes how to use VMware Tanzu® Service Registry with Azure Spring Cloud Enterprise.

The [Tanzu Service Registry](https://docs.vmware.com/en/Spring-Cloud-Services-for-VMware-Tanzu/2.1/spring-cloud-services/GUID-service-registry-index.html) is one of the commercial VMware Tanzu components. This component helps you apply the Service Discovery design pattern to your applications. Service Discovery is one of the main ideas of the microservices architecture. It can be difficult to hand-configure each client of a service or adopt some form of access convention, and these configurations and conventions can be brittle in production. Instead, you can use the Tanzu Service Registry to dynamically discover and invoke registered services in your application.

To use the Service Registry and Service Discovery in Spring Boot applications, you would normally follow the instructions in [Service Registration and Discovery](https://spring.io/guides/gs/service-registration-and-discovery/) in the Spring documentation.
Basically, you would create a Eureka Service Registry server yourself, start it, and then connect to the server from the Eureka Client. You would then access the Eureka Server from the client, and the registered Eureka Client information would be acquired and accessed. With Azure Spring Cloud Enterprise, however, you don't have to create or start the Eureka Server (Service Registry) yourself. You can use the Tanzu Service Registry by selecting it when you create your Azure Spring Cloud Enterprise tier instance.

## Prerequisites

Please enable Tanzu Service Registry and provision Azure Spring Cloud Enterprise in advance.
For more information, see [Quickstart: Provision an Azure Spring Cloud service instance using the Enterprise tier](./quickstart-provision-service-instance-enterprise.md)

   :::image type="content" source="./media/how-to-enterprise-service-registry/spring-cloud-enterprise-creation.png" alt-text="Azure Spring Cloud Enterprise VMWare Tanzu settings":::

  > [!NOTE]
  > To use Tanzu Service Registry, you must enable it when you provision your Azure Spring Cloud service instance. You cannot enable it after provisioning at this time.

In the following section, the resource group name and instance name used to create Azure Spring Cloud Enterprise are defined below. Please rewrite the contents of the variable according to the environment you created.

| Item                | Variable Name            |
|---------------------|--------------------------|
| Resource Group Name | $RESOURCE-GROUP          |
| Instance Name       | $AZURE_SPRING_CLOUD_NAME |

## Create Applications using Service Registry

### How to proceed this guide

This guide shows how to register a service for azure spring cloud Service Registry, and how to discover the service from another service with the following steps.

   :::image type="content" source="./media/how-to-enterprise-service-registry/how-to-guide-story.png" alt-text="How to guide Story":::

1. Create `Service A` and Learn the basics implementation of it
2. Deploy your `Service A` to `Azure Spring Cloud` and register it to Service Registry
3. Create another `Service B` and implement it to call `Service A`
4. Deploy `Service B` and register with `Service Registry`
5. Invoke `Service A` through `Service B`

### 1. Create and Implement `Service A ` with Spring Boot

Click following link "[Create Sample Service A](https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.6.4&packaging=jar&jvmVersion=11&groupId=foo.bar&artifactId=Sample%20Service%20A&name=Sample%20Service%20A&description=Demo%20project%20for%20Spring%20Boot&packageName=foo.bar.Sample%20Service%20A&dependencies=web,cloud-eureka)". Then, the following screen will be displayed.

   :::image type="content" source="./media/how-to-enterprise-service-registry/spring-initializr-with-config-dump.png" alt-text="Spring Initializr":::

Then, press the `GENERATE` button to get a sample project for Spring Boot with the following directory structure.

```text
├── HELP.md
├── mvnw
├── mvnw.cmd
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── foo
    │   │       └── bar
    │   │           └── Sample
    │   │               └── Service
    │   │                   └── A
    │   │                       └── SampleServiceAApplication.java
    │   └── resources
    │       ├── application.properties
    │       ├── static
    │       └── templates
    └── test
        └── java
            └── foo
                └── bar
                    └── Sample
                        └── Service
                            └── A
                                └── SampleServiceAApplicationTests.java
```


#### 1.1 Confirm the configuration of dependent libraries for the Service Registry Client (Eureka Client)

To be able to manage Service Registry and Discovery by using the Spring Cloud Service Registry, you must add dependencies to the `pom.xml` file in your application. Make sure that the pom.xml contains the following `spring-cloud-starter-netflix-eureka-client` dependencies. If not, add a dependency.

```xml
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
```


#### 1.2 Implement Service Registry Client

Add an `@EnableEurekaClient` annotation for `SampleServiceAApplication.java` and create it as an Eureka Client.

```java
    package foo.bar.Sample.Service.A;
    
    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;
    import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
    
    @SpringBootApplication
    @EnableEurekaClient
    public class SampleServiceAApplication {
    
        public static void main(String[] args) {
                SpringApplication.run(SampleServiceAApplication.class, args);
        }    
    }
```

With only the above setting the service in this Spring Boot acts as a Eureka Client.

#### 1.3 Creating a REST Endpoints for Testing

With the above, you can register the service to Service Registry, but you cannot verify it unless any actual services are implemented.
To create simple RESTful endpoints so that they can be called from the external service.  

Implement the code below.

```java
package foo.bar.Sample.Service.A;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ServiceAEndpoint {

    @GetMapping("/serviceA")
    public String getServiceA(){
        return "This is a result of Service A";
    }

    @GetMapping("/env")
    public Map<String, String> getEnv(){
        Map<String, String> env = System.getenv();
        return env;
    }
}
```

#### 1.4 Build a Spring Boot application

Now that you have a simple service, please compile and build the source code. Run the `mvn` command below.


```bash
mvn clean package
```

### 2. Deploy `Service A` and Register with Service Registry

In this section, explain how to deploy a `Service A` to `Azure Spring Cloud Enterprise` and register it with Service Registry.

#### 2.1 Create an Azure Spring Cloud application

First, create an application in Azure Spring Cloud.
To create the application, use the `az spring-cloud app create` command.
This time, we specify `--assign-endpoint` to grant a public IP for validation. This allows access from the external network.

```azurecli
az spring-cloud app create \
    -g $RESOURCE-GROUP \
    -s $AZURE_SPRING_CLOUD_NAME  \
    --name serviceA \
    --instance-count 1 \
    --memory 2Gi \
    --assign-endpoint
```

#### 2.2 How to connect to the Service Registry from App (About Binding)

Now you've created a service with Spring Boot and created an application in Azure Spring Cloud.
Since now we will deploy the application and confirm the operation, but before that, there is one thing that needs to be done to use Service Registry. It's about `binding` your application to the Service Registry so that you can get connection information to the Service Registry.

Typically, an `Eureka Client` needs to write the following connection information settings in the `application.properties` configuration file of a Spring Boot application so that you can connect to the server:

```text
eureka.client.service-url.defaultZone=http://eureka:8761/eureka/
```

However, if you write the above settings directly in your application, you will need to re-edit and rebuild the project again each time when the Service Registry server changes. To avoid this effort, Azure Spring Cloud allows you to get connection information to the service registry by "binding applications to the service registry" to refer to the service registry.

Specifically, after binding the application to the Service Registry, you can get the service registry connection information (`eureka.client.service-url.defaultZone`) from the Java environment variable. This allows you to connect to the Service Registry by loading the contents of the environment variables when the application starts.

In practice, the following environment variables are added to the JAVA_TOOL_OPTIONS:

```text
-Deureka.client.service-url.defaultZone=https://$AZURE_SPRING_CLOUD_NAME.svc.azuremicroservices.io/eureka/default/eureka 
```

#### 2.3 Bind a Service to Service Registry

Run the `az spring-cloud service-registry bind` command to bind the service to azure service registry. This allows you to bind the application to the Service Registry and will be able to connect to the server.

```azurecli
az spring-cloud service-registry bind \
    -g $RESOURCE-GROUP \
    -s $AZURE_SPRING_CLOUD_NAME \
    --app serviceA
```

You can also be set up the Application bindings from the Azure Portal.

   :::image type="content" source="./media/how-to-enterprise-service-registry/spring-cloud-service-registry-bind-app.png" alt-text="Application Binding":::

> [!NOTE]
> It will take a few minutes to propagate to all applications when it changes the service registry status.

> [!NOTE]
> If you change the binding/unbinding status, you need to restart or redeploy the application.

#### 2.4 Deploying an Applications to Azure Spring Cloud

Now that you've bound your application, you'll then deploy the Spring Boot artifact file (`Sample-Service-A-A-0.0.1-SNAPSHOT.jar`) to Azure Spring Cloud. To deploy, run the `az spring-cloud app deploy` command below.

```azurecli
az spring-cloud app deploy \
    -g $RESOURCE-GROUP \
    -s $AZURE_SPRING_CLOUD_NAME \
    --name serviceA \
    --artifact-path ./target/Sample-Service-A-0.0.1-SNAPSHOT.jar \
    --jvm-options="-Xms1024m -Xmx1024m"
```

Run the `az spring-cloud app list` command below to see if your deployment is successful.

```azurecli
az spring-cloud app list \
    -g $RESOURCE-GROUP \
    -s $AZURE_SPRING_CLOUD_NAME \
    -o table
```

When you run it, you will see the following results.

```text
Name                      Location       ResourceGroup           Public Url                                                           Production Deployment    Provisioning State    CPU    Memory    Running Instance    Registered Instance    Persistent Storage    Bind Service Registry    Bind Application Configuration Service
------------------------  -------------  ----------------------  -------------------------------------------------------------------  -----------------------  --------------------  -----  --------  ------------------  ---------------------  --------------------  -----------------------  ----------------------------------------
servicea                  southeastasia  $RESOURCE-GROUP         https://$AZURE_SPRING_CLOUD_NAME-servicea.azuremicroservices.io      default                  Succeeded             1      2Gi       1/1                 N/A                    -                     -                        -
```

#### 2.5 Confirm the `Service A` Application running

From the result of the above command, you can get the access URL listed in the `Public URL`. Please access the RESTful endpoint with (`/serviceA`). Then the following result will be returned.

```bash
curl https://AZURE_SPRING_CLOUD_NAME-servicea.azuremicroservices.io/serviceA
This is a result of Service A
```

The `Service A` also created a RESTful endpoint that displays a list of environment variables. Please access the endpoint with (`/env`) to see the environment variables.
The lists of environment variables will be displayed.

```bash
curl https://$AZURE_SPRING_CLOUD_NAME-servicea.azuremicroservices.io/env
```

If you look at the results, you can see that `eureka.client.service-url.defaultZone` has been added to the Java options (`JAVA_TOOL_OPTIONS`). This allows the application to register the service to the Service Registry and make it available from other services.

```text
"JAVA_TOOL_OPTIONS":"-Deureka.client.service-url.defaultZone=https://$AZURE_SPRING_CLOUD_NAME.svc.azuremicroservices.io/eureka/default/eureka
```

You can now register the service to the Service Registry (Eureka Server) in Azure Spring Cloud. Other services can now access the service by using service registry.

### 3. Implementing a new `Service B` that accesses to `Service A` through Service Registry

#### 3.1 Implementing `Service B` with Spring Boot

Same as in 1.1, please push the link of [Create Sample Service B](https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.6.4&packaging=jar&jvmVersion=11&groupId=foo.bar&artifactId=Sample%20Service%20B&name=Sample%20Service%20B&description=Demo%20project%20for%20Spring%20Boot&packageName=foo.bar.Sample%20Service%20B&dependencies=web,cloud-eureka) to create a new project for `Service B.` Then push the `GENERATE` button and get the new project.

#### 3.2 Implement the `Service B` as an Service Registry Client (Eureka Client)

Like `Service A`, add an annotation of `@EnableEurekaClient` in `Service B` and implement it as a Eureka Client.

```java
package foo.bar.Sample.Service.B;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;


@SpringBootApplication
@EnableEurekaClient
public class SampleServiceBApplication {

	public static void main(String[] args) {
		SpringApplication.run(SampleServiceBApplication.class, args);
	}
}
```

#### 3.3 Implement service endpoints in `Service B`

Next, implement a new service endpoint (`/invoke-serviceA`) which invokes the `Service A`. For simplicity, it implements with `RestTemplate` in the sample, and it returns the string with an additional string (`INVOKE SERVICE A FROM SERVICE B: "`) to indicate that it was called by `Service B`.

We've also implemented another endpoint (`/list-all`) for validation. This is implemented to ensure that the service is communicating correctly with the Service Registry. You can call this endpoint to get the lists of applications registered in the Service Registry.

```java
package foo.bar.Sample.Service.B;
import java.util.List;
import java.util.stream.Collectors;
import com.netflix.discovery.EurekaClient;
import com.netflix.discovery.shared.Application;
import com.netflix.discovery.shared.Applications;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class ServiceBEndpoint {
    @Autowired
    private EurekaClient discoveryClient;
    
    @GetMapping(value = "/invoke-serviceA")
    public String invokeServiceA() 
    {   
        RestTemplate  restTemplate = new RestTemplate();
        String response = restTemplate.getForObject("http://servicea/serviceA",String.class);   
        return "INVOKE SERVICE A FROM SERVICE B: " + response;
    }

    @GetMapping(value = "/list-all")    
    public List<String> listsAllServices() {
        Applications applications = discoveryClient.getApplications();
        List<Application> registeredApplications = applications.getRegisteredApplications();
        List<String> appNames = registeredApplications.stream().map(app -> app.getName()).collect(Collectors.toList());
        return appNames;
    }
}
```

#### 3.4 Build the `Service B`

Run the command below to build your Maven project.

```bash
mvn clean package
```

### 4. Deploy `Service B` to `Azure Spring Cloud`

Create an application in `Azure Spring Cloud` to deploy `Service B`.

```azurecli
az spring-cloud app create \
    -g $RESOURCE-GROUP \
    -s $AZURE_SPRING_CLOUD_NAME \
    --name serviceB \
    --instance-count 1 \
    --memory 2Gi \
    --assign-endpoint
```

After you create the application, it is time to bind the application to the Service Registry.

```azurecli
az spring-cloud service-registry bind \
    -g $RESOURCE-GROUP \
    -s $AZURE_SPRING_CLOUD_NAME \
    --app serviceB
```

After the binding is complete, deploy the service with following command.

```azurecli
az spring-cloud app deploy \
    -g $RESOURCE-GROUP \
    -s $AZURE_SPRING_CLOUD_NAME \
    --name serviceB \
    --artifact-path ./target/Sample-Service-B-0.0.1-SNAPSHOT.jar \   --jvm-options="-Xms1024m -Xmx1024m"
```

After the deployment is complete, check the status of the application with following command.

```azurecli
az spring-cloud app list \
    -g $RESOURCE-GROUP \
    -s $AZURE_SPRING_CLOUD_NAME \
    -o table
```

If `Service A` and `Service B` is deployed correctly, the following result will be displayed.

```text
Name      Location       ResourceGroup           Public Url                                                    Production Deployment    Provisioning State    CPU    Memory    Running Instance    Registered Instance    Persistent Storage    Bind Service Registry    Bind Application Configuration Service
--------  -------------  ----------------------  ------------------------------------------------------------  -----------------------  --------------------  -----  --------  ------------------  ---------------------  --------------------  -----------------------  ----------------------------------------
servicea  southeastasia  SpringCloud-Enterprise  https://$AZURE_SPRING_CLOUD_NAME-servicea.azuremicroservices.io  default                  Succeeded             1      2Gi       1/1                 1/1                    -                     default                  -
serviceb  southeastasia  SpringCloud-Enterprise  https://$AZURE_SPRING_CLOUD_NAME-serviceb.azuremicroservices.io  default                  Succeeded             1      2Gi       1/1                 1/1                    -                     default                  -
```

### 5. Invoke `Service A` from `Service B`

You can get the access URL of `Service B` from the result of the above command. Please access to the service endpoint with (`/invoke-serviceA`). You can see the string `INVOKE SERVICE A FROM SERVICE B: This is a result of Service A` in your terminal or browser.  
From the result, we were able to invoke `Service A` from `Service B` and see that the result was returned correctly.

```bash
curl https://$AZURE_SPRING_CLOUD_NAME-serviceb.azuremicroservices.io/invoke-serviceA

INVOKE SERVICE A FROM SERVICE B: This is a result of Service A
```

Let's review the implementation which invoke `Service A` in the source code of `Service B` again.

```java
    @GetMapping(value = "/invoke-serviceA")
    public String invokeServiceA() 
    {   
        RestTemplate  restTemplate = new RestTemplate();
        String response = restTemplate.getForObject("http://servicea/serviceA",String.class);   
        return "INVOKE SERVICE A FROM SERVICE B: " + response;
    }
```

Like this, you had invoked the `Service A` as `http://servicea`. The service name is equal to the name in which you specified the creation of the Azure Spring Cloud application. (e.g. `az spring-cloud app create --name ServiceA`)  
The application name matches the service name you register with the service registry, making it easier to manage the service name.

#### 5.1 Get some informations from Service Registry

Finally, access the `/list-all` endpoint and retrieve some information from the Service Registry. In this sample, it retrieves a list of services registered in the Service Registry.

```bash
 curl https://$AZURE_SPRING_CLOUD_NAME-serviceb.azuremicroservices.io/list-all       
["SERVICEA","EUREKA-SERVER","SERVICEB"]
```

In this way, detailed information can be obtained from the program as necessary.

## Next steps

- [Create Roles and Permissions](./how-to-permissions.md)
