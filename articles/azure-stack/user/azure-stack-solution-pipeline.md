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
ms.date: 09/24/2018
ms.author: mabrigg
ms.reviewer: Anjay.Ajodha
---

# Tutorial: Deploy apps to Azure and Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Learn how to deploy an application to Azure and Azure Stack using a hybrid continuous integration/continuous delivery (CI/CD) pipeline.

In this tutorial, you'll create a sample environment to:

> [!div class="checklist"]
> * Initiate a new build based on code commits to your Azure DevOps Services repository.
> * Automatically deploy your app to global Azure for user acceptance testing.
> * When your code passes testing, automatically deploy the app to Azure Stack.

## Benefits of the hybrid delivery build pipe

Continuity, security, and reliability are key elements of application deployment. These elements are essential to your organization and critical to your development team. A hybrid CI/CD pipeline enables you to consolidate your build pipes across your on-premises environment and the public cloud. A hybrid delivery model also lets you change deployment locations without changing your application.

Other benefits to using the hybrid approach are:

* You can maintain a consistent set of development tools across your on-premises Azure Stack environment and the Azure public cloud.  A common tool set makes it easier to implement CI/CD patterns and practices.
* Apps and services deployed in Azure or Azure Stack are interchangeable and the same code can run in either location. You can take advantage of on-premises and public cloud features and capabilities.

To learn more about CI and CD:

* [What is Continuous Integration?](https://www.visualstudio.com/learn/what-is-continuous-integration/)
* [What is Continuous Delivery?](https://www.visualstudio.com/learn/what-is-continuous-delivery/)

> [!Tip]  
> ![hybrid-pillars.png](./media/azure-stack-solution-cloud-burst/hybrid-pillars.png)  
> Microsoft Azure Stack is an extension of Azure. Azure Stack brings the agility and innovation of cloud computing to your on-premises environment and enabling the only hybrid cloud that allows you to build and deploy hybrid apps anywhere.  
> 
> The whitepaper [Design Considerations for Hybrid Applications](https://aka.ms/hybrid-cloud-applications-pillars) reviews pillars of software quality (placement, scalability, availability, resiliency, manageability and security) for designing, deploying and operating hybrid applications. The design considerations assist in optimizing hybrid application design, minimizing challenges in production environments.

## Prerequisites

You need to have components in place to build a hybrid CI/CD pipeline. The following components will take time to prepare:

* An Azure OEM/hardware partner can deploy a production Azure Stack. All users can deploy the Azure Stack Development Kit (ASDK).
* An Azure Stack Operator must also: deploy the App Service, create plans and offers, create a tenant subscription, and add the Windows Server 2016 image.

>[!NOTE]
>If you already have some of these components deployed, make sure they meet the all the requirements before you start this tutorial.

This tutorial assumes that you have some basic knowledge of Azure and Azure Stack. To learn more before starting the tutorial, read the following articles:

* [Introduction to Azure](https://azure.microsoft.com/overview/what-is-azure/)
* [Azure Stack Key Concepts](https://docs.microsoft.com/azure/azure-stack/azure-stack-key-features)

### Azure requirements

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Create a [Web App](https://docs.microsoft.com/azure/app-service/app-service-web-overview) in Azure. Make note of the Web App URL, you need to use it in the tutorial.

### Azure Stack requirements

* Use an Azure Stack integrated system or deploy the Azure Stack Development Kit (ASDK). To deploy the ASDK:
    * The [Tutorial: deploy the ASDK using the installer](https://docs.microsoft.com/azure/azure-stack/asdk/asdk-deploy) gives detailed deployment instructions.
    * Use the [ConfigASDK.ps1](https://github.com/mattmcspirit/azurestack/blob/master/deployment/ConfigASDK.ps1 ) PowerShell script to automate ASDK post-deployment steps.

    > [!Note]
    > The ASDK installation takes approximately seven hours to complete, so plan accordingly.

 * Deploy [App Service](https://docs.microsoft.com/azure/azure-stack/azure-stack-app-service-deploy) PaaS services to Azure Stack.
 * Create [Plan/Offers](https://docs.microsoft.com/azure/azure-stack/azure-stack-plan-offer-quota-overview) in Azure Stack.
 * Create a [tenant subscription](https://docs.microsoft.com/azure/azure-stack/azure-stack-subscribe-plan-provision-vm) in Azure Stack.
 * Create a Web App in the tenant subscription. Make note of the new Web App URL for later use.
 * Deploy a Windows Server 2012 Virtual Machine in the tenant subscription. You will use this server as your build server and to run Azure DevOps Services.
* Provide a Windows Server 2016 image with .NET 3.5 for a virtual machine (VM). This VM will be built on your Azure Stack as a private build agent.

### Developer tool requirements

* Create an [Azure DevOps Services workspace](https://docs.microsoft.com/azure/devops/repos/tfvc/create-work-workspaces). The sign-up process creates a project named **MyFirstProject**.
* [Install Visual Studio 2017](https://docs.microsoft.com/visualstudio/install/install-visual-studio) and [sign-in to Azure DevOps Services](https://www.visualstudio.com/docs/setup-admin/team-services/connect-to-visual-studio-team-services).
* Connect to your project and [clone it locally](https://www.visualstudio.com/docs/git/gitquickstart).

 > [!Note]
 > Your Azure Stack environment needs the correct images syndicated to run Windows Server and SQL Server. It must also have App Service deployed.

## Prepare the private Azure Pipelines agent for Azure DevOps Services integration

### Prerequisites

Azure DevOps Services authenticates against Azure Resource Manager using a Service Principal. Azure DevOps Services must have the **Contributor** role to provision resources in an Azure Stack subscription.

The following steps describe what's required to configure authentication:

1. Create a Service Principal, or use an existing Service Principal.
2. Create Authentication keys for the Service Principal.
3. Validate the Azure Stack Subscription via Role-Based Access Control to allow the Service Principal Name (SPN) to be part of the Contributor’s role.
4. Create a new Service Definition in Azure DevOps Services using the Azure Stack endpoints and SPN information.

### Create a Service Principal

Refer to the [Service Principal Creation](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications) instructions to create a service principal. Choose **Web App/API** for the Application Type or [use the PowerShell script](https://github.com/Microsoft/vsts-rm-extensions/blob/master/TaskModules/powershell/Azure/SPNCreation.ps1#L5) as explained in the article [Create an Azure Resource Manager service connection with an existing service principal
](https://docs.microsoft.com/vsts/pipelines/library/connect-to-azure?view=vsts#create-an-azure-resource-manager-service-connection-with-an-existing-service-principal).

 > [!Note]  
 > If you use the script to create an Azure Stack Azure Resource Manager endpoint, you need to pass the **-azureStackManagementURL** parameter and **-environmentName** parameter. For example:  
> `-azureStackManagementURL https://management.local.azurestack.external -environmentName AzureStack`

### Create an access key

A Service Principal requires a key for authentication. Use the following steps to generate a key.

1. From **App registrations** in Azure Active Directory, select your application.

    ![Select the application](media\azure-stack-solution-hybrid-pipeline\000_01.png)

2. Make note of the value of **Application ID**. You will use that value when configuring the service endpoint in Azure DevOps Services.

    ![Application ID](media\azure-stack-solution-hybrid-pipeline\000_02.png)

3. To generate an authentication key, select **Settings**.

    ![Edit app settings](media\azure-stack-solution-hybrid-pipeline\000_03.png)

4. To generate an authentication key, select **Keys**.

    ![Configure key settings](media\azure-stack-solution-hybrid-pipeline\000_04.png)

5. Provide a description for the key, and set the duration of the key. When done, select **Save**.

    ![Key description and duration](media\azure-stack-solution-hybrid-pipeline\000_05.png)

    After you save the key, the key **VALUE** is displayed. Copy this value because you can't get this value later. You provide the **key value** with the application ID to sign in as the application. Store the key value where your application can retrieve it.

    ![Key VALUE](media\azure-stack-solution-hybrid-pipeline\000_06.png)

### Get the tenant ID

As part of the service endpoint configuration, Azure DevOps Services requires the **Tenant ID** that corresponds to the AAD Directory that your Azure Stack stamp is deployed to. Use the following steps to get the Tenant ID.

1. Select **Azure Active Directory**.

    ![Azure Active Directory for tenant](media\azure-stack-solution-hybrid-pipeline\000_07.png)

2. To get the tenant ID, select **Properties** for your Azure AD tenant.

    ![View tenant properties](media\azure-stack-solution-hybrid-pipeline\000_08.png)

3. Copy the **Directory ID**. This value is your tenant ID.

    ![Directory ID](media\azure-stack-solution-hybrid-pipeline\000_09.png)

### Grant the service principal rights to deploy resources in the Azure Stack subscription

To access resources in your subscription, you must assign the application to a role. Decide which role represents the best permissions for the application. To learn about the available roles, see [RBAC: Built in Roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles).

You can set the scope at the level of the subscription, resource group, or resource. Permissions are inherited to lower levels of scope. For example, adding an application to the Reader role for a resource group means it can read the resource group and any of its resources.

1. Navigate to the level of scope you wish to assign the application to. For example, to assign a role at the subscription scope, select **Subscriptions**.

    ![Select Subscriptions](media\azure-stack-solution-hybrid-pipeline\000_10.png)

2. In **Subscription**, select Visual Studio Enterprise.

    ![Visual Studio Enterprise](media\azure-stack-solution-hybrid-pipeline\000_11.png)

3. In Visual Studio Enterprise, select **Access Control (IAM)**.

    ![Access Control (IAM)](media\azure-stack-solution-hybrid-pipeline\000_12.png)

4. Select **Add**.

    ![Add](media\azure-stack-solution-hybrid-pipeline\000_13.png)

5. In **Add permissions**, select the role you that you want to assign to the application. In this example, the **Owner** role.

    ![Owner role](media\azure-stack-solution-hybrid-pipeline\000_14.png)

6. By default, Azure Active Directory applications aren't displayed in the available options. To find your application, you must provide its name in the **Select** field to search for it. Select the app.

    ![App search result](media\azure-stack-solution-hybrid-pipeline\000_16.png)

7. Select **Save** to finish assigning the role. You see your application in the list of users assigned to a role for that scope.

### Role-Based Access Control

‎Azure Role-Based Access Control (RBAC) provides fine-grained access management for Azure. By using RBAC, you can control the level of access that users need to do their jobs. For more information about Role-Based Access Control, see [Manage Access to Azure Subscription Resources](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal?toc=%252fazure%252factive-directory%252ftoc.json).

### Azure DevOps Services Agent Pools

Instead of managing each agent separately, you can organize agents into agent pools. An agent pool defines the sharing boundary for all agents in that pool. In Azure DevOps Services, agent pools are scoped to the Azure DevOps Services organization, which means that you can share an agent pool across projects. To learn more about agent pools, see [Create Agent Pools and Queues](https://docs.microsoft.com/azure/devops/pipelines/agents/pools-queues?view=vsts).

### Add a Personal Access Token (PAT) for Azure Stack

Create a Personal Access Token to access Azure DevOps Services.

1. Sign in to your Azure DevOps Services organization and select your organization profile name.

2. Select **Manage Security** to access token creation page.

    ![User sign-in](media\azure-stack-solution-hybrid-pipeline\000_17.png)

    ![Select a project](media\azure-stack-solution-hybrid-pipeline\000_18.png)

    ![Add Personal access token](media\azure-stack-solution-hybrid-pipeline\000_18a.png)

    ![Create token](media\azure-stack-solution-hybrid-pipeline\000_18b.png)

3. Copy the token.

    > [!Note]
    > Save the token information. This information isn't stored and won't be shown again when you leave the web page.

    ![Personal access token](media\azure-stack-solution-hybrid-pipeline\000_19.png)

### Install the Azure DevOps Services build agent on the Azure Stack hosted Build Server

1. Connect to your Build Server that you deployed on the Azure Stack host.
2. Download and Deploy the build agent as a service using your personal access token (PAT) and run as the VM Admin account.

    ![Download build agent](media\azure-stack-solution-hybrid-pipeline\010_downloadagent.png)

3. Navigate to the folder for the extracted build agent. Run the **config.cmd** file from an elevated command prompt.

    ![Extracted build agent](media\azure-stack-solution-hybrid-pipeline\000_20.png)

    ![Register build agent](media\azure-stack-solution-hybrid-pipeline\000_21.png)

4. When the config.cmd finishes, the build agent folder is updated with additional files. The folder with the extracted contents should look like the following:

    ![Build agent folder update](media\azure-stack-solution-hybrid-pipeline\009_token_file.png)

    You can see the agent in Azure DevOps Services folder.

## Endpoint creation permissions

By creating endpoints, a Visual Studio Online (VSTO) build can deploy Azure Service apps to Azure Stack. Azure DevOps Services connects to the build agent, which connects to Azure Stack.

![NorthwindCloud sample app in VSTO](media\azure-stack-solution-hybrid-pipeline\012_securityendpoints.png)

1. Sign in to VSTO and navigate to the app settings page.
2. On **Settings**, select **Security**.
3. In **Azure DevOps Services Groups**, select **Endpoint Creators**.

    ![NorthwindCloud Endpoint Creators](media\azure-stack-solution-hybrid-pipeline\013_endpoint_creators.png)

4. On the **Members** tab, select **Add**.

    ![Add a member](media\azure-stack-solution-hybrid-pipeline\014_members_tab.png)

5. In **Add users and groups**, enter a user name and select that user from the list of users.
6. Select **Save changes**.
7. In the **Azure DevOps Services Groups** list, select **Endpoint Administrators**.

    ![NorthwindCloud Endpoint Administrators](media\azure-stack-solution-hybrid-pipeline\015_save_endpoint.png)

8. On the **Members** tab, select **Add**.
9. In **Add users and groups**, enter a user name and select that user from the list of users.
10. Select **Save changes**.

Now that the endpoint information exists, the Azure DevOps Services to Azure Stack connection is ready to use. The build agent in Azure Stack gets instructions from Azure DevOps Services, and then the agent conveys endpoint information for communication with Azure Stack.
## Create an Azure Stack endpoint

You can follow the instructions in [Create an Azure Resource Manager service connection with an existing service principal
](https://docs.microsoft.com/vsts/pipelines/library/connect-to-azure?view=vsts#create-an-azure-resource-manager-service-connection-with-an-existing-service-principal) article to create a service connection with an existing service principal and use the following mapping:

- Environment: AzureStack
- Environment URL: Something like `https://management.local.azurestack.external`
- Subscription ID: User subscription ID from Azure Stack
- Subscription name: User subscription name from Azure Stack
- Service Principal client ID: The principal ID from [this](https://docs.microsoft.com/azure/azure-stack/user/azure-stack-solution-pipeline#create-a-service-principal) section in this article.
- Service Principal key: The key from the same article (or the password if you used the script).
- Tenant ID: The tenant ID you retrieve following the instruction at [Get the tenant ID](https://docs.microsoft.com/azure/azure-stack/user/azure-stack-solution-pipeline#get-the-tenant-id).

Now that the endpoint is created, the VSTS to Azure Stack connection is ready to use. The build agent in Azure Stack gets instructions from VSTS, and then the agent conveys endpoint information for communication with Azure Stack.

![Build agent](media\azure-stack-solution-hybrid-pipeline\016_save_changes.png)

## Develop your application build

In this part of the tutorial you'll:

* Add code to an Azure DevOps Services project.
* Create self-contained web app deployment.
* Configure the continuous deployment process

> [!Note]
 > Your Azure Stack environment needs the correct images syndicated to run Windows Server and SQL Server. It must also have App Service deployed. Review the App Service documentation "Prerequisites" section for Azure Stack Operator Requirements.

Hybrid CI/CD can apply to both application code and infrastructure code. Use [Azure Resource Manager templates like web ](https://azure.microsoft.com/resources/templates/) app code from Azure DevOps Services to deploy to both clouds.

### Add code to an Azure DevOps Services project

1. Sign in to Azure DevOps Services with an organization that has project creation rights on Azure Stack. The next screen capture shows how to connect to the HybridCICD project.

    ![Connect to a Project](media\azure-stack-solution-hybrid-pipeline\017_connect_to_project.png)

2. **Clone the repository** by creating and opening the default web app.

    ![Clone repository](media\azure-stack-solution-hybrid-pipeline\018_link_arm.png)

### Create self-contained web app deployment for App Services in both clouds

1. Edit the **WebApplication.csproj** file: Select **Runtimeidentifier** and then add `win10-x64.` For more information, see [Self-contained deployment](https://docs.microsoft.com/dotnet/core/deploying/#self-contained-deployments-scd) documentation.

    ![Configure Runtimeidentifier](media\azure-stack-solution-hybrid-pipeline\019_runtimeidentifer.png)

2. Use Team Explorer to check the code into Azure DevOps Services.

3. Confirm that the application code was checked into Azure DevOps Services.

### Create the build pipeline

1. Sign in to Azure DevOps Services with an organization that can create a build pipeline.

2. Navigate to the **Build Web Applicaiton** page for the project.

3. In **Arguments**, add **-r win10-x64** code. This is required to trigger a self-contained deployment with .Net Core.

    ![Add argument build pipeline](media\azure-stack-solution-hybrid-pipeline\020_publish_additions.png)

4. Run the build. The [self-contained deployment build](https://docs.microsoft.com/dotnet/core/deploying/#self-contained-deployments-scd) process will publish artifacts that can run on Azure and Azure Stack.

### Use an Azure hosted build agent

Using a hosted build agent in Azure DevOps Services is a convenient option for building and deploying web apps. Agent maintenance and upgrades are automatically performed by Microsoft Azure, which enables a continuous and uninterrupted development cycle.

### Configure the continuous deployment (CD) process

Azure DevOps Services and Team Foundation Server (TFS) provide a highly configurable and manageable pipeline for releases to multiple environments such as development, staging, quality assurance (QA), and production. This process can include requiring approvals at specific stages of the application life cycle.

### Create release pipeline

Creating a release pipeline is the final step in your application build process. This release pipeline is used to create a release and deploy a build.

1. Sign in to Azure DevOps Services and navigate to **Azure Pipelines** for your project.
2. On the **Releases** tab, select **\[ + ]**  and then pick **Create release definition**.

   ![Create release pipeline](media\azure-stack-solution-hybrid-pipeline\021a_releasedef.png)

3. On **Select a Template**, choose **Azure App Service Deployment**, and then select **Apply**.

    ![Apply template](media\azure-stack-solution-hybrid-pipeline\102.png)

4. On **Add artifact**, from the **Source (Build definition)** pull-down menu, select the Azure Cloud build app.

    ![Add artifact](media\azure-stack-solution-hybrid-pipeline\103.png)

5. On the **Pipeline** tab, select the **1 Phase**, **1 Task** link to **View environment tasks**.

    ![Pipeline view tasks](media\azure-stack-solution-hybrid-pipeline\104.png)

6. On the **Tasks** tab, enter Azure as the **Environment name** and select the AzureCloud Traders-Web EP from the **Azure subscription** drop-down list.

    ![Set environment variables](media\azure-stack-solution-hybrid-pipeline\105.png)

7. Enter the **Azure app service name**, which is "northwindtraders" in the next screen capture.

    ![App service name](media\azure-stack-solution-hybrid-pipeline\106.png)

8. For the Agent phase, select **Hosted VS2017** from the **Agent queue** drop-down list.

    ![Hosted agent](media\azure-stack-solution-hybrid-pipeline\107.png)

9. In **Deploy Azure App Service**, select the valid **Package or folder** for the environment.

    ![Select package or folder](media\azure-stack-solution-hybrid-pipeline\108.png)

10. In **Select File or Folder**, select **OK** to **Location**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\109.png)

11. Save all changes and go back to **Pipeline**.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\110.png)

12. On the **Pipeline** tab, select **Add artifact**, and choose the **NorthwindCloud Traders-Vessel** from the **Source (Build Definition)** drop-down list.

    ![Add new artifact](media\azure-stack-solution-hybrid-pipeline\111.png)

13. On **Select a Template**, add another environment. Pick **Azure App Service Deployment** and then select **Apply**.

    ![Select template](media\azure-stack-solution-hybrid-pipeline\112.png)

14. Enter "Azure Stack" as the **Environment name**.

    ![Environment name](media\azure-stack-solution-hybrid-pipeline\113.png)

15. On the **Tasks** tab, find and select Azure Stack.

    ![Azure Stack environment](media\azure-stack-solution-hybrid-pipeline\114.png)

16. From the **Azure subscription** drop-down list, select  "AzureStack Traders-Vessel EP" for the Azure Stack endpoint.

    ![Alt Text](media\azure-stack-solution-hybrid-pipeline\115.png)

17. Enter the Azure Stack web app name as the **App service name**.

    ![App service name](media\azure-stack-solution-hybrid-pipeline\116.png)

18. Under **Agent selection**, pick "AzureStack -bDouglas Fir" from the **Agent queue** drop-down list.

    ![Pick agent](media\azure-stack-solution-hybrid-pipeline\117.png)

19. For **Deploy Azure App Service**, select the valid **Package or folder** for the environment. On **Select File Or Folder**, select **OK** for the folder **Location**.

    ![Pick package or folder](media\azure-stack-solution-hybrid-pipeline\118.png)

    ![Approve location](media\azure-stack-solution-hybrid-pipeline\119.png)

20. On the **Variable** tab, find the variable named **VSTS_ARM_REST_IGNORE_SSL_ERRORS**. Set the variable value to **true**, and set its scope to **Azure Stack**.

    ![Configure variable](media\azure-stack-solution-hybrid-pipeline\120.png)

21. On the **Pipeline** tab, select the **Continuous deployment trigger** icon for the NorthwindCloud Traders-Web artifact and set the **Continuous deployment trigger** to **Enabled**.  Do the same thing for the "NorthwindCloud Traders-Vessel" artifact.

    ![Set continuous deployment trigger](media\azure-stack-solution-hybrid-pipeline\121.png)

22. For the Azure Stack environment, select the **Pre-deployment conditions** icon set the trigger to **After release**.

    ![Set pre-deployment conditions trigger](media\azure-stack-solution-hybrid-pipeline\122.png)

23. Save all your changes.

> [!Note]
> Some settings for release tasks may have been automatically defined as [environment variables](https://docs.microsoft.com/azure/devops/pipelines/release/variables?view=vsts#custom-variables) when you created a release pipeline from a template. These settings can't be modified in the task settings. However, you can edit these settings in the parent environment items.

## Create a release

Now that you have completed the modifications to the release pipeline, it's time to start the deployment. To do this, you create a release from the release pipeline. A release may be created automatically; for example, the continuous deployment trigger is set in the release pipeline. This means that modifying the source code will start a new build and, from that, a new release. However, in this section you will create a new release manually.

1. On the **Pipeline** tab, open the **Release** drop-down list and choose **Create release**.

    ![Create a release](media\azure-stack-solution-hybrid-pipeline\200.png)

2. Enter a description for the release, check to see that the correct artifacts are selected, and then choose **Create**. After a few moments, a banner appears indicating that the new release was created, and the release name is displayed as a link. Choose the link to see the release summary page.

    ![Release creation banner](media\azure-stack-solution-hybrid-pipeline\201.png)

3. The release summary page for shows details about the release. In the following screen capture for "Release-2", the **Environments** section shows the **Deployment status** for the Azure as "IN PROGRESS", and the status for Azure Stack is "SUCCEEDED". When the deployment status for the Azure environment changes to "SUCCEEDED", a banner appears indicating that the release is ready for approval. When a deployment is pending or has failed, a blue **(i)** information icon is shown. Hover over the icon to see a pop-up that contains the reason for delay or failure.

    ![Release summary page](media\azure-stack-solution-hybrid-pipeline\202.png)

Other views, such as the list of releases, will also display an icon that indicates approval is pending. The pop-up for this icon shows the environment name and more details related to the deployment. It's easy for an administrator see the overall progress of releases and see which releases are waiting for approval.

### Monitor and track deployments

This section shows how you can monitor and track all your deployments. The release for deploying the two Azure App Services websites provides a good example.

1. On the "Release-2" summary page, select **Logs**. During a deployment, this page shows the live log from the agent. The left pane shows the status of each operation in the deployment for each environment.

    You can choose a person icon in the **Action** column for a Pre-deployment or Post-deployment approval to see who approved (or rejected) the deployment, and the message they provided.

2. After the deployment finishes, the entire log file is displayed in the right pane. You can select any **Step** in the left pane to see the log file for a single step, such as "Initialize Job". The ability to see individual logs makes it easier to trace and debug  parts of the overall deployment. You can also **Save** the log file for a step, or **Download all logs as zip**.

    ![Release logs](media\azure-stack-solution-hybrid-pipeline\203.png)

3. Open the **Summary** tab to see general information about the release. This view shows details about the build, the environments it was deployed to, deployment status, and other information about the release.

4. Select an environment link (**Azure** or **Azure Stack**) to see information about existing and pending deployments to a specific environment. You can use these views as a quick way to verify that the same build was deployed to both environments.

5. Open the **deployed production app** in your browser. For example, for the Azure App Services website, open the URL `http://[your-app-name].azurewebsites.net`.

## Next steps

* To learn more about Azure Cloud Patterns, see [Cloud Design Patterns](https://docs.microsoft.com/azure/architecture/patterns).
