---
 title: Custom Data and Cloud-Init on Azure Virtual Machines
 description: Details on using Custom Data and Cloud-Init on Azure Virtual Machines
 services: virtual-machines
 author: mimckitt
 ms.service: virtual-machines
 ms.topic: article
 ms.date: 03/06/2020
 ms.author: mimckitt
---

# Custom Data and Cloud-Init on Azure Virtual Machines

## What is Custom Data?

Customers often ask how they can inject a script or other metadata into a Microsoft Azure virtual machine at provision time.  In other clouds this concept is often referred to as user data.  In Microsoft Azure we have a similar feature called custom data. Custom data is sent to the VM along with the other provisioning configuration information such as the new hostname, username, password, certificates and keys, etc.  This data is passed to the Azure API as base64-encoded data.  On Windows this data ends up in %SYSTEMDRIVE%\AzureData\CustomData.bin as a binary file.  On Linux, this data is passed to the VM via the ovf-env.xml file, which is copied to the /var/lib/waagent directory during provisioning.  Newer versions of the Microsoft Azure Linux Agent will also copy the base64-encoded data to /var/lib/waagent/CustomData as well for convenience.

## What About Cloud-Init?
Currently, only the Ubuntu images in the Microsoft Azure Gallery have cloud-init preinstalled and configured to act on the custom data sent during provisioning.  This means that for Ubuntu you can use custom data to provision a VM using a cloud-init configuration file, or just simply send a script that will be executed by cloud-init during provisioning.  See the cloud-init documentation for more information. If cloud-init is not available on the image, then you can still make use of the custom data provided you preinstall a script or other tool on the system that can read the data.  In this case a script could be installed to run at boot time that can read in the custom data via the %SYSTEMDRIVE%\AzureData\CustomData.bin (Windows) or the /var/lib/waagent/ovf-env.xml (Linux) file, decode it and act on the data.  Once the script is installed the Windows or Linux image can then be deprovisioned and captured for reuse.

## How Does It Work?
Currently, the easiest way to inject custom data into an IaaS VM is to use the Windows Azure command-line tools.  Support for this feature in the Microsoft Azure Powershell cmdlets is not yet available, but is coming soon in an upcoming release. As of version 0.7.5 of the CLI tools there is a new parameter called --custom-data.  This parameter takes a file name as an argument, and the tools will then base64 encode the contents of the file and send it along with the provisioning configuration information.  The only limit here is that the file must be less than 64KB or the Azure API will not accept the request. The following is a simple example of how to provision and pass custom data to an Ubuntu Linux VM:  In this example, custom-data.txt could be a cloud-init configuration file, or simply a shell script (as long as it starts with #!, then cloud-init will execute it). Give it a try.
