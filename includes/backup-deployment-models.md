The Azure Backup service has two types of vaults - the Backup vault and the Recovery Services vault. The Backup vault came first. Then the Recovery Services vault came along to support the expanded Resource Manager deployments. Microsoft recommends using Resource Manager deployments unless you specifically require a Classic deployment.

| **Deployment** | **Portal** | **Vault** |
|-----------|------|-----|
|Classic|[Classic](https://manage.windowsazure.com)|Backup|
|Resource Manager|[Azure](https://portal.azure.com)|Recovery Services|

> [AZURE.NOTE] Backup vaults cannot protect Resource Manager-deployed solutions. However, you can use a Recovery Services vault to protect classically-deployed servers and VMs.  
