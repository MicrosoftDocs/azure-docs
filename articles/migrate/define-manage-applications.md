---
title: Define and manage applications in Azure Migrate
description:  Learn how to define and manage applications in Azure Migrate for application centric migration planning and execution.
author: vikram1988
ms.author: vibansa
ms.manager: ronai
ms.service: azure-migrate
ms.topic: concept-article
ms.date: 05/7/2026
ms.custom:
  - engagement-fy25
  - sfi-image-nochange
# Customer intent: As an IT administrator, I want to define applications from servers and workloads I have discovered from my datacenter so that I can plan and execute migration of business applications with ease.
---

# Explore application inventory

This article describes how you can use Azure Migrate to define applications running in your datacenter by logically grouping servers and workloads as an application. These applications can be used to plan and execute the migrations more efficiently. 
You can add applications by performing a bulk import using a CSV file or by adding them one at a time through the portal. You can also initiate automatic discovery of applications where Azure Migrate uses naming patterns, inferred environments, and derived server roles from workloads discovered using Azure Migrate appliance or Collector or CSV Import.

## Current limitations

- Defining applications using CSV import is currently not supported for projects set up with private endpoint connectivity.

## Before you start

1. Ensure that you have an [Azure Migrate project](./create-manage-projects.md).
2. Based on your requirements,  select a [discovery method](./discovery-methods-modes.md), Azure Migrate Appliance, Collector, or CSV Import to perform discovery of your datacenter.
3. You can select the discovery method hat best suits your needs and organizational policies:
  - [Azure Migrate appliance](./migrate-appliance.md)- A continuous discovery mode that helps with discovery of VMware or Hyper-V or Physical environment. You can also [configure server credentials](./add-server-credentials.md) for discovery of software, dependencies, web apps, and database workloads.
  - [Collector](how-to-discover-using-collector.md)- A disconnected discovery mode that supports discovery of VMware or Physical environment. You can also configure server credentials for discovery of software, web apps, and database workloads (Gathering of network dependency data not supported currently).
  - [CSV Import](./tutorial-discover-import.md)- A snapshot-based discovery mode that supports only discovery of servers from any environment. 

## Review inventory & server dependencies

- After completing discovery using any of the modes, go to your Azure Migrate project and review the discovered inventory in **All inventory** under **Explore inventory**. 
- If you have configured an Azure Migrate appliance, you can review the collected dependency data in your project through **Dependency analysis** under **Explore applications**. Here you can visualize dependencies across all discovered servers in your Azure Migrate project. 
- The visualization shows logically spread server nodes with their connections, indicating their network affinity to help you identify applications running in your datacenter. [Learn more](how-to-create-group-machine-dependencies-agentless.md)
- You can **add or edit tags** on the servers, you identify to be part of the same application group. Tags can help you define application entity in the Azure Migrate project.

## Add applications

You can start identifying the applications running in your datacenter. Here are the steps you can follow to get started:

1. You can either go to **Overview** and select **Add applications** from the All inventory summary card to Auto discover applications or Import applications or Create new application or you can go to **Applications** under **Explore applications** and select **Add applications** to Auto discover applications or Create new application. Alternatively, select **Import** to Import Applications.
2. The applications can be added in one of three ways-
  - **Auto discover applications**- Azure Migrate automatically groups discovered workloads into applications and derives Application Name, Type, Business Criticality, and Complexity using discovered metadata of workloads.
  - **Import applications**- Add Applications at scale by importing a CSV file with Application Names added in an exported CSV file with all discovered workloads.
  - **Create new application**- Use portal to create one application at a time by providing basic details, grouping discovered workloads and adding application properties and tags.

### Auto discover applications

Azure Migrate supports automatic application discovery by grouping servers discovered using Azure Migrate appliance, Collector, or CSV Import.

