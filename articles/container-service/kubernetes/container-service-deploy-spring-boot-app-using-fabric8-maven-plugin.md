---
title: Deploy a Spring Boot app using the fabric8 Maven plugin
description: This tutorial walks you though the steps to deploy a Spring Boot application on Microsoft Azure using the fabric8 plugin for Apache Maven.
services: container-service
documentationcenter: java
author: rmcmurray
manager: routlaw
editor: ''

ms.assetid: 
ms.service: container-service
ms.workload: na
ms.tgt_pltfrm: multiple
ms.devlang: Java
ms.topic: article
ms.date: 09/15/2017
ms.author: yuwzho;robmcm
ms.custom: 

---

# Deploy a Spring Boot app using the fabric8 Maven plugin

**[fabric8]** is an open-source solution that is built on **[Kubernetes]**, which helps developers create applications in Linux containers.

This tutorial walks you through using the fabric8 plugin for Maven to develop to deploy an application to a Linux host in the [Azure Container Service (ACS)].

## Prerequisites

In order to complete the steps in this tutorial, you need to have the following prerequisites:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* The [Azure Command-Line Interface (CLI)].
* An up-to-date [Java Developer Kit (JDK)].
* Apache's [Maven] build tool (Version 3).
* A [Git] client.
* A [Docker] client.

> [!NOTE]
>
> Due to the virtualization requirements of this tutorial, you cannot follow the steps in this article on a virtual machine; you must use a physical computer with virtualization features enabled.
>

## Create the Spring Boot on Docker Getting Started web app

The following steps walk you through building a Spring Boot web application and testing it locally.

1. Open a command-prompt and create a local directory to hold your application, and change to that directory; for example:
   ```
   md C:\SpringBoot
   cd C:\SpringBoot
   ```
   -- or --
   ```
   md /users/robert/SpringBoot
   cd /users/robert/SpringBoot
   ```

1. Clone the [Spring Boot on Docker Getting Started] sample project into the directory.
   ```
   git clone https://github.com/spring-guides/gs-spring-boot-docker.git
   ```

1. Change directory to the completed project.
   ```
   cd gs-spring-boot-docker
   cd complete
   ```

1. Use Maven to build and run the sample app.
   ```
   mvn package spring-boot:run
   ```

1. Test the web app by browsing to http://localhost:8080, or with the following `curl` command:
   ```
   curl http://localhost:8080
   ```
   You should see a **Hello Docker World** message displayed.

## Install the Kubernetes command-line interface and create an Azure resource group using the Azure CLI

1. Open a command prompt.

1. Type the following command to log in to your Azure account:
   ```azurecli
   az login
   ```
   Follow the instructions to complete the login process
   
   The Azure CLI will display a list of your accounts; for example:

   ```json
   [
     {
       "cloudName": "AzureCloud",
       "id": "00000000-0000-0000-0000-000000000000",
       "isDefault": false,
       "name": "Windows Azure MSDN - Visual Studio Ultimate",
       "state": "Enabled",
       "tenantId": "00000000-0000-0000-0000-000000000000",
       "user": {
       "name": "Gena.Soto@wingtiptoys.com",
       "type": "user"
     }
   ]
   ```

1. If you do not already have the Kubernetes command-line interface (`kubectl`) installed, you can install using the Azure CLI; for example:
   ```azurecli
   az acs kubernetes install-cli
   ```

   > [!NOTE]
   >
   > Linux users may have to prefix this command with `sudo` since it deploys the Kubernetes CLI to `/usr/local/bin`.
   >
   > If you already have `kubectl`) installed, you may see an error message similar to the following example if your version of `kubectl` is too old:
   > ```
   > error: group map[autoscaling:0x0000000000 batch:0x0000000000 certificates.k8s.io:0x0000000000 extensions:0x0000000000 storage.k8s.io:0x0000000000 :0x0000000000 apps:0x0000000000 authentication.k8s.io:0x0000000000 policy:0x0000000000 rbac.authorization.k8s.io:0x0000000000 federation:0x0000000000 authorization.k8s.io:0x0000000000 componentconfig:0x0000000000] is already registered
   > ```
   > If this happens, you will need to reinstall `kubectl`.
   >

1. Create a resource group for the Azure resources that you will use in this tutorial; for example:
   ```azurecli
   az group create --name=wingtiptoys-kubernetes --location=eastus
   ```
   Where:  
      * *wingtiptoys-kubernetes* is a unique name for your resource group  
      * *eastus* is an appropriate geographic location for your application  

   The Azure CLI will display the results of your resource group creation; for example:  

   ```json
   {
     "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/wingtiptoys-kubernetes",
     "location": "eastus",
     "managedBy": null,
     "name": "wingtiptoys-kubernetes",
     "properties": {
       "provisioningState": "Succeeded"
     },
     "tags": null
   }
   ```

