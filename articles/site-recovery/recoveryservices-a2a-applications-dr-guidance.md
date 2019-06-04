<properties
    pageTitle="Site Recovery (Azure to Azure)/applications dr guidance"
    description="Site Recovery (Azure to Azure)/applications dr guidance"
    service="microsoft.recoveryservices"
    resource="vaults"
    authors="asgang, v-miegge"
    ms.author="asgang"
    displayOrder=""
    selfHelpType="generic"
    supportTopicIds="32642152"
    resourceTags=""
    productPesIds="16370"
    cloudEnvironments="public"
    articleId="8fe18e11-118c-49e6-a8c0-3e4ef4059080"
/>

# Advisory Questions - Azure to Azure

**Note**: Azure to Azure does not support migration of Azure VMs between the same region.

## **Recommended Documents**

Summary of [applications that can be protected through site recovery](https://docs.microsoft.com/azure/site-recovery/site-recovery-workload#workload-summary)

How to protect:

* [Active directory & DNS servers](https://docs.microsoft.com/azure/site-recovery/site-recovery-workload#replicate-active-directory-and-dns)<br>
* [SQL server](https://docs.microsoft.com/azure/site-recovery/site-recovery-sql)<br>
* [SharePoint](https://docs.microsoft.com/azure/site-recovery/site-recovery-sharepoint)<br>
* [Remote Desktop Services(RDS)](https://docs.microsoft.com/azure/site-recovery/site-recovery-workload#protect-rds)<br>
* [SAP](https://docs.microsoft.com/azure/site-recovery/site-recovery-sap)<br>
* [IIS based web applications](https://docs.microsoft.com/azure/site-recovery/site-recovery-iis)<br>
* [File Server](https://docs.microsoft.com/azure/site-recovery/file-server-disaster-recovery)<br>
* [Storage Spaces Direct cluster](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-how-to-enable-replication-s2d-vms)

### **Replicate IaaS VMs from one Azure region to another Azure region**

* [Review the architecture for Azure VM replication between Azure regions](https://docs.microsoft.com/azure/site-recovery/concepts-azure-to-azure-architecture)<br>
* [Refer to the most frequently asked questions before filing a support case](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-common-questions)<br>
* [What are the supported and not supported configurations for Azure to Azure replication?](https://docs.microsoft.com/azure/site-recovery/site-recovery-support-matrix-azure-to-azure)<br>
* [What are the prerequisites for Azure to Azure replication?](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-walkthrough-prerequisites)<br>
* [How do I find the RTO?](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-common-questions#how-can-i-find-the-rto-of-a-recovery-plan)<br>
* [Pricing - What charges do I incur while using Azure Site Recovery?](https://azure.microsoft.com/blog/know-exactly-how-much-it-will-cost-for-enabling-dr-to-your-azure-vm/)
