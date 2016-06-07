<properties
   pageTitle="Install .NET on a Cloud Service Role | Microsoft Azure"
   description="This article describes how to manually install .NET framework on Cloud Service Web and Worker Roles"
   services="cloud-services"
   documentationCenter=".net"
   authors="thraka"
   manager="timlt"
   editor=""/>

<tags
   ms.service="cloud-services"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/17/2016"
   ms.author="adegeo"/>

# Install .NET on a Cloud Service Role 

This article describes how to install .NET framework on Cloud Service Web and Worker Roles. You can use these steps to install .NET 4.6.1 on the Azure Guest OS Family 4. For the latest information on Guest OS releases see [Azure Guest OS Releases and SDK Compatibility Matrix](cloud-services-guestos-update-matrix.md).

The  process of installing .NET on your web and worker roles involves including the .NET installer package as part of your Cloud Project and launching the installer as part of the role's startup tasks.  

## Add the .NET installer to your project
- Download the the web installer for the .NET framework you want to install
	- [.NET 4.6.1 Web Installer](http://go.microsoft.com/fwlink/?LinkId=671729)
- For a Web Role
  1. In **Solution Explorer**, under In **Roles** in the cloud service project right click on your role and select **Add>New Folder**. Create a folder named *bin*
  2. Right click on the **bin** folder and select **Add>Existing Item**. Select the .NET installer and add it to the bin folder.
- For a Worker Role
  1. Right click on your role and select **Add>Existing Item**. Select the .NET installer and add it to the role. 

Files added this way to the Role Content Folder will automatically be added to the cloud service package and deployed to a consistent location on the virtual machine. Repeat this process for all web and worker roles in your Cloud Service so all roles have a copy of the installer.

> [AZURE.NOTE] You should install .NET 4.6.1 on your Cloud Service role even if your application targets .NET 4.6. The Azure Guest OS includes updates [3098779](https://support.microsoft.com/kb/3098779) and [3097997](https://support.microsoft.com/kb/3097997). Installing .NET 4.6 on top of these updates may cause issues when running your .NET applications, so you should directly install .NET 4.6.1 instead of .NET 4.6. For more information, see [KB 3118750](https://support.microsoft.com/kb/3118750).

![Role Contents with installer files][1]

## Define startup tasks for your roles
Startup tasks allow you to perform operations before a role starts. Installing the .NET Framework as part of the startup task will ensure that the framework is installed before any of your application code is run. For more information on startup tasks see: [Run Startup Tasks in Azure](cloud-services-startup-tasks.md). 

1. Add the following to the *ServiceDefinition.csdef* file under the **WebRole** or **WorkerRole** node for all roles:
	
	```xml
	<LocalResources>
      <LocalStorage name="NETFXInstall" sizeInMB="1024" cleanOnRoleRecycle="false" />
    </LocalResources>    
	<Startup>
      <Task commandLine="install.cmd" executionContext="elevated" taskType="simple">
        <Environment>
          <Variable name="PathToNETFXInstall">
            <RoleInstanceValue xpath="/RoleEnvironment/CurrentInstance/LocalResources/LocalResource[@name='NETFXInstall']/@path" />
          </Variable>
          <Variable name="ComputeEmulatorRunning">
            <RoleInstanceValue xpath="/RoleEnvironment/Deployment/@emulated" />
          </Variable>
        </Environment>
      </Task>
    </Startup>
	```

	The above configuration will run the console command *install.cmd* with administrator privileges so it can install the .NET framework. The configuration also creates a LocalStorage with the name *NETFXInstall*. The startup script will set the temp folder to use this local storage resource so that the .NET framework installer will be downloaded and installed from this resource. It is important to set the size of this resource to at least 1024MB to ensure the framework will install correctly. For more information about startup tasks see: [Common Cloud Service startup tasks](cloud-services-startup-tasks-common.md) 

2. Create a file **install.cmd** and add it to all roles by right click on the role and selecting **Add>Existing Item...**. So all roles should now have the .NET installer file as well as the install.cmd file.
	
	![Role Contents with all files][2]

	> [AZURE.NOTE] Use a simple text editor like notepad to create this file. If you use Visual Studio to create a text file and then rename it to '.cmd' the file may still contain a UTF-8 Byte Order Mark and running the first line of the script will result in an error. If you were to use Visual Studio to create the file leave add a REM (Remark) to the first line of the file so that it is ignored when run. 

3. Add the following script to the **install.cmd** file:

	```
	REM Set the value of netfx to install appropriate .NET Framework. 
	REM ***** To install .NET 4.5.2 set the variable netfx to "NDP452" *****
	REM ***** To install .NET 4.6 set the variable netfx to "NDP46" *****
	REM ***** To install .NET 4.6.1 set the variable netfx to "NDP461" *****
	set netfx="NDP461"
	
	
	REM ***** Set script start timestamp *****
	set timehour=%time:~0,2%
	set timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%-%timehour: =0%%time:~3,2%
	set "log=install.cmd started %timestamp%."
	
	REM ***** Exit script if running in Emulator *****
	if %ComputeEmulatorRunning%=="true" goto exit
	
	REM ***** Needed to correctly install .NET 4.6.1, otherwise you may see an out of disk space error *****
	set TMP=%PathToNETFXInstall%
	set TEMP=%PathToNETFXInstall%
	
	REM ***** Setup .NET filenames and registry keys *****
	if %netfx%=="NDP461" goto NDP461
	if %netfx%=="NDP46" goto NDP46
	    set "netfxinstallfile=NDP452-KB2901954-Web.exe"
	    set netfxregkey="0x5cbf5"
	    goto logtimestamp
	
	:NDP46
	set "netfxinstallfile=NDP46-KB3045560-Web.exe"
	set netfxregkey="0x60051"
	goto logtimestamp
	
	:NDP461
	set "netfxinstallfile=NDP461-KB3102438-Web.exe"
	set netfxregkey="0x6041f"
	
	:logtimestamp
	REM ***** Setup LogFile with timestamp *****
	md "%PathToNETFXInstall%\log"
	set startuptasklog="%PathToNETFXInstall%log\startuptasklog-%timestamp%.txt"
	set netfxinstallerlog="%PathToNETFXInstall%log\NetFXInstallerLog-%timestamp%"
	echo %log% >> %startuptasklog%
	echo Logfile generated at: %startuptasklog% >> %startuptasklog%
	echo TMP set to: %TMP% >> %startuptasklog%
	echo TEMP set to: %TEMP% >> %startuptasklog%
	
	REM ***** Check if .NET is installed *****
	echo Checking if .NET (%netfx%) is installed >> %startuptasklog%
	reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full" /v Release | Find %netfxregkey%
	if %ERRORLEVEL%== 0 goto installed
	
	REM ***** Installing .NET *****
	echo Installing .NET with commandline: start /wait %~dp0%netfxinstallfile% /q /serialdownload /log %netfxinstallerlog%  /chainingpackage "CloudService Startup Task" >> %startuptasklog%
	start /wait %~dp0%netfxinstallfile% /q /serialdownload /log %netfxinstallerlog% /chainingpackage "CloudService Startup Task" >> %startuptasklog% 2>>&1
	if %ERRORLEVEL%== 0 goto installed
		echo .NET installer exited with code %ERRORLEVEL% >> %startuptasklog%	
		if %ERRORLEVEL%== 3010 goto restart
		if %ERRORLEVEL%== 1641 goto restart
		echo .NET (%netfx%) install failed with Error Code %ERRORLEVEL%. Further logs can be found in %netfxinstallerlog% >> %startuptasklog%
	
	:restart
	echo Restarting to complete .NET (%netfx%) installation >> %startuptasklog%
	goto end
	
	:installed
	echo .NET (%netfx%) is installed >> %startuptasklog%
	
	:end
	echo install.cmd completed: %date:~-4,4%%date:~-10,2%%date:~-7,2%-%timehour: =0%%time:~3,2% >> %startuptasklog%
	
	:exit
	EXIT /B 0
	```
		
	The install script checks whether the specified .NET framework version is already installed on the machine by querying the registry. If the .NET version is not installed then the .Net Web Installer is launched. To help troubleshoot with any issues the script will log all activity to a file named *startuptasklog-(currentdatetime).txt* stored in *InstallLogs* local storage.

	> [AZURE.NOTE] The script still shows you how to install .NET 4.5.2 or .NET 4.6 for continuity. There is no need to install .NET 4.5.2 manually as it is already available on Azure Guest OS. Instead of installing .NET 4.6 you should directly install .NET 4.6.1 due to [KB 3118750](https://support.microsoft.com/kb/3118750).
      

## Configure diagnostics to transfer the startup task logs to blob storage 
To simplify troubleshooting any install issues you can configure Azure Diagnostics to transfer any log files generated by the startup script or the .NET installer to blob storage. With this approach you can view the logs by simply downloading the log files from blob storage rather than having to remote desktop into the role.

To configure diagnostics open the *diagnostics.wadcfgx* and add the following under the **Directories** node: 

```xml 
<DataSources>
 <DirectoryConfiguration containerName="netfx-install">
  <LocalResource name="NETFXInstall" relativePath="log"/>
 </DirectoryConfiguration>
</DataSources>
```

This will configure azure diagnostics to transfer all files in the *log* directory under the *NETFXInstall* resource to the diagnostics storage account in the *netfx-install* blob container.

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

 
