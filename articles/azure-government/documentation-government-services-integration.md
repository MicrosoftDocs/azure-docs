---
title: Azure Government Developer Tools | Microsoft Docs
description: This provides a comparison of features and guidance on developing applications for Azure Government.
services: azure-government
cloud: gov
documentationcenter: ''
author: gsacavdm
manager: pathuff

ms.assetid: afef7a1b-7abb-4073-8b3f-b7f7a49e000f
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 6/13/2018
ms.author: gsacavdm

---
# Azure Government Integration Services
This article outlines the integration services variations and considerations for the Azure Government environment.

## Logic Apps
Logic Apps is generally available in Azure Government.
For more information, see [Logic Apps public documentation](../logic-apps/logic-apps-overview.md).

### Variations
* The Azure-based [Connectors](../connectors/apis-list.md) are scoped to connect to resources in Azure Government. If the Azure service isn't yet available in Azure Government, the connector for that service isn't available, for example:
    * Data Lake Store
    * Data Factory
    * Event Grid
    * Application Insights
    * Content Moderator

* For other missing connectors, request them via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government) and the [Logic Apps feedback forum](https://feedback.azure.com/forums/287593-logic-apps). If you need to use any missing connectors, you can call a logic app hosted in Azure Commercial that uses them.

#### Logic Apps Custom Connector
The creation experience for custom connectors via the portal isn't yet available. The following steps can be followed to leverage the portal experience in Azure Commercial to create a custom connector:
1.	Create a Custom Logic App Connector under a Commercial Azure Subscription.
2.	Click ‘Edit’ on the Custom Connector resource and then configure the connector.
3.	Finish Configuring by clicking ‘Update Connector’.
4.	Download the custom connector details by going to the ‘Overview’ blade on the connector resource and clicking 'Download'.
5.	Download the template for the custom connector resource by going to the ‘Export Template’ blade and clicking ‘Download’. 
6.	Add the downloaded details of the custom connector to the template under ‘swagger’ field nested in ‘properties’ which is nested in “resources”, add the backend service URL field and change the location to a government region. 
7.	Deploy the edited JSON file as a template under the government subscription. To deploy resources in a Resource Manager deployment template from the Azure portal, see the [resource group deployment documentation](../azure-resource-manager/resource-group-template-deploy-portal.md#deploy-resources-from-custom-template).

Below is an example of how to edit the downloaded JSON template for deployment in Azure Government as a template.

##### Unedited example Logic Apps Custom Connector JSON Template

```
  {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "customApis_example_name": {
            "defaultValue": "example",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.Web/customApis",
            "apiVersion": "2016-06-01",
            "name": "[parameters('customApis_example_name')]",
            "location": "westus2",
            "properties": {
                "description": "SOAP pass-through",
                "displayName": "[parameters('customApis_example_name')]",
                "iconUri": "/Content/retail/assets/default-connection-icon.d269a5b2275fe149967a9c567c002697.2.svg"
            }
        }
    ]
}
```

##### Edited JSON for Successful Deployment:

```
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "customApis_example_name": {
        "defaultValue": "example",
        "type": "String"
      },
      "serviceUrl": {
        "defaultValue": "http://my_backend_service.url",
        "type": "String"
      }
  },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.Web/customApis",
            "apiVersion": "2016-06-01",
            "name": "[parameters('customApis_example_name')]",
            "location": "usgovvirginia",
          "properties": {
            "description": "SOAP pass-through",
            "displayName": "[parameters('customApis_example_name')]",
            "iconUri": "/Content/retail/assets/default-connection-icon.d269a5b2275fe149967a9c567c002697.2.svg",
            "backendService": {
              "serviceUrl": "[parameters('serviceUrl')]"
            },
            "swagger": {
              "swagger": "2.0",
              "info": {
                "title": "SOAP pass-through",
                "description": "SOAP pass-through",
                "version": "1.0"
              },
              "host": "api.contoso.com",
              "basePath": "/",
              "consumes": [],
              "produces": [],
              "paths": {
                "/SoapPassThrough": {
                  "post": {
                    "operationId": "SoapPassThrough",
                    "parameters": [
                      {
                        "name": "body",
                        "in": "body",
                        "schema": {
                          "type": "object"
                        }
                      }
                    ],
                    "responses": {
                      "200": {
                        "description": "OK"
                      }
                    },
                    "summary": "Example Custom Connector"
                  }
                }
              },
              "definitions": {},
              "parameters": {},
              "responses": {},
              "securityDefinitions": {},
              "security": [],
              "tags": [],
              "schemes": [
                "http"
              ]
            }
          }
        }
    ]
}
```

## Next steps
* Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
* Get help on Stack Overflow by using the [azure-gov](https://stackoverflow.com/questions/tagged/azure-gov)
* Give feedback or request new features via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government) 