## Create a private Azure container registry using the Azure CLI

1. Create a private Azure container registry in your resource group to host your Docker image; for example:
   ```azurecli
   az acr create --admin-enabled --resource-group wingtiptoys-kubernetes --location eastus --name wingtiptoysregistry --sku Basic
   ```
   Where:  
      * *wingtiptoys-kubernetes* is the name of your resource group from earlier in this article  
      * *wingtiptoysregistry* is a unique name for your private registry

   The Azure CLI will display the results of your registry creation; for example:  

   ```json
   {
     "adminUserEnabled": true,
     "creationDate": "2017-09-15T01:00:00.000000+00:00",
     "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/wingtiptoys-kubernetes/providers/Microsoft.ContainerRegistry/registries/wingtiptoysregistry",
     "location": "eastus",
     "loginServer": "wingtiptoysregistry.azurecr.io",
     "name": "wingtiptoysregistry",
     "provisioningState": "Succeeded",
     "resourceGroup": "wingtiptoys-kubernetes",
     "sku": {
       "name": "Basic",
       "tier": "Basic"
     },
     "storageAccount": {
       "name": "wingtiptoysregistr000000"
     },
     "tags": {},
     "type": "Microsoft.ContainerRegistry/registries"
   }
   ```

1. Retrieve the password for your container registry from the Azure CLI.
   ```azurecli
   az acr credential show --name wingtiptoysregistry --query passwords[0]
   ```

   The Azure CLI will display the password for your registry; for example:  

   ```json
   {
     "name": "password",
     "value": "AbCdEfGhIjKlMnOpQrStUvWxYz"
   }
   ```

1. Navigate to the configuration directory for your Maven installation (default ~/.m2/ or C:\Users\username\.m2) and open the *settings.xml* file with a text editor.

1. Add your Azure Container Registry id and password to a new `<server>` collection in the *settings.xml* file.
The `id` and `username` are the name of the registry. Use the `password` value from the previous command (without quotes).

   ```xml
   <servers>
      <server>
         <id>wingtiptoysregistry</id>
         <username>wingtiptoysregistry</username>
         <password>AbCdEfGhIjKlMnOpQrStUvWxYz</password>
      </server>
   </servers>
   ```

1. Navigate to the completed project directory for your Spring Boot application (for example, "*C:\SpringBoot\gs-spring-boot-docker\complete*" or "*/users/robert/SpringBoot/gs-spring-boot-docker/complete*"), and open the *pom.xml* file with a text editor.

1. Update the `<properties>` collection in the *pom.xml* file with the login server value for your Azure Container Registry.

   ```xml
   <properties>
      <docker.image.prefix>wingtiptoysregistry.azurecr.io</docker.image.prefix>
      <java.version>1.8</java.version>
   </properties>
   ```

1. Update the `<plugins>` collection in the *pom.xml* file so that the `<plugin>` contains the login server address and registry name for your Azure Container Registry.

   ```xml
   <plugin>
     <groupId>com.spotify</groupId>
     <artifactId>dockerfile-maven-plugin</artifactId>
     <version>1.3.4</version>
     <configuration>
       <repository>${docker.image.prefix}/${project.artifactId}</repository>
         <resources>
           <resource>
             <targetPath>/</targetPath>
             <directory>${project.build.directory}</directory>
             <include>${project.build.finalName}.jar</include>
           </resource>
         </resources>
       <serverId>wingtiptoysregistry2</serverId>
       <registryUrl>https://wingtiptoysregistry2.azurecr.io</registryUrl>
     </configuration>
   </plugin>
   ```

1. Navigate to the completed project directory for your Spring Boot application, and run the following Maven command to build the Docker container and push the image to your registry:

   ```
   mvn package dockerfile:build -DpushImage
   ```

   Maven will display the results of your build; for example:  

   ```
   [INFO] ----------------------------------------------------
   [INFO] BUILD SUCCESS
   [INFO] ----------------------------------------------------
   [INFO] Total time: 38.113 s
   [INFO] Finished at: 2017-09-15T02:00:00-07:00
   [INFO] Final Memory: 47M/338M
   [INFO] ----------------------------------------------------
   ```

## Create a Kubernetes cluster using the Azure CLI

