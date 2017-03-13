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
ms.date: 03/13/2017
ms.author: alkohli

---
# Use the StorSimple Diagnostics Tool to troubleshoot 8000 series device issues

The StorSimple Diagnostics tool diagnoses and troubleshoots issues related to system, performance, network, and hardware component health of a StorSimple device. The diagnostics tool can be used in a host of scenarios such as planning a deployment, deploying a StorSimple device, assessing the network environment, and determining the performance of an operational device. This article provides an overview of the diagnostics tool and describes how the tool can be used in conjunction with a StorSimple device.

The diagnostics tool is primarily intended for StorSimple 8000 series on-premises devices (8100 and 8600).

## Run StorSimple Diagnostics Tool

This tool can be run via the Windows PowerShell interface of your StorSimple device. There are two ways to access the local interface of your device:

* [Use PuTTy to connect to the device serial console](storsimple-deployment-walkthrough.md#use-putty-to-connect-to-the-device-serial-console).
* [Remotely access the tool via the Windows PowerShell for StorSimple](storsimple-remote-connect.md).


#### To run the diagnostics tool

Once you have connected to the Windows PowerShell interface of the device, perform the following steps to run the cmdlet.
1. Log on to the device serial console by following the steps in [Use PuTTY to connect to the device serial console](storsimple-deployment-walkthrough-u2.md#use-putty-to-connect-to-the-device-serial-console).

2. Type the following command:

	`Invoke-HcsDiagnostics`

	If the scope parameter is not specified, the cmdlet will execute all the diagnostics tests, system, hardware component health, network, and performance. Specify the scope parameter to run only a specific test.

	For instance to run only the network test, type

    `Invoke-HcsDiagnostics -Scope Network`


## Scenarios to use the diagnostics tool

The diagnostics tool can be used in various scenarios to troubleshoot the network, performance, system, and hardware component health of the system. Here are some possible scenarios:

* Your StorSimple 8000 series device is offline. However, from the Windows PowerShell interface, it seems that both the controllers are up and running.
    * You can use this tool to then determine the network state.
         
         > [!NOTE]
         > Do not use this tool to assess performance and network settings on a device prior to registration (or configuring via setup wizard). A valid IP is assigned to the device during setup wizard and registration. You can run this cmdlet, on a device that is not registered, for hardware health and system. Use the scope parameter, for example:
         >
         > `Invoke-HcsDiagnostics -Scope Hardware`
         >
         > `Invoke-HcsDiagnostics -Scope System`

* You are experiencing device issues that seem to persist. For instance, registration is failing. You could also be experiencing device issues after the device is successfully registered and operational for a while.
    * In this case, use this tool for preliminary troubleshooting prior to logging a service request with Microsoft Support. We recommend that you run this tool and capture the output of this tool. You can then provide this output to Support to expedite troubleshooting.
    * If there are any hardware component or cluster failures, you should log in a Support request.

* The performance of your StorSimple device is slow.
    * In this case, run this cmdlet with scope parameter set to performance. Analyze the output. You will get the cloud read-write latencies. Use the reported latencies as maximum achievable target, factor in some overhead for the internal data processing, and then deploy the workloads on the system.


## Diagnostics test and sample outputs

### Hardware test

This test determines the status of the hardware components, the USM firmware, and the disk firmware running on your system.

* The hardware components reported are those that failed the test or are not present in the system.
* The USM firmware and disk firmware versions are reported for the Controller 0, Controller 1, and shared components in your system. For a complete list of hardware components, go to:
    * Controller 0 components
    * Controller 1 components
    * Shared components

> [!NOTE]
> If the hardware test reports failed components, [log in a service request with Microsoft Support](storsimple-contact-microsoft-support.md).

#### Sample output of hardware test run on an 8100 device

Here is a sample output from a StorSimple 8100 device. In the 8100 model device, the EBOD enclosure is not present, hence EBOD controller components will not be reported.

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

* The system information includes the model, device serial number, time zone, controller status, and the detailed software version running on the system.
* The update availability reports whether the regular and maintenance modes are available and their associated package names.
* The cluster information contains the information on various logical components of all the HCS cluster groups and their respective statuses. If you see an offline cluster group in this section of the report, [contact Microsoft Support](storsimple-contact-microsoft-support).
* The service information includes the names and statuses of all the HCS and CiS services running on your device. Passive controller - reverse output This information is helpful for the Microsoft Support in troubleshooting the device issue.

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
hcs_management_servic         Online HCS Cluster Group
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

This test validates the status of the network interfaces, ports, DNS and NTP server connectivity, SSL certificate, storage account credentials, connectivity to the Update servers, and web proxy connectivity on your StorSimple device.

#### Sample output of network test when only DATA0 is enabled

Here is a sample output of the 8100 device. You can see in the output that:
* Only DATA 0 network interface is enabled and configured.
* DATA 1 - 5 are not enabled in the portal.
* The DNS server configuration is valid and the device can connect via the DNS server.
* The NTP server connectivity is also fine.
* Ports 80 and 443 are open, however port 9354 is blocked. Based on the [system network requirements](storsimple-system-requirements.md), you need to open this port for the service bus communication.
* The SSL certification is valid.
* The device can connect to the storage account: _myss8000storageacct_.
* The connectivity to Update servers is valid.
* The web proxy is not configured on this device.

```
Controller0>Invoke-HcsDiagnostics -Scope Network
Running network diagnostics ....
--------------------------------------------------
Validating networks ....
Name                Entity              Result              Details
----                ------              ------              -------
Network interface   Data0               Valid
Network interface   Data1               Not enabled
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
Controller0>
```


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

As the tool reports the maxmimum achievable performance, we can use the reported read-write latencies as targets when deploying the workloads.

The test simulates the blob sizes associated with the different volume types on the device. Regular tiered and backups of locally pinned volumes use a 64 KB blob size. Tiered volumes with archive option checked use 512 KB blob data size. If your device has only regular tiered and locally pinned volumes configured, only the test corresponding to 64 KB blob data size is run.

To use this tool, perform the following steps.

*  First, create a mix of tiered volumes and tiered volumes with archived option checked. This ensures that the tool runs the tests for both 64 KB and 512 KB blob sizes.

* Run the cmdlet after you have created and configured the volumes. Type:

    `Invoke-HcsDiagnostics - Scope Performance`

* Make a note of the read-write latencies reported by the tool. This test can take several minutes to run before it reports the results.

* If the read-write latencies reported are high
    * You need to contact your network administrator to investigate any latency issues in your network.

    * Run the Azure storage tool to ensure that performance of your Azure storage account is fine. Make a note of the read-write latencies reported in this case. For more information, go to []() If the Azure storage latencies are high, you will need to log a service request with Azure storage.

* If the connection latencies are all under the expected range, then the latencies reported by the tool can be used as maxmimum achiveable target when deploying the workloads. Factor in some overhead for internal data processing.

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

## Next steps

Learn how to [apply normal and maintenance mode updates](storsimple-update-device.md) on your StorSimple device.

