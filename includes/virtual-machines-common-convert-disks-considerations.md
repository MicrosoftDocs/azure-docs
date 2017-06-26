* If the unmanaged disk is in a storage account previously encrypted using Azure Storage Service Encryption, you can't convert it to a managed disk. For steps to copy and use these VHDs in managed disks, see [later in this article](#managed-disks-and-azure-storage-service-encryption).

* The conversion requires a restart of the VM, so schedule the migration of your VMs during a pre-existing maintenance window. 

* The conversion is not reversible. 

* Be sure to test the conversion. Migrate a test virtual machine before performing the migration in production.

* During the conversion, you deallocate the VM. The VM receives a new IP address when it is started after the conversion. If needed, you can [assign a static IP address](../../virtual-network/virtual-network-ip-addresses-overview-arm.md) to the VM.

* The original VHDs and the storage account used by the VM before conversion are not deleted. They continue to incur charges. To avoid being billed for these artifacts, delete the original VHD blobs after you verify the conversion is complete.