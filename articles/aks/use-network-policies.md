---
title: Secure pod traffic with network policy
titleSuffix: Azure Kubernetes Service
description: Learn how to secure traffic that flows in and out of pods by using Kubernetes network policies in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 06/24/2022

---

# Secure traffic between pods using network policies in Azure Kubernetes Service (AKS)

When you run modern, microservices-based applications in Kubernetes, you often want to control which components can communicate with each other. The principle of least privilege should be applied to how traffic can flow between pods in an Azure Kubernetes Service (AKS) cluster. Let's say you likely want to block traffic directly to back-end applications. The *Network Policy* feature in Kubernetes lets you define rules for ingress and egress traffic between pods in a cluster.

This article shows you how to install the network policy engine and create Kubernetes network policies to control the flow of traffic between pods in AKS. Network policy could be used for Linux-based or Windows-based nodes and pods in AKS.

### Before you begin

You need the Azure CLI version 2.0.61 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

### Overview of network policy

All pods in an AKS cluster can send and receive traffic without limitations, by default. To improve security, you can define rules that control the flow of traffic. Back-end applications are often only exposed to required front-end services, for example. Or, database components are only accessible to the application tiers that connect to them.

Network Policy is a Kubernetes specification that defines access policies for communication between Pods. Using Network Policies, you define an ordered set of rules to send and receive traffic and apply them to a collection of pods that match one or more label selectors.

These network policy rules are defined as YAML manifests. Network policies can be included as part of a wider manifest that also creates a deployment or service.

### Network policy options in AKS

Azure provides two ways to implement network policy. You choose a network policy option when you create an AKS cluster. The policy option can't be changed after the cluster is created:

* Azure's own implementation, called *Azure Network Policies*.
* *Calico Network Policies*, an open-source network and network security solution founded by [Tigera][tigera].

Azure NPM for Linux uses Linux *IPTables* and Azure NPM for windows uses HNS *ACLPolicies* to enforce the specified policies . Policies are translated into sets of allowed and disallowed IP pairs. These pairs are then programmed as IPTable/HNS ACLPolicy filter rules.

### Differences between Azure and Calico policies and their capabilities

| Capability                               | Azure                      | Calico                      |
|------------------------------------------|----------------------------|-----------------------------|
| Supported platforms                      | Linux, Windows Server 2019 and 2022                      | Linux, Windows Server 2022  |
| Supported networking options             | Azure CNI                  | Azure CNI (Linux, Windows Server 2019 and 2022) and kubenet (Linux)  |
| Compliance with Kubernetes specification | All policy types supported |  All policy types supported |
| Additional features                      | None                       | Extended policy model consisting of Global Network Policy, Global Network Set, and Host Endpoint. For more information on using the `calicoctl` CLI to manage these extended features, see [calicoctl user reference][calicoctl]. |
| Support                                  | Supported by Azure support and Engineering team | Calico community support. For more information on additional paid support, see [Project Calico support options][calico-support]. |
| Logging                                  | Logs available with **kubectl log -n kube-system <npm-pod>** command | For more information, see [Calico component logs][calico-logs] |

### Limitations:

* NPM does not support IPv6. Otherwise, NPM fully supports the Network Policy spec in Linux.
* In Windows, NPM cannot support the following due to HNS limitations:
    * named ports
    * SCTP protocol
    * negative match label or namespace selectors (e.g. all labels except "debug=true")
    * "except" CIDR blocks (a CIDR with exceptions)

>[!NOTE]
> NPM pod logs will record an error if an unsupported policy is created.

### Create an AKS cluster and enable network policy

To see network policies in action, let's create an AKS cluster that supports network policy and then work on adding policies. 

> [!IMPORTANT]
>
> The network policy feature can only be enabled when the cluster is created. You can't enable network policy on an existing AKS cluster.

