---
title: Azure for AWS professionals - Service Map | Microsoft Docs
description: A map of Azure services for AWS professionals.
services: ''
documentationcenter: ''
author: lbrader
manager: christb

ms.assetid: 02488dea-711a-4618-8c51-667286008989
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/15/2016
ms.author: lbrader

---

# Microsoft Azure for AWS professionals

As the leading public cloud platforms, Microsoft Azure and Amazon Web Services (AWS) each offer businesses a broad and deep set of capabilities with global coverage. Yet many organizations choose to use both platforms together for greater choice and flexibility, as well as to spread their risk and dependencies with a multi-cloud approach. Consulting companies and software vendors may also want to build on and use both Azure and AWS as this combination represents the majority of the cloud market demand.

To help decide which platform is right for your needs, we’ve created a reference chart below to show each IT capability along with its corresponding service or feature in both Azure and AWS. In some cases, you’ll see multiple services listed because these fall into the same category but the depth and breadth of the capabilities provided will vary.

|Category|Subcategory|AWS Service|Azure Service|Description|
|--- |--- |--- |--- |--- |
|**Compute**|Virtual servers|EC2|Virtual Machines|Virtual servers allow users to deploy, manage, and maintain OS and server software. Instance types provide combinations of CPU/RAM. Users pay for what they use with the flexibility to change sizes.|
| |Auto scale|Auto Scaling|VM Scale Sets App Service AutoScaling|Lets you automatically change the number of instances providing a particular compute workload. You set defined metric and thresholds that determine if the platform adds or removes instances.|
| |Virtual server disk infrastructure|Elastic Block Store (EBS)|Page Blobs <br/>Premium Storage|Provides persistent, durable storage volumes for use with virtual machines, and offers the option to select different underlying physical storage types and performance characteristics.|
| |Container management|EC2 Container Service|Container Service|A container management service that supports Docker containers and allows users to run applications on managed instance clusters. It eliminates the need to operate cluster management software or design fault-tolerant cluster architectures.|
| |Backend process logic|Lambda|Functions <br/>Web Jobs <br/>Logic Apps |Used to integrate systems and run backend processes in response to events or schedules without provisioning or managing servers.|
| |Job-based applications| |Batch|Orchestration of the tasks and interactions between compute resources that are needed when you require processing across hundreds or thousands of compute nodes.|
| |Microservice-based applications| |Service Fabric|A compute service that orchestrates and manages the execution, lifetime, and resilience of complex, inter-related code components that can be either stateless or stateful.|
| |Web application|Elastic Beanstalk|Web Apps <br/>Cloud Services|A fully managed web infrastructure that provides the underlying web server instances and surrounding security, management, resilience, and shared storage capabilities.|
| |API-based application runtime| |API Apps|Build, manage, and host APIs enabling a variety of languages and SDKs with built-in authentication and analytics.|
| |Disaster recovery| |Site recovery|Automates protection and replication of virtual machines. Offers health monitoring, recovery plans, and recovery plan testing.|
| |Predefined templates|AWS Quick Start|Azure Quickstart templates|Community-led templates for creating and deploying virtual machine-based solutions.|
| |Marketplace|AWS Marketplace|Azure Marketplace|Easy-to-deploy and automatically configured third-party applications, including single virtual machine or multiple virtual machine solutions.|
|**Storage and content delivery**|Object storage|S3|Blob Storage|Object storage service, for use cases including cloud applications, content distribution, backup, archiving, disaster recovery, and big data analytics.|
| |Shared file storage|Elastic File System (Preview)|File Storage|Provides a simple interface to create and configure file systems quickly, and share common files. It’s shared file storage without the need for a supporting virtual machine, and can be used with traditional protocols that access files over a network.|
| |Archiving and backup|N/A (software) <br/>Glacier and S3 (storage)|Backup (software) <br/>Blob Storage (storage)|Backup and archival solutions allow files and folders to be backed up and recovered from the cloud, and provides off-site protection against data loss. There are two components of backup software service that orchestrates backup/retrieval and the underlying backup storage infrastructure.|
| |Hybrid storage|Storage Gateway|StorSimple|Integrates on-premises IT environments with cloud storage. Automates data management and storage, plus supports in disaster recovery.|
| |Data transport|Import/Export Snowball|Import/Export|A data transport solution that uses secure disks and appliances to transfer large amounts of data. Also offers data protection during transit.|
| |Content delivery|CloudFront|Content Delivery Network|A global content delivery network that delivers audio, video, applications, images, and other files.|
|**Networking**|Networking|Virtual Private Cloud|Virtual Network|Provides an isolated, private environment in the cloud. Users have control over their virtual networking environment, including selection of their own IP address range, creation of subnets, and configuration of route tables and network gateways.|
| |Domain name system (DNS)|Route 53|DNS (Preview) <br/>Traffic Manager|A service that hosts domain names, plus routes users to Internet applications, connects user requests to datacenters, manages traffic to apps, and improves app availability with automatic failover.|
| |Dedicated network|Direct Connect|ExpressRoute|Establishes a dedicated, private network connection from a location to the cloud provider (not over the Internet).|
| |Load balancing|Elastic Load Balancing|Load Balancer <br/>Application Gateway|Automatically distributes incoming application traffic to add scale, handle failover, and route to a collection of resources.|
|**Database**|Relational database|RDS|SQL Database|Relational database-as-a-service (DBaaS) where the database resilience, scale, and maintenance are primarily handled by the platform.|
| |NoSQL database|DynamoDB|DocumentDB|A NoSQL document database service that automatically indexes JSON data for applications that require rich query and multi-document transactions.|
| |Data warehouse|Redshift|SQL Data Warehouse (Preview)|A fully managed data warehouse that analyzes data using business intelligence tools. It can transact SQL queries across relational and non-relational data.|
| |Table storage|DynamoDB <br/>SimpleDB|Table Storage|A non-relational data store for semi-structured data. Developers store and query data items via web services requests.|
| |Caching|ElastiCache|Azure Redis Cache|An in-memory based, distributed caching service that provides a high-performance store typically used to offload non-transactional work from a database.|
| |Database migration|Database Migration Service (Preview)|SQL Database Migration Wizard|Typically is focused on the migration of database schema and data from one database format to a specific database technology in the cloud.|
|**Analytics and big data**|Big data processing|Elastic MapReduce (EMR)|HDInsight|Supports technologies that break up large data processing tasks into multiple jobs, and then combine the results together to enable massive parallelism.|
| |Data orchestration|Data Pipeline|Data Factory|Processes and moves data between different compute and storage services, as well as on-premises data sources at specified intervals. Users can create, schedule, orchestrate, and manage data pipelines.|
| |Analytics|Kinesis Analytics (Preview)|Stream Analytics <br/>Data Lake Analytics (Preview) <br/>Data Lake Store (Preview)|Storage and analysis platforms that creates insights from large quantities of data, or data that originates from many sources.|
| |Visualization|QuickSight (Preview)|PowerBI|Business intelligence tools that build visualizations, perform ad-hoc analysis, and develop business insights from data.|
| |Machine learning|Machine Learning|Machine Learning|Produces an end-to-end workflow to create, process, refine, and publish predictive models that can be used to understand what might happen from complex data sets.|
| |Search|Elasticsearch Service|Search|Delivers full-text search and related search analytics and capabilities.|
| |Data discovery| |Data Catalog (Preview)|Provides the ability to better register, enrich, discover, understand, and consume data sources.|
|**Internet of things (IoT)**|Streaming data|Kinesis Firehose <br/>Kinesis Streams|Event Hubs|Services that allow the mass ingestion of small data inputs, typically from devices and sensors, to process and route the data.|
| |Internet of Things|IoT (Preview)|IoT Hub|Lets connected devices interact with cloud applications and other devices to capture and analyze real-time data.|
|**Mobile services**|Pro app development|Mobile Hub (Beta) <br/>Cognito|Mobile Apps|Backend mobile services for rapid development of mobile solutions, plus provide identity management, data synchronization, and storage and notifications across devices.|
| |High-level app development| |PowerApps|Model-driven application development for business applications with SaaS integration.|
| |Analytics|Mobile Analytics|Mobile Engagement|Provides real-time analytics from mobile apps data, highlights app users’ behavior, measures app usage, and tracks key trends.|
| |Notification|Simple Notification Service|Notification Hubs|A push notification service that delivers messages instantly to applications or users. Messages can be sent to individual devices or can be broadcasted.|
|**Application services**|Email|Simple Email Service ||Lets users send transactional email, marketing messages, or any other type of content to customers.|
| |Messaging|Simple Queue Service|Queue Storage <br/>Service Bus queues <br/>Service Bus topics <br/>Service Bus relay|Stores large numbers of messages that can be accessed from anywhere through authenticated calls using HTTP or HTTPS. A queue can contain millions of messages, up to the total capacity limit of a storage account, and may also support more complex topologies such as publish/subscribe.|
| |Workflow|Simple Workflow Service|Logic Apps|A state tracker and task coordinator service that allows developers to build, run, and scale background activities using a visual processes flow creation.|
| |App testing|Device Farm (Front End)|Xamarin Test Cloud (Front End) <br/>Azure DevTest Labs (Back End)|A range of services geared toward the orchestration of dev/test backend server and service application infrastructure, as well as front end client device and software testing and simulation.|
| |API management|API Gateway|API Management|Allows developers to create, publish, maintain, monitor, and secure APIs. Handles processing concurrent API calls, including traffic management, authorization, access control, monitoring, and API version management.|
| |Application streaming|AppStream|RemoteApp|Streams and delivers existing applications from the cloud to reach more users on more devices—without any code modifications.|
| |Search|CloudSearch|Search|Sets up, manages, and scales a search solution for websites and applications.|
| |Media transcoding|Elastic Transcoder|Encoding|A media transcoding service in the cloud that transcodes media files from their source format into versions that will playback on devices such as smartphones, tablets, and PCs.|
| |Streaming| |Live and on-demand streaming|Delivers content to virtually any device. Offers scalable streaming.|
| |Others| |Media Player <br/>Media Indexer <br/>Content Protection|Additional services related to the playing, protection, and analysis of the content within the media service.|
|**Management and monitoring**|Deployment orchestration|OpsWorks <br/>CloudFormation|Resource Manager <br/>Automation <br/>VM extensions|Configures and operates applications of all shapes and sizes, and provides templates to create and manage a collection of resources.|
| |Management and monitoring|CloudWatch <br/>CloudTrail|Log Analytics <br/>Azure portal <br/>Application Insights|Management and monitoring services for cloud resources and applications to collect, track, store, analyze, and deliver metrics and log files.|
| |Optimization|Trusted Advisor| |Provides analysis of cloud resource configuration and security so subscribers can ensure they’re making use of best practices and optimum configurations.|
| |Job scheduling| |Scheduler|Runs jobs on simple or complex recurring schedules—now, later, or recurring.|
| |Catalog service|Service Catalog| |Creates and manages catalogs of approved IT services so users can quickly find and deploy them.|
| |Administration|Config|Azure portal (audit logs)|Provides resource inventory, configuration history, and configuration change notifications for security and governance.|
| |Programmatic access|Command Line Interface|Azure Command Line Interface (CLI) <br/>Azure PowerShell|Built on top of the native REST API across all cloud services, various programming language-specific wrappers provide easier ways to create solutions.|
|**Security and identity**|Authentication and authorization|Identity and Access Management <br/>Multi-Factor Authentication|Azure AD/Role-based access control <br/>Multi-Factor Authentication|Lets users securely control access to services and resources while offering data security and protection. Create and manage users and groups, and use permissions to allow and deny access to resources.|
| |Encryption|Key Management Service <br/>CloudHSM|Key Vault|Creates, controls, and protects the encryption keys used to encrypt data. HSM provides hardware-based key storage.|
| |Firewall|Web Application Firewall| |A firewall that protects web applications from common web exploits. Users can define customizable web security rules.|
| |Security|Inspector (Preview)|Security Center (Preview)|An automated security assessment service that improves the security and compliance of applications. Automatically assess applications for vulnerabilities or deviations from best practices.|
| |Directory|Directory Service|Azure Active Directory <br/>Azure Active Directory B2C <br/>Azure Active Directory Domain Services|Typically provides user/group properties that can be queried and used in applications. Also can provide capabilities to integrate to on-premises Active Directory services for single sign-on scenarios and SaaS management.|
