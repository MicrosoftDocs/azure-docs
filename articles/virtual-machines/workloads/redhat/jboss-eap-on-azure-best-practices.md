---
title: Quickstart - Red Hat JBoss EAP on Azure Best Practices
description: This guide provides information on the best practices for using Red Hat JBoss Enterprise Application Platform in Microsoft Azure.
ms.author: bicnguy
ms.topic: quickstart
ms.service: virtual-machines-linux
ms.subservice: workloads
ms.assetid: d5dddfe6-631e-4d6b-a392-8e6e6c81fd3b
ms.date: 11/16/2020
---

# Red Hat JBoss EAP on Azure Best Practices

This quickstart is a Best Practices guide for using Red Hat JBoss Enterprise Application Platform on Microsoft Azure. JBoss EAP 7 can be used with the Microsoft Azure platform, as long as you use it within the specific supported configurations for running JBoss EAP in Azure. If you are configuring a clustered JBoss EAP environment, you must apply the specific configurations necessary to use JBoss EAP clustering features in Azure. This quickstart details the supported configurations of using JBoss EAP in Microsoft Azure.

Red Hat JBoss Enterprise Application Platform (JBoss EAP) 7.3 is a Jakarta EE 8 compatible implementation for both Web Profile and Full Platform specifications and is also a certified implementation of the Java Enterprise Edition (Java EE) 8 specification. Major versions of JBoss EAP are forked from the WildFly community project at certain points when the community project has reached the desired feature completeness level. After that point, an extended period of testing and productization takes place in which JBoss EAP is stabilized, certified, and enhanced for production use. During the lifetime of a JBoss EAP major version, selected features may be cherry-picked and back-ported from the community project into a series of feature enhancing minor releases within the same major version family.

## Supported and Unsupported Configurations

The only virtual machine operating systems supported for using JBoss EAP in Microsoft Azure are:

* Red Hat Enterprise Linux 7 or above
* Microsoft Windows Server 2012 R2
* Microsoft Windows Server 2016

The Red Hat Cloud Access program allows you to use a JBoss EAP subscription to install JBoss EAP on your Azure virtual machine or one of the above On-Demand operating systems from the Microsoft Azure Marketplace. Note that virtual machine operating system subscriptions are separate from a JBoss EAP subscription. Red Hat Cloud Access is a Red Hat subscription feature that provides support for JBoss EAP on Red Hat certified cloud infrastructure providers, such as Microsoft Azure. Red Hat Cloud Access allows you to move your subscriptions between traditional servers and public cloud-based resources in a simple and cost-effective manner.

