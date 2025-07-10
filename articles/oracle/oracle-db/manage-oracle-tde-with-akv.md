---
title: Manage Oracle TDE with Azure Key Vault
description:  Comprehensive step-by-step guide for integrating Oracle Exadata Database Service on Oracle Database@Azure with Azure Key Vault
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: how-to
ms.date: 04/15/2025
ms.custom: engagement-fy23
ms.author: jacobjaygbay

#customer intent: as an Oracle Database@Azure customer I want to manage my keys and secrets in Azure so that I will have centralized place for all my key management needs in a multi-cloud scenario
---

# Integrate OracleDatabase@Azure with Azure Key Vault
Exadata Database Service on Oracle Database@Azure now supports storing and managing Oracle Transparent Data Encryption (TDE) master encryption keys(MEK) using all three tiers of Azure Key Vault (AKV) services: 

* **AKV Standard**
* **AKV Premium**
* **AKV Managed HSM** 

This integration enables Oracle Database@Azure customers to meet a wide spectrum of **security**, **compliance**, and **key management** needs - ranging from software-based key storage to single-tenant, FIPS 140-3 Level 3 validated hardware security modules. 


Integrating **Oracle Database@Azure** (Exadata VM Cluster) with **Azure Key Vault** (AKV) allows you to store and manage Oracle Transparent Data Encryption (TDE) master encryption keys(MEK) in Azure’s secure vault, enhancing security and simplifying key lifecycle management.  

## Prerequisites 

Before beginning the integration, ensure the following prerequisites are met: 

* **Oracle Database@Azure Provisioned**: 
You have an **Exadata VM Cluster** deployed in Azure via Oracle Database@Azure. This includes a delegated subnet within an Azure Virtual Network for the Exadata VM Cluster. The cluster is up and running, and you have access to the Oracle Cloud Infrastructure (OCI) console for management. 
* **Advanced Networking Enabled**: If not already configured, complete the delegated subnet registration as per the [Network planning for Oracle Database@Azure | Microsoft Learn](/azure/oracle/oracle-db/oracle-database-network-plan) guide (This ensures the subnet supports Azure Arc and Private Link capabilities.) 
* **Azure Key Vault Private Connectivity**: Private Endpoint for Azure Key Vault has been configured and reachable by Exadata. DNS has also been configured, and endpoints can be resolved from Exadata. 
* **NAT Gateway**: NAT Gateway must be configured on the delegated subnet to complete the Identity Connector setup. 
* **Private Link Scope and Private Endpoint configuration for Azure Arc (optional)**: If using Private Link for the Azure Arc agent installation, the Azure Arc Private Link Scope and Private Endpoint must be configured and reachable from Exadata. DNS must also be configured and endpoints resolvable from Exadata. 
* **Azure Subscription & Permissions**: You have sufficient Azure permissions: 
    * Azure role **Owner/Contributor** on the subscription or resource group where Key Vault will be created (to create resources and assign roles). 
    * Azure Entra ID **User Administrator** (or equivalent) if you will create security groups for managing permissions. 
    * Azure **Global Administrator** is not required, but you should be able to obtain an Azure Entra ID access token for Arc registration  
* **OCI Privileges**: In OCI (Oracle Cloud Infrastructure console), ensure you have permission to manage the multicloud integration 

## Create and Prepare an Azure Key Vault 

Set up an Azure Key Vault to hold your Oracle database encryption keys. If you already have a suitable Key Vault and key, you can use it, but ensure it’s dedicated or appropriately secured for this purpose.


1. **Create an Azure Key Vault**: You can use the Azure Portal or Azure CLI.  
    * **AKV Standard**: Follow [Azure Key Vault CLI Quickstart](/azure/key-vault/general/quick-create-cli)
    * **AKV Premium**: Same as Standard but select **Premium SKU**
    * **Managed HSM**: Follow [Managed HSM Quickstart](/azure/key-vault/managed-hsm/quick-create-cli) 

    Ensure the Key Vault’s region matches the region where Oracle Exadata Database@Azure is deployed (for performance and compliance). You can choose Standard or Premium tier (both support integration). Premium is HSM-backed. If you require a dedicated HSM cluster, use Managed HSM (in that case the creation command is different, as shown commented above, and remember Managed HSM requires private networking). 

