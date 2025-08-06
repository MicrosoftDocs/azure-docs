# Azure Load Balancer Gaming Platform Architecture

This diagram illustrates the Azure Load Balancer architecture for a gaming platform migration from AWS Network Load Balancer, featuring multi-protocol support, zone redundancy, and VMSS Flex orchestration.

```mermaid
flowchart TB
    subgraph Internet ["🌐 Internet"]
        Clients["Gaming Clients<br/>TCP & UDP Traffic"]
    end
    
    subgraph Azure ["☁️ Azure East US Region"]
        subgraph LB_Frontend ["Azure Standard Load Balancer"]
            LB["Load Balancer<br/>Zone-Redundant<br/>Static Public IP<br/>Floating IP (DSR)"]
        end
        
        subgraph Zone1 ["🏢 Availability Zone 1"]
            subgraph SessionSubnet1 ["Session Management Subnet"]
                SessionVMSS1["Session Management<br/>VMSS Flex<br/>TCP Port 7777"]
            end
            subgraph GameSubnet1 ["Game Data Subnet"]
                GameVMSS1["Real-time Game Data<br/>VMSS Flex<br/>UDP Port 7778"]
            end
        end
        
        subgraph Zone2 ["🏢 Availability Zone 2"]
            subgraph SessionSubnet2 ["Session Management Subnet"]
                SessionVMSS2["Session Management<br/>VMSS Flex<br/>TCP Port 7777"]
            end
            subgraph GameSubnet2 ["Game Data Subnet"]
                GameVMSS2["Real-time Game Data<br/>VMSS Flex<br/>UDP Port 7778"]
            end
        end
        
        subgraph Zone3 ["🏢 Availability Zone 3"]
            subgraph SessionSubnet3 ["Session Management Subnet"]
                SessionVMSS3["Session Management<br/>VMSS Flex<br/>TCP Port 7777"]
            end
            subgraph GameSubnet3 ["Game Data Subnet"]
                GameVMSS3["Real-time Game Data<br/>VMSS Flex<br/>UDP Port 7778"]
            end
        end
        
        subgraph DataServices ["Data Services"]
            Redis[("Azure Cache for Redis<br/>Session State")]
            Cosmos[("Azure Cosmos DB<br/>Player Data")]
        end
    end
    
    %% Traffic Flow
    Clients --> LB
    
    %% Load Balancer to Backend Pools
    LB -->|TCP 7777| SessionVMSS1
    LB -->|TCP 7777| SessionVMSS2
    LB -->|TCP 7777| SessionVMSS3
    
    LB -->|UDP 7778| GameVMSS1
    LB -->|UDP 7778| GameVMSS2
    LB -->|UDP 7778| GameVMSS3
    
    %% Backend Services to Data Services
    SessionVMSS1 --> Redis
    SessionVMSS2 --> Redis
    SessionVMSS3 --> Redis
    
    GameVMSS1 --> Cosmos
    GameVMSS2 --> Cosmos
    GameVMSS3 --> Cosmos
    
    %% Styling
    classDef lbClass fill:#0078d4,stroke:#005a9f,stroke-width:2px,color:#fff
    classDef sessionClass fill:#00bcf2,stroke:#0099d4,stroke-width:2px,color:#fff
    classDef gameClass fill:#00d4aa,stroke:#00b894,stroke-width:2px,color:#fff
    classDef dataClass fill:#ff6b35,stroke:#e55100,stroke-width:2px,color:#fff
    classDef zoneClass fill:#f5f5f5,stroke:#999,stroke-width:1px,stroke-dasharray: 5 5
    
    class LB lbClass
    class SessionVMSS1,SessionVMSS2,SessionVMSS3 sessionClass
    class GameVMSS1,GameVMSS2,GameVMSS3 gameClass
    class Redis,Cosmos dataClass
```

## Architecture Components

### Load Balancer Configuration
- **Azure Standard Load Balancer** with zone-redundant deployment
- **Static Public IP** for consistent client endpoints
- **Floating IP (DSR)** enabled for client IP preservation
- **Multi-protocol support** for TCP and UDP traffic

### Backend Pools
- **Session Management Pool**: VMSS Flex orchestration handling TCP traffic on port 7777
- **Real-time Game Data Pool**: VMSS Flex orchestration handling UDP traffic on port 7778

### Availability Zones
- **Zone 1, 2, 3**: Each contains both service types in separate subnets
- **Subnet isolation**: Session management and game data services isolated per zone
- **Network Security Groups**: Protecting each subnet tier

### Data Services
- **Azure Cache for Redis**: Session state management for session services
- **Azure Cosmos DB**: Player data storage for game data services

### Traffic Flow
1. Gaming clients send TCP and UDP traffic through the internet
2. Azure Load Balancer receives traffic via static public IP
3. Load balancer routes TCP traffic (port 7777) to session management backend pool
4. Load balancer routes UDP traffic (port 7778) to game data backend pool
5. Session management services connect to Azure Cache for Redis
6. Game data services connect to Azure Cosmos DB for player data

This architecture provides high availability, ultra-low latency, and scalable performance for multiplayer gaming workloads migrated from AWS Network Load Balancer.
