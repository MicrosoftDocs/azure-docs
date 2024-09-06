---
title: Generate Terraform configurations using Microsoft Copilot in Azure
description: Learn about scenarios where Microsoft Copilot in Azure can generate Terraform configurations for you to use.
ms.date: 08/13/2024
ms.topic: conceptual
ms.service: copilot-for-azure
ms.author: jenhayes
author: JnHs
---

# Generate Terraform configurations using Microsoft Copilot in Azure

Microsoft Copilot in Azure (preview) can generate Terraform configurations that you can use to create and manage your Azure infrastructure.

When you tell Microsoft Copilot in Azure about some Azure infrastructure that you want to manage through Terraform, it provides a configuration using resources from the [AzureRM provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs). In addition to the primary resources, any dependent resources required to accomplish a successful deployment are included in the configuration. You can ask follow-up questions to further customize the configuration. Once you've reviewed the configuration and are happy with it, copy the configuration contents and deploy the configuration using your Terraform deployment method of choice.

The requested Azure infrastructure should be limited to fewer than eight primary resource types. For example, you should see good results when asking for a configuration to manage a resource group that contains Azure Container App, Azure Functions, and Azure Cosmos DB resources. However, requesting configurations to fully address complex architectures may result in inaccurate results and truncated configurations.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

[!INCLUDE [preview-note](includes/preview-note.md)]

## Sample prompts

Here are a few examples of the kinds of prompts you can use to generate Terraform configurations. Modify these prompts based on your real-life scenarios, or try additional prompts to create different kinds of queries.

- "Create a Terraform config for a Cognitive Services instance with name 'mycognitiveservice' and S0 pricing tier."
- "Show me a Terraform configuration for a linux virtual machine with 8GB ram and an image of 'UbuntuServer 18.04-LTS'. The resource should be placed in the West US location and have a public IP address. Additionally, it should be part of a virtual network with a network security group."
- "Create Terraform configuration for a container app resource with name 'myApp' with quick start image. Add a log analytic space with PerGB2018 sku and set the retention days to 31. Enable single revision mode in the container app and set the CPU and memory limits to 2 and 4GB respectively. Also, set the name of the container app environment to 'awesomeAzureEnv' and set the name of the container to 'myQuickStartContainer'."
- "What is the Terraform code for a Databricks workspace in Azure with name 'myworkspace' and a premium SKU. The workspace should be created in the West US region."
- "Create an OpenAI deployment with gpt-3.5-turbo model using Terraform template. Set the version of the model to 0613."


## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot in Azure.
- Learn more about [Terraform on Azure](/azure/developer/terraform/overview).
