---
title: Quickstart - JBoss Enterprise Application (EAP) on Red Hat Enterprise Linux (RHEL) to Azure VM and Virtual Machine Scale Set
description: How to deploy enterprise Java applications using Red Hat JBoss EAP on an Azure RHEL VM and Virtual Machine Scale Set.
author: theresa-nguyen
ms.author: bicnguy
ms.topic: quickstart
ms.service: virtual-machines-linux
ms.subservice: workloads
ms.assetid: 8a4df7bf-be49-4198-800e-db381cda98f5
ms.date: 10/30/2020
---

# Deploy enterprise Java applications to Azure with JBoss EAP on Red Hat Enterprise Linux

These Quickstart templates will show you how to deploy [JBoss EAP](https://www.redhat.com/en/technologies/jboss-middleware/application-platform) with [RHEL](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux) onto Azure Virtual Machines (VM) and Virtual Machine Scale Sets. You'll have a sample Java app in the deployment to validate the deployment. JBoss EAP is an open-source application server platform. It delivers enterprise-grade security, scalability, and performance for your Java applications. RHEL is an open-source operating system (OS) platform. It allows scaling of existing apps and rolling out of emerging technologies across all environments. JBoss EAP and RHEL include everything needed to build, run, deploy, and manage enterprise Java applications in any environment. It's a great open-source solution for on-premises, virtual environments, and in private, public, or hybrid clouds.

## Prerequisite 

* An Azure account with an active subscription. To get an Azure subscription, activate your [Azure credits for Visual Studio subscribers](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or [create an account for free](https://azure.microsoft.com/pricing/free-trial).

* JBoss EAP installation - You need to have a Red Hat Account with Red Hat Subscription Management (RHSM) entitlement for JBoss EAP. This entitlement will let you to download the Red Hat tested and certified JBoss EAP version.  If you don't have EAP entitlement, obtain a [JBoss EAP evaluation subscription](https://access.redhat.com/products/red-hat-jboss-enterprise-application-platform/evaluation) before you get started. To create a new Red Hat subscription, go to [Red Hat Customer Portal](https://access.redhat.com/) and set up an account.
F
* [Azure Command-Line Interface](https://docs.microsoft.com/cli/azure/overview).

* RHEL options - Choose between Pay-As-You-Go (PAYG) or Bring-Your-Own-Subscription (BYOS). With BYOS, you need to activate your [Red Hat Cloud Access](https://access.redhat.com/) RHEL Gold Image before deploying the Quickstart template.

## Java EE / Jakarata EE Application Migration

### Migrate to JBoss EAP
JBoss EAP 7.2 and 7.3 are certified implementations of the Java Enterprise Edition (Java EE) 8 and Jakarta EE 8 specifications. JBoss EAP provides preconfigured options for features such as high-availability (HA) clustering, messaging, and distributed caching. It also enables users to write, deploy, and run applications using the various APIs and services that JBoss EAP provides.  For additional information on JBoss EAP, visit [Introduction to JBoss EAP 7.2](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html-single/introduction_to_jboss_eap/index) or [Introduction to JBoss EAP 7.3](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html/introduction_to_jboss_eap/index).

 #### Applications on JBoss EAP

* Web Services Applications - Web services provide a standard means of interoperating among different software applications. Each application can run on different platforms and frameworks. These web services facilitate internal and heterogeneous subsystem communication. To learn more, visit [Developing Web Services Applications on EAP 7.2](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html/developing_web_services_applications/index) or [Developing Web Services Applications on EAP 7.3](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html/developing_web_services_applications/index).

* Enterprise Java Beans (EJB) Applications - EJB 3.2 is an API for developing distributed, transactional, secure, and portable Java EE and Jakarta EE applications. EJB uses server-side components called Enterprise Beans to implement the business logic of an application in a decoupled manner that encourages reuse. To learn more, visit [Developing EJB Applications on EAP 7.2](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html/developing_ejb_applications/index) or [Developing EJB Applications on EAP 7.3](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html/developing_ejb_applications/index).

* Hibernate Applications - Developers and administrators can develop and deploy Java Persistence API (JPA)/Hibernate applications with JBoss EAP. Hibernate Core is an object-relational mapping framework for the Java language. It provides a framework for mapping an object-oriented domain model to a relational database, allowing applications to avoid direct interaction with the database. Hibernate Entity Manager implements the programming interfaces and lifecycle rules as defined by the [JPA 2.1 specification](https://www.jcp.org/en/jsr/overview). Together with Hibernate Annotations, this wrapper implements a complete (and standalone) JPA solution on top of the mature Hibernate Core. To learn more about Hibernate, visit [JPA on EAP 7.2](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html/development_guide/java_persistence_api) or  [Jakarta Persistence on EAP 7.3](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html/development_guide/java_persistence_api).

#### Red Hat Migration Toolkit for Applications (MTA)
[Red Hat Migration Toolkit for Applications (MTA)](https://developers.redhat.com/products/mta/overview) is a migration tool for Java application servers. Use this tool to migrate from another app server to JBoss EAP. It works with IDE plugins for [Eclipse IDE](https://www.eclipse.org/ide/), [Red Hat CodeReady Workspaces](https://developers.redhat.com/products/codeready-workspaces/overview), and [Visual Studio Code (VS Code)](https://code.visualstudio.com/docs/languages/java) for Java.  MTA is a free and open-source tool that will:
* Automate application analysis
* Support effort estimation
* Accelerate code migration
* Support containerization
* Integrates with Azure Workload Builder

### Migrate JBoss EAP from on-premises to Azure
The Azure Marketplace offer of JBoss EAP on RHEL will install and provision on Azure VMs in less than 20 minutes. You can access these offers from [Azure Marketplace](https://azuremarketplace.microsoft.com/)

This Marketplace offer includes various combinations of EAP and RHEL versions to support your requirements. JBoss EAP is always Bring-Your-Own-Subscription (BYOS) but for RHEL OS you can choose between BYOS or Pay-As-You-Go (PAYG). The Azure Marketplace offer includes plan options for JBoss EAP on RHEL as stand-alone or clustered VMs:

* JBoss EAP 7.2 on RHEL 7.7 VM (PAYG)
* JBoss EAP 7.2 on RHEL 8.0 VM (PAYG)
* JBoss EAP 7.3 on RHEL 8.0 VM (PAYG)
* JBoss EAP 7.2 on RHEL 7.7 VM (BYOS)
* JBoss EAP 7.2 on RHEL 8.0 VM (BYOS)
* JBoss EAP 7.3 on RHEL 8.0 VM (BYOS)

Along with Azure Marketplace offers, there are Quickstart templates made available for you to get started on your Azure migration journey. These Quickstarts include pre-built Azure Resource Manager(ARM) templates and script to deploy JBoss EAP on RHEL in various configurations and version combinations. You'll have:

* Load Balancer (LB)
* Private IP for load balancing and VMs
* Virtual Network (VNET) with a single subnet
* VM configuration (cluster or stand-alone)
* A sample Java application

Solution architecture for these templates includes:

* JBoss EAP on stand-alone RHEL VM
* JBoss EAP clustered across Multiple RHEL VMs
* JBoss EAP clustered using Azure Virtual Machine Scale Set

#### Linux Workload Migration for JBoss EAP
Azure Workload Builder will simplify the Proof-of-Concept (POC), evaluation, and migration process for on-premises Java apps to Azure. The Workload Builder integrates with Azure Migrate Discovery tool to identify JBoss EAP servers. Then it will dynamically generate Ansible playbook for JBoss EAP server deployment. It leverage the Red Hat MTA tool to migrate servers from other app servers to JBoss EAP. Steps for simplifying migration include:
* Evaluation - JBoss EAP clusters using Azure VM or Virtual Machine Scale Set
* Assessment - Scans applications and infrastructure
* Infrastructure configuration - Creates workload profile
* Deployment and testing - Deploy, migrate, and test workload
* Post-deployment configuration - Integrates with data, monitoring, security, backup, and more

## Server configuration choice

For deployment of RHEL VM, you can either choose between PAYG or BYOS. Images from the [Azure Marketplace](https://azuremarketplace.microsoft.com) defaults to PAYG. Deploy a BYOS type RHEL VM if you have your own RHEL OS image. Make sure your RHSM account has BYOS entitlement via F Cloud Access before you deploy the VMs or Virtual Machine Scale Set.

JBoss EAP has powerful management capabilities as well as providing functionality and APIs to its applications. These management capabilities differ depending on which operating mode is used to start JBoss EAP. It is supported on RHEL and Windows Server. JBoss EAP offers a stand-alone server operating mode for managing discrete instances. It also offers a managed domain operating mode for managing groups of instances from a single control point. Note: JBoss EAP-managed domains aren't supported in Microsoft Azure since the High Availability (HA) feature is managed by Azure infrastructure services. The environment variable named *EAP_HOME* is used to denote the path to the JBoss EAP installation.

**Start JBoss EAP as a Stand-alone Server** - the following command is how you start EAP service in stand-alone mode.

```$EAP_HOME/bin/standalone.sh```
    
This startup script uses the EAP_HOME/bin/standalone.conf file to set some default preferences, such as JVM options. Settings can be customized in this file. JBoss EAP uses the standalone.xml configuration file to start on stand-alone mode by default, but can be started using a different mode. For details on the available stand-alone configuration files and how to use them, see the [Stand-alone Server Configuration Files for EAP 7.2](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html/configuration_guide/jboss_eap_management#standalone_server_configuration_files) or [Stand-alone Server Configuration Files for EAP 7.3](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html/configuration_guide/jboss_eap_management#standalone_server_configuration_files) section. To start JBoss EAP with a different configuration, use the --server-config argument. For example:
    
 ```$EAP_HOME/bin/standalone.sh --server-config=standalone-full.xml```
    
For a complete listing of all available startup script arguments and their purposes, use the --help argument or see the [Server Runtime Arguments on EAP 7.2] (https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html/configuration_guide/reference_material#reference_of_switches_and_arguments_to_pass_at_server_runtime) or [Server Runtime Arguments on EAP 7.3](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html/configuration_guide/reference_material#reference_of_switches_and_arguments_to_pass_at_server_runtime) section.
    
JBoss EAP can also work in cluster mode. Check out [Clusters Overview on EAP 7.2](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html/configuring_messaging/clusters_overview) or [ Clusters Overview on EAP 7.3](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html/configuring_messaging/clusters_overview) to learn more. JBoss EAP cluster messaging allows grouping of JBoss EAP messaging servers to share message processing load. Each active node in the cluster is an active JBoss EAP messaging server, which manages its own messages and handles its own connections.

## Support and subscription notes
These Quickstart templates are offered as: 

- RHEL OS is offered as PAYG or BYOS via Red Hat Gold Image model
- JBoss EAP is offered as BYOS only

#### Using RHEL OS with PAYG Model

By default, these Quickstart templates use the On-Demand RHEL 7.7 or 8.0 PAYG image from the Azure Gallery. PAYG images will have additional hourly RHEL subscription charge on top of the normal compute, network, and storage costs. At the same time, the instance will be registered to your Red Hat subscription. This means you'll be using one of your entitlements. This PAYG image will lead to "double billing". You can avoid this issue by building your own RHEL image. To learn more, read this Red Hat Knowledge Base (KB) article on [How to provision a RHEL VM for Microsoft Azure](https://access.redhat.com/articles/uploading-rhel-image-to-azure). Or activate your [Red Hat Cloud Access](https://access.redhat.com/) RHEL Gold Image.

Check out [Red Hat Enterprise Linux pricing](https://azure.microsoft.com/pricing/details/virtual-machines/red-hat/) for details on the PAYG VM pricing. To use RHEL in PAYG model, you'll need an Azure Subscription with the specified payment method for [RHEL 7.7 Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/RedHat.RedHatEnterpriseLinux77-ARM) or [RHEL 8.0 Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/RedHat.RedHatEnterpriseLinux80-ARM). These offers require a payment method to be specified in the Azure Subscription.

#### Using RHEL OS with BYOS Model

To use BYOS for RHEL OS, you need to have a valid Red Hat subscription with entitlements to use RHEL OS in Azure. Complete the following prerequisites before you deploy this Quickstart template:

1. Ensure you have RHEL OS and JBoss EAP entitlements attached to your Red Hat subscription.
2. Authorize your Azure subscription ID to use RHEL BYOS images. Follow the [Red Hat Subscription Management (RHSM) documentation](https://access.redhat.com/documentation/en/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/con-enable-subs) to complete the process, which includes these steps:

    2.1 Enable Microsoft Azure as a provider in your Red Hat Cloud Access Dashboard.

    2.2 Add your Azure subscription IDs.

    2.3 Enable new products for Cloud Access on Microsoft Azure.
    
    2.4 Activate Red Hat Gold Images for your Azure Subscription. For more information, read the chapter on [Enabling and maintaining subscriptions for Cloud Access](https://access.redhat.com/documentation/en/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/using_red_hat_gold_images#con-gold-image-azure) for more details.

    2.5 Wait for Red Hat Gold Images to be available in your Azure subscription. These Gold Images are typically available within 3 hours of submission.
    
3. Accept the Azure Marketplace Terms and Conditions for RHEL BYOS Images. You can complete this process by running Azure Command-Line Interface (CLI) commands, as given below. For more information, see the [RHEL BYOS Gold Images in Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/redhat/byos) documentation for more details. It's important that you're running the latest Azure CLI version.

    3.1 Launch an Azure CLI session and authenticate with your Azure account. Refer to [Signing in with Azure CLI](https://docs.microsoft.com/cli/azure/authenticate-azure-cli) for assistance. Make sure you are running the latest Azure CLI version before moving on.

    3.2 Verify the RHEL BYOS images are available in your subscription by running the following CLI command. If you don't get any results here, refer to #2 and ensure that your Azure subscription is activated for RHEL BYOS images.
   
   ```az vm image list --offer rhel-byos --all```

    3.3 Run the following command to accept the Marketplace Terms for RHEL 7.7 BYOS and RHEL 8.0 BYOS, respectively.

   ```az vm image terms accept --publisher redhat --offer rhel-byos --plan rhel-lvm77``` - *For RHEL 7.7 BYOS VM*

   ```az vm image terms accept --publisher redhat --offer rhel-byos --plan rhel-lvm8``` - *For RHEL 8.0 BYOS VM*

4. Your subscription is now ready to deploy RHEL 7.7 or 8.0 BYOS on Azure virtual machines.

#### Using JBoss EAP with BYOS Model

JBoss EAP is available on Azure through the BYOS model only. When deploying this template, you need to supply your RHSM credentials along with RHSM Pool ID with valid EAP entitlements. If you don't have EAP entitlement, obtain a [JBoss EAP evaluation subscription](https://access.redhat.com/products/red-hat-jboss-enterprise-application-platform/evaluation) before you get started.

## How to consume

You can deploy the template in three following ways:

- Use PowerShell - Deploy the template by running the following commands: (Check out [Azure PowerShell](https://docs.microsoft.com/powershell/azure/) for information on installing and configuring Azure PowerShell).

  ```New-AzResourceGroup -Name <resource-group-name> -Location <resource-group-location> #use this command when you need to create a new resource group for your deployment```

  ```New-AzResourceGroupDeployment -ResourceGroupName <resource-group-name> -TemplateUri <raw link to the template which can be obtained from github>```
    
- Use Azure CLI - Deploy the template by running the following commands: (Check out [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) for details on installing and configuring the Azure CLI).

  ```az group create --name <resource-group-name> --location <resource-group-location> #use this command when you need to create a new resource group for your deployment```

  ```az group deployment create --resource-group <my-resource-group> --template-uri <raw link to the template which can be obtained from github>```

- Use Azure portal - You can deploy to the Azure portal by going to the *Azure Quickstart templates* as noted in the below section. Once you're in the Quickstart, click on **Deploy to Azure** or **Browse on GitHub** button.

## Azure QuickStart templates

You can start with one of the Quickstart templates of JBoss EAP on RHEL combination that meets your deployment goal. Following is the list of available Quickstart templates.

* <a href="https://azure.microsoft.com/resources/templates/jboss-eap-standalone-rhel/"> JBoss EAP on RHEL (stand-alone VM)</a> - This will deploy a web application named JBoss-EAP on Azure to JBoss EAP 7.2 or 7.3 running on RHEL 7.7 or 8.0 VM.

* <a href="https://azure.microsoft.com/resources/templates/jboss-eap-clustered-multivm-rhel/"> JBoss EAP on RHEL (clustered, multi-VMs)</a> - This will deploy a web application called eap-session-replication on JBoss EAP 7.2 or 7.3 cluster running on 'n' number RHEL 7.7 or 8.0 VMs. The 'n' value is decided by the user. All the VMs are added to the backend pool of a Load Balancer.

* <a href="https://azure.microsoft.com/en-us/resources/templates/jboss-eap-clustered-vmss-rhel/"> JBoss EAP on RHEL (clustered, Virtual Machine Scale Set)</a> - This will deploy a web application called eap-session-replication on JBoss EAP 7.2 or 7.3 cluster running on RHEL 7.7 or 8.0 Virtual Machine Scale Set instances.

## Resource Links:

* [Azure Hybrid Benefits](https://docs.microsoft.com/azure/virtual-machines/windows/hybrid-use-benefit-licensing)
* [Configuring a Java app for Azure App Service](https://docs.microsoft.com/azure/app-service/configure-language-java)
* [JBoss EAP on Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)
* [JBoss EAP on Azure App Service Linux](https://docs.microsoft.com/azure/app-service/quickstart-java) Quickstart
* [How to deploy JBoss EAP onto Azure App Service](https://github.com/JasonFreeberg/jboss-on-app-service) tutorial

## Next steps

* Learn more about [JBoss EAP 7.2](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/)
* Learn more about [JBoss EAP 7.3](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.3/)
* Learn more about [Red Hat Subscription Management](https://access.redhat.com/products/red-hat-subscription-management)
* Microsoft docs for [Red Hat on Azure](https://aka.ms/rhel-docs)
* Deploy [JBoss EAP on RHEL VM/Virtual Machine Scale Set from Azure Marketplace](https://aka.ms/AMP-JBoss-EAP)
* Deploy [JBoss EAP on RHEL VM/Virtual Machine Scale Set from Azure Quickstart](https://aka.ms/Quickstart-JBoss-EAP)
