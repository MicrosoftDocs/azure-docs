This doc provides a list of tools for troubleshooting Java memory issues.
Note that these tools can be used in many scenarios not limited to memory issues. 
This doc only shows one particularly on the topic of memory.

## Alert and diagnose
### 1. Resource health [(Related doc)](https://docs.microsoft.com/en-us/azure/spring-cloud/monitor-app-lifecycle-events#monitor-app-lifecycle-events-in-azure-service-health)

Resource health sends alerts about app restart events due to 
[container OOM](https://github.com/KaiqianYang/azure-spring-cloud-docs-pr/blob/kaiqianyang/memory-oom/docs/fix-app-restart-issues-caused-by-out-of-memory.md#1-Out-of-available-app-memory).


Please check [the doc for fixing app restart issues caused by out of memory](https://github.com/KaiqianYang/azure-spring-cloud-docs-pr/blob/kaiqianyang/memory-oom/docs/fix-app-restart-issues-caused-by-out-of-memory.md).
![memory 5](./media/memory-oom/oom%20alert%20in%20resource%20health.png)

### 2. Diagnose and solve problems [(Related doc)](https://docs.microsoft.com/en-us/azure/spring-cloud/how-to-self-diagnose-solve)

  Under "Diagnose and solve problems", you can find "Memory Usage" detector. 
  It shows a simple diagnosis for app memory usage.

  ![memory 1](./media/memory-oom/diagnose%20and%20solve%20problem%20location.png)
  ![memory 4](./media/memory-oom/diagnose%20and%20solve%20problem%20example.png)

### 3. Metrics [(Related doc)](https://docs.microsoft.com/en-us/azure/spring-cloud/quickstart-logs-metrics-tracing?tabs=Azure-CLI&pivots=programming-language-java#metrics-1)
Metrics cover issues including high memory usage, heap memory too large 
and garbage collection abnormal(too frequent or too not frequent),
through following metrics.

#### (1) App Memory Usage

  App Memory Usage is a percentage = app memory used / app memory limit. It shows the whole app memory.

#### (2) jvm.memory.used/committed/max

On JVM memory, there are three metrics: jvm.memory.used, jvm.memory.committed, jvm.memory.max.

"JVM memory" is not a clearly defined concept. Here "jvm.memory" is the sum of
[heap memory](https://github.com/KaiqianYang/azure-spring-cloud-docs-pr/blob/kaiqianyang/memory-oom/docs/concepts-for-java-memory-management.md#1-heap-memory),
[former permGen](https://github.com/KaiqianYang/azure-spring-cloud-docs-pr/blob/kaiqianyang/memory-oom/docs/concepts-for-java-memory-management.md#2-non-heap-memory).
It doesn't include direct memory or other memory like thread stack.
These three metrics are gathered by spring-boot actuator, and the scope of jvm.memory is also determined by spring-boot actuator. 

- jvm.memory.used

  The amount of used JVM memory, including used heap memory and used former permGen in non-heap memory.

  jvm.memory.used majorly reflects the change of heap memory, because the former permGen part is usually stable. 
  
  If you find jvm.memory.used too large, consider to set a smaller max heap memory size.


- jvm.memory.committed

  The amount of memory committed for the JVM to use. 
The size of jvm.memory.committed is basically the limit of usable JVM memory.


- jvm.memory.max

  The maximum amount of JVM memory. It is the maximum amount but not the real available amount.

  The value of jvm.memory.max sometimes can be confusing because it can be much higher than available app memory.
  Here is a clarification:
  jvm.memory.max is a sum of all maximum sizes of heap memory and
  [former permGen](https://github.com/KaiqianYang/azure-spring-cloud-docs-pr/blob/kaiqianyang/memory-oom/docs/concepts-for-java-memory-management.md#2-non-heap-memory)
regardless of the real available memory. 
  
  E.g. if an app is set with 1 GB memory in Azure Spring Cloud portal, the default heap memory size will be 0.5 GB 
(refer to [the doc for default heap size](https://github.com/KaiqianYang/azure-spring-cloud-docs-pr/blob/kaiqianyang/memory-oom/docs/concepts-for-java-memory-management.md#1-default-max-heap-size)), 
  the default Compressed Class Space size is 1 GB (refer to [an oracle doc](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdocs.oracle.com%2Fjavase%2F9%2Fgctuning%2Fother-considerations.htm%23JSGCT-GUID-B29C9153-3530-4C15-9154-E74F44E3DAD9&data=04%7C01%7Ckaiqianyang%40microsoft.com%7C38fc180b69244f235bc808d9d5957de2%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637775660327124610%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&sdata=qRyPF%2BviieEO0lVtOKUoIPy5Ejx7hgM5RMQGaDEVm7A%3D&reserved=0)), 
  then the value of jvm.memory.max will be larger than 1.5 GB regardless of the app memory size 1 GB.

#### (3) jvm.gc.memory.allocated/promoted
These two metrics are for observing 
[Java garbage collection](https://github.com/KaiqianYang/azure-spring-cloud-docs-pr/blob/kaiqianyang/memory-oom/docs/concepts-for-java-memory-management.md#Java-Garbage-Collection).
Max heap size influences the frequency of minor GC and full GC. 
Max metaspace and max direct memory size influence full GC.
If you want to adjust the frequency of garbage collection, consider to modify max memory sizes.

- jvm.gc.memory.allocated

  The amount of increase in the size of the young generation memory pool after one GC to before the next. 
It reflects minor GC.


- jvm.gc.memory.promoted

  The amount of increase in the size of the old generation memory pool before GC to after GC.
It reflects full GC

This feature can be found on portal, and you can choose specific metrics and add filters for specific app or deployment or instance, and can also apply splitting.
![memory 8](./media/memory-oom/metrics%20example.png)


## Further debug
### Capture heap dump and thread dump manually and use Java Flight Recorder [(Related doc)](https://docs.microsoft.com/en-us/azure/spring-cloud/how-to-capture-dumps)

  This feature provides further details on heap and threads, to help debug.
  
Heap dump records the state of the Java heap memory. Thread dump records the stacks of all live threads.
  Using third party tools like [Memory Analyzer](https://www.eclipse.org/mat/) to analyze heap dumps can get useful information.

  It is both available on azure CLI and on the app page of portal:
  ![memory 2](./media/memory-oom/capture%20dump%20location.png)

## Modify configurations and fix problem
### Configure memory settings in JVM options

  If you identify issues including [container OOM](https://github.com/KaiqianYang/azure-spring-cloud-docs-pr/blob/kaiqianyang/memory-oom/docs/fix-app-restart-issues-caused-by-out-of-memory.md#1-Out-of-available-app-memory),
  heap memory too large, garbage collection abnormal, you may need to configure max memory size in JVM options.

  You can refer to [related JVM Options](https://github.com/KaiqianYang/azure-spring-cloud-docs-pr/blob/kaiqianyang/memory-oom/docs/concepts-for-java-memory-management.md#1-important-jvm-options).

  This feature is available on Azure CLI and on portal.
  ![memory 6](./media/memory-oom/maxdirectmemorysize%20location.png)

