#How to Detach a Data Disk from a Virtual Machine #

To use this feature and other new Windows Azure capabilities, sign up for the [free preview](https://account.windowsazure.com/PreviewFeatures). 

- [Concepts](#concepts)
- [How to: Find the disks that are attached to a virtual machine](#finddisks)
- [How to: Detach a data disk](#detachdisk)

## <a id="concepts"> </a>Concepts ##

You can attach a data disk to a virtual machine to store application data. A data disk is a Virtual Hard Disk (VHD) that you can create either locally with your own computer or in the cloud with Windows Azure. You manage data disks in the virtual machine the same way you do on a server in your office.

You can attach and detach data disks anytime you want, but you are limited in the number of disks that you can attach to a virtual machine based on the size of the machine. The following table lists the number of attached disks that are allowed for each size of virtual machine.

<P>
  <TABLE BORDER="1" WIDTH="300">
  <TR BGCOLOR="#E9E7E7">
    <TH>Size</TH>
    <TH>Data Disk Limit</TH>
  </TR>
  <TR>
    <TD>Extra Small</TD>
    <TD>1</TD>
  </TR>
  <TR>
    <TD>Small</TD>
    <TD>2</TD>
  </TR>
  <TR>
    <TD>Medium</TD>
    <TD>4</TD>
  </TR>
  <TR>
    <TD>Large</TD>
    <TD>8</TD>
  </TR>
  <TR>
    <TD>Extra Large</TD>
    <TD>16</TD>
  </TR>
  </TABLE>
</P>

When you no longer need a data disk that is attached to a virtual machine, you can easily detach it. You do not lose the disk after you detach it, it stays in storage and you can easily attach it again to the same virtual machine or you can attach it to a new machine and continue to use the existing data.

## <a id="finddisks"> </a>How to: Find the disks that are attached to a virtual machine ##

You can find the disks that are attached to a virtual machine by using either the dashboard or the Disks page of Virtual Machines.

###Use the dashboard to find information about attached disks###

1. If you have not already done so, sign in to the Windows Azure Management Portal.

2. Click **Virtual Machines**, and then select the virtual machine from which you want to find information about attached data disks.

3. Click **Dashboard**. On the dashboard for the virtual machine, you can find the number of attached disks and the names of the disks. The following example shows one data disk attached to a virtual machine:

	![Find data disk][Find data disk]

	**Note:** At least one disk is attached to all virtual machines. Each virtual machine has an operating system disk attached that you cannot detach without deleting the virtual machine.

###Use the Disks page of Virtual Machines to find information about attached disks###

1. If you have not already done so, sign in to the Windows Azure Management Portal.

2. Click **Virtual Machines**, and then click **Disks**. This page shows a list of all disks that are available to use with virtual machines and the disks that are being used by virtual machines. The list is a combination of operating system disks and data disks. To differentiate between the two types of disks that are attached to the virtual machine, you need to use the dashboard. The following example shows the operating system disk and the data disk that is attached to a virtual machine:

	![List disks][List disks]

	**Note:** When you attach a new data disk to a virtual machine, you can provide a name for the VHD file that is used for the disk, but Windows Azure provides a name for the disk. The name consists of the cloud service name, the virtual machine name, and a numeric identifier.

## <a id="detachdisk"> </a>How to: Detach a data disk ##

After you find the name of the disk that you want to detach, you can complete the following steps to detach the disk from the virtual machine.

1. If you have not already done so, sign in to the Windows Azure Management Portal.

2. Click **Virtual Machines**, select the virtual machine from which you want to detach a data disk, and then click **Detach Disk**.

	![Detach disk][Detach disk]

3. Select the data disk, and then click the check mark to detach it.

	![Detach disk details][Detach disk details]

You will now see the disk shown as still in storage but no longer attached to a virtual machine.

![Detach disk success][Detach disk success]

You can now attach the disk again to the same virtual machine or to a new machine. For more information about attaching an existing data disk to a virtual machine, see [How to Attach a Data Disk to a Virtual Machine] [attachdisk].

[Find data disk]:../media/finddatadisks.png
[List disks]:../media/disklist.png
[Detach disk]:../media/detachdisk.png
[Detach disk details]:../media/detachdiskdetails.png
[Detach disk success]:../media/diskdetachsuccess.png
[attachdisk]:/en-us/manage/windows/how-to-guides/attach-a-disk/