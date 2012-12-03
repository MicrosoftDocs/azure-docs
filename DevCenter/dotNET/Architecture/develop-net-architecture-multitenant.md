<properties linkid="develop-net-architecture-multitenant" urlDisplayName="Multitenant applications" pageTitle="Multitenant applications in Windows Azure" metaKeywords="Multitenant multi-tenant Pattern Architecture" metaDescription="Multitenant patterns and application architecture using Windows Azure." metaCanonical="http://www.windowsazure.com/en-us/develop/net/architecture" umbracoNaviHide="0" disqusComments="1" />

# Multitenant Applications in Windows Azure

A multitenant application is a shared resource that allows separate users, or "tenants," to view the application as though it was their own. You can think of multitenancy by considering the relationship between an apartment building and its tenants. In the apartment building, each tenant can customize their own apartment to a certain degree and feel secure behind their door. Because the building owner can distribute the costs of property maintenance among its tenants, the owner can keep rents reasonable for the tenants while still making a profit. 

The typical scenario that lends itself to a multitenant application is one in which all users of the application may wish to customize the user experience, have the same basic business requirements, and the data, with appropriate security considerations, can be stored in a single database. Examples of large multitenant applications are Office 365, Outlook.com, and visualstudio.com.

From an application provider's perspective, the benefits of multitenancy mostly relate to operational and cost efficiencies. One version of your application can meet the needs of many tenants/customers, allowing consolidation of system administration tasks such as monitoring, performance tuning, software maintenance, and data backups.

The following provides a list of the most significant goals and requirements from a provider's perspective.

- **Provisioning**: You must be able to provision new tenants for the application.  For multitenant applications with a large number of tenants, it is usually necessary to automate this process by enabling self-service provisioning.
- **Maintainability**: You must be able to upgrade the application and perform other maintenance tasks while multiple tenants are using it. 
- **Monitoring**: You must be able to monitor the application at all times to identify any problems and to troubleshoot them. This includes monitoring how each tenant is using the application.

A properly implemented multitenant application provides the following benefits.

- **Isolation**: The activities of individual tenants do not affect the use of the application by other tenants. Tenants cannot access eatch others data. It appear to the tennant as though they have exclusive use of the application.
- **Availability**: Individual tenants want the application to be constantly available, perhaps with guarantees defined in an SLA. Again, the activities of other tenants should not affect the availability of the application.
- **Scalability**: The application scales to meet the demand of individual tenants. The presence and actions of other tenants should not affect the performance of the application. 
- **Costs**: Costs are lower than running a dedicated, single-tenant application because multi-tenancy enables the sharing of resources. 
- **Customizability**. The ability to customize the application for an individual tenant in various ways such as adding or removing features, changing colors and logos, or even adding their own code or script.
 
In short, while there are many considerations that you must take into account to provide a highly scalable, service, there are also a number of the goals and requirements that are common to many multitenant applications. Some may not be relevant in specific scenarios, and the importance of individual goals and requirements will differ in each scenario As a provider of the multitenant application, you will also have goals and requirements such as, meeting the tenants' goals and requirements, profitability, billing, multiple service levels, provisioning, maintainability monitoring, and automation. Meeting the tenants' goals and requirements.

For more information on additional design considerations of a multitenant application, see [Hosting a Multi-Tenant Application on Windows Azure][].

Windows Azure provides many features that allow you to address the key problems encountered when designing a multitenant system. 

Isolation 

- Segment Web site Tenants by Host Headers with or without SSL communication
- Segment Website Tenants by Query Parameters
- Web Services in Worker Roles
	- Worker Roles. that typically process data on the backend of an application.
	- Web Roles that typically act as the frontend for applications.

Storage
Data management such SQL Azure Database or Windows Azure Storage services such as the Table service which provides services for storage of large amounts of unstructured data and the Blob service which provides services to store large amounts of unstructured text or binary data such as video, audio and images.

- Securing Multitenant Data in SQL Database appropriate per-tenant SQL Server logins,
- Using Windows Azure Tables for Application Resources By specifying a container level access policy, you can the ability to adjust permissions without having to issue new URL’s for the resources protected with shared access signatures.
- Windows Azure Queues for Application Resources Windows Azure queues are commonly used to drive processing on behalf of tenants, but may also be used to distribute work required for provisioning or management.
- Service Bus Queues for Application Resources that pushes work to a shared a service, you can use a single queue where each tenant sender only has permissions (as derived from claims issued from ACS) to push to that queue, while only the receivers from the service have permission to pull from the queue the data coming from multiple tenants. 

Connection and Security Services

- Windows Azure Service Bus, a messaging infrastructure that sits between applications allowing them to exchange messages in a loosely coupled way for improved scale and resiliency.
Networking Services


Windows Azure provides several networking services that support authentication, and improve manageability of your hosted applications. These services include the following: 


- Windows Azure Virtual Network lets you provision and manage virtual private networks (VPNs) in Windows Azure as well as securely link these with on-premises IT infrastructure.
- Virtual Network Traffic Manager allows you to load balance incoming traffic across multiple hosted Windows Azure services whether they’re running in the same datacenter or across different datacenters around the world.
- Windows Azure Active Directory (Windows Azure AD) is a modern, REST-based service that provides identity management and access control capabilities for your cloud applications. 

Service Bus. This provides a secure messaging and data flow capability for distributed and hybrid applications, such as communication between Windows Azure hosted applications and on-premises applications and services, without requiring complex firewall and security infrastructures. It can use a range of communication and messaging protocols and patterns to provide delivery assurance, reliable messaging; can scale to accommodate varying loads; and can be integrated with on-premises BizTalk Server artifacts. For more detailed information see "AppFabric Service Bus" at http://msdn.microsoft.com/en-us/library/ee732537.aspx. 



