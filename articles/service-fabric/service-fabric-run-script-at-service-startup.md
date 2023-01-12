---
title: Run a script when an Azure Service Fabric service starts 
description: Learn how to configure a policy for a Service Fabric service setup entry point and run a script at service start up time.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Run a service startup script as a local user or system account
Before a Service Fabric service executable starts up it may be necessary to run some configuration or setup work.  For example, configuring environment variables. You can specify a script to run before the service executable starts up in the service manifest for the service. By configuring a RunAs policy for the service setup entry point you can change which account the setup executable runs under.  A separate setup entry point allows you to run high-privileged configuration for a short period of time so the service host executable doesn't need to run with high privileges for extended periods of time.

The setup entry point (**SetupEntryPoint** in the [service manifest](service-fabric-application-and-service-manifests.md)) is a privileged entry point that by default runs with the same credentials as Service Fabric (typically the *NetworkService* account) before any other entry point. The executable that is specified by **EntryPoint** is typically the long-running service host. The **EntryPoint** executable is run after the **SetupEntryPoint** executable exits successfully. The resulting process is monitored and restarted, and begins again with **SetupEntryPoint** if it ever terminates or crashes. 

## Configure the service setup entry point
The following is a simple service manifest example for a stateless service that specifies a setup script *MySetup.bat* in the service **SetupEntryPoint**.  **Arguments** is used to pass arguments to the script when it runs.

```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="MyStatelessServicePkg"
                 Version="1.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
                 xmlns:xsd="https://www.w3.org/2001/XMLSchema"
                 xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance">
  <Description>An example service manifest.</Description>
  <ServiceTypes>
    <StatelessServiceType ServiceTypeName="MyStatelessServiceType" />
  </ServiceTypes>

  <!-- Code package is your service executable. -->
  <CodePackage Name="Code" Version="1.0.0">
    <SetupEntryPoint>
      <ExeHost>
        <Program>MySetup.bat</Program>
        <Arguments>MyValue</Arguments>
        <WorkingFolder>Work</WorkingFolder>        
      </ExeHost>
    </SetupEntryPoint>
    <EntryPoint>
      <ExeHost>
        <Program>MyStatelessService.exe</Program>
      </ExeHost>
    </EntryPoint>
  </CodePackage>

  <ConfigPackage Name="Config" Version="1.0.0" />

  <Resources>
    <Endpoints>
      <Endpoint Name="ServiceEndpoint" />
    </Endpoints>
  </Resources>
</ServiceManifest>
```
## Configure the policy for a service setup entry point
By default, the service setup entry point executable runs under the same credentials as Service Fabric (typically the *NetworkService* account).  In the application manifest, you can change the security permissions to run the startup script under a local system account or an administrator account.

### Configure the policy by using a local system account
The following application manifest example shows how to configure the service setup entry point to run under user administrator account (SetupAdminUser).

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="MyApplicationType" ApplicationTypeVersion="1.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
  <Parameters>
    <Parameter Name="MyStatelessService_InstanceCount" DefaultValue="-1" />
  </Parameters>
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="MyStatelessServicePkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
    <Policies>
      <RunAsPolicy CodePackageRef="Code" UserRef="SetupAdminUser" EntryPointType="Setup" />
    </Policies>
  </ServiceManifestImport>
  <DefaultServices>
    <Service Name="MyStatelessService" ServicePackageActivationMode="ExclusiveProcess">
      <StatelessService ServiceTypeName="MyStatelessServiceType" InstanceCount="[MyStatelessService_InstanceCount]">
        <SingletonPartition />
      </StatelessService>
    </Service>
  </DefaultServices>
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
```

First, create a **Principals** section with a user name, such as SetupAdminUser. The SetupAdminUser user account is a member of the Administrators system group.

Next, under the **ServiceManifestImport** section, configure a policy to apply this principal to **SetupEntryPoint**. This policy tells Service Fabric that when the **MySetup.bat** file is run it should run as SetupAdminUser ( with administrator privileges). Since you have *not* applied a policy to the main entry point, the code in **MyServiceHost.exe** runs under the system **NetworkService** account. This is the default account that all service entry points are run as.

### Configure the policy by using local system accounts
Often, it's preferable to run the startup script using a local system account rather than an administrator account. Running the RunAs policy as a member of the Administrators group typically doesn’t work well because computers have User Access Control (UAC) enabled by default. In such cases, the recommendation is to run the SetupEntryPoint as LocalSystem, instead of as a local user added to Administrators group. The following example shows setting the SetupEntryPoint to run as LocalSystem:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="MyApplicationType" ApplicationTypeVersion="1.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
  <Parameters>
    <Parameter Name="MyStatelessService_InstanceCount" DefaultValue="-1" />
  </Parameters>
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="MyStatelessServicePkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
    <Policies>
         <RunAsPolicy CodePackageRef="Code" UserRef="SetupLocalSystem" EntryPointType="Setup" />
      </Policies>
  </ServiceManifestImport>
  <DefaultServices>
    <Service Name="MyStatelessService" ServicePackageActivationMode="ExclusiveProcess">
      <StatelessService ServiceTypeName="MyStatelessServiceType" InstanceCount="[MyStatelessService_InstanceCount]">
        <SingletonPartition />
      </StatelessService>
    </Service>
  </DefaultServices>
  <Principals>
      <Users>
         <User Name="SetupLocalSystem" AccountType="LocalSystem" />
      </Users>
   </Principals>
</ApplicationManifest>
```

