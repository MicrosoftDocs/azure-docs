---
ms.service: defender-for-cloud
ms.topic: include
ms.date: 07/19/2022
---

## Network requirements - Arc

Validate the following endpoints are configured for outbound access so that the Defender extension can connect to Microsoft Defender for Cloud to send security data and events:

### For Azure public cloud deployments:

| Domain                     | Port |
| -------------------------- | ---- |
| *.ods.opinsights.azure.com | 443  |
| *.oms.opinsights.azure.com | 443  |
| login.microsoftonline.com  | 443  |
| Amazon Linux 2 (Eks): Domain: "amazonlinux.*.amazonaws.com/2/extras/*" | 443 |
| yum default repositories of RHEL / Centos  | - |
| apt default repositories Debian | - |

You'll also need to validate the [Azure Arc-enabled Kubernetes network requirements](../../azure-arc/kubernetes/quickstart-connect-cluster.md#meet-network-requirements).

### Proxy environments

Clusters behind the following proxy environments are supported:

- No authentication proxy
- Username & password based proxy

### Data collection

The **Defender extension** collects signals from hosts using [eBPF technology](https://ebpf.io/), and provides runtime protection. It's only supported on the following distributions:

- Ubuntu 16.04 
- Ubuntu 18.04 
- Ubuntu 20.04 
- Ubuntu 22.04 
- Amazon Linux 2 (EKS) 
- CentOS 8 
- Debian 10 
- Debian 11 
- GCOOS (GKE) 
- Red Hat Enterprise Linux 8
