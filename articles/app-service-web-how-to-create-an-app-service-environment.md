# How to Create an App Service Environment #

App Service Environments (ASE) offer a high level of configuration that is not available in the multi-tenant stamps.  To gain a greater understanding of the capabilities offered by App Service Environments read the [What is an App Service Environment](http://azure.microsoft.com/documentation/articles/app-service-web-what-is-an-app-service-environment/ "What is an App Service Environment") documentation.
The ASE feature essentially deploys an instance of the Azure App Service in a customer’s VNET.  This means the customer needs to provide: 

- A Regional VNET is required with more than 512 (/23) or more addresses
- A Subnet in this VNET is required with 256 (/24) or more addresses

Each ASE deployment is a Hosted Service that Azure manages and maintains.  The VMs hosting the ASE system roles are not accessible to the customer though the customer does manage the quantity of instances and their sizes.  

Each ASE consists of Front End servers and Workers.  The Workers are managed in 3 separate pools.  The minimum footprint is 2 medium Front End servers and 2 small Workers in Worker Pool I.  Based on load needs a complete ASE system can be configured to use up to 50 total VMs.  

There are two ways to access the ASE creation UI.  It can be found by searching in the Azure Marketplace or by going through New -> Web + Mobile.  

After entering the creation UI you can quickly create an ASE by simply entering a name for the deployment.  This will in turn create a VNET, a subnet in that VNET and an ASE environment with 2 Front Ends and 2 Workers in Worker Pool 1.

The name that is specified for the ASE will be used for the web apps created in the ASE.  If name of the ASE is ASEDemoEnv then the domain name will be asedemoenv.p.azurewebsites.net.  If you thus created a web app named mytestapp then it would be addressable at mytestapp.asedemoenv.p.azurewebsites.net. 

![][1]


In addition to being able to create a new VNET you can select an existing VNET if it is large enough.  If going through the VNET creation UI you are required to provide:

- VNET Name
- VNET address range in CIDR notation
- Subnet Name
- Subnet range in CIDR notation

If you are unfamiliar with CIDR notation it takes the form of 10.0.0.0/22 where the /22 specifies the range.  In this example a /22 means a range of 1024 addresses or from 10.0.0.0 -10.0.3.255.  A /23 means 512 addresses and so on.  

![][2]

The next item to configure is the scale of the system.  By default there are 2 Front End medium VMs.  There are 2 so as to provide high availability and distribute the load.  The VMs are mediums to ensure they have enough capacity to support a modest system.  If you know that the system needs to support a high number of requests then you can adjust the quantity of Front Ends and the server size used.

Within an ASE there are 3 worker pools which a customer can define.  The VM size can be from Small to Extra Large.  By default there are only 2 small workers configured in Worker Pool 1.  That is enough to support a single App Service Plan with 2 instances.  
 
![][3]

Adding new instances to be available does not happen quickly.  If you know you are going to need additional VM's then you should provision them an hour or more in advance if you do not already have the reserve capacity.  To ensure that your system has can meet SLA requirements, every ASE needs to have a reserve instance available in each worker pool.  

By default an ASE comes with 1 IP address that is available for IP SSL.  If you know that you will need more you can specify that here or manage it after creation.  
It is of course important to select location where you want the ASE to be deployed as well as the subscription that you want to be able to use this system.  The only accounts that can use the ASE to host content must be in the subscription used to create it.  

After ASE creation you can adjust:

- Quantity of Front Ends (minimum: 2)
- Quantity of  Workers (minimum: 2)
- Quantity of IP addresses
- VM sizes used by the Front Ends or Workers

You cannot change:

- Location
- Subscription
- Resource Group
- VNET used
- Subnet used

There are additional dependencies that are not available for customization such as the database and storage.  These are handled by Azure and come with the system.  The system storage supports up to 500 GB for the entire App Service Environment.  

<!--Image references-->
[1]: ./media/app-service-web-how-to-create-an-app-service-environment/createASEblade.png
[2]: ./media/app-service-web-how-to-create-an-app-service-environment/createASEnetwork.png
[3]: ./media/app-service-web-how-to-create-an-app-service-environment/createASEscale.png
