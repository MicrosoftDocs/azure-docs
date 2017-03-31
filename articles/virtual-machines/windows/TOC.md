# [Windows Virtual Machines Documentation](index.md)

# Overview
## [About Virtual Machines](overview.md)

# Quickstart
## [Create VM - Portal](quick-create-portal.md)
## [Create VM - Azure CLI](quick-create-cli.md)
## [Create VM - PowerShell](quick-create-powershell.md)

# Samples
## [Azure CLI](cli-samples.md)
## [PowerShell](powershell-samples.md)

# Tutorials
## [Install and run IIS](hero-role.md)
## Deploy an app with VM template
### [Tutorial overview](dotnet-core-1-landing.md)
### [App architecture](dotnet-core-2-architecture.md)
### [Access and security](dotnet-core-3-access-security.md)
### [Availability and scale](dotnet-core-4-availability-scale.md)
### [App deployment](dotnet-core-5-app-deployment.md)

# Concepts
## [Regions and availability](regions-and-availability.md)
## [VM storage](../../storage/storage-about-disks-and-vhds-windows.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
## [VM networking](network-overview.md)
## [VM Scale Sets](../../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
## [Containers](containers.md)
## [Resource Manager](../../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
### [Deployment models](../../azure-resource-manager/resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
### [Templates for VMs](template-description.md)
## [Azure Windows agent](agent-user-guide.md)
## [Azure Security Center](../../security-center/security-center-virtual-machine.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
## [Disaster recovery](../virtual-machines-disaster-recovery-guidance.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
## [Azure planned maintenance](planned-maintenance.md)
### [Schedule](planned-maintenance-schedule.md)
## [VM sizes](sizes.md)
### [General purpose](sizes-general.md)
### [Compute optimized](sizes-compute.md)
### [Memory optimized](sizes-memory.md)
### [Storage optimized](sizes-storage.md)
### [GPU optimized](sizes-gpu.md)
### [High performance compute](sizes-hpc.md)
#### [Compute-intensive sizes](a8-a9-a10-a11-specs.md)
### [Azure compute units (ACU)](acu.md)
### [Compute benchmark scores](compute-benchmark-scores.md)
### [Best practices for running a Windows VM](guidance-compute-single-vm.md)
## Deployment considerations
### [Infrastructure guidelines](infrastructure-virtual-machine-guidelines.md)
### [Subscriptions and accounts](infrastructure-subscription-accounts-guidelines.md)
### [Naming](infrastructure-naming-guidelines.md)
### [Resource groups](infrastructure-resource-groups-guidelines.md)
### [Storage](infrastructure-storage-solutions-guidelines.md)
### [Networking](infrastructure-networking-guidelines.md)
### [Availability sets](infrastructure-availability-sets-guidelines.md)
### [Infrastructure example](infrastructure-example.md)

# How-to guides
## Create VMs
### [VM creation overview](creation-choices.md)
### [Create VM with a template](ps-template.md)
### [Create VM with C#](csharp.md)
### [Create VM with C# and template](csharp-template.md)
### [Create VM with Chef](chef-automation.md)
### [Create VM running popular application frameworks](app-frameworks.md)
### [Move a VM between subscriptions](move-vm.md)


## Configure VMs
### [Resize a VM](resize-vm.md)
### [Use tags](../../resource-group-using-tags.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
#### [Tag a VM](tag.md)
### [Backup using Recovery Services](../../backup/backup-azure-vms-first-look-arm.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
### [Manage backups with PowerShell](../../backup/backup-azure-vms-automation.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
### [Download VM template](download-template.md)
### [Common PowerShell tasks](ps-common-ref.md)
### [Manage VMs using PowerShell](ps-manage.md)
### [Common CLI tasks](cli-manage.md)
### [Manage VMs using CLI](cli-deploy-templates.md)
### [Manage VMs using C#](csharp-manage.md)

## Connect with RDP
### [Log on to a VM](connect-logon.md)

