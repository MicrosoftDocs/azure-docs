---
title: Migrate from AWS Network Load Balancer to Azure Load Balancer
description: Learn to migrate from AWS Network Load Balancer to Azure Load Balancer with step-by-step guidance, feature mapping, and validation strategies for high-availability and performance workloads.
ms.service: azure-load-balancer
ms.topic: how-to
ms.date: 08/05/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:08/05/2025
ms.collection:
  - migration
  - aws-to-azure
ms.author: doveychase
author: chasedmicrosoft
---

# Migrate from Amazon Web Services (AWS) Network Load Balancer to Azure Load Balancer

[Azure Load Balancer](load-balancer-overview.md) provides high-performance, ultra-low-latency Layer 4 load balancing capabilities that enable you to manage TCP and UDP traffic to your applications. If you're currently using AWS Network Load Balancer (NLB) and planning to migrate your workload to Azure, this guide helps you understand the migration process, feature mappings, and best practices. You'll learn how to assess your current environment, plan & prepare the migration, and execute the transition while maintaining application availability and performance.

## What you'll accomplish

By following this guide, you'll:

- Map AWS Network Load Balancer features to Azure Load Balancer capabilities
- Prepare your environments for a successful migration
- Plan and execute a migration with minimal downtime
- Validate that your migrated workload meets performance and reliability requirements
- Optimize your Azure Load Balancer configuration for your specific needs

This article uses a gaming platform scenario to demonstrate common patterns like multi-protocol load balancing, zone redundancy, and client IP preservation that apply to many high-performance workloads.

## Example scenario: Gaming platform multi-protocol load balancing migration

In this example, a gaming company operates a high-performance multiplayer gaming platform using AWS Network Load Balancer (NLB) to handle both TCP and UDP traffic simultaneously. The workload's architecture includes session management services running on EC2 instances handling player authentication and lobbies on port 7777 (TCP), and real-time game data services deployed on EC2 instances processing low-latency gameplay packets on port 7778 (UDP). The NLB provides static IP addresses, cross-zone load balancing, and client IP preservation for game analytics and anti-cheat systems. This business-critical setup supports their core gaming function of processing real-time multiplayer gaming with ultra-low latency across multiple availability zones.

### Architectural overview

This architecture example showcases common network load balancing features in AWS and Azure, including multi-protocol support, static IP addresses, cross-zone distribution, and client IP preservation. The goal is to migrate this architecture from AWS NLB to Azure Load Balancer while maintaining equivalent functionality and performance. In our architecture diagram, TCP traffic represents session management services and UDP traffic represent real-time game data services.

Here's the architecture of the gaming platform workload in AWS:

:::image type="complex" source="media/network-load-balancing-aws-to-azure-how-to/aws-network-load-balancing-scenario.png" alt-text="Diagram showing an AWS Network Load Balancer routing TCP and UDP traffic across EC2 instances in multiple availability zones.":::
"The diagram shows an AWS Network Load Balancer receiving gaming traffic through an Internet Gateway. The load balancer routes requests based on protocol: TCP traffic on port 7777 is sent to session management services and UDP traffic on port 7778 is sent to real-time game data services. Both services are distributed across three availability zones, labeled 1a, 1b, and 1c. In each zone, session management services run on Amazon EC2 instances and real-time game data services run on Amazon EC2 instances. Each instance is placed in its own subnet and is protected by a security group and a network access control list (NACL). The load balancer uses static IP addresses and has cross-zone load balancing enabled. Client IP preservation is enabled for anti-cheat and analytics systems. Arrows from the services indicate connections to Amazon DynamoDB for player data and Amazon ElastiCache for session state. The diagram includes labels for VPC, subnets, security groups, NACLs, target groups, and shows the flow of traffic from the load balancer to the backend services and databases." lightbox="media/network-load-balancing-aws-to-azure-how-to.md/aws-network-load-balancing-scenario.png":::

This is the architecture for the same gaming platform workload, migrated to Azure:

:::image type="complex" source="media/network-load-balancing-aws-to-azure-how-to/azure-network-load-balancer-scenario.png" alt-text="Diagram of Azure Load Balancer balancing TCP and UDP traffic between gaming services running on Azure Virtual Machines.":::"The diagram shows an Azure Load Balancer architecture in the East US region, spanning three availability zones. Gaming traffic enters through a static public IP address and is directed to an Azure Load Balancer configured with zone redundancy. The load balancer routes requests based on protocol: TCP traffic on port 7777 is sent to a backend pool containing Azure VMs labeled Session Management Service Instances, while UDP traffic on port 7778 is sent to a backend pool containing Azure VMs labeled Real-time Game Data Service Instances. Each backend pool is associated with a health probe monitoring service endpoints. The architecture includes separate subnets for each service tier, each protected by network security groups. The load balancer is configured with floating IP (DSR) for client IP preservation. Arrows from both services indicate connections to Azure Cosmos DB for player data and Azure Cache for Redis for session state. The diagram includes labels for virtual network, subnets, network security groups, backend pools, health probes, and shows the flow of traffic from the load balancer to the backend services and databases." lightbox="media/network-load-balancing-aws-to-azure-how-to.md/azure-network-load-balancing-scenario.png:::

Both architectures provide equivalent capabilities:

- **High availability deployment**: Resources distributed across multiple availability zones for fault tolerance
- **Network isolation**: Virtual network with dedicated subnets for load balancer and application tiers
- **Multi-protocol support**: Simultaneous TCP and UDP traffic handling with protocol-specific backend pools
- **Static IP addresses**: Consistent external endpoint addresses for client connections
- **Cross-zone load balancing**: Even traffic distribution across all availability zones
- **Client IP preservation**: Original client IP addresses maintained for analytics and anti-cheat systems
- **Ultra-low latency**: Sub-50ms response times optimized for real-time gaming requirements
- **High throughput**: Support for millions of concurrent connections and requests per second
- **Advanced health monitoring**: Comprehensive health checks monitoring both TCP and UDP service endpoints
- **Network security controls**: Security groups/rules controlling traffic flow between network tiers
- **Auto-scaling integration**: Automatic scaling based on traffic demand and resource utilization
- **Comprehensive monitoring**: Detailed metrics, access logs, and health monitoring for troubleshooting and optimization

### Production environment considerations

This migration is designed as a cutover migration. With this approach, you build out your Azure infrastructure in parallel with your existing AWS setup. This approach minimizes the complexity of migrating users in batches, and enables rapid rollback if any issues arise. As such, you'll experience brief period of downtime during the DNS cutover, but the overall migration process is designed to minimize disruption to your services.

**Expected downtime:**

- DNS propagation time: 5-15 minutes for 300-second TTL
- Session disruption: Existing sessions can be interrupted during cutover
- Service availability: Individual services remain available during migration

**Recommended maintenance window:**

- Duration: 1-2 hours during low-traffic period
- Buffer time: Extra 30 minutes for unforeseen issues
- Rollback time: 15-30 minutes if needed

> [!NOTE]
> Resetting your DNS TTL values to 300 seconds (5 minutes) before the cutover helps ensure a smooth transition with minimal downtime. This allows for rapid DNS propagation and reduces the scope of any potential issues from cached DNS records during the cutover process. For platforms requiring ultra-low downtime, you can reduce the TTL to 60 seconds (1 minute) to ensure that DNS changes propagate quickly and minimize client disconnections.

## Step 1: Assessment

Before migrating from AWS Network Load Balancer to Azure Load Balancer, it's crucial to assess the existing architecture and identify the capabilities that need to be mapped or replaced. This assessment helps ensure a smooth migration process and maintain the functionality of your gaming platform.

### Direct capability mapping

The platform capabilities map from AWS NLB to Azure Load Balancer as follows:

| AWS NLB Capability | Azure Load Balancer Equivalent | Migration approach |
|---|---|---|
| **[AWS NLB Target Groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-target-groups.html)** | **[Load Balancer Backend Pools](backend-pool-management.md)** | Create backend pools for each protocol and service type. Backend pools can contain VMs, Virtual Machine Scale Sets, or IP addresses. Configure separate backend pools for TCP and UDP services to enable protocol-specific routing and health monitoring. |
| **[AWS NLB Protocol Support (TCP/UDP)](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-target-groups.html#target-group-routing-configuration)** | **[Load Balancer TCP/UDP Support](load-balancer-overview.md)** | Configure load balancing rules for both TCP and UDP protocols. Azure Load Balancer supports TCP, UDP, and all ports simultaneously. Create separate rules for different ports and protocols as needed for your services. |
| **[AWS NLB Static IP Addresses](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/network-load-balancers.html#load-balancer-static-ip)** | **[Load Balancer Static Public IP](../virtual-network/ip-services/public-ip-addresses.md)** | Deploy Load Balancer with static Standard SKU public IP addresses. Azure provides persistent IP addresses that don't change during load balancer lifecycle. Configure frontend IP configurations with static public IPs to maintain consistent endpoints for clients. |
| **[AWS NLB Cross-zone Load Balancing](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/availability-zones.html#cross-zone-load-balancing)** | **[Load Balancer availability zone support](../reliability/reliability-load-balancer.md)** | Enable zone redundancy on Load Balancer to automatically distribute traffic across all availability zones. Zone-redundant deployment provides automatic failover and even load distribution. Configure backend pools with VMs distributed across multiple zones for optimal fault tolerance. |
| **[AWS NLB Client IP Preservation](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/edit-target-group-attributes.html#client-ip-preservation)** | **[Load Balancer Floating IP (DSR)](load-balancer-floating-ip.md)** | Enable Floating IP (Direct Server Return) on load balancing rules to preserve client IP addresses. Azure Floating IP requires another guest OS configuration with loopback interfaces, while AWS client IP preservation is enabled by default for instance targets. Configure DSR mode when targets are in the same VPC to ensure servers receive actual client IP addresses for analytics and security systems. |
| **[AWS NLB Health Checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-health-checks.html)** | **[Load Balancer Health Probes](load-balancer-custom-probe-overview.md)** | Configure health probes matching AWS health check settings for both TCP and UDP services. Set probe interval (default 5 seconds), timeout, unhealthy threshold, and protocol to match AWS NLB configuration. Azure supports TCP, HTTP, and HTTPS health probes with configurable intervals and failure thresholds, while AWS NLB provides TCP, HTTP, and HTTPS options with slightly different timeout behaviors. |
| **[AWS NLB Flow Hash Algorithm](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html#load-balancer-algorithm)** | **[Load Balancer Distribution Mode](load-balancer-distribution-mode.md)** | Configure distribution mode to control traffic distribution. Azure Load Balancer uses 5-tuple hash (source IP, source port, destination IP, destination port, protocol) by default, while AWS NLB includes TCP sequence number in its flow hash. For applications requiring session affinity, configure Source IP affinity or Source IP and protocol distribution modes to ensure consistent routing. |
| **[AWS NLB Auto Scaling Integration](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-load-balancer.html)** | **[Azure Virtual Machine Scale Sets Integration](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-networking.md)** | Configure Virtual Machine Scale Sets as Load Balancer backend pools with automatic instance registration and health-based scaling. Implement Azure Monitor-based scaling rules using load balancer metrics (such as concurrent connections and data throughput) and custom application-specific metrics. Both platforms provide seamless integration between load balancers and auto-scaling groups. |
| **[AWS NLB CloudWatch Metrics](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-cloudwatch-metrics.html)** | **[Load Balancer Azure Monitor Integration](load-balancer-monitor-log.md)** | Configure diagnostic settings to send Load Balancer metrics to Azure Monitor. Enable detailed metrics for connections, throughput, and health probe status. Azure Monitor provides multi-dimensional metrics similar to CloudWatch, including byte count, packet count, and SYN count metrics. Integrate with Azure Monitor workbooks for custom dashboards and alerting. |

### Capability mismatches and strategies

If your workload uses NLB capabilities that can't be directly addressed in Azure Load Balancer, consider the following strategies to still arrive at a comparable outcome.

- **Direct functional replacement using other Azure service**: Replace AWS NLB capabilities with Azure Load Balancer equivalents while maintaining core functionality. This approach prioritizes minimal disruption and uses native Azure integrations for security, monitoring, and performance optimization.

- **Architecture enhancement approach**: Use migration as an opportunity to modernize beyond AWS NLB capabilities by incorporating Azure Application Gateway for HTTP(S) APIs, Azure Traffic Manager for global distribution, and [Azure Front Door](../frontdoor/front-door-overview.md) for CDN and DDoS protection.

In the end, you may need to make the decision on whether an AWS NLB feature is necessary if there's no direct Azure Load Balancer equivalent. and adjust your Azure environment and organization's services accordingly.

#### Proxy Protocol Support

**AWS NLB capability**: AWS NLB provides Proxy Protocol v2 support where:

- Client IP information is preserved and passed to backend targets via protocol headers
- Enables client IP visibility even when direct client IP preservation isn't available
- Useful for load balancer chaining scenarios and specific networking configurations

**Azure Load Balancer approach**: Azure Load Balancer doesn't have direct proxy protocol support, but provides equivalent functionality through:

- **Floating IP (DSR)**: Use Direct Server Return configuration to preserve client IP addresses at the network level
- **Application-level solutions**: Implement custom headers or application logic to track client information when needed
- **Azure Application Gateway integration**: For HTTP-based APIs, use Application Gateway, which provides X-Forwarded-For headers

> [!IMPORTANT]
> The Proxy Protocol support illustrates an example of a critical mismatch in capability. There are others that don't have 1:1 equivalents in Azure Load Balancer. Such as:
>
> - **Flow hash algorithm flexibility**: AWS NLB uses a 5-tuple flow hash algorithm for consistent connection routing with session stickiness at the network level. Azure Load Balancer provides distribution modes but doesn't offer the same granular flow hash consistency guarantees.
> - **Per-availability zone static IP addresses**: AWS NLB provides dedicated static IP addresses for each availability zone where it operates, enabling zone-specific routing strategies. Azure Load Balancer provides zone-redundant static IPs but not per-zone IP addressing.
> - **Advanced cross-zone load balancing control**: AWS NLB allows granular control over cross-zone load balancing at both load balancer and target group levels. Azure Load Balancer provides automatic zone redundancy with less granular control over traffic distribution strategies.
> - **Connection draining timeout flexibility**: AWS NLB supports configurable connection draining delays for graceful instance removal during maintenance. Azure Load Balancer has connection draining capabilities but with different configuration options and behavior.
>
> Evaluate these differences during your assessment phase and determine if your workload can accommodate these changes or if compensating architecture modifications are needed.

> [!NOTE]
> Measuring performance and reliability is crucial to ensure that the migrated workload meets the same ultra-low latency standards as the original AWS NLB setup. This includes monitoring response times, connection establishment latency, jitter, and packet loss rates to ensure that the Azure Load Balancer performs optimally for real-time scenarios.
> To ensure your migrated workload meets the performance and reliability criteria expected, establish baseline metrics from the AWS NLB before migration. This will allow you to compare the performance of the Azure Load Balancer after migration and ensure that it meets or exceeds the established benchmarks. Include all relevant metrics such as latency percentiles, concurrent connections, and packet loss rates in your baseline measurements.

## Step 2: Preparation

A detailed assessment can reveal opportunities to adjust resources at the source, easing both the migration process and post-migration operations. This step focuses on targeted adjustments to AWS NLB configurations and related services to ensure compatibility and performance on Azure for your workloads.

### Source service configuration

A successful migration requires detailed documentation of the existing AWS NLB configurations and dependent services to ensure a smooth transition to Azure Load Balancer.

#### Protocol-specific load balancing rule documentation

- Document existing AWS NLB listener configurations and target group settings to ensure equivalent Azure Load Balancer rules. Use [AWS CLI commands for load balancers](https://docs.aws.amazon.com/cli/latest/reference/elbv2/describe-load-balancers.html) to gather detailed configuration information for both TCP and UDP protocols.
- Export all routing configurations, health check settings, and client IP preservation configurations using the [AWS NLB target group documentation](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-target-groups.html).
- Document cross-zone load balancing settings and static IP configurations to ensure equivalent Azure zone redundancy and static public IP setup.

#### Health check configuration mapping

Map [AWS NLB health check configurations](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-health-checks.html) to Azure Load Balancer health probe equivalents using the [Azure Load Balancer health probe configuration guide](load-balancer-custom-probe-overview.md). This ensures both TCP and UDP service health monitoring continues to function correctly after migration with appropriate intervals for your workloads.

#### Performance baseline establishment

- Capture current performance metrics including latency percentiles (P50, P95, P99), concurrent connections, throughput, and packet loss rates
- Document current scaling patterns and peak load characteristics
- Record client IP preservation requirements for analytics and security systems

### Dependency changes

Prepare for migration by updating dependent services and configurations to ensure compatibility with Azure Load Balancer.

#### Application changes

- If your applications relied on AWS-specific client IP handling, update applications to work with Azure Floating IP (DSR) configuration following [Azure Load Balancer Floating IP guide](load-balancer-floating-ip.md).
- Configure health monitoring for your services over TCP/HTTP/HTTPS using [Azure Load Balancer health probes](manage-probes-how-to.md).
- Configure logging integration with Azure Monitor using the [Load Balancer metrics](load-balancer-monitor-metrics-cli.md).

#### DNS configuration changes

- Reduce DNS TTL values on your domain records to 300 seconds (or 60 seconds for ultra-low downtime requirements) for faster cutover.
- If you plan to use Azure DNS, create A records pointing to Azure Load Balancer static public IP addresses using the [Azure DNS configuration guide](../dns/dns-operations-recordsets-cli.md#modify-an-existing-record-set). This change enables rapid DNS propagation during migration cutover with minimal impact on active sessions.

#### Backend pool updates

- Configure backend pool members across multiple availability zones for both TCP and UDP services
- Use [Azure Virtual Machine Scale Sets](load-balancer-standard-virtual-machine-scale-sets.md) for services with automatic scaling based on application metrics
- Implement zone distribution strategies that maintain performance during zone failures

### Environmental changes

Prepare your Azure environment by deploying the necessary infrastructure and configuring security and monitoring components to support the migrated workload. This preparation helps ensure a smooth transition and minimizes potential issues during the migration process.

#### Azure resource provisioning

- Deploy [Azure Load Balancer](load-balancer-overview.md), Virtual Machines, and Virtual Machine Scale Sets using [Infrastructure as Code](../azure-resource-manager/templates/overview.md) before cutover following the Load Balancer deployment guides.
- Configure static public IP addresses and zone redundancy before cutover to ensure platform stability.
- Enable thorough testing and validation in parallel environment before production cutover.

#### Network security setup

- Set up Network Security Groups matching AWS security group rules for your traffic requirements.
- Configure DDoS protection for workloads using [Azure DDoS Protection](../ddos-protection/ddos-protection-overview.md).
- Maintain security posture before, during, and after migration.

#### Monitoring configuration

- Configure [Azure Monitor workspace and Load Balancer diagnostic settings](monitor-load-balancer.md) using the diagnostic settings configuration guide.
- Set up dashboards and alerting rules including latency monitoring, concurrent connections, and health probe status using the [Azure Monitor Load Balancer guide](load-balancer-monitor-log.md).
- Configure custom metrics for application-specific KPIs such as connection latency and session duration.

### Change sequence and dependencies

The following list outlines a logical sequence of changes to implement during migration. This sequence ensures that all dependent services are available before configuration begins, preserving functionality throughout the migration. Think of it as your preflight checklist for migration day.

The general flow of changes is infrastructure deployment, service migration, and then configuration of load balancing rules, health probes, and monitoring. This sequence ensures that all dependent services are available before configuration begins, preserving user experience throughout the migration.

While the specific steps can vary based on your architecture, the general sequence is as follows:

1. **Azure infrastructure deployment** - Deploy Load Balancer with static IPs and VMs first as it's necessary for subsequent configuration steps.
1. **Service migration** - Migrate services to Azure VMs and Scale Sets. This can be done in parallel with the Azure infrastructure deployment to save time.
1. **Protocol-specific rule configuration** - Configure separate load balancing rules for TCP and UDP traffic with appropriate backend pools.
1. **Client IP preservation setup** - Configure Floating IP (DSR) for rules to maintain client IP visibility for security and analytics systems.
1. **Health probe configuration** - Configure health probes for both protocol types matching AWS health check behavior using the [Load Balancer health probe guide](load-balancer-custom-probe-overview.md).
1. **Zone redundancy optimization** - Configure multi-zone distribution for services to ensure high availability.
1. **Monitoring setup** - Configure Azure Monitor dashboards and alerting for application-specific metrics including latency, connections, and health status.
1. **DNS preparation** - Reduce TTL values and prepare DNS record updates for your domains. This step is crucial for ensuring minimal user disconnection during cutover.

In general, the migration process involves deploying and migrating services first, followed by configuring protocol-specific load balancing rules, health probes, and monitoring. This sequence ensures that your Load Balancer is built and your services are migrated before configuring the specific networking requirements.

## Step 3: Evaluation

After preparing your environment and making necessary changes, the next step is to evaluate the migration plan and define validation criteria. This step ensures that all capabilities are functioning as expected after the migration is complete.

### Validation criteria

As part of your migration planning, it's essential to define the validation criteria that measures the success of the migration. These criteria will help ensure that all capabilities function as expected after the migration is complete.

#### Success criteria definition

Establish validation criteria based on the original AWS NLB capabilities identified in the assessment section:

##### Functional criteria

- **Multi-protocol routing accuracy**: TCP and UDP traffic routes to correct backend pools based on protocol and port
- **Client IP preservation**: Original client IP addresses preserved via Floating IP (DSR) for analytics and security
- **Service health**: All services report healthy status across zones
- **Multi-zone distribution**: Traffic distributes correctly with automatic failover between availability zones
- **Connection handling**: Sessions maintain connectivity during infrastructure changes and scaling events

##### Performance criteria

- **Latency baseline**: Response time within 5% of AWS NLB baseline
- **Throughput capacity**: Handle equivalent concurrent connections and requests per second as AWS NLB
- **Connection establishment**: New session establishment latency meets requirements
- **Jitter minimization**: Consistent packet delivery timing for smooth experience

##### Reliability criteria

- **Session continuity**: Sessions maintain connectivity during zone failures and scaling events
- **High availability**: 99.9% uptime SLA with automatic failover within seconds
- **Platform-specific SLA**: Meet platform-specific requirements for user experience
- **Security functionality**: Client IP tracking functions correctly for fraud detection systems

### Workload validation methods

Define methods for validating the success criteria established for your workloads. This includes both automated and manual testing approaches to ensure comprehensive coverage of all capabilities.

#### Automated testing

- Create comprehensive automated tests covering all capabilities including:
    - Multi-protocol load balancing validation for TCP and UDP traffic
    - Performance and load testing against baseline metrics using appropriate tools
    - Latency and jitter testing for real-time requirements
    - Connection failover and scaling scenario testing under load conditions

#### Manual validation checklist

- Test client connections across both TCP and UDP services
- Validate session creation, operation, and termination flows
- Test security system functionality with client IP preservation
- Verify real-time performance under peak load conditions
- Test session persistence during zone failures and scaling events
- Validate analytics and monitoring data collection

## Step 4: Process

With your migration plan in place and preparatory changes completed, you're ready to move forward. Follow these detailed steps to execute the migration smoothly on migration day while minimizing impact on active sessions.

### Migration execution

Migration execution involves a series of steps to ensure a smooth transition from AWS NLB to Azure Load Balancer. The process includes final validation, parallel testing, DNS cutover, post-cutover validation, and AWS resource decommissioning.

#### Final validation and testing

Validate Azure Load Balancer configuration and service health before cutover:

- Test both TCP and UDP endpoints with appropriate clients
- Verify multi-protocol routing for different service types
- Confirm multi-zone backend pool distribution and service failover
- Validate Floating IP (DSR) configuration for client IP preservation using test sessions
- Execute functionality tests through Azure Load Balancer with simulated load
- Validate service functionality across multiple zones with realistic scenarios
- Test high availability and zone failover scenarios under load
- Compare performance metrics against AWS NLB baseline including latency and jitter

#### DNS cutover execution
Execute DNS cutover from AWS NLB to Azure Load Balancer. Update domain DNS records to point to Azure Load Balancer static public IP addresses and monitor DNS propagation using DNS monitoring tools.

#### Post-cutover validation

During the post-cutover step, you validate the success of the migration by ensuring that all services are functioning correctly and that performance meets real-time requirements.

**Functional validation:**

- Verify all service routing functions correctly for both protocols
- Validate client IP preservation functionality for security systems
- Test session creation, operation, and termination flows
- Validate health probe behavior for both TCP and UDP services

**Performance validation:**

- Monitor response times and latency against AWS NLB baseline
- Verify throughput capacity meets concurrent session requirements
- Test jitter and packet loss rates for real-time quality

#### AWS resource decommissioning

After successful validation, decommission AWS resources:

- Monitor Azure Load Balancer for 24-48 hours with production traffic
- Verify no traffic routing to AWS NLB
- Backup AWS NLB configuration for rollback capability
- Terminate AWS NLB and associated infrastructure resources

In general, the migration is considered successful when all success criteria are met consistently over a 7-day monitoring period with no performance degradation compared to the AWS NLB performance. For some platforms, you may need to extend monitoring to cover peak hours and weekend traffic patterns to ensure consistent user experience.

## Optimization and iterative improvement

After migration, focus on optimizing the Azure Load Balancer configuration and validating performance, routing accuracy, and high availability. This iterative improvement process ensures that the migrated workload meets all success criteria established during the assessment step following the [Azure Well-Architected Framework service guide for Azure Load Balancer](/azure/well-architected/service-guides/azure-load-balancer).

### Iterative improvement process

The migration process is iterative and should be adjusted based on performance feedback and testing until success criteria are met:

#### Performance optimization cycle

1. **Baseline measurement**: Compare Azure Load Balancer metrics to AWS NLB baseline including latency, jitter, and connection metrics
1. **Bottleneck identification**: Identify performance gaps in routing, protocol handling, or backend communication
1. **Configuration tuning**: Adjust Load Balancer settings, backend probe intervals, connection limits, and application-specific parameters
1. **Validation testing**: Retest performance with simulated loads and measure improvements
1. **Monitoring adjustment**: Update monitoring thresholds and alerting rules for application-specific KPIs

#### Routing accuracy refinement

1. **Traffic pattern analysis**: Monitor actual request routing patterns versus expected patterns for both TCP and UDP
1. **Protocol rule optimization**: Refine TCP and UDP routing rules to handle edge cases and connection patterns
1. **Error rate analysis**: Identify and fix routing rules causing session errors or disconnections
1. **User experience validation**: Ensure sessions work seamlessly across both service types

#### High availability validation

1. **Traffic distribution verification**: Confirm traffic distributes correctly across availability zones for both protocols
1. **Failover process testing**: Validate automatic failover between zones during peak loads
1. **Recovery capability**: Test rapid recovery from zone failures while maintaining active sessions
1. **Health check accuracy**: Ensure health checks correctly identify service issues without false positives

## Key takeaways

Migrating a workload that uses AWS Network Load Balancer to Azure requires careful planning and systematic execution to obtain equivalent functionality and performance for real-time requirements. The key success factors include:

**Assessment and planning**: Map AWS NLB capabilities to Azure Load Balancer equivalents early in the process. Pay special attention to multi-protocol support, client IP preservation, and ultra-low latency requirements for high-performance platforms.

**Use Azure integrations**: Take advantage of Azure static public IPs for consistent endpoints, Azure Monitor for observability, and Virtual Machine Scale Sets for service autoscaling to satisfy functional and nonfunctional requirements in your workload.

**Test thoroughly before cutover**: Use parallel testing with simulation tools to validate all functionality. Establish baseline metrics from your AWS environment and ensure Azure Load Balancer meets or exceeds performance expectations including latency, jitter, and connection handling.

**Plan for minimal downtime**: Reduce DNS TTL values beforehand and prepare all infrastructure in parallel. The actual cutover involves only DNS changes, minimizing session disruption and user impact.

**Monitor and optimize post-migration**: Use the iterative improvement process to fine-tune performance, routing accuracy, and high availability. Azure Load Balancer provides extensive monitoring capabilities to optimize your configuration over time with real traffic patterns.

**Platform-specific considerations**: Focus on ultra-low latency optimization, multi-protocol traffic handling, client IP preservation for security systems, and zone redundancy for high availability. Azure Load Balancer provides the enterprise-grade reliability and performance required for mission-critical platforms.

## Next steps

> [!div class="nextstepaction"]
> [Azure Load Balancer Best Practices](load-balancer-best-practices.md)

