---
title: Create cross-cloud scaling solutions with Azure | Microsoft Docs
description: Learn how to create cross-cloud scaling solutions with Azure.
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

# Tutorial: Create cross-cloud scaling solutions with Azure

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Learn how to create a cross-cloud solution to provide a manually triggered process for switching from an Azure Stack hosted web app, to an Azure hosted web app with auto-scaling via traffic manager, ensuring flexible and scalable cloud utility when under load.

With this pattern, your tenant may not be ready to run your application in the public cloud. However, it may not be economically feasible for the business to maintain the capacity required in their on-premises environment to handle spikes in demand for the app. Your tenant can take use the elasticity of the public cloud with their on-premises solution.

In this tutorial, you will build a sample environment to:

> [!div class="checklist"]
> - Create a multi-node web application.
> - Configure and manage the Continuous Deployment (CD) process.
> - Publish the web app to Azure Stack.
> - Create a release.
> - Learn to monitor and track your deployments.

> [!Tip]  
> ![hybrid-pillars.png](./media/azure-stack-solution-cloud-burst/hybrid-pillars.png)  
> Microsoft Azure Stack is an extension of Azure. Azure Stack brings the agility and innovation of cloud computing to your on-premises environment and enabling the only hybrid cloud that allows you to build and deploy hybrid apps anywhere.  
> 
> The whitepaper [Design Considerations for Hybrid Applications](https://aka.ms/hybrid-cloud-applications-pillars) reviews pillars of software quality (placement, scalability, availability, resiliency, manageability and security) for designing, deploying, and operating hybrid applications. The design considerations assist in optimizing hybrid application design, minimizing challenges in production environments.

## Prerequisites

-   Azure subscription. If needed, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before beginning.

- An Azure Stack Integrated System or deployment of Azure Stack Development Kit.
    - You find instructions for installing Azure Stack at [Install the Azure Stack Development Kit](/articles/azure-stack/asdk/asdk-install).
    - [https://github.com/mattmcspirit/azurestack/blob/master/deployment/ConfigASDK.ps1](https://github.com/mattmcspirit/azurestack/blob/master/deployment/ConfigASDK.ps1) This installation may require a few hours to complete.

-   Deploy [App Service](https://docs.microsoft.com/azure/azure-stack/azure-stack-app-service-deploy) PaaS services to Azure Stack.

-   [Create Plan/Offers](https://docs.microsoft.com/azure/azure-stack/azure-stack-plan-offer-quota-overview) within the Azure Stack environment.

-   [Create tenant subscription](https://docs.microsoft.com/azure/azure-stack/azure-stack-subscribe-plan-provision-vm) within the Azure Stack environment.

-   Create a Web App within the tenant subscription. Make note of the new Web App URL for later use.

-   Deploy VSTS Virtual Machine within the tenant subscription.

-   Windows Server 2016 VM with .NET 3.5 required. This VM will be built in the tenant subscription on Azure Stack as the private build agent.

-   [Windows Server 2016 with SQL 2017 VM Image](https://docs.microsoft.com/azure/azure-stack/azure-stack-add-vm-image#add-a-vm-image-through-the-portal) is available in the Azure Stack Marketplace. If this image is not available, work with an Azure Stack Operator to ensure it is added to the environment.

## Issues and considerations

### Scalability considerations

The key component of cross-cloud Scaling is the ability to deliver immediate, on-demand scaling between public and on-premises cloud infrastructure, proving consistent, reliable service as prescribed by the demand.

### Availability considerations

Ensure locally deployed apps are configured for high-availability through on-premises hardware configuration and software deployment.

### Manageability considerations

The cross-cloud solution ensures seamless management and familiar interface between environments. PowerShell is recommended for cross-platform management.

## Cross-cloud scaling

### Obtain a custom domain and configure DNS

Update the DNS zone file for the domain. Azure AD will verify ownership of the custom domain name. Use [Azure DNS](https://docs.microsoft.com/azure/dns/dns-getstarted-portal) for Azure/Office 365/external DNS records within Azure, or add the DNS entry at [a different DNS registrar](https://support.office.com/article/Create-DNS-records-for-Office-365-when-you-manage-your-DNS-records-b0f3fdca-8a80-4e8e-9ef3-61e8a2a9ab23/).

1.  Register a custom domain with a public Registrar.

2.  Sign in to the domain name registrar for the domain. An approved admin may be required to make DNS updates. 

3.  Update the DNS zone file for the domain by adding the DNS entry provided by Azure AD. (The DNS entry will not affect mail routing or web hosting behaviors.) 

### Create a default multi-node web app in Azure Stack

Set up hybrid continuous integration and continuous deployment (CI/CD) to deploy Web App to Azure and Azure Stack, and auto push changes to both clouds.

> [!Note]  
> Azure Stack with proper images syndicated to run (Windows Server and SQL) and App Service deployment are required. Review the App Service documentation "[Before you get started with App Service on Azure Stack](/articles/azure-stack/azure-stack-app-service-before-you-get-started)" section for Azure Stack Operator.

### Add Code to Visual Studio Team Services Project

1. Sign in to Visual Studio Team Services (VSTS) with an account that has project creation rights on VSTS~~.~~

    Hybrid CI/CD can apply to both application code and infrastructure code. Use [Azure Resource Manager templates](https://azure.microsoft.com/resources/templates/) for both private and hosted cloud development.

    ![Alt text](media\azure-stack-solution-cloud-burst\image1.JPG)

2. **Clone the repository** by creating and opening the default web app.

    ![Alt text](media\azure-stack-solution-cloud-burst\image2.png)

### Create self-contained web app deployment for App Services in both clouds

1.  Edit the **WebApplication.csproj** file. Select **Runtimeidentifier** and add **win10-x64**. (See [Self-contained Deployment](https://docs.microsoft.com/dotnet/core/deploying/#self-contained-deployments-scd) documentation.) 

    ![Alt text](media\azure-stack-solution-cloud-burst\image3.png)

2.  Check in the code to VSTS using Team Explorer.

3.  Confirm that the application code has been checked into Visual Studio Team Services.

## Create the build definition

1. Log into VSTS to confirm ability to create build definitions.

2. Add **-r win10-x64** code. This is necessary to trigger a self-contained deployment with .Net Core.

    ![Alt text](media\azure-stack-solution-cloud-burst\image4.png)

3. Run the build. The [self-contained deployment build](https://docs.microsoft.com/dotnet/core/deploying/#self-contained-deployments-scd) process will publish artifacts that can run on Azure and Azure Stack.

## Use an Azure hosted agent

Use a hosted agent in VSTS is a convenient option to build and deploy web apps. Maintenance and upgrades are automatically performed by Microsoft Azure, enabling continual, uninterrupted development, testing, and deployment.

### Manage and configure the CD process

Visual Studio Team Services and Team Foundation Server (TFS) provide a highly configurable and manageable pipeline for releases to multiple environments such as development, staging, QA, and production environments; including requiring approvals at specific stages.

## Create release definition

![Alt text](media\azure-stack-solution-cloud-burst\image5.png)

1.  Select the **plus** button to add a new Release under the **Releases tab** in the Build and Release page of VSO.

    ![Alt text](media\azure-stack-solution-cloud-burst\image6.png)

2. Apply the Azure App Service Deployment template.

    ![Alt text](media\azure-stack-solution-cloud-burst\image7.png)

3. Under Add artifact, add the artifact for the Azure Cloud build app.

    ![Alt text](media\azure-stack-solution-cloud-burst\image8.png)

4. Under Pipeline tab, Select the **Phase, Task** link of the environment and set the Azure cloud environment values.

    ![Alt text](media\azure-stack-solution-cloud-burst\image9.png)

5. Set the **environment name** and select Azure **Subscription** for the Azure Cloud endpoint.

    ![Alt text](media\azure-stack-solution-cloud-burst\image10.png)

6. Under Environment name, set the required **Azure app service name**.

    ![Alt text](media\azure-stack-solution-cloud-burst\image11.png)

7. Enter **Hosted VS2017** under Agent queue for Azure cloud hosted environment.

    ![Alt text](media\azure-stack-solution-cloud-burst\image12.png)

8. In Deploy Azure App Service menu, select the valid **Package or Folder** for the environment. Select **OK** to **folder location**.

    ![Alt text](media\azure-stack-solution-cloud-burst\image13.png)

    ![Alt text](media\azure-stack-solution-cloud-burst\image14.png)

9. Save all changes and go back to **release pipeline**.

    ![Alt text](media\azure-stack-solution-cloud-burst\image15.png)

10. Add a new artifact selecting the build for the Azure Stack app.

    ![Alt text](media\azure-stack-solution-cloud-burst\image16.png)

11. Add one more environment applying the Azure App Service Deployment.

    ![Alt text](media\azure-stack-solution-cloud-burst\image17.png)

12. Name the new environment Azure Stack.

    ![Alt text](media\azure-stack-solution-cloud-burst\image18.png)

13. Find the Azure Stack environment under **Task** tab.

    ![Alt text](media\azure-stack-solution-cloud-burst\image19.png)

14. Select the subscription for the Azure Stack endpoint.

    ![Alt text](media\azure-stack-solution-cloud-burst\image20.png)

15. Set the Azure Stack web app name as the App service name.

    ![Alt text](media\azure-stack-solution-cloud-burst\image21.png)

16. Select the Azure Stack agent.

    ![Alt text](media\azure-stack-solution-cloud-burst\image22.png)

17. Under the Deploy Azure App Service section select the valid **Package or Folder** for the environment. Select **OK** to folder location.

    ![Alt text](media\azure-stack-solution-cloud-burst\image23.png)

    ![Alt text](media\azure-stack-solution-cloud-burst\image24.png)

18. Under Variable tab add a variable named `VSTS\_ARM\_REST\_IGNORE\_SSL\_ERRORS`, set its value as **true**, and scope to Azure Stack.

    ![Alt text](media\azure-stack-solution-cloud-burst\image25.png)

19. Select the **Continuous** deployment trigger icon in both artifacts and enable the **Continues** deployment trigger.

    ![Alt text](media\azure-stack-solution-cloud-burst\image26.png)

20. Select the **Pre-deployment** conditions icon in the Azure Stack environment and set the trigger to **After release.**

21. Save all changes.

> [!Note]  
> Some settings for the tasks may have been automatically defined as [environment variables](https://docs.microsoft.com/vsts/build-release/concepts/definitions/release/variables?view=vsts#custom-variables) when creating a release definition from a template. These settings cannot be modified in the task settings; instead, the parent environment item must be selected to edit these settings

## Publish to Azure Stack via Visual Studio

By creating endpoints, a Visual Studio Online (VSTO) build can deploy Azure Service apps to Azure Stack. VSTS connects to the build agent, which connects to Azure Stack.

1.  Sign in to VSTO and navigate to the app settings page.

2.  On **Settings**, select **Security**.

3.  In **VSTS Groups**, select **Endpoint Creators**.

4.  On the **Members** tab, select **Add**.

5.  In **Add users and groups**, enter a user name and select that user from the list of users.

6.  Select **Save changes**.

7.  In the **VSTS Groups** list, select **Endpoint Administrators**.

8.  On the **Members** tab, select **Add**.

9.  In **Add users and groups**, enter a user name and select that user from the list of users.

10. Select **Save changes**.

Now that the endpoint information exists, the VSTS to Azure Stack connection is ready to use. The build agent in Azure Stack gets instructions from VSTS, and then the agent conveys endpoint information for communication with Azure Stack.

## Develop the application build

> [!Note]  
> Azure Stack with proper images syndicated to run (Windows Server and SQL) and App Service deployment are required. Review the App Service documentation "[Before you get started with App Service on Azure Stack](/articles/azure-stack/azure-stack-app-service-before-you-get-started)" section for Azure Stack Operator.

Use [Azure Resource Manager templates like web](https://azure.microsoft.com/resources/templates/) app code from VSTS to deploy to both clouds.

### Add code to a VSTS project

1.  Sign in to VSTS with an account that has project creation rights on Azure Stack. The next screen capture shows how to connect to the HybridCICD project.

2.  **Clone the repository** by creating and opening the default web app.

#### Create self-contained web app deployment for App Services in both clouds

1.  Edit the **WebApplication.csproj** file: Select **Runtimeidentifier** and then add win10-x64. For more information, see [Self-contained deployment](https://docs.microsoft.com/dotnet/core/deploying/#self-contained-deployments-scd) documentation.

2.  Use Team Explorer to check the code into VSTS.

3.  Confirm that the application code was checked into Visual Studio Team Services.

### Create the build definition

1.  Sign in to VSTS with an account that can create a build definition.

2.  Navigate to the **Build Web Application** page for the project.

3.  In **Arguments**, add **-r win10-x64** code. This is required to trigger a self-contained deployment with .Net Core.

4.  Run the build. The [self-contained deployment build](https://docs.microsoft.com/dotnet/core/deploying/#self-contained-deployments-scd) process will publish artifacts that can run on Azure and Azure Stack.

#### Use an Azure hosted build agent

Using a hosted build agent in VSTS is a convenient option for building and deploying web apps. Agent maintenance and upgrades are automatically performed by Microsoft Azure, which enables a continuous and uninterrupted development cycle.

### Configure the continuous deployment (CD) process

Visual Studio Team Services (VSTS) and Team Foundation Server (TFS) provide a highly configurable and manageable pipeline for releases to multiple environments such as development, staging, quality assurance (QA), and production. This process can include requiring approvals at specific stages of the application life cycle.

#### Create release definition

Creating a release definition is the final step in the application build process. This release definition is used to create a release and deploy a build.

1.  Sign in to VSTS and navigate to **Build and Release** for the project.

2.  On the **Releases** tab, select **[ + ]** and then pick **Create release definition**.

3.  On **Select a Template**, choose **Azure App Service Deployment**, and then select **Apply**.

4.  On **Add artifact**, from the **Source (Build definition) select the Azure Cloud build app.

5.  On the **Pipeline** tab, select the **1 Phase**, **1 Task** link to **View environment tasks**.

6.  On the **Tasks** tab, enter Azure as the **Environment name** and select the AzureCloud Traders-Web EP from the **Azure subscription** list.

7.  Enter the **Azure app service name**, which is `northwindtraders` in the next screen capture.

8.  For the Agent phase, select **Hosted VS2017** from the **Agent queue** list.

9.  In **Deploy Azure App Service**, select the valid **Package or folder** for the environment.

10. In **Select File or Folder**, select **OK** to **Location**.

11. Save all changes and go back to **Pipeline**.

12. On the **Pipeline** tab, select **Add artifact**, and choose the **NorthwindCloud Traders-Vessel** from the **Source (Build Definition) ** list.

13. On **Select a Template**, add another environment. Pick **Azure App Service Deployment** and then select **Apply**.

14. Enter `Azure Stack` as the **Environment name**.

15. On the **Tasks** tab, find and select Azure Stack.

16. From the **Azure subscription** list, select **AzureStack Traders-Vessel EP** for the Azure Stack endpoint.

17. Enter the Azure Stack web app name as the **App service name**.

18. Under **Agent selection**, pick **AzureStack -b Douglas Fir** from the **Agent queue** list.

19. For **Deploy Azure App Service**, select the valid **Package or folder** for the environment. On **Select File Or Folder**, select **OK** for the folder **Location**.

20. On the **Variable** tab, find the variable named `VSTS\_ARM\_REST\_IGNORE\_SSL\_ERRORS`. Set the variable value to **true**, and set its scope to **Azure Stack**.

21. On the **Pipeline** tab, select the **Continuous deployment trigger** icon for the NorthwindCloud Traders-Web artifact and set the **Continuous deployment trigger** to **Enabled**. Do the same thing for the **NorthwindCloud Traders-Vessel** artifact.

22. For the Azure Stack environment, select the **Pre-deployment conditions** icon set the trigger to **After release**.

23. Save all changes.

> [!Note]  
> Some settings for release tasks are automatically defined as [environment variables](https://docs.microsoft.com/vsts/build-release/concepts/definitions/release/variables?view=vsts#custom-variables) when creating a release definition from a template. These settings can't be modified in the task settings, but can be modified in the parent environment items.

## Create a release

1.  On the **Pipeline** tab, open the **Release** list and choose **Create release**.

2.  Enter a description for the release, check to see that the correct artifacts are selected, and then choose **Create**. After a few moments, a banner appears indicating that the new release was created, and the release name is displayed as a link. Choose the link to see the release summary page.

3.  The release summary page for shows details about the release. In the following screen capture for "Release-2", the **Environments** section shows the **Deployment status** for the Azure as "IN PROGRESS", and the status for Azure Stack is "SUCCEEDED". When the deployment status for the Azure environment changes to "SUCCEEDED", a banner appears indicating that the release is ready for approval. When a deployment is pending or has failed, a blue **(i)** information icon is shown. Hover over the icon to see a pop-up that contains the reason for delay or failure.

4.  Other views, such as the list of releases, also display an icon that indicates approval is pending. The pop-up for this icon shows the environment name and more details related to the deployment. It's easy for an administrator see the overall progress of releases and see which releases are waiting for approval.

## Monitor and track deployments

1.  On the **Release-2** summary page, select **Logs**. During a deployment, this page shows the live log from the agent. The left pane shows the status of each operation in the deployment for each environment.

2.  Choose a person icon in the **Action** column for a Pre-deployment or Post-deployment approval to see who approved (or rejected) the deployment, and the message they provided.

3.  After the deployment finishes, the entire log file is displayed in the right pane. Select any **Step** in the left pane to see the log file for a single step, such as **Initialize Job**. The ability to see individual logs makes it easier to trace and debug parts of the overall deployment. **Save** the log file for a step, or **Download all logs as zip**.

4.  Open the **Summary** tab to see general information about the release. This view shows details about the build, the environments it was deployed to, deployment status, and other information about the release.

5.  Select an environment link (**Azure** or **Azure Stack**) to see information about existing and pending deployments to a specific environment. Use these views as a quick way to verify that the same build was deployed to both environments.

6.  Open the **deployed production app** in the browser. For example, for the Azure App Services website, open the URL [http://[your-app-name\].azurewebsites.net](http:// [your-app-name].azurewebsites.net).

**Integration of Azure and Azure Stack provides a scalable cross-cloud solution**

A flexible and robust multi-cloud service provides data security, back up and redundancy, consistent and rapid availability, scalable storage and distribution, and geo-compliant routing. This manually triggered process ensures reliable and efficient load switching between Hosted Web apps, ensuring immediate availability of crucial data. 

## Next steps
- To learn more about Azure Cloud Patterns, see [Cloud Design Patterns](https://docs.microsoft.com/azure/architecture/patterns).