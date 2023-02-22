---
title: 'Tutorial: Create a secure n-tier web app'
description: Learn how to securely deploy your n-tier web app to Azure App Service.
author: seligj95
ms.topic: tutorial
ms.date: 2/22/2023
ms.author: jordanselig
---

# Tutorial: Create a secure n-tier app in Azure App Service

Many applications consist of more than just a single component. For example, you may have a frontend that is publicly accessible that connects to a backend database, storage account, key vault, another VM, or a combination of these resources. This architecture makes up an n-tier application. It's important that applications like this are architected so that access is limited to privileged individuals. Any component that isn't intended for public consumptions should be locked down to the greatest extent available for your use case.

In this tutorial, you'll learn how to deploy a secure n-tier web app with network-isolated communication to a backend web app. All traffic is isolated within your virtual network using [virtual network integration](overview-vnet-integration.md) and [private endpoints](networking/private-endpoint.md). For more information on n-tier applications including more scenarios and multi-region considerations, see [Multi-region N-tier application](/azure/architecture/reference-architectures/n-tier/multi-region-sql-server.md) and [Reliable web app pattern planning (.NET)](/azure/architecture/reference-architectures/reliable-web-app/dotnet/pattern-overview.md).

The following architecture diagram shows the infrastructure you'll create during this tutorial.

:::image type="content" source="./media/tutorial-secure-ntier-app/n-tier-app-service-architecture.png" alt-text="Architecture diagram of an n-tier App Service.":::

- **Frontend web app**. This architecture uses two web apps - a frontend that is accessible over the public internet, and a private backend web app. The frontend web app is integrated into the virtual network in the subnet with the feature regional virtual network integration. It's configured to consume a private DNS zone.
- **Backend web app**. The backend web app is only exposed through a private endpoint via another subnet in the virtual network. Direct communication to the backend web app is explicitly blocked. The only resource or principal that is allowed to connect to the backend is the frontend web app using the private endpoint.

> [!NOTE]
> Virtual network integration and private endpoints are available all the way down to the Basic SKU. App Services using the Free tier don't support these features.

With this architecture:

- Public traffic to the back-end app is blocked.
- Outbound traffic from App Service is routed to the virtual network and can reach the back-end app.
- App Service is able to perform DNS resolution to the back-end app through the private DNS zone.

This scenario shows one of the possible n-tier scenarios in App Service. Typically, with n-tier apps, your other tiers can consist of various types of resources such as databases, key vaults, or other virtual machines. You can use the concepts covered in this tutorial to build more complex n-tier apps.

What you'll learn:

> [!div class="checklist"]
> * Create a virtual network and subnets for App Service virtual network integration.
> * Create private DNS zones.
> * Create private endpoints.
> * Configure virtual network integration in App Service.
> * Disabled basic auth in app service.
> * Continuously deploy to a locked down backend web app.

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

To complete this tutorial:

[!INCLUDE [Azure-CLI-prepare-your-environment-no-header.md](~/articles/reusable-content/Azure-CLI/Azure-CLI-prepare-your-environment-no-header.md)]

## Create two instances of a web app

You need two instances of a web app, one for the frontend and one for the backend. You need to use at least the Basic SKU in order to use virtual network integration and private endpoints. You'll configure the virtual network integration and other configurations later on.

1. Create a resource group to manage all of the resources you're creating in this tutorial.

    ```azurecli-interactive
    # Save resource group name and region as variables for convenience
    groupName=myresourcegroup
    region=eastus

    az group create --name $groupName --location $region
    ```

### Create the App Service plan

1. Create an App Service plan. Replace `<app-service-plan-name>` with a unique name. Modify the `--sku` parameter if you need to use a different SKU. Ensure that you aren't using the free tier since that SKU doesn't support the required networking features.

    ```azurecli-interactive
    # Save App Service plan name as a variable for convenience
    aspName=<app-service-plan-name>

    az appservice plan create --name $aspName --resource-group $groupName --is-linux --location $region --sku P1V3
    ```

### Create web apps

1. Create the App Services. Replace `<frontend-app-name>` and `<backend-app-name>` with two globally unique names (valid characters are `a-z`, `0-9`, and `-`). For this tutorial, you're provided with sample Node.js apps. If you'd like to use your own apps, change the `--runtime` parameter accordingly. Run `az webapp list-runtimes` for the list of available runtimes.

    ```azurecli-interactive
    az webapp create --name <frontend-app-name> --resource-group $groupName --plan $aspName --runtime "NODE:18-lts"

    az webapp create --name <backend-app-name> --resource-group $groupName --plan $aspName --runtime "NODE:18-lts"
    ```

