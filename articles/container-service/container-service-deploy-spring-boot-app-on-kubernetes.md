---
title: Deploy a Spring Boot App on Kubernetes in Azure Container Service | Microsoft Docs
description: This tutorial will walk you though the steps to deploy a Spring Boot application in a Kubernetes cluster on Microsoft Azure.
services: ''
documentationcenter: java
author: rmcmurray
manager: erikre
editor: ''

ms.assetid: 
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: multiple
ms.devlang: Java
ms.topic: article
ms.date: 05/20/2017
ms.author: asirveda;robmcm

---

# Deploy a Spring Boot Application on a Kubernetes Cluster in the Azure Container Service

The **[Spring Framework]** is an open-source solution which helps Java developers create enterprise-level applications, and one of the more-popular projects which is built on top of that platform is [Spring Boot], which provides a simplified approach for creating stand-alone Java applications.

**[Kubernetes]** and **[Docker]** are open-source solutions which helps developers automate the deployment, scaling, and management of their applications which are running in containers.

This tutorial will walk you though combining these two popular, open-source technologies to develop and deploy a Spring Boot application to Microsoft Azure. More-specifically, this article will illustrate using *[Spring Boot]* for application development, *[Kubernetes]* for container deployment, and the [Azure Container Service (ACS)] to host your application.

### Prerequisites

In order to complete the steps in this tutorial, you need to have the following:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* The [Azure Command-Line Interface (CLI)].
* An up-to-date [Java Developer Kit (JDK)].
* Apache's [Maven] build tool (Version 3).
* The [Kubernetes Command-Line Interface (kubectl)].
* A [Git] client.
* A [Docker] client.

> [!NOTE]
>
> Due to the virtualization requirements of this tutorial, you cannot follow the steps in this article on a virtual machine; you must use a physical computer with virtualization features enabled.
>

## Create the Spring Boot on Docker Getting Started web app

The following steps will walk you through the steps that are required to create a simple Spring Boot web application and test it locally.

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

1. Clone the [Spring Boot on Docker Getting Started] sample project into the directory you just created; for example:
   ```
   git clone https://github.com/spring-guides/gs-spring-boot-docker.git
   ```

1. Change directory to the completed project; for example:
   ```
   cd gs-spring-boot-docker
   cd complete
   ```

1. Use Maven to build and run the app on your computer; for example:
   ```
   mvn package spring-boot:run
   ```

1. Test the web app by browsing to http://localhost:8080 using a web browser, or use the syntax like the following example if you have curl available:
   ```
   curl http://localhost:8080
   ```

1. You should see the following message displayed: **Hello Docker World**

   ![Browse Sample App Locally][SB01]

## Create an Azure Container Registry using the Azure CLI

1. Open a command prompt.

1. Log into your Azure account:
   ```azurecli
   az login
   ```

1. Create a new resource group for the Azure resources used in this tutorial.
   ```azurecli
   az group create --name=wingtiptoys-kubernetes --location=eastus
   ```

1. Create a new container registry in the resource group. The tutorial pushes the sample as a Docker image to this registry in later steps. Replace `wingtiptoysregistry` with a unique name for your registry.
   ```azurecli
   az acr create --admin-enabled --resource-group wingtiptoys-kubernetes--location eastus --name wingtiptoysRegistry --sku Basic
   ```

## Push your app to the container registry

1. Navigate to the configuration directory for your Maven installation (default ~/.m2/ or C:\Users\username\.m2) and open the *settings.xml* file with a text editor.

1. Retrieve the password for your container registry from the Azure CLI.
   ```azurecli
   az acr credential show --name wingtiptoysregistry --query passwords[0]
   ```

   ```json
   {
  "name": "password",
  "value": "=wC56EFwrfH=k:ymJSp-+2V.hGNd>kd4"
   }
   ```

1. Add your Azure Container Registry access settings from the previous section of this tutorial to the `<servers>` collection in the the *settings.xml* file; for example:

   ```xml
   <servers>
      <server>
         <id>wingtiptoysregistry</id>
         <username>wingtiptoysregistry</username>
         <password>=wC56EFwrfH=k:ymJSp-+2V.hGNd>kd4</password>
      </server>
   </servers>
   ```

1. Navigate to the completed project directory for your Spring Boot application, (e.g. "*C:\SpringBoot\gs-spring-boot-docker\complete*" or "*/users/robert/SpringBoot/gs-spring-boot-docker/complete*"), and open the *pom.xml* file with a text editor.

