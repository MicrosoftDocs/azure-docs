---
title: Use Portable VMware Cloud Foundations (VCF) on Azure VMware Solution
ms.author: saloniyadav
description: Bring your own portable VMware Cloud Foundations (VCF) on Azure VMware Solution
ms.topic: how-to
ms.service: azure-vmware
ms.date: 11/04/2025
# Customer intent: As a cloud administrator, I want to register and integrate my portable VMware Cloud Foundations with Azure VMware Solution, so that I can leverage my existing licenses and optimize costs while modernizing my VMware workloads in a fully managed environment.
---

# Use Portable VMware Cloud Foundations (VCF) on Azure VMware Solution

This document helps navigate the changes based on Broadcom’s new VMware licensing model for hyperscalers. Customers must purchase VMware Cloud Foundations (VCF) subscriptions directly from Broadcom to use hyperscaler cloud services. Which means that Microsoft will no longer include VCF license/subscription with new Azure VMware Solution node purchases starting November 1, 2025. If you have any active Reserved Instance (RI) purchased for VCF-included hosts, you can continue using the VCF-included solution until the end of your RI term. After which, you'll be required to bring your own VCF subscription. At any point, if your usage exceeds the active VCF-included RIs purchased, you must bring your own VCF (BYOL) for that surplus usage.

Azure VMware Solution already supports the VCF portability (BYOL) option, which enables you to bring your own VCF subscription to Azure VMware Solution. However, until now, the VCF portability (BYOL) option was supported at an Azure subscription level through support-based registration.   

Now, you can enable VCF portability (BYOL) directly through the Azure portal when creating or managing an Azure VMware Solution private cloud. This self-service model also enables you to continue using your existing VCF-included deployments and add your own portable VCF (BYOL) only for the new hosts that are **not** covered under the VCF-included offering.  

## New Scope
You now have full flexibility to apply portable VCF (BYOL) on a per–Azure VMware Solution private cloud basis, instead of your entire Azure subscription. This means you can run some Azure VMware Solution private clouds with your own portable VCF (BYOL) and others with Microsoft-provided VCF, all under the same Azure subscription. This enables phased migrations and removes the need to convert everything at once. 

If you have an active RI for VCF-included hosts and want to add new hosts, you can register portable VCF (BYOL) only for those more hosts. You can continue using your existing VCF-included hosts until the end of their RI term. 

The VMware vDefend Firewall is an add-on feature for Azure VMware Solution. Those with active RIs for VCF-included hosts and vDefend Firewall enabled before October 16 may continue to use the same number of eligible vDefend firewall cores until the RI expires. 
If either of the below scenarios happen, you must provide your own VCF vDefend Firewall add-on license key for continued usage:
 * Your license included RI expires
 * If your vDefend Firewall core usage exceeds the eligible VCF included cores as of October 15, 2025.

## Quota request for portable VCF (BYOL) 
When using portable VCF (BYOL), you must still request capacity (quotas) for Azure VMware Solution hosts as usual. 

Always ensure your Broadcom purchased VCF core count covers the scale you need. 

For further details on how to request host quotas for Azure VMware Solution, refer [here](./request-host-quota-azure-vmware-solution.md). 

## Trials on Azure VMware Solution

Trials on Azure VMware Solution were previously available for partners and customers for 30 days duration. Azure VMware 3 node trials are now available for 60 days to customers and partners. Customers are required to provide a valid trial VCF key from Broadcom before the Azure VMware Solution trial can be deployed. Existing trials in progress before November 1 are required to update their VCF key in the Azure portal on their Azure VMware Solution private cloud.  

After 60 days, deployed trials automatically switch to billed hosts unless you delete the deployment before 60 days elapses. If you don’t already have a VCF-included RI purchased, you're required to provide your Broadcom purchased VCF (BYOL) before your trial ends. Adherence to licensing compliance ensures successful continuity of your Azure VMware Solution private cloud. 

## How to configure Portable VCF (BYOL) on your Azure VMware Solution private cloud 

Register the portable VCF details on your Azure VMware Solution private cloud through Azure portal. This feature is currently only available through the Azure portal.
This can be done in one of two ways: 
  * Configure portable VCF (BYOL) while creating a new Azure VMware Solution private cloud.
  * Enable portable VCF (BYOL) on an existing Azure VMware Solution private cloud.

### Configure portable VCF (BYOL) while creating a new Azure VMware Solution private cloud

