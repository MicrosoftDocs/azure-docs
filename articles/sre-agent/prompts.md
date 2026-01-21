---
title: Starter Prompts for Azure SRE Agent Preview
description: Review prompts that you can use with Azure SRE Agent.
author: craigshoemaker
ms.topic: conceptual
ms.date: 07/24/2025
ms.author: cshoe
ms.service: azure-sre-agent
---

# Starter prompts for Azure SRE Agent Preview

Azure SRE Agent helps you manage and troubleshoot your Azure resources through natural language conversations. This article provides a collection of starter prompts to help you use SRE Agent effectively.

An agent can provide detailed information about aspects of your apps and resources. The following examples demonstrate the types of questions that you might ask your agent:

- What can you assist me with?
- Why isn't my application working?
- What services is my resource connected to?
- Can you provide best practices for my resource?
- What's the CPU and memory utilization of my app?

Here are some prompts that you can use to help you interact with your agent:

- Which apps have Dapr enabled?
- List replicas for my container app.
- Which apps have diagnostic logging turned on?
- Give me an individual heatmap for each storage account.
- Which revision of my container app is currently active?
- What are some best practices that my app should follow?
- What is the ingress configuration for my container app?
- Are any staging slots configured for this web app?
- What container images are used by each of my container apps?
- List all resource groups that you're managing across all subscriptions.
- Draw a heatmap of storage latencies over the last 14 days for storage accounts.
- Show me a visualization of response times for container apps for the last week.
- List [container apps, web apps, or another app type] that you're managing across all subscriptions.
- Visualize the split of container apps versus web apps versus AKS clusters managed across all subscriptions as a pie chart.

## Agent capabilities

- How do I get started with SRE Agent?
- What can you help me with as an agent?
- What are some common use cases that you support?
- What are your key capabilities?
- Can you explain how you help with incident management?
- How do I connect to an incident platform?
- How does SRE Agent billing work?
- Which Azure services do you support?

## Azure App Service

### Resource discovery

- List all my web apps.
- What services or resources is my web app connected to?
- Which resource group is my app part of?
- Which apps are hosted on Linux versus Windows in my environment?
- Are any of my web apps still running on deprecated or unsupported runtime versions?
- Show me a visualization of memory utilization percentage for my web app for last week.
- Can you list all environment variables or app settings for this app?
- What App Service plan is this app running on, and who else shares it?
- Are any staging slots configured for this web app?
- Which apps are using custom domains?
- Do any apps in my subscription have ARR affinity enabled?
- Which apps have health checks enabled, and what are their probe paths?
- Can you list the autoscale rules configured across all of my App Service apps?
- Which apps have diagnostic logging turned on?
- Show me all web apps that use the .NET 6 runtime.
- What changed in my web app last week?
- What are some best practices that I can apply to my web app?

### Diagnostics and troubleshooting

- Can you analyze my app's availability over the last 24 hours?
- Give me slow endpoints for my APIs.
- Why is my web app timed out?
- Why is my web app throwing 500 errors?
- My web app is down. Can you analyze it?
- My web app is stuck and isn't loading. Investigate for me.

## Azure Container Apps

### Resource discovery

- List all my container apps.
- What is the ingress configuration for my container app?
- Which revision of my container app is currently active?
- What changed in my container app in the last week?
- Show me a visualization of memory utilization percentage for my container app for last week.
- Show me a visualization of CPU utilization percentage for my container app for last week.
- What container images are used in each of my container apps?
- Which apps have Dapr enabled?
- What secrets or environment variables are defined for my app?
- Can you list the CPU and memory allocation for each container app?
- Which apps are connected to other services via Dapr pub/sub?
- Are any of my apps configured to run on a virtual network?
- Which of my container apps has autoscaling enabled?
- Show me all apps with public ingress enabled.
- Which of my container apps use managed identities?
- Which apps use multiple revisions at once?
- What are some best practices that I can apply to my container app?

### Diagnostics and troubleshooting

- My container app is stuck in an activation failed state. Investigate for me.
- Why is my container app timed out?
- Why is my container app throwing 500 errors?
- My container app is down. Can you analyze it?
- My container app is stuck and isn't loading. Investigate for me.

## Azure Kubernetes Service

> [!NOTE]
> If your AKS cluster restricts inbound network access, SRE Agent will not be able to access Kubernetes objects in the cluster, such as namespaces and pods.

### Resource discovery

- Which node pools are configured for my AKS cluster?
- Which workloads are in a crash loop or failed state?
- Do I have any pending or unscheduled pods?
- Can you change settings on the cluster?
- Scale out deployment inside my AKS cluster.
- What version of Kubernetes is my cluster running?
- How many pods are currently running in my cluster?
- What are the configured autoscale rules for my deployments?
- What resource limits and requests are configured for my app containers?
- Can you list all services exposed via load balancer in my cluster?
- Which deployments use persistent volumes?
- Are any cluster-wide policies enforced, like pod security or network policies?
- Can you give me all the runtime languages of my AKS clusters?
- Can you give me environment variables for my AKS clusters?
- Show me a visualization of requests and 500 errors (area chart) for my app in AKS clusters for the past week. Include all data points.
- What are some best practices that I can apply to my AKS cluster?

### Diagnostics and troubleshooting

- Is an OOM condition in my deployment?
- Analyze requests and limits in my namespace.
- Why is my deployment down?

## Azure API Management

### Resource discovery

- Can you show me my API Management instances?
- I need details about my specific API Management instance.
- What back ends does my API Management instance have?
- Does my API Management instance have any unhealthy back-end apps?
- What API policies does my API Management instance have?
- What operation policies does my `<API_NAME>` API have?
- What NSG rules does my API Management instance have?

### Diagnostics and troubleshooting

- Why am I getting 500 errors in my API Management instance?
- Can you help me figure out why requests to our API are failing?
- Show me recent changes to our API Management instance.
- Why is my API Management instance slow?
- Can you help me scale my API Management instance?
- Can you show me the recent failure logs for my API Management instance?
- What's the failure rate for my API operations in my API Management instance?
- Is anything wrong with my API Management instance's virtual network configuration?
- Can you help me inspect the global policy for my API Management instance?
- Is my `<API_NAME>` API in my API Management instance causing any errors?
- Can you help me change/delete my `<NSG_NAME>` NSG rule on my API Management instance?
