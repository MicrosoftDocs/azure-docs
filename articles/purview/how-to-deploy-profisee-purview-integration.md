---
title: Deploy Purview-Profisee Integration for MDM Master Data Management 
description: This guide describes how to deploy Profisee-Purview better together integration as a managed MDM Master Data Managemnent solution for your data estate governance.
author: arindamba
ms.author: arindamba
ms.service: purview
ms.subservice: purview-mdm
ms.topic: how-to
ms.date: 07/15/2022
ms.custom: template-how-to
---

Profisee-Purview Integration Deployment How-To Guide
1. Create a managed identity in Azure.
	You must have a Managed Identity created to run the deployment. This Managed Identity must have the following permissions when running a deployment. After it is done, the Managed Identity can be deleted. Based on your ARM template choices, you will need some or all of the following permissions assigned to your Managed Identity:
		○ Contributor role to the Resource Group where AKS will be deployed. This can either be assigned directly to the Resource Group OR at Subscription level down.
		○ DNS Zone Contributor role to the particular DNS zone where the entry will be created OR Contributor role to the DNS Zone Resource Group. This is needed only if updating DNS hosted in Azure.
		○ Application Administrator role in Azure Active Directory so the required permissions that are needed for the Application Registration can be assigned.
		○ Managed Identity Contributor and User Access Administrator at the Subscription level. These two are needed in order for the ARM template Managed Identity to be able to create the Key Vault specific Managed Identity that will be used by Profisee to pull the values stored in the Key Vault.
		○ Data Curator Role added for the Purview account for the Purview specific Application Registration.
1. Assign roles and permissions as per the list below and final state should look like this (attach image)
1. Go to https://github.com/Profisee/kubernetes and click "Azure ARM".
1. Read all the detailed steps mentioned on the GitHub article and click "Deploy to Azure" which will deploy everything in one-click through Azure Automation.
	i. Get the license file from Profisee by raising a support ticket. Only pre-req for this step is you need to know the URL your profisee setup on Azure will point to on Azure. In other words the DNS HOST NAME of the load balancer used in the deployment. It will be something like ""[profisee_name].[region].cloudapp.azure.com" . Example : DNSHOSTNAME="purviewprofisee.southcentralus.cloudapp.azure.com". Supply this DNSHOSTNAME to profisee support when you raise the support ticket and Profisee will revert with the license file. You will need to supply this file during the next configuration steps below. 
1. Once you click "Deploy to Azure" the configurator wizard will ask for the following inputs. Images below.
1. <Take the content from https://support.profisee.com/wikis/2022_r1_support/deploying_the_AKS_cluster_with_the_arm_template>
1. Make sure to give the exact same RG (Resource Group) in the deployment as you gave permissions to the managed identity in Step1.
1. Once deployment completes, click "Go to Resource Group" Attach image as shown in screenshot below.
1. Push sample data to the newly installed profisee environment by installing FastApp. Run InstallAll.cmd.