1. Update the `<properties>` collection in the *pom.xml* file with the login server value for your Azure Container Registry from the previous section of this tutorial; for example:

   ```xml
   <properties>
      <docker.image.prefix>myRegistry.azurecr.io</docker.image.prefix>
      <java.version>1.8</java.version>
   </properties>
   ```

1. Update the `<plugins>` collection in the *pom.xml* file so that the `<plugin>` contains the login server address and registry name for your Azure Container Registry from the previous section of this tutorial; for example:

   ```xml
   <plugin>
      <groupId>com.spotify</groupId>
      <artifactId>docker-maven-plugin</artifactId>
      <version>0.4.11</version>
      <configuration>
         <imageName>${docker.image.prefix}/${project.artifactId}</imageName>
         <dockerDirectory>src/main/docker</dockerDirectory>
         <resources>
            <resource>
               <targetPath>/</targetPath>
               <directory>${project.build.directory}</directory>
               <include>${project.build.finalName}.jar</include>
            </resource>
         </resources>
         <serverId>wingtiptoysregistry</serverId>
         <registryUrl>https://myRegistry.azurecr.io</registryUrl>
      </configuration>
   </plugin>
   ```

1. Navigate to the completed project directory for your Spring Boot application and run the following command to rebuild the application as a Docker container and push the image to your Azure Container Registry:

   ```
   mvn package docker:build -DpushImage
   ```

> [!NOTE]
>
> When you are pushing your Docker container to Azure, you may receive an error message that is similar to one of the following even though your Docker container was created successfully:
>
> * `[ERROR] Failed to execute goal com.spotify:docker-maven-plugin:0.4.11:build (default-cli) on project gs-spring-boot-docker: Exception caught: no basic auth credentials`
>
> * `[ERROR] Failed to execute goal com.spotify:docker-maven-plugin:0.4.11:build (default-cli) on project gs-spring-boot-docker: Exception caught: Incomplete Docker registry authorization credentials. Please provide all of username, password, and email or none.`
>
> If this happens, you may need to log into Azure from the Docker command line; for example:
>
> `docker login -u myRegistry -p "AbCdEfGhIjKlMnOpQrStUvWxYz" myRegistry.azurecr.io`
>
> You can then push your container from the command line; for example:
>
> `docker push myRegistry.azurecr.io/gs-spring-boot-docker`

## Create a Kubernetes Cluster on ACS using the Azure CLI

1. Create a Kubernetes cluster in the resource group; for example - the following command will create a *kubernetes* cluster in the *wingtiptoys-kubernetes* resource group, with *wingtiptoys-containerservice* as the cluster name, and *wingtiptoys-kubernetes* as the DNS prefix:
   ```
   az acs create --orchestrator-type=kubernetes --resource-group=wingtiptoys-kubernetes --name=wingtiptoys-containerservice --dns-prefix=wingtiptoys-kubernetes
   ```
   Note that this command may take a while to complete.

1. Download the cluster configuration information; for example - the following command will copy the configuration information to a file named *.kube/config* in your user profile directory:
   ```
   az acs kubernetes get-credentials --resource-group=wingtiptoys-kubernetes --name=wingtiptoys-containerservice
   ```

## Deploy your Docker container with your Spring Boot app to your Kubernetes cluster

In order to deploy your Docker container to your Kubernetes Cluster, you can use the Kubernetes configuration website, or you can use the Kubernetes command-line interface (kubectl).

### Deploying your Docker container by using the Kubernetes configuration website

1. Open a command prompt.

1. Run your container in the Kubernetes cluster by using the `kubectl run` command; at a minimum you will need to specify your container name, along with your login server and image name. For example:
   ```
   kubectl run gs-spring-boot-docker --image=wingtiptoysregistry.azurecr.io/gs-spring-boot-docker:latest
   ```
   In the above example:

   * The container name `gs-spring-boot-docker` is specified immediately after the `run` command

   * The `--image` parameter specifies the combined login server and image name as `wingtiptoysregistry.azurecr.io/gs-spring-boot-docker:latest`

1. Expose your Kubernetes cluster externally by using the `kubectl expose` command; you will need to specify your container name, the public-facing TCP port and the internal target port. For example:
   ```
   kubectl expose deployment gs-spring-boot-docker --type=LoadBalancer --port=80 --target-port=8080
   ```
   In the above example:

   * The container name `gs-spring-boot-docker` is specified immediately after the `expose deployment` command

   * The `--type` parameter specifies that the cluster will use a load balancer

   * The `--port` parameter specifies the public-facing TCP port of 80; external users will browse to this port

   * The `--target-port` parameter specifies the internal TCP port of 8080; external traffic from the load balancer will be redirected to this port on the containers

