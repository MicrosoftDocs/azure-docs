---
title: "Prepare your n-tier workload migration from on-premises to Azure"
description: Learn how to prepare your Azure environment and validate migration paths before executing an n-tier workload migration from on-premises.
ms.author: rhackenberg
author: reginahack
ms.date: 11/03/2026
ms.topic: concept-article
ms.custom: migration-hub
ms.service: azure
ms.collection:
  - migration
  - on-prem-to-azure
---

# Prepare your n-tier workload migration from on-premises to Azure

This article is part of a series about how to [migrate an n-tier workload from on-premises to Azure](/azure/migration/migrate-n-tier-from-on-premises-introduction). 

**Migration phases:** [Plan](./migrate-n-tier-from-on-premises-1-plan.md) > **Prepare** > [Execute](./migrate-n-tier-from-on-premises-3-execute.md) > [Evaluate](./migrate-n-tier-from-on-premises-4-evaluate.md) > [Decommission](./migrate-n-tier-from-on-premises-5-decommission.md)

The preparation phase consists of these steps:

> [!div class="checklist"]
> * Prepare the environment.
> * Prepare the workload.


:::image type="icon" source="images/goal.svg" alt-text="Goal icon"::: The goal of this phase is to prepare the workload and its Azure environment so that you can validate the migration approach before production cutover. Deploy and configure as much of the target infrastructure and application as possible, then test connectivity, security, identity, operations, and recovery.

> [!IMPORTANT]
> Take your time during this phase. Misconfigured infrastructure, insufficient testing, or team unreadiness can cause delays, security vulnerabilities, or failed deployments during migration.

## Prepare your environment

- **Provision workload landing zones:** Give the Azure platform team your Azure workload design so they can provision the [landing zone](/azure/cloud-adoption-framework/ready/landing-zone/implementation-options) for your preproduction and production workload environments. Organize landing zones around workload boundaries when isolation, security policy, ownership, or cost tracking requires it. A workload-specific boundary prevents unrelated applications from sharing an operational and security boundary by default.

  In a hub-and-spoke topology, a spoke is a virtual network connected to a shared hub network. Avoid organizing spokes only by environment, such as one spoke for all production workloads and another spoke for all development workloads. 

  Confirm that workload resources comply with the platform team's [Azure Policy assignments](/azure/governance/policy/overview), including regional deployment restrictions, and agree on any required exceptions before deployment. For more information about platform design and responsibilities, see [Azure landing zones for on-premises experts](/azure/migration/migrate-from-on-premises-platform-landing-zone).

- **Set up migration tools:** If you plan to use Azure Migrate for the execution phase, deploy the Azure Migrate appliance and configure your Azure Migrate project if you didn't do so in the Plan phase. Set up system owner participation, access approvals, and appliance prerequisites early, especially when regulated environments require more reviews. Confirm that access is granted and tools are usable before scheduling rehearsal or other dependent work.

- **Confirm the approved migration path:** Verify that the selected path remains supported and that its prerequisites are available. If the path must change, return to the Plan phase before continuing.

- **Deploy and configure Azure infrastructure:** Use infrastructure as code (IaC) for consistency and repeatability if your team has experience with that tooling and process. Document the configuration in enough detail to reproduce the environment consistently. Treat this documentation-based approach as an interim step, and include IaC training and adoption in the team's improvement backlog.

  Focus on nonproduction environments first, and validate everything before you move on to production environments. Follow tagging standards the platform team defines to apply your organization's required resource tags for workload ownership and cost allocation.

- **Verify quota and deployment capacity:** Confirm that approved service quotas cover the test and production environments, including any overlap. Deploy the required services and virtual machine (VM) SKUs in the approved region and zones before cutover. A successful test deployment doesn't reserve capacity for a later deployment or reallocation.

  If capacity is unavailable, validate the alternative approved during planning or return the target decision to the Plan phase. Don't continue to the Execute phase if there are unresolved quota or capacity requirements.

- **Update deployment processes:**

  - Modify your deployment pipelines to target Azure services.

  - Configure the service connections and ensure that your build and release workflows can deploy your selected Azure VMs.

  - If you use a blue-green approach, ensure that you can deploy the workload to both on-premises and Azure during the transition. For example, you might need to apply an urgent fix or support a rollback to a previous application version. Both environments should reflect these changes.

- **Test infrastructure:** Validate your Azure Virtual WAN or hub network and any other foundational services, like Azure ExpressRoute or virtual private network (VPN) connections. Ensure that they support the target workload and the migration process.

  Validate end-to-end connectivity across your Azure and on-premises environments. Use [Azure Chaos Studio](/azure/chaos-studio/) to simulate potential faults, like VM or networking outages. Ensure that the migrated workload remains resilient under these circumstances.

  If you plan to use ExpressRoute, make sure you started procurement during the Plan phase. Provisioning can require provider, facility, circuit, and cross-connect work that takes substantially longer than the Azure-side configuration. Use an approved VPN path for pilot or interim work if it meets the measured requirements.

