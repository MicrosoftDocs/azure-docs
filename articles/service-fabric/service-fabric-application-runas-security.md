<properties
   pageTitle="Understanding Service Fabric application RunAs security policies | Microsoft Azure"
   description="An overview of how to run a Service Fabric application under system and local security accounts including the SetupEntry point where an application needs to perform some privileged action before it starts"
   services="service-fabric"
   documentationCenter=".net"
   authors="msfussell"
   manager="timlt"
   editor="bscholl"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="11/24/2015"
   ms.author="mfussell"/>

# RunAs: Running a Service Fabric application with different security permissions
Azure Service Fabric provides the ability to secure applications running in the cluster under different user accounts, known as **RunAs**. Service Fabric also secures the resources used by the applications with the user account, such as files, directories, and certificates.

By default, Service Fabric applications run under the account that the Fabric.exe process runs under. Service Fabric also provides the capability to run applications under a local user account, specified within the application’s manifest. Supported account types for RunAs are **LocalUser**, **NetworkService**, **LocalService**, and **LocalSystem**.

> [AZURE.NOTE] Domain accounts are supported on Windows Server deployments where Azure Active Directory is available.

User groups can be defined and created that allow one or more users to be added to a group and managed together. This is particularly useful when there are multiple users for different service entry points and they need to have certain common privileges that are available at the group level.

## Setting the RunAs policy for SetupEntryPoint

As described in the [application model](service-fabric-application-model.md), **SetupEntryPoint** is a privileged entry point that runs with the same credentials as Service Fabric (typically the *network* account) before any other entry point. The executable specified by **EntryPoint** is typically the long-running service host, so having a separate setup entry point avoids having to run the service host exe with high privileges for extended periods of time. The executable specified by **EntryPoint** is run after **SetupEntryPoint** exits successfully. The resulting process is monitored and restarted (beginning again with **SetupEntryPoint**) if it ever terminates or crashes.

Below is a simple service manifest example that shows SetupEntryPoint and the main EntryPoint for the service.

~~~
<?xml version="1.0" encoding="utf-8" ?>
<ServiceManifest Name="MyServiceManifest" Version="SvcManifestVersion1" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Description>An example service manifest</Description>
  <ServiceTypes>
    <StatelessServiceType ServiceTypeName="MyServiceType" />
  </ServiceTypes>
  <CodePackage Name="Code" Version="1.0.0">
    <SetupEntryPoint>
      <ExeHost>
        <Program>MySetup.bat</Program>
      </ExeHost>
    </SetupEntryPoint>
    <EntryPoint>
      <ExeHost>
        <Program>MyServiceHost.exe</Program>
      </ExeHost>
    </EntryPoint>
  </CodePackage>
  <ConfigPackage Name="Config" Version="1.0.0" />
</ServiceManifest>
~~~

### Configuring the RunAs policy

After you configure the service to have a SetupEntryPoint, you can change the security permissions that it runs under in the application  manifest. The example below shows how to configure the service to run under administrator account privileges.

~~~
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="MyApplicationType" ApplicationTypeVersion="1.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
   <ServiceManifestImport>
      <ServiceManifestRef ServiceManifestName="MyServiceTypePkg" ServiceManifestVersion="1.0.0" />
      <ConfigOverrides />
      <Policies>
         <RunAsPolicy CodePackageRef="Code" UserRef="SetupAdminUser" EntryPointType="Setup" />
      </Policies>
   </ServiceManifestImport>
   <Principals>
      <Users>
         <User Name="SetupAdminUser">
            <MemberOf>
               <SystemGroup Name="Administrators" />
            </MemberOf>
         </User>
      </Users>
   </Principals>
</ApplicationManifest>
~~~

First, create a **Principals** section with a user name, e.g. SetupAdminUser. This indicates that the user is a member of the administrators system group.

