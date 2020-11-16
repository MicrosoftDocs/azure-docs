---
title: Quickstart - Marketplace offer for JBoss Enterprise Application (EAP) on Azure Red Hat Enterprise Linux (RHEL) VM and Virtual Machine Scale Set
description: How to deploy Red Hat JBoss EAP on Azure RHEL VM and Virtual Machine Scale Set using Azure Marketplace offers.
author: theresa-nguyen
ms.author: bicnguy
ms.topic: quickstart
ms.service: virtual-machines-linux
ms.subservice: workloads
ms.assetid: 8090c607-b6c6-4fe9-9c8b-fbce1eaf922e
ms.date: 11/16/2020
---

# Deploy Red Hat JBoss EAP on Azure RHEL VM and VMSS using the offer in Azure Marketplace

Azure Marketplace has offers using which you can deploy Azure [Red Hat Enterprise Linux (RHEL)](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux) Virtual Machine (VM) or Virtual Machine Scale Set (VMSS) with [JBoss Enterprise (EAP)](https://www.redhat.com/en/technologies/jboss-middleware/application-platform) pre-installed. JBoss EAP is an open source application server platform that delivers enterprise-grade security, scalability, and performance. RHEL is an open source operating system (OS) platform, where you can scale existing apps and roll out emerging technologies across all environments. JBoss EAP and RHEL includes everything needed to build, run, deploy, and manage enterprise Java applications in any environment, including on-premises, virtual environments, and in private, public, or hybrid clouds.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or [create an account for free](https://azure.microsoft.com/pricing/free-trial).

* JBoss EAP installation - You need to have a Red Hat Account with Red Hat Subscription Management (RHSM) entitlement for JBoss EAP. This entitlement will let you download the Red Hat tested and certified JBoss EAP version.  If you don't have EAP entitlement, obtain a [JBoss EAP evaluation subscription](https://access.redhat.com/products/red-hat-jboss-enterprise-application-platform/evaluation) before you get started. To create a new Red Hat subscription, go to [Red Hat Customer Portal](https://access.redhat.com/) and set up an account.

* RHEL options - Choose between Pay-As-You-Go (PAYG) or Bring-Your-Own-Subscription (BYOS). With BYOS, you need to activate your [Red Hat Cloud Access](https://access.redhat.com/) RHEL Gold Image before deploying the Quickstart template.

* [Azure Command-Line Interface](https://docs.microsoft.com/cli/azure/overview).

## Support and subscription notes

The Azure Marketplace offer of JBoss EAP on RHEL will install and provision on Azure VMs in less than 20 minutes. You can access these offers from [Azure Marketplace](https://azuremarketplace.microsoft.com/)

This Marketplace offer includes various combinations of EAP and RHEL versions to support your requirements. JBoss EAP is always Bring-Your-Own-Subscription (BYOS) but for RHEL OS you can choose between BYOS or Pay-As-You-Go (PAYG). The Azure Marketplace offer includes plan options for JBoss EAP on RHEL as stand-alone or clustered VMs. This Azure Marketplace offer for Red Hat JBoss EAP on RHEL have 12 plans:

- **JBoss EAP 7.2 on RHEL 7.7 VM (PAYG)**
- **JBoss EAP 7.2 on RHEL 8.0 VM (PAYG)**
- **JBoss EAP 7.3 on RHEL 8.0 VM (PAYG)**
- **JBoss EAP 7.2 on RHEL 7.7 VM (BYOS)**
- **JBoss EAP 7.2 on RHEL 8.0 VM (BYOS)**
- **JBoss EAP 7.3 on RHEL 8.0 VM (BYOS)**
- **JBoss EAP 7.2 on RHEL 7.7 VMSS (PAYG)**
- **JBoss EAP 7.2 on RHEL 8.0 VMSS (PAYG)**
- **JBoss EAP 7.3 on RHEL 8.0 VMSS (PAYG)**
- **JBoss EAP 7.2 on RHEL 7.7 VMSS (BYOS)**
- **JBoss EAP 7.2 on RHEL 8.0 VMSS (BYOS)**
- **JBoss EAP 7.3 on RHEL 8.0 VMSS (BYOS)**

#### Using RHEL OS with PAYG Model

This Azure Marketplace offer allows you to deploy Red Hat Enterprise Linux OS with PAYG Model. PAYG plans will have additional hourly RHEL subscription charge on top of the normal compute, network and storage costs. Make sure you do not register your system again with RHEL license, or else it will lead to double billing. To avoid this issue, you can deploy RHEL OS with BYOS model via Red Hat Gold Image using your [Red Hat Cloud Access](https://access.redhat.com/).

Check out [Red Hat Enterprise Linux pricing](https://azure.microsoft.com/pricing/details/virtual-machines/red-hat/) for details on the PAYG model. In order to use RHEL in PAYG model, you will need an Azure Subscription with the specified payment method ([RHEL 7.7 Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/RedHat.RedHatEnterpriseLinux77-ARM) and [RHEL 8.0 Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/RedHat.RedHatEnterpriseLinux80-ARM) are offers that require a payment method to be specified in the Azure Subscription).

#### Using RHEL OS with BYOS Model

To use BYOS for RHEL OS, you need to have a valid Red Hat subscription with entitlements to use RHEL OS in Azure. Note that the JBoss EAP on RHEL BYOS plans are private offers, so you need to complete the following prerequisites in order to use RHEL OS through BYOS model before you deploy the EAP on RHEL BYOS Plan from Azure Marketplace. You need to accept the Marketplace Terms and Conditions in Azure for the RHEL BYOS plans. You can complete this by running Azure CLI commands, as given below. Make sure you are running the latest Azure CLI version before moving on.

1. Ensure you have RHEL OS and JBoss EAP entitlements attached to your Red Hat subscription.

2. Authorize your Azure subscription ID to use RHEL BYOS images. Follow the [Red Hat Subscription Management (RHSM) documentation](https://access.redhat.com/documentation/en/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/con-enable-subs) to complete the process, which includes these steps:

    2.1 Enable Microsoft Azure as a provider in your Red Hat Cloud Access Dashboard.

    2.2 Add your Azure subscription IDs.

    2.3 Enable new products for Cloud Access on Microsoft Azure.

    2.4 Activate Red Hat Gold Images for your Azure Subscription. For more information, read the chapter on [Enabling and maintaining subscriptions for Cloud Access](https://access.redhat.com/documentation/en/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/using_red_hat_gold_images#con-gold-image-azure) for more details.

    2.5 Wait for Red Hat Gold Images to be available in your Azure subscription. These Gold Images are typically available within 3 hours of submission.
    
3. Accept the Azure Marketplace Terms and Conditions for RHEL BYOS Images. You can complete this process by running Azure Command-Line Interface (CLI) commands, as given below. For more information, see the [RHEL BYOS Gold Images in Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/redhat/byos) documentation for more details. It's important that you're running the latest Azure CLI version.

    3.1 Launch an Azure CLI session and authenticate with your Azure account. Refer to [Signing in with Azure CLI](https://docs.microsoft.com/cli/azure/authenticate-azure-cli) for assistance. Make sure you are running the latest Azure CLI version before moving on.

    3.2 Verify the RHEL BYOS plans are available in your subscription by running the following CLI command. If you don't get any results here, refer to #2 and ensure that your Azure subscription is activated for JBoss EAP on RHEL BYOS plans.

    ```
    az vm image list --offer jboss-eap-rhel7 --all #use this command to verify the availability of EAP 7.2 on RHEL 7.7 BYOS plan
    ```

    ```
    az vm image list --offer jboss-eap72-rhel8 --all #use this command to verify the availability of EAP 7.2 on RHEL 8.0 BYOS plan
    ```

    ```
    az vm image list --offer jboss-eap-rhel8 --all #use this command to verify the availability of EAP 7.3 on RHEL 8.0 BYOS plan
    ```

    3.3 Run the following command to accept the Marketplace Terms of required JBoss EAP on RHEL BYOS plan.

    ```
    az vm image terms accept --publisher redhat --offer jboss-eap-rhel7 --plan jboss-72-rhel-77-byos #for EAP 7.2 on RHEL 7.7 BYOS plan
    ```

    ```
    az vm image terms accept --publisher redhat --offer jboss-eap72-rhel8 --plan jboss-72-rhel-80-byos #for EAP 7.2 on RHEL 8.0 BYOS plan
    ```

    ```
    az vm image terms accept --publisher redhat --offer jboss-eap-rhel8 --plan jboss-73-rhel-80-byos #for EAP 7.3 on RHEL 8.0 BYOS plan
    ```

4. Your subscription is now ready to deploy EAP on RHEL BYOS plans.

Once you deploy a VM using any of the above mentioned RHEL BYOS plans please run the following commands to register with your RHSM account and attach your BYOS Pool ID.

1. Log into your RHEL BYOS VM.

2. Register your VM with Red Hat Subscription Manager. In the command below the RHSM_USER is your RedHat Subscription Manager Username and RHSM_PASSWORD is RedHat Subscription Manager Password.

    ```
    subscription-manager register --username RHSM_USER --password RHSM_PASSWORD
    ```

3. Attach your RHSM pool ID (with RHSM BYOS License) using the command below, where RHEL_POOl is the RHSM pool ID with BYOS license entitlement

    ```
    subscription-manager attach --pool=RHEL_POOL
    ```

#### Using JBoss EAP with BYOS Model

JBoss EAP is available on Azure through BYOS model only. When deploying your JBoss EAP on RHEL plan, you need to supply your RHSM credentials along with RHSM Pool ID with valid EAP entitlements. If you don't have EAP entitlement, obtain a [JBoss EAP evaluation subscription](https://access.redhat.com/products/red-hat-jboss-enterprise-application-platform/evaluation) before you get started. Run the following command to attach the Pool ID with EAP entitlement, where EAP_POOL is RHSM pool ID with EAP entitlement.

```
subscription-manager attach --pool=EAP_POOL
```

## Troubleshooting

This section includes common errors faced during deployments and details on how you can troubleshoot these errors. 

#### Azure Platform

- If the parameter criteria are not fulfilled (ex - the admin password criteria was not met) or if any mandatory parameters are not provided in the parameters section then the deployment will not start. You can review the details of parameters before clicking on *Create*.

- Once the deployment starts the resources being deployed will be visible on the deployment page. In the case of any deployment failure, after parameter validation process, a more detailed failure message is available.

- If your deployment fails at the **VM Custom Script Extension** resource, a more detailed failure message is available in the VM log file. Please refer to the next section for further troubleshooting.

#### Troubleshooting EAP deployment extension

The offers with PAYG RHEL OS uses VM Custom Script Extension to deploy JBoss EAP and configure JBoss EAP management user. The offers with BYOS RHEL OS uses VM Custom Script Extension to configure JBoss EAP management user only. Your deployment can fail at this stage due to several reasons such as:

- Invalid RHSM or EAP entitlement
- Invalid JBoss EAP or RHEL OS entitlement Pool ID

Follow the steps below to troubleshoot this further:

1. Log into the provisioned virtual machine through SSH. You can retrieve the Public IP of the VM from the Azure portal VM overview page.

2. Switch to root user

    ```
    sudo su -
    ```

3. Enter the VM admin password if prompted.

4. Change directory to logging directory

    ```
    cd /var/lib/waagent/custom-script/download/0 #for EAP on RHEL stand-alone VM
    ```

    ```
    cd /var/lib/waagent/custom-script/download/1 #for EAP on RHEL clustered VM
    ```

5. Review the logs in eap.log log file.

    ```
    more eap.log
    ```

This log file will have details that include deployment failure reason and possible solutions. If your deployment failed due to RHSM account or entitlements, please refer to 'Support and subscription notes' section to complete the prerequisites and try again. If you are deploying EAP on RHEL clustered plan, you should also make sure that the deployment does not hit the quota limit, hence check your regional vCPU quotas and VM series vCPU quotas before you provide the instance count for deployment. If your subscription or region does not have enough quota limit [request for quota](https://docs.microsoft.com/azure/azure-portal/supportability/regional-quota-requests) from you Azure portal. 

Please refer to [Using the Azure Custom Script Extension Version 2 with Linux VMs](https://docs.microsoft.com/azure/virtual-machines/extensions/custom-script-linux) for more details on troubleshooting VM custom script extensions.

## Resource Links:

* Learn more about [JBoss EAP](https://access.redhat.com/documentation/en/red_hat_jboss_enterprise_application_platform/7.2/html/getting_started_with_jboss_eap_for_openshift_online/introduction)
* [JBoss EAP on Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)
* [JBoss EAP on Azure App Service Linux](https://docs.microsoft.com/azure/app-service/quickstart-java) Quickstart
* [How to deploy JBoss EAP onto Azure App Service](https://github.com/JasonFreeberg/jboss-on-app-service) tutorial
* [Azure Hybrid Benefits](https://docs.microsoft.com/azure/virtual-machines/windows/hybrid-use-benefit-licensing)
* [Configuring a Java app for Azure App Service](https://docs.microsoft.com/azure/app-service/configure-language-java)


## Next steps

* Learn more about [JBoss EAP 7.2](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.2/)
* Learn more about [JBoss EAP 7.3](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.3/)
* Learn more about [Red Hat Subscription Management](https://access.redhat.com/products/red-hat-subscription-management)
* Microsoft docs for [Red Hat on Azure](https://aka.ms/rhel-docs)
* Deploy [JBoss EAP on RHEL VM/Virtual Machine Scale Set from Azure Marketplace](https://aka.ms/AMP-JBoss-EAP)
* Deploy [JBoss EAP on RHEL VM/Virtual Machine Scale Set from Azure Quickstart](https://aka.ms/Quickstart-JBoss-EAP)
