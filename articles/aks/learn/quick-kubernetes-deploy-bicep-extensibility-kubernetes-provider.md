---
title: Quickstart - Deploy Azure applications to Azure Kubernetes Service clusters using Bicep extensibility Kubernetes provider
description: Learn how to quickly create a Kubernetes cluster and deploy Azure applications in Azure Kubernetes Service (AKS) using Bicep extensibility Kubernetes provider.
ms.topic: quickstart
ms.custom: devx-track-bicep
ms.date: 02/21/2023
#Customer intent: As a developer or cluster operator, I want to quickly create an AKS cluster and deploy an application so that I can see how to run applications using the managed Kubernetes service in Azure.
---

# Quickstart: Deploy Azure applications to Azure Kubernetes Service (AKS) clusters using Bicep extensibility Kubernetes provider (Preview)

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage clusters. In this quickstart, you'll deploy a sample multi-container application with a web front-end and a Redis instance to an AKS cluster.

This quickstart assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].

[!INCLUDE [About Bicep](../../../includes/resource-manager-quickstart-bicep-introduction.md)]

> [!IMPORTANT]
> The Bicep Kubernetes provider is currently in preview. You can enable the feature from the [Bicep configuration file](../../azure-resource-manager/bicep/bicep-config.md#enable-experimental-features) by adding:
>
> ```json
> {
>  "experimentalFeaturesEnabled": {
>    "extensibility": true,
>  }
> }
> ```

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

* To set up your environment for Bicep development, see [Install Bicep tools](../../azure-resource-manager/bicep/install.md). After completing those steps, you'll have [Visual Studio Code](https://code.visualstudio.com/) and the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep). You also have either the latest [Azure CLI](/cli/azure/) or the latest [Azure PowerShell module](/powershell/azure/new-azureps-module-az).

* To create an AKS cluster using a Bicep file, you provide an SSH public key. If you need this resource, see [Create an SSH key pair](#create-an-ssh-key-pair). If not, skip to [Review the Bicep file](#review-the-bicep-file).

* The identity you use to create your cluster has the appropriate minimum permissions. For more information on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)](../concepts-identity.md).

* To deploy a Bicep file, you need write access on the resources you deploy and access to all operations on the `Microsoft.Resources/deployments` resource type. For example, to deploy a virtual machine, you need `Microsoft.Compute/virtualMachines/write and Microsoft.Resources/deployments/*` permissions. For a list of roles and permissions, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).

### Create an SSH key pair

To access AKS nodes, you connect using an SSH key pair (public and private), which you generate using the `ssh-keygen` command. By default, these files are created in the *~/.ssh* directory. Running the `ssh-keygen` command will overwrite any SSH key pair with the same name already existing in the given location.

1. Go to [https://shell.azure.com](https://shell.azure.com) to open Cloud Shell in your browser.

1. Run the `ssh-keygen` command. The following example creates an SSH key pair using RSA encryption and a bit length of 4096:

    ```console
    ssh-keygen -t rsa -b 4096
    ```

For more information about creating SSH keys, see [Create and manage SSH keys for authentication in Azure][ssh-keys].

## Review the Bicep file

The Bicep file used to create an AKS cluster is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/aks/). For more AKS samples, see the [AKS quickstart templates][aks-quickstart-templates] site.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.kubernetes/aks/main.bicep":::

The resource defined in the Bicep file is [**Microsoft.ContainerService/managedClusters**](/azure/templates/microsoft.containerservice/managedclusters?tabs=bicep&pivots=deployment-language-bicep).

Save a copy of the file as `main.bicep` to your local computer.

## Add the application definition

A [Kubernetes manifest file][kubernetes-deployment] defines a cluster's desired state, such as which container images to run.

In this quickstart, you use a manifest to create all objects needed to run the [Azure Vote application][azure-vote-app]. This manifest includes two [Kubernetes deployments][kubernetes-deployment]:

* The sample Azure Vote Python applications
* A Redis instance

