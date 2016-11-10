# Architecture

## Cloud Fundamentals

### [Designing resilient applications for Azure](guidance-resiliency-overview.md)
#### [Resiliency checklist](guidance-resiliency-checklist.md)
#### [Failure mode analysis](guidance-resiliency-failure-mode-analysis.md)

#### [Disaster recovery for applications built on Microsoft Azure](..\resiliency\resiliency-disaster-recovery-azure-applications.md)
#### [Disaster recovery and high availability for applications built on Microsoft Azure](..\resiliency\resiliency-disaster-recovery-high-availability-azure-applications.md)
#### [High availability for applications built on Microsoft Azure](..\resiliency\resiliency-high-availability-azure-applications.md)
#### [High availability checklist](..\resiliency\resiliency-high-availability-checklist.md)
#### [Azure service-specific resiliency guidance](..\resiliency\resiliency-service-guidance-index.md)
#### [Recovery from data corruption or accidental deletion](..\resiliency\resiliency-technical-guidance-recovery-data-corruption.md)
#### [Recovery from local failures in Azure](..\resiliency\resiliency-technical-guidance-recovery-local-failures.md)
#### [Recovery from a region-wide service disruption](..\resiliency\resiliency-technical-guidance-recovery-loss-azure-region.md)
#### [Recovery from on-premises to Azure](..\resiliency\resiliency-technical-guidance-recovery-on-premises-azure.md)
#### [Azure resiliency technical guidance](..\resiliency\resiliency-technical-guidance.md)


## Reference Architectures

### Compute reference architecture
#### [Running a Linux VM on Azure](guidance-compute-single-vm-linux.md)
#### [Running a Windows VM on Azure](guidance-compute-single-vm.md)
#### [Running multiple VMs on Azure for scalability and availability](guidance-compute-multi-vm.md)
#### [Running Linux VMs for an N-tier architecture on Azure](guidance-compute-n-tier-vm-linux.md)
#### [Running Windows VMs for an N-tier architecture on Azure](guidance-compute-n-tier-vm.md)
#### [Running Linux VMs in multiple regions for high availability](guidance-compute-multiple-datacenters-linux.md)
#### [Running Windows VMs in multiple regions for high availability](guidance-compute-multiple-datacenters.md)

### [Connecting your on-premises network to Azure](guidance-connecting-your-on-premises-network-to-azure.md)
#### [Implementing a hybrid network architecture with Azure ExpressRoute](guidance-hybrid-network-expressroute.md)
#### [Implementing a Hybrid Network Architecture with Azure and On-premises VPN](guidance-hybrid-network-vpn.md)
#### [Implementing a highly available hybrid network architecture](guidance-hybrid-network-expressroute-vpn-failover.md)

### Protecting the Cloud Boundary in Azure
#### [Implementing a secure hybrid network architecture in Azure](guidance-iaas-ra-secure-vnet-hybrid.md)
#### [Implementing a DMZ between Azure and the Internet](guidance-iaas-ra-secure-vnet-dmz.md)

### [Managing identity in Azure](guidance-ra-identity.md)
#### [Implementing Azure Active Directory](guidance-identity-aad.md)
#### [Extending Active Directory Directory Services (ADDS) to Azure](guidance-identity-adds-extend-domain.md)
#### [Creating a Active Directory Directory Services (ADDS) resource forest in Azure](guidance-identity-adds-resource-forest.md)
#### [Implementing Active Directory Federation Services (ADFS) in Azure](guidance-identity-adfs.md)

### PaaS web application reference architecture
#### [Azure reference architecture: Basic web application](guidance-web-apps-basic.md)
#### [Azure reference architecture: Web application with high availability](guidance-web-apps-multi-region.md)
#### [Improving scalability in a web application](guidance-web-apps-scalability.md)


## Cloud Design Patterns

## Best Practices for Cloud Applications

