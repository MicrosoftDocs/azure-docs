---
title: Create a Windows Server container on an Azure Kubernetes Service (AKS) cluster using Azure CLI
description: Learn how to quickly create a Kubernetes cluster and deploy an application in a Windows Server container in Azure Kubernetes Service (AKS) using Azure CLI.
ms.topic: article
ms.custom: event-tier1-build-2022, devx-track-azurecli
ms.date: 07/11/2023
#Customer intent: As a developer or cluster operator, I want to quickly create an AKS cluster and deploy a Windows Server container so that I can see how to run applications running on a Windows Server container using the managed Kubernetes service in Azure.
---

# Create a Windows Server container on an Azure Kubernetes Service (AKS) cluster using Azure CLI

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage clusters. In this article, you use Azure CLI to deploy an AKS cluster that runs Windows Server containers. You also deploy an ASP.NET sample application in a Windows Server container to the cluster.

:::image type="content" source="media/quick-windows-container-deploy-cli/asp-net-sample-app.png" alt-text="Screenshot of browsing to ASP.NET sample application.":::

This article assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)](../concepts-clusters-workloads.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.64 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
- The identity you use to create your cluster must have the appropriate minimum permissions. For more information on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)](../concepts-identity.md).
- If you have multiple Azure subscriptions, select the appropriate subscription ID in which the resources should be billed using the [`az account`](/cli/azure/account) command.
- Verify the *Microsoft.OperationsManagement* and *Microsoft.OperationalInsights* providers are registered on your subscription. Check the registration status using the following [`az provider show`][az-provider-show] commands:

  ```sh
  az provider show -n Microsoft.OperationsManagement -o table
  az provider show -n Microsoft.OperationalInsights -o table
  ```

  If they're not registered, register them using the following [`az provider register`][az-provider-register] commands:
  
  ```sh
  az provider register --namespace Microsoft.OperationsManagement
  az provider register --namespace Microsoft.OperationalInsights
  ```
  
  > [!NOTE]
  > Run the commands with administrative privileges if you plan to run the commands in this quickstart locally instead of in Azure Cloud Shell.

## Limitations

The following limitations apply when you create and manage AKS clusters that support multiple node pools:

- You can't delete the first node pool.

The following limitations apply to *Windows Server node pools*:

- The AKS cluster can have a maximum of 10 node pools.
- The AKS cluster can have a maximum of 100 nodes in each node pool.
- The Windows Server node pool name has a limit of six characters.

## Create a resource group

An [Azure resource group](../../azure-resource-manager/management/overview.md) is a logical group in which Azure resources are deployed and managed. When you create a resource group, you're asked to specify a location. This location is where resource group metadata is stored and where your resources run in Azure if you don't specify another region during resource creation.

- Create a resource group using the [`az group create`][az-group-create] command. The following example creates a resource group named *myResourceGroup* in the *eastus* location.

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    ```

    The following example output shows the resource group created successfully:

    ```output
    {
      "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup",
      "location": "eastus",
      "managedBy": null,
      "name": "myResourceGroup",
      "properties": {
        "provisioningState": "Succeeded"
      },
      "tags": null,
      "type": null
    }
    ```

## Create an AKS cluster

In this section, we create an AKS cluster with the following configuration:

- The cluster is configured with two nodes to ensure it operates reliably.
- The `--windows-admin-password` and `--windows-admin-username` parameters set the administrator credentials for any Windows Server nodes on the cluster and must meet [Windows Server password requirements][windows-server-password].
- The node pool uses `VirtualMachineScaleSets`.

> [!NOTE]
> To run an AKS cluster that supports node pools for Windows Server containers, your cluster needs to use a network policy that uses [Azure CNI (advanced)][azure-cni] network plugin.

1. Create a username to use as administrator credentials for the Windows Server nodes on your cluster. The following commands prompt you for a username and set it to *WINDOWS_USERNAME* for use in a later command (remember the commands in this article are entered into a BASH shell).

    ```azurecli-interactive
    echo "Please enter the username to use as administrator credentials for Windows Server nodes on your cluster: " && read WINDOWS_USERNAME
    ```

2. Create a password for the administrator username you created in the previous step.

    ```azurecli-interactive
    echo "Please enter the password to use as administrator credentials for Windows Server nodes on your cluster: " && read WINDOWS_PASSWORD
    ```

3. Create your cluster using the [`az aks create`][az-aks-create] command and specify the `--windows-admin-username` and `--windows-admin-password` parameters. The following example command creates a cluster using the value from *WINDOWS_USERNAME* you set in the previous command. Alternatively, you can provide a different username directly in the parameter instead of using *WINDOWS_USERNAME*.

    ```azurecli-interactive
    az aks create \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --node-count 2 \
        --enable-addons monitoring \
        --generate-ssh-keys \
        --windows-admin-username $WINDOWS_USERNAME \
        --windows-admin-password $WINDOWS_PASSWORD \
        --vm-set-type VirtualMachineScaleSets \
        --network-plugin azure
    ```

    > [!NOTE]
    >
    > - If you get a password validation error, verify the password you set meets the [Windows Server password requirements][windows-server-password]. If your password meets the requirements, try creating your resource group in another region. Then try creating the cluster with the new resource group.
    > - If you don't specify an administrator username and password when setting `--vm-set-type VirtualMachineScaleSets` and `--network-plugin azure`, the username is set to *azureuser* and the password is set to a random value.
    > - The administrator username can't be changed, but you can change the administrator password your AKS cluster uses for Windows Server nodes using `az aks update`. For more information, see [Windows Server node pools FAQ][win-faq-change-admin-creds].

    After a few minutes, the command completes and returns JSON-formatted information about the cluster. Occasionally, the cluster can take longer than a few minutes to provision. Allow up to 10 minutes for provisioning.

## Add a node pool

### [Add a Windows node pool](#tab/add-windows-node-pool)

By default, an AKS cluster is created with a node pool that can run Linux containers. You have to add another node pool that can run Windows Server containers alongside the Linux node pool.

- Add a Windows node pool using the `az aks nodepool add` command. The following command creates a new node pool named *npwin* and adds it to *myAKSCluster*. The command also uses the default subnet in the default virtual network created when running `az aks create`. An OS SKU isn't specified, so the node pool is set to the default operating system based on the Kubernetes version of the cluster.

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --os-type Windows \
        --name npwin \
        --node-count 1
    ```

