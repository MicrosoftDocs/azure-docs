---
author: stevenmatthew
ms.author: shaas
ms.topic: include
ms.date: 09/16/2022
ms.service: azure-storage-mover
---
<!-- 
!########################################################
STATUS: COMPLETE

CONTENT: final

REVIEW Stephen/Fabian: COMPLETE

Document score: 100 (107 words and 0 issues)

!########################################################
-->

Azure Storage Mover is a hybrid cloud service. Hybrid services have both a cloud service component and an infrastructure component. The service administrator runs the infrastructure component in their corporate environment. For Storage Mover, that hybrid component consists of a migration agent. Agents are virtual machines, deployed to and run on a host near the source storage. To learn more about the agent and how it's deployed, read the [Storage Mover agent deployment](../agent-deploy.md) article.

Except for the agent registration process, all aspects of a migration are managed from the cloud service. Details about the agent registration process are available within the [agent registration](../agent-register.md) article.