To use Azure Network Policy, you must use the [Azure CNI plug-in][azure-cni]. Calico Network Policy could be used with either this same Azure CNI plug-in or with the Kubenet CNI plug-in.

The following example script:

* Creates an AKS cluster with system-assigned identity and enables network policy.
    * The _Azure Network_ policy option is used. To use Calico as the network policy option instead, use the `--network-policy calico` parameter. Note: Calico could be used with either `--network-plugin azure` or `--network-plugin kubenet`.

Instead of using a system-assigned identity, you can also use a user-assigned identity. For more information, see [Use managed identities](use-managed-identity.md).

#### Create an AKS cluster for Azure network policies

In ths section, we will work on creating a cluster with Azure network Polices set.
You should replace the `resource-group-name`, `cluster-name`, `windows-user-name`, `windows-password` and `k8s-Version` variables found in the cluster creation command with your own values.

To set network policy for Windows Server 2022 node pools, please execute the following commands prior to creating a cluster:

```azurecli
 az extension add --name aks-preview
 az extension update --name aks-preview
 az feature register --namespace Microsoft.ContainerService --name AKSWindows2022Preview
 az feature register --namespace Microsoft.ContainerService --name WindowsNetworkPolicyPreview
 az provider register -n Microsoft.ContainerService
```
> [!IMPORTANT]
> At this time, Azure network policies with Windows nodes is available on Windows Server 2022 only
>

Create the AKS cluster and specify *azure* for the network plugin and network policy.

Use the following command for cluster running with **only Linux** node pools:
```azurecli
az aks create \
    --resource-group <resource-group-name> \
    --name <cluster-name> \
    --node-count 1 \
    --network-plugin azure \
    --network-policy azure
```
Use the following command for cluster running with **Windows Server 2022** node pools:
```azurecli
az aks create \
    --resource-group <resource-group-name> \
    --name <cluster-name> \
    --generate-ssh-keys \
    --windows-admin-username <windows-user-name> \
    --windows-admin-password <windows-password> \
    --kubernetes-version <k8s-Version> \
    --network-plugin azure \
    --vm-set-type VirtualMachineScaleSets \
    --node-count 1
```

It takes a few minutes to create the cluster. When the cluster is ready, configure `kubectl` to connect to your Kubernetes cluster by using the [az aks get-credentials][az-aks-get-credentials] command. This command downloads credentials and configures the Kubernetes CLI to use them:

```azurecli-interactive
az aks get-credentials --resource-group $RESOURCE_GROUP_NAME --name $CLUSTER_NAME
```

#### Create an AKS cluster for Calico network policies

Create the AKS cluster and specify *azure* for the network plugin, and *calico* for the network policy. Using *calico* as the network policy enables Calico networking on both Linux and Windows node pools.

If you plan on adding Windows node pools to your cluster, include the `windows-admin-username` and `windows-admin-password` parameters with that meet the [Windows Server password requirements][windows-server-password]. 

> [!IMPORTANT]
> At this time, using Calico network policies with Windows nodes is available on new clusters using Kubernetes version 1.20 or later with Calico 3.17.2 and requires using Azure CNI networking. Windows nodes on AKS clusters with Calico enabled also have [Direct Server Return (DSR)][dsr] enabled by default.
>
> For clusters with only Linux node pools running Kubernetes 1.20 with earlier versions of Calico, the Calico version will automatically be upgraded to 3.17.2.

Create a username to use as administrator credentials for your Windows Server containers on your cluster. The following commands prompt you for a username and set it `windows-user-Name` for use in a later command (remember that the commands in this article are entered into a BASH shell).

```azurecli-interactive
echo "Please enter the username to use as administrator credentials for Windows Server containers on your cluster: " && read `windows-user-name`
```

```azurecli
az aks create \
    --resource-group <resource-group-name> \
    --name <cluster-name> \
    --node-count 1 \
    --windows-admin-username <windows-user-name> \
    --network-plugin azure \
    --network-policy calico
```

