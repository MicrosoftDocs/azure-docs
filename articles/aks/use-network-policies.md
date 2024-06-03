---
title: Secure pod traffic with network policies
titleSuffix: Azure Kubernetes Service
description: Learn how to secure traffic that flows in and out of pods by using Kubernetes network policies in Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 03/28/2024
author: schaffererin
ms.author: schaffererin

---

# Secure traffic between pods by using network policies in AKS

When you run modern, microservices-based applications in Kubernetes, you often want to control which components can communicate with each other. The principle of least privilege should be applied to how traffic can flow between pods in an Azure Kubernetes Service (AKS) cluster. Let's say you want to block traffic directly to back-end applications. The network policy feature in Kubernetes lets you define rules for ingress and egress traffic between pods in a cluster.

This article shows you how to install the network policy engine and create Kubernetes network policies to control the flow of traffic between pods in AKS. Network policies could be used for Linux-based or Windows-based nodes and pods in AKS.

## Overview of network policy

All pods in an AKS cluster can send and receive traffic without limitations, by default. To improve security, you can define rules that control the flow of traffic. Back-end applications are often only exposed to required front-end services, for example. Or, database components are only accessible to the application tiers that connect to them.

Network policy is a Kubernetes specification that defines access policies for communication between pods. When you use network policies, you define an ordered set of rules to send and receive traffic. You apply the rules to a collection of pods that match one or more label selectors.

The network policy rules are defined as YAML manifests. Network policies can be included as part of a wider manifest that also creates a deployment or service.

## Network policy options in AKS

Azure provides three Network Policy engines for enforcing network policies:

* _Cilium_ for AKS clusters that use [Azure CNI Powered by Cilium](./azure-cni-powered-by-cilium.md).
* _Azure Network Policy Manager_.
* _Calico_, an open-source network and network security solution founded by [Tigera][tigera].

Cilium is our recommended Network Policy engine. Cilium enforces network policy on the traffic using Linux Berkeley Packet Filter (BPF), which is generally more efficient than "IPTables". See more details in [Azure CNI Powered by Cilium documentation](./azure-cni-powered-by-cilium.md).  
To enforce the specified policies, Azure Network Policy Manager for Linux uses Linux _IPTables_. Azure Network Policy Manager for Windows uses _Host Network Service (HNS) ACLPolicies_. Policies are translated into sets of allowed and disallowed IP pairs. These pairs are then programmed as `IPTable` or `HNS ACLPolicy` filter rules.


## Differences between Network Policy engines: Cilium, Azure NPM, and Calico

| Capability                               | Azure Network Policy Manager                    | Calico                     | Cilium
|------------------------------------------|-------------------------------------------------|----------------------------|----------------------------------------------------|
| Supported platforms                      | Linux, Windows Server 2022 (Preview).                     | Linux, Windows Server 2019 and 2022.  | Linux.
| Supported networking options             | Azure Container Networking Interface (CNI).                  | Azure CNI (Linux, Windows Server 2019 and 2022) and kubenet (Linux). | Azure CNI.
| Compliance with Kubernetes specification | All policy types supported | All policy types are supported. | All policy types are supported.
| Other features                           | None.                       | Extended policy model consisting of Global Network Policy, Global Network Set, and Host Endpoint. For more information on using the `calicoctl` CLI to manage these extended features, see [calicoctl user reference][calicoctl]. | None.
| Support                                  | Supported by Azure Support and Engineering team. | Supported by Azure Support and Engineering team. | Supported by Azure Support and Engineering team.

## Limitations

Azure Network Policy Manager doesn't support IPv6. Otherwise, Azure Network Policy Manager fully supports the network policy specifications in Linux.

In Windows, Azure Network Policy Manager doesn't support:

  * Named ports.
  * Stream Control Transmission Protocol (SCTP).
  * Negative match label or namespace selectors (for example, all labels except `debug=true`).
  * `except` classless interdomain routing (CIDR) blocks (a CIDR with exceptions).

>[!NOTE]
>
> Azure Network Policy Manager pod logs record an error if an unsupported policy is created.

## Scale

With Azure Network Policy Manager for Linux, we don't allow scaling beyond 250 nodes and 20,000 pods. If you attempt to scale beyond these limits, you might encounter "Out of Memory" (OOM) errors. To increase your memory limit, create a support ticket.

## Before you begin

