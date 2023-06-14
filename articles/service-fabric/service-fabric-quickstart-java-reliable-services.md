---
title: 'Quickstart: Create a Java app on Azure Service Fabric'
description: In this quickstart, you create a Java application for Azure using a Service Fabric reliable services sample application.
ms.topic: quickstart
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-extended-java
services: service-fabric
ms.date: 07/11/2022
---
# Quickstart:  Deploy a Java app to Azure Service Fabric on Linux

In this quickstart, you deploy a Java application to Azure Service Fabric using the Eclipse IDE on a Linux developer machine. When you're finished, you have a voting application with a Java web front end that saves voting results in a stateful back-end service in the cluster.

Azure Service Fabric is a distributed systems platform for deploying and managing microservices and containers.

## Prerequisites

- [Java environment](./service-fabric-get-started-linux.md#set-up-java-development) and [Yeoman](./service-fabric-get-started-linux.md#set-up-yeoman-generators-for-containers-and-guest-executables)
- [Eclipse Neon (4.6)+](https://www.eclipse.org/downloads/packages/) and [Eclipse plug-in for Service Fabric](./service-fabric-get-started-linux.md#install-the-eclipse-plug-in-optional)
- [Service Fabric SDK and Command Line Interface (CLI)](./service-fabric-get-started-linux.md#installation-methods)
- [Git](https://git-scm.com/downloads)

## Download the sample

In a command window, run the following command to clone the sample app repository to your local machine.

```bash
git clone https://github.com/Azure-Samples/service-fabric-java-quickstart.git
```

## Run the application locally

1. Start your local cluster by running the following command:

    ```bash
    sudo /opt/microsoft/sdk/servicefabric/common/clustersetup/devclustersetup.sh
    ```
    The startup of the local cluster takes some time. To confirm that the cluster is fully up, access the Service Fabric Explorer at `http://localhost:19080`. The five healthy nodes indicate the local cluster is up and running.

    ![Azure Service Fabric Explorer shows healthy nodes](./media/service-fabric-quickstart-java/service-fabric-explorer-healthy-nodes.png)

2. Open Eclipse.
3. Select **File** > **Import** > **Gradle** > **Existing Gradle Project** and follow the wizard.
4. Select **Directory** and choose the **Voting** directory from the **service-fabric-java-quickstart** folder you cloned from GitHub. Select **Finish**.

    ![Import Gradle project into Eclipse](./media/service-fabric-quickstart-java/eclipse-import-gradle-project.png)

5. You now have the `Voting` project in the Package Explorer for Eclipse.
6. Right-click on the project and select **Publish Application** under the **Service Fabric** dropdown. Choose **PublishProfiles/Local.json** as the Target Profile and select **Publish**.

    ![Azure Service Fabric publish local JSON](./media/service-fabric-quickstart-java/service-fabric-publish-local-json.png)

7. Open your favorite web browser and access the application by accessing `http://localhost:8080`.

    ![Azure Service Fabric local host](./media/service-fabric-quickstart-java/service-fabric-local-host.png)

You can now add a set of voting options, and start taking votes. The application runs and stores all data in your Service Fabric cluster, without the need for a separate database.

![Azure Service Fabric voting sample](./media/service-fabric-quickstart-java/service-fabric-voting-sample.png)

## Scale applications and services in a cluster

Services can be scaled across a cluster to accommodate for a change in the load on the services. You scale a service by changing the number of instances running in the cluster. There are many ways of scaling your services. For example, you can use scripts or commands from Service Fabric CLI (`sfctl`). The following steps use Service Fabric Explorer.

Service Fabric Explorer runs in all Service Fabric clusters and can be accessed from a browser by browsing to the cluster's HTTP management port (19080). For example, `http://localhost:19080`.

To scale the web front-end service, do the following:

1. Open Service Fabric Explorer in your cluster. For example, `https://localhost:19080`.
2. Select the ellipsis (**...**) next to the **fabric:/Voting/VotingWeb** node in the treeview and select **Scale Service**.

    ![Scale a service in Azure Service Fabric](./media/service-fabric-quickstart-java/service-fabric-scale-service.png)

    You can now choose to scale the number of instances of the web front-end service.

3. Change the number to **2** and select **Scale Service**.
4. Select the **fabric:/Voting/VotingWeb** node in the tree-view and expand the partition node (represented by a GUID).

    ![Scaled service in Azure Service Fabric](./media/service-fabric-quickstart-java/service-fabric-explorer-service-scaled.png)

    You can now see that the service has two instances, and in the tree view you see which nodes the instances run on.

Through this simple management task, you've doubled the resources available for the front-end service to process user load. It's important to understand that you don't need multiple instances of a service for it to run reliably. If a service fails, Service Fabric makes sure that a new service instance runs in the cluster.

## Next steps

In this quickstart, you learned how to:

* Use Eclipse as a tool for your Service Fabric Java applications
* Deploy Java applications to your local cluster
* Scale out the application across multiple nodes

To learn more about working with Java apps in Service Fabric, continue to the tutorial for Java apps.

> [!div class="nextstepaction"]
> [Deploy a Java app](./service-fabric-tutorial-create-java-app.md)
