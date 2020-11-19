---
title: Azure PowerShell samples - Apply Windows Azure Diagnostics Extension
description: Sample PowerShell for applying the Windows Azure Diagnostics extension
ms.topic: sample
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Apply Windows Azure Diagnostics extension to Azure Cloud Services (extended support) using ARM Templates

Overview of this doc

```template
"extensionProfile": {
      "extensions": [
        {
          "name": "RDPExtension",
          "properties": {
            "autoUpgradeMinorVersion": false,
            "provisioningState": "Creating",
            "rolesAppliedTo": [
              "*"
            ],
            "publisher": "Microsoft.Windows.Azure.Extensions",
            "type": "RDP",
            "typeHandlerVersion": "1.2.1",
            "settings": “Include XML format of PublicConfig  as a string”
          }
        }
      ]
    }

"extensionProfile": {
          "extensions": [
            {
              "name": "Microsoft.Insights.VMDiagnosticsSettings_WebRole1",
              "properties": {
                "autoUpgradeMinorVersion": true,
                "publisher": "Microsoft.Azure.Diagnostics",
                "type": "PaaSDiagnostics",
                "typeHandlerVersion": "1.5",
                "settings": “Include XML format of PublicConfig  as a string”,
                "protectedSettings": "[parameters('wadPrivateConfig_WebRole1')]",
                "rolesAppliedTo": [
                  "WebRole1"
                ]
              }
            },
            {
              "name": "Microsoft.Insights.VMDiagnosticsSettings_WorkerRole1",
              "properties": {
                "autoUpgradeMinorVersion": true,
                "publisher": "Microsoft.Azure.Diagnostics",
                "type": "PaaSDiagnostics",
                "typeHandlerVersion": "1.5",
                "settings": "[parameters('wadPublicConfig_WorkerRole1')]",
                "protectedSettings": "[parameters('wadPrivateConfig_WorkerRole1')]",
                "rolesAppliedTo": [
                  "WorkerRole1"
                ]
              }
            }
          ]
        }
```

## Next steps


