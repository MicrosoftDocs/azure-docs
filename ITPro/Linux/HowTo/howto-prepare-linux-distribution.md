<properties umbracoNaviHide="0" pageTitle="How to Prepare a Linux Distribution for Running in Windows Azure" metaKeywords="Windows Azure virtual machine, Azure virtual machine, linux, centos, ubuntu, suse, opensuse" metaDescription="Learn how to use the service management api." linkid="manage-linux-how-to-guide-virtual-machines" urlDisplayName="How To Guides" headerExpose="" footerExpose="" disqusComments="1" />
#How to Prepare a Linux Distribution for Windows Azure

This topic describes the steps needed to customize and create images for the different distributions that our partners have tested.

For all distributions note the following:

- The Windows Azure Linux Agent (Waagent) is not compatible with NetworkManager. Networking configuration should use the ifcfg-eth0 file and should be controllable via the ifup/ifdown scripts. Waagent will refuse to install if the NetworkManager package is detected.

- NUMA is not supported because the Linux kernel versions below 2.6.37 have a bug. The installation of waagent will automatically disable NUMA in the GRUB configuration for the Linux kernel command line.

The Windows Azure Linux Agent Requires python-pyasn1 package installed.

All of your VHDs for the OS must have sizes that are multiples of 1 MB.

##Table of Contents##

