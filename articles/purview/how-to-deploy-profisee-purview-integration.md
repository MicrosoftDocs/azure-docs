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

# Microsoft Purview - Profisee Integration
Master Data Management (MDM) is a key pillar of any world class industry leading Unified Data Governance solution. Microsoft Purview now supports Master Data Management MDM with Partners such as Profisee, CluedIn, Tamr, Semarchy. This tutorial compiles reference and integration deployment materials at one place to get you started on your MDM journey with Microsoft Purview through our integration with Profisee.

## What, why and how of MDM - Master Data Management ?
Master data management (MDM) arose out of the necessity for businesses to improve the consistency and quality of their key data assets, such as product data, asset data, customer data, location data, etc. Many businesses today, especially global enterprises have hundreds of separate applications and systems (ie ERP, CRM) where data that crosses organizational departments or divisions can easily become fragmented, duplicated and most commonly out of date. When this occurs, answering even the most basic, but critical questions about any type of performance metric or KPI for a business accurately becomes a pain.
Getting answers to basic questions such as “who are our most profitable customers?”, “what product(s) have the best margins?” or in some cases, “how many employees do we have”? become tough to answer – or at least with any degree of accuracy.
Basically, the need for accurate, timely information is acute and as sources of data increase, managing it consistently and keeping data definitions up to date so all parts of a business use the same information is a never ending challenge.
To meet this challenges, businesses turn to master data management (MDM).
More Details on [Profisee MDM](https://profisee.com/master-data-management-what-why-how-who/)

## Why Profisee?
PROFISEE MDM SAAS: TRUE SAAS EXPERIENCE
Fully managed instance of Profisee MDM hosted in the Azure cloud. Full turn-key service for the easiest and fastest MDM deployment.

- Platform and Management in One
Leverage a true, end-to-end SaaS platform with one agreement and no third parties

- Industry-leading Cloud Service
Hosted on Azure for industry-leading scalability and availability

- The Fastest Path to Trusted Data
Leave the networking, firewalls and storage to us so you can deploy in minutes

PROFISEE MDM: ULTIMATE PAAS FLEXIBILITY
Complete deployment flexibility and control, using the most efficient and low-maintenance option — in any cloud-or on-prem.

Modern Cloud Architecture
Platform available as a containerized Kubernetes service

Complete Flexibility & Autonomy
Available in Azure, AWS, Google Cloud or on-premises

Fast to Deploy, Easy to Maintain
Fully containerized configuration streamlines patches and upgrades

More Details on [Profisee MDM Benefits On Modern Cloud Architecture]([https://profisee.com/master-data-management-what-why-how-who/](https://profisee.com/our-technology/modern-cloud-architecture/)) and [Profisee Advantage Videos](https://profisee.com/profisee-advantage/) and why it fits best with [Microsoft Azure](https://azure.microsoft.com/) cloud deployments!


## Business & Technical Use Case 

# Microsoft Purview - Profisee Integration SaaS Deployment on AKS Azure Kubernetes Infrastructure How-To Guide
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
