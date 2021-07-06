---
title: Deploy disaster recovery with VMware Site Recovery Manager
description: Deploy disaster recovery with VMware Site Recovery Manager (SRM) in your Azure VMware Solution private cloud.
ms.topic: how-to
ms.date: 07/15/2021
---

# Deploy disaster recovery with VMware Site Recovery Manager

This article goes through the procedures to use your Azure VMware Solution private cloud for your on-premises VMware workloads. This solution uses VMware Site Recovery Manager (SRM) and vSphere Replication (currently in preview) in your Azure VMware Solution private cloud.   

>[!IMPORTANT]
>Azure VMware Solution doesn't support:
>* Array-based replication and storage policy protection groups
>* VVOLs Protection Groups
>* SRM IP customization using SRM command-line tools

When using Azure VMware Solution as a disaster recovery site, you don't need to set up replication.  You can use on-demand scalability to reduce deployment costs and the total cost of ownership for establishing disaster recovery.  You can also take advantage of the global availability of Azure VMware Solution for worldwide geographic resilience.

We'll walk through all of the necessary procedures to:

> [!div class="checklist"] 
> * Deploy a disaster recovery solution using VMware SRM in your Azure VMware Solution private cloud.
> * Complete the configuration and site pairing in vCenter.

## Prerequisites

### Azure VMware Solution

- Create an [Azure VMware Solution assessment](../migrate/how-to-create-azure-vmware-solution-assessment.md) to estimate the resources needed in your failover site.

- Use the [Azure VMware Solution networking planning checklist](tutorial-network-checklist.md) to plan your private cloud network. 

- Ensure that you have an [Azure VMware Solution private cloud created](tutorial-create-private-cloud.md) and you've set up the [network peering](tutorial-expressroute-global-reach-private-cloud.md) between it and your on-premises datacenter.

### VMware vSphere and VMware SRM

