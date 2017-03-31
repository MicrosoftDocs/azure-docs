# Overview
## [About Virtual Machines](azure-overview.md)

# Quickstart
## [Create VM - Portal](quick-create-portal.md)
## [Create VM - Azure CLI](quick-create-cli.md)
## [Create VM - PowerShell](quick-create-powershell.md)

# Samples
## [Azure CLI](cli-samples.md)
## [PowerShell](powershell-samples.md)

# Tutorials
## [Create and manage a VM](tutorial-manage-vm.md)
## [Load balance VMs](tutorial-load-balance-nodejs.md)

# Concepts
## [Azure-endorsed distributions](endorsed-distros.md)
## [Regions and availability](regions-and-availability.md)
## [Storage](azure-vm-storage-overview.md)
## [Networking](azure-vm-network-overview.md)
## [VM Scale Sets](../../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md)
## [Containers](containers.md)
## [Resource Manager](../../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
### [Deployment models](../../azure-resource-manager/resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
### [Templates for VMs](../windows/template-description.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
## [Azure Linux agent](agent-user-guide.md)
## [Azure Security Center](../../security-center/security-center-linux-virtual-machine.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
## [Disaster recovery](../virtual-machines-disaster-recovery-guidance.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
## [Planned maintenance](planned-maintenance.md)
### [Preserving maintenance](maintenance-in-place.md)
### [Restarting maintenance](impactful-maintenance.md)
## VM sizes
### [VM sizes overview](sizes.md)
#### [General purpose](sizes-general.md)
#### [Compute optimized](sizes-compute.md)
#### [Memory optimized](sizes-memory.md)
#### [Storage optimized](sizes-storage.md)
#### [GPU](sizes-gpu.md)
#### [High performance compute](sizes-hpc.md)
##### [Compute-intensive sizes](a8-a9-a10-a11-specs.md)
### [Azure compute units (ACU)](acu.md)
### [Compute benchmark scores](compute-benchmark-scores.md)
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
### [Create a VM with CLI](quick-create-cli-nodejs.md)
### [Create a VM with template](create-ssh-secured-vm-from-template.md)
### [Copy a VM](copy-vm.md)
### [Move a VM between subscriptions](move-vm.md)
### [Create highly available VMs](create-cli-complete.md)
### Deploy an app with VM template
#### [Tutorial overview](dotnet-core-1-landing.md)
#### [App architecture](dotnet-core-2-architecture.md)
#### [Access and security](dotnet-core-3-access-security.md)
#### [Availability and scale](dotnet-core-4-availability-scale.md)
#### [App deployment](dotnet-core-5-app-deployment.md)

## Configure VMs
### [Use cloud-init](using-cloud-init.md)
### [Add a user to a VM](add-user.md)
### [Resize a VM](change-vm-size.md)
### [Use tags](../../azure-resource-manager/resource-group-using-tags.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
#### [Tag a VM](tag.md)
### [Optimize your Linux VM](optimization.md)
### [Update Azure Linux agent](update-agent.md)
### [Backup using Recovery Services](../../backup/backup-azure-vms-first-look-arm.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
### [Join a RedHat VM to an Azure Active Directory Domain Service](join-redhat-linux-vm-to-azure-active-directory-domain-service.md)

## Connect with SSH
### [Create SSH keys on Linux and Mac](mac-create-ssh-keys.md)
#### [Detailed steps](create-ssh-keys-detailed.md)
### [Use SSH keys with Windows for Linux VMs](ssh-from-windows.md)
### [Install and configure Remote Desktop to connect to a Linux VM](use-remote-desktop.md)

## Manage VM images
### [Find marketplace VM images](cli-ps-findimage.md)
### [Create custom VM images](create-upload-generic.md)
### [Upload custom VM images](upload-vhd.md)
### [Capture an existing VM into an image](capture-image.md)
### Create Azure-endorsed images
#### [Ubuntu](create-upload-ubuntu.md)
#### [Debian](debian-create-upload-vhd.md)
#### [Red Hat](redhat-create-upload-vhd.md)
#### [CentOS](create-upload-centos.md)
#### [Oracle Linux](oracle-create-upload-vhd.md)

## Manage VM storage
### [Azure Managed Disks](../../storage/storage-managed-disks-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
#### [FAQs](../../storage/storage-faq-for-disks.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
### [Copy files to a Linux VM](copy-files-to-linux-vm-using-scp.md)
### [Convert a VM to Managed Disks](convert-unmanaged-to-managed-disks.md)
### [Take a snapshot of a Managed Disk](virtual-machines-linux-snapshot-copy-managed-disk.md)
### Attach a disk
#### [Azure CLI](add-disk.md)
#### [Azure portal](attach-disk-portal.md)
### [Detach a disk](detach-disk.md)
### [Expand the OS disk](expand-disks.md)
### [Configure software RAID](configure-raid.md)
### [Configure LVM](configure-lvm.md)
### [Mount Azure File Storage using SMB](mount-azure-file-storage-on-linux-using-smb.md)

