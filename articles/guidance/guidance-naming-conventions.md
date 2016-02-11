# Naming conventions

TODO - set naming scope for all resources, is it global to all of Azure,
scoped to a resource gruop, etc.

## Subscriptions

When naming Microsoft Azure subscriptions, verbose names make understanding the context
and purpose of each subscription clear by convention.  When working in an environment which
can contain a number of subscriptions, following a common and shared naming convention across
the company can greatly improve clarity.

One common recommended pattern for naming subscriptions follows the pattern

`<Company> <Department (optional)> <Product Line (optional)> <Environment>`

- Company, in most cases, would be the same for each subscription. However, some companies may have
child companies within the organizational structure. These companies may be managed by a central IT
group, in which case, they could be differentiated by having both the parent company name (*Contoso*)
and child company name (*North Wind*).

- Department is a name within the organization where a group of individuals work. This item within
the namespace as optional. This is because some companies may not need to drill into such detail due
to their size. You may wish to use a The company may want to use a different identifier,

- Product line is a specific name for a product or function that is performed from within the department.
As with the department namespace, this area is optional and can be swapped out as needed.

- Environment is the name that describes the deployment lifecycle of the applications or services,
such as Dev, Lab, or Prod.

| Company | Department | Product Line or Service | Environment | Full Name  |
----------| ---------- | ----------------------- | ----------- | ---------- |
| Contoso | SocialGaming | AwesomeService | Production | Contoso SocialGaming AwesomeService Production |
| Contoso | SocialGaming | AwesomeService | Dev | Contoso SocialGaming AwesomeService Dev |
| Contoso | IT | InternalApps | Production | Contoso IT InternalApps Production |
| Contoso | IT | InternalApps | Dev | Contoso IT InternalApps Dev |

## Resource Affixes

When creating certain resources, Microsoft Azure will use some defaults to simplify management of the resources
associated to these resources.  Although this will not present problems, it may be beneficial to identify types of resources that need an affix to identify that type. In addition, clearly specify whether the affix will be at the beginning of the name (prefix) or at the end (suffix).
For instance, here are two possible names for a service hosting a calculation engine:

- SvcCalculationEngine (prefix)
- CalculationEngineSvc (suffix)

Affixes can refer to different aspects that describe the particular resources. The following table
shows some examples typically used.

| Aspect | Example | Notes |
| ------ | ------- | ----- |
| Environment | dev, prod, qa | Identifies the environment for the resource |
| Location | uw (US West), ue (US East) | Identifies the region into which the resource is deployed |
| Instance | 01, 02 | For resources that have more than one named instance (web servers, etc). |
| Product or Service | service | Identifies the product, application or service that the resource supports |
| Role | sql, web, messaging | Identifies the role of the associated resource |

When developing a specific naming convention for your company or project(s), it is importantly to
choose a common set of affixes as well as their position (suffix or prefix).

## Azure Resource Manager (ARM) Tagging

TODO - what are the naming rules for ARM tags

## Virtual Machines

Especially in larger topologies, carefully naming virtual machines will greatly streamline identifying the
role and purpose of each machine, as well as enabling more predictable scripting.

> [AZURE.WARNING] Note that every virtual machine in Azure has both an Azure resource name, and an operating
> system host name.  
> If the resource name and host name are different, managing these VMs may be challenging
> (for example, if the virtual machine is created from a .vhd that already contains a 
> configured operating system with a hostname), and should be avoided.

