---
title: vCenter Server access and identity description
description: vCenter Server has a built-in local user called cloudadmin and is assigned the CloudAdmin role.
ms.topic: include
ms.service: azure-vmware
ms.date: 04/07/2022
---

<!-- used in concepts-run-commands.md and tutorial-configure-identity-source.md -->

In Azure VMware Solution, vCenter Server has a built-in local user account called *cloudadmin* that's assigned the CloudAdmin role. You can configure users and groups in Windows Server Active Directory with the CloudAdmin role for your private cloud. In general, the CloudAdmin role creates and manages workloads in your private cloud. But in Azure VMware Solution, the CloudAdmin role has vCenter Server privileges that are different from other VMware cloud solutions and on-premises deployments.

> [!IMPORTANT]
> The local cloudadmin user account should be used as an emergency access account for "break glass" scenarios in your private cloud. It's not intended to be used for daily administrative activities or for integration with other services.

- In a vCenter Server and ESXi on-premises deployment, the administrator has access to the vCenter Server administrator\@vsphere.local account and the ESXi root account. The administrator might also be assigned to more Windows Server Active Directory users and groups.

- In an Azure VMware Solution deployment, the administrator doesn't have access to the administrator user account or the ESXi root account. But the administrator can assign Windows Server Active Directory users and groups the CloudAdmin role in vCenter Server. The CloudAdmin role doesn't have permissions to add an identity source like an on-premises Lightweight Directory Access Protocol (LDAP) or Secure Lightweight Directory Access Protocol (LDAPS) server to vCenter Server. However, you can use Run commands to add an identity source and assign the cloudadmin role to users and groups.

A private cloud user account can't access or manage specific management components that Microsoft supports and manages. Examples include clusters, hosts, datastores, and distributed virtual switches.

> [!NOTE]
> In Azure VMware Solution, the vsphere.local single sign-on (SSO) domain is provided as a managed resource to support platform operations. You can't use it to create or manage local groups and users except for those provided by default with your private cloud.
