---
title: Azure Monitor API retirement
description: Describes the retirement of older versions of the OperationalInsights resource provider API.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 10/29/2020

---

# OperationalInsights API version retirement
Microsoft provides notification at least 12 months in advance of retiring an API in order to smooth the transition to a newer/supported version. We have released a new version (2020-08-01) for **OperationalInsights** resource provider APIs and will retire any earlier API versions on February 29, 2024.

We encourage you to start using version 2020-08-01 now to gain the benefits of new functionality, such as [dedicated cluster](./logs-dedicated-clusters.md), [customer-managed keys](../logs/customer-managed-keys.md), [private link](./private-link-security.md) and [data export](./logs-data-export.md). Also, new features and functionality and optimizations are only added to the current API.

After February 29, 2024 Azure Monitor will no longer support earlier APIs versions than 2020-08-01. If you prefer not to upgrade, requests sent from earlier versions will continue to be served by the Azure Monitor service until February 29, 2024.

## Migration steps
Depending on the configuration method you use, you should update the new version in **REST** requests and **Resource Manager templates**. Follow the examples below to update the API version:

1. REST API requests use the API version in the URL of the request. Replace that version with the latest version (2020-08-01) as shown in the following example.

    ```rest
    https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}?api-version=2020-08-01
    ```

2. Azure Resource Manager templates use the API version in the **apiVersion** property of the resource. Replace that version with the latest version (2020-08-01) as shown in the following example.


    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "workspaceName": {
                "type": "string",
                "metadata": {
                "description": "Name of the workspace."
                }
            },
            "resources": [
            {
                "type": "Microsoft.OperationalInsights/workspaces",
                "name": "[parameters('workspaceName')]",
                "apiVersion": "2020-08-01",
                "location": "westus",
                "properties": {
                    "sku": {
                        "name": "pergb2018"
                    },
                    "retentionInDays": 30,
                    "features": {
                        "searchVersion": 1,
                        "legacy": 0,
                        "enableLogAccessUsingOnlyResourcePermissions": true
                    }
                }
            }
        ]
    }
    }
    ```


### More information
If you have questions, get answers from [our tech community experts]( https://techcommunity.microsoft.com/t5/azure-monitor/bd-p/AzureMonitor). If you have a support plan and you need technical help, create a [support request]( https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest): 
1.	Under *Issue type*, select **Technical**. 
2.	Under *Subscription*, select your subscription. 
3.	Under *Service*, select **My services**, then select **Log Analytics**. 
4.	Under *Summary*, type a description of your issue. 
5.	Under *Problem type*, select **Log Analytics workspace management**.  
6.	Under *Problem subtype*, select **ARM templates, PowerShell and CLI**. 

## Next steps

- See the [reference for the OperationalInsights workspace API](/rest/api/loganalytics/workspaces).