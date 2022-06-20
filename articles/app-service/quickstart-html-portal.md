---
title: 'Quickstart: Create a static HTML web app in the Azure portal'
description: Get started with Azure App Service by deploying your static HTML web app to a Linux container in App Service by using the Azure portal.
ms.topic: quickstart
ms.date: 06/15/2022
ms.custom: mode-ui
ROBOTS: noindex
---

[Azure App Service](overview.md) provides a highly scalable, self-patching web hosting service. This quickstart shows how to deploy a basic HTML+CSS site to Azure App Service using the Azure portal.

This quickstart configures a static web App in the **Free** tier and incurs no cost for your Azure subscription.

This quickstart shows you how to make these changes within your browser, without having to install the development environment tools on your machine.

![Screenshot of the sample app running in Azure, showing 'Hello World!'.](media/quickstart-html-portal/html-docs-hello-world-in-browser.png)

You can follow the steps here using a Mac, Windows, or Linux machine. Once the prerequisites are installed, it takes about five minutes to complete the steps.

To complete this quickstart you need:

1. An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-app-service-extension&mktingSource=vscode-tutorial-app-service-extension).
2. A GitHub account to fork a repository.

## 1 - Fork the sample repository

1. In your browser, navigate to the repository containing [the sample code](https://github.com/Azure-Samples/html-docs-hello-world).

2. In the upper right corner, select **Fork**.

    ![Screenshot of the Azure-Samples/html-docs-hello-world repo in GitHub, with the Fork option highlighted.](media/quickstart-html-portal/fork-html-docs-hello-world-repo.png)

3. On the **Create a new fork** screen, confirm the **Owner** and **Repository name** fields. Select **Create fork**.

    >[!NOTE]
    > This should take you to the new fork. Your fork URL will look something like this: https://github.com/YOUR_GITHUB_ACCOUNT_NAME/html-docs-hello-world

## 2 - Deploy to Azure

1. Sign into the Azure portal.
   
2. At the top of the portal, type **static web apps** in the search box. Under **Services**, select **Static Web Apps**.

    ![Screenshot of the Azure portal with 'static web apps' typed in the search text box. In the results, the Static Web Apps option under Services is highlighted.](media/quickstart-html-portal/azure-portal-search-for-static-web-apps.png)

3. On the **Static Web Apps** page, select **Create**.

    ![Screenshot of the Static Web Apps page in the Azure portal. The Create button in the action bar is highlighted.](media/quickstart-html-portal/azure-portal-create-static-web-app.png)

4. Fill out the **Create Web App** page as follows.
   - **Resource Group**: Create a resource group named *myResourceGroup*.
   - **Name**: Type a globally unique name for your web app. 
   - **Plan type**: Select *Free*.
   - **Region for Azure Functions API and staging environments**: Choose a location close to you.
   - **Source**: Select *GitHub*.
   - **Organization**: Select your organization.
   - **Repository**: Select your forked *html-docs-hello-world* repo.
   - **Branch**: Select the default branch.

    There are no build presets for this repository. However, if you use a framework or static site generator, the Static Web App integration with GitHub supports a variety of frameworks and static site generators.

5.  Select the **Review + create** button at the bottom of the page.

6.  After validation runs, select the **Create** button at the bottom of the page. This will create an Azure resource group and static web app. This will also add a workflow with GitHub actions that will automatically deploy your code from your repo to the Azure static web app.

7.  After the Azure resources are created, select **Go to resource**. Wait a few minutes for your site to deploy. Then navigate to the URL that appears on the Overview page.

The sample static app is running.

![Screenshot of the sample app running in Azure, showing 'Hello World!'.](media/quickstart-html-portal/html-docs-hello-world-in-browser.png)

**Congratulations!** You've deployed your first static web app using the Azure portal.

## 3 - Update in GitHub and redeploy the code

1. Browse to your GitHub fork of html-docs-hello-world.

2. On your repo page, press `.` to start Visual Studio code within your browser.

![Screenshot of the forked html-docs-hello-world repo in GitHub with instructions to press the period key on this screen.](media/quickstart-html-portal/forked-github-repo-press-period.png)


> [!NOTE]
> The URL will change from GitHub.com to GitHub.dev. This feature only works with repos that have files. This does not work on empty repos.

3. Edit **index.html** so that it shows "Azure App Service" instead of "Azure App Service - Sample Static HTML Site".

    ```html
    <h1>Azure App Service</h1>
    ```

4. From the **Source Control** menu, select the **Stage Changes** button to stage the change.

    ![Screenshot of Visual Studio Code in the browser, highlighting the Source Control navigation in the sidebar, then highlighting the Stage Changes button in the Source Control panel.](media/quickstart-html-portal/vscode-in-browser-stage-changes.png)

5. Enter a commit message such as `Updated static site`. Then, select **Commit and Push**.
    
    ![Screenshot of Visual Studio Code in the browser, Source Control panel with a commit message of 'Hello Azure' and the Commit and Push button highlighted.](media/quickstart-html-portal/vscode-in-browser-commit-push.png)

6. Once deployment has completed, return to the browser window that opened during the **Browse to the app** step, and refresh the page.

    ![Screenshot of the updated sample app running in Azure, showing 'Hello Azure!'](media/quickstart-html-portal/updated-html-docs-hello-world-in-browser.png)

## 4 - Manage your new Azure app

1. Go to the Azure portal to manage the web app you created. Search for and select **Static Web Apps**.

    ![Screenshot of the Azure portal with 'static web apps' typed in the search text box. In the results, the Static Web Apps option under Services is highlighted.](media/quickstart-html-portal/azure-portal-search-for-static-web-apps.png)

2. Select the name of your static web app.

    ![Screenshot of the Static Web Apps list in Azure. The name of the demo static web app is highlighted.](media/quickstart-html-portal/app-service-list.png)

    Your web app's **Overview** page will be displayed. Here, you can manage the deployment token for your static web app, in case you need to reset the token.

    ![Screenshot of the App Service overview page in Azure portal. In the action bar, the Manage deployment token option is highlighted.](media/quickstart-html-portal/app-service-detail.png)

    The web app menu provides different options for configuring your app.

## 5 - Clean up resources

When you're finished with the sample app, you can remove all of the resources for the app from Azure. It will not incur extra charges and keep your Azure subscription uncluttered. Removing the resource group also removes all resources in the resource group and is the fastest way to remove all Azure resources for your app.

1. From your App Service **Overview** page, select the resource group you created.

2. From the resource group page, select **Delete resource group**. Confirm the name of the resource group to finish deleting the resources.