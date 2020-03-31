---
title: Diagnostics Tool to troubleshoot StorSimple 8000 device | Microsoft Docs
description: Describes the StorSimple device modes and explains how to use Windows PowerShell for StorSimple to change the device mode.
services: storsimple
documentationcenter: ''
author: alkohli
manager: timlt
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/09/2018
ms.author: alkohli

---
# Use the StorSimple Diagnostics Tool to troubleshoot 8000 series device issues

## Overview

The StorSimple Diagnostics tool diagnoses issues related to system, performance, network, and hardware component health for a StorSimple device. The diagnostics tool can be used in various scenarios. These scenarios include workload planning, deploying a StorSimple device, assessing the network environment, and determining the performance of an operational device. This article provides an overview of the diagnostics tool and describes how the tool can be used with a StorSimple device.

The diagnostics tool is primarily intended for StorSimple 8000 series on-premises devices (8100 and 8600).

## Run diagnostics tool

This tool can be run via the Windows PowerShell interface of your StorSimple device. There are two ways to access the local interface of your device:

* [Use PuTTY to connect to the device serial console](storsimple-8000-deployment-walkthrough-u2.md#use-putty-to-connect-to-the-device-serial-console).
* [Remotely access the tool via the Windows PowerShell for StorSimple](storsimple-8000-remote-connect.md).

In this article, we assume that you have connected to the device serial console via PuTTY.

#### To run the diagnostics tool

Once you have connected to the Windows PowerShell interface of the device, perform the following steps to run the cmdlet.
1. Log on to the device serial console by following the steps in [Use PuTTY to connect to the device serial console](storsimple-8000-deployment-walkthrough-u2.md#use-putty-to-connect-to-the-device-serial-console).

2. Type the following command:

	`Invoke-HcsDiagnostics`

	If the scope parameter is not specified, the cmdlet executes all the diagnostic tests. These tests include system, hardware component health, network, and performance. 
    
    To run only a specific test, specify the scope parameter. For instance, to run only the network test, type

    `Invoke-HcsDiagnostics -Scope Network`

3. Select and copy the output from the PuTTY window into a text file for further analysis.

## Scenarios to use the diagnostics tool

Use the diagnostics tool to troubleshoot the network, performance, system, and hardware health of the system. Here are some possible scenarios:

* **Device offline** - Your StorSimple 8000 series device is offline. However, from the Windows PowerShell interface, it seems that both the controllers are up and running.
    * You can use this tool to then determine the network state.
         
         > [!NOTE]
         > Do not use this tool to assess performance and network settings on a device before the registration (or configuring via setup wizard). A valid IP is assigned to the device during setup wizard and registration. You can run this cmdlet, on a device that is not registered, for hardware health and system. Use the scope parameter, for example:
         >
         > `Invoke-HcsDiagnostics -Scope Hardware`
         >
         > `Invoke-HcsDiagnostics -Scope System`

* **Persistent device issues** - You are experiencing device issues that seem to persist. For instance, registration is failing. You could also be experiencing device issues after the device is successfully registered and operational for a while.
    * In this case, use this tool for preliminary troubleshooting before you log a service request with Microsoft Support. We recommend that you run this tool and capture the output of this tool. You can then provide this output to Support to expedite troubleshooting.
    * If there are any hardware component or cluster failures, you should log in a Support request.

* **Low device performance** - Your StorSimple device is slow.
    * In this case, run this cmdlet with scope parameter set to performance. Analyze the output. You get the cloud read-write latencies. Use the reported latencies as maximum achievable target, factor in some overhead for the internal data processing, and then deploy the workloads on the system. For more information, go to [Use the network test to troubleshoot device performance](#network-test).


## Diagnostics test and sample outputs

### Hardware test

This test determines the status of the hardware components, the USM firmware, and the disk firmware running on your system.

* The hardware components reported are those components that failed the test or are not present in the system.
* The USM firmware and disk firmware versions are reported for the Controller 0, Controller 1, and shared components in your system. For a complete list of hardware components, go to:

    * [Components in primary enclosure](storsimple-8000-monitor-hardware-status.md#component-list-for-primary-enclosure-of-storsimple-device)
    * [Components in EBOD enclosure](storsimple-8000-monitor-hardware-status.md#component-list-for-ebod-enclosure-of-storsimple-device)

> [!NOTE]
> If the hardware test reports failed components, [log in a service request with Microsoft Support](storsimple-8000-contact-microsoft-support.md).

#### Sample output of hardware test run on an 8100 device

Here is a sample output from a StorSimple 8100 device. In the 8100 model device, the EBOD enclosure is not present. Hence, the EBOD controller components are not reported.

```
Controller0>Invoke-HcsDiagnostics -Scope Hardware
Running hardware diagnostics ...
--------------------------------------------------
Hardware components failed or not present
----------------------

           Type           State      Controller           Index     EnclosureId
           ----           -----      ----------           -----     -----------
...rVipResource      NotPresent            None               1            None
...rVipResource      NotPresent            None               2            None
...rVipResource      NotPresent            None               3            None
...rVipResource      NotPresent            None               4            None
...rVipResource      NotPresent            None               5            None
...rVipResource      NotPresent            None               6            None
...rVipResource      NotPresent            None               7            None
...rVipResource      NotPresent            None               8            None
...rVipResource      NotPresent            None               9            None
...rVipResource      NotPresent            None              10            None
...rVipResource      NotPresent            None              11            None

Firmware information
----------------------
TalladegaController : ActiveBIOS:0.45.0010
                      BackupBIOS:0.45.0006
                      MainCPLD:17.0.000b
                      ActiveBMCRoot:2.0.001F
                      BackupBMCRoot:2.0.001F
                      BMCBoot:2.0.0002
                      LsiFirmware:20.00.04.00
                      LsiBios:07.37.00.00
                      Battery1Firmware:06.2C
                      Battery2Firmware:06.2C
                      DomFirmware:X231600
                      CanisterFirmware:3.5.0.56
                      CanisterBootloader:5.03
                      CanisterConfigCRC:0x9134777A
                      CanisterVPDStructure:0x06
                      CanisterGEMCPLD:0x19
                      CanisterVPDCRC:0x142F7DC2
                      MidplaneVPDStructure:0x0C
                      MidplaneVPDCRC:0xA6BD4F64
                      MidplaneCPLD:0x10
                      PCM1Firmware:1.00|1.05
                      PCM1VPDStructure:0x05
                      PCM1VPDCRC:0x41BEF99C
                      PCM2Firmware:1.00|1.05
                      PCM2VPDStructure:0x05
                      PCM2VPDCRC:0x41BEF99C

EbodController      :
DisksFirmware       : SmrtStor:TXA2D20400GA6XYR:KZ50
                      SmrtStor:TXA2D20400GA6XYR:KZ50
                      SmrtStor:TXA2D20400GA6XYR:KZ50
                      SmrtStor:TXA2D20400GA6XYR:KZ50
                      WD:WD4001FYYG-01SL3:VR08
                      WD:WD4001FYYG-01SL3:VR08
                      WD:WD4001FYYG-01SL3:VR08
                      WD:WD4001FYYG-01SL3:VR08
                      WD:WD4001FYYG-01SL3:VR08
                      WD:WD4001FYYG-01SL3:VR08
                      WD:WD4001FYYG-01SL3:VR08
                      WD:WD4001FYYG-01SL3:VR08

TalladegaController : ActiveBIOS:0.45.0010
                      BackupBIOS:0.45.0006
                      MainCPLD:17.0.000b
                      ActiveBMCRoot:2.0.001F
                      BackupBMCRoot:2.0.001F
                      BMCBoot:2.0.0002
                      LsiFirmware:20.00.04.00
                      LsiBios:07.37.00.00
                      Battery1Firmware:06.2C
                      Battery2Firmware:06.2C
                      DomFirmware:X231600
                      CanisterFirmware:3.5.0.56
                      CanisterBootloader:5.03
                      CanisterConfigCRC:0x9134777A
                      CanisterVPDStructure:0x06
                      CanisterGEMCPLD:0x19
                      CanisterVPDCRC:0x142F7DC2
                      MidplaneVPDStructure:0x0C
                      MidplaneVPDCRC:0xA6BD4F64
                      MidplaneCPLD:0x10
                      PCM1Firmware:1.00|1.05
                      PCM1VPDStructure:0x05
                      PCM1VPDCRC:0x41BEF99C
                      PCM2Firmware:1.00|1.05
                      PCM2VPDStructure:0x05
                      PCM2VPDCRC:0x41BEF99C

EbodController      :
DisksFirmware       : SmrtStor:TXA2D20400GA6XYR:KZ50
                      SmrtStor:TXA2D20400GA6XYR:KZ50
                      SmrtStor:TXA2D20400GA6XYR:KZ50
                      SmrtStor:TXA2D20400GA6XYR:KZ50
                      WD:WD4001FYYG-01SL3:VR08
                      WD:WD4001FYYG-01SL3:VR08
                      WD:WD4001FYYG-01SL3:VR08
                      WD:WD4001FYYG-01SL3:VR08
                      WD:WD4001FYYG-01SL3:VR08
                      WD:WD4001FYYG-01SL3:VR08
                      WD:WD4001FYYG-01SL3:VR08
                      WD:WD4001FYYG-01SL3:VR08

--------------------------------------------------
```

### System test

This test reports the system information, the updates available, the cluster information, and the service information for your device.

* The system information includes the model, device serial number, time zone, controller status, and the detailed software version running on the system. To understand the various system parameters reported as the output, go to [Interpreting system information](#appendix-interpreting-system-information).

* The update availability reports whether the regular and maintenance modes are available and their associated package names. If `RegularUpdates` and `MaintenanceModeUpdates` are `false`, this indicates that the updates are not available. Your device is up-to-date.
* The cluster information contains the information on various logical components of all the HCS cluster groups and their respective statuses. If you see an offline cluster group in this section of the report, [contact Microsoft Support](storsimple-8000-contact-microsoft-support.md).
* The service information includes the names and statuses of all the HCS and CiS services running on your device. This information is helpful for the Microsoft Support in troubleshooting the device issue.

#### Sample output of system test run on an 8100 device

Here is a sample output of the system test run on an 8100 device.

```
Controller0>Invoke-HcsDiagnostics -Scope System
Running system diagnostics ...
--------------------------------------------------

System information
----------------------
Controller0:

InstanceId              : 7382407f-a56b-4622-8f3f-756fe04cfd38
Name                    : 8100-SHX0991003G467K
Model                   : 8100
SerialNumber            : SHX0991003G467K
TimeZone                : (UTC-08:00) Pacific Time (US & Canada)
CurrentController       : Controller0
ActiveController        : Controller0
Controller0Status       : Normal
Controller1Status       : Normal
SystemMode              : Normal
FriendlySoftwareVersion : StorSimple 8000 Series Update 4.0
HcsSoftwareVersion      : 6.3.9600.17820
ApiVersion              : 9.0.0.0
VhdVersion              : 6.3.9600.17759
OSVersion               : 6.3.9600.0
CisAgentVersion         : 1.0.9441.0
MdsAgentVersion         : 35.2.2.0
Lsisas2Version          : 2.0.78.0
Capacity                : 219902325555200
RemoteManagementMode    : Disabled
FipsMode                : Enabled

Controller1:
InstanceId              : 7382407f-a56b-4622-8f3f-756fe04cfd38
Name                    : 8100-SHX0991003G467K
Model                   : 8100
SerialNumber            : SHX0991003G467K
TimeZone                :
CurrentController       : Controller0
ActiveController        : Controller0
Controller0Status       : Normal
Controller1Status       : Normal
SystemMode              : Normal
FriendlySoftwareVersion : StorSimple 8000 Series Update 4.0
HcsSoftwareVersion      : 6.3.9600.17820
ApiVersion              : 9.0.0.0
VhdVersion              : 6.3.9600.17759
OSVersion               : 6.3.9600.0
CisAgentVersion         : 1.0.9441.0
MdsAgentVersion         : 35.2.2.0
Lsisas2Version          : 2.0.78.0
Capacity                : 219902325555200
RemoteManagementMode    : HttpsAndHttpEnabled
FipsMode                : Enabled

Update availability
----------------------
RegularUpdates              : False
MaintenanceModeUpdates      : False
RegularUpdatesTitle         : {}
MaintenanceModeUpdatesTitle : {}

Cluster information
----------------------
Name                          State OwnerGroup
----                          ----- ----------
ApplicationHostRLUA           Online HCS Cluster Group
Data0v4                       Online HCS Cluster Group
HCS Vnic Resource             Online HCS Cluster Group
hcs_cloud_connectivity_...    Online HCS Cluster Group
hcs_controller_replacement    Online HCS Cluster Group
hcs_datapath_service          Online HCS Cluster Group
hcs_management_service        Online HCS Cluster Group
hcs_nvram_service             Online HCS Cluster Group
hcs_passive_datapath          Online HCS Passive Cluster Group
hcs_platform_service          Online HCS Cluster Group
hcs_saas_agent_service        Online HCS Cluster Group
HddDataClusterDisk            Online HCS Cluster Group
HddMgmtClusterDisk            Online HCS Cluster Group
HddReplClusterDisk            Online HCS Cluster Group
iSCSI Target Server           Online HCS Cluster Group
NvramClusterDisk              Online HCS Cluster Group
SSAdminRLUA                   Online HCS Cluster Group
SsdDataClusterDisk            Online HCS Cluster Group
SsdNvramClusterDisk           Online HCS Cluster Group

Service information
----------------------
Name                                          Status DisplayName
----                                          ------ -----------
CiSAgentSvc                                   Stopped CiS Service Agent
hcs_cloud_connectivity_...                    Running hcs_cloud_connectivity...
hcs_controller_replacement                    Running HCS Controller Replace...
hcs_datapath_service                          Running HCS Datapath Service
hcs_management_service                        Running HCS Management Service
hcs_minishell                                 Running hcs_minishell
HCS_NVRAM_Service                             Running HCS NVRAM Service
hcs_passive_datapath                          Stopped HCS Passive Datapath S...
hcs_platform_service                          Running HCS Platform Monitor S...
hcs_saas_agent_service                        Running hcs_saas_agent_service
hcs_startup                                   Stopped hcs_startup
--------------------------------------------------
```

### Network test

This test validates the status of the network interfaces, ports, DNS and NTP server connectivity, TLS/SSL certificate, storage account credentials, connectivity to the Update servers, and web proxy connectivity on your StorSimple device.

#### Sample output of network test when only DATA0 is enabled

Here is a sample output of the 8100 device. You can see in the output that:
* Only DATA 0 and DATA 1 network interfaces are enabled and configured.
* DATA 2 - 5 are not enabled in the portal.
* The DNS server configuration is valid and the device can connect via the DNS server.
* The NTP server connectivity is also fine.
* Ports 80 and 443 are open. However, port 9354 is blocked. Based on the [system network requirements](storsimple-system-requirements.md), you need to open this port for the service bus communication.
* The TLS/SSL certification is valid.
* The device can connect to the storage account: _myss8000storageacct_.
* The connectivity to Update servers is valid.
* The web proxy is not configured on this device.

#### Sample output of network test when DATA0 and DATA1 are enabled

```
Controller0>Invoke-HcsDiagnostics -Scope Network
Running network diagnostics ....
--------------------------------------------------
Validating networks .....
Name                Entity              Result              Details
----                ------              ------              -------
Network interface   Data0               Valid
Network interface   Data1               Valid
Network interface   Data2               Not enabled
Network interface   Data3               Not enabled
Network interface   Data4               Not enabled
Network interface   Data5               Not enabled
DNS                 10.222.118.154      Valid
NTP                 time.windows.com    Valid
Port                80                  Open
Port                443                 Open
Port                9354                Blocked
SSL certificate     https://myss8000... Valid
Storage account ... myss8000storageacct Valid
URL                 http://download.... Valid
URL                 http://download.... Valid
Web proxy                               Not enabled         Web proxy is not...
--------------------------------------------------
```

### Performance test

This test reports the cloud performance via the cloud read-write latencies for your device. This tool can be used to establish a baseline of the cloud performance that you can achieve with StorSimple. The tool reports the maximum performance (best case scenario for read-write latencies) that you can get for your connection.

As the tool reports the maximum achievable performance, we can use the reported read-write latencies as targets when deploying the workloads.

The test simulates the blob sizes associated with the different volume types on the device. Regular tiered and backups of locally pinned volumes use a 64 KB blob size. Tiered volumes with archive option checked use 512 KB blob data size. If your device has tiered and locally pinned volumes configured, only the test corresponding to 64 KB blob data size is run.

To use this tool, perform the following steps:

1.  First, create a mix of tiered volumes and tiered volumes with archived option checked. This action ensures that the tool runs the tests for both 64 KB and 512 KB blob sizes.

2. Run the cmdlet after you have created and configured the volumes. Type:

    `Invoke-HcsDiagnostics -Scope Performance`

3. Make a note of the read-write latencies reported by the tool. This test can take several minutes to run before it reports the results.

4. If the connection latencies are all under the expected range, then the latencies reported by the tool can be used as maximum achievable target when deploying the workloads. Factor in some overhead for internal data processing.

    If the read-write latencies reported by the diagnostics tool are high:

    1. Configure Storage Analytics for blob services and analyze the output to understand the latencies for the Azure storage account. For detailed instructions, go to [enable and configure Storage Analytics](../storage/common/storage-enable-and-view-metrics.md). If those latencies are also high and comparable to the numbers you received from the StorSimple Diagnostics tool, then you need to log a service request with Azure storage.

    2. If the storage account latencies are low, contact your network administrator to investigate any latency issues in your network.

#### Sample output of performance test run on an 8100 device

```
Controller0>Invoke-HcsDiagnostics -Scope Performance
Running performance diagnostics...
--------------------------------------------------
Cloud performance: writing blobs
Cloud write latency: 194 ms using credential 'myss8000storageacct', blob size '64KB'
Cloud performance: reading blobs..
Cloud read latency: 544 ms using credential 'myss8000storageacct', blob size '64KB'
Cloud performance: writing blobs.
Cloud write latency: 369 ms using credential 'myss8000storageacct', blob size '512KB'
Cloud performance: reading blobs...
Cloud read latency: 4924 ms using credential 'myss8000storageacct', blob size '512KB'
--------------------------------------------------
Controller0>
```

## Appendix: interpreting system information

Here is a table describing what the various Windows PowerShell parameters in the system information map to. 

| PowerShell Parameter    | Description  |
|-------------------------|------------------|
| Instance ID             | Every controller has a unique identifier or a GUID associated with it.|
| Name                    | The friendly name of the device as configured through the Azure portal during device deployment. The default friendly name is the device serial number. |
| Model                   | The model of your StorSimple 8000 series device. The model can be 8100 or 8600.|
| SerialNumber            | The device serial number is assigned at the factory and is 15 characters long. For instance, 8600-SHX0991003G44HT indicates:<br> 8600 – Is the device model.<br>SHX – Is the manufacturing site.<br> 0991003 - Is a specific product. <br> G44HT- the last 5 digits are incremented to create unique serial numbers. This may not be a sequential set.|
| TimeZone                | The device time zone as configured in the Azure portal during device deployment.|
| CurrentController       | The controller that you are connected to through the Windows PowerShell interface of your StorSimple device.|
| ActiveController        | The controller that is active on your device and is controlling all the network and disk operations. This can be Controller 0 or Controller 1.  |
| Controller0Status       | The status of Controller 0 on your device. The controller status can be normal, in recovery mode, or unreachable.|
| Controller1Status       | The status of Controller 1 on your device.  The controller status can be normal, in recovery mode, or unreachable.|
| SystemMode              | The overall status of your StorSimple device. The device status can be normal, maintenance, or decommissioned (corresponds to deactivated in the Azure portal).|
| FriendlySoftwareVersion | The friendly string that corresponds to the device software version. For a system running Update 4, the friendly software version would be StorSimple 8000 Series Update 4.0.|
| HcsSoftwareVersion      | The HCS software version running on your device. For instance, the HCS software version corresponding to StorSimple 8000 Series Update 4.0 is 6.3.9600.17820. |
| ApiVersion              | The software version of the Windows PowerShell API of the HCS device.|
| VhdVersion              | The software version of the factory image that the device was shipped with. If you reset your device to factory defaults, then it runs this software version.|
| OSVersion               | The software version of the Windows Server operating system running on the device. The StorSimple device is based off the Windows Server 2012 R2 that corresponds to 6.3.9600.|
| CisAgentVersion         | The version for your Cis agent running on your StorSimple device. This agent helps communicate with the StorSimple Manager service running in Azure.|
| MdsAgentVersion         | The version corresponding to the Mds agent running on your StorSimple device. This agent moves data to the Monitoring and Diagnostics Service (MDS).|
| Lsisas2Version          | The version corresponding to the LSI drivers on your StorSimple device.|
| Capacity                | The total capacity of the device in bytes.|
| RemoteManagementMode    | Indicates whether the device can be remotely managed via its Windows PowerShell interface. |
| FipsMode                | Indicates whether the United States Federal Information Processing Standard (FIPS) mode is enabled on your device. The FIPS 140 standard defines cryptographic algorithms approved for use by US Federal government computer systems for the protection of sensitive data. For devices running Update 4 or later, FIPS mode is enabled by default. |

## Next steps

* Learn the [syntax of the Invoke-HcsDiagnostics cmdlet](https://technet.microsoft.com/library/mt795371.aspx).

* Learn more about how to [troubleshoot deployment issues](storsimple-troubleshoot-deployment.md) on your StorSimple device.
