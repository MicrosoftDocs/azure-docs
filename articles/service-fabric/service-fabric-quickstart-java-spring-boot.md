---
title: Deploy a Spring Boot application to Azure Service Fabric | Microsoft Docs
description: In this quickstart, you deploy a Spring Boot application for Azure Service Fabric using a Spring Boot sample application.
services: service-fabric
documentationcenter: java
author: suhuruli
manager: msfussell
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: java
ms.topic: quickstart
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/23/2017
ms.author: suhuruli
ms.custom: mvc, devcenter

---

# Quickstart: deploy a Java Spring Boot Application to Azure
Azure Service Fabric is a distributed systems platform for deploying and managing microservices and containers. 

This quickstart demonstrates how to deploy a Spring Boot application to Service Fabric. This quickstart uses the [Getting Started](https://spring.io/guides/gs/spring-boot/) sample from the Spring website. Using familiar command-line tools, this quickstart walks you through deploying the Spring Boot sample as a Service Fabric application. When you're finished, you have the Spring Boot Getting Started sample working on Service Fabric. 

![Application Screenshot](./media/service-fabric-quickstart-java-spring-boot/springbootsflocalhost.png)

In this quickstart, you learn how to:

> [!div class="checklist"]
> * Deploy a Spring Boot application to Service Fabric
> * Deploy the application to your local cluster 
> * Deploy the application to a cluster in Azure
> * Scale-out the application across multiple nodes
> * Perform failover of your service with no hit to availability

## Prerequisites
To complete this quickstart:
1. [Install Service Fabric SDK & Service Fabric Command Line Interface (CLI)](https://docs.microsoft.com/azure/service-fabric/service-fabric-get-started-linux#installation-methods)
2. [Install Git](https://git-scm.com/)
3. [Install Yeoman](https://docs.microsoft.com/azure/service-fabric/service-fabric-get-started-linux#set-up-yeoman-generators-for-containers-and-guest-executables)
4. [Set up Java Environment](https://docs.microsoft.com/azure/service-fabric/service-fabric-get-started-linux#set-up-java-development)

## Download the sample
In a command window, run the following command to clone the Spring Boot Getting Started sample app to your local machine.
```
git clone https://github.com/spring-guides/gs-spring-boot.git
```

## Package the Spring Boot application 
1. Inside the `gs-spring-boot` directory that was cloned, run the `yo azuresfguest` command. 

2. Enter the following details for each prompt. 

    ![Yeoman Entries](./media/service-fabric-quickstart-java-spring-boot/yeomanspringboot.png)

3. In the `SpringServiceFabric/SpringServiceFabric/SpringGettingStartedPkg/code` folder, create a file called `entryPoint.sh`. Add the following to the file. 

    ```bash
    #!/bin/bash
    BASEDIR=$(dirname $0)
    cd $BASEDIR
    java -jar gs-spring-boot-0.1.0.jar
    ```

At this stage, you have created a Service Fabric application for the Spring Boot Getting Started sample that you can deploy to Service Fabric.

## Run the application locally
1. Start your local cluster by running the following command:

    ```bash
    sudo /opt/microsoft/sdk/servicefabric/common/clustersetup/devclustersetup.sh
    ```
    The startup of the local cluster takes some time. To confirm that the cluster is fully up, access the Service Fabric Explorer at **http://localhost:19080**. The five healthy nodes indicate the local cluster is up and running. 
    
    ![Local cluster healthy](./media/service-fabric-quickstart-java-spring-boot/sfxlocalhost.png)

2. Navigate to the `gs-spring-boot/SpringServiceFabric` folder.
3. Run the following command to connect to your local cluster. 

    ```bash
    sfctl cluster select --endpoint http://localhost:19080
    ```
4. Run the `install.sh` script. 

    ```bash
    ./install.sh
    ```

5. Open your favorite web browser and access the application by accessing **http://localhost:8080**. 

    ![Application front-end Local](./media/service-fabric-quickstart-java-spring-boot/springbootsflocalhost.png)
    
You can now access the Spring Boot application that was deployed to a Service Fabric cluster.  

## Deploy the application to Azure

### Set up your Azure Service Fabric Cluster
To deploy the application to a cluster in Azure, create your own cluster.

Party clusters are free, limited-time Service Fabric clusters hosted on Azure. They are run by the Service Fabric team where anyone can deploy applications and learn about the platform. To get access to a Party Cluster, [follow the instructions](http://aka.ms/tryservicefabric). 

In order to perform management operations on the secure party cluster, you can use Service Fabric Explorer, CLI, or Powershell. To use Service Fabric Explorer, you will need to download the PFX file from the Party Cluster website and import the certificate into your certificate store (Windows or Mac) or into the browser itself (Ubuntu). There is no password for the self-signed certificates from the party cluster. 

To perform management operations with Powershell or CLI, you will need the PFX (Powershell) or PEM (CLI). To convert the PFX to a PEM file, please run the following command:  

```bash
openssl pkcs12 -in party-cluster-1277863181-client-cert.pfx -out party-cluster-1277863181-client-cert.pem -nodes -passin pass:
```

For information about creating your own cluster, see [Create a Service Fabric cluster on Azure](service-fabric-tutorial-create-vnet-and-linux-cluster.md).

> [!Note]
> The Spring Boot service is configured to listen on port 8080 for incoming traffic. Make sure that port is open in your cluster. If you are using the Party Cluster, this port is open.
>

### Deploy the application using CLI
Now that the application and your cluster are ready, you can deploy it to the cluster directly from command line.

1. Navigate to the `gs-spring-boot/SpringServiceFabric` folder.
2. Run the following command to connect to your Azure cluster. 

    ```bash
    sfctl cluster select --endpoint http://<ConnectionIPOrURL>:19080
    ```
    
    If the cluster is secured with a self-signed certificate, the command you run is: 

    ```bash
    sfctl cluster select --endpoint https://<ConnectionIPOrURL>:19080 --pem <path_to_certificate> --no-verify
    ```
3. Run the `install.sh` script. 

    ```bash
    ./install.sh
    ```

4. Open your favorite web browser and access the application by accessing **http://\<ConnectionIPOrUrl>:8080**. 

    ![Application front-end Local](./media/service-fabric-quickstart-java-spring-boot/springbootsfazure.png)
    
You can now access the Spring Boot application that was deployed to a Service Fabric cluster.  
    
## Scale applications and services in a cluster
Services can be scaled across a cluster to accommodate for a change in the load on the services. You scale a service by changing the number of instances running in the cluster. You have multiple ways of scaling your services, you can use scripts or commands from Service Fabric CLI (sfctl). In this example, Service Fabric Explorer is used.

Service Fabric Explorer runs in all Service Fabric clusters and can be accessed from a browser, by browsing to the clusters HTTP management port (19080), for example, `http://localhost:19080`.

To scale the web front-end service, do the following steps:

1. Open Service Fabric Explorer in your cluster - for example, `http://localhost:19080`.
2. Click on the ellipsis (three dots) next to the **fabric:/SpringServiceFabric/SpringGettingStarted** node in the treeview and choose **Scale Service**.

    ![Service Fabric Explorer Scale Service](./media/service-fabric-quickstart-java-spring-boot/sfxscaleservicehowto.png)

    You can now choose to scale the number of instances of the service.

3. Change the number to **3** and click **Scale Service**.

    An alternative way to scale the service using command line is as follows.

    ```bash 
    # Connect to your local cluster
    sfctl cluster select --endpoint http://localhost:19080

    # Run Bash command to scale instance count for your service
    sfctl service update --service-id 'SpringServiceFabric~SpringGettingStarted` --instance-count 3 --stateless 
    ``` 

4. Click on the **fabric:/SpringServiceFabric/SpringGettingStarted** node in the tree-view and expand the partition node (represented by a GUID).

    ![Service Fabric Explorer Scale Service Complete](./media/service-fabric-quickstart-java-spring-boot/sfxscaledservice.png)

    The service has three instances, and the tree view shows which nodes the instances run on.

By this simple management task, the resources available are increased for the Spring service to process user load. It's important to understand that you do not need multiple instances of a service to have it run reliably. If a service fails, Service Fabric makes sure a new service instance runs in the cluster.

## Fail over services in a cluster 
To demonstrate service failover, a node restart is simulated by using Service Fabric Explorer. Ensure only one instance of your service is running. 

1. Open Service Fabric Explorer in your cluster - for example, `http://localhost:19080`.
2. Click on the ellipsis (three dots) next to the node running the instance of your service and Restart the node. 

    ![Service Fabric Explorer Restart Node](./media/service-fabric-quickstart-java-spring-boot/sfxhowtofailover.png)
3. The instance of your service is moved to a different node and your application has no downtime. 

    ![Service Fabric Explorer Restart Node Succeed](./media/service-fabric-quickstart-java-spring-boot/sfxfailedover.png)

## Next steps
In this quickstart, you learned how to:

> [!div class="checklist"]
> * Deploy a Spring Boot application to Service Fabric
> * Deploy the application to your local cluster 
> * Deploy the application to a cluster in Azure
> * Scale-out the application across multiple nodes
> * Perform failover of your service with no hit to availability

* Learn more about [building Java microservices using Service Fabric Programming Models](service-fabric-quickstart-java-reliable-services.md)
* Learn about [setting up your continuous integration & deployment using Jenkins](service-fabric-cicd-your-linux-applications-with-jenkins.md)
* Checkout other [Java Samples](https://github.com/Azure-Samples/service-fabric-java-getting-started)