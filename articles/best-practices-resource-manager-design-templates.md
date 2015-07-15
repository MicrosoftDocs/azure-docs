<properties
	pageTitle="Considerations and Proven Practices for Designing Azure Resource Manager Templates"
	description="Show design patterns for Azure Resource Manager Templates"
	services="azure-resource-manager"
	documentationCenter=""
	authors="mmercuri"
	manager="georgem"
	editor="tysonn"/>

<tags
	ms.service="azure-resource-manager"
	ms.workload="multiple"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/13/2015"
	ms.author="mmercuri"/>

# Considerations and Proven Practices for Designing Azure Resource Manager Templates

In our work with enterprises, system integrator (SIs), cloud service vendor (CSVs), and open source software (OSS) project teams, it's often necessary to quickly 
deploy environments, workloads, or scale units. These deployments need to be supported, follow proven practices, and adhere to identified policies. Using a flexible 
approach based on Azure Resource Manager templates, you can deploy complex topologies quickly and consistently and then adapt these deployments easily as 
core offerings evolve or to accommodate variants for outlier scenarios or customers.

Templates combine the benefits of the underlying Azure Resource Manager with the adaptability and readability of JavaScript Object Notation (JSON). Using 
templates, you can:

- Deploy topologies and their workloads consistently.
- Manage all your resources in an application together using resource groups.
- Apply role-based access control (RBAC) to grant appropriate access to users, groups, and services.
- Use tagging associations to streamline tasks such as billing rollups.

This article provides details on consumption scenarios, architecture, and implementation patterns identified during our design sessions and real-world template 
implementations with Azure Customer Advisory Team (AzureCAT) customers. Far from academic, these are proven practices informed by the development of templates 
for 12 of the top Linux-based OSS technologies, including: Apache Kafka, Apache Spark, Cloudera, Couchbase, Hortonworks HDP, DataStax Enterprise powered by 
Apache Cassandra, Elasticsearch, Jenkins, MongoDB, Nagios, PostgreSQL, Redis, and Nagios. The majority of these templates were developed with a well-known vendor of 
a given distribution and influenced by the requirements of Microsoft’s enterprise and SI customers during recent projects.

This article shares these proven practices to help you architect world class ARM templates.  

## Common template consumption scenarios

In our work with customers, we have identified a number of Resource Manager template consumption experiences across enterprises, System Integrators (SI)s, and CSVs. 
This section provides a high-level overview of common scenarios and patterns for different customer types.

### Enterprises and System Integrators

Within large organizations, we commonly see two consumers of ARM templates: internal software development teams and corporate IT. The scenarios for the 
SIs we’ve worked with have mapped to those of Enterprises, so the same considerations apply.

#### Internal software development teams

If your team develops software to support your business, templates provide an easy way to quickly deploy technologies for use in business-specific solutions. 
You can also use templates to rapidly create training environments that enable team members to gain necessary skills.

You can use templates as-is or extend or compose them to accommodate your needs. Using tagging within templates, you can provide a billing summary with 
various views such as team, project, individual, and education.

Businesses often want software development teams to create a template for consistent deployment of a solution while also offering constraints so certain 
items within that environment remain fixed and can’t be overridden. For example, a bank might require a template to include RBAC so a programmer can’t revise a 
banking solution to send data to a personal storage account.

#### Corporate IT

Corporate IT organizations typically use templates for delivering cloud capacity and cloud-hosted capabilities.

##### Cloud capacity

A common way for corporate IT groups to provide cloud capacity for teams within their organization is with “t-shirt sizes”, which are standard offering sizes 
such as small, medium, and large. The t-shirt sized offerings can mix different resource types and quantities while providing a level of standardization that 
makes it possible to use templates. The templates deliver capacity in a consistent way that enforces corporate policies and uses tagging to provide 
chargeback to consuming organizations.

For example, you may need to provide development, test, or production environments within which the software development teams can deploy their solutions. 
The environment has a predefined network topology and elements which the software development teams cannot change, such as rules governing access to the public 
internet and packet inspection. You may also have organization-specific roles for these environments with distinct access rights for the environment.

##### Cloud-hosted capabilities

You can use templates to support cloud-hosted capabilities, including individual software packages or composite offerings that are offered to internal lines 
of business. An example of a composite offering would be analytics-as-a-service—analytics, visualization, and other technologies—delivered in an optimized, 
connected configuration on a predefined network topology.

Cloud-hosted capabilities are affected by the security and role considerations established by the cloud capacity offering on which they’re built as described above.
These capabilities are offered as is or as a managed service. For the latter, access-constrained roles are required to enable access into the environment for 
management purposes.

### Cloud service vendors

After talking to many CSVs, we have identified multiple approaches you can take to deploy services for your customers and associated requirements.

#### CSV-hosted offering

If you host your offering in your own Azure subscription, two hosting approaches are common: deploying a distinct deployment for every customer or deploying 
scale units that underpin a shared infrastructure used for all customers.

- **Distinct deployments for each customer.** Distinct deployments per customer require fixed topologies of different known configurations. These may have different 
virtual machine (VM) sizes, varying numbers of nodes, and different amounts of associated storage. Tagging of deployments is used for roll-up billing of each customer. 
RBAC may be enabled to allow customers access to aspects of their cloud environment.
- **Scale units in shared multi-tenant environments.** A template can represent a scale unit for multi-tenant environments. In this case, the same infrastructure 
is used to support all customers. The deployments represent a group of resources that deliver a level of capacity for the hosted offering, such as number of users 
and number of transactions. These scale units are increased or decreased as demand requires.

#### CSV offering injected into customer subscription

You may want to deploy your software into subscriptions owned by end customers. You can use templates to deploy distinct deployments into a customer’s Azure account.

These deployments use RBAC so you can update and manage the deployment within the customer’s account.

#### Azure Marketplace

