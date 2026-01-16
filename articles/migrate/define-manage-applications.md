---
title: Define and manage applications in Azure Migrate
description:  Learn how to define and manage applications in Azure Migrate for application centric migration planning and execution.
author: vikram1988
ms.author: vibansa
ms.manager: ronai
ms.service: azure-migrate
ms.topic: concept-article
ms.date: 08/28/2025
ms.custom:
  - engagement-fy25
  - sfi-image-nochange
# Customer intent: As an IT administrator, I want to define applications from servers and workloads I have discovered from my datacenter so that I can plan and execute migration of business applications with ease.
---

# Explore application inventory
This article describes how you can use Azure Migrate to define applications running in your datacenter by logically grouping servers and workloads as an application entity. These applications can be used to plan and execute the migrations more efficiently.

## Current limitations

- Defining applications using CSV import is currently not supported for projects set up with private endpoint connectivity.
- Updating application details and properties using CSV imported is currently not supported.


## Before you start

1. Ensure that you have an [Azure Migrate project](./create-manage-projects.md).
1. Review the requirements based on your environment and the appliance you're setting up to perform discovery of servers and workloads:


    |**Environment** | **Requirements**|
    |--- | --- |
    |Servers running in VMware environment | Review [VMware requirements](migrate-support-matrix-vmware.md#vmware-requirements) <br/> <br/> Review [appliance requirements](migrate-appliance.md#appliance---vmware)<br/> <br/> Review [port access requirements](migrate-support-matrix-vmware.md#port-access-requirements) <br/> <br/> Review [agentless dependency analysis requirements](migrate-support-matrix-vmware.md#dependency-analysis-requirements-agentless)|
    |Servers running in Hyper-V environment | Review [Hyper-V host requirements](migrate-support-matrix-hyper-v.md#hyper-v-host-requirements) <br/> <br/> Review [appliance requirements](migrate-appliance.md#appliance---hyper-v)<br/> <br/> <br/> Review [port access requirements](migrate-support-matrix-hyper-v.md#port-access)<br/>  <br/> <br/>Review [agentless dependency analysis requirements](migrate-support-matrix-hyper-v.md#dependency-analysis-requirements-agentless)|    
    |Physical servers or servers running on other clouds | Review [server requirements](migrate-support-matrix-physical.md#physical-server-requirements) <br/> <br/> Review [appliance requirements](migrate-appliance.md#appliance---physical)<br/> Review [port access requirements](migrate-support-matrix-physical.md#port-access)<br/> <br/> Review [agentless dependency analysis requirements](migrate-support-matrix-physical.md#dependency-analysis-requirements-agentless)|

1. Review the Azure URLs that the appliance needs to access in the [public](migrate-appliance.md#public-cloud-urls) and [government clouds](migrate-appliance.md#government-cloud-urls).


## Deploy and configure the Azure Migrate appliance

1. Deploy the Azure Migrate appliance to start discovery. To deploy the appliance, you can use the [deployment method](migrate-appliance.md#deployment-methods) as per your environment. After deploying the appliance, you need to register it with the project and configure it to initiate the discovery.
1. When you set up the appliance, provide the following details in the appliance configuration manager:
    - The details of the source environment (vCenter Servers/Hyper-V hosts or clusters/physical servers) which you want to discover.
    - Server credentials, which can be domain/ Windows (nondomain)/ Linux (nondomain) credentials. [Learn more](add-server-credentials.md) about how to provide credentials and how the appliance handles them.
 

### Add credentials and initiate discovery

1. Go to the appliance configuration manager, complete the prerequisite checks and registration of the appliance.

2. Go to the **Manage credentials and discovery sources** panel.

3. In **Step 1: Provide credentials for discovery source**, select on **Add credentials** to  provide credentials for the discovery source that the appliance uses to discover servers running in your environment.

4. In **Step 2: Provide discovery source details**, select **Add discovery source** to select the friendly name for credentials from the dropdown, specify the **IP address/FQDN** of the discovery source.


:::image type="content" source="./media/tutorial-discover-vmware/appliance-manage-sources.png" alt-text="The screenshot shows the panel 3 on appliance configuration manager for vCenter Server details." lightbox="./media/tutorial-discover-vmware/appliance-manage-sources.png":::

5. In **Step 3: Provide server credentials to perform guest discovery of installed software dependencies and workloads**, select **Add credentials** to provide multiple server credentials to perform guest-based discovery like software inventory, agentless dependency analysis, and discovery of databases and web applications.

6. Select on **Start discovery**, to initiate discovery.

After you initiate discovery, appliance performs the discovery of configuration and performance metadata of servers in your datacenter. This metadata discovery is followed by discovery of installed software, network dependencies and workloads such as databases and web applications. For gathering network dependencies between the servers, Azure Migrate automatically enables agentless dependency analysis on servers where the validation checks succeed.


## Review inventory & server dependencies

- After the completion of discovery, you can go to your Azure Migrate project and review all the discovered inventory in **All inventory** under **Explore inventory**. 
- You can review the collected dependency data in your project through **Dependency analysis** under **Explore applications**. Here you can visualize dependencies across all discovered servers in your Azure Migrate project. 
- The visualization shows logically spread server nodes with their connections, indicating their network affinity to help you identify applications running in your datacenter. [Learn more](how-to-create-group-machine-dependencies-agentless.md)
- You can **add or edit tags** on the servers, you identify to be part of the same application group. Tags can help you define application entity in the Azure Migrate project.

## Define applications

You can start defining the applications running in your datacenter. Here are the steps you can follow to get started:

1. You can either go to **Overview** and select **Define application** from the All inventory summary card or you can go to **Applications** under **Explore applications** and select **Define application** from there.
2. You can start in one of the two ways- select **Define application** if you want to define application through Portal or select **Import > Import applications** to import the application details at scale using a CSV file.

### Define new application

1. Select **New application**, start by providing basic details of an application like **Name**, **Description** and **Type**. You can choose to provide same name for the application as on-premises, add a description that helps the service understand about the application and choose between **Custom** or **Packaged** for application type. 

    >[!Note]
    > The type **Packaged** refers to the Commercial-off-the-shelf (COTS) applications you are running in your datacenter.

2. In the next step, you can link the workloads that are hosting this application. You can select **Link workloads** to go to the All inventory view, which helps you select the workloads that you want to add to this new application. 
3. You can scope the All inventory view by searching for specific workloads or filtering workloads by Category, Type, OS name etc. and **Add** the selected workloads.

    >[!Note]
    > The **Application** column in the All inventory view indicates if a workload has already been grouped as part of another application. A workload can be shared between multiple applications.

4. In the next step, you can specify properties associated with the application. Here are the properties you can add:

    **Property** | **Required** | **Description** | **Values**
    --- | --- | --- | ---
    Business criticality | Yes | Specify the criticality of the application to your business | Choose from **High**, **Medium**, **Low**
    Complexity | Yes | Specify the complexity in terms of workloads and dependencies | Choose from **High**, **Medium**, **Low**
    Publisher | No (Optional) | Specify the names of the publisher of application (Packaged) or its workloads (custom) | For example, **SAP** if it's a Packaged application or **Microsoft** if it's a Custom application running on .NET IIS web application and SQL database
    Technology stack | No (Optional) | Specify the technology used like runtimes, frameworks, languages etc. | For example, .NET, SQL, MySQL, Tomcat etc.

    >[!Note]
    > The **Properties** can help identify the application uniquely and can be used to filter and perform scoped migration planning for different types of applications.

5. After adding the properties, you can add **tags** to the application you are creating. You can use tags to group and visualize similar applications based on specific tags, such as environment, department, or datacenter etc.
6. In the final step, you can **review** the details of the application and proceed to **Create** the application.


### Import applications

If you want to define applications at scale, you can select **Import> Import applications** which opens a side pane where you can follow the steps.

1. You can define applications by adding the application names against the discovered servers and workloads in the prescribed template which is an export of all discovered inventory. 
2. You can select **Export all inventory** which downloads a CSV file with the details of all discovered inventory across servers, databases and web applications.
3. In the exported CSV, you can add names of the applications, a workload is a part of. You can add more than one name if the workload is shared amongst multiple applications. For instance, if a database- "SQLDB01" is shared by 2 applications, then you can add- "App01, App02" under Application name column in the same row.

    >[!Note]
    > The **Application names** are case-sensitive. You can add applications in multiple import operations but it is recommended to not trigger multiple import operations in parallel. 

4. After adding the application names to the file, you can browse and select the CSV file. 
5. If the selected file passes the validation checks, you can select **Import** to upload the details of the applications, as added in the CSV file.
6. After the import is complete, you can see the import status and review the **no of applications created** and check the **error** file if any failures occur. 

    >[!Note]
    > Currently, import applications only supports adding workloads to an application and not to removing any associated workloads from existing applications. To remove a workload, use the portal experience to review and edit the specific application.

### Import application properties
When the application is defined using import, a warning icon appears next to the application name to indicate that mandatory properties need to be updated. You can update these properties individually by selecting the application in the Applications view, or update them at scale using **Import> Import application properties**. 

1. You can update the properties of application(s) in the prescribed template, which is an export of applications inventory.
2. You can select **Export applications**, which downloads a CSV file with the details of all the applications you have defined so far using portal or import experiences.
3. In the exported CSV, you can add properties for applications that were defined through a CSV import. You can also edit the properties of applications that were defined using the portal experience.
4. You can use this CSV file to add or edit the Type, Description, and Tags associated with the application.

    >[!Note]
    > Don't edit the **App ARM ID** column in the CSV file. You can add application properties across multiple import operations but avoid triggering multiple imports in parallel.

5. After adding or editing application information in the CSV file, browse and select the updated CSV file.
6. If the file passes validation checks, select Import to upload the application details captured in the CSV file.
7. After the import completes, review the import status, the number of applications processed, and the error file if any failures occur.

## Review applications

After defining the applications, you can review the applications any time from the **Applications** view. 

- In the **Applications** view, the applications are sorted by their **Creation Time** so that the recently defined applications show on top of the table.
- You can use the prefiltered cards to switch between **Custom** and **Packaged** applications.
- In this view, you can see the application names with Type, Workloads (count), Properties and Tags. 
- You can scope the view using **search** or by applying **filter** on one or more application attributes.
- You can also select one or more applications to **Create assessment**, **Sync code changes**, **Add or edit tags** or **Delete** applications.


## Update applications

 You can select any application name to review and update the basic details, added workloads, properties or tags. Here are the steps you can follow:

1. After selecting an application, you are taken to the **Overview** of the application. Here you can **Sync code changes** for the application or **Edit** the basic details such as Description and Type of the application.
2. In the **Overview**, you can review the distribution of linked workloads by type and by OS support status. 
3. You can go to **Activity logs** from left menu to review the activities performed on the application.
4. You can review the **Workloads** to add or remove any workloads any time after the application was defined.
5. You can also review and update the **Properties** or **Tags** associated with the application.


## Delete applications

- You can select one or more applications from the **Applications** view to delete the unwanted applications.
- When you select **Delete**, a side pane opens with the names of applications you want to delete. 
- Before deleting the applications, you should ensure that they are not part of any Assessment or Migration Wave as that can lead to change in assessment computation and execution planning for the workloads associated with the applications.
- The delete action cleans up the application resource and **ungroups the workloads** associated with this application.
- You can confirm to "delete" the applications to proceed. Please note that this operation will permanently clean up the application resource and there is no way to retrieve it again.
- After deleting the applications, you can refresh the **Applications** view for the change to take effect.

## Next steps

- Build [Business case](how-to-build-a-business-case.md)
- Create [Application assessment](create-application-assessment.md)
