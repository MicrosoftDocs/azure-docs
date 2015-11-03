<properties
	pageTitle="Contextual examples of best practices for implementing templates"
	description="Shows examples of Azure Resource Manager templates that illustrate best practices."
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
	ms.date="08/13/2015"
	ms.author="mmercuri"/>

# Contextual examples of best practices for implementing templates

This topic provides 7 contextual examples of how to implement your Azure Resoure Manager templates. For an overview of the principles 
illustrated in these examples, see [Best practices for designing Azure Resource Manager templates](best-practices-resource-manager-design-templates.md).

This topic is part of a larger whitepaper. To read the full paper, download [World Class ARM Templates Considerations and Proven Practices](http://download.microsoft.com/download/8/E/1/8E1DBEFA-CECE-4DC9-A813-93520A5D7CFE/World Class ARM Templates - Considerations and Proven Practices.pdf).

## Moving a capability-scoped template into an end-to-end solution-scoped template

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

## Creating an end-to-end solution-scoped template with multiple capability-scoped templates

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

## Creating an end-to-end solution-scoped template with partial on/off pattern

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

## Supporting distinct environments within a subscription

To effectively deliver services, many organizations have a set of scale, billing isolation, accountability isolation and geographic isolation needs that must 
be met.  When designing services for Azure, they would have historically used subscription partitioning in their approach to satisfy these needs.  

Resource Manager relaxes constraints on the number of resources of a given type that can be deployed within a subscription and also introduces resource groups, 
RBAC, and auditing. The combination of these can allow organizations to use resource groups for partitioning, allowing them to meet their requirements and 
reduce the amount, if any, of subscription partitioning they might have to do.  

This section looks at the requirements seen for these types of environments and provides guidance on how to deliver environments that satisfy them with ARM.  

### Isolation considerations

This section explores common customer drivers for environment, billing, and geographic isolation in more detail.

#### Environment isolation

Service owners have a desire to isolate their different environments.  Having each environment isolated allows teams the ability to have more fine-grained 
control over who can have access to the environments. While development environments may be more open in terms of who can access them, as the 
environment scope moves closer to production the number of users – be they human or system accounts used for automation – is reduced to aid in 
compliance and minimize overall risk.

#### Billing isolation – developing vs. running a service

To accurately reflect Cost of Goods Sold (COGS) and Operating Expenses (OpEx), business owners want to be able to break apart the cost of researching 
and building the service vs. running the services.  

A superset of environment isolation mentioned previously, the intent would be consolidation of development and test for individual and/or 
aggregated billing for the former while production would remain independent for the latter.

#### Billing isolation – adding transparency and accountability to service consumption costs

Billing isolation is also used to both gain transparency into costs related to platform consumption by specific teams and introducing appropriate 
levels of accountability.

While the cloud is elastic and allows for a pay-as-you-go model, this is less familiar to some developers coming from a non-cloud model where hardware 
is procured and owned. In the non-cloud model, there were physical limitations in terms of the number of “machines” that could be turned on and there 
were limited incentives to scale down or turn off resources when not in use.  Procurement of this dedicated hardware, in many cases, was not done by the 
developers that were utilizing it.

By isolating subscriptions and assigning accountability for those subscriptions to specific teams, service owners found this type of subscription 
partitioning beneficial in driving and enforcing desired behaviors.

#### Geography driven isolation – deployments specific to and governed by laws of a specific geography

In certain contexts, there will be requirements that services targeted for a specific geography will need to consider how they deploy to address 
compliance considerations.

While a service may be global in nature, deployments that reside within or provide service to certain geographies may be governed by operational 
staffing requirements. Specifically, having only individuals who are citizens of a specific country or country set and/or pass certain background screening 
processes operate those services.

Geographic isolation also provides benefits in terms of taking advantage of new platform services and capabilities. Some geographies, such as China, may 
have only a subset of the platform services available and/or have delayed deployment of platform services.  

Geographic isolation allows teams the ability to evolve their services to take advantage of new or enhanced platform services and capabilities where 
they are available.

### Compliance considerations

Services can be delivered across multiple geographies and to multiple verticals. These audiences often have sensitive data or processes contained within 
their applications and there are associated compliance regulations designed to both protect them and audit engagement with them.

#### Separation of roles and duties

Separation of roles and duties is a key requirement for internal services to be compliant with internal policies. Many commercial services also require 
this to remain in compliance with governments and industry regulatory guidelines.  Services need to limit access to services and their underlying resources 
to authorized roles under specific circumstances. Many services have built scaffolding to deliver two capabilities – RBAC and auditing.

#### Role-based access control (RBAC) use cases

In compliance scenarios, it is important to constrain access to certain resources.  

For example, when looking at sensitive data across multiple scenarios where compliance is relevant - health information, financial data, 
tax records, etc. -  it is important to limit the number of individuals who can access, view, or manipulate the data to just those who require 
access to do the business of the parent organization.

RBAC provides a distinct individual, system, or group with access to specific resources under identified conditions.

#### Auditing

In addition to constrained access provided by RBAC, organizations also need to audit resource access and interaction with resources.

### Implementing with Azure Resource Manager

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

#### Optimizing for density

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

## Delivering environments with additional customer policy constraints

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

## Securing resources from internal bad actors

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

## Enabling a "bring your own subscription" model

Corporate IT, System Integrators, and Cloud Services vendors may employ a "Bring Your Own Subscription" model with their customers.  Specifically, the 
organization provides a service to an end customer and utilizes that customer’s Azure subscription in some fashion.

There are multiple variants of this approach, each with slightly different requirements, as detailed below.

### Enabling 3rd party access for monitoring of resources within an account

An organization with a monitoring application may require read-only access to a customer’s subscription to retrieve data for use in that application. 
This would require read-only access for an ongoing period of time.  Access would need to be in the customer’s control, providing them the ability to 
terminate the access if the relationship with the provider of the monitoring service is severed.

#### Implementing with Azure Resource Manager

Details on implementing this are provided in significant detail in the “Developers Guide to Auth with the Azure Resource Manager API” which 
can be found [here](http://www.dushyantgill.com/blog/2015/05/23/developers-guide-to-auth-with-azure-resource-manager-api/). That document provides 
step-by-step implementation instructions as well as sample code.

### Enabling 3rd party access for one-time deployment of software

In another example, an organization may deploy and configure a version of their software in a customer’s account, requiring write access for the period of 
time for the deployment.

#### Implementing with Azure Resource Manager

This would follow a similar approach to the prior example.

Depending on the specific needs of the installation, the specific role assigned to the service principal should allow only the minimal level of access 
required to achieve the installation and then have that access be immediately revoked after completion of the installation.

### Enabling 3rd party access to use customer subscriptions for data storage

In another example, an organization may wish to run software in their own environment but use the customer’s account for storage. This places the customer 
in control of their data at all times and enables them to leverage other technologies on the platform, e.g. Azure Machine Learning or HDInsight, at their 
own discretion while not adding cost/billing overhead for the Enterprise IT, System Integrator, or CSV providing the capability. This requires ongoing access 
to the storage account for the organization, with the customer in control and having access to audit information for accesses to that information.

#### Implementing with Azure Resource Manager

This is implemented using the same pattern as the other examples. A service principal is provided access to the storage resource.  As this scenario required 
the role to have read and write access to the storage account, the built in Contributor role would be assigned to the service principal to achieve this level of access.

As this scenario involves both a first and a third party with a shared storage account, there will also be a desire to ensure that the storage account is 
not deleted accidentally.  For this aspect of the scenario, you would apply a resource lock to the storage account.

### Enabling service management by a 3rd party

In another example, an organization will want to deploy, monitor, and manage software in the customers subscription. There may be constraints on the customer 
in terms of changes they can (or more explicitly cannot) make to an environment where software deployed.

#### Implementing with Azure Resource Manager

This follows a supserset of the pattern identified at the start of this section. Specifically, a service principal used by a 3rd party is provided 
full access to the resources within the resource group.

In addition, as there are constraints on the customer, users or groups from the customer would be given rights appropriate to utilize the environment.  
This can be done via templates as identified earlier in this section.

Finally, there may be a desire to ensure that certain resources are not deleted accidentally.  If this is the case, resource locks should also be 
considered for resources which require such protection.

## Next steps

- To learn about creating templates, see [Authoring templates](resource-group-authoring-templates.md).
- For recommendations about how to handle security in Azure Resource Manager, see [Security considerations for Azure Resource Manager](best-practices-resource-manager-security.md).
- To learn about sharing state into and out of templates, see [Sharing state in Azure Resource Manager templates](best-practices-resource-manager-state.md)
