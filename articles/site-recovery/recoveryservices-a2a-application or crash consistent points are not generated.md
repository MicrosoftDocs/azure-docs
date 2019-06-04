<properties
    pageTitle="A2A application or crash consistent points not generating"
    description="A2A application or crash consistent points not generating"
    service="microsoft.recoveryservices"
    resource="vaults"
    authors="asgang, v-miegge"
    displayOrder=""
    selfHelpType="generic"
    supportTopicIds="32642154"
    resourceTags=""
    productPesIds="16370"
    cloudEnvironments="public"
    articleId="888f95ec-1f22-4acd-896c-d48d8c602b35"
/>

# Recovery points not generating in Azure to Azure (A2A) scenario

## **Recommended steps**

### Application points not generating

* [Troubleshoot common application consistent points not generating issues](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-troubleshoot-replication#error-id-153006---no-app-consistent-recovery-point-available-for-the-vm-in-the-last-xxx-minutes)<br>
* [**Fix** - Application consistent points are not generating for **SQL 2008/ 2008 R2**](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-troubleshoot-replication#cause-1-known-issue-on-sql-server-20082008-r2)<br>
* [**Fix** - Application consistent points are not generating for **any SQL version with AUTO_CLOSE DBs**](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-troubleshoot-replication#cause-2-azure-site-recovery-jobs-fail-on-servers-hosting-any-version-of-sql-server-instances-with-auto_close-dbs)<br>
* [Application consistent points are not generating for VMs having Storage Spaces Direct](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-troubleshoot-replication#cause-3-you-are-using-storage-spaces-direct-configuration)<br>
* [Troubleshoot Application consistent points not generating due to VSS issues](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-troubleshoot-replication#more-causes-due-to-vss-related-issues)

### Crash consistent points not generating 

* [Understand and resolve high data change rate/churn issue on the source virtual machine](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-troubleshoot-replication#high-data-change-rate-on-the-source-virtal-machine)<br>
* [Troubleshoot COM+/Volume Shadow Copy service error (error code 151025)](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-troubleshoot-errors#comvolume-shadow-copy-service-error-error-code-151025)<br>
* [Check outbound connectivity to Site Recovery URLs or IP ranges from the VM](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-troubleshoot-errors?#outbound-connectivity-for-site-recovery-urls-or-ip-ranges-error-code-151037-or-151072)

## **Recommended documents**

* [Steps to configure outbound network connectivity](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-enable-replication#configure-outbound-network-connectivity)<br>
* Review the [**Support Requirements**](https://docs.microsoft.com/azure/site-recovery/site-recovery-support-matrix-azure-to-azure) for all components <br>
* [Steps to **enable replication** for Azure VMs](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-walkthrough-enable-replication)<br>
* [**Networking guidance** for replicating Azure virtual machines](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-walkthrough-network)<br>
* Understand the [scenario architecture and components](https://docs.microsoft.com/azure/site-recovery/concepts-azure-to-azure-architecture)
