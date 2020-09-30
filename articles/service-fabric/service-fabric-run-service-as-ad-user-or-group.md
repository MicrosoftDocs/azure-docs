---
title: Run an Azure Service Fabric service as an AD user or group 
description: Learn how to run a service as an Active Directory user or group on a Service Fabric Windows standalone cluster.
author: dkkapur

ms.topic: conceptual
ms.date: 03/29/2018
ms.author: dekapur
---
# Run a service as an Active Directory user or group
On a Windows Server standalone cluster, you can run a service as an Active Directory user or group using a RunAs policy.  By default, Service Fabric applications run under the account that the Fabric.exe process runs under. Running applications under different accounts, even in a shared hosted environment, makes them more secure from one another. Note that this uses Active Directory on-premises within your domain and not Azure Active Directory (Azure AD).  You can also run a service as a [group Managed Service Account (gMSA)](service-fabric-run-service-as-gmsa.md).

By using a domain user or group, you can then access other resources in the domain (for example, file shares) that have been granted permissions.

The following example shows an Active Directory user called *TestUser* with their domain password encrypted by using a certificate called *MyCert*. You can use the `Invoke-ServiceFabricEncryptText` PowerShell command to create the secret cipher text. See [Managing secrets in Service Fabric applications](service-fabric-application-secret-management.md) for details.

You must deploy the private key of the certificate to decrypt the password to the local machine by using an out-of-band method (in Azure, this is via Azure Resource Manager). Then, when Service Fabric deploys the service package to the machine, it is able to decrypt the secret and (along with the user name) authenticate with Active Directory to run under those credentials.

```xml
<Principals>
  <Users>
    <User Name="TestUser" AccountType="DomainUser" AccountName="Domain\User" Password="[Put encrypted password here using MyCert certificate]" PasswordEncrypted="true" />
  </Users>
</Principals>
<Policies>
  <DefaultRunAsPolicy UserRef="TestUser" />
  <SecurityAccessPolicies>
    <SecurityAccessPolicy ResourceRef="MyCert" PrincipalRef="TestUser" GrantRights="Full" ResourceType="Certificate" />
  </SecurityAccessPolicies>
</Policies>
<Certificates>
```

> [!NOTE] 
> If you apply a RunAs policy to a service and the service manifest declares endpoint resources with the HTTP protocol, you must also specify a **SecurityAccessPolicy**.  For more information, see [Assign a security access policy for HTTP and HTTPS endpoints](service-fabric-assign-policy-to-endpoint.md). 
>

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
As a next step, read the following articles:
* [Understand the application model](service-fabric-application-model.md)
* [Specify resources in a service manifest](service-fabric-service-manifest-resources.md)
* [Deploy an application](service-fabric-deploy-remove-applications.md)

[image1]: ./media/service-fabric-application-runas-security/copy-to-output.png
