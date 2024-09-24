---
title: <Placeholder>
author: saloniyadav
ms.author: saloniyadav
description: Bring your own VMware Cloud Foundations (VCF) License on Azure VMware Solutions
ms.topic: how-to
ms.service: azure-vmware
ms.date: 9/25/2024
---

# Title

Now you can bring your own VMware Cloud Foundation (VCF) entitlements to Azure VMware Solutions (AVS) and take advantage of incredible cost savings as you modernize your VMware workloads. Currently with AVS, you get access to both the physical infrastructure and the licensing entitlements for the entire VMware software-defined datacenter (SDDC) stack, including vSphere, ESXi, NSX networking, NSX Firewall, and HCX. With the new VCF BYOL (Bring Your Own License) option, you can leverage the license portability offering and apply your on-prem VCF entitlements purchased from Broadcom directly to the AVS infrastructure. This means you can seamlessly integrate your existing VMware assets into a fully managed, state-of-the-art Azure environment, maximizing efficiency and cutting costs. Upgrade with confidence and experience the power and flexibility of Azure VMware Solutions today! 


## What's changing!

ARIA is now included in the VCF bundle and fully supported by AVS for all BYOL customers. As we work towards offering ARIA out-of-the-box, our BYOL customers can still enjoy the features. Simply bring your own ARIA binaries and licenses (procured from Broadcom) and self-install them on AVS. In this self-installation phase, you are responsible for managing the installation, configurations, upgrades, scaling, backup, restore, and security patches for the ARIA software. AVS Experience seamless integration and support throughout your entire journey with ARIA on AVS. [Learn more about ARIA on AVS here](). 

Moving forward, the Azure VMware Solution will fully support VMware vDefend Firewall *as an add-on service*. For those using the VCF license portability offering on their SDDCs, it’s important to note that you must pre-purchase this Firewall add-on from Broadcom along with your VCF subscription. To start using the software on AVS, please ensure you register your Firewall add-on with Microsoft. Detailed instructions on how to register the license can be found below. In the near future, AVS will also offer the convenience of purchasing the Firewall add-on directly from Microsoft. [Learn more](). 

>[!IMPORTANT]
>
>VCF BYOL licenses are applied at the host level and must cover all the physical cores on a host. For example, if each host in AVS has 36 cores and you intend to have a Private Cloud with 3 nodes, the VCF portable license must cover 108 (3*36) cores. 
>In the current version, if you want to use your own license on an Azure subscription for the AVS workloads, all the nodes (cores) in that subscription including multiple Private Clouds need to be purchased through Broadcom and covered under your Broadcom VMware Cloud Foundations license portability contract. At the moment, Azure VMware Solutions does not support a mixed environment where some cores are covered under your own and some from AVS. However, changes to open mixed licensing scenarios are on the horizon and will enable more flexible licensing options soon.

## Purchasing AVS VCF BYOL

We offer three flexible commitments and pricing options for using your own VMware Cloud Foundations (VCF) license on Azure VMware Solutions, similar to how you can purchase AVS-managed licenses. You can choose from pay-as-you-go, 1-year Reserved Instance (RI), and 3-year RI options. To get a better idea of the costs involved, you can use the [Pricing Calculator]() and [Azure Migrate]() to estimate the price of the AVS nodes and your overall migration expenses. 

To take advantage of the discounted VCF BYOL pricing, simply purchase a Reserved Instance (RI) for the “Product Name” VCF BYOL that corresponds to the node type you’ll be using in your private cloud. For example, if your private cloud uses AV36P nodes, you must purchase the Reserved Instance for AV36P VCF BYOL. 

>> insert image

## Request host quota for AVS VCF BYOL

Existing: 
>> insert image

If requesting quota to leverage VCF BYOL pricing provide the following additional information in the Description of the support ticket:

- Region Name 
- Number of hosts 
- Host SKU type  
- Add the following statement as is, by replacing "N" with the ‘Number of VCF BYOL cores’ you have purchased from Broadcom for license portability to Azure VMware Solutions:  
*“I acknowledge that I have procured portable VCF license from Broadcom for "N" cores to use with Azure VMware Solutions.”*
- Any other details, including Availability Zone requirements for integrating with other Azure services; for example, Azure NetApp Files, Azure Blob Storage

