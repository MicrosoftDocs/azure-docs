---
title: Java Profiler for Azure Monitor Application Insights
description: How to configure the Azure Monitor Application Insights for Java Profiler
ms.topic: conceptual
ms.date: 07/19/2022
ms.devlang: java
ms.custom: devx-track-java
---

# Java Profiler for Azure Monitor Application Insights

> [!NOTE]
> The Java Profiler feature is in preview, starting from 3.4.0.

The Application Insights Java Profiler provides a system for:

> [!div class="checklist"]
> - Generating JDK Flight Recorder (JFR) profiles on demand from the Java Virtual Machine (JVM).
> - Generating JFR profiles automatically when certain trigger conditions are met from JVM, such as CPU or memory breaching a configured threshold.

## Overview

The Application Insights Java profiler uses the JFR profiler provided by the JVM to record profiling data, allowing users to download the JFR recordings at a later time and analyze them to identify the cause of performance issues.

This data is gathered on demand when trigger conditions are met. The available triggers are thresholds over CPU usage and Memory consumption.

When a threshold is reached, a profile of the configured type and duration is gathered and uploaded. This profile is then visible within the performance blade of the associated Application Insights Portal UI.

> [!WARNING]
> The JFR profiler by default executes the "profile-without-env-data" profile. A JFR file is a series of events emitted by the JVM. The "profile-without-env-data" configuration, is similar to the "profile" configuration that ships with the JVM, however has had some events disabled that have the potential to contain sensitive deployment information such as environment variables, arguments provided to the JVM and processes running on the system.

The flags that have been disabled are:

- jdk.JVMInformation
- jdk.InitialSystemProperty
- jdk.OSInformation
- jdk.InitialEnvironmentVariable
- jdk.SystemProcess

However, you should review all enabled flags to ensure that profiles don't contain sensitive data.

