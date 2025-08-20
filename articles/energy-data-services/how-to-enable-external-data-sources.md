---
title: "Microsoft Azure Data Manager for Energy - How to enable External Data Sources (EDS)"
description: "This article describes how to enable external data sources in Azure Data Manager for Energy."
author: bharathim
ms.author: bselvaraj
ms.service: azure-data-manager-energy
ms.topic: how-to #Don't change
ms.date: 03/14/2024

#customer intent: As a Data Manager in Operating company, I want to enable external data sources so that I pull metadata at scheduled intervals into Azure Data Manager for Energy and retrieve bulk data on demand.

---

# How to enable External Data Sources (EDS) Preview?

External Data Sources (EDS) is a capability in [OSDU&reg;](https://osduforum.org/) that allows data from an [OSDU&reg;](https://osduforum.org/) compliant external data source to be shared with an Azure Data Manager for Energy resource. EDS is designed to pull specified data (metadata) from OSDU-compliant data sources via scheduled jobs while leaving associated dataset files (LAS, SEG-Y, etc.) stored at the external source for retrieval on demand.

For more information about External Data Sources (EDS), see [The OSDU Forum 2Q 2022 Newsletter - EDS](https://osduforum.org/wp-content/uploads/2022/06/The-OSDU-Forum-2Q-2022-Newsletter.pdf).  

> [!NOTE]
> EDS M25 preview is now available on Azure Data Manager for Energy in Developer tier only.

> [!IMPORTANT]
> Limit your Identity Provider (IdP) token to read operations only.
>
> Protect your search and delivery wrapper APIs from unauthorized access. As a best practice, ensure only Azure Data Manager for Energy can access data through your wrapper APIs. This helps with data discovery and delivery for EDS Preview.

## Prerequisites

1. Create a new or use an existing key vault to store secrets managed by [OSDU&reg;](https://osduforum.org/) secret service. To learn how to create a key vault with the Azure portal, see  [Quickstart: Create a key vault using the Azure portal](/azure/key-vault/general/quick-create-portal).
  
    > [!IMPORTANT]
    > Your key vault must exist in the same tenant and subscription as your Azure Data Manager for Energy resource. 

    > [!TIP]
    > When you create the key vault, select [Enable purge protection (enforce a mandatory retention period for deleted vaults and vault objects)](/azure/key-vault/general/key-vault-recovery?tabs=azure-portal#what-are-soft-delete-and-purge-protection).
  
1. In the **Access configuration** tab, under **Permission model** select **Vault access policy**.
    [![Screenshot of create a key vault.](media/how-to-enable-external-data-sources/create-a-key-vault.jpg)](media/how-to-enable-external-data-sources/create-a-key-vault.jpg#lightbox)
1. Give permission to Azure Data Manager for Energy Service Principal (SPN) on key vault (existing or new). How to give access to Azure Data Manager for Energy SPN - [Assign an Azure Key Vault access policy (CLI) | Microsoft Learn](/azure/key-vault/general/assign-access-policy?tabs=azure-portal).
    1. Under **Access Policies**, select **Create** to create an access policy: 
        1. In the Permissions tab, select the permissions.
        [![Screenshot of select permissions.](media/how-to-enable-external-data-sources/select-permissions.jpg)](media/how-to-enable-external-data-sources/select-permissions.jpg#lightbox) 
        1. Under the Principal selection pane, enter `AzureEnergyRpaaSAppProd`.
         [![Screenshot of create an access policy.](media/how-to-enable-external-data-sources/create-an-access-policy.jpg)](media/how-to-enable-external-data-sources/create-an-access-policy.jpg#lightbox) 
        1. Review + Create the access policy.

## To enable EDS Preview, create an Azure support request
To enable External Data Sources Preview on your Azure Data Manager for Energy, create an Azure support ticket with the following information: 
- Subscription ID 
- Azure Data Manager for Energy developer tier resource name
- Data partition name (the data partition in which EDS needs to be enabled for automated triggering of EDS-Scheduler)
- Key Vault name (created in [Prerequisites](#prerequisites)) 

We notify you once EDS preview is enabled in your Azure Data Manager for Energy resource.

## FAQ
See [External data sources FAQ.](faq-energy-data-services.yml#external-data-sources)

> [!div class="nextstepaction"]
> [How to register an external data source with Azure Data Manager for Energy?](how-to-register-external-data-sources.md) 
