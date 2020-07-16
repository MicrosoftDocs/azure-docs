---
title: Windows Azure Guest Agent – Windows Machines – Overview and Deep Dive
description: Details of Windows Azure Guest Agent in Windows Machines with troubleshooting 
services: virtual-machines-windows
documentationcenter: virtual-machines

---

# Windows Azure Guest Agent – Windows Machines – Overview and Deep Dive

Windows Azure Guest Agent is the VM Agent in Windows Machines . It allows the communication of Windows VMs ( Guest ) with the Fabric Controller ( Underlying Host on which VM is hosted ) on IP address 168.63.129.16 which is a  virtual public IP address facilitating this communication . For more details on this IP and what all its facilitates , read through https://docs.microsoft.com/en-us/azure/virtual-network/what-is-ip-address-168-63-129-16 (what-is-ip-address-168-63-129-16.md)

When you deploy a Windows Virtual Machine using Azure gallery Image, Windows Azure Guest Agent ( WAGA ) is by default installed in the machine . But in case the Virtual Machine is migrated to Azure from On-Premise or from another environment using a customized image , it will not have WAGA installed and you have to manually install it . Read through https://docs.microsoft.com/en-us/azure/virtual-machines/extensions/agent-windows to install VM Agent manually on a VM . 

When the WAGA is successfully installed, you will be able to see following below three services under services.msc within Virtual Machines :
 
1.	Windows Azure Guest Agent Service
2.	Telemetry Service 
3.	RD Agent service 

1.	Windows Azure Guest Agent Service : This is the actual Windows Azure Guest Agent service which is responsible for all the logging under WappAgent.log . It is the one which is responsible for configuring various extensions and actual communication from Guest (VM ) to Host . 
2.	Telemetry Service : This is responsible for sending the telemetry data of the VM to the backend Host . 
3.	RD Agent Service : Responsible for the Installation of Guest Agent . Transparent Installer is also a component of Rd Agent that helps in upgrading other components and services of Guest Agent . Also, RDAgent is responsible for sending heartbeats from Guest (VM ) to Host Agent on Host . 

> [!NOTE]
> Starting with version 2.7.41491.971, the Telemetry component is included into the RDAgent service - so you might not see this service in recent versions. 

## Checking Agent Status and Version

Make sure your VM is Running to know the status and version of your Guest Agent else it will show N/A .

If the VM Agent is working fine, it will be in Ready state. You can navigate to VM properties blade in Azure portal to check the Agent information. 

> [!NOTE]
> Extensions , Run Command on portal won’t work  if VM Agent is in Not Ready State or if VM is stopped.

## Basic Troubleshooting of VM Agent in NOT READY state :

1.	Check if the WAGA is installed.

- Packages 
 
If you go the location C:\WindowsAzure , you will be able to see the Guest Agent folder with version which means that Windows Azure Guest Agent was installed on the system.

If WAGA was never installed in your system , you may not see the Windows Azure folder under C:\
 
Another way to check is that when you have Windows Azure Guest Agent installed in the VM, the package can be located under the following location -C:\windows\OEM\GuestAgent\VMAgentPackage.zip

- You can run the following PowerShell command to check if VM agent has been deployed to the VM :

Get-Az VM -ResourceGroup “RGNAME” – Name “VMNAME” -displayhint expand 

The output containing the section with property of ProvisionVMAgent as follows shows that VM Agent has been deployed to the VM :

- Services and Processes
 
Go to the Services console (services.msc) and check the state of the RDAGENT / WINDOWS AZURE GUEST AGENT / WINDOWS AZURE TELEMETRY SERVICE / WINDOWS AZURE NETWORK AGENT services. 
 
You can also check in the VM's Task Manager if the following processes are running:
-	WaAppAgent.exe - RDAgent service
-	WindowsAzureGuestAgent.exe - WindowsAzureGuestAgent service
-	WindowsAzureNetAgent.exe - WindowsAzureNetAgentSvc service
-	WindowsAzureTelemetryService.exe - WindowsAzureTelemetryService service - used for guest agent telemetry - Note that starting with version 2.7.41491.971, the Telemetry component is included into the RDAgent service - so you might not see this service in recent versions.
 
If you cannot find these Processes and Services running , it indicates you do not have Windows Azure Guest Agent installed . 

- Check installation under programs of windows 
 
In Control Panel, go to Programs and Features to determine whether the Windows Azure Guest Agent service is installed.
 
If you do not find any packages , do not see any services/processes running and do not even see Windows Azure Guest Agent installed under Programs and Features , try installing WAGA https://docs.microsoft.com/en-us/azure/virtual-machines/extensions/agent-windows
 
In very rare cases where Guest Agent doesn't install properly, you can attempt the https://docs.microsoft.com/en-us/azure/virtual-machines/troubleshooting/install-vm-agent-offline

