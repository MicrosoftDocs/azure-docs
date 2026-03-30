---
title: Starter Prompts for Azure SRE Agent
description: Explore example prompts for interacting with Azure SRE Agent across App Service, Container Apps, AKS, and API Management.
ms.topic: reference
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: prompts, examples, chat, queries, App Service, Container Apps, AKS, API Management
#customer intent: As a site reliability engineer, I want to see example prompts so that I can quickly explore my agent's capabilities across different Azure services.
---

# Starter prompts for Azure SRE Agent
Use these prompts to explore your agent's capabilities. Copy any prompt directly into your agent's chat interface.

## General

The following prompts help you understand your agent's scope and capabilities.

```text
What can you help me with?
```

```text
Which subscriptions and resource groups are you managing?
```

```text
How does SRE Agent billing work?
```

```text
Visualize the split of container apps versus web apps versus AKS clusters managed across all subscriptions as a pie chart.
```

## Azure App Service

Use these prompts to discover and diagnose App Service resources.

### Resource discovery

```text
List all my web apps.
```

```text
Which apps are hosted on Linux versus Windows?
```

```text
Are any of my web apps running on deprecated runtime versions?
```

```text
Show me a visualization of memory utilization percentage for my web app for last week.
```

```text
What App Service plan is this app running on, and who else shares it?
```

```text
Which apps have health checks enabled, and what are their probe paths?
```

```text
Can you list all environment variables or app settings for this app?
```

```text
Which apps are using custom domains?
```

```text
What changed in my web app last week?
```

### Diagnostics

```text
Why is my web app throwing 500 errors?
```

```text
Can you analyze my app's availability over the last 24 hours?
```

```text
Give me slow endpoints for my APIs.
```

```text
My web app is down. Can you analyze it?
```

```text
My web app is stuck and isn't loading. Investigate for me.
```

## Azure Container Apps

Use these prompts to discover and diagnose container app resources.

### Resource discovery

```text
List all my container apps.
```

```text
What container images are used in each of my container apps?
```

```text
Which of my container apps has autoscaling enabled?
```

```text
Show me a visualization of CPU utilization percentage for my container app for last week.
```

```text
Which apps use multiple revisions at once?
```

```text
Which revision of my container app is currently active?
```

```text
Which of my container apps use managed identities?
```

### Diagnostics

```text
My container app is stuck in an activation failed state. Investigate for me.
```

```text
Why is my container app throwing 500 errors?
```

```text
My container app is down. Can you analyze it?
```

## Azure Kubernetes Service

Use these prompts to discover and diagnose AKS resources.

> [!NOTE]
> If your AKS cluster restricts inbound network access, your agent can't access Kubernetes objects like namespaces and pods.

### Resource discovery

```text
Which node pools are configured for my AKS cluster?
```

```text
Which workloads are in a crash loop or failed state?
```

```text
How many pods are currently running in my cluster?
```

```text
Show me a visualization of requests and 500 errors for my app in AKS clusters for the past week.
```

```text
Can you give me all the runtime languages of my AKS clusters?
```

```text
What version of Kubernetes is my cluster running?
```

```text
What resource limits and requests are configured for my app containers?
```

### Diagnostics

```text
Is an OOM condition in my deployment?
```

```text
Analyze requests and limits in my namespace.
```

```text
Why is my deployment down?
```

## Azure API Management

Use these prompts to discover and diagnose API Management resources.

### Resource discovery

```text
Can you show me my API Management instances?
```

```text
What back ends does my API Management instance have?
```

```text
Does my API Management instance have any unhealthy back-end apps?
```

```text
What API policies does my API Management instance have?
```

### Diagnostics

```text
Why am I getting 500 errors in my API Management instance?
```

```text
Can you help me figure out why requests to our API are failing?
```

```text
What's the failure rate for my API operations?
```

```text
Why is my API Management instance slow?
```

```text
Can you help me inspect the global policy for my API Management instance?
```

## Scheduling and automation

Use these prompts to set up recurring health checks and automated tasks.

```text
Create a health check task that runs every day at 9 AM to check the status of my web apps.
```

```text
Create a security check task that runs every week to review my application's authentication and access controls.
```

## Next step

> [!div class="nextstepaction"]
> [Ask your agent for help](./ask-agent.md)

## Related content

| Resource | Description |
|----------|-------------|
| [Incident response](incident-response.md) | Start investigating with your agent |
| [Scheduled tasks](scheduled-tasks.md) | Automate recurring checks |
| [Get started](overview.md) | Learn about Azure SRE Agent |
