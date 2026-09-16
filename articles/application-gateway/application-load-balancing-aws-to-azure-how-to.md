---
title: Migrate from AWS Application Load Balancer to Application Gateway
description: Learn to migrate from AWS Application Load Balancer to Azure Application Gateway with step-by-step guidance, feature mapping, and validation strategies.
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 08/11/2026
ai-usage: ai-generated
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:07/02/2025
ms.collection:
  - networking
  - migration
  - aws-to-azure
ms.author: mbender
author: mbender-ms
---

# Migrate from Amazon Web Services (AWS) Application Load Balancer to Azure Application Gateway

If you currently use AWS Application Load Balancer (ALB) and plan to migrate your workload to Azure, this guide can help you understand the migration process, feature mappings, and best practices. On Azure, [Azure Application Gateway](overview.md) provides application load balancing capabilities to manage traffic to your web applications.

This guide walks you through assessing your current AWS environment, mapping ALB features to Application Gateway, and executing the migration while keeping your application available.

## What you'll accomplish

By following this guide, you'll:

- Map AWS ALB features to Application Gateway capabilities
- Prepare your environments for a successful migration
- Plan and execute a migration with minimal downtime
- Validate that your migrated workload meets performance and reliability requirements
- Learn to iterate on the architecture for future enhancements

This article uses a scenario to demonstrate common patterns like path-based routing, multi-zone distribution, and mixed compute environments that apply to many workloads.

## Example scenario: Microservices architecture migration

In this example, a financial services company operates a microservices workload that uses AWS Application Load Balancer (ALB) to route traffic between multiple back ends. The workload's architecture includes a user authentication service running on EC2 instances and a transaction processing service deployed on AWS Fargate containers. The ALB performs path-based routing, directing `/auth/*` requests to the authentication service and `/transactions/*` requests to the containerized transaction processing service. This business-critical setup supports their core business function of processing secure financial transactions with high availability across multiple availability zones.

### Architectural overview

This architecture example shows common application load balancing features in AWS and Azure, including path-based routing, traffic distribution across diverse back-end servers, and multi-zone deployment patterns. The goal is to migrate this architecture from AWS ALB to Application Gateway while maintaining equivalent functionality and meeting workload expectations on performance, reliability, security, and other factors. In the architecture diagram, `/service-a/*` represents the `/auth/*` path, and `/service-b/*` represents `/transactions/*`.

Here's the architecture of the workload in AWS:

:::image type="complex" source="media/application-load-balancing-aws-to-azure-how-to/aws-application-load-balancing-scenario.png" lightbox="media/application-load-balancing-aws-to-azure-how-to/aws-application-load-balancing-scenario.png" alt-text="Diagram that shows an AWS Application Load Balancer routing services across EC2 and Fargate in two availability zones.":::
The diagram shows an AWS Application Load Balancer receiving internet traffic through an Internet Gateway. The load balancer routes requests based on URL paths: `/auth/*` requests are sent to the authentication service and `/transactions/*` requests are sent to the transaction processing service. Both services are distributed across two availability zones, labeled 1a and 1b. In each zone, the authentication service runs on Amazon EC2 instances and the transaction processing service runs on AWS Fargate containers. Each instance is placed in its own subnet and is protected by a security group and a network access control list (NACL). The load balancer is connected to AWS Web Application Firewall and AWS Certificate Manager. Arrows from the services indicate connections to Amazon DynamoDB Global Tables and Amazon Aurora for data storage. The diagram includes labels for VPC, subnets, security groups, NACLs, and shows the flow of traffic from the load balancer to the back-end services and databases.
:::image-end:::

This is the architecture for the same workload, migrated to Azure:

:::image type="complex" source="media/application-load-balancing-aws-to-azure-how-to/application-gateway-scenario.png" lightbox="media/application-load-balancing-aws-to-azure-how-to/application-gateway-scenario.png" alt-text="Diagram of Application Gateway balancing traffic between services running Azure Virtual Machine (VM) and services running on Azure Container App (ACA).":::
The diagram shows an Application Gateway architecture in the East US region, spanning three availability zones. Internet traffic enters through a public IP address and is directed to an Application Gateway configured with zone redundancy and an integrated Azure Web Application Firewall. The gateway routes requests based on URL paths: `/auth/*` requests are sent to a back-end pool containing Azure VMs labeled Service A Instance 1 and Service A Instance 2, while `/transactions/*` requests are sent to a back-end pool containing an Azure Container App labeled Service B (Zone Redundant). Each back-end pool is associated with a health probe at the `/health` endpoint. The architecture includes separate subnets for the application gateway, Service A, and Service B, each protected by network security groups. The application gateway is connected to Azure Key Vault. Arrows from Service A and Service B indicate connections to Azure Cosmos DB and Azure Database for PostgreSQL, respectively. The diagram includes labels for virtual network, subnets, network security groups, and shows the flow of traffic from the gateway to the back-end services and databases.
:::image-end:::

Both architectures provide equivalent functionality, including:

- **High availability deployment:** Resources distributed across multiple availability zones for fault tolerance

- **Network isolation:** Virtual network with dedicated subnets for load balancer, application tiers, and data services

- **Path-based routing:** URL path-based request routing to different back-end services (`/auth/*`, `/transactions/*`)

- **Multi-target flexibility:** Back-end services distributed across different compute platforms and availability zones

- **Mixed compute support:** Combination of virtual machines and containerized workloads

- **Advanced request routing:** Sophisticated routing rules based on URL patterns with configurable health monitoring

- **Integrated security:** Web application firewall protection with security rule sets

- **Network security controls:** Security groups/rules controlling traffic flow between network tiers

- **Secure Sockets Layer (SSL) or Transport Layer Security (TLS) termination:** Centralized certificate management and HTTPS endpoint handling

- **Autoscaling capabilities:** Automatic scaling based on traffic demand and resource utilization

- **Comprehensive monitoring:** Detailed metrics, access logs, and health monitoring for troubleshooting and optimization

### Production environment considerations

This migration uses a cutover approach. With this approach, you build your Azure infrastructure in parallel with your existing AWS setup. This approach minimizes the complexity of moving users in batches and supports rapid rollback if problems arise. You might experience brief downtime during the DNS cutover; the process minimizes user disruption.

**Expected downtime:**

- DNS propagation time: 5 to 15 minutes for a 300-second TTL
- Session disruption: Cutover can interrupt existing user sessions
- Service availability: Individual services remain available during migration

**Recommended maintenance window:**

- Duration: 1 to 2 hours during a low-traffic period
- Buffer time: Extra 30 minutes for unforeseen issues
- Rollback time: 15 to 30 minutes if needed

> [!NOTE]
> Resetting your DNS TTL values to 300 seconds (5 minutes) before the cutover helps ensure a smooth transition with minimal downtime. This shorter TTL speeds DNS propagation and reduces the scope of any potential problems from cached DNS records during the cutover process. In some cases, you can reduce the TTL further to 60 seconds (1 minute) to ensure that DNS changes propagate quickly. However, this reduction might not be necessary for all scenarios.

## Step 1: Assess your AWS ALB architecture

Before you migrate from AWS Application Load Balancer to Application Gateway, assess the existing architecture and identify capabilities to map or replace. This assessment helps ensure a smooth migration and maintains your application's functionality.