- Using Windows Azure AD for Application Resources Windows Azure AD to  provides an easy way of authenticating and authorizing users to gain access to your web applications and services while allowing the features of authentication and authorization to be factored out of your code. 

- Using Service Bus Relay for Application Resources to  The services that are exposed as endpoints may belong to the tenant (for example, hosted outside of the system, such as on-premise), or they may be services provisioned specifically for the tenant (because sensitive, tenant-specific data travels across them). In either scenario, handling multiple tenants is really not the issue; enforcing tenant-specific usage is. Access to these endpoints is secured using Access Control Service (ACS), where clients must present an Issuer Name and Key, a SAML token, or a Simple Web Token. This can be configured programmatically using the Service Bus and ACS management APIs.

Provisioning Resources

- Provisioning and Managing Resources Using Azure Roles with A dedicated worker role in multitenant solution is typically used to provision and de-provision per tenant resources (such as when a new tenant signs-up or cancels), collecting metrics for metering use, and managing scale by following a certain schedule or in response to the crossing of thresholds of key performance indicators. This same role may also be used to push out updates and upgrades to the solution.

Provisioning SQL Database Resources
The options for provisioning new SQL Database resources for a tenant include:

- Use DDL in scripts or embedded as resources within assemblies
- Create SQL Server 2008 R2 DAC Packages and deploy them using the API's. You can also deploy from a DAC package in Windows Azure blob storage to SQL Database, as shown in this example.
- Copy from a master reference database
- Use database Import and Export to provision new databases from a file.

Provisioning Windows Azure BLOB Storage
The approach for provisioning BLOB storage is to first create the container(s), then to each apply the policy and create and apply Shared Access Keys to protected containers and blobs.

Using Windows Azure Blobs for Provisioning Resources
When it comes to provisioning compute or pre-initialized storage resources for new tenants, Azure blob storage should be secured using the container level access policy (as described above) to protect the CS Packages, VHD images and other resources.

Using Windows Azure Roles for Management Resources
The service provider will need a way to monitor and manage the system resources. A web role is typically dedicated to provide the service provider with tools to manage resources, view logs, performance counters, and provision manually, etc.

Using ACS for Management Resources
Most multitenant systems will require a namespace created within ACS that is used to secure system resources, as well as the creation and management of individual namespaces per tenant (such as for using the AF Cache). This is also accomplished using the ACS management namespace.

Using Cache Service for Management Resources
If the service provider exposes certain KPI’s or computed statistics to all tenants, it may decide to cache these often requested values. The tenants themselves do not get direct access to the cache, and must go through some intermediary (such as a WCF service) that retains the actual authorization key and URL for access to the Cache.

Using SQL Database for Management Resources
Examples of these are single, system wide and datacenter agnostic membership/roles database for non-federating tenants or those relying on a custom IP STS configured for use with ACS. For multitenant systems concerned with multiple geographic distributions, the challenge of a centralized system for management data surfaces. To solve these problems you can take the approach previously described for application resources, either by defining your geographical regions as shards in Hybrid Linear/Expanded Shard architecture or a more simple Linear Shard architecture. In both cases, leveraging middle-tier logic to fan out and aggregate results for your monitoring and management queries. 

Using Windows Azure Tables for Management Resources
The Windows Azure Diagnostics (WAD) infrastructure by default logs to Windows Azure Tables. When relying on these WAD tables (Trace, Event Logs and Performance Counters) you need to consider just how sensitive the logged data may, who has access to them and ultimately choose if they are isolated (aka provisioned) between customers or shared system-wide. For example, it’s unlikely that you would provide all tenants direct access to the diagnostic log tables which aggregates traces from all instances across the solution and might expose one tenant’s data to another tenant. 

Using Windows Azure Blobs for Management Resources
The canonical management resources stored in blob storage are IIS Logs and crash dumps. IIS Logs are transferred from role instances to blob storage. If your system monitoring relies on the IIS Logs, you will want to ensure that only the system has access to these logs via a container level access policy. If your tenants require some of this data, you will want to perform some post processing on the data (perhaps to ensure that only that tenant’s data is included) and then push the results out to tenants via a tenant specific container. Crash dumps, on the other hand are something only the service provider system should have access to as they assist in troubleshooting the infrastructure and will very likely contain data that spans tenants. 

Scaling Compute for Multitenant Solutions
While specific requirements vary, as a general theme when "auto-scaling" is considered the approach amounts to increasing or decreasing the instance count according to some heuristic. This heuristic may depend on some key performance indicator (KPI) derived from sources such as performance logs, IIS logs or even queue depth. Alternately, it may simply be implemented in response to a schedule, such as incrementing for a month end burst typical in accounting applications, and decrementing the instance count at other times. 

Azure Auto Scaling
If you’re looking for a simple, straightforward example from which to build your own auto-scaling, the Azure Auto Scaling sample available on CodePlex is worth a look.Of course, there are also some commercial offerings available to help with some of the more difficult aspects. In particular, Paraleap AzureWatch can help you auto-scale your application. 

You also need to analyze the application’s performance characteristics to determine whether scaling up by using larger compute nodes or scaling out by adding additional instances would be the best approach when demand increases. To manage variable costs, you must make sure that your application uses these resources as efficiently as possible.

------------------------------

For more in depth coverage of how you can apply Windows Azure to multitenant applications, see [Designing Multitenant Applications on Windows Azure][].

<!--links-->

[Hosting a Multi-Tenant Application on Windows Azure]: http://msdn.microsoft.com/en-us/library/hh534480.aspx
[Designing Multitenant Applications on Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/hh689716


