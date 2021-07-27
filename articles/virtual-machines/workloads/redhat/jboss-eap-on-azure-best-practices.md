---
title: Red Hat JBoss EAP on Azure Best Practices
description: The guide provides information on the best practices for using Red Hat JBoss Enterprise Application Platform in Microsoft Azure.
author: theresa-nguyen
ms.author: bicnguy
ms.topic: article
ms.service: virtual-machines
ms.subservice: redhat
ms.assetid: 195a0bfa-dff1-429b-b030-19ca95ee6abe
ms.date: 06/08/2021
---

# Red Hat JBoss EAP on Azure best practices

The Red Hat JBoss EAP on Azure Best Practices guide for using Red Hat JBoss Enterprise Application Platform (EAP) on Microsoft Azure. JBoss EAP can be used with the Microsoft Azure platform, as long as you use it within the specific supported configurations for running JBoss EAP in Azure. If you're manually configuring a clustered JBoss EAP environment, apply the specific configurations necessary to use JBoss EAP clustering features in Azure. This guide details the supported configurations of using JBoss EAP in Microsoft Azure.

JBoss EAP is a Jakarta Enterprise Edition (EE) 8 compatible implementation for both the Web Profile and Full Platform specifications. It's also a certified implementation of the Java EE 8 specification. Major versions of JBoss EAP are forked from the WildFly community project at certain points when the community project has reached the desired feature completeness level. After that point, an extended period of testing and productization takes place in which JBoss EAP is stabilized, certified, and enhanced for production use. During the lifetime of a JBoss EAP major version, selected features may be cherry-picked and back-ported from the community project. Then these features are made available in a seFries of feature enhancing minor releases within the same major version family.

## Supported and unsupported configurations of JBoss EAP on Azure