* [CentOS](#CentOS)
* [Ubuntu 12.04](#Ubuntu)
* [SUSE Linux Enterprise Server 11 SP2](#SUSE)
* [Opensuse 12.1](#Opensuse)
* [Upstream kernel](#Upstream)

<h2 id="CentOS">CentOS 6.2</h2>

1.	The Hyper-V drivers are not present in the distribution. Please download the latest Hyper-V drivers from the location provided to you by Microsoft. 

2.	On an existing Linux system, please create an ISO image with the Hyper-V driver RPMs (and optionally, the python-pyasn1 RPM). 

		mkdir iso/
		cp kmod*.rpm microsoft*.rpm iso/
		mkisofs -o install.iso -R -J iso/

4.	Install CentOS in a VM and attach the ISO and mount it.  

		mkdir /mnt/cdrom
		mount /dev/sr0 /mnt/cdrom

6.	Install the Hyper-V driver RPMs.

		rpm –ivh kmod*.rpm
		rpm –ivh microsoft*.rpm

7.	Uninstall NetworkManager

		rpm -e –nodeps NetworkManager

8.	Set up networking by creating the following files:

	* /etc/sysconfig/network
	
		With this content:
	
			NETWORKING=yes
			HOSTNAME=localhost.localdomain

	* /etc/sysconfig/network-scripts/ifcfg-eth0

		With this content
			
			DEVICE=eth0
			ONBOOT=yes
			DHCP=yes
			BOOTPROTO=dhcp
			TYPE=Ethernet
			USERCTL=no
			PEERDNS=yes
			IPV6INIT=no	

11.	Enable the network service by running:

		chkconfig network on

12.	Reboot the VM to connect to the network (you may skip this step if python-pyasn1 is also available in the ISO).

		Install python-pyasn1
		yum install python-pyasn1

15.	You will then need to install the Linux Agent RPM:

		rpm –ivh WALinuxAgent-1.0-1.noarch.rpm

16.	You will then need to make sure that you are meeting the image requirements
17.	Comment out `Defaults targetpw` in /etc/sudoers
18.	SSH Server included by default
19.	No SWAP on Host OS DISK should be created 
20.	SWAP if needed can be requested for creation on the local resource disk by the Linux Agent. You may modify /etc/waagent.conf appropriately.
21.	At this point you are ready to finish the image:

		waagent –force –deprovision
		export HISTSIZE=0
		logout

22.	Shutdown using the HyperV shutdown button.

<h2 id="Ubuntu">Ubuntu 12.04</h2>

1.	Create a new Hyper-V VM in Windows 2008 R2 with a VHD of up to 128GB . You will need to use the Windows Azure Linux command line tools [http://go.microsoft.com/fwlink/?LinkID=253691&clcid=0x409](http://www.windowsazure.com/en-us/) to upload the VHD if you use a dynamic VHD or  you can use any tool if you use a fixed size VHD.
2.	Install Ubuntu 12.04 server 64 bit. We recommend not creating a SWAP partition at installation time. SWAP space may be configured using the Windows Azure Linux Agent.
3.	Update to the latest kernel:
	
	- apt-get update
	- apt-get install linux-image-virtual
	- apt-get install linux-headers-virtual

4.	Disable the legacy ATA driver by adding the following to the kernel command line in /boot/grub/grub.cfg: ata_piix.disable_driver

	**Note:** this kernel option was only recently added by  Canonical to its kernel tree and might not have been released by the time you are attempting this. You can put the following to kernel command line in /boot/grub/grub.cfg: reserve=0x1f0, 0x8. (This option reserves this I/O region and prevents ata_piix from loading)

5.	Install the Windows Azure Linux Agent.
[http://go.microsoft.com/fwlink/?LinkID=251942&clcid=0x409](http://www.windowsazure.com/en-us/)
6.	Fix the Grub timeout. Ubuntu waits at Grub for user input after a system crash, this is not ideal for the cloud environment.

	- Open file /etc/grub.d/00_header, in function make\_timeout(), search for
		
			“if [“\${recordfail}” = 1 ]; then

	- Change the statement below to `set timeout=5`

	- Do a update-grub

7.	Upload and deploy to Windows Azure.


##Ubuntu 12.04##

1.	Create a new Hyper-V VM in Windows 2008 R2 with a VHD of up to 128GB. You will need to use the Windows Azure Linux command line tools [http://go.microsoft.com/fwlink/?LinkID=253691&clcid=0x409](http://www.windowsazure.com/en-us/) ¬  to upload the VHD if you use a dynamic VHD or  you can use any tool if you use a fixed size VHD.
1.	Install Ubuntu 12.04 server 64 bit. We recommend not creating a SWAP partition at installation time. SWAP space may be configured using the Windows Azure Linux Agent.
3.	Update to the latest kernel:

	- apt-get update
	- apt-get install linux-image-virtual
	- apt-get install linux-headers-virtual

4.	Disable the legacy ATA driver by adding the following to the kernel command line in /boot/grub/grub.cfg: ata_piix.disable_driver

	**Note:** This kernel option was only recently added by Canonical to its kernel tree and might not have been released by the time you are attempting this. You can put the following to kernel command line in /boot/grub/grub.cfg: reserve=0x1f0, 0x8. (This option reserves this I/O region and prevents ata_piix from loading)

5.	Install the Windows Azure Linux Agent.
[http://go.microsoft.com/fwlink/?LinkID=251942&clcid=0x409](http://www.windowsazure.com/en-us/)
6.	Fix the Grub timeout. Ubuntu waits at Grub for user input after a system crash, this is not ideal for the cloud environment.

	- Open file /etc/grub.d/00_header, in function make\_timeout (), search for

			 if [“\${recordfail}” = 1 ]; then

	- Change the statement below to `set timeout=5`

	- Do a update-grub

7.	Upload and deploy to Windows Azure.


<h2 id="SUSE">SUSE Linux Enterprise Server 11 SP2</h2>

1.	Create a new Hyper-V VM in Windows 2008 R2 with a VHD of up to 128GB. You will need to use the Windows Azure Linux command line tools [http://go.microsoft.com/fwlink/?LinkID=253691&clcid=0x409](http://www.windowsazure.com/en-us/) ¬  to upload the VHD if you use a dynamic VHD or  you can use any tool if you use a fixed size VHD.
2.	Install SLES 11SP2 64 bit. We recommend not creating a SWAP partition at installation time. SWAP space may be configured using the Windows Azure Linux Agent.
3.	Update to the latest kernel:

	**Note:** As of today the SLES kernel update doesn’t have and important fix on the kernel to improve storage performance and we expect it to land shortly after release. We recommend that you use a Windows Azure image from the [http://www.susestudio.com](http://susestudio.com/) gallery to take advantage of all the functionality in Windows Azure. 

4.	Disable the legacy ATA driver.

	- Create a file in /etc/modprobe.d with the content:

			 install ata_piix  { /sbin/modprobe hv_storvsc 2>&1 || /sbin/modprobe --ignore-install ata_piix; }
	
	- Run mkinitrd

5.	Disable automatic DVD ROM probing

	You will need to disable the DVD ROM probing in your image as per SUSE instructions. We recommend that you use a Windows Azure image from the [http://www.susestudio.com](http://susestudio.com/)  gallery to take advantage of all the functionality in azure

6.	Install the Windows Azure Linux Agent.
[http://go.microsoft.com/fwlink/?LinkID=251942&clcid=0x409](http://www.windowsazure.com/en-us/)
7.	Upload and deploy to Windows Azure.


<h2 id="Opensuse">Opensuse 12.1</h2>

1.	Create a new Hyper-V VM in Windows 2008 R2 with a VHD of up to 128GB. You will need to use the Windows Azure Linux command line tools [http://go.microsoft.com/fwlink/?LinkID=253691&clcid=0x409](http://www.windowsazure.com/en-us/) to upload the VHD if you use a dynamic VHD or  you can use any tool if you use a fixed size VHD.
2.	Install Opensuse 12.1 64 bit. We recommend not creating a SWAP partition at installation time. SWAP space may be configured using the Windows Azure Linux Agent.
3.	Update to latest kernel:

	**Note:** As of today the SLES kernel update doesn’t have and important fix on the kernel to improve storage performance and we expect it to land shortly after release. We recommend that you use a Windows Azure image from the [http://www.susestudio.com](http://susestudio.com/)  gallery to take advantage of all the functionality in azure

4.	 Disable legacy ATA driver by adding the following to kernel command line in /boot/grub/menu.lst: reserve=0x1f0, 0x8. 
(This option reserves this I/O region and prevents ata_piix from loading)
5.	Install the Windows Azure Linux Agent.
[http://go.microsoft.com/fwlink/?LinkID=251942&clcid=0x409](http://www.windowsazure.com/en-us/)
6.	Test if ifrenew device_name works. If it doesn’t work, update to the latest kernel.

	Ifrenew has to work or else the Windows Azure Linux Agent will fail.

7.	Upload and deploy to Windows Azure.


<h2 id="Upstream">Upstream kernel</h2>

We do not recommend using the mainstream Linux kernel with Windows Azure virtual machines without the following patch: [http://go.microsoft.com/fwlink/?LinkID=253692&clcid=0x409](http://www.windowsazure.com/en-us/).