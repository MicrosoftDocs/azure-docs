---
title: Database security - Azure Cosmos DB
description: Learn how Azure Cosmos DB provides database protection and data security for your data.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/23/2019
ms.author: mjbrown
---

# Security in Azure Cosmos DB - overview

This article discusses database security best practices and key features offered by Azure Cosmos DB to help you prevent, detect, and respond to database breaches.

## What's new in Azure Cosmos DB security

Encryption at rest is now available for documents and backups stored in Azure Cosmos DB in all Azure regions. Encryption at rest is applied automatically for both new and existing customers in these regions. There is no need to configure anything; and you get the same great latency, throughput, availability, and functionality as before with the benefit of knowing your data is safe and secure with encryption at rest.

## How do I secure my database

Data security is a shared responsibility between you, the customer, and your database provider. Depending on the database provider you choose, the amount of responsibility you carry can vary. If you choose an on-premises solution, you need to provide everything from end-point protection to physical security of your hardware - which is no easy task. If you choose a PaaS cloud database provider such as Azure Cosmos DB, your area of concern shrinks considerably. The following image, borrowed from Microsoft's [Shared Responsibilities for Cloud Computing](https://aka.ms/sharedresponsibility) white paper, shows how your responsibility decreases with a PaaS provider like Azure Cosmos DB.

![Customer and database provider responsibilities](./media/database-security/nosql-database-security-responsibilities.png)

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
- HTTPS by default/SSL encryption
- Administrative accounts with strong passwords

## How does Azure Cosmos DB secure my database

Let's look back at the preceding list - how many of those security requirements does Azure Cosmos DB provide? Every single one.

Let's dig into each one in detail.

