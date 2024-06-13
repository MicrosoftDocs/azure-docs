---
title: Debug a Java app on a local Service Fabric cluster 
description: In this tutorial, learn how to debug and get logs from a Service Fabric Java application running on a local cluster.
ms.topic: tutorial
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-extended-java
services: service-fabric
ms.date: 07/14/2022
---

# Tutorial: Debug a Java application deployed on a local Service Fabric cluster

This tutorial is part two of a series. You learn how to attach a remote debugger using Eclipse for the Service Fabric application. Additionally, you learn how to redirect logs from the running applications to a location convenient for the developer.

In this tutorial series you learn how to:
> [!div class="checklist"]
> * [Build a Java Service Fabric Reliable Services application](service-fabric-tutorial-create-java-app.md)
> * Deploy and debug the application on a local cluster
> * [Deploy application to an Azure cluster](service-fabric-tutorial-java-deploy-azure.md)
> * [Set up monitoring and diagnostics for the application](service-fabric-tutorial-java-elk.md)
> * [Set up CI/CD](service-fabric-tutorial-java-jenkins.md)


In part two of the series, you learn how to:
> [!div class="checklist"]
> * Debug Java application using Eclipse
> * Redirect logs to a configurable location


## Prerequisites

Before you begin this tutorial:

* Set up your development environment for [Mac](service-fabric-get-started-mac.md) or [Linux](service-fabric-get-started-linux.md). Follow the instructions to install the Eclipse plug-in, Gradle, the Service Fabric SDK, and the Service Fabric CLI (sfctl).

## Download the Voting sample application

If you did not build the Voting sample application in [part one of this tutorial series](service-fabric-tutorial-create-java-app.md), you can download it. In a command window, run the following command to clone the sample app repository to your local machine.

```bash
git clone https://github.com/Azure-Samples/service-fabric-java-quickstart
```

[Build and deploy](service-fabric-tutorial-create-java-app.md#deploy-application-to-local-cluster) the application to the local development cluster.

## Debug Java application using Eclipse

1. Open the Eclipse IDE on your machine and click on **File -> Import....**

2. In the popup window, select the **General -> Existing Projects into Workspace** option and press Next.

3. In the Import Projects window, choose the **Select root directory** option and pick the **Voting** directory. If you followed tutorial series one, the **Voting** directory is in the **Eclipse-workspace** directory.

4. Update entryPoint.sh of the service you wish to debug, so that it starts the Java process with remote debug parameters. For this tutorial the stateless front end is used: *Voting/VotingApplication/VotingWebPkg/Code/entryPoint.sh*. Port 8001 is set for debugging in this example.

    ```bash
    java -Xdebug -Xrunjdwp:transport=dt_socket,address=8001,server=y,suspend=n -Djava.library.path=$LD_LIBRARY_PATH -jar VotingWeb.jar
    ```

5. Update the Application Manifest by setting the instance count or the replica count for the service that is being debugged to one. This setting avoids conflicts for the port that is used for debugging. For example, for stateless services, set ``InstanceCount="1"`` and for stateful services set the target and min replica set sizes to 1 as follows: ``TargetReplicaSetSize="1" MinReplicaSetSize="1"``.

6. In the Eclipse IDE, select **Run -> Debug Configurations -> Remote Java Application**, press the **New** button, set the properties as follows and click **Apply**.

    ```
    Name: Voting
    Project: Voting
    Connection Type: Standard
    Host: localhost
    Port: 8001
    ```

7. Put a breakpoint on line 109 of the *Voting/VotingWeb/src/statelessservice/HttpCommunicationListener.java* file.

8. In the Package Explorer, right click on the **Voting** project and click **Service Fabric -> Publish Application ...**

9. In the **Publish Application** window, select **Local.json** from the dropdown, and click **Publish**.

10. In the Eclipse IDE, select **Run -> Debug Configurations -> Remote Java Application**, click on the **Voting** configuration you created and click **Debug**.

11. Go to your web browser and access **localhost:8080**. This will automatically hit the breakpoint and Eclipse will enter the **Debug perspective**.

Now you can apply these same steps to debug any Service Fabric application in Eclipse.

## Redirect application logs to custom location

The following steps walk through how to redirect the application logs from the default */var/log/syslog* location to a custom location.

1. Currently, applications running in Service Fabric Linux clusters only support picking up a single log file. To set up an application so that the logs always go to */tmp/mysfapp0.0.log*, create a file named logging.properties in the following location *Voting/VotingApplication/VotingWebPkg/Code/logging.properties* and add the following content.

    ```
    handlers = java.util.logging.FileHandler

    java.util.logging.FileHandler.level = ALL
    java.util.logging.FileHandler.formatter = java.util.logging.SimpleFormatter

    # This value specifies your custom location.
    # You will have to ensure this path has read and write access by the process running the SF Application
    java.util.logging.FileHandler.pattern = /tmp/mysfapp0.0.log
    ```

2. Add the following parameter in the *Voting/VotingApplication/VotingWebPkg/Code/entryPoint.sh* for the Java execution command:

    ```bash
    -Djava.util.logging.config.file=logging.properties
    ```

    The following example shows a sample execution with the debugger attached, similar to the execution in the previous section.

    ```bash
    java -Xdebug -Xrunjdwp:transport=dt_socket,address=8001,server=y,suspend=n -Djava.library.path=$LD_LIBRARY_PATH -Djava.util.logging.config.file=logging.properties -jar VotingWeb.jar
    ```

At this stage, you have learned how to debug and access your application logs while developing your Service Fabric Java applications.

## Next steps

In this part of the tutorial, you learned how to:

> [!div class="checklist"]
> * Debug Java application using Eclipse
> * Redirect logs to a configurable location

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Deploy application to Azure](service-fabric-tutorial-java-deploy-azure.md)