### [API design guidance](..\best-practices-api-design.md)
### [API implementation guidance](..\best-practices-api-implementation.md)
### [Autoscaling guidance](..\best-practices-auto-scaling.md)
### [Availability checklist](..\best-practices-availability-checklist.md)
### [Background jobs guidance](..\best-practices-background-jobs.md)
### [Business continuity and disaster recovery (BCDR): Azure Paired Regions](..\best-practices-availability-paired-regions.md)
### [Caching guidance](..\best-practices-caching.md)
### [Content Delivery Network (CDN) guidance](..\best-practices-cdn.md)
### [Data partitioning guidance](..\best-practices-data-partitioning.md)
### [Monitoring and diagnostics guidance](..\best-practices-monitoring.md)
### [Microsoft cloud services and network security](..\best-practices-network-security.md)
### [Patterns for designing Azure Resource Manager templates](..\best-practices-resource-manager-design-templates.md)
### [Recommended naming conventions for Azure resources](guidance-naming-conventions.md)
### [Security considerations for Azure Resource Manager](..\best-practices-resource-manager-security.md)
### [Sharing state in Azure Resource Manager templates](..\best-practices-resource-manager-state.md)
### [Retry general guidance](..\best-practices-retry-general.md)
### [Retry service specific guidance](..\best-practices-retry-service-specific.md)
### [Scalability checklist](..\best-practices-scalability-checklist.md)


## Scenario Guides

### [Elasticsearch on Azure Guidance](guidance-elasticsearch.md)
#### [Running Elasticsearch on Azure](guidance-elasticsearch-running-on-azure.md)
#### [Tuning data ingestion performance for Elasticsearch on Azure](guidance-elasticsearch-tuning-data-ingestion-performance.md)
#### [Tuning data aggregation and query performance with Elasticsearch on Azure](guidance-elasticsearch-tuning-data-aggregation-and-query-performance.md)
#### [Configuring resilience and recovery on Elasticsearch on Azure](guidance-elasticsearch-configuring-resilience-and-recovery.md)
#### [Creating a performance testing environment for Elasticsearch on Azure](guidance-elasticsearch-creating-performance-testing-environment.md)
#### [Implementing a JMeter test plan for Elasticsearch](guidance-elasticsearch-implementing-jmeter-test-plan.md)
#### [Deploying a JMeter JUnit sampler for testing Elasticsearch performance](guidance-elasticsearch-deploying-jmeter-junit-sampler.md)
#### [Running the automated Elasticsearch resiliency tests](guidance-elasticsearch-running-automated-resilience-tests.md)
#### [Running the automated Elasticsearch performance tests](guidance-elasticsearch-running-automated-performance-tests.md)

### [Identity management for multitenant applications in Microsoft Azure](guidance-multitenant-identity.md)
#### [Introduction to identity management for multitenant applications in Microsoft Azure](guidance-multitenant-identity-intro.md)
#### [About the Tailspin Surveys application](guidance-multitenant-identity-tailspin.md)
#### [Authentication in multitenant apps, using Azure AD and OpenID Connect](guidance-multitenant-identity-authenticate.md)
#### [Working with claims-based identities in multitenant applications](guidance-multitenant-identity-claims.md)
#### [Sign-up and tenant onboarding in a multitenant application](guidance-multitenant-identity-signup.md)
#### [Application roles in multitenant applications](guidance-multitenant-identity-app-roles.md)
#### [Role-based and resource-based authorization in multitenant applications](guidance-multitenant-identity-authorize.md)
#### [Securing a backend web API in a multitenant application](guidance-multitenant-identity-web-api.md)
#### [Caching access tokens in a multitenant application](guidance-multitenant-identity-token-cache.md)
#### [Federating with a customer's AD FS for multitenant apps in Azure](guidance-multitenant-identity-adfs.md)
#### [Using client assertion to get access tokens from Azure AD](guidance-multitenant-identity-client-assertion.md)
#### [Using Azure Key Vault to protect application secrets](guidance-multitenant-identity-keyvault.md)

#### [Deploying virtual appliances in high availability](guidance-nva-ha.md)
