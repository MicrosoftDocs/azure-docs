---
title: vCenter access and identity description
description: vCenter has a built-in local user called cloudadmin and assigned to the CloudAdmin role.
ms.topic: include
ms.date: 08/23/2021
---

<!-- used in concepts-run-commands.md and tutorial-configure-identity-source.md -->

In Azure VMware Solution, vCenter has a built-in local user called cloudadmin and assigned to the CloudAdmin role. The local cloudadmin user is used to set up users in Active Directory (AD). In general, the CloudAdmin role creates and manages workloads in your private cloud. But in Azure VMware Solution, the CloudAdmin role has vCenter privileges that differ from other VMware cloud solutions.     

- In a vCenter and ESXi on-premises deployment, the administrator has access to the vCenter administrator\@vsphere.local account. They can also have more AD users and groups assigned. 

- In an Azure VMware Solution deployment, the administrator doesn't have access to the administrator user account. They can, however, assign AD users and groups to the CloudAdmin role on vCenter.  The CloudAdmin role doesn't have permissions to add an identity source like on-premises LDAP or LDAPS server to vCenter. However, Run commands allow this functionality to add an identity source and assign cloudadmin role to users and groups.

The private cloud user doesn't have access to and can't configure specific management components Microsoft supports and manages. For example, clusters, hosts, datastores, and distributed virtual switches.