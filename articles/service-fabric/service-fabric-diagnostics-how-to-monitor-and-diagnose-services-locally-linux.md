---
title: Debug Azure Service Fabric apps in Linux 
description: Learn how to monitor and diagnose your Service Fabric services on a local Linux development machine.

ms.topic: conceptual
ms.date: 2/23/2018
---

# Monitor and diagnose services in a local Linux machine development setup


> [!div class="op_single_selector"]
> * [Windows](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)
> * [Linux](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally-linux.md)
>
>

Monitoring, detecting, diagnosing, and troubleshooting allow for services to continue with minimal disruption to the user experience. Monitoring and diagnostics are critical in an actual deployed production environment. Adopting a similar model during development of services ensures that the diagnostic pipeline works when you move to a production environment. Service Fabric makes it easy for service developers to implement diagnostics that can seamlessly work across both single-machine local development setups and real-world production cluster setups.


## Debugging Service Fabric Java applications

For Java applications, [multiple logging frameworks](https://en.wikipedia.org/wiki/Java_logging_framework) are available. Since `java.util.logging` is the default option with the JRE, it is also used for the [code examples in GitHub](https://github.com/Azure-Samples/service-fabric-java-getting-started). The following discussion explains how to configure the `java.util.logging` framework.

Using java.util.logging you can redirect your application logs to memory, output streams, console files, or sockets. For each of these options, there are default handlers already provided in the framework. You can create a `app.properties` file to configure the file handler for your application to redirect all logs to a local file.

The following code snippet contains an example configuration:

```java
handlers = java.util.logging.FileHandler

java.util.logging.FileHandler.level = ALL
java.util.logging.FileHandler.formatter = java.util.logging.SimpleFormatter
java.util.logging.FileHandler.limit = 1024000
java.util.logging.FileHandler.count = 10
java.util.logging.FileHandler.pattern = /tmp/servicefabric/logs/mysfapp%u.%g.log
```

The folder pointed to by the `app.properties` file must exist. After the `app.properties` file is created, you need to also modify your entry point script, `entrypoint.sh` in the `<applicationfolder>/<servicePkg>/Code/` folder to set the property `java.util.logging.config.file` to `app.properties` file. The entry should look like the following snippet:

```sh
java -Djava.library.path=$LD_LIBRARY_PATH -Djava.util.logging.config.file=<path to app.properties> -jar <service name>.jar
```


This configuration results in logs being collected in a rotating fashion at `/tmp/servicefabric/logs/`. The log file in this case is named mysfapp%u.%g.log where:
* **%u** is a unique number to resolve conflicts between simultaneous Java processes.
* **%g** is the generation number to distinguish between rotating logs.

By default if no handler is explicitly configured, the console handler is registered. One can view the logs in syslog under /var/log/syslog.

For more information, see the [code examples in GitHub](https://github.com/Azure-Samples/service-fabric-java-getting-started).


## Debugging Service Fabric C# applications


Multiple frameworks are available for tracing CoreCLR applications on Linux. For more information, see [.NET Extensions for Logging](https://github.com/dotnet/extensions/tree/master/src/Logging).  Since EventSource is familiar to C# developers,`this article uses EventSource for tracing in CoreCLR samples on Linux.

The first step is to include System.Diagnostics.Tracing so that you can write your logs to memory, output streams, or console files.  For logging using EventSource, add the following project to your project.json:

```json
    "System.Diagnostics.StackTrace": "4.0.1"
```

You can use a custom EventListener to listen for the service event and then appropriately redirect them to trace files. The following code snippet shows a sample implementation of logging using EventSource and a custom EventListener:


```csharp

public class ServiceEventSource : EventSource
{
        public static ServiceEventSource Current = new ServiceEventSource();

        [NonEvent]
        public void Message(string message, params object[] args)
        {
            if (this.IsEnabled())
            {
                var finalMessage = string.Format(message, args);
                this.Message(finalMessage);
            }
        }

        // TBD: Need to add method for sample event.

}

```


```csharp
internal class ServiceEventListener : EventListener
{

        protected override void OnEventSourceCreated(EventSource eventSource)
        {
            EnableEvents(eventSource, EventLevel.LogAlways, EventKeywords.All);
        }
        protected override void OnEventWritten(EventWrittenEventArgs eventData)
        {
                using (StreamWriter Out = new StreamWriter( new FileStream("/tmp/MyServiceLog.txt", FileMode.Append)))
                {
                        // report all event information
                        Out.Write(" {0} ", Write(eventData.Task.ToString(), eventData.EventName, eventData.EventId.ToString(), eventData.Level,""));
                        if (eventData.Message != null)
                                Out.WriteLine(eventData.Message, eventData.Payload.ToArray());
                        else
                        {
                                string[] sargs = eventData.Payload != null ? eventData.Payload.Select(o => o.ToString()).ToArray() : null; 
                                Out.WriteLine("({0}).", sargs != null ? string.Join(", ", sargs) : "");
                        }
                }
        }
}
```


The preceding snippet outputs the logs to a file in `/tmp/MyServiceLog.txt`. This file name needs to be appropriately updated. In case you want to redirect the logs to console, use the following snippet in your customized EventListener class:

```csharp
public static TextWriter Out = Console.Out;
```

The samples at [C# Samples](https://github.com/Azure-Samples/service-fabric-dotnet-core-getting-started) use EventSource and a custom EventListener to log events to a file.



## Next steps
The same tracing code added to your application also works with the diagnostics of your application on an Azure cluster. Check out these articles that discuss the different options for the tools and describe how to set them up.
* [How to collect logs with Azure Diagnostics](service-fabric-diagnostics-how-to-setup-lad.md)
