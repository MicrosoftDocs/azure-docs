---
title: Troubleshooting Windows Azure Guest Agent
description: Troubleshoot the Windows Azure Guest Agent is not working issues
services: virtual-machines-windows
ms.service: virtual-machines-windows
author: genlin
manager: dcscontentpm
editor: 
ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 08/07/2020
ms.author: genli
---
# Troubleshooting Windows Azure Guest Agent

Windows Azure Guest Agent is a virtual machine (VM) Agent in Azure Windows VMs. It allows the VM to communicate with the Fabric Controller (Underlying Host on which VM is hosted) on IP address 168.63.129.16. This IP address is a virtual public IP address that facilitates the communication. For more information, see [What is IP address 168.63.129.16](https://docs.microsoft.com/azure/virtual-network/what-is-ip-address-168-63-129-16).

 The VM that is migrated to Azure from on-Premises or is created by using a customized image doesn't have the Windows Azure Guest Agent installed. In these scenarios, you have to manually install it. For more information about how to install the VM Agent, see [Azure Virtual Machine Agent Overview](https://docs.microsoft.com/azure/virtual-machines/extensions/agent-windows).

When the Windows Azure Guest Agent is successfully installed, you can see following three services under services.msc within the VM:
 
- Windows Azure Guest Agent Service
- Telemetry Service
- RD Agent service

**Windows Azure Guest Agent Service**: This is the actual Windows Azure Guest Agent service which is responsible for all the logging under WappAgent.log. It is the one which is responsible for configuring various extensions and actual communication from Guest to Host. 

**Telemetry Service**: This is responsible for sending the telemetry data of the VM to the backend Host.

**RD Agent Service**: Responsible for the Installation of Guest Agent. Transparent Installer is also a component of Rd Agent that helps in upgrading other components and services of Guest Agent. Also, RDAgent is responsible for sending heartbeats from Guest (VM ) to Host Agent on Host. 

> [!NOTE]
> Starting with version 2.7.41491.971 of the VM guest agent, the Telemetry component is included into the RDAgent service, so you might not see this service in newly created VMs.

## Checking Agent Status and Version

Go to to VM properties page in Azure portal, check the **Agent status**. If the Windows Azure Guest Agent is working correctly, the status shows **Ready**. If VM Agent is in **Not Ready** status, the extensions and **Run Command** on the Azure portal won’t work.

## Troubleshooting VM Agent that is in not ready status

### Step 1 Check if the Windows Azure Guest Agent service is installed

You can use one of the following methods to check if  the Windows Azure Guest Agent service is installed:

- Check the Package

    Go to the `C:\WindowsAzure` folder, if you see the **GuestAgent** folder with version, that means the Windows Azure Guest Agent was installed on the VM. Another way to check is that when you have Windows Azure Guest Agent installed in the VM, the package was saved in the following location: `C:\windows\OEM\GuestAgent\VMAgentPackage.zip`.
    
    You can run the following PowerShell command to check if VM agent has been deployed to the VM:
    
    `Get-Az VM -ResourceGroup “RGNAME” – Name “VMNAME” -displayhint expand`
    
    In the output, locate the **ProvisionVMAgent** property and check if the value is true, that means the agent is installed on the VM.
    
- Check the Services and Processes

    Go to the Services console (services.msc) and check the status of the following services: Windows Azure Guest Agent Service, RDAgent service, Windows Azure Telemetry Service and Windows Azure Network Agent service.
 
    You can also check if these services are running by checking the task manager for the following process:
       
    - WindowsAzureGuestAgent.exe - Windows Azure Guest Agent service
    - WaAppAgent.exe - RDAgent service
    - WindowsAzureNetAgent.exe - Windows Azure Network Agent service
    - WindowsAzureTelemetryService.exe - Windows Azure Telemetry Service

    If you cannot find these processes and services, it indicates you do not have Windows Azure Guest Agent installed.

- Check the program and feature

    In Control Panel, go to **Programs and Features** to determine whether the Windows Azure Guest Agent service is installed.

If you don't find any packages, services and processes running and do not even see Windows Azure Guest Agent installed under Programs and Features, try [installing Windows Azure Guest Agent service](https://docs.microsoft.com/azure/virtual-machines/extensions/agent-windows). If the Guest Agent doesn't install properly, you can [Install the VM agent offline](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/install-vm-agent-offline).

If you can see the services and they are running, restart the service that see if the problem is resolved. If the services are stopped, start them and wait few minutes, and then check if the **Agent status** is reporting as **Ready**. If you find that these services are crashing, there maybe some third party processes causing these services to crash and need further troubleshooting for which you may need to contact Microsoft Support.

### Step 2 Check if auto-update feature is working

The Windows Azure Guest Agent has an auto-update feature, so it will automatically check for new updates and install them automatically. If the auto-update doesn't work correctly, try uninstalling and installing the Windows Azure Guest Agent by using the following steps:

1. If the Windows Azure Guest Agent appears in **Programs and Features**, uninstall the Windows Azure Guest Agent.

2. Open Command Prompt with Administrator privileges.

3. Stop the Guest Agent Services. If the services do not stop, you must set the services to **manual startup** and restart the VM.
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
1. Under `C:\WindowsAzure` create a folder called OLD.

1. Move any folder named Packages or GuestAgent into the OLD folder.

1. Download and install the latest version of the agent installation package from [here](https://go.microsoft.comfwlink/?linkid=394789&clcid=0x409). You must have Administrator rights to complete the installation.

1. Install guest agent using the MSI command below

    ```
    msiexec.exe /i c:\VMAgentMSI\WindowsAzureVmAgent.2.7.<version>.fre.msi /quiet /L*v c:\VMAgentMSI\msiexec.log
    ```
    Guest agent should install and services should come up.
 
    In very rare cases where Guest Agent doesn't install properly, you can [Install the VM agent offline](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/install-vm-agent-offline).
    

### Step 4 Check if the VM can connect to the Fabric Controller

 Use the tool such as PsPing to test if the VM can connect to 168.63.129.16 on ports 80, 32526 and 443. If it isn’t connecting as expected,  check if outbound communication over ports 80, 443 and 32526 is open in your local firewall of the VM. If this IP address is blocked, unexpected behavior of VM Agent can occur in a variety of scenarios.

## Advanced Troubleshooting

There are two logs files which you should be aware of for troubleshooting Windows Azure Guest Agent:

- C:\WindowsAzure\Logs\WaAppAgent.log
- C:\WindowsAzure\Logs\TransparentInstaller.log

Here are some common scenarios which usually lead to  Windows Azure Guest Agent being in **Not ready** status or not working as expected. The followings are the common issues with suggested solution.

### Agent Stuck on Starting

In waappagent.log file, you can see that Agent is stuck starting but unable to start:

**Log Lines Indication**
 
[00000007] [05/28/2019 12:58:50.90] [INFO] WindowsAzureGuestAgent starting. Version 2.7.41491.901

**Analysis**
 
You will see that VM is still running the older version of the Windows Azure Guest Agent. Looking at C:\WindowsAzure folder, you may see that there are multiple Windows Azure Guest Agent are installed including several same versions. Since multiple Windows Azure Guest Agent is installed, the VM fails to start the latest version of Windows Azure Guest Agent. 

**Solution**

Manually uninstall the Windows Azure Guest Agent, and then reinstall it by using the following steps :

1. In Programs and Features, uninstall the Windows Azure Guest Agent.
1. Open Task Manager, and then stop the following services:  Windows Azure Guest Agent Service, RDAgent service, Windows Azure Telemetry Service and Windows Azure Network Agent service.
1. Under C:\WindowsAzure create a folder called OLD.
1. Move any folders named Packages or GuestAgent into the OLD folder. Also, move any of the GuestAgent folders in C:\WindowsAzure\logs that start with GuestAgent_x.x.xxxxx to the OLD folder created earlier.
1. Download and install the latest version of the agent MSI. You must have Administrator rights to complete the installation.
1. Install guest agent by using the following MSI command below
    ```
    msiexec.exe /i c:\VMAgentMSI\WindowsAzureVmAgent.2.7.<version>.fre.msi /quiet /L*v c:\VMAgentMSI\msiexec.log`
    ```
1. Verify the RDAgent, Windows Azure Guest Agent and Windows Azure Telemetry services are now running.
 
1. Check the WaAppAgent.log to make sure that the latest version of Windows Azure Guest Agent is running.
 
i. Delete the OLD folder in C:\WindowsAzure.
  
### Unable to connect to WireServer IP (Host IP) 

You can find following logs in waappagent.log and telemetry.log:

**Log Lines Indication**

- [ERROR] GetVersions() failed with exception: Microsoft.ServiceModel.Web.WebProtocolException: Server Error: Service Unavailable (ServiceUnavailable) ---> 
System.Net.WebException: The remote server returned an error: (503) Server Unavailable.`
 
- [00000011] [12/11/2018 06:27:55.66] [WARN]  (Ignoring) Exception while fetching supported versions from HostGAPlugin: System.Net.WebException: Unable to connect to the remote server 
---> System.Net.Sockets.SocketException: An attempt was made to access a socket in a way forbidden by its access permissions 168.63.129.16:32526
at System.Net.Sockets.Socket.DoConnect(EndPoint endPointSnapshot, SocketAddress socketAddress)
at System.Net.ServicePoint.ConnectSocketInternal(Boolean connectFailure, Socket s4, Socket s6, Socket& socket, IPAddress& address, ConnectSocketState status, IAsyncResult asyncResult, Exception& exception)
--- End of inner exception stack trace ---
at System.Net.WebClient.DownloadDataInternal(Uri address, WebRequest& request)
at System.Net.WebClient.DownloadString(Uri address)
at Microsoft.GuestAgentHostPlugin.Client.GuestInformationServiceClient.GetVersions()
at Microsoft.WindowsAzure.GuestAgent.ContainerStateMachine.HostGAPluginUtility.UpdateHostGAPluginAvailability()`

**Analysis**

The VM is not able to reach the Wireserver (Host). 

**Solution**

1. As wireserver is not reachable, connect to the VM by using remote desktop, and then try to access the following url from an Internet browser: http://168.63.129.16/?comp=versions 
1. If you are unable to reach this URL, check the Network Interface to see if it is set for DHCP enabled and has DNS. 
1. To check if DHCP is enabled, run the following command: `netsh interface ip show config`.
1. If DHCP is disabled, run the following making sure you change the value in yellow to the name of your interface: `netsh interface ip set address name="Name of the interface" source=dhcp`.
1. Check for any firewall, proxy or other issue that could be blocking access to this Fabric IP address.
1. Check if Windows Firewall or another guest third-party firewall is blocking access to ports 80, 443 and 32526. For more information about why this address should not be blocked, see [What is IP address 168.63.129.16](https://docs.microsoft.com/azure/virtual-network/what-is-ip-address-168-63-129-16).

### Guest Agent is stuck Stopping  

You can find the following errors in WaAppAgent.log:

**Log Lines Indication** 

[00000007] [07/18/2019 14:46:28.87] [WARN] WindowsAzureGuestAgent stopping.
[00000007] [07/18/2019 14:46:28.89] [INFO] Uninitializing StateExecutor with WaitForTerminalStateReachedOnEnd : True
[00000004] [07/18/2019 14:46:28.89] [WARN] WindowsAzureGuestAgent could not be stopped. Exception: System.NullReferenceException: Object reference not set to an instance of an object.
at Microsoft.WindowsAzure.GuestAgent.ContainerStateMachine.GoalStateExecutorBase.WaitForExtensionWorkflowComplete(Boolean WaitForTerminalStateReachedOnEnd)
at Microsoft.WindowsAzure.GuestAgent.ContainerStateMachine.GoalStateExecutorBase.Uninitialize(Boolean WaitForTerminalStateReachedOnEnd)
at Microsoft.WindowsAzure.GuestAgent.ContainerStateMachine.GoalStateExecutorForCloud.Uninitialize(Boolean WaitForTerminalStateReachedOnEnd)
at Microsoft.WindowsAzure.GuestAgent.AgentCore.AgentCore.Stop(Boolean waitForTerminalState)
at Microsoft.WindowsAzure.GuestAgent.AgentCore.AgentService.DoStopService()
at Microsoft.WindowsAzure.GuestAgent.AgentCore.AgentService.<>c__DisplayClass2.<OnStopProcessing>b__1()

**Analysis**

The Windows Azure Guest Agent is stuck on stopping. 

**Solution**

1.Make sure that waappagent.exe is running on the VM. If it is not running, restart the rdgagent service and wait for 5 minutes. While waappagent.exe is running, end the WindowsAzureGuest.exe process.
2. If this step does not solve the issue, update the agent manually to the latest version cleaning the old version first. 

### Npcap Loopback Adapter 

You can find the following errors in WaAppAgent.log :
 
[00000006] [06/20/2019 07:44:28.93] [INFO]  Attempting to discover fabric address on interface Npcap Loopback Adapter.
[00000024] [06/20/2019 07:44:28.93] [WARN]  Empty DHCP option data returned
[00000006] [06/20/2019 07:44:28.93] [ERROR] Did not discover fabric address on interface Npcap Loopback Adapter

**Analysis**

Npcap loopback adapter is introduced on the machine by Wireshark. Wireshark is an open-source tool for profiling network traffic and analyzing packets. Such a tool is often referred to as a network analyzer, network protocol analyzer or sniffer.

**Solution**

The Npcap Loopback Adapter is likely installed by WireShark. Try disabling it and check if the problem is resolved.

## Next steps

For further troubleshooting the Windows Azure Guest Agent is not working issue,  please create a support request.