See [Configuring Profile Contents](#configuring-profile-contents) on setting a custom profiler configuration.

## Prerequisites

- JVM with Java Flight Recorder (JFR) capability
    - Java 8 update 262+
    - Java 11+

> [!WARNING]
> OpenJ9 JVM is not supported

## Usage

### Triggers

For more detailed description of the various triggers available, see [profiler overview](../profiler/profiler-overview.md).

The ApplicationInsights Java Agent monitors CPU and memory consumption and if it breaches a configured threshold a profile is triggered. Both thresholds are a percentage.

#### Profile now

Within the profiler user interface (see [profiler settings](../profiler/profiler-settings.md)) there's a **Profile now** button. Selecting this button will immediately request a profile in all agents that are attached to the Application Insights instance.

#### CPU

CPU threshold is a percentage of the usage of all available cores on the system.

As an example, if one core of an eight core machine were saturated the CPU percentage would be considered 12.5%.

#### Memory

Memory percentage is the current Tenured memory region (OldGen) occupancy against the maximum possible size of the region.

Occupancy is evaluated after a tenured collection has been performed. The maximum size of the tenured region is the size it would be if the JVMs' heap grew to its maximum size.

For instance, take the following scenario:

- The Java heap could grow to a maximum of 1024 mb.
- The Tenured Generation could grow to 90% of the heap.
- Therefore the maximum possible size of tenured would be 922 mb.
- Your threshold was set via the user interface to 75%, therefore your threshold would be 75% of 922 mb, 691 mb.

In this scenario, a profile will occur in the following circumstances:

- Full garbage collection is executed
- The Tenured regions occupancy is above 691 mb after collection

### Installation

The following steps will guide you through enabling the profiling component on the agent and configuring resource limits that will trigger a profile if breached.

1. Configure the resource thresholds that will cause a profile to be collected:
    
    1. Browse to the Performance -> Profiler section of the Application Insights instance.
       :::image type="content" source="./media/java-standalone-profiler/performance-blade.png" alt-text="Screenshot of the link to open performance blade." lightbox="media/java-standalone-profiler/performance-blade.png":::
       :::image type="content" source="./media/java-standalone-profiler/profiler-button.png" alt-text="Screenshot of the Profiler button from the Performance blade." lightbox="media/java-standalone-profiler/profiler-button.png":::
       
    2. Select "Triggers"
    
    3. Configure the required CPU and Memory thresholds and select Apply.
       :::image type="content" source="./media/java-standalone-profiler/cpu-memory-trigger-settings.png" alt-text="Screenshot of trigger settings pane for CPU and Memory triggers.":::
       
1. Inside the `applicationinsights.json` configuration of your process, enable profiler with the `preview.profiler.enabled` setting:
   ```json
      {
         "connectionString" : "...",
         "preview" : {
            "profiler" : {
               "enabled" : true
            }
         }
      }
   ```
   Alternatively, set the `APPLICATIONINSIGHTS_PROFILER_ENABLED` environment variable to true.
   
1. Restart your process with the updated configuration.

> [!WARNING]
> The Java profiler does not support the "Sampling" trigger. Configuring this will have no effect.

After these steps have been completed, the agent will monitor the resource usage of your process and trigger a profile when the threshold is exceeded. When a profile has been triggered and completed, it will be viewable from the
Application Insights instance within the Performance -> Profiler section. From that screen the profile can be downloaded, once download the JFR recording file can be opened and analyzed within a tool of your choosing, for example JDK Mission Control (JMC).

:::image type="content" source="./media/java-standalone-profiler/configure-blade-inline.png" alt-text="Screenshot of profiler page features and settings." lightbox="media/java-standalone-profiler/configure-blade-inline.png":::

### Configuration

Configuration of the profiler triggering settings, such as thresholds and profiling periods, are set within the ApplicationInsights UI under the Performance, Profiler, Triggers UI as described in [Installation](#installation).

Additionally, many parameters can be configured using environment variables and the `applicationinsights.json` configuration file.

#### Configuring Profile Contents

If you wish to provide a custom profile configuration, alter the `memoryTriggeredSettings`, and `cpuTriggeredSettings` to provide the path to a `.jfc` file with your required configuration.

Profiles can be generated/edited in the JDK Mission Control (JMC) user interface under the `Window->Flight Recording Template Manager` menu and control over individual flags is found inside `Edit->Advanced` of this user interface.

### Environment variables

- `APPLICATIONINSIGHTS_PROFILER_ENABLED`: boolean (default: `false`)
    Enables/disables the profiling feature.

### Configuration file

Example configuration:

```json
{
  "preview": {
    "profiler": {
      "enabled": true,
      "cpuTriggeredSettings": "profile-without-env-data",
      "memoryTriggeredSettings": "profile-without-env-data",
      "manualTriggeredSettings": "profile-without-env-data"
    }
  }
}

```

`memoryTriggeredSettings` This configuration will be used if a memory profile is requested. This value can be one of:

- `profile-without-env-data` (default value). A profile with certain sensitive events disabled, see Warning section above for details.
- `profile`. Uses the `profile.jfc` configuration that ships with JFR.
- A path to a custom jfc configuration file on the file system, i.e `/tmp/myconfig.jfc`.

`cpuTriggeredSettings` This configuration will be used if a cpu profile is requested.
This value can be one of:

- `profile-without-env-data` (default value). A profile with certain sensitive events disabled, see Warning section above for details.
- `profile`. Uses the `profile.jfc` jfc configuration that ships with JFR.
- A path to a custom jfc configuration file on the file system, i.e `/tmp/myconfig.jfc`.

`manualTriggeredSettings` This configuration will be used if a manual profile is requested.
This value can be one of:

- `profile-without-env-data` (default value). A profile with certain sensitive events disabled, see
  Warning section above for details.
- `profile`. Uses the `profile.jfc` jfc configuration that ships with JFR.
- A path to a custom jfc configuration file on the file system, i.e `/tmp/myconfig.jfc`.

## Frequently asked questions

### What is Azure Monitor Application Insights Java Profiling?
Azure Monitor Application Insights Java profiler uses Java Flight Recorder (JFR) to profile your application using  a customized configuration.

### What is Java Flight Recorder (JFR)? 
Java Flight Recorder is a tool for collecting profiling data of a running Java application. It's integrated into the Java Virtual Machine (JVM) and is used for troubleshooting performance issues. Learn more about [Java SE JFR Runtime](https://docs.oracle.com/javacomponents/jmc-5-4/jfr-runtime-guide/about.htm#JFRUH170).

### What is the price and/or licensing fee implications for enabling App Insights Java Profiling?
Java Profiling enablement is a free feature with Application Insights. [Azure Monitor Application Insights pricing](https://azure.microsoft.com/pricing/details/monitor/) is based on ingestion cost.

### Which Java profiling information is collected? 
Profiling data collected by the JFR includes: method and execution profiling data, garbage collection data, and lock profiles. 

### How can I use App Insights Java Profiling and visualize the data?
JFR recording can be viewed and analyzed with your preferred tool, for example [Java Mission Control (JMC)](https://jdk.java.net/jmc/8/).

### Are performance diagnosis and fix recommendations provided with App Insights Java Profiling? 
'Performance diagnostics and recommendations' is a new feature that will be available as Application Insights Java Diagnostics. You may [sign up](https://aka.ms/JavaO11y) to preview this feature. JFR recording can be viewed with Java Mission Control (JMC).

### What's the difference between on-demand and automatic Java Profiling in App Insights? 

On-demand is user triggered profiling in real-time whereas automatic profiling is with preconfigured triggers. 

Use [Profile Now](https://github.com/johnoliver/azure-docs-pr/blob/add-java-profiler-doc/articles/azure-monitor/profiler/profiler-settings.md) for the on-demand profiling option. [Profile Now](https://github.com/johnoliver/azure-docs-pr/blob/add-java-profiler-doc/articles/azure-monitor/profiler/profiler-settings.md) will immediately profile all agents attached to the Application Insights instance. 
          
Automated profiling is triggered a breach in a resource threshold. 
    
### Which Java profiling triggers can I configure?
Application Insights Java Agent currently supports monitoring of CPU and memory consumption. CPU threshold is configured as a percentage of all available cores on the machine. Memory is the current Tenured memory region (OldGen) occupancy against the maximum possible size of the region. 
          
### What are the required prerequisites to enable Java Profiling? 

Review the [Pre-requisites](#prerequisites) at the top of this article.

### Can I use Java Profiling for microservices application? 

Yes, you can profile a JVM running microservices using the JFR.