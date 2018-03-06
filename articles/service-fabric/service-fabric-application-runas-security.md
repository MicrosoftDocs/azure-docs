---
title: Learn about Azure microservices security policies | Microsoft Docs
description: An overview of how to run a Service Fabric application under system and local security accounts, including the SetupEntry point where an application needs to perform some privileged action before it starts
services: service-fabric
documentationcenter: .net
author: msfussell
manager: timlt
editor: ''

ms.assetid: 4242a1eb-a237-459b-afbf-1e06cfa72732
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/30/2017
ms.author: mfussell

---
# Configure security policies for your application
By using Azure Service Fabric, you can secure applications that are running in the cluster under different user accounts. Service Fabric also helps secure the resources that are used by applications at the time of deployment under the user accounts--for example, files, directories, and certificates. This makes running applications, even in a shared hosted environment, more secure from one another.

By default, Service Fabric applications run under the account that the Fabric.exe process runs under. Service Fabric also provides the capability to run applications under a local user account or local system account, which is specified within the application manifest. Supported local system account types are **LocalUser**, **NetworkService**, **LocalService**, and **LocalSystem**.

 When you're running Service Fabric on Windows Server in your datacenter by using the standalone installer, you can use Active Directory domain accounts, including group managed service accounts.

You can define and create user groups so that one or more users can be added to each group to be managed together. This is useful when there are multiple users for different service entry points and they need to have certain common privileges that are available at the group level.



## Configure a policy for service code packages
In the preceding steps, you saw how to apply a RunAs policy to SetupEntryPoint. Let's look a little deeper into how to create different principals that can be applied as service policies.

### Create local user groups
You can define and create user groups that allow one or more users to be added to a group. This is useful if there are multiple users for different service entry points and they need to have certain common privileges that are available at the group level. The following example shows a local group called **LocalAdminGroup** that has administrator privileges. Two users, Customer1 and Customer2, are made members of this local group.

```xml
<Principals>
 <Groups>
   <Group Name="LocalAdminGroup">
     <Membership>
       <SystemGroup Name="Administrators"/>
     </Membership>
   </Group>
 </Groups>
  <Users>
     <User Name="Customer1">
        <MemberOf>
           <Group NameRef="LocalAdminGroup" />
        </MemberOf>
     </User>
    <User Name="Customer2">
      <MemberOf>
        <Group NameRef="LocalAdminGroup" />
      </MemberOf>
    </User>
  </Users>
</Principals>
```

### Create local users
You can create a local user that can be used to help secure a service within the application. When a **LocalUser** account type is specified in the principals section of the application manifest, Service Fabric creates local user accounts on machines where the application is deployed. By default, these accounts do not have the same names as those specified in the application manifest (for example, Customer3 in the following sample). Instead, they are dynamically generated and have random passwords.

```xml
<Principals>
  <Users>
     <User Name="Customer3" AccountType="LocalUser" />
  </Users>
</Principals>
```

If an application requires that the user account and password be same on all machines (for example, to enable NTLM authentication), the cluster manifest must set NTLMAuthenticationEnabled to true. The cluster manifest must also specify an NTLMAuthenticationPasswordSecret that is used to generate the same password across all machines.

```xml
<Section Name="Hosting">
      <Parameter Name="EndpointProviderEnabled" Value="true"/>
      <Parameter Name="NTLMAuthenticationEnabled" Value="true"/>
      <Parameter Name="NTLMAuthenticationPassworkSecret" Value="******" IsEncrypted="true"/>
 </Section>
```

### Assign policies to the service code packages
The **RunAsPolicy** section for a **ServiceManifestImport** specifies the account from the principals section that should be used to run a code package. It also associates code packages from the service manifest with user accounts in the principals section. You can specify this for the setup or main entry points, or you can specify `All` to apply it to both. The following example shows different policies being applied:

```xml
<Policies>
<RunAsPolicy CodePackageRef="Code" UserRef="LocalAdmin" EntryPointType="Setup"/>
<RunAsPolicy CodePackageRef="Code" UserRef="Customer3" EntryPointType="Main"/>
</Policies>
```

