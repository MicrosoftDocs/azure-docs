---
title: What SAP on Azure offerings are available?
description: Learn about the different offerings for running and managing your SAP systems on Azure. These include SAP virtual machine workloads, Azure Center for SAP solutions, the SAP on Azure deployment automation framework, and Azure Monitor for SAP solutions.
author: ju-shim
ms.author: bentrin
ms.service: sap-on-azure
ms.topic: overview

ms.date: 02/03/2026

ms.custom: template-overview
# Customer intent: As an IT manager overseeing SAP systems, I want to explore available offerings for running and managing SAP on Azure, so that I can choose the best solutions for deploying, integrating, and monitoring our SAP workloads effectively.
---

# SAP on Azure offerings

## Overview

**Purpose**: Comprehensive guide to Microsoft Azure offerings for SAP system deployment and management  
**Scope**: Traditional VM workloads, Azure-native services, and integrated tools  
**Target Audience**: IT managers, SAP administrators, and cloud architects  
**Decision Outcome**: Select optimal Azure services for SAP workload requirements

Microsoft Azure provides multiple offerings for running and managing SAP systems, ranging from traditional Azure Virtual Machine deployments to top-level Azure services and integrated tools that extend SAP capabilities across the Microsoft ecosystem.

## Key Terminology

- **SAP Workload**: SAP applications, databases, and supporting infrastructure components
- **Azure Center for SAP**: Native Azure service making SAP a top-level workload
- **SAP Integration**: Connectivity between SAP systems and Microsoft services
- **IaaS (Infrastructure as a Service)**: VM-based SAP deployments on Azure compute
- **SaaS (Software as a Service)**: Cloud-delivered SAP applications
- **SAP Landscape**: Complete SAP environment including all system components
- **Azure-Native**: Services built specifically for Azure platform integration

## SAP on Azure Service Categories

### Core SAP on Azure Services

| Service Category | Primary Use Case | Deployment Model | Management Level |
|-----------------|------------------|------------------|------------------|
| **VM Workloads** | Traditional SAP hosting | IaaS | Customer-managed |
| **Azure Center for SAP** | Unified SAP management | Native Azure service | Microsoft-managed |
| **Deployment Automation** | Infrastructure orchestration | Open-source framework | Customer-controlled |
| **Monitoring Solutions** | SAP landscape monitoring | Azure-native monitoring | Hybrid management |


### SAP on Azure VM Workloads

**Service Overview**: Run SAP workloads on Azure Virtual Machines with certified configurations  
**Certification Status**: Azure is certified for multiple SAP products including SAP HANA and SAP NetWeaver  
**Use Case**: Traditional SAP deployments requiring infrastructure control

**Key Capabilities**:
- Multiple Azure VM offerings optimized for SAP workloads
- Certified configurations for SAP HANA and NetWeaver products
- Flexible sizing and configuration options
- Integration with Azure native services

**Reference**: [SAP on Azure VM workloads](workloads/get-started.md) | [SAP certifications](workloads/certifications.md)

### Azure Center for SAP Solutions

**Service Overview**: End-to-end solution for creating and running SAP systems as unified Azure workloads  
**Service Level**: Top-level Azure service making SAP a first-class workload  
**Access Methods**: Azure portal, REST API, Azure CLI

**Key Capabilities**:
- Unified SAP system lifecycle management
- Native Azure portal integration
- Automated deployment and configuration
- Integrated monitoring and operations

**Use Case Scenarios**:
- New SAP deployments requiring simplified management
- Organizations prioritizing Azure-native tooling
- Environments needing integrated lifecycle management

**Reference**: [Azure Center for SAP solutions](center-sap-solutions/overview.md)

### SAP on Azure Deployment Automation Framework

**Service Overview**: Open-source orchestration tool for SAP environment deployment, installation, and maintenance  
**Service Type**: Community-driven automation framework  
**Management Model**: Customer-controlled with Microsoft support

**Key Capabilities**:
- Infrastructure-as-code SAP deployments
- Automated installation procedures
- Environment maintenance automation
- Customizable deployment templates

**Use Case Scenarios**:
- Large-scale SAP deployments requiring consistency
- DevOps-oriented SAP operations
- Custom deployment requirements beyond standard templates

**Reference**: [SAP on Azure deployment automation framework](automation/deployment-framework.md)

### Azure Monitor for SAP Solutions

**Service Overview**: Azure-native monitoring product specifically designed for SAP landscapes on Azure  
**Integration**: Leverages Azure Monitor infrastructure for SAP-specific metrics  
**Scope**: Comprehensive SAP landscape visibility and alerting

**Key Capabilities**:
- SAP-specific monitoring metrics and alerts
- Integration with Azure Monitor ecosystem
- Performance and availability tracking
- Custom dashboard and reporting capabilities