Two [Kubernetes Services][kubernetes-service] are also created:

* An internal service for the Redis instance
* An external service to access the Azure Vote application from the internet

Use the following procedure to add the application definition:

1. Create a file named `azure-vote.yaml` in the same folder as `main.bicep` with the following YAML definition:

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: azure-vote-back
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: azure-vote-back
      template:
        metadata:
          labels:
            app: azure-vote-back
        spec:
          nodeSelector:
            "kubernetes.io/os": linux
          containers:
          - name: azure-vote-back
            image: mcr.microsoft.com/oss/bitnami/redis:6.0.8
            env:
            - name: ALLOW_EMPTY_PASSWORD
              value: "yes"
            resources:
              requests:
                cpu: 100m
                memory: 128Mi
              limits:
                cpu: 250m
                memory: 256Mi
            ports:
            - containerPort: 6379
              name: redis
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: azure-vote-back
    spec:
      ports:
      - port: 6379
      selector:
        app: azure-vote-back
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: azure-vote-front
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: azure-vote-front
      template:
        metadata:
          labels:
            app: azure-vote-front
        spec:
          nodeSelector:
            "kubernetes.io/os": linux
          containers:
          - name: azure-vote-front
            image: mcr.microsoft.com/azuredocs/azure-vote-front:v1
            resources:
              requests:
                cpu: 100m
                memory: 128Mi
              limits:
                cpu: 250m
                memory: 256Mi
            ports:
            - containerPort: 80
            env:
            - name: REDIS
              value: "azure-vote-back"
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: azure-vote-front
    spec:
      type: LoadBalancer
      ports:
      - port: 80
      selector:
        app: azure-vote-front
    ```

    For a breakdown of YAML manifest files, see [Deployments and YAML manifests](../concepts-clusters-workloads.md#deployments-and-yaml-manifests).

1. Open `main.bicep` in Visual Studio Code.
1. Press <kbd>Ctrl+Shift+P</kbd> to open **Command Palette**.
1. Search for **bicep**, and then select **Bicep: Import Kubernetes Manifest**.

    :::image type="content" source="./media/quick-kubernetes-deploy-bicep-extensibility-kubernetes-provider/bicep-extensibility-kubernetes-provider-import-kubernetes-manifest.png" alt-text="Screenshot of Visual Studio Code import Kubernetes Manifest.":::

1. Select `azure-vote.yaml` from the prompt. This process creates an `azure-vote.bicep` file in the same folder.
1. Open `azure-vote.bicep` and add the following line at the end of the file to output the load balancer public IP:

    ```bicep
    output frontendIp string = coreService_azureVoteFront.status.loadBalancer.ingress[0].ip
    ```

1. Before the `output` statement in `main.bicep`, add the following Bicep to reference the newly created `azure-vote.bicep` module:

    ```bicep
    module kubernetes './azure-vote.bicep' = {
      name: 'buildbicep-deploy'
      params: {
        kubeConfig: aks.listClusterAdminCredential().kubeconfigs[0].value
      }
    }
    ```

1. At the bottom of `main.bicep`, add the following line to output the load balancer public IP:

    ```bicep
    output lbPublicIp string = kubernetes.outputs.frontendIp
    ```

1. Save both `main.bicep` and `azure-vote.bicep`.

## Deploy the Bicep file

1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name myResourceGroup --location eastus
    az deployment group create --resource-group myResourceGroup --template-file main.bicep --parameters clusterName=<cluster-name> dnsPrefix=<dns-previs> linuxAdminUsername=<linux-admin-username> sshRSAPublicKey='<ssh-key>'
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name myResourceGroup -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName myResourceGroup -TemplateFile ./main.bicep -clusterName=<cluster-name> -dnsPrefix=<dns-prefix> -linuxAdminUsername=<linux-admin-username> -sshRSAPublicKey="<ssh-key>"
    ```

    ---

    Provide the following values in the commands:

    * **Cluster name**: Enter a unique name for the AKS cluster, such as *myAKSCluster*.
    * **DNS prefix**: Enter a unique DNS prefix for your cluster, such as *myakscluster*.
    * **Linux Admin Username**: Enter a username to connect using SSH, such as *azureuser*.
    * **SSH RSA Public Key**: Copy and paste the *public* part of your SSH key pair (by default, the contents of *~/.ssh/id_rsa.pub*).

    It takes a few minutes to create the AKS cluster. Wait for the cluster to be successfully deployed before you move on to the next step.

