---
title: 'Tutorial: Create a multi-region app'
description: Learn how to build a multi-region app on Azure App Service that can be used for high availability and fault tolerance.
keywords: azure app service, web app, multiregion, multi-region, multiple regions
author: seligj95
ms.topic: tutorial
ms.custom: devx-track-azurecli, devx-track-bicep
ms.date: 2/8/2023
ms.author: jordanselig
---

# Tutorial: Create a highly available multi-region app in Azure App Service

High availability and fault tolerance are key components of a well-architected solution. It’s best to prepare for the unexpected by having an emergency plan that can shorten downtime and keep your systems up and running automatically when something fails.

When you deploy your application to the cloud, you choose a region in that cloud where your application infrastructure is based. If your application is deployed to a single region, and the region becomes unavailable, your application will also be unavailable. This lack of availability may be unacceptable under the terms of your application's SLA. If so, deploying your application and its services across multiple regions is a good solution.

In this tutorial, you'll learn how to deploy a highly available multi-region web app. This scenario will be kept simple by restricting the application components to just a web app and [Azure Front Door](../frontdoor/front-door-overview.md), but the concepts can be expanded and applied to other infrastructure patterns. For example, if your application connects to an Azure database offering or storage account, see [active geo-replication for SQL databases](/azure/azure-sql/database/active-geo-replication-overview) and [redundancy options for storage accounts](../storage/common/storage-redundancy.md). For a reference architecture for a more detailed scenario, see [Highly available multi-region web application](/azure/architecture/reference-architectures/app-service-web-app/multi-region).

The following architecture diagram shows the infrastructure you'll be creating during this tutorial. It consists of two identical App Services in separate regions, one being the active or primary region, and the other is the standby or secondary region. Azure Front Door is used to route traffic to the App Services and access restrictions are configured so that direct access to the apps from the internet is blocked. The dotted line indicates that traffic will only be sent to the standby region if the active region goes down. 

Azure provides various options for load balancing and traffic routing. Azure Front Door was selected for this use case because it involves internet facing web apps hosted on Azure App Service deployed in multiple regions. To help you decide what to use for your use case if it differs from this tutorial, see the [decision tree for load balancing in Azure](/azure/architecture/guide/technology-choices/load-balancing-overview).

:::image type="content" source="./media/tutorial-multi-region-app/multi-region-app-service.png" alt-text="Architecture diagram of a multi-region App Service.":::

With this architecture:

- Identical App Service apps are deployed in two separate regions.
- Public traffic directly to the App Service apps is blocked.
- Azure Front Door is used route traffic to the primary/active region. The secondary region has an App Service that's up and running and ready to serve traffic if needed.

What you'll learn:

> [!div class="checklist"]
> * Create identical App Services in separate regions.
> * Create Azure Front Door with access restrictions that block public access to the App Services.

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

To complete this tutorial:

[!INCLUDE [Azure-CLI-prepare-your-environment-no-header.md](~/articles/reusable-content/Azure-CLI/Azure-CLI-prepare-your-environment-no-header.md)]

## Create two instances of a web app

