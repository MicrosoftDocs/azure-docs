This doc introduces concepts for Java memory management
to help understand Java applications in Azure Spring Cloud.

## Java Memory Model

A Java application's memory has several parts, and there are different ways to divide the parts. 
We here divide Java memory into 3 parts: 1.heap memory, 2.non-heap memory, 3.direct memory.    

### 1. Heap memory

Heap memory stores all class instances and arrays. 
Per JVM only have one heap area which is shared among threads. 

Spring-boot actuator can observe the value of heap memory,
it takes heap value as part of
[jvm.memory.used/committed/max](https://github.com/KaiqianYang/azure-spring-cloud-docs-pr/blob/kaiqianyang/memory-oom/docs/tools-to-troubleshoot-memory-issues.md#2-jvmmemoryusedcommittedmax).

Heap memory is divided into young generation and old generation.

- Young Generation: all new objects are allocated and aged in young generation.
  - Eden Space: new objects are allocated in Eden Space.
  - Survivor Space: objects will be moved from Eden to Survivor Space after surviving one garbage collection cycle. 
   Survivor Space can be divided to two parts, s1 and s2.


- Old Generation: also called Tenured Space. 
Objects that have remained in the survivor spaces for a long time will be moved to Old Generation.

Before Java 8, another section called permanent generation was also part of heap.
It was majorly replaced by metaspace in non-heap memory, starting from Java 8. 

### 2. Non-heap memory
Here we divide non-heap memory into two parts:

1.The part that replaced permanent generation(permGen) starting from Java 8.
Spring-boot actuator observes this section and takes it as part of
[jvm.memory.used/committed/max](https://github.com/KaiqianYang/azure-spring-cloud-docs-pr/blob/kaiqianyang/memory-oom/docs/tools-to-troubleshoot-memory-issues.md#2-jvmmemoryusedcommittedmax).
In other words, [jvm.memory.used/committed/max](https://github.com/KaiqianYang/azure-spring-cloud-docs-pr/blob/kaiqianyang/memory-oom/docs/tools-to-troubleshoot-memory-issues.md#2-jvmmemoryusedcommittedmax)
 is the sum of heap memory and the former permGen part of non-heap memory.


2.The part of other memory such as thread stack, which is not observed by spring-boot actuator.

- Former permanent generation
   - Metaspace : which stores the class definitions loaded by class loaders
   - Compressed Class Space: which is for compressed class pointers
   - Code Cache: which stores native code compiled by JIT
  

- Other memory: other memory such as thread stack.

### 3. Direct Memory
Direct Memory is native memory allocated by `java.nio.DirectByteBuffer`. 
It is used in third party libraries like nio, gzip.

Spring-boot actuator doesn't observe the value of direct memory.

In conclusion, Java memory model is like following layout.
![java memory model](./media/memory-oom/java-memory-model.PNG)

## Java Garbage Collection

There are 3 terms regarding of Java Garbage Collection: "Minor GC", "Major GC", "Full GC". 
These terms are not clearly defined in the JVM specification. 
Here we consider "Major GC" and "Full GC" equivalent.

- Minor GC

  Minor GC performs when Eden space is full. It removes all dead objects in Young Generation and moves live objects to from Eden Space to s1 of Survivor Space, or from s1 to s2.


- Full GC/Major GC

  Full GC does garbage collection in the entire Heap. 
  Parts like metaspace and direct memory can also be collected by Full GC, and they can only be cleaned by Full GC.


Max heap size influences the frequency of minor GC and full GC.
Max metaspace and max direct memory size influence full GC.

When max heap size is set lower, garbage collections perform more frequent,
which slow the app a little but better limit the memory usage.
When max heap size is set higher, garbage collections perform less,
which may have more
[OOM risk](https://github.com/KaiqianYang/azure-spring-cloud-docs-pr/blob/kaiqianyang/memory-oom/docs/fix-app-restart-issues-caused-by-out-of-memory#OOM-Concepts.md).

Metaspace and direct memory can only be collected by full GC, 
when metaspace or direct memory is full, full GC will perform.

## Java Memory Configurations
### 1. Important JVM Options
Max size of each part of memory can be configured in JVM options. 
It can be set through Azure CLI or on portal 
(refer to [the doc for configuring memory settings in JVM options](https://github.com/KaiqianYang/azure-spring-cloud-docs-pr/blob/kaiqianyang/memory-oom/docs/tools-to-troubleshoot-memory-issues.md#5configure-memory-settings-in-jvm-options))
- Heap size configurations
   - "-Xms" setts initial Heap size by absolute value.
   - "-Xmx" setts maximum Heap size by absolute value.
   - "-XX:InitialRAMPercentage" setts initial Heap size by the percentage of heap size / app memory size.
   - "-XX:MaxRAMPercentage" setts maximum Heap size by the percentage of heap size / app memory size.


- Direct memory size configuration
  - "-XX:[MaxDirectMemorySize](https://docs.oracle.com/en/java/javase/11/tools/java.html#GUID-3B1CE181-CD30-4178-9602-230B800D4FAE)"
  setts maximum direct memory size by absolute value.


- Metaspace Size configuration
  - "-XX:MaxMetaspaceSize" setts maximum Metaspace size by absolute value.


### 2. Default Max Memory Size 

#### (1) default max heap size

Azure Spring Cloud set default max heap memory size about 50%-80% of app memory for Java apps, specifically:

- If the app memory < 1 GB, default max heap size will be 50% of app memory.
- If 1 GB <= the app memory < 2 GB, default max heap size will be 60% of app memory.
- If 2 GB <= the app memory < 3 GB, default max heap size will be 70% of app memory.
- If 3 GB <= the app memory, default max heap size will be 80% of app memory.

#### (2) default max direct memory size
When max direct memory size is not set in JVM options, JVM automatically setts max direct memory size = [`Runtime.getRuntime.maxMemory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/Runtime.html#maxMemory--) ~= max heap memory size
(refer to [jdk8](http://hg.openjdk.java.net/jdk8u/jdk8u/jdk/file/a71d26266469/src/share/classes/sun/misc/VM.java#l282&gt;%20jdk8)).

### 3. Memory Usage Layout

Heap size is influenced by your throughput. Basically when configuring, you can keep the default max heap size, which leaves reasonable memory for other parts.

Metaspace size depends on the complexity of your codes, e.g. the amount of classes.

Direct memory size depends on your use of third party libraries like nio, gzip, and
also depend on your throughput.

Here is a typical memory layout sample for 2 GB apps.
Numbers in grey are reference values of daily memory usage.
You can refer to this to configure your memory size settings.

  ![2G-sample](./media/memory-oom/2G-sample.PNG)

Overall, when configuring max memory sizes,
you should consider the usage of each part in memory,
and the sum of all max sizes shouldn't exceed total available memory.


## Java OOM
OOM means the application is out of memory. 
There are two different concepts: 1. container OOM, 2. JVM OOM.

Check [the doc for fixing app restart issues caused by out of memory](https://github.com/KaiqianYang/azure-spring-cloud-docs-pr/blob/kaiqianyang/memory-oom/docs/fix-app-restart-issues-caused-by-out-of-memory.md) 
for more information.


