---
title: Create an Azure Nexus Kubernetes cluster by using Azure Resource Manager template (ARM template)
description: Learn how to create an Azure Nexus Kubernetes cluster by using Azure Resource Manager template (ARM template).
ms.service: azure-operator-nexus
author: dramasamy
ms.author: dramasamy
ms.topic: quickstart-arm
ms.custom: subject-armqs
ms.date: 04/22/2023
---

# Quickstart: Deploy an Azure Nexus Kubernetes cluster by using Azure Resource Manager template (ARM template)

* Deploy an Azure Nexus Kubernetes cluster using an Azure Resource Manager template.

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create Azure Nexus Kubernetes cluster.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

<!-- Final paragraph: Explains that readers who are experienced with ARM templates can continue to
the deployment. For information about the Deploy to Azure image and how to create the template's
URL, see the contributor guide article Write an ARM template quickstart in the Deploy the template
section.

If your environment meets the prerequisites and you're familiar with using ARM templates, select the
**Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Screenshot of the Deploy to Azure button to deploy resources with a template." link="https://portal.azure.com/#create/Microsoft.Template/uri/<encoded template URL>":::
-->

## Prerequisites

[!INCLUDE [kubernetes-cluster-prereq](./includes/kubernetes-cluster-prereq.md)]

<!--
* To create an AKS cluster using a Resource Manager template, you provide an SSH public key. If you need this resource, see the following section; otherwise skip to the [Review the template](#review-the-template) section.

### Create an SSH key pair

To access Kubernetes cluster nodes, you connect using an SSH key pair (public and private), which you generate using the `ssh-keygen` command. By default, these files are created in the *~/.ssh* directory. Running the `ssh-keygen` command overwrites any SSH key pair with the same name already existing in the given location.

1. Go to [https://shell.azure.com](https://shell.azure.com) to open Cloud Shell in your browser.

1. Run the `ssh-keygen` command. The following example creates an SSH key pair using RSA encryption and a bit length of 4096:

    ```console
    ssh-keygen -t rsa -b 4096
    ```
-->

## Review the template

Before deploying the Kubernetes template, let's review the content to understand its structure. 

:::code language="json" source="includes/kubernetes-cluster-arm-deploy.json":::

Once you have reviewed and saved the template file named ```kubernetes-deploy.json```, proceed to the next section to deploy the template.

<!-- After the JSON code fence, add a list of each resource type from the JSON template. List the
resourceType links in the same order as in the template.

- [Azure resource type](link to the template reference): resource type description.
- [Azure resource type](link to the template reference): resource type description.

-->

<!--
For example:

- [Microsoft.KeyVault/vaults](/azure/templates/microsoft.keyvault/vaults): Create an Azure key vault.
- [Microsoft.KeyVault/vaults/secrets](/azure/templates/microsoft.keyvault/vaults/secrets): Create an Azure key vault secret.

-->

<!--
Optional:

List additional quickstart templates. For example:
[Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Keyvault&pageNumber=1&sort=Popular).

Notice the resourceType and sort elements in the URL.

-->

## Deploy the template

1. Create a file named ```kubernetes-deploy-parameters.json``` and add the required parameters in JSON format. You can use the following example as a starting point. Replace the values with your own.

:::code language="json" source="includes/kubernetes-cluster-arm-deploy-params.json":::

2. Deploy the template.

```azurecli
    az deployment group create 
      --resource-group <resource-group-name> \
      --template-file kubernetes-deploy.json \
      --parameters @kubernetes-deploy-parameters.json
```

## Review deployed resources

After the deployment finishes, you can view the resources using the CLI or the Azure portal.

```azurecli
az networkcloud kubernetescluster show \
  --name <kubernetes-cluster-name> \
  --resource-group <resource-group-name>
```

## Clean up resources

When no longer needed, delete the resource group. The resource group and all the resources in the
resource group are deleted.

### [Azure CLI](#tab/azure-cli)

Use the [az group delete][az-group-delete] command to remove the resource group, Kubernetes cluster, and all related resources except the Operator Nexus network resources.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

### [Azure PowerShell](#tab/azure-powershell)

Use the [Remove-AzResourceGroup][remove-azresourcegroup] cmdlet to remove the resource group, Kubernetes cluster, and all related resources except the Operator Nexus network resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```
---

## Next steps

You can now deploy the CNFs either directly via Azure Operator Nexus APIs or via Azure Network Function Manager.

<!-- LINKS - internal -->
[kubernetes-concepts]: ../concepts-clusters-workloads.md
[import-azakscredential]: /powershell/module/az.aks/import-azakscredential
[az-aks-install-cli]: /cli/azure/aks#az_aks_install_cli
[install-azakskubectl]: /powershell/module/az.aks/install-azaksclitool
[az-group-create]: /cli/azure/group#az_group_create
[az-group-delete]: /cli/azure/group#az_group_delete
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup
[azure-cli-install]: /cli/azure/install-azure-cli
[azure-portal]: https://portal.azure.com
[kubernetes-deployment]: ../concepts-clusters-workloads.md#deployments-and-yaml-manifests
[kubernetes-service]: ../concepts-network.md#services
[ssh-keys]: ../../virtual-machines/linux/create-ssh-keys-detailed.md