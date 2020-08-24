---
title: Quickstart - JBoss EAP on Azure RHEL VM and VMSS
description: How to deploy enterprise Java applications using Red Hat JBoss EAP on an Azure RHEL VM and VMSS.
author: theresa-nguyen
ms.author: bicnguy
ms.topic: quickstart
ms.service: virtual-machines-linux
ms.subservice: workloads
ms.assetid: 8a4df7bf-be49-4198-800e-db381cda98f5
ms.date: 08/23/2020
---

# Deploy enterprise Java applications to Azure with JBoss EAP on Red Hat Enterprise Linux

These Quickstart templates will show you how to deploy [JBoss Enterprise (EAP)](https://www.redhat.com/en/technologies/jboss-middleware/application-platform) on [Red Hat Enterprise Linux (RHEL)](https://www.redhat.com/technologies/linux-platforms/enterprise-linux) to Azure Virtual Machines (VM) and Virtual Machine Scale Sets (VMSS), run a sample Java app and validate your deployment. JBoss EAP is an open-source application server platform that delivers enterprise-grade security, scalability, and performance. RHEL is an open-source operating system (OS) platform, where you can scale existing apps and roll out emerging technologies across all environments. JBoss EAP and RHEL include everything needed to build, run, deploy, and manage enterprise Java applications in any environment, including on-premises, virtual environments, and in private, public, or hybrid clouds.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, you can activate your [Azure credits for Visual Studio subscribers](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or [create an account for free](https://azure.microsoft.com/pricing/free-trial).

* JBoss EAP installation - You need to have a Red Hat Account and your Red Hat Subscription Management (RHSM) account must have JBoss EAP entitlement to download the Red Hat tested and certified JBoss EAP version.  If you don't have EAP entitlement, obtain a [JBoss EAP evaluation subscription](https://access.redhat.com/products/red-hat-jboss-enterprise-application-platform/evaluation) before you get started. If you would like to create a new Red Hat subscription, go to [Red Hat Customer Portal](https://access.redhat.com/) and set up an account.

* [Azure Command-Line Interface](https://docs.microsoft.com/en-us/cli/azure/overview).

* RHEL options - Choose between Pay-As-You-Go (PAYG) or Bring-Your-Own-Subscription (BYOS). For BYOS, you will need to activate your [Red Hat Cloud Access](https://access.redhat.com/) RHEL Gold Image.

## JBoss EAP use case

### Migrate to JBoss EAP
JBoss EAP 7.2 and 7.3 are certified implementations of the Java Enterprise Edition (Java EE) 8 specification. JBoss EAP provides preconfigured options for features such as high-availability (HA) clustering, messaging, and distributed caching. It also enables users to write, deploy, and run applications using the various APIs and services that JBoss EAP provides.  For additional information on JBoss EAP, visit [Introduction to JBoss EAP 7.2](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.2/html-single/introduction_to_jboss_eap/index#about_eap).
 or [Introduction to JBoss EAP 7.3](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.3/html/introduction_to_jboss_eap/index).

 You can develop the following applications with JBoss EAP:

* Web Services Applications - Web services provide a standard means of interoperating among different software applications. Each application can run on a variety of platforms and frameworks. Web services facilitate internal, heterogeneous subsystem communication. To learn more about web service development visit [Developing Web Services](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/html/developing_web_services_applications/index).

* EJB Applications - Enterprise JavaBeans (EJB) 3.2 is an API for developing distributed, transactional, secure, and portable Java EE applications through the use of server-side components called Enterprise Beans. Enterprise Beans implement the business logic of an application in a decoupled manner that encourages reuse. Learn more by visiting [Developing EJB Applications](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/html/developing_ejb_applications/index).

* Hibernate Applications - Developers and administrators can develop and deploy JPA/Hibernate applications with JBoss EAP. Hibernate Core is an object-relational mapping framework for the Java language. It provides a framework for mapping an object-oriented domain model to a relational database, allowing applications to avoid direct interaction with the database. Hibernate EntityManager implements the programming interfaces and lifecycle rules as defined by the [Java Persistence API (JPA) 2.1 specification](https://www.jcp.org/jsr/detail?id=338). Together with Hibernate Annotations, this wrapper implements a complete (and standalone) JPA solution on top of the mature Hibernate Core. Additional information on [Developing Hibernate Applications](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.2/html/development_guide/java_persistence_api) is available from Red Hat. 

### Migrate from on-premises to Azure
The Azure Marketplace offer of JBoss EAP on RHEL will install and provision Azure VMs or VMSS in less than 20 minutes. You will have a Load Balancer (LB), Private IP for LB and VMs, Virtual Network (VNet) with a single subnet, cluster, or stand-alone setup, Network Security Group (NSG), and a sample Java app. 

## Server configuration choice

For deployment of RHEL VM, you can either choose between Pay-As-You-Go (PAYG) or Bring-Your-Own-Subscription (BYOS). If you choose the VM image from the [Azure Marketplace](https://azuremarketplace.microsoft.com) this offer defaults to a PAYG image.  If you have a RHEL OS image that you want to use, then you can deploy a BYOS type RHEL VM. Make sure your RHSM account has BYOS entitlement via Cloud Access. 

In addition to providing functionality and APIs to its applications, JBoss EAP has powerful management capabilities. These management capabilities differ depending on which operating mode is used to start JBoss EAP. JBoss EAP is supported on RHEL and Windows Server. JBoss EAP offers a standalone server operating mode for managing discrete instances and a managed domain operating mode for managing groups of instances from a single control point. Note JBoss EAP-managed domains are not supported in Microsoft Azure since the High Availability (HA) feature is managed by Azure infrastructure services. The environment variable named *EAP_HOME* is used to denote the path to the JBoss EAP installation. 

- **Start JBoss EAP as a Standalone Server** - the following command is how you start EAP service in Standalone Mode.

    `$EAP_HOME/bin/standalone.sh`
    
    This startup script uses the EAP_HOME/bin/standalone.conf file to set some default preferences, such as JVM options. Settings can be customized in this file. JBoss EAP uses the standalone.xml configuration file to start on Standalone mode by default, but can be started using a different mode. For details on the available standalone configuration files and how to use them, see the [Standalone Server Configuration Files](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/html/configuration_guide/jboss_eap_management#standalone_server_configuration_files) section. To start JBoss EAP with a different configuration, use the --server-config argument. For example:
    
    `$EAP_HOME/bin/standalone.sh --server-config=standalone-full.xml`
    
    For a complete listing of all available startup script arguments and their purposes, use the --help argument or see the [Server Runtime Arguments](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/html/configuration_guide/reference_material#reference_of_switches_and_arguments_to_pass_at_server_runtime) section.
    
JBoss EAP can also work in Cluster mode, check out [JBoss EAP Clustering](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/html/configuring_messaging/clusters_overview) to learn more. JBoss EAP cluster messaging allows grouping of JBoss EAP messaging servers to share message processing load. Each active node in the cluster is an active JBoss EAP messaging server, which manages its own messages and handles its own connections.

## Support and subscription notes

These Quickstart templates are offered as:  

- RHEL OS is offered as Pay-As-You-Go (PAYG) or Bring-Your-Own-Subscription (BYOS).
- JBoss EAP is offered as BYOS only.

#### Using RHEL OS with PAYG Model

By default these Quickstart templates use the On-Demand Red Hat Enterprise Linux 7.7 or 8.0 Pay-As-You-Go (PAYG) image from the Azure Gallery. When using this On-Demand image, there is an additional hourly RHEL subscription charge for using this image on top of the normal compute, network, and storage costs. At the same time, the instance will be registered to your Red Hat subscription, so you will also be using one of your entitlements. This On-Demand image will lead to "double billing". To avoid this issue, you would need to build your own RHEL image, which is defined in this [Red Hat KB article](https://access.redhat.com/articles/uploading-rhel-image-to-azure) or activate your [Red Hat Cloud Access](https://access.redhat.com/) RHEL Gold Image.

Check out [Red Hat Enterprise Linux pricing](https://azure.microsoft.com/pricing/details/virtual-machines/red-hat/) for details on the PAYG model. In order to use RHEL in PAYG model, you will need an Azure Subscription with the specified payment method for [RHEL 7.7 Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/RedHat.RedHatEnterpriseLinux77-ARM) and [RHEL 8.0](Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/RedHat.RedHatEnterpriseLinux80-ARM) are offers that require a payment method to be specified in the Azure Subscription). 

#### Using RHEL OS with BYOS Model

In order to use BYOS for RHEL OS Licensing, you need to have a valid Red Hat subscription with entitlements to use RHEL OS in Azure. Complete the following prerequisites in order to use RHEL OS through BYOS model before you deploy this Quickstart template.

1. Ensure you have RHEL OS and JBoss EAP entitlements attached to your Red Hat Subscription.
2. Authorize your Azure Subscription ID to use RHEL BYOS images. Follow the [Red Hat Subscription Management documentation](https://access.redhat.com/documentation/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/con-enable-subs) to complete the process, which includes these steps:

    2.1 Enable Microsoft Azure as provider in your Red Hat Cloud Access Dashboard.

    2.2 Add your Azure Subscription IDs.

    2.3 Enable new products for Cloud Access on Microsoft Azure.
    
    2.4 Activate Red Hat Gold Images for your Azure Subscription. For more information, see [Red Hat Subscription Management](https://access.redhat.com/documentation/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/using_red_hat_gold_images#con-gold-image-azure) for more details.

    2.5 Wait for Red Hat Gold Images to be available in your Azure subscription. These Gold Images are typically available within 3 hours.
    
3. Accept the Marketplace Terms and Conditions in Azure for the RHEL BYOS Images. You can complete this by running Azure CLI commands, as given below. For more information, see the [Red Hat Enterprise Linux BYOS Gold Images in Azure documentation](https://docs.microsoft.com/azure/virtual-machines/workloads/redhat/byos) for more details.

    3.1 Launch an Azure CLI session and authenticate with your Azure account. Refer to [Signing in with Azure CLI](https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli?view=azure-cli-latest) for assistance. Make sure you are running the latest Azure CLI version before moving on.

    3.2 Verify the RHEL BYOS images are available in your subscription by running the following CLI command. If you don't get any results here, refer to #2 and ensure that your Azure subscription is activated for RHEL BYOS images.

    `az vm image list --offer rhel-byos --all`

    3.3 Run the following command to accept the Marketplace Terms for RHEL 7.7 BYOS and RHEL 7.0 BYOS, respectively.

    `az vm image terms accept --publisher redhat --offer rhel-byos --plan rhel-lvm77`

    `az vm image terms accept --publisher redhat --offer rhel-byos --plan rhel-lvm80`

4. Your subscription is now ready to deploy RHEL BYOS virtual machines.

#### Using JBoss EAP with BYOS Model

JBoss EAP is available on Azure through the BYOS model only. When deploying this template, you need to supply your RHSM credentials along with RHSM Pool ID with valid EAP entitlements. If you don't have EAP entitlement, obtain a [JBoss EAP evaluation subscription](https://access.redhat.com/products/red-hat-jboss-enterprise-application-platform/evaluation) before you get started.

## How to consume

You can deploy the template in three following ways:

- Use PowerShell - Deploy the template by running the following commands: (Check out [Azure PowerShell](https://docs.microsoft.com/powershell/azure/?view=azps-2.8.0) for information on installing and configuring Azure PowerShell).

    `New-AzResourceGroup -Name <resource-group-name> -Location <resource-group-location> #use this command when you need to create a new resource group for your deployment`

    `New-AzResourceGroupDeployment -ResourceGroupName <resource-group-name> -TemplateUri <raw link to the template which can be obtained from github>`
    
- Use Azure CLI - Deploy the template by running the following commands: (Check out [Azure Cross-Platform Command Line](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) for details on installing and configuring the Azure Cross-Platform Command-Line Interface).

    `az group create --name <resource-group-name> --location <resource-group-location> #use this command when you need to create a new resource group for your deployment`

    `az group deployment create --resource-group <my-resource-group> --template-uri <raw link to the template which can be obtained from github>`

- Use Azure portal - You can deploy to the Azure portal by going to the GitHub links mentioned below in *ARM Template* section and clicking on **Deploy to Azure** button.

## ARM templates

* <a href="https://github.com/SpektraSystems/redhat-mw-cloud-quickstart/tree/master/jboss-eap72-standalone-rhel7" target="_blank"> JBoss EAP 7.2 on RHEL 7.7 (stand-alone VM)</a> - This Azure template deploys a web application named JBoss-EAP on Azure on JBoss EAP 7.2 running on RHEL 7.7 VM.

* <a href="https://github.com/SpektraSystems/redhat-mw-cloud-quickstart/tree/master/jboss-eap72-standalone-rhel8" target="_blank"> JBoss EAP 7.2 on RHEL 8.0 (stand-alone VM)</a> - This Azure template deploys a web application named JBoss-EAP on Azure on JBoss EAP 7.2 running on RHEL 8.0 VM.

* <a href="https://github.com/SpektraSystems/redhat-mw-cloud-quickstart/tree/master/jboss73-eap-standalone-rhel8" target="_blank"> JBoss EAP 7.3 on RHEL 8.0 (stand-alone VM)</a> - This Azure template deploys a web application named JBoss-EAP on Azure on JBoss EAP 7.3 running on RHEL 8.0 VM.

* <a href="https://github.com/SpektraSystems/redhat-mw-cloud-quickstart/tree/master/jboss-eap-clustered-multivm-rhel7" target="_blank">JBoss EAP 7.2 on RHEL 7.7 (clustered VMs)</a> - This Azure template deploys a web application called eap-session-replication on JBoss EAP 7.2 cluster running on 'n' number RHEL 7.7 VMs; where n can be specified at deployment time.

* <a href="https://github.com/SpektraSystems/redhat-mw-cloud-quickstart/tree/master/jboss-eap-clustered-multivm-rhel8" target="_blank">JBoss EAP 7.2 on RHEL 8.0 (clustered VMs)</a> - This Azure template deploys a web application called eap-session-replication on JBoss EAP 7.2 cluster running on 'n' number of RHEL 8.0 VMs; where n can be specified at deployment time.

* <a href="https://github.com/SpektraSystems/redhat-mw-cloud-quickstart/tree/master/jboss-eap73-clustered-multivm-rhel8" target="_blank"> JBoss EAP 7.3 on RHEL 8.0 (clustered VMs)</a> - This Azure template deploys a web application called eap-session-replication on JBoss EAP 7.3 cluster running on 'n' number of RHEL 8.0 VMs; where n can be specified at deployment time.

* <a href="https://github.com/SpektraSystems/redhat-mw-cloud-quickstart/tree/master/jboss-eap-clustered-vmss-rhel7" target="_blank"> JBoss EAP 7.2 on RHEL 7.7 (clustered VMSS)</a> - This Azure template deploys a web application called eap-session-replication on JBoss EAP 7.2 cluster running on RHEL 7.7 VMSS instances.

* <a href="https://github.com/SpektraSystems/redhat-mw-cloud-quickstart/tree/master/jboss-eap-clustered-vmss-rhel8" target="_blank">JBoss EAP 7.2 on RHEL 8.0 (clustered VMSS)</a> - This Azure template deploys a web application called eap-session-replication on JBoss EAP 7.2 cluster running on RHEL 8.0 VMSS instances.

* <a href="https://github.com/SpektraSystems/redhat-mw-cloud-quickstart/tree/master/jboss-eap73-clustered-vmss-rhel8" target="_blank">JBoss EAP 7.3 on RHEL 8.0 (clustered VMSS)</a> - This Azure template deploys a web application called eap-session-replication on JBoss EAP 7.3 cluster running on RHEL 8.0 VMSS instances.

## Resource Links

* Explore [JBoss EAP on Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)
* Explore [JBoss EAP on App Service Linux](https://docs.microsoft.com/azure/app-service/quickstart-java?pivots=platform-linux)
* [Azure for Java developers documentation](https://docs.microsoft.com/azure/developer/java/?view=azure-java-stable)

## Next steps

* [Learn more about JBoss EAP 7.2](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/)
* [Learn more about JBoss EAP 7.3](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.3/)
* [Learn more about Red Hat Subscription Management (RHSM)](https://access.redhat.com/products/red-hat-subscription-management)
* [MS Docs for Red Hat on Azure](https://aka.ms/rhel-docs)
* [Deploy RHEL 7.7 VM from Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/RedHat.RedHatEnterpriseLinux77-ARM?tab=Overview)
* [Deploy RHEL 8.0 VM from Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/RedHat.RedHatEnterpriseLinux80-ARM?tab=Overview)
