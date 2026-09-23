---
title: Migrate AWS Network Load Balancer to Azure
description: Move AWS Network Load Balancer workloads to Azure Load Balancer. Map Layer 4 features, deploy equivalent resources, and validate TCP/UDP traffic before cutover.
ms.service: azure-load-balancer
ms.topic: how-to
ms.date: 04/03/2026
ai-usage: ai-assisted
#customer intent: As a cloud architect, I want to migrate from AWS Network Load Balancer to Azure Load Balancer so that I can maintain equivalent performance and reliability on Azure.
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:08/05/2025
ms.collection:
  - networking
  - migration
  - aws-to-azure
ms.author: mbender
---

# Migrate from AWS Network Load Balancer to Azure Load Balancer

If you use AWS Network Load Balancer (NLB) and you're moving your workload to Azure, this article walks you through the migration, from mapping features to cutting over traffic. On Azure, [Azure Load Balancer](load-balancer-overview.md) provides low-latency Layer 4 load balancing for TCP and UDP traffic, so your workload keeps equivalent performance and reliability after you move off AWS NLB.

This article focuses on migrating to a public Standard Azure Load Balancer for TCP and UDP scenarios. Azure Load Balancer doesn't terminate TLS, so if your workload relies on TLS termination at the load balancer, use [Azure Application Gateway](../application-gateway/overview.md) instead.

