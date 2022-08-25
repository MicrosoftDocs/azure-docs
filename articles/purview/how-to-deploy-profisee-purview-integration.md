---
title: Deploy Microsoft Purview - Profisee integration for master data management (MDM)
description: This guide describes how to deploy the Microsoft Purview-Profisee better together integration as a master data management (MDM) solution for your data estate governance.
author: abandyop
ms.author: arindamba
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/18/2022
ms.custom: template-how-to
---

# Microsoft Purview - Profisee MDM Integration

Master data management (MDM) is a key pillar of any unified data governance solution. Microsoft Purview supports master data management with our partner [Profisee](https://profisee.com/solutions/microsoft-enterprise/azure/). This tutorial compiles reference and integration deployment materials in one place; firstly to put Microsoft Purview Unified Data Governance and MDM in the context of an Azure data estate; and more importantly, to get you started on your MDM journey with Microsoft Purview through our integration with Profisee.

## Why Data Governance and Master Data Management (MDM) are essential to the modern Data Estate?

All organizations have multiple data sources, and the larger the organization the greater the number of data sources. Typically, there will be ERPs, CRMs, Legacy applications, regional versions of each of these, external data feeds and so on. Most of these businesses move massive amounts of data between applications, storage systems, analytics systems, and across departments within their organization. During these movements, and over time, data can get duplicated or become fragmented, and become stale or out of date. Hence, accuracy becomes a concern when using this data to drive insights into your business. 

Inevitably, data that was created in different ‘silos’ with different (or no) governance standards to meet the needs of their respective applications will always have issues.  When you look at the data drawn from each of these applications, you'll see that it's inconsistent in terms of both the standardization of data. Often, there are numerous inconsistencies in terms of the values themselves, and most often individual records are incomplete. In fact, it would be surprising if these inconsistencies weren't the case – but it does present a problem. What is needed is data that is complete, and consistent, and accurate.  

To protect the quality of data within an organization, master data management (MDM) arose as a discipline that creates a source of truth for enterprise data so that an organization can check and validate their key assets. These key assets, or master data assets, are critical records that provide context for a business. For example, master data might include information on specific products, employees, customers, financial structures, suppliers, or locations. Master data management ensures data quality across an entire organization by maintaining an authoritative consolidated de-duplicated set of the master data records, and ensuring data remains consistent across your organization's complete data estate.

As an example, it can be difficult for a company to have a clear, single view of their customers. Customer data may differ between systems, there may be duplicated records due to incorrect entry, or shipping and customer service systems may vary due to name, address, or other attributes. Master data management consolidates and standardizes all this differing information about the customer. This standardization process may involve automatic or user-defined rules, validations and checks. It's the job of the MDM system to ensure your data remains consistent within the framework of these rules over time. Not only does this improve quality of data by eliminating mismatched data across departments, but it ensures that data analyzed for business intelligence (BI) and other applications is trustworthy and up to date, reduces data load by removing duplicate records across the organization, and streamlines communications between business systems.

The ability to consolidate data from multiple disparate systems is key if we want to use the data to drive business insights and operational efficiencies – or any form of ‘digital transformation’. What we need in that case is high quality, trusted data that is ready to use, whether it's being consumed in basic enterprise metrics or advanced AI algorithms. Bridging this gap is the job of Data Governance and MDM, and in the Azure world that means [Microsoft Purview](https://azure.microsoft.com/services/purview/) and [Profisee MDM](https://profisee.com/platform). 

:::image type="content" alt-text="Diagram illustrating bridging the gap between what we have versus what we need as the job of Microsoft Purview and Profisee MDM." source="./media/how-to-deploy-profisee-purview/purview-profisee-bridging-the-gap.png" lightbox="./media/how-to-deploy-profisee-purview/purview-profisee-bridging-the-gap.png":::

While governance systems can *define* data standards, MDM is where they're *enforced*.  Data from different systems can be matched and merged, validated against data quality and governance standards, and remediated where required.  Then the new corrected and validated ‘master’ data can be shared to downstream analytics systems and then back into source systems to drive operational improvements. By properly creating and maintaining enterprise master data, we ensure that data is no longer a liability and cause for concern, but an asset of the business that enables improved operation and innovation.

More Details on [Profisee MDM](https://profisee.com/master-data-management-what-why-how-who/) and [Profisee-Purview MDM Concepts and Azure Architecture](/azure/architecture/reference-architectures/data/profisee-master-data-management-purview).

## Microsoft Purview & Profisee MDM - Better Together! 

Microsoft Purview and Profisee MDM are often discussed as being a ‘Better Together’ value proposition due to the complementary nature of the solutions. Microsoft Purview excels at cataloging data sources and defining data standards, while Profisee MDM enforces those standards across master data drawn from multiple siloed sources. It's clear not only that either system has independent value to offer, but also that each reinforces the other for a natural ‘Better Together’ synergy that goes deeper than the independent offerings.
  - Common technical foundation – Profisee was born out of Microsoft technologies using common tools, databases & infrastructure so any ‘Microsoft shop’ will find the Profisee solution familiar.  In fact, for many years Profisee MDM was built on Microsoft Master Data Services (MDS) and now that MDS is nearing end of life, Profisee is the premier upgrade/replacement solution for MDS. 
  - Developer collaboration and joint development – Profisee and Microsoft Purview developers have collaborated extensively to ensure a good complementary fit between their respective solutions to deliver a seamless integration that meets the needs of their customers. 
  - Joint sales and deployments – Profisee has more MDM deployments on Azure, and jointly with Microsoft Purview, than any other MDM vendor, and can be purchased through Azure Marketplace.  In FY2023 Profisee is the only MDM vendor with a Top Tier Microsoft partner certification available as an IaaS/CaaS or SaaS offering through Azure Marketplace.
  - Rapid and reliable deployment – Rapid and reliable deployment is critical for any enterprise software and Gartner points out that Profisee has more implementations taking under 90 days than any other MDM vendor.
  - Inherently multi-domain – Profisee offers a multi-domain approach to MDM where there are no limitations to the number of specificity of master data domains.  This design aligns well with customers looking to modernize their data estate who may start with a limited number of domains, but ultimately will benefit from maximizing domain coverage (matched to their data governance coverage) across their whole data estate.  
  - Engineered for Azure – Profisee has been engineered to be cloud-native with options for both SaaS and managed IaaS/CaaS deployments on Azure (see next section) 

    >[!TIP] 
    > **Leverage Profisee’s [MDS Migration Utility](https://profisee.com/solutions/microsoft-enterprise/master-data-services/) to upgrade from Microsoft MDS (Master Data Services) in a single click**

## Profisee MDM: Deployment Flexibility – Turnkey SaaS Experience or IaaS/CaaS Flexibility
Profisee MDM has been engineered for a cloud-native experience and may be deployed on Azure in two ways – SaaS and Azure IaaS/CaaS/Kubernetes Cluster.

### Turnkey SaaS Experience
A fully managed instance of Profisee MDM hosted by Profisee in the Azure cloud. Full turn-key service for the easiest and fastest MDM deployment.  Profisee MDM SaaS can be purchased on [Azure Marketplace Profisee MDM - SaaS](https://portal.azure.com/#view/Microsoft_Azure_Marketplace/GalleryItemDetailsBladeNopdl/id/profisee.profisee_saas_private/product~/).
- **Platform and Management in one** – Use a true, end-to-end SaaS platform with one agreement and no third parties.
- **Industry-leading Cloud service** – Hosted on Azure for industry-leading scalability and availability.
- **The fastest path to Trusted Data** – Deploy in minutes with minimal technical knowledge. Leave the networking, firewalls and storage to us so you can deploy in minutes.

### Ultimate IaaS/CaaS Flexibility
Complete deployment flexibility and control, using the most efficient and low-maintenance option on the [Microsoft Azure](https://azure.microsoft.com/) Kubernetes Service, functioning as a customer hosted fully managed IaaS/CaaS (container-as-a-service) deployment. The section below on "Microsoft Purview - Profisee integration deployment on Azure Kubernetes Service (AKS)" describes this deployment route in detail.
- **Modern Cloud Architecture** - Platform available as a containerized Kubernetes service.  
- **Complete Flexibility & Autonomy** - Available in Azure, AWS, Google Cloud or on-premises.  
- **Fast to Deploy, Easy to Maintain** - 100% containerized configuration streamlines patches and upgrades.  

More Details on [Profisee MDM Benefits On Modern Cloud Architecture](https://profisee.com/our-technology/modern-cloud-architecture/), [Profisee MDM on Azure](https://profisee.com/solutions/microsoft-enterprise/azure/), and why it fits best with [Microsoft Azure](https://azure.microsoft.com/) deployments!

## Microsoft Purview - Profisee Reference Architecture

The reference architecture shows how both Microsoft Purview and Profisee MDM work together to provide a foundation of high-quality, trusted data for the Azure data estate.  It's also available as a short video walk-through.

**Video: [Profisee Reference Architecture: MDM and Governance for Azure](https://profisee.wistia.com/medias/k72zte2wbr)**

:::image type="content" alt-text="Diagram of Profisee-Purview Reference Architecture." source="./media/how-to-deploy-profisee-purview/profisee-purview-mdm-reference-architecture.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-purview-mdm-reference-architecture.png":::

1.	Scan & classify metadata from LOB systems – uses pre-built Microsoft Purview connectors to scan data sources and populate the Microsoft Purview Data Catalog
2.	Publish master data model to Microsoft Purview – any master data entities created in Profisee MDM are seamlessly published into Microsoft Purview to further populate the Microsoft Purview Data Catalog and ensure Microsoft Purview is ‘aware’ of this critical source of data 
3.	Enrich master data model with governance details – Governance Data Stewards can enrich master data entity definitions with data dictionary and glossary information as well as ownership and sensitive data classifications, etc. in Microsoft Purview
4.	Apply enriched governance data for data stewardship – any definitions and metadata available in Microsoft Purview are visible in real-time in Profisee as guidance for the MDM Data Stewards
5.	Load source data from business applications – Azure Data Factory extracts data from source systems with 100+ pre-built connectors and/or REST gateway
6.	Transactional and unstructured data is loaded to downstream analytics solution – All ‘raw’ source data can be loaded to analytics database such as Synapse (Synapse is generally the preferred analytic database but others such as Snowflake are also common).  Analysis on this raw information without proper master (‘golden’) data will be subject to inaccuracy as data overlaps, mismatches and conflicts won't yet have been resolved. 
7.	Master data from source systems is loaded to Profisee MDM application – Multiple streams of ‘master’ data is loaded to Profisee MDM.  Master data is the data that defines a domain entity such as customer, product, asset, location, vendor, patient, household, menu item, ingredient, and so on.  This data is typically present in multiple systems and resolving differing definitions and matching and merging this data across systems is critical to the ability to use any cross-system data in a meaningful way. 
8.	Master data is standardized, matched, merged, enriched and validated according to governance rules – Although data quality and governance rules may be defined in other systems (such as Microsoft Purview), Profisee MDM is where they're enforced.  Source records are matched and merged both within and across source systems to create the most complete and correct record possible.  Data quality rules check each record for compliance with business and technical requirements.   
9.	Extra data stewardship to review and confirm matches, data quality, and data validation issues, as required – Any record failing validation or matching with only a low probability score is subject to remediation. To remediate failed validations, a workflow process assigns records requiring review to Data Stewards who are experts in their business data domain.  Once records have been verified or corrected, they're ready to use as a ‘golden record’ master.  
10.	Direct access to curated master data including secure data access for reporting in Power BI – Power BI users may report directly on master data through a dedicated Power BI Connector that recognizes and enforces role-based security and hides various system fields for simplicity.
11.	High-quality, curated master data published to downstream analytics solution – Verified master data can be published out to any target system using Azure Data Factory.  Master data including the parent-child lineage of merged records published into Azure Synapse (or wherever the ‘raw’ source transactional data was loaded).  With this combination of properly curated master data plus transactional data, we have a solid foundation of trusted data for further analysis.         
12.	Visualization and analytics with high-quality master data eliminates common data quality issues and delivers improved insights – Irrespective of the tools used for analysis, including machine learning, and visualization, well-curated master data forms a better and more reliable data foundation.  The alternative is to use whatever information you can get – and risk misleading results that can damage the business.   

### Reference architecture guides/reference documents

- [Data Governance with Profisee and Microsoft Purview](/azure/architecture/reference-architectures/data/profisee-master-data-management-purview)
- [Operationalize Profisee with ADF Azure Data Factory, Azure Synapse Analytics and Power BI](/azure/architecture/reference-architectures/data/profisee-master-data-management-data-factory)
- [MDM on Azure Overview](/azure/cloud-adoption-framework/scenarios/cloud-scale-analytics/govern-master-data)

## Microsoft Purview - Profisee integration deployment on Azure Kubernetes Service (AKS)

1. Get the license file from Profisee by raising a support ticket on [https://support.profisee.com/](https://support.profisee.com/). The only pre-requisite for this step is your need to pre-determine the DNS resolved URL your Profisee setup on Azure. In other words, keep the DNS HOST NAME of the load balancer used in the deployment. It will be something like "[profisee_name].[region].cloudapp.azure.com".
For example, DNSHOSTNAME="purviewprofisee.southcentralus.cloudapp.azure.com". Supply this DNSHOSTNAME to Profisee support when you raise the support ticket and Profisee will revert with the license file. You'll need to supply this file during the next configuration steps below.

1. [Create a user-assigned managed identity in Azure](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md#create-a-user-assigned-managed-identity). You must have a managed identity created to run the deployment. After the deployment is done, the managed identity can be deleted. Based on your ARM template choices, you'll need some or all of the following roles and permissions assigned to your managed identity:
    - Contributor role to the resource group where AKS will be deployed. It can either be assigned directly to the resource group **OR** at the subscription level and down.
    - DNS Zone Contributor role to the particular DNS zone where the entry will be created **OR** Contributor role to the DNS Zone resource group. This DNS role is needed only if updating DNS hosted in Azure.
    - Application Administrator role in Azure Active Directory so the required permissions that are needed for the application registration can be assigned.
    - Managed Identity Contributor and User Access Administrator at the subscription level. Required in order for the ARM template managed identity to be able to create a Key Vault specific managed identity that will be used by Profisee to pull the values stored in the Key Vault.

    :::image type="content" alt-text="Screenshot of Profisee Managed Identity Azure Role Assignments." source="./media/how-to-deploy-profisee-purview/profisee-managed-identity-azure-role-assignments.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-managed-identity-azure-role-assignments.png":::

1. [Create an application registration](/azure/active-directory/develop/howto-create-service-principal-portal#register-an-application-with-azure-ad-and-create-a-service-principal) that will act as the login identity once Profisee is installed. It needs to be a part of the Azure Active Directory that will be used to sign in to Profisee. Save the **Application (client) ID** for use later.
    - Set authentication to match the settings below:
        - Support ID tokens (used for implicit and hybrid flows)
        - Set the redirect URL to: https://\<your-deployment-url>/profisee/auth/signin-microsoft
            - Your deployment URL is the URL you'll have provided Profisee in step 1

1. [Create a service principal](/azure/active-directory/develop/howto-create-service-principal-portal#register-an-application-with-azure-ad-and-create-a-service-principal) that Microsoft Purview will use to take some actions on itself during this Profisee deployment. To create a service principal, create an application like you did in the previous step, then [create an application secret](/azure/active-directory/develop/howto-create-service-principal-portal#option-2-create-a-new-application-secret). Save the **Object ID** for the application, and the **Value** of the secret you created for later use.
    - Give this service principal (using the name or Object ID to locate it) **Data Curator** permissions on the root collection of your Microsoft Purview account.

1. Go to [https://github.com/Profisee/kubernetes](https://github.com/Profisee/kubernetes) and select Microsoft Purview [**Azure ARM**](https://github.com/profisee/kubernetes/blob/master/Azure-ARM/README.md#deploy-profisee-platform-on-to-aks-using-arm-template).
    - The ARM template will deploy Profisee on a load balanced AKS (Azure Kubernetes Service) infrastructure using an ingress controller.
    - The readme includes troubleshooting steps.
    - Read all the steps and troubleshooting wiki page carefully.  

1. Select "Deploy to Azure"

    [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fprofisee%2Fkubernetes%2Fmaster%2FAzure-ARM%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2Fprofisee%2Fkubernetes%2Fmaster%2FAzure-ARM%2FcreateUIDefinition.json)
    - The configurator wizard will ask for the inputs as described here - [Deploying the AKS Cluster using the ARM Template](https://support.profisee.com/wikis/2022_r1_support/deploying_the_AKS_cluster_with_the_arm_template)
    - Make sure to give the exact same RG (Resource Group) in the deployment as you gave permissions to the managed identity in Step1.  

1. Once deployment completes, select Microsoft Purview "Go to Resource Group" and open the Profisee AKS Cluster.

### Stages of a typical Microsoft Purview - Profisee deployment run

1. On the basics page, select the [user-assigned managed identity you created earlier](#microsoft-purview---profisee-integration-deployment-on-azure-kubernetes-service-aks) to deploy the resources.

1. For your Profisee configuration, you can have your information stored in Key Vault or supply the details during deployment. 
    1. Choose your Profisee version, and provide your admin user account and license. 
    1. Select to configure using Microsoft Purview.
    1. For the Application Registration Client ID, provide the [**application (client) ID**](/azure/active-directory/develop/howto-create-service-principal-portal#get-tenant-and-app-id-values-for-signing-in) for the [application registration you created earlier](#microsoft-purview---profisee-integration-deployment-on-azure-kubernetes-service-aks).
    1. Select your Microsoft Purview account.
    1. Add the **object ID** for the [service principal you created earlier](#microsoft-purview---profisee-integration-deployment-on-azure-kubernetes-service-aks).
    1. Add the value for the secret you created for that service principal.
    1. Give your web application a name.

    :::image type="content" alt-text="Screenshot of the Profisee page of the Azure ARM Wizard, with all values filled out." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-a-profisee.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-a-profisee.png":::

1. On the Kubernetes page, you may choose an older version of Kubernetes if needed, but leave the field **blank** to deploy the **latest** version.

    :::image type="content" alt-text="Screenshot of the Kubernetes configuration page in the ARM deployment wizard, configured with the smallest standard size and default network settings." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-b-kubernetes.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-b-kubernetes.png":::

    >[!TIP]
    > In most cases, leaving the version field blank is sufficient, unless there is a reason you need to deploy using an older version of Kubernetes AKS specifically.

1. On the SQL configuration page you can choose to deploy a new Azure SQL server, or use an existing Azure SQL Server. You'll provide login details and a database name to use for this deployment.

    :::image type="content" alt-text="Screenshot of SQL configuration page in the ARM deployment wizard, with Yes, create a new SQL Server selected and details provided." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-c-sqlserver.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-c-sqlserver.png":::

1. On the storage configuration page, you can choose to create a new storage account or use an existing one. You'll need to provide an access key and the name of an existing file share if you choose an existing account.

    :::image type="content" alt-text="Screenshot of ARM deployment wizard storage account page, with details provided." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-e-storage.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-e-storage.png":::

1. On the networking configuration page, you'll choose to either use the default Azure DNS or provide your own DNS host name.

    >[!TIP] 
    > **Yes, use default Azure DNS** is the recommended configuration. Choosing Yes, the deployer automatically creates a Let's Encrypt certificate for HTTP/TLS. If you choose **No** you'll need to supply various networking configuration parameters and your own HTTPS/TLS certificate.

    :::image type="content" alt-text="Screenshot of the ARM deployment Networking page, with Yes use default Azure DNS selected." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-d-azure-dns.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-d-azure-dns.png":::

    >[!WARNING]
    > The default Azure DNS URL (for example URL="https://purviewprofisee.southcentralus.cloudapp.azure.com/profisee") will be picked up by thr ARM template deployment wizard from the license file supplied to you by Profisee. If you intend to make changes and not use the default Azure DNS, make sure to communicate the full DNS and the fully qualified URL of the Profisee DNS to the Profisee support team so that they can re-generate and provide you the updated license file. Failure to do this will result in a malfunctioning installation of Profisee.

1. On the review + create page, review your details to ensure they're correct while the wizard validates your configuration. Once validation passes, select **Create**.

    :::image type="content" alt-text="Screenshot of the review plus create page of the ARM deployment wizard, showing all details with a validation passed flag at the top of the page." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-f-final-template-validation.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-step-f-final-template-validation.png":::

1. It will take around 45-50 Minutes for deployment to complete installing Profisee. During the deployment, you'll see the aspects that are in progress, and can refresh the page to review progress. The deployment will show as complete when all is finished. Completion of "InstallProfiseePlatform" stage also indicates deployment is complete!

    :::image type="content" alt-text="Screenshot of Profisee Azure ARM Wizard Deployment Progress, showing intermediate progress." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-deployment-progress-mid.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-deployment-progress-mid.png":::

    :::image type="content" alt-text="Screenshot of Profisee Azure ARM Wizard Deployment Progress, showing completed progress." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-deployment-progress-final.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-deployment-progress-final.png":::

1. Once deployment is completed, open the resource group where you deployed your integration.

    :::image type="content" alt-text="Screenshot of the resource group where the Profisee resources were deployed, with the deployment script highlighted." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-post-deploy-click-open-resource-group.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-post-deploy-click-open-resource-group.png":::

1. Under outputs, fetch the final deployment URL. The final WEBURL is what you need to paste on your browser address bar and start enjoying Profisee-Purview integration! This URL will be the same that you'd have supplied to Profisee support while obtaining the license file. Unless you chose to change the URL format, it will look something like - "https://[profisee_name].[region].cloudapp.azure.com/profisee/

    :::image type="content" alt-text="Screenshot of the outputs of the deployment script, showing the deployment WEB URL highlighted in the output." source="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-click-outputs-get-final-deployment-url.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-azure-arm-wizard-click-outputs-get-final-deployment-url.png":::
    
1. Populate and hydrate data to the newly installed Profisee environment by installing FastApp. Go to your Profisee deployment URL and select **/Profisee/api/client**. It should look something like - "https://[profisee_name].[region].cloudapp.azure.com/profisee/api/client". Select the Downloads for "Profisee FastApp Studio" utility and the "Profisee Platform Tools". Install both these tools on your local client machine.

    :::image type="content" alt-text="Screenshot of the Profisee Client Tools download, with the download links highlighted." source="./media/how-to-deploy-profisee-purview/profisee-download-fastapp-tools.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-download-fastapp-tools.png":::
    
1. Log in to FastApp Studio and perform the rest of the MDM Administration and configuration management for Profisee. Once you log in with the administrator email address supplied during the setup; you should be able to see the administration menu on the left pane of the Profisee FastApp Studio. Navigate to these menus and perform the rest of your MDM journey using FastApp tool. Being able to see the administration menu as seen in the image below confirms successful installation of Profisee on Azure Platform.

    :::image type="content" alt-text="Screenshot of the Profisee FastApp Studio once you sign in, showing the Accounts and Teams menu selected, and the FastApps link highlighted." source="./media/how-to-deploy-profisee-purview/profisee-fastapp-studio-home-screen.png" lightbox="./media/how-to-deploy-profisee-purview/profisee-fastapp-studio-home-screen.png":::

1. As a final validation step to ensure successful installation and for checking whether Profisee has been successfully connected to your Microsoft Purview instance, go to **/Profisee/api/governance/health** It should look something like - "https://[profisee_name].[region].cloudapp.azure.com//Profisee/api/governance/health". The output response will indicate the words **"Status": "Healthy"** on all the Microsoft Purview subsystems. 

```json
{
  "OverallStatus": "Healthy",
  "TotalCheckDuration": "0:XXXXXXX",
  "DependencyHealthChecks": {
    "purview_service_health_check": {
      "Status": "Healthy",
      "Duration": "00:00:NNNN",
      "Description": "Successfully connected to Purview."
    },
    "governance_service_health_check": {
      "Status": "Healthy",
      "Duration": "00:00:NNNN",
      "Description": "Purview cache loaded successfully. 
      Total assets: NNN; Instances: 1; Entities: NNN; Attributes: NNN; Relationships: NNN; Hierarchies: NNN"
    },
    "messaging_db_health_check": {
      "Status": "Healthy",
      "Duration": "00:00:NNNN",
      "Description": null
    },
    "logging_db_health_check": {
      "Status": "Healthy",
      "Duration": "00:00:NNNN",
      "Description": null
    }
  }
}
```

An output response that looks similar as the above confirms successful installation, completes all the deployment steps; and validates whether Profisee has been successfully connected to your Microsoft Purview and indicates that the two systems are able to communicate properly.

## Next steps

Through this guide, we learned of the importance of MDM in driving and supporting Data Governance in the context of the Azure data estate, and how to set up and deploy a Microsoft Purview-Profisee integration.
For more usage details on Profisee MDM, register for scheduled trainings, live product demonstration and Q&A on [Profisee Academy Tutorials and Demos](https://profisee.com/demo/)!