## Create network infrastructure

### Create virtual network and subnets

1. Create a virtual network. Replace `<virtual-network-name>` with a unique name.

    ```azurecli-interactive
    # Save vnet name as variable for convenience
    vnetName=<virtual-network-name>

    az network vnet create --resource-group $groupName --location $region --name $vnetName --address-prefixes 10.0.0.0/16
    ```

1. Create a subnet for the App Service virtual network integration.

    ```azurecli-interactive
    az network vnet subnet create --resource-group $groupName --vnet-name $vnetName --name vnet-integration-subnet --address-prefixes 10.0.0.0/24 --delegations Microsoft.Web/serverfarms --disable-private-endpoint-network-policies false
    ```

    For App Service, the virtual network integration subnet is recommended to have a CIDR block of `/26` at a minimum (see [Virtual network integration subnet requirements](overview-vnet-integration.md#subnet-requirements)). `/24` is more than sufficient. `--delegations Microsoft.Web/serverfarms` specifies that the subnet is [delegated for App Service virtual network integration](../virtual-network/subnet-delegation-overview.md).

1. Create another subnet for the private endpoints.

    ```azurecli-interactive
    az network vnet subnet create --resource-group $groupName --vnet-name $vnetName --name private-endpoint-subnet --address-prefixes 10.0.1.0/24 --disable-private-endpoint-network-policies true
    ```

    For private endpoint subnets, you must [disable private endpoint network policies](../private-link/disable-private-endpoint-network-policy.md).

### Create private DNS zone

Because your backend web app will sit behind a [private endpoint](../private-link/private-endpoint-overview.md), you need to define a [private DNS zone](../dns/private-dns-privatednszone.md) for it. This zone is used to host the DNS records for the private endpoint and allows the clients to find the backend web app by name. If you create the private endpoint using the portal, the Private DNS Zone is created automatically for you. For consistency with this tutorial, create the private DNS zone and private endpoint using the Azure CLI.

1. Create the private DNS zone.

    ```azurecli-interactive
    az network private-dns zone create --resource-group $groupName --name privatelink.azurewebsites.net
    ```

    For more information on these settings, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md#azure-services-dns-zone-configuration).

1. Link the private DNS zone to the virtual network.

    ```azurecli-interactive
    az network private-dns link vnet create --resource-group $groupName --name myDnsLink --zone-name privatelink.azurewebsites.net --virtual-network $vnetName --registration-enabled False
    ```

### Create private endpoint

1. In the private endpoint subnet of your virtual network, create a private endpoint for your backend web app. Replace `<backend-app-name>` with your backend web app name.

    ```azurecli-interactive
    # Get backend web app resource ID
    resourceId=$(az webapp show --resource-group $groupName --name <backend-app-name> --query id --output tsv)

    az network private-endpoint create --resource-group $groupName --name myPrivateEndpoint --location $region --connection-name myConnection --private-connection-resource-id $resourceId --group-id sites --vnet-name $vnetName --subnet private-endpoint-subnet
    ```

1. Create a DNS zone group for the backend web app private endpoint. DNS zone group is a link between the private DNS zone and the private endpoint. This link helps you to auto-update the private DNS Zone when there's an update to the private endpoint.  

    ```azurecli-interactive
    az network private-endpoint dns-zone-group create --resource-group $groupName --endpoint-name myPrivateEndpoint --name myZoneGroup --private-dns-zone privatelink.azurewebsites.net --zone-name privatelink.azurewebsites.net
    ```

When you create a private endpoint for an App Service, public access gets implicitly disabled. If you try to access your backend web app using its default URL, your access is denied. Navigate to `<backend-app-name>.azurewebsites.net` to confirm this behavior. 

:::image type="content" source="./media/tutorial-secure-ntier-app/backend-app-service-forbidden.png" alt-text="Screenshot of 403 error when trying to access backend web app directly.":::

For more information on App Service access restrictions with private endpoints, see [Azure App Service access restrictions](overview-access-restrictions.md#app-access). 

### Configure virtual network integration in your frontend web app

1. Enable virtual network integration on your app. Replace `<frontend-app-name>` with your frontend web app name.

    ```azurecli-interactive
    az webapp vnet-integration add --resource-group $groupName --name <frontend-app-name> --vnet $vnetName --subnet vnet-integration-subnet
    ```
    
    Virtual network integration allows outbound traffic to flow directly into the virtual network. By default, only local IP traffic defined in [RFC-1918](https://tools.ietf.org/html/rfc1918#section-3) is routed to the virtual network, which is what you need for the private endpoints. To route all your traffic to the virtual network, see [Manage virtual network integration routing](configure-vnet-integration-routing.md). Routing all traffic can also be used if you want to route internet traffic through your virtual network, such as through an [Azure Virtual Network NAT](../virtual-network/nat-gateway/nat-overview.md) or an [Azure Firewall](../firewall/overview.md).

## Disable basic auth

[Disabling basic auth on App Service](https://azure.github.io/AppService/2020/08/10/securing-data-plane-access.html) limits access to the FTP and SCM endpoints to users that are backed by Azure Active Directory (Azure AD), which further secures your apps. 

To disable basic auth for your App Service apps, run the following commands for each app. Replace `<frontend-app-name>` and `<backend-app-name>` with your app names. The first set of commands disables FTP access, and the second set of commands disables basic auth access to the WebDeploy ports and SCM sites.

```azurecli-interactive
az resource update --resource-group $groupName --name ftp --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<frontend-app-name> --set properties.allow=false

az resource update --resource-group $groupName --name ftp --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<backend-app-name> --set properties.allow=false
```

```azurecli-interactive
az resource update --resource-group $groupName --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<frontend-app-name> --set properties.allow=false

az resource update --resource-group $groupName --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<backend-app-name> --set properties.allow=false
```

For more information on disabling basic auth including how to test and monitor logins, see [Disabling basic auth on App Service](https://azure.github.io/AppService/2020/08/10/securing-data-plane-access.html).

## Update access restrictions to allow for continuous deployment

Since your backend web app isn't publicly accessible, you need to update its access restrictions so that your continuous deployment tool can reach your app. You need to update the access restrictions to the SCM site to make it publicly accessible. The main site can continue to deny all traffic. If you're concerned about enabling public access to the SCM site, or you're restricted by policy, consider [other App Service deployment options](deploy-run-package.md). 

In the previous step, you disabled basic auth to the SCM endpoint of the backend web app. This setting ensures that only Azure AD backed principals can access the SCM endpoint even though it's publicly accessible. This setting should reassure you that your backend web app is still secure. The access restrictions on your front end web app don't need to be changed.

To update the backed web app's [access restrictions for the SCM site](app-service-ip-restrictions.md#restrict-access-to-an-scm-site), run the following commands for the backend web app. Replace `<backend-app-name>` with your app name.

```azurecli-interactive
# Enable public access for the backend web app
az webapp update --resource-group $groupName --name <backend-app-name> --set publicNetworkAccess=Enabled

# Set the unmatched rule action for the main site to deny all traffic. This setting denies public access to the main site even though the general app access setting is set to allow public access.
az resource update --resource-group $groupName --name <backend-app-name> --namespace Microsoft.Web --resource-type sites --set properties.siteConfig.ipSecurityRestrictionsDefaultAction=Deny

# Set the unmatched rule action for the SCM/advanced tool site to allow all traffic
az resource update --resource-group $groupName --name <backend-app-name> --namespace Microsoft.Web --resource-type sites --set properties.siteConfig.scmIpSecurityRestrictionsDefaultAction=Allow
```

## Deploy source code using GitHub Actions and a service principal

### Prerequisites for source code deployment

Two Node.js apps are provided that are hosted on GitHub. If you don't already have a GitHub account, [create an account for free](https://github.com/).

1. Go to the [Node.js backend sample app](https://github.com/seligj95/nodejs-backend). This app is a simple Hello World app.
1. Select the **Fork** button in the upper right on the GitHub page.
1. Select the **Owner** and leave the default Repository name.
1. Select **Create** fork.
1. Repeat the same process for the [Node.js frontend sample app](https://github.com/seligj95/nodejs-frontend). This app is a basic web scraping app.

If using a continuous deployment tool to deploy your application source code, as what is done in this tutorial in the upcoming sections, disabling basic auth requires [extra steps to configure continuous deployment](deploy-github-actions.md). For example, you can't use a publish profile since that authentication mechanism doesn't use Azure AD backed credentials. Instead, either use a [service principal or OpenID Connect](deploy-github-actions.md#generate-deployment-credentials).

### Create the service principal and configure credentials with GitHub Actions

To configure continuous deployment with GitHub Actions and a service principal, use the following steps.

1. Run the following command to create the [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object). Replace `<subscription-id>`, `<frontend-app-name>`, and `<backend-app-name>` with your values. The output is a JSON object with the role assignment credentials that provide access to your App Service apps. Copy this JSON object for the next step. It includes your client secret, which is only visible at this time. It's always a good practice to grant minimum access. The scope in this example is limited to just the apps, not the entire resource group.

    ```azurecli-interactive
    az ad sp create-for-rbac --name "myApp" --role contributor --scopes /subscriptions/<subscription-id>/resourceGroups/$groupName/providers/Microsoft.Web/sites/<frontend-app-name> /subscriptions/<subscription-id>/resourceGroups/$groupName/providers/Microsoft.Web/sites/<backend-app-name> --sdk-auth
    ```

1. You need to provide your service principal's credentials to the Azure Login action as part of the GitHub Action workflow you're using. These values can either be provided directly in the workflow or can be stored in GitHub secrets and referenced in your workflow. Saving the values as GitHub secrets is the more secure option.
    1. Go to one of your GitHub repositories and go to **Settings** > **Security** > **Secrets and variables** > **Actions** 
    1. Select **New repository secret** and create a secret for each of the following values. The values can be found in the json output you copied earlier.

        |Name                     |Value                      |
        |-------------------------|---------------------------|
        |AZURE_APP_ID             |`<application/client-id>`  |
        |AZURE_PASSWORD           |`<client-secret>`          |
        |AZURE_TENANT_ID          |`<tenant-id>`              |
        |AZURE_SUBSCRIPTION_ID    |`<subscription-id>`        |
    1. Repeat this process for your other GitHub repository.

### Configure continuous deployment

To set up continuous deployment, you should use the Azure portal. For detailed guidance on how to configure continuous deployment with providers such as GitHub Actions, see [Continuous deployment to Azure App Service](deploy-continuous-deployment.md).

1. In the [Azure portal](https://portal.azure.com), go to the **Overview** page for your frontend web app.
1. In the left pane, select **Deployment Center**. Then select **Settings**. 
1. In the **Source** box, select "GitHub" from the CI/CD options.

    :::image type="content" source="media/app-service-continuous-deployment/choose-source.png" alt-text="Screenshot that shows how to choose the deployment source":::

1. If you're deploying from GitHub for the first time, select **Authorize** and follow the authorization prompts. If you want to deploy from a different user's repository, select **Change Account**.
1. After you authorize your Azure account with GitHub, select the **Organization**, **Repository**, and **Branch** to configure CI/CD for. If you can’t find an organization or repository, you might need to enable more permissions on GitHub. For more information, see [Managing access to your organization's repositories](https://docs.github.com/organizations/managing-access-to-your-organizations-repositories).

    1. If you're using the Node.js sample app that was forked as part of the prerequisites, use the following settings.
        
        |Setting       |Value                        |
        |--------------|-----------------------------|
        |Organization  |`<your-GitHub-organization>` |
        |Repository    |nodejs-frontend              |
        |Branch        |main                         |
        
1. Select **Save**.

    New commits in the selected repository and branch now deploy continuously into your App Service app. You can track the commits and deployments on the **Logs** tab.

    A default workflow file that uses a publish profile to authenticate to App Service is added to your GitHub repository. You can view this file by going to the `<repo-name>/.github/workflows/` directory.

1. Repeat the same steps for your backend web app. The inputs for the continuous deployment settings are given in the table.
    
    |Setting       |Value                        |
    |--------------|-----------------------------|
    |Organization  |`<your-GitHub-organization>` |
    |Repository    |nodejs-backend               |
    |Branch        |main                         |

### Create the GitHub Actions workflow

Now that you have a service principal that can access your App Service apps, edit the default workflows that were created for your apps when you configured continuous deployment. Authentication must be done using your service principal instead of the publish profile. For sample workflows, see the "Service principal" tab in [Deploy to App Service](deploy-github-actions.md#deploy-to-app-service). The following sample workflow can be used for the Node.js sample apps that are provided in this tutorial.

1. Open one of your app's GitHub repositories and go to the `<repo-name>/.github/workflows/` directory. There's an autogenerated workflow that uses the publish profile to authenticate.
1. Select the workflow file and then select the "pencil" button in the top right to edit the file. Replace the contents with the following text, which assumes you created the GitHub secrets earlier for your credential. Update the placeholder for `<web-app-name>` under the "env" section, and then commit directly to the main branch. This commit triggers the GitHub Action to run again and deploy your code, this time using the service principal to authenticate.

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
              package: ${{ env.AZURE_WEBAPP_PACKAGE_PATH }}
              
          - name: logout
            run: |
              az logout
    ```

1. Repeat this process for the other workflow in your other GitHub repository.

Completing these steps triggers another deployment to your apps. Unlike previous attempts that failed due to authentication errors, this deployment should succeed since it's now using the service principal to authenticate to your apps.

## Validate connections and app access

1. You can now browse to the frontend web app by going to `<frontend-app-name>.azurewebsites.net` and all **outbound** traffic from the frontend web app is routed through the virtual network. Your frontend web app is securely connecting to your backend web app via the private endpoint. 

    In the textbox, input the URL for your backend web app, which should look like `https://<backend-app-name>.azurewebsites.net`. If you set up the connections properly, you should get the message "Hello from the backend web app!", which is the entire content of the backend web app. If something is wrong with your connections, your frontend web app crashes.

1. If you haven't already, try navigating to your backend web app to verify that direct access is forbidden. The URL is `https://<backend-app-name>.azurewebsites.net`. If you can reach your backend web app, ensure you've configured the private endpoint and that the access restrictions for your app are set to Deny all traffic for the main site.

1. To further validate that the frontend web app is reaching the backend web app over private link, SSH to one of your front end's instances. To SSH, run the following command, which establishes an SSH session to the web container of your app and opens a remote shell in your browser.

    ```azurecli-interactive
    az webapp ssh --resource-group $groupName --name <frontend-app-name>
    ```

    When the shell opens in your browser, run "nslookup" to confirm your backend web app is being reached using the private IP of your backend web app. You can also run "curl" to validate the site content again. Replace `<backend-app-name>` with your backend web app name.

    ```bash
    nslookup <backend-app-name>.azurewebsites.net

    curl https://<backend-app-name>.azurewebsites.net
    ```
    
    :::image type="content" source="./media/tutorial-secure-ntier-app/frontend-ssh-validation.png" alt-text="Screenshot of SSH session showing how to validate app connections.":::

    If you've configured everything correctly, the "nslookup" should resolve the private IP of your backend web app. The private IP address should be an address from your virtual network. To confirm your private IP, go to the **Networking** page for your backend web app. 

    :::image type="content" source="./media/tutorial-secure-ntier-app/backend-app-service-inbound-ip.png" alt-text="Screenshot of App Service Networking page showing the inbound IP of the app.":::

1. Repeat the same "nslookup" and "curl" commands from another terminal (one that isn't an SSH session on your frontend’s instances). 

    :::image type="content" source="./media/tutorial-secure-ntier-app/frontend-ssh-external.png" alt-text="Screenshot of an external terminal doing a nslookup and curl of the backend web app.":::

    The "nslookup" returns the public IP for the backend web app. Since public access to the backend web app is disabled, if you try to reach the public IP, you get an access denied error. This error means this site isn't accessible from the public internet, which is the intended behavior. The nslookup doesn’t resolve the private IP because that can only be reached from within the virtual network using the private endpoint. Only the frontend web app is within the virtual network. If you try to do a "curl" on the backend web app from the external terminal, the HTML that is returned contains “Web App - Unavailable”. This error displays the HTML for the error page you saw earlier when you tried navigating to the backend web app in your browser.

## Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, delete the resource group by running the following command in the Cloud Shell.

```azurecli-interactive
az group delete --name myresourcegroup
```

This command may take a few minutes to run.

## Deploy from ARM/Bicep

The resources you created in this tutorial can be deployed using an ARM/Bicep template. The [App connected to a backend web app Bicep template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-privateendpoint-vnet-injection) allows you to create a secure n-tier app solution.

To learn how to deploy ARM/Bicep templates, see [How to deploy resources with Bicep and Azure CLI](../azure-resource-manager/bicep/deploy-cli.md).

## Next steps

> [!div class="nextstepaction"]
> [Integrate your app with an Azure virtual network](overview-vnet-integration.md)

> [!div class="nextstepaction"]
> [App Service networking features](networking-features.md)

> [!div class="nextstepaction"]
> [Reliable web app pattern planning (.NET)](/azure/architecture/reference-architectures/reliable-web-app/dotnet/pattern-overview.md)