---
title: Generate Terraform configurations using Microsoft Copilot in Azure
description: Learn about scenarios where Microsoft Copilot in Azure can generate Terraform configurations for you to use.
ms.date: 06/17/2024
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

- "Create a Terraform config for a Cognitive Services instance with name 'mycognitiveservice' and S0 pricing tier. I need it to have the Text Analytics and Face APIs enabled, and I also need the access keys for authentication purposes."
- "Show me a Terraform configuration for a virtual machine with a size of 'Standard_D2s_v3' and an image of 'UbuntuServer 18.04-LTS'. The resource should be placed in the West US location and have a public IP address. Additionally, it should have a managed disk with a size of 50 GB and be part of a virtual network."
- "Create Terraform configuration for a container app resource with name 'myapp' and Linux OS. Specify the Docker image to be pulled from 'myrepository' and use port 80 for networking. Set the CPU and memory limits to 2 and 4GB respectively. Enable automatic scaling based on CPU usage and set the scaling range between 2 to 10 instances. Also, configure environment variables and mount a storage account for persistent data."
- "What is the Terraform code for a Databricks workspace in Azure with name 'myworkspace' and a premium SKU. The workspace should be created in the West US region. I also need to enable workspace-wide access control with Microsoft Entra integration."
- "Use Terraform to create a new Azure SQL database named 'mydatabase' with Basic SKU and 10 DTU. Set the collation to 'SQL_Latin1_General_CP1_CI_AS' and enable Microsoft Entra authentication. Also, enable long-term backup retention and configure geo-replication to a secondary region for high availability."

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot in Azure.
- Learn more about [Terraform on Azure](/azure/developer/terraform/overview).
