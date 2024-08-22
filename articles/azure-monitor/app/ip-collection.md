---
title: Application Insights IP address collection | Microsoft Docs
description: Understand how Application Insights handles IP addresses and geolocation.
ms.topic: conceptual
ms.date: 07/24/2024
ms.reviewer: mmcc
---

# Geolocation and IP address handling

This article explains how geolocation lookup and IP address handling work in [Application Insights](app-insights-overview.md#application-insights-overview).

## Default behavior

By default, IP addresses are temporarily collected but not stored.

When telemetry is sent to Azure, the IP address is used in a geolocation lookup. The result is used to populate the fields `client_City`, `client_StateOrProvince`, and `client_CountryOrRegion`. The address is then discarded, and `0.0.0.0` is written to the `client_IP` field.

The telemetry types are:

* **Browser telemetry**: Application Insights collects the sender's IP address. The ingestion endpoint calculates the IP address.
* **Server telemetry**: The Application Insights telemetry module temporarily collects the client IP address when the `X-Forwarded-For` header isn't set. When the incoming IP address list has more than one item, the last IP address is used to populate geolocation fields.

This behavior is by design to help avoid unnecessary collection of personal data and IP address location information.

When IP addresses aren't collected, city and other geolocation attributes also aren't collected.

## Storage of IP address data

> [!WARNING]
> The default and our recommendation is to not collect IP addresses. If you override this behavior, verify the collection doesn't break any compliance requirements or local regulations.
>
> To learn more about handling personal data, see [Guidance for personal data](../logs/personal-data-mgmt.md).

To enable IP collection and storage, the `DisableIpMasking` property of the Application Insights component must be set to `true`.

Options to set this property include:

- [ARM template](#arm-template)
- [Portal](#portal)
- [REST API](#rest-api)
- [PowerShell](#powershell)

### ARM template

```json
{
       "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/microsoft.insights/components/<resource-name>",
       "name": "<resource-name>",
       "type": "microsoft.insights/components",
       "location": "westcentralus",
       "tags": {
              
       },
       "kind": "web",
       "properties": {
              "Application_Type": "web",
              "Flow_Type": "Redfield",
              "Request_Source": "IbizaAIExtension",
              // ...
              "DisableIpMasking": true
       }
}
```

### Portal

If you need to modify the behavior for only a single Application Insights resource, use the Azure portal.

1. Go to your Application Insights resource, and then select **Automation** > **Export template**.

1. Select **Deploy**.

    :::image type="content" source="media/ip-collection/deploy.png" lightbox="media/ip-collection/deploy.png" alt-text="Screenshot that shows the Deploy button.":::

1. Select **Edit template**.

    :::image type="content" source="media/ip-collection/edit-template.png" lightbox="media/ip-collection/edit-template.png" alt-text="Screenshot that shows the Edit button, along with a warning about the resource group.":::

    > [!NOTE]
    > If you experience the error shown in the preceding screenshot, you can resolve it. It states: "The resource group is in a location that is not supported by one or more resources in the template. Please choose a different resource group." Temporarily select a different resource group from the dropdown list and then re-select your original resource group.

1. In the JSON template, locate `properties` inside `resources`. Add a comma to the last JSON field, and then add the following new line: `"DisableIpMasking": true`. Then select **Save**.

    :::image type="content" source="media/ip-collection/save.png" lightbox="media/ip-collection/save.png" alt-text="Screenshot that shows the addition of a comma and a new line after the property for request source.":::

1. Select **Review + create** > **Create**.

    > [!NOTE]
    > If you see "Your deployment failed," look through your deployment details for the one with the type `microsoft.insights/components` and check the status. If that one succeeds, the changes made to `DisableIpMasking` were deployed.

1. After the deployment is complete, new telemetry data will be recorded.

    If you select and edit the template again, only the default template without the newly added property. If you aren't seeing IP address data and want to confirm that `"DisableIpMasking": true` is set, run the following PowerShell commands:
    
    ```powershell
    # Replace `Fabrikam-dev` with the appropriate resource and resource group name.
    # If you aren't using Azure Cloud Shell, you need to connect to your Azure account
    # Connect-AzAccount 
    $AppInsights = Get-AzResource -Name 'Fabrikam-dev' -ResourceType 'microsoft.insights/components' -ResourceGroupName 'Fabrikam-dev'
    $AppInsights.Properties
    ```
    
    A list of properties is returned as a result. One of the properties should read `DisableIpMasking: true`. If you run the PowerShell commands before you deploy the new property with Azure Resource Manager, the property doesn't exist.

### REST API

The following [REST API](/rest/api/azure/) payload makes the same modifications:

```json
PATCH https://management.azure.com/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/microsoft.insights/components/<resource-name>?api-version=2018-05-01-preview HTTP/1.1
Host: management.azure.com
Authorization: AUTH_TOKEN
Content-Type: application/json
Content-Length: 54

{
       "location": "<resource location>",
       "kind": "web",
       "properties": {
              "Application_Type": "web",
              "DisableIpMasking": true
       }
}
```

### PowerShell

The PowerShell `Update-AzApplicationInsights` cmdlet can disable IP masking with the `DisableIPMasking` parameter.

```powershell
Update-AzApplicationInsights -Name "aiName" -ResourceGroupName "rgName" -DisableIPMasking:$true
```

For more information on the `Update-AzApplicationInsights` cmdlet, see [Update-AzApplicationInsights](/powershell/module/az.applicationinsights/update-azapplicationinsights)

## Next steps

* Learn more about [personal data collection](../logs/personal-data-mgmt.md) in Azure Monitor.
* Learn how to [set the user IP](opentelemetry-add-modify.md#set-the-user-ip) using OpenTelemetry.