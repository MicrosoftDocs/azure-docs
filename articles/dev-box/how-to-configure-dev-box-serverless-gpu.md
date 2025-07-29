---
title: Serverless GPU Compute in Microsoft Dev Box
description: Learn about serverless GPU compute in Microsoft Dev Box, how it works, benefits for developers and organizations, and key use cases.
ms.service: dev-box
ms.topic: how-to
ms.date: 05/05/2025
author: RoseHJM
ms.author: rosemalcolm
ai-usage: ai-generated

#customer intent: As a business decision-maker, I want to evaluate serverless GPU compute in Dev Box so that I can determine its value for my team's workflows.
---

# Use serverless GPU compute in Microsoft Dev Box

This article explains what serverless GPU compute is, how it works, and key scenarios for its use. Serverless GPU compute in Microsoft Dev Box (preview) lets you spin up dev boxes with GPU acceleration—no extra setup needed. Dev Box serverless GPU compute lets developers use GPU resources on demand without permanent infrastructure or complex setup.

Common scenarios for serverless GPU compute include compute-intensive workloads like AI model training, inference, and data processing. Serverless GPU compute lets you:

- Use GPU resources only when you need them
- Scale GPU resources based on workload demands
- Pay only for the GPU time you use
- Work in your organization's secure network environment

This capability integrates Microsoft Dev Box with Azure Container Apps to deliver GPU power without requiring developers to manage infrastructure.

Serverless GPU compute in Dev Box uses Azure Container Apps (ACA). When a developer starts a GPU-enabled shell or tool, Dev Box automatically:

- Creates a connection to a serverless GPU session
- Provisions the necessary GPU resources
- Makes those resources available through the developer's terminal or integrated development environment
- Automatically terminates the session when no longer needed

## Prerequisites
- An Azure subscription
- A Microsoft Dev Box project 

## Configure serverless GPU

Administrators control serverless GPU access at the project level through Dev Center. Key management capabilities include:

- **Enable/disable GPU access**: Control whether projects can use serverless GPU resources.
- **Set concurrent GPU limits**: Set the maximum number of GPUs that can be used at the same time in a project.

Access to serverless GPU resources is managed through project-level properties. When the serverless GPU feature is enabled for a project, all Dev Boxes in that project can use GPU compute. This simple access model removes the need for custom roles or pool-based configurations.

### Register serverless GPU for the subscription

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your subscription. 
1. Select **Settings** > **Preview features**.
1. Select **Dev Box Serverless GPU Preview**, and then select **Register**.
   :::image type="content" source="media/how-to-configure-dev-box-serverless-gpu/serverless-gpu-register-subscription.png" alt-text="Screenshot of the Azure subscription page, showing the Dev Box Serverless GPU Preview feature." lightbox="media/how-to-configure-dev-box-serverless-gpu/serverless-gpu-register-subscription.png":::

### Enable serverless GPU for a project

1. Go to your project.
1. Select **Settings** > **Dev box settings**.
1. Under **AI workloads**, select **Enable**, and then select **Apply**.
   :::image type="content" source="media/how-to-configure-dev-box-serverless-gpu/serverless-gpu-project-settings.png" alt-text="Screenshot of the dev box settings page, showing the Serverless GPU option Enabled." lightbox="media/how-to-configure-dev-box-serverless-gpu/serverless-gpu-project-settings.png":::

## Connect to a GPU

After you enable serverless GPU, Dev Box users in that project see GPU options in their terminal and VS Code environments.

You can connect using one of these methods:

### Method 1: Launch a Dev Box GPU shell

1. Open Windows Terminal on your dev box.
1. Run the following command:
   ```bash
   devbox gpu shell
   ```
1. Connects you to a preconfigured GPU container.

### Method 2: Use VS Code with remote tunnels

1. Open Windows Terminal on your dev box.
1. Run the following command:
   ```bash
   devbox gpu shell
   ```
1. Launch Visual Studio Code.
1. Install the [Remote Tunnels extension](https://code.visualstudio.com/docs/remote/tunnels#_remote-tunnels-extension).
1. Connect to the **gpu-session** tunnel.

## Related content

- [Supercharge AI development with new AI-powered features in Microsoft Dev Box](https://aka.ms/devbox/serverlessGPU)
- [Learn more about Azure Container Apps serverless GPU](/azure/container-apps/sessions-code-interpreter)
