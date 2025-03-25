---
title: Azure VMware Solution - Host maintenance best practices
description: Understand the best practices and recommendations to maintain Azure VMware Solution Software-Defined Data Center 
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 25/03/2025
---

# Azure VMware Solution SDDC maintenance best practices

## Host maintenance and lifecycle management

[!INCLUDE [vmware-software-update-frequency](includes/vmware-software-update-frequency.md)]

## Host monitoring and remediation

Azure VMware Solution continuously monitors the health of both the VMware components and underlay. When Azure VMware Solution detects a failure, it takes action to repair the failed components. When Azure VMware Solution detects a degradation or failure on an Azure VMware Solution node, it triggers the host remediation process.

Host remediation involves replacing the faulty node with a new healthy node in the cluster. Then, when possible, the faulty host is placed in VMware vSphere maintenance mode. VMware vSphere vMotion moves the VMs off the faulty host to other available servers in the cluster, potentially allowing zero downtime for live migration of workloads. If the faulty host can't be placed in maintenance mode, the host is removed from the cluster. Before the faulty host is removed, the customer workloads are migrated to a newly added host.

> [!TIP]
> **Customer communication:** An email is sent to the customer's email address before the replacement is initiated and again after the replacement is successful. 
> 
> To receive emails related to host replacement, you need to be added to any of the following Azure RBAC roles in the subscription: 'ServiceAdmin', 'CoAdmin', 'Owner', 'Contributor'.

## Maintenance Operations Best Practices
AVS undertakes periodic maintenance of the private cloud and this includes security patches, minor & major updates to VMware software stack.

The following actions are always recommended for ensuring host maintenance operations are carried out successfully:
1.	**vSAN storage utilization:** To maintain Service Level Agreement (SLA), ensure that your vSphere cluster's storage space utilization remains below 75%. If the utilization exceeds 75%, upgrades may take than expected or fail entirely. If your storage utilization exceeds 70%, consider adding a node to expand the cluster and prevent potential downtime during upgrades.
2.	**Distributed Resource Scheduler (DRS) rules:** DRS VM-VM anti-affinity rules must be configured in a way to have at least (N+1) hosts in the cluster, where N is the number of VMs part of DRS rule.
3.	**Failures To Tolerate (FTT) violation:** To prevent data loss, change VMs configured with a vSAN storage policy for Failures to Tolerate (FTT) of 0 to a vSAN storage policy compliant with [Microsoft SLA](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1) (FTT=1 for up to 5 hosts in a cluster and FTT=2 for 6 or more hosts in a cluster) and ensure host maintenance operations can carried out seamlessly.
4.	**Remove VM CD-ROM mounts:** VMs mounted with “Emulate mode” CD-ROMs will block host maintenance. Ensure CD-ROMs are mounted in “Passthrough mode”.
5.	**Serial/parallel port or external device:** If you are using an image file (ISO, FLP, etc), ensure that it is accessible from all ESXi hosts in the cluster. Store the files on a datastore that are shared between all ESXi Servers that will participate in the vMotion of the virtual machine. Refer to [this Broadcom KB article](https://knowledge.broadcom.com/external/article/324829/vmotion-fails-with-the-compatibility-err.html) for more information.
6.	**Orphaned VMs:** In the case of an orphaned virtual machine, the VM needs to be either re-registered if possible (if it has not been deleted) or removed from inventory. Refer to [this Broadcom KB article](https://knowledge.broadcom.com/external/article/312831/virtual-machines-appear-as-invalid-or-or.html) for more information.
7.	**SCSI shared controller:** When using SCSI bus sharing use with bus type as “Physical” for VMs. VMs connected to Virtual SCSCI controllers will be powered-off. Refer to [this Broadcom KB article](https://knowledge.broadcom.com/external/article?legacyId=2147661) for more information.
8.	**Third-party VMs & applications:** For third-party VMs & applications:
    1. Ensure that third-party solutions deployed on AVS are compliant and do not interfere with maintenance operations.   
    2. Ensure that the VM isn’t installed with a VM-Host “Must run” DRS rule. Additionally, verify that these applications are compatible with upcoming versions of the VMware stack.
    3. Consult with your solution vendor and update in advance if necessary to maintain compatibility post-upgrade.



Azure VMware Solution monitors the following conditions on the host:

- Processor status
- Memory status
- Connection and power state
- Hardware fan status
- Network connectivity loss
- Hardware system board status
- Errors occurred on the disk(s) of a vSAN host
- Hardware voltage
- Hardware temperature status
- Hardware power status
- Storage status
- Connection failure
  
## Alert Codes and Remediation Table
|  Error Code         |        Error Details              |  Recommended Action     |
|--------------------|---------------------------------|---------------------|
|  EPC_SCSIDEVICE_SHARINGMODE  | This error is encountered when a Virtual Machine is configured to use a device that prevents a maintenance operation: A device that is a SCSI controller which is engaged in bus-sharing   | Follow the KB article for the removal of any SCSI controller engaged in bus-sharing attached to VMs  https://knowledge.broadcom.com/external/article?legacyId=79910   |
|  EPC_CDROM_EMULATEMODE |  This error is encountered when CD-ROM on the Virtual Machine uses emulate mode, whose ISO image is not accessible  | Follow the KB article for the removal of any CDROM mounted on customer's workload Virtual Machines in emulate mode or detach ISO. It is recommended to use Passthrough mode for mounting any CD-ROM. https://knowledge.broadcom.com/external/article?legacyId=79306   |
|  EPC_DATASTORE_INACCESSIBLE  |  This error is encountered when any external Datastore attached to AVS Private Cloud becomes inaccessible  | Follow the KB article for the removal of any stale Datastore attached to cluster /azure/azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts?tabs=azure-portal#performance-best-practices  |
|  EPC_NWADAPTER_STALE | This error is encountered when connected Network interface on the Virtual Machine uses network adapter which becomes inaccessible | Follow the KB article for the removal of any stale N/W adapters attached to Virtual Machines https://knowledge.broadcom.com/external/article/318738/troubleshooting-the-migration-compatibil.html  |

> [!NOTE]
> Azure VMware Solution tenant admins must not edit or delete the previously defined VMware vCenter Server alarms because they are managed by the Azure VMware Solution control plane on vCenter Server. These alarms are used by Azure VMware Solution monitoring to trigger the Azure VMware Solution host remediation process.






## Next steps

Now that you've covered Azure VMware Solution private cloud concepts, you might want to learn about:

- [Azure VMware Solution networking and interconnectivity concepts](architecture-networking.md)
- [Azure VMware Solution storage concepts](architecture-storage.md)
- [How to enable Azure VMware Solution resource](deploy-azure-vmware-solution.md#register-the-microsoftavs-resource-provider)

<!-- LINKS - internal -->
[concepts-networking]: ./concepts-networking.md

<!-- LINKS - external-->
[vCSA versions]: https://kb.vmware.com/s/article/2143838

[ESXi versions]: https://kb.vmware.com/s/article/2143832

[vSAN versions]: https://kb.vmware.com/s/article/2150753