> [!NOTE]
> For Linux clusters, to run a service or the setup entry point as **root**, you can specify the  **AccountType** as **LocalSystem**.

## Run a script from the setup entry point
Now add a start up script to the project to run under administrator privileges. 

In Visual Studio, right-click the service project and add a new file called *MySetup.bat*.

Next, ensure that the *MySetup.bat* file is included in the service package. By default, it is not. Select the file, right-click to get the context menu, and choose **Properties**. In the Properties dialog box, ensure that **Copy to Output Directory** is set to **Copy if newer**. See the following screenshot.

![Visual Studio CopyToOutput for SetupEntryPoint batch file][image1]

Now edit the *MySetup.bat* file and add the following commands set a system environment variable and output a text file:

```
REM Set a system environment variable. This requires administrator privilege
setx -m TestVariable %*
echo System TestVariable set to > out.txt
echo %TestVariable% >> out.txt

REM To delete this system variable us
REM REG delete "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v TestVariable /f
```

Next, build and deploy the solution to a local development cluster. After the service has started, as shown in [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md), you can see that the MySetup.bat file was successful in a two ways. Open a PowerShell command prompt and type:

```
PS C:\ [Environment]::GetEnvironmentVariable("TestVariable","Machine")
MyValue
```

Then, note the name of the node where the service was deployed and started in [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md). For example, Node 2. Next, navigate to the application instance work folder to find the out.txt file that shows the value of **TestVariable**. For example, if this service was deployed to Node 2, then you can go to this path for the **MyApplicationType**:

```
C:\SfDevCluster\Data\_App\Node.2\MyApplicationType_App\work\out.txt
```

## Run PowerShell commands from a setup entry point
To run PowerShell from the **SetupEntryPoint** point, you can run **PowerShell.exe** in a batch file that points to a PowerShell file. First, add a PowerShell file to the service project--for example, **MySetup.ps1**. Remember to set the *Copy if newer* property so that the file is also included in the service package. The following example shows a sample batch file that starts a PowerShell file called MySetup.ps1, which sets a system environment variable called **TestVariable**.

MySetup.bat to start a PowerShell file:

```
powershell.exe -ExecutionPolicy Bypass -Command ".\MySetup.ps1"
```

In the PowerShell file, add the following to set a system environment variable:

```
[Environment]::SetEnvironmentVariable("TestVariable", "MyValue", "Machine")
[Environment]::GetEnvironmentVariable("TestVariable","Machine") > out.txt
```

> [!NOTE]
> By default, when the batch file runs, it looks at the application folder called **work** for files. In this case, when MySetup.bat runs, we want this to find the MySetup.ps1 file in the same folder, which is the application **code package** folder. To change this folder, set the working folder:
> 
> 

```xml
<SetupEntryPoint>
    <ExeHost>
    <Program>MySetup.bat</Program>
    <WorkingFolder>CodePackage</WorkingFolder>
    </ExeHost>
</SetupEntryPoint>
```

## Debug a startup script locally using console redirection
Occasionally, it's useful for debugging purposes to see the console output from running a setup script. You can set a console redirection policy on the setup entry point in the service manifest, which writes the output to a file. The file output is written to the application folder called **log** on the cluster node where the application is deployed and run, found in `C:\SfDeployCluster\_App\{application-name}\log`. You may see a number after your applications name in the path. This number increments on each deployment. The files written to the log folder include Code_{service-name}Pkg_S_0.err, which is the standard error output, and Code_{service-name}Pkg_S_0.out, which is the standard output. You may see more than one set of files depending on service activation attempts.

> [!WARNING]
> Never use the console redirection policy in an application that is deployed in production because this can affect the application failover. *Only* use this for local development and debugging purposes.  
> 
> 

The following service manifest example shows setting the console redirection with a FileRetentionCount value:

```xml
<SetupEntryPoint>
    <ExeHost>
    <Program>MySetup.bat</Program>
    <WorkingFolder>CodePackage</WorkingFolder>
    <ConsoleRedirection FileRetentionCount="10"/>
    </ExeHost>
</SetupEntryPoint>
```

If you now change the MySetup.ps1 file to write an **Echo** command, this will write to the output file for debugging purposes:

```
Echo "Test console redirection which writes to the application log folder on the node that the application is deployed to"
```

> [!WARNING]
> After you debug your script, immediately remove this console redirection policy.



<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
* [Learn about application and service security](service-fabric-application-and-service-security.md)
* [Understand the application model](service-fabric-application-model.md)
* [Specify resources in a service manifest](service-fabric-service-manifest-resources.md)
* [Deploy an application](service-fabric-deploy-remove-applications.md)

[image1]: ./media/service-fabric-application-runas-security/copy-to-output.png