1. To start automatic discovery, go to **Add Applications** > **Auto discover applications** in Applications view. In the side pane, select **Discover applications** to initiate the process.
2. You can run this process only once (it's recommended to initiate it after you complete the discovery of your servers and workloads). The operation can take **up to one hour** depending on the total number of discovered workloads.
3. Each autodiscovered application represents a logical grouping of servers (and workloads running on those servers) automatically identified using **server-naming patterns, inferred environments, and derived server roles**.
4. Azure Migrate performs automatic **grouping** of Applications, provides an **Application Name** , derived from server names grouped together, identifies the **Application Type** (Custom or Packaged) from the software running on the servers and also identifies the **Business criticality** & **Complexity** of an application (High or Medium or Low) based on the count and type of workloads grouped together. The **Description** of the application covers the explanation on how Azure Migrate derived all these details automatically.
   
    >[!Note]
    > The Application type **Packaged** refers to the Commercial-off-the-shelf (COTS) applications you are running in your datacenter. In case the metadata from discovered workloads is insufficient, the Application Name will be set as 'Application_01', 'Applications_02' etc., the Application Type will be defaulted to 'Custom', Business Criticality and Complexity will be set to 'Medium' by default. You can review the applications and update these details as required.
    
5. Azure Migrate sets **Managed by** property to 'System' for automatically discovered applications. The property is set to 'User' for manually added applications (either via portal or CSV import).
6. Azure Migrate also defines a property **Confidence score** which is a system assigned score to represent the accuracy of the application grouping. The user-defined (manually created) applications don't have a confidence score value so it's set to '-'.
7. After the automatic discovery is complete, you can **review and update** the application details, grouping, properties, and tags by scoping them in the Applications view.

    >[!Note]
    > When you review and update the application details, grouping, properties, or tags, the **Managed by** property will be changed from 'System' to 'User', indicating that the system-defined applications have been reviewed and now managed by the user.

8. You can select one or more autodiscovered applications to **Create assessment**, **Add or edit tags** or **Delete** applications.

### Import applications

1. To define applications at scale, you can select **Import> Import applications** in Applications view. This action opens a side pane where you can follow the steps.
2. Define application groups by adding the application names against the discovered servers and workloads in the prescribed template, which is an export of all discovered inventory. 
3. Select **Export all inventory** which downloads a CSV file with the details of all discovered inventory across servers, databases, and web applications.
4. In the exported CSV, you can add names of the applications, a workload is a part of. You can add more than one name if the workload is shared among multiple applications. For instance, if a database- "SQLDB01" is shared by two applications, then you can add- "App01, App02" under Application name column in the same row. 

    >[!Note]
    > The **Application name(s)** are case-sensitive and can include alphanumeric and special characters except `','` and `'\'`. The All inventory export contains a column named 'App ARM ID Name(s)' which is the ARM representation of the application resource- do not add or edit any values in the column as that can lead to errors in importing the application grouping.

5. In each import operation, you can add up to **5000 application names** with a maximum grouping of **500 workloads per application** subject to an overall limit of grouping 30,000 workloads per CSV import. 
6. After saving the CSV file with application names, you can browse and select the CSV file in the side pane on the Azure portal.
7. If the selected file passes the validation checks, you can select **Import** to upload the details of the applications, as added in the CSV file. Based on the volume of the workloads grouped, each import operation can take **up to 3 hours** to complete.
8. After the import is complete, you can see the import status and review the **number of applications created** and check the **error** file if any failures occur. 

    >[!Note]
    > Currently, import applications feature **only supports adding workloads** to an application and does not support removing existing workloads. To remove a workload, use the portal to review and edit the specific application. CSV import also **does not support deleting an Application** by removing its name from CSV file. You can use portal experience to perform bulk delete of applications.

9. The imported applications contain only application names with grouped workloads and don't include any more details or properties. It's recommended to select **Import> Import application properties** to add or edit application details, properties or tags at scale using the prescribed template.

### Import application properties

When the application is defined using import, a warning icon appears next to the application name to indicate that mandatory properties need to be updated. You can update these properties individually by selecting the application in the Applications view, or update them at scale using **Import> Import application properties**. 

1. Update the properties of applications in the prescribed template, which is an export of applications inventory.
2. Select **Export applications** to download a CSV file containing details of all applications added manually (via CSV import or the portal) or automatically by Azure Migrate.
3. In the exported CSV, you can add/edit application details like Name, Description, Type, and mandatory properties like Business Criticality and Complexity, especially for applications added through CSV import. You can also edit the properties of applications that were added manually (CSV import or portal) or automatically by Azure Migrate. 

    >[!Note]
    > Don't edit the **App ARM ID** column in the CSV file. You can add application properties across multiple import operations but avoid triggering multiple imports in parallel.

5. For the Application properties, the following values are supported in the CSV file:

    **Property** | **Required** | **Description** | **Values**
    --- | --- | --- | ---
    Business criticality | Yes | Specify the criticality of the application to your business | Choose from **High**, **Medium**, **Low**
    Complexity | Yes | Specify the complexity in terms of workloads and dependencies | Choose from **High**, **Medium**, **Low**
    Publisher | No (Optional) | Specify the names of the publisher of application (Packaged) or its workloads (custom) | For example, **SAP** if it's a Packaged application or **Microsoft** if it's a Custom application running on .NET IIS web application and SQL database
    Technology stack | No (Optional) | Specify the technology used like runtimes, frameworks, languages, etc. | For example, .NET, SQL, MySQL, Tomcat, etc.

6. If the file passes validation checks, select **Import** to upload the application details captured in the CSV file.
7. After the import completes, review the import status, the **number of applications processed**, and check the **error** file if any failures occur.

### Create new application

1. Select **Add applications> Create new application**. Start by providing basic details of an application like **Name**, **Description**, and **Type**. You can choose to provide same name for the application as on-premises, add a description with details about the application, and choose between **Custom** or **Packaged** for application type. 

    >[!Note]
    > The application **Name** also allows for alphanumeric and special characters except `','` and `'\'`. The type **Packaged** refers to the Commercial-off-the-shelf (COTS) applications you are running in your datacenter.

2. In the next step, you can link the workloads that are hosting this application. You can select **Link workloads** to go to the All inventory view, which helps you select the workloads that you want to add to this new application. 
3. You can scope the All inventory view by searching for specific workloads or filtering workloads by Category, Type, OS name, Tags, etc. and **Add** the selected workloads.

    >[!Note]
    > The **Application** column in the All inventory view indicates if a workload has already been grouped as part of another application. A workload can be shared between multiple applications.

4. In the next step, you can specify properties associated with the application. Here are the properties you can add:

    **Property** | **Required** | **Description** | **Values**
    --- | --- | --- | ---
    Business criticality | Yes | Specify the criticality of the application to your business | Choose from **High**, **Medium**, **Low**
    Complexity | Yes | Specify the complexity in terms of workloads and dependencies | Choose from **High**, **Medium**, **Low**
    Publisher | No (Optional) | Specify the names of the publisher of application (Packaged) or its workloads (custom) | For example, **SAP** if it's a Packaged application or **Microsoft** if it's a Custom application running on .NET IIS web application and SQL database
    Technology stack | No (Optional) | Specify the technology used like runtimes, frameworks, languages, etc. | For example, .NET, SQL, MySQL, Tomcat, etc.

    >[!Note]
    > The **Properties** can help identify the application uniquely and can be used to filter and perform scoped migration planning for different types of applications.

5. After adding the properties, you can add **tags** to the application you're creating. You can use tags to group and visualize similar applications based on specific tags, such as environment, department, or datacenter etc.
6. In the final step, you can **review** the details of the application and proceed to **Create** the application.

## Review applications

After defining the applications using Auto discover, Import or Create new application, you can review the applications any time from the **Applications** view. 

- In the **Applications** view, the applications are sorted by their **Creation Time** so that the recently defined applications show on top of the table.
- You can use the prefiltered cards to switch between **Custom** and **Packaged** applications.
- In this view, you can see the application names with Type, Managed by, Workloads (count), Properties, and Tags. 
- You can scope the view using **search** or by applying **filter** on one or more application attributes.
- You can also select one or more applications to **Create assessment**, **Sync code changes**, **Add or edit tags** or **Delete** applications.

## Update applications

 You can select any application name to review and update the basic details, added workloads, properties or tags. Here are the steps you can follow:

1. After selecting an application, you're taken to the **Overview** of the application. Here you can **Sync code changes** for the application or **Edit** the basic details such as Description and Type of the application.
2. In the **Overview**, you can review the distribution of linked workloads by type and by OS support status. 
3. You can go to **Activity logs** from left menu to review the activities performed on the application.
4. You can review the **Workloads** to add or remove any workloads any time after the application was defined.
5. You can also review and update the **Properties** or **Tags** associated with the application.

    >[!Note]
    > When you review and update the details/grouping/properties/tags of an automatically discovered application, the **Managed by** property is changed from 'System' to 'User', indicating that the system-defined applications have been reviewed and now managed by the user.

## Delete applications

- You can select one or more applications from the **Applications** view to delete the unwanted applications.
- When you select **Delete**, a side pane opens with the names of applications you want to delete. 
- Before deleting the applications, you should ensure that they aren't part of any Assessment or Migration Wave. Application deletion can lead to change in assessment computation and execution planning for the workloads associated with the applications.
- The delete action cleans up the application resource and **ungroups the workloads** associated with this application.
- You can confirm to "delete" the applications to proceed. Note that this operation will permanently clean up the application resource and there's no way to retrieve it again.
- After deleting the applications, you can refresh the **Applications** view for the change to take effect.

## Next steps

- Build [Business case](how-to-build-a-business-case.md)
- Create [Application assessment](create-application-assessment.md)
