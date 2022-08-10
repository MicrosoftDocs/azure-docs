---
title: Deploy Microsoft Purview - Profisee integration for master data management (MDM)
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

Master data management (MDM) is a key pillar of any unified data governance solution. Microsoft Purview supports master data management with our partner [Profisee](https://profisee.com/profisee-advantage/). This tutorial compiles reference and integration deployment materials in one place; firstly to put Purview Unified Data Governance and MDM in the context of an Azure data estate, and get you started on your MDM journey with Microsoft Purview through our integration with Profisee.

## Why Data Governance and Master Data Management (MDM) are Essential to the Modern Data Estate ?

All organizations have multiple data sources, and the larger the organization the greater the number of data sources. Typically, there will be ERPs, CRMs, Legacy applications, regional versions of each of these, external data feeds and so on. Most of these businesses move massive amounts of data between applications, storage systems, analytics systems, and across departments within their organization. During these movements, and over time, data can get duplicated or become fragmented, and become stale or out of date. Hence, accuracy becomes a concern when using this data to drive insights into your business. 

Inevitably, data that was created in different ‘silos’ with different (or no) governance standards to meet the needs of their respective applications will always have issues.  When you look at the data drawn from each of these applications you will see that it is inconsistent in terms of both the standardization of data values and often in terms of the values themselves, and most often individual records are incomplete. In fact, it would be surprising if this were not the case – but it does present a problem, as what is really needed is data that is complete, and consistent, and accurate.  

To protect the quality of data within an organization, master data management (MDM) arose as a discipline that creates a source of truth for enterprise data so that an organization can check and validate their key assets. These key assets, or master data assets, are critical records that provide context for a business. For example, master data might include information on specific products, employees, customers, financial structures, suppliers, or locations. Master data management ensures data quality across an entire organization by maintaining an authoritative consolidated de-duplicated set of the master data records, and ensuring data remains consistent across your organization's complete data estate.

As an example, it can be difficult for a company to have a clear, single view of their customers. Customer data may differ between systems, there may be duplicated records due to incorrect entry, or shipping and customer service systems may vary due to name, address, or other attributes. Master data management consolidates and standardizes all this differing information about the customer. This standardization process may involve automatic or user-defined rules, validations and checks. It is the job of the MDM system to ensure your data remains consistent within the framework of these rules over time. Not only does this improve quality of data by eliminating mismatched data across departments, but it ensures that data analyzed for business intelligence (BI) and other applications is trustworthy and up to date, reduces data load by removing duplicate records across the organization, and streamlines communications between business systems.

The ability to consolidate data from multiple disparate systems is key if we want to use the data to drive business insights and operational efficiencies – or any form of ‘digital transformation’. What we need in that case is high quality, trusted data that is ready to use, whether it is being consumed in basic enterprise metrics or advanced AI algorithms. Bridging this gap is the job of Data Governance and MDM, and in the Azure world that means [Microsoft Purview](https://azure.microsoft.com/services/purview/) and [Profisee MDM]((https://profisee.com/platform). 

:::image type="content" alt-text="Bridging the gap between what we have versus what we need is the job of Microsoft Purview and Profisee MDM" source="./media/how-to-deploy-profisee-purview/purview-profisee-bridging-the-gap.png" lightbox="./media/how-to-deploy-profisee-purview/purview-profisee-bridging-the-gap.png":::

While governance systems can *define* data standards, MDM is where they are *enforced*.  Data from different systems can be matched and merged, validated against data quality and governance standards, and remediated where required.  Then the new corrected and validated ‘master’ data can be shared to downstream analytics systems as well as back into source systems to drive operational improvements. By properly creating and maintaining enterprise master data, we ensure that data is no longer a liability and cause for concern, but an asset of the business that enables improved operation and innovation.

More Details on [Profisee MDM](https://profisee.com/master-data-management-what-why-how-who/) and [Profisee-Purview MDM Concepts and Azure Architecture](/azure/architecture/reference-architectures/data/profisee-master-data-management-purview).

## Microsoft Purview & Profisee Integrated MDM - Better Together! 

### Profisee MDM: True SaaS experience

A fully managed instance of Profisee MDM hosted in the Azure cloud. Full turn-key service for the easiest and fastest MDM deployment.

- **Platform and Management in One** -  Apply a true, end-to-end SaaS platform with one agreement and no third parties.  
- **Industry-leading Cloud Service** - Hosted on Azure for industry-leading scalability and availability.  
- **The fastest path to trusted data** - Leave the networking, firewalls and storage to us so you can deploy in minutes.  

### Profisee MDM: Ultimate PaaS flexibility

Complete deployment flexibility and control, using the most efficient and low-maintenance option on the [Microsoft Azure](https://azure.microsoft.com/) cloud or on-premises.

- **Modern Cloud Architecture** - Platform available as a containerized Kubernetes service.  
- **Complete Flexibility & Autonomy** - Available in Azure, AWS, Google Cloud or on-prem.  
- **Fast to Deploy, Easy to Maintain** - Fully containerized configuration streamlines patches and upgrades.  

More Details on [Profisee MDM Benefits On Modern Cloud Architecture](https://profisee.com/our-technology/modern-cloud-architecture/), [Profisee Advantage Videos](https://profisee.com/profisee-advantage/) and why it fits best with [Microsoft Azure](https://azure.microsoft.com/) cloud deployments!

## Microsoft Purview - Profisee reference architecture

:::image type="content" alt-text="Diagram of Profisee-Purview Reference Architecture." source="./media/how-to-deploy-profisee-purview/profisee-purview-mdm-reference-architecture.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-purview-mdm-reference-architecture.png":::

### Reference architecture guides/reference documents

- [Data Governance with Profisee and Microsoft Purview](/azure/architecture/reference-architectures/data/profisee-master-data-management-purview)
- [Operationalize Profisee with ADF Azure Data Factory, Azure Synapse Analytics and Power BI](/azure/architecture/reference-architectures/data/profisee-master-data-management-data-factory)
- [MDM on Azure Overview](/azure/cloud-adoption-framework/scenarios/cloud-scale-analytics/govern-master-data)

### Example scenario: Business & technical use case

Let's take an example of a sample manufacturing company working across multiple data sources; it uses ADF to load the business critical data sources into Profisee, which is when Profisee works its magic and finds out the golden records and matching records and then we finally are able to enrich the metadata with Microsoft Purview (updates made by Microsoft Purview on Classifications, Sensitivity Labels, Glossary and all other Catalog features are reflected seamlessly into Profisee). Finally, they connect the enriched metadata detected by Microsoft Purview and cleansed/curated data by Profisee with Power BI or Azure ML for advanced analytics.

## Microsoft Purview - Profisee integration SaaS deployment on Azure Kubernetes Service (AKS) guide

1. [Create a user-assigned managed identity in Azure](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity). You must have a managed identity created to run the deployment. This managed identity must have the following permissions when running a deployment. After the deployment is done, the managed identity can be deleted. Based on your ARM template choices, you'll need some or all of the following roles and permissions assigned to your managed identity:
    - Contributor role to the resource group where AKS will be deployed. It can either be assigned directly to the resource group **OR** at the subscription level and down.
    - DNS Zone Contributor role to the particular DNS zone where the entry will be created **OR** Contributor role to the DNS Zone resource group. This DNS role is needed only if updating DNS hosted in Azure.
    - Application Administrator role in Azure Active Directory so the required permissions that are needed for the application registration can be assigned.
    - Managed Identity Contributor and User Access Administrator at the subscription level. Required in order for the ARM template managed identity to be able to create a Key Vault specific managed identity that will be used by Profisee to pull the values stored in the Key Vault.
    - Data Curator Role added for the Microsoft Purview account for the Microsoft Purview specific application registration.  

1. Go to [https://github.com/Profisee/kubernetes](https://github.com/Profisee/kubernetes) and select Microsoft Purview [**Azure ARM**](https://github.com/profisee/kubernetes/blob/master/Azure-ARM/README.md#deploy-profisee-platform-on-to-aks-using-arm-template).
    - The ARM template will deploy Profisee on a load balanced AKS (Azure Kubernetes Service) infrastructure using an ingress controller.
    - The readme includes troubleshooting steps.l
    - Read all the steps and troubleshooting wiki page carefully.  

1. Get the license file from Profisee by raising a support ticket on [https://support.profisee.com/](https://support.profisee.com/). Only pre-requisite for this step is your need to pre-determine the DNS resolved URL your Profisee setup on Azure. In other words, keep the DNS HOST NAME of the load balancer used in the deployment. It will be something like "[profisee_name].[region].cloudapp.azure.com".
For example, DNSHOSTNAME="purviewprofisee.southcentralus.cloudapp.azure.com". Supply this DNSHOSTNAME to Profisee support when you raise the support ticket and Profisee will revert with the license file. You'll need to supply this file during the next configuration steps below.  

1. Select "Deploy to Azure"

    [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fprofisee%2Fkubernetes%2Fmaster%2FAzure-ARM%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2Fprofisee%2Fkubernetes%2Fmaster%2FAzure-ARM%2FcreateUIDefinition.json)
    - The configurator wizard will ask for the inputs as described here - [Deploying the AKS Cluster using the ARM Template](https://support.profisee.com/wikis/2022_r1_support/deploying_the_AKS_cluster_with_the_arm_template)
    - Make sure to give the exact same RG (Resource Group) in the deployment as you gave permissions to the managed identity in Step1.  

1. Once deployment completes, select Microsoft Purview "Go to Resource Group" and open the Profisee AKS Cluster.

### Stages of a typical Microsoft Purview - Profisee deployment run

- Profisee ARM Deployment Wizard - Managed Identity for installation; its role assignments and permissions should look like the image below.

    :::image type="content" alt-text="Image 1 - Screenshot of Profisee Managed Identity Azure Role Assignments." source="./media/how-to-deploy-profisee-purview/profisee-managed-identity-azure-role-assignments.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-managed-identity-azure-role-assignments.png":::

- Profisee ARM Deployment Wizard - App Registration Configuration

    :::image type="content" alt-text="Image 2 - Screenshot of Profisee Azure ARM Wizard App Registration Configuration." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-app-reg-config.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-app-reg-config.png":::

- Profisee ARM Deployment Wizard - Profisee Configuration and supplying Admin account username

    :::image type="content" alt-text="Image 3 - Screenshot of Profisee Azure ARM Wizard Step1 Profisee." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-a-profisee.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-a-profisee.png":::

- Profisee ARM Deployment Wizard - Kubernetes Configuration - You may choose an older version of Kubernetes but leave the field BLANK to deploy the LATEST version.

    :::image type="content" alt-text="Image 4 - Screenshot of Profisee Azure ARM_Wizard Step2 Kubernetes." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-b-kubernetes.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-b-kubernetes.png":::

- Profisee ARM Deployment Wizard - SQL Server

    :::image type="content" alt-text="Image 5 - Screenshot of Profisee Azure ARM Wizard Step3 SQLServer." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-c-sqlserver.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-c-sqlserver.png":::

- Profisee ARM Deployment Wizard - Azure DNS 
Recommended: Keep it to "Yes, use default Azure DNS". Choosing Yes, the deployer automatically creates a Let's Encrypt certificate for HTTP/TLS. Of you choose "No" you'll need to supply various networking configuration parameters and your own HTTPS/TLS certificate.

    :::image type="content" alt-text="Image 6 - Screenshot of Profisee Azure ARM Wizard Step4 AzureDNS." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-d-azure-dns.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-d-azure-dns.png":::

- Profisee ARM Deployment Wizard - Azure Storage

    :::image type="content" alt-text="Image 7 - Screenshot of Profisee Azure ARM Wizard Step5 Storage." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-e-storage.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-e-storage.png":::

- Profisee ARM Deployment Wizard - Final Validation

    :::image type="content" alt-text="Image 8 - Screenshot of Profisee Azure ARM Wizard_Step6 Final_Template Validation." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-f-final-template-validation.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-f-final-template-validation.png":::

- Around 5-10 Minutes into the ARM deployment

    :::image type="content" alt-text="Image 9 - Screenshot of Profisee Azure ARM Wizard Deployment Progress Intermediate." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-deployment-progress-mid.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-deployment-progress-mid.png":::

- Final Stages of Deployment. You need to wait around 45-50 minutes for the deployment to complete installing Profisee. Completion of "InstallProfiseePlatform" stage also indicates deployment is complete!

    :::image type="content" alt-text="Image 10 - Screenshot of Profisee Azure ARM Wizard Deployment Complete." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-deployment-progress-final.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-deployment-progress-final.png":::

- Open the resource group once deployment completes.

    :::image type="content" alt-text="Image 11 - Screenshot of Profisee Azure ARM Wizard_Post Deploy_Click Open Resource Group." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-post-deploy-click-open-resource-group.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-post-deploy-click-open-resource-group.png":::

- Fetch the final deployment URL. The final WEBURL is what you need to paste on your browser address bar and start enjoying Profisee-Purview integration! This URL will be the same that you'd have supplied to Profisee support while obtaining the license file. Unless you chose to change the URL format, it will look something like - "https://[profisee_name].[region].cloudapp.azure.com/profisee/

    :::image type="content" alt-text="Image 12 - Screenshot of Profisee Azure ARM Wizard Select Outputs Get FinalDeployment URL." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-click-outputs-get-final-deployment-url.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-click-outputs-get-final-deployment-url.png":::
    
- Populate and hydrate data to the newly installed Profisee environment by installing FastApp. Go to your Profisee SaaS deployment URL and select **/Profisee/api/client**. It should look something like - "https://[profisee_name].[region].cloudapp.azure.com/profisee/api/client". Select the Downloads for "Profisee FastApp Studio" utility and the "Profisee Platform Tools". Install both these tools on your local client machine.

    :::image type="content" alt-text="Image 13 - Screenshot of Profisee Client Tools Download" source="./media/how-to-deploy-profisee-purview/profisee-download-fastapp-tools.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-download-fastapp-tools.png":::
    
- Log-In to FastApp Studio and perform the rest of the MDM Administration and configuration management for Profisee. Once you log-in with the administrator email address supplied during the setup; you should be able to see the administration menu on the left pane of the Profisee FastApp Studio. Navigate to these menus and perform the rest of your MDM journey using FastApp tool. Being able to see the administration menu as seen in the image below confirms successful installation of Profisee on Azure Platform.
- As a final validation step to ensure successful installation and for checking whether Profisee has been succesfully connected to your Microsoft Purview instance, go to **/Profisee/api/governance/health** It should look something like - "https://[profisee_name].[region].cloudapp.azure.com//Profisee/api/governance/health". The output response will indicate the words **"Status": "Healthy"** on all the Purview subsystems. 

```{
  "OverallStatus": "Healthy",
  "TotalCheckDuration": "0:1.13",
  "DependencyHealthChecks": {
    "purview_service_health_check": {
      "Status": "Healthy",
      "Duration": "00:00:01.1297181",
      "Description": "Successfully connected to Purview."
    },
    "governance_service_health_check": {
      "Status": "Healthy",
      "Duration": "00:00:00.0000917",
      "Description": "Purview cache loaded successfully. Total assets: 153; Instances: 1; Entities: 23; Attributes: 122; Relationships: 6; Hierarchies: 1"
    },
    "messaging_db_health_check": {
      "Status": "Healthy",
      "Duration": "00:00:00.0010970",
      "Description": null
    },
    "logging_db_health_check": {
      "Status": "Healthy",
      "Duration": "00:00:00.0019520",
      "Description": null
    }
  }
}

An output response that looks similar as the above confirms successful installation, completes all the deployment steps; and succesfully validates whether Profisee has been succesfully connected to your Microsoft Purview and the two systems are able to communicate properly.

## Next steps
Through this guide, we learned of the importance of MDM in driving and supporting Data Governance in the context of the Azure data estate, and how to set up and deploy a Microsoft Purview-Profisee integration.
For more usage details on Profisee MDM, register for scheduled trainings, live product demonstration and Q&A on [Profisee Academy Tutorials and Demos](https://profisee.com/demo/)!
