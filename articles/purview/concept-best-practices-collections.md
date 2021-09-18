---
title: Purview collections architecture and best practices
description: This article explains Purview collections architecture and best practices
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 09/15/2021
---

# Azure Purview collections architecture and best practices  

At the core of Azure Purview, the data map is a Platform as a Service component that keeps an up-to-date map of assets and their metadata across your data estate. In order to hydrate the data map, you need to register and scan your data sources. In an organization, there might be thousands of sources of data which are managed and governed by either centralized or decentralized teams.  

[Collections](./how-to-create-and-manage-collections.md) in Azure Purview to support organizational mapping of metadata.  With collections you can manage and maintain data sources, scans, and assets in a hierarchy instead of a flat structure. Collections allow you to build a custom hierarchical model of your data landscape based on how your organization plans to use Azure Purview to govern your landscape.

A collection also provides a security boundary of your metadata in data map. Access to collections, data sources and metadata is set up and maintained based on collections hierarchy in Azure Purview following a least privilege model: giving users the minimum amount of access they need to do their job, and preventing access to unneeded, sensitive data.

## Intended audience

- Data architecture team 
- Data governance and management teams
- Data security team

## Why do you need to define collections and an authorization model for your Azure Purview account? 

Consider deploying collections in your Azure Purview to fulfill the following requirements: 

- Organize data sources, distribute assets and run scans based on your business requirements, geographical distribution of data and data management teams, departments or business functions. 

- Delegate ownership of data sources and assets to corresponding teams by assigning roles to corresponding collections. 

- Search and filter assets by collections. 
 

## Define a collection hierarchy  

### Design considerations  

- Each Purview account is created with a default _root collection_. The root collection name is the same as your Azure Purview account name. The root collection cannot be removed. You can change friendly name of your Purview account from Purview Management center and this way change root collection's friendly name.   

- Collections can hold data sources, scans, assets and role assignments.

- A collection can have as many child collections as needed. However, each collection can only have one parent collection. You cannot deploy any collections above root collection.

- Data sources, scans, and assets can belong only to one collection. 

- A collections hierarchy in an Azure Purview can support up to 300 collections with a maximum of 8 levels of depth. This does not include the root collection. 

- By design, you cannot register data sources multiple times in the same Purview account. This architecture helps to avoid the risk of assigning different access control to the same data source. If the metadata of the same data source is consumed by multiple teams, you can register and manage the data source at a parent collection and create corresponding scans under each sub-collection, so relevant assets appear under each child collection.

- Lineage connections and artifacts are attached to root collection even if the data sources are registered at lower-level collections.

- When you run a new scan, by default, the scan is deployed inside the same collection as data source. You can optionally select a different sub-collection to run the scan, so as result, the assets will belong under the sub-collection. 

- Currently, moving data sources across collections is not allowed. If you require to move a data source under a different collection, it is required to delete all assets, remove the data source from the original collection and re-register the data source under destination collection.

- Moving assets across collections is allowed, if the user is granted _data curator_ role at source and destination collections. 

- Currently, certain operations such as _delete_, _move_, _rename_ for a collection is not allowed. 

- Data sources, scans and assets must belong to a collection at any times meanwhile they exist inside Azure Purview data map.    

<!-- 
- Moving data sources across collections is allowed as long as the user is granted Data Source Admin role at source and destination collection. 

- Moving assets across collections is allowed, if the user is granted Data Curator role at source and destination collection. 

- Certain operations such as Delete, Move, Rename of the collection is not allowed using the graphical interface through Azure Purview Studio. You can use API to perform such operations in your Azure Purview data map directly. 

- You can delete collections if there are no assets or data sources associated with the collection. You can delete collections that have scans associated with them. 
-->

### Design recommendations 

