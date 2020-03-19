---
title: How to configure LVM and RAID on-crypt on a Linux VM
description: This article provides instructions on configuring LVM and RAID on crypt on Linux VMs.
author: jofrance
ms.service: security
ms.topic: article
ms.author: jofrance
ms.date: 03/17/2020

ms.custom: seodec18

---

# How to configure LVM and RAID on-crypt

This document is a step-by-step process about how to perform LVM on crypt and Raid on crypt configurations.

### Environment

- Linux Distributions
- ADE Single Pass
- ADE Dual Pass


## Scenarios

**This scenario is applicable to ADE dual-pass and single-pass extensions.**  

- Configure LVM on top of encrypted devices (LVM-on-Crypt)
- Configure RAID on top of encrypted devices (RAID-on-Crypt)

Once the underlying device(s) are encrypted, then you can create the LVM or RAID structures on top of that encrypted layer. 
The Physical Volumes (PV) are created on top of the encrypted Layer.
The Physical Volumes are used to create the volume group.
You create the volumes and add the required entries on /etc/fstab. 

![Check disks attached PowerShell](./media/disk-encryption/lvm-raid-on-crypt/000-lvm-raid-crypt-diagram.png)

In a similar way, the RAID device is created on top of the encrypted layer on the disks. A filesystem is created on top of the RAID device and added to /etc/fstab as a regular device.

### Considerations

The recommended method to use is LVM-on-Crypt.

RAID is considered when LVM can't be used because of specific application/environment limitations.

You'll use the EncryptFormatAll option, information about this feature is located here: https://docs.microsoft.com/azure/virtual-machines/linux/disk-encryption-linux#use-encryptformatall-feature-for-data-disks-on-linux-vms.

While this method can be done when also encrypting the OS, we're just encrypting Data drives.

This procedure assumes you already reviewed the pre-requisites mentioned here: https://docs.microsoft.com/azure/virtual-machines/linux/disk-encryption-linux and here https://docs.microsoft.com/azure/virtual-machines/linux/disk-encryption-cli-quickstart.

The ADE dual pass version is on deprecation path and should no longer be use on new ADE encryptions.

### Procedure

When using the "on crypt" configurations, you'll be following the process outlined below:

>[!NOTE] 
>We're using variables throughout the document, replace the values accordingly.
## General steps
### Deploy a VM 
>[!NOTE] 
>While this is optional we recommend you to apply this on a newly deployed VM.

PowerShell
```powershell
New-AzVm -ResourceGroupName ${RGNAME} `
-Name ${VMNAME} `
-Location ${LOCATION} `
-Size ${VMSIZE} `
-Image ${OSIMAGE} `
-Credential ${creds} `
-Verbose
```
CLI:
```bash
az vm create \
-n ${VMNAME} \
-g ${RGNAME} \
--image ${OSIMAGE} \
--admin-username ${username} \
--admin-password ${password} \
-l ${LOCATION} \
--size ${VMSIZE} \
-o table
```
### Attach disks to the vm:
Repeat for $N number of new disks you want to attach to the VM
PowerShell
```powershell
$storageType = 'Standard_LRS'
$dataDiskName = ${VMNAME} + '_datadisk0'
$diskConfig = New-AzDiskConfig -SkuName $storageType -Location $LOCATION -CreateOption Empty -DiskSizeGB 5
$dataDisk1 = New-AzDisk -DiskName $dataDiskName -Disk $diskConfig -ResourceGroupName ${RGNAME}
$vm = Get-AzVM -Name ${VMNAME} -ResourceGroupName ${RGNAME} 
$vm = Add-AzVMDataDisk -VM $vm -Name $dataDiskName -CreateOption Attach -ManagedDiskId $dataDisk1.Id -Lun 0
Update-AzVM -VM ${VM} -ResourceGroupName ${RGNAME}
```
CLI:
```bash
az vm disk attach \
-g ${RGNAME} \
--vm-name ${VMNAME} \
--name ${VMNAME}datadisk1 \
--size-gb 5 \
--new \
-o table
```
### Verify the disks are attached to the VM:
PowerShell:
```powershell
$VM = Get-AzVM -ResourceGroupName ${RGNAME} -Name ${VMNAME}
$VM.StorageProfile.DataDisks | Select-Object Lun,Name,DiskSizeGB
```
![Check disks attached PowerShell](./media/disk-encryption/lvm-raid-on-crypt/001-lvm-raid-check-disks-powershell.png)
CLI:
```bash
az vm show -g ${RGNAME} -n ${VMNAME} --query storageProfile.dataDisks -o table
```
![Check disks attached CLI](./media/disk-encryption/lvm-raid-on-crypt/002-lvm-raid-check-disks-cli.png)
Portal:
![Check disks attached CLI](./media/disk-encryption/lvm-raid-on-crypt/003-lvm-raid-check-disks-portal.png)
OS:
```bash
lsblk 
```
![Check disks attached portal](./media/disk-encryption/lvm-raid-on-crypt/004-lvm-raid-check-disks-os.png)
### Configure the disks to be encrypted
This configuration is done that the operating system level, the corresponding disks are configured for a traditional ADE encryption:

Filesystems are created on top of the disks.

Temporary mount points are created to mount the filesystems.

The Filesystems are configured on /etc/fstab to be mounted at boot time.

Check the device letter assigned to the new disks, on this example we're using four data disks

```bash
lsblk 
```
![Check disks attached os](./media/disk-encryption/lvm-raid-on-crypt/004-lvm-raid-check-disks-os.png)

### Create a filesystem on top of each disk.
This command iterates an ext4 filesystem creation on each disk defined on the "in" part of the "for" cycle.
```bash
for disk in c d e f; do echo mkfs.ext4 -F /dev/sd${disk}; done |bash
```
![Check disks attached os](./media/disk-encryption/lvm-raid-on-crypt/005-lvm-raid-create-temp-fs.png)
Find the UUID of the filesystems recently created, create a temporary folder to mount it, add the corresponding entries on /etc/fstab and mount all the filesystems.

This command also iterates on each disk defined on the "in" part of the "for" cycle:
```bash
for disk in c d e f; do diskuuid="$(blkid -s UUID -o value /dev/sd${disk})"; \
mkdir /tempdata${disk}; \
echo "UUID=${diskuuid} /tempdata${disk} ext4 defaults,nofail 0 0" >> /etc/fstab; \
mount -a; \
done
``` 
### Verify the disks are mounted properly:
```bash
lsblk
```
![Check temp filesystems mounted](./media/disk-encryption/lvm-raid-on-crypt/006-lvm-raid-verify-temp-fs.png)
And configured:
```bash
cat /etc/fstab
```
![Check fstab](./media/disk-encryption/lvm-raid-on-crypt/007-lvm-raid-verify-temp-fstab.png)
### Encrypt the data disks:
PowerShell using KEK:
```powershell
$sequenceVersion = [Guid]::NewGuid() 
Set-AzVMDiskEncryptionExtension -ResourceGroupName $RGNAME `
-VMName ${VMNAME} `
-DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl `
-DiskEncryptionKeyVaultId $KeyVaultResourceId `
-KeyEncryptionKeyUrl $keyEncryptionKeyUrl `
-KeyEncryptionKeyVaultId $KeyVaultResourceId `
-VolumeType 'DATA' `
-EncryptFormatAll `
-SequenceVersion $sequenceVersion `
-skipVmBackup;
```
CLI using KEK:
```bash
az vm encryption enable \
--resource-group ${RGNAME} \
--name ${VMNAME} \
--disk-encryption-keyvault ${KEYVAULTNAME} \
--key-encryption-key ${KEYNAME} \
--key-encryption-keyvault ${KEYVAULTNAME} \
--volume-type "DATA" \
--encrypt-format-all \
-o table
```
### Verify the encryption status

Continue to the next step only when all the disks are encrypted.

PowerShell:
```powershell
Get-AzVmDiskEncryptionStatus -ResourceGroupName ${RGNAME} -VMName ${VMNAME}
```
![Check encryption ps](./media/disk-encryption/lvm-raid-on-crypt/008-lvm-raid-verify-encryption-status-ps.png)
CLI:
```bash
az vm encryption show -n ${VMNAME} -g ${RGNAME} -o table
```
![Check encryption CLI](./media/disk-encryption/lvm-raid-on-crypt/009-lvm-raid-verify-encryption-status-cli.png)
Portal:
![Check encryption OS](./media/disk-encryption/lvm-raid-on-crypt/010-lvm-raid-verify-encryption-status-portal.png)
OS Level:
```bash
lsblk
```
![Check encryption CLI](./media/disk-encryption/lvm-raid-on-crypt/011-lvm-raid-verify-encryption-status-os.png)

The extension will add the filesystems to "/var/lib/azure_disk_encryption_config/azure_crypt_mount" (an old encryption) or added to "/etc/crypttab" (new encryptions).

Do not modify any of these files.

This file is going to be taking care of activating these disks during the boot process so they can be later used by LVM or RAID. 

Do not worry about the mount points on this file, as ADE will lose the ability to get the disks mounted as a normal file system after we do create a physical volume or a raid device on top of those encrypted devices(which will get rid of the file system format we used during the preparation process).
### Remove the temp folders and temp fstab entries
You unmount the filesystems on the disks that will be used as part of LVM
```bash
for disk in c d e f; do umount /tempdata${disk}; done
```
And remove the /etc/fstab entries:
```bash
vi /etc/fstab
```
### Verify that the disks are not mounted and that the entries on /etc/fstab were removed
```bash
lsblk
```
![Check temp filesystems unmounted](./media/disk-encryption/lvm-raid-on-crypt/012-lvm-raid-verify-disks-not-mounted.png)
And configured:
```bash
cat /etc/fstab
```
![Check temp fstab entries are removed](./media/disk-encryption/lvm-raid-on-crypt/013-lvm-raid-verify-fstab-temp-removed.png)
## For LVM-on-crypt
Now that the underlying disks are encrypted, you can proceed to create the LVM structures.

Instead of using the device name, use the /dev/mapper paths for each of the disks to create a physical volume (on the crypt layer on top of the disk not on the disk itself).
### Configure LVM on top of the encrypted layers
#### Create the physical volumes
You'll get a warning asking if it's OK to wipe out the filesystem signature. 

You may continue by entering 'y' or use the echo "y" as shown:
```bash
echo "y" | pvcreate /dev/mapper/c49ff535-1df9-45ad-9dad-f0846509f052
echo "y" | pvcreate /dev/mapper/6712ad6f-65ce-487b-aa52-462f381611a1
echo "y" | pvcreate /dev/mapper/ea607dfd-c396-48d6-bc54-603cf741bc2a
echo "y" | pvcreate /dev/mapper/4159c60a-a546-455b-985f-92865d51158c
```
![pvcreate](./media/disk-encryption/lvm-raid-on-crypt/014-lvm-raid-pvcreate.png)
>[!NOTE] 
>The /dev/mapper/device names here need to be replaced for your actual values based on the output of lsblk.
#### Verify the physical volumes information
```bash
pvs
```
![check physical volumes 1](./media/disk-encryption/lvm-raid-on-crypt/015-lvm-raid-pvs.png)
#### Create the volume group
Create the VG using the same devices already initialized
```bash
vgcreate vgdata /dev/mapper/
```
### Check the volume group information
```bash
vgdisplay -v vgdata
```
```bash
pvs
```
![check physical volumes 2](./media/disk-encryption/lvm-raid-on-crypt/016-lvm-raid-pvs-on-vg.png)
#### Create logical volumes
```bash
lvcreate -L 10G -n lvdata1 vgdata
lvcreate -L 7G -n lvdata2 vgdata
``` 
#### Check the logical volumes created
```bash
lvdisplay
lvdisplay vgdata/lvdata1
lvdisplay vgdata/lvdata2
```
![check lvs](./media/disk-encryption/lvm-raid-on-crypt/017-lvm-raid-lvs.png)
#### Create filesystems on top of the logical volume(s) structure(s)
```bash
echo "yes" | mkfs.ext4 /dev/vgdata/lvdata1
echo "yes" | mkfs.ext4 /dev/vgdata/lvdata2
```
#### Create the mount points for the new filesystems
```bash
mkdir /data0
mkdir /data1
```
#### Add the new file systems to /etc/fstab and mount them
```bash
echo "/dev/mapper/vgdata-lvdata1 /data0 ext4 defaults,nofail 0 0" >>/etc/fstab
echo "/dev/mapper/vgdata-lvdata2 /data1 ext4 defaults,nofail 0 0" >>/etc/fstab
mount -a
```
#### Verify that the new filesystems are mounted
```bash
lsblk -fs
df -h
```
![check logical volumes](./media/disk-encryption/lvm-raid-on-crypt/018-lvm-raid-lsblk-after-lvm.png)
On this variation of lsblk, we're listing the devices showing the dependencies on reverse order, this option helps to identify the devices grouped by the logical volume instead of the original /dev/sd[disk] device names.

Important: Make sure the "nofail" option is added to the mount point options of the LVM volumes created on top of an ADE encrypted device. Is important to avoid the OS from getting stuck during the boot process (or in maintenance mode). 

The encrypted disk are unlock at the end of the boot process, the LVM volumes and file systems will be automatically mounted.

If the nofail option isn't used, the OS will never get into the stage where ADE is started, and the data disk(s) are unlocked and mounted.

You can test rebooting the VM and validating the file systems are also automatically getting mounted after boot time. 

Take under consideration that this process may take several minutes depending on the number of file systems and the sizes
#### Reboot the VM and verify after reboot
```bash
shutdown -r now
```
```bash
lsblk
df -h
```
## For RAID-on-Crypt
Now the underlying disks are encrypted you can continue to create the RAID structures, same as LVM, instead of using the device name, use the /dev/mapper paths for each of the disks.

#### Configure RAID on top of the encrypted layer of the disks
```bash
mdadm --create /dev/md10 \
--level 0 \
--raid-devices=4 \
/dev/mapper/c49ff535-1df9-45ad-9dad-f0846509f052 \
/dev/mapper/6712ad6f-65ce-487b-aa52-462f381611a1 \
/dev/mapper/ea607dfd-c396-48d6-bc54-603cf741bc2a \
/dev/mapper/4159c60a-a546-455b-985f-92865d51158c
```
![mdadm create](./media/disk-encryption/lvm-raid-on-crypt/019-lvm-raid-md-creation.png)
>[!NOTE] 
>The /dev/mapper/device names here need to be replaced for your actual values based on the output of lsblk.
#### Check/monitor the RAID creation:
```bash
watch -n1 cat /proc/mdstat
mdadm --examine /dev/mapper/[]
mdadm --detail /dev/md10
```
![check mdadm](./media/disk-encryption/lvm-raid-on-crypt/020-lvm-raid-md-details.png)
#### Create a filesystem on top of the new Raid device:
```bash
mkfs.ext4 /dev/md10
```
Create a new mountpoint for the filesystem, add the new file system to /etc/fstab, and mount it
```bash
for device in md10; do diskuuid="$(blkid -s UUID -o value /dev/${device})"; \
mkdir /raiddata; \
echo "UUID=${diskuuid} /raiddata ext4 defaults,nofail 0 0" >> /etc/fstab; \
mount -a; \
done
```
Verify that the new filesystems are mounted
```bash
lsblk -fs
df -h
```
![check mdadm](./media/disk-encryption/lvm-raid-on-crypt/021-lvm-raid-lsblk-md-details.png)

Important: Make sure the "nofail" option is added to the mount point options of the RAID volumes created on top of an ADE encrypted device. 

Is very important to avoid the OS from getting stuck during the boot process (or in maintenance mode). 

The encrypted disk will be unlock at the end of the boot process and the RAID volumes and file systems will be automatically mounted until they're unlocked by ADE, if the nofail option is not used.

The OS will never get into the stage where ADE is started, and the data disks are unlocked and mounted.

You can test rebooting the VM and validating the file systems are also automatically getting mounted after boot time. Take under consideration that this process may take several minutes depending on the number of file systems and the sizes
```bash
shutdown -r now
```
And when you can log in:
```bash
lsblk
df -h
```
## Next steps

- [Azure Disk Encryption troubleshooting](disk-encryption-troubleshooting.md)

