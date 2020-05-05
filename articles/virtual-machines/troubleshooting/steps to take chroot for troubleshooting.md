---
title: How to take chroot environment in linux.
description: This article provides instructions to take chroot environment for troubleshooting issues in the Rescue VM.
mservices: virtual-machines-linux
documentationcenter: ''
author: kailashmsft
manager: dcscontentpm
editor: ''
tags: ''

ms.service: virtual-machines-linux
ms.topic: troubleshooting
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.date: 05/05/2020
ms.author: kaib

---


# How to take chroot environment for troubleshooting issues in Rescue VM

 
This article describes the steps to take chroot environment in Rescue VM for troubleshooting.

## Environment

- Linux Endorsed distributions


## Procedure

## Ubuntu 16.x && Ubuntu 18.x 

1. We need to stop/deallocate the affected VM.
2. Create a Rescue VM of the same OS version in same RSG and location using managed disk.
3. Take a snapshot of the OS disk of the affected VM. You can use the portal to perform this action.
4. Create a disk out of the snapshot of the OS disk taken above and attach it to the Rescue VM. You can use the portal to perform this action
5. Perform the below steps to take a chroot environment in the Rescue VM.

	 5.1 Access your VM and become root user using below command.

             #sudo su -
         
     5.2 First, find the disk using `dmesg` (the method you use to discover your new disk may vary). The following example uses dmesg to filter on *SCSI* disks:

			 
				dmesg | grep SCSI
			 

         The output is similar to the following example:

			 
			    [    0.294784] SCSI subsystem initialized
			    [    0.573458] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 252)
			    [    7.110271] sd 2:0:0:0: [sda] Attached SCSI disk
			    [    8.079653] sd 3:0:1:0: [sdb] Attached SCSI disk
			    [ 1828.162306] sd 5:0:0:0: [sdc] Attached SCSI disk
            

         Here, *sdc* is the disk that we want. 
	
	 5.3 Use the below commands to take chroot.
	 
            #mkdir /rescue
            #mount /dev/sdc1 /rescue
		    #mount /dev/sdc15 /rescue/boot/efi
		    #cd /rescue
			   
			 #mount -t proc proc proc 
			 #mount -t sysfs sys sys/ 
			 #mount -o bind /dev dev/ 
			 #mount -o bind /dev/pts dev/pts/
			 #mount -o bind /run run/ 
			 #chroot /rescue
							
	 5.4 Perform the troubleshooting in the chroot environment.
	      

	 5.5 Use the below commands to come out of chroot environment.
	 
			 #exit

         	 #umount /rescue/proc/
			 #umount /rescue/sys/
			 #umount /rescue/dev/pts
			 #umount /rescue/dev/
			 #umount /rescue/run
			 #cd /
			 #umount /rescue/boot/efi
			 #umount /rescue

		>[!NOTE]
		> In case if you are seeing an error unable to unmount /rescue, you use the -l option along with umount.
		> umount -l /rescue

				
6. Detach the disk from rescue VM and do a disk swap to the original VM.
7. Star the original VM and check the connectivity part.


## RHEL/Centos/Oracle 6.x && Oracle 8.x && RHEL/Centos 7.x with RAW Partitions.

1. We need to stop/deallocate the affected VM.
2. Create a Rescue VM of the same OS version in same RSG and location using managed disk.
3. Take a snapshot of the OS disk of the affected VM. You can use the portal to perform this action.
4. Create a disk out of the snapshot of the OS disk taken above and attach it to the Rescue VM. You can use the portal to perform this action
5. Perform the below steps to take a chroot environment in the Rescue VM.

	 5.1 Access your VM and become root user using below command.

             #sudo su -
         
     5.2 First, find the disk using `dmesg` (the method you use to discover your new disk may vary). The following example uses dmesg to filter on *SCSI* disks:

			 
				dmesg | grep SCSI
			 

         The output is similar to the following example:

			 
			    [    0.294784] SCSI subsystem initialized
			    [    0.573458] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 252)
			    [    7.110271] sd 2:0:0:0: [sda] Attached SCSI disk
			    [    8.079653] sd 3:0:1:0: [sdb] Attached SCSI disk
			    [ 1828.162306] sd 5:0:0:0: [sdc] Attached SCSI disk
            

         Here, *sdc* is the disk that we want. 
	
	 5.3 Use the below commands to take chroot.
	 
            #mkdir /rescue
            #mount -o nouuid /dev/sdc2 /rescue
		    #mount -o nouuid /dev/sdc1 /rescue/boot/
		    #cd /rescue
			   
			 #mount -t proc proc proc 
			 #mount -t sysfs sys sys/ 
			 #mount -o bind /dev dev/ 
			 #mount -o bind /dev/pts dev/pts/
			 #mount -o bind /run run/ 
			 #chroot /rescue
							
	 5.4 Perform the troubleshooting in the chroot environment.
	      

	 5.5 Use the below commands to come out of chroot environment.
	 
			 #exit

         	 #umount /rescue/proc/
			 #umount /rescue/sys/
			 #umount /rescue/dev/pts
			 #umount /rescue/dev/
			 #umount /rescue/run
			 #cd /
			 #umount /rescue/boot/efi
			 #umount /rescue

		>[!NOTE]
		> In case if you are seeing an error unable to unmount /rescue, you use the -l option along with umount.
		> umount -l /rescue

				
