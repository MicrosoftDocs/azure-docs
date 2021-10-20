---
title: Rotate certificates in Azure Kubernetes Service (AKS)
description: Learn how to rotate your certificates in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 7/13/2021
---

# Rotate certificates in Azure Kubernetes Service (AKS)

Azure Kubernetes Service (AKS) uses certificates for authentication with many of its components. Periodically, you may need to rotate those certificates for security or policy reasons. For example, you may have a policy to rotate all your certificates every 90 days.

This article shows you how to rotate the certificates in your AKS cluster.

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

> [!NOTE]
> AKS clusters created prior to May 2019 have certificates that expire after two years. Any cluster created after May 2019 or any cluster that has its certificates rotated have Cluster CA certificates that expire after 30 years. All other AKS certificates, which use the Cluster CA to for signing, will expire after two years and are automatically rotated during AKS version upgrade. To verify when your cluster was created, use `kubectl get nodes` to see the *Age* of your node pools.
> 
> Additionally, you can check the expiration date of your cluster's certificate. For example, the following bash command displays the client certificate details for the *myAKSCluster* cluster in resource group *rg*
> ```console
> kubectl config view --raw -o jsonpath="{.users[?(@.name == 'clusterUser_rg_myAKSCluster')].user.client-certificate-data}" | base64 -d | openssl x509 -text | grep -A2 Validity
> ```

* Check expiration date of apiserver certificate
```console
curl https://{apiserver-fqdn} -k -v 2>&1 |grep expire
```

* Check expiration date of certificate on VMAS agent node
```console
az vm run-command invoke -g MC_rg_myAKSCluster_region -n vm-name --command-id RunShellScript --query 'value[0].message' -otsv --scripts "openssl x509 -in /etc/kubernetes/certs/apiserver.crt -noout -enddate"
```

* Check expiration date of certificate on one VMSS agent node
```console
az vmss run-command invoke -g MC_rg_myAKSCluster_region -n vmss-name --instance-id 0 --command-id RunShellScript --query 'value[0].message' -otsv --scripts "openssl x509 -in /etc/kubernetes/certs/apiserver.crt -noout -enddate"
```

## Rotate your cluster certificates

> [!WARNING]
> Rotating your certificates using `az aks rotate-certs` will recreate all of your nodes and can cause up to 30 minutes of downtime for your AKS cluster.

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

Verify that the old certificates are no longer valid by running a `kubectl` command. Since you have not updated the certificates used by `kubectl`, you will see an error.  For example:

```console
$ kubectl get no
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "ca")
```

Update the certificate used by `kubectl` by running `az aks get-credentials`.

```azurecli
az aks get-credentials -g $RESOURCE_GROUP_NAME -n $CLUSTER_NAME --overwrite-existing
```

Verify the certificates have been updated by running a `kubectl` command, which will now succeed. For example:

```console
kubectl get no
```

> [!NOTE]
> If you have any services that run on top of AKS, you may need to update certificates related to those services as well.

## Next steps

This article showed you how to automatically rotate your cluster's certificates, CAs, and SAs. You can see [Best practices for cluster security and upgrades in Azure Kubernetes Service (AKS)][aks-best-practices-security-upgrades] for more information on AKS security best practices.


[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[aks-best-practices-security-upgrades]: operator-best-practices-cluster-security.md
