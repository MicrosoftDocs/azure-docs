---
title: Migrate from instrumentation keys to connection strings
description: Learn the steps required to upgrade from Azure Monitor Application Insights instrumentation keys to connection strings
ms.topic: conceptual
ms.date: 02/14/2022
---

# Migrate to connection strings for Application Insights resources

This guide walks through migrating from [instrumentation keys](https://docs.microsoft.com/en-us/azure/azure-monitor/app/separate-resources#about-resources-and-instrumentation-keys) to [connection strings](https://docs.microsoft.com/en-us/azure/azure-monitor/app/sdk-connection-string?tabs=net#overview) for telemetry ingestion.

## Prerequisites

- A supported SDK version
    - .NET and .NET Core v2.12.0
    -   Java v2.5.1 and Java 3.0
    -   JavaScript v2.3.0
    -   NodeJS v1.5.0
    -   Python v1.0.0
- An existing [application insights resource](https://docs.microsoft.com/en-us/azure/azure-monitor/app/create-workspace-resource)

## Migrate to a connections string

1.  Your connection string is displayed on the Overview blade of your Application Insights resource.

    <img src="./media/\migrate-from-instrumentation-keys-to-connection-strings\migrate-from-instrumentation-keys-to-connection-strings.png" style="width:10.64552in;height:2.39638in"
    alt="Graphical user interface, text, application, email Description automatically generated" />

> [!NOTE]
> To aid with automation, the connection string is also included in the ARM resource properties for your Application Insights resource, under the field name “ConnectionString”.

2.  Hover over the connection string and select the “Copy to clipboard” icon.

3.  Now, you need to configure the Application Insights SDK. Connection strings can be set either in code, environment variable, or configuration file. Follow the steps mentioned to see “[How to set connection strings](https://docs.microsoft.com/en-us/azure/azure-monitor/app/sdk-connection-string?tabs=net#how-to-set-a-connection-string)”

> [!IMPORTANT]
> We do not recommend using both a connection string and instrumentation key. If both are set, whichever was set last will take precedence.

## Migration at scale (for multiple subscriptions)

You can use environment variables to easily pass a connection string to the Application Insights SDK or Agent Note that if you currently hardcode an Instrumentation Key in your application code, that programming may take precedence before environment variables.

To set a connection string via environment variable, simply place the value of the connection string into an environment variable named “APPLICATIONINSIGHTS_CONNECTION_STRING”. This can typically be automated in your deployments to Azure. For example, the following ARM template shows how you can automatically include the  correct connection string with an App Services deployment (be sure to include any other App Settings your app requires):

```csharp
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "appServiceName": {
            "type": "string",
            "metadata": {
                "description": "Name of the App Services resource"
            }
        },
        "appServiceLocation": {
            "type": "string",
            "metadata": {
                "description": "Location to deploy the App Services resource"
            }
        },
        "appInsightsName": {
            "type": "string",
            "metadata": {
                "description": "Name of the existing Application Insights resource to use with this App Service. Expected to be in the same Resource Group."
            }
        }
    },
    "resources": [
        {
            "apiVersion": "2016-03-01",
            "name": "[parameters('appServiceName')]",
            "type": "microsoft.web/sites",
            "location": "[parameters('appServiceLocation')]",
            "properties": {
                "siteConfig": {
                    "appSettings": [
                        {
                            "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
                            "value": "[reference(concat('microsoft.insights/components/', parameters('appInsightsName')), '2015-05-01').ConnectionString]"
                        }
                    ]
                },
                "name": "[parameters('appServiceName')]"
            }
        }
    ]
}

```

## New capabilities

Just like instrumentation keys, connections strings identify a resource to associate your telemetry data with. Connection strings provide a single configuration setting and eliminate the need for multiple proxy settings. It is a reliable, secure, and useful technology for sending data to the monitoring service.

Connection strings allow you to take advantage of the latest capabilities of Application Insights.

1.  **Reliability:** Connection strings make telemetry ingestion more reliable by removing dependencies on global ingestion endpoints. This helps to eliminate single points of failure.

2.  **Security:** Connection strings allow authenticated telemetry ingestion. By leveraging [Azure AD authentication for Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/azure-ad-authentication?tabs=net), you can enhance the security and reliability of the telemetry used to make both critical operational (alerting, automatic scaling, etc.) and business decisions.

3.  **Customizing endpoints (sovereign or hybrid cloud environments):** Users can send data to a defined [Azure Government Region](https://docs.microsoft.com/en-us/azure/azure-monitor/app/custom-endpoints?tabs=net#regions-that-require-endpoint-modification). Connection strings allow defining endpoint settings for intranet servers or hybrid cloud settings, as well as modifying endpoints your resource will use as a destination for telemetry. ([see examples](https://docs.microsoft.com/en-us/azure/azure-monitor/app/sdk-connection-string?tabs=net#how-to-set-a-connection-string))

4.  **Privacy (regional endpoints)** – Connection strings ease privacy concerns by sending data to regional endpoints, ensuring data does not leave a geographic region.

## Troubleshooting

If data is no longer arriving in Application Insights after migration from an instrumentation key to a connection string, verify the following:

1.  Confirm you are using a supported SDK/agent that supports connection strings. If you use Application Insights integration in another Azure product offering, check its documentation on how to properly configure a Connection String.

2.  Confirm you are not setting both an instrumentation key and connection string at the same time. Instrumentation key settings should be completely removed from your configuration.

3.  Confirm your Connection String is exactly as provided in the Azure Portal.

## FAQ

### How does this impact auto instrumentation scenarios?

Auto instrumentation scenarios are not impacted, but you cannot enable [Azure AD authentication](https://docs.microsoft.com/en-us/azure/azure-monitor/app/azure-ad-authentication?tabs=net) for [auto instrumentation](https://docs.microsoft.com/en-us/azure/azure-monitor/app/codeless-overview) scenarios.

### What is the difference between global and regional ingestion?

Global ingestion sends all telemetry data to a single endpoint, no matter where this data will end up or be stored. Regional ingestion allows you to define specific endpoints per region for data ingestion, ensuring data stays within a specific region during processing and storage.

### How does it impact the billing?

Billing is not impacted.

### Microsoft Q&A

Post questions to the [answers forum](https://aka.ms/connectionstrings-qna).