It takes a few minutes to create the cluster. By default, your cluster is created with only a Linux node pool. If you would like to use Windows node pools, you can add one. For example:

```azurecli
az aks nodepool add \
    --resource-group <resource-group-name> \
    --cluster-name <cluster-name> \
    --os-type Windows \
    --name npwin \
    --node-count 1
```

When the cluster is ready, configure `kubectl` to connect to your Kubernetes cluster by using the [az aks get-credentials][az-aks-get-credentials] command. This command downloads credentials and configures the Kubernetes CLI to use them:

```azurecli-interactive
az aks get-credentials --resource-group $RESOURCE_GROUP_NAME --name $CLUSTER_NAME
```
### Verify Network Policy Setup

Now that we have created a cluster, lets create a sample  application and set traffic rules.

First, lest create a namespace called *demo* to run the example pods:

```console
kubectl create namespace demo
```

We will now create two pods in the cluster named *client* and *server*.

>[!NOTE]
> If you want to schedule the *client* or *server* on a particular node, add the following bit before the *--comand* argument in the pod creation [kubectl run][kubectl-run] command:
> ```console
>--overrides='{"spec": { "nodeSelector": {"kubernetes.io/os": "linux"}}}'

Create a *server* pod. This pod will serve on TCP port 80:

```console
kubectl run server -n demo --image=k8s.gcr.io/e2e-test-images/agnhost:2.33 --labels="app=server" --port=80 --command -- /agnhost serve-hostname --tcp --http=false --port "80"
```

Create a *client* pod:

```console
kubectl run -it client -n demo --image=k8s.gcr.io/e2e-test-images/agnhost:2.33 --command -- bash
```

Now, in a separate window, run the following command to get the server IP:
```console
kubectl get pod --output=wide
```

#### Test Connectivity without Network Policy

In the client's shell, verify connectivity with the server by executing the following command. Replace *server-ip* by IP found in the output from executing  previous command. There will be no output if the connection is successful:

```console
/agnhost connect <server-ip>:80 --timeout=3s --protocol=tcp
```

#### Test Connectivity with Network Policy

Create a file named demo-pods-policy.yaml and paste the following YAML manifest to add network policies:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  creationTimestamp: null
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
Specify the name of your YAML manifest and apply it using [kubectl apply][kubectl-apply]:
```console
kubectl apply –f demo-pods.yaml
```

Now, in the client's shell, verify connectivity with the server by executing the following command:

```console
/agnhost connect <server-ip>:80 --timeout=3s --protocol=tcp
```
Connectivity will be blocked since the server is labeled with app=server, but the client is not labeled. The connect command above will yield this output: 

```output
TIMEOUT
```

Run the following command to label the *client* and repeat the process of testing the connectivity :
```console
kubectl label pod client -n demo app=client
```

## Clean up resources

In this article, we created a namespace, two pods and applied a network policy. To clean up these resources, use the [kubectl delete][kubectl-delete] command and specify the resource names:

```console
kubectl delete namespace demo
```

## Next steps

For more about network resources, see [Network concepts for applications in Azure Kubernetes Service (AKS)][concepts-network].

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
[calicoctl]: https://docs.projectcalico.org/reference/calicoctl/
[calico-support]: https://www.tigera.io/tigera-products/calico/
[calico-logs]: https://docs.projectcalico.org/maintenance/troubleshoot/component-logs
[calico-aks-cleanup]: https://github.com/Azure/aks-engine/blob/master/docs/topics/calico-3.3.1-cleanup-after-upgrade.yaml

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[use-advanced-networking]: configure-azure-cni.md
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[concepts-network]: concepts-network.md
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[windows-server-password]: /windows/security/threat-protection/security-policy-settings/password-must-meet-complexity-requirements#reference
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[dsr]: ../load-balancer/load-balancer-multivip-overview.md#rule-type-2-backend-port-reuse-by-using-floating-ip
