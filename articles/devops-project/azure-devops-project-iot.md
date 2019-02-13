# Continuously deploy to IoT Edge applications with DevOps Projects

Azure DevOps Projects presents a simplified experience where you can bring your existing code and Git repo or choose a sample application to create a continuous integration (CI) and continuous delivery (CD) pipeline to Azure.

DevOps Projects also:

- Automatically creates Azure resources, such as IoTHub

- Creates and configures a release pipeline in Azure DevOps that sets up a build and release pipeline for CI/CD

In this tutorial, you will:

- Use DevOps Projects to deploy an ASP.NET app to IoT Edge application

- Configure Azure DevOps and an Azure subscription

- Examine the IoTHub

- Examine the CI pipeline

- Examine the CD pipeline

- Commit changes to Git and automatically deploy them to Azure

- Clean up resources

## Prerequisites

- An Azure subscription. You can get one free through [Visual Studio Dev Essentials](https://visualstudio.microsoft.com/dev-essentials/)

## Use DevOps Projects to deploy an ASP.NET app to IoT Edge

DevOps Projects creates a CI/CD pipeline in Azure Pipelines. You can create a new Azure DevOps organization or use an existing organization. DevOps Projects also creates Azure resources, such as an IoTHub, in the Azure subscription of your choice.

1. Sign in to the [Azure portal](https://portal.azure.com)

1. In the left pane, select **Create a resource**.

1. In the search box, type **DevOps Projects**, and then select **Create**.

    ![DevOps Projects]()

1. Select **.NET**, and then select **Next**.

1. Under **Choose an application framework**, select **Simple IoT(Preview)**.

1. Select **IoT Edge** and then select **Next**.

## Configure Azure DevOps and an Azure subscription

1. Create a new Azure DevOps organization, or select an existing organization.

1. Enter a name for your Azure DevOps project.

1. Select your Azure subscription.

1. To view additional Azure configuration settings and to identify the pricing tier and location click on Additional settings. This pane displays various options for configuring the pricing tier and location of Azure services.

1. Exit the Azure configuration area, and then select Done.

1. After a few minutes, the process is completed. A sample ASP.NET app is set up in a Git repo in your Azure DevOps organization, an IoT Hub is created, a CI/CD pipeline is executed, and your app is deployed to Azure.

   After all this is completed, the Azure DevOps Project dashboard is displayed in the Azure portal. You can also go to the DevOps Projects dashboard directly from All resources in the Azure portal.

   This dashboard provides visibility into your Azure DevOps code repository, your CI/CD pipeline, and your IoTHub. You can configure additional CI/CD options in your Azure DevOps pipeline. At the right, select IoT Hub to view.

## Examine the IoT Hub

DevOps Projects automatically configures an IoT Hub, which you can explore and customize. To familiarize yourself with the IoT Hub, do the following:

1. Go to the DevOps Projects dashboard.

1. At the right, select the IoT Hub service. A pane opens for the Iot Hub. From this view you can perform various actions such as operations monitoring, searching logs and manage IoT devices.

## Examine the CI pipeline

DevOps Projects automatically configures a CI/CD pipeline in your Azure DevOps organization. You can explore and customize the pipeline. To familiarize yourself with it, do the following:

1. Go to the DevOps Projects dashboard.

1. At the top of the DevOps Projects dashboard, select **Build Pipelines**. A browser tab displays the build pipeline for your new project.

1. Point to the **Status** field, and then select the ellipsis (...). A menu displays several options, such as queueing a new build, pausing a build, and editing the build pipeline.

1. Select **Edit**.

1. In this pane, you can examine the various tasks for your build pipeline. The build performs various tasks, such as fetching sources from the Git repo, building IoT Edge module images, pushing IoT Edge modules to a container registry, and publishing outputs that are used for deployments.

1. At the top of the build pipeline, select the build pipeline name.

1. Change the name of your build pipeline to something more descriptive, select **Save & queue**, and then select **Save**.

1. Under your build pipeline name, select **History**. This pane displays an audit trail of your recent changes for the build. Azure DevOps keeps track of any changes made to the build pipeline, and it allows you to compare versions.

1. Select **Triggers**. DevOps Projects automatically creates a CI trigger, and every commit to the repo starts a new build. Optionally, you can choose to include or exclude branches from the CI process.

1. Select **Retention**. Depending on your scenario, you can specify policies to keep or remove a certain number of builds.


## Examine the CD release pipeline

DevOps Projects automatically creates and configures the necessary steps to deploy from your Azure DevOps organization to your Azure subscription. These steps include configuring an Azure service connection to authenticate Azure DevOps to your Azure subscription. The automation also creates a release pipeline, which provides the CD to Azure. To learn more about the release pipeline, do the following:

1. Select **Build and Release**, and then select **Releases**. DevOps Projects creates a release pipeline to manage deployments to Azure.

1. Select the ellipsis (...) next to your release pipeline, and then select **Edit**. The release pipeline contains a pipeline, which defines the release process.

1. Under **Artifacts**, select **Drop**. The build pipeline you examined in the previous steps produces the output that's used for the artifact.

1. At the right of the **Drop** icon, select **Continuous deployment trigger**. This release pipeline has an enabled CD trigger, which executes a deployment every time a new build artifact is available. Optionally, you can disable the trigger so that your deployments require manual execution.

1. At the right, select **View releases** to display a history of releases.

1. Select the ellipsis (...) next to a release, and then select **Open**. You can explore several menus, such as a release summary, associated work items, and tests.

1. Select **Commits**. This view shows code commits that are associated with this deployment. Compare releases to view the commit differences between deployments.

1. Select **Logs**. The logs contain useful information about the deployment process. You can view them both during and after deployments.

## Commit code changes and execute CI/CD

> Note: The following procedure tests the CI/CD pipeline by making a simple text change.

You're now ready to collaborate with a team on your app by using a CI/CD process that automatically deploys your latest work to your IoT Hub. Each change to the Git repo starts a build in Azure DevOps, and a CD pipeline executes a deployment to Azure. Follow the procedure in this section, or use another technique to commit changes to your repo. For example, you can clone the Git repo in your favorite tool or IDE, and then push changes to this repo.

1. In the Azure DevOps menu, select **Code > Files**, and then go to your repo.

1. The repository already contains code for a module called **SampleModule** based on the application language that you chose in the creation process. Open the **modules/SampleModule/module.json** file.

1. Select **Edit**, and then make a change to **version** under the **tag**. For example, you can update it to **"version": "${BUILD_BUILDID}"** to use [Azure DevOps build variables](https://docs.microsoft.com/azure/devops/pipelines/build/variables?view=vsts#build-variables) as a part of your Azure IoT Edge module image tag.

1. At the top right, select **Commit**, and then select **Commit** again to push your change. After a few moments, a build starts in Azure DevOps and a release executes to deploy the changes. Monitor the build status on the DevOps Projects dashboard or in the browser with your Azure DevOps organization.

## Clean up resources

You can delete the related resources that you created when you don't need them anymore. Use the **Delete** functionality on the DevOps Projects dashboard.


