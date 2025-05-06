---
title: Serverless GPU compute in Microsoft Dev Box
description: Learn about serverless GPU compute in Microsoft Dev Box, how it works, benefits for developers and organizations, and key use cases.
ms.service: dev-box
ms.topic: concept-article
ms.date: 05/05/2025
author: RoseHJM
ms.author: rosemalcolm
ai-usage: ai-generated

#customer intent: As a business decision-maker, I want to evaluate serverless GPU compute in Dev Box so that I can determine its value for my team’s workflows.
---

# Serverless GPU compute in Microsoft Dev Box

Serverless GPU compute in Microsoft Dev Box lets you use GPU resources on demand for compute-intensive tasks like AI model training, inference, and data processing. Microsoft Dev Box serverless GPU compute enables developers to access powerful GPU resources on demand without requiring permanent infrastructure provisioning or complex setup. This article explains what serverless GPU compute is, how it works, and key scenarios for its use.

## What is serverless GPU compute?

Serverless GPU compute in Microsoft Dev Box provides on-demand access to GPU resources for compute-intensive workloads like AI model training, inference, and data processing. Unlike traditional GPU provisioning that requires long-term commitments and upfront investments, serverless GPU compute lets you:

- Access GPU resources only when needed
- Scale GPU resources according to workload demands
- Pay only for actual GPU usage
- Work within your organization's secure network environment

This capability integrates Microsoft Dev Box with Azure Container Apps to deliver GPU power without requiring developers to manage infrastructure.

## When to use serverless GPU compute

Consider using serverless GPU compute in Dev Box for scenarios like:

- **AI model development**: Train, fine-tune, and run inference with machine learning models
- **Data processing**: Accelerate processing and transformation of large datasets
- **High-performance computing (HPC)**: Run simulations, scientific computations, and other resource-intensive tasks
- **Cloud-native development**: Scale GPU resources for containerized workflows in AI and beyond
- **CLI-based workflows**: Leverage GPUs for any command-line task that benefits from intensive compute

## Key benefits

Serverless GPU compute in Microsoft Dev Box offers distinct benefits for both developers and organizations, making it easier to harness GPU power efficiently and securely.

### For developers

- **No setup required**: Access GPU compute with a single click from your Dev Box environment
- Access GPU compute with one step from your Dev Box environment.
- **No permission barriers**: Use GPU resources without needing rights to create cloud infrastructure
- **Integrated development experience**: Seamlessly use GPU compute within familiar tools like Windows Terminal, Visual Studio, and VS Code
- **Zero configuration**: GPU sessions start automatically when needed and stop when not in use

### For organizations

- **Cost optimization**: Pay only for the GPU resources you use instead of provisioning dedicated hardware.
- **Centralized control**: Manage GPU access through project-level policies
- **Security and compliance**: Keep sensitive data in your secure corporate network while using GPU resources
- **Simplified resource management**: Control GPU usage limits at the project level

## How serverless GPU compute works

Serverless GPU compute in Dev Box uses Azure Container Apps (ACA) to provide GPU resources on demand. When a developer starts a GPU-enabled shell or tool, Dev Box automatically:

- Creates a connection to a serverless GPU session
- Provisions the necessary GPU resources
- Makes those resources available through the developer's terminal or integrated development environment
- Automatically terminates the session when no longer needed

### Available GPU types

These GPU options are supported:

- **NVIDIA T4 GPUs**: Readily available with minimal quota concerns
- **NVIDIA A100 GPUs**: More powerful but available in limited capacity

### Regional availability

GPU resources are available in these Azure regions:

- West US 3
- Sweden North
- Australia East

Additional regions may be supported in the future based on demand.

### vNet injection

vNet injection allows customers to integrate their network and security protocols with the serverless GPU environment. While not required for the proof of concept (POC), this feature will be prioritized for public previews and general availability (GA). With vNet injection, customers can achieve tighter control over network and security configurations.

vNet injection lets customers control network and security configurations more tightly.

### MOBO architecture model

Serverless GPU compute adopts the MOBO architecture model for ACA integration. In this model, ACA instances are created and managed within the customer’s subscription, providing a more controlled and streamlined management experience. This ensures that the Dev Box service can securely manage ACA sessions without introducing additional complexity.

### Developer experience

Developers can access serverless GPU compute through:

- **Windows Terminal**: Launch a GPU-powered shell directly from Windows Terminal
- **Visual Studio**: Access GPU compute from within the Visual Studio environment
- **VS Code with AI Toolkit**: Use seamless GPU integration for AI development tasks

The goal is to provide a seamless, native experience where GPU resources are accessible without requiring any setup from the developer.

## Administration and management

Admins control serverless GPU access at the project level through Dev Center. Key management capabilities include:

- **Enable/disable GPU access**: Control whether projects can use serverless GPU resources
- **Set concurrent GPU limits**: Specify the maximum number of GPUs that can be used simultaneously across a project
- **Cost controls**: Manage GPU usage within subscription quotas

Access to serverless GPU resources is managed through project-level properties. When the serverless GPU feature is enabled for a project, all Dev Boxes within that project automatically gain access to GPU compute. This simplifies the access model by removing the need for custom roles or pool-based configurations.

## Related content

- [Blog post](link to be added)
- [Learn more about Azure Container Apps serverless GPU](/azure/container-apps/sessions-code-interpreter)