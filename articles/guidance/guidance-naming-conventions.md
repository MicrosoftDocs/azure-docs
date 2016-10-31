<properties
   pageTitle="Recommended naming conventions for Azure resources | Microsoft Azure"
   description="Recommended naming conventions for Azure resources. How to name virtual machines, storage accounts, networks, virtual networks, subnets and other Azure entities"
   services=""
   documentationCenter="na"
   authors="bennage"
   manager="marksou"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/31/2016"
   ms.author="christb"/>
   
# Recommended naming conventions for Azure resources

[AZURE.INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

This article is a summary of the naming rules and restrictions for Azure resources
and a baseline set of recommendations for naming conventions.  You can use these recommendations 
as a starting point for your own conventions specific to your needs. 

The choice of a name for any resource in Microsoft Azure is important because:

- It is difficult to change a name later.
- Names must meet the requirements of their specific resource type.

Consistent naming conventions make resources easier to locate. They can also indicate the role of
a resource in a solution. 

The key to success with naming conventions is establishing and following them across your applications and organizations. 

## Naming subscriptions

When naming Azure subscriptions, verbose names make understanding the context
and purpose of each subscription clear.  When working in an environment with many subscriptions, following a shared naming convention can improve clarity.

A recommended pattern for naming subscriptions is:

`<Company> <Department (optional)> <Product Line (optional)> <Environment>`

- Company would usually be the same for each subscription. However, some companies may have
child companies within the organizational structure. These companies may be managed by a central IT
group. In these cases, they could be differentiated by having both the parent company name (*Contoso*)
and child company name (*North Wind*).

- Department is a name within the organization where a group of individuals work. This item within
the namespace as optional.

- Product line is a specific name for a product or function that is performed from within the department.
This is generally optional for internal-facing services and applications. However, it is highly recommended to use
for public-facing services that require easy separation and identification (such as for clear 
separation of billing records).

- Environment is the name that describes the deployment lifecycle of the applications or services,
such as Dev, QA, or Prod.

| Company | Department | Product Line or Service | Environment | Full Name  |
----------| ---------- | ----------------------- | ----------- | ---------- |
| Contoso | SocialGaming | AwesomeService | Production | Contoso SocialGaming AwesomeService Production |
| Contoso | SocialGaming | AwesomeService | Dev | Contoso SocialGaming AwesomeService Dev |
| Contoso | IT | InternalApps | Production | Contoso IT InternalApps Production |
| Contoso | IT | InternalApps | Dev | Contoso IT InternalApps Dev |

<!-- TODO; include more information about organizing subscriptions for application deployment, pods, etc. -->

## Use affixes to avoid ambiguity

When naming resources in Azure, it is recommended to use common prefixes or suffixes to identify the type and
context of the resource.  While all the information about type, metadata, context, is available programmatically,
applying common affixes simplifies visual identification.  When incorporating affixes into your naming convention,
it is important to clearly specify whether the affix is at the beginning of the name 
(prefix) or at the end (suffix).  

For instance, here are two possible names for a service hosting a calculation engine:

- SvcCalculationEngine (prefix)
- CalculationEngineSvc (suffix)

Affixes can refer to different aspects that describe the particular resources. The following table
shows some examples typically used.

| Aspect | Example | Notes |
| ------ | ------- | ----- |
| Environment | dev, prod, QA | Identifies the environment for the resource |
| Location | uw (US West), ue (US East) | Identifies the region into which the resource is deployed |
| Instance | 01, 02 | For resources that have more than one named instance (web servers, etc.). |
| Product or Service | service | Identifies the product, application, or service that the resource supports |
| Role | sql, web, messaging | Identifies the role of the associated resource |

When developing a specific naming convention for your company or projects, it is importantly to
choose a common set of affixes and their position (suffix or prefix).

## Naming Rules and Restrictions

Each resource or service type in Azure enforces a set of naming restrictions and scope; any naming convention
or pattern must adhere to the requisite naming rules and scope.  For example, while the name of a VM maps to a DNS
name (and is thus required to be unique across all of Azure), the name of a VNET is scoped to the Resource Group that
it is created within.

In general, avoid having any special characters (`-` or `_`) as the first or last character in any name. These characters will cause most validation rules to fail.

| Category | Service or Entity | Scope | Length | Casing | Valid Characters | Suggested Pattern | Example |
| ------------- | ----------------- | ----- | ------ | ------ | ---------------- | ----------------- | ------- |
| Resource Group | Resource Group | Global | 1-64 | Case insensitive | Alphanumeric, underscore, and hyphen | `<service short name>-<environment>-rg` | `profx-prod-rg` |
| Resource Group | Availability Set | Resource Group | 1-80 | Case insensitive | Alphanumeric, underscore, and hyphen | `<service-short-name>-<context>-as` | `profx-sql-as` |
| General | Tag | Associated Entity | 512 (name), 256 (value) | Case insensitive | Alphanumeric | `"key" : "value"` | `"department" : "Central IT"` |
| Compute | Virtual Machine | Resource Group | 1-15 | Case insensitive | Alphanumeric, underscore, and hyphen | `<name>-<role>-vm<number>` | `profx-sql-vm1` |
| Storage | Storage account name (data) | Global | 3-24 | Lower case | Alphanumeric | `<gloablly unique name><number>` (use a function to calculate a has for naming storage accounts) | `profxdata001` |
| Storage | Storage account name (disks) | Global | 3-24 | Lower case | Alphanumeric | `<vm name without dashes>st<number>` | `profxsql001st0` |
| Storage | Container name | Storage account | 3-63 |	Lower case | Alphanumeric and dash | `<context>` | `logs` |
| Storage | Blob name | Container | 1-1024 | Case sensitive | Any URL char | `<variable based on blob usage>` | `<variable based on blob usage>` |
| Storage | Queue name | Storage account | 3-63 | Lower case | Alphanumeric and dash | `<service short name>-<context>-<num>` | `awesomeservice-messages-001` |
| Storage | Table name | Storage account | 3-63 |Case insensitive | Alphanumeric | `<service short name>-<context>` | `awesomeservice-logs` |
| Storage | File name | Storage account | 3-63 | Lower case | Alphanumeric | `<variable based on blob usage>` | `<variable based on blob usage>` |
| Networking | Virtual Network (VNet) | Resource Group | 2-64 | Case-insensitive | Alphanumeric, dash, underscore, and period | `<service short name>-[section]-vnet` | `profx-vnet` |
| Networking | Subnet | Parent VNet | 2-80 | Case-insensitive | Alphanumeric, underscore, dash, and period | `<descriptive context>` | `web` |
| Networking | Network Interface | Resource Group | 1-80 | Case-insensitive | Alphanumeric, dash, underscore, and period | `<vmname>-nic<num>` | `profx-sql1-nic1` |
| Networking | Network Security Group | Resource Group | 1-80 | Case-insensitive | Alphanumeric, dash, underscore, and period | `<service short name>-<context>-nsg` | `profx-app-nsg` |
| Networking | Network Security Group Rule | Resource Group | 1-80 | Case-insensitive | Alphanumeric, dash, underscore, and period | `<descriptive context>` | `sql-allow` |
| Networking | Public IP Address | Resource Group | 1-80 | Case-insensitive | Alphanumeric, dash, underscore, and period | `<vm or service name>-pip` | `profx-sql1-pip` |
| Networking | Load Balancer | Resource Group | 1-80 | Case-insensitive | Alphanumeric, dash, underscore, and period | `<service or role>-lb` | `profx-lb` |
| Networking | Load Balanced Rules Config | Load Balancer | 1-80 | Case-insensitive | Alphanumeric, dash, underscore, and period | `<descriptive context>` | `http` |
| Networking | Azure Application Gateway | Resource Group | 1-80 | Case-insensitive | Alphanumeric, dash, underscore, and period | `<service or role>-aag` | `profx-agw`|
| Networking | Traffic Manager Profile | Resource Group | 1-63 | Case-insensitive | Alphanumeric, dash, and period | `<descriptive context>` | `app1`
-->

## Organizing resources with tags

The Azure Resource Manager supports tagging entities with arbitrary
text strings to identify context and streamline automation.  For example, the tag `"sqlVersion: "sql2014ee"` could identify VMs in a deployment running SQL Server 2014 Enterprise Edition for running an automated script against them.  Tags should be used to augment and enhance context along side of the naming conventions chosen.

> [AZURE.TIP] One other advantage of tags is that tags span resource groups, allowing you to link and correlate entities across
> disparate deployments.

Each resource or resource group can have a maximum of **15** tags. The tag name is limited to 512 characters, and the tag 
value is limited to 256 characters.

For more information on resource tagging, refer to [Using tags to organize your Azure resources](../resource-group-using-tags.md).

Some of the common tagging use cases are:

- **Billing**; Grouping resources and associating them with billing or charge back codes.
- **Service Context Identification**; Identify groups of resources across Resource Groups for common operations and grouping
- **Access Control and Security Context**; Administrative role identification based on portfolio, system, service, app, instance, etc.

> [AZURE.TIP] Tag early - tag often.  Better to have a baseline tagging scheme in place and adjust over time rather than having
> to retrofit after the fact.  

An example of some common tagging approaches:

| Tag Name | Key | Example | Comment |
| -------- | --- | ------- | ------- |
| Bill To / Internal Chargeback ID | billTo  | `IT-Chargeback-1234` | An internal I/O or billing code |
| Operator or Directly Responsible Individual (DRI) | managedBy | `joe@contoso.com`  | Alias or email address |
| Project Name | project-name | `myproject`  | Name of the project or product line |
| Project Version | project-version | `3.4`  | Version of the project or product line |
| Environment | environment | `<Production, Staging, QA >` | Environmental identifier | 
| Tier | tier | `Front End, Back End, Data` | Tier or role/context identification |
| Data Profile | dataProfile | `Public, Confidential, Restricted, Internal` | Sensitivity of data stored in the resource |
 
## Tips and tricks

Some types of resources may require additional care on naming and conventions.

### Virtual machines

Especially in larger topologies, carefully naming virtual machines streamlines identifying the
role and purpose of each machine, and enabling more predictable scripting.

> [AZURE.WARNING] Every virtual machine in Azure has both an Azure resource name, and an operating
> system host name.  
> If the resource name and host name are different, managing the VMs may be challenging and should be avoided.
> For example, if a virtual machine is created from a .vhd that already contains a 
> configured operating system with a hostname.

- [Naming conventions for Windows Server VMs](https://support.microsoft.com/en-us/kb/188997)

###	Storage accounts and storage entities

There are two primary use cases for storage accounts - backing disks for VMs, and storing 
data in blobs, queues and tables.  Storage accounts used for VM disks should follow the naming
convention of associating them with the parent VM name (and with the potential need for multiple 
storage accounts for high-end VM SKUs, also apply a number suffix).

> [AZURE.TIP] Storage accounts - whether for data or disks - should follow a naming convention that 
> allows for multiple storage accounts to be leveraged (i.e. always using a numeric suffix).

It possible to configure a custom domain name for accessing blob data in your Azure Storage account.
The default endpoint for the Blob service is `https://mystorage.blob.core.windows.net`.

But if you map a custom domain (such as www.contoso.com) to the blob endpoint for your storage account,
you can also access blob data in your storage account by using that domain. For example, with a custom
domain name, `http://mystorage.blob.core.windows.net/mycontainer/myblob` could be accessed as
`http://www.contoso.com/mycontainer/myblob`.

For more information about configuring this feature, refer to [Configure a custom domain name for your Blob storage endpoint](../storage/storage-custom-domain-name.md).

For more information on naming blobs, containers and tables:

- [Naming and Referencing Containers, Blobs, and Metadata](https://msdn.microsoft.com/library/dd135715.aspx)
- [Naming Queues and Metadata](https://msdn.microsoft.com/library/dd179349.aspx)
- [Naming Tables](https://msdn.microsoft.com/library/azure/dd179338.aspx)

A blob name can contain any combination of characters, but reserved URL characters must be properly
escaped. Avoid blob names that end with a period (.), a forward slash (/), or a sequence or combination
of the two. By convention, the forward slash is the **virtual** directory separator. Do not use a backward 
slash (\) in a blob name. The client APIs may allow it, but then fail to hash properly, and the 
signatures will not match.

It is not possible to modify the name of a storage account or container after it has been created.
If you want to use a new name, you must delete it and create a new one.

> [AZURE.TIP] We recommend that you establish a naming convention for all storage accounts and types
before embarking on the development of a new service or application.

## Example - deploying an n-tier architecture

Deploy the reference architecture described in [Running Windows VMs for an N-tier architecture on Azure](./guidance-compute-n-tier-vm.md) or [Running Linux VMs for an N-tier architecture on Azure](./guidance-compute-n-tier-vm-linux.md) for a sample deployment that uses the naming conventions listed above.

## Next steps

- Deploy a single [Windows](./guidance-compute-single-vm.md) or [Linux](/.guidance-compute-single-vm-linux.md) VM in Azure.
- Deploy [multiple VMs](./guidance-compute-multi-vm.md)  in Azure.
- Deploy an n-tier [Windows](./guidance-compute-n-tier-vm.md) or [Linux](./guidance-compute-n-tier-vm-linux.md) architecture in Azure.