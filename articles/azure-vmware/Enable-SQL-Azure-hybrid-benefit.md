---
title: Enable SQL Azure hybrid benefit for Azure VMware Solution (Preview)
description: This article shows you how to enjoy hybrid benefits from licenses you already paid for.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 06/14/2022
---

# Enable SQL Azure hybrid benefit for Azure VMware Solution (Preview)

In this article, you’ll learn how to apply SQL Azure hybrid benefits to your Azure VMware Solution private cloud by configuring a placement policy. The placement policy defines the number of hosts that is running SQL. 
>[!IMPORTANT]
> It is important to note that SQL benefits are applied at the host level. 

For example, if each host in AVS has 36 cores and you signal that two hosts run SQL. Then SQL Azure hybrid benefit will apply to 72 cores.

## Configure host-VM placement policy
1.	From your Azure VMware Solution private cloud, select Azure hybrid benefit, then Create host-VM placement policy.
 :::image type="content" source="media/Sql-azure-hybrid-benefit/AZ-hybrid-benefit.png" alt-text="Diagram that shows how to create a host virtual machine placement policy":::

1.	Fill in the required fields for creating the placement policy.
     1.	**Name** – Select the name that identifies this policy.
     2. **Type** – Select the type of policy. This must be VM-Host affinity only.
     3. **Azure hybrid benefit** – Select the checkbox to apply the SQL Azure hybrid benefit.
     4. **Cluster** – Select the necessary cluster. The policy is applicable per cluster only.
     1. **Enabled** – Select enabled to apply the policy immediately once created.
     
     :::image type="content" source="media/Sql-azure-hybrid-benefit/create-placement-policy.png" alt-text="Diagram that shows how to create a host virtual machine placement policy":::
3.	Select the hosts and VMs that will be applied to the VM-Host affinity policy.
     1.	**Add Hosts** – Select the hosts that will be running SQL.
     2.	**Add VMs** – Select the VMs that should run on the selected hosts.
     3. **Review and Create** the policy
     :::image type="content" source="media/Sql-azure-hybrid-benefit/select-policy-host.png" alt-text="Diagram that shows how to create a host virtual machine placement policy":::

## Managing placement policies

After the placement policy is created, you can review, manage, edit the policy by going to the Placement policies menu available in the Azure VMWare Solution private cloud. 

You can also enable existing host-VM policies with the SQL Azure hybrid benefit by checking the Azure hybrid benefit checkbox in the configuration setting for that policy.

:::image type="content" source="media/Sql-azure-hybrid-benefit/placement-policies.png" alt-text="Diagram that shows how to configure virtual machine placement policies":::