You need the Azure CLI version 2.0.61 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Create an AKS cluster and enable network policy

To see network policies in action, you create an AKS cluster that supports network policy and then work on adding policies.

To use Azure Network Policy Manager, you must use the Azure CNI plug-in. Calico can be used with either Azure CNI plug-in or with the Kubenet CNI plug-in.

The following example script creates an AKS cluster with system-assigned identity and enables network policy by using Azure Network Policy Manager.

>[!NOTE]
> Calico can be used with either the `--network-plugin azure` or `--network-plugin kubenet` parameters.

Instead of using a system-assigned identity, you can also use a user-assigned identity. For more information, see [Use managed identities](use-managed-identity.md).

### Create an AKS cluster with Azure Network Policy Manager enabled - Linux only

In this section, you create a cluster with Linux node pools and Azure Network Policy Manager enabled.

To begin, you replace the values for the `$RESOURCE_GROUP_NAME` and `$CLUSTER_NAME` variables.

```azurecli-interactive
$RESOURCE_GROUP_NAME=myResourceGroup-NP
$CLUSTER_NAME=myAKSCluster
$LOCATION=canadaeast
```

Create the AKS cluster and specify `azure` for the `network-plugin` and `network-policy`.

To create a cluster, use the following command:

```azurecli
az aks create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $CLUSTER_NAME \
    --node-count 1 \
    --network-plugin azure \
    --network-policy azure
```

### Create an AKS cluster with Azure Network Policy Manager enabled - Windows Server 2022 (preview)

In this section, you create a cluster with Windows node pools and Azure Network Policy Manager enabled.

> [!NOTE]
> Azure Network Policy Manager with Windows nodes is available on Windows Server 2022 only.
>

#### Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

To install the `aks-preview` extension, run the following command:

```azurecli
az extension add --name aks-preview
```

To update to the latest version of the extension released, run the following command:

```azurecli
az extension update --name aks-preview
```

#### Register the WindowsNetworkPolicyPreview feature flag

Register the `WindowsNetworkPolicyPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "WindowsNetworkPolicyPreview"
```

It takes a few minutes for the status to show _Registered_. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "WindowsNetworkPolicyPreview"
```

When the status reflects _Registered_, refresh the registration of the `Microsoft.ContainerService` resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

#### Create the AKS cluster

Now, you replace the values for the `$RESOURCE_GROUP_NAME`, `$CLUSTER_NAME`, and `$WINDOWS_USERNAME` variables.

```azurecli-interactive
$RESOURCE_GROUP_NAME=myResourceGroup-NP
$CLUSTER_NAME=myAKSCluster
$WINDOWS_USERNAME=myWindowsUserName
$LOCATION=canadaeast
```

Create a username to use as administrator credentials for your Windows Server containers on your cluster. The following command prompts you for a username. Set it to `$WINDOWS_USERNAME`. Remember that the commands in this article are entered into a Bash shell.

```azurecli-interactive
echo "Please enter the username to use as administrator credentials for Windows Server containers on your cluster: " && read WINDOWS_USERNAME
```

To create a cluster, use the following command:

```azurecli
az aks create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $CLUSTER_NAME \
    --node-count 1 \
    --windows-admin-username $WINDOWS_USERNAME \
    --network-plugin azure \
    --network-policy azure
```

It takes a few minutes to create the cluster. By default, your cluster is created with only a Linux node pool. If you want to use Windows node pools, you can add one. Here's an example:

```azurecli
az aks nodepool add \
    --resource-group $RESOURCE_GROUP_NAME \
    --cluster-name $CLUSTER_NAME \
    --os-type Windows \
    --name npwin \
    --node-count 1
```

### Create an AKS cluster with Calico enabled

Create the AKS cluster and specify `--network-plugin azure`, and `--network-policy calico`. Specifying `--network-policy calico` enables Calico on both Linux and Windows node pools.

If you plan on adding Windows node pools to your cluster, include the `windows-admin-username` and `windows-admin-password` parameters that meet the [Windows Server password requirements][windows-server-password].

> [!IMPORTANT]
> At this time, using Calico network policies with Windows nodes is available on new clusters by using Kubernetes version 1.20 or later with Calico 3.17.2 and requires that you use Azure CNI networking. Windows nodes on AKS clusters with Calico enabled also have Floating IP enabled by default.
>
> For clusters with only Linux node pools running Kubernetes 1.20 with earlier versions of Calico, the Calico version automatically upgrades to 3.17.2.

Create a username to use as administrator credentials for your Windows Server containers on your cluster. The following command prompts you for a username. Set it to `$WINDOWS_USERNAME`. Remember that the commands in this article are entered into a Bash shell.

```azurecli-interactive
echo "Please enter the username to use as administrator credentials for Windows Server containers on your cluster: " && read WINDOWS_USERNAME
```

```azurecli
az aks create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $CLUSTER_NAME \
    --node-count 1 \
    --windows-admin-username $WINDOWS_USERNAME \
    --network-plugin azure \
    --network-policy calico