You'll need two instances of a web app that run in different Azure regions for this tutorial. You'll use the [region pair](../availability-zones/cross-region-replication-azure.md#azure-paired-regions) East US/West US as your two regions and create two empty web apps. Feel free to choose you're own regions if needed.

To make management and clean-up simpler, you'll use a single resource group for all resources in this tutorial. Consider using separate resource groups for each region/resource to further isolate your resources in a disaster recovery situation.

Run the following command to create your resource group.

```azurecli-interactive
az group create --name myresourcegroup --location eastus
```

### Create App Service plans

Run the following commands to create the App Service plans. Replace the placeholders for `<app-service-plan-east-us>` and `<app-service-plan-west-us>` with two unique names where you can easily identify the region they're in.

```azurecli-interactive
az appservice plan create --name <app-service-plan-east-us> --resource-group myresourcegroup --is-linux --location eastus

az appservice plan create --name <app-service-plan-west-us> --resource-group myresourcegroup --is-linux --location westus
```

### Create web apps

Once the App Service plans are created, run the following commands to create the web apps. Replace the placeholders for `<web-app-east-us>` and `<web-app-west-us>` with two globally unique names (valid characters are `a-z`, `0-9`, and `-`) and be sure to pay attention to the `--plan` parameter so that you place one app in each plan (and therefore in each region). Replace the `<runtime>` parameter with the language version of your app. Run `az webapp list-runtimes` for the list of available runtimes. If you plan on using the sample Node.js app given in this tutorial in the following sections, use "NODE:18-lts" as your runtime.

```azurecli-interactive
az webapp create --name <web-app-east-us> --resource-group myresourcegroup --plan <app-service-plan-east-us> --runtime <runtime>

az webapp create --name <web-app-west-us> --resource-group myresourcegroup --plan <app-service-plan-west-us> --runtime <runtime>
```

Make note of the default hostname of each web app so you can define the backend addresses when you deploy the Front Door in the next step. It should be in the format `<web-app-name>.azurewebsites.net`. These hostnames can be found by running the following command or by navigating to the app's **Overview** page in the [Azure portal](https://portal.azure.com).

```azurecli-interactive
az webapp show --name <web-app-name> --resource-group myresourcegroup --query "hostNames"
```

## Create an Azure Front Door

A multi-region deployment can use an active-active or active-passive configuration. An active-active configuration distributes requests across multiple active regions. An active-passive configuration keeps running instances in the secondary region, but doesn't send traffic there unless the primary region fails. Azure Front Door has a built-in feature that allows you to enable these configurations. For more information on designing apps for high availability and fault tolerance, see [Architect Azure applications for resiliency and availability](/azure/architecture/reliability/architect).

### Create an Azure Front Door profile

You'll now create an [Azure Front Door Premium](../frontdoor/front-door-overview.md) to route traffic to your apps. 

Run [az afd profile create](/cli/azure/afd/profile#az-afd-profile-create) to create an Azure Front Door profile.

> [!NOTE]
> If you want to deploy Azure Front Door Standard instead of Premium, substitute the value of the `--sku` parameter with Standard_AzureFrontDoor. You won't be able to deploy managed rules with WAF Policy if you choose the Standard SKU. For a detailed comparison of the SKUs, see [Azure Front Door tier comparison](../frontdoor/standard-premium/tier-comparison.md).

```azurecli-interactive
az afd profile create --profile-name myfrontdoorprofile --resource-group myresourcegroup --sku Premium_AzureFrontDoor
```

|Parameter  |Value  |Description  |
|---------|---------|---------|
|profile-name     |myfrontdoorprofile         |Name for the Azure Front Door profile, which is unique within the resource group.         |
|resource-group     |myresourcegroup         |The resource group that contains the resources from this tutorial.         |
|sku     |Premium_AzureFrontDoor         |The pricing tier of the Azure Front Door profile.         |


### Add an endpoint

Run [az afd endpoint create](/cli/azure/afd/endpoint#az-afd-endpoint-create) to create an endpoint in your profile. You can create multiple endpoints in your profile after finishing the create experience.

```azurecli-interactive
az afd endpoint create --resource-group myresourcegroup --endpoint-name myendpoint --profile-name myfrontdoorprofile --enabled-state Enabled
```

|Parameter  |Value  |Description  |
|---------|---------|---------|
|endpoint-name     |myendpoint         |Name of the endpoint under the profile, which is unique globally.         |
|enabled-state     |Enabled         |Whether to enable this endpoint.        |

### Create an origin group

Run [az afd origin-group create](/cli/azure/afd/origin-group#az-afd-origin-group-create) to create an origin group that contains your two web apps.

```azurecli-interactive
az afd origin-group create --resource-group myresourcegroup --origin-group-name myorigingroup --profile-name myfrontdoorprofile --probe-request-type GET --probe-protocol Http --probe-interval-in-seconds 60 --probe-path / --sample-size 4 --successful-samples-required 3 --additional-latency-in-milliseconds 50
```

|Parameter  |Value  |Description  |
|---------|---------|---------|
|origin-group-name     |myorigingroup         |Name of the origin group.         |
|probe-request-type     |GET         |The type of health probe request that is made.        |
|probe-protocol    |Http         |Protocol to use for health probe.        |
|probe-interval-in-seconds     |60         |The number of seconds between health probes.        |
|probe-path    |/         |The path relative to the origin that is used to determine the health of the origin.       |
|sample-size     |4         |The number of samples to consider for load balancing decisions.        |
|successful-samples-required     |3         |The number of samples within the sample period that must succeed.        |
|additional-latency-in-milliseconds     |50         |The additional latency in milliseconds for probes to fall into the lowest latency bucket.        |

### Add an origin to the group

Run [az afd origin create](/cli/azure/afd/origin#az-afd-origin-create) to add an origin to your origin group. For the `--host-name` parameter, replace the placeholder for `<web-app-east-us>` with your app name in that region. Notice the `--priority` parameter is set to "1", which indicates all traffic will be sent to your primary app.

```azurecli-interactive
az afd origin create --resource-group myresourcegroup --host-name <web-app-east-us>.azurewebsites.net --profile-name myfrontdoorprofile --origin-group-name myorigingroup --origin-name primaryapp --origin-host-header <web-app-east-us>.azurewebsites.net --priority 1 --weight 1000 --enabled-state Enabled --http-port 80 --https-port 443
```

|Parameter  |Value  |Description  |
|---------|---------|---------|
|host-name     |`<web-app-east-us>.azurewebsites.net`        |The hostname of the primary web app.       |
|origin-name     |primaryapp         |Name of the origin.         |
|origin-host-header    |`<web-app-east-us>.azurewebsites.net`         |The host header to send for requests to this origin. If you leave this blank, the request hostname determines this value. Azure CDN origins, such as Web Apps, Blob Storage, and Cloud Services require this host header value to match the origin hostname by default.         |
|priority     |1         |Set this parameter to 1 to direct all traffic to the primary web app.        |
|weight     |1000         |Weight of the origin in given origin group for load balancing. Must be between 1 and 1000.         |
|enabled-state    |Enabled         |Whether to enable this origin.         |
|http-port    |80         |The port used for HTTP requests to the origin.        |
|https-port    |443         |The port used for HTTPS requests to the origin.         |

Repeat this step to add your second origin. Pay attention to the `--priority` parameter. For this origin, it's set to "2". This priority setting tells Azure Front Door to direct all traffic to the primary origin unless the primary goes down. If you set the priority for this origin to "1", Azure Front Door will treat both origins as active and direct traffic to both regions. Be sure to replace both instances of the placeholder for `<web-app-west-us>` with the name of that web app.

```azurecli-interactive
az afd origin create --resource-group myresourcegroup --host-name <web-app-west-us>.azurewebsites.net --profile-name myfrontdoorprofile --origin-group-name myorigingroup --origin-name secondaryapp --origin-host-header <web-app-west-us>.azurewebsites.net --priority 2 --weight 1000 --enabled-state Enabled --http-port 80 --https-port 443
```

### Add a route

Run [az afd route create](/cli/azure/afd/route#az-afd-route-create) to map your endpoint to the origin group. This route forwards requests from the endpoint to your origin group.

```azurecli-interactive
az afd route create --resource-group myresourcegroup --profile-name myfrontdoorprofile --endpoint-name myendpoint --forwarding-protocol MatchRequest --route-name route --https-redirect Enabled --origin-group myorigingroup --supported-protocols Http Https --link-to-default-domain Enabled 
```

|Parameter  |Value  |Description  |
|---------|---------|---------|
|endpoint-name     |myendpoint       |Name of the endpoint.       |
|forwarding-protocol     |MatchRequest       |Protocol this rule will use when forwarding traffic to backends.       |
|route-name     |route       |Name of the route.       |
|https-redirect     |Enabled       |Whether to automatically redirect HTTP traffic to HTTPS traffic.       |
|supported-protocols     |Http Https       |List of supported protocols for this route.       |
|link-to-default-domain     |Enabled       |Whether this route will be linked to the default endpoint domain.       |

Allow about 15 minutes for this step to complete as it takes some time for this change to propagate globally. After this period, your Azure Front Door will be fully functional.

### Restrict access to web apps to the Azure Front Door instance

If you try to access your apps directly using their URLs at this point, you'll still be able to. To ensure traffic can only reach your apps through Azure Front Door, you'll set access restrictions on each of your apps. Front Door's features work best when traffic only flows through Front Door. You should configure your origins to block traffic that hasn't been sent through Front Door. Otherwise, traffic might bypass Front Door's web application firewall, DDoS protection, and other security features. Traffic from Azure Front Door to your applications originates from a well known set of IP ranges defined in the AzureFrontDoor.Backend service tag. By using a service tag restriction rule, you can [restrict traffic to only originate from Azure Front Door](../frontdoor/origin-security.md).

Before setting up the App Service access restrictions, take note of the *Front Door ID* by running the following command. This ID will be needed to ensure traffic only originates from your specific Front Door instance. The access restriction further filters the incoming requests based on the unique HTTP header that your Azure Front Door sends.

```azurecli-interactive
az afd profile show --resource-group myresourcegroup --profile-name myfrontdoorprofile --query "frontDoorId"
```

Run the following commands to set the access restrictions on your web apps. Replace the placeholder for `<front-door-id>` with the result from the previous command. Replace the placeholders for the app names.

```azurecli-interactive
az webapp config access-restriction add --resource-group myresourcegroup -n <web-app-east-us> --priority 100 --service-tag AzureFrontDoor.Backend --http-header x-azure-fdid=<front-door-id>

az webapp config access-restriction add --resource-group myresourcegroup -n <web-app-west-us> --priority 100 --service-tag AzureFrontDoor.Backend --http-header x-azure-fdid=<front-door-id>
```

## Test the Front Door

When you create the Azure Front Door Standard/Premium profile, it takes a few minutes for the configuration to be deployed globally. Once completed, you can access the frontend host you created.

Run [az afd endpoint show](/cli/azure/afd/endpoint#az-afd-endpoint-show) to get the hostname of the Front Door endpoint.

```azurecli-interactive
az afd endpoint show --resource-group myresourcegroup --profile-name myfrontdoorprofile --endpoint-name myendpoint --query "hostName"
```

In a browser, go to the endpoint hostname that the previous command returned: `<myendpoint>-<hash>.z01.azurefd.net`. Your request will automatically get routed to the primary app in East US.

To test instant global failover:

1. Open a browser and go to the endpoint hostname: `<myendpoint>-<hash>.z01.azurefd.net`.
1. Stop the primary app by running [az webapp stop](/cli/azure/webapp#az-webapp-stop&preserve-view=true).

    ```azurecli-interactive
    az webapp stop --name <web-app-east-us> --resource-group myresourcegroup
    ```

1. Refresh your browser. You should see the same information page because traffic is now directed to the running app in West US.

    > [!TIP]
    > You might need to refresh the page a couple times as failover may take a couple seconds.

1. Now stop the secondary app.

    ```azurecli-interactive
    az webapp stop --name <web-app-west-us> --resource-group myresourcegroup
    ```

1. Refresh your browser. This time, you should see an error message.

    :::image type="content" source="../frontdoor/media/create-front-door-portal/web-app-stopped-message.png" alt-text="Screenshot of the message: Both instances of the web app stopped.":::

1. Restart one of the Web Apps by running [az webapp start](/cli/azure/webapp#az-webapp-start&preserve-view=true). Refresh your browser and you should see the app again.

    ```azurecli-interactive
    az webapp start --name <web-app-east-us> --resource-group myresourcegroup
    ```

You've now validated that you can access your apps through Azure Front Door and that failover functions as intended. Restart your other app if you're done with failover testing.

To test your access restrictions and ensure your apps can only be reached through Azure Front Door, open a browser and navigate to each of your app's URLs. To find the URLs, run the following commands:

```azurecli-interactive
az webapp show --name <web-app-east-us> --resource-group myresourcegroup --query "hostNames"

az webapp show --name <web-app-west-us> --resource-group myresourcegroup --query "hostNames"
```

You should see an error page indicating that the apps aren't accessible.

## Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, delete the resource group by running the following command in the Cloud Shell.

```azurecli-interactive
az group delete --name myresourcegroup
```

This command may take a few minutes to run.

## Deploy from ARM/Bicep

The resources you created in this tutorial can be deployed using an ARM/Bicep template. The [Highly available multi-region web app Bicep template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-multi-region-front-door) allows you to create a secure, highly available, multi-region end to end solution with two web apps in different regions behind Azure Front Door.

To learn how to deploy ARM/Bicep templates, see [How to deploy resources with Bicep and Azure CLI](../azure-resource-manager/bicep/deploy-cli.md).

## Frequently asked questions

In this tutorial so far, you've deployed the baseline infrastructure to enable a multi-region web app. App Service provides features that can help you ensure you're running applications following security best practices and recommendations.

This section contains frequently asked questions that can help you further secure your apps and deploy and manage your resources using best practices.

### What is the recommended method for managing and deploying application infrastructure and Azure resources?

For this tutorial, you used the Azure CLI to deploy your infrastructure resources. Consider configuring a continuous deployment mechanism to manage your application infrastructure. Since you're deploying resources in different regions, you'll need to independently manage those resources across the regions. To ensure the resources are identical across each region, infrastructure as code (IaC) such as [Azure Resource Manager templates](../azure-resource-manager/management/overview.md) or [Terraform](/azure/developer/terraform/overview) should be used with deployment pipelines such as [Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines) or [GitHub Actions](https://docs.github.com/actions). This way, if configured appropriately, any change to resources would trigger updates across all regions you're deployed to. For more information, see [Continuous deployment to Azure App Service](deploy-continuous-deployment.md).

### How can I use staging slots to practice safe deployment to production?

Deploying your application code directly to production apps/slots isn't recommended. This is because you'd want to have a safe place to test your apps and validate changes you've made before pushing to production. Use a combination of staging slots and slot swap to move code from your testing environment to production. 

You already created the baseline infrastructure for this scenario. You'll now create deployment slots for each instance of your app and configure continuous deployment to these staging slots with GitHub Actions. As with infrastructure management, configuring continuous deployment for your application source code is also recommended to ensure changes across regions are in sync. If you don’t configure continuous deployment, you’ll need to manually update each app in each region every time there's a code change.

For the remaining steps in this tutorial, you should have an app ready to deploy to your App Services. If you need a sample app, you can use the [Node.js Hello World sample app](https://github.com/Azure-Samples/nodejs-docs-hello-world). Fork that repository so you have your own copy.

Be sure to set the App Service stack settings for your apps. Stack settings refer to the language or runtime used for your app. This setting can be configured using the Azure CLI with the `az webapp config set` command or in the portal with the following steps. If you use the Node.js sample, set the stack settings to "Node 18 LTS".

1. Going to your app and selecting **Configuration** in the left-hand table of contents.
1. Select the **General settings** tab.
1. Under **Stack settings**, choose the appropriate value for your app.
1. Select **Save** and then **Continue** to confirm the update.
1. Repeat these steps for your other apps.

Run the following commands to create staging slots called "stage" for each of your apps. Replace the placeholders for `<web-app-east-us>` and `<web-app-west-us>` with your app names.

```azurecli-interactive
az webapp deployment slot create --resource-group myresourcegroup --name <web-app-east-us> --slot stage --configuration-source <web-app-east-us>

az webapp deployment slot create --resource-group myresourcegroup --name <web-app-west-us> --slot stage --configuration-source <web-app-west-us>
```

To set up continuous deployment, you should use the Azure portal. For detailed guidance on how to configure continuous deployment with providers such as GitHub Actions, see [Continuous deployment to Azure App Service](deploy-continuous-deployment.md).

To configure continuous deployment with GitHub Actions, complete the following steps for each of your staging slots.

1. In the [Azure portal](https://portal.azure.com), go to the management page for one of your App Service app slots.
1. In the left pane, select **Deployment Center**. Then select **Settings**. 
1. In the **Source** box, select "GitHub" from the CI/CD options:

    :::image type="content" source="media/app-service-continuous-deployment/choose-source.png" alt-text="Screenshot that shows how to choose the deployment source":::

1. If you're deploying from GitHub for the first time, select **Authorize** and follow the authorization prompts. If you want to deploy from a different user's repository, select **Change Account**.
1. After you authorize your Azure account with GitHub, select the **Organization**, **Repository**, and **Branch** to configure CI/CD for. If you can’t find an organization or repository, you might need to enable more permissions on GitHub. For more information, see [Managing access to your organization's repositories](https://docs.github.com/organizations/managing-access-to-your-organizations-repositories).

    1. If you're using the Node.js sample app, use the following settings.
        
        |Setting       |Value                        |
        |--------------|-----------------------------|
        |Organization  |`<your-GitHub-organization>` |
        |Repository    |nodejs-docs-hello-world      |
        |Branch        |main                         |
        
1. Select **Save**.

    New commits in the selected repository and branch now deploy continuously into your App Service app slot. You can track the commits and deployments on the **Logs** tab.

A default workflow file that uses a publish profile to authenticate to App Service is added to your GitHub repository. You can view this file by going to the `<repo-name>/.github/workflows/` directory.

### How do I disable basic auth on App Service?

Consider [disabling basic auth on App Service](https://azure.github.io/AppService/2020/08/10/securing-data-plane-access.html), which limits access to the FTP and SCM endpoints to users that are backed by Azure Active Directory (Azure AD). If using a continuous deployment tool to deploy your application source code, disabling basic auth will require [extra steps to configure continuous deployment](deploy-github-actions.md). For example, you won't be able to use a publish profile since that authentication mechanism doesn't use Azure AD backed credentials. Instead, you'll need to use either a [service principal or OpenID Connect](deploy-github-actions.md#generate-deployment-credentials).

To disable basic auth for your App Service, run the following commands for each app and slot by replacing the placeholders for `<web-app-east-us>` and `<web-app-west-us>` with your app names. The first set of commands disables FTP access for the production sites and staging slots, and the second set of commands disables basic auth access to the WebDeploy port and SCM site for the production sites and staging slots.

```azurecli-interactive
az resource update --resource-group myresourcegroup --name ftp --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<web-app-east-us> --set properties.allow=false

az resource update --resource-group myresourcegroup --name ftp --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<web-app-east-us>/slots/stage --set properties.allow=false

az resource update --resource-group myresourcegroup --name ftp --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<web-app-west-us> --set properties.allow=false

az resource update --resource-group myresourcegroup --name ftp --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<web-app-west-us>/slots/stage --set properties.allow=false
```

```azurecli-interactive
az resource update --resource-group myresourcegroup --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<web-app-east-us> --set properties.allow=false

az resource update --resource-group myresourcegroup --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<web-app-east-us>/slots/stage --set properties.allow=false

az resource update --resource-group myresourcegroup --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<web-app-west-us> --set properties.allow=false

az resource update --resource-group myresourcegroup --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<web-app-west-us>/slots/stage --set properties.allow=false
```

For more information on disabling basic auth including how to test and monitor logins, see [Disabling basic auth on App Service](https://azure.github.io/AppService/2020/08/10/securing-data-plane-access.html).

### How do I deploy my code using continuous deployment if I disabled basic auth?

If you choose to allow basic auth on your App Service apps, you can use any of the available deployment methods on App Service, including using the publish profile that was configured in the [staging slots](#how-can-i-use-staging-slots-to-practice-safe-deployment-to-production) section.

If you disable basic auth for your App Services, continuous deployment requires a service principal or OpenID Connect for authentication. If you use GitHub Actions as your code repository, see the [step-by-step tutorial for using a service principal or OpenID Connect to deploy to App Service using GitHub Actions](deploy-github-actions.md) or complete the steps in the following section.

#### Create the service principal and configure credentials with GitHub Actions

To configure continuous deployment with GitHub Actions and a service principal, use the following steps.

1. Run the following command to create the [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object). Replace the placeholders with your `<subscription-id>` and app names. The output is a JSON object with the role assignment credentials that provide access to your App Service apps. Copy this JSON object for the next step. It will include your client secret, which will only be visible at this time. It's always a good practice to grant minimum access. The scope in this example is limited to just the apps, not the entire resource group.

    ```bash
    az ad sp create-for-rbac --name "myApp" --role contributor --scopes /subscriptions/<subscription-id>/resourceGroups/myresourcegroup/providers/Microsoft.Web/sites/<web-app-east-us> /subscriptions/<subscription-id>/resourceGroups/myresourcegroup/providers/Microsoft.Web/sites/<web-app-west-us> --sdk-auth
    ```

1. You need to provide your service principal's credentials to the Azure Login action as part of the GitHub Action workflow you'll be using. These values can either be provided directly in the workflow or can be stored in GitHub secrets and referenced in your workflow. Saving the values as GitHub secrets is the more secure option.
    1. Open your GitHub repository and go to **Settings** > **Security** > **Secrets and variables** > **Actions** 
    1. Select **New repository secret** and create a secret for each of the following values. The values can be found in the json output you copied earlier.

        |Name                     |Value                      |
        |-------------------------|---------------------------|
        |AZURE_APP_ID             |`<application/client-id>`  |
        |AZURE_PASSWORD           |`<client-secret>`          |
        |AZURE_TENANT_ID          |`<tenant-id>`              |
        |AZURE_SUBSCRIPTION_ID    |`<subscription-id>`        |

#### Create the GitHub Actions workflow

Now that you have a service principal that can access your App Service apps, edit the default workflows that were created for your apps when you configured continuous deployment. Authentication must be done using your service principal instead of the publish profile. For sample workflows, see the "Service principal" tab in [Deploy to App Service](deploy-github-actions.md#deploy-to-app-service). The following sample workflow can be used for the Node.js sample app that was provided.

1. Open your app's GitHub repository and go to the `<repo-name>/.github/workflows/` directory. You'll see the autogenerated workflows.
1. For each workflow file, select the "pencil" button in the top right to edit the file. Replace the contents with the following text, which assumes you created the GitHub secrets earlier for your credential. Update the placeholder for `<web-app-name>` under the "env" section, and then commit directly to the main branch. This commit will trigger the GitHub Action to run again and deploy your code, this time using the service principal to authenticate.

    ```yml

    name: Build and deploy Node.js app to Azure Web App
    
    on:
      push:
        branches:
          - main
      workflow_dispatch:
    
    env:
      AZURE_WEBAPP_NAME: <web-app-name>   # set this to your application's name
      NODE_VERSION: '18.x'                # set this to the node version to use
      AZURE_WEBAPP_PACKAGE_PATH: '.'      # set this to the path to your web app project, defaults to the repository root
      AZURE_WEBAPP_SLOT_NAME: stage       # set this to your application's slot name
    
    jobs:
      build:
        runs-on: ubuntu-latest
    
        steps:
          - uses: actions/checkout@v2
            
          - name: Set up Node.js version
            uses: actions/setup-node@v1
            with:
              node-version: ${{ env.NODE_VERSION }}
    
          - name: npm install, build
            run: |
              npm install
              npm run build --if-present
    
          - name: Upload artifact for deployment job
            uses: actions/upload-artifact@v2
            with:
              name: node-app
              path: .
    
      deploy:
        runs-on: ubuntu-latest
        needs: build
        environment:
          name: 'stage'
          url: ${{ steps.deploy-to-webapp.outputs.webapp-url }}
    
        steps:
          - name: Download artifact from build job
            uses: actions/download-artifact@v2
            with:
              name: node-app

          - uses: azure/login@v1
            with:
              creds: |
                {
                  "clientId": "${{ secrets.AZURE_APP_ID }}",
                  "clientSecret":  "${{ secrets.AZURE_PASSWORD }}",
                  "subscriptionId": "${{ secrets.AZURE_SUBSCRIPTION_ID }}",
                  "tenantId": "${{ secrets.AZURE_TENANT_ID }}"
                }
    
          - name: 'Deploy to Azure Web App'
            id: deploy-to-webapp
            uses: azure/webapps-deploy@v2
            with:
              app-name: ${{ env.AZURE_WEBAPP_NAME }}
              slot-name: ${{ env.AZURE_WEBAPP_SLOT_NAME }}
              package: ${{ env.AZURE_WEBAPP_PACKAGE_PATH }}
              
          - name: logout
            run: |
              az logout
    ```

### How does slot traffic routing allow me to test updates that I make to my apps?

Traffic routing with slots allows you to direct a pre-defined portion of your user traffic to each slot. Initially, 100% of traffic is directed to the production site. However, you have the ability, for example, to send 10% of your traffic to your staging slot. If you configure slot traffic routing in this way, when users try to access your app, 10% of them will automatically be routed to the staging slot with no changes to your Front Door instance. To learn more about slot swaps and staging environments in App Service, see [Set up staging environments in Azure App Service](deploy-staging-slots.md).

### How do I move my code from my staging slot to my production slot?

Once you're done testing and validating in your staging slots, you can perform a [slot swap](deploy-staging-slots.md#swap-two-slots) from your staging slot to your production site. You'll need to do this swap for all instances of your app in each region. During a slot swap, the App Service platform [ensures the target slot doesn't experience downtime](deploy-staging-slots.md#swap-operation-steps).

To perform the swap, run the following command for each app. Replace the placeholder for `<web-app-name>`.

```azurecli-interactive
az webapp deployment slot swap --resource-group MyResourceGroup -name <web-app-name> --slot stage --target-slot production
```

After a few minutes, you can navigate to your Front Door's endpoint to validate the slot swap succeeded.

At this point, your apps are up and running and any changes you make to your application source code will automatically trigger an update to both of your staging slots. You can then repeat the slot swap process when you're ready to move that code into production.

### How else can I use Azure Front Door in my multi-region deployments?

If you're concerned about potential disruptions or issues with continuity across regions, as in some customers seeing one version of your app while others see another version, or if you're making significant changes to your apps, you can temporarily remove the site that's undergoing the slot swap from your Front Door's origin group. All traffic will then be directed to the other origin. Navigate to the **Update origin group** pane and **Delete** the origin that is undergoing the change. Once you've made all of your changes and are ready to serve traffic there again, you can return to the same pane and select **+ Add an origin** to readd the origin.

:::image type="content" source="./media/tutorial-multi-region-app/remove-origin.png" alt-text="Screenshot showing how to remove an Azure Front Door origin.":::

If you'd prefer to not delete and then readd origins, you can create extra origin groups for your Front Door instance. You can then associate the route to the origin group pointing to the intended origin. For example, you can create two new origin groups, one for your primary region, and one for your secondary region. When your primary region is undergoing a change, associate the route with your secondary region and vice versa when your secondary region is undergoing a change. When all changes are complete, you can associate the route with your original origin group that contains both regions. This method works because a route can only be associated with one origin group at a time.

To demonstrate working with multiple origins, in the following screenshot, there are three origin groups. "MyOriginGroup" consists of both web apps, and the other two origin groups each consist of the web app in their respective region. In the example, the app in the primary region is undergoing a change. Before that change was started, the route was associated with "MySecondaryRegion" so all traffic would be sent to the app in the secondary region during the change period. You can update the route by selecting "Unassociated", which will bring up the **Associate routes** pane.

:::image type="content" source="./media/tutorial-multi-region-app/associate-routes.png" alt-text="Screenshot showing how to associate routes with Azure Front Door.":::

### How do I restrict access to the advanced tools site?

With Azure App service, the SCM/advanced tools site is used to manage your apps and deploy application source code. Consider [locking down the SCM/advanced tools site](app-service-ip-restrictions.md#restrict-access-to-an-scm-site) since this site will most likely not need to be reached through Front Door. For example, you can set up access restrictions that only allow you to conduct your testing and enable continuous deployment from your tool of choice. If you're using deployment slots, for production slots specifically, you can deny almost all access to the SCM site since your testing and validation will be done with your staging slots.

## Next steps

> [!div class="nextstepaction"]
> [How to deploy a highly available multi-region web app](https://azure.github.io/AppService/2022/12/02/multi-region-web-app.html)

> [!div class="nextstepaction"]
> [Highly available zone-redundant web application](/azure/architecture/reference-architectures/app-service-web-app/zone-redundant)
