---
title: Migrate from Application Insights instrumentation keys to connection strings
description: Learn the steps required to upgrade from Azure Monitor Application Insights instrumentation keys to connection strings.
ms.topic: conceptual
ms.date: 09/12/2023
ms.reviewer: cogoodson
---

# Migrate from Application Insights instrumentation keys to connection strings

This article walks through migrating from instrumentation keys to [connection strings](sdk-connection-string.md#overview).

## Prerequisites

- A [supported SDK version](#supported-sdk-versions)
- An existing [Application Insights resource](create-workspace-resource.md)

## Migration

:::image type="content" source="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png" alt-text="Screenshot that shows Application Insights overview and connection string." lightbox="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png":::

1. Go to the **Overview** pane of your Application Insights resource.

1. Find your **Connection String** displayed on the right.

1. Hover over the connection string and select the **Copy to clipboard** icon.

1. Configure the Application Insights SDK by following [How to set connection strings](sdk-connection-string.md#set-a-connection-string).

> [!IMPORTANT]
> Don't use both a connection string and an instrumentation key. The latter one set supersedes the other, and could result in telemetry not appearing on the portal. [missing data](#missing-data).

## Migration at scale

Use environment variables to pass a connection string to the Application Insights SDK or agent.

To set a connection string via an environment variable, place the value of the connection string into an environment variable named `APPLICATIONINSIGHTS_CONNECTION_STRING`.

This process can be [automated in your Azure deployments](../../azure-resource-manager/templates/deploy-portal.md#deploy-resources-with-arm-templates-and-azure-portal). For example, the following Azure Resource Manager template shows how you can automatically include the correct connection string with an Azure App Service deployment. Be sure to include any other app settings your app requires:

```JSON
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

Connection strings provide a single configuration setting and eliminate the need for multiple proxy settings.

- **Reliability**: Connection strings make telemetry ingestion more reliable by removing dependencies on global ingestion endpoints.
- **Security**: Connection strings allow authenticated telemetry ingestion by using [Microsoft Entra authentication for Application Insights](azure-ad-authentication.md).
- **Customized endpoints (sovereign or hybrid cloud environments)**: Endpoint settings allow sending data to a specific Azure Government region. ([See examples](sdk-connection-string.md#set-a-connection-string).)
- **Privacy (regional endpoints)**: Connection strings ease privacy concerns by sending data to regional endpoints, ensuring data doesn't leave a geographic region.

## Supported SDK versions

- .NET and .NET Core v2.12.0+
- Java v2.5.1 and Java 3.0+
- JavaScript v2.3.0+
- NodeJS v1.5.0+
- Python v1.0.0+

## Troubleshooting

This section provides troubleshooting solutions.

### Alert: "Transition to using connection strings for data ingestion"

Follow the [migration steps](#migration) in this article to resolve this alert.

### Missing data

- Confirm you're using a [supported SDK version](#supported-sdk-versions). If you use Application Insights integration in another Azure product offering, check its documentation on how to properly configure a connection string.
- Confirm you aren't setting both an instrumentation key and connection string at the same time. Instrumentation key settings should be removed from your configuration.
- Confirm your connection string is exactly as provided in the Azure portal.

### Environment variables aren't working

 If you hardcode an instrumentation key in your application code, that programming might take precedence before environment variables.

## Frequently asked questions

This section provides answers to common questions.

### Where else can I find my connection string?

The connection string is also included in the Resource Manager resource properties for your Application Insights resource, under the field name `ConnectionString`.

### How does this affect autoinstrumentation?

Autoinstrumentation scenarios aren't affected.

<a name='can-i-use-azure-ad-authentication-with-autoinstrumentation'></a>

### Can I use Microsoft Entra authentication with autoinstrumentation?

You can't enable [Microsoft Entra authentication](azure-ad-authentication.md) for [autoinstrumentation](codeless-overview.md) scenarios. We have plans to address this limitation in the future.

### What's the difference between global and regional ingestion?

Global ingestion sends all telemetry data to a single endpoint, no matter where this data will be stored. Regional ingestion allows you to define specific endpoints per region for data ingestion. This capability ensures data stays within a specific region during processing and storage.

### How do connection strings affect the billing?

Billing isn't affected.

### Microsoft Q&A

Post questions to the [answers forum](/answers/topics/24223/azure-monitor.html).