1. Open the configuration website for your Kubernetes cluster in your default browser:
   ```azurecli
   az acs kubernetes browse --resource-group=wingtiptoys-kubernetes --name=wingtiptoys-containerservice
   ```

1. Once your application has been deployed, you will see your Spring Boot application listed under **Services**.

   ![Kubernetes Services][KB06]

1. If you click on the link for **External endpoints**, you will see your Spring Boot application running on Azure.

   ![Kubernetes Services][KB07]

   ![Browse Sample App on Azure][SB02]


## Next steps

For more information about using Spring Boot applications on Azure, see the following articles:

* [Deploy a Spring Boot Application to the Azure App Service](../app-service/app-service-deploy-spring-boot-web-app-on-azure.md)

* [Running a Spring Boot Application on Linux in the Azure Container Service](../container-service/container-service-deploy-spring-boot-app-on-linux.md)

## Additional Resources

For more information about using Azure with Java, see the [Azure Java Developer Center] and the [Java Tools for Visual Studio Team Services].

For further details about the Spring Boot on Docker sample project, see [Spring Boot on Docker Getting Started].

The following links provide additional information about creating Spring Boot applications:

* For more details with getting started with your own Spring Boot applications, see the **Spring Initializr** at https://start.spring.io/.
* For more information about getting started with creating a simple Spring Boot application, see the Spring Initializr at https://start.spring.io/.

The following links provide additional information about using Kubernetes with Azure:

* [Get started with a Kubernetes cluster in Container Service](https://docs.microsoft.com/azure/container-service/container-service-kubernetes-walkthrough)
* [Using the Kubernetes web UI with Azure Container Service](https://docs.microsoft.com/azure/container-service/container-service-kubernetes-ui)

More information about using Kubernetes command-line interface is available in the **kubectl** user guide at <https://kubernetes.io/docs/user-guide/kubectl/>.

The Kubernetes website provides several articels which discussing using images in private registries and configuring secrets:

* [Configuring Service Accounts for Pods]
* [Namespaces]
* [Pulling an Image from a Private Registry]

For additional examples for how to use custom Docker images with Azure, see [Using a custom Docker image for Azure Web App on Linux].

<!-- URL List -->

[Azure Command-Line Interface (CLI)]: /cli/azure/overview
[Azure Container Service (ACS)]: https://azure.microsoft.com/services/container-service/
[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[Azure portal]: https://portal.azure.com/
[Create a private Docker container registry using the Azure portal]: /azure/container-registry/container-registry-get-started-portal
[Using a custom Docker image for Azure Web App on Linux]: /azure/app-service-web/app-service-linux-using-custom-docker-image
[Docker]: https://www.docker.com/
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Git]: https://github.com/
[Java Developer Kit (JDK)]: http://www.oracle.com/technetwork/java/javase/downloads/
[Java Tools for Visual Studio Team Services]: https://java.visualstudio.com/
[Kubernetes]: https://kubernetes.io/
[Kubernetes Command-Line Interface (kubectl)]: https://kubernetes.io/docs/user-guide/kubectl-overview/
[Maven]: http://maven.apache.org/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Boot on Docker Getting Started]: https://github.com/spring-guides/gs-spring-boot-docker
[Spring Framework]: https://spring.io/
[Configuring Service Accounts for Pods]: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
[Namespaces]: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
[Pulling an Image from a Private Registry]: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/

<!-- IMG List -->

[SB01]: ./media/container-service-deploy-spring-boot-app-on-kubernetes/SB01.png
[SB02]: ./media/container-service-deploy-spring-boot-app-on-kubernetes/SB02.png

[AR01]: ./media/container-service-deploy-spring-boot-app-on-kubernetes/AR01.png
[AR02]: ./media/container-service-deploy-spring-boot-app-on-kubernetes/AR02.png
[AR03]: ./media/container-service-deploy-spring-boot-app-on-kubernetes/AR03.png
[AR04]: ./media/container-service-deploy-spring-boot-app-on-kubernetes/AR04.png

[KB01]: ./media/container-service-deploy-spring-boot-app-on-kubernetes/KB01.png
[KB02]: ./media/container-service-deploy-spring-boot-app-on-kubernetes/KB02.png
[KB03]: ./media/container-service-deploy-spring-boot-app-on-kubernetes/KB03.png
[KB04]: ./media/container-service-deploy-spring-boot-app-on-kubernetes/KB04.png
[KB05]: ./media/container-service-deploy-spring-boot-app-on-kubernetes/KB05.png
[KB06]: ./media/container-service-deploy-spring-boot-app-on-kubernetes/KB06.png
[KB07]: ./media/container-service-deploy-spring-boot-app-on-kubernetes/KB07.png