2.	If you can see the services and in case they are running , restart them . In case they are stopped, start them and after few minutes , check again if the VM Agent is reporting as " Ready"  . If you notice that these services are crashing, there maybe some third party processes causing these Services to crash and need further troubleshooting for which you may contact Microsoft Support . 

3. Guest Agent has an auto-update feature, so it will automatically check for new updates and install them automatically. In case the auto-update doesn't work correctly, for Windows Guest Agent, try uninstalling and installing the WAGA again. 

a. If the Windows Azure Guest Agent appears in Programs and Features, uninstall the Windows Azure Guest Agent.

b. Open Command Prompt with Administrator privileges .

c. Stop the Guest Agent Services, if the services does not stop you will need to set the services to manual start up and restart the VM.
net stop rdagent
net stop WindowsAzureGuestAgent
net stop WindowsAzureTelemetryService

d. Delete the Guest Agent Services
sc delete rdagent
sc delete WindowsAzureGuestAgent
sc delete WindowsAzureTelemetryService

e. Under C:\WindowsAzure create a folder called OLD.

f. Move any folder named Packages or GuestAgent into the OLD folder.

g. Download and install the latest version of the agent MSI from here - https://go.microsoft.comfwlink/?linkid=394789&clcid=0x409. You must have Administrator rights to complete the installation.

h. Install guest agent using the MSI command below

msiexec.exe /i c:\VMAgentMSI\WindowsAzureVmAgent.2.7.<version>.fre.msi /quiet /L*v c:\VMAgentMSI\msiexec.log

Guest agent should install and services should come up.
 
In very rare cases where Guest Agent doesn't install properly, you can attempt the https://docs.microsoft.com/en-us/azure/virtual-machines/troubleshooting/install-vm-agent-offline

4. Check the connectivity of VM to Public IP :  168.63.129.16 using psping on this IP on ports 80 and 443 . If it isn’t connecting as expected kindly check if outbound communication over ports 80, 443, 32526 is open in your local firewall ( Windows firewall )  of the VM . If this IP address is blocked, unexpected behavior of VM Agent can occur in a variety of scenarios.

## Advanced Troubleshooting

For deep dive into advanced troubleshooting, there are two logs files which you should be aware of for troubleshooting Windows Azure Guest Agent :

- C:\WindowsAzure\Logs\WaAppAgent.log
- C:\WindowsAzure\Logs\TransparentInstaller.log

This could be helpful for troubleshooting from your end and also when you log a support ticket with Microsoft, they will generally require these logs to deep dive . 

Here are some common scenarios which usually lead to WAGA being in NOT READY state or not working as expected . Find below such common scenarios and mitigations :

### 1. Agent Stuck on Starting

In waappagent.log file you can see that Agent is stuck starting but unable to start  :

#### Log Lines Indication : 
 
[00000007] [05/28/2019 12:58:50.90] [INFO] WindowsAzureGuestAgent starting. Version 2.7.41491.901

#### Analysis :
 
You will see that VM is still running the older version of the WAGA . Looking at C:\WindowsAzure folder you can see that there are multiple WAGAs' installed including several of same version. Here since multiple WAGAs' are installed of same newer version, it fails to start the latest version of WAGA . 

#### Mitigation :

Manually uninstall the WAGA and reinstall it using the steps below :

a.	In Programs and Features, uninstall the Windows Azure Guest Agent.

b.	Open Task Manager and stop the WAGA Services.
i.	Stop the Windows Azure Guest Agent service.
ii. Stop the Windows Azure Telemetry service.
iii. Stop the RDAgent service.

c.	Under C:\WindowsAzure create a folder called OLD.

d.	Move any folders named Packages or GuestAgent into the OLD folder. Also, move any of the GuestAgent folders in C:\WindowsAzure\logs that start with GuestAgent_x.x.xxxxx to the OLD folder created earlier.
 
e.	Download and install the latest version of the agent MSI. You must have Administrator rights to complete the installation.

f.	Install guest agent using the MSI command below

msiexec.exe /i c:\VMAgentMSI\WindowsAzureVmAgent.2.7.<version>.fre.msi /quiet /L*v c:\VMAgentMSI\msiexec.log
 
g. Verify the RDAgent, Windows Azure Guest Agent and Windows Azure Telemetry services are now running.
 
h.	Check the WaAppAgent.log that it is reporting that is has started the correct version of the WinGA.
 
i. Delete the OLD folder in C:\WindowsAzure.
  
### 2. Unable to connect to WireServer IP ( Host IP ) 

You can find following logs in waappagent.log and telemetry.log :

#### Log Lines Indication : 

[ERROR] GetVersions() failed with exception: Microsoft.ServiceModel.Web.WebProtocolException: Server Error: Service Unavailable (ServiceUnavailable) ---> 
System.Net.WebException: The remote server returned an error: (503) Server Unavailable.
 
OR 
 
