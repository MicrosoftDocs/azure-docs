---
title: How to use PerfInsights in Microsoft Azure| Microsoft Docs
description: Learns how to use PerfInsights to troubleshoot Windows VM performance problems.
services: virtual-machines-windows'
documentationcenter: ''
author: genlin
manager: cshepard
editor: na
tags: ''

ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: troubleshooting
ms.date: 07/18/2017
ms.author: genli

---
# How to use PerfInsights 

[PerfInsights](http://aka.ms/perfinsightsdownload) is an automated script that collects useful diagnostic information, runs I/O stress loads, and provides an analysis report to help troubleshoot Windows VM performance problems in Microsoft Azure. 

We recommend that you run this script before you open a Support ticket with Microsoft for VM performance issues.

## Supported troubleshooting scenarios

PerfInsights can collect and analyze several kinds of information that are grouped into unique scenarios.

### Collect disk configuration 

This scenario collects the disk configuration and other important information, including the following items:

-   Event logs

-   Network status for all incoming and outgoing connections

-   Network and firewall configuration settings

-   Task list for all applications that are currently running on the system

-   Information file created by msinfo32 for the virtual machine (VM)

-   Microsoft SQL Server database configuration settings (if the VM is identified
    as a server that is running SQL Server)

-   Storage reliability counters

-   Important Windows hotfixes

-   Installed filter drivers

This is a passive collection of information that shouldn't affect the system. 

>[!Note]
>This scenario is automatically included in each of the following scenarios.

### Benchmark/Storage Performance Test

This scenario runs the [diskspd](https://github.com/Microsoft/diskspd) benchmark test (IOPS and MBPS) for all drives that are attached to the VM. 

> [!Note]
> This scenario can affect the system and shouldn’t be run on a live production system. If necessary, run this scenario in a dedicated maintenance window to avoid any problems. An 
> increased workload that is caused by a trace or benchmark test could adversely affect the performance of your VM.
>

### General VM Slow analysis 

This scenario runs a [performance counter](https://msdn.microsoft.com/library/windows/desktop/aa373083(v=vs.85).aspx) trace by using the counters that are specified in the Generalcounters.txt file. If the VM is identified as a server that is running SQL Server, it runs a performance counter trace by using the counters that are found in the Sqlcounters.txt file. It also includes Performance Diagnostics data.

### VM Slow analysis and benchmark

This scenario runs a [performance counter](https://msdn.microsoft.com/library/windows/desktop/aa373083(v=vs.85).aspx) trace that is followed by a [diskspd](https://github.com/Microsoft/diskspd) benchmark test. 

> [!Note]
> This scenario can affect the system and shouldn’t be run on a live production system. If necessary, run this scenario in a dedicated maintenance window to avoid any problems. An 
> increased workload that is caused by a trace or benchmark test could adversely affect the performance of your VM.
>

### Azure Files analysis 

This scenario runs a special performance counter capture together with a network trace. The capture includes all the "SMB Client Shares" counters. The following are some key SMB client share performance counters that are part of the capture:

| **Type**     | **SMB client shares counter** |
|--------------|-------------------------------|
| IOPS         | Data Requests/sec             |
|              | Read Requests/sec             |
|              | Write Requests/sec            |
| Latency      | Avg. sec/Data Request         |
|              | Avg. sec/Read                 |
|              | Avg. sec/Write                |
| IO Size      | Avg. Bytes/Data Request       |
|              | Avg. Bytes/Read               |
|              | Avg. Bytes/Write              |
| Throughput   | Data Bytes/sec                |
|              | Read Bytes/sec                |
|              | Write Bytes/sec               |
| Queue Length | Avg. Read Queue Length        |
|              | Avg. Write Queue Length       |
|              | Avg. Data Queue Length        |

### Custom configuration 

When you run a custom configuration, you are running all traces (performance diagnostics, performance counter, xperf, network, storport) in parallel, depending how many different traces are selected. After tracing is completed, the tool runs the diskspd benchmark, if it is selected. 

> [!Note]
> This scenario can affect the system and shouldn’t be run on a live production system. If necessary, run this scenario in a dedicated maintenance window to avoid any problems. An 
> increased workload that is caused by a trace or benchmark test could adversely affect the performance of your VM.
>

## What kind of information is collected by the script?

Information about Windows VM, disks or storage pools configuration, performance counters, logs and various traces are collected depending on the performance scenario used:

|Data collected                              |  |  | Performance Scenarios |  |  | |
|----------------------------------|----------------------------|------------------------------------|--------------------------|--------------------------------|----------------------|----------------------|
|                              | Collect disk Configuration | Benchmark/Storage Performance test | General VM Slow analysis | VM Slow analysis and benchmark | Azure Files analysis | Custom configuration |
| Information from Event logs      | Yes                        | Yes                                | Yes                      | Yes                            | Yes                  | Yes                  |
| System information               | Yes                        | Yes                                | Yes                      | Yes                            | Yes                  | Yes                  |
| Volume Map                       | Yes                        | Yes                                | Yes                      | Yes                            | Yes                  | Yes                  |
| Disk Map                         | Yes                        | Yes                                | Yes                      | Yes                            | Yes                  | Yes                  |
| Running Tasks                    | Yes                        | Yes                                | Yes                      | Yes                            | Yes                  | Yes                  |
| Storage Reliability Counters     | Yes                        | Yes                                | Yes                      | Yes                            | Yes                  | Yes                  |
| Storage information              | Yes                        | Yes                                | Yes                      | Yes                            | Yes                  | Yes                  |
| Fsutil output                    | Yes                        | Yes                                | Yes                      | Yes                            | Yes                  | Yes                  |
| Filter Driver info               | Yes                        | Yes                                | Yes                      | Yes                            | Yes                  | Yes                  |
| Netstat output                   | Yes                        | Yes                                | Yes                      | Yes                            | Yes                  | Yes                  |
| Network configuration            | Yes                        | Yes                                | Yes                      | Yes                            | Yes                  | Yes                  |
| Firewall configuration           | Yes                        | Yes                                | Yes                      | Yes                            | Yes                  | Yes                  |
| SQL Server configuration         | Yes                        | Yes                                | Yes                      | Yes                            | Yes                  | Yes                  |
| Performance Diagnostics Traces * |                            |                                    | Yes                      |                                |                      | Yes                  |
| Performance counter Trace **     |                            |                                    |                          |                                |                      | Yes                  |
| SMB counter Trace **             |                            |                                    |                          |                                | Yes                  |                      |
| SQL Server counter Trace **      |                            |                                    |                          |                                |                      | Yes                  |
| XPerf Trace                      |                            |                                    |                          |                                |                      | Yes                  |
| StorPort Trace                   |                            |                                    |                          |                                |                      | Yes                  |
| Network Trace                    |                            |                                    |                          |                                | Yes                  | Yes                  |
| Diskspd Benchmark trace ***      |                            | Yes                                |                          | Yes                            |                      |                      |
|       |                            |                         |                                                   |                      |                      |

### Performance Diagnostics trace (*)

Runs a rule-based engine in the background to collect data and diagnose ongoing performance issues. The following rules are currently supported:

- HighCpuUsage rule: Detects high CPU usage periods and shows the top CPU usage consumers during those periods.
- HighDiskUsage rule: Detects high disk usage periods on physical disks and shows the top disk usage consumers during those periods.
- HighResolutionDiskMetric rule: Shows IOPS, throughput and IO latency metrics per 50 milliseconds for each physical disk. It helps to quickly identify disk throttling periods.
- HighMemoryUsage rule: Detects high memory usage periods, and shows the top memory usage consumers during those periods.

> [!NOTE] 
> Currently, Windows versions that include the .NET Framework 3.5 or later versions are supported.

### Performance Counter trace (**)

Collects the following Performance Counters:

- \Process, \Processor, \Memory, \Thread, \PhysicalDisk, \LogicalDisk
- \Cache\Dirty Pages, \Cache\Lazy Write Flushes/sec, \Server\Pool Nonpaged, Failures, \Server\Pool Paged Failures
- Selected counters under \Network Interface, \IPv4\Datagrams, \IPv6\Datagrams, \TCPv4\Segments, \TCPv6\Segments,  \Network Adapter, \WFPv4\Packets, \WFPv6\Packets, \UDPv4\Datagrams, \UDPv6\Datagrams, \TCPv4\Connection, \TCPv6\Connection, \Network QoS Policy\Packets, \Per Processor Network Interface Card Activity, \Microsoft Winsock BSP

#### For SQL Server instances
- \SQL Server:Buffer Manager, \SQLServer:Resource Pool Stats, \SQLServer:SQL Statistics\
- \SQLServer:Locks, \SQLServer:General, Statistics
- \SQLServer:Access Methods

#### For Azure Files
\SMB Client Shares

### Diskspd Benchmark trace (***)
Diskspd IO workload tests [OS Disk (write) and pool drives (read/write)]

## Run the PerfInsights on your VM

### What do I have to know before I run the script? 

**Script requirements**

1.  This script must be run on the VM that has the performance issue. 

2.  The following OSes are supported: Windows Server 2008 R2, 2012, 2012 R2, 2016; Windows 8.1 and Windows 10.

**Possible issues when you run the script on production VMs:**

1.  The script might adversely affect the performance of the VM when it is used together with the "Benchmark" or "Custom" scenario that is configured by using XPerf or DiskSpd. Be careful when you run the script in a production environment.

2.  When you use the script together with the "Benchmark" or "Custom" scenario that is configured by using DiskSpd, make sure that no other background activity interferes with the I/O workload on the tested disks.

3.  By default, the script uses the temporary storage drive to collect data. If tracing stays enabled for a longer time, the amount of data that is collected might be relevant. This can reduce the availability of space on the temporary disk, therefore affecting any application that relies on this drive.

### How do I run PerfInsights? 

To run the script, follow these steps:

1. Download [PerfInsights.zip](http://aka.ms/perfinsightsdownload).

2. Unblock the PerfInsights.zip file. To do this, right-click the PerfInsights.zip file, select **Properties**. In the **General** tab, select **Unblock** and then select **OK**. This will make sure that the script runs without any additional security prompts.  

    ![Unlock the zip file](media/how-to-use-perfInsights/unlock-file.png)

3.  Expand the compressed PerfInsights.zip file into your temporary drive (by default, usually the D drive). The compressed file should contain the following files and folders:

    ![files in the zip folder](media/how-to-use-perfInsights/file-folder.png)

4.  Open Windows PowerShell as an administrator, and then run the PerfInsights.ps1 script.

    ```
    cd <the path of PerfInsights folder >
    Powershell.exe -ExecutionPolicy UnRestricted -NoProfile -File .\\PerfInsights.ps1
    ```

    You might have to enter "y" to if you are asked to confirm that you want to change the execution policy.

    In the Disclaimer dialog box, you are given the option to share diagnostic information with Microsoft Support. You must also consent to the license agreement to continue. Make your selections, and then click **Run Script**.

    ![Disclaimer box](media/how-to-use-perfInsights/disclaimer.png)

5.  Submit the case number, if it is available, when you run the script (This is for our statistics). Then, click **OK**.
    
    ![enter support ID](media/how-to-use-perfInsights/enter-support-number.png)

6.  Select your temporary storage drive. The Script can auto-detect the drive letter of the drive. If any problems occur in this stage, you might be prompted to select the drive (the default drive is D). Generated logs are stored here in the log\_collection folder. After you enter or accept the drive letter, click **OK**.

    ![enter drive](media/how-to-use-perfInsights/enter-drive.png)

7.  Select a troubleshooting scenario from the provided list.

       ![Select support scenarios](media/how-to-use-perfInsights/select-scenarios.png)

8.  You can also run PerfInsights without UI.

    The following command runs the "General VM Slow analysis" troubleshooting scenario without a UI prompt or capture data for 30 seconds. It prompts you to consent to the same disclaimer and EULA that  are mentioned in step 4.

        powershell.exe -ExecutionPolicy UnRestricted -NoProfile -Command ".\\PerfInsights.ps1 -NoGui -Scenario vmslow -TracingDuration 30"

    If you want PerfInsights to run in silent mode, use the
    **-AcceptDisclaimerAndShareDiagnostics** parameter. For example, use the following command:

        powershell.exe -ExecutionPolicy UnRestricted -NoProfile -Command ".\\PerfInsights.ps1 -NoGui -Scenario vmslow -TracingDuration 30 -AcceptDisclaimerAndShareDiagnostics"

### How do I troubleshoot issues while running the script?

If the script terminates abnormally, you can clean up an inconsistent state by running the script together with the -Cleanup switch, as follows:

    powershell.exe -ExecutionPolicy UnRestricted -NoProfile -Command ".\\PerfInsights.ps1 -Cleanup"

If any problems occur during the automatic detection of the temporary drive, you might be prompted to select the drive (the default drive is D).

![enter-drive](media/how-to-use-perfInsights/enter-drive.png)

The script uninstalls the utility tools and removes temporary folders.

### Troubleshooting other script issues 

If any problems occur when you run the script, press Ctrl+C to interrupt the script execution. To remove temporary objects, see the "Clean up after abnormal termination" section.

If you continue to experience script failure even after several attempts, we recommend that you run the script in "debug mode" by using the "-Debug" parameter option on startup.

After the failure occurs, copy the full output of the PowerShell console, and send it to the Microsoft Support agent who is assisting you to help troubleshoot the problem.

### How do I run the script in custom configuration mode?

By selecting the **Custom** configuration, you can enable several traces
in parallel (use Shift to multi-select):

![select scenarios](media/how-to-use-perfInsights/select-scenario.png)

When you select the Performance Diagnostics, Performance Counter Trace, XPerf Trace, Network Trace, or Storport Trace scenarios, follow the instructions in the dialog boxes, and try to reproduce the slow performance issue after you start the traces.

The following dialog box lets you start a trace:

![start-trace](media/how-to-use-perfInsights/start-trace-message.png)

To stop the traces, you have to confirm the command in a second dialog box.

![stop-trace](media/how-to-use-perfInsights/stop-trace-message.png)
![stop-trace](media/how-to-use-perfInsights/ok-trace-message.png)

When the traces or operations are completed, a new file is generated in D:\\log\_collection (or the temporary drive) that is named **CollectedData\_yyyy-MM-dd\_hh\_mm\_ss.zip.** You can send this file to the Support agent for analysis.

## Review the diagnostics report created by PerfInsights

Within the **CollectedData\_yyyy-MM-dd\_hh\_mm\_ss.zip file,** that is generated by PerfInsights, you can find an HTML report that details the findings of PerfInsights. To review the report, expand the **CollectedData\_yyyy-MM-dd\_hh\_mm\_ss.zip** file, and then open the **PerfInsights Report.html** file.

Select the **Findings** tab.

![find tab](media/how-to-use-perfInsights/findingtab.png)

**Notes**

-   Messages in red are known configuration issues that may cause performance issues.

-   Messages in yellow are warnings that represent non-optimal configurations that do not necessarily cause performance issues.

-   Messages in blue are informative statements only.

Review the HTTP links for all error messages in red to get more detailed information about the findings and how they can affect the performance or best practices for performance-optimized configurations.

### Disk Configuration Tab

The **Overview** section displays different views of the storage configuration, including information from Diskpart and Storage Spaces

The **DiskMap** and **VolumeMap** sections describe on a dual perspective how logical volumes and physical disks are related to each other.

In the PhysicalDisk perspective (DiskMap), the table shows all logical volumes that are running on the disk. In the following example, PhysicalDrive2 runs 2 Logical Volumes created on multiple partitions (J and H):

![data tab](media/how-to-use-perfInsights/disktab.png)

In the Volume perspective (*VolumeMap*), the tables show all the physical disks under each logical volume. Notice that for RAID/Dynamic disks, you might run a logical volume upon multiple physical disks. In the following sample *C:\\mount* is a mountpoint configured as *SpannedDisk* on PhysicalDisks \#2 and \#3:

![volume tab](media/how-to-use-perfInsights/volumetab.png)

### SQL Server tab

If the target VM hosts any SQL Server instances, you will see an additional tab in the report that is named **SQL Server**:

![sql tab](media/how-to-use-perfInsights/sqltab.png)

This section contains an "Overview" and additional sub tabs for each of the SQL Server instances hosted on the VM.

The "Overview" section contains a helpful table that summarizes all the physical disks (system and data disks) that are running and that contain a mixture of data files and transaction log files.

In the following example, *PhysicalDrive0* (running the C drive) is displayed because both the *modeldev* and *modellog* files are located on the C drive, and they are of different types (such as Data File and Transaction Log, respectively):

![loginfo](media/how-to-use-perfInsights/loginfo.png)

The SQL Server instance-specific tabs contain a general section that displays basic information about the selected instance and additional sections for advanced information, including Settings, Configurations, and User Options.

## References to the external tools used

### Diskspd

DISKSPD is a storage load generator and performance test tool from the Windows and Windows Server and Cloud Server Infrastructure engineering teams. For more information, see [Diskspd](https://github.com/Microsoft/diskspd).

### XPerf

Xperf is a command-line tool to capture traces from the Windows Performance Tools Kit.

For more information, see [Windows Performance Toolkit – Xperf](https://blogs.msdn.microsoft.com/ntdebugging/2008/04/03/windows-performance-toolkit-xperf/).

## Next Steps

### Upload diagnostics logs and reports to Microsoft Support for further review

When you work with the Microsoft Support staff, you may be requested to transmit the output that is generated by PerfInsights to assist the troubleshooting process.

The Support agent will create a DTM workspace for you, and you will receive an email message that includes a link to the [DTM portal (https://filetransfer.support.microsoft.com/EFTClient/Account/Login.htm) and a unique user ID and password.

This message will be sent from **CTS Automated Diagnostics Services** (ctsadiag@microsoft.com).

![Sample of the message](media/how-to-use-perfInsights/supportemail.png)

For additional security, you will be required to change your password on first use.

After you log in to DTM, you will find a dialog box to upload the **CollectedData\_yyyy-MM-dd\_hh\_mm\_ss.zip** file that was collected by PerfInsights.
