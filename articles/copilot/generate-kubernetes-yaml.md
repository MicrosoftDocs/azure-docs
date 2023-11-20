---
title: Generate Kubernetes YAML files using Microsoft Copilot for Azure (preview)
description: Learn how Microsoft Copilot for Azure (preview) can generate Kubernetes YAML files for you to customize and use.
ms.date: 11/15/2023
ms.topic: conceptual
ms.service: copilot-for-azure
ms.custom:
  - ignite-2023
  - ignite-2023-copilotinAzure
ms.author: jenhayes
author: JnHs
---

# Generate Kubernetes YAML files using Microsoft Copilot for Azure (preview)

Microsoft Copilot for Azure (preview) can generate Kubernetes YAML files to apply to your [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) cluster.

You provide your application specifications, such as container images, resource requirements, and networking preferences. Microsoft Copilot for Azure (preview) uses your input to generate comprehensive YAML files that define the desired Kubernetes deployments, services, and other resources, effectively encapsulating the infrastructure as code. The generated YAML files adhere to best practices, simplifying the deployment and management of containerized applications on AKS. This lets you focus more on your applications and less on the underlying infrastructure.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

## Sample prompts

Here are a few examples of the kinds of prompts you can use to generate Kubernetes YAML files. Modify these prompts based on your real-life scenarios, or try additional prompts to create different kinds of Kubernetes YAML files.

- "Help me generate a Kubernetes YAML file for a "frontend" service using port 8080"
- "Give me an example YAML manifest for a CronJob that runs every day at midnight and calls a container named nightlyjob"
- "Generate a Kubernetes Deployment YAML file for a web application named 'my-web-app'. It should run three replicas and expose port 80."
- "Generate a Kubernetes Ingress YAML file that routes traffic to my frontend and backend services based on hostnames."

## Examples

In this example, Microsoft Copilot for Azure (preview) generates a YAML file based on the prompt "Help me generate a Kubernetes YAML file for a "frontend" service using port 8080."

:::image type="content" source="media/generate-kubernetes-yaml/kubernetes-yaml-file.png" alt-text="Screenshot of Microsoft Copilot for Azure (preview) generating a Kubernetes YAML file.":::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure (preview).
- Learn more about [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes).
- [Request access](https://aka.ms/MSCopilotforAzurePreview) to Microsoft Copilot for Azure (preview).
