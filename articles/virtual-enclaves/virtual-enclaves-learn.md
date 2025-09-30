---
title: Learn Azure Virtual Enclaves
description: Understand Azure Virtual Enclaves core concepts.
author: aserfass-msft
ms.author: aserfass
ms.topic: tutorial
ms.date: 9/30/2025
---

# Learn about Azure Virtual Enclaves

If you're new to Azure Virtual Enclaves (AVE), this articles helps introduce core concepts to understand and plan AVE environments.

## Visualize Azure Virtual Enclaves

You can think of a Virtual Enclaves environment as a connection of network resources or as an organization of resource groups. Both can be helpful depending on your role and goals.

### Network diagram
This is a visual showing networking connections within Azure Virtual Enclaves. This looks similar to a typical hub and spoke network.

```mermaid
---
title: Azure Virtual Enclaves Network Overview
---
flowchart
  <!-- direction TB -->
  OnPremises[On-Premises]
  Internet([Internet])
  subgraph Subscription
    direction LR
    subgraph Community
      direction LR
      subgraph VirtualWAN [Virtual WAN]
        direction LR
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
      VN3[Virtual Network]
      subgraph Workload3 [CosmosDB Workload]
        CosmosDB[Cosmos DB C]
      end
    end
    subgraph Enclave1 [Enclave B - East US]
      VN1[Virtual Network]
      subgraph Workload1 [Desktops Workload]
        VM1[Virtual Machine B]
      end
      subgraph Workload4 [Storage Workload]
        SA1[Storage B]
      end
    end
    subgraph Enclave2 [Enclave A - West US]
      VN2[Virtual Network]
      subgraph Workload2 [AKS Workload]
        AKS1[Azure Kubernetes Service A]
      end
    end
  end
  HUB1 === HUB2
  HUB1 ==== VN1
  HUB1 ==== VN3
  VN3 === CosmosDB
  VN1 === VM1
  VN1 === SA1
  HUB2 === VN2
  VN2 === AKS1
  Internet === HUB2
  OnPremises === |VPN|TH === HUB1

  
%% Styling
  classDef subscription fill:#CFCFCF,stroke:#004578,color:#000;
  classDef community fill:#0078D4,stroke:#004578,color:#fff;
  classDef virtualWAN fill:#777475,stroke:#0078D4,color:#000;
  classDef enclave fill:#E6F2FA,stroke:#0078D4,color:#000;
  classDef endpoint fill:#F3F2F1,stroke:#605E5C,color:#000;
  classDef workload fill:#CFCFCF,stroke:#8A8886,color:#000;

  class Subscription subscription;
  class Community community;
  class VirtualWAN virtualWAN;
  class Enclave1,Enclave2,Enclave3 enclave;
  class TH endpoint;
  class Workload1,Workload2,Workload3,Workload4 workload;
```

### Organization diagram
This is a visual showing how the Azure Virtual Enclaves resources are organized in resource groups. This view is helpful if you are displaying how the resources are organized and where they are located. It can also be helpful when discussing role permissions which are often assigned at the subscription or resource group level.

```mermaid
---
title: Azure Virtual Enclaves Resource Groups
---
flowchart
  <!-- direction TB -->
  OnPremises[On-Premises]
  Internet([Internet])
  subgraph Subscription
    direction LR
    subgraph ave-resource-groups [Resource Groups]
      direction TB
      Community[Community]
      Enclave1[Enclave B]
      Enclave2[Enclave A]
      Enclave3[Enclave C]
    end
    subgraph Community-MRG [Community MRG]
        direction LR
        subgraph VirtualWAN [Virtual WAN]
          direction LR
          HUB1([VWAN Hub East US
              with Firewall
              ])
          HUB2([VWAN Hub West US
              with Firewall
              ])
          TH([Transit Hub])
        end
      end
    subgraph Enclave3-MRG [Enclave C - East US]
      VN3[Virtual Network]
      subgraph Workload3 [CosmosDB Workload]
        subgraph WL3-RG-CosmosDB [CosmosDB Resource Group]
          CosmosDB[Cosmos DB C]
        end
      end
    end
    subgraph Enclave1-MRG [Enclave B - East US]
      VN1[Virtual Network]
      subgraph Workload1 [Desktops Workload]
        subgraph WL1-RG-Desktops [Desktops Resource Group]
          VM1[Virtual Machine B]
        end
      end
      subgraph Workload4 [Storage Workload]
        subgraph WL4-RG-Storage [Storage Resource Group]
          SA1[Storage B]
        end
      end
    end
    subgraph Enclave2-MRG [Enclave A - West US]
      VN2[Virtual Network]
      subgraph Workload2 [AKS Workload]
        subgraph WL2-RG-AKS [AKS Resource Group]
          AKS1[Azure Kubernetes Service A]
        end
      end
    end
  end
  HUB1 === HUB2
  HUB1 ==== VN1
  HUB1 ==== VN3
  VN3 === CosmosDB
  VN1 === VM1
  VN1 === SA1
  HUB2 === VN2
  VN2 === AKS1
  Internet === HUB2
  OnPremises === |VPN|TH === HUB1

  
%% Styling
  classDef subscription fill:#CFCFCF,stroke:#004578,color:#000;
  classDef community fill:#0078D4,stroke:#004578,color:#fff;
  classDef virtualWAN fill:#777475,stroke:#0078D4,color:#000;
  classDef enclave fill:#E6F2FA,stroke:#0078D4,color:#000;
  classDef endpoint fill:#F3F2F1,stroke:#605E5C,color:#000;
  classDef workload fill:#CFCFCF,stroke:#8A8886,color:#000;

  class Subscription subscription;
  class Community community;
  class VirtualWAN virtualWAN;
  class Enclave1,Enclave2,Enclave3 enclave;
  class TH endpoint;
  class Workload1,Workload2,Workload3,Workload4 workload;
```