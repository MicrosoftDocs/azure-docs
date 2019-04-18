---
title: Run an Azure Service Fabric service under a gMSA account | Microsoft Docs
description: Learn how to run a service as a gMSA on a Service Fabric Windows standalone cluster.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: chackdan
editor: ''

ms.assetid: 4242a1eb-a237-459b-afbf-1e06cfa72732
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 03/29/2018
ms.author: dekapur

---
# Run a service as a group Managed Service Account
On a Windows Server standalone cluster, you can run a service as a group Managed Service Account (gMSA) using a RunAs policy.  By default, Service Fabric applications run under the account that the Fabric.exe process runs under. Running applications under different accounts, even in a shared hosted environment, makes them more secure from one another. Note that this uses Active Directory on-premises within your domain and not Azure Active Directory (Azure AD). By using a gMSA, there is no password or encrypted password stored in the application manifest.  You can also run a service as an [Active Directory user or group](service-fabric-run-service-as-ad-user-or-group.md).

The following example shows how to create a gMSA account called *svc-Test$*; how to deploy that managed service account to the cluster nodes; and how to configure the user principal.

Pre-requisites:
- The domain needs a KDS root key.
- The domain needs to be at a Windows Server 2012 or later functional level.

1. Have an Active Directory domain administrator create a group managed service account using the `New-ADServiceAccount` commandlet and ensure that the `PrincipalsAllowedToRetrieveManagedPassword` includes all of the service fabric cluster nodes. `AccountName`, `DnsHostName`, and `ServicePrincipalName` must be unique.

    ```powershell
    New-ADServiceAccount -name svc-Test$ -DnsHostName svc-test.contoso.com  -ServicePrincipalNames http/svc-test.contoso.com -PrincipalsAllowedToRetrieveManagedPassword SfNode0$,SfNode1$,SfNode2$,SfNode3$,SfNode4$
    ```

2. On each of the Service Fabric cluster nodes (for example, `SfNode0$,SfNode1$,SfNode2$,SfNode3$,SfNode4$`), install and test the gMSA.
    
    ```powershell
    Add-WindowsFeature RSAT-AD-PowerShell
    Install-AdServiceAccount svc-Test$
    Test-AdServiceAccount svc-Test$
    ```

3. Configure the User principal, and configure the RunAsPolicy to reference the user.
    
    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <ApplicationManifest xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="MyApplicationType" ApplicationTypeVersion="1.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
        <ServiceManifestImport>
          <ServiceManifestRef ServiceManifestName="MyServiceTypePkg" ServiceManifestVersion="1.0.0" />
          <ConfigOverrides />
          <Policies>
              <RunAsPolicy CodePackageRef="Code" UserRef="DomaingMSA"/>
          </Policies>
        </ServiceManifestImport>
      <Principals>
        <Users>
          <User Name="DomaingMSA" AccountType="ManagedServiceAccount" AccountName="domain\svc-Test$"/>
        </Users>
      </Principals>
    </ApplicationManifest>
    ```

> [!NOTE] 
> If you apply a RunAs policy to a service and the service manifest declares endpoint resources with the HTTP protocol, you must specify a **SecurityAccessPolicy**.  For more information, see [Assign a security access policy for HTTP and HTTPS endpoints](service-fabric-assign-policy-to-endpoint.md). 
>

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
As a next step, read the following articles:
* [Understand the application model](service-fabric-application-model.md)
* [Specify resources in a service manifest](service-fabric-service-manifest-resources.md)
* [Deploy an application](service-fabric-deploy-remove-applications.md)

[image1]: ./media/service-fabric-application-runas-security/copy-to-output.png