6. Detach the disk from rescue VM and do a disk swap to the original VM.
7. Star the original VM and check the connectivity part.


## RHEL/Centos 7.x with LVM 

   > [!Note]
   > * If your original VM is having LVM on OS Disk, then your Rescue VM should be created using image having Raw Partitions on OS Disk


1. We need to stop/deallocate the affected VM.
2. Create a Rescue VM of the same OS version in same RSG and location using managed disk.
3. Take a snapshot of the OS disk of the affected VM. You can use the portal to perform this action.
4. Create a disk out of the snapshot of the OS disk taken above and attach it to the Rescue VM. You can use the portal to perform this action
5. Perform the below steps to take a chroot environment in the Rescue VM.

	 5.1 Access your VM and become root user using below command.

             #sudo su -
         
     5.2 First, find the disk using `dmesg` (the method you use to discover your new disk may vary). The following example uses dmesg to filter on *SCSI* disks:

			 
				dmesg | grep SCSI
			 

         The output is similar to the following example:

			 
			    [    0.294784] SCSI subsystem initialized
			    [    0.573458] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 252)
			    [    7.110271] sd 2:0:0:0: [sda] Attached SCSI disk
			    [    8.079653] sd 3:0:1:0: [sdb] Attached SCSI disk
			    [ 1828.162306] sd 5:0:0:0: [sdc] Attached SCSI disk
            

         Here, *sdc* is the disk that we want. 
	
	 5.3 Use the below command to activate the logical volume group
		    
			 #vgscan --mknodes
			 #vgchange -ay
			 #lvscan
			 
			 
	 
	 5.4 Use `lsblk` command to get the lvmname's.
			
			[azure@rhel7 ~]$ lsblk
			NAME              MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
			sda                 8:0    0   64G  0 disk
			├─sda1              8:1    0  500M  0 part /boot
			├─sda2              8:2    0   63G  0 part /
			sdb                 8:16   0    4G  0 disk
			└─sdb1              8:17   0    4G  0 part /mnt/resource
			sdc                 8:0    0   64G  0 disk
			├─sdc1              8:1    0  500M  0 part 
			├─sdc2              8:2    0   63G  0 part 
			├─sdc3              8:3    0    2M  0 part
			├─sdc4				8:4    0   63G  0 part			
	          ├─rootvg-tmplv  253:0    0    2G  0 lvm  
	          ├─rootvg-usrlv  253:1    0   10G  0 lvm  
	    	  ├─rootvg-optlv  253:2    0    2G  0 lvm  
	    	  ├─rootvg-homelv 253:3    0    1G  0 lvm  
	    	  ├─rootvg-varlv  253:4    0    8G  0 lvm  
	    	  └─rootvg-rootlv 253:5    0    2G  0 lvm    
			
	 
	 5.5 Use the below commands to take chroot.
	 
            #mkdir /rescue
            #mount /dev/mapper/rootvg-rootlv /rescue
		    #mount /dev/mapper/rootvg-varlv /rescue/var
			#mount /dev/mapper/rootvg-homelv /rescue/home
			#mount /dev/mapper/rootvg-usrlv /rescue/usr
			#mount /dev/mapper/rootvg-tmplv /rescue/tmp
			#mount /dev/mapper/rootvg-optlv /rescue/opt
			#mount /dev/sdc2 /rescue/boot/
			#mount /dev/sdc1 /rescue/boot/efi
     	    #cd /rescue
			   
			 #mount -t proc proc proc 
	    	 #mount -t sysfs sys sys/ 
		     #mount -o bind /dev dev/ 
			 #mount -o bind /dev/pts dev/pts/
			 #mount -o bind /run run/ 
			 #chroot /rescue
							
	 5.6 Perform the troubleshooting in the chroot environment.
	      

	 5.7 Use the below commands to come out of chroot environment.
	 
			 #exit

         	 #umount /rescue/proc/
			 #umount /rescue/sys/
			 #umount /rescue/dev/pts
			 #umount /rescue/dev/
			 #umount /rescue/run
			 #cd /
			 #umount /rescue/boot/efi
			 #umount /rescue/boot
			 #umount /rescue/home
			 #umount /rescue/var
			 #umount /rescue/usr
			 #umount /rescue/tmp
			 #umount /rescue/opt
			 #umount /rescue

	    >[!NOTE]
		> In case if you are seeing an error unable to unmount /rescue, you use the -l option along with umount.
		> umount -l /rescue

		
