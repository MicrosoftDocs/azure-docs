---
title: Deploy Purview-Profisee Integration for MDM Master Data Management 
description: This guide describes how to deploy Profisee-Purview better together integration as a managed MDM Master Data Managemnent solution for your data estate governance.
author: abandyop
ms.author: arindamba
ms.service: purview
ms.subservice: purview-catalog
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
PROFISEE MDM SAAS: TRUE SAAS EXPERIENCE -
Fully managed instance of Profisee MDM hosted in the Azure cloud. Full turn-key service for the easiest and fastest MDM deployment.

- Platform and Management in One -
Leverage a true, end-to-end SaaS platform with one agreement and no third parties

- Industry-leading Cloud Service -
Hosted on Azure for industry-leading scalability and availability

- The Fastest Path to Trusted Data -
Leave the networking, firewalls and storage to us so you can deploy in minutes

PROFISEE MDM: ULTIMATE PAAS FLEXIBILITY -
Complete deployment flexibility and control, using the most efficient and low-maintenance option — in any cloud-or on-prem.

Modern Cloud Architecture -
Platform available as a containerized Kubernetes service

Complete Flexibility & Autonomy -
Available in Azure, AWS, Google Cloud or on-premises

Fast to Deploy, Easy to Maintain -
Fully containerized configuration streamlines patches and upgrades

