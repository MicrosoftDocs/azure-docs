<properties
	pageTitle= "Microsoft Azure Virtual Machine support logs | Microsoft Azure"
	description="Lists the logs that may be collected during troubleshooting the Azure issues"
	services="virtual-machinesr"
	documentationCenter=""
	authors="genlin"
	manager="felixwu"
	editor=""
	/>

<tags
	ms.service="virtual-machines"
	ms.workload="na"
	ms.tgt_pltfrm="ibiza"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/01/2016"
	ms.author="genli"/>

# Microsoft Azure virtual machine support logs

In order to troubleshoot most issues that are related to Microsoft Azure, Microsoft Support may collect files from your Azure virtual machines (VMs). These files will include common log files, diagnostics information, system-generated event logs, and debug logs.

These logs are listed in the following categories of VMs:

• [Disk "Extended Information" for Windows VM](#windowslog)

• [Disk "Extended Information" for Linux VM](#linuxlog)

<a id="windowslog"></a>

## Disk "Extended Information" for Windows VM

    C:
    |   
    +---Boot\*.*
    |           
    +---Packages\*.*
    |                   
    +---Windows
    |   |   DtcInstall.log
    |   |   Memory.dmp
    |   |   PFRO.log
    |   |   setupact.log
    |   |   setuperr.log
    |   |   vmgcoinstall.log
    |   |   WindowsUpdate.log
    |   |   
    |   +---debug\*.*
    |   |           
    |   +---Inf
    |   |       netcfgs.*.etl
    |   |       setupapi.dev.log
    |   |       setupapi.setup.log
    |   |       
    |   +---Logs
    |   |   +---CBS
    |   |   |       CBS.log
    |   |   |       CbsPersist_*.log
    |   |   |       
    |   |   +---DISM
    |   |   |       dism.log
    |   |   |       
    |   |   \---DPX
    |   |           setupact.log
    |   |           setuperr.log
    |   |           
    |   +---Panther\*.*
    |   |           
    |   +---security
    |   |   \---logs
    |   |           scesetup.log
    |   |           winlogon.log
    |   |           
    |   +---ServiceProfiles
    |   |   \---NetworkService
    |   |       \---debug
    |   |               NetSetup.LOG
    |   |               
    |   +---servicing
    |   |   \---Packages
    |   |           wuindex.xml
    |   |           
    |   +---system32
    |   |   +---catroot2
    |   |   |       dberr.txt
    |   |   |       
    |   |   +---config
    |   |   |       SOFTWARE
    |   |   |       SYSTEM
    |   |   |       
    |   |   +---drivers
    |   |   |   \---etc\*.*
    |   |   |       
    |   |   +---logFiles
    |   |   |   +---Firewall
    |   |   |   |       pfirewall.log
    |   |   |   |
    |   |   |   +---HTTPERR
    |   |   |   |       httperr1.log
    |   |   |   |
    |   |   |   \---WMI
    |   |   |           LwtNetLog.etl
    |   |   |           
    |   |   +---MsDtc
    |   |   |       MSDTC.LOG
    |   |   |       
    |   |   +---NDF
    |   |   |       eventlog.etl
    |   |   |
    |   |   +---Sysprep\*.*
    |   |   |
    |   |   +---wbem
    |   |   |   \---Logs
    |   |   |           wbemess.log
    |   |   |
    |   |   +---wdi
    |   |   |   \---LogFiles
    |   |   |           BootCKCL.etl
    |   |   |           SecondaryLogonCKCL.etl
    |   |   |           ShutdownCKCL.etl
    |   |   |
    |   |   +---wfp
    |   |   |       wfpdiag.etl
    |   |   |       
    |   |   \---winevt
    |   |       \---Logs\*.*
    |   |
    |   +---temp
    |   |   \---DeploymentLogs\*.*
    |   |               
    |   \---WinSxS
    |           poqexec.log
    |           
    \---WindowsAzure\*.*


<a id="linuxlog"></a>
## Disk "Extended Information" for Linux VM

    Root
    |
    +---var
    |   \---log\*.*
    |
    \---etc    
        +---ssh
        |   \---sshd_config\*.*
        |
        \---fstab\*.*
