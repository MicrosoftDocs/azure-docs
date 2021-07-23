---
title: JBoss EAP to Azure virtual machines virtual machine scale sets migration guide
description: This guide provides information on how to migrate your enterprise Java applications from another application server to JBoss EAP and from traditional on-premises server to Azure RHEL VM and virtual machine scale sets.
author: theresa-nguyen
ms.author: bicnguy
ms.topic: article
ms.service: virtual-machines
ms.subservice: redhat
ms.assetid: 9b37b2c4-5927-4271-85c7-19adf33d838b
ms.date: 06/08/2021
---

# How to migrate Java applications to JBoss EAP on Azure VMs and virtual machine scale sets

This guide provides information on how to migrate your enterprise Java applications on [Red Hat JBoss Enterprise Application Platform (EAP)](https://www.redhat.com/en/technologies/jboss-middleware/application-platform) from a traditional on-premises server to Azure Red Hat Enterprise Linux (RHEL) Virtual Machines (VM) and virtual machine scale sets if your cloud strategy is to "Lift and Shift" Java applications as-is. However, if you want to "Lift and Optimize" then alternatively you can migrate your containerized applications to [Azure Red Hat OpenShift (ARO)](https://azure.microsoft.com/services/openshift/) with JBoss EAP images from the Red Hat Gallery, or drop your Java app code directly into a JBoss EAP on Azure App Service instance.

## Best practice starting with Azure Marketplace offers and quickstarts

Red Hat and Microsoft have partnered to bring a set of [JBoss EAP on Azure Marketplace offer](https://aka.ms/AMP-JBoss-EAP) to provide a solid starting point for migrating to Azure. Consult the documentation for a list of offer and plans and select the one that most closely matches your existing deployment. Check out the article on [JBoss EAP on Azure Best Practices](./jboss-eap-on-azure-best-practices.md)

If none of the existing offers is a good starting point, you can manually reproduce the deployment using Azure VM and other available resources. For more information, see [What is IaaS](https://azure.microsoft.com/overview/what-is-iaas/)?

### Azure Marketplace offers

Red Hat in partnership with Microsoft has published the following offerings in Azure Marketplace. You can access these offers from the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/) or from the [Azure portal](https://azure.microsoft.com/features/azure-portal/). Check out the article on how to [Deploy Red Hat JBoss EAP on Azure VM and virtual machine scale sets Using the Azure Marketplace Offer](./jboss-eap-marketplace-image.md) for more details.

This Marketplace offer includes various combinations of JBoss EAP and RHEL versions with flexible support subscription models. JBoss EAP is available as Bring-Your-Own-Subscription (BYOS) but for RHEL you can choose between BYOS or Pay-As-You-Go (PAYG). 
The Azure Marketplace offer includes plan options for JBoss EAP on RHEL as stand-alone VMs, clustered VMs, and clustered virtual machine scale sets. The 6 plans include:

- JBoss EAP 7.3 on RHEL 8.3 Stand-alone VM (PAYG)
- JBoss EAP 7.3 on RHEL 8.3 Stand-alone VM (BYOS)
- JBoss EAP 7.3 on RHEL 8.3 Clustered VM (PAYG)
- JBoss EAP 7.3 on RHEL 8.3 Clustered VM (BYOS)
- JBoss EAP 7.3 on RHEL 8.3 Clustered virtual machine scale sets (PAYG)
- JBoss EAP 7.3 on RHEL 8.3 Clustered virtual machine scale sets (BYOS)

### Azure quickstart templates

Along with Azure Marketplace offers, there are Quickstart templates made available for you to test drive EAP on Azure. These Quickstarts include pre-built ARM templates and script to deploy JBoss EAP on Azure in various configurations and version combinations. Solution architecture includes:

- JBoss EAP on RHEL Stand-alone VM
- JBoss EAP on RHEL Clustered VMs
- JBoss EAP on RHEL Clustered virtual machine scale sets

To quickly get started, select one of the Quickstart template that closely matches your JBoss EAP on RHEL version combination. Check out the [JBoss EAP on Azure Quickstart](./jboss-eap-on-rhel.md) documentation to learn more. 

## Prerequisites

* **An Azure Account with an Active Subscription** - If you don't have an Azure subscription, you can activate your [Visual Studio Subscription subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) (former MSDN) or [create an account for free](https://azure.microsoft.com/pricing/free-trial).

- **JBoss EAP installation** - You need to have a Red Hat Account with Red Hat Subscription Management (RHSM) entitlement for JBoss EAP. This entitlement will let you download the Red Hat tested and certified JBoss EAP version.  If you don't have EAP entitlement, you can sign up for a free developer subscription through the [Red Hat Developer Subscription for Individuals](https://developers.redhat.com/register). Once registered, you can find the necessary credentials (Pool IDs) at the [Red Hat Customer Portal](https://access.redhat.com/management/).

- **RHEL options** - Choose between Pay-As-You-Go (PAYG) or Bring-Your-Own-Subscription (BYOS). With BYOS, you need to activate your [Red Hat Cloud Access](https://access.redhat.com/) [RHEL Gold Image](https://azure.microsoft.com/updates/red-hat-enterprise-linux-gold-images-now-available-on-azure/) before deploying the Marketplace  offer with solutions template. Follow [these instructions](https://access.redhat.com/documentation/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/enabling-and-maintaining-subs_cloud-access) to enable RHEL Gold images for use on Microsoft Azure.

- **[Azure Command-Line Interface (CLI)](/cli/azure/overview)**.

- **Java source code and [Java Development Kit (JDK) version](https://www.oracle.com/java/technologies/javase-downloads.html)**

- **[Java application based on JBoss EAP 7.2](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/html-single/development_guide/index#become_familiar_with_java_enterprise_edition_8)** or **[Java application based on JBoss EAP 7.3](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html-single/development_guide/index#get_started_developing_applications)**.

**RHEL options** - Choose between PAYG or BYOS. For BYOS, you will need to activate your [Red Hat Cloud Access](https://access.redhat.com/documentation/red_hat_subscription_management/1/html-single/red_hat_cloud_access_reference_guide/index) RHEL Gold Image for you use the Azure Marketplace offer. BYOS offers will appear in the Private Offer section in the Azure portal. 

**Product versions**

* [JBoss EAP 7.2](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/)
* [JBoss EAP 7.3](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.3/)
* [RHEL 7.7](https://azuremarketplace.microsoft.com/marketplace/apps/RedHat.RedHatEnterpriseLinux77-ARM)
* [RHEL 8.0](https://azuremarketplace.microsoft.com/marketplace/apps/RedHat.RedHatEnterpriseLinux80-ARM)

## Migration flow and architecture

This section outlines free tools for migrating JBoss EAP applications from another application server to run on JBoss EAP and from traditional on-premise servers to Microsoft Azure cloud environment. 

### Red Hat migration toolkit for applications (MTA)

It is recommended that you use the Red Hat MTA, for migrating Java applications, at the beginning of your planning cycle before executing any EAP related migration project. The MTA is an assembly of tools that support large-scale Java application modernization and migration projects across a [broad range of transformations and use cases](https://developers.redhat.com/products/mta/use-cases). It accelerates application code analysis, supports effort estimation, accelerates code migration, and helps you move applications to the cloud and containers.

:::image type="content" source="./media/migration-toolkit.png" alt-text="Image shows the dashboard page of the migration toolkit app.":::

Red Hat MTA allows you to migrate applications from other application servers to Red Hat JBoss EAP.

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

### Validate the compatibility

It is recommended that you validate your current deployment model and version before planning for migration. You may have to make significant changes to your application if your current version isn’t supported.

The MTA supports migrations from third-party enterprise application servers, such as Oracle WebLogic Server, to JBoss EAP and upgrades to the latest release of JBoss EAP.

The following table describes the most common supported migration paths.

**Table - Supported migration paths: Source to target**

|Source platform ⇒ | JBoss EAP 6 | JBoss EAP 7 | Red Hat OpenShift | OpenJDK 8 & 11 | Apache Camel 3 | Spring Boot on RH Runtimes | Quarkus
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Oracle WebLogic Server | &#x2714; | &#x2714; | &#x2714; | &#x2714; | - | - | - |
| IBM WebSphere Application Server | &#x2714; | &#x2714; | &#x2714; | &#x2714; | - | - | - |
| JBoss EAP 4 | &#x2714; | &#x2714; | X<sup>1</sup> | &#x2714; | - | - | - |
| JBoss EAP 5 | &#x2714; | &#x2714; | &#x2714; | &#x2714; | - | - | - |
| JBoss EAP 7 | N/A | &#x2714; | &#x2714; | &#x2714; | - | - | - |
| Oracle JDK | - | - | &#x2714; | &#x2714; | - | - | - |
| Apache Camel 2 | - | - | &#x2714; | &#x2714; | &#x2714; | - | - |
| SpringBoot | - | - | &#x2714; | &#x2714; | - | &#x2714; | &#x2714; |
| Java application | - | - | &#x2714; | &#x2714; | - | - | - |

<sup>1</sup> Although MTA does not currently provide rules for this migration path, Red Hat Consulting can assist with migration from any source platform to JBoss EAP 7.

:::image type="content" source="./media/jboss-cli-image.png" alt-text="Image shows the output in the CLI window.":::

You can also check on the [system requirements](https://access.redhat.com/documentation/en/migration_toolkit_for_applications/5.0/html-single/introduction_to_the_migration_toolkit_for_applications/index#system_requirements_getting-started-guide) for the MTA.

Check on the [JBoss EAP 7.3 supported configurations](https://access.redhat.com/articles/2026253#EAP_73) and [JBoss EAP 7.2 supported configurations](https://access.redhat.com/articles/2026253#EAP_72) before planning for migration.

To obtain your current Java version, sign in to your server and run the following command:

```
java -version
```

### Validate operating mode

JBoss EAP is supported on RHEL, Windows Server, and Oracle Solaris. JBoss EAP runs in either a stand-alone server operating mode for managing discrete instances or managed domain operating mode for managing groups of instances from a single control point.

JBoss EAP managed domains are not supported in Microsoft Azure. Only stand-alone JBoss EAP server instances are supported. Note that configuring JBoss EAP clusters using stand-alone JBoss EAP servers is supported in Azure and this is how the Azure Marketplace offer create your clustered VMs or virtual machine scale sets.

### Inventory server capacity

Document the hardware (memory, CPU, disk, etc.) of the current production server(s) as well as the average and peak request counts and resource utilization. You'll need this information regardless of the migration path you choose. For additional information on the sizes, visit [Sizes for Cloud Services](../../../cloud-services/cloud-services-sizes-specs.md).

### Inventory all secrets

Before the advent of "configuration as a service" technologies such as [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) or [Azure App Configuration](https://azure.microsoft.com/services/app-configuration/), there wasn't a well-defined concept of "secrets". Instead, you had a disparate set of configuration settings that effectively functioned as what we now call "secrets". With app servers such as JBoss EAP, these secrets are in many different config files and configuration stores. Check all properties and configuration files on the production server(s) for any secrets and passwords. Be sure to check *jboss-web.xml* in your WAR files. Configuration files containing passwords or credentials may also be found inside your application. For additional information on Azure Key Vault, visit [Azure Key Vault basic concepts](../../../key-vault/general/basic-concepts.md).

### Inventory all certificates

Document all the certificates used for public SSL endpoints. You can view all certificates on the production server(s) by running the following command:

```cli
keytool -list -v -keystore <path to keystore>
```

### Inventory JNDI resources

- Inventory all Java Naming and Directory Interface (JNDI) resources. Some, such as Java Message Service (JMS) brokers, may require migration or reconfiguration.

### InsideyYour application 

Inspect the WEB-INF/jboss-web.xml and/or WEB-INF/web.xml files.

### Document data sources

If your application uses any databases, you need to capture the following information:

* What is the DataSource name?
* What is the connection pool configuration?
* Where can I find the Java Database Connectivity (JDBC) driver JAR file?

For more information, see [About JBoss EAP DataSources](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.3/html/configuration_guide/datasource_management) in the JBoss EAP documentation.

### Determine whether and how the file system is used

Any usage of the file system on the application server will require reconfiguration or, in rare cases, architectural changes. File system may be used by JBoss EAP modules or by your application code. You may identify some or all of the scenarios described in the following sections.

**Read-only static content**

If your application currently serves static content, you'll need an alternate location for it. You may wish to consider moving static content to Azure Blob Storage and adding [Azure Content Delivery Network (CDN)](../../../cdn/index.yml) for lightning-fast downloads globally. For more information, see [Static website hosting in Azure Storage](../../../storage/blobs/storage-blob-static-website.md) and [Quickstart: Integrate an Azure storage account with Azure CDN](../../../cdn/cdn-create-a-storage-account-with-cdn.md).

**Dynamically published static content**

If your application allows for static content that is uploaded/produced by your application but is immutable after its creation, you can use [Azure Blob Storage](../../../storage/blobs/index.yml) and Azure CDN as described above, with an [Azure Function](../../../azure-functions/index.yml) to handle uploads and CDN refresh. We've provided a sample implementation for your use at [Uploading and CDN-preloading static content with Azure Functions](https://github.com/Azure-Samples/functions-java-push-static-contents-to-cdn).

**Dynamic or internal content**

For files that are frequently written and read by your application (such as temporary data files), or static files that are visible only to your application, you can mount [Azure Storage](../../../storage/index.yml) shares as persistent volumes. For more information, see [Dynamically create and use a persistent volume with Azure Files in Azure Kubernetes Service](../../../aks/azure-files-dynamic-pv.md).

### Determine whether a connection to on-premises is needed

If your application needs to access any of your on-premises services, you'll need to provision one of Azure's connectivity services. For more information, see [Connect an on-premises network to Azure](/azure/architecture/reference-architectures/hybrid-networking/). Alternatively, you'll need to refactor your application to use publicly available APIs that your on-premises resources expose.

### Determine whether JMS queues or topics are in use

If your application is using JMS Queues or Topics, you'll need to migrate them to an externally hosted JMS server. Azure Service Bus and the Advanced Message Queuing Protocol (AMQP) can be a great migration strategy for those using JMS. For more information, visit [Use JMS with Azure Service Bus and AMQP 1.0](../../../service-bus-messaging/service-bus-java-how-to-use-jms-api-amqp.md) or [Send messages to and receive messages from Azure Service Bus queues (Java)](../../../service-bus-messaging/service-bus-java-how-to-use-queues.md)

If JMS persistent stores have been configured, you must capture their configuration and apply it after the migration.

### Determine whether your application is composed of multiple WARs

If your application is composed of multiple WARs, you should treat each of those WARs as separate applications and go through this guide for each of them.

### Determine whether your application is packaged as an EAR

If your application is packaged as an EAR file, be sure to examine the application.xml file and capture the configuration.

### Identify all outside processes and daemons running on the production servers

If you have any processes running outside the application server, such as monitoring daemons, you'll need to eliminate them or migrate them elsewhere.


## Migration

### Provision the target infrastructure

In order to start the migration, first you need to deploy the JBoss EAP infrastructure. You have multiple options to deploy

- [**Azure Virtual Machine**](https://azure.microsoft.com/overview/what-is-a-virtual-machine/)
- [**Azure Virtual Machine Scale Set**](../../../virtual-machine-scale-sets/overview.md)
- [**Azure App Service**](/azure/developer/java/ee/jboss-on-azure)
- [**Azure Red Hat OpenShift (ARO) for Containers**](https://azure.microsoft.com/services/openshift)
- [**Azure Container Service**](https://azure.microsoft.com/product-categories/containers/)

Please refer to the getting started with Azure Marketplace section to evaluate your deployment infrastructure before you build the environment.

### Perform the migration

There are tools that can assist you in Migration :

* [Red Hat Application Migration Toolkit to Analyze Applications for Migration](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/html-single/migration_guide/index#use_windup_to_analyze_applications_for_migration).
* [JBoss Server Migration Tool to Migrate Server Configurations](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/html-single/migration_guide/index#migration_tool_server_migration_tool)

To migrate your server configuration from the older JBoss EAP version to the newer JBoss EAP version, you can either use the [JBoss Server Migration Tool](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/html-single/migration_guide/index#migrate_server_migration_tool_option) or you can perform a manual migration with the help of the [management CLI migrate operation](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/html-single/migration_guide/index#migrate__migrate_operation_option).

### Run Red Hat Application Migration Toolkit

You can [run the JBoss Server Migration Tool in Interactive Mode](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html-single/using_the_jboss_server_migration_tool/index#migration_tool_server_run_interactive_mode). By default, the JBoss Server Migration Tool runs interactively. This mode allows you to choose exactly which server configurations you want to migrate.

You can also [run the JBoss Server Migration Tool in Non-interactive Mode](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/html-single/using_the_jboss_server_migration_tool/index#migration_tool_server_run_noninteractive_mode). This mode allows it to run without prompts.

### Review the result of JBoss server migration toolkit execution

When the migration is complete, review the migrated server configuration files in the *EAP_HOME/standalone/configuration/* and *EAP_HOME/domain/configuration/* directories. For more information, visit [Reviewing the Results of JBoss Server Migration Tool Execution](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/html-single/using_the_jboss_server_migration_tool/index#migration_tool_server_results).

### Expose the application

You can expose the application using the following methods which is suitable for your environment.

* [Create a Public IP](../../../virtual-network/virtual-network-public-ip-address.md#create-a-public-ip-address) to access the server and the application.
* [Create a Jump VM in the Same Virtual Network (VNet)](../../windows/quick-create-portal.md#create-virtual-machine) in a different subnet (new subnet) in the same VNet and access the server via a Jump VM. This Jump VM can be used to expose the application.
* [Create a Jump VM with VNet Peering](../../windows/quick-create-portal.md#create-virtual-machine) in a different Virtual Network and access the server and expose the application using [Virtual Network Peering](../../../virtual-network/tutorial-connect-virtual-networks-portal.md#peer-virtual-networks).
* Expose the application using an [Application Gateway](../../../application-gateway/quick-create-portal.md#create-an-application-gateway)
* Expose the application using an [External Load Balancer](../../../load-balancer/quickstart-load-balancer-standard-public-portal.md?tabs=option-1-create-load-balancer-standard#create-load-balancer-resources) (ELB).

## Post-migration

After you've reached the migration goals you defined in the pre-migration step, perform some end-to-end acceptance testing to verify that everything works as expected. Some topics for post-migration enhancements include, but are certainly not limited to the following:

* Using Azure Storage to serve static content mounted to the VMs. For more information, visit [Attach or detach a data disk to a VM](../../../devtest-labs/devtest-lab-attach-detach-data-disk.md)
* Deploy your applications to your migrated JBoss cluster with Azure DevOps. For more information, visit [Azure DevOps getting started documentation](/azure/devops/get-started/?view=azure-devops).
* Consider using [Application Gateway](../../../application-gateway/index.yml).
* Enhance your network topology with advanced load balancing services. For more information, visit [Using load-balancing services in Azure](../../../traffic-manager/traffic-manager-load-balancing-azure.md).
* Leverage Azure Managed Identities to managed secrets and assign Role Based Access Control (RBAC) to Azure resources. For more information, visit [What are managed identities for Azure resources](../../../active-directory/managed-identities-azure-resources/overview.md)?
* Use Azure Key Vault to store any information that functions as a "secret". For more information, visit [Azure Key Vault basic concepts](../../../key-vault/general/basic-concepts.md).

## Resource links and support

For any support related questions, issues or customization requirements, please contact [Red Hat Support](https://access.redhat.com/support) or [Microsoft Azure Support](https://ms.portal.azure.com/?quickstart=true#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

* Learn more about [JBoss EAP](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html/getting_started_with_jboss_eap_for_openshift_online/introduction)
* Learn more about [Red Hat Subscription Manager (Cloud Access)](https://access.redhat.com/documentation/en/red_hat_subscription_management/1/html-single/red_hat_cloud_access_reference_guide/index)
* Learn more about [Azure Virtual Machines](https://azure.microsoft.com/overview/what-is-a-virtual-machine/)
* Learn more about [Azure Virtual Machine Scale Set](../../../virtual-machine-scale-sets/overview.md)
* Learn more about [Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)
* Learn more about [Azure App Service on Linux](../../../app-service/overview.md#app-service-on-linux)
* Learn more about [Azure Storage](../../../storage/common/storage-introduction.md)
* Learn more about [Azure Networking](../../../networking/fundamentals/networking-overview.md)

## Next steps
* [Deploy JBoss EAP on RHEL VM/VM Scale Set from Azure Marketplace](https://aka.ms/AMP-JBoss-EAP)
* [Configuring a Java app for Azure App Service](../../../app-service/configure-language-java.md)
* [How to deploy JBoss EAP onto Azure App Service](https://github.com/JasonFreeberg/jboss-on-app-service) tutorial
* [Use Azure App Service Migration Assistance](https://azure.microsoft.com/services/app-service/migration-assistant/)
* [Use Red Hat Migration Toolkit for Applications](https://developers.redhat.com/products/mta)