2. **Create a Key in the Vault**: Oracle TDE requires an encryption key (Master Encryption Key) to be present in the vault. Create at least one key now. Oracle supports RSA keys for this purpose (2048-bit is typical):

    Alternatively, you can import a key if you have specific requirements (BYOK), but for most cases generating a new RSA key in Azure is simplest. Make sure the key is enabled and note the key name. (Oracle will later refer to this key by its Azure name when we link the database.) 

    **Why create the key now?** During vault registration, Oracle’s process checks that at least one key exists in the vault; if none is found, the vault registration will fail. Creating a key upfront avoids that issue. 

3. **(For Managed HSM)**: If you chose Managed HSM, after provisioning, you must activate the HSM (if not already) and create a key in it similarly (az keyvault key create --hsm-name <HSM_Name> -n $KEY_NAME ...). Also, note that Managed HSM uses a different permission model (local HSM roles). We’ll cover the role assignments in the next step. 

    At this point, you have an Azure Key Vault (or HSM) ready, with a master key that will be used for Oracle TDE. Next, we need to set up permissions so that the Oracle Exadata VM cluster can access this vault and key securely. 

## Configure Azure Entra ID Permissions for Key Vault Access 

 Allow the Oracle Exadata VM Cluster (specifically, the Azure Arc identity of its VMs) to access the Key Vault and perform key operations (like unwrap keys, create new key versions for rotation, etc.), without over-privileging. We will achieve this via Azure Entra ID Role-Based Access Control (RBAC). The general approach is: 

* Create a security group in Azure Entra ID. 
* After the Oracle VM Cluster is Arc-enabled (next step), add the machine’s managed identity to this group. 
* Assign Key Vault roles to the group. 

This way, if you have multiple database VMs or clusters, you can manage their access via group membership and roles. 

1. **Create an Azure Entra ID Security Group** (optional but recommended):  
    * You can create a group via Azure Portal (Azure Entra ID blade > Groups > New Group) or CLI: 

    Make note of the $GROUP_OBJECT_ID. This group will remain empty for now; we will add members after the Arc connector is set up (because the identities that need access will be created during that process). 
2. **Assign Azure Key Vault Roles**: We will assign two roles to the security principal (the group, in this case) for the Key Vault: 
    * **Key Vault Crypto Officer** – Allows management of keys (create, delete, list key versions) and performing cryptographic operations (unwrap/decrypt, etc.). 
    * **Key Vault Reader** – Allows viewing Key Vault properties 
3. Using Azure CLI, assign these roles on the Key Vault scope: 

> [!NOTE]
> If you prefer to use Key Vault access policies instead of RBAC, you could use az keyvault set-policy to allow an Entra ID principal to perform “unwrap key” and “get key” operations. However, the RBAC method shown is the modern approach and aligns with Oracle’s documented roles.

4. For **Managed HSM**:
    * Azure RBAC uses a different set of roles. According to Oracle’s guidance, for Managed HSM you should assign the Azure RBAC Reader role (for the HSM resource) and then use the HSM local RBAC to assign "Managed HSM Crypto Officer" and “Managed HSM Crypto User” to your principal. This can be done in the Azure portal’s Managed HSM access control page. The security group can also be used for these assignments. Ensure that the principal has been added as an HSM Crypto Officer at minimum (Crypto Officer can generate new key versions for rotation, and Crypto User can use the keys). 

5. **Double-check roles**: After assignments, you can verify: 
    This should list the roles assigned to the group for the vault. There’s no harm in completing this role assignment step now; if the group has no members yet, the permissions will simply not be used until a member is added. 

    At this stage, Azure is configured: you have a vault with a key, and an Azure Entra ID group with appropriate access to that vault. Now we move to the Oracle side to set up the integration. 

## Set Up the Oracle Identity Connector 
 Set up the Oracle Identity Connector. This will automatically configure the Azure Arc Agent to allow communication with Azure services (Key Vault) using an Azure identity.  

When you create an Identity Connector via the OCI console, each VM in the cluster is registered as an Azure Arc-enabled server in your Azure subscription. This grants the VMs an identity in Azure Entra ID (a managed identity) which we will leverage for Key Vault access. 

Here’s how to create the connector: 

