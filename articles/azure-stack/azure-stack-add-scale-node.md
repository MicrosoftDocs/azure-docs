---
title: Azure Stack add scale nodes | Microsoft Docs
description: Add nodes to scale units in Azure Stack.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/17/2018
ms.author: jeffgilb
ms.reviewer: thoroet 
---

# Add additional scale unit nodes in Azure Stack

Azure Stack operators can increase the overall capacity of an existing scale unit by adding an additional physical computer. The physical computer is also referred to as a scale unit node. Each new scale unit node you add must be homogenous in CPU type, memory, and disk number & size to the nodes that are already present in the scale unit.

> [!NOTE]  
You must run Azure Stack 1807 or later to add additional scale unit nodes.

To add a scale unit node, you act in Azure Stack and run tooling from your hardware equipment manufacturer (OEM). The OEM tooling runs on the hardware lifecycle host (HLH) to make sure the new physical computer matches the same firmware level as existing nodes.

The following flow diagram shows the general process to add a scale unit node.

![Add scale unit flow](media/azure-stack-add-scale-node/add-node-flow.png)
&#42; *Whether your OEM hardware vendor enacts the physical server rack placement and updates the firmware varies based on your support contract.*

The operation to add a new node can take several hours or days to complete.

> [!Note]  
> Do not attempt any of the following operations while an add scale unit node operation is already in progress:
>
>  - Update Azure Stack
>  - Rotate certificates
>  - Stop Azure Stack
>  - Repair scale unit node


## Add scale unit nodes

The following steps are a high-level overview of how to add a node. Don't follow these steps without first referring to your OEM-provided capacity expansion documentation.

1. Place the new physical server in the rack and cable it appropriately. 
2. Enable physical switch ports and adjust access control lists (ACLs) if applicable.
3. Configure the correct IP Address in the baseboard management controller (BMC) and apply all BIOS settings per your OEM-provided documentation.
4. Apply the current firmware baseline to all components by using the tools that are provided by the hardware manufacturer that run on the HLH.
5. Run the Add node operation in the Azure Stack admin portal.
6. Validate that the add node operation succeeds. To do so, check the [**Status** of the Scale Unit](#monitor-add-node-operations). 

## Add the node

You can use the admin portal or PowerShell to add new nodes. The add node operation first adds the new scale unit node as available compute capacity and then automatically extends the storage capacity. The capacity expands automatically because Azure Stack is a hyperconverged system where *compute* and *storage* scale together.

### Use the admin portal

1. Sign in to the Azure Stack admin portal as an Azure Stack operator.
2. Navigate to **+ Create a resource** > **Capacity** > **Scale Unit Node**.
   ![Scale unit node](media/azure-stack-add-scale-node/select-node1.png)
3. On the **Add node** pane, select the *Region*, and then select the *Scale unit* that you want to add the node to. Also specify the *BMC IP ADDRESS* for the scale unit node you are adding. You can only add one node at a time.
   ![Add node details](media/azure-stack-add-scale-node/select-node2.png)
 

### Use PowerShell

Use the **New-AzsScaleUnitNodeObject** cmdlet to add a node.  

Before using either of the following sample PowerShell scripts, replace the values *node names* and *IP addresses* with values from your Azure Stack environment.

  > [!Note]  
  > When naming a node you must keep the name to less than 15 characters in length. You also cannot use a name that contains a space or contains any of the following characters: `\`, `/`, `:`, `*`, `?`, `"`, `<`, `>`, `|`, `\`, `~`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `(`, `)`, `{`,` }`, `_`.

**Add a node:**
  ```powershell
  ## Add a single Node 
  $NewNode=New-AzsScaleUnitNodeObject -computername "<name_of_new_node>" -BMCIPv4Address "<BMCIP_address_of_new_node>" 
 
  Add-AzsScaleUnitNode -NodeList $NewNode -ScaleUnit "<name_of_scale_unit_cluster>" 
  ```  

## Monitor add node operations 
You can use the admin portal or PowerShell to get the status of the add node operation. Add node operations can take several hours to days to complete.

### Use the admin portal 
To monitor the addition of a new node, in the admin portal review the scale unit or scale unit node objects. To do so, go to **Region management** > **Scale units**. Next, select the scale unit or scale unit node you want to review. 

### Use PowerShell
The status for scale unit and scale unit nodes can be retrieved using PowerShell as follows:
  ```powershell
  #Retrieve Status for the Scale Unit
  Get-AzsScaleUnit|select name,state
 
  #Retrieve Status for each Scale Unit Node
  Get-AzsScaleUnitNode |Select Name, ScaleUnitNodeStatus
```

### Status for the add node operation 
**For a scale unit:**
|Status               |Description  |
|---------------------|---------|
|Running              |All nodes are actively participating in the scale unit.|
|Stopped              |The scale unit node is either down or unreachable.|
|Expanding            |One or more scale unit nodes are currently being added as compute capacity.|
|Configuring Storage  |The compute capacity has been expanded and the storage configuration is running.|
|Requires Remediation |An error has been detected that requires one or more scale unit nodes to be repaired.|


**For a scale unit node:**
|Status                |Description  |
|----------------------|---------|
|Running               |The node is actively participating in the scale unit.|
|Stopped               |The node is unavailable.|
|Adding                |The node is actively being added to the scale unit.|
|Repairing             |The node is actively being repaired.|
|Maintenance           |The node is paused, and no active user workload is running. |
|Requires Remediation  |An error has been detected that requires the node to be repaired.|


## Troubleshooting
The following are common issues seen when adding a node. 

**Scenario 1:**  The add scale unit node operation fails but one or more nodes are listed with a status of Stopped.  
- Remediation: Use the repair operation to repair one or more nodes. Only a single repair operation can run at one time.

**Scenario 2:** One or more scale unit nodes have been added but the storage expansion failed. In this scenario, the scale unit node object reports a status of Running but the Configuring Storage task isn't started.  
- Remediation: Use the privileged endpoint to review the storage health by running the following PowerShell cmdlet:
  ```powershell
     Get-VirtualDisk -CimSession s-cluster | Get-StorageJob
  ```
 
**Scenario 3:** You received an alert that indicates the storage scale-out job failed.  
- Remediation: In this case, the storage configuration task has failed. This problem requires you to contact support.


## Next steps 
[Add public IP addresses](azure-stack-add-ips.md) 
