---
title: Private Endpoints
description: Understand the process of creating private endpoints for Azure Backup and the scenarios where using private endpoints helps maintain the security of your resources. 
ms.topic: conceptual
ms.date: 05/07/2020
---

# Private Endpoints for Azure Backup

Azure Backup allows you to securely back up and restore your data from your Recovery Services vaults using [private endpoints](../private-link/private-endpoint-overview.md). Private endpoints use one or more private IP addresses from your VNet, effectively bringing the service into your VNet.

This article will help you understand the process of creating private endpoints for Azure Backup and the scenarios where using private endpoints helps maintain the security of your resources.

## Before you start

- Private endpoints can be created for new Recovery Services vaults only (that don't have any items registered to the vault). So private endpoints must be created before you attempt to protect any items to the vault.
- One virtual network can contain private endpoints for multiple Recovery Services vaults. Also, one Recovery Services vault can have private endpoints for it in multiple virtual networks. However, the maximum number of private endpoints that can be created for a vault is 12.
- Once a private endpoint is created for a vault, the vault will be locked down. It won't be accessible (for backups and restores) from networks apart from ones that contain a private endpoint for the vault. If all private endpoints for the vault are removed, the vault will be accessible from all networks.
- A private endpoint connection for Backup uses a total of 11 private IPs in your subnet, including those used by Azure Backup for storage. This number may be higher (up to 25) for certain Azure regions. So we suggest that you have enough private IPs available when you attempt to create private endpoints for Backup.
- While a Recovery Services vault is used by (both) Azure Backup and Azure Site Recovery, this article discusses use of private endpoints for Azure Backup only.
- Azure Active Directory doesn't currently support private endpoints. So IPs and FQDNs required for Azure Active Directory to work in a region will need to be allowed outbound access from the secured network when performing backup of databases in Azure VMs and backup using the MARS agent. You can also use NSG tags and Azure Firewall tags for allowing access to Azure AD, as applicable.
- Virtual networks with Network Policies aren't supported for Private Endpoints. You'll need to [disable Network Polices](https://docs.microsoft.com/azure/private-link/disable-private-endpoint-network-policy) before continuing.
- You need to re-register the Recovery Services resource provider with the subscription if you registered it before May 1 2020. To re-register the provider, go to your subscription in the Azure portal, navigate to **Resource provider** on the left navigation bar, then select **Microsoft.RecoveryServices** and select **Re-register**.
- [Cross-region restore](backup-create-rs-vault.md#set-cross-region-restore) for SQL and SAP HANA database backups aren't supported if the vault has private endpoints enabled.
- When you move a Recovery Services vault already using private endpoints to a new tenant, you'll need to update the Recovery Services vault to recreate and reconfigure the vault’s managed identity and create new private endpoints as needed (which should be in the new tenant). If this isn't done, the backup and restore operations will start failing. Also, any role-based access control (RBAC) permissions set up within the subscription will need to be reconfigured.

## Recommended and supported scenarios

While private endpoints are enabled for the vault, they're used for backup and restore of SQL and SAP HANA workloads in an Azure VM and MARS agent backup only. You can use the vault for backup of other workloads as well (they won't require private endpoints though). In addition to backup of SQL and SAP HANA workloads and backup using the MARS agent, private endpoints are also used to perform file recovery for Azure VM backup. For more information, see the following table:

| Backup of workloads in Azure VM (SQL, SAP HANA), Backup using MARS Agent | Use of private endpoints is recommended to allow backup and restore without needing to add to an allow list any IPs/FQDNs for Azure Backup or Azure Storage from your virtual networks. In that scenario, ensure that VMs that host SQL databases can reach Azure AD IPs or FQDNs. |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Azure  VM backup**                                         | VM backup doesn't require you to allow access to any IPs or FQDNs. So it doesn't require private endpoints for backup and restore  of disks.  <br><br>   However, file recovery from a vault containing private endpoints would be restricted to virtual networks that contain a private endpoint for the vault. <br><br>    When using ACL’ed unmanaged disks, ensure the  storage account containing the disks allows access to **trusted Microsoft services** if it's ACL’ed. |
| **Azure  Files backup**                                      | Azure Files backups are stored in the local  storage account. So it doesn't require private endpoints for backup and  restore. |

## Get started with creating private endpoints for Backup

The following sections discuss the steps involved in creating and using private endpoints for Azure Backup inside your virtual networks.

>[!IMPORTANT]
> It's highly recommended that you follow steps in the same sequence as mentioned in this document. Failure to do so may lead to the vault being rendered incompatible to use private endpoints and requiring you to restart the process with a new vault.

## Create a Recovery Services vault

Private endpoints for Backup can be only created for Recovery Services vaults that don't have any items protected to it (or haven't had any items attempted to be protected or registered to it in the past). So we suggest you create a new vault to start with. For more information about creating a new vault, see  [Create and configure a Recovery Services vault](backup-create-rs-vault.md).

See [this section](#create-a-recovery-services-vault-using-the-azure-resource-manager-client) to learn how to create a vault using the Azure Resource Manager client. This creates a vault with its managed identity already enabled.

## Enable Managed Identity for your vault

Managed identities allow the vault to create and use private endpoints. This section talks about enabling the managed identity for your vault.

1. Go to your Recovery Services vault -> **Identity**.

    ![Change Identity status to On](./media/private-endpoints/identity-status-on.png)

1. Change the **Status** to **On** and select **Save**.

1. An **Object ID** is generated, which is the vault’s managed identity.

    >[!NOTE]
    >Once enabled, the Managed Identity must **not** be disabled (even temporarily). Disabling the managed identity may lead to inconsistent behavior.

## Grant permissions to the vault to create required private endpoints

To create the required private endpoints for Azure Backup, the vault (the Managed Identity of the vault) must have permissions to the following resource groups:

- The Resource Group that contains the target VNet
- The Resource Group where the Private Endpoints are to be created
- The Resource Group that contains the Private DNS zones, as discussed in detail [here](#create-private-endpoints-for-azure-backup)

We recommend that you grant the **Contributor** role for those three resource groups to the vault (managed identity). The following steps describe how to do this for a particular resource group (this needs to be done for each of the three resource groups):

1. Go to the Resource Group and navigate to **Access Control (IAM)** on the left bar.
1. Once in **Access Control**, go to **Add a role assignment**.

    ![Add a role assignment](./media/private-endpoints/add-role-assignment.png)

1. In the **Add role assignment** pane, choose **Contributor** as the **Role**, and use the **Name** of the vault as the **Principal**. Select your vault and select **Save** when done.

    ![Choose role and principal](./media/private-endpoints/choose-role-and-principal.png)

To manage permissions at a more granular level, see [Create roles and permissions manually](#create-roles-and-permissions-manually).

## Create Private Endpoints for Azure Backup

This section explains how to create a private endpoint for your vault.

1. Navigate to your vault created above and go to **Private endpoint connections** on the left navigation bar. Select **+Private endpoint** on the top to start creating a new private endpoint for this vault.

    ![Create new private endpoint](./media/private-endpoints/new-private-endpoint.png)

1. Once in the **Create Private Endpoint** process, you'll be required to specify details for creating your private endpoint connection.
  
    1. **Basics**: Fill in the basic details for your private endpoints. The region should be the same as the vault and the resource   being backed up.

        ![Fill in basic details](./media/private-endpoints/basics-tab.png)

    1. **Resource**: This tab requires you to select the PaaS resource for which you want to create your connection. Select **Microsoft.RecoveryServices/vaults** from the resource type for your desired subscription. Once done, choose the name of your Recovery Services vault as the **Resource** and **AzureBackup** as the **Target sub-resource**.

        ![Select the resource for your connection](./media/private-endpoints/resource-tab.png)

    1. **Configuration**: In configuration, specify the virtual network and subnet where you want the private endpoint to be created. This will be the Vnet where the VM is present.

        To connect privately, you need required DNS records. Based on your network setup, you can choose one of the following:

          - Integrate your private endpoint with a private DNS zone: Select **Yes** if you wish to integrate.
          - Use your custom DNS server: Select **No** if you wish to use your own DNS server.

        Managing DNS records for both these are [described later](#manage-dns-records).

          ![Specify the virtual network and subnet](./media/private-endpoints/configuration-tab.png)

    1. Optionally, you can add **Tags** for your private endpoint.
    1. Continue to **Review + create** once done entering details. When the validation completes, select **Create** to create the private endpoint.

## Approve Private Endpoints

If the user creating the private endpoint is also the owner of the Recovery Services vault, the private endpoint created above will be auto-approved. Otherwise, the owner of the vault must approve the private endpoint before being able to use it. This section discusses manual approval of private endpoints through the Azure portal.

See [Manual approval of private endpoints using the Azure Resource Manager Client](#manual-approval-of-private-endpoints-using-the-azure-resource-manager-client) to use the Azure Resource Manager client for approving private endpoints.

1. In your Recovery Services vault, navigate to **Private endpoint connections** on the left bar.
1. Select the private endpoint connection you wish to approve.
1. Select **Approve** on the top bar. You can also select **Reject** or **Remove** if you wish to reject or delete the endpoint connection.

    ![Approve private endpoints](./media/private-endpoints/approve-private-endpoints.png)

## Manage DNS records

As described previously, you need the required DNS records in your private DNS zones or servers in order to connect privately. You can either integrate your private endpoint directly with Azure private DNS zones or use your custom DNS servers to achieve this, based on your network preferences. This will need to be done for all three services: Backup, Blobs, and Queues.

### When integrating private endpoints with Azure private DNS zones

If you choose to integrate your private endpoint with private DNS zones, Backup will add the required DNS records. You can view the private DNS zones being used under **DNS configuration** of the private endpoint. If these DNS zones aren't present, they'll be created automatically when creating the private endpoint. However, you must verify that your virtual network (which contains the resources to be backed up) is properly linked with all three private DNS zones, as described below.

![DNS configuration in Azure private DNS zone](./media/private-endpoints/dns-configuration.png)

#### Validate virtual network links in private DNS zones

For **each private DNS** zone listed above (for Backup, Blobs and Queues), do the following:

1. Navigate to the respective **Virtual network links** option on the left navigation bar.
1. You should be able to see an entry for the virtual network for which you've created the private endpoint, like the one shown below:

    ![Virtual network for private endpoint](./media/private-endpoints/virtual-network-links.png)

1. If you don’t see an entry, add a virtual network link to all those DNS zones that don't have them.

    ![Add virtual network link](./media/private-endpoints/add-virtual-network-link.png)

### When using custom DNS server or host files

If you're using your custom DNS servers, you'll need to create the required DNS zones and add the DNS records needed by the private endpoints to your DNS servers. For blobs and queues, you can also use conditional forwarders.

#### For the Backup service

1. In your DNS server, create a DNS zone for Backup according to the following naming convention:

    |Zone |Service |
    |---------|---------|
    |`privatelink.<geo>.backup.windowsazure.com`   |  Backup        |

    >[!NOTE]
    > In the above text, `<geo>` refers to the region code (for example *eus* and *ne* for East US and North Europe respectively). Refer to the following lists for regions codes:
    >
    > - [All public clouds](https://download.microsoft.com/download/1/2/6/126a410b-0e06-45ed-b2df-84f353034fa1/AzureRegionCodesList.docx)
    > - [China](/azure/china/resources-developer-guide#check-endpoints-in-azure)
    > - [Germany](../germany/germany-developer-guide.md#endpoint-mapping)
    > - [US Gov](../azure-government/documentation-government-developer-guide.md)

1. Next, we need to add the required DNS records. To view the records that need to be added to the Backup DNS zone, navigate to the private endpoint you created above, and go to the **DNS configuration** option under the left navigation bar.

    ![DNS configuration for custom DNS server](./media/private-endpoints/custom-dns-configuration.png)

1. Add one entry for each FQDN and IP displayed as A type records in your DNS zone for Backup. If you're using a host file for name resolution, make corresponding entries in the host file for each IP and FQDN according to the following format:

    `<private ip><space><backup service privatelink FQDN>`

>[!NOTE]
>As shown in the screenshot above, the FQDNs depict `xxxxxxxx.<geo>.backup.windowsazure.com` and not `xxxxxxxx.privatelink.<geo>.backup. windowsazure.com`. In such cases, ensure you include (and if required, add) the `.privatelink.` according to the stated format.

#### For Blob and Queue services

For blobs and queues, you can either use conditional forwarders or create DNS zones in your DNS server.

##### If using conditional forwarders

If you're using conditional forwarders, add forwarders for blob and queue FQDNs as follows:

|FQDN  |IP  |
|---------|---------|
|`privatelink.blob.core.windows.net`     |  168.63.129.16       |
|`privatelink.queue.core.windows.net`     | 168.63.129.16        |

##### If using private DNS zones

If you're using DNS zones for blobs and queues, you'll need to first create these DNS zones and later add the required A records.

|Zone |Service  |
|---------|---------|
|`privatelink.blob.core.windows.net`     |  Blob     |
|`privatelink.queue.core.windows.net`     | Queue        |

At this moment, we'll only create the zones for blobs and queues when using custom DNS servers. Adding DNS records will be done later in two steps:

1. When you register the first backup instance, that is, when you configure backup for the first time
1. When you run the first backup

We'll perform these steps in the following sections.

## Use Private Endpoints for Backup

Once the private endpoints created for the vault in your VNet have been approved, you can start using them for performing your backups and restores.

>[!IMPORTANT]
>Ensure that you've completed all the steps mentioned above in the document successfully before proceeding. To recap, you must have completed the steps in the following checklist:
>
>1. Created a (new) Recovery Services vault
>2. Enabled the vault to use system assigned Managed Identity
>3. Assigned relevant permissions to the Managed Identity of the vault
>4. Created a Private Endpoint for your vault
>5. Approved the Private Endpoint (if not auto approved)
>6. Ensured all DNS records are appropriately added (except blob and queue records for custom servers, which will be discussed in the following sections)

### Check VM connectivity

In the VM in the locked down network, ensure the following:

1. The VM should have access to AAD.
2. Execute **nslookup** on the backup URL (`xxxxxxxx.privatelink.<geo>.backup. windowsazure.com`) from your VM, to ensure connectivity. This should return the private IP assigned in your virtual network.

### Configure backup

Once you ensure the above checklist and access to have been successfully completed, you can continue to configure backup of workloads to the vault. If you're using a custom DNS server, you'll need to add DNS entries for blobs and queues that are available after configuring the first backup.

#### DNS records for blobs and queues (only for custom DNS servers/host files) after the first registration

After you have configured backup for at least one resource on a private endpoint enabled vault, add the required DNS records for blobs and queues as described below.

1. Navigate to your Resource Group, and search for the private endpoint you created.
1. Aside from the private endpoint name given by you, you'll see two more private endpoints being created. These start with `<the name of the private endpoint>_ecs` and are suffixed with `_blob` and `_queue` respectively.

    ![Private endpoint resources](./media/private-endpoints/private-endpoint-resources.png)

1. Navigate to each of these private endpoints. In the DNS configuration option for each of the two private endpoints, you'll see a record with and an FQDN and an IP address. Add both of these to your custom DNS server, in addition to the ones described earlier.
If you're using a host file, make corresponding entries in the host file for each IP/FQDN according to the following format:

    `<private ip><space><blob service privatelink FQDN>`<br>
    `<private ip><space><queue service privatelink FQDN>`

    ![Blob DNS configuration](./media/private-endpoints/blob-dns-configuration.png)

In addition to the above, there's another entry needed after the first backup, which is discussed [later](#dns-records-for-blobs-only-for-custom-dns-servershost-files-after-the-first-backup).

### Backup and restore of workloads in Azure VM (SQL and SAP HANA)

Once the private endpoint is created and approved, no other changes are required from the client side to use the private endpoint (unless you're using SQL Availability Groups, which we discuss later in this section). All communication and data transfer from your secured network to the vault will be performed through the private endpoint. However, if you remove private endpoints for the vault after a server (SQL or SAP HANA) has been registered to it, you'll need to re-register the container with the vault. You don't need to stop protection for them.

#### DNS records for blobs (only for custom DNS servers/host files) after the first backup

After you run the first backup and you're using a custom DNS server (without conditional forwarding), it's likely that your backup will fail. If that happens:

1. Navigate to your Resource Group, and search for the private endpoint you created.
1. Aside from the three private endpoints discussed earlier, you'll now see a fourth private endpoint with its name starting with `<the name of the private endpoint>_prot` and are suffixed with `_blob`.

    ![Private endpoing with suffix "prot"](./media/private-endpoints/private-endpoint-prot.png)

1. Navigate to this new private endpoint. In the DNS configuration option, you'll see a record with an FQDN and an IP address. Add these to your private DNS server, in addition to the ones described earlier.

    If you're using a host file, make the corresponding entries in the host file for each IP and FQDN according to the following format:

    `<private ip><space><blob service privatelink FQDN>`

>[!NOTE]
>At this point, you should be able to run **nslookup** from the VM and resolve to private IP addresses when done on the vault’s Backup and Storage URLs.

### When using SQL Availability Groups

When using SQL Availability Groups (AG), you'll need to provision conditional forwarding in the custom AG DNS as described below:

1. Sign in to your domain controller.
1. Under the DNS application, add conditional forwarders for all three DNS zones (Backup, Blobs, and Queues) to the host IP 168.63.129.16 or  the custom DNS server IP address, as necessary. The following screenshots show when you're forwarding to the Azure host IP. If you're using your own DNS server, replace with the IP of your DNS server.

    ![Conditional forwarders in DNS Manager](./media/private-endpoints/dns-manager.png)

    ![New conditional forwarder](./media/private-endpoints/new-conditional-forwarder.png)

### Backup and restore through MARS Agent

When using the MARS Agent to back up your on-premises resources, make sure your on-premises network (containing your resources to be backed up) is peered with the Azure VNet that contains a private endpoint for the vault, so you can use it. You can then continue to install the MARS agent and configure backup as detailed here. However, you must ensure all communication for backup happens through the peered network only.

But if you remove private endpoints for the vault after a MARS agent has been registered to it, you'll need to re-register the container with the vault. You don't need to stop protection for them.

## Deleting Private EndPoints

See [this section](https://docs.microsoft.com/rest/api/virtualnetwork/privateendpoints/delete) to learn how to delete Private EndPoints.

## Additional topics

### Create a Recovery Services vault using the Azure Resource Manager client

You can create the Recovery Services vault and enable its Managed Identity (enabling the Managed Identity is required, as we'll later see) using the Azure Resource Manager client. A sample for doing this is shared below:

```rest
armclient PUT /subscriptions/<subscriptionid>/resourceGroups/<rgname>/providers/Microsoft.RecoveryServices/Vaults/<vaultname>?api-version=2017-07-01-preview @C:\<filepath>\MSIVault.json
```

The JSON file above should have the following content:

Request JSON:

```json
{
  "location": "eastus2",
  "name": "<vaultname>",
  "etag": "W/\"datetime'2019-05-24T12%3A54%3A42.1757237Z'\"",
  "tags": {
    "PutKey": "PutValue"
  },
  "properties": {},
  "id": "/subscriptions/<subscriptionid>/resourceGroups/<rgname>/providers/Microsoft.RecoveryServices/Vaults/<vaultname>",
  "type": "Microsoft.RecoveryServices/Vaults",
  "sku": {
    "name": "RS0",
    "tier": "Standard"
  },
  "identity": {
    "type": "systemassigned"
  }
}
```

Response JSON:

```json
{
   "location": "eastus2",
   "name": "<vaultname>",
   "etag": "W/\"datetime'2020-02-25T05%3A26%3A58.5181122Z'\"",
   "tags": {
     "PutKey": "PutValue"
   },
   "identity": {
     "tenantId": "<tenantid>",
     "principalId": "<principalid>",
     "type": "SystemAssigned"
   },
   "properties": {
     "provisioningState": "Succeeded",
     "privateEndpointStateForBackup": "None",
     "privateEndpointStateForSiteRecovery": "None"
   },
   "id": "/subscriptions/<subscriptionid>/resourceGroups/<rgname>/providers/Microsoft.RecoveryServices/Vaults/<vaultname>",
   "type": "Microsoft.RecoveryServices/Vaults",
   "sku": {
     "name": "RS0",
     "tier": "Standard"
   }
 }
```

>[!NOTE]
>The vault created in this example through the Azure Resource Manager client is already created with a system-assigned managed identity.

### Managing permissions on Resource Groups

The Managed Identity for the vault needs to have the following permissions in the resource group and virtual network where the private endpoints will be created:

- `Microsoft.Network/privateEndpoints/*`
This is required to perform CRUD on private endpoints in the resource group. It should be assigned on the resource group.
- `Microsoft.Network/virtualNetworks/subnets/join/action`
This is required on the virtual network where private IP is getting attached with the private endpoint.
- `Microsoft.Network/networkInterfaces/read`
This is required on the resource group to get the network interface created for the private endpoint.
- Private DNS Zone Contributor Role
This role already exists and can be used to provide `Microsoft.Network/privateDnsZones/A/*` and `Microsoft.Network/privateDnsZones/virtualNetworkLinks/read` permissions.

You can use one of the following methods to create roles with required permissions:

#### Create roles and permissions manually

Create the following JSON files and use the PowerShell command at the end of the section to create roles:

//PrivateEndpointContributorRoleDef.json

```json
{
  "Name": "PrivateEndpointContributor",
  "Id": null,
  "IsCustom": true,
  "Description": "Allows management of Private Endpoint",
  "Actions": [
    "Microsoft.Network/privateEndpoints/*",
  ],
  "NotActions": [],
  "AssignableScopes": [
    "/subscriptions/00000000-0000-0000-0000-000000000000"
  ]
}
```

//NetworkInterfaceReaderRoleDef.json

```json
{
  "Name": "NetworkInterfaceReader",
  "Id": null,
  "IsCustom": true,
  "Description": "Allows read on networkInterfaces",
  "Actions": [
    "Microsoft.Network/networkInterfaces/read"
  ],
  "NotActions": [],
  "AssignableScopes": [
    "/subscriptions/00000000-0000-0000-0000-000000000000"
  ]
}
```

//PrivateEndpointSubnetContributorRoleDef.json

```json
{
  "Name": "PrivateEndpointSubnetContributor",
  "Id": null,
  "IsCustom": true,
  "Description": "Allows adding of Private Endpoint connection to Virtual Networks",
  "Actions": [
    "Microsoft.Network/virtualNetworks/subnets/join/action"
  ],
  "NotActions": [],
  "AssignableScopes": [
    "/subscriptions/00000000-0000-0000-0000-000000000000"
  ]
}
```

```azurepowershell
 New-AzRoleDefinition -InputFile "PrivateEndpointContributorRoleDef.json"
 New-AzRoleDefinition -InputFile "NetworkInterfaceReaderRoleDef.json"
 New-AzRoleDefinition -InputFile "PrivateEndpointSubnetContributorRoleDef.json"
```

#### Use a script

1. Start the **Cloud Shell** in the Azure portal and select **Upload file** in the PowerShell window.

    ![Select Upload file in PowerShell window](./media/private-endpoints/upload-file-in-powershell.png)

1. Upload the following script: [VaultMsiPrereqScript](https://download.microsoft.com/download/1/2/6/126a410b-0e06-45ed-b2df-84f353034fa1/VaultMsiPrereqScript.ps1)

1. Go to your home folder (for example: `cd /home/user`)

1. Run the following script:

    ```azurepowershell
    ./VaultMsiPrereqScript.ps1 -subscription <subscription-Id> -vaultPEResourceGroup <vaultPERG> -vaultPESubnetResourceGroup <subnetRG> -vaultMsiName <msiName>
    ```

    These are the parameters:

    - **subscription**: **SubscriptionId that has the resource group where the private endpoint for the vault is to be created and the subnet where the vault's private endpoint will be attached

    - **vaultPEResourceGroup**: Resource group where the private endpoint for the vault will be created

    - **vaultPESubnetResourceGroup**: Resource group of the subnet to which the private endpoint will be joined

    - **vaultMsiName**: Name of the vault's MSI, which is the same as **VaultName**

1. Complete the authentication and the script will take the context of the given subscription provided above. It will create the appropriate roles if they're missing from the tenant and will assign roles to the vault's MSI.

### Creating Private Endpoints using Azure PowerShell

#### Auto-approved private endpoints

```azurepowershell
$vault = Get-AzRecoveryServicesVault `
        -ResourceGroupName $vaultResourceGroupName `
        -Name $vaultName
  
$privateEndpointConnection = New-AzPrivateLinkServiceConnection `
        -Name $privateEndpointConnectionName `
        -PrivateLinkServiceId $vault.ID `
        -GroupId "AzureBackup"  

$vnet = Get-AzVirtualNetwork -Name $vnetName -ResourceGroupName $VMResourceGroupName
$subnet = $vnet | Select -ExpandProperty subnets | Where-Object {$_.Name -eq '<subnetName>'}


$privateEndpoint = New-AzPrivateEndpoint `
        -ResourceGroupName $vmResourceGroupName `
        -Name $privateEndpointName `
        -Location $location `
        -Subnet $subnet `
        -PrivateLinkServiceConnection $privateEndpointConnection `
        -Force
```

### Manual approval of private endpoints using the Azure Resource Manager Client

1. Use **GetVault** to get the Private Endpoint Connection ID for your private endpoint.

    ```rest
    armclient GET /subscriptions/<subscriptionid>/resourceGroups/<rgname>/providers/Microsoft.RecoveryServices/vaults/<vaultname>?api-version=2017-07-01-preview
    ```

    This will return the Private Endpoint Connection ID. The name of the connection can be retrieved by using the first part of the connection ID as follows:

    `privateendpointconnectionid = {peName}.{vaultId}.backup.{guid}`

1. Get the **Private Endpoint Connection ID** (and the **Private Endpoint Name**, wherever required) from the response and replace it in the following JSON and Azure Resource Manager URI and try changing the Status to “Approved/Rejected/Disconnected”, as demonstrated in the sample below:

    ```rest
    armclient PUT /subscriptions/<subscriptionid>/resourceGroups/<rgname>/providers/Microsoft.RecoveryServices/Vaults/<vaultname>/privateEndpointConnections/<privateendpointconnectionid>?api-version=2020-02-02-preview @C:\<filepath>\BackupAdminApproval.json
    ```

    JSON:

    ```json
    {
    "id": "/subscriptions/<subscriptionid>/resourceGroups/<rgname>/providers/Microsoft.RecoveryServices/Vaults/<vaultname>/privateEndpointConnections/<privateendpointconnectionid>",
    "properties": {
        "privateEndpoint": {
        "id": "/subscriptions/<subscriptionid>/resourceGroups/<pergname>/providers/Microsoft.Network/privateEndpoints/pename"
        },
        "privateLinkServiceConnectionState": {
        "status": "Disconnected",  //choose state from Approved/Rejected/Disconnected
        "description": "Disconnected by <userid>"
        }
    }
    }
    ```

## Frequently asked questions

Q. Can I create a private endpoint for an existing Backup vault?<br>
A. No, private endpoints can be created for new Backup vaults only. So the vault must not have ever had any items protected to it. In fact, no attempts to protect any items to the vault can be made before creating private endpoints.

Q. I tried to protect an item to my vault, but it failed and the vault still doesn't contain any items protected to it. Can I create private endpoints for this vault?<br>
A. No, the vault must not have had any attempts to protect any items to it in the past.

Q. I have a vault that's using private endpoints for backup and restore. Can I later add or remove private endpoints for this vault even if I have backup items protected to it?<br>
A. Yes. If you already created private endpoints for a vault and protected backup items to it, you can later add or remove private endpoints as required.

Q. Can the private endpoint for Azure Backup also be used for Azure Site Recovery?<br>
A. No, the private endpoint for Backup can only be used for Azure Backup. You'll need to create a new private endpoint for Azure Site Recovery, if it's supported by the service.

Q. I missed one of the steps in this article and went on to protect my data source. Can I still use private endpoints?<br>
A. Not following the steps in the article and continuing to protect items may lead to the vault not being able to use private endpoints. It's therefore recommended you refer to this checklist before proceeding to protect items.

Q. Can I use my own DNS server instead of using the Azure private DNS zone or an integrated private DNS zone?<br>
A. Yes, you can use your own DNS servers. However, make sure all required DNS records are added as suggested in this section.

Q. Do I need to perform any additional steps on my server after I've followed the process in this article?<br>
A. After following the process detailed in this article, you don't need to do additional work to use private endpoints for backup and restore.

## Next steps

- Read about all the [security features in Azure Backup](security-overview.md).
