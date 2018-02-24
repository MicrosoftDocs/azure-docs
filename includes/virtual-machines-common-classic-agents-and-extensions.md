

VM extensions can help you:

* Modify security and identity features, such as resetting account values and using antimalware
* Start, stop, or configure monitoring and diagnostics
* Reset or install connectivity features, such as RDP and SSH
* Diagnose, monitor, and manage your VMs

There are many other features as well. New VM Extension features are released regularly. This article describes the Azure VM Agents for Windows and Linux, and how they support VM Extension functionality. For a listing of VM Extensions by feature category, see [Azure VM Extensions and Features](../articles/virtual-machines/windows/extensions-features.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

## Azure VM Agents for Windows and Linux
The Azure Virtual Machines Agent (VM Agent) is a secured, light-weight process that installs, configures, and removes VM extensions on instances of Azure Virtual Machines. The VM Agent acts as the secure local control service for your Azure VM. The extensions that the agent loads provide specific features to increase your productivity using the instance.

Two Azure VM Agents exist, one for Windows VMs and one for Linux VMs.

If you want a virtual machine instance to use one or more VM extensions, the instance must have an installed VM Agent. A virtual machine image created by using the Azure portal and an image from the **Marketplace** automatically installs a VM Agent in the creation process. If a virtual machine instance lacks a VM Agent, you can install the VM Agent after the virtual machine instance is created. Or, you can install the agent in a custom VM image that you then upload.

> [!IMPORTANT]
> These VM Agents are very light-weight, services that enable secured administration of virtual machine instances. There might be cases in which you do not want the VM Agent. If so, be sure to create VMs that do not have the VM Agent installed using the Azure CLI or PowerShell. Although the VM Agent can be removed physically, the behavior of VM Extensions on the instance is undefined. As a result, removing an installed VM Agent is not supported.
>

The VM Agent is enabled in the following situations:

* When you create an instance of a VM by using the Azure portal and selecting an image from the **Marketplace**,
* When you create an instance of a VM by using the [New-AzureVM](https://msdn.microsoft.com/library/azure/dn495254.aspx) or the [New-AzureQuickVM](https://msdn.microsoft.com/library/azure/dn495183.aspx) cmdlet. You can create a VM without a VM Agent by adding the **–DisableGuestAgent** parameter to the [Add-AzureProvisioningConfig](https://msdn.microsoft.com/library/azure/dn495299.aspx) cmdlet,

* When you manually download and install the VM Agent on an existing VM instance, and set the **ProvisionGuestAgent** value to **true**. You can use this technique for Windows and Linux agents, by using a PowerShell command or a REST call. (If you do not set the **ProvisionGuestAgent** value after manually installing the VM Agent, the addition of the VM Agent is not detected properly.) The following code example shows how to do this using PowerShell where the `$svc` and `$name` arguments have already been determined:

      $vm = Get-AzureVM –ServiceName $svc –Name $name
      $vm.VM.ProvisionGuestAgent = $TRUE
      Update-AzureVM –Name $name –VM $vm.VM –ServiceName $svc

* When you create a VM image that includes an installed VM Agent. Once the image with the VM Agent exists, you can upload that image to Azure. For a Windows VM, download the [Windows VM Agent .msi file](http://go.microsoft.com/fwlink/?LinkID=394789) and install the VM Agent. For a Linux VM, install the VM Agent from the GitHub repository located at <https://github.com/Azure/WALinuxAgent>. For more information on how to install the VM Agent on Linux, see the [Azure Linux VM Agent User Guide](../articles/virtual-machines/linux/agent-user-guide.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

> [!NOTE]
> In PaaS, the VM Agent is called **WindowsAzureGuestAgent**, and is always available on Web and Worker Role VMs. (For more information, see [Azure Role Architecture](http://blogs.msdn.com/b/kwill/archive/2011/05/05/windows-azure-role-architecture.aspx).) The VM Agent for Role VMs can now add extensions to the cloud service VMs in the same way that it does for persistent Virtual Machines. The biggest difference between VM Extensions on role VMs and persistent VMs is when the VM extensions are added. With role VMs, extensions are added first to the cloud service, then to the deployments within that cloud service.
>
> Use the
> [Get-AzureServiceAvailableExtension](https://msdn.microsoft.com/library/azure/dn722498.aspx)
> cmdlet to list all available role VM extensions.
>
>

## Find, Add, Update, and Remove VM Extensions
For details on these tasks, see [Add, Find, Update, and Remove Azure VM Extensions](../articles/virtual-machines/windows/classic/manage-extensions.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).
