---
title: Integrate Oracle Exadata Database@Azure with Azure Key Vault
description: Follow a comprehensive step-by-step guide for integrating Oracle Exadata Database@Azure with Azure Key Vault.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: how-to
ms.date: 04/15/2025
ms.custom: engagement-fy23
ms.author: jacobjaygbay
---

# Integrate Oracle Exadata Database@Azure with Azure Key Vault

In this article, you learn how to store and manage Oracle Transparent Data Encryption (TDE) master encryption keys (MEKs) for Oracle Exadata Database@Azure. You can use all three tiers of the Azure Key Vault service:

* Azure Key Vault Standard
* Azure Key Vault Premium
* Azure Key Vault Managed HSM

This integration enables Oracle Database@Azure customers to meet a wide spectrum of *security*, *compliance*, and *key management* needs. These needs range from software-based key storage to single-tenant, FIPS 140-3 Level 3 validated hardware security modules (HSMs).

:::image type="content" source="media\akv-on-odaa-architecture-diagram.png" alt-text="Architecure diagram for Oracle Database at Azure using Azure Key Vault.":::

## Prerequisites

Before you begin the integration, be sure to meet the following prerequisites:

* **Oracle Database@Azure provisioned**: Deploy an Exadata virtual machine (VM) cluster in a delegated subnet in an Azure virtual network. Ensure that you have access to the Oracle Cloud Infrastructure (OCI) console for management.
* **Advanced networking**: If you haven't configured advanced networking, enable the feature as described in [Network planning for Oracle Database@Azure](/azure/oracle/oracle-db/oracle-database-network-plan). This action enables the Azure Private Link connectivity that's required for Managed HSM and Azure Arc.
* **Azure Key Vault private connectivity**: Configure a private endpoint with a DNS configure for Azure Key Vault, and ensure that Exadata can reach it. For details, see [Integrate Key Vault with Azure Private Link](/azure/key-vault/general/private-link-service).
* **NAT gateway**: Outbound internet connectivity is required for the identity connector setup to access the Microsoft Entra public endpoint. You can achieve this connectivity by using any of these methods:
  * Azure NAT Gateway
  * Azure Firewall
  * A network virtual appliance of your choice if you don't have one in the same virtual network as your Oracle deployment or in the shared hub if you're using a hub/spoke topology.