### [Add a Windows Server 2019 node pool](#tab/add-windows-server-2019-node-pool)

Windows Server 2022 is the default operating system for Kubernetes versions 1.25.0 and higher. Windows Server 2019 is the default OS for earlier versions. To use Windows Server 2019, you need to specify the following parameters:

- `os-type` set to `Windows`
- `os-sku` set to `Windows2019`

> [!NOTE]
> Windows Server 2019 is being retired after Kubernetes version 1.32 reaches end of life (EOL) and won't be supported in future releases. For more information about this retirement, see the [AKS release notes][aks-release-notes].

- Add a Windows Server 2019 node pool using the `az aks nodepool add` command.

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --os-type Windows \
        --os-sku Windows2019 \
        --name npwin \
        --node-count 1
    ```

### [Add a Windows Server 2022 node pool](#tab/add-windows-server-2022-node-pool)

Windows Server 2022 is the default operating system for Kubernetes versions 1.25.0 and higher. Windows Server 2019 is the default OS for earlier versions. To use Windows Server 2022, you need to specify the following parameters:

- `os-type` set to `Windows`
- `os-sku` set to `Windows2022`

> [!NOTE]
> Windows Server 2022 requires Kubernetes version 1.23.0 or higher.

- Add a Windows Server 2022 node pool using the `az aks nodepool add` command.

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --os-type Windows \
        --os-sku Windows2022 \
        --name npwin \
        --node-count 1
    ```

---

## Connect to the cluster

You use [kubectl][kubectl], the Kubernetes command-line client, to manage your Kubernetes clusters. If you use Azure Cloud Shell, `kubectl` is already installed. To you want to install `kubectl` locally, you can use the [`az aks install-cli`][az-aks-install-cli] command.