1. **Obtain an Azure Access Token**: The OCI console will ask for an Azure access token to authorize the Arc installation. This token should be obtained using an Azure account that has permissions to register Azure Arc machines in the specified subscription/resource group. Usually an Owner/Contributor on the resource group is sufficient. 

    Using Azure CLI (logged in as an appropriate user): 

    Save the AZURE_TOKEN output (it’s a long JSON web token string). Also note your Azure Tenant ID (GUID) – OCI console requires it. The Subscription ID will be auto-detected from the Exadata VM cluster info, but take note just in case. 

    *Security tip*: The access token is sensitive and valid for a limited time. Treat it like a password. It’s used only once to establish the connection. 

2. Create Identity Connector in OCI Console: 

    * Log in to the OCI Console for Oracle Database@Azure. Navigate to your Exadata VM Cluster resource. (Menu: Oracle Database > Oracle Exadata Database Service on Dedicated Infrastructure > Exadata VM Clusters > click your cluster name.) 
    * On the VM Cluster details page, find the “Multicloud Information” section. You should see an Identity Connector field (likely showing “None” if not set up yet) 

        Click Create (or Setup Connector). A form appears. 

    :::image type="content" source="media/oracle-create-identity-connector.png" alt-text="Screenshot that shows where to select create for identity connector":::  

    * The connector Name, Exadata VM cluster, Azure subscription ID, and Azure resource group name fields will auto-fill (these come from when the Exadata was provisioned – Oracle knows the Azure subscription and Resource Group you used). 
    * Enter the Azure Tenant ID (copy from the TENANT_ID value above). 
    * Enter the Access Token (the AZURE_TOKEN string you obtained).

    :::image type="content" source="media/oracle-identity-connector-info.png" alt-text="Screenshot that shows where to find identity connector information"::: 

    * Under “Advanced Options”, if you intend to use Private Connectivity for Arc: 
        * Enter the Azure Arc Private Link Scope name you created (from Azure portal when setting up private link for Arc; e.g., the resource name of type *Microsoft.HybridCompute/privateLinkScopes*). 
        * Ensure any required DNS or networking for private link is in place as per Microsoft’s docs. (If you are using the simpler NAT approach, you can leave this blank.) 

        :::image type="content" source="media/oracle-identity-connector-info-adv-options.png" alt-text="Screenshot that shows where to find advanced options for identity connector information"::: 
    * Click Create to create the identity connector. 
   
    The Oracle platform will now use the token to register the Arc agent: 
    * It will install the Azure Arc agent on each database VM in the cluster. 
    * The VMs will register in Azure Arc. In your Azure Portal, you should soon see two new Azure Arc resources (if two DB nodes in RAC) under the specified Resource Group, in *Azure Arc > Servers*. Each will have a name like the VM’s name. 
    * Oracle’s console will show the Identity Connector status. Navigate to *Database Multicloud Integrations > Identity Connectors* to verify the connector exists. On the VM Cluster page, the Identity Connector field should now show the connector name (instead of “None”) 

    ### Troubleshooting tip 
    If the connector creation fails, double-check the token (it might have expired – generate a fresh one) and Tenant ID. Also verify that the Azure subscription ID and resource group displayed are correct. The user generating the token must have rights to create Arc resources (Azure will automatically create a service principal for the Arc agent; ensure the Azure resource provider Microsoft.HybridCompute is registered in your subscription). 

3. **Add Arc Machine Identities to Azure Entra ID Group**: Once the connector is up, your Exadata VM(s) now each have a managed identity in Azure Entra ID. We need to grant these identities the Key Vault access. If you used a security group: 
    * Find the object IDs of the new Arc server identities. In Azure Portal, go to the Azure Entra ID blade > Entities > Enterprise applications or the Azure Arc resource – the principal Object ID might be listed. An easier way: use Azure CLI to list Azure Arc connected machines and get their principal IDs: 

    Each Arc machine will have an identity with a principalId. Alternatively: 

    You should see a JSON with a principalId (object ID) for the system-assigned identity. 

    * Add each Arc machine’s principalId as a member of the Azure Entra ID group created in earlier. You can do this in Azure Entra ID portal (Group > Members > Add), or CLI: 

    If you did not use a group, you can instead assign the Key Vault roles directly to each principalId of the VM’s managed identity (using az role assignment create similar to above, but with assignee-principal-type **ServicePrincipal** and the principalId). Using a group is cleaner for multiple nodes. 

    At this point, the Oracle VM cluster is Arc-enabled and its Azure identity now has permissions on the Key Vault (via group membership or direct assignment). The “plumbing” is in place: the database VMs can reach Azure Key Vault service endpoints (through NAT or private link), and they have credentials (managed identity) that Azure will recognize and authorize for key access. 

