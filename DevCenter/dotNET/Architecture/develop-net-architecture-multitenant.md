<properties linkid="develop-net-architecture-multitenant" urlDisplayName="Multitenant applications" pageTitle="Multitenant applications in Windows Azure" metaKeywords="Multitenant Pattern Architecture" metaDescription="Multitenant patterns and application architecture using Windows Azure." metaCanonical="http://www.windowsazure.com/en-us/develop/net/architecture" umbracoNaviHide="0" disqusComments="1" />

# Multitenant Applications in Windows Azure

A multitenant application is a shared resource that allows separate users, or "tenants," to view the application as though it was their own. You can think of multitenancy by considering the relationship between an apartment building and its tenants. In the apartment building, each tenant can customize their own apartment to a certain degree and feel secure behind their door. Because the building owner can distribute the costs of property maintenance among its tenants, the owner can keep rents reasonable for the tenants while still making a profit. 

The typical scenario that lends itself to a multitenant application is one in which all users of the application may wish to customize the user experience, have the same basic business requirements, and the data, with appropriate security considerations, can be stored in a single database.

Examples of large multitenant applications are Office 365 and Outlook.com.

From an application provider's perspective, the benefits of multi-tenancy mostly relate to operational and cost efficiencies. One instance of your application can meet the needs of many tenants/customers, allowing consolidation of system administration tasks such as monitoring, performance tuning, software maintenance, and data backups. 

A properly implemented multitenant application provides the following benefits.

- The application scales and continues to perform well as the user population grows.
- The work of one tenant does not adversely affect the work of other tenants.
- Each tenant can customize the application to meet their requirements.
- The application maintains the security and privacy of each tenant's data, even though multiple tenants share one or more system resources such as database, application, and web servers.

Many changes in a multitenant environment are performed via simple configuration. For example, the colors or fonts displayed in the UI are simple configuration options that can be "plugged in" wgithout actually changing the behavior of the application. Other tenants may also lease the application, yet the application is deployed only one time on a central, hosted server and changes its behavior based on the tenant (or tenant's end-users) accessing it. In a more complex scenario, you may need to change business logic on a per-tenant basis. For example, a specific tenant leasing space on the application may want to change the way a value is calculated using some complex custom logic.

Any application can have multiple users. The term multi-user does not imply anything for the architecture and implementation of the application. On the other hand, while a multitenant system is a multi-user system, multi-tenancy enforces certain aspects of the architecture and implementation of the application: namely that multiple users share the same application. It is possible to implement a multi-user application which is not multi-tenant.

The basic method is to create one application that one or more users can access through a client front end.  Each user client can be customized to suit the needs of that user. The application handles the work load and business customizations.  The data store maintains the data for all the users. 

The following diagram shows a high-level overview of sample architecture for multitenant application.

![multitenantGeneric][]
 
With Windows Azure, you can create web roles to handle the customized user requirements, worker roles to implement the application and either blobs and tables or SQL Database to store the data. 
 
- **User Clients**: Web roles provide a dedicated IIS server for hosting front-end web applications. The web role provides a customized front end that one or more users use to access the application.
- **Application**:  A Worker role is used to handle the connections and process the user requests. 
- **Data Store**:  Windows Azure provides several options for storing relational and non-relational data.  For an overview, see Data Management and Business Analytics.

Web roles provide a dedicated Internet Information Services (IIS) web-server used for hosting front-end web applications. Worker roles run asynchronous, long-running or perpetual tasks independent of user interaction or input.

The following diagram shows how applying the Windows Azure features multitenant model can be applied the implementation of a multitenant application.

 ![multitenantazure][]

For a reference implementation of this architecture, see [The Tailspin Scenario][].
For more in depth coverage of how you can apply Windows Azure to multitenant applications, see [Designing Multitenant Applications on Windows Azure][].

<!--links-->

[The Tailspin Scenario]: http://msdn.microsoft.com/en-us/library/windowsazure/hh534478.aspx
[Designing Multitenant Applications on Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/hh689716

<!--images-->

[multitenantGeneric]: ..\media\architecture-multi-tenant-Generic.png
[multitenantazure]: ..\media\architecture-multi-tenant-Azure.png
