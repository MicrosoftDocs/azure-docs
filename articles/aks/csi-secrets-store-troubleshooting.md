---
title: Troubleshoot Secrets Store CSI driver on Azure Kubernetes Service (AKS)
description: Learn how to troubleshoot and resolve common problems when using the Secrets Store CSI driver with Azure Kubernetes Service (AKS).
author: nickomang

ms.service: container-service
ms.topic: troubleshooting
ms.date: 10/18/2021
ms.author: nickoman
---

# Troubleshooting Secrets Store CSI Driver

This article provides an overview of components that can aid in troubleshooting and a list of common issues and their resolutions.

## Logging

Azure Key Vault (AKV) provider logs are available in the provider pods. To troubleshoot issues with the provider, you can look at logs from the provider pod running on the same node as your application pod:

```bash
# find the csi-secrets-store-provider-azure pod running on the same node as your application pod
kubectl get pods -l app=csi-secrets-store-provider-azure -o wide
kubectl logs <provider pod name> --since=1h | grep ^E
```

Secrets Store CSI driver logs are also accessible:

```bash
# find the secrets store csi driver pod running on the same node as your application pod
kubectl get pods -l app=secrets-store-csi-driver -o wide
kubectl logs <driver pod name> secrets-store --since=1h | grep ^E
```

## Common issues

### Driver name `secrets-store.csi.k8s.io` not found in the list of registered CSI drivers

If you received the following error message in the pod events:

```bash
Warning FailedMount 42s (x12 over 8m56s) kubelet, akswin000000 MountVolume.SetUp failed for volume "secrets-store01-inline" : kubernetes.io/csi: mounter.SetUpAt failed to get CSI client: driver name secrets-store.csi.k8s.io not found in the list of registered CSI drivers
```

It means the Secrets Store CSI Driver pods aren’t running on the node where application is running.

- If you’ve already deployed the Secrets Store CSI Driver, then check if the node is tainted. If node is tainted, then redeploy the Secrets Store CSI Driver and Azure Key Vault provider by adding toleration for the taints.

### Failed to get key vault token: nmi response failed with status code: 404 

If you received the following error message in the logs/events:

```bash
Warning  FailedMount  74s    kubelet            MountVolume.SetUp failed for volume "secrets-store-inline" : kubernetes.io/csi: mounter.SetupAt failed: rpc error: code = Unknown desc = failed to mount secrets store objects for pod default/test, err: rpc error: code = Unknown desc = failed to mount objects, error: failed to get keyvault client: failed to get key vault token: nmi response failed with status code: 404, err: <nil>
```

It means the NMI component in aad-pod-identity returned an error for token request. To get more details on the error, check the MIC pod logs and refer to the AAD Pod Identity [troubleshooting guide][aad-troubleshooting] to resolve the issue.

### Failed to find provider binary azure, err: stat /etc/kubernetes/secrets-store-csi-providers/azure/provider-azure: no such file or directory 

If you received the following error message in the logs/events:

```bash
Warning FailedMount 85s (x10 over 5m35s) kubelet, aks-default-28951543-vmss000000 MountVolume.SetUp failed for volume "secrets-store01-inline" : kubernetes.io/csi: mounter.SetupAt failed: rpc error: code = Unknown desc = failed to mount secrets store objects for pod default/nginx-secrets-store-inline-user-msi, err: failed to find provider binary azure, err: stat /etc/kubernetes/secrets-store-csi-providers/azure/provider-azure: no such file or directory
```

It means the driver is unable to communicate with the provider.

- If you’re installing provider version < 0.0.9, check if the provider pods are running on all nodes.
- If you’re installing provider version >= 0.0.9, follow the Installation steps to configure the driver to use grpc for communication with the provider.

### keyvault.BaseClient#GetSecret: Failure sending request: StatusCode=0 – Original Error: context canceled” 

If you received the following error message in the logs/events:

```bash
E1029 17:37:42.461313       1 server.go:54] failed to process mount request, error: keyvault.BaseClient#GetSecret: Failure sending request: StatusCode=0 -- Original Error: context deadline exceeded
```

It means the provider pod is unable to access the AKV instance because
- There is a firewall rule blocking egress traffic from the provider.
- Network policies configured in the cluster that’s blocking egress traffic.
- The provider pods run on hostNetwork. So if there is a policy blocking this traffic or there are network jitters on the node it could result in the above failure. Check for policies configured to block traffic and allowlist the provider pods. Also, ensure there is connectivity to AAD and Keyvault from the node.

You can test Azure Key Vault connectivity from pod running on host network as follows:
- Create Pod

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: curl
spec:
  hostNetwork: true
  containers:
  - args:
    - tail
    - -f
    - /dev/null
    image: curlimages/curl:7.75.0
    name: curl
  dnsPolicy: ClusterFirst
  restartPolicy: Always
EOF
```

- Exec into the Pod created above

```bash
kubectl exec -it curl -- sh
```

- Authenticate with AKV

```bash
curl -X POST 'https://login.microsoftonline.com/<AAD_TENANT_ID>/oauth2/v2.0/token' -d 'grant_type=client_credentials&client_id=<AZURE_CLIENT_ID>&client_secret=<AZURE_CLIENT_SECRET>&scope=https://vault.azure.net/.default'
```

- Try getting a secret already created in AKV

```bash
curl -X GET 'https://<KEY_VAULT_NAME>.vault.azure.net/secrets/<SECRET_NAME>?api-version=7.2' -H "Authorization: Bearer <ACCESS_TOKEN_ACQUIRED_ABOVE>"
```

### Failed to create Kubernetes secret” err=“secrets is forbidden: User "system:serviceaccount:default:secrets-store-csi-driver" cannot create resource "secrets" in API group "" in the namespace "default"

If you received the following error message in the logs/events:

```bash
E0610 22:27:02.283100       1 secretproviderclasspodstatus_controller.go:325] "failed to create Kubernetes secret" err="secrets is forbidden: User \"system:serviceaccount:default:secrets-store-csi-driver\" cannot create resource \"secrets\" in API group \"\" in the namespace \"default\"" spc="default/azure-linux" pod="default/busybox-linux-5f479855f7-jvfw4" secret="default/dockerconfig" spcps="default/busybox-linux-5f479855f7-jvfw4-default-azure-linux"
```

It means the RBAC clusterrole and clusterrolebinding required for the CSI driver required to sync the mounted content as Kubernetes secret is not installed. When installing/upgrading the driver and provider using helm charts from [this repo][csi-ss-provider], set secrets-store-csi-driver.syncSecret.enabled=true. This operation will install the required clusterrole and clusterrolebinding.

```bash
# sync as Kubernetes secret clusterrole
kubectl get clusterrole/secretprovidersyncing-role
# sync as Kubernetes secret clusterrolebinding
kubectl get clusterrolebinding/secretprovidersyncing-rolebinding
```

<!-- LINKS EXTERNAL -->
[aad-troubleshooting]: https://azure.github.io/aad-pod-identity/docs/troubleshooting/
[csi-ss-provider]: https://github.com/Azure/secrets-store-csi-driver-provider-azure/tree/master/charts/csi-secrets-store-provider-azure