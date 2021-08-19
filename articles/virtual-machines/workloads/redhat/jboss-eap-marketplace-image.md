---
title: Azure Marketplace offer for Red Hat JBoss EAP on Azure Red Hat Enterprise Linux Virtual Machine (VM) and virtual machine scale sets
description: How to deploy Red Hat JBoss EAP on Azure Red Hat Enterprise Linux (RHEL) VM and virtual machine scale sets using Azure Marketplace offer.
author: theresa-nguyen
ms.author: bicnguy
ms.topic: article
ms.service: virtual-machines
ms.subservice: redhat
ms.assetid: 9b37b2c4-5927-4271-85c7-19adf33d838b
ms.date: 05/25/2021
---

# Deploy Red Hat JBoss Enterprise Platform (EAP) on Azure VMs and virtual machine scale sets using the Azure Marketplace offer

The Azure Marketplace offers for [Red Hat JBoss Enterprise Application Platform](https://www.redhat.com/en/technologies/jboss-middleware/application-platform) on Azure [Red Hat Enterprise Linux (RHEL)](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux) is a joint solution from [Red Hat](https://www.redhat.com/) and Microsoft. Red Hat is a leading open-source solutions provider and contributor including the [Java](https://www.java.com/) standards, [OpenJDK](https://openjdk.java.net/), [MicroProfile](https://microprofile.io/), [Jakarta EE](https://jakarta.ee/), and [Quarkus](https://quarkus.io/). JBoss EAP is a leading Java application server platform that is Java EE Certified and Jakarta EE Compliant in both Web Profile and Full Platform. Every JBoss EAP release is tested and supported on a various market-leading operating systems, Java Virtual Machines (JVMs), and database combinations.  JBoss EAP and RHEL include everything you need to build, run, deploy, and manage enterprise Java applications in any environment.  It includes on-premises, virtual environments, and in private, public, or hybrid clouds. The joint solution by Red Hat and Microsoft includes integrated support and software licensing flexibility.

## JBoss EAP on Azure-Integrated support

The JBoss EAP on Azure Marketplace offer is a joint solution by Red Hat and Microsoft and includes integrated support and software licensing flexibility. You can reach both Microsoft and Red Hat to file your support tickets.  We'll share and resolve the issues jointly so that you don't have to file multiple tickets for each vendor. Integrated support covers all Azure infrastructure and Red Hat application server level support issues.    

## Prerequisites

* An Azure Account with an Active Subscription - If you don't have an Azure subscription, you can activate your [Visual Studio Subscription subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) (formerly MSDN) or [create an account for free](https://azure.microsoft.com/pricing/free-trial).

* JBoss EAP installation - You need to have a Red Hat Account with Red Hat Subscription Management (RHSM) entitlement for JBoss EAP. The entitlement will let you download the Red Hat tested and certified JBoss EAP version.  If you don't have EAP entitlement, sign up for a free developer subscription through the [Red Hat Developer Subscription for Individuals](https://developers.redhat.com/register). Once registered, you can find the necessary credentials (Pool IDs) at the [Red Hat Customer Portal](https://access.redhat.com/management/).

* RHEL options - Choose between Pay-As-You-Go (PAYG) or Bring-Your-Own-Subscription (BYOS). With BYOS, you need to activate your [Red Hat Cloud Access](https://access.redhat.com/) [RHEL Gold Image](https://azure.microsoft.com/updates/red-hat-enterprise-linux-gold-images-now-available-on-azure/) before deploying the Marketplace  offer with solutions template. Follow [these instructions](https://access.redhat.com/documentation/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/enabling-and-maintaining-subs_cloud-access) to enable RHEL Gold images for use on Microsoft Azure.

* Azure Command-Line Interface (CLI).

## Azure Marketplace offer subscription options

The Azure Marketplace offer of JBoss EAP on RHEL will install and provision an Azure VM/virtual machine scale sets deployment in less than 10 minutes. You can access these offers from the [Azure Marketplace](https://azuremarketplace.microsoft.com/)

The Marketplace offer includes various combinations of EAP and RHEL versions to support your requirements. JBoss EAP is always BYOS but for RHEL operating system (OS) you can choose between BYOS or PAYG. The offer includes plan configuration options for JBoss EAP on RHEL as stand-alone, clustered VMs, or clustered virtual machine scale sets. 

The six available plans are: 

- Boss EAP 7.3 on RHEL 8.3 Stand-alone VM (PAYG)
- JBoss EAP 7.3 on RHEL 8.3 Stand-alone VM (BYOS)
- JBoss EAP 7.3 on RHEL 8.3 Clustered VM (PAYG)
- JBoss EAP 7.3 on RHEL 8.3 Clustered VM (BYOS)
- JBoss EAP 7.3 on RHEL 8.3 Clustered virtual machine scale set (PAYG)
- JBoss EAP 7.3 on RHEL 8.3 Clustered virtual machine scale set (BYOS)

## Using RHEL OS with PAYG model

The Azure Marketplace offer allows you to deploy RHEL as on-demand PAYG VMs/virtual machine scale sets. PAYG plans will have extra hourly RHEL subscription charge on top of the normal Azure infrastructure compute, network, and storage costs.

Check out [Red Hat Enterprise Linux pricing](https://azure.microsoft.com/pricing/details/virtual-machines/red-hat/) for details on the PAYG model. To use RHEL in PAYG model, you will need an Azure Subscription. ([RHEL on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/redhat.rhel-20190605) offers require a payment method to be specified in the Azure Subscription).

## Using RHEL OS with BYOS model

To use RHEL as BYOS VMs/virtual machine scale sets, you're required to have a valid Red Hat subscription with entitlements to use RHEL in Azure. These JBoss EAP on RHEL BYOS plans are available as [Azure private offers](../../../marketplace/private-offers.md). You MUST complete the following prerequisites to deploy a RHEL BYOS offer plan from the Azure Marketplace. 

1. Ensure you have RHEL OS and JBoss EAP entitlements attached to your Red Hat subscription.
2. Authorize your Azure subscription ID to use RHEL BYOS images. Follow the [Red Hat Subscription Management (RHSM) documentation](https://access.redhat.com/documentation/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/enabling-and-maintaining-subs_cloud-access) to complete the process, which includes these steps:
    1. Enable Microsoft Azure as a provider in your Red Hat Cloud Access Dashboard.
    2. Add your Azure subscription IDs.
    3. Enable new products for Cloud Access on Microsoft Azure.
    4. Activate Red Hat Gold Images for your Azure Subscription. For more information, read the chapter on [Enabling and maintaining subscriptions for Cloud Access](https://access.redhat.com/documentation/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/cloud-access-gold-images_cloud-access#using-gold-images-on-azure_cloud-access) for more details. 
    5. Wait for Red Hat Gold Images to be available in your Azure subscription. These Gold Images are typically available within 3 hours of submission or less as Azure Private offers.

3. Accept the Azure Marketplace Terms and Conditions (T&C) for RHEL BYOS Images. To accept, run the [Azure Command-Line Interface (CLI)](/cli/azure/install-azure-cli) commands, as given below. For more information, see the [RHEL BYOS Gold Images in Azure](./byos.md) documentation for more details. It's important that you're running the latest Azure CLI version.
    1. Launch an Azure CLI session and authenticate with your Azure account. Refer to [Signing in with Azure CLI](/cli/azure/authenticate-azure-cli) for assistance. Make sure you're running the latest Azure CLI version before moving on.
    2. Verify the RHEL BYOS plans are available in your subscription by running the following CLI command. If you don't get any results here, refer to step #2. Ensure that your Azure subscription is activated with entitlement for JBoss EAP on RHEL BYOS plans.

    ```cli
    az vm image list --offer rhel-byos --all #use this command to verify the availability of RHEL BYOS images
    ```

    3. Run the following command to accept the Azure Marketplace T&C as required for the JBoss EAP on RHEL BYOS plan.

    ```cli
    az vm image terms accept --publisher redhat --offer jboss-eap-rhel --plan $PLANID
    ```

    4. Where `$PLANID` is one of the following (repeat step #3 for each Marketplace offer plan you wish to use):

    ```cli
    jboss-eap-73-byos-rhel-80-byos
    jboss-eap-73-byos-rhel-8-byos-clusteredvm
    jboss-eap-73-byos-rhel-80-byos-vmss
    jboss-eap-73-byos-rhel-80-payg
    jboss-eap-73-byos-rhel-8-payg-clusteredvm
    jboss-eap-73-byos-rhel-80-payg-vmss
    ```

4. Your subscription is now ready to deploy EAP on RHEL BYOS plans. During deployment, your subscription(s) will be automatically attached using the `subscription-manager` with the credentials supplied during deployment.

## Using JBoss EAP with BYOS model

JBoss EAP is available on Azure through BYOS model only. When deploying your JBoss EAP on RHEL plan, you need to supply your RHSM credentials along with RHSM Pool ID with valid EAP entitlements. If you don't have EAP entitlement, obtain a [Red Hat Developer Subscription for Individuals](https://developers.redhat.com/register). Once registered, you can find the necessary credentials (Pool IDs) in the Subscription navigation menu. During deployment, your subscription(s) will be automatically attached using the `subscription-manager` with the credentials supplied during deployment.

## Template solution architectures

These offer plans create all the Azure compute resources to run JBoss EAP setup on RHEL. The following resources are created by the template solution:

- RHEL VM
- One Load Balancer (for clustered configuration)
- Virtual Network with a single subnet
- JBoss EAP setup on a RHEL VM/virtual machine scale sets (stand-alone or clustered)
- Sample Java application
- Storage Account!

## After a successful deployment

1. [Create a Jump VM with VNet Peering](../../windows/quick-create-portal.md#create-virtual-machine) in a different Virtual Network and access the server and expose the application using [Virtual Network Peering](../../../virtual-network/tutorial-connect-virtual-networks-portal.md#peer-virtual-networks).
2. [Create a Public IP](../../../virtual-network/virtual-network-public-ip-address.md#create-a-public-ip-address) to access the server and the application.
3. [Create a Jump VM in the same Virtual Network (VNet)](../../windows/quick-create-portal.md#create-virtual-machine) in a different subnet (new subnet) in the same VNet and access the server via a Jump VM. The Jump VM can be used to expose the application.
4. Expose the application using an [Application Gateway](../../../application-gateway/quick-create-portal.md#create-an-application-gateway).
5. Expose the application using an External Load Balancer (ELB).
6. [Use Azure Bastion](../../../bastion/bastion-overview.md) to access your RHEL VMs using your browser and the Azure portal. 

### 1. Create a Jump VM in a different Virtual Network and access the RHEL VM using Virtual Network Peering (recommended method)

1. [Create a Windows Virtual Machine](../../windows/quick-create-portal.md#create-virtual-machine) - in a new Azure Resource Group, create a Windows VM, which MUST be in the same region as RHEL VM. Provide the required details and leave other configurations as default as it will create the Jump VM in a new Virtual Network.
2. [Peer the Virtual Networks](../../../virtual-network/tutorial-connect-virtual-networks-portal.md#peer-virtual-networks) - Peering is how you associate the RHEL VM with the Jump VM. Once the Virtual Network peering is successful, both the VMs can communicate with each other.
3. Go to the Jump VM details page and copy the Public IP. Log into the Jump VM using the Public IP.
4. Copy the Private IP of RHEL VM from the output page and use it to log into the RHEL VM from the Jump VM.
5. Paste the app URL that you copied from the output page to a browser inside the Jump VM. View the JBoss EAP on Azure web page from this browser.
6. Access the JBoss EAP Admin Console - paste the Admin Console URL copied from the output page in a browser inside the Jump VM, enter the JBoss EAP username and password to log in.

### 2. Create a Public IP to access the RHEL VM and JBoss EAP Admin Console.

1. The RHEL VM you created don't have a Public IP associated with it. You can [create a Public IP](../../../virtual-network/virtual-network-public-ip-address.md#create-a-public-ip-address) for accessing the VM and [associate the Public IP to the VM](../../../virtual-network/associate-public-ip-address-vm.md). Creating a Public IP can be done using Azure portal or [Azure PowerShell](/powershell/) commands or [Azure CLI](/cli/azure/install-azure-cli) commands.
2. Obtain the Public IP of a VM - go to the VM details page and copy the Public IP. Use Public IP to access the VM and JBoss EAP Admin Console.
3. View the JBoss EAP on Azure web page - open a web browser and go to *http://<PUBLIC_HOSTNAME>:8080/* and you should see the default EAP welcome page.
4. Log into the JBoss EAP Admin Console - open a web browser and go to *http://<PUBLIC_HOSTNAME>:9990*. Enter the JBoss EAP username and password to log in.

### 3. Create a Jump VM in a different subnet (new subnet) in the same VNet and access the RHEL VM via a Jump VM.

1. [Add a new subnet](../../../virtual-network/virtual-network-manage-subnet.md#add-a-subnet) in the existing Virtual Network, which contains the RHEL VM.
2. [Create a Windows Virtual Machine](../../windows/quick-create-portal.md#create-virtual-machine) in Azure in the same Resource Group (RG) as the RHEL VM. Provide the required details and leave other configurations as default except for the VNet and subnet. Make sure you select the existing VNet in the RG and select the subnet you created in the step above as it will be your Jump VM.
3. Access Jump VM Public IP - once successfully deployed, go to the VM details page and copy the Public IP. Log into the Jump VM using the Public IP.
4. Log into RHEL VM - copy the Private IP of RHEL VM from the output page and use it to log into the RHEL VM from the Jump VM.
5. Access the JBoss EAP welcome page - in your Jump VM, open a browser and paste the app URL that you copied from the output page of the deployment.
6. Access the JBoss EAP Admin Console - paste the Admin Console URL that you copied from the output page in a browser inside the Jump VM to access the JBoss EAP Admin Console and enter the JBoss EAP username and password to log in.

### 4. Expose the application using an External Load Balancer

1. [Create an Application Gateway](../../../application-gateway/quick-create-portal.md#create-an-application-gateway) - to access the ports of the RHEL VM, create an Application Gateway in a different subnet. The subnet must only contain the Application Gateway.
2. Set *Frontends* parameters - make sure you select Public IP or both and provide the required details. Under *Backends* section, select **Add a backend pool** option and add the RHEL VM to the backend pool of the Application Gateway.
3. Set access ports - under *Configuration* section add routing rules to access the ports 8080 and 9990 of the RHEL VM.
4. Copy Public IP of Application Gateway - once the Application Gateway is created with the required configurations, go to the  overview page and copy the Public IP of the Application Gateway.
5. To view the JBoss EAP on Azure web page - open a web browser then go to *http://<PUBLIC_IP_AppGateway>:8080* and you should see the default EAP welcome page.
6. To log into the JBoss EAP Admin Console - open a web browser then go to *http://<PUBLIC_IP_AppGateway>:9990*. Enter the JBoss EAP username and password to log in.

### 5. Use an External Load Balancer (ELB) to access your RHEL VM/virtual machine scale sets

1. [Create a Load Balancer](../../../load-balancer/quickstart-load-balancer-standard-public-portal.md?tabs=option-1-create-load-balancer-standard#create-load-balancer-resources) to access the ports of the RHEL VM. Provide the required details to deploy the external Load Balancer and leave other configurations as default. Leave the SKU as Basic for the ELB configuration.
2. Add Load Balancer rules - once the Load balancer has been created successfully, [create Load Balancer resources](../../../load-balancer/quickstart-load-balancer-standard-public-portal.md?tabs=option-1-create-load-balancer-standard#create-load-balancer-resources), then add Load Balancer rules to access ports 8080 and 9990 of the RHEL VM.
3. Add the RHEL VM to the backend pool of the Load Balancer - click on *Backend pools* under settings section and then select the backend pool you created in the step above. Select the VM corresponding to the option *Associated to* and then add the RHEL VM.
4. To obtain the Public IP of the Load Balancer - go to the Load Balancer overview page and copy the Public IP of the Load Balancer.
5. To view the JBoss EAP on Azure web page - open a web browser then go to *http://<PUBLIC_IP_LoadBalancer>:8080/* and you should see the default EAP welcome page.
6. To log into the JBoss EAP Admin Console - open a web browser then go to *http://<PUBLIC_IP_LoadBalancer>:9990*. Enter the JBoss EAP username and password to log in.

### 6. Use Azure Bastion to connect 

1. Create an Azure Bastion host for your VNet in which your RHEL VM is located. The Bastion service will automatically connect to your RHEL VM using SSH.
2. Create your Reader roles on the VM, NIC with private IP of the VM, and Azure Bastion resource.
3. The RHEL inbound port is open for SSH (22). 
4. Connect using your username and password in the Azure portal. Click on "Connect" and select "Bastion" from the dropdown. Then select "Connect" to connect to your RHEL VM. You can connect using a private key file or private key stored in Azure Key Vault.

## Azure platform

- **Validation Failure** - Your deployment won't start if the parameter criteria aren't fulfilled (for example, the admin password criteria weren't met) or if any mandatory parameters aren't provided in the parameters section. You can review the details of parameters before clicking on *Create*.
- **Resource Provisioning Failure** - Once the deployment starts the resources being deployed will be visible on the deployment page. If there's a deployment failure after the parameter validation process, a more detailed failure message is available. 
- **VM Provisioning Failure** - If your deployment fails at the **VM Custom Script Extension** resource point, a more detailed failure message is available in the VM log file. Refer to the next section for further troubleshooting.

## Troubleshooting EAP deployment extension

These offers use VM Custom Script Extensions to deploy JBoss EAP and configure the JBoss EAP management user. Your deployment can fail at here because of several reasons, such as:

- Invalid RHSM or EAP entitlement
- Invalid JBoss EAP or RHEL OS entitlement Pool ID
- Azure Marketplace T&C not accepted for RHEL VMs

Follow the steps below to troubleshoot the issue further:

1. Log in to the provisioned virtual machine through SSH. You can retrieve the Public IP of the VM from the Azure portal VM overview page.
1. Switch to root user

    ```cli
    sudo su -
    ```

1. Enter the VM admin password if prompted.
1. Change directory to logging directory

    ```cli
    cd /var/lib/waagent/custom-script/download/0 #for EAP on RHEL stand-alone VM
    ```

    ```cli
    cd /var/lib/waagent/custom-script/download/1 #for EAP on RHEL clustered VM
    ```

1. Review the logs in eap.log log file.

    ```cli
    more eap.log
    ```

The log file will have details that include deployment failure reason and possible solutions. If your deployment failed due to RHSM account or entitlements, refer to 'Support and Subscription Notes' section to complete the prerequisites. Then try again. When deploying EAP on RHEL clustered plan, make sure that the deployment doesn't hit the quota limit. It's important to check your regional vCPU and VM series vCPU quotas before you provide the instance count for deployment. If your subscription or region doesn't have enough quota limit [request for quota](../../../azure-portal/supportability/regional-quota-requests.md) from your Azure portal.

Refer to [Using the Azure Custom Script Extension Version 2 with Linux VMs](../../extensions/custom-script-linux.md) for more details on troubleshooting VM custom script extensions.

## Resource links and support

For any support-related questions, issues or customization requirements, contact [Red Hat Support](https://access.redhat.com/support) or [Microsoft Azure Support](https://ms.portal.azure.com/?quickstart=true#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

* Learn more about [JBoss EAP](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform)
* [JBoss EAP on Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)
* [JBoss EAP in Azure App Service](/azure/developer/java/ee/jboss-on-azure) 
* [Azure Hybrid Benefits](../../windows/hybrid-use-benefit-licensing.md)
* [Red Hat Subscription Management](https://access.redhat.com/products/red-hat-subscription-management)
* [Microsoft docs for Red Hat on Azure](./overview.md)

## Next steps

* Deploy JBoss EAP on RHEL VM/Virtual Machine Scale Sets from [Azure Marketplace](https://aka.ms/AMP-JBoss-EAP)
* Deploy JBoss EAP on RHEL VM/Virtual Machine Scale Sets from [Azure Quickstart](https://aka.ms/Quickstart-JBoss-EAP)
* Configuring a Java app for [Azure App Service](../../../app-service/configure-language-java.md)
* How to deploy [JBoss EAP onto Azure App Service](https://github.com/JasonFreeberg/jboss-on-app-service) tutorial
* Use Azure [App Service Migration Assistance](https://azure.microsoft.com/services/app-service/migration-assistant/)
* Use Red Hat [Migration Toolkit for Applications](https://developers.redhat.com/products/mta)