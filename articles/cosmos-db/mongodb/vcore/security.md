---
title: Security options and features
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Learn how Azure Cosmos DB for MongoDB vCore provides database protection and data security for your data.
author: khelanmodi
ms.author: khelanmodi
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 10/23/2023
---

# Overview of database security in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

This article discusses database security best practices and key features offered by Azure Cosmos DB for MongoDB vCore to help you prevent, detect, and respond to database breaches.

## What's new in Azure Cosmos DB for MongoDB vCore security

Encryption at rest is now available for documents and backups stored in Azure Cosmos DB for MongoDB vCore in most Azure regions. Encryption at rest is applied automatically for both new and existing customers in these regions. There's no need to configure anything. You get the same great latency, throughput, availability, and functionality as before with the benefit of knowing your data is safe and secure with encryption at rest.  Data stored in your Azure Cosmos DB for MongoDB vCore cluster is automatically and seamlessly encrypted with keys managed by Microsoft using service-managed keys. 

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

Azure Cosmos DB for MongoDB vCore seamlessly fulfills each and every one of those security requirements.

Let's dig into each one in detail.

|Security requirement|Azure Cosmos DB's security approach|
|---|---|
|Network security|Using an IP firewall is the first layer of protection to secure your database. Azure Cosmos DB for MongoDB vCore supports policy driven IP-based access controls for inbound firewall support. The IP-based access controls are similar to the firewall rules used by traditional database systems. However, they're expanded so that an Azure Cosmos DB for MongoDB vCore cluster is only accessible from an approved set of machines or cloud services. <br><br>Azure Cosmos DB for MongoDB vCore enables you to enable a specific IP address (168.61.48.0), an IP range (168.61.48.0/8), and combinations of IPs and ranges. <br><br>All requests originating from machines outside this allowed list are blocked by Azure Cosmos DB for MongoDB vCore. Requests from approved machines and cloud services then must complete the authentication process to be given access control to the resources.<br><br>|
|Local replication|Even within a single data center, Azure Cosmos DB for MongoDB vCore replicates the data using LRS. HA-enabled clusters also have another layer of replication between a primary and secondary node, thus guaranteeing a 99.995% [availability SLA](https://azure.microsoft.com/support/legal/sla/cosmos-db).|
|Automated online backups|Azure Cosmos DB for MongoDB vCore databases are backed up regularly and stored in a geo redundant store. |
|Restore deleted data|The automated online backups can be used to recover data you may have accidentally deleted up to ~7 days after the event. |
|Protect and isolate sensitive data|All data in the regions listed in What's new? is now encrypted at rest.|
|Monitor for attacks|By using audit logging and activity logs, you can monitor your account for normal and abnormal activity. You can view what operations were performed on your resources. This data includes; who initiated the operation, when the operation occurred, the status of the operation, and much more.|
|Respond to attacks|Once you have contacted Azure support to report a potential attack, a five-step incident response process is kicked off. The goal of the five-step process is to restore normal service security and operations. The five-step process restores services as quickly as possible after an issue is detected and an investigation is started.<br><br>Learn more in [Microsoft Azure Security Response in the Cloud](https://azure.microsoft.com/resources/shared-responsibilities-for-cloud-computing/).|
|Protected facilities|Data in Azure Cosmos DB for MongoDB vCore is stored on SSDs in Azure's protected data centers.<br><br>Learn more in [Microsoft global datacenters](https://www.microsoft.com/cloud-platform/global-datacenters)|
|HTTPS/SSL/TLS encryption|Azure Cosmos DB for MongoDB vCore supports TLS levels up to 1.2 (included).<br>It's possible to enforce a minimum TLS level on server-side. |
|Encryption in transit|Encryption (SSL/TLS) is always enforced, and if you attempt to connect to your cluster without encryption, that attempt fails. Only connections via a MongoDB client are accepted and encryption is always enforced. Whenever data is written to Azure Cosmos DB for MongoDB vCore, your data is encrypted in-transit with Transport Layer Security 1.2.|
|Encryption at rest|Azure Cosmos DB for MongoDB vCore uses the FIPS 140-2 validated cryptographic module for storage encryption of data at-rest. Data, including all backups, are encrypted on disk, including the temporary files. The service uses the AES 256-bit cipher included in Azure storage encryption, and the keys are system-managed. Storage encryption is always on, and can't be disabled.|
|Patched servers|Azure Cosmos DB for MongoDB vCore eliminates the need to manage and patch clusters, that's done for you automatically.|
|Administrative accounts with strong passwords|It's hard to believe we even need to mention this requirement, but unlike some of our competitors, it's impossible to have an administrative account with no password in Azure Cosmos DB for MongoDB vCore.<br><br> Security via TLS secret based authentication is baked in by default.|
|Security and data protection certifications| For the most up-to-date list of certifications, see [Azure compliance](https://www.microsoft.com/trustcenter/compliance/complianceofferings) and the latest [Azure compliance document](https://azure.microsoft.com/mediahandler/files/resourcefiles/microsoft-azure-compliance-offerings/Microsoft%20Azure%20Compliance%20Offerings.pdf) with all Azure certifications including Azure Cosmos DB.

The following screenshot shows how you can use audit logging and activity logs to monitor your account: 
:::image type="content" source="./media/database-security/nosql-database-security-application-logging.png" alt-text="Screenshot of activity logs for Azure Cosmos DB.":::

## Network security options

This section outlines various network security options you can configure for your cluster.

### No access

**No Access** is the default option for a newly created cluster if public or private access isn't enabled. In this case, no computers, whether inside or outside of Azure, can connect to the database nodes.

### Public IP access with firewall

In the public access option, a public IP address is assigned to the cluster, and access to the cluster is protected by a firewall.

## Firewall overview

Azure Cosmos DB for MongoDB vCore uses a server-level firewall to prevent all access to your cluster until you specify which computers have permission. The firewall grants access to the cluster based on the originating IP address of each request. To configure your firewall, you create firewall rules that specify ranges of acceptable IP addresses.

Firewall rules enable clients to access your cluster and all the databases within it. Server-level firewall rules can be configured using the Azure portal or programmatically using Azure tools such as the Azure CLI.

By default, the firewall blocks all access to your cluster. To begin using your cluster from another computer, you need to specify one or more server-level firewall rules to enable access to your cluster. Use the firewall rules to specify which IP address ranges from the Internet to allow. Firewall rules don't affect access to the Azure portal website itself. Connection attempts from the internet and Azure must first pass through the firewall before they can reach your databases. In addition to firewall rules, private link access that can be used for a private IP just for the Azure Cosmos DB for MongoDB vCore cluster.

## Next steps

> [!div class="nextstepaction"]
> [Migrate MongoDB data to Azure Cosmos DB for MongoDB vCore](migration-options.md)