## Enable Azure Key Vault Key Management on the VM Cluster 

 Activate the Key Vault integration at the Exadata VM Cluster level. This installs the required Oracle library/plugin on the cluster VMs that allows databases to use Azure Key Vault as a keystore. 

In the OCI console: 

* Go to the Exadata VM Cluster details page (where you created the connector). 
* In the Multicloud Information section, find Azure key store (or Azure Key Management) status. It should currently say “Disabled”. 
* Click Enable next to Azure key store. 
* Confirm the action in the dialog that appears (click Enable). 

:::image type="content" source="media/oracle-enable-azure-key-management.png" alt-text="Screenshot that shows where to Enable Azure key management in the OCI console "::: 


This action triggers installation of an Oracle software library on the cluster VMs (this is likely an extension to Oracle’s TDE wallet software that knows how to interface with Azure Key Vault). It only takes a minute or two. Once done, the OCI console will show Azure key store: Enabled on the VM Cluster. 

Now, the cluster is configured to support Azure Key Vault. Importantly: 

* This setting is cluster-wide, but it does not automatically switch any database to use AKV. It simply makes the option available. Databases on this cluster can either use the traditional Oracle Wallet or Azure Key Vault, side by side. (For example, you might enable AKV and then migrate one database at a time.)  
* If for some reason you needed to disable it, you could click “Disable” (which would uninstall the library). However, do not disable if you have databases actively using AKV, as they would lose access to their keys (you’d have to re-enable to get them functioning again). 

At this stage, you’ve completed the core setup: Azure side is ready and Oracle side (cluster) is ready. The remaining steps involve connecting an actual Oracle database to the Key Vault key. 

##  Register the Azure Key Vault in OCI (Optional/As Needed) 

 Inform Oracle’s system about the existence of your Azure Key Vault and prepare it for use. In many cases, this is done automatically when you create or switch a database’s key store, but it’s useful to know how to do it explicitly, especially if you plan to use the same vault across multiple clusters. 

Oracle allows you to register Azure Key Vaults in the OCI console:

* Navigate to *Database Multicloud Integrations* > **Microsoft Azure Integration**. 

* Click on Azure Key Vaults

:::image type="content" source="media/oracle-register-akv.png" alt-text="Screenshot that shows where to Register Azure kay vaults in the OCI console"::: 

* Click Register Azure key vaults. In the dialog: 
    * Choose the Compartment (the compartment where your Exadata VM Cluster is). 
    * Select the Identity Connector to use for discovery (choose the connector you created in previously) 
    * Click Discover. The system will use the Arc connector to query Azure and should list any Key Vaults in the subscription/resource group accessible by that connector. Your vault created in earlier should appear, identified by its name. 
    * Select the vault from the list, then click Register.

After registration: 

* The vault will be listed in OCI with a status (likely “Available”) and details like type (AKV or Managed HSM), Azure resource group, etc. 
* A default association is automatically created between this vault and the Identity Connector you used for discovery. (You can view this by clicking the vault name and checking the “Identity connector associations” tab.) 
* If you had multiple Exadata VM clusters (with different connectors) that need to use the same Key Vault, you would have to manually create additional associations: click Create association, and link the vault to another Identity Connector. This scenario is advanced (e.g., a primary and standby cluster in different regions both using one centralized vault – ensure network connectivity is appropriate). 

Now Oracle OCI knows about your Azure Key Vault and has it associated with the cluster’s connector, meaning the path is clear for a database to use it. 

## Configure an Oracle Database to Use Azure Key Vault 

Finally, you need to configure one or more Oracle databases on the Exadata VM Cluster to use the Azure Key Vault for TDE key storage. You can do this either during database creation (for new databases) or by migrating an existing database from using the Oracle wallet to Azure Key Vault. 

### Scenario A: Create a new database with Azure Key Vault

When provisioning a new Oracle database on the Exadata VM Cluster (via OCI console): 
* Start the “Create Database” wizard (this assumes you already have at least one Database Home on the cluster to house the database).
* You’ll see an option for Key Management or Encryption in the form. Choose Azure Key Vault from the drop-down (instead of Oracle-managed Wallet). 
* You will then select the Vault and Key: 
    * Select the compartment (where the vault was registered). 
    * Select the Vault name. 
    * Select the Key (the key you created should appear by name). 
