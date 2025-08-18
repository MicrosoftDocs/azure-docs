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

This integration enables Oracle Database@Azure customers to meet a wide spectrum of security, compliance, and key management needs. These needs range from software-based key storage to single-tenant, FIPS 140-3 Level 3 validated hardware security modules (HSMs).

:::image type="content" source="media\akv-on-odaa-architecture-diagram.png" alt-text="Architecture diagram for Oracle Database at Azure using Azure Key Vault.":::

## Prerequisites

* **Oracle Database@Azure provisioned**: Deploy an Exadata virtual machine (VM) cluster in a delegated subnet in an Azure virtual network. Ensure that you have access to the Oracle Cloud Infrastructure (OCI) console for management.

* **Advanced networking**: If you haven't configured advanced networking, enable the feature as described in [Network planning for Oracle Database@Azure](/azure/oracle/oracle-db/oracle-database-network-plan). This action enables the Azure Private Link connectivity that's required for Managed HSM and Azure Arc.

* **Azure Key Vault private connectivity**: Configure a private endpoint with Domain Name System (DNS) for Azure Key Vault, and ensure that Exadata can reach it. For details, see [Integrate Key Vault with Azure Private Link](/azure/key-vault/general/private-link-service).

* **NAT gateway**: Outbound internet connectivity is required for the identity connector setup to access the Microsoft Entra public endpoint. You can achieve this connectivity by using any of these methods:

  * Azure NAT Gateway
  * Azure Firewall
  * A network virtual appliance of your choice, if you don't have one in the same virtual network as your Oracle deployment or in the shared hub for a hub/spoke topology

* **Private Link scope and private endpoint configuration for Azure Arc (optional)**: If you use Private Link for the Azure Arc agent installation, configure the Private Link scope and private endpoint for Azure Arc, and ensure that they're reachable from Exadata. Also ensure that DNS is configured and endpoints can be resolved from Exadata.

