---
title: Resource Manager template samples for action groups
description: Sample Azure Resource Manager templates to deploy Azure Monitor action groups.
ms.topic: sample
ms.custom: devx-track-arm-template
ms.date: 04/27/2022
ms.reviewer: dukek
---

# Resource Manager template samples for action groups in Azure Monitor

This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to create [action groups](../alerts/action-groups.md) in Azure Monitor. Each sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]

## Create an action group

The following sample creates an action group.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Unique name within the resource group for the Action group.')
param actionGroupName string

@description('Short name up to 12 characters for the Action group.')
param actionGroupShortName string

resource actionGroup 'Microsoft.Insights/actionGroups@2021-09-01' = {
  name: actionGroupName
  location: 'Global'
  properties: {
    groupShortName: actionGroupShortName
    enabled: true
    smsReceivers: [
      {
        name: 'contosoSMS'
        countryCode: '1'
        phoneNumber: '5555551212'
      }
      {
        name: 'contosoSMS2'
        countryCode: '1'
        phoneNumber: '5555552121'
      }
    ]
    emailReceivers: [
      {
        name: 'contosoEmail'
        emailAddress: 'devops@contoso.com'
        useCommonAlertSchema: true
      }
      {
        name: 'contosoEmail2'
        emailAddress: 'devops2@contoso.com'
        useCommonAlertSchema: true
      }
    ]
    webhookReceivers: [
      {
        name: 'contosoHook'
        serviceUri: 'http://requestb.in/1bq62iu1'
        useCommonAlertSchema: true
      }
      {
        name: 'contosoHook2'
        serviceUri: 'http://requestb.in/1bq62iu2'
        useCommonAlertSchema: true
      }
    ]
  }
}

output actionGroupId string = actionGroup.id
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "actionGroupName": {
      "type": "string",
      "metadata": {
        "description": "Unique name within the resource group for the Action group."
      }
    },
    "actionGroupShortName": {
      "type": "string",
      "metadata": {
        "description": "Short name up to 12 characters for the Action group."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/actionGroups",
      "apiVersion": "2021-09-01",
      "name": "[parameters('actionGroupName')]",
      "location": "Global",
      "properties": {
        "groupShortName": "[parameters('actionGroupShortName')]",
        "enabled": true,
        "smsReceivers": [
          {
            "name": "contosoSMS",
            "countryCode": "1",
            "phoneNumber": "5555551212"
          },
          {
            "name": "contosoSMS2",
            "countryCode": "1",
            "phoneNumber": "5555552121"
          }
        ],
        "emailReceivers": [
          {
            "name": "contosoEmail",
            "emailAddress": "devops@contoso.com",
            "useCommonAlertSchema": true
          },
          {
            "name": "contosoEmail2",
            "emailAddress": "devops2@contoso.com",
            "useCommonAlertSchema": true
          }
        ],
        "webhookReceivers": [
          {
            "name": "contosoHook",
            "serviceUri": "http://requestb.in/1bq62iu1",
            "useCommonAlertSchema": true
          },
          {
            "name": "contosoHook2",
            "serviceUri": "http://requestb.in/1bq62iu2",
            "useCommonAlertSchema": true
          }
        ]
      }
    }
  ],
  "outputs": {
    "actionGroupId": {
      "type": "string",
      "value": "[resourceId('Microsoft.Insights/actionGroups', parameters('actionGroupName'))]"
    }
  }
}
```

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "actionGroupName": {
        "value": "My Action Group"
      },
      "actionGroupShortName": {
        "value": "mygroup"
      }
  }
}
```

## Next steps

* [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
* [Learn more about action groups](../alerts/action-groups.md).