2. From the deployment output, look for the `outputs` section. For example:

    ```json
    "outputs": {
      "controlPlaneFQDN": {
        "type": "String",
        "value": "myaks0201-d34ae860.hcp.eastus.azmk8s.io"
      },
      "lbPublicIp": {
        "type": "String",
        "value": "52.179.23.131"
      }
    },
    ```

3. Take note of the value of lbPublicIp.

## Validate the Bicep deployment

To see the Azure Vote app in action, open a web browser to the external IP address of your service.

:::image type="content" source="media/quick-kubernetes-deploy-rm-bicep/azure-voting-application.png" alt-text="Screenshot of browsing to Azure Vote sample application.":::

## Clean up resources

### [Azure CLI](#tab/azure-cli)

To avoid Azure charges, if you don't plan on going through the tutorials that follow, clean up your unnecessary resources. Use the [`az group delete`][az-group-delete] command to remove the resource group, container service, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

### [Azure PowerShell](#tab/azure-powershell)

To avoid Azure charges, if you don't plan on going through the tutorials that follow, clean up your unnecessary resources. Use the [`Remove-AzResourceGroup`][remove-azresourcegroup] cmdlet to remove the resource group, container service, and all related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```

---

> [!NOTE]
> In this quickstart, the AKS cluster was created with a system-assigned managed identity (the default identity option). This identity is managed by the platform and doesn't require removal.

## Next steps

In this quickstart, you deployed a Kubernetes cluster and then deployed a sample multi-container application to it.

To learn more about AKS, and walk through a complete code to deployment example, continue to the Kubernetes cluster tutorial:

> [!div class="nextstepaction"]
> [Kubernetes on Azure tutorial: Prepare an application][aks-tutorial]

<!-- LINKS - external -->
[azure-vote-app]: https://github.com/Azure-Samples/azure-voting-app-redis.git
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[azure-dev-spaces]: /previous-versions/azure/dev-spaces/
[aks-quickstart-templates]: https://azure.microsoft.com/resources/templates/?term=Azure+Kubernetes+Service

<!-- LINKS - internal -->
[kubernetes-concepts]: ../concepts-clusters-workloads.md
[aks-monitor]: ../../azure-monitor/containers/container-insights-onboard.md
[aks-tutorial]: ../tutorial-kubernetes-prepare-app.md
[az-aks-browse]: /cli/azure/aks#az_aks_browse
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[import-azakscredential]: /powershell/module/az.aks/import-azakscredential
[az-aks-install-cli]: /cli/azure/aks#az_aks_install_cli
[install-azakskubectl]: /powershell/module/az.aks/install-azaksclitool
[az-group-create]: /cli/azure/group#az_group_create
[az-group-delete]: /cli/azure/group#az_group_delete
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup
[azure-cli-install]: /cli/azure/install-azure-cli
[install-azure-powershell]: /powershell/azure/install-az-ps
[connect-azaccount]: /powershell/module/az.accounts/Connect-AzAccount
[sp-delete]: ../kubernetes-service-principal.md#additional-considerations
[kubernetes-deployment]: ../concepts-clusters-workloads.md#deployments-and-yaml-manifests
[kubernetes-service]: ../concepts-network.md#services
[ssh-keys]: ../../virtual-machines/linux/create-ssh-keys-detailed.md
[az-ad-sp-create-for-rbac]: /cli/azure/ad/sp#az_ad_sp_create_for_rbac
