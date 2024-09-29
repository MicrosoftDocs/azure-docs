---
title: Advance your cloud strategy using VMware Cloud Foundations (VCF) license portability on Azure VMware Solutions 
author: saloniyadav
ms.author: saloniyadav
description: Bring your own VMware Cloud Foundations (VCF) License on Azure VMware Solutions
ms.topic: how-to
ms.service: azure-vmware
ms.date: 9/30/2024
---

# Advance your cloud strategy using VMware Cloud Foundations (VCF) license portability on Azure VMware Solutions 

Now you can bring your own VMware Cloud Foundations (VCF) entitlements to Azure VMware Solutions (AVS) and take advantage of incredible cost savings as you modernize your VMware workloads. Currently with AVS, you get access to both the physical infrastructure and the licensing entitlements for the entire VMware software-defined datacenter (SDDC) stack, including vSphere, ESXi, NSX networking, NSX Firewall, and HCX. With the new VCF license portability option, you can use the offering to apply your on-prem VCF entitlements purchased from Broadcom directly to the AVS infrastructure. This means you can seamlessly integrate your existing VMware assets into a fully managed, state-of-the-art Azure environment, maximizing efficiency and cutting costs. Upgrade with confidence and experience the power and flexibility of Azure VMware Solutions today! 


## What's changing!

ARIA is now included in the VCF bundle and fully supported by AVS for all VCF license portability customers. Simply bring your own ARIA binaries and licenses (procured from Broadcom) and self-install them on AVS. In this self-installation phase, you are responsible for managing the installation, configurations, upgrades, scaling, backup, restore, and security patches for the ARIA software. Experience seamless integration and support throughout your entire journey with ARIA on AVS. [Learn more about ARIA on AVS here](/articles/azure-vmware/vmware-aria-in-azure-vmware-solution.md). 

Moving forward, VMware vDefend Firewall on AVS will become an **add-on service**. If you are using VCF license portability offering on their SDDCs, you must prepurchase this Firewall add-on from Broadcom along with your VCF subscription to use the vDefend Firewall on AVS. Prior to using the vDefend Firewall software on AVS ensure you register your Firewall add-on with Microsoft. Detailed instructions on how to register your VCF license can be found further in the article.

>[!IMPORTANT]
>
>VCF portable licenses are applied at the host level and must cover all the physical cores on a host. For example, if each host in AVS has 36 cores and you intend to have a Private Cloud with 3 nodes, the VCF portable license must cover 108 (3*36) cores. 
>In the current version, if you want to use your own license on an Azure subscription for the AVS workloads, all the nodes (cores) in that subscription including multiple Private Clouds need to be purchased through Broadcom and covered under your Broadcom VCF license portability contract. At the moment, you are required to bring VCF license entitlements that cover cores for all the nodes deployed within your Azure Subscription. In the future, an option to scale beyond your portable license entitlement will be offered.

## Purchasing AVS VCF BYOL

