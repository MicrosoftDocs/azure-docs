---
title: Debug a Java application on local cluster | Microsoft Docs
description: Learn how to debug and get logs from a Service Fabric Java application running on a local cluster.
services: service-fabric
documentationcenter: java
author: suhuruli
manager: mfussell
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: java
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/24/2018
ms.author: suhuruli
ms.custom: mvc

---

#  Debug a Java application deployed on a local Service Fabric cluster 
This tutorial is part two of a series. You will learn how to attach a remote debugger using Eclipse for the Service Fabric application built in part one of this tutorial. You will also learn how to redirect logs from the running applications to a location convenient for the developer.

In part three of the series, you learn how to:

> [!div class="checklist"]
> * Create resources to deploy a Linux cluster in Azure
> * Use Service Fabric party clusters 
> * Upgrade applications 
> * Scale the instances of both front-end and back-end services

In this tutorial series you learn how to:
> [!div class="checklist"]
> * Debug Java application using Eclipse
> * Redirect logs to a configurable location

## Prerequisites
Before you begin this tutorial:
- If you haven't completed part one of this [tutorial](service-fabric-tutorial-create-java-app.md) series, please do so as the Java application from that is used for this tutorial. Alternatively, if you have your own Service Fabric Java application, the steps for this tutorial series apply. 

## Debug Java application using Eclipse

1. Open the Eclipse IDE on your machine and click on **File -> Import ...**.
2. In the popup window select the **General -> Existing Projects into Workspace** option and press Next. 
3. In the Import Projects window, choose the **Select root directory** option and pick the **Voting** directory (if you followed tutorial series one, this will be in your eclipse-workspace directory). 
4. Update entryPoint.sh of the service you wish to debug, so that it starts the java process with remote debug parameters. For this tutorial we will use the stateless front-end: ``Voting/VotingApplication/VotingWebPkg/Code/entryPoint.sh``. Port 8001 is set for debugging in this example.
```bash
java -Xdebug -Xrunjdwp:transport=dt_socket,address=8001,server=y,suspend=y -Djava.library.path=$LD_LIBRARY_PATH -jar VotingWeb.jar
```
5. Update the Application Manifest by setting the instance count or the replica count for the service that is being debugged to 1. This setting avoids conflicts for the port that is used for debugging. For example, for stateless services, set ``InstanceCount="1"`` and for stateful services set the target and min replica set sizes to 1 as follows: `` TargetReplicaSetSize="1" MinReplicaSetSize="1"``.
6. In the Eclipse IDE, select **Run -> Debug Configurations -> Remote Java Application**, press the **New** button, set the properties as follows and click **Apply**.
```
Name: Voting
Project: Voting
Connection Type: Standard
Host: localhost
Port: 8001
```
7. Put a breakpoint on line 109 of the **Voting/VotingWeb/src/statelessservice/HttpCommunicationListener.java** file. 
8. In the Package Explorer, right click on the **Voting** project and click **Service Fabric -> Publish Application ...** 
9. In the **Publish Application** window, select **Local.json** from the dropdown and click **Publish**.
10. In the Eclipse IDE, select **Run -> Debug Configurations -> Remote Java Application**, click on the **Voting** configuration you created and click **Debug**.
10. Go to your web browser and access **localhost:8080** to hit the breakpoint and enter the **Debug perspective** in Eclipse.

If the application is crashing, you may also want to enable coredumps. Execute ``ulimit -c`` in a shell and if it returns 0, then coredumps are not enabled. To enable unlimited coredumps, execute the following command: ``ulimit -c unlimited``. You can also verify the status using the command ``ulimit -a``.  If you wanted to update the coredump generation path, execute ``echo '/tmp/core_%e.%p' | sudo tee /proc/sys/kernel/core_pattern``. 

## Redirect application logs to custom location

The steps below will walk through how to redirect your application logs from the default ```/var/log/syslog``` location to a custom location. 

1. Create a file named logging.properties in the following location ``Voting/VotingApplication/VotingWebPkg/Code/logging.properties`` and add the following 
```
handlers = java.util.logging.FileHandler

java.util.logging.FileHandler.level = ALL
java.util.logging.FileHandler.formatter = java.util.logging.SimpleFormatter
java.util.logging.FileHandler.limit = 1024000
java.util.logging.FileHandler.count = 10

# This value specifies your custom location. You will have to ensure this path has read and write access by the process running the SF Application
java.util.logging.FileHandler.pattern = /root/tmp/mysfapp%u.%g.log
```

2. Add the following parameter in the ```Voting/VotingApplication/VotingWebPkg/Code/entryPoint.sh``` for the Java execution command: 
```bash
-Djava.util.logging.config.file=logging.properties
```
The execution could look something like this
```bash
java -Xdebug -Xrunjdwp:transport=dt_socket,address=8001,server=y,suspend=y -Djava.library.path=$LD_LIBRARY_PATH -Djava.util.logging.config.file=logging.properties -jar VotingWeb.jar
```
3. When you run your application, you will notice that in the path specified, you will find the log files. 

If using the Service Fabric Cluster running in a [Docker container](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-get-started-mac) you might want to attach a volume to the container to map the directory you wish to write logs on to your host machine for accessibility. If you choose not to do this, the location the logs are piped towill be accessible inside the container. To attach the volume you will have to run the following command 

```bash
docker run -itd -p 19080:19080 -p 8080:8080 -p 8081:8081 -v <Location_on_host_machine>:<Location_in_container> --name sfonebox servicefabricoss/service-fabric-onebox
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