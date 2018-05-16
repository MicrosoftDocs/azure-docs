---
title: Deploy your app to Azure and Azure Stack | Microsoft Docs
description: Learn how to deploy apps to Azure and Azure Stack with a hybrid CI/CD pipeline.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 05/07/2018
ms.author: mabrigg
ms.reviewer: Anjay.Ajodha
---

# Tutorial: Deploy apps to Azure and Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

A hybrid continuous integration/continuous delivery (CI/CD) pipeline enables you to build, test, and deploy your app to multiple clouds.  In this tutorial, you will build a sample environment to:
 
> [!div class="checklist"]
> * Initiate a new build based on code commits to your Visual Studio Team Services (VSTS) repository.
> * Automatically deploy your newly built code to global Azure for user acceptance testing.
> * Once your code has passed testing, automatically deploy to Azure Stack.

### About the hybrid delivery build pipe

Application deployment continuity, security, and reliability is essential to your organization and critical to your development team. With a hybrid CI/CD pipeline, you can consolidate your pipelines across your on-premises environment and the public cloud. You can change location without switching your application.

This approach also allows you to maintain a consistent set of development tools. Consistent tools across the Azure public cloud and your on-premises Azure Stack environment means that it's far easier for you to implement CI/CD dev practice. Apps and services deployed in Azure or Azure Stack are interchangeable and the same code can run in either location, taking advantage of on-premises and public cloud features and capabilities.

