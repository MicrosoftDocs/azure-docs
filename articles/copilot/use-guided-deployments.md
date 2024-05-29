---
title: Create resources using guided deployments from Microsoft Copilot in Azure
description: Learn how Microsoft Copilot in Azure (preview) can provide one-click or step-by-step deployment assistance.
ms.date: 05/28/2024
ms.topic: conceptual
ms.service: copilot-for-azure
ms.custom:
  - build-2024
ms.author: jenhayes
author: JnHs
---

# Create resources using guided deployments from Microsoft Copilot in Azure

Microsoft Copilot in Azure (preview) can help you deploy certain resources and workloads by providing one-click or step-by-step deployment assistance.

Guided deployments are currently available for select workloads. For other types of deployments, Copilot in Azure helps by [providing links to templates](#template-suggestions) that you can customize and deploy, often with various deployment options such as Azure CLI, Terraform, Bicep, or ARM. If a template isn't available for your scenario, Copilot in Azure provides information to help you choose and deploy the best resources for your scenario.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

[!INCLUDE [preview-note](includes/preview-note.md)]

## Deploy a LEMP stack on an Azure Linux VM

Copilot in Azure can help you deploy an NGINX web server, Azure MySQL Flexible Server, and PHP (the [LEMP stack](/azure/virtual-machines/linux/tutorial-lemp-stack)) on an Ubuntu Linux VM in Azure. To see the LEMP server in action, you can also install and configure a WordPress site. You can choose either a one-click deployment, or step-by-step assistance.

### LEMP stack sample prompts

- "I want to deploy a LEMP stack on Ubuntu VM"
- "How do I create a single VM LEMP stack?
- "I need a step-by-step guide to create a LEMP stack on a Linux VM. Can you help?"
- "Guided deployment for creating a LEMP stack infrastructure on Azure"
- "One click deployment for LEMP stack"

### LEMP stack example

You can say "**I want to deploy a LEMP stack on a Ubuntu VM**". Copilot in Azure checks for deployment experiences, and presents you with two deployment options: **Step-by-Step** or **One-Click**.

:::image type="content" source="media/use-guided-deployments/lemp-stack-deployment.png" alt-text="Screenshot showing Copilot in Azure presenting deployment options for a LEMP stack on Ubuntu.":::

If you choose **Step-by-step deployment** and select a subscription, Copilot in Azure launches a guided experience that walks you through each step of the deployment.

:::image type="content" source="media/use-guided-deployments/lemp-stack-step-start.png" lightbox="media/use-guided-deployments/lemp-stack-step-start.png" alt-text="Screenshot showing the start of the step-by-step guided deployment for a LEMP stack on Ubuntu.":::

After you complete your deployment, you can check and browse the WordPress website running on your VM.

:::image type="content" source="media/use-guided-deployments/lemp-stack-step-finish.png" lightbox="media/use-guided-deployments/lemp-stack-step-finish.png" alt-text="Screenshot showing the completion of the step-by-step guided deployment for a LEMP stack on Ubuntu.":::

## Create a Linux virtual machine and connect via SSH

Copilot in Azure can help you [create a Linux VM and connect to it via SSH](/azure/virtual-machines/linux/quick-create-cli). You can choose either a one-click deployment, or step-by-step assistance to handle the necessary tasks, including installing the latest Ubuntu image, provisioning the VM, generating a private key, and establishing the SSH connection.

### Linux VM sample prompts

- "How do I deploy a Linux VM?"
- "What are the steps to create a Linux VM on Azure and how do I SSH into it?"
- "I need a detailed guide on creating a Linux VM on Azure and establishing an SSH connection."
- "Deploy a Linux VM on Azure infrastructure."
- "Learn mode deployment for Linux VM"

### Linux VM example

You can say "**How do I create a Linux VM and SSH into it?**". You'll see two deployment options: **Step-by-Step deployment** or **One-Click**. If you choose the one-click option and select a subscription, you can run the script to deploy the infrastructure. While the deployment is running, don't close or refresh the page. You'll see progress as each step of the deployment is completed.

:::image type="content" source="media/use-guided-deployments/linux-vm-deployment.png" lightbox="media/use-guided-deployments/linux-vm-deployment.png" alt-text="Screenshot showing Copilot in Azure providing a one-click deployment for a Linux VM.":::

## Create an AKS cluster with a custom domain and HTTPS

Copilot in Azure can help you [create an Azure Kubernetes Service (AKS) cluster](/azure/aks/learn/quick-kubernetes-deploy-cli) with an NGINX ingress controller and a custom domain. As with the other deployments, you can choose either a one-click deployment or step-by-step assistance.

### AKS cluster sample prompts

- "Guide me through creating an AKS cluster."
- "How do I make a scalable AKS cluster?"
- "I'm new to AKS. Can you help me deploy a cluster?"
- "Detailed guide on deploying an AKS cluster on Azure"
- "One-click deployment for AKS cluster on Azure"

### AKS cluster example

When you say "**Seamless deployment for AKS cluster on Azure**", Microsoft Copilot in Azure presents you with two deployment options: **Step-by-Step** or **One-Click**. In this example, the one-click deployment option is selected. As with the other examples, you see progress as each step of the deployment is completed.

:::image type="content" source="media/use-guided-deployments/aks-cluster-deployment.png" lightbox="media/use-guided-deployments/aks-cluster-deployment.png" alt-text="Screenshot showing Copilot in Azure providing a one-click deployment for an AKS cluster.":::

## Template suggestions

If a guided deployment isn't available, Copilot in Azure checks to see if there's a template available to help with your scenario. Where possible, multiple deployment options are provided, such as Azure CLI, Terraform, Bicep, or ARM. You can then download and customize the templates as desired.

If a template isn't available, Copilot in Azure provides information to help you achieve your goal. You can also revise your prompt to be more specific or ask if there are any related templates you could start from.

### Template suggestion sample prompts

- "I want to use OpenAI to build a chatbot."
- "Do you have a suggestion for a Python app?"
- "I want to use Azure OpenAI endpoints in a sample app."
- "I want to use OpenAI to build a chatbot."
- "How could I easily deploy a Wordpress site?"
- "Any templates to start with using App service?"
- "Azure AI search + OpenAI template?"
- "Can you suggest a template for app services using SAP cloud SDK?"
- "Java app with Azure OpenAI?"
- "Can I use Azure Open AI with React?"
- "Enterprise chat with GPT using Java?"
- "How can I deploy a sample app using Enterprise chat with GPT and java?"
- "I want to use Azure functions to build an OpenAI app"
- "How can I deploy container apps with Azure OpenAI?"
- "Do you have a template for using Azure AI search?"
- "Do you have a template for using Node js in Azure?"
- "I want a Wordpress app using App services."

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot in Azure.
- Learn how to [deploy virtual machines effectively using Microsoft Copilot in Azure](deploy-vms-effectively.md).