When you create a new Azure VMware Solution private cloud via the Azure portal, you're presented with an option to provide VCF license information. See image: 

:::image type="content" source="media/vmware-cloud-foundations-license-portability/portable-vcf-create-new-private-cloud-with-vcf-byol.png" alt-text="Screenshot of how to register your VCF portable subscription entitlements with Microsoft while creating your Azure VMware Solution private cloud." border="true":::

Click on "Configure" and provide all the required details:
 * VCF license/subscription key (the 25-character key from Broadcom, refer [here](https://knowledge.broadcom.com/external/article/145804/download-license-keys-for-broadcom-ca-sy.html))
 * Number of cores you wish to bring to this Azure VMware Solution private cloud (Note: this can't exceed the cores purchased under the provided VCF key from Broadcom). 
 * License expiration date (the end date of your VCF subscription purchased from Broadcom). 
 * Broadcom Site ID associated with your contract. 

Refer [here](https://knowledge.broadcom.com/external/article/145804/download-license-keys-for-broadcom-ca-sy.html) to find the all required information.

:::image type="content" source="media/vmware-cloud-foundations-license-portability/portable-vcf-create-new-private-cloud-with-vcf-byol-side-pane.png" alt-text="Screenshot of the form to register VCF portable subscription." border="true":::

To use VMware vDefend Firewall add-on on Azure VMware Solution private cloud, you must pre-purchase vDefend Firewall add-on from Broadcom. vDefend Firewall add-on license key update can also be done once your Azure VMware Solution private cloud is created. Continue reading for more information. 

## Enable portable VCF (BYOL) on an existing Azure VMware Solution private cloud
You can convert an already running Azure VMware Solution private cloud to use your own VCF without any downtime or interruption on your deployment. In the Azure portal, navigate to your Azure VMware Solution private cloud resource and look for the "Portable VCF (BYOL)" under Manage.  

:::image type="content" source="media/vmware-cloud-foundations-license-portability/portable-vcf-manage-pane.png" alt-text="Screenshot of manage page to register VCF portable subscription within an Azure VMware Solution private cloud." border="true":::

Click on the "Configure" under "VCF license details" and provide all the required details: 
1. VCF license/subscription key (the 25-character key from Broadcom. refer [here](https://knowledge.broadcom.com/external/article/145804/download-license-keys-for-broadcom-ca-sy.html))
2. Number of cores you wish to bring to this Azure VMware Solution private cloud (Note: this can't exceed the cores purchased under the provided VCF key from Broadcom). 
3. License expiration date (the end date of your VCF subscription purchased from Broadcom). 
4. Broadcom Site ID associated with your contract.

After saving, your existing hosts will switch to the portable VCF (BYOL) pricing going forward. 

>[!NOTE]
> If you want to take advantage of cost savings with reserved pricing, purchase an Azure VMware Solution RI with "VCF BYOL" for the corresponding host type. 

## Using VMware vDefend Firewall on Azure VMware Solution private cloud

The VMware vDefend Firewall is an add-on feature for Azure VMware Solution. Customers with active RIs that included VCF and enabled the vDefend Firewall before October 16th may continue to use the same number of eligible vDefend firewall cores until their Reservation expires. After your Reservation expires, or if your vDefend Firewall core usage exceeds the eligible VCF-included cores as of October 15th, 2025, you must provide your own VCF vDefend Firewall add-on license key for continued or more usage. 

This applies to all host types: VCF-included hosts and portable VCF (BYOL) hosts.  

Attempting to enable firewall features without having a Broadcom firewall subscription (or without registering it), is out of compliance. Microsoft holds the right to suspend your Azure VMware Solution private cloud under these circumstances until resolution.  

More information on the VMware vDefend Firewall feature set can be found on Broadcom documentation [here](https://knowledge.broadcom.com/external/article/145804/download-license-keys-for-broadcom-ca-sy.html).  Please note that all listed firewall features may not be supported on Azure VMware Solution. Please check with the Microsoft team for more details. 

:::image type="content" source="media/vmware-cloud-foundations-license-portability/portable-vcf-manage-firewall-configure.png" alt-text="Screenshot of how to register your VCF Firewall license on Azure VMware Solution private cloud." border="true":::

This should be done in addition to the base VCF license registration. Once entered, your Azure VMware Solution private cloud is aware that firewall is BYOL-licensed as well. 

If you intend to utilize vDefend Firewall with Advanced Threat Prevention, please submit a support ticket with license key to have your license provisioned in your private cloud, in addition to adding the vDefend Firewall add-on license key as outlined. 

>[!NOTE]
> * NSX Distributed Firewall is considered enabled when a customer configures a non-default Distributed Firewall policy or Distributed Firewall IPFIX profile.
> * NSX Gateway Firewall is considered enabled when a customer configures a non-default Gateway Firewall policy.

## How to calculate number of cores

### VCF cores for Azure VMware Solution private cloud

1. Check your Azure VMware Solution host type:

| Host type | Number of cores per host |
|-------------|--------------------------|
| AV36, AV36P | 36 |
| AV48 | 48 |
| AV52 | 52 |
| AV64 | 64 |

2. Multiply the number of hosts by cores per host:
   * Example if you want to use portable VCF for 3 AV64 hosts in your Azure VMware Solution private cloud, the portable VCF cores required: 3 hosts * 64 cores per host = 192 cores
3. Mixed billing scenario
  * If your Azure VMware Solution private cloud has 3 AV36P hosts and you want to add 4 more AV36P VCF BYOL hosts
  * Total VCF cores required = (3 * 36) from Azure VMware Solution license included + (4 * 36) from BYOL license = 108 + 144 = 252
  * Register 144 cores ONLY for BYOL though you purchased the license for more than 144 cores. This will help you receive the 100% RI utilization benefit.

>[!NOTE]
> Always confirm your Broadcom license covers the total cores for your planned deployment. 
> If you add more nodes later, update the configuration through the portal to include the new cores. 
> You can use the same VCF key (split cores) on multiple Azure VMware Solution private cloud. Make sure the net total cores registered on Azure VMware Solution does NOT exceed the cores purchased from Broadcom. 

### VMware vDefend Firewall add-on cores

The VMware vDefend Firewall add-on can be enabled in two flavors on Azure VMware Solution- NSX Distributed Firewall (DFW) and Gateway Firewall (GFW). The vDefend Firewall add-on cores counted for each differs as following: 

*NSX Distributed Firewall (DFW):* The total number of cores is determined by the quantity of host cores within the Azure VMware Solution private cloud. For instance, if there are 10 AV36P hosts and the NSX distributed firewall feature is enabled, the corresponding firewall add-on core count = 10 hosts * 36 cores per host = 360 cores

*NSX Gateway Firewall (GFW):* The total number of cores is determined by the NSX Edge vCPU being used in the Azure VMware Solution private cloud. The Gateway Firewall add-on core count is calculated as "(Number of Edges*Number of vCPU per edge * 4). 
For instance, Azure VMware Solution Gen-1 private cloud with default two Large NSX Edges's, the Gateway Firewall add-on core count is calculated as (2 Edges * 8 vCPU * 4) = 64 Gateway Firewall cores. If a customer has NSX Edge Scaled-UP to XL (16 vCPU) or Scale-OUT to 4 Edges, the GFW cores change.  Azure VMware Solution Gen-2 includes three NSX Large Edges by default, or 4 if cluster-1 has 4 or more nodes.  So, count the GFW cores accordingly. 

## Updating new VCF BYOL on Azure VMware Solution private cloud
You can update your VCF BYOL configuration on your Azure VMware Solution private cloud at any time without downtime or impact on your workloads. This includes updating your VCF key, adjusting the number of licensed cores (for example, when scaling or redistributing cores across private clouds), updating the VCF expiration date, or modifying your registered Firewall add-on. 

How to update your configuration: 

1. In the Azure portal, go to your Azure VMware Solution private cloud resource.
2. Under Manage, select Portable VCF (BYOL).
3. Click Edit next to the section you want to update (VCF license details or Firewall add-on).
4. Update the license key, number of cores, expiration date, or firewall details as needed.
5. Save your changes. Updates take effect immediately – no disruption to your private cloud. 

>[!NOTE] 
> You can update your configuration as often as needed. For example, if you add more nodes, update the core count to reflect your new deployment. 

:::image type="content" source="media/vmware-cloud-foundations-license-portability/portable-vcf-manage-edit.png" alt-text="Screenshot of how to edit your existing VCF portable subscription." border="true":::

>[!IMPORTANT] 
> You're responsible for ensuring that your total registered cores across all Azure VMware Solution private clouds don't exceed the number of cores purchased from Broadcom. The same applies to Firewall add-on licenses – ensure you have a valid Broadcom add-on license registered before enabling or updating firewall features. 
> If you're unsure about your configuration or compliance, reach out to your Microsoft account team or open a support ticket for clarification. Staying compliant avoids service interruptions. 

## Remove VCF BYOL from Azure VMware Solution private cloud 

You can remove your VCF BYOL configuration from your Azure VMware Solution private cloud at any time. This action unregisters your VCF license and, if applicable, any associated Firewall add-on licenses from the selected private cloud. You can remove one or the other independently. 

How to remove your configuration: 
1. In the Azure portal, open your Azure VMware Solution private cloud resource. 
2. Under Manage, select Portable VCF (BYOL). 
3. Click Remove next to the VCF license or Firewall add-on you wish to unregister. 
4. Confirm the removal when prompted. 

:::image type="content" source="media/vmware-cloud-foundations-license-portability/portable-vcf-manage-remove.png" alt-text="Screenshot of how to remove your VCF subscription already registered on Azure VMware Solution private cloud." border="true":::

>[!IMPORTANT] 
> Removing your VCF BYOL configuration does NOT disrupt your Azure VMware Solution private cloud. It only moves your Azure VMware Solution private cloud from your VCF BYOL to Microsoft-managed VCF. Note that after the Broadcom policy change, switching away from BYOL may not be permitted for new deployments after November 1, 2025. If you don’t have an active VCF-included RI on your Azure subscription, this action may result in being out of compliance. Microsoft holds the right to suspend any private cloud not in compliance with the licensing policy. 

Work with your Account Team to determine the best path forward. 

## Security and data handling 

Azure VMware Solution is committed to ensuring the security and privacy of customer-provided VCF BYOL license keys and related configuration data. 

### Secure License Storage and Lifecycle Management 

All VCF BYOL license keys and Firewall add-on licenses provided by customers are securely stored in Microsoft-managed key vaults. 

When a license key is deleted or deconfigured  (for example, when a customer updates a new key or removes the existing one), the key is retained for 90 days and then purged from the system to meet compliance requirements. 

### Data Privacy and Compliance 

Customer license data is handled in accordance with Microsoft’s data privacy and compliance standards. Only authorized cloud administrators can view or edit VCF BYOL configurations. All BYOL registrations and associated customer data are reported to Broadcom monthly, ensuring compliance with partner requirements. 

### Customer Responsibilities 

Customers are accountable for managing their VCF subscription cores and ensuring compliance with their Broadcom entitlements across all Azure VMware Solution private clouds. If you have questions about your configuration or compliance status, contact your Microsoft account team or open a support ticket for assistance. 

## Customers using VCF BYOL on their Azure subscription before Nov 2025 
If you're an existing Azure VMware Solution customer using VCF BYOL before November 2025 and registered your VCF keys through the registeravsvcfbyol@microsoft.com email, you'll need to update your configuration through the new Azure portal based VCF BYOL system latest by March 31, 2026. There will be NO disruption to your private cloud in this process.  

**Why is this important?**

 * This allows you to manage your VCF per Azure VMware Solution private cloud.
 * The new experience is built with deeper security, management, and support.  

The following steps outline the migration process: 

**Step 1: Access the Manage VCF BYOL Portal**
1. Sign in to the Azure portal and navigate to your Azure VMware Solution private cloud resource.
2. Under Manage, select Portable VCF (BYOL). 

**Step 2: Register Your VCF License**
1. For each Azure VMware Solution private cloud, register your VCF BYOL license by entering:  
   * Your VCF license key
   * The number of licensed cores
   * The VCF license end date
   * If you have a Firewall add-on license, enter those details as well. 
2. Review your configuration and save your changes. 
3. Repeat this process for all Azure VMware Solution private clouds under the Azure subscription. 

>[!NOTE]
> You can use the same VCF key (split cores) on multiple Azure VMware Solution private clouds. Make sure the net total cores registered on Azure VMware Solution doesn't exceed the cores purchased from Broadcom. 

**Step 3: Provide Formal Sign-Off**
Once you have registered your BYOL licenses on all relevant Azure VMware Solution private clouds, send a formal sign-off email (using the same VCF registration email registerAzure VMware Solutionvcfbyol@microsoft.com or by opening a support ticket) to confirm that your migration is complete. 

You receive confirmation once your migration is complete. 

>[!IMPORTANT]
> Until you complete re-registration through Azure portal, you'll continue to receive support through the legacy system until March 31, 2026. 
> Need Help? If you have questions or need assistance during migration, contact Microsoft support team. 

## Resolving VCF BYOL registration failures 

:::image type="content" source="media/vmware-cloud-foundations-license-portability/portable-vcf-manage-error.png" alt-text="Screenshot of error when registering portable VCF license." border="true":::

If your VCF BYOL registration fails – either during the "create private cloud workflow" or when updating in the "manage workflow" – you see a "Failed" status in the Azure portal. This failure is typically due to a system error on our side and not caused by any action from your end. 

What to do next: 

Only a cloud administrator can reconfigure the VCF BYOL registration. 

As soon as you see the "Failed" status, select Reconfigure, and follow the registration steps again to ensure your private cloud remains compliant and fully licensed. 

After you complete the reconfiguration, return to the Portable VCF (BYOL) page and verify that the status now shows as "Registered." 

>[!NOTE]
> After reconfiguring, always check back to confirm your registration status is "Registered." This ensures your Azure VMware Solution private cloud is compliant and avoids any service interruptions. 

If you continue to experience issues contact your Microsoft Support for assistance.

## Frequently Asked Questions
#### Is the portable VCF (BYOL) offering available in all regions and clouds, including Azure Government Cloud? 
Portable VCF (BYOL) is available in all Azure public and Gov regions where Azure VMware Solution is supported. 
 
#### What if my VCF subscription expires before my Azure VMware Solution Reserved Instance (RI) term ends?
Renew your VCF subscription with Broadcom and update your registration in the Azure portal. You must update your VCF keys on the Azure VMware Solution private cloud on or before your VCF subscription expires to continue complying without disruption. Your VCF expiry does NOT affect your Azure VMware Solution RIs. 

#### Can I switch back and forth between using Azure VMware Solution with BYOL and without BYOL? 
Switching from BYOL to Microsoft-managed VCF is only allowed if you have an active VCF-included RI. After November 1, 2025, new deployments must use BYOL. Switching away from BYOL may not be permitted for new deployments. Contact your Account team for further clarification. 

#### How do I know if my Azure VMware Solution private cloud is registered with BYOL?  
In the Azure portal, select your Azure VMware Solution private cloud and check the "Portable VCF (BYOL)" section under Manage. Your registered license details are displayed. 

#### Do I need to bring VCF BYOL for all Azure VMware Solution private cloud in my Azure subscription?  
You can choose VCF BYOL for each Azure VMware Solution private cloud individually. You don't need to convert your entire Azure subscription at once. However, with the new Broadcom policy, you can only use Microsoft-managed VCF if you have an active VCF-included Reserved Instance (RI) or if your Pay-as-you-go nodes were deployed before October 15, 2025. For all other hosts, you must register a valid VCF BYOL key. 

#### Do I need to bring VCF BYOL for all hosts/clusters within the Azure VMware Solution private cloud?  
No, you can have mixed licensing within the same Azure VMware Solution private cloud. You may continue using your existing VCF-included hosts without providing your own license, up to the number of active Reserved Instances (RI) purchased or for Pay-as-you-go nodes deployed before October 15, 2025. For any more hosts or clusters added beyond these, you must register VCF BYOL keys to cover the cores for only those more resources. 

You don't need to associate a specific host or cluster with a license – register your BYOL entitlement on the Portable VCF management page in the Azure portal. Azure VMware Solution automatically manages billing and compliance for your environment. 

#### What if I deploy more hosts than I have licensed (that is, exceed my Broadcom-entitled core count)? 

You must not exceed the total number of cores purchased from Broadcom. This would make your private cloud out of compliance and at risk of service suspension. Always update your configuration if you add more nodes. 

#### How do I know how many cores to port to the Azure VMware Solution private cloud?  

Multiply the number of hosts by the cores per host (for example, AV36P = 36 cores/host). The total must not exceed your Broadcom license entitlement. You can split a VCF key across multiple private clouds, but the sum of registered cores must stay within your entitlement. 

## Dos and Don'ts 

### Dos 

* Do ensure your VCF BYOL license keys and core counts are always up to date in the Azure portal.
* Do verify that your total registered cores across all Azure VMware Solution private clouds don't exceed your Broadcom entitlement.
* Do check your registration status after any configuration change to confirm compliance. 

### Don’ts 

* Don’t exceed your licensed core count – this may result in service suspension.
* Don’t ignore a "Failed" registration status – reconfigure immediately to avoid compliance issues.
* Don’t share your VCF BYOL license keys with unauthorized users.
* Don’t delay updating your VCF BYOL through Azure portal if you're an existing BYOL customer – complete your transition to Phase 2 within the required timeline. 
