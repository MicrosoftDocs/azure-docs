---
title: Use Portable VMware Cloud Foundation (VCF) on Azure VMware Solution
ms.author: saloniyadav
description: Learn how to bring your own VMware Cloud Foundation (VCF) subscription to Azure VMware Solution by using the Azure portal.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 11/04/2025
# Customer intent: As a cloud administrator, I want to register and integrate my portable VMware Cloud Foundation subscription with Azure VMware Solution, so that I can use my existing licenses and optimize costs while modernizing my VMware workloads in a fully managed environment.
---

# Use portable VMware Cloud Foundation (VCF) on Azure VMware Solution

This article helps you navigate the changes related to Broadcom's new VMware licensing model for hyperscalers. Customers must purchase VMware Cloud Foundation (VCF) subscriptions directly from Broadcom to use hyperscaler cloud services. This requirement means that as of November 1, 2025, Microsoft no longer includes a VCF license or subscription with new Azure VMware Solution node purchases.

If you have an active reserved instance purchased for VCF-included hosts, you can continue using the VCF-included solution until the end of your reserved instance's term. After that, you're required to bring your own VCF subscription (also called *bring your own license*, or BYOL). At any point, if your usage exceeds the active VCF-included reserved instance that you purchased, you must bring your own VCF subscription for that surplus usage.

Azure VMware Solution already supports the VCF portability (BYOL) option, which enables you to bring your own VCF subscription to Azure VMware Solution. However, until now, the VCF portability option was supported at an Azure subscription level through support-based registration.

Now, you can enable VCF portability directly through the Azure portal when you're creating or managing an Azure VMware Solution private cloud. This self-service model also enables you to continue using your existing VCF-included deployments and add your own portable VCF subscription only for the new hosts that are *not* covered under the VCF-included offering.

## New scope

You now have full flexibility to apply portable VCF per Azure VMware Solution private cloud, instead of your entire Azure subscription. You can run some Azure VMware Solution private clouds with your own portable VCF subscription and others with a Microsoft-provided VCF subscription, all under the same Azure subscription. This ability enables phased migrations and removes the need to convert everything at once.

If you have an active reserved instance for VCF-included hosts and you want to add new hosts, you can register portable VCF only for those added hosts. You can continue using your existing VCF-included hosts until the end of the reserved instance's term.

VMware vDefend Firewall is an add-on feature for Azure VMware Solution. Customers who have active reserved instances for VCF-included hosts and vDefend Firewall enabled before October 16, 2025, can continue to use the same number of eligible vDefend firewall cores until the reserved instances expire.

If either of the following scenarios happens, you must provide your own VCF vDefend Firewall add-on license key for continued usage:

* Your license-included reserved instance expires.
* Your vDefend Firewall core usage exceeds the eligible VCF-included cores as of October 15, 2025.

## Quota request for portable VCF

When you use portable VCF, you must still request capacity (quotas) for Azure VMware Solution hosts as usual. Always ensure that your Broadcom-purchased VCF core count covers the scale that you need.

For more information on how to request host quotas, see [Request host quotas for Azure VMware Solution](./request-host-quota-azure-vmware-solution.md).

## Trials on Azure VMware Solution

Trials on Azure VMware Solution were previously available to partners and customers for 30 days. Azure VMware Solution three-node trials are now available to partners and customers for 60 days.

Customers must provide a valid trial VCF key from Broadcom before the Azure VMware Solution trial can be deployed. For existing trials in progress before November 1, 2025, customers must update their VCF key in the Azure portal on their Azure VMware Solution private cloud.

After 60 days, deployed trials automatically switch to billed hosts unless you delete the deployment before the 60-day period elapses. If you haven't already purchased a VCF-included reserved instance, you must provide your Broadcom-purchased VCF configuration before your trial ends. Adherence to licensing compliance ensures successful continuity of your Azure VMware Solution private cloud.

## Configure portable VCF on your Azure VMware Solution private cloud

Register the portable VCF details on your Azure VMware Solution private cloud through the Azure portal. This feature is currently available only through the Azure portal.

You have two options:

* Configure portable VCF while creating a new Azure VMware Solution private cloud.
* Enable portable VCF on an existing Azure VMware Solution private cloud.

### Configure portable VCF while creating a new Azure VMware Solution private cloud

When you create a new Azure VMware Solution private cloud via the Azure portal, you get a **Portable VCF (BYOL)** option to provide VCF license information.

