---
title: Azure App Service access restrictions 
description: Learn how to secure your app in Azure App Service by setting up access restrictions. 
author: ccompy

ms.assetid: 3be1f4bd-8a81-4565-8a56-528c037b24bd
ms.topic: article
ms.date: 06/06/2019
ms.author: ccompy
ms.custom: seodec18

---
# Set up Azure App Service access restrictions

By setting up access restrictions, you can define a priority-ordered allow/deny list that controls network access to your app. The list can include IP addresses or Azure Virtual Network subnets. When there are one or more entries, an implicit *deny all* exists at the end of the list.

The access-restriction capability works with all Azure App Service-hosted workloads. The workloads can include web apps, API apps, Linux apps, Linux container apps, and functions.

When a request is made to your app, the FROM address is evaluated against the IP address rules in your access-restriction list. If the FROM address is in a subnet that's configured with service endpoints to Microsoft.Web, the source subnet is compared against the virtual network rules in your access-restriction list. If the address isn't allowed access based on the rules in the list, the service replies with an [HTTP 403](https://en.wikipedia.org/wiki/HTTP_403) status code.

The access-restriction capability is implemented in the App Service front-end roles, which are upstream of the worker hosts where your code runs. Therefore, access restrictions are effectively network access-control lists (ACLs).

The ability to restrict access to your web app from an Azure virtual network is enabled by [service endpoints][serviceendpoints]. With service endpoints, you can restrict access to a multitenant service from selected subnets. It doesn't work to restrict traffic to apps that are hosted in an App Service Environment. If you're in an App Service Environment, you can control access to your app by applying IP address rules.

> [!NOTE]
> The service endpoints must be enabled both on the networking side and for the Azure service that they're being enabled with. For a list of Azure services that support service endpoints, see [Virtual Network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).
>

![Diagram of the flow of access restrictions.](media/app-service-ip-restrictions/access-restrictions-flow.png)

## Add or edit access-restriction rules in the portal

To add an access-restriction rule to your app, do the following:

1. Sign in to the Azure portal.

1. On the left pane, select **Networking**.

1. On the **Networking** pane, under **Access Restrictions**, select **Configure Access Restrictions**.

   ![Screenshot of the App Service networking options pane in the Azure portal.](media/app-service-ip-restrictions/access-restrictions.png)  

1. On the **Access Restrictions** page, review the list of access-restriction rules that are defined for your app.

   ![Screenshot of the Access Restrictions page in the Azure portal, showing the list of access-restriction rules defined for the selected app.](media/app-service-ip-restrictions/access-restrictions-browse.png)

   The list displays all the current restrictions that are applied to the app. If you have a virtual-network restriction on your app, the table shows whether the service endpoints are enabled for Microsoft.Web. If no restrictions are defined on your app, the app is accessible from anywhere.  

### Add an access-restriction rule

To add an access-restriction rule to your app, on the **Access Restrictions** pane, select **Add rule** . After you add a rule, it becomes effective immediately. 

Rules are enforced in priority order, starting from the lowest number in the **Priority** column. An implicit *deny all* is in effect after you add even a single rule.

On the **Add IP Restriction** pane, when you create a rule, do the following:

1. Under **Action**, select either **Allow** or **Deny**.  

   ![Screenshot of the "Add IP Restriction" pane.](media/app-service-ip-restrictions/access-restrictions-ip-add.png)
   
1. Optionally, enter a name and description of the rule.  
1. In the **Type** drop-down list, select the type of rule.  
1. In the **Priority** box, enter a priority value.  
1. In the **Subscription**, **Virtual Network**, and **Subnet** drop-down lists, select what you want to restrict access to.  

### Set an IP address-based rule

Follow the procedure as outlined in the preceding section, but with the following variation:
* For step 3, in the **Type** drop-down list, select **IPv4** or **IPv6**. 

Specify the IP address in Classless Inter-Domain Routing (CIDR) notation for both the IPv4 and IPv6 addresses. To specify an address, you can use something like *1.2.3.4/32*, where the first four octets represent your IP address and */32* is the mask. The IPv4 CIDR notation for all addresses is 0.0.0.0/0. To learn more about CIDR notation, see [Classless Inter-Domain Routing](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing). 

## Use service endpoints

By using service endpoints, you can restrict access to selected Azure virtual network subnets. To restrict access to a specific subnet, create a restriction rule with a **Virtual Network** type. You can then select the subscription, virtual network, and subnet that you want to allow or deny access to. 

If service endpoints aren't already enabled with Microsoft.Web for the subnet that you selected, they'll be automatically enabled unless you select the **Ignore missing Microsoft.Web service endpoints** check box. The scenario where you might want to enable service endpoints on the app but not the subnet depends mainly on whether you have the permissions to enable them on the subnet. 

If you need someone else to enable service endpoints on the subnet, select the **Ignore missing Microsoft.Web service endpoints** check box. Your app will be configured for service endpoints in anticipation of having them enabled later on the subnet. 

![Screenshot of the "Add IP Restriction" pane with the Virtual Network type selected.](media/app-service-ip-restrictions/access-restrictions-vnet-add.png)

You can't use service endpoints to restrict access to apps that run in an App Service Environment. When your app is in an App Service Environment, you can control access to it by applying IP access rules. 

With service endpoints, you can configure your app with application gateways or other web application firewall (WAF) devices. You can also configure multi-tier applications with secure back ends. For more information, see [Networking features and App Service](networking-features.md) and [Application Gateway integration with service endpoints](networking/app-gateway-with-service-endpoints.md).

> [!NOTE]
> - Service endpoints aren't currently supported for web apps that use IP Secure Sockets Layer (SSL) virtual IP (VIP).
> - There is a limit of 512 rows of IP or service-endpoint restrictions. If you require more than 512 rows of restrictions, we suggest that you consider installing a standalone security product, such as Azure Front Door, Azure App Gateway, or a WAF.
>

## Manage access-restriction rules

You can edit or delete an existing access-restriction rule.

### Edit a rule

1. To begin editing an existing access-restriction rule, on the **Access Restrictions** page, double-click the rule you want to edit.

1. On the **Edit IP Restriction** pane, make your changes, and then select **Update rule**. Edits are effective immediately, including changes in priority ordering.

   ![Screenshot of the "Edit IP Restriction" pane in the Azure portal, showing the fields for an existing access-restriction rule.](media/app-service-ip-restrictions/access-restrictions-ip-edit.png)

   > [!NOTE]
   > When you edit a rule, you can't switch between an IP address rule and a virtual network rule. 

   ![Screenshot of the "Edit IP Restriction" pane in Azure portal, showing the settings for a virtual network rule.](media/app-service-ip-restrictions/access-restrictions-vnet-edit.png)

### Delete a rule

To delete a rule, on the **Access Restrictions** page, select the ellipsis (**...**) next to the rule you want to delete, and then select **Remove**.

![Screenshot of the "Access Restrictions" page, showing the "Remove" ellipsis next to the access-restriction rule to be deleted.](media/app-service-ip-restrictions/access-restrictions-delete.png)

## Block a single IP address

When you add your first IP restriction rule, the service adds an explicit *Deny all* rule with a priority of 2147483647. In practice, the explicit *Deny all* rule is the final rule to be executed, and it blocks access to any IP address that's not explicitly allowed by an *Allow* rule.

For a scenario where you want to explicitly block a single IP address or a block of IP addresses, but allow access to everything else, add an explicit *Allow All* rule.

![Screenshot of the "Access Restrictions" page in the Azure portal, showing a single blocked IP address.](media/app-service-ip-restrictions/block-single-address.png)

## Restrict access to an SCM site 

In addition to being able to control access to your app, you can restrict access to the SCM site that's used by your app. The SCM site is both the web deploy endpoint and the Kudu console. You can assign access restrictions to the SCM site from the app separately or use the same set of restrictions for both the app and the SCM site. When you select the **Same restrictions as \<app name>** check box, everything is blanked out. If you clear the check box, your SCM site settings are reapplied. 

![Screenshot of the "Access Restrictions" page in the Azure portal, showing that no access restrictions are set for the SCM site or the app.](media/app-service-ip-restrictions/access-restrictions-scm-browse.png)

## Manage access-restriction rules programatically

You can add access restrictions programatically by doing either of the following: 

* Use [the Azure CLI](/cli/azure/webapp/config/access-restriction?view=azure-cli-latest&preserve-view=true). For example:
   
  ```azurecli-interactive
  az webapp config access-restriction add --resource-group ResourceGroup --name AppName \
  --rule-name 'IP example rule' --action Allow --ip-address 122.133.144.0/24 --priority 100
  ```

* Use [Azure PowerShell](/powershell/module/Az.Websites/Add-AzWebAppAccessRestrictionRule?view=azps-3.1.0&preserve-view=true). For example:


  ```azurepowershell-interactive
  Add-AzWebAppAccessRestrictionRule -ResourceGroupName "ResourceGroup" -WebAppName "AppName"
      -Name "Ip example rule" -Priority 100 -Action Allow -IpAddress 122.133.144.0/24
  ```

You can also set values manually by doing either of the following:

* Use an [Azure REST API](/rest/api/azure/) PUT operation on the app configuration in Azure Resource Manager. The location for this information in Azure Resource Manager is:

  management.azure.com/subscriptions/**subscription ID**/resourceGroups/**resource groups**/providers/Microsoft.Web/sites/**web app name**/config/web?api-version=2018-02-01

* Use an ARM template. As an example, you can use resources.azure.com and edit the ipSecurityRestrictions block to add the required JSON.

  The JSON syntax for the earlier example is:

  ```json
  {
    "properties": {
      "ipSecurityRestrictions": [
        {
          "ipAddress": "122.133.144.0/24",
          "action": "Allow",
          "priority": 100,
          "name": "IP example rule"
        }
      ]
    }
  }
  ```

## Set up Azure Functions access restrictions

Access restrictions are also available for function apps with the same functionality as App Service plans. When you enable access restrictions, you also disable the Azure portal code editor for any disallowed IPs.

## Next steps
[Access restrictions for Azure Functions](../azure-functions/functions-networking-options.md#inbound-ip-restrictions)  
[Application Gateway integration with service endpoints](networking/app-gateway-with-service-endpoints.md)

<!--Links-->
[serviceendpoints]: ../virtual-network/virtual-network-service-endpoints-overview.md