At a high level, you assess your AWS environment, prepare and deploy equivalent Azure resources, validate the configuration, and cut over traffic through DNS.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Permissions in Azure to create Load Balancer, public IP address, virtual network, network security group, and virtual machine or Virtual Machine Scale Set resources.
- Access to your existing AWS environment with permissions to read the NLB, listener, and target group configurations (for example, through the [AWS CLI for Elastic Load Balancing](https://docs.aws.amazon.com/cli/latest/reference/elbv2/describe-load-balancers.html)).
- An inventory of your workload's TCP and UDP ports, health check settings, and client IP preservation requirements.
- Control over the DNS records that resolve to your load balancer so you can lower the TTL and cut over traffic.
- [Azure CLI](/cli/azure/install-azure-cli) or an infrastructure-as-code toolchain to deploy and configure the Azure resources.

## What you accomplish

By following this guide, you'll:

- Map AWS Network Load Balancer features to Azure Load Balancer capabilities
- Prepare your environments for a successful migration
- Plan and execute a migration with minimal downtime
- Validate that your migrated workload meets performance and reliability requirements
- Understand how to iterate on the architecture for future enhancements

This article uses a gaming platform scenario to demonstrate common patterns like multi-protocol load balancing, zone redundancy, and client IP preservation that apply to many high-performance workloads.

## Example scenario: Gaming platform multi-protocol load balancing migration

In this example, a multiplayer gaming platform uses AWS Network Load Balancer (NLB) to handle both TCP and UDP traffic simultaneously from game clients. The workload's architecture includes session management services running on EC2 instances handling player authentication and lobbies over TCP on port 7777, and real-time game data services running on EC2 instances processing low-latency gameplay packets over UDP on port 7778. The AWS NLB provides static IP addresses, cross-zone load balancing, and client IP preservation for game analytics and anti-cheat systems. This setup supports the workload's core function of processing real-time multiplayer gaming with low latency while maintaining reliability across multiple availability zones.

### Architectural overview

This architecture example shows common network load balancing features in AWS and Azure, including multi-protocol support, static IP addresses, cross-zone distribution, and client IP preservation. The goal is to migrate this architecture from AWS Network Load Balancer to Azure Load Balancer while maintaining equivalent functionality and performance. In the architecture diagram, TCP traffic represents game session management services and UDP traffic represents real-time game data services.

Here's the architecture of the workload in AWS:

:::image type="complex" source="media/network-load-balancing-aws-to-azure-how-to/aws-network-load-balancing-scenario-thumb.png" alt-text="Diagram showing an AWS Network Load Balancer routing TCP and UDP traffic across EC2 instances in multiple availability zones." lightbox="media/network-load-balancing-aws-to-azure-how-to/aws-network-load-balancing-scenario.png":::
    The diagram shows an AWS Network Load Balancer receiving gaming traffic through an Internet Gateway. Load balancers route requests based on protocol: TCP traffic on port 7777 is sent to session management services and UDP traffic on port 7778 is sent to real-time game data services. Both services are distributed across three availability zones, labeled 1a, 1b, and 1c. In each zone, session management services run on Amazon EC2 instances and real-time game data services run on Amazon EC2 instances. Each instance is placed in its own subnet and is protected by a security group and a network access control list (NACL). The load balancer uses static IP addresses and has cross-zone load balancing enabled. Client IP preservation is enabled for anti-cheat and analytics systems. Arrows from the services indicate connections to Amazon DynamoDB for player data and Amazon ElastiCache for session state. The diagram includes labels for VPC, subnets, security groups, NACLs, target groups, and shows the flow of traffic from the load balancer to the backend services and databases.
:::image-end:::

This is the architecture for the same gaming platform workload, migrated to Azure:

:::image type="complex" source="media/network-load-balancing-aws-to-azure-how-to/azure-network-load-balancing-scenario-thumb.png" alt-text="Diagram of Azure Load Balancer balancing TCP and UDP traffic between gaming services running on Azure Virtual Machines." lightbox="media/network-load-balancing-aws-to-azure-how-to/azure-network-load-balancing-scenario.png":::
    The diagram shows an Azure Load Balancer architecture in the East US region, spanning three availability zones. Gaming traffic enters through a static public IP address and is directed to an Azure Load Balancer configured with zone redundancy. The load balancer routes requests based on protocol: TCP traffic on port 7777 is sent to a backend pool containing Azure VMs labeled Session Management Service Instances, while UDP traffic on port 7778 is sent to a backend pool containing Azure VMs labeled Real-time Game Data Service Instances. Each backend pool is associated with a health probe monitoring service endpoints. The architecture includes separate subnets for each service tier, each protected by network security groups. Arrows from both services indicate connections to Azure Cosmos DB for player data and Azure Cache for Redis for session state. The diagram includes labels for virtual network, subnets, network security groups, backend pools, health probes, and shows the flow of traffic from the load balancer to the backend services and databases.
:::image-end:::

Both architectures provide equivalent capabilities:

- **High availability deployment**: Resources distributed across multiple availability zones for fault tolerance
- **Network isolation**: Virtual network with dedicated subnets for load balancer and application tiers
- **Multi-protocol support**: Simultaneous TCP and UDP traffic handling with protocol-specific backend pools
- **Static IP addresses**: Consistent external endpoint addresses for client connections
- **Cross-zone load balancing**: Hash-based traffic distribution across availability zones (distribution depends on client connection patterns and session persistence settings)
- **Client IP preservation**: Original client IP addresses maintained for analytics and anti-cheat systems
- **Low latency**: Optimized for low-latency scenarios with minimal processing overhead; actual latency depends on network topology, VM performance, datacenter design, and geographic proximity
- **High throughput**: Can support millions of flows for Standard Load Balancer with appropriate VM sizes and configuration; actual capacity depends on SKU, VM network limits, and tuning
- **Advanced health monitoring**: Comprehensive TCP and HTTP/HTTPS health probes (UDP services require TCP or HTTP health checks on alternate ports)
- **Network security controls**: Security groups/rules controlling traffic flow between network tiers
- **Auto-scaling integration**: Integrates with Virtual Machine Scale Sets and autoscale rules to scale backend instances based on traffic demand and resource usage
- **Comprehensive monitoring**: Detailed metrics, diagnostics, and health monitoring for troubleshooting and optimization

### Production environment considerations

This migration uses a cutover approach. With this approach, you build out your Azure infrastructure in parallel with your existing AWS setup. This approach minimizes the complexity of migrating users in batches, and enables rapid rollback if any issues arise. As such, you experience brief downtime during the DNS cutover, but the overall migration process minimizes disruption to your services.

#### Estimated downtime

- DNS propagation time: 5–15 minutes for 300-second TTL
- Session disruption: The cutover can interrupt existing sessions
- Service availability: During cutover, services are unavailable with DNS name resolution. The individual services are still available via IP address as long as you don't migrate the services at the same time.

#### Recommended maintenance window

- Duration: 1–2 hours during a low-traffic period
- Buffer time: Extra 30 minutes for unforeseen issues
- Rollback time: 15–30 minutes if needed

> [!NOTE]
> Resetting your DNS TTL values to 300 seconds (5 minutes) before the cutover helps reduce DNS caching delays for many resolvers. Reducing the TTL to 60 seconds (1 minute) can further speed propagation for resolvers that respect short TTLs. Propagation depends on upstream and recursive resolvers, and you can't guarantee it for all clients. Prepare monitoring and rollback plans accordingly.

## Assess your AWS Network Load Balancer environment

Before migrating from AWS Network Load Balancer to Azure Load Balancer, assess the existing architecture and identify the capabilities to map or replace. This assessment helps ensure a smooth migration process and maintain the functionality of your gaming platform.

To plan your AWS workload migration to Azure, see [Migrate networking from Amazon Web Services to Azure](/azure/migration/migrate-networking-from-aws), which includes [example migration scenarios](/azure/migration/migrate-compute-from-aws#migration-guides) that might align to your use case.

### Direct capability mapping

The platform capabilities map from AWS NLB to Azure Load Balancer across four areas: backend and protocol handling, traffic distribution and IP addressing, scaling and load balancer scheme, and TLS, idle timeout, and monitoring.

#### Backend pools, protocols, and health monitoring

The following table maps AWS NLB backend, protocol, and health-check capabilities to Azure Load Balancer backend pools, load-balancing rules, and health probes:

| AWS NLB Capability | Azure Load Balancer Equivalent | Migration approach |
|---|---|---|
| [AWS NLB Target Groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-target-groups.html) | [Load Balancer Backend Pools](backend-pool-management.md) | Create backend pools for each protocol and service type. Backend pools can contain VMs, Virtual Machine Scale Sets, or IP addresses. Configure separate backend pools for TCP and UDP services to enable protocol-specific routing and health monitoring. |
| [AWS NLB Protocol Support (TCP/UDP)](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-target-groups.html#target-group-routing-configuration) | [Load Balancer TCP/UDP Support](load-balancer-overview.md) | Configure load balancing rules for both TCP and UDP protocols. Azure Load Balancer supports TCP and UDP protocols; internal load balancers also support "all ports" rules for port-agnostic load balancing. Public load balancers require specific port configurations. Create separate rules for different ports and protocols as needed for your services. Note: Health probes don't support UDP, so you must use custom health probes with TCP or HTTP/HTTPS. |
| [AWS NLB Health Checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-health-checks.html) | [Load Balancer Health Probes](load-balancer-custom-probe-overview.md) | Configure health probes for TCP services and alternate health check approaches for UDP services. Set probe interval, timeout, unhealthy threshold, and protocol to match AWS NLB configuration. Azure supports TCP, HTTP, and HTTPS health probes with configurable intervals and failure thresholds. For UDP services, use TCP or HTTP health probes on alternate ports since Azure Load Balancer doesn't support native UDP health probing. AWS NLB provides TCP, HTTP, and HTTPS options with slightly different timeout behaviors. |

#### Traffic distribution and IP addressing

The following table maps AWS NLB traffic distribution and IP addressing capabilities to Azure Load Balancer static public IPs, zone redundancy, and distribution modes:

| AWS NLB Capability | Azure Load Balancer Equivalent | Migration approach |
|---|---|---|
| [AWS NLB Static IP Addresses](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/network-load-balancers.html#load-balancer-static-ip) | [Load Balancer Static Public IP](../virtual-network/ip-services/public-ip-addresses.md) | Deploy Load Balancer with static Standard SKU public IP addresses. Azure provides persistent IP addresses that don't change during the load balancer lifecycle. Configure frontend IP configurations with static public IPs to maintain consistent endpoints for clients. |
| [AWS NLB Cross-zone Load Balancing](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/availability-zones.html#cross-zone-load-balancing) | [Load Balancer availability zone support](/azure/reliability/reliability-load-balancer) | Enable zone redundancy on Load Balancer to automatically distribute traffic across all availability zones. Zone-redundant deployment provides automatic failover and hash-based traffic distribution (distribution evenness depends on traffic entropy and client connection patterns). Configure backend pools with VMs distributed across multiple zones for optimal fault tolerance. |
| [AWS NLB Flow Hash Algorithm](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html#load-balancer-algorithm) | [Load Balancer Distribution Mode](load-balancer-distribution-mode.md) | Configure distribution mode to control traffic distribution. Azure Load Balancer uses 5-tuple hash (source IP, source port, destination IP, destination port, protocol) by default, while AWS NLB includes TCP sequence number in its flow hash. For applications requiring session affinity, configure Source IP affinity or Source IP and protocol distribution modes to ensure consistent routing. |

#### Scaling and load balancer scheme

The following table maps AWS NLB scaling and scheme capabilities to Azure Virtual Machine Scale Sets and public or internal Azure Load Balancer configurations:

| AWS NLB Capability | Azure Load Balancer Equivalent | Migration approach |
|---|---|---|
| [AWS NLB Target Registration and Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-load-balancer.html) | [Azure Virtual Machine Scale Sets Auto Registration](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-portal) | AWS Auto Scaling Groups automatically register and deregister EC2 instances with NLB target groups. Azure Virtual Machine Scale Sets provide equivalent functionality by automatically adding and removing VM instances to Load Balancer backend pools. Configure scale sets with automatic registration to backend pools during deployment. For individual VMs, use Azure Resource Manager templates or Azure CLI to programmatically add new VMs to backend pools by IP address or NIC configuration. |
| [AWS NLB Scheme Configuration (Internet-facing/Internal)](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/network-load-balancers.html) | [Azure Load Balancer Public/Internal Configuration](load-balancer-overview.md) | AWS NLB supports internet-facing (public) and internal schemes in a single load balancer configuration. Azure Load Balancer separates these schemes as distinct resource types: create a Public Load Balancer for internet traffic with a public IP frontend, or create an Internal (Private) Load Balancer for virtual network internal traffic with a private IP frontend. You can't convert between types after creation. Deploy separate load balancers for public and private traffic scenarios. Both types support identical backend pool and health probe configurations. |

#### TLS, idle timeout, and monitoring

The following table maps AWS NLB TLS, idle timeout, and monitoring capabilities to their Azure Load Balancer, Azure Application Gateway, and Azure Monitor equivalents:

| AWS NLB Capability | Azure Load Balancer Equivalent | Migration approach |
|---|---|---|
| [AWS NLB TLS Listener Support](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html) | [Azure Application Gateway for TLS Termination](../application-gateway/ssl-overview.md) | AWS NLB provides native TLS/SSL termination at Layer 4 with certificate management and TLS listeners (ports 443, custom TLS ports). Azure Load Balancer operates at Layer 4 and doesn't support TLS termination. It only supports TCP, UDP, and `TCP_UDP` protocols. For TLS termination in Azure, use Azure Application Gateway (Layer 7), which provides SSL/TLS offloading, certificate management, and end-to-end encryption. For Layer 4 TLS passthrough, configure Azure Load Balancer TCP listeners on port 443 and handle TLS termination on backend servers. |
| [AWS NLB Idle Timeout Configuration](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/network-load-balancers.html#connection-idle-timeout) | [Azure Load Balancer TCP Idle Timeout](load-balancer-tcp-idle-timeout.md) | AWS NLB TLS listeners have a fixed idle timeout of 350 seconds. After NLB receives a TCP keepalive from a client or target, it sends keepalive packets on both the frontend and backend connections every 20 seconds to keep the flow alive. For UDP traffic, the flow idle timeout is fixed at 120 seconds. Azure Load Balancer provides a configurable TCP idle timeout (4–100 minutes; default 4 minutes) and TCP reset capabilities. Azure doesn't automatically generate keepalive packets; applications must implement their own keepalive mechanisms. Configure idle timeout settings to match application connection patterns and enable TCP reset to ensure clean connection termination when the timeout elapses. |
| [AWS NLB CloudWatch Metrics](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-cloudwatch-metrics.html) | [Load Balancer Azure Monitor Integration](load-balancer-standard-diagnostics.md) | Configure diagnostic settings to send Load Balancer metrics to Azure Monitor. Enable detailed metrics for connections, throughput, and health probe status. Azure Monitor provides multi-dimensional metrics similar to CloudWatch, including `Byte Count`, `Packet Count`, and `SYN Count` metrics. Integrate with Azure Monitor workbooks for custom dashboards and alerting. |

### Capability mismatches and strategies

If your workload uses NLB capabilities that Azure Load Balancer can't directly address, consider the following strategies to arrive at a comparable outcome.

- **Direct functional replacement by using another Azure service**: Replace AWS NLB capabilities with Azure Load Balancer equivalents while maintaining core functionality. This approach prioritizes minimal disruption and uses native Azure integrations for security, monitoring, and performance optimization.

- **Architecture enhancement approach**: Use migration as an opportunity to modernize beyond AWS NLB capabilities by incorporating Azure Application Gateway for HTTP(S) APIs, Azure Traffic Manager for global distribution, and [Azure Front Door](../frontdoor/front-door-overview.md) for CDN and DDoS protection.

Decide whether an AWS NLB feature is necessary if there's no direct Azure Load Balancer equivalent, and adjust your workload accordingly.

#### Proxy Protocol support

**AWS NLB capability**: AWS NLB provides Proxy Protocol v2 support where:

- Preserves client IP information and passes it to backend targets through protocol headers
- Enables client IP visibility even when direct client IP preservation isn't available
- Useful for load balancer chaining scenarios and specific networking configurations

**Azure Load Balancer approach**: Azure Load Balancer doesn't have direct proxy protocol support, but provides equivalent functionality through:

- **Application-level solutions**: Implement custom headers or application logic to track client information when needed
- **Azure Application Gateway integration**: For HTTP-based APIs, use Application Gateway, which provides `X-Forwarded-For` headers

The preceding Proxy Protocol support illustrates a critical mismatch in capability. Other features might not have one-to-one equivalents in Azure Load Balancer. Before migrating, evaluate the features you use in AWS NLB and determine whether they have direct equivalents or need alternative strategies.

> [!NOTE]
> Evaluate all differences during your assessment phase and determine whether your workload can accommodate these changes or needs compensating architecture modifications.
>
> Measuring performance and reliability is crucial to ensure that the migrated workload meets your application's latency requirements. This measurement includes monitoring response times, connection establishment latency, jitter, and packet loss rates to validate that the Azure Load Balancer configuration performs optimally for your real-time scenarios. Standard Load Balancer provides an availability SLA, but workload-specific performance targets still require thorough testing.
>
> To ensure your migrated workload meets the expected performance and reliability criteria, establish baseline metrics from the AWS NLB before migration. You can then compare Azure Load Balancer performance after migration and confirm that it meets or exceeds the established benchmarks. Include all relevant metrics such as latency percentiles, concurrent connections, and packet loss rates in your baseline measurements.

## Prepare your AWS and Azure environments

A detailed assessment can reveal opportunities to adjust resources at the source, easing both the migration process and post-migration operations. This step focuses on targeted adjustments to AWS NLB configurations and related services to ensure compatibility and performance on Azure for your workloads.

### Source service configuration

A successful migration requires detailed documentation of the existing AWS NLB configurations and dependent services to ensure a smooth transition to Azure Load Balancer.

#### Protocol-specific load balancing rule documentation

- Document existing AWS NLB listener configurations and target group settings to ensure equivalent Azure Load Balancer rules. Use [AWS CLI commands for load balancers](https://docs.aws.amazon.com/cli/latest/reference/elbv2/describe-load-balancers.html) to gather detailed configuration information for both TCP and UDP protocols.
- Export all routing configurations, health check settings, and client IP preservation configurations by using the [AWS NLB target group documentation](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-target-groups.html).
- Document cross-zone load balancing settings and static IP configurations to ensure equivalent Azure zone redundancy and static public IP setup.

#### Health check configuration mapping

Map [AWS NLB health check configurations](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-health-checks.html) to Azure Load Balancer health probe equivalents by using the [Azure Load Balancer health probe configuration guide](load-balancer-custom-probe-overview.md). This mapping ensures TCP service health monitoring continues to function correctly after migration, and that you implement appropriate alternate health check strategies for UDP services (by using TCP or HTTP probes on alternate ports) with appropriate intervals for your workloads.

#### Performance baseline establishment

- Capture current performance metrics including latency percentiles (P50, P95, P99), concurrent connections, throughput, and packet loss rates
- Document current scaling patterns and peak load characteristics
- Record client IP preservation requirements for analytics and security systems

### Dependency changes

Prepare for migration by updating dependent services and configurations to ensure compatibility with Azure Load Balancer.

#### Application changes

- Configure health monitoring for your services over TCP, HTTP, or HTTPS by using [Azure Load Balancer health probes](manage-probes-how-to.md).
- Configure logging integration with Azure Monitor by using the [Load Balancer metrics](load-balancer-monitor-alert-health-event-logs.md).

#### DNS configuration changes

- Reduce DNS TTL values on your domain records to 300 seconds (or 60 seconds for minimal downtime requirements) for faster cutover.
- If you plan to use Azure DNS, create A records pointing to Azure Load Balancer static public IP addresses by using the [Azure DNS configuration guide](../dns/dns-operations-recordsets-cli.md#modify-an-existing-record-set). This change enables rapid DNS propagation during migration cutover with minimal impact on active sessions.

#### Backend pool updates

- Configure backend pool members across multiple availability zones for both TCP and UDP services
- Use [Azure Virtual Machine Scale Sets](load-balancer-standard-virtual-machine-scale-sets.md) for services with automatic scaling based on application metrics
- Implement zone distribution strategies that maintain performance during zone failures

### Environmental changes

Prepare your Azure environment by deploying the necessary infrastructure and configuring security and monitoring components to support the migrated workload. This preparation helps ensure a smooth transition and minimizes potential issues during the migration process.

#### Azure resource provisioning

- Deploy [Azure Load Balancer](load-balancer-overview.md), Virtual Machines, and Virtual Machine Scale Sets by using [Infrastructure as Code](../azure-resource-manager/templates/overview.md) before cutover following the Load Balancer deployment guides.
- Configure static public IP addresses and zone redundancy before cutover to ensure platform stability.
- Enable thorough testing and validation in a parallel environment before production cutover.

#### Network security setup

- Set up [Network Security Groups (NSGs)](../virtual-network/network-security-groups-overview.md) matching AWS security group rules for your traffic requirements.
- Configure DDoS protection for workloads by using [Azure DDoS Protection](../ddos-protection/ddos-protection-overview.md).
- Maintain your security posture before, during, and after migration.

#### Monitoring configuration

- Configure [Azure Load Balancer health event logs](load-balancer-health-event-logs.md) as part of your baseline monitoring. Depending on your migration plan, set up additional monitoring as needed.
- Set up dashboards and alerting rules including latency monitoring, concurrent connections, and health probe status by using the [Azure Load Balancer standard diagnostics](load-balancer-standard-diagnostics.md).

### Pre-migration checklist

Complete the following tasks before migration day. Complete them in order: the sequence matters because each task ensures that dependent services are available before the next one begins, preserving functionality throughout the migration. The general flow is infrastructure deployment, service migration, and then configuration of load balancing rules, health probes, and monitoring.

While the specific tasks can vary based on your architecture, complete them in this order:

1. **Azure infrastructure deployment**—Deploy Load Balancer with static IPs and VMs first as it's necessary for subsequent configuration steps.
1. **Health probe configuration**—Configure health probes for both protocol types matching AWS health check behavior by using the [Load Balancer health probe guide](load-balancer-custom-probe-overview.md).
1. **Protocol-specific rule configuration**—Configure separate load balancing rules for TCP and UDP traffic with appropriate backend pools.
1. **DNS preparation**—Reduce TTL values and prepare DNS record updates for your domains. This step is crucial for minimizing user disconnection during cutover.
1. **Application service migration**—Migrate services to Azure VMs and Scale Sets. Run this migration in parallel with the Azure infrastructure deployment to save time.
1. **Monitoring setup**—Configure Azure Monitor dashboards and alerting for application-specific metrics including latency, connections, and health status.

Confirm that every task in this checklist is complete before you begin the cutover. In general, the migration process involves deploying and configuring new load balancer infrastructure, followed by migrating application services and then configuring monitoring.

## Define validation criteria and test methods

After you prepare your environment and make the necessary changes, evaluate the migration plan and define validation criteria. This step ensures that all capabilities function as expected after the migration is complete.

### Validation criteria

As part of your migration planning, define the validation criteria that measure the success of the migration. These criteria help ensure that all capabilities function as expected after the migration is complete.

#### Success criteria definition

Establish validation criteria based on the original AWS NLB capabilities you identified in the assessment section:

##### Functional criteria

- **Multi-protocol routing accuracy**: TCP and UDP traffic routes to correct backend pools based on protocol and port
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
- **High availability**: Uptime meets the desired SLA, and automatic failover occurs within seconds.
- **Platform-specific SLA**: Meet platform-specific requirements for user experience
- **Security functionality**: Client IP tracking functions correctly for fraud detection systems

### Workload validation methods

Define methods to validate the success criteria you established for your workloads. These methods include both automated and manual testing to ensure comprehensive coverage of all capabilities.

#### Automated testing

- Create comprehensive automated tests covering all capabilities, including:
  - Multi-protocol load balancing validation for TCP and UDP traffic
  - Performance and load testing against baseline metrics by using appropriate tools
  - Latency and jitter testing for real-time requirements
  - Connection failover and scaling scenario testing under load conditions

#### Manual validation checklist

- Test client connections across both TCP and UDP services
- Validate session creation, operation, and termination flows
- Test security system functionality with client IP preservation
- Verify real-time performance under peak load conditions
- Test session persistence during zone failures and scaling events
- Validate analytics and monitoring data collection

## Execute the migration cutover

With your migration plan in place and preparatory changes completed, you're ready to move forward. Follow these steps to execute the migration on migration day while minimizing impact on active sessions.

### Migration execution

Migration execution involves a series of steps to ensure a smooth transition from AWS NLB to Azure Load Balancer. The process includes final validation, parallel testing, DNS cutover, post-cutover validation, and AWS resource decommissioning.

#### Final validation and testing

Validate Azure Load Balancer configuration and service health before cutover:

- Test both TCP and UDP endpoints with appropriate clients
- Verify multi-protocol routing for different service types
- Confirm multi-zone backend pool distribution and service failover
- Validate service functionality across multiple zones with realistic scenarios
- Test high availability and zone failover scenarios under load
- Compare performance metrics against AWS NLB baseline including latency and jitter
- Verify Floating IP (DSR) guest OS configuration and network security prechecks (configure loopback interface, enable weak-host where required, and allow Load Balancer probe IP `168.63.129.16` in NSGs/firewalls)

#### DNS cutover execution

Execute DNS cutover from AWS NLB to Azure Load Balancer. Update domain DNS records to point to Azure Load Balancer static public IP addresses and monitor DNS propagation by using DNS monitoring tools.

#### Post-cutover validation

During the post-cutover step, you validate the success of the migration by ensuring that all services function correctly and that performance meets real-time requirements.

##### Functional validation

- Verify all service routing functions correctly for both protocols
- Validate client IP preservation functionality for security systems
- Test session creation, operation, and termination flows
- Validate health probe behavior for TCP services and alternate health check approaches for UDP services

##### Performance validation

- Monitor response times and latency against AWS NLB baseline
- Verify throughput capacity meets concurrent session requirements
- Test jitter and packet loss rates for real-time quality

#### AWS resource decommissioning

After successful validation, decommission AWS resources:

- Monitor Azure Load Balancer for 24–72 hours with production traffic, extending the window as needed to cover peak-traffic periods
- Verify no traffic routing to AWS NLB
- Back up AWS NLB configuration for rollback capability
- Terminate AWS NLB and associated infrastructure resources

In general, consider the migration successful when it consistently meets all success criteria over the monitoring period you defined and shows no performance degradation compared to the AWS NLB baseline. Extend monitoring to cover peak hours and weekend traffic patterns as needed before final decommissioning.

## Rollback plan

Because this migration is a cutover with AWS and Azure running in parallel, you can revert quickly if validation fails. Prepare the rollback plan before cutover so that the team can act without delay.

### Rollback triggers

Roll back if any of the following conditions occur after cutover and you can't resolve them quickly:

- Functional validation fails. For example, TCP or UDP traffic doesn't route to the correct backend pool, or client IP preservation stops working for security systems.
- Latency, jitter, or packet loss exceeds your AWS NLB baseline beyond the agreed threshold.
- Health probes report backend instances as unhealthy across zones.
- Error rates or session disconnects rise above acceptable levels.

### DNS reversion

- Revert the domain A records to point back to the AWS NLB IP addresses. Because you lowered the TTL before cutover (300 seconds, or 60 seconds for faster propagation), most resolvers pick up the change within minutes.
- Monitor DNS propagation and confirm that clients resolve to the AWS NLB again.

### Retained AWS resources

- Keep the AWS NLB, target groups, and EC2 backend instances running throughout the monitoring window so that reversion is immediate and requires no rebuild.
- Retain the backed-up AWS NLB configuration until you complete final validation and decommission the AWS resources.

### Post-rollback validation

- Verify that TCP and UDP traffic routes correctly through the AWS NLB.
- Confirm client IP preservation and health check behavior for both protocols.
- Compare performance against your baseline to confirm the workload is stable.

### Expected timing

- DNS reversion typically completes in 15–30 minutes, consistent with the rollback time in your maintenance window. Investigate and resolve the root cause before you attempt the cutover again.

## Iterative optimization

After migration, optimize the Azure Load Balancer configuration and validate performance, routing accuracy, and high availability. This iterative optimization process ensures that the migrated workload meets all success criteria that you established during the assessment step following the [Azure Well-Architected Framework service guide for Azure Load Balancer](/azure/well-architected/service-guides/azure-load-balancer).

### Iterative improvement process

The migration process is iterative. Adjust it based on performance feedback and testing until you meet the success criteria:

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

**Assessment and planning**: Map AWS NLB capabilities to Azure Load Balancer equivalents early in the process. Pay special attention to multi-protocol support, client IP preservation, and low-latency requirements for high-performance platforms.

**Use Azure integrations**: Take advantage of Azure static public IPs for consistent endpoints, Azure Monitor for observability, and Virtual Machine Scale Sets for service autoscaling to satisfy functional and nonfunctional requirements in your workload.

**Test thoroughly before cutover**: Use parallel testing with simulation tools to validate all functionality. Establish baseline metrics from your AWS environment and ensure Azure Load Balancer meets or exceeds performance expectations including latency, jitter, and connection handling.

**Plan for minimal downtime**: Reduce DNS TTL values beforehand and prepare all infrastructure in parallel. The actual cutover involves only DNS changes, minimizing session disruption and user impact.

**Monitor and optimize post-migration**: Use the iterative improvement process to fine-tune performance, routing accuracy, and high availability. Azure Load Balancer provides extensive monitoring capabilities to optimize your configuration over time with real traffic patterns.

**Platform-specific considerations**: Focus on latency-sensitive optimization, multi-protocol traffic handling, client IP preservation for security systems, and zone redundancy for high availability. Azure Load Balancer provides the enterprise-grade reliability and performance required for mission-critical platforms, though actual latency performance depends on datacenter design and network topology.

## Troubleshooting

Use the following guidance to resolve common issues during and after cutover.

### Traffic still routes to the AWS NLB after cutover

Some clients and recursive resolvers continue to resolve to the AWS NLB after cutover because they cache DNS records. Lower the TTL (300 seconds, or 60 seconds for faster propagation) before cutover, and keep the AWS NLB running until the monitoring window confirms that traffic fully shifts. Propagation depends on upstream resolvers, so you can't guarantee it for every client.

### UDP services report as unhealthy

Azure Load Balancer doesn't support native UDP health probes. If UDP backends appear unhealthy, configure a TCP or HTTP/HTTPS health probe on an alternate port that reflects the health of the UDP service, and confirm that the probe interval and unhealthy threshold match your workload's requirements.

### Floating IP (DSR) connections fail

When you enable Floating IP (Direct Server Return), you must configure the guest OS to accept the traffic. Configure a loopback interface with the load balancer frontend IP address, enable the weak host model where required, and confirm that the application listens on the expected port. Missing guest OS configuration is a common cause of failed connections with Floating IP rules.

### Health probes fail and mark all backends unhealthy

Azure Load Balancer health probes originate from the IP address `168.63.129.16`. If probes fail, confirm that your network security groups and any host firewalls allow inbound traffic from `168.63.129.16` to the probe port. Blocking this address marks all backend instances as unhealthy.

## Next step

> [!div class="nextstepaction"]
> [Architecture best practices for Azure Load Balancer](/azure/well-architected/service-guides/azure-load-balancer)