If you want to advertise and sell your offerings through a marketplace, such as Azure Marketplace, you can develop templates to deliver distinct types of 
deployments that will run in a customer’s Azure account. This distinct deployments can be typically described as a t-shirt size (small, medium, large), 
product/audience type (community, developer, enterprise), or feature type (basic, high availability).  In some cases, these types will allow you to specify 
certain attributes of the deployment, such as VM type or number of disks.

### OSS projects

Within open source projects, Resource Manager templates enable a community to deploy a solution quickly using proven practices. You can store templates in a 
GitHub repository so the community can revise them over time. End users can then deploy these templates in their own Azure subscriptions.

## Key considerations

This section identifies the things you need to consider before designing your solution.

### Identifying the outside vs. inside of a VM

As you design your template, it’s helpful to look at the requirements in terms of what’s outside and inside of the virtual machines (VMs):

- Outside means the VMs and other resources of your deployment, such as the network topology, tagging, references to the certs/secrets, and role-based access control. 
All are part of your template.
- For the VM’s insides—that is, the installed software and overall desired state configuration—other mechanisms are used in whole or in part, such as VM extensions 
or scripts. These may be identified and executed by the template but aren’t in it.

Common examples of activities you would do “inside the box” include -  

- Install or remove server roles and features
- Install and configure software at the node or cluster level
- Deploy websites on a web server
- Deploy database schemas
- Manage registry or other types of configuration settings
- Manage files and directories
- Start, stop, and manage processes and services
- Manage local groups and user accounts
- Install and manage packages (.msi, .exe, yum, etc.)
- Manage environment variables
- Run native scripts (Windows PowerShell, bash, etc.)

#### Desired State Configuration (DSC)

Thinking about the internal state of your VMs beyond deployment, you’ll want to make sure this deployment doesn’t “drift” from the configuration that you have 
defined and checked into source control. This ensures your developers or operations staff don’t manually make ad-hoc changes to an environment that are not vetted, 
tested or recorded in source control. This is important, because the manual changes are not in source control, they are also not part of the standard deployment 
and will impact future automated deployments of the software.

Beyond your internal employees, desired state configuration is also important from a security perspective.  Hackers are regularly trying to compromise and exploit 
software systems. When successful, its common to install files and otherwise change the state of a compromised system. Using desired state configuration, you can 
identify deltas between the desired and actual state and restore a known configuration.

There are resource extensions for the most popular mechanisms for DSC - PowerShell DSC, Chef, and Puppet. Each of these can deploy the initial state of your VM and 
also be used to make sure the desired state is maintained.

### Common Template Scopes

In our experience, we’ve seen three key solution templates scopes emerge. These three scopes – capacity, capability, and end-to-end solution – are described in 
more detail below.

#### Capacity Scope

A capacity scope delivers a set of resources in a standard topology that is pre-configured to be in compliance with regulations and policies. The most common 
example is deploying a standard development environment in an Enterprise IT or SI scenario.

#### Capability Scope

A capability scope is focused on deploying and configuring a topology for a given technology. Common scenarios including technologies such as SQL Server, 
Cassandra, Hadoop, etc.

#### End-to-End Solution Scope

An End-to-End Solution Scope is targeted beyond a single capability, and instead focused on delivering an end to end solution comprised of multiple capabilities.  

A solution-scoped template scope manifests itself as a set of one or more capability scoped templates with solution specific resources, logic, and desired state.  
An example of a solution-scoped template is an end to end data pipeline solution template that might mix solution specific topology and state with 
multiple capability scoped solution templates such as Kafka, Storm, and Hadoop.

### Choosing free-form vs. known configurations

You might initially think a template should give consumers the utmost flexibility, but many considerations affect the choice of whether to use free-form 
configurations vs. known configurations. This section identifies the key customer requirements and technical considerations that shaped the approach shared in 
this document.

#### Free-form configurations

On the surface, free-form configurations sound ideal. They allow you to select a VM type and provide an arbitrary number of nodes and attached disks for those nodes—and 
do so as parameters to a template. When you look closely, though, and consider templates that will deploy multiple virtual machines of different sizes, additional 
considerations appear that make the choice less appropriate in a number of scenarios.