To plan your AWS workload migration to Azure, see [Migrate networking from Amazon Web Services to Azure](/azure/migration/migrate-networking-from-aws), which includes [example migration scenarios](/azure/migration/migrate-compute-from-aws#migration-guides) that might align to your use case.

### Direct capability mapping

The microservices architecture capabilities map from AWS ALB to Application Gateway as follows:

| AWS ALB Capability | Application Gateway Equivalent | Migration approach |
|---|---|---|
| **[AWS ALB Target Groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html)** | **[Application Gateway back-end pools](configuration-overview.md#backend-pool)** | Create back-end pools for each service. Back-end pools can contain NICs, Virtual Machine Scale Sets, public/internal IP addresses, FQDNs, and multitenant back ends like Azure App Service. Configure automatic instance registration for scale sets. |
| **[AWS ALB Path-based Routing](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-update-rules.html)** | **[Application Gateway URL Path-based Routing Rules](url-route-overview.md)** | Configure request routing rules with URL path-based conditions. Route `/auth/*` and `/transactions/*` to their respective back-end pools by using Application Gateway's routing rules with priority-based processing. |
| **[AWS ALB Health Checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html)** | **[Application Gateway Health Probes](application-gateway-probe-overview.md)** | Configure custom health probes matching AWS health check settings. Set probe interval, timeout, unhealthy threshold, and response criteria to match AWS ALB configuration. Application Gateway supports both default probes and custom probes with configurable HTTP status codes and response-body substring matching. Note: Application Gateway default probe interval is 30s, default timeout is 30s, and the default unhealthy threshold is 3; custom response-body matching is a substring match (not a regular expression) and the documented maximum response-body match length is 4,090 characters. |
| **[AWS ALB SSL/TLS Termination](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html)** | **[Application Gateway TLS Termination with Key Vault](key-vault-certs.md)** | Configure TLS termination by using Azure Key Vault for certificate management. Application Gateway v2 supports automatic certificate rotation when you use Key Vault integration. If you plan to reuse certificates from AWS Certificate Manager (ACM), verify that the ACM certificate is exportable before attempting migration: not all ACM certificates are exportable. When certificates are exportable, export them with their private keys and convert to PFX for Key Vault import. For Key Vault-based rotation, reference the Key Vault secret (not a versioned secret) so Application Gateway polls Key Vault for updates and rotates certificates automatically—Application Gateway polls Key Vault approximately every four hours. |
| **[AWS ALB Multi-AZ Distribution](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#availability-zones)** | **[Application Gateway Zone Redundancy](application-gateway-autoscaling-zone-redundant.md)** | Deploy Application Gateway v2 with zone redundancy across multiple availability zones. Zone-redundant deployment automatically distributes gateway instances across zones with automatic failover capabilities. Available in regions that support availability zones. |
| **[AWS ALB Auto Scaling Integration](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-load-balancer.html)** | **[Azure Virtual Machine Scale Sets + Application Gateway](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-networking#application-gateway)** | AWS ALB automatically registers/deregisters Auto Scaling group instances as targets. Azure equivalent: Configure Virtual Machine Scale Sets as Application Gateway back-end pools with automatic instance registration and health-based scaling. For containerized workloads, use Azure Kubernetes Service (AKS) with Application Gateway Ingress Controller (AGIC) and Horizontal Pod Autoscaler. Implement Azure Monitor-based scaling rules and custom metrics for automatic scaling decisions.|
| **[AWS ALB WAF Integration](https://docs.aws.amazon.com/waf/latest/developerguide/waf-application-load-balancer.html)** | **[Application Gateway WAF v2 Integration](../web-application-firewall/ag/ag-overview.md)** | Enable [Web Application Firewall (WAF) v2 policies](../web-application-firewall/ag/ag-overview.md) on Application Gateway. WAF uses up to date OWASP Core Rule Sets (CRS) with protection against SQL injection, cross-site scripting, and other OWASP Top 10 attacks. Configure custom rules, managed rule sets, and geo-filtering to match AWS WAF functionality. |
| **[AWS ALB CloudWatch Logs](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-access-logs.html)** | **[Application Gateway Diagnostic Logs with Azure Monitor](application-gateway-diagnostics.md)** | Configure diagnostic settings to send Application Gateway logs to a Log Analytics workspace. Enable access logs, performance logs, and firewall logs. Integrate with Azure Monitor workbooks for custom dashboards and alerting. |
| **[AWS ALB EC2 Target Groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html#target-type)** | **[Application Gateway VM Back-end pools](configuration-overview.md#backend-pool)** | Add virtual machines as back-end pool members. Application Gateway can communicate with VMs across different subnets, virtual networks (via peering), or on-premises servers (via ExpressRoute/VPN). Configure health probes for VM health monitoring. |
| **[AWS ALB ECS/Fargate Targets](https://docs.aws.amazon.com/AmazonECS/latest/userguide/service-load-balancing.html)** | **[Application Gateway Container back-end pools](ingress-controller-overview.md)** | Configure Azure Container Apps (ACA) or AKS as back-end targets. For AKS, use Application Gateway Ingress Controller (AGIC) for native Kubernetes integration and automatic target registration. |
| **[AWS ALB Public IP](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#load-balancer-scheme)** | **[Application Gateway public IP address](configuration-frontend-ip.md#public-and-private-ip-address-support)** | Assign a static Standard SKU public IP address to Application Gateway for external access. Application Gateway v2 supports both IPv4 and IPv6 public IP addresses (preview). Configure workload DNS records to point to the Application Gateway public IP. |
| **[AWS ALB Session Stickiness](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/sticky-sessions.html)** | **[Application Gateway Cookie-based Affinity](configuration-http-settings.md#cookie-based-affinity)** | Enable cookie-based affinity in Application Gateway to maintain session persistence for users. Configure affinity settings to match AWS ALB stickiness behavior, ensuring consistent user experience after migration. |

### Capability mismatches and strategies

If your workload uses AWS ALB capabilities or other capabilities that Application Gateway can't address, consider the following strategies to still reach a comparable outcome.

- **Direct functional replacement by using other Azure services:** Replace AWS ALB capabilities with Application Gateway equivalents while maintaining core functionality. This approach prioritizes minimal disruption and uses native Azure integrations for security, monitoring, and certificate management. For example, Azure handles Auto Scaling integration differently.

- **Architecture enhancement approach:** Use migration as an opportunity to modernize beyond AWS ALB capabilities by incorporating AKS with Application Gateway Ingress Controller, Azure API Management for advanced routing, and [Azure Front Door](../frontdoor/index.yml) for global distribution.

- **Accept functional differences:** Some AWS ALB capabilities don't have direct Application Gateway equivalents and require accepting different behavior in your migrated architecture. Assess the impact of these differences on your workload, and determine whether you need compensating changes.

#### Auto Scaling integration

**AWS ALB capability:** AWS ALB provides integration with Auto Scaling groups where:

- AWS ALB automatically registers and deregisters instances as targets when they launch or terminate

- ALB health checks can trigger Auto Scaling actions to replace unhealthy instances

- Auto Scaling can use ALB metrics (request count per target) to scale capacity based on traffic demand

**Application Gateway approach:** Application Gateway doesn't have direct auto scaling group capabilities, but provides equivalent functionality through:

- **Virtual Machine Scale Sets:** Configure scale sets as Application Gateway back-end pools with automatic instance registration and health-based scaling

- **AKS:** Use Application Gateway Ingress Controller (AGIC) with Horizontal Pod Autoscaler for container-based workloads

- **Azure Monitor integration:** Implement custom scaling rules based on Application Gateway metrics and back-end pool health

> [!NOTE]
> Application Gateway v2 (Standard_v2/WAF_v2) supports autoscaling and zone-redundant deployments; however, Application Gateway manages autoscaling at the gateway level (scaling gateway instances), which differs from AWS Auto Scaling group behavior for back-end instances. Use Virtual Machine Scale Sets for back-end instance scaling and AGIC/AKS or scale set health integration when you need automatic target registration and pod/instance level scaling.

> [!IMPORTANT]
> Auto Scaling groups are one example of a critical capability mismatch. Other capabilities also lack 1:1 equivalents in Application Gateway, such as:
>
> - **Load balancing algorithms:** AWS ALB supports multiple algorithms (for example: round_robin, least_outstanding_requests, weighted_random). Application Gateway uses round-robin to distribute requests and supports cookie-based session affinity for stickiness. Application Gateway doesn't provide ALB-style algorithms such as least_outstanding_requests or weighted_random, and it doesn't expose an IP-hash option. If your application depends on ALB-specific algorithms, plan compensating strategies (for example, adjust back-end capacity, use staged deployments, or employ other traffic-distribution components).
>
> - **Slow start mode:** AWS ALB's slow start mode for gradually ramping traffic to new targets isn't available in Application Gateway. To mitigate this, use deployment strategies such as canary/staged deployments, warm-up endpoints, or pre-warmed instances to avoid traffic spikes to new back ends.
>
> - **Advanced routing capabilities:** Some AWS ALB routing features might require alternative approaches or acceptance of different behavior. Evaluate these differences during your assessment phase, and determine whether you need compensating architecture modifications.

> [!NOTE]
> Measure performance and reliability to make sure the migrated workload meets the original AWS ALB standards. Monitor response times, throughput, and error rates so the Application Gateway performs as expected.
>
> Establish baseline metrics from the AWS ALB before migration. Use these baselines to compare Application Gateway performance after migration and confirm it meets or exceeds expectations. Include response times, throughput, and error rates.

## Step 2: Prepare AWS and Azure resources for migration

A detailed assessment can reveal opportunities to adjust resources at the source, easing both the migration process and post-migration operations. This step focuses on targeted adjustments to AWS ALB configurations and related services to ensure compatibility and performance on Azure.

### Source service configuration

A successful migration requires detailed documentation of the existing AWS ALB configurations and dependent services to ensure a smooth transition to Application Gateway.

#### Path-based routing rule documentation

- Document existing AWS ALB listener rules to ensure equivalent Application Gateway routing rules. Use [AWS CLI commands for load balancers](https://docs.aws.amazon.com/cli/latest/reference/elbv2/describe-load-balancers.html) to gather detailed configuration information.

- Export all routing configurations, health check settings, and SSL/TLS termination configurations by using the [AWS ALB listener rules documentation](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-update-rules.html).

- Capture all configurations to prevent functionality gaps during migration, because Application Gateway requires explicit routing rule configuration.

#### SSL/TLS certificate preparation

- Export [SSL/TLS certificates from AWS Certificate Manager](https://docs.aws.amazon.com/acm/latest/userguide/export-public-certificate.html) for Azure Key Vault import.

- Convert certificates to PFX format with private keys, as Application Gateway requires this format for certificate management. Follow the [Azure Key Vault certificate integration guide](key-vault-certs.md).

  > [!NOTE]
  > Verify that ACM permits export of the certificate you plan to export. Some ACM-managed certificates (for example, certificates that AWS manages entirely for certain services) can't be exported; check the ACM documentation before relying on certificate export as part of your migration.

  > [!NOTE]
  > This approach assumes you're using the same domain names and existing certificates with an external DNS cutover. If the migration uses different domain names, you need to obtain new certificates.

#### Health check configuration mapping

Map [AWS ALB health check configurations](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/modify-health-check-settings.html) to Application Gateway health probe equivalents by using the [Application Gateway health probe configuration guide](application-gateway-create-probe-portal.md). This mapping ensures that back-end service health monitoring continues to function correctly after migration.

### Dependency changes

Prepare for migration by updating dependent services and configurations to ensure compatibility with Application Gateway.

#### Back-end service changes

- If your application uses HTTP headers that AWS ALB injects, update the applications to handle Azure-specific HTTP headers instead, following [Rewrite HTTP headers and URL with Application Gateway](rewrite-http-headers-url.md).

- Configure health check endpoints for Azure health probes following the [Application Gateway back-end pool configuration guide](configuration-overview.md#backend-pool).

- Configure logging integration with Azure Monitor by using the [Application Gateway diagnostic settings](application-gateway-diagnostics.md) to maintain observability.

These changes ensure applications function correctly with Application Gateway's request processing and monitoring capabilities.

#### DNS configuration changes

- Reduce DNS TTL values on your DNS records to 300 seconds for faster cutover.

- If you plan to use Azure DNS, create A records pointing to Application Gateway public IP addresses by using the [Azure DNS TTL configuration guide](/azure/dns/dns-operations-recordsets-cli#modify-an-existing-record-set). This change enables rapid DNS propagation during migration cutover.

#### Back-end pool updates

- Configure back-end pool members across multiple availability zones and implement automatic failover capabilities.

- Use [Azure Container Apps](/azure/container-apps/overview) for serverless container back ends or [AKS with Application Gateway Ingress Controller](ingress-controller-overview.md) for orchestrated containers.

### Environmental changes

Prepare your Azure environment by deploying the necessary infrastructure. Configure security and monitoring components to support the migrated workload. This preparation helps ensure a smooth transition and minimizes potential issues during the migration process.

#### Azure resource provisioning

- Deploy [Application Gateway](overview.md), Virtual Machines, and Container Apps by using [Infrastructure as Code](../azure-resource-manager/templates/overview.md) before cutover, following the Application Gateway deployment guides.

- Enable thorough testing and validation before production cutover through advance deployment.

#### Network security setup

- Set up Network Security Groups matching AWS security group rules.
- Maintain security posture before, during, and after migration.

#### Monitoring configuration

- Configure [Azure Monitor workspace and Application Gateway diagnostic settings](/azure/azure-monitor/platform/diagnostic-settings) by using the diagnostic settings configuration guide.

- Set up equivalent dashboards and alerting rules to match existing AWS CloudWatch monitoring by using the [Azure Monitor Application Gateway guide](monitor-application-gateway.md).

- Ensure continuous observability during and after migration.

### Change sequence and dependencies

The following list outlines a logical sequence of changes to implement during migration. This sequence ensures that all dependent services are available before configuration begins, preserving system functionality throughout the migration. Think of it as your preflight checklist for migration day.

The general flow of changes is infrastructure deployment, back-end service migration, and then configuration of routing rules, health probes, and monitoring.

While the specific steps can vary based on your architecture, the general sequence is as follows:

1. **Azure infrastructure deployment** - Deploy Application Gateway and back-end resources first, because subsequent configuration steps depend on them.

1. **Back-end service migration** - Migrate applications to Azure VMs and Container Apps. Run this migration in parallel with the Azure infrastructure deployment to save time.

1. **SSL/TLS certificate migration** - Import certificates to Azure Key Vault by using the [Key Vault certificate integration guide](configure-key-vault-portal.md). This step ensures correct SSL/TLS termination before you apply routing rules.

1. **Health probe configuration** - Configure health probes matching AWS health check behavior by using the [Application Gateway health probe guide](application-gateway-create-probe-portal.md). This step ensures that back-end service health monitoring continues to function correctly after migration.

1. **Routing rules configuration** - Implement path-based routing rules. This step is crucial to ensure that Application Gateway routes requests correctly to the appropriate back-end services based on URL paths.

1. **Back-end pool optimization** - Configure multi-zone distribution. This step ensures high availability.

1. **Monitoring setup** - Configure Azure Monitor dashboards and alerting by using the [Azure Monitor configuration guide](/azure/azure-monitor/platform/diagnostic-settings). 

   This step ensures that you have visibility into the performance and health of your Application Gateway and back-end services.

1. **DNS preparation** - Reduce TTL values in your current DNS environment, and prepare DNS record updates. Run this preparation in parallel with other steps, as long as you don't update the DNS records to point to Application Gateway until migration day. This step is crucial for ensuring a smooth cutover with minimal downtime.

In general, the migration process involves deploying and migrating resources first, followed by configuring routing rules, health probes, and monitoring.

## Step 3: Define validation and success criteria

To validate the success criteria, use both automated and manual testing. This approach ensures the migration meets all functionality and performance benchmarks. Test key areas against the original AWS ALB configuration, including routing accuracy, SSL/TLS termination, back-end health, response times, and session handling. Use automated tests to verify repeatable aspects like traffic distribution, throughput, and health check performance. Use manual testing to confirm more complex behaviors, such as custom error page display, configuration consistency, and SLA compliance. By combining these approaches, you can confidently validate that the Azure environment meets the required standards and mirrors the expected behavior from AWS.

### Validation criteria

During preparation, define validation criteria that measure migration success. These criteria help ensure all capabilities function as expected after migration.

#### Success criteria definition

Establish validation criteria for each AWS ALB capability you mapped to Application Gateway—path-based routing, health probes, TLS termination, multi-zone distribution, and Web Application Firewall (WAF):

##### Functional criteria

- **Path-based routing accuracy:** Requests route to correct back-end pools based on URL paths

- **SSL/TLS functionality:** HTTPS connections terminate and re-encrypt properly with Azure Key Vault certificates

- **Back-end service health:** All back-end services report healthy status across availability zones

- **Multi-zone distribution:** Traffic distributes correctly with automatic failover

- **Error handling:** Error pages display correctly with proper failover behavior. If you configured custom error pages in AWS ALB, replicate them in Application Gateway.

- **HTTP timeout handling:** Match HTTP timeout values between AWS and Azure. Migrate timeout values as-is to preserve expected behavior, especially for upload and download scenarios.

##### Performance criteria

- **Response time baseline:** Average response time within 10% of AWS ALB baseline

- **Throughput capacity:** Handle equivalent requests per second as AWS ALB

- **Concurrent connections:** Support same number of concurrent users

- **Health probe efficiency:** Health checks execute without impacting performance

##### Reliability criteria

- **Session handling:** Maintain session affinity where configured

- **Configuration drift:** Monitor for configuration drift between environments to prevent reliability issues post-migration

- **Compliance and SLA alignment:** Validate that the migrated solution meets required compliance standards and Azure SLAs for uptime and reliability

### Monitoring validation

Verify monitoring capabilities match AWS CloudWatch functionality:

- Response time trends matching expected patterns
- Request volume charts with accurate traffic distribution
- Error rate monitoring with appropriate alert triggers
- Back-end health status reflecting actual service health

### Validation methods

Define methods for validating the functional, performance, and reliability success criteria. These methods include both automated and manual testing approaches to ensure comprehensive coverage of all capabilities.

Remember that your environment might have unique requirements, so adjust the validation criteria and methods accordingly. In general, use automated testing where possible to cover most functional and performance criteria, and use manual testing as the fallback option to validate criteria.

#### Automated testing

- Create comprehensive automated tests covering all capabilities following the [Application Gateway testing best practices](application-gateway-troubleshooting-502.md):
    - Path-based routing validation for all services by using the [Application Gateway URL path-based routing](url-route-overview.md)
    - Performance and load testing against baseline metrics
    - SSL/TLS certificate validation and security testing
    - Error handling and failover scenario testing

#### Manual validation checklist

- Test user journeys across all services
- Validate file upload/download functionality
- Test authentication flows and session management
- Verify user experiences
- Test API functionality for all services
- Validate error scenarios and error page display

## Step 4: Execute the migration and DNS cutover

With your migration plan in place and preparatory changes completed, you're ready to move forward. Follow these detailed steps to execute the migration smoothly on migration day.

### Migration execution

Migration execution involves a series of steps to ensure a smooth transition from AWS ALB to Application Gateway. The process includes final validation, parallel testing, DNS cutover, post-cutover validation, and AWS resource decommissioning.

#### Final validation and testing

Validate the defined success criteria by using automated and manual testing to ensure all functionality and performance benchmarks are met. Here's key functionality that you want to validate based on your evaluation criteria:

- Test HTTPS endpoints with valid certificates
- Verify path-based routing for all services
- Confirm multi-zone back-end pool distribution and failover
- Validate SSL certificate configuration and routing rules by using test domains
- Execute service functionality tests through Application Gateway
- Validate microservices functionality across multiple zones
- Test high availability and failover scenarios
- Compare performance against AWS ALB baseline metrics

#### DNS cutover execution

Execute DNS cutover from AWS ALB to Application Gateway. Update DNS records to point to Application Gateway public IP addresses and monitor DNS propagation by using standard DNS tools.

#### Post-cutover validation

During the post-cutover step, you validate the success of the migration by ensuring that all services function correctly and that performance meets expectations.

**Functional validation:**

- Verify all service routing functions correctly
- Validate TLS/SSL certificate functionality
- Test error pages and failover behavior
- Validate health probe behavior and back-end health

**Performance validation:**

- Monitor response times against AWS ALB
- Verify throughput capacity meets requirements

#### AWS resource decommissioning

After successful validation, decommission AWS resources:

- Monitor Application Gateway for 24-48 hours
- Verify no traffic routing to AWS ALB
- Back up AWS ALB configuration for rollback capability
- Terminate AWS ALB and associated resources

In general, the migration is successful when you consistently meet all success criteria over a seven-day monitoring period with no performance degradation compared to the AWS ALB performance. Depending on your specific workload, you might need to adjust the time period to ensure that all services function correctly and that performance meets expectations.

## Iterative optimization

After migration, focus on optimizing the Application Gateway configuration and validating routing accuracy, performance, and high availability. This iterative improvement process ensures that the migrated workload meets all success criteria established during the assessment step following the [Azure Well-Architected Framework service guide for Application Gateway](/azure/well-architected/service-guides/azure-application-gateway).

### Iterative improvement process

The migration process is iterative. Adjust it based on feedback and testing results until you meet the success criteria:

#### Performance optimization cycle

1. **Baseline measurement:** Compare Application Gateway metrics to AWS ALB baseline

1. **Bottleneck identification:** Identify performance gaps in routing, SSL termination, or back-end communication

1. **Configuration tuning:** Adjust Application Gateway settings, back-end probe intervals, or connection limits

1. **Validation testing:** Retest performance and measure improvements

1. **Monitoring adjustment:** Update monitoring thresholds and alerting rules

#### Routing accuracy refinement

1. **Traffic pattern analysis:** Monitor actual request routing patterns versus expected patterns

1. **Rule optimization:** Refine path-based routing rules to handle edge cases

1. **Error rate analysis:** Identify and fix routing rules causing errors

1. **User experience validation:** Ensure end-user journeys work seamlessly across services

#### High availability validation

1. **Traffic distribution verification:** Confirm traffic distributes correctly across availability zones

1. **Failover process testing:** Validate automatic failover between zones

1. **Recovery capability:** Test rapid recovery from zone failures

1. **Health check accuracy:** Ensure health checks correctly identify service problems

## Key takeaways

Migrating a workload that uses AWS Application Load Balancer to Azure requires careful planning and systematic execution to obtain equivalent functionality or alternative approaches. The key success factors include:

**Assessment and planning:** Map AWS ALB capabilities to Application Gateway equivalents early in the process. Pay special attention to path-based routing, health probes, and certificate management differences.

**Use Azure integrations.** Take advantage of Azure Key Vault for certificate management, Azure Monitor for observability, and Virtual Machine Scale Sets for autoscaling.

**Test thoroughly before cutover.** Use parallel testing with temporary domains to validate all functionality. Establish baseline metrics from your AWS environment and ensure Application Gateway meets or exceeds performance expectations.

**Plan for minimal downtime.** Reduce DNS TTL values beforehand and prepare all infrastructure in parallel. The actual cutover involves only DNS changes, minimizing service disruption.

**Monitor and optimize post-migration.** Use the iterative improvement process to fine-tune performance, routing accuracy, and high availability. Application Gateway provides extensive monitoring capabilities to optimize your configuration over time.

## Next step

> [!div class="nextstepaction"]
> [Architecture best practices for Application Gateway](/azure/well-architected/service-guides/azure-application-gateway)