1. Create a Kubernetes cluster in your new resource group; for example:  
   ```azurecli 
   az acs create --orchestrator-type kubernetes --resource-group wingtiptoys-kubernetes --name wingtiptoys-cluster --generate-ssh-keys
   ```
   Where:  
      * *wingtiptoys-kubernetes* is the name of your resource group from earlier in this article  
      * *wingtiptoys-cluster* is a unique name for your Kubernetes cluster

   The Azure CLI will display the results of your cluster creation; for example:  

   ```json
   {
     "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/wingtiptoys-kubernetes/providers/Microsoft.Resources/deployments/azurecli0000000000.00000000000",
     "name": "azurecli0000000000.00000000000",
     "properties": {
       "correlationId": "00000000-0000-0000-0000-000000000000",
       "mode": "Incremental",
       "parameters": {
         "clientSecret": {
           "type": "SecureString"
         }
       },
       "providers": [
         {
           "namespace": "Microsoft.ContainerService",
           "resourceTypes": [
             {
               "locations": [
                 "eastus"
               ],
               "resourceType": "containerServices"
             }
           ]
         }
       ],
       "provisioningState": "Succeeded",
       "timestamp": "2017-09-15T01:00:00.000000+00:00"
     },
     "resourceGroup": "wingtiptoys-kubernetes"
   }
   ```

1. Download your credentials for your new Kubernetes cluster; for example:  
   ```azurecli 
   az acs kubernetes get-credentials --resource-group=wingtiptoys-kubernetes --name wingtiptoys-cluster
   ```

1. Verify your connection with the following command:
   ```azurecli 
   kubectl get nodes
   ```

   You should see a list of nodes and statuses like the following example:

   ```
   NAME                    STATUS                     AGE       VERSION
   k8s-agent-00000000-0    Ready                      5h        v1.6.6
   k8s-agent-00000000-1    Ready                      5h        v1.6.6
   k8s-agent-00000000-2    Ready                      5h        v1.6.6
   k8s-master-00000000-0   Ready,SchedulingDisabled   5h        v1.6.6
   k8s-master-00000000-1   Ready,SchedulingDisabled   5h        v1.6.6
   k8s-master-00000000-2   Ready,SchedulingDisabled   5h        v1.6.6
   ```

## Configure your Spring Boot app to use the fabric8 Maven plugin

1. Navigate to the completed project directory for your Spring Boot application, (for example: "*C:\SpringBoot\gs-spring-boot-docker\complete*" or "*/users/robert/SpringBoot/gs-spring-boot-docker/complete*"), and open the *pom.xml* file with a text editor.

1. Update the `<plugins>` collection in the *pom.xml* file to add the fabric8 Maven plugin:

   ```xml
   <plugin>
     <groupId>io.fabric8</groupId>
     <artifactId>fabric8-maven-plugin</artifactId>
     <version>3.5.30</version>
     <executions>
       <execution>
       <goals>
         <goal>resource</goal>
         <goal>build</goal>
         <goal>push</goal>
         <goal>apply</goal>
       </goals>
       </execution>
     </executions>
     <configuration>
       <ignoreServices>true</ignoreServices>
       <registry>${docker.registry}</registry>
     </configuration>
   </plugin>
   ```

1. Run the following Maven command to build the Kubernetes resource list file:

   ```azurecli
   mvn fabric8:resource
   ```

   This command merges all Kubernetes resource yaml files under the *project/src/fabric8* folder to a YAML file that contains a Kubernetes resource list, which can be applied to Kubernetes cluster directly or export to a helm chart.

   Maven will display the results of your build; for example:  

   ```
   [INFO] ----------------------------------------------------
   [INFO] BUILD SUCCESS
   [INFO] ----------------------------------------------------
   [INFO] Total time: 16.744 s
   [INFO] Finished at: 2017-09-15T02:35:00-07:00
   [INFO] Final Memory: 30M/290M
   [INFO] ----------------------------------------------------
   ```

1. Run the following Maven command to apply the resource list file to your Kubernetes cluster:

   ```azurecli
   mvn fabric8:apply
   ```

   Maven will display the results of your build; for example:  

   ```
   [INFO] ----------------------------------------------------
   [INFO] BUILD SUCCESS
   [INFO] ----------------------------------------------------
   [INFO] Total time: 14.814 s
   [INFO] Finished at: 2017-09-15T02:41:00-07:00
   [INFO] Final Memory: 35M/288M
   [INFO] ----------------------------------------------------
   ```

1. Navigate to the main source directory for your Spring Boot application, (for example: "*C:\SpringBoot\gs-spring-boot-docker\complete\src\main*" or "*/users/robert/SpringBoot/gs-spring-boot-docker/complete/src/main*"), and create a new folder named "*fabric8*".

