---
title: How to move an Azure Spring Cloud service instance to another region
description: Describes how to move an Azure Spring Cloud service instance to another region
author: karlerickson
ms.author: wepa
ms.service: spring-cloud
ms.topic: how-to
ms.date: 01/10/2022
ms.custom: devx-track-java
---

# Move an Azure Spring Cloud instance to another region

This article shows you how to move your Azure Spring Cloud service instance to another region.

Sometimes you may want to move your Azure Spring Cloud instance from one region to another with different reasons, for example, you may want to create an Azure Spring Cloud instance in another region with same configuration as part of disaster recovery planning, or you want a similar environment for testing.

Azure Spring Cloud itself cannot be moved from one region to another directly. But you can use the Azure Resource Manager template deploy to a new region. For more information about Azure Resource Manager and templates, see 
[Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](/azure/azure-resource-manager/templates/quickstart-create-templates-use-the-portal).

## Prerequisites
  - You already have a running Azure Spring Cloud instance.
  - The target region already supports Azure Spring Cloud and related features.

## Limitations
  - As different feature set is supported by different pricing tiers(Sku), change the Sku may need to change the template, that is, only supported features can show up in the template for the target Sku.
  - Not all sub resources in Azure Spring Cloud can be moved with template only, some extra setup is still required after the template is deployed, check [Configure the new Azure Spring Cloud](#configure-the-new-azure-spring-cloud).
  - When moving a [VNet instance](/azure/spring-cloud/how-to-deploy-in-azure-virtual-network), new network resources may need to be created, depending on the network capacity.

## How to move an Azure Spring Cloud instance with template

In order to move an Azure Spring Cloud instance with template, follow below steps.

### Export the template
### [Portal](#tab/azure-portal)
Template can be exported with Azure portal.

1. Sign in to Azure portal
2. Select **All resources** and then select your Azure Spring Cloud instance
3. Go to menu **Automation -> Export template**
4. Choose **Download** in the **Export template** blade
5. Locate the zip file, unzip it and get the template.json file, which contains the resource template

### [Azure CLI](#tab/azure-cli)
Template can be exported with Azure CLI.

```bash
az login
az account set -s <resource-subscription-id>
az group export --resource-group <resource-group> --resource-ids <resource-id>
```

---

### Modify the template
Before deploying the template, the template.json file needs to be modified.
Below will suppose the new service name for Azure Spring Cloud is new-service, previous service name is old-service.

1. Replace all service name in template from old-service-name to new-service-name, for example,
    ```json
    {
        "type": "Microsoft.AppPlatform/Spring",
        "apiVersion": "{api-version}",
        "name": "[parameters('Spring_new_service_name')]",
        ….
    }
    ```

2. Change the location in the template to new target location, for example,
    ```json
        {
            "type": "Microsoft.AppPlatform/Spring",
            "apiVersion": "{api-version}",
            "name": "[parameters('Spring_new_service_name')]",
            "location": "{new-region}",
            …..
        }
    ```

 3. If the instance being moved is a VNet instance, you can also change the VNet to a new one, for example, change the parameters:
    ```json
    "parameters": {
        …
        "virtualNetworks_service_vnet_externalid": {
            "defaultValue": "{new-vnet-resource-id}",
            "type": "String"
        }
    },
    ```

    And make sure the subnet serviceRuntimeSubnetId and appSubnetId defined in the service networkProfile exists.
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

	
4. If any custom domain resources are configured, create the CNAME record ahead following [Tutorial: Map an existing custom domain to Azure Spring Cloud](/azure/spring-cloud/tutorial-custom-domain). Make sure the record name is expected for the new service name.

5. Change all `relativePath` property for all app resource to `<default>`, for example,
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
    After the app is created, it uses a default banner application, you have to deploy the jar files again using CLI, check [Configure the new Azure Spring Cloud](#configure-the-new-azure-spring-cloud). 

6. If service binding was used and you are preferred to import to new service, add `key` property for the target bound resource, given a bound mysql as example,
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
After modifying the template, the new resource can be created by **Deploy a custom template** with portal.

1. Sign in to Azure portal
2. In the top search box, search **Deploy a custom template**

    :::image type="content" source="media/move-across-regions/search-deploy-template.png" alt-text="Azure portal screenshot showing how to search the deploy a custom template service.":::

3. Select **Services -> Deploy a custom template**
4. Go to **Select a template -> Build your own template in the editor**
5. In the template editor, paste the template.json file modified earlier
6. In the **Basics** tab, fill required data accordingly
    - Select target subscription
    - Select target resource group
    - Select target region
    - Fill any other parameters required for the template

    :::image type="content" source="media/move-across-regions/deploy-template.png" alt-text="Azure portal screenshot showing how deploy template basic tab can be filled.":::

7. Click the **Review + create**  button to create the target service
8. Wait until the template has been deployed successfully, if any resource deployment failed, check the **Deployment details -> Operation details** for the detailed reason, and update the template or configurations accordingly.

### [Azure CLI](#tab/azure-cli)
After modifying the template, the new resource can be created by Deploy a custom template with CLI.
```bash
az login
az account set -s <resource-subscription-id>
az deployment group create \
  --name <custom-deployment-name> \
  --resource-group <resource-group> \
  --template-file <path-to-template> \
  --parameters <param-name-1>=<param-value-1>
```
Wait until the template has been deployed successfully, if any resource deployment failed, check the deployment details with CLI `az deployment group list`, and update the template or configurations accordingly.

---

### Configure the new Azure Spring Cloud
Some features are not exported to the template or cannot be imported with template directly, please manually setup the new Azure Spring Cloud instance after the deploy template finished successfully.

  - The jar files for previous service are not deployed directly to the new service, follow [Quickstart - Build and deploy apps to Azure Spring Cloud](/azure/spring-cloud/quickstart-deploy-apps?tabs=Azure-CLI&pivots=programming-language-java#create-and-deploy-apps-on-azure-spring-cloud) to deploy all apps. If there is no active deployment configured automatically, follow [Set up a staging environment in Azure Spring Cloud](/azure/spring-cloud/how-to-staging-environment#set-the-green-deployment-as-the-production-environment) to configure production deployment.  
  - Config server will not be automatically imported, follow [Set up your Config Server instance in Azure Spring Cloud](/azure/spring-cloud/how-to-config-server).
  - Managed identity will be automatically created for the new service, but the object ID is different with previous one, to make MSI work in the new service, follow [Enable system-assigned managed identity for applications in Azure Spring Cloud](/azure/spring-cloud/how-to-enable-system-assigned-managed-identity).
  - For Monitoring -> Metrics, follow [Metrics for Azure Spring Cloud](/azure/spring-cloud/concept-metrics), to not mix the data, it's  recommended to create new Log Analytics to collect data, same for other monitoring configurations.
  - For Monitoring -> Diagnostic settings and Logs, follow [Analyze logs and metrics in Azure Spring Cloud](/azure/spring-cloud/diagnostic-services).
  - For Monitoring -> Application Insights, follow [How to use Application Insights Java In-Process Agent in Azure Spring Cloud](/azure/spring-cloud/how-to-application-insights).

  ## Next steps

* [Quickstart - Build and deploy apps to Azure Spring Cloud](./quickstart-deploy-apps.md)
* [Quickstart - Set up Azure Spring Cloud Config Server](./quickstart-setup-config-server.md)
* [Quickstart - Set up a Log Analytics workspace in Azure Spring Cloud](./quickstart-setup-log-analytics.md)
