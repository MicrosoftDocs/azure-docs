---
title: 'Tutorial: Create a secure N-tier web app'
description: Learn how to securely deploy your N-tier web app to Azure App Service.
author: seligj95
ms.topic: tutorial
ms.custom: devx-track-azurecli
ms.date: 2/25/2023
ms.author: jordanselig
---

# Tutorial: Create a secure n-tier app in Azure App Service

Many applications have more than a single component. For example, you may have a front end that is publicly accessible and connects to a back-end API or web app which in turn connects to a database, storage account, key vault, another VM, or a combination of these resources. This architecture makes up an N-tier application. It's important that applications like this are architected to protect back-end resources to the greatest extent possible.

In this tutorial, you learn how to deploy a secure N-tier application, with a front-end web app that connects to another network-isolated web app. All traffic is isolated within your Azure Virtual Network using [Virtual Network integration](overview-vnet-integration.md) and [private endpoints](networking/private-endpoint.md). For more comprehensive guidance that includes other scenarios, see: 

- [Multi-region N-tier application](/azure/architecture/reference-architectures/n-tier/multi-region-sql-server)
- [Reliable web app pattern planning (.NET)](/azure/architecture/reference-architectures/reliable-web-app/dotnet/pattern-overview).

## Scenario architecture

The following diagram shows the architecture you'll create during this tutorial.

:::image type="content" source="./media/tutorial-secure-ntier-app/n-tier-app-service-architecture.png" alt-text="Architecture diagram of an n-tier App Service.":::

- **Virtual network**  Contains two subnets, one is integrated with the front-end web app, and the other has a private endpoint for the back-end web app. The virtual network blocks all inbound network traffic, except for the front-end app that's integrated with it.
- **Front-end web app**  Integrated into the virtual network and accessible from the public internet. 
- **Back-end web app**  Accessible only through the private endpoint in the virtual network.
- **Private endpoint**  Integrates with the back-end web app and makes the web app accessible with a private IP address.
- **Private DNS zone**  Lets you resolve a DNS name to the private endpoint's IP address.

> [!NOTE]
> Virtual network integration and private endpoints are available all the way down to the **Basic** tier in App Service. The **Free** tier doesn't support these features.
With this architecture:

- Public traffic to the back-end app is blocked.
- Outbound traffic from App Service is routed to the virtual network and can reach the back-end app.
- App Service is able to perform DNS resolution to the back-end app.

This scenario shows one of the possible N-tier scenarios in App Service. You can use the concepts covered in this tutorial to build more complex N-tier apps.

What you'll learn:

> [!div class="checklist"]
> * Create a virtual network and subnets for App Service virtual network integration.
> * Create private DNS zones.
> * Create private endpoints.
> * Configure virtual network integration in App Service.
> * Disable basic auth in app service.
> * Continuously deploy to a locked down backend web app.

## Prerequisites

The tutorial uses two sample Node.js apps that are hosted on GitHub. If you don't already have a GitHub account, [create an account for free](https://github.com/).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

To complete this tutorial:

[!INCLUDE [Azure-CLI-prepare-your-environment-no-header.md](~/reusable-content/Azure-CLI/Azure-CLI-prepare-your-environment-no-header.md)]

## 1. Create two instances of a web app

You need two instances of a web app, one for the frontend and one for the backend. You need to use at least the **Basic** tier in order to use virtual network integration and private endpoints. You'll configure the virtual network integration and other configurations later on.

1. Create a resource group to manage all of the resources you're creating in this tutorial.

    ```azurecli-interactive
    # Save resource group name and region as variables for convenience
    groupName=myresourcegroup
    region=eastus
    az group create --name $groupName --location $region
    ```

1. Create an App Service plan. Replace `<app-service-plan-name>` with a unique name. Modify the `--sku` parameter if you need to use a different SKU. Ensure that you aren't using the free tier since that SKU doesn't support the required networking features.

    ```azurecli-interactive
    # Save App Service plan name as a variable for convenience
    aspName=<app-service-plan-name>
    az appservice plan create --name $aspName --resource-group $groupName --is-linux --location $region --sku P1V3
    ```

1. Create the web apps. Replace `<frontend-app-name>` and `<backend-app-name>` with two globally unique names (valid characters are `a-z`, `0-9`, and `-`). For this tutorial, you're provided with sample Node.js apps. If you'd like to use your own apps, change the `--runtime` parameter accordingly. Run `az webapp list-runtimes` for the list of available runtimes.

    ```azurecli-interactive
    az webapp create --name <frontend-app-name> --resource-group $groupName --plan $aspName --runtime "NODE:18-lts"
    az webapp create --name <backend-app-name> --resource-group $groupName --plan $aspName --runtime "NODE:18-lts"
    ```

