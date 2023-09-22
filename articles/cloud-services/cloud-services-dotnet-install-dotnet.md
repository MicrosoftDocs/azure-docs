---
title: Install .NET on Azure Cloud Services (classic) roles
description: This article describes how to manually install the .NET Framework on your cloud service web and worker roles.
ms.topic: article
ms.service: cloud-services
ms.date: 02/21/2023
author: hirenshah1
ms.author: hirshah
ms.reviewer: mimckitt
ms.custom: compute-evergreen, devx-track-dotnet
---

# Install .NET on Azure Cloud Services (classic) roles

[!INCLUDE [Cloud Services (classic) deprecation announcement](includes/deprecation-announcement.md)]

This article describes how to install versions of .NET Framework that don't come with the Azure Guest OS. You can use .NET on the Guest OS to configure your cloud service web and worker roles.

For example, you can install .NET Framework 4.6.2 on the Guest OS family 4, which doesn't come with any release of .NET Framework 4.6. (The Guest OS family 5 does come with .NET Framework 4.6.) For the latest information on the Azure Guest OS releases, see the [Azure Guest OS release news](cloud-services-guestos-update-matrix.md). 

>[!IMPORTANT]
>The Azure SDK 2.9 contains a restriction on deploying .NET Framework 4.6 on the Guest OS family 4 or earlier. A fix for the restriction is available in the [`azure-cloud-services-files` GitHub repo](https://github.com/MicrosoftDocs/azure-cloud-services-files/tree/master/Azure%20Targets%20SDK%202.9).

To install .NET on your web and worker roles, include the .NET web installer as part of your cloud service project. Start the installer as part of the role's startup tasks. 

## Add the .NET installer to your project
To download the web installer for the .NET Framework, choose the version that you want to install:

* [.NET Framework 4.8.1 web installer](https://go.microsoft.com/fwlink/?linkid=2215256)
* [.NET Framework 4.8 Web installer](https://go.microsoft.com/fwlink/?LinkId=2150985)
* [.NET Framework 4.7.2 web installer](https://go.microsoft.com/fwlink/?LinkId=863262)
* [.NET Framework 4.6.2 web installer](https://dotnet.microsoft.com/download/dotnet-framework/net462)

To add the installer for a *web* role:
  1. In **Solution Explorer**, under **Roles** in your cloud service project, right-click your *web* role and select **Add** > **New Folder**. Create a folder named **bin**.
  2. Right-click the bin folder and select **Add** > **Existing Item**. Select the .NET installer and add it to the bin folder.
  
To add the installer for a *worker* role:
* Right-click your *worker* role and select **Add** > **Existing Item**. Select the .NET installer and add it to the role. 

When files are added in this way to the role content folder, they're automatically added to your cloud service package. The files are then deployed to a consistent location on the virtual machine. Repeat this process for each web and worker role in your cloud service so that all roles have a copy of the installer.

> [!NOTE]
> You should install .NET Framework 4.6.2 on your cloud service role even if your application targets .NET Framework 4.6. The Guest OS includes the Knowledge Base [update 3098779](https://support.microsoft.com/kb/3098779) and [update 3097997](https://support.microsoft.com/kb/3097997). Issues can occur when you run your .NET applications if .NET Framework 4.6 is installed on top of the Knowledge Base updates. To avoid these issues, install .NET Framework 4.6.2 rather than version 4.6. For more information, see the [Knowledge Base article 3118750](https://support.microsoft.com/kb/3118750) and [4340191](https://support.microsoft.com/kb/4340191).
> 
> 

![Role contents with installer files][1]

## Define startup tasks for your roles
You can use startup tasks to perform operations before a role starts. Installing the .NET Framework as part of the startup task ensures that the framework is installed before any application code is run. For more information on startup tasks, see [Run startup tasks in Azure](cloud-services-startup-tasks.md). 

1. Add the following content to the ServiceDefinition.csdef file under the **WebRole** or **WorkerRole** node for all roles:
   
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
   
    The preceding configuration runs the console command `install.cmd` with administrator privileges to install the .NET Framework. The configuration also creates a **LocalStorage** element named **NETFXInstall**. The startup script sets the temp folder to use this local storage resource. 
    
    > [!IMPORTANT]
    > To ensure correct installation of the framework, set the size of this resource to at least 1,024 MB.
    
    For more information about startup tasks, see [Common Azure Cloud Services startup tasks](cloud-services-startup-tasks-common.md).

2. Create a file named **install.cmd** and add the following install script to the file.

   The script checks whether the specified version of the .NET Framework is already installed on the machine by querying the registry. If the .NET Framework version is not installed, then the .NET Framework web installer is opened. To help troubleshoot any issues, the script logs all activity to the file startuptasklog-(current date and time).txt that is stored in **InstallLogs** local storage.
   
   > [!IMPORTANT]
   > Use a basic text editor like Windows Notepad to create the install.cmd file. If you use Visual Studio to create a text file and change the extension to .cmd, the file might still contain a UTF-8 byte order mark. This mark can cause an error when the first line of the script is run. To avoid this error, make the first line of the script a REM statement that can be skipped by the byte order processing. 
   > 
   >
   
   ```cmd
   REM Set the value of netfx to install appropriate .NET Framework. 
   REM ***** To install .NET 4.5.2 set the variable netfx to "NDP452" ***** https://go.microsoft.com/fwlink/?LinkId=397707
   REM ***** To install .NET 4.6 set the variable netfx to "NDP46" ***** https://go.microsoft.com/fwlink/?LinkId=528222
   REM ***** To install .NET 4.6.1 set the variable netfx to "NDP461" ***** https://go.microsoft.com/fwlink/?LinkId=671729
   REM ***** To install .NET 4.6.2 set the variable netfx to "NDP462" ***** https://go.microsoft.com/fwlink/?linkid=780596
   REM ***** To install .NET 4.7 set the variable netfx to "NDP47" ***** https://go.microsoft.com/fwlink/?LinkId=825298
   REM ***** To install .NET 4.7.1 set the variable netfx to "NDP471" ***** https://go.microsoft.com/fwlink/?LinkId=852095
   REM ***** To install .NET 4.7.2 set the variable netfx to "NDP472" ***** https://go.microsoft.com/fwlink/?LinkId=863262
   REM ***** To install .NET 4.8 set the variable netfx to "NDP48" ***** https://dotnet.microsoft.com/download/thank-you/net48
   REM ***** To install .NET 4.8.1 set the variable netfx to "NDP481" ***** https://go.microsoft.com/fwlink/?linkid=2215256 
   set netfx="NDP481"
         
   REM ***** Set script start timestamp ****
   set timehour=%time:~0,2%
   set timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%-%timehour: =0%%time:~3,2%
   set "log=install.cmd started %timestamp%."
   
   REM ***** Exit script if running in Emulator *****
   if "%ComputeEmulatorRunning%"=="true" goto exit
   
   REM ***** Needed to correctly install .NET 4.6.1, otherwise you may see an out of disk space error *****
   set TMP=%PathToNETFXInstall%
   set TEMP=%PathToNETFXInstall%
   
   REM ***** Setup .NET filenames and registry keys *****
   if %netfx%=="NDP481" goto NDP481
   if %netfx%=="NDP48" goto NDP48
   if %netfx%=="NDP472" goto NDP472
   if %netfx%=="NDP471" goto NDP471
   if %netfx%=="NDP47" goto NDP47
   if %netfx%=="NDP462" goto NDP462
   if %netfx%=="NDP461" goto NDP461
   if %netfx%=="NDP46" goto NDP46
   
   set "netfxinstallfile=NDP452-KB2901954-Web.exe"
   set netfxregkey="0x5cbf5"
   set netfxUrl="https://go.microsoft.com/fwlink/?LinkId=397707"
   goto logtimestamp
   
   :NDP46
   set "netfxinstallfile=NDP46-KB3045560-Web.exe"
   set netfxregkey="0x6004f"
   set netfxUrl="https://go.microsoft.com/fwlink/?LinkId=528222"
   goto logtimestamp
   
   :NDP461
   set "netfxinstallfile=NDP461-KB3102438-Web.exe"
   set netfxregkey="0x6040e"
   set netfxUrl="https://go.microsoft.com/fwlink/?LinkId=671729"
   goto logtimestamp
   
   :NDP462
   set "netfxinstallfile=NDP462-KB3151802-Web.exe"
   set netfxregkey="0x60632"
   set netfxUrl="https://go.microsoft.com/fwlink/?linkid=780596"
   goto logtimestamp
   
   :NDP47
   set "netfxinstallfile=NDP47-KB3186500-Web.exe"
   set netfxregkey="0x707FE"
   set netfxUrl="https://go.microsoft.com/fwlink/?LinkId=825298"
   goto logtimestamp
   
   :NDP471
   set "netfxinstallfile=NDP471-KB4033344-Web.exe"
   set netfxregkey="0x709fc"
   set netfxUrl="https://go.microsoft.com/fwlink/?LinkId=852095"
   goto logtimestamp
   
   :NDP472
   set "netfxinstallfile=NDP472-KB4054531-Web.exe"
   set netfxregkey="0x70BF0"
   set netfxUrl="https://go.microsoft.com/fwlink/?LinkId=863262"
   goto logtimestamp

   :NDP48
   set "netfxinstallfile=NDP48-Web.exe"
   set netfxregkey="0x80EA8"
   set netfxUrl="https://dotnet.microsoft.com/download/thank-you/net48"
   goto logtimestamp
   
   :NDP481
   set "netfxinstallfile=NDP481-Web.exe"
   set netfxregkey="0x82348"
   set netfxUrl="https://go.microsoft.com/fwlink/?linkid=2215256"
   goto logtimestamp
   
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
   set /A netfxregkeydecimal=%netfxregkey%
   set foundkey=0
   FOR /F "usebackq skip=2 tokens=1,2*" %%A in (`reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full" /v Release 2^>nul`) do @set /A foundkey=%%C
   echo Minimum required key: %netfxregkeydecimal% -- found key: %foundkey% >> %startuptasklog%
   if %foundkey% GEQ %netfxregkeydecimal% goto installed

   REM ***** Downloading .NET Framework Setup *****
   set retryCount=0
   set maxRetry=3
   set delayInSeconds=60
   echo Downloading .NET Framework %netfx% setup with commandline: powershell -Command "Invoke-WebRequest %netfxUrl% -OutFile %~dp0%netfxinstallfile%" >> %startuptasklog%
   goto loop

   :loop
   if %retryCount% NEQ 0 echo %date% %time% : Waiting %delayInSeconds% seconds to retry >> %startuptasklog%
   if %retryCount% NEQ 0 (powershell -Command "Start-Sleep -Seconds %delayInSeconds%")
   set /a retryCount=%retryCount%+1
   echo %date% %time% : Try downloading... [%retryCount% of %maxRetry%] >> %startuptasklog%
   powershell -Command "Invoke-WebRequest %netfxUrl% -OutFile %~dp0%netfxinstallfile%"
   if %ERRORLEVEL% NEQ 0 if %retryCount% NEQ %maxRetry% goto loop
   if %ERRORLEVEL% NEQ 0 if %retryCount%== %maxRetry% echo Taking existing file to install since error occurred while downloading .NET framework %netfx% setup from  %netfxUrl%. >> %startuptasklog%
   if %ERRORLEVEL%== 0 echo %date% %time% : Successfully downloaded .NET framework %netfx% setup file. >> %startuptasklog%
   goto install

   install:
   REM ***** Installing .NET *****
   echo Installing .NET with commandline: start /wait %~dp0%netfxinstallfile% /q /serialdownload /log %netfxinstallerlog%  /chainingpackage "CloudService Startup Task" >> %startuptasklog%
   start /wait %~dp0%netfxinstallfile% /q /serialdownload /log %netfxinstallerlog% /chainingpackage "CloudService Startup Task" >> %startuptasklog% 2>>&1
   if %ERRORLEVEL%== 0 goto installed
       echo .NET installer exited with code %ERRORLEVEL% >> %startuptasklog%    
       if %ERRORLEVEL%== 3010 goto restart
       if %ERRORLEVEL%== 1641 goto restart
       echo .NET (%netfx%) install failed with Error Code %ERRORLEVEL%. Further logs can be found in %netfxinstallerlog% >> %startuptasklog%
       goto exit
       
   :restart
   echo Restarting to complete .NET (%netfx%) installation >> %startuptasklog%
   shutdown.exe /r /t 5 /c "Installed .NET framework" /f /d p:2:4
   
   :installed
   echo .NET (%netfx%) is installed >> %startuptasklog%
   
   :end
   echo install.cmd completed: %date:~-4,4%%date:~-10,2%%date:~-7,2%-%timehour: =0%%time:~3,2% >> %startuptasklog%
   
   :exit
   EXIT /B 0
   ```

3. Add the install.cmd file to each role by using **Add** > **Existing Item** in **Solution Explorer** as described earlier in this topic. 

    After this step is complete, all roles should have the .NET installer file and the install.cmd file.

   ![Role contents with all files][2]

## Configure Diagnostics to transfer startup logs to Blob storage
To simplify troubleshooting installation issues, you can configure Azure Diagnostics to transfer any log files generated by the startup script or the .NET installer to Azure Blob storage. By using this approach, you can view the logs by downloading the log files from Blob storage rather than having to remote desktop into the role.


To configure Diagnostics, open the diagnostics.wadcfgx file and add the following content under the **Directories** node: 

```xml 
<DataSources>
 <DirectoryConfiguration containerName="netfx-install">
  <LocalResource name="NETFXInstall" relativePath="log"/>
 </DirectoryConfiguration>
</DataSources>
```

This XML configures Diagnostics to transfer the files in the log directory in the **NETFXInstall** resource to the Diagnostics storage account in the **netfx-install** blob container.

## Deploy your cloud service
When you deploy your cloud service, the startup tasks install the .NET Framework if it's not already installed. Your cloud service roles are in the *busy* state while the framework is being installed. If the framework installation requires a restart, the service roles might also restart. 

## Additional resources
* [Installing the .NET Framework][Installing the .NET Framework]
* [Determine which .NET Framework versions are installed][How to: Determine Which .NET Framework Versions Are Installed]
* [Troubleshooting .NET Framework installations][Troubleshooting .NET Framework Installations]

[How to: Determine Which .NET Framework Versions Are Installed]: /dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed
[Installing the .NET Framework]: /dotnet/framework/install/guide-for-developers
[Troubleshooting .NET Framework Installations]: /dotnet/framework/install/troubleshoot-blocked-installations-and-uninstallations

<!--Image references-->
[1]: ./media/cloud-services-dotnet-install-dotnet/rolecontentwithinstallerfiles.png
[2]: ./media/cloud-services-dotnet-install-dotnet/rolecontentwithallfiles.png
