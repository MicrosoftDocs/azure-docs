---
title: "Quickstart: Deploy Azure Firewall for Containers with Azure Resource Manager"
description: Learn how to deploy Azure Firewall for Containers with an ARM template to create an AKS cluster, firewall, managed identities, and routing.
author: asudbring
ms.author: allensu
ms.service: azure-firewall
ms.topic: quickstart
ms.date: 11/18/2026
ms.custom:
  - subject-armqs
  - mode-arm
  - devx-track-arm-template
  - references_regions
# Customer intent: As a Kubernetes administrator, I want to deploy an AKS and Azure Firewall evaluation environment with an ARM template so that I can evaluate Kubernetes-based egress policies.
---

# Quickstart: Deploy Azure Firewall for Containers with Azure Resource Manager

In this quickstart, you use an Azure Resource Manager (ARM) template to create a new Azure Kubernetes Service (AKS) cluster and Azure Firewall Premium for Azure Firewall for Containers. The template also configures managed identities, a firewall policy, and the network routing.

By default, the template deploys only Azure resources. You then install the Azure Firewall Controller and attach a sample security policy by following the template's README. An optional parameter also installs the controller, a sample policy, and test pods.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

> [!IMPORTANT]
> Azure Firewall for Containers is currently in public preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

If your environment meets the prerequisites, select **Deploy to Azure**. The template opens on the **Custom deployment** page in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the ARM template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fazurefirewall-for-containers-aks%2Fazuredeploy.json":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Access to Azure Firewall for Containers in a supported preview region.
- The `Microsoft.ContainerService` and `Microsoft.Network` resource providers registered in the subscription.
- Permission to create AKS, networking resources, managed identities, and role assignments in the resource group. Creating role assignments requires an appropriate role, such as Role Based Access Control Administrator, at the assignment scope.
- Capacity and quota for the selected AKS node virtual machine size. The default deployment uses two nodes with size `Standard_DS3_v2`; this size must be available in your selected region.
- The [Azure CLI](/cli/azure/install-azure-cli), [kubectl](/azure/aks/learn/quick-kubernetes-deploy-cli), and [Helm](https://helm.sh/docs/intro/install/) for the steps after deployment.

Use an isolated evaluation environment. The template creates a new cluster and routes the AKS subnet's outbound traffic through the firewall.

To leave the template's **Location** parameter at its default, select or create a resource group in one of these preview regions:

| Region | Azure region value |
| --- | --- |
| Central US EUAP | `centraluseuap` |
| East US 2 EUAP | `eastus2euap` |
| West Central US | `westcentralus` |
| East Asia | `eastasia` |
| UK South | `uksouth` |
| Central US | `centralus` |

## Review the template

The template is from [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/azurefirewall-for-containers-aks).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/azurefirewall-for-containers-aks/azuredeploy.json":::

The template creates these resources:

| Resource | Purpose |
| --- | --- |
| Virtual network and subnets | Provide an AKS subnet, `AzureFirewallSubnet`, and `AzureFirewallManagementSubnet` |
| AKS cluster | Run workloads with Azure CNI, an OIDC issuer, and workload identity |
| Azure Firewall Premium and public IP addresses | Inspect the cluster's egress traffic |
| Firewall policy and rule collection group | Allow required AKS outbound traffic and HTTPS to `*.afc.azure.com` |
| Route table and subnet association | Route the AKS subnet's outbound traffic through the firewall |
| Managed identities, role assignments, and a federated identity credential | Authorize AKS networking and the Azure Firewall Controller |
| Optional deployment script and its identity | Install the controller, sample policy, attachment, and test pods when **Deploy Controller And Sample** is **true** |

## Deploy the template

Keep **Deploy Controller And Sample** set to **false** unless your environment permits the optional deployment script.

1. Select **Deploy to Azure** at the end of the introduction and sign in to Azure. The portal opens the **Custom deployment** page.
1. Configure these settings:

   | Setting | Value |
   | --- | --- |
   | **Subscription** | Select the subscription for the evaluation |
   | **Resource group** | Select or create a resource group; a new, dedicated resource group makes cleanup safer |
   | **Region** | Use a preview region listed in Prerequisites |
   | **Name Prefix** | Use the default `afc`, or enter a prefix for the resource names |
   | **Node Vm Size** | Use `Standard_DS3_v2` only if it's available in the selected region; otherwise, enter an available size |
   | **Deploy Controller And Sample** | Leave **false** to deploy Azure resources only, then follow the README's installation steps. Set **true** only if shared key access is permitted for the deployment script |

   > [!NOTE]
   > With **Deploy Controller And Sample** set to `true`, the template runs a deployment script that requires a storage account with shared key access. If the built-in Azure Policy **Storage accounts should prevent shared key access** is assigned with the **Deny** effect, the deployment fails. Keep the default (`false`) and follow the install steps, or see the [template README](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/azurefirewall-for-containers-aks/README.md#optional-one-click-install) to check for the policy and request an exemption.

1. Leave the other parameters at their defaults. Select **Review + create** and review the validation results.
1. Select **Create**.

Allow about 10-15 minutes for the Azure resources to deploy, or 30-45 minutes with **Deploy Controller And Sample** set to **true**. Deployment time can vary.

## Review deployed resources

1. In the Azure portal, open the resource group and select **Deployments**. Open the template deployment and confirm that it succeeded.
1. Review the deployed AKS cluster, Azure Firewall, firewall policy, virtual network, routing, and identities. Select **Outputs** to find the cluster name, firewall resource ID, and commands for the next steps.
1. Complete the controller and policy setup for your deployment option:

   | Deployment option | Next action |
   | --- | --- |
   | **Deploy Controller And Sample** is **false** | Follow [Install the controller and attach a policy](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/azurefirewall-for-containers-aks#install-the-controller-and-attach-a-policy). Use the `getCredentialsCommand` and `helmInstallCommand` deployment outputs instead of the README's example commands. Use the resource IDs in the outputs when creating the sample firewall reference and policy attachment |
   | **Deploy Controller And Sample** is **true** | The deployment script installs the controller, sample policy, attachment, and test pods. Run `getCredentialsCommand` to connect from your own environment. Skip the README's controller installation and pod-creation commands so that you don't recreate existing resources |

Before running Azure CLI commands, sign in and select the subscription used for this deployment. If you changed **Name Prefix**, use deployment outputs such as `clusterName`, `firewallId`, `aksSubnetId`, and `controllerIdentityClientId` rather than the README's default resource names.

Use the README's [traffic tests](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/azurefirewall-for-containers-aks#test-traffic) to verify the sample policy's allow and deny behavior. If the deployment script already created the test pods, use the test commands for those existing pods. A successful Azure deployment alone doesn't verify traffic filtering.

## Clean up resources

If you created a resource group exclusively for this quickstart, delete it when you finish evaluating the deployment:

1. In the Azure portal, open the resource group and review its resources. Confirm that it contains no resources you need to keep.
1. Select **Delete resource group**.
1. Enter the resource group name and confirm the deletion.

Deleting the resource group removes all resources in it. If you reused a resource group, don't delete the group. Remove only resources you created for this evaluation. Follow the [controller cleanup guidance](deploy-firewall-for-containers.md#clean-up-resources) if you need to remove individual policies or attachments.

## Next steps

> [!div class="nextstepaction"]
> [Deploy and configure Azure Firewall for Containers](deploy-firewall-for-containers.md)