Learn more about:
 - [What is Continuous Integration?](https://www.visualstudio.com/learn/what-is-continuous-integration/)
 - [What is Continuous Delivery?](https://www.visualstudio.com/learn/what-is-continuous-delivery/)


## Prerequisites

You will need to have a few components in place to build  a hybrid CI/CD pipeline. They can take some time to prepare.
 
 - An Azure OEM/hardware partner may deploy a production Azure Stack and all users may deploy an Azure Stack Development Kit (ASDK). 
 - An Azure Stack Operator must also deploy the App Service, create plans and offers, create a tenant subscription, and add the Windows Server 2016 image.

If you already have some of these components, make sure they meet the requirements before beginning.

This topic also assumes that you have some knowledge of Azure and Azure Stack. If you want to learn more before proceeding, be sure to start with these topics:


This tutorial also assumes that you have some knowledge of Azure and Azure Stack. 

If you want to learn more before proceeding, you can start with these topics:
 - [Introduction to Azure](https://azure.microsoft.com/overview/what-is-azure/)
 - [Azure Stack Key Concepts](https://docs.microsoft.com/azure/azure-stack/azure-stack-key-features)

### Azure

 - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

 - Create a [Web App](https://docs.microsoft.com/azure/app-service/app-service-web-overview) in Azure. Make note of the new Web App URL, as it is used later.

Azure Stack
 - Use an Azure Stack integrated system or deploy Azure Stack Development Kit (ASDK) linked below:
    - You can find detailed instructions about deploying the ASDK at "[Tutorial: deploy the ASDK using the installer](https://docs.microsoft.com/azure/azure-stack/asdk/asdk-deploy)"
    - You can automate many of your ASDK post-deployment steps with the following PowerShell script, [ConfigASDK.ps1](https://github.com/mattmcspirit/azurestack/blob/master/deployment/ConfigASDK.ps1 ).

    > [!Note]  
    > The ASDK installation takes a seven hours to complete, so plan accordingly.

 - Deploy [App Service](https://docs.microsoft.com/azure/azure-stack/azure-stack-app-service-deploy) PaaS services to Azure Stack. 
 - Create [Plan/Offers](https://docs.microsoft.com/azure/azure-stack/azure-stack-plan-offer-quota-overview) within the Azure Stack environment. 
 - Create [tenant subscription](https://docs.microsoft.com/azure/azure-stack/azure-stack-subscribe-plan-provision-vm) within the Azure Stack environment. 
 - Create a Web App within the tenant subscription. Make note of the new Web App URL for later use.
 - Deploy VSTS Virtual Machine, still within the tenant subscription.
 - Windows Server 2016 VM with .NET 3.5 required. This VM will be built on your Azure Stack as the private build agent. 

### Developer tools

 - Create a [VSTS workspace](https://www.visualstudio.com/docs/setup-admin/team-services/sign-up-for-visual-studio-team-services). The sign-up process creates a project named **MyFirstProject**.
 - [Install Visual Studio 2017](https://docs.microsoft.com/visualstudio/install/install-visual-studio) and [sign-in to VSTS](https://www.visualstudio.com/docs/setup-admin/team-services/connect-to-visual-studio-team-services).
 - Connect to the project and [clone locally](https://www.visualstudio.com/docs/git/gitquickstart).
 
 > [!Note]  
 > You will need Azure Stack with proper images syndicated to run (Windows Server and SQL) and have App Service deployed.
 
## Prepare the private build and release agent for Visual Studio Team Services integration

### Prerequisites

Visual Studio Team Services (VSTS) authenticates against Azure Resource Manager using a Service Principal. For VSTS to be able to provision resources in an Azure Stack subscription, it requires Contributor status.

The following are the high-level steps that need to be configured to enable such authentication:

1. Service Principal should be created or an existing one may be used.
2. Authentication keys need to be created for the Service Principal.
3. Azure Stack Subscription needs to be validated via Role-Based Access Control to allow the SPN be part of the Contributor’s role.
4. A new Service Definition in VSTS must be created using the Azure Stack endpoints as well as SPN information.

### Service principal creation

Refer to the [Service Principal Creation](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications) instructions to create a service principal, and choose Web App/API for the Application Type.

### Access key creation

A Service Principal requires a key for authentication, follow the steps in this section to generate a key.


1. From **App registrations** in Azure Active Directory, select your application.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_01.png)

2.	Make note of the value of **Application ID**. You will use that value when configuring the service endpoint in VSTS.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_02.png)

3. To generate an authentication key, select **Settings**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_03.png)

4. To generate an authentication key, select **Keys**.
 
    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_04.png)

5. Provide a description of the key, and a duration for the key. When done, select **Save**.
 
    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_05.png)

    After saving the key, the value of the key is displayed. Copy this value because you are not able to retrieve the key later. You provide the **key value** with the application ID to log in as the application. Store the key value where your application can retrieve it.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_06.png)

### Get tenant ID

As part of the service endpoint configuration, VSTS requires the **Tenant ID** that corresponds to the AAD Directory that your Azure Stack stamp was deployed to. Follow the steps in this section to gather the Tenant Id.

1. Select **Azure Active Directory**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_07.png)

2. To get the tenant ID, select **Properties** for your Azure AD tenant.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_08.png)
 
3. Copy the **Directory ID**. This value is your tenant ID.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_09.png)

### Grant the service principal rights to deploy resources in the Azure Stack subscription 

To access resources in your subscription, you must assign the application to a role. Decide which role represents the right permissions for the application. To learn about the available roles, see [RBAC: Built in Roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles).

You can set the scope at the level of the subscription, resource group, or resource. Permissions are inherited to lower levels of scope. For example, adding an application to the Reader role for a resource group means it can read the resource group and any resources it contains.

1. Navigate to the level of scope you wish to assign the application to. For example, to assign a role at the subscription scope, select **Subscriptions**. You could instead select a resource group or resource.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_10.png)

2. Select the **subscription** (resource group or resource) to assign the application to.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_11.png)

3. Select **Access Control (IAM)**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_12.png)

4. Select **Add**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_13.png)

5. Select the role you wish to assign to the application. The following image shows the **Owner** role.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_14.png)

6. By default, Azure Active Directory applications aren't displayed in the available options. To find your application, you must **provide the name** in the search field. Select it.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_16.png)

7. Select **Save** to finish assigning the role. You see your application in the list of users assigned to a role for that scope.

### Role-Based Access Control

‎Azure Role-Based Access Control (RBAC) enables fine-grained access management for Azure. Using RBAC, you can grant only the amount of access that users need to perform their jobs. For more information about Role-Based Access Control, see [Manage Access to Azure Subscription Resources](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal?toc=%252fazure%252factive-directory%252ftoc.json).

### VSTS Agent Pools

Instead of managing each agent individually, you organize agents into agent pools. An agent pool defines the sharing boundary for all agents in that pool. In VSTS, agent pools are scoped to the VSTS account; so you can share an agent pool across team projects. For more information and a tutorial on how to create VSTS agent pools, see [Create Agent Pools and Queues](https://docs.microsoft.com/vsts/build-release/concepts/agents/pools-queues?view=vsts).

### Add a Personal access token (PAT) for Azure Stack

1. Sign in to your VSTS account and select your account profile name.
2. Select **Manage Security** to access token creation page.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_17.png)

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_18.png)

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_18a.png)

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_18b.png)