6. Detach the disk from rescue VM and do a disk swap to the original VM.
7. Star the original VM and check the connectivity part.




## RHEL 8.x with LVM 

   > [!Note]
   > * If your original VM is having LVM on OS Disk, then your Rescue VM should be created using image having Raw Partitions on OS Disk


1. We need to stop/deallocate the affected VM.
2. Create a Rescue VM of the same OS version in same RSG and location using managed disk.
3. Take a snapshot of the OS disk of the affected VM. You can use the portal to perform this action.
4. Create a disk out of the snapshot of the OS disk taken above and attach it to the Rescue VM. You can use the portal to perform this action
5. Perform the below steps to take a chroot environment in the Rescue VM.

	 5.1 Access your VM and become root user using below command.

             #sudo su -
         
     5.2 First, find the disk using `dmesg` (the method you use to discover your new disk may vary). The following example uses dmesg to filter on *SCSI* disks:

			 
				dmesg | grep SCSI
			 

         The output is similar to the following example:

			 
			    [    0.294784] SCSI subsystem initialized
			    [    0.573458] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 252)
			    [    7.110271] sd 2:0:0:0: [sda] Attached SCSI disk
			    [    8.079653] sd 3:0:1:0: [sdb] Attached SCSI disk
			    [ 1828.162306] sd 5:0:0:0: [sdc] Attached SCSI disk
            

         Here, *sdc* is the disk that we want. 
	
	 5.3 Use the below command to activate the logical volume group
		    
			 #vgscan --mknodes
			 #vgchange -ay
			 #lvscan
			 
			 
	 
	 5.4 Use `lsblk` command to get the lvmname's.
			
			[azure@rhel8 ~]$ lsblk
			NAME              MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
			sda                 8:0    0   64G  0 disk
			├─sda1              8:1    0  500M  0 part /boot
			├─sda2              8:2    0   63G  0 part /
			sdb                 8:16   0    4G  0 disk
			└─sdb1              8:17   0    4G  0 part /mnt/resource
			sdc                 8:0    0   64G  0 disk
			├─sdc1              8:1    0  500M  0 part 
			├─sdc2              8:2    0   63G  0 part 
			│ ├─rootvg-tmplv  253:0    0    2G  0 lvm  
			│ ├─rootvg-usrlv  253:1    0   10G  0 lvm  
			│ ├─rootvg-homelv 253:2    0    1G  0 lvm  
			│ ├─rootvg-varlv  253:3    0    8G  0 lvm  
			│ └─rootvg-rootlv 253:4    0    2G  0 lvm  
			├─sdc14             8:14   0    4M  0 part
			└─sdc15             8:15   0  495M  0 part
			
	 
	 5.5 Use the below commands to take chroot.
	 
            #mkdir /rescue
            #mount /dev/mapper/rootvg-rootlv /rescue
		    #mount /dev/mapper/rootvg-varlv /rescue/var
			#mount /dev/mapper/rootvg-homelv /rescue/home
			#mount /dev/mapper/rootvg-usrlv /rescue/usr
			#mount /dev/mapper/rootvg-tmplv /rescue/tmp
			#mount /dev/sdc1 /rescue/boot/
			#mount /dev/sdc15 /rescue/boot/efi
     	    #cd /rescue
			   
			 #mount -t proc proc proc 
	    	 #mount -t sysfs sys sys/ 
		     #mount -o bind /dev dev/ 
			 #mount -o bind /dev/pts dev/pts/
			 #mount -o bind /run run/ 
			 #chroot /rescue
							
	 5.6 Perform the troubleshooting in the chroot environment.
	      

	 5.7 Use the below commands to come out of chroot environment.
	 
			 #exit

         	 #umount /rescue/proc/
			 #umount /rescue/sys/
			 #umount /rescue/dev/pts
			 #umount /rescue/dev/
			 #umount /rescue/run
			 #cd /
			 #umount /rescue/boot/efi
			 #umount /rescue/boot
			 #umount /rescue/home
			 #umount /rescue/var
			 #umount /rescue/usr
			 #umount /rescue/tmp
			 #umount /rescue

	    >[!NOTE]
		> In case if you are seeing an error unable to unmount /rescue, you use the -l option along with umount.
		> umount -l /rescue

		
6. Detach the disk from rescue VM and do a disk swap to the original VM.
7. Star the original VM and check the connectivity part.

## Oracle 7.x 

