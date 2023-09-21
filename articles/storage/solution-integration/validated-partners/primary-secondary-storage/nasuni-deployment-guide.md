---
title: Nasuni Configuration Guide for Microsoft Azure
titleSuffix: Azure Storage
description: Deployment guide for Nasuni and Azure Blob Storage
author: timkresler
ms.author: timkresler
ms.date: 09/13/2023
ms.topic: conceptual
ms.service: azure-storage
ms.subservice: storage-partner-integration
---

# Nasuni Configuration Guide for Microsoft Azure

Microsoft Azure is a cloud computing service created by Microsoft for building, testing, deploying, and managing applications and services through Microsoft-managed data centers. It provides software as a service (SaaS), platform as a service (PaaS) and infrastructure as a service (IaaS) and supports many different programming languages, tools, and frameworks, including both Microsoft-specific and third-party software and systems.

Azure Blob storage is Microsoft's object storage solution for the cloud. Blob storage is optimized for storing massive amounts of unstructured data. Unstructured data is data that doesn't adhere to a particular data model or definition, such as text or binary data.

> [!TIP]
>  For Microsoft Azure configuration suggestions to prevent accidental or malicious deletion of data, see [Deletion Security](https://b.link/Nasuni_Deletion_Security)

## Creating an Azure storage account (using Azure portal)

> [!NOTE]
> You must have at least one subscription for this purpose.

> [!NOTE]
>  Selecting the “Secure transfer required” feature for an Azure Storage account does not affect the operation of the Nasuni Edge Appliance

> [!TIP]
> In the Nasuni model, customers provide their own cloud accounts for the storage of their data. Customers should leverage their cloud provider's role-based access and identity access management features as part of their overall security strategy. Such features can be used to limit or prohibit administrative access to the cloud account, based on customer policies

This procedure uses the Azure portal.

If you don't already have a storage account in Microsoft Azure, create a storage account in Microsoft Azure by following these steps:
1. Sign in to the [Azure portal](https://portal.azure.com). The Microsoft Azure dashboard page appears.
2. On the top left of the page, select “Create a resource." The “Create a resource” dialog appears.
:::image type="content" source="./media/nasuni-quick-start-guide/win_azure_create_resource_93.png" alt-text="Screenshot of Azure Create Resource panel" lightbox="./media/nasuni-quick-start-guide/win_azure_create_resource_93.png":::
3. In the Search box, enter “storage account" then select Storage account from the list of results. The Storage account pane appears.
:::image type="content" source="./media/nasuni-quick-start-guide/win_storage_account_90.png" alt-text="Screenshot of Azure Create Storage Account panel" lightbox="./media/nasuni-quick-start-guide/win_storage_account_90.png":::
4. Select Create. The “Create a storage account” pane appears.
:::image type="content" source="./media/nasuni-quick-start-guide/win_create_storage_account_90.png" alt-text="Screenshot of Azure Create Storage Account details" lightbox="./media/nasuni-quick-start-guide/win_create_storage_account_90":::
5. If there is more than one subscription, from the Subscription drop-down list, select the subscription to use for this storage account.
6. To select an existing Resource Group, select an existing Resource Group from the Resource Group drop-down list.
    Alternatively, create a new Resource Group by clicking “Create new” and then entering a name for the new Resource Group and clicking OK.
7. Select Next: Advanced. The Advanced pane appears.
:::image type="content" source="./media/nasuni-quick-start-guide/win_azure_create_storage_account_security_93.png" alt-text="Screenshot of Azure Create Storage Account Advanced pane" lightbox="./media/nasuni-quick-start-guide/win_azure_create_storage_account_security_93":::
8. If your security policy requires it, enable “Require secure transfer for REST API operations."
9. For “Access tier,” select Cool for production data.
> [!NOTE]
> Nasuni also supports [Azure Cold Storage](/azure/storage/blobs/access-tiers-overview). To use Azure Cold Storage, configure Lifecycle Management rules that are based on access tracking. When enabled, access tracking checks when a blob was last accessed. A rule can be defined to move objects that have not been accessed for 90 days or longer. Enabling this feature may incur additional cost.
10. Set “Azure Files” to disabled.
11. Configure other features according to your needs.
12. Select “Next: Networking >.” The Networking pane appears.
:::image type="content" source="./media/nasuni-quick-start-guide/win_networking_90.png" alt-text="Screenshot of Azure Create Storage Account Networking pane" lightbox="./media/nasuni-quick-start-guide/win_networking_90":::
13. Select the “Connectivity method” to match your security requirements.
> [!NOTE]
> Consider where Edge Appliances will be deployed and how they will access the storage account, for example, via the Internet, Azure ExpressRoute, or a VPN connection to Azure. Most customers select the default “Public endpoint (all networks)”.
14. Configure other features according to your needs
15. Select “Next: Data protection.” The Data protection pane appears.
:::image type="content" source="./media/nasuni-quick-start-guide/win_data_protection_90.png" alt-text="Screenshot of Azure Create Storage Account Data Protection pane" lightbox="./media/nasuni-quick-start-guide/win_data_protection_90":::
16. Nasuni recommends enabling Soft Delete for all storage accounts being used for Nasuni volumes. If data is deleted, instead of the data being permanently lost, the data changes to a “soft deleted” state and remains available for a configurable number of days. 
    
    Enable “Enable soft delete for blobs." 

    Specify “Days to retain deleted blobs” by entering or selecting the number of days to retain data. (You can retain soft-deleted data for between 1 and 365 days.) Nasuni recommends specifying at least 30 days.
17. Nasuni recommends enabling Soft Delete for containers. Containers marked for deletion remain available for a configurable number of days.

    After configuring your storage account, enable “Enable soft delete for containers.”

    Specify “Days to retain deleted containers” by entering or selecting the number of days to retain data. (You can retain soft-deleted data for between 1 and 365 days.) Nasuni recommends specifying at least 30 days.

    For details see [soft delete for containers](/azure/storage/blobs/soft-delete-container-overview)
18. Configure other features according to your needs
19. Select “Next: Tags >." The Tags pane appears.
20. Define any Tags based on your internal policies.
21. Select “Next: Review + create >”
22. Select Create.
    The storage account starts being created. When the storage account is created, select Storage Accounts in the left-hand list. The new storage account appears in the list of storage accounts.
23. Select the name of your storage account. The pane for your storage account settings appears.

> [!TIP]
> It is possible to recover a deleted storage account. For details, see [Recovering a deleted storage account](/azure/storage/blobs/soft-delete-container-overview).

## Configuring storage account firewalls

Storage account firewalls must be configured to allow connections from the internal customer network or any other networks that Nasuni Edge Appliances either exist on or are using. 

To configure storage account firewalls, follow these steps:
1. Select the storage account.
2. In the left-hand column, select Networking, then select the “Firewalls and virtual networks” tab. The “Firewalls and virtual networks” pane appears.
:::image type="content" source="./media/nasuni-quick-start-guide/win_azure_firewalls_virtual_networks_93.png" alt-text="Screenshot of Azure Firewalls and Virtual Networks pane" lightbox="./media/nasuni-quick-start-guide/win_azure_firewalls_virtual_networks_93":::
3. Select “Selected networks.”
    Alternatively, if allowing access from all networks, select “All networks” and skip to step 7.
:::image type="content" source="./media/nasuni-quick-start-guide/win_azure_firewalls_selected_networks_93.png" alt-text="Screenshot of Azure Firewalls and Selected Networks pane" lightbox="./media/nasuni-quick-start-guide/win_azure_firewalls_selected_networks_93":::
4. To add an existing virtual network, in the Virtual Networks area, select “Add existing virtual network.” Select Virtual networks and Subnets options, and then select Add.
5. To create a new virtual network and grant it access, in the Virtual Networks area, select “Add new virtual network.” Provide the information necessary to create the new virtual network, and then select Create.
6. To grant access to an IP range, in the Firewall area, enter the IP address or address range (in CIDR format) in Address Range. Include the internal customer network and other networks that Edge Appliances exist on or are using. Take network routing into account. For example, if connecting to the storage account over a private connection, use internal subnets; if connecting to the storage account over the public Internet, use public IPs.
7.  Select Save to apply your changes.

## Finding Microsoft Azure User Credentials

> [!NOTE]
> You must have at least one subscription for this purpose

> [!NOTE]
> Confirm with Nasuni Sales or Support that your Nasuni account is configured for supplying your own Microsoft Azure credentials.

To locate Microsoft Azure credentials, follow these steps:
1. Sign in to the [Azure portal](https://portal.azure.com). The Microsoft Azure dashboard page appears.
2. Select Storage Accounts in the left-hand list.
3. Select your storage account. The pane for your storage account settings appears.
4. Select Access keys. Your account access key information appears.
5. Record the Microsoft Azure Storage Account Name for later use
6. Select “Show keys” to view key values. Key values appear.
7. Under key1, find the Key value. Select the copy button to copy the Microsoft Azure Primary Access Key. Save this value for creating Microsoft Azure cloud credentials
8. Under key1, find the “Connection string” value. Select the copy button to copy the Connection string. Save this value for possible later use.

## Configuration
Nasuni provides a Nasuni Connector for Microsoft Azure.

> [!TIP]
> If you have a requirement to change Cloud Credentials on a regular basis, use the following procedure, preferably outside office hours:
> - Obtain new credentials. Credentials typically consist of a pair of values, such as Access Key ID and Secret Access Key, Account Name and Primary Access Key, or User and Secret.
> - On the Cloud Credentials page, edit the cloud credentials to use the new credentials.
> - The change in cloud credentials is registered on the next snapshot that contains unprotected data.
> - Manually performing a snapshot also causes the change in cloud credentials to be registered, even if there is no unprotected data for the volume.
> - After each Edge Appliance has performed such a snapshot, the original credentials can be retired with the cloud provider

> [!WARNING]
> Do not retire the original credentials with the cloud provider until you are certain that they are no longer necessary. Otherwise, data might become unavailable

To configure Nasuni for Microsoft Azure, follow these steps:
1. Ensure that port 443 (HTTPS) is open between the Nasuni Edge Appliance and the object storage solution.
2. Select Configuration. On NMC, select Account.
3. Select Cloud Credentials. 
4. Select Add New Credentials, then select "Windows Azure Platform" from the drop-down menu
5. Enter credentials information:
    -  For Microsoft Azure, enter the following information:
        - Name: A name for this set of credentials, which is used for display purposes, such as ObjectStorageCluster1.
        - Account Name: The Microsoft Azure Storage Account Name for this set of credentials, obtained in step 5 on page 9 above.
        - Primary Access Key: The Microsoft Azure Primary Access Key for this set of credentials, obtained in step 7 on page 9 above.
        - Hostname: The hostname for the location of the object storage solution. Use the default setting: blob.core.windows.net.
        - Verify SSL Certificates: Use the default On setting.
        - Filers (on NMC only): The target Nasuni Edge Appliance(s).
    -  For Microsoft Azure Gov Cloud, enter the following information:
        - Name: A name for this set of credentials, which is used for display purposes, such as ObjectStorageCluster1.
        - Account Name: The Microsoft Azure Storage Account Name for this set of credentials, obtained in step 5 on page 9 above.
        - Primary Access Key: The Microsoft Azure Primary Access Key for this set of credentials, obtained in step 7 on page 9 above.
        - Hostname: The hostname for the location of the object storage solution. Use: blob.core.usgovcloudapi.net.
        - Verify SSL Certificates: Use the default On setting.
        - Filers (on NMC only): The target Nasuni Edge Appliance(s).
> [!WARNING]
> Be careful changing existing credentials. The connection between the Nasuni Edge Appliance and the container could become invalid, causing loss of data access. Credential editing is to update access after changes to the account name or the access key on the Microsoft Azure system.
6. Select Save Credentials.

You're now ready to add volumes to the Nasuni Edge Appliance.

## Adding volumes
To add volumes to your Nasuni system, follow these steps:
1. Select Volumes, then select Add New Volume. The Add New Volume page appears.
2. Enter the following information for the new volume:
    - Name: Enter a human-readable name for the volume.
    - Cloud Provider: Select Windows Azure Platform.
    - Credentials: Select the Cloud Credentials that you defined in step 5 for this volume, such as ObjectStorageCluster1
    - For the remaining options, select what is appropriate for this volume.
3.  Select Save.

You have successfully created a new volume on your Nasuni Filer.

## Recovering a deleted storage account
It's possible to recover a deleted storage account, if the following conditions are true:
- It has been less than 14 days since the storage account was deleted.
-  You created the storage account with the Azure Resource Manager deployment model. Storage accounts created using the Azure portal satisfy this requirement. The older “classic” storage accounts don't.
-  A new storage account with the same name hasn't been created since the original storage account was deleted.

For details, review [Recover a Deleted Storage Account](/azure/storage/common/storage-account-recover)

## Azure Private Endpoints
Nasuni supports Azure Private Endpoints relying on the DNS layer to resolve the 
private endpoint IP.

It's important to correctly configure your DNS settings to resolve the private endpoint IP address to the fully qualified domain name (FQDN) of the connection string.

Existing Microsoft Azure services might already have a DNS configuration for a public endpoint. This configuration must be overridden to connect using your private endpoint.

The network interface associated with the private endpoint contains the information to configure your DNS. The network interface information includes FQDN and private IP addresses for your private link resource.

You can use the following options to configure your DNS settings for private endpoints:
-  Use a private DNS zone. You can use private DNS zones to override the DNS resolution for a private endpoint. A private DNS zone can be linked to your virtual network to resolve specific domains.
-  Use your DNS forwarder (optional). You can use your DNS forwarder to override the DNS resolution for a private link resource. Create a DNS forwarding rule to use a private DNS zone on your DNS server hosted in a virtual network.

> [NOTE!]
> Using the Host file on the Nasuni Edge Appliance is not supported.

> [NOTE!]
> Nasuni’s default Host URL endpoint for Nasuni’s Azure Cloud Credentials should not be changed.

### Azure services DNS zone configuration
Azure creates a canonical name DNS record (CNAME) on the public DNS. The CNAME record redirects the resolution to the private domain name. You can override the resolution with the private IP address of your private endpoints. Your applications don't need to change the connection URL. When resolving names via a public DNS service, the DNS server resolves to your private endpoints. The process doesn't affect Nasuni Edge Appliances.

For Azure services, use the recommended zone names as described [here](/azure/private-link/private-endpoint-dns#azure-services-dns-zone-configuration)

### DNS configuration scenarios
The FQDN of the services resolves automatically to a public IP address. To resolve to the private IP address of the private endpoint, change your DNS configuration.

DNS is a critical component to make the application work correctly by successfully resolving the private endpoint IP address.

Based on your configuration requirements, the following scenarios are available with DNS resolution integrated:
- [Virtual network workloads without custom DNS server](/azure/private-link/private-endpoint-dns#virtual-network-workloads-without-custom-dns-server)
- [On-premises workloads using a DNS forwarder](/azure/private-link/private-endpoint-dns#on-premises-workloads-using-a-dns-forwarder)
- [Virtual network and on-premises workloads using a DNS forwarder](/azure/private-link/private-endpoint-dns#on-premises-workloads-using-a-dns-forwarder)