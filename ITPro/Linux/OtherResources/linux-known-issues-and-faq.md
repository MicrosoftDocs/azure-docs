
#Linux Known Issues and FAQ

There are a few known issues with the way that Linux Images currently work on Windows Azure that we would like to highlight in this section.

We will divide those issues into the following groups:

* [Networking](#networking)

* [Persistent Disk Issues](#persistentdisk)

* [Distribution specific characteristics](#distributions)

<h2 id="networking">Networking</h2>

-	UDP packets are  truncated to 1452 bytes For Linux VMs
	-	Please ensure that you use small UDP packets. We do not support UDP fragmentation in Windows Azure. A  recomended size is 512 byte packets.
-	Internal DNS name can fail if the DHCP client is not properly configured
	- The Windows Azure Linux Agent Configures the server Name and hence any attempt to  use the regular DHCP  client might interfere with the normal operation of the agent. To prevent this we recomend that you cahnge the content of /etc/sysconfig/network/dhcp or equivalent  from DHCLIENT_SET_HOSTNAME="yes" to DHCLIENT_SET_HOSTNAME="no".
 
- VNet is not enabled for Linux VMs in the Portal 
	- As of December 20th 2012 all of the portal gallery images are supported using VNET on top of Linux and the Command Line Interface CLI tools support this work.  Unfortunately the portal is only scheduled to enable the funtionality for Linux on the second half of january 2013. Till then please use the CLI released as part of the mid December  release of the SDK or the Powershell scripts.  

<h2 id="persistentdisk">Persistent Disk Issues</h2>

-	Persistent disks can go readonly under certain circumstances
	-	There were a few platform issues that have now been corrected that could have resulted in a disk inside of Linux to go into a read only mode. We are making continuous improvements in this area and have released new fucntionality that will prevent this from occurring and take corrective action if it does. Nevertheless; until we go into GA it is quite possible that this issue surfaces again for certain users. The recomended action if this occurs is to restart the VM.  
-	When adding/removing a disk to/from a Linux VM, LUN0 should always be populated after the operation
	-	According to the SCSI standard, LUN0 should always be populated.So, if we add a disk to LUN1 without a LUN0 disk present, this disk will not be recognized by Linux. The portal takes care of this automatically but the API and CLI allow for more fine tuning; therefore please ensure that:
		-  When adding the 1st data disk, this disk is at LUN0.
		-  When you remove data disks; please ensure that the last disk you remove is the one  at LUN0.
	
- Disk performance is poor when installing DataBases on the OS disk
	-	As per the orginal recomendation; the OS disk is not tuned to tolerate data intensive workloads and will show poor performance when used for that end. 
	On the other hand; Data Disks are tunned for Data intesive operations so please always use a Data Disk to install any data intesive workloads such as Data Bases in Windows Azure 

<h2 id="distributions">Distribution specific issues</h2>

-	SLES and Open SUSE package managers are different
	-	There has been some level of confusion around the pakage manager to use in SLES vs OpenSUSE since the first one has Yast available while the second does not. The recomendation is to always use Zypper to operate on top od packages for these distrivutions.

- Kernel updates can fail in CentOS 
	-	As of December 20th; Open Logic is maintaining a different Kernel for 6.2 and 6.3  that includes the Azure compatibility patch to addresses an incompatibility with older versions of the ATA PiiX driver. All CentOS imagesin teh glalery include this kernel and therefore you should try to perform any kernel updates using the oficial repositories kept by OpenLogic on the Azure platform so that you do not affect the stability of the VM.