We offer three flexible commitments and pricing options for using your own VCF license on AVS. You can choose from pay-as-you-go, 1-year Reserved Instance (RI), and 3-year RI options. 
To get a better idea of the costs involved, you can use the [Pricing Calculator]() and [Azure Migrate](https://learn.microsoft.com/en-us/azure/migrate/concepts-azure-vmware-solution-assessment-calculation) to estimate the price of the AVS nodes and your overall migration expenses. 

To take advantage of the Reserved Instance (RI) pricing for the VCF license portability offering, simply purchase an RI under the Product Name- VCF BYOL. For example, if your private cloud uses AV36P nodes, you must [purchase the Reserved Instance](https://learn.microsoft.com/en-us/azure/azure-vmware/reserved-instance?toc=%2Fazure%2Fcost-management-billing%2Freservations%2Ftoc.json#buy-a-reservation) for the Product Name- AV36P VCF BYOL. To use the Pay-go pricing for the VCF license portability offering, simply [register your VCF license](#Register your VCF license with AVS). 

:::image type="content" source="media/vcf-byol/ri-purchase.png" alt-text="Picture of what product type to select while purchasing reserved instance for VCF license portability offering" border="false":::

## Request host quota for AVS VCF BYOL

Existing: 
:::image type="content" source="media/vcf-byol/quota-request-old.png" alt-text="Picture of the quota request description for existing AVS" border="false":::

To request quota for VCF license portability offering, provide the following additional information in the **Description** of the support ticket:

- Region Name 
- Number of hosts 
- Host SKU type  
- Add the following statement as is, by replacing "N" with the ‘Number of VCF BYOL cores’ you purchased from Broadcom for license portability to Azure VMware Solutions:  
**"I acknowledge that I have procured portable VCF license from Broadcom for "N" cores to use with Azure VMware Solutions."**
- Any other details, including Availability Zone requirements for integrating with other Azure services; for example, Azure NetApp Files, Azure Blob Storage

:::image type="content" source="media/vcf-byol/quota-request-byol.png" alt-text="Picture of the quota request description for VCF license portability offering on AVS" border="false":::

>[!NOTE]
>
>VCF portable license is applied at the host level and must cover all the physical cores on a host.  
>Hence, quota will be approved only for the maximum number of nodes which the VCF portable license covers. For example, if you have purchased 1000 cores for portability and requesting for AV36P, you can get a maximum of 27 nodes quota approved for your subscription.

## Register your VCF license with AVS

To get your quota request approved, customers must first register the VCF portable license details with Microsoft. Quota will be approved only after the entitlements are provided. Expect to receive a response in 1 to 2 business days. 

### How to register the VCF license keys:  

- Email your VCF license entitlements (and VMware vDefender Firewall license entitlements if to enable vDefender Firewall on AVS) to the following email address:  registeravsvcfbyol@microsoft.com. 

- VCF entitlement sample: 
:::image type="content" source="media/vcf-byol/vcf-entitlements.png" alt-text="How to register your VCF portable license entitlements with Microsoft" border="false":::

>[!NOTE]
>
>The "Qty" represents the number of cores eligible for VCF license portability. Your quota request should not surpass the number of nodes equivalent to your entitled cores from Broadcom. If your quota request exceeds the approved cores, the quota request will be granted only for the number of nodes that are fully covered by the entitled cores.

- VCF entitlement With VMware vDefend entitlement sample: 
:::image type="content" source="media/vcf-byol/vcf-vdefend-entitlements.png" alt-text="VCF entitlement With VMware vDefend entitlement" border="false":::

Sample Email to register portable VCF entitlements: 
:::image type="content" source="media/vcf-byol/email-register-vcf.png" alt-text="Sample Email to register portable VCF " border="false":::

** The VMware vDefend Firewall add-on CPU cores required on Azure VMware Solution depend on the planned feature usage: 
- For NSX Distributed Firewall: same core count as VCF core count. 
- For NSX Gateway Firewall, it would be 64 cores (with default NSX Edges).
- For both NSX Distributed and Gateway firewall, it should be combined core count of both.

>[!NOTE] 
> 
> In the future, the VCF portable license onboarding process will be automated through the Azure Portal. However, during the interim phase, your VCF license will be securely retained for our reporting purpose. You can request the permanent deletion of this data from Microsoft's systems at any time. Once the automated validation process is in place, your data will be automatically deleted from all Microsoft systems, which may take up to 120 days. Additionally, all your VCF entitlement data will be permanently deleted within 120 days any time you migrate to an AVS-owned VCF solution. 

## Creating/scaling a Private Cloud

You can create your AVS Private Cloud the same way as today regardless of your licensing method, that is, whether you bring your own VCF portable license or use the AVS-owned VCF license.[Learn more](https://learn.microsoft.com/en-us/azure/azure-vmware/plan-private-cloud-deployment). Your decision of licensing is a cost optimization choice and does not affect your deployment workflow.

For example, you want to deploy 10 nodes of AV36P node type.

**Scenario 1:**
"I want to purchase my VCF subscription from Broadcom and use the license portability offering on AVS."

1. Create quota request for AV36P nodes. Declare your own VCF portable license intent and the number of cores you are entitled for portability. 

2. Register your VCF entitlements via email to Microsoft.  

3. Optional- to use the Reserved Instance pricing purchase AV36P VCF BYOL Reserved Instance. You can skip this step to use the Pay-go pricing for the VCF license portability.

4. Create your Private Cloud with AV36P nodes. 

**Scenario 2:**
"I want to let AVS manage my license for all my AVS private cloud."

1. Create quota request for AV36P node type. 

2. Optional- Purchase AV36P Reserved Instance.  

3. Create your Private Cloud with AV36P nodes. 

## Converting BYOL to non-BYOL

If you are currently managing your own VCF licensing for AVS and wish to transition to AVS-owned licensing, you can easily make the switch without any changes to your Private Cloud.    

**Steps:**

1. Create a support request to inform us of your intent to convert. In the future, this support-based conversion process will be available directly through the Azure portal for Azure VMware Solution. 

2. Exchange RI- If you have any active RI with VCF BYOL, exchange them for non-VCF BYOL RI. For instance, you can [exchange your AV36P VCF BYOL RI for an AV36P](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/exchange-and-refund-azure-reservations). 

## Converting from non-BYOL to BYOL

If you are an existing AVS customer using AVS-owned licensing deployments and wish to transition to the license portability (VCF BYOL) offering, you can also easily make the switch without any changes to your Private Cloud deployments.  

Simply, register your VCF entitlements with Microsoft. You will need to purchase the VCF entitlements from Broadcom for all cores that match your current AVS deployment. For instance, if your Azure subscription has a Private Cloud with 100 AV36P nodes, you must purchase VCF subscription for atleast 3600 cores from Broadcom to convert to VCF BYOL offering.  