* Proceed with other database creation parameters (DB name, PDB name, character set, etc.) and submit. 

The provisioning process will fetch the chosen key from Azure Key Vault and set up TDE for the new database using that key. When the database creation is complete, you can go to the Database’s detail page in OCI and scroll to the  Encryption  section. It should show Key Management: Azure Key Vault, and display the Key name or its Azure identifier (and an OCI internal identifier for the key). This confirms the new database’s TDE master encryption key is stored in Azure Key Vault (and not in a local wallet). 

### Scenario B: Migrate an existing database to Azure Key Vault 

For an Oracle database already running on the VM Cluster that currently uses the default Oracle Wallet for TDE keys, you can switch it to use Azure Key Vault.

Using the OCI Console: 
* Navigate to the specific Database resource page (under the VM Cluster’s list of databases). 
* On the Database Information tab, find the Encryption / Key Management section. It should show that it’s currently using Oracle Wallet (if it hasn’t been changed yet). 
* Click the Change link next to the Key Management field 


:::image type="content" source="media/oracle-change-key-management.png" alt-text="Screenshot that shows where to change key management in the OCI console"::: 

* A dialog or form will appear to Change key management. Provide: 
    * New Key Management: select **Azure Key Vault**.
    * Vault Compartment, then select the Vault. 
    * Key Compartment (likely the same as vault’s), then select the Key from the drop-down list. 
* Click Save changes (or OK) to confirm. 

Oracle will perform the key migration: 

* It will associate the selected Azure Key Vault key with the database. 
* In the background, the database will retrieve the Azure key (using the Arc connector and the permissions set up) and re-encrypt its TDE wallet. Essentially, it takes the current TDE master key (which was in the wallet) and securely transfers it into Azure Key Vault (or, if you selected a brand new key, it will set that as the new master key and re-encrypt the data encryption keys with it). 
* This operation is usually fast (a matter of seconds). It does not require the database to be shut down; TDE master key operations can be done online. However, during the switch, new encrypt/decrypt operations might be paused briefly. 

Once done, refresh the Database page and verify that Key Management now shows Azure Key Vault, and it lists the key name/OCID as with a newly created DB. 

### Important 
 *Switching back* from Azure Key Vault to Oracle Wallet is not supported via the OCI console or API. Oracle treats the move to an external KMS as one-way (though technically you could manually export the key and re-import to a wallet if absolutely necessary). The console explicitly does not allow changing from AKV back to local wallet.  

**Pluggable Databases (PDBs)**: If your CDB contains multiple PDBs with TDE enabled, they 	use the CDB’s master key by default. In Oracle 19c, there is a single TDE master key per 	CDB. Starting with Oracle 21c, per-PDB keys are supported. However, you typically only 	need to perform key management at the CDB level, as all PDBs inherit the setting. 

If you happen to use separate keys for individual PDBs, you would need to repeat the key 	management process for each PDB resource (Oracle’s interface will list per-PDB keys if 	applicable). 

 

Now your Oracle database is using the key in Azure Key Vault for all encryption operations. Next, let’s verify everything is working properly.

##  Verify the Integration and Security 

With the database configured to use Azure Key Vault, it’s critical to verify that everything is functioning and secure: 

* **Database Status**: Connect to the Oracle database and ensure you can read and write encrypted data. Typically, if TDE is configured correctly, this is transparent to the user. However, if the database cannot access the key, you would see errors when trying to open the database (e.g., ORA-28374, “protected by master key not found” or similar). Assuming the steps above were followed, the database should open using the AKV key seamlessly. 

* **OCI Console Confirmation**: On the Database’s detail page in OCI, confirm it shows Azure Key Vault as the key store and lists the Key Name/OCID. This indicates Oracle’s control plane knows the database is tied to that external key.

* **Azure Key Vault Monitoring**: In Azure, navigate to your Key Vault:
    * Under Keys, you should see the key (e.g., OracleTDEMasterKey). There may not be visible changes just from association, but you can check the Key Vault logs. Enable Azure Key Vault’s diagnostic logging if not already, and check for a “Get Key” or “Decrypt/Unwrap Key” event corresponding to when the database was opened or the key was set. This confirms the Oracle database accessed the key in Azure. Azure’s logging will show the principal that accessed the key – it should be the Azure Arc machine’s managed identity (identifiable by a GUID, which should match the Arc principalId). 
    * If you performed a rotation (in next step), you will see a new key version in this list. 