See the [JBoss EAP Supported Configurations](https://access.redhat.com/articles/2026253) documentation for details on Operating Systems (OS), Java platforms, and other supported platforms on which EAP can be used.

The Red Hat Cloud Access program allows you to use a JBoss EAP subscription to install JBoss EAP on your Azure virtual machine, which are On-Demand Pay-As-You-Go (PAYG) operating systems from the Microsoft Azure Marketplace. Virtual machine operating system subscriptions, in this case Red Hat Enterprise Linux (RHEL), is separate from a JBoss EAP subscription. Red Hat Cloud Access is a Red Hat subscription feature that provides support for JBoss EAP on Red Hat certified cloud infrastructure providers, such as Microsoft Azure. Red Hat Cloud Access allows you to move your subscriptions between traditional on-premise servers and public cloud-based resources in a simple and cost-effective manner.

You can find more information about [Red Hat Cloud Access on the Customer Portal](https://www.redhat.com/en/technologies/cloud-computing/cloud-access). Reminder, you don't need to Red Hat Cloud Access for any PAYG offers on Azure Marketplace. 

Every Red Hat JBoss EAP release is tested and supported on a various market-leading operating systems, Java Virtual Machines (JVMs), and database combinations. Red Hat provides both production and development support for supported configurations and tested integrations according to your subscription agreement. Support applies to both physical and virtual environments. Other than the above operating system restrictions, check [supported configurations for JBoss EAP](https://access.redhat.com/articles/2026253), such as supported Java Development Kit (JDK) vendors and versions. It gives you information on supported configurations of various JBoss EAP versions like 7.0, 7.1, 7.2, and 7.3. Check the [Product/Configuration Matrix for Microsoft Azure](https://access.redhat.com/articles/product-configuration-for-azure) for supported RHEL operating systems, VM minimum capacity requirements, and information about other supported Red Hat products. Check [Certified Cloud Provider/Microsoft Azure](https://access.redhat.com/ecosystem/cloud-provider/2068823) for Red Hat software products certified to operate in Microsoft Azure.

There are some unsupported features when using JBoss EAP in a Microsoft Azure environment, which includes:

- **Managed Domains** - Allows for the management of multiple JBoss EAP instances from a single control point. JBoss EAP managed domains aren't supported in Microsoft Azure today. Only stand-alone JBoss EAP server instances are supported. Configuring JBoss EAP clusters using stand-alone JBoss EAP servers is supported in Azure.

- **ActiveMQ Artemis High Availability (HA) Using a Shared Store** - JBoss EAP messaging HA using Artemis shared stores isn't supported in Microsoft Azure.

- **`mod_custer` Advertising** - You can't use JBoss EAP as an Undertow `mod_cluster` proxy load-balancer, the mod_cluster advertisement functionally is unsupported because of Azure User Datagram Protocol (UDP) multicast limitations.

## Other features of JBoss EAP on Azure

JBoss EAP provides pre-configured options for features such as HA clustering, messaging, and distributed caching. It also enables users to write, deploy, and run applications using the various APIs and services that JBoss EAP provides.

- **Jakarta EE Compatible** - Jakarta EE 8 compatible for both the Web Profile and Full Platform specifications.

- **Java EE Compliant** - Java EE 8 certified for both the Web Profile and Full Platform specifications.

- **Management Console and Management CLI** - Is for stand-alone server management interfaces. The management CLI also includes a batch mode that can script and automate management tasks. Directly editing the JBoss EAP XML configuration files isn't recommended.

- **Simplified Directory Layout** - The modules directory contains all application server modules. The stand-alone directories contain the artifacts and configuration files for stand-alone deployments.

- **Modular Class-Loading Mechanism** - Modules are loaded and unloaded on demand. Modular class-loading mechanism improves performance, has security benefits, and reduces start-up and restart times.

- **Streamlined DataSource Management** - Database drivers are deployed like other services. In addition, DataSources are created and managed using the management console and management CLI.

- **Unified Security Framework** - Elytron provides a single unified framework that can manage and configure access for stand-alone servers. It can also be used to configure security access for applications deployed to JBoss EAP servers.

## Creating your Microsoft Azure environment

Create the VMs that will host your JBoss EAP instances in your Microsoft Azure environment. Use Azure VM size of Standard_A2 or higher. You can use either the Azure On-Demand PAYG premium images to create your VMs or manually create your own VMs. For example, you can deploy RHEL VMs as follows :

* Using the On-Demand Marketplace RHEL image in Azure - There are several offers in Azure Marketplace from where you can select the RHEL VM that you want to set up the JBoss EAP. Visit [deploy RHEL 8 VM from Azure Marketplace](https://access.redhat.com/documentation//red_hat_enterprise_linux/8/html/deploying_red_hat_enterprise_linux_8_on_public_cloud_platforms/assembly_deploying-a-rhel-image-as-a-virtual-machine-on-microsoft-azure_cloud-content). You've two options for choosing the RHEL OS licensing in the Azure Marketplace. Choose either PAYG or Bring-Your-Own-Subscription (BYOS) via the Red Hat Gold Image model. Note that if you've deployed RHEL VM using PAYG plan, only your JBoss EAP subscription details are used to subscribe the resulting deployment to a Red Hat subscription.

* [Manually Creating and Provisioning a RHEL image for Azure](https://access.redhat.com/articles/uploading-rhel-image-to-azure). Use the latest minor version of each major version of RHEL.

For Microsoft Windows Server VM, see the [Microsoft Azure documentation](../../windows/overview.md) on creating a Windows Server VM in Azure.

## JBoss EAP installation

> [!NOTE]
>  If you're using the JBoss EAP on RHEL offer through Azure Marketplace, JBoss EAP is automatically installed and configured for the Azure environment.

The below steps apply if you're manually deploying EAP to a RHEL VM deployed on Microsoft Azure.

Once your VM is set up, you can install JBoss EAP. You need access to [Red Hat Customer Portal](https://access.redhat.com), which is the centralized platform for Red Hat Knowledge Base (KB) and subscription resources. If you don't have an EAP subscription, sign-up for a free developer subscription through the [Red Hat Developer Subscription for Individuals](https://developers.redhat.com/register). Once registered, look for the credentials (Pool IDs) in Subscription section of the [Red Hat Customer Portal](https://access.redhat.com/management/). Note that this subscription isn't intended for production use.

We've used the variable *EAP_HOME* to denote the path to the JBoss EAP installation. Replace this variable with the actual path to your JBoss EAP installation.

> [!IMPORTANT]
> There are several different ways to install JBoss EAP. Each method is best used in certain situations. If you're using a RHEL On-Demand VM from the Microsoft Azure Marketplace, install JBoss EAP using the ZIP or installer methods. **Do not register a RHEL On-Demand virtual machine to Red Hat Subscription Management (RHSM), as you'll be billed twice for that virtual machine since it uses PAYG billing method.

* **ZIP Installation** - The ZIP archive is suitable for installation on all supported OS. ZIP installation method should be used if you wish to extract the instance manually. The ZIP installation provides a default installation of JBoss EAP, and all configurations to be done following installation. If you plan to use JBoss Operations Network (ON) server to deploy and install JBoss EAP patches, the target JBoss EAP instances should be installed using the ZIP installation method. Check the [Zip Installation](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.3/html-single/installation_guide/index#zip_installation) for more details.

* **JAR Installer** - The JAR installer can either be run in a console or as a graphical wizard. Both options provide step-by-step instructions for installing and configuring the server instance. JAR installer is the preferred method to install JBoss EAP on all supported platforms. For more information about check [JAR Installer Installation](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.3/html-single/installation_guide/index#installer_installation).

* **RPM Installation** - JBoss EAP can be installed using RPM packages on supported installations of RHEL 6, RHEL 7, and RHEL 8. RPM installation method is best suited when you're planning to automate the installation of EAP on your RHEL VM on Azure. RPM installation of JBoss EAP installs everything that is required to run JBoss EAP as a service. For more information about check [RPM Installation](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html-single/installation_guide/index#rpm_installation).

## Other offers by Azure and Red Hat

Red Hat and Microsoft have partnered to bring a set of Azure solution templates to the Azure Marketplace to provide a solid starting point for migrating to Azure. Consult the documentation for the list of offers and choose a suitable environment.

### Azure Marketplace Offers

You can access these offers from the [Azure Marketplace](https://aka.ms/AMP-JBoss-EAP).

This Marketplace offer includes various combinations of JBoss EAP and RHEL versions with flexible support subscription models. JBoss EAP is always BYOS but for RHEL OS you can choose between BYOS or PAYG. The Azure Marketplace offer includes plan options for JBoss EAP on RHEL as stand-alone VMs, clustered VMs, and clustered virtual machine scale sets. 

The six plans include:

- JBoss EAP 7.3 on RHEL 8.3 Stand-alone VM (PAYG)
- JBoss EAP 7.3 on RHEL 8.3 Stand-alone VM (BYOS)
- JBoss EAP 7.3 on RHEL 8.3 Clustered VM (PAYG)
- JBoss EAP 7.3 on RHEL 8.3 Clustered VM (BYOS)
- JBoss EAP 7.3 on RHEL 8.3 Clustered virtual machine scale sets (PAYG)
- JBoss EAP 7.3 on RHEL 8.3 Clustered virtual machine scale sets (BYOS)

:::image type="content" source="./media/red-hat-marketplace-image-1.png" alt-text="Image shows the the option to deploy the Red Hat image using the GitHub deploy link.":::

### Azure Quickstart Templates

Along with Azure Marketplace offers, there are Quickstart templates made available for you to test drive EAP on Azure. These Quickstarts include pre-built ARM templates and script to deploy JBoss EAP on Azure in various configurations and version combinations. 

Solution architecture includes:

* JBoss EAP on RHEL Stand-alone VM
* JBoss EAP on RHEL Clustered VMs
* JBoss EAP on RHEL Clustered virtual machine scale sets

    :::image type="content" source="./media/red-hat-marketplace-image.png" alt-text="Image shows the Red Hat offers available through the Azure Marketplace.":::

You can choose between the RHEL 7.7 and 8.0 and JBoss EAP 7.2 and 7.3. You can select one of the following combinations for deployment:

- JBoss EAP 7.2 on RHEL 7.7
- JBoss EAP 7.2 on RHEL 8.0
- JBoss EAP 7.3 on RHEL 8.0

To get started, select a Quickstart template with a matching JBoss EAP on RHEL combination that meets your deployment goal. Following is the list of available Quickstart templates.

* [JBoss EAP on RHEL Stand-alone VM](https://azure.microsoft.com/resources/templates/jboss-eap-standalone-rhel/) - The Azure template deploys a web application named JBoss-EAP on Azure on JBoss EAP (version 7.2 or 7.3) running on RHEL (version 7.7 or 8.0) VM.

* [JBoss EAP on RHEL Clustered VMs](https://azure.microsoft.com/resources/templates/jboss-eap-clustered-multivm-rhel/) - The Azure template deploys a web application called eap-session-replication on JBoss EAP cluster running on 'n' number RHEL VMs. 'n' is the starting number of VMs you set at the beginning. All the VMs are added to the backend pool of a load balancer.

* [JBoss EAP on RHEL Clustered Virtual Machine Scale Sets](https://azure.microsoft.com/resources/templates/jboss-eap-clustered-vmss-rhel/) - The Azure template deploys a web application called eap-session-replication on JBoss EAP 7.2 or 7.3 cluster running on RHEL 7.7 or 8.0 virtual machine scale sets instances.

## Configuring JBoss EAP to work on cloud platforms

Once you install the JBoss EAP in your VM, you can configure JBoss EAP to run as a service. Configuring JBoss EAP to run as a service depends on the JBoss EAP installation method and type of VM OS. Note that RPM installation of JBoss EAP installs everything that is required to run JBoss EAP as a service. For more information check [Configuring JBoss EAP to run as a service](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.3/html-single/installation_guide/index#configuring_jboss_eap_to_run_as_a_service).

### Starting and stopping JBoss EAP

#### Starting JBoss EAP

JBoss EAP is supported on RHEL and Windows Server, and runs only in a stand-alone server operating mode. The specific command to start JBoss EAP depends on the underlying platform. Servers are initially started in a suspended state and won't accept any requests until all required services have started. At this time the servers are placed into a normal running state and can start accepting requests. Following is the command to start the JBoss EAP as a Stand-alone server:

- Command to start the JBoss EAP (installed via ZIP or installer method) as a Stand-alone server in RHEL VM :
    ```
    $EAP_HOME/bin/standalone.sh
    ```
- For Windows Server, use the `EAP_HOME\bin\standalone.bat` script to start the JBoss EAP as a Stand-alone server.
- Starting JBoss EAP is different for an RPM installation compared to a ZIP or JAR installer installation. For example, for RHEL 7 and later, use the following command:
    ```
    systemctl start eap7-standalone.service
    ```
The startup script used to start the JBoss EAP (installed via ZIP or installer method) uses the `EAP_HOME/bin/standalone.conf` file, or `standalone.conf.bat` for Windows Server, to set some default preferences, such as JVM options. Customize the settings in this file. JBoss EAP uses the `standalone.xml` configuration file by default, but can be started using a different one. To change the default configuration file used for starting JBoss EAP installed via RPM method, use `/etc/opt/rh/eap7/wildfly/eap7-standalone.conf`. Use the same eap7-standalone.conf file to make other configuration changes like WildFly bind address.

For details on the available stand-alone configuration files and how to use them, check the [Stand-alone Server Configuration Files](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.3/html-single/configuration_guide/index#standalone_server_configuration_files).

To start JBoss EAP with a different configuration, use the --server-config argument. For a complete listing of all available startup script arguments and their purposes, use the --help argument or check the [Server Runtime Arguments](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.3/html-single/configuration_guide/index#reference_of_switches_and_arguments_to_pass_at_server_runtime)

#### Stopping JBoss EAP

The way that you stop JBoss EAP depends on how it was started. Press `Ctrl+C` in the terminal where JBoss EAP was started to stop an interactive instance of JBoss EAP. To stop the background instance of JBoss EAP, use the management CLI to connect to the running instance and shut down the server. For more details, check [Stopping JBoss EAP](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.3/html-single/configuration_guide/index#stopping_jboss_eap).

Stopping JBoss EAP is different for an RPM installation compared to a ZIP or installer installation. The command for stopping an RPM installation of JBoss EAP depends on which operating mode you want to start and which RHEL version you're running. Stand-alone mode is only mode supported in Azure. 

- For example, for RHEL 7 and later, use the following command:
    ```
    systemctl stop eap7-standalone.service
    ```
JBoss EAP can also be suspended or shut down gracefully, allowiing active requests to complete normally, without accepting any new requests. Once the server has been suspended, it can be shut down, returned back to a running state, or left in a suspended state to do maintenance. While the server is suspended, management requests are still processed. The server can be suspended and resumed using the management console or the management CLI.

### Configuring JBoss EAP subsystems to work on cloud platforms

Many of the APIs and capabilities that are exposed to applications deployed to JBoss EAP are organized into subsystems. These subsystems can be configured by administrators to provide different behavior, depending on the goal of the application. For more details on the subsystems, check [JBoss EAP Subsystems](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.3/html-single/configuration_guide/index#jboss_eap_subsystems).

Some JBoss EAP subsystems requires configuration to work properly on cloud platforms. Configuration is required because a JBoss EAP server is bound to a cloud VM’s private IP address. Private IP is only visible from within the cloud platform. For certain subsystems, the private IP address needs to be mapped to the server’s public IP address, which is visible from outside the cloud. For more details on how to modify these subsystems, check [Configuring JBoss EAP Subsystems to Work on Cloud Platforms](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.3/html-single/using_jboss_eap_in_microsoft_azure/index#configuring_subsystems_for_cloud_platforms)

## Using JBoss EAP high availability in Microsoft Azure

Azure don't support JGroups discovery protocols that are based on UDP multicast. JGroups uses the UDP stack by default, make sure you change that to TCP since Azure don't support UDP. Although you can use other JGroups discovery protocols like TCPPING, JDBC_PING, we recommend the shared file discovery protocol developed for Azure, which is *Azure_PING*.

*AZURE_PING* uses a common blob container in a Microsoft Azure storage account. If you don't already have a blob container that AZURE_PING can use, create one that your VM can access. For more information, check [Configuring JBoss EAP High Availability in Microsoft Azure](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.3/html-single/using_jboss_eap_in_microsoft_azure/index#using_jboss_eap_high_availability_in_microsoft_azure).

Configure JBoss EAP with load-balancing environment. Ensure that all balancers and workers are bound to accesible IP addresses in your internal Microsoft Azure Virtual Network (VNet). For more details on load-balancing configuration, check [Installing and Configuring a Red Hat Enterprise Linux 7.4 (and later) High-Availability Cluster on Microsoft Azure](https://access.redhat.com/articles/3252491).

## Other best practices

- As an administrator of a JBoss EAP setup on VM, ensuring that your VM is secure is important. It will significantly lower the risk of your guest and host OSs being infected by malicious software. Securing your VM reduces attack on JBoss EAP and malfunctioning of applications hosted on JBoss EAP. Control the access to the Azure VMs using features like [Azure Policy](https://azure.microsoft.com/services/azure-policy/) and [Azure Build-in Roles](../../../role-based-access-control/built-in-roles.md) in [Azure Role-Based Access control (RBAC)]/azure/role-based-access-control/overview). Protect your VM against malware by installing Microsoft Antimalware or a Microsoft partner’s endpoint protection solution and integrating your antimalware solution with [Azure Security Center](https://azure.microsoft.com/services/security-center/) to monitor the status of your protection. In RHEL VMs, you can protect it by blocking port forwarding and blocking root login, which can be disabled in the */
/ssh/sshd_config* file.

- Use environment variables to make your experience easy and smooth with JBoss EAP on Azure VMs. For example, you can use EAP_HOME to denote the path to the JBoss EAP installation, which will be used several times. In such cases, environment variables will come in handy. Environment variables are also a common means of configuring services and handling web application secrets. When an environment variable is set from the shell using the export command, its existence ends when the user’s sessions ends. It's problematic when we need the variable to persist across sessions. To make an environment persistent for a user’s environment, we export the variable from the user’s profile script. Add the export command for every environment variable you want to persist in the bash_profile. If you want to set permanent Global environment variable for all the users who have access to the VM, you can add it to the default profile. It's recommended to store global environment variables in a directory named `/etc/profile.d`. The directory contains a list of files that are used to set environment variables for the entire system. Using the set command to set system environment variables in a Windows Server command prompt won't permanently set the environment variable. Use either the *setx* command, or the System interface in the Control Panel.

- Manage your VM updates and upgrades. Use the [Update Management](../../../automation/update-management/overview.md) solution in Azure Automation to manage operating system updates for your Windows and Linux computers that are deployed in Azure. Quickly assess the status of available updates on all agent computers and manage the process of installing required updates for servers. Updating the VM software ensures that important Microsoft Azure patches, Hypervisor drivers, and software packages stay current. In-place upgrades are possible for minor releases. For instance, from RHEL 6.9 to RHEL 6.10 or RHEL 7.3 to RHEL 7.4. In-place type of upgrade can be done by running the *yum update* command. Microsoft Azure does not support an in-place upgrade of a major release, for instance, from RHEL 6 to RHEL 7.

- Use [Azure Monitor](../../../azure-monitor/data-platform.md) to gain visibility into your resource’s health. Azure Monitor features include [Resource Diagnostic Log Files](../../../azure-monitor/essentials/platform-logs-overview.md). Is is used to monitor your VM resources and identifies potential issues that might compromise performance and availability. [Azure Diagnostics Extension](../../../azure-monitor/agents/diagnostics-extension-overview.md) can provide monitoring and diagnostics capabilities on Windows VMs. Enable these capabilities by including the extension as part of the Azure Resource Manager template. Enable Boot Diagnostics, which is an important tool to use when troubleshooting a VM that won't boot. The console output and the boot log can greatly assist Red Hat Technical Support when resolving a boot issue. Enable Boot Diagnostics in the Microsoft Azure portal while creating a VM or on an existing VM. Once it's enabled, you can view the console output for the VM and download the boot log for troubleshooting.

- Another way to ensure secure communication is to use private endpoint in your [Virtual Network (VNet)]/azure/virtual-network/virtual-networks-overview) and [Virtual Private Networks (VPN)](../../../vpn-gateway/vpn-gateway-about-vpngateways.md). Open networks are accessible to the outside world and as such susceptible to attacks from malicious users. VNet, and VPN restrict access to selected users. VNET uses a private IP to establish isolated communication channels between servers within the same range. Isolated communication allows multiple servers under the same account to exchange information and data without exposure to a public space. Connect to a remote server if you're doing it locally through a private network. There are different methods like using a JumpVM/JumpBox in the same VNet as that of the Application serve or use [Azure Virtual Network Peering](../../../virtual-network/virtual-network-peering-overview.md), [Azure Application Gateway](../../../application-gateway/overview.md), [Azure Bastion](https://azure.microsoft.com/services/azure-bastion), and so on. All these methods enable an entirely secure and private connection and can connect multiple remote servers.

- Use an [Azure Network Security Groups (NSG)](../../../virtual-network/network-security-groups-overview.md) to filter network traffic to and from the Application server in the Azure VNet. NSG contains security rules that allow or deny inbound network traffic to, or outbound network traffic from, several types of Azure resources. For each rule, you can specify source and destination, port, and protocol. Protect your application on JBoss EAP by using these NSG rules and block or allow ports to the internet.

- For better functionality of Application running on JBoss EAP on Azure, you can use the HA feature available in Azure. HA in Azure can be achieved using Azure resources such as Load-Balancer, Application Gateway, or [Virtual Machine Scale Set](../../../virtual-machine-scale-sets/overview.md). These HA methods will provide redundancy and improved performance, which will allow you to easily do maintenance or update an application instance, by distributing the load to another available application instance. To keep up with more customer demand, you may need to increase the number of application instances that run your application. Virtual machine scale set also have autoscaling feature, which allows your application to automatically scale up or down as demand changes.

## Optimizing the JBoss EAP server configuration

Once you've installed the JBoss EAP server, and you've created a management user, you can optimize your server configuration. Make sure you review information in the [Performance Tuning Guide](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.3/html-single/performance_tuning_guide/index) on how to optimize the server configuration and avoid common problems when deploying applications in a production environment

## Resource links and support

For any support-related questions, issues or customization requirements, contact [Red Hat Support](https://access.redhat.com/support) or [Microsoft Azure Support](https://ms.portal.azure.com/?quickstart=true#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

* Learn more about [JBoss EAP](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.3/html/getting_started_with_jboss_eap_for_openshift_online/introduction)
* Red Hat Subscription Manager (RHSM) [Cloud Access](https://access.redhat.com/documentation/en/red_hat_subscription_management/1/html-single/red_hat_cloud_access_reference_guide/index)
* [Azure Red Hat OpenShift (ARO)](https://azure.microsoft.com/services/openshift/)
* Microsoft Docs for [Red Hat on Azure](./overview.md)
* [RHEL BYOS Gold Images in Azure](./byos.md)
* JBoss EAP on Azure [Quickstart video tutorial](https://www.youtube.com/watch?v=3DgpVwnQ3V4) 

## Next steps

* [Migrate to JBoss EAP on Azure inquiry](https://aka.ms/JavaCloud)
* Running JBoss EAP in [Azure App Service](/azure/developer/java/ee/jboss-on-azure)
* Deploy JBoss EAP on RHEL VM/VM Scale Set from [Azure Marketplace](https://aka.ms/AMP-JBoss-EAP)
* Deploy JBoss EAP on RHEL VM/VM Scale Set from [Azure Quickstart](https://aka.ms/Quickstart-JBoss-EAP)
* Use Azure [App Service Migration Assistance](https://azure.microsoft.com/services/app-service/migration-assistant/)
* Use Red Hat [Migration Toolkit for Applications](https://developers.redhat.com/products/mta)