---
title: Quickstart - Deploy JBoss Enterprise Application Platform (EAP) on Red Hat Enterprise Linux (RHEL) to Azure VMs and virtual machine scale sets
description: How to deploy enterprise Java applications by using Red Hat JBoss EAP on Azure RHEL VMs and virtual machine scale sets.
author: theresa-nguyen
ms.author: bicnguy
ms.date: 10/30/2020
ms.assetid: 8a4df7bf-be49-4198-800e-db381cda98f5
ms.topic: quickstart
ms.service: virtual-machines
ms.subservice: redhat
ms.custom:
  - mode-api
ms.collection: linux
---

# Deploy enterprise Java applications to Azure with JBoss EAP on Red Hat Enterprise Linux

The Azure Quickstart templates in this article show you how to deploy [JBoss Enterprise Application Platform (EAP)](https://www.redhat.com/en/technologies/jboss-middleware/application-platform) with [Red Hat Enterprise Linux (RHEL)](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux) to Azure virtual machines (VMs) and virtual machine scale sets. You'll use a sample Java app to validate the deployment. 

JBoss EAP is an open-source application server platform. It delivers enterprise-grade security, scalability, and performance for your Java applications. RHEL is an open-source operating system (OS) platform. It allows scaling of existing apps and rolling out of emerging technologies across all environments. 

JBoss EAP and RHEL include everything that you need to build, run, deploy, and manage enterprise Java applications in any environment. The combination is an open-source solution for on-premises, virtual environments, and in private, public, or hybrid clouds.

## Prerequisites 

* An Azure account with an active subscription. To get an Azure subscription, activate your [Azure credits for Visual Studio subscribers](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or [create an account for free](https://azure.microsoft.com/pricing/free-trial).

* JBoss EAP installation. You need to have a Red Hat account with Red Hat Subscription Management (RHSM) entitlement for JBoss EAP. This entitlement will let you download the Red Hat tested and certified JBoss EAP version.  

  If you don't have EAP entitlement, obtain a [JBoss EAP evaluation subscription](https://access.redhat.com/products/red-hat-jboss-enterprise-application-platform/evaluation) before you get started. To create a new Red Hat subscription, go to [Red Hat Customer Portal](https://access.redhat.com/) and set up an account.

* The [Azure CLI](/cli/azure/overview).

* RHEL options. Choose pay-as-you-go (PAYG) or bring-your-own-subscription (BYOS). With BYOS, you need to activate your [Red Hat Cloud Access](https://access.redhat.com/) RHEL Gold Image before you deploy the Quickstart template.

## Java EE and Jakarta EE application migration

### Migrate to JBoss EAP
JBoss EAP 7.2 and 7.3 are certified implementations of the Java Enterprise Edition (Java EE) 8 and Jakarta EE 8 specifications. JBoss EAP provides preconfigured options for features such as high-availability (HA) clustering, messaging, and distributed caching. It also enables users to write, deploy, and run applications by using the various APIs and services that JBoss EAP provides.  

For more information on JBoss EAP, see [Introduction to JBoss EAP 7.2](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html-single/introduction_to_jboss_eap/index) or [Introduction to JBoss EAP 7.3](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html/introduction_to_jboss_eap/index).

 #### Applications on JBoss EAP

* **Web services applications**. Web services provide a standard way to interoperate among software applications. Each application can run on different platforms and frameworks. These web services facilitate internal and heterogeneous subsystem communication. 

  To learn more, see [Developing Web Services Applications on EAP 7.2](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html/developing_web_services_applications/index) or [Developing Web Services Applications on EAP 7.3](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html/developing_web_services_applications/index).

* **Enterprise Java Beans (EJB) applications**. EJB 3.2 is an API for developing distributed, transactional, secure, and portable Java EE and Jakarta EE applications. EJB uses server-side components called Enterprise Beans to implement the business logic of an application in a decoupled way that encourages reuse. 

  To learn more, see [Developing EJB Applications on EAP 7.2](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html/developing_ejb_applications/index) or [Developing EJB Applications on EAP 7.3](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html/developing_ejb_applications/index).

* **Hibernate applications**. Developers and administrators can develop and deploy Java Persistence API (JPA) and Hibernate applications with JBoss EAP. Hibernate Core is an object-relational mapping framework for the Java language. It provides a framework for mapping an object-oriented domain model to a relational database, so applications can avoid direct interaction with the database. 

  Hibernate Entity Manager implements the programming interfaces and lifecycle rules as defined by the [JPA 2.1 specification](https://www.jcp.org/en/jsr/overview). Together with Hibernate Annotations, this wrapper implements a complete (and standalone) JPA solution on top of the mature Hibernate Core. 
  
  To learn more about Hibernate, see [JPA on EAP 7.2](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html/development_guide/java_persistence_api) or  [Jakarta Persistence on EAP 7.3](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html/development_guide/java_persistence_api).

#### Red Hat Migration Toolkit for Applications
[Red Hat Migration Toolkit for Applications (MTA)](https://developers.redhat.com/products/mta/overview) is a migration tool for Java application servers. Use this tool to migrate from another app server to JBoss EAP. It works with IDE plug-ins for [Eclipse IDE](https://www.eclipse.org/ide/), [Red Hat CodeReady Workspaces](https://developers.redhat.com/products/codeready-workspaces/overview), and [Visual Studio Code](https://code.visualstudio.com/docs/languages/java) for Java. 

MTA is a free and open-source tool that:
* Automates application analysis.
* Supports effort estimation.
* Accelerates code migration.
* Supports containerization.
* Integrates with Azure Workload Builder.

### Migrate JBoss EAP from on-premises to Azure
The Azure Marketplace offer of JBoss EAP on RHEL will install and provision on Azure VMs in less than 20 minutes. You can access these offers from [Azure Marketplace](https://azuremarketplace.microsoft.com/).

This Azure Marketplace offer includes various combinations of EAP and RHEL versions to support your requirements. JBoss EAP is always BYOS, but for RHEL OS, you can choose between BYOS or PAYG. The Azure Marketplace offer includes plan options for JBoss EAP on RHEL as standalone or clustered VMs:

* JBoss EAP 7.2 on RHEL 7.7 VM (PAYG)
* JBoss EAP 7.2 on RHEL 8.0 VM (PAYG)
* JBoss EAP 7.3 on RHEL 8.0 VM (PAYG)
* JBoss EAP 7.2 on RHEL 7.7 VM (BYOS)
* JBoss EAP 7.2 on RHEL 8.0 VM (BYOS)
* JBoss EAP 7.3 on RHEL 8.0 VM (BYOS)

Along with Azure Marketplace offers, you can use Quickstart templates to get started on your Azure migration journey. These Quickstarts include prebuilt Azure Resource Manager (ARM) templates and scripts to deploy JBoss EAP on RHEL in various configurations and version combinations. You'll have:

* A load balancer.
* A private IP for load balancing and VMs.
* A virtual network with a single subnet.
* VM configuration (cluster or standalone).
* A sample Java application.

Solution architecture for these templates includes:

* JBoss EAP on a standalone RHEL VM.
* JBoss EAP clustered across multiple RHEL VMs.
* JBoss EAP clustered through Azure virtual machine scale sets.

#### Linux Workload Migration for JBoss EAP
Azure Workload Builder simplifies the proof-of-concept, evaluation, and migration process for on-premises Java apps to Azure. Workload Builder integrates with the Azure Migrate Discovery tool to identify JBoss EAP servers. Then it dynamically generates an Ansible playbook for JBoss EAP server deployment. It uses the Red Hat MTA tool to migrate servers from other app servers to JBoss EAP. 

Steps for simplifying migration include:
1. **Evaluation**. Evaluate JBoss EAP clusters by using an Azure VM or a virtual machine scale set.
1. **Assessment**. Scan applications and infrastructure.
1. **Infrastructure configuration**. Create a workload profile.
1. **Deployment and testing**. Deploy, migrate, and test the workload.
1. **Post-deployment configuration**. Integrate with data, monitoring, security, backup, and more.

## Server configuration choice

For deployment of the RHEL VM, you can choose either PAYG or BYOS. Images from [Azure Marketplace](https://azuremarketplace.microsoft.com) default to PAYG. Deploy a BYOS-type RHEL VM if you have your own RHEL OS image. Make sure your RHSM account has BYOS entitlement via Cloud Access before you deploy the VM or virtual machine scale set.

JBoss EAP has powerful management capabilities along with providing functionality and APIs to its applications. These management capabilities differ depending on which operating mode you use to start JBoss EAP. It's supported on RHEL and Windows Server. JBoss EAP offers a standalone server operating mode for managing discrete instances. It also offers a managed domain operating mode for managing groups of instances from a single control point. 

> [!NOTE]
> JBoss EAP-managed domains aren't supported in Microsoft Azure because the Azure infrastructure services manage the HA feature. 

The environment variable `EAP_HOME` denotes the path to the JBoss EAP installation. Use the following command to start the JBoss EAP service in standalone mode:

```
$EAP_HOME/bin/standalone.sh
```
    
This startup script uses the EAP_HOME/bin/standalone.conf file to set some default preferences, such as JVM options. You can customize settings in this file. JBoss EAP uses the standalone.xml configuration file to start in standalone mode by default, but you can use a different mode to start it. 

For details on the available standalone configuration files and how to use them, see [Standalone Server Configuration Files for EAP 7.2](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html/configuration_guide/jboss_eap_management#standalone_server_configuration_files) or [Standalone Server Configuration Files for EAP 7.3](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html/configuration_guide/jboss_eap_management#standalone_server_configuration_files). 

To start JBoss EAP with a different configuration, use the `--server-config` argument. For example:
    
 ```
 $EAP_HOME/bin/standalone.sh --server-config=standalone-full.xml
 ```
    
For a complete listing of all available startup script arguments and their purposes, use the `--help` argument. For more information, see [Server Runtime Arguments on EAP 7.2](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html/configuration_guide/reference_material#reference_of_switches_and_arguments_to_pass_at_server_runtime) or [Server Runtime Arguments on EAP 7.3](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html/configuration_guide/reference_material#reference_of_switches_and_arguments_to_pass_at_server_runtime).
    
JBoss EAP can also work in cluster mode. JBoss EAP cluster messaging allows grouping of JBoss EAP messaging servers to share message processing load. Each active node in the cluster is an active JBoss EAP messaging server, which manages its own messages and handles its own connections. To learn more, see [Clusters Overview on EAP 7.2](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html/configuring_messaging/clusters_overview) or [ Clusters Overview on EAP 7.3](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html/configuring_messaging/clusters_overview). 

## Support and subscription notes
These Quickstart templates are offered as follows: 

- RHEL OS is offered as PAYG or BYOS via Red Hat Gold Image model.
- JBoss EAP is offered as BYOS only.

#### Using RHEL OS with the PAYG model

By default, these Quickstart templates use the On-Demand RHEL 7.7 or 8.0 PAYG image from Azure Marketplace. PAYG images have an additional hourly RHEL subscription charge on top of the normal compute, network, and storage costs. At the same time, the instance is registered to your Red Hat subscription. This means you'll be using one of your entitlements. 

This PAYG image will lead to "double billing." You can avoid this issue by building your own RHEL image. To learn more, read the Red Hat knowledge base article [How to provision a RHEL VM for Microsoft Azure](https://access.redhat.com/articles/uploading-rhel-image-to-azure). Or activate your [Red Hat Cloud Access](https://access.redhat.com/) RHEL Gold Image.

For details on PAYG VM pricing, see [Red Hat Enterprise Linux pricing](https://azure.microsoft.com/pricing/details/virtual-machines/red-hat/). To use RHEL in the PAYG model, you'll need an Azure subscription with the specified payment method for [RHEL 7.7 on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/RedHat.RedHatEnterpriseLinux77-ARM) or [RHEL 8.0 on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/RedHat.RedHatEnterpriseLinux80-ARM). These offers require a payment method to be specified in the Azure subscription.

#### Using RHEL OS with the BYOS model

To use BYOS for RHEL OS, you need to have a valid Red Hat subscription with entitlements to use RHEL OS in Azure. Complete the following prerequisites before you deploy the RHEL OS with the BYOS model:

1. Ensure that you have RHEL OS and JBoss EAP entitlements attached to your Red Hat subscription.
2. Authorize your Azure subscription ID to use RHEL BYOS images. Follow the [Red Hat Subscription Management documentation](https://access.redhat.com/documentation/red_hat_subscription_management/1/) to complete the process, which includes these steps:

   1. Enable Microsoft Azure as a provider in your Red Hat Cloud Access Dashboard.

   1. Add your Azure subscription IDs.

   1. Enable new products for Cloud Access on Microsoft Azure.
    
   1. Activate Red Hat Gold Images for your Azure subscription. For more information, see [Red Hat Gold Images on Microsoft Azure](https://access.redhat.com/documentation/en-us/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/cloud-access-gold-images_cloud-access#proc_using-gold-images-azure_cloud-access).

   1. Wait for Red Hat Gold Images to be available in your Azure subscription. These images are typically available within three hours of submission.
    
3. Accept the Azure Marketplace terms and conditions for RHEL BYOS images. You can complete this process by running the following Azure CLI commands. For more information, see the [RHEL BYOS Gold Images in Azure](./byos.md) documentation. It's important that you're running the latest Azure CLI version.

   1. Open an Azure CLI session and authenticate with your Azure account. For assistance, see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

   1. Verify that the RHEL BYOS images are available in your subscription by running the following CLI command. If you don't get any results here, ensure that your Azure subscription is activated for RHEL BYOS images.
   
      ```
      az vm image list --offer rhel-byos --all
      ```

   1. Run the following command to accept the Azure Marketplace terms for RHEL 7.7 BYOS and RHEL 8.0 BYOS, respectively:
      ```
      az vm image terms accept --publisher redhat --offer rhel-byos --plan rhel-lvm77
      ``` 

      ```
      az vm image terms accept --publisher redhat --offer rhel-byos --plan rhel-lvm8
      ``` 
   
Your subscription is now ready to deploy RHEL 7.7 or 8.0 BYOS on Azure virtual machines.

#### Using JBoss EAP with the BYOS model

JBoss EAP is available on Azure through the BYOS model only. When you're deploying this template, you need to supply your RHSM credentials along with the RHSM Pool ID with valid EAP entitlements. If you don't have EAP entitlements, obtain a [JBoss EAP evaluation subscription](https://access.redhat.com/products/red-hat-jboss-enterprise-application-platform/evaluation) before you get started.

## Deployment options

You can deploy the template in the following ways:

- **PowerShell**. Deploy the template by running the following commands: 

  ```
  New-AzResourceGroup -Name <resource-group-name> -Location <resource-group-location> #use this command when you need to create a new resource group for your deployment
  ```

  ```
  New-AzResourceGroupDeployment -ResourceGroupName <resource-group-name> -TemplateUri <raw link to the template which can be obtained from github>
  ```
 
  For information on installing and configuring Azure PowerShell, see the [PowerShell documentation](/powershell/azure/).  

- **Azure CLI**. Deploy the template by running the following commands:

  ```
  az group create --name <resource-group-name> --location <resource-group-location> #use this command when you need to create a new resource group for your deployment
  ```

  ```
  az deployment group create --resource-group <my-resource-group> --template-uri <raw link to the template which can be obtained from github>
  ```

  For details on installing and configuring the Azure CLI, see [Install the CLI](/cli/azure/install-azure-cli).

- **Azure portal**. You can deploy to the Azure portal by going to the Azure Quickstart templates as noted in the next section. After you're in the Quickstart, select the **Deploy to Azure** or **Browse on GitHub** button.

## Azure Quickstart templates

You can start by using one of the following Quickstart templates for JBoss EAP on RHEL that meets your deployment goal:

* <a href="https://azure.microsoft.com/resources/templates/jboss-eap-standalone-rhel/"> JBoss EAP on RHEL (standalone VM)</a>. This will deploy a web application named JBoss-EAP on Azure to JBoss EAP 7.2 or 7.3 running on RHEL 7.7 or 8.0 VM.

* <a href="https://azure.microsoft.com/resources/templates/jboss-eap-clustered-multivm-rhel/"> JBoss EAP on RHEL (clustered, multiple VMs)</a>. This will deploy a web application called eap-session-replication on a JBoss EAP 7.2 or 7.3 cluster running on *n* number of RHEL 7.7 or 8.0 VMs. The user decides the *n* value. All the VMs are added to the back-end pool of a load balancer.

* <a href="https://azure.microsoft.com/en-us/resources/templates/jboss-eap-clustered-vmss-rhel/"> JBoss EAP on RHEL (clustered, virtual machine scale set)</a>. This will deploy a web application called eap-session-replication on a JBoss EAP 7.2 or 7.3 cluster running on RHEL 7.7 or 8.0 virtual machine scale sets.

## Resource links

* [Azure Hybrid Benefit](../../windows/hybrid-use-benefit-licensing.md)
* [Configure a Java app for Azure App Service](../../../app-service/configure-language-java.md)
* [JBoss EAP on Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)
* [JBoss EAP on Azure App Service Linux](../../../app-service/quickstart-java.md)
* [Deploy JBoss EAP on Azure App Service](https://github.com/JasonFreeberg/jboss-on-app-service)

## Next steps

* Learn more about [JBoss EAP 7.2](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/).
* Learn more about [JBoss EAP 7.3](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.3/).
* Learn more about [Red Hat Subscription Management](https://access.redhat.com/products/red-hat-subscription-management).
* Learn about [Red Hat workloads on Azure](./overview.md).
* Deploy [JBoss EAP on an RHEL VM or virtual machine scale set from Azure Marketplace](https://aka.ms/AMP-JBoss-EAP).
* Deploy [JBoss EAP on an RHEL VM or virtual machine scale set from  Azure Quickstart templates](https://aka.ms/Quickstart-JBoss-EAP).