3. Copy the token.
    
    > [!Note]  
    > Obtain the token information. It will not be shown again after leaving this screen. 
    
    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_19.png)
    

### Install the VSTS build agent on the Azure Stack hosted Build Server

1.	Connect to your Build Server that you deployed on the Azure Stack host.

2.	Download and Deploy the build agent as a service using your personal access token (PAT) and run as the VM Admin account.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\010_downloadagent.png)

3. Go to extracted build agent folder. Run the **run.cmd** file from an elevated command prompt. 

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_20.png)

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\000_21.png)

4.  After the run.cmd finished the folder with the extracted contents should look like the following:

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\009_token_file.png)

    You can now see the agent in VSTS folder.

## Endpoint creation permissions

Users can create endpoints so VSTO builds can deploy Azure Service apps to the stack. VSTS connects to the build agent, which then connects with Azure Stack. 

![Alt Text](media\azure-stack-solution-hybrid-pipeline\012_securityendpoints.png)

1. On the **Settings** menu, select **Security**.
2. In the **VSTS Groups** list on the left, select **Endpoint Creators**. 

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\013_endpoint_creators.png)

3. On the **Members** tab, select **+Add**. 

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\014_members_tab.png)

4. Type a user name and select that user from the list.
5. Click **Save changes**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\015_save_endpoint.png)

6. In the **VSTS Groups** list on the left, select **Endpoint Administrators**.
7. On the **Members** tab, select **+Add**.
8. Type a user name and select that user from the list.
9. Click **Save Changes**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\016_save_changes.png)

    The build agent in Azure Stack gains instructions from VSTS, which then conveys endpoint information for communication with the Azure Stack. 
    
    VSTS to Azure Stack connection is now ready.

## Develop your application

Set up hybrid CI/CD to deploy Web App to Azure and Azure Stack, and auto push changes to both clouds.

> [!Note]  
> You will need Azure Stack with proper images syndicated to run (Windows Server and SQL) and have App Service deployed. Review the App Service documentation "Prerequisites" section for Azure Stack Operator Requirements.

### Add code to VSTS project

1. Sign in to Visual Studio with an account that has project creation rights on Azure Stack.

    Hybrid CI/CD can apply to both application code and infrastructure code. Use [Azure Resource Manager templates like web ](https://azure.microsoft.com/resources/templates/) app code from VSTS to both clouds.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\017_connect_to_project.png)

2. **Clone the repository** by creating and opening the default web app.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\018_link_arm.png)

### Create self-contained web app deployment for App Services in both clouds

1. Edit the **WebApplication.csproj** file: Select **Runtimeidentifier** and add `win10-x64.` For more information, see [Self-contained deployment](https://docs.microsoft.com/dotnet/core/deploying/#self-contained-deployments-scd) documentation.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\019_runtimeidentifer.png)

2. Check the code into VSTS using Team Explorer.

3. Confirm that the application code has been checked into Visual Studio Team Services. 

### Create the build definition

1. Sign in to VSTS to confirm ability to create build definitions.

2. Add **-r win10-x64** code. This is necessary to trigger a self-contained deployment with .Net Core. 

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\020_publish_additions.png)

3. Run the build. The [self-contained deployment build](https://docs.microsoft.com/dotnet/core/deploying/#self-contained-deployments-scd) process will publish artifacts that can run on Azure and Azure Stack.

### Using an Azure Hosted Agent

Using a hosted agent in VSTS is a convenient option to build and deploy web apps. Maintenance and upgrades are automatically performed by Microsoft Azure, enabling continual, uninterrupted development, testing, and deployment.

### Manage and configure the Continuous Deployment (CD) process

Visual Studio Team Services (VSTS) and Team Foundation Server (TFS) provide a highly configurable and manageable pipeline for releases to multiple environments such as development, staging, QA, and production environments; including requiring approvals at specific stages.

### Create release definition

![Alt Text](media\azure-stack-solution-hybrid-pipeline\021a_releasedef.png)

1. Select the **\[ + ]** to add a new Release under the **Releases tab** in the Build and Release page of VSO.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\102.png)

2. Apply the **Azure App Service Deployment** template.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\103.png)

3. Under Add artifact pull-down menu, **add the artifact** for the Azure Cloud build app.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\104.png)