## VM networking
### [Create virtual networks](../../virtual-network/virtual-networks-create-vnet-arm-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
### Deploy a VM into existing virtual network
#### [Azure CLI](deploy-linux-vm-into-existing-vnet-using-cli.md)
#### [Azure portal](deploy-linux-vm-into-existing-vnet-using-portal.md)
### [Create a VM with multiple NICs](multiple-nics.md)
### [Create a static public IP](../../virtual-network/virtual-network-deploy-static-pip-arm-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
### [Configure ports, endpoints, and security](endpoints-in-resource-manager.md)
### [Allow access to a VM](nsg-quickstart.md)
### [Use FreeBSD's Packet Filter](freebsd-pf-nat.md)
### [DNS name resolution options](azure-dns.md)
### [Use internal DNS for VM name resolution](static-dns-name-resolution-for-linux-on-azure.md)
### [Create an FQDN](portal-create-fqdn.md)
### [Create user-defined routes](../../virtual-network/virtual-network-create-udr-arm-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Scale and availability
### [VM availability](manage-availability.md)
### [Create a load balancer](../../load-balancer/load-balancer-get-started-internet-arm-ps.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
### [Create multiple VMs with Scale Sets](../../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
### [Vertically scale VMs with Azure Automation](vertical-scaling-automation.md)
### [VM Monitoring](vm-monitoring.md)

## Manage VM security
### [Disable SSH passwords by configuring SSHD](mac-disable-ssh-password-usage.md)
### [Reset SSH access, manage users, and check disks](using-vmaccess-extension.md)
### [Use root privileges](use-root-privileges.md)
### [Encrypt a VM disk](encrypt-disks.md)
### [Apply policies to VMs](policy.md)
### [Set up Key Vault](key-vault-setup.md)

## Use VM extensions
### [VM Extension overview](extensions-features.md)
### [Custom Script Extension](extensions-customscript.md)
### [OMS Agent Extension](extensions-oms.md)

## Run applications
### [Cloud Foundry](cloudfoundry-get-started.md)
### [Data Science VM overview](../../machine-learning/machine-learning-data-science-virtual-machine-overview.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
### [MongoDB](install-mongodb.md)
### [MySQL](mysql-install.md)
### [PostgreSQL](postgresql-install.md)
### [Deploy LAMP stack](create-lamp-stack.md)
### [Deploy a 3-node Deis cluster](deis-cluster.md)
### [Deploy Node.js application](../../virtual-machines-linux-nodejs-deploy.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
### [Django web app](python-django-web-app.md)
### [Jupyter Notebook](jupyter-notebook.md)
### [Deploy application frameworks from a template](app-frameworks.md)
### [High Performance Computing (HPC)](hpcpack-cluster-options.md)
#### [Run NAMD with Microsoft HPC Pack](classic/hpcpack-cluster-namd.md)
### SAP on Azure
#### [Get started with SAP](../workloads/sap/get-started.md)
#### [Planning for SAP](../workloads/sap/-planning-guide.md)
#### [Deploy SAP](../workloads/sap/deployment-guide.md)
#### [SAP DBMS guide](../workloads/sap/dbms-guide.md)
#### [SAP SUSE quick start](../workloads/sap/suse-quickstart.md)

## Docker on VMs
### [Create Docker hosts with the Azure Docker VM extension](dockerextension.md)
### [Use Docker Machine with Azure](docker-machine.md)
### [Use Docker Compose with Azure](docker-compose-quickstart.md)

## Migrate VMs
### [Overview of migration](migration-classic-resource-manager-overview.md)
### [Deep dive on migration](migration-classic-resource-manager-deep-dive.md)
### [Plan for migration](migration-classic-resource-manager-plan.md)
### [Migrate using the CLI](migration-classic-resource-manager-cli.md)
### [Common migration errors](migration-classic-resource-manager-errors.md)
### [Community tools for migration](../windows/migration-classic-resource-manager-community-tools.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
### [FAQ](migration-classic-resource-manager-faq.md)

## Troubleshoot
### [Troubleshoot SSH connections](troubleshoot-ssh-connection.md)
#### [Detailed troubleshooting steps](detailed-troubleshoot-ssh-connection.md)
### [Troubleshoot access to applications](troubleshoot-app-connection.md)
### [Troubleshoot allocation failures](allocation-failure.md)
### [Troubleshoot deployment issues](troubleshoot-deployment-new-vm.md)
### [Redeploy VM to a new Azure node](redeploy-to-new-node.md)
### Attach virtual hard disk for troubleshooting
#### [Azure CLI](troubleshoot-recovery-disks.md) 
#### [Azure portal](troubleshoot-recovery-disks-portal.md)

# Reference
## [Azure CLI](/cli/azure/vm)
## [PowerShell](/powershell/azureps-cmdlets-docs)
## [.NET](/dotnet/api/microsoft.azure.management.compute)
## [Java](/java/api)
## [Node.js](https://azure.microsoft.com/en-us/develop/nodejs/#azure-sdk)
## [Python](http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.mgmt.compute.html)
## [REST](/rest/api/compute)

# Resources
## [Author templates](../../azure-resource-manager/resource-group-authoring-templates.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
## [Community templates](https://azure.microsoft.com/documentation/templates)
## [Pricing](https://azure.microsoft.com/pricing/details/#Linux)
## [Regional availability](https://azure.microsoft.com/regions/services/)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-virtual-machine)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=virtual-machines)
## [FAQ](faq.md)