1. We need to stop/deallocate the affected VM.
2. Create a Rescue VM of the same OS version in same RSG and location using managed disk.
3. Take a snapshot of the OS disk of the affected VM. You can use the portal to perform this action.
4. Create a disk out of the snapshot of the OS disk taken above and attach it to the Rescue VM. You can use the portal to perform this action
5. Perform the below steps to take a chroot environment in the Rescue VM.

	 5.1 Access your VM and become root user using below command.

             #sudo su -
         
     5.2 First, find the disk using `dmesg` (the method you use to discover your new disk may vary). The following example uses dmesg to filter on *SCSI* disks:

			 
				dmesg | grep SCSI
			 

         The output is similar to the following example:

			 
			    [    0.294784] SCSI subsystem initialized
			    [    0.573458] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 252)
			    [    7.110271] sd 2:0:0:0: [sda] Attached SCSI disk
			    [    8.079653] sd 3:0:1:0: [sdb] Attached SCSI disk
			    [ 1828.162306] sd 5:0:0:0: [sdc] Attached SCSI disk
            

         Here, *sdc* is the disk that we want. 
	
	 5.3 Use the below commands to take chroot.
	 
            #mkdir /rescue
            #mount -o nouuid /dev/sdc2 /rescue
		    #mount -o nouuid /dev/sdc1 /rescue/boot/
			#mount /dev/sdc15 /rescue/boot/efi
		    #cd /rescue
			   
			 #mount -t proc proc proc 
			 #mount -t sysfs sys sys/ 
			 #mount -o bind /dev dev/ 
			 #mount -o bind /dev/pts dev/pts/
			 #mount -o bind /run run/ 
			 ##chroot /rescue
							
	 5.4 Perform the troubleshooting in the chroot environment.
	      

	 5.5 Use the below commands to come out of chroot environment.
	 
			 #exit

         	 #umount /rescue/proc/
			 #umount /rescue/sys/
			 #umount /rescue/dev/pts
			 #umount /rescue/dev/
			 #umount /rescue/run
			 #cd /
			 #umount /rescue/boot/efi
			 #umount /rescue/boot
			 #umount /rescue

		>[!NOTE]
		> In case if you are seeing an error unable to unmount /rescue, you use the -l option along with umount.
		> umount -l /rescue

				
6. Detach the disk from rescue VM and do a disk swap to the original VM.
7. Star the original VM and check the connectivity part.


## SUSE-SLES 12 SP4, SUSE-SLES 12 SP4 For SAP && ## SUSE-SLES 15 SP1, SUSE-SLES 15 SP1 For SAP

1. We need to stop/deallocate the affected VM.
2. Create a Rescue VM of the same OS version in same RSG and location using managed disk.
3. Take a snapshot of the OS disk of the affected VM. You can use the portal to perform this action.
4. Create a disk out of the snapshot of the OS disk taken above and attach it to the Rescue VM. You can use the portal to perform this action
5. Perform the below steps to take a chroot environment in the Rescue VM.

	 5.1 Access your VM and become root user using below command.

             #sudo su -
         
     5.2 First, find the disk using `dmesg` (the method you use to discover your new disk may vary). The following example uses dmesg to filter on *SCSI* disks:

			 
				dmesg | grep SCSI
			 

         The output is similar to the following example:

			 
			    [    0.294784] SCSI subsystem initialized
			    [    0.573458] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 252)
			    [    7.110271] sd 2:0:0:0: [sda] Attached SCSI disk
			    [    8.079653] sd 3:0:1:0: [sdb] Attached SCSI disk
			    [ 1828.162306] sd 5:0:0:0: [sdc] Attached SCSI disk
            

         Here, *sdc* is the disk that we want. 
	
	 5.3 Use the below commands to take chroot.
	 
            #mkdir /rescue
            #mount -o nouuid /dev/sdc4 /rescue
		    #mount -o nouuid /dev/sdc3 /rescue/boot/
			#mount /dev/sdc2 /rescue/boot/efi
		    #cd /rescue
			   
			 #mount -t proc proc proc 
			 #mount -t sysfs sys sys/ 
			 #mount -o bind /dev dev/ 
			 #mount -o bind /dev/pts dev/pts/
			 #mount -o bind /run run/ 
			 #chroot /rescue
							
	 5.4 Perform the troubleshooting in the chroot environment.
	      

	 5.5 Use the below commands to come out of chroot environment.
	 
			 #exit

         	 #umount /rescue/proc/
			 #umount /rescue/sys/
			 #umount /rescue/dev/pts
			 #umount /rescue/dev/
			 #umount /rescue/run
			 #cd /
			 #umount /rescue/boot/efi
			 #umount /rescue/boot
			 #umount /rescue

		>[!NOTE]
		> In case if you are seeing an error unable to unmount /rescue, you use the -l option along with umount.
		> umount -l /rescue

				
6. Detach the disk from rescue VM and do a disk swap to the original VM.
7. Star the original VM and check the connectivity part.

