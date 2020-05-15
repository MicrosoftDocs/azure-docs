---
title: Run Startup Tasks in Azure Cloud Services | Microsoft Docs
description: Startup tasks help prepare your cloud service environment for your app. This teaches you how startup tasks work and how to make them
services: cloud-services
author: tgore03
ms.service: cloud-services
ms.topic: article
ms.date: 07/05/2017
ms.author: tagore

---
# How to configure and run startup tasks for a cloud service
You can use startup tasks to perform operations before a role starts. Operations that you might want to perform include installing a component, registering COM components, setting registry keys, or starting a long running process.

> [!NOTE]
> Startup tasks are not applicable to Virtual Machines, only to Cloud Service Web and Worker roles.
> 
> 

## How startup tasks work
Startup tasks are actions that are taken before your roles begin and are defined in the [ServiceDefinition.csdef] file by using the [Task] element within the [Startup] element. Frequently startup tasks are batch files, but they can also be console applications, or batch files that start PowerShell scripts.

Environment variables pass information into a startup task, and local storage can be used to pass information out of a startup task. For example, an environment variable can specify the path to a program you want to install, and files can be written to local storage that can then be read later by your roles.

Your startup task can log information and errors to the directory specified by the **TEMP** environment variable. During the startup task, the **TEMP** environment variable resolves to the 
*C:\\Resources\\temp\\[guid].[rolename]\\RoleTemp* directory when running on the cloud.

Startup tasks can also be executed several times between reboots. For example, the startup task will be run each time the role recycles, and role recycles may not always include a reboot. Startup tasks should be written in a way that allows them to run several times without problems.

Startup tasks must end with an **errorlevel** (or exit code) of zero for the startup process to complete. If a startup task ends with a non-zero **errorlevel**, the role will not start.

## Role startup order
The following lists the role startup procedure in Azure:

1. The instance is marked as **Starting** and does not receive traffic.
2. All startup tasks are executed according to their **taskType** attribute.
   
   * The **simple** tasks are executed synchronously, one at a time.
   * The **background** and **foreground** tasks are started asynchronously, parallel to the startup task.  
     
     > [!WARNING]
     > IIS may not be fully configured during the startup task stage in the startup process, so role-specific data may not be available. Startup tasks that require role-specific data should use [Microsoft.WindowsAzure.ServiceRuntime.RoleEntryPoint.OnStart](/previous-versions/azure/reference/ee772851(v=azure.100)).
     > 
     > 
3. The role host process is started and the site is created in IIS.
4. The [Microsoft.WindowsAzure.ServiceRuntime.RoleEntryPoint.OnStart](/previous-versions/azure/reference/ee772851(v=azure.100)) method is called.
5. The instance is marked as **Ready** and traffic is routed to the instance.
6. The [Microsoft.WindowsAzure.ServiceRuntime.RoleEntryPoint.Run](/previous-versions/azure/reference/ee772746(v=azure.100)) method is called.

## Example of a startup task
Startup tasks are defined in the [ServiceDefinition.csdef] file, in the **Task** element. The **commandLine** attribute specifies the name and parameters of the startup batch file or console command, the **executionContext** attribute specifies the privilege level of the startup task, and the **taskType** attribute specifies how the task will be executed.

In this example, an environment variable, **MyVersionNumber**, is created for the startup task and set to the value "**1.0.0.0**".

**ServiceDefinition.csdef**:

```xml
<Startup>
    <Task commandLine="Startup.cmd" executionContext="limited" taskType="simple" >
        <Environment>
            <Variable name="MyVersionNumber" value="1.0.0.0" />
        </Environment>
    </Task>
</Startup>
```

In the following example, the **Startup.cmd** batch file writes the line "The current version is 1.0.0.0" to the StartupLog.txt file in the directory specified by the TEMP environment variable. The `EXIT /B 0` line ensures that the startup task ends with an **errorlevel** of zero.

```cmd
ECHO The current version is %MyVersionNumber% >> "%TEMP%\StartupLog.txt" 2>&1
EXIT /B 0
```

> [!NOTE]
> In Visual Studio, the **Copy to Output Directory** property for your startup batch file should be set to **Copy Always** to be sure that your startup batch file is properly deployed to your project on Azure (**approot\\bin** for Web roles, and **approot** for worker roles).
> 
> 

## Description of task attributes
The following describes the attributes of the **Task** element in the [ServiceDefinition.csdef] file:

**commandLine** - Specifies the command line for the startup task:

* The command, with optional command line parameters, which begins the startup task.
* Frequently this is the filename of a .cmd or .bat batch file.
* The task is relative to the AppRoot\\Bin folder for the deployment. Environment variables are not expanded in determining the path and file of the task. If environment expansion is required, you can create a small .cmd script that calls your startup task.
* Can be a console application or a batch file that starts a [PowerShell script](cloud-services-startup-tasks-common.md#create-a-powershell-startup-task).

**executionContext** - Specifies the privilege level for the startup task. The privilege level can be limited or elevated:

* **limited**  
  The startup task runs with the same privileges as the role. When the **executionContext** attribute for the [Runtime] element is also **limited**, then user privileges are used.
* **elevated**  
  The startup task runs with administrator privileges. This allows startup tasks to install programs, make IIS configuration changes, perform registry changes, and other administrator level tasks, without increasing the privilege level of the role itself.  

> [!NOTE]
> The privilege level of a startup task does not need to be the same as the role itself.
> 
> 

**taskType** - Specifies the way a startup task is executed.

* **simple**  
  Tasks are executed synchronously, one at a time, in the order specified in the [ServiceDefinition.csdef] file. When one **simple** startup task ends with an **errorlevel** of zero, the next **simple** startup task is executed. If there are no more **simple** startup tasks to execute, then the role itself will be started.   
  
  > [!NOTE]
  > If the **simple** task ends with a non-zero **errorlevel**, the instance will be blocked. Subsequent **simple** startup tasks, and the role itself, will not start.
  > 
  > 
  
    To ensure that your batch file ends with an **errorlevel** of zero, execute the command `EXIT /B 0` at the end of your batch file process.
* **background**  
  Tasks are executed asynchronously, in parallel with the startup of the role.
* **foreground**  
  Tasks are executed asynchronously, in parallel with the startup of the role. The key difference between a **foreground** and a **background** task is that a **foreground** task prevents the role from recycling or shutting down until the task has ended. The **background** tasks do not have this restriction.

## Environment variables
Environment variables are a way to pass information to a startup task. For example, you can put the path to a blob that contains a program to install, or port numbers that your role will use, or settings to control features of your startup task.

There are two kinds of environment variables for startup tasks; static environment variables and environment variables based on members of the [RoleEnvironment] class. Both are in the [Environment] section of the [ServiceDefinition.csdef] file, and both use the [Variable] element and **name** attribute.

Static environment variables uses the **value** attribute of the [Variable] element. The example above creates the environment variable **MyVersionNumber** which has a static value of "**1.0.0.0**". Another example would be to create a **StagingOrProduction** environment variable which you can manually set to values of "**staging**" or "**production**" to perform different startup actions based on the value of the **StagingOrProduction** environment variable.

Environment variables based on members of the RoleEnvironment class do not use the **value** attribute of the [Variable] element. Instead, the [RoleInstanceValue] child element, with the appropriate **XPath** attribute value, are used to create an environment variable based on a specific member of the [RoleEnvironment] class. Values for the **XPath** attribute to access various [RoleEnvironment] values can be found [here](cloud-services-role-config-xpath.md).

For example, to create an environment variable that is "**true**" when the instance is running in the compute emulator, and "**false**" when running in the cloud, use the following [Variable] and [RoleInstanceValue] elements:

```xml
<Startup>
    <Task commandLine="Startup.cmd" executionContext="limited" taskType="simple">
        <Environment>

            <!-- Create the environment variable that informs the startup task whether it is running
                in the Compute Emulator or in the cloud. "%ComputeEmulatorRunning%"=="true" when
                running in the Compute Emulator, "%ComputeEmulatorRunning%"=="false" when running
                in the cloud. -->

            <Variable name="ComputeEmulatorRunning">
                <RoleInstanceValue xpath="/RoleEnvironment/Deployment/@emulated" />
            </Variable>

        </Environment>
    </Task>
</Startup>
```

## Next steps
Learn how to perform some [common startup tasks](cloud-services-startup-tasks-common.md) with your Cloud Service.

[Package](cloud-services-model-and-package.md) your Cloud Service.  

[ServiceDefinition.csdef]: cloud-services-model-and-package.md#csdef
[Task]: https://msdn.microsoft.com/library/azure/gg557552.aspx#Task
[Startup]: https://msdn.microsoft.com/library/azure/gg557552.aspx#Startup
[Runtime]: https://msdn.microsoft.com/library/azure/gg557552.aspx#Runtime
[Environment]: https://msdn.microsoft.com/library/azure/gg557552.aspx#Environment
[Variable]: https://msdn.microsoft.com/library/azure/gg557552.aspx#Variable
[RoleInstanceValue]: https://msdn.microsoft.com/library/azure/gg557552.aspx#RoleInstanceValue
[RoleEnvironment]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.serviceruntime.roleenvironment.aspx



