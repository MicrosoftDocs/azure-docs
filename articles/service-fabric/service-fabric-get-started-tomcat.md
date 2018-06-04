
---
title: Create an Azure Service Fabric container for Apache Tomcat server on Linux | Microsoft Docs
description: Create Linux container to expose an application running on Apache Tomcat server on Azure Service Fabric. Build a Docker image with your application and Apache Tomcat server, push the image to a container registry, build and deploy a Service Fabric container application.
services: service-fabric
documentationcenter: .net
author: JimacoMS2
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 6/01/2018
ms.author: v-jamebr

---

# Create Service Fabric container running Apache Tomcat server on Linux
Some text

## Prerequisites
TBD

## Steps

1. Clone the Service Fabric Tomcat image.

   ```bash
   git clone https://github.com/suhuruli/dev_test.git
   cd dev_test
   git checkout TomcatServiceFabric 
   ```
1. Create a Docker file to containerize your Tomcat workload. In the *dev_test* directory, create a file named *Dockerfile* (with no file extension). Add the following to *Dockerfile* and save your changes:

   ```
   FROM library/tomcat

   EXPOSE 8080

   COPY ./ApacheTomcat /usr/local/tomcat
   ```

4. Build the Docker file:

   ```bash
   docker build . -t tomcattest
   ```

5. Run the container locally:
 
   ```bash
   docker run -d -it —-rm --name tomcat-site -p 8080:8080 tomcattest.
   ```

   > [!Note]
   > The port you open in the `-p` parameter should be the port your Tomcat application listens to requests on. In the current example, there is a Connector configured in the *ApacheTomcat/conf/server.xml* file to listen on port 8080 for HTTP requests. 

1. To test your container, open a browser and enter one of the following URLs:

   - http://localhost:8080/hello 
   - http://localhost:8080/hello/sayhello 
   - http://localhost:8080/hello/sayhi 


2. Stop the container. The container is automatically deleted when you stop it because the `--rm` parameter was specified in the `docker run` command.

   ```bash
   docker stop tomcat-site
   ```

1. If you don't already have an Azure Container Registry, [create one with the Azure CLI](./service-fabric-tutorial-create-container-images#deploy-azure-container-registry).  

1. Push the image you created to your container registry.
   1. Run `docker login` to log in to your container registry with your [registry credentials](../container-registry/container-registry-authentication.md).

      The following example passes the ID and password of an Azure Active Directory [service principal](../active-directory/active-directory-application-objects.md). For example, you might have assigned a service principal to your registry for an automation scenario. Or, you could log in using your registry username and password.

      ```bash
      docker login myregistry.azurecr.io -u xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -p myPassword
      ```

   2. The following command creates a tag, or alias, of the image, with a fully qualified path to your registry. This example places the image in the `samples` namespace to avoid clutter in the root of the registry.

      ```bash
      docker tag tomcattest myregistry.azurecr.io/samples/tomcattest
      ```

   3. Push the image to your container registry:

      ```bash
      docker push myregistry.azurecr.io/samples/tomcattest
      ```
1. Use yeoman to create a scaffold for a container application: 

   ```
   yo azuresfcontainer 
   ```
   Enter the following values when prompted:

   * Name your application: ServiceFabricTomcat
   * Name of the application service: TomcatService
   * Input the Image Name: myregistry.azurecr.io/samples/tomcattest
   * Commands: 
   * Number of instances of guest container application: 1

10. In the service manifest, add the following under the root **ServiceManfest** tag to open the port your application is listening to requests on.

    ```xml
    <Resources>
	  <Endpoints>
	     <!-- This endpoint is used by the communication listener to obtain the port on which to 
	     listen. Please note that if your service is partitioned, this port is shared with 
	     replicas of different partitions that are placed in your code. -->
	     <Endpoint Name="endpointTest" Port="8080" Protocol="tcp"/>
	   </Endpoints>
	 </Resources>
    ```

11. In the application manifest, under the **ServiceManifestImport** tag, add the following. Replace the AccountName and Password in the RepositoryCredentials tag with the name of your container registry and the password required to login to it.

    ```xml
    <Policies>
	  <ContainerHostPolicies CodePackageRef="Code">
	    <PortBinding ContainerPort="8080" EndpointRef="endpointTest"/>
		<RepositoryCredentials AccountName="myregistry" Password="=P==/==/=8=/=+u4lyOB=+=nWzEeRfF=" PasswordEncrypted="false"/>
	  </ContainerHostPolicies>
	</Policies>
    ```
12. In the *ServiceFabricTomcat* folder, connect to your service fabric cluster and run the install.sh script to deploy the application. 
    1. Connect to the local Service Fabric cluster.

       ```bash
       sfctl cluster select --endpoint http://localhost:19080
       ```

    2. Use the install script provided in the template to copy the application package to the cluster's image store, register the application type, and create an instance of the application.

       ```bash
       ./install.sh
       ```

    After you have run the install script, open a browser and navigate to Service Fabric Explorer at http://localhost:19080/Explorer (replace *localhost* with the private IP of the VM if using Vagrant on Mac OS X). Expand the **Applications** node and note that there is now an entry for your application type, **ServiceFabricTomcatType**, and another for the first instance of that type.

1. To access the server, open a browser window and enter any of the following URLs. You will see a variant of the "Hello World!" welcome screen for each URL.

   * http://PublicIPorFQDN:8080/hello/hello/sayhi
   * http://PublicIPorFQDN:8080/hello/hello  
   * http://PublicIPorFQDN:8080/hello/hello/sayhello

