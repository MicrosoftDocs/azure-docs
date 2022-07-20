---
title: Deploy Microsoft Purview-Profisee integration for master data management (MDM)
description: This guide describes how to deploy the Microsoft Purview-Profisee better together integration as a master data management (MDM) solution for your data estate governance.
author: abandyop
ms.author: arindamba
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 07/15/2022
ms.custom: template-how-to
---

# Microsoft Purview - Profisee Integration
Master data management (MDM) is a key pillar of any unified data governance solution. Microsoft Purview now supports master data management with partners such as Profisee, CluedIn, Tamr, and Semarchy. This tutorial compiles reference and integration deployment materials in one place to get you started on your MDM journey with Microsoft Purview through our integration with Profisee.

## What, why and how of MDM - Master Data Management?
Many businesses today, especially global enterprises, have hundreds of separate applications and systems (like SAP, ERP and CRM) where data that crosses organizational departments or divisions can easily become fragmented, duplicated, and most commonly out of date. In such cases, answering even the most basic, but critical questions about any type of performance metric or KPI for a business accurately becomes difficult.

Master data management (MDM) arose out of the necessity for businesses to improve the consistency and quality of their key data assets, such as products, assets, customers, location data, and so on. MDM is a process that creates a uniform set of data on customers, products, suppliers and other business entities from different IT systems. One of the core disciplines in the overall data management process, MDM helps improve data quality by ensuring that identifiers and other key data elements about those entities are accurate and consistent enterprise-wide.

When done properly, MDM can also streamline data sharing between different business systems and facilitate computing in system architectures that contain a variety of platforms and applications. In addition, effective master data management helps make the data used in business intelligence (BI) and analytics applications more trustworthy. 

For instance, several companies don't have a clear single view of their customers. A common reason is that customer data differs from one system to another. For example, customer records might not be identical in order entry, shipping and customer service systems due to variations in names, addresses and other attributes. The same kind of issues can also apply to product data and other types of information.

Master data management programs provide that single view by consolidating data from multiple source systems into a standard format. In the case of customer data, MDM harmonizes it to create a unified set of master data for use in all applicable systems. That enables organizations to eliminate duplicate customer records with mismatched data, giving operational workers, business executives and data analysts a complete picture of individual customers without having to piece together different entries.

