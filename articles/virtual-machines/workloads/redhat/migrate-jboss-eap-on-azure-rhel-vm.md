---
title: Quickstart - JBoss EAP to Azure RHEL VM and VMSS
description: This guide provides information on how to migrate your enterprise Java applications to JBoss EAP and from on-premises to Azure Linux VM and VMSS.
ms.author: bicnguy
ms.topic: quickstart
ms.service: virtual-machines-linux
ms.subservice: workloads
ms.assetid: c96e1c50-930e-4931-bbdb-6240d49e504d
ms.date: 11/16/2020
---

# Migrate enterprise Java applications to JBoss EAP on Azure RHEL VM and VMSS

This guide provides information on how to migrate your enterprise Jakarta EE / Java EE applications to [JBoss Enterprise Application Platform (EAP)](https://www.redhat.com/en/technologies/jboss-middleware/application-platform) and from on-premises to Azure Red Hat Enterprise Linux (RHEL) Virtual Machines (VM) and Virtual Machine Scale Sets if your cloud strategy is "Lift and Shift" of applications as-is. However, if you want to "Lift and Optimize" then alternatively you can migrate your containerized applications to [Azure Red Hat OpenShift (ARO)](https://azure.microsoft.com/services/openshift/) with JBoss EAP images from the Red Hat Gallery, or to [Azure App Service on Linux](https://azure.microsoft.com/updates/public-preview-jboss-eap-on-azure-app-service/).

## Best practice starting with Azure Marketplace offers

Red Hat and Microsoft have partnered to bring a set of Azure solution templates to the Azure Marketplace to provide a solid starting point for migrating to Azure. Consult the documentation for the list of offers and choose the one that most closely matches your existing deployment based on JBoss EAP and RHEL versions.

If none of the existing offers is a good starting point, you'll have to manually create the deployment using Azure VM resources and install your own JBoss EAP version on an Azure RHEL VM. Check out [Red Hat workloads on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/redhat/overview) to learn about the variety of offerings supported on Azure. For more information on how to create an Azure VM, see [What is IaaS?](https://azure.microsoft.com/overview/what-is-iaas/)

**Azure Marketplace Offers**

Red Hat in partnership with Microsoft has published the following offerings in Azure Marketplace. You can access these offers from [Azure Marketplace](https://azuremarketplace.microsoft.com/) or through the [Azure Portal](https://ms.portal.azure.com/). All offerings include integrated support provided by Red Hat and Microsoft. Marketplace offers include various combinations of EAP and RHEL versions to support your requirements. JBoss EAP licensing is always Bring-Your-Own-Subscription (BYOS) whereas with RHEL operating system (OS) you can choose from BYOS or Pay-As-You-Go (PAYG). 

Users can select one of the following combinations for deployment:
- JBoss EAP 7.2 on RHEL 7.7
- JBoss EAP 7.2 on RHEL 8.0
- JBoss EAP 7.3 on RHEL 8.0

These are the available offers by subscription type:
* JBoss EAP 7.2 on RHEL 7.7 VM(BYOS) - coming soon
* JBoss EAP 7.2 on RHEL 7.7 VM(PAYG)
* JBoss EAP 7.2 on RHEL 8.0 VM(BYOS) - coming soon
* JBoss EAP 7.2 on RHEL 8.0 VM(PAYG)
* JBoss EAP 7.3 on RHEL 8.0 VM(BYOS) - coming soon
* JBoss EAP 7.3 on RHEL 8.0 VM(PAYG)

**Azure QuickStart Templates**

Along with Azure Marketplace offers, there are Azure Quickstart templates to help you get started with your Azure migration journey quickly. These quickstarts include pre-built Azure Resource Manager (ARM) templates and script to deploy JBoss EAP on Azure RHEL VMs similar to the Marketplace offers. 

Solution architecture includes:
* JBoss EAP on RHEL VM in stand-alone mode
* JBoss EAP clustered across multiple Azure RHEL VMs
* JBoss EAP clustered using Azure Virtual Machine Scale Sets

You can choose to start with one of the quickstart templates with required JBoss EAP on RHEL combination which meets your desired deployment goal. Following is the list of available quickstart templates.

* <a href="https://azure.microsoft.com/resources/templates/jboss-eap-standalone-rhel/> JBoss EAP on RHEL (stand-alone VM)</a> - This Azure template deploys a web application named JBoss-EAP on Azure on JBoss EAP 7.2/EAP 7.3 running on RHEL 7.7/8.0 VM.

* <a href="https://azure.microsoft.com/resources/templates/jboss-eap-clustered-multivm-rhel/> JBoss EAP on RHEL (clustered, multi-VM)</a> - This Azure template deploys a web application called eap-session-replication on JBoss EAP 7.2/EAP 7.3 cluster running on 'n' number RHEL 7.7/8.0 VMs; 'n' is where you can designate the starting VM count. All the VMs are added to the backend pool of a Load Balancer. Note each region supports vCPU quotas for virtual machines, to learn more read [Standard quota: Increase limits by region](https://docs.microsoft.com/en-us/azure/azure-portal/supportability/regional-quota-requests).

* <a href="https://azure.microsoft.com/resources/templates/jboss-eap-clustered-vmss-rhel/> JBoss EAP on RHEL (clustered, VMSS)</a> - This Azure template deploys a web application called eap-session-replication on JBoss EAP 7.2/EAP 7.3 cluster running on RHEL 7.7/8.0 VMSS instances.

## Prerequisites 

**Prerequisites**

* An Azure account with an active subscription. To get an Azure subscription, activate your [Azure credits for Visual Studio subscribers](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or [create an account for free](https://azure.microsoft.com/pricing/free-trial).

* JBoss EAP installation. You need to have a Red Hat account with Red Hat Subscription Management (RHSM) entitlement for JBoss EAP. This entitlement will let you download the Red Hat tested and certified JBoss EAP version.  

  If you don't have EAP entitlement, obtain a [JBoss EAP evaluation subscription](https://access.redhat.com/products/red-hat-jboss-enterprise-application-platform/evaluation) before you get started. To create a new Red Hat subscription, go to [Red Hat Customer Portal](https://access.redhat.com/) and set up an account.

* Java source code and JDK

* The [Azure CLI](https://docs.microsoft.com/cli/azure/overview).

* [Java application based on JBoss EAP 7.2](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html-single/development_guide/index#become_familiar_with_java_enterprise_edition_8) or [Java application based on JBoss EAP 7.3](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html-single/development_guide/index#get_started_developing_applications)

* RHEL options. Choose between PAYG or BYOS. For BYOS, you will need to activate your [Red Hat Cloud Access](https://access.redhat.com/documentation/en/red_hat_subscription_management/1/html-single/red_hat_cloud_access_reference_guide/index) RHEL Gold Image before you deploy the Quickstart template or Azure Marketplace offers.

**Product version**

* [JBoss EAP 7.2](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/)
* [JBoss EAP 7.3](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.3/)
* [RHEL 7.7 VM](https://azuremarketplace.microsoft.com/marketplace/apps/RedHat.RedHatEnterpriseLinux77-ARM)
* [RHEL 8.0 VM](https://azuremarketplace.microsoft.com/marketplace/apps/RedHat.RedHatEnterpriseLinux80-ARM)

## Migration Flow and Architecture

This section describes what you should be aware of when you want to migrate an existing JBoss EAP application to run on JBoss EAP on Azure.

### Red Hat Migration Toolkit for Applications

It is recommended to use Red Hat Migration toolkit for Applications for planning and executing any EAP related migration project. The Migration Toolkit for Applications (MTA) is an assembly of tools that support large-scale Java application modernization and migration projects across a [broad range of transformations and use cases](https://developers.redhat.com/products/mta/use-cases). It accelerates application code analysis, supports effort estimation, accelerates code migration, and helps you move applications to the cloud and containers.

Red Hat MTA allows you to migrate applications from other application server to Red Hat JBoss EAP. If you're on a previous release of JBoss EAP and want to migrate to JBoss EAP 7.2, check out the [Using the JBoss Server Migration Tool](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/html-single/using_the_jboss_server_migration_tool/index) documentation.

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

### Validate the Compatibility

It is recommended to make sure that you validate your current deployment model and version before planning for migration. You may have to make significant changes to your application if your current version isn’t supported.

**Validate Version**

MTA supports migrations from third-party enterprise application servers, such as Oracle WebLogic Server, to JBoss JBoss EAP and upgrades to the latest release of JBoss EAP.

The following table describes the most common supported migration paths.

|Target&nbsp;→<br><br>Source&nbsp;Platform&nbsp;↓|JBoss<br>EAP 6|JBoss<br>EAP 7|
|---|---|---|---|---|---|---|
| Oracle WebLogic Server            |&#x2714;|&#x2714;|
| IBM WebSphere Application Server  |&#x2714;|&#x2714;|
| JBoss EAP 4                       |&#x2714;|&#x2718;|
| JBoss EAP 5                       |&#x2714;|&#x2714;|
| JBoss EAP 6                       |  N/A   |&#x2714;|   
| JBoss EAP 7                       |  N/A   |&#x2714;|
| Oracle JDK                        |&#x2043;|&#x2043;|
| Apache Camel 2                    |&#x2043;|&#x2043;|
| Spring Boot                       |&#x2043;|&#x2043;|
| Any Java application              |&#x2043;|&#x2043;|

You can also check on the [system requirements](https://access.redhat.com/documentation/en/migration_toolkit_for_applications/5.0/html-single/introduction_to_the_migration_toolkit_for_applications/index#system_requirements_getting-started-guide) for the Migration Toolkit for Applications.

Check on the [JBoss EAP 7.3 supported configurations](https://access.redhat.com/articles/2026253#EAP_73) and [JBoss EAP 7.2 supported configurations](https://access.redhat.com/articles/2026253#EAP_72) before planning for migration.

To obtain your current Java version, sign in to your server and run the following command:

```
java -version
```

**Validate Operating Mode**

JBoss EAP is supported on Red Hat Enterprise Linux, Windows Server, and Oracle Solaris. JBoss EAP runs in either a stand-alone server operating mode for managing discrete instances or managed domain operating mode for managing groups of instances from a single control point. However, JBoss EAP managed domains are not supported in Microsoft Azure. Only stand-alone JBoss EAP server instances are supported. Note that configuring JBoss EAP clusters using stand-alone JBoss EAP servers is supported in Azure.

### Inventory server capacity

Document the hardware (memory, CPU, and disk) of the current production server(s) as well as the average and peak request counts and resource utilization. You'll need this information regardless of the migration path you choose. For additional information on the sizes, visit [Sizes for Cloud Services](https://docs.microsoft.com/azure/cloud-services/cloud-services-sizes-specs).

### Inventory all secrets

Before the advent of "configuration as a service" technologies such as Azure Key Vault, there wasn't a well-defined concept of "secrets". Instead, you had a disparate set of configuration settings that effectively functioned as what we now call "secrets". With app servers such as JBoss EAP, these secrets are in many different config files and configuration stores. Check all properties and configuration files on the production server(s) for any secrets and passwords. Be sure to check *jboss-web.xml* in your WARs. Configuration files containing passwords or credentials may also be found inside your application. For additional information on Azure Key Vault, visit [Azure Key Vault basic concepts](https://docs.microsoft.com/azure/key-vault/general/basic-concepts).

### Inventory all certificates

Document all the certificates used for public SSL endpoints. You can view all certificates on the production server(s) by running the following command:

```
keytool -list -v -keystore <path to keystore>
```

### Inventory JNDI resources

Inventory all JNDI resources. Some, such as JMS message brokers, may require migration or reconfiguration.

#### Inside your application

Inspect the WEB-INF/jboss-web.xml and/or WEB-INF/web.xml files.

### Document datasources

If your application uses any databases, you need to capture the following information:

* What is the datasource name?
* What is the connection pool configuration?
* Where can I find the JDBC driver JAR file?

For more information, see [About JBoss EAP Datasources](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html/configuration_guide/datasource_management) in the JBoss EAP documentation.

### Determine whether and how the file system is used

Any usage of the file system on the application server will require reconfiguration or, in rare cases, architectural changes. File system may be used by JBoss EAP modules or by your application code. You may identify some or all of the scenarios described in the following sections.

#### Read-only static content

If your application currently serves static content, you'll need an alternate location for it. You may wish to consider moving static content to Azure Blob Storage and adding Azure CDN for lightning-fast downloads globally. For more information, see [Static website hosting in Azure Storage](https://docs.microsoft.com/azure/storage/blobs/storage-blob-static-website) and [Quickstart: Integrate an Azure storage account with Azure CDN](https://docs.microsoft.com/azure/cdn/cdn-create-a-storage-account-with-cdn).

#### Dynamically published static content

If your application allows for static content that is uploaded/produced by your application but is immutable after its creation, you can use Azure Blob Storage and Azure CDN as described above, with an Azure Function to handle uploads and CDN refresh. We've provided a sample implementation for your use at [Uploading and CDN-preloading static content with Azure Functions](https://github.com/Azure-Samples/functions-java-push-static-contents-to-cdn).

#### Dynamic or internal content

For files that are frequently written and read by your application (such as temporary data files), or static files that are visible only to your application, you can mount Azure Storage shares as persistent volumes. For more information, see [Dynamically create and use a persistent volume with Azure Files in Azure Kubernetes Service](https://docs.microsoft.com/azure/aks/azure-files-dynamic-pv).

### Determine whether a connection to on-premises is needed

If your application needs to access any of your on-premises services, you'll need to provision one of Azure's connectivity services. For more information, see [Choose a solution for connecting an on-premises network to Azure](/azure/architecture/reference-architectures/hybrid-networking/). Alternatively, you'll need to refactor your application to use publicly available APIs that your on-premises resources expose.

### Determine whether Java Message Service (JMS) Queues or Topics are in use

If your application is using JMS Queues or Topics, you'll need to migrate them to an externally hosted JMS server. Azure Service Bus and the Advanced Message Queuing Protocol (AMQP) can be a great migration strategy for those using JMS. For more information, visit [Use JMS with Azure Service Bus and AMQP 1.0](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-java-how-to-use-jms-api-amqp).

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
- [**Azure Virtual Machine Scale Set**](https://docs.microsoft.com/azure/virtual-machine-scale-sets/overview)
- [**Azure App Service**](https://docs.microsoft.com/azure/app-service/overview)
- [**Azure Containers Services**](https://azure.microsoft.com/product-categories/containers/)

Please refer to the getting started with Azure Marketplace section to evaluate your deployment infrastructure before you build the environment.

### Perform the Migration

There are tools that can assist you in Migration : 

* [Red Hat Application Migration Toolkit to Analyze Applications for Migration](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html-single/migration_guide/index#use_windup_to_analyze_applications_for_migration).
* [JBoss Server Migration Tool to Migrate Server Configurations](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html-single/migration_guide/index#migration_tool_server_migration_tool)

To migrate your server configuration from the older JBoss EAP version to the newer JBoss EAP version, you can either use the [JBoss Server Migration Tool](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html-single/migration_guide/index#migrate_server_migration_tool_option) or you can perform a manual migration with the help of the [management CLI migrate operation](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html-single/migration_guide/index#migrate__migrate_operation_option).

### Run Red Hat Application Migration Toolkit

You can [run the JBoss Server Migration Tool in Interactive Mode](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html-single/using_the_jboss_server_migration_tool/index#migration_tool_server_run_interactive_mode) which is the default setting. This mode allows you to choose exactly which server configurations you want to migrate.

You can also [run the JBoss Server Migration Tool in Non-interactive Mode](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html-single/using_the_jboss_server_migration_tool/index#migration_tool_server_run_noninteractive_mode). This mode allows it to run without prompts.

### Review the Result of JBoss Server Migration toolkit execution

When the migration is complete, review the migrated server configuration files in the *EAP_HOME/standalone/configuration/* and *EAP_HOME/domain/configuration/* directories. For more information, visit [Reviewing the Results of JBoss Server Migration Tool Execution](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html-single/using_the_jboss_server_migration_tool/index#migration_tool_server_results).

### Expose the Application

You can expose the application using the following methods:

* [Create a Public IP](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address#create-a-public-ip-address) to access the server and the application.
* [Create a Jump VM in the same Virtual Network (VNET)](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal#create-virtual-machine). This is to create a different subnet (new subnet) in the same VNET and access the server via a Jump VM. This Jump VM can be used to expose the application.
* [Create a Jump VM in a different VNET](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal#create-virtual-machine) in a different VNET and access the server and expose the application using [Virtual Network Peering](https://docs.microsoft.com/azure/virtual-network/tutorial-connect-virtual-networks-portal#peer-virtual-networks). Think of this as your traditional Hub and Spoke model where this VNET serves as your test Hub and your production environments are your Spokes. 
* Expose the application using an [Application Gateway](https://docs.microsoft.com/azure/application-gateway/quick-create-portal#create-an-application-gateway).
* Expose the application using an [External Load Balancer (ELB)](https://docs.microsoft.com/azure/load-balancer/tutorial-load-balancer-standard-manage-portal#create-a-standard-load-balancer).

## Post-migration

After you've reached the migration goals you defined in the pre-migration step, perform some end-to-end acceptance testing to verify that everything works as expected. Some topics for post-migration enhancements include, but are certainly not limited to the following:

* Using Azure Storage to serve static content mounted to the virtual machines. For more information, visit [Attach or detach a data disk to a virtual machine](https://docs.microsoft.com/azure/devtest-labs/devtest-lab-attach-detach-data-disk)
* Deploy your applications to your migrated JBoss cluster with Azure DevOps. For more information, visit [Azure DevOps getting started documentation](https://docs.microsoft.com/azure/devops/get-started/?view=azure-devops).
* Consider using [Application Gateway](https://docs.microsoft.com/azure/application-gateway/).
* Enhance your network topology with advanced load balancing services. For more information, visit [Using load-balancing services in Azure](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-load-balancing-azure).
* Leverage Azure Managed Identities to managed secrets and assign role based access (RBAC) to Azure resources. For more information, visit [What are managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview)?
* Use Azure Key Vault to store any information that functions as a "secret". For more information, visit [Azure Key Vault basic concepts](https://docs.microsoft.com/azure/key-vault/general/basic-concepts).

## Resource Links

* Learn more about [JBoss EAP](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html/getting_started_with_jboss_eap_for_openshift_online/introduction)
* Learn more about [Red Hat Subscription Manager (Cloud Access)](https://access.redhat.com/documentation/en/red_hat_subscription_management/1/html-single/red_hat_cloud_access_reference_guide/index)
* Learn more about [Azure Virtual Machines](https://azure.microsoft.com/overview/what-is-a-virtual-machine/)
* Learn more about [Azure Virtual Machine Scale Set](https://docs.microsoft.com/azure/virtual-machine-scale-sets/overview)
* Learn more about [Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)
* Learn more about [Azure App Service on Linux](https://docs.microsoft.com/azure/app-service/overview#app-service-on-linux)
* Learn more about [Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-introduction)
* Learn more about [Azure Networking](https://docs.microsoft.com/azure/networking/networking-overview)

## Support

For any support related questions, issues or customization requirements, please contact [Red Hat Support](https://access.redhat.com/support).