If **EntryPointType** is not specified, the default is set to EntryPointType=”Main”. Specifying **SetupEntryPoint** is especially useful when you want to run certain high-privilege setup operations under a system account. The actual service code can run under a lower-privilege account.

### Apply a default policy to all service code packages
You use the **DefaultRunAsPolicy** section to specify a default user account for all code packages that don’t have a specific **RunAsPolicy** defined. If most of the code packages that are specified in the service manifest used by an application need to run under the same user, the application can just define a default RunAs policy with that user account. The following example specifies that if a code package does not have a **RunAsPolicy** specified, the code package should run under the **MyDefaultAccount** specified in the principals section.

```xml
<Policies>
  <DefaultRunAsPolicy UserRef="MyDefaultAccount"/>
</Policies>
```
### Use an Active Directory domain group or user
For an instance of Service Fabric that was installed on Windows Server by using the standalone installer, you can run the service under the credentials for an Active Directory user or group account. This is Active Directory on-premises within your domain and is not with Azure Active Directory (Azure AD). By using a domain user or group, you can then access other resources in the domain (for example, file shares) that have been granted permissions.

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
### Use a Group Managed Service Account.
For an instance of Service Fabric that was installed on Windows Server by using the standalone installer, you can run the service as a group Managed Service Account (gMSA). Note that this is Active Directory on-premises within your domain and is not with Azure Active Directory (Azure AD). By using a gMSA there is no password or encrypted password stored in the `Application Manifest`.

The following example shows how to create a gMSA account called *svc-Test$*; how to deploy that managed service account to the cluster nodes; and how to configure the user principal.

##### Prerequisites.
- The domain needs a KDS root key.
- The domain needs to be at a Windows Server 2012 or later functional level.

##### Example
1. Have an active directory domain administrator create a group managed service account using the `New-ADServiceAccount` commandlet and ensure that the `PrincipalsAllowedToRetrieveManagedPassword` includes all of the service fabric cluster nodes. Note that `AccountName`, `DnsHostName`, and `ServicePrincipalName` must be unique.

    ```poweshell
    New-ADServiceAccount -name svc-Test$ -DnsHostName svc-test.contoso.com  -ServicePrincipalNames http/svc-test.contoso.com -PrincipalsAllowedToRetrieveManagedPassword SfNode0$,SfNode1$,SfNode2$,SfNode3$,SfNode4$
    ```

2. On each of the service fabric cluster nodes (for example, `SfNode0$,SfNode1$,SfNode2$,SfNode3$,SfNode4$`), install and test the gMSA.
    
    ```powershell
    Add-WindowsFeature RSAT-AD-PowerShell
    Install-AdServiceAccount svc-Test$
    Test-AdServiceAccount svc-Test$
    ```

3. Configure the User principal, and configure the RunAsPolicy to reference the user.
    
    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <ApplicationManifest xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="MyApplicationType" ApplicationTypeVersion="1.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
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

## Assign a security access policy for HTTP and HTTPS endpoints
If you apply a RunAs policy to a service and the service manifest declares endpoint resources with the HTTP protocol, you must specify a **SecurityAccessPolicy** to ensure that ports allocated to these endpoints are correctly access-control listed for the RunAs user account that the service runs under. Otherwise, **http.sys** does not have access to the service, and you get failures with calls from the client. The following example applies the Customer1 account to an endpoint called **EndpointName**, which gives it full access rights.

```xml
<Policies>
   <RunAsPolicy CodePackageRef="Code" UserRef="Customer1" />
   <!--SecurityAccessPolicy is needed if RunAsPolicy is defined and the Endpoint is http -->
   <SecurityAccessPolicy ResourceRef="EndpointName" PrincipalRef="Customer1" />
</Policies>
```

For the HTTPS endpoint, you also have to indicate the name of the certificate to return to the client. You can do this by using **EndpointBindingPolicy**, with the certificate defined in a certificates section in the application manifest.