**Use Case Scenarios**:
- Organizations requiring integrated Azure monitoring
- SAP landscapes needing proactive monitoring
- Compliance requirements for SAP system monitoring

**Reference**: [Azure Monitor for SAP solutions](monitor/about-azure-monitor-sap-solutions.md)

## Microsoft Services Integration

### SAP integration with Microsoft services

**Integration Scope**: SAP workloads (IaaS and SaaS) with Microsoft product ecosystem  
**Service Coverage**: Microsoft Entra ID, Exchange Online, Power Platform, Power BI, Azure Integration Services

**Key Integration Services**:

| Microsoft Service | Integration Capability | Use Case |
|-------------------|----------------------|----------|
| **Microsoft Entra ID** | Identity and access management | Single sign-on, user provisioning |
| **Power Platform** | Business process automation | Custom applications, workflow automation |
| **Power BI** | Business intelligence | SAP data visualization and analytics |
| **Excel** | Data analysis and reporting | SAP data consumption and manipulation |
| **Azure Integration Services** | API management and connectivity | System integration and data exchange |

**SAP Platform Integration**:
- **SAP Business Technology Platform**: Development and integration platform
- **SAP Analytics Cloud**: Cloud-based analytics and planning
- **SAP Data Warehouse Cloud**: Data warehousing and analytics
- **SAP SuccessFactors**: Human capital management integration

**Reference**: [SAP Integration with Microsoft Services](workloads/integration-get-started.md)

## Infrastructure & Compute Services

### Azure Dedicated Hosts

**Service Purpose**: Physical servers dedicated to specific organizations  
**Compliance Benefits**: Meet specific regulatory and licensing requirements  
**SAP Applicability**: Specialized licensing scenarios and compliance requirements

**Key Benefits**:
- Dedicated physical server hardware
- Enhanced security and compliance posture
- Support for specific SAP licensing models
- Predictable performance characteristics

**Limitations**: See SAP Note [1928533] for Azure Dedicated Hosts limitations with SAP applications

**Use Case Scenarios**:
- Regulatory compliance requiring dedicated hardware
- SAP licensing requiring physical server dedication
- Performance requirements needing hardware isolation

**Reference**: [Azure Dedicated Hosts](/azure/virtual-machines/dedicated-hosts)

## Storage Services

### Enterprise Storage Solutions

| Storage Service | Optimized For | Performance Characteristics | Use Cases |
|----------------|---------------|---------------------------|-----------|
| **Azure NetApp Files** | SAP workloads | High performance, low latency | Demanding SAP applications, NFS storage |
| **Azure Files** | File sharing | Managed file shares | Transport directories, cross-platform sharing |

#### Azure NetApp Files

**Service Overview**: Enterprise-grade NFS storage specifically optimized for SAP workloads  
**Performance Profile**: High performance with consistently low latency  
**SAP Optimization**: Purpose-built for demanding SAP application requirements

**Key Capabilities**:
- Enterprise-class NFS storage performance
- Consistent low-latency access patterns
- High availability and disaster recovery features
- Integration with SAP backup and recovery procedures

**Reference**: [Azure NetApp Files](/azure/azure-netapp-files/)

#### Azure Files

**Service Overview**: Managed file shares for SAP transport and shared storage scenarios  
**Protocol Support**: SMB and NFS protocols for cross-platform compatibility  
**Management Model**: Fully managed Azure service

**Key Capabilities**:
- SAP transport directory hosting
- Shared storage for multi-system scenarios
- Cross-platform file sharing capabilities
- Integration with Azure security and compliance features

**Reference**: [Azure Files](/azure/storage/files/) | [Using Azure Premium Files NFS and SMB for SAP](/azure/sap/workloads/planning-guide-storage-azure-files)

## Security & Compliance

### Security Management Services

| Security Service | Primary Function | SAP Integration Points |
|-----------------|------------------|----------------------|
| **Azure Key Vault** | Secrets and key management | Cryptographic keys, certificates, application secrets |
| **Microsoft Defender for Cloud** | Security posture management | Threat protection, compliance monitoring |

#### Azure Key Vault

For more information, see the [SAP integration with Microsoft services](workloads/integration-get-started.md) documentation.

**Service Overview**: Secure storage and management for cryptographic keys, certificates, and secrets  
**SAP Integration**: Centralized secret management for SAP applications and infrastructure  
**Security Benefits**: Hardware security module protection and access control


**Key Capabilities**:
- Centralized cryptographic key management
- Certificate lifecycle management
- Application secret storage and rotation
- Hardware security module (HSM) protection options