Next, under the **ServiceManifestImport** section, configure a policy to apply this principal to **SetupEntryPoint**. This tells Service Fabric that when the MySetup.bat file is run, it should be RunAs with administrator privileges. Given that you have *not* applied a policy to the main entry point, the code in MyServiceHost.exe will run under the system NetworkService account, which is the default account that all service entry points are RunAs.

Let's now add the file MySetup.bat to the Visual Studio project to test the administrator privileges. In Visual Studio, right-click on the service project and add a new file call MySetup.bat. Next, it is necessary to ensure that this file is included in the service package. By default, it is not. To ensure that the MySetup.bat file is include in the package, select the file, right-click to get the context menu, choose **Properties**, and in the properties dialog box, ensure that **Copy to Output Directory** is set to **Copy if newer**. This is shown in the screen shot below.

![Visual Studio CopyToOutput for SetupEntryPoint batch file][image1]

Now open the MySetup.bat file and add the following commands:

~~~
REM Set a system environment variable. This requires administrator privilege
setx -m TestVariable "MyValue"
echo System TestVariable set to > test.txt
echo %TestVariable% >> test.txt

REM To delete this system variable us
REM REG delete "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v TestVariable /f
~~~

Next, build and deploy the solution to a local development cluster.  Once the service has started, as shown in the Service Fabric Explorer, you can see that the MySetup.bat file was successful in a two ways. Open a PowerShell command prompt and type:

~~~
PS C:\ [Environment]::GetEnvironmentVariable("TestVariable","Machine")
MyValue
~~~

Second, note the name of the node where the service was deployed and started in the Service Fabric Explorer, e.g. Node 1, and then navigate to the application instance work folder to find the out.txt file that shows the value of **TestVariable**. For example, if this was deployed to Node 2, then you can go to this path for MyApplicationType:

~~~
C:\SfDevCluster\Data\_App\Node.2\MyApplicationType_App\work\out.txt
~~~

##  Launching PowerShell commands from SetupEntryPoint
To run Windows PowerShell from the **SetupEntryPoint** point, you can run PowerShell.exe in a batch file pointing to a PowerShell file. First, add a PowerShell file to the service project, e.g. MySetup.ps1. Remember to set the **Copy if newer** property so that the file is also included in the service package. The example below shows a sample batch file to launch a PowerShell file called MySetup.ps1, which sets a system environment variable called *TestVariable*.

MySetup.bat to launch PowerShell file.

~~~
powershell.exe -ExecutionPolicy Bypass -Command ".\MySetup.ps1"
~~~

In the PowerShell file, add the following to set a system environment variable:

```
[Environment]::SetEnvironmentVariable("TestVariable", "MyValue", "Machine")
[Environment]::GetEnvironmentVariable("TestVariable","Machine") > out.txt
```

## Applying RunAsPolicy to services
In the steps above, you saw how to apply RunAs policy to SetupEntryPoint. Let's look a little deeper into how to create different principals that can be applied as service policies.

### Creating local user groups
User groups can be defined and created that allow one or more users to be added to a group. This is particularly useful if there are multiple users for different service entry points and they need to have certain common privileges that are available at the group level. The example below shows a local group called **LocalAdminGroup** with administrator privileges. Two users, Customer1 and Customer2, are made members of this local group.

~~~
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
~~~

### Creating local users
You can create a local user that can be used to secure a service within the application. When a **LocalUser** account type is specified in the principals section of the application manifest, Service Fabric creates local user accounts on machines where the application is deployed. By default, these accounts do not have the same names as those specified in the application manifest (for example, Customer3 in the sample below). Instead, they are dynamically generated and have random passwords.

~~~
<Principals>
  <Users>
     <User Name="Customer3" AccountType="LocalUser" />
  </Users>
</Principals>
~~~

<!-- If an application requires that the user account and password be the same on all machines (e.g. to enable NTLM authentication), the cluster manifest must set NTLMAuthenticationEnabled to true and specify an NTLMAuthenticationPasswordSecret that will be used to generate the same password across all machines.

