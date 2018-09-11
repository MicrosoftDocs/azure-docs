---

title: Governance in Azure | Microsoft Docs
description: Learn about cloud-based computing services that can scale up and down to meet the needs of your application or enterprise.
services: security
documentationcenter: na
author: UnifyCloud
manager: mbaldwin
editor: TomSh

ms.assetid:
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/01/2017
ms.author: TomSh

---

# Governance in Azure

Azure gives you many security options and the ability to control them so that you can meet the unique requirements of your organization's deployments.

Azure cloud governance refers to the decision-making processes, criteria, and policies involved in the planning, architecture, acquisition, deployment, operation, and management of cloud computing. Azure cloud governance provides an integrated audit and consulting approach for reviewing and advising organizations on their usage of the Azure platform. 

To create a plan for Azure cloud governance, you need to take an in-depth look at the people, processes, and technologies now in place. Then, you can build frameworks that make it easy for IT to consistently support business needs while providing users with the flexibility to use the features of Azure.

## Implementation of policies, processes, and standards 

Management has established roles and responsibilities to oversee implementation of information security policies and operational continuity across Azure. Azure management is responsible for overseeing security and continuity practices within its respective teams (including third parties). It also facilitates compliance with security policies, processes, and standards.

### Account provisioning

Defining account hierarchy is a major step to use and structure Azure services within a company. It's the core governance structure. Customers who have an Enterprise Agreement (EA) can subdivide the environment into departments, accounts, and subscriptions.

![Account provisioning](./media/governance-in-azure/security-governance-in-azure-fig1.png)

If you don't have an Enterprise Agreement, consider using [Azure tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags) at the subscription level to define the hierarchy. An Azure subscription is the basic unit that contains all the resources. It also defines several limits within Azure, such as the number of cores and resources. Subscriptions can contain [resource groups](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview), which can contain resources. [Role-based access control (RBAC)](https://docs.microsoft.com/azure/role-based-access-control/overview) principles apply on those three levels.

Every enterprise is different. For non-enterprise companies, the hierarchy of using Azure tags allows for flexibility in how Azure is organized. Before you deploy resources in Azure, you should model a hierarchy and understand the impact on billing, resource access, and complexity.

### Subscription controls

Subscriptions determine how resources usage is reported and billed. You can set up subscriptions for separate billing and payment. One Azure account can have multiple subscriptions. Subscriptions can be used to determine the Azure resource usage of multiple departments in a company.

For example, a company has IT, HR, and Marketing departments, and these departments are running different projects. The company can base its billing on each department's usage of Azure resources, like virtual machines. The company can then control the finances of each department.

Azure subscriptions establish three parameters:

- Unique subscriber ID

- Billing location

- Set of available resources

For an individual, those parameters include one Microsoft account ID, a credit card number, and the full suite of Azure services. Microsoft enforces consumption limits, depending on the subscription type.

Azure enrollment hierarchies define how services are structured within an Enterprise Agreement. The Enterprise Agreement portal enables customers to divide access to Azure resources associated with an Enterprise Agreement based on flexible hierarchies that are customizable to an organization's needs. The hierarchy pattern should match an organization's management and geographic structure to account for the associated billing and resource access.

The three high-level hierarchy patterns are functional, business unit, and geographic. Departments are an administrative construct for account groupings. Within each department, accounts can be assigned subscriptions, which create silos for billing and several key limits in Azure (for example, number of VMs and storage accounts).

![Subscription controls](./media/governance-in-azure/security-governance-in-azure-fig2.png)


For organizations with an Enterprise Agreement, Azure subscriptions follow a four-level hierarchy:

1. Enterprise enrollment administrator

2. Department administrator

3. Account owner

4. Service administrator

This hierarchy governs the following:

- Billing relationship.

- Account administration.

- Access to resources through RBAC.

- Boundaries:

  - Usage and billing (rate card based on offer numbers)

  - Limits

  - Virtual network

- Attachment to Azure Active Directory (Azure AD). One Azure AD instance can be associated with many subscriptions.

- Association with an enterprise enrollment account.

### Role-based access control

[RBAC](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles) enables detailed access management of resources in Azure. By using RBAC, you can grant only the amount of access that users need to perform their jobs. Companies should focus on giving employees the exact permissions that they need. Too many permissions expose an account to attackers. Too few permissions mean that employees can't get their work done efficiently. 