## Manage VM images
### [Find marketplace VM images](cli-ps-findimage.md)
### [Azure Hybrid Use Benefit licensing](hybrid-use-benefit-licensing.md)
### [Use Windows client images](client-images.md)
### [Prepare a VHD for upload](prepare-for-upload-vhd-image.md)
### [Create a Managed Disk image](capture-image-resource.md)
### [Create a VM from a generalized Managed Disk image](create-vm-generalized-managed.md)



## Manage VM storage
### [Azure Managed Disks](../../storage/storage-managed-disks-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
#### [FAQs](../../storage/storage-faq-for-disks.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
### [Create Managed Disk](create-managed-disk-ps.md)
### [Migrate VMs to Managed Disks](migrate-to-managed-disks.md)
#### [Convert from unmanaged to Managed Disks](convert-unmanaged-to-managed-disks.md)
#### [Migrate a classic VM to Managed Disks](migrate-single-classic-to-resource-manager.md)
### [Take a snapshot of a Managed Disk](snapshot-copy-managed-disk.md)
### Attach data disk
#### [Azure PowerShell](attach-disk-ps.md)
#### [Azure portal](attach-disk-portal.md)
### [Detach data disk](detach-disk.md)
### [Expand OS disk](expand-os-disk.md)
### [Expand data disk](expand-data-disks.md)
### [Use D: as data disk](change-drive-letter.md)
### Create VMs using unmanaged disks
#### [Upload a VHD](upload-image.md)
#### [Create an unmanaged image](capture-image.md)
#### [Create an unmanaged VM from a generalized VHD](create-vm-generalized.md)
#### [Copy a VM](vhd-copy.md)
#### [Create a VM from a specialized VHD](create-vm-specialized.md)

## [VM networking](ps-common-network-ref.md)
### [Create virtual networks](../../virtual-network/virtual-networks-create-vnet-arm-pportal.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
### [Create a VM with multiple NICs](multiple-nics.md)
### [Create a static public IP](../../virtual-network/virtual-network-deploy-static-pip-arm-portal.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
### [Configure ports, endpoints and security](endpoints-in-resource-manager.md)
### Allow access to VM
#### [Azure PowerShell](nsg-quickstart-powershell.md)
#### [Azure portal](nsg-quickstart-portal.md)
### [DNS name resolution options](../../dns/dns-for-azure-services.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
### [Create an FDQN using the portal](portal-create-fqdn.md)

## Scale and availability
### [VM availability](manage-availability.md)
### [Create an availability set](create-availability-set.md)
### [Change availability set for VM](change-availability-set.md)
### [Load Balancer overview](load-balance.md)
#### [Create a load balancer](../../load-balancer/load-balancer-get-started-internet-portal.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
### [Scale multiple VMs with VMSS](vmss-powershell-creating.md)
### [Create multiple Azure virtual machines](multiple-vms.md)
### [Vertically scale VMs with Azure Automation](vertical-scaling-automation.md)
### [Create a VM with monitoring and diagnostics](extensions-diagnostics-template.md)
### [Azure Automation overview](manage-using-azure-automation.md)

## Manage VM security
### [Reset password](reset-local-password-without-agent.md)
### [Create a work or school identity in Azure AD](create-aad-work-id.md)
### [Manage access](../../active-directory/active-directory-accessmanagement-groups-with-advanced-rules.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
### [Encrypt a disk](../../security/azure-security-disk-encryption.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
### [Apply policies to VMs](policy.md)
### [Set up Key Vault](key-vault-setup.md)
### [Set up WinRM](winrm.md)

## Use VM extensions
### [VM extensions overview](extensions-features.md)
### [Custom Script extension](extensions-customscript.md)
### [OMS agent extension](extensions-oms.md)
### [PowerShell DSC extension](extensions-dsc-overview.md)
#### [PowerShell DSC extension Credential Handling](extensions-dsc-credentials.md)
#### [DSC and VMSS with templates](extensions-dsc-template.md)
### [Azure Log Collector extension](log-collector-extension.md)
### [Azure diagnostics extension](ps-extensions-diagnostics.md)
### [Extensions in templates](extensions-authoring-templates.md)
### [Exporting VM extensions](extensions-export-templates.md)
### [Configuration samples](extensions-configuration-samples.md)
### [Troubleshoot extensions](extensions-troubleshoot.md)

