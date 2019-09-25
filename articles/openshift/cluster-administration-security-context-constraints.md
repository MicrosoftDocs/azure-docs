---
title: Managing Security Context Constraints in Azure Red Hat OpenShift | Microsoft Docs
description:  Azure Red Hat OpenShift cluster administrator managing security context constraints
services: container-service
author: troy0820
ms.author: b-trconn
ms.author: jzim
ms.service: container-service
ms.topic: article
ms.date: 09/25/2019
#Customer intent: As a developer, I need to understand how to manage security context constraints.
---
# Overview 

Security context constraints allow administrators to control permissions for pods. To learn more about this API type, see the security context constraints (SCCs) architecture documentation. You can manage SCCs in your instance as normal API objects using the CLI.

# Listing Security Context Constraints

To get a current list of SCCs 

```bash
$ oc get scc

NAME               PRIV      CAPS      SELINUX     RUNASUSER          FSGROUP     SUPGROUP    PRIORITY   READONLYROOTFS   VOLUMES
anyuid             false     []        MustRunAs   RunAsAny           RunAsAny    RunAsAny    10         false            [configMap downwardAPI emptyDir persistentVolumeClaim secret]
hostaccess         false     []        MustRunAs   MustRunAsRange     MustRunAs   RunAsAny    <none>     false            [configMap downwardAPI emptyDir hostPath persistentVolumeClaim secret]
hostmount-anyuid   false     []        MustRunAs   RunAsAny           RunAsAny    RunAsAny    <none>     false            [configMap downwardAPI emptyDir hostPath nfs persistentVolumeClaim secret]
hostnetwork        false     []        MustRunAs   MustRunAsRange     MustRunAs   MustRunAs   <none>     false            [configMap downwardAPI emptyDir persistentVolumeClaim secret]
nonroot            false     []        MustRunAs   MustRunAsNonRoot   RunAsAny    RunAsAny    <none>     false            [configMap downwardAPI emptyDir persistentVolumeClaim secret]
privileged         true      [*]       RunAsAny    RunAsAny           RunAsAny    RunAsAny    <none>     false            [*]
restricted         false     []        MustRunAs   MustRunAsRange     MustRunAs   RunAsAny    <none>     false            [configMap downwardAPI emptyDir persistentVolumeClaim secret]
```

# Examining a Security Context Constraints Object

To examine a particular SCC, use `oc get`, `oc describe`, or `oc edit`.  For example, to examine the **restricted** SCC:
```bash
$ oc describe scc restricted
Name:					restricted
Priority:				<none>
Access:
  Users:				<none>
  Groups:				system:authenticated
Settings:
  Allow Privileged:			false
  Default Add Capabilities:		<none>
  Required Drop Capabilities:		KILL,MKNOD,SYS_CHROOT,SETUID,SETGID
  Allowed Capabilities:			<none>
  Allowed Seccomp Profiles:		<none>
  Allowed Volume Types:			configMap,downwardAPI,emptyDir,persistentVolumeClaim,projected,secret
  Allow Host Network:			false
  Allow Host Ports:			false
  Allow Host PID:			false
  Allow Host IPC:			false
  Read Only Root Filesystem:		false
  Run As User Strategy: MustRunAsRange
    UID:				<none>
    UID Range Min:			<none>
    UID Range Max:			<none>
  SELinux Context Strategy: MustRunAs
    User:				<none>
    Role:				<none>
    Type:				<none>
    Level:				<none>
  FSGroup Strategy: MustRunAs
    Ranges:				<none>
  Supplemental Groups Strategy: RunAsAny
    Ranges:				<none>
```
## Next steps
How to configure osa-customer-admin role:
> [!div class="nextstepaction"]
> [Azure Active Directory integration for Azure Red Hat OpenShift](howto-aad-app-configuration.md) 