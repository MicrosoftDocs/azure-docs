---
title: Change the billing for Azure RemoteApp | Microsoft Docs
description: Learn how to stop being billed for Azure RemoteApp.
services: remoteapp
documentationcenter: ''
author: msmbaldwin
manager: mbaldwin

ms.assetid: 8f94da9a-7848-4ddc-b7b7-d9c280ccf4d7
ms.service: remoteapp
ms.workload: compute
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/11/2017
ms.author: mbaldwin

---
# Migrate from Azure RemoteApp to MyCloudIT 

**Do you currently use Microsoft Azure RemoteApp?**: MyCloudIT built an automated tool to migrate your Azure RemoteApp (ARA) collection(s) to the MyCloudIT management platform while continuing to run on Microsoft Azure.

**Take advantage of the Azure Resource Manager portal**: Completed migration into the MyCloudIT platform enables instant access to Azure's new Azure Resource Manager portal. This portal contains all the new capabilities and innovations offered by Microsoft Azure, including access to Virtual Machine sizes to ensure your deployment is built to support the needs of your business.

**Test in parallel to ensure the right solution for your needs**:  The MyCloudIT migration tool is built to initiate the migration process and test in parallel while your current ARA users continue to use ARA.  Your users will remain in ARA until your migration and testing are complete.  The migration tool is built to handle the typical ARA collection.  If you feel you have a unique, non-standard scenario, please contact us at [sales@conexlink.com](mailto:sales@conexlink.com) so we can provide a tailored plan to assist with your migration.

**Desktop-as-a-Service Capabilities**: Please note that MyCloudIT not only offers the RemoteApp capabilities you are accustomed to, but we also offer full Desktop-As-A-Service capabilities for the same cost per month without any minimum user requirements.

## What we will do for you

MyCloudIT automates the migration of your Azure RemoteApp template from the Azure Classic portal of your subscription to the Azure Resource Manager Portal of your subscription with our automated migration tool.  

> [!NOTE]
> The Azure RemoteApp template must remain in the same Azure Region as your original Azure RemoteApp deployment.  If you need to change Azure Regions or Azure subscriptions during the migration, please contact us for additional guidance at [sales@conexlink.com](mailto:sales@conexlink.com).

Read below for detailed info on the automated migration process with the MyCloudIT migration tool:

1. The migration tool scans your current subscription(s) for all existing ARA deployments.  
2. Select one ARA collection to migrate at a time.  If you have multiple collections, run our tool multiple times.
3. You have the option to copy the User Profile Disks (UPD) to your new deployment so you can either retrieve legacy data, or manually map your UPDs to the new deployment. If you choose to copy your UPDs, we will save the UPDs and include a text file that maps the UPD name to each users' name.  The UPDs will be copied to a share on the RDSMGMT server `F:\Shares\LegacyUPD` and will be exposed via the share `\\RDSmgmt\LegacyUPD`. 
4. Your migration will require no downtime for your current ARA deployment.  But, if any changes are made to the UPDs (from ARA) after the copy, these changes will not be reflected in the UPDs stored in the Azure Resource Manager portal. 
5. If you have additional VMs like Domain Controllers and File Servers in your Classic Azure Virtual Network we will establish VNet peering between your existing Classic Azure Virtual Network and the new Virtual Network we create for you, in the new Azure Resource Manager Portal.
6. Our automated solution will only establish VNet peering between your existing Classic Azure Virtual Network and the new Virtual Network if your existing ARA deployment is a Hybrid Deployment; meaning, you are authenticating with a Windows Server Active Directory Domain Controller in the existing Classic Virtual Network. If we do not establish VNet peering for your collection, but you require VNet peering, please contact us as [sales@conexlink.com](mailto:sales@conexlink.com) and we will be happy to configure VNet peering at no additional cost.
7. Our automated solution will ensure your Azure DNS configuration is updated with the new Virtual Network settings to ensure your new deployment can connect to your existing Domain Controller in the classic VNet.
8. Our automated solution will ensure that there are no IP address conflicts as we create this new Virtual Network and establish the VNet peering for deployments that have an existing Windows Server Active Directory Server.
9. If you are only using Azure AD for authentication, MyCloudIT will create a new Windows Server Active Directory Domain and use Azure AD Connect to synchronize users between the existing Azure AD instance and the new Windows Server Active Directory Domain created by MyCloudIT.
10. If you are using a Windows Server Active Directory Domain to authenticate ARA users, our automated solution will connect your new MyCloudIT deployment to your existing Windows Server Active Directory Domain Controller via VNet peering.
11. If you are using Azure Active Directory Domain Services for authentication, we can migrate you, but please contact us so we can create a custom migration plan for you.  Please send an email to [sales@conexlink.com](mailto:sales@conexlink.com). 
12. Once the collection to be migrated is confirmed, sit back and relax while our automated solution migrates your ARA collection and User Profile Disks (optional) to the new MyCloudIT driven Remote Apps solution.
13. Once the deployment is complete, we will re-publish the same applications that were published in ARA, and post deployment you will be able to publish additional applications.

## Post Migration Benefits

1. We provide the management console that allows you to manage the full lifecycle of your Remote Apps deployment.
2. You will be able to manage your Virtual Machines from our portal.  Start / stop and resize individual VMs if needed.
3. The management console provides the ability to create and manage users / groups from our management portal.
4. The management console provides the ability to synchronize users with Office 365 to create a same sign-on experience.
5. The management console provides the ability to create additional Remote App and Desktop Collections without duplicate user costs, or minimum user requirements. 
6. The management console provides the ability to publish new Remote Apps applications.
7. The management console provides the ability to schedule the startup and shutdown of your Remote Apps deployment if you only need your solution during specific hours.
8. The management console provides the ability to automate the installation and configuration of the Azure Backup agent which provides a document retention history for your customer data.
9. The management console provides access to performance metrics of your deployment.  This gives you the ability to identify any potential performance bottlenecks without installing additional performance management tools.
10. If you have multiple session hosts, you will be able to enable auto scaling so only the session hosts that need to be running are running.
11. MyCloudIT provides access to the RDWeb gateway server via a MyCloudIT domain name.  We also provide the ability to re-map the URL to a custom URL for end user branding.

## Prerequisites for Migration

1. You must have access to the Azure subscription that hosts your current Azure RemoteApp solution.
2. You must grant our portal permissions within your subscription to migrate your template and to create / modify your new MyCloudIT deployment.
3. Please note that due to a limitation in Azure Remote App, each collection can only be migrated three times.  If you need to migrate a collection more than three times, you can either raise a ticket to Azure to increase your export count, or contact us and we will assist in the ARA request to increase the export count.

## MyCloudIT Billing

Please see [MyCloudIT Pricing for RemoteApp Solutions](https://mcitdocuments.blob.core.windows.net/terms/MyCloudIT_Pricing_Overview.pdf) (PDF) for information on how to predict and manage your overall Azure costs.

If you still have questions, please contact us at [sales@conexlink.com](mailto:sales@conexlink.com) or watch the full demo video [Azure RemoteApp Migration Tool - MyCloudIT](https://www.youtube.com/watch?v=YQ_1F-JeeLM&t=482s). 