## Run applications
### [SQL Server](./sql/virtual-machines-windows-sql-server-iaas-overview.md)
### [SharePoint](sharepoint-farm.md)
### [Set up a web-based LOB application in a hybrid cloud for testing](ps-hybrid-cloud-test-env-lob.md)
### [Set up a simulated hybrid cloud environment for testing](ps-hybrid-cloud-test-env-sim.md)
### [MongoDB](install-mongodb.md)
### [High-performance Computing (HPC)](hpcpack-cluster-options.md)
### [MATLAB](matlab-mdcs-cluster.md)
### [SAP](sap-get-started.md)
### [Deploying SAP IDES EHP7 SP3 for SAP ERP 6.0 on Microsoft Azure](sap-cal-ides-erp6-ehp7-sp3-sql.md)
#### [Planning and Implementation Guide](sap-planning-guide.md)
#### [High-Availability Guide](sap-high-availability-guide.md)
#### [DBMS Deployment Guide](sap-dbms-guide.md)
#### [Deployment Guide](sap-deployment-guide.md)

## Migrate VMs
### [Migrate AWS and on-premises VMs to Azure overview](on-prem-to-azure.md)
#### [Migrate from Amazon Web Services (AWS) to Azure](aws-to-azure.md)
### [Upload and create VM from generalized VHD](upload-generalized-managed.md)
### [Upload and create VM from specialized VHD](upload-specialized.md)
### [Migrate from Classic to Azure Resource Manager](migration-classic-resource-manager-overview.md)
#### [Deep Dive on migration](migration-classic-resource-manager-deep-dive.md)
#### [Plan for migration](migration-classic-resource-manager-plan.md)
#### [Migrate using PowerShell](migration-classic-resource-manager-ps.md)
#### [Common migration errors](migration-classic-resource-manager-errors.md)
#### [Community tools for migration](migration-classic-resource-manager-community-tools.md)
#### [FAQ](migration-classic-resource-manager-faq.md)

## Troubleshoot
### [Remote Desktop connections](troubleshoot-rdp-connection.md)
### [Reset RDP password](reset-rdp.md)
### [Specific RDP error messages](troubleshoot-specific-rdp-errors.md)
### [Creating a VM](troubleshoot-deployment-new-vm.md)
### [Restarting or resizing a VM](restart-resize-error-troubleshooting.md)
### [Application access](troubleshoot-app-connection.md)
### [Allocation failures](allocation-failure.md)
### [Redeploy a VM](redeploy-to-new-node.md)
### Attach virtual hard disk to troubleshooting VM
#### [Azure PowerShell](troubleshoot-recovery-disks.md) 
#### [Azure portal](troubleshoot-recovery-disks-portal.md)

# Reference
## [Azure CLI](/cli/azure/vm)
## [PowerShell](/powershell/azureps-cmdlets-docs)
## [.NET](/dotnet/api/microsoft.azure.management.compute)
## [Java](/java/api)
## [Node.js](https://azure.microsoft.com/en-us/develop/nodejs/#azure-sdk)
## [Python](http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.mgmt.compute.html)
## [Compute REST](/rest/api/compute)
## [Managed Disks REST](/rest/api/manageddisks)

# Resources
## [Author templates](../../azure-resource-manager/resource-group-authoring-templates.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
## [Community templates](https://azure.microsoft.com/documentation/templates)
## [Pricing](https://azure.microsoft.com/pricing/details/#Linux)
## [Regional availability](https://azure.microsoft.com/regions/services/)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-virtual-machine)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=virtual-machines)
## [FAQ](faq.md)