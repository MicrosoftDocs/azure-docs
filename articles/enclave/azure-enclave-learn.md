---
title: Learn Azure Enclave
description: Understand Azure Enclave core concepts.
author: aserfass-msft
ms.author: aserfass
ms.topic: tutorial
ms.date: 9/30/2025
ai-usage: ai-assisted
---

# Learn about Azure Enclave

If you're new to Azure Enclave, this article helps introduce core concepts to understand, communicate, and plan Azure Enclave environments.

## Visualize Azure Enclave

You can think of an Azure Enclave environment as a connection of network resources or as an organization of resource groups. Both are correct and can be helpful when visualizing an Azure Enclave environment depending on your role and goals.

### Network diagram

This diagram shows networking connections within Azure Enclave. The diagram should look similar to a typical hub and spoke network. The community Virtual WAN is the hub and each enclave is a spoke off of that hub. 

[ ![Diagram showing an example community with two regions, three enclaves, and 4 workloads.](./media/mermaid-azure-enclave-network-links.svg) ](./media/mermaid-azure-enclave-network-links.svg#lightbox)

<!--
This is the mermaid definition for the above diagram. Use this to edit and regenerate the image.

```mermaid
---
title: Azure Enclave - Network Overview
config:
  theme: base
---
flowchart LR
  OnPremises[on-premises]
  Internet([Internet])
  subgraph Subscription [Subscription]
    subgraph Community [Community]
      subgraph VirtualWAN [Virtual WAN]
        HUB1([Virtual WAN Hub East US
            with Firewall
            ])
        HUB2([Virtual WAN Hub West US
            with Firewall
            ])
        TH([Transit Hub])
      end
    end
    subgraph Enclave3 [Enclave C - East US]
      VNET3[Virtual Network]
      subgraph Workload3 [Cosmos DB Workload]
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
  Internet ---- HUB2
  OnPremises ---|VPN|TH--- HUB1
  HUB1 --- HUB2
  HUB1 ---- VNET1
  HUB1 ---- VNET3
  HUB2 --- VNET2
  VNET3 --- CosmosDB
  VNET1 --- VM1
  VNET1 --- SA1
  VNET2 --- AKS1
  
%% Styling
  linkStyle default stroke-width:4px,stroke:Black;
  
  classDef subscription fill:#9F9F9F,stroke:#004578,color:#000;
  classDef community fill:#00A4EF,stroke:#004578,color:#fff;
  classDef virtualWAN fill:#CFCFCF,stroke:#0078D4,color:#000;
  classDef VWANhub fill:#F3F2F1,stroke:#0078D4,color:#000;
  classDef vnet fill:#CFCFCF,stroke:#0078D4,color:#000;
  classDef enclave fill:#8ddbff,stroke:#0078D4,color:#000;
  classDef endpoint fill:#F3F2F1,stroke:#605E5C,color:#000;
  classDef workload fill:#dbf4ff,stroke:#000000,color:#000;
  classDef service fill:#ffe366,stroke:#000000,color:#000;
  classDef external fill:orange,stroke:#8A8886,color:#000;

  class Subscription subscription;
  class Community community;
  class VirtualWAN virtualWAN;
  class HUB1,HUB2 VWANhub;
  class VNET1,VNET2,VNET3 vnet;
  class Enclave1,Enclave2,Enclave3 enclave;
  class TH endpoint;
  class Workload1,Workload2,Workload3,Workload4 workload;
  class CosmosDB,VM1,SA1,AKS1 service;
  class OnPremises,Internet external;
```
-->

## How can I get more familiar with Azure Enclave?

Start with [What is Azure Enclave?](./what-azure-enclave.md), review the [Learn Azure Enclave article](./azure-enclave-learn.md), then create resources in a [tutorial](./1-1-create-community.md) or [sample templates](./azure-enclave-templates.md) to deploy reference architectures. Review the [best practices](./best-practices.md) article when you're ready to start planning a production design. For service limits, see [Quotas and region availability](./quotas-region-availability.md).

## Next steps
To learn more about the new Azure Enclave resources, see the following articles:

- [Why use Azure Enclave?](./why-azure-enclave.md)
- [Get started with Azure Enclave](./onboard.md)
- [What is a community?](./what-community.md)
- [What is an enclave?](./what-enclave.md)
- [What is a workload?](./what-workload.md)
- [Azure Enclave tutorials](./1-1-create-community.md)