- Review [Azure Purview account best practices documentation](/deployment-best-practices.md#determine-the-number-of-purview-instances) and define the adequate number of Purview accounts required in your organization before planning collection structure.  

- It is recommended designing your collection architecture based on security requirements, data management and governance structure in your organization. Review the recommended [collections archetypes](#collections-archetypes) in this guide.

- For future scalability, it is recommended creating a top-level collection for your organization below the root collection and assign relevant roles at the top-level collection instead of root collection.  

- Consider security and access management part of design decisions when building collections in Azure Purview. 

- Each collection has a name attribute and a friendly name attribute. If you use Azure Purview Studio to deploy a collection the system automatically assigns a random six-letter name to the collection to avoid duplicity. Avoid using duplicated friendly names across your collections specially in the same level to reduce complexity.  

- When possible, avoid duplicating your organizational structure into a deeply nested collection hierarchy. If this cannot be avoided, make sure you use different names for every collection in the hierarchy to easily distinguish the collections.

- Automate deployment of collections through the API if you are planning to deploy collections and role assignments in bulk.

- Use a dedicated Service Principal Name (SPN) to execute operations on collections and role assignment using API. Using an SPN reduces the number of users who have elevated rights and follows least-privilege guidelines.

## Define an authorization model

Azure Purview data-plane roles are managed inside Azure Purview. After you deploy a Purview account, the creator of Purview account is automatically assigned all the following roles at root collection. You can use Purview Studio or a programmatic way to assign and manage roles in Azure Purview directly:

  - **Collection admins** - can edit Purview collections, their details, and add subcollections. They can also add users into other Purview roles on collections where they're admins.
  - **Data source admins** - can manage data sources and data scans.
  - **Data curators** - can create, read, modify, and delete catalog data assets and establish relationships between assets.
  - **Data readers** - can access but not modify catalog data assets.

### Design considerations  

- Azure Purview access management is moved into data plane. Azure resource manager roles are not used anymore, therefore you should use Azure Purview to assign roles. 

- In Azure Purview, you can assign roles to users, security groups and service principals (including Managed Identities) from your Azure Active Directory on the same Azure AD tenant where the Purview account is deployed.
  
- Guest accounts must be first added to you Azure AD tenant as B2B users before you can assign Purview roles to external users. 

- By default, Collection admins do not have access to read or modify assets, however they can elevate their access and add themselves to additional roles.

- By default, all role assignments are automatically inherited to all child collections, however, you can enable **Restrict inherited permissions** on any collections except root collection. Restrict inherited permissions removes all inherited roles from all parent collections above, except collection admins role. 

- For ADF connection: to connect ADF you have to be collection admin at root collection.

- If connection with Azure Data Factory for lineage is required, grant the data factory's managed identity the _data curator_ role at your Purview root collection level. When connecting data factory to Purview on authoring UI, ADF tries to add such role assignment automatically. If you have collection admins role on the Purview root collection, this operation is done successfully. 

### Design recommendations 

- Consider implementing [emergency access](/azure/active-directory/users-groups-roles/directory-emergency-access) or a break-glass strategy for collection admins role at your Azure Purview root collection level to avoid Purview account level lockouts. Document the process to use emergency accounts. 

    > [!NOTE]
    > For certain scenarios, you may need to use an emergency account to login to Azure Purview to fix organizational level access issues when nobody else can login to Purview or other admins cannot perform certain operations due corporate authentication issues. It is highly recommended following Microsoft best practices guides around implementing [emergency access accounts](/azure/active-directory/users-groups-roles/directory-emergency-access) using cloud only users.
    
    Follow [this guide](./concept-account-upgrade.md#what-happens-when-your-upgraded-account-doesnt-have-a-collection-admin) to recover access to your Purview root collection in case your last collection admin is unavailable.

- Keep the number of root collection admins minimal. Assign maximum of 3 collection admins users at root collection including the SPN and your break-glass accounts. Assign your collection admin roles at the top-level collection or subcollections instead.

- Assign roles to groups instead of individual users to reduce administrative overhead and errors managing individual roles. 

- Assign Service Principal at root collection for automation purposes.

- To increase security, enable Azure Active Directory Conditional Access with multi-factor authentication for at least collections admins, data source admins and data curator roles. Make sure emergency accounts are excluded from the Conditional Access policy.
 
## Collections Archetypes

You can plan to deploy your Azure Purview collection based on a centralized, decentralized or hybrid data management and governance models, according to your business and security requirements.

### Example 1: Single-region organization 

This structure is suitable for companies that are mainly based on a single geographical location, have a centralized data management and governance team where the next level of data management falls into departments, teams or projects.  

The collection hierarchy consists of the following verticals: 

- Root collection (Default)
- Contoso (Top-level collection)
- Departments (Delegated collections for each department) 
- Teams or Projects (Further segregation based on projects)

Each data source can be registered and scanned inside their corresponding collections, this way assets are also appear in the same collection. 

Organizational-level shared data sources can be registered and scanned inside Hub-Shared collection. 

The department-level shared data sources can be registered and scanned in the department collections. 

:::image type="content" source="media/concept-best-practices/collections-example-1.png" alt-text="Screenshot that shows an example of Azure Purview collection example 1."lightbox="media/concept-best-practices/collections-example-1.png":::

### Example 2: Multi-region organization

This scenario is useful for organizations that have presence in multiple regions, where data governance team is centralized or decentralized in each region, data management teams are distributed in each geographical location. 

The collection hierarchy consists of the following verticals: 

- Root collection (Default)
- FourthCoffee (Top-level collection)
- Geos (Mid-level collections based on geographical locations where data sources and data owners are located)
- Departments (Delegated collections for each department) 
- Teams or Projects(Further segregation based on teams or projects)

In this scenario, each region has a sub collection of their own under the top-level collection inside the Purview account. Data sources are registered and scanned inside the corresponding subcollections in their own geo, this way assets are also appear in the sub collection hierarchy for the region. 

If you have centralized data management and governance team, you can grant them access from top-level collection. This way, they gain oversight for the entire data estate in the data map. Optionally, the centralized team can register and scan any shared data sources.

Region-based data management and governance team can obtain access from their corresponding collections at lower level.

The department-level shared data sources can be registered and scanned in the department collections. 

:::image type="content" source="media/concept-best-practices/collections-example-2.png" alt-text="Screenshot that shows an example of Azure Purview collection example 2."lightbox="media/concept-best-practices/collections-example-2.png":::

### Example 3: Multi-region Data Transformation

This scenario can be useful for organizations that are interested in distributing metadata access management based on geographical locations and data transformation states. Raw and refine zones can be managed by data scientists and data engineers to transform them to more meaningful data and moved into produce or curated zones.  

The collection hierarchy consists of the following verticals: 

- Root collection (Default)
- Fabrikam (Top-level collection)
- Geos (Mid-level collections based on geographical locations where data sources and data owners are located)
- Data Transformation Stages (Raw, Refine, Produce/Curated) 

Data scientists and data engineers can have the _data curators_ role on their corresponding zones to perform curation of metadata. _Data reader_ access to the curated zone can be granted to entire data personas and business users. 

:::image type="content" source="media/concept-best-practices/collections-example-3.png" alt-text="Screenshot that shows an example of Azure Purview collection example 3."lightbox="media/concept-best-practices/collections-example-3.png":::

### Example 4: Multi-region Business Functions 

This option can be used by companies who require organizing metadata and access management based on business functions.

The collection hierarchy consists of the following verticals: 

- Root collection (Default)
- AdventureWorks (Top-level collection)
- Geo (Mid-level collections based on geographical locations where data sources and data owners are located)
- Major business functions, clients (Further segregation based on functions or clients)

Each region has a sub collection of their own under the top-level collection inside the Purview account. Data sources are registered and scanned inside the corresponding subcollections in their own geo. This way assets are added to the subcollection hierarchy for the region. 

If you have centralized data management and governance team, you can grant them access from top-level collection. This way, they gain oversight for the entire data estate in the data map. Optionally, the centralized team can register and scan any shared data sources.

Region-based data management and governance team can obtain access from their corresponding collections at lower level.
Each Business unit has their own sub-collection.

:::image type="content" source="media/concept-best-practices/collections-example-4.png" alt-text="Screenshot that shows an example of Azure Purview collection example 4."lightbox="media/concept-best-practices/collections-example-4.png":::

## Access management options

For organizations who are looking to implement data democratization across the entire organization, assign _data reader_ role at the top-level collection to data management and governance and business users. Assign _data source admin_ and _data Curator_ roles at the sub-collection levels to the corresponding data management and governance teams.

If you need to restrict access metadata search and discovery in your organization, assign _data reader_ and _data curator_ roles at the specific collection level. For example, US employees can read data only at the US collection level and not the LATAM collection. 

A combination of these two scenarios can be applied into your Purview data map where total data democratization is required with a few exceptions at some collections. You can assign Purview roles at top-level collection, and restrict inheritance to the specific child collection.

Assign _collection admin_ role to centralized data security and management team at top-level collection and delegate further collection management to lower level collections to corresponding teams.

## Next steps
-  [Create a collection and assign permissions in Purview](./quickstart-create-collection.md)
-  [Create and manage collections in Azure Purview](./how-to-create-and-manage-collections.md)
-  [Access control in Azure Purview](./catalog-permissions.md)