* **Do Not Delete Keys!** – This is worth reiterating: *Never delete the Key Vault key that your database is using*. If you delete the key in Azure, the database will immediately lose the ability to decrypt its data, essentially bricking the database. In OCI console, Oracle actually shows a warning if you look at the key info. If you absolutely must stop using a key, the proper procedure is to migrate the database to a new key (rotate it) before deleting the old one. Azure Key Vault supports key versioning; old versions can be left disabled rather than deleted until no longer needed. 

* **Test Failover/Restart**: If this is a production setup, simulate a database restart to ensure it can retrieve the key on startup. Simply shut down and start up the Oracle database (or reboot the VM Cluster if needed – though in RAC, bounce one node at a time). The database should start without manual intervention, pulling the key from AKV in the process. If it starts fine, the integration is solid. If it fails to open the wallet automatically, re-check permissions and Arc connectivity. 

By completing these verifications, you can be confident that the Oracle Exadata Database@Azure-Azure Key Vault integration is working and your data remains accessible and secure. 

## Ongoing Management and Best Practices 

With the integration in place, consider the following for ongoing operations: 

* **Key Rotation**: 

    Rotate the TDE master key periodically as per your security policy (e.g., annually or after a certain number of days or events). Always perform rotations from the Oracle side (OCI console or API), not directly in Azure. 
    * To rotate via OCI console: Go to the Database details page, Encryption section, and click Rotate (this appears next to the key info if Key Vault is in use) Confirm the rotation. This will generate a new key version in Azure Key Vault (you can verify a new version under the key in Azure) and update the database to use the new version.   
    
    :::image type="content" source="media/oracle-rotate-key.png" alt-text="Screenshot that shows where to rotate Azure kay vaults in the OCI console"::: 
    
    * Rotating via OCI API/CLI: Oracle provides the API RotateVaultKey for this purpose. Using oci CLI, this might be done through a command like oci db database rotate-vault-key --database-id &lt;OCID&gt;(check Oracle’s CLI docs for exact syntax). This triggers the same operation. 

    * **Do not** rotate by using the Azure Key Vault’s key rotation policy or manually creating a new version in Azure without Oracle’s involvement. Azure would create a new version, but Oracle’s database would be unaware and continue trying to use the old version (since that’s what it has stored as the master key identifier). Always initiate from Oracle’s side, which coordinates with Azure. 

    Keep a log of key rotations (Azure will log the new key version creation, and Oracle will log that a new key is in use). In case of any issue after rotation, you have the option to roll back to the previous key version via Oracle (though that typically isn’t needed unless a new key is suspected to be compromised).
*  **Key Lifecycle Management**: Manage the lifecycle of the keys in Azure: 
    * **Retention**: Do not immediately purge old key versions. Oracle TDE can only use one version (the latest), but older versions might be needed to open old backups or archive logs. It’s wise to keep old key versions disabled but recoverable for a certain period. 
    * **Backup**: For Azure Key Vault (Standard/Premium), Microsoft manages high availability and recovery. For Managed HSM, you are responsible for backing up the HSM if needed. Follow Azure’s guidance for HSM backups if applicable. 
    * **Separation of Duties**: Typically, DBAs handle Oracle side, and a security admin handles the Azure Key Vault side. Use Azure Key Vault access policies/RBAC to ensure DBAs cannot tamper with keys beyond using them via the database, and conversely Azure Entra ID admins cannot directly read database data – they only manage keys. Regularly audit who has access to the Key Vault. 
* **Disaster Recovery (DR)**:
    * **Managed HSM**: Follow [Managed HSM Disaster Recovery Guide](/azure/key-vault/managed-hsm/disaster-recovery-guide?tabs=uami). For increased availability, [Enable multi-region replication on Azure Managed HSM](/azure/key-vault/managed-hsm/multi-region-replication). 
    * **Standard & Premium**: Automatic replication enabled for paired regions. For more information, see [Azure Key Vault availability and redundancy](/azure/key-vault/general/disaster-recovery-guidance).

    If you use Oracle Data Guard for DR between two Oracle Exadata Database@Azure VM clusters (Cross-region Dataguard scenario is not supported currently), ensure the DR site is configured similarly: 

    *  Perform Steps 1-5 on the DR Exadata VM cluster as well (you can use the **same** Azure Key Vault in the DR region). 
    * If using the same Key Vault for both primary and standby, register the vault and create an association with the standby’s identity connector as noted earlier. 
    * Make sure the standby database is also configured to use the AKV key. Typically, when you add a standby to a primary that’s using AKV, Oracle expects the standby cluster to have an identity connector and key store enabled before creating the standby. So set up the connector and enable Azure key store on DR, then set up Data Guard. The primary’s key info will be shared to standby via Data Guard once standby is up, provided the standby can reach the Key Vault. (Oracle’s docs mention this in passing – both primary and standby must be AKV-enabled for TDE if either is, to avoid any gaps.) 
    * Test a switchover or failover to ensure the standby can open with the Key Vault key independently. This is a crucial DR test. 

