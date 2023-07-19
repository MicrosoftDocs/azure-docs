---
title: Quickstart - Provision Azure Spring Apps using Terraform
description: This quickstart shows you how to use Terraform to deploy an Azure Spring Apps cluster into an existing virtual network.
author: KarlErickson
ms.service: spring-apps
ms.topic: quickstart
ms.custom: devx-track-java, mode-other, event-tier1-build-2022, devx-track-terraform
ms.author: ariel
ms.date: 05/31/2022
---

# Quickstart: Provision Azure Spring Apps using Terraform

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic ✔️ Standard ✔️ Enterprise

This quickstart describes how to use Terraform to deploy an Azure Spring Apps cluster into an existing virtual network.

Azure Spring Apps makes it easy to deploy Spring applications to Azure without any code changes. The service manages the infrastructure of Spring applications so developers can focus on their code. Azure Spring Apps provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more.

The Enterprise deployment plan includes the following Tanzu components:

* Build Service
* Application Configuration Service
* Service Registry
* Spring Cloud Gateway
* API Portal

The API Portal component will be included when it becomes available through the AzureRM Terraform provider.

For more customization including custom domain support, see the [Azure Spring Apps Terraform provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/spring_cloud_service) documentation.

## Prerequisites

* An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* [Hashicorp Terraform](https://www.terraform.io/downloads.html)
* Two dedicated subnets for the Azure Spring Apps cluster, one for the service runtime and another for the Spring applications. For subnet and virtual network requirements, see the [Virtual network requirements](how-to-deploy-in-azure-virtual-network.md#virtual-network-requirements) section of [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* An existing Log Analytics workspace for Azure Spring Apps diagnostics settings and a workspace-based Application Insights resource. For more information, see [Analyze logs and metrics with diagnostics settings](diagnostic-services.md) and [Application Insights Java In-Process Agent in Azure Spring Apps](how-to-application-insights.md).
* Three internal Classless Inter-Domain Routing (CIDR) ranges (at least */16* each) that you've identified for use by the Azure Spring Apps cluster. These CIDR ranges won't be directly routable and will be used only internally by the Azure Spring Apps cluster. Clusters may not use *169.254.0.0/16*, *172.30.0.0/16*, *172.31.0.0/16*, or *192.0.2.0/24* for the internal Azure Spring Apps CIDR. Clusters also may not use any IP ranges included within the cluster virtual network address range.
* Service permission granted to the virtual network. The Azure Spring Apps Resource Provider requires Owner permission to your virtual network in order to grant a dedicated and dynamic service principal on the virtual network for further deployment and maintenance. For instructions and more information, see the [Grant service permission to the virtual network](how-to-deploy-in-azure-virtual-network.md#grant-service-permission-to-the-virtual-network) section of [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* If you're using Azure Firewall or a Network Virtual Appliance (NVA), you'll also need to satisfy the following prerequisites:
  * Network and fully qualified domain name (FQDN) rules. For more information, see [Virtual network requirements](how-to-deploy-in-azure-virtual-network.md#virtual-network-requirements).
  * A unique User Defined Route (UDR) applied to each of the service runtime and Spring application subnets. For more information about UDRs, see [Virtual network traffic routing](../virtual-network/virtual-networks-udr-overview.md). The UDR should be configured with a route for *0.0.0.0/0* with a destination of your NVA before deploying the Azure Spring Apps cluster. For more information, see the [Bring your own route table](how-to-deploy-in-azure-virtual-network.md#bring-your-own-route-table) section of [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](./how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).

## Review the Terraform plan

The configuration file used in this quickstart is from the [Azure Spring Apps reference architecture](reference-architecture.md).

### [Standard plan](#tab/azure-spring-apps-standard)

:::code language="hcl" source="~/azure-spring-apps-reference-architecture/terraform/brownfield-deployment/Standard/main.tf":::

### [Enterprise plan](#tab/azure-spring-apps-enterprise)

:::code language="hcl" source="~/azure-spring-apps-reference-architecture/terraform/brownfield-deployment/Enterprise/main.tf":::

---

## Apply the Terraform plan

To apply the Terraform plan, follow these steps:

1. Save the *variables.tf* file for the [Standard plan](https://raw.githubusercontent.com/Azure/azure-spring-apps-landing-zone-accelerator/reference-architecture/terraform/brownfield-deployment/Standard/variable.tf) or the [Enterprise plan](https://raw.githubusercontent.com/Azure/azure-spring-apps-landing-zone-accelerator/reference-architecture/terraform/brownfield-deployment/Enterprise/variable.tf) locally, then open it in an editor.

1. Edit the file to add the following values:

   * The subscription ID of the Azure account you'll be deploying to.

   * A deployment location from the regions where Azure Spring Apps is available, as shown in [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=spring-cloud&regions=all). You'll need the short form of the location name. To get this value, use the following command to generate a list of Azure locations, then look up the **Name** value for the region you selected.

     ```azurecli
     az account list-locations --output table
     ```

1. Edit the file to add the following new deployment information:

   * The name of the resource group you'll deploy to.
   * A name of your choice for the Azure Spring Apps Deployment.
   * A name of your choice for the Application Insights resource.
   * Three CIDR ranges (at least /16) which are used to host the Azure Spring Apps backend infrastructure. The CIDR ranges must not overlap with any existing CIDR ranges in the target Subnet
   * The key/value pairs to be applied as tags on all resources that support tags. For more information, see [Use tags to organize your Azure resources and management hierarchy](../azure-resource-manager/management/tag-resources.md)

1. Edit the file to add the following existing infrastructure information:

   * The name of the resource group where the existing virtual network resides.
   * The name of the existing scope virtual network.
   * The name of the existing subnet to be used by the Azure Spring Apps Application Service.
   * The name of the existing subnet to be used by the Azure Spring Apps Runtime Service.
   * The name of the Azure Log Analytics workspace.

1. Run the following command to initialize the Terraform modules:

   ```bash
   terraform init
   ```

1. Run the following command to create the Terraform deployment plan:

   ```bash
   terraform plan -out=springcloud.plan
   ```

1. Run the following command to apply the Terraform deployment plan:

   ```bash
   terraform apply springcloud.plan
   ```

## Review deployed resources

You can either use the Azure portal to check the deployed resources, or use Azure CLI or Azure PowerShell script to list the deployed resources.

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resources created in this article by using the following command.

```bash
terraform destroy -auto-approve
```

## Next steps

In this quickstart, you deployed an Azure Spring Apps instance into an existing virtual network using Terraform, and then validated the deployment. To learn more about Azure Spring Apps, continue on to the resources below.

* Deploy one of the following sample applications from the locations below:
  * [Pet Clinic App with MySQL Integration](https://github.com/azure-samples/spring-petclinic-microservices)
  * [Simple Hello World](./quickstart.md?pivots=programming-language-java&tabs=Azure-CLI)
* Use [custom domains](how-to-custom-domain.md) with Azure Spring Apps.
* Expose applications in Azure Spring Apps to the internet using Azure Application Gateway. For more information, see [Expose applications with end-to-end TLS in a virtual network](expose-apps-gateway-end-to-end-tls.md).
* View the secure end-to-end [Azure Spring Apps reference architecture](reference-architecture.md), which is based on the [Microsoft Azure Well-Architected Framework](/azure/architecture/framework/).
