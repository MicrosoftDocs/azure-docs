---
ms.service: defender-for-cloud
ms.topic: include
ms.date: 07/27/2022
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
