---
title: Troubleshooting Windows Azure Guest Agent
description: Troubleshoot the Windows Azure Guest Agent is not working issues
services: virtual-machines-windows
ms.service: virtual-machines-windows
author: dkdiksha
manager: dcscontentpm
editor: 
ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 08/07/2020
ms.author: genli
---
# Troubleshooting Windows Azure Guest Agent

Windows Azure Guest Agent is a virtual machine (VM) agent. It enables the VM to communicate with the Fabric Controller (the underlying physical server on which VM is hosted) on IP address 168.63.129.16. This is a virtual public IP address that facilitates the communication. For more information, see [What is IP address 168.63.129.16](https://docs.microsoft.com/azure/virtual-network/what-is-ip-address-168-63-129-16).

 The VM that is migrated to Azure from on-premises or that is created by using a customized image doesn't have Windows Azure Guest Agent installed. In these scenarios, you have to manually install the VM agent. For more information about how to install the VM Agent, see [Azure Virtual Machine Agent Overview](https://docs.microsoft.com/azure/virtual-machines/extensions/agent-windows).

After Windows Azure Guest Agent is successfully installed, you can see following services listed in services.msc on the VM:
 
- Windows Azure Guest Agent Service
- Telemetry Service
- RD Agent service

**Windows Azure Guest Agent Service**: This service is the service that is responsible for all the logging in WAppAgent.log. This service is responsible for configuring various extensions and communication from Guest to Host. 

**Telemetry Service**: This service is responsible for sending the telemetry data of the VM to the backend server.

**RD Agent Service**: This service is responsible for the Installation of Guest Agent. Transparent Installer is also a component of Rd Agent that helps to upgrade other components and services of Guest Agent. RDAgent is also responsible for sending heartbeats from Guest VM to Host Agent on the physical server.

> [!NOTE]
> Starting in version 2.7.41491.971 of the VM Guest Agent, the Telemetry component is included in the RDAgent service, Therefore, you might not see this Telemetry service listed in newly created VMs.

## Checking agent status and version

Go to to the VM properties page in Azure portal, and check the **Agent status**. If the Windows Azure Guest Agent is working correctly, the status shows **Ready**. If VM Agent is in **Not Ready** status, the extensions and **Run command** on the Azure portal won’t work.

## Troubleshooting VM agent that is in Not Ready status

### Step 1 Check whether the Windows Azure Guest Agent service is installed

- Check for the Package

    Locate the C:\WindowsAzure folder. If you see the GuestAgent folder that displays the version number, that means that Windows Azure Guest Agent was installed on the VM. You can also look for the installed package.  If Windows Azure Guest Agent is installed on the VM, the package will be saved in the following location: `C:\windows\OEM\GuestAgent\VMAgentPackage.zip`.
    
    You can run the following PowerShell command to check whether VM Agent has been deployed to the VM:
    
    `Get-Az VM -ResourceGroup “RGNAME” – Name “VMNAME” -displayhint expand`
    
    In the output, locate the **ProvisionVMAgent** property, and check whether the value is set to **True**. If it is, this means that the agent is installed on the VM.
    
- Check the Services and Processes

   Go to the Services console (services.msc) and check the status of the following services: Windows Azure Guest Agent Service, RDAgent service, Windows Azure Telemetry Service, and Windows Azure Network Agent service.
 
    You can also check whether these services are running by examining Task Manager for the following processes:
       
    - WindowsAzureGuestAgent.exe: Windows Azure Guest Agent service
    - WaAppAgent.exe: RDAgent service
    - WindowsAzureNetAgent.exe: Windows Azure Network Agent service
    - WindowsAzureTelemetryService.exe: Windows Azure Telemetry Service

   If you cannot find these processes and services, this indicates that you do not have Windows Azure Guest Agent installed.

- Check the Program and Feature

    In Control Panel, go to **Programs and Features** to determine whether the Windows Azure Guest Agent service is installed.

If you don't find any packages, services and processes running and do not even see Windows Azure Guest Agent installed under Programs and Features, try [installing Windows Azure Guest Agent service](https://docs.microsoft.com/azure/virtual-machines/extensions/agent-windows). If the Guest Agent doesn't install properly, you can [Install the VM agent offline](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/install-vm-agent-offline).

If you can see the services and they are running, restart the service that see if the problem is resolved. If the services are stopped, start them and wait few minutes. Then check whether the **Agent status** is reporting as **Ready**. If you find that these services are crashing, some third party processes may be causing these services to crash. To further troubleshooting of these issues, contact [Microsoft Support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

### Step 2 Check whether auto-update is working

The Windows Azure Guest Agent has an auto-update feature. It will automatically check for new updates and install them. If the auto-update feature doesn't work correctly, try uninstalling and installing the Windows Azure Guest Agent by using the following steps:

1. If Windows Azure Guest Agent appears in **Programs and Features**, uninstall the Windows Azure Guest Agent.

2. Open a Command Prompt window that has administrator privileges.

3. Stop the Guest Agent services. If the services do not stop, you must set the services to **manual startup** and then restart the VM.
    ```
    net stop rdagent
    net stop WindowsAzureGuestAgent
    net stop WindowsAzureTelemetryService
    ```
1. Delete the Guest Agent Services:
    ```
    sc delete rdagent
    sc delete WindowsAzureGuestAgent
    sc delete WindowsAzureTelemetryService
    ```
1. Under `C:\WindowsAzure` create a folder that is named OLD.

1. Move any folders that are named Packages or GuestAgent into the OLD folder.

1. Download and install the latest version of the agent installation package from [here](https://go.microsoft.com/fwlink/?linkid=394789&clcid=0x409). You must have Administrator rights to complete the installation.

1. Install Guest Agent by using the following command:

    ```
    msiexec.exe /i c:\VMAgentMSI\WindowsAzureVmAgent.2.7.<version>.fre.msi /quiet /L*v c:\VMAgentMSI\msiexec.log
    ```
    Then check whether the Guest Agent Services start correctly.
 
    In rare cases in which Guest Agent doesn't install correctly, you can [Install the VM agent offline](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/install-vm-agent-offline).
    

### Step 3 Check whether the VM can connect to the Fabric Controller

Use a tool such as PsPing to test whether the VM can connect to 168.63.129.16 on ports 80, 32526 and 443. If the VM doesn’t connect as expected, check whether outbound communication over ports 80, 443, and 32526 is open in your local firewall on the VM. If this IP address is blocked, VM Agent may display unexpected behavior in a variety of scenarios.

## Advanced troubleshooting

Events for troubleshooting Windows Azure Guest Agent is recorded in the following log files:

- C:\WindowsAzure\Logs\WaAppAgent.log
- C:\WindowsAzure\Logs\TransparentInstaller.log

The following are some common scenarios in which Windows Azure Guest Agent can enter **Not ready** status or stop working as expected.

### Agent Stuck on "Starting"

In the WaAppAgent log, you can see that the agent is stuck at the Starting process and cannot start.

**Log information**
 
[00000007] [05/28/2019 12:58:50.90] [INFO] WindowsAzureGuestAgent starting. Version 2.7.41491.901

**Analysis**
 
The VM is still running the older version of the Windows Azure Guest Agent. In the C:\WindowsAzure folder, you may notice that multiple Windows Azure Guest Agent instances are installed, including several of the same version. Because multiple  agent instances are installed, the VM does not start the latest version of Windows Azure Guest Agent.

**Solution**

Manually uninstall the Windows Azure Guest Agent, and then reinstall it by following these steps:

1. Open Control Panel > Programs and Features, and uninstall the Windows Azure Guest Agent.
1. Open Task Manager, and stop the following services: Windows Azure Guest Agent Service, RDAgent service, Windows Azure Telemetry Service, and Windows Azure Network Agent service.
1. Under C:\WindowsAzure, create a folder that’s named OLD.
1. Move any folders that are named Packages or GuestAgent into the OLD folder. Also, move any of the GuestAgent folders in C:\WindowsAzure\logs that start as GuestAgent_x.x.xxxxx to the OLD folder.
1. Download and install the latest version of the MSI agent. You must have administrator rights to complete the installation.
1. Install Guest Agent by using the following MSI command:
    ```
    msiexec.exe /i c:\VMAgentMSI\WindowsAzureVmAgent.2.7.<version>.fre.msi /quiet /L*v c:\VMAgentMSI\msiexec.log`
    ```
1. Verify that the RDAgent, Windows Azure Guest Agent, and Windows Azure Telemetry services are now running.
 
1. Check the WaAppAgent.log to make sure that the latest version of Windows Azure Guest Agent is running.
 
1. Delete the OLD folder under C:\WindowsAzure.
  
### Unable to connect to WireServer IP (Host IP) 

You notice the following error entries in WaAppAgent.log and Telemetry.log:

**Log information**

```Log sample
[ERROR] GetVersions() failed with exception: Microsoft.ServiceModel.Web.WebProtocolException: Server Error: Service Unavailable (ServiceUnavailable) ---> 
System.Net.WebException: The remote server returned an error: (503) Server Unavailable.
```
```Log sample
[00000011] [12/11/2018 06:27:55.66] [WARN]  (Ignoring) Exception while fetching supported versions from HostGAPlugin: System.Net.WebException: Unable to connect to the remote server 
---> System.Net.Sockets.SocketException: An attempt was made to access a socket in a way forbidden by its access permissions 168.63.129.16:32526
at System.Net.Sockets.Socket.DoConnect(EndPoint endPointSnapshot, SocketAddress socketAddress)
at System.Net.ServicePoint.ConnectSocketInternal(Boolean connectFailure, Socket s4, Socket s6, Socket& socket, IPAddress& address, ConnectSocketState status, IAsyncResult asyncResult, Exception& exception)
--- End of inner exception stack trace ---
at System.Net.WebClient.DownloadDataInternal(Uri address, WebRequest& request)
at System.Net.WebClient.DownloadString(Uri address)
at Microsoft.GuestAgentHostPlugin.Client.GuestInformationServiceClient.GetVersions()
at Microsoft.WindowsAzure.GuestAgent.ContainerStateMachine.HostGAPluginUtility.UpdateHostGAPluginAvailability()`
```
**Analysis**

The VM cannot reach the wireserver host server.

**Solution**

1. Because wireserver is not reachable, connect to the VM by using Remote Desktop, and then try to access the following URL from an internet browser: http://168.63.129.16/?comp=versions 
1. If you cannot reach the URL from step 1, check the network interface to determine whether it is set as DHCP-enabled and has DNS. To check the DHCP status, of the network interface, run the following command:  `netsh interface ip show config`.
1. If DHCP is disabled, run the following making sure you change the value in yellow to the name of your interface: `netsh interface ip set address name="Name of the interface" source=dhcp`.
1. Check for any issues that might be caused by a firewall, a proxy, or other source that could be blocking access to the IP address 168.63.129.16.
1. Check whether Windows Firewall or a third-party firewall is blocking access to ports 80, 443, and 32526. For more information about why this address should not be blocked,  see [What is IP address 168.63.129.16](https://docs.microsoft.com/azure/virtual-network/what-is-ip-address-168-63-129-16).

### Guest Agent is stuck "Stopping"  

You notice the following error entries in WaAppAgent.log:

**Log information** 

```Log sample
[00000007] [07/18/2019 14:46:28.87] [WARN] WindowsAzureGuestAgent stopping.
[00000007] [07/18/2019 14:46:28.89] [INFO] Uninitializing StateExecutor with WaitForTerminalStateReachedOnEnd : True
[00000004] [07/18/2019 14:46:28.89] [WARN] WindowsAzureGuestAgent could not be stopped. Exception: System.NullReferenceException: Object reference not set to an instance of an object.
at Microsoft.WindowsAzure.GuestAgent.ContainerStateMachine.GoalStateExecutorBase.WaitForExtensionWorkflowComplete(Boolean WaitForTerminalStateReachedOnEnd)
at Microsoft.WindowsAzure.GuestAgent.ContainerStateMachine.GoalStateExecutorBase.Uninitialize(Boolean WaitForTerminalStateReachedOnEnd)
at Microsoft.WindowsAzure.GuestAgent.ContainerStateMachine.GoalStateExecutorForCloud.Uninitialize(Boolean WaitForTerminalStateReachedOnEnd)
at Microsoft.WindowsAzure.GuestAgent.AgentCore.AgentCore.Stop(Boolean waitForTerminalState)
at Microsoft.WindowsAzure.GuestAgent.AgentCore.AgentService.DoStopService()
at Microsoft.WindowsAzure.GuestAgent.AgentCore.AgentService.<>c__DisplayClass2.<OnStopProcessing>b__1()
```
**Analysis**

Windows Azure Guest Agent is stuck at the Stopping process.

**Solution**

1. Make sure that WaAppAgent.exe is running on the VM. If it is not running, restart the rdgagent service, and wait five minutes. When WaAppAgent.exe is running, end the WindowsAzureGuest.exe process.
2. If step 1 does not resolve the issue, remove the currently installed version and install the latest version of the agent manually.

### Npcap Loopback Adapter 

You notice the following error entries in WaAppAgent.log:
 
```Log sample
[00000006] [06/20/2019 07:44:28.93] [INFO]  Attempting to discover fabric address on interface Npcap Loopback Adapter.
[00000024] [06/20/2019 07:44:28.93] [WARN]  Empty DHCP option data returned
[00000006] [06/20/2019 07:44:28.93] [ERROR] Did not discover fabric address on interface Npcap Loopback Adapter
```
**Analysis**

The Npcap loopback adapter is installed on the VM by Wireshark. Wireshark is an open-source tool for profiling network traffic and analyzing packets. Such a tool is often referred to as a network analyzer, network protocol analyzer, or sniffer.

**Solution**

The Npcap Loopback Adapter is likely installed by WireShark. Try disabling it, and then check whether the problem is resolved.

## Next steps

To further troubleshoot the “Windows Azure Guest Agent is not working” issue, [contact Microsoft support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).