:::image type="content" source="media/vmware-cloud-foundations-license-portability/portable-vcf-create-new-private-cloud-with-vcf-byol.png" alt-text="Screenshot of the option to register VCF portable subscription entitlements with Microsoft while creating an Azure VMware Solution private cloud." border="true":::

Select **Configure** and provide all the required details:

* VCF license/subscription key (the 25-character [key from Broadcom](https://knowledge.broadcom.com/external/article/145804/download-license-keys-for-broadcom-ca-sy.html)).
* Broadcom site ID associated with your contract.
* License expiration date (the end date of your VCF subscription purchased from Broadcom).
* Number of cores that you want to bring to this Azure VMware Solution private cloud. This number can't exceed the number of cores that you purchased under the provided VCF key from Broadcom.

:::image type="content" source="media/vmware-cloud-foundations-license-portability/portable-vcf-create-new-private-cloud-with-vcf-byol-side-pane.png" alt-text="Screenshot of the form to register a VCF portable subscription." border="true":::

To use the VMware vDefend Firewall add-on on an Azure VMware Solution private cloud, you must pre-purchase it from Broadcom. You can also update your vDefend Firewall add-on license key after your Azure VMware Solution private cloud is created. Continue reading for more information.

### Enable portable VCF on an existing Azure VMware Solution private cloud

You can convert an already running Azure VMware Solution private cloud to use your own VCF subscription without any downtime or interruption on your deployment. In the Azure portal, go to your Azure VMware Solution private cloud resource and look for **Portable VCF (BYOL)** under **Manage**.

:::image type="content" source="media/vmware-cloud-foundations-license-portability/portable-vcf-manage-pane.png" alt-text="Screenshot of the management page to register a VCF portable subscription within an Azure VMware Solution private cloud." border="true":::

Under **VCF license details**, select **Configure** and provide all the required details:

* VCF license/subscription key (the 25-character [key from Broadcom](https://knowledge.broadcom.com/external/article/145804/download-license-keys-for-broadcom-ca-sy.html)).
* Broadcom site ID associated with your contract.
* License expiration date (the end date of your VCF subscription purchased from Broadcom).
* Number of cores that you want to bring to this Azure VMware Solution private cloud. This number can't exceed the number of cores that you purchased under the provided VCF key from Broadcom.

After you save the details, your existing hosts switch to the portable VCF (BYOL) pricing.

> [!NOTE]
> If you want to take advantage of cost savings with reserved pricing, purchase an Azure VMware Solution reserved instance with **VCF BYOL** for the corresponding host type.

## Use VMware vDefend Firewall on an Azure VMware Solution private cloud

VMware vDefend Firewall is an add-on feature for Azure VMware Solution. If you had active reserved instances that included VCF and you enabled vDefend Firewall before October 16, 2025, you can continue to use the same number of eligible vDefend firewall cores until your reservation expires.

You must provide your own VCF vDefend Firewall add-on license key for continued or more usage in either of these situations:

* Your reservation expires.
* Your vDefend Firewall core usage exceeds the eligible VCF-included cores as of October 15, 2025.

This information applies to both VCF-included hosts and portable VCF (BYOL) hosts.

Attempting to enable firewall features without having a Broadcom firewall subscription (or without registering it) puts you out of compliance. Microsoft holds the right to suspend your Azure VMware Solution private cloud under these circumstances until resolution.

You can find more information about the VMware vDefend Firewall feature set in the [Broadcom documentation](https://knowledge.broadcom.com/external/article/145804/download-license-keys-for-broadcom-ca-sy.html). Note that all listed firewall features might not be supported on Azure VMware Solution. Check with the Microsoft team for more details.

You should register vDefend Firewall in addition to the base VCF license registration. After you enter the information for the registration, your Azure VMware Solution private cloud is aware that the firewall is BYOL licensed.

:::image type="content" source="media/vmware-cloud-foundations-license-portability/portable-vcf-manage-firewall-configure.png" alt-text="Screenshot of selections for registering a VCF firewall license on an Azure VMware Solution private cloud." border="true":::

If you intend to use vDefend Firewall with Advanced Threat Prevention, submit a support ticket with a license key to have your license provisioned in your private cloud. Do this task in addition to adding the vDefend Firewall add-on license key as outlined.

> [!NOTE]
>
> * NSX Distributed Firewall is considered enabled when a customer configures a non-default Distributed Firewall policy or Distributed Firewall IPFIX profile.
> * NSX Gateway Firewall is considered enabled when a customer configures a non-default Gateway Firewall policy.

## Calculate the number of cores

### VCF cores for an Azure VMware Solution private cloud

1. Check your Azure VMware Solution host type:

    | Host type | Number of cores per host |
    | --------- | ------------------------ |
    | AV36, AV36P | 36 |
    | AV48 | 48 |
    | AV52 | 52 |
    | AV64 | 64 |

2. Multiply the number of hosts by cores per host.

   For example, if you want to use portable VCF for three AV64 hosts in your Azure VMware Solution private cloud, the portable VCF cores required are: 3 hosts * 64 cores per host = 192 cores.

   In a mixed billing scenario:

   * If your Azure VMware Solution private cloud has three AV36P hosts and you want to add four more AV36P VCF BYOL hosts, the total of VCF cores required is: (3 * 36 = 108) from the Azure VMware Solution license + (4 * 36 = 144) from the BYOL license = 252.
   * Register 144 cores *only* for BYOL, even though you purchased the license for more than 144 cores. This setup helps you receive the 100% utilization benefit for reserved instances.

> [!NOTE]
> Always confirm that your Broadcom license covers the total cores for your planned deployment. If you add more nodes later, update the configuration through the portal to include the new cores.
>
> You can use the same VCF key (split cores) on multiple Azure VMware Solution private clouds. Make sure that the total of cores registered on Azure VMware Solution does *not* exceed the number of cores purchased from Broadcom.

### VMware vDefend Firewall add-on cores

The VMware vDefend Firewall add-on can be enabled in NSX Distributed Firewall and NSX Gateway Firewall on Azure VMware Solution. The vDefend Firewall add-on cores counted for each differ as follows:

* *NSX Distributed Firewall*: The total number of cores is determined by the quantity of host cores within the Azure VMware Solution private cloud. For instance, if there are 10 AV36P hosts and the NSX Distributed Firewall feature is enabled, the corresponding count of firewall add-on cores is: 10 hosts * 36 cores per host = 360 cores.

* *NSX Gateway Firewall*: The total number of cores is determined by the NSX edge vCPU being used in the Azure VMware Solution private cloud. The count of Gateway Firewall add-on cores is calculated as: number of edges * number of vCPUs per edge * 4.

  For instance, for an Azure VMware Solution Generation 1 private cloud with the default two large NSX edges, the Gateway Firewall add-on core count is calculated as: 2 edges * 8 vCPUs * 4 = 64 Gateway Firewall cores.
  
  If you have an NSX edge scaled up to extra large (16 vCPUs) or scaled out to four edges, the Gateway Firewall cores change. Azure VMware Solution Generation 2 includes three NSX large edges by default, or four edges if cluster 1 has four or more nodes. So, count the Gateway Firewall cores accordingly.

## Update VCF BYOL on an Azure VMware Solution private cloud

You can update your VCF BYOL configuration on your Azure VMware Solution private cloud at any time without downtime or impact on your workloads. This effort can include:

* Updating your VCF key.
* Adjusting the number of licensed cores (for example, when scaling or redistributing cores across private clouds).
* Updating the VCF expiration date.
* Modifying your registered firewall add-on.

To update your configuration:

1. In the Azure portal, go to your Azure VMware Solution private cloud resource.

2. Under **Manage**, select **Portable VCF (BYOL)**.

3. Select **Edit** in the section that you want to update (**VCF license details** or **VMware vDefend firewall add-on**).

4. Update the license key, number of cores, expiration date, or firewall details as needed.

5. Save your changes. Updates take effect immediately, without disruption to your private cloud.

:::image type="content" source="media/vmware-cloud-foundations-license-portability/portable-vcf-manage-edit.png" alt-text="Screenshot of options for editing an existing VCF portable subscription." border="true":::

You can update your configuration as often as needed. For example, if you add more nodes, update the core count to reflect your new deployment.

> [!IMPORTANT]
> You're responsible for ensuring that your total of registered cores across all Azure VMware Solution private clouds doesn't exceed the number of cores that you purchased from Broadcom. The same responsibility applies to firewall add-on licenses: ensure that you have a valid Broadcom add-on license registered before you enable or update firewall features.
>
> If you're unsure about your configuration or compliance, contact your Microsoft account team or open a support ticket for clarification. Staying compliant avoids service interruptions.

## Remove VCF BYOL from an Azure VMware Solution private cloud

You can remove your VCF BYOL configuration from your Azure VMware Solution private cloud at any time. This action unregisters your VCF license and, if applicable, any associated firewall add-on licenses from the selected private cloud. You can remove one or the other independently.

To remove your configuration:

1. In the Azure portal, open your Azure VMware Solution private cloud resource.

2. Under **Manage**, select **Portable VCF (BYOL)**.

3. Select **Remove** next to the VCF license or firewall add-on that you want to unregister.

4. Confirm the removal when you're prompted.

:::image type="content" source="media/vmware-cloud-foundations-license-portability/portable-vcf-manage-remove.png" alt-text="Screenshot of selections for removing a VCF subscription that's already registered on an Azure VMware Solution private cloud." border="true":::

> [!IMPORTANT]
> Removing your VCF BYOL configuration does *not* disrupt your Azure VMware Solution private cloud. It only moves your Azure VMware Solution private cloud from VCF BYOL to Microsoft-managed VCF.
>
> Due to the Broadcom policy change, switching away from BYOL might not be permitted for new deployments after November 1, 2025. If you don't have an active VCF-included reserved instance on your Azure subscription, this action might cause you to be out of compliance. Microsoft holds the right to suspend any private cloud that's not in compliance with the licensing policy.

Work with your account team to determine the best path forward.

## Understand security and data handling

Azure VMware Solution is committed to ensuring the security and privacy of customer-provided VCF BYOL license keys and related configuration data.

### Secure license storage and lifecycle management

All VCF BYOL license keys and firewall add-on licenses that customers provide are securely stored in Microsoft-managed key vaults.

When a license key is deleted or deconfigured (for example, when a customer updates a new key or removes the existing one), the key is retained for 90 days and then removed from the system to meet compliance requirements.

### Data privacy and compliance

Customer license data is handled in accordance with Microsoft's data privacy and compliance standards. Only authorized cloud administrators can view or edit VCF BYOL configurations. All BYOL registrations and associated customer data are reported to Broadcom monthly, for compliance with partner requirements.

### Customer responsibilities

Customers are accountable for managing their VCF subscription cores and ensuring compliance with their Broadcom entitlements across all Azure VMware Solution private clouds. If you have questions about your configuration or compliance status, contact your Microsoft account team or open a support ticket for assistance.

## Update your VCF BYOL configuration

If you're an existing Azure VMware Solution customer, you need to update your configuration through the new Azure portal-based VCF BYOL system if both of these conditions apply:

* You were using VCF BYOL before November 2025.
* You registered your VCF keys through the [registration email](mailto:registeravsvcfbyol@microsoft.com).

You must finish the update by March 31, 2026. There's *no* disruption to your private cloud in this process.

Updating your configuration is important because:

* It allows you to manage your VCF keys per Azure VMware Solution private cloud.
* The new experience is built with deeper security, management, and support.

The following steps outline the migration process.

### Step 1: Access the portal for managing VCF BYOL

1. Sign in to the Azure portal and go to your Azure VMware Solution private cloud resource.

2. Under **Manage**, select **Portable VCF (BYOL)**.

### Step 2: Register your VCF license

1. For each Azure VMware Solution private cloud, register your VCF BYOL license by entering:
   * Your VCF license key.
   * The number of licensed cores.
   * The end date of the VCF license.
   * Details about the firewall add-on license, if you have one.

2. Review your configuration and save your changes.

3. Repeat this process for all Azure VMware Solution private clouds under the Azure subscription.

> [!NOTE]
> You can use the same VCF key (split cores) on multiple Azure VMware Solution private clouds. Make sure that the total of cores registered on Azure VMware Solution doesn't exceed the number of cores purchased from Broadcom.

### Step 3: Provide formal sign-off

After you register your BYOL licenses on all relevant Azure VMware Solution private clouds, send a formal sign-off email to confirm that your migration is complete. You can use the [VCF registration email](mailto:registeravsvcfbyol@microsoft.com) or open a support ticket for this task.

You receive confirmation after your migration is complete.

> [!IMPORTANT]
> Until you complete re-registration through the Azure portal, you continue to receive support through the legacy system until March 31, 2026.
>
> If you have questions or need assistance during migration, contact the Microsoft support team.

## Resolve VCF BYOL registration failures

If your VCF BYOL registration fails, either when you're creating a private cloud workflow or when you're managing a workflow, a **Failed** status appears in the Azure portal. This failure is typically due to a system error on our side and not caused by any action from your end.

:::image type="content" source="media/vmware-cloud-foundations-license-portability/portable-vcf-manage-error.png" alt-text="Screenshot of an error in registering a portable VCF license." border="true":::

What to do next:

1. As soon as you see the **Failed** status, select **Reconfigure**. Then follow the registration steps again.

1. After you complete the reconfiguration, return to the **Portable VCF (BYOL)** page and verify that the status is now **Registered**.

Verifying the status after reconfiguration ensures that your Azure VMware Solution private cloud is compliant and fully licensed. It also avoids service interruptions.

If you continue to experience problems, contact Microsoft support for assistance.

## Frequently asked questions

### Is the portable VCF (BYOL) offering available in all regions and clouds, including Azure Government?

Portable VCF (BYOL) is available in all Azure public and Azure Government regions where Azure VMware Solution is supported.

### What if my VCF subscription expires before the term for my Azure VMware Solution reserved instance ends?

Renew your VCF subscription with Broadcom and update your registration in the Azure portal. To continue complying without disruption, you must update your VCF keys on the Azure VMware Solution private cloud on or before the expiry of your VCF subscription. Your VCF expiry does *not* affect your Azure VMware Solution reserved instances.

### Can I switch back and forth between using Azure VMware Solution with BYOL and without BYOL?

Switching from BYOL to Microsoft-managed VCF is allowed only if you have an active VCF-included reserved instance. As of November 1, 2025, new deployments must use BYOL. Switching away from BYOL might not be permitted for new deployments. For further clarification, contact your account team.

### How do I know if my Azure VMware Solution private cloud is registered with BYOL?

In the Azure portal, select your Azure VMware Solution private cloud and check the **Portable VCF (BYOL)** section under **Manage**. This section displays your registered license details.

### Do I need to bring VCF BYOL for all Azure VMware Solution private clouds in my Azure subscription?

You can choose VCF BYOL for each Azure VMware Solution private cloud individually. You don't need to convert your entire Azure subscription at once. However, with the new Broadcom policy, you can use only Microsoft-managed VCF if one of these conditions applies:

* You have an active VCF-included reserved instance.
* Your pay-as-you-go nodes were deployed before October 15, 2025.

For all other hosts, you must register a valid VCF BYOL key.

### Do I need to bring VCF BYOL for all hosts/clusters within the Azure VMware Solution private cloud?

No, you can have mixed licensing within the same Azure VMware Solution private cloud. You can continue using your existing VCF-included hosts without providing your own license, up to the number of active reserved instances purchased or for pay-as-you-go nodes deployed before October 15, 2025. For any additional hosts or clusters, you must register VCF BYOL keys to cover the cores for only those resources.

You don't need to associate a specific host or cluster with a license. Register your BYOL entitlement on the **Portable VCF management** page in the Azure portal. Azure VMware Solution automatically manages billing and compliance for your environment.

### What if I deploy more hosts than I have licensed (that is, exceed my Broadcom-entitled core count)?

You must not exceed the total number of cores purchased from Broadcom. This situation would make your private cloud out of compliance and at risk of service suspension. Always update your configuration if you add more nodes.

### How do I know how many cores to move to the Azure VMware Solution private cloud?

Multiply the number of hosts by the cores per host (for example, AV36P = 36 cores per host). The total must not exceed your Broadcom license entitlement. You can split a VCF key across multiple private clouds, but the sum of registered cores must stay within your entitlement.

## Dos and Don'ts

Do:

* Ensure that your VCF BYOL license keys and core counts are always up to date in the Azure portal.
* Verify that your total of registered cores across all Azure VMware Solution private clouds doesn't exceed your Broadcom entitlement.
* Check your registration status after any configuration change to confirm compliance.

Don't:

* Exceed your licensed core count. It might result in service suspension.
* Ignore a **Failed** registration status. Reconfigure immediately to avoid compliance issues.
* Share your VCF BYOL license keys with unauthorized users.
* Delay updating your VCF BYOL configuration through the Azure portal if you're an existing BYOL customer. Be sure to complete your transition to Phase 2 within the required timeline.
