---
title: How to move an Azure Spring Cloud service instance to another region
description: Describes how to move an Azure Spring Cloud service instance to another region
author: karlerickson
ms.author: wepa
ms.service: spring-cloud
ms.topic: how-to
ms.date: 01/20/2022
ms.custom: devx-track-java
---

# Move an Azure Spring Cloud instance to another region

This article shows you how to move your Azure Spring Cloud service instance to another region.

You may want to move your Azure Spring Cloud instance from one region to another. For example, you may want to create an Azure Spring Cloud instance in another region with the same configuration as part of a disaster recovery plan, or you want a similar environment for testing.

Azure Spring Cloud cannot be moved from one region to another directly. But you can use the Azure Resource Manager template to deploy to a new region. For more information about Azure Resource Manager and templates, see 
[Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](/azure/azure-resource-manager/templates/quickstart-create-templates-use-the-portal).

## Prerequisites
  - A running Azure Spring Cloud instance.
  - The target region supports Azure Spring Cloud and related features.

## Limitations
  - As different feature set is supported by different pricing tiers(Sku), change the Sku may need to change the template, that is, only supported features can show up in the template for the target Sku.
  - Not all sub resources in Azure Spring Cloud can be moved with template only, some extra setup is still required after the template is deployed, check [Configure the new Azure Spring Cloud](#configure-the-new-azure-spring-cloud).
  - When moving a [VNet instance](./how-to-deploy-in-azure-virtual-network.md), new network resources need to be created.

## How to move an Azure Spring Cloud instance with a template

In order to move an Azure Spring Cloud instance with a template, use the following steps.

### Export the template
### [Portal](#tab/azure-portal)
The template can be exported with the Azure portal using these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **All resources** in the left menu, then select your Azure Spring Cloud instance.
1. Under **Automation** select **Export template**.
1. Select **Download** in the **Export template** blade.
1. Locate the zip file, unzip it, and get the template.json file. The json file contains the resource template.

### [Azure CLI](#tab/azure-cli)
The template can be exported with Azure CLI using the following command:

```bash
az login
az account set -s <resource-subscription-id>
az group export --resource-group <resource-group> --resource-ids <resource-id>
```

---

### Modify the template
Before deploying the template, the template.json file needs to be modified.

In the example below, the new service name for Azure Spring Cloud is new-service, and the previous service name is old-service.

1. Change all service names in the template from old-service-name to new-service-name, for example:
    ```json
    {
        "type": "Microsoft.AppPlatform/Spring",
        "apiVersion": "{api-version}",
        "name": "[parameters('Spring_new_service_name')]",
        ….
    }
    ```

1. Change the location in the template to the new target location, for example,
    ```json
        {
            "type": "Microsoft.AppPlatform/Spring",
            "apiVersion": "{api-version}",
            "name": "[parameters('Spring_new_service_name')]",
            "location": "{new-region}",
            …..
        }
    ```

 1. If the instance being moved is a VNet instance, the target VNet resource needs to be updated. For example, change the parameters:
    ```json
    "parameters": {
        …
        "virtualNetworks_service_vnet_externalid": {
            "defaultValue": "{new-vnet-resource-id}",
            "type": "String"
        }
    },
    ```

    Make sure the subnet serviceRuntimeSubnetId and appSubnetId defined in the service networkProfile exists.
    ```json
    {
        "type": "Microsoft.AppPlatform/Spring",
        "apiVersion": "{api-version}",
        "name": "[parameters('Spring_new_service_name')]",
        …
        "properties": {
            "networkProfile": {
                "serviceRuntimeSubnetId": "[concat(parameters('virtualNetworks_service_vnet_externalid'), '/subnets/apps-subnet')]",
                "appSubnetId": "[concat(parameters('virtualNetworks_service_vnet_externalid'), '/subnets/service-runtime-subnet')]",
            }
        }
    }
    ```
	
1. If any custom domain resources are configured, create the CNAME record by following [Tutorial: Map an existing custom domain to Azure Spring Cloud](./tutorial-custom-domain.md). Make sure the record name is expected for the new service name.

1. Change all `relativePath` properties for all app resource to `<default>`, for example,
    ```json
    {
        "type": "Microsoft.AppPlatform/Spring/apps/deployments",
        "apiVersion": "{api-version}",
        "name": "[concat(parameters('Spring_new_service_name'), '/api-gateway/default')]",
        …
        "properties": {
            "active": true,
            "source": {
                "type": "Jar",
                "relativePath": "<default>"
            },
            …
        }
    }
    ```

    After the app is created, it uses a default banner application. You need to deploy the jar files again using the CLI. See [Configure the new Azure Spring Cloud](#configure-the-new-azure-spring-cloud). 

1. If service binding was used and you want to import to a new service, add the `key` property for the target bound resource. For example, a bound mysql:
    ```json
    {
        "type": "Microsoft.AppPlatform/Spring/apps/bindings",
        "apiVersion": "{api-version}",
        "name": "[concat(parameters('Spring_new_service_name'), '/api-gateway/mysql')]",
        …
        "properties": {
            "resourceId": "[parameters('servers_test_mysql_name_externalid')]",
            "key": "{mysql-password}",
            "bindingParameters": {
                "databaseName": "mysql",
                "username": "{mysql-user-name}"
            }
        }
    }
    ```

### Deploy the template
### [Portal](#tab/azure-portal)
After modifying the template, the new resource can be created using **Deploy a custom template** with the portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the top search box, search for *Deploy a custom template*.

    :::image type="content" source="media/move-across-regions/search-deploy-template.png" alt-text="Azure portal screenshot showing how to search for deploy a custom template service.":::

1. Under **Services**, select **Deploy a custom template**.
1. Go to the **Select a template** tab, then select **Build your own template in the editor**.
1. In the template editor, paste the template.json file modified earlier, then select **Save**.
1. In the **Basics** tab, fill in the following information:
    - Select the target subscription
    - Select the target resource group
    - Select the target region
    - Fill in any other parameters required for the template

    :::image type="content" source="media/move-across-regions/deploy-template.png" alt-text="Azure portal screenshot showing how deploy template basic tab can be filled.":::

1. Select **Review + create** to create the target service.
1. Wait until the template has been deployed successfully. If the deployment fails, select **Deployment details** to view the failure reason and update the template or configurations accordingly.

### [Azure CLI](#tab/azure-cli)
After modifying the template, the new resource can be created by deploying a custom template with the CLI.

```bash
az login
az account set -s <resource-subscription-id>
az deployment group create \
  --name <custom-deployment-name> \
  --resource-group <resource-group> \
  --template-file <path-to-template> \
  --parameters <param-name-1>=<param-value-1>
```

Wait until the template has been deployed successfully. If the deployment fails, view the deployment details with the CLI command `az deployment group list`, and update the template or configurations accordingly.

---

### Configure the new Azure Spring Cloud

Some features are not exported to the template, or cannot be imported with a template directly. You must manually set up the following Azure Spring Cloud items on the new instance after the deployment of the template completes successfully:

  - The jar files for the previous service are not deployed directly to the new service. Follow [Quickstart - Build and deploy apps to Azure Spring Cloud](./quickstart-deploy-apps.md?tabs=Azure-CLI&pivots=programming-language-java#create-and-deploy-apps-on-azure-spring-cloud) to deploy all apps. If there is no active deployment configured automatically, see [Set up a staging environment in Azure Spring Cloud](./how-to-staging-environment.md#set-the-green-deployment-as-the-production-environment) to configure a production deployment.  
  - Config server will not be automatically imported. Follow [Set up your Config Server instance in Azure Spring Cloud](./how-to-config-server.md).
  - Managed identity will be automatically created for the new service, but the object ID is different from the previous service. For MSI to work in the new service, follow [Enable system-assigned managed identity for applications in Azure Spring Cloud](./how-to-enable-system-assigned-managed-identity.md).
  - For Monitoring -> Metrics, follow [Metrics for Azure Spring Cloud](./concept-metrics.md). To not mix the data, it's  recommended to create a new Log Analytics to collect the new data. This should also be done for other monitoring configurations.
  - For Monitoring -> Diagnostic settings and Logs, follow [Analyze logs and metrics in Azure Spring Cloud](./diagnostic-services.md).
  - For Monitoring -> Application Insights, follow [How to use Application Insights Java In-Process Agent in Azure Spring Cloud](./how-to-application-insights.md).

  ## Next steps

* [Quickstart - Build and deploy apps to Azure Spring Cloud](./quickstart-deploy-apps.md)
* [Quickstart - Set up Azure Spring Cloud Config Server](./quickstart-setup-config-server.md)
* [Quickstart - Set up a Log Analytics workspace in Azure Spring Cloud](./quickstart-setup-log-analytics.md)
