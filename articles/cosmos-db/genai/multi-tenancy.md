---
title: Multi-Tenancy in Azure Cosmos DB
description: Learn concepts for building multi-tenant gen-ai apps in Azure Cosmos DB
author: TheovanKraay
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 06/26/2024
ms.author: thvankra
---

# Multi-Tenancy in Azure Cosmos DB


Multi-tenancy enables a single instance of a database to serve multiple customers, or tenants, simultaneously. This approach efficiently shares infrastructure and operational overhead, resulting in cost savings and simplified management. It's a crucial design consideration for SaaS applications and some internal enterprise solutions.

Multi-tenancy introduces complexity. Your system must scale efficiently to maintain high performance across all tenants, who may have unique workloads, requirements, and SLAs. 

Imagine a fictional AI-assisted research platform called ResearchHub. Serving thousands of companies and individual researchers, ResearchHub manages varying user bases, data scales, and SLAs. Ensuring low query latency and high performance is vital for sustaining an excellent user experience.

Azure Cosmos DB, with its [DiskANN vector index](../index-policy.md#vector-indexes) capability, simplifies multi-tenant design, providing efficient data storage and access mechanisms for high-performance applications.

### Multi-Tenancy Models in Cosmos DB

Azure Cosmos DB offers two primary approaches to managing multi-tenancy: partition key-per-tenant and account-per-tenant, each with its own set of benefits and trade-offs.

#### 1. Partition Key-Per-Tenant

For a higher density of tenants and lower isolation, the partition key-per-tenant model is effective. Each tenant is assigned a unique partition key within a shared Cosmos DB account, allowing logical separation of data.

**Benefits:**
- **Cost Efficiency:** Sharing a single Cosmos DB account across multiple tenants reduces overhead.
- **Scalability:** Can manage a large number of tenants, each isolated within their partition key.
- **Simplified Management:** Fewer Cosmos DB accounts to manage.

**Drawbacks:**
- **Resource Contention:** Shared resources can lead to contention during peak usage.
- **Limited Isolation:** Logical but not physical isolation, which may not meet stringent security needs.

### Hierarchical Partitioning: Enhanced Data Organization

[Hierarchical partitioning](../hierarchical-partition-keys.md) builds on the partition key-per-tenant model, adding deeper levels of data organization. This method involves creating multiple levels of partition keys for more granular data management.

**Advantages:**
- **Optimized Queries:** More precise targeting of sub-partitions at the parent partition level reduces query latency.
- **Improved Scalability:** Facilitates deeper data segmentation for easier scaling.
- **Better Resource Allocation:** Evenly distributes workloads, minimizing bottlenecks.

**Example:**
ResearchHub can stratify data within each tenant’s partition by organizing it at departmental levels, facilitating efficient management and queries.

#### 2. Account-Per-Tenant

For maximum isolation, the account-per-tenant model is preferable. Each tenant gets a dedicated Cosmos DB account, ensuring complete separation of resources.

**Benefits:**
- **High Isolation:** No contention or interference due to dedicated resources.
- **Custom SLAs:** Resources and SLAs can be tailored to individual tenant needs.
- **Enhanced Security:** Physical data isolation ensures robust security.

**Drawbacks:**
- **Increased Management:** Higher complexity in managing multiple Cosmos DB accounts.
- **Higher Costs:** More accounts mean higher infrastructure costs.

### Security Isolation with Customer Managed Keys

Azure Cosmos DB enables [customer-managed keys](../how-to-setup-customer-managed-keys.md) for data encryption, adding an extra layer of security for multi-tenant environments.

**Steps to Implement:**
1. **Set Up Azure Key Vault:** Securely store your encryption keys.
2. **Link to Cosmos DB:** Associate your Key Vault with your Cosmos DB account.
3. **Rotate Keys Regularly:** Enhance security by routinely updating your keys.

Using customer-managed keys ensures each tenant's data is encrypted uniquely, providing robust security and compliance.

### Real-World Implementation Considerations

When designing a multi-tenant system with Cosmos DB, consider these factors:

- **Tenant Workload:** Evaluate data size and activity to select the appropriate isolation model.
- **Performance Requirements:** Align your architecture with defined SLAs and performance metrics.
- **Cost Management:** Balance infrastructure costs against the need for isolation and performance.
- **Scalability:** Plan for growth by choosing scalable models.

### Practical Implementation in Cosmos DB

**Partition Key-Per-Tenant:**
1. **Assign Partition Keys:** Unique keys for each tenant ensure logical separation.
2. **Store Data:** Tenant data is confined to respective partition keys.
3. **Optimize Queries:** Use partition keys for efficient, targeted queries.

**Hierarchical Partitioning:**
1. **Create Multi-Level Keys:** Further organize data within tenant partitions.
2. **Targeted Queries:** Enhance performance with precise sub-partition targeting.
3. **Manage Resources:** Distribute workloads evenly to prevent bottlenecks.

**Account-Per-Tenant:**
1. **Provide Separate Accounts:** Each tenant gets a dedicated Cosmos DB account.
2. **Customize Resources:** Tailor performance and SLAs to tenant requirements.
3. **Ensure Security:** Physical data isolation offers robust security and compliance.

### Best Practices for Using Azure Cosmos DB with Vector Search Capabilities

Azure Cosmos DB's support for DiskANN vector index capability makes it an excellent choice for applications that require fast, high-dimensional searches, such as AI-assisted research platforms like ResearchHub. Here’s how you can leverage these capabilities:

**1. Efficient Storage and Retrieval:**
   - **Vector Indexing:** Use the DiskANN vector index to efficiently store and retrieve high-dimensional vectors. This is particularly useful for applications that involve similarity searches in large datasets, such as image recognition or document similarity.
   - **Performance Optimization:** DiskANN’s vector search capabilities enable quick, accurate searches, ensuring low latency and high performance, which is critical for maintaining a good user experience.

**2. Scaling Across Tenants:**
   - **Partition Key-Per-Tenant:** Utilize partition keys to logically isolate tenant data while benefiting from Cosmos DB’s scalable infrastructure.
   - **Hierarchical Partitioning:** Implement hierarchical partitioning to further segment data within each tenant’s partition, improving query performance and resource distribution.

**3. Security and Compliance:**
   - **Customer Managed Keys:** Implement customer-managed keys for data encryption at rest, ensuring each tenant’s data is securely isolated.
   - **Regular Key Rotation:** Enhance security by regularly rotating encryption keys stored in Azure Key Vault.

### Real-World Example: Implementing ResearchHub

**Partition Key-Per-Tenant:**
1. **Assign Partition Keys:** Each organization (tenant) is assigned a unique partition key.
2. **Data Storage:** All researchers’ data for a tenant is stored within its partition, ensuring logical separation.
3. **Query Optimization:** Queries are executed using the tenant's partition key, enhancing performance by isolating data access.

**Hierarchical Partitioning:**
1. **Multi-Level Partition Keys:** Data within a tenant’s partition is further segmented by department, project, or other relevant attributes.
2. **Granular Data Management:** This hierarchical approach allows ResearchHub to manage and query data more efficiently, reducing latency and improving response times.

**Account-Per-Tenant:**
1. **Separate Cosmos DB Accounts:** High-profile clients or those with sensitive data are provided individual Cosmos DB accounts.
2. **Custom Configurations:** Resources and SLAs are tailored to meet the specific needs of each tenant, ensuring optimal performance and security.
3. **Enhanced Data Security:** Physical separation of data with customer-managed encryption keys ensures robust security compliance.

### Conclusion

Multi-tenancy in Azure Cosmos DB, especially with its DiskANN vector index capability, offers a powerful solution for building scalable, high-performance AI applications. Whether you choose partition key-per-tenant, hierarchical partitioning, or account-per-tenant models, you can effectively balance cost, security, and performance. By leveraging these models and best practices, you can ensure that your multi-tenant application meets the diverse needs of your customers, delivering an exceptional user experience.

We’d love to hear about your experiences and any questions you may have. Azure Cosmos DB offers flexible and scalable solutions for multi-tenancy, and your input can help us all build better systems. Join the forum and share your insights and challenges with us.

Azure Cosmos DB provides the tools necessary to build a robust, secure, and scalable multi-tenant environment. With the power of DiskANN vector indexing, you can deliver fast, high-dimensional searches that drive your AI applications to new heights.

### Next steps

[30-day Free Trial without Azure subscription](https://azure.microsoft.com/try/cosmosdb/)

[90-day Free Trial and up to $6,000 in throughput credits with Azure AI Advantage](../ai-advantage.md)

> [!div class="nextstepaction"]
> [Use the Azure Cosmos DB lifetime free tier](../free-tier.md)

## More vector database solutions
- [Azure PostgreSQL Server pgvector Extension](../../postgresql/flexible-server/how-to-use-pgvector.md)

:::image type="content" source="../media/vector-search/azure-databases-and-ai-search.png" lightbox="../media/vector-search/azure-databases-and-ai-search.png" alt-text="Diagram of Vector indexing services.":::