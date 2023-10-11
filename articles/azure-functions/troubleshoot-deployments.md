---
title: Troubleshoot Azure Functions deployments
description: Learn how to troubleshoot deployment of your function app and related resources to Azure.
ms.topic: article
ms.date: 10/07/2023
---

# Troubleshoot Azure Functions deployments

This article provides information to help you troubleshoot errors that occur when creating your function app and related resources in Azure and deploying your functions code to those resources. To learn more about template-based deployments, see [Automate resource deployment for your function app in Azure Functions](./functions-infrastructure-as-code.md). For a list of frequently asked questions related to deployments, see [Azure Resource Manager deployment FAQ for Azure Functions](./resource-deployment-faq.yml).

## Template-based zip deployment failures

This section provides guidance for troublshooting [zip deployments](./deployment-zip-push.md) that use ARM templates or Bicep files. These deployments require the `ZipDeploy` extension.

### Missing dependency

You must declare that the `ZipDeploy` resource depends on the site. Dependencies are required for resources that are deployed in the same template and when the creation order of resources is relevant. For example, when the function app site and `ZipDeploy` extension are being deployed in the same template, you must declare that the `ZipDeploy` resource depends on the site. This is because the deployment extension can only be created after the site exists.

The following example shows declaration of the `dependsOn` element in the site extension: 

:::code language="JSON" source="~/function-app-arm-templates/function-app-premium-plan/azuredeploy.json" range="194-204":::

### Updating application settings in the deployment template

Don't make updates to applicatio settings (`appsettings`) in the same template or Bicep file as the deployment. When application settings are <<>> The following template can fail the deployment, because on updating the app settings in the ARM template, the existing app settings will be deleted, and then new app settings will be created using the ARM template. During this process, the new app settings are not yet available. If the ZipDeploy starts in parallel being in the same template, then the app setting might not be available this time and the deployment can fail.

```json
"resources": [
  {
    "apiVersion": "2018-11-01",
    "name": "[concat(parameters('functionAppName'), '/appsettings')]",
    "type": "Microsoft.Web/sites/config",
    "dependsOn": [
      "[resourceId('Microsoft.Web/sites', parameters('functionAppName'))]",
      "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]"
    ],
    "properties": {
      "AzureWebJobsStorage": "[concat('DefaultEndpointsProtocol=https;AccountName=', variables('storageAccountName'), ';EndpointSuffix=', environment().suffixes.storage, ';AccountKey=',listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName')), '2019-06-01').keys[0].value)]",
      "APPINSIGHTS_INSTRUMENTATIONKEY": "[reference(resourceId('microsoft.insights/components', variables('applicationInsightsName')), '2020-02-02-preview').InstrumentationKey]",
      "FUNCTIONS_EXTENSION_VERSION": "~3",
      "WEBSITE_RUN_FROM_PACKAGE": "1"
    }
  },
  {
    "name": "[concat(parameters('functionAppName'), '/ZipDeploy')]",
    "type": "Microsoft.Web/sites/extensions",
    "apiVersion": "2021-02-01",
    "location": "[parameters('location')]",
    "dependsOn": [
      "[resourceId('Microsoft.Web/sites', parameters('functionAppName'))]"
    ],
    "properties": {
      "packageUri": "[parameters('packageUri')]"
    }
  }
]
```  

**Solution:** Try to deploy with one of the two ways mentioned below.
<br/> i) It is strictly recommended to include AppSettings as part of Site resource, instead of providing it separately in resources like SiteConfig resource, Sites/Config and Sites/AppSettings resources. When creating the site, add app settings to site config under properties like this `"properties": { "siteConfig": { "appSettings": [ ] } } }` and make the ZipDeploy resource depend on the site. Here is the [sample template](../blob/main/function-app-premium-plan/azuredeploy.json#L135-L198). 
<br/> ii) You can split it into two separate ARM templates. First, run the template to update the app settings, and then second template for deployment. 

### Invalid or expired SAS URL**

One of the common reasons for the following error is that the specified SAS URL was invalid or has expired. So, failed to download zip from URL.

Error Detail: The resource operation completed with terminal provisioning state 'Failed'. (Code: ResourceDeploymentFailure) Raw Error:
```json
{
  "code": "DeploymentFailed",
  "message": "At least one resource deployment operation failed. Please list deployment operations for details. Please see https://aka.ms/DeployOperations for usage details.",
  "details": [
    {
      "code": "Conflict",
      "message": "{\r\n  \"status\": \"Failed\",\r\n  \"error\": {\r\n    \"code\": \"ResourceDeploymentFailure\",\r\n    \"message\": \"The resource operation completed with terminal provisioning state 'Failed'.\"\r\n  }\r\n}"
    }
  ]
}
```

Make sure that the SAS URL you are trying to use for deployment is still valid. <<You can navigate to Kudu debug console and curl on the URL to verify if Zip download works. If the URL is invalid or has expired, then regenerate the URL.>>

### Consumption plan on Linux

ZipDeploy extension and the appSetting `WEBSITE_RUN_FROM_PACKAGE=1` are not supported for Linux Consumption plan.

**Solution:** If you are using Linux Consumption plan, then:
+ Do not use ZipDeploy extension.
+ Set appSetting `WEBSITE_RUN_FROM_PACKAGE=URL` for deployment using the .zip package url. For example: 

> [!IMPORTANT] You must include all of the existing app settings in your template to preserve them when the settings are overwritten. 

```json
{
  "name": "[parameters('siteName')]",
  "type": "Microsoft.Web/sites",
  "apiVersion": "2021-02-01",
  "location": "[parameters('location')]",
  "properties": {
    "siteConfig": {
      "appSettings": [
        {
          "name": "WEBSITE_RUN_FROM_PACKAGE",
          "value": "[parameters('packageUri')]"
        }
      ]
    }
  }
}
```

For more information, see [Application settings considerations](./functions-app-settings.md#app-setting-considerations).

## Next Steps

+ [Automate resource deployment for your function app in Azure Functions](./functions-infrastructure-as-code.md)
+ [Azure Resource Manager deployment FAQ for Azure Functions](./resource-deployment-faq.yml).