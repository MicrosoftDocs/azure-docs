---
title: "Quickstart: Configure geo-redundancy for an Azure App Service app (Preview)"
description: Learn how to configure an Azure App Service app across multiple Azure regions by adding a silo region and accessing the app through its global endpoint.
author: btardif
ms.author: anwestg
ms.topic: quickstart
ms.service: azure-app-service
ms.date: 11/17/2026
---

# Quickstart: Configure geo-redundancy for an Azure App Service app (preview)

Geo-redundancy in Azure App Service extends an App Service app across multiple Azure regions. You add one or more silo regions to an existing app and access the geo-redundant application through a global endpoint.

In this quickstart, you:

> [!div class="checklist"]
> * Create an App Service web app.
> * Deploy a .NET 10 sample application to the primary app.
> * Add a silo region.
> * Verify the health of the primary and silo regions.
> * Access the app through its global endpoint.

> [!IMPORTANT]
> Geo-redundancy on Azure App Service is currently in preview.

## Prerequisites

To complete this quickstart, you need an Azure subscription with permission to create and configure Azure App Service resources.

Geo-redundancy requires an eligible App Service plan and region configuration.  The primary web app and App Service plan must meet the [current OS and region limitations](overview-geo-redundancy.md#preview-scope-and-current-limitations).

## Create a web app

1. In the Azure portal, select **Create a resource**.
1. Search for **Web App**, and then select **Create**.
1. On the **Basics** tab, configure your app.

   | Setting | Example |
   | --- | --- |
   | Subscription | Select your subscription |
   | Resource Group | Create a **new** resource group named **myResourceGroup** |
   | Name | Enter a **unique** name for your web app | 
   | Publish | **Code** |
   | Runtime stack | **.NET 10 (LTS)** |
   | Operating system | **Windows** |
   | Region | **East Asia** |
   | Pricing plan | Enter a **unique** name for your App Service plan and select **P1v3** pricing plan |

1. If the region and selected configuration support zone redundancy, choose whether to enable **Zone redundancy**.

   When zone redundancy is enabled, the App Service plan and the apps in the plan are configured to use zone redundancy.

1. Configure **Database**, **Deployment**, **Networking**, and **Monitor + secure** according to your application requirements.

   For this quickstart:
   
   * No database is deployed.
   * Continuous deployment isn't configured.
   * Public access is enabled.
   * Monitoring is configured separately.

   > [!NOTE]
   > These choices are specific to the example in this quickstart. They aren't requirements for using geo-redundancy.

1. Select **Review + create**.
1. After validation succeeds, select **Create**.

## Deploy a .NET 10 sample application to the primary app

### Prerequisites

 - [Git](https://git-scm.com/downloads).
 - The [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0).
 - The [Azure CLI](/cli/azure/install-azure-cli).
 - Permission to deploy application code to the web app.

### Deploy the sample application to the primary app

This sample is a stateless ASP.NET Core Razor Pages application. Its home page displays the hosting region of the App Service instance that responds to the request.

Deploy the sample to the web app you created in the preceding section. This web app becomes the primary app when you add a silo region.

1. In a local PowerShell terminal, clone the sample repository and open its directory:
 
   ```powershell
   git clone https://github.com/Azure-Samples/georedundantquickstart.git
   Set-Location .\georedundantquickstart
   ```
 
1. Publish the application and package the published files:
 
   ```powershell
   dotnet publish .\src\GeoQuickstart\GeoQuickstart.csproj --configuration Release --output .\publish
   Compress-Archive -Path .\publish\* -DestinationPath .\app.zip -Force
   ```
 
   Package the contents of the publish directory, not the directory itself.
 
1. Sign in to Azure and select the subscription containing your web app. Replace `<subscription-id>` with your subscription ID.
 
   ```powershell
   az login
   az account set --subscription "<subscription-id>"
   ```
 
1. Deploy the package. Replace `<primary-app-name>` with the name of the web app you created.
 
   ```powershell
   az webapp deploy --resource-group myResourceGroup --name "<primary-app-name>" --src-path .\app.zip --type zip
   ```
 
1. After deployment completes, open your web app in the Azure portal and select **Browse**.
 
1. Confirm that the sample displays **Hello World** and that **Hosting region** identifies the primary region.
 
> [!NOTE]
> The sample reads the platform-provided `REGION_NAME` environment variable. The displayed value can differ from the portal's region display name. Don't add a region app setting or hard-code a region into the application.
>
> If the sample displays **Region unavailable**, it couldn't read hosting-region metadata. Don't interpret that value as successful region verification.
 
Deploy application updates to the primary app only. App Service synchronizes supported deployments to the regional silos according to their revision synchronization settings.
 
This approach uses the documented .NET publish and ZIP deployment flow, targeting the existing app rather than creating another deployment.

## Add a silo region

After you deploy and verify the sample on the primary app:

1. Open your App Service app in the Azure portal.
1. Under **App Service plan**, select **Geo-redundancy (preview)**.
1. Select **Add silo region**.
1. On the **Basics** tab, select **West US 2** as the Azure **Region** for the silo.
1. Choose a **Revision sync mode**: Automatic (More information on [revision synchronization modes](configure-geo-redundancy.md#revision-synchronization))
1. Select the **Networking** tab.
1. To connect the silo to a virtual network, select **Enable virtual network integration**, and select the virtual network and subnet.

   For this quickstart, leave virtual network integration disabled.

   > [!IMPORTANT]
   > If the primary app is integrated with a virtual network, each silo also **must** be integrated with a virtual network.


1. Select **Add**.

Azure begins creating and configuring the silo region.

## Verify the deployment

Return to **Geo-redundancy (preview)**.

The **Regions** table displays the primary region and the new silo region.

Wait until:

* **Fleet health** reports **Healthy**.
* **Endpoint health** reports **Healthy** for the primary region.
* **Endpoint health** reports **Healthy** for the silo region.
* Both regions have a status of **On**.

> [!NOTE]
> A newly added region can temporarily report **Waiting for data**, **Updating**, or another transitional state while configuration and health evaluation complete.

Open the secondary silo's regional endpoint. Confirm that the sample displays **Hello World** and that **Hosting region** identifies the secondary region. Also open the primary regional endpoint and confirm that it identifies the primary region.
 
These checks verify application responses independently of the routing health reported in the portal.

## Browse the global endpoint

The **Geo-redundancy (preview)** page displays a **Global endpoint** for the application.

Open the **Global endpoint** and confirm that the sample loads. Check **Hosting region** to identify the region that answered.
 
Refreshing the page doesn't guarantee a different region. DNS caching, existing connections, and the configured traffic mode affect which region responds. The displayed region identifies the responding app's location; it doesn't by itself verify the application revision or demonstrate failover.

Your application is now configured with an additional App Service region and is accessible through its global endpoint.

## Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future and don't want to continue incurring charges, delete the resource group to remove all the resources.

# [Azure portal](#tab/portal)

1. From your web app's **Overview** page in the Azure portal, select the **myResourceGroup** link under **Resource group**.
1. On the resource group page, ensure that the listed resources are the ones you want to delete.
1. Select **Delete resource group**, type **myResourceGroup** in the text box, and then select **Delete**.
1. Confirm again by selecting **Delete**.

# [Cloud Shell](#tab/shell)

```bash
az group delete --name myResourceGroup
```

---

## Next steps

Learn how to:

* [Configure Active and Passive traffic modes](configure-geo-redundancy.md#understand-and-configure-traffic-routing).
* [Configure regional traffic weights and priorities](configure-geo-redundancy.md#understand-and-configure-traffic-routing).
* [Manage application revisions](configure-geo-redundancy.md#revision-synchronization) and [Last Known Good](configure-geo-redundancy.md#configure-last-known-good).
* Configure [silo networking](configure-geo-redundancy.md#networking) and App Service plan settings.
* [Add, disable, and remove silo regions](configure-geo-redundancy.md#manage-silo-regions).
* [Understand health monitoring](configure-geo-redundancy.md#monitor-geo-redundancy-health) and [automatic failover behavior](configure-geo-redundancy.md#passive-mode-failover).
