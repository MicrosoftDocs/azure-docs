---
title: Certificate Rotation in Azure Kubernetes Service (AKS)
description: Learn certificate rotation in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 09/12/2022
---

# Certificate rotation in Azure Kubernetes Service (AKS)

Azure Kubernetes Service (AKS) uses certificates for authentication with many of its components. If you have a RBAC-enabled cluster built after March 2022, it's enabled with certificate auto-rotation. Periodically, you may need to rotate those certificates for security or policy reasons. For example, you may have a policy to rotate all your certificates every 90 days.

> [!NOTE]
> Certificate auto-rotation will *only* be enabled by default for RBAC enabled AKS clusters.

This article shows you how certificate rotation works in your AKS cluster.

## Before you begin

This article requires that you are running the Azure CLI version 2.0.77 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## AKS certificates, Certificate Authorities, and Service Accounts

AKS generates and uses the following certificates, Certificate Authorities, and Service Accounts:

* The AKS API server creates a Certificate Authority (CA) called the Cluster CA.
* The API server has a Cluster CA, which signs certificates for one-way communication from the API server to kubelets.
* Each kubelet also creates a Certificate Signing Request (CSR), which is signed by the Cluster CA, for communication from the kubelet to the API server.
* The API aggregator uses the Cluster CA to issue certificates for communication with other APIs. The API aggregator can also have its own CA for issuing those certificates, but it currently uses the Cluster CA.
* Each node uses a Service Account (SA) token, which is signed by the Cluster CA.
* The `kubectl` client has a certificate for communicating with the AKS cluster.

Certificates mentioned above are maintained by Microsoft, except the cluster certificate, which you have to maintain.

> [!NOTE]
> AKS clusters created prior to May 2019 have certificates that expire after two years. Any cluster created after May 2019 or any cluster that has its certificates rotated have Cluster CA certificates that expire after 30 years. All other AKS certificates, which use the Cluster CA for signing, will expire after two years and are automatically rotated during an AKS version upgrade which happened after 8/1/2021. To verify when your cluster was created, use `kubectl get nodes` to see the *Age* of your node pools.
>
> Additionally, you can check the expiration date of your cluster's certificate. For example, the following bash command displays the client certificate details for the *myAKSCluster* cluster in resource group *rg*:
> ```console
> kubectl config view --raw -o jsonpath="{.users[?(@.name == 'clusterUser_rg_myAKSCluster')].user.client-certificate-data}" | base64 -d | openssl x509 -text | grep -A2 Validity
> ```

To check expiration date of apiserver certificate, run the following command:

```console
curl https://{apiserver-fqdn} -k -v 2>&1 |grep expire
```

To check the expiration date of certificate on VMAS agent node, run the following command:

```azurecli
az vm run-command invoke -g MC_rg_myAKSCluster_region -n vm-name --command-id RunShellScript --query 'value[0].message' -otsv --scripts "openssl x509 -in /etc/kubernetes/certs/apiserver.crt -noout -enddate"
```

To check expiration date of certificate on one virtual machine scale set agent node, run the following command:

```azurecli
az vmss run-command invoke -g MC_rg_myAKSCluster_region -n vmss-name --instance-id 0 --command-id RunShellScript --query 'value[0].message' -otsv --scripts "openssl x509 -in /etc/kubernetes/certs/apiserver.crt -noout -enddate"
```

## Certificate Auto Rotation

For AKS to automatically rotate non-CA certificates, the cluster must have [TLS Bootstrapping](https://kubernetes.io/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/) which has been enabled by default in all Azure regions.

> [!NOTE]
> If you have an existing cluster you have to upgrade that cluster to enable Certificate Auto-Rotation.
> Do not disable bootstrap to keep your auto-rotation enabled.

> [!NOTE]
> If the cluster is in a stopped state during the auto certificate rotation only the control plane certificates are rotated.  In this case the nodepool should be recreated, after certificate rotation, in order to initiate the nodepool certificate rotation.

For any AKS clusters created or upgraded after March 2022 Azure Kubernetes Service will automatically rotate non-CA certificates on both the control plane and agent nodes within 80% of the client certificate valid time, before they expire with no downtime for the cluster.

### How to check whether current agent node pool is TLS Bootstrapping enabled?

To verify if TLS Bootstrapping is enabled on your cluster browse to the following paths:

* On a Linux node: */var/lib/kubelet/bootstrap-kubeconfig*
* On a Windows node: *C:\k\bootstrap-config*

To access agent nodes, see [Connect to Azure Kubernetes Service cluster nodes for maintenance or troubleshooting][aks-node-access] for more information.

> [!NOTE]
> The file path may change as Kubernetes version evolves in the future.

Once a region is configured, create a new cluster or upgrade an existing cluster with `az aks upgrade` to set that cluster for auto-certificate rotation. A control plane and node pool upgrade is needed to enable this feature.

```azurecli
az aks upgrade -g $RESOURCE_GROUP_NAME -n $CLUSTER_NAME
```

### Limitation

Certificate auto-rotation will only be enabled by default for RBAC enabled AKS clusters.

## Manually rotate your cluster certificates

> [!WARNING]
> Rotating your certificates using `az aks rotate-certs` will recreate all of your nodes, VM scale set and their Disks and can cause up to 30 minutes of downtime for your AKS cluster.

Use [az aks get-credentials][az-aks-get-credentials] to sign in to your AKS cluster. This command also downloads and configures the `kubectl` client certificate on your local machine.

```azurecli
az aks get-credentials -g $RESOURCE_GROUP_NAME -n $CLUSTER_NAME
```

Use `az aks rotate-certs` to rotate all certificates, CAs, and SAs on your cluster.

```azurecli
az aks rotate-certs -g $RESOURCE_GROUP_NAME -n $CLUSTER_NAME
```

> [!IMPORTANT]
> It may take up to 30 minutes for `az aks rotate-certs` to complete. If the command fails before completing, use `az aks show` to verify the status of the cluster is *Certificate Rotating*. If the cluster is in a failed state, rerun `az aks rotate-certs` to rotate your certificates again.

Verify that the old certificates aren't valid by running any `kubectl` command. If you haven't updated the certificates used by `kubectl`, you'll see an error similar to the following example:

```console
kubectl get nodes
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "ca")
```

To update the certificate used by `kubectl`, run the [az aks get-credentials][az-aks-get-credentials] command:

```azurecli
az aks get-credentials -g $RESOURCE_GROUP_NAME -n $CLUSTER_NAME --overwrite-existing
```

To verify the certificates have been updated, run the following [kubectl get][kubectl-get] command:

```console
kubectl get nodes
```

> [!NOTE]
> If you have any services that run on top of AKS, you might need to update their certificates.

## Next steps

This article showed you how to automatically rotate your cluster's certificates, CAs, and SAs. You can see [Best practices for cluster security and upgrades in Azure Kubernetes Service (AKS)][aks-best-practices-security-upgrades] for more information on AKS security best practices.

[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[aks-best-practices-security-upgrades]: operator-best-practices-cluster-security.md
[aks-node-access]: ./node-access.md