You can find more information about [Red Hat Cloud Access on the Customer Portal](https://www.redhat.com/en/technologies/cloud-computing/cloud-access).

Every Red Hat JBoss EAP release is tested and supported on a variety of market-leading operating systems, Java Virtual Machines (JVMs), and database combinations. Red Hat provides both production and development support for supported configurations and tested integrations according to your subscription agreement in both physical and virtual environments. Other than the above operating system restrictions, check [supported configurations for JBoss EAP](https://access.redhat.com/articles/2026253), such as supported Java Development Kit (JDK) vendors and versions. It gives you information on supported configurations of various JBoss EAP versions like 7.0, 7.1, 7.2, and 7.3. Check the [Product/Configuration Matrix for Microsoft Azure](https://access.redhat.com/articles/product-configuration-for-azure) for supported RHEL operating systems, VM minimum capacity requirements, and information about other supported Red Hat products. Check [Certified Cloud Provider/Microsoft Azure](https://access.redhat.com/ecosystem/cloud-provider/2068823) for Red Hat software products certified to operate in Microsoft Azure.

There are some unsupported features when using JBoss EAP in a Microsoft Azure environment.

* Managed Domains - The managed domain operating mode allows for the management of multiple JBoss EAP instances from a single control point. Unfortunately, JBoss EAP managed domains are not supported in Microsoft Azure. Only standalone JBoss EAP server instances are supported. Note that configuring JBoss EAP clusters using standalone JBoss EAP servers is supported in Azure.

* ActiveMQ Artemis High Availability Using a Shared Store - JBoss EAP messaging high availability using Artemis shared stores is not supported in Microsoft Azure.

* mod_custer Advertising - You cannot use JBoss EAP as an Undertow mod_cluster proxy load balancer, the mod_cluster advertisement functionally is unsupported because of Azure UDP multicast limitations.

## Other Features of JBoss EAP

JBoss EAP provides pre-configured options for features such as high-availability clustering, messaging, and distributed caching. It also enables users to write, deploy, and run applications using the various APIs and services that JBoss EAP provides.

* Jakarta EE compatible - Jakarta EE 8 compatible implementation for both Web Profile and Full Platform specifications.

* Java EE compliant - Java Enterprise Edition 8 full platform and Web Profile certified

* Management console and management CLI - Standalone server management interfaces. The management CLI also includes a batch mode that can script and automate management tasks. Directly editing the JBoss EAP XML configuration files is not recommended.

* Simplified directory layout - The modules directory contains all application server modules. The standalone directories contain the artifacts and configuration files for standalone deployments.

* Modular class-loading mechanism - Modules are loaded and unloaded on demand. This improves performance, has security benefits, and reduces start-up and restart times.

* Streamlined datasource management - Database drivers are deployed like other services. In addition, datasources are created and managed using the management console and management CLI.

* Unified security framework - Elytron provides a single unified framework that can manage and configure access for standalone servers. It can also be used to configure security access for applications deployed to JBoss EAP servers.

## Creating Your Microsoft Azure Environment

You must create the virtual machines that will host your JBoss EAP instances in your Microsoft Azure environment. The virtual machines must use an Azure size of Standard_A2 or higher. You can use either the Azure On-Demand premium images to create your virtual machines or create your own virtual machines manually. For example, you can deploy Red Hat Enterprise Linux virtual machines as follows :

* Using the On-Demand Marketplace Red Hat Enterprise Linux 7 image in Azure - There are several offers in Azure Marketplace from where you can select the RHEL VM that you want to set up the JBoss EAP. Visit [deploy RHEL 7 VM from Azure Marketplace](https://access.redhat.com/articles/2421451). While choosing Red Hat Enterprise Linux image from Azure Marketplace, you have 2 options for choosing the RHEL OS licensing, you can either choose Pay-As-You-Go (PAYG) or Bring-Your-Own-Subscription (BYOS) via Red Hat Gold Image model. Note that if you have deployed Red Hat Enterprise Linux VM using PAYG plan, do not register your system again with RHEL license, or else it will lead to double billing. You can deploy Red Hat Enterprise Linux with BYOS plan using Red Hat Cloud Access.

* [Manually creating and provisioning a Red Hat Enterprise Linux 7 image for Azure](https://access.redhat.com/articles/uploading-rhel-image-to-azure). Use the latest minor version of each major version of RHEL.

For Microsoft Windows Server virtual machines, see the [Microsoft Azure documentation](https://docs.microsoft.com/azure/virtual-machines/windows/overview) for instructions on creating a Windows Server virtual machine in Microsoft Azure.

## JBoss EAP Installation

Once your virtual machine is set up, you can install the JBoss EAP. For installing JBoss EAP you need access to [Red Hat Customer Portal](https://access.redhat.com), which is the centralized platform for Red Hat knowledge and subscription resources. To get familiarized with EAP, you can try out [JBoss EAP evaluation subscription](https://access.redhat.com/products/red-hat-jboss-enterprise-application-platform/evaluation) before you get started. Note that this subscription is not intended for production use.

We have used the variable *EAP_HOME* to denote the path to the JBoss EAP installation. Replace this variable with the actual path to your JBoss EAP installation.

There are several different ways to install JBoss EAP. Each method is best used in certain situations. If you are using a Red Hat Enterprise Linux On-Demand virtual machine from the Microsoft Azure Marketplace, you must install JBoss EAP using the ZIP or installer methods. You must not register a Red Hat Enterprise Linux On-Demand virtual machine to Red Hat Subscription Management, as you will be billed twice for that virtual machine since it uses Pay-as-you-go billing method.

* ZIP Installation - The ZIP archive is suitable for installation on all supported operating systems. This method should be used if you wish to extract the instance manually. The ZIP installation provides a default installation of JBoss EAP, and all configuration must be done following installation. If you plan to use JBoss ON to deploy and install JBoss EAP patches, the target JBoss EAP instances must be installed using the ZIP installation method. Please check the [Zip Installation method](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html-single/installation_guide/index#zip_installation) for more details.

* JAR Installer - The JAR installer can either be run in a console or as a graphical wizard. Both options provide step-by-step instructions for installing and configuring the server instance. This is the preferred method to install JBoss EAP on all supported platforms. For more information about check [JAR Installer](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html-single/installation_guide/index#installer_installation).

* RPM Installation - JBoss EAP can be installed using RPM packages on supported installations of Red Hat Enterprise Linux 6, Red Hat Enterprise Linux 7, and Red Hat Enterprise Linux 8. This method is best suited when you are planning to automate the installation of EAP on your RHEL VM on Azure because RPM installation of JBoss EAP installs everything that is required to run JBoss EAP as a service. For more information about check [RPM Installation](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html-single/installation_guide/index#rpm_installation).


## Other offers by Azure and Red Hat

Red Hat and Microsoft have partnered to bring a set of Azure solution templates to the Azure Marketplace to provide a solid starting point for migrating to Azure. Consult the documentation for the list of offers and choose a suitable environment.

**Azure Marketplace Offers**

Red Hat in partnership with Microsoft has published the following offerings in Azure Marketplace. You can access these offers from [Azure Marketplace](https://azuremarketplace.microsoft.com/)

It includes various combinations of EAP and RHEL versions to support your requirements on either standalone RHEL VM or clustered RHEL VMSS. JBoss EAP licensing is always BYOS(Bring-Your-Own-Subscription) whereas for RHEL OS you can choose from BYOS(Bring-Your-Own-Subscription) or PAYG(Pay-As-You-Go). Following are the 12 plans we provide for EAP on RHEL offer.

* JBoss EAP 7.2 on RHEL 7.7 VM(BYOS)
* JBoss EAP 7.2 on RHEL 7.7 VM(PAYG)
* JBoss EAP 7.2 on RHEL 8.0 VM(BYOS)
* JBoss EAP 7.2 on RHEL 8.0 VM(PAYG)
* JBoss EAP 7.3 on RHEL 8.0 VM(BYOS)
* JBoss EAP 7.3 on RHEL 8.0 VM(PAYG)
* JBoss EAP 7.2 on RHEL 7.7 VMSS(BYOS)
* JBoss EAP 7.2 on RHEL 7.7 VMSS(PAYG)
* JBoss EAP 7.2 on RHEL 8.0 VMSS(BYOS)
* JBoss EAP 7.2 on RHEL 8.0 VMSS(PAYG)
* JBoss EAP 7.3 on RHEL 8.0 VMSS(BYOS)
* JBoss EAP 7.3 on RHEL 8.0 VMSS(PAYG)

**Azure QuickStart Templates**

Along with Azure Marketplace offers, there are quickstart templates made available for you to give a quick start to EAP on Azure environment. These quickstarts include pre-built ARM templates and script to deploy JBoss EAP on Azure in various configurations and version combinations. Solution architecture includes:

* JBoss EAP on standalone RHEL VM
* JBoss EAP clustered across Multiple RHEL VMs
* JBoss EAP clustered using VMSS (Azure Virtual Machine Scale Set)

Note that the users also have the option to choose between the Red Hat Enterprise Linux versions 7.7 and 8.0 and JBoss EAP versions 7.2 and 7.3. Users can select one of the following combinations for deployment.

- JBoss EAP 7.2 on RHEL 7.7
- JBoss EAP 7.2 on RHEL 8.0
- JBoss EAP 7.3 on RHEL 8.0

You can choose to start with one of the quickstart templates with required JBoss EAP on RHEL combination which meets your desired deployment goal. Following is the list of available quickstart templates.

* <a href="https://github.com/Azure/azure-quickstart-templates/tree/master/jboss-eap-standalone-rhel" target="_blank"> JBoss EAP on RHEL (stand-alone VM)</a> - This Azure template deploys a web application named JBoss-EAP on Azure on JBoss EAP 7.2/EAP 7.3 running on RHEL 7.7/8.0 VM.

* <a href="https://github.com/Azure/azure-quickstart-templates/tree/master/jboss-eap-clustered-multivm-rhel" target="_blank"> JBoss EAP on RHEL (clustered, multi-VM)</a> - This Azure template deploys a web application called eap-session-replication on JBoss EAP 7.2/EAP 7.3 cluster running on 'n' number RHEL 7.7/8.0 VMs where n is decided by the user and all the VMs are added to the backend pool of a Load Balancer.

* <a href="https://github.com/Azure/azure-quickstart-templates/tree/master/jboss-eap-clustered-vmss-rhel" target="_blank"> JBoss EAP on RHEL (clustered, VMSS)</a> - This Azure template deploys a web application called eap-session-replication on JBoss EAP 7.2/EAP 7.3 cluster running on RHEL 7.7/8.0 VMSS instances.

## Configuring JBoss EAP to Work on Cloud Platforms

Once you install the JBoss EAP in your virtual machine, you can configure JBoss EAP to run as a service. Configuring JBoss EAP to run as a service depends on the JBoss EAP installation method and type of virtual machine OS. Note that RPM installation of JBoss EAP installs everything that is required to run JBoss EAP as a service. For more information check [Configuring JBoss EAP to run as a service](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html-single/installation_guide/index#configuring_jboss_eap_to_run_as_a_service).

### Starting and Stopping JBoss EAP

#### Starting JBoss EAP

JBoss EAP is supported on Red Hat Enterprise Linux, and Windows Server, and runs only in a standalone server operating mode. The specific command to start JBoss EAP depends on the underlying platform. Servers are initially started in a suspended state and will not accept any requests until all required services have started, at which time the servers are placed into a normal running state and can start accepting requests. Following is the command to start the JBoss EAP as a Standalone server :

- Command to start the JBoss EAP (installed via ZIP or installer method) as a Standalone server in RHEL VM :

    ```
    $EAP_HOME/bin/standalone.sh
    ```

- For Windows Server use the `EAP_HOME\bin\standalone.bat` script to start the JBoss EAP as a Standalone server. 

- Starting JBoss EAP is different for an RPM installation compared to a ZIP or installer installation. For example, for Red Hat Enterprise Linux 7 and later, you must use the following command :

    ```
    systemctl start eap7-standalone.service
    ```

The startup script used to start the JBoss EAP (installed via ZIP or installer method) uses the `EAP_HOME/bin/standalone.conf` file, or `standalone.conf.bat` for Windows Server, to set some default preferences, such as JVM options. You can customize the settings in this file. JBoss EAP uses the *standalone.xml* configuration file by default, but can be started using a different one. For changing the default configuration file used for starting JBoss EAP installed via RPM method you can use /etc/opt/rh/eap7/wildfly/eap7-standalone.conf. You can use the same eap7-standalone.conf file to make other configuration changes like WildFly bind address.

For details on the available standalone configuration files and how to use them, check the [Standalone Server Configuration Files](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html-single/configuration_guide/index#standalone_server_configuration_files).

To start JBoss EAP with a different configuration, use the --server-config argument. For a complete listing of all available startup script arguments and their purposes, use the --help argument or check the [Server Runtime Arguments](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html-single/configuration_guide/index#reference_of_switches_and_arguments_to_pass_at_server_runtime)

#### Stopping JBoss EAP

The way that you stop JBoss EAP depends on how it was started. Press `Ctrl+C` in the terminal where JBoss EAP was started to stop an Interactive Instance of JBoss EAP. To stop the background instance of JBoss EAP use the management CLI to connect to the running instance and shut down the server. For more details check [Stopping JBoss EAP](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html-single/configuration_guide/index#stopping_jboss_eap).

Stopping JBoss EAP is different for an RPM installation compared to a ZIP or installer installation. The command for stopping an RPM installation of JBoss EAP depends on which operating mode you want to start, standalone mode (only mode supported in Azure) and which Red Hat Enterprise Linux version you are running.

- For example, for Red Hat Enterprise Linux 7 and later, you must use the following command :

    ```
    systemctl stop eap7-standalone.service
    ```

JBoss EAP can also be suspended or shut down gracefully. This allows active requests to complete normally, without accepting any new requests. Once the server has been suspended, it can be shut down, returned back to a running state, or left in a suspended state to perform maintenance. While the server is suspended, management requests are still processed. The server can be suspended and resumed using the management console or the management CLI.

### Configuring JBoss EAP Subsystems to Work on Cloud Platforms

Many of the APIs and capabilities that are exposed to applications deployed to JBoss EAP are organized into subsystems. These subsystems can be configured by administrators to provide different behavior, depending on the goal of the application. For more details on the subsystems, check [JBoss EAP Subsystems](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html-single/configuration_guide/index#jboss_eap_subsystems).

Some JBoss EAP subsystems must be configured to work properly on cloud platforms. This is required because a JBoss EAP server is usually bound to a cloud virtual machine’s private IP address, which is only visible from within the cloud platform. For certain subsystems, this address must also be mapped to a server’s public IP address, which is visible from outside the cloud. For more details on how to modify these subsystems check [Configuring JBoss EAP Subsystems to Work on Cloud Platforms](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html-single/using_jboss_eap_in_microsoft_azure/index#configuring_subsystems_for_cloud_platforms)

## Using JBoss EAP High Availability in Microsoft Azure

Microsoft Azure does not support JGroups discovery protocols that are based on UDP multicast. JGroups uses the UDP stack by default, make sure you change that to TCP since Azure does not support UDP. Although you can use other JGroups discovery protocols like TCPPING, JDBC_PING, we would recommend the shared file discovery protocol specifically developed for Azure which is the *Azure_PING*.

*AZURE_PING* uses a common blob container in a Microsoft Azure storage account. If you do not already have a blob container that AZURE_PING can use, create one that your virtual machines can access. For more information, check [Configuring JBoss EAP High Availability in Microsoft Azure](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html-single/using_jboss_eap_in_microsoft_azure/index#using_jboss_eap_high_availability_in_microsoft_azure).

You can also configure JBoss EAP with load balancing environment by ensuring that all balancers and workers are bound to IP addresses that are accessible on your internal Microsoft Azure virtual network. For more details on this please check [Installing and Configuring a Red Hat Enterprise Linux 7.4 (and later) High-Availability Cluster on Microsoft Azure](https://access.redhat.com/articles/3252491).

## Other Best Practices

- As an administrator of an EAP setup on virtual machine (VM), ensuring that your VM is as secure as possible significantly lowers the risk of your guest and host OSs being infected by malicious software. This reduces attack on JBoss EAP and malfunctioning of applications hosted on JBoss EAP. You can control the access to the Azure VMs using Azure features like Azure Policies and Azure Build-in roles. You can protect your VM against malware by installing Microsoft Antimalware or a Microsoft partner’s endpoint protection solution and integrating your antimalware solution with Azure Security Center to monitor the status of your protection. In case of RHEL VMs you can protect it by blocking port forwarding and blocking root login. These can be disabled in the */etc/ssh/sshd_config* file.

- You can use environment variables to make your experience easy and smooth with JBoss EAP on Azure VMs. For example, you can you EAP_HOME to denote the path to the JBoss EAP installation which will be used several times. In such cases environment variables will come in handy. Environment variables are also a common means of configuring services and handling web application secrets. When an environment variable is set from the shell using the export command, its existence ends when the user’s sessions ends. This is problematic when we need the variable to persist across sessions. To make an environment persistent for a user’s environment, we export the variable from the user’s profile script. You can add the export command for every environment variable you want to persist in the bash_profile. If you want to set permanent Global environment variable for all the users who have access to the VM, you can add it to the default profile. It is recommended to store global environment variables in a directory named /etc/profile.d, where you will find a list of files that are used to set environment variables for the entire system. Using the set command to set system environment variables in a Windows Server command prompt will not permanently set the environment variable. You must use either the *setx* command, or the System interface in the Control Panel.

- You need to manage your VM updates and upgrades. Use the [Update Management](https://docs.microsoft.com/azure/automation/update-management/overview) solution in Azure Automation to manage operating system updates for your Windows and Linux computers that are deployed in Azure. You can quickly assess the status of available updates on all agent computers and manage the process of installing required updates for servers. Updating the VM software ensures that important Microsoft Azure patches, Hypervisor drivers, and software packages stay current. In-place upgrades are possible for minor releases, for instance, from RHEL 6.9 to RHEL 6.10 or RHEL 7.3 to RHEL 7.4. This type of upgrade can be performed by running the *yum update* command. Microsoft Azure does not support an in-place upgrade of a major release, for instance, from RHEL 6 to RHEL 7.

- You use [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/data-platform) to gain visibility into your resource’s health. Azure Monitor features includes [Resource diagnostic log files](https://docs.microsoft.com/azure/azure-monitor/platform/platform-logs-overview) which monitors your VM resources and identifies potential issues that might compromise performance and availability. [Azure Diagnostics extension](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostics-extension-overview) can provide monitoring and diagnostics capabilities on Windows VMs. You can enable these capabilities by including the extension as part of the Azure Resource Manager template. You must enable Boot Diagnostics which is an important tool to use when troubleshooting a VM that will not boot. The console output and the boot log can greatly assist Red Hat Technical Support when resolving a boot issue. You can enable Boot Diagnostics in the Microsoft Azure portal while creating a virtual machine or on an existing running virtual machine. Once it is enabled you can view the console output for the VM and download the boot log for troubleshooting.

- Another way to ensure secure communication is to use private and virtual private networks (VPNs). Unlike open networks which are accessible to the outside world and therefore susceptible to attacks from malicious users, private and virtual private networks restrict access to selected users. Private networks use a private IP to establish isolated communication channels between servers within the same range. This allows multiple servers under the same account to exchange information and data without exposure to a public space. You can connect to a remote server as if doing it locally through a private network using different methods like using a JumpVM in the same Virtual Network as that of the Application server, using Virtual Network Peering, Application Gateway, etc. All these methods enable an entirely secure and private connection and can connect multiple remote servers.

- You can also use an Azure network security group to filter network traffic to and from the Application server in the Azure virtual network. A network security group contains security rules that allow or deny inbound network traffic to, or outbound network traffic from, several types of Azure resources. For each rule, you can specify source and destination, port, and protocol. You can protect your application on JBoss EAP by using these network security group rules and block/allow ports to the internet.

- For better functionality of Application running on JBoss EAP on Azure, you can use the high availability feature available in Azure. High-availability in Azure can be achieved using Azure resources such as Load-Balancer, Application Gateway, or Virtual Machine Scale Set. These will provide redundancy and improved performance. This also allows you to easily perform maintenance or update an application instance, by distributing the load to another available application instance. To keep up with additional customer demand, you may need to increase the number of application instances that run your application. Virtual Machine scale set also have auto-scaling feature which allows your application to automatically scale as demand changes.

## Optimizing the JBoss EAP Server Configuration

Once you have installed the JBoss EAP server, and you have created a management user, you can optimize your server configuration. Make sure you review information in the [Performance Tuning Guide](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html-single/performance_tuning_guide/index) for information about how to optimize the server configuration to avoid common problems when deploying applications in a production environment

## Resource Links

* Learn more about [JBoss EAP](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html/getting_started_with_jboss_eap_for_openshift_online/introduction)
* Learn more about [Red Hat Subscription Manager (Cloud Access)](https://access.redhat.com/documentation/en/red_hat_subscription_management/1/html-single/red_hat_cloud_access_reference_guide/index)
* Learn more about [Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)
* [MS Docs for Red Hat on Azure](https://aka.ms/rhel-docs)

## Support

For any support related questions, issues or customization requirements, please contact [Red Hat Support](https://access.redhat.com/support).