**SAP Use Cases**:
- Database connection string management
- SSL certificate management for SAP systems
- API key storage for SAP integrations
- Encryption key management for SAP data

**Reference**: [Azure Key Vault](/azure/key-vault/) | [Security Operations for SAP on Azure](/azure/cloud-adoption-framework/scenarios/sap/sap-lza-security-operations#access-control)

#### Microsoft Defender for Cloud

**Service Overview**: Security posture management and threat protection for Azure workloads  
**SAP Focus**: Specialized security monitoring for SAP workloads on Azure  
**Protection Scope**: Infrastructure, platform, and application-level security

**Key Capabilities**:
- Continuous security posture assessment
- Threat detection and response
- Compliance monitoring and reporting
- Security recommendations and remediation guidance

**SAP-Specific Features**:
- SAP workload security assessment
- Threat detection for SAP-specific attack patterns
- Compliance monitoring for SAP security standards
- Integration with SAP security monitoring tools

**Reference**: [Microsoft Defender for Cloud](/azure/defender-for-cloud/)

## Backup & Disaster Recovery

### Data Protection Services

| Service | Backup Capabilities | Recovery Features | SAP-Specific Benefits |
|---------|-------------------|------------------|----------------------|
| **Azure Backup** | Application-consistent backups | Point-in-time recovery | SAP HANA database backup integration |
| **Azure Site Recovery** | Infrastructure replication | Automated failover | SAP landscape disaster recovery orchestration |

#### Azure Backup

**Service Overview**: Native backup solutions for SAP system components with application-consistent capabilities  
**SAP Integration**: Specialized support for SAP HANA databases and system components  
**Backup Types**: Database backups, file system backups, VM-level backups

**Key Capabilities**:
- Application-consistent SAP HANA backups
- Automated backup scheduling and retention
- Cross-region backup replication
- Integration with SAP backup procedures

**SAP-Specific Features**:
- SAP HANA transaction log backup support
- SAP system component backup orchestration
- Backup validation and recovery testing
- Integration with SAP backup certification requirements

**Reference**: [Azure Backup](/azure/backup/backup-architecture)

#### Azure Site Recovery

**Service Overview**: Disaster recovery orchestration for SAP landscapes with automated capabilities  
**Recovery Scope**: Complete SAP landscape failover and recovery procedures  
**Automation**: Automated failover sequences and recovery plan execution

**Key Capabilities**:
- SAP landscape disaster recovery orchestration
- Automated failover and failback procedures
- Recovery plan customization for SAP systems
- Cross-region replication and recovery

**SAP-Specific Features**:
- SAP system dependency management during failover
- Database and application server recovery coordination
- SAP system startup sequence automation
- Integration with SAP high availability configurations

**Reference**: [Azure Site Recovery](/azure/site-recovery/site-recovery-sap)

## Analytics & AI Integration

### Data Analytics Platform Services

| Analytics Service | Core Capability | SAP Integration Scenarios |
|-------------------|----------------|--------------------------|
| **Azure Synapse Analytics** | Unified analytics platform | SAP data warehousing, big data processing |
| **Microsoft Fabric** | Comprehensive analytics | SAP data integration, business intelligence |

#### Azure Synapse Analytics

**Service Overview**: Unified analytics platform for SAP data warehousing and advanced analytics  
**Integration Scope**: SAP data extraction, transformation, and analytics workloads  
**Analytics Capabilities**: Big data processing, machine learning, and business intelligence

**Key Capabilities**:
- SAP data warehouse modernization
- Real-time and batch analytics processing
- Machine learning model development and deployment
- Integration with Power BI for business intelligence

**SAP Use Cases**:
- SAP data warehouse migration to cloud
- Advanced analytics on SAP transaction data
- Real-time reporting and dashboard creation
- Predictive analytics for SAP business processes

**Reference**: [Azure Synapse Analytics](/azure/sap/workloads/rise-integration-services)

#### Microsoft Fabric

**Service Overview**: Comprehensive analytics platform for SAP data integration and business intelligence  
**Platform Integration**: End-to-end data platform with SAP connectivity  
**Service Scope**: Data integration, transformation, and business intelligence scenarios

**Key Capabilities**:
- SAP data source connectivity and extraction
- Data transformation and modeling capabilities
- Business intelligence and reporting tools
- Real-time data processing and analytics

**SAP Integration Points**:
- Direct SAP system connectivity
- SAP data model integration
- Real-time SAP event processing
- SAP business process analytics

**Reference**: [Microsoft Fabric](/azure/sap/workloads/extract-sap-data#sap-data-extraction-tools-and-solutions)

## DevOps & Management

### Development and Operations Services

| DevOps Service | Primary Function | SAP Application |
|----------------|------------------|----------------|
| **Azure DevOps** | CI/CD pipeline management | SAP development lifecycle automation |
| **Infrastructure as Code** | Template-based deployments | Consistent SAP infrastructure provisioning |
| **Azure Policy** | Governance and compliance | SAP workload standard enforcement |

#### Azure DevOps

**Service Overview**: Continuous integration and deployment pipeline platform for SAP development  
**Development Support**: Modern DevOps practices adapted for SAP environments  
**Pipeline Capabilities**: Automated testing, deployment, and release management

**Key Capabilities**:
- SAP development lifecycle automation
- Continuous integration for SAP code changes
- Automated deployment to SAP environments
- Integration with SAP transport management

**SAP-Specific Features**:
- SAP transport request automation
- SAP code quality analysis integration
- Automated SAP system refresh procedures
- SAP environment provisioning automation

**Reference**: [Azure DevOps](/azure/sap/automation/configure-devops?tabs=linux)

#### Infrastructure as Code

**Service Overview**: Template-based infrastructure provisioning for consistent SAP deployments  
**Template Types**: Azure Resource Manager templates and Bicep language support  
**Deployment Benefits**: Repeatable, version-controlled infrastructure provisioning

**Available Tools**:
- **Azure Resource Manager (ARM) Templates**: JSON-based infrastructure definitions
- **Bicep**: Domain-specific language for ARM template authoring
- **Terraform**: Third-party infrastructure-as-code tool with Azure provider

**SAP Use Cases**:
- Standardized SAP environment provisioning
- Consistent infrastructure configuration across environments
- Version-controlled infrastructure changes
- Automated disaster recovery environment creation

**Reference**: [Azure Resource Manager](/azure/azure-resource-manager/) | [Bicep](/azure/azure-resource-manager/bicep/)

#### Azure Policy

**Service Overview**: Organizational standards enforcement and compliance assessment at scale  
**Governance Scope**: SAP workloads and supporting Azure resources  
**Compliance**: Automated policy enforcement and compliance reporting

**Key Capabilities**:
- SAP workload governance policy definition
- Automated compliance assessment and reporting
- Resource configuration enforcement
- Cost management and resource optimization policies

**SAP Governance Areas**:
- SAP system naming conventions
- Required security configurations
- Resource tagging and organization standards
- Cost optimization and resource sizing policies

**Reference**: [Governance disciplines for SAP on Azure](/azure/cloud-adoption-framework/scenarios/sap/eslz-security-governance-and-compliance#compliance-and-governance-design-recommendations)

## Service Selection Decision Matrix

### Deployment Approach Selection

| Requirement | VM Workloads | Azure Center for SAP | Automation Framework |
|-------------|--------------|---------------------|---------------------|
| **Full Infrastructure Control** | ✓ High | ○ Medium | ✓ High |
| **Azure-Native Management** | ○ Limited | ✓ Full | ○ Limited |
| **Custom Deployment Logic** | ✓ Full | ○ Limited | ✓ Full |
| **Simplified Operations** | ○ Manual | ✓ Automated | ○ Custom |
| **Multi-Cloud Strategy** | ✓ Portable | ○ Azure-specific | ✓ Portable |

**Legend**: ✓ = Strong fit, ○ = Partial fit, ✗ = Not suitable

### Monitoring and Analytics Selection

| Use Case | Azure Monitor for SAP | Azure Synapse | Microsoft Fabric |
|----------|----------------------|----------------|------------------|
| **Operational Monitoring** | ✓ Primary | ○ Limited | ○ Limited |
| **Data Warehousing** | ○ Limited | ✓ Primary | ✓ Primary |
| **Business Intelligence** | ○ Basic | ✓ Advanced | ✓ Comprehensive |
| **Real-time Analytics** | ✓ Operational | ✓ Advanced | ✓ Advanced |
| **SAP-Native Integration** | ✓ Optimized | ○ Standard | ○ Standard |

## Next Steps Decision Path

### 1. Assessment Phase
- **Evaluate current SAP landscape** and migration requirements
- **Identify integration needs** with existing Microsoft services
- **Determine compliance and security requirements**

### 2. Service Selection Phase
- **Choose core hosting approach**: VM workloads vs. Azure Center for SAP
- **Select supporting services** based on requirements matrix
- **Plan integration architecture** with Microsoft ecosystem

### 3. Implementation Phase
- **Start with pilot deployment** using selected services
- **Implement monitoring and security** configurations
- **Establish DevOps and governance** procedures

## Additional Resources

- [SAP solutions on Azure](https://azure.microsoft.com/solutions/sap/)
- [Get started with SAP and Azure integration scenarios](workloads/integration-get-started.md)

## Reference Links

[1928533]:https://launchpad.support.sap.com/#/notes/1928533