---
title: Setup gMSA for Azure Service Fabric container services
description: Learn now to setup group Managed Service Accounts (gMSA) for a container running in Azure Service Fabric.

ms.topic: conceptual
ms.date: 03/20/2019
---

# Set up gMSA for Windows containers running on Service Fabric

To set up gMSA (group Managed Service Accounts), a credential specification file (`credspec`) is placed on all nodes in the cluster. The file can be copied on all nodes using a VM extension.  The `credspec` file must contain the gMSA account information. For more information on the `credspec` file, see [Create a Credential Spec](https://docs.microsoft.com/virtualization/windowscontainers/manage-containers/manage-serviceaccounts#create-a-credential-spec). The credential specification and the `Hostname` tag are specified in the application manifest. The `Hostname` tag must match the gMSA account name that the container runs under.  The `Hostname` tag allows the container to authenticate itself to other services in the domain using Kerberos authentication.  A sample for specifying the `Hostname` and the `credspec` in the application manifest is shown in the following snippet:

```xml
<Policies>
  <ContainerHostPolicies CodePackageRef="NodeService.Code" Isolation="process" Hostname="gMSAAccountName">
    <SecurityOption Value="credentialspec=file://WebApplication1.json"/>
  </ContainerHostPolicies>
</Policies>
```
As a next step, read the following articles:

* [Deploy a Windows container to Service Fabric on Windows Server 2016](service-fabric-get-started-containers.md)
* [Deploy a Docker container to Service Fabric on Linux](service-fabric-get-started-containers-linux.md)
