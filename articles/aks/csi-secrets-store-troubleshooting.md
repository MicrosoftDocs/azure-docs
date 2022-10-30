---
title: Troubleshoot Azure Key Vault Provider for Secrets Store CSI Driver on Azure Kubernetes Service (AKS)
description: Learn how to troubleshoot and resolve common problems when you're using the Azure Key Vault Provider for Secrets Store CSI Driver with Azure Kubernetes Service (AKS).
author: nickomang
ms.service: container-service
ms.topic: troubleshooting
ms.date: 10/18/2021
ms.author: nickoman
---

# Troubleshoot Azure Key Vault Provider for Secrets Store CSI Driver

This article lists common issues with using Azure Key Vault Provider for Secrets Store CSI Driver on Azure Kubernetes Service (AKS) and provides troubleshooting tips for resolving them.

## Logging

Azure Key Vault Provider logs are available in the provider pods. To troubleshoot issues with the provider, you can look at logs from the provider pod that's running on the same node as your application pod. Run the following commands:

```bash
# find the secrets-store-provider-azure pod running on the same node as your application pod
kubectl get pods -l app=secrets-store-provider-azure -n kube-system -o wide
kubectl logs -l app=secrets-store-provider-azure -n kube-system --since=1h | grep ^E
```

You can also access Secrets Store CSI Driver logs by running the following commands:

```bash
# find the secrets-store-csi-driver pod running on the same node as your application pod
kubectl get pods -l app=secrets-store-csi-driver -n kube-system -o wide
kubectl logs -l app=secrets-store-csi-driver -n kube-system --since=1h | grep ^E
```

## Common issues

### Failed to get key vault token: nmi response failed with status code: 404

Error message in logs/events:

```bash
Warning  FailedMount  74s    kubelet            MountVolume.SetUp failed for volume "secrets-store-inline" : kubernetes.io/csi: mounter.SetupAt failed: rpc error: code = Unknown desc = failed to mount secrets store objects for pod default/test, err: rpc error: code = Unknown desc = failed to mount objects, error: failed to get keyvault client: failed to get key vault token: nmi response failed with status code: 404, err: <nil>
```

Description: The Node Managed Identity (NMI) component in *aad-pod-identity* returned an error for a token request. For more information about the error and to resolve it, check the NMI pod logs and refer to the [Azure AD pod-managed identity troubleshooting guide][aad-troubleshooting].

> [!NOTE]
> Azure Active Directory (Azure AD) is abbreviated as *aad* in the *aad-pod-identity* string.

### keyvault.BaseClient#GetSecret: Failure sending request: StatusCode=0 – Original Error: context canceled

Error message in logs/events:

```bash
E1029 17:37:42.461313       1 server.go:54] failed to process mount request, error: keyvault.BaseClient#GetSecret: Failure sending request: StatusCode=0 -- Original Error: context deadline exceeded
```

Description: The provider pod is unable to access the key vault instance for either of the following reasons:
- A firewall rule is blocking egress traffic from the provider.
- Network policies that are configured in the AKS cluster are blocking egress traffic.
- The provider pods run on hostNetwork. A failure could occur if a policy is blocking this traffic or there are network jitters on the node. Check for policies that are configured to block traffic, and place the provider pods on the allowlist. Also, ensure that there is connectivity to Azure AD and your key vault from the node.

You can test the connectivity to your Azure key vault from the pod that's running on the host network by doing the following:

1. Create the pod:

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

1. *Exec into* the pod you've just created:

    ```bash
    kubectl exec -it curl -- sh
    ```

1. Authenticate with your Azure key vault:

    ```bash
    curl -X POST 'https://login.microsoftonline.com/<AAD_TENANT_ID>/oauth2/v2.0/token' -d 'grant_type=client_credentials&client_id=<AZURE_CLIENT_ID>&client_secret=<AZURE_CLIENT_SECRET>&scope=https://vault.azure.net/.default'
    ```

1. Try getting a secret that's already created in your Azure key vault:

    ```bash
    curl -X GET 'https://<KEY_VAULT_NAME>.vault.azure.net/secrets/<SECRET_NAME>?api-version=7.2' -H "Authorization: Bearer <ACCESS_TOKEN_ACQUIRED_ABOVE>"
    ```

<!-- LINKS EXTERNAL -->
[aad-troubleshooting]: https://azure.github.io/aad-pod-identity/docs/troubleshooting/
