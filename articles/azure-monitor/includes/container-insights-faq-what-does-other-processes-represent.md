---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 10/31/2023
---

### What does "Other processes" represent under the Node view?

*Other processes* are intended to help you clearly understand the root cause of the high resource usage on your node. This information helps you to distinguish usage between containerized processes versus noncontainerized processes.
          
What are these other processes?
          
They're noncontainerized processes that run on your node.
          
How do we calculate this?
          
**Other processes** = *Total usage from CAdvisor* - *Usage from containerized process*
          
The other processes include:
          
- Self-managed or managed Kubernetes noncontainerized processes.
- Container run-time processes.
- Kubelet.
- System processes running on your node.
- Other non-Kubernetes workloads running on node hardware or a VM.
        