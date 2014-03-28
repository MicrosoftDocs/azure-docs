<properties linkid="create-vso-project-setup-continuous-deployment" urlDisplayName="How to create a VSO project and setup Continuous Deployment" pageTitle="How to create a Visual Studio Online team project and setup Continuous Deployment - Windows Azure" metaKeywords="Visual Studio Online create team project, continuous deployment to Azure" description="Learn how to create a Visual Studio Online team project and configure it for continuous deployment to Windows Azure." metaCanonical="" services="cloud-services, visual-studio-online" documentationCenter="" title="How to Create and Deploy a Cloud Service" authors="jimlamb" solutions="" writer="jimlamb" manager="" editor=""  />

#Create a Visual Studio Online project and setup Continuous Deployment to Windows Azure 

[WACOM.INCLUDE [disclaimer](../includes/disclaimer.md)]

The Windows Azure Management Portal lets you create a Team Project on Visual Studio Online and configure  your web application for continuous deployment to a web site.

##Table of Contents##

* [How to create a team project](#create_team_project)
* [How to create a new web application and add it to Git version control](#create_web_app)
* [How to setup continuous deployment](#continuous_deployment)

## <a name="create_team_project"></a>How to create a team project

1. Sign in to the Management Portal.
2. Click **New** at the bottom left-hand corner.
3. Click **Team Project**
4. Give your team project a name. Note that you can't change the name of your team project once it's been created.
5. Choose the type of version control you'd like to use for your project. You can choose either Git (a distributed version control system) or Team Foundation Version Control (a centralized version control system). Not sure which system to use? Learn more [here](http://msdn.microsoft.com/en-us/library/ms181368.aspx).
6. Choose the process template. For a comparison of the process templates, see [Work with team project artifacts](http://msdn.microsoft.com/en-us/library/ms400752.aspx).
7. Choose the Visual Studio Online account to use to create this team project, add users and monitor resource use.
8. Leave the **Add to Startboard** checkbox checked so that your new team project will automatically appear on your Startboard.
9. Click **Create**.

## <a name="create_web_app"></a>How to create a new web application and add it to Git version control

1. From the Startboard, click on your new team project.
2. In the **Code** lens, in the **Repositories** part, click the Git repository named after your team project.
3. In the repository/branch blade, click the **Visual Studio** blade-level command to open your  new repository in Visual  Studio. Your web browser may prompt you to authorize launching Visual Studio.
4.  In Visual Studio's Team Explorer tool window, click **Clone this repository** to setup a local clone of your new repository on your local disk.
5.  In the **Solutions** section of Team Explorer's Home page, click **New...** to create a new project in the repository you just cloned.
6.  In the New Project dialog, expand the Visual Basic or Visual C# node, depending on your programming language preference, then select **Web**.
7.  Click **ASP.NET Web Application** in the list of available project templates and enter a name for your web application.
8.  Click **OK**.
9.  Switch to the Team Explorer tool window, navigate to the Changes page, enter a commit message.
10.  Click the drop down arrow on the **Commit** button and click **Commit and Sync** to commit your changes and push that commit to the remote repository you cloned previously.

## <a name="continuous_deployment"></a>How to setup continuous deployment

1. Sign in to the Management portal.
2. From the Startboard, click on the team project you created previously.
3. In the **Build** lens, click the **Set up continuous deployment** part.
4. Select the website that you want to deploy your web application to.
5. Select the repository where your source code resides (you should only have one repository in your team project at this point).
6. Select the branch to build. Visual Studio Online will scan the content of the most recent commit on this branch for a single Visual Studio solution file (*.sln). If it finds one, it will configure a new build definition (with a name ending in "_CD") to build that solution. If it doesn't find a solution file, or if it finds more than one, it will still configure a new build definition, but it will be disabled and you will need to edit it in Visual Studio to specify the solution to build. 
7. Click **Create**.
8. Visual Studio Online will create a new build definition to build and deploy your web application project and attempt to queue a new build of that definition.

###To verify that your deployment completed successfully###

1. From the Startboard, click on the team project you created previously.
2. In the **Build** lens, click **Latest build** part to open the build blade.
3. In the build blade, click the first item in the **Deployments** part to open the associated website.
4. On the website blade, click the **Browse** blade-level command to browse the website and verify the deployment of your web application.