- [Naming conventions for Windows Server VMs](https://support.microsoft.com/en-us/kb/188997)

TODO - recommendations on naming VMs.

## Virtual Networks and Subnets

TODO - what are the naming rules for VNet's and subnets

The next logical step is to create the virtual networks necessary to support the communications across
the virtual machines in the solution.

Cloud services provide a communication boundary among computers within that cloud service. These computers
can use IP Addresses or the Azure-provided DNS service to communicate with each other using the computer name.

Virtual networks also create a communication boundary, so that virtual machines within the same virtual
network can access other computers within the same virtual network, regardless of to which cloud service
they belong. Within the virtual network, this communication remains private, without the need for the communication to go through the public endpoints. This communication can occur via IP address, or by name, using a DNS service installed in the virtual network, or on premises, if the virtual machine is connected to the corporate network via a Site-to-Site connection. The Azure-provided DNS service will not aid in name resolution across cloud services, even if they belong to the same virtual network.

TODO

##	Storage accounts and storage entities

The choice of a name for any asset, service or entity in Microsoft Azure is an important choice because:

- It is difficult (though not impossible) to change that name at a later time.
- There are certain constraints and requirements that must be met when choosing a name.
- Good naming conventions can provide "at a glance" context and understanding to how and where a
service fits into the landscape or an application or larger service.

This table covers the naming requirements for each element of a storage account:

| Item | Length | Casing | Valid characters | Pattern | Example |
-------|--------|--------|------------------|---------|-----|
| Storage account name | 3-24	| Lower case | Alphanumeric | `<service short name>-<type>-<number>` | `awesomegame-data-001` |
| Blob name | 1-1024 | Case sensitive | Any URL char | `<variable based on blob usage>` | `<variable based on blob usage>` |
| Container name | 3-63 |	Lower case | Alphanumeric and dash | `<context>` | `logs` |
| Queue name | 3-63 | Lower case | Alphanumeric and dash | `<service short name>-<context>-<num>` | `awesomeservice-messages-001` |
| Table name | 3-63 |Case insensitive | Alphanumeric | `<service short name>-<context>` | `awesomeservice-logs` |
| File name | 3-63 | Lower case | Alphanumeric | `<variable based on blob usage>` | `<variable based on blob usage>` |

It is also possible to configure a custom domain name for accessing blob data in your Azure Storage account.
The default endpoint for the Blob service is `https://mystorage.blob.core.windows.net`.

But if you map a custom domain (such as www.contoso.com) to the blob endpoint for your storage account,
you can also access blob data in your storage account by using that domain. For example, with a custom
domain name, `http://mystorage.blob.core.windows.net/mycontainer/myblob` could be accessed as
`http://www.contoso.com/mycontainer/myblob`.

For more information about configuring this feature, please refer to [http://azure.microsoft.com/en-us/documentation/articles/storage-custom-domain-name
](http://azure.microsoft.com/en-us/documentation/articles/storage-custom-domain-name).

For more information on naming blobs, containers and tables:

- [Naming and Referencing Containers, Blobs, and Metadata](https://msdn.microsoft.com/en-us/library/dd135715.aspx)
- [Naming Queues and Metadata](https://msdn.microsoft.com/en-us/library/dd179349.aspx)
- [Naming Tables](https://msdn.microsoft.com/en-us/library/azure/dd179338.aspx)

A blob name can contain any combination of characters, but reserved URL characters must be properly
escaped. Avoid blob names that end with a period (.), a forward slash (/), or a sequence or combination
of the two. By convention, the forward slash is the **virtual** directory separator. Do not use a backward 
slash (\) in a blob name. The client APIs may allow it, but then fail to hash properly, and the 
signatures will not match.

It is not possible to modify the name of a storage account or container after it has been created.
You must delete it and create a new one if you want to use a new name.

> [AZURE.TIP] We recommend that you establish a naming convention for all storage accounts and types
before embarking on the development of a new service or application.

## Example - Deploying an N-tier service

In this example, we'll define an N-tier service configuration, consisting of front-end
IIS servers (hosted in Windows Server VMs), with SQL Server (hosted in two Windows Server VMs), 
an ElasticSearch cluster (hosted in 6 Linux VMs) and the associated storage accounts,
virtual networks, resource group and load balancer.

We'll start by defining the contextual conventions for this application:

| Entity | Convention | Description  |
| ------ | ---------- | ------------ |  
| Service Name | `profx` | The short name of the application or service being deployed |
| Environment | `prod` | This is for the production deployment (as opposed to qa, test, etc) |

From that baseline we can then map out the conventions for each of the resource types

| Resource Type | Convention Base | Example | 
| ------------- | --------------- | ------- |
| Resource Group | `servicename-rg` | `profx-rg` |
| Virtual Network | `servicename-vnet` | `profx-vnet` |
| Subnet | `role-subnet` | `sql-vnet` |
| Load Balancer | `servicename-lb` | `profx-lb` |
| Virtual Machine | `servicename-role[number]` | `profx-sql0` |
| Storage Account | `vmname-storage` | `profx-sql0-storage` |

As seen in the diagram below:

![application topology diagram](media/guidance-naming-convention-example.png "Sample Application Topology")