[00000011] [12/11/2018 06:27:55.66] [WARN]  (Ignoring) Exception while fetching supported versions from HostGAPlugin: System.Net.WebException: Unable to connect to the remote server 
---> System.Net.Sockets.SocketException: An attempt was made to access a socket in a way forbidden by its access permissions 168.63.129.16:32526
at System.Net.Sockets.Socket.DoConnect(EndPoint endPointSnapshot, SocketAddress socketAddress)
at System.Net.ServicePoint.ConnectSocketInternal(Boolean connectFailure, Socket s4, Socket s6, Socket& socket, IPAddress& address, ConnectSocketState state, IAsyncResult asyncResult, Exception& exception)
--- End of inner exception stack trace ---
at System.Net.WebClient.DownloadDataInternal(Uri address, WebRequest& request)
at System.Net.WebClient.DownloadString(Uri address)
at Microsoft.GuestAgentHostPlugin.Client.GuestInformationServiceClient.GetVersions()
at Microsoft.WindowsAzure.GuestAgent.ContainerStateMachine.HostGAPluginUtility.UpdateHostGAPluginAvailability()

#### Analysis :

Machine is not able to reach the Wireserver ( Host ) . 

#### Mitigation :

i.	As wireserver is not reachable in this case , confirm by taking RDP to the machine and try to access the following url from a IE browser: http://168.63.129.16/?comp=versions 
 
ii. If you are unable to reach this URL check the Network Interface is set for DHCP enabled and has DNS. 
 
iii. For checking is DHCP is enabled , run the following command : netsh interface ip show config 
 
iv. If DHCP is disabled then execute the following making sure you change the value in yellow to the name of your interface: 
 
netsh interface ip set address name="Name of the interface" source=dhcp
 
v. Check for any firewall, proxy or other issue that could be blocking access to this Fabric IP address.
 
vi. Windows Firewall (or another guest 3rd party software) could be blocking access to ports 80, 443 and/or 32526.
 
vii. You might find documentation about why this address should not be blocked at: https://docs.microsoft.com/en-us/azure/virtual-network/what-is-ip-address-168-63-129-16

### 3. Guest Agent stuck Stopping  

You can find the following errors in WaAppAgent.log :

#### Log Lines Indication : 

[00000007] [07/18/2019 14:46:28.87] [WARN] WindowsAzureGuestAgent stopping.
[00000007] [07/18/2019 14:46:28.89] [INFO] Uninitializing StateExecutor with WaitForTerminalStateReachedOnEnd : True
[00000004] [07/18/2019 14:46:28.89] [WARN] WindowsAzureGuestAgent could not be stopped. Exception: System.NullReferenceException: Object reference not set to an instance of an object.
at Microsoft.WindowsAzure.GuestAgent.ContainerStateMachine.GoalStateExecutorBase.WaitForExtensionWorkflowComplete(Boolean WaitForTerminalStateReachedOnEnd)
at Microsoft.WindowsAzure.GuestAgent.ContainerStateMachine.GoalStateExecutorBase.Uninitialize(Boolean WaitForTerminalStateReachedOnEnd)
at Microsoft.WindowsAzure.GuestAgent.ContainerStateMachine.GoalStateExecutorForCloud.Uninitialize(Boolean WaitForTerminalStateReachedOnEnd)
at Microsoft.WindowsAzure.GuestAgent.AgentCore.AgentCore.Stop(Boolean waitForTerminalState)
at Microsoft.WindowsAzure.GuestAgent.AgentCore.AgentService.DoStopService()
at Microsoft.WindowsAzure.GuestAgent.AgentCore.AgentService.<>c__DisplayClass2.<OnStopProcessing>b__1()

#### Analysis :

WAGA is stuck on stopping . It is trying to stop but unable to stop . 

#### Mitigation :

1.	Make sure that waappagent.exe is running on the machine. If not running, restart the rdgagent service and wait for 5 minutes. While waappagent.exe is running kill the WindowsAzureGuest.exe process.
2.	If this does not solve the issue, update the agent manually to the latest version cleaning the old version first. 

### 4. Npcap Loopback Adapter 

You can find the following errors in WaAppAgent.log :
 
[00000006] [06/20/2019 07:44:28.93] [INFO]  Attempting to discover fabric address on interface Npcap Loopback Adapter.
[00000024] [06/20/2019 07:44:28.93] [WARN]  Empty DHCP option data returned
[00000006] [06/20/2019 07:44:28.93] [ERROR] Did not discover fabric address on interface Npcap Loopback Adapter

#### Analysis :

Npcap loopback adapter is introduced on the machine by Wireshark . Wireshark is an open source tool for profiling network traffic and analyzing packets. Such a tool is often referred to as a network analyzer, network protocol analyzer or sniffer.

#### Mitigation :

The Npcap Loopback Adapter is likely installed by WireShark. Try disabling it and checking . 

## Next steps

For further troubleshooting and concerns where WAGA is not working as expected , contact Microsoft Support . 
