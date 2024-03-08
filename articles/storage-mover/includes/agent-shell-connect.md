---
author: stevenmatthew
ms.author: shaas
ms.topic: include
ms.date: 09/16/2022
ms.service: azure-storage-mover
---

<!-- 
!########################################################
STATUS: IN REVIEW

CONTENT: final

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed

!########################################################
-->
From a machine on the same subnet as the agent, run an ssh command:

```powershell
ssh <AgentIpAddress> -l admin
```

> [!IMPORTANT]
> A newly deployed Storage Mover agent has a default password: </br>**Local user:** admin </br>**Default password:** admin

You're prompted and advised to change the default password immediately after you first connect to a newly deployed agent. Note down the new password, there's no process to recover it. Losing your password locks you out from the administrative shell. Cloud management doesn't require this local admin password. If the agent was previously registered, you can still use it for migration jobs. Agents are disposable. They hold little value beyond the current migration job they're executing. You can always deploy a new agent and use that instead to run the next migration job.