* **Azure subscription and permissions**: Ensure that you have sufficient Azure permissions:

  * Azure Owner or Contributor role on the subscription or resource group where a key vault is created (to create resources and assign roles)
  * Microsoft Entra ID User Administrator role (or equivalent) if you create security groups for managing permissions
  
  An Azure Global Administrator role is not required, but you should be able to obtain a Microsoft Entra ID access token for Azure Arc registration (explained in [Step 3: Set up the Oracle identity connector](#step-3-set-up-the-oracle-identity-connector) in this article).

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

    Ensure that the key vault's region matches the region where Oracle Exadata Database@Azure is deployed (for performance and compliance). You can choose the Standard or Premium tier, because both support integration. Premium is HSM-backed.

    If you require a dedicated HSM cluster, use Managed HSM. In that case, the creation command is different, as shown in the quickstart. We strongly recommend that you use a private endpoint for secure access and enhanced access control.

2. Create at least one key in the vault. Oracle TDE requires an MEK to be present in the vault. Oracle supports RSA keys for this purpose (2048-bit is typical).

    Alternatively, you can import a key if you have specific requirements. This option is called *bring your own key* (BYOK). But for most cases, generating a new RSA key in Azure is simplest. Make sure that the key is enabled, and note the key name. Oracle later refers to this key by its Azure name when you link the database.

    > [!TIP]
    > Why create the key now? During vault registration, the Oracle control plane checks that at least one key exists in the vault. If none is found, the vault registration fails. Creating a key up front avoids that problem.

3. (Managed HSM only:) If you chose Managed HSM, after provisioning, you must activate the HSM and create a key in it:

   ```az keyvault key create --hsm-name <HSM_Name> -n $KEY_NAME ...```

   Managed HSM uses a different permission model: local HSM roles. You assign roles in the next step.

At this point, you have a key vault (or HSM) ready, with a master key that's is used for Oracle TDE. The next step is to set up permissions so that the Oracle Exadata VM cluster can access this vault and key securely.

## Step 2: Configure Microsoft Entra ID permissions for key vault access

Allow the Oracle Exadata VM cluster (specifically, the Azure Arc identity of its VMs) to access the key vault and perform key operations without overprivileging. These operations include unwrapping keys and creating new key versions for rotation. You can provide this access by using Microsoft Entra ID role-based access control (RBAC). The general approach is as follows:

1. Create a security group in Microsoft Entra ID.
1. After the Oracle VM cluster is Azure Arc-enabled (as described in [Step 3: Set up the Oracle identity connector](#step-3-set-up-the-oracle-identity-connector) in this article), add the machine's managed identity to this group.
1. Assign Azure Key Vault roles to the group.

This way, if you have multiple database VMs or clusters, you can manage their access via group membership and roles.

To configure Microsoft Entra ID permissions:

1. Create a Microsoft Entra ID security group. This step is optional, but we recommend it. You can create a group by using the Azure portal (**Microsoft Entra ID** pane > **Groups** > **New Group**) or the Azure CLI.

    Make note of the `$GROUP_OBJECT_ID` value. This group remains empty for now. You add members in [Step 3: Set up the Oracle identity connector](#step-3-set-up-the-oracle-identity-connector), after the Azure Arc connector is set up. You create the identities that need access during that process.

2. Assign two roles to the security principal (the group, in this case) for the key vault:

    * **Key Vault crypto officer**: Allows managing keys (create, delete, and list key versions) and performing cryptographic operations (for example, unwrap and decrypt).
    * **Key Vault reader**: Allows viewing the properties of a key vault.

3. By using the Azure CLI, assign these roles on the key vault scope.

   > [!NOTE]
   > If you prefer to use Azure Key Vault access policies instead of RBAC, use `az keyvault set-policy` to allow a Microsoft Entra ID principal to perform `nwrap key` and `et key` operations. However, the RBAC method is the modern approach and aligns with Oracle's documented roles.

4. (Managed HSM only:) Azure RBAC uses a different set of roles. According to Oracle's guidance, for Managed HSM, you should assign the Azure RBAC Reader role for the HSM resource. Then, use the HSM's local RBAC to assign the Managed HSM Crypto Officer and Managed HSM Crypto User roles to your principal.

    You can make these assignments on the Azure portal's **Managed HSM access control** page. You can also use the security group for these assignments.

    Ensure that the principal is added as a Managed HSM Crypto Officer at minimum. A Crypto Officer can generate new key versions for rotation. A Crypto User can use the keys.

## Step 3: Set Up the Oracle identity connector

Setting up the Oracle identity connector automatically configures the Azure Arc agent to allow communication with Azure services (in this case, Azure Key Vault) by using an Azure identity.

When you create an identity connector via the OCI console, each VM in the cluster is registered as an Azure Arc-enabled server in your Azure subscription. This registration grants the VMs a managed identity in Microsoft Entra ID. The managed identity is applied for access to the key vault.

Here's how to create the connector:

1. The OCI console asks for an Azure access token to authorize the Azure Arc installation. Obtain this token by using an Azure account that has permissions to register Azure Arc machines in the specified subscription or resource group. Usually an Owner or Contributor on the resource group is sufficient.

    To obtain the access token by using the Azure CLI, make sure that you're signed in as an appropriate user. Then save the `AZURE_TOKEN` output, which is a long JSON web token string. Also note your Azure tenant ID (the `TENANT_ID` value, which is a GUID), because the OCI console requires it. The subscription ID is automatically detected from the Exadata VM cluster info, but take note just in case.

    > [!TIP]
    > The access token is sensitive and valid for a limited time. Treat it like a password. It's used only once to establish the connection.

2. Create an identity connector on the OCI console:

    1. Sign in to the OCI console for Oracle Database@Azure.

    1. Go to your Exadata VM cluster resource. On the menu, select **Oracle Database** > **Oracle Exadata Database Service on Dedicated Infrastructure** > **Exadata VM Clusters**, and then select your cluster name.

    1. On the page for VM cluster details, find the **Multicloud information** section. The **Identity connector** value is likely **None** because you haven't set up the connector yet. Select **Create**.

       :::image type="content" source="media/oracle-create-identity-connector.png" alt-text="Screenshot that shows the button for creating an identity connector.":::

    1. In the form that appears, the fields for connector name, Exadata VM cluster, Azure subscription ID, and Azure resource group name are autofilled. These values come from when the Exadata was provisioned. Oracle knows the Azure subscription and resource group that you used.

    1. Enter the Azure tenant ID. Copy it from the `TENANT_ID` value that you noted earlier.

    1. Enter the access token, which is the `AZURE_TOKEN` string that you obtained earlier.

        :::image type="content" source="media/oracle-identity-connector-info.png" alt-text="Screenshot that shows where to find identity connector information.":::

    1. Under **Advanced options**, if you intend to use private connectivity for Azure Arc:

        * Enter the Private Link scope name that you created in the Azure portal when you set up Private Link for Azure Arc. For example, enter the resource name of type `Microsoft.HybridCompute/privateLinkScopes`.
        * Make sure that any required DNS or networking for Private Link is in place, according to Microsoft requirements. If you're using the simpler network address translation (NAT) approach, you can leave this box blank.

        :::image type="content" source="media/oracle-identity-connector-info-advanced-options.png" alt-text="Screenshot that shows where to find advanced options for identity connector information.":::

    1. Select **Create** to create the identity connector.

    The Oracle platform uses the token to register the Azure Arc agent:

    * The Oracle platform installs the Azure Arc agent on each database VM in the cluster.
    * The VMs are registered in Azure Arc. In the Azure portal, two new Azure Arc resources should soon appear, if there are two database nodes in Oracle Real Application Clusters (RAC). These resources appear under the specified resource group in **Azure Arc** > **Servers**. Each has a name like the VM's name.
    * Oracle's console shows the identity connector status. Go to **Database Multicloud Integrations** > **Identity Connectors** to verify that the connector exists. On the **VM Cluster** page, the **Identity connector** field should now show the connector name instead of **None**.

    > [!TIP]
    > If the connector creation fails, double-check the token and tenant ID. If the token expired, generate a fresh one. Also verify that the displayed Azure subscription ID and resource group are correct.
    >
    > The user who generates the token must have rights to create Azure Arc resources. Azure automatically creates a service principal for the Azure Arc agent. Make sure that the Azure resource provider `Microsoft.HybridCompute` is registered in your subscription.

3. After you create the connector, each of your Exadata VMs has a managed identity in Microsoft Entra ID. You need to grant these identities (set up in [Step 2: Configure Microsoft Entra ID permissions for key vault access](#step-2-configure-microsoft-entra-id-permissions-for-key-vault-access)) access to the key vault. If you used a security group:

    1. Find the object IDs of the new Azure Arc server identities. In the Azure portal, go to **Microsoft Entra ID** > **Entities** > **Enterprise applications** or the Azure Arc resource. The principal object ID might be listed.

       An easier way is to use the Azure CLI to list Azure Arc-connected machines and get their principal IDs. Each Azure Arc machine has an identity with a `principalId` value. Alternatively, you should see JSON with a `principalId` value (object ID) for the system-assigned identity.

    1. Add each Azure Arc machine's `principalId` value as a member of the Microsoft Entra ID group that you created earlier. You can use the Azure portal (**Microsoft Entra ID** > **Group** > **Members** > **Add**) or the Azure CLI.

       If you didn't use a group, you can instead assign the Azure Key Vault roles directly to each `principalId` value of the VM's managed identity by using `az role assignment create`. Use an `assignee-principal-type` value of `ServicePrincipal` and the `principalId` value. Using a group is cleaner for multiple nodes.

At this point, the Oracle VM cluster is Azure Arc-enabled. Its Azure identity now has permissions on the key vault via group membership or direct assignment. The "plumbing" is in place: the database VMs can reach Azure Key Vault service endpoints through NAT or Private Link. The database VMs have credentials (a managed identity) that Azure recognizes and authorizes for key access.

## Step 4: Enable Azure Key Vault key management on the VM cluster

Activate the Azure Key Vault integration at the Exadata VM cluster level. This step installs the required Oracle library on the cluster VMs so that databases can use Azure Key Vault as a key store.

On the OCI console:

1. Go to the Exadata VM cluster details page where you created the connector.

1. In the **Multicloud information** section, find the **Azure key store** or **Azure key management** status. It should currently say **Disabled**.

1. Select **Enable**.

   :::image type="content" source="media/oracle-enable-azure-key-management.png" alt-text="Screenshot that shows where to enable Azure key management on the OCI console.":::

1. In the dialog that appears, confirm the action by selecting **Enable**.

This action triggers installation of an Oracle software library on the cluster VMs. This library is likely an extension to Oracle's TDE wallet software that knows how to interact with Azure Key Vault. It takes only a minute or two. After the installation finishes, the OCI console shows **Azure key store: Enabled** on the VM cluster.

Now the cluster is configured to support Azure Key Vault. Importantly:

* This setting is cluster-wide, but it doesn't automatically switch any database to use Azure Key Vault. It makes the option available. Databases on this cluster can use either the traditional Oracle Wallet or Azure Key Vault, side by side. For example, you might enable Azure Key Vault and then migrate one database at a time.
* If you need to disable the setting, you could select **Disable**, which uninstalls the library. However, don't select **Disable** if you have databases actively using Azure Key Vault. If you do, the databases will lose access to their keys, and you'll have to re-enable the setting to get them functioning again.

At this stage, you've completed the core setup. The Azure side is ready, and the Oracle side (cluster) is ready. The remaining steps involve connecting an Oracle database to the Azure Key Vault key.

## Step 5: Register the key vault in OCI (optional, as needed)

Inform Oracle's system about the existence of your key vault and prepare it for use. In many cases, this process happens automatically when you create or switch a database's key store. But knowing how to do it explicitly can be useful, especially if you plan to use the same vault across multiple clusters.

Oracle allows you to register Azure key vaults in the OCI console:

1. Go to **Database Multicloud Integrations** > **Microsoft Azure Integration**.

1. Select **Azure Key Vaults** > **Register Azure key vaults**.

   :::image type="content" source="media/oracle-register-azure-key-vault.png" alt-text="Screenshot that shows where to register Azure key vaults on the OCI console.":::

1. In the dialog:

   * Select the **Compartment** value, which is the compartment that contains your Exadata VM cluster.
   * Select the identity connector to use for discovery. Choose the connector that you created in [Step 3: Set up the Oracle identity connector](#step-3-set-up-the-oracle-identity-connector).
   * Select **Discover**. The system uses the Azure Arc connector to query Azure. It should list any key vaults in the subscription or resource group that the connector can access. The vault that you created in [Step 1: Create and prepare a key vault](#step-1-create-and-prepare-a-key-vault) should appear, identified by its name.
   * Select the vault from the list, and then select **Register**.

After registration:

* The vault is listed in OCI with a status, likely **Available**. Details include the type, such as key vault, Managed HSM, or Azure resource group.

* A default association is automatically created between this vault and the identity connector that you used for discovery. You can view this association by selecting the vault name and selecting the **Identity connector associations** tab.

* If you have multiple Exadata VM clusters with various connectors that need to use the same key vault, you have to manually create more associations. Select **Create association**, and then link the vault to another identity connector.

  This scenario is advanced. For example, a primary cluster and a standby cluster in different regions use one centralized vault. Ensure that network connectivity is appropriate.

Now Oracle OCI knows about your key vault and has it associated with the cluster's connector. The path is clear for a database to use the vault.

## Step 6: Configure an Oracle database to use Azure Key Vault

You need to configure one or more Oracle databases on the Exadata VM cluster to use Azure Key Vault for TDE key storage. You can do this task during database creation or by migrating an existing database from using the Oracle Wallet to using Azure Key Vault.

### Scenario A: Create a new database by using Azure Key Vault

When you're provisioning a new Oracle database on the Exadata VM cluster via the OCI console:

1. Start the **Create Database** wizard. This step assumes that you already have at least one Oracle Home on the cluster to house the database.

1. The form has an option for **Key Management** or **Encryption**. In the dropdown list, select **Azure Key Vault** instead of **Oracle-managed Wallet**.

1. Select the compartment where the vault was registered.

1. Select the vault name.

1. Select the key. The key that you created in [Step 1: Create and prepare a key vault](#step-1-create-and-prepare-a-key-vault) should appear by name.

1. Proceed with other database creation parameters; for example, database name, pluggable database (PDB) name, and character set. Then select **Submit**.

The provisioning process fetches the chosen key from Azure Key Vault and sets up TDE for the new database by using that key. When the database creation is complete, you can go to the database's detail page in OCI and scroll to the **Encryption** section. It should show **Key Management: Azure Key Vault** and display the key name (or its Azure identifier) and an OCI internal identifier for the key. This information confirms that the new database's TDE master encryption key is stored in Azure Key Vault and not in a local wallet.

### Scenario B: Migrate an existing database to Azure Key Vault

For an Oracle database that's already running on the VM cluster that currently uses the default Oracle Wallet for TDE keys, you can switch it to use Azure Key Vault.

To switch by using the OCI console:

1. In the VM cluster's list of databases, go to the page for the specific database resource.

1. On the **Database information** tab, find the **Encryption** section. The value for **Key management** should be **Oracle Wallet** if you haven't changed it yet.

1. Select **Change**.

   :::image type="content" source="media/oracle-change-key-management.png" alt-text="Screenshot that shows where to change key management on the OCI console."lightbox="media/oracle-change-key-management.png":::

1. In the dialog that appears for changing key management, provide the following information:

   * For **New Key Management**, select **Azure Key Vault**.
   * Select a vault compartment, and then select the vault.
   * Select a key compartment, which is likely the same as the vault's. Then select the key from the dropdown list.

1. Select **Save changes** or **OK** to confirm.

Oracle performs the key migration:

1. Oracle associates the selected Azure Key Vault key with the database.
1. In the background, the database retrieves the Azure key by using the Azure Arc connector and the permissions that you set up.
1. The database re-encrypts its TDE wallet. Essentially, the database takes the current TDE master key, which was in the wallet, and securely transfers it into Azure Key Vault. Or, if you selected a new key, the database sets it as the new master key and uses it to re-encrypt the data encryption keys.

This operation usually takes a few seconds. It doesn't require the database to be shut down. TDE master key operations can be done online. However, during the switch, new encrypt/decrypt operations might be paused briefly.

When the operation finishes, refresh the **Database** page. Verify that **Key management** now shows **Azure Key Vault** and lists the key name and Oracle Cloud Identifier (OCID), as with a newly created database.

### Important considerations

* Switching back from Azure Key Vault to Oracle Wallet is not supported via the OCI console or the API. Oracle treats the move to an external key management service (KMS) as one-way, though technically you could manually export the key and re-import it to a wallet if necessary. The console explicitly does not allow changing from Azure Key Vault back to a local wallet.

* If your container database (CDB) contains multiple PDBs with TDE enabled, they use the CDB's master key by default. In Oracle 19c, there's a single TDE master key per CDB. Starting with Oracle 21c, per-PDB keys are supported. However, you typically need to perform key management only at the CDB level, because all PDBs inherit the setting.

  If you happen to use separate keys for individual PDBs, you need to repeat the key management process for each PDB resource. Oracle's interface lists per-PDB keys, if applicable.

## Step 7: Verify the integration and security

Your Oracle database is now configured to use Azure Key Vault for all encryption operations. Now, verify that everything is functioning and secure:

* **Database status**: Connect to the Oracle database and ensure that you can read and write encrypted data. Typically, if TDE is configured correctly, this process is transparent to the user. However, if the database can't access the key, you get errors when you try to open the database. For example, error ORA-28374, "protected by master key not found" (or similar) appears. If you followed the preceding steps, the database should open via the Azure Key Vault key seamlessly.

* **OCI console confirmation**: Confirm that the database's detail page in OCI shows Azure Key Vault as the key store, and that it lists the key name/OCID. This information indicates that Oracle's control plane knows that the database is tied to the external key.

* **Azure Key Vault monitoring**: In Azure, go to your key vault:

  * Under **Keys**, you should see the key; for example, **OracleTDEMasterKey**. There might not be visible changes just from association, but you can check the Azure Key Vault logs.
  
    Enable Azure Key Vault diagnostic logging if you haven't already, and check for a **Get Key** or **Decrypt/Unwrap Key** event that corresponds to when the database was opened or the key was set. This action confirms that the Oracle database accessed the key in Azure.

    Azure logs show the principal that accessed the key. It should be the Azure Arc machine's managed identity, identifiable by a GUID. The GUID should match the Azure Arc `principalId` value.
  * If you perform a rotation in the next task, a new key version appears in this list.

* **Key deletion**: This point is worth reiterating: *never delete the Azure Key Vault key that your database is using*. If you delete the key in Azure, the database immediately loses the ability to decrypt its data, essentially bricking the database.

  On the OCI console, Oracle shows a warning if you look at the key info. If you must stop using a key, the proper procedure is to migrate the database to a new key (rotate it) before deleting the old one.
  
  Azure Key Vault supports key versioning. Old versions can be left disabled rather than deleted until you no longer need them.

* **Test failover/restart**: If this setup is for production, simulate a database restart to ensure that the database can retrieve the key on startup. Shut down and then start the Oracle database. (Or restart the VM cluster if necessary. In RAC, bounce one node at a time.) The database should start without manual intervention, pulling the key from Azure Key Vault in the process.

  If the database starts correctly, the integration is solid. If it fails to open the wallet automatically, recheck [Step 2: Configure Microsoft Entra ID permissions for key vault access](#step-2-configure-microsoft-entra-id-permissions-for-key-vault-access) and [Step 3: Set up the Oracle identity connector](#step-3-set-up-the-oracle-identity-connector).

By completing these verifications, you can be confident that the Oracle Exadata Database@Azure integration with Azure Key Vault is working and that your data remains accessible and secure.

## Ongoing management

With the integration in place, consider the following items for ongoing operations.

### Key rotation

Rotate the TDE master key periodically, in accordance with your security policy. For example, rotate the master key annually or after some days or events. Always perform rotations from the Oracle side (OCI console or API), not directly in Azure.

To rotate the master key via the OCI console:

1. Go to the **Database details** page.

1. In the **Encryption** section, select **Rotate**. This button appears next to the key info if Azure Key Vault is in use.

   :::image type="content" source="media/oracle-rotate-key.png" alt-text="Screenshot that shows where to rotate Azure key vaults on the OCI console.":::

1. Verify that a new version appears under the key in Azure Key Vault, and then update the database to use the new version.

You can also rotate the master key by using the OCI API or the OCI CLI:

* For the API, use `RotateVaultKey`.
* For the CLI, use a command like `oci db database rotate-vault-key --database-id <OCID>` to trigger the same operation. (Check Oracle's CLI documentation for the exact syntax.)

> [!IMPORTANT]
> Do not rotate the master key by using the Azure Key Vault key rotation policy or by manually creating a new version in Azure without Oracle's involvement. Azure would create a new version, but Oracle's database would be unaware and continue trying to use the old version because that's what it stored as the master key identifier. Always initiate a rotation from Oracle's side, which coordinates with Azure.

Keep a log of key rotations. Azure logs the creation of a new key version, and Oracle logs that a new key is in use. If any problem happens after rotation, you can roll back to the previous key version via Oracle. But you typically don't need that option unless you suspect that a new key is compromised.

### Key lifecycle management

Manage the lifecycle of the keys in Azure:

* **Retention**: Don't immediately delete old key versions. Oracle TDE can use only the latest version, but it might need older versions to open old backups or archive logs. It's wise to keep old key versions disabled but recoverable for a certain period.

* **Backup**: For Azure Key Vault (Standard or Premium), Microsoft manages high availability and disaster recovery (DR). For Managed HSM, you're responsible for backing up the HSM if necessary. Follow the Azure guidance for HSM backups.

* **Separation of duties**: Typically, a database admin handles the Oracle side, and a security admin handles the Azure Key Vault side. Use Azure Key Vault access policies and RBAC to ensure that:

  * Database admins can't tamper with keys beyond using them via the database.
  * Microsoft Entra ID admins can't directly read database data; they only manage keys.
  
  Regularly audit who has access to the key vault.

## Disaster recovery

* **Managed HSM**: Follow the [Managed HSM disaster recovery](/azure/key-vault/managed-hsm/disaster-recovery-guide?tabs=uami) guide. For increased availability, see [Enable multi-region replication on Azure Managed HSM](/azure/key-vault/managed-hsm/multi-region-replication).
* **Standard and Premium**: Automatic replication is enabled for paired regions. For more information, see [Azure Key Vault availability and redundancy](/azure/key-vault/general/disaster-recovery-guidance).

If you use Oracle Data Guard for DR between two Oracle Exadata Database@Azure VM clusters, use the following tasks to make sure that the DR site is configured similarly. (Cross-region Data Guard scenarios aren't currently supported.)

* Perform the procedures in [Step 1: Create and prepare a key vault](#step-1-create-and-prepare-a-key-vault) through [Step 5: Register the key vault in OCI](#step-5-register-the-key-vault-in-oci-optional-as-needed) on the DR Exadata VM cluster. You can use the same key vault in the DR region.

* If you're using the same key vault for both primary and standby, register the vault and create an association with the standby's identity connector, as noted earlier. Make sure that the standby database is also configured to use the Azure Key Vault key.

  Typically, when you add a standby to a primary that's using Azure Key Vault, Oracle expects the standby cluster to have an identity connector and key store enabled before creation of the standby. So set up the connector and enable the Azure key store for DR, and then set up Data Guard.
  
  The primary's key info is shared with the standby via Data Guard after you set up the standby, if the standby can reach the key vault. Oracle's documentation mentions this in passing: both primary and standby must be Azure Key Vault-enabled for TDE if either is, to avoid any gaps.

* Test a switchover or failover to ensure that the standby can open with the Azure Key Vault key independently. This is a crucial DR test.

### Patching and updates

Oracle handles updates to the Exadata infrastructure and the Azure Arc agent as part of the managed service. Monitor Oracle Cloud announcements for any changes to the Azure Key Vault integration feature. For example, look for new supported regions, changes in required roles, or changes in supported key types. If Oracle publishes an update that requires action, like updating the identity connector or library, schedule it accordingly.

## Troubleshooting common problems

* **Key vault not found during registration**: Ensure that you created at least one key and that the Azure Arc identity has list/get permissions. Also verify that you selected the correct connector and compartment during discovery.

* **Authorization errors**: If the database fails to retrieve the key (for example, you get ORA-28417, "authorization denied"), check Azure role assignments. The managed identity might not have the Crypto Officer or Crypto User role on the key. Fix the RBAC or access policy, and then retry. You might need to rerun the operation for changing key management.

* **Azure Arc connector problems**: If the Azure Arc-enabled servers appear as disconnected, the database might not reach Azure Key Vault. Check that the VM can reach `login.microsoftonline.com` and your Azure Key Vault endpoint. Use Curl or a similar tool from the VM to test connectivity and DNS. If you're using Private Link, verify that DNS resolution is pointing to the private endpoint's IP address. On the Oracle VM, you can also check the Azure Arc agent status (`sudo systemctl status azauremeeting` or a similar service).

* **Token expiration during connector setup**: The Azure token from [Step 3: Set up the Oracle identity connector](#step-3-set-up-the-oracle-identity-connector) is short-lived. If you generated it too early and didn't submit the form in time, it might expire. Always use a fresh token within a few minutes of use.

* **Multiple key vaults**: If you ever need to move a database to a different key vault (for example, you're migrating to a new vault), Oracle does not currently support directly changing from one external KMS to another via the console. Plan the architecture such that one vault can serve its purpose for the long term, with key versions handling rotation.

## Best practices

* **Production workloads**: For production Oracle Database@Azure environments, we strongly recommend Azure Key Vault Premium or Managed HSM. Azure Key Vault and the Exadata VM cluster should be in the same tenant and in the same resource group. This is a known issue, and we're working to fix it.

* **Performance and compliance**: Choose the appropriate tier based on your FIPS compliance needs, key type support, and security isolation requirements.

* **Private Link requirement**: For Managed HSM, Private Link integration is mandatory for secure access. We recommend Private Link connectivity for all Azure Key Vault and Oracle Database@Azure integrations.

* **Advanced Encryption Standard (AES) key support**: Oracle Database@Azure customers should use AES keys wherever possible. To manage TDE MEKs with AES format, you must use Managed HSM.

* **Monitoring and auditing**: Enable Azure diagnostic logs for monitoring key access and usage events across all tiers.

* **Dedicated vault**: Use a dedicated key vault or a dedicated key for each Oracle environment. Don't reuse the same key for different databases. Each CDB should have its own TDE master key. Oracle enforces this requirement. However, you can keep multiple keys in one vault (one per database).

Finally, remember that this integration bridges two cloud services. Ensure that your support contracts with Oracle and Microsoft are in place. For any problems, you have the benefit of joint support: the companies have a partnership to help customers who run this setup. For more troubleshooting information, you can reference support documentation from Oracle and Azure.

## Related content

* [Azure Key Vault Integration for Oracle Database@Azure](https://docs.oracle.com/en-us/iaas/Content/database-at-azure-exadata/odexa-managing-exadata-database-services-azure.html#GUID-F1EAD7CE-73E1-41B2-AA3A-21B7657A95E1) (Oracle documentation)
* [About Azure Key Vault](/azure/key-vault/general/overview)
* [What is Azure Key Vault Managed HSM?](/azure/key-vault/managed-hsm/overview)
