---
title: Enable SQL Azure hybrid benefit for Azure VMware Solution
description: This article shows you how to apply SQL Azure hybrid benefits to your Azure VMware Solution private cloud by configuring a placement policy.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 02/14/2023
---

# Enable SQL Azure hybrid benefit for Azure VMware Solution

In this article, you’ll learn how to configure SQL Azure hybrid benefits to an Azure VMware Solution private cloud by configuring a placement policy. The placement policy defines the hosts that are running SQL as well as the virtual machines on that host. 
>[!IMPORTANT]
> It is important to note that SQL benefits are applied at the host level. 

For example, if each host in Azure VMware Solution has 36 cores and you signal that two hosts run SQL, then SQL Azure hybrid benefit will apply to 72 cores irrespective of the number of SQL or other virtual machines on that host.

You can also choose to view a video tutorial for configuring SQL Azure hybrid benefits for Azure VMware Solution [here](https://www.youtube.com/watch?v=vJIQ1K2KTa0).

## Configure host-VM placement policy
1.	From your Azure VMware Solution private cloud, select Azure hybrid benefit, then Create host-VM placement policy.
 :::image type="content" source="media/sql-azure-hybrid-benefit/azure-hybrid-benefit.png" alt-text="Diagram that shows how to create a host new virtual machine placement policy.":::

1.	Fill in the required fields for creating the placement policy.
     1.	**Name** – Select the name that identifies this policy.
     2. **Type** – Select the type of policy. This type must be a VM-Host affinity rule only.
     3. **Azure hybrid benefit** – Select the checkbox to apply the SQL Azure hybrid benefit.
     4. **Cluster** – Select the correct cluster. The policy is scoped to host in this cluster only.
     1. **Enabled** – Select enabled to apply the policy immediately once created.
     
     :::image type="content" source="media/sql-azure-hybrid-benefit/create-placement-policy.png" alt-text="Diagram that shows how to create a host virtual machine placement policy using the host VM affinity.":::
3.	Select the hosts and VMs that will be applied to the VM-Host affinity policy.
     1.	**Add Hosts** – Select the hosts that will be running SQL. When hosts are replaced, policies are re-created on the new hosts automatically.
     2.	**Add VMs** – Select the VMs that should run on the selected hosts.
     3. **Review and Create** the policy.
     :::image type="content" source="media/sql-azure-hybrid-benefit/select-policy-host.png" alt-text="Diagram that shows how to create a host virtual machine affinity.":::

## Manage placement policies

After creating the placement policy, you can review, manage, or edit the policy by way of the Placement policies menu in the Azure VMware Solution private cloud. 

By checking the Azure hybrid benefit checkbox in the configuration setting, you can enable existing host-VM affinity policies with the SQL Azure hybrid benefit.

:::image type="content" source="media/sql-azure-hybrid-benefit/placement-policies.png" alt-text="Diagram that shows how to configure virtual machine placement policies.":::

## Next steps
[Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/)

[Attach Azure NetApp Files datastores to Azure VMware Solution hosts](attach-azure-netapp-files-to-azure-vmware-solution-hosts.md)

