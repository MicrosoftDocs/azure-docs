---
title: Learn Azure Virtual Enclaves
description: Understand Azure Virtual Enclaves core concepts.
author: aserfass-msft
ms.author: aserfass
ms.topic: tutorial
ms.date: 9/30/2025
---

# Learn about Azure Virtual Enclaves

If you're new to Azure Virtual Enclaves (AVE), this article helps introduce core concepts to understand, communicate, and plan AVE environments.

## Visualize Azure Virtual Enclaves

You can think of a Virtual Enclaves environment as a connection of network resources or as an organization of resource groups. Both can be helpful depending on your role and goals.

### Network diagram

This diagram shows networking connections within Azure Virtual Enclaves. The diagram should look similar to a typical hub and spoke network.

[ ![Diagram showing an example community with two regions, three enclaves, and 4 workloads.](./media/mermaid-virtual-enclaves-network-links.svg) ](./media/mermaid-virtual-enclaves-network-links.svg#lightbox)

<!--
This is the mermaid definition for the above graph. Use this to edit and regenerate the graph image.

```mermaid
---
title: Azure Virtual Enclaves - Network Overview
---
flowchart
  direction TB
  OnPremises[on-premises]
  Internet([Internet])
  subgraph Subscription
    subgraph Community
      subgraph VirtualWAN [Virtual WAN]
        HUB1([VWAN Hub East US
             with Firewall
            ])
        HUB2([VWAN Hub West US
             with Firewall
            ])
        TH([Transit Hub])
      end
    end
    subgraph Enclave3 [Enclave C - East US]
      VNET3[Virtual Network]
      subgraph Workload3 [CosmosDB Workload]
        CosmosDB[Cosmos DB C]
      end
    end
    subgraph Enclave1 [Enclave B - East US]
      VNET1[Virtual Network]
      subgraph Workload1 [Desktops Workload]
        VM1[Virtual Machine B]
      end
      subgraph Workload4 [Storage Workload]
        SA1[Storage B]
      end
    end
    subgraph Enclave2 [Enclave A - West US]
      VNET2[Virtual Network]
      subgraph Workload2 [AKS Workload]
        AKS1[Azure Kubernetes Service A]
      end
    end
  end
  HUB1 === HUB2
  HUB1 ==== VNET1
  HUB1 ==== VNET3
  VNET3 === CosmosDB
  VNET1 === VM1
  VNET1 === SA1
  HUB2 === VNET2
  VNET2 === AKS1
  Internet === HUB2
  OnPremises === |VPN|TH === HUB1

  
%% Styling
  classDef subscription fill:#CFCFCF,stroke:#004578,color:#000;
  classDef community fill:#0078D4,stroke:#004578,color:#fff;
  classDef virtualWAN fill:#777475,stroke:#0078D4,color:#000;
  classDef VWANhub fill:#F3F2F1,stroke:#0078D4,color:#000;
  classDef enclave fill:#E6F2FA,stroke:#0078D4,color:#000;
  classDef endpoint fill:#F3F2F1,stroke:#605E5C,color:#000;
  classDef workload fill:#CFCFCF,stroke:#8A8886,color:#000;
  classDef external fill:#FF5533,stroke:#8A8886,color:#000;

  class Subscription subscription;
  class Community community;
  class VirtualWAN virtualWAN;
  class HUB1,HUB2 VWANhub;
  class Enclave1,Enclave2,Enclave3 enclave;
  class TH endpoint;
  class Workload1,Workload2,Workload3,Workload4 workload;
  class OnPremises,Internet external;
```
-->
