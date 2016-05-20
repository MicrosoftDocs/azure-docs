<a name="tellmeas"></a>
## Tell me about app service

Azure Virtual Machines can handle a wide range of cloud hosting tasks. But creating and managing a VM infrastructure requires specialized skills and substantial effort. If you don't need complete control over the VMs that run your web apps, mobile app backends, API apps, etc., there's an easier (and cheaper) solution: *Platform as a Service* (PaaS). With PaaS, Azure handles most of the management work for the VMs that run your applications. [Azure App Service](../articles/app-service/app-service-value-prop-what-is.md) is a fully managed PaaS offering that allows you to build, deploy, and scale enterprise-grade apps in seconds.

App Service is the best choice for many kinds of application workloads. A corporation might want to build or migrate a commercial website that can handle millions of hits a week and is deployed in several data centers across the globe. The same corporation might also have a line-of-business app that tracks expense reports for authenticated users from the corporate Active Directory, and the app might have a mobile device component and connect to on-premise resources and business processes. The expense reports might require periodic background jobs to calculate and summarize large volumes of information. An IT consultant might adapt a popular open source application to set up a content management system for a small business. The figure below shows some of the kinds of web apps that can run in Azure App Service.

<a name="appservice_diagram"></a>
![app service diagram](media/app-service-choose-me-content/diagram.png)

**Figure: Azure App Service supports static web pages, popular web applications, and custom web applications built with various technologies. You can also run mobile backends, API app, and non-web compute workloads (using WebJobs).**

With Azure App Service, you can also run any kind of compute workload using the [WebJobs](../articles/app-service-web/websites-webjobs-resources.md) feature.

Azure App Service gives you the option of running on shared VMs that contain multiple apps created by multiple users, or on VMs that are used only by you. VMs are a part of a pool of resources managed by Azure App Service and thus allow for high reliability and fault tolerance.

Getting started is easy. With Azure App Service, users can select from a range of applications, frameworks and template and create a web app in seconds. They can then use their favorite development tools (WebMatrix, Visual Studio, any other editor) and source control options to set up continuous integration and develop as a team. Applications that rely on a MySQL DB can consume a MySQL service provided for Azure by ClearDB, a Microsoft partner.

Developers can create large, scalable web applications with Azure App Service. The technology supports creating applications using ASP.NET, PHP, Node.js and Python. Applications can use sticky sessions, for example, and many existing web apps can be moved to this cloud platform with no changes. Web apps built on Azure App Service can use other aspects of Azure, such as Service Bus, SQL Database, and Blob Storage. You can also run multiple copies of an application in different VMs, with Azure App Service automatically load balancing requests across them. And because new web app instances are created in VMs that already exist, starting a new application instance happens very quickly; it's significantly faster than waiting for a new VM to be created.

As the [figure](#appservice_diagram) above shows, you can publish code and other web content into Azure App Service in several ways. You can use FTP, FTPS, or Microsoft's WebDeploy technology. Azure App Service also supports publishing code from source control systems, including Git, GitHub, CodePlex, BitBucket, Dropbox, Mercurial, Team Foundation Server, and the cloud-based Team Foundation Service.
