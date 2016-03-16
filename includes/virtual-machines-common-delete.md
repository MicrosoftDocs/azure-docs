


I deleted my VMs, but am still getting billed for storage


If you delete a VM the disk and VHD are not automatically deleted. If you have subscribed to Premium storage, you will continue to incur storage charges. For more information refer to Pricing and Billing when using Premium Storage.


Important: Once a VHD is deleted it cannot be recovered. Verify carefully that you don’t need a VHD before deleting it.

To delete a VM and its associated VHD
1.	Navigate to the Azure Classic Portal.
2.	Navigate to the Virtual Machines tab.
3.	Click the Disks tab.
4.	Select your data disk, then click Delete Disk.
5.	Confirm there is no Virtual Machine listed on the "Attached to" column
Note: Disks are detached from a deleted VM asynchronously, it may take a few minutes after the VM is deleted for this field to clear up.

6.	Click "Delete" and choose if you want to "Retain the associated VHD" or "Delete the associated VHD"
 

If you choose to "Delete the associated VHD" the disk and blob containing the VHD will be deleted.

If you choose to "Retain the associated VHD" the lease will be removed but the blob containing the VHD will be kept in your Storage Account. You may choose this option if you plan to delete the VHD directly from your storage account VHDs container, create a new Disk pointing to the existing VHD, download to your on-premises environment or just leave it there for future use.

VHDs which have been retained will show as in the stopped deallocated state. Stop deallocated releases the compute resources like the CPU, Memory and Network but the disks are still retained for the user to be able to quickly recreate the VM if required. These disks are created on top of VHDs which are backed by Azure storage.  DC1	StoppedDeallocated	6bed188742c747e1ad6402e634914b46

For a related issue see the article “Errors may occur when deleting Azure storage accounts, images, disks or blobs.” 

