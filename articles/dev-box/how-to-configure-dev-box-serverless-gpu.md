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

# Use Serverless GPU compute in Microsoft Dev Box

Serverless GPU compute in Microsoft Dev Box (preview) lets you spin up dev boxes with GPU acceleration — no additional setup required. Microsoft Dev Box serverless GPU compute enables developers to access powerful GPU resources on demand without requiring permanent infrastructure provisioning or complex setup. This article explains what serverless GPU compute is, how it works, and key scenarios for its use.

## What is serverless GPU compute?

Serverless GPU compute in Microsoft Dev Box provides on-demand access to GPU resources for compute-intensive workloads like AI model training, inference, and data processing. Unlike traditional GPU provisioning that requires long-term commitments and upfront investments, serverless GPU compute lets you:

- Access GPU resources only when needed
- Scale GPU resources according to workload demands
- Pay only for actual GPU usage
- Work within your organization's secure network environment

This capability integrates Microsoft Dev Box with Azure Container Apps to deliver GPU power without requiring developers to manage infrastructure.


## Key benefits

Serverless GPU compute in Microsoft Dev Box offers distinct benefits for both developers and organizations, making it easier to harness GPU power efficiently and securely.

### For developers

- **No setup required**: Access GPU compute with a single click from your Dev Box environment
- Access GPU compute with one step from your Dev Box environment.
- **No permission barriers**: Use GPU resources without needing rights to create cloud infrastructure.
- **Integrated development experience**: Seamlessly use GPU compute within familiar tools like Windows Terminal, Visual Studio, and VS Code.
- **Zero configuration**: GPU sessions start automatically when needed and stop when not in use.

### For organizations

- **Cost optimization**: Pay only for the GPU resources you use instead of provisioning dedicated hardware.
- **Centralized control**: Manage GPU access through project-level policies.
- **Security and compliance**: Keep sensitive data in your secure corporate network while using GPU resources.
- **Simplified resource management**: Control GPU usage limits at the project level.

## How serverless GPU compute works

Serverless GPU compute in Dev Box uses Azure Container Apps (ACA) to provide GPU resources on demand. When a developer starts a GPU-enabled shell or tool, Dev Box automatically:

- Creates a connection to a serverless GPU session
- Provisions the necessary GPU resources
- Makes those resources available through the developer's terminal or integrated development environment
- Automatically terminates the session when no longer needed

### Available GPU types

These GPU options are supported:

- **NVIDIA T4 GPUs**: Readily available with minimal quota concerns


### Regional availability

GPU resources are available in these Azure regions:

- West US 3

Additional regions may be supported in the future based on demand.

## Configure Serverless GPU

Admins control serverless GPU access at the project level through Dev Center. Key management capabilities include:

- **Enable/disable GPU access**: Control whether projects can use serverless GPU resources
- **Set concurrent GPU limits**: Specify the maximum number of GPUs that can be used simultaneously across a project

Access to serverless GPU resources is managed through project-level properties. When the serverless GPU feature is enabled for a project, all Dev Boxes within that project automatically gain access to GPU compute. This simplifies the access model by removing the need for custom roles or pool-based configurations.

### Register for the subscription

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your subscription. 
1. Select **Settings** > **Preview features**.
1. Select **Dev Box Serverless GPU Preview**, and then select **Register**.
   :::image type="content" source="media/how-to-configure-dev-box-serverless-gpu/serverless-gpu-register-subscription.png" alt-text="Screenshot of the Azure subscription page, showing the Dev Box Serverless GPU Preview feature. ":::

### Enable serverless GPU for a project

1. Go to your project.
1. Select **Settings** > **Dev box settings**.
1. Under **AI workloads**, select **Enable**, and then select **Apply**.
   :::image type="content" source="media/how-to-configure-dev-box-serverless-gpu/serverless-gpu-project-settings.png" alt-text="Screenshot of the dev box settings page, showing the Serverless GPU option Enabled.":::

## Connect to a GPU
Once enabled, Dev Box users in that project will automatically see GPU options in their terminal and VS Code environments.

You can connect using two methods:

### Method 1: Launch a Dev Box GPU shell
1. Open the Windows Terminal on your dev box
1. Run the following command: 
   ```
   devbox gpu shell
   ```
1. This command connects you to a pre-configured GPU container.

### Method 2: Use VS Code with remote tunnels
1. Open the Windows Terminal on your dev box
1. Run the following command: 
   ```
   devbox gpu shell
   ```
1. Launch Visual Studio Code
1. Install the Remote Tunnels extension
1. Connect to the **gpu-session** tunnel.
1. 
For more information on using VS Code with remote tunnels, see [Set up Dev tunnels in VS Code](how-to-set-up-dev-tunnels.md).

## Related content

- [Blog post](link to be added)
- [Learn more about Azure Container Apps serverless GPU](/azure/container-apps/sessions-code-interpreter)