1. Configure `kubectl` to connect to your Kubernetes cluster using the [`az aks get-credentials][az-aks-get-credentials] command. This command downloads credentials and configures the Kubernetes CLI to use them.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

2. Verify the connection to your cluster using the [`kubectl get`][kubectl-get] command, which returns a list of the cluster nodes.

    ```console
    kubectl get nodes -o wide
    ```

    The following example output shows all nodes in the cluster. Make sure the status of all nodes is *Ready*:

    ```output
    NAME                                STATUS   ROLES   AGE   VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                         KERNEL-VERSION      CONTAINER-RUNTIME
    aks-nodepool1-90538373-vmss000000   Ready    agent   54m   v1.25.6   10.224.0.33   <none>        Ubuntu 22.04.2 LTS               5.15.0-1035-azure   containerd://1.6.18+azure-1
    aks-nodepool1-90538373-vmss000001   Ready    agent   55m   v1.25.6   10.224.0.4    <none>        Ubuntu 22.04.2 LTS               5.15.0-1035-azure   containerd://1.6.18+azure-1
    aksnpwin000000                      Ready    agent   40m   v1.25.6   10.224.0.62   <none>        Windows Server 2022 Datacenter   10.0.20348.1668     containerd://1.6.14+azure
    ```

    > [!NOTE]
    > The container runtime for each node pool is shown under *CONTAINER-RUNTIME*. Notice *aksnpwin987654* begins with `docker://`, which means it uses Docker for the container runtime. Notice *aksnpwcd123456* begins with `containerd://`, which means it uses `containerd` for the container runtime.

## Deploy the application

A Kubernetes manifest file defines a desired state for the cluster, such as what container images to run. In this article, you use a manifest to create all objects needed to run the ASP.NET sample application in a Windows Server container. This manifest includes a [Kubernetes deployment][kubernetes-deployment] for the ASP.NET sample application and an external [Kubernetes service][kubernetes-service] to access the application from the internet.

The ASP.NET sample application is provided as part of the [.NET Framework Samples][dotnet-samples] and runs in a Windows Server container. AKS requires Windows Server containers to be based on images of *Windows Server 2019* or greater. The Kubernetes manifest file must also define a [node selector][node-selector] to tell your AKS cluster to run your ASP.NET sample application's pod on a node that can run Windows Server containers.

1. Create a file named `sample.yaml` and copy in the following YAML definition.

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: sample
      labels:
        app: sample
    spec:
      replicas: 1
      template:
        metadata:
          name: sample
          labels:
            app: sample
        spec:
          nodeSelector:
            "kubernetes.io/os": windows
          containers:
          - name: sample
            image: mcr.microsoft.com/dotnet/framework/samples:aspnetapp
            resources:
              limits:
                cpu: 1
                memory: 800M
            ports:
              - containerPort: 80
      selector:
        matchLabels:
          app: sample
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: sample
    spec:
      type: LoadBalancer
      ports:
      - protocol: TCP
        port: 80
      selector:
        app: sample
    ```

    For a breakdown of YAML manifest files, see [Deployments and YAML manifests](../concepts-clusters-workloads.md#deployments-and-yaml-manifests).

2. Deploy the application using the [`kubectl apply`][kubectl-apply] command and specify the name of your YAML manifest.

    ```console
    kubectl apply -f sample.yaml
    ```

    The following example output shows the deployment and service created successfully:

    ```output
    deployment.apps/sample created
    service/sample created
    ```

## Test the application

When the application runs, a Kubernetes service exposes the application front end to the internet. This process can take a few minutes to complete. Occasionally, the service can take longer than a few minutes to provision. Allow up to 10 minutes for provisioning.

1. Monitor progress using the [`kubectl get service`][kubectl-get] command with the `--watch` argument.

    ```console
    kubectl get service sample --watch
    ```

    Initially, the output shows the *EXTERNAL-IP* for the sample service as *pending*:

    ```output
    NAME               TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
    sample             LoadBalancer   10.0.37.27   <pending>     80:30572/TCP   6s
    ```

    When the *EXTERNAL-IP* address changes from *pending* to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process. The following example output shows a valid public IP address assigned to the service:

    ```output
    sample  LoadBalancer   10.0.37.27   52.179.23.131   80:30572/TCP   2m
    ```

2. See the sample app in action by opening a web browser to the external IP address of your service.

    :::image type="content" source="media/quick-windows-container-deploy-cli/asp-net-sample-app.png" alt-text="Screenshot of browsing to ASP.NET sample application.":::

    > [!NOTE]
    > If you receive a connection timeout when trying to load the page, you should verify the sample app is ready using the `kubectl get pods --watch` command. Sometimes, the Windows container isn't started by the time your external IP address is available.

## Delete resources

If you don't plan on going through the following tutorials, you should delete your cluster to avoid incurring Azure charges.

- Delete your resource group, container service, and all related resources using the [`az group delete`][az-group-delete] command.

    ```azurecli-interactive
    az group delete --name myResourceGroup --yes --no-wait
    ```

    > [!NOTE]
    > The AKS cluster was created with system-assigned managed identity (default identity option used in this quickstart). The Azure platform manages this identity, so it doesn't require removal.

## Next steps

In this article, you deployed a Kubernetes cluster and deployed an ASP.NET sample application in a Windows Server container to it.

To learn more about AKS, and walk through a complete code to deployment example, continue to the following Kubernetes cluster tutorial.

> [!div class="nextstepaction"]
> [AKS tutorial][aks-tutorial]

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[node-selector]: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
[dotnet-samples]: https://hub.docker.com/_/microsoft-dotnet-framework-samples/
[azure-cni]: https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md
[aks-release-notes]: https://github.com/Azure/AKS/releases

<!-- LINKS - internal -->
[aks-tutorial]: ../tutorial-kubernetes-prepare-app.md
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-aks-install-cli]: /cli/azure/aks#az_aks_install_cli
[az-group-create]: /cli/azure/group#az_group_create
[az-group-delete]: /cli/azure/group#az_group_delete
[az-provider-register]: /cli/azure/provider#az_provider_register
[kubernetes-deployment]: ../concepts-clusters-workloads.md#deployments-and-yaml-manifests
[kubernetes-service]: ../concepts-network.md#services
[windows-server-password]: /windows/security/threat-protection/security-policy-settings/password-must-meet-complexity-requirements#reference
[win-faq-change-admin-creds]: ../windows-faq.md#how-do-i-change-the-administrator-password-for-windows-server-nodes-on-my-cluster
[az-provider-show]: /cli/azure/provider#az_provider_show