* **Patching and Updates**:
    
     Oracle will handle updates to the Exadata infrastructure and the Arc agent as part of the managed service. Keep an eye on Oracle Cloud announcements for any changes to the Key Vault integration feature (for example, new supported regions, or changes in required roles or supported key types). If Oracle publishes an update requiring action (like updating the identity connector or library), schedule that accordingly. 

### Troubleshooting Common Issues 
* *Key Vault not found during registration*:  Ensure you created at least one key and that the Arc identity has list/get permissions. Also verify you selected the correct connector and compartment when discovering. 

* *Permission Denied errors*: If the database fails to retrieve the key (e.g., ORA-28417 “authorization denied”), check Azure role assignments. The managed identity might not have the Crypto Officer or Crypto User role on the key. Fix the RBAC or access policy, then retry (you might need to re-run the change key management operation). 
* *Arc connector issues*: If the Arc-enabled servers show as disconnected, the database may not reach Key Vault. Check that the VM can reach login.microsoftonline.com and your Key Vault endpoint (use curl or similar from the VM to test connectivity/DNS). If using Private Link, verify DNS resolution is pointing to the private endpoint’s IP. On the Oracle VM, you can also check the Arc agent status (sudo systemctl status azauremeeting or similar service). 
* *Token expiration during connector setup*: The Azure token is short-lived. If you generated it too early and didn’t submit the form in time, it may expire. Always use a fresh token (within a few minutes of use). 
* *Multiple Key Vaults*: If you ever need to move a database to a different Key Vault (for instance, migrating to a new vault), Oracle does not curreoracntly support directly changing from one external KMS to another via the console. Plan the architecture such that one vault can serve its purpose long-term, with key versions handling rotation. 

### Best Practices 
* **Production Workloads**: For production grade Oracle Database@Azure environments, AKV Premium or Managed HSM is strongly recommended. Azure Key Vault and Exadata VM Cluster should be in the same tenant as well as in the same resource group. This is a known issue, and we are working to fix it. 
* **Performance & Compliance**: Choose the appropriate tier based on your FIPS compliance needs, key type support, and security isolation requirements.

* **Private Link Requirement**: For Managed HSM, Private Link integration is mandatory for secure access. 
    Private Link connectivity is recommended for all Azure Key Vault and Oracle Database@Azure integrations.

* **AES Key Support**: Oracle Database@Azure customers are advised to use AES keys wherever possible. To manage TDE MEKs with AES format, you must use Managed HSM.

* **Monitoring and Auditing**: Enable Azure Diagnostic Logs for monitoring key access and usage events across all tiers. 

*  **Dedicated Vault**:    Use a dedicated Key Vault or a dedicated key for each Oracle environment. Do not reuse the same key for different databases – each CDB should have its own TDE master key (Oracle will enforce this anyway). You can keep multiple keys in one vault (one per DB), which is fine. 

Finally, remember that this integration bridges two cloud services – so ensure your support contracts with Oracle and Microsoft are in place. For any issues, you have the benefit of joint support: both companies have a partnership to help customers running this setup. Oracle’s support docs and Azure’s documentation can be referenced for troubleshooting known issues. 

## Related content

* Learn about [Azure Key Vault Integration for Oracle Database@Azure](https://docs.oracle.com/en-us/iaas/Content/database-at-azure-exadata/odexa-managing-exadata-database-services-azure.html#GUID-F1EAD7CE-73E1-41B2-AA3A-21B7657A95E1) 

* Learn about [Azure Key Vault Overview](/azure/key-vault/general/overview) 

* Learn about [Managed HSM Documentation](/azure/key-vault/managed-hsm/overview) 