4. Under Pipeline tab, select the **Phase**, **Task** link of the environment and set the Azure cloud environment values.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\105.png)

5. Set the **environment name** and select Azure **Subscription** for the Azure Cloud endpoint.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\106.png)

6. Under Environment name, set the required **Azure app service name**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\107.png)

7. Enter **Hosted VS2017** under Agent queue for Azure cloud hosted environment.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\108.png)

8. In Deploy Azure App Service menu, select the valid **Package or Folder** for the environment. Select **OK** to **folder location**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\109.png)

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\110.png)

9. Save all changes and go back to **release pipeline**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\111.png)

10. Add a **new artifact** selecting the build for the Azure Stack app.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\112.png)

11. Add one more environment applying the **Azure App Service Deployment**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\113.png)

12. Name the new environment **Azure Stack**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\114.png)

13. Find the Azure Stack environment under **Task** tab.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\115.png)

14. Select the **subscription** for the Azure Stack endpoint.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\116.png)

15. Set the Azure Stack web app name as the **App service name**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\117.png)

16. Select the **Azure Stack agent**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\118.png)

17. Under the Deploy Azure App Service section select the valid **Package or Folder** for the environment. Select OK to **folder location**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\119.png)

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\120.png)

18. Under Variable tab add a variable named **VSTS_ARM_REST_IGNORE_SSL_ERRORS**, set its value as **true**, and scope to **Azure Stack**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\121.png)

19. Select the **Continuous** deployment trigger icon in both artifacts and enable the Continues deployment trigger.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\122.png)

20. Select the **Pre-deployment** conditions icon in the azure stack environment and set the trigger to **After release**.

21. Save all changes.

> [!Note]  
> Some settings for the tasks may have been automatically defined as [environment variables](https://docs.microsoft.com/vsts/build-release/concepts/definitions/release/variables?view=vsts#custom-variables) when you created a release definition from a template. These settings cannot be modified in the task settings; instead you must select the parent environment item to edit these settings.

## Create a release

Now that you have completed the modifications to the release definition, it's time to start the deployment. To do this, you create a release from the release definition. A release may be created automatically; for example, the continuous deployment trigger is set in the release definition. This means that modifying the source code will start a new build and, from that, a new release. However, in this section you will create a new release manually.

1. Open the **Release** drop-down list and choose **Create release**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\200.png)
 
2. Enter a description for the release, check that the correct artifacts are selected, and then choose **Create**. After a few moments, a banner appears indicating that the new release was created. Choose the link (the name of the release).

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\201.png)
 
3. The release summary page opens showing details of the release. In the **Environments** section, you will see the deployment status for the "QA" environment change from "IN PROGRESS" to "SUCCEEDED" and, at that point, a banner appears indicating that the release is now waiting for approval. When a deployment to an environment is pending or has failed, a blue (i) information icon is shown. Point to this to see a pop-up containing the reason.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\202.png)

Other views, such as the list of releases, also display an icon that indicates approval is pending. The icon shows a pop-up containing the environment name and more details when you point to it. This makes it easy for an administrator to see which releases are awaiting approval, as well as the overall progress of all releases.

### Monitor and track deployments

In this section, you will see how you can monitor and track deployments - in this example to two Azure App Services websites - from the release you created in the previous section.

1. In the release summary page, choose the **Logs** link. While the deployment is taking place, this page shows the live log from the agent and, in the left pane, an indication of the status of each operation in the deployment process for each environment.

    Choose the icon in the **Action** column for a pre-deployment or post-deployment approval to see details of who approved (or rejected) the deployment, and the message that user provided.

2. After the deployment is complete, the entire log file is displayed in the right pane. Select any of the **process steps** in the left pane to show just the log file contents for that step. This makes it easier to trace and debug individual parts of the overall deployment. Alternatively, download the individual log files, or a zip of all the log files, from the icons and links in the page.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\203.png)
 
3. Open the **Summary** tab to see the overall detail of the release. It shows details of the build and the environments it was deployed to - along with the deployment status and other information about the release.

4. Select each of the **environment links** to see more details about existing and pending deployments to that specific environment. You can use these pages to verify that the same build was deployed to both environments.

5. Open the **deployed production app** in your browse. For example, for an Azure App Services website, from the URL `http://[your-app-name].azurewebsites.net`.

## Next steps

- To learn more about Azure Cloud Patterns, see [Cloud Design Patterns](https://docs.microsoft.com/azure/architecture/patterns).
