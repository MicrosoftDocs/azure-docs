---
title: Certificate Rotation in Azure Kubernetes Service (AKS)
description: Learn certificate rotation in an Azure Kubernetes Service (AKS) cluster.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 01/19/2023
---

# Certificate rotation in Azure Kubernetes Service (AKS)

Azure Kubernetes Service (AKS) uses certificates for authentication with many of its components. RBAC-enabled clusters created after March 2022 are enabled with certificate auto-rotation. You may need to periodically rotate those certificates for security or policy reasons. For example, you may have a policy to rotate all your certificates every 90 days.

> [!NOTE]
> Certificate auto-rotation is *only* enabled by default for RBAC enabled AKS clusters.

This article shows you how certificate rotation works in your AKS cluster.

## Before you begin

This article requires the Azure CLI version 2.0.77 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## AKS certificates, Certificate Authorities, and Service Accounts

AKS generates and uses the following certificates, Certificate Authorities (CA), and Service Accounts (SA):

* The AKS API server creates a CA called the Cluster CA.
* The API server has a Cluster CA, which signs certificates for one-way communication from the API server to kubelets.
* Each kubelet creates a Certificate Signing Request (CSR), which the Cluster CA signs, for communication from the kubelet to the API server.
* The API aggregator uses the Cluster CA to issue certificates for communication with other APIs. The API aggregator can also have its own CA for issuing those certificates, but it currently uses the Cluster CA.
* Each node uses an SA token, which the Cluster CA signs.
* The `kubectl` client has a certificate for communicating with the AKS cluster.

Microsoft maintains all certificates mentioned in this section, except for the cluster certificate.

> [!NOTE]
>
> * **AKS clusters created *before* May 2019** have certificates that expire after two years.
> * **AKS clusters created *after* May 2019** have Cluster CA certificates that expire after 30 years.
>
> You can verify when your cluster was created using the `kubectl get nodes` command, which shows you the *Age* of your node pools.

## Check certificate expiration dates

### Check cluster certificate expiration date

* Check the expiration date of the cluster certificate using the `kubectl config view` command.

    ```console
   kubectl config view --raw -o jsonpath="{.clusters[?(@.name == '')].cluster.certificate-authority-data}" | base64 -d | openssl x509 -text | grep -A2 Validity
    ```

### Check API server certificate expiration date

* Check the expiration date of the API server certificate using the following `curl` command.

    ```console
    curl https://{apiserver-fqdn} -k -v 2>&1 |grep expire
    ```

### Check VMAS agent node certificate expiration date

* Check the expiration date of the VMAS agent node certificate using the `az vm run-command invoke` command.

    ```azurecli-interactive
    az vm run-command invoke -g MC_rg_myAKSCluster_region -n vm-name --command-id RunShellScript --query 'value[0].message' -otsv --scripts "openssl x509 -in /etc/kubernetes/certs/apiserver.crt -noout -enddate"
    ```

### Check Virtual Machine Scale Set agent node certificate expiration date

* Check the expiration date of the Virtual Machine Scale Set agent node certificate using the `az vm run-command invoke` command.

    ```azurecli-interactive
    az vmss run-command invoke --resource-group "MC_rg_myAKSCluster_region" --name "vmss-name" --command-id RunShellScript --instance-id 1 --scripts "openssl x509 -in /etc/kubernetes/certs/apiserver.crt -noout -enddate" --query "value[0].message"
    ```

## Certificate Auto Rotation

For AKS to automatically rotate non-CA certificates, the cluster must have [TLS Bootstrapping](https://kubernetes.io/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/), which is enabled by default in all Azure regions.

> [!NOTE]
>
> * If you have an existing cluster, you have to upgrade that cluster to enable Certificate Auto Rotation.
> * Don't disable Bootstrap to keep auto rotation enabled.
> * If the cluster is in a stopped state during the auto certificate rotation, only the control plane certificates are rotated. In this case, you should recreate the node pool after certificate rotation to initiate the node pool certificate rotation.

For any AKS clusters created or upgraded after March 2022, Azure Kubernetes Service automatically rotates non-CA certificates on both the control plane and agent nodes within 80% of the client certificate valid time before they expire with no downtime for the cluster.

### How to check whether current agent node pool is TLS Bootstrapping enabled?

1. Verify if your cluster has TLS Bootstrapping enabled by browsing to one to the following paths:

   * On a Linux node: */var/lib/kubelet/bootstrap-kubeconfig* or */host/var/lib/kubelet/bootstrap-kubeconfig*
   * On a Windows node: *C:\k\bootstrap-config*

    For more information, see [Connect to Azure Kubernetes Service cluster nodes for maintenance or troubleshooting][aks-node-access].

    > [!NOTE]
    > The file path may change as Kubernetes versions evolve.

2. Once a region is configured, create a new cluster or upgrade an existing cluster to set auto rotation for the cluster certificate. You need to upgrade the control plane and node pool to enable this feature.

## Manually rotate your cluster certificates

> [!WARNING]
> Rotating your certificates using `az aks rotate-certs` recreates all of your nodes, Virtual Machine Scale Sets and Disks and can cause up to *30 minutes of downtime* for your AKS cluster.

1. Connect to your cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials -g $RESOURCE_GROUP_NAME -n $CLUSTER_NAME
    ```

2. Rotate all certificates, CAs, and SAs on your cluster using the [`az aks rotate-certs`][az-aks-rotate-certs] command.

    ```azurecli-interactive
    az aks rotate-certs -g $RESOURCE_GROUP_NAME -n $CLUSTER_NAME
    ```

    > [!IMPORTANT]
    > It may take up to 30 minutes for `az aks rotate-certs` to complete. If the command fails before completing, use `az aks show` to verify the status of the cluster is *Certificate Rotating*. If the cluster is in a failed state, rerun `az aks rotate-certs` to rotate your certificates again.

3. Verify the old certificates are no longer valid using any `kubectl` command, such as `kubectl get nodes`.

    ```azurecli-interactive
    kubectl get nodes
    ```

    If you haven't updated the certificates used by `kubectl`, you see an error similar to the following example output:

    ```output
    Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "ca")
    ```

4. Update the certificate used by `kubectl` using the [`az aks get-credentials`][az-aks-get-credentials] command with the `--overwrite-existing` flag.

    ```azurecli-interactive
    az aks get-credentials -g $RESOURCE_GROUP_NAME -n $CLUSTER_NAME --overwrite-existing
    ```

5. Verify the certificates have been updated using the [`kubectl get`][kubectl-get] command.

    ```azurecli-interactive
    kubectl get nodes
    ```

    > [!NOTE]
    > If you have any services that run on top of AKS, you might need to update their certificates.

## Next steps

This article showed you how to automatically rotate your cluster certificates, CAs, and SAs. For more information, see [Best practices for cluster security and upgrades in Azure Kubernetes Service (AKS)][aks-best-practices-security-upgrades].

<!-- LINKS - internal -->
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[aks-best-practices-security-upgrades]: operator-best-practices-cluster-security.md
[aks-node-access]: ./node-access.md
[az-aks-rotate-certs]: /cli/azure/aks#az_aks_rotate_certs

<!-- LINKS - external -->
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