1. Create three YAML fragment files in the new *fabric8* folder:

   a. Create a file named **deployment.yml** with the following contents:
      ```yaml
      apiVersion: extensions/v1beta1
      kind: Deployment
      metadata:
        name: ${project.artifactId}
        labels:
          run: gs-spring-boot-docker
      spec:
        replicas: 1
        selector:
          matchLabels:
            run: gs-spring-boot-docker
        strategy:
          rollingUpdate:
            maxSurge: 1
            maxUnavailable: 1
          type: RollingUpdate
        template:
          metadata:
            labels:
              run: gs-spring-boot-docker
          spec:
            containers:
            - image: ${docker.registry}/fabric8/${project.artifactId}:latest
              name: gs-spring-boot-docker
              imagePullPolicy: Always
              ports:
              - containerPort: 8080
            imagePullSecrets:
              - name: ${dockerKeyName}
      ```

   b. Create a file named **secrets.yml** with the following contents:
      ```yaml
      apiVersion: v1
      kind: Secret
      metadata:
        name: ${dockerKeyName}
        namespace: default
        annotations:
          maven.fabric8.io/dockerServerId: ${docker.registry}
      type: kubernetes.io/dockercfg
      ```

   c. Create a file named **service.yml** with the following contents:
      ```yaml
      apiVersion: v1
      kind: Service
      metadata:
        name: ${project.artifactId}
        labels:
          expose: "true"
      spec:
        ports:
        - port: 80
          targetPort: 8080
        type: LoadBalancer
      ```

## Build and deploy your Spring Boot app using the fabric8 Maven plugin

1. Compile your application by using the following Maven command:

   ```azurecli
   mvn compile
   ```

   This command will invoke the `fabric8:resource` goal to create a Kubernetes resource list file.

   Maven will display the results of your compliation; for example:  
   ```
   [INFO] ----------------------------------------------------
   [INFO] BUILD SUCCESS
   [INFO] ----------------------------------------------------
   [INFO] Total time: 12.974 s
   [INFO] Finished at: 2017-09-15T02:49:00-07:00
   [INFO] Final Memory: 30M/183M
   [INFO] ----------------------------------------------------
   ```

1. Deploy you application to your Kubernetes cluster by using the following Maven command:

   ```azurecli
   mvn install
   ```

   This command will invoke the `fabric8:apply` goal to apply Kubernetes the resource list file to your cluster.

   Maven will display the results of your deployment; for example:  
   ```
   [INFO] ----------------------------------------------------
   [INFO] BUILD SUCCESS
   [INFO] ----------------------------------------------------
   [INFO] Total time: 01:41 min
   [INFO] Finished at: 2017-09-15T02:54:00-07:00
   [INFO] Final Memory: 40M/317M
   [INFO] ----------------------------------------------------
   ```

## Next steps

For more information about using Spring Boot applications on Azure, see the following articles:

* [Deploy a Spring Boot Application to the Azure App Service](../../app-service/app-service-deploy-spring-boot-web-app-on-azure.md)
* [Deploy a Spring Boot application on Linux in the Azure Container Service](container-service-deploy-spring-boot-app-on-linux.md)
* [Deploy a Spring Boot Application on a Kubernetes Cluster in the Azure Container Service](container-service-deploy-spring-boot-app-on-kubernetes.md)

For more information about using Azure with Java, see the [Azure Java Developer Center] and the [Java Tools for Visual Studio Team Services].

For further details about the Spring Boot on Docker sample project, see [Spring Boot on Docker Getting Started].

For help with getting started with your own Spring Boot applications, see the **Spring Initializr** at https://start.spring.io/.

For more information about getting started with creating a simple Spring Boot application, see the Spring Initializr at https://start.spring.io/.

For additional examples for how to use custom Docker images with Azure, see [Using a custom Docker image for Azure Web App on Linux].

<!-- URL List -->

[Azure Command-Line Interface (CLI)]: /cli/azure/overview
[Azure Container Service (ACS)]: https://azure.microsoft.com/services/container-service/
[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[Azure portal]: https://portal.azure.com/
[Create a private Docker container registry using the Azure portal]: /azure/container-registry/container-registry-get-started-portal
[Using a custom Docker image for Azure Web App on Linux]: /azure/app-service-web/app-service-linux-using-custom-docker-image
[Docker]: https://www.docker.com/
[fabric8]: https://fabric8.io/
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Git]: https://github.com/
[Java Developer Kit (JDK)]: http://www.oracle.com/technetwork/java/javase/downloads/
[Java Tools for Visual Studio Team Services]: https://java.visualstudio.com/
[Kubernetes]: https://kubernetes.io/
[Maven]: http://maven.apache.org/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Boot on Docker Getting Started]: https://github.com/spring-guides/gs-spring-boot-docker
[Spring Framework]: https://spring.io/

<!-- IMG List -->