More Details on [Profisee MDM](https://profisee.com/master-data-management-what-why-how-who/) and [Profisee-Purview MDM Concepts and Azure Architecture](/azure/architecture/reference-architectures/data/profisee-master-data-management-purview)

## Why Profisee?
### PROFISEE MDM: TRUE SAAS EXPERIENCE 
A fully managed instance of Profisee MDM hosted in the Azure cloud. Full turn-key service for the easiest and fastest MDM deployment.

- Platform and Management in One -
Leverage a true, end-to-end SaaS platform with one agreement and no third parties

- Industry-leading Cloud Service -
Hosted on Azure for industry-leading scalability and availability

- The fastest path to trusted data -
Leave the networking, firewalls and storage to us so you can deploy in minutes

### PROFISEE MDM: ULTIMATE PAAS FLEXIBILITY 
Complete deployment flexibility and control, using the most efficient and low-maintenance option on [Microsoft Azure](https://azure.microsoft.com/) cloud-or on-prem.

- Modern Cloud Architecture -
Platform available as a containerized Kubernetes service

- Complete Flexibility & Autonomy -
Available in Azure, AWS, Google Cloud or on-prem.

- Fast to Deploy, Easy to Maintain -
Fully containerized configuration streamlines patches and upgrades

More Details on [Profisee MDM Benefits On Modern Cloud Architecture](https://profisee.com/our-technology/modern-cloud-architecture/), [Profisee Advantage Videos](https://profisee.com/profisee-advantage/) and why it fits best with [Microsoft Azure](https://azure.microsoft.com/) cloud deployments!

## Profisee <> Purview Reference Architecture
![Profisee <> Purview Reference Architecture](https://user-images.githubusercontent.com/13808986/179245348-95aaa798-caa1-46d7-b7d2-38ba4b83ce9a.png)

### Profisee <> Purview Reference Architecture - Guides/Reference Docs
1. [Data Governance with Profisee and Microsoft Purview](/azure/architecture/reference-architectures/data/profisee-master-data-management-purview)
1. [Operationalize Profisee with ADF Azure Data Factory, Azure Synapse Analytics and Power BI](/azure/architecture/reference-architectures/data/profisee-master-data-management-data-factory)
1. [MDM on Azure Overview](/azure/cloud-adoption-framework/scenarios/cloud-scale-analytics/govern-master-data)

### Business & Technical Use Case (Example)
Let's take an example of a sample manufacturing company working across multiple data sources; it uses ADF to load the business critical data sources into Profisee, which is when Profisee works its magic and finds out the golden records and matching records and then we finally are able to enrich the metadata with Purview (updates  made by Purview on Classifications, Sensitivity Labels, Glossary and all other Catalog features are reflected seamlessly into Profisee). Finally, they connect the enriched metadata detected by Purview and cleansed/curated data by Profisee with Power BI or Azure ML for advanced analytics.

## Microsoft Purview - Profisee Integration SaaS Deployment on AKS Azure Kubernetes Infrastructure How-To Guide

1. Create a managed identity in Azure. You must have a Managed Identity created to run the deployment. This Managed Identity must have the following permissions when running a deployment. After it's done, the Managed Identity can be deleted. Based on your ARM template choices, you'll need some or all of the following permissions assigned to your Managed Identity:
- Contributor role to the Resource Group where AKS will be deployed. It can either be assigned directly to the Resource Group OR at Subscription level down.
- DNS Zone Contributor role to the particular DNS zone where the entry will be created OR Contributor role to the DNS Zone Resource Group. This DNS role is needed only if updating DNS hosted in Azure.
- Application Administrator role in Azure Active Directory so the required permissions that are needed for the Application Registration can be assigned.
- Managed Identity Contributor and User Access Administrator at the Subscription level. Required in order for the ARM template Managed Identity to be able to create the Key Vault specific Managed Identity that will be used by Profisee to pull the values stored in the Key Vault.
- Data Curator Role added for the Purview account for the Purview specific Application Registration.
2. Assign roles and permissions as per the list below and final state should look like this (attach image)
3. Go to https://github.com/Profisee/kubernetes and click "Azure ARM". The readme includes troubleshooting steps as well. Read all the steps and troubleshooting wiki page very carefully.
4. Get the license file from Profisee by raising a support ticket on https://support.profisee.com/. Only pre-req for this step is your need to pre-determine the URL your Profisee setup on Azure. This is a load balanced AKS (Azure Kubernetes) deployment using an ingress controller. In other words, keep handy the DNS HOST NAME of the load balancer used in the deployment. It will be something like "[profisee_name].[region].cloudapp.azure.com". For instance, DNSHOSTNAME="purviewprofiseeintegration.southcentralus.cloudapp.azure.com". Supply this DNSHOSTNAME to Profisee support when you raise the support ticket and Profisee will revert with the license file. You'll need to supply this file during the next configuration steps below. 
5. Click "Deploy to Azure"
[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fprofisee%2Fkubernetes%2Fmaster%2FAzure-ARM%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2Fprofisee%2Fkubernetes%2Fmaster%2FAzure-ARM%2FcreateUIDefinition.json)
- The configurator wizard will ask for the inputs as described here - [Deploying the AKS Cluster using the ARM Template](https://support.profisee.com/wikis/2022_r1_support/deploying_the_AKS_cluster_with_the_arm_template)
- Make sure to give the exact same RG (Resource Group) in the deployment as you gave permissions to the managed identity in Step1.
- Once deployment completes, click "Go to Resource Group" and open the Profisee AKS Cluster.
- Profisee ARM Deployment Wizard - Managed Identity for installation; its role assignments and permissions should look like the image below.
:::image type="content" alt-text="Profisee Managed Identity Azure Role Assignments" source="/media/how-to-deploy-profisee-purview/profisee-managed-identity-azure-role-assignments.png" lightbox="/media/how-to-deploy-profisee-purview/profisee-managed-identity-azure-role-assignments.png":::
- Profisee ARM Deployment Wizard - App Registration Configuration
:::image type="content" alt-text="Profisee Azure ARM Wizard App Registration Configuration" source="/media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-app-reg-config.png" lightbox="/media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-app-reg-config.png":::
- Profisee ARM Deployment Wizard - Profisee Configuration and supplying Admin account username
:::image type="content" alt-text="Profisee Azure ARM Wizard Step1 Profisee" source="/media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-a-profisee.png" lightbox="/media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-a-profisee.png":::
- Profisee ARM Deployment Wizard - Kubernetes Configuration - You may choose an older version of Kubernetes but leave the field BLANK to deploy the LATEST version.
:::image type="content" alt-text="Profisee Azure ARM_Wizard Step2 Kubernetes" source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-b-kubernetes.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-b-kubernetes.png":::
- Profisee ARM Deployment Wizard - SQL Server
:::image type="content" alt-text="Profisee Azure ARM Wizard Step3 SQLServer" source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-c-sqlserver.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-c-sqlserver.png":::
- Profisee ARM Deployment Wizard - Azure DNS
:::image type="content" alt-text="Profisee Azure ARM Wizard Step4 AzureDNS" source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-d-azure-dns.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-d-azure-dns.png":::
- Profisee ARM Deployment Wizard - Azure Storage
:::image type="content" alt-text="Profisee Azure ARM Wizard Step5 Storage" source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-e-storage.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-e-storage.png":::
- Profisee ARM Deployment Wizard - Final Validation 
:::image type="content" alt-text="Profisee Azure ARM Wizard_Step6 Final_Template Validation" source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-f-final-template-validation.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-f-final-template-validation.png":::
- Around 5-10 Minutes into the ARM deployment
:::image type="content" alt-text="Profisee Azure ARM Wizard Deployment Progress Intermediate" source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-deployment-progress-mid.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-deployment-progress-mid.png":::
- Final Stages of Deployment. You need to wait around 45-50 minutes for the deployment to complete installing Profisee. Completion of "InstallProfiseePlatform" stage also indicates deployment is complete!
:::image type="content" alt-text="Profisee Azure ARM Wizard Deployment Complete" source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-deployment-progress-final.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-deployment-progress-final.png":::
- Open the resource group once deployment completes.
:::image type="content" alt-text="Profisee Azure ARM Wizard_Post Deploy_Click Open Resource Group" source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-post-deploy-click-open-resource-group.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-post-deploy-click-open-resource-group.png":::
- Fetch the final deployment URL
:::image type="content" alt-text="Profisee Azure ARM Wizard Click Outputs Get FinalDeployment URL" source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-click-outputs-get-final-deployment-url.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-click-outputs-get-final-deployment-url.png":::
- Populate and hydrate data to the newly installed profisee environment by installing FastApp. Go to your Profisee SaaS deployment URL and select **/Profisee/api/client**. It should look something like - "https://[profisee_name].[region].cloudapp.azure.com/profisee/api/client".

## Next Steps
Through this guide, we learned how to set up and deploy a Microsoft Purview-Profisee integration.
For more usage details on Profisee and Profisee FastApp, especially how to configure data models, data quality, MDM and various other features of Profisee - Register on [Profisee Academy Tutorials and Demos](https://profisee.com/demo/) for further detailed tutorials on the Profisee side of MDM!