In the article [Virtual Machine and Cloud Service Sizes for Azure](http://msdn.microsoft.com/library/azure/dn641267.aspx) on the Azure website, the different VM 
types and available sizes are identified, and each of the number of durable disks (2, 4, 8, 16, or 32) that can be attached. Each attached disk provides 500 IOPS 
and multiples of these disks can be pooled for a multiplier of that number of IOPS. For example, 16 disks can be pooled to provide 8,000 IOPS. Pooling is done with 
configuration in the operating system, using Microsoft Windows Storage Spaces or redundant array of inexpensive disks (RAID) in Linux.

A free-form configuration enables the selection of a number of VM instances, a number of different VM types and sizes for those instances, a number of disks that 
can vary based on the VM type, and one or more scripts to configure the VM contents.

It is common that a deployment may have multiple types of nodes, such as master and data nodes, so this flexibility is often provided for every node type.

As you start to deploy clusters of any significance, you begin to work with multiples of all of these. If you were deploying a Hadoop cluster, for example, 
with 8 master nodes and 200 data nodes, and pooled 4 attached disks on each master node and pooled 16 attached disks per data node, you would have 208 VMs and 
3,232 disks to manage.

A storage account will throttle requests above its identified 20,000 transactions/second limit, so you should look at storage account partitioning and use 
calculations to determine the appropriate number of storage accounts to accommodate this topology. Given the multitude of combinations supported by the free-form 
approach, dynamic calculations are required to determine the appropriate partitioning. The Azure Resource Manager Template Language does not presently provide 
mathematical functions, so you must perform these calculations in code, generating a unique, hard-coded template with the appropriate details.

In enterprise IT and SI scenarios, someone must maintain the templates and provide support for the deployed topologies for one or more organizations. 
This additional overhead — different configurations and templates for each customer — is far from desirable.

You can use these templates to deploy environments in your customer’s Azure subscription, but both corporate IT teams and CSVs typically deploy them into their 
own subscriptions, using a chargeback function to bill their customers. In these scenarios, the goal is to deploy capacity for multiple customers across a pool 
of subscriptions and keep deployments densely populated into the subscriptions to minimize subscription sprawl—that is, more subscriptions to manage. With truly 
dynamic deployment sizes, achieving this type of density requires careful planning and additional development for scaffolding work on behalf of the organization.

In addition, you can’t create subscriptions via an API call but must do so manually through the portal. As the number of subscriptions increases, any resulting 
subscription sprawl requires human intervention—it can’t be automated. With so much variability in the sizes of deployments, you would have to pre-provision a 
number of subscriptions manually to ensure subscriptions are available.

Considering all these factors, a truly free-form configuration is less appealing than at first blush.

#### Known configurations—the t-shirt sizing approach

Rather than offer a template that provides total flexibility and countless variations, in our experience a common pattern is to provide the ability to select 
known configurations — in effect, standard t-shirt sizes such as sandbox, small, medium, and large. Other examples of t-shirt sizes are product offerings, 
such as community edition or enterprise edition.  In other cases, it may be workload specific configurations of a technology – such as map reduce or no sql.

Many enterprise IT organizations, OSS vendors, and SIs make their offerings available today in this way in on-premises, virtualized environments 
(enterprises) or as software-as-a-service (SaaS) offerings (CSVs and OSVs).

This approach provides good, known configurations of varying sizes that are preconfigured for customers. Without known configurations, end customers 
must determine cluster sizing on their own, factor in platform resource constraints, and do math to identify the resulting partitioning of storage accounts 
and other resources (due to cluster size and resource constraints). Known configurations enable customers to easily select the right t-shirt size—that is, 
a given deployment. In addition to making a better experience for the customer, a small number of known configurations is easier to support and can help you 
deliver a higher level of density.

A known configuration approach focused on t-shirt sizes may also have varying number of nodes within a size. For example, a small t-shirt size may be 
between 3 and 10 nodes.  The t-shirt size would be designed to accommodate up to 10 nodes and provide the consumer the ability to make free form selections up to 
the maximum size identified.  

A t-shirt size based on workload type, may be more free form in nature in terms of the number of nodes that can be deployed but will have workload distinct 
node size and configuration of the software on the node.

T-shirt sizes based on product offerings, such as community or Enterprise, may have distinct resource types and maximum number of nodes that can be deployed, 
typically tied to licensing considerations or feature availability across the different offerings.

You can also accommodate customers with unique variants using the JSON-based templates. When dealing with outliers, you can incorporate the appropriate planning 
and considerations for development, support, and costing.

## Template decomposition approach

Based on the customer template consumption scenarios, requirements identified at the start of this document, and our hands-on experience creating numerous templates, 
we identified a pattern for template decomposition.

### Capacity and Capability Scoped Solution Templates

Decomposition provides a modular approach to template development that supports reuse, extensibility, testing, and tooling. This section provides detail on how a 
decomposition approach can be applied to templates with a Capacity or Capability scope.

In this approach, a main template receives parameter values from a template consumer, then links to several types of templates and scripts downstream as 
shown below. Parameters, static variables, and generated variables are used to provide values in and out of the linked templates.

![Template parameters](./media/best-practices-resource-manager-design-templates/template-parameters.png)

**Parameters are passed to a main template then to linked templates**

This following sections focus on the types of templates and scripts that a single template would be decomposed into and examines approaches for passing state 
information among the templates. Each template and the script types in the image are described along with examples. For a contextual example, see 
"Putting it together: a sample implementation" later in this document.

#### Template metadata

Template metadata (the metadata.json file) contains key/value pairs that describe a template in JSON, which can be read by humans and software systems.

![Template metadata](./media/best-practices-resource-manager-design-templates/template-metadata.png)

**Template metadata is described in the metadata.json file**

Software agents can retrieve the metadata.json file and publish the information and a link to the template in a web page or directory. Elements 
include *itemDisplayName*, *description*, *summary*, *githubUsername*, and *dateUpdated*.

An example file is shown below in its entirety.

    {
        "itemDisplayName": "PostgreSQL 9.3 on Ubuntu VMs",
        "description": "This template creates a PostgreSQL streaming-replication between a master and one or more slave servers each with 2 striped data disks. The database servers are deployed into a private-only subnet with one publicly accessible jumpbox VM in a DMZ subnet with public IP.",
        "summary": "PostgreSQL stream-replication with multiple slave servers and a publicly accessible jumpbox VM",
        "githubUsername": "arsenvlad",
        "dateUpdated": "2015-04-24"
    }

### Main template

The main template (the azuredeploy.json file) is called by an end user and is the template through which a set of user-defined parameters are presented.

![Main template](./media/best-practices-resource-manager-design-templates/main-template.png)

**The main template receives parameters from a user**

The role of this template is to receive parameters from a user, use that information to populate a set of complex object variables, then execute the appropriate 
set of related templates using template linking.

One parameter that is provided is a known configuration type also known as the t-shirt size parameter because of its standardized values such as small, 
medium, or large. In practice you can use this parameter in multiple ways. For details, see "Known configuration resources template" later in this document.

Some resources are deployed regardless of the known configuration specified by a user parameter. These resources are provisioned using a single shared 
resource template and are shared by other templates, so the shared resource template is run first.

Some resources are deployed optionally regardless of the specified known configuration.

#### Shared resources template

This template delivers resources that are common across all known configurations. It contains the virtual network, availability sets, and other resources that 
are required regardless of the known configuration template that is deployed.

![Template resources](./media/best-practices-resource-manager-design-templates/template-resources.png)

**Shared resources template**

Resource names, such as the virtual network name, are based on the main template. You can specify them as a variable within that template or receive them as a 
parameter from the user, as required by your organization.

#### Optional resources template

The optional resources template contains resources that are programmatically deployed based on the value of a parameter or variable.

![Optional resources](./media/best-practices-resource-manager-design-templates/optional-resources.png)

**Optional resources template**

For example, you can use an optional resources template to configure a jumpbox that enables indirect access to a deployed environment from the public 
Internet. You would use a parameter or variable to identify whether the jumpbox should be enabled and the *concat* function to build the target name for the 
template, such as *jumpbox_enabled.json*. Template linking would use the resulting variable to install the jumpbox.

You can link the optional resources template from multiple places:

-	When applicable to every deployment, create a parameter-driven link from the shared resources template.
-	When applicable to select known configurations—for example, only install on large deployments—create a parameter-driven or variable-driven link from the 
known configuration template.

Whether a given resource is optional may not be driven by the template consumer but instead by the template provider. For example, you may need to satisfy a 
particular product requirement or product add-on (common for CSVs) or to enforce policies (common for SIs and enterprise IT groups). In these cases, you can use a 
variable to identify whether the resource should be deployed.

#### Known configuration resources template

In the main template, a parameter can be exposed to allow the template consumer to specify a desired known configuration to deploy. In many cases, this known 
configuration uses a t-shirt size approach with a set of fixed configuration sizes such as sandbox, small, medium, and large.

![Known configuration resources](./media/best-practices-resource-manager-design-templates/known-config.png)

**Known configuration resources template**

The t-shirt size approach is commonly used, but the parameters can represent any set of known configurations. For example, you can specify a set of environments 
for an enterprise application such as Development, Test, and Product. Or you could use it for a cloud service to represent different scale units, product versions, 
or product configurations such as Community, Developer, or Enterprise.

As with the shared resource template, variables are passed to the known configurations template from either:

-	An end user—that is, the parameters sent to the main template.
-	An organization—that is, the variables in the main template that represent internal requirements or policies.

#### Member resources template

Within a known configuration, one or more member node types are often included. For example, with Hadoop you would have master nodes and data nodes. 
If you are installing MongoDB, you would have data nodes and an arbiter. If you are deploying DataStax, you would have data nodes as well as a VM 
with OpsCenter installed.

![Members resources](./media/best-practices-resource-manager-design-templates/member-resources.png)

**Member resources template**

Each type of nodes can have different sizes of VMs, numbers of attached disks, scripts to install and set up the nodes, port configurations for the VM(s), 
number of instances, and other details. So each node type gets its own member resource template, which contains the details for deploying and configuring an 
infrastructure as well as executing scripts to deploy and configure software within the VM.

For VMs, typically two types of scripts are used, widely reusable and custom scripts.

#### Widely reusable scripts

Widely reusable scripts can be used across multiple types of templates. One of the better examples of these widely reusable scripts sets up RAID on Linux to 
pool disks and gain a greater number of IOPS. Regardless of the software being installed in the VM, this script provides reuse of proven practices for common scenarios.

![Reusable scripts](./media/best-practices-resource-manager-design-templates/reusable-scripts.png)

**Member resources templates can call widely reusable scripts**

#### Custom scripts

Templates commonly call one or more scripts that install and configure software within VMs. A common pattern is seen with large topologies where multiple 
instances of one or more member types are deployed. An installation script is initiated for every VM that can be run in parallel, followed by a setup script 
that is called after all VMs (or all VMs of a given member type) are deployed.

![Custom scripts](./media/best-practices-resource-manager-design-templates/custom-scripts.png)

**Member resources templates can call scripts for a specific purpose such as VM configuration**

### Capability Scoped Solution Template Example - Redis

To show how an implementation might work, let’s look at a practical example of building a template that will facilitate the deployment and configuration of 
Redis in standard t-shirt sizes.  

For the deployment, there will be set of shared resources (virtual network, storage account, availability sets) and an optional resource (jumpbox). There are 
multiple known configurations represented as t-shirt sizes (small, medium, large) but each with a single node type. There are also two purpose specific scripts 
(installation, configuration).

#### Creating the Template Files

You would create a Main Template named azuredeploy.json.

You create Shared Resources Template named shared-resources.json

You create an Optional Resource Template to enable the deployment of a jumpbox, named jumpbox_enabled.json

Redis will use just a single node type, so you’ll create a single Member Resource Template named node-resources.json.

With Redis, you’ll want to install each individual node and then, once all nodes are installed you’ll want to set up the cluster.  You have scripts to 
accommodate both of these, redis-cluster-install.sh and redis-cluster-setup.sh.

#### Linking the Templates

Using template linking, the main template links out to the shared resources template, which establishes the virtual network.

Logic is added within the main template to enable consumers of the template to specify if a jumpbox should be deployed. An *enabled* value for the *EnableJumpbox* 
parameter indicates that the customer wants to deploy a jumpbox. When this value is provided, the template concatenates *_enabled* as a suffix to a base template 
name for the jumpbox capability.

The main template applies the *large* parameter value as a suffix to a base template name for t-shirt sizes, and then uses that value in a template link out to 
*technology_on_os_large.json*.

The topology would resemble this illustration.

![Redis template](./media/best-practices-resource-manager-design-templates/redis-template.png)

**Template structure for a Redis template**

#### Configuring State

For the nodes in the cluster, there are two steps to configuring the state, both represented by Purpose Specific Scripts.  “redis-cluster-install.sh” will 
perform an installation of Redis and “redis-cluster-setup.sh” will set up the cluster.

#### Supporting Different Size Deployments

Inside of variables, the t-shirt size template specifies the number of nodes of each type to deploy for the specified size (*large*). It then deploys that number of 
VM instances using resource loops, providing unique names to resources by appending a node name with a numeric sequence number from *copyIndex()*. It does this for 
both hot and warm zone VMs, as defined in the t-shirt name template

### Decomposition and End-to-End Solution Scoped Templates

A solution template with an end-to-end solution scope is focused on delivering an end-to-end solution.  This will typically be a composition of multiple capability 
scoped templates with additional resources, logic and state.

As highlighted in the image below, the same model used for capability scoped templates is extended for templates with an End-to-End Solution Scope.

A Shared Resources Template and Optional Resources Templates serve the same function as in the capacity and capability scoped template approaches, but are 
scoped for the end to end solution.

As end to end solution scoped templates also can typically have t-shirt sizes, the Known Configuration Resources template reflects what is required for a 
given known configuration of the solution.

The Known Configuration Resources Template will link to one or more capability scoped solution templates that are relevant to the end to end solution as well 
as the Member Resource Templates that are required for the end to end solution.

As the t-shirt size of the solution may be different than that of individual capability scoped template, variables within the Known Configuration Resources 
Template are used to provide the appropriate values for downstream capability scoped solution templates to deploy the appropriate t-shirt size.

![End-to-end](./media/best-practices-resource-manager-design-templates/end-to-end.png)

**The model used for capacity or capability scoped solution templates can be readily extended for end to end solution template scopes**

### Preparing Templates for the Marketplace

The above approach readily accommodates scenarios where Enterprises, SIs, and CSVs want to either deploy the templates themselves or enable their customers to 
deploy on their own.

Another desired scenario is deploying a template via the marketplace.  This decomposition approach will work for the marketplace as well, with some minor changes.

As mentioned previously, templates can be used to offer distinct deployment types for sale in the marketplace. Distinct deployment types may be 
t-shirt sizes (small, medium, large) , product/audience type (community, developer, enterprise), or feature type (basic, high availability).

As shown below, the existing end to end solution or capability scoped templates can be readily utilized to list the different known configurations in the marketplace.

The parameters to the main template are first modified to remove the inbound parameter named tshirtSize.

While the distinct deployment types map to the Known Configuration Resources Template, they also need the common resources and configuration found in 
the Shared Resources Template and potentially those in Optional Resource Templates.

If you want to publish your template to the marketplace, you simply establish distinct copies of your Main template that replaces the previously available 
inbound parameter of tshirtSize to a variable embedded within the template.

![Marketplace](./media/best-practices-resource-manager-design-templates/marketplace.png)

**Adapting a solution scoped template for the marketplace**

## Contextual Examples

A number of concepts, patterns, and features of ARM and ARM Templates have been shared in this document.  To help you better understand how these should be 
utilized together, this section provides a set of 7 contextual samples.

### Moving a Capability Scoped Template into an End-to-End Solution Scoped Template

The pattern for developing a capability scoped template was shared earlier.  One question that you may ask yourself is if there are different considerations 
when using this capability scoped template by itself or as part of an end to end scoped solution template.  

For example, if there was a technology focused template that deployed SQL Server as a capability, what would be the considerations, if any, from using that 
independently or as part of a broader end to end solution scoped template that may use that SQL Server to support a web application.

When looking at this scenario, it’s relevant to look at the number of resources likely involved. For a robust implementation, your capability scoped template won’t 
just be a storage account and a single VM with one installation of SQL Server. A robust capability scoped template will deploy multiple VMs with SQL Server deployed 
for high availability. For some capabilities, such as Analysis Services, your topology will also have likely have Active Directory deployed with it as well.

Two key considerations for this scenario include the lifecycle of how SQL Server will be used and the RBAC that you wish to apply to it.  Specifically, will 
the SQL Server be updated and deleted with the rest of the solution or will it’s lifecycle vary from the solution or other parts of the solution.  If the 
lifecycle will vary, you will want to consider placing it in another resource group.  

Another consideration is how you would like to apply RBAC to your SQL Server capability scoped solution template.  Based on how you want to apply RBAC within 
your topology, you may opt for different resource groups based to align with those specifics.  You can apply RBAC at the Resource Level, but given the number of 
resources for the SQL Server capability scoped solution template, a distinct resource group with RBAC applied to it should be a consideration.

Another consideration is an evaluation of the SQL Server capability scoped solution template to identify if it currently creates certain resources itself vs. 
allowing you to “Bring Your Own Resources.”  In a “Bring Your Own Resources” (BYOR) model, the capability scoped solution template would allow your template to 
re-use previously existing resources, with the typical examples being a storage account, virtual network or an availability set. If a BYOR approach doesn’t exist 
in your capability scoped template, you can alter it using the approach defined earlier in this document for optional resource templates.  In this case, your 
end-to-end solution scoped template would have a shared resource template with these common resources, and the capability scoped template would be extended to 
support these resources as optional.  This creates a better capability scoped solution template as it now can be used independently or part of a composition.

When assessing whether the storage account should be passed in from the end to end solution scoped template, RBAC should also be re-evaluated. Specifically, 
do you need to ensure that RBAC be applied to this specific resource?  If so, if the resource is expected to have this applied when it is passed in, a level of 
trust is being placed not just in the Solution Block but any user who wishes to optionally provide this to the capability scoped template when used 
independently.  If RBAC is critical, then you should consider on whether to make this an optional template within the capability scoped solution template 
or to require it’s creation with the required RBAC from within the capability scoped solution template.

If a decision is made to place these in different resource groups, you can also use Resource Links to define the relationships between the resources – even 
when the resources span resource groups.

### Creating an End to End Solution Scoped Template with Multiple Capability Scoped Templates

This is largely a a superset of the previous example. In this scenario, an organization has multiple capability scoped solution templates for a set of 
data technologies such as Kafka, Apache Hadoop, Apache Spark, and Apache Storm that they wish to pull together in a single solution block.  The resulting 
composition will use those capability scoped solution templates as well as a shared storage and virtual network with specific subnet assignments.

Outside of the specific capability scoped templates required, additional resources will be necessary for the solution, even if just scripts to 
stitch the capability scoped templates together and configure them.

In this case, it’s identified that there’s a shared virtual network and a shared storage account.  To accommodate this, you should add these to a shared 
resources template in your end to end solution scoped template and ensure that a “Bring Your Own Resource” approach is supported in the capability scoped templates. 
If it is not, you can modify your capability scoped templates to accommodate this, as described in the previous example.

For the additional resources that you will be adding, you will follow a superset of the pattern used for creating an individual capability scoped template. 
In this case, you will add a Shared Resources Template, Optional Resources Template(s), Member Node template(s), and desired state configuration (scripts, 
Chef, Puppet, Powershell DSC) for the new resources.  Where there are dependencies, you’ll optimize to use implicit references vs. dependsOn where possible 
to eliminate the potential for stray dependencies which may impact the parallelism (and speed) of your deployment. You’ll also consider the lifecycle of 
these resources, the RBAC considerations, and dependencies to determine if they should be placed in different resource groups.  

When adding shared resources, such as the shared storage account, you should also evaluate if a resource lock is required for it, as this can help avoid 
accidental deletions.

When adding new resources, you should also examine if any of the resources being added to the end to end solution scoped template could be isolated out 
as capability scoped templates themselves.  If so, this should be strongly considered as to promote further decomposition which can provide benefits for 
both re-use and testing.

When integrating in your solution blocks, your next considerations are, as identified in the previous example, to identify if the lifecycle for the individual 
capability scoped solution templates are different from that of the broader solution and if any RBAC requirements would necessitate separating these into 
separate resource groups.

Finally, you will want to consider if you would like to be able to define and query links between the resources. If you do, employing resource links will 
enable you to do this across your end to end scoped solution template, even when spanning multiple resource groups.

### Creating an End-to-End Solution Scoped Template with Partial On/Off Pattern

This scenario is a variant of the previous one.  In this case, the customer extracts data from an on premise system at fixed intervals over the course of a day.  
They have a data pipeline to process this incoming data and a relational data store where the data is always available for queries.  As the cloud is a 
pay-as-you-go model, the customer would like to have the data pipeline operational only during those intervals when data is presented for processing.

As part of their data pipeline, they have a SQL Server, which receives the processed data and makes it available for querying. The customer has indicated that 
while they would like to turn the ingestion and processing pieces of the pipeline on and off on a fixed schedule, they would like to always have the SQL Server available.

In this scenario, there are what appear to be explicit differences in lifecycle and potentially some additional considerations the customer hasn’t 
raised but should be evaluated.

As described, the SQL Server deployment will be kept alive while other resources will be created and deleted.  They will be deployed together initially 
but then other members of the template will be destroyed and created on a different lifecycle.  These can be isolated into different resource groups or be 
left in the same resource group with resource locking applied to the SQL Server resources.  As SQL Server specifically is, as described in the earlier examples, 
likely represented as a larger set of resources, separating it out into it’s own resource group would be appropriate.

The other consideration is that while the customer has said that they want the rest of the data pipeline
turned on and off on a schedule, they may not be considering the inconsist behavior of reporting systems.  Scheduled delivery of data from third parties is not 
always precise – connectivity may be unavailable for a period of time, clocks on local or cloud based servers may drift, time changes may or may not occur as 
expected, etc. It should be evaluated if your ingestion mechanism should be used in an on/off pattern as well, and if so, if the lifecycle for that is greater 
than that of the processing components.

If you’re using a managed service such as Azure Data Factory or Event Hub, this is less of an issue as their operating models and associated billing approach 
make them readily available to ingest your data and place it in storage.  If you’re using another technology, such as Kafka, that you’ve deployed to a virtual 
machine, you may want to look at the lifecycle for how you make that and the associated storage account(s) required for ingestion available.  This may result in 
the ingestion and processing resources being placed in a different resource groups based on their lifecycle.

### Supporting Distinct Environments within a Subscription

To effectively deliver services, many organizations have a set of scale, billing isolation, accountability isolation and geographic isolation needs that must 
be met.  When designing services for Azure, they would have historically used subscription partitioning in their approach to satisfy these needs.  

Resource Manager relaxes constraints on the number of resources of a given type that can be deployed within a subscription and also introduces resource groups, 
RBAC, and auditing. The combination of these can allow organizations to use resource groups for partitioning, allowing them to meet their requirements and 
reduce the amount, if any, of subscription partitioning they might have to do.  

This section looks at the requirements seen for these types of environments and provides guidance on how to deliver environments that satisfy them with ARM.  

#### Isolation Considerations

This section explores common customer drivers for environment, billing, and geographic isolation in more detail.

##### Environment Isolation

Service owners have a desire to isolate their different environments.  Having each environment isolated allows teams the ability to have more fine-grained 
control over who can have access to the environments. While development environments may be more open in terms of who can access them, as the 
environment scope moves closer to production the number of users – be they human or system accounts used for automation – is reduced to aid in 
compliance and minimize overall risk.

##### Billing Isolation – Developing vs. Running a Service

To accurately reflect Cost of Goods Sold (COGS) and Operating Expenses (OpEx), business owners want to be able to break apart the cost of researching 
and building the service vs. running the services.  

A superset of environment isolation mentioned previously, the intent would be consolidation of development and test for individual and/or 
aggregated billing for the former while production would remain independent for the latter.

##### Billing Isolation – Adding Transparency and Accountability to Service Consumption Costs

Billing isolation is also used to both gain transparency into costs related to platform consumption by specific teams and introducing appropriate 
levels of accountability.

While the cloud is elastic and allows for a pay-as-you-go model, this is less familiar to some developers coming from a non-cloud model where hardware 
is procured and owned. In the non-cloud model, there were physical limitations in terms of the number of “machines” that could be turned on and there 
were limited incentives to scale down or turn off resources when not in use.  Procurement of this dedicated hardware, in many cases, was not done by the 
developers that were utilizing it.

By isolating subscriptions and assigning accountability for those subscriptions to specific teams, service owners found this type of subscription 
partitioning beneficial in driving and enforcing desired behaviors.

##### Geography Driven Isolation – Deployments Specific to and Governed by Laws of a Specific Geography

In certain contexts, there will be requirements that services targeted for a specific geography will need to consider how they deploy to address 
compliance considerations.

While a service may be global in nature, deployments that reside within or provide service to certain geographies may be governed by operational 
staffing requirements. Specifically, having only individuals who are citizens of a specific country or country set and/or pass certain background screening 
processes operate those services.

Geographic isolation also provides benefits in terms of taking advantage of new platform services and capabilities. Some geographies, such as China, may 
have only a subset of the platform services available and/or have delayed deployment of platform services.  

Geographic isolation allows teams the ability to evolve their services to take advantage of new or enhanced platform services and capabilities where 
they are available.

#### Compliance Considerations

Services can be delivered across multiple geographies and to multiple verticals. These audiences often have sensitive data or processes contained within 
their applications and there are associated compliance regulations designed to both protect them and audit engagement with them.

##### Separation of Roles and Duties

Separation of roles and duties is a key requirement for internal services to be compliant with internal policies. Many commercial services also require 
this to remain in compliance with governments and industry regulatory guidelines.  Services need to limit access to services and their underlying resources 
to authorized roles under specific circumstances. Many services have built scaffolding to deliver two capabilities – RBAC and auditing.

##### Role Base Access Control (RBAC) Use Cases

In compliance scenarios, it is important to constrain access to certain resources.  

For example, when looking at sensitive data across multiple scenarios where compliance is relevant - health information, financial data, 
tax records, etc. -  it is important to limit the number of individuals who can access, view, or manipulate the data to just those who require 
access to do the business of the parent organization.

RBAC provides a distinct individual, system, or group with access to specific resources under identified conditions.

##### Auditing

In addition to constrained access provided by RBAC, organizations also need to audit resource access and interaction with resources.

#### Implementing with Azure Resource Manager

Previously, organizations would have used subscription partitioning to accomplish these goals. While possible, this was not ideal.  As the creation of 
a subscription is effectively a commerce activity, the Service Management API did not expose a mechanism by which to create or delete new subscriptions 
automatically and subscriptions needed to be created manually. The resulting number of subscriptions could grow significantly – for very large services 
such as Microsoft’s own commercial services – that number could span into over one thousand subscriptions.  This would often result in the creation of 
custom scaffolding to create and manage subscriptions for an organization.

With Resource Manager, deploying multiple environments within a subscription is much more straightforward.  It relaxes the previous fixed caps on resources 
that was in the previous model, which greatly reduces the need to partition due to resource constraints.

Environments can be placed in resource groups, which can have specific RBAC applied to them, enabling you to deliver environment isolation.  In scenarios 
where geographic isolation is required, this can also be accomplished utilizing resource groups. As resource groups can span geographies, specific isolation 
for one or more geographies can be achieved.

You can apply tags to resources and resource groups which can be used in billing roll ups and summarized views to provide billing isolation.  You can use tags 
to define the environment type (research, education, development, test, production), accountable organization or individual (“HR”, “Finance”, “John Smith”, “Jane Jones”).

The auditing requirement is delivered as part of the underlying Azure Resource Manager’s set of out of the box capabilities and can be viewed in a central location.

End customers would have accounts registered in Azure Active Directory that would be used for authentication and for role based access control to the 
environment and resources.

##### Optimizing for Density

While the resource limits are relaxed in Azure Resource Manager, there will still be limits. Beyond creating the environments themselves, you should also 
look at achieving density of environments within subscriptions as well.  Delivering an environment is delivering capacity to an indivual or organization and 
you should evaluate what relevant “t-shirt size(s)” you will want to deliver.  Specifically, identify the variants between small, medium, large, and extra 
larger customers in terms of the resources required.  

You may choose to use different subscriptions for different t-shirt sizes to achieve greater density. For example, you may be able to accommodate 1000 small 
t-shirt size environments, 500 medium size deployments, 100 large deployments, and 10 extra-large deployments in a given subscription.  As there’s no billed 
cost to have multiple subscriptions, you may want to isolate the different sizes into different subscriptions to provide maximum density.  This can be done 
while keeping the number of subscriptions relatively modest and easy to manage.

One key consideration you should have is identifying if you would be willing to allow a customer to increase or change their t-shirt size and, if so, 
how you would want to accommodate it.  

One approach is to allow a customer to acquire additional capacity within their existing resource group.  This can be easily accommodated technically, 
but it has implications on density.  Instead of crisply defined sizes for all customers, this introduces a level of variability that adds more overhead 
for optimizing for density.  If every small size environment is a size X, you can easily pre-calculator how many small size environments to place in a 
subscription for optimal density.  When allowing customers to customize the environment, the result is an unpredictable number of variants and quantities 
of environments that could be X, X+1, X+2, etc.  With this level of variability, you would achieve less density as you would need to set aside capacity 
within a subscription to accommodate these variances.  

While possible, this is less than ideal as a general approach, as it achieves less density and requires more overhead to manage. For larger-sized 
environments, this may be a more viable option.  As fewer of these large and extra large environments would be placed in a subscription, you may choose 
to place fewer of these in a subscription to accommodate growth.

Another approach is that the customers current size environment is deleted and a new environment of a different size is created.  While not appropriate for 
some scenarios, this works well for environments that are used temporarily such as development and test environments.

The next easiest approach here is to provide the customer the ability to acquire a larger size environment and then manage the migration to that environment 
on their own.  For example, a customer who had a SQL Server deployment in a small environment could purchase a medium environment and would be individually 
responsible for the transfer of data and custom state.

An alternate approach is to provide a managed service where this transition from one size to another is accommodated. This is obviously more complicated, but 
based on the workload(s) and customer(s) this may be something your organization would be willing to accommodate.

### Delivering Environments with Additional Customer Policy Constraints

Some organizations have additional requirements and policies for the environments that they deploy. Specifically, they have policies that constrain the 
ports exposed externally and may have policies that require monitoring of inbound and outbound traffic to the environment.
For supportability and cost considerations, there may also be constraints on what resources an end customer can create, update or delete.
For the organization providing the environment, they will also typically require access to the subscription for support.

A superset of the previous scenario, this would require the addition of certain resources that would have additional constraints on who could and 
could not create resources of a given type.  

The ability for a user to create, update, or delete certain resources can be constrained using role based access control.  Examples would include an 
organization requiring a certain network VNET and potentially subnets which the end customer could not update or delete.

Resource locks can be implemented to establish that resources are read only or cannot be deleted. RBAC can be used to allow users or service principals 
to perform certain activities against a resource or resource group.

If the organization requires that certain traffic, e.g. traffic between tiers in the application, first go through an intermediary such as a virtual 
network appliance, user defined routes should be used.

A virtual appliance is nothing more than a VM that runs an application used to handle network traffic in some way, such as a firewall or a NAT device. 
A number of third parties provide virtual network appliances on Azure, and organizations can also bring their own.

A “bring your own” appliance approach allows an organization to re-use existing code that may be used in their on premise environments. This virtual 
appliance VM must be able to receive incoming traffic that is not addressed to itself. To allow a VM to receive traffic addressed to other destinations, 
you must enable IP Forwarding in the VM.  

As with prior examples, resource lifecycle and RBAC constraints should be reviewed and considered as part of your resource group strategy.

### Securing Resources from Internal Bad Actors

One concern for an organization may be protecting their resources and the templates that provision them from bad actors.  

One example of this could be a bank wishing to ensure that a rogue software developer or member of their IT staff don’t make modifications or 
extract key information that results in data going to a bad actor for criminal purposes.

A typical enterprise scenario is to have a small group of Trusted Operators who have access to critical secrets within the deployed workloads, 
with a broader group of dev/ops personnel who can create or update VM deployments.  

Azure Key Vault woud be used with ARM to orchestrate and store VM secrets and certificates.

A best practice is to maintain separate ARM templates for creation of vaults (which will contain the key material) and deployment of the VMs 
(with URI references the keys contained in the vaults).

Secrets stored in the Key Vault are under full RBAC control of a trusted operator.  If the trusted operator leaves the company or transfers within 
the company to a new group, he or she will no longer have access to the keys they created in the Vault.

The ARM templates for deployment only contain URI references to the secrets, which means the actual secrets are not in code, config or source code 
repositories. This mitigates opportunities for both phishing secrets and limiting the ability for bad actors to make changes.

As stated earlier in the document, there are no global Key Vaults. As Key Vaults are always regional, the secrets always have locality (and sovereignty) with the VMs.

An example implementation of this approach was provided in the Secrets and Certificates section found earlier in this document.

### Enabling a “Bring Your Own Subscription” Model

Corporate IT, System Integrators, and Cloud Services vendors may employ a “Bring Your Own Subscription” model with their customers.  Specifically, the 
organization provides a service to an end customer and utilizes that customer’s Azure subscription in some fashion.

There are multiple variants of this approach, each with slightly different requirements, as detailed below.

#### Enabling Third Party Access for Monitoring of Resources within an Account

An organization with a monitoring application may require read-only access to a customer’s subscription to retrieve data for use in that application. 
This would require read-only access for an ongoing period of time.  Access would need to be in the customer’s control, providing them the ability to 
terminate the access if the relationship with the provider of the monitoring service is severed.

##### Implementing with Azure Resource Manager

Details on implementing this are provided in significant detail in the “Developers Guide to Auth with the Azure Resource Manager API” which 
can be found [here](http://www.dushyantgill.com/blog/2015/05/23/developers-guide-to-auth-with-azure-resource-manager-api/). That document provides 
step-by-step implementation instructions as well as sample code.

#### Enabling 3rd Party Access for One Time Deployment of Software

In another example, an organization may deploy and configure a version of their software in a customer’s account, requiring write access for the period of 
time for the deployment.

##### Implementing with Azure Resource Manager

This would follow a similar approach to the prior example.

Depending on the specific needs of the installation, the specific role assigned to the service principal should allow only the minimal level of access 
required to achieve the installation and then have that access be immediately revoked after completion of the installation.

#### Enabling 3rd Party Access to Use Customer Subscriptions for Data Storage

In another example, an organization may wish to run software in their own environment but use the customer’s account for storage. This places the customer 
in control of their data at all times and enables them to leverage other technologies on the platform, e.g. Azure Machine Learning or HDInsight, at their 
own discretion while not adding cost/billing overhead for the Enterprise IT, System Integrator, or CSV providing the capability. This requires ongoing access 
to the storage account for the organization, with the customer in control and having access to audit information for accesses to that information.

##### Implementing with Azure Resource Manager

This is implemented using the same pattern as the other examples. A service principal is provided access to the storage resource.  As this scenario required 
the role to have read and write access to the storage account, the built in Contributor role would be assigned to the service principal to achieve this level of access.

As this scenario involves both a first and a third party with a shared storage account, there will also be a desire to ensure that the storage account is 
not deleted accidentally.  For this aspect of the scenario, you would apply a resource lock to the storage account.

#### Enabling Service Management by a 3rd Party

In another example, an organization will want to deploy, monitor, and manage software in the customers subscription. There may be constraints on the customer 
in terms of changes they can (or more explicitly cannot) make to an environment where software deployed.

##### Implementing with Azure Resource Manager

This follows a supserset of the pattern identified at the start of this section. Specifically, a service principal used by a 3rd party is provided 
full access to the resources within the resource group.

In addition, as there are constraints on the customer, users or groups from the customer would be given rights appropriate to utilize the environment.  
This can be done via templates as identified earlier in this section.

Finally, there may be a desire to ensure that certain resources are not deleted accidentally.  If this is the case, resource locks should also be 
considered for resources which require such protection.
