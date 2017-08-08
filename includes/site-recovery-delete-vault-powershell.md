## Delete a Recovery Services vault (PowerShell)

1. Get the Recovery services vault

		$vault = Get-AzureRmRecoveryServicesVault -Name "ContosoVault"

2. Delete the vault

		Remove-AzureRmRecoveryServicesVault -Vault $vault

>[!WARNING]
>
> Use the above command with utmost caution since if you delete any vault by mistake, you will lose all the data. This is a permanent action and there is no way to reverse it.  