- Verify that the vSphere configurations at each site (protected and recovery) meet the [compatibility matrices for VMware Site Recovery Manager 8.3](https://docs.vmware.com/en/Site-Recovery-Manager/8.3/rn/srm-compat-matrix-8-3.html).

- Verify that the identified on-premises configuration of your disaster recovery environment is [within limits](https://docs.vmware.com/en/Site-Recovery-Manager/8.3/com.vmware.srm.install_config.doc/GUID-3AD7D565-8A27-450C-8493-7B53F995BB14.html) supported by VMware SRM. 

- Ensure that you have [sufficient network bandwidth](https://docs.vmware.com/en/vSphere-Replication/8.3/com.vmware.vsphere.replication-admin.doc/GUID-4A34D0C9-8CC1-46C4-96FF-3BF7583D3C4F.html) for vSphere replication to meet your workload size and recovery point objective (RPO) requirements. 

- Review and follow the [prerequisites and best practices](https://docs.vmware.com/en/Site-Recovery-Manager/8.3/com.vmware.srm.install_config.doc/GUID-BB0C03E4-72BE-4C74-96C3-97AC6911B6B8.html) for installing VMware SRM.

## Deploy SRM in Azure VMware Solution
You'll deploy a disaster recovery solution using VMware SRM in your Azure VMware Solution private cloud.

1. In your on-premises datacenter, install VMware SRM and vSphere.

   >[!NOTE]
   >Use the [Two-site Topology with one vCenter Server instance per PSC](https://docs.vmware.com/en/Site-Recovery-Manager/8.3/com.vmware.srm.install_config.doc/GUID-F474543A-88C5-4030-BB86-F7CC51DADE22.html) deployment model.  Also, make sure that the [required vSphere Replication Network ports](https://kb.vmware.com/s/article/2087769) are opened.

1. In your Azure VMware Solution private cloud, navigate to **Manage** > **Add-ons** and select **Disaster recovery** to install VMware SRM with vSphere Replication as an add-on.

   The default CloudAdmin user in the Azure VMware Solution private cloud doesn't have sufficient privileges to install VMware SRM with vSphere replication. The installation process involves multiple steps outlined in the [Prerequisites](#prerequisites) section. Instead, you can install VMware SRM with vSphere Replication as an add-on service from your Azure VMware Solution private cloud.

   :::image type="content" source="media/vmware-srm-vsphere-replication/disaster-recovery-add-ons.png" alt-text="Screenshot of Azure VMware Solution private cloud to install VMware SRM with vSphere Replication as an add-on" border="true" lightbox="media/vmware-srm-vsphere-replication/disaster-recovery-add-ons.png":::

1. From the **Disaster Recovery Solution** drop-down, select **VMware Site Recovery Manager (SRM) – vSphere Replication**. 

   :::image type="content" source="media/vmware-srm-vsphere-replication/disaster-recovery-solution-srm-add-on.png" alt-text="From the Disaster Recovery Solution drop-down, select VMware Site Recovery Manager (SRM) – vSphere Replication." border="true" lightbox="media/vmware-srm-vsphere-replication/disaster-recovery-solution-srm-add-on.png":::

1. Provide the License key, select agree with terms and conditions, and then select **Install**.

   >[!NOTE]
   >If you don't provide the license key, SRM is installed in an Evaluation mode. 
   >
   > Microsoft doesn't manage and store your license. It is used only to enable VMware SRM.
   
   :::image type="content" source="media/vmware-srm-vsphere-replication/disaster-recovery-solution-srm-licence.png" alt-text="Provide the License key, select agree with terms and conditions, and then select Install." border="true" lightbox="media/vmware-srm-vsphere-replication/disaster-recovery-solution-srm-licence.png":::

## Configure site pairing in vCenter

After installing VMware SRM and vSphere Replication, you need to complete the configuration and site pairing in vCenter.

1. Sign in to vCenter as cloudadmin@vsphere.local.

1. Navigate to **Site Recovery**, check the status of both vSphere Replication and VMware SRM, and then select **OPEN Site Recovery** to launch the client.

   :::image type="content" source="media/vmware-srm-vsphere-replication/open-site-recovery.png" alt-text="Navigate to Site Recovery, check the status of both vSphere Replication and VMware SRM, and then select OPEN Site Recovery to launch the client." border="true":::


1. In the new tab that opens, select **NEW SITE PAIR** in the Site Recovery (SR) client.
   
   :::image type="content" source="media/vmware-srm-vsphere-replication/new-site-pair.png" alt-text="In the new tab that opens, select NEW SITE PAIR in the Site Recovery (SR) client." border="true":::

1. Enter the remote site details, and then select **NEXT**.

   >[!NOTE]
   >An Azure VMware Solution private cloud operates with an embedded Platform Services Controller (PSC), so there will only be one local vCenter to choose. 
   >
   >If the remote vCenter is using an embedded Platform Service Controller (PSC), use the vCenter's FQDN (or its IP address) and port to specify the PSC. 
   >
   >The remote user must have sufficient permissions to perform the pairings. An easy way to ensure this is to give that user the VRM administrator and SRM administrator roles in the remote vCenter. For a remote Azure VMware Solution private cloud, cloudadmin will already be configured with those roles.

   :::image type="content" source="media/vmware-srm-vsphere-replication/pair-the-sites-specify-details.png" alt-text="Enter the remote site details, and then select NEXT." border="true" lightbox="media/vmware-srm-vsphere-replication/pair-the-sites-specify-details.png":::

1. Select **CONNECT** to accept the certificate for the remote vCenter.

   At this point, the client should discover the VRM and SRM appliances on both sides as services to pair.

1. Select the appliances to pair and then select **NEXT**.
   
   :::image type="content" source="media/vmware-srm-vsphere-replication/pair-the-sites-new-site.png" alt-text="Select the appliances to pair and then select NEXT." border="true" lightbox="media/vmware-srm-vsphere-replication/pair-the-sites-new-site.png":::

1. Select **CONNECT** to accept the certificates for the remote VMware SRM and the remote vCenter (again).

1. Select **CONNECT** to accept the certificates for the local VMware SRM and the local vCenter.

1. Review the settings and then select **FINISH**.

   If successful, the client displays another panel for the pairing. However, if unsuccessful, an alarm will be reported.

1. At the bottom, in the right corner, select the double up arrow to expand the panel to show **Recent Tasks** and **Alarms**.

   >[!NOTE]
   >The SR client sometimes takes a long time to refresh. If an operation seems to take too long or appears "stuck", select the client's refresh icon on the menu bar. 

1. Select **VIEW DETAILS** to open the panel for remote site pairing, which opens a dialog to sign in to the remote vCenter.

   :::image type="content" source="media/vmware-srm-vsphere-replication/view-details-remote-pairing.png" alt-text="Select VIEW DETAILS to open the panel for remote site pairing, which opens a dialog to sign in to the remote vCenter." border="true" lightbox="media/vmware-srm-vsphere-replication/view-details-remote-pairing.png":::

1. Enter the username with sufficient permissions to do replication and site recovery and then select **LOG IN**. 

   For pairing, the login, which is often a different user, is a one-time action to establish pairing. The SR client requires this login every time the client is launched to work with the pairing.

   >[!NOTE] 
   >The user with sufficient permissions should have **VRM administrator** and **SRM administrator** roles in given to them in the remote vCenter. The user should also have access to the remote vCenter inventory, like folders and datastores. For a remote Azure VMware Solution private cloud, the cloudadmin user has the appropriate permissions and access. 
   
   :::image type="content" source="media/vmware-srm-vsphere-replication/sign-into-remote-vcenter.png" alt-text="Enter the username with sufficient permissions to perform replication and site recovery and then select LOG IN." border="true":::

   You'll see a warning message indicating that the embedded VRS in the local VRM isn't running.  Azure VMware Solution does not use the embedded VRS in an Azure VMware Solution private cloud.  Instead, it uses VRS appliances. 

   :::image type=" content" source=" media/vmware-srm-vsphere-replication/pair-the-sites-summary.png" alt-text=" After logging in, you'll see a warning message indicating that the embedded VRS in the local VRM is not running.  Azure VMware Solution does not use the embedded VRS in an Azure VMware Solution private cloud.  Instead, it uses VRS appliances." border="true" lightbox="media/vmware-srm-vsphere-replication/pair-the-sites-summary.png":::

## Maintenance of your SRM solution

While Microsoft aims to simplify VMware SRM and vSphere Replication installation on an Azure VMware Solution private cloud, you are responsible for managing your license and the day-to-day operation of the disaster recovery solution. 

## References

- [VMware Site Recovery Manager Documentation](https://docs.vmware.com/en/Site-Recovery-Manager/index.html)
- [Compatibility Matrices for VMware Site Recovery Manager 8.3](https://docs.vmware.com/en/Site-Recovery-Manager/8.3/rn/srm-compat-matrix-8-3.html)
- [VMWare SRM 8.3 release notes](https://docs.vmware.com/en/Site-Recovery-Manager/8.3/rn/srm-releasenotes-8-3.html)
- [VMware vSphere Replication Documentation](https://docs.vmware.com/en/vSphere-Replication/index.html)
- [Compatibility Matrices for vSphere Replication 8.3](https://docs.vmware.com/en/vSphere-Replication/8.3/rn/vsphere-replication-compat-matrix-8-3.html)
- [Operational Limits of Site Recovery Manager 8.3](https://docs.vmware.com/en/Site-Recovery-Manager/8.3/com.vmware.srm.install_config.doc/GUID-3AD7D565-8A27-450C-8493-7B53F995BB14.html)
- [Operational Limits of vSphere Replication 8.3](https://docs.vmware.com/en/vSphere-Replication/8.3/com.vmware.vsphere.replication-admin.doc/GUID-E114BAB8-F423-45D4-B029-91A5D551AC47.html)
- [Calculate bandwidth for vSphere Replication](https://docs.vmware.com/en/vSphere-Replication/8.3/com.vmware.vsphere.replication-admin.doc/GUID-4A34D0C9-8CC1-46C4-96FF-3BF7583D3C4F.html)
- [SRM installation and configuration](https://docs.vmware.com/en/Site-Recovery-Manager/8.3/com.vmware.srm.install_config.doc/GUID-B3A49FFF-E3B9-45E3-AD35-093D896596A0.html)
- [vSphere Replication administration](https://docs.vmware.com/en/vSphere-Replication/8.3/com.vmware.vsphere.replication-admin.doc/GUID-35C0A355-C57B-430B-876E-9D2E6BE4DDBA.html)
- [Pre-requisites and Best Practices for SRM installation](https://docs.vmware.com/en/Site-Recovery-Manager/8.3/com.vmware.srm.install_config.doc/GUID-BB0C03E4-72BE-4C74-96C3-97AC6911B6B8.html)
- [Network ports for SRM](https://docs.vmware.com/en/Site-Recovery-Manager/8.3/com.vmware.srm.install_config.doc/GUID-499D3C83-B8FD-4D4C-AE3D-19F518A13C98.html)
- [Network ports for vSphere Replication](https://kb.vmware.com/s/article/2087769)

