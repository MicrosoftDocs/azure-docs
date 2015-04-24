<properties
   pageTitle="Install .NET on a Cloud Service Role"
   description="This article describes how to manually install .NET framework on Cloud Service Web and Worker Roles"
   services="cloud-services"
   documentationCenter=".net"
   authors="sbtron"
   manager="timlt"
   editor=""/>

<tags
   ms.service="cloud-services"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/23/2015"
   ms.author="saurabh"/>

# Install .NET on a Cloud Service Role 

This article describes how to install .NET framework on Cloud Service Web and Worker Roles. You can use these steps to install a version of the .NET framework that is not present on the Azure Guest OS by default. For the latest information on Guest OS releases see [Azure Guest OS Releases and SDK Compatibility Matrix](cloud-services-guestos-update-matrix.md).

The  process of installing .NET on your web and worker roles involves including the .NET installer package as part of your Cloud Project and launching the installer as part of the role's startup tasks.  

## Add the .NET installer to your project
1. Download the [.NET 4.5.2 Web Installer](http://www.microsoft.com/en-us/download/details.aspx?id=42643)
2. For a Web Role
  1. In **Solution Explorer**, under In **Roles** in the cloud service project right click on your role and select **Add>New Folder**. Create a folder named *bin*
  2. Right click on the **bin** folder and select **Add>Existing Item**. Select the .NET installer and add it to the bin folder.
3. For a Worker Role
  1. Right click on your role and select **Add>Existing Item**. Select the .NET installer and add it to the role. 

Files added this way to the Role Content Folder will automatically be added to the cloud service package and deployed to a consistent location on the virtual machine. Repeat this process for all web and worker roles in your Cloud Service so all roles have a copy of the installer.

![Role Contents with installer files][1]

## Define startup tasks for your roles
Startup tasks allow you to perform operations before a role starts. Installing the .NET Framework as part of the startup task will ensure that the framework is installed before any of your application code is run. For more information on startup tasks see: [Run Startup Tasks in Azure](https://msdn.microsoft.com/library/azure/hh180155.aspx). 

1. Add the following to the *ServiceDefinition.csdef* file under the *WebRole* or *WorkerRole* node for all roles:
	
	```xml
	 <LocalResources>
	    <LocalStorage name="InstallLogs" sizeInMB="5" cleanOnRoleRecycle="false" />
	 </LocalResources>
	 <Startup>
	    <Task commandLine="install.cmd" executionContext="elevated" taskType="simple">
	        <Environment>
	        <Variable name="PathToInstallLogs">
	        <RoleInstanceValue xpath="/RoleEnvironment/CurrentInstance/LocalResources/LocalResource[@name='InstallLogs']/@path" />
	        </Variable>
	        </Environment>
	    </Task>
	 </Startup>
	```

	The above configuration will run the console command *install.cmd* with administrator privileges so it can install the .NET framework. The configuration also creates a LocalStorage with the name *InstallLogs* to store any log information created by the install script. For more see: [Use local storage to store files during startup](https://msdn.microsoft.com/library/azure/hh974419.aspx) 

2. Create the install.cmd file with the following content:

	```
	REM install.cmd to install .NET Framework
	set timehour=%time:~0,2%
	set timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%-%timehour: =0%%time:~3,2%
	set startuptasklog=%PathToInstallLogs%\startuptasklog-%timestamp%.txt
	set netfxinstallerlog = %PathToInstallLogs%\NetFXInstallerLog-%timestamp%
	echo Logfile generated at: %startuptasklog% >> %startuptasklog%
	echo Checking if .NET 4.5.2 is installed >> %startuptasklog%
	reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full" /v Release | Find "0x5cbf5"
	if %ERRORLEVEL%== 0 goto end
	echo Installing .NET 4.5.2. Log: %netfxinstallerlog% >> %startuptasklog%
	start /wait %~dp0NDP452-KB2901954-Web.exe /q /serialdownload /log %netfxinstallerlog%
	:end
	echo install.cmd completed: %date:~-4,4%%date:~-10,2%%date:~-7,2%-%timehour: =0%%time:~3,2% >> %startuptasklog%
	```

	The install script checks whether .NET 4.5.2 is already installed on the machine by querying the registry. If .NET 4.5.2 is not installed then the .Net Web Installer launched. To help troubleshoot with any issues the script will log all activity to a file named *startuptasklog-(currentdatetime).txt* stored in *InstallLogs* local storage.

	> [AZURE.NOTE] Use a simple text editor like notepad to create this file. If you use Visual Studio to create a text file and then rename it to '.cmd' the file may still contain a UTF-8 Byte Order Mark and running the first line of the script will result in an error. If you were to use Visual Studio to create the file leave add a REM (Remark) to the first line of the file so that it is ignored when run. 
      
3. Add the install.cmd file to all roles by right click on the role and selecting **Add>Existing Item...**. So all roles should now have the .NET installer file as well as the install.cmd file.
	
	![Role Contents with all files][2] 

## Configure diagnostics to transfer the startup task logs to blob storage (Optional)
You can optionally configure Azure Diagnostics to transfer any log files generated by the startup script or the .NET installer to blob storage. With this approach you can view the logs by simply downloading the log files from blob storage rather than having to remote desktop into the role.

To configure diagnostics open the *diagnostics.wadcfgx* and add the following under the *<Directories>* node: 

```xml 
<DataSources>
    <DirectoryConfiguration containerName="netfx-install">
    <LocalResource name="InstallLogs" relativePath="."/>
    </DirectoryConfiguration>
</DataSources>
```

This will configure azure diagnostics to transfer all files in the *InstallLogs* resource to the diagnostics storage account in the *netfx-install* blob container.

## Deploying your service 
When you deploy your service the startup tasks will run and install the .NET framework if it is not already installed. Your roles will be in the busy state while the framework is installing and may even restart if the framework install requires it. 


## Additional Resources

- [Installing the .NET Framework][]
- [How to: Determine Which .NET Framework Versions Are Installed][]
- [Troubleshooting .NET Framework Installations][]

[How to: Determine Which .NET Framework Versions Are Installed]: https://msdn.microsoft.com/library/hh925568.aspx
[Installing the .NET Framework]: https://msdn.microsoft.com/library/5a4x27ek.aspx
[Troubleshooting .NET Framework Installations]: https://msdn.microsoft.com/library/hh925569.aspx

<!--Image references-->
[1]: ./media/cloud-services-dotnet-install-dotnet/rolecontentwithinstallerfiles.png
[2]: ./media/cloud-services-dotnet-install-dotnet/rolecontentwithallfiles.png

