---
title: Save and manage MARS agent passphrase securely in Azure Key Vault
description: Learn how to save MARS agent passphrase securely in Azure Key Vault and retrieve them during restore.
ms.topic: how-to
ms.date: 11/07/2023
ms.reviewer: sooryar
ms.service: backup
ms.custom: devx-track-azurecli, devx-track-azurepowershell
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Save and manage MARS agent passphrase securely in Azure Key Vault

Azure Backup using the Recovery Services agent (MARS) allows you back up files/folders and system state data to Azure Recovery Services vault. This data is encrypted using a passphrase you provide during the installation and registration of the MARS agent. This passphrase is required to retrieve and restore the backup data and needs to be saved in a secure external location.


>[!Important]
>If this passphrase is lost, Microsoft will not be able retrieve backup data stored in the Recovery Services vault. We recommend that you store this passphrase in a secure external location, such as Azure Key Vault.

Now, you can save your encryption passphrase securely in Azure Key Vault as a Secret from the MARS console during installation for new machines and by changing the passphrase for existing machines. To allow saving the passphrase to Azure Key Vault, you must grant Recovery Services vault the permissions to create a Secret in the Azure Key Vault. 

## Before you start

-	[Create a Recovery Services vault](backup-create-recovery-services-vault.md) in case you don't have one.
-	You should use a single Azure Key Vault to store all your passphrases. [Create a Key Vault](../key-vault/general/quick-create-portal.md) in case you don't have one.
  - [Azure Key Vault pricing](https://azure.microsoft.com/pricing/details/key-vault/) is applicable when you create a new Azure Key Vault to store your passphrase.
  - After you create the Key Vault, to protect against accidental or malicious deletion of passphrase, [ensure that soft-delete and purge protection is turned on](../key-vault/general/soft-delete-overview.md).
-	This feature is supported only in Azure public regions with MARS agent version  *2.0.9262.0* or above.

## Configure the Recovery Services vault to store passphrase to Azure Key Vault

Before you can save your passphrase to Azure Key Vault, configure your Recovery Services vault and Azure Key Vault,

To configure a vault, follow these steps in the given sequence to achieve the intended results. Each action is discussed in detail in the sections below:

1. Enabled system-assigned managed identity for the Recovery Services vault.
2. Assign permissions to the Recovery Services vault to save the passphrase as a Secret in Azure Key Vault.
3. Enable soft-delete and purge protection on the Azure Key Vault.

>[!Note]
>-	Once you enable this feature, you must not disable the managed identity (even temporarily). Disabling the managed identity may lead to inconsistent behavior.
>-	User-assigned managed identity is currently not supported for saving passphrase in Azure Key Vault.


### Enable system-assigned managed identity for the Recovery Services vault

**Choose a client**:

# [Azure portal](#tab/azure-portal)

Follow these steps:

1. Go to your *Recovery Services vault* > **Identity**.

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/recovery-services-vault-identity.png" alt-text="Screenshot shows how to go to Identity in Recovery Services vault." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/recovery-services-vault-identity.png":::

2. Select the **System assigned** tab.
3. Change the **Status** to **On**.
4. Select **Save** to enable the identity for the vault.

An Object ID is generated, which is the system-assigned managed identity of the vault.


# [PowerShell](#tab/powershell)

To enable system-assigned managed identity for the Recovery Services vault, use the [Update-AzRecoveryServicesVault](/powershell/module/az.recoveryservices/update-azrecoveryservicesvault) cmdlet.

**Example**

```azurepowershell
$vault=Get-AzRecoveryServicesVault -ResourceGroupName "testrg" -Name "testvault"
Update-AzRecoveryServicesVault -IdentityType SystemAssigned -ResourceGroupName TestRG -Name TestVault
$vault.Identity | fl

```

```Output
PrincipalId : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TenantId    : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Type        : SystemAssigned

```


# [CLI](#tab/cli)

To enable system-assigned managed identity for the Recovery Services vault, use the `az backup vault identity assign` command.

**Example**

```azurecli
az backup vault identity assign --system-assigned --resource-group MyResourceGroup --name MyVault

```

```Output
PrincipalId : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TenantId    : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Type        : SystemAssigned

```

---

### Assign permissions to save the passphrase in Azure Key Vault

Based on the Key Vault permission model (either role-based access permissions or access policy-based permission model) configured for Key Vault, refer to the following sections.

#### Enable permissions using role-based access permission model for Key Vault

**Choose a client:**

# [Azure portal](#tab/azure-portal)

To assign the permissions, follow these steps:

1. Go to your *Azure Key Vault* > **Settings** > **Access Configuration** to ensure that the permission model is **RBAC**.

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/open-access-configuration.png" alt-text="Screenshot shows how to open access configuration under settings." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/open-access-configuration.png":::

2. Select **Access control (IAM)** > **+Add** to add role assignment.

3. The Recovery Services vault identity requires the **Set permission on Secret** to create and add the passphrase as a Secret to the Key Vault. 

   You can select a *built-in role* such as **Key Vault Secrets Officer** that has the permission (along with other permissions not required for this feature) or [create a custom role](../key-vault/general/rbac-guide.md?tabs=azurepowershell#creating-custom-roles) with only Set permission on Secret. 

   Under **Details**, select **View** to view the permissions granted by the role and ensure *Set* permission on *Secret* is available.
 
   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/view-permission-details.png" alt-text="Screenshot shows how to view the permission details." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/view-permission-details.png":::

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/check-set-permission-availability-on-secret.png" alt-text="Screenshot shows how to check the Set permission availability." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/check-set-permission-availability-on-secret.png":::

4. Select **Next** to proceed to select Members for assignment. 

5. Select **Managed identity** and then **+ Select members**. choose the **Subscription** of the target Recovery Services vault, select Recovery Services vault under **System-assigned managed identity**.

   Search and select the *name of the Recovery Services vault*.

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/add-members-in-managed-identity.png" alt-text="Screenshot shows how to add members in managed identity." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/add-members-in-managed-identity.png":::
 
6. Select **Next**, review the assignment, and select **Review + assign**.

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/review-and-assign-permissions.png" alt-text="Screenshot shows how to review and assign permissions." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/review-and-assign-permissions.png":::

7. Go to **Access control (IAM)** in the Key Vault, select **Role assignments** and ensure that the Recovery Services vault is listed.

     :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/recovery-services-vault-listed-in-access-control.png" alt-text="Screenshot shows the Recovery Services vault is listed in access control." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/recovery-services-vault-listed-in-access-control.png":::
 

# [PowerShell](#tab/powershell)

To assign the permissions, run the following cmdlet:

```azurepowershell
#Find the application id for your recovery services vault
Get-AzADServicePrincipal -SearchString <principalName>
#Identify a role with Set permission on Secret, like Key Vault Secret Office
Get-AzRoleDefinition | Format-Table -Property Name, IsCustom, Id
#Assign role to Recovery Services Vault identity 
Get-AzRoleDefinition -Name <roleName>
#Assign by Service Principal ApplicationId
New-AzRoleAssignment -RoleDefinitionName 'Key Vault Secrets Officer' -ApplicationId {i.e 8ee5237a-816b-4a72-b605-446970e5f156} -Scope /subscriptions/{subscriptionid}/resourcegroups/{resource-group-name}/providers/Microsoft.KeyVault/vaults/{key-vault-name}

```

# [CLI](#tab/cli)

To assign the permissions, run the following command:

```azurecli
#Find the application id for your recovery services vault
az ad sp list --all --filter "displayname eq '<my recovery vault name>' and servicePrincipalType eq 'ManagedIdentity'"
#Identify a role with Set permission on Secret, like Key Vault Secret Office
az role definition list --query "[].{name:name, roleType:roleType, roleName:roleName}" --output tsv
az role definition list --name "{roleName}"
#Assign role to Recovery Services Vault identity 
az role assignment create --role "Key Vault Secrets Officer" --assignee "<application id>" {i.e "55555555-5555-5555-5555-555555555555"} --scope /subscriptions/{subscriptionid}/resourcegroups/{resource-group-name}/providers/Microsoft.KeyVault/vaults/{key-vault-name}

```

---

#### Enable permissions using Access Policy permission model for Key Vault

**Choose a client**:

# [Azure portal](#tab/azure-portal)

Follow these steps:

1. Go to your *Azure Key Vault* > **Access Policies** > **Access policies**, and then select **+ Create**.

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/create-access-policies.png" alt-text="Screenshot shows how to start creating a Key Vault." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/create-access-policies.png":::

2. Under **Secret Permissions**, select **Set operation**. 

   This specifies the allowed actions on the Secret.

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/set-secret-permissions.png" alt-text="Screenshot shows how to start setting permissions." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/set-secret-permissions.png":::

3. Go to **Select Principal** and search for your *vault* in the search box using its name or managed identity. 

   Select the *vault* from the search result and choose **Select**.

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/assign-principal.png" alt-text="Screenshot shows the assignment of permission to a selected vault." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/assign-principal.png":::

4. Go to **Review + create**, ensure that **Set permission** is available and **Principal** is the correct *Recovery Services vault*, and then select **Create**.

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/review-and-create-access-policy.png" alt-text="Screenshot shows the verification of the assigned Recovery Services vault and create the Key Vault." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/review-and-create-access-policy.png":::

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/check-access-policies.png" alt-text="Screenshot shows how to verify the access present." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/check-access-policies.png":::


# [PowerShell](#tab/powershell)

To get the Principal ID of the Recovery Services vault, use the [Get-AzADServicePrincipal](/powershell/module/az.resources/get-azadserviceprincipal) cmdlet. Then use this ID in the [Get-AzADServicePrincipal](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy) cmdlet to set an access policy for the Key vault.

**Example**

```azurepowershell
$sp = Get-AzADServicePrincipal -DisplayName MyVault
$Set-AzKeyVaultAccessPolicy -VaultName myKeyVault -ObjectId $sp.Id -PermissionsToSecrets set

```

# [CLI](#tab/cli)

To get the principal ID of the Recovery Services vault, use the `az ad sp list` command. Then use this ID in the `az keyvault set-policy` command to set an access policy for the Key vault.

**Example**

```azurecli
az ad sp list --display-name MyVault
az keyvault set-policy --name myKeyVault --object-id <object-id> --secret-permissions set

```


---

### Enable soft-delete and purge protection on Azure Key Vault

You need to enable soft-delete and purge protection on your Azure Key Vault that stores your encryption key.

*Choose a client**

# [Azure portal](#tab/azure-portal)

You can enable soft-delete and purge protection from the Azure Key Vault.

Alternatively, you can set these properties while creating the Key Vault. [Learn more](../key-vault/general/soft-delete-overview.md) about these Key Vault properties. 

:::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/enable-soft-delete-and-purge-protection.png" alt-text="Screenshot shows how to enable spft-delete." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/enable-soft-delete-and-purge-protection.png":::

# [PowerShell](#tab/powershell)


1. Sign in to your Azure account.

   ```azurepowershell   
   Login-AzAccount
   ```

2. Select the *subscription* that contains your vault.

   ```azurepowershell
   Set-AzContext -SubscriptionId SubscriptionId
   ```

3. Enable *soft-delete*.

   ```azurepowershell
   ($resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName "AzureKeyVaultName").ResourceId).Properties | Add-Member -MemberType "NoteProperty" -Name "enableSoftDelete" -Value "true"
   Set-AzResource -resourceid $resource.ResourceId -Properties $resource.Properties
   ```

4. Enable *purge protection*.

   ```azurepowershell
   ($resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName "AzureKeyVaultName").ResourceId).Properties | Add-Member -MemberType "NoteProperty" -Name "enablePurgeProtection" -Value "true"
   Set-AzResource -resourceid $resource.ResourceId -Properties $resource.Properties

   ```

# [CLI](#tab/cli)

1. Sign in to your Azure Account.

   ```azurecli
   az login
   ```

2. Select the subscription that contains your vault.

   ```azurecli
   az account set --subscription "Subscription1"
   ```

3. Enable soft delete

   ```azurecli
   az keyvault update --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} -n {VAULT NAME} --enable-soft-delete true
   ```

4. Enable purge protection

   ```azurecli
   az keyvault update --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} -n {VAULT NAME} --enable-purge-protection true 
   ```


---


## Save passphrase to Azure Key Vault for a new MARS installation

Before proceeding to install the MARS agent, ensure that you have  [configured the Recovery Services vault to store passphrase to Azure Key Vault](#configure-the-recovery-services-vault-to-store-passphrase-to-azure-key-vault) and you have successfully:

1. Created your Recovery Services vault.
2. Enabled the Recovery Services vault's system-assigned managed identity.
3. Assigned permissions to your Recovery Services vault to create Secret in your Key Vault.
4. Enabled soft delete and purge protection for your Key Vault.

5. To install the MARS agent on a machine, download the MARS installer from the Azure portal, and then [use installation wizard](install-mars-agent.md).

6. After providing the *Recovery Services vault credentials* during registration, in the **Encryption Setting**,  select the option to save the passphrase to Azure Key Vault.

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/save-passphrase.png" alt-text="Screenshot shows the option to save the passphrase to Azure Key Vault to be selected." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/save-passphrase.png":::

7. Enter your *passphrase* or select **Generate Passphrase**.
4. In the *Azure portal*, open your *Key Vault*, copy the *Key Vault URI*.

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/copy-key-vault-url.png" alt-text="Screenshot shows how to copy the Key Vault URI." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/copy-key-vault-url.png":::

5. Paste the *Key Vault URI* in the *MARS console*, and then select **Register**.

   If you encounter an error, [check the troubleshooting section](#troubleshoot-common-scenarios) for more information.

8. Once the registration succeeds, the option to *copy the identifier to the Secret* is created and the passphrase is NOT saved to a file locally.  

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/server-registration-success.png" alt-text="Screenshot shows the option to copy the identifier to the Secret gets creates." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/server-registration-success.png":::

   If you change the passphrase in the future for this MARS agent, a new version of the Secret will be added with the latest passphrase.

You can automate this process by using the new KeyVaultUri option in `Set-OBMachineSetting command` in the [installation script](./scripts/register-microsoft-azure-recovery-services-agent.md).

## Save passphrase to Azure Key Vault for an existing MARS installation

If you have an existing MARS agent installation and want to save your passphrase to Azure Key Vault, [update your agent](upgrade-mars-agent.md) to version *2.0.9262.0* or above and perform a change passphrase operation.

After updating your MARS agent, ensure that you have [configured the Recovery Services vault to store passphrase to Azure Key Vault](#configure-the-recovery-services-vault-to-store-passphrase-to-azure-key-vault) and you have successfully:

1. Created your Recovery Services vault.
2. Enabled the Recovery Services vault's system-assigned managed identity.
3. Assigned permissions to your Recovery Services vault to create Secret in your Key Vault.
4. Enabled soft delete and purge protection for your Key Vault

To save the passphrase to Key Vault:

1. Open the *MARS agent console*.

   You should see a banner asking you to select a link to save the passphrase to Azure Key Vault. 

   Alternatively, select **Change Properties** > **Change Passphrase** to proceed.

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/save-passphrase-key-vault.png" alt-text="Screenshot shows how to start changing passphrase for an existing MARS installation." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/save-passphrase-key-vault.png":::

2. In the **Change Properties** dialog box, the option to *save passphrase to Key Vault by providing a Key Vault URI* appears.

   >[!Note]
   >If the machine is already configured to save passphrase to Key Vault, the Key Vault URI will be populated in the text box automatically.

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/enter-key-vault-url.png" alt-text="Screenshot shows the option to save passphrase to Key Vault by providing a Key Vault URI gets generated." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/enter-key-vault-url.png":::

3. Open the *Azure portal*, open your *Key Vault*, and then *copy the Key Vault URI*.

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/copy-key-vault-url.png" alt-text="Screenshot shows how to copy the Key Vault URI." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/copy-key-vault-url.png":::

4. *Paste the Key Vault URI* in the *MARS console*, and then select **OK**.

   If you encounter an error, [check the troubleshooting section](#troubleshoot-common-scenarios) for more information.

5. Once the change passphrase operation succeeds, an option to *copy the identifier to the Secret* gets created and the passphrase is NOT saved to a file locally.

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/passphrase-saved-to-key-vault.png" alt-text="Screenshot shows an option to copy the identifier to the Secret gets created." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/passphrase-saved-to-key-vault.png":::

   If you change the passphrase in the future for this MARS agent, a new version of the *Secret* will be added with the latest passphrase.

You can automate this step by using the new KeyVaultUri option in [Set-OBMachineSetting](/powershell/module/msonlinebackup/set-obmachinesetting?view=msonlinebackup-ps&preserve-view=true) cmdlet.

## Retrieve passphrase from Azure Key Vault for a machine

If your machine becomes unavailable and you need to restore backup data from the Recovery Services vault via [alternate location restore](restore-all-files-volume-mars.md#volume-level-restore-to-an-alternate-machine), you need the machine’s passphrase to proceed.

The passphrase is saved to Azure Key Vault as a Secret. One Secret is created per machine and a new version is added to the Secret when the passphrase for the machine is changed. The Secret is named as `AzBackup-machine fully qualified name-vault name`.

To locate the machine’s passphrase:

1. In the *Azure portal*, open the *Key Vault used to save the passphrase for the machine*.

   We recommend you to use one Key Vault to save all your passphrases.

2. Select **Secrets** and search for the secret named `AzBackup-<machine name>-<vaultname>`.

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/locate-passphrase.png" alt-text="Screenshot shows bow to check for the secret name." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/locate-passphrase.png":::
 
3. Select the **Secret**, open the latest version and *copy the value of the Secret*.

   This is the passphrase of the machine to be used during recovery.

   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/copy-passphrase-from-secret.png" alt-text="Screenshot shows selection of the secret." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/copy-passphrase-from-secret.png":::

   If you have a large number of Secrets in the Key Vault, use the Key Vault CLI to list and search for the secret.

```azurecli
az keyvault secret list --vault-name 'myvaultname’ | jq '.[] | select(.name|test("AzBackup-<myvmname>"))'

```

## Troubleshoot common scenarios

This section lists commonly encountered errors when saving the passphrase to Azure Key Vault.

### System identity isn't configured – 391224

**Cause**: This error occurs if the Recovery Services vault doesn't have a system-assigned managed identity configured.

**Recommended action**: Ensure that system-assigned managed identity is configured correctly for the Recovery Services vault as per the [prerequisites](#before-you-start).

### Permissions aren't configured – 391225

**Cause**: The Recovery Services vault has a system-assigned managed identity, but it doesn't have **Set permission** to create a Secret in the target Key Vault.

**Recommended action**:

1. Ensure that the vault credential used corresponds to the intended recovery services vault.
2.	Ensure that the Key Vault URI corresponds to the intended Key Vault.
3.	Ensure that the Recovery Services vault name is listed under Key Vault -> Access policies -> Application, with Secret Permissions as Set. 
 
   :::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/check-secret-permissions-is-set.png" alt-text="Screenshot shows the Recovery Services vault name is listed under Key Vault." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/check-secret-permissions-is-set.png":::

   If it's not listed, [configure the permission again](#assign-permissions-to-save-the-passphrase-in-azure-key-vault).

### Azure Key Vault URI is incorrect - 100272

**Cause**: The Key Vault URI entered isn't in the right format.

**Recommended action**: Ensure that you have entered a Key Vault URI copied from the Azure portal.  For example, `https://myvault.vault.azure.net/`. 
 
:::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/copy-key-vault-url.png" alt-text="Screenshot shows how to copy Kay Vault URL." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/copy-key-vault-url.png":::

 
### UserErrorSecretExistsSoftDeleted (391282) 

**Cause**: A secret in the expected format already exists in the Key Vault, but it's in a soft-deleted state. Unless the secret is restored, MARS can't save the passphrase for that machine to the provided Key Vault.

**Recommended action**: Check if a secret exists in the vault with the name `AzBackup-<machine name>-<vaultname>` and if it's in a soft-deleted state. Recover the soft deleted Secret to save the passphrase to it.

### UserErrorKeyVaultSoftDeleted (391283) 

**Cause**: The Key Vault provided to MARS is in a soft-deleted state.

**Recommended action**: Recover the Key Vault or provide a new Key Vault.

### Registration is incomplete

**Cause**: You didn't complete the MARS registration by registering the passphrase. So, you'll not be able to configure backups until you register. 

**Recommended action**: Select the warning message and complete the registration.

:::image type="content" source="./media/save-backup-passphrase-securely-in-azure-key-vault/registration-incomplete-warning.png" alt-text="Screenshot shows how to complete the registration." lightbox="./media/save-backup-passphrase-securely-in-azure-key-vault/registration-incomplete-warning.png":::

 
