---
title: Microsoft Purview collections architecture and best practices
description: This article provides examples of Microsoft Purview collections architectures and describes best practices.
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 09/13/2022
---

# Microsoft Purview collections architectures and best practices  

At the core of [Microsoft Purview unified data governance solutions](/purview/purview#microsoft-purview-unified-data-governance-solutions), the data map is a platform as a service (PaaS) component that keeps an up-to-date map of assets and their metadata across your data estate. To hydrate the data map, you need to register and scan your data sources. In an organization, there might be thousands of sources of data that are managed and governed by either centralized or decentralized teams.  

[Collections](./how-to-create-and-manage-collections.md) in Microsoft Purview support organizational mapping of metadata. By using collections, you can manage and maintain data sources, scans, and assets in a hierarchy instead of a flat structure. Collections allow you to build a custom hierarchical model of your data landscape based on how your organization plans to use Microsoft Purview to govern your landscape.

A collection also provides a security boundary for your metadata in the data map. Access to collections, data sources, and metadata is set up and maintained based on the collections hierarchy in Microsoft Purview, following a least-privilege model: 
- Users have the minimum amount of access they need to do their jobs. 
- Users don't have access to sensitive data that they don't need.

## Why do you need to define collections and an authorization model for your Microsoft Purview account? 

Consider deploying collections in Microsoft Purview to fulfill the following requirements: 

- Organize data sources, distribute assets, and run scans based on your business requirements, geographical distribution of data, and data management teams, departments, or business functions. 

- Delegate ownership of data sources and assets to corresponding teams by assigning roles to corresponding collections. 

- Search and filter assets by collections. 
 

## Define a collection hierarchy  

### Design recommendations 

- Review the [Microsoft Purview account best practices](./deployment-best-practices.md#determine-the-number-of-microsoft-purview-instances) and define the adequate number of Microsoft Purview accounts required in your organization before you plan the collection structure.  

- We recommend that you design your collection architecture based on the security requirements and data management and governance structure of your organization. Review the recommended [collections archetypes](#collections-archetypes) in this article.

- For future scalability, we recommend that you create a top-level collection for your organization below the root collection. Assign relevant roles at the top-level collection instead of at the root collection.  

- Consider security and access management as part of your design decision-making process when you build collections in Microsoft Purview. 

- Each collection has a name attribute and a friendly name attribute. If you use [the Microsoft Purview governance portal](https://web.purview.azure.com/resource/) to deploy a collection, the system automatically assigns a random six-letter name to the collection to avoid duplication. To reduce complexity, avoid using duplicated friendly names across your collections, especially in the same level.

- Currently, a collection name can contain up to 36 characters and a collection friendly name can have up to 100 characters.

- When you can, avoid duplicating your organizational structure into a deeply nested collection hierarchy. If you can't avoid doing so, be sure to use different names for every collection in the hierarchy to make the collections easy to distinguish.

- Automate deployment of collections by using the API if you're planning to deploy collections and role assignments in bulk.

- Use a dedicated service principal name (SPN) to run operations on collections and role assignment by using the API. Using an SPN reduces the number of users who have elevated rights and follows least-privilege guidelines.

### Design considerations  

- Each Microsoft Purview account is created with a default _root collection_. The root collection name is the same as your Microsoft Purview account name. The root collection can't be removed. To change the root collection's friendly name, you can change the friendly name of your Microsoft Purview account from Microsoft Purview Management center.   

- Collections can hold data sources, scans, assets, and role assignments.

- A collection can have as many child collections as needed. But each collection can have only one parent collection. You can't deploy collections above the root collection.

- Data sources, scans, and assets can belong to only one collection. 

- A collections hierarchy in a Microsoft Purview can support as many as 256 collections, with a maximum of eight levels of depth. This doesn't include the root collection. 

- By design, you can't register data sources multiple times in a single Microsoft Purview account. This architecture helps to avoid the risk of assigning different levels of access control to a single data source. If multiple teams consume the metadata of a single data source, you can register and manage the data source in a parent collection. You can then create corresponding scans under each subcollection so that relevant assets appear under each child collection.

- Lineage connections and artifacts are attached to the root collection even if the data sources are registered at lower-level collections.

- When you run a new scan, by default, the scan is deployed in the same collection as the data source. You can optionally select a different subcollection to run the scan. As a result, the assets will belong under the subcollection. 

- Currently, moving data sources across collections isn't allowed. If you need to move a data source under a different collection, you need to delete all assets, remove the data source from the original collection, and re-register the data source under the destination collection.

- Moving assets across collections is allowed if the user is granted the Data Curator role for the source and destination collections. 

- Currently, certain operations, like move and rename of a collection, aren't allowed. 

- You can delete a collection if it does not have any assets, associated scans, data sources or child collections.

- Data sources, scans, and assets must belong to a collection if they exist in the Microsoft Purview data map.    

<!-- 
- Moving data sources across collections is allowed if the user is granted the Data Source Admin role for the source and destination collections. 

- Moving assets across collections is allowed if the user is granted the Data Curator role for the source and destination collections. 

-->

## Define an authorization model

Microsoft Purview data-plane roles are managed in Microsoft Purview. After you deploy a Microsoft Purview account, the creator of the Microsoft Purview account is automatically assigned the following roles at the root collection. You can use [the Microsoft Purview governance portal](https://web.purview.azure.com/resource/) or a programmatic method to directly assign and manage roles in Microsoft Purview.

  - **Collection Admins** can edit Microsoft Purview collections and their details and add subcollections. They can also add users to other Microsoft Purview roles on collections where they're admins.
  - **Data Source Admins** can manage data sources and data scans.
  - **Data Curators** can create, read, modify, and delete catalog data assets and establish relationships between assets.
  - **Data Readers** can access but not modify catalog data assets.

### Design recommendations 

- Consider implementing [emergency access](/azure/active-directory/users-groups-roles/directory-emergency-access) or a break-glass strategy for the Collection Admin role at your Microsoft Purview root collection level to avoid Microsoft Purview account-level lockouts. Document the process for using emergency accounts. 

    > [!NOTE]
    > In certain scenarios, you might need to use an emergency account to sign in to Microsoft Purview. You might need this type of account to fix organization-level access problems when nobody else can sign in to Microsoft Purview or when other admins can't accomplish certain operations because of corporate authentication problems. We strongly recommended that you follow Microsoft best practices around implementing [emergency access accounts](/azure/active-directory/users-groups-roles/directory-emergency-access) by using cloud-only users.
    >
    > Follow the instructions in [this article](./concept-account-upgrade.md#what-happens-when-your-upgraded-account-doesnt-have-a-collection-admin) to recover access to your Microsoft Purview root collection if your previous Collection Admin is unavailable.

- Minimize the number of root Collection Admins. Assign a maximum of three Collection Admin users at the root collection, including the SPN and your break-glass accounts. Assign your Collection Admin roles to the top-level collection or to subcollections instead.

- Assign roles to groups instead of individual users to reduce administrative overhead and errors in managing individual roles. 

- Assign the service principal at the root collection for automation purposes.

- To increase security, enable Azure AD Conditional Access with multifactor authentication for at least Collection Admins, Data Source Admins, and Data Curators. Make sure emergency accounts are excluded from the Conditional Access policy.

### Design considerations  

- Microsoft Purview access management has moved into data plane. Azure Resource Manager roles aren't used anymore, so you should use Microsoft Purview to assign roles. 

- In Microsoft Purview, you can assign roles to users, security groups, and service principals (including managed identities) from Azure Active Directory (Azure AD) on the same Azure AD tenant where the Microsoft Purview account is deployed.
  
- You must first add guest accounts to your Azure AD tenant as B2B users before you can assign Microsoft Purview roles to external users. 

- By default, Collection Admins don't have access to read or modify assets. But they can elevate their access and add themselves to more roles.

- By default, all role assignments are automatically inherited by all child collections. But you can enable **Restrict inherited permissions** on any collection except for the root collection. **Restrict inherited permissions** removes the inherited roles from all parent collections, except for the Collection Admin role. 

- For Azure Data Factory connection: to connect to Azure Data Factory, you have to be a Collection Admin for the root collection.

- If you need to connect to Azure Data Factory for lineage, grant the Data Curator role to the data factory's managed identity at your Microsoft Purview root collection level. When you connect Data Factory to Microsoft Purview in the authoring UI, Data Factory tries to add these role assignments automatically. If you have the Collection Admin role on the Microsoft Purview root collection, this operation will work. 

## Collections archetypes

You can deploy your Microsoft Purview collection based on centralized, decentralized, or hybrid data management and governance models. Base this decision on your business and security requirements.

### Example 1: Single-region organization 

This structure is suitable for organizations that: 
- Are mainly based in a single geographic location. 
- Have a centralized data management and governance team where the next level of data management falls into departments, teams, or projects.  

The collection hierarchy consists of these verticals: 

- Root collection (default)
- Contoso (top-level collection)
- Departments (a delegated collection for each department) 
- Teams or projects (further segregation based on projects)

Each data source is registered and scanned in its corresponding collection. So assets also appear in the same collection. 

Organization-level shared data sources are registered and scanned in the Hub-Shared collection. 

The department-level shared data sources are registered and scanned in the department collections. 

:::image type="content" source="media/concept-best-practices/collections-example-1.png" alt-text="Screenshot that shows the first Microsoft Purview collections example."lightbox="media/concept-best-practices/collections-example-1.png":::

### Example 2: Multiregion organization

This scenario is useful for organizations: 
- That have a presence in multiple regions. 
- Where the data governance team is centralized or decentralized in each region.
- Where data management teams are distributed in each geographic location. 

The collection hierarchy consists of these verticals: 

- Root collection (default)
- FourthCoffee (top-level collection)
- Geographic locations (mid-level collections based on geographic locations where data sources and data owners are located)
- Departments (a delegated collection for each department) 
- Teams or projects (further segregation based on teams or projects)

In this scenario, each region has a subcollection of its own under the top-level collection in the Microsoft Purview account. Data sources are registered and scanned in the corresponding subcollections in their own geographic locations. So assets also appear in the subcollection hierarchy for the region. 

If you have centralized data management and governance teams, you can grant them access from the top-level collection. When you do, they gain oversight for the entire data estate in the data map. Optionally, the centralized team can register and scan any shared data sources.

Region-based data management and governance teams can obtain access from their corresponding collections at a lower level.

The department-level shared data sources are registered and scanned in the department collections. 

:::image type="content" source="media/concept-best-practices/collections-example-2.png" alt-text="Screenshot that shows the second Microsoft Purview collections example."lightbox="media/concept-best-practices/collections-example-2.png":::

### Example 3: Multiregion, data transformation

This scenario can be useful if you want to distribute metadata-access management based on geographic locations and data transformation states. Data scientists and data engineers who can transform data to make it more meaningful can manage Raw and Refine zones. They can then move the data into Produce or Curated zones.  

The collection hierarchy consists of these verticals: 

- Root collection (default)
- Fabrikam (top-level collection)
- Geographic locations (mid-level collections based on geographic locations where data sources and data owners are located)
- Data transformation stages (Raw, Refine, Produce/Curated) 

Data scientists and data engineers can have the Data Curators role on their corresponding zones so they can curate metadata. Data Reader access to the curated zone can be granted to entire data personas and business users. 

:::image type="content" source="media/concept-best-practices/collections-example-3.png" alt-text="Screenshot that shows the third Microsoft Purview collections example."lightbox="media/concept-best-practices/collections-example-3.png":::

### Example 4: Multiregion, business functions 

This option can be used by organizations that need to organize metadata and access management based on business functions.

The collection hierarchy consists of these verticals: 

- Root collection (default)
- AdventureWorks (top-level collection)
- Geographic locations (mid-level collections based on geographic locations where data sources and data owners are located)
- Major business functions or clients (further segregation based on functions or clients)

Each region has a subcollection of its own under the top-level collection in the Microsoft Purview account. Data sources are registered and scanned in the corresponding subcollections in their own geographic locations. So assets are added to the subcollection hierarchy for the region. 

If you have centralized data management and governance teams, you can grant them access from the top-level collection. When you do, they gain oversight for the entire data estate in the data map. Optionally, the centralized team can register and scan any shared data sources.

Region-based data management and governance teams can obtain access from their corresponding collections at a lower level.
Each business unit has its own subcollection.

:::image type="content" source="media/concept-best-practices/collections-example-4.png" alt-text="Screenshot that shows the fourth Microsoft Purview collections example."lightbox="media/concept-best-practices/collections-example-4.png":::

## Access management options

If you want to implement data democratization across an entire organization, assign the Data Reader role at the top-level collection to data management, governance, and business users. Assign Data Source Admin and Data Curator roles at the subcollection levels to the corresponding data management and governance teams.

If you need to restrict access to metadata search and discovery in your organization, assign Data Reader and Data Curator roles at the specific collection level. For example, you could restrict US employees so they can read data only at the US collection level and not in the LATAM collection. 

You can apply a combination of these two scenarios in your Microsoft Purview data map if total data democratization is required with a few exceptions for some collections. You can assign Microsoft Purview roles at the top-level collection and restrict inheritance to the specific child collections.

Assign the Collection Admin role to the centralized data security and management team at the top-level collection. Delegate further collection management of lower-level collections to corresponding teams.

## Next steps
-  [Create a collection and assign permissions in Microsoft Purview](./quickstart-create-collection.md)
-  [Create and manage collections in Microsoft Purview](./how-to-create-and-manage-collections.md)
-  [Access control in Microsoft Purview](./catalog-permissions.md)
