---
title: Starter prompts for Azure SRE Agent (preview)
description: Review different prompts you can use with Azure SRE Agent (preview)
author: craigshoemaker
ms.topic: conceptual
ms.date: 07/24/2025
ms.author: cshoe
ms.service: azure
---

# Starter prompts for Azure SRE Agent (preview)

Azure SRE Agent helps you manage and troubleshoot your Azure resources through natural language conversations. This article provides a collection of starter prompts to help you get the most out of Azure SRE Agent.

An agent can provide detailed information about different aspects of your apps and resources. The following examples demonstrate the types of questions you could pose to your agent:

- What can you assist me with?
- Why isn't my application working?
- What services is my resource connected to?
- Can you provide best practices for my resource?
- What's the CPU and memory utilization of my app?

Further, here are some prompts you can use to help you interact with your agent:

- Which apps have Dapr enabled?
- List replicas for my container app.
- Which apps have diagnostic logging turned on?
- Give me an individual heatmap for each storage account.
- Which revision of my container app is currently active?
- What are some best practices that my app should follow?
- What is the ingress configuration for my container app?
- Are there any staging slots configured for this web app?
- What container images are used by each of my Container Apps?
- List all resource groups that you’re managing across all subscriptions.
- Draw heatmap of storage latencies over the last 14 days for storage accounts.
- Show me a visualization of response times for Container Apps for last week.
- List [Container Apps/Web Apps/etc.] that you’re managing across all subscriptions.
- Visualize split of Container Apps vs Web Apps vs AKS clusters managed across all subscriptions as a pie chart.

## Explore agent capabilities

- How do I get started with SRE Agent?
- What can you help me with as an SRE Agent?
- What are some common use cases you support?
- What are your key capabilities?
- Can you explain how you help with incident management?
- How do I connect to an Incident Platform?
- How does SRE Agent's billing work?
- Which Azure services do you support?

## App Services

### Resource discovery

- List all my web apps.
- What services or resources is my web app connected to?
- Which resource group is my app part of?
- Which apps are hosted on Linux vs Windows in my environment?
- Are any of my web apps still running on deprecated or unsupported runtime versions?
- Show me visualization of memory usage % for my web app for last week.
- Can you list all environment variables or app settings for this app?
- What App Service Plan is this app running on, and who else shares it?
- Are there any staging slots configured for this web app?
- Which apps are using custom domains?
- Do any apps in my subscription have ARR affinity enabled?
- Which apps have health checks enabled, and what are their probe paths?
- Can you list the auto scale rules configured across all of my App Services?
- Which apps have diagnostic logging turned on?
- Show me all web apps using .NET 6 runtime.
- What changed in my web app last week?
- What are some best practices I can apply to my web app?

### Diagnostics \& troubleshooting

- Can you analyze my app's availability over the last 24 hours?
- Give me slow endpoints for my APIs.
- Why is my web app timed out?
- Why is my web app throwing 500 errors?
- My web app is down. Can you analyze it?
- My web is stuck and isn't loading – investigate for me.

## Container Apps

### Resource discovery

- List all my container apps.
- What is the ingress configuration for my container app?
- Which revision of my container app is currently active?
- What changed in my container app in the last week?
- Show me visualization of memory utilization % for my container app for last week.
- Show me visualization of CPU utilization % for my container app for last week.
- What container images are used in each of my container apps?
- Which apps have Dapr enabled?
- What secrets or environment variables are defined for my app?
- Can you list the CPU and memory allocation for each container app?
- Which apps are connected to other services via Dapr pub/sub?
- Are any of my apps configured to run on a virtual network?
- Which of my container apps has auto scaling enabled?
- Show me all apps with public ingress enabled.
- Which of my container apps use managed identities?
- Which apps use multiple revisions at once?
- What are some best practices I can apply to my container app?

### Diagnostics \& troubleshooting

- My container app is stuck in an activation failed state. Investigate for me.
- Why is my container app timed out?
- Why is my web app throwing 500 errors?
- My container app is down. Can you analyze it?
- My web is stuck and isn't loading – investigate for me.

## Azure Kubernetes Service

### Resource discovery 

- Which node pools are configured for my AKS cluster?
- Which workloads are in a crash loop or failed state?
- Do I have any pending or unscheduled pods?
- Can you change settings on the cluster?
- Scale out deployment inside my AKS cluster
- What version of Kubernetes is my cluster running?
- How many pods are currently running in my cluster?
- What are the configured auto scale rules for my deployments?
- What resource limits and requests are configured for my app containers?
- Can you list all services exposed via LoadBalancer in my cluster?
- Which deployments use persistent volumes?
- Are there any cluster-wide policies enforced like PodSecurity or NetworkPolicies?
- Can you give me all the runtime languages of my AKS clusters?
- Can you give me environment variables for my AKS clusters?
- Show me visualization of requests and 500 errors (area chart) for my app in AKS cluster for the past week. Include all data points.
- What are some best practices I can apply to my AKS cluster?

### Diagnostics \& troubleshooting

- Is there an OOM in my deployment?
- Analyze requests and limits in my namespace?
- Why is my deployment down?

## Azure API Management

### Resource discovery

- Can you show me my API Management instances?
- I need details about my specific API Management instance
- What backends does my API Management instance have?
- Does my API Management instance have any unhealthy backend apps?
- What API policies does my API Management instance have?
- What Operation policies does my {api-name} API have?
- What NSG rules does my API Management instance have?

### Diagnostics \& troubleshooting

- Why am I getting 500 errors in my API Management?
- Can you help me figure out why requests to our API are failing?
- Show me recent changes to our API Management instance
- Why is my API Management slow?
- Can you help me scale my API Management instance?
- Can you show me the recent failure logs for my API Management?
- What's the failure rate for my API operations in my API Management?
- Is there anything wrong with my API Managements VNet configuration?
- Can you help me inspect the global policy for my API Management?
- Is my `<NAME>` API in my API Management causing any errors?
- Can you help me change/delete my <NSG_NAME> NSG rule on my API Management instance?