>> insert image

>[!NOTE]
>
>VCF BYOL licenses are applied at the host level and must cover all the physical cores on a host.  
>Hence, quota will be approved only for the maximum number of nodes which the VCF portable license covers. For example, if you have purchased 1000 cores for portability and requesting for AV36P, you can get a maximum of 27 nodes quota approved for your subscription.

## Register your VCF license with AVS

To get your quota request approved, customers must first register the VCF license entitlement details with Microsoft. Quota will be approved only after the VCF license entitlements are provided. Once you submit your license entitlements and request for quota, expect to receive a response in 1 to 2 business days. 

How to register the VCF license keys:  

- Email your VCF license entitlements (and VMware vDefender Firewall license entitlements if to enable vDefender Firewall on AVS) to the following email address:  registeravsvcfbyol@microsoft.com. 

- VCF license entitlement sample: 
>> insert image

>[!NOTE]
>
>The Qty represents the number of cores eligible for license portability. Your quota request should not surpass the number of nodes equivalent to your entitled cores. If your quota request exceeds the approved cores, the quota will be granted only for the number of nodes that are fully covered by the entitled cores.

- VMware vDefend license 
>> insert image

Sample Email to register portable VCF entitlements: 
>> insert image

>[!NOTE] 
> 
> In the future, the VCF BYOL entitlement validation and onboarding process will be automated through the Azure Portal. However, during the interim phase, your VCF license entitlement will be securely retained for reporting to Broadcom. You can request the permanent deletion of this data from Microsoft's systems at any time. Once the automated validation process is in place, your entitlement data will be automatically deleted from all Microsoft systems, which may take up to 120 days. Additionally, all your VCF entitlement data will be deleted any time you migrate from BYOL to an AVS-owned VCF solution. 

## Creating/scaling a Private Cloud

You can create your Azure VMware Solutions Private Cloud the same way regardless of your licensing method, that is, whether you bring your own VCF license or use the AVS-owned VCF license. How you get your VCF license is a cost optimization choice and does not affect your deployment workflow.[Learn more]().

For example, you want to deploy 10 nodes of AV36P node type.

*Scenario 1:*
"I want to purchase VCF subscription from Broadcom and use the BYOL offering from AVS for license portability."

1. Request for quota for AV36P node type. Declare that you will be bringing your own VCF license and the number of cores you are entitled for license portability as in Section XX. 

2. Register your VCF entitlements via email as in Section YY.  

3. (Optional) To leverage the Reserved Instance pricing purchase AV36P VCF BYOL Reserved Instance. You will be charged Pay-go VCF BYOL pricing without this step. 

4. Create Cluster with AV36P node type. 

*Scenario 2:*
"I want to use AVS directly and let AVS manage my license."

1. Request for quota for AV36P node type. 

2. (Optional) Purchase AV36P Reserved Instance.  

3. Create Cluster with AV36P node type. 

## Converting BYOL to non-BYOL

If you are currently managing your own VMware Cloud Foundation (VCF) licensing for your Azure VMware Solution (AVS) deployments and wish to transition to AVS-owned licensing, such as when your VCF subscription ends, you can easily make the switch without any changes to your Private Cloud deployments.    

*Steps:*

1. Create a support request to inform us of your intent to transition. In the future, this support-based conversion process will be available directly through the Azure portal for Azure VMware Solutions. 
>> TODO: Add point on ARIA 

2. If you have any active Reserved Instance (RI) for the VCF BYOL, simply exchange them for non-VCF BYOL RI. For instance, you can [exchange your AV36P VCF BYOL SKU RI for an AV36P](). 

## Converting from non-BYOL to BYOL

If you are an existing AVS customer using AVS-owned licensing deployments and wish to transition to the license portability (VCF BYOL) offering, you can also easily make the switch without any changes to your Private Cloud deployments.  

Simply, register your VCF entitlements with us as in the steps mentioned above. You will need to purchase the VCF entitlements from Broadcom for all cores that match your current AVS deployment. For instance, if your Azure subscription has a Private Cloud with 100 AV36P nodes, you must purchase VCF subscription for atleast 3600 cores from Broadcom to convert to VCF BYOL offering.  