---
title: Manage Azure Machine Learning workspaces using Terraform
titleSuffix: Azure Machine Learning
description: Learn how to manage Azure Machine Learning workspaces using Terraform.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: deeikele
author: denniseik
ms.date: 04/22/2021
ms.topic: how-to
ms.custom: 

---

# Manage Azure Machine Learning workspaces using Terraform (preview)

In this article, you learn how to create and manage an Azure Machine Learning workspace using Terraform infrastructure-as-code templates. [Terraform templates](/azure/developer/terraform/) make it easy to create resources as a single, coordinated operation. A template is a document that defines the resources that are needed for a deployment. It may also specify deployment parameters. Parameters are used to provide input values when using the template.

## Prerequisites

* An **Azure subscription**. If you do not have one yet, try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
* An installed version of the [Azure CLI](/cli/azure/).
* Configure Terraform: follow the directions in this article and [Terraform and configure access to Azure](/azure/developer/terraform/get-started-cloud-shell).

## Declare the Azure provider

Create the Terraform configuration file that declares the Azure provider.

1. In local terminal or Cloud Shell, create a file named `main.tf`.

    ```bash
    code main.tf
    ```

1. Paste the following code into the editor:

    **main.tf**:
    :::code language="terraform" source="~/terraform/quickstart/101-machine-learning/main.tf":::

1. Save the file (**&lt;Ctrl>S**) and exit the editor (**&lt;Ctrl>Q**).

## Deploy a workspace

Below Terraform template files can be used to create an Azure Machine Learning workspace. When you deploy an Azure Machine Learning workspace, various other services are required as dependencies. The templates also create these [associated resources](/azure/machine-learning/concept-workspace#resources). Dependent on your use case and organizational requirements, you can choose to use the template that creates resources with either public or private network connectivity.

# [Public network connectivity](#tab/publicworkspace)

Some resources in Azure require globally unique names. Before deploying your resources using the below template, set the `name` variable to a value that is unique.

**variables.tf**:
:::code language="terraform" source="~/terraform/quickstart/101-machine-learning/variables.tf":::

**workspace.tf**:
:::code language="terraform" source="~/terraform/quickstart/101-machine-learning/workspace.tf":::

# [Private network connectivity](#tab/privateworkspace)

The template below creates a workspace in an isolated network environment using Azure private link endpoints. In addition, [private DNS zones](/azure/dns/private-dns-privatednszone) and [Private Link endpoints](/azure/private-link/private-endpoint-overview) are created. 

Some resources in Azure require globally unique names. Before deploying your resources using the below template, set the `resourceprefix` variable to a value that is unique.

There are several options to connect to your private link endpoint workspace. To learn more about these options, refer to [Securely connect to your workspace](/azure/machine-learning/how-to-secure-workspace-vnet#securely-connect-to-your-workspace).

**variables.tf**:
:::code language="terraform" source="~/terraform/quickstart/201-machine-learning-private/variables.tf":::

**network.tf**:
:::code language="terraform" source="~/terraform/quickstart/201-machine-learning-private/network.tf":::

**workspace.tf**:
:::code language="terraform" source="~/terraform/quickstart/201-machine-learning-private/workspace.tf":::

---

## Troubleshooting

### Resource provider errors

[!INCLUDE [machine-learning-resource-provider](../../includes/machine-learning-resource-provider.md)]

## Next steps

* To learn more about Terraform support on Azure, see [Terraform on Azure documentation](/azure/developer/terraform/).
* To find "quick start" examples for Terraform, see [Azure Terraform QuickStart Templates](https://github.com/Azure/terraform/tree/master/quickstart).
* For alternative ARM template-based deployments, see [Deploy resources with Resource Manager templates and Resource Manager REST API](../azure-resource-manager/templates/deploy-rest.md).
* To learn more about network configuration options, see [Secure Azure Machine Learning workspace resources using virtual networks (VNets)](/azure/machine-learning/how-to-network-security-overview).