<Section Name="Hosting">
      <Parameter Name="EndpointProviderEnabled" Value="true"/>
      <Parameter Name="NTLMAuthenticationEnabled" Value="true"/>
      <Parameter Name="NTLMAuthenticationPassworkSecret" Value="******" IsEncrypted="true"/>
 </Section>
-->

## Assigning policies to service code packages
The **RunAsPolicy** section for a **ServiceManifestImport** specifies the account from the principals section that should be used to run a code package. It also associates code packages from the service manifest with user accounts in the principals section. You can specify this for the setup and main entry points, or you can specify all to apply it to both. The example below shows different policies being applied.

~~~
<Policies>
  <RunAsPolicy CodePackageRef="Code" UserRef="LocalAdmin" EntryPointType="Setup"/>
  <RunAsPolicy CodePackageRef="Code" UserRef="Customer3" EntryPointType="Main"/>
</Policies>
~~~

If **EntryPointType** is not specified, the default is set to EntryPointType=”Main”. Specifying a **SetupEntryPoint** is especially useful when you want to run a certain high privilege setup operation under a system account, while the actual service code can run under a lower privilege account.

### Applying a default policy to all service code packages
The **DefaultRunAsPolicy** section is used to specify a default user account for all code packages that don’t have specific **RunAsPolicy** defined. If most code packages specified in service manifests used by an application need to run under the same RunAs user, the application can just define a default RunAs policy with that user account, rather than specifying a **RunAsPolicy** for every code package. The following example specifies that if a code package does not have **RunAsPolicy** specified, the code package should run under the **MyDefaultAccount** specified in the principals section.

~~~
<Policies>
  <DefaultRunAsPolicy UserRef="MyDefaultAccount"/>
</Policies>
~~~

## Assigning SecurityAccessPolicy for HTTP and HTTPS endpoints
If you apply a RunAs policy to a service, and the service manifest declares endpoint resources with the HTTTP protocol, you must specify a **SecurityAccessPolicy** to ensure that ports allocated to these endpoints are correctly access-control listed for the RunAs user account that the service runs under. Otherwise, http.sys does not have access the the service, and you will get failure with calls from the client. The example below applies the Customer3 account to an endpoint called *ServiceEndpointName*, giving it full access rights.

~~~
<Policies>
   <RunAsPolicy CodePackageRef="Code" UserRef="Customer1" />
   <!--SecurityAccessPolicy is needed if RunAsPolicy is defined and the Endpoint is http -->
   <SecurityAccessPolicy ResourceRef="EndpointName" PrincipalRef="Customer1" />
</Policies>
~~~

For the HTTPS endpoint, you also have to indicate the name of the certificate to return to the client, You can do this by using  **EndpointBindingPolicy**, with the certificate defined in a certificates section in the application manifest.

~~~
<Policies>
   <RunAsPolicy CodePackageRef="Code" UserRef="Customer1" />
  <!--SecurityAccessPolicy is needed if RunAsPolicy is defined and the Endpoint is http -->
   <SecurityAccessPolicy ResourceRef="EndpointName" PrincipalRef="Customer1" />
  <!--EndpointBindingPolicy is needed if the EndpointName is secured with https -->
  <EndpointBindingPolicy EndpointRef="EndpointName" CertificateRef="Cert1" />
</Policies
~~~


## A complete application manifest example
The application manifest below shows many of the settings described above.

~~~
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
      <DefaultRunAsPolicy UserRef="MyDefaultAccount" />
   </Policies>
   <Certificates>
	 <EndpointCertificate Name="Cert1" X509FindValue="FF EE E0 TT JJ DD JJ EE EE XX 23 4T 66 "/>
  </Certificates>
</ApplicationManifest>
~~~


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

* [Understanding the application model](service-fabric-application-model.md)
* [Specifying resources in a service manifest](service-fabric-service-manifest-resources.md)
* [Deploying an application](service-fabric-deploy-remove-applications.md)

[image1]: ./media/service-fabric-application-runas-security/copy-to-output.png