```

It takes a few minutes to create the cluster. By default, your cluster is created with only a Linux node pool. If you want to use Windows node pools, you can add one. For example:

```azurecli
az aks nodepool add \
    --resource-group $RESOURCE_GROUP_NAME \
    --cluster-name $CLUSTER_NAME \
    --os-type Windows \
    --name npwin \
    --node-count 1
```

## Install Azure Network Policy Manager or Calico in an existing cluster
Installing Azure Network Policy Manager or Calico on existing AKS clusters is also supported.
> [!WARNING]
> The upgrade process triggers each node pool to be re-imaged simultaneously. Upgrading each node pool separately isn't supported. Any disruptions to cluster networking are similar to a node image upgrade or [Kubernetes version upgrade](./upgrade-cluster.md) where each node in a node pool is re-imaged.

Example command to install Azure Network Policy Manager:
```azurecli
az aks update
    --resource-group $RESOURCE_GROUP_NAME \
    --name $CLUSTER_NAME \
    --network-policy azure
```

Example command to install Calico:
> [!WARNING]
> This warning applies to upgrading Kubenet clusters with Calico enabled to Azure CNI Overlay with Calico enabled.  
> - In Kubenet clusters with Calico enabled, Calico is used as both a CNI and network policy engine.  
> - In Azure CNI clusters, Calico is used only for network policy enforcement, not as a CNI. This can cause a short delay between when the pod starts and when Calico allows outbound traffic from the pod.
>
>  It is recommended to use Cilium instead of Calico to avoid this issue. Learn more about Cilium at [Azure CNI Powered by Cilium](./azure-cni-powered-by-cilium.md)
>  

```azurecli
az aks update
    --resource-group $RESOURCE_GROUP_NAME \
    --name $CLUSTER_NAME \
    --network-policy calico
```

## Upgrade an existing cluster that has Azure NPM or Calico installed to Azure CNI Powered by Cilium
To upgrade an existing cluster that has Network Policy engine installed to Azure CNI Powered by Cilium, see [Upgrade an existing cluster to Azure CNI Powered by Cilium](azure-cni-powered-by-cilium.md#upgrade-an-existing-cluster-to-azure-cni-powered-by-cilium)

## Verify network policy setup

When the cluster is ready, configure `kubectl` to connect to your Kubernetes cluster by using the [az aks get-credentials][az-aks-get-credentials] command. This command downloads credentials and configures the Kubernetes CLI to use them:

```azurecli-interactive
az aks get-credentials --resource-group $RESOURCE_GROUP_NAME --name $CLUSTER_NAME
```

To begin verification of network policy, you create a sample application and set traffic rules.

First, create a namespace called `demo` to run the example pods:

```console
kubectl create namespace demo
```

Now create two pods in the cluster named `client` and `server`.

>[!NOTE]
> If you want to schedule the client or server on a particular node, add the following bit before the `--command` argument in the pod creation [kubectl run][kubectl-run] command:

> ```console
>--overrides='{"spec": { "nodeSelector": {"kubernetes.io/os": "linux|windows"}}}'

Create a `server` pod. This pod serves on TCP port 80:

```console
kubectl run server -n demo --image=k8s.gcr.io/e2e-test-images/agnhost:2.33 --labels="app=server" --port=80 --command -- /agnhost serve-hostname --tcp --http=false --port "80"
```

Create a `client` pod. The following command runs Bash on the `client` pod:

```console
kubectl run -it client -n demo --image=k8s.gcr.io/e2e-test-images/agnhost:2.33 --command -- bash
```

Now, in a separate window, run the following command to get the server IP:

```console
kubectl get pod --output=wide -n demo
```

The output should look like:

