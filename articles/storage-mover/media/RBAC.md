---
title: Troubleshooting Azure Storage Mover for RBAC issues
description: Learn how to troubleshoot RBAC issues for Azure Storage Mover.
author: madhn
ms.author: madhn
ms.service: azure-storage-mover
ms.topic: how-to
ms.date: 06/11/2024
ms.custom: template-how-to
---

<!-- 
!########################################################
STATUS: IN REVIEW

CONTENT: final       

REVIEW Madhuri/Shashank: completed
REVIEW Engineering: reviewed
EDIT PASS: completed

!########################################################
-->

# Troubleshooting Storage Mover for RBAC issues

RBAC dependency experience 
The automatic RBAC assignment is best effort attempt during job run and the customer experience during failure scenario is not ideal. The screenshot below outlines how the error scenario looks in portal.  





Open issue: This warning doesn’t block the job run but without proper role assignment, the job will fail. The UI continues to show the warning icon even if it is manually fixed. 

Remediation 
Manually add the required role assignment in this case.  
1. Go to Key Vault resource.
2. Navigate to Access Control (IAM)
3. Add a new role assignment
4. In the Add role assignment wizard
   Select “Key Vault Secrets User” role from the list
   Assign access should be “Managed Identity”
   On the right pane, select Managed Identity type as Machine – Azure Arc
   Select the machine arc from the list. It will be of the same name as the agent.
   Complete the assignment 
