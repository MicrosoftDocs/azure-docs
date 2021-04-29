---
title: Azure Government isolation guidelines for Impact Level 5 
description: Guidance for configuring Azure Government services for DoD Impact Level 5 workloads
services: azure-government
cloud: gov
documentationcenter: ''

ms.service: azure-government
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 04/14/2021
ms.custom: references_regions
#Customer intent: As a DoD mission owner, I want to know how to implement a workload at Impact Level 5 in Microsoft Azure Government.
---
# Isolation guidelines for Impact Level 5 workloads

Azure Government supports applications that use Impact Level 5 (IL5) data in all available regions. IL5 requirements are defined in the [US Department of Defense (DoD) Cloud Computing Security Requirements Guide (SRG)](https://dl.dod.cyber.mil/wp-content/uploads/cloud/SRG/index.html#3INFORMATIONSECURITYOBJECTIVES/IMPACTLEVELS). IL5 workloads have a higher degree of impact to the DoD and must be secured to a higher standard. When you deploy these workloads on Azure Government, you can meet their isolation requirements in various ways. The guidance in this document addresses configurations and settings needed to meet the IL5 isolation requirements. We'll update this document as we enable new isolation options and the Defense Information Systems Agency (DISA) authorizes new services for IL5 data.

## Background

In January 2017, DISA awarded the IL5 Provisional Authorization (PA) to [Azure Government](https://azure.microsoft.com/global-infrastructure/government/get-started/), making it the first IL5 PA awarded to a hyperscale cloud provider. The PA covered two Azure Government regions (US DoD Central and US DoD East) that are [dedicated to the DoD](https://azure.microsoft.com/global-infrastructure/government/dod/). Based on DoD mission owner feedback and evolving security capabilities, Microsoft has partnered with DISA to expand the IL5 PA boundary in December 2018 to cover the remaining Azure Government regions: US Gov Arizona, US Gov Texas, and US Gov Virginia. For service availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia). For a list of services in scope for DoD IL5 PA, see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope).

Azure Government is available to US federal, state, local, and tribal governments and their partners. The IL5 expansion to Azure Government honors the isolation requirements mandated by the DoD. Azure Government continues to provide more PaaS services suitable for DoD IL5 workloads than any other cloud services environment.

## Principles and approach

You need to address two key areas for Azure services in IL5 scope: storage isolation and compute isolation. We'll focus in this article on how Azure services can help isolate the compute and storage of IL5 data. The SRG allows for a shared management and network infrastructure. **This article is focused on Azure Government compute and storage isolation approaches for US Gov Arizona, US Gov Texas, and US Gov Virginia regions.** If an Azure service is available in Azure Government DoD regions and authorized at IL5, then it is by default suitable for IL5 workloads with no extra isolation configuration required. Azure Government DoD regions are reserved for DoD agencies and their partners, enabling physical separation from non-DoD tenants by design.

> [!IMPORTANT]
> You are responsible for designing and deploying your applications to meet DoD IL5 compliance requirements. In doing so, you should not include sensitive or restricted information in Azure resource names, as explained in **[Considerations for naming Azure resources](./documentation-government-concept-naming-resources.md).**

### Compute isolation

IL5 separation requirements are stated in the SRG [Section 5.2.2.3](https://dl.dod.cyber.mil/wp-content/uploads/cloud/SRG/index.html#5.2LegalConsiderations). The SRG focuses on compute separation during "processing" of IL5 data. This separation ensures that a virtual machine that could potentially compromise the physical host can't affect a DoD workload. To remove the risk of runtime attacks and ensure long running workloads aren't compromised from other workloads on the same host, all IL5 virtual machines should be isolated via [Azure Dedicated Host](https://azure.microsoft.com/services/virtual-machines/dedicated-host/). Doing so provides a dedicated physical server to host your Azure Virtual Machines (VMs) for Windows and Linux.

For services where the compute processes are obfuscated from access by the owner and stateless in their processing of data, you should accomplish isolation by focusing on the data being processed and how it's stored and retained. This approach ensures the data is stored in protected mediums. It also ensures the data isn't present on these services for extended periods unless it's encrypted as needed.

### Storage isolation

In a recent PA for Azure Government, DISA approved logical separation of IL5 from other data via cryptographic means. In Azure, this approach involves data encryption via keys that are maintained in Azure Key Vault and stored in FIPS 140-2 validated Hardware Security Modules (HSMs). The keys are owned and managed by the IL5 system owner (also known as customer-managed keys).

Here's how this approach applies to services:

- If a service hosts only IL5 data, the service can control the key for end users. But it must use a dedicated key to protect IL5 data from all other data in the cloud.
- If a service will host IL5 and non-DoD data, the service must expose the option for end users to use their own encryption keys that are maintained in Azure Key Vault. This implementation gives consumers of the service the ability to implement cryptographic separation as needed.

This approach ensures all key material for decrypting data is stored separately from the data itself using a hardware-based key management solution.

The DoD requirements for encrypting data at rest are provided in the SRG [Section 5.11](https://dl.dod.cyber.mil/wp-content/uploads/cloud/SRG/index.html#5.11EncryptionofData-at-RestinCommercialCloudStorage). DoD emphasizes encrypting all data at rest stored in virtual machine virtual hard drives, mass storage facilities at the block or file level, and database records where the mission owner does not have sole control over the database service. For cloud applications where encrypting data at rest with DoD key control is not possible, mission owners must perform a risk analysis with relevant data owners before transmitting data into a cloud service offering.

## Applying this guidance

IL5 guidelines require workloads to be deployed with a high degree of security, isolation, and control. The following configurations are required *in addition* to any other configurations or controls needed to meet IL5 requirements. Network isolation, access controls, and other necessary security measures aren't necessarily addressed in this article.

Be sure to review the entry for each service you're using and ensure that all isolation requirements are implemented.

## AI + machine learning

For AI and machine learning services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=project-bonsai,genomics,search,bot-service,databricks,machine-learning-service,cognitive-services&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure Bot Services](https://azure.microsoft.com/services/bot-services/)

Azure Bot Services supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Cognitive Search](https://azure.microsoft.com/services/search/)

Azure Cognitive Search supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Azure Cognitive Search by [using customer-managed keys in Azure Key Vault](../search/search-security-manage-encryption-keys.md).

### [Azure Machine Learning](https://azure.microsoft.com/services/machine-learning/)

Azure Machine Learning supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Azure Machine Learning by using customer-managed keys in Azure Key Vault. Azure Machine Learning stores snapshots, output, and logs in the Azure Blob Storage account that's associated with the Azure Machine Learning workspace and customer subscription. All the data stored in Azure Blob Storage is [encrypted at rest with Microsoft-managed keys](../machine-learning/concept-enterprise-security.md). Customers can use their own keys for data stored in Azure Blob Storage. See [Configure encryption with customer-managed keys stored in Azure Key Vault](../storage/common/customer-managed-keys-configure-key-vault.md).

### [Cognitive Services: Computer Vision](https://azure.microsoft.com/services/cognitive-services/computer-vision/) 

Computer Vision supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Cognitive Services: Content Moderator](https://azure.microsoft.com/services/cognitive-services/content-moderator/)

The Azure Cognitive Services Content Moderator service supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in the Content Moderator service by [using customer-managed keys in Azure Key Vault](../cognitive-services/content-moderator/encrypt-data-at-rest.md).

### [Cognitive Services: Custom Vision](https://azure.microsoft.com/services/cognitive-services/custom-vision-service/)

Custom Vision supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Cognitive Services Custom Vision [using customer-managed keys in Azure Key Vault](../cognitive-services/custom-vision-service/encrypt-data-at-rest.md#customer-managed-keys-with-azure-key-vault)

### [Cognitive Services: Face](https://azure.microsoft.com/services/cognitive-services/face/)

The Cognitive Services Face service supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in the Face service by [using customer-managed keys in Azure Key Vault](../cognitive-services/face/encrypt-data-at-rest.md).

### [Cognitive Services: Language Understanding](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/)

The Cognitive Services Language Understanding service supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in the Language Understanding service by [using customer-managed keys in Azure Key Vault](../cognitive-services/luis/encrypt-data-at-rest.md).

### [Cognitive Services: Personalizer](https://azure.microsoft.com/services/cognitive-services/personalizer/)

Personalizer supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Cognitive Services Personalizer [using customer-managed keys in Azure Key Vault](../cognitive-services/personalizer/encrypt-data-at-rest.md)

### [Cognitive Services: QnA Maker](https://azure.microsoft.com/services/cognitive-services/qna-maker/)

Cognitive Services QnA Maker supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Cognitive Services QnA Maker [using customer-managed keys in Azure Key Vault](../cognitive-services/qnamaker/encrypt-data-at-rest.md)

### [Cognitive Services: Text Analytics](https://azure.microsoft.com/services/cognitive-services/text-analytics/)

The Cognitive Services Text Analytics service supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Cognitive Services: Translator](https://azure.microsoft.com/services/cognitive-services/translator/)

The Cognitive Services Translator service supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in the Translator service by [using customer-managed keys in Azure Key Vault](../cognitive-services/translator/encrypt-data-at-rest.md).

### [Cognitive Services: Speech Services](https://azure.microsoft.com/services/cognitive-services/speech-services/)

Cognitive Services Speech Services supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Speech Services by [using customer-managed keys in Azure Key Vault](../cognitive-services/speech-service/speech-encryption-of-data-at-rest.md).

## Analytics

For Analytics services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=data-share,power-bi-embedded,analysis-services,event-hubs,data-lake-analytics,storage,data-catalog,monitor,data-factory,synapse-analytics,stream-analytics,databricks,hdinsight&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure Analysis Services](https://azure.microsoft.com/services/analysis-services/)

Azure Analysis Services supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Databricks](https://azure.microsoft.com/services/databricks/)

Azure Databricks supports Impact Level 5 workloads in Azure Government with this configuration:

- Azure Databricks can be deployed to existing storage accounts that have enabled appropriate [Storage Encryption with Key Vault Managed Keys](#storage-encryption-with-key-vault-managed-keys).
- Use [Isolated Virtual Machines](../security/fundamentals/isolation-choices.md#isolated-virtual-machine-sizes) as the 'Worker Type' when launching Azure Databricks clusters. When deployed, Isolated VM types consume the entire physical host for that VM providing the necessary level of isolation required to support IL5 workloads.
- Configure Customer-Managed Keys (CMK) for your [Azure Databricks Workspace](/azure/databricks/security/keys/customer-managed-key-notebook) and [Databricks File System](/azure/databricks/security/keys/customer-managed-keys-dbfs/) (DBFS). 

### [Azure Data Share](https://azure.microsoft.com/services/data-share/) 

Azure Data Share supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Data Explorer](https://azure.microsoft.com/services/data-explorer/)

Azure Data Explorer supports Impact Level 5 workloads in Azure Government with this configuration:

- Data in Azure Data Explorer clusters in Azure is secured and encrypted with Microsoft-managed keys by default. For extra control over encryption keys, you can supply customer-managed keys to use for data encryption and manage [encryption of your data](/azure/data-explorer/security#data-encryption) at the storage level with your own keys.

### [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/)

Azure Stream Analytics supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Azure Stream Analytics by [using customer-managed keys in Azure Key Vault](../stream-analytics/data-protection.md).

### [Azure Synapse Analytics](https://azure.microsoft.com/services/synapse-analytics/)

Azure Synapse Analytics supports Impact Level 5 workloads in Azure Government with this configuration:

- Add transparent data encryption with customer-managed keys via Azure Key Vault. For more information, see [Azure SQL transparent data encryption](../azure-sql/database/transparent-data-encryption-byok-overview.md).

   > [!NOTE]
   > The instructions to enable this configuration are the same as the instructions to do so for Azure SQL Database.

### [Data Factory](https://azure.microsoft.com/services/data-factory/)

Azure Data Factory supports Impact Level 5 workloads in Azure Government with this configuration:

- Secure data store credentials by storing encrypted credentials in a Data Factory managed store. Data Factory helps protect your data store credentials by encrypting them with certificates managed by Microsoft. For more information about Azure Storage security, see [Azure Storage security overview](../storage/common/security-baseline.md). You can also store the data store's credentials in Azure Key Vault. Data Factory retrieves the credentials during the execution of an activity. For more information, see [Store credentials in Azure Key Vault](../data-factory/store-credentials-in-key-vault.md).

### [Event Hubs](https://azure.microsoft.com/services/event-hubs/)

Azure Event Hubs supports Impact Level 5 workloads in Azure Government.

> [!IMPORTANT]
> Use client-side encryption to encrypt data before using Azure Event Hubs in Azure Government regions US Gov Arizona, US Gov Texas, and US Gov Virginia.

### [HDInsight](https://azure.microsoft.com/services/hdinsight/)

Azure HDInsight supports Impact Level 5 workloads in Azure Government with these configurations:

- Azure HDInsight can be deployed to existing storage accounts that have enabled appropriate [Storage service encryption](#storage-encryption-with-key-vault-managed-keys), as discussed in the guidance for Azure Storage.
- Azure HDInsight enables a database option for certain configurations. Ensure the appropriate database configuration for TDE is enabled on the option you choose. This process is discussed in the guidance for [Azure SQL Database](#azure-sql-database).

### [Power Automate](https://flow.microsoft.com/)

Power Automate (formerly Microsoft Flow) supports Impact Level 5 workloads in Azure Government with no extra configuration required. It is available and [authorized at IL5](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope) in Azure Government regions.

### [Power BI Embedded](https://azure.microsoft.com/services/power-bi-embedded/)

Power BI Embedded supports Impact Level 5 workloads in Azure Government with no extra configuration required.

## Compute

For Compute services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=spring-cloud,azure-vmware,cloud-services,batch,app-service,service-fabric,functions,virtual-machine-scale-sets,virtual-machines&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure Functions](https://azure.microsoft.com/services/functions/)

Azure Functions supports Impact Level 5 workloads in Azure Government with this configuration:

- To accommodate proper network and workload isolation, deploy your Azure functions on App Service plans configured to use the Isolated SKU. For more information, see the [App Service plan documentation](../app-service/overview-hosting-plans.md).

### [Batch](https://azure.microsoft.com/services/batch/)

Azure Batch supports Impact Level 5 workloads in Azure Government with this configuration:

- Enable user subscription mode, which will require a Key Vault instance for proper encryption and key storage. For more information, see the documentation on [batch account configurations](../batch/batch-account-create-portal.md).

### [Cloud Services](https://azure.microsoft.com/services/cloud-services/) 

Azure Cloud Services supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Service Fabric](https://azure.microsoft.com/services/service-fabric/)

Azure Service Fabric supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Virtual Machines](https://azure.microsoft.com/services/virtual-machines/) and [virtual machine scale sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/)

You can use Azure virtual machines with multiple deployment mediums. You can do so for single virtual machines and for virtual machines deployed via the Azure virtual machine scale sets feature.

All virtual machines should use Disk Encryption for virtual machines or Disk Encryption for virtual machine scale sets, or place virtual machine disks in a storage account that can hold Impact Level 5 data as described in the [Azure Storage section](#storage-encryption-with-key-vault-managed-keys).

> [!IMPORTANT]
> When you deploy VMs in Azure Government regions US Gov Arizona, US Gov Texas, and US Gov Virginia, you must use Azure Dedicated Host, as described in the next section.

#### [Azure Dedicated Host](https://azure.microsoft.com/services/virtual-machines/dedicated-host/)

Azure Dedicated Host provides physical servers that can host one or more virtual machines and that are dedicated to one Azure subscription. Dedicated hosts are the same physical servers used in our datacenters, provided as a resource. You can provision dedicated hosts within a region, Availability Zone, and fault domain. You can then place VMs directly into your provisioned hosts, in whatever configuration meets your needs.

These VMs provide the necessary level of isolation required to support IL5 workloads when deployed outside of the dedicated DoD regions. When you use Dedicated Host, your Azure VMs are placed on an isolated and dedicated physical server that runs only your organization’s workloads to meet compliance guidelines and standards.

Current Dedicated Host SKUs (VM series and Host Type) that offer the required compute isolation include SKUs in the VM families listed on the [Dedicated Host pricing page](https://azure.microsoft.com/pricing/details/virtual-machines/dedicated-host/).

#### Isolated virtual machines

Virtual machine scale sets aren't currently supported on Azure Dedicated Host. But specific VM types, when deployed, consume the entire physical host for the VM. Each of the following VM types can be deployed via virtual machine scale sets to provide proper compute isolation with all the benefits of virtual machine scale sets in place. When you configure your scale set, select the appropriate SKU. To encrypt the data at rest, see the next section for supportable encryption options.

Current VM SKUs that offer the required compute isolation include SKUs in these VM families:

| **VM family** | **VM SKU** |
| --- | --- |
| D-Series (general purpose) | Standard\_DS15\_v2Standard\_D15\_v2 |
| Memory optimized | Standard\_E64is\_v3Standard\_E64i\_v3 |
| Compute optimized | Standard\_F72s\_v2 |
| Large memory optimized | Standard\_M128ms |
| GPU-enabled | Standard\_NV24 |

> [!IMPORTANT]
> As new hardware generations become available, some VM types might require reconfiguration (scale up or migration to a new VM SKU) to ensure they remain on properly dedicated hardware. This document will be updated to reflect any changes.

#### Disk Encryption for virtual machines

You can encrypt the storage that supports these virtual machines in one of two ways to support necessary encryption standards.

- Use Azure Disk Encryption to encrypt the drives by using dm-crypt (Linux) or BitLocker (Windows):
  - [Enable Azure Disk Encryption for Linux](../virtual-machines/linux/disk-encryption-overview.md)
  - [Enable Azure Disk Encryption for Windows](../virtual-machines/windows/disk-encryption-overview.md)
- Use Azure Storage service encryption for storage accounts with your own key to encrypt the storage account that holds the disks:
  - [Storage service encryption with customer-managed keys](../storage/common/customer-managed-keys-configure-key-vault.md)

#### Disk Encryption for virtual machine scale sets

You can encrypt disks that support virtual machine scale sets by using Azure Disk Encryption:

- [Encrypt disks in virtual machine scale sets](../virtual-machine-scale-sets/disk-encryption-powershell.md)

## Containers

For Containers services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=openshift,app-service-linux,container-registry,service-fabric,container-instances,kubernetes-service&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure Kubernetes Service](https://azure.microsoft.com/services/kubernetes-service/)

Azure Kubernetes Service (AKS) supports Impact Level 5 workloads in Azure Government with these configurations:

- Configure encryption at rest of content in AKS by [using customer-managed keys in Azure Key Vault](../aks/azure-disk-customer-managed-keys.md).
- For workloads that require isolation from other customer workloads, you can use [Isolated virtual machines](../aks/concepts-security.md#compute-isolation) as the agent nodes in an AKS cluster. 

### [Container Instances](https://azure.microsoft.com/services/container-instances/)

Azure Container Instances supports Impact Level 5 workloads in Azure Government with this configuration:

- Azure Container Instances automatically encrypts data related to your containers when it's persisted in the cloud. Data in Container Instances is encrypted and decrypted with 256-bit AES encryption and enabled for all Container Instances deployments. You can rely on Microsoft-managed keys for the encryption of your container data, or you can manage the encryption by using your own keys. For more information, see [Encrypt deployment data](../container-instances/container-instances-encrypt-data.md). 

The Container Instances Dedicated SKU provides an [isolated and dedicated compute environment](../container-instances/container-instances-dedicated-hosts.md) for running containers with increased security. When you use the Dedicated SKU, each container group has a dedicated physical server in an Azure datacenter.

### [Container Registry](https://azure.microsoft.com/services/container-registry/) 

Azure Container Registry supports Impact Level 5 workloads in Azure Government with this configuration:

- When you store images and other artifacts in a Container Registry, Azure automatically encrypts the registry content at rest by using service-managed keys. You can supplement the default encryption with an additional encryption layer by [using a key that you create and manage in Azure Key Vault](../container-registry/container-registry-customer-managed-keys.md).

## Databases

For Databases services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-sql,sql-server-stretch-database,redis-cache,database-migration,postgresql,mariadb,mysql,sql-database,cosmos-db&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure API for FHIR](https://azure.microsoft.com/services/azure-api-for-fhir/)

Azure API for FHIR supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Azure API for FHIR [using customer-managed keys in Azure Key Vault](../healthcare-apis/fhir/customer-managed-key.md)

### [Azure Cache for Redis](https://azure.microsoft.com/services/cache/)

Azure Cache for Redis supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/)

Azure Cosmos DB supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Database for MySQL](https://azure.microsoft.com/services/mysql/) 

Azure Database for MySQL supports Impact Level 5 workloads in Azure Government with this configuration:

- Data encryption with customer-managed keys for Azure Database for MySQL enables you to bring your own key (BYOK) for data protection at rest. This encryption is set at the server level. For a given server, a customer-managed key, called the key encryption key (KEK), is used to encrypt the data encryption key (DEK) used by the service. For more information, see [Azure Database for MySQL data encryption with a customer-managed key](../mysql/concepts-data-encryption-mysql.md).

### [Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/) 

Azure Database for PostgreSQL supports Impact Level 5 workloads in Azure Government with this configuration:

- Data encryption with customer-managed keys for Azure Database for PostgreSQL Single Server is set at the server level. For a given server, a customer-managed key, called the key encryption key (KEK), is used to encrypt the data encryption key (DEK) used by the service. For more information, see [Azure Database for PostgreSQL Single Server data encryption with a customer-managed key](../postgresql/concepts-data-encryption-postgresql.md).

### [Azure SQL Database](https://azure.microsoft.com/services/sql-database/)

Azure SQL Database supports Impact Level 5 workloads in Azure Government with this configuration:

- Add transparent data encryption with customer-managed keys via Azure Key Vault. For more information, see the [Azure SQL documentation](../azure-sql/database/transparent-data-encryption-byok-overview.md).

### [SQL Server Stretch Database](https://azure.microsoft.com/services/sql-server-stretch-database/)

SQL Server Stretch Database supports Impact Level 5 workloads in Azure Government with this configuration:

- Add transparent data encryption with customer-managed keys via Azure Key Vault. For more information, see [Azure SQL transparent data encryption](../azure-sql/database/transparent-data-encryption-byok-overview.md).

## Developer tools

For Developer tools availability in Azure Government, see [Products available by region](https://azure.microsoft.com/en-us/global-infrastructure/services/?products=app-configuration,devtest-lab,lab-services,azure-devops&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure DevTest Labs](https://azure.microsoft.com/services/devtest-lab/)

Azure DevTest Labs supports Impact Level 5 workloads in Azure Government with no extra configuration required.

## Hybrid

### [Azure Stack Edge](https://azure.microsoft.com/products/azure-stack/edge/)

Azure Stack Edge supports Impact Level 5 workloads in Azure Government with this configuration:

- You can protect data at rest via storage accounts because your device is associated with a storage account that's used as a destination for your data in Azure. You can configure your storage account to use data encryption with customer-managed keys stored in Azure Key Vault. For more information, see [Protect data in storage accounts](../databox-online/azure-stack-edge-pro-r-security.md#protect-data-in-storage-accounts).

## Identity

For Identity services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/en-us/global-infrastructure/services/?products=information-protection,active-directory-ds,active-directory&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure Active Directory](https://azure.microsoft.com/services/active-directory/)

Azure Active Directory supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Active Directory Domain Services](https://azure.microsoft.com/services/active-directory-ds/)

Azure Active Directory Domain Services supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Multifactor authentication](../active-directory/authentication/concept-mfa-howitworks.md) 

Multifactor authentication supports Impact Level 5 workloads in Azure Government with no extra configuration required.

## Integration

For Integration services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=event-grid,api-management,service-bus,logic-apps&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [API Management](https://azure.microsoft.com/services/api-management/)

Azure API Management supports Impact Level 5 workloads in Azure Government with no extra configuration required.

<a name="logic-apps"></a>

### [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/)

Azure Logic Apps supports Impact Level 5 workloads in Azure Government. To meet these requirements, Logic Apps supports the capability for you to create and run workflows in an environment with dedicated resources so that you can avoid sharing computing resources with other tenants. For more information, see [Secure access and data in Azure Logic Apps: Isolation guidance](../logic-apps/logic-apps-securing-a-logic-app.md#isolation-logic-apps).

### [Event Grid](https://azure.microsoft.com/services/event-grid/)

Azure Event Grid can persist customer content for no more than 24 hours. For more information, see [Authenticate event delivery to event handlers](../event-grid/security-authentication.md).  All data written to disk is encrypted with Microsoft-managed keys. 

Azure Event Grid supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Service Bus](https://azure.microsoft.com/services/service-bus/)

Azure Service Bus supports Impact Level 5 workloads in Azure Government.

> [!IMPORTANT]
> Use client-side encryption to encrypt data before using Azure Service Bus in Azure Government regions US Gov Arizona, US Gov Texas, and US Gov Virginia.

## Internet of Things

For Internet of Things services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=notification-hubs,azure-rtos,azure-maps,iot-central,iot-hub&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/)

Azure IoT Hub supports Impact Level 5 workloads in Azure Government with this configuration:

- IoT Hub supports encryption of data at rest with customer-managed keys, also known as "bring your own key" (BYOK). Azure IoT Hub provides encryption of data at rest and in transit. By default, Azure IoT Hub uses Microsoft-managed keys to encrypt the data. Customer-managed key support enables customers to encrypt data at rest by using an [encryption key that they manage via Azure Key Vault](../iot-hub/iot-hub-customer-managed-keys.md).

### [Notification Hubs](https://azure.microsoft.com/services/notification-hubs/) 

Azure Notification Hubs supports Impact Level 5 workloads in Azure Government with no extra configuration required.

## Management and governance

For Management and governance services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/en-us/global-infrastructure/services/?products=azure-automanage,resource-mover,azure-portal,azure-lighthouse,cloud-shell,managed-applications,azure-policy,monitor,automation,scheduler,site-recovery,cost-management,backup,blueprints,advisor&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Automation](https://azure.microsoft.com/services/automation/)

Automation supports Impact Level 5 workloads in Azure Government with these configurations:

- Use the [Hybrid Runbook Worker](../automation/automation-hybrid-runbook-worker.md) feature of Azure Automation to run runbooks directly on the VM that's hosting the role and against resources in your environment. Runbooks are stored and managed in Azure Automation. They are then delivered to one or more assigned computers known as "Hybrid Runbook Workers." Use Azure Dedicated Host or isolated virtual machine types for the Hybrid Worker role. When deployed, [isolated VM types](#isolated-virtual-machines) consume the entire physical host for the VM, providing the level of isolation required to support IL5 workloads.

  [Azure Dedicated Host](#azure-dedicated-host) provides physical servers that can host one or more virtual machines and that are dedicated to one Azure subscription.
- By default, your Azure Automation account uses Microsoft-managed keys. You can manage the encryption of secure assets for your Automation account by using your own keys. When you specify a customer-managed key at the level of the Automation account, that key is used to protect and control access to the account encryption key for the Automation account. For more information, see [Encryption of secure assets in Azure Automation](../automation/automation-secure-asset-encryption.md).

### [Azure Advisor](https://azure.microsoft.com/services/advisor/) 

Azure Advisor supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Backup](https://azure.microsoft.com/services/backup/)

Azure Backup supports all impact levels in Azure Government with no extra configuration required.

### [Azure Blueprints](https://azure.microsoft.com/services/blueprints/)

Azure Blueprints supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Cost Management and Billing](https://azure.microsoft.com/services/cost-management/) 

Azure Cost Management and Billing supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Lighthouse](https://azure.microsoft.com/services/azure-lighthouse/)

Azure Lighthouse supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Managed Applications](https://azure.microsoft.com/services/managed-applications/) 

Azure Managed Applications supports Impact Level 5 workloads in Azure Government with this configuration:

- You can store your managed application definition in a storage account that you provide when you create the application. Doing so allows you to manage its location and access for your regulatory needs. For more information, see [Bring your own storage](../azure-resource-manager/managed-applications/publish-service-catalog-app.md#bring-your-own-storage-for-the-managed-application-definition).

### [Azure Monitor](https://azure.microsoft.com/services/monitor/)

Azure Monitor supports Impact Level 5 workloads in Azure Government with no extra configuration required.

> [!IMPORTANT]
> See additional guidance for **[Log Analytics](#log-analytics)**, which is a feature of Azure Monitor.

### [Azure Policy](https://azure.microsoft.com/services/azure-policy/)

Azure Policy supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Policy Guest Configuration](../governance/policy/concepts/guest-configuration.md)

Azure Policy Guest Configuration supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure portal](https://azure.microsoft.com/features/azure-portal/)

The Azure portal supports Impact Level 5 workloads in Azure Government with no extra configuration required.

You can add a markdown tile to your Azure dashboards to display custom static content. For example, you can show basic instructions, an image, or a set of hyperlinks on a [markdown tile](../azure-portal/azure-portal-markdown-tile.md).

### [Azure Resource Graph](../governance/resource-graph/overview.md)

Azure Resource Graph supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/) 

Azure Resource Manager supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### Azure Scheduler

Azure Scheduler is being retired and replaced by [Azure Logic Apps](#logic-apps). To continue working with the jobs that you set up in Scheduler, [migrate to Azure Logic Apps](../scheduler/migrate-from-scheduler-to-logic-apps.md) as soon as you can.

### [Azure Service Health](https://azure.microsoft.com/features/service-health/)

Azure Service Health supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Site Recovery](https://azure.microsoft.com/services/site-recovery/)

Azure Site Recovery supports Impact Level 5 workloads in Azure Government with this configuration:

- You can replicate Azure VMs with managed disks enabled for customer-managed keys from one Azure region to another. For more information, see [Replicate machines with customer-managed key disks](../site-recovery/azure-to-azure-how-to-enable-replication-cmk-disks.md).

### [Cloud Shell](https://azure.microsoft.com/features/cloud-shell/) 

Azure Cloud Shell supports Impact Level 5 workloads in Azure Government with no extra configuration required.

<a name="log-analytics"></a>

### [Log Analytics](../azure-monitor/logs/data-platform-logs.md)

Log Analytics is intended to be used for monitoring the health and status of services and infrastructure. The monitoring data and logs primarily store [logs and metrics](../azure-monitor/logs/data-security.md#data-retention) that are service generated. When used in this primary capacity, Log Analytics supports Impact Level 5 workloads in Azure Government with no extra configuration required.

Log Analytics may also be used to ingest additional customer-provided logs. These logs may include data ingested as part of operating Azure Security Center or Azure Sentinel. If the ingested logs or the queries written against these logs are categorized as IL5 data, then you should configure customer-managed keys (CMK) for your Log Analytics workspaces and Application Insights components. Once configured, any data sent to your workspaces or components is encrypted with your Azure Key Vault key. For more information, see [Azure Monitor customer-managed keys](../azure-monitor/logs/customer-managed-keys.md).

### [Microsoft Intune](/intune/what-is-intune)

Intune supports Impact Level 5 workloads in Azure Government with no extra configuration required. Line-of-business apps should be evaluated for IL5 restrictions prior to [uploading to Intune storage](/mem/intune/apps/apps-add). While Intune does encrypt applications that are uploaded to the service for distribution, it does not support customer-managed keys.

## Media

For Media services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=media-services&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure Media Services](https://azure.microsoft.com/services/media-services/)

Azure Media Services supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Content Delivery Network](https://azure.microsoft.com/services/cdn/)

Content Delivery Network supports Impact Level 5 workloads in Azure Government with no extra configuration required.

## Migration

For Migration services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=database-migration,azure-migrate&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure Data Box](https://azure.microsoft.com/services/databox/) 

Azure Data Box supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Azure Data Box [using customer-managed keys in Azure Key Vault](../databox/data-box-customer-managed-encryption-key-portal.md)

### [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/)

Azure Migrate supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Azure Migrate by [using customer-managed keys in Azure Key Vault](../migrate/how-to-migrate-vmware-vms-with-cmk-disks.md).

### [Azure Database Migration Service](https://azure.microsoft.com/services/database-migration/)

Azure Database Migration Service supports Impact Level 5 workloads in Azure Government with no extra configuration required.

## Networking

For Networking services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=internet-analyzer,private-link,azure-bastion,frontdoor,virtual-wan,dns,ddos-protection,cdn,azure-firewall,network-watcher,load-balancer,vpn-gateway,expressroute,application-gateway,virtual-network&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Application Gateway](https://azure.microsoft.com/services/application-gateway/)

Azure Application Gateway supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Bastion](https://azure.microsoft.com/services/azure-bastion/)

Azure Bastion supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure DDoS Protection](https://azure.microsoft.com/services/ddos-protection/)

Azure DDoS Protection supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure DNS](https://azure.microsoft.com/services/dns/)

Azure DNS supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/)

ExpressRoute supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Firewall](https://azure.microsoft.com/services/azure-firewall/)

Azure Firewall supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Front Door](https://azure.microsoft.com/services/frontdoor/)

Azure Front Door supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Peering Service](../peering-service/about.md)

Microsoft Peering Service supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Private Link](https://azure.microsoft.com/services/private-link/)

Azure Private Link supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Load Balancer](https://azure.microsoft.com/services/load-balancer/)

Azure Load Balancer supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Network Watcher](https://azure.microsoft.com/services/network-watcher/)

Azure Network Watcher and Network Watcher traffic analytics support Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Traffic Manager](https://azure.microsoft.com/services/traffic-manager/)

Azure Traffic Manager supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Virtual Network](https://azure.microsoft.com/services/virtual-network/)

Azure Virtual Network supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Virtual NAT](../virtual-network/nat-overview.md) 

Virtual NAT supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [VPN Gateway](https://azure.microsoft.com/services/vpn-gateway/)

Azure VPN Gateway supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Web Application Firewall](https://azure.microsoft.com/services/web-application-firewall/)

Web Application Firewall supports Impact Level 5 workloads in Azure Government with no extra configuration required.

## Security

For Security services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-sentinel,azure-dedicated-hsm,security-center,key-vault&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure Dedicated HSM](https://azure.microsoft.com/services/azure-dedicated-hsm/)

Azure Dedicated HSM supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Azure Information Protection](https://azure.microsoft.com/services/information-protection/)

Azure Information Protection supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Azure Information Protection [using customer-managed keys in Azure Key Vault](/azure/information-protection/byok-price-restrictions)

### [Azure Sentinel](https://azure.microsoft.com/services/azure-sentinel/)

Azure Sentinel supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Azure Sentinel by [using customer-managed keys in Azure Key Vault](../sentinel/customer-managed-keys.md).

### [Key Vault](https://azure.microsoft.com/services/key-vault/)

Azure Key Vault supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Security Center](https://azure.microsoft.com/services/security-center/)

Azure Security Center supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Customer Lockbox](../security/fundamentals/customer-lockbox-overview.md)

Customer Lockbox for Microsoft Azure supports Impact Level 5 workloads in Azure Government with no extra configuration required. It is available and authorized at IL5 in Azure Government US Gov Arizona, US Gov Texas, and US Gov Virginia regions.

### [Microsoft Cloud App Security](/cloud-app-security/what-is-cloud-app-security)

Microsoft Cloud App Security supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Microsoft Cloud App Security [using customer-managed keys in Azure Key Vault](/cloud-app-security/cas-compliance-trust#security)

### [Microsoft Defender for Endpoint](/windows/security/threat-protection/microsoft-defender-atp/microsoft-defender-advanced-threat-protection) 

Defender for Endpoint (formerly Microsoft Defender Advanced Threat Protection, also known as Microsoft Defender ATP) supports Impact Level 5 workloads in Azure Government with no extra configuration required. It is available and [authorized at IL5](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope) in Azure Government and Azure Government for DoD regions.

### [Microsoft Defender for Identity](/defender-for-identity/what-is)

Defender for Identity (formerly Azure Advanced Threat Protection, also known as Azure ATP) supports Impact Level 5 workloads in Azure Government with no extra configuration required. It is available and [authorized at IL5](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope) in Azure Government regions.

### [Microsoft Graph](/graph/overview)

Microsoft Graph supports Impact Level 5 workloads in Azure Government with no extra configuration required. It is available and [authorized at IL5](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope) in Azure Government and Azure Government for DoD regions.

## Storage

For Storage services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=hpc-cache,managed-disks,storsimple,storage&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure Archive Storage](https://azure.microsoft.com/services/storage/archive/)

Azure Archive Storage can be used in Azure Government to support Impact Level 5 data. Azure Archive Storage is a tier of Azure Storage. It automatically helps secure data at rest by using 256-bit AES encryption. Just like hot and cool tiers, Archive Storage can be set at the blob level. To enable access to the content, you need to rehydrate the archived blob or copy it to an online tier, at which point customers can enforce customer-managed keys that are in place for their online storage tiers. When you create a target storage account for Impact Level 5 data in Archive Storage, add storage encryption via customer-managed keys. For more information, see the [storage services section](#storage-encryption-with-key-vault-managed-keys).

The target storage account for Archive Storage can be located in any Azure Government or Azure Government for DoD region.

### [Azure File Sync](../storage/file-sync/file-sync-planning.md)

Azure File Sync supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Azure File Sync by [using customer-managed keys in Azure Key Vault](../storage/file-sync/file-sync-planning.md#azure-file-share-encryption-at-rest).

### [Azure HPC Cache](https://azure.microsoft.com/services/hpc-cache/)

Azure HPC Cache supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Azure HPC Cache [using customer-managed keys in Azure Key Vault](../hpc-cache/customer-keys.md)

### [Azure Import/Export service](../import-export/storage-import-export-service.md)

Azure Import/Export service can be used in Azure Government to import and export Impact Level 5 data. By default, the Import/Export service will encrypt data that's written to the hard drive for transport. When you create a target storage account for import and export of Impact Level 5 data, add storage encryption via customer-managed keys. For more information, see the [storage services section](#storage-encryption-with-key-vault-managed-keys) of this document.

The target storage account for import and source storage account for export can be located in any Azure Government or Azure Government for DoD regions.

### [Azure NetApp Files](https://azure.microsoft.com/services/netapp/) 

Azure NetApp Files supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Azure NetApp Files [using customer-managed keys in Azure Key Vault](../azure-netapp-files/azure-netapp-files-faqs.md#security-faqs)

### [Azure Storage](https://azure.microsoft.com/services/storage/)

Azure Storage consists of multiple data features: Blob Storage, File Storage, Table Storage, and Queue Storage. Blob Storage supports both standard and premium storage. Premium storage uses only SSDs, to provide the fastest performance possible. Storage also includes configurations that modify these storage types, like hot and cool to provide appropriate speed-of-availability for data scenarios.

When you use an Azure Storage account, you must follow the steps for [storage encryption with Key Vault managed keys](#storage-encryption-with-key-vault-managed-keys) to ensure the data is protected with customer-managed keys. Azure Storage supports Impact Level 5 workloads in all Azure Government and Azure Government for DoD regions.

> [!IMPORTANT]
> When you use Tables and Queues outside the US DoD regions, you must encrypt the data before you insert it into the table or queue. For more information, see the instructions for using [client-side encryption](../storage/common/storage-client-side-encryption-java.md).

#### Storage encryption with Key Vault managed keys

To implement Impact Level 5 compliant controls on an Azure Storage account that runs in Azure Government outside of the dedicated DoD regions, you must use encryption at rest with the customer-managed key option enabled. The customer-managed key option is also known as "bring your own key."

For more information about how to enable this Azure Storage encryption feature, see the documentation for [Azure Storage](../storage/common/customer-managed-keys-configure-key-vault.md).

> [!NOTE]
> When you use this encryption method, you need to enable it before you add content to the storage account. Any content that's added earlier won't be encrypted with the selected key. It will be encrypted only via the standard encryption at rest provided by Azure Storage.

### [StorSimple](https://azure.microsoft.com/services/storsimple/)

StorSimple supports Impact Level 5 workloads in Azure Government with this configuration:

- To help ensure the security and integrity of data moved to the cloud, StorSimple allows you to [define cloud storage encryption keys](../storsimple/storsimple-8000-security.md#storsimple-data-protection). You specify the cloud storage encryption key when you create a volume container. 

## Web

For Web services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=spring-cloud,signalr-service,app-service-linux,app-service&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia).

### [Azure SignalR Service](https://azure.microsoft.com/services/signalr-service/)

Azure SignalR Service supports Impact Level 5 workloads in Azure Government with no extra configuration required.

### [Web Apps feature of Azure App Service](https://azure.microsoft.com/services/app-service/web/)

Web Apps supports Impact Level 5 workloads in Azure Government with this configuration:

- To accommodate proper network and workload isolation, deploy your web apps on the Isolated SKU. For more information, see the [App Service plan documentation](../app-service/overview-hosting-plans.md).