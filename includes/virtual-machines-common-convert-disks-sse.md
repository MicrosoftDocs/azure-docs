## Managed disks and Azure Storage Service Encryption

If the unmanaged disk is in a storage account that has ever been encrypted using [Azure Storage Service Encryption](../../storage/storage-service-encryption.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json), you can't use the preceding steps to convert to a managed disk. The following steps detail how to copy and use unmanaged disks that have been in an encrypted storage account:

1. Copy the virtual hard disk (VHD) using [AzCopy](../../storage/storage-use-azcopy.md) to a storage account that has never been enabled for Azure Storage Service Encryption.

2. Use the copied VM in one of the following ways:

  * Create a VM that uses managed disks, and specify that VHD file during creation with `New-AzureRmVm`

  * Attach the copied VHD with `Add-AzureRmVmDataDisk` to a running VM with managed disks