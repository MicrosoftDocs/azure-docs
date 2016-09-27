<properties
   pageTitle="Locally monitor and diagnose services written with Azure Service Fabric | Microsoft Azure"
   description="Learn how to monitor and diagnose your services written using Microsoft Azure Service Fabric on a local development machine."
   services="service-fabric"
   documentationCenter=".net"
   authors="mani-ramaswamy"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/24/2016"
   ms.author="subramar"/>


# Monitor and diagnose services in a local machine development setup


> [AZURE.SELECTOR]
- [Windows](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)
- [Linux](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally-linux.md)

Monitoring, detecting, diagnosing, and troubleshooting allow for services to continue with minimal disruption to the user experience. Monitoring and diagnostics are critical in an actual deployed production environment. Adopting a similar model during development of services ensures that the diagnostic pipeline works when you move to a production environment. Service Fabric makes it easy for service developers to implement diagnostics that can seamlessly work across both single-machine local development setups and real-world production cluster setups.


## Debugging Service Fabric Java applications

For Java applications, [multiple logging frameworks](http://en.wikipedia.org/wiki/Java_logging_framework) are available. Since `java.util.logging` is the default option with the JRE, it is also used for the [code examples in github](http://github.com/Azure-Samples/service-fabric-java-getting-started).  The following discussion explains how to configure the `java.util.logging` framework. 
 
Using java.util.logging you can redirect your application logs to memory, output streams, consoles files or sockets. For each of these options, there are default handlers already provided in the framework. You can create a `app.properties` file to configure the file handler for your application to redirect all logs to a local file. 

The following code snippet contains an example configuration: 

```java 
handlers = java.util.logging.FileHandler
 
java.util.logging.FileHandler.level = ALL
java.util.logging.FileHandler.formatter = java.util.logging.SimpleFormatter
java.util.logging.FileHandler.limit = 1024000
java.util.logging.FileHandler.count = 10
java.util.logging.FileHandler.pattern = /tmp/servicefabric/logs/mysfapp%u.%g.log             
```

The folder pointed to by the `app.properties` file must exist. After, the `app.properties` file is created, you need to also modify your entry point script, `entrypoint.sh` in the `<applicationfolder>/<servicePkg>/Code/` folder to set the property `java.util.logging.config.file` to `app.propertes` file. The entry should look like the following snippet:

```sh 
java -Djava.library.path=$LD_LIBRARY_PATH -Djava.util.logging.config.file=<path to app.properties> -jar <service name>.jar
```
 
 
This configuration results in logs being collected in a rotating fashion at `/tmp/servicefabric/logs/`. The **%u** and **%g** allow for creating more files, with filenames mysfapp0.log, mysfapp1.log, and so on, with file names mysfapplog0.log mysfapp1.log and so on.  By default if no handler is explicitly configured, the console handler is registered. One can view the logs in syslog under /var/log/syslog.
 
For more information, see the [code examples in github](http://github.com/Azure-Samples/service-fabric-java-getting-started).  



## Next steps
The same tracing code added to your application also works with the diagnostics of your application on an Azure cluster. Check out these articles that discuss the different options for the tools and describe how you can set them up.
* [How to collect logs with Azure Diagnostics](service-fabric-diagnostics-how-to-setup-lad.md)
