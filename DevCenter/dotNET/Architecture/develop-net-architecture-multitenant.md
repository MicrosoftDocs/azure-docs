<properties linkid="develop-net-architecture-multitenant" urlDisplayName="Multitenant applications" pageTitle="Multitenant applications in Windows Azure" metaKeywords="Multitenant multi-tenant Pattern Architecture" metaDescription="Multitenant patterns and application architecture using Windows Azure." metaCanonical="http://www.windowsazure.com/en-us/develop/net/architecture" umbracoNaviHide="0" disqusComments="1" />

# Multitenant Applications in Windows Azure

A multitenant application is a shared resource that allows separate users, or "tenants," to view the application as though it was their own. A typical scenario that lends itself to a multitenant application is one in which all users of the application may wish to customize the user experience but otherwise have the same basic business requirements. Examples of large multitenant applications are Office 365, Outlook.com, and visualstudio.com.

From an application provider's perspective, the benefits of multitenancy mostly relate to operational and cost efficiencies. One version of your application can meet the needs of many tenants/customers, allowing consolidation of system administration tasks such as monitoring, performance tuning, software maintenance, and data backups.

The following provides a list of the most significant goals and requirements from a provider's perspective.

- **Provisioning**: You must be able to provision new tenants for the application.  For multitenant applications with a large number of tenants, it is usually necessary to automate this process by enabling self-service provisioning.
- **Maintainability**: You must be able to upgrade the application and perform other maintenance tasks while multiple tenants are using it. 
- **Monitoring**: You must be able to monitor the application at all times to identify any problems and to troubleshoot them. This includes monitoring how each tenant is using the application.

A properly implemented multitenant application provides the following benefits to users.

- **Isolation**: The activities of individual tenants do not affect the use of the application by other tenants. Tenants cannot access eatch others data. It appear to the tennant as though they have exclusive use of the application.
- **Availability**: Individual tenants want the application to be constantly available, perhaps with guarantees defined in an SLA. Again, the activities of other tenants should not affect the availability of the application.
- **Scalability**: The application scales to meet the demand of individual tenants. The presence and actions of other tenants should not affect the performance of the application. 
- **Costs**: Costs are lower than running a dedicated, single-tenant application because multi-tenancy enables the sharing of resources. 
- **Customizability**. The ability to customize the application for an individual tenant in various ways such as adding or removing features, changing colors and logos, or even adding their own code or script.
 
In short, while there are many considerations that you must take into account to provide a highly scalable service, there are also a number of the goals and requirements that are common to many multitenant applications. Some may not be relevant in specific scenarios, and the importance of individual goals and requirements will differ in each scenario. As a provider of the multitenant application, you will also have goals and requirements such as, meeting the tenants' goals and requirements, profitability, billing, multiple service levels, provisioning, maintainability monitoring, and automation. 

For more information on additional design considerations of a multitenant application, see [Hosting a Multi-Tenant Application on Windows Azure][].

Windows Azure provides many features that allow you to address the key problems encountered when designing a multitenant system. 

**Isolation** 

- Segment Web site Tenants by Host Headers with or without SSL communication
- Segment Web site Tenants by Query Parameters
- Web Services in Worker Roles
	- Worker Roles. that typically process data on the backend of an application.
	- Web Roles that typically act as the frontend for applications.

**Storage**

Data management such as SQL Azure Database or Windows Azure Storage services such as the Table service which provides services for storage of large amounts of unstructured data and the Blob service which provides services to store large amounts of unstructured text or binary data such as video, audio and images.

- Securing Multitenant Data in SQL Database appropriate per-tenant SQL Server logins, 
- Using Windows Azure Tables for Application Resources By specifying a container level access policy, you can the ability to adjust permissions without having to issue new URL’s for the resources protected with shared access signatures. 
- Windows Azure Queues for Application Resources Windows Azure queues are commonly used to drive processing on behalf of tenants, but may also be used to distribute work required for provisioning or management. 
- Service Bus Queues for Application Resources that pushes work to a shared a service, you can use a single queue where each tenant sender only has permissions (as derived from claims issued from ACS) to push to that queue, while only the receivers from the service have permission to pull from the queue the data coming from multiple tenants. 


**Connection and Security Services**

- Windows Azure Service Bus, a messaging infrastructure that sits between applications allowing them to exchange messages in a loosely coupled way for improved scale and resiliency. 

**Networking Services**

Windows Azure provides several networking services that support authentication, and improve manageability of your hosted applications. These services include the following: 

- Windows Azure Virtual Network lets you provision and manage virtual private networks (VPNs) in Windows Azure as well as securely link these with on-premises IT infrastructure. 
- Virtual Network Traffic Manager allows you to load balance incoming traffic across multiple hosted Windows Azure services whether they’re running in the same datacenter or across different datacenters around the world. 
- Windows Azure Active Directory (Windows Azure AD) is a modern, REST-based service that provides identity management and access control capabilities for your cloud applications. Using Windows Azure AD for Application Resources Windows Azure AD to provides an easy way of authenticating and authorizing users to gain access to your web applications and services while allowing the features of authentication and authorization to be factored out of your code. 
- Windows Azure Service Bus provides a secure messaging and data flow capability for distributed and hybrid applications, such as communication between Windows Azure hosted applications and on-premises applications and services, without requiring complex firewall and security infrastructures. Using Service Bus Relay for Application Resources to The services that are exposed as endpoints may belong to the tenant (for example, hosted outside of the system, such as on-premise), or they may be services provisioned specifically for the tenant (because sensitive, tenant-specific data travels across them). 



**Provisioning Resources**

Windows Azure provides a number of ways provision new tenants for the application. For multitenant applications with a large number of tenants, it is usually necessary to automate this process by enabling self-service provisioning.

- Worker roles allow you to provision and de-provision per tenant resources (such as when a new tenant signs-up or cancels), collect metrics for metering use, and manage scale following a certain schedule or in response to the crossing of thresholds of key performance indicators. This same role may also be used to push out updates and upgrades to the solution. 
- Windows Azure Blobs can be used to provision compute or pre-initialized storage resources for new tenants while providing container level access policies to protect the compute service Packages, VHD images and other resources.
- Options for provisioning SQL Database resources for a tenant include:

	- 	DDL in scripts or embedded as resources within assemblies 
	- 	SQL Server 2008 R2 DAC Packages deployed programmatically.
	- 	Copying from a master reference database 
	- 	Using database Import and Export to provision new databases from a file. 

For more in depth coverage of how you can apply Windows Azure to multitenant applications, see [Designing Multitenant Applications on Windows Azure][].

<!--links-->

[Hosting a Multi-Tenant Application on Windows Azure]: http://msdn.microsoft.com/en-us/library/hh534480.aspx
[Designing Multitenant Applications on Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/hh689716