```output
NAME     READY   STATUS    RESTARTS   AGE   IP            NODE             NOMINATED NODE   READINESS GATES
server   1/1     Running   0          30s   10.224.0.72   akswin22000001   <none>           <none>
```

### Test connectivity without network policy

In the client's shell, run the following command to verify connectivity with the server. Replace `server-ip` by using the IP found in the output from running the previous command. If the connection is successful, there's no output.

```console
/agnhost connect <server-ip>:80 --timeout=3s --protocol=tcp
```

### Test connectivity with network policy

To add network policies create a file named `demo-policy.yaml` and paste the following YAML manifest:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: demo-policy
  namespace: demo
spec:
  podSelector:
    matchLabels:
      app: server
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: client
    ports:
    - port: 80
      protocol: TCP
```

Specify the name of your YAML manifest and apply it by using [kubectl apply][kubectl-apply]:

```console
kubectl apply –f demo-policy.yaml
```

Now, in the client's shell, verify connectivity with the server by running the following `/agnhost` command:

```console
/agnhost connect <server-ip>:80 --timeout=3s --protocol=tcp
```

Connectivity with traffic is blocked because the server is labeled with `app=server`, but the client isn't labeled. The preceding connect command yields this output:

```output
TIMEOUT
```

Run the following command to label the `client` and verify connectivity with the server. The output should return nothing.

```console
kubectl label pod client -n demo app=client
```

## Uninstall Azure Network Policy Manager or Calico (Preview)

Requirements:
 - aks-preview Azure CLI extension version 0.5.166 or later. See [Install the aks-preview Azure CLI extension](#install-the-aks-preview-azure-cli-extension).
 - Azure CLI version 2.54 or later
 - AKS REST API version 2023-08-02-preview or later

> [!NOTE]
 > - The uninstall process does _**not**_ remove Custom Resource Definitions (CRDs) and Custom Resources (CRs) used by Calico. These CRDs and CRs all have names ending with either "projectcalico.org" or "tigera.io".
 > These CRDs and associated CRs can be manually deleted _after_ Calico is successfully uninstalled (deleting the CRDs before removing Calico breaks the cluster).
 > - The upgrade will not remove any NetworkPolicy resources in the cluster, but after the uninstall these policies are no longer enforced.

> [!WARNING]
> The upgrade process triggers each node pool to be re-imaged simultaneously. Upgrading each node pool separately isn't supported. Any disruptions to cluster networking are similar to a node image upgrade or [Kubernetes version upgrade](./upgrade-cluster.md) where each node in a node pool is re-imaged.

To remove Azure Network Policy Manager or Calico from a cluster, run the following command:
```azurecli
az aks update
    --resource-group $RESOURCE_GROUP_NAME \
    --name $CLUSTER_NAME \
    --network-policy none
```

## Clean up resources

In this article, you created a namespace and two pods and applied a network policy. To clean up these resources, use the [kubectl delete][kubectl-delete] command and specify the resource name:

```console
kubectl delete namespace demo
```

## Next steps

For more information about network resources, see [Network concepts for applications in Azure Kubernetes Service (AKS)][concepts-network].

To learn more about policies, see [Kubernetes network policies][kubernetes-network-policies].

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-run]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#run
[kubernetes-network-policies]: https://kubernetes.io/docs/concepts/services-networking/network-policies/
[azure-cni]: https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md
[policy-rules]: https://kubernetes.io/docs/concepts/services-networking/network-policies/#behavior-of-to-and-from-selectors
[aks-github]: https://github.com/azure/aks/issues
[tigera]: https://www.tigera.io/
[calicoctl]: https://docs.tigera.io/calico/3.25/reference/calicoctl/
[calico-support]: https://www.tigera.io/tigera-products/calico/
[calico-logs]: https://docs.tigera.io/calico/3.25/operations/troubleshoot/component-logs
[calico-aks-cleanup]: https://github.com/Azure/aks-engine/blob/master/docs/topics/calico-3.3.1-cleanup-after-upgrade.yaml

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[use-advanced-networking]: configure-azure-cni.md
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[concepts-network]: concepts-network.md
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-provider-register]: /cli/azure/provider#az-provider-register
[windows-server-password]: /windows/security/threat-protection/security-policy-settings/password-must-meet-complexity-requirements#reference
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[dsr]: ../load-balancer/load-balancer-multivip-overview.md#rule-type-2-backend-port-reuse-by-using-floating-ip