* **Private Link scope and private endpoint configuration for Azure Arc (optional)**: If you use Private Link for the Azure Arc agent installation, configure the Azure Arc Private Link scope and private endpoint, and ensure that they're reachable from Exadata. Also ensure that DNS is configured and endpoints can be resolved from Exadata.
* **Azure subscription and permissions**: Ensure that you have sufficient Azure permissions:
  * Azure **Owner** or **Contributor** role on the subscription or resource group where a key vault is created (to create resources and assign roles).
  * Microsoft Entra ID **User Administrator** role (or equivalent) if you create security groups for managing permissions.
  
  An Azure **Global Administrator** role is not required, but you should be able to obtain a Microsoft Entra ID access token for Azure Arc registration (explained in [Step 3: Set Up the Oracle identity connector](#step-3-set-up-the-oracle-identity-connector) in this article).
* **OCI privileges**: In the Oracle Cloud Infrastructure console, ensure that you have permission to manage the multicloud integration. Oracle recommends an identity and access management (IAM) policy in your OCI tenancy, such as:

  * *allow any user to manage oracle-db-azure-vaults in tenancy*
  * *where request.principal.type = 'cloudvmcluster'*  

  This IAM policy allows the Exadata VM cluster resource to manage Azure Key Vault associations.

  > [!NOTE]
  > Your cloud administrator might have already set up this policy. Otherwise, an OCI admin must add it before you can configure the database to use Azure Key Vault.

## Step 1: Create and prepare a key vault

Set up a key vault to hold your Oracle database encryption keys. If you already have a suitable key vault and key, you can use them, but ensure that they're dedicated or appropriately secured for this purpose.

1. Create a key vault. You can use the Microsoft Azure portal or the Azure CLI. The detailed steps depend on your tier of Azure Key Vault:
    * **Standard**: Follow the [quickstart for creating a key vault by using the Azure CLI](/azure/key-vault/general/quick-create-cli).
    * **Premium**: Follow the same quickstart as for Standard, but select **Premium SKU**.
    * **Managed HSM**: Follow the [quickstart for provisioning and activating Azure Key Vault Managed HSM by using the Azure CLI](/azure/key-vault/managed-hsm/quick-create-cli).

    Ensure that the key vault's region matches the region where Oracle Exadata Database@Azure is deployed (for performance and compliance). You can choose the Standard or Premium tier (both support integration). Premium is HSM-backed.

    If you require a dedicated HSM cluster, use Managed HSM. In that case, the creation command is different, as shown in the quickstart. We strongly recommend that you use a private endpoint for secure access and enhanced access control.

2. Create at least one key in the vault. Oracle TDE requires an encryption key (MEK) to be present in the vault. Oracle supports RSA keys for this purpose (2048-bit is typical).

    Alternatively, you can import a key if you have specific requirements. This option is called bring your own key (BYOK). But for most cases, generating a new RSA key in Azure is simplest. Make sure that the key is enabled, and note the key name. Oracle later refers to this key by its Azure name when you link the database.

    > [!TIP]
    > Why create the key now? During vault registration, the Oracle control plane checks that at least one key exists in the vault. If none is found, the vault registration fails. Creating a key up front avoids that issue.

3. (For Managed HSM only): If you chose Managed HSM, after provisioning, you must activate the HSM (if not already) and create a key in it:

  ```az keyvault key create --hsm-name <HSM_Name> -n $KEY_NAME ...```

  Managed HSM uses a different permission model: local HSM roles. We'll cover the role assignments in the next step.

At this point, you have an key vault (or HSM) ready, with a master key that's is used for Oracle TDE. The next step is to set up permissions so that the Oracle Exadata VM cluster can access this vault and key securely.

## Step 2: Configure Microsoft Entra ID permissions for key vault access

Allow the Oracle Exadata VM cluster (specifically, the Azure Arc identity of its VMs) to access the key vault and perform key operations without over-privileging. These operations include unwrapping keys and creating new key versions for rotation. You can provide this access by using Microsoft Entra ID role-based access control (RBAC). The general approach is as follows:

1. Create a security group in Microsoft Entra ID.
1. After the Oracle VM cluster is Azure Arc-enabled (as described in [Step 3: Set Up the Oracle identity connector](#step-3-set-up-the-oracle-identity-connector) in this article), add the machine's managed identity to this group.
1. Assign Azure Key Vault roles to the group.

This way, if you have multiple database VMs or clusters, you can manage their access via group membership and roles.

To configure Microsoft Entra ID permissions:

1. Create a Microsoft Entra ID security group (optional and recommended).  You can create a group by using the Azure portal (Microsoft Entra ID pane > **Groups** > **New Group**) or the Azure CLI.

    Make note of the `$GROUP_OBJECT_ID` value. This group remains empty for now. You add members in [Step 3: Set Up the Oracle identity connector](#step-3-set-up-the-oracle-identity-connector) after the Azure Arc connector is set up. You create the identities that need access during that process.
2. Assign two roles to the security principal (the group, in this case) for the key vault:
    * **Key Vault crypto officer**: Allows managing keys (create, delete, and list key versions) and performing cryptographic operations ( for example, unwrap and decrypt).
    * **Key Vault reader**: Allows viewing the properties of a key vault.
3. Using Azure CLI, assign these roles on the key vault scope:

   > [!NOTE]
   > If you prefer to use Azure Key Vault access policies instead of RBAC, use `az keyvault set-policy` to allow a Microsoft Entra ID principal to perform `nwrap key` and `et key`operations. However, the RBAC method is the modern approach and aligns with Oracle's documented roles.

4. (For Managed HSM only): Azure RBAC uses a different set of roles. According to Oracle's guidance, for Managed HSM, you should assign the Azure RBAC Reader role for the HSM resource. Then, use the HSM local RBAC to assign **Managed HSM Crypto Officer** and **Managed HSM Crypto User** to your principal.

    You can make these assignments in the Azure portal's Managed HSM access control page. You can also use the security group for these assignments.

    Ensure that the principal is added as an Managed HSM Crypto Officer at minimum. A Crypto Officer can generate new key versions for rotation, A Crypto User can use the keys.

## Step 3: Set Up the Oracle identity connector

Setting up the Oracle identity connector automatically configures the Azure Arc agent to allow communication with Azure services (Azure Key Vault) by using an Azure identity.  

When you create an identity connector via the OCI console, each VM in the cluster is registered as an Azure Arc-enabled server in your Azure subscription. This registration grants the VMs a managed identity in Microsoft Entra ID. The managed identity is applied for access to the key vault.

Here's how to create the connector:

1. The OCI console asks for an Azure access token to authorize the Azure Arc installation. Obtain this token by using an Azure account that has permissions to register Azure Arc machines in the specified subscription or resource group. Usually an Owner or Contributor on the resource group is sufficient.

    To obtain the access token by using the Azure CLI, make sure that you're signed in as an appropriate user. Then save the `AZURE_TOKEN` output, which is a long JSON web token string. Also note your Azure tenant ID (the `TENANT_ID` value, which is a GUID), because the OCI console requires it. The subscription ID is automatically detected from the Exadata VM cluster info, but take note just in case.

    > [!TIP]
    > The access token is sensitive and valid for a limited time. Treat it like a password. It's used only once to establish the connection.

2. Create an identity connector in the OCI console:

    1. Log in to the OCI console for Oracle Database@Azure.

    1. Go to your Exadata VM cluster resource. On the menu, select **Oracle Database** > **Oracle Exadata Database Service on Dedicated Infrastructure** > **Exadata VM Clusters**, and then select your cluster name.

    1. On the page for VM cluster details, find the **Multicloud information** section. The **Identity connector** value is likely **None** because you have't set up the connector yet. Select **Create**.

       :::image type="content" source="media/oracle-create-identity-connector.png" alt-text="Screenshot that shows the button for creating an identity connector.":::  

    1. In the form that appears, the fields for connector name, Exadata VM cluster, Azure subscription ID, and Azure resource group name are autofilled. These values come from when the Exadata was provisioned. Oracle knows the Azure subscription and resource group that you used.

    1. Enter the Azure tenant ID. Copy it from the `TENANT_ID` value that you noted earlier.

    1. Enter the access token, which is the `AZURE_TOKEN` string that you obtained earlier.

        :::image type="content" source="media/oracle-identity-connector-info.png" alt-text="Screenshot that shows where to find identity connector information.":::

    1. Under **Advanced Options**, if you intend to use private connectivity for Azure Arc:
        * Enter the Private Link scope name that you created in the Azure portal when you set up Private Link for Azure Arc. For example, enter the resource name of type `Microsoft.HybridCompute/privateLinkScopes`.
        * Make sure that any required DNS or networking for Private Link is in place, according to Microsoft requirements. If you're using the simpler network address translation (NAT) approach, you can leave this box blank.

        :::image type="content" source="media/oracle-identity-connector-info-advanced-options.png" alt-text="Screenshot that shows where to find advanced options for identity connector information.":::
    1. Select **Create** to create the identity connector.

    The Oracle platform uses the token to register the Azure Arc agent:

    * The Oracle platform installs the Azure Arc agent on each database VM in the cluster.
    * The VMs are registered in Azure Arc. In the Azure portal, two new Azure Arc resources should soon appar, if there are two database nodes in Oracle Real Application Clusters (RAC). These resources appear under the specified resource group in **Azure Arc** > **Servers**. Each has a name like the VM's name.
    * Oracle's console shows the identity connector status. Go to **Database Multicloud Integrations** > **Identity Connectors** to verify that the connector exists. On the **VM Cluster** page, the **Identity Connector** field should now show the connector name instead of **None**.

    > [!TIP]
    > If the connector creation fails, double-check the token and tenant ID. If the token expired, generate a fresh one. Also verify that the displayed Azure subscription ID and resource group are correct.
    >
    > The user who generates the token must have rights to create Azure Arc resources. Azure automatically creates a service principal for the Azure Arc agent. Make sure the Azure resource provider `Microsoft.HybridCompute` is registered in your subscription.

3. After the connector is up, each of your Exadata VMs has a managed identity in Microsoft Entra ID. You need to grant these identities (set up in [Step 2: Configure Microsoft Entra ID permissions for Key Vault access](#step-2-configure-microsoft-entra-id-permissions-for-key-vault-access)) access to the key vault. If you used a security group:
    1. Find the object IDs of the new Azure Arc server identities. In the Azure portal, go to **Microsoft Entra ID** > **Entities** > **Enterprise applications** or the Azure Arc resource. The principal object ID might be listed.

       An easier way is to use the Azure CLI to list Azure Arc-connected machines and get their principal IDs. Each Azure Arc machine has an identity with a `principalId` value. Alternatively, you should see JSON with a `principalId` value (object ID) for the system-assigned identity.

    1. Add each Azure Arc machine's `principalId` vaule as a member of the Microsoft Entra ID group that you created earlier. You can use the Azure portal (**Microsoft Entra ID** > **Group** > **Members** > **Add**) or the Azure CLI.

       If you didn't use a group, you can instead assign the Azure Key Vault roles directly to each `principalId` value of the VM's managed identity by using `az role assignment create` with an `assignee-principal-type` value of `ServicePrincipal` and the `principalId` value. Using a group is cleaner for multiple nodes.

At this point, the Oracle VM cluster is Azure Arc-enabled. Its Azure identity now has permissions on the key vault via group membership or direct assignment. The "plumbing" is in place: the database VMs can reach Azure Key Vault service endpoints through NAT or Private Link. The database VMs have credentials (a managed identity) that Azure recognizes and authorizes for key access.

## Step 4: Enable Azure Key Vault key management on the VM cluster

Activate the Azure Key Vault integration at the Exadata VM cluster level. This installs the required Oracle library/plugin on the cluster VMs that allows databases to use Azure Key Vault as a keystore.

In the OCI console:

* Go to the Exadata VM cluster details page where you created the connector.
* In the Multicloud Information section, find Azure key store or Azure Key Management status. It should currently say "Disabled."
* Select Enable next to Azure key store.
* Confirm the action in the dialog that appears (select Enable).

:::image type="content" source="media/oracle-enable-azure-key-management.png" alt-text="Screenshot that shows where to Enable Azure key management in the OCI console.":::

This action triggers installation of an Oracle software library on the cluster VMs. This is likely an extension to Oracle's TDE wallet software that knows how to interface with Azure Key Vault. It only takes a minute or two. Once done, the OCI console shows Azure key store: Enabled on the VM cluster.

Now, the cluster is configured to support Azure Key Vault. Importantly:

* This setting is cluster-wide, but it does not automatically switch any database to use Azure Key Vault. It makes the option available. Databases on this cluster can either use the traditional Oracle Wallet or Azure Key Vault, side by side. For example, you might enable Azure Key Vault and then migrate one database at a time.  
* If for some reason you needed to disable it, you could click "Disable," which uninstalls the library. However, don't disable if you have databases actively using Azure Key Vault, as they would lose access to their keys you'd have to re-enable to get them functioning again.

At this stage, you've completed the core setup: Azure side is ready and Oracle side (cluster) is ready. The remaining steps involve connecting an actual Oracle database to the Key Vault key.

## Step 5: Register the Azure Key Vault in OCI (optional, as needed)

Inform Oracle's system about the existence of your key vault and prepare it for use. In many cases, this is done automatically when you create or switch a database's key store, but it's useful to know how to do it explicitly, especially if you plan to use the same vault across multiple clusters.

Oracle allows you to register Azure key vaults in the OCI console:

1. Navigate to *Database Multicloud Integrations* > **Microsoft Azure Integration**.

1. Click on Azure Key Vaults.

   :::image type="content" source="media/oracle-register-azure-key-vault.png" alt-text="Screenshot that shows where to Register Azure key vaults in the OCI console.":::

1. Click Register Azure key vaults. In the dialog:

   * Choose the Compartment, which is the compartment where your Exadata VM cluster is.
   * Select the identity connector to use for discovery. Choose the connector you created in Step 3.
   * Click Discover. The system uses the Azure Arc connector to query Azure and should list any key vaults in the subscription/resource group accessible by that connector. Your vault created in Step 1 should appear, identified by its name.
   * Select the vault from the list, then click Register.

After registration:

* The vault is listed in OCI with a status, likely "Available," and details like type such as key vault or Managed HSM, or Azure resource group.
* A default association is automatically created between this vault and the identity connector you used for discovery. You can view this by clicking the vault name and checking the "Identity connector associations" tab.
* If you had multiple Exadata VM clusters with different connectors that need to use the same key vault, you would have to manually create more associations: click Create association, and link the vault to another identity connector. This scenario is advanced (for example, a primary and standby cluster in different regions both using one centralized vault – ensure network connectivity is appropriate).

Now Oracle OCI knows about your key vault and has it associated with the cluster's connector, meaning the path is clear for a database to use it.

## Step 6: Configure an Oracle database to use Azure Key Vault

Finally, you need to configure one or more Oracle databases on the Exadata VM cluster to use Azure Key Vault for TDE key storage. You can do this either during database creation for new databases or by migrating an existing database from using the Oracle wallet to Azure Key Vault.

### Scenario A: Create a new database with Azure Key Vault

When provisioning a new Oracle database on the Exadata VM cluster via OCI console:

* Start the "Create Database" wizard. This assumes you already have at least one Database Home on the cluster to house the database.
* You'll see an option for Key Management or Encryption in the form. Choose Azure Key Vault from the drop-down instead of Oracle-managed Wallet.
* You then select the Vault and Key:
  * Select the compartment where the vault was registered.
  * Select the Vault name.
  * Select the Key. The key you created in Step 1 should appear by name.
* Proceed with other database creation parameters (DB name, PDB name, character set, etc.) and submit.

The provisioning process fetches the chosen key from Azure Key Vault and set up TDE for the new database using that key. When the database creation is complete, you can go to the Database's detail page in OCI and scroll to the Encryption section. It should show Key Management: Azure Key Vault, and display the Key name or its Azure identifier and an OCI internal identifier for the key. This confirms the new database's TDE master encryption key is stored in Azure Key Vault and not in a local wallet.

### Scenario B: Migrate an existing database to Azure Key Vault

For an Oracle database already running on the VM cluster that currently uses the default Oracle Wallet for TDE keys, you can switch it to use Azure Key Vault.

Using the OCI Console:

1. Navigate to the specific Database resource page under the VM cluster's list of databases.
1. On the Database Information tab, find the Encryption / Key Management section. It should show that it's currently using Oracle Wallet if it hasn't been changed yet.
1. Click the Change link next to the Key Management field.

   :::image type="content" source="media/oracle-change-key-management.png" alt-text="Screenshot that shows where to change key management in the OCI console."lightbox="media/oracle-change-key-management.png":::

1. A dialog or form appears to Change key management. Provide:
   * New Key Management: select **Azure Key Vault**.
   * Vault Compartment, then select the Vault.
   * Key Compartment, which is likely the same as vault's, then select the Key from the drop-down list.

1. Click Save changes or OK to confirm.

Oracle performs the key migration:

* It associates the selected Azure Key Vault key with the database.
* In the background, the database retrieves the Azure key using the Azure Arc connector and the permissions set up, and re-encrypts its TDE wallet. Essentially, it takes the current TDE master key, which was in the wallet, and securely transfers it into Azure Key Vault. Or, if you selected a brand new key, it sets that as the new master key and re-encrypt the data encryption keys with it.
* This operation usually takes a few seconds. It doesn't require the database to be shut down. TDE master key operations can be done online. However, during the switch, new encrypt/decrypt operations might be paused briefly.

Once done, refresh the Database page and verify that Key Management now shows Azure Key Vault, and it lists the key name/OCID as with a newly created DB.

### Important

*Switching back* from Azure Key Vault to Oracle Wallet is not supported via the OCI console or API. Oracle treats the move to an external KMS as one-way, though technically you could manually export the key and re-import to a wallet if necessary. The console explicitly does not allow changing from Azure Key Vault back to local wallet.  

**Pluggable Databases (PDBs)**: If your CDB contains multiple PDBs with TDE enabled, they use the CDB's master key by default. In Oracle 19c, there's a single TDE master key per CDB. Starting with Oracle 21c, per-PDB keys are supported. However, you typically only need to perform key management at the CDB level, as all PDBs inherit the setting.

If you happen to use separate keys for individual PDBs, you would need to repeat the key management process for each PDB resource. Oracle's interface lists per-PDB keys if applicable.

Now your Oracle database is using the key in Azure Key Vault for all encryption operations. Next, let's verify everything is working properly.

## Step 7: Verify the integration and security

With the database configured to use Azure Key Vault, it's critical to verify that everything is functioning and secure:

* **Database status**: Connect to the Oracle database and ensure you can read and write encrypted data. Typically, if TDE is configured correctly, this is transparent to the user. However, if the database can't access the key, you would see errors when trying to open the database, For example, ORA-28374, "protected by master key not found" or similar. Assuming the steps above were followed, the database should open using the Azure Key Vault key seamlessly.

* **OCI console confirmation**: On the Database's detail page in OCI, confirm it shows Azure Key Vault as the key store and lists the Key Name/OCID. This indicates Oracle's control plane knows the database is tied to that external key.

* **Azure Key Vault monitoring**: In Azure, navigate to your key vault:
  * Under Keys, you should see the key. For example, OracleTDEMasterKey. There may not be visible changes just from association, but you can check the Azure Key Vault logs. Enable Azure Key Vault's diagnostic logging if not already, and check for a "Get Key" or "Decrypt/Unwrap Key" event corresponding to when the database was opened or the key was set. This confirms the Oracle database accessed the key in Azure. Azure's logging shows the principal that accessed the key – it should be the Azure Arc machine's managed identity and identifiable by a GUID, which should match the Azure Arc principalId.
  * If you perform a rotation in the next step, you see a new key version in this list.
* **Don't delete keys** – This is worth reiterating: *Never delete the Azure Key Vault key that your database is using*. If you delete the key in Azure, the database immediately loses the ability to decrypt its data, essentially bricking the database. In OCI console, Oracle actually shows a warning if you look at the key info. If you must stop using a key, the proper procedure is to migrate the database to a new key (rotate it) before deleting the old one. Azure Key Vault supports key versioning. Old versions can be left disabled rather than deleted until no longer needed.

* **Test failover/restart**: If this is a production setup, simulate a database restart to ensure it can retrieve the key on startup. Shut down and start up the Oracle database (or reboot the VM cluster if needed – though in RAC, bounce one node at a time). The database should start without manual intervention, pulling the key from Azure Key Vault in the process. If it starts fine, the integration is solid. If it fails to open the wallet automatically, recheck Step 2 (permissions) and Step 3 (Azure Arc connectivity).

By completing these verifications, you can be confident that the Oracle Exadata Database@Azure-Azure Key Vault integration is working and your data remains accessible and secure.

## Step 8: Ongoing management and best practices

With the integration in place, consider the following for ongoing operations:

* **Key rotation**:

  Rotate the TDE master key periodically as per your security policy. For example, annually or after some days or events. Always perform rotations from the Oracle side (OCI console or API), not directly in Azure.

  * To rotate via OCI console: Go to the Database details page, Encryption section, and click Rotate. This appears next to the key info if Azure Key Vault is in use. Confirm the rotation. This generates a new key version in Azure Key Vault. You can verify a new version under the key in Azure and update the database to use the new version.

  :::image type="content" source="media/oracle-rotate-key.png" alt-text="Screenshot that shows where to rotate Azure key vaults in the OCI console.":::

  * Rotating via OCI API/CLI: Oracle provides the API RotateVaultKey for this purpose. Using oci CLI, this might be done through a command like oci db database rotate-vault-key --database-id &lt;OCID&gt;(check Oracle's CLI docs for exact syntax). This triggers the same operation.

  * **Do not** rotate by using the Azure Key Vault key rotation policy or manually creating a new version in Azure without Oracle's involvement. Azure would create a new version, but Oracle's database would be unaware and continue trying to use the old version since that's what it has stored as the master key identifier. Always initiate from Oracle's side, which coordinates with Azure.

  Keep a log of key rotations. Azure logs the new key version creation, and Oracle logs that a new key is in use. In case of any issue after rotation, you have the option to roll back to the previous key version via Oracle. though that typically isn't needed unless a new key is suspected to be compromised.

* **Key lifecycle management**: Manage the lifecycle of the keys in Azure:
  * **Retention**: Don't immediately purge old key versions. Oracle TDE can only use the latest version, but older versions might be needed to open old backups or archive logs. It's wise to keep old key versions disabled but recoverable for a certain period.
  * **Backup**: For Azure Key Vault (Standard/Premium), Microsoft manages high availability and recovery. For Managed HSM, you're responsible for backing up the HSM if needed. Follow Azure's guidance for HSM backups if applicable.
  * **Separation of duties**: Typically, DBAs handle Oracle side, and a security admin handles the Azure Key Vault side. Use Azure Key Vault access policies/RBAC to ensure DBAs can't tamper with keys beyond using them via the database, and conversely Microsoft Entra ID admins can't directly read database data – they only manage keys. Regularly audit who has access to the key vault.
* **Disaster recovery (DR)**:
  * **Managed HSM**: Follow [Managed HSM Disaster Recovery Guide](/azure/key-vault/managed-hsm/disaster-recovery-guide?tabs=uami). For increased availability, [Enable multi-region replication on Azure Managed HSM](/azure/key-vault/managed-hsm/multi-region-replication).
  * **Standard and premium**: Automatic replication enabled for paired regions. For more information, see [Azure Key Vault availability and redundancy](/azure/key-vault/general/disaster-recovery-guidance).

  If you use Oracle Data Guard for DR between two Oracle Exadata Database@Azure VM clusters, make sure the DR site is configured similarly (cross-region Dataguard scenario is not currently supported):

  * Perform Steps 1-5 on the DR Exadata VM cluster as well. You can use the **same** key vault in the DR region.
  * If using the same key vault for both primary and standby, register the vault and create an association with the standby's identity connector as noted earlier.
  * Make sure the standby database is also configured to use the Azure Key Vault key. Typically, when you add a standby to a primary that's using Azure Key Vault, Oracle expects the standby cluster to have an identity connector and key store enabled before creating the standby. So set up the connector and enable Azure key store on DR, then set up Data Guard. The primary's key info is shared to standby via Data Guard once standby is up, provided the standby can reach the key vault. Oracle's docs mention this in passing – both primary and standby must be Azure Key Vault-enabled for TDE if either is, to avoid any gaps.
  * Test a switchover or failover to ensure the standby can open with the Azure Key Vault key independently. This is a crucial DR test.

* **Patching and updates**:

  Oracle handles updates to the Exadata infrastructure and the Azure Arc agent as part of the managed service. Keep an eye on Oracle Cloud announcements for any changes to the Azure Key Vault integration feature. For example, new supported regions, or changes in required roles or supported key types. If Oracle publishes an update requiring action like updating the identity connector or library, schedule that accordingly.

### Troubleshooting common issues

* *Key vault not found during registration*:  Ensure you created at least one key and that the Azure Arc identity has list/get permissions. Also verify you selected the correct connector and compartment when discovering.

* *Permission Denied errors*: If the database fails to retrieve the key. For example, ORA-28417 "authorization denied," check Azure role assignments. The managed identity might not have the Crypto Officer or Crypto User role on the key. Fix the RBAC or access policy, then retry. You might need to re-run the change key management operation.
* *Azure Arc connector issues*: If the Azure Arc-enabled servers show as disconnected, the database may not reach Azure Key Vault. Check that the VM can reach login.microsoftonline.com and your Azure Key Vault endpoint. Use curl or similar from the VM to test connectivity/DNS. If using Private Link, verify DNS resolution is pointing to the private endpoint's IP. On the Oracle VM, you can also check the Azure Arc agent status (sudo systemctl status azauremeeting or similar service).
* *Token expiration during connector setup*: The Azure token from step 3 is short-lived. If you generated it too early and didn't submit the form in time, it may expire. Always use a fresh token within a few minutes of use.
* *Multiple key vaults*: If you ever need to move a database to a different key vault if, for example, you're migrating to a new vault, Oracle does not currently support directly changing from one external KMS to another via the console. Plan the architecture such that one vault can serve its purpose long-term, with key versions handling rotation.

### Best practices

* **Production Workloads**: For production grade Oracle Database@Azure environments, Azure Key Vault Premium or Managed HSM is strongly recommended. Azure Key Vault and Exadata VM cluster should be in the same tenant and in the same resource group. This is a known issue, and we are working to fix it.
* **Performance and compliance**: Choose the appropriate tier based on your FIPS compliance needs, key type support, and security isolation requirements.

* **Private link requirement**: For Managed HSM, Private Link integration is mandatory for secure access. Private Link connectivity is recommended for all Azure Key Vault and Oracle Database@Azure integrations.

* **AES key support**: Oracle Database@Azure customers are advised to use AES keys wherever possible. To manage TDE MEKs with AES format, you must use Managed HSM.

* **Monitoring and auditing**: Enable Azure Diagnostic Logs for monitoring key access and usage events across all tiers.

* **Dedicated vault**: Use a dedicated key vault or a dedicated key for each Oracle environment. Don't reuse the same key for different databases – each CDB should have its own TDE master key. Oracle enforces this anyway. You can keep multiple keys in one vault (one per DB), which is fine.

Finally, remember that this integration bridges two cloud services – so ensure your support contracts with Oracle and Microsoft are in place. For any issues, you have the benefit of joint support: both companies have a partnership to help customers running this setup. Oracle's support docs and Azure's documentation can be referenced for troubleshooting known issues.

## Related content

* Learn about [Azure Key Vault Integration for Oracle Database@Azure](https://docs.oracle.com/en-us/iaas/Content/database-at-azure-exadata/odexa-managing-exadata-database-services-azure.html#GUID-F1EAD7CE-73E1-41B2-AA3A-21B7657A95E1)

* Learn about [Azure Key Vault Overview](/azure/key-vault/general/overview)

* Learn about [Managed HSM Documentation](/azure/key-vault/managed-hsm/overview)
