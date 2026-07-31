---
title: 'Tutorial: Create Secure N-tier Web App'
description: Securely deploy your N-tier web app to Azure App Service. Create a virtual network and subnets, private DNS zones, and private endpoints, and configure virtual network integration.
author: seligj95
ms.topic: tutorial
ms.date: 04/15/2026
ms.author: jordanselig
ms.service: azure-app-service
ms.custom:
  - devx-track-azurecli
  - build-2025
  - sfi-image-nochange
  - sfi-ropc-nochange

#customer intent: As an App Service developer, I want to set up virtual network integration with private DNS zones and endpoints, so I can securely deploy my N-tier web app.
---

# Tutorial: Create a secure N-tier app in Azure App Service

Many applications have more than a single component. For example, you might have a frontend that's publicly accessible and connects to a backend API or web app. The backend resources might connect to a database, storage account, key vault, another virtual machine, or a combination of these resources. This architecture is the foundation of an N-tier application. It's important that applications like this are architected to protect backend resources to the greatest extent possible.

This tutorial describes how to deploy a secure N-tier application with a frontend web app that connects to another network-isolated web app. All traffic is isolated within your Azure Virtual Network by using [Virtual Network integration](overview-vnet-integration.md) and [private endpoints](overview-private-endpoint.md). For more comprehensive guidance that includes other scenarios, see: 

- [Multi-region application load-balancing](/azure/architecture/high-availability/traffic-manager-application-gateway)
- [Reliable web app pattern for .NET](/azure/architecture/web-apps/guides/enterprise-app-patterns/reliable-web-app/dotnet/guidance)

In this tutorial, you:

> [!div class="checklist"]
> * Create a virtual network and subnets for App Service virtual network integration
> * Create private DNS zones and private endpoints
> * Configure virtual network integration in App Service
> * Disable basic authentication in App service
> * Continuously deploy to a locked down backend web app

## Prerequisites

The tutorial uses two sample Node.js apps hosted on GitHub. If you don't already have a GitHub account, [create an account for free](https://github.com/).

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

To complete this tutorial:

[!INCLUDE [Azure-CLI-prepare-your-environment-no-header.md](~/reusable-content/Azure-CLI/Azure-CLI-prepare-your-environment-no-header.md)]

## Review the scenario architecture

This tutorial demonstrates how to configure an architecture illustrated in the following diagram. The scenario represents one of the possible N-tier configurations in App Service. You can use the concepts covered in this tutorial to build more complex N-tier apps.

:::image type="content" source="./media/tutorial-secure-ntier-app/n-tier-app-service-architecture.png" border="false" alt-text="Diagram of the architecture for an N-tier App Service, including virtual network integration with a frontend app and private endpoint on the backend.":::

- The architecture has a **virtual network** that contains two subnets. One subnet is integrated with the frontend web app, and the other subnet has a private endpoint for the backend web app. The virtual network blocks all inbound network traffic, except traffic that targets the integrated frontend app.

- A **frontend web app** is integrated into the virtual network and accessible from the public internet. 

- A **backend web app** is accessible only through the private endpoint in the virtual network.

- A **private endpoint** integrates with the backend web app and makes the web app accessible through a private IP address.

- A **Private DNS zone** enables resolution of a DNS name to the private endpoint IP address.

> [!NOTE]
> To configure virtual network integration and private endpoints, you need the **Basic** tier of Azure App Service or a higher tier. The **Free** tier doesn't support these features.

The scenario in this tutorial provides the following behavior:

- Public traffic to the backend app is blocked.
- Outbound traffic from App Service routes to the virtual network and can reach the backend app.
- App Service can perform DNS resolution to the backend app.

## Create the two web apps

You need two App Service web apps, one for the frontend and one for the backend. The apps can run in the same region location. To set up virtual network integration and work with private endpoints, use at least the **Basic** tier of Azure App Service. You configure the virtual network integration and other settings later.

