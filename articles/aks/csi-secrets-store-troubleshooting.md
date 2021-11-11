---
title: Troubleshoot Azure Key Vault Provider for Secrets Store CSI Driver on Azure Kubernetes Service (AKS)
description: Learn how to troubleshoot and resolve common problems when using the Azure Key Vault Provider for Secrets Store CSI Driver with Azure Kubernetes Service (AKS).
author: nickomang
ms.service: container-service
ms.topic: troubleshooting
ms.date: 10/18/2021
ms.author: nickoman
---

# Troubleshooting Azure Key Vault Provider for Secrets Store CSI Driver

This article provides an overview of components that can aid in troubleshooting and a list of common issues and their resolutions.

## Logging

Azure Key Vault Provider logs are available in the provider pods. To troubleshoot issues with the provider, you can look at logs from the provider pod running on the same node as your application pod:

```bash
# find the secrets-store-provider-azure pod running on the same node as your application pod
kubectl get pods -l app=secrets-store-provider-azure -n kube-system -o wide
kubectl logs -l app=secrets-store-provider-azure -n kube-system --since=1h | grep ^E
```

Secrets Store CSI Driver logs are also accessible:

```bash
# find the secrets-store-csi-driver pod running on the same node as your application pod
kubectl get pods -l app=secrets-store-csi-driver -n kube-system -o wide
kubectl logs -l app=secrets-store-csi-driver -n kube-system --since=1h | grep ^E
```

## Common issues

### Failed to get key vault token: nmi response failed with status code: 404

If you received the following error message in the logs/events:

```bash
Warning  FailedMount  74s    kubelet            MountVolume.SetUp failed for volume "secrets-store-inline" : kubernetes.io/csi: mounter.SetupAt failed: rpc error: code = Unknown desc = failed to mount secrets store objects for pod default/test, err: rpc error: code = Unknown desc = failed to mount objects, error: failed to get keyvault client: failed to get key vault token: nmi response failed with status code: 404, err: <nil>
```

It means the NMI component in aad-pod-identity returned an error for token request. To get more details on the error, check the NMI pod logs and refer to the AAD Pod Identity [troubleshooting guide][aad-troubleshooting] to resolve the issue.

### keyvault.BaseClient#GetSecret: Failure sending request: StatusCode=0 – Original Error: context canceled

If you received the following error message in the logs/events:

```bash
E1029 17:37:42.461313       1 server.go:54] failed to process mount request, error: keyvault.BaseClient#GetSecret: Failure sending request: StatusCode=0 -- Original Error: context deadline exceeded
```

It means the provider pod is unable to access the AKV instance because:

- There is a firewall rule blocking egress traffic from the provider.
- Network policies configured in the cluster that’s blocking egress traffic.
- The provider pods run on hostNetwork. So if there is a policy blocking this traffic or there are network jitters on the node it could result in the above failure. Check for policies configured to block traffic and allowlist the provider pods. Also, ensure there is connectivity to Azure AD and Key Vault from the node.

You can test Key Vault connectivity from pod running on host network as follows:

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

<!-- LINKS EXTERNAL -->
[aad-troubleshooting]: https://azure.github.io/aad-pod-identity/docs/troubleshooting/