Instead of giving everybody unrestricted permissions in your Azure subscription or resources, you can allow only certain actions. For example, you can use RBAC to let one employee manage virtual machines in a subscription, while another employee manages SQL databases in the same subscription.

To grant access, you assign roles to users, groups, or applications at a certain scope. The scope of a role assignment can be a subscription, a resource group, or a single resource. A role assigned at a parent scope also grants access to the children contained within it. For example, a user with access to a resource group can manage all the resources that it contains, like websites, virtual machines, and subnets. Within each subscription, you can create up to 2,000 role assignments.

A role is a collection of permissions, and RBAC has several built-in roles. The following built-in roles apply to all resource types:

- **Owner** has full access to all resources, including the right to delegate access to others.

- **Contributor** can create and manage all types of Azure resources but can't grant access to others.

- **Reader** can view all Azure resources.

The rest of the built-in roles in Azure allow management of specific Azure resources. For example, the Virtual Machine Contributor role allows the user to create and manage virtual machines. For a list of all the built-in roles and their operations, see [RBAC built-in roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles).

RBAC supports management operations of the Azure resources in the Azure portal and Azure Resource Manager APIs. In most cases, RBAC can't authorize data-level operations for Azure resources. For information about how RBAC is being extended to data operations, see [Understand role definitions](https://docs.microsoft.com/azure/role-based-access-control/role-definitions).

