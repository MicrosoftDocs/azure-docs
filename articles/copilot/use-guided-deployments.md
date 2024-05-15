---
title: Create resources using guided deployments from Microsoft Copilot for Azure
description: Learn how Microsoft Copilot for Azure (preview) can provide one-click or step-by-step deployment assistance.
ms.date: 05/21/2024
ms.topic: conceptual
ms.service: copilot-for-azure
ms.author: jenhayes
author: JnHs
---

# Create resources using guided deployments from Microsoft Copilot for Azure

Microsoft Copilot for Azure (preview) can help you deploy certain resources and workloads by providing one-click or step-by-step deployment assistance.

Guided deployments are currently available for select workloads. For other types of deployments, Copilot for Azure helps by providing links to templates that you can customize and deploy, often with various deployment options such as Azure CLI, Terraform, Bicep, or ARM. If a template isn't available for your scenario, Copilot for Azure provides information to help you choose and deploy the best resources for your scenario.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

[!INCLUDE [preview-note](includes/preview-note.md)]

## Deploy a LEMP stack on an Azure Linux VM

Copilot for Azure can help you deploy an NGINX web server, Azure MySQL Flexible Server, and PHP (the [LEMP stack](/azure/virtual-machines/linux/tutorial-lemp-stack)) on an Ubuntu Linux VM in Azure. To see the LEMP server in action, you can also install and configure a WordPress site. You can choose either a one-click deployment, or step-by-step assistance.

### LEMP stack sample prompts

- "I want to deploy a LEMP stack on Ubuntu VM"
- "How do I create a single VM LEMP stack?
- "I need a step-by-step guide to create a LEMP stack on a Linux VM. Can you help?"
- "Guided deployment for creating a LEMP stack infrastructure on Azure"
- "One click deployment for LEMP stack"

### LEMP stack example

You can say "**I want to deploy a LEMP stack on a Ubuntu VM**". Copilot for Azure checks for deployment experiences, and presents you with two options: **Step-by-step deployment** or **One-click deployment**.

:::image type="content" source="media/use-guided-deployments/lemp-stack-deployment.png" alt-text="Screenshot showing Copilot for Azure presenting deployment options for a LEMP stack on Ubuntu.":::

If you choose **Step-by-step deployment**, after you select a subscription, Copilot for Azure launches a guided experience that walks you through each step of the deployment.

:::image type="content" source="media/use-guided-deployments/lemp-stack-step-start.png" lightbox="media/use-guided-deployments/lemp-stack-step-start.png" alt-text="Screenshot showing the start of the step-by-step guided deployment for a LEMP stack on Ubuntu.":::

After you complete your deployment, you can check and browse the WordPress website running on your VM.

:::image type="content" source="media/use-guided-deployments/lemp-stack-step-finish.png" lightbox="media/use-guided-deployments/lemp-stack-step-finish.png" alt-text="Screenshot showing the completion of the step-by-step guided deployment for a LEMP stack on Ubuntu.":::

## Create a Linux virtual machine and connect via SSH

Copilot for Azure can help you [create a Linux VM and connect to it via SSH](/azure/virtual-machines/linux/quick-create-cli). You can choose either a one-click deployment, or step-by-step assistance to handle the necessary tasks, including installing the latest Ubuntu image, provisioning the VM, generating a private key, and establishing the SSH connection.

### Linux VM sample prompts

- "How do I deploy a Linux VM?"
- "What are the steps to create a Linux VM on Azure and how do I SSH into it?"
- "I need a detailed guide on creating a Linux VM on Azure and establishing an SSH connection."
- "Deploy a Linux VM on Azure infrastructure."
- "Learn mode deployment for Linux VM"

### Linux VM example

You can say "**How do I create a linux vm and ssh into it?**". You'll see two options: **Step-by-step deployment** or **One-click deployment**. If you select the one-click option, after selecting a subscription, you can run the script to deploy the infrastructure. While the deployment is running, don't close or refresh the page. You'll see progress as each step of the deployment is completed.

:::image type="content" source="media/use-guided-deployments/linux-vm-deployment.png" lightbox="media/use-guided-deployments/linux-vm-deployment.png" alt-text="Screenshot showing Copilot for Azure providing a one-click deployment for a Linux VM.":::

## Create an AKS cluster with a custom domain and HTTPS

Copilot for Azure can help you [create an Azure Kubernetes Service (AKS) cluster](/azure/aks/learn/quick-kubernetes-deploy-cli) with an NGINX ingress controller and a custom domain. As with the other deployments, you can choose either a one-click deployment or step-by-step assistance.

### AKS cluster sample prompts

- "Guide me through creating an AKS cluster."
- "How do I make a scalable AKS cluster?"
- "I'm new to AKS. Can you help me deploy a cluster?"
- "Detailed guide on deploying an AKS cluster on Azure"
- "One-click deployment for AKS cluster on Azure"

### AKS cluster example

When you say "**Seamless deployment for aks cluster on azure**", Microsoft Copilot for Azure presents you with two options: **Step-by-step deployment** or **One-click deployment**. In this example, the one-click deployment option was selected to deploy to the Lamna Healthcare subscription.

:::image type="content" source="media/use-guided-deployments/aks-cluster-deployment.png" lightbox="media/use-guided-deployments/aks-cluster-deployment.png" alt-text="Screenshot showing Copilot for Azure providing a one-click deployment for an AKS cluster.":::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure.
- Learn how to [deploy virtual machines effectively using Microsoft Copilot for Azure](deploy-vms-effectively.md).