- **Test networking and security:** When you set up network security groups (NSGs), firewalls, and policies, check that the application can communicate with all required services. Test connectivity to ensure that security settings aren't too restrictive or permissive. Adjust the following settings as needed to maintain security and functionality:

  - Confirm that all required ports are open between Azure and on-premises environments.

  - Validate firewall rules and NSG or application security group (ASG) configurations.

  - Review rules that use the [`VirtualNetwork`](/azure/virtual-network/service-tags-overview#available-service-tags) service tag. The tag scope can include peered and routed networks, not only the local subnet. Scope rules to the required sources and ports.

  - Document any temporary security exceptions needed during migration.

  - Ensure that rollback plans account for reverting any security-related changes.

- **Validate identities the workload uses:** Test the authentication, authorization, Domain Name System (DNS), certificates, and service accounts that the workload requires. Confirm that the application grants the expected access and rejects unauthorized access.

  If you intend the final design to work without the source site, test that behavior in an isolated environment. If a source identity dependency will remain, document its purpose, owner, support model, recovery procedure, and planned end state. Don't continue to the Execute phase until required identity dependencies are available, validated, and documented with an owner and recovery plan.

## Prepare your application

- **Review potentially obsolete workload components:** A quiet system or old configuration record isn't proof that a component is unused. Remove a source feature, infrastructure component, or operational process only after owner confirmation that it isn't needed, supported by dependency checks and evidence across relevant business cycles.

  Use approved change control and run regression tests on the source workload after any removal. If nonuse is uncertain or removal adds migration risk, retain the component during the like-for-like move and defer cleanup.

- **Minimize changes to on-premises production workloads:** As migration approaches, avoid introducing new workload infrastructure, capabilities, or dependencies that might put the migration at risk.

- **Refactor your application code:** Develop a way to apply different configurations to your Azure and on-premises environments, such as by using feature flags or configuration files with environment-specific transformations.

  > [!TIP]
  > Tools like GitHub Copilot can help developers identify and refactor code like SDK calls or service integrations to Azure-compatible equivalents. For supported applications, [GitHub Copilot modernization](/azure/developer/github-copilot-app-modernization/overview) can also help assess code and dependencies and make approved migration changes. Review and test the changes, and keep framework upgrades, containerization, and other modernization outside migration unless they're explicitly approved.

- **Prepare session state:** If you retain local or sticky sessions, configure the required load-balancer affinity and consistent encryption or ASP.NET machine keys across instances. If you use a shared session store, validate serialization, encryption, latency, availability, and recovery. Test what happens during instance restarts, scaling, and failover. Decide whether active sessions should continue through cutover or expire and require users to sign in again.

- **Prepare the offline page and traffic redirect path:** Build the offline page experience and ingress redirect that the planning runbook defined. Configure how to pause or shut down every background process and job you identified during planning. Test the full redirect and restore cycle, and confirm that background jobs stop writing before you rely on this behavior during cutover.

- **Coordinate client configuration changes:** Ensure that you implement and validate all client-facing configuration changes. Provide preproduction environments for client teams to test updates to endpoints, authentication, and connectivity.

- **Validate operational readiness:** Work with your operations team to implement workload monitoring in Azure. Set up Azure Monitor, Application Insights, or your preferred monitoring tool with dashboards and alert rules that are equivalent to your on-premises alarms. Train the operations team on these tools. Collaborate with the security team to implement security monitoring and validate the Azure architecture. Validate that you can conduct your workload's routine, unplanned, and emergency operational tasks on Azure.

  Validate the exact operating system, application runtime, driver, and integration versions that the target supports. Record vendor support evidence for the selected Azure target and migration method. A version that worked on-premises isn't automatically supported after the move.

- **Complete the full functional, regression, load, and migration test suite in a nonproduction environment**. Rehearse the runbook, including synchronization, recovery, and the controls that prevent unintended production writes, and record failures and retest results before handing off to the Execute phase. Run the rehearsal in an isolated network if the test topology could conflict with production DNS or routing. Use private access, such as Azure Bastion or an equivalent approved method, and confirm that the rehearsal can't receive unintended production traffic.

- **Follow the database migration path approved during the Plan phase**. For database synchronization and cutover guidance, use the current [Azure database migration guide](/data-migration/) for the selected source and target. Reconfirm product support and limitations before starting production synchronization.

  > [!IMPORTANT]
  > If the application runs in Azure while its database remains on-premises, test representative workloads before proceeding. Network latency between the application and database can be prohibitive, especially for chatty application flows. Validate the application's behavior under the cumulative latency, not just the latency of a single request. For example, a flow that makes 100 database round trips can become unusable if each round trip takes 10 times as long in hybrid operation.

## Decision and handoff

The team decides whether the rehearsal supports production execution. The Execution phase receives the rehearsal report, synchronization state, temporary-access record, recovery evidence, and runbook.

## Checklist

| &nbsp;  | Deliverable tasks |
| ------- | ----------------- |
| &#9744; | Provision the approved preproduction and production workload environments. |
| &#9744; | Configure the approved migration tools and reconfirm the supported migration path. |
| &#9744; | Deploy reproducible Azure infrastructure and update continuous integration/continuous delivery (CI/CD) pipelines for Azure. |
| &#9744; | Confirm approved quotas and validate deployment capacity for test and production. |
| &#9744; | Validate hybrid connectivity, resilience, networking, and security controls. |
| &#9744; | Validate authentication, authorization, DNS, certificates, and service accounts. |
| &#9744; | Verify nonuse before any approved source cleanup. Regression-test removals, and defer uncertain cleanup. |
| &#9744; | Configure environment-specific application settings and the approved session model. |
| &#9744; | Build and test the offline-page, traffic redirect, and background process controls. |
| &#9744; | Coordinate and validate client endpoint, authentication, and connectivity changes. |
| &#9744; | Configure monitoring, alerts, security monitoring, and operational procedures. |
| &#9744; | Complete functional, regression, load, and migration testing in a nonproduction environment and record rehearsal, recovery, and support evidence. |

For more information about preparing your workloads and building your Azure environment, see [Prepare workloads for the cloud](/azure/cloud-adoption-framework/migrate/prepare-workloads-cloud).

## Next step

> [!div class="nextstepaction"]
> [Execute your workload migration](./migrate-n-tier-from-on-premises-3-execute.md)