|Security requirement|Azure Cosmos DB's security approach|
|---|---|
|Network security|Using an IP firewall is the first layer of protection to secure your database. Azure Cosmos DB supports policy driven IP-based access controls for inbound firewall support. The IP-based access controls are similar to the firewall rules used by traditional database systems, but they are expanded so that an Azure Cosmos DB database account is only accessible from an approved set of machines or cloud services. <br><br>Azure Cosmos DB enables you to enable a specific IP address (168.61.48.0), an IP range (168.61.48.0/8), and combinations of IPs and ranges. <br><br>All requests originating from machines outside this allowed list are blocked by Azure Cosmos DB. Requests from approved machines and cloud services then must complete the authentication process to be given access control to the resources.<br><br>Learn more in [Azure Cosmos DB firewall support](firewall-support.md).|
|Authorization|Azure Cosmos DB uses hash-based message authentication code (HMAC) for authorization. <br><br>Each request is hashed using the secret account key, and the subsequent base-64 encoded hash is sent with each call to Azure Cosmos DB. To validate the request, the Azure Cosmos DB service uses the correct secret key and properties to generate a hash, then it compares the value with the one in the request. If the two values match, the operation is authorized successfully and the request is processed, otherwise there is an authorization failure and the request is rejected.<br><br>You can use either a [master key](secure-access-to-data.md#master-keys), or a [resource token](secure-access-to-data.md#resource-tokens) allowing fine-grained access to a resource such as a document.<br><br>Learn more in [Securing access to Azure Cosmos DB resources](secure-access-to-data.md).|
|Users and permissions|Using the master key for the account, you can create user resources and permission resources per database. A resource token is associated with a permission in a database and determines whether the user has access (read-write, read-only, or no access) to an application resource in the database. Application resources include container, documents, attachments, stored procedures, triggers, and UDFs. The resource token is then used during authentication to provide or deny access to the resource.<br><br>Learn more in [Securing access to Azure Cosmos DB resources](secure-access-to-data.md).|
|Active directory integration (RBAC)| You can also provide or restrict access to the Cosmos account, database, container, and offers (throughput) using Access control (IAM) in the Azure portal. IAM provides role-based access control and integrates with Active Directory. You can use built in roles or custom roles for individuals and groups. See [Active Directory integration](role-based-access-control.md) article for more information.|
|Global replication|Azure Cosmos DB offers turnkey global distribution, which enables you to replicate your data to any one of Azure's world-wide datacenters with the click of a button. Global replication lets you scale globally and provide low-latency access to your data around the world.<br><br>In the context of security, global replication ensures data protection against regional failures.<br><br>Learn more in [Distribute data globally](distribute-data-globally.md).|
|Regional failovers|If you have replicated your data in more than one data center, Azure Cosmos DB automatically rolls over your operations should a regional data center go offline. You can create a prioritized list of failover regions using the regions in which your data is replicated. <br><br>Learn more in [Regional Failovers in Azure Cosmos DB](high-availability.md).|
|Local replication|Even within a single data center, Azure Cosmos DB automatically replicates data for high availability giving you the choice of [consistency levels](consistency-levels.md). This replication guarantees a 99.99% [availability SLA](https://azure.microsoft.com/support/legal/sla/cosmos-db) for all single region accounts and all multi-region accounts with relaxed consistency, and 99.999% read availability on all multi-region database accounts.|
|Automated online backups|Azure Cosmos DB databases are backed up regularly and stored in a geo redundant store. <br><br>Learn more in [Automatic online backup and restore with Azure Cosmos DB](online-backup-and-restore.md).|
|Restore deleted data|The automated online backups can be used to recover data you may have accidentally deleted up to ~30 days after the event. <br><br>Learn more in [Automatic online backup and restore with Azure Cosmos DB](online-backup-and-restore.md)|
|Protect and isolate sensitive data|All data in the regions listed in What's new? is now encrypted at rest.<br><br>Personal data and other confidential data can be isolated to specific container and read-write, or read-only access can be limited to specific users.|
|Monitor for attacks|By using [audit logging and activity logs](logging.md), you can monitor your account for normal and abnormal activity. You can view what operations were performed on your resources, who initiated the operation, when the operation occurred, the status of the operation, and much more as shown in the screenshot following this table.|
|Respond to attacks|Once you have contacted Azure support to report a potential attack, a 5-step incident response process is kicked off. The goal of the 5-step process is to restore normal service security and operations as quickly as possible after an issue is detected and an investigation is started.<br><br>Learn more in [Microsoft Azure Security Response in the Cloud](https://aka.ms/securityresponsepaper).|
|Geo-fencing|Azure Cosmos DB ensures data governance for sovereign regions (for example, Germany, China, US Gov).|
|Protected facilities|Data in Azure Cosmos DB is stored on SSDs in Azure's protected data centers.<br><br>Learn more in [Microsoft global datacenters](https://www.microsoft.com/en-us/cloud-platform/global-datacenters)|
|HTTPS/SSL/TLS encryption|All client-to-service Azure Cosmos DB interactions are SSL/TLS 1.2 capable. Also, all intra datacenter and cross datacenter replications are SSL/TLS 1.2 enforced.|
|Encryption at rest|All data stored into Azure Cosmos DB is encrypted at rest. Learn more in [Azure Cosmos DB encryption at rest](./database-encryption-at-rest.md)|
|Patched servers|As a managed database, Azure Cosmos DB eliminates the need to manage and patch servers, that's done for you, automatically.|
|Administrative accounts with strong passwords|It's hard to believe we even need to mention this requirement, but unlike some of our competitors, it's impossible to have an administrative account with no password in Azure Cosmos DB.<br><br> Security via SSL and HMAC secret based authentication is baked in by default.|
|Security and data protection certifications| For the most up-to-date list of certifications see the overall [Azure Compliance site](https://www.microsoft.com/en-us/trustcenter/compliance/complianceofferings) as well as the latest [Azure Compliance Document](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942) with all certifications (search for Cosmos). For a more focused read check out the April 25, 2018 post [Azure #CosmosDB: Secure, private, compliant that includes SOCS 1/2 Type 2, HITRUST, PCI DSS Level 1, ISO 27001, HIPAA, FedRAMP High, and many others.

The following screenshot shows how you can use audit logging and activity logs to monitor your account: 
![Activity logs for Azure Cosmos DB](./media/database-security/nosql-database-security-application-logging.png)

## Next steps

For more information about master keys and resource tokens, see [Securing access to Azure Cosmos DB data](secure-access-to-data.md).

For more information about audit logging, see [Azure Cosmos DB diagnostic logging](logging.md).

For more information about Microsoft certifications, see [Azure Trust Center](https://azure.microsoft.com/support/trust-center/).