```xml
<Policies>
   <RunAsPolicy CodePackageRef="Code" UserRef="Customer1" />
  <!--SecurityAccessPolicy is needed if RunAsPolicy is defined and the Endpoint is http -->
   <SecurityAccessPolicy ResourceRef="EndpointName" PrincipalRef="Customer1" />
  <!--EndpointBindingPolicy is needed if the EndpointName is secured with https -->
  <EndpointBindingPolicy EndpointRef="EndpointName" CertificateRef="Cert1" />
</Policies
```
## Upgrading multiple applications with https endpoints
You need to be careful not to use the **same port** for different instances of the same application when using http**s**. The reason is that Service Fabric won't be able to upgrade the cert for one of the application instances. For example, if application 1 or application 2 both want to upgrade their cert 1 to cert 2. When the upgrade happens, Service Fabric might have cleaned up the cert 1 registration with http.sys even though the other application is still using it. To prevent this, Service Fabric detects that there is already another application instance registered on the port with the certificate (due to http.sys) and fails the operation.

Hence Service Fabric does not support upgrading two different services using **the same port** in different application instances. In other words, you cannot use the same certificate on different services on the same port. If you need to have a shared certificate on the same port, you need to ensure that the services are placed on different machines with placement constraints. Or consider using Service Fabric dynamic ports if possible for each service in each application instance. 

If you see an upgrade fail with https, an error warning saying "The Windows HTTP Server API does not support multiple certificates for applications that share a port.”

## A complete application manifest example
The following application manifest shows many of the different settings:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="Application3Type" ApplicationTypeVersion="1.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
   <Parameters>
      <Parameter Name="Stateless1_InstanceCount" DefaultValue="-1" />
   </Parameters>
   <ServiceManifestImport>
      <ServiceManifestRef ServiceManifestName="Stateless1Pkg" ServiceManifestVersion="1.0.0" />
      <ConfigOverrides />
      <Policies>
         <RunAsPolicy CodePackageRef="Code" UserRef="Customer1" />
         <RunAsPolicy CodePackageRef="Code" UserRef="LocalAdmin" EntryPointType="Setup" />
        <!--SecurityAccessPolicy is needed if RunAsPolicy is defined and the Endpoint is http -->
         <SecurityAccessPolicy ResourceRef="EndpointName" PrincipalRef="Customer1" />
        <!--EndpointBindingPolicy is needed the EndpointName is secured with https -->
        <EndpointBindingPolicy EndpointRef="EndpointName" CertificateRef="Cert1" />
     </Policies>
   </ServiceManifestImport>
   <DefaultServices>
      <Service Name="Stateless1">
         <StatelessService ServiceTypeName="Stateless1Type" InstanceCount="[Stateless1_InstanceCount]">
            <SingletonPartition />
         </StatelessService>
      </Service>
   </DefaultServices>
   <Principals>
      <Groups>
         <Group Name="LocalAdminGroup">
            <Membership>
               <SystemGroup Name="Administrators" />
            </Membership>
         </Group>
      </Groups>
      <Users>
         <User Name="LocalAdmin">
            <MemberOf>
               <Group NameRef="LocalAdminGroup" />
            </MemberOf>
         </User>
         <!--Customer1 below create a local account that this service runs under -->
         <User Name="Customer1" />
         <User Name="MyDefaultAccount" AccountType="NetworkService" />
      </Users>
   </Principals>
   <Policies>
      <DefaultRunAsPolicy UserRef="LocalAdmin" />
   </Policies>
   <Certificates>
     <EndpointCertificate Name="Cert1" X509FindValue="FF EE E0 TT JJ DD JJ EE EE XX 23 4T 66 "/>
  </Certificates>
</ApplicationManifest>
```


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
* [Understand the application model](service-fabric-application-model.md)
* [Specify resources in a service manifest](service-fabric-service-manifest-resources.md)
* [Deploy an application](service-fabric-deploy-remove-applications.md)

[image1]: ./media/service-fabric-application-runas-security/copy-to-output.png