More Details on [Profisee MDM Benefits On Modern Cloud Architecture](https://profisee.com/our-technology/modern-cloud-architecture/) and [Profisee Advantage Videos](https://profisee.com/profisee-advantage/) and why it fits best with [Microsoft Azure](https://azure.microsoft.com/) cloud deployments!

### Azure Architecture Guides/Reference Docs
1. [Data Governance with Profisee and Microsoft Purview](https://docs.microsoft.com/azure/architecture/reference-architectures/data/profisee-master-data-management-purview)
1. [Operationalize Profisee with ADF Azure Data Factory, Azure Synapse Analytics and PowerBI](https://docs.microsoft.com/azure/architecture/reference-architectures/data/profisee-master-data-management-data-factory)
1. [MDM on Azure Overview](https://docs.microsoft.com/azure/cloud-adoption-framework/scenarios/cloud-scale-analytics/govern-master-data)

## Profisee <> Purview Reference Architecture
![Profisee <> Purview Reference Architecture](https://user-images.githubusercontent.com/13808986/179245348-95aaa798-caa1-46d7-b7d2-38ba4b83ce9a.png)

### Business & Technical Use Case (Example)
Let's take an example of a sample manufacturing company working across multiple data sources; it uses ADF to load the business critical data sources into Profisee, which is when Profisee works its magic and finds out the golden records and matching records and then we finally are able to enrich the metadata with Purview (updates  made by Purview on Classifications, Sensitivity Labels, Glossary and all other Catalog features are reflected seamlessly into Profisee). Finally, they connect the enriched metadata detected by Purview and cleansed/curated data by Profisee with PowerBI or Azure ML for advanced analytics.

## Microsoft Purview - Profisee Integration SaaS Deployment on AKS Azure Kubernetes Infrastructure How-To Guide

1. Create a managed identity in Azure. You must have a Managed Identity created to run the deployment. This Managed Identity must have the following permissions when running a deployment. After it is done, the Managed Identity can be deleted. Based on your ARM template choices, you will need some or all of the following permissions assigned to your Managed Identity:
- Contributor role to the Resource Group where AKS will be deployed. This can either be assigned directly to the Resource Group OR at Subscription level down.
- DNS Zone Contributor role to the particular DNS zone where the entry will be created OR Contributor role to the DNS Zone Resource Group. This is needed only if updating DNS hosted in Azure.
- Application Administrator role in Azure Active Directory so the required permissions that are needed for the Application Registration can be assigned.
- Managed Identity Contributor and User Access Administrator at the Subscription level. These two are needed in order for the ARM template Managed Identity to be able to create the Key Vault specific Managed Identity that will be used by Profisee to pull the values stored in the Key Vault.
- Data Curator Role added for the Purview account for the Purview specific Application Registration.
1. Assign roles and permissions as per the list below and final state should look like this (attach image)
1. Go to https://github.com/Profisee/kubernetes and click "Azure ARM". The readme includes troubleshooting steps as well. Read all the steps and troubleshooting wiki page very carefully.
- Get the license file from Profisee by raising a support ticket on https://support.profisee.com/. Only pre-req for this step is you need to pre-determine the URL your profisee setup on Azure. NOte that this is a load balanced AKS (Azure Kubernetes) deployment using an ingress controller. In other words, keep handy the DNS HOST NAME of the load balancer used in the deployment. It will be something like "[profisee_name].[region].cloudapp.azure.com" . Example : DNSHOSTNAME="purviewprofiseeintegration.southcentralus.cloudapp.azure.com". Supply this DNSHOSTNAME to profisee support when you raise the support ticket and Profisee will revert with the license file. You will need to supply this file during the next configuration steps below. 
- Click "Deploy to Azure"
[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fprofisee%2Fkubernetes%2Fmaster%2FAzure-ARM%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2Fprofisee%2Fkubernetes%2Fmaster%2FAzure-ARM%2FcreateUIDefinition.json)
- The configurator wizard will ask for the inputs as described here - [Deploying the AKS Cluster using the ARM Template](https://support.profisee.com/wikis/2022_r1_support/deploying_the_AKS_cluster_with_the_arm_template)
- Make sure to give the exact same RG (Resource Group) in the deployment as you gave permissions to the managed identity in Step1.
- Once deployment completes, click "Go to Resource Group" and open the Profisee AKS Cluster.
-
![Deployment Progress Intermediate](./media/how-to-deploy-profisee-purview/DeploymentProgressA.png)
-
![Deployment Progress Final](./media/how-to-deploy-profisee-purview/DeploymentProgressFinal.png)
-
![Profisee Managed Identity Azure Role Assignments](./media/how-to-deploy-profisee-purview/Profisee_Managed_Identity_AzureRoleAssignments.png)
-
![Profisee Azure ARM Wizard App Registration Configuration](./media/how-to-deploy-profisee-purview/ProfiseeAzureARM_Wizard_AppReg_Config.png)
-
![Profisee Azure ARM Wizard Step1 Profisee](./media/how-to-deploy-profisee-purview/ProfiseeAzureARM_Wizard_Step1_Profisee.png)
-
![Profisee Azure ARM_Wizard Step2 Kubernetes](./media/how-to-deploy-profisee-purview/ProfiseeAzureARM_Wizard_Step2_Kubernetes.png)
-
![Profisee Azure ARM Wizard Step3 SQLServer](./media/how-to-deploy-profisee-purview/ProfiseeAzureARM_Wizard_Step3_SQLServer.png)
-
![Profisee Azure ARM Wizard Step4 AzureDNS](./media/how-to-deploy-profisee-purview/ProfiseeAzureARM_Wizard_Step4_AzureDNS.png)
-
![Profisee Azure ARM Wizard Step4 Storage](./media/how-to-deploy-profisee-purview/ProfiseeAzureARM_Wizard_Step4_Storage.png)
-
![Profisee Azure ARM Wizard_Step5 Final_Template Validation](./media/how-to-deploy-profisee-purview/ProfiseeAzureARM_Wizard_Step5_Final_Template_Validation.png)
-
![Profisee Azure ARM Wizard_Step5 Final Template Validation New](./media/how-to-deploy-profisee-purview/ProfiseeAzureARM_Wizard_Step5_Final_Template_Validation_New.png)
-
![Profisee Azure ARM Wizard Click Outputs Get FinalDeployment URL](./media/how-to-deploy-profisee-purview/ProfiseeAzureARM_Wizard_ClickOutputs_GetFinalDeploymentURL.png)
-
![Profisee Azure ARM Wizard Deployment Complete](./media/how-to-deploy-profisee-purview/ProfiseeAzureARM_Wizard_Deployment_Complete.png)
-
![Profisee Azure ARM Wizard_Post Deploy_Click Open Resource Group](./media/how-to-deploy-profisee-purview/ProfiseeAzureARM_Wizard_Post_Deploy_ClickOpen_Resource_Group.png)
-
- Populate and hydrate data to the newly installed profisee environment by installing FastApp. Go to your Profisee SaaS deployment URL and hit "/Profisee/api/client". It should look something like - "https://[profisee_name].[region].cloudapp.azure.com/profisee/api/client".

## Next Steps
Through this guide we learnt how to set up and deploy Profisee <> Purview Integration on a very detailed level.
For more usage details on Profisee especially how to configure data models, data quality, MDM and various other features of Profisee - Register on https://profisee.com/demo/ for further detailed tutorials!
