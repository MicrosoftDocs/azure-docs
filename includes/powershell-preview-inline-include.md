This topic includes examples that use Azure PowerShell cmdlets. Azure PowerShell is currently available in two releases - 1.0 Preview and 0.9.8. If you have existing scripts and do not want to change them right now, you can continue using the 0.9.8 release. When using the 1.0 Preview release, you should carefully test your scripts in pre-production environments before using them in production to avoid unexpected impacts.

In most cases, the only difference between the two versions is that the 1.0 Preview cmdlet name follows the pattern {verb}-AzureRm{noun}; whereas, the 0.9.8 name does not include **Rm** (for example, New-AzureRmResourceGroup instead of New-AzureResourceGroup). When the difference between the versions is more significant, this topic shows examples for both versions.

When using Azure PowerShell 0.9.8, you must first enable the Resource Manager mode by running the **Switch-AzureMode AzureResourceManager** command. This command is not necessary in 1.0 Preview.

For information about the 1.0 Preview release, including how to install and uninstall the release, see [Azure PowerShell 1.0 Preview](https://azure.microsoft.com/blog/azps-1-0-pre/). For information about significant changes in Resource Manager commands, see [Changes to Azure Resource Manager management PowerShell cmdlets](../articles/powershell-preview-resource-manager-changes.md).