If the built-in roles don’t meet your specific access needs, you can [create a custom role](https://docs.microsoft.com/azure/role-based-access-control/custom-roles). Just like built-in roles, custom roles can be assigned to users, groups, and applications at the subscription, resource group, and resource scope. You can create custom roles by using [Azure PowerShell](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-powershell), [Azure CLI](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-cli), and the [REST API](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-rest).

### Resource management

Azure provides two deployment models: [classic](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-deployment-model) and Azure Resource Manger.

In the classic model, each resource exists independently. There's no way to group related resources together. You have to manually track which resources make up your solution or application, and remember to manage them in a coordinated approach. The basic unit of management is the subscription. It's hard to break down resources within a subscription, which leads to the creation of large numbers of subscriptions.

The Resource Manager deployment model includes the concept of a [resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview). A resource group is a container for resources that share a common lifecycle. It can include all the resources for the solution, or only those resources that you want to manage as a group. You decide how you want to allocate resources to resource groups based on what makes the most sense for your organization.

The Resource Manager deployment model provides several benefits:

- You can deploy, manage, and monitor all the services for your solution as a group, rather than handling these services individually.

- You can repeatedly deploy your solution throughout its lifecycle and have confidence that your resources are deployed in a consistent state.

- You can apply access control to all resources in your resource group. Those policies are automatically applied when new resources are added to the resource group.

- You can apply tags to resources to logically organize all the resources in your subscription.

- You can use JavaScript Object Notation (JSON) to define the infrastructure for your solution. The JSON file is known as a Resource Manager template.

- You can define the dependencies between resources so they're deployed in the right order.

![Resource Manager](./media/governance-in-azure/security-governance-in-azure-fig4.png)

For recommendations about templates, see [Best practices for creating Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-template-best-practices).

Azure Resource Manager analyzes dependencies to help ensure that resources are created in the right order. If one resource relies on a value from another resource (such as a virtual machine needing a storage account for disks), you [set a dependency](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-define-dependencies) in the template.

You can also use the template for updates to the infrastructure. For example, you can add a resource to your solution and add configuration rules for the resources that are already deployed. If the template specifies creating a resource but that resource already exists, Resource Manager performs an update instead of creating a new asset. Resource Manager updates the existing asset to the same state as it would be as new.

Resource Manager provides extensions for scenarios when you need more operations, such as installing software that is not included in the setup.

### Resource tracking

As users in your organization add resources to the subscription, it becomes more important to associate resources with the appropriate department, customer, and environment. You can attach metadata to resources through [tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags). You use tags to provide information about the resource or the owner. Tags enable you to not only aggregate and group resources in several ways, but also use that data for the purpose of chargeback.

Use tags when you have a complex collection of resource groups and resources, and you need to visualize those assets in the way that makes the most sense to you. For example, you can tag resources that serve a similar role in your organization or that belong to the same department.

Without tags, users in your organization can create multiple resources that might be hard to later identify and manage. For example, you might want to delete all the resources for a project. If those resources are not tagged for the project, you must manually find them. Tagging can be an important way for you to reduce unnecessary costs in your subscription.

Resources don't need to reside in the same resource group to share a tag. You can create your own tag taxonomy to ensure that all users in your organization use common tags rather than inadvertently applying slightly different tags (such as "dept" instead of "department").

Resource policies enable you to create standard rules for your organization. You can create policies to ensure that resources are tagged with the appropriate values.

You can also view tagged resources through the Azure portal. The [usage report](https://docs.microsoft.com/azure/billing/billing-understand-your-bill) for your subscription includes tag names and values, so you can break out costs by tags.

For more information about tags, see [Billing tags policy initiative](../azure-policy/scripts/billing-tags-policy-init.md).

The following limitations apply to tags:

- Each resource or resource group can have a maximum of 15 tag key/value pairs. This limitation applies only to tags directly applied to the resource group or resource. A resource group can contain many resources that each have 15 tag key/value pairs.

- The tag name is limited to 512 characters.

- The tag value is limited to 256 characters.

- Tags applied to the resource group are not inherited by the resources in that resource group.

If you have more than 15 values that you need to associate with a resource, use a JSON string for the tag value. The JSON string can contain many values that are applied to a single tag key.

#### Tags for billing

Tags enable you to group your billing data. For example, if you're running multiple VMs for different organizations, use tags to group usage by cost center. You can also use tags to categorize costs by runtime environment, such as the billing usage for VMs running in the production environment.

You can retrieve information about tags through the [Azure Resource Usage and RateCard APIs](https://docs.microsoft.com/azure/billing/billing-usage-rate-card-overview) or the usage comma-separated values (CSV) file. You download the usage file from the [Azure accounts portal](https://account.windowsazure.com/) or the [EA portal](https://ea.azure.com/).

For more information about programmatic access to billing information, see [Gain insights into your Microsoft Azure resource consumption](https://docs.microsoft.com/azure/billing/billing-usage-rate-card-overview). For REST API operations, see [Azure Billing REST API Reference](https://msdn.microsoft.com/library/azure/1ea5b323-54bb-423d-916f-190de96c6a3c).

When you download the usage CSV for services that support tags with billing, the tags appear in the Tags column.

### Critical resource controls

As your organization adds core services to the subscription, it becomes more important to ensure that those services are available to avoid business disruption. [Resource locks](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-lock-resources) enable you to restrict operations on high-value resources where modifying or deleting them would have a significant impact on your applications or cloud infrastructure. You can apply locks to a subscription, resource group, or resource. Typically, you apply locks to foundational resources such as virtual networks, gateways, and storage accounts.

Resource locks currently support two values: **CanNotDelete** and **ReadOnly**. **CanNotDelete** means that users (with the appropriate rights) can still read or modify a resource but cannot delete it. **ReadOnly** means that authorized users can't delete or modify a resource.

Resource locks apply only to operations that happen in the management plane, which consists of operations sent to <https://management.azure.com>. The locks don't restrict how resources perform their own functions. Resource changes are restricted, but resource operations are not restricted. For example, a **ReadOnly** lock on a SQL database prevents you from deleting or modifying the database, but it does not prevent you from creating, updating, or deleting data in the database.

Applying **ReadOnly** can lead to unexpected results because some operations that seem like read operations require additional actions. For example, placing a **ReadOnly** lock on a storage account prevents all users from listing the keys. The operation of listing keys is handled through a POST request because the returned keys are available for write operations.

![Critical resource controls](./media/governance-in-azure/security-governance-in-azure-fig5.png)

For another example, placing a **ReadOnly** lock on an Azure App Service resource prevents Visual Studio Server Explorer from displaying files for the resource because that interaction requires write access.

Unlike role-based access control, you use management locks to apply a restriction across all users and roles. To learn about setting permissions, see [Manage access using RBAC and the Azure portal](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal).

When you apply a lock at a parent scope, all resources within that scope inherit the same lock. Even resources that you add later inherit the lock from the parent. The most restrictive lock in the inheritance takes precedence.

To create or delete management locks, you must have access to Microsoft.Authorization/ or Microsoft.Authorization/locks/ actions. Of the built-in roles, only Owner and User Access Administrator are granted those actions.

### API access to billing information

Use Azure Billing APIs to pull usage and resource data into your preferred data analysis tools. The Azure Resource Usage and RateCard APIs can help you accurately predict and manage your costs. The APIs are implemented as a resource provider and part of the family of APIs exposed by Azure Resource Manager.

#### Resource Usage API (Preview)

Use the Azure [Resource Usage API](https://msdn.microsoft.com/library/azure/mt219003) to get your estimated Azure consumption data. The API includes:

- **RBAC**: Configure access policies on the [Azure portal](https://portal.azure.com/) or through [Azure PowerShell cmdlets](https://docs.microsoft.com/powershell/azure/overview) to specify which users or applications can get access to the subscription's usage data. Callers must use standard Azure Active Directory tokens for authentication. Add the caller to either the Billing Reader, Reader, Owner, or Contributor role to get access to the usage data for a specific Azure subscription.

- **Hourly or daily aggregations**: Callers can specify whether they want their Azure usage data in hourly or daily increments. The default is daily.

- **Instance metadata (includes resource tags)**: Get instance-level detail like the fully qualified resource URI (/subscriptions/{subscription-id} /..), resource group information, and resource tags. This metadata helps you deterministically and programmatically allocate usage by the tags, for use cases like cross-charging.

- **Resource metadata**: Resource details such as the meter name, meter category, meter subcategory, unit, and region give the caller a better understanding of what was consumed. We're also working to align resource metadata terminology across the Azure portal, Azure usage CSV, EA billing CSV, and other public-facing experiences, to help you correlate data across experiences.

- **Usage for all offer types**: Usage data is available for all offer types, including Pay-As-You-Go, MSDN, Monetary Commitment, Monetary Credit, and EA.

#### Resource RateCard API

Use the Azure Resource RateCard API to get the list of available Azure resources and estimated pricing information for each. The API includes:

- **RBAC**: Configure your access policies on the Azure portal or through Azure PowerShell cmdlets to specify which users or applications can get access to the RateCard data. Callers must use standard Azure Active Directory tokens for authentication. Add the caller to the Reader, Owner, or Contributor role to get access to the usage data for a particular Azure subscription.

- **Support for Pay-As-You-Go, MSDN, Monetary Commitment, and Monetary Credit offers (but not EA)**: This API provides Azure offer-level rate information. The caller of this API must pass in the offer information to get resource details and rates. EA is currently not supported because EA offers have customized rates per enrollment. 

#### Scenarios

The combination of the Usage and RateCard APIs makes these scenarios possible:

- **Understand Azure spend during the month**: Use the combination of the Usage and RateCard APIs to get better insights into your cloud spend during the month. You can analyze hourly and daily usage and charge estimates.

- **Set up alerts**: Use the Usage and RateCard APIs to get estimated cloud consumption and charges, and set up resource-based or monetary-based alerts.

- **Predict bill**: Get your estimated consumption and cloud spend, and apply machine learning algorithms to predict what the bill would be at the end of the billing cycle.

- **Perform a pre-consumption cost analysis**: Use the RateCard API to predict how much your bill would be for your expected usage when you move your workloads to Azure. If you have existing workloads in other clouds or private clouds, you can also map your usage with the Azure rates to get a better estimate of Azure spend. This estimate gives you the ability to pivot on offer, and compare between the different offer types beyond Pay-As-You-Go, like Monetary Commitment and Monetary Credit.

- **Perform a what-if analysis**: You can determine whether it's more cost-effective to run workloads in another region or on another configuration of the Azure resource. Azure resource costs might differ based on the Azure region you're using. You can also determine if another Azure offer type gives a better rate on an Azure resource.

### Networking controls

Access to resources can be either internal (within the corporation's network) or external (through the internet). It's easy for users in your organization to inadvertently put resources in the wrong spot, and potentially open them to malicious access. As with on-premises devices, enterprises must add appropriate controls to ensure that Azure users make the right decisions.

![Networking controls](./media/governance-in-azure/security-governance-in-azure-fig6.png)

For subscription governance, the following core resources provide basic control of access.

#### Network connectivity

[Virtual networks](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview) are container objects for subnets. Though not strictly necessary, a virtual network is often used for connecting applications to internal corporate resources. The Azure Virtual Network service enables you to securely connect Azure resources to each other with virtual networks.

A virtual network is a representation of your own network in the cloud. A virtual network is a logical isolation of the Azure cloud dedicated to your subscription. You can also connect virtual networks to your on-premises network.

Following are capabilities for Azure virtual networks:

- **Isolation**: Virtual networks are isolated from one another. You can create separate virtual networks for development, testing, and production that use the same CIDR address blocks. Conversely, you can create multiple virtual networks that use different CIDR address blocks and connect networks together. You can segment a virtual network into multiple subnets. Azure provides internal name resolution for VMs and Azure Cloud Services role instances that are connected to a virtual network. You can optionally configure a virtual network to use your own DNS servers, instead of using Azure internal name resolution.

- **Internet connectivity**: All Azure virtual machines and Cloud Services role instances that are connected to a virtual network have access to the internet, by default. You can also enable inbound access to specific resources, as needed.

- **Azure resource connectivity**: You can connect Azure resources, such as Cloud Services and VMs, to the same virtual network. The resources can connect to each other through private IP addresses, even if they're in different subnets. Azure provides default routing between subnets, virtual networks, and on-premises networks, so you don't have to configure and manage routes.

- **Virtual network connectivity**: You can connect virtual networks to each other. Resources that are connected to any virtual network can then communicate with any resource on any other virtual network.

- **On-premises connectivity**: You can connect virtual networks to on-premises networks through private network connections between your network and Azure, or through a site-to-site virtual private network (VPN) connection over the internet.

- **Traffic filtering**: You can filter network traffic (inbound and outbound) for virtual machines and Cloud Services by source IP address and port, destination IP address and port, and protocol.

- **Routing**: You can optionally override default Azure routing by configuring your own routes, or by using BGP routes through a network gateway.

#### Network access controls

[Network security groups](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg) (NSGs) are like a firewall and provide rules for how a resource can "talk" over the network. They provide control over how a subnet (or virtual machine) can connect to the internet or other subnets in the same virtual network.

A network security group contains a list of security rules that allow or deny network traffic to resources connected to Azure virtual networks. NSGs can be associated with subnets, individual VMs (classic), or individual network interfaces (NICs) attached to VMs (Resource Manager).

When an NSG is associated with a subnet, the rules apply to all resources connected to the subnet. You can further restrict traffic by associating an NSG to a VM or NIC.

## Security and compliance with organizational standards

Every business has different needs and will reap distinct benefits from cloud solutions. Still, customers of all kinds have the same basic concerns about moving to the cloud. What customers want from cloud providers is:

- **Secure our data**: IT leaders acknowledge that the cloud can provide increased data security and administrative control. But they're still concerned that migrating to the cloud will leave them more vulnerable to hackers than their current in-house solutions.

- **Keep our data private**: Cloud services raise unique privacy challenges. As companies look to the cloud to save on infrastructure costs and improve their flexibility, they also worry about losing control of where their data is stored, who is accessing it, and how it gets used.

- **Give us control**: Even as companies take advantage of the cloud to deploy more innovative solutions, they're concerned about losing control of their data. The recent disclosures of government agencies accessing customer data, through both legal and extralegal means, make some CIOs wary of storing their data in the cloud.

- **Promote transparency**: Business decision-makers understand the importance of security, privacy, and control. But they also want the ability to independently verify how their data is being stored, accessed, and secured.

- **Maintain compliance**: As companies expand their use of cloud technologies, the complexity and scope of standards and regulations continue to evolve. Companies need to know that their compliance standards will be met.

## Security configuration for monitoring, logging, and auditing

Azure subscribers can manage their cloud environments from multiple devices. These devices might include management workstations, developer PCs, and even privileged end-user devices that have task-specific permissions. 

In some cases, administrative functions are performed through web-based consoles such as the Azure portal. In other cases, there might be direct connections to Azure from on-premises systems over VPNs, Terminal Services, client application protocols, or (programmatically) the Azure Service Management API (SMAPI). Additionally, client endpoints can be either domain joined or isolated and unmanaged, like tablets or smartphones.

This variability can add significant risk to a cloud deployment. It can be hard to manage, track, and audit administrative actions. This variability can also introduce security threats through unregulated access to client endpoints that are used for managing cloud services. Using general or personal workstations for developing and managing infrastructure opens unpredictable threat vectors such as web browsing (for example, watering hole attacks) or email (for example, social engineering and phishing).

Monitoring, logging, and auditing provide a basis for tracking and understanding administrative activities. Auditing all actions in complete detail might not always be feasible because of the amount of data generated. But auditing the effectiveness of the management policies is a best practice.

Azure security governance from Azure Active Directory Domain Services (AD DS) GPOs can help you control all the administrators' Windows interfaces, such as file sharing. Include management workstations in monitoring, logging, and auditing processes. Track all administrator and developer access and usage.

### Azure Security Center

[Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-intro) provides a central view of the security status of resources in subscriptions. It provides recommendations that help prevent compromised resources. It can enable more detailed policies--for example, applying policies to specific resource groups that allow the enterprise to tailor their posture to the risk they're addressing.

![Azure Security Center](./media/governance-in-azure/security-governance-in-azure-fig7.png)

Security Center provides integrated security monitoring and policy management across your Azure subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions. After you enable [security policies](https://docs.microsoft.com/azure/security-center/security-center-policies) for a subscription's resources, Security Center analyzes the security of your resources to identify potential vulnerabilities. Information about your network configuration is available instantly.

Azure Security Center represents a combination of best practice analysis and security policy management for all resources within an Azure subscription. It enables security teams and risk officers to prevent, detect, and respond to security threats as it automatically collects and analyzes security data from your Azure resources, the network, and partner solutions like antimalware programs and firewalls.

In addition, Azure Security Center applies advanced analytics, including machine learning and behavioral analysis. It uses global threat intelligence from Microsoft products and services, the Microsoft Digital Crimes Unit (DCU), the Microsoft Security Response Center (MSRC), and external feeds. You can apply [security governance](https://www.credera.com/blog/credera-site/azure-governance-part-4-other-tools-in-the-toolbox/) broadly at the subscription level. Or, you can narrow it down to specific requirements and apply them to individual resources through policy definition.

Finally, Azure Security Center analyzes resource security health based on those policies and uses this information to provide insightful dashboards and alerting for events such as malware detection or malicious IP connection attempts. For more information about how to apply recommendations, see [Implementing security recommendations in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-recommendations).

Azure Security Center monitors the following Azure resources:

- Virtual machines (VMs) (including cloud services)

- Virtual networks

- SQL databases

- Partner solutions integrated with your Azure subscription, such as a web application firewall on VMs and on the [App Service Environment](https://docs.microsoft.com/azure/app-service/app-service-app-service-environments-readme)

When you first access Security Center, data collection is enabled on all virtual machines in your subscription. We recommend that you keep data collection enabled, but you can [disable it](https://docs.microsoft.com/azure/security-center/security-center-faq) in the Security Center policy.

### Log Analytics

The Azure Log Analytics software development and service team's information security and [governance program](https://github.com/Microsoft/azure-docs/blob/master/articles/log-analytics/log-analytics-security.md) supports its business requirements. It adheres to laws and regulations as described at [Microsoft Azure Trust Center](https://azure.microsoft.com/support/trust-center/) and [Microsoft Trust Center Compliance](https://www.microsoft.com/TrustCenter/Compliance/default.aspx). How Log Analytics establishes security requirements, identifies security controls, and manages and monitors risks is also described there. Annually, the team reviews policies, standards, procedures, and guidelines.

Each Log Analytics development team member receives formal application security training. A version control system helps protect each software project in development.

Microsoft has a security and compliance team that oversees and assesses all services in Microsoft. Information security officers make up the team, and they're not associated with the engineering departments that develop Log Analytics. The security officers have their own management chain. They conduct independent assessments of products and services to help ensure security and compliance.

The core functionality of Log Analytics is provided by a set of services that run in Azure. Each service provides a specific management function, and you can combine services to achieve different management scenarios.

![Azure services for management](./media/governance-in-azure/security-governance-in-azure-fig9.JPG)

These management services were designed in the cloud. They're entirely hosted in Azure, so they don't involve deploying and managing on-premises resources. Configuration is minimal, and you can be up and running in a matter of minutes.

Put an agent on any Windows or Linux computer in your datacenter, and it will send data to Log Analytics. There, it can be analyzed along with all other data collected from cloud or on-premises services. Use Azure Backup and Azure Site Recovery to take advantage of the cloud for backup and high availability for on-premises resources.

![Management services on the Azure dashboard](./media/governance-in-azure/security-governance-in-azure-fig8.png)

Runbooks in the cloud can't typically access your on-premises resources, but you can install an agent on one or more computers that will host runbooks in your datacenter. When you start a runbook, you specify whether you want it to run in the cloud or on a local worker.

Different solutions are available from Microsoft and from partners that you can add to your Azure subscription to increase the value of your investment in Log Analytics. For example, Azure offers [management solutions](https://docs.microsoft.com/azure/operations-management-suite/operations-management-suite-solutions)--prepackaged sets of logic that implement a management scenario by using one or more management services.

![Gallery of management solutions in Azure](./media/governance-in-azure/security-governance-in-azure-fig10.png)

As a partner, you can create your own solutions to support your applications and services and provide them to users through the Azure Marketplace or Quickstart templates.

## Performance alerting and monitoring

### Alerting

Alerts are a method of monitoring Azure resource metrics, events, or logs. They notify you when a condition that you've specified is met.

Alerts are available across services, including:

- **Azure Application Insights**: Enables web test and metric alerts. For more information, see [Set alerts in Application Insights](https://docs.microsoft.com/azure/application-insights/app-insights-alerts) and [Monitor availability and responsiveness of any website](https://docs.microsoft.com/azure/application-insights/app-insights-monitor-web-app-availability).

- **Log Analytics**: Enables the routing of activity and diagnostic logs to Log Analytics. It allows metric, log, and other alert types. For more information, see [Alerts in Log Analytics](https://docs.microsoft.com/azure/log-analytics/log-analytics-alerts).

- **Azure Monitor**: Enables alerts based on both metric values and activity log events. You can use the [Azure Monitor REST API](https://msdn.microsoft.com/library/dn931943.aspx) to manage alerts. For more information, see [Using the Azure portal, PowerShell, or the command-line interface to create alerts](https://docs.microsoft.com/azure/monitoring-and-diagnostics/insights-alerts-portal).

### Monitoring

Performance problems in your cloud app can affect your business. With multiple interconnected components and frequent releases, degradations can happen at any time. And if you're developing an app, your users usually discover problems that you didn't find in testing. You should know about these problems immediately, and have tools for diagnosing and fixing them.

There's a range of tools for monitoring Azure applications and services. Some of their features overlap. This is partly due to the blurring between development and operation of an application.

Here are the principal tools:

- **Azure Monitor** is a basic tool for monitoring services running on Azure. It gives you infrastructure-level data about the throughput of a service and the surrounding environment. If you're managing all your apps in Azure and deciding whether to scale up or down resources, Azure Monitor can help you start.

- **Application Insights** can be used for development and as a production monitoring solution. It works by installing a package in your app, so it gives you a more internal view of what's going on. Its data includes response times of dependencies, exception traces, debugging snapshots, and execution profiles. It provides tools for analyzing all this telemetry both to help you debug an app and to help you understand what users are doing with it. You can tell whether a spike in response times is due to something in an app or some external resourcing issue. If you use Visual Studio and the app is at fault, you go right to the problem line of code so you can fix it.

- **Log Analytics** is for those who need to tune performance and plan maintenance on applications running in production. It collects and aggregates data from many sources, with a delay of 10 to 15 minutes. It provides a holistic IT management solution for Azure, on-premises, and third-party cloud-based infrastructure (such as Amazon Web Services). It provides tools to analyze data across sources, allows complex queries across all logs, and can proactively alert on specified conditions. You can even collect custom data in its central repository, and then query and visualize that data.

- **System Center Operations Manager** is for managing and monitoring large cloud installations. You might be already familiar with it as a management tool for on-premises Windows Server and Hyper-V based clouds, but it can also integrate with and manage Azure apps. Among other things, it can install Application Insights on existing live apps. If an app goes down, Operations Manager tells you in seconds.


## Next steps

- [Best practices for creating Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-template-best-practices)

- [Examples of implementing Azure subscription governance](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-subscription-examples)

- [Microsoft Azure Government](https://docs.microsoft.com/azure/azure-government/)
