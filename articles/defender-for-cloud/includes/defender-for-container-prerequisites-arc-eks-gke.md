---
ms.service: defender-for-cloud
ms.custom: ignite-2022
ms.topic: include
ms.date: 07/27/2022
ms.author: benmansheim
author: bmansheim
---

## Network requirements

Validate the following endpoints are configured for outbound access so that the Defender extension can connect to Microsoft Defender for Cloud to send security data and events:

For Azure public cloud deployments:

| Domain                     | Port |
| -------------------------- | ---- |
| *.ods.opinsights.azure.com | 443  |
| *.oms.opinsights.azure.com | 443  |
| login.microsoftonline.com  | 443  |

The following domains are only necessary if you're using a relevant OS. For example, if you have EKS clusters running in AWS, then you would only need to apply the `Amazon Linux 2 (Eks): Domain: "amazonlinux.*.amazonaws.com/2/extras/*"` domain.

| Domain                     | Port | Host operating systems |
| -------------------------- | ---- | -- |
| amazonlinux.*.amazonaws.com/2/extras/\* | 443 | Amazon Linux 2 |
| yum default repositories | - | RHEL / Centos |
| apt default repositories | - | Debian |

You'll also need to validate the [Azure Arc-enabled Kubernetes network requirements](../../azure-arc/kubernetes/quickstart-connect-cluster.md#meet-network-requirements).

> [!TIP]
> When using this extension with [AKS hybrid clusters provisioned from Azure](../../azure-arc/kubernetes/extensions.md#aks-hybrid-clusters-provisioned-from-azure-preview) you must set `--cluster-type` to use `provisionedClusters` and also add `--cluster-resource-provider microsoft.hybridcontainerservice` to the command. Installing Azure Arc extensions on AKS hybrid clusters provisioned from Azure is currently in preview.
