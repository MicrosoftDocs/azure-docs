---
title: 'Troubleshoot Java applications on AKS with Azure SRE Agent'
description: Use Azure Performance Diagnostics Tool for Java to diagnose JVM performance issues in Azure Kubernetes Service.
author: craigshoemaker
ms.topic: how-to
ms.date: 05/01/2026
ms.author: cshoe
ms.service: azure-sre-agent
---

# Troubleshoot Java applications on AKS with Azure SRE Agent

Use Azure Performance Diagnostics Tool for Java in Azure SRE Agent to investigate JVM performance problems in Azure Kubernetes Service (AKS). The tool collects profiling data from a running Java workload and returns findings that help you isolate bottlenecks without taking the application offline.

## Prerequisites

- A Java application running in an AKS cluster
- An Azure SRE Agent environment that can access the target cluster
- Permissions to inspect the workload and run diagnostics through Azure SRE Agent
- `kubectl` installed and configured if you want to add the annotation from the command line

## Supported diagnostics

Azure Performance Diagnostics Tool for Java helps identify problems such as:

- Garbage collection inefficiencies and long pauses
- CPU overuse or underuse
- I/O-heavy behavior that affects response time
- Thread contention and synchronization bottlenecks

## Enable Java diagnostics

To enable diagnostics, label the workload as a Java application by adding the `languageStack: java` annotation.

### Add the annotation to your pod specification

Add the annotation to the pod metadata in your workload definition:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: your-java-app
  annotations:
    languageStack: java
spec:
  containers:
    - name: app
      image: your-java-app:latest
```

### Add the annotation by using kubectl

If the pod is already running, add the annotation from the command line:

```bash
kubectl annotate pod your-java-app languageStack=java
```

When you add this annotation, you confirm that:

- The pod is running a Java application.
- Azure SRE Agent can run Java diagnostics against the pod.

> [!NOTE]
> The diagnostic process is designed to minimize disruption, but Java Flight Recorder still adds some overhead. Validate the experience in a nonproduction environment before you use it in production.

## What happens during a diagnostics run

When Azure SRE Agent starts a Java diagnostics run, it:

1. Creates an ephemeral container in the target pod.
1. Attaches the diagnostic container to the Java container.
1. Collects telemetry by using Java Flight Recorder (JFR).
1. Analyzes the captured data.
1. Removes the diagnostic container after the run completes.

This process keeps the application online while Azure SRE Agent gathers the data it needs.

### About ephemeral containers

Kubernetes keeps a record of terminated ephemeral containers. If you run `kubectl describe pod`, you continue to see completed diagnostic containers after the run finishes. To reduce noise, Azure SRE Agent limits diagnostics to five ephemeral containers per pod.

## Request Java diagnostics

You can request diagnostics manually, or Azure SRE Agent can trigger them when it detects a likely performance issue.

### Run a manual diagnostics request

In Azure SRE Agent, open the chat experience and provide the workload details for the Java service that you want to inspect:

```text
Analyze the performance of:
pod: my-petclinic-app
container: spring-petclinic-rest
namespace: production
aks instance: my-aks-cluster
```

Include the pod name, container name, namespace, and AKS cluster name so Azure SRE Agent can target the correct workload.

## Create a custom sub-agent for Java diagnostics

If your team wants a dedicated diagnostics workflow, create a custom sub-agent that routes requests to the Java diagnostics tool.

### Configure the sub-agent

1. In Azure SRE Agent, open **Sub-Agent Builder**.
2. Select **Create New Sub-Agent**.
3. Add the configuration for the tools and handoff behavior that you want.

Example configuration:

```yaml
api_version: azuresre.ai/v1
kind: AgentConfiguration
spec:
  name: AKSDiagnosticAgent
  system_prompt: >-
    Take the details of a diagnostic analysis to be performed on an AKS container
    and hand off to the appropriate diagnostic tool. If you need to find the resource
    to diagnose, use the SearchResourceByName and ListResourcesByType tools.
  tools:
    - GetCPUAnalysis
    - GetMemoryAnalysis
    - SearchResourceByName
    - ListResourcesByType
    - AnalyzeJavaAppInAKSContainer
  handoff_description: >-
    Use this agent when the user requests an AKS diagnostic analysis or when the
    investigation requires a Java diagnostics run.
agent_type: Autonomous
```

### Use the sub-agent

After you create the sub-agent, you can direct a request to it from chat:

```text
/agent AKSDiagnosticAgent I am having a performance issue in:
pod: illuminate-test-petclinic
container: spring-petclinic-rest
namespace: illuminate-test
aks instance: jeg-aks
```

The sub-agent starts the Java diagnostics workflow and returns findings with recommended next steps.

## Delegate diagnostics from alerts

You can also route alert-driven investigations to the sub-agent so Azure SRE Agent can start a Java diagnostics run as part of an automated response flow.


## Interpret diagnostic results

When the analysis finishes, Azure SRE Agent returns results such as:

- **Root cause identification** for the main bottleneck
- **Diagnostic insights** such as GC pause times or thread wait times
- **Recommendations** for remediation

Use the results to:

- Adjust JVM arguments or heap size
- Optimize application code paths
- Scale AKS resources
- Improve monitoring and alerting

## Next steps

- [Learn about Azure SRE Agent capabilities](tools.md)
- [Create a custom sub-agent](create-subagent.md)
- [Set up incident response automation](incident-response-plans.md)
- [Configure agent hooks for automated responses](agent-hooks.md)
