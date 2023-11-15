---
title: Deploy virtual machines effectively using Microsoft Copilot for Azure (preview)
description: Learn how Microsoft Copilot for Azure (preview) can help you deploy cost-efficient VMs.
ms.date: 11/15/2023
ms.topic: conceptual
ms.service: azure
ms.custom:
  - ignite-2023
  - ignite-2023-copilotinAzure
ms.author: jenhayes
author: JnHs
---

# Deploy virtual machines effectively using Microsoft Copilot for Azure (preview)

Microsoft Copilot for Azure (preview) can help you deploy [virtual machines in Azure](/azure/virtual-machines/overview) that are efficient and effective. You can get suggestions for different options to save costs and choose the right type and size for your VMs.

For best results, start on the **Virtual machines** page in Azure. When you ask Microsoft Copilot for Azure (preview) for help with a VM, it automatically pulls context when possible, based on the current conversation or on the page you're viewing in the Azure portal. If the context isn't clear, you'll be prompted to specify the VM for which you want assistance.

While it can be helpful to have some familiarity with different VM configuration options such as pricing, scalability, availability, and size can be beneficial, Microsoft Copilot for Azure (preview) is designed to help you regardless of your level of expertise. In all cases, we recommend that you closely review the suggestions to confirm that they meet your needs.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

## Create cost-efficient VMs

Microsoft Copilot for Azure (preview) can guide you in suggesting different options to save costs as you deploy a virtual machine. If you're new to creating VMs, Microsoft Copilot for Azure (preview) can help you understand the best ways to reduce costs More experienced users can confirm the best ways to make sure VMs align with both use cases and budget needs, or find ways to make a specific VM size more cost-effective by enabling certain features that might help lower overall cost.

### Sample prompts

- How do I reduce the cost of my virtual machine?
- Help me create a cost-efficient virtual machine
- Help me create a low cost VM

### Examples

During the VM creation process, you can ask "How do I reduce the cost of my virtual machine?" Microsoft Copilot for Azure (preview) guides you through options to make your VM more cost-effective, providing options that you can enable.

:::image type="content" source="media/deploy-vms-effectively/vm-reduce-costs.png" lightbox="media/deploy-vms-effectively/vm-reduce-costs.png" alt-text="Screenshot showing Microsoft Copilot for Azure (preview) providing ways to lower VM costs.":::

Once you complete the options that Microsoft Copilot for Azure (preview) suggests, you can review and create the VM with the provided recommendations, or continue to make other changes.

:::image type="content" source="media/deploy-vms-effectively/vm-reduce-costs-complete.png" lightbox="media/deploy-vms-effectively/vm-reduce-costs-complete.png" alt-text="Screenshot showing Microsoft Copilot for Azure (preview) completing its recommendations to reduce VM costs.":::

## Create highly available and scalable VMs

Microsoft Copilot for Azure (preview) can provide additional context to help you create high-availability VMs. It can help you create VNs in availability zones, decide whether a Virtual Machine Scale Set is the right option for your needs, or assess which networking resources will help manage traffic effectively across your compute resources.

### Sample prompts

- How do I create a resilient virtual machine
- Help me create a high availability virtual machine

### Examples

During the VM creation process, you can ask "How do I create a resilient and high availability virtual machine?" Microsoft Copilot for Azure (preview) guides you through options to configure your VM for high availability, providing options that you can enable.

:::image type="content" source="media/deploy-vms-effectively/vm-resilient-high-availability.png" lightbox="media/deploy-vms-effectively/vm-resilient-high-availability.png" alt-text="Screenshot showing Microsoft Copilot for Azure (preview) providing ways to configure a VM for high availability.":::

## Choose the right size for your VMs

Azure offers different size options for VMs based on your workload needs. Microsoft Copilot for Azure (preview) can help you identify the best size for your VM, keeping in mind the context of your other configuration requirements, and guide you through the selection process.

### Sample prompts

- Help me choose a size for my Virtual Machine
- Which Virtual Machine size will best suit my requirements?

### Examples

Ask "Help me choose the right VM size for my workload?" Microsoft Copilot for Azure (preview) asks for some more information to help it determine the best options. After that, it presents some options and lets you choose which recommended size to use for your VM.

:::image type="content" source="media/deploy-vms-effectively/vm-choose-size.png" lightbox="media/deploy-vms-effectively/vm-choose-size.png" alt-text="Screenshot of Screenshot showing Microsoft Copilot for Azure (preview) providing size recommendations for a VM.":::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure (preview).
- Learn more about [virtual machines in Azure](/azure/virtual-machines/overview).
- [Request access](https://aka.ms/MSCopilotforAzurePreview) to Microsoft Copilot for Azure (preview).
