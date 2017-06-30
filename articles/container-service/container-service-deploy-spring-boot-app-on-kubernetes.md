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

The **[Spring Framework]** is a popular open-source framework that helps Java developers create web, mobile, and API applications. This tutorial uses a sample app created using [Spring Boot], a convention-driven approach for using Spring to get started quickly.

**[Kubernetes]** and **[Docker]** are open-source solutions that help developers automate the deployment, scaling, and management of their applications  running in containers.

This tutorial walks you though combining these two popular, open-source technologies to develop and deploy a Spring Boot application to Microsoft Azure. More specifically, you use *[Spring Boot]* for application development, *[Kubernetes]* for container deployment, and the [Azure Container Service (ACS)] to host your application.

### Prerequisites

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

1. You should see the following message displayed: **Hello Docker World**

   ![Browse Sample App Locally][SB01]

## Create an Azure Container Registry using the Azure CLI

1. Open a command prompt.

1. Log in to your Azure account:
   ```azurecli
   az login
   ```

1. Create a resource group for the Azure resources used in this tutorial.
   ```azurecli
   az group create --name=wingtiptoys-kubernetes --location=eastus
   ```

1. Create a private Azure container registry in the resource group. The tutorial pushes the sample app as a Docker image to this registry in later steps. Replace `wingtiptoysregistry` with a unique name for your registry.
   ```azurecli
   az acr create --admin-enabled --resource-group wingtiptoys-kubernetes--location eastus \
    --name wingtiptoysregistry --sku Basic
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
  "value": "AbCdEfGhIjKlMnOpQrStUvWxYz"
   }
   ```

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
         <registryUrl>https://wingtiptoysregistry.azurecr.io</registryUrl>
      </configuration>
   </plugin>
   ```

1. Navigate to the completed project directory for your Spring Boot application and run the following command to build the Docker container and push the image to the registry:

   ```
   mvn package docker:build -DpushImage
   ```

> [!NOTE]
>
>  You may receive an error message that is similar to one of the following when Maven pushes the image to Azure:
>
> * `[ERROR] Failed to execute goal com.spotify:docker-maven-plugin:0.4.11:build (default-cli) on project gs-spring-boot-docker: Exception caught: no basic auth credentials`
>
> * `[ERROR] Failed to execute goal com.spotify:docker-maven-plugin:0.4.11:build (default-cli) on project gs-spring-boot-docker: Exception caught: Incomplete Docker registry authorization credentials. Please provide all of username, password, and email or none.`
>
> If you get this error, log in to Azure from the Docker command line.
>
> `docker login -u wingtiptoysregistry -p "AbCdEfGhIjKlMnOpQrStUvWxYz" wingtiptoysregistry.azurecr.io`
>
> Then push your container:
>
> `docker push wingtiptoysregistry.azurecr.io/gs-spring-boot-docker`

## Create a Kubernetes Cluster on ACS using the Azure CLI

1. Create a Kubernetes cluster in Azure Container Service. The following command creates a *kubernetes* cluster in the *wingtiptoys-kubernetes* resource group, with *wingtiptoys-containerservice* as the cluster name, and *wingtiptoys-kubernetes* as the DNS prefix:
   ```azurecli
   az acs create --orchestrator-type=kubernetes --resource-group=wingtiptoys-kubernetes \ 
    --name=wingtiptoys-containerservice --dns-prefix=wingtiptoys-kubernetes
   ```
   This command may take a while to complete.

1. Install `kubectl` using the Azure CLI. Linux users may have to prefix this command with `sudo` since it deploys the Kubernetes CLI to `/usr/local/bin`.
   ```azurecli
   az acs kubernetes install-cli
   ```

1. Download the cluster configuration information so you can manage your cluster from the Kubernetes web interface and `kubectl`. 
   ```azurecli
   az acs kubernetes get-credentials --resource-group=wingtiptoys-kubernetes  \ 
    --name=wingtiptoys-containerservice
   ```

## Deploy the image to your Kubernetes cluster

This tutorial deploys the app using `kubectl`, then allow you to explore the deployment through the Kubernetes web interface.

### Deploy with the Kubernetes web interface

1. Open a command prompt.

1. Open the configuration website for your Kubernetes cluster in your default browser:
   ```
   az acs kubernetes browse --resource-group=wingtiptoys-kubernetes --name=wingtiptoys-containerservice
   ```

1. When the Kubernetes configuration website opens in your browser, click the link to **deploy a containerized app**:

   ![Kubernetes Configuration Website][KB01]

1. When the **Deploy a containerized app** page is displayed, specify the following options:

   a. Select **Specify app details below**.

   b. Enter your Spring Boot application name for the **App name**; for example: "*gs-spring-boot-docker*".

   c. Enter your login server and container image from earlier for the **Container image**; for example: "*wingtiptoysregistry.azurecr.io/gs-spring-boot-docker:latest*".

   d. Choose **External** for the **Service**.

   e. Specify your external and internal ports in the **Port** and **Target port** text boxes.

   ![Kubernetes Configuration Website][KB02]


1. Click **Deploy** to deploy the container.

   ![Deploy Container][KB05]

1. Once your application has been deployed, you will see your Spring Boot application listed under **Services**.

   ![Kubernetes Services][KB06]

1. If you click the link for **External endpoints**, you can see your Spring Boot application running on Azure.

   ![Kubernetes Services][KB07]

   ![Browse Sample App on Azure][SB02]


### Deploy with kubectl

1. Open a command prompt.

1. Run your container in the Kubernetes cluster by using the `kubectl run` command. Give a service name for your app in Kubernetes and the full image name. For example:
   ```
   kubectl run gs-spring-boot-docker --image=wingtiptoysregistry.azurecr.io/gs-spring-boot-docker:latest
   ```
   In this command:

   * The container name `gs-spring-boot-docker` is specified immediately after the `run` command

   * The `--image` parameter specifies the combined login server and image name as `wingtiptoysregistry.azurecr.io/gs-spring-boot-docker:latest`

1. Expose your Kubernetes cluster externally by using the `kubectl expose` command. Specify your service name, the public-facing TCP port used to access the app, and the internal target port your app listens on. For example:
   ```
   kubectl expose deployment gs-spring-boot-docker --type=LoadBalancer --port=80 --target-port=8080
   ```
   In this command:

   * The container name `gs-spring-boot-docker` is specified immediately after the `expose deployment` command

   * The `--type` parameter specifies that the cluster uses load balancer

   * The `--port` parameter specifies the public-facing TCP port of 80. You access the app on this port.

   * The `--target-port` parameter specifies the internal TCP port of 8080. The load balancer forwards requests to your app on this port.

1. Once the app is deployed to the cluster, query the external IP address and open it in your web browser:

   ```
   kubectl get services -o jsonpath={.items[*].status.loadBalancer.ingress[0].ip} --namespace=${namespace}
   ```

   ![Browse Sample App on Azure][SB02]


## Next steps

For more information about using Spring Boot on Azure, see the following articles:

* [Deploy a Spring Boot Application to the Azure App Service](../app-service/app-service-deploy-spring-boot-web-app-on-azure.md)

* [Running a Spring Boot Application on Linux in the Azure Container Service](../container-service/container-service-deploy-spring-boot-app-on-linux.md)

## Additional Resources

For more information about using Azure with Java, see the [Azure Java Developer Center] and the [Java Tools for Visual Studio Team Services].

For more information about the Spring Boot on Docker sample project, see [Spring Boot on Docker Getting Started].

The following links provide additional information about creating Spring Boot applications:

* For more information about creating a simple Spring Boot application, see the Spring Initializr at https://start.spring.io/.

The following links provide additional information about using Kubernetes with Azure:

* [Get started with a Kubernetes cluster in Container Service](https://docs.microsoft.com/azure/container-service/container-service-kubernetes-walkthrough)
* [Using the Kubernetes web UI with Azure Container Service](https://docs.microsoft.com/azure/container-service/container-service-kubernetes-ui)

More information about using Kubernetes command-line interface is available in the **kubectl** user guide at <https://kubernetes.io/docs/user-guide/kubectl/>.

The Kubernetes website has several articles that discuss using images in private registries:

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
