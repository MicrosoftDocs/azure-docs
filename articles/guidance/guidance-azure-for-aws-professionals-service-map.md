<properties 
	pageTitle="Azure for AWS professionals - Service Map | Microsoft Azure" 
	description="A map of Azure services for AWS professionals." 
	services="" 
	documentationCenter="" 
	authors="lbrader" 
	manager="christb"
    />

<tags 
	ms.service="multiple" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="11/01/2016" 
	ms.author="lbrader"/>

# Microsoft Azure for AWS professionals

As the leading public cloud platforms, Microsoft Azure and Amazon Web Services (AWS) each offer businesses a broad and deep set of capabilities with global coverage. Yet many organizations choose to use both platforms together for greater choice and flexibility, as well as to spread their risk and dependencies with a multi-cloud approach. Consulting companies and software vendors may also want to build on and use both Azure and AWS as this combination represents the majority of the cloud market demand.

To help decide which platform is right for your needs, we’ve created a reference chart below to show each IT capability along with its corresponding service or feature in both Azure and AWS. In some cases, you’ll see multiple services listed because these fall into the same category but the depth and breadth of the capabilities provided will vary.


<table>
	<thead>
		<tr>
			<th>Category</th>
			<th>Subcategory</th>
			<th>AWS Service</th>
			<th>Azure Service</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><b>Compute</b></td>
			<td>Virtual server disk infrastructure</td>
			<td>EC2</td>
			<td><a href="https://azure.microsoft.com/services/virtual-machines/?b=16.02.25">Virtual Machine</a></td>
			<td>Provides persistent, durable storage volumes for use with virtual machines, and offers the option to select different underlying physical storage types and performance characteristics.</td>
		</tr>
		<tr>
			<td></td>
			<td>Auto scale</td>
			<td>Auto Scaling</td>
			<td><a href="virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md">VM Scale Sets</a></br>
			<a href="app-service-web/web-sites-scale.md">App Service AutoScaling</a></td>
			<td>Lets you automatically change the number of instances providing a particular compute workload. You set defined metric and thresholds that determine if the platform adds or removes instances.</td>
		</tr>
		<tr>
			<td></td>
			<td>Virtual server disk infrastructure</td>
			<td>Elastic Block Store (EBS)</td>
			<td><a href="virtual-machines/virtual-machines-linux-about-disks-vhds.md">Page Blobs</a></br>
			<a href="https://azure.microsoft.com/services/storage/premium-storage/">Premium Storage</a></td>
			<td>Provides persistent, durable storage volumes for use with virtual machines, and offers the option to select different underlying physical storage types and performance characteristics.</td>
		</tr>
		<tr>
			<td></td>
			<td>Container management</td>
			<td>EC2 Container Service EC2 Container Registry (Preview)</td>
			<td><a href="https://azure.microsoft.com/documentation/videos/azurecon-2015-windows-server-containers-docker-and-an-introduction-to-azure-container-service/">Container Service (Preview)</a></td>
			<td>A container management service that supports Docker containers and allows users to run applications on managed instance clusters. It eliminates the need to operate cluster management software or design fault-tolerant cluster architectures.</td>
		</tr>
		<tr>
			<td></td>
			<td>Backend process logic</td>
			<td>Lambda</td>
			<td><a href="app-service-web/websites-webjobs-resources.md">Web Jobs</a></br><a href="https://azure.microsoft.com/services/app-service/logic/">Logic Apps</a></td>
			<td>Used to integrate systems and run backend processes in response to events or schedules without provisioning or managing servers.</td>
		</tr>
		<tr>
			<td></td>
			<td>Job-based applications</td>
			<td></td>
			<td><a href="https://azure.microsoft.com/services/batch/">Batch</a></br></td>
			<td>Orchestration of the tasks and interactions between compute resources that are needed when you require processing across hundreds or thousands of compute nodes.</td>
		</tr>
		<tr>
			<td></td>
			<td>Microservice-based applications</td>
			<td></td>
			<td><a href="https://azure.microsoft.com/services/service-fabric/">Service Fabric (Preview)</a></br></td>
			<td>A compute service that orchestrates and manages the execution, lifetime, and resilience of complex, inter-related code components that can be either stateless or stateful.</td>
		</tr>
		<tr>
			<td></td>
			<td>Web application</td>
			<td>Elastic Beanstalk</td>
			<td><a href="https://azure.microsoft.com/services/app-service/web/">Web Apps</a></br><a href="https://azure.microsoft.com/documentation/services/cloud-services/">Cloud Services</a></td>
			<td>A fully managed web infrastructure that provides the underlying web server instances and surrounding security, management, resilience, and shared storage capabilities.</td>
		</tr>
		<tr>
			<td></td>
			<td>API-based application runtime</td>
			<td></td>
			<td><a href="https://azure.microsoft.com/services/app-service/api/">API Apps</a></br></td>
			<td>Build, manage, and host APIs enabling a variety of languages and SDKs with built-in authentication and analytics.</td>
		</tr>
		<tr>
			<td></td>
			<td>Disaster recovery</td>
			<td></td>
			<td><a href="https://azure.microsoft.com/services/site-recovery/">Site recovery</a></br></td>
			<td>Automates protection and replication of virtual machines. Offers health monitoring, recovery plans, and recovery plan testing.</td>
		</tr>
		<tr>
			<td></td>
			<td>Predefined templates</td>
			<td>AWS Quick Start</td>
			<td><a href="https://azure.microsoft.com/documentation/templates/">Azure Quickstart templates</a></br></td>
			<td></td>
		</tr>
		<tr>
			<td></td>
			<td>Marketplace</td>
			<td>AWS Marketplace</td>
			<td><a href="https://azure.microsoft.com/marketplace/">Azure Marketplace</a></br></td>
			<td>Easy-to-deploy and automatically configured third-party applications, including single virtual machine or multiple virtual machine solutions.</td>
		</tr>
		<tr>
			<td><b>Storage</b></td>
			<td>Object storage</td>
			<td>S3</td>
			<td><a href="https://azure.microsoft.com/services/storage/blobs/">Blob Storage</a></br></td>
			<td>Object storage service, for use cases including cloud applications, content distribution, backup, archiving, disaster recovery, and big data analytics.</td>
		</tr>
		<tr>
			<td></td>
			<td>Shared file storage</td>
			<td>Elastic File System (Preview)</td>
			<td><a href="https://azure.microsoft.com/services/storage/files/">File Storage</a></br></td>
			<td>Provides a simple interface to create and configure file systems quickly, and share common files. It’s shared file storage without the need for a supporting virtual machine, and can be used with traditional protocols that access files over a network.</td>
		</tr>
		<tr>
			<td></td>
			<td>Archiving and backup</td>
			<td>N/A (software) Glacier and S3 (storage)</td>
			<td><a href="https://azure.microsoft.com/services/backup/">Backup (software)</a></br><a href="https://azure.microsoft.com/services/storage/blobs/">Blob Storage (storage)</a></td>
			<td>Backup and archival solutions allow files and folders to be backed up and recovered from the cloud, and provides off-site protection against data loss. There are two components of backup—the software service that orchestrates backup/retrieval and the underlying backup storage infrastructure.</td>
		</tr>
		<tr>
			<td></td>
			<td>Hybrid storage</td>
			<td>Storage Gateway</td>
			<td><a href="https://azure.microsoft.com/services/storsimple/">StorSimple</a></br></td>
			<td>Integrates on-premises IT environments with cloud storage. Automates data management and storage, plus supports in disaster recovery.</td>
		</tr>
		<tr>
			<td></td>
			<td>Data transport</td>
			<td>Import/Export Snowball</td>
			<td><a href="storage/storage-import-export-service.md">Import/Export</a></br></td>
			<td>A data transport solution that uses secure disks and appliances to transfer large amounts of data. Also offers data protection during transit.</td>
		</tr>
		<tr>
			<td><b>Content delivery</b></td>
			<td>Content delivery</td>
			<td>CloudFront</td>
			<td><a href="https://azure.microsoft.com/services/cdn/">Content Delivery Network</a></br></td>
			<td>A global content delivery network that delivers audio, video, applications, images, and other files.</td>
		</tr>
		<tr>
			<td><b>Networking</b></td>
			<td>Networking</td>
			<td>Virtual private cloud</td>
			<td><a href="https://azure.microsoft.com/services/virtual-network/">Virtual network</a></br></td>
			<td>Provides an isolated, private environment in the cloud. Users have control over their virtual networking environment, including selection of their own IP address range, creation of subnets, and configuration of route tables and network gateways.</td>
		</tr>
		<tr>
			<td></td>
			<td>Domain name system (DNS)</td>
			<td>Route 53</td>
			<td><a href="https://azure.microsoft.com/services/dns/">DNS (Preview)</a></br><a href="https://azure.microsoft.com/services/traffic-manager/">Traffic Manager</a></td>
			<td>A service that hosts domain names, plus routes users to Internet applications, connects user requests to datacenters, manages traffic to apps, and improves app availability with automatic failover.</td>
		</tr>
		<tr>
			<td></td>
			<td>Dedicated network</td>
			<td>Direct Connect</td>
			<td><a href="https://azure.microsoft.com/services/expressroute/">ExpressRoute</a></br></td>
			<td>Establishes a dedicated, private network connection from a location to the cloud provider (not over the Internet).</td>
		</tr>
		<tr>
			<td></td>
			<td>Load balancing</td>
			<td>Elastic Load Balancing</td>
			<td><a href="https://azure.microsoft.com/services/load-balancer/">Load Balancer</a></br><a href="https://azure.microsoft.com/services/application-gateway/">Application Gateway</a></td>
			<td>Automatically distributes incoming application traffic to add scale, handle failover, and route to a collection of resources.</td>
		</tr>
		<tr>
			<td><b>Database</b></td>
			<td>Relational database</td>
			<td>RDS</td>
			<td><a href="https://azure.microsoft.com/services/sql-database/?b=16.18">SQL Database</a></br></td>
			<td>Relational database-as-a-service (DBaaS) where the database resilience, scale, and maintenance are primarily handled by the platform.</td>
		</tr>
		<tr>
			<td></td>
			<td>NoSQL database</td>
			<td>DynamoDB</td>
			<td><a href="https://azure.microsoft.com/services/documentdb/">DocumentDB</a></br></td>
			<td>A NoSQL document database service that automatically indexes JSON data for applications that require rich query and multi-document transactions.</td>
		</tr>
		<tr>
			<td></td>
			<td>Data warehouse</td>
			<td>Redshift</td>
			<td><a href="https://azure.microsoft.com/services/sql-data-warehouse/">SQL Data Warehouse (Preview)</a></br></td>
			<td>A fully managed data warehouse that analyzes data using business intelligence tools. It can transact SQL queries across relational and non-relational data.</td>
		</tr>
		<tr>
			<td></td>
			<td>Table storage</td>
			<td>DynamoDB</br>SimpleDB</td>
			<td><a href="https://azure.microsoft.com/services/storage/tables/">Table Storage</a></br></td>
			<td>A non-relational data store for semi-structured data. Developers store and query data items via web services requests.</td>
		</tr>
		<tr>
			<td></td>
			<td>Caching</td>
			<td>ElastiCache</td>
			<td><a href="https://azure.microsoft.com/services/cache/">Azure Redis Cache</a></br></td>
			<td>An in-memory based, distributed caching service that provides a high-performance store typically used to offload non-transactional work from a database.</td>
		</tr>
		<tr>
			<td></td>
			<td>Database migration</td>
			<td>Database Migration Service (Preview)</td>
			<td><a href="sql-database/sql-database-cloud-migrate.md">SQL Database Migration Wizard</a></br></td>
			<td>Typically is focused on the migration of database schema and data from one database format to a specific database technology in the cloud.</td>
		</tr>
		<tr>
			<td><b>Analytics and big data</b></td>
			<td>Big data processing</td>
			<td>Elastic MapReduce (EMR)</td>
			<td><a href="https://azure.microsoft.com/services/hdinsight/">HDInsight</a></br></td>
			<td>Supports technologies that break up large data processing tasks into multiple jobs, and then combine the results together to enable massive parallelism.</td>
		</tr>
		<tr>
			<td></td>
			<td>Data orchestration</td>
			<td>Data Pipeline</td>
			<td><a href="https://azure.microsoft.com/services/data-factory/">Data Factory</a></br></td>
			<td>Processes and moves data between different compute and storage services, as well as on-premises data sources at specified intervals. Users can create, schedule, orchestrate, and manage data pipelines.</td>
		</tr>
		<tr>
			<td></td>
			<td>Streaming data</td>
			<td>Kinesis Firehose</br>Kinesis Streams</td>
			<td><a href="https://azure.microsoft.com/services/event-hubs/">Event Hubs</a></br></td>
			<td>Services that allow the mass ingestion of small data inputs, typically from devices and sensors, to process and route the data.</td>
		</tr>
		<tr>
			<td></td>
			<td>Analytics</td>
			<td>Kinesis Analytics (Preview)</td>
			<td><a href="https://azure.microsoft.com/services/stream-analytics/">Stream Analytics</a></br><a href="https://azure.microsoft.com/services/data-lake-analytics/">Data Lake Analytics (Preview)</a></br><a href="https://azure.microsoft.com/services/data-lake-store/">Data Lake Store (Preview)</a></td>
			<td>Storage and analysis platforms that creates insights from large quantities of data, or data that originates from many sources.</td>
		</tr>
		<tr>
			<td></td>
			<td>Visualization</td>
			<td>QuickSight (Preview)</td>
			<td><a href="https://powerbi.microsoft.com/">PowerBI</a></br></td>
			<td>Business intelligence tools that build visualizations, perform ad-hoc analysis, and develop business insights from data.</td>
		</tr>
		<tr>
			<td></td>
			<td>Machine learning</td>
			<td>Machine Learning</td>
			<td><a href="https://azure.microsoft.com/services/machine-learning/">Machine Learning</a></br></td>
			<td>Produces an end-to-end workflow to create, process, refine, and publish predictive models that can be used to understand what might happen from complex data sets.</td>
		</tr>
		<tr>
			<td></td>
			<td>Search</td>
			<td>Elasticsearch Service</td>
			<td><a href="https://azure.microsoft.com/services/search/">Search</a></br></td>
			<td>Delivers full-text search and related search analytics and capabilities.</td>
		</tr>
		<tr>
			<td></td>
			<td>Data discovery</td>
			<td></td>
			<td><a href="https://azure.microsoft.com/services/data-catalog/">Data Catalog (Preview)</a></br></td>
			<td>Provides the ability to better register, enrich, discover, understand, and consume data sources.</td>
		</tr>
		<tr>
			<td><b>Internet of things (IoT)</b></td>
			<td>Internet of Things</td>
			<td>IoT (Preview)</td>
			<td><a href="https://azure.microsoft.com/services/iot-hub/">IoT Hub</a></br></td>
			<td>Lets connected devices to interact with cloud applications and other devices to captures and analyze real-time data.</td>
		</tr>
		<tr>
			<td><b>Management and monitoring</b></td>
			<td>Deployment orchestration</td>
			<td>OpsWorks</br>CloudFormation</td>
			<td><a href="https://azure.microsoft.com/features/resource-manager/">Resource Manager</a></br><a href="https://azure.microsoft.com/services/automation/">Automation</a></br><a href="virtual-machines/virtual-machines-windows-extensions-features.md">VM extensions</a></td>
			<td>Configures and operates applications of all shapes and sizes, and provides templates to create and manage a collection of resources.</td>
		</tr>
		<tr>
			<td></td>
			<td>Management and monitoring</td>
			<td>CloudWatch</br>CloudTrail</td>
			<td><a href="https://azure.microsoft.com/services/log-analytics/">Log Analytics</a></br><a href="https://azure.microsoft.com/features/azure-portal/">Azure portal</a></br><a href="https://azure.microsoft.com/services/application-insights/">Application Insights</a></td>
			<td>Management and monitoring services for cloud resources and applications to collect, track, store, analyze, and deliver metrics and log files.</td>
		</tr>
		<tr>
			<td></td>
			<td>Optimization</td>
			<td>Trusted Advisor</td>
			<td><a href=""></a></br></td>
			<td>Provides analysis of cloud resource configuration and security so subscribers can ensure they’re making use of best practices and optimum configurations.</td>
		</tr>
		<tr>
			<td></td>
			<td>Job scheduling</td>
			<td></td>
			<td><a href="https://azure.microsoft.com/services/scheduler/">Scheduler</a></br></td>
			<td>Runs jobs on simple or complex recurring schedules—now, later, or recurring.</td>
		</tr>
		<tr>
			<td></td>
			<td>Catalog service</td>
			<td>Service Catalog</td>
			<td><a href=""></a></br></td>
			<td>Creates and manages catalogs of approved IT services so users can quickly find and deploy them.</td>
		</tr>
		<tr>
			<td></td>
			<td>Administration</td>
			<td>Config</td>
			<td><a href="resource-group-audit.md">Azure portal (audit logs)</a></br></td>
			<td>Provides resource inventory, configuration history, and configuration change notifications for security and governance.</td>
		</tr>
		<tr>
			<td></td>
			<td>Programmatic access</td>
			<td>Command Line Interface</td>
			<td><a href="xplat-cli-install.md">Azure Command Line Interface (CLI)</a></br><a href="powershell-install-configure.md">Azure PowerShell</a></td>
			<td>Built on top of the native REST API across all cloud services, various programming language-specific wrappers provide easier ways to create solutions.</td>
		</tr>
		<tr>
			<td><b>Mobile services</b></td>
			<td>Pro app development</td>
			<td>Mobile Hub (Beta)</br>Cognito</td>
			<td><a href="https://azure.microsoft.com/services/app-service/mobile/">Mobile Apps</a></br></td>
			<td>Backend mobile services for rapid development of mobile solutions, plus provide identity management, data synchronization, and storage and notifications across devices.</td>
		</tr>
		<tr>
			<td></td>
			<td>High-level app development</td>
			<td></td>
			<td><a href="https://powerapps.microsoft.com/">PowerApps</a></br></td>
			<td>Model-driven application development for business applications with SaaS integration.</td>
		</tr>
		<tr>
			<td></td>
			<td>Analytics</td>
			<td>Mobile Analytics</td>
			<td><a href="https://azure.microsoft.com/services/mobile-engagement/">Mobile Engagement</a></br></td>
			<td>Provides real-time analytics from mobile apps data, highlights app users’ behavior, measures app usage, and tracks key trends.</td>
		</tr>
		<tr>
			<td></td>
			<td>Notification</td>
			<td>Simple Notification Service</td>
			<td><a href="https://azure.microsoft.com/services/notification-hubs/">Notification Hubs</a></br></td>
			<td>A push notification service that delivers messages instantly to applications or users. Messages can be sent to individual devices or can be broadcasted.</td>
		</tr>
		<tr>
			<td><b>Security and identity</b></td>
			<td>Authentication and authorization</td>
			<td>Identity and Access Management</br>Multi-Factor Authentication</td>
			<td><a href="active-directory/role-based-access-control-configure.md">Azure AD/Role-based access control</a></br><a href="https://azure.microsoft.com/services/multi-factor-authentication/">Multi-Factor Authentication</a></td>
			<td>Lets users securely control access to services and resources while offering data security and protection. Create and manage users and groups, and use permissions to allow and deny access to resources.</td>
		</tr>
		<tr>
			<td></td>
			<td>Encryption</td>
			<td>Key Management Service</br>CloudHSM</td>
			<td><a href="https://azure.microsoft.com/services/key-vault/">Key Vault</a></br></td>
			<td>Creates, controls, and protects the encryption keys used to encrypt data. HSM provides hardware-based key storage.</td>
		</tr>
		<tr>
			<td></td>
			<td>Firewall</td>
			<td>Web Application Firewall</td>
			<td><a href=""></a></br></td>
			<td>A firewall that protects web applications from common web exploits. Users can define customizable web security rules.</td>
		</tr>
		<tr>
			<td></td>
			<td>Security</td>
			<td>Inspector (Preview)</td>
			<td><a href="https://azure.microsoft.com/services/security-center/">Security Center (Preview)</a></br></td>
			<td>An automated security assessment service that improves the security and compliance of applications. Automatically assess applications for vulnerabilities or deviations from best practices.</td>
		</tr>
		<tr>
			<td></td>
			<td>Directory</td>
			<td>Directory Service</td>
			<td><a href="https://azure.microsoft.com/services/active-directory/">Azure Active Directory</a></br><a href="https://azure.microsoft.com/services/active-directory-b2c/">Azure Active Directory B2C</a></br><a href="https://azure.microsoft.com/services/active-directory-ds/">Azure Active Directory Domain Services</a></td>
			<td>Typically provides user/group properties that can be queried and used in applications. Also can provide capabilities to integrate to on-premises Active Directory services for single sign-on scenarios and SaaS management.</td>
		</tr>
		<tr>
			<td><b>Media services</b></td>
			<td>Media transcoding</td>
			<td>Elastic Transcoder</td>
			<td><a href="https://azure.microsoft.com/services/media-services/encoding/">Encoding</a></br></td>
			<td>A media transcoding service in the cloud that transcodes media files from their source format into versions that will playback on devices such as smartphones, tablets, and PCs.</td>
		</tr>
		<tr>
			<td></td>
			<td>Streaming</td>
			<td></td>
			<td><a href="https://azure.microsoft.com/services/media-services/live-on-demand/">Live and on-demand streaming</a></br></td>
			<td>Delivers content to virtually any device. Offers scalable streaming.</td>
		</tr>
		<tr>
			<td></td>
			<td>Others</td>
			<td></td>
			<td><a href="https://azure.microsoft.com/services/media-services/media-player/">Media Player</a></br><a href="https://azure.microsoft.com/services/media-services/media-indexer/">Media Indexer</a></br><a href="https://azure.microsoft.com/services/media-services/content-protection/">Content Protection</a></td>
			<td>Additional services related to the playing, protection, and analysis of the content within the media service.</td>
		</tr>
		<tr>
			<td><b>Application services</b></td>
			<td>Email</td>
			<td>Simple Email Service</td>
			<td><a href=""></a></br></td>
			<td>Lets users send transactional email, marketing messages, or any other type of content to customers.</td>
		</tr>
		<tr>
			<td></td>
			<td>Messaging</td>
			<td>Simple Queue Service</td>
			<td><a href="https://azure.microsoft.com/services/storage/queues/">Queue Storage</a></br><a href="service-bus/service-bus-dotnet-how-to-use-queues.md">Service Bus queues</a></br><a href="service-bus/service-bus-dotnet-how-to-use-topics-subscriptions.md">Service Bus topics</a></br><a href="service-bus/service-bus-relay-overview.md">Service Bus relay</a></td>
			<td>Stores large numbers of messages that can be accessed from anywhere through authenticated calls using HTTP or HTTPS. A queue can contain millions of messages, up to the total capacity limit of a storage account, and may also support more complex topologies such as publish/subscribe.</td>
		</tr>
		<tr>
			<td></td>
			<td>Workflow</td>
			<td>Simple Workflow Service</td>
			<td><a href="https://azure.microsoft.com/services/app-service/logic/">Logic Apps</a></br></td>
			<td>A state tracker and task coordinator service that allows developers to build, run, and scale background activities using a visual processes flow creation.</td>
		</tr>
		<tr>
			<td></td>
			<td>App testing</td>
			<td>Device Farm (Front End)</td>
			<td><a href="https://azure.microsoft.com/services/devtest-lab/">Azure DevTest Labs (Back End)</a></br></td>
			<td>A range of services geared toward the orchestration of dev/test backend server and service application infrastructure, as well as front end client device and software testing and simulation.</td>
		</tr>
		<tr>
			<td></td>
			<td>API management</td>
			<td>API Gateway</td>
			<td><a href="https://azure.microsoft.com/services/api-management/">API Management</a></br></td>
			<td>Allows developers to create, publish, maintain, monitor, and secure APIs. Handles processing concurrent API calls, including traffic management, authorization, access control, monitoring, and API version management.</td>
		</tr>
		<tr>
			<td></td>
			<td>Application streaming</td>
			<td>AppStream</td>
			<td><a href="https://azure.microsoft.com/services/remoteapp/">RemoteApp</a></br></td>
			<td>Streams and delivers existing applications from the cloud to reach more users on more devices—without any code modifications.</td>
		</tr>
		<tr>
			<td></td>
			<td>Search</td>
			<td>CloudSearch</td>
			<td><a href="https://azure.microsoft.com/services/search/">Search</a></br></td>
			<td>Sets up, manages, and scales a search solution for websites and applications.</td>
		</tr>
	</tbody>
	</tbody>
	</tbody>
	
</table>
