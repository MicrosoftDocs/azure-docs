---
title: SignalR Application Firewall (Preview)
description: An introduction about why and how to setup Application Firewall for Azure SignalR service
author: biqian
ms.service: signalr
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 07/10/2024
ms.author: biqian
---
# Application Firewall for Azure SignalR Service

Application Firewall brings more sophisticated control over client connections over a distributed system. In this doc,  typical scenarios are  demonstrated to show how Application Firewall rules work and how to configure them. Before that, let's clarify what Application Firewall don't do:

1. It's not intended to replace Authentication. The firewall works behind the client conenction authentication layer.
2. It's not related to the network layer access control. 

## Prerequisites

* An Azure SignalR Service in [Premium tier](https://azure.microsoft.com/pricing/details/signalr-service/).

## Typical Scenarios

   Contoso is a software company. Its product uses Azure SignalR service to send/receive messages. 

   ### Scenario 1: Limit the connections per user
   ### Scenario 2: Limit the token reuse
   ### Scenario 3: Advanced control by custom claim


## Setup Application Firewall 

# [Portal](#tab/Portal)
To use Application Firewall, Navigate to the SignalR **Application Firewall** blade on the Azure portal and click **Add** to create a replica. It will be automatically enabled upon creation.

![Screenshot of creating replica for Azure SignalR on Portal.](./media/howto-enable-geo-replication/signalr-replica-create.png "Replica create")

After creation, you would be able to view/edit your replica on the portal by clicking the replica name.

# [Bicep](#tab/Bicep)

Use Visual Studio Code or your favorite editor to create a file with the following content and name it main.bicep:

```bicep
@description('The name for your SignalR service')
param resourceName string = 'contoso'

resource primary 'Microsoft.SignalRService/signalr@2024-04-01-preview' = {
  name: resourceName
  properties: {
    applicationFirewall:{
        clientConnectionCountRules:[
            {
                type:"ThrottleByUserId",
                count: 5
            }
        ]
    }
  }
}
```

Deploy the Bicep file using Azure CLI 
   ```azurecli
   az deployment group create --resource-group MyResourceGroup --template-file main.bicep
   ```

----