## 2. Create network infrastructure

You'll create the following network resources:

- A virtual network.
- A subnet for the App Service virtual network integration.
- A subnet for the private endpoint.
- A private DNS zone.
- A private endpoint.

1. Create a *virtual network*. Replace `<virtual-network-name>` with a unique name.

    ```azurecli-interactive
    # Save vnet name as variable for convenience
    vnetName=<virtual-network-name>
    az network vnet create --resource-group $groupName --location $region --name $vnetName --address-prefixes 10.0.0.0/16
    ```

1. Create a *subnet for the App Service virtual network integration*.

    ```azurecli-interactive
    az network vnet subnet create --resource-group $groupName --vnet-name $vnetName --name vnet-integration-subnet --address-prefixes 10.0.0.0/24 --delegations Microsoft.Web/serverfarms --disable-private-endpoint-network-policies false
    ```

    For App Service, the virtual network integration subnet is recommended to [have a CIDR block of `/26` at a minimum](overview-vnet-integration.md#subnet-requirements). `/24` is more than sufficient. `--delegations Microsoft.Web/serverfarms` specifies that the subnet is [delegated for App Service virtual network integration](../virtual-network/subnet-delegation-overview.md).

1. Create another *subnet for the private endpoints*.

    ```azurecli-interactive
    az network vnet subnet create --resource-group $groupName --vnet-name $vnetName --name private-endpoint-subnet --address-prefixes 10.0.1.0/24 --disable-private-endpoint-network-policies true
    ```

    For private endpoint subnets, you must [disable private endpoint network policies](../private-link/disable-private-endpoint-network-policy.md) by setting `--disable-private-endpoint-network-policies` to `true`.

1. Create the *private DNS zone*.

    ```azurecli-interactive
    az network private-dns zone create --resource-group $groupName --name privatelink.azurewebsites.net
    ```

    For more information on these settings, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md#azure-services-dns-zone-configuration).

    > [!NOTE]
    > If you create the private endpoint using the portal, a private DNS zone is created automatically for you and you don't need to create it separately. For consistency with this tutorial, you create the private DNS zone and private endpoint separately using the Azure CLI.

1. Link the private DNS zone to the virtual network.

    ```azurecli-interactive
    az network private-dns link vnet create --resource-group $groupName --name myDnsLink --zone-name privatelink.azurewebsites.net --virtual-network $vnetName --registration-enabled False
    ```

1. In the private endpoint subnet of your virtual network, create a *private endpoint* for your backend web app. Replace `<backend-app-name>` with your backend web app name.

    ```azurecli-interactive
    # Get backend web app resource ID
    resourceId=$(az webapp show --resource-group $groupName --name <backend-app-name> --query id --output tsv)
    az network private-endpoint create --resource-group $groupName --name myPrivateEndpoint --location $region --connection-name myConnection --private-connection-resource-id $resourceId --group-id sites --vnet-name $vnetName --subnet private-endpoint-subnet
    ```

1. Link the private endpoint to the private DNS zone with a DNS zone group for the backend web app private endpoint. This DNS zone group helps you to auto-update the private DNS Zone when there's an update to the private endpoint.  

    ```azurecli-interactive
    az network private-endpoint dns-zone-group create --resource-group $groupName --endpoint-name myPrivateEndpoint --name myZoneGroup --private-dns-zone privatelink.azurewebsites.net --zone-name privatelink.azurewebsites.net
    ```

1. When you create a private endpoint for an App Service, public access gets implicitly disabled. If you try to access your backend web app using its default URL, your access is denied. From a browser, navigate to `<backend-app-name>.azurewebsites.net` to confirm this behavior. 

    :::image type="content" source="./media/tutorial-secure-ntier-app/backend-app-service-forbidden.png" alt-text="Screenshot of 403 error when trying to access backend web app directly.":::

    For more information on App Service access restrictions with private endpoints, see [Azure App Service access restrictions](overview-access-restrictions.md#app-access). 

## 3. Configure virtual network integration in your frontend web app

Enable virtual network integration on your app. Replace `<frontend-app-name>` with your frontend web app name.

```azurecli-interactive
az webapp vnet-integration add --resource-group $groupName --name <frontend-app-name> --vnet $vnetName --subnet vnet-integration-subnet
```

Virtual network integration allows outbound traffic to flow directly into the virtual network. By default, only local IP traffic defined in [RFC-1918](https://tools.ietf.org/html/rfc1918#section-3) is routed to the virtual network, which is what you need for the private endpoints. To route all your traffic to the virtual network, see [Manage virtual network integration routing](configure-vnet-integration-routing.md). Routing all traffic can also be used if you want to route internet traffic through your virtual network, such as through an [Azure Virtual Network NAT](../virtual-network/nat-gateway/nat-overview.md) or an [Azure Firewall](../firewall/overview.md).

## 4. Enable deployment to back-end web app from internet

Since your backend web app isn't publicly accessible, you must let your continuous deployment tool reach your app by [making the SCM site publicly accessible](app-service-ip-restrictions.md#restrict-access-to-an-scm-site). The main web app itself can continue to deny all traffic.

1. Enable public access for the back-end web app.

    ```azurecli-interactive
    az webapp update --resource-group $groupName --name <backend-app-name> --set publicNetworkAccess=Enabled
    ```

1.  Set the unmatched rule action for the main web app to deny all traffic. This setting denies public access to the main web app even though the general app access setting is set to allow public access.

    ```azurecli-interactive
    az resource update --resource-group $groupName --name <backend-app-name> --namespace Microsoft.Web --resource-type sites --set properties.siteConfig.ipSecurityRestrictionsDefaultAction=Deny
    ```

1. Set the unmatched rule action for the SCM site to allow all traffic.

    ```azurecli-interactive
    az resource update --resource-group $groupName --name <backend-app-name> --namespace Microsoft.Web --resource-type sites --set properties.siteConfig.scmIpSecurityRestrictionsDefaultAction=Allow
    ```

## 5. Lock down FTP and SCM access

Now that the back-end SCM site is publicly accessible, you need to lock it down with better security.

1. Disable FTP access for both the front-end and back-end web apps. Replace `<frontend-app-name>` and `<backend-app-name>` with your app names.

    ```azurecli-interactive
    az resource update --resource-group $groupName --name ftp --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<frontend-app-name> --set properties.allow=false
    az resource update --resource-group $groupName --name ftp --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<backend-app-name> --set properties.allow=false
    ```

1. Disable basic auth access to the WebDeploy ports and SCM/advanced tool sites for both web apps. Replace `<frontend-app-name>` and `<backend-app-name>` with your app names.

    ```azurecli-interactive
    az resource update --resource-group $groupName --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<frontend-app-name> --set properties.allow=false
    az resource update --resource-group $groupName --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<backend-app-name> --set properties.allow=false
    ```

[Disabling basic auth on App Service](https://azure.github.io/AppService/2020/08/10/securing-data-plane-access.html) limits access to the FTP and SCM endpoints to users that are backed by Microsoft Entra ID, which further secures your apps. For more information on disabling basic auth including how to test and monitor logins, see [Disabling basic auth on App Service](https://azure.github.io/AppService/2020/08/10/securing-data-plane-access.html).

## 6. Configure continuous deployment using GitHub Actions

1. Navigate to the [Node.js backend sample app](https://github.com/seligj95/nodejs-backend). This app is a simple Hello World app.
1. Select the **Fork** button in the upper right on the GitHub page.
1. Select the **Owner** and leave the default Repository name.
1. Select **Create** fork.
1. Repeat the same process for the [Node.js frontend sample app](https://github.com/seligj95/nodejs-frontend). This app is a basic web app that accesses a remote URL.

1. Create a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object). Replace `<subscription-id>`, `<frontend-app-name>`, and `<backend-app-name>` with your values.

    ```azurecli-interactive
    az ad sp create-for-rbac --name "myApp" --role contributor --scopes /subscriptions/<subscription-id>/resourceGroups/$groupName/providers/Microsoft.Web/sites/<frontend-app-name> /subscriptions/<subscription-id>/resourceGroups/$groupName/providers/Microsoft.Web/sites/<backend-app-name> --sdk-auth
    ```

    The output is a JSON object with the role assignment credentials that provide access to your App Service apps. Copy this JSON object for the next step. It includes your client secret, which is only visible at this time. It's always a good practice to grant minimum access. The scope in this example is limited to just the apps, not the entire resource group.

1. To store the service principal's credentials as GitHub secrets, go to one of the forked sample repositories in GitHub and go to **Settings** > **Security** > **Secrets and variables** > **Actions**.
1. Select **New repository secret** and create a secret for each of the following values. The values can be found in the json output you copied earlier.

    |Name                     |Value                      |
    |-------------------------|---------------------------|
    |AZURE_APP_ID             |`<application/client-id>`  |
    |AZURE_PASSWORD           |`<client-secret>`          |
    |AZURE_TENANT_ID          |`<tenant-id>`              |
    |AZURE_SUBSCRIPTION_ID    |`<subscription-id>`        |

1. Repeat this process for the other forked sample repository.

1. To set up continuous deployment with GitHub Actions, sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to the **Overview** page for your front-end web app.
1. In the left pane, select **Deployment Center**. Then select **Settings**. 
1. In the **Source** box, select "GitHub" from the CI/CD options.

    :::image type="content" source="media/app-service-continuous-deployment/choose-source.png" alt-text="Screenshot that shows how to choose the deployment source.":::

1. If you're deploying from GitHub for the first time, select **Authorize** and follow the authorization prompts. If you want to deploy from a different user's repository, select **Change Account**.

1. If you're using the Node.js sample app that was forked as part of the prerequisites, use the following settings for **Organization**, **Repository**, and **Branch**.

    |Setting       |Value                        |
    |--------------|-----------------------------|
    |Organization  |`<your-GitHub-organization>` |
    |Repository    |nodejs-frontend              |
    |Branch        |main                         |

1. Select **Save**.

1. Repeat the same steps for your back-end web app. The Deployment Center settings are given in the following table.

    |Setting       |Value                        |
    |--------------|-----------------------------|
    |Organization  |`<your-GitHub-organization>` |
    |Repository    |nodejs-backend               |
    |Branch        |main                         |

## 7. Use a service principal for GitHub Actions deployment

Your Deployment Center configuration has created a default workflow file in each of your sample repositories, but it uses a publish profile by default, which uses basic auth. Since you've disabled basic auth, if you check the **Logs** tab in Deployment Center, you'll see that the automatically triggered deployment results in an error. You must modify the workflow file to use the service principal to authenticate with App Service. For sample workflows, see [Add the workflow file to your GitHub repository](deploy-github-actions.md?tabs=userlevel#3-add-the-workflow-file-to-your-github-repository).

1. Open one of your forked GitHub repositories and go to the `<repo-name>/.github/workflows/` directory.

1. Select the auto-generated workflow file and then select the "pencil" button in the top right to edit the file. Replace the contents with the following text, which assumes you created the GitHub secrets earlier for your credential. Update the placeholder for `<web-app-name>` under the "env" section, and then commit directly to the main branch. This commit triggers the GitHub Action to run again and deploy your code, this time using the service principal to authenticate.

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

1. Repeat this process for the workflow file in your other forked GitHub repository.

The new GitHub commits trigger another deployment for each of your apps. This time, deployment should succeed since the workflow uses the service principal to authenticate with the apps' SCM sites.

For detailed guidance on how to configure continuous deployment with providers such as GitHub Actions, see [Continuous deployment to Azure App Service](deploy-continuous-deployment.md).

## 8. Validate connections and app access

1. Browse to the front-end web app with its URL: `https://<frontend-app-name>.azurewebsites.net`. 

1. In the textbox, input the URL for your backend web app: `https://<backend-app-name>.azurewebsites.net`. If you set up the connections properly, you should get the message "Hello from the backend web app!", which is the entire content of the backend web app. All *outbound* traffic from the front-end web app is routed through the virtual network. Your frontend web app is securely connecting to your backend web app through the private endpoint. If something is wrong with your connections, your frontend web app crashes.

1. Try navigating directly to your backend web app with its URL: `https://<backend-app-name>.azurewebsites.net`. You should see the message `Web App - Unavailable`. If you can reach the app, ensure you've configured the private endpoint and that the access restrictions for your app are set to deny all traffic for the main web app.

1. To further validate that the frontend web app is reaching the backend web app over private link, SSH to one of your front end's instances. To SSH, run the following command, which establishes an SSH session to the web container of your app and opens a remote shell in your browser.

    ```azurecli-interactive
    az webapp ssh --resource-group $groupName --name <frontend-app-name>
    ```

1. When the shell opens in your browser, run `nslookup` to confirm your back-end web app is being reached using the private IP of your backend web app. You can also run `curl` to validate the site content again. Replace `<backend-app-name>` with your backend web app name.

    ```bash
    nslookup <backend-app-name>.azurewebsites.net
    curl https://<backend-app-name>.azurewebsites.net
    ```

    :::image type="content" source="./media/tutorial-secure-ntier-app/frontend-ssh-validation.png" alt-text="Screenshot of SSH session showing how to validate app connections.":::

    The `nslookup` should resolve to the private IP address of your back-end web app. The private IP address should be an address from your virtual network. To confirm your private IP, go to the **Networking** page for your back-end web app. 

    :::image type="content" source="./media/tutorial-secure-ntier-app/backend-app-service-inbound-ip.png" alt-text="Screenshot of App Service Networking page showing the inbound IP of the app.":::

1. Repeat the same `nslookup` and `curl` commands from another terminal (one that isn't an SSH session on your front end’s instances). 

    :::image type="content" source="./media/tutorial-secure-ntier-app/frontend-ssh-external.png" alt-text="Screenshot of an external terminal doing a nslookup and curl of the back-end web app.":::

    The `nslookup` returns the public IP for the back-end web app. Since public access to the back-end web app is disabled, if you try to reach the public IP, you get an access denied error. This error means this site isn't accessible from the public internet, which is the intended behavior. The `nslookup` doesn’t resolve to the private IP because that can only be resolved from within the virtual network through the private DNS zone. Only the front-end web app is within the virtual network. If you try to run `curl` on the back-end web app from the external terminal, the HTML that is returned contains `Web App - Unavailable`. This error displays the HTML for the error page you saw earlier when you tried navigating to the back-end web app in your browser.

## 9. Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, delete the resource group by running the following command in the Cloud Shell.

```azurecli-interactive
az group delete --name myresourcegroup
```

This command may take a few minutes to run.

## Frequently asked questions

- [Is there an alternative to deployment using a service principal?](#is-there-an-alternative-to-deployment-using-a-service-principal)
- [What happens when I configure GitHub Actions deployment in App Service?](#what-happens-when-i-configure-github-actions-deployment-in-app-service)
- [Is it safe to leave the back-end SCM publicly accessible?](#is-it-safe-to-leave-the-back-end-scm-publicly-accessible)
- [Is there a way to deploy without opening up the back-end SCM site at all?](#is-there-a-way-to-deploy-without-opening-up-the-back-end-scm-site-at-all)
- [How can I deploy this architecture with ARM/Bicep?](#how-can-i-deploy-this-architecture-with-armbicep)

#### Is there an alternative to deployment using a service principal?

Since in this tutorial you've [disabled basic auth](#5-lock-down-ftp-and-scm-access), you can't authenticate with the back end SCM site with a username and password, and neither can you with a publish profile. Instead of a service principal, you can also use [OpenID Connect](deploy-github-actions.md?tabs=openid).

#### What happens when I configure GitHub Actions deployment in App Service?

Azure auto-generates a workflow file in your repository. New commits in the selected repository and branch now deploy continuously into your App Service app. You can track the commits and deployments on the **Logs** tab.

A default workflow file that uses a publish profile to authenticate to App Service is added to your GitHub repository. You can view this file by going to the `<repo-name>/.github/workflows/` directory.

#### Is it safe to leave the back-end SCM publicly accessible?

When you [lock down FTP and SCM access](#5-lock-down-ftp-and-scm-access), it ensures that only Microsoft Entra backed principals can access the SCM endpoint even though it's publicly accessible. This setting should reassure you that your backend web app is still secure.

#### Is there a way to deploy without opening up the back-end SCM site at all?

If you're concerned about enabling public access to the SCM site, or you're restricted by policy, consider other App Service deployment options like [running from a ZIP package](deploy-run-package.md).

#### How can I deploy this architecture with ARM/Bicep?

The resources you created in this tutorial can be deployed using an ARM/Bicep template. The [App connected to a backend web app Bicep template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-privateendpoint-vnet-injection) allows you to create a secure N-tier app solution.

To learn how to deploy ARM/Bicep templates, see [How to deploy resources with Bicep and Azure CLI](../azure-resource-manager/bicep/deploy-cli.md).

## Next steps

> [!div class="nextstepaction"]
> [Integrate your app with an Azure virtual network](overview-vnet-integration.md)
> [!div class="nextstepaction"]
> [App Service networking features](networking-features.md)
> [!div class="nextstepaction"]
> [Reliable web app pattern planning (.NET)](/azure/architecture/reference-architectures/reliable-web-app/dotnet/pattern-overview)
