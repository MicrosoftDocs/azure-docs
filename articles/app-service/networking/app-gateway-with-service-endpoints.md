---
title: Application Gateway integration - Azure App Service | Microsoft Docs
description: Describes how Application Gateway integrates with Azure App Service.
services: app-service
documentationcenter: ''
author: madsd
editor: ''

ms.assetid: 073eb49c-efa1-4760-9f0c-1fecd5c251cc
ms.service: app-service
ms.workload: web
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 08/04/2021
ms.author: madsd
ms.custom: seodec18, devx-track-azurecli 
ms.devlang: azurecli

---

# Application Gateway integration
There are three variations of App Service that require slightly different configuration of the integration with Azure Application Gateway. The variations include regular App Service - also known as multi-tenant, Internal Load Balancer (ILB) App Service Environment and External App Service Environment. This article will walk through how to configure it with App Service (multi-tenant) using service endpoint to secure traffic. The article will also discuss considerations around using private endpoint and integrating with ILB, and External App Service Environment. Finally the article has considerations on scm/kudu site.

## Integration with App Service (multi-tenant)
App Service (multi-tenant) has a public internet facing endpoint. Using [service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md) you can allow traffic only from a specific subnet within an Azure Virtual Network and block everything else. In the following scenario, we'll use this functionality to ensure that an App Service instance can only receive traffic from a specific Application Gateway instance.

:::image type="content" source="./media/app-gateway-with-service-endpoints/service-endpoints-appgw.png" alt-text="Diagram shows the Internet flowing to an Application Gateway in an Azure Virtual Network and flowing from there through a firewall icon to instances of apps in App Service.":::

There are two parts to this configuration besides creating the App Service and the Application Gateway. The first part is enabling service endpoints in the subnet of the Virtual Network where the Application Gateway is deployed. Service endpoints will ensure all network traffic leaving the subnet towards the App Service will be tagged with the specific subnet ID. The second part is to set an access restriction of the specific web app to ensure that only traffic tagged with this specific subnet ID is allowed. You can configure it using different tools depending on preference.

## Using Azure portal
With Azure portal, you follow four steps to provision and configure the setup. If you have existing resources, you can skip the first steps.
1. Create an App Service using one of the Quickstarts in the App Service documentation, for example [.NET Core Quickstart](../quickstart-dotnetcore.md)
2. Create an Application Gateway using the [portal Quickstart](../../application-gateway/quick-create-portal.md), but skip the Add backend targets section.
3. Configure [App Service as a backend in Application Gateway](../../application-gateway/configure-web-app.md), but skip the Restrict access section.
4. Finally create the [access restriction using service endpoints](../../app-service/app-service-ip-restrictions.md#set-a-service-endpoint-based-rule).

You can now access the App Service through Application Gateway, but if you try to access the App Service directly, you should receive a 403 HTTP error indicating that the web site is stopped.

:::image type="content" source="./media/app-gateway-with-service-endpoints/website-403-forbidden.png" alt-text="Screenshot shows the text of an Error 403 - Forbidden.":::

## Using Azure Resource Manager template
The [Resource Manager deployment template][template-app-gateway-app-service-complete] will provision a complete scenario. The scenario consists of an App Service instance locked down with service endpoints and access restriction to only receive traffic from Application Gateway. The template includes many Smart Defaults and unique postfixes added to the resource names for it to be simple. To override them, you'll have to clone the repo or download the template and edit it.

To apply the template you can use the Deploy to Azure button found in the description of the template, or you can use appropriate PowerShell/CLI.

## Using Azure CLI
The [Azure CLI sample](../../app-service/scripts/cli-integrate-app-service-with-application-gateway.md) will provision an App Service locked down with service endpoints and access restriction to only receive traffic from Application Gateway. If you only need to isolate traffic to an existing App Service from an existing Application Gateway, the following command is sufficient.

```azurecli-interactive
az webapp config access-restriction add --resource-group myRG --name myWebApp --rule-name AppGwSubnet --priority 200 --subnet mySubNetName --vnet-name myVnetName
```

In the default configuration, the command will ensure both setup of the service endpoint configuration in the subnet and the access restriction in the App Service.

## Considerations when using private endpoint

As an alternative to service endpoint, you can use private endpoint to secure traffic between Application Gateway and App Service (multi-tenant). You will need to ensure that Application Gateway can DNS resolve the private IP of the App Service apps or alternatively that you use the private IP in the backend pool and override the host name in the http settings.

:::image type="content" source="./media/app-gateway-with-service-endpoints/private-endpoint-appgw.png" alt-text="Diagram shows the traffic flowing to an Application Gateway in an Azure Virtual Network and flowing from there through a private endpoint to instances of apps in App Service.":::

Application Gateway will cache the DNS lookup results, so if you use FQDNs and rely on DNS lookup to get the private IP address, then you may need to restart the Application Gateway if the DNS update or link to Azure private DNS zone was done after configuring the backend pool. To restart the Application Gateway, you must start and stop the instance. You can do this with Azure CLI:

```azurecli-interactive
az network application-gateway stop --resource-group myRG --name myAppGw
az network application-gateway start --resource-group myRG --name myAppGw
```

## Considerations for ILB ASE
ILB App Service Environment isn't exposed to the internet and traffic between the instance and an Application Gateway is therefore already isolated to the Virtual Network. The following [how-to guide](../environment/integrate-with-application-gateway.md) configures an ILB App Service Environment and integrates it with an Application Gateway using Azure portal.

If you want to ensure that only traffic from the Application Gateway subnet is reaching the App Service Environment, you can configure a Network security group (NSG) which affect all web apps in the App Service Environment. For the NSG, you are able to specify the subnet IP range and optionally the ports (80/443). Make sure you don't override the [required NSG rules](../environment/network-info.md#network-security-groups) for App Service Environment to function correctly.

To isolate traffic to an individual web app you'll need to use ip-based access restrictions as service endpoints will not work for ASE. The IP address should be the private IP of the Application Gateway instance.

## Considerations for External ASE
External App Service Environment has a public facing load balancer like multi-tenant App Service. Service endpoints don't work for App Service Environment, and that's why you'll have to use ip-based access restrictions using the public IP of the Application Gateway instance. To create an External App Service Environment using the Azure portal, you can follow this [Quickstart](../environment/create-external-ase.md)

[template-app-gateway-app-service-complete]: https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-with-app-gateway-v2/ "Azure Resource Manager template for complete scenario"

## Considerations for kudu/scm site
The scm site, also known as kudu, is an admin site, which exists for every web app. It isn't possible to reverse proxy the scm site and you most likely also want to lock it down to individual IP addresses or a specific subnet.

If you want to use the same access restrictions as the main site, you can inherit the settings using the following command.

```azurecli-interactive
az webapp config access-restriction set --resource-group myRG --name myWebApp --use-same-restrictions-for-scm-site
```

If you want to set individual access restrictions for the scm site, you can add access restrictions using the --scm-site flag like shown below.

```azurecli-interactive
az webapp config access-restriction add --resource-group myRG --name myWebApp --scm-site --rule-name KudoAccess --priority 200 --ip-address 208.130.0.0/16
```

## Next steps
For more information on the App Service Environment, see [App Service Environment documentation](../environment/index.yml).

To further secure your web app, information about Web Application Firewall on Application Gateway can be found in the [Azure Web Application Firewall documentation](../../web-application-firewall/ag/ag-overview.md).
