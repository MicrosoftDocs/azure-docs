---
title: vCenter Server access and identity description
description: vCenter Server has a built-in local user called cloudadmin and is assigned to the CloudAdmin role.
ms.topic: include
ms.service: azure-vmware
ms.date: 04/07/2022
---

<!-- used in concepts-run-commands.md and tutorial-configure-identity-source.md -->

In Azure VMware Solution, vCenter Server has a built-in local user called *cloudadmin* assigned to the CloudAdmin role. You can configure users and groups in Active Directory (AD) with the CloudAdmin role for your private cloud. In general, the CloudAdmin role creates and manages workloads in your private cloud. But in Azure VMware Solution, the CloudAdmin role has vCenter Server privileges that differ from other VMware cloud solutions and on-premises deployments.

>[!IMPORTANT]
>The local cloudadmin user should be treated as an emergency access account for "break glass" scenarios in your private cloud. It's not for daily administrative activities or integration with other services. 

- In a vCenter Server and ESXi on-premises deployment, the administrator has access to the vCenter Server administrator\@vsphere.local account and the ESXi root account. They can also have more AD users and groups assigned. 

- In an Azure VMware Solution deployment, the administrator doesn't have access to the administrator user account or the ESXi root account. They can, however, assign AD users and groups to the CloudAdmin role in vCenter Server.  The CloudAdmin role doesn't have permissions to add an identity source like on-premises LDAP or LDAPS server to vCenter Server. However, you can use Run commands to add an identity source and assign cloudadmin role to users and groups.
 
The private cloud user doesn't have access to and can't configure specific management components Microsoft supports and manages. For example, clusters, hosts, datastores, and distributed virtual switches.

>[!NOTE]
>In Azure VMware Solution, the *vsphere.local* SSO domain is provided as a managed resource to support platform operations. It doesn't support the creation and management of local groups and users except for those provided by default with your private cloud.