1. Create a resource group to manage all resources for this tutorial.

   Set the `<resource-group>` placeholder to the name for your new resource group, such as `zava-resources`. Set the `<region-location>` placeholder to the region for your new resource group, such as `eastus`.

   ```azurecli-interactive
   # Define variables for the resource group name and region location
   resourceGroupName=<resource-group>
   regionLocation=<region-location>

   # Create the resource group
   az group create --name $resourceGroupName --location $regionLocation
   ```

   For more information, see the [az group create](/cli/azure/afd/profile#az-group-create) command reference.

1. Create an App Service plan for your resources.

   Set the `<app-service-plan>` placeholder to the name for your new App Service plan, such as `zava-app-service-plan`.
   
   The tutorial example sets the `--sku` parameter to `P1V3` (Premium V3). You can use this value or specify a different SKU. The SKU must support the required networking features for this tutorial. Select the **Basic** tier or higher.

   ```azurecli-interactive
   # Define a variable for the App Service plan name
   appServicePlanName=<app-service-plan>

   # Create the App Service plan
   az appservice plan create --name $appServicePlanName --resource-group $resourceGroupName --is-linux --location $regionLocation --sku P1V3
   ```

   For more information, see the [az appservice plan create](/cli/azure/afd/profile#az-appservice-plan-create) command reference.

1. Create the frontend and backend web apps.

   The tutorial example creates two sample Node.js apps, where the runtime language version is `NODE:24-lts`. If you prefer to use your own apps, set the `--runtime` parameter `<language-version>` value accordingly. You can run the `az webapp list-runtimes` command for the list of available runtimes:

   ```azurecli-interactive
   az webapp list-runtimes
   ```

   Set the `<frontend-app-name>` placeholder to the name for your new frontend web app, such as `zava-frontend-app`. The name must be globally unique and consist of valid characters (`a-z`, `0-9`, `-`). Likewise, set the `<backend-app-name>` placeholder to the name for your new backend web app, such as `zava-backend-app`.   

   ```azurecli-interactive
   # Define variables for the App Service web app names
   frontendAppName=<frontend-app-name>
   backendAppName=<backend-app-name>

   # Create the web apps
   az webapp create --name $frontendAppName --resource-group $resourceGroupName --plan $appServicePlanName --runtime "NODE:24-lts"
   az webapp create --name $backendAppName  --resource-group $resourceGroupName --plan $appServicePlanName --runtime "NODE:24-lts"
   ```

   For more information, see the [az webapp create](/cli/azure/afd/profile#az-webapp-create) command reference.

## Create the network infrastructure

The virtual network infrastructure consists of the following resources:

- An Azure Virtual Network instance
- A subnet for the App Service virtual network integration
- Another subnet for the private endpoint
- An Azure Private DNS zone
- A private endpoint

1. Create an Azure virtual network.

   Set the `<virtual-network-name>` placeholder to the name for your new virtual network, such as `zava-virtual-network`. The name must be globally unique.

   ```azurecli-interactive
   # Define a variable for the virtual network name
   virtualNetworkName=<virtual-network-name>

   # Create the virtual network
   az network vnet create --resource-group $resourceGroupName --location $regionLocation --name $virtualNetworkName --address-prefixes 10.0.0.0/16
   ```

   For more information, see the [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) command reference.

1. Create a subnet for the App Service virtual network integration.

   Set the `<network-integration-subnet>` placeholder to the name for your new subnet that supports virtual network integration, such as `zava-integration-subnet`.

   For App Service, the virtual network integration subnet is recommended to [have a CIDR block of `/26` at a minimum](overview-vnet-integration.md#subnet-requirements). `/24` is more than sufficient. `--delegations Microsoft.Web/serverfarms` specifies that the subnet is [delegated for App Service virtual network integration](../virtual-network/subnet-delegation-overview.md).

   ```azurecli-interactive
   # Define a variable for the integration subnet name
   networkIntegrationSubnet=<network-integration-subnet>

   # Create the subnet for virtual network integration
   az network vnet subnet create --resource-group $resourceGroupName --vnet-name $virtualNetworkName --name $networkIntegrationSubnet \
      --address-prefixes 10.0.0.0/24 --delegations Microsoft.Web/serverfarms \
      --disable-private-endpoint-network-policies false
   ```

   For more information, see the [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) command reference.

1. Create another subnet for the private endpoints.

   Set the `<private-endpoint-subnet>` placeholder to the name for your new subnet that supports the private endpoint, such as `zava-endpoint-subnet`.

   ```azurecli-interactive
   # Define a variable for the private endpoint subnet name
   privateEndpointSubnet=<private-endpoint-subnet>

   # Create the subnet for the private endpoint
   az network vnet subnet create --resource-group $resourceGroupName --vnet-name $virtualNetworkName --name $privateEndpointSubnet \
      --address-prefixes 10.0.1.0/24 \
      --disable-private-endpoint-network-policies true
   ```

   For private endpoint subnets, you must disable private endpoint network policies by setting the `--disable-private-endpoint-network-policies` flag to `true`. For more information, see the [Optional parameters](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create-optional-parameters) for the [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) command.
   
   > [!NOTE]
   > The `--private-endpoint-network-policies` flag might soon replace the `--disable-private-endpoint-network-policies` flag. 

1. Create the Azure Private DNS zone.

   Set the `<private-zone-name>` placeholder to the name for your new Private DNS zone, such as `zava-private.azurewebsites.net`.

   ```azurecli-interactive
   # Define a variable for the Private DNS zone
   privateDNSZone=<private-zone-name>

   # Create the Private DNS zone
   az network private-dns zone create --resource-group $resourceGroupName --name $privateDNSZone
   ```

   For more information, see the [az network vnet subnet create](/cli/azure/network/private-dns/zone) command reference. For more information about configuring the Private DNS zone, see [Azure service DNS zone configuration](/azure/private-link/private-endpoint-dns#azure-services-dns-zone-configuration).

   > [!NOTE]
   > If you create the private endpoint in the Azure portal, an Azure Private DNS zone is created for your configuration automatically. For procedural consistency in this tutorial, you create the Private DNS zone and private endpoint separately by using the Azure CLI.

1. Link the Private DNS zone to the virtual network.

   Set the `<dns-link-name>` placeholder to the name for your new DNS link, such as `zava-private-link`.

   ```azurecli-interactive
   # Define a variable for the DNS link name
   dnsLinkName=<dns-link-name>

   # Create the link between the Private DNS zone and the virtual network
   az network private-dns link vnet create --resource-group $resourceGroupName --name $dnsLinkName --zone-name $privateDNSZone \
      --virtual-network $virtualNetworkName --registration-enabled False
   ```

   For more information, see the [az network private-dns link vnet create](/cli/azure/network/private-dns/link/vnet) command reference.

1. In the private endpoint subnet of your virtual network, create a private endpoint for your backend web app.

   Set the `<private-endpoint-name>` placeholder to the name of the new private endpoint for your backend web app, such as `zava-backend-endpoint`. Set the `<service-connection-name>` placeholder to the name of the new service connection, such as `zava-backend-connection`.

   ```azurecli-interactive
   # Define variables for the private endpoint and service connection
   privateEndpointName=<private-endpoint-name>
   serviceConnectionName=<service-connection-name>

   # Get the resource ID of the backend web app
   resourceId=$(az webapp show --resource-group $resourceGroupName --name $backendAppName --query id --output tsv)

   # Create the private endpoint for the backend web app by using the resource ID
   az network private-endpoint create --resource-group $resourceGroupName --name $privateEndpointName --location $regionLocation \
      --connection-name $serviceConnectionName --private-connection-resource-id $resourceId \
      --group-id sites --vnet-name $virtualNetworkName --subnet $privateEndpointSubnet
   ```

   For more information, see the [az network private-endpoint create](/cli/azure/network/private-endpoint#az-network-private-endpoint-create) command reference.

1. Link the private endpoint to the Private DNS zone with a DNS Zone group for the backend web app private endpoint.

   Set the `<dns-zone-group-name>` placeholder to the name for your new DNS Zone group, such as `zava-dns-zone-group`. The DNS zone group helps with automatic update of the Private DNS zone when the private endpoint is updated.  

   ```azurecli-interactive
   # Define a variable for the DNS Zone group
   dnsZoneGroupName=<dns-zone-group-name>

   # Link the private endpoint to the Private DNS      
   az network private-endpoint dns-zone-group create --resource-group $resourceGroupName --endpoint-name $privateEndpointName \
      --name $dnsZoneGroupName --private-dns-zone $privateDNSZone --zone-name $privateDNSZone
   ```

   For more information, see the [az network private-endpoint dns-zone-group create](/cli/azure/network/private-endpoint/dns-zone-group#az-network-private-endpoint-dns-zone-group-create) command reference.

1. Confirm direct access to your private endpoint is denied.

   When you create a private endpoint for an App Service app, public access is implicitly disabled. If you try to access your backend web app by using its default URL, your access is denied.

   In a browser, enter the default URL for your backend web app, such as `<backend-app-name>.azurewebsites.net`.
   
   The browser message indicates direct access is denied:

   :::image type="content" source="./media/tutorial-secure-ntier-app/backend-app-service-forbidden.png" border="false" alt-text="Screenshot of the browser message when direct access to the backend app is forbidden.":::

   For more information on App Service access restrictions with private endpoints, see [Azure App Service access restrictions](overview-access-restrictions.md#app-access). 

## Configure virtual network integration

After you create the virtual network infrastructure, you can set up virtual network integration on your frontend web app. Virtual network integration allows outbound traffic to flow directly into the virtual network. By default, only local IP traffic defined in the [RFC-1918 > Private Address Space](https://datatracker.ietf.org/doc/html/rfc1918#section-3) protocol route to the virtual network. This level of routing is what you need to enable private endpoints.

Enable virtual network integration on your frontend web app. The following command assumes the subnet and web app are located in the same resource group.

```azurecli-interactive
az webapp vnet-integration add --resource-group $resourceGroupName --name $frontendAppName --vnet $virtualNetworkName --subnet $networkIntegrationSubnet
```
   
For more information, see the [az webapp vnet-integration add](/cli/azure/webapp/vnet-integration#az-webapp-vnet-integration-add) command reference.

To route all traffic to the virtual network, see [Manage virtual network integration routing](configure-vnet-integration-routing.md). Routing all traffic can also be used if you want to route internet traffic through your virtual network, such as through an [Azure Virtual Network NAT](/azure/nat-gateway/nat-overview) or [Azure Firewall](/azure/firewall/overview).

## Enable deployment to the backend web app

Because your backend web app isn't publicly accessible, you must allow your continuous deployment tool to reach your app by [making the SCM site publicly accessible](app-service-ip-restrictions.md#restrict-access-to-an-scm-site) from the internet. The main web app itself can continue to deny all traffic.

1. Enable public access for the back-end web app.

   ```azurecli-interactive
   az webapp update --resource-group $resourceGroupName --name $backendAppName --set publicNetworkAccess=Enabled
   ```

1. Set the unmatched rule action for the main web app to deny all traffic.

   This setting denies public access to the main web app even though the general app access setting is set to allow public access.

   ```azurecli-interactive
   az resource update --resource-group $resourceGroupName --name $backendAppName --namespace Microsoft.Web \
      --resource-type sites --set properties.siteConfig.ipSecurityRestrictionsDefaultAction=Deny
   ```

1. Set the unmatched rule action for the SCM site to allow all traffic.

   ```azurecli-interactive
   az resource update --resource-group $resourceGroupName --name $backendAppName --namespace Microsoft.Web \
      --resource-type sites --set properties.siteConfig.scmIpSecurityRestrictionsDefaultAction=Allow
   ```

## Restrict FTP and SCM access

Because your backend SCM site is publicly accessible, you need to lock it down with better security.

1. Disable FTP access for both the frontend and backend web app:

   ```azurecli-interactive
   az resource update --resource-group $resourceGroupName --name ftp --namespace Microsoft.Web \
      --resource-type basicPublishingCredentialsPolicies --parent sites/<frontend-app-name> --set properties.allow=false
   
   az resource update --resource-group $resourceGroupName --name ftp --namespace Microsoft.Web \
      --resource-type basicPublishingCredentialsPolicies --parent sites/<backend-app-name> --set properties.allow=false
   ```

1. Disable basic authentication access to the WebDeploy ports and SCM/advanced tool sites for both web apps:

   ```azurecli-interactive
   az resource update --resource-group $resourceGroupName --name scm --namespace Microsoft.Web \
      --resource-type basicPublishingCredentialsPolicies --parent sites/<frontend-app-name> --set properties.allow=false

   az resource update --resource-group $resourceGroupName --name scm --namespace Microsoft.Web \
      --resource-type basicPublishingCredentialsPolicies --parent sites/<backend-app-name> --set properties.allow=false
   ```

When you disable basic authentication on App Service, you limit access to the FTP and SCM endpoints to users registered with Microsoft Entra ID. This action further secures your apps. For more information on disabling basic authentication including how to test and monitor logins, see [Disabling basic authentication on App Service](https://azure.github.io/AppService/2020/08/10/securing-data-plane-access.html).

## Configure continuous deployment with GitHub Actions

For this procedure, you need two apps that are ready to deploy to your App Service frontend and backend apps. To access the web apps, you need a service principal and continuous deployment with GitHub Actions.

### Get web apps for deployment testing

The [Azure Samples](https://github.com/Azure-samples/) repositories on GitHub provide sample Node.js apps for deployment.

1. In a browser, go to the [Node.js Backend sample app](https://github.com/Azure-Samples/nodejs-backend-webapp).

   Fork the GitHub repository so you have your own copy to make changes. This sample builds a 'Hello World' app. You deploy this app to your backend web app.

1. Repeat the same process for the [Node.js Frontend sample app](https://github.com/Azure-Samples/nodejs-frontend-webapp).

   Fork the GitHub repository so you have your own copy to make changes. This sample builds a web app that fetches and displays the content of a URL. You deploy this app to your frontend web app.

### Configure the service principal

You need a [service principal](/entra/identity-platform/app-objects-and-service-principals#service-principal-object) for your frontend web app and backend web app.

1. Create a service principal.

   Set the `<service-principal-name>` placeholder to the name for your new service principal, such as `zava-service-principal`.

   Replace the other `<placeholder>` parameter values with the information for your own resources.

   ```azurecli-interactive
   # Define a variable for the service principal name
   servicePrincipalName=<service-principal-name>

   # Link the private endpoint to the Private DNS 

    az ad sp create-for-rbac --name <service-principal-name> --role contributor --scopes \
      /subscriptions/<subscription-ID>/resourceGroups/<resource-group>/providers/Microsoft.Web/sites/<frontend-app-name> \
      /subscriptions/<subscription-ID>/resourceGroups/<resource-group>/providers/Microsoft.Web/sites/<backend-app-name>
   ```

   The output is a JSON object with the role assignment credentials that provide access to your App Service apps.
   
   ```output
   {
     "appId": "00001111-aaaa-2222-bbbb-3333cccc4444",
     "displayName": "<service-principal-name>",
     "password": "0Aa!1Bb!2Cc!3Dd!4Ee!5Ff!6Gg!7Hh!8Ii!9Jj!",
     "tenantId": "aaaabbbb-6666-cccc-7777-dddd8888eeee"
   }
   ```
   The JSON includes your service principal password, which is visible only at this time.
   
   > [!TIP]
   > It's a good practice to grant minimum access. In this example, the scope is limited to just the apps, not the entire resource group.

1. Copy the JSON object so you have a record of your service principal name.

1. Provide your service principal credentials to the [Azure sign in](https://github.com/Azure/login) operation as part of your GitHub Action workflow.

   Store the credentials as GitHub secrets that are referenced in your workflow.

   1. In a browser, go to the forked repository for your backend Node.js app on GitHub.
   
   1. Go to **Settings** > **Security** > **Secrets and variables** > **Actions**.

   1. Select **New repository secret** and create a secret for each of the following settings.
   
      Use the values from your JSON output.

      | Setting | Value | Example |
      |---|---|---|
      | **AZURE_CLIENT_ID**        | `<application/client-id>` | `00001111-aaaa-2222-bbbb-3333cccc4444` |
      | **AZURE_TENANT_ID**        | `<tenant-id>`             | `aaaabbbb-6666-cccc-7777-dddd8888eeee` |
      | **AZURE_SUBSCRIPTION_ID**  | `<subscription-id>`       | `cccc2c2c-dd3d-ee4e-ff5f-aaaaaa6a6a6a` |

   1. Repeat this process for the forked repository for your frontend Node.js app on GitHub.

### Set up continuous deployment with GitHub Actions

You can set up continuous deployment with GitHub Actions.

1. In the [Azure portal](https://portal.azure.com), go to the **Overview** page for your frontend web app.

1. In the left menu, select **Deployment** > **Deployment center**.
   
1. In the **Settings** tab, set the **Source** option to **GitHub**:

   :::image type="content" source="./media/tutorial-secure-ntier-app/choose-web-app-source.png" border="false" alt-text="Screenshot that shows how to choose the deployment source for the frontend web app in the Azure portal.":::

1. If you're deploying from GitHub for the first time, select **Authorize** and follow the authorization prompts. If you want to deploy from a different user's repository, select **Change Account**.

1. After you authorize your Azure account with GitHub, select the **Organization**, **Repository**, and **Branch** to configure CI/CD for. If you can't find an organization or repository, you might need to enable more permissions on GitHub. For more information, see [Manage user access to your organization's repositories](https://docs.github.com/organizations/managing-access-to-your-organizations-repositories).

   | Setting | Value |
   |---|---|
   | **Organization**  | `<your-GitHub-organization>` |
   | **Repository**    | `<forked-repository-name>`   |
   | **Branch**        | main                         |
        
1. Select **Save**.

1. Repeat this process for your **backend** web app and the corresponding forked repository.

## Validate connections and app access

Now you're ready to check the connections and access to your frontend and backend web apps.

1. Try browsing directly to your **backend** web app with its URL, `https://<backend-app-name>.azurewebsites.net`.

   <a name="direct-access-web-app-error"></a>

   You should see the following browser message:
   
   :::image type="content" source="./media/tutorial-secure-ntier-app/backend-app-service-forbidden.png" border="false" alt-text="Screenshot of the browser message when direct access to the backend app is forbidden.":::
   
   If you **can** reach the app, then check your configuration:
   
   - Confirm the private endpoint is correctly set up.

   - Confirm the access restrictions for your app are set to deny all traffic for the main web app.

1. Now try browsing directly to your **frontend** web app with its URL, `https://<frontend-app-name>.azurewebsites.net`.

   When the connection succeeds, you see the following page:
   
   :::image type="content" source="./media/tutorial-secure-ntier-app/frontend-url-content-fetcher.png" border="false" alt-text="Screenshot of a successful connection to the frontend app running in the browser.":::

1. In the URL box, enter the URL for your backend web app, `https://<backend-app-name>.azurewebsites.net`, and select **Fetch**.

   If you set up the connections properly, the page refreshes to show the message content from the backend web app:

   :::image type="content" source="./media/tutorial-secure-ntier-app/fetch-backend-app.png" alt-text="Screenshot of the browser contents after the frontend app attempts access to the backend app.":::
   
   All **outbound** traffic from the frontend web app routes through the virtual network. Your frontend web app is securely connecting to your backend web app through the private endpoint.
   
   If something is wrong with your connections, you see the _Error 403 - Forbidden_ message in the output.

### Establish an SSH session and open a remote shell

Validate the frontend web app is reaching the backend web app over the private link by using SSH to a frontend instance.

1. Establish an SSH session to the web container of your app and open a remote shell in your browser:

   ```azurecli-interactive
   az webapp ssh --resource-group $resourceGroupName --name $frontendAppName
   ```

   For more information, see the [az webapp ssh](/cli/azure/webapp#az-webapp-ssh) command reference.

1. After the shell opens in your browser, confirm your backend web app is being reached by using the private IP of your backend web app.

   In the following commands, replace the `<placeholder>` parameter values with the information for your own resource.

   1. Run the `nslookup` command:

      ```bash
      nslookup <backend-app-name>.azurewebsites.net
      ```

   1. Run the `curl` command to validate the site content again:

      ```bash
      curl https://<backend-app-name>.azurewebsites.net
      ```

   :::image type="content" source="./media/tutorial-secure-ntier-app/frontend-ssh-validation.png" border="false" alt-text="Screenshot of an SSH session to a frontend instance showing how to validate app connections to the backend.":::

   The `nslookup` command should resolve to the private IP address of your backend web app. The private IP address should be an address from your virtual network.

   You can confirm your private IP address in the Azure portal. Go to the **Settings** > **Networking** page for your backend web app.

   :::image type="content" source="./media/tutorial-secure-ntier-app/backend-app-service-inbound-ip.png" border="false" alt-text="Screenshot that shows the Networking page for a web app in the Azure portal with the inbound IP address highlighted.":::

1. Repeat the same `nslookup` and `curl` commands from another terminal (one that isn't an SSH session on your frontend instances).

   :::image type="content" source="./media/tutorial-secure-ntier-app/frontend-external-terminal.png" border="false" alt-text="Screenshot of an external terminal running the nslookup and curl commands for the backend web app showing access is forbidden.":::

   The `nslookup` command returns the **public IP** for the backend web app. Because public access to the backend web app is disabled, if you try to reach the public IP, you get an access denied error. This error means the site isn't accessible from the public internet, which is the intended behavior.
   
   The `nslookup` command doesn't resolve to the private IP because the address is resolvable only from within the virtual network through the private DNS zone. Only the frontend web app is within the virtual network. If you try to run the `curl` command on the backend web app from the external terminal, the returned HTML contains the Error 403 message, _Forbidden - The web app you have attempted to reach has blocked your access_. Some terminals also display the same HTML as the error page returned when you attempt to [directly access the backend web app](#direct-access-web-app-error).

## Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, delete the resource group by running the following command in the Cloud Shell.

Replace the `<placeholder>` parameter value with the information for your own resource:

```azurecli-interactive
az group delete --name <resource-group>
```

This command can take several minutes to complete.

## Frequently asked questions

In this tutorial, you deployed a baseline infrastructure to support a secure N-tier web app. App Service provides features that can help you ensure you're running applications that follow security best practices and recommendations.

This section contains answers to frequently asked questions that can help you further secure your apps and deploy and manage your resources according to best practices.

### Deploy with other methods than a service principal

In this tutorial, you [disabled basic authentication](#restrict-ftp-and-scm-access). You can't authenticate with the backend SCM site by using a username and password, or by using a publish profile. However, rather that authenticating by using a service principal, you can use [OpenID Connect](deploy-github-actions.md#generate-deployment-credentials) credentials.

### Configure GitHub Actions deployment in App Service

Azure autogenerates a workflow file in your repository. New commits in the selected repository and branch deploy continuously into your App Service app. You can track the commits and deployments on the **Logs** tab in GitHub.

A default workflow file that uses a publish profile to authenticate to App Service is added to your GitHub repository. You can view this file by going to the `<repo-name>/.github/workflows/` directory.

### Confirm safe public access of the backend SCM site

When you [lock down FTP and SCM access](#restrict-ftp-and-scm-access), you can ensure that only principals backed by Microsoft Entra can access the SCM endpoint, even though the endpoint is publicly accessible. This setting helps to reassure you that your backend web app is still secure.

### Deploy without an open backend SCM site

If you're concerned about enabling public access to the SCM site, or you have policy restrictions, consider other App Service deployment options like [running from a ZIP package](deploy-run-package.md).

#### Deploy this architecture with a template

The resources you created in this tutorial can be deployed by using an Azure Resource Manager template (ARM template) or Bicep template. The [application connected to a backend web app Bicep file](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-privateendpoint-vnet-injection) allows you to create a secure N-tier app solution.

To learn how to deploy ARM and Bicep templates, see [Deploy Bicep files with the Azure CLI](/azure/azure-resource-manager/bicep/deploy-cli).

## Related content

- [Integrate your app with Azure Virtual Network](overview-vnet-integration.md)
- [App Service networking features](networking-features.md)
- [Reliable web app pattern for .NET](/azure/architecture/web-apps/guides/enterprise-app-patterns/reliable-web-app/dotnet/guidance)
