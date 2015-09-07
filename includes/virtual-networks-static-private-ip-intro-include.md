# Static internal IP

Your IaaS virtual machines (VMs) and PaaS role instances in a virtual network automatically receive an internal IP address from a range that you specify. That address is retained by the VMs and role instances, until they are decommissioned. You decommission a VM or role instance by stopping it from PowerShell, the Azure CLI, or the Azure portal. In those cases, once the VM or role instance starts again, it will receive an available IP address from the Azure infrastructure, which might not be the same it previously had. In certain cases, you do not want a VM or role instance have a dynamic IP address, for example, if your VM is going to run DNS or will be a domain controller. 

>[AZURE.NOTE] A dynamic internal IP address stays with the VM if you shut down the VM from the guest operating system. VMs are only decommissioned when stopped from the Azure portal, PowerShell, or the Azure CLI.
