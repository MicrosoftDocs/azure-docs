---
title: Database security overview
titleSuffix: Azure Cosmos DB
description: Learn how Azure Cosmos DB provides database protection and data security for your data.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 11/21/2022
---

# Overview of database security in Azure Cosmos DB

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

This article discusses database security best practices and key features offered by Azure Cosmos DB to help you prevent, detect, and respond to database breaches.

## What's new in Azure Cosmos DB security

Encryption at rest is now available for documents and backups stored in Azure Cosmos DB in all Azure regions. Encryption at rest is applied automatically for both new and existing customers in these regions. There's no need to configure anything. You get the same great latency, throughput, availability, and functionality as before with the benefit of knowing your data is safe and secure with encryption at rest.  Data stored in your Azure Cosmos DB account is automatically and seamlessly encrypted with keys managed by Microsoft using service-managed keys. Optionally, you can choose to add a second layer of encryption with keys you manage using [customer-managed keys or CMK](how-to-setup-cmk.md).

## How do I secure my database

Data security is a shared responsibility between you, the customer, and your database provider. Depending on the database provider you choose, the amount of responsibility you carry can vary. If you choose an on-premises solution, you need to provide everything from end-point protection to physical security of your hardware - which is no easy task. If you choose a PaaS cloud database provider such as Azure Cosmos DB, your area of concern shrinks considerably. The following image, borrowed from Microsoft's [Shared Responsibilities for Cloud Computing](https://azure.microsoft.com/resources/shared-responsibilities-for-cloud-computing/) white paper, shows how your responsibility decreases with a PaaS provider like Azure Cosmos DB.

:::image type="content" source="./media/database-security/nosql-database-security-responsibilities.png" alt-text="Screenshot of customer and database provider responsibilities.":::

The preceding diagram shows high-level cloud security components, but what items do you need to worry about specifically for your database solution? And how can you compare solutions to each other?

We recommend the following checklist of requirements on which to compare database systems:

- Network security and firewall settings
- User authentication and fine grained user controls
- Ability to replicate data globally for regional failures
- Ability to fail over from one data center to another
- Local data replication within a data center
- Automatic data backups
- Restoration of deleted data from backups
- Protect and isolate sensitive data
- Monitoring for attacks
- Responding to attacks
- Ability to geo-fence data to adhere to data governance restrictions
- Physical protection of servers in protected data centers
- Certifications

And although it may seem obvious, recent [large-scale database breaches](https://thehackernews.com/2017/01/mongodb-database-security.html) remind us of the simple but critical importance of the following requirements:

- Patched servers that are kept up-to-date
- HTTPS by default/TLS encryption
- Administrative accounts with strong passwords

## How does Azure Cosmos DB secure my database

Let's look back at the preceding list - how many of those security requirements does Azure Cosmos DB provide? Every single one.

Let's dig into each one in detail.

|Security requirement|Azure Cosmos DB's security approach|
|---|---|
|Network security|Using an IP firewall is the first layer of protection to secure your database. Azure Cosmos DB supports policy driven IP-based access controls for inbound firewall support. The IP-based access controls are similar to the firewall rules used by traditional database systems. However, they're expanded so that an Azure Cosmos DB database account is only accessible from an approved set of machines or cloud services. Learn more in [Azure Cosmos DB firewall support](how-to-configure-firewall.md) article.<br><br>Azure Cosmos DB enables you to enable a specific IP address (168.61.48.0), an IP range (168.61.48.0/8), and combinations of IPs and ranges. <br><br>All requests originating from machines outside this allowed list are blocked by Azure Cosmos DB. Requests from approved machines and cloud services then must complete the authentication process to be given access control to the resources.<br><br> You can use [virtual network service tags](../virtual-network/service-tags-overview.md) to achieve network isolation and protect your Azure Cosmos DB resources from the general Internet. Use service tags in place of specific IP addresses when you create security rules. By specifying the service tag name (for example, AzureCosmosDB) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service.|
|Authorization|Azure Cosmos DB uses hash-based message authentication code (HMAC) for authorization. <br><br>Each request is hashed using the secret account key, and the subsequent base-64 encoded hash is sent with each call to Azure Cosmos DB. To validate the request, the Azure Cosmos DB service uses the correct secret key and properties to generate a hash, then it compares the value with the one in the request. If the two values match, the operation is authorized successfully, and the request is processed. If they don't match, there's an authorization failure and the request is rejected.<br><br>You can use either a [primary key](#primary-keys), or a [resource token](secure-access-to-data.md#resource-tokens) allowing fine-grained access to a resource such as a document.<br><br>Learn more in [Securing access to Azure Cosmos DB resources](secure-access-to-data.md).|
|Users and permissions|Using the primary key for the account, you can create user resources and permission resources per database. A resource token is associated with a permission in a database and determines whether the user has access (read-write, read-only, or no access) to an application resource in the database. Application resources include container, documents, attachments, stored procedures, triggers, and UDFs. The resource token is then used during authentication to provide or deny access to the resource.<br><br>Learn more in [Securing access to Azure Cosmos DB resources](secure-access-to-data.md).|
|Active directory integration (Azure role-based access control)| You can also provide or restrict access to the Azure Cosmos DB account, database, container, and offers (throughput) using Access control (IAM) in the Azure portal. IAM provides role-based access control and integrates with Active Directory. You can use built in roles or custom roles for individuals and groups. For more information, see [Active Directory integration](role-based-access-control.md).|
|Global replication|Azure Cosmos DB offers turnkey global distribution, which enables you to replicate your data to any one of Azure's world-wide datacenters in a turnkey way. Global replication lets you scale globally and provide low-latency access to your data around the world.<br><br>In the context of security, global replication ensures data protection against regional failures.<br><br>Learn more in [Distribute data globally](distribute-data-globally.md).|
|Regional failovers|If you've replicated your data in more than one data center, Azure Cosmos DB automatically rolls over your operations should a regional data center go offline. You can create a prioritized list of failover regions using the regions in which your data is replicated. <br><br>Learn more in [Regional Failovers in Azure Cosmos DB](high-availability.md).|
|Local replication|Even within a single data center, Azure Cosmos DB automatically replicates data for high availability giving you the choice of [consistency levels](consistency-levels.md). This replication guarantees a 99.99% [availability SLA](https://azure.microsoft.com/support/legal/sla/cosmos-db) for all single region accounts and all multi-region accounts with relaxed consistency, and 99.999% read availability on all multi-region database accounts.|
|Automated online backups|Azure Cosmos DB databases are backed up regularly and stored in a geo redundant store. <br><br>Learn more in [Automatic online backup and restore with Azure Cosmos DB](online-backup-and-restore.md).|
|Restore deleted data|The automated online backups can be used to recover data you may have accidentally deleted up to ~30 days after the event. <br><br>Learn more in [Automatic online backup and restore with Azure Cosmos DB](online-backup-and-restore.md)|
|Protect and isolate sensitive data|All data in the regions listed in What's new? is now encrypted at rest.<br><br>Personal data and other confidential data can be isolated to specific container and read-write, or read-only access can be limited to specific users.|
|Monitor for attacks|By using [audit logging and activity logs](./monitor.md), you can monitor your account for normal and abnormal activity. You can view what operations were performed on your resources. This data includes; who initiated the operation, when the operation occurred, the status of the operation, and much more.|
|Respond to attacks|Once you have contacted Azure support to report a potential attack, a five-step incident response process is kicked off. The goal of the five-step process is to restore normal service security and operations. The five-step process restores services as quickly as possible after an issue is detected and an investigation is started.<br><br>Learn more in [Microsoft Azure Security Response in the Cloud](https://azure.microsoft.com/resources/shared-responsibilities-for-cloud-computing/).|
|Geo-fencing|Azure Cosmos DB ensures data governance for sovereign regions (for example, Germany, China, US Gov).|
|Protected facilities|Data in Azure Cosmos DB is stored on SSDs in Azure's protected data centers.<br><br>Learn more in [Microsoft global datacenters](https://www.microsoft.com/en-us/cloud-platform/global-datacenters)|
|HTTPS/SSL/TLS encryption|All connections to Azure Cosmos DB support HTTPS. Azure Cosmos DB supports TLS levels up to 1.2 (included).<br>It's possible to enforce a minimum TLS level on server-side. To do so, refer to self service guide [Self-serve minimum TLS version enforcement in Azure Cosmos DB](./self-serve-minimum-tls-enforcement.md).|
|Encryption at rest|All data stored into Azure Cosmos DB is encrypted at rest. Learn more in [Azure Cosmos DB encryption at rest](./database-encryption-at-rest.md)|
|Patched servers|As a managed database, Azure Cosmos DB eliminates the need to manage and patch servers, that's done for you, automatically.|
|Administrative accounts with strong passwords|It's hard to believe we even need to mention this requirement, but unlike some of our competitors, it's impossible to have an administrative account with no password in Azure Cosmos DB.<br><br> Security via TLS and HMAC secret based authentication is baked in by default.|
|Security and data protection certifications| For the most up-to-date list of certifications, see [Azure compliance](https://www.microsoft.com/en-us/trustcenter/compliance/complianceofferings) and the latest [Azure compliance document](https://azure.microsoft.com/mediahandler/files/resourcefiles/microsoft-azure-compliance-offerings/Microsoft%20Azure%20Compliance%20Offerings.pdf) with all Azure certifications including Azure Cosmos DB.

The following screenshot shows how you can use audit logging and activity logs to monitor your account: 
:::image type="content" source="./media/database-security/nosql-database-security-application-logging.png" alt-text="Screenshot of activity logs for Azure Cosmos DB.":::

<a id="primary-keys"></a>

## Primary/secondary keys

Primary/secondary keys provide access to all the administrative resources for the database account. Primary/secondary keys:

- Provide access to accounts, databases, users, and permissions. 
- Can't be used to provide granular access to containers and documents.
- Are created during the creation of an account.
- Can be regenerated at any time.

Each account consists of two keys: a primary key and secondary key. The purpose of dual keys is so that you can regenerate, or roll keys, providing continuous access to your account and data.

Primary/secondary keys come in two versions: read-write and read-only. The read-only keys only allow read operations on the account, but don't provide access to read permissions resources.

### <a id="key-rotation"></a> Key rotation and regeneration

The process of key rotation and regeneration is simple. First, make sure that **your application is consistently using either the primary key or the secondary key** to access your Azure Cosmos DB account. Then, follow the steps outlined below. To monitor your account for key updates and key regeneration, see [monitor key updates with metrics and alerts](monitor-account-key-updates.md) article.

# [API for NoSQL](#tab/sql-api)

#### If your application is currently using the primary key

1. Navigate to your Azure Cosmos DB account on the Azure portal.

1. Select **Keys** from the left menu, then select **Regenerate Secondary Key** from the ellipsis on the right of your secondary key.

    :::image type="content" source="./media/database-security/regenerate-secondary-key.png" alt-text="Screenshot of the Azure portal showing how to regenerate the secondary key." border="true":::

1. Validate that the new secondary key works consistently against your Azure Cosmos DB account. Key regeneration can take anywhere from one minute to multiple hours depending on the size of the Azure Cosmos DB account.

1. Replace your primary key with the secondary key in your application.

1. Go back to the Azure portal and trigger the regeneration of the primary key.

    :::image type="content" source="./media/database-security/regenerate-primary-key.png" alt-text="Screenshot of the Azure portal showing how to regenerate the primary key." border="true":::

#### If your application is currently using the secondary key

1. Navigate to your Azure Cosmos DB account on the Azure portal.

1. Select **Keys** from the left menu, then select **Regenerate Primary Key** from the ellipsis on the right of your primary key.

    :::image type="content" source="./media/database-security/regenerate-primary-key.png" alt-text="Screenshot of the Azure portal showing how to regenerate the primary key." border="true":::

1. Validate that the new primary key works consistently against your Azure Cosmos DB account. Key regeneration can take anywhere from one minute to multiple hours depending on the size of the Azure Cosmos DB account.

1. Replace your secondary key with the primary key in your application.

1. Go back to the Azure portal and trigger the regeneration of the secondary key.

    :::image type="content" source="./media/database-security/regenerate-secondary-key.png" alt-text="Screenshot of the Azure portal showing how to regenerate the secondary key." border="true":::

# [Azure Cosmos DB for MongoDB](#tab/mongo-api)

#### If your application is currently using the primary key

1. Navigate to your Azure Cosmos DB account on the Azure portal.

1. Select **Connection String** from the left menu, then select **Regenerate Password** from the ellipsis on the right of your secondary password.

    :::image type="content" source="./media/database-security/regenerate-secondary-key-mongo.png" alt-text="Screenshot of the Azure portal showing how to regenerate the secondary key." border="true":::

1. Validate that the new secondary key works consistently against your Azure Cosmos DB account. Key regeneration can take anywhere from one minute to multiple hours depending on the size of the Azure Cosmos DB account.

1. Replace your primary key with the secondary key in your application.

1. Go back to the Azure portal and trigger the regeneration of the primary key.

    :::image type="content" source="./media/database-security/regenerate-primary-key-mongo.png" alt-text="Screenshot of the Azure portal showing how to regenerate the primary key." border="true":::

#### If your application is currently using the secondary key

1. Navigate to your Azure Cosmos DB account on the Azure portal.

1. Select **Connection String** from the left menu, then select **Regenerate Password** from the ellipsis on the right of your primary password.

    :::image type="content" source="./media/database-security/regenerate-primary-key-mongo.png" alt-text="Screenshot of the Azure portal showing how to regenerate the primary key." border="true":::

1. Validate that the new primary key works consistently against your Azure Cosmos DB account. Key regeneration can take anywhere from one minute to multiple hours depending on the size of the Azure Cosmos DB account.

1. Replace your secondary key with the primary key in your application.

1. Go back to the Azure portal and trigger the regeneration of the secondary key.

    :::image type="content" source="./media/database-security/regenerate-secondary-key-mongo.png" alt-text="Screenshot of the Azure portal showing how to regenerate the secondary key." border="true":::

# [API for Cassandra](#tab/cassandra-api)

#### If your application is currently using the primary key

1. Navigate to your Azure Cosmos DB account on the Azure portal.

1. Select **Connection String** from the left menu, then select **Regenerate Secondary Read-Write Password** from the ellipsis on the right of your secondary password.

    :::image type="content" source="./media/database-security/regenerate-secondary-key-cassandra.png" alt-text="Screenshot of the Azure portal showing how to regenerate the secondary key." border="true":::

1. Validate that the new secondary key works consistently against your Azure Cosmos DB account. Key regeneration can take anywhere from one minute to multiple hours depending on the size of the Azure Cosmos DB account.

1. Replace your primary key with the secondary key in your application.

1. Go back to the Azure portal and trigger the regeneration of the primary key.

    :::image type="content" source="./media/database-security/regenerate-primary-key-cassandra.png" alt-text="Screenshot of the Azure portal showing how to regenerate the primary key." border="true":::

#### If your application is currently using the secondary key

1. Navigate to your Azure Cosmos DB account on the Azure portal.

1. Select **Connection String** from the left menu, then select **Regenerate Primary Read-Write Password** from the ellipsis on the right of your primary password.

    :::image type="content" source="./media/database-security/regenerate-primary-key-cassandra.png" alt-text="Screenshot of the Azure portal showing how to regenerate the primary key." border="true":::

1. Validate that the new primary key works consistently against your Azure Cosmos DB account. Key regeneration can take anywhere from one minute to multiple hours depending on the size of the Azure Cosmos DB account.

1. Replace your secondary key with the primary key in your application.

1. Go back to the Azure portal and trigger the regeneration of the secondary key.

    :::image type="content" source="./media/database-security/regenerate-secondary-key-cassandra.png" alt-text="Screenshot of the Azure portal showing how to regenerate the secondary key." border="true":::

# [API for Gremlin](#tab/gremlin-api)

#### If your application is currently using the primary key

1. Navigate to your Azure Cosmos DB account on the Azure portal.

1. Select **Keys** from the left menu, then select **Regenerate Secondary Key** from the ellipsis on the right of your secondary key.

    :::image type="content" source="./media/database-security/regenerate-secondary-key-gremlin.png" alt-text="Screenshot of the Azure portal showing how to regenerate the secondary key." border="true":::

1. Validate that the new secondary key works consistently against your Azure Cosmos DB account. Key regeneration can take anywhere from one minute to multiple hours depending on the size of the Azure Cosmos DB account.

1. Replace your primary key with the secondary key in your application.

1. Go back to the Azure portal and trigger the regeneration of the primary key.

    :::image type="content" source="./media/database-security/regenerate-primary-key-gremlin.png" alt-text="Screenshot of the Azure portal showing how to regenerate the primary key." border="true":::

#### If your application is currently using the secondary key

1. Navigate to your Azure Cosmos DB account on the Azure portal.

1. Select **Keys** from the left menu, then select **Regenerate Primary Key** from the ellipsis on the right of your primary key.

    :::image type="content" source="./media/database-security/regenerate-primary-key-gremlin.png" alt-text="Screenshot of the Azure portal showing how to regenerate the primary key." border="true":::

1. Validate that the new primary key works consistently against your Azure Cosmos DB account. Key regeneration can take anywhere from one minute to multiple hours depending on the size of the Azure Cosmos DB account.

1. Replace your secondary key with the primary key in your application.

1. Go back to the Azure portal and trigger the regeneration of the secondary key.

    :::image type="content" source="./media/database-security/regenerate-secondary-key-gremlin.png" alt-text="Screenshot of the Azure portal showing how to regenerate the secondary key." border="true":::

# [API for Table](#tab/table-api)

#### If your application is currently using the primary key

1. Navigate to your Azure Cosmos DB account on the Azure portal.

1. Select **Connection String** from the left menu, then select **Regenerate Secondary Key** from the ellipsis on the right of your secondary key.

    :::image type="content" source="./media/database-security/regenerate-secondary-key-table.png" alt-text="Screenshot of the Azure portal showing how to regenerate the secondary key." border="true":::

1. Validate that the new secondary key works consistently against your Azure Cosmos DB account. Key regeneration can take anywhere from one minute to multiple hours depending on the size of the Azure Cosmos DB account.

1. Replace your primary key with the secondary key in your application.

1. Go back to the Azure portal and trigger the regeneration of the primary key.

    :::image type="content" source="./media/database-security/regenerate-primary-key-table.png" alt-text="Screenshot of the Azure portal showing how to regenerate the primary key." border="true":::

#### If your application is currently using the secondary key

1. Navigate to your Azure Cosmos DB account on the Azure portal.

1. Select **Connection String** from the left menu, then select **Regenerate Primary Key** from the ellipsis on the right of your primary key.

    :::image type="content" source="./media/database-security/regenerate-primary-key-table.png" alt-text="Screenshot of the Azure portal showing how to regenerate the primary key." border="true":::

1. Validate that the new primary key works consistently against your Azure Cosmos DB account. Key regeneration can take anywhere from one minute to multiple hours depending on the size of the Azure Cosmos DB account.

1. Replace your secondary key with the primary key in your application.

1. Go back to the Azure portal and trigger the regeneration of the secondary key.

    :::image type="content" source="./media/database-security/regenerate-secondary-key-table.png" alt-text="Screenshot of the Azure portal showing how to regenerate the secondary key." border="true":::

---

## Track the status of key regeneration

After you rotate or regenerate a key, you can track its status from the Activity log. Use the following steps to track the status:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Cosmos DB account.

1. Select **Keys** from the left menu. You should see the last key regeneration date below each key.

   :::image type="content" source="./media/database-security/track-key-regeneration-status.png" alt-text="Screenshot of status of key regeneration from Activity log." border="true":::

   Microsoft recommends regenerating the keys at least once every 60 days. If your last regeneration was more than 60 days ago, you will see a warning icon. Also, you could see that your key was not recorded. If this is the case, your account was created before 2022-06-18 and the dates were not registered. However, you should be able to regenerate and see your new last regeneration date for the new key.

1. You should see the key regeneration events along with its status, time at which the operation was issued, details of the user who initiated key regeneration. The key generation operation initiates with **Accepted** status, it then changes to **Started** and then to **Succeeded** when the operation completes.

## Next steps

For more information about primary keys and resource tokens, see [Securing access to Azure Cosmos DB data](secure-access-to-data.md).

For more information about audit logging, see [Azure Cosmos DB diagnostic logging](./monitor.md).

For more information about Microsoft certifications, see [Azure Trust Center](https://azure.microsoft.com